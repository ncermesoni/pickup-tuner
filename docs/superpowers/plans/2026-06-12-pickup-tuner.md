# Pickup Tuner Implementation Plan

**Goal:** Windows app for tuning pickup/pole heights: live peak/RMS meters, strings×pickups capture grid, chromatic tuner, low-latency ASIO monitoring. Spec: `docs/superpowers/specs/2026-06-12-pickup-tuner-design.md`.

**Architecture:** Rust binary + lib crate. JUCE's audio device layer (ASIO, full-duplex callback) via `cxx-juce` 0.8. The audio callback only computes block peak/sum-of-squares, pushes into lock-free rings (rtrb), and copies input→output for monitoring (gain/mute via atomics). All analysis (meter ballistics, peak hold, clip latch, YIN pitch detection) and UI run on the egui/eframe thread at ~60 fps, draining the rings each frame. `dsp` and `model` are pure, unit-tested modules; `audio/engine.rs` is the only file touching JUCE types; `ui/*` the only files touching egui.

**Stack:** Rust (MSVC), cxx-juce 0.8 (`asio` feature), eframe/egui, rtrb, serde/serde_json/directories, tempfile (dev).

## File structure

```
src/
  main.rs            # thin eframe entry
  lib.rs             # pub mod audio; dsp; model; ui;
  audio/process.rs   # pure per-block helpers (monitor copy, db_to_linear)
  audio/engine.rs    # JUCE init, device mgmt, EngineCallback — only JUCE-touching file
  dsp/levels.rs      # dbfs, BlockStats, MeterState (hold / clip latch / 300ms RMS window)
  dsp/pitch.rs       # FIR Decimator (4x), YIN, note mapping, streaming Tuner facade
  model/grid.rs      # CaptureGrid: slots, per-row deltas vs quietest, row averages
  model/settings.rs  # persisted Settings, tolerant JSON load
  ui/{app,meter,tuner,grid,config}.rs
examples/
  list_devices.rs    # ASIO spike
  live_meter.rs      # end-to-end audio path check, no UI
```

## Known risks & spec deviations

1. **cxx-juce API drift:** code targets released 0.8.0 (docs.rs) — `AudioIODeviceCallback`, `Input/OutputAudioSampleBuffer`, `AudioDeviceManager::new(&JUCE)`. GitHub main differs; docs.rs for the pinned version is source of truth. Expected friction: exact `AudioIODeviceType` method names, whether setters return `Result`, `AudioDeviceSetup` construction.
2. **ASIO control panel button:** may not be exposed in 0.8 — probe via `cargo doc`; fallback = omit button, README points at Focusrite Control. *Spec deviation if absent.*
3. **Output pair selection:** v1 = select output *device*, write monitor to all its channels. Per-pair selection deferred. *Minor spec deviation.*
4. **Disconnect detection:** no change-listener in 0.8; use the callback's `stopped()` + UI Reconnect button.

## Prerequisites (manual, once)

- Rust stable MSVC, VS 2022 Build Tools (C++), CMake on PATH
- Steinberg ASIO SDK (https://www.steinberg.net/asiosdk) extracted; env var `CXX_JUCE_ASIO_SDK_DIR` pointing at it
- Crate feature `asio = ["cxx-juce/asio"]` so dev builds work without the SDK (WASAPI/DirectSound)

## Tasks

- [ ] **1. Scaffold:** cargo init, deps, `.gitignore`, hello eframe window. Verify: `cargo run` opens a window (first build compiles JUCE — slow). Commit.
- [ ] **2. ASIO spike:** `examples/list_devices.rs` — enumerate device types + names. Verify: "Focusrite USB ASIO" listed with `--features asio`. De-risks everything. Commit.
- [ ] **3. `dsp::levels` (TDD):** `dbfs` (floor −120), `BlockStats::from_block`, `MeterState` — sticky peak hold + reset, clip latch ≥0.999, 300 ms windowed RMS, peak-live decay 30 dB/s. Commit.
- [ ] **4. `model::grid` (TDD):** capture/clear/resize-clears, `delta_db` vs quietest captured in row, `row_average`, clipped flag, `Metric::{Peak,Rms}`. Commit.
- [ ] **5. `model::settings` (TDD):** all device/grid/tuner/monitor fields, `#[serde(default)]`, tolerant load (missing/corrupt → default), save creates dirs. Commit.
- [ ] **6. `dsp::pitch` Decimator (TDD):** 65-tap windowed-sinc FIR, cutoff 0.8×output-Nyquist, ÷4. Tests: length, 220 Hz passes (zero-crossing freq + RMS), 10 kHz rejected. Commit.
- [ ] **7. `dsp::pitch` YIN + notes (TDD):** difference fn → CMNDF → threshold 0.12 → parabolic interpolation; `frequency_to_note` (configurable A4, name/octave/cents); streaming `Tuner` facade (feed device-rate, detect on 2048 @ ~12 kHz, range 25–1200 Hz). Tests: sines (440, 82.41), sawtooth 110, silence→None, seeded-noise→None, cents math, through-decimator integration. Commit.
- [ ] **8. `audio::engine`:** pure `copy_monitor`/`db_to_linear` (TDD); `SharedControls` atomics (gain bits, mute, input channel, running); `EngineCallback` (never locks/allocates; ring pushes drop on full); `AudioEngine` (init, enumerate, `apply(AudioConfig)`, `actual_setup`, drop order: manager before JUCE handle). Verify: `examples/live_meter.rs` prints live dB + note, monitoring audible — **milestone proving the whole audio path**. Commit.
- [ ] **9. UI shell:** `App` with drain loop (stats→meter, samples→tuner, pitch every 4th frame gated at −60 dB RMS, 0.5 s display hold), panel layout, 16 ms repaint. Commit.
- [ ] **10. Meter widget:** −60..0 dB bar — RMS fill, live-peak + hold markers, ticks, numeric readouts, CLIP lamp, reset. Manual verify. Commit.
- [ ] **11. Tuner widget:** note+octave, cents needle ±50 clamped, green within ±3¢, "—" when silent. Manual verify. Commit.
- [ ] **12. Grid widget:** strings 4–12 / pickups 1–4 reshape (clears + persists shape), cell select, Capture (button + Space) stores peak-hold/RMS/clipped then resets hold, deltas + row averages, metric toggle, ⚠ on clipped, clear slot/all. Manual verify. Commit.
- [ ] **13. Config panel:** driver/input/output combos, sample rate + buffer dropdowns, input channel, Apply (rebuilds MeterState/Tuner at the *actual* coerced rate), monitor gain/mute, A4 slider. Save settings only on change, not per-frame. Manual verify incl. persistence across restart. Commit.
- [ ] **14. Error states:** stopped banner + Reconnect, no-signal hint after 3 s silence, unconfigured first launch works. Manual verify (power-cycle interface). Commit.
- [ ] **15. Control panel probe:** `cargo doc -p cxx-juce`, wire button if exposed, else document fallback. Commit.
- [ ] **16. README + full manual pass:** build/setup/workflow docs; checklist: ASIO at 48 k/128, meters+clip, monitoring latency, tuner on all open strings, full grid capture, reshape, persistence, unplug/reconnect, no-signal. Commit.

## Post-plan

- UX polish pass deferred to spec's UX-revisit list — separate design session once the functional app exists.
- Worst-case cxx-juce failure is contained in `audio/engine.rs`: fall back to pinning its git main, or a minimal hand-rolled cxx bridge over juce_audio_devices.
