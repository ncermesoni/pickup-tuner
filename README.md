# Pickup Tuner

A small Windows app for dialing in electric guitar pickup height and pole
piece height. It gives you live meters, a chromatic tuner, low-latency ASIO
monitoring, and a capture grid that turns level readings into physical
instructions: *raise this pole, lower that one, leave the rest alone*.

![workflow] guitar → audio interface (ASIO) → meters + tuner + capture grid

## Building

Requirements:

- Rust (stable, MSVC toolchain) and Visual Studio 2022 Build Tools with C++
  (cxx-juce compiles JUCE from source)
- CMake on PATH
- For ASIO: the Steinberg ASIO SDK — download from
  <https://www.steinberg.net/asiosdk>, extract it (this repo expects
  `third_party/ASIOSDK`, which is gitignored — the SDK may not be
  redistributed), and set the environment variable
  `CXX_JUCE_ASIO_SDK_DIR` to that folder.

Build and run:

    cargo run --release --features asio

Without `--features asio` the app still runs on Windows Audio / DirectSound —
fine for development, too laggy for monitoring feel.

If you have multiple Visual Studio installs and hit
`LNK1104: cannot open file 'msvcrt.lib'`, build from a
"x64 Native Tools Command Prompt for VS 2022" (or call `vcvars64.bat` first).

## Setting up your interface

In the right-hand panel:

1. **Driver** → ASIO. **Input/output device** → your interface
   (e.g. "Focusrite USB ASIO"). Changing a selection applies immediately;
   the "active:" line shows what the hardware actually accepted.
2. **Sample rate / buffer size** — 48000 / 128 is a good start. Smaller
   buffers = lower monitoring latency; if you hear crackles, go up a step.
3. **Input channel** — the physical input your guitar is plugged into.
4. **Monitoring** — gain and mute for hearing yourself through the
   interface outputs. Pure pass-through, no processing.
5. **Tuner** — reference pitch (A4), default 440 Hz.

Everything in this panel persists across launches. If the device disconnects
mid-session a "stopped" banner appears with a Reconnect button. A "no signal"
hint appears if the selected input stays silent for a few seconds.

## Tuning workflow

The display is free-form — meters, tuner, and grid are all live at once.

### 1. Get in tune

The tuner is chromatic (any tuning, any string count — set the string count
to match your instrument, 4 to 12). Level readings are only comparable on
in-tune strings, and pole pieces close to the strings can pull tuning, so
re-check as you adjust.

### 2. Set up the grid

- **strings / pickups** counts in the grid header. Reshaping keeps any
  readings that fit the new shape.
- Click a pickup's name field to rename it (Neck / Middle / Bridge…).
  Names persist.
- Columns run **S6 → S1** (low string on the left). Once you capture a
  string the column header also shows the note the tuner heard (E2, A2…).

### 3. Capture readings

1. Select a cell (click it, or move with the **arrow keys**).
2. Press **Space** (or "Arm capture"). Status shows *armed — pluck the
   string…*
3. Pluck. The app detects the attack and measures a 0.5 s window from it:
   the window's peak (attack) and RMS (how loud the note rings) land in the
   cell automatically, and selection advances to the next string.
4. Repeat: Space → pluck → Space → pluck, straight through the row.

**Esc** (or Space again) cancels an armed capture. Pluck consistently — same
pick attack, same spot relative to the pickup — and let notes ring; the
window measures half a second.

A **⚠** on a cell means the signal clipped during that capture. Lower your
interface's input gain and re-capture it — clipped readings aren't
comparable. (Watch the CLIP lamp on the meter; "Reset hold" clears it.)

### 4. Read the grid

Each captured cell shows the *action*, computed against that pickup row's
median string:

| Cell shows | Meaning |
|---|---|
| **✓** | within ±0.5 dB of the row median — leave this pole alone |
| **↓ 1.5** | 1.5 dB hotter than the row — lower this pole piece |
| **↑ 0.8** | 0.8 dB quieter than the row — raise this pole piece |

Cell color says the same at a glance: **green** balanced, **amber** within
2 dB, **red** beyond. The small number underneath is the absolute level in
dBFS. Hover any cell for the full explanation.

The **RMS / Peak** toggle switches the metric driving everything: RMS tracks
perceived loudness as the note rings (use this for balance); Peak tracks the
attack transient (spots strings that spike hard but don't ring — typical of
poles set too close).

Below the grid, pickup-to-pickup balance is written out in words, e.g.
*"Bridge vs Neck: +2.3 dB hotter — lower it or raise Neck"*. That's the
volume jump you hear flipping the selector switch; adjust overall pickup
height (the two outer screws) to close it.

### 5. Adjust and iterate

Adjust a pole piece or pickup height, re-capture that string (select its
cell, Space, pluck), and watch the deltas move. Note that deltas are measured
against the row *median*, so numbers shift slightly as the row's middle
moves — converge on green, not on chasing exact zeros.

For overall feel, strum while listening through monitoring and watch the
meters — a string that's "balanced" on single plucks but jumps out of a
strum is usually a Peak-metric problem.

Captured readings are deliberately **not saved** — they describe screwdriver
positions that change as you work. Each session starts with a blank grid.

## Notes & limitations

- No ASIO control panel button (the bindings don't expose it) — use
  Focusrite Control or your vendor's tool for driver-side settings.
- Monitoring outputs to all channels of the selected output device; there is
  no output-pair picker.
- The onset detector triggers at −45 dBFS. Very noisy single-coils idling
  near that level could self-trigger an armed capture — lower your input
  gain if captures fire without a pluck.

## License

This project is licensed under the GNU General Public License v3.0 or
later — see [LICENSE](LICENSE).

It builds against JUCE's `juce_core`, `juce_events`, `juce_audio_basics`,
and `juce_audio_devices` modules (ISC licensed) via the
[cxx-juce](https://github.com/JamesHallowell/cxx-juce) bindings
(MIT/Apache-2.0). The Steinberg ASIO SDK is **not** included in this
repository and may not be redistributed; download it from Steinberg and
accept their license to build with ASIO support.

ASIO is a trademark and software of Steinberg Media Technologies GmbH.
