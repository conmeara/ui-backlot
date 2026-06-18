# Claude Response Mark Component Pass 092

## Goal

Extract the repeated CSS Claude response mark into a standalone editable
component and use it in the sparse launch-style Claude reply surfaces. This
makes the Claude mark geometry tunable in one place while keeping cinematic
reply and completion components modular for HyperFrames clips.

## Source Evidence

- `DESIGN.md`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `reference/claude/frame-study/sonnet-4-6/frame-24s.jpg`
  - Used for the lower-left completion mark scale and relationship to large
    serif reply copy.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used for the one-line answer state, red mark placement, and sparse ivory
    field around the mark.
- `captures/surface-claude-cinematic-reply/target.png`
- `captures/surface-claude-completion-response/target.png`
- `docs/prototypes/claude-cinematic-reply-fidelity-pass-070.md`
- `docs/prototypes/claude-completion-response-pass-085.md`

## Changes

- Added `compositions/claude-response-mark.html`.
  - Defines a 128x128 direct-capturable component boundary.
  - Rebuilds the red response mark as editable HTML/CSS with twelve rounded
    rays and a center core.
  - Provides a direct-preview mount path for screenshot capture.
- Updated `compositions/claude-cinematic-reply.html`.
  - Replaced duplicated mark markup/CSS with a mounted shared
    `claude-response-mark` component.
  - Kept the parent scene responsible for mark placement, scale, and animation.
- Updated `compositions/claude-completion-response.html`.
  - Replaced duplicated mark markup/CSS with the same mounted component.
- Added `npm run capture:claude-response-mark`.
- Updated `surfaces/registry.json`, `PRIMITIVES.md`, `SURFACES.md`, and
  `surfaces/README.md`.

## Asset Decision

Hand-authored HTML/CSS only. The response mark is informed by public launch
frame studies and local captures, but it does not copy Claude product code,
official icon assets, screenshots, video frames, private account data, app
bundle assets, donor code, or unclear-license assets.

## Verification

Passed in this pass:

- JSON parse for `package.json` and `surfaces/registry.json` -> `json ok`
- `npm run capture:claude-response-mark`
  - Refreshed `captures/surface-claude-response-mark/target.png`.
  - Capture metadata: 128x128 target, 13 visible elements.
- `npm run capture:claude-cinematic-reply`
  - Refreshed `captures/surface-claude-cinematic-reply/target.png`.
  - Capture metadata: 1920x1080 target, 25 visible elements, mounted shared
    `#claude-response-mark-surface` present.
- `npm run capture:claude-completion-response`
  - Refreshed `captures/surface-claude-completion-response/target.png`.
  - Capture metadata: 1920x1080 target, 18 visible elements, mounted shared
    `#claude-response-mark-surface` present.
- `npm run capture:claude-launch-browser-workflow`
  - Refreshed `captures/surface-claude-launch-browser-workflow/target.png`.
  - Visual inspection confirmed the nested completion component carries the
    shared response mark in the browser workflow.
- Contact sheet:
  - `captures/claude-response-mark-pass-092-contact-sheet.jpg`
  - Visual inspection compared `frame-32s`, `frame-24s`, the isolated mark,
    the cinematic reply, and the completion response.
- `npm run registry:check`
  - `Surface registry OK: 51 surfaces, 32 components, 17 workflows, 51 ready captures.`
- `git diff --check`
  - Passed before the note update.
- `npm run hf:lint`
  - `0 error(s), 38 warning(s), 32 info(s)`.
  - Warnings are the existing GSAP Studio editability, pointer-events, and
    font-alias advisories across the broader composition set.
- `npm run hf:validate`
  - `No console errors`.
- `npm run hf:inspect`
  - `ok: true`, `issueCount: 0`.
- `npm run hf:snapshot`
  - Refreshed 7 frames and `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `width=1920`
  - `height=1080`
  - `r_frame_rate=30/1`
  - `nb_frames=480`
  - `duration=16.000000`
  - `size=2734826`

## Remaining Gaps

- This is still a safe CSS reconstruction, not an official Claude product
  asset. A future pass should compare against a sanitized live Claude capture
  before claiming product-level mark accuracy.
- Older Claude shell components still carry local CSS mark copies. This pass
  proves the shared component on the sparse launch-style reply path first.
