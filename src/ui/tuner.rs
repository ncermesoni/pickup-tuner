use crate::dsp::pitch::NoteReading;
use eframe::egui;

const IN_TUNE_CENTS: f32 = 3.0;

pub fn tuner_widget(ui: &mut egui::Ui, reading: Option<&NoteReading>) {
    let desired = egui::vec2(ui.available_width(), 110.0);
    let (rect, _) = ui.allocate_exact_size(desired, egui::Sense::hover());
    let painter = ui.painter_at(rect);
    painter.rect_filled(rect, 6.0, egui::Color32::from_gray(20));

    let center_x = rect.center().x;
    // Center reference line
    painter.line_segment(
        [
            egui::pos2(center_x, rect.bottom() - 34.0),
            egui::pos2(center_x, rect.bottom() - 4.0),
        ],
        egui::Stroke::new(1.0, egui::Color32::from_gray(110)),
    );

    match reading {
        Some(r) => {
            let in_tune = r.cents.abs() < IN_TUNE_CENTS;
            let color = if in_tune {
                egui::Color32::from_rgb(80, 220, 120)
            } else {
                egui::Color32::WHITE
            };
            painter.text(
                egui::pos2(center_x, rect.top() + 28.0),
                egui::Align2::CENTER_CENTER,
                format!("{}{}", r.name, r.octave),
                egui::FontId::proportional(36.0),
                color,
            );
            painter.text(
                egui::pos2(center_x, rect.top() + 56.0),
                egui::Align2::CENTER_CENTER,
                format!("{:+.0} cents · {:.1} Hz", r.cents, r.frequency),
                egui::FontId::proportional(13.0),
                egui::Color32::from_gray(160),
            );
            let needle_x =
                center_x + (r.cents.clamp(-50.0, 50.0) / 50.0) * (rect.width() / 2.0 - 16.0);
            painter.line_segment(
                [
                    egui::pos2(needle_x, rect.bottom() - 30.0),
                    egui::pos2(needle_x, rect.bottom() - 6.0),
                ],
                egui::Stroke::new(3.0, color),
            );
        }
        None => {
            painter.text(
                rect.center(),
                egui::Align2::CENTER_CENTER,
                "—",
                egui::FontId::proportional(36.0),
                egui::Color32::from_gray(70),
            );
        }
    }
}
