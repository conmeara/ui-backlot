# Contributing

Thanks for helping build UI Backlot. The project is meant to be useful to both
humans and coding agents, so contributions should leave behind clear metadata,
repeatable commands, and surfaces that recreate the real apps as closely as
possible.

## Setup

```bash
npm install
npm run catalog:generate
npm run registry:check
npm run hf:lint
npm run hf:validate
npm run hf:inspect
```

Node.js 22 or newer and FFmpeg are recommended for HyperFrames rendering.

`hf:lint` has a known baseline of 29 intentional errors: 21×
`invalid_parent_traversal_in_asset_path` (in-repo compositions use `../` paths
because the capture pipeline loads them via `file://`; the published
`registry/` copies are rewritten root-relative for consumers) and 8×
`template_literal_selector` (pre-existing). New errors beyond that baseline
should be fixed before a PR.
Generated captures are ignored by git. `registry:check` validates capture
metadata in a fresh clone; run `npm run registry:check:captures` after a local
capture sweep when you want the registry to require every PNG on disk.

## Add Or Improve A Surface

1. Capture or inspect real reference state when possible.
2. Rebuild the important UI as editable HTML/CSS/SVG.
3. Add or update the entry in `surfaces/registry.json`.
4. Add a short prototype note in `docs/prototypes/` when the change introduces
   a new source, fidelity decision, or reusable pattern.
5. Run the surface capture script and the validation commands.
6. Regenerate `docs/catalog.md` (`npm run catalog:generate`) and the public
   HyperFrames registry (`npm run registry:hf:generate`).

**Adding a whole new app family?** That's a workflow, not a manual project:
run `.claude/workflows/onboard-app.js` via the Workflow tool with
`{family, title, urls}` — it researches references, captures dated ground
truth, writes a measured spec, builds the surface, holds it to an adversarial
judge, and registers it everywhere. See AGENTS.md.

## Add A Demo Workflow

1. Prefer a wrapper composition that imports existing components.
2. Keep the composition between 12 and 20 seconds unless the story needs more.
3. Register the timeline in `window.__timelines`.
4. Add an npm render or capture command if the workflow is intended as a public
   starter.
5. Verify with HyperFrames lint, validate, inspect, capture, and draft render.

## Asset Rules

Fidelity-first. Recreate real surfaces as closely as possible; track real
fonts, glyphs, and logos when they improve the match.

Keep the following local (for size and privacy, not licensing): your own
private/logged-in captures, downloaded product videos, extracted frames,
donor-repo clones, product app bundles, and generated captures/renders. Use
synthetic demo content in the tracked surfaces.

## Pull Request Checklist

- [ ] `npm run open-source:check` (catalog + surface registry + HyperFrames
      registry staleness + lint + validate + inspect)
- [ ] At least one relevant `npm run capture:*` command
- [ ] A draft render when a demo workflow changed
- [ ] Visual sanity pass: `npm run review` and glance at the gallery/compare pages
- [ ] `git diff --check`
