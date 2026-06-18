# Claude App Reference Rhythm Pass 039

Date: 2026-06-18

## Purpose

Refine the reusable Claude working-thread component so it feels closer to the
Sonnet 4.6 launch reference frames. The prior component was structurally useful
but too dense and dashboard-like. This pass keeps the macOS/desktop Claude shell
while pushing the conversation area toward the reference video's airy ivory
surface, large serif answer rhythm, and compact reply composer.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for overall Claude response composition, negative space, mark color,
    and composer feel.
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
  - Used for large serif answer scale, ivory background, and `Reply...`
    composer direction.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for concise response copy and sparse answer layout.
- `captures/surface-claude-app/target.png`
  - Used as the current editable component to compare against the reference
    rhythm.

## Changes

- Updated `compositions/claude-app.html`.
  - Replaced the long assistant sentence with two shorter reference-style
    response lines.
  - Increased assistant serif copy scale and reduced line-height for a stronger
    Claude launch-video feel.
  - Softened the shell, sidebar, topbar, cards, and model selector so the
    conversation area carries more visual weight.
  - Changed the composer placeholder to `Reply...`.
  - Tightened composer height and reduced nonessential status text.
- Updated `surfaces/registry.json`.
  - Pointed the `claude-app` surface to this prototype note.
- Updated `SURFACES.md` and `surfaces/README.md`.
  - Documented the reference-rhythm direction for the Claude thread component.

## Asset Decision

No Claude product code, copied CSS, app assets, screenshots, private chat data,
or account state were copied into the component. The reference frames are used
only for visual measurement and direction; the output remains hand-authored
editable HTML/CSS.

## Verification

- Run in this pass: `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
  - Visual inspection confirmed the component now reads closer to the reference
    with larger serif response copy, more breathing room, and a `Reply...`
    composer.
- `npm run registry:check` passed with `16 surfaces, 12 components, 2 workflows,
  16 ready captures`.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  passed.
- `npm run hf:lint` passed with `0 error(s), 15 warning(s), 10 info(s)`.
  Warnings are the expected Studio editability notes for GSAP-owned
  choreography and noninteractive overlay elements.
- `npm run hf:validate` passed with no console errors.
- `npm run hf:inspect` passed with zero issues across 9 sampled frames.
- `npm run hf:snapshot` refreshed 7 root timeline snapshots and
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render` produced
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe` reported `duration=16.000000` and `size=2680541`.
- `git diff --check` passed.

## Remaining Gaps

- The response mark is still a CSS approximation and should be compared against
  a sanitized live Claude capture.
- The sidebar remains desktop-shell oriented, while the launch-video reference
  often crops to a sparse web-style conversation. A future pass should add a
  separate no-sidebar Claude conversation component instead of forcing this
  desktop component to cover both roles.
