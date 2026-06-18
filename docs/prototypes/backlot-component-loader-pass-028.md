# Backlot Component Loader Pass 028

Date: 2026-06-18

## Purpose

Replace the first Claude/browser wrapper's visible iframe assembly with a
small reusable loader that mounts local component template roots directly into
the parent DOM. This moves UI Backlot closer to a component library where a
video can import only the surfaces it needs while preserving editable HTML/CSS
inside each source composition file.

## Evidence Used

- `compositions/claude-browser-workflow.html`
  - The wrapper from pass 027 that previously assembled Claude and browser
    components through visible same-directory iframes.
- `compositions/claude-home.html`
  - Source template for the Claude first-prompt/home state.
- `compositions/claude-app.html`
  - Source template for the Claude working-thread state.
- `compositions/browser-app.html`
  - Source template for the browser/app background plate.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, Anthropic font family, and calm
    workflow choreography.

## Changes

- Added `runtime/backlot-component-loader.js`.
  - Looks for elements with `data-backlot-mount-src`.
  - Loads sibling component HTML via `fetch()` when allowed.
  - Falls back to a hidden same-origin frame transport for `file://` captures.
  - Clones the requested template root into the parent scene.
  - Removes component scripts so child timelines do not conflict with the
    parent wrapper.
  - Exposes `window.__backlotComponentsState` and
    `window.__backlotComponentsReady` for capture tooling.
- Updated `compositions/claude-browser-workflow.html`.
  - Replaced visible iframes with direct mount placeholders.
  - Keeps the wrapper's parent GSAP timeline for menu bar, browser plate,
    Claude home-to-thread swap, cursor, and click timing.
- Updated `tools/capture-web-ui.mjs`.
  - Launches Chromium with `--allow-file-access-from-files` for local component
    captures.
  - Waits for `window.__backlotComponentsState` to become `ready` or `error`.
  - Fails fast when a component mount reports an error.
- Updated `PRIMITIVES.md`, `SURFACES.md`,
  `surfaces/README.md`, and
  `docs/research/open-source-ui-donor-repos.md`.

## Asset Decision

No app code, product CSS, icons, private data, screenshots, or third-party
runtime assets were copied. The loader is hand-authored project code and only
mounts already-local editable component files.

## Verification

- `npm run capture:claude-browser-workflow` refreshed
  `captures/surface-claude-browser-workflow/target.png`.
- The resulting `capture.json` includes parent-DOM elements with IDs
  `browser-app-surface`, `claude-home-surface`, and `claude-app-surface`;
  total captured visible element count: 333.
- `npm run hf:lint` passed with `0 error(s), 11 warning(s), 8 info(s)`.
  The remaining warnings are existing GSAP Studio editability warnings plus
  pointer-events notes for choreography/decorative elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,679,407 bytes.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json ok')"`
  passed.
- `git diff --check` passed.

## Remaining Gaps

- The loader mounts static child template roots and strips child scripts, so
  the parent cannot yet control child GSAP timelines.
- The hidden-frame fallback is only a file-capture transport; production video
  assembly should prefer direct HyperFrames subcomposition mounting when the
  renderer can expose enough timeline control for this library workflow.
- Child component CSS currently lands in the parent DOM. This is useful for
  immediate captures, but future shared components should tighten CSS scoping
  and data-driven props before many wrappers reuse the same surfaces together.
