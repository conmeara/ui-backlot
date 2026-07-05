# Claude Sidebar Atom Consolidation — Pass 102

Pilot for the repo-wide consolidation plan
([component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md),
phase 2 "crown the best atoms"). The `claude-sidebar` atom
(`compositions/claude-sidebar.html`) was rebuilt from scratch by pouring in the
pass-100, live-app-verified sidebar visuals from
`compositions/claude-desktop.html` — the repo owner's designated single source
of truth. The old atom's invented layout (mode switch on the chat page,
pseudo-element icons, ad-hoc `--paper/--ink` palette) is gone.

## What was ported

- **Chat page (default)** — `#claude-desktop-chat .cd-sidebar` verbatim:
  traffic lights, Claude brand row (exact `#si-claude` mark, 18px, `#d97757`),
  New chat / Search chats nav rows, Pinned + Today history, workspace footer.
- **Cowork page** — `#claude-desktop-cowork .cw-sidebar`: collapse toggle row,
  Chat/Code/Cowork mode switch, orange New task button, selected task pill,
  local-sync note, 40px workspace account row.
- **Code page** — `#claude-desktop-code .code-sidebar` (dark-native):
  traffic + toggle/search glyph row, chat/list glyphs + Code pill, New
  session / Scheduled / Customize, Pinned (green git-branch) + Recents
  (dashed-circle) rows, Acme Co. footer, and the `.page-code` radial backdrop
  on the stage.
- **Dark variant** — final scoped `.theme-dark` block mirroring
  claude-desktop's dark block (pass-101 mechanism); verified against
  `captures/surface-claude-desktop-chat-dark/target.png` and the cowork-dark
  capture. Panel bg sampled identical (`#1f1e1c`).

## Mechanics

- Page switch is a **pure CSS attribute selector** on the root:
  `#claude-sidebar-surface[data-page="chat" | "cowork" | "code"]`, default
  chat when the attribute is absent. Direct preview accepts `?page=` for
  capture convenience (capture-time only; no JS needed for switching).
- Mount contract unchanged: root `#claude-sidebar-surface`,
  `data-composition-id="claude-sidebar-surface"`, 360x840, capture selector
  `.claude-sidebar-stage`, panel geometry 264x768 at (48,36) — so
  `claude-composed-app.html`'s slot crop/scale still lands exactly
  (recaptured, mount verified).
- Colors consume the canonical `--claude-*` tokens from
  `styles/backlot-foundation.css` wherever a token value matches the pass-100
  hex (`--claude-ink`, `--claude-paper`, `--claude-surface`,
  `--claude-text-faint`, `--claude-text-muted`, `--claude-ink-soft`,
  `--claude-brand-deep`); non-token hexes are kept verbatim from
  claude-desktop.
- All inline symbols synced from `assets/icons/source-authentic/` via
  `tools/sync-inline-icons.mjs` (`--check` passes; the sync pulled newer
  canonical geometry for `lucide-message-circle`, `lucide-git-branch`,
  `lucide-building` than claude-desktop currently inlines).

## Verification

- `npm run capture:claude-sidebar` (light) + direct captures for dark
  (`--root-class theme-dark`), cowork, cowork-dark, code — compared
  side-by-side against the sidebar regions of the claude-desktop chat /
  cowork / code / chat-dark target captures. Chat light/dark are
  near-pixel-identical; panel backgrounds sample identical in all four
  spot-checks.
- `npm run capture:claude-composed-app` — sidebar mounts and crops as before.
- `npm run registry:check` — OK (65 surfaces).

## Deliberate deviations

- **Panel geometry**: the desktop shell renders the sidebars as full-height
  flat columns (chat 260px, cowork 300px, code 300px floating card). The atom
  keeps one shared 264x768 rounded panel for all three pages to preserve the
  claude-composed-app mount contract; cowork padding is rescaled 22px→16px and
  the collapse-toggle offset re-derived proportionally. Rounded edge + drop
  shadow on the panel are atom-presentation only.
- **Dark grays via tokens**: a few desktop dark hexes are replaced by the
  nearest token dark value per the consolidation directive (e.g. labels/kebab
  `#8a8578` → `--claude-text-faint` `#98948a`) — visually indistinguishable at
  capture size.
- **Three lucide icons** intentionally differ from claude-desktop's inlined
  copies because the canonical sprites are newer (see Mechanics).
- **Code page dark theme**: the code sidebar is dark-native and gets no
  `.theme-dark` overrides (same as claude-desktop, which has no code-dark
  capture). Verified legible with dark tokens active, but **unverified
  against a reference** — no `surface-claude-desktop-code-dark` target
  exists yet.
