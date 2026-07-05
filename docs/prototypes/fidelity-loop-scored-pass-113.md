# Pass 113 — First scored fidelity pass (Claude family), 2026-07-05

Method: `.claude/workflows/fidelity-push.js` v2 (Score → Critique → Fix →
Judge with hard score bar + stranger test → Gate) against the dated live
ground truth in `reference/claude/2026-07-05/`, followed by one targeted
follow-up round driven by the judge's regressions and the stranger test's
tells. First pass to be verdict-gated by `tools/fidelity-score.mjs` instead
of adjectives.

## Scores (tokenOverall vs measured live claude.ai)

| Surface | Baseline | After pass | After follow-up |
| --- | --- | --- | --- |
| claude-composed-app | 0.828 | 0.843 | **0.859** |
| claude-home | 0.822 | 0.810 (regression caught by the bar) | **0.871** |

Final verdict: **improved, bar cleared, zero visual regressions** (Opus
adversarial judge). Gates: 0/67 capture failures, registry ok, quickstart
render ok, no new lint errors.

## What changed

- Measured neutral text ramp (#0b0b0b / #373734 / #52514e / #7b7974) replaces
  the invented warm-gray ramp — scoped CSS-variable overrides per surface
  (foundation.css untouched by rule).
- All hairlines → measured rgba(11,11,11,0.10).
- Composer/prompt cards use the real shadow recipe (0 4px 20px
  rgba(0,0,0,.075) + 0.5px ring); chips use the measured inset-ring recipe.
- Sans weights remapped to the real 430/550 scale; serif hero row layout
  (mark inline-left, 36–40px, weight 330), single-line.
- Home: real starter chips (Write / Learn / Code / Life stuff / Claude's
  choice), empty "How can I help you today?" composer, real nav section
  order; blueprint-grid canvas texture removed; "Opus 4.5" → "Opus 4.8";
  spinner stroke and traffic-light geometry corrected.
- Running-command card renders true backtick-quoted JSON with #256bc1 colons.
- MD/HTML file tiles rebuilt as document-glyph-with-label per the real
  cowork capture.

## Loop behavior notes

- The hard bar did its job: the first hero fix visually improved claude-home
  but dropped its token score; the judge refused "improved", repair restored
  the reference's single-line layout, and the follow-up round recovered the
  score past baseline.
- The stranger test (fresh-context judge, neutral-named image pairs) caught
  both fakes at medium confidence; its tells drove the follow-up round and
  were more actionable than the general critique.
- Remaining (queued for a future round, from the final judge): home composer
  "Max" tier label + waveform/dictation icon; sidebar glyph variants
  (circular-plus New chat, single-bubble Chats, open-tray Projects,
  overlapping-square Artifacts); sidebar search magnifier; composed-app
  composer mic+waveform pair.
- Ops gotcha recorded: launch repo workflows by scriptPath — the name
  registry served a stale pre-v2 snapshot and ignored the family filter.
