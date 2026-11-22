param([string]$OutputDirectory)
$ErrorActionPreference = 'Stop'
if (-not $OutputDirectory) { $OutputDirectory = Join-Path (Split-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) -Parent) '.tooling/video/audio' }
$OutputDirectory = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$scenario = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'scenario.json') -Raw -Encoding utf8 | ConvertFrom-Json
Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $speaker.SelectVoice($scenario.voice)
    $speaker.Rate = 0
    $speaker.Volume = 100
    for ($i=0; $i -lt $scenario.scenes.Count; $i++) {
        $targetFile = Join-Path $OutputDirectory ('{0:D2}.wav' -f ($i+1))
        $speaker.SetOutputToWaveFile($targetFile)
        $speaker.Speak($scenario.scenes[$i].narration)
        $speaker.SetOutputToNull()
        Write-Host ('Voix française : scène {0}/{1}' -f ($i+1),$scenario.scenes.Count)
    }
} finally { $speaker.Dispose() }
