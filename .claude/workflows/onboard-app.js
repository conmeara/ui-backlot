export const meta = {
  name: 'onboard-app',
  description: 'Onboard a NET-NEW app family: research references, capture ground truth, write a measured spec, build the HTML surface, score + adversarial judge, register',
  whenToUse: 'When adding an app family that does not exist in the repo yet (e.g. Slack, Notion, Xcode). Args: {family: "slack", title: "Slack", urls: ["https://slack.com", ...], hints: "optional notes"}',
  phases: [
    { title: 'Research', detail: 'Availability probe + official-source reference sweep', model: 'haiku' },
    { title: 'Capture', detail: 'Dated ground-truth set via the best available tier', model: 'sonnet' },
    { title: 'Spec', detail: 'Measured visual spec from references + tokens', model: 'opus' },
    { title: 'Build', detail: 'Sonnet builds the composition per repo conventions', model: 'sonnet' },
    { title: 'Judge', detail: 'Score + critique/fix rounds + adversarial verdict', model: 'opus' },
    { title: 'Register', detail: 'Registry entry, capture script, sources.json, gates', model: 'haiku' },
  ],
}

const ROOT = '/Users/conmeara/Projects/ui-backlot'
const SCRATCH = '/private/tmp/ui-backlot-fidelity'

if (!args || !args.family || !args.title) {
  throw new Error('onboard-app requires args {family, title, urls?, hints?} — e.g. {family: "slack", title: "Slack", urls: ["https://slack.com/features"]}')
}
const FAM = args.family
const TITLE = args.title
const URLS = args.urls || []
const HINTS = args.hints || ''

// Every agent below may use EVERY tool it can reach: Bash, Read/Write/Edit,
// WebSearch/WebFetch, and — via ToolSearch — the claude-in-chrome MCP (the
// user's logged-in browser) and computer-use MCP (native apps; requires
// request_access approval). Ground truth beats memory at every step.
const TOOLBOX =
  'TOOLBOX (use everything that helps): Bash for repo scripts (npm run ..., node tools/...); ' +
  'WebSearch/WebFetch for official docs, help centers, press kits, design blogs; ' +
  'ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__computer" to drive the user\'s logged-in Chrome; ' +
  'ToolSearch "computer-use" + request_access to screenshot installed native apps. ' +
  'FIDELITY-FIRST: recreate the app as closely as possible — match real fonts, glyphs, logos, colors, and layout exactly (tracking a real asset to nail the look is fine). Build editable HTML/CSS/SVG because surfaces must animate for video. HARD LINES (safety/privacy, not licensing): never enter credentials or complete CAPTCHAs/bot checks — a human does those; keep the owner\'s private/logged-in captures out of git (gitignore covers reference/*/20*/**/screenshot* and elements.json) and use synthetic demo content in the tracked surface.'

const CONVENTIONS =
  'REPO CONVENTIONS (read before building): PRIMITIVES.md (atoms → shells → workflows), DESIGN.md, docs/fidelity-loop-plan-2026-07-05.md, an exemplar composition (compositions/codex-app.html is a good single-window example). ' +
  'A new surface = compositions/' + FAM + '-app.html with: foundation @import in the OUTER style block, a <template id="..."> wrapping the component, a stage div with data-composition-id/width/height, inline <svg><symbol> icons copied from assets/icons/source-authentic/ (never hand-drawn), namespaced CSS classes, and light theme first (.theme-dark later). ' +
  'It must render standalone via file:// for tools/capture-web-ui.mjs.'

const PROBE_SCHEMA = {
  type: 'object', required: ['tier', 'installedLocally', 'webReachable', 'sourcesFound', 'recommendation'], additionalProperties: false,
  properties: {
    tier: { enum: ['live-web', 'native-local', 'online-only', 'manual-inbox'] },
    installedLocally: { type: 'boolean' },
    webReachable: { type: 'boolean' },
    sourcesFound: { type: 'array', items: { type: 'object', required: ['url', 'what'], additionalProperties: false, properties: { url: { type: 'string' }, what: { type: 'string' } } } },
    recommendation: { type: 'string' },
  },
}

const CAPTURE_SCHEMA = {
  type: 'object', required: ['captured', 'refDir', 'hasTokens', 'hasScreenshots', 'notes'], additionalProperties: false,
  properties: {
    captured: { type: 'array', items: { type: 'string' } },
    refDir: { type: 'string' },
    hasTokens: { type: 'boolean' },
    hasScreenshots: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

const SPEC_SCHEMA = {
  type: 'object', required: ['specPath', 'palette', 'typography', 'structure', 'confidence'], additionalProperties: false,
  properties: {
    specPath: { type: 'string' },
    palette: { type: 'array', items: { type: 'string' } },
    typography: { type: 'array', items: { type: 'string' } },
    structure: { type: 'array', items: { type: 'string' } },
    confidence: { enum: ['measured', 'visual-estimate', 'product-knowledge'] },
  },
}

const BUILD_SCHEMA = {
  type: 'object', required: ['file', 'captureScript', 'captureOk', 'notes'], additionalProperties: false,
  properties: {
    file: { type: 'string' },
    captureScript: { type: 'string' },
    captureOk: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

const JUDGE_SCHEMA = {
  type: 'object', required: ['verdict', 'tokenScore', 'gaps', 'summary'], additionalProperties: false,
  properties: {
    verdict: { enum: ['ship', 'prototype', 'rebuild'] },
    tokenScore: { type: ['number', 'null'] },
    gaps: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
}

const REGISTER_SCHEMA = {
  type: 'object', required: ['registryOk', 'sourcesOk', 'catalogOk', 'notes'], additionalProperties: false,
  properties: {
    registryOk: { type: 'boolean' },
    sourcesOk: { type: 'boolean' },
    catalogOk: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

log('Onboarding new family "' + FAM + '" (' + TITLE + ')')

// ---- Phase 1: Research (probe + reference sweep in parallel) ----
phase('Research')
const [probe, sweep] = await parallel([
  () => agent(
    'Availability probe for onboarding the app "' + TITLE + '" into ' + ROOT + '.\n' +
    'Determine the best ground-truth acquisition tier for THIS machine:\n' +
    '1. Installed natively? Check /Applications (and mdfind if needed).\n' +
    '2. Web app reachable? Load ToolSearch chrome tools, tabs_context_mcp, and check whether ' + (URLS[0] || 'the app\'s web client') + ' is reachable and whether the user appears logged in (do NOT log in yourself; do NOT complete bot checks).\n' +
    '3. Otherwise: online-only (official docs/press screenshots).\n' +
    HINTS + '\n' + TOOLBOX + '\n' +
    'Return tier (live-web if a logged-in/public web client is usable, native-local if installed, else online-only), what you verified, and a one-line recommendation for how weekly re-capture should work for this family.',
    { label: 'probe:' + FAM, phase: 'Research', model: 'haiku', schema: PROBE_SCHEMA }
  ),
  () => agent(
    'Official-source reference sweep for the app "' + TITLE + '".\n' +
    'Find the highest-fidelity OFFICIAL imagery of the current UI: help-center articles, official docs, press kit, release notes, design blog posts. Starting points: ' + (URLS.join(', ') || 'search for them') + '.\n' +
    'Save the best screenshots (max 10, current-version UI only) to ' + ROOT + '/reference/' + FAM + '/actual-app/ and write source-index.json there following the exact pattern of reference/figma/actual-app/source-index.json (capturedAt, assetDecision, refs[] with file/page/url/note). Use curl or WebFetch to download; verify each file is a real image (file command).\n' +
    TOOLBOX,
    { label: 'sweep:' + FAM, phase: 'Research', model: 'sonnet', schema: CAPTURE_SCHEMA }
  ),
])

if (!probe) throw new Error('availability probe failed — cannot pick a capture tier')
log('probe:' + FAM + ' → tier ' + probe.tier + '; sweep found ' + (sweep ? sweep.captured.length : 0) + ' official refs')

// ---- Phase 2: Capture ground truth via the best tier ----
phase('Capture')
const capture = await agent(
  'Capture a DATED ground-truth reference set for "' + TITLE + '" (family: ' + FAM + ') in ' + ROOT + ', tier: ' + probe.tier + '.\n' +
  'Follow docs/fidelity-loop-plan-2026-07-05.md ("Working capture procedure"). By tier:\n' +
  '- live-web PUBLIC page: npm run reference:capture -- <url> --family ' + FAM + ' --label web-app --viewport 1440x900 (writes screenshot+tokens+manifest).\n' +
  '- live-web LOGGED-IN app: drive the user\'s Chrome via claude-in-chrome (ToolSearch first): open the app tab, inject tools/extract-ui-tokens.js via javascript_tool, run extractUiTokens(null,{slim:true}), stash in window.__backlotDump, read it out in ~800-char slices, write to a temp file, then node tools/import-reference.mjs --family ' + FAM + ' --label web-app-light --tokens <file> --method claude-in-chrome. For pixels use the beacon + screencapture + tools/crop-to-beacons.mjs procedure from the plan doc (verify the captured image IS the app before filing).\n' +
  '- native-local: fixed window size, screencapture via Bash (or computer-use screenshot after request_access), file with import-reference.mjs --image.\n' +
  '- online-only: the Research sweep already saved official refs; import the 2-3 best as a dated set (import-reference.mjs --image --method online-only) so drift detection has a baseline. For public URLs ALSO try npx hyperframes capture <url> -o reference/' + FAM + '/hf-capture --json (first-party rich capture: scroll screenshots, palette, fonts, assets, Web Animations data — the only source of MOTION ground truth; it may timeout on bot-checked pages, which is fine, move on).\n' +
  'NEVER log in, never complete verification checkboxes — if blocked, capture what is public and say so in notes.\n' + TOOLBOX,
  { label: 'capture:' + FAM, phase: 'Capture', model: 'sonnet', schema: CAPTURE_SCHEMA }
)

// ---- Phase 3: Measured spec ----
phase('Spec')
const spec = await agent(
  'Write the measured visual spec for "' + TITLE + '" (family ' + FAM + ') in ' + ROOT + '.\n' +
  'Inputs: reference/' + FAM + '/ (dated sets: tokens.json = computed styles when available; screenshots; actual-app/ official refs' + (sweep ? '' : ' — may be sparse') + ').\n' +
  'Read tokens.json first when present (numbers beat eyes); otherwise measure from the reference images (Read renders them — zoom into detail crops by cropping mentally, state px estimates as estimates).\n' +
  'Produce docs/specs/' + FAM + '-spec.md: palette (hex + role), typography (family/size/weight per text role), chrome structure (titlebar/toolbar/sidebar/content regions with px), icon needs mapped to assets/icons/sprite-manifest.json families, and an explicit "do not include" list for anything uncertain (ABSTRACTION PRINCIPLE: fewer correct controls read as more real).\n' +
  'CRITICAL — NUMBERED ELEMENT CHECKLIST: research shows the dominant build failure is element OMISSION (models given whole screenshots dropped 85% of elements — docs/research/ui-recreation-methods-2026-07-05.md). The spec MUST enumerate every visible element as a numbered checklist item (n, name, region, approx geometry, source evidence). Only elements visible in references — inventing controls is the #1 past failure mode. The builder verifies each number off; the judge audits against this list.\n' +
  'Also segment the reference into 3-8 REGIONS (titlebar/sidebar/content/composer etc.) with pixel bounds — the builder works region-by-region.\n' +
  'State confidence honestly: measured / visual-estimate / product-knowledge.',
  { label: 'spec:' + FAM, phase: 'Spec', model: 'opus', effort: 'high', schema: SPEC_SCHEMA }
)
if (!spec) throw new Error('spec stage failed')
log('spec:' + FAM + ' → ' + spec.specPath + ' (' + spec.confidence + ')')

// ---- Phase 4: Build ----
phase('Build')
const build = await agent(
  'Build the first HTML surface for "' + TITLE + '" in ' + ROOT + '.\n' +
  CONVENTIONS + '\n\n' +
  'THE SPEC (follow it exactly; do not add controls it does not list): read ' + spec.specPath + '.\n\n' +
  'BUILD METHOD (research-backed, docs/research/ui-recreation-methods-2026-07-05.md — the failure to avoid is ELEMENT OMISSION):\n' +
  '1. SHELL FIRST: build the page-level window/layout skeleton with each spec REGION as an empty placeholder block sized to its pixel bounds. Capture and check global proportions before any content.\n' +
  '2. REGION BY REGION: fill one region at a time from the spec + measured tokens (measurements first, screenshot for verification — tokens.json is ground truth for colors/typography/radii). Repeated structures (list rows, cards, tabs) get ONE reusable pattern + per-instance content, not copy-paste variations.\n' +
  '3. ASSEMBLY: if a region resists clean flow layout, absolute positioning inside the region wrapper (anchored to spec bounds) is acceptable — a deterministic capture kit favors positional accuracy over responsive purity.\n' +
  '4. OMISSION CHECK: walk the spec\'s numbered element checklist; every item is present or explicitly skipped with a reason. Count elements in your capture vs the checklist.\n' +
  '5. Add a capture script to package.json: "capture:' + FAM + '-app": "node tools/capture-web-ui.mjs compositions/' + FAM + '-app.html --slug surface-' + FAM + '-app --selector \'.' + FAM + '-app-window\' --viewport <spec size>".\n' +
  '6. ITERATE 3-5 rounds: npm run capture:' + FAM + '-app, Read the PNG vs references, and if tokens.json exists run node tools/fidelity-score.mjs --label ' + FAM + '-app-build --ours captures/surface-' + FAM + '-app/capture.json --theirs <newest reference tokens.json> and chase its deltas element-by-element (localized fixes, not whole-page rewrites). Stop early when the score plateaus (<0.005 gain).\n' +
  'Do not edit styles/backlot-foundation.css, tools/, or runtime/. Do not run git commands.',
  { label: 'build:' + FAM, phase: 'Build', model: 'sonnet', effort: 'high', schema: BUILD_SCHEMA }
)
if (!build || !build.captureOk) throw new Error('build stage did not produce a working capture: ' + (build ? build.notes : 'no result'))

// ---- Phase 5: Adversarial judge + fix rounds ----
phase('Judge')
let judge = null
for (let round = 1; round <= 2; round += 1) {
  judge = await agent(
    'Adversarial judgment of a BRAND-NEW surface: ' + build.file + ' in ' + ROOT + ' (round ' + round + ').\n' +
    'You did not build it; be skeptical. Read captures/surface-' + FAM + '-app/target.png and every reference under reference/' + FAM + '/. If a dated tokens.json exists, run node tools/fidelity-score.mjs --label ' + FAM + '-app-judge-r' + round + ' --ours captures/surface-' + FAM + '-app/capture.json --theirs <newest tokens.json> and report tokenOverall (null if no tokens exist).\n' +
    'List the gaps that make it read as fake, most severe first, each as a directly implementable spec (px/hex/weight/symbol-id/element-to-DELETE).\n' +
    'verdict: "ship" (registry status ready), "prototype" (usable, keep status prototype), "rebuild" (fundamentally off).',
    { label: 'judge:' + FAM + ':r' + round, phase: 'Judge', model: 'opus', effort: 'high', schema: JUDGE_SCHEMA }
  )
  if (!judge || judge.verdict === 'ship' || judge.gaps.length === 0) break
  log('judge:' + FAM + ' round ' + round + ' → ' + judge.verdict + ', ' + judge.gaps.length + ' gap(s); fixing')
  await agent(
    'Fix these judged gaps in ' + build.file + ' (ONLY that file) in ' + ROOT + ':\n' + JSON.stringify(judge.gaps, null, 1) + '\n' +
    'Rules: real symbols from assets/icons/source-authentic/ only; remove what cannot be rendered right; beware the CSS cascade (grep for later duplicate selectors). Recapture with npm run ' + build.captureScript + ' and verify visually. No git commands.',
    { label: 'fix:' + FAM + ':r' + round, phase: 'Judge', model: 'sonnet', schema: BUILD_SCHEMA }
  )
}

// ---- Phase 6: Register ----
phase('Register')
const register = await agent(
  'Register the new surface in ' + ROOT + ' repo metadata:\n' +
  '1. surfaces/registry.json: add an entry for surface-' + FAM + '-app following an existing surface entry\'s exact field shape (id/title/kind/status/fidelity/dimensions/source/capture/tags/sourceEvidence/assetDecision/recommendedUse). status: "' + (judge && judge.verdict === 'ship' ? 'ready' : 'prototype') + '". sourceEvidence: cite reference/' + FAM + '/ paths.\n' +
  '2. reference/sources.json: add a "' + FAM + '" family entry (tier ' + probe.tier + ', targets from the capture manifest, availability from the probe: ' + probe.recommendation + ').\n' +
  '3. .claude/workflows/fidelity-push.js: add a FAMILIES entry for "' + FAM + '" (criticModel opus, the new surface, refDir reference/' + FAM + ', refs describing what ground truth exists' + (capture && capture.hasTokens ? ', scoreRef + json fields since measured tokens exist' : '') + ').\n' +
  '4. Run: npm run registry:check && npm run catalog:generate — both must pass.\n' +
  'Report registryOk, sourcesOk (sources.json valid JSON), catalogOk.',
  { label: 'register:' + FAM, phase: 'Register', model: 'haiku', schema: REGISTER_SCHEMA }
)

return {
  family: FAM,
  tier: probe.tier,
  officialRefs: sweep ? sweep.captured : [],
  groundTruth: capture ? { refDir: capture.refDir, hasTokens: capture.hasTokens, hasScreenshots: capture.hasScreenshots } : null,
  spec: spec.specPath,
  surface: build.file,
  verdict: judge ? judge.verdict : 'unjudged',
  tokenScore: judge ? judge.tokenScore : null,
  remainingGaps: judge ? judge.gaps : [],
  registered: register,
}
