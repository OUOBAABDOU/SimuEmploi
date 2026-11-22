$ErrorActionPreference = 'Stop'
$stateRoot = Join-Path (Split-Path $PSScriptRoot -Parent) '.tooling/demo'
$statePath = Join-Path $stateRoot 'processes.json'
if (-not (Test-Path -LiteralPath $statePath)) { throw 'Lancer start-demo.ps1 avant une mise à jour du serveur.' }
$state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
foreach ($service in @($state.tunnel, $state.server)) {
    $process = Get-Process -Id $service.id -ErrorAction Stop
    if ($process.StartTime.ToUniversalTime().Ticks -ne ([datetime]$service.started_at).ToUniversalTime().Ticks -or $process.Path -ne $service.executable) {
        throw "Le processus $($service.id) ne correspond plus à la démo enregistrée."
    }
}
& taskkill.exe /PID $state.server.id /T /F | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Échec de l'arrêt du serveur de démo enregistré." }
$pythonPath = Join-Path $PSScriptRoot 'backend/.venv/Scripts/python.exe'
$server = Start-Process -FilePath $pythonPath -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -ArgumentList @(
    '-m', 'uvicorn', 'tools.serve_demo:create_demo_app', '--factory', '--host', '127.0.0.1', '--port', "$($state.port)", '--no-access-log'
) -RedirectStandardOutput (Join-Path $stateRoot 'server.log') -RedirectStandardError (Join-Path $stateRoot 'server.error.log')
$state.server.id=$server.Id
$state.server.started_at=$server.StartTime.ToUniversalTime().ToString('o')
$state.server.executable=$pythonPath
$state | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $statePath -Encoding utf8
for ($n=0; $n -lt 20; $n++) {
    Start-Sleep -Milliseconds 500
    if ($server.HasExited) { throw 'Le serveur a quitté. Consulter .tooling/demo/server.error.log.' }
    try {
        $health = Invoke-RestMethod -Uri "http://127.0.0.1:$($state.port)/health/live" -TimeoutSec 2
        if ($health.status -eq 'ok') {
            Write-Host 'Serveur mis à jour ; le tunnel continue sur le lien courant.'
            Get-Content -LiteralPath (Join-Path $stateRoot 'lien-public.txt')
            return
        }
    } catch { }
}
throw 'Le serveur tarde à répondre ; consulter le journal.'
