//! Enumerate audio device types and their devices.
//!
//! Run with: cargo run --example list_devices [--features asio]

use cxx_juce::{JUCE, juce_audio_devices::AudioDeviceManager};

fn main() -> cxx_juce::Result<()> {
    use cxx_juce::juce_audio_devices::AudioIODeviceType;

    let juce = JUCE::initialise();
    let mut manager = AudioDeviceManager::new(&juce);
    manager.initialise(2, 2)?;

    for mut device_type in manager.device_types() {
        println!("== {}", device_type.name());
        device_type.scan_for_devices();
        println!("  inputs:  {:?}", device_type.input_devices());
        println!("  outputs: {:?}", device_type.output_devices());
    }
    Ok(())
}
