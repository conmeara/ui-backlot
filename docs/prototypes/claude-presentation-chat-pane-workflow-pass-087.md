# Claude Presentation Chat Pane Workflow Pass 087

Date: 2026-06-18.

## Purpose

This pass adds a lighter first-vertical-slice workflow that pairs Claude with a
PowerPoint-like presentation editor without importing the heavier Claude
working-thread app, sidebar, or task rail. The existing
`claude-presentation-workflow` remains useful for Cowork/task-rail demos; this
new wrapper is the leaner path for short deck-update clips where the video only
needs Claude's active chat pane and the presentation editor.

## Evidence Used

- `compositions/claude-deck-chat-pane.html`
  - Used as the foreground Claude pane.
- `compositions/presentation-editor.html`
  - Used as the editable PowerPoint-like presentation surface.
- `runtime/backlot-component-loader.js`
  - Used as the component-mounting contract so wrapper captures contain real
    child DOM instead of iframe or screenshot plates.
- `compositions/mac-menu-bar.html`
  - Used after pass 088 as the reusable parent menu-bar component instead of
    duplicated wrapper-local menu HTML/CSS.
- `captures/surface-claude-chat-pane/target.png`
  - Used as the visual reference for the lighter Claude pane family before the
    deck-specific pane capture exists.
- `captures/surface-presentation-editor/target.png`
  - Used as the current presentation editor visual reference.
- `docs/prototypes/presentation-editor-office-fidelity-pass-046.md`
  - Used for Office/ribbon source and asset decisions.
- `DESIGN.md`
  - Used for warm Mac backlot palette, cursor, menu bar, and no-copied-assets
    constraints.

## Changes

- Added `compositions/claude-presentation-chat-pane-workflow.html`.
  - Mounts only `mac-menu-bar.html`, `claude-deck-chat-pane.html`, and
    `presentation-editor.html`.
  - Adds a parent Mac menu bar, desktop field, cursor, click ring, and GSAP
    timeline.
  - Exposes `?capture=hero` for a stable composed frame.
- Updated `package.json`.
  - Added `npm run capture:claude-presentation-chat-pane-workflow`.
- Updated `surfaces/registry.json`.
  - Added `claude-presentation-chat-pane-workflow` as a workflow depending only
    on `mac-menu-bar`, `claude-deck-chat-pane`, and `presentation-editor`.

## Asset Decision

No Claude product code, Microsoft product code, PowerPoint assets,
screenshots, private deck data, account data, app bundle assets, donor icon
files, or reference-video frames were copied into the composition. The workflow
assembles local editable Backlot components through the local loader.

## Verification

Passed in this pass:

- `npm run capture:claude-deck-chat-pane`
- `npm run capture:mac-menu-bar`
- `npm run capture:claude-presentation-chat-pane-workflow`
- Visual inspection of `captures/surface-mac-menu-bar/target.png`
- Visual inspection of `captures/surface-claude-deck-chat-pane/target.png`
- Visual inspection of `captures/surface-claude-presentation-chat-pane-workflow/target.png`
- Capture metadata -> menu bar at 1920x30 target with 9 visible elements; deck pane at 1180x900 target with 46 visible elements; workflow at 1920x1080 target with 218 visible elements
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `50 surfaces, 31 components, 17 workflows, 50 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- The wrapper freezes child component states through parent positioning rather
  than driving child GSAP timelines directly.
- A source-captured PowerPoint reference is still needed before claiming exact
  presentation-editor geometry.
- A sanitized live Claude desktop/web capture is still needed before claiming
  pixel-level accuracy for the Claude pane itself.
