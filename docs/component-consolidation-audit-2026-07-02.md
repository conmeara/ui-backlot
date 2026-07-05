# Component Consolidation Audit — 2026-07-02

Audit of the surface inventory: what exists, where the duplication is, how the
Hyperframe/registry system is designed to work, and a consolidation plan toward
one canonical, customizable Claude app.

## Current inventory

- 65 registry entries across 50 HTML files ([surfaces/registry.json](../surfaces/registry.json)).
- **27 of those entries are Claude-app variants** (22 base + 5 dark).
- 17 workflow assemblies (Claude + Excel/Word/Browser/Finder/Figma/Premiere/etc.).
- 1 orphan file not in the registry: `surfaces/browser-app-surface.html`
  (superseded by `compositions/browser-app.html`).

## Finding 1 — four generations of "the Claude app" coexist

| Shell | File | Lines | Status |
| --- | --- | --- | --- |
| `claude-app` | `compositions/claude-app.html` | 2,179 | Monolithic cowork thread. **Still what most workflows mount** (excel, word, figma, premiere, presentation, finder, codex-terminal). |
| `claude-desktop` | `compositions/claude-desktop.html` | 1,900 | Pass-100 "unified" shell (chat/cowork/code pages). Highest visual fidelity, but internally it is three stacked mockups with separate class namespaces (`cd-*`, `cw-*`) — the sidebar is duplicated *inside* the file. |
| `claude-chat-shell` | `compositions/claude-chat-shell.html` | 835 | Older lean chat shell, own sidebar rewrite. |
| `claude-composed-app` | `compositions/claude-composed-app.html` | 230 | The only shell built the way the architecture intends: mounts `claude-sidebar` + `claude-thread-core` + `claude-composer` + `claude-agent-rail` via `runtime/backlot-component-loader.js`. |

Plus `claude-code-desktop.html` (1,003 lines, dark code shell on a separate design system).

## Finding 2 — the sidebar exists as ~5 diverged copies

Independent hardcoded implementations with different class names and drifted
spacing/typography: `.dframe-sidebar` (claude-app), `.chat-sidebar`
(claude-chat-shell), `.claude-sidebar-panel` (claude-sidebar atom),
`.code-sidebar` (claude-code-desktop), `.cd-sidebar`/`.cw-sidebar`
(claude-desktop pages). This is exactly why the sidebar "looks good in some and
bad in others" — there is no single source of truth.

## Finding 3 — cross-cutting duplication (~3.5–4.7K wasted LOC)

- **SVG icon symbols** re-inlined in every file (~18 copies of the same
  Lucide/`#si-claude` set; ~2.7–3.6K LOC).
- **Color palette** re-declared per file under *different variable names*
  (`--bg-000/--brand-000/--text-100` vs `--paper/--brand/--ink`) — same hues,
  no shared source. Only font tokens are centralized
  (`styles/backlot-foundation.css`).
- Thread topbar, composer, and context pills each copy-pasted across 3–5 files.

## Finding 4 — customization hooks exist but are inert

The system's intended parameterization (per docs + tooling):

- **Composition** via `data-backlot-mount-src` / `data-backlot-mount-selector`
  (component loader).
- **Theme** via `.theme-dark` root class (`--root-class` flag in
  `tools/capture-web-ui.mjs`).
- **Scene beats** via `?capture=<mode>` query params seeking GSAP timelines.
- **Context** via data attributes (`data-active-app` etc.).

But: no shell has a working sidebar on/off toggle, no chat/cowork/code mode
switch is functional, and fullscreen-thread is only achievable by picking a
different file. Variants are pre-baked files instead of parameterized states.

## How Hyperframe wants this to work

Hyperframes (HeyGen) renders deterministic HTML/CSS/GSAP compositions to video.
This repo's registry is the discovery layer: each entry declares
`import.src`/`import.selector` for mounting, `capture.script` for visual proof,
`dependencies`, `tags`, and `recommendedUse`. Validation gates:
`npm run registry:check`, `hf:lint`, `hf:validate`, per-surface
`capture:*` scripts, `catalog:generate`.

The design philosophy (AGENTS.md, PRIMITIVES.md) is thin atoms → composed
shells → workflow assemblies. `claude-composed-app` +
`claude-browser-composed-workflow` prove the pattern works end-to-end; the
monolithic shells predate it.

## Consolidation plan

Target: **one canonical Claude app shell**, built from atoms, parameterized by
mode/toggles, with the launch-style cinematic surfaces kept as a separate
intentional family.

### Target Claude inventory (22 base variants → ~12)

- **Atoms (single source of truth):** `claude-sidebar`, `claude-thread-core`,
  `claude-composer`, `claude-agent-rail`, `claude-response-mark`.
- **One shell:** `claude-app` (rebuilt on the composed pattern). Parameters:
  - `?page=chat|cowork|code` (mode switch, replaces claude-desktop's 3 stacked pages,
    claude-app, claude-code-desktop)
  - `data-sidebar="on|off"` and `data-rail="on|off"` toggles
  - `?capture=` beats for scene states (home, attachment-draft, working, tool-result)
  - `.theme-dark` for dark
  - Registry keeps one entry per captured view (chat/cowork/code × light/dark),
    all pointing at the one file — same pattern claude-desktop uses today.
- **One pane:** `claude-chat-pane` (topbar + thread + composer, no sidebar) for
  layering over app surfaces; fold `claude-deck-chat-pane` in via tokens.
- **Launch/cinematic family (keep, fullscreen-thread use case):**
  `claude-home`, `claude-prompt-stack`, `claude-cinematic-reply`, one
  completion surface (merge `claude-completion-response` +
  `claude-launch-completion`; fold `claude-home-launch` into
  `claude-prompt-stack`, `claude-conversation` into `claude-cinematic-reply`).

### Deprecate / delete

`claude-app.html` (old monolith), `claude-desktop.html` (fidelity folded into
atoms first), `claude-chat-shell.html`, `claude-code-desktop.html` (becomes
code page), `claude-composed-app.html` (becomes the new claude-app),
`surfaces/claude-mac-finder.html` (legacy lab), orphan
`surfaces/browser-app-surface.html`. Mark `status: "deprecated"` in the
registry first; delete after workflow recaptures pass.

### Phases

1. **Foundation dedupe.** Shared icon sprite (loader-injected or build step);
   unify color tokens under one naming scheme in `backlot-foundation.css`.
2. **Crown the best atoms.** Visual bake-off using existing `captures/*/target.png`
   (or `npm run inventory:generate` contact sheet): pick the winning sidebar /
   thread / composer per element, fold pass-100 `claude-desktop` fidelity into
   the atom files. Atoms become the only place sidebar markup lives.
3. **Build the canonical shell** on the composed-app pattern with the
   parameters above; wire capture scripts + registry entries.
4. **Migrate the 17 workflows** to mount the new shell/pane; recapture each.
5. **Registry & docs cleanup.** Deprecate → delete legacy shells, prune
   overlapping launch surfaces, `registry:check` + `hf:lint`/`hf:validate` +
   `catalog:generate`, update AGENTS.md defaults.

## All-family scope (added after review — directive: every app, not just Claude)

The same "one canonical surface per app, variants are parameters" rule applies
repo-wide. Non-Claude families are already close; remaining cleanups:

| Family | Action |
| --- | --- |
| Browser | Delete orphan `surfaces/browser-app-surface.html` (superseded by `compositions/browser-app.html`). |
| Figma | Merge `figma-onboarding-editor` into `figma-editor` as a page/state (like claude-desktop pages). |
| Calendar | Move `surfaces/calendar-app-surface.html` into `compositions/` for consistency; registry update. |
| Finder / menu bar / office / premiere / codex | Already one file per app with `.theme-dark` variants — adopt shared icon sync + namespaced tokens (`--macos-*`, `--office-*`, …) as they get touched. |
| Legacy labs | Deprecate `surfaces/claude-mac-finder.html`. |

## Maintenance model (keeping surfaces current as real apps update)

One canonical surface per app makes an app update a single-point change:

1. **Recapture the live app** into `captures/live-refs/` (existing convention).
2. **Run a fidelity pass** (`/fidelity-push` skill) against the one canonical
   file for that family — atoms first for Claude.
3. **Recapture + registry gates**: `npm run capture:<id>`,
   `icons:check`, `registry:check`, `hf:lint`, `hf:validate`,
   `catalog:generate`.
4. Registry `fidelity` + `sourceEvidence` fields record what the surface was
   verified against; bump them in the same commit.

Tooling added in phase 1 to support this: `tools/sync-inline-icons.mjs` with
`npm run icons:check` / `icons:sync` (inline symbols stay self-contained per
file for file:// capture safety, but are generated from
`assets/icons/source-authentic/` so they can no longer drift), and namespaced
`--claude-*` canonical tokens in `styles/backlot-foundation.css` (light +
`.theme-dark`), measured from the pass-100 shell.

### Open decision

Which sidebar/thread visually wins is a judgment call — the contact sheet in
phase 2 is the decision artifact. Default recommendation: `claude-desktop`'s
pass-100 visuals (verified against live app) poured into the
`claude-sidebar`/`claude-thread-core` atom files.
