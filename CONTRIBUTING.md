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
6. Regenerate `docs/catalog.md`.

## Add A Demo Workflow

1. Prefer a wrapper composition that imports existing components.
2. Keep the composition between 12 and 20 seconds unless the story needs more.
3. Register the timeline in `window.__timelines`.
4. Add an npm render or capture command if the workflow is intended as a public
   starter.
5. Verify with HyperFrames lint, validate, inspect, capture, and draft render.

## Asset Rules

Fidelity-first — see `docs/asset-policy.md`. Recreate real surfaces as closely
as possible; track real fonts, glyphs, and logos when they improve the match.

Keep the following local (for size and privacy, not licensing): your own
private/logged-in captures, downloaded product videos, extracted frames,
donor-repo clones, product app bundles, and generated captures/renders. Use
synthetic demo content in the tracked surfaces.

## Pull Request Checklist

- [ ] `npm run catalog:generate`
- [ ] `npm run registry:check`
- [ ] `npm run hf:lint`
- [ ] `npm run hf:validate`
- [ ] `npm run hf:inspect`
- [ ] At least one relevant `npm run capture:*` command
- [ ] A draft render when a demo workflow changed
- [ ] `git diff --check`
