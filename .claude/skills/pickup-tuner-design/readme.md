# Pickup Tuner — Design System

A design system for **Pickup Tuner**, a small, focused Windows desktop app that
replaces the DAW for one job: physically dialing in **electric-guitar pickup
height and pole-piece height**. The user sits with a screwdriver, guitar plugged
into an audio interface (ASIO), and the app gives trustworthy level readings,
a chromatic tuner, low-latency monitoring, and a **capture grid** that turns
those readings into physical instructions — *raise this pole, lower that one,
leave the rest alone*.

> Values that drive every decision here: **accuracy, simplicity, readability,
> clean.** This is an instrument, not a website. It is read at arm's length,
> one-handed, while doing something else.
>
> **Visual direction: Analog VU** — a vintage outboard / amplifier aesthetic
> (dark tweed chassis, cream faceplate panels, real analog VU + needle-tuner
> dials). See **Visual foundations** below.

---

## Sources

This system was reverse-engineered from the product's own source. Explore these
to build more faithfully — the Rust/egui UI code is the single source of truth
for color, layout, and copy:

- **GitHub:** `ncermesoni/pickup-tuner` — <https://github.com/ncermesoni/pickup-tuner>
  - `src/ui/theme.rs` — the original "rack-gear" dark identity. Its **color
    meanings** (green/amber/red as status) carry into this system; its flat dark
    surfaces were redesigned to the **Analog VU** direction with the user.
  - `src/ui/meter.rs`, `tuner.rs`, `grid.rs`, `config.rs`, `app.rs` — the exact
    layout and behavior the `Meter`, `Tuner`, `GridCell` and UI-kit screens recreate.
  - `README.md` and `docs/superpowers/specs/2026-06-12-pickup-tuner-design.md` —
    workflow, copy voice, and product rationale.

The app is **Windows-only, dark-only**. There is no marketing site, no mobile
app, no light theme — a deliberately small surface area. This system models that
one screen and its parts.

---

## Content fundamentals

How Pickup Tuner writes. The voice is a **patient bench tech standing over your
shoulder** — instructional, lowercase, physical, never chatty.

- **Lowercase, sentence-fragment captions.** Section labels are short and
  spaced-uppercase (`LEVEL`, `CAPTURE GRID`, `TUNER`). Body hints are lowercase
  and run-on: *"each cell: distance from that pickup's median string · ↑ raise
  pole · ↓ lower pole · ✓ balanced"*.
- **Instructions, not data.** A cell never just reports `+1.5 dB`; it says
  `↓ 1.5` — *lower this pole piece*. Copy is phrased as the physical action the
  user should take. Verdicts are written in words: *"Bridge vs Neck: +2.3 dB
  hotter — lower it or raise Neck"*.
- **Second person, imperative.** *"Pluck the string and let the note ring."*
  *"Lower your interface's input gain and re-capture it."* The app addresses
  **you**; it never says "we".
- **Status is terse and present-tense.** *"armed — pluck the string…"*,
  *"capturing…"*, *"audio device stopped"*, *"no signal on input 1 — check
  cable/channel"*. Lowercase, often trailing with an ellipsis while waiting.
  Hard alarms are the exception: **`CLIP`** is uppercase and bold.
- **Units are explicit and consistent.** Everything is `dBFS` / `dB` / `Hz` /
  `cents` / `samples`. Numbers carry one decimal of precision (`−14.2`, `+0.8`),
  never more — false precision reads as untrustworthy.
- **The middle dot `·` is the connective tissue.** It joins facets on one line
  (`+0 cents · 440.0 Hz`, `pole · height · balance`). Em-dashes set off the
  consequence (`stopped — Reconnect`).
- **No emoji, ever.** Meaning is carried by a tiny, fixed set of Unicode glyphs
  (see Iconography). No marketing adjectives, no exclamation points, no
  personality flourishes. If a word doesn't help someone holding a screwdriver,
  it's cut.

**Naming.** Pickups default to **Neck** / **Bridge** (then *Pickup 3*, *Pickup
4*). Strings are **S6 → S1**, low string on the left, the way a guitarist counts.

---

## Visual foundations

> **Direction: Analog VU.** The interface is a piece of **vintage outboard
> studio gear** — a dark **tweed chassis** framing warm **cream faceplate**
> panels, with real analog instruments (a VU needle for level, a centered-needle
> dial for tuning). It keeps the product's values — accuracy, simplicity,
> readability — but trades the flat dark UI for tactile, guitar-culture
> materiality. *(The original code's "rack-gear" dark theme in `theme.rs` was the
> starting point; this is a deliberate, user-approved redesign — its color
> meanings carry over, its flat surfaces do not.)*

### Color
- **Dark tweed chassis** is the app background — a radial cabinet gradient from
  `#2E2218` (lit top) to `#1A120B` (shadow). It frames everything like the body
  of an amp.
- **Cream faceplate panels** sit on the chassis: a `#EFE4CA → #E0D2B0` gradient
  with a machined hairline edge (`#C9BB98`) and a top bevel highlight. This is
  where controls live.
- **Ivory dial faces** (`#F6EED8 → #E9DCBB`) are the recessed instrument windows
  — the VU meter and the tuner. Slightly lighter than the faceplate, gently
  vignetted, so they read as glass over a printed scale.
- **Accents are a small metallic/enamel set, and they mean things.** **Brass**
  `#CAA24A` = power lamp, model plate, selection, control handles. **Olive**
  `#6AA043` = in tune / balanced / capturing. **Amber** `#D6A24E` = armed /
  getting hot / caution. **Oxblood** `#B0392C` = hot / clipping / error. No
  blues, no purples, no gradients beyond the material ones.
- **Heatmap enamels are vivid** so the dark ink on top reads at a glance:
  balanced `#8AA857` (clear green), close `#E2B54C` (gold), beyond `#C8694F`
  (terracotta), empty `#DED0AD` (dim faceplate).
- **Ink, not white text.** Type on cream is dark: `#241B10` for dial figures,
  `#2C2114` for labels, `#8A7A56` for engraved captions. On the dark chassis,
  lettering is warm cream `#E8DCC0`.

### Type
- **Three voices, strict roles.** **Oswald** (a tall, narrow condensed grotesque)
  is the faceplate lettering — titles, captions, control labels, row names; it
  echoes silkscreened amp panels. **Spectral** (a warm serif) is used *only* for
  the big tuner note and the "VU" dial mark — the one engraved-instrument moment.
  **JetBrains Mono** sets *every numeral* so dB / Hz / cents columns align like a
  meter readout.
  - *Web substitution:* the desktop app renders numerals in Cascadia Mono /
    Consolas, which aren't redistributable, so JetBrains Mono stands in. **Flag:**
    supply those font files if you want exact desktop fidelity.
- **Engraved captions are spaced uppercase Oswald** at 11px (`letter-spacing:
  0.2em`) — silkscreen on a panel.
- **The tuner note is the one display moment** — Spectral 50px. Everything else
  is small and dense; one screen, lots of information.

### Space, shape & surface
- **Tight 4px grid.** Capture cells are `88×44` with a `5px` gap; panel padding
  is `13px`.
- **Three machined radii:** `4px` (cells, buttons), `6px` (panels, dial faces),
  `10px` (the whole chassis). Never pill, never sharp.
- **Depth comes from material bevels, not flat fills.** Raised faceplate panels
  have a top highlight + cast shadow (`--shadow-plate`); dial faces are recessed
  with an inner highlight + vignette (`--shadow-dial`); text fields are dark
  wells sunk into the plate (`--shadow-well`); buttons are raised cream chips
  (`--shadow-btn`); heatmap cells are pressed enamel (`--shadow-cell`). These
  five shadow tokens are the heart of the look — reach for them, don't invent.
- **Hardware details sell it:** corner mounting **screws** on the chassis, a
  bar-graph silkscreen mark by the wordmark, a brass **model plate** (`PT-V`).

### Motion & states
- **Almost no UI animation.** The liveness is the *instruments* — the VU needle
  and tuner needle move in real time; that physical motion is the language.
- **Hover = one step lighter cream.** Controls go `#E7D9B9 → #F1E6CB`, ~90ms.
  **Press = a 0.5px nudge down.** That's the whole interaction vocabulary.
- **Focus = a brass ring.** The selected grid cell gets a 2px brass inset stroke;
  focused text fields get a brass outline. Selection in menus is a brass wash.
- **The tuner centers when in tune** (needle straight up, olive enamel band lit) —
  it is a pitch tuner, not an RPM gauge. The **VU meter** is where redlining
  happens: the needle rests on RMS and the oxblood zone lives near 0 dBFS.

### Imagery
There is **no photography or illustration** — the only "images" are the live
analog instruments (VU arc, tuner dial, heatmap). The brand mark is a silkscreen
wordmark with a bar-graph glyph and a brass model plate, like the front of a
rack unit.

---

## Iconography

**There is no icon library, icon font, or SVG set.** Iconography is a small,
fixed vocabulary of **Unicode glyphs**, rendered in the UI font (the desktop app
falls back to *Segoe UI Symbol* for them). This is deliberate — the symbols
carry physical meaning and nothing more is needed.

| Glyph | Code | Meaning |
|---|---|---|
| `✓` | U+2713 | balanced — leave this pole alone (olive) |
| `↑` | U+2191 | raise this pole piece (quieter than the row) |
| `↓` | U+2193 | lower this pole piece (hotter than the row) |
| `♭` | U+266D | flat — tuner needle left of center (Spectral serif) |
| `♯` | U+266F | sharp — tuner needle right of center (Spectral serif) |
| `⚠` | U+26A0 | the capture clipped — re-capture with less gain (oxblood) |
| `—` | U+2014 | empty / not captured yet |
| `▾` | U+25BE | combo box / dropdown affordance |
| `·` | U+00B7 | facet separator in copy |

When you build new surfaces in this brand, **reach for a Unicode glyph before an
icon**. If a genuine icon is unavoidable, match the spirit: thin, monochrome,
inheriting text color, never filled or multicolor. **No emoji.**

> Note: the source repo ships no raster assets (logo PNG/SVG, imagery) — it's a
> code-drawn UI — so `assets/` here holds only the brand mark expressed in CSS
> (`guidelines/brand-wordmark.card.html`). If a real logo exists, drop it in
> `assets/` and update this section.

---

## Index

Root manifest of this system.

- **`styles.css`** — the one file consumers link. `@import`s only.
- **`tokens/`** — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
  All custom properties live here; reference the semantic aliases (`--surface-card`,
  `--surface-dial`, `--brass`, `--olive`, `--text-muted`, `--heat-balanced`,
  `--shadow-plate`…).
- **`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Brand)
  shown in the Design System tab.
- **`components/`** — reusable React primitives (compiled into `_ds_bundle.js`,
  reachable as `window.PickupTunerDesignSystem_<hash>.<Name>`):
  - **`forms/`** — `Button`, `Select`, `Slider`, `Checkbox`, `TextField`,
    `Stepper`, `SegmentedToggle`.
  - **`layout/`** — `Panel`, `SectionLabel`, `StatusBadge`.
  - **`instruments/`** — `Meter`, `Tuner`, `GridCell` (the signature parts).
- **`ui_kits/pickup-tuner/`** — the full, clickable single-screen app
  recreation (`index.html` + `StatusBar` / `ConfigPanel` / `CaptureGrid` /
  `App` + `model.js`). Simulated audio; the whole capture workflow works.
- **`SKILL.md`** — portable Agent-Skill entry point.

### Component quick reference

| Component | What it is |
|---|---|
| `Button` | raised faceplate button (default / small; tinted label optional) |
| `Select` | combo box, label to the right |
| `Slider` | recessed track + brass handle, live mono readout (gain, A4, balance) |
| `Checkbox` | raised faceplate box + clickable label (Mute) |
| `TextField` | singleline input in a recessed dark well (pickup rename) |
| `Stepper` | compact integer stepper (strings / pickups counts) |
| `SegmentedToggle` | the RMS / Peak metric switch |
| `Panel` / `SectionLabel` | cream faceplate panel + its engraved caption |
| `StatusBadge` | inline enamel status text + lamp (armed / CLIP / …) |
| `Meter` | analog VU level needle on an ivory dial (rms + brass hold) |
| `Tuner` | centered-needle chromatic tuner (up = in tune, ♭ / ♯) |
| `GridCell` | one capture cell — enamel heatmap + raise/lower instruction |
