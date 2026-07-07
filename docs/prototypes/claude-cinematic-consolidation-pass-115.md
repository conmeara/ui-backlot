# Pass 115 — claude-cinematic: one zoomed conversation surface

Date: 2026-07-07

## What changed

The six overlapping launch/cinematic prototypes were consolidated into ONE
parameterized surface, `compositions/claude-cinematic.html` (1920x1080,
registry ids `claude-cinematic`, `-prompt`, `-complete`, `-dark`):

| Deleted file | Beat it becomes |
|---|---|
| `claude-prompt-stack.html` | `?beat=prompt` (bubble stack + thinking loader) |
| `claude-home-launch.html` | `?beat=prompt` (near-duplicate of prompt-stack) |
| `claude-cinematic-reply.html` | `?beat=reply` (large serif answer + mark + composer) |
| `claude-conversation.html` | `?beat=reply` (older 1280x720 generation, drifted accent) |
| `claude-completion-response.html` | `?beat=complete` ("Done." copy + mark) |
| `claude-launch-completion.html` | `?beat=complete` (near-duplicate + composer) |

## Decisions

- **Beats are parameters** (`?beat=` / `data-beat`), mirroring
  `claude-composed-app`'s `?page=` convention; `complete` shares the reply
  layout and differs only in default copy (both copy sets are in the DOM,
  CSS shows one per beat).
- **Copy goes through `data-copy` slots** (`cine-bubble-1..4`,
  `cine-reply-primary/-secondary`, `cine-complete-primary/-secondary`,
  `cine-composer-placeholder`) so host scenes retarget wording without
  string-replacing markup.
- **Canonical tokens replace drift**: the old files carried `#c65b47`/
  `#cf6f5d`/`#d66f59` accents; the merged surface uses `--claude-brand` /
  `--claude-brand-deep` (#e08a62 / #d8755f) and maps paper/ink/bubble to the
  `--claude-*` foundation tokens.
- **Real icons replace hand-drawn glyphs**: composer plus/folder/send are
  lucide symbols (same ids as `claude-composer.html`); the Claude mark is the
  mounted `claude-response-mark` atom. The hand-drawn mic, sunburst, and
  chevron pseudo-elements are gone.
- **Dark is a parameter** (`?theme=dark` / `class="theme-dark"`), verified by
  the `claude-cinematic-dark` capture.

## Evidence

- `captures/surface-claude-cinematic{,-prompt,-complete,-dark}/target.png`
- Layout numbers carried from the deleted files' launch-frame studies
  (`docs/prototypes/claude-app-cinematic-reference-pass-062.md`,
  `reference/claude/frame-study/sonnet-4-6/`).
