param(
  [string[]]$Arguments = @("--noEmit", "-p", "tsconfig.json")
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

. (Join-Path $PSScriptRoot "resolve-node-path.ps1")

$nodeExecutable = Get-ProjectNodeExecutable
$tscCliPath = Get-ProjectPackageExecutable `
  -ProjectRoot $projectRoot `
  -PackageName "typescript" `
  -RelativePaths @("lib\tsc.js", "bin\tsc")

& $nodeExecutable $tscCliPath @Arguments
exit $LASTEXITCODE
