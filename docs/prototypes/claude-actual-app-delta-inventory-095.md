# Claude Actual App Delta Inventory 095

Date: 2026-06-18

Current captures compared:

- `captures/surface-claude-app/target.png`
- `captures/surface-claude-composed-app/target.png`
- `captures/surface-claude-chat-shell/target.png`
- `captures/surface-claude-thread-core/target.png`
- `captures/surface-claude-composer/target.png`
- `captures/surface-claude-agent-rail/target.png`

Actual app references:

- `reference/claude/images/current-app-2026-06-18/official-cowork-how-01.webp`
- `reference/claude/images/current-app-2026-06-18/official-cowork-how-02.webp`
- `reference/claude/images/current-app-2026-06-18/official-cowork-how-03.png`
- `reference/claude/images/current-app-2026-06-18/official-claude-code-desktop.png`
- `reference/claude/images/current-app-2026-06-18/real-cowork-running-command.jpg`
- `reference/claude/images/current-app-2026-06-18/real-cowork-artifact-preview.jpg`

## Concrete Deltas

1. **Shell proportions:** current `claude-app` uses a narrow left sidebar and narrow right rail; real Cowork allocates roughly a quarter of the window to the left sidebar and another large column to the right rail.
2. **Canvas background:** current center pane is mostly blank white; real Cowork uses a visible pale grid-paper background behind chat and artifact areas.
3. **Window radius:** current shell uses a smaller polished app radius with drop shadow; real app window is flatter, larger, and closer to a native full app surface.
4. **Sidebar surface:** current sidebar has a beige gradient and decorative softness; real sidebar is flatter off-white with subtle separators.
5. **Mode switch scale:** current Chat / Code / Cowork switch is compact; real switch is large, prominent, and almost the full sidebar width.
6. **New task button:** current button is small with a handmade icon; real button uses a large colored circular plus icon and looser row spacing.
7. **Sidebar task row height:** current rows are tight; real rows are taller with larger text and stronger selected-row fill.
8. **Sidebar explanatory copy:** current selected-context note is a small status card near the bottom; real Cowork shows explanatory copy under the active task list, in plain sidebar flow.
9. **Account row:** current avatar/account row is tiny; real app account row has a large circular avatar, plan text, and disclosure affordance.
10. **Header title column:** current topbar is short and dense; real topbar title sits in a taller app chrome with clearer title text and more breathing room.
11. **User prompt bubble:** current prompt bubble is a modest pill; real Cowork prompt bubble is a large rounded rectangle with multiple lines, heavier type, and a warm gray fill.
12. **Assistant prose scale:** current answer is still too poster-like in some surfaces; real Cowork prose is large but constrained to a narrow column, with natural paragraph line breaks.
13. **Assistant mark alignment:** current handmade sunburst is oversized/underweighted depending on context; real mark is smaller, cleaner, and aligned close to the prose block.
14. **Command card header:** current command card is too low-contrast and compact; real card has a larger header, clearer command glyph, and a visible chevron control.
15. **Command card body:** current JSON area is shallow; real request content is a tall scrollable code panel with a pale background and green monospaced text.
16. **Message actions:** current action buttons are generic tiny icons; real screenshots show more restrained row actions and visible scroll affordances.
17. **Composer placement:** current composer is stretched wide across the center; real Cowork composer is a floating rounded card constrained to the active conversation column.
18. **Composer controls:** current composer shows folder and research pills by default; real composer is sparse: plus, model selector, send, and context only when needed.
19. **Send button:** current send button is a red circular stop/send control; real Cowork send is a peach rounded square with a white up-arrow.
20. **Model selector:** current model chip in the topbar is acceptable for some states, but real Cowork places `Opus 4.5` inside the composer in task/chat states.
21. **Right rail card model:** current right rail is a continuous narrow column; real Cowork uses separate rounded cards for Progress, Artifacts, and Context.
22. **Progress state:** current progress rows are compact and status-chip-like; real progress uses large circular check/number states and big text rows.
23. **Rail icons:** current file/connector icons are filled color squares; real rail uses thin outline icons and small document badges.
24. **Artifact split:** current full app only lists artifacts; real artifact state can split the middle into a response column and a live artifact preview pane.
25. **Scrollbars:** current app hides most scroll behavior; real screenshots show scrollbars in center and right rail.
26. **Typography family:** current sans/serif sizing and weights do not match the actual app hierarchy; the actual app appears to use a cleaner sans for chrome, large serif for prose, and lighter monospaced command text.
27. **Icon style:** current custom CSS icons vary in stroke and fill; real app icons are consistent thin outline icons with rounded stroke caps.
28. **Grid rhythm:** current spacing uses many small local component gaps; real app uses larger, simpler vertical rhythm, especially between user prompt, assistant text, command card, and composer.

## High-Impact Patch Targets

This pass should prioritize deltas 1, 2, 5, 6, 8, 11, 15, 17, 18, 19, 21, 22, 23, and 24. These are the differences most responsible for the current surface feeling unlike the real app.

## Patch 095 Evidence

Patched Claude-only surfaces:

- `compositions/claude-app.html`
- `compositions/claude-composed-app.html`
- `compositions/claude-chat-shell.html`
- `compositions/claude-composer.html`
- `compositions/claude-thread-core.html`
- `compositions/claude-agent-rail.html`

Addressed or materially improved deltas:

1. Shell proportions: widened the full Claude app shell to 1280 x 860, increased left sidebar and right rail allocations, and made the app read as a larger desktop surface.
2. Canvas background: added pale grid-paper backgrounds to the primary app, composed app, and thread core.
5. Mode switch scale: made the Cowork segmented control large and sidebar-width in the full app.
6. New task button: switched the full app toward a larger colored circular plus and looser row spacing.
8. Sidebar explanatory copy: moved selected-folder explanation into plain sidebar flow in the full app.
11. User prompt bubble: increased prompt bubble size, radius, and type scale in the app and thread core.
15. Command card body: expanded the request JSON area with green monospaced text and larger internal padding.
17. Composer placement: constrained the app composer into a floating active-column card rather than stretching it across the full center.
18. Composer controls: removed default folder/research/mic pills from updated app, standalone composer, and chat shell states.
19. Send button: changed updated composers to peach rounded-square send buttons with up-arrow glyphs.
20. Model selector: moved `Opus 4.5` into composer controls for updated app, standalone composer, and chat shell states.
21. Right rail card model: split Progress, Artifacts, Context, and Connectors into separate rounded cards in app/composed/standalone rail states.
22. Progress state: enlarged progress circles and simplified rows in the app and standalone rail.
23. Rail icons: shifted file/context icons away from heavy filled squares toward lighter outlined document/folder forms.
26. Typography hierarchy: reduced chip-heavy sans treatment, kept serif answer text constrained, and increased chrome/composer type where the real app is larger.

Remaining notable deltas:

- Delta 12: assistant prose still needs a full font/weight audit against fresh live app text.
- Delta 13: the handmade Claude sunburst remains approximate and should be replaced with a more faithful editable primitive.
- Delta 16: message actions and scrollbar behavior are still under-modeled.
- Delta 24: artifact preview split is cataloged but not rebuilt in the main full app state yet.
- Delta 25: real scrollbars are still mostly absent in the editable surfaces.
- Delta 27: icon stroke consistency needs a dedicated pass across all Claude components.
