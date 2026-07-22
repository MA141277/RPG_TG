param(
  [string[]]$Arguments = @("build")
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

. (Join-Path $PSScriptRoot "resolve-node-path.ps1")

$nodeExecutable = Get-ProjectNodeExecutable
$viteCliPath = Get-ProjectPackageExecutable `
  -ProjectRoot $projectRoot `
  -PackageName "vite" `
  -RelativePaths @("bin\vite.js")

& $nodeExecutable $viteCliPath @Arguments
exit $LASTEXITCODE
