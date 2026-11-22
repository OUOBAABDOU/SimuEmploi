$ErrorActionPreference = 'Stop'
$pythonPath = Join-Path $PSScriptRoot 'backend/.venv/Scripts/python.exe'
$reviewRoot = Join-Path $PSScriptRoot 'docs/sprints/S0-cloture'
if (-not (Test-Path -LiteralPath $pythonPath)) { throw 'Environnement Python du projet absent ; voir application/README.md.' }
Write-Host 'Atelier S0 : http://127.0.0.1:5174/atelier.html — Ctrl+C pour arrêter.'
& $pythonPath -m http.server 5174 --bind 127.0.0.1 --directory $reviewRoot
exit $LASTEXITCODE
