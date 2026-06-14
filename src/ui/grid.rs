//! Capture grid — enamel chips on the faceplate, plus the capture-mode UI.
//!
//! Arming changes *mode*, not *layout*: the toolbar is frozen (the Arm/Cancel
//! button is fixed-width and the live status lives in a reserved-height mode
//! strip), the config controls dim and lock, and the live target cell pulses a
//! brass ring with a ▸ reticle. Captures flash olive as they land. Mirrors the
//! Analog VU capture-mode redesign.

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

/// Per-frame flash overlay for a just-captured cell.
#[derive(Clone, Copy)]
pub struct Flash {
    pub cell: (usize, usize),
    pub alpha: f32,
}

fn heat(delta: Option<f32>, balance_db: f32) -> Color32 {
    match delta {
        None => theme::CELL_EMPTY,
        Some(d) if d.abs() <= balance_db => theme::CELL_BALANCED,
        Some(d) if d.abs() <= balance_db * AMBER_BAND_FACTOR => theme::CELL_CLOSE,
        Some(_) => theme::CELL_OFF,
    }
}

fn instruction(delta: f32, balance_db: f32) -> String {
    if delta.abs() <= balance_db {
        "\u{2713}".into() // ✓
    } else if delta > 0.0 {
        format!("\u{2193} {:.1}", delta.abs()) // ↓
    } else {
        format!("\u{2191} {:.1}", delta.abs()) // ↑
    }
}

#[allow(clippy::too_many_arguments)]
fn cell(
    ui: &mut egui::Ui,
    grid: &CaptureGrid,
    pickup: usize,
    string: usize,
    metric: Metric,
    selected: bool,
    target: bool,
    balance_db: f32,
    flash_alpha: f32,
    time: f64,
) -> egui::Response {
    let size = egui::vec2(88.0, 44.0);
    // a target cell can't be clicked away mid-capture
    let sense = if target {
        egui::Sense::hover()
    } else {
        egui::Sense::click()
    };
    let (rect, response) = ui.allocate_exact_size(size, sense);
    let painter = ui.painter_at(rect);

    let slot = grid.slot(pickup, string);
    let delta = grid.delta_db(pickup, string, metric);
    let r = 4.0;
    painter.rect_filled(rect, r, heat(if slot.is_some() { delta } else { None }, balance_db));
    painter.rect_stroke(
        rect,
        r,
        egui::Stroke::new(1.0, Color32::from_black_alpha(28)),
        egui::StrokeKind::Inside,
    );

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
        None if target => {
            // live, empty target — the ▸ reticle pulses
            let p = 0.45 + 0.55 * (0.5 + 0.5 * (time as f32 * 5.0).sin());
            painter.text(
                rect.center(),
                egui::Align2::CENTER_CENTER,
                "\u{25B8}", // ▸
                egui::FontId::proportional(17.0),
                theme::BRASS_DEEP.gamma_multiply(p),
            );
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

    // olive flash the instant a capture lands
    if flash_alpha > 0.0 {
        painter.rect_filled(rect, r, theme::OLIVE.gamma_multiply(flash_alpha * 0.8));
    }

    // overlays: the live target pulses a brass ring; a resting selection is a
    // steady brass focus ring
    if target {
        let pulse = 0.5 + 0.5 * (time as f32 * 5.0).sin();
        painter.rect_stroke(
            rect.expand(pulse * 3.0),
            r,
            egui::Stroke::new(2.0, theme::BRASS.gamma_multiply(1.0 - pulse)),
            egui::StrokeKind::Outside,
        );
        painter.rect_stroke(
            rect.shrink(1.0),
            r,
            egui::Stroke::new(2.0, theme::BRASS),
            egui::StrokeKind::Inside,
        );
    } else if selected {
        painter.rect_stroke(
            rect.shrink(1.0),
            r,
            egui::Stroke::new(2.0, theme::BRASS),
            egui::StrokeKind::Inside,
        );
    }

    response
}

/// The reserved-height capture-mode strip below the toolbar. Always drawn (so
/// the grid never shifts); its content reflects idle / armed / capturing /
/// row-complete state.
#[allow(clippy::too_many_arguments)]
fn mode_strip(
    ui: &mut egui::Ui,
    capture_state: CaptureState,
    settling: bool,
    target: (usize, usize),
    strings: usize,
    grid: &CaptureGrid,
    pickup_names: &[String],
    row_done: bool,
) {
    let (p, s) = target;
    let col = format!("S{}", strings - s);
    let note = grid
        .column_note(s)
        .map(|(n, o)| format!("{n}{o}"))
        .unwrap_or_default();
    let pickup = pickup_names.get(p).cloned().unwrap_or_default();

    let (fill, stroke) = match capture_state {
        CaptureState::Armed => (
            Color32::from_rgba_unmultiplied(0xd6, 0xa2, 0x4e, 40),
            egui::Stroke::new(1.0, theme::AMBER.gamma_multiply(0.6)),
        ),
        CaptureState::Capturing => (
            Color32::from_rgba_unmultiplied(0x6a, 0xa0, 0x43, 46),
            egui::Stroke::new(1.0, theme::OLIVE.gamma_multiply(0.6)),
        ),
        CaptureState::Idle if row_done => (
            Color32::from_rgba_unmultiplied(0x6a, 0xa0, 0x43, 36),
            egui::Stroke::new(1.0, theme::OLIVE.gamma_multiply(0.45)),
        ),
        CaptureState::Idle => (Color32::TRANSPARENT, egui::Stroke::new(1.0, theme::PLATE_EDGE)),
    };

    egui::Frame::new()
        .fill(fill)
        .stroke(stroke)
        .corner_radius(4.0)
        .inner_margin(egui::Margin::symmetric(12, 6))
        .show(ui, |ui| {
            ui.set_min_height(22.0);
            ui.set_width(ui.available_width());
            ui.horizontal(|ui| {
                ui.spacing_mut().item_spacing.x = 6.0;
                let time = ui.input(|i| i.time);
                let pulse = 0.5 + 0.5 * (time as f32 * 5.0).sin();
                let lamp = |ui: &mut egui::Ui, c: Color32| {
                    let (rc, _) = ui.allocate_exact_size(egui::vec2(9.0, 9.0), egui::Sense::hover());
                    ui.painter()
                        .circle_filled(rc.center(), 3.5, c.gamma_multiply(0.55 + 0.45 * pulse));
                };
                match capture_state {
                    CaptureState::Armed if settling => {
                        lamp(ui, theme::AMBER);
                        ui.label(theme::section_label("Waiting"));
                        ui.label(
                            egui::RichText::new("let the previous string ring out…")
                                .color(theme::INK_STRONG),
                        );
                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            ui.label(
                                egui::RichText::new("Space/Esc to cancel")
                                    .size(12.0)
                                    .color(theme::INK_DIM),
                            );
                        });
                    }
                    CaptureState::Armed => {
                        lamp(ui, theme::AMBER);
                        ui.label(theme::section_label("Armed"));
                        let mut t = format!("pluck {col}");
                        if !note.is_empty() {
                            t.push_str(&format!(" · {note}"));
                        }
                        t.push_str(&format!(" on {pickup}"));
                        ui.label(egui::RichText::new(t).color(theme::INK_STRONG));
                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            ui.label(
                                egui::RichText::new("auto-captures on transient · Space/Esc to cancel")
                                    .size(12.0)
                                    .color(theme::INK_DIM),
                            );
                        });
                    }
                    CaptureState::Capturing => {
                        lamp(ui, theme::OLIVE);
                        ui.label(theme::section_label("Capturing"));
                        let mut t = col.clone();
                        if !note.is_empty() {
                            t.push_str(&format!(" · {note}"));
                        }
                        t.push_str(" — hold the note…");
                        ui.label(egui::RichText::new(t).color(theme::INK_STRONG));
                    }
                    CaptureState::Idle if row_done => {
                        ui.label(egui::RichText::new("\u{2713}").color(theme::OLIVE_DEEP));
                        ui.label(
                            egui::RichText::new(format!(
                                "row complete — flip your guitar's pickup selector to {pickup}, then arm again"
                            ))
                            .color(theme::INK_STRONG),
                        );
                    }
                    CaptureState::Idle => {
                        ui.label(
                            egui::RichText::new(
                                "ready — select a cell, press Space to arm, then pluck each string in turn",
                            )
                            .size(12.0)
                            .color(theme::INK_DIM),
                        );
                    }
                }
            });
        });
}

#[allow(clippy::too_many_arguments)]
pub fn grid_widget(
    ui: &mut egui::Ui,
    grid: &CaptureGrid,
    selected: &mut (usize, usize),
    state: &mut GridUiState,
    capture_state: CaptureState,
    settling: bool,
    pickup_names: &mut [String],
    balance_db: f32,
    continuous: &mut bool,
    flash: Option<Flash>,
    row_done: bool,
) -> GridAction {
    let mut action = GridAction::None;
    let armed = !matches!(capture_state, CaptureState::Idle);
    let mut strings = grid.strings();
    let mut pickups = grid.pickups();
    let time = ui.input(|i| i.time);

    // ---- header: title on its own row, then a frozen control bar ----
    ui.label(theme::section_label("Capture grid"));
    ui.add_space(7.0);
    ui.horizontal(|ui| {
        // left: view/config controls — dim + lock while armed
        ui.add_enabled_ui(!armed, |ui| {
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
        });

        // right: the capture action group (Arm + its continuous option),
        // then the destructive clear buttons — laid out from the right edge.
        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
            ui.add_enabled_ui(!armed, |ui| {
                if ui.button("Clear all").clicked() {
                    action = GridAction::ClearAll;
                }
                if ui.button("Clear slot").clicked() {
                    action = GridAction::ClearSlot;
                }
            });
            ui.separator();
            ui.add_enabled_ui(!armed, |ui| {
                ui.checkbox(continuous, "continuous").on_hover_text(
                    "after each capture, auto-arm the next string in the row · stops at the row's end (flip your pickup selector and arm again)",
                );
            });
            // Snug, stable width: fits the wider of the two labels so the
            // button neither stretches nor jiggles when it flips to Cancel.
            let font = egui::TextStyle::Button.resolve(ui.style());
            let label_w = |t: &str| {
                ui.fonts(|f| f.layout_no_wrap(t.to_owned(), font.clone(), theme::INK))
                    .size()
                    .x
            };
            let arm_w = label_w("Arm capture (Space)").max(label_w("Cancel (Space/Esc)"))
                + 2.0 * ui.spacing().button_padding.x
                + 6.0;
            let arm_label = if armed {
                "Cancel (Space/Esc)"
            } else {
                "Arm capture (Space)"
            };
            if ui
                .add_sized([arm_w, 26.0], egui::Button::new(arm_label))
                .clicked()
            {
                action = GridAction::Capture;
            }
        });
    });

    ui.add_space(6.0);
    mode_strip(ui, capture_state, settling, *selected, strings, grid, pickup_names, row_done);
    ui.add_space(6.0);

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
                let label = format!("S{}", grid.strings() - s);
                ui.vertical_centered(|ui| match grid.column_note(s) {
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
                        ui.label(egui::RichText::new(label).size(14.0).strong().color(theme::INK));
                    }
                });
            }
            ui.end_row();

            for p in 0..grid.pickups() {
                // active pickup row gets a brass dot while armed
                ui.horizontal(|ui| {
                    ui.spacing_mut().item_spacing.x = 5.0;
                    if armed && selected.0 == p {
                        let (rc, _) = ui.allocate_exact_size(egui::vec2(8.0, 8.0), egui::Sense::hover());
                        ui.painter().circle_filled(rc.center(), 3.5, theme::BRASS);
                    }
                    if let Some(name) = pickup_names.get_mut(p) {
                        ui.add_sized(
                            egui::vec2(96.0, 24.0),
                            egui::TextEdit::singleline(name).vertical_align(egui::Align::Center),
                        );
                    } else {
                        ui.label(egui::RichText::new(format!("P{}", p + 1)).strong().color(theme::INK));
                    }
                });
                for s in 0..grid.strings() {
                    let is_target = armed && *selected == (p, s);
                    let is_selected = !armed && *selected == (p, s);
                    let flash_alpha = match flash {
                        Some(f) if f.cell == (p, s) => f.alpha,
                        _ => 0.0,
                    };
                    let resp = cell(
                        ui, grid, p, s, state.metric, is_selected, is_target, balance_db,
                        flash_alpha, time,
                    );
                    if resp.clicked() {
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
