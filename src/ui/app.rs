use crate::audio::engine::{AudioConfig, AudioEngine};
use crate::audio::process::db_to_linear;
use crate::dsp::levels::{MeterState, dbfs};
use crate::dsp::pitch::{NoteReading, Tuner};
use crate::model::grid::CaptureGrid;
use crate::model::settings::Settings;
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
    pub tuner: Tuner,
    pub tuner_reading: Option<NoteReading>,
    tuner_hold: f32,
    pub grid: CaptureGrid,
    pub selected: (usize, usize), // (pickup, string)
    pub settings: Settings,
    settings_path: Option<PathBuf>,
    sample_chunk: Vec<f32>,
    frame_count: u32,
}

impl App {
    pub fn new() -> Self {
        let settings_path = Settings::default_path();
        let settings = settings_path
            .as_deref()
            .map(Settings::load)
            .unwrap_or_default();

        let (engine, engine_error) = match AudioEngine::new() {
            Ok(e) => (Some(e), None),
            Err(e) => (None, Some(format!("audio init failed: {e}"))),
        };

        let mut app = Self {
            engine,
            engine_error,
            meter: MeterState::new(settings.sample_rate as f32),
            tuner: Tuner::new(settings.sample_rate as f32),
            tuner_reading: None,
            tuner_hold: 0.0,
            grid: CaptureGrid::new(settings.strings, settings.pickups),
            selected: (0, 0),
            settings,
            settings_path,
            sample_chunk: Vec::new(),
            frame_count: 0,
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
        while let Ok(stats) = engine.stats_rx.pop() {
            self.meter.update(&stats);
        }
        self.sample_chunk.clear();
        while let Ok(s) = engine.samples_rx.pop() {
            self.sample_chunk.push(s);
        }
        self.tuner.feed(&self.sample_chunk);

        self.frame_count = self.frame_count.wrapping_add(1);
        if self.frame_count % PITCH_EVERY_N_FRAMES == 0 {
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
    }
}

impl eframe::App for App {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        let dt = ctx.input(|i| i.stable_dt);
        self.drain_audio(dt);

        egui::TopBottomPanel::top("status").show(ctx, |ui| {
            ui.horizontal(|ui| {
                ui.heading("Pickup Tuner");
                if let Some(err) = &self.engine_error {
                    ui.colored_label(egui::Color32::RED, err);
                }
            });
        });

        egui::SidePanel::right("config")
            .default_width(260.0)
            .show(ctx, |ui| {
                ui.label("config panel (pending)");
            });

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.label("meter (pending)");
            ui.separator();
            ui.label("tuner (pending)");
            ui.separator();
            ui.label("grid (pending)");
        });

        ctx.request_repaint_after(Duration::from_millis(16));
    }
}
