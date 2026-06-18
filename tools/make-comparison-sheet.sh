#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ref="${1:-$root/reference/claude/frame-study/sonnet-4-6/contact-sheet.jpg}"
proto="${2:-$root/snapshots/contact-sheet.jpg}"
out="${3:-$root/snapshots/reference-vs-prototype-contact-sheet.jpg}"
ref_label="${4:-REFERENCE - Claude Sonnet 4.6 launch frame study}"
proto_label="${5:-PROTOTYPE - UI Backlot Sonnet scene lab}"
font="/System/Library/Fonts/Supplemental/Arial.ttf"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

magick "$ref" -resize 1920x "$tmpdir/ref.jpg"
magick "$proto" -resize 1920x "$tmpdir/proto.jpg"

magick -size 1920x66 xc:"#151515" \
  -font "$font" -fill "#f7f5ef" -gravity West -pointsize 30 \
  -annotate +24+0 "$ref_label" \
  "$tmpdir/ref-label.png"

magick -size 1920x66 xc:"#151515" \
  -font "$font" -fill "#f7f5ef" -gravity West -pointsize 30 \
  -annotate +24+0 "$proto_label" \
  "$tmpdir/proto-label.png"

magick "$tmpdir/ref-label.png" "$tmpdir/ref.jpg" \
  "$tmpdir/proto-label.png" "$tmpdir/proto.jpg" \
  -append "$out"

echo "$out"
