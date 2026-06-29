param(
  [ValidateSet("start", "stop", "restart", "status")]
  [string]$Action = "start",
  [string]$ListenHost = "0.0.0.0",
  [int]$Port = 8080,
  [string]$StaticRoot = "dist",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectRoot ".runtime"
$pidFilePath = Join-Path $runtimeDirectory "standalone-service.pid"
$outputLogPath = Join-Path $runtimeDirectory "standalone-service.out.log"
$errorLogPath = Join-Path $runtimeDirectory "standalone-service.err.log"
$staticRootPath = [System.IO.Path]::GetFullPath((Join-Path $projectRoot $StaticRoot))

function Ensure-RuntimeDirectory {
  if (-not (Test-Path -LiteralPath $runtimeDirectory)) {
    New-Item -ItemType Directory -Path $runtimeDirectory | Out-Null
  }
}

function Get-ServiceProcess {
  if (-not (Test-Path -LiteralPath $pidFilePath)) {
    return $null
  }

  $rawPid = Get-Content -LiteralPath $pidFilePath -ErrorAction SilentlyContinue | Select-Object -First 1
  if ([string]::IsNullOrWhiteSpace($rawPid)) {
    return $null
  }

  $processId = 0
  if (-not [int]::TryParse($rawPid, [ref]$processId)) {
    return $null
  }

  $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
  if ($null -eq $process) {
    return $null
  }

  return $process
}

function Remove-PidFileIfStale {
  $serviceProcess = Get-ServiceProcess
  if ($null -eq $serviceProcess -and (Test-Path -LiteralPath $pidFilePath)) {
    Remove-Item -LiteralPath $pidFilePath -Force
  }
}

function Start-StandaloneService {
  Remove-PidFileIfStale

  $existingProcess = Get-ServiceProcess
  if ($null -ne $existingProcess) {
    Write-Output "Standalone service is already running. PID: $($existingProcess.Id)"
    Write-Output "URL: http://localhost:$Port/"
    return
  }

  if (-not (Test-Path -LiteralPath $staticRootPath)) {
    throw "Static root does not exist: $staticRootPath"
  }

  if (-not $SkipBuild) {
    Push-Location $projectRoot
    try {
      npm run build
    } finally {
      Pop-Location
    }
  }

  Ensure-RuntimeDirectory

  $nodeCommand = "node"
  $arguments = @(
    "scripts/serve-static.mjs",
    "--host", $ListenHost,
    "--port", $Port,
    "--root", $StaticRoot
  )

  $process = Start-Process `
    -FilePath $nodeCommand `
    -ArgumentList $arguments `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $outputLogPath `
    -RedirectStandardError $errorLogPath `
    -PassThru

  Set-Content -LiteralPath $pidFilePath -Value $process.Id -NoNewline

  Start-Sleep -Milliseconds 800
  $runningProcess = Get-ServiceProcess
  if ($null -eq $runningProcess) {
    throw "Standalone service exited immediately. Check logs under $runtimeDirectory"
  }

  Write-Output "Standalone service started. PID: $($runningProcess.Id)"
  Write-Output "URL: http://localhost:$Port/"
  Write-Output "Logs:"
  Write-Output "  $outputLogPath"
  Write-Output "  $errorLogPath"
}

function Stop-StandaloneService {
  $serviceProcess = Get-ServiceProcess
  if ($null -eq $serviceProcess) {
    Remove-PidFileIfStale
    Write-Output "Standalone service is not running."
    return
  }

  Stop-Process -Id $serviceProcess.Id -Force
  Remove-Item -LiteralPath $pidFilePath -Force -ErrorAction SilentlyContinue
  Write-Output "Standalone service stopped. PID: $($serviceProcess.Id)"
}

function Show-StandaloneServiceStatus {
  Remove-PidFileIfStale
  $serviceProcess = Get-ServiceProcess
  if ($null -eq $serviceProcess) {
    Write-Output "Standalone service status: stopped"
    return
  }

  Write-Output "Standalone service status: running"
  Write-Output "PID: $($serviceProcess.Id)"
  Write-Output "URL: http://localhost:$Port/"
  Write-Output "Logs:"
  Write-Output "  $outputLogPath"
  Write-Output "  $errorLogPath"
}

switch ($Action) {
  "start" {
    Start-StandaloneService
  }
  "stop" {
    Stop-StandaloneService
  }
  "restart" {
    Stop-StandaloneService
    Start-StandaloneService
  }
  "status" {
    Show-StandaloneServiceStatus
  }
}
