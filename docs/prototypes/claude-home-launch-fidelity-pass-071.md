# Claude Home Launch Fidelity Pass 071

## Goal

Add a reusable full-frame Claude launch prompt surface that matches the sparse
Sonnet 4.6 launch-video frame where four large user bubbles sit on a warm
ivory background with the small red loading mark near the lower-left edge.

## Source Evidence

- `reference/claude/frame-study/sonnet-4-6/frame-64s.jpg`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `captures/surface-claude-home-launch/frame64-comparison.jpg`
- `compositions/claude-conversation.html`
- `docs/prototypes/claude-conversation-surface-pass-040.md`
- `DESIGN.md`

## Implementation

- Added `compositions/claude-home-launch.html` as a 1920x1080 HyperFrames
  component with `data-composition-id="claude-home-launch-surface"`.
- Built the four prompt bubbles as editable text blocks with fixed launch-frame
  geometry, warm paper color, subtle radius, and no screenshot backing layer.
- Built the lower-left red thinking indicator as CSS dots so the loader remains
  editable and timeline-addressable.
- Added a direct-preview mount path for Playwright capture and a GSAP timeline
  for staggered prompt reveal plus loader motion.
- Captured `captures/surface-claude-home-launch/target.png` and generated
  `captures/surface-claude-home-launch/frame64-comparison.jpg` for side-by-side
  review against `frame-64s`.

## Asset Decision

Hand-authored HTML/CSS only. The reference frame guided geometry, color, scale,
and rhythm, but no Claude product code, app assets, screenshots, video frames,
private account data, or donor repository code were copied into the surface.

## Verification Targets

- `npm run capture:claude-home-launch`
- `npm run registry:check`
- JSON parse for `surfaces/registry.json` and `package.json`
- `git diff --check`
- `npm run hf:lint`
- `npm run hf:validate`
- `npm run hf:inspect`
- `npm run hf:snapshot`
- `npm run hf:render`
- `ffprobe renders/claude-keynote-workflow-draft.mp4`
