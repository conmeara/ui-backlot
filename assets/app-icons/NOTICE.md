# App icon attribution

macOS system app icons (finder.png, safari.png, notes.png, calendar.png,
terminal.png, messages.png) are from the macos-web project by Puru Vijay,
used under the MIT License:
https://github.com/PuruVJ/macos-web  (public/app-icons)

Other app icons (Claude, Office, Figma, Premiere) are sourced/recreated
separately; see the dock composition and per-file provenance.

`folder-generic.png` is Apple's own GenericFolderIcon, extracted directly
from this Mac's system resources (`sips -s format png
/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns`)
per the asset-sourcing ladder's "This Mac" rung
(docs/reference-and-asset-sourcing.md Part 2, step 3). Used in
compositions/claude-code-terminal-session.html's titlebar folder glyph to
match the real Claude Code CLI window chrome (reference/claude/2026-07-20/
cli-terminal-startup-dark).
