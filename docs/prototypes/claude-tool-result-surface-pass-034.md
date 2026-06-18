# Claude Tool Result Surface Pass 034

## Goal

Add a reusable Claude completed-work state for demo videos that need the moment
after Claude has inspected local files, updated a deck or app, and returned a
concise completion summary. This fills a gap between the existing Claude home
state and the in-progress working-thread state.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for warm off-white page tone, large serif assistant response text,
    compact prompt bubble, clay accent, and restrained composer treatment.
- `/Applications/Claude.app/Contents/Resources/ion-dist/assets/v1/*.css`
  - Inspected as reference only for broad geometry and token cues:
    `dframe-root`, `dframe-sidebar`, `epitaxy-root`, 48px header height,
    280px sidebar intent, 26px row height, compact dframe rows, and warm Claude
    token families.
- `docs/prototypes/claude-app-dframe-sidebar-pass-033.md`
  - Used as the current local Claude shell baseline so the new state stays
    consistent with the refined inset dframe/sidebar treatment.

## Changes

- Added `compositions/claude-tool-result.html` as a standalone HyperFrames
  subcomposition with direct-preview capture support.
- Added `capture:claude-tool-result` to `package.json`.
- Added `claude-tool-result` to `surfaces/registry.json`.
- Updated `SURFACES.md` and `surfaces/README.md` so the variant is listed with
  the rest of the importable surface kit.
- Modeled the completed state with editable completed-change rows, an updated
  PowerPoint artifact card, attached file chips, and a follow-up composer.

## Asset Decision

No Claude product CSS, app code, images, icons, or private account captures were
copied. The local installed app bundle was used only for static token and
geometry reference. All visible UI remains hand-authored HTML/CSS.

## Verification

- `npm run capture:claude-tool-result`: passed and wrote
  `captures/surface-claude-tool-result/target.png`.
- Fresh capture was visually inspected after the direct-preview capture.
- `npm run registry:check`: passed with 15 surfaces, 11 components, 2 workflows,
  and 15 ready captures.
- `npm run hf:lint`: passed with 0 errors, 14 existing Studio edit-blocked
  warnings, and 10 info messages. The new warning is the expected editability
  warning for GSAP-owned animation targets in `claude-tool-result.html`.
- `npm run hf:validate`: passed with no console errors.
- `npm run hf:inspect`: passed with 0 layout issues across 9 samples.
- `npm run hf:snapshot`: passed and refreshed 7 root frames plus
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render`: passed and wrote
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 renders/claude-keynote-workflow-draft.mp4`:
  duration `16.000000`, size `2676953`.
- `node -e 'JSON.parse(...)'`: passed for `package.json` and
  `surfaces/registry.json`.
- `git diff --check`: passed.
