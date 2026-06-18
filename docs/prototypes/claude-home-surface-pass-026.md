# Claude Home Surface Pass 026

Date: 2026-06-18

## Purpose

Add a reusable Claude new-chat/home surface so UI Backlot can show the
launch-style first prompt state without importing Finder, browser, PowerPoint,
or an active Claude working thread. This complements
`compositions/claude-app.html`, which remains the working conversation state.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for the centered Claude mark/name, warm cream canvas, compact rounded
    first prompt card, Work in a folder affordance, plus control, and red
    call-to-action button.
- `reference/claude/images/2026-06-17-claude-design-beta.jpg`
  - Used as a secondary 2026 Anthropic product visual reference for warm
    clay/orange action color, large app-window presentation, and editable
    workflow framing.
- `/Applications/Claude.app/Contents/Info.plist`
  - Confirms local installed Claude desktop version `1.12603.1`.
- `/Applications/Claude.app/Contents/Resources/ion-dist/index.html` and
  bundled CSS assets
  - Used only for safe broad vocabulary and geometry cues already documented in
    pass 023: dframe/sidebar framing, epitaxy prompt/composer vocabulary,
    Claude theme context, bundled font behavior, warm `bg-*`, `text-*`,
    `brand-*`, and `border-*` token families.

## Changes

- Added `compositions/claude-home.html`.
  - Defines `data-composition-id="claude-home-surface"`.
  - Provides a direct-preview fallback for standalone captures.
  - Adds `data-primitive="claude-home-window"`.
  - Recreates a Claude-style home state with sidebar, topbar model selector,
    centered Claude mark/name, first-prompt card, Work in a folder button,
    attachment plus control, red Let's go button, and starter prompts.
  - Registers `window.__timelines["claude-home-surface"]` for window/sidebar/
    topbar entrances, prompt-card reveal, starter-prompt reveal, Claude mark
    pulse, and Let's go emphasis.
- Added `npm run capture:claude-home`.
- Updated `PRIMITIVES.md`, `SURFACES.md`,
  `surfaces/README.md`, and
  `docs/research/open-source-ui-donor-repos.md`.

## Asset Decision

No Claude code, CSS, images, icons, private account data, or app assets were
copied. The component is hand-authored editable HTML/CSS using local project
fonts and reference-only media.

## Verification

- `npm run capture:claude-home` refreshed
  `captures/surface-claude-home/target.png`.
- `npm run hf:lint` passed with `0 error(s), 10 warning(s), 7 info(s)`.
  The new Claude home warning is the expected Studio editability warning for
  GSAP-animated elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero layout issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reports the draft render is 16.000 seconds and 2,682,905 bytes.
- `git diff --check` passed.

## Remaining Gaps

- This is not yet compared against a sanitized live Claude new-chat capture.
- The home state is static DOM today. Later passes should expose prompt text,
  starter prompts, active model, and sidebar history as structured data.
- The Claude mark and sidebar icons are CSS approximations pending a safe
  pixel-level reference capture.
