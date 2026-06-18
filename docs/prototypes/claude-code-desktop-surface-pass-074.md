# Claude Code Desktop Surface Pass 074

## Goal

Add a standalone editable Claude Code desktop component that covers the dark
app-shell reference from the Claude Code desktop redesign video, separate from
the warm Claude chat/work-thread shell.

## Source Evidence

- `reference/claude/videos/2026-04-14-claude-code-desktop-redesign.mp4`
- `reference/claude/frame-study/code-desktop-redesign/contact-sheet.jpg`
- `reference/claude/frame-study/code-desktop-redesign/frame-16s.jpg`
- `reference/claude/frame-study/code-desktop-redesign/frame-20s.jpg`
- `reference/claude/frame-study/code-desktop-redesign/frame-24s.jpg`
- `captures/surface-claude-code-desktop/target.png`

## Implementation

- Added `compositions/claude-code-desktop.html` as a 1440x900 standalone
  component with `data-composition-id="claude-code-desktop-surface"`.
- Rebuilt the visible app structure as editable HTML/CSS: dark rounded desktop
  window, traffic lights, session rail, Code mode pill, new/session actions,
  session rows, PR summary, compact composer, Opus model state, transcript,
  changed-file rows, constraint table, preview panel, diff panel, terminal
  panel, task panel, and floating view switcher.
- Extracted a local frame study from the downloaded public reference video in
  `reference/claude/frame-study/code-desktop-redesign/`.
- Added `capture:claude-code-desktop` to make deterministic review captures.

## Asset Decision

The component is hand-authored HTML/CSS. The reference video and extracted
frames are local review evidence only and are not copied into the component.
No Claude product code, app assets, screenshots, video frames, private account
data, repository data, or donor code are copied.

## Verification Targets

- `npm run capture:claude-code-desktop`
- JSON parse for `surfaces/registry.json` and `package.json`
- `npm run registry:check`
- `git diff --check`
- `npm run hf:lint`
- `npm run hf:validate`
- `npm run hf:inspect`
- `npm run hf:snapshot`
- `npm run hf:render`
- `ffprobe renders/claude-keynote-workflow-draft.mp4`
