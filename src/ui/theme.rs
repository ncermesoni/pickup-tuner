//! Visual identity: dark workbench / rack-gear. One warm near-black base;
//! amber and signal-green are the only accent voices, matching what those
//! colors mean in the app (armed / balanced / hot). All numerals render in
//! monospace so readings align like a hardware display.

use eframe::egui;

pub const BG_WINDOW: egui::Color32 = egui::Color32::from_rgb(13, 13, 15);
pub const BG_PANEL: egui::Color32 = egui::Color32::from_rgb(19, 19, 23);
pub const BG_WIDGET: egui::Color32 = egui::Color32::from_rgb(27, 27, 33);
pub const BG_HOVER: egui::Color32 = egui::Color32::from_rgb(38, 38, 46);

pub const TEXT: egui::Color32 = egui::Color32::from_rgb(232, 229, 220);
pub const TEXT_DIM: egui::Color32 = egui::Color32::from_rgb(138, 134, 124);

pub const GREEN: egui::Color32 = egui::Color32::from_rgb(94, 201, 113);
pub const AMBER: egui::Color32 = egui::Color32::from_rgb(228, 168, 88);
pub const RED: egui::Color32 = egui::Color32::from_rgb(222, 92, 80);
pub const FOCUS: egui::Color32 = egui::Color32::from_rgb(130, 180, 230);

// Cell backgrounds: the accent hues pulled way down so the readouts on top
// stay legible.
pub const GREEN_BG: egui::Color32 = egui::Color32::from_rgb(28, 62, 38);
pub const AMBER_BG: egui::Color32 = egui::Color32::from_rgb(74, 58, 24);
pub const RED_BG: egui::Color32 = egui::Color32::from_rgb(84, 33, 30);
pub const EMPTY_BG: egui::Color32 = egui::Color32::from_rgb(24, 24, 29);

/// Dim section caption, e.g. "LEVEL", "CAPTURE GRID". Letter-spacing isn't
/// supported by egui, so spaced uppercase does the job.
pub fn section_label(text: &str) -> egui::RichText {
    let spaced: String = text
        .to_uppercase()
        .chars()
        .flat_map(|c| [c, '\u{2009}'])
        .collect();
    egui::RichText::new(spaced.trim_end()).size(11.0).color(TEXT_DIM)
}

/// Frame wrapping each functional block (meter, tuner, grid).
pub fn section_frame() -> egui::Frame {
    egui::Frame::new()
        .fill(BG_PANEL)
        .corner_radius(8.0)
        .inner_margin(egui::Margin::same(10))
}

fn load_fonts(ctx: &egui::Context) {
    let mut fonts = egui::FontDefinitions::default();
    // Proportional face + symbol fallback (egui's bundled fonts lack ↑↓✓⚠).
    let faces = [
        ("Segoe UI", r"C:\Windows\Fonts\segoeui.ttf"),
        ("Segoe UI Symbol", r"C:\Windows\Fonts\seguisym.ttf"),
        // First readable monospace wins; Cascadia ships with Win11/Terminal,
        // Consolas with every Windows.
        ("Cascadia Mono", r"C:\Windows\Fonts\CascadiaMono.ttf"),
        ("Consolas", r"C:\Windows\Fonts\consola.ttf"),
    ];
    for (name, path) in faces {
        if let Ok(bytes) = std::fs::read(path) {
            fonts
                .font_data
                .insert(name.to_owned(), egui::FontData::from_owned(bytes).into());
        }
    }

    if fonts.font_data.contains_key("Segoe UI") {
        fonts
            .families
            .entry(egui::FontFamily::Proportional)
            .or_default()
            .insert(0, "Segoe UI".to_owned());
    }
    for mono in ["Cascadia Mono", "Consolas"] {
        if fonts.font_data.contains_key(mono) {
            fonts
                .families
                .entry(egui::FontFamily::Monospace)
                .or_default()
                .insert(0, mono.to_owned());
            break;
        }
    }
    if fonts.font_data.contains_key("Segoe UI Symbol") {
        for family in [egui::FontFamily::Proportional, egui::FontFamily::Monospace] {
            fonts
                .families
                .entry(family)
                .or_default()
                .push("Segoe UI Symbol".to_owned());
        }
    }
    ctx.set_fonts(fonts);
}

pub fn apply(ctx: &egui::Context) {
    load_fonts(ctx);

    let mut visuals = egui::Visuals::dark();
    visuals.window_fill = BG_WINDOW;
    visuals.panel_fill = BG_WINDOW;
    visuals.extreme_bg_color = egui::Color32::from_rgb(10, 10, 12);
    visuals.faint_bg_color = BG_PANEL;

    visuals.widgets.noninteractive.bg_fill = BG_PANEL;
    visuals.widgets.noninteractive.fg_stroke = egui::Stroke::new(1.0, TEXT);
    visuals.widgets.inactive.bg_fill = BG_WIDGET;
    visuals.widgets.inactive.weak_bg_fill = BG_WIDGET;
    visuals.widgets.inactive.fg_stroke = egui::Stroke::new(1.0, TEXT);
    visuals.widgets.hovered.bg_fill = BG_HOVER;
    visuals.widgets.hovered.weak_bg_fill = BG_HOVER;
    visuals.widgets.active.bg_fill = BG_HOVER;
    visuals.widgets.active.weak_bg_fill = BG_HOVER;

    visuals.selection.bg_fill = FOCUS.gamma_multiply(0.35);
    visuals.selection.stroke = egui::Stroke::new(1.0, FOCUS);
    visuals.hyperlink_color = FOCUS;
    visuals.warn_fg_color = AMBER;
    visuals.error_fg_color = RED;

    ctx.set_visuals(visuals);

    let mut style = (*ctx.style()).clone();
    style.spacing.item_spacing = egui::vec2(8.0, 6.0);
    style.spacing.button_padding = egui::vec2(10.0, 4.0);
    ctx.set_style(style);
}
