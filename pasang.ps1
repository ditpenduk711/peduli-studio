param([switch]$Lengkap)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
foreach ($c in 'node','git','python','ffmpeg') { if (-not (Get-Command $c -ErrorAction SilentlyContinue)) { Write-Host "Belum ada: $c. Pasang dulu, lalu ulangi."; exit 1 } }
Write-Host '1/4 Pustaka suara'
python -m pip install --quiet --disable-pip-version-check edge-tts numpy
if ($LASTEXITCODE) { exit 1 }
Write-Host '2/4 Remotion dan three.js'
Push-Location templat-video; npm install --no-audit --no-fund; $k = $LASTEXITCODE; Pop-Location; if ($k) { exit 1 }
Write-Host '3/4 Skill pihak ketiga (dari sumber aslinya)'
npx --yes skills add anthropics/skills --skill frontend-design canvas-design skill-creator algorithmic-art --agent claude-code --yes
if ($LASTEXITCODE) { Write-Host 'GAGAL memasang anthropics/skills, lihat README' }
npx --yes skills add obra/superpowers --skill verification-before-completion systematic-debugging brainstorming writing-plans --agent claude-code --yes
if ($LASTEXITCODE) { Write-Host 'GAGAL memasang obra/superpowers, lihat README' }
if ($Lengkap) { foreach ($r in 'anthropics/skills','thedotmack/claude-mem','obra/superpowers') { npx --yes skills add $r --skill '*' --agent claude-code --yes; if ($LASTEXITCODE) { Write-Host "GAGAL memasang $r" } } }
Write-Host '4/4 Panduan gaya Lemo-Opuscar'
if (-not (Test-Path pustaka/lemo-opuscar)) {
  git clone -q --filter=blob:none --sparse --no-checkout https://github.com/lemomo-ai/lemo-opuscar.git pustaka/lemo-opuscar
  Push-Location pustaka/lemo-opuscar
  git sparse-checkout set --no-cone '/*.md' '/LICENSE' '/LICENSES/' '/core/three/' '/core/lib.js' '/styles/*/STYLE.md' '/styles/README.md'
  git checkout -q 8ca0dd805e214bcc1d30714cd5b9d21cc02a454b
  Pop-Location
}
Write-Host 'Selesai. Buka Buka-Kantor.cmd, lalu buka folder ini di Claude Code.'
