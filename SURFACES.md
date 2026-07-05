# UI Surface Spec

## Current Target Surface Kit

1. `mac-desktop`: Sonoma/Tahoe-style wallpaper, menu bar, desktop space, and
   app-window shadows.
1. `mac-menu-bar`: reusable editable 1920x30 macOS menu bar component with
   app menus, Apple glyph, and right-side Wi-Fi/battery/time controls.
2. `finder-window`: real Finder sidebar, toolbar, path/search controls, file
   list/grid states, and selection/drag states.
3. `claude-window`: Claude desktop or web app shell, conversation column,
   message stack, composer, attachments/tool-use affordances, and project/file
   context.
4. `powerpoint-window`: PowerPoint editing chrome, ribbon/toolbar, slide
   thumbnail rail, slide canvas, comments/inspector areas, and selected object
   affordances.
5. `cursor`: black macOS pointer with hover, click, select, drag, and drop
   states.
6. `agent-status`: Claude/Codex progress rows, tool call chips, and file/action
   status.
7. `window-choreography`: app switching, window focus, sheet/modal entrances,
   and depth/focus states.
8. `browser-app-window`: editable browser chrome and web app surface for future
   website/SaaS demos.
9. `calendar-window`: editable macOS Calendar surface for scheduling,
   coordination, and desktop-app workflow scenes.
10. `codex-terminal-window`: editable Terminal/Codex CLI surface for command
    line agent-workflow scenes.
11. `word-editor-window`: editable Word-style document editor surface for
    document editing, review, comments, and tracked-change workflow scenes.
12. `excel-workbook-window`: editable Excel-style spreadsheet surface for grid,
    formula, chart, analyze-data, and workbook workflow scenes.
13. `figma-design-editor-window`: editable Figma-style design editor surface
    for design handoff, frame editing, selection, properties-panel, and
    Claude-to-design workflow scenes.
14. `premiere-video-editor-window`: editable Premiere-style video editor
    surface for timeline editing, source/program monitoring, clip trimming,
    captions/graphics, color/audio/effects review, and Claude-to-video
    workflow scenes.
15. `claude-code-terminal-session-window`: editable light Claude Code terminal
    panel for launch-video-style agent workflow scenes.
16. `figma-onboarding-editor-window`: editable dark Figma onboarding editor
    surface for Claude Code-to-design workflow scenes.
17. `claude-prompt-stack`: editable Sonnet-launch-style prompt intake surface
    with oversized user bubbles and a lower-left loading mark for clips that
    need only Claude's prompt rhythm without app chrome.
18. `claude-completion-response`: editable Sonnet-launch-style completion
    response surface with large serif copy and the red response mark, without
    the lower composer or app chrome.
19. `claude-response-mark`: editable shared 128x128 Claude response-mark atom
    used by sparse launch-style Claude reply and completion surfaces.
20. `claude-deck-chat-pane`: editable deck-update Claude pane with topbar,
    prompt bubbles, large serif completion, deck attachment chips, and composer
    controls for lightweight Claude-plus-PowerPoint clips.
21. `claude-presentation-chat-pane-workflow`: editable lightweight
    Claude-plus-PowerPoint assembly that imports only the deck chat pane and
    the presentation editor.

## Current Prototype

`index.html` is the current renderable HyperFrames composition.
`surfaces/registry.json` is the machine-readable surface inventory for agents:
it lists each reusable component/workflow, its source file, import selector,
capture command, latest capture artifact, prototype note, source evidence, and
asset/license decision. Run `npm run registry:check` after adding or moving a
surface.
`compositions/mac-menu-bar.html` is the reusable macOS menu bar component for
wrappers that need Mac context without duplicating top-bar HTML/CSS or
importing the full desktop lab. As of pass 091, the Claude workflow wrappers
that need desktop chrome mount this component instead of carrying local
menu-bar copies.
`compositions/claude-composed-app.html` is **the canonical Claude shell**: the
reusable componentized Claude shell that assembles the standalone sidebar,
thread core, composer, and agent rail components through
`runtime/backlot-component-loader.js`, parameterized by
`data-page="chat|cowork|code"`, `data-sidebar`/`data-rail="on|off"` toggles,
and `.theme-dark`. All 17 workflow assemblies mount this shell (or
`claude-chat-pane` for pane-only scenes) as of the 2026-07-02 consolidation.
The older monolithic `compositions/claude-app.html` (first reusable
Claude-only sub-composition) and `compositions/claude-chat-shell.html` (lean
chat-only shell without the Cowork/task rail) were deleted in that
consolidation; `compositions/claude-desktop.html` remains on disk only as the
deprecated pass-100 visual reference the canonical shell's atoms were
fidelity-matched against.
`compositions/claude-chat-pane.html` is the reusable lean Claude active-chat
pane for clips that need only the topbar, conversation, and composer without
sidebar or task rail.
`compositions/claude-deck-chat-pane.html` is the reusable lean Claude
deck-update pane for PowerPoint-style clips that need only the topbar,
deck-focused conversation, attachment chips, and composer without sidebar, task
rail, browser, Finder, Codex, or desktop chrome.
`compositions/claude-prompt-stack.html` is the reusable full-frame
Sonnet-launch-style prompt intake component for clips that need only the large
right-aligned prompt bubbles and loading mark without Claude app chrome,
sidebar, composer, browser, Finder, Office, Codex, or desktop context.
`compositions/claude-code-desktop.html` (deleted, 2026-07-02 consolidation)
was the reusable dark Claude Code desktop component with a session rail,
transcript, diff, terminal, tasks, view menu, model state, and compact
composer based on the public Claude Code desktop redesign video frame study;
that coverage now lives as `data-page="code"` on the canonical
`compositions/claude-composed-app.html` shell.
`compositions/claude-code-terminal-session.html` is the reusable light Claude
Code terminal-session component based on the public Claude Code-to-Figma frame
study, for clips that need the small reference-style terminal panel without the
larger dark desktop shell.
`compositions/claude-sidebar.html` is the reusable Claude left navigation
component for clips that need workspace, mode, task, project, and account
context without the full Claude app shell.
`compositions/claude-agent-rail.html` is the reusable Claude task/context rail
component for clips that need progress, artifacts, selected context,
connectors, working files, or local-context status without the full Claude app
shell.
`compositions/claude-cinematic-reply.html` is the reusable full-frame
Sonnet-launch-style answer/composer component for standalone Claude reply beats
that do not need the app sidebar, task rail, or tool cards. It mounts the
shared `compositions/claude-response-mark.html` primitive for the red response
mark.
`compositions/claude-launch-completion.html` is the reusable full-frame
Sonnet-launch-style completion component for standalone Claude done-state beats
with the two-line response, red response mark, and lower-edge `Reply...`
composer.
`compositions/claude-completion-response.html` is the reusable full-frame
completion-response atom for clips that need only the large serif done-state
copy and red response mark without the lower composer, app chrome, sidebar,
browser, Finder, Office, Codex, or desktop context. It mounts the shared
`compositions/claude-response-mark.html` primitive.
`compositions/claude-response-mark.html` is the reusable 128x128 editable
Claude response-mark primitive for sparse launch-style reply and completion
beats. It is hand-authored from public frame-study evidence and is not an
official Claude asset.
`compositions/claude-composer.html` is the reusable floating Claude composer
component for clips that need only the editable prompt card, attachment chips,
folder/research controls, mic affordance, and running stop-state button.
`compositions/claude-thread-core.html` is the reusable Claude working-thread
core component for clips that need the transcript, context strip, reasoning
card, progress rows, and local preview without the sidebar, composer, rail, or
outer app shell.
`compositions/claude-conversation.html` is the reusable sparse Claude
conversation canvas for launch-style clips that need the large serif response,
starburst, user bubbles, and `Reply...` composer without the desktop/sidebar
app shell.
`compositions/claude-home-launch.html` is the reusable full-frame Claude launch
prompt stack for clips that need the Sonnet 4.6-style four-bubble prompt
sequence and lower-left loading mark without the desktop/sidebar app shell.
`compositions/claude-home.html` is the reusable Claude new-chat/home
sub-composition and direct-capturable component for scenes that need the
launch-style first prompt card rather than an active working thread.
`compositions/claude-attachment-draft.html` is the reusable Claude
attached-folder draft sub-composition for scenes where a user has selected
folder/file context but has not yet sent the prompt.
`compositions/claude-tool-result.html` is the reusable Claude completed-work
sub-composition for scenes that need the post-action state after Claude has
inspected files, updated an artifact, and returned a completion summary.
`compositions/finder-window.html` is the reusable Finder-only
sub-composition and direct-capturable component for scenes that need the
`Launch Deck` folder without importing the full macOS desktop scene.
`compositions/presentation-editor.html` is the mounted PowerPoint-like editor
sub-composition used by the main workflow.
`compositions/browser-app.html` is the mounted browser/app sub-composition used
as an intro/background plate in the main workflow.
`compositions/claude-browser-workflow.html` is a lean wrapper composition that
imports the reusable macOS menu bar, browser app, Claude attached-folder draft,
and Claude working-thread surfaces, proving that short clips can be assembled
without the full desktop, Finder, or PowerPoint workflow. It supports both
`capture:claude-browser-workflow` for the attached-context beat and
`capture:claude-browser-thread-workflow` for the active working-thread beat.
`compositions/claude-browser-composed-workflow.html` is a lean wrapper
composition that imports the reusable macOS menu bar, browser app, and the
componentized Claude shell, proving nested component-loader assembly for short
clips that need a full Claude shell without Finder, PowerPoint, or the legacy
monolithic Claude surface.
`compositions/claude-browser-chat-workflow.html` is a lean wrapper composition
that imports only the reusable macOS menu bar, browser app, and lean Claude
chat shell, giving demos a desktop Claude-plus-browser path that avoids the
Cowork/task rail.
`compositions/claude-browser-chat-pane-workflow.html` is a lean wrapper
composition that imports only the reusable macOS menu bar, browser app, and
Claude chat pane, giving demos the smallest desktop Claude-plus-browser path
when no sidebar is needed.
`compositions/claude-conversation-browser-workflow.html` is a lean wrapper
composition that imports the reusable macOS menu bar, browser app, and sparse
Claude conversation canvas, proving that launch-style Claude response clips can
pair with a browser background without the desktop Claude app shell.
`compositions/claude-launch-browser-workflow.html` is a lean wrapper
composition that imports the reusable macOS menu bar, browser app, split
`claude-prompt-stack`, and split `claude-completion-response` components,
proving that prompt-to-completion launch-style clips can reuse browser context
without Finder, Office, Codex terminal, or the full desktop lab. It supports
`capture:claude-launch-browser-workflow-prompt` for the prompt beat and
`capture:claude-launch-browser-workflow` for the completion beat.
`compositions/claude-finder-workflow.html` is a lean wrapper composition that
imports the reusable macOS menu bar, Finder window, Claude attached-folder
draft, and Claude working-thread surfaces, proving that file/folder handoff
clips can be assembled without browser, PowerPoint, or the full desktop
workflow. It supports both `capture:claude-finder-workflow` for the
attached-folder handoff beat and `capture:claude-finder-thread-workflow` for
the active working-thread beat.
`compositions/claude-codex-terminal-workflow.html` is a lean wrapper
composition that imports the reusable macOS menu bar, Claude working-thread
component, and Codex CLI/Terminal component, proving that command-line agent
workflow clips can be assembled without browser, Finder, Office, or the full
desktop workflow.
`compositions/claude-presentation-workflow.html` is a lean wrapper composition
that imports the reusable macOS menu bar, Claude working-thread component, and
PowerPoint-like presentation editor, proving that deck-update clips can be
assembled without browser, Finder, Codex terminal, or the full desktop
workflow.
`compositions/claude-presentation-chat-pane-workflow.html` is a lean wrapper
composition that imports only the reusable macOS menu bar, deck-specific Claude
chat pane, and PowerPoint-like presentation editor, proving that short
deck-update clips can avoid the heavier Claude sidebar/task-rail app while
still using editable component surfaces.
`compositions/claude-figma-workflow.html` is a lean wrapper composition that
imports the reusable macOS menu bar, Claude working-thread component, and
Figma-style design editor, proving that design handoff and frame-editing clips
can be assembled without browser, Finder, Office, Codex terminal, Premiere, or
the full desktop workflow.
`compositions/claude-code-figma-workflow.html` is a lean wrapper composition
that imports only the light Claude Code terminal-session component and the dark
Figma onboarding editor, matching the public Claude Code-to-Figma launch clip
layout without importing the warm Claude chat shell or the full desktop lab.
`compositions/claude-word-workflow.html` is a lean wrapper composition that
imports the reusable macOS menu bar, Claude working-thread component, and
Word-style document editor, proving that drafting, comment, and tracked-change
clips can be assembled without browser, Finder, PowerPoint, Excel, Figma,
Premiere, Codex terminal, or the full desktop workflow.
`compositions/claude-excel-workflow.html` is a lean wrapper composition that
imports the reusable macOS menu bar, Claude working-thread component, and
Excel-style workbook, proving that spreadsheet, formula, chart-range, and
workbook review clips can be assembled without browser, Finder, PowerPoint,
Word, Figma, Premiere, Codex terminal, or the full desktop workflow.
`compositions/claude-premiere-workflow.html` is a lean wrapper composition that
imports the reusable macOS menu bar, Claude working-thread component, and
Premiere-style video editor, proving that timeline review, trim, graphics, and
export clips can be assembled without browser, Finder, Office, Figma, Codex
terminal, or the full desktop workflow.
`compositions/codex-app.html` is the reusable Codex desktop app command-center
sub-composition and direct-capturable component for app-style agent workflow
videos, with an official screenshot-informed light shell and editable thin-line
icon system.
`compositions/codex-terminal.html` is the reusable Codex CLI/Terminal
sub-composition and direct-capturable component for command-line workflow
videos.
`compositions/word-editor.html` is the first reusable Word-style document
editor sub-composition and direct-capturable component for document workflow
videos.
`compositions/excel-workbook.html` is the first reusable Excel-style workbook
sub-composition and direct-capturable component for spreadsheet workflow videos.
`compositions/figma-editor.html` is the first reusable Figma-style design
editor sub-composition and direct-capturable component for design-workflow
videos.
`compositions/figma-onboarding-editor.html` is a dark Figma-style onboarding
editor sub-composition and direct-capturable component based on the public
Claude Code-to-Figma frame study.
`compositions/premiere-editor.html` is the first reusable Premiere-style video
editor sub-composition and direct-capturable component for video-editing
workflow demos.
`surfaces/claude-mac-finder.html` (deleted, 2026-07-02 consolidation) was a
legacy standalone surface lab; `compositions/finder-window.html` is the
reusable Finder component.
`surfaces/browser-app-surface.html` (deleted, 2026-07-02 consolidation; it was
an orphan file, not in the registry) was the standalone browser/app surface
lab; browser-app captures now come from the mounted
`compositions/browser-app.html` sub-composition.
`surfaces/calendar-app-surface.html` is the standalone macOS Calendar surface
lab.

- Finder is source-derived from the synthetic `Launch Deck` capture. It now
  exists both as the older isolated `?mode=finder` surface and as the reusable
  `compositions/finder-window.html` HyperFrames subcomposition with its own
  capture and source-comparison sheet.
- The global macOS shell is now more directly informed by `macos-web`: 1.8rem
  menu bar, centered glass Dock, local-only donor app icon paths, tighter
  traffic lights, and stronger window shadows.
- Claude is an editable safe shell pending a sanitized live Claude capture.
  The reusable Claude-only subcomposition now combines dframe/epitaxy-inspired
  sidebar, transcript, topbar, task-card, composer, and public Claude Cowork
  right-rail layout evidence. Its current desktop-thread pass adds Chat/Code/
  Cowork mode tabs, a New task entry point, editable thread context chips,
  reference-focus direct capture mode, a wider paper-like transcript, larger
  serif response, flattened and softened reasoning/action/command cards, a
  subdued Task/Artifacts/Context rail, and a quieter 12-ray CSS Claude mark.
  The sparse cinematic answer/composer state now lives in
  `compositions/claude-cinematic-reply.html` as a full 1920x1080 launch-frame
  primitive, so future scenes can reuse that surface without importing Finder,
  browser, presentation editor chrome, or the desktop Claude app shell.
  The separate `compositions/claude-launch-completion.html` primitive covers
  the two-line launch-video completion state with the lower-edge composer.
- Claude composed app is now **the canonical Claude shell**: it mounts local
  component roots from `claude-sidebar`, `claude-thread-core`,
  `claude-composer`, and `claude-agent-rail`; the shell owns layout and
  choreography, while the child UI stays editable in its own composition file.
  `data-page="chat|cowork|code"` (default cowork), `data-sidebar`/
  `data-rail="on|off"`, and `.theme-dark` parameterize what used to require
  separate pre-baked files. As of the 2026-07-02 consolidation
  (`docs/component-consolidation-audit-2026-07-02.md`,
  `docs/prototypes/claude-canonical-shell-pass-106.md`) all 17 workflow
  assemblies mount this shell instead of the deleted monolithic
  `claude-app.html`, `claude-chat-shell.html`, and `claude-code-desktop.html`
  shells; `compositions/claude-desktop.html` remains only as the deprecated
  pass-100 visual reference the shell's atoms were fidelity-matched against.
- Claude chat pane is the same plain-chat direction split one layer smaller:
  topbar, active conversation, and composer only, for scenes that provide their
  own sidebar, browser, desktop, or window frame. Workflow scenes that need a
  full shell instead mount the canonical Claude composed app above.
- Claude Code desktop coverage — Code mode surface, session rail, prompt
  transcript, diff panel, terminal, task queue, floating view menu, PR
  summary, model state, and compact composer, informed by the public
  2026-04-14 Claude Code desktop redesign video frame study — formerly lived
  in a separate dark app-shell component (`compositions/claude-code-desktop.html`,
  deleted in the 2026-07-02 consolidation). It now lives as `data-page="code"`
  on the canonical Claude composed app shell above.
- Claude sidebar is a separate editable component extracted from the current
  working-thread shell. It keeps traffic lights, CSS Claude mark, Chat/Code/
  Cowork mode switch, New task/Search actions, active task rows, Today,
  Projects, selected-folder readiness, and workspace account state editable
  without importing the central thread, composer, task rail, or app window.
- Claude home/new-chat is a separate editable state using the same safe
  app-bundle vocabulary and the Sonnet 4.6 launch-frame prompt-card treatment:
  centered Claude mark/name, Work in a folder affordance, plus control,
  red Let's go button, and starter prompts. It is designed for intro scenes
  before a working thread exists.
- Claude home launch is a separate editable full-frame prompt stack for the
  Sonnet 4.6 launch reference moment with four right-aligned user request
  bubbles and a lower-left CSS loading mark. It keeps that cinematic opening
  beat reusable without importing the desktop Claude home shell.
- Claude sparse conversation is a separate editable canvas for the launch-video
  crop where Claude appears as a clean response field rather than a desktop app
  window. It uses the Sonnet 4.6 reference frames for large serif response
  scale, right-aligned user prompt bubbles, red starburst placement, and a
  compact `Reply...` composer, while remaining hand-authored HTML/CSS.
- Claude composer is a separate floating prompt-card component extracted from
  the current working-thread reconstruction. It keeps the attachment chips,
  attachment count, large placeholder, plus, Work in a folder, Research, mic,
  and running stop-state controls editable without requiring sidebar,
  transcript, task rail, or answer content.
- Claude thread core is a separate central-pane component extracted from the
  current working-thread reconstruction. It keeps the topbar, user prompt,
  context strip, assistant response, reasoning card, progress rows, local plan
  preview, and message actions editable without requiring sidebar, composer,
  task rail, or outer app window.
- Claude agent rail is a separate task/context sidecar extracted from the
  current Cowork-style working-thread reconstruction. It keeps task progress,
  artifact, context, connector, working-file, and local-context note rows
  editable without requiring the full Claude shell, transcript, or composer.
- Claude attachment/draft is a separate editable state for the file/folder
  handoff beat before Claude starts working. It now uses the same 1180x780
  Cowork-style shell as the working-thread surface: Chat/Code/Cowork mode tabs,
  New task language, attached-folder context card, draft prompt composer,
  folder-context popover, and a right Progress/Context/Artifacts rail so a
  video can show context selection without importing Finder or the full desktop
  wrapper.
- Claude tool/result is a separate editable post-action state using the same
  1180x780 Cowork-style shell, large serif completion response, completed
  change rows, file artifact card, follow-up composer, and right rail for
  completed progress, artifacts, context, and working files. It is designed for
  demo moments after Claude has read local files and changed a deck or app.
- The presentation editor is now a denser PowerPoint-like sub-composition with
  Office-style titlebar collaboration, ribbon groups, slide thumbnails, rulers,
  alignment guides, selected-object handles, speaker notes, status/view/zoom
  controls, and a formatting/comment pane. It has its own internal
  title/chart/selection animation timeline, with source capture still pending
  for exact PowerPoint geometry.
- `?mode=finder` renders the legacy Finder primitive alone for pixel
  comparison; `compositions/finder-window.html` is the newer importable
  HyperFrames component boundary.
- Browser/app surface is code-native and intentionally generic, so it can be
  adapted later to Airtable, Figma web, or internal dashboards without copying a
  fictional reference-video product. Its current browser chrome is informed by
  `react-chrome-tabs` and `react-browser-components`, but remains editable
  hand-authored HTML/CSS. It now exists both as a standalone capture surface and
  as a mounted HyperFrames sub-composition.
- Claude/browser wrapper uses local editable component files through isolated
  `runtime/backlot-component-loader.js` mounts as a modularity proof for future
  videos that need Claude plus a browser and nothing else. It now pairs the
  browser review board with the Claude attached-folder draft before handing off
  to the working thread, so the focused wrapper can show either selected
  context or the refined active Claude thread without importing Finder or the
  full desktop workflow. The wrapper owns only scene choreography, menu-bar
  context, window placement, cursor/click timing, and capture-mode seeking; the
  child app UIs remain editable in their own composition files and appear in
  capture output as real parent-DOM elements.
- Claude sparse-conversation/browser wrapper uses the same loader strategy for
  a launch-style composition: browser review board in the background, sparse
  Claude response canvas in front, and parent-owned menu-bar/cursor timing. It
  gives videos a lighter alternative to the desktop Claude app wrapper when the
  desired reference is the Sonnet 4.6 launch crop rather than a full app window.
- Claude launch/browser wrapper uses the same loader strategy for the full
  prompt-to-completion launch beat: browser review board in the background,
  Claude home-launch prompt stack in front, then Claude launch completion. It
  lets videos use the launch reference rhythm without importing Finder, Office,
  Codex terminal, or the full desktop lab.
- Claude/Finder wrapper uses the same component-loader strategy for a
  file/folder handoff scene. It mounts only the Finder window, Claude
  attachment-draft, and Claude working-thread components, with parent-owned
  menu-bar context, cursor, click ring, and temporary drag chip; it does not
  import browser, PowerPoint, or the older full desktop lab.
- Claude/presentation wrapper uses the same component-loader strategy for a
  deck-update scene. It mounts only the Claude working-thread component and the
  PowerPoint-like presentation editor, with parent-owned menu-bar context,
  cursor, click ring, and focus choreography; it does not import browser,
  Finder, Codex terminal, or the older full desktop lab.
- Claude/Figma wrapper uses the same component-loader strategy for a design
  handoff scene. It mounts only the Claude working-thread component and the
  Figma-style design editor, with parent-owned menu-bar context, cursor, click
  ring, and focus choreography; it does not import browser, Finder, Office,
  Codex terminal, Premiere, or the older full desktop lab.
- Claude/Word wrapper uses the same component-loader strategy for a document
  review scene. It mounts only the Claude working-thread component and the
  Word-style document editor, with parent-owned menu-bar context, cursor, click
  ring, and focus choreography; it does not import browser, Finder, PowerPoint,
  Excel, Figma, Premiere, Codex terminal, or the older full desktop lab.
- Claude/Excel wrapper uses the same component-loader strategy for a workbook
  review scene. It mounts only the Claude working-thread component and the
  Excel-style workbook, with parent-owned menu-bar context, cursor, click ring,
  and focus choreography; it does not import browser, Finder, PowerPoint, Word,
  Figma, Premiere, Codex terminal, or the older full desktop lab.
- Calendar is a `macos-web`-informed editable lab surface with the donor
  titlebar/main-area split, month/year header, rounded controls, Monday-first
  42-cell month grid, weekend treatment, red today marker, and local-only donor
  Calendar icon path. It also borrows DayFlow-style scheduling structure:
  calendar source list, mini calendar, drag/reorder cue, event dots, and event
  edit card. It is not yet mounted into the main workflow.
- Codex desktop app is a hand-authored light-mode command-center surface rebuilt
  against official OpenAI Codex screenshot plates. It now follows the actual app
  shell more closely: pale blue macOS sidebar, New chat/Search/Plugins/
  Automations rows, pinned threads, projects, chats, single top toolbar,
  plain active-thread transcript, change summary card, model/permission
  composer, work-local footer, and code-diff Review pane. It uses official
  Codex screenshots, official docs, safe local `codex --help` / `codex app
  --help` / `codex cloud --help`, and Codex app metadata as reference context.
  Computer Use could not access the live Codex app for safety, so the surface
  still does not claim pixel parity and copies no app assets, screenshot pixels,
  app code, private sessions, or account data.
- Codex terminal is a code-native Terminal/Codex CLI surface for agent-command
  demos. It now uses safe local `codex --version` / `codex --help`, Codex app
  metadata, and macOS Terminal metadata as reference context, with a taller
  1120x840 component frame, `codex --no-alt-screen` prompt, current command/
  option inventory, transcript block, tool-call rows, patch preview, and
  verification pane. It copies no Apple, OpenAI, app, or private session assets.
- Word editor is a code-native Office document editing surface informed by the
  local `ribbon-menu` and Fluent UI donor clones plus the existing
  PowerPoint-like component. It copies no Microsoft code, fonts, or icons.
- Excel workbook is a code-native Office spreadsheet surface informed by the
  local `ribbon-menu` and Fluent UI donor clones plus the Office-family
  component patterns already in the repo. It copies no Microsoft code, fonts,
  icons, or workbook data.
- Figma editor is a code-native design-editor surface informed by Figma's
  public UI3 and help-center documentation plus local app availability metadata.
  It copies no Figma code, fonts, private file contents, or app assets.
- Premiere editor is a code-native video-editing surface informed by Adobe's
  public Premiere documentation and the MIT `react-timeline-editor` donor for
  timeline row/action geometry. It copies no Adobe code, fonts, icons, private
  project contents, app assets, or donor runtime code.
- Pass 097 was a repo-wide realism audit against real applications (live
  Tahoe Finder/menu bar/Calendar captures on this machine plus the existing
  Claude/Codex/Figma/Office reference sets). Font smoothing is now applied
  globally in `styles/backlot-foundation.css`; traffic lights are
  standardized flat 12px `#ff5f57/#febc2e/#28c840`; Finder gained Tahoe
  frosted-inset sidebar, capsule toolbar, and blue focused selection; the
  Claude family matches the 2026-06-18 real Cowork capture (near-invisible
  paper grid, real tool-card anatomy with green monospace request blocks,
  app-scale serif responses, composer disclaimer, avatar initials); the
  Office surfaces use Mac 365 caption-less ribbons; Codex, Figma, Premiere,
  browser, and Calendar received reference-matched chrome passes. See
  `docs/prototypes/full-inventory-realism-audit-pass-097.md`.
- Pass 099 introduced the reusable `fidelity-push` multi-agent workflow
  (`.claude/workflows/fidelity-push.js`): per-family design critique against
  real-app references, file-scoped fixes with capture verification, and
  adversarial before/after judgment. All nine families improved — invented
  controls removed across the board (Claude avatar gutter, Word floating
  toolbar, Chrome "private" pill, Premiere duplicate Export, Figma double
  navigation), content made self-consistent (Excel math, Premiere labels,
  Figma dimensions), and chrome corrected against real captures (transparent
  menu bar with Help, Finder toolbar glyphs, Codex plates). See
  `docs/prototypes/fidelity-push-workflow-pass-099.md`.
- Pass 100 restructured the Claude desktop shell: a single `claude-desktop`
  component now hosts three pages (Chat, Cowork, Code) and supersedes
  `claude-code-desktop` as the desktop shell going forward; `codex-thread-core`
  was added as a standalone, zoomed-in cut of the Codex working-thread body.
  See `docs/prototypes/claude-desktop-shell-restructure-pass-100.md` and
  `docs/prototypes/codex-thread-core-pass-100.md`.
- Pass 106 (2026-07-02 component consolidation) rebuilt
  `compositions/claude-composed-app.html` into **the canonical, parameterized
  Claude shell**, mounting the `claude-sidebar`/`claude-thread-core`/
  `claude-composer`/`claude-agent-rail` atoms via
  `runtime/backlot-component-loader.js` with `data-page="chat|cowork|code"`,
  `data-sidebar`/`data-rail="on|off"`, and `.theme-dark`. All 17 workflow
  assemblies now mount it (or `claude-chat-pane` for pane scenes); the
  monolithic `compositions/claude-app.html`, `compositions/claude-chat-shell.html`,
  `compositions/claude-code-desktop.html`, `surfaces/claude-mac-finder.html`,
  and the orphan `surfaces/browser-app-surface.html` were deleted.
  `compositions/claude-desktop.html` (pass 100) remains only as the
  deprecated visual reference the atoms were fidelity-matched against; its
  `claude-desktop-*` registry entries are marked `status: "deprecated"`. See
  `docs/component-consolidation-audit-2026-07-02.md` and
  `docs/prototypes/claude-canonical-shell-pass-106.md`.
- Reusable primitives are listed in `PRIMITIVES.md`.
- Ten surfaces (`calendar-app`, `finder-window`, `mac-menu-bar`, `browser-app`,
  `codex-app`, `codex-thread-core`, `figma-editor`, `claude-desktop-chat`,
  `claude-desktop-cowork`, `claude-thread-core`) now ship a dark-theme variant
  through a scoped theme-dark class system: each surface's own CSS carries a
  `.theme-dark` token-override block (same markup, same component, just the
  color tokens swapped), and `tools/capture-web-ui.mjs` accepts a
  `--root-class theme-dark` flag that adds that class to the capture root
  before shooting the PNG. Each base surface has a matching
  `capture:<surface>-dark` script and a `<surface>-dark` registry entry so the
  light and dark captures stay independently reproducible without forking the
  underlying composition file.

## First Real Workflow

The first production-quality demo should show Claude on a Mac helping with a
PowerPoint workflow:

1. Start on a Mac desktop with Finder and a presentation/project folder.
2. Open or foreground Claude.
3. Attach or reference a local folder/file from Finder.
4. Claude reasons through the requested presentation update.
5. PowerPoint opens with a real-looking deck and selected slide.
6. The cursor edits text, chart values, or slide structure.
7. Claude reports the completed update.

## Fidelity Levels

- Source-captured: Claude, Finder, and PowerPoint should be captured from real
  local app/browser states whenever possible.
- Code-native: final demo surfaces should be editable HTML/CSS components, not
  flattened screenshots, except for temporary reference plates.
- Reference-only: downloaded Claude videos and extracted frames guide taste,
  pacing, and composition, not app UI structure.

## Current Focus

The active prototype should stay centered on Claude, the Mac desktop/Finder, and
PowerPoint, with the generic browser/app surface used only as a reusable
background/demo-shell proof. Calendar, Codex terminal, Word editor, Excel
workbook, Figma editor, and Premiere editor are now available as additional
modular app primitives for scheduling, command-line, document, spreadsheet,
design, and video-editing workflow scenes. Airtable and other app-specific
surfaces remain future branches after this core lane is convincing.
