use std::collections::VecDeque;

pub const DB_FLOOR: f32 = -120.0;
pub const CLIP_THRESHOLD: f32 = 0.999;
const RMS_WINDOW_SECONDS: f32 = 0.3;
const PEAK_RELEASE_DB_PER_SECOND: f32 = 30.0;

pub fn dbfs(amplitude: f32) -> f32 {
    // 1e-6 amplitude is exactly -120 dB, i.e. DB_FLOOR
    if amplitude <= 1e-6 {
        DB_FLOOR
    } else {
        (20.0 * amplitude.log10()).max(DB_FLOOR)
    }
}

/// Per-callback-block measurements, cheap enough for the audio thread.
#[derive(Clone, Copy, Debug, Default)]
pub struct BlockStats {
    pub peak: f32,
    pub sum_squares: f64,
    pub samples: usize,
}

impl BlockStats {
    pub fn from_block(block: &[f32]) -> Self {
        let mut peak = 0.0f32;
        let mut sum_squares = 0.0f64;
        for &s in block {
            peak = peak.max(s.abs());
            sum_squares += (s as f64) * (s as f64);
        }
        Self {
            peak,
            sum_squares,
            samples: block.len(),
        }
    }
}

/// UI-side meter ballistics: sticky peak hold, decaying live peak,
/// clip latch, and RMS over a rolling ~300ms window.
pub struct MeterState {
    pub peak_hold: f32,
    pub peak_live: f32,
    pub clipped: bool,
    sample_rate: f32,
    window_samples: usize,
    window: VecDeque<(f64, usize)>,
    total_sum_squares: f64,
    total_samples: usize,
}

impl MeterState {
    pub fn new(sample_rate: f32) -> Self {
        Self {
            peak_hold: 0.0,
            peak_live: 0.0,
            clipped: false,
            sample_rate,
            window_samples: (RMS_WINDOW_SECONDS * sample_rate) as usize,
            window: VecDeque::new(),
            total_sum_squares: 0.0,
            total_samples: 0,
        }
    }

    pub fn update(&mut self, stats: &BlockStats) {
        if stats.samples == 0 {
            return;
        }
        self.peak_hold = self.peak_hold.max(stats.peak);
        if stats.peak >= CLIP_THRESHOLD {
            self.clipped = true;
        }
        let dt = stats.samples as f32 / self.sample_rate;
        let release = 10f32.powf(-PEAK_RELEASE_DB_PER_SECOND * dt / 20.0);
        self.peak_live = stats.peak.max(self.peak_live * release);

        self.window.push_back((stats.sum_squares, stats.samples));
        self.total_sum_squares += stats.sum_squares;
        self.total_samples += stats.samples;
        while let Some(&(sq, n)) = self.window.front() {
            if self.total_samples - n >= self.window_samples {
                self.total_sum_squares -= sq;
                self.total_samples -= n;
                self.window.pop_front();
            } else {
                break;
            }
        }
    }

    pub fn rms(&self) -> f32 {
        if self.total_samples == 0 {
            0.0
        } else {
            ((self.total_sum_squares / self.total_samples as f64) as f32).sqrt()
        }
    }

    pub fn reset_hold(&mut self) {
        self.peak_hold = 0.0;
        self.clipped = false;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dbfs_of_full_scale_is_zero() {
        assert!((dbfs(1.0) - 0.0).abs() < 1e-4);
    }

    #[test]
    fn dbfs_of_half_is_minus_six() {
        assert!((dbfs(0.5) - (-6.0206)).abs() < 0.01);
    }

    #[test]
    fn dbfs_of_silence_is_floor() {
        assert_eq!(dbfs(0.0), DB_FLOOR);
    }

    #[test]
    fn block_stats_computes_peak_and_sum_squares() {
        let stats = BlockStats::from_block(&[0.0, 0.5, -1.0]);
        assert_eq!(stats.peak, 1.0);
        assert!((stats.sum_squares - 1.25).abs() < 1e-9);
        assert_eq!(stats.samples, 3);
    }

    fn stats(peak: f32, n: usize) -> BlockStats {
        BlockStats {
            peak,
            sum_squares: (peak as f64).powi(2) * n as f64,
            samples: n,
        }
    }

    #[test]
    fn peak_hold_sticks_until_reset() {
        let mut m = MeterState::new(48_000.0);
        m.update(&stats(0.8, 64));
        m.update(&stats(0.1, 64));
        assert_eq!(m.peak_hold, 0.8);
        m.reset_hold();
        assert_eq!(m.peak_hold, 0.0);
    }

    #[test]
    fn clip_latches_at_threshold_and_clears_on_reset() {
        let mut m = MeterState::new(48_000.0);
        m.update(&stats(0.9991, 64));
        m.update(&stats(0.1, 64));
        assert!(m.clipped);
        m.reset_hold();
        assert!(!m.clipped);
    }

    #[test]
    fn rms_over_window_of_constant_signal_matches() {
        let mut m = MeterState::new(48_000.0);
        for _ in 0..300 {
            m.update(&BlockStats {
                peak: 0.5,
                sum_squares: 0.25 * 64.0,
                samples: 64,
            });
        }
        assert!((m.rms() - 0.5).abs() < 1e-3);
    }

    #[test]
    fn rms_window_evicts_old_blocks() {
        let mut m = MeterState::new(48_000.0);
        m.update(&BlockStats {
            peak: 1.0,
            sum_squares: 64.0,
            samples: 64,
        });
        // > 300ms (14400 samples) of silence pushes the burst out of the window
        for _ in 0..300 {
            m.update(&BlockStats {
                peak: 0.0,
                sum_squares: 0.0,
                samples: 64,
            });
        }
        assert!(m.rms() < 1e-3);
    }

    #[test]
    fn peak_live_decays_over_time() {
        let mut m = MeterState::new(48_000.0);
        m.update(&stats(1.0, 4800));
        let after_first = m.peak_live;
        m.update(&stats(0.0, 4800));
        assert!(m.peak_live < after_first);
        assert!(m.peak_live > 0.0);
    }
}
