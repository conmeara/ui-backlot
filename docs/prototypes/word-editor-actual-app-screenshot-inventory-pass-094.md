# Word Editor Actual-App Screenshot Inventory Pass 094

Date: 2026-06-18

## Purpose

Re-anchor the Word editor surface work to actual Microsoft Word / Microsoft 365
screenshots before doing another implementation pass. The current editable
surface is still too far from the real app in font, iconography, layout density,
control hierarchy, and overall Microsoft 365 look and feel.

This note is a reference inventory and delta list only. It does not license
copying Microsoft product assets into the editable HTML surface.

## Local App Check

- `/Applications/Microsoft Word.app`: not present.
- `/Applications/Microsoft 365.app`: not present.
- `/Applications/LibreOffice.app`: present, but not a valid Word reference.

Because local Word is unavailable in this environment, the screenshot evidence
for this pass comes from Microsoft-owned support pages. The crops are saved for
local visual comparison only.

## Screenshot References

| ID | Local crop | Source page | Source image URL | What it shows | Use |
|---|---|---|---|---|---|
| word-ribbon-tabs-groups-commands | `reference/word/screenshots/word-ribbon-tabs-groups-commands.png` | https://support.microsoft.com/en-us/word/customize-the-ribbon-in-word | https://support.microsoft.com/en-us/word/media/word-365-ribbon-description-example.png | Word ribbon with tabs, groups, and commands called out | Top-level ribbon anatomy, group spacing, icon/text scale |
| word-comments-button-over-ribbon | `reference/word/screenshots/word-comments-button-over-ribbon.png` | https://support.microsoft.com/en-us/word/using-modern-comments-in-word | https://support.microsoft.com/en-us/word/media/word-comments-button-over-the-ribbon.png | Comments button over the ribbon | Top-right Comments placement and document chrome density |
| word-comments-pane-new-button | `reference/word/screenshots/word-comments-pane-new-button.png` | https://support.microsoft.com/en-us/word/using-modern-comments-in-word | https://support.microsoft.com/en-us/word/media/word-new-comments-button-pane.png | New comments button at top of Comments pane | Comments pane header/button layout |
| word-reviewing-pane-button | `reference/word/screenshots/word-reviewing-pane-button.png` | https://support.microsoft.com/en-us/word/using-modern-comments-in-word | https://support.microsoft.com/en-us/word/media/word-reviewing-pane-button-screen.png | Reviewing Pane button in Review tab | Review ribbon command sizing and icon/text relationship |
| word-track-changes-dropdown | `reference/word/screenshots/word-track-changes-dropdown.png` | https://support.microsoft.com/en-us/word/training/track-changes-in-word | https://support.microsoft.com/en-us/word/media/web-track-changes.png | Track Changes dropdown with Off / For Everyone / Just Mine | Word for web Review menu density and dropdown styling |
| word-mac-track-markup-options | `reference/word/screenshots/word-mac-track-markup-options.png` | https://support.microsoft.com/en-us/word/training/track-changes-in-word | https://support.microsoft.com/en-us/word/media/mac-track-changes-markup-options.png | Word for Mac track changes markup options | Mac ribbon/menu vocabulary and markup controls |
| word-mac-comment-balloon | `reference/word/screenshots/word-mac-comment-balloon.png` | https://support.microsoft.com/en-us/word/training/track-changes-in-word | https://support.microsoft.com/en-us/word/media/wordformac-comment-in-balloon.png | Word for Mac comment balloon in margin | Comment balloon shape, connector, and side-margin behavior |
| word-web-accept-reject-menu | `reference/word/screenshots/word-web-accept-reject-menu.jpg` | https://support.microsoft.com/en-us/word/accept-or-reject-tracked-changes-in-word | https://support.microsoft.com/en-us/word/media/track-changes-in-word-web.jpg | Word web menu for tracking/accept-reject | Accept/reject menu placement and compact styling |
| word-tell-me-online-search | `reference/word/screenshots/word-tell-me-online-search.png` | https://support.microsoft.com/en-us/office/do-things-quickly-with-tell-me-f20d2198-17b8-4b09-a3e5-007a337f1e4e | https://support.microsoft.com/en-us/office/media/wdol-tellme-example.png | Tell Me / search box in Word Online | Search field placement, lightbulb affordance, tab row density |
| word-copilot-chat-pane | `reference/word/screenshots/word-copilot-chat-pane.png` | https://support.microsoft.com/en-us/word/welcome-to-copilot-in-word | https://support.microsoft.com/en-us/word/media/copilot-in-word-chat-pane.png | Copilot chat pane in Word desktop app | Modern side pane density, typography, and panel chrome |

## Asset-Use Notes

- These screenshots are Microsoft product screenshots saved only as local
  reference crops for visual comparison.
- Do not copy pixels, icons, product artwork, fonts, or screenshots into
  `compositions/word-editor.html`.
- The next implementation pass should translate measured/observed properties
  into hand-authored editable HTML/CSS.
- If reference screenshots are committed or shared, keep this note and source
  links with them so their observation-only role is clear.

## Current Surface Compared With Actual-App Screenshots

1. The current ribbon is much taller and more spacious than Word references;
   real Word controls are denser with smaller icon-label stacks.
2. The current active tab treatment is too pill/card-like; actual Word tabs are
   flatter and integrated into the ribbon rail.
3. The current File tab is a blue block inside the tab row; actual Word/M365
   chrome varies by platform and often uses subtler app/titlebar integration.
4. Current ribbon group labels sit in a large footer band; real Word group
   labels are smaller and closer to command clusters.
5. Current icons are CSS sketches with generic geometry; actual Word icons use
   consistent Fluent/Office line weights, filled accents, and precise sizes.
6. Current command buttons have rounded rectangular outlines around nearly
   every item; actual Word often uses lighter hoverless command zones with
   fewer visible button borders.
7. Current Review ribbon omits exact groups visible in references such as
   dedicated Tracking display controls, Show Markup hierarchy, and compact
   reviewing pane button treatment.
8. Current Track Changes uses a toggle pill; actual references show dropdown
   menus and split controls for Off / For Everyone / Just Mine.
9. Current comments pane is visually closer to a generic card sidebar; actual
   comments panes have tighter header rows, smaller text, and more restrained
   cards.
10. Current comment cards use oversized avatars and spacing; actual comments
    are denser and more document-tool-like.
11. Current comment connector is a long horizontal gold line; actual Word for
    Mac comments use margin balloons with more compact pointers and balloon
    geometry.
12. Current document title text is too large and dramatic for typical Word
    document editing screenshots.
13. Current document body line-height and spacing read like a designed web
    article; actual Word document text is more conventional, with tighter
    default paragraph rhythm.
14. Current page canvas is still only an approximation; actual Word print
    layout needs stronger page-to-gray-workspace proportions and scroll gutters.
15. Current vertical ruler is synthetic and visually heavy; actual ruler marks
    are thinner, more precise, and tied to page measurement.
16. Current status bar is closer after pass 093 but still too graphic; real Word
    status bars are flatter and more compact with platform-specific controls.
17. Current zoom slider and view buttons are oversized compared with actual
    Word references.
18. Current titlebar/search/share area blends macOS traffic lights with web
    Word patterns; actual screenshots should drive a specific target platform
    instead of a hybrid.
19. Current typography uses available fallback names but does not yet match the
    perceived Segoe UI / Aptos / Office typography stack and weights.
20. Current ribbon uses plain text labels for many commands where real Word
    relies on recognizable Office icons and compact split-button affordances.
21. Current side panes do not match Copilot/Comments pane chrome: pane width,
    border treatment, inner padding, and header affordances need source-based
    measurement.
22. Current accept/reject floatie is a generic web popover; actual Word web
    accept/reject menus are smaller, flatter, and anchored to the review
    interaction.
23. Current page margin guides are visible dashed lines; real Word does not
    normally show such strong margin guides in everyday print layout.
24. Current table styling is too saturated blue; Word tables are generally more
    neutral unless a table style is selected.
25. Current selection/caret state is helpful for demos but not yet derived from
    an actual Word editing screenshot; the color, height, and antialiasing need
    reference-based adjustment.

## Next Implementation Direction

- Pick one target platform first: Word for web or Word for Mac. Do not keep
  blending the two.
- Build a side-by-side comparison sheet with the current `captures/surface-word-editor/target.png`
  and at least one reference crop before editing.
- Use the actual screenshots to reduce scale, border weight, color saturation,
  and spacing before adding more features.
- Treat icon fidelity as a first-order task: either hand-draw a small coherent
  Office-like CSS icon set from observed shapes or deliberately wire a properly
  attributed MIT Fluent System Icons subset.
- Revisit typography after choosing target platform; the current mix still
  reads like a polished mock instead of Word.
