# macOS Web Cursor And Icons Pass 018

Date: 2026-06-18

## Purpose

Replace the obvious placeholder cursor and menu/status icons with closer
`macos-web`-informed assets and glyph treatments.

The pass keeps UI Backlot surfaces editable while improving the visual details
that make the macOS shell read as fake: pointer shape, Apple menu glyph,
Control Center/Wi-Fi/battery status icons, and app icon treatment.

## Donor Inputs

- `reference/open-source/macos-web/public/cursors/normal-select.svg`
  - Used as a local-only cursor source for editable HTML demo surfaces.
- `reference/open-source/macos-web/src/css/theme.css`
  - Confirms the donor cursor variable structure.
- `reference/open-source/macos-web/src/components/TopBar/MenuBar.svelte`
  - Confirms the Apple menu is an icon glyph, not a hand-drawn blob.
- `reference/open-source/macos-web/src/components/TopBar/ActionCenterToggle.svelte`
  - Reference for status/control-center density in the right menu bar.
- `reference/open-source/macos-web/public/app-icons/keynote/256.png`
  - Used as a local-only presentation app icon source when the ignored donor
    clone is restored.

## Changes

- Replaced the CSS-triangle cursor with the `macos-web` normal-select SVG in:
  - `styles/workflow.css`
  - `surfaces/claude-mac-finder.html`
  - `surfaces/browser-app-surface.html`
  - `surfaces/calendar-app-surface.html`
  - `compositions/browser-app.html`
- Replaced the placeholder Apple blob with an SVG-mask Apple glyph in the main
  composition and standalone surfaces.
- Rebuilt right-side menu-bar status placeholders into icon-like Control
  Center, Wi-Fi, and battery shapes.
- Swapped the presentation app placeholder icon to the local `macos-web`
  Keynote icon path in standalone and embedded presentation contexts.

## Asset Decision

The cursor and app icon paths point into the ignored local donor clone. They
are useful for local fidelity passes, but are not committed or redistributed by
UI Backlot. A fresh checkout should run:

```bash
tools/clone-reference-repos.sh
```

before rendering surfaces that use donor icon/cursor paths.

## Verification

- `npm run capture:surface` completed and refreshed the Claude/Finder surface.
- `npm run capture:browser-app` completed and refreshed the browser surface.
- `npm run capture:calendar` completed and refreshed the Calendar surface.
- `npm run hf:lint` completed with `0 error(s), 3 warning(s), 2 info(s)`.
  The warnings are existing Studio editability warnings for GSAP-controlled
  timeline elements.
- `npm run hf:validate` completed with no console errors.
- `npm run hf:inspect` completed with zero layout issues across 9 sampled
  frames.
- `npm run hf:snapshot` refreshed 7 timeline snapshots and the contact sheet.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,625,166 bytes.
- `git diff --check` passed.

## Result

The macOS shell now has a recognizably native pointer, a real Apple menu glyph,
and status icons that read as menu-bar controls instead of decoration dots. The
surfaces are still hand-authored editable HTML/CSS, but they borrow the most
useful tiny fidelity details from `macos-web`.
