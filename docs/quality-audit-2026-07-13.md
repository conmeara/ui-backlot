# Per-app quality audit — 2026-07-13

Graded by direct comparison against each family's best reference (real-pixel
captures where available). Grade = "would a stranger who uses the real app
daily accept a paused frame as real?" A = yes at full size; B = yes in a demo
video, tells at full size; C = tells in a demo video; D = reads as a mockup.

Re-grade after every fidelity-push: update this file (or supersede it with a
newer dated audit) so the loop's Critique phase can prioritize from the
owner's + auditor's gaps, not just token deltas.

| Family | Grade | Ground truth quality | Top gaps to close next |
|---|---|---|---|
| claude | A- | Excellent — real Claude.app captures 2026-07-13 (home/code) | chat/cowork session views still trace the older web refs; recapture a live thread in the Mac app (Codex can drive it). Home compose tray spacing slightly loose vs capture. |
| macos (menu bar/dock/finder/wallpaper) | A- | Real captures, judged good at pass 100 | dock icon set is donor-based; Control Center glyph flagged at pass 100 still approximate. |
| finder | A- | Real captures | dark variant title/toolbar contrast slightly hot. |
| codex | B+ | Real app captures | judged good at pass 100; re-verify against current app version (drift-watch). |
| word | B+ | Real Mac screenshots (review ribbon, comments) | ribbon icon fidelity (simplified glyphs); title bar search field geometry. |
| figma | B+ | Real Figma.app capture 2026-07-13 (desktop chrome added) | right panel misses UI3 "Copy to Figma Slides" + Layout Flow icon row; canvas demo content simpler than real files; left-panel header row should read "file name ⌄ / Drafts Free". |
| slack | B+ | Real logged-in app + App Store shots 2026-07-13 | prototype: message density, thread panel, huddle bar absent; sidebar icon rail spacing. |
| excel | B | Real refs (2026-07-09/13) | ribbon group layout simplified vs real Mac Excel; grid font/row-height slightly off; status bar cluster. |
| browser | B | Public web refs; drift-watch browser capture still outstanding | tab strip + omnibox geometry vs a real Chrome window capture (import one via tools/import-reference.mjs). |
| claude-code CLI / codex terminal | B+ | Product knowledge + captures | prompt-line details drift with releases; cheap to re-verify. |
| calendar | B- | Real captures (dark too) | flagged "needing heavy work" at pass 100, improved since; month-grid typography + event chip radii still off; full 1920x1080 size makes it the odd one out in compositions. |
| powerpoint | C+ | App Store + web refs | UNDERSIZED (836x438 vs the 1280x760 Office standard) so the ribbon is squeezed; ribbon needs the shared-chrome rebuild (see below). Highest-priority rebuild. |
| premiere | B- | Adobe Video yt-frames 2026-07-09; regraded today | panels' tab strips + tool rail near; Effect Controls/Lumetri panels simplified; monitors use synthetic footage — source CC0 stills (asset policy allows real assets). Was D before today's timeline regrade. |

## Standing follow-ups

1. **Shared Office chrome** (word/powerpoint/excel): factor
   `styles/office-ribbon.css` — titlebar (traffic + AutoSave + title +
   search + Comments/Share), tab row with per-app accent underline, ribbon
   group/button primitives — then rebuild presentation-editor at 1280x760 on
   it, and migrate word/excel. The ribbons are structurally identical; only
   accent + tab set + group contents differ.
2. **Monitors/footage**: replace CSS-approximated footage (premiere monitors,
   browser page hero) with sourced CC0 real images where it buys realism.
3. **Judging process**: fidelity-push judges compare against FILED refs — a
   stale or wrong-tier ref caps how good the judge can be (this month's
   Claude pages traced the web app while the Mac app had moved). Before
   grading a family, the judge should sanity-check the ref's tier + date in
   reference/sources.json and flag "reference stale/wrong tier" as its own
   verdict instead of polishing toward the wrong target.
