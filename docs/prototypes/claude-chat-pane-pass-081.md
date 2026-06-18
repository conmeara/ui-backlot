# Claude Chat Pane Pass 081

## Goal

Split the lean Claude chat experience one level further by exposing the active
chat pane as its own direct-capturable component. This gives future HyperFrames
clips a reusable Claude topbar, message field, and composer without importing
the sidebar, task rail, browser, Finder, Office, Codex, or desktop shell.

## Source Evidence

- `compositions/claude-chat-shell.html`
- `captures/surface-claude-chat-shell/target.png`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-56s.jpg`
- `docs/prototypes/claude-chat-shell-pass-079.md`

## Changes

- Added `compositions/claude-chat-pane.html`.
  - Defines `#claude-chat-pane-surface` as an 1180x900 component boundary.
  - Keeps the active-thread topbar, model pill, right-aligned user bubbles,
    large Anthropic Serif assistant reply, CSS-drawn Claude mark, attachment
    chips, and bottom composer editable.
  - Excludes sidebar, Cowork task rail, tool/progress cards, browser, Finder,
    and desktop chrome so this pane can be layered into custom video scenes.
- Added `npm run capture:claude-chat-pane`.
- Added a `claude-chat-pane` registry component entry.
- Updated primitive and surface docs.

## Asset Decision

Hand-authored HTML/CSS only. This component is extracted from the local lean
Claude chat shell and informed by local public launch-frame studies. It does
not copy Claude product code, screenshots, video frames, private account data,
app bundle assets, external donor code, or unclear-license assets.

## Verification

Passed in this pass:

- `npm run capture:claude-chat-pane`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `44 surfaces, 27 components, 15 workflows, 44 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- Needs sanitized live Claude shell capture before claiming current-product
  pixel fidelity.
- Does not yet support parameterized message/composer variants.
