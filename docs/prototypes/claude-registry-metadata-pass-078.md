# Claude Registry Metadata Pass 078

## Purpose

Repair source-of-truth drift in `surfaces/registry.json` for the reusable Claude
surfaces. Future agents use the registry to choose import dimensions,
prototype notes, source evidence, and recommended use, so stale metadata can
cause incorrect wrapper geometry or misleading fidelity claims.

## Evidence

- `compositions/claude-app.html`
- `compositions/claude-cinematic-reply.html`
- `docs/prototypes/claude-app-reference-focus-pass-060.md`
- `docs/prototypes/claude-cinematic-reply-fidelity-pass-070.md`
- `captures/surface-claude-app/target.png`
- `captures/surface-claude-cinematic-reply/target.png`
- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`

## Changes

- Updated the `claude-app` registry entry so its `prototypeNote` points back to
  the Claude working-thread note instead of the later cinematic-reply note.
- Updated the `claude-cinematic-reply` registry entry from the old split-pass
  geometry (`1180x780`) to its current full-frame launch geometry
  (`1920x1080`).
- Updated the `claude-cinematic-reply` registry entry to point at
  `docs/prototypes/claude-cinematic-reply-fidelity-pass-070.md`, the pass that
  actually established the full-frame surface.

## Asset Decision

This pass changes metadata only. It copies no Claude product code, screenshots,
video frames, private account data, app bundle assets, external product assets,
or donor code.

## Verification

Passed in this pass:

- `npm run capture:claude-app`
- `npm run capture:claude-cinematic-reply`
- JSON parse for `package.json` and `surfaces/registry.json`
- `npm run registry:check` -> `41 surfaces, 25 components, 14 workflows, 41 ready captures`
- `npm run hf:lint` -> 0 errors, with existing GSAP/editability warnings
- `npm run hf:validate` -> no console errors
- `npm run hf:inspect` -> 0 issues
- `npm run hf:snapshot`
- `npm run hf:render` -> `renders/claude-keynote-workflow-draft.mp4`
- `ffprobe` -> 1920x1080, 30 fps, 16.000000 seconds, 480 frames
- `git diff --check`

## Remaining Gaps

- The full Claude working-thread shell still needs sanitized current-product
  capture comparison before claiming pixel-level accuracy.
