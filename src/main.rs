// Release builds target the Windows GUI subsystem so no console window opens
// behind the app; debug builds keep the console for log output.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use eframe::egui;

fn main() -> eframe::Result {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([1120.0, 940.0]),
        ..Default::default()
    };
    eframe::run_native(
        "Pickup Tuner",
        options,
        Box::new(|cc| {
            pickup_tuner::ui::theme::apply(&cc.egui_ctx);
            Ok(Box::new(pickup_tuner::ui::app::App::new()))
        }),
    )
}
