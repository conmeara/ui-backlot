# Claude Composer Atom Consolidation — Pass 104

Second pass of the repo-wide consolidation plan
([component-consolidation-audit-2026-07-02](../component-consolidation-audit-2026-07-02.md),
phase 2 "crown the best atoms"), following the pilot recipe from
[claude-sidebar-atom-consolidation-pass-102](claude-sidebar-atom-consolidation-pass-102.md).
The `claude-composer` atom (`compositions/claude-composer.html`) was rebuilt
from scratch by pouring in the pass-100, live-app-verified composer visuals
from `compositions/claude-desktop.html` — the repo owner's designated single
source of truth. The old atom's invented layout (attachment chips, pill-style
model selector with big serif prompt text, circular plus/mic buttons) is gone.

## What was ported

- **Chat page (default)** — `#claude-desktop-chat .cd-composer-card`
  verbatim: static prompt copy, folder + attach icon buttons, right-aligned
  ghost model select ("Opus 4.5" + chevron), filled orange send button.
- **Cowork page** — `#claude-desktop-cowork .cw-composer`: live "Reply…"
  placeholder composer (`.cw-prompt`, two-row grid), attach button, model
  select, send button, plus the centered disclaimer line below the card
  ("Claude is AI and can make mistakes. Please double-check responses.").
- **Dark variant** — scoped `.theme-dark` block mirroring claude-desktop's
  dark blocks for both pages, verified against
  `captures/surface-claude-desktop-chat-dark/target.png` and the cowork-dark
  capture (composer region). Stage background sampled `#262624`, card
  background `#30302c` in both pages, matching claude-desktop's dark tokens.

## Mechanics

- Page switch is a **pure CSS attribute selector** on the root:
  `#claude-composer-surface[data-page="chat" | "cowork"]`, default chat when
  the attribute is absent — same mechanism as `claude-sidebar`. Direct
  preview accepts `?page=cowork` for capture convenience (capture-time only;
  no JS needed for switching).
- Mount contract unchanged: root `#claude-composer-surface`,
  `data-composition-id="claude-composer-surface"`, `data-width="900"
  data-height="220"`, capture selector `.claude-composer-stage`. Verified via
  `npm run capture:claude-composed-app` — the composer still mounts, crops,
  and scales (0.8x, offset -36/-25 in `.composer-slot`) identically to
  before; `claude-composed-app.html` was not touched.
- Colors consume the canonical `--claude-*` tokens from
  `styles/backlot-foundation.css` wherever a token value matches the pass-100
  hex (`--claude-ink`, `--claude-text-muted`, `--claude-text-faint`,
  `--claude-ink-soft`, `--claude-brand-deep`); non-token hexes (e.g. the
  cowork send button's `#df9b87`, which is a distinct shade from the chat
  page's `--claude-brand-deep` in claude-desktop itself) are kept verbatim
  from claude-desktop, matching the source's own per-page inconsistency
  rather than inventing a merge.
- All inline symbols (`lucide-folder`, `lucide-plus`, `lucide-chevron-down`,
  `lucide-send-up`) synced from `assets/icons/source-authentic/` via
  `tools/sync-inline-icons.mjs`; `--check` reports 4 matched, 0 drift.
- Dark-variant CSS keys off `.theme-dark` as an ancestor/self of
  `.claude-composer-stage` (the capture tool's `--root-class` target is the
  `--selector` element itself, not `#claude-composer-surface`) — same
  correction already present in `claude-sidebar.html`'s dark block.

## Verification

- `node tools/sync-inline-icons.mjs --check compositions/claude-composer.html`
  — pass, no drift.
- `npm run capture:claude-composer` (light, chat page) — composer card,
  copy, icon buttons, model select, and send button match the chat-page
  composer region of `captures/surface-claude-desktop-chat/target.png`
  (typography size/weight, border radius, shadow depth, orange send fill).
- Direct capture with `--root-class theme-dark` (chat page) — matches
  `captures/surface-claude-desktop-chat-dark/target.png` composer region;
  stage/card backgrounds sample identical to the reference.
- Direct capture with `?page=cowork` (light) and `?page=cowork
  --root-class theme-dark` — both match the cowork composer + disclaimer
  region of `captures/surface-claude-desktop-cowork/target.png` and
  `captures/surface-claude-desktop-cowork-dark/target.png`.
- `npm run capture:claude-composed-app` — composer mounts and crops as
  before inside the composed shell; visually unchanged position/scale in the
  thread panel.
- `npm run registry:check` — OK (65 surfaces, unchanged; registry.json not
  touched per instructions).

## Deliberate deviations

- **Two structurally different composers, one atom**: unlike the sidebar
  (which shares one panel geometry across pages), the chat and cowork
  composers in claude-desktop are genuinely different components (static
  hero prompt vs. live reply box with disclaimer) — ported as two full
  `.composer-panel` variants switched by `data-page`, rather than trying to
  force a single shared markup shape.
- **Stage padding widened**: the old atom used `32px 54px 40px` padding to
  center a 792px-wide card; the new atom uses `32px 90px 40px` to center the
  narrower 720px card width pulled from claude-desktop (`min(100%, 720px)`
  resolved to 720px at this stage width), keeping the card horizontally
  centered in the same 900x220 stage so the composed-app mount offset still
  lands correctly.
- **No code-page composer**: claude-desktop has no separate code-page
  composer visual (the code page reuses no composer element in the pass-100
  capture), so the atom only exposes `chat`/`cowork`, matching the source.
- **Cowork send-button color kept distinct**: `#df9b87` (cowork) vs.
  `--claude-brand-deep` `#d8755f` (chat) — both are verbatim from
  claude-desktop's own pass-100 CSS; not unified since the source doesn't
  unify them either.
