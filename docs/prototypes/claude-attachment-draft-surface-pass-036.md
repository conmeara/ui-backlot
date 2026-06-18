# Claude Attachment Draft Surface Pass 036

Date: 2026-06-18

## Goal

Add a reusable Claude pre-submit state for demos where a user has selected local folder/file context but Claude has not started working yet. This fills the gap between `claude-home` and `claude-app` so short HyperFrames clips can import a realistic attached-folder Claude surface without Finder, browser, PowerPoint, or the full desktop wrapper.

## Added

- `compositions/claude-attachment-draft.html`
- `npm run capture:claude-attachment-draft`
- `claude-attachment-draft` entry in `surfaces/registry.json`
- Surface documentation in `SURFACES.md` and `surfaces/README.md`

## Surface Notes

- Uses the same refined 280px inset dframe sidebar geometry as the newer Claude states.
- Shows a centered Claude mark/name, attached `Launch Deck` folder card, three editable attachment chips, draft prompt text, `Work in a folder` active pill, and folder-context popover.
- The component is template-wrapped for HyperFrames subcomposition imports and has a direct preview mount for focused screenshots.

## Reference Basis

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `docs/prototypes/claude-home-dframe-sidebar-pass-035.md`
- `docs/prototypes/claude-app-dframe-sidebar-pass-033.md`
- `/Applications/Claude.app` as local availability context, without copying product code or private data.

## Asset And License Decision

Hand-authored HTML/CSS only. No Claude product code, bundled app assets, private account content, or private folder contents copied. Local Anthropic font files already in `assets/fonts` remain the typographic basis for the editable mock surfaces.

## Verification

Run in this pass:

- `npm run capture:claude-attachment-draft`
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

- Registry reports `16 surfaces, 12 components, 2 workflows, 16 ready captures`.
- HyperFrames lint reports `0` errors. The new warning is the expected Studio editability warning for GSAP-owned attachment-draft elements.
- HyperFrames validate reports no console errors.
- HyperFrames inspect reports `0` layout issues.
- Draft render duration is `16.000000` seconds.
