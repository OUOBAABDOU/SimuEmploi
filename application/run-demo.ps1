param([int]$Port = 5180, [switch]$SkipBuild, [switch]$BuildOnly)
$ErrorActionPreference = 'Stop'
$pythonPath = Join-Path $PSScriptRoot 'backend/.venv/Scripts/python.exe'
if (-not (Test-Path -LiteralPath $pythonPath)) { throw 'Installer le backend selon application/README.md.' }
if (-not $SkipBuild) {
    $runtimeRoot = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies'
    $pnpmCommand = Get-Command pnpm -ErrorAction SilentlyContinue
    $pnpmPath = if ($pnpmCommand) { $pnpmCommand.Source } else { Join-Path $runtimeRoot 'bin/fallback/pnpm.cmd' }
    if (-not (Test-Path -LiteralPath $pnpmPath)) { throw 'Installer pnpm selon application/README.md.' }
    Push-Location -LiteralPath (Join-Path $PSScriptRoot 'frontend')
    try {
        & $pnpmPath run build --base=/application/
        if ($LASTEXITCODE -ne 0) { throw 'La construction du frontend a échoué.' }
    } finally { Pop-Location }
}
if ($BuildOnly) { return }
Write-Host "Démo locale : http://127.0.0.1:$Port/ — Ctrl+C pour arrêter."
Write-Host 'Partager à distance : lancer run-demo-tunnel.ps1 dans un autre terminal.'
Push-Location -LiteralPath $PSScriptRoot
try {
    & $pythonPath -m uvicorn tools.serve_demo:create_demo_app --factory --host 127.0.0.1 --port $Port --no-access-log
} finally { Pop-Location }
exit $LASTEXITCODE
