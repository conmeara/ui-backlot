# Claude Browser Workflow Pass 027

Date: 2026-06-18

## Purpose

Prove that UI Backlot can assemble a short HyperFrames-ready scene from only
the app surfaces a video needs. This pass adds a Claude-plus-browser wrapper
without importing Finder, PowerPoint, Calendar, Office, Figma, Premiere, or the
full root workflow.

## Evidence Used

- `compositions/claude-home.html`
  - Used as the editable Claude first-prompt/home state.
- `compositions/claude-app.html`
  - Used as the editable Claude working-thread state after the click.
- `compositions/browser-app.html`
  - Used as the editable browser/app background plate.
- `DESIGN.md`
  - Used for warm Mac backlot palette, Anthropic fonts, calm motion, precise
    cursor movement, and the rule that demo surfaces should remain editable.

## Changes

- Added `compositions/claude-browser-workflow.html`.
  - Defines `data-composition-id="claude-browser-workflow"`.
  - Adds `data-primitive="claude-browser-workflow"`.
  - Assembles local Claude home, Claude thread, and browser app components in
    isolated same-directory iframes.
  - Adds a minimal Mac menu bar, desktop field, cursor, click ring, browser
    plate reveal, Claude home-to-thread swap, and subtle drift.
  - Registers `window.__timelines["claude-browser-workflow"]`.
  - Supports `?capture=hero` so the static capture command records the useful
    mid-scene frame instead of GSAP's hidden start states.
- Added `npm run capture:claude-browser-workflow`.
- Added a direct-preview fallback to `compositions/browser-app.html` so the
  browser component can be captured outside the main workflow.
- Updated `PRIMITIVES.md`, `SURFACES.md`, `surfaces/README.md`, and
  `docs/research/open-source-ui-donor-repos.md`.

## Asset Decision

No new third-party code, product CSS, icons, private data, screenshots, or media
assets were copied. The wrapper uses already-local editable component files and
hand-authored HTML/CSS. The iframe boundary is a temporary assembly technique,
not a new runtime dependency.

## Verification

- `node tools/capture-web-ui.mjs compositions/browser-app.html --slug surface-browser-app-composition --selector '.embedded-browser-window' --viewport 1600x940`
  refreshed `captures/surface-browser-app-composition/target.png`.
- `npm run capture:claude-browser-workflow` refreshed
  `captures/surface-claude-browser-workflow/target.png`.
- `npm run hf:lint` passed with `0 error(s), 11 warning(s), 8 info(s)`.
  The new wrapper warning is the expected Studio editability warning for
  GSAP-owned choreography elements and a pointer-events note for iframe
  wrappers.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,681,689 bytes.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json ok')"`
  passed.
- `git diff --check` passed.

## Remaining Gaps

- The wrapper uses iframes, so the parent composition cannot yet directly seek
  or inspect child timelines. A later pass should replace this with direct
  HyperFrames subcomposition mounting or a tiny local component-loader contract.
- The browser app content is still generic; it should eventually be replaced by
  a real captured/rebuilt Airtable, Figma web, dashboard, or website surface.
- The Claude UI remains a hand-built approximation pending sanitized live
  Claude captures and more pixel-level refinement.
