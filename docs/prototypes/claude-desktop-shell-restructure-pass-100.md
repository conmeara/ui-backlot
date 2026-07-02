# Claude Desktop Shell Restructure Pass 100

Date: 2026-07-01

## Goal

Replace the single-page Claude desktop app surfaces with one editable
`compositions/claude-desktop.html` component that hosts three interchangeable
desktop pages — Chat, Cowork, and Code — as sibling page roots inside the
same standalone template, so a clip can cut between the three desktop app
modes without swapping components.

## Changed

- Added `compositions/claude-desktop.html` with `data-composition-id="claude-desktop-surface"`
  and three page roots stacked inside it: `#claude-desktop-chat`
  (`.claude-desktop-window.page-chat`), `#claude-desktop-cowork`
  (`.claude-desktop-window.page-cowork`), and `#claude-desktop-code`
  (`.claude-desktop-window.page-code`).
- Each page is a standalone 1440x900 desktop window: Chat is the light
  new-chat/composer shell; Cowork is the light three-pane task-review shell
  with progress/artifacts/context rail; Code is the dark session-rail +
  composer + pixel-crab-mascot shell.
- Registered four new registry surfaces (`claude-desktop-chat`,
  `claude-desktop-cowork`, `claude-desktop-code`, plus the existing
  `codex-thread-core` companion) with dedicated capture scripts targeting
  each page root by id.
- These three pages supersede `claude-app` and `claude-code-desktop` as the
  desktop app shell going forward; the older single-page entries are left
  registered and untouched for backward compatibility with existing clips.

## Reference Basis

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `https://simonwillison.net/2026/Jan/12/claude-cowork/`
- `reference/claude/videos/2026-04-14-claude-code-desktop-redesign.mp4`
- `reference/claude/frame-study/code-desktop-redesign/contact-sheet.jpg`
- `captures/surface-claude-app/target.png`
- `captures/surface-claude-code-desktop/target.png`
- `assets/icons/source-authentic/lucide/claude-symbols.svg`
- `assets/icons/source-authentic/simple-icons/brand-symbols.svg`

## Asset And License Decision

Hand-authored HTML/CSS with curated Lucide (ISC) icon symbols and the Simple
Icons Claude wordmark glyph vendored under `assets/icons/source-authentic/`
and referenced via `<use href="#id"/">`. The Code page's crab mascot is
hand-authored box-shadow/CSS pixel art (house exception for simple geometric
device art), not a copied asset. No Claude product code, bundled app assets,
video frames, or private account data copied into the component.

## Verification

Run in this pass:

- `npm run capture:claude-desktop-chat`
- `npm run capture:claude-desktop-cowork`
- `npm run capture:claude-desktop-code`
- `npm run registry:check:captures`
- `npm run catalog:generate`
- `npm run hf:lint` (must stay at the pre-existing 19-error baseline)
