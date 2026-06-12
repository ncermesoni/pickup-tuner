use crate::dsp::capture::CaptureState;
use crate::model::grid::{CaptureGrid, Metric};
use crate::ui::theme;
use eframe::egui;

/// The amber "getting close" band extends this many times past the
/// user's balance threshold; beyond it the cell goes red.
const AMBER_BAND_FACTOR: f32 = 4.0;

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

fn delta_color(delta: Option<f32>, balance_db: f32) -> egui::Color32 {
    match delta {
        None => theme::EMPTY_BG,
        Some(d) if d.abs() <= balance_db => theme::GREEN_BG,
        Some(d) if d.abs() <= balance_db * AMBER_BAND_FACTOR => theme::AMBER_BG,
        Some(_) => theme::RED_BG,
    }
}

/// "✓" when balanced, otherwise the physical instruction: hotter than the
/// row median means lower the pole piece, quieter means raise it.
fn delta_text(delta: f32, balance_db: f32) -> String {
    if delta.abs() <= balance_db {
        "✓".into()
    } else if delta > 0.0 {
        format!("↓ {:.1}", delta.abs())
    } else {
        format!("↑ {:.1}", delta.abs())
    }
}

fn cell(
    ui: &mut egui::Ui,
    grid: &CaptureGrid,
    pickup: usize,
    string: usize,
    metric: Metric,
    is_selected: bool,
    balance_db: f32,
) -> egui::Response {
    let size = egui::vec2(86.0, 44.0);
    let (rect, response) = ui.allocate_exact_size(size, egui::Sense::click());
    let painter = ui.painter_at(rect);

    let slot = grid.slot(pickup, string);
    let delta = grid.delta_db(pickup, string, metric);
    painter.rect_filled(rect, 4.0, delta_color(delta, balance_db));
    if is_selected {
        painter.rect_stroke(
            rect.shrink(1.0),
            4.0,
            egui::Stroke::new(2.0, theme::FOCUS),
            egui::StrokeKind::Inside,
        );
    }

    match slot {
        Some(capture) => {
            let big = delta.map(|d| delta_text(d, balance_db)).unwrap_or_default();
            painter.text(
                egui::pos2(rect.center().x, rect.top() + 14.0),
                egui::Align2::CENTER_CENTER,
                &big,
                egui::FontId::monospace(15.0),
                theme::TEXT,
            );
            painter.text(
                egui::pos2(rect.center().x, rect.bottom() - 11.0),
                egui::Align2::CENTER_CENTER,
                format!("{:.1} dB", capture.value(metric)),
                egui::FontId::monospace(9.5),
                theme::TEXT_DIM,
            );
            if capture.clipped {
                painter.text(
                    egui::pos2(rect.right() - 8.0, rect.top() + 9.0),
                    egui::Align2::CENTER_CENTER,
                    "⚠",
                    egui::FontId::proportional(11.0),
                    theme::RED,
                );
            }

            let metric_name = match metric {
                Metric::Rms => "RMS",
                Metric::Peak => "peak",
            };
            let mut hover = format!("{:.1} dBFS {metric_name}", capture.value(metric));
            if let Some(d) = delta {
                hover.push_str(&format!(
                    "\n{:+.1} dB vs this pickup's median string",
                    d
                ));
                if d.abs() <= balance_db {
                    hover.push_str("\nbalanced — leave this pole alone");
                } else if d > 0.0 {
                    hover.push_str("\nhotter than the row → lower this pole piece");
                } else {
                    hover.push_str("\nquieter than the row → raise this pole piece");
                }
            }
            if capture.clipped {
                hover.push_str("\n⚠ clipped during capture — re-capture with less gain");
            }
            response.clone().on_hover_text(hover);
        }
        None => {
            painter.text(
                rect.center(),
                egui::Align2::CENTER_CENTER,
                "—",
                egui::FontId::proportional(14.0),
                egui::Color32::from_gray(90),
            );
            response
                .clone()
                .on_hover_text("not captured yet — select, press Space, pluck");
        }
    }

    response
}

pub fn grid_widget(
    ui: &mut egui::Ui,
    grid: &CaptureGrid,
    selected: &mut (usize, usize),
    state: &mut GridUiState,
    capture_state: CaptureState,
    pickup_names: &mut [String],
    balance_db: f32,
) -> GridAction {
    let mut action = GridAction::None;
    let mut strings = grid.strings();
    let mut pickups = grid.pickups();

    ui.horizontal(|ui| {
        ui.label(theme::section_label("Capture grid"));
        ui.selectable_value(&mut state.metric, Metric::Rms, "RMS")
            .on_hover_text("perceived loudness as the note rings — use this for balance");
        ui.selectable_value(&mut state.metric, Metric::Peak, "Peak")
            .on_hover_text("attack transient — spots strings that spike but don't ring");
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
                ui.colored_label(theme::AMBER, "armed — pluck the string…");
            }
            CaptureState::Capturing => {
                ui.colored_label(theme::GREEN, "capturing…");
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

    ui.weak(format!(
        "each cell: distance from that pickup's median string · ↑ raise pole · ↓ lower pole · ✓ balanced (within ±{balance_db:.1} dB)"
    ));
    ui.add_space(4.0);

    egui::Grid::new("capture-grid")
        .spacing(egui::vec2(4.0, 4.0))
        .show(ui, |ui| {
            ui.label(""); // corner
            for s in 0..grid.strings() {
                // Guitarists count strings from high to low: S6 = low E on the left.
                let label = format!("S{}", grid.strings() - s);
                match grid.column_note(s) {
                    Some((name, octave)) => {
                        ui.vertical_centered(|ui| {
                            ui.strong(format!("{name}{octave}"));
                            ui.weak(label);
                        });
                    }
                    None => {
                        ui.vertical_centered(|ui| {
                            ui.strong(label);
                        });
                    }
                }
            }
            ui.end_row();

            for p in 0..grid.pickups() {
                if let Some(name) = pickup_names.get_mut(p) {
                    // add_sized forces the allocation; desired_width alone
                    // gets clamped by the grid cell's available width.
                    ui.add_sized(
                        egui::vec2(100.0, 22.0),
                        egui::TextEdit::singleline(name),
                    );
                } else {
                    ui.strong(format!("P{}", p + 1));
                }
                for s in 0..grid.strings() {
                    if cell(ui, grid, p, s, state.metric, *selected == (p, s), balance_db)
                        .clicked()
                    {
                        *selected = (p, s);
                    }
                }
                ui.end_row();
            }
        });

    // Pickup-to-pickup balance in words: row averages compared to the first
    // named pickup with data.
    let averages: Vec<(usize, f32)> = (0..grid.pickups())
        .filter_map(|p| grid.row_average(p, state.metric).map(|a| (p, a)))
        .collect();
    if averages.len() >= 2 {
        ui.add_space(4.0);
        let (base_p, base_avg) = averages[0];
        let base_name = pickup_names.get(base_p).cloned().unwrap_or_default();
        for &(p, avg) in &averages[1..] {
            let name = pickup_names.get(p).cloned().unwrap_or_default();
            let diff = avg - base_avg;
            let verdict = if diff.abs() <= balance_db {
                "level-matched ✓".to_string()
            } else if diff > 0.0 {
                format!("{diff:+.1} dB hotter — lower it or raise {base_name}")
            } else {
                format!("{:.1} dB quieter — raise it or lower {base_name}", diff)
            };
            ui.label(format!("{name} vs {base_name}: {verdict}"));
        }
    }

    action
}
