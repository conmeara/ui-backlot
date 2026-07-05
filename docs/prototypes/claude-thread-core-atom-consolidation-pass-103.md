# Claude Thread-Core Atom Consolidation — Pass 103

Second consolidation pour after the sidebar pilot
([claude-sidebar-atom-consolidation-pass-102](claude-sidebar-atom-consolidation-pass-102.md),
plan: [component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md)
phase 2). The `claude-thread-core` atom (`compositions/claude-thread-core.html`)
was rebuilt by pouring in the pass-100, live-app-verified thread visuals from
`compositions/claude-desktop.html` — the cowork page working thread
(`#claude-desktop-cowork .cw-main`) for the surface/card/serif treatment and
the chat page topbar for the icon treatment. The old atom's ad-hoc
`--bg-000/--text-100` palette and pseudo-element icons are gone.

## What was ported

- **Working surface** — `.cw-main`'s paper: `#fffdf7` with the 58px
  `rgba(223,219,209,0.34)` grid texture, hairline
  `rgba(49,43,36,0.08)` topbar border, `rgba(255,253,247,0.8)` topbar wash.
- **User bubble** — `.cw-bubble` verbatim: `#ece9e2`, 18px radius, 17px/1.5
  (old atom: `#efede6`, 16px radius, 1.34).
- **Assistant serif** — pass-100 rhythm at the atom's dense 21px size
  (per the repo owner's working-scale spec), `line-height: 1.45`, weight 410,
  ink `#171715` via token.
- **Cards** — `.cw-command-card` treatment: `rgba(39,37,34,0.09)` border,
  16px radius, `#fffefb`, `0 4px 16px rgba(45,36,27,0.05)` shadow; code green
  `#2f7d4f` / dark `#9fc98a`; expanded chevron points up like
  `.cw-command-chev`.
- **Icons** — every pseudo-element glyph replaced with sprite symbols:
  `lucide-sidebar-toggle`, `lucide-share`, `lucide-more`,
  `lucide-chevron-down`, `lucide-terminal`, `lucide-copy`, `lucide-retry`,
  plus the exact pinned `#si-claude` mark (cinematic reply mark).
  `tools/sync-inline-icons.mjs --check` passes (9 matched, 0 drift).
- **Dark variant** — final scoped `.theme-dark` block mirroring
  claude-desktop's cowork dark block (pass-101 mechanism); layout verified
  against `captures/surface-claude-thread-core-dark/target.png`, colors from
  the new token values (bubble `#3a3934` samples identical to the cowork-dark
  reference; panel `#262624`).

## Scale switch (decision: one thread atom)

- `data-scale="working" | "cinematic"` on `#claude-thread-core-surface`
  (default working), pure CSS attribute selectors — same mechanism as the
  sidebar pilot's `data-page`.
- **Working** (default) — the dense pass-100 thread: 21px serif responses,
  thinking / tool / command cards, message actions.
- **Cinematic** — the large-serif treatment ported from
  `compositions/claude-chat-pane.html` (unmodified): 48px/1.13 serif reply,
  34px/1.23 secondary, 48px `#si-claude` reply mark at `left:0/top:9px` with
  78px text indent, 24px/1.27 user bubble, wider 780px measure. The dense
  cards/actions are hidden — the source pane's cinematic rhythm carries no
  tool chrome. Colors stay on the pass-100 palette (secondary `#342e28` from
  chat-pane is the one type-treatment color kept).
- Direct preview accepts `?scale=cinematic` (capture convenience only; same
  pattern as the sidebar pilot's `?page=`).

## Mechanics

- Mount contract unchanged: root `#claude-thread-core-surface`,
  `data-composition-id="claude-thread-core-surface"`, 980x840, capture
  selector `.claude-thread-core-stage`, panel geometry 884x764 at (48,38) —
  `claude-composed-app.html`'s thread-slot crop/scale lands exactly
  (recaptured, mount verified).
- Tokens: `--claude-ink`, `--claude-ink-soft`, `--claude-text-muted`,
  `--claude-text-faint`, `--claude-paper`, `--claude-brand-deep` wherever the
  pass-100 hex matches; non-token hexes (`#fffdf7`, `#ece9e2`, `#fffefb`,
  `#928a80`, `#8a8578`, `#2f7d4f`/`#9fc98a`, `#5fa36b`, `#d97757` mark) kept
  verbatim from claude-desktop. The dark block only patches hard-coded hexes;
  token colors flip via `styles/backlot-foundation.css`.
- The invented (always-hidden) topbar model-selector was removed; the hidden
  `.thread-context-strip` and `.command-card` beats are kept for the GSAP
  timeline, which is unchanged.
- `.reply-mark`'s hide rule is id-scoped (`#claude-thread-core-surface
  .reply-mark`) because sibling components in composed shells inject their own
  `.backlot-icon { display: block }` later in the cascade — caught in the
  composed-app recapture.

## Verification

- `npm run capture:claude-thread-core` (light),
  `npm run capture:claude-thread-core-dark` (`--root-class theme-dark`), and a
  cinematic capture via `?scale=cinematic`
  (`captures/surface-claude-thread-core-cinematic/`, verification evidence
  only — no registry entry; batched by the main session).
- Pixel-sampled the light capture against
  `captures/surface-claude-desktop-cowork/target.png`: panel `#fffdf7`,
  bubble `#ece9e2`, card `#fffefb` all sample identical; dark bubble `#3a3934`
  identical to the cowork-dark reference, dark panel within 1/255 of it.
- `npm run capture:claude-composed-app` — thread mounts and crops as before,
  no reply-mark leak.
- `tools/sync-inline-icons.mjs --check compositions/claude-thread-core.html` —
  9 matched, no drift. `npm run registry:check` — OK (65 surfaces).

## Deliberate deviations

- **21px working serif** (not the desktop's 23px): pinned by the repo owner's
  working-scale spec for the dense atom; the atom panel is smaller than the
  1440px desktop shell so the rhythm reads equivalent.
- **Scene content** (thinking-card parts, tool progress rows, message
  actions) is atom-specific working-thread content with no exact
  claude-desktop counterpart; it keeps the established thread-core scene and
  takes the pass-100 card *treatment*.
- **Tool-row status glyphs** (green check, orange spinner) stay CSS-drawn:
  the lucide check's 2-unit stroke renders sub-pixel (~0.75px) inside the
  16px dot via `<use>` and cannot be thickened through the symbol's
  presentation attribute. Same precedent as the sidebar pilot's CSS traffic
  lights.
- **Cinematic hides the cards** — treatment ported from claude-chat-pane,
  which has no tool chrome; showing 13.5px card triggers under 48px serif
  would break the rhythm. Cinematic dark is token-driven but has no dedicated
  reference capture.
- **Panel presentation** (rounded 18px panel + drop shadow on a 980x840
  stage) is atom-only presentation preserved from the previous atom for the
  composed-app mount contract; the desktop shell renders the thread as a flat
  full-height column.
