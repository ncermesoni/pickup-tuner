---
name: pickup-tuner-design
description: Use this skill to generate well-branded interfaces and assets for Pickup Tuner (a Windows desktop app for tuning electric-guitar pickup height and pole pieces), in its Analog VU visual direction — vintage outboard / amplifier faceplate. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Orientation
- **Identity in one line:** Analog VU — a vintage outboard / amplifier faceplate. A **dark tweed chassis** frames warm **cream faceplate** panels and **ivory dial faces**; real analog instruments (a VU needle for level, a centered-needle dial for tuning). Values: accuracy, simplicity, readability, clean.
- **Tokens** live in `tokens/` and ship via `styles.css` — link that one file and use the semantic vars (`--surface-card`, `--surface-dial`, `--brass`, `--olive`, `--oxblood`, `--text-muted`, `--heat-balanced`, `--shadow-plate`/`--shadow-dial`/`--shadow-well`, `--grad-chassis`/`--grad-plate`…). Do not invent colors.
- **Depth is material, not flat.** Raised cream panels, recessed ivory dials, sunk dark wells, pressed enamel cells — use the five shadow tokens, plus corner screws / a brass model plate for hardware feel.
- **Three type voices:** **Oswald** (faceplate lettering), **Spectral** (the big tuner note + "VU" mark only), **JetBrains Mono** (every numeral). The tuner **centers** when in tune; the **VU meter** is where redlining is meaningful.
- **Components** are React, compiled into `_ds_bundle.js`. In an HTML file: link `styles.css`, `<script src=".../_ds_bundle.js">`, then `const { Button, Meter, GridCell, ... } = window.PickupTunerDesignSystem_<hash>` (run the design-system check to get the exact namespace) inside a `text/babel` block.
- **The full app** lives in `ui_kits/pickup-tuner/index.html`.
- **Iconography is Unicode glyphs** (`✓ ↑ ↓ ♭ ♯ ⚠ — ▾`), no icon font, **no emoji**. Copy is lowercase, instructional, second-person; status is terse and present-tense.

See `readme.md` for the full content, visual, and iconography guidance.
