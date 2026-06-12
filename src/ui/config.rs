use crate::model::settings::Settings;
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

fn combo(ui: &mut egui::Ui, label: &str, current: &mut String, options: &[String]) -> bool {
    let mut changed = false;
    egui::ComboBox::from_label(label)
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

    ui.heading("Audio");
    device_changed |= combo(ui, "Driver", &mut settings.device_type, &info.device_types);
    device_changed |= combo(ui, "Input device", &mut settings.input_device, &info.inputs);
    device_changed |= combo(
        ui,
        "Output device",
        &mut settings.output_device,
        &info.outputs,
    );

    let sample_rates: &[f64] = if info.sample_rates.is_empty() {
        &FALLBACK_SAMPLE_RATES
    } else {
        &info.sample_rates
    };
    egui::ComboBox::from_label("Sample rate")
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

    if ui.button("Apply").clicked() || device_changed {
        action = ConfigAction::Apply;
    }
    if let Some((rate, buffer)) = info.actual {
        ui.weak(format!("active: {rate} Hz / {buffer} samples"));
    }

    ui.separator();
    ui.heading("Monitoring");
    ui.add(egui::Slider::new(&mut settings.monitor_gain_db, -60.0..=6.0).text("gain (dB)"));
    ui.checkbox(&mut settings.monitor_mute, "Mute");

    ui.separator();
    ui.heading("Tuner");
    ui.add(egui::Slider::new(&mut settings.a4_hz, 415.0..=466.0).text("A4 (Hz)"));

    ui.separator();
    ui.heading("Grid");
    ui.add(
        egui::Slider::new(&mut settings.balance_db, 0.1..=3.0)
            .step_by(0.1)
            .text("balanced within ± dB"),
    )
    .on_hover_text(
        "how close to the row median a string must be to count as balanced (green / ✓)",
    );

    action
}
