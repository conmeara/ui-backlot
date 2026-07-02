# Human Review Pass (Pass 100)

Date: 2026-07-01. Follows pass 099.

## Method

First human-in-the-loop pass. The repo owner clicked through a side-by-side
review deck (`captures/review/index.html`, gitignored) pairing every primary
capture with its real-app reference, drew annotations in the Claude app
browser, and sent them back. Ground truth was then refreshed from the LIVE
installed apps via computer-use (Calendar month+week views, Codex home,
Chrome window, menu bar close-ups) — per the new standing rule: **live
installed apps are the source of truth, not marketing screenshots.**
Observations were encoded as px/hex specs and executed by two workflows
(`pass100-human-review-fixes`, `pass100-restructure`): spec-driven fixers
(Opus on the Calendar rebuild and the claude-desktop build, Sonnet
elsewhere), Opus adversarial judges with Sonnet repair loops, full gates.
All six verdicts came back "improved".

## Changes

- **Exact Claude mark**: the official sunburst is now vendored as `#si-claude`
  (simple-icons@15.22.0, CC0, provenance in the sprite header) and replaces
  every hand-drawn approximation across all claude-* compositions.
- **claude-app**: Chat|Code|Cowork segmented control rebuilt compact (24px),
  centered, moved up under the traffic lights; Progress rail rebuilt as the
  real horizontal check-circle stepper with "Steps will show as the task
  unfolds." caption; Artifacts reduced to a single row; sidebar rows
  tightened (30px rows, 15px lucide icons).
- **calendar-app**: heavy rebuild to live Tahoe Calendar specs — plain
  toolbar glyphs with plain "23" inbox count, trackless segmented control,
  Today pill + chevrons, sentence-case sidebar groups with filled-color
  checkboxes, "Sun 30"-format day headers with red today circle, 52px
  right-aligned hour gutter with small-caps meridiems, event blocks with
  12% tint + 3px left bar + clock-glyph time line, hatched declined event,
  all-day pills with color-circle glyphs, and the correct now-line (red
  time pill in gutter, faint line across the grid, bold segment + dot on
  today's column only), real Tahoe calendar palette, restyled mini-month.
- **figma**: bottom toolbar rebuilt with 16px consistent-stroke lucide
  icons and blue active-tool square; right properties panel dropped to
  11px type on 24px controls at 240px width.
- **mac-menu-bar**: Control Center glyph replaced with the real two-toggle
  capsule icon (hand-authored SVG); a mirrored variant in
  surfaces/claude-mac-finder.html was fixed to match.
- **claude-desktop (NEW)**: one component, three page roots sharing chrome —
  `#claude-desktop-chat` (from refined claude-home), `#claude-desktop-cowork`
  (from refined claude-app), `#claude-desktop-code` built fresh from the
  official product shot: floating dark sidebar, empty canvas, context chips
  (Local/app/main/worktree), single "Type / for commands" composer,
  Auto-accept/Model footer, CSS pixel-art mascot. Supersedes
  claude-code-desktop as the desktop shell (old surfaces kept as aliases so
  the 17 workflow compositions keep working). Cowork page content sanitized
  to the demo-workspace story (no real names from reference captures).
- **codex-thread-core (NEW)**: zoomed Codex conversation for demo-video
  cuts — plain user turn, reply with codex-style diff card, live-app
  composer anatomy (orange Full-access chip, "5.5 Extra High", circular
  send), ui-backlot project chip.

## Verification

Both workflow gates green: all capture scripts pass (0 failures), registry
grew to **55 surfaces / 36 components / 17 workflows / 55 ready captures**,
catalog + inventory regenerated, hf:lint exactly at the 19-error baseline
(zero new errors from the two new compositions), quickstart renders (14.0s).

## Environment learnings

- Claude desktop on this Mac cannot be made to open a window
  programmatically (dock/reopen/cmd+N/menus all no-op when windowless).
- Figma desktop is logged out — no live Figma refs until the owner signs in.
- No path to save computer-use screenshots to repo disk; live-app ground
  truth is encoded as specs in the workflow prompts instead.

## Remaining (queued)

- Light + dark variants for most apps (needs dark-mode captures — owner
  toggles system appearance).
- Repoint workflow compositions from claude-app/claude-code-desktop to the
  claude-desktop pages, then retire the superseded surfaces.
- Cowork command card: cap height + bottom fade for exact reference parity;
  Code-page mascot slightly larger/higher per official shot.
- figma-onboarding W/H row overflow at 240px panel width (pre-existing).
- PowerPoint dead-CSS prune; sourcing sanitized Excel/Chrome/Premiere refs.
