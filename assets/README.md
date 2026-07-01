# Assets

Tracked assets in this directory are small support assets used by editable demo
surfaces. The current project priority is highest-fidelity reconstruction, so
tracked assets may be source-authentic when they materially improve a real app
surface and their source is documented.

- `cursors/` contains generic editable pointer SVGs used by workflow wrappers.
- `app-icons/` contains simple hand-authored app-icon stand-ins for desktop
  scenes.
- `fonts/` contains source-authentic font binaries selected for fidelity, such
  as the Anthropic variable fonts used by Claude surfaces.
- `icons/source-authentic/` contains small reviewed SVG symbols extracted from
  real app or donor icon systems.

Shared font variables and `@font-face` declarations live in
`styles/backlot-foundation.css`. Because component mounting clones component
roots rather than document heads, a component that depends on the shared
foundation should import it from inside the component-root `<style>` block or
the parent workflow should include it directly.

Before adding new assets, read `docs/asset-policy.md`.
