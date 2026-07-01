# Abstraction + Real Icons Fidelity Pass (Pass 098)

Date: 2026-07-01. Follows pass 097.

## Principle

Abstract before you approximate: a control that cannot be rendered at the
right size, font, and icon is removed rather than squeezed. Fewer correct
controls read as the real app; crowded approximations break the illusion.

## Changes

- `compositions/presentation-editor.html`: ribbon rebuilt as a simplified
  Microsoft 365 for Mac Home tab — 6 groups (Paste, New Slide, Font,
  Paragraph, Drawing, Editing) instead of 8; Draw/Arrange groups and the
  fake shape gallery removed; all glyphs are now vendored Fluent UI symbols
  (MIT) from `assets/icons/sprite-manifest.json` (first surface to consume
  the office sprite); split-button chevrons sit under labels; labels 10px+
  and single-line. Slide thumbnails are now miniature replicas of their
  slides: thumb 1 mirrors the dark title slide (scaled title text, ghost
  bars), thumbs 2-4 use consistent chart/table/bullet minis instead of the
  old green mosaic art.
- `compositions/claude-app.html`: chrome type normalized to measured
  real-app scale — rail titles 20→17px/600, stepper circles 31→26px, step
  rows 16→14px, New task 18→15px, sidebar footnote 16→12.5px, avatar
  42→36px, account name 17→14px, user bubble 17→16px/1.45, model selector
  20→14.5px, send button 43→38px.
- `compositions/word-editor.html` / `excel-workbook.html`: Fluent sprite
  icons wired into ribbons; overcrowded controls removed or resized
  (delegated agent; see its report in session).
- Sizing sanity sweep (delegated): browser inspector fake Unicode glyphs →
  real sprite icons + search icon; figma-onboarding 5.5px stat labels →
  legible 9px two-line; premiere duration badge moved onto the thumbnail
  (real Premiere convention) ending filename collision. Codex, figma-editor,
  calendar audited clean.

## Verification

Captures re-run per surface plus a full sweep; registry/catalog/inspect
gates green (lint/validate carry the pre-existing issues documented in
pass 097). Inventory sheet regenerated.

## Remaining

- Fluent icons not yet adopted in the Word/Excel titlebars' small controls.
- PowerPoint ribbon remaining tabs (Insert/Design/...) are label-only; fine
  while inactive.
- Thumbnail minis are hand-scaled, not generated from canvas state; if the
  canvas slide content changes, thumb 1 must be updated to match.
