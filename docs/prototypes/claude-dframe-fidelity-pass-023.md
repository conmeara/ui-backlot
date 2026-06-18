# Claude Dframe Fidelity Pass 023

Date: 2026-06-18

## Purpose

Refine the reusable Claude-only HyperFrames component so it feels closer to
the real Claude shell and the Sonnet 4.6 launch-video language. This pass keeps
the existing component boundary but replaces the generic chat-app internals
with a more Claude-specific sidebar, transcript, topbar, task-card, and
composer structure.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for warm cream canvas, serif assistant answer scale, compact user
    prompt bubble, clay send control, and centered composer emphasis.
- `reference/claude/images/2026-06-17-claude-design-beta.jpg`
  - Used as a secondary 2026 Anthropic visual-language reference for Claude
    Design and code/design workflow surfaces.
- `/Applications/Claude.app/Contents/Info.plist`
  - Confirms local installed Claude desktop version `1.12603.1`.
- `/Applications/Claude.app/Contents/Resources/ion-dist/index.html`
  - Used as reference for the current Claude web bundle structure and theme
    context: `data-theme="claude"`, local app page metadata, and bundled font
    preload behavior.
- `/Applications/Claude.app/Contents/Resources/ion-dist/assets/v1/*.css`
  - Inspected for safe, broad vocabulary and token geometry only:
    `dframe-root`, `dframe-sidebar`, `epitaxy-root`,
    `epitaxy-transcript-width`, `epitaxy-composer-width`,
    `epitaxy-task-card-surface`, 48px header height, 280px sidebar intent,
    960px transcript/composer width, 8px row radius, warm `bg-*`, `text-*`,
    `brand-*`, and `border-*` token families.
- [Anthropic Claude Design launch page](https://www.anthropic.com/news/claude-design-anthropic-labs)
  - Used as public 2026 product-context reference for Claude Design workflows,
    exports, PPTX, and design handoff direction.

## Changes

- Rebuilt `compositions/claude-app.html` internals around Claude-like
  primitives:
  - `dframe-root`
  - `dframe-sidebar`
  - `dframe-pane-primary`
  - `epitaxy-root`
  - `epitaxy-transcript-width`
  - `epitaxy-composer-width`
  - `epitaxy-task-card-surface`
- Tuned the left rail toward real Claude desktop/web behavior:
  traffic lights, compact brand row, new chat/search rows, section labels,
  pinned/today/project rows, and account footer.
- Reworked the main pane into a narrower transcript column with topbar model
  selector, right-side share/more affordances, compact user prompt bubble,
  serif assistant copy, standalone Claude mark, grouped thinking card, task
  card, and message actions.
- Rebuilt the composer as a prompt card with attachments, placeholder text,
  folder/research controls, mic control, and running-state stop button.
- Preserved the direct-preview fallback and the
  `window.__timelines["claude-app-surface"]` animation registration.

## Asset Decision

No Claude code, CSS, images, or icons were copied into the repo. The local app
bundle was inspected only for naming vocabulary, dimensions, token families,
and geometry cues. The component remains hand-authored editable HTML/CSS using
local project fonts.

## Verification

- `npm run capture:claude-app` refreshed
  `captures/surface-claude-app/target.png`.
- `npm run hf:lint` passed with `0 error(s), 7 warning(s), 6 info(s)`.
  The warnings are Studio editability warnings for intentionally animated GSAP
  surfaces. Claude no longer emits the earlier Georgia font-alias info.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,680,208 bytes.
- `git diff --check` passed.

## Remaining Gaps

- The sidebar icons and topbar icons are CSS approximations and still need
  pixel-level comparison against a sanitized live Claude new-chat capture.
- The current surface models one active project conversation. We still need a
  separate empty/new-chat state and a long-thread state for future videos.
- The component is still hand-authored HTML/CSS. A future pass should extract
  common Claude primitives into smaller includeable files once HyperFrames
  composition import ergonomics settle.
