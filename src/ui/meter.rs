//! Level meter — a vintage VU needle on an ivory dial face. The dark RMS
//! needle rests on the level; a thinner brass peak-hold needle (ball tip)
//! holds the highest peak. The upper end of the arc is an oxblood "hot" zone
//! where redlining means a hot/clipping signal. Geometry mirrors the
//! Analog VU `Meter` component.

use crate::dsp::levels::{DB_FLOOR, MeterState, dbfs};
use crate::ui::theme;
use eframe::egui;
use egui::Color32;

const MIN: f32 = -60.0;
const HOT_FROM: f32 = -6.0;
// dial geometry, in the design's 200×112 viewBox space
const CX: f32 = 100.0;
const CY: f32 = 104.0;
const R: f32 = 84.0;

fn norm(db: f32) -> f32 {
    ((db - MIN) / -MIN).clamp(0.0, 1.0)
}
fn ang_of(db: f32) -> f32 {
    180.0 * (1.0 - norm(db)) // 180° = left (−60) … 0° = right (0)
}
fn polar(deg: f32, r: f32) -> egui::Pos2 {
    let a = deg.to_radians();
    egui::pos2(CX + r * a.cos(), CY - r * a.sin())
}

fn display_db(db: f32) -> f32 {
    if db <= DB_FLOOR { -99.9 } else { db }
}

pub enum MeterAction {
    None,
    ResetHold,
}

pub fn meter_widget(ui: &mut egui::Ui, meter: &MeterState) -> MeterAction {
    let mut action = MeterAction::None;
    let peak_db = dbfs(meter.peak_live);
    let hold_db = dbfs(meter.peak_hold);
    let rms_db = dbfs(meter.rms());

    // header: section caption + reset-hold action
    ui.horizontal(|ui| {
        ui.label(theme::section_label("Level"));
        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
            if ui.button("Reset hold").clicked() {
                action = MeterAction::ResetHold;
            }
        });
    });

    // mono readout row
    ui.horizontal(|ui| {
        let dim = egui::TextFormat::simple(egui::FontId::monospace(13.0), theme::INK_DIM);
        let strong = egui::TextFormat::simple(egui::FontId::monospace(13.0), theme::INK_STRONG);
        for (lbl, val) in [
            ("peak ", display_db(peak_db)),
            ("hold ", display_db(hold_db)),
            ("rms ", display_db(rms_db)),
        ] {
            let mut job = egui::text::LayoutJob::default();
            job.append(lbl, 0.0, dim.clone());
            job.append(&format!("{val:.1}"), 0.0, strong.clone());
            ui.label(job);
        }
        ui.label(egui::RichText::new("dBFS").monospace().color(theme::INK_DIM));
        if meter.clipped {
            ui.colored_label(theme::OXBLOOD, egui::RichText::new("CLIP").strong());
        }
    });

    ui.add_space(4.0);

    // dial face
    let (rect, _) =
        ui.allocate_exact_size(egui::vec2(ui.available_width(), 120.0), egui::Sense::hover());
    theme::paint_dial_face(&ui.painter().clone(), rect);
    let painter = ui.painter_at(rect);

    // map the 200×112 viewBox uniformly into the dial, centered
    let scale = (rect.width() / 200.0).min(rect.height() / 112.0);
    let ox = rect.center().x - 100.0 * scale;
    let oy = rect.top() + (rect.height() - 112.0 * scale) * 0.5;
    let to_screen = |p: egui::Pos2| egui::pos2(ox + p.x * scale, oy + p.y * scale);
    let s = |w: f32| w * scale;

    let arc = |from: f32, to: f32, r: f32| -> Vec<egui::Pos2> {
        let steps = 48;
        (0..=steps)
            .map(|i| {
                let t = i as f32 / steps as f32;
                to_screen(polar(from + (to - from) * t, r))
            })
            .collect()
    };

    // baseline arc (−60 … 0  ⇒  180° … 0°)
    painter.add(egui::Shape::line(
        arc(180.0, 0.0, R),
        egui::Stroke::new(s(2.0), theme::PLATE_EDGE),
    ));
    // oxblood hot zone
    painter.add(egui::Shape::line(
        arc(ang_of(HOT_FROM), ang_of(0.0), R),
        egui::Stroke::new(s(3.5), theme::OXBLOOD),
    ));

    // labeled scale every 10 dB (the arc is linear in dB, so these are evenly
    // spaced); the 0 mark sits in the oxblood zone
    for v in [-60i32, -50, -40, -30, -20, -10, 0] {
        let a = ang_of(v as f32);
        let hot = v as f32 >= HOT_FROM;
        let color = if hot { theme::OXBLOOD } else { theme::INK_DIM };
        painter.line_segment(
            [to_screen(polar(a, R)), to_screen(polar(a, R - 8.0))],
            egui::Stroke::new(s(1.4), color),
        );
        painter.text(
            to_screen(polar(a, R - 17.0)),
            egui::Align2::CENTER_CENTER,
            v.to_string(),
            egui::FontId::monospace(s(8.5).max(7.5)),
            color,
        );
    }
    // redline tick where the oxblood "hot" zone begins
    let red = ang_of(HOT_FROM);
    painter.line_segment(
        [to_screen(polar(red, R)), to_screen(polar(red, R - 6.0))],
        egui::Stroke::new(s(1.6), theme::OXBLOOD),
    );
    // VU mark (Spectral display family), tucked below the scale
    painter.text(
        to_screen(egui::pos2(100.0, 52.0)),
        egui::Align2::CENTER_CENTER,
        "VU",
        theme::display_font(s(13.0).max(11.0)),
        theme::INK_DIM,
    );

    let hub = to_screen(egui::pos2(CX, CY));

    // peak-hold needle (thinner, brass) — sits behind the RMS needle
    if hold_db > MIN {
        let tip = to_screen(polar(ang_of(hold_db), 72.0));
        painter.line_segment([hub, tip], egui::Stroke::new(s(1.6), theme::BRASS));
        painter.circle(tip, s(2.6), theme::BRASS, egui::Stroke::new(s(0.8), theme::BRASS_DEEP));
    }
    // RMS needle (dark ink)
    let rms_tip = to_screen(polar(ang_of(rms_db), 74.0));
    painter.line_segment([hub, rms_tip], egui::Stroke::new(s(2.4), theme::INK_STRONG));
    // hub cap
    painter.circle(
        hub,
        s(5.5),
        Color32::from_rgb(0x3a, 0x2a, 0x1a),
        egui::Stroke::new(s(1.0), Color32::from_rgb(0x1c, 0x14, 0x0c)),
    );

    action
}
