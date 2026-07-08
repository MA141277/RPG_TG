param(
  [int]$Port = 5173
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

. (Join-Path $PSScriptRoot "resolve-node-path.ps1")

$nodeExecutable = Get-ProjectNodeExecutable
$viteCliPath = Join-Path $projectRoot "node_modules\vite\bin\vite.js"

if (-not (Test-Path -LiteralPath $viteCliPath)) {
  throw "Vite CLI not found. Run npm install in $projectRoot first."
}

& $nodeExecutable $viteCliPath --host localhost --port $Port
