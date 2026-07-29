# Build A HyperFrames Demo With UI Backlot

This guide is for agents and humans who want to assemble a demo video from the
tracked UI Backlot surfaces.

## 1. Pick The Building Blocks

Open `docs/catalog.md` or read `surfaces/registry.json`. Scenes are composed,
not shipped — stack the pieces the story needs in your own composition:

- Desktop chrome: `mac-menu-bar` (+ `mac-dock` when the desktop shows).
- One or more app windows: `excel-workbook`, `word-editor`,
  `presentation-editor`, `figma-editor`, `premiere-editor`, `browser-app`,
  `finder-window`, `calendar-app`.
- The AI layer: `claude-composed-app` (full app, `data-page="chat|cowork|code"`,
  `data-sidebar="off"` for a sidebar-less pane beside an app window — this
  replaces the deprecated `claude-chat-pane` block), `claude-cinematic`
  (zoomed conversation close-up, `data-beat="prompt|reply|complete"`),
  `claude-code-terminal-session`, `codex-app`, or `codex-terminal`.

Each entry's `recommendedUse` in the registry says when to reach for it.

## 2. Mount Components

`examples/quickstart-demo.html` is the simplest tracked example. It mounts
components with:

```html
<div
  class="component-frame claude-component"
  data-backlot-mount-src="../compositions/claude-composed-app.html"
  data-backlot-mount-selector="#claude-composed-app"
></div>
```

The selector should come from `surfaces/registry.json` under
`surface.import.selector`.

Installing blocks from the published registry instead (`npx hyperframes add`)?
The snippet each `add` prints uses `data-composition-src` and omits
`data-composition-id` — add a unique `data-composition-id` to every pasted
host `<div>` yourself, or `hyperframes lint` fails with
`host_missing_composition_id`.

Include the component loader **after** the mount `<div>`s, not in `<head>` —
the loader runs immediately on parse and only finds `[data-backlot-mount-src]`
elements already in the DOM:

```html
<script src="../runtime/backlot-component-loader.js"></script>
```

### Applying Page And Beat Variants

`claude-composed-app` (`data-page="home|chat|cowork|code"`, `data-sidebar`,
`data-rail`) and `claude-cinematic` (`data-beat="prompt|reply|complete"`) read
their variant from a `data-*` attribute on their own composition root, with a
baked-in default (`home` / `reply`). Two ways to set it, verified against the
published registry install path:

**Query string — direct-preview only.** Each of those compositions also reads
`?page=`/`?beat=` from `window.location.search` on load and copies it onto its
own root attribute. This only fires when you load the composition's own URL
directly (what capture scripts do, e.g.
`compositions/claude-composed-app.html?page=chat`). It does **not** work
appended to a `data-composition-src` value
(`data-composition-src="compositions/claude-composed-app.html?page=chat"`) —
`hyperframes check`/`render` resolve that whole string, query included, as a
literal file path and fail with "the file does not exist". It also has no
effect through `data-backlot-mount-src`, because the component loader strips
`<script>` tags from whatever it fetches before mounting, so the
composition's own query-reading script never runs.

**`data-backlot-mount-src` + set the attribute after mount — works for
registry consumers.** Mount with the component loader (installed automatically
by `npx hyperframes add`) instead of `data-composition-src`, then set the
variant attribute on the mounted element once `window.__backlotComponentsReady`
resolves:

```html
<div
  id="app-host"
  data-backlot-mount-src="compositions/claude-composed-app.html"
  data-backlot-mount-selector="#claude-composed-app"
></div>

<script src="runtime/backlot-component-loader.js"></script>
<script>
  (window.__backlotComponentsReady || Promise.resolve()).then(() => {
    const app = document.querySelector("#app-host #claude-composed-app");
    if (app) app.setAttribute("data-page", "chat");
  });
</script>
```

For a scene where the page should change mid-timeline rather than at load,
set it through GSAP instead of a plain `setAttribute` so it lands on the
timeline (see `examples/claude-chat-interaction.html`, which flips
`data-page` from `"home"` to `"chat"` partway through with
`tl.set(app, { attr: { "data-page": "chat" } }, atSeconds)`).

## 3. Animate Deterministically

Register a paused GSAP timeline:

```html
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  tl.from(".claude-component", { opacity: 0, y: 24, duration: 0.6 }, 0.2);
  window.__timelines["quickstart-demo"] = tl;
</script>
```

Keep cursor moves, click rings, typing, and surface motion deterministic. Do
not use random values or live app state in renderable compositions.

## 4. Capture And Render

For the starter:

```bash
npm run capture:quickstart-demo
npm run example:quickstart:render
```

For an existing component, use the capture script listed in `docs/catalog.md`
or `surfaces/registry.json`.

Static blocks (no animation of their own) should carry `data-no-timeline` on
their host `<div>` so the renderer does not wait for a timeline that never
registers. The general rule: ANY installed block whose `compositions/*.html`
never assigns `window.__timelines[id] = ...` will stall ~45s per host with a
"Sub-composition timelines not registered" warning unless flagged — check the
block's HTML for a `__timelines` assignment before assuming it animates
(`excel-workbook` and `mac-menu-bar` are known static blocks). The render
still completes correctly via screenshot fallback, so a stall you do hit is
slow, not broken.

## 5. Verify

Before sharing a reusable demo workflow:

```bash
npm run registry:check
npm run hf:lint
npm run hf:validate
npm run hf:inspect
git diff --check
```

Use `npm run open-source:check` for the standard source/catalog/HyperFrames
gate. Add at least one relevant capture command and one draft render command
for visual proof.

Expect `hyperframes validate` to emit WCAG AA contrast *warnings* on stock
surfaces (~75 on the menu-bar + Excel + Claude trio) — they come from the
recreated apps' real color choices, are known, and are non-blocking. Only
`error`-level findings mean something is wrong.

Capture PNGs are generated artifacts and are not committed. Use
`npm run registry:check` for fresh-clone metadata validation, and use
`npm run registry:check:captures` only after you have regenerated the local
capture inventory and want every registered PNG to be present.
