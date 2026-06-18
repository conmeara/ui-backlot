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
clone_ref "react-desktop" "https://github.com/gabrielbull/react-desktop.git" "bba61374849dec896a9eea321cf4e3f02b3fd4c6"
clone_ref "PptxGenJS" "https://github.com/gitbrent/PptxGenJS.git" "3c9ec1b687c174952166f6a34b5e87ebf69fa469"
clone_ref "dayflow-calendar" "https://github.com/dayflow-js/calendar.git" "a6f59063ac46a766cf386a557d04a6ff44bae0c2"
clone_ref "playground-macos" "https://github.com/Renovamen/playground-macos.git" "2c9e82dca487432ad9922ddf9b0a26aadeae81e5"
clone_ref "macos-portfolio" "https://github.com/esrakllci/macos-portfolio.git" "23fe176c6e49d27edb06df365e11ba14708ea9a9"
clone_ref "cognipeer-chat-ui" "https://github.com/Cognipeer/chat-ui.git" "8cf89318f63b1099b8f5e6a7000a39b89ee36eea"
clone_ref "react-timeline-editor" "https://github.com/xzdarcy/react-timeline-editor.git" "4148f4a837dd767ea66807560d05bc7b65c7e578"

echo "Reference repos restored under $target"
