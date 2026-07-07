# UI Backlot

UI Backlot is an open-source, agent-first workspace for scripted product-demo
videos. The core idea is to rebuild the software surfaces we want to teach as
deterministic HTML/HyperFrames scenes, then render those scenes instead of
relying on fragile live screen recordings.

The project is capture-first: reference videos set the taste bar, but live apps,
DOM/CSS, screenshots, and accessibility trees are the preferred source of truth
for rebuilding editable UI surfaces.

Open-source UI projects are now an explicit refinement lane. Use them as
reference material and component donors for macOS, Claude/chat, browser, and
Office-like surfaces, with license checks before copying code or assets.

The long-term north star is tracked in [VISION.md](VISION.md). Agents should
start with [AGENTS.md](AGENTS.md), then use [docs/catalog.md](docs/catalog.md)
and [surfaces/registry.json](surfaces/registry.json) to find reusable surfaces.

## The Fidelity Loop

Surfaces are held to a measured bar, not an eyeballed one. The system is
described in [docs/fidelity-loop-plan-2026-07-05.md](docs/fidelity-loop-plan-2026-07-05.md)
and runs as three loops:

1. **Ground-truth capture** — dated reference sets measured from the real
   apps live in `reference/<family>/<YYYY-MM-DD>/` (computed-style
   `tokens.json`, provenance `manifest.json`, and screenshots where pixels
   could be captured — screenshots of logged-in sessions stay local-only).
   [reference/sources.json](reference/sources.json) declares how each family
   is acquired on a given machine: `live-web` (agent-driven browser capture),
   `native-local` (installed app screenshots), `online-only` (official
   docs/press re-scrape), or `manual-inbox` (human-provided screenshots filed
   by `tools/import-reference.mjs`).
2. **Drift detection** — re-capture on a schedule, diff against the previous
   dated set with `tools/fidelity-score.mjs`, and turn real app changes into
   work items.
3. **Rebuild with a hard bar** — `npm run fidelity:score` compares a
   surface's capture against measured ground truth (role-aware color diff,
   typography, radii, spacing, shadows, plus pixel diff) and writes ranked,
   actionable deltas to `reports/fidelity/`. The score is the bar: fixes are
   made from measured deltas, never from memory of what an app looks like.

### Repo workflows (agent-run)

- `.claude/workflows/fidelity-push.js` — a full scored pass over existing
  families: deterministic Score → Fable/Opus Critique (fed the measured
  deltas) → Sonnet Fix with capture-verify loops → adversarial Judge that
  enforces the score bar and runs a **stranger test** (a fresh-context judge
  sees real-vs-rebuilt image pairs under neutral filenames and must pick the
  real one; its tells become the next round's work) → full Gate sweep.
- `.claude/workflows/onboard-app.js` — the front door for a **net-new app
  family** (args `{family, title, urls}`): availability probe + official-
  source sweep → dated ground-truth capture → measured spec → build →
  adversarial judge rounds → registration in `registry.json`,
  `sources.json`, and the fidelity-push family list.

Model policy: Fable/Opus only where judgment is the product (critique, spec,
judge, stranger test); Sonnet for build/fix iteration; Haiku for mechanical
stages (scoring commands, staging, gates, registration).

### Fidelity tooling

```bash
# Capture a public live page into a dated reference set
npm run reference:capture -- https://example.com --family <fam> --label web-app

# File human-provided screenshots or browser-extracted token dumps
npm run reference:import -- --family <fam> --label desktop-app --image shot.png

# Score a surface against measured ground truth
npm run fidelity:score -- --label <name> \
  --ours captures/surface-<id>/capture.json \
  --theirs reference/<fam>/<date>/<label>/tokens.json
```

`tools/extract-ui-tokens.js` is the shared browser-injectable extractor both
sides use (our captures and the live apps), so the comparison is symmetric.
`tools/crop-to-beacons.mjs` crops window screenshots to the exact page
content for logged-in apps that block automated browsers.

## Quickstart

```bash
npm install
npm run catalog:generate
npm run registry:check
npm run capture:quickstart-demo
npm run example:quickstart:render
```

The quickstart demo lives at
[examples/quickstart-demo.html](examples/quickstart-demo.html). It mounts the
tracked macOS menu bar, browser surface, and Claude chat pane, then renders a
14 second HyperFrames draft video.

For the full source/catalog/HyperFrames gate, run:

```bash
npm run open-source:check
```

`open-source:check` does not render video; add `npm run example:quickstart:render`
or a workflow-specific render command when changing demos.
Generated capture PNGs are intentionally ignored, so `registry:check` validates
capture metadata and scripts without requiring those files. After regenerating a
local capture inventory, run `npm run registry:check:captures` to require every
registered capture PNG on disk.

To rebuild the one-page visual inventory of every registry surface, run:

```bash
npm run inventory:refresh
```

That refreshes each ready capture, then writes the ignored local files
`captures/surface-inventory.html` and `captures/surface-inventory.png`.

The focused target is a Claude-on-Mac demo environment:

- A Claude assistant surface.
- A macOS desktop and Finder shell.
- A PowerPoint-like presentation editor surface, with exact PowerPoint capture
  still pending.
- Reusable motion primitives for typing, cursor movement, drag/drop, file
  selection, tool calls, agent progress, and app switching.

## Surface Discovery

- [docs/catalog.md](docs/catalog.md) - generated public catalog for humans and
  agents.
- [surfaces/registry.json](surfaces/registry.json) - authoritative
  machine-readable surface inventory.
- [docs/guides/build-hyperframes-demo.md](docs/guides/build-hyperframes-demo.md)
  - guide for composing a HyperFrames demo from tracked components.

Run `npm run catalog:generate` after editing `surfaces/registry.json`.

## Scriptable interactions

`runtime/backlot-interactions.js` scripts realistic UI actions — typing,
clicking, sending a chat, streaming an AI reply — onto the HyperFrames
timeline. Because HyperFrames renders by **seeking** the timeline (and GSAP
suppresses callbacks like `onUpdate` on seek), every reveal is done with an
interpolated **property** (opacity/transform), so it scrubs frame-accurately.
Text types/streams via per-character opacity stagger, not a callback.

Author a demo in a few lines:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script src="../runtime/backlot-interactions.js"></script>
<script>
  const tl = gsap.timeline({ paused: true });
  const ix = BacklotInteractions.create(tl, {
    root: stage, cursor: ".demo-cursor", ring: ".demo-click-ring",
  });
  ix.type(".composer-input", "Summarize the Q2 deck", { at: 1.5, cps: 22 })
    .click(".send-button", { at: 4.2 })
    .send({ from: ".composer-input", into: ".thread", text: "…", at: 4.4 })
    .think(".thinking", { at: 4.8, dur: 1.0 })
    .stream(".ai-response", "Here are the takeaways…", { at: 5.9, cps: 48 });
  window.__timelines["my-demo"] = tl;
</script>
```

Actions: `moveTo` · `click` · `type` · `stream` · `send` · `show` · `hide` ·
`think` · `press`. Rules: text targets start empty (use a separate placeholder
element and `hide()` it); state flips use `tl.set(el, { attr: { class } })`
(seek-safe), never `.call()`. Worked examples, one per app, live in
`examples/*-interaction.html` (Claude chat, Excel, Word, PowerPoint, browser,
Finder, Codex, cowork). Render with
`npx hyperframes render --composition examples/<name>.html --quality draft --low-memory-mode`.
See [docs/interactions-system-plan.md](docs/interactions-system-plan.md).

## Current Editable Surfaces

- [index.html](index.html) - current 16 second HyperFrames composition.
- [styles/workflow.css](styles/workflow.css) - visual styling for the current
  composition.
- [compositions/presentation-editor.html](compositions/presentation-editor.html)
  - mounted PowerPoint-like editor sub-composition.
- [compositions/browser-app.html](compositions/browser-app.html)
  - mounted browser/app sub-composition derived from the standalone browser lab.
- [assets](assets) - local asset notes. Font binaries copied from installed apps
  are intentionally local-only and ignored by git.
- [reference/open-source](reference/open-source) - local donor-repo clone area.
  Restore ignored donor clones with `tools/clone-reference-repos.sh`.
- [reference/claude](reference/claude) - local-only Claude launch media notes.
  Downloaded videos, screenshots, and extracted frames are ignored by git.
- [compositions/claude-composed-app.html](compositions/claude-composed-app.html)
  - canonical Claude shell: mounts `claude-sidebar`, `claude-thread-core`,
    `claude-composer`, and `claude-agent-rail` via
    [runtime/backlot-component-loader.js](runtime/backlot-component-loader.js),
    parameterized by `data-page="chat|cowork|code"`, `data-sidebar`/
    `data-rail="on|off"`, and `.theme-dark`.
- [surfaces/README.md](surfaces/README.md)
- [PRIMITIVES.md](PRIMITIVES.md)

## Project Boundaries

- License: [ISC](LICENSE).
- Asset stance: fidelity-first — recreate as closely as possible; the only
  default is keeping the owner's own logged-in captures out of git (privacy).
- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md).

Tracked surfaces should stay runnable from a fresh clone — keep private
captures, donor-repo clones, downloaded product videos, and generated renders
local (size and privacy), and use synthetic demo content in the surfaces
themselves.

Research starts in:

- [docs/research/claude-release-video-references.md](docs/research/claude-release-video-references.md)
- [docs/research/hyperframes-website-workflow.md](docs/research/hyperframes-website-workflow.md)
- [docs/research/open-source-ui-donor-repos.md](docs/research/open-source-ui-donor-repos.md)
- [docs/workflows/capture-first-ui-reconstruction.md](docs/workflows/capture-first-ui-reconstruction.md)
- [docs/workflows/target-surface-inventory.md](docs/workflows/target-surface-inventory.md)

Useful commands:

```bash
npm run catalog:generate
npm run registry:check
npm run registry:check:captures
npm run capture:web -- <url-or-local-file> --slug <name> [--selector "main"]
npm run capture:quickstart-demo
npm run capture:surface
npm run capture:finder
npm run capture:browser-app
npm run inventory:generate
npm run inventory:refresh
npm run compare:finder
npm run compare:sheets
npm run hf:lint
npm run hf:validate
npm run hf:inspect
npm run hf:snapshot
npm run hf:render
npm run example:quickstart:render
```

Current render artifact:

- `renders/claude-keynote-workflow-draft.mp4`

The render filename is historical; the current composition content is focused on
Claude, Finder, a browser/app background surface, and a PowerPoint-like
presentation editor.
