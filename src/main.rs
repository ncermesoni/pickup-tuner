use eframe::egui;

fn main() -> eframe::Result {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([1000.0, 700.0]),
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
