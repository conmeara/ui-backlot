# UI Backlot Primitives

The main HyperFrames composition marks reusable pieces with `data-primitive`.
Heavy surfaces should move into composition files once their primitive boundary
is stable.

Current sources: `index.html`,
`compositions/mac-menu-bar.html`,
`compositions/claude-response-mark.html`,
`compositions/claude-composed-app.html` (canonical Claude shell),
`compositions/claude-chat-pane.html`,
`compositions/claude-deck-chat-pane.html`,
`compositions/claude-prompt-stack.html`,
`compositions/claude-desktop.html` (deprecated pass-100 reference),
`compositions/claude-code-terminal-session.html`,
`compositions/claude-sidebar.html`,
`compositions/claude-agent-rail.html`,
`compositions/claude-cinematic-reply.html`,
`compositions/claude-launch-completion.html`,
`compositions/claude-completion-response.html`,
`compositions/claude-composer.html`,
`compositions/claude-home-launch.html`, `compositions/claude-home.html`,
`compositions/claude-thread-core.html`,
`compositions/finder-window.html`,
`compositions/codex-app.html`, `compositions/codex-terminal.html`,
`compositions/presentation-editor.html`,
`compositions/word-editor.html`, `compositions/excel-workbook.html`,
`compositions/figma-editor.html`, `compositions/figma-onboarding-editor.html`,
`compositions/premiere-editor.html`,
`compositions/browser-app.html`, `compositions/claude-browser-workflow.html`,
`compositions/claude-launch-browser-workflow.html`,
`compositions/claude-browser-chat-workflow.html`,
`compositions/claude-browser-chat-pane-workflow.html`,
`compositions/claude-finder-workflow.html`,
`compositions/claude-presentation-workflow.html`,
`compositions/claude-presentation-chat-pane-workflow.html`,
`compositions/claude-figma-workflow.html`,
`compositions/claude-code-figma-workflow.html`,
`compositions/claude-word-workflow.html`,
`compositions/claude-excel-workflow.html`,
`compositions/claude-premiere-workflow.html`,
`runtime/backlot-component-loader.js`

## Rendered Workflow Primitives

1. `mac-menu-bar`: menu bar with app menus, date, time, SVG-mask Apple glyph,
   and icon-like Control Center, Wi-Fi, and battery status controls informed by
   `macos-web`. The reusable source is now
   `compositions/mac-menu-bar.html`; workflow wrappers that need desktop
   chrome now mount this component instead of carrying local menu-bar copies.
2. `mac-dock`: centered glass Dock with local-only `macos-web` donor icon
   slots, Finder/Claude/Safari/PowerPoint/Notes apps, wrappers, open-app dots,
   tooltip slots, and a separator inspired by the donor Dock structure.
3. `finder-window`: editable Finder column-view window sourced from the clean
   `Launch Deck` capture. Source: `compositions/finder-window.html`, with the
   older host-scene copy still present in `index.html` (the standalone
   `surfaces/claude-mac-finder.html` lab was deleted in the 2026-07-02
   consolidation).
4. `claude-controller-chat`: Claude-style controller shell using local
   Anthropic fonts, dframe/epitaxy-informed sidebar, topbar, transcript column,
   model selector, user prompt, assistant response, grouped
   reasoning/action/source parts, and `assistant-ui`-informed composer
   controls. Superseded by the atom-composed `claude-composed-app` (see below);
   `index.html` still mounts the old `compositions/claude-app.html` source,
   which was deleted in the 2026-07-02 consolidation and needs migrating to
   the canonical shell.
5. `progress-rows`: Claude tool/progress card with grouped action header,
   done/ready/active states, duration, and status dots.
6. `composer`: attachment chips, attachment count, placeholder text, action
   chips, voice affordance, subtle active composer state, and red
   running-state control.
7. `drag-chip`: draggable folder chip used between Finder and Claude.
8. `cursor`: local-only `macos-web` normal-select pointer asset with timeline
   movement.
9. `click-ring`: click feedback primitive.
10. `todo-panel`: task checklist with checked and pending states.
11. `presentation-editor`: PowerPoint-like editor with macOS title chrome,
    AutoSave/search/share/comment controls, saved/sync indicator, collaborator
    avatars, ribbon tabs, Home command groups, `ribbon-menu`/Fluent-informed
    large commands, split controls, toggle clusters, contextual Shape Format
    tab, slide thumbnail rail, slide rulers/alignment guides, selected slide
    canvas, comment pin, chart labels, speaker notes/status/view/zoom bar,
    formatting pane, quick inspector actions, comment card, and selected-object
    handles. Source:
    `compositions/presentation-editor.html`, mounted from the host wrapper in
    `index.html`.
12. `browser-app-window`: editable browser/app review-board surface mounted as
    an intro/background plate. Its chrome is informed by `react-chrome-tabs`
    and `react-browser-components`, and the same primitive remains available as
    a standalone capture surface. Source: `compositions/browser-app.html`.
13. `intro-claude-copy`: editorial Claude launch-style opener.
14. `claude-browser-workflow`: lean wrapper composition that assembles only
    the reusable macOS menu bar, browser app surface, Claude attached-context,
    and working-thread subcompositions for clips that do not need Finder,
    PowerPoint, or the full main workflow. It exposes separate capture states
    for the draft-context beat and the active working-thread beat. Source:
    `compositions/claude-browser-workflow.html`.
15. `claude-browser-composed-workflow`: lean wrapper composition that
    assembles the reusable macOS menu bar and browser app surface with the
    componentized Claude shell. It proves nested `backlot-component-loader`
    mounting, so the wrapper can import the full Claude shell while keeping
    sidebar, thread core, composer, and rail as separate editable components.
    Source:
    `compositions/claude-browser-composed-workflow.html`.
16. `claude-browser-chat-workflow`: lean wrapper composition that assembles
    the reusable macOS menu bar, browser app surface, and lean Claude chat
    shell. It is the preferred Claude-plus-browser path when a clip needs
    desktop chrome, sidebar, thread, and composer context without the
    Cowork/task rail. Source:
    `compositions/claude-browser-chat-workflow.html`.
17. `claude-browser-chat-pane-workflow`: lean wrapper composition that
    assembles the reusable macOS menu bar, browser app surface, and lean Claude
    chat pane. It is the lightest Claude-plus-browser path when a clip provides
    its own app context and only needs desktop chrome, Claude topbar,
    conversation, and composer. Source:
    `compositions/claude-browser-chat-pane-workflow.html`.
18. `claude-deck-chat-pane`: direct-capturable lean Claude pane for
    PowerPoint-style clips that need deck-focused topbar text, prompt bubbles,
    large serif completion copy, attachment chips, and composer controls
    without sidebar, task rail, browser, Finder, Codex, or desktop chrome.
    Source: `compositions/claude-deck-chat-pane.html`.
18. `claude-prompt-stack`: direct-capturable Sonnet-launch-style prompt stack
    with four oversized right-aligned user bubbles and a lower-left loading
    mark. It is the lightest Claude-only beat for multi-step prompt intake
    when a clip does not need app chrome, sidebar, composer, browser, Finder,
    Office, Codex, or desktop context. Source:
    `compositions/claude-prompt-stack.html`.
18. `claude-launch-browser-workflow`: lean wrapper composition that assembles
    the reusable macOS menu bar and browser app surface with the split
    `claude-prompt-stack` and split `claude-completion-response` primitive. It
    gives launch-style videos a prompt-to-completion state pair without
    importing Finder, Office, Codex terminal, or the full desktop lab;
    `capture:claude-launch-browser-workflow-prompt` captures the prompt beat.
    Source:
    `compositions/claude-launch-browser-workflow.html`.
18. `claude-finder-workflow`: lean wrapper composition that assembles only the
    reusable macOS menu bar, Finder window, and Claude working-thread
    subcompositions for file/folder handoff clips that do not need browser,
    PowerPoint, or the full desktop workflow. It exposes separate capture
    states for the attached-folder handoff beat and the active working-thread
    beat. Source:
    `compositions/claude-finder-workflow.html`.
19. `claude-codex-terminal-workflow`: lean wrapper composition that assembles
    the reusable macOS menu bar, Claude working-thread, and Codex CLI/Terminal
    subcompositions for command-line agent workflow clips that do not need
    browser, Finder, Office, or the full desktop workflow. Source:
    `compositions/claude-codex-terminal-workflow.html`.
20. `claude-presentation-workflow`: lean wrapper composition that assembles
    the reusable macOS menu bar, Claude working-thread, and PowerPoint-like
    presentation subcompositions for deck-update workflow clips that do not
    need browser, Finder, Codex terminal, or the full desktop workflow. Source:
    `compositions/claude-presentation-workflow.html`.
21. `claude-presentation-chat-pane-workflow`: lean wrapper composition that
    assembles only the reusable macOS menu bar, deck-specific Claude chat pane,
    and PowerPoint-like presentation subcomposition for short deck-update clips
    that do not need the heavier Claude sidebar/task rail, browser, Finder,
    Codex terminal, or the full desktop workflow. Source:
    `compositions/claude-presentation-chat-pane-workflow.html`.
21. `claude-figma-workflow`: lean wrapper composition that assembles the
    reusable macOS menu bar, Claude working-thread, and Figma-style design
    editor subcompositions for design handoff and frame-editing workflow clips
    that do not need browser, Finder, Office, Codex terminal, Premiere, or the
    full desktop workflow. Source: `compositions/claude-figma-workflow.html`.
22. `claude-word-workflow`: lean wrapper composition that assembles the
    reusable macOS menu bar, Claude working-thread, and Word-style document
    editor subcompositions for drafting, comment, and tracked-change workflow
    clips that do not need browser, Finder, PowerPoint, Excel, Figma, Premiere,
    Codex terminal, or the full desktop workflow. Source:
    `compositions/claude-word-workflow.html`.
23. `claude-excel-workflow`: lean wrapper composition that assembles the
    reusable macOS menu bar, Claude working-thread, and Excel-style workbook
    subcompositions for spreadsheet, formula, chart-range, and workbook review
    clips that do not need browser, Finder, PowerPoint, Word, Figma, Premiere,
    Codex terminal, or the full desktop workflow. Source:
    `compositions/claude-excel-workflow.html`.
24. `claude-premiere-workflow`: lean wrapper composition that assembles the
    reusable macOS menu bar, Claude working-thread, and Premiere-style video
    editor subcompositions for timeline review, trim, graphics, and export
    clips that do not need browser, Finder, Office, Figma, Codex terminal, or
    the full desktop workflow. Source:
    `compositions/claude-premiere-workflow.html`.
25. `minimal-mac-menu-bar`: small reusable menu-bar treatment for modular app
    assemblies that need Mac context without importing the full desktop shell.
26. `backlot-component-loader`: browser-side helper that mounts component
    template roots from sibling composition files into a wrapper scene, then
    resolves nested mounts inside the cloned component. This gives capture
    pages real child DOM instead of visible iframe surfaces and lets composed
    shells be embedded in smaller workflows. Source:
    `runtime/backlot-component-loader.js`.
27. `completion-card`: final summary card for video wrap states.
28. `claude-code-figma-workflow`: lean wrapper composition that assembles only
    the light Claude Code terminal-session and dark Figma onboarding editor
    subcompositions for reference-style Claude Code-to-design clips. Source:
    `compositions/claude-code-figma-workflow.html`.

## Standalone Surface Primitives

1. `mac-menu-bar`: direct-capturable macOS menu bar component with app menu
   labels, inline Apple glyph mask, CSS Wi-Fi/battery controls, and fixed
   1920x30 component boundary. Source: `compositions/mac-menu-bar.html`.
1. `claude-response-mark`: direct-capturable 128x128 editable Claude response
   mark primitive, hand-authored from the Sonnet 4.6 launch-frame proportions.
   Sparse Claude reply and completion surfaces mount this component so future
   mark refinements happen in one file. Source:
   `compositions/claude-response-mark.html`.
1. `browser-app-window-lab`: standalone 1920x1080 browser/app lab with
   `react-chrome-tabs`/`react-browser-components`-informed overlapping tabs,
   favicons, close buttons, add-tab affordance, reload/star/profile/more
   toolbar controls, URL bar, sidebar navigation, header actions, metric cards,
   data table, right inspector, cursor, and live edit badge. The orphan
   `surfaces/browser-app-surface.html` lab was deleted in the 2026-07-02
   consolidation; captures now come from the mounted `compositions/browser-app.html`
   sub-composition (see `browser-app-window` below).
2. `macos-calendar-window`: standalone 1920x1080 macOS Calendar lab with
   `macos-web`-informed titlebar/main-area split, month/year header, rounded
   previous/today/next controls, Monday-first weekday row, 42-cell month grid,
   muted weekends, red today marker, editable event pills, DayFlow-informed
   calendar source sidebar, mini calendar, drag/reorder hint, event edit card,
   Dock, cursor, and local-only Calendar icon path. Source:
   `surfaces/calendar-app-surface.html`.
3. `claude-app-window-lab` (deleted, 2026-07-02 consolidation): formerly a
   direct-capturable Claude-only HyperFrames subcomposition with dframe-style
   sidebar rows, Chat/Code/Cowork mode tabs, widened paper-like transcript and
   composer widths, topbar controls, message stack, active folder-context
   chips, larger launch-style serif response, reference-focus capture styling,
   flattened thinking/tool-call cards, command output, subdued right-side
   Task/Artifacts/Context rail, composer attachments, running-state controls,
   and a twelve-ray CSS Claude mark. `compositions/claude-app.html` was
   deleted; use `claude-composed-app` below instead.
4. `claude-composed-app`: direct-capturable **canonical** componentized Claude
   app shell that assembles the standalone sidebar, thread core, composer, and
   agent rail through `runtime/backlot-component-loader.js`. The shell owns
   layout, clipping, and entrance choreography while the child UI stays
   editable in its own composition file. Parameterized by
   `data-page="chat|cowork|code"`, `data-sidebar`/`data-rail="on|off"`, and
   `.theme-dark`; `?page=`/`?sidebar=`/`?rail=` query params drive the same
   states in direct preview. Source: `compositions/claude-composed-app.html`.
5. `claude-chat-shell` (deleted, 2026-07-02 consolidation): formerly a
   direct-capturable lean Claude chat shell with sidebar, topbar, launch-style
   user bubbles, large serif assistant reply, CSS Claude mark, and bottom
   composer, for simple chat/app scenes that should not import the
   Cowork/task rail. `compositions/claude-chat-shell.html` was deleted; all 17
   workflows that need the full shell now mount `claude-composed-app` (or
   `claude-chat-pane` below for pane-only scenes).
6. `claude-chat-pane`: direct-capturable active Claude chat pane with topbar,
   right-aligned user bubbles, large serif assistant reply, CSS Claude mark,
   attachment chips, and bottom composer, without the sidebar or task rail.
   Source: `compositions/claude-chat-pane.html`.
7. `claude-deck-chat-pane`: direct-capturable active Claude deck-update pane
   with topbar, right-aligned deck prompt bubbles, large serif assistant
   completion, CSS Claude mark, deck attachment chips, and bottom composer,
   without the sidebar or task rail. Source:
   `compositions/claude-deck-chat-pane.html`.
7. `claude-prompt-stack`: direct-capturable cinematic prompt-intake component
   with four large editable user bubbles and a lower-left CSS loading mark,
   matching the Sonnet 4.6 launch prompt-stack rhythm without importing the
   full app pane or composer. Source: `compositions/claude-prompt-stack.html`.
5. `claude-code-desktop-window` (deleted, 2026-07-02 consolidation): formerly
   a direct-capturable dark Claude Code desktop subcomposition with session
   rail, Code mode controls, prompt transcript, changed-file rows, diff panel,
   terminal panel, task queue, floating view menu, PR summary, Opus model
   state, and compact composer. `compositions/claude-code-desktop.html` was
   deleted; the code page now lives as `data-page="code"` on
   `claude-composed-app` above (dark-native, no light variant, same as its
   pass-100 `claude-desktop` predecessor).
6. `claude-sidebar`: direct-capturable Claude left navigation component with
   traffic lights, CSS Claude mark, Chat/Code/Cowork mode tabs, New task/Search
   actions, task rows, project rows, local-context readiness, and workspace
   account state. Source: `compositions/claude-sidebar.html`.
7. `claude-agent-context-rail`: direct-capturable Claude task/context rail
   subcomposition with progress rings, step rows, artifact card, selected
   context, connector state, working files, and local-context note. Source:
   `compositions/claude-agent-rail.html`.
8. `claude-cinematic-reply`: direct-capturable launch-style Claude reply
   subcomposition with a full 1920x1080 sparse ivory field, one-line Anthropic
   Serif answer, large CSS response mark, lower-edge Reply composer,
   plus/folder/research controls, and red send button. Source:
   `compositions/claude-cinematic-reply.html`.
9. `claude-launch-completion`: direct-capturable launch-style Claude
   completion subcomposition with a full 1920x1080 sparse ivory field, two-line
   Anthropic Serif done-state response, large CSS response mark, and lower-edge
   Reply composer. Source: `compositions/claude-launch-completion.html`.
10. `claude-completion-response`: direct-capturable launch-style Claude
   completion-response atom with a full 1920x1080 sparse ivory field, large
   synthetic Anthropic Serif done-state copy, and red CSS response mark,
   without the lower composer or app chrome. Source:
   `compositions/claude-completion-response.html`.
10. `claude-working-composer`: direct-capturable floating Claude composer
   subcomposition with editable attachment chips, attachment count, large
   `Reply...` placeholder, plus, Work in a folder, Research, mic, and running
   stop-state button. Source: `compositions/claude-composer.html`.
11. `claude-thread-core`: direct-capturable Claude working-thread pane with
   topbar, user prompt bubble, folder context strip, assistant response,
   reasoning card, progress rows, local plan preview, and message actions,
   without sidebar, composer, task rail, or outer app shell. Source:
   `compositions/claude-thread-core.html`.
12. `claude-attachment-draft-window`: direct-capturable Claude pre-submit
   folder-context state with Cowork-style mode tabs, New task sidebar,
   attached-folder card, editable attachment chips, draft prompt composer,
   folder chooser popover, and right Progress/Context/Artifacts rail. Source:
   `compositions/claude-attachment-draft.html`.
13. `claude-tool-result-window`: direct-capturable Claude post-action state
   with Cowork-style mode tabs, completed progress rail, large serif completion
   response, completed-change rows, updated-file artifact card, and follow-up
   composer. Source: `compositions/claude-tool-result.html`.
14. `claude-home-launch`: direct-capturable full-frame Claude launch prompt
   stack with four large right-aligned user request bubbles, warm ivory
   background, and lower-left CSS loading mark based on the Sonnet 4.6
   `frame-64s` reference. Source:
   `compositions/claude-home-launch.html`.
15. `claude-home-window`: direct-capturable Claude-only new-chat/home
   subcomposition with dframe-style sidebar, topbar model selector, centered
   Claude mark/name, launch-reference prompt card, Work in a folder affordance,
   attachment plus control, red Let's go button, and starter prompts. Source:
   `compositions/claude-home.html`.
16. `finder-window`: direct-capturable Finder column-view HyperFrames
   subcomposition with 920x436 component boundary, sidebar, toolbar, selected
   project folder, file columns, source-capture text/data, CSS file glyphs, and
   a finite selection/entrance timeline. Source:
   `compositions/finder-window.html`.
17. `codex-app-window`: direct-capturable Codex desktop workbench
   subcomposition with sidebar navigation, recent work, topbar, conversation,
   plan card, tool/evidence card, composer, goal inspector, files, patch
   preview, local metadata, verification rows, and finite progress/active-state
   animation. Source: `compositions/codex-app.html`.
18. `codex-terminal-window`: direct-capturable Codex CLI/Terminal
   subcomposition with macOS terminal chrome, `codex --no-alt-screen` prompt
   line, current command/option inventory, agent goal card, plan rows,
   tool-call transcript, workspace diff panel, verification rows, and finite
   spinner/cursor animation. Source:
   `compositions/codex-terminal.html`.
19. `word-editor-window`: direct-capturable Word-style document editor
   subcomposition with macOS title chrome, AutoSave/search/share controls,
   ribbon tabs, Home command groups, navigation pane, ruler, editable document
   page, tracked change callout, comments/review pane, and status bar. Source:
   `compositions/word-editor.html`.
20. `excel-workbook-window`: direct-capturable Excel-style spreadsheet
   subcomposition with macOS title chrome, ribbon tabs, formula bar, name box,
   table navigator, grid column/row headers, selected range, active cell,
   analyze-data pane, chart preview, sheet tabs, and status calculations.
   Source: `compositions/excel-workbook.html`.
21. `figma-design-editor-window`: direct-capturable Figma-style design editor
   subcomposition with desktop titlebar, left navigation rail, File/Assets
   sidebar, layer tree, scrollable canvas, selected frame, selected object
   handles, right Design/Prototype properties panel, bottom UI3 toolbar, and
   collaborator/share controls. Source: `compositions/figma-editor.html`.
22. `premiere-video-editor-window`: direct-capturable Premiere-style video
   editor subcomposition with macOS title chrome, workspace tabs,
   Source/Program monitors, Project panel, vertical tools strip, audio meters,
   Properties/Effects panel, source patch buttons, time ruler, multi-track
   timeline, clips with trim handles, snap guides, playhead, waveform rows, and
   editable program graphics. Source: `compositions/premiere-editor.html`.
23. `claude-code-terminal-session-window`: direct-capturable light Claude Code
   terminal-session subcomposition with macOS titlebar, monospaced product
   header, highlighted prompt, edit/tool event rows, running scheming state,
   and lower terminal input area. Source:
   `compositions/claude-code-terminal-session.html`.
24. `figma-onboarding-editor-window`: direct-capturable dark Figma-style
   onboarding editor subcomposition with topbar, Layers/Assets sidebar,
   onboarding layer tree, dark canvas, and two editable mobile onboarding
   frames. Source: `compositions/figma-onboarding-editor.html`.

## Current Motion States

- Intro text and Claude mark entrance.
- Finder and Claude window entrance.
- Folder drag from Finder toward Claude.
- Assistant typing reveal.
- Progress row and todo state changes.
- PowerPoint title, chart, selection, inspector, and speaker-note state changes.
- Browser/app surface entrance and selected-row/sync pulse inside its
  subcomposition.
- (historical, pre-2026-07-02) Claude-only surface entrance, assistant typing
  reveal, grouped reasoning/tool card entrances, active tool spinner, and
  running send-control pulse inside the deleted `compositions/claude-app.html`.
- Claude composed app entrance, component-frame reveal for sidebar, thread
  core, composer, and agent rail, page/sidebar/rail parameter toggles, plus
  subtle thread/composer/rail drift inside the canonical
  `compositions/claude-composed-app.html`.
- (historical, pre-2026-07-02) Claude Code desktop entrance, dark window
  reveal, session rail reveal, transcript/file rows, diff/terminal/task panel
  reveal, view menu reveal, spinner rotation, and active task pulse inside the
  deleted `compositions/claude-code-desktop.html` (folded into
  `claude-composed-app`'s `data-page="code"`).
- Claude Code terminal-session static light panel with highlighted prompt,
  task/event rows, running scheming state, and lower terminal input inside
  `compositions/claude-code-terminal-session.html`.
- Claude sidebar entrance, traffic-light stagger, mode/action reveal, task and
  project row reveal, local-context note reveal, account reveal, and active
  task/readiness pulses inside `compositions/claude-sidebar.html`.
- Claude agent rail entrance, progress-ring stagger, task-row reveal,
  section reveal, and active context pulse inside
  `compositions/claude-agent-rail.html`.
- Claude cinematic reply entrance, response-mark reveal/drift, lower-edge
  composer reveal, and composer control stagger inside
  `compositions/claude-cinematic-reply.html`.
- Claude launch completion entrance, two-paragraph reveal, response-mark
  reveal/drift, and lower-edge composer reveal inside
  `compositions/claude-launch-completion.html`.
- Claude composer entrance, attachment-chip stagger, placeholder reveal,
  composer-control stagger, and running stop-state pulse inside
  `compositions/claude-composer.html`.
- Claude thread core entrance, topbar reveal, user/context/assistant reveal,
  assistant typing mask, reasoning/action/card reveals, command preview reveal,
  message-action reveal, and active tool spinner inside
  `compositions/claude-thread-core.html`.
- Claude home surface entrance, sidebar/topbar reveal, centered Claude mark,
  prompt card/starter prompt reveal, subtle mark pulse, and Let's go button
  emphasis inside `compositions/claude-home.html`.
- Claude home launch entrance, prompt-bubble stagger, lower-left loader reveal,
  loader rotation, and dot pulse inside
  `compositions/claude-home-launch.html`.
- Finder window entrance, sidebar/toolbar reveal, column row reveals, and
  selected-folder emphasis inside `compositions/finder-window.html`.
- Codex app workbench entrance, sidebar/topbar reveal, user/assistant message
  reveal, plan/tool card entrances, inspector section reveal, composer reveal,
  goal progress, and active verification pulse inside
  `compositions/codex-app.html`.
- Codex terminal entrance, CLI session header reveal, plan/transcript/tool-call
  row reveals, patch-preview side pane, verification progress, active spinner,
  and cursor blink inside `compositions/codex-terminal.html`.
- Word editor entrance, ribbon/nav/review pane reveals, title replacement,
  tracked-change/comment/table reveals, and saved-state spinner inside
  `compositions/word-editor.html`.
- Excel workbook entrance, ribbon/formula/sidebar/insights reveals, selected
  range appearance, chart bars, insight rows, and saved-state spinner inside
  `compositions/excel-workbook.html`.
- Figma editor entrance, panel/frame/property reveals, selected-object handles,
  progress-bar edit, comment pin pulse, cursor motion, and Actions toolbar
  highlight inside `compositions/figma-editor.html`.
- Figma onboarding editor static dark design state with topbar/sidebar, two
  mobile onboarding frames, selected Sign Up layer, and dark canvas inside
  `compositions/figma-onboarding-editor.html`.
- Premiere editor entrance, workspace/panel reveals, timeline clip reveals,
  selected-clip trim handles, snap-line reveal, playhead scrub, audio-meter
  pulse, program graphic update, and cursor movement inside
  `compositions/premiere-editor.html`.
- Claude/browser workflow wrapper entrance, browser app plate reveal, Claude
  attached-context-to-thread swap, cursor click, subtle browser drift, and
  foreground Claude working-state emphasis inside
  `compositions/claude-browser-workflow.html`.
- Claude/componentized-browser workflow wrapper entrance, clipped browser app
  reveal, nested composed-Claude shell reveal, cursor click, subtle browser
  drift, and foreground shell emphasis inside
  `compositions/claude-browser-composed-workflow.html`.
- Claude/Finder workflow wrapper entrance, Finder context reveal, Claude thread
  reveal, cursor/folder handoff, click-ring feedback, and foreground Claude
  working-state emphasis inside `compositions/claude-finder-workflow.html`.
- Claude/presentation workflow wrapper entrance, presentation editor reveal,
  Claude thread reveal, cursor/click-ring deck focus, and foreground Claude
  working-state emphasis inside
  `compositions/claude-presentation-workflow.html`.
- Claude/Figma workflow wrapper entrance, Figma editor reveal, Claude thread
  reveal, cursor/click-ring design-object focus, and foreground Claude
  working-state emphasis inside `compositions/claude-figma-workflow.html`.
- Claude Code/Figma workflow wrapper entrance, dark onboarding editor reveal,
  light Claude Code terminal reveal, cursor/click-ring focus transfer, and
  subtle two-window drift inside `compositions/claude-code-figma-workflow.html`.
- Claude/Word workflow wrapper entrance, Word editor reveal, Claude thread
  reveal, cursor/click-ring document focus, and foreground Claude working-state
  emphasis inside `compositions/claude-word-workflow.html`.
- Claude/Excel workflow wrapper entrance, Excel workbook reveal, Claude thread
  reveal, cursor/click-ring chart or formula focus, and foreground Claude
  working-state emphasis inside `compositions/claude-excel-workflow.html`.
- Claude/Premiere workflow wrapper entrance, Premiere editor reveal, Claude
  thread reveal, cursor/click-ring timeline focus, and foreground Claude
  working-state emphasis inside
  `compositions/claude-premiere-workflow.html`.
- Final focus pull to completion card.

## Known Gaps

- Finder internal file/sidebar icons are simplified CSS shapes, not yet
  pixel-matched to macOS. The global cursor, Dock, top-left Apple glyph, and
  presentation app icon now use local-only `macos-web`-informed paths or masks
  when the ignored donor clone is restored.
- Claude shell is a safe hand-built approximation pending sanitized live
  Claude capture. Its current thread/composer/right-rail structure is informed by
  `assistant-ui`, downloaded Claude launch-video frames, and inspected
  `/Applications/Claude.app` dframe/epitaxy token vocabulary, not copied from
  donor or product code. The reusable Claude-only subcomposition now mounts in
  the host workflow, uses a wider desktop-like sidebar, a rebuilt CSS Claude
  mark, reference-focus direct capture mode, improved row glyphs, quieter
  grouped cards, and a subtler active composer. The cinematic launch-style
  answer/composer beat is now split into
  `compositions/claude-cinematic-reply.html`, the reusable prompt-card
  composer is split into `compositions/claude-composer.html`, the task
  rail is split into `compositions/claude-agent-rail.html`, the left
  navigation is split into `compositions/claude-sidebar.html`, and the working
  transcript/tool-use pane is split into `compositions/claude-thread-core.html`;
  `compositions/claude-composed-app.html` reassembles those split components
  into the canonical Claude shell through the local component loader,
  parameterized by `data-page="chat|cowork|code"`, `data-sidebar`/
  `data-rail="on|off"`, and `.theme-dark` (pass 106,
  `docs/prototypes/claude-canonical-shell-pass-106.md`). As of the 2026-07-02
  consolidation all 17 workflow assemblies mount this shell (or
  `claude-chat-pane` for pane-only scenes) instead of the old monolithic
  `claude-app.html` / `claude-chat-shell.html` / `claude-code-desktop.html`
  shells, all three of which were deleted; `compositions/claude-desktop.html`
  remains on disk only as the deprecated pass-100 visual reference the atoms
  were measured against.
  `compositions/claude-browser-composed-workflow.html` now proves that composed
  shell can also be nested into a smaller browser-only workflow, but this is a
  modularity proof rather than a new pixel-parity pass against live Claude.
  Broad legacy host Claude CSS has been removed from `styles/workflow.css`.
- Claude Code desktop coverage (session rail, Code mode, transcript, diff,
  terminal, tasks, view menu, PR summary, model state, compact composer)
  formerly lived in the separate dark `compositions/claude-code-desktop.html`
  shell (informed by extracted frames from the public 2026-04-14 Claude Code
  desktop redesign video); that file was deleted in the 2026-07-02
  consolidation and the code page now lives as `data-page="code"` on the
  canonical `claude-composed-app` shell, still without broader official
  product-frame comparison before claiming pixel parity.
- Claude home/new-chat is now a separate editable subcomposition informed by
  the Sonnet 4.6 launch-frame prompt card and local app dframe/epitaxy token
  vocabulary. It is not yet compared against a sanitized live Claude new-chat
  capture.
- Claude home launch is now a separate editable full-frame prompt stack
  informed by the Sonnet 4.6 `frame-64s` reference. It is frame-matched to the
  downloaded public launch-video crop, but still needs broader official
  product-capture comparison before it should be treated as the only Claude
  opening state.
- Claude launch completion is now a separate editable full-frame done-state
  surface informed by the Sonnet 4.6 `frame-24s` reference. It is
  frame-matched to the downloaded public launch-video crop, but still needs
  broader official product-capture comparison before it should be treated as
  the only Claude completion state.
- Codex desktop workbench is an editable app-style surface informed by safe
  local `codex app --help`, `codex review --help`, Codex app metadata, and
  CodexBar metadata. Computer Use access to the live Codex app is blocked for
  safety, so this component does not claim pixel parity with the current app
  and copies no app assets, screenshots, app code, private sessions, or account
  data.
- Codex terminal is an editable CLI surface informed by safe local
  `codex --version` / `codex --help`, Codex app metadata, and Terminal app
  metadata. It is still not source-captured against a private/live interactive
  Codex session.
- Word editor is a first editable Office document surface informed by
  `ribbon-menu`, Fluent UI, and the PowerPoint component patterns. It is not
  yet source-captured against Microsoft Word.
- Excel workbook is a first editable Office spreadsheet surface informed by
  `ribbon-menu`, Fluent UI, and Office-family component patterns. It is not yet
  source-captured against Microsoft Excel.
- Figma editor is a first editable design-editor surface informed by Figma's
  public UI3/help documentation and local app availability metadata. It has not
  opened or captured a private Figma account/file.
- Premiere editor is a first editable video-editor surface informed by Adobe's
  public Premiere documentation and the MIT `react-timeline-editor` donor for
  track/action geometry. It is not yet source-captured against a local Premiere
  project, and no Premiere app bundle was found in `/Applications` during this
  pass.
- Presentation editor is now donor-informed but still hand-built. Replace
  geometry with source-captured PowerPoint once the app or screenshots are
  available.
- Browser app is now in the render path, but the web app content remains
  generic until a real Airtable/Figma/dashboard target is selected and captured.
- Claude/browser workflow now mounts local app templates into the parent DOM
  through `runtime/backlot-component-loader.js`, which is better for capture
  inspection and editability than visible iframes. It still does not directly
  control child GSAP timelines; a later loader should optionally expose child
  timeline handles to parent scenes.
- Calendar exists as a standalone `macos-web`-informed lab surface, but is not
  yet mounted into the main timeline or compared against a source-captured
  local Calendar app.
- Finder and shared motion primitives are still in the host composition; split
  them next if file size or reuse pressure increases.
