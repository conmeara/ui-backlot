# Claude Actual App Reference Sources 094

Date: 2026-06-18

This is the reset reference pack for the next Claude fidelity pass. The previous
editable surfaces are still far from the actual app in font, icons, spacing,
layout, and overall feel, so implementation should start from these screenshots
rather than from the existing reconstruction.

The binary screenshots are stored locally under:

`reference/claude/images/current-app-2026-06-18/`

That directory is intentionally git-ignored because these are reference-only
third-party/official product images.

## Sourced Screenshots

1. `official-cowork-how-01.webp`
   - Source: `https://claude.com/product/cowork`
   - Direct image: `https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6972a1d3d9f82138ceba7cb9_cowork-how-01-p-1600.webp`
   - Use for: current Cowork home/task prompt, grid background, card radius, starter action icon treatment, composer geometry, Opus 4.5 model chip.

2. `official-cowork-how-02.webp`
   - Source: `https://claude.com/product/cowork`
   - Direct image: `https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6972a1d380a08f2685e461ec_cowork-how-02-p-1600.webp`
   - Use for: Progress card typography, large numbered progress rows, blue active state, working folder card, large right-column card scale.

3. `official-cowork-how-03.png`
   - Source: `https://claude.com/product/cowork`
   - Direct image: `https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6972a1d40a6e040ed0666235_cowork-how-03-p-1600.png`
   - Use for: file-permission modal style, button hierarchy, modal typography, shadow treatment, warning copy density.

4. `official-claude-code-desktop.png`
   - Source: `https://claude.com/product/claude-code`
   - Direct image: `https://cdn.sanity.io/images/4zrzovbb/claude-com/e1f6dfe23221c0849b7c850cc0b73bf24ccbf2e9-2196x928.png`
   - Use for: dark Claude Code desktop shell, left rail icon scale, sidebar row height, pill controls, composer treatment, low-radius dark panels.

5. `real-cowork-running-command.jpg`
   - Source: `https://simonwillison.net/2026/Jan/12/claude-cowork/`
   - Direct image: `https://static.simonwillison.net/static/2026/claude-cowork.jpg`
   - Use for: actual Cowork desktop shell with Chat / Code / Cowork mode switch, task list, real command card, right rail sections, bottom composer, Opus 4.5 selector.

6. `real-cowork-artifact-preview.jpg`
   - Source: `https://simonwillison.net/2026/Jan/12/claude-cowork/`
   - Direct image: `https://static.simonwillison.net/static/2026/claude-cowork-artifact.jpg`
   - Use for: artifact preview split, narrow chat column, right rail persistence, top artifact toolbar, completed-step state, scrollbars.

## Immediate Fidelity Implications

- The actual Cowork shell uses a pale grid-paper canvas in the chat area, not a flat blank page.
- The left sidebar is much wider and flatter than the current editable surface, with fewer decorative shadows.
- The mode switch is large and plainly segmented; it should not look like a tiny toolbar.
- The Claude mark is not the same as the current handmade sunburst scale in every context; icon weight needs a full pass.
- The app relies heavily on thin outline icons and muted gray strokes; current icons are too improvised and inconsistent.
- The actual user bubble can be large and square-ish with a soft radius, not a small pill.
- Assistant body text in Cowork uses a serif face for prose, but not at the huge poster scale currently used in the chat shell.
- Command cards show `Request` / JSON-like content with generous internal padding and clear scroll behavior.
- Progress cards are large stacked panels with circular check/number states; the current rail is too compact and app-internal.
- The artifact preview layout can split the center area into a narrow response column plus a live preview pane.
- Composer controls are sparse: plus, model selector, send button, and sometimes folder context; our composer still carries too many pill buttons by default.
- Window/modal radius is moderate but not uniformly pill-like; current rounded panels need to be pulled back.

## Local Live Capture

No local live Claude screenshot was taken in this pass. The next step should use
local app capture only if the visible state can be sanitized: new empty task,
no private chats, no private account details beyond generic plan/user chrome.
