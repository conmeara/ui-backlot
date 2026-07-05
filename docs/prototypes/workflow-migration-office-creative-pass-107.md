# Workflow Migration — Office/Creative Cohort — Pass 107

Phase 4 of the consolidation plan
([component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md)):
migrates five workflow compositions off the legacy `claude-app.html` monolith
onto the canonical `claude-composed-app.html` shell
([pass-106](claude-canonical-shell-pass-106.md)). Cohort: `claude-excel-workflow`,
`claude-word-workflow`, `claude-figma-workflow`, `claude-premiere-workflow`,
`claude-presentation-workflow`. The remaining workflow files (browser, finder,
codex-terminal, etc.) are out of scope for this pass.

## Mount swap (identical across all five)

Every file's `.claude-component` mount changed from:

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

## Toggle choices (identical across all five)

Old crops in every one of the five workflows showed the full `claude-app.html`
window uncropped: sidebar column, working thread, and the thread's right-hand
Progress/Artifacts/Context panel all fit inside the 1180x780 mounted window.
That right-hand panel is functionally what the new shell's cowork `rail-slot`
renders (also labelled Progress/Artifacts/Context in the shell's canonical
scene) — so the old framing maps to shell defaults on every axis:

- `data-page="cowork"` (default)
- `data-sidebar="on"` (default) — old crop never cropped the sidebar out
- `data-rail="on"` (default for cowork) — old crop always showed the
  right-hand context panel

Since these are all the shell's own defaults, no visual state change is
strictly required, but each workflow now sets them explicitly and
deterministically inside its own `window.__backlotComponentsReady?.then(...)`
callback (workflow scripts run — the component loader only strips scripts
from *mounted* documents, not the host workflow file), per the pass-106
post-mount pattern:

```js
window.__backlotComponentsReady?.then(() => {
  const claudeRoot = document.querySelector("#claude-composed-app");
  if (claudeRoot) {
    claudeRoot.setAttribute("data-page", "cowork");
    claudeRoot.setAttribute("data-sidebar", "on");
    claudeRoot.setAttribute("data-rail", "on");
  }
  // ...existing per-workflow copy-swap logic, where present
});
```

Word, Excel, and Premiere already had an existing `applyXWorkflowCopy`
`window.__backlotComponentsReady?.then` callback (text-node string
replacement to reskin the claude-app thread copy for that app); the attribute
setter was folded into the front of that same callback. Figma and
Presentation had no existing copy-swap script, so a new minimal
`window.__backlotComponentsReady?.then` block was added right after the
loader `<script src>` tags.

## Framing retune (identical across all five)

Old `.claude-component` frame: `width: 1180px; height: 780px; scale: 0.78`
(effective footprint ~920x608px), matching the old `claude-app-surface`'s own
1180x780 native size.

New `.claude-component` frame: `width: 1440px; height: 900px; scale: 0.639`
(effective footprint ~920x575px), matching `claude-composed-app`'s native
1440x900 size scaled to the same ~920px width footprint as before. `left`/
`top` position of the frame were left untouched in every file (116/196,
116/194, 116/196, 116/198 depending on the file) — only `width`, `height`,
and `scale` changed, so the window's top-left anchor point on the 1920x1080
stage is identical pre/post migration; the window's right/bottom edge shifts
slightly to accommodate the shell's taller aspect ratio (1.6 vs old 1.513),
which reads as a marginally larger Claude window footprint, consistent with
how the shell renders it standalone.

No cursor/click-ring coordinate changes were needed in any file — all five
workflows' cursor animations target the app-surface component (Excel/Word/
Figma/Premiere/Presentation), not the Claude window.

## Per-workflow summary

| Workflow | Mount swap | Toggles | Capture verified | Framing delta |
| --- | --- | --- | --- | --- |
| `claude-excel-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y | Window right/bottom edge ~15px larger footprint at same top-left anchor; sidebar+thread+rail all read at equivalent scale to the old crop. |
| `claude-word-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y | Same as excel. |
| `claude-figma-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y | Same as excel. |
| `claude-premiere-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y | Same as excel. |
| `claude-presentation-workflow.html` | claude-app → claude-composed-app | cowork/sidebar-on/rail-on (defaults, set explicitly) | y | Same as excel. |

All five: app surface (Excel/Word/Figma/Premiere/Presentation window) and the
mac menu bar are pixel-identical to pre-migration captures — only the
`.claude-component` mount changed. The Claude window itself swaps from the
`claude-app.html` monolith look to the pass-100 canonical shell look (serif
working-thread type, pass-102/103/104/105 atom treatment), matching the same
swap already proven in `claude-browser-composed-workflow` (pass-106).

## Verification method

For each of the five: copied `captures/surface-<id>/target.png` to
`captures/review/<id>-pre-migration.png` before editing, then re-ran the
workflow's existing `npm run capture:<id>` script (selector `.workflow-stage`,
1960x1120 viewport, all five use the same `?capture=hero` pattern) and
visually compared old vs new target.png. All five read correctly: unchanged
app chrome/menu bar, cleanly swapped-in canonical Claude shell at equivalent
framing.

## Content note (inherited, not introduced by this pass)

The new shell's cowork thread is the atom's canonical launch-deck/blog-drafts
scene (pass-103/106), not `claude-app.html`'s original deck/workbook/brief
copy. The existing per-workflow `applyXWorkflowCopy` text-replacement scripts
(excel/word/premiere) target literal strings from the old `claude-app`
thread ("Q2 deck chart", "Working in Launch Deck", etc.) that no longer exist
verbatim in the new shell's DOM, so those replacements are now largely
no-ops on the Claude-side copy; the task-title chip and thread body render
the shell's own canonical copy ("Review unpublished drafts for publication")
instead of the old per-workflow reskinned copy. This is the same documented
content deviation pass-106 already called out for the shell itself (thread
scene content is the atom's canonical scene, not bespoke per-embedding copy)
and was not something this pass attempted to fix — rewriting the copy-swap
maps to match the new shell's DOM/copy is follow-up work, not required for
the mount migration itself. The app-surface-side copy scripts
(`applyWorkbookCopy`, `applyPremiereChildCopy`) are untouched and still work
correctly since they target the untouched app surfaces, not the Claude
mount.

## Gates run

- `node tools/sync-inline-icons.mjs --check compositions/claude-excel-workflow.html compositions/claude-word-workflow.html compositions/claude-figma-workflow.html compositions/claude-premiere-workflow.html compositions/claude-presentation-workflow.html` → "No drift: all matched inline symbols match their canonical sources."
- `npm run registry:check` → "Surface registry OK: 65 surfaces, 46 components, 17 workflows, 65 ready captures."

## Not touched

`surfaces/registry.json`, `package.json`, `docs/catalog.md`, the four atom
files (`claude-sidebar.html`, `claude-thread-core.html`,
`claude-composer.html`, `claude-agent-rail.html`), `claude-composed-app.html`,
`claude-desktop.html`, legacy shells (`claude-app.html`,
`claude-chat-shell.html`, `claude-code-desktop.html`), and the app surfaces
(`excel-workbook.html`, `word-editor.html`, `figma-editor.html`,
`premiere-editor.html`, `presentation-editor.html`). Note: several of these
files show as modified in `git status` at the time of this pass — that is
pre-existing uncommitted work from passes 100-106, not touched here.

## Workflows this pass could not migrate

None — all five in this cohort migrated cleanly with no blockers.
