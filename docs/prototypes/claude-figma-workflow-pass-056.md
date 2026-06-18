# Claude Plus Figma Workflow Pass 056

## Purpose

Add a focused HyperFrames wrapper for videos that need only Claude and a Figma-style design editor. This keeps the reusable app surfaces separate from the parent scene choreography, so a future instructional clip can import Claude plus Figma without loading Finder, browser, Office, Codex terminal, Premiere, or the full desktop lab.

## Evidence

- `compositions/claude-app.html`
- `compositions/figma-editor.html`
- `runtime/backlot-component-loader.js`
- `docs/prototypes/claude-app-reference-breathing-room-pass-055.md`
- `docs/prototypes/figma-editor-surface-pass-024.md`

## Changes

- Added `compositions/claude-figma-workflow.html` as a 1920x1080 root composition.
- Mounted `#figma-editor-surface` and `#claude-app-surface` with the Backlot component loader so capture tooling sees real child DOM.
- Added a lightweight Mac menu bar, donor-cursor path, click ring, desktop field, and GSAP focus choreography owned by the parent wrapper.
- Added `capture:claude-figma-workflow` and a registry entry for agent discovery.

## Asset Decision

The parent wrapper is hand-authored HTML/CSS/GSAP and only mounts local editable UI Backlot components. It copies no screenshot plates, Figma assets, Figma product code, private Figma files, account data, Claude product code, or app assets.

## Capture

- `npm run capture:claude-figma-workflow`
- `captures/surface-claude-figma-workflow/target.png`

## Verification

Passed in this pass:

- `npm run capture:claude-figma-workflow`
- `npm run registry:check` -> `23 surfaces, 13 components, 8 workflows, 23 ready captures`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run hf:lint` -> 0 errors, 20 warnings, 14 info. The new workflow adds the expected GSAP/pointer-events advisories that match the other wrapper scenes.
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> duration `16.000000`, size `2735675`
- `git diff --check`

## Remaining Gaps

- The Figma child component is still a code-native approximation informed by public UI documentation, not a source-captured private Figma file.
- The Claude child component still needs sanitized live Claude capture comparison before it can be treated as final.
- The parent wrapper does not yet coordinate child timeline handles; it uses static mounted component states plus parent-level camera/cursor choreography.
