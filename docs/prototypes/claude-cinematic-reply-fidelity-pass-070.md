# Claude Cinematic Reply Fidelity Pass 070

## Goal

Refine `compositions/claude-cinematic-reply.html` from a compact extracted
widget into a full 1920x1080 editable launch-frame surface that better matches
the Sonnet 4.6 reference frames.

## Source Evidence

- `DESIGN.md`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
  - Used for the bottom-edge composer width, border radius, and partial
    offscreen placement.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for the one-line answer position, type scale, and response-mark
    relationship.
- `reference/claude/frame-study/sonnet-4-6/frame-40s.jpg`
  - Used for sparse ivory field, negative space, and calm Claude reply rhythm.
- `captures/surface-claude-cinematic-reply/target.png`
- `docs/prototypes/claude-cinematic-reply-split-pass-063.md`

## Changes

- Updated `compositions/claude-cinematic-reply.html`.
  - Changed the component dimensions from 1180x780 to 1920x1080.
  - Repositioned and enlarged the Anthropic Serif answer to match the
    launch-frame crop more closely.
  - Enlarged and repositioned the CSS Claude response mark.
  - Rebuilt the composer as a wide lower-edge card that extends beyond the
    bottom of the frame, matching the visible crop in `frame-24s.jpg`.
- Updated `npm run capture:claude-cinematic-reply` to use a 1960x1120 viewport.
- Updated `surfaces/registry.json`, `SURFACES.md`, `PRIMITIVES.md`, and
  `surfaces/README.md` with the new full-frame geometry and source evidence.

## Asset Decision

This pass uses local hand-authored HTML/CSS, local Anthropic fonts already in
the workspace, and a CSS-built response mark. It uses downloaded reference
frames only as visual evidence. No Claude product code, screenshots, launch
video frames, private account data, app bundle assets, external product assets,
or donor code were copied into the component.

## Capture

- Ran `npm run capture:claude-cinematic-reply`.
  - Output: `captures/surface-claude-cinematic-reply/target.png`.
  - Visual inspection: the capture now reads as a full-frame launch-style
    Claude answer surface, with large one-line serif response text, response
    mark placed below-left, and a lower-edge composer crop closer to the
    reference frames.

## Verification

- `npm run registry:check`
  - `Surface registry OK: 34 surfaces, 20 components, 12 workflows, 34 ready captures.`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
  - `json ok`
- `git diff --check`
  - clean before the prototype-note update.
- `npm run hf:lint`
  - `0 error(s), 31 warning(s), 23 info(s)`.
  - The `claude-cinematic-reply` warning remains the expected
    `gsap_studio_edit_blocked` note for timeline-owned reveal/drift elements.
- `npm run hf:validate`
  - `No console errors`
- `npm run hf:inspect`
  - `ok: true`
  - `issueCount: 0`
- `npm run hf:snapshot`
  - Refreshed `snapshots/frame-00-at-1.0s.png` through
    `snapshots/frame-06-at-15.0s.png` and `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Output: `renders/claude-keynote-workflow-draft.mp4`
  - Render completed in 37.5s.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2738569`
- Final `git diff --check`
  - clean before the prototype-note update.
