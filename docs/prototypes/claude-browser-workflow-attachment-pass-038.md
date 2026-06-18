# Claude Browser Workflow Attachment Pass 038

Date: 2026-06-18

## Purpose

Refine the focused Claude-plus-browser workflow so it demonstrates selected
context inside Claude without importing Finder, PowerPoint, or the full desktop
scene. The browser app already represents a launch-deck review board, so the
wrapper should pair it with the Claude attached-folder draft state before
transitioning into the working Claude thread.

## Evidence Used

- `compositions/browser-app.html`
  - Used as the editable browser review-board app surface.
- `compositions/claude-attachment-draft.html`
  - Used as the editable Claude pre-submit state with attached folder/file
    context.
- `compositions/claude-app.html`
  - Used as the editable Claude working-thread state after the prompt is sent.
- `runtime/backlot-component-loader.js`
  - Used as the local component-mounting contract so wrapper captures contain
    real child DOM rather than flattened screenshots.
- `DESIGN.md`
  - Used for the project rule that video surfaces should remain editable,
    modular, and calm enough for instructional pacing.

## Changes

- Updated `compositions/claude-browser-workflow.html`.
  - Replaced the Claude home mount with the Claude attached-folder draft mount.
  - Kept the browser app and Claude working-thread mounts as independent child
    surfaces.
  - Changed the hero capture seek point to the draft-context beat, so the static
    capture shows browser plus Claude context selection instead of the later
    thread handoff.
  - Preserved parent-owned menu bar, cursor, click ring, window placement, and
    GSAP timeline choreography.
- Updated `surfaces/registry.json`.
  - Changed dependencies to `browser-app`, `claude-attachment-draft`, and
    `claude-app`.
  - Pointed the registry to this prototype note.
- Updated `SURFACES.md` and `surfaces/README.md`.
  - Documented that the wrapper now demonstrates browser plus Claude attached
    context, not Claude home plus browser.

## Asset Decision

No third-party product code, copied app assets, screenshots, private account
data, or donor runtime components were added. This pass composes already-local
editable Backlot components through the local loader.

## Verification

- `npm run capture:claude-browser-workflow` passed and refreshed
  `captures/surface-claude-browser-workflow/target.png`.
- Visual inspection confirmed the hero frame now shows browser review board
  plus Claude attached-folder draft, with no Finder or PowerPoint surfaces.
- `captures/surface-claude-browser-workflow/visible-text.md` confirmed the
  hidden Claude working-thread state is no longer exposed in the hero capture
  after switching the transition to GSAP `autoAlpha`.
- `npm run registry:check` passed with `16 surfaces, 12 components, 2 workflows,
  16 ready captures`.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  passed.
- `npm run hf:lint` passed with `0 error(s), 15 warning(s), 10 info(s)`.
  Warnings are the expected Studio editability notes for GSAP-owned
  choreography and noninteractive overlay elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reported `duration=16.000000` and `size=2675631`.
- `git diff --check` passed.

## Remaining Gaps

- Claude still needs sanitized live captures for tighter pixel-level
  refinement.
- The browser app is still a generic review-board surface. Later passes should
  add real Airtable/browser-product variants as separate surfaces rather than
  mutating this component into too many roles.
