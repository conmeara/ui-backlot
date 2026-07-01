# Asset Policy

UI Backlot is source-first and fidelity-first. The reusable kit should work
from a fresh clone using tracked HTML, CSS, JavaScript, SVG, JSON, Markdown,
font files, and small reference assets that make reconstructed software
surfaces look like the real applications they represent.

The project owner has chosen source-authentic fidelity over the earlier
public-safe-only posture. Real fonts, icons, logos, and app UI elements may be
tracked when they materially improve surface quality. Keep provenance explicit
so future public packaging or redistribution reviews can make informed calls.

## Tracked Assets

Tracked assets may include:

- Hand-authored SVG cursors, icons, and interface marks in `assets/`.
- Source-authentic fonts, icons, logos, and app UI elements needed for fidelity
  when their source is documented.
- Small screenshots in `reference/` when they are allowed to be redistributed
  or are necessary as source evidence.
- Demo workspace files in `demo-workspace/` that contain synthetic data.
- Machine-readable metadata such as `surfaces/registry.json`.

## Local-Only Assets

These are useful for fidelity work but should stay ignored by git unless a
surface intentionally depends on them and the source/provenance is documented:

- Downloaded product launch videos.
- Extracted video frames and private frame studies.
- Local app screenshots that contain account, company, customer, or private
  project data.
- Large raw app bundles, full generated icon packages, or font dumps when only a
  small reviewed subset is needed.
- Donor repository clones under `reference/open-source/*/`.
- Generated captures, snapshots, and renders.

## Agent Checklist

Before adding an asset to git:

1. Confirm it is not private user, customer, or workspace data.
2. Confirm the asset is intentionally selected for source-authentic fidelity and
   that its source/provenance is documented.
3. Prefer the smallest editable subset: a few SVG symbols, a named font file, or
   a sanitized UI atom instead of a full donor package or raw app bundle.
4. Update `surfaces/registry.json` with `sourceEvidence` and `assetDecision`
   when the asset informs a surface.
5. Run `git status --short` and verify generated folders such as `captures/`,
   `renders/`, `snapshots/`, and local donor clones are not staged.
