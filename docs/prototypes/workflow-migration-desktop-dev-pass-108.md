# Workflow Migration — Desktop/Dev Cohort — Pass 108

Phase 4 of the consolidation plan
([component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md)):
migrates the remaining desktop/dev workflow compositions off the legacy
`claude-app.html` monolith onto the canonical `claude-composed-app.html` shell
([pass-106](claude-canonical-shell-pass-106.md)). Cohort: `claude-finder-workflow`
(serves registry ids `claude-finder-workflow` + `claude-finder-thread-workflow`),
`claude-codex-terminal-workflow`, `claude-browser-workflow` (serves
`claude-browser-workflow` + `claude-browser-thread-workflow`). This continues
the office/creative cohort ([pass-107](workflow-migration-office-creative-pass-107.md)).

No separate `claude-browser-thread-workflow.html` file exists — confirmed via
`surfaces/registry.json`: both the `claude-browser-workflow` and
`claude-browser-thread-workflow` registry entries point their `import.src` at
`compositions/claude-browser-workflow.html` (different `capture.script`/
`?capture=` beat each). Only `claude-browser-workflow.html` was edited.

## Mount swap (identical shape across all three files)

Every file's Claude-app mount changed from:

```html
data-primitive="claude-app-window"
data-backlot-mount-src="./claude-app.html"
data-backlot-mount-selector="#claude-app-surface"
```

to:

```html
data-primitive="claude-composed-app"
data-backlot-mount-src="./claude-composed-app.html"
data-backlot-mount-selector="#claude-composed-app"
```

`claude-finder-workflow.html` and `claude-browser-workflow.html` each mount a
second Claude surface (`claude-attachment-draft.html`, on
`.claude-attachment-component` / `.claude-draft-component`) — left completely
untouched, per instructions. Only the `.claude-thread-component` mount (the
one pointed at `claude-app.html`) was swapped in both files. The
`mac-menu-bar` / `finder-window` / `browser-app` / `codex-terminal` mounts
were also left untouched.

## Toggle choices (identical across all three)

All three files' pre-migration captures showed the old `claude-app.html`
window uncropped: sidebar column, working thread, and the right-hand
Progress/Artifacts/Context rail all fit inside the mounted window. That maps
directly to the shell's own defaults:

- `data-page="cowork"` (default)
- `data-sidebar="on"` (default) — old crop never cropped the sidebar out
- `data-rail="on"` (default for cowork) — old crop always showed the
  right-hand context panel

Each file sets these explicitly and deterministically inside its own
`window.__backlotComponentsReady.then(...)` callback (added right after the
existing `<script src="../runtime/backlot-component-loader.js">` tag, before
the GSAP timeline definition), scoped to the specific mount:

```js
if (window.__backlotComponentsReady) {
  window.__backlotComponentsReady.then(() => {
    const shellRoot = document.querySelector(".claude-thread-component #claude-composed-app");
    if (shellRoot) {
      shellRoot.setAttribute("data-page", "cowork");
      shellRoot.setAttribute("data-sidebar", "on");
      shellRoot.setAttribute("data-rail", "on");
    }
  }).catch(() => {});
}
```

(`.claude-component` is the mount class in `claude-codex-terminal-workflow.html`
instead of `.claude-thread-component`.) None of these three files had a prior
copy-swap callback to fold into, unlike some of the pass-107 cohort.

## Framing retune

All three files' Claude frame previously matched `claude-app-surface`'s native
1180x780 render size exactly (`width: 1180px; height: 780px`), with the
frame's own `scale` doing the only shrinking (0.78 finder, 0.72 codex-terminal,
0.8 browser) — i.e. the mounted content filled the frame 1:1 before any scale.

`claude-composed-app` is a fixed 1440x900 shell, a different aspect ratio
(1.6 vs 1180x780's 1.513), so a straight swap would overflow the frame's
`overflow:hidden` box unevenly. Instead of changing the frame's own
width/height/position (which pass-107 did, accepting a slightly larger
footprint), this cohort added a **scale-to-fit-height transform on the
mounted node itself**, keeping every frame's `left`/`top`/`width`/`height`
identical to pre-migration:

```css
.claude-thread-component > [data-backlot-mounted-component] {
  width: 1440px;
  height: 900px;
  transform: scale(0.8667); /* 780/900 */
  transform-origin: top left;
}
```

`0.8667 = 780/900` scales the shell to exactly fill the frame's 780px height;
the resulting 1248px width (1440 × 0.8667) overflows the 1180px frame width by
34px on each side on average, cropped by the frame's existing
`overflow: hidden` — the same left/right cropping behavior the old `scale`
already produced at the frame level, just now applied one level deeper. This
keeps the window's on-stage position, size, and the outer frame's own `scale`
(which still applies the overall per-file stage shrink: 0.78/0.72/0.8)
unchanged from pre-migration in all three files.

`claude-browser-workflow.html`'s inner-scale rule is scoped to
`.claude-thread-component > [data-backlot-mounted-component]` only — the
sibling `.claude-draft-component` (claude-attachment-draft, untouched) is
unaffected by the new selector.

No cursor/click-ring/drag-chip coordinate changes were needed in any file —
verified visually against pre-migration captures (see below); all cursor
paths target the Finder/Terminal/Browser surfaces or transitions between the
two Claude mounts, not fixed points inside the Claude window's own content.

## Per-registry-id summary

| Registry id | File | Mount swap | Toggles | Capture beat verified | Framing delta |
| --- | --- | --- | --- | --- | --- |
| `claude-finder-workflow` | `claude-finder-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y (`?capture=hero`, unchanged beat name) | Frame position/size unchanged; inner shell scaled 0.8667 to fill the 780px frame height, ~34px cropped off each side vs the shell's own uncropped width. `hero` beat actually shows the untouched `claude-attachment-draft` mount (attachment-draft is visible before the thread cross-fade), so this beat's pixel diff vs pre-migration is small (~3.4%, mostly cursor/antialiasing) — confirms the untouched mount stayed untouched. |
| `claude-finder-thread-workflow` | `claude-finder-workflow.html` | (same file/mount as above) | (same) | y (`?capture=thread`, unchanged beat name) | Same framing delta as above. This beat shows the swapped `.claude-thread-component`, so the diff (~10.4%) reflects the real shell-chrome change: new sidebar/task-list/rail treatment, cowork topbar title "Review unpublished drafts for publication", pass-102/103/105 atom type. Diff bbox (668,146)-(1589,755) stays fully inside the Claude window — Finder and menu bar are pixel-identical to pre-migration. |
| `claude-codex-terminal-workflow` | `claude-codex-terminal-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y (`?capture=hero`, unchanged beat name — this file only has one beat) | Frame position/size unchanged; same 0.8667 inner scale. Diff bbox (76,174)-(926,736) fully inside the Claude window; Codex terminal and menu bar pixel-identical to pre-migration. |
| `claude-browser-workflow` | `claude-browser-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y (`?capture=hero`, unchanged beat name) | Frame position/size unchanged; same 0.8667 inner scale, scoped to `.claude-thread-component` only (sibling `.claude-draft-component` mounting `claude-attachment-draft.html` is untouched and uses default/unscaled sizing). Diff bbox (132,170)-(1076,794) fully inside the Claude window; browser and menu bar pixel-identical to pre-migration. |
| `claude-browser-thread-workflow` | `claude-browser-workflow.html` (no separate file — confirmed via registry, both ids share this source) | (same file/mount as above) | (same) | y (`?capture=thread`, unchanged beat name) | Same framing delta as `claude-browser-workflow`. Diff bbox identical (132,170)-(1076,794) — same frame, different timeline seek point (post cross-fade to the thread mount). |

All five capture beats (`hero`/`thread` × finder and browser, plus codex
terminal's single `hero`) still exist verbatim in the new shell — no beat
name needed to change or get remapped to a nearest equivalent. The shell swap
only affects what's mounted inside the existing `.claude-thread-component` /
`.claude-component` timeline target; none of the beat/seek logic in any of
the three files' `<script>` blocks needed to change.

## Verification method

For each of the five registry ids: copied `captures/surface-<id>/target.png`
to `captures/review/<id>-pre-migration.png` before editing, then re-ran each
file's existing `npm run capture:<id>` script (`.workflow-stage` selector,
1960x1120 viewport) and read old vs new `target.png` side by side, plus a
Pillow pixel-diff bbox/count check confined to the Claude window region in
every case (3.4%–10.4% changed pixels, all inside the expected window bbox,
zero bleed into sibling surfaces). Crops of just the Claude-window region
were also compared directly (old vs new) to confirm sidebar/thread/rail
column widths and positions read at equivalent scale to the pre-migration
crop.

## Content note (inherited, not introduced by this pass)

Same inherited deviation pass-106 and pass-107 already documented: the new
shell's cowork thread is the atom's canonical launch-deck/blog-drafts scene,
not `claude-app.html`'s original copy. In this cohort the two literally
happen to share very similar demo text ("Editing Deck.pptx" / "Q2 revenue.csv"
/ "Oh and update the revenue chart..." bubble), which made an early visual
read of the new `thread` beat capture look deceptively unchanged from
pre-migration at a glance — the pixel diff and DOM inspection (`#claude-composed-app`
present under the mount, `data-page="cowork"` set) confirm it is genuinely the
new shell rendering its own canonical scene copy, not stale/cached old
content; the chrome around it (sidebar, task list, cowork topbar title, rail
card layout, reply composer with model picker) is entirely the new shell's.
None of these three files had a pre-existing per-workflow copy-swap script
(unlike Word/Excel/Premiere in pass-107), so there was nothing to fold in or
leave as a no-op.

## Gates run

- `node tools/sync-inline-icons.mjs --check compositions/claude-finder-workflow.html compositions/claude-codex-terminal-workflow.html compositions/claude-browser-workflow.html` → "No drift: all matched inline symbols match their canonical sources."
- `npm run registry:check` → "Surface registry OK: 65 surfaces, 46 components, 17 workflows, 65 ready captures."

## Not touched

`surfaces/registry.json`, `package.json`, `docs/catalog.md`, the four atom
files (`claude-sidebar.html`, `claude-thread-core.html`,
`claude-composer.html`, `claude-agent-rail.html`), `claude-composed-app.html`,
`claude-desktop.html`, legacy shells (`claude-app.html`,
`claude-chat-shell.html`, `claude-code-desktop.html`), and the non-Claude app
surfaces (`finder-window.html`, `browser-app.html`, `codex-terminal.html`,
`mac-menu-bar.html`, `claude-attachment-draft.html`). Changes were not
committed, per instructions.

## Workflows this pass could not migrate

None — all three files (covering five registry ids) migrated cleanly with no
blockers. `claude-browser-thread-workflow.html` was confirmed not to exist as
a separate file, so there was nothing to migrate there beyond the shared
`claude-browser-workflow.html` edit already covering that registry id.
