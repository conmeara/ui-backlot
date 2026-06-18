# Claude Home Dframe Sidebar Pass 035

Date: 2026-06-18

## Goal

Refine the standalone Claude new-chat/home component so it cuts together with the newer Claude working-thread surface and remains useful as a focused HyperFrames import when a clip only needs Claude's opening prompt state.

## Changed

- Converted the home surface from an older flush two-column shell to the newer inset `dframe` sidebar geometry used by `compositions/claude-app.html`.
- Increased the sidebar to 280px, added the rounded white panel, soft card shadow, compact row rhythm, and smaller topbar treatment.
- Reworked the center welcome/composer stack to sit on Claude's warmer paper background with a 608px prompt card, softer 20px radius, and quieter controls.
- Aligned sidebar section labels with the working-thread component: `Pinned` and `Today`.
- Preserved the standalone template and direct preview behavior for HyperFrames/component captures.

## Reference Basis

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `captures/surface-claude-app/target.png`
- `docs/prototypes/claude-app-dframe-sidebar-pass-033.md`
- `/Applications/Claude.app` as local availability context, without copying product code or private data.

## Asset And License Decision

Hand-authored HTML/CSS only. No Claude product code, bundled app assets, or private account data copied. Local Anthropic font files already in `assets/fonts` remain the typographic basis for the editable mock surfaces.

## Verification

Run in this pass:

- `npm run capture:claude-home`
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

- Registry reports `15 surfaces, 11 components, 2 workflows, 15 ready captures`.
- HyperFrames validate reports no console errors.
- HyperFrames inspect reports `0` layout issues.
- Draft render duration is `16.000000` seconds.
