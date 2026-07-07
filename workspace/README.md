# workspace/

The one place for **disposable working artifacts**. Everything here except
this README is gitignored — safe to delete at any time, never committed.

| Directory | What lands here | Written by |
|---|---|---|
| `fidelity/` | Before/after captures, score JSONs, stranger-test pairs, gate logs from fidelity passes | `.claude/workflows/fidelity-push.js` |
| `interactions/` | Rendered-frame extractions and repair-round artifacts from motion passes | `.claude/workflows/interaction-push.js` |
| `scratch/` | Ad-hoc crops, comparison snippets, one-off working files from any agent session | agents, humans |
| `compare.html` | Self-contained before/after review page (data-URI images) | `npm run compare:page` |
| `gallery.html` | Self-contained surface + interaction-demo gallery | `npm run gallery:page` |

## Reviewing loop work

```bash
npm run review        # rebuild compare.html + gallery.html, then serve on :4173
```

Open <http://localhost:4173/workspace/compare.html> or `gallery.html`. Both
pages are fully self-contained (media inlined as data URIs), so an agent can
also publish them as Claude Code Artifacts for remote review during long
passes — the convention is to rebuild and republish after each Judge phase.

Durable outputs do **not** belong here: score lineage goes to
`reports/fidelity/`, dated ground truth to `reference/<family>/<date>/`,
captures to `captures/`, renders to `renders/`.
