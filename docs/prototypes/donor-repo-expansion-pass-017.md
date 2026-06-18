# Donor Repo Expansion Pass 017

Date: 2026-06-18

## Purpose

Refresh the open-source donor scan beyond the initial user-provided list and
add local restore coverage for newly useful UI references.

The goal is to keep the donor library broad enough for future fidelity passes
without turning UI Backlot into a bundle of third-party apps.

## Sources Added

- `dayflow-js/calendar`
  - Commit: `a6f59063ac46a766cf386a557d04a6ff44bae0c2`
  - License: MIT
  - Use: richer Calendar interactions, event editing, day/week/month/year
    views, sidebar calendars, drag/drop, search, and resource grids.
- `Renovamen/playground-macos`
  - Commit: `2c9e82dca487432ad9922ddf9b0a26aadeae81e5`
  - License: MIT
  - Use: React macOS desktop shell, Dock/menu/window state, Launchpad,
    Spotlight, and app-window decomposition.
- `esrakllci/macos-portfolio`
  - Commit: `23fe176c6e49d27edb06df365e11ba14708ea9a9`
  - License: MIT
  - Use: alternate Svelte macOS shell, Finder, Calendar, Notes, action center,
    traffic lights, and draggable window references.
- `Cognipeer/chat-ui`
  - Commit: `8cf89318f63b1099b8f5e6a7000a39b89ee36eea`
  - License: declares MIT in `package.json`; no top-level `LICENSE` file found
    in the inspected commit.
  - Use: secondary reference for AI chat message lists, file uploads, tool
    cards, and message action affordances.

## Changes

- Added pinned restore entries to `tools/clone-reference-repos.sh`.
- Ran `tools/clone-reference-repos.sh` and restored all original and new local
  donor clones.
- Updated `docs/research/open-source-ui-donor-repos.md` with the new candidates
  and license notes.
- Updated `reference/open-source/README.md` with clone table entries and
  file-level extraction targets.

## Verification

- `git ls-remote` resolved all four new repository HEADs before pinning.
- `tools/clone-reference-repos.sh` completed successfully and restored the new
  ignored local directories under `reference/open-source/`.
- License scan:
  - `dayflow-calendar`, `playground-macos`, and `macos-portfolio` include MIT
    `LICENSE` files.
  - `cognipeer-chat-ui` declares MIT in `package.json`, but needs attribution
    confirmation before copying substantial code.

## Remaining Gaps

- `dayflow-calendar` has now informed the Calendar sidebar/edit-affordance
  refinement, but no source files were copied.
- `playground-macos`, `macos-portfolio`, and `cognipeer-chat-ui` remain
  inventory additions only. The next implementation pass should extract one
  concrete UI improvement from one of those repos.
