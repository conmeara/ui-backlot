# Claude Finder Thread Workflow Pass 051

Date: 2026-06-18.

## Purpose

This pass adds a second stable capture path for the focused Claude-plus-Finder
wrapper. The existing `claude-finder-workflow` capture freezes the
attached-folder handoff state. That is useful for setup shots, but videos also
need the next beat: Finder context in the background while the refined Claude
working-thread surface is visible and editable. This pass makes that
post-handoff state directly discoverable and capturable without importing the
browser, PowerPoint, or the full desktop workflow.

## Evidence Used

- `compositions/claude-finder-workflow.html`
  - Used as the existing modular wrapper that mounts local Finder, Claude
    attachment-draft, and Claude working-thread components.
- `compositions/claude-app.html`
  - Used as the current refined Claude working-thread component from pass 049.
- `captures/surface-claude-app/target.png`
  - Used as the visual quality reference for the mounted Claude thread.
- `compositions/finder-window.html`
  - Used as the local editable Finder `Launch Deck` window component.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real
    child DOM instead of flattened screenshot plates.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, editable-surface requirements, and
    no-copied-product-assets rule.

## Changes

- Updated `compositions/claude-finder-workflow.html`.
  - Added `?capture=thread`, which seeks to the post-handoff working-thread
    state and explicitly hides the attachment draft and drag chip.
  - Kept the existing `?capture=hero` behavior for the attached-folder handoff
    state.
  - Preserved the parent-owned Finder plate, menu bar, cursor, click ring, and
    GSAP choreography.
- Updated `package.json`.
  - Added `npm run capture:claude-finder-thread-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-finder-thread-workflow` as a separate discoverable workflow
    variant using the same source file but a different capture path and
    recommended use.
- Updated `PRIMITIVES.md`, `SURFACES.md`, and `surfaces/README.md`.
  - Documented the two Finder workflow capture states.

## Asset Decision

No Finder product assets, Claude product code, screenshots, private account
data, app bundle assets, or reference-video frames were copied. The workflow
assembles already-local editable Backlot components through the local loader.

## Capture

- `npm run capture:claude-finder-thread-workflow`
- Output: `captures/surface-claude-finder-thread-workflow/target.png`

## Verification

- `npm run capture:claude-finder-workflow`
  - Refreshed the existing attached-folder handoff capture at
    `captures/surface-claude-finder-workflow/target.png`.
- `npm run capture:claude-finder-thread-workflow`
  - Created `captures/surface-claude-finder-thread-workflow/target.png`.
  - Visual inspection confirmed the refined Claude working thread is visible in
    front of the Finder context, with no browser or PowerPoint surfaces
    imported.
- `captures/surface-claude-finder-thread-workflow/visible-text.md`
  - Confirmed the active thread, task rail, context rail, and Finder DOM are
    present in the capture.
- `npm run registry:check`
  - Passed: `20 surfaces, 13 components, 5 workflows, 20 ready captures`.
- JSON parse check for `package.json` and `surfaces/registry.json`
  - Passed.
- `npm run hf:lint`
  - Passed with 0 errors. Existing warnings are GSAP Studio write-back/pointer
    and font advisories for the broader composition set.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Passed with 0 issues.
- `npm run hf:snapshot`
  - Refreshed the 7-frame workflow snapshot set and
    `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2770061`
- `git diff --check`
  - Passed.

## Remaining Gaps

- The parent wrapper still freezes child DOM states through parent capture mode
  and CSS/timeline state rather than driving child GSAP timelines directly.
- Finder is still a hand-authored `Launch Deck` reconstruction, not a fresh
  live Finder capture from this machine.
- Claude still needs sanitized live captures before claiming pixel-level
  desktop-app fidelity.
