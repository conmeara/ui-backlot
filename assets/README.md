# Assets

Tracked assets in this directory are small, hand-authored support assets used
by the public demo surfaces.

- `cursors/` contains generic editable pointer SVGs used by workflow wrappers.
- `app-icons/` contains simple hand-authored app-icon stand-ins for desktop
  scenes.

Runtime font binaries copied from installed apps are intentionally kept local
and ignored by git. Composition CSS can reference local fonts when present and
fall back to bundled/system fonts when they are absent.

Before adding new assets, read `docs/asset-policy.md`.
