# Open-Source Reference Clones

These directories are local, shallow clones used as reference material for UI
Backlot reconstruction work. They are not production dependencies.

The clone directories are ignored by git. Restore them in a fresh checkout with:

```bash
tools/clone-reference-repos.sh
```

See [../../GOAL.md](../../GOAL.md) for the donor-repo mandate and
[../../docs/research/open-source-ui-donor-repos.md](../../docs/research/open-source-ui-donor-repos.md)
for the full candidate list.

## Clones

| Repo | Commit | License | Current Use |
|---|---:|---|---|
| [PuruVJ/macos-web](https://github.com/PuruVJ/macos-web) | `f0d4d4db147a1e5706bd3262e5aec5a08cef4026` | MIT | Reference and possible component donor for macOS desktop, Dock, menu bar, window chrome, and active-app Dock state. |
| [AppKit-on-the-Web](https://github.com/andrewmcwattersandco/AppKit-on-the-Web) | `7407236851a2a0a20636c7fbb010e5b5f843f7a1` | GPLv2 | Visual/reference-only unless GPL obligations are explicitly accepted. Useful for AppKit sidebar, sheet, menu, and control measurements. |
| [assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui) | `bca6ebe3c5a5d12a1f654cd4b2eeb635c2baec72` | MIT | Reference and possible component donor for Claude-like thread, grouped message parts, composer attachments, action bars, and tool-call states. |
| [olton/ribbon-menu](https://github.com/olton/ribbon-menu) | `2d695939b068e8cc58945e818b4493b69dda8881` | MIT | Reference and possible component donor for PowerPoint-like ribbon tabs, command groups, split/dropdown buttons, dividers, and group labels. |
| [microsoft/fluentui](https://github.com/microsoft/fluentui) | `672afec62c04eada141116387483d47c13c3da68` | MIT | Reference and possible component donor for Office-like toolbar, tab, button, divider, and command-state geometry. Font/icon assets have separate Microsoft terms. |
| [EnhancedJax/react-browser-components](https://github.com/EnhancedJax/react-browser-components) | `9af4765144246ad0f2a68955fa893b4a9f53d747` | Mixed permissive metadata: `LICENSE` is MIT, `package.json` says ISC | Reference-only until license metadata is clarified. Useful for browser-frame structure, tab/search rows, toolbar icon slots, and demo-browser framing. |
| [pansinm/react-chrome-tabs](https://github.com/pansinm/react-chrome-tabs) | `929c02083e14c4769b1193bd52de39f805c1d52b` | MIT | Reference and possible component donor for Chrome-style tab geometry, close buttons, dynamic widths, favicon/title masks, drag/reorder behavior, and plus-tab affordance. |

## Current Extraction Notes

- `macos-web/src/components/Dock/Dock.svelte` and
  `macos-web/src/components/Dock/DockItem.svelte` model Dock glass, dividers,
  open-app indicator dots, app wrappers, and magnification/bounce behavior.
- `macos-web/src/components/TopBar/TopBar.svelte` and
  `macos-web/src/components/TopBar/MenuBar.svelte` are useful references for
  menu bar structure and menu interaction states.
- `macos-web/src/components/Desktop/Window/Window.svelte` and
  `macos-web/src/components/Desktop/Window/TrafficLights.svelte` are useful
  references for active-window shadows and hover-revealed traffic-light glyphs.
- `AppKit-on-the-Web/stylesheets/Sidebar List.css` is useful as a
  reference-only source for Finder/AppKit sidebar row heights, label sizing,
  section spacing, and selected-row treatment.
- `assistant-ui/examples/with-chain-of-thought/app/MyThread.tsx` models grouped
  reasoning, tool-call, and source message parts inside an assistant thread.
- `assistant-ui/templates/minimal/components/assistant-ui/thread.tsx`,
  `attachment.tsx`, and `tool-fallback.tsx` are useful references for composer
  attachment/dropzone structure, action bars, send/cancel state, tool status
  icons, durations, and collapsible tool details.
- `ribbon-menu/demo/index.jsx`, `demo/index.less`,
  `src/components/RibbonMenu/RibbonMenu.less`, `Button/Button.less`,
  `IconButton/IconButton.less`, `ToolButton/ToolButton.less`,
  `SplitButton/SplitButton.less`, `DropdownMenu/DropdownMenu.less`,
  `ButtonGroup/ButtonGroup.less`, and the `Tabs/*` components are useful
  references for a compact ribbon made from tab groups, dividers, large
  commands, small command clusters, split buttons, dropdowns, and group titles.
- `fluentui/packages/react-components/react-toolbar/.../useToolbarStyles.styles.ts`,
  `useToolbarGroupStyles.styles.ts`, `useToolbarDividerStyles.styles.ts`,
  `react-button/.../useButtonStyles.styles.ts`, and
  `react-tabs/.../useTabListStyles.styles.ts` / `useTabStyles.styles.ts` are
  useful references for Office-like flex toolbar sizing, grouped controls,
  subtle button states, dividers, selected tabs, and contextual tab treatment.
- `react-browser-components/src/components/ChromeBrowser/ChromeBrowser.tsx`,
  `ChromeBrowser/styles.ts`, `ChromeBrowser/containers/Tab/*`, and the
  `ArcBrowser/*` files are useful references for browser-window decomposition,
  tab/search rows, toolbar icon slots, traffic-light sizing, selected-tab
  decoration, and demo-browser/content framing.
- `react-chrome-tabs/css/chrome-tabs.css`, `src/chrome-tabs.ts`,
  `src/component.tsx`, `src/hooks/useChromeTabs.tsx`, and `demo/index.tsx` are
  useful references for overlapping Chrome-like tabs, 46px tab bars, 36px tab
  bodies, 9px content margins, title masking, close controls, add-tab controls,
  and drag/reorder event contracts.

## Queued References

These are not cloned yet, but they are part of the active refinement lane:

| Repo | First Surface To Improve |
|---|---|
| `gabrielbull/react-desktop` | macOS window chrome, sidebar, buttons, and component boundaries. |
| `gitbrent/PptxGenJS` | Real `.pptx` output from the same data used by the video surface. |

## Guardrails

- Do not copy GPLv2 code or assets into UI Backlot without a deliberate license
  decision.
- If MIT code from `macos-web` is copied rather than only referenced, preserve
  attribution in the relevant prototype note.
- Prefer translating observed patterns into our existing HTML/CSS primitives so
  the rendered scenes remain small, editable, and HyperFrames-friendly.
