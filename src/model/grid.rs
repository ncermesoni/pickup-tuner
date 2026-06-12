/// One logged reading. Peak and RMS are both stored at capture time;
/// which one drives the display is a UI choice. `note` is what the tuner
/// heard during the capture, used to label string columns.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Capture {
    pub peak_db: f32,
    pub rms_db: f32,
    pub clipped: bool,
    pub note: Option<(&'static str, i32)>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Metric {
    Peak,
    Rms,
}

impl Capture {
    pub fn value(&self, metric: Metric) -> f32 {
        match metric {
            Metric::Peak => self.peak_db,
            Metric::Rms => self.rms_db,
        }
    }
}

/// Strings × pickups grid of manually captured readings.
/// Row = pickup, column = string.
pub struct CaptureGrid {
    strings: usize,
    pickups: usize,
    slots: Vec<Option<Capture>>,
}

impl CaptureGrid {
    pub fn new(strings: usize, pickups: usize) -> Self {
        Self {
            strings,
            pickups,
            slots: vec![None; strings * pickups],
        }
    }

    pub fn strings(&self) -> usize {
        self.strings
    }

    pub fn pickups(&self) -> usize {
        self.pickups
    }

    fn index(&self, pickup: usize, string: usize) -> usize {
        debug_assert!(pickup < self.pickups && string < self.strings);
        pickup * self.strings + string
    }

    pub fn slot(&self, pickup: usize, string: usize) -> Option<&Capture> {
        self.slots[self.index(pickup, string)].as_ref()
    }

    pub fn capture(&mut self, pickup: usize, string: usize, capture: Capture) {
        let i = self.index(pickup, string);
        self.slots[i] = Some(capture);
    }

    pub fn clear_slot(&mut self, pickup: usize, string: usize) {
        let i = self.index(pickup, string);
        self.slots[i] = None;
    }

    pub fn clear_all(&mut self) {
        self.slots.fill(None);
    }

    /// Reshape, keeping captures whose position exists in both shapes.
    pub fn resize(&mut self, strings: usize, pickups: usize) {
        let mut next = Self::new(strings, pickups);
        for p in 0..self.pickups.min(pickups) {
            for s in 0..self.strings.min(strings) {
                next.slots[p * strings + s] = self.slots[p * self.strings + s];
            }
        }
        *self = next;
    }

    /// Reference for string-to-string deltas: the median of the captured
    /// strings in the pickup's row. The median frames each delta as a
    /// physical instruction (raise/lower toward the row's middle) and is
    /// robust to one outlier string.
    pub fn row_median(&self, pickup: usize, metric: Metric) -> Option<f32> {
        let mut values: Vec<f32> = (0..self.strings)
            .filter_map(|s| self.slot(pickup, s).map(|c| c.value(metric)))
            .collect();
        if values.is_empty() {
            return None;
        }
        values.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let n = values.len();
        Some(if n % 2 == 1 {
            values[n / 2]
        } else {
            (values[n / 2 - 1] + values[n / 2]) / 2.0
        })
    }

    /// Signed distance from the row median: positive = hotter than the
    /// row's middle (lower the pole), negative = quieter (raise it).
    pub fn delta_db(&self, pickup: usize, string: usize, metric: Metric) -> Option<f32> {
        let value = self.slot(pickup, string)?.value(metric);
        Some(value - self.row_median(pickup, metric)?)
    }

    pub fn row_average(&self, pickup: usize, metric: Metric) -> Option<f32> {
        let values: Vec<f32> = (0..self.strings)
            .filter_map(|s| self.slot(pickup, s).map(|c| c.value(metric)))
            .collect();
        if values.is_empty() {
            None
        } else {
            Some(values.iter().sum::<f32>() / values.len() as f32)
        }
    }

    /// The note label for a string column: the first captured note found,
    /// scanning pickups top to bottom (they should agree across rows).
    pub fn column_note(&self, string: usize) -> Option<(&'static str, i32)> {
        (0..self.pickups).find_map(|p| self.slot(p, string).and_then(|c| c.note))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cap(peak_db: f32, rms_db: f32) -> Capture {
        Capture {
            peak_db,
            rms_db,
            clipped: false,
            note: None,
        }
    }

    #[test]
    fn new_grid_is_empty() {
        let g = CaptureGrid::new(6, 2);
        assert_eq!(g.strings(), 6);
        assert_eq!(g.pickups(), 2);
        assert!(g.slot(0, 0).is_none());
        assert!(g.slot(1, 5).is_none());
    }

    #[test]
    fn capture_stores_and_clear_removes() {
        let mut g = CaptureGrid::new(6, 2);
        g.capture(1, 3, cap(-10.0, -18.0));
        assert_eq!(g.slot(1, 3).unwrap().peak_db, -10.0);
        g.clear_slot(1, 3);
        assert!(g.slot(1, 3).is_none());
    }

    #[test]
    fn resize_preserves_overlapping_slots() {
        let mut g = CaptureGrid::new(6, 2);
        g.capture(0, 0, cap(-10.0, -18.0));
        g.capture(1, 5, cap(-12.0, -20.0));
        g.resize(7, 3);
        assert_eq!(g.strings(), 7);
        assert_eq!(g.pickups(), 3);
        assert_eq!(g.slot(0, 0).unwrap().peak_db, -10.0);
        assert_eq!(g.slot(1, 5).unwrap().peak_db, -12.0);
        assert!(g.slot(2, 0).is_none());
    }

    #[test]
    fn resize_drops_out_of_range_slots() {
        let mut g = CaptureGrid::new(6, 2);
        g.capture(0, 0, cap(-10.0, -18.0));
        g.capture(1, 5, cap(-12.0, -20.0));
        g.resize(4, 1);
        assert_eq!(g.slot(0, 0).unwrap().peak_db, -10.0);
        assert_eq!(g.strings(), 4);
        assert_eq!(g.pickups(), 1);
    }

    #[test]
    fn median_of_odd_count_is_middle_value() {
        let mut g = CaptureGrid::new(3, 1);
        g.capture(0, 0, cap(0.0, -20.0));
        g.capture(0, 1, cap(0.0, -18.0));
        g.capture(0, 2, cap(0.0, -10.0));
        assert!((g.row_median(0, Metric::Rms).unwrap() - (-18.0)).abs() < 1e-6);
    }

    #[test]
    fn median_of_even_count_averages_middle_two() {
        let mut g = CaptureGrid::new(3, 1);
        g.capture(0, 0, cap(0.0, -20.0));
        g.capture(0, 1, cap(0.0, -17.0));
        assert!((g.row_median(0, Metric::Rms).unwrap() - (-18.5)).abs() < 1e-6);
    }

    #[test]
    fn delta_is_signed_distance_from_row_median() {
        let mut g = CaptureGrid::new(3, 1);
        g.capture(0, 0, cap(0.0, -20.0));
        g.capture(0, 1, cap(0.0, -18.0));
        g.capture(0, 2, cap(0.0, -10.0));
        assert!((g.delta_db(0, 0, Metric::Rms).unwrap() - (-2.0)).abs() < 1e-6);
        assert!((g.delta_db(0, 1, Metric::Rms).unwrap() - 0.0).abs() < 1e-6);
        assert!((g.delta_db(0, 2, Metric::Rms).unwrap() - 8.0).abs() < 1e-6);
    }

    #[test]
    fn delta_of_uncaptured_slot_is_none() {
        let mut g = CaptureGrid::new(3, 1);
        g.capture(0, 0, cap(0.0, -20.0));
        assert!(g.delta_db(0, 2, Metric::Rms).is_none());
    }

    #[test]
    fn row_average_ignores_empty_slots() {
        let mut g = CaptureGrid::new(3, 2);
        g.capture(0, 0, cap(-10.0, -20.0));
        g.capture(0, 1, cap(-14.0, -24.0));
        assert!((g.row_average(0, Metric::Rms).unwrap() - (-22.0)).abs() < 1e-6);
        assert!(g.row_average(1, Metric::Rms).is_none());
    }

    #[test]
    fn clear_all_empties_every_slot() {
        let mut g = CaptureGrid::new(2, 2);
        g.capture(0, 0, cap(-1.0, -2.0));
        g.capture(1, 1, cap(-3.0, -4.0));
        g.clear_all();
        assert!(g.slot(0, 0).is_none());
        assert!(g.slot(1, 1).is_none());
    }

    #[test]
    fn clipped_flag_round_trips() {
        let mut g = CaptureGrid::new(1, 1);
        g.capture(
            0,
            0,
            Capture {
                peak_db: -0.1,
                rms_db: -6.0,
                clipped: true,
                note: None,
            },
        );
        assert!(g.slot(0, 0).unwrap().clipped);
    }

    #[test]
    fn column_note_comes_from_first_captured_row() {
        let mut g = CaptureGrid::new(2, 2);
        g.capture(
            1,
            0,
            Capture {
                peak_db: -10.0,
                rms_db: -18.0,
                clipped: false,
                note: Some(("E", 2)),
            },
        );
        assert_eq!(g.column_note(0), Some(("E", 2)));
        assert_eq!(g.column_note(1), None);
    }
}
