# Changelog

All notable changes to Pickup Tuner are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-06-14

First public release.

### Added
- Low-latency **ASIO** audio engine (via cxx-juce / JUCE) with input
  monitoring; falls back to Windows audio when no ASIO device is selected.
- **Dual-needle VU level meter** on an ivory dial — dark RMS needle, brass
  peak-hold needle, a labeled −60…0 dBFS scale, and clip indication.
- **Chromatic tuner** with a centered needle, in-tune band, and ♭/♯ marks.
- **Capture grid:** armed pluck-onset capture turns per-string peak/RMS
  readings into raise/lower pole-piece instructions against the pickup-row
  median, with pickup-to-pickup balance verdicts and auto-advance.
- Adjustable balance threshold, configurable A4 reference, monitor gain/mute,
  and editable pickup names.
- **Analog VU** visual identity — a vintage outboard / amplifier faceplate.
- Persistent settings (device, grid shape, pickup names, reference pitch).
- Release builds run windowless (Windows GUI subsystem).

[Unreleased]: https://github.com/ncermesoni/pickup-tuner/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ncermesoni/pickup-tuner/releases/tag/v0.1.0
