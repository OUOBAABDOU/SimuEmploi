param([int]$Port = 5180)
$ErrorActionPreference = 'Stop'
$toolPath = Join-Path (Split-Path $PSScriptRoot -Parent) '.tooling/cloudflared/cloudflared.exe'
if (-not (Test-Path -LiteralPath $toolPath)) { throw 'cloudflared absent. Voir application/demo/README.md pour son installation.' }
$health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/health/live" -TimeoutSec 10
if ($health.status -ne 'ok') { throw 'Le serveur de démonstration ne répond pas.' }
Write-Host 'Le lien HTTPS *.trycloudflare.com apparaîtra ci-dessous. Il est temporaire.'
Write-Host 'Toute personne disposant du lien peut ouvrir la démo ; partager seulement pour les essais.'
Write-Host 'Ctrl+C ferme le tunnel et coupe cet accès extérieur.'
& $toolPath tunnel --url "http://127.0.0.1:$Port" --no-autoupdate --protocol http2
exit $LASTEXITCODE
