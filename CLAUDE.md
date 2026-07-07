# CLAUDE.md

@AGENTS.md

## Workspace convention

- `workspace/` is the ONE place for disposable working artifacts (gitignored;
  see workspace/README.md). Loop scratch goes to `workspace/fidelity/` and
  `workspace/interactions/`; ad-hoc crops and one-off files go to
  `workspace/scratch/`. Never scatter working PNGs at the repo root.
- Durable outputs keep their homes: score lineage → `reports/fidelity/`,
  dated ground truth → `reference/<family>/<date>/`, captures → `captures/`,
  renders → `renders/`.

## Reviewing loop work with the user

After a fidelity-push or interaction-push Judge phase (or any visual pass),
rebuild the review pages and give the user a way to look:

```bash
npm run compare:page   # workspace/compare.html — reference | before | current + overlay
npm run gallery:page   # workspace/gallery.html — every surface + demo GIF
npm run review         # build both + serve the repo on :4173
```

Both pages are fully self-contained (media inlined as data URIs) — publish the
`.artifact.html` variants as Claude Code Artifacts for remote monitoring during
long passes; redeploy the same file path so the URL stays stable.

Compare-page conventions:

- fidelity-push writes `workspace/fidelity/pass-log.json` after its Gate phase;
  the compare page renders each surface's applied changes + verdict from it.
  If you run fixes outside the workflow, append to the same shape:
  `{ pass, families: [{ family, verdict, applied: [{surface,file,change}] }] }`.
- Reference images are badged by provenance (gitignored = local-only/private,
  tracked = shareable). The page may inline local-only pixels — fine for local
  review or a private Artifact, NEVER commit it or publish it to GitHub (it
  lives in gitignored workspace/, so committing requires deliberate effort).

## Key commands

| Task | Command |
|---|---|
| Full pre-PR gate | `npm run open-source:check` |
| Validate surface inventory | `npm run registry:check` |
| Regenerate catalog after registry edits | `npm run catalog:generate` |
| Regenerate the public HyperFrames registry | `npm run registry:hf:generate` (validate: `registry:hf:check`) |
| Capture one surface | `npm run capture:<surface-id>` |
| Score vs ground truth | `npm run fidelity:score -- --label <n> --ours <capture.json> --theirs <tokens.json>` |
| Render the quickstart | `npm run example:quickstart:render` |
| Review pages | `npm run review` |
| Regenerate the hosted catalog (docs/index.html + thumbs) | `npm run pages:catalog` |

After editing `surfaces/registry.json` or any published composition, run BOTH
`catalog:generate` and `registry:hf:generate` — the committed `registry/` is
validated for staleness by `open-source:check` and will fail the gate if you
forget.
