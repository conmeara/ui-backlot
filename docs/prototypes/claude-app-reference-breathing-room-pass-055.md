# Claude App Reference Breathing Room Pass 055

Date: 2026-06-18.

## Purpose

This pass continues refining the reusable full Claude working-thread component
against the Sonnet 4.6 launch reference rhythm. Pass 052 made the assistant
response and composer more prominent, but the component still read too much
like a dense productivity dashboard because the side rails, prompt bubble,
cards, and small response type competed with the primary Claude answer. This
pass gives the answer/composer more breathing room while keeping the workflow
metadata editable for deck-update demos.

## Evidence Used

- `reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg`
  - Used for the sparse ivory field, pale user bubbles, red starburst
    placement, and large answer/composer hierarchy.
- `reference/claude/frame-study/sonnet-4-6/frame-32s.jpg`
  - Used as the strongest reference for treating Claude's answer as a large
    editorial object with lots of surrounding negative space.
- `reference/claude/frame-study/sonnet-4-6/frame-64s.jpg`
  - Used for prompt bubble proportions, pale bubble color, and right-aligned
    user-message rhythm.
- `captures/surface-claude-app/target.png`
  - Used as the before/after quality gate for the full working-thread app.
- `DESIGN.md`
  - Used for palette, Anthropic font choices, editable UI constraints, and the
    no-copied-product-assets rule.

## Changes

- Updated `compositions/claude-app.html`.
  - Narrowed the left sidebar and right task rail while increasing the central
    transcript width.
  - Reduced the visual weight of pane guide lines, the topbar, and rail
    backgrounds.
  - Replaced the long demo prompt with a reference-like deck update prompt.
  - Enlarged the primary serif assistant response and made the secondary line
    quieter.
  - Softened reasoning/action/command cards so they support the answer instead
    of competing with it.
  - Increased the floating composer height, radius, placeholder size, and
    shadow.
- Updated `surfaces/registry.json`.
  - Pointed the `claude-app` entry at this pass note.

## Asset Decision

No Claude product code, private account data, screenshots, official icons, app
bundle assets, or reference-video frames were copied into the composition. The
surface remains hand-authored editable HTML/CSS/GSAP using local fonts and
reference captures only as visual evidence.

## Capture

- `npm run capture:claude-app`
- Output: `captures/surface-claude-app/target.png`

Regression wrapper captures:

- `npm run capture:claude-browser-thread-workflow`
- `npm run capture:claude-finder-thread-workflow`
- `npm run capture:claude-codex-terminal-workflow`
- `npm run capture:claude-presentation-workflow`

## Verification

- `npm run capture:claude-app`
  - Refreshed `captures/surface-claude-app/target.png`.
  - Visual inspection confirmed the assistant response and composer now read as
    the primary objects, with side/task rails quieter than pass 052.
- `npm run capture:claude-browser-thread-workflow`
  - Refreshed `captures/surface-claude-browser-thread-workflow/target.png`.
  - Visual inspection confirmed the refined Claude thread still mounts cleanly
    over the browser app surface.
- `npm run capture:claude-finder-thread-workflow`
  - Refreshed `captures/surface-claude-finder-thread-workflow/target.png`.
- `npm run capture:claude-codex-terminal-workflow`
  - Refreshed `captures/surface-claude-codex-terminal-workflow/target.png`.
- `npm run capture:claude-presentation-workflow`
  - Refreshed `captures/surface-claude-presentation-workflow/target.png`.
- `npm run registry:check`
  - Passed: `22 surfaces, 13 components, 7 workflows, 22 ready captures`.
- JSON parse check for `package.json` and `surfaces/registry.json`
  - Passed.
- `npm run hf:lint`
  - Passed with 0 errors. Existing warnings are GSAP Studio write-back/pointer
    and font advisories for the broader composition set.
- `npm run hf:validate`
  - Passed with no console errors.
- `npm run hf:inspect`
  - Initially caught clipped text in the narrowed sidebar selected task label
    and right-rail artifact title.
  - Fixed by shortening those low-priority rail labels to `Q2 deck chart` and
    `Deck.pptx`.
  - Re-run passed with 0 issues.
- `npm run hf:snapshot`
  - Refreshed the 7-frame workflow snapshot set and
    `snapshots/contact-sheet.jpg`.
- `npm run hf:render`
  - Rendered `renders/claude-keynote-workflow-draft.mp4`.
- `ffprobe -v error -show_entries format=duration,size -of default=nw=1 renders/claude-keynote-workflow-draft.mp4`
  - `duration=16.000000`
  - `size=2740724`
- `git diff --check`
  - Passed.

## Remaining Gaps

- A sanitized live Claude desktop/Cowork capture is still required before
  claiming pixel-level accuracy for sidebar, model selector, composer, task
  rail, and message-card geometry.
- The component still carries deliberate demo affordances, especially the
  right task/context rail, that may not exist in the exact same form in the
  real Claude app.
- The CSS Claude mark is still an approximation and should not be treated as
  the official product asset.
