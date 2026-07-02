# Codex Thread Core Pass 100

Date: 2026-07-01

## Goal

Add a standalone, zoomable Codex conversation-core component that isolates
the working-thread transcript (user turn, assistant reply, command-output
card, composer) without the surrounding app chrome, for clips that need a
tight cut on the Codex thread body.

## Changed

- Added `compositions/codex-thread-core.html` with
  `data-composition-id="codex-thread-core-surface"` and a single page root
  `#codex-thread-core` (`.codex-thread-core-stage`) at 980x840.
- Structure mirrors the working-thread portion of the Codex app surface:
  user message row, assistant reply copy, a collapsible command-output card
  with request/response body, and a bottom composer.
- Registered the `codex-thread-core` registry surface (kind `component`)
  with a dedicated capture script targeting `#codex-thread-core` at
  1080x920.
- Included the same GSAP-based entrance timeline convention used by
  `compositions/claude-thread-core.html`; the component loader strips
  `<script>` tags on mount, so all visual state is otherwise pure CSS.

## Reference Basis

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
- `captures/surface-codex-app/target.png`
- `assets/icons/source-authentic/lucide/claude-symbols.svg`

## Asset And License Decision

Hand-authored HTML/CSS with curated Lucide (ISC) icon symbols vendored under
`assets/icons/source-authentic/` and referenced via `<use href="#id"/">`. No
Codex/OpenAI product code, bundled app assets, or private account data
copied into the component.

## Verification

Run in this pass:

- `npm run capture:codex-thread-core`
- `npm run registry:check:captures`
- `npm run catalog:generate`
- `npm run hf:lint` (must stay at the pre-existing 19-error baseline)
