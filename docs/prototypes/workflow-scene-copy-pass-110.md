# Workflow Scene Copy — Pass 110

Restores per-scene Claude thread content in the eight workflows that mount
the canonical shell (`compositions/claude-composed-app.html`, pass-106/107).
The old per-workflow tree-walker string-replacement scripts
(`applyExcelWorkflowCopy` etc.) targeted literal strings from the deleted
`claude-app.html` monolith and had become no-ops against the new shell's
DOM — every scene rendered the thread atom's canonical launch-deck copy,
the shell's "Review unpublished drafts for publication" topbar title, and
the rail's blog-drafts context
([pass-107 content note](workflow-migration-office-creative-pass-107.md)).

## Hook convention

Copy is now swapped through **stable, semantic hooks** instead of string
matching:

1. **`data-copy="<slot>"` attributes** on the text nodes of the two atoms
   that carry scene copy. Additive only — no class, style, or structure
   changes, proven zero-regression below.
   - `compositions/claude-thread-core.html`: `thread-title`,
     `thread-subtitle` (atom topbar, hidden inside the shell but kept in
     sync), `user-prompt`, `reply-primary`, `reply-secondary`,
     `thinking-title`, `thinking-meta`, `thinking-json`, `source-chip-1/2`,
     `tool-title`, `tool-meta`, `tool-row-1/2/3`, `tool-status-1/2/3`,
     `command-output` (hidden at working scale, hooked for completeness).
   - `compositions/claude-agent-rail.html`: `artifact-1`,
     `artifact-1-kind` (the file-icon `<b>` badge), `context-folder`,
     `context-file-1/2/3`, `context-file-1/2/3-kind`.
2. **The shell's visible cowork topbar title** is addressed through its
   existing `data-primitive` hook —
   `[data-primitive="claude-cowork-topbar"] .shell-thread-title` — so
   `claude-composed-app.html` needed no edit. Each workflow's map reuses
   its `thread-title` string for it.

Per workflow, inside the existing `window.__backlotComponentsReady` callback
(after the `data-page`/`data-sidebar`/`data-rail` setters):

```js
const applyClaudeSceneCopy = () => {
  const claudeRoot = document.querySelector(".claude-component #claude-composed-app");
  if (!claudeRoot) return;
  const sceneCopy = { "thread-title": "...", "user-prompt": "...", /* … */ };
  Object.entries(sceneCopy).forEach(([slot, text]) => {
    claudeRoot.querySelectorAll(`[data-copy="${slot}"]`).forEach((node) => {
      node.textContent = text;
    });
  });
  const shellTitle = claudeRoot.querySelector('[data-primitive="claude-cowork-topbar"] .shell-thread-title');
  if (shellTitle) shellTitle.textContent = sceneCopy["thread-title"];
};
```

Root selector is `.claude-component #claude-composed-app` except finder and
browser, whose Claude frame is `.claude-thread-component`. Hooks missing
from the mounted DOM are skipped, so the maps are declarative and inert
against future markup churn (the failure mode of the old string maps).

## Per-scene copy

All eight scenes share the shape: task title, user prompt, two serif reply
lines, thinking-card JSON + two source chips, tool card title + three rows,
rail artifact, context folder, and three working files.

| Workflow | Scene | Title / tool card | Rail artifact · folder · files |
| --- | --- | --- | --- |
| excel | Launch Metrics workbook check (ported from old map) | "Check Launch Metrics workbook" / Editing Metrics.xlsx (read folder → found Q2 revenue data → updating chart range) | XLSX Metrics.xlsx · Launch Metrics · metrics-notes.md, Q2 revenue.csv, Metrics.xlsx |
| word | Launch Brief revision (ported from old map) | "Revise Launch Brief document" / Editing Brief.docx (… → applying tracked edits) | DOCX Brief.docx · Launch Brief · launch-notes.md, Q2 revenue.csv, Brief.docx |
| premiere | Launch Cut sequence review (ported from old map; matches `applyPremiereChildCopy`'s Launch Cut program) | "Review launch video sequence" / Editing LaunchCut.prproj (… → trimming the sequence) | PROJ LaunchCut.prproj · Launch Cut · edit-notes.md, shot-list.csv, LaunchCut.prproj |
| figma | NEW — matches the mounted figma-editor file (Playground Crowdfunding Page) | "Polish crowdfunding page frames" / Editing Crowdfunding Page.fig (… → updating hero frames) | FIG Crowdfunding Page.fig · Crowdfunding Page · design-notes.md, brand-palette.json, Crowdfunding Page.fig |
| presentation | Canonical Launch Deck scene, pinned explicitly (the mounted presentation-editor IS Launch Deck.pptx) + rail/title brought onto the scene | "Update Launch Deck opening slides" / Editing Deck.pptx | PPTX Deck.pptx · Launch Deck · slide-notes.md, Q2 revenue.csv, Deck.pptx |
| codex-terminal | NEW — pairs with the Codex CLI session working on terminal-surface fidelity in ui-backlot | "Review Codex terminal captures" / Reviewing codex-terminal.html (read ui-backlot folder → found CLI reference captures → comparing transcript rows) | MD terminal-review-notes.md · ui-backlot · codex-terminal.html, cli-reference.png, capture-notes.md |
| finder | NEW map — continues the workflow's own beat (dragged "Launch Deck" Finder folder becomes the working thread), Launch Deck scene | "Update Launch Deck opening slides" / Editing Deck.pptx | PPTX Deck.pptx · Launch Deck · slide-notes.md, Q2 revenue.csv, Deck.pptx |
| browser | NEW — matches the browser-app "Launch Deck Review" board (review.local/launch-deck/board) | "Update Launch Deck review board" / Updating review board (… → found approved Q2 claims → publishing board updates) | HTML review-queue.html · Launch Deck · slide-notes.md, Q2 revenue.csv, approved-claims.md |

User prompts and reply lines follow the same voice as the canonical scene
("Oh and …" prompt, "I'll … from the selected folder." + "I'm checking …
before returning …"). The excel/word/premiere prompts are the old maps'
strings verbatim. `thinking-json` swaps the `find /sessions/<folder>` path
per scene. The app-surface-side scripts (`applyWorkbookCopy`,
`applyPremiereChildCopy`) are untouched and still work.

## Atom-edit regression proof

Capture reruns are byte-deterministic in this environment (verified by
rerunning `capture:claude-thread-core` pre-edit: byte-identical to the
existing target). After adding the `data-copy` attributes, all four atom
standalone captures were re-run and `cmp`'d against the pre-edit targets:

- `capture:claude-thread-core` — byte-identical
- `capture:claude-thread-core-dark` — byte-identical
- `capture:claude-agent-rail` — byte-identical
- `surface-claude-agent-rail-dark` (no npm script; same tool invocation
  with `--root-class theme-dark`, matching its capture.json) — byte-identical

`claude-composer.html` was not touched (the cowork composer shows only the
generic "Reply…" placeholder) and `claude-composed-app.html` was not
touched (the topbar title already had a `data-primitive` hook).

## Workflow capture verification

Re-ran and visually read every capture: `capture:claude-excel-workflow`,
`-word-`, `-premiere-`, `-figma-`, `-presentation-`,
`-codex-terminal-workflow`, `capture:claude-finder-workflow` +
`capture:claude-finder-thread-workflow`, `capture:claude-browser-workflow` +
`capture:claude-browser-thread-workflow`. In each, the thread title, user
bubble, replies, tool cards, and rail read scene-appropriate per the table
above; app surfaces, menu bar, cursor beats, and framing unchanged. The
finder/browser hero crops show the untouched claude-attachment-draft window
and are visually unchanged; their thread crops carry the new copy.

## Gates

- `node tools/sync-inline-icons.mjs --check` on both atoms and all eight
  workflows → "No drift: all matched inline symbols match their canonical
  sources."
- `npm run registry:check` → 1 pre-existing error unrelated to this pass:
  `figma-onboarding-editor: prototypeNote path does not exist:
  docs/prototypes/family-cleanups-figma-calendar-pass-111.md` — that entry
  is uncommitted pass-111 work from a concurrent session (this pass touches
  neither `surfaces/registry.json` nor that surface). No other errors.

## Not touched

`surfaces/registry.json`, `package.json`, `docs/catalog.md`,
`claude-composed-app.html`, `claude-composer.html`, `claude-sidebar.html`,
and all non-Claude app surfaces. Not committed.
