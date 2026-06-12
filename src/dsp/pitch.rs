use std::collections::VecDeque;
use std::f32::consts::PI;

/// Windowed-sinc FIR low-pass + downsample. Cutoff sits at 80% of the
/// output Nyquist so guitar fundamentals pass while aliasing is suppressed.
pub struct Decimator {
    factor: usize,
    taps: Vec<f32>,
    delay: VecDeque<f32>,
    count: usize,
}

impl Decimator {
    pub fn new(factor: usize) -> Self {
        const NUM_TAPS: usize = 65;
        // Normalized to the input sample rate.
        let cutoff = 0.5 / factor as f32 * 0.8;
        let mid = (NUM_TAPS - 1) as f32 / 2.0;
        let taps: Vec<f32> = (0..NUM_TAPS)
            .map(|i| {
                let x = i as f32 - mid;
                let sinc = if x == 0.0 {
                    2.0 * cutoff
                } else {
                    (2.0 * PI * cutoff * x).sin() / (PI * x)
                };
                let hamming =
                    0.54 - 0.46 * (2.0 * PI * i as f32 / (NUM_TAPS - 1) as f32).cos();
                sinc * hamming
            })
            .collect();
        Self {
            factor,
            taps,
            delay: VecDeque::from(vec![0.0; NUM_TAPS]),
            count: 0,
        }
    }

    pub fn process(&mut self, input: &[f32], out: &mut Vec<f32>) {
        for &sample in input {
            self.delay.pop_front();
            self.delay.push_back(sample);
            self.count += 1;
            if self.count == self.factor {
                self.count = 0;
                // Symmetric FIR: orientation of the dot product doesn't matter.
                let acc: f32 = self.delay.iter().zip(&self.taps).map(|(d, t)| d * t).sum();
                out.push(acc);
            }
        }
    }
}

/// YIN pitch detection (de Cheveigné & Kawahara 2002): difference function,
/// cumulative-mean normalization, absolute threshold, parabolic interpolation.
pub fn detect_pitch(
    buf: &[f32],
    sample_rate: f32,
    min_hz: f32,
    max_hz: f32,
    threshold: f32,
) -> Option<f32> {
    let tau_min = (sample_rate / max_hz).floor().max(2.0) as usize;
    let tau_max = (sample_rate / min_hz).ceil() as usize;
    let window = buf.len().checked_sub(tau_max)?;
    if window < tau_max {
        return None;
    }

    let mut diff = vec![0.0f64; tau_max + 1];
    for (tau, d) in diff.iter_mut().enumerate().skip(1) {
        let mut sum = 0.0f64;
        for i in 0..window {
            let delta = (buf[i] - buf[i + tau]) as f64;
            sum += delta * delta;
        }
        *d = sum;
    }

    let mut cmndf = vec![1.0f64; tau_max + 1];
    let mut running_sum = 0.0f64;
    for tau in 1..=tau_max {
        running_sum += diff[tau];
        if running_sum > 0.0 {
            cmndf[tau] = diff[tau] * tau as f64 / running_sum;
        }
    }

    let mut tau = tau_min;
    let found = loop {
        if tau > tau_max {
            return None;
        }
        if cmndf[tau] < threshold as f64 {
            // Descend to the local minimum of this dip.
            while tau + 1 <= tau_max && cmndf[tau + 1] < cmndf[tau] {
                tau += 1;
            }
            break tau;
        }
        tau += 1;
    };

    let refined = if found > 1 && found < tau_max {
        let (s0, s1, s2) = (cmndf[found - 1], cmndf[found], cmndf[found + 1]);
        let denom = s0 - 2.0 * s1 + s2;
        if denom.abs() > 1e-12 {
            found as f64 + (s0 - s2) / (2.0 * denom)
        } else {
            found as f64
        }
    } else {
        found as f64
    };

    Some(sample_rate / refined as f32)
}

const NOTE_NAMES: [&str; 12] = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

#[derive(Clone, Copy, Debug)]
pub struct NoteReading {
    pub name: &'static str,
    pub octave: i32,
    pub cents: f32,
    pub frequency: f32,
}

pub fn frequency_to_note(frequency: f32, a4_hz: f32) -> NoteReading {
    let midi = 69.0 + 12.0 * (frequency / a4_hz).log2();
    let nearest = midi.round();
    NoteReading {
        name: NOTE_NAMES[(nearest as i32).rem_euclid(12) as usize],
        octave: (nearest as i32).div_euclid(12) - 1,
        cents: (midi - nearest) * 100.0,
        frequency,
    }
}

const DECIMATION: usize = 4;
// ~170 ms at 12 kHz; with the 25 Hz floor (tau_max = 480) this leaves a
// comfortable correlation window.
const ANALYSIS_LEN: usize = 2048;
const MIN_HZ: f32 = 25.0;
const MAX_HZ: f32 = 1200.0;
const YIN_THRESHOLD: f32 = 0.12;

/// Streaming facade: feed device-rate samples, ask for a note reading.
pub struct Tuner {
    decimator: Decimator,
    decimated_rate: f32,
    buf: VecDeque<f32>,
    scratch: Vec<f32>,
}

impl Tuner {
    pub fn new(device_sample_rate: f32) -> Self {
        Self {
            decimator: Decimator::new(DECIMATION),
            decimated_rate: device_sample_rate / DECIMATION as f32,
            buf: VecDeque::with_capacity(ANALYSIS_LEN),
            scratch: Vec::new(),
        }
    }

    pub fn feed(&mut self, samples: &[f32]) {
        self.scratch.clear();
        self.decimator.process(samples, &mut self.scratch);
        for &s in &self.scratch {
            if self.buf.len() == ANALYSIS_LEN {
                self.buf.pop_front();
            }
            self.buf.push_back(s);
        }
    }

    pub fn detect(&mut self, a4_hz: f32) -> Option<NoteReading> {
        if self.buf.len() < ANALYSIS_LEN {
            return None;
        }
        let contiguous: Vec<f32> = self.buf.iter().copied().collect();
        let freq = detect_pitch(
            &contiguous,
            self.decimated_rate,
            MIN_HZ,
            MAX_HZ,
            YIN_THRESHOLD,
        )?;
        Some(frequency_to_note(freq, a4_hz))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::f32::consts::PI;

    fn sine(freq: f32, sample_rate: f32, seconds: f32) -> Vec<f32> {
        let n = (sample_rate * seconds) as usize;
        (0..n)
            .map(|i| (2.0 * PI * freq * i as f32 / sample_rate).sin())
            .collect()
    }

    fn zero_crossing_freq(signal: &[f32], sample_rate: f32) -> f32 {
        let crossings = signal
            .windows(2)
            .filter(|w| w[0] < 0.0 && w[1] >= 0.0)
            .count();
        crossings as f32 / (signal.len() as f32 / sample_rate)
    }

    fn rms(signal: &[f32]) -> f32 {
        (signal.iter().map(|s| s * s).sum::<f32>() / signal.len() as f32).sqrt()
    }

    #[test]
    fn decimator_produces_quarter_length_output() {
        let mut d = Decimator::new(4);
        let mut out = Vec::new();
        d.process(&sine(220.0, 48_000.0, 1.0), &mut out);
        assert_eq!(out.len(), 12_000);
    }

    #[test]
    fn decimator_preserves_low_frequencies() {
        let mut d = Decimator::new(4);
        let mut out = Vec::new();
        d.process(&sine(220.0, 48_000.0, 1.0), &mut out);
        // Skip the filter warm-up region, then check the tone survived intact.
        let steady = &out[1000..];
        let freq = zero_crossing_freq(steady, 12_000.0);
        assert!((freq - 220.0).abs() < 3.0, "got {freq}");
        let level = rms(steady);
        assert!((level - 0.707).abs() < 0.05, "got {level}");
    }

    #[test]
    fn decimator_rejects_high_frequencies() {
        let mut d = Decimator::new(4);
        let mut out = Vec::new();
        d.process(&sine(10_000.0, 48_000.0, 1.0), &mut out);
        let level = rms(&out[1000..]);
        assert!(level < 0.05, "got {level}");
    }

    fn sawtooth(freq: f32, sample_rate: f32, seconds: f32) -> Vec<f32> {
        let n = (sample_rate * seconds) as usize;
        (0..n)
            .map(|i| {
                let phase = (freq * i as f32 / sample_rate).fract();
                2.0 * phase - 1.0
            })
            .collect()
    }

    #[test]
    fn yin_detects_a440_sine() {
        let buf = sine(440.0, 12_000.0, 0.2);
        let f = detect_pitch(&buf, 12_000.0, 25.0, 1200.0, 0.12).unwrap();
        assert!((f - 440.0).abs() < 1.0, "got {f}");
    }

    #[test]
    fn yin_detects_low_e_sine() {
        let buf = sine(82.41, 12_000.0, 0.3);
        let f = detect_pitch(&buf, 12_000.0, 25.0, 1200.0, 0.12).unwrap();
        assert!((f - 82.41).abs() < 0.5, "got {f}");
    }

    #[test]
    fn yin_handles_harmonic_rich_sawtooth() {
        let buf = sawtooth(110.0, 12_000.0, 0.3);
        let f = detect_pitch(&buf, 12_000.0, 25.0, 1200.0, 0.12).unwrap();
        assert!((f - 110.0).abs() < 1.0, "got {f}");
    }

    #[test]
    fn yin_returns_none_on_silence() {
        let buf = vec![0.0f32; 2400];
        assert!(detect_pitch(&buf, 12_000.0, 25.0, 1200.0, 0.12).is_none());
    }

    #[test]
    fn yin_returns_none_on_noise() {
        // Deterministic LCG noise; no rand dependency.
        let mut state: u32 = 12345;
        let buf: Vec<f32> = (0..2400)
            .map(|_| {
                state = state.wrapping_mul(1664525).wrapping_add(1013904223);
                (state >> 8) as f32 / (1 << 24) as f32 * 2.0 - 1.0
            })
            .collect();
        assert!(detect_pitch(&buf, 12_000.0, 25.0, 1200.0, 0.12).is_none());
    }

    #[test]
    fn note_mapping_a440() {
        let n = frequency_to_note(440.0, 440.0);
        assert_eq!(n.name, "A");
        assert_eq!(n.octave, 4);
        assert!(n.cents.abs() < 0.01);
    }

    #[test]
    fn note_mapping_sharp_a() {
        let n = frequency_to_note(445.0, 440.0);
        assert_eq!(n.name, "A");
        assert!((n.cents - 19.56).abs() < 0.1, "got {}", n.cents);
    }

    #[test]
    fn note_mapping_respects_reference_pitch() {
        let n = frequency_to_note(442.0, 442.0);
        assert_eq!(n.name, "A");
        assert!(n.cents.abs() < 0.01);
    }

    #[test]
    fn note_mapping_low_e() {
        let n = frequency_to_note(82.41, 440.0);
        assert_eq!(n.name, "E");
        assert_eq!(n.octave, 2);
        assert!(n.cents.abs() < 1.0);
    }

    #[test]
    fn tuner_facade_detects_through_decimation() {
        let mut tuner = Tuner::new(48_000.0);
        tuner.feed(&sine(82.41, 48_000.0, 0.5));
        let reading = tuner.detect(440.0).unwrap();
        assert_eq!(reading.name, "E");
        assert_eq!(reading.octave, 2);
        assert!(reading.cents.abs() < 6.0, "got {}", reading.cents);
    }
}
