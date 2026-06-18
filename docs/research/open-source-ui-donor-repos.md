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

First extracted pattern: `macos-web` Dock structure informed our editable Dock
primitive with app wrappers, open-app indicator dots, a separator, and subtler
glass/inset styling. The code remains hand-authored in UI Backlot rather than a
direct component import.

Second extracted pattern: `assistant-ui` grouped message parts and composer
architecture informed the editable Claude shell. The Claude assistant message
now shows static reasoning/action/source groupings, richer tool status rows,
message action dots, attachment count, a dropzone outline, composer action
chips, and a running-state send/cancel control. The code remains hand-authored
HTML/CSS in UI Backlot.

Third extracted pattern: `ribbon-menu` and Fluent UI informed the editable
PowerPoint-like editor. The ribbon now uses tabbed command groups, group
labels, large primary commands, small icon clusters, split controls, dense
paragraph/arrange groups, a contextual `Shape Format` tab, a saved/sync
indicator, a slide comment pin, and inspector quick actions. The code remains
hand-authored HTML/CSS in UI Backlot instead of vendoring either dependency.

Fourth extracted pattern: `react-chrome-tabs` and `react-browser-components`
informed the standalone browser/app surface. The browser frame now uses
overlapping Chrome-like tabs with favicons, close buttons, title masking, an
add-tab button, reload/star/local/profile/more toolbar affordances, and a richer
web-app header action cluster. The code remains hand-authored HTML/CSS in UI
Backlot; no donor browser component, icon, or stylesheet was vendored.

Queued donor repos to inspect next:

- `gabrielbull/react-desktop` for React-based macOS component boundaries.
- `PptxGenJS` once real deck generation becomes part of the demo workflow.

## Evaluation Checklist

For each donor repo we actually inspect:

- What surface or primitive does it improve?
- Is the license compatible with our intended use?
- Are we copying code/assets or only using it as a design/structure reference?
- Which files/components are worth studying?
- What exact change should land in UI Backlot?
- What visual evidence proves the imported idea improved fidelity?
