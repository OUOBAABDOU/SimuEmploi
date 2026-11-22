param([int]$Port = 5180, [switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$stateRoot = Join-Path (Split-Path $PSScriptRoot -Parent) '.tooling/demo'
New-Item -ItemType Directory -Path $stateRoot -Force | Out-Null
$statePath = Join-Path $stateRoot 'processes.json'
$pythonPath = Join-Path $PSScriptRoot 'backend/.venv/Scripts/python.exe'
$tunnelPath = Join-Path (Split-Path $PSScriptRoot -Parent) '.tooling/cloudflared/cloudflared.exe'
if (-not (Test-Path -LiteralPath $tunnelPath)) { throw 'Installer cloudflared selon application/demo/README.md.' }
if (Test-Path -LiteralPath $statePath) {
    $old = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    if (Get-Process -Id $old.server.id -ErrorAction SilentlyContinue) {
        throw 'Une démo gérée est déjà lancée. Lire .tooling/demo/lien-public.txt ou arrêter avec application/stop-demo.ps1.'
    }
}
if (-not $SkipBuild) { & (Join-Path $PSScriptRoot 'run-demo.ps1') -BuildOnly }
$server = Start-Process -FilePath $pythonPath -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -ArgumentList @(
    '-m', 'uvicorn', 'tools.serve_demo:create_demo_app', '--factory', '--host', '127.0.0.1', '--port', "$Port", '--no-access-log'
) -RedirectStandardOutput (Join-Path $stateRoot 'server.log') -RedirectStandardError (Join-Path $stateRoot 'server.error.log')
$ready = $false
for ($n=0; $n -lt 20; $n++) {
    Start-Sleep -Milliseconds 500
    if ($server.HasExited) { throw 'Le serveur a quitté. Consulter .tooling/demo/server.error.log.' }
    try {
        $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/health/live" -TimeoutSec 2
        if ($health.status -eq 'ok') { $ready = $true; break }
    } catch { }
}
if (-not $ready) { Stop-Process -Id $server.Id -ErrorAction SilentlyContinue; throw 'Le serveur ne répond pas.' }
$tunnelLog = Join-Path $stateRoot 'tunnel.log'
$tunnel = Start-Process -FilePath $tunnelPath -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -PassThru -ArgumentList @(
    'tunnel', '--url', "http://127.0.0.1:$Port", '--no-autoupdate', '--protocol', 'http2'
) -RedirectStandardOutput (Join-Path $stateRoot 'tunnel.stdout.log') -RedirectStandardError $tunnelLog
@{
    port=$Port
    server=@{id=$server.Id; started_at=$server.StartTime.ToUniversalTime().ToString('o'); executable=$pythonPath}
    tunnel=@{id=$tunnel.Id; started_at=$tunnel.StartTime.ToUniversalTime().ToString('o'); executable=$tunnelPath}
} | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $statePath -Encoding utf8
$publicUrl = $null
for ($n=0; $n -lt 45; $n++) {
    Start-Sleep -Seconds 1
    if ($tunnel.HasExited) { throw 'Le tunnel a quitté. Consulter .tooling/demo/tunnel.log ; le serveur local reste accessible.' }
    if (Test-Path -LiteralPath $tunnelLog) {
        $match = [regex]::Match((Get-Content -LiteralPath $tunnelLog -Raw), 'https://[a-z0-9-]+\.trycloudflare\.com')
        if ($match.Success) { $publicUrl=$match.Value; break }
    }
}
if (-not $publicUrl) { throw 'Le lien public tarde à apparaître. Consulter .tooling/demo/tunnel.log.' }
$publicUrl | Set-Content -LiteralPath (Join-Path $stateRoot 'lien-public.txt') -Encoding utf8
Write-Host "Démo locale : http://127.0.0.1:$Port/"
Write-Host "Lien à partager : $publicUrl"
Write-Host 'Les deux processus restent lancés après la fermeture du terminal. Arrêter : .\application\stop-demo.ps1'
