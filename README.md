# Pickup Tuner

A small Windows app for adjusting guitar pickup height and pole piece height:
live peak/RMS meters, a strings × pickups capture grid for comparing levels,
a chromatic tuner, and low-latency ASIO monitoring.

## Build requirements

- Rust (stable, MSVC toolchain)
- Visual Studio 2022 Build Tools with C++ (cxx-juce compiles JUCE from source)
- CMake on PATH
- For ASIO: the Steinberg ASIO SDK — download from
  <https://www.steinberg.net/asiosdk>, extract, and set the environment
  variable `CXX_JUCE_ASIO_SDK_DIR=<path-to-extracted-sdk>`

## Build & run

    cargo run --release --features asio

Without `--features asio` the app still works using Windows Audio /
DirectSound drivers (higher latency; fine for development, not great for
monitoring feel).

If multiple Visual Studio installs are present and the build fails with
`LNK1104: cannot open file 'msvcrt.lib'`, run the build from a
"x64 Native Tools Command Prompt for VS 2022" (or call `vcvars64.bat`
first) so a toolchain with the desktop C++ libraries is selected.

## Workflow

1. Pick the driver (ASIO), your interface, sample rate, and buffer size in
   the right-hand panel. Choose the input channel your guitar is plugged
   into.
2. Tune the string — readings are only comparable in tune. The tuner is
   chromatic; any tuning and string count works.
3. Pluck, watch peak-hold/RMS, and press **Space** to capture into the
   selected grid slot. Work through strings × pickups. Each capture resets
   the peak hold for the next pluck.
4. Read the deltas: within a row, each cell shows dB above the quietest
   captured string (pole piece balance). Row averages compare pickups
   (overall height balance).
5. Strum and listen via monitoring; the meters help spot overall level
   jumps when switching pickups.

Captured readings are intentionally ephemeral — they describe screwdriver
positions that change as you work. Settings (device, grid shape, reference
pitch, monitor level) persist across launches.

## Notes

- A reading captured while the CLIP lamp is lit is marked with ⚠ in the
  grid — re-capture it; clipped numbers aren't comparable.
- cxx-juce 0.8 does not expose JUCE's "open ASIO control panel" call, so
  there is no control-panel button. Use Focusrite Control (or your
  interface vendor's tool) for driver-side settings.
- Sample-rate/buffer lists show what the open device reports; if no device
  is open yet, standard fallback values are listed and the hardware will
  coerce to the nearest supported value on Apply.
