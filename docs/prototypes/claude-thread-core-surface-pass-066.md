# Claude Thread Core Surface Pass 066

## Goal

Split the central Claude working-thread pane into its own HyperFrames-ready
component so future videos can show the active transcript and tool-use state
without importing the full Claude sidebar, composer, task rail, or outer app
shell.

## Source Evidence

- `compositions/claude-app.html`
- `captures/surface-claude-app/target.png`
- `compositions/claude-composer.html`
- `compositions/claude-agent-rail.html`
- `docs/prototypes/claude-app-reference-focus-pass-060.md`

## Changes

- Added `compositions/claude-thread-core.html`.
  - Defines `#claude-thread-core-surface` as a 980x840 composition boundary.
  - Adds a padded `.claude-thread-core-stage` capture boundary so the central
    pane shadow is visible in direct screenshots.
  - Keeps the core editable thread states: topbar, model selector, user prompt
    bubble, folder context strip, assistant response, reasoning card, progress
    rows, local plan preview, and message actions.
  - Excludes sidebar, composer, task rail, and outer app window so those can be
    combined separately with `claude-composer` and `claude-agent-rail`.
  - Includes a finite GSAP entrance, typing-mask reveal, card reveals, message
    action reveal, and active tool spinner.
- Added `npm run capture:claude-thread-core`.
- Added the `claude-thread-core` component entry to `surfaces/registry.json`.
- Updated `SURFACES.md`, `PRIMITIVES.md`, and `surfaces/README.md`.

## Asset Decision

Hand-authored HTML/CSS only. This pass does not copy Claude product code,
screenshots, launch-video frames, private project data, donor runtime code, or
app assets. The component remains a safe reconstruction until a sanitized live
Claude working-thread capture is available for closer pixel comparison.

## Capture

- Ran `npm run capture:claude-thread-core`.
- Output: `captures/surface-claude-thread-core/target.png`.
- Framing notes:
  - The first 980x680 pass clipped the local plan preview and message actions.
  - The 980x780 pass preserved the local plan preview but still missed the
    bottom action row.
  - The final 980x840 pass preserves the full reusable thread pane, including
    command preview, message actions, panel shadow, and capture padding.

## Verification

- `npm run registry:check`
  - `Surface registry OK: 31 surfaces, 18 components, 11 workflows, 31 ready captures.`
- `node -e "JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  - `json ok`
- `git diff --check`
  - clean before the prototype-note update.
- `npm run hf:lint`
  - `0 error(s), 28 warning(s), 20 info(s)`.
  - The new thread-core composition only contributes expected editability and
    pointer-event notes for animated GSAP targets and inert decorative layers.
- `npm run hf:validate`
  - `No console errors`
- `npm run hf:inspect`
  - `ok: true`
  - `issueCount: 0`
- `npm run hf:snapshot`
  - Refreshed `snapshots/frame-00-at-1.0s.png` through
    `snapshots/frame-06-at-15.0s.png` and `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Output: `renders/claude-keynote-workflow-draft.mp4`
  - Render completed in 37.3s.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2740508`
