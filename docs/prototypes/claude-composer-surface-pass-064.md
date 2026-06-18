# Claude Composer Surface Pass 064

## Goal

Split the Claude working composer into its own HyperFrames-ready component so a
future video can mount only the prompt card over browser, Finder, Office, or
design-editor scenes without importing the full Claude sidebar, transcript,
right rail, or answer content.

## Source Evidence

- `compositions/claude-app.html`
- `captures/surface-claude-app/target.png`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `docs/prototypes/claude-cinematic-reply-split-pass-063.md`

## Changes

- Added `compositions/claude-composer.html`.
  - Defines `#claude-composer-surface` as a 900x220 composition boundary.
  - Adds a padded `.claude-composer-stage` capture boundary so soft prompt-card
    shadows are visible in direct screenshots.
  - Keeps the core editable composer content: `Launch Deck`,
    `slide-notes.md`, `2 attached`, `Reply...`, attach, Work in a folder,
    Research, mic, and running stop-state button.
  - Includes a finite GSAP entrance/control stagger and running-button pulse.
- Added `npm run capture:claude-composer`.
- Added the `claude-composer` component entry to `surfaces/registry.json`.
- Updated `SURFACES.md`, `PRIMITIVES.md`, and `surfaces/README.md`.

## Asset Decision

Hand-authored HTML/CSS only. This pass does not copy Claude product code,
screenshots, launch-video frames, private app data, donor runtime code, or app
assets. The component remains a safe reconstruction until a sanitized live
Claude composer capture is available for closer pixel comparison.

## Capture

- `npm run capture:claude-composer`
  - Output: `captures/surface-claude-composer/target.png`
  - Visual inspection confirmed the prompt card renders as a standalone
    floating composer with attachment chips, folder/research controls, mic
    affordance, and running stop-state button.

## Verification

- `npm run registry:check`
  - Surface registry OK: 29 surfaces, 16 components, 11 workflows, 29 ready
    captures.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  - `json ok`
- `git diff --check`
  - Clean.
- `npm run hf:lint`
  - 0 errors, 26 warnings, 18 info.
  - New warning is the expected `gsap_studio_edit_blocked` notice for the
    composer timeline, matching the existing animated component pattern.
- `npm run hf:validate`
  - No console errors.
- `npm run hf:inspect`
  - `ok: true`, `issueCount: 0`.
- `npm run hf:snapshot`
  - Refreshed `snapshots/frame-00-at-1.0s.png` through
    `snapshots/frame-06-at-15.0s.png` and `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Output: `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2741607`
- Final `git diff --check`
  - Clean.
