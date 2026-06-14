//! Chromatic tuner — a centered needle on an ivory dial face. Straight up =
//! in tune; the needle swings left for flat (♭) and right for sharp (♯). A
//! green enamel band sits across the top-center "in tune" zone (±3 cents).
//! The note is a big warm serif. Geometry mirrors the Analog VU `Tuner`.

use crate::dsp::pitch::NoteReading;
use crate::ui::theme;
use eframe::egui;
use egui::Color32;

const IN_TUNE: f32 = 3.0;
const CX: f32 = 100.0;
const CY: f32 = 104.0;
const ARC_R: f32 = 86.0;
const SPAN: f32 = 52.0; // degrees each side of vertical

fn clamp_c(c: f32) -> f32 {
    c.clamp(-50.0, 50.0)
}
fn ang_of(c: f32) -> f32 {
    90.0 - (clamp_c(c) / 50.0) * SPAN // 90° = up = in tune
}
fn polar(deg: f32, r: f32) -> egui::Pos2 {
    let a = deg.to_radians();
    egui::pos2(CX + r * a.cos(), CY - r * a.sin())
}

pub fn tuner_widget(ui: &mut egui::Ui, reading: Option<&NoteReading>) {
    ui.label(theme::section_label("Tuner"));
    ui.add_space(4.0);

    let (rect, _) =
        ui.allocate_exact_size(egui::vec2(ui.available_width(), 196.0), egui::Sense::hover());
    theme::paint_dial_face(&ui.painter().clone(), rect);
    let painter = ui.painter_at(rect);

    let in_tune = reading.is_some_and(|r| r.cents.abs() < IN_TUNE);

    // note (big serif), centered near the top
    let note_color = if reading.is_some() {
        theme::INK_STRONG
    } else {
        theme::INK_FAINT
    };
    let note_text = match reading {
        Some(r) => format!("{}{}", r.name, r.octave),
        None => "—".to_owned(),
    };
    painter.text(
        egui::pos2(rect.center().x, rect.top() + 34.0),
        egui::Align2::CENTER_CENTER,
        note_text,
        theme::display_font(46.0),
        note_color,
    );

    // arc area: map the 200×112 viewBox uniformly, centered, below the note
    let arc_rect = egui::Rect::from_min_max(
        egui::pos2(rect.left(), rect.top() + 56.0),
        egui::pos2(rect.right(), rect.bottom() - 36.0),
    );
    let scale = (arc_rect.width() / 200.0).min(arc_rect.height() / 112.0);
    let ox = arc_rect.center().x - 100.0 * scale;
    let oy = arc_rect.top() + (arc_rect.height() - 112.0 * scale) * 0.5;
    let to_screen = |p: egui::Pos2| egui::pos2(ox + p.x * scale, oy + p.y * scale);
    let s = |w: f32| w * scale;

    let arc = |from: f32, to: f32, r: f32| -> Vec<egui::Pos2> {
        let steps = 40;
        (0..=steps)
            .map(|i| {
                let t = i as f32 / steps as f32;
                to_screen(polar(from + (to - from) * t, r))
            })
            .collect()
    };

    // baseline arc (−50 … +50 cents)
    painter.add(egui::Shape::line(
        arc(ang_of(-50.0), ang_of(50.0), ARC_R),
        egui::Stroke::new(s(2.0), theme::PLATE_EDGE),
    ));
    // in-tune enamel band (±5° band around centre)
    painter.add(egui::Shape::line(
        arc(ang_of(-5.0), ang_of(5.0), ARC_R),
        egui::Stroke::new(s(5.0), theme::OLIVE),
    ));
    // gradation marks
    for m in [-50.0f32, -25.0, 0.0, 25.0, 50.0] {
        let a = ang_of(m);
        painter.line_segment(
            [
                to_screen(polar(a, ARC_R + 2.0)),
                to_screen(polar(a, if m == 0.0 { ARC_R - 11.0 } else { ARC_R - 7.0 })),
            ],
            egui::Stroke::new(s(if m == 0.0 { 1.6 } else { 1.0 }), theme::INK_DIM),
        );
    }
    // ♭ / ♯ labels at the arc ends
    painter.text(
        to_screen(polar(ang_of(-50.0), ARC_R + 12.0)),
        egui::Align2::CENTER_CENTER,
        "\u{266D}",
        theme::display_font(s(15.0).max(12.0)),
        theme::INK_DIM,
    );
    painter.text(
        to_screen(polar(ang_of(50.0), ARC_R + 12.0)),
        egui::Align2::CENTER_CENTER,
        "\u{266F}",
        theme::display_font(s(15.0).max(12.0)),
        theme::INK_DIM,
    );

    // needle
    let hub = to_screen(egui::pos2(CX, CY));
    let cents = reading.map(|r| r.cents).unwrap_or(0.0);
    let tip = to_screen(polar(ang_of(cents), 80.0));
    let needle_color = if in_tune {
        theme::OLIVE_DEEP
    } else {
        theme::INK_STRONG
    };
    painter.line_segment([hub, tip], egui::Stroke::new(s(2.6), needle_color));
    painter.circle(
        hub,
        s(5.5),
        Color32::from_rgb(0x3a, 0x2a, 0x1a),
        egui::Stroke::new(s(1.0), Color32::from_rgb(0x1c, 0x14, 0x0c)),
    );

    // sub-readout
    let sub = match reading {
        Some(r) => format!("{:+} cents · {:.1} Hz", r.cents.round() as i32, r.frequency),
        None => "no signal".to_owned(),
    };
    painter.text(
        egui::pos2(rect.center().x, rect.bottom() - 22.0),
        egui::Align2::CENTER_CENTER,
        sub,
        egui::FontId::monospace(12.0),
        theme::INK_DIM,
    );

    // in-tune lamp — lamp + label centered as one group under the dial
    if in_tune {
        let y = rect.bottom() - 9.0;
        let galley = painter.layout_no_wrap(
            "IN TUNE".to_owned(),
            egui::FontId::proportional(10.0),
            theme::OLIVE_DEEP,
        );
        const LAMP_D: f32 = 7.0;
        const GAP: f32 = 6.0;
        let total = LAMP_D + GAP + galley.size().x;
        let start = rect.center().x - total / 2.0;
        painter.circle_filled(egui::pos2(start + LAMP_D / 2.0, y), 3.5, theme::OLIVE);
        painter.galley(
            egui::pos2(start + LAMP_D + GAP, y - galley.size().y / 2.0),
            galley,
            theme::OLIVE_DEEP,
        );
    }
}
