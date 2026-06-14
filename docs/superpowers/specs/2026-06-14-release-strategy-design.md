# Pickup Tuner — Release Strategy Design

**Date:** 2026-06-14
**Status:** Approved (design level)

## Purpose

Define how Pickup Tuner ships to the public: how release binaries are built,
what they contain, how versions are cut, and what continuous integration
guards the codebase. The app is a Windows-only, GPL-3.0 Rust/egui desktop
tool that builds against JUCE via `cxx-juce` and, for the shipped binary, the
non-redistributable Steinberg ASIO SDK.

**Audience:** public — other guitarists with an audio interface. Implies a
clean first-run experience and a tidy Releases page, but **not** code signing,
an installer, or auto-update (explicitly out of scope for now).

## Key constraints

- **ASIO SDK is non-redistributable** and is not in the repo. An
  ASIO-*enabled* `.exe` is fine to ship — the SDK is C++ headers compiled into
  the binary, not redistributed as files. The SDK *source* may not be
  committed or published.
- The `asio` Cargo feature is a pure pass-through to `cxx-juce`
  (`asio = ["cxx-juce/asio"]`). There is **no `#[cfg(feature = "asio")]` in our
  own source** — the flag only selects JUCE's C++ audio backend.
- **Dynamic MSVC CRT** by default: the `.exe` needs Microsoft's VC++
  2015–2022 redistributable on the target machine.
- **GPL-3.0:** source must be available with binaries (GitHub Release pages
  auto-attach source archives, satisfying this).
- Bundled fonts (`assets/fonts/`, OFL) are redistributable.

## Versioning & tagging

- **Semantic versioning.** Currently `0.1.0`; pre-1.0 while stabilizing
  (minor = features, patch = fixes).
- Releases are driven by annotated git tags `vMAJOR.MINOR.PATCH`
  (e.g. `v0.1.0`).
- **`Cargo.toml`'s `version` is the source of truth.** The release script
  refuses to publish if the requested version does not match `Cargo.toml`.
- First release is `v0.1.0` cut from the current `main`.

## Build method

Release binaries are built **locally**, on a machine where the ASIO SDK is
configured via `CXX_JUCE_ASIO_SDK_DIR`, so the shipped `.exe` is ASIO-enabled:

- `cargo build --release --features asio`, run inside the VS 2022 Build Tools
  environment (`vcvars64.bat`) — the project's established build path.
- The binary already targets the Windows GUI subsystem in release
  (`windows_subsystem = "windows"`), so no console window appears.

CI does **not** build release artifacts and never publishes.

## Artifacts

One zip per release: **`pickup-tuner-vX.Y.Z-windows-x64.zip`**, containing:

- `pickup-tuner.exe` — the ASIO-enabled release build (fonts baked in).
- `vc_redist.x64.exe` — the official Microsoft redistributable, downloaded
  fresh at build time from `https://aka.ms/vs/17/release/vc_redist.x64.exe`.
  **Not committed to the repo.**
- `README.txt` — short run instructions: unzip; if the app won't open, run
  `vc_redist.x64.exe` first; the Windows SmartScreen note ("More info → Run
  anyway", because the binary is unsigned); the ASIO/interface note.
- `LICENSE` — GPL-3.0 (copied from the repo).

GitHub auto-attaches "Source code (zip/tar.gz)" to the release, covering GPL
source availability. The bare `.exe` is **not** offered as a separate asset —
the redist bundle is the single supported download.

## Release process — `scripts/release.ps1 <version>`

A single PowerShell script the maintainer runs to cut a release. Steps:

1. **Preflight:** working tree is clean; `<version>` matches `Cargo.toml`'s
   `version`; the tag `v<version>` does not already exist; `gh` is
   authenticated; `CXX_JUCE_ASIO_SDK_DIR` is set.
2. **Build:** `cargo build --release --features asio` inside the VS env.
3. **Fetch redist:** download `vc_redist.x64.exe` to a staging dir.
4. **Stage:** assemble the staging dir (exe + redist + generated `README.txt`
   + `LICENSE`) and zip it as `pickup-tuner-vX.Y.Z-windows-x64.zip`.
5. **Tag:** `git tag -a vX.Y.Z -m "..."` and `git push origin vX.Y.Z`.
6. **Publish:** `gh release create vX.Y.Z <zip> --title ... --notes-file <notes>`,
   where the notes are the matching section extracted from `CHANGELOG.md`.

The script is the only supported way to publish, so the artifact layout and
preflight checks can't be skipped by hand.

## Continuous integration — `.github/workflows/ci.yml`

A health check on every push and pull request to `main`. **Publishes nothing.**

- Runner: `windows-latest` (ships VS 2022 + CMake, so the MSVC toolchain and
  the `cxx-juce`/JUCE CMake build work without extra setup).
- Steps:
  1. `cargo build --release` — default feature set (**non-ASIO**; needs no
     SDK). Confirms the whole workspace, including the `main` binary, compiles
     and links.
  2. `cargo test` — all unit tests (pure DSP/model; none touch ASIO).
  3. `cargo clippy --all-targets -- -D warnings` — lint gate.
- Caching: cargo registry + `target/` (and thus the compiled JUCE objects) via
  `Swatinem/rust-cache` or equivalent, to keep the JUCE-from-source compile
  off the critical path on repeat runs.

**Coverage note:** because the `asio` flag changes none of our Rust source, the
non-ASIO CI build compiles 100% of our code and runs every test and lint. The
only thing it does not exercise is JUCE's ASIO C++ backend link — not our code,
rarely a source of breakage, and proven by every local release build. This gap
is accepted; closing it would require injecting the SDK into CI as a secret,
which is deliberately out of scope.

## Release notes / changelog

- A `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com) style,
  with an `## [X.Y.Z] - DATE` section per release and an `## [Unreleased]`
  section at the top for in-progress work.
- The release script extracts the section matching the version being cut and
  uses it as the GitHub release body, so the Releases page reads as a clean
  history.

## Out of scope (for now)

- Code signing / EV certificate (binaries are unsigned; SmartScreen is
  documented, not suppressed).
- Installer (MSI/NSIS) and auto-update.
- Injecting the ASIO SDK into CI to build/verify the ASIO link path.
- macOS/Linux builds (Windows-only product).
- Non-x64 targets (arm64).
