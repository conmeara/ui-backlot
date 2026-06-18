# Claude Launch Browser Workflow Pass 073

## Goal

Add a lean HyperFrames workflow wrapper that imports only the editable browser
surface and the new Claude launch primitives, so a video can show a
browser-backed Claude launch sequence without importing Finder, Office, Codex,
or the full desktop lab.

## Source Evidence

- `compositions/browser-app.html`
- `compositions/claude-home-launch.html`
- `compositions/claude-launch-completion.html`
- `runtime/backlot-component-loader.js`
- `captures/surface-claude-home-launch/frame64-comparison.jpg`
- `captures/surface-claude-launch-completion/frame24-comparison.jpg`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`

## Implementation

- Added `compositions/claude-launch-browser-workflow.html` as a 1920x1080
  root composition with `data-composition-id="claude-launch-browser-workflow"`.
- Mounted the browser app, Claude launch prompt stack, and Claude launch
  completion components through `runtime/backlot-component-loader.js`.
- Added parent-owned Mac menu-bar context, cursor/click-ring choreography,
  browser drift, and prompt-to-completion cross-fade.
- Added `?capture=prompt` and `?capture=completion`/`?capture=hero` seek states
  so agents can capture the prompt or done-state beat deterministically.

## Asset Decision

Parent composition mounts local hand-authored components only. It copies no
Claude product code, screenshots, video frames, app assets, private account
data, browser product code, or donor repository code. The wrapper uses public
reference frames only to judge layout rhythm and uses the child components'
existing source/licensing decisions.

## Verification Targets

- `npm run capture:claude-launch-browser-workflow`
- `npm run registry:check`
- JSON parse for `surfaces/registry.json` and `package.json`
- `git diff --check`
- `npm run hf:lint`
- `npm run hf:validate`
- `npm run hf:inspect`
- `npm run hf:snapshot`
- `npm run hf:render`
- `ffprobe renders/claude-keynote-workflow-draft.mp4`
