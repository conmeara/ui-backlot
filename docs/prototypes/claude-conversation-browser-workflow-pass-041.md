# Claude Conversation Browser Workflow Pass 041

Date: 2026-06-18

## Purpose

Add a focused launch-style Claude-plus-browser wrapper. The existing
`claude-browser-workflow` is useful for desktop Claude app scenes with
attachment context and an active thread. This pass adds a lighter wrapper for
clips that need the Sonnet 4.6 launch-video feel: browser app in the background
and sparse Claude conversation canvas in the foreground.

## Evidence Used

- `compositions/browser-app.html`
  - Used as the editable browser review-board app surface.
- `compositions/claude-conversation.html`
  - Used as the editable sparse Claude response canvas.
- `runtime/backlot-component-loader.js`
  - Used as the local component-mounting contract so wrapper captures contain
    real child DOM rather than flattened screenshots.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for launch-style foreground/background composition and Claude response
    canvas pacing.
- `DESIGN.md`
  - Used for warm Mac backlot palette, Anthropic fonts, calm cursor motion, and
    editable UI surface constraints.

## Changes

- Added `compositions/claude-conversation-browser-workflow.html`.
  - Defines `data-composition-id="claude-conversation-browser-workflow"`.
  - Mounts only the browser app and sparse Claude conversation components.
  - Adds parent-owned macOS menu bar, desktop field, cursor, click ring, window
    placement, and calm GSAP choreography.
  - Supports `?capture=hero` for a stable mid-scene static capture.
- Added `npm run capture:claude-conversation-browser-workflow`.
- Added the `claude-conversation-browser-workflow` entry to
  `surfaces/registry.json`.
- Updated `SURFACES.md` and `surfaces/README.md`.

## Asset Decision

No new third-party code, product CSS, icons, private data, screenshots, or media
assets were copied. The wrapper composes existing editable Backlot components
through the local loader; the reference frames guide layout only.

## Verification

- Passed: `npm run capture:claude-conversation-browser-workflow`
- Passed: visual inspection of
  `captures/surface-claude-conversation-browser-workflow/target.png`
- Passed: `npm run registry:check`
  - `Surface registry OK: 18 surfaces, 13 components, 3 workflows, 18 ready captures.`
- Passed: JSON parse checks for `package.json` and `surfaces/registry.json`
- Passed: `npm run hf:lint`
  - `0 error(s), 17 warning(s), 12 info(s)`
- Passed: `npm run hf:validate`
  - No console errors.
- Passed: `npm run hf:inspect`
  - Zero issues across 9 sampled frames.
- Passed: `npm run hf:snapshot`
  - Refreshed 7 root snapshots and `snapshots/contact-sheet.jpg`.
- Passed: `npm run hf:render`
  - Wrote `renders/claude-keynote-workflow-draft.mp4`.
- Passed: `ffprobe` on `renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2684357`
- Passed: `git diff --check`

## Remaining Gaps

- This wrapper intentionally uses the generic review-board browser surface. A
  future pass should add Airtable, real browser-product, or website variants as
  separate browser components rather than overloading this one.
- The sparse Claude conversation component still needs sanitized live Claude
  captures for exact mark and spacing refinement.
