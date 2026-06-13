//! Capture grid — enamel chips on the faceplate. Each cell's background is the
//! balance verdict (clear vintage green within ±balance, gold within ~4×,
//! terracotta beyond, dim cream if uncaptured). It shows the physical
//! instruction (✓ / ↓ n / ↑ n) over the absolute dBFS level in dark ink, a
//! brass focus ring when selected, and a ⚠ when the capture clipped.

use crate::dsp::capture::CaptureState;
use crate::model::grid::{CaptureGrid, Metric};
use crate::ui::theme;
use eframe::egui;
use egui::Color32;

/// The "getting close" gold band extends this many times past the user's
/// balance threshold; beyond it the cell goes terracotta.
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

fn heat(delta: Option<f32>, balance_db: f32) -> Color32 {
    match delta {
        None => theme::CELL_EMPTY,
        Some(d) if d.abs() <= balance_db => theme::CELL_BALANCED,
        Some(d) if d.abs() <= balance_db * AMBER_BAND_FACTOR => theme::CELL_CLOSE,
        Some(_) => theme::CELL_OFF,
    }
}

/// "✓" when balanced, otherwise the physical instruction: hotter than the
/// row median means lower the pole piece, quieter means raise it.
fn instruction(delta: f32, balance_db: f32) -> String {
    if delta.abs() <= balance_db {
        "\u{2713}".into() // ✓
    } else if delta > 0.0 {
        format!("\u{2193} {:.1}", delta.abs()) // ↓
    } else {
        format!("\u{2191} {:.1}", delta.abs()) // ↑
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
    let size = egui::vec2(88.0, 44.0);
    let (rect, response) = ui.allocate_exact_size(size, egui::Sense::click());
    let painter = ui.painter_at(rect);

    let slot = grid.slot(pickup, string);
    let delta = grid.delta_db(pickup, string, metric);
    let r = 4.0;
    painter.rect_filled(rect, r, heat(if slot.is_some() { delta } else { None }, balance_db));
    // pressed-enamel chip: a thin dark inset edge
    painter.rect_stroke(
        rect,
        r,
        egui::Stroke::new(1.0, Color32::from_black_alpha(28)),
        egui::StrokeKind::Inside,
    );
    if is_selected {
        painter.rect_stroke(
            rect.shrink(1.0),
            r,
            egui::Stroke::new(2.0, theme::BRASS),
            egui::StrokeKind::Inside,
        );
    }

    match slot {
        Some(capture) => {
            let big = delta.map(|d| instruction(d, balance_db)).unwrap_or_default();
            painter.text(
                egui::pos2(rect.center().x, rect.top() + 15.0),
                egui::Align2::CENTER_CENTER,
                &big,
                egui::FontId::monospace(15.0),
                theme::INK_STRONG,
            );
            painter.text(
                egui::pos2(rect.center().x, rect.bottom() - 11.0),
                egui::Align2::CENTER_CENTER,
                format!("{:.1} dB", capture.value(metric)),
                egui::FontId::monospace(9.5),
                Color32::from_rgba_unmultiplied(0x24, 0x1b, 0x10, 170),
            );
            if capture.clipped {
                painter.text(
                    egui::pos2(rect.right() - 8.0, rect.top() + 9.0),
                    egui::Align2::CENTER_CENTER,
                    "\u{26A0}", // ⚠
                    egui::FontId::proportional(11.0),
                    theme::OXBLOOD,
                );
            }

            let metric_name = match metric {
                Metric::Rms => "RMS",
                Metric::Peak => "peak",
            };
            let mut hover = format!("{:.1} dBFS {metric_name}", capture.value(metric));
            if let Some(d) = delta {
                hover.push_str(&format!("\n{d:+.1} dB vs this pickup's median string"));
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
                "\u{2014}", // —
                egui::FontId::proportional(14.0),
                theme::INK_FAINT,
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

    ui.horizontal_wrapped(|ui| {
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
                lamp(ui, theme::AMBER);
                ui.colored_label(theme::AMBER, "armed — pluck the string…");
            }
            CaptureState::Capturing => {
                lamp(ui, theme::OLIVE);
                ui.colored_label(theme::OLIVE_DEEP, "capturing…");
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

    ui.add_space(2.0);
    ui.label(
        egui::RichText::new(format!(
            "each cell: distance from that pickup's median string · ↑ raise pole · ↓ lower pole · ✓ balanced (within ±{balance_db:.1} dB)"
        ))
        .size(12.0)
        .color(theme::INK_DIM),
    );
    ui.add_space(6.0);

    egui::Grid::new("capture-grid")
        .spacing(egui::vec2(5.0, 5.0))
        .show(ui, |ui| {
            ui.label(""); // corner
            for s in 0..grid.strings() {
                // Guitarists count strings high→low: S6 = low E on the left.
                let label = format!("S{}", grid.strings() - s);
                ui.vertical_centered(|ui| {
                    match grid.column_note(s) {
                        Some((name, octave)) => {
                            ui.label(
                                egui::RichText::new(format!("{name}{octave}"))
                                    .size(14.0)
                                    .strong()
                                    .color(theme::INK),
                            );
                            ui.label(egui::RichText::new(label).size(11.0).color(theme::INK_DIM));
                        }
                        None => {
                            ui.label(
                                egui::RichText::new(label).size(14.0).strong().color(theme::INK),
                            );
                        }
                    }
                });
            }
            ui.end_row();

            for p in 0..grid.pickups() {
                if let Some(name) = pickup_names.get_mut(p) {
                    ui.add_sized(
                        egui::vec2(104.0, 24.0),
                        egui::TextEdit::singleline(name)
                            .text_color(theme::DIAL)
                            .vertical_align(egui::Align::Center),
                    );
                } else {
                    ui.label(egui::RichText::new(format!("P{}", p + 1)).strong().color(theme::INK));
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

    // Pickup-to-pickup balance, in words.
    let averages: Vec<(usize, f32)> = (0..grid.pickups())
        .filter_map(|p| grid.row_average(p, state.metric).map(|a| (p, a)))
        .collect();
    if averages.len() >= 2 {
        ui.add_space(6.0);
        let (base_p, base_avg) = averages[0];
        let base_name = pickup_names.get(base_p).cloned().unwrap_or_default();
        for &(p, avg) in &averages[1..] {
            let name = pickup_names.get(p).cloned().unwrap_or_default();
            let diff = avg - base_avg;
            let (verdict, color) = if diff.abs() <= balance_db {
                ("level-matched ✓".to_string(), theme::OLIVE_DEEP)
            } else if diff > 0.0 {
                (
                    format!("{diff:+.1} dB hotter — lower it or raise {base_name}"),
                    theme::INK_STRONG,
                )
            } else {
                (
                    format!("{diff:.1} dB quieter — raise it or lower {base_name}"),
                    theme::INK_STRONG,
                )
            };
            ui.horizontal(|ui| {
                ui.spacing_mut().item_spacing.x = 0.0;
                ui.label(egui::RichText::new(format!("{name} vs {base_name}: ")).color(theme::INK_DIM));
                ui.label(egui::RichText::new(verdict).color(color));
            });
        }
    }

    action
}

/// A small glowing enamel lamp, used beside live status text.
fn lamp(ui: &mut egui::Ui, color: Color32) {
    let (rect, _) = ui.allocate_exact_size(egui::vec2(9.0, 9.0), egui::Sense::hover());
    ui.painter().circle_filled(rect.center(), 3.5, color);
}
