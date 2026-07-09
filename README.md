# UI Backlot

**Editable software sets for product-demo videos.** UI Backlot rebuilds the
apps you want to show — Claude, Codex, macOS, Excel, Word, PowerPoint, Figma,
Premiere, browsers — as high-fidelity, scriptable HTML surfaces, then renders
demos with [HyperFrames](https://hyperframes.heygen.com) instead of screen
recordings. Change one line of copy, re-render, done: no retakes, no fragile
live captures.

## Demos

Everything below is a **rendered HyperFrames scene** — no screen recording. Real
app surfaces, a real macOS pointer, and scripted interactions (typing, clicking,
streaming replies), rendered deterministically frame by frame.

![macOS desktop — open the Claude app, then Excel on top](docs/media/mac-multi-app-demo.gif)

<sub>The kind of prompt that produces this: *"Make a demo where a cursor pulls
the Claude app up from the dock, then opens Excel on top."*</sub>

<table>
<tr>
<td width="50%"><b>Claude — chat</b><br><img src="docs/media/claude-chat-interaction.gif" alt="Claude chat interaction"></td>
<td width="50%"><b>Claude — cowork</b><br><img src="docs/media/cowork-interaction.gif" alt="Claude cowork interaction"></td>
</tr>
<tr>
<td><b>Excel</b><br><img src="docs/media/excel-interaction.gif" alt="Excel interaction"></td>
<td><b>Word</b><br><img src="docs/media/word-interaction.gif" alt="Word interaction"></td>
</tr>
<tr>
<td><b>PowerPoint</b><br><img src="docs/media/powerpoint-interaction.gif" alt="PowerPoint interaction"></td>
<td><b>Browser</b><br><img src="docs/media/browser-interaction.gif" alt="Browser interaction"></td>
</tr>
<tr>
<td><b>Finder</b><br><img src="docs/media/finder-interaction.gif" alt="Finder interaction"></td>
<td><b>Codex CLI</b><br><img src="docs/media/codex-interaction.gif" alt="Codex CLI interaction"></td>
</tr>
<tr>
<td><b>Claude Code CLI</b><br><img src="docs/media/claude-code-interaction.gif" alt="Claude Code CLI interaction"></td>
<td></td>
</tr>
</table>

## Use the surfaces in your own project

UI Backlot publishes a **HyperFrames registry** — install any surface into your
own HyperFrames project and its dependencies (foundation CSS, fonts, runtime,
composed parts) come with it. Tell your coding agent:

> Add `"registry": "https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry"`
> to my `hyperframes.json`, browse
> [`registry.json`](https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry/registry.json)
> for available blocks, then `npx hyperframes add <name>` what the demo needs
> and wire the printed snippets into my composition.

```bash
# starting from an empty folder? bootstrap a project first
npx hyperframes init my-video --example blank --non-interactive
cd my-video

# one surface (foundation CSS + fonts install automatically)
npx hyperframes add excel-workbook

# a "Claude working in Excel on a Mac" scene = three blocks you stack yourself
npx hyperframes add mac-menu-bar
npx hyperframes add excel-workbook
npx hyperframes add claude-chat-pane
```

> `hyperframes init` also installs its agent skills into your global
> `~/.claude/skills` — pass `--skip-skills` (or `HYPERFRAMES_SKIP_SKILLS=1`)
> if you only want the project scaffold.

Each `add` prints a ready-to-paste snippet — scenes are composed by stacking
blocks, not installed pre-baked. Give each pasted host `<div>` a unique
`data-composition-id` (the printed snippet omits it, `hyperframes lint`
requires it). Variants are parameters: `class="theme-dark"`
on blocks tagged `dark-mode-ready`, `?page=chat|cowork|code` on
`claude-composed-app`, `?beat=prompt|reply|complete` on `claude-cinematic`.

Complete starter projects scaffold with degit:

```bash
npx degit conmeara/ui-backlot/registry/examples/mac-multi-app my-video
cd my-video && npx hyperframes render --composition index.html --quality draft
```

Agents: [`llms.txt`](llms.txt) is the machine-readable version of this section.

## Run this repo

```bash
npm install
npm run capture:quickstart-demo
npm run example:quickstart:render   # ~14s draft video in renders/
```

The quickstart composition is
[examples/quickstart-demo.html](examples/quickstart-demo.html) — macOS menu
bar + browser surface + Claude chat pane. Before a PR:

```bash
npm run open-source:check     # catalog + registries + lint + validate + inspect
npm run review                # gallery + compare pages on :4173
```

## Find a surface

- **[Hosted catalog](https://conmeara.github.io/ui-backlot/)** — browse by
  application with thumbnails, variants, demo GIFs, and copyable install
  commands (regenerate with `npm run pages:catalog`).
- [surfaces/registry.json](surfaces/registry.json) — the authoritative
  inventory (source, import selector, capture command, provenance);
  [docs/catalog.md](docs/catalog.md) is its generated, readable form.
- [docs/guides/build-hyperframes-demo.md](docs/guides/build-hyperframes-demo.md)
  — composing a demo from tracked components.

## Scriptable interactions

`runtime/backlot-interactions.js` scripts realistic UI actions — typing,
clicking, sending a chat, streaming an AI reply — onto the HyperFrames
timeline. HyperFrames renders by **seeking** the timeline, so every reveal is
an interpolated property (opacity/transform), never a callback — it scrubs
frame-accurately.

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
element and `hide()` it); state flips use `tl.set(el, { attr: { class } })`,
never `.call()`. Render with
`npx hyperframes render --composition examples/<name>.html --quality draft --low-memory-mode`.
Details: [docs/interactions-system-plan.md](docs/interactions-system-plan.md).

## Loops

Real apps keep changing, so the backlot maintains itself through agent
workflows. Surfaces are held to a **measured** bar: dated ground-truth
reference sets live in `reference/<family>/<date>/`, and
`npm run fidelity:score` writes ranked deltas to `reports/fidelity/` — fixes
come from measured deltas, never from memory of what an app looks like.

Three workflows (run via the Workflow tool; see [AGENTS.md](AGENTS.md)):

- **fidelity-push** — score every family, critique from the measured deltas,
  fix, then an adversarial judge (including a stranger test: pick the real app
  from real-vs-rebuilt pairs).
- **interaction-push** — the motion counterpart: render each demo, hold the
  frames to a motion judge, repair, ship the GIF.
- **onboard-app** — add a net-new app family end to end: research → dated
  ground-truth capture → spec → build → judge → register.

Loop artifacts land in `workspace/` (gitignored); `npm run review` builds and
serves two self-contained pages — `compare.html` (reference vs current, plus
the latest pass's applied changes) and `gallery.html` (the catalog by app
family). Both inline their media, so they can also be published as Claude Code
Artifacts for remote monitoring during long passes.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — setup, the surface checklist, and the
PR gates. **Include before/after screenshots (or a short video/GIF) in any PR
that changes how a surface looks or moves** — visual diffs are how reviews
happen here. The docs index is [docs/README.md](docs/README.md); design
language lives in [docs/design-language.md](docs/design-language.md).

## License, trademarks & third-party assets

- Code and surfaces: [ISC](LICENSE).
- The surfaces are **original HTML/CSS recreations** of real product UIs,
  made for instructional and demonstrative purposes (fair use). All product
  names, logos, and brands are property of their respective owners; their use
  here does not imply endorsement. The full attribution register is
  [RESOURCES.md](RESOURCES.md).
- Privacy is the one hard constraint: contributors' own logged-in captures
  stay local (gitignored); tracked surfaces use synthetic demo content.
