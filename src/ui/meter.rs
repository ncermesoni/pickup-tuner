use crate::dsp::levels::{DB_FLOOR, MeterState, dbfs};
use crate::ui::theme;
use eframe::egui;

const METER_MIN_DB: f32 = -60.0;
/// Zone boundaries: comfortable / getting hot / clipping territory.
const AMBER_FROM_DB: f32 = -12.0;
const RED_FROM_DB: f32 = -3.0;

fn db_to_norm(db: f32) -> f32 {
    ((db - METER_MIN_DB) / -METER_MIN_DB).clamp(0.0, 1.0)
}

/// Map DB_FLOOR to a readable sentinel instead of -120.0.
fn display_db(db: f32) -> f32 {
    if db <= DB_FLOOR { -99.9 } else { db }
}

fn zone_color(db: f32) -> egui::Color32 {
    if db >= RED_FROM_DB {
        theme::RED
    } else if db >= AMBER_FROM_DB {
        theme::AMBER
    } else {
        theme::GREEN
    }
}

pub enum MeterAction {
    None,
    ResetHold,
}

pub fn meter_widget(ui: &mut egui::Ui, meter: &MeterState) -> MeterAction {
    let mut action = MeterAction::None;
    let peak_live_db = dbfs(meter.peak_live);
    let peak_hold_db = dbfs(meter.peak_hold);
    let rms_db = dbfs(meter.rms());

    ui.horizontal(|ui| {
        ui.label(theme::section_label("Level"));
        ui.monospace(format!("peak {:6.1}", display_db(peak_live_db)));
        ui.monospace(format!("hold {:6.1}", display_db(peak_hold_db)));
        ui.monospace(format!("rms {:6.1} dBFS", display_db(rms_db)));
        if meter.clipped {
            ui.colored_label(theme::RED, egui::RichText::new("CLIP").strong());
        }
        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
            if ui.small_button("Reset hold").clicked() {
                action = MeterAction::ResetHold;
            }
        });
    });

    let desired = egui::vec2(ui.available_width(), 46.0);
    let (rect, _) = ui.allocate_exact_size(desired, egui::Sense::hover());
    let painter = ui.painter_at(rect);
    let bar = egui::Rect::from_min_max(rect.min, egui::pos2(rect.max.x, rect.max.y - 14.0));
    painter.rect_filled(bar, 4.0, egui::Color32::from_rgb(10, 10, 12));

    // Zone track: dim hints of where amber/red territory begins.
    let zones = [
        (METER_MIN_DB, AMBER_FROM_DB, theme::GREEN),
        (AMBER_FROM_DB, RED_FROM_DB, theme::AMBER),
        (RED_FROM_DB, 0.0, theme::RED),
    ];
    for (from, to, color) in zones {
        let x0 = bar.min.x + bar.width() * db_to_norm(from);
        let x1 = bar.min.x + bar.width() * db_to_norm(to);
        painter.rect_filled(
            egui::Rect::from_min_max(
                egui::pos2(x0, bar.bottom() - 3.0),
                egui::pos2(x1, bar.bottom()),
            ),
            0.0,
            color.gamma_multiply(0.35),
        );
    }

    // RMS fill, colored by the zone it sits in.
    let rms_width = bar.width() * db_to_norm(rms_db);
    if rms_width > 0.5 {
        painter.rect_filled(
            egui::Rect::from_min_size(bar.min, egui::vec2(rms_width, bar.height() - 4.0)),
            4.0,
            zone_color(rms_db).gamma_multiply(0.55),
        );
    }
    // Live peak: bright marker in its zone color.
    let peak_x = bar.min.x + bar.width() * db_to_norm(peak_live_db);
    painter.line_segment(
        [
            egui::pos2(peak_x, bar.top() + 2.0),
            egui::pos2(peak_x, bar.bottom() - 4.0),
        ],
        egui::Stroke::new(2.0, zone_color(peak_live_db)),
    );
    // Peak hold: white marker, the number you capture.
    let hold_x = bar.min.x + bar.width() * db_to_norm(peak_hold_db);
    painter.line_segment(
        [
            egui::pos2(hold_x, bar.top()),
            egui::pos2(hold_x, bar.bottom()),
        ],
        egui::Stroke::new(2.0, theme::TEXT),
    );

    // Labeled scale below the bar.
    for tick in (METER_MIN_DB as i32..=0).step_by(10) {
        let tick_x = bar.min.x + bar.width() * db_to_norm(tick as f32);
        painter.line_segment(
            [
                egui::pos2(tick_x, bar.bottom()),
                egui::pos2(tick_x, bar.bottom() + 3.0),
            ],
            egui::Stroke::new(1.0, theme::TEXT_DIM),
        );
        let align = if tick == 0 {
            egui::Align2::RIGHT_TOP
        } else {
            egui::Align2::CENTER_TOP
        };
        painter.text(
            egui::pos2(tick_x, bar.bottom() + 4.0),
            align,
            format!("{tick}"),
            egui::FontId::monospace(9.0),
            theme::TEXT_DIM,
        );
    }

    action
}
