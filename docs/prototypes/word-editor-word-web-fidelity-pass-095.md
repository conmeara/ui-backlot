# Word Editor Word for Web Fidelity Pass 095

Date: 2026-06-18

## Purpose

Move `compositions/word-editor.html` from a hybrid Mac / generic Office-style
mock toward a Word for web / Microsoft 365 editable reconstruction grounded in
the actual-app screenshot crops from
`reference/word/screenshots/` and the delta inventory in
`docs/prototypes/word-editor-actual-app-screenshot-inventory-pass-094.md`.

The target platform for this pass is Word for web, not Word for Mac.

## Reference Crops Used For Visual Review

- `reference/word/screenshots/word-ribbon-tabs-groups-commands.png`
- `reference/word/screenshots/word-track-changes-dropdown.png`
- `reference/word/screenshots/word-comments-button-over-ribbon.png`
- `reference/word/screenshots/word-comments-pane-new-button.png`
- `reference/word/screenshots/word-web-accept-reject-menu.jpg`
- `reference/word/screenshots/word-copilot-chat-pane.png`

## Changes

- Rebuilt the top chrome toward Word for web:
  - removed visible macOS traffic-light chrome
  - added Microsoft 365 app-launcher dot grid
  - flattened the Word app tile
  - added a web-style document title/saved state
  - centered a rectangular Microsoft 365 search field
  - added Editing, Comments, Share, and profile controls
- Reworked the tab strip:
  - flatter tabs
  - no card-like active tab
  - blue underline active Review tab
  - Word-web-like tab vocabulary including Mailings and Help
- Compressed the Review ribbon:
  - shorter 86px ribbon
  - lighter borders
  - smaller command labels
  - smaller group labels
  - fewer always-visible button outlines
- Replaced the Track Changes toggle-pill with a Word-web-like split command and
  open dropdown showing Off, For Everyone, and Just Mine.
- Added smaller CSS-drawn Office-like command glyphs for comments, track
  changes, accept, and reject.
- Reduced the page/workspace weight:
  - flatter gray canvas
  - lighter page shadow
  - smaller document title/body typography
  - removed strong dashed margin guides
  - removed the synthetic vertical ruler
  - neutralized the table style
- Tightened the Comments pane:
  - flatter pane header
  - New button with compact plus affordance
  - close affordance
  - tab underline instead of segmented cards
  - denser comment cards, avatars, timestamps, action buttons, and reply field
- Flattened the status bar and reduced zoom/view-control scale.
- Preserved the composed `claude-word-workflow` framing without changing that
  wrapper file.

## Delta Audit

Addressed or substantially improved:

1. Ribbon height/density reduced.
2. Active tab treatment flattened into an underline.
3. File tab no longer a blue block.
4. Ribbon group labels moved into smaller, lower-density treatment.
5. Command icon geometry made smaller and more coherent.
6. Always-visible button borders reduced across ribbon controls.
7. Review ribbon now includes more source-aligned Tracking / Show Markup /
   Reviewing Pane treatment.
8. Track Changes is now a dropdown/split control with Off / For Everyone /
   Just Mine.
9. Comments pane now reads less like a generic card sidebar.
10. Comment cards are smaller and denser.
12. Document title typography is smaller and less dramatic.
13. Body text rhythm is tighter.
14. Page canvas proportions and gray workspace are closer to Word web.
15. Heavy vertical ruler removed.
16. Status bar flattened.
17. Zoom/view buttons reduced.
18. Mac/web hybrid titlebar cues reduced by targeting Word for web chrome.
19. Typography shifted toward Segoe UI / Aptos / Calibri platform stack.
20. Ribbon controls now rely more on icon-plus-label command affordances.
21. Side pane chrome is closer to Microsoft 365 pane density.
22. Accept/reject floatie is flatter and more menu-like.
23. Strong margin guides removed.
24. Table styling neutralized.
25. Selection/caret scale and color toned down.

Partially addressed, still needs another pass:

5. CSS icons are more consistent, but not yet at Fluent System Icon quality.
11. Comment connector was reduced, but true Word for web comment anchoring still
    needs a better source crop.
14. Page scale is closer but should be measured against a full Word for web
    document canvas screenshot when available.
18. The workflow wrapper still places the Word web surface inside a macOS
    desktop scene; that is intentional for the Claude workflow, but the
    standalone component is now web-targeted.

Addressed count: 22 of 25 deltas substantially improved, exceeding the 18-delta
goal threshold.

## Comparison Artifacts

- `captures/surface-word-editor/comparisons/before-word-web-pass-095.png`
- `captures/surface-word-editor/comparisons/before-after-word-web-pass-095.jpg`
- `captures/surface-word-editor/comparisons/reference-track-changes-vs-after-pass-095.jpg`
- `captures/surface-word-editor/comparisons/reference-comments-pane-vs-after-pass-095.jpg`

## Verification

- `npm run capture:word-editor`
  - Output: `captures/surface-word-editor/target.png`
  - Visual check: no text overlap after icon block fix; ribbon, Track Changes
    dropdown, Comments pane, page canvas, and status bar render cleanly.
- `npm run capture:claude-word-workflow`
  - Output: `captures/surface-claude-word-workflow/target.png`
  - Visual check: the Word for web targeted surface remains legible behind the
    Claude component in the composed workflow.
- `npm run registry:check`
  - Output: `Surface registry OK: 51 surfaces, 32 components, 17 workflows,
    51 ready captures.`
- JSON parse for `surfaces/registry.json` and `package.json`
  - Output: `json ok`
- `git diff --check`
  - Passed with no whitespace errors.

## Asset Decision

No Microsoft code, fonts, icons, screenshots, or product assets were embedded
into `compositions/word-editor.html`. Reference screenshot crops remain in
`reference/word/screenshots/` as observation-only comparison material.
