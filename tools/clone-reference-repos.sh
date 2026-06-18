#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="$root/reference/open-source"

mkdir -p "$target"

clone_ref() {
  local name="$1"
  local url="$2"
  local commit="$3"
  local dir="$target/$name"

  if [[ -d "$dir/.git" ]]; then
    git -C "$dir" fetch --depth 1 origin "$commit"
  else
    rm -rf "$dir"
    git clone --filter=blob:none --no-checkout "$url" "$dir"
    git -C "$dir" fetch --depth 1 origin "$commit"
  fi

  git -C "$dir" checkout --detach FETCH_HEAD
}

clone_ref "macos-web" "https://github.com/PuruVJ/macos-web.git" "f0d4d4db147a1e5706bd3262e5aec5a08cef4026"
clone_ref "AppKit-on-the-Web" "https://github.com/andrewmcwattersandco/AppKit-on-the-Web.git" "7407236851a2a0a20636c7fbb010e5b5f843f7a1"
clone_ref "assistant-ui" "https://github.com/assistant-ui/assistant-ui.git" "bca6ebe3c5a5d12a1f654cd4b2eeb635c2baec72"
clone_ref "ribbon-menu" "https://github.com/olton/ribbon-menu.git" "2d695939b068e8cc58945e818b4493b69dda8881"
clone_ref "fluentui" "https://github.com/microsoft/fluentui.git" "672afec62c04eada141116387483d47c13c3da68"
clone_ref "react-browser-components" "https://github.com/EnhancedJax/react-browser-components.git" "9af4765144246ad0f2a68955fa893b4a9f53d747"
clone_ref "react-chrome-tabs" "https://github.com/pansinm/react-chrome-tabs.git" "929c02083e14c4769b1193bd52de39f805c1d52b"

echo "Reference repos restored under $target"
