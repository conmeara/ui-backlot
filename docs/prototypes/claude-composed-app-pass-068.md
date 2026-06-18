# Claude Composed App Pass 068

## Goal

Prove the split Claude components can be assembled back into a full editable
Claude app shell without returning to a monolithic implementation. This gives
future HyperFrames clips a full Claude view while keeping sidebar, thread,
composer, and task rail independently reusable.

## Source Evidence

- `compositions/claude-sidebar.html`
- `compositions/claude-thread-core.html`
- `compositions/claude-composer.html`
- `compositions/claude-agent-rail.html`
- `runtime/backlot-component-loader.js`
- `captures/surface-claude-sidebar/target.png`
- `captures/surface-claude-thread-core/target.png`
- `captures/surface-claude-composer/target.png`
- `captures/surface-claude-agent-rail/target.png`
- `docs/prototypes/claude-sidebar-surface-pass-067.md`
- `docs/prototypes/claude-thread-core-surface-pass-066.md`
- `docs/prototypes/claude-composer-surface-pass-064.md`
- `docs/prototypes/claude-agent-rail-surface-pass-065.md`

## Changes

- Added `compositions/claude-composed-app.html`.
  - Defines `#claude-composed-app` as a 1440x900 componentized shell.
  - Uses `runtime/backlot-component-loader.js` to mount the local
    `claude-sidebar`, `claude-thread-core`, `claude-composer`, and
    `claude-agent-rail` component roots.
  - Uses clipped/scaled component slots so each child keeps its own scoped
    styles while the wrapper shows only the relevant panel/card region.
  - Keeps the wrapper responsible for the app-window background, layout,
    clipping, entrance choreography, and subtle surface drift.
  - Adds `capture=hero` seeking so direct screenshots capture the fully
    assembled state instead of the initial GSAP hidden state.
- Added `npm run capture:claude-composed-app`.
- Added the `claude-composed-app` component entry to
  `surfaces/registry.json`.
- Updated `SURFACES.md`, `PRIMITIVES.md`, and `surfaces/README.md`.

## Asset Decision

This pass composes local hand-authored Claude components only. It does not copy
Claude product code, screenshots, launch-video frames, private account data,
app bundle assets, unclear-license donor code, or external UI assets.

## Capture

- Ran `npm run capture:claude-composed-app`.
- Output: `captures/surface-claude-composed-app/target.png`.
- Framing notes:
  - The first capture showed only the background because the standalone wrapper
    used `gsap.from()` entrance tweens and did not yet seek to its hero frame.
  - Added `capture=hero` seek behavior, then recaptured the composed shell.
  - Increased the outer shell height to preserve the composer card and
    increased the rail crop height so the local-context note remains visible.

## Verification

- `npm run registry:check`
  - `Surface registry OK: 33 surfaces, 20 components, 11 workflows, 33 ready captures.`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  - `json ok`
- `git diff --check`
  - clean before the prototype-note update.
- `npm run hf:lint`
  - `0 error(s), 30 warning(s), 22 info(s)`.
  - The composed shell contributes expected pointer-event notes for decorative
    and mounted-component layers, plus expected GSAP editability notes for
    wrapper-owned frame choreography.
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
  - Render completed in 38.7s.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2733808`
