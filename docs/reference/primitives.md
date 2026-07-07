# UI Backlot Primitives

Reusable pieces inside a composition are marked with `data-primitive`. A
primitive is the smallest editable unit an agent should target when scripting
or restyling a scene — a composer, a sidebar, a dock, a browser toolbar —
while a *surface* is the mountable composition that carries them.

## The rules

1. **Mark, don't wrap.** `data-primitive="claude-composer"` goes on the
   existing semantic element; don't add wrapper divs just to carry the
   attribute.
2. **Promote when stable.** When a primitive's boundary stops changing, move
   it into its own file under `compositions/` and mount it with
   `data-backlot-mount-src` (+ `data-backlot-mount-selector`), so every
   consumer shares one source of truth. The Claude atoms
   (`claude-sidebar`, `claude-thread-core`, `claude-composer`,
   `claude-agent-rail`) are the worked example — `claude-composed-app.html`
   and `claude-chat-pane.html` both assemble them.
3. **Variants are parameters, not files.** Dark mode is `class="theme-dark"`;
   page/beat states are attributes (`data-page`, `data-beat`, `data-sidebar`,
   `data-rail`) driven by URL params in direct preview. Never fork a file to
   change a state.
4. **Copy goes through `data-copy` slots.** Scene-specific wording is applied
   by the host composition setting `textContent` on `[data-copy="<slot>"]`
   hooks, never by string-replacing markup.
5. **Icons are never hand-drawn.** Inline `<symbol>`s are synced from
   `assets/icons/source-authentic/` via `npm run icons:check` / `icons:sync`
   (`tools/find-icon.mjs` finds new ones; verified-authentic overrides live in
   `backlot-custom-symbols.svg`).

## Where the inventory lives

This file used to hand-track every primitive and drifted badly. The
authoritative inventory is:

- [`surfaces/registry.json`](../../surfaces/registry.json) — every surface:
  source, import selector, capture script, dependencies, `recommendedUse`.
- [`docs/catalog.md`](../catalog.md) — the generated, grouped catalog.
- `data-primitive` attributes in the composition sources themselves — grep
  `data-primitive="` for the live list.

Historical design notes for individual primitives live in the dated pass
notes under [`docs/prototypes/`](../prototypes/), which registry
`prototypeNote` fields point into.
