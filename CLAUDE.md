# Pickup Tuner — project notes

A Windows-only, GPL-3.0 Rust/egui desktop app for tuning electric-guitar pickup
height and pole pieces. Audio runs through JUCE (via `cxx-juce`) using ASIO.

## Build environment

cargo's default toolchain detection on this machine picks a VS Insiders install
that lacks the desktop CRT (`LNK1104: cannot open file 'msvcrt.lib'`). Always
build through the **VS 2022 Build Tools** environment:

```sh
cmd /c '"C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat" >nul 2>&1 && cargo <args>'
```

The `asio` feature compiles JUCE's ASIO backend and needs the Steinberg ASIO SDK
(not in the repo, not redistributable). It lives at `third_party/ASIOSDK`
(gitignored) with `CXX_JUCE_ASIO_SDK_DIR` set to it (user-level). Build the
shipping binary with `--features asio`; without it the app falls back to
WASAPI/DirectSound.

## Release procedure

Releases are built **locally** (so the binary is ASIO-enabled) and published via
`scripts/release.ps1`. CI never publishes — it only builds the non-ASIO config +
tests + clippy as a guard.

**Prerequisites:** `CXX_JUCE_ASIO_SDK_DIR` set, `gh` authenticated (needs the
`workflow` scope to push CI changes), VS 2022 Build Tools installed.

To cut version `X.Y.Z`:

1. Land all changes on `main` and confirm **CI is green** (`gh run list`).
2. Bump `version` in `Cargo.toml` to `X.Y.Z` (semver; pre-1.0 → minor = features,
   patch = fixes).
3. Add a `## [X.Y.Z] - YYYY-MM-DD` section to `CHANGELOG.md` (move the
   `[Unreleased]` items into it) and update the link references at the bottom.
4. Commit and push (1–3 must be committed — the script refuses a dirty *tracked*
   tree; untracked files are ignored).
5. Dry-run, then publish:
   ```sh
   pwsh scripts/release.ps1 X.Y.Z -DryRun   # builds + stages the zip, no tag/publish
   pwsh scripts/release.ps1 X.Y.Z           # tags, pushes the tag, publishes
   ```
   The script preflights (clean tracked tree, version matches `Cargo.toml`, tag
   is free, SDK set, gh authed), builds `--release --features asio`, downloads
   `vc_redist.x64.exe`, stages `pickup-tuner-vX.Y.Z-windows-x64.zip` (exe +
   redist + `README.txt` + `LICENSE`), tags `vX.Y.Z`, and runs `gh release
   create` with notes lifted from the matching `CHANGELOG.md` section.
6. Verify: `gh release view vX.Y.Z`.

Notes:
- The binary is **unsigned** — first-run users get the SmartScreen "More info →
  Run anyway" prompt; this is documented in the bundled `README.txt`.
- `/dist/` (release staging) is gitignored.
- GitHub auto-attaches source archives to the release, covering GPL source
  availability.
