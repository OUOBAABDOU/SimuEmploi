param([ValidateSet('api', 'web')][string]$Service = 'web')

$ErrorActionPreference = 'Stop'
$runtimeRoot = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies'

if ($Service -eq 'api') {
    Set-Location -LiteralPath (Join-Path $PSScriptRoot 'backend')
    $pythonPath = Join-Path (Get-Location).Path '.venv/Scripts/python.exe'
    if (-not (Test-Path -LiteralPath $pythonPath)) { throw 'Créer le venv et installer les dépendances selon application/README.md.' }
    & $pythonPath -m uvicorn simuemploi.app:create_app --factory --host 127.0.0.1 --port 8000
} else {
    Set-Location -LiteralPath (Join-Path $PSScriptRoot 'frontend')
    $pnpmCommand = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($pnpmCommand) { $pnpmPath = $pnpmCommand.Source }
    else { $pnpmPath = Join-Path $runtimeRoot 'bin/fallback/pnpm.cmd' }
    if (-not (Test-Path -LiteralPath $pnpmPath)) { throw 'Installer Node.js et pnpm 11.25.0 selon application/README.md.' }
    & $pnpmPath run dev
}
exit $LASTEXITCODE
