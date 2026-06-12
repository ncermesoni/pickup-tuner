use crate::dsp::levels::{BlockStats, CLIP_THRESHOLD, dbfs};

/// Pluck level rises well above this; idle noise from a guitar input
/// stays below it.
const ONSET_THRESHOLD_DB: f32 = -45.0;
/// Long enough to cover the attack and early decay that determine how
/// loud a pluck feels, short enough that captures feel instant.
const WINDOW_SECONDS: f32 = 0.5;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CaptureState {
    Idle,
    Armed,
    Capturing,
}

#[derive(Clone, Copy, Debug)]
pub struct CaptureResult {
    pub peak_db: f32,
    pub rms_db: f32,
    pub clipped: bool,
}

/// Armed pluck capture: arm it, and the next signal onset starts a fixed
/// measurement window whose peak/RMS become the captured reading. Decouples
/// "press the key" from "play the note".
pub struct PluckCapture {
    state: CaptureState,
    onset_threshold: f32,
    window_samples: usize,
    peak: f32,
    sum_squares: f64,
    samples: usize,
    clipped: bool,
}

impl PluckCapture {
    pub fn new(sample_rate: f32) -> Self {
        Self {
            state: CaptureState::Idle,
            onset_threshold: 10f32.powf(ONSET_THRESHOLD_DB / 20.0),
            window_samples: (WINDOW_SECONDS * sample_rate) as usize,
            peak: 0.0,
            sum_squares: 0.0,
            samples: 0,
            clipped: false,
        }
    }

    pub fn state(&self) -> CaptureState {
        self.state
    }

    pub fn arm(&mut self) {
        self.state = CaptureState::Armed;
        self.peak = 0.0;
        self.sum_squares = 0.0;
        self.samples = 0;
        self.clipped = false;
    }

    pub fn cancel(&mut self) {
        self.state = CaptureState::Idle;
    }

    /// Feed one block of stats; returns the finished reading once the
    /// measurement window completes.
    pub fn feed(&mut self, stats: &BlockStats) -> Option<CaptureResult> {
        match self.state {
            CaptureState::Idle => None,
            CaptureState::Armed => {
                if stats.peak >= self.onset_threshold {
                    self.state = CaptureState::Capturing;
                    self.accumulate(stats)
                } else {
                    None
                }
            }
            CaptureState::Capturing => self.accumulate(stats),
        }
    }

    fn accumulate(&mut self, stats: &BlockStats) -> Option<CaptureResult> {
        self.peak = self.peak.max(stats.peak);
        self.sum_squares += stats.sum_squares;
        self.samples += stats.samples;
        if stats.peak >= CLIP_THRESHOLD {
            self.clipped = true;
        }
        if self.samples >= self.window_samples {
            self.state = CaptureState::Idle;
            Some(CaptureResult {
                peak_db: dbfs(self.peak),
                rms_db: dbfs(((self.sum_squares / self.samples as f64) as f32).sqrt()),
                clipped: self.clipped,
            })
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dsp::levels::BlockStats;

    fn block(peak: f32, n: usize) -> BlockStats {
        BlockStats {
            peak,
            sum_squares: (peak as f64).powi(2) * n as f64,
            samples: n,
        }
    }

    #[test]
    fn idle_ignores_signal() {
        let mut c = PluckCapture::new(48_000.0);
        assert_eq!(c.state(), CaptureState::Idle);
        assert!(c.feed(&block(0.9, 256)).is_none());
        assert_eq!(c.state(), CaptureState::Idle);
    }

    #[test]
    fn armed_waits_through_silence() {
        let mut c = PluckCapture::new(48_000.0);
        c.arm();
        assert_eq!(c.state(), CaptureState::Armed);
        for _ in 0..100 {
            assert!(c.feed(&block(0.001, 256)).is_none());
        }
        assert_eq!(c.state(), CaptureState::Armed);
    }

    #[test]
    fn onset_starts_capture_and_window_completes() {
        let mut c = PluckCapture::new(48_000.0);
        c.arm();
        assert!(c.feed(&block(0.5, 4800)).is_none()); // onset, 100 ms
        assert_eq!(c.state(), CaptureState::Capturing);
        // 400 ms more fills the 500 ms window
        let mut result = None;
        for _ in 0..4 {
            result = c.feed(&block(0.25, 4800));
        }
        let result = result.expect("window should complete");
        assert_eq!(c.state(), CaptureState::Idle);
        // peak is the attack block
        assert!((result.peak_db - crate::dsp::levels::dbfs(0.5)).abs() < 0.01);
        // rms over the whole window: sqrt((0.25 + 4*0.0625)/5)
        let expected_rms = ((0.25 + 4.0 * 0.0625) / 5.0f32).sqrt();
        assert!(
            (result.rms_db - crate::dsp::levels::dbfs(expected_rms)).abs() < 0.01,
            "got {} expected {}",
            result.rms_db,
            crate::dsp::levels::dbfs(expected_rms)
        );
    }

    #[test]
    fn quiet_blocks_below_threshold_do_not_trigger() {
        let mut c = PluckCapture::new(48_000.0);
        c.arm();
        // -50 dB is below the -45 dB onset threshold
        assert!(c.feed(&block(0.00316, 256)).is_none());
        assert_eq!(c.state(), CaptureState::Armed);
    }

    #[test]
    fn clip_during_window_flags_result() {
        let mut c = PluckCapture::new(48_000.0);
        c.arm();
        c.feed(&block(0.9995, 4800));
        let mut result = None;
        for _ in 0..5 {
            result = c.feed(&block(0.1, 4800));
            if result.is_some() {
                break;
            }
        }
        assert!(result.unwrap().clipped);
    }

    #[test]
    fn cancel_returns_to_idle() {
        let mut c = PluckCapture::new(48_000.0);
        c.arm();
        c.cancel();
        assert_eq!(c.state(), CaptureState::Idle);
        assert!(c.feed(&block(0.9, 256)).is_none());
    }

    #[test]
    fn rearm_during_capture_restarts() {
        let mut c = PluckCapture::new(48_000.0);
        c.arm();
        c.feed(&block(0.9, 4800));
        assert_eq!(c.state(), CaptureState::Capturing);
        c.arm();
        assert_eq!(c.state(), CaptureState::Armed);
    }
}
