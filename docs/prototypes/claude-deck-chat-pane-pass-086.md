# Claude Deck Chat Pane Pass 086

Date: 2026-06-18.

## Purpose

This pass adds a deck-specific lean Claude chat pane for PowerPoint-style demo
clips. The existing `claude-chat-pane` is useful as a generic app-pair pane,
but its browser-layout copy makes it semantically wrong when mounted next to the
presentation editor. This component preserves the lighter Claude pane shape
while giving deck-update videos a reusable, editable Claude surface that does
not import the sidebar, task rail, browser, Finder, Codex, or desktop shell.

## Evidence Used

- `compositions/claude-chat-pane.html`
  - Used as the local component structure reference for topbar, user bubbles,
    serif assistant response, response mark, and composer layout.
- `captures/surface-claude-chat-pane/target.png`
  - Used as the current visual reference for the lean pane scale and spacing.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used as the launch-video rhythm reference for sparse ivory fields, large
    right-aligned user bubbles, and oversized serif Claude responses.
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
  - Used for the prompt-bubble density and pale paper field.
- `reference/claude/frame-study/sonnet-4-6/frame-56s.jpg`
  - Used for large response copy and red response mark placement.
- `docs/prototypes/claude-chat-pane-pass-081.md`
  - Used for the previous asset decision and remaining fidelity gaps.
- `DESIGN.md`
  - Used for the warm Claude/Mac palette, typography, and no-copied-assets
    constraints.

## Changes

- Added `compositions/claude-deck-chat-pane.html`.
  - Keeps the lean pane boundary at 1180x900.
  - Uses deck-specific synthetic prompt, answer, attachment chips, and title
    text.
  - Keeps a direct-preview mount script so `capture:claude-deck-chat-pane`
    can capture the component directly.
- Updated `package.json`.
  - Added `npm run capture:claude-deck-chat-pane`.
- Updated `surfaces/registry.json`.
  - Added `claude-deck-chat-pane` as a standalone component.

## Asset Decision

No Claude product code, screenshots, video frames, private account data, app
bundle assets, donor code, or copied reference wording were copied into this
component. The pane is hand-authored HTML/CSS using local Backlot patterns and
synthetic deck-update text.

## Verification

Passed in this pass:

- `npm run capture:claude-deck-chat-pane`
- Visual inspection of `captures/surface-claude-deck-chat-pane/target.png`
- Capture metadata -> 1180x900 target, 46 visible elements
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `49 surfaces, 30 components, 17 workflows, 49 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- The pane is still a hand-authored reconstruction, not a source-captured
  Claude desktop DOM/CSS extraction.
- A sanitized live Claude deck-update screenshot would improve typography,
  composer spacing, and model/topbar fidelity.
