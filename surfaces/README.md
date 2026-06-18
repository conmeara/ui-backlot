# Surfaces

Editable app surfaces for UI Backlot demos live here.

`registry.json` is the agent-facing inventory for all reusable app pieces. It
maps each component or workflow to its source file, HyperFrames import selector,
capture command, capture image, prototype note, source evidence, and
asset/license decision. Validate it with:

```bash
npm run registry:check
```

## Current Surface

- `claude-mac-finder.html`: a 1920x1080 macOS desktop scene with editable Finder,
  Claude, cursor/drag, Dock, and a presentation-editor placeholder.
- `../compositions/mac-menu-bar.html`: a direct-capturable 1920x30 macOS menu
  bar component with app menus, inline Apple glyph mask, CSS Wi-Fi/battery
  controls, and fixed component boundary for wrapper scenes that need Mac
  context without duplicating top-bar HTML/CSS. Claude workflow wrappers that
  need desktop chrome now mount this component instead of carrying local
  menu-bar copies.
- `browser-app-surface.html`: a 1920x1080 macOS browser scene with editable
  donor-informed browser chrome, overlapping tabs, tab/address bar, toolbar
  actions, web app sidebar, metrics, table, right inspector, cursor, and edit
  badge. The mounted HyperFrames version is generated into
  `../compositions/browser-app.html`.
- `calendar-app-surface.html`: a 1920x1080 macOS Calendar lab with editable
  menu bar, desktop, Calendar window chrome, month header controls, 7x6 month
  grid, today marker, events, DayFlow-informed calendar source sidebar, mini
  calendar, event edit card, Dock, cursor, and local-only `macos-web` Calendar
  icon path.
- `../compositions/claude-app.html`: a direct-capturable Claude-only
  HyperFrames subcomposition for videos that need Claude without Finder,
  desktop chrome, or presentation/browser surfaces. The capture uses its
  reference-focus mode for the fuller working thread that workflow wrappers
  mount by default.
- `../compositions/claude-composed-app.html`: a direct-capturable
  componentized Claude app shell that assembles the reusable sidebar, thread
  core, composer, and agent rail through `runtime/backlot-component-loader.js`
  so the shell can be reused without returning to one monolithic Claude file.
- `../compositions/claude-chat-shell.html`: a direct-capturable lean Claude
  chat shell for videos that need sidebar, conversation, and composer context
  without the Cowork/task rail or command-dashboard treatment.
- `../compositions/claude-chat-pane.html`: a direct-capturable lean Claude
  active-chat pane for videos that need only the topbar, message field, and
  composer without sidebar, task rail, browser, Finder, Office, or desktop
  chrome.
- `../compositions/claude-deck-chat-pane.html`: a direct-capturable lean
  Claude deck-update pane for videos that need only the topbar, deck-focused
  message field, attachment chips, and composer without sidebar, task rail,
  browser, Finder, Codex, or desktop chrome.
- `../compositions/claude-prompt-stack.html`: a direct-capturable
  Sonnet-launch-style prompt intake component for videos that need only large
  editable prompt bubbles and a loading mark without Claude app chrome,
  sidebar, composer, browser, Finder, Office, Codex, or desktop context.
- `../compositions/claude-code-desktop.html`: a direct-capturable dark Claude
  Code desktop subcomposition with editable session rail, prompt transcript,
  diff, terminal, tasks, floating view menu, Opus model state, PR summary, and
  compact composer based on the public desktop redesign video frame study.
- `../compositions/claude-code-terminal-session.html`: a direct-capturable
  light Claude Code terminal-session subcomposition based on the public
  Claude Code-to-Figma frame study, for scenes that need the small terminal
  panel without the larger dark desktop shell.
- `../compositions/claude-sidebar.html`: a direct-capturable Claude sidebar
  subcomposition for videos that only need editable workspace navigation,
  mode tabs, task rows, project rows, local-context readiness, and account
  state without the full Claude app shell.
- `../compositions/claude-agent-rail.html`: a direct-capturable Claude
  task/context rail subcomposition for videos that only need editable progress,
  artifacts, selected context, connectors, working files, and local-context
  status without the full Claude app shell.
- `../compositions/claude-cinematic-reply.html`: a direct-capturable
  launch-style Claude reply subcomposition for videos that only need the sparse
  Sonnet 4.6 answer, response mark, and lower-edge composer at full 1920x1080
  launch-frame scale. It mounts the shared `claude-response-mark` primitive.
- `../compositions/claude-launch-completion.html`: a direct-capturable
  launch-style Claude completion subcomposition for videos that need the
  two-line Sonnet 4.6 done-state response, response mark, and lower-edge
  composer at full 1920x1080 launch-frame scale.
- `../compositions/claude-completion-response.html`: a direct-capturable
  launch-style Claude completion-response atom for videos that need only the
  large editable done-state copy and red response mark without the lower
  composer or app chrome. It mounts the shared `claude-response-mark`
  primitive.
- `../compositions/claude-response-mark.html`: a direct-capturable 128x128
  editable Claude response-mark primitive for sparse launch-style reply and
  completion beats. It is hand-authored from public frame-study evidence and
  does not copy an official Claude icon asset.
- `../compositions/claude-composer.html`: a direct-capturable floating Claude
  composer subcomposition for videos that only need the editable prompt card,
  attachment chips, folder/research controls, mic affordance, and running
  stop-state button.
- `../compositions/claude-thread-core.html`: a direct-capturable Claude
  working-thread core subcomposition for videos that only need the editable
  topbar, prompt bubble, context strip, assistant response, reasoning card,
  progress rows, command preview, and message actions.
- `../compositions/claude-conversation.html`: a direct-capturable sparse
  Claude conversation HyperFrames subcomposition for launch-style clips that
  need the large serif response, starburst, user prompt bubbles, and `Reply...`
  composer without the desktop/sidebar app shell.
- `../compositions/claude-home-launch.html`: a direct-capturable full-frame
  Claude launch prompt HyperFrames subcomposition for clips that need the
  Sonnet 4.6-style four-bubble prompt stack and lower-left loading mark
  without the desktop/sidebar app shell.
- `../compositions/claude-home.html`: a direct-capturable Claude new-chat/home
  HyperFrames subcomposition for videos that need the launch-style centered
  Claude mark and first prompt card before a working thread exists.
- `../compositions/claude-attachment-draft.html`: a direct-capturable Claude
  attached-folder draft HyperFrames subcomposition for videos that need the
  moment after folder/file context is selected and before the prompt is sent.
- `../compositions/claude-tool-result.html`: a direct-capturable Claude
  completed-tool-result HyperFrames subcomposition for videos that need the
  post-action state after Claude has inspected files and updated a deck.
- `../compositions/finder-window.html`: a direct-capturable Finder
  HyperFrames subcomposition for videos that need the `Launch Deck` folder
  window without importing the full macOS desktop/Finder/Claude lab.
- `../compositions/claude-browser-workflow.html`: a lean HyperFrames assembly
  surface that uses the reusable macOS menu bar, browser app, Claude
  attached-folder draft, and Claude working-thread components for videos that
  do not need Finder, PowerPoint, or the full main workflow. Use
  `capture:claude-browser-workflow` for the attached-context beat and
  `capture:claude-browser-thread-workflow` for the active working-thread beat.
- `../compositions/claude-browser-composed-workflow.html`: a lean HyperFrames
  assembly surface that uses the reusable macOS menu bar, browser app, and the
  componentized Claude shell. It exercises nested
  `runtime/backlot-component-loader.js` mounts so a video can import the full
  Claude shell while keeping sidebar, thread, composer, and rail as separately
  editable components.
- `../compositions/claude-browser-chat-workflow.html`: a lean HyperFrames
  assembly surface that uses only the reusable macOS menu bar, browser app, and
  lean Claude chat shell for simple desktop Claude-plus-browser demos that
  should not import the task rail, Finder, Office, Codex terminal, or the full
  desktop workflow.
- `../compositions/claude-browser-chat-pane-workflow.html`: a lean HyperFrames
  assembly surface that uses only the reusable macOS menu bar, browser app, and
  Claude chat pane for the smallest desktop Claude-plus-browser demos that do
  not need the sidebar.
- `../compositions/claude-conversation-browser-workflow.html`: a lean
  HyperFrames assembly surface that uses the reusable macOS menu bar, browser
  app, and sparse Claude conversation components for launch-style clips that do
  not need the desktop Claude app shell, Finder, PowerPoint, or the full main
  workflow.
- `../compositions/claude-launch-browser-workflow.html`: a lean HyperFrames
  assembly surface that uses the reusable macOS menu bar, browser app, split
  `claude-prompt-stack`, and split `claude-completion-response` components for
  prompt-to-completion launch-style clips that do not need Finder, Office,
  Codex terminal, or the full desktop lab.
- `../compositions/claude-finder-workflow.html`: a lean HyperFrames assembly
  surface that uses the reusable macOS menu bar, Finder window, Claude
  attached-folder draft, and Claude working-thread components for file/folder
  handoff clips that do not need browser, PowerPoint, or the full main
  workflow. Use
  `capture:claude-finder-workflow` for the attached-folder handoff beat and
  `capture:claude-finder-thread-workflow` for the active working-thread beat.
- `../compositions/claude-codex-terminal-workflow.html`: a lean HyperFrames
  assembly surface that uses the reusable macOS menu bar, Claude
  working-thread component, and Codex CLI/Terminal component for command-line
  agent workflow clips that do not need browser, Finder, Office, or the full
  main workflow.
- `../compositions/claude-presentation-workflow.html`: a lean HyperFrames
  assembly surface that uses the reusable macOS menu bar, Claude
  working-thread component, and the PowerPoint-like presentation editor for
  deck-update clips that do not need browser, Finder, Codex terminal, or the
  full main workflow.
- `../compositions/claude-presentation-chat-pane-workflow.html`: a lean
  HyperFrames assembly surface that uses only the reusable macOS menu bar,
  deck-specific Claude chat pane, and the PowerPoint-like presentation editor
  for short deck-update clips that do not need the Claude sidebar, task rail,
  browser, Finder, Codex terminal, or the full main workflow.
- `../compositions/claude-figma-workflow.html`: a lean HyperFrames assembly
  surface that uses the reusable macOS menu bar, Claude working-thread
  component, and the Figma-style design editor for design handoff and
  frame-editing clips that do not need browser, Finder, Office, Codex terminal,
  Premiere, or the full main workflow.
- `../compositions/claude-code-figma-workflow.html`: a lean HyperFrames
  assembly surface that uses only the light Claude Code terminal-session
  component and dark Figma onboarding editor for reference-style
  Claude Code-to-design clips that do not need the warm Claude chat shell,
  Finder, browser, Office, Codex terminal, Premiere, or the full main workflow.
- `../compositions/claude-word-workflow.html`: a lean HyperFrames assembly
  surface that uses the reusable macOS menu bar, Claude working-thread
  component, and the Word-style document editor for drafting, comment, and
  tracked-change clips that do not need browser, Finder, PowerPoint, Excel,
  Figma, Premiere, Codex terminal, or the full main workflow.
- `../compositions/claude-excel-workflow.html`: a lean HyperFrames assembly
  surface that uses the reusable macOS menu bar, Claude working-thread
  component, and the Excel-style workbook for spreadsheet, formula, and
  chart-range clips that do not need browser, Finder, PowerPoint, Word, Figma,
  Premiere, Codex terminal, or the full main workflow.
- `../compositions/claude-premiere-workflow.html`: a lean HyperFrames assembly
  surface that uses the reusable macOS menu bar, Claude working-thread
  component, and the Premiere-style video editor for timeline review, trim,
  graphics, and export clips that do not need browser, Finder, Office, Figma,
  Codex terminal, or the full main workflow.
- `../compositions/codex-app.html`: a direct-capturable Codex desktop
  workbench HyperFrames subcomposition for agent planning, tool/evidence,
  file/patch, and verification workflow scenes that do not need Terminal,
  Claude, Finder, browser, Office, Figma, or Premiere surfaces.
- `../compositions/codex-terminal.html`: a direct-capturable Codex
  CLI/Terminal HyperFrames subcomposition for command-line agent workflow
  scenes.
- `../compositions/word-editor.html`: a direct-capturable Word-style document
  editor HyperFrames subcomposition for document editing, comments, and tracked
  change workflow scenes.
- `../compositions/excel-workbook.html`: a direct-capturable Excel-style
  workbook HyperFrames subcomposition for spreadsheet, formula, chart, and
  analyze-data workflow scenes.
- `../compositions/figma-editor.html`: a direct-capturable Figma-style design
  editor HyperFrames subcomposition for frame editing, selection handles,
  properties-panel, and design-handoff workflow scenes.
- `../compositions/figma-onboarding-editor.html`: a direct-capturable dark
  Figma-style onboarding editor HyperFrames subcomposition for Claude
  Code-to-Figma scenes with mobile onboarding frames.
- `../compositions/premiere-editor.html`: a direct-capturable Premiere-style
  video editor HyperFrames subcomposition for source/program monitor, project
  bin, tools, timeline, properties, audio-meter, and clip-trimming workflow
  scenes.

Useful captures:

```bash
npm run capture:surface
npm run capture:claude-app
npm run capture:claude-composed-app
npm run capture:claude-chat-shell
npm run capture:claude-chat-pane
npm run capture:claude-deck-chat-pane
npm run capture:claude-prompt-stack
npm run capture:claude-code-desktop
npm run capture:claude-sidebar
npm run capture:claude-agent-rail
npm run capture:claude-cinematic-reply
npm run capture:claude-launch-completion
npm run capture:claude-completion-response
npm run capture:claude-response-mark
npm run capture:claude-composer
npm run capture:claude-thread-core
npm run capture:claude-conversation
npm run capture:claude-home
npm run capture:claude-home-launch
npm run capture:claude-attachment-draft
npm run capture:claude-tool-result
npm run capture:claude-code-terminal-session
npm run capture:claude-browser-workflow
npm run capture:claude-browser-thread-workflow
npm run capture:claude-browser-composed-workflow
npm run capture:claude-browser-chat-workflow
npm run capture:claude-browser-chat-pane-workflow
npm run capture:claude-conversation-browser-workflow
npm run capture:claude-launch-browser-workflow
npm run capture:claude-launch-browser-workflow-prompt
npm run capture:claude-finder-workflow
npm run capture:claude-finder-thread-workflow
npm run capture:claude-codex-terminal-workflow
npm run capture:claude-presentation-workflow
npm run capture:claude-presentation-chat-pane-workflow
npm run capture:claude-figma-workflow
npm run capture:claude-code-figma-workflow
npm run capture:claude-word-workflow
npm run capture:claude-excel-workflow
npm run capture:claude-premiere-workflow
npm run capture:codex-app
npm run capture:finder-window
npm run capture:codex-terminal
npm run capture:word-editor
npm run capture:excel-workbook
npm run capture:figma-editor
npm run capture:figma-onboarding-editor
npm run capture:premiere-editor
npm run capture:presentation-editor
npm run capture:finder
npm run capture:browser-app
npm run capture:calendar
npm run capture:mac-menu-bar
npm run compare:finder
npm run compare:finder-window
```

`claude-mac-finder.html?mode=finder` renders only the Finder window at its
captured CSS size. The capture script uses `--scale 2` for that mode so the
output matches the Retina source screenshot resolution.

## Source Status

- Finder: rebuilt from the synthetic `Launch Deck` Finder window capture and
  Computer Use accessibility tree. The new `../compositions/finder-window.html`
  component extracts the stable Finder window into a reusable 920x436
  HyperFrames subcomposition with its own capture and source-comparison sheet.
- Claude: hand-built safe shell for now. `compositions/claude-app.html` is the
  reusable Claude-only component boundary, using static reference media,
  inspected local app dframe/epitaxy token vocabulary, public Claude Cowork
  layout evidence, and the installed app bundle as reference context for mark
  and shell geometry. The current thread pass keeps the desktop sidebar and
  task rail but makes them lighter, gives the central transcript more width,
  enlarges the reference-style serif response, softens reasoning/action/command
  cards, and makes the composer read more like the launch-reference prompt
  object while remaining editable. A sanitized new-chat capture should
  replace/confirm its geometry before it becomes the final Claude primitive.
- Claude composed app: local component-loader assembly of the split Claude
  pieces. It mounts `claude-sidebar`, `claude-thread-core`,
  `claude-composer`, and `claude-agent-rail` into one editable app shell so
  videos can use a full Claude view while preserving independently reusable
  child components.
- Claude sidebar: hand-built safe left-nav component extracted from the
  current working-thread reconstruction. It keeps workspace navigation, mode
  switch, active task rows, project rows, local-folder readiness, and account
  state editable without importing the thread, composer, right rail, or app
  window.
- Claude home/new-chat: hand-built safe home-state shell. It uses the Sonnet
  4.6 launch-frame prompt card and local Claude dframe/epitaxy vocabulary for a
  centered first-prompt state. It copies no Claude code or app assets.
- Claude home launch: hand-built safe full-frame launch prompt stack. It uses
  the Sonnet 4.6 `frame-64s` reference geometry for four large user request
  bubbles and a small lower-left CSS loading mark. It copies no Claude code,
  screenshots, video frames, private data, donor code, or app assets.
- Claude launch completion: hand-built safe full-frame launch completion state.
  It uses the Sonnet 4.6 `frame-24s` reference geometry for the two-line done
  response, red response mark, and lower-edge `Reply...` composer. It copies no
  Claude code, screenshots, video frames, private data, donor code, or app
  assets.
- Claude sparse conversation: hand-built safe conversation-only surface. It
  translates the Sonnet 4.6 launch reference into editable HTML/CSS with a large
  serif response, right-aligned user bubbles, red starburst, and compact
  `Reply...` composer. It copies no Claude code, screenshots, private data, or
  app assets.
- Claude composer: hand-built safe prompt-card component extracted from the
  current working-thread reconstruction so wrapper videos can reuse attachment
  chips, Work in a folder, Research, mic, and running stop-state controls
  without importing sidebar, transcript, task rail, or answer content.
- Claude thread core: hand-built safe central-pane component extracted from
  the current working-thread reconstruction so wrapper videos can reuse the
  topbar, prompt bubble, context strip, assistant response, reasoning card,
  progress rows, command preview, and message actions without importing
  sidebar, composer, task rail, or outer app window.
- Claude agent rail: hand-built safe status/context sidecar extracted from the
  current Cowork-style working-thread reconstruction so videos can reuse task
  progress, artifacts, connector state, local context, and working-file rows
  without importing the full Claude shell or transcript.
- Claude attachment/draft: hand-built safe folder-context state. It now uses
  the same 1180x780 Cowork-style shell as the working-thread component, with
  mode tabs, New task language, attached-folder card, editable attachment
  chips, folder-context popover, draft composer, and a right context rail.
- Claude tool/result: hand-built safe completed-work thread state. It now uses
  the same 1180x780 Cowork-style shell, large serif completion response,
  editable completed-change rows, an updated-file artifact card, follow-up
  composer, and a right completed-progress/context rail.
- Claude/browser workflow: code-native wrapper that composes the local browser
  app, Claude attached-folder draft, and Claude working-thread surfaces with a
  parent GSAP timeline and `runtime/backlot-component-loader.js`. It copies no
  app code or media assets; the loader clones component template roots into the
  parent DOM so captures can inspect the child surfaces directly.
- Claude sparse-conversation/browser workflow: code-native wrapper that
  composes the local browser app and sparse Claude conversation surface with a
  parent GSAP timeline and `runtime/backlot-component-loader.js`. It is designed
  for Sonnet-launch-style clips where the browser app is background context and
  the foreground Claude UI should be the airy response canvas rather than the
  full desktop/sidebar shell.
- Claude/Finder workflow: code-native wrapper that composes only the Finder,
  Claude attachment-draft, and Claude working-thread components with
  parent-owned cursor, click ring, and drag-chip choreography. It copies no app
  code or media assets and avoids the full desktop/browser/PowerPoint scene for
  focused file handoff videos.
- Claude/presentation workflow: code-native wrapper that composes only the
  Claude working-thread component and the PowerPoint-like presentation editor
  with parent-owned menu-bar context, cursor, click ring, and focus
  choreography. It avoids browser, Finder, Codex terminal, and the full
  desktop lab for focused deck-update videos.
- Claude deck chat pane: hand-built safe deck-update pane extracted from the
  lean Claude chat-pane pattern. It keeps the active topbar, deck prompt
  bubbles, large serif completion, deck attachment chips, and composer editable
  without importing sidebar, task rail, browser, Finder, Codex, or desktop
  chrome.
- macOS menu bar: hand-built reusable component informed by `macos-web`
  TopBar/MenuBar structure and current Backlot wrappers. It keeps the app
  menus, inline Apple glyph, Wi-Fi, battery, and time editable without
  requiring a full macOS desktop lab or a missing donor icon file.
- Claude/presentation chat-pane workflow: code-native wrapper that composes
  only the reusable macOS menu bar, deck-specific Claude chat pane, and the
  PowerPoint-like presentation editor with parent-owned cursor, click ring,
  and focus choreography. It avoids the heavier Claude sidebar/task rail,
  browser, Finder, Codex terminal, and full desktop lab for short deck-update
  clips.
- Claude/Figma workflow: code-native wrapper that composes only the Claude
  working-thread component and the Figma-style design editor with parent-owned
  menu-bar context, cursor, click ring, and focus choreography. It avoids
  browser, Finder, Office, Codex terminal, Premiere, and the full desktop lab
  for focused design handoff or frame-editing videos.
- Claude/Word workflow: code-native wrapper that composes only the Claude
  working-thread component and the Word-style document editor with parent-owned
  menu-bar context, cursor, click ring, and focus choreography. It avoids
  browser, Finder, PowerPoint, Excel, Figma, Premiere, Codex terminal, and the
  full desktop lab for focused document drafting or review videos.
- Claude/Excel workflow: code-native wrapper that composes only the Claude
  working-thread component and the Excel-style workbook with parent-owned
  menu-bar context, cursor, click ring, and focus choreography. It avoids
  browser, Finder, PowerPoint, Word, Figma, Premiere, Codex terminal, and the
  full desktop lab for focused spreadsheet, formula, chart-range, and workbook
  review videos.
- Presentation editor: PowerPoint-like mounted composition with editable
  titlebar collaboration, ribbon groups, thumbnail rail, slide rulers/guides,
  selected-object handles, notes/status/view controls, and formatting/comment
  pane. Source-captured PowerPoint geometry is still pending.
- Browser/app: code-native lab surface for future web-workflow demos. It is not
  a clone of StoreDesk or any real product. Its browser chrome now borrows
  geometry and behavior ideas from `react-chrome-tabs` and
  `react-browser-components` without vendoring those components. The lab
  remains full-frame for capture; the composition version crops to the browser
  window and mounts into the main render as a background app plate.
- Calendar: code-native lab surface adapted from `macos-web` Calendar geometry:
  titlebar/main-area split, month/year header, small rounded controls, Monday
  first weekday row, 42-cell month grid, muted weekends, and red today marker.
  It also adapts `dayflow-js/calendar` structure for a mini calendar, calendar
  source list, drag target hint, and event edit card.
- Codex terminal: code-native macOS Terminal/Codex CLI composition. It uses
  `DESIGN.md`, safe local `codex --version` / `codex --help` output, Codex app
  metadata, and local Terminal metadata as reference context. The current pass
  shows a `codex --no-alt-screen` prompt, current command/option inventory, and
  a tighter terminal scrollback, with no Apple, OpenAI, app, or private session
  assets copied.
- Word editor: code-native Office document editor composition. It translates
  `ribbon-menu`, Fluent UI, and the existing PowerPoint component patterns into
  editable HTML/CSS without copying Microsoft assets.
- Excel workbook: code-native Office spreadsheet composition. It translates
  `ribbon-menu`, Fluent UI, and Office-family component patterns into editable
  HTML/CSS without copying Microsoft assets or private workbook data.
- Figma editor: code-native design editor composition. It translates Figma
  public help-center/UI3 documentation into editable HTML/CSS without opening a
  private Figma account/file or copying Figma app code/assets.
- Premiere editor: code-native video editor composition. It translates Adobe's
  public Premiere documentation and MIT `react-timeline-editor` timeline
  patterns into editable HTML/CSS without copying Adobe code/assets, opening a
  private Premiere project, or importing donor runtime code.

## Rule

Use screenshots as reference plates, not as final UI. Text, layout, colors, and
states should remain editable HTML/CSS unless a temporary plate is explicitly
called out.
