# Claude Finder Workflow Attachment Pass 037

Date: 2026-06-18

## Purpose

Upgrade the focused Claude plus Finder wrapper so it uses the new `claude-attachment-draft` component as the pre-work state. This proves the handoff can be assembled from only the needed editable components: Finder, Claude attachment draft, and Claude working thread.

## Evidence Used

- `compositions/finder-window.html`
- `compositions/claude-attachment-draft.html`
- `compositions/claude-app.html`
- `runtime/backlot-component-loader.js`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `docs/prototypes/claude-attachment-draft-surface-pass-036.md`
- `docs/prototypes/claude-finder-workflow-pass-031.md`

## Changes

- Added a mounted `claude-attachment-component` to `compositions/claude-finder-workflow.html`.
- Kept the wrapper focused: no browser, PowerPoint, full desktop lab, or screenshot plates.
- Updated parent choreography so the folder drag lands on the attachment-draft Claude state, then the working-thread Claude state fades in later.
- Updated the registry dependency list to `finder-window`, `claude-attachment-draft`, and `claude-app`.
- Updated `SURFACES.md` and `surfaces/README.md` to describe the new focused assembly.

## Asset Decision

No new external assets, product code, screenshots, private account data, or private folder contents were added. The wrapper composes existing hand-authored editable surfaces through the Backlot component loader.

## Verification

Run in this pass:

- `npm run capture:claude-finder-workflow`
- `npm run registry:check`
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); JSON.parse(require('fs').readFileSync('surfaces/registry.json','utf8')); console.log('json ok')"`
- `npm run hf:lint`
- `npm run hf:validate`
- `npm run hf:inspect`
- `npm run hf:snapshot`
- `npm run hf:render`
- `ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 renders/claude-keynote-workflow-draft.mp4`
- `git diff --check`

Result:

- Focused workflow capture refreshed at `captures/surface-claude-finder-workflow/target.png`.
- Registry reports `16 surfaces, 12 components, 2 workflows, 16 ready captures`.
- HyperFrames lint reports `0` errors. Warnings are the expected Studio editability warnings for GSAP-owned animated elements and mounted component roots.
- HyperFrames validate reports no console errors.
- HyperFrames inspect reports `0` layout issues.
- Draft render duration is `16.000000` seconds.
