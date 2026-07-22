param(
  [int]$Port = 5173,
  [switch]$Background
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if ($Background) {
  $scriptPath = Join-Path $PSScriptRoot "dev-localhost-service.ps1"
  & $scriptPath -Action start -Port $Port
  exit $LASTEXITCODE
}

. (Join-Path $PSScriptRoot "resolve-node-path.ps1")

$nodeExecutable = Get-ProjectNodeExecutable
$viteCliPath = Get-ProjectPackageExecutable `
  -ProjectRoot $projectRoot `
  -PackageName "vite" `
  -RelativePaths @("bin\vite.js")

& $nodeExecutable $viteCliPath --host localhost --port $Port
