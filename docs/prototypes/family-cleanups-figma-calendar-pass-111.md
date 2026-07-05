# Family Cleanups — Figma + Calendar — Pass 111

Two structural cleanups from the "All-family scope" section of
[component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md):
merges `figma-onboarding-editor` into `figma-editor` as a `data-page` variant
(the claude-sidebar pass-102 pattern), and moves the calendar surface into
`compositions/` for consistency with the rest of the app-shell family. Both
are non-Claude families; no Claude compositions, atoms, or workflows were
touched beyond the one required mount swap.

## Task 1 — figma-onboarding-editor merged into figma-editor

`compositions/figma-editor.html` is now the single canonical Figma surface
with two pages, gated by a pure CSS attribute selector on the root
(`#figma-editor-surface[data-page="editor" | "onboarding"]`, default
`editor`) — the same mechanism `claude-sidebar.html` uses for its
chat/cowork/code pages (pass-102).

### What changed in figma-editor.html

- Root `#figma-editor-surface` gained `data-page="editor"` (default).
- The existing light/dark "Design handoff" editor markup was wrapped in
  `<section class="figma-window figma-page-editor">` (unchanged content).
- The full onboarding markup (topbar, dark sidebar, canvas with Welcome/Sign
  Up phone frames, dark properties panel, floating toolbar) was ported in
  verbatim as a sibling `<section class="figma-onboarding-window
  figma-page-onboarding">`, inside the same template.
- The onboarding page's duplicate inline `<svg>` icon-symbol block was
  dropped — all 8 symbols it used (`lucide-move-tool`, `-frame`, `-shape`,
  `-pen-tool`, `-type-tool`, `-comment`, `-wand`, `-chevron-down`) are
  byte-identical to the editor page's own symbol defs (diffed via a small
  Python script before removing), so both pages share the one sprite already
  in the document.
- All of the onboarding page's CSS (originally scoped loosely by the
  `#figma-onboarding-editor-surface` id plus many bare class selectors) was
  re-scoped so nothing leaks into the editor page: every bare selector was
  rewritten with a `.figma-page-onboarding` ancestor prefix (programmatic
  transform, then spot-checked), and the two `#figma-onboarding-editor-surface`
  variable/base blocks became `.figma-page-onboarding` /
  `.figma-page-onboarding.figma-onboarding-window` respectively. 41 class
  names actually collide between the two former files (`frame-label`,
  `right-avatar`, `right-play`, `right-share`, `selected-frame`,
  `tool-group`, `tool-chevron`, `tool-separator`, `figma-mark`, the resize/
  drag-handle direction classes, etc.) — unscoped merging would have caused
  silent cross-page style bleed; this is why every onboarding rule needed the
  prefix rather than a straight concatenation.
- Root-level page switching rules were added right after the shared
  `box-sizing` reset:
  ```css
  #figma-editor-surface:not([data-page="onboarding"]) .figma-page-onboarding { display: none; }
  #figma-editor-surface[data-page="onboarding"] .figma-page-editor { display: none; }
  #figma-editor-surface[data-page="onboarding"] .figma-page-onboarding { display: block; }
  #figma-editor-surface[data-page="onboarding"] { width: 1120px; height: 760px; }
  ```
  The `:not([data-page="onboarding"])` form (id + class, specificity 1-1-0)
  is deliberate — the ported `.figma-page-onboarding.figma-onboarding-window`
  rule (two classes, specificity 0-2-0) also sets `display: block`
  unconditionally, so a plain `.figma-page-onboarding { display: none }`
  default (0-1-0) loses that specificity fight and the onboarding section
  stays visible under the editor page too. This was caught by an initial
  registry-check-clean but visually-wrong capture (editor page's own diff
  went from 0% to ~5.8%, confined to the bottom edge, because the hidden
  onboarding section was still taking up `body` layout height and shifting
  the centered stage) — fixed by bumping specificity, not by reordering.
  The root width/height override matters for the same reason
  `figma-onboarding-editor.html` sized its whole document at 1120×760: the
  merged root is otherwise permanently 1440×900 (the editor page's native
  size), which left the direct-preview `body { place-items: center }` box
  centering a too-tall box and clipping ~20px off the top of the onboarding
  capture until this was added.
- Direct-preview mount script gained the same `?page=` convenience mapping
  claude-sidebar.html uses (`URLSearchParams(...).get("page")` sets
  `data-page` on the mounted root after cloning the template) — capture-time
  only, no runtime JS needed for the page switch itself.
- No separate GSAP timeline exists for the onboarding page (matches the old
  file, which registered `window.__timelines["figma-onboarding-editor-surface"]
  = null`); the editor page's existing timeline and
  `window.__timelines["figma-editor-surface"]` key are untouched.

### Mount contract — claude-code-figma-workflow.html

`compositions/claude-code-figma-workflow.html` mounted the old file directly
(`data-backlot-mount-src="./figma-onboarding-editor.html"`,
`data-backlot-mount-selector="#figma-onboarding-editor-surface"`). Per the
workflow-migration-desktop-dev-pass-108 technique (post-mount attribute via
`window.__backlotComponentsReady`, since `backlot-component-loader.js` fetches
`data-backlot-mount-src` verbatim with no query string, so a `?page=` URL
trick doesn't reach a fetch-mounted component):

- Mount swapped to `data-backlot-mount-src="./figma-editor.html"` /
  `data-backlot-mount-selector="#figma-editor-surface"`.
- A new script block, right after the `backlot-component-loader.js` tag and
  before the timeline definition, sets the page post-mount:
  ```js
  if (window.__backlotComponentsReady) {
    window.__backlotComponentsReady.then(() => {
      const figmaRoot = document.querySelector(".figma-onboarding-component #figma-editor-surface");
      if (figmaRoot) figmaRoot.setAttribute("data-page", "onboarding");
    }).catch(() => {});
  }
  ```
  Scoped to `.figma-onboarding-component` (the existing mount wrapper) so it
  can't affect any other Figma mount. Until the promise resolves, the CSS
  default (`data-page="editor"` absent → editor page hidden... no — absent
  attribute means the `:not([data-page="onboarding"])` rule matches, so the
  editor page is briefly what's in the DOM) is the same "shows the editor
  chrome for one frame before swapping" fallback pass-108 relies on for its
  shell mounts; the GSAP timeline's own fade-in (`.figma-onboarding-component`
  opacity/x/y/blur tween starting at 0.18s) already covers this in practice.
- The `claude-code-terminal-component` mount, dot-field background, cursor/
  click-ring choreography, and all timeline seek points were left untouched.

### Registry

`figma-onboarding-editor`'s id is unchanged (kept stable — `claude-code-figma
-workflow`'s registry entry lists it in `dependencies`). Its entry now points
`source` / `import.src` at `compositions/figma-editor.html` with
`import.selector: "#figma-editor-surface"` (the single mount point, matching
what a workflow needs), while `capture.selector` stays
`.figma-onboarding-window` (the page-specific crop region) — mirroring how
`figma-editor`'s own entry already has a different `import.selector`
(`#figma-editor-surface`) vs `capture.selector` (`.figma-window`). This
follows the claude-sidebar/claude-composed-app `data-page` convention rather
than claude-desktop's older one-`#id`-per-page pattern (claude-desktop mounts
three separate top-level `<div id="claude-desktop-chat">` etc. sections, which
doesn't apply here since figma-editor has one root gated by an attribute).
`prototypeNote` was repointed at this document; `sourceEvidence` keeps the
original video/frame-study references plus the two prototype notes
(`figma-onboarding-editor-pass-076.md`, `claude-sidebar-atom-consolidation-
pass-102.md` for the pattern this pass followed). The `claude-code-figma-
workflow` registry entry's own `sourceEvidence` had one stale path
(`compositions/figma-onboarding-editor.html`) updated to
`compositions/figma-editor.html`; its `dependencies` array already correctly
referenced the `figma-onboarding-editor` *id*, which didn't need to change.

`package.json`'s `capture:figma-onboarding-editor` script now points at
`file://$PWD/compositions/figma-editor.html?page=onboarding` (matching the
existing `capture:claude-composed-app-chat`-style `?page=` query convention
already used elsewhere in the file) instead of the old standalone file.

`compositions/figma-onboarding-editor.html` was deleted (`git rm`).

### Verification

Pre-merge captures were copied aside first
(`captures/review/{figma-editor,figma-editor-dark,figma-onboarding-editor,
claude-code-figma-workflow}-pre-merge.png`). After the fix described above:

| Capture | Diff vs pre-merge |
| --- | --- |
| `capture:figma-editor` (light, default page) | 0.0000% — pixel-identical |
| `capture:figma-editor-dark` | 0.0000% — pixel-identical |
| `capture:figma-onboarding-editor` (now `?page=onboarding`) | 1.27% (10,813 / 851,200 px), bbox covers the full frame but the amplified diff image shows it's confined to sub-pixel text-glyph antialiasing ghosting on a handful of labels (e.g. "Layers/Assets", "Search layers", "Full name" field values, "Get Started"/"Create Account" buttons) — no layout, color-block, or missing-element differences. Only 6,058 px exceed a near-imperceptible magnitude-30 threshold. |
| `capture:claude-code-figma-workflow` (`?capture=hero`) | 0.51% (10,567 / 2,073,600 px), bbox `(127,243)-(1102,732)` — fully inside the Figma onboarding window region; the Codex/Claude terminal pane and macOS menu bar are pixel-identical to pre-migration. Same antialiasing-only character as the direct onboarding capture. |

The first capture attempt (before the specificity fix) showed the onboarding
section bleeding into the default editor page — caught because the editor
page's own diff was nonzero (~5.8%) when it should never change. Re-running
all four captures after the fix restored the editor page to exact pixel
parity and left the two onboarding-page captures at only the residual
text-antialiasing level documented above.

## Task 2 — calendar surface moved into compositions/

`git mv surfaces/calendar-app-surface.html compositions/calendar-app.html`.
`surfaces/` and `compositions/` are siblings at the same repo depth, so the
file's existing `../styles/backlot-foundation.css` import and
`../assets/app-icons/*.svg` / `../assets/cursors/*.svg` custom-property URLs
resolve identically post-move — verified by exact-pixel-match captures, no
path edits were needed inside the file.

Registry (`calendar-app`, `calendar-app-dark` entries): `source` and
`import.src` repointed from `surfaces/calendar-app-surface.html` to
`compositions/calendar-app.html` (4 occurrences total across the two
entries). `package.json`'s `capture:calendar` and `capture:calendar-app-dark`
scripts repointed the same way. No other file in the repo referenced
`surfaces/calendar-app-surface.html` as a mount source (checked
`data-backlot-mount-src` usage repo-wide) — only docs and the registry itself
referenced the old path.

### Verification

Pre-move captures copied aside
(`captures/review/calendar-app{,-dark}-pre-merge.png`). Both
`capture:calendar` and `capture:calendar-app-dark` re-run clean after the
move: **0.0000% diff, pixel-identical** in both light and dark, confirming
the move was purely mechanical.

## Gates

- `npm run registry:check` → OK (registry entries validated, all
  `prototypeNote`/`import.src` paths resolve).
- `npm run catalog:generate` → regenerated `docs/catalog.md`.
- `npm run icons:check` → no drift (no inline icon symbols were edited by
  this pass beyond removing the onboarding page's now-redundant duplicate
  set, which was a byte-identical copy of symbols already vendored via
  `assets/icons/source-authentic/`).

## Not touched

Any Claude composition, atom, or workflow file other than the one required
mount-src/selector swap (plus the new post-mount script) in
`compositions/claude-code-figma-workflow.html`. `.claude/workflows/
fidelity-push.js` still has a stale `src: 'compositions/figma-onboarding-
editor.html'` entry for the `figma-onboarding-editor` id (line ~65) — left
alone per the "don't touch other workflows" instruction; worth a follow-up
so the fidelity-push skill doesn't 404 on that id.

## Changes not committed

Per instructions, nothing in this pass was committed.
