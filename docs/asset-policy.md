# Asset Policy

UI Backlot is source-first. The reusable kit should work from a fresh clone
using tracked HTML, CSS, JavaScript, SVG, JSON, Markdown, and small reference
assets with clear redistribution posture.

## Tracked Assets

Tracked assets may include:

- Hand-authored SVG cursors, icons, and interface marks in `assets/`.
- Small screenshots in `reference/` when they are allowed to be redistributed
  or are necessary as public source evidence.
- Demo workspace files in `demo-workspace/` that contain synthetic data.
- Machine-readable metadata such as `surfaces/registry.json`.

## Local-Only Assets

These are useful for fidelity work but should stay ignored by git unless their
license is explicitly cleared:

- Downloaded product launch videos.
- Extracted video frames and private frame studies.
- Local app screenshots that contain account, company, customer, or private
  project data.
- Fonts copied from installed apps.
- Donor repository clones under `reference/open-source/*/`.
- Generated captures, snapshots, and renders.

## Agent Checklist

Before adding an asset to git:

1. Confirm it is not private user, customer, or workspace data.
2. Confirm it is not proprietary app code, a copied product asset, or a copied
   font.
3. Prefer hand-authored replacements when the asset is only needed for UI
   fidelity.
4. Update `surfaces/registry.json` with `sourceEvidence` and `assetDecision`
   when the asset informs a surface.
5. Run `git status --short` and verify generated folders such as `captures/`,
   `renders/`, `snapshots/`, and local donor clones are not staged.
