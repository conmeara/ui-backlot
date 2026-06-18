# Open-Source UI Donor Repos

Last updated: 2026-06-18.

## Goal Addendum

Use open-source UI projects as reference material and component donors to speed
up high-fidelity editable reconstructions of Claude-on-Mac demo surfaces.

These repos should help us understand geometry, component decomposition,
interaction states, icon treatment, and motion patterns. The final UI Backlot
surfaces still need to be editable HTML/CSS/React/HyperFrames surfaces that fit
our video workflows.

This is now part of the active project goal, not optional background research.
Each major UI fidelity pass should identify the most relevant donor repo,
inspect it for patterns, and document either the adapted improvement or why the
repo was not useful for that surface.

## Guardrails

- Verify license and attribution requirements before copying code, assets, or
  styles into this repo.
- Prefer studying structure, measurements, and interaction patterns over
  vendoring whole apps.
- Keep demo surfaces source-captured first when real apps are available.
- Treat app-specific brands and product UI as reconstruction targets, not as
  permission to redistribute third-party assets.
- Preserve the current focus: Claude on macOS, Finder, and PowerPoint-like
  presentation editing before expanding into browser, Figma, Premiere, or
  Airtable scenes.

## Candidate Repos

| Need | Repo / Library | How To Use It |
|---|---|---|
| macOS desktop, Finder, Dock, windows | [PuruVJ/macos-web](https://github.com/PuruVJ/macos-web) | Mine for macOS desktop structure, Dock behavior, Finder/window chrome, menu bar spacing, wallpaper treatment, and Svelte/SCSS component boundaries. |
| macOS-style React components | [gabrielbull/react-desktop](https://github.com/gabrielbull/react-desktop) | Use as an older but useful reference for macOS window chrome, buttons, sidebars, and desktop UI component decomposition. |
| Claude/chat UI primitives | [assistant-ui](https://github.com/assistant-ui/assistant-ui) | Study thread, composer, attachment, streaming, and tool-call state architecture; restyle any borrowed patterns into Claude-like UI. |
| Browser chrome/tabs | [react-browser-components](https://github.com/EnhancedJax/react-browser-components) | Use for browser-frame structure in future web-app demo scenes. |
| Chrome-style tabs | [react-chrome-tabs](https://github.com/pansinm/react-chrome-tabs) | Use as reference for realistic tab strip behavior, drag/reorder states, and tab sizing. |
| Office/PowerPoint ribbon | [olton/ribbon-menu](https://github.com/olton/ribbon-menu) | Use as a command-ribbon reference for tabs, groups, command density, and selected tab states. |
| Microsoft app components | [Fluent UI Web](https://github.com/microsoft/fluentui) | Use as official Microsoft component reference for Office-like buttons, panes, menus, command bars, and control states. |
| Real PPTX generation | [PptxGenJS](https://github.com/gitbrent/PptxGenJS) | Use later so a video demo and a real generated `.pptx` can share slide data and workflow outputs. |
| AppKit-style web controls | [AppKit-on-the-Web](https://github.com/andrewmcwattersandco/AppKit-on-the-Web) | Evaluate as a macOS control reference for AppKit-like buttons, lists, materials, and interaction details. |
| Modern calendar interactions | [dayflow-js/calendar](https://github.com/dayflow-js/calendar) | Use after the static Calendar surface when we need richer day/week/month/year views, event editing, drag/drop, sidebar calendars, and resource scheduling. |
| React macOS desktop simulator | [Renovamen/playground-macos](https://github.com/Renovamen/playground-macos) | Use as a second React-based reference for desktop state, Dock/menu/window decomposition, Launchpad, Spotlight, and app-window boundaries. |
| Svelte macOS desktop simulator | [esrakllci/macos-portfolio](https://github.com/esrakllci/macos-portfolio) | Use as another permissive macOS shell reference with Dock, menu bar, Finder, Calendar, Notes, action center, traffic lights, and draggable windows. |
| Secondary AI chat/tool cards | [Cognipeer/chat-ui](https://github.com/Cognipeer/chat-ui) | Use as a secondary reference for AI chat message lists, inputs, file uploads, and visible tool-call cards after the `assistant-ui` pass. |
| Video-editor timeline rows | [xzdarcy/react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor) | Use for Premiere-like timeline row/action structure, time-to-pixel transforms, playhead/cursor treatment, action handles, snap guides, and drag/resize states. |

## Current Priority

1. Compare `macos-web`, `react-desktop`, and `AppKit-on-the-Web` against our
   Finder/menu/Dock surfaces and extract concrete styling/geometry ideas.
2. Use `assistant-ui` to improve Claude thread/composer/tool-state structure
   without losing the Claude visual language.
3. Use Fluent UI and `ribbon-menu` to refine the PowerPoint-like ribbon,
   formatting pane, and command density while awaiting a real PowerPoint
   capture.
4. Use `react-browser-components` and `react-chrome-tabs` to keep refining the
   browser lab before it branches into real Airtable/Figma web scenes.
5. Defer `PptxGenJS` until the video prototype needs to emit a real deck from
   the same structured data shown in the editable surface.

## Local Clone Status

Reference clones live in `reference/open-source/`.

- `macos-web` is cloned at commit
  `f0d4d4db147a1e5706bd3262e5aec5a08cef4026` under an MIT license.
- `AppKit-on-the-Web` is cloned at commit
  `7407236851a2a0a20636c7fbb010e5b5f843f7a1` under GPLv2, so use it as
  reference-only unless GPL obligations are intentionally accepted.
- `assistant-ui` is cloned at commit
  `bca6ebe3c5a5d12a1f654cd4b2eeb635c2baec72` under an MIT license.
- `ribbon-menu` is cloned at commit
  `2d695939b068e8cc58945e818b4493b69dda8881` under an MIT license declared
  in `package.json`.
- `fluentui` is cloned at commit
  `672afec62c04eada141116387483d47c13c3da68` under an MIT license. The repo
  notes separate terms for referenced Fluent UI React fonts and icons, so the
  current pass only translates structure and spacing patterns.
- `react-browser-components` is cloned at commit
  `9af4765144246ad0f2a68955fa893b4a9f53d747`. Its `LICENSE` file is MIT but
  `package.json` declares ISC, so treat it as reference-only until the metadata
  mismatch is intentionally resolved.
- `react-chrome-tabs` is cloned at commit
  `929c02083e14c4769b1193bd52de39f805c1d52b` under an MIT license.
- `react-desktop` is cloned at commit
  `bba61374849dec896a9eea321cf4e3f02b3fd4c6` under an MIT license.
- `PptxGenJS` is cloned at commit
  `3c9ec1b687c174952166f6a34b5e87ebf69fa469` under an MIT license.
- `dayflow-calendar` is cloned at commit
  `a6f59063ac46a766cf386a557d04a6ff44bae0c2` under an MIT license.
- `playground-macos` is cloned at commit
  `2c9e82dca487432ad9922ddf9b0a26aadeae81e5` under an MIT license.
- `macos-portfolio` is cloned at commit
  `23fe176c6e49d27edb06df365e11ba14708ea9a9` under an MIT license.
- `cognipeer-chat-ui` is cloned at commit
  `8cf89318f63b1099b8f5e6a7000a39b89ee36eea`. It declares MIT in
  `package.json` but does not include a top-level `LICENSE` file in the
  inspected commit, so treat direct copying cautiously until attribution text is
  confirmed.
- `react-timeline-editor` is cloned at commit
  `4148f4a837dd767ea66807560d05bc7b65c7e578` under an MIT license.

First extracted pattern: `macos-web` Dock structure informed our editable Dock
primitive with app wrappers, open-app indicator dots, a separator, and subtler
glass/inset styling. The code remains hand-authored in UI Backlot rather than a
direct component import.

Latest extracted pattern: `macos-web` menu, Dock, and window components now
inform the main macOS shell more directly: 1.8rem translucent menu bar,
donor-clone Dock icon slots, centered glass Dock geometry, stronger active
window shadows, tighter traffic lights, and local-only app icon URLs that render
when `tools/clone-reference-repos.sh` has restored the ignored donor clone.

Calendar extraction: `macos-web` Calendar now informs
`surfaces/calendar-app-surface.html`. The lab translates the donor
titlebar/main-area split, month/year header, compact rounded previous/today/next
buttons, Monday-first weekday row, 42-cell month grid, muted weekend treatment,
and red today marker into hand-authored editable HTML/CSS. It also uses the
local ignored donor Calendar icon path when the restored clone is present; the
icon asset is not committed.

Calendar interaction extraction: `dayflow-js/calendar` now informs the same
Calendar lab's sidebar and edit affordances. UI Backlot translated DayFlow's
mini calendar, calendar source list, visible calendar colors, drag/reorder
state, event dots, and quick event-edit structure into static editable HTML/CSS
without importing DayFlow runtime code.

Cursor/icon extraction: `macos-web` now provides the local-only normal-select
cursor path, confirms the Apple menu should be treated as an icon glyph, and
informs the right-side menu-bar status controls. UI Backlot translated those
details into editable HTML/CSS surfaces with a donor cursor URL, SVG-mask Apple
glyph, icon-like Control Center/Wi-Fi/battery controls, and a local-only
Keynote icon path for presentation surfaces.

Menu-bar component extraction: `compositions/mac-menu-bar.html` now isolates
the repeated wrapper menu bar into a direct-capturable 1920x30 component. It is
informed by `macos-web` TopBar/MenuBar/TopBarTime structure, but remains
hand-authored and uses an inline Apple glyph mask so wrappers no longer depend
on the missing `macos-web/public/icons/apple.svg` donor path. The component is
now mounted across the Claude workflow wrappers that need desktop chrome,
including browser, Finder, Codex terminal, Office, Figma, Premiere, and the
lighter chat-pane/chat-shell assemblies.

Second extracted pattern: `assistant-ui` grouped message parts and composer
architecture informed the editable Claude shell. The Claude assistant message
now shows static reasoning/action/source groupings, richer tool status rows,
message action dots, attachment count, a subtle active composer state, composer action
chips, and a running-state send/cancel control. The code remains hand-authored
HTML/CSS in UI Backlot.

Claude dframe/epitaxy refinement: the installed `/Applications/Claude.app`
bundle was inspected as reference for safe vocabulary and broad token geometry:
`dframe-root`, `dframe-sidebar`, `epitaxy-transcript-width`,
`epitaxy-composer-width`, `epitaxy-task-card-surface`, 960px transcript width,
48px header height, 280px desktop sidebar intent, 8px row radius, and warm
clay/cream color variables. UI Backlot translated those cues into
`compositions/claude-app.html` without copying Claude code or app assets.

Claude app fidelity follow-up: `compositions/claude-app.html` now uses a wider
260px sidebar within the current 980px component boundary, a rebuilt 10-ray CSS
Claude mark, more plausible sidebar glyphs, lighter selected/new-chat rows,
denser grouped cards, and a quieter active composer state. This remains a
hand-authored approximation pending sanitized live Claude captures.

Finder subcomposition extraction: `compositions/finder-window.html` now splits
the source-captured `Launch Deck` Finder window out of the older full desktop
surface. It preserves the 920x436 component boundary, 162px sidebar, 52px
toolbar, 245px column grid, source text/files, and hand-authored CSS icons while
adding a finite HyperFrames timeline and a source-vs-component comparison
sheet. No Apple code, SF Symbols, private files, or app assets were copied.

Claude home/new-chat refinement: `compositions/claude-home.html` now adds a
separate first-prompt state informed by the Sonnet 4.6 launch-frame contact
sheet and the same local dframe/epitaxy vocabulary. The surface translates the
centered Claude mark/name, prompt card, Work in a folder affordance, plus
control, red Let's go action, and starter prompts into hand-authored
editable HTML/CSS without copying Claude code, CSS, icons, or private account
state.

Third extracted pattern: `ribbon-menu` and Fluent UI informed the editable
PowerPoint-like editor. The ribbon now uses tabbed command groups, group
labels, large primary commands, small icon clusters, split controls, dense
paragraph/arrange groups, a contextual `Shape Format` tab, a saved/sync
indicator, a slide comment pin, and inspector quick actions. The code remains
hand-authored HTML/CSS in UI Backlot instead of vendoring either dependency.

Word extraction: the same `ribbon-menu` and Fluent UI references now inform
`compositions/word-editor.html`. The surface translates ribbon tab geometry,
group labels, large Paste-style commands, compact Font/Paragraph/Styles groups,
subtle selected tab/button states, toolbar spacing, document navigation, ruler,
comment/review pane, tracked-change callout, and status bar into hand-authored
editable HTML/CSS. No Microsoft code, font, or icon assets were copied.

Excel extraction: `ribbon-menu`, Fluent UI, and the Office-family component
patterns now inform `compositions/excel-workbook.html`. The surface translates
ribbon tab geometry, compact Font/Alignment/Number/Cells groups, formula bar and
name box, table/range navigation, spreadsheet column/row headers, selected
range, active cell handle, analyze-data pane, chart preview, sheet tabs, and
status calculations into hand-authored editable HTML/CSS. No Microsoft code,
font, icon, workbook data, or app assets were copied.

Figma extraction: Figma's public help-center/UI3 documentation now informs
`compositions/figma-editor.html`. The surface translates the current left
navigation panel, File/Assets left panel, scrollable canvas, bottom toolbar,
Design/Prototype properties panel, selection actions, layer properties,
selected-frame handles, and Actions affordance into hand-authored editable
HTML/CSS. The local `/Applications/Figma.app` installation was only checked
for availability/version metadata. No private account/file was opened, and no
Figma app code, font, or asset was copied.

Premiere timeline extraction: Adobe Premiere public documentation and
`react-timeline-editor` now inform `compositions/premiere-editor.html`. The
surface translates Source/Program monitor roles, workspaces, tools, source
patching, audio meters, Project panel rows, properties/effects panes, and a
multi-track timeline into editable HTML/CSS. The timeline donor specifically
informs track/action rows, time-to-pixel geometry, clip handles, snap guide
lines, and playhead/cursor treatment. No Adobe app code, font, icon, private
project, or donor runtime code was copied.

Fourth extracted pattern: `react-chrome-tabs` and `react-browser-components`
informed the standalone browser/app surface. The browser frame now uses
overlapping Chrome-like tabs with favicons, close buttons, title masking, an
add-tab button, reload/star/local/profile/more toolbar affordances, and a richer
web-app header action cluster. The code remains hand-authored HTML/CSS in UI
Backlot; no donor browser component, icon, or stylesheet was vendored.

Modular assembly extraction: `compositions/claude-browser-workflow.html` now
uses the local Claude home, Claude working-thread, and browser app component
files as independent editable surfaces inside one parent timeline. The wrapper
now mounts child template roots through `runtime/backlot-component-loader.js`,
so the capture output contains real Claude and browser DOM rather than visible
iframe surfaces. This pass does not add a new donor dependency; it tests the
architecture implied by the open-source component research: a future video
should import only the app surfaces it needs, while the wrapper owns
choreography and scene context.

Claude/Finder modular assembly: `compositions/claude-finder-workflow.html` now
uses the same loader path to mount only the Finder window and Claude
working-thread components. The parent wrapper owns the macOS menu bar, cursor,
click ring, and temporary folder drag chip, while the child app surfaces remain
editable in their own files. No new donor assets or product code were copied.

Queued donor repos to inspect next:

- `gabrielbull/react-desktop`, `Renovamen/playground-macos`, and
  `esrakllci/macos-portfolio` for second opinions on macOS window chrome,
  sidebar, buttons, menu bar, Dock, action center, Spotlight, Launchpad, and
  component boundaries.
- `dayflow-js/calendar` for Calendar interaction depth once the static
  `macos-web`-informed Calendar surface needs day/week/year views, event
  editing, search, or drag/drop.
- `Cognipeer/chat-ui` for a second AI-chat/tool-call reference after
  `assistant-ui`, especially file uploads and visible tool cards.
- `PptxGenJS` once real deck generation becomes part of the demo workflow.

## Evaluation Checklist

For each donor repo we actually inspect:

- What surface or primitive does it improve?
- Is the license compatible with our intended use?
- Are we copying code/assets or only using it as a design/structure reference?
- Which files/components are worth studying?
- What exact change should land in UI Backlot?
- What visual evidence proves the imported idea improved fidelity?
