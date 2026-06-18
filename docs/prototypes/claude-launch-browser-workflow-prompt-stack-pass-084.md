# Claude Launch Browser Workflow Prompt Stack Pass 084

## Goal

Refactor the launch-style Claude-plus-browser wrapper so its prompt beat mounts
the smaller `claude-prompt-stack` component and its completion beat mounts the
smaller `claude-completion-response` component. This keeps the wrapper useful
for short prompt-to-completion videos while proving both launch-state atoms can
be imported as separate HyperFrames-ready components.

## Source Evidence

- `compositions/browser-app.html`
- `compositions/claude-prompt-stack.html`
- `compositions/claude-completion-response.html`
- `runtime/backlot-component-loader.js`
- `captures/surface-browser-app/target.png`
- `captures/surface-claude-prompt-stack/target.png`
- `captures/surface-claude-completion-response/target.png`
- `docs/prototypes/claude-prompt-stack-pass-083.md`
- `docs/prototypes/claude-completion-response-pass-085.md`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`

## Changes

- Updated `compositions/claude-launch-browser-workflow.html`.
  - The prompt layer now mounts `./claude-prompt-stack.html` with selector
    `#claude-prompt-stack-surface`.
  - The completion layer now mounts `./claude-completion-response.html` with
    selector `#claude-completion-response-surface`.
  - The parent keeps the browser background, macOS menu bar, cursor/click ring,
    and prompt-to-completion choreography.
- Added `npm run capture:claude-launch-browser-workflow-prompt` for the prompt
  seek state.
- Updated the `claude-launch-browser-workflow` registry dependency graph,
  source evidence, asset decision, and recommended use.
- Updated primitive and surface docs.

## Asset Decision

Parent composition mounts local hand-authored components only. The prompt and
completion beats use synthetic editable text from `claude-prompt-stack` and
`claude-completion-response`; it copies no Claude product code, screenshots,
video frames, app assets, private account data, reference-video wording,
browser product code, or donor repository code.

## Verification

Passed in this pass after the completion-response refactor:

- `npm run capture:claude-completion-response`
- `npm run capture:claude-launch-browser-workflow-prompt`
- `npm run capture:claude-launch-browser-workflow`
- Visual inspection of standalone completion-response and both workflow captures
- Capture metadata -> completion response at 1920x1080 target with 15 visible elements; both workflow states at 1920x1080 target with 176 visible elements
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `47 surfaces, 29 components, 16 workflows, 47 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- The browser background remains a synthetic review-board app rather than a
  captured public website workflow.
