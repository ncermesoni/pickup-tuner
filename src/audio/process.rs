/// Copy the selected input channel to an output channel with gain.
/// Runs on the audio thread: no allocation, no branching beyond the zip.
pub fn copy_monitor(input: &[f32], output: &mut [f32], gain: f32) {
    for (o, &i) in output.iter_mut().zip(input) {
        *o = i * gain;
    }
}

pub fn db_to_linear(db: f32) -> f32 {
    if db == f32::NEG_INFINITY {
        0.0
    } else {
        10f32.powf(db / 20.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn monitor_copy_applies_gain() {
        let input = [0.5f32, -0.5, 1.0];
        let mut out = [0.0f32; 3];
        copy_monitor(&input, &mut out, 0.5);
        assert_eq!(out, [0.25, -0.25, 0.5]);
    }

    #[test]
    fn monitor_copy_handles_length_mismatch() {
        let input = [1.0f32, 1.0];
        let mut out = [0.0f32; 4];
        copy_monitor(&input, &mut out, 1.0);
        assert_eq!(out, [1.0, 1.0, 0.0, 0.0]);
    }

    #[test]
    fn gain_db_to_linear_round_trip() {
        assert!((db_to_linear(0.0) - 1.0).abs() < 1e-6);
        assert!((db_to_linear(-6.0206) - 0.5).abs() < 1e-4);
        assert_eq!(db_to_linear(f32::NEG_INFINITY), 0.0);
    }
}
