//! End-to-end audio path check without UI: prints live levels and detected
//! pitch from the default input device for 15 seconds, monitoring to the
//! default output.
//!
//! Run with: cargo run --example live_meter [--features asio]

use pickup_tuner::audio::engine::AudioEngine;
use pickup_tuner::dsp::levels::{MeterState, dbfs};
use pickup_tuner::dsp::pitch::Tuner;
use std::time::{Duration, Instant};

fn main() -> anyhow::Result<()> {
    let mut engine = AudioEngine::new().map_err(|e| anyhow::anyhow!("{e}"))?;
    let (sample_rate, buffer_size) = engine.actual_setup();
    println!("running at {sample_rate} Hz, buffer {buffer_size}");

    let mut meter = MeterState::new(sample_rate as f32);
    let mut tuner = Tuner::new(sample_rate as f32);
    let mut chunk = Vec::new();
    let start = Instant::now();

    while start.elapsed() < Duration::from_secs(15) {
        while let Ok(stats) = engine.stats_rx.pop() {
            meter.update(&stats);
        }
        chunk.clear();
        while let Ok(s) = engine.samples_rx.pop() {
            chunk.push(s);
        }
        tuner.feed(&chunk);
        let note = tuner
            .detect(440.0)
            .map(|n| format!("{}{} {:+.0}c ({:.1} Hz)", n.name, n.octave, n.cents, n.frequency))
            .unwrap_or_else(|| "—".into());
        println!(
            "peak {:6.1} dB  hold {:6.1} dB  rms {:6.1} dB  {}",
            dbfs(meter.peak_live),
            dbfs(meter.peak_hold),
            dbfs(meter.rms()),
            note
        );
        std::thread::sleep(Duration::from_millis(100));
    }
    Ok(())
}
