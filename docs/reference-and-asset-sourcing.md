# Reference & Asset Sourcing Playbook

Ground truth is **hunted, not remembered**, and assets are **sourced, not
redrawn**. This playbook is the shared recipe book for:

- the fidelity-push **Reference** phase (health check + acquisition),
- onboard-app **Research/Capture**,
- any fix agent that needs an icon, logo, font, cursor, or wallpaper.

Everything acquired gets filed with provenance:
references via `node tools/import-reference.mjs` (dated set + manifest),
assets with a line in the nearest `NOTICE.md`.

## Part 1 — Reference acquisition ladder

Work down the ladder; take the best rung that is actually available. Higher
rungs beat lower ones because they are real pixels of the current version.
Marketing/staged shots are still useful — the critic discounts them via
`referenceQuality` — but never let them displace real pixels that a higher
rung could have produced.

### 1. The live app on this machine (best)

- **Web app** (`live-web`): drive the user's own Chrome via claude-in-chrome
  (tokens via `tools/extract-ui-tokens.js`, pixels via the beacon +
  `screencapture` + `tools/crop-to-beacons.mjs` procedure in
  `docs/fidelity-loop-plan-2026-07-05.md`). Public pages:
  `npm run reference:capture -- <url>` or `npx hyperframes capture <url> --json`.
- **Installed macOS app** (`native-local`): fixed window size, then
  `screencapture -x` (or computer-use screenshot after `request_access`).
  Check `/Applications`, `/System/Applications`, and `mdfind` before assuming
  an app is absent. No-click recipe (validated 2026-07-13 on Claude.app and
  Figma.app): `open -a <App>`, `osascript -e 'tell application "System
  Events" to tell process "<App>" to get {position, size} of front window'`,
  then `screencapture -x -R<x>,<y>,<w>,<h>` — real retina pixels of whatever
  page the app is on, zero UI driving.
- **App-state navigation via Codex** (owner-approved 2026-07-13): when the
  page you need isn't what the app opens on (a specific tab, panel, or
  dialog), delegate to Codex (`codex:codex-rescue` agent — strong computer
  use) with a precise brief: which app, which UI state to reach, where to
  save the `screencapture`. Same hard rules apply (no logins, no bot checks,
  captures stay local); prefer this over hand-rolled AppleScript clicking,
  which has hit stray in-app hyperlinks before (see reference/sources.json
  slack notes).
- Hard rules: never log in to anything, never touch bot checks/CAPTCHAs, and
  the owner's logged-in captures stay local (gitignored) — synthetic demo
  content only in surfaces.

### 2. Free web version of a "desktop" app

Many apps we don't have installed run free in a browser: Word/Excel/PowerPoint
for the web (office.com, free personal Microsoft account), Photoshop web, etc.
CAVEAT: web chrome ≠ Mac desktop chrome (single-line ribbon, no traffic
lights). Treat the **document canvas, typography, comment balloons, dialogs**
as ground truth; treat window chrome as directional only, and say so in the
manifest note.

### 3. Mac App Store screenshots (validated 2026-07-09)

Official, current-version, real-UI screenshots, no auth needed:

```bash
curl -s "https://itunes.apple.com/lookup?bundleId=com.microsoft.Word&country=us" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).results[0].screenshotUrls.join('\n')))"
```

- The returned mzstatic URLs end in a size spec (`.../800x500bb.jpg`) — edit it
  upward (`2400x1500bb.png`, or `0x0.png` for original) for full resolution.
- Find a bundle id: `curl "https://itunes.apple.com/search?term=<app>&entity=macSoftware"`.
- Known ids: `com.microsoft.Word`, `com.microsoft.Excel`,
  `com.microsoft.Powerpoint`. (Adobe apps are not on the Mac App Store.)
- These are lightly staged (marketing content in a real UI) — good for chrome
  geometry, colors, layout; discount the document content.

### 4. Official video frame-mining

Vendor YouTube channels (Microsoft 365, Adobe Creative Cloud, Figma) publish
tutorials and launch videos at 1080p–4K showing the real current UI in motion —
often the ONLY source for apps like Premiere Pro.

```bash
brew install yt-dlp                      # ffmpeg is already installed
yt-dlp -f "bv*[height>=1080]" -o video.mp4 "<url>"
ffmpeg -ss 00:01:23 -i video.mp4 -frames:v 1 frame-0123.png   # one still
ffmpeg -i video.mp4 -vf "fps=1/10" frames/%04d.png            # sweep
```

Pick frames where the UI is at rest (no zooms, cursors mid-gesture, or overlay
callouts). Record the video URL + timestamp as `--source` when filing.

### 5. Docs, help centers, press kits

support.microsoft.com, helpx.adobe.com, vendor newsrooms/press kits, release
blog posts. `npx hyperframes capture <url> --json` gives the richest public-page
capture (scroll screenshots, palette, fonts, Web Animations data). Staged —
discount accordingly.

### 6. Wayback Machine

For pinning what a specific older version looked like:
`https://web.archive.org/web/<YYYYMMDD>/<url>`.

### 7. Manual inbox (ask the user)

The user may have the app on another machine or an active subscription. Asking
for 3 targeted screenshots ("Excel, light mode, default workbook, whole
window, cmd+shift+4+space") is cheap and often the single highest-value move.
File with `tools/import-reference.mjs --method manual-inbox`.

### Filing rules

- Always a dated set: `reference/<family>/<YYYY-MM-DD>/<label>/` via
  `import-reference.mjs` with `--source` (URL/provenance) and `--method`.
- Reference sets are immutable once written; new material, new date dir.
- If you discover a durable new source for a family, append it to that
  family's `fallbacks` in `reference/sources.json` (keep it valid JSON).

## Part 1.5 — Motion ground truth (interaction recordings)

Static screenshots can't ground PACING — cursor speed, easing, beats between
actions, how state transitions actually look. Motion references live at
`reference/<family>/motion/<YYYY-MM-DD>/<label>/` with `clip.mp4`,
`frames/f-%03d.png` (extract at `fps=2` — the same cadence the motion judge
reads), and a tracked `manifest.json` (source URL + timestamp, app version,
what interaction the clip shows). Clips and frames stay local (gitignored —
size); the manifest is the shareable record.

Acquisition ladder for motion:

1. **Record the real app on this Mac** (`native-local` families: Finder,
   Calendar, menu bar, Chrome): `screencapture -v -V <seconds> clip.mov`
   records the screen for N seconds — perform the interaction by hand or drive
   it with computer-use (request_access first), then
   `ffmpeg -i clip.mov -vf fps=2 frames/f-%03d.png`.
2. **Web apps in the user's Chrome** (claude.ai, figma): the claude-in-chrome
   `gif_creator` tool records tab interactions; or screencapture -v the Chrome
   window while performing the story's interaction.
3. **Official video clips**: yt-dlp the vendor tutorial showing the same
   interaction (typing, clicking a layer, scrubbing a timeline), cut the
   relevant seconds — `ffmpeg -ss <t0> -t 8 -i video.mp4 clip.mp4` — then
   extract frames. Best source for Premiere/Office motion idiom.
4. **Web Animations extraction**: `npx hyperframes capture <url> --json`
   returns Web Animations API data (durations/easings) for public pages —
   numbers, not pixels, but they calibrate easing curves directly.

What to capture: the SAME story the demo tells (type-and-send, select a cell
and enter a formula, drag a playhead). 5–15 seconds is plenty. What matters
most is the APP'S RESPONSE to each interaction — control press/active states,
how typed text appears and commits (caret idiom, cell vs field editing), and
the native animations' durations and easing (selection outlines, loading
bars, panel/state transitions). The motion judge calibrates against these so
demo interactions are 1:1 with the real app, not plausible approximations.

## Part 2 — Asset sourcing ladder (icons, logos, fonts, cursors, wallpapers)

NEVER hand-draw a glyph, logo, or texture when a real one can be sourced —
hand-drawn assets are the #1 "reads as fake" tell. Work down:

1. **Repo assets**: `assets/icons/source-authentic/` +
   `assets/icons/sprite-manifest.json`, `assets/app-icons/`, `assets/fonts/`,
   `assets/cursors/`, `assets/wallpapers/` (+ `tools/wallpapers`).
2. **Offline icon index** (200k+ icons):
   `node tools/find-icon.mjs <terms> [--sets lucide,fluent,f7,simple-icons] --symbol`
   prints paste-ready `<symbol>` markup. Matching the real glyph matters more
   than staying inside one set.
3. **This Mac**: real app icons live in the bundles —
   `sips -s format png --resampleWidth 512 "/Applications/<App>.app/Contents/Resources/<name>.icns" --out icon.png`
   (also `/System/Applications`, `/System/Library/CoreServices`). System
   wallpapers under `/System/Library/Desktop Pictures`. System fonts are
   reference-only — measure them, do not commit Apple font files.
4. **Pinned donor repos**: `reference/open-source/` (restore or extend via
   `tools/clone-reference-repos.sh` — always pin a commit). Also npm packages
   that ship a vendor's real assets.
5. **The vendor's own web properties**: SVG logos and favicons from the app's
   site/CDN, official brand & press kits, simple-icons for brand marks.

Rules: prefer SVG (surfaces must stay editable/animatable); record provenance
in the nearest `NOTICE.md`; fidelity-first is the house stance — the only hard
line is the owner's private/logged-in material, which never gets committed.

## Part 3 — Who invokes this

- **fidelity-push, Reference phase**: per family, a health check grades the
  newest dated set (`fresh` / `stale` / `weak` / `missing`); anything below
  `fresh` dispatches an acquisition agent that works THIS ladder against the
  named gaps — capped at the 2–4 highest-value items, not an exhaustive crawl.
- **interaction-push, Motion refs phase**: per demo family, checks
  `reference/<family>/motion/` and acquires one story-matched clip via
  Part 1.5 when missing; the motion judge calibrates pacing against it.
- **drift-watch (weekly)**: cheap version probes (App Store lookup `version`
  field, installed-app Info.plist, vendor changelogs) decide which families
  get a fresh Part 1 capture and a drift diff vs the prior dated set.
- **onboard-app, Research/Capture phases**: the official-source sweep and the
  dated first capture both follow Part 1.
- **Fix agents**: any critique gap tagged as a sourceable-asset problem is
  resolved with Part 2, not with drawing.
