use crate::dsp::levels::{DB_FLOOR, MeterState, dbfs};
use eframe::egui;

const METER_MIN_DB: f32 = -60.0;

fn db_to_norm(db: f32) -> f32 {
    ((db - METER_MIN_DB) / -METER_MIN_DB).clamp(0.0, 1.0)
}

/// Map DB_FLOOR to a readable sentinel instead of -120.0.
fn display_db(db: f32) -> f32 {
    if db <= DB_FLOOR { -99.9 } else { db }
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
        ui.strong("Level");
        ui.monospace(format!("peak {:6.1} dB", display_db(peak_live_db)));
        ui.monospace(format!("hold {:6.1} dB", display_db(peak_hold_db)));
        ui.monospace(format!("rms {:6.1} dB", display_db(rms_db)));
        if meter.clipped {
            ui.colored_label(egui::Color32::RED, "CLIP");
        }
        if ui.button("Reset hold").clicked() {
            action = MeterAction::ResetHold;
        }
    });

    let desired = egui::vec2(ui.available_width(), 40.0);
    let (rect, _) = ui.allocate_exact_size(desired, egui::Sense::hover());
    let painter = ui.painter_at(rect);
    painter.rect_filled(rect, 4.0, egui::Color32::from_gray(25));

    // RMS as a filled bar
    let rms_width = rect.width() * db_to_norm(rms_db);
    painter.rect_filled(
        egui::Rect::from_min_size(rect.min, egui::vec2(rms_width, rect.height())),
        4.0,
        egui::Color32::from_rgb(70, 150, 240),
    );
    // Live peak as a bright marker line
    let peak_x = rect.min.x + rect.width() * db_to_norm(peak_live_db);
    painter.line_segment(
        [
            egui::pos2(peak_x, rect.top()),
            egui::pos2(peak_x, rect.bottom()),
        ],
        egui::Stroke::new(2.0, egui::Color32::WHITE),
    );
    // Peak hold as a red marker line
    let hold_x = rect.min.x + rect.width() * db_to_norm(peak_hold_db);
    painter.line_segment(
        [
            egui::pos2(hold_x, rect.top()),
            egui::pos2(hold_x, rect.bottom()),
        ],
        egui::Stroke::new(2.0, egui::Color32::from_rgb(240, 80, 80)),
    );
    // Scale ticks every 10 dB
    for tick in (METER_MIN_DB as i32..=0).step_by(10) {
        let tick_x = rect.min.x + rect.width() * db_to_norm(tick as f32);
        painter.line_segment(
            [
                egui::pos2(tick_x, rect.bottom() - 6.0),
                egui::pos2(tick_x, rect.bottom()),
            ],
            egui::Stroke::new(1.0, egui::Color32::from_gray(90)),
        );
    }

    action
}
