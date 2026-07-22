param(
  [ValidateSet("start", "stop", "restart", "status")]
  [string]$Action = "start",
  [int]$Port = 5173
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectRoot ".runtime"
$pidFilePath = Join-Path $runtimeDirectory "dev-localhost.pid"
$outputLogPath = Join-Path $runtimeDirectory "dev-localhost.out.log"
$errorLogPath = Join-Path $runtimeDirectory "dev-localhost.err.log"

. (Join-Path $PSScriptRoot "resolve-node-path.ps1")
. (Join-Path $PSScriptRoot "process-environment.ps1")

$nodeExecutable = Get-ProjectNodeExecutable
$viteCliPath = Get-ProjectPackageExecutable `
  -ProjectRoot $projectRoot `
  -PackageName "vite" `
  -RelativePaths @("bin\vite.js")

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

function Start-LocalhostService {
  Remove-PidFileIfStale

  $existingProcess = Get-ServiceProcess
  if ($null -ne $existingProcess) {
    Write-Output "Localhost dev service is already running. PID: $($existingProcess.Id)"
    Write-Output "URL: http://localhost:$Port/"
    return
  }

  Ensure-RuntimeDirectory

  $arguments = @(
    $viteCliPath,
    "--host", "localhost",
    "--port", $Port
  )

  $process = Start-ProcessWithSanitizedEnvironment `
    -FilePath $nodeExecutable `
    -ArgumentList $arguments `
    -WorkingDirectory $projectRoot `
    -RedirectStandardOutput $outputLogPath `
    -RedirectStandardError $errorLogPath `
    -PassThru

  Set-Content -LiteralPath $pidFilePath -Value $process.Id -NoNewline

  Start-Sleep -Milliseconds 800
  $runningProcess = Get-ServiceProcess
  if ($null -eq $runningProcess) {
    throw "Localhost dev service exited immediately. Check logs under $runtimeDirectory"
  }

  Write-Output "Localhost dev service started. PID: $($runningProcess.Id)"
  Write-Output "URL: http://localhost:$Port/"
  Write-Output "Logs:"
  Write-Output "  $outputLogPath"
  Write-Output "  $errorLogPath"
}

function Stop-LocalhostService {
  $serviceProcess = Get-ServiceProcess
  if ($null -eq $serviceProcess) {
    Remove-PidFileIfStale
    Write-Output "Localhost dev service is not running."
    return
  }

  Stop-Process -Id $serviceProcess.Id -Force
  Remove-Item -LiteralPath $pidFilePath -Force -ErrorAction SilentlyContinue
  Write-Output "Localhost dev service stopped. PID: $($serviceProcess.Id)"
}

function Show-LocalhostServiceStatus {
  Remove-PidFileIfStale
  $serviceProcess = Get-ServiceProcess
  if ($null -eq $serviceProcess) {
    Write-Output "Localhost dev service status: stopped"
    return
  }

  Write-Output "Localhost dev service status: running"
  Write-Output "PID: $($serviceProcess.Id)"
  Write-Output "URL: http://localhost:$Port/"
  Write-Output "Logs:"
  Write-Output "  $outputLogPath"
  Write-Output "  $errorLogPath"
}

switch ($Action) {
  "start" {
    Start-LocalhostService
  }
  "stop" {
    Stop-LocalhostService
  }
  "restart" {
    Stop-LocalhostService
    Start-LocalhostService
  }
  "status" {
    Show-LocalhostServiceStatus
  }
}
