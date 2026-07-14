# Slack — measured visual spec

**Family:** `slack` · **Title:** Slack (desktop, macOS) · **App version:** 4.50.143
**Written:** 2026-07-13 · **Theme captured:** Aubergine (default), light content.

## Sources & how this was measured

No `tokens.json` exists for Slack (native app — no computed-style extraction).
All numbers below come from **pixel measurement** of the references:

- **Primary ground truth (geometry + color):**
  `reference/slack/2026-07-13/app-chrome-default/screenshot.png` — native
  `Slack.app` v4.50.143, real logged-in workspace, retina **2880×1800 = 2×** a
  **1440×900** logical window. All logical px below = measured orig px ÷ 2,
  taken from color-transition scans (region edges) and averaged-region samples
  (colors). **Content is the owner's private workspace — discount ALL text,
  names, avatars, channel names, messages; trust only chrome geometry, colors,
  typography, iconography.**
- **Icon set / rail order (authoritative):**
  `reference/slack/actual-app/actual-slack-helpcenter-sidebar-anatomy.png` —
  official Slack Help Center diagram numbering the four left zones.
- **Extra surfaces (cross-check only):** the nine
  `reference/slack/actual-app/actual-slack-appstore-*.png` App Store cards
  (huddle grid, Canvas, Lists, Slackbot AI, Connect/Workflow modals). See
  "Do not include" — these are SEPARATE surfaces, not part of default chrome.

**Color caveat (important for the builder):** the native PNG is a Display-P3
retina capture; raw RGB reads ~one step **lighter/greyer** than sRGB. Measured
P3 values are given as `(measured …)`; the **build target is the canonical
Slack sRGB brand hex**, which the measured values corroborate in hue and
ordering. Build in sRGB.

**Confidence:** geometry & region bounds = **measured**; palette = canonical
sRGB (**product-knowledge**) corroborated by measured P3; typography sizes =
**visual-estimate** (no token file; Slack's documented 15px base applied).

---

## Regions (logical px; 1440×900 window)

The builder works region-by-region. Left→right the window is four vertical
columns under one title bar; the content column and thread panel each split
top→bottom into header / list / composer.

| # | Region | x range | y range | w×h | Fill |
|---|--------|---------|---------|-----|------|
| **R1** | Title bar (aubergine) | 0–1440 | 0–40 | 1440×40 | `#3F0E40` |
| **R2** | Workspace icon rail | 0–70 | 40–900 | 70×860 | `#3B0E3E` (measured `#48204C`) |
| **R3** | Channel sidebar | 70–398 | 40–900 | 328×860 | `#4A154B` (measured `#4D2651`) |
| **R4** | Message content column | 398–922 | 40–900 | 524×860 | `#FFFFFF` |
| ↳ R4a | · content header | 398–922 | 40–126 | 524×86 | white, 1px bottom border |
| ↳ R4b | · message list | 398–922 | 126–754 | 524×628 | white |
| ↳ R4c | · composer | 398–922 | 754–896 | 524×142 | white, rounded outlined box |
| **R5** | Thread / details panel | 922–1440 | 40–900 | 518×860 | `#FFFFFF`, 1px left border |
| ↳ R5a | · thread header | 922–1440 | 40–90 | 518×50 | white, 1px bottom border |
| ↳ R5b | · thread message list | 922–1440 | 90–~800 | — | white |
| ↳ R5c | · thread composer | 922–1440 | ~800–896 | — | white outlined box + green send |

Column edges measured from a horizontal color scan at logical y=500:
icon-rail→sidebar at **x=70**, sidebar→content (white) at **x=398**,
content→thread (subtle grey border) at **x=922**. Title-bar bottom and both
header dividers measured from vertical scans (title bar white starts at y=40;
content tab-strip divider at y=126; thread header divider at y=90).

> The thread panel is only present because a thread is open. For a plain
> two-pane chat surface, drop R5 and let R4 fill 398–1440.

---

## Palette (hex + role)

Build values are canonical Slack sRGB; `(m …)` = measured P3 sample from the
native capture for cross-check.

### Aubergine chrome (left of the content)
| Role | Build hex | Measured | Notes |
|---|---|---|---|
| Icon-rail bg (deepest) | `#3B0E3E` | `(m #48204C)` | leftmost 70px column |
| Channel-sidebar bg | `#4A154B` | `(m #4D2651)` | second column; slightly lighter than rail |
| Title-bar bg | `#3F0E40` | `(m #401645)` | full-width top strip |
| Search-field fill (in title bar) | `rgba(255,255,255,.18)` → `~#674768` | `(m #836787)` | translucent white over aubergine |
| Selected-channel row bg | `rgba(255,255,255,.10)` → `~#512A56` | `(m #512A56)` | **not** classic blue — modern default is a lightened aubergine |
| Sidebar text — inactive | `rgba(255,255,255,.72)` → `~#CFC3CE` | — | channels, section rows |
| Sidebar text — active / workspace name / unread | `#FFFFFF` | `(m #FFF)` | bold for unread + selected |
| Icon-rail glyphs / labels | `rgba(255,255,255,.9)` | — | line icons + tiny caption labels |

### Content (message + thread panes)
| Role | Build hex | Measured | Notes |
|---|---|---|---|
| Content bg | `#FFFFFF` | `(m #FFF)` | |
| Primary text | `#1D1C1D` | — | Slack near-black |
| Secondary / timestamp / meta | `#616061` | — | timestamps, "N replies", labels |
| Divider / border (headers, composer, panel edge) | `#E8E8E8`–`#DDDDDD` | `(m #DDDDDD)` | 1px |
| Hover-row bg | `#F8F8F8` | — | |
| Link / mention blue | `#1264A3` | `(m pill #2E639E)` | links, @mentions, channel refs |
| "New messages" pill / primary blue | `#1264A3` | `(m #2E639E)` | floating blue pill |
| Send-button green (primary action) | `#007A5A` | `(m #34785C)` | paper-plane button; hover `#148567` |
| Online / presence dot | `#007A5A` | — | filled circle by names |
| Active-tab underline | `#4A154B` (aubergine) | — | 2px under selected content tab |

---

## Typography

Slack ships **Lato** (custom "Slack-Lato") over a system fallback. Use:
`font-family: Lato, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;`
Base size **15px**. Sizes are visual-estimates from the retina capture (row
pitch ÷ 2); weights follow Slack's documented scale.

| Text role | Family | Size | Weight | Color | Region |
|---|---|---|---|---|---|
| Workspace name (sidebar header) | Lato | 18px | 900 (black/bold) | `#FFFFFF` | R3 |
| Section labels (Channels, Direct messages, Starred, Agents & apps) | Lato | 15px | 700 | `rgba(255,255,255,.72)` | R3 |
| Sidebar nav rows (Threads/Huddles/… , channel names) | Lato | 15px | 400 (unread **700**) | inactive `#CFC3CE` / active `#FFF` | R3/R2 |
| Icon-rail caption labels (Home, DMs, Activity…) | Lato | 11px | 500 | `rgba(255,255,255,.9)` | R2 |
| Channel header title (`# marketing`) | Lato | 18px | 900 | `#1D1C1D` | R4a |
| Content tab labels (Messages / Add canvas / Files & links) | Lato | 14px | 700 active / 400 rest | `#1D1C1D` / `#616061` | R4a |
| Message sender name | Lato | 15px | 700 | `#1D1C1D` | R4b |
| Message body | Lato | 15px | 400 | `#1D1C1D` | R4b/R5b |
| Timestamp | Lato | 12px | 400 | `#616061` | R4b |
| "N replies · Last reply …" thread meta | Lato | 13px | 700 (count) / 400 | `#1264A3` / `#616061` | R4b |
| Date divider pill ("Today", "Thursday, July 9th") | Lato | 13px | 700 | `#1D1C1D` | R4b |
| Composer placeholder ("Message #…") | Lato | 15px | 400 | `#616061` | R4c |
| Thread header title ("Thread") | Lato | 18px | 900 | `#1D1C1D` | R5a |

Message row: **36px** square avatar (measured ~34–36px), 8px gap to text,
~22px body line-height. Sidebar row pitch **~28px**.

---

## NUMBERED ELEMENT CHECKLIST

Only elements **visible in the references** are listed. Build every number;
the judge audits against this list. Geometry is approximate logical px
(measured ÷2). **Do NOT invent controls not on this list** — omission and
invention are the two dominant failure modes.

### R1 — Title bar (aubergine strip, y 0–40)
1. **Traffic-light buttons** (close/min/max, red/yellow/green circles) — far left, x≈22–68, y≈16–24 — *native capture*. Draw as CSS circles (macOS family, or plain circles).
2. **Back arrow ←** — x≈312, y≈20 — *native*. → `browser:back` / `macos:back`.
3. **Forward arrow →** — x≈344 — *native*. → `browser:forward` / `macos:forward`.
4. **History clock** — x≈374 — *native*. → `macos:clock` / `claude:clock`.
5. **Search field** — centered, x≈400–1000, y≈5–34, translucent fill, left search glyph + placeholder "Search {workspace}" — *native + anatomy diagram*. Search glyph → `macos:search` / `claude:search`.
6. **Workspace/account switcher** — far right, x≈1350, small square avatar/starburst + chevron-down — *native*. chevron → `claude:chevron-down`.
7. **Help "?"** — far right corner, x≈1411 — *native*. (line question-mark; source via find-icon.)

### R2 — Workspace icon rail (dark column, x 0–70)
8. **Workspace square avatar** — top, ~44px rounded square with initials ("WS") — x≈14–58, y≈48–92 — *native + anatomy*. Rounded-rect with 2-letter monogram.
9. **Home** icon + "Home" label (selected state = filled/lighter tile) — *native + anatomy(3)*. → `macos:home` / `claude:home`.
10. **DMs** icon + "DMs" label (chat bubbles) — *native + anatomy(3)*. → `claude:message-circle` / `claude:chat`.
11. **Activity** icon + "Activity" label (bell) — *native + anatomy(3)*. **Bell not in sprites — source via find-icon (lucide `bell`).**
12. **Files** icon + "Files" label (document) — *native*. → `macos:documents` / `office:document-edit-20`.
13. **Later** icon + "Later" label (bookmark) — *native + anatomy(3)*. → `browser:bookmark`.
14. **More** icon + "More" label (ellipsis) — *native + anatomy(3)*. → `macos:more` / `claude:more`.
15. **Admin/Settings** icon + "Admin" label (gear) near lower rail — *native*. → `macos:settings`.
16. **User avatar** — bottom of rail, circular photo — x≈14–58, y≈~830 — *native + anatomy*. (Use synthetic avatar.)

> Anatomy diagram also shows a `+` "add workspace" and extra org tiles in the
> rail. Keep to ONE workspace square (item 8) — see Do-not-include.

### R3 — Channel sidebar (lighter aubergine column, x 70–398)
17. **Workspace-name header** "{Workspace} ▾" (bold white + chevron) — top, y≈~64 — *native*. chevron → `claude:chevron-down`.
18. **Header gear/settings icon** — right of name — *native*. → `macos:settings`.
19. **Compose / new-message icon** (pencil-in-square) — top-right of sidebar — *native*. → `claude:new-chat` / `claude:pencil`.
20. **"Find a conversation" search box** — full-width rounded translucent field, left glyph + placeholder — y≈~90 — *native*. glyph → `macos:search`.
21. **Threads** nav row (icon + label) — *native + anatomy*. **Threads glyph (≡ w/ dots) — source via find-icon (lucide `list`/`text`).**
22. **Huddles** nav row (headphones icon) — *native*. **Headphones — source via find-icon (lucide `headphones`).**
23. **Recap** nav row (sparkle/list icon) — *native*. → `design:wand` / `claude:list-checks`.
24. **Drafts & sent** nav row (paper-plane icon) — *native + anatomy*. → `claude:send-up`.
25. **Directories** nav row — *native*. (people/grid glyph — source via find-icon.)
26. **"Starred" section label** + collapse caret — *native*. caret → `claude:chevron-down`.
27. **Starred item** (one row, may show a lock for private) — *native*. lock → `browser:lock`.
28. **"Channels" section label** + caret — *native*. hash rows below → `#` rendered as text or find-icon `hash`.
29. **Channel rows** (`# name`, several; one **selected** with lighter bg #512A56; one **private** with lock glyph instead of #; unread = bold white) — *native + anatomy(4)*.
30. **"Direct messages" section label** + caret — *native*. Rows show small avatar + name + presence dot.
31. **DM rows** (avatar + name + green presence dot) — *native*. presence dot `#007A5A`.
32. **"Agents & apps" section label** + caret — *native*. Rows = app logo + name (e.g. Slackbot).

### R4a — Content header (y 40–126)
33. **Star/favorite toggle** — left of channel title — *native*. → `browser:star`.
34. **Channel title** `# {channel}` (bold) — x≈400, y≈~56 — *native*.
35. **Member-count pill** (person glyph + number, e.g. "7") — right area — *native*. person → `macos:shared` / `office`.
36. **Huddle button** (headphones) + its dropdown caret — right — *native + card1*. headphones via find-icon; caret → `claude:chevron-down`.
37. **Kebab / more-actions** (⋮) — far right of header — *native*. → `claude:more` / `macos:more`.
38. **Content tab strip**: **Messages** (active, purple underline) · **Add canvas** · **Files & links** · **+** add-tab — y≈88–126 — *native*. active underline `#4A154B`, `+` → `claude:plus`.

### R4b — Message list (y 126–754)
39. **Date-divider pill** (e.g. "Today", centered, rounded, bordered, with caret) — *native*.
40. **Message group** = 36px avatar + bold sender + timestamp + body text — repeated — *native*.
41. **@mention / channel-link** inline (blue `#1264A3`) inside body — *native*.
42. **Thread-reply summary** under a message: small facepile avatars + "**N replies** · Last reply …" (blue count) — *native*.
43. **Floating "↑ N new messages" pill** (blue `#1264A3`, white text, close ×) — top of list — *native*. × → `claude:x`.
44. *(Optional, from card1)* image / file / audio-clip attachment card, and emoji **reaction pills** (rounded, count) under a message. Include only if the demo needs them — see Do-not-include.

### R4c — Composer (rounded outlined box, y 754–896)
45. **Formatting toolbar row**: Bold · Italic · Underline · Strikethrough · Link · Ordered-list · Bullet-list · Blockquote/indent · Code · Code-block — *native*. Map: `office:text-bold-20`, `text-italic-20`, `text-underline-20`; **strikethrough, link, blockquote — source via find-icon**; `office:number-list-20`, `bullet-list-20`; code → `claude:code` / `macos:code`.
46. **Text input** with placeholder "Message #{channel}" — *native*.
47. **Composer bottom action row (left)**: `+` attach · **Aa** formatting-toggle · emoji-smiley · `@` mention · `⋯` more · (mic, video, /) — *native*. `+` → `claude:plus`; **Aa, emoji, @ — source via find-icon** (lucide `smile`, `at-sign`, `type`).
48. **Send button** (green `#007A5A`, paper-plane) + **send-options caret** at bottom-right — *native*. → `claude:send-up`; caret → `claude:chevron-down`.

### R5a — Thread panel header (y 40–90)
49. **"Thread" title** (bold) — left — *native*.
50. **AI-summarize sparkle** icon — right — *native*. → `design:wand`.
51. **Thread kebab (⋮)** — *native*. → `claude:more`.
52. **Close ×** — far right — *native*. → `claude:x`.

### R5b/R5c — Thread body + composer
53. **Root message + reply stack** (avatar + sender + AGENT/bot tag chip + body; bullet lists render) — *native*. Use synthetic content.
54. **Thread composer**: same outlined box as R4c with its own formatting toolbar, "Also send to # {channel}" checkbox above the bottom row, and green send button — *native*.

---

## Icon needs → sprite-manifest mapping

Slack's icon set is proprietary line-art (closest match: **lucide**, which the
`claude`/`browser` sprite families already use). Do **not** hand-draw glyphs —
per repo policy pull real ones via `tools/find-icon.mjs`.

**Already covered by existing sprites:** plus, chevron-down, search, home,
message-circle/chat, more/ellipsis, settings(gear), bookmark, star, lock,
send-up (paper-plane), new-chat/pencil, code, list/list-checks, wand,
documents, back, forward, clock, x.

**Gaps to source via `tools/find-icon.mjs` (lucide names suggested):** `bell`
(Activity), `headphones` (Huddles + header huddle), `at-sign` (@ mention),
`smile` (emoji picker), `strikethrough`, `link`, `text-quote` (blockquote),
`type` (Aa toggle), `hash` (channel prefix — or render `#` as text),
`list`/`align-justify` (Threads glyph), `users`/`contact` (Directories,
member-count person). Add these to a `slack` sprite family in
`assets/icons/sprite-manifest.json`.

---

## DO NOT INCLUDE (abstraction principle — fewer correct controls read as more real)

Leave these out of the **default chat chrome** unless the demo specifically
calls for them. Each is either a separate surface, private content, or an
uncertain detail.

- **Separate surfaces from the App Store cards — build only if requested, as their own surface, NOT bolted onto the default window:** active **Huddle video grid** + huddle control bar (card3), **Canvas document** editor (card4), **Lists table** view (card6), **Slackbot AI split panel** (card7), **Apps directory** grid (card8), **Slack Connect "Add people" modal** (card5), **Workflow Builder Reminder modal** (card9). These are the reason the App Store cards exist; they are not visible in the default two/three-pane chat view.
- **Multiple workspace/org tiles + the "add workspace" `+`** in the icon rail (in the anatomy diagram): ship ONE workspace square (item 8). Extra tiles imply an account structure we can't verify.
- **Owner's private content**: every real name, avatar photo, channel name, message body, the "Ace / AGENT" bot, the "Woodinville Sports Club" workspace. Replace with neutral synthetic content.
- **Notification count badges** on rail icons (e.g. anatomy shows a `6` and `2`): include at most one, only if the demo needs an unread story; don't scatter counts.
- **Emoji reaction pills and rich attachment cards** (item 44): only if the beat needs them — otherwise plain text messages read cleaner.
- **The small colorful indicator icon near the search bar's right edge** in the native capture — provenance unclear (running-app / notification chip). Omit.
- **Exact translucency percentages** of aubergine overlays — approximated; do not present as measured. Match the visible ordering (rail darker than sidebar; selected row lighter than sidebar), not a spec'd alpha.
- **Precise composer bottom-row icon inventory beyond items 47–48** (some slots — video, slash-commands, formatting `/`) vary by workspace; include the confirmed set and stop.
- **Light-theme (non-aubergine) sidebar** — only the Aubergine default was captured; do not spec a white-sidebar variant from memory.
