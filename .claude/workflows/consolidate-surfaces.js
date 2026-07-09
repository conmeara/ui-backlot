export const meta = {
  name: 'consolidate-surfaces',
  description: 'One canonical surface per app, variants as parameters: audit refresh, atom bake-off, crown atoms with score guard, complete the canonical Claude shell, migrate workflow wrappers, deprecate legacy shells, full gates',
  whenToUse: 'Run the component-consolidation plan (docs/component-consolidation-audit-2026-07-02.md, phases 2-5). Args: {skipMigration: true} to stop after atom crowning.',
  phases: [
    { title: 'Audit', detail: 'Refresh the 2026-07-02 audit against current repo state; emit the concrete work-list', model: 'sonnet' },
    { title: 'Bake-off', detail: 'Opus judges competing sidebar/thread/composer/rail implementations vs real-app references', model: 'opus' },
    { title: 'Atoms', detail: 'Fold winning visuals into the atom files with capture verify + deterministic score guard', model: 'sonnet' },
    { title: 'Shell', detail: 'Complete the canonical parameterized Claude shell (pages, toggles, beats) + verify every state', model: 'sonnet' },
    { title: 'Migrate', detail: 'Re-point legacy workflow wrappers at the canonical shell, recapture, pairwise before/after judge each', model: 'sonnet' },
    { title: 'Cleanup', detail: 'Deprecate legacy shells in the registry, regenerate catalogs + hyperframes registry + pages, full gates', model: 'haiku' },
  ],
}

const ROOT = '/Users/botbot/Projects/ui-backlot'
const SCRATCH = ROOT + '/workspace/consolidation'
const AUDIT_DOC = 'docs/component-consolidation-audit-2026-07-02.md'

// Canonical pieces (per the audit's target inventory)
const ATOMS = ['claude-sidebar', 'claude-thread-core', 'claude-composer', 'claude-agent-rail']
const SHELL = 'compositions/claude-composed-app.html'
const SHELL_ID = 'claude-composed-app'
const PANE = 'compositions/claude-chat-pane.html'

const GOTCHAS = [
  '1. CASCADE TRAP: composition files contain LATER style blocks re-styling earlier selectors — the LAST rule wins. Before editing any rule, grep the file for ALL occurrences of the selector and edit the effective one.',
  '2. ICONS: never hand-draw glyphs. Inline <symbol>s are generated from assets/icons/source-authentic/ — run npm run icons:check after touching them; use node tools/find-icon.mjs to source new glyphs. #si-claude must stay the exact logo mark.',
  '3. FIDELITY-FIRST: the canonical tokens are the namespaced --claude-* custom properties in styles/backlot-foundation.css (light + .theme-dark), measured from the live app. Fold visuals by moving to these tokens, not by copying hex soup. #e08a62 is the canonical accent.',
  '4. PATHS: keep every file existing relative asset-path convention exactly as-is (captures load via file://). Keep the foundation @import in the OUTER style block where that pattern exists.',
  '5. MOUNTING: runtime/backlot-component-loader.js strips <script> tags from mounted components and inherits parent fonts — visual state must be CSS/markup, not scripts. Nested mounts resolve against the host page base URL.',
  '6. THEME DISCIPLINE: put structural/geometry fixes in shared base CSS so BOTH themes benefit; light-only colors in default rules; never regress .theme-dark. Verify dark captures after structural edits.',
  '7. DO NOT DELETE FILES. Deprecation happens only via status:"deprecated" in surfaces/registry.json; deletion is a human decision after this pass ships.',
  '8. Do NOT run any git commands (no commit, stash, checkout, restore). The orchestrator handles version control.',
].join('\n')

const AUDIT_SCHEMA = {
  type: 'object', required: ['claudeVariantCount', 'legacyShells', 'workflowMigrations', 'familyCleanups', 'alreadyDone', 'notes'], additionalProperties: false,
  properties: {
    claudeVariantCount: { type: 'integer' },
    legacyShells: { type: 'array', items: { type: 'object', required: ['file', 'registryIds', 'mountedBy'], additionalProperties: false, properties: { file: { type: 'string' }, registryIds: { type: 'array', items: { type: 'string' } }, mountedBy: { type: 'array', items: { type: 'string' } } } } },
    workflowMigrations: { type: 'array', items: { type: 'object', required: ['workflowFile', 'workflowId', 'currentMount', 'targetMount', 'captureScript'], additionalProperties: false, properties: { workflowFile: { type: 'string' }, workflowId: { type: 'string' }, currentMount: { type: 'string' }, targetMount: { enum: ['shell', 'pane', 'none-needed'] }, captureScript: { type: 'string' } } } },
    familyCleanups: { type: 'array', items: { type: 'object', required: ['family', 'action', 'stillNeeded'], additionalProperties: false, properties: { family: { type: 'string' }, action: { type: 'string' }, stillNeeded: { type: 'boolean' } } } },
    alreadyDone: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

const BAKEOFF_SCHEMA = {
  type: 'object', required: ['winners', 'foldIns', 'notes'], additionalProperties: false,
  properties: {
    winners: { type: 'array', items: { type: 'object', required: ['element', 'winnerFile', 'why'], additionalProperties: false, properties: { element: { type: 'string' }, winnerFile: { type: 'string' }, why: { type: 'string' } } } },
    foldIns: { type: 'array', maxItems: 12, items: { type: 'object', required: ['atomFile', 'fromFile', 'what', 'severity'], additionalProperties: false, properties: { atomFile: { type: 'string' }, fromFile: { type: 'string' }, what: { type: 'string' }, severity: { enum: ['must', 'should', 'polish'] } } } },
    notes: { type: 'string' },
  },
}

const FIX_SCHEMA = {
  type: 'object', required: ['applied', 'skipped', 'capturesVerified', 'notes'], additionalProperties: false,
  properties: {
    applied: { type: 'array', items: { type: 'object', required: ['file', 'change'], additionalProperties: false, properties: { surface: { type: 'string' }, file: { type: 'string' }, change: { type: 'string' } } } },
    skipped: { type: 'array', items: { type: 'object', required: ['issue', 'reason'], additionalProperties: false, properties: { issue: { type: 'string' }, reason: { type: 'string' } } } },
    capturesVerified: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

const SCORE_SCHEMA = {
  type: 'object', required: ['scores', 'notes'], additionalProperties: false,
  properties: {
    scores: { type: 'array', items: { type: 'object', required: ['surface', 'tokenOverall'], additionalProperties: false, properties: { surface: { type: 'string' }, tokenOverall: { type: ['number', 'null'] }, elementOverall: { type: ['number', 'null'] } } } },
    notes: { type: 'string' },
  },
}

const JUDGE_SCHEMA = {
  type: 'object', required: ['verdict', 'closerToReal', 'regressions', 'summary'], additionalProperties: false,
  properties: {
    verdict: { enum: ['pass', 'fix', 'revert'] },
    closerToReal: { enum: ['after', 'before', 'tie'] },
    regressions: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
}

const GATE_SCHEMA = {
  type: 'object', required: ['captureFailures', 'registryOk', 'hfRegistryOk', 'catalogOk', 'pagesOk', 'iconsOk', 'lintErrors', 'newLintErrors', 'renderOk', 'notes'], additionalProperties: false,
  properties: {
    captureFailures: { type: 'array', items: { type: 'string' } },
    registryOk: { type: 'boolean' }, hfRegistryOk: { type: 'boolean' }, catalogOk: { type: 'boolean' }, pagesOk: { type: 'boolean' }, iconsOk: { type: 'boolean' },
    lintErrors: { type: 'integer' }, newLintErrors: { type: 'array', items: { type: 'string' } },
    renderOk: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

function scoreCmd(tag) {
  return 'mkdir -p ' + SCRATCH + ' && cd ' + ROOT + ' && REF=$(ls -d reference/claude/2*/ 2>/dev/null | sort | tail -1)\n' +
    'npm run capture:claude-composed-app && npm run capture:claude-home\n' +
    'node tools/fidelity-score.mjs --label composed-' + tag + ' --ours captures/surface-claude-composed-app/capture.json --theirs "${REF}web-app-chat-light/tokens.json" --out ' + SCRATCH + '/score-composed-' + tag + '.json\n' +
    'node tools/fidelity-score.mjs --label home-' + tag + ' --ours captures/surface-claude-home/capture.json --theirs "${REF}web-app-home-light/tokens.json" --out ' + SCRATCH + '/score-home-' + tag + '.json'
}

function scoreStage(tag, phase) {
  return agent(
    'Deterministic score checkpoint "' + tag + '" in ' + ROOT + '. Run as bash:\n' + scoreCmd(tag) + '\nThen Read both ' + SCRATCH + '/score-*-' + tag + '.json and return surface (bare id: claude-composed-app / claude-home), tokenOverall, elementOverall.',
    { label: 'score:' + tag, phase: phase, model: 'haiku', effort: 'low', schema: SCORE_SCHEMA }
  )
}

function regressed(before, after) {
  if (!before || !after) return []
  const b = {}
  for (const s of before.scores || []) b[s.surface.replace(/-(before|after|r\d+)$/, '')] = s.tokenOverall
  const out = []
  for (const s of after.scores || []) {
    const key = s.surface.replace(/-(before|after|r\d+)$/, '')
    if (typeof b[key] === 'number' && typeof s.tokenOverall === 'number' && s.tokenOverall < b[key] - 0.005) {
      out.push(key + ': ' + b[key].toFixed(3) + ' → ' + s.tokenOverall.toFixed(3))
    }
  }
  return out
}

let argv = args
if (typeof argv === 'string') { try { argv = JSON.parse(argv) } catch { argv = undefined } }
const skipMigration = Boolean(argv && argv.skipMigration)

// ---------------------------------------------------------------- Audit
phase('Audit')
const audit = await agent(
  'Refresh the consolidation audit for ' + ROOT + ' (work from that root). The plan is ' + AUDIT_DOC + ' (2026-07-02) — parts are already done; your job is the CURRENT delta. Read the audit doc, surfaces/registry.json, and grep the compositions.\n\n' +
  'Determine and return:\n' +
  '1. claudeVariantCount: registry entries whose id starts with "claude" and status != "deprecated".\n' +
  '2. legacyShells: for each of compositions/claude-app.html, claude-desktop.html, claude-chat-shell.html, claude-code-desktop.html that STILL EXISTS: its registry ids (may be none) and which workflow/composition files mount it (grep data-backlot-mount-src AND data-composition-src for the filename).\n' +
  '3. workflowMigrations: every workflow composition (registry kind "workflow", status != deprecated) that mounts a LEGACY shell — file, registry id, what it currently mounts, whether the canonical replacement is the full shell (' + SHELL + ', for desktop-app scenes) or the pane (' + PANE + ', for side-by-side app scenes), and its capture script. Workflows already mounting ' + SHELL + ' or ' + PANE + ' → targetMount "none-needed".\n' +
  '4. familyCleanups: check each row of the audit\'s all-family table — is it still needed? (e.g. surfaces/*.html orphans may already be deleted; figma-onboarding may already be a ?page= state.)\n' +
  '5. alreadyDone: audit-plan items that are complete (be specific).\n' +
  'Be precise — later phases execute your work-list mechanically.',
  { label: 'audit', phase: 'Audit', model: 'sonnet', schema: AUDIT_SCHEMA }
)
log('Audit: ' + audit.claudeVariantCount + ' claude variants, ' + audit.legacyShells.length + ' legacy shells, ' + audit.workflowMigrations.filter(m => m.targetMount !== 'none-needed').length + ' workflows to migrate')

// ---------------------------------------------------------------- Bake-off
phase('Bake-off')
const baseline = await scoreStage('baseline', 'Bake-off')
const bakeoff = await agent(
  'Visual bake-off for the canonical Claude atoms in ' + ROOT + '. The repo is consolidating to ONE implementation per element (' + AUDIT_DOC + ' phase 2); the atoms ' + ATOMS.map(a => 'compositions/' + a + '.html').join(', ') + ' will be the single source of truth mounted by ' + SHELL + '.\n\n' +
  'COMPETING IMPLEMENTATIONS (from the refreshed audit):\n' + JSON.stringify(audit.legacyShells, null, 1) + '\n\n' +
  'EVIDENCE — Read images: captures/surface-claude-composed-app/target.png (current atoms, composed), plus each legacy shell\'s capture under captures/ (find via surfaces/registry.json capture.path or ls captures/). GROUND TRUTH: the newest reference/claude/<dated>/web-app-chat-light/screenshot.png and web-app-home-light/screenshot.png (real claude.ai pixels — do not guess). Known measured facts: paper rgb(248,248,246), ink rgb(11,11,11), weights 430/550, control radius 9px, hairlines ~10%-alpha black, Anthropicons glyph font.\n\n' +
  'For each element — sidebar, thread (incl. reasoning/tool cards), composer, agent rail — judge WHICH implementation is closest to the real app and name it in winners. Then produce foldIns: the concrete visual properties the winning implementation has that the ATOM currently lacks (exact px/hex/weight/structure, severity must/should/polish, max 12). If the atom already wins an element, say so and emit no foldIns for it. A Sonnet implementer applies your specs verbatim.',
  { label: 'bakeoff', phase: 'Bake-off', model: 'opus', effort: 'high', schema: BAKEOFF_SCHEMA }
)
log('Bake-off: ' + bakeoff.winners.map(w => w.element + '→' + w.winnerFile.split('/').pop()).join(', ') + ' · ' + bakeoff.foldIns.length + ' fold-ins')

// ---------------------------------------------------------------- Atoms
phase('Atoms')
let atomsResult = { applied: [], skipped: [], notes: 'no fold-ins needed' }
if (bakeoff.foldIns.length) {
  atomsResult = await agent(
    'Crown the canonical Claude atoms in ' + ROOT + ' (work from that root). Apply these fold-in specs from an Opus bake-off judge — the winning shell\'s visuals move INTO the atom files:\n' + JSON.stringify(bakeoff.foldIns, null, 1) + '\n\n' +
    'SCOPE — edit ONLY: ' + ATOMS.map(a => 'compositions/' + a + '.html').join(', ') + ' and (for token-level fixes) the --claude-* block of styles/backlot-foundation.css.\n' +
    'RULES:\n' + GOTCHAS + '\n\n' +
    'VERIFY after your edits: npm run capture:claude-composed-app && npm run capture:claude-composed-app-chat && npm run capture:claude-composed-app-dark, plus each atom\'s own capture script (capture:claude-sidebar, capture:claude-thread-core, capture:claude-composer, capture:claude-agent-rail). Read the PNGs against the real references (reference/claude/<newest dated>/). A capture error means you broke a template — fix before finishing. Skip any spec that cannot be implemented cleanly, with a reason.',
    { label: 'crown-atoms', phase: 'Atoms', model: 'sonnet', schema: FIX_SCHEMA }
  )
  const post = await scoreStage('post-atoms', 'Atoms')
  const regs = regressed(baseline, post)
  if (regs.length) {
    log('Score regression after atom crowning: ' + regs.join('; ') + ' — dispatching repair')
    await agent(
      'A consolidation pass on the Claude atoms REGRESSED the deterministic fidelity score in ' + ROOT + ': ' + regs.join('; ') + '.\n' +
      'Changes just applied:\n' + JSON.stringify(atomsResult.applied, null, 1) + '\n' +
      'Read ' + SCRATCH + '/score-composed-post-atoms.json (topDeltas name the regressed properties). Fix the regression in the atom files (' + ATOMS.map(a => 'compositions/' + a + '.html').join(', ') + ') — reverting a specific fold-in is acceptable. Then re-run: ' + scoreCmd('post-atoms-r2').split('\n').join(' && ') + ' and confirm tokenOverall is back at or above baseline (composed: ' + JSON.stringify((baseline.scores || []).find(s => s.surface.includes('composed'))) + ').\nRULES:\n' + GOTCHAS,
      { label: 'repair-atoms', phase: 'Atoms', model: 'sonnet', schema: FIX_SCHEMA }
    )
  }
}

// ---------------------------------------------------------------- Shell
phase('Shell')
const shell = await agent(
  'Complete the canonical parameterized Claude shell in ' + ROOT + ': ' + SHELL + ' (registry id ' + SHELL_ID + '). Target (per ' + AUDIT_DOC + '): parameters replace variant FILES.\n\n' +
  'REQUIRED parameter surface (verify each; implement what is missing):\n' +
  '1. ?page=chat|cowork|code (also data-page attr) — three working modes.\n' +
  '2. data-sidebar="on|off" and data-rail="on|off" — actually hide/show with correct layout reflow.\n' +
  '3. .theme-dark on the root — both themes correct in all three pages.\n' +
  '4. ?capture= beats where the shell already defines them (keep working).\n\n' +
  'Verify EVERY combination visually: for each page × sidebar × rail state you can capture, run node tools/capture-web-ui.mjs with the right query params into ' + SCRATCH + '/shell-states/ (use --slug shell-<page>-<sb>-<rail>[-dark]) and Read each PNG — no broken layout, no empty regions, no overlapping panes. Fix what you find. The registry keeps one entry per captured view pointing at this one file — add missing capture scripts to package.json (capture:claude-composed-app-<state>) ONLY for states worth publishing (chat/cowork/code × light/dark).\n' +
  'Also confirm ' + PANE + ' (the no-sidebar pane for layering over app surfaces) mounts the same atoms — fold its bespoke copies into atom mounts if it still carries any.\n' +
  'RULES:\n' + GOTCHAS,
  { label: 'shell', phase: 'Shell', model: 'sonnet', schema: FIX_SCHEMA }
)
const shellJudge = await agent(
  'Adversarially verify the canonical Claude shell work in ' + ROOT + '. Claimed:\n' + JSON.stringify(shell.applied, null, 1) + '\n' +
  'Read the state captures in ' + SCRATCH + '/shell-states/ (and captures/surface-claude-composed-app*/target.png) against reference/claude/<newest dated>/ screenshots. Hunt for: broken layout in any page/toggle combination, dark-theme regressions, sidebar/rail toggles that just clip content instead of reflowing, contradictory content between panes. verdict: pass | fix (list precise regressions) | revert (fundamentally broken).',
  { label: 'judge-shell', phase: 'Shell', model: 'opus', effort: 'high', schema: JUDGE_SCHEMA }
)
if (shellJudge && shellJudge.verdict !== 'pass' && shellJudge.regressions.length) {
  await agent(
    'Repair shell regressions in ' + ROOT + ' flagged by an adversarial judge:\n' + JSON.stringify(shellJudge.regressions, null, 1) + '\nSCOPE: ' + SHELL + ', ' + PANE + ', atom files. Re-capture affected states into ' + SCRATCH + '/shell-states/ and confirm each regression is gone. RULES:\n' + GOTCHAS,
    { label: 'repair-shell', phase: 'Shell', model: 'sonnet', schema: FIX_SCHEMA }
  )
}

// ---------------------------------------------------------------- Migrate
phase('Migrate')
const migrations = skipMigration ? [] : audit.workflowMigrations.filter(m => m.targetMount !== 'none-needed')
log(skipMigration ? 'Migration skipped by args' : 'Migrating ' + migrations.length + ' workflow wrapper(s)')
const migrated = await pipeline(
  migrations,
  m => agent(
    'Migrate a workflow wrapper to the canonical Claude shell in ' + ROOT + ' (work from that root).\n' +
    'FILE: ' + m.workflowFile + ' (registry id ' + m.workflowId + ') currently mounts ' + m.currentMount + '. Re-point it at ' + (m.targetMount === 'pane' ? PANE : SHELL) + ' with the right parameters (?page=cowork for working-task scenes, data-sidebar/rail toggles to match the old framing). PRESERVE the scene: same story beats, same app surface alongside, same timeline timings — only the Claude mount changes. Copy scene-specific thread content into the mount via the wrapper if the old shell carried bespoke content (the loader strips scripts; use the shell\'s data attributes / capture beats).\n' +
    'FIRST snapshot the current capture: mkdir -p ' + SCRATCH + '/migrate && cp ' + ROOT + '/captures/' + '$(node -e "const r=require(\'' + ROOT + '/surfaces/registry.json\');console.log(r.surfaces.find(s=>s.id===\'' + m.workflowId + '\').capture.path.split(\'/\')[1])")' + '/target.png ' + SCRATCH + '/migrate/before-' + m.workflowId + '.png 2>/dev/null || true\n' +
    'VERIFY: npm run ' + m.captureScript + ' and Read the PNG — the scene must still read correctly.\n' +
    'RULES:\n' + GOTCHAS,
    { label: 'migrate:' + m.workflowId, phase: 'Migrate', schema: FIX_SCHEMA, model: 'sonnet' }
  ),
  (fix, m) => agent(
    'Pairwise judgment for a workflow migration in ' + ROOT + ': ' + m.workflowId + ' now mounts the canonical Claude shell.\n' +
    'Read BEFORE ' + SCRATCH + '/migrate/before-' + m.workflowId + '.png and AFTER captures/<its capture dir>/target.png (path via surfaces/registry.json), plus reference/claude/<newest dated>/web-app-chat-light/screenshot.png for the Claude portion.\n' +
    'closerToReal: which capture\'s Claude window is closer to the real app? verdict: pass if AFTER is closer or tie AND the scene still tells its story; fix (list regressions) if repairable issues; revert if the migration broke the scene.\n' +
    'Applied changes: ' + JSON.stringify(fix ? fix.applied : []),
    { label: 'judge:' + m.workflowId, phase: 'Migrate', model: 'opus', schema: JUDGE_SCHEMA }
  ).then(j => ({ id: m.workflowId, file: m.workflowFile, fix: fix, judge: j })),
  async (r, m) => {
    if (r.judge && r.judge.verdict !== 'pass' && (r.judge.regressions || []).length) {
      await agent(
        'Repair migration regressions in ' + ROOT + ' for ' + m.workflowFile + ' (judge verdict: ' + r.judge.verdict + '):\n' + JSON.stringify(r.judge.regressions, null, 1) + '\nIf verdict was "revert", restore the previous mount arrangement from your judgment of what worked (do NOT use git). Re-run npm run ' + m.captureScript + ' and confirm. RULES:\n' + GOTCHAS,
        { label: 'repair:' + m.workflowId, phase: 'Migrate', model: 'sonnet', schema: FIX_SCHEMA }
      )
    }
    return r
  }
)

// ---------------------------------------------------------------- Cleanup
phase('Cleanup')
const cleanups = audit.familyCleanups.filter(c => c.stillNeeded)
const deprecate = await agent(
  'Registry consolidation cleanup in ' + ROOT + ' (work from that root). Steps:\n' +
  '1. In surfaces/registry.json set status:"deprecated" on entries for legacy Claude shells that are no longer mounted by any non-deprecated workflow (verify by grepping compositions/ for each file name): candidates from the audit = ' + JSON.stringify(audit.legacyShells.map(l => l.registryIds).flat()) + '. Do NOT delete files or entries.\n' +
  '2. Apply the still-needed family cleanups (same deprecate-only rule):\n' + JSON.stringify(cleanups, null, 1) + '\n' +
  '3. Update the "Good defaults" list in AGENTS.md if any listed id was deprecated.\n' +
  '4. Regenerate: npm run catalog:generate && npm run registry:hf:generate && npm run pages:catalog && npm run compare:page && npm run gallery:page.\n' +
  'RULES:\n' + GOTCHAS,
  { label: 'deprecate', phase: 'Cleanup', model: 'sonnet', schema: FIX_SCHEMA }
)
const finalScore = await scoreStage('final', 'Cleanup')
const gate = await agent(
  'Full verification gate for ' + ROOT + ' after the consolidation pass. Write a bash script to ' + SCRATCH + '/gates.sh and run it:\n' +
  '1. Capture sweep: every package.json script starting "capture:" except capture:hf and capture:web; record failures.\n' +
  '2. npm run registry:check (registryOk on no hard errors)\n' +
  '3. npm run registry:hf:check (hfRegistryOk)\n' +
  '4. npm run catalog:generate (catalogOk)\n' +
  '5. npm run pages:catalog (pagesOk)\n' +
  '6. npm run icons:check (iconsOk)\n' +
  '7. npm run hf:lint — BASELINE is 29 intentional errors (21x invalid_parent_traversal_in_asset_path + 8x template_literal_selector, documented in CONTRIBUTING.md). Report total and NEW error lines vs that baseline.\n' +
  '8. npm run example:quickstart:render (renderOk; expect ~14s video)\n' +
  'Report every field.',
  { label: 'gates', phase: 'Cleanup', model: 'haiku', effort: 'low', schema: GATE_SCHEMA }
)

return {
  audit: { claudeVariants: audit.claudeVariantCount, alreadyDone: audit.alreadyDone, notes: audit.notes },
  bakeoff: { winners: bakeoff.winners, foldIns: bakeoff.foldIns.length },
  atoms: { applied: atomsResult.applied, skipped: atomsResult.skipped },
  scores: { baseline: baseline ? baseline.scores : null, final: finalScore ? finalScore.scores : null, regressions: regressed(baseline, finalScore) },
  shell: { applied: shell ? shell.applied : [], judgeVerdict: shellJudge ? shellJudge.verdict : null },
  migrations: (migrated || []).filter(Boolean).map(r => ({ id: r.id, verdict: r.judge ? r.judge.verdict : null, closerToReal: r.judge ? r.judge.closerToReal : null })),
  cleanup: deprecate ? deprecate.applied : [],
  gate: gate,
}
