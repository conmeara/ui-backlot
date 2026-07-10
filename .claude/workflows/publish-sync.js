export const meta = {
  name: 'publish-sync',
  description: 'Bring every derived artifact back in sync with the surfaces: catalog, HyperFrames registry, Pages site, review pages, demo GIFs, README copy',
  whenToUse: 'Run after surfaces change (a fidelity/interaction/consolidation pass, onboarding, or manual edits) so the GitHub-facing catalog, site, README, and sample videos never go stale. Args: {since: "<git ref>"} to widen change detection (default HEAD~1 + working tree); {full: true} to refresh ALL demo media regardless of what changed.',
  phases: [
    { title: 'Detect', detail: 'Diff since last publish → changed surfaces, affected demos and derived artifacts', model: 'haiku' },
    { title: 'Regenerate', detail: 'catalog.md + HyperFrames registry + inventory + Pages catalog + review pages', model: 'haiku' },
    { title: 'Media', detail: 'Re-render + re-GIF only the demos whose surfaces changed; quickstart render if affected', model: 'sonnet' },
    { title: 'Docs', detail: 'README demo table, stale counts and claims', model: 'sonnet' },
    { title: 'Gate', detail: 'Registry, lint-baseline, and staleness checks; publish manifest', model: 'haiku' },
  ],
}

// MODEL POLICY: no judgment stage in this loop — Haiku for mechanical work,
// Sonnet where edits need care (media pipeline, README copy). Never Opus or
// Fable here; publishing is bookkeeping, not critique.
const ROOT = '/Users/botbot/Projects/ui-backlot'
const SCRATCH = ROOT + '/workspace/publish'

let argv = args
if (typeof argv === 'string') { try { argv = JSON.parse(argv) } catch { argv = undefined } }
const SINCE = argv && argv.since ? String(argv.since) : 'HEAD~1'
const FULL = !!(argv && argv.full)

const DETECT_SCHEMA = {
  type: 'object', required: ['changedCompositions', 'affectedDemos', 'quickstartAffected', 'registryChanged', 'notes'], additionalProperties: false,
  properties: {
    changedCompositions: { type: 'array', items: { type: 'string' } },
    changedCaptureScripts: { type: 'array', items: { type: 'string' } },
    affectedDemos: { type: 'array', items: { type: 'object', required: ['example', 'gif'], additionalProperties: false, properties: { example: { type: 'string' }, gif: { type: 'string' } } } },
    quickstartAffected: { type: 'boolean' },
    registryChanged: { type: 'boolean' },
    assetsChanged: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

const RUN_SCHEMA = {
  type: 'object', required: ['ran', 'failures', 'notes'], additionalProperties: false,
  properties: {
    ran: { type: 'array', items: { type: 'string' } },
    failures: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

const MEDIA_SCHEMA = {
  type: 'object', required: ['refreshed', 'failures', 'notes'], additionalProperties: false,
  properties: {
    refreshed: { type: 'array', items: { type: 'string' } },
    failures: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

const DOCS_SCHEMA = {
  type: 'object', required: ['updated', 'staleClaimsFixed', 'notes'], additionalProperties: false,
  properties: {
    updated: { type: 'array', items: { type: 'string' } },
    staleClaimsFixed: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

const GATE_SCHEMA = {
  type: 'object', required: ['registryOk', 'hfRegistryOk', 'lintErrors', 'newLintErrors', 'readyToCommit', 'notes'], additionalProperties: false,
  properties: {
    registryOk: { type: 'boolean' },
    hfRegistryOk: { type: 'boolean' },
    lintErrors: { type: 'integer' },
    newLintErrors: { type: 'array', items: { type: 'string' } },
    readyToCommit: { type: 'boolean' },
    changedFiles: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

// ---- Phase 1: Detect what changed ----
phase('Detect')
const detect = await agent(
  'Change detection for a publish-sync pass in ' + ROOT + ' (work from that root). READ-ONLY git is allowed here (diff/status/log) — never commit/stash/checkout.\n' +
  'Collect the union of: git diff --name-only ' + SINCE + ' HEAD, plus uncommitted work (git status --porcelain).\n' +
  'From that set determine:\n' +
  '1. changedCompositions: files under compositions/ (and styles/ or assets/ changes that visually affect surfaces — set assetsChanged too).\n' +
  '2. affectedDemos: interaction examples whose visuals depend on a changed file. An example is affected if (a) it changed itself, or (b) it mounts a changed composition — grep examples/*.html for each changed composition filename (data-backlot-mount-src), or (c) it inlines a recreation of the same app (match by family keyword in the filename, e.g. excel-interaction.html ↔ excel-workbook.html). For each affected example return {example, gif: "docs/media/<basename>-interaction.gif" or the matching existing GIF name — verify with ls docs/media/}.\n' +
  '3. quickstartAffected: true if examples/quickstart-demo.html or any composition it mounts changed.\n' +
  '4. registryChanged: surfaces/registry.json in the set.\n' +
  (FULL ? 'NOTE: the caller passed full=true — still report accurately, the media phase will refresh everything anyway.\n' : '') +
  'Be precise: the media phase re-renders exactly what you list.',
  { label: 'detect', phase: 'Detect', model: 'haiku', effort: 'low', schema: DETECT_SCHEMA }
)
if (!detect) throw new Error('change detection failed')
log('Detected: ' + detect.changedCompositions.length + ' composition(s), ' + detect.affectedDemos.length + ' affected demo(s)' + (detect.registryChanged ? ', registry changed' : ''))

// ---- Phase 2: Regenerate derived artifacts (cheap + deterministic: always) ----
phase('Regenerate')
const capScripts = (detect.changedCaptureScripts || [])
const regen = await agent(
  'Regenerate derived artifacts in ' + ROOT + ' (work from that root). Write a bash script to ' + SCRATCH + '/regen.sh (mkdir -p ' + SCRATCH + ') and execute it. Steps, sequential; record failures but keep going:\n' +
  (capScripts.length ? '0. Refresh captures for changed surfaces first (thumbnails feed the Pages catalog): ' + capScripts.map(s => 'npm run ' + s).join('; ') + '\n' : '') +
  '1. npm run catalog:generate\n' +
  '2. npm run registry:hf:generate\n' +
  '3. npm run inventory:generate\n' +
  '4. npm run pages:catalog   (rebuilds docs/index.html + thumbs for GitHub Pages)\n' +
  '5. npm run compare:page && npm run gallery:page   (review pages)\n' +
  'Return ran (step names), failures (step + exact error line), notes.',
  { label: 'regenerate', phase: 'Regenerate', model: 'haiku', effort: 'low', schema: RUN_SCHEMA }
)

// ---- Phase 3: Refresh media for affected demos only (or all with full:true) ----
phase('Media')
let mediaTargets = FULL ? null : (detect.affectedDemos || [])
let media = null
if (FULL || (mediaTargets && mediaTargets.length) || detect.quickstartAffected) {
  media = await agent(
    'Refresh demo media in ' + ROOT + ' (work from that root).\n' +
    (FULL
      ? 'Scope: ALL interaction examples that have a GIF in the README demo table (ls examples/*-interaction.html + examples/mac-multi-app-demo.html; match each to its docs/media/*.gif).\n'
      : 'Scope: EXACTLY these demos:\n' + JSON.stringify(mediaTargets, null, 1) + '\n') +
    'SHIPPED-ONLY RULE: this is a REFRESH — only re-render demos whose GIF already exists in docs/media/. Never create a first GIF for a demo that has none: shipping a new demo is interaction-push\'s judged decision (its motion judge must pass it), not a sync side effect. Skip GIF-less demos and list them in notes.\n' +
    'For each: render mp4 (npx hyperframes render --composition <example> --quality draft --low-memory-mode --output renders/<basename>.mp4), then convert to GIF with the repo recipe:\n' +
    'ffmpeg -y -v error -i <mp4> -vf "fps=50/3,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" <gif>\n' +
    'Verify each GIF with ffprobe (exists, same dimensions as mp4, under 25MB — if larger, drop fps to 12 and retry). Overwrite the existing docs/media GIF in place so README links keep working.\n' +
    (detect.quickstartAffected || FULL ? 'ALSO re-render the quickstart sample video: npm run example:quickstart:render (expect ~14s video).\n' : '') +
    'A render that errors = investigate the example did not regress (read the error; if a changed composition broke the mount, report it in failures — do NOT edit compositions here).\n' +
    'Do NOT run any git commands. Return refreshed (gif/video paths), failures, notes.',
    { label: 'media', phase: 'Media', model: 'sonnet', schema: MEDIA_SCHEMA }
  )
} else {
  log('No affected demos and quickstart untouched — skipping media refresh')
}

// ---- Phase 4: README + stale claims ----
phase('Docs')
const docs = await agent(
  'Docs-sync pass in ' + ROOT + ' (work from that root). The catalog/registry/pages were just regenerated' + (media ? ' and these media files were refreshed: ' + JSON.stringify((media.refreshed || []).slice(0, 20)) : '') + '.\n' +
  'Fix what is stale AND keep the public story current — but keep every diff small and reviewable:\n' +
  '1. README demo table ("App interactions"): every row\'s GIF exists in docs/media/. Fix broken image paths; do not reorder rows. NEVER add a row for a demo that has no row yet — new rows are added by interaction-push\'s Ship phase after its motion judge passes the demo, not by this sync. Report GIF-less or row-less demos in notes instead.\n' +
  '2. Stale COUNTS/CLAIMS in README.md and CONTRIBUTING.md: surface counts, wallpaper counts, family lists. Compute truth from surfaces/registry.json (node -e with JSON.parse) and docs/catalog.md, then correct any number that drifted.\n' +
  '3. docs/catalog.md is generated — never hand-edit it; if it looks wrong, report in notes instead.\n' +
  '4. CAPABILITY FRESHNESS (proactive): compare what README.md / CONTRIBUTING.md advertise against what the repo actually offers now — read each .claude/workflows/*.js meta block (name/description/whenToUse) and skim docs/ for guides the entry docs never mention. Where something user-relevant is missing or stale, add a concise mention in the right home: consumer-facing capability → README; contributor loop/workflow → CONTRIBUTING.md (AGENTS.md is agent-maintained, leave it). Match the surrounding tone and brevity.\n' +
  '5. EASE-OF-USE (the bar is VISION.md — read it first): a stranger should get from landing on the README to a rendered demo without dead ends. Fix broken anchors/links, a step that references something that no longer exists, or a misplaced section — small organizational corrections only, no rewrites or restructures.\n' +
  'Do NOT run any git commands. Return updated (files), staleClaimsFixed (what number/claim changed), notes.',
  { label: 'docs', phase: 'Docs', model: 'sonnet', schema: DOCS_SCHEMA }
)

// ---- Phase 5: Gate + publish manifest ----
phase('Gate')
const gate = await agent(
  'Publish gate for ' + ROOT + ' (work from that root). READ-ONLY git allowed (status/diff only).\n' +
  '1. npm run registry:check → registryOk (hard errors only).\n' +
  '2. npm run registry:hf:check → hfRegistryOk (stale committed registry/ fails the repo gate — this must pass).\n' +
  '3. npm run hf:lint → total count + any error lines NEW versus the 29-error baseline (21x invalid_parent_traversal_in_asset_path + 8x template_literal_selector).\n' +
  '4. git status --porcelain → changedFiles (what a human would commit).\n' +
  '5. Write a publish manifest to ' + SCRATCH + '/publish-log.json: {pass:"publish-sync", since:"' + SINCE + '", regenerated:[...], mediaRefreshed:[...], docsUpdated:[...]} from the phase results in this prompt: ' +
  JSON.stringify({ regenerated: regen ? regen.ran : [], mediaRefreshed: media ? media.refreshed : [], docsUpdated: docs ? docs.updated : [] }) + '\n' +
  'readyToCommit = registryOk AND hfRegistryOk AND no new lint errors. Do NOT commit anything.',
  { label: 'gate', phase: 'Gate', model: 'haiku', effort: 'low', schema: GATE_SCHEMA }
)

return {
  detect: { changedCompositions: detect.changedCompositions, affectedDemos: detect.affectedDemos, quickstartAffected: detect.quickstartAffected },
  regenerated: regen,
  media: media,
  docs: docs,
  gate: gate,
}
