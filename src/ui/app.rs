use crate::audio::engine::{AudioConfig, AudioEngine};
use crate::audio::process::db_to_linear;
use crate::dsp::capture::{CaptureState, PluckCapture};
use crate::dsp::levels::{MeterState, dbfs};
use crate::dsp::pitch::{NoteReading, Tuner};
use crate::model::grid::{Capture, CaptureGrid};
use crate::model::settings::Settings;
use crate::ui::config::{ConfigAction, DeviceInfo, config_panel};
use crate::ui::grid::{GridAction, GridUiState, grid_widget};
use crate::ui::meter::{MeterAction, meter_widget};
use crate::ui::theme;
use crate::ui::tuner::tuner_widget;
use eframe::egui;
use std::path::PathBuf;
use std::sync::atomic::Ordering;
use std::time::Duration;

// YIN over the analysis window is too costly to run every frame; ~15 Hz is
// plenty for a tuner.
const PITCH_EVERY_N_FRAMES: u32 = 4;
const TUNER_HOLD_SECONDS: f32 = 0.5;
/// Below this RMS the tuner shows nothing rather than chasing noise.
const TUNER_GATE_DB: f32 = -60.0;

pub struct App {
    pub engine: Option<AudioEngine>,
    pub engine_error: Option<String>,
    pub meter: MeterState,
    pub pluck: PluckCapture,
    pub tuner: Tuner,
    pub tuner_reading: Option<NoteReading>,
    tuner_hold: f32,
    pub grid: CaptureGrid,
    pub selected: (usize, usize), // (pickup, string)
    pub grid_ui: GridUiState,
    pub settings: Settings,
    settings_path: Option<PathBuf>,
    sample_chunk: Vec<f32>,
    frame_count: u32,
    silent_seconds: f32,
}

impl Default for App {
    fn default() -> Self {
        Self::new()
    }
}

impl App {
    pub fn new() -> Self {
        let settings_path = Settings::default_path();
        let mut settings = settings_path
            .as_deref()
            .map(Settings::load)
            .unwrap_or_default();
        settings.sync_pickup_names();

        let (engine, engine_error) = match AudioEngine::new() {
            Ok(e) => (Some(e), None),
            Err(e) => (None, Some(format!("audio init failed: {e}"))),
        };

        let mut app = Self {
            engine,
            engine_error,
            meter: MeterState::new(settings.sample_rate as f32),
            pluck: PluckCapture::new(settings.sample_rate as f32),
            tuner: Tuner::new(settings.sample_rate as f32),
            tuner_reading: None,
            tuner_hold: 0.0,
            grid: CaptureGrid::new(settings.strings, settings.pickups),
            selected: (0, 0),
            grid_ui: GridUiState::default(),
            settings,
            settings_path,
            sample_chunk: Vec::new(),
            frame_count: 0,
            silent_seconds: 0.0,
        };
        app.apply_audio_config();
        app.push_controls();
        app
    }

    pub fn apply_audio_config(&mut self) {
        let config = AudioConfig {
            device_type: self.settings.device_type.clone(),
            input_device: self.settings.input_device.clone(),
            output_device: self.settings.output_device.clone(),
            sample_rate: self.settings.sample_rate,
            buffer_size: self.settings.buffer_size,
        };
        if let Some(engine) = &mut self.engine {
            match engine.apply(&config) {
                Ok(()) => {
                    self.engine_error = None;
                    let (rate, _) = engine.actual_setup();
                    // The rate may have been coerced by the hardware;
                    // rate-dependent DSP must be rebuilt to match.
                    self.meter = MeterState::new(rate as f32);
                    self.pluck = PluckCapture::new(rate as f32);
                    self.tuner = Tuner::new(rate as f32);
                }
                Err(e) => self.engine_error = Some(e),
            }
        }
    }

    /// Push UI-side control values into the audio thread's atomics.
    pub fn push_controls(&self) {
        if let Some(engine) = &self.engine {
            engine
                .controls
                .set_monitor_gain(db_to_linear(self.settings.monitor_gain_db));
            engine
                .controls
                .monitor_mute
                .store(self.settings.monitor_mute, Ordering::Relaxed);
            engine
                .controls
                .input_channel
                .store(self.settings.input_channel, Ordering::Relaxed);
        }
    }

    pub fn save_settings(&self) {
        if let Some(path) = &self.settings_path {
            // Best-effort: a failed save shouldn't interrupt a tuning session.
            let _ = self.settings.save(path);
        }
    }

    fn drain_audio(&mut self, dt: f32) {
        let Some(engine) = &mut self.engine else {
            return;
        };
        let mut finished_capture = None;
        while let Ok(stats) = engine.stats_rx.pop() {
            self.meter.update(&stats);
            if let Some(result) = self.pluck.feed(&stats) {
                finished_capture = Some(result);
            }
        }
        self.sample_chunk.clear();
        while let Ok(s) = engine.samples_rx.pop() {
            self.sample_chunk.push(s);
        }
        self.tuner.feed(&self.sample_chunk);

        self.frame_count = self.frame_count.wrapping_add(1);
        if self.frame_count.is_multiple_of(PITCH_EVERY_N_FRAMES) {
            let gated = dbfs(self.meter.rms()) < TUNER_GATE_DB;
            let fresh = if gated {
                None
            } else {
                self.tuner.detect(self.settings.a4_hz)
            };
            if let Some(reading) = fresh {
                self.tuner_reading = Some(reading);
                self.tuner_hold = TUNER_HOLD_SECONDS;
            }
        }
        // Hold the last reading briefly so the display doesn't flicker
        // between plucks.
        self.tuner_hold -= dt;
        if self.tuner_hold <= 0.0 {
            self.tuner_reading = None;
        }

        if dbfs(self.meter.peak_live) <= -90.0 {
            self.silent_seconds += dt;
        } else {
            self.silent_seconds = 0.0;
        }

        if let Some(result) = finished_capture {
            self.grid.capture(
                self.selected.0,
                self.selected.1,
                Capture {
                    peak_db: result.peak_db,
                    rms_db: result.rms_db,
                    clipped: result.clipped,
                    // The tuner display-holds through the capture window, so
                    // this is the note that was just plucked.
                    note: self.tuner_reading.map(|r| (r.name, r.octave)),
                },
            );
            // Fresh hold window for observing the next pluck.
            self.meter.reset_hold();
            self.advance_selection();
        }
    }

    fn toggle_arm(&mut self) {
        match self.pluck.state() {
            CaptureState::Idle => self.pluck.arm(),
            CaptureState::Armed | CaptureState::Capturing => self.pluck.cancel(),
        }
    }

    /// After a capture lands, step to the next string; at the end of a row,
    /// wrap to the next pickup's first string.
    fn advance_selection(&mut self) {
        let (p, s) = self.selected;
        self.selected = if s + 1 < self.grid.strings() {
            (p, s + 1)
        } else if p + 1 < self.grid.pickups() {
            (p + 1, 0)
        } else {
            (p, s)
        };
    }

    fn move_selection(&mut self, d_pickup: isize, d_string: isize) {
        let p = (self.selected.0 as isize + d_pickup)
            .clamp(0, self.grid.pickups() as isize - 1) as usize;
        let s = (self.selected.1 as isize + d_string)
            .clamp(0, self.grid.strings() as isize - 1) as usize;
        self.selected = (p, s);
    }

    fn device_info(&mut self) -> DeviceInfo {
        match &mut self.engine {
            Some(engine) => {
                let device_types = engine.device_type_names();
                let (inputs, outputs) = engine.device_names();
                let (sample_rates, buffer_sizes) = engine.available_rates_and_buffers();
                DeviceInfo {
                    device_types,
                    inputs,
                    outputs,
                    sample_rates,
                    buffer_sizes,
                    input_channels: engine.input_channel_count(),
                    actual: Some(engine.actual_setup()),
                }
            }
            None => DeviceInfo {
                device_types: Vec::new(),
                inputs: Vec::new(),
                outputs: Vec::new(),
                sample_rates: Vec::new(),
                buffer_sizes: Vec::new(),
                input_channels: 0,
                actual: None,
            },
        }
    }
}

/// The silkscreen bar-graph glyph beside the wordmark — five bars, the middle
/// one lit brass.
fn bar_graph_mark(ui: &mut egui::Ui) {
    let (rect, _) = ui.allocate_exact_size(egui::vec2(28.0, 18.0), egui::Sense::hover());
    let painter = ui.painter_at(rect);
    let heights = [7.0f32, 11.0, 18.0, 12.0, 8.0];
    for (i, h) in heights.iter().enumerate() {
        let x = rect.left() + i as f32 * 6.0;
        let bar = egui::Rect::from_min_max(
            egui::pos2(x, rect.bottom() - h),
            egui::pos2(x + 4.0, rect.bottom()),
        );
        let color = if i == 2 { theme::BRASS } else { theme::CHASSIS_DIM };
        painter.rect_filled(bar, 1.0, color);
    }
}

/// A small glowing enamel lamp for chassis status text.
fn chassis_lamp(ui: &mut egui::Ui, color: egui::Color32) {
    let (rect, _) = ui.allocate_exact_size(egui::vec2(9.0, 9.0), egui::Sense::hover());
    ui.painter().circle_filled(rect.center(), 3.5, color);
}

impl eframe::App for App {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        let dt = ctx.input(|i| i.stable_dt);
        self.drain_audio(dt);

        // dark tweed cabinet behind everything
        theme::paint_chassis(
            &ctx.layer_painter(egui::LayerId::background()),
            ctx.screen_rect(),
        );

        let mut reconnect_clicked = false;
        let top = egui::TopBottomPanel::top("status")
            .frame(
                egui::Frame::new()
                    .fill(egui::Color32::TRANSPARENT)
                    .inner_margin(egui::Margin {
                        left: 16,
                        right: 16,
                        top: 6,
                        bottom: 6,
                    }),
            )
            .show(ctx, |ui| {
                ui.horizontal(|ui| {
                    bar_graph_mark(ui);
                    ui.add_space(4.0);
                    ui.vertical(|ui| {
                        ui.spacing_mut().item_spacing.y = 2.0;
                        ui.label(
                            egui::RichText::new("PICKUP TUNER")
                                .size(15.0)
                                .strong()
                                .color(theme::CHASSIS_INK),
                        );
                        ui.label(
                            egui::RichText::new("POLE · HEIGHT · BALANCE")
                                .size(8.5)
                                .color(theme::CHASSIS_DIM),
                        );
                    });
                    ui.add_space(4.0);
                    egui::Frame::new()
                        .stroke(egui::Stroke::new(1.0, theme::BRASS_DEEP))
                        .corner_radius(3.0)
                        .inner_margin(egui::Margin::symmetric(6, 2))
                        .show(ui, |ui| {
                            ui.label(
                                egui::RichText::new("PT-V")
                                    .monospace()
                                    .size(9.0)
                                    .color(theme::BRASS),
                            );
                        });
                    ui.add_space(10.0);

                    match &self.engine {
                        Some(engine) if !engine.is_running() => {
                            chassis_lamp(ui, theme::AMBER);
                            ui.label(
                                egui::RichText::new("audio device stopped").color(theme::AMBER),
                            );
                            if ui.button("Reconnect").clicked() {
                                reconnect_clicked = true;
                            }
                        }
                        Some(_) if self.silent_seconds > 3.0 => {
                            chassis_lamp(ui, theme::AMBER);
                            ui.label(
                                egui::RichText::new(format!(
                                    "no signal on input {} — check cable/channel",
                                    self.settings.input_channel + 1
                                ))
                                .color(theme::AMBER),
                            );
                        }
                        Some(_) => {
                            chassis_lamp(ui, theme::OLIVE);
                            ui.label(
                                egui::RichText::new(format!(
                                    "monitoring · in {}",
                                    self.settings.input_channel + 1
                                ))
                                .color(theme::OLIVE),
                            );
                        }
                        None => {
                            chassis_lamp(ui, theme::OXBLOOD);
                            ui.label(
                                egui::RichText::new("audio engine unavailable")
                                    .color(theme::OXBLOOD),
                            );
                        }
                    }
                    if let Some(err) = &self.engine_error {
                        ui.label(egui::RichText::new(err).color(theme::OXBLOOD));
                    }
                });
            });
        // gear seam under the chassis header
        ctx.layer_painter(egui::LayerId::new(
            egui::Order::Foreground,
            egui::Id::new("chassis-seam"),
        ))
        .hline(
            ctx.screen_rect().x_range(),
            top.response.rect.bottom(),
            egui::Stroke::new(1.0, theme::CHASSIS_LINE),
        );
        if reconnect_clicked {
            self.apply_audio_config();
        }

        // Snapshot settings before any panel can edit them (config panel,
        // pickup name fields, reshape) — compared at the end of the frame.
        let settings_before = self.settings.clone();

        let info = self.device_info();
        let mut config_action = ConfigAction::None;
        egui::SidePanel::right("config")
            .frame(
                egui::Frame::new()
                    .fill(theme::PLATE)
                    .inner_margin(egui::Margin::same(16)),
            )
            .resizable(false)
            .exact_width(286.0)
            .show(ctx, |ui| {
                config_action = config_panel(ui, &mut self.settings, &info);
            });
        if let ConfigAction::Apply = config_action {
            self.apply_audio_config();
        }

        let mut grid_action = GridAction::None;
        egui::CentralPanel::default()
            .frame(
                egui::Frame::new()
                    .fill(egui::Color32::TRANSPARENT)
                    .inner_margin(egui::Margin::same(16)),
            )
            .show(ctx, |ui| {
                egui::ScrollArea::vertical().show(ui, |ui| {
                    theme::faceplate_frame().show(ui, |ui| {
                        ui.set_min_width(ui.available_width());
                        match meter_widget(ui, &self.meter) {
                            MeterAction::ResetHold => self.meter.reset_hold(),
                            MeterAction::None => {}
                        }
                    });
                    ui.add_space(13.0);
                    theme::faceplate_frame().show(ui, |ui| {
                        ui.set_min_width(ui.available_width());
                        tuner_widget(ui, self.tuner_reading.as_ref());
                    });
                    ui.add_space(13.0);
                    theme::faceplate_frame().show(ui, |ui| {
                        ui.set_min_width(ui.available_width());
                        let balance_db = self.settings.balance_db;
                        grid_action = grid_widget(
                            ui,
                            &self.grid,
                            &mut self.selected,
                            &mut self.grid_ui,
                            self.pluck.state(),
                            &mut self.settings.pickup_names,
                            balance_db,
                        );
                    });
                });
            });
        // Global shortcuts must not fire while a text field (pickup name)
        // has keyboard focus.
        if !ctx.wants_keyboard_input() {
            if ctx.input(|i| i.key_pressed(egui::Key::Space)) {
                grid_action = GridAction::Capture;
            }
            if ctx.input(|i| i.key_pressed(egui::Key::Escape)) {
                self.pluck.cancel();
            }
            let (dp, ds) = ctx.input(|i| {
                (
                    i.key_pressed(egui::Key::ArrowDown) as isize
                        - i.key_pressed(egui::Key::ArrowUp) as isize,
                    i.key_pressed(egui::Key::ArrowRight) as isize
                        - i.key_pressed(egui::Key::ArrowLeft) as isize,
                )
            });
            if dp != 0 || ds != 0 {
                self.move_selection(dp, ds);
            }
        }
        match grid_action {
            GridAction::Capture => self.toggle_arm(),
            GridAction::ClearSlot => self.grid.clear_slot(self.selected.0, self.selected.1),
            GridAction::ClearAll => self.grid.clear_all(),
            GridAction::Reshape { strings, pickups } => {
                // resize preserves overlapping captures
                self.grid.resize(strings, pickups);
                self.selected = (
                    self.selected.0.min(pickups - 1),
                    self.selected.1.min(strings - 1),
                );
                self.settings.strings = strings;
                self.settings.pickups = pickups;
                self.settings.sync_pickup_names();
            }
            GridAction::None => {}
        }

        // Only touch atomics/disk when something actually changed — this
        // runs every frame.
        if self.settings != settings_before {
            self.push_controls();
            self.save_settings();
        }

        ctx.request_repaint_after(Duration::from_millis(16));
    }
}
