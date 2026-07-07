# Surfaces

The editable app surfaces live in [`../compositions/`](../compositions/); this
directory holds their inventory.

**[`registry.json`](registry.json) is the single source of truth** — one entry
per reusable surface, mapping it to its source file, HyperFrames import
selector (`import.src` + `import.selector`), capture command and image,
prototype note, source evidence, and asset/license decision. Everything else
is generated from it:

- [`../docs/catalog.md`](../docs/catalog.md) — the human/agent-readable
  catalog (`npm run catalog:generate`).
- The HyperFrames registry under [`../registry/`](../registry/) for external
  consumers (`npm run registry:hf:generate`).

Validate after any registry change:

```bash
npm run registry:check
npm run catalog:generate
```

Provenance and licensing decisions per surface are recorded in each entry's
`sourceEvidence` and `assetDecision` fields; the project-wide attribution
register is [`../RESOURCES.md`](../RESOURCES.md).

## Rule

Use screenshots as reference plates, not as final UI. Text, layout, colors, and
states stay editable HTML/CSS unless a temporary plate is explicitly called out.
