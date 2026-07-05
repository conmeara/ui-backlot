# Claude Agent Rail Atom Consolidation — Pass 105

Second consolidation pass following the pilot recipe from
[claude-sidebar-atom-consolidation-pass-102](claude-sidebar-atom-consolidation-pass-102.md)
(phase 2 "crown the best atoms" of
[component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md)).
`compositions/claude-agent-rail.html` was rebuilt by porting the pass-100,
`claude-desktop.html` cowork page's right rail (`.cw-rail`) verbatim, replacing
the atom's earlier invented standalone rail styling.

## Source of truth check

`compositions/claude-desktop.html`'s cowork page (`#claude-desktop-cowork`)
**does** include a right-side task/context rail: `<aside class="cw-rail">`
with Progress / Artifacts / Context (Selected folders, Connectors, Working
files) cards, plus a full `.theme-dark` override block
(`#claude-desktop-cowork.theme-dark .cw-rail*`, lines ~1825-1877). This is a
real pass-100 source of truth, unlike the sidebar pilot's situation — no
fallback to "keep current structure" was needed.

Reference used: `captures/surface-claude-desktop-cowork/target.png` (light)
and `captures/surface-claude-desktop-cowork-dark/target.png` (dark) rail
region (right-hand column, Progress/Artifacts/Context cards).

**No `captures/live-refs/` capture exists** for the Cowork rail specifically —
that directory is currently empty of any cowork-rail asset. The original
agent-rail pass
([claude-agent-rail-surface-pass-065](claude-agent-rail-surface-pass-065.md))
and the cowork-rail layout pass
([claude-app-cowork-rail-fidelity-pass-044](claude-app-cowork-rail-fidelity-pass-044.md))
both note the rail was built from public layout evidence
(`https://simonwillison.net/2026/Jan/12/claude-cowork/`, used visually only,
nothing copied into the repo) and DESIGN.md constraints, not a sanitized live
screenshot — pass-044 explicitly flags "a sanitized live Claude
desktop/Cowork capture is still needed before claiming pixel-level accuracy"
as a remaining gap. That gap is still open; this pass treats pass-100
`claude-desktop.html` (the repo owner's designated source of truth) as the
best available reference rather than the live app directly.

## What was ported

- **Markup**: `.cw-rail` → `.agent-rail-panel`, `.cw-rail-card` →
  `.rail-card`, `.cw-rail-head/title/chev` → `.rail-head/title/chev`,
  `.cw-stepper/.cw-step/.cw-step-line` → `.rail-stepper/.rail-step/.rail-step-line`,
  `.cw-rail-row/.cw-rail-sub/.cw-rail-label` → `.rail-row/.rail-sub/.rail-label`,
  `.cw-file-ico` → `.rail-file-ico`. Content, card order, row copy (Progress
  stepper at 2-of-3 done, Artifacts `publish-checklist.html`, Context with
  `blog-drafts` selected folder, Web search connector, three working-file MD
  rows) all copied verbatim from the cowork page instead of the atom's
  previous invented `Deck.pptx`/`Launch Deck`/`slide-notes.md` content.
- **CSS**: every declaration under `.cw-rail*` in claude-desktop.html
  (card padding/radius/shadow, stepper circle sizing, row typography, file-icon
  badge styling) ported 1:1, including the graph-paper card background and
  the softer 17px/600 card titles (previously 22px/760 standalone titles that
  didn't match any shell).
- **Dark variant**: full port of
  `#claude-desktop-cowork.theme-dark .cw-rail*` into a scoped `.theme-dark`
  block, verified against `captures/surface-claude-desktop-cowork-dark/target.png`.
- **Icons**: `lucide-check`, `lucide-chevron-down`, `lucide-folder`,
  `lucide-globe` symbol defs copied from claude-desktop.html's inline sprite
  block (same markup) and confirmed synced via
  `node tools/sync-inline-icons.mjs --check`. The old atom's `lucide-file-text`
  symbol (Deck.pptx icon) is no longer used since the artifact row now uses
  the `HTML` text-badge style from claude-desktop, matching the cowork rail's
  Artifacts section exactly.

## Tokens

Colors now consume canonical `--claude-*` tokens from
`styles/backlot-foundation.css` wherever a token value matched the pass-100
hex: `--claude-ink`/`--claude-ink-soft` (titles/rows), `--claude-paper` (stage
background), `--claude-surface`/`--claude-surface-raised` (dark card bg, file
icon chip bg), `--claude-text-muted`/`--claude-text-faint` (dark secondary
text). Remaining hexes (`#928a80` chevron gray, `#d6d0c4`/`#b9b3a6` stepper
circle borders, `#f4efe8` connector chip bg, etc.) are kept verbatim from
claude-desktop since they don't correspond to a canonical token and are
light-mode-only decorative grays scoped inside `.rail-card`, not overridden
by dark mode token drift.

No legacy `#c65b47`/`#c85f4b` brand-accent hexes were present in the prior
atom to begin with — the rail never used the brand accent color, so no
brand-token substitution was needed here (unlike surfaces that used the old
red-orange family for active/accent states).

## Typography alignment

Font sizes/weights now match `claude-desktop.html`'s cowork rail exactly
(17px/600 card titles, 14.5px rows, 14px caption, 13.5px labels) instead of
the previous atom's larger invented standalone type scale (22px/760 titles,
16px rows) that didn't match any shell's actual rail typography.

## Mount contract (unchanged)

- Root `#claude-agent-rail-surface`, `data-composition-id="claude-agent-rail-surface"`,
  `data-width="380"` `data-height="860"` — verified against the file.
- Capture selector `.claude-agent-rail-stage` per package.json
  `capture:claude-agent-rail`.
- `claude-composed-app.html` mounts unchanged
  (`data-backlot-mount-src="./claude-agent-rail.html"`,
  `data-backlot-mount-selector="#claude-agent-rail-surface"`) — no edits made
  to that file.

## Deliberate deviations

- **Panel chrome**: claude-desktop's `.cw-rail` is a flush right column with
  a graph-paper background and a left hairline border (it's inside the
  desktop shell frame). The standalone atom keeps the existing
  `.claude-agent-rail-stage` padded stage (28px padding, centered panel) so
  the atom is legible on its own outside a shell — this matches how the
  sidebar pilot atom also keeps standalone stage padding not present in the
  in-shell version.
- **Removed the `.rail-note` "Claude is using only the selected folder..."
  footer and its `sync-pulse` GSAP animation** — claude-desktop's `.cw-rail`
  has no such element (it puts the local-sync note in the sidebar, not the
  rail). Removed rather than kept as an invented addition, per the
  consolidation directive to stop inventing controls the source of truth
  doesn't have. The GSAP timeline's pulse tween on `.sync-pulse` was removed
  accordingly; entrance/stagger tweens on the panel, stepper circles, and
  cards were kept and retargeted to the renamed classes.
- **Dark selector form**: used both `.theme-dark .rail-card` (descendant) and
  `.theme-dark.rail-card` (self) forms, matching the exact dual-selector
  pattern in `claude-sidebar.html`'s dark block — this is because
  `tools/capture-web-ui.mjs --root-class` adds the class to the capture
  selector element (`.claude-agent-rail-stage`) directly, while a
  composed-app mount could add it further up the tree.

## Verification

- `node tools/sync-inline-icons.mjs --check compositions/claude-agent-rail.html`
  → `matched: 4, replaced: 0` — no drift.
- `npm run capture:claude-agent-rail` (light) → `captures/surface-claude-agent-rail/target.png`.
  Visual inspection: Progress/Artifacts/Context cards render correctly,
  stepper at 2-of-3 done, all rows legible, matches the cowork rail region of
  `captures/surface-claude-desktop-cowork/target.png`.
- Direct dark capture (`--root-class theme-dark`, same selector/viewport) →
  `captures/surface-claude-agent-rail-dark/target.png`. Visual inspection:
  legible, matches the cowork rail region of
  `captures/surface-claude-desktop-cowork-dark/target.png` (dark card bg,
  light ink text, muted secondary text all correct).
- `npm run capture:claude-composed-app` → `captures/surface-claude-composed-app/target.png`.
  Visual inspection: rail mounts and crops into the composed shell's right
  column correctly, cards render in the scaled slot with the same content
  and hierarchy as the direct capture.
- `npm run registry:check` → `Surface registry OK: 65 surfaces, 46 components,
  17 workflows, 65 ready captures.` (unchanged count — no registry edits made,
  per instructions).

## Fidelity gaps and reasons

- **No live-app capture for the cowork rail exists in this repo.** The
  pass-100 `claude-desktop.html` rail itself was built from public layout
  evidence (a blog post description of Claude Cowork's UI) plus local design
  constraints, not a sanitized screenshot of the real app — see
  `claude-app-cowork-rail-fidelity-pass-044.md`'s "Remaining Gaps": "A
  sanitized live Claude desktop/Cowork capture is still needed before
  claiming pixel-level accuracy for the mode tabs, right rail, connector
  rows, and command-card spacing." This pass ports pass-100 faithfully (the
  repo owner's designated source of truth) but inherits that same
  unverified-against-live-app gap. If a real cowork rail capture is added to
  `captures/live-refs/` in the future, both `claude-desktop.html`'s `.cw-rail`
  and this atom should be re-checked together.
- **Standalone stage padding is atom-only presentation**, not present in the
  in-shell claude-desktop version — kept intentionally so the atom reads
  correctly when captured/mounted on its own (see Deliberate deviations).
- **Connector/file-icon badge colors** (`#f4efe8`, `#d6d0c4`, etc.) are kept
  as raw hexes rather than mapped to `--claude-*` tokens since no token in
  `backlot-foundation.css` corresponds to these decorative light-mode-only
  grays; mapping them would either lose the exact pass-100 look or require
  inventing new tokens outside this pass's scope.

## Scope note

Only `compositions/claude-agent-rail.html` and this prototype note were
touched. `surfaces/registry.json` and `docs/catalog.md` were intentionally
left unedited (batched by the main session per instructions). No commit was
made.
