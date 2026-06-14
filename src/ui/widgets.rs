//! Faceplate controls painted with the design system's material tokens —
//! raised buttons (top bevel highlight + cast shadow), recessed wells, the
//! boxed ▴/▾ stepper, and the recessed segmented toggle. egui's built-in
//! widgets are flat; these carry the "real gear" depth the Analog VU system
//! specifies (`--shadow-btn`, `--shadow-well`, `--grad-plate`…).

use crate::ui::theme;
use eframe::egui;
use egui::{Color32, Rect, Response, Sense, Stroke, StrokeKind, Ui, Vec2, pos2, vec2};

const RADIUS: f32 = 4.0;

/// A soft cast shadow beneath a raised control.
fn cast_shadow(painter: &egui::Painter, rect: Rect, dy: i8, blur: u8, alpha: u8) {
    let shadow = egui::epaint::Shadow {
        offset: [0, dy],
        blur,
        spread: 0,
        color: Color32::from_black_alpha(alpha),
    };
    painter.add(shadow.as_shape(rect, RADIUS));
}

/// The inset top-edge highlight that makes a cream face look raised.
fn top_bevel(painter: &egui::Painter, rect: Rect, alpha: u8) {
    painter.line_segment(
        [
            pos2(rect.left() + RADIUS, rect.top() + 1.0),
            pos2(rect.right() - RADIUS, rect.top() + 1.0),
        ],
        Stroke::new(1.0, Color32::from_white_alpha(alpha)),
    );
}

/// Paint a raised cream faceplate chip (button/stepper/segment background).
fn raised_face(painter: &egui::Painter, rect: Rect, fill: Color32, enabled: bool) {
    if enabled {
        cast_shadow(painter, rect, 1, 3, 70);
    }
    painter.rect_filled(rect, RADIUS, fill);
    if enabled {
        top_bevel(painter, rect, 130);
    }
    painter.rect_stroke(rect, RADIUS, Stroke::new(1.0, theme::PLATE_EDGE), StrokeKind::Inside);
}

/// Paint a recessed dark-ish track (segmented-toggle / slider groove).
fn recessed(painter: &egui::Painter, rect: Rect, fill: Color32) {
    painter.rect_filled(rect, RADIUS, fill);
    // inner top shadow line
    painter.line_segment(
        [
            pos2(rect.left() + RADIUS, rect.top() + 1.0),
            pos2(rect.right() - RADIUS, rect.top() + 1.0),
        ],
        Stroke::new(1.0, Color32::from_black_alpha(60)),
    );
    painter.rect_stroke(rect, RADIUS, Stroke::new(1.0, theme::PLATE_EDGE), StrokeKind::Inside);
}

fn label_size(ui: &Ui, text: &str, font: &egui::FontId) -> Vec2 {
    ui.fonts(|f| f.layout_no_wrap(text.to_owned(), font.clone(), Color32::PLACEHOLDER))
        .size()
}

/// A raised faceplate button. `min_width` pins the width (e.g. the Arm button);
/// `tone` tints the label for status-bearing actions.
pub fn button(ui: &mut Ui, text: &str, min_width: Option<f32>, tone: Color32) -> Response {
    let font = egui::TextStyle::Button.resolve(ui.style());
    let pad = vec2(12.0, 6.0);
    let lab = label_size(ui, text, &font);
    let w = min_width.unwrap_or(lab.x + 2.0 * pad.x).max(lab.x + 2.0 * pad.x);
    let size = vec2(w, lab.y + 2.0 * pad.y);
    let (rect, resp) = ui.allocate_exact_size(size, Sense::click());
    if !ui.is_rect_visible(rect) {
        return resp;
    }
    let enabled = ui.is_enabled();
    let hovered = resp.hovered() && enabled;
    let pressed = resp.is_pointer_button_down_on() && enabled;
    let face_rect = if pressed {
        rect.translate(vec2(0.0, 0.5))
    } else {
        rect
    };
    let fill = if !enabled {
        theme::CONTROL.gamma_multiply(0.7)
    } else if hovered {
        theme::CONTROL_HOVER
    } else {
        theme::CONTROL
    };
    let painter = ui.painter();
    raised_face(painter, face_rect, fill, enabled && !pressed);
    let color = if enabled { tone } else { theme::INK_FAINT };
    let galley = ui.fonts(|f| f.layout_no_wrap(text.to_owned(), font, Color32::PLACEHOLDER));
    let pos = face_rect.center() - galley.size() * 0.5;
    ui.painter().galley(pos, galley, color);
    resp
}

/// Convenience: a default-tone button that sizes to its label.
pub fn btn(ui: &mut Ui, text: &str) -> Response {
    button(ui, text, None, theme::INK)
}

/// Boxed integer stepper with ▴/▾ nudges — the design's Stepper, replacing the
/// flat DragValue. Returns true if the value changed.
pub fn stepper(ui: &mut Ui, id_salt: &str, value: &mut usize, min: usize, max: usize) -> bool {
    let enabled = ui.is_enabled();
    let h = 24.0;
    let val_w = 30.0;
    let nudge_w = 16.0;
    let (rect, _) = ui.allocate_exact_size(vec2(val_w + nudge_w, h), Sense::hover());
    let mut changed = false;

    let up_rect = Rect::from_min_max(
        pos2(rect.right() - nudge_w, rect.top()),
        pos2(rect.right(), rect.center().y),
    );
    let down_rect = Rect::from_min_max(
        pos2(rect.right() - nudge_w, rect.center().y),
        rect.max,
    );
    let (up, down) = if enabled {
        (
            ui.interact(up_rect, ui.id().with((id_salt, "up")), Sense::click()),
            ui.interact(down_rect, ui.id().with((id_salt, "down")), Sense::click()),
        )
    } else {
        let dummy = ui.interact(rect, ui.id().with((id_salt, "off")), Sense::hover());
        (dummy.clone(), dummy)
    };
    if up.clicked() && *value < max {
        *value += 1;
        changed = true;
    }
    if down.clicked() && *value > min {
        *value -= 1;
        changed = true;
    }

    if ui.is_rect_visible(rect) {
        let painter = ui.painter();
        raised_face(painter, rect, theme::CONTROL, enabled);
        // value
        painter.text(
            pos2(rect.left() + val_w / 2.0, rect.center().y),
            egui::Align2::CENTER_CENTER,
            value.to_string(),
            egui::FontId::monospace(13.0),
            if enabled { theme::INK_STRONG } else { theme::INK_FAINT },
        );
        // divider + nudges
        let bx = rect.right() - nudge_w;
        painter.vline(
            bx,
            (rect.top() + 2.0)..=(rect.bottom() - 2.0),
            Stroke::new(1.0, theme::PLATE_EDGE),
        );
        painter.hline(
            (bx)..=(rect.right()),
            rect.center().y,
            Stroke::new(1.0, theme::PLATE_EDGE),
        );
        let arrow = |painter: &egui::Painter, r: Rect, glyph: &str, hot: bool, can: bool| {
            let c = if enabled && can {
                if hot { theme::INK_STRONG } else { theme::INK_DIM }
            } else {
                theme::INK_FAINT
            };
            if hot && enabled && can {
                painter.rect_filled(r.shrink(1.0), 2.0, theme::CONTROL_HOVER);
            }
            painter.text(r.center(), egui::Align2::CENTER_CENTER, glyph, egui::FontId::proportional(9.0), c);
        };
        arrow(painter, up_rect, "\u{25B4}", up.hovered(), *value < max);
        arrow(painter, down_rect, "\u{25BE}", down.hovered(), *value > min);
    }
    changed
}

/// Recessed segmented toggle with a raised active chip. Returns the newly
/// selected index when the selection changes.
pub fn segmented(ui: &mut Ui, options: &[&str], selected: usize) -> Option<usize> {
    let enabled = ui.is_enabled();
    let font = egui::TextStyle::Button.resolve(ui.style());
    let seg_pad = 13.0;
    let widths: Vec<f32> = options
        .iter()
        .map(|t| label_size(ui, t, &font).x + 2.0 * seg_pad)
        .collect();
    let h = 26.0;
    let total: f32 = widths.iter().sum::<f32>() + 4.0; // 2px inset each side
    let (rect, _) = ui.allocate_exact_size(vec2(total, h), Sense::hover());
    let mut result = None;

    if ui.is_rect_visible(rect) {
        recessed(ui.painter(), rect, Color32::from_rgba_unmultiplied(0x28, 0x1c, 0x0c, 36));
    }
    let mut x = rect.left() + 2.0;
    for (i, (lab, w)) in options.iter().zip(&widths).enumerate() {
        let seg = Rect::from_min_size(pos2(x, rect.top() + 2.0), vec2(*w, h - 4.0));
        let resp = if enabled {
            ui.interact(seg, ui.id().with(("seg", i)), Sense::click())
        } else {
            ui.interact(seg, ui.id().with(("segoff", i)), Sense::hover())
        };
        if resp.clicked() && i != selected {
            result = Some(i);
        }
        if ui.is_rect_visible(rect) {
            let painter = ui.painter();
            let active = i == selected;
            if active {
                raised_face(painter, seg, theme::CONTROL_HOVER, enabled);
            } else if resp.hovered() && enabled {
                painter.rect_filled(seg, RADIUS, Color32::from_white_alpha(40));
            }
            let color = if !enabled {
                theme::INK_FAINT
            } else if active {
                theme::INK_STRONG
            } else {
                theme::INK_DIM
            };
            let galley = ui.fonts(|f| f.layout_no_wrap((*lab).to_owned(), font.clone(), Color32::PLACEHOLDER));
            painter.galley(seg.center() - galley.size() * 0.5, galley, color);
        }
        x += w;
    }
    result
}

/// A raised cream faceplate panel with the inset top-bevel highlight, wrapping
/// a functional block. Returns the closure's value.
pub fn panel<R>(ui: &mut Ui, add_contents: impl FnOnce(&mut Ui) -> R) -> R {
    let inner = theme::faceplate_frame().show(ui, |ui| {
        ui.set_min_width(ui.available_width());
        add_contents(ui)
    });
    let rect = inner.response.rect;
    // inset top-bevel highlight, just inside the panel's top edge
    ui.painter().line_segment(
        [pos2(rect.left() + 8.0, rect.top() + 1.5), pos2(rect.right() - 8.0, rect.top() + 1.5)],
        Stroke::new(1.0, Color32::from_white_alpha(140)),
    );
    inner.inner
}
