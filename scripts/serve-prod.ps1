param(
  [string]$ListenHost = "127.0.0.1",
  [int]$Port = 8080,
  [string]$StaticRoot = "dist"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

. (Join-Path $PSScriptRoot "resolve-node-path.ps1")

$nodeExecutable = Get-ProjectNodeExecutable
$staticServerEntryPath = Join-Path $projectRoot "scripts\serve-static.mjs"

& $nodeExecutable $staticServerEntryPath --host $ListenHost --port $Port --root $StaticRoot
exit $LASTEXITCODE
