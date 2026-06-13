//! Right config panel — a cream faceplate column: Audio / Monitoring / Tuner /
//! Grid, with engraved Oswald captions and hairline dividers.

use crate::model::settings::Settings;
use crate::ui::theme;
use eframe::egui;

const FALLBACK_SAMPLE_RATES: [f64; 6] = [
    44_100.0, 48_000.0, 88_200.0, 96_000.0, 176_400.0, 192_000.0,
];
const FALLBACK_BUFFER_SIZES: [usize; 8] = [16, 32, 64, 128, 256, 512, 1024, 2048];

pub enum ConfigAction {
    None,
    Apply,
}

/// Everything the panel needs from the engine, gathered up-front so the
/// panel itself stays a pure function of its inputs.
pub struct DeviceInfo {
    pub device_types: Vec<String>,
    pub inputs: Vec<String>,
    pub outputs: Vec<String>,
    pub sample_rates: Vec<f64>,
    pub buffer_sizes: Vec<usize>,
    pub input_channels: usize,
    pub actual: Option<(f64, usize)>,
}

fn caption(ui: &mut egui::Ui, text: &str) {
    ui.add_space(2.0);
    ui.label(theme::section_label(text));
    ui.add_space(6.0);
}

fn divider(ui: &mut egui::Ui) {
    ui.add_space(10.0);
    let w = ui.available_width();
    let (rect, _) = ui.allocate_exact_size(egui::vec2(w, 1.0), egui::Sense::hover());
    ui.painter().hline(
        rect.x_range(),
        rect.center().y,
        egui::Stroke::new(1.0, theme::PLATE_EDGE),
    );
    ui.add_space(10.0);
}

/// Box width that keeps a combo + its right-side label inside the 286px panel.
const COMBO_W: f32 = 150.0;

fn combo(ui: &mut egui::Ui, label: &str, current: &mut String, options: &[String]) -> bool {
    let mut changed = false;
    egui::ComboBox::from_label(label)
        .width(COMBO_W)
        .selected_text(if current.is_empty() {
            "(default)"
        } else {
            current.as_str()
        })
        .show_ui(ui, |ui| {
            for option in options {
                if ui.selectable_label(current == option, option).clicked() {
                    *current = option.clone();
                    changed = true;
                }
            }
        });
    changed
}

pub fn config_panel(ui: &mut egui::Ui, settings: &mut Settings, info: &DeviceInfo) -> ConfigAction {
    let mut action = ConfigAction::None;
    let mut device_changed = false;

    caption(ui, "Audio");
    device_changed |= combo(ui, "Driver", &mut settings.device_type, &info.device_types);
    device_changed |= combo(ui, "Input device", &mut settings.input_device, &info.inputs);
    device_changed |= combo(ui, "Output device", &mut settings.output_device, &info.outputs);

    let sample_rates: &[f64] = if info.sample_rates.is_empty() {
        &FALLBACK_SAMPLE_RATES
    } else {
        &info.sample_rates
    };
    egui::ComboBox::from_label("Sample rate")
        .width(COMBO_W)
        .selected_text(format!("{}", settings.sample_rate))
        .show_ui(ui, |ui| {
            for &rate in sample_rates {
                if ui
                    .selectable_label(settings.sample_rate == rate, format!("{rate}"))
                    .clicked()
                {
                    settings.sample_rate = rate;
                    device_changed = true;
                }
            }
        });

    let buffer_sizes: &[usize] = if info.buffer_sizes.is_empty() {
        &FALLBACK_BUFFER_SIZES
    } else {
        &info.buffer_sizes
    };
    egui::ComboBox::from_label("Buffer size")
        .width(COMBO_W)
        .selected_text(format!("{}", settings.buffer_size))
        .show_ui(ui, |ui| {
            for &size in buffer_sizes {
                if ui
                    .selectable_label(settings.buffer_size == size, format!("{size}"))
                    .clicked()
                {
                    settings.buffer_size = size;
                    device_changed = true;
                }
            }
        });

    egui::ComboBox::from_label("Input channel")
        .width(COMBO_W)
        .selected_text(format!("{}", settings.input_channel + 1))
        .show_ui(ui, |ui| {
            for ch in 0..info.input_channels.max(1) {
                if ui
                    .selectable_label(settings.input_channel == ch, format!("{}", ch + 1))
                    .clicked()
                {
                    settings.input_channel = ch;
                }
            }
        });

    ui.add_space(6.0);
    ui.horizontal(|ui| {
        if ui
            .button(egui::RichText::new("Apply").strong().color(theme::BRASS_DEEP))
            .clicked()
            || device_changed
        {
            action = ConfigAction::Apply;
        }
        if let Some((rate, buffer)) = info.actual {
            ui.label(
                egui::RichText::new(format!("active: {rate} Hz / {buffer}"))
                    .monospace()
                    .size(11.0)
                    .color(theme::INK_DIM),
            );
        }
    });

    divider(ui);
    caption(ui, "Monitoring");
    ui.add(egui::Slider::new(&mut settings.monitor_gain_db, -60.0..=6.0).text("gain (dB)"));
    ui.add_space(4.0);
    ui.checkbox(&mut settings.monitor_mute, "Mute");

    divider(ui);
    caption(ui, "Tuner");
    ui.add(egui::Slider::new(&mut settings.a4_hz, 415.0..=466.0).text("A4 (Hz)"));

    divider(ui);
    caption(ui, "Grid");
    ui.add(
        egui::Slider::new(&mut settings.balance_db, 0.1..=3.0)
            .step_by(0.1)
            .text("balanced within ± dB"),
    )
    .on_hover_text("how close to the row median a string must be to count as balanced (green / ✓)");

    action
}
