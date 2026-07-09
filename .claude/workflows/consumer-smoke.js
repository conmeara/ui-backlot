export const meta = {
  name: 'consumer-smoke',
  description: 'Install surfaces from the committed registry exactly like an external HyperFrames user, compose and render a demo following only the public docs, and report every point of friction',
  whenToUse: 'Run before a release/push that touches the registry, README, or guides — or whenever you want proof the consumer path works. Nothing else in the repo tests the OUTSIDE view: repo gates all run in-repo. Args: {remote: true} to install from the raw.githubusercontent.com registry URL (tests what consumers actually hit; requires the branch to be pushed) — default installs from the local committed registry/.',
  phases: [
    { title: 'Setup', detail: 'Clean consumer sandbox outside the repo tree', model: 'haiku' },
    { title: 'Journey', detail: 'A docs-only stranger installs, composes, and renders a demo — README + guides are the ONLY allowed knowledge', model: 'sonnet' },
    { title: 'Verify', detail: 'Render artifacts exist and play; installed files match the registry', model: 'haiku' },
    { title: 'Report', detail: 'Typed friction log → reports/smoke/<date>.json + doc-fix work order', model: 'haiku' },
  ],
}

// MODEL POLICY: no Opus/Fable — the deliverable is a friction log, not a
// design judgment. Sonnet plays the stranger; Haiku does the bookkeeping.
const ROOT = '/Users/botbot/Projects/ui-backlot'
const SANDBOX = ROOT + '/workspace/smoke' // gitignored with the rest of workspace/

let argv = args
if (typeof argv === 'string') { try { argv = JSON.parse(argv) } catch { argv = undefined } }
const REMOTE = !!(argv && argv.remote)
const REGISTRY = REMOTE
  ? 'https://raw.githubusercontent.com/conmeara/ui-backlot/main/registry'
  : ROOT + '/registry'

const SETUP_SCHEMA = {
  type: 'object', required: ['sandboxDir', 'ok', 'notes'], additionalProperties: false,
  properties: {
    sandboxDir: { type: 'string' },
    ok: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

const JOURNEY_SCHEMA = {
  type: 'object', required: ['installed', 'composed', 'rendered', 'friction', 'notes'], additionalProperties: false,
  properties: {
    installed: { type: 'array', items: { type: 'string' } },
    composed: { type: ['string', 'null'] },
    rendered: { type: ['string', 'null'] },
    friction: {
      type: 'array',
      items: {
        type: 'object', required: ['step', 'kind', 'detail', 'suggestedFix'], additionalProperties: false,
        properties: {
          step: { type: 'string' },
          kind: { enum: ['docs-gap', 'docs-wrong', 'broken-install', 'broken-asset', 'render-error', 'confusing'] },
          detail: { type: 'string' },
          suggestedFix: { type: 'string' },
        },
      },
    },
    notes: { type: 'string' },
  },
}

const VERIFY_SCHEMA = {
  type: 'object', required: ['videoOk', 'installOk', 'details', 'notes'], additionalProperties: false,
  properties: {
    videoOk: { type: 'boolean' },
    installOk: { type: 'boolean' },
    details: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

const REPORT_SCHEMA = {
  type: 'object', required: ['reportPath', 'verdict', 'workOrder', 'notes'], additionalProperties: false,
  properties: {
    reportPath: { type: 'string' },
    verdict: { enum: ['pass', 'friction', 'broken'] },
    workOrder: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

// ---- Phase 1: sandbox ----
phase('Setup')
const setup = await agent(
  'Prepare a clean consumer sandbox for a smoke test of ' + ROOT + '.\n' +
  'rm -rf ' + SANDBOX + ' && mkdir -p ' + SANDBOX + '/demo — then confirm node + npx are available (node --version). Return sandboxDir=' + SANDBOX + '/demo, ok, notes.',
  { label: 'setup', phase: 'Setup', model: 'haiku', effort: 'low', schema: SETUP_SCHEMA }
)
if (!setup || !setup.ok) throw new Error('sandbox setup failed: ' + (setup ? setup.notes : 'no result'))

// ---- Phase 2: the stranger's journey ----
phase('Journey')
const journey = await agent(
  'You are an EXTERNAL developer who just found the ui-backlot repo and wants to build a short agent-demo video. Work ONLY inside ' + setup.sandboxDir + ' — never edit anything under ' + ROOT + ' outside that sandbox, and never run git commands.\n\n' +
  'ALLOWED KNOWLEDGE — exactly what a stranger has: ' + ROOT + '/README.md, docs/catalog.md, docs/guides/build-hyperframes-demo.md, and anything those documents link to. Do NOT read compositions/, tools/, surfaces/registry.json, or repo internals to unblock yourself — if the docs leave you stuck, that IS the finding: record it as friction and then (and only then) peek to keep the journey moving, noting exactly what the docs failed to tell you.\n\n' +
  'THE JOURNEY:\n' +
  '1. Follow the README\'s registry instructions to install surfaces into your sandbox project, using this registry: ' + REGISTRY + (REMOTE ? ' (the real consumer URL)' : ' (local committed registry/ — same content consumers get after push)') + '. Install what the README\'s own example scene suggests (e.g. mac-menu-bar + excel-workbook + claude-chat-pane).\n' +
  '2. Compose a small demo HTML per the documented pattern (the quickstart/composition guide), mounting the installed blocks.\n' +
  '3. Render it: npx hyperframes render --composition <your file> --quality draft --low-memory-mode --output demo.mp4.\n\n' +
  'RECORD EVERY FRICTION POINT as you go — a command from the docs that errors, a missing/miscopied asset (fonts, icons, foundation CSS), a step the docs assume but never state, a broken link, anything confusing enough to make a real stranger give up. kind: docs-gap | docs-wrong | broken-install | broken-asset | render-error | confusing; suggestedFix names the exact file + change.\n' +
  'An empty friction list must mean the journey was genuinely smooth — do not omit paper cuts.\n' +
  'Return installed (block names), composed (your HTML path or null), rendered (mp4 path or null), friction, notes.',
  { label: 'journey' + (REMOTE ? ':remote' : ':local'), phase: 'Journey', model: 'sonnet', schema: JOURNEY_SCHEMA }
)
if (!journey) throw new Error('journey agent failed')
log('Journey: installed ' + journey.installed.length + ' block(s), ' + (journey.rendered ? 'rendered ' + journey.rendered : 'NO render') + ', ' + journey.friction.length + ' friction point(s)')

// ---- Phase 3: verify the artifacts ----
phase('Verify')
const verify = await agent(
  'Verify consumer-smoke artifacts (mechanical) in ' + (setup.sandboxDir) + '.\n' +
  '1. videoOk: ' + (journey.rendered ? 'ffprobe ' + journey.rendered + ' — exists, video stream present, duration > 2s, dimensions match the composition stage.' : 'false — the journey produced no render.') + '\n' +
  '2. installOk: the installed block files exist in the sandbox and each mounted block\'s HTML is non-empty and references no missing local asset (grep for src/href, check the files resolve).\n' +
  'Return videoOk, installOk, details (one line per check), notes.',
  { label: 'verify', phase: 'Verify', model: 'haiku', effort: 'low', schema: VERIFY_SCHEMA }
)

// ---- Phase 4: report ----
phase('Report')
const report = await agent(
  'Write the consumer-smoke report for ' + ROOT + ' (work from that root).\n' +
  'INPUTS — journey: ' + JSON.stringify({ installed: journey.installed, composed: journey.composed, rendered: journey.rendered, friction: journey.friction }) + '\n' +
  'verify: ' + JSON.stringify(verify) + '\n' +
  'mode: ' + (REMOTE ? 'remote registry (raw.githubusercontent.com)' : 'local committed registry/') + '\n' +
  '1. Write reports/smoke/<today YYYY-MM-DD>' + (REMOTE ? '-remote' : '') + '.json (mkdir -p reports/smoke) with {mode, journey, verify, generatedAt}.\n' +
  '2. verdict: "pass" = rendered + videoOk + no friction beyond "confusing"; "friction" = journey completed but real paper cuts exist; "broken" = install or render failed.\n' +
  '3. workOrder: one line per fix, most severe first, each naming the exact file to change (README.md line, guide section, registry block) and what to say/do — these become docs/registry fixes.\n' +
  'Do NOT run any git commands.',
  { label: 'report', phase: 'Report', model: 'haiku', effort: 'low', schema: REPORT_SCHEMA }
)

return {
  mode: REMOTE ? 'remote' : 'local',
  verdict: report ? report.verdict : 'unknown',
  installed: journey.installed,
  rendered: journey.rendered,
  friction: journey.friction,
  verify: verify,
  workOrder: report ? report.workOrder : [],
  reportPath: report ? report.reportPath : null,
}
