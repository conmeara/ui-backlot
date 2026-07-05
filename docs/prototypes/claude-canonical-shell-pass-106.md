# Claude Canonical Shell — Pass 106

Phase 3 of the consolidation plan
([component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md)):
`compositions/claude-composed-app.html` was rebuilt from a decorative
proof-of-concept collage into the canonical, parameterized Claude desktop
shell. It assembles the four pass-102…105 atoms (`claude-sidebar`,
`claude-thread-core`, `claude-composer`, `claude-agent-rail`) via
`runtime/backlot-component-loader.js` and reproduces the window chrome and
page layouts of `compositions/claude-desktop.html` (pass-100, the visual
source of truth). It is the designated replacement for claude-desktop's three
stacked pages and — after workflow migration — the legacy
`claude-app.html` / `claude-chat-shell.html` / `claude-code-desktop.html`
shells, none of which were touched in this pass.

## Parameters (all pure CSS on `#claude-composed-app`)

- `data-page="chat" | "cowork" | "code"` — default **cowork** (the page most
  workflow scenes show). Chat renders the welcome hero + chat composer +
  starters under the chat topbar (model pill, share, more); cowork renders
  the working thread + reply composer + agent rail under the thread-title
  topbar; code renders the dark-native floating code sidebar + session dock
  (chips, pixel-crab mascot, composer, undercomposer).
- `data-sidebar="on" | "off"` — default on. Off removes the sidebar column
  (the remaining columns reflow to fill 1440x900) and floats the traffic
  lights over the main column, shifting the topbar contents right.
- `data-rail="on" | "off"` — default expressed per page in CSS: on for
  cowork, off for chat/code; the explicit attribute overrides either way.
- Direct preview accepts `?page=` / `?sidebar=` / `?rail=` (capture-time
  convenience, same pattern as the atoms' `?page=`), plus the pre-existing
  `?capture=hero` seek used by the capture scripts (the GSAP entrance uses
  `from`-tweens, which immediate-render their hidden start state at t=0).

## Page propagation into the atoms

The shell's `data-page` reaches the mounted atoms two ways, so state is
deterministic in every embedding:

1. **Post-mount script** — after `window.__backlotComponentsReady` resolves,
   the shell sets `data-page` on the mounted `#claude-sidebar-surface` (shell
   page) and on the two `#claude-composer-surface` instances (chat slot →
   chat, cowork slot → cowork), letting the atoms' own attribute selectors do
   the work. `tools/capture-web-ui.mjs` waits for the same promise, so
   captures see the settled state.
2. **CSS fallback on the slots** — when the shell is itself mounted by the
   component loader (which strips scripts, e.g.
   `claude-browser-composed-workflow`), shell rules keyed off the root
   `data-page` toggle the atoms' panel visibility directly, at one
   specificity step above the atoms' own display rules.

## Geometry: the `[data-embed="flat"]` contract

The atoms render rounded standalone panels on padded stages for their own
captures. Each atom gained a scoped **embed variant** block (additive, last
style block): when `[data-embed="flat"]` is present on an ancestor (the
shell mount slot), the stage collapses and the panel becomes a flat
full-height column, matching how claude-desktop renders the same element
in-shell. Only standalone presentation (stage padding/centering, panel
radius/shadow/fixed size) is neutralized — colors, including the dark
blocks, pass through. Standalone captures are unaffected because the
attribute never exists outside a shell.

Per-atom embed details:

- **claude-sidebar** — chat/cowork panels keep only the hairline
  border-right; the cowork panel returns to the desktop's 22px padding with
  the collapse toggle re-derived to land 114px from the column edge and the
  head row re-margined so the traffic dots sit at y=27 and the mode switch
  at y=62 (the atom's 264px standalone panel uses rescaled 16px padding);
  the code panel stays a floating 14px-radius card (the shell slot provides
  the 16px inset) minus the standalone drop shadow, and the id-scoped
  code-page stage backdrop is made transparent so the shell window paints
  the dark radial once.
- **claude-thread-core** — panel fills the slot flat; the shell additionally
  hides the atom's working topbar (the shell provides claude-desktop's
  cowork topbar), collapses the freed grid row, makes the panel transparent
  over the main column's graph paper, and restores the desktop thread
  metrics (30/40/10 padding, full-width 40px-inset measure, 30px message
  gap, 640px cards, 23px working serif — the atom's dense 21px is a
  standalone working-scale spec).
- **claude-composer** — the fixed 900x220 centered stage collapses so the
  card fills the slot (720px centered in the chat welcome, full main width
  inside the cowork dock). Two embed-scoped fidelity restorations vs the
  rendered desktop composer: the atom's own `#claude-composer-surface button
  { font: inherit }` kills its font-size icon-sizing trick (icons fell to
  16px where desktop draws 20px svgs) — restored to 20px for
  `.cd-icon-btn/.cd-send/.cw-prompt-plus/.cw-prompt-send` — and the
  atom's tokenized `--claude-text-muted` `#756f66` ink on
  `.cd-model-select`/`.cd-icon-btn` returns to desktop's `#5d5951`
  (`#b7b2a8`/`#98948a` dark).
- **claude-agent-rail** — stage collapses; the shell slot supplies the
  `.cw-rail` chrome (344px column, graph paper, border-left, 30/20/24
  padding). The embed dark card uses claude-desktop's `#2f2e2b` instead of
  the standalone token `--claude-surface` `#262624`, which would blend into
  the shell's dark column.

## Other atom edits (cross-atom collision fixes, standalone-neutral)

- The sidebar and composer atoms both used unscoped `.panel-chat` /
  `.panel-cowork` class rules; in a composed document the later-mounted
  composer's card styles repainted the sidebar panel (and vice versa for the
  cowork composer). Both atoms' light and dark panel rules are now scoped
  through their own stage class (dual `.theme-dark .stage …` /
  `.stage.theme-dark …` forms preserved).
- The thread atom's unscoped `.backlot-icon { width:100%; height:100% }`
  rule leaked into sibling atoms and shell chrome (it stretched the
  sidebar's Claude mark across the brand row); it is now scoped
  `:where(#claude-thread-core-surface) .backlot-icon`, the same
  zero-specificity pattern the sidebar and composer atoms already use.

All registered atom capture scripts (`capture:claude-sidebar`,
`capture:claude-composer`, `capture:claude-thread-core`,
`capture:claude-thread-core-dark`, `capture:claude-agent-rail`) plus the
unregistered page/theme variants (sidebar dark/cowork/cowork-dark/code,
composer dark/cowork/cowork-dark, agent-rail dark) were re-run after the
edits and pixel-diffed against pre-edit baselines: **0 differing pixels in
all 13 captures**.

## Theming

`.theme-dark` on the shell root (capture scripts: `--root-class theme-dark`
with `--selector '#claude-composed-app'`) cascades into every mounted atom —
their dark blocks already use descendant `.theme-dark …` forms, and the
loader's cloning keeps the atoms' scoped style blocks intact in document
order. Shell chrome dark rules mirror claude-desktop's dark block and are
written in dual root-class/ancestor forms; chrome decoration lives on
low-specificity base rules with the page attribute rules only toggling
`display`, so dark overrides always win. The code page is dark-native and
gets no dark variant (same as claude-desktop).

## Captures and verification

Capture scripts (package.json): `capture:claude-composed-app` (cowork,
default), `-chat`, `-code`, `-dark` (cowork dark), `-chat-dark`, all
selecting `#claude-composed-app` at 1540x980 (target = the 1440x900 window,
same framing as the claude-desktop captures).

- Side-by-side reads against
  `captures/surface-claude-desktop-{chat,cowork,code}[-dark]/target.png`:
  chat and code match near-pixel-for-pixel; cowork matches in all chrome,
  columns, and type.
- Element-rect comparison (capture.json) for the cowork page: mode switch,
  new-task row, task pill, account row, topbar title, reply prompt,
  disclaimer, and rail cards all match the claude-desktop reference
  **exactly** (same x/y/w/h).
- Pixel sampling: probe points across all five page/theme captures match
  the references exactly (sidebar/main/card/topbar/rail surfaces, light and
  dark) after the rail dark-card and cowork-topbar fixes.
- Full-image tile diffs vs the references: **chat light differs by 41
  pixels total**, all in the bottom-right corner — a reference artifact:
  claude-desktop's direct preview stacks three windows, and the adjacent
  windows' large box-shadows bleed into each capture's edges (the same
  bleed darkens the cowork reference's bottom ~25px strip and the code
  reference's top corner; the standalone shell window renders those edges
  clean). Chat dark differs by ~356 pixels, confined to the sidebar
  history/footer text — the pass-102 documented dark token substitutions
  (`#8a8578` → `--claude-text-faint` etc.). Cowork diffs outside the
  thread-scene area reduce to the same shadow-bleed strip (light) plus the
  pass-102/105 dark token substitutions in the sidebar rows and rail
  stepper (dark).
- **Rendered-reality note:** claude-desktop's `#claude-desktop-surface
  button { font: inherit }` outranks its own `.cd-model-pill` /
  `.cd-starters button` font declarations, so the human-verified pass-100
  captures render those at the inherited 16px/400. The shell's topbar pill
  and starter buttons deliberately omit font-size/weight to reproduce the
  rendered output rather than the dead CSS.
- Toggle evidence (captures/, review slugs):
  `review-composed-app-cowork-nosidebar`, `review-composed-app-cowork-norail`,
  `review-composed-app-chat-nosidebar` — columns reflow to fill the frame,
  floating traffic lights appear, topbars shift right.
- `node tools/sync-inline-icons.mjs --check` passes (shell sprite synced
  from canonical sources).

## Deliberate deviations / gaps

- **Thread scene content** is the atom's launch-deck working scene
  (pass-103), not claude-desktop's blog-drafts thread — the shell matches
  layout metrics and card treatment, not copy. The shell's cowork topbar
  title keeps claude-desktop's "Review unpublished drafts for publication"
  (matching the rail's blog-drafts context), so the thread copy is the one
  intentional content mismatch, inherited from the atom's canonical scene.
- **Card anatomy** inside the thread (chevron placement, expanded sections)
  is the atom's pass-103 treatment, which differs from claude-desktop's
  single `.cw-command-card` in structure though not in surface treatment.
- **git-branch glyph** in the code dock uses the newer canonical sprite
  geometry rather than claude-desktop's older inline copy (same documented
  deviation as pass-102).
- **`claude-browser-composed-workflow`** still crops the old collage
  geometry (offsets/scale tuned to the previous 1228x808 window) and mounts
  the shell script-less; it renders the new shell's default cowork state but
  the crop framing is stale. Migrating the 17 workflows is phase 4 —
  workflows were intentionally not touched.
- Inherits the pass-100 shell's own gap: **no sanitized live-app capture**
  of the full desktop shell exists in `captures/live-refs/`; fidelity is
  claimed against claude-desktop pass-100, not the live app directly.
- No `claude-desktop-code-dark` reference exists, so code-page dark
  (no-op) remains unverified against a reference, same as claude-desktop.
