# Element-matcher fix — 2026-07-20

Owner: `tools/fidelity-score.mjs` only. Fixes the measurement gap where
`elementOverall` sat ~0.50 for mounted surfaces (claude family) even when
human judges confirmed a close visual match.

## Root cause

Reproduced with the real inputs behind
`workspace/fidelity/score-claude-composed-app-*.json`:
`--ours captures/surface-claude-composed-app/capture.json --theirs
reference/claude/2026-07-05/web-app-{chat,home}-light/tokens.json`.

Two distinct, additive problems, both in how `scoreElements` builds and
matches the element pool — not in the content of either capture:

1. **Wrapper-duplicate flooding.** `normalizeElements` keeps every DOM node
   ≥2×2px with no de-duplication. A live app's React/component-mounted DOM
   (the reference; also anything mounted via
   `runtime/backlot-component-loader.js`) nests many layout-only wrapper divs
   that share the same bounding box as their one meaningful descendant.
   Measured on the claude-composed-app/chat-light pair: **70% of the
   reference's 600 elements sit in duplicate-rect groups** (largest group
   size 6: `div.row-start-2 > div.row-start-1 > div > div >
   div.standard-markdown > p.font-claude-response-body`, all four inner
   nodes sharing one rect) vs **9% of ours** (125 elements) — a direct
   artifact of DOM depth, not of what's on screen. `matchElements`'s
   assignment is a global greedy sort-by-cost, not an optimal one: with
   dozens of near-identical-cost wrapper candidates flooding the pool, it
   commits early to whichever duplicate has negligibly lower cost, "spending"
   a real ours-side element on a content-free wrapper while the true
   counterpart (often the wrapper's leaf-node twin) goes unmatched. This is
   the "different nesting depth/order/wrapper nodes" gap named in the task.
2. **Off-frame content in the reference.** Independent of (1): the
   reference's `elements.json` is a full-page DOM dump, not a
   viewport-clipped one — for a scrolled chat conversation it includes the
   entire scrollback. 333 of the chat reference's 600 elements have a
   bounding box that never overlaps the visible `[0,1]×[0,1]` capture frame
   at all (`y` from ‑2976 to +709 against a ~828px-tall target rect). No
   static single-screenshot recreation can ever have counterparts for
   scrolled-out history, so these elements were pure, unfixable
   `matchScore` denominator penalty — content neither a human judge nor any
   matcher could compare, masquerading as "missing UI."

Both effects independently suppress `matchScore` (weight 0.3 of
`elementOverall`) and, for (1), also corrupt `position`/`typography` by
letting oversized wrapper-to-wrapper pairs win on coincidental center-overlap
instead of true element correspondence.

## Fix

All changes in `tools/fidelity-score.mjs`, matcher-internal only — CLI flags,
output schema, and every score not derived from `elements` are unchanged.

- `overlapsFrame()` + a filter at the end of `normalizeElements`: drop
  elements whose normalized bounding box has zero overlap with the captured
  frame (2% tolerance for rounding). Applied symmetrically to both sides.
  Ancestor/scroll-container wrappers that span through the visible frame
  survive (they still overlap); only elements that are *entirely* off-frame
  are dropped.
- `collapseWrapperChains()`: groups elements by rounded pixel rect; for any
  group with >1 member, keeps only the most specific one — preferring a
  member that actually carries a signal (own text or a painted background),
  and within that, the last one in document order (wrapper chains list
  ancestor before descendant, so the tail is the deepest node). Falls back to
  the full group if none carry a signal.
- `prepareElements()`: fixed pipeline order — `normalizeElements` →
  `attachContext` (needs the *full* tree for ancestor-text hints) →
  `collapseWrapperChains` (needs `ctx` already attached). `scoreElements` now
  calls this once per side and reuses the same collapsed list for both
  matching and the `counts`/weight denominators, so a duplicate wrapper can't
  re-inflate "how much of the real app we're missing" after being fixed for
  pairing.
- `matchElements(ours, theirs)` signature simplified to take
  already-prepared lists (attachContext/collapse moved to the caller); pairing
  logic (cost function, greedy sorted assignment, confidence/margin) is
  untouched.
- Guarded `main()` behind an `import.meta.url` entrypoint check and added
  debug-only exports (`normalizeElements`, `prepareElements`,
  `collapseWrapperChains`, `matchElements`, `pairCost`, `matchConfidence`,
  `scoreElements`, `main`) at end of file, purely so this could be
  reproduced/inspected from a script instead of only via CLI stdout. No
  effect on `node tools/fidelity-score.mjs ...` / `npm run fidelity:score`
  behavior — verified byte-identical stdout format and verified via the
  actual npm script, not just direct node invocation.

What this does **not** do: no score is boosted by loosening what counts as a
match. `pairCost`, `GEO_VETO_DIST`, `PAIR_COST_MAX`, and `matchConfidence`
are untouched — a pairing still requires real text/geometry/style agreement,
and every element that survives the frame filter but still finds no
counterpart still shows up in `unmatchedTheirs`/`unmatchedOurs` and still
penalizes `matchScore`. The fix removes noise from the assignment problem
(duplicate geometry, unreachable off-frame content); it does not relax the
acceptance criterion for what a "match" is.

## Validation

Reran the scorer on the same claude-composed-app inputs used in
`workspace/fidelity/score-claude-composed-app-*.json`, plus two mounted-DOM
reference pairs (`web-app-chat-light`, heavy scrollback; `web-app-home-light`,
no scrollback) to separate the two fixes, plus **figma-editor** — a `kind:
component` surface that is *not* mounted through
`runtime/backlot-component-loader.js` — as a non-mounted control, against
both of its reference pairs. Token-only families (excel, codex, word,
powerpoint, browser, slack, macos, premiere) have no `elements.json`/DOM
`tokens.json` in `reference/` at all yet (screenshots only), so `elementOverall`
is `null` for them before and after — not a valid control for element
matching, but their token scores (colors/typography/radii/spacing/shadows,
which don't touch any changed code) were spot-checked identical for the
figma pairs below (`TOKEN 0.669`/`0.660` unchanged, deltas list unchanged).

| Pair | Before | After | Δ | Note |
|---|---|---|---|---|
| claude-composed-app vs `web-app-chat-light` (mounted, heavy scrollback) | 0.497 (56/600 matched) | 0.525 (35/147 matched) | +0.028 | both fixes apply; theirs pool shrinks 600→147 after dropping off-frame scrollback + wrapper dupes |
| claude-composed-app vs `web-app-home-light` (mounted, no scrollback) | 0.564 (79/418 matched) | 0.595 (46/148 matched) | +0.031 | isolates the wrapper-collapse effect (little off-frame content on this page) |
| figma-editor vs `help-center-left-panel` (not mounted, control) | 0.369 (27/461 matched) | 0.372 (27/437 matched) | +0.003 | negligible — figma-editor has far fewer duplicate-rect wrappers to begin with |
| figma-editor vs `help-center-ui3-overview` (not mounted, control) | 0.350 (10/148 matched) | 0.350 (9/129 matched) | 0.000 | unchanged |

`matchScore` roughly doubled on the mounted pairs (0.078→0.175 chat,
0.259→0.402 home) while the non-mounted controls moved by ≤0.003 — the fix is
targeted at the wrapper/off-frame problem, not a general score inflation.
One side effect worth flagging for whoever reads the next claude-family
report: `position` dropped on the mounted pairs (0.598→0.516 chat,
0.600→0.485 home). Inspection of the matched pairs (see
`workspace/scratch/debug-positions.mjs`) shows this is *more correct*, not a
regression — e.g. our composer's "Code"/"Design"/"Cowork" pill switcher now
correctly pairs with its real counterpart by exact text match and reports
their true ~30% vertical offset, a genuine layout drift that duplicate giant
wrapper-to-wrapper matches (both near dead-center of the frame) were
previously masking with a falsely-good position score.

`elementOverall` for the claude family is still well below what a human
judge would give a "close match" — the residual gap after this fix is a
**content-scope mismatch**, not a matcher bug: our composed-app captures a
short demo state (a handful of messages / one screen) while the reference
captures are longer, richer real sessions (the chat reference alone still has
147 on-frame, non-duplicate real elements after cleanup, of which we match
35). That's out of scope for a matcher fix — either the reference capture
should be trimmed to a comparable content scope, or the demo surface's
content should be enriched to match; either is a `captures/`/`reference/`
change, which this task does not own.

## Files touched

- `tools/fidelity-score.mjs` — `overlapsFrame`, `normalizeElements` filter,
  `collapseWrapperChains`, `prepareElements`, `matchElements` signature,
  `scoreElements` wiring, `main()` entrypoint guard + debug exports.
- `workspace/scratch/debug-match.mjs`, `debug-dupes.mjs`, `debug-visible.mjs`,
  `debug-positions.mjs` — throwaway inspection scripts used to reproduce and
  confirm the two root causes above; safe to delete.
- `workspace/scratch/orig/fidelity-score-orig.mjs` — pristine pre-fix copy
  (`git show HEAD:tools/fidelity-score.mjs`) used to generate the "before"
  numbers in the table above; safe to delete.
- `workspace/scratch/matcher-fix-2026-07-20/*.json` — full before/after
  report pairs for the four validation runs above.
