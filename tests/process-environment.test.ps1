param()

$ErrorActionPreference = "Stop"

$helperScriptPath = Join-Path (Split-Path -Parent $PSScriptRoot) "scripts\process-environment.ps1"
. $helperScriptPath

$source = New-Object "System.Collections.Generic.Dictionary[string,string]" ([System.StringComparer]::Ordinal)
$source.Add("FOO", "bar")
$source.Add("Path", "repo-path")
$source.Add("PATH", "sandbox-path")

$result = Get-SanitizedProcessEnvironment -Source $source
$keys = @($result.Keys)

if (-not $result.ContainsKey("Path")) {
  throw "Expected sanitized environment to contain Path."
}

if (($keys | Where-Object { $_ -ceq "PATH" }).Count -ne 0) {
  throw "Expected sanitized environment to collapse the uppercase PATH key."
}

if (($keys | Where-Object { $_ -ceq "Path" }).Count -ne 1) {
  throw "Expected sanitized environment to expose a single canonical Path key."
}

if ($result["Path"] -ne "sandbox-path") {
  throw "Expected sanitized environment to preserve the preferred PATH value."
}

if ($result["FOO"] -ne "bar") {
  throw "Expected sanitized environment to preserve non-path variables."
}

$tempOutputPath = Join-Path $env:TEMP ("process-environment-test-" + [guid]::NewGuid().ToString() + ".txt")
$childScript = "Set-Content -LiteralPath '$tempOutputPath' -Value 'started' -NoNewline"

try {
  $childProcess = Start-ProcessWithSanitizedEnvironment `
    -FilePath "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" `
    -ArgumentList @("-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $childScript) `
    -PassThru

  Wait-Process -Id $childProcess.Id -Timeout 10

  if (-not (Test-Path -LiteralPath $tempOutputPath)) {
    throw "Expected sanitized Start-Process wrapper to launch a child process successfully."
  }
}
finally {
  if (Test-Path -LiteralPath $tempOutputPath) {
    Remove-Item -LiteralPath $tempOutputPath -Force
  }
}

Write-Output "process-environment test passed"
