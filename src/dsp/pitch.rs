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
}
