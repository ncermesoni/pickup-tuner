# Pickup Tuner — Requirements Design

**Date:** 2026-06-12
**Status:** Approved (requirements level — architecture deliberately deferred)

## Purpose

A small, focused Windows app that replaces the DAW for one job: physically
adjusting pickup height and pole piece height on an electric guitar. The user
sits with a screwdriver, guitar plugged into a Focusrite USB interface, and the
app provides trustworthy level readings plus audio monitoring — nothing else in
the way.

**Success criteria:** the user can balance string-to-string output within a
pickup, and level-match between pickups, faster and with more confidence than
by ear alone or via a DAW project.

## Target environment

- Windows 11, ASIO audio driver protocol (user's interface: Focusrite USB).
- macOS is not a target, but architecture decisions later should avoid
  needlessly precluding a future CoreAudio port.

## Workflow model

Free-form, not mode-based: the tuner, meters, and capture grid are all live
and visible simultaneously. The tuner and meters analyze the same input stream
concurrently. There are no wizard steps or screen switches — the user glances
at whatever they need while holding a screwdriver.

## Core features

### 1. Live metering (always running)

- One primary meter fed from the selected ASIO input channel, showing:
  - **Peak with hold** — captures the attack transient; hold is resettable.
  - **RMS / average level** — perceived loudness as the note rings.
- Units: dBFS.
- **Clipping indicator** — the app measures relative levels, but a clipped
  reading is invalid and must be visibly flagged.
- The same meters serve both single plucks and strumming. Strum checking is
  meters plus the user's ears (via monitoring); no strum-specific analysis.
- The user judges pluck-to-pluck consistency themselves — no guided capture,
  no averaging, no pluck detection.

### 2. Capture grid (the comparison tool)

- A grid of reading slots: **strings × pickups**.
  - String count configurable (e.g. 4–12; covers bass through 12-string).
  - Pickup count configurable (1–4).
- Capture flow (revised 2026-06-12 after first hands-on session): **armed
  capture**. Press a key or click to *arm*; the app waits for the next signal
  onset (threshold −45 dBFS) and measures a fixed 500 ms window from the
  attack. The window's peak and RMS become the slot's reading, stored
  automatically when the window completes. This decouples pressing the key
  from playing the note — instantaneous capture proved impossible to time
  against the attack transient. Arming is always manual — the user still
  controls what gets stored and where.
- The grid displays **deltas** so imbalance is visible at a glance:
  - String-to-string: each slot relative to a reference within its pickup row
    (e.g. the quietest string).
  - Pickup-to-pickup: row-level comparison (e.g. row averages).
  - Deltas are computed per metric (peak and RMS); which is shown by default
    and how is a UX decision (see UX-revisit list, item 4).
- Slots are individually re-capturable and clearable; whole grid is clearable.
- Readings captured while the clipping indicator is lit are flagged as
  untrustworthy in the grid.

### 3. Chromatic tuner (always running)

- Needle-style chromatic tuner: nearest note name + cents offset. No tuning
  presets — chromatic display makes string count and tuning irrelevant.
- Reference pitch A4 = 440 Hz, configurable.
- Workflow purpose: confirm a string is at pitch before trusting a level
  reading, and re-check after adjustments (pole pieces close to strings can
  pull tuning).

### 4. Monitoring

- Low-latency pass-through from the ASIO input to a selected ASIO output pair
  (headphones/speakers on the interface).
- Output level control and mute toggle.
- Clean pass-through only — no amp simulation, no effects.

### 5. Audio configuration

- ASIO device selection.
- Input channel selection (mono guitar input).
- Output channel pair selection for monitoring.
- Sample rate and buffer size selection.
- Button to open the device's native ASIO control panel.

## Persistence

- **Persists across launches:** audio device configuration, last-used grid
  shape (string/pickup counts), tuner reference pitch, monitor level/mute.
- **Ephemeral:** captured grid readings — every session starts with a blank
  grid. No per-guitar profiles, no saved sessions.

## Explicitly out of scope (YAGNI)

- VST hosting, amp simulation, effects
- Per-string strum separation / automatic outlier detection
- Spectrum or decay/sustain analysis views
- Recording, replay, A/B snapshots
- Per-guitar saved profiles
- Pitch-based auto-routing of readings into grid slots
- Absolute level targets / calibration
- Guided capture with averaging

## Error handling (requirements level)

- **Device disconnect / ASIO failure:** clear error state with an easy
  reconnect action; the app never crashes or hangs on driver failure.
- **Clipping:** indicator on the meter; captured-while-clipped readings are
  flagged in the grid.
- **No signal / wrong channel:** an obvious "no input" indication rather than
  silently showing zeros.
- **Device not available at startup:** app starts in an unconfigured state and
  prompts for device selection rather than failing.

## UX-revisit list (deferred)

Visual/interaction design decisions intentionally not made at the
requirements stage:

1. Visual layout of the free-form screen (meter / grid / tuner arrangement)
2. Tuner visual style (needle vs strobe vs bar)
3. Capture interaction details (keyboard shortcut scheme, slot selection flow)
4. Delta display format in the grid (colors, reference choice, dB precision)
5. Dark/light theme, overall visual identity ("modern UI" pass)
6. Whether the tuner is prominent or glanceable
7. macOS considerations (kept in mind during architecture, not built)
