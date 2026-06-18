# Claude Conversation Surface Pass 040

Date: 2026-06-18

## Purpose

Add a separate sparse Claude conversation component for launch-style clips. The
desktop Claude component should remain useful for app-shell scenes, but the
Sonnet 4.6 reference video often crops Claude to an airy ivory conversation
canvas with large serif response text, the red starburst, user prompt bubbles,
and a compact `Reply...` composer. This pass makes that state directly
importable without the sidebar or Mac window chrome.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for overall sparse Claude composition, ivory surface, response scale,
    starburst placement, and composer treatment.
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
  - Used for large serif answer scale, low-left starburst placement, and
    rounded `Reply...` composer.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for concise single-response layout and spacious canvas.
- `reference/claude/frame-study/sonnet-4-6/frame-64s.jpg`
  - Used for right-aligned user prompt bubble stack treatment.
- `docs/prototypes/claude-app-reference-rhythm-pass-039.md`
  - Used to split the launch-style crop into its own component rather than
    overloading the desktop Claude app shell.

## Changes

- Added `compositions/claude-conversation.html`.
  - Defines `data-composition-id="claude-conversation-surface"`.
  - Adds a 1280x720 editable sparse Claude conversation canvas.
  - Includes right-aligned user bubbles, large serif response text, CSS
    starburst mark, compact `Reply...` composer, folder pill, mic, and send
    controls.
  - Registers `window.__timelines["claude-conversation-surface"]` with calm
    entrance motion and finite starburst/send-button animation.
- Added `npm run capture:claude-conversation`.
- Added the `claude-conversation` entry to `surfaces/registry.json`.
- Updated `SURFACES.md` and `surfaces/README.md`.

## Asset Decision

No Claude product code, app assets, screenshots, private chat data, or account
state were copied into the component. The downloaded reference frames are used
only for visual measurement and direction; the output remains hand-authored
editable HTML/CSS.

## Verification

- `npm run capture:claude-conversation` passed and refreshed
  `captures/surface-claude-conversation/target.png`.
- Visual inspection confirmed the sparse component has no desktop/sidebar
  shell, preserves clean separation between user bubbles and response text, and
  keeps the starburst above the composer.
- `captures/surface-claude-conversation/visible-text.md` confirmed the rendered
  text is discoverable and bounded in the expected regions.
- `npm run registry:check` passed with `17 surfaces, 13 components, 2 workflows,
  17 ready captures`.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  passed.
- `npm run hf:lint` passed with `0 error(s), 16 warning(s), 11 info(s)`.
  Warnings are the expected Studio editability notes for GSAP-owned
  choreography and noninteractive overlay elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reported `duration=16.000000` and `size=2685993`.
- `git diff --check` passed.

## Remaining Gaps

- The CSS starburst remains an approximation until compared against a sanitized
  live Claude capture or a licensed vector source.
- This surface intentionally omits desktop/sidebar chrome. App-shell clips
  should continue to use `claude-app`, `claude-home`, or
  `claude-attachment-draft`.
