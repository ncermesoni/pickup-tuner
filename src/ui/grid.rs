use crate::dsp::capture::CaptureState;
use crate::model::grid::{CaptureGrid, Metric};
use eframe::egui;

pub enum GridAction {
    None,
    Capture,
    ClearSlot,
    ClearAll,
    Reshape { strings: usize, pickups: usize },
}

pub struct GridUiState {
    pub metric: Metric,
}

impl Default for GridUiState {
    fn default() -> Self {
        Self {
            metric: Metric::Rms,
        }
    }
}

pub fn grid_widget(
    ui: &mut egui::Ui,
    grid: &CaptureGrid,
    selected: &mut (usize, usize),
    state: &mut GridUiState,
    capture_state: CaptureState,
) -> GridAction {
    let mut action = GridAction::None;
    let mut strings = grid.strings();
    let mut pickups = grid.pickups();

    ui.horizontal(|ui| {
        ui.strong("Capture grid");
        ui.selectable_value(&mut state.metric, Metric::Rms, "RMS");
        ui.selectable_value(&mut state.metric, Metric::Peak, "Peak");
        ui.separator();
        ui.label("strings:");
        ui.add(egui::DragValue::new(&mut strings).range(4..=12));
        ui.label("pickups:");
        ui.add(egui::DragValue::new(&mut pickups).range(1..=4));
        if strings != grid.strings() || pickups != grid.pickups() {
            action = GridAction::Reshape { strings, pickups };
        }
        ui.separator();
        let arm_label = match capture_state {
            CaptureState::Idle => "Arm capture (Space)",
            CaptureState::Armed | CaptureState::Capturing => "Cancel (Space/Esc)",
        };
        if ui.button(arm_label).clicked() {
            action = GridAction::Capture;
        }
        match capture_state {
            CaptureState::Armed => {
                ui.colored_label(egui::Color32::YELLOW, "armed — pluck the string…");
            }
            CaptureState::Capturing => {
                ui.colored_label(egui::Color32::from_rgb(80, 220, 120), "capturing…");
            }
            CaptureState::Idle => {}
        }
        if ui.button("Clear slot").clicked() {
            action = GridAction::ClearSlot;
        }
        if ui.button("Clear all").clicked() {
            action = GridAction::ClearAll;
        }
    });

    egui::Grid::new("capture-grid")
        .striped(true)
        .min_col_width(64.0)
        .show(ui, |ui| {
            ui.label(""); // corner
            for s in 0..grid.strings() {
                ui.strong(format!("S{}", s + 1));
            }
            ui.strong("row avg");
            ui.end_row();

            for p in 0..grid.pickups() {
                ui.strong(format!("P{}", p + 1));
                for s in 0..grid.strings() {
                    let is_selected = *selected == (p, s);
                    let text = match grid.slot(p, s) {
                        Some(c) => {
                            let delta = grid.delta_db(p, s, state.metric).unwrap_or(0.0);
                            let warn = if c.clipped { " ⚠" } else { "" };
                            format!("{:.1}\n{:+.1}{}", c.value(state.metric), delta, warn)
                        }
                        None => "—".into(),
                    };
                    if ui.selectable_label(is_selected, text).clicked() {
                        *selected = (p, s);
                    }
                }
                match grid.row_average(p, state.metric) {
                    Some(avg) => ui.label(format!("{avg:.1}")),
                    None => ui.label("—"),
                };
                ui.end_row();
            }
        });

    action
}
