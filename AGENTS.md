# Agent Guide

UI Backlot is an agent-first HyperFrames demo-surface kit. Treat the repo as a
library of editable software sets, not as one monolithic video.

## Fast Orientation

Read these files first:

1. `VISION.md` - product purpose and quality bar.
2. `docs/design-language.md` - visual identity and motion rules.
3. `docs/catalog.md` - human and agent-readable surface catalog.
4. `surfaces/registry.json` - authoritative machine-readable inventory.
5. `docs/guides/build-hyperframes-demo.md` - how to assemble a demo.
6. Asset stance: fidelity-first — recreate as closely as possible; keep the
   owner's own logged-in captures local (privacy). No other asset constraints.
   Source real assets instead of redrawing them, and hunt real-app references
   creatively when local ones are weak — ladders and recipes in
   `docs/reference-and-asset-sourcing.md`.
7. `docs/fidelity-loop-plan-2026-07-05.md` - the ground-truth capture /
   drift / rebuild loop. `reference/sources.json` declares how each family's
   real-app references are acquired; `reference/<family>/<date>/` holds dated
   measurement sets; `npm run fidelity:score` measures a surface against them
   and writes `reports/fidelity/`. Fix fidelity gaps from measured deltas in
   those reports, not from memory of what the app looks like.
8. Repo workflows (run via the Workflow tool): `.claude/workflows/
   fidelity-push.js` = reference refresh + scored critique/fix/judge pass over
   existing families; `.claude/workflows/onboard-app.js` = add a NET-NEW app
   family end to end (research → capture → spec → build → judge → register),
   args `{family, title, urls}`; `.claude/workflows/interaction-push.js` =
   motion pass over interaction demos (motion refs → author missing ones →
   render → frame-level motion judge vs real recordings → fix rounds → ship
   GIF + README row), args `{demos}`; `.claude/workflows/drift-watch.js` =
   cheap weekly probe (app versions + drift diff) that emits the fidelity-push
   work order; `.claude/workflows/publish-sync.js` = after surfaces change,
   re-sync every derived artifact (catalog, HyperFrames registry, Pages site,
   review pages, demo GIFs, README); `.claude/workflows/consumer-smoke.js` =
   install from the committed registry like an external user, compose + render
   following only the public docs, report friction (args `{remote:true}` to
   test the pushed GitHub registry). Model policy for ALL loops: Opus is the
   ceiling (judgment only), Sonnet builds/fixes/captures, Haiku for anything
   mechanical — never Fable.
9. Working files go in `workspace/` (gitignored; loop scratch in
   `workspace/fidelity/` and `workspace/interactions/`, ad-hoc files in
   `workspace/scratch/`). Review loop results visually with `npm run review`
   (builds self-contained `workspace/compare.html` + `workspace/gallery.html`,
   serves on :4173) — see CLAUDE.md for the Artifact-publishing convention.
10. External consumers install surfaces via the committed `registry/`
   (HyperFrames format, generated from `surfaces/registry.json`). After
   editing the surface registry or a published composition, run
   `npm run registry:hf:generate` — `open-source:check` fails on a stale
   `registry/`.

## Pick Surfaces

Use `surfaces/registry.json` as the source of truth. Each surface has:

- `id` - stable identifier for prompts, plans, and docs.
- `kind` - `component`, `surface`, or `lab`.
- `source` - tracked HTML source.
- `import.src` and `import.selector` - values for component mounting.
- `capture.script` - npm script to refresh a visual proof.
- `tags` - agent routing hints.
- `assetDecision` - whether copied assets are involved.
- `recommendedUse` - when to choose it.

Scenes are composed, not shipped: there are no pre-baked scene wrappers.
Stack `mac-menu-bar` (+ `mac-dock` if the desktop shows), one or more app
surfaces, and a Claude or Codex component in your own composition —
`examples/quickstart-demo.html` is the worked pattern.

Good defaults per role:

- The realistic Claude app: `claude-composed-app` (`?page=home|chat|cowork|code`,
  default home — chat and cowork are ONE page in the real app, picked by the
  composer's Chat|Cowork pill; `data-sidebar`/`data-rail` toggles, `theme-dark`).
  Ground truth is the real Claude MAC app (`reference/claude/<date>/mac-app-*`).
- Claude next to an app window: `claude-composed-app` with `data-sidebar="off"`
  (the standalone `claude-chat-pane` is deprecated/folded in).
- Zoomed conversation close-ups: `claude-cinematic`
  (`?beat=prompt|reply|complete`, copy via `data-copy` slots).
- Claude in a terminal: `claude-code-terminal-session`; Codex: `codex-app` /
  `codex-terminal`.
- App windows: `excel-workbook`, `word-editor`, `presentation-editor`,
  `figma-editor`, `premiere-editor`, `browser-app`, `finder-window`,
  `calendar-app`.

## Build A Demo

Start from `examples/quickstart-demo.html` when the prompt does not require a
specific wrapper. It demonstrates the preferred pattern:

- root composition in an HTML file
- tracked components mounted with `data-backlot-mount-src`
- selectors from `surfaces/registry.json`
- timeline registered in `window.__timelines`
- deterministic cursor and click-ring animation

Render it with:

```bash
npm run example:quickstart:render
```

## Verify Work

For public-ready changes, run:

```bash
npm install
npm run catalog:generate
npm run registry:check
npm run hf:lint
npm run hf:validate
npm run hf:inspect
npm run capture:quickstart-demo
npm run example:quickstart:render
```

Generated captures are ignored by git. `registry:check` validates capture
metadata from a fresh clone; `npm run registry:check:captures` additionally
requires generated capture PNGs on disk after a local capture sweep.

For a smaller local pass after editing one surface, run its capture script plus
the registry and HyperFrames checks.

## Edit Rules

- Recreate real surfaces as closely as possible (match real fonts/glyphs/logos);
  keep the UI editable in HTML/CSS/SVG so it can animate for video.
- Do not commit local-only reference media, generated captures, generated
  renders, donor clones, or the owner's private/logged-in captures (size and
  privacy).
- Add new reusable surfaces to `surfaces/registry.json`.
- Regenerate `docs/catalog.md` (`npm run catalog:generate`) AND the public
  HyperFrames registry (`npm run registry:hf:generate`) after registry changes.
- Keep examples small. A public starter should show how to compose surfaces,
  not hide the pattern behind a large bespoke scene.
