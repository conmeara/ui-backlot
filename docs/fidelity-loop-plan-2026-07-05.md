# Fidelity Loop — System Plan (2026-07-05)

Goal: a repeatable system where agents capture ground truth from the real apps,
measure our surfaces against it with numbers instead of adjectives, close the
measured gaps, and re-run weekly as the apps change.

This builds on what already exists — the fidelity-push harness
(`.claude/workflows/fidelity-push.js`), the capture pipeline
(`tools/capture-web-ui.mjs`), and the registry (`surfaces/registry.json`).
What was missing: fresh ground truth, a mechanical measuring stick, and a
schedule. This plan adds those.

## The loops

### Loop A — Ground-truth capture

`tools/capture-web-ui.mjs` already extracts computed styles, token frequency
tables, and element geometry — but only from *our* HTML. Loop A points the same
extractor (`tools/extract-ui-tokens.js`, shared payload) at the real apps and
stores dated reference sets:

```
reference/<family>/<YYYY-MM-DD>/<label>/
  screenshot.png      # real-app pixels at a declared viewport
  tokens.json         # computed-style dump, same shape as captures/*/capture.json
  visible-text.md     # text inventory for structure checks
reference/<family>/<YYYY-MM-DD>/manifest.json   # source, method, app version, theme
```

Not every family is capturable the same way. `reference/sources.json` declares
an **acquisition tier** per family so the loop degrades gracefully instead of
failing:

| Tier | Meaning | Families | Method |
| --- | --- | --- | --- |
| `live-web` | Real app reachable in a browser on this machine | claude (claude.ai), figma, codex (web) | Agent-driven capture in the **user's own Chrome** (claude-in-chrome MCP: logged-in session, inject extractor, save tokens) or Playwright for public pages. |
| `native-local` | Installed macOS app | finder, macos menu bar, calendar | `screencapture` / computer-use screenshots at a fixed window size. No style extraction possible — pixels + measured crops only. |
| `online-only` | App not installed / not accessible here | word, excel, powerpoint, premiere | Weekly re-scrape of official docs, help-center, press kits, launch-video frame studies (the existing `reference/figma/actual-app/source-index.json` pattern, generalized). For public URLs prefer `npx hyperframes capture <url> --json` (first-party, richer than our Playwright path: scroll-depth screenshots, pixel-sampled palette with oklch, font files, semantically named assets, and **Web Animations API extraction** — the only motion ground truth in the pipeline). Cloudflare-fronted pages still time out — same no-bypass rule applies. |
| `manual-inbox` | Human-provided screenshots | any (esp. Claude desktop app states agents can't reach) | User drops PNGs anywhere; `tools/import-reference.mjs` files them into a dated set with a manifest entry. First-class citizens of the loop. |

Acquisition recipes — including the no-auth sources for apps this machine
doesn't have (Mac App Store screenshot API, free web versions of desktop apps,
official-video frame mining, press kits, Wayback) — live in
`docs/reference-and-asset-sourcing.md`. fidelity-push opens with a per-family
**Reference phase**: a Haiku health check grades the newest dated set
(`fresh`/`stale`/`weak`/`missing`) and anything below `fresh` dispatches a
Sonnet acquisition agent that works that playbook against the named gaps
before any critic runs — bad or missing references never silently feed a
critique again.

Two constraints this design absorbs deliberately:

1. **Agents cannot drive the Claude desktop app.** The desktop app is Electron
   wrapping the same UI as claude.ai, so `live-web` capture of claude.ai in the
   user's Chrome is the primary ground truth; desktop-only chrome (title bar,
   traffic-light inset) comes through the manual inbox.
2. **Some apps are not on this machine.** Their families run at `online-only`
   tier: the references are staged marketing/docs shots, which the critic
   already knows to discount (`referenceQuality` field). If the app becomes
   available, flip the tier in `sources.json` — nothing else changes.

Asset stance: fidelity-first — recreate as closely as possible, matching real
fonts/glyphs/logos where it improves the look. The only default is privacy: the
owner's own logged-in captures (session screenshots, `elements.json`) stay
local, and surfaces use synthetic demo content.

### Loop B — Drift detection (the weekly trigger)

Implemented as `.claude/workflows/drift-watch.js` (2026-07-09). Weekly run,
kept deliberately cheap (Haiku probes; Sonnet only for actual captures):

1. **Probe** — one sweep of version signals per family: Mac App Store lookup
   API (`version` + `currentVersionReleaseDate`), installed-app Info.plist
   versions, vendor release-notes pages — compared against
   `reports/drift/state.json`.
2. **Capture** — a fresh reference set (Loop A, cheapest tier) ONLY for
   families whose version moved or whose newest set is older than 45 days.
3. **Diff** — token score between the two newest dated sets + pixel diff of
   same-label screenshots → `drifted` / `stable` / `inconclusive`.
4. **Report** — `reports/drift/<date>.json` + state update + a work order
   naming the exact `fidelity-push {families:[...]}` runs to do. (GitHub
   issue filing can be layered on once CI exists.)

Scheduling split (because CI has no desktop, and no logged-in sessions):

- **Local weekly session** (scheduled Claude Code task on this Mac):
  `live-web` captures via the user's Chrome + `native-local` screenshots.
- **CI weekly cron** (GitHub Actions, once set up): `online-only` scrapes,
  drift scoring, issue filing, gallery regeneration.

### Loop C — Rebuild pass with a hard bar (fidelity-push v2)

fidelity-push keeps its critique → fix → adversarial-judge → gate shape. What
changes: verdicts are anchored to a **scorecard**, not adjectives.

Per surface, `tools/fidelity-score.mjs` produces:

1. **Token match score** (0–1) — weighted comparison of our
   `captures/<slug>/capture.json` against the reference `tokens.json`:
   colors (nearest-hex distance, frequency-weighted), typography
   (family/size/weight tuples), radii, shadows. Emits a ranked `deltas` list —
   concrete, fixable statements ("real: 14px/510 weight; ours: 13px/600").
2. **Pixel score** — screenshot diff. Only meaningful between same-layout
   images (our surface vs our previous baseline = regression gate; our surface
   vs real app = directional, judge-interpreted).
3. **Stranger test** — a fresh-context judge sees the two images unlabeled:
   "one is real — which, and what gave it away?" Its tells feed the next
   critique round. The bar: the judge can't reliably tell, or lists no
   illusion-breaking tells.

Loop C runs until the scorecard stops improving. The builder never grades
itself; judges get fresh context and actual pixels. Reports live in
`reports/fidelity/` (tracked in git — they are the lineage).

### Loop D — Motion fidelity (interaction-push)

`.claude/workflows/interaction-push.js`: per-demo author → render → frame-level
Opus motion judge → Sonnet fix rounds → ship GIF + README row. Since
2026-07-09 it opens with a **Motion refs** phase: per app family it looks for
real interaction recordings under `reference/<family>/motion/<date>/` and
acquires one when missing (screencapture -v of local apps, Chrome recordings,
official-video clips — playbook Part 1.5); the judge calibrates cursor speed,
easing, and beat length against those frames instead of intuition.

### Loop E — Publish sync (derived artifacts)

`.claude/workflows/publish-sync.js`: whenever surfaces change (any loop above,
or manual edits), re-sync everything downstream — `docs/catalog.md`, the
committed HyperFrames `registry/`, the GitHub Pages catalog
(`docs/index.html` + thumbs), review pages, the demo GIFs whose surfaces
changed (scoped by git diff, `{full:true}` for all), quickstart render, and
stale README counts/claims — then gate and emit a publish manifest. No
judgment stages: Haiku/Sonnet only. Run it before any push that touched
surfaces; the intended cadence is fidelity-push / interaction-push →
publish-sync → human commit.

### Loop F — Consumer smoke test (the outside view)

`.claude/workflows/consumer-smoke.js`: a Sonnet "stranger" whose only allowed
knowledge is the public docs installs surfaces from the committed `registry/`
(`{remote:true}` = the raw.githubusercontent URL real consumers hit), composes
a demo per the documented pattern, and renders it. Every stumble is a typed
friction finding (`docs-gap`, `broken-install`, `broken-asset`, …) with a
suggested fix; the report lands in `reports/smoke/`. Every other gate runs
in-repo — this is the only loop that tests what an external HyperFrames user
actually experiences. Run before registry/README-touching releases.

## Onboarding a net-new app family

`.claude/workflows/onboard-app.js` is the front door of the loop — run it with
`{family, title, urls}` when adding an app the repo has never covered:

1. **Research** — parallel probe (installed locally? web client reachable?
   picks the acquisition tier for this machine) + official-source sweep
   (docs/help-center/press screenshots into `reference/<family>/actual-app/`
   with a `source-index.json`, following the figma pattern).
2. **Capture** — a dated ground-truth set via the best tier, reusing the exact
   procedures in this doc (agents may load claude-in-chrome / computer-use via
   ToolSearch; they never log in or touch bot checks).
3. **Spec** — `docs/specs/<family>-spec.md`, measured where tokens exist,
   honest about confidence, with an explicit "do not include" list.
4. **Build** — the composition, capture script, and score-chasing iteration.
5. **Judge** — adversarial rounds with ship/prototype/rebuild verdicts.
6. **Register** — registry.json, sources.json, and a fidelity-push FAMILIES
   entry, so the weekly loop owns the new family from day one.

Model policy across all loop workflows: **Opus is the ceiling — never Fable
in loops** (cost; owner directive 2026-07-09). Opus where judgment is the
product (critique, spec, judge, stranger test); Sonnet for build/fix
iteration and reference acquisition; Haiku for mechanical stages (scoring
commands, file staging, gates, registration, reference health checks).

## Rollout — status as of 2026-07-06

- **Phase 1 ✅** extractor + live-reference tools + scorer + `sources.json` +
  dated live claude.ai ground truth (tokens + local-only elements/screenshots).
- **Phase 2 ✅** fidelity-push v3: Score phase feeds critics; fix agents work
  the scorer's typed element repairs directly and loop up to 4 rounds with a
  0.005 plateau stop; Opus judge gives per-surface PAIRWISE verdicts
  (before-vs-after against the reference) under the deterministic no-regression
  bar; stranger test on neutral-named pairs; Haiku on mechanical stages.
  Scorer v2: element matching + CIEDE2000 + typed repairs; odiff (AA-aware,
  native) for same-dimension pixel diffs with canvas fallback;
  `tools/find-icon.mjs` searches 200k+ icons offline and prints paste-ready
  <symbol> markup (`npm run icons:find -- <terms> --symbol`).
  First scored passes: claude-composed-app 0.828→0.859, claude-home
  0.822→0.871 (pass 113, run before the convergence loop existed).
- **Phase 2.5 ✅ (2026-07-09)** Reference phase in fidelity-push (per-family
  health check + conditional acquisition via
  `docs/reference-and-asset-sourcing.md`); `sources.json` enriched with
  no-auth sources (app-store-api screenshots, office.com web apps,
  video-frame-mine); asset-sourcing ladder wired into fixer rules + critic
  prompts (source real assets, never redraw); Fable removed from loop models.
- **Phase 3 ✅ (2026-07-09)** Loop B shipped as `drift-watch.js` (version
  probes → conditional capture → drift diff → work order in `reports/drift/`);
  Loop E shipped as `publish-sync.js` (catalog/registry/Pages/GIF/README
  re-sync scoped by git diff); interaction-push gained the Motion refs phase
  (real-recording pacing calibration). Remaining from old Phase 3: actually
  SCHEDULE the weekly drift-watch session, and roll the stopped-v1 leftover
  families through their first v3 fidelity pass.
- **Phase 4:** GitHub Actions (registry gates, capture sweep on changed
  surfaces, pixel-regression vs committed baselines, PR diff comments),
  GitHub Pages gallery from `catalog:generate` with per-surface scores,
  issue templates pre-filled by the drift bot.
- **Research backlog (documented, not wired):** TreeBLEU structural axis,
  motion-fidelity scoring from hyperframes `animations.json`, designlang
  token-extraction pilot, CLIP/DreamSim perceptual composite.

## Working capture procedure for claude.ai (validated 2026-07-05)

Cloudflare blocks Playwright — headless outright, and headed until a human
clears the verification once per profile. Never automate that checkbox. The
validated path uses the user's own Chrome (which Cloudflare trusts):

1. **Tokens**: via claude-in-chrome MCP — inject `tools/extract-ui-tokens.js`,
   call `extractUiTokens(null, {slim:true})` (slim = no personal text), stash
   in `window.__backlotDump`, read out in ~800-char slices (tool output caps
   near 1KB), file with `tools/import-reference.mjs --tokens`.
2. **Pixels**: requires Screen Recording permission. Add a top-left magenta
   beacon in-page, AppleScript the claude.ai tab/window to front,
   `screencapture -x -R"<window bounds>"` (beacon shot), remove beacon,
   capture again (clean shot), then
   `node tools/crop-to-beacons.mjs beacon.png out.png --viewport WxH --dpr 2
   --apply-to clean.png`. Normalize page zoom to 100% (cmd+0) first.
   File with `import-reference.mjs --image`. Racy while the user is actively
   switching windows — capture immediately after fronting the tab.
3. If the Playwright profile (`.playwright-profile/`, gitignored) ever gets a
   human-cleared Cloudflare cookie, `--profile --headed` captures become the
   simpler path; the tool aborts without writing when it sees a bot check.

## Invariants (house rules)

- Ground truth beats memory: no fix lands citing "product knowledge" when a
  dated reference set exists for the family.
- Builder ≠ judge, always fresh context for judges.
- Reference sets are immutable once written; new week, new directory.
- Scores must move or the pass stops — no unfalsifiable "improved" verdicts.
- Fidelity-first: recreate as closely as possible. The only asset default is
  privacy — the owner's logged-in captures stay local.
