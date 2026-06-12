use crate::audio::process::copy_monitor;
use crate::dsp::levels::BlockStats;
use cxx_juce::juce_audio_devices::{
    AudioCallbackHandle, AudioDeviceManager, AudioDeviceSetup, AudioIODevice,
    AudioIODeviceCallback, AudioIODeviceType, InputAudioSampleBuffer, OutputAudioSampleBuffer,
};
use cxx_juce::JUCE;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, AtomicU32, AtomicUsize, Ordering};

pub const STATS_RING_CAPACITY: usize = 1024;
pub const SAMPLES_RING_CAPACITY: usize = 32_768;

/// UI → audio-thread control state. The audio callback only ever reads
/// atomics; it never locks or allocates.
pub struct SharedControls {
    monitor_gain_bits: AtomicU32,
    pub monitor_mute: AtomicBool,
    pub input_channel: AtomicUsize,
    pub running: AtomicBool,
}

impl SharedControls {
    fn new() -> Self {
        Self {
            monitor_gain_bits: AtomicU32::new(1.0f32.to_bits()),
            monitor_mute: AtomicBool::new(false),
            input_channel: AtomicUsize::new(0),
            running: AtomicBool::new(false),
        }
    }

    pub fn set_monitor_gain(&self, linear: f32) {
        self.monitor_gain_bits
            .store(linear.to_bits(), Ordering::Relaxed);
    }

    pub fn monitor_gain(&self) -> f32 {
        f32::from_bits(self.monitor_gain_bits.load(Ordering::Relaxed))
    }
}

struct EngineCallback {
    controls: Arc<SharedControls>,
    stats_tx: rtrb::Producer<BlockStats>,
    samples_tx: rtrb::Producer<f32>,
}

impl AudioIODeviceCallback for EngineCallback {
    fn about_to_start(&mut self, _device: &mut dyn AudioIODevice) {
        self.controls.running.store(true, Ordering::Relaxed);
    }

    fn process_block(
        &mut self,
        input: &InputAudioSampleBuffer<'_>,
        output: &mut OutputAudioSampleBuffer<'_>,
    ) {
        if input.channels() == 0 {
            output.clear();
            return;
        }
        let channel = self
            .controls
            .input_channel
            .load(Ordering::Relaxed)
            .min(input.channels() - 1);
        let samples = &input[channel];

        // Ring pushes drop on full rather than block: the audio thread must
        // never wait on the UI thread.
        let _ = self.stats_tx.push(BlockStats::from_block(samples));
        for &s in samples {
            if self.samples_tx.push(s).is_err() {
                break;
            }
        }

        let gain = if self.controls.monitor_mute.load(Ordering::Relaxed) {
            0.0
        } else {
            self.controls.monitor_gain()
        };
        for c in 0..output.channels() {
            copy_monitor(samples, &mut output[c], gain);
        }
    }

    fn stopped(&mut self) {
        self.controls.running.store(false, Ordering::Relaxed);
    }
}

/// Desired device configuration, decoupled from persisted Settings so the
/// engine has no dependency on the model layer.
#[derive(Clone, Debug, PartialEq)]
pub struct AudioConfig {
    pub device_type: String,
    pub input_device: String,
    pub output_device: String,
    pub sample_rate: f64,
    pub buffer_size: usize,
}

pub struct AudioEngine {
    manager: AudioDeviceManager,
    callback_handle: Option<AudioCallbackHandle>,
    pub controls: Arc<SharedControls>,
    pub stats_rx: rtrb::Consumer<BlockStats>,
    pub samples_rx: rtrb::Consumer<f32>,
}

impl AudioEngine {
    pub fn new() -> cxx_juce::Result<Self> {
        // The manager clones the JUCE handle, which keeps the runtime alive
        // for the manager's lifetime.
        let juce = JUCE::initialise();
        let mut manager = AudioDeviceManager::new(&juce);
        manager.initialise(2, 2)?;

        let controls = Arc::new(SharedControls::new());
        let (stats_tx, stats_rx) = rtrb::RingBuffer::new(STATS_RING_CAPACITY);
        let (samples_tx, samples_rx) = rtrb::RingBuffer::new(SAMPLES_RING_CAPACITY);
        let handle = manager.add_audio_callback(EngineCallback {
            controls: Arc::clone(&controls),
            stats_tx,
            samples_tx,
        });

        Ok(Self {
            manager,
            callback_handle: Some(handle),
            controls,
            stats_rx,
            samples_rx,
        })
    }

    pub fn device_type_names(&mut self) -> Vec<String> {
        self.manager
            .device_types()
            .iter()
            .map(|t| t.name())
            .collect()
    }

    /// Input/output device names for the currently selected device type.
    pub fn device_names(&mut self) -> (Vec<String>, Vec<String>) {
        match self.manager.current_device_type() {
            Some(mut device_type) => {
                device_type.scan_for_devices();
                (device_type.input_devices(), device_type.output_devices())
            }
            None => (Vec::new(), Vec::new()),
        }
    }

    /// Apply a device configuration. cxx-juce 0.8 doesn't surface JUCE's
    /// error string from setAudioDeviceSetup, so success is judged by
    /// whether a device is actually open afterwards.
    pub fn apply(&mut self, config: &AudioConfig) -> Result<(), String> {
        if !config.device_type.is_empty() {
            self.manager
                .set_current_audio_device_type(&config.device_type);
        }
        let setup = AudioDeviceSetup::default()
            .with_input_device_name(&config.input_device)
            .with_output_device_name(&config.output_device)
            .with_sample_rate(config.sample_rate)
            .with_buffer_size(config.buffer_size);
        self.manager.set_audio_device_setup(&setup);

        if self.manager.current_device().is_some() {
            Ok(())
        } else {
            Err(format!(
                "could not open '{}' / '{}' ({})",
                config.input_device, config.output_device, config.device_type
            ))
        }
    }

    /// The setup JUCE actually applied (it may coerce sample rate and buffer
    /// size to the nearest values the hardware supports).
    pub fn actual_setup(&self) -> (f64, usize) {
        let setup = self.manager.audio_device_setup();
        (setup.sample_rate(), setup.buffer_size())
    }

    /// Sample rates and buffer sizes the current device supports.
    pub fn available_rates_and_buffers(&self) -> (Vec<f64>, Vec<usize>) {
        match self.manager.current_device() {
            Some(mut device) => (
                device.available_sample_rates(),
                device.available_buffer_sizes(),
            ),
            None => (Vec::new(), Vec::new()),
        }
    }

    /// Number of active input channels on the current device.
    pub fn input_channel_count(&self) -> usize {
        self.manager
            .current_device()
            .map(|d| d.input_channels().max(0) as usize)
            .unwrap_or(0)
    }

    pub fn is_running(&self) -> bool {
        self.controls.running.load(Ordering::Relaxed)
    }
}

impl Drop for AudioEngine {
    fn drop(&mut self) {
        if let Some(handle) = self.callback_handle.take() {
            self.manager.remove_audio_callback(handle);
        }
    }
}
