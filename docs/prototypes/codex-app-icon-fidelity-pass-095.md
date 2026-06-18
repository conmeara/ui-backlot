# Codex App Icon Fidelity Pass 095

Date: 2026-06-18.

## Purpose

Tighten the icon language in `compositions/codex-app.html` after the official
screenshot pass. The shell, layout, composer, and review pane were much closer,
but the icons still felt like chunky CSS approximations rather than the thin,
rounded, native-app strokes visible in the Codex app screenshots.

## References

- `reference/codex/app-screenshots/app-screenshot-light.webp`: sidebar,
  titlebar, composer, and review icon density.
- `reference/codex/app-screenshots/git-commit-light.webp`: Review pane toolbar,
  diff controls, and floating action controls.
- `reference/codex/app-screenshots/modes-light.webp`: composer mode icons and
  low-contrast control treatment.

These were used as visual references only. No OpenAI product icons, screenshot
pixels, app code, bundle assets, or product CSS were copied.

## Changes

- Added a local inline SVG symbol set for the editable Codex surface.
- Replaced high-visibility pseudo-element icons with thin rounded SVG strokes:
  sidebar toggle, back/forward, New chat, Search, Plugins, Automations, pins,
  folders, settings, more menus, VS Code selector, commit sliders, terminal,
  layout toggle, composer controls, work-local/branch metadata, review toolbar,
  file-plus, expand, diff-display, undo, and stage-plus actions.
- Added CSS icon normalization so the surface uses consistent dimensions,
  stroke width, line caps, and muted colors across sidebar, topbar, composer,
  and Review pane icons.
- Removed the old pseudo-element overlays from the replaced controls so the
  SVG strokes render cleanly.
- Adjusted the settings symbol after visual inspection so it reads as a compact
  gear rather than a sun-like control.

## Before / After

- Before this pass: `captures/surface-codex-app/target.png` from pass 094 had
  the right shell but several CSS-drawn icons were too heavy, literal, or
  mis-shaped.
- After this pass: `captures/surface-codex-app/target.png` now shows editable
  outline icons with a closer product-like stroke rhythm.

## Verification

- `npm run capture:codex-app`
  - Passed and refreshed `captures/surface-codex-app/target.png`.
  - Visual inspection confirmed the new SVG icons render in the sidebar,
    titlebar, composer, review pane, and floating actions with no obvious
    missing glyphs or layout collisions.

## Remaining Deltas

- The icons are hand-authored approximations, not official Codex/OpenAI icon
  assets.
- Some exact glyph choices may still differ from the live app because the
  source references are screenshots rather than inspectable vector assets.
- A sanitized live Codex desktop capture would still be useful to tune exact
  icon sizing, opacity, and toolbar spacing.
