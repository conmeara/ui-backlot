# Claude App Dframe Sidebar Pass 033

## Goal

Push the reusable Claude working-thread component closer to the real Claude
desktop/web app shell while keeping it fully editable and safe for video use.
This pass focuses on the most visible mismatch in the component capture: the
left rail previously looked like a generic full-height sidebar instead of
Claude's inset dframe panel.

## Evidence Used

- `captures/surface-claude-app/target.png`
  - Used as the visible baseline and post-change quality check.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for warm page tone, serif response scale, compact prompt cards, and
  clay send/composer accents.
- `/Applications/Claude.app/Contents/Resources/ion-dist/assets/v1/*.css`
  - Inspected as reference only for broad geometry and token cues:
    `dframe-root`, `dframe-sidebar`, `epitaxy-root`, 48px header height,
    280px sidebar intent, 26px row height, 6px row radius, compact icon slots,
    and warm Claude token families.

## Changes

- Converted the Claude sidebar from a flush grid column into an 8px-inset
  rounded dframe card with a subtle card shadow and white surface.
- Moved the main pane to sit beside the inset sidebar while preserving the
  existing 980x760 component boundary and HyperFrames composition id.
- Tightened sidebar rows from 30px to 26px, reduced section spacing, softened
  selected/new-chat fills, and kept the footer compact.
- Widened the Claude transcript/composer column slightly inside the remaining
  main pane and reduced the heavy card/composer chrome.
- Adjusted response text scale and line-height so the assistant answer feels
  closer to Claude's large serif response treatment.

## Asset Decision

No Claude product CSS, app code, images, icons, or private account captures were
copied. The local installed app bundle was used only for static token and
geometry reference. All visible UI remains hand-authored HTML/CSS in
`compositions/claude-app.html`.

## Verification

- `npm run capture:claude-app`: passed and refreshed
  `captures/surface-claude-app/target.png`.
- `npm run capture:claude-browser-workflow`: passed and refreshed
  `captures/surface-claude-browser-workflow/target.png`.
- `npm run capture:claude-finder-workflow`: passed and refreshed
  `captures/surface-claude-finder-workflow/target.png`.
- `npm run registry:check`: passed with 14 surfaces, 10 components, 2 workflows,
  and 14 ready captures.
- `npm run hf:lint`: passed with 0 errors, 13 existing Studio edit-blocked
  warnings, and 10 info messages.
- `npm run hf:validate`: passed with no console errors.
- `npm run hf:inspect`: passed with 0 layout issues across 9 samples.
- `npm run hf:snapshot`: passed and refreshed 7 frames plus
  `snapshots/contact-sheet.jpg`.
- `npm run hf:render`: passed and wrote
  `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 renders/claude-keynote-workflow-draft.mp4`:
  duration `16.000000`, size `2675876`.
- `git diff --check`: passed.
