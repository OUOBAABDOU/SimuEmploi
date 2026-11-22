$ErrorActionPreference = 'Stop'
$statePath = Join-Path (Split-Path $PSScriptRoot -Parent) '.tooling/demo/processes.json'
if (-not (Test-Path -LiteralPath $statePath)) { Write-Host 'Aucune démo gérée à arrêter.'; return }
$state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
foreach ($service in @($state.tunnel, $state.server)) {
    $process = Get-Process -Id $service.id -ErrorAction SilentlyContinue
    if (-not $process) { continue }
    $expectedStart = ([datetime]$service.started_at).ToUniversalTime()
    if ($process.StartTime.ToUniversalTime().Ticks -ne $expectedStart.Ticks -or $process.Path -ne $service.executable) {
        throw "Le processus $($service.id) ne correspond plus à la démo enregistrée ; arrêt refusé."
    }
    # The Windows venv launcher may have a child interpreter: stop its verified tree.
    & taskkill.exe /PID $process.Id /T /F | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Échec de l’arrêt du processus de démo $($process.Id)." }
}
Write-Host 'Serveur et tunnel arrêtés. Le lien public ne donne plus accès à la démo.'
