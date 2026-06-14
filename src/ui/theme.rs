//! Visual identity: **Analog VU** — a vintage outboard / amplifier faceplate.
//! A dark tweed chassis frames warm cream faceplate panels and ivory dial
//! faces; real analog instruments (a dual-needle VU for level, a centered
//! needle for tuning). Color carries meaning on the meters and grid
//! (olive = balanced / in tune, amber = armed / caution, oxblood = hot / clip,
//! brass = selection / hardware); everything else is material.
//!
//! Tokens mirror the `pickup-tuner-design` skill (Analog VU direction).

use eframe::egui;
use egui::Color32;

// --- Chassis (the dark tweed cabinet behind everything) --------------------
pub const CHASSIS: Color32 = Color32::from_rgb(0x1a, 0x12, 0x0b);
pub const CHASSIS_2: Color32 = Color32::from_rgb(0x24, 0x1a, 0x12);
pub const CHASSIS_3: Color32 = Color32::from_rgb(0x2e, 0x22, 0x18);
pub const CHASSIS_LINE: Color32 = Color32::from_rgb(0x0d, 0x09, 0x07);

// --- Faceplate (the cream control panels) ----------------------------------
pub const PLATE: Color32 = Color32::from_rgb(0xef, 0xe4, 0xca);
pub const PLATE_2: Color32 = Color32::from_rgb(0xe0, 0xd2, 0xb0);
pub const PLATE_EDGE: Color32 = Color32::from_rgb(0xc9, 0xbb, 0x98);

// --- Dial faces (ivory instrument windows: VU & tuner) ---------------------
pub const DIAL: Color32 = Color32::from_rgb(0xf6, 0xee, 0xd8);
pub const DIAL_2: Color32 = Color32::from_rgb(0xe9, 0xdc, 0xbb);
pub const DIAL_EDGE: Color32 = Color32::from_rgb(0xca, 0xbd, 0x9a);
pub const WELL: Color32 = Color32::from_rgb(0x1c, 0x14, 0x0d);

// --- Ink (text on cream) ---------------------------------------------------
pub const INK: Color32 = Color32::from_rgb(0x2c, 0x21, 0x14);
pub const INK_STRONG: Color32 = Color32::from_rgb(0x24, 0x1b, 0x10);
pub const INK_DIM: Color32 = Color32::from_rgb(0x8a, 0x7a, 0x56);
pub const INK_FAINT: Color32 = Color32::from_rgb(0xb1, 0xa0, 0x79);

// --- Lettering on the dark chassis -----------------------------------------
pub const CHASSIS_INK: Color32 = Color32::from_rgb(0xe8, 0xdc, 0xc0);
pub const CHASSIS_DIM: Color32 = Color32::from_rgb(0x9a, 0x87, 0x63);

// --- Metallic / enamel accents (the only chromatic voices) -----------------
pub const BRASS: Color32 = Color32::from_rgb(0xca, 0xa2, 0x4a);
pub const BRASS_DEEP: Color32 = Color32::from_rgb(0x6e, 0x5d, 0x34);
pub const OLIVE: Color32 = Color32::from_rgb(0x6a, 0xa0, 0x43);
pub const OLIVE_DEEP: Color32 = Color32::from_rgb(0x3f, 0x7a, 0x32);
pub const OXBLOOD: Color32 = Color32::from_rgb(0xb0, 0x39, 0x2c);
pub const AMBER: Color32 = Color32::from_rgb(0xd6, 0xa2, 0x4e);

// --- Heatmap cell enamels (vivid; dark ink reads on top) -------------------
pub const CELL_BALANCED: Color32 = Color32::from_rgb(0x8a, 0xa8, 0x57);
pub const CELL_CLOSE: Color32 = Color32::from_rgb(0xe2, 0xb5, 0x4c);
pub const CELL_OFF: Color32 = Color32::from_rgb(0xc8, 0x69, 0x4f);
pub const CELL_EMPTY: Color32 = Color32::from_rgb(0xde, 0xd0, 0xad);

// --- Control faces ---------------------------------------------------------
pub const CONTROL: Color32 = Color32::from_rgb(0xe7, 0xd9, 0xb9);
pub const CONTROL_HOVER: Color32 = Color32::from_rgb(0xf1, 0xe6, 0xcb);
/// Recessed input/value face. A touch darker than the plate so fields read as
/// inset, but still light enough that dark ink stays high-contrast — the
/// "values are dark ink on cream, never amber on a dark well" contrast rule.
pub const FIELD_BG: Color32 = Color32::from_rgb(0xd9, 0xc9, 0xa6);

/// Spectral display family (the big tuner note + the "VU" mark only).
pub fn display_family() -> egui::FontFamily {
    egui::FontFamily::Name("display".into())
}

pub fn display_font(size: f32) -> egui::FontId {
    egui::FontId::new(size, display_family())
}

fn lerp(a: Color32, b: Color32, t: f32) -> Color32 {
    let t = t.clamp(0.0, 1.0);
    let f = |x: u8, y: u8| (x as f32 + (y as f32 - x as f32) * t).round() as u8;
    Color32::from_rgb(f(a.r(), b.r()), f(a.g(), b.g()), f(a.b(), b.b()))
}

/// Paint the dark tweed cabinet — a radial gradient lit from the upper-left,
/// fading to deep shadow at the edges. This is the app background.
pub fn paint_chassis(painter: &egui::Painter, rect: egui::Rect) {
    let focal = egui::pos2(rect.left() + rect.width() * 0.3, rect.top());
    let max_d = (rect.width().max(rect.height())) * 1.05;
    let (nx, ny) = (18usize, 12usize);
    let mut mesh = egui::Mesh::default();
    for j in 0..=ny {
        for i in 0..=nx {
            let x = rect.left() + rect.width() * (i as f32 / nx as f32);
            let y = rect.top() + rect.height() * (j as f32 / ny as f32);
            let d = (egui::pos2(x, y) - focal).length() / max_d;
            mesh.colored_vertex(egui::pos2(x, y), lerp(CHASSIS_3, CHASSIS, d));
        }
    }
    let stride = (nx + 1) as u32;
    for j in 0..ny as u32 {
        for i in 0..nx as u32 {
            let a = j * stride + i;
            mesh.add_triangle(a, a + 1, a + stride);
            mesh.add_triangle(a + 1, a + stride + 1, a + stride);
        }
    }
    painter.add(egui::Shape::mesh(mesh));
}

/// Paint a recessed ivory dial face: ivory fill, a machined bezel, an inner
/// top highlight and a soft bottom vignette — the look of glass over a printed
/// scale. Returns the inner rect callers draw their instrument into.
pub fn paint_dial_face(painter: &egui::Painter, rect: egui::Rect) {
    let r = 6.0;
    painter.rect_filled(rect, r, DIAL);
    // bottom vignette
    let vign = egui::Rect::from_min_max(
        egui::pos2(rect.left(), rect.bottom() - rect.height() * 0.45),
        rect.max,
    );
    let mut mesh = egui::Mesh::default();
    let top = Color32::TRANSPARENT;
    let bot = Color32::from_rgba_unmultiplied(0x78, 0x60, 0x28, 22);
    mesh.colored_vertex(vign.left_top(), top);
    mesh.colored_vertex(vign.right_top(), top);
    mesh.colored_vertex(vign.left_bottom(), bot);
    mesh.colored_vertex(vign.right_bottom(), bot);
    mesh.add_triangle(0, 1, 2);
    mesh.add_triangle(1, 3, 2);
    painter.add(egui::Shape::mesh(mesh));
    // inner top highlight + bezel
    painter.line_segment(
        [
            egui::pos2(rect.left() + r, rect.top() + 1.0),
            egui::pos2(rect.right() - r, rect.top() + 1.0),
        ],
        egui::Stroke::new(1.0, Color32::from_rgba_unmultiplied(255, 255, 255, 150)),
    );
    painter.rect_stroke(
        rect,
        r,
        egui::Stroke::new(1.0, DIAL_EDGE),
        egui::StrokeKind::Inside,
    );
}

/// A raised cream faceplate panel — wraps every functional block.
pub fn faceplate_frame() -> egui::Frame {
    egui::Frame::new()
        .fill(PLATE)
        .stroke(egui::Stroke::new(1.0, PLATE_EDGE))
        .corner_radius(6.0)
        .inner_margin(egui::Margin::same(13))
        .shadow(egui::epaint::Shadow {
            offset: [0, 2],
            blur: 6,
            spread: 0,
            color: Color32::from_black_alpha(90),
        })
}

/// Spaced-uppercase engraved caption (Oswald) in dim ink — silkscreen on a
/// panel. egui has no letter-spacing, so spaced uppercase stands in.
pub fn section_label(text: &str) -> egui::RichText {
    let spaced: String = text
        .to_uppercase()
        .chars()
        .flat_map(|c| [c, '\u{2009}'])
        .collect();
    egui::RichText::new(spaced.trim_end())
        .size(11.0)
        .strong()
        .color(INK_DIM)
}

fn load_fonts(ctx: &egui::Context) {
    let mut fonts = egui::FontDefinitions::default();

    fonts.font_data.insert(
        "Oswald".to_owned(),
        egui::FontData::from_static(include_bytes!("../../assets/fonts/Oswald-Variable.ttf")).into(),
    );
    fonts.font_data.insert(
        "JetBrains Mono".to_owned(),
        egui::FontData::from_static(include_bytes!(
            "../../assets/fonts/JetBrainsMono-Variable.ttf"
        ))
        .into(),
    );
    fonts.font_data.insert(
        "Spectral".to_owned(),
        egui::FontData::from_static(include_bytes!("../../assets/fonts/Spectral-SemiBold.ttf"))
            .into(),
    );
    // Segoe UI Symbol carries the glyph vocabulary (✓ ↑ ↓ ♭ ♯ ⚠ — ▾ ·) that
    // the brand faces don't include.
    if let Ok(bytes) = std::fs::read(r"C:\Windows\Fonts\seguisym.ttf") {
        fonts
            .font_data
            .insert("Segoe UI Symbol".to_owned(), egui::FontData::from_owned(bytes).into());
    }

    // Oswald is the faceplate lettering (Proportional); JetBrains Mono sets
    // every numeral (Monospace); Spectral is the display note only.
    fonts.families.insert(
        egui::FontFamily::Proportional,
        vec!["Oswald".into(), "Segoe UI Symbol".into()],
    );
    fonts.families.insert(
        egui::FontFamily::Monospace,
        vec!["JetBrains Mono".into(), "Segoe UI Symbol".into()],
    );
    fonts.families.insert(
        display_family(),
        vec!["Spectral".into(), "Segoe UI Symbol".into()],
    );

    ctx.set_fonts(fonts);
}

pub fn apply(ctx: &egui::Context) {
    load_fonts(ctx);

    let mut v = egui::Visuals::light();
    v.dark_mode = false;
    // Popups, tooltips and menus are cream faceplate with dark ink — readable
    // by construction (the contrast rule: never dark ink on a dark bubble).
    v.window_fill = PLATE;
    v.window_stroke = egui::Stroke::new(1.0, PLATE_EDGE);
    v.panel_fill = CHASSIS_2;
    v.override_text_color = Some(INK);
    // Input/value fields are light recessed cream so their dark-ink readouts
    // stay high-contrast (replaces the old dark well, which made values hard
    // to read).
    v.extreme_bg_color = FIELD_BG;
    v.faint_bg_color = PLATE_2;

    // Controls are raised cream chips on the faceplate.
    let edge = egui::Stroke::new(1.0, PLATE_EDGE);
    v.widgets.noninteractive.bg_fill = PLATE;
    v.widgets.noninteractive.weak_bg_fill = PLATE;
    v.widgets.noninteractive.fg_stroke = egui::Stroke::new(1.0, INK);
    v.widgets.noninteractive.bg_stroke = egui::Stroke::new(1.0, PLATE_EDGE);

    {
        let w = &mut v.widgets.inactive;
        w.bg_fill = CONTROL;
        w.weak_bg_fill = CONTROL;
        w.fg_stroke = egui::Stroke::new(1.0, INK);
        w.bg_stroke = edge;
        w.corner_radius = 4.into();
    }
    for w in [&mut v.widgets.hovered, &mut v.widgets.active] {
        w.bg_fill = CONTROL_HOVER;
        w.weak_bg_fill = CONTROL_HOVER;
        w.fg_stroke = egui::Stroke::new(1.0, INK_STRONG);
        w.bg_stroke = edge;
        w.corner_radius = 4.into();
    }
    v.widgets.open.bg_fill = CONTROL;
    v.widgets.open.weak_bg_fill = CONTROL;
    v.widgets.open.fg_stroke = egui::Stroke::new(1.0, INK_STRONG);
    v.widgets.open.bg_stroke = edge;

    // Selection / focus is a brass wash + ring.
    v.selection.bg_fill = BRASS.gamma_multiply(0.30);
    v.selection.stroke = egui::Stroke::new(1.0, BRASS_DEEP);
    v.hyperlink_color = BRASS_DEEP;
    v.warn_fg_color = AMBER;
    v.error_fg_color = OXBLOOD;
    v.window_stroke = egui::Stroke::new(1.0, CHASSIS_LINE);

    ctx.set_visuals(v);

    let mut style = (*ctx.style()).clone();
    style.spacing.item_spacing = egui::vec2(8.0, 6.0);
    style.spacing.button_padding = egui::vec2(10.0, 5.0);
    ctx.set_style(style);
}
