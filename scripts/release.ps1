<#
.SYNOPSIS
  Cut a Pickup Tuner release: build the ASIO binary locally, bundle it with the
  VC++ redistributable, tag, and publish a GitHub Release.

.DESCRIPTION
  The single supported way to publish. Release binaries are built locally (this
  machine has the Steinberg ASIO SDK configured via CXX_JUCE_ASIO_SDK_DIR) so
  the shipped .exe is ASIO-enabled. CI never publishes.

.PARAMETER Version
  The release version, X.Y.Z. Must match `version` in Cargo.toml.

.PARAMETER DryRun
  Build, fetch the redist, and stage the zip, but do NOT tag, push, or publish.
  Use this to validate a release before cutting it for real.

.EXAMPLE
  pwsh scripts/release.ps1 0.1.0 -DryRun
  pwsh scripts/release.ps1 0.1.0
#>
param(
    [Parameter(Mandatory)][string]$Version,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$tag = "v$Version"
function Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }

# --- 1. preflight ----------------------------------------------------------
Step "Preflight checks"

if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    throw "Version must be X.Y.Z (got '$Version')."
}

$cargoVer = (Select-String -Path "Cargo.toml" -Pattern '^version\s*=\s*"([^"]+)"').Matches[0].Groups[1].Value
if ($cargoVer -ne $Version) {
    throw "Cargo.toml version ($cargoVer) != requested ($Version). Bump Cargo.toml first."
}

if (git status --porcelain) {
    throw "Working tree is not clean. Commit or stash before releasing."
}

if (git tag --list $tag) {
    throw "Tag $tag already exists."
}

if (-not $env:CXX_JUCE_ASIO_SDK_DIR) {
    throw "CXX_JUCE_ASIO_SDK_DIR is not set — required for the ASIO build."
}

# vcvars: the VS 2022 Build Tools toolchain known to work on this machine.
# (Default detection can pick a VS Insiders install that lacks the desktop CRT.)
$vcvars = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
if (-not (Test-Path $vcvars)) {
    throw "vcvars64.bat not found at:`n  $vcvars`nEdit this script to point at your VS 2022 (Build Tools) install."
}

if (-not $DryRun) {
    gh auth status 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "GitHub CLI not authenticated. Run: gh auth login" }
}

# changelog section for this version (used as the release body)
function Get-ReleaseNotes($version) {
    $lines = Get-Content "CHANGELOG.md"
    $start = -1; $end = $lines.Count
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "^##\s*\[$([regex]::Escape($version))\]") { $start = $i + 1; continue }
        # stop at the next version heading or the footer link-reference block
        if ($start -ge 0 -and ($lines[$i] -match "^##\s*\[" -or $lines[$i] -match "^\[[^\]]+\]:\s")) {
            $end = $i; break
        }
    }
    if ($start -lt 0) { throw "No '## [$version]' section in CHANGELOG.md." }
    ($lines[$start..($end - 1)] -join "`n").Trim()
}
$notes = Get-ReleaseNotes $Version
$notesFile = New-TemporaryFile
Set-Content -Path $notesFile -Value $notes -Encoding utf8

# --- 2. build --------------------------------------------------------------
Step "Building release (--features asio) in the VS 2022 environment"
cmd /c "`"$vcvars`" >nul 2>&1 && cargo build --release --features asio --locked"
if ($LASTEXITCODE -ne 0) { throw "Build failed." }
$exe = "target\release\pickup-tuner.exe"
if (-not (Test-Path $exe)) { throw "Expected binary not found at $exe." }

# --- 3. stage --------------------------------------------------------------
Step "Staging release bundle"
$stage = Join-Path $root "dist\$tag"
if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
New-Item -ItemType Directory -Force -Path $stage | Out-Null

Copy-Item $exe $stage
Copy-Item "LICENSE" $stage

Step "Downloading vc_redist.x64.exe"
Invoke-WebRequest -UseBasicParsing -Uri "https://aka.ms/vs/17/release/vc_redist.x64.exe" `
    -OutFile (Join-Path $stage "vc_redist.x64.exe")

$readme = @"
Pickup Tuner $tag — Windows x64
===============================

A tool for dialing in electric-guitar pickup height and pole pieces: live
meters, a chromatic tuner, low-latency ASIO monitoring, and a capture grid
that turns level readings into raise/lower pole-piece instructions.

RUNNING
  1. Unzip anywhere.
  2. Double-click pickup-tuner.exe.
  3. If Windows SmartScreen shows "Windows protected your PC", click
     "More info" -> "Run anyway". The app is open-source but unsigned.
  4. If it won't start with an error about a missing VCRUNTIME140.dll (or
     similar), run vc_redist.x64.exe once, then launch again. Most Windows
     10/11 machines already have this and won't need it.

AUDIO
  Built for ASIO interfaces (e.g. Focusrite). Choose your interface, sample
  rate, and buffer size in the right-hand panel. Without an ASIO device it
  falls back to Windows audio at higher latency.

Source, issues, and full docs: https://github.com/ncermesoni/pickup-tuner
License: GPL-3.0-or-later (see LICENSE).
"@
Set-Content -Path (Join-Path $stage "README.txt") -Value $readme -Encoding utf8

$zip = Join-Path $root "dist\pickup-tuner-$tag-windows-x64.zip"
if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip
Step "Staged $zip"

if ($DryRun) {
    Write-Host ""
    Write-Host "DRY RUN — not tagging or publishing." -ForegroundColor Yellow
    Write-Host "Bundle contents:" -ForegroundColor Yellow
    Get-ChildItem $stage | Select-Object Name, Length | Format-Table | Out-String | Write-Host
    Write-Host "Release notes that would be used:`n" -ForegroundColor Yellow
    Write-Host $notes
    Remove-Item $notesFile
    return
}

# --- 4. tag + publish ------------------------------------------------------
Step "Tagging $tag"
git tag -a $tag -m "Pickup Tuner $tag"
git push origin $tag

Step "Publishing GitHub release"
gh release create $tag $zip --title "Pickup Tuner $tag" --notes-file $notesFile
Remove-Item $notesFile

Step "Done: https://github.com/ncermesoni/pickup-tuner/releases/tag/$tag"
