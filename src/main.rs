use eframe::egui;

/// egui's bundled fonts lack ↑ ↓ ✓ ⚠; load Segoe UI (always present on
/// Windows) as the primary face with Segoe UI Symbol as a glyph fallback.
/// Falls back silently to egui defaults if the files aren't readable.
fn load_system_fonts(ctx: &egui::Context) {
    let mut fonts = egui::FontDefinitions::default();
    let candidates = [
        ("Segoe UI", r"C:\Windows\Fonts\segoeui.ttf"),
        ("Segoe UI Symbol", r"C:\Windows\Fonts\seguisym.ttf"),
    ];
    for (name, path) in candidates {
        if let Ok(bytes) = std::fs::read(path) {
            fonts.font_data.insert(
                name.to_owned(),
                egui::FontData::from_owned(bytes).into(),
            );
        }
    }
    if fonts.font_data.contains_key("Segoe UI") {
        fonts
            .families
            .entry(egui::FontFamily::Proportional)
            .or_default()
            .insert(0, "Segoe UI".to_owned());
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

fn main() -> eframe::Result {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([1000.0, 650.0]),
        ..Default::default()
    };
    eframe::run_native(
        "Pickup Tuner",
        options,
        Box::new(|cc| {
            load_system_fonts(&cc.egui_ctx);
            Ok(Box::new(pickup_tuner::ui::app::App::new()))
        }),
    )
}
