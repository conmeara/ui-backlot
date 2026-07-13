export const meta = {
  name: 'drift-watch',
  description: 'Cheap weekly watch: probe real-app versions, refresh ground truth only where something moved, drift-diff vs the prior dated set, and name the families that need a fidelity-push',
  whenToUse: 'Run weekly (or after a known app update) to detect that the real apps changed out from under our surfaces. It does NOT fix anything — its output is the scoped work order for fidelity-push {families:[...]}. Args: {families:[...]} to scope; {force:true} to re-capture every family regardless of version signals.',
  phases: [
    { title: 'Probe', detail: 'One cheap sweep: App Store versions, installed Info.plist versions, vendor release-notes dates vs reports/drift/state.json', model: 'haiku' },
    { title: 'Capture', detail: 'Fresh dated reference set ONLY for families with a version change or stale coverage', model: 'sonnet' },
    { title: 'Diff', detail: 'Token score + pixel diff vs the previous dated set → drifted / stable / inconclusive', model: 'haiku' },
    { title: 'Report', detail: 'reports/drift/<date>.json + state update + the fidelity-push work order', model: 'haiku' },
  ],
}

// MODEL POLICY: this loop must stay CHEAP enough to run weekly without thought.
// Haiku everywhere except the capture agents (Sonnet — they drive browsers and
// tools). No Opus, no Fable: drift-watch detects, fidelity-push judges.
const ROOT = '/Users/conmeara/Projects/ui-backlot'
const SCRATCH = ROOT + '/workspace/drift'
const STATE = 'reports/drift/state.json' // tracked — drift lineage lives in reports/
const STALE_DAYS = 45

// Same family keys as fidelity-push; version signals per family:
// - app-store: iTunes lookup API `version` + `currentVersionReleaseDate` (no auth)
// - installed: /Applications/<app>/Contents/Info.plist CFBundleShortVersionString
// - release-notes: newest entry date on the vendor's public release-notes page
const FAMILIES = [
  { key: 'claude', signals: 'installed: /Applications/Claude.app; release-notes: https://docs.claude.com/en/release-notes/claude-apps' },
  { key: 'codex', signals: 'installed: /Applications/Codex.app; release-notes: https://help.openai.com/en/articles/11428266 (Codex changelog; fall back to a WebSearch for "codex changelog")' },
  { key: 'figma', signals: 'release-notes: https://www.figma.com/release-notes/' },
  { key: 'macos', signals: 'installed: sw_vers -productVersion (Finder/menu bar/Calendar track the OS)' },
  { key: 'browser', signals: 'installed: "/Applications/Google Chrome.app" CFBundleShortVersionString' },
  { key: 'word', signals: 'app-store: bundleId com.microsoft.Word' },
  { key: 'excel', signals: 'app-store: bundleId com.microsoft.Excel' },
  { key: 'powerpoint', signals: 'app-store: bundleId com.microsoft.Powerpoint' },
  { key: 'premiere', signals: 'release-notes: https://helpx.adobe.com/premiere-pro/release-note/release-notes-premiere-pro.html' },
]

let argv = args
if (typeof argv === 'string') { try { argv = JSON.parse(argv) } catch { argv = undefined } }
const wantFamilies = argv && Array.isArray(argv.families) ? argv.families : null
const FORCE = !!(argv && argv.force)
const selected = wantFamilies ? FAMILIES.filter(f => wantFamilies.includes(f.key)) : FAMILIES
if (wantFamilies && selected.length === 0) throw new Error('No families matched ' + JSON.stringify(wantFamilies) + ' — valid keys: ' + FAMILIES.map(f => f.key).join(', '))

const PROBE_SCHEMA = {
  type: 'object', required: ['probes', 'notes'], additionalProperties: false,
  properties: {
    probes: {
      type: 'array',
      items: {
        type: 'object', required: ['family', 'current', 'previous', 'changed', 'captureAgeDays'], additionalProperties: false,
        properties: {
          family: { type: 'string' },
          current: { type: ['string', 'null'] },
          previous: { type: ['string', 'null'] },
          changed: { type: 'boolean' },
          captureAgeDays: { type: ['integer', 'null'] },
          method: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    },
    notes: { type: 'string' },
  },
}

const DIFF_SCHEMA = {
  type: 'object', required: ['family', 'captured', 'drift', 'deltas', 'notes'], additionalProperties: false,
  properties: {
    family: { type: 'string' },
    captured: { type: 'array', items: { type: 'string' } },
    drift: { enum: ['drifted', 'stable', 'inconclusive', 'capture-failed'] },
    deltas: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

const REPORT_SCHEMA = {
  type: 'object', required: ['reportPath', 'stateUpdated', 'workOrder', 'notes'], additionalProperties: false,
  properties: {
    reportPath: { type: 'string' },
    stateUpdated: { type: 'boolean' },
    workOrder: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

// ---- Phase 1: one cheap probe sweep over every family ----
phase('Probe')
const probe = await agent(
  'Weekly drift PROBE for ' + selected.length + ' app families in ' + ROOT + ' (work from that root). Cheap and mechanical — no browsing beyond the listed URLs, no screenshots.\n' +
  'Previous state: Read ' + STATE + ' if it exists (shape: {families: {<key>: {version, checkedAt, lastCaptureDate}}}). Missing file = first run, previous=null everywhere.\n' +
  'For each family, get the CURRENT version signal:\n' +
  selected.map(f => '- ' + f.key + ': ' + f.signals).join('\n') + '\n' +
  'Recipes: app-store → curl "https://itunes.apple.com/lookup?bundleId=<id>&country=us" and read results[0].version + currentVersionReleaseDate. installed → defaults read "<app>/Contents/Info.plist" CFBundleShortVersionString. release-notes → WebFetch the URL and take the newest entry version/date.\n' +
  'ALSO per family: captureAgeDays = days since the newest dated dir under reference/<family>/2*/ (ls + date math; null if none).\n' +
  'changed = current differs from previous (false on first run when previous is null UNLESS there is also no dated reference set at all). Do NOT write the state file — the Report phase does that. If a signal is unreachable, current=null with a note.',
  { label: 'probe', phase: 'Probe', model: 'haiku', effort: 'low', schema: PROBE_SCHEMA }
)
if (!probe) throw new Error('version probe failed')

const byFamily = {}
for (const p of probe.probes || []) byFamily[p.family] = p
const needsCapture = selected.filter(f => {
  const p = byFamily[f.key]
  if (FORCE) return true
  if (!p) return false
  return p.changed || p.captureAgeDays == null || p.captureAgeDays > STALE_DAYS
})
log('Probe: ' + (probe.probes || []).length + ' families checked; refresh needed for: ' + (needsCapture.map(f => f.key).join(', ') || 'none'))

// ---- Phases 2+3: capture + diff, only where a signal moved ----
let diffs = []
if (needsCapture.length) {
  phase('Capture')
  diffs = await pipeline(
    needsCapture,
    f => agent(
      'Refresh ground truth for the "' + f.key + '" family in ' + ROOT + ' (work from that root). Trigger: ' + JSON.stringify(byFamily[f.key] || { reason: 'forced' }) + '.\n' +
      'Read reference/sources.json (this family) and docs/reference-and-asset-sourcing.md Part 1, then capture the CHEAPEST meaningful set for this family\'s tier — the same labels as the previous dated set where possible, so the diff compares like with like. One or two labels is enough; this is a drift check, not a full re-ground.\n' +
      'File via tools/capture-live-reference.mjs / import-reference.mjs into a dated set. HARD RULES: never log in, never touch bot checks, no git commands. If the tier is unavailable right now (e.g. Chrome MCP disconnected), fall back to a no-auth rung (App Store screenshots re-pull counts) or return drift="capture-failed" with what you tried.\n' +
      'Return family="' + f.key + '", captured (labels), drift="inconclusive" for now, deltas=[], notes.',
      { label: 'capture:' + f.key, phase: 'Capture', model: 'sonnet', schema: DIFF_SCHEMA }
    ),
    (cap, f) => {
      if (!cap || cap.drift === 'capture-failed') return cap
      return agent(
        'Drift DIFF for the "' + f.key + '" family in ' + ROOT + ' (work from that root). A fresh dated set was just captured (labels: ' + JSON.stringify(cap.captured) + ').\n' +
        'Compare the NEWEST dated dir under reference/' + f.key + '/ against the PREVIOUS one (second newest), label by label:\n' +
        '1. Where both have tokens.json: node tools/fidelity-score.mjs --label drift-' + f.key + ' --ours <newest tokens.json> --theirs <previous tokens.json> --out ' + SCRATCH + '/drift-' + f.key + '.json (mkdir -p ' + SCRATCH + ') — read the report; tokenOverall < 0.97 or any concrete top delta = drift evidence.\n' +
        '2. Where both have screenshot.png at the same viewport: pixel-diff them (odiff if available, else compare dimensions + spot-Read both images and note visible differences).\n' +
        '3. If the previous set has no comparable label, drift="inconclusive" with a note.\n' +
        'Return family, captured (pass through), drift (drifted when the app visibly/measurably changed; stable when deltas are noise), deltas (concrete: "composer radius 9px→12px", "sidebar bg #f8f8f6→#f5f5f2"), notes.',
        { label: 'diff:' + f.key, phase: 'Diff', model: 'haiku', effort: 'low', schema: DIFF_SCHEMA }
      )
    }
  )
} else {
  log('No version changes and no stale coverage — skipping capture entirely')
}

// ---- Phase 4: report + state + work order ----
phase('Report')
const diffResults = (diffs || []).filter(Boolean)
const report = await agent(
  'Write the weekly drift report for ' + ROOT + ' (work from that root).\n' +
  'INPUTS — probes: ' + JSON.stringify(probe.probes) + '\n' +
  'diffs: ' + JSON.stringify(diffResults) + '\n' +
  '1. Write reports/drift/<today YYYY-MM-DD>.json (mkdir -p reports/drift) containing {probes, diffs, generatedAt: "<today>"}.\n' +
  '2. Update ' + STATE + ': for every probed family set version=current (keep previous when current is null), checkedAt=<today>; for captured families set lastCaptureDate=<today>. Verify it parses with node -e afterwards.\n' +
  '3. workOrder: one line per family that needs attention, most urgent first — "fidelity-push {families:[\'<key>\']}: <why>" for drifted families; "capture-failed: <key> — <what to unblock>" for failures; "inconclusive: <key> — <what would settle it>" where the diff could not decide.\n' +
  'Do NOT run any git commands.',
  { label: 'report', phase: 'Report', model: 'haiku', effort: 'low', schema: REPORT_SCHEMA }
)

return {
  probes: probe.probes,
  refreshed: needsCapture.map(f => f.key),
  diffs: diffResults.map(d => ({ family: d.family, drift: d.drift, deltas: d.deltas })),
  workOrder: report ? report.workOrder : [],
  reportPath: report ? report.reportPath : null,
}
