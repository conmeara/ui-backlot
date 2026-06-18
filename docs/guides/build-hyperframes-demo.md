# Build A HyperFrames Demo With UI Backlot

This guide is for agents and humans who want to assemble a demo video from the
tracked UI Backlot surfaces.

## 1. Choose The Smallest Useful Wrapper

Open `docs/catalog.md` or read `surfaces/registry.json`.

Use a `workflow` when it already matches the story:

- Claude plus browser: `claude-browser-chat-pane-workflow`
- Claude plus PowerPoint: `claude-presentation-chat-pane-workflow`
- Claude plus Finder: `claude-finder-workflow`
- Claude plus Word: `claude-word-workflow`
- Claude plus Excel: `claude-excel-workflow`
- Claude plus Figma: `claude-figma-workflow`
- Claude plus Premiere: `claude-premiere-workflow`
- Claude plus Codex terminal: `claude-codex-terminal-workflow`

Use `component` entries when the story needs a custom arrangement.

## 2. Mount Components

`examples/quickstart-demo.html` is the simplest tracked example. It mounts
components with:

```html
<div
  class="component-frame claude-component"
  data-backlot-mount-src="../compositions/claude-chat-pane.html"
  data-backlot-mount-selector="#claude-chat-pane-surface"
></div>
```

The selector should come from `surfaces/registry.json` under
`surface.import.selector`.

Include the component loader:

```html
<script src="../runtime/backlot-component-loader.js"></script>
```

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

Capture PNGs are generated artifacts and are not committed. Use
`npm run registry:check` for fresh-clone metadata validation, and use
`npm run registry:check:captures` only after you have regenerated the local
capture inventory and want every registered PNG to be present.
