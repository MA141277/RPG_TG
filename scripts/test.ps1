param(
  [string[]]$TestArgs = @(
    "tests/robustness.test.cjs",
    "tests/hardcoded-scenario-pack-boundary.test.cjs",
    "tests/party-editor-stage-state.test.cjs",
    "tests/party-editor-ui-source.test.cjs"
  )
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

& $nodeExecutable $tscCliPath -p tsconfig.test.json
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

$testDistPath = Join-Path $projectRoot ".test-dist"
if (-not (Test-Path -LiteralPath $testDistPath)) {
  New-Item -ItemType Directory -Path $testDistPath | Out-Null
}

$testPackagePath = Join-Path $testDistPath "package.json"
Set-Content -LiteralPath $testPackagePath -Value '{"type":"commonjs"}' -NoNewline -Encoding UTF8

& $nodeExecutable --test @TestArgs
exit $LASTEXITCODE
