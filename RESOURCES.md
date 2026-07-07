# Resources & Attribution

Every external resource UI Backlot draws on — icon sets, fonts, donor
repositories, runtime libraries, and the live apps we capture as ground truth —
with its source and license in one place.

**Stance.** UI Backlot is *fidelity-first*: surfaces are recreated as closely as
possible, using source-authentic fonts, glyphs, and brand marks where they
materially improve the match (see [AGENTS.md](AGENTS.md) and the 2026-07-06 asset
policy). The recreations are original HTML/CSS made for instructional and
demonstrative purposes and are used under **fair use**; all product names,
logos, and brands remain the property of their respective owners, and nothing
here implies endorsement. Two things to know:

- **Donor clones and full icon packages are git-ignored**, not committed.
  `.icon-donors/*` and `reference/open-source/*` are restored locally
  (`tools/clone-reference-repos.sh`); only small, reviewed symbol subsets under
  `assets/icons/source-authentic/` and needed fonts ship in the repo.
- **Privacy is the one hard constraint.** The owner's own logged-in captures
  (session screenshots, `reference/*/**/elements.json`) stay local; surfaces use
  synthetic demo content.

---

## Icon sets

Sourced with **`tools/find-icon.mjs`** (offline search over `@iconify/json`,
200k+ glyphs) and built into per-surface sprites by
`tools/build-icon-sprites.mjs`. Don't hand-draw system/brand glyphs — pull the
real one.

| Set | Used for | Source | License | Vendored at |
|---|---|---|---|---|
| **simple-icons** 15.22.0 | Brand marks — App Store (`appstore`), Claude (`si-claude`), Figma (`si-figma`) | [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons) | CC0-1.0 | `.icon-donors/simple-icons@15.22.0`, `assets/icons/source-authentic/simple-icons/` |
| **framework7-icons** 5.0.5 | macOS **SF-Symbol-style** glyphs — Finder, menu bar (`f7-*`). Names map to SF Symbols, e.g. `folder.badge.person.crop` → `f7:folder-badge-person-crop` | [framework7io/framework7-icons](https://github.com/framework7io/framework7-icons) | MIT | `.icon-donors/framework7-icons@5.0.5`, `assets/icons/source-authentic/framework7/` |
| **lucide-static** 1.23.0 | Claude + browser UI (`lucide-*`) — closest open match to Claude's thin-stroke language | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | ISC | `.icon-donors/lucide-static@1.23.0`, `assets/icons/source-authentic/lucide/` |
| **@fluentui/svg-icons** 1.1.331 | Office ribbon + UI (`fluent-*`) | [microsoft/fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons) | MIT | `.icon-donors/_fluentui_svg-icons@1.1.331`, `assets/icons/source-authentic/microsoft/` |
| **@iconify/json** 2.2.496 | Offline search database behind `find-icon.mjs` | [iconify/icon-sets](https://github.com/iconify/icon-sets) | MIT | `node_modules/@iconify/json` |

> Apple's own SF Symbols and Microsoft's brand icon fonts can't be redistributed —
> Framework7 (macOS) and Fluent (Office) are the legal open substitutes.

## Fonts

| Font | Used for | Source | License | At |
|---|---|---|---|---|
| **Anthropic Sans** (Roman + Italic variable) | Claude/Anthropic UI + display type (`--font-claude-ui`) | [anthropic.com](https://www.anthropic.com) | Proprietary — Anthropic brand asset | `assets/fonts/AnthropicSans-*.ttf` |
| **Anthropic Serif** (Roman + Italic variable) | Claude serif wordmark + editorial (`--font-claude-serif`) | [anthropic.com](https://www.anthropic.com) | Proprietary — Anthropic brand asset | `assets/fonts/AnthropicSerif-*.ttf` |

Wired through `styles/backlot-foundation.css`.

## App icons & cursors

| Asset | Used for | Source | License | At |
|---|---|---|---|---|
| macOS system app icons (Finder, Safari, Notes, Calendar, Terminal, Messages) | Dock + desktop scenes | [PuruVJ/macos-web](https://github.com/PuruVJ/macos-web) | MIT | `assets/app-icons/` |
| Brand app icons — Claude, Word/Excel/PowerPoint, Figma, Premiere | App/dock marks in demos | Respective owners (Anthropic, Microsoft, Figma, Adobe) — proprietary marks recreated for fidelity | — | `assets/app-icons/` |
| Pointer cursors (`normal-select`, `text-select`, …) | Scripted-interaction cursor | Recreated | ISC (repo) | `assets/cursors/` |

## Reference / donor repositories

Under `reference/open-source/` (git-ignored; `tools/clone-reference-repos.sh`).
Used for **measured patterns and geometry only** — spacing, row heights, chrome
decomposition — never by copying product code into surfaces.

**macOS desktop chrome**

| Repo | Informs | Source | License |
|---|---|---|---|
| macos-web | Dock glass, menu bar, traffic lights, window chrome, open-app dots | [PuruVJ/macos-web](https://github.com/PuruVJ/macos-web) | MIT |
| playground-macos | Dock, menu, window state, Launchpad, Spotlight | [Renovamen/playground-macos](https://github.com/Renovamen/playground-macos) | MIT |
| macos-portfolio | Dock, menu bar, Finder, Notes, action center | [esrakllci/macos-portfolio](https://github.com/esrakllci/macos-portfolio) | MIT |
| react-desktop | macOS window chrome, sidebars, buttons | [gabrielbull/react-desktop](https://github.com/gabrielbull/react-desktop) | MIT |
| AppKit-on-the-Web | Sidebar row heights, label sizing, selected-row treatment | [andrewmcwattersandco/AppKit-on-the-Web](https://github.com/andrewmcwattersandco/AppKit-on-the-Web) | **GPLv2 — reference-only** ⚠ |

**Browser**

| Repo | Informs | Source | License |
|---|---|---|---|
| react-chrome-tabs | Chrome tab geometry, widths, close/favicon, reorder | [pansinm/react-chrome-tabs](https://github.com/pansinm/react-chrome-tabs) | MIT |
| react-browser-components | Browser window, tab/search rows, toolbar slots | [EnhancedJax/react-browser-components](https://github.com/EnhancedJax/react-browser-components) | MIT |

**Chat**

| Repo | Informs | Source | License |
|---|---|---|---|
| assistant-ui | Thread grouping, message parts, composer attachments, tool-call states | [assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui) | MIT |
| cognipeer-chat-ui | Message lists, uploads, tool-call cards | [Cognipeer/chat-ui](https://github.com/Cognipeer/chat-ui) | MIT |

**Office / PowerPoint**

| Repo | Informs | Source | License |
|---|---|---|---|
| fluentui | Ribbon toolbar/tab/button geometry + design tokens | [microsoft/fluentui](https://github.com/microsoft/fluentui) | MIT |
| ribbon-menu | Ribbon tabs, command groups, split/dropdown buttons | [olton/ribbon-menu](https://github.com/olton/ribbon-menu) | MIT |
| PptxGenJS | Real `.pptx` artifact generation (future workflow donor) | [gitbrent/PptxGenJS](https://github.com/gitbrent/PptxGenJS) | MIT |

**Media / Calendar**

| Repo | Informs | Source | License |
|---|---|---|---|
| react-timeline-editor | Premiere timeline rows, clips, playhead, snap guides | [xzdarcy/react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor) | MIT |
| dayflow-calendar | Calendar day/week/month views, event editing, drag/drop | [dayflow-js/calendar](https://github.com/dayflow-js/calendar) | MIT |

## Runtime & tooling

| Dependency | Used for | Source | License |
|---|---|---|---|
| **GSAP** 3.14.2 | Seek-deterministic animation timelines (loaded from CDN in compositions) | [greensock.com](https://greensock.com/) (jsDelivr) | GreenSock "No-Charge" Standard |
| **hyperframes** | Renderer — HTML compositions → MP4/GIF/PNG, plus lint/validate/capture | Anthropic (invoked via `npx hyperframes`) | — |
| **@iconify/json** 2.2.496 | Offline icon database for `find-icon.mjs` | [iconify/icon-sets](https://github.com/iconify/icon-sets) | MIT |
| **playwright** | Public-URL reference scraping (online-only capture tier) | [microsoft/playwright](https://github.com/microsoft/playwright) | Apache-2.0 |
| **odiff-bin** | Pixel diffing for `npm run fidelity:score` | [dmtrKovalenko/odiff](https://github.com/dmtrKovalenko/odiff) | MIT |

## Live-app capture sources (ground truth)

Declared in [`reference/sources.json`](reference/sources.json); see the
[fidelity loop plan](docs/fidelity-loop-plan-2026-07-05.md). Captures are
reference-only and the owner's logged-in pixels stay local.

| Family | Source | Tier / method |
|---|---|---|
| Claude | `claude.ai`, `claude.ai/new` | live-web (claude-in-chrome) |
| Codex | `chatgpt.com/codex` | live-web (claude-in-chrome) |
| Figma | `figma.com` | live-web (claude-in-chrome) |
| macOS (Finder, menu bar, Calendar) | native apps | native-local (screencapture, pixels only) |
| Google Chrome | native app | native-local (pixels only) |
| Word / Excel / PowerPoint | `support.microsoft.com/*` official docs | online-only (Playwright) |
| Premiere Pro | `helpx.adobe.com/premiere-pro` + launch-video frame studies | online-only (Playwright) |

---

*Spot something under-attributed or a license that needs a closer look? Open an
issue — provenance corrections are welcome.*
