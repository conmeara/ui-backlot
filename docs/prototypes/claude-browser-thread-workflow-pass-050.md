# Claude Browser Thread Workflow Pass 050

Date: 2026-06-18.

## Purpose

This pass adds a second stable capture path for the focused Claude-plus-browser
wrapper. The existing `claude-browser-workflow` capture intentionally freezes
the pre-submit attached-folder draft state. That is useful, but it does not
prove that short videos can import the current refined Claude working-thread
surface beside a browser app without Finder, PowerPoint, or the full root
workflow. This pass makes that active-thread state directly discoverable and
capturable.

## Evidence Used

- `compositions/claude-browser-workflow.html`
  - Used as the existing modular wrapper that mounts local browser, Claude
    attachment-draft, and Claude working-thread components.
- `compositions/claude-app.html`
  - Used as the current refined Claude working-thread component from pass 049.
- `captures/surface-claude-app/target.png`
  - Used as the visual quality reference for the mounted Claude thread.
- `compositions/browser-app.html`
  - Used as the local editable browser review-board surface.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real
    child DOM instead of flattened screenshot plates.
- `DESIGN.md`
  - Used for the warm Mac backlot palette, editable-surface requirements, and
    no-copied-product-assets rule.

## Changes

- Updated `compositions/claude-browser-workflow.html`.
  - Added `?capture=thread`, which seeks to the post-handoff working-thread
    state and explicitly hides the attachment draft.
  - Kept the existing `?capture=hero` behavior for the attached-folder draft
    state.
  - Preserved the parent-owned browser plate, menu bar, cursor, click ring, and
    GSAP choreography.
- Updated `package.json`.
  - Added `npm run capture:claude-browser-thread-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-browser-thread-workflow` as a separate discoverable workflow
    variant using the same source file but a different capture path and
    recommended use.

## Asset Decision

No browser product assets, Claude product code, screenshots, private account
data, app bundle assets, or reference-video frames were copied. The workflow
assembles already-local editable Backlot components through the local loader.

## Capture

- `npm run capture:claude-browser-thread-workflow`
- Output: `captures/surface-claude-browser-thread-workflow/target.png`

## Verification

- `npm run capture:claude-browser-workflow`
  - Refreshed the existing attached-context capture at
    `captures/surface-claude-browser-workflow/target.png`.
  - Visual inspection confirmed the draft-context beat still works.
- `npm run capture:claude-browser-thread-workflow`
  - Created `captures/surface-claude-browser-thread-workflow/target.png`.
  - Visual inspection confirmed the refined Claude working thread is visible in
    front of the browser app, with no Finder or PowerPoint surfaces imported.
- `captures/surface-claude-browser-thread-workflow/visible-text.md`
  - Confirmed the active thread, task rail, and browser review-board DOM are
    present in the capture.
- `npm run registry:check`
  - Passed: `19 surfaces, 13 components, 4 workflows, 19 ready captures`.
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
  - `size=2771356`
- `git diff --check`
  - Passed.

## Remaining Gaps

- The parent wrapper still cannot drive child GSAP timelines directly; it
  freezes child DOM states through a parent capture mode and CSS/timeline
  state.
- The browser app is still a generic review-board surface rather than a
  source-captured Airtable or browser-product reconstruction.
- Claude still needs sanitized live captures before claiming pixel-level
  desktop-app fidelity.
