# Claude App Desktop Thread Fidelity Pass 042

Date: 2026-06-18

## Purpose

Continue refining the reusable Claude working-thread component that other
workflow wrappers mount. The previous pass moved the conversation toward the
Sonnet 4.6 launch rhythm, but the capture still looked too much like a staged
dashboard: the sidebar floated as a white card, cards were too bordered, the
assistant text was too heavy, and the CSS Claude mark was still coarse.

This pass keeps the desktop Claude app boundary while making the app shell
flatter, calmer, and more reusable for HyperFrames compositions that need
Claude plus one other app.

## Evidence Used

- `captures/surface-claude-app/target.png`
  - Used as the current visual quality gate.
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for warm ivory field, quieter message pacing, clay mark color, and
    compact `Reply...` composer direction.
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
  - Used for response/composer visual weight and mark restraint.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for concise response spacing and negative-space rhythm.
- `/Applications/Claude.app/Contents/Resources/ion-dist/assets/v1/*.css`
  - Inspected as reference only for dframe/epitaxy measurement cues: 280px
    sidebar intent, 48px header, 26px row height, low-radius rows, low-contrast
    surfaces, and clay/gray token families.
- `DESIGN.md`
  - Used for safe hand-authored editable UI constraints, Anthropic font choices,
    warm palette, and no copied product assets.

## Changes

- Updated `compositions/claude-app.html`.
  - Flattened the sidebar into the window shell instead of rendering it as a
    separate white floating panel.
  - Increased the sidebar boundary to the 280px dframe-inspired desktop intent
    while keeping the existing 980x760 component size.
  - Softened the window shadow, topbar, model selector, selected rows, prompt
    bubble, task parts, and composer shadows.
  - Rebuilt the CSS Claude mark from 10 rays to a calmer 12-ray mark for both
    the sidebar brand and assistant response gutter.
  - Reduced assistant serif response size/weight so the desktop thread feels
    less like a poster while preserving launch-reference warmth.
  - Reduced tool-card border/shadow density and kept status rows editable.
- Updated `surfaces/registry.json`.
  - Pointed the `claude-app` surface to this prototype note.
- Updated `SURFACES.md` and `surfaces/README.md`.
  - Documented the flatter desktop-thread fidelity direction.

## Asset Decision

No Claude product code, app CSS, images, icons, screenshots, private account
data, or copied app assets were added to the repo. The local app bundle and
reference frames were used only as measurement and visual-context evidence.
The component remains hand-authored editable HTML/CSS using project-local
fonts.

## Verification

- Passed: `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
- Passed: `npm run capture:claude-browser-workflow`
  - Refreshed `captures/surface-claude-browser-workflow/target.png`.
- Passed: `npm run capture:claude-finder-workflow`
  - Refreshed `captures/surface-claude-finder-workflow/target.png`.
- Passed: visual inspection of refreshed Claude and workflow captures.
- Passed: `npm run registry:check`
  - `Surface registry OK: 18 surfaces, 13 components, 3 workflows, 18 ready captures.`
- Passed: JSON parse checks for `package.json` and `surfaces/registry.json`
- Passed: `npm run hf:lint`
  - `0 error(s), 17 warning(s), 12 info(s)`
  - Warnings are expected GSAP-owned editability and pointer-events notes.
- Passed: `npm run hf:validate`
  - No console errors.
- Passed: `npm run hf:inspect`
  - Zero issues across 9 sampled frames.
- Passed: `npm run hf:snapshot`
  - Refreshed 7 root timeline snapshots and `snapshots/contact-sheet.jpg`.
- Passed: `npm run hf:render`
  - Wrote `renders/claude-keynote-workflow-draft.mp4`.
- Passed: `ffprobe` on `renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2650301`
- Passed: `git diff --check`

## Remaining Gaps

- A sanitized live Claude desktop capture is still needed before claiming
  pixel-level accuracy for sidebar icons, model selector shape, and message
  part spacing.
- The CSS mark is closer but remains an approximation; do not copy the real
  app icon without an explicit asset/license decision.
- The working-thread component now has a better desktop-shell baseline, but
  long-thread, empty-thread, file-upload, tool-result, and compact overlay
  states should continue living as separate reusable components.
