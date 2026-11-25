#!/bin/sh
set -e
cd "$(dirname "$0")"
for c in node git python3 ffmpeg; do command -v $c >/dev/null || { echo "Belum ada: $c"; exit 1; }; done
python3 -m pip install --quiet edge-tts numpy
(cd templat-video && npm install --no-audit --no-fund)
npx --yes skills add anthropics/skills --skill frontend-design canvas-design skill-creator algorithmic-art --agent claude-code --yes || echo "GAGAL anthropics/skills"
npx --yes skills add obra/superpowers --skill verification-before-completion systematic-debugging brainstorming writing-plans --agent claude-code --yes || echo "GAGAL obra/superpowers"
if [ "$1" = lengkap ]; then for r in anthropics/skills thedotmack/claude-mem obra/superpowers; do npx --yes skills add $r --skill '*' --agent claude-code --yes || echo "GAGAL $r"; done; fi
if [ ! -d pustaka/lemo-opuscar ]; then
  git clone -q --filter=blob:none --sparse --no-checkout https://github.com/lemomo-ai/lemo-opuscar.git pustaka/lemo-opuscar
  cd pustaka/lemo-opuscar
  git sparse-checkout set --no-cone '/*.md' '/LICENSE' '/LICENSES/' '/core/three/' '/core/lib.js' '/styles/*/STYLE.md' '/styles/README.md'
  git checkout -q 8ca0dd805e214bcc1d30714cd5b9d21cc02a454b
fi
echo "Selesai. Jalankan: node kantor/server.cjs"
