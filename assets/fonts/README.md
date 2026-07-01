# Fonts

UI Backlot uses source-authentic fonts when they materially improve surface
fidelity.

The Anthropic variable font files in this folder are intentionally part of the
local source-authentic foundation and are wired through
`styles/backlot-foundation.css` as:

- `Anthropic Sans`
- `Anthropic Serif`

Other app-family font variables in the foundation prefer real native font names
first, then renderer-safe fallbacks. If a future pass adds more font binaries,
record the source and the surfaces that depend on them here.
