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

`npx hyperframes lint` (the `hf:lint` script) exits 1 whenever it finds ANY
error, including a small set this repo carries on purpose — currently 7×
`invalid_parent_traversal_in_asset_path` across `index.html`,
`compositions/browser-app.html`, `compositions/calendar-app.html`,
`compositions/claude-cinematic.html`, `compositions/claude-composed-app.html`,
`compositions/mac-dock.html`, and `compositions/mac-wallpaper.html` (in-repo
compositions use `../` paths
because the capture pipeline loads them via `file://`; the published
`registry/` copies are rewritten root-relative for consumers). `npm run
hf:lint:check` (`tools/check-lint-baseline.mjs`, used by `open-source:check`
instead of raw `hf:lint`) re-runs lint and compares its errors against the
committed baseline in `tools/lint-baseline.json`, passing when the current
errors are equal to or a subset of that baseline and failing on any genuinely
new error. If you intentionally add a new baseline exception, update
`tools/lint-baseline.json` (and this paragraph) to match; if you fix one of
the baseline errors, shrink `tools/lint-baseline.json` too.
Generated captures are ignored by git. `registry:check` validates capture
metadata in a fresh clone; run `npm run registry:check:captures` after a local
capture sweep when you want the registry to require every PNG on disk.

## Add Or Improve A Surface

1. Capture or inspect real reference state when possible — the acquisition
   ladder (live app, web version, donor repos, marketing shots, as a last
   resort) is [docs/reference-and-asset-sourcing.md](docs/reference-and-asset-sourcing.md).
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

## Add An Interaction Demo

1. Start from an existing `examples/*-interaction.html` — a composition that
   mounts tracked components and scripts them with
   `runtime/backlot-interactions.js`.
2. Keep it between 12 and 20 seconds unless the story needs more.
3. Register the timeline in `window.__timelines`.
4. Verify with HyperFrames lint, validate, inspect, and a draft render; ship
   the GIF to `docs/media/`.

## Asset Rules

Fidelity-first. Recreate real surfaces as closely as possible; track real
fonts, glyphs, and logos when they improve the match.

Keep the following local (for size and privacy, not licensing): your own
private/logged-in captures, downloaded product videos, extracted frames,
donor-repo clones, product app bundles, and generated captures/renders. Use
synthetic demo content in the tracked surfaces.

## Maintenance Workflows

Beyond the fidelity-push / interaction-push / onboard-app loops (see
AGENTS.md), a few narrower workflows keep the repo honest — run any of them
via the Workflow tool:

- **publish-sync** — after surfaces change, regenerates the catalog,
  HyperFrames registry, Pages site, review pages, demo GIFs, and README copy
  in one pass; a faster alternative to step 6 above done by hand.
- **drift-watch** — a cheap periodic probe for real-app version changes; it
  doesn't fix anything, it just outputs a scoped `{families:[...]}` work order
  for fidelity-push.
- **consumer-smoke** — installs from the committed registry exactly like an
  external HyperFrames user and reports friction; run before a release/push
  that touches the registry, README, or guides.
- **consolidate-surfaces** — the component-consolidation plan (one canonical
  surface per app, variants as parameters); see
  [docs/component-consolidation-audit-2026-07-02.md](docs/component-consolidation-audit-2026-07-02.md).

## Pull Request Checklist

- [ ] `npm run open-source:check` (catalog + surface registry + HyperFrames
      registry staleness + lint + validate + inspect)
- [ ] At least one relevant `npm run capture:*` command
- [ ] **Before/after images in the PR description** for any change to how a
      surface looks — and a short video or GIF when motion changed. Visual
      diffs are how PRs get reviewed here; the capture scripts and
      `npm run review` give you the images.
- [ ] A draft render when an interaction demo changed
- [ ] `git diff --check`
