# Workflow Migration — Chat/Browser Cohort — Pass 109

Phase 4 of the consolidation plan
([component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md)):
migrates the two chat-flavored browser workflow compositions onto the
canonical `claude-composed-app.html` shell
([pass-106](claude-canonical-shell-pass-106.md)). Cohort:
`claude-browser-chat-workflow.html`, `claude-browser-composed-workflow.html`.
No other workflow files were touched.

## `claude-browser-chat-workflow.html`

**Mount swap** — `.claude-chat-component` changed from the legacy chat shell
to the canonical shell:

```html
data-primitive="claude-composed-app"
data-backlot-mount-src="./claude-composed-app.html"
data-backlot-mount-selector="#claude-composed-app"
```

(previously `claude-chat-shell` / `./claude-chat-shell.html` /
`#claude-chat-shell-surface`).

**Toggles** — `data-page="chat"` is set post-mount inside a new
`window.__backlotComponentsReady?.then(applyChatWorkflowShellPage)` callback
(the workflow's own `<script>` survives — the component loader only strips
`<script>` tags from the *mounted* document, not the host file — so the
post-mount pattern from pass-106/107 applies here too). Sidebar and rail were
left unset: sidebar defaults **on** in the shell's own CSS (matches the old
chat-shell, which always showed its sidebar), and rail defaults **off** on
the chat page via the shell's own `:not([data-page="chat"])` rule, matching
the old chat-shell's chat-only, railless layout. No explicit
`data-sidebar`/`data-rail` attributes were needed.

**Framing** — untouched. Old `claude-chat-shell.html` and the canonical
`claude-composed-app.html` are both natively 1440x900, so the pre-existing
`.claude-chat-component` frame (`width:1080px; height:675px; scale(0.75)`,
i.e. the old 1920x1080 stage's 1080x675 crop at 0.75x) reproduces the same
window footprint and top-left anchor point unchanged. Only the mount source
changed; no crop/scale retune was required for this file.

**Capture verified**: y. `npm run capture:claude-browser-chat-workflow`
re-run; new `target.png` shows the chat welcome hero ("Let's knock something
off your list"), composer, and three starter chips under the chat topbar
(model pill, share, more), sidebar present, no rail — matching the old
chat-shell's chat-only framing exactly. Menu bar strip (0,0,1920x30) and the
unobstructed browser region are pixel-identical (`compare -metric AE` → `0`
in both) versus `captures/review/claude-browser-chat-workflow-pre-migration.png`.

## `claude-browser-composed-workflow.html`

**Mount swap** — none needed; this file already mounted
`./claude-composed-app.html` / `#claude-composed-app` before this pass.

**Toggles** — none set; already cowork-default (per the task brief, "keep
default cowork page"). No script changes made.

**Framing retune** — the pre-existing `.claude-composed-component >
[data-backlot-mounted-component]` crop (`left:-78px; top:-34px;
scale(0.74)`) was tuned to the old 230-line decorative collage's ~1228x808
effective canvas (pass-106 flagged this as stale). Retuned to:

```css
.claude-composed-component > [data-backlot-mounted-component] {
  left: 0;
  top: 15px;
  transform: scale(0.6306);
}
```

`0.6306 = 908/1440`, i.e. the frame box's own width (908px, unchanged)
divided by the shell's native width — this fits the *entire* 1440x900 shell
(sidebar + thread + rail, uncropped) into the existing 908x598 frame box
uncropped (900*0.6306 ≈ 567.5px tall, leaving ~30px slack inside the 598px
frame, split via `top:15px`). The frame box's own position/size on the
1920x1080 stage (`left:88px; top:184px; width:908px; height:598px;
border-radius:23px`) was left untouched — only the inner mounted-component
offset/scale changed, so the window's outer card position and shadow are
identical to before. This replaces the old partial/zoomed crop with a full,
uncropped view of the canonical cowork shell, which reads more legibly at
this frame size than a further-zoomed partial crop would.

**Capture verified**: y. `npm run capture:claude-browser-composed-workflow`
re-run; new `target.png` shows the full cowork shell (Chat/Code/Cowork pills,
"New task", "Review unpublished drafts for publication" thread, and the
Progress/Artifacts/Context rail) cleanly framed inside the card, matching the
standalone `captures/surface-claude-composed-app/target.png` reference
content exactly. Initial visual triage mistook this for the stale collage
because both compositions coincidentally use similar Chat/Code/Cowork
sidebar navigation and "New task" copy — a `visible-text.md` grep and a
direct crop-and-compare against the standalone composed-app reference
capture confirmed the DOM content is the rebuilt shell's own canonical
cowork scene, not collage leftovers. Menu bar strip and the unobstructed
browser region (not covered by the Claude window) are pixel-identical
(`compare -metric AE` → `0` in both) versus
`captures/review/claude-browser-composed-workflow-pre-migration.png`.

## Verification method

For both files: copied `captures/surface-<id>/target.png` to
`captures/review/<id>-pre-migration.png` before editing, then re-ran each
workflow's existing `npm run capture:<id>` script (`claude-browser-chat-workflow`
selector `.chat-browser-workflow-stage`; `claude-browser-composed-workflow`
selector `.composed-workflow-stage`; both 1960x1120 viewport,
`?capture=hero`) and read old vs new `target.png` side by side. Menu bar and
browser chrome regions were additionally diffed pixel-for-pixel with
ImageMagick `compare -metric AE` against crops excluding the Claude window,
confirming zero-pixel drift in both unrelated surfaces.

## Gates run

- `node tools/sync-inline-icons.mjs --check compositions/claude-browser-chat-workflow.html compositions/claude-browser-composed-workflow.html`
  → "No drift: all matched inline symbols match their canonical sources."
- `npm run registry:check` → "Surface registry OK: 65 surfaces, 46 components,
  17 workflows, 65 ready captures."

## Not touched

`surfaces/registry.json`, `package.json`, `docs/catalog.md`, the four atom
files (`claude-sidebar.html`, `claude-thread-core.html`,
`claude-composer.html`, `claude-agent-rail.html`), `claude-composed-app.html`,
`claude-desktop.html`, legacy shells (`claude-app.html`,
`claude-chat-shell.html`, `claude-code-desktop.html`), `browser-app.html`,
`mac-menu-bar.html`. Several of these show as modified in `git status` at the
time of this pass — that is pre-existing uncommitted work from passes
100-107, not touched here. This note was written but not committed, per
instructions.

## Content note (inherited, not introduced by this pass)

Same as pass-107: the shell's cowork thread renders the atom's canonical
launch-deck/blog-drafts scene copy ("Review unpublished drafts for
publication"), not either workflow's prior bespoke copy. Neither
`claude-browser-chat-workflow.html` nor `claude-browser-composed-workflow.html`
had a per-workflow copy-swap script targeting the Claude mount (unlike
Word/Excel/Premiere in pass-107), so there was no existing text-replacement
logic to fold a toggle-setter into or that needed reconciling against the new
DOM/copy.

## Workflows this pass could not migrate

None — both files in this cohort migrated cleanly with no blockers.
