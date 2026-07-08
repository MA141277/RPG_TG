function Get-ProjectNodeExecutable {
  $command = Get-Command node -ErrorAction SilentlyContinue
  if ($null -ne $command) {
    return $command.Source
  }

  $candidatePaths = @(
    (Join-Path $env:ProgramFiles "nodejs\node.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "nodejs\node.exe"),
    (Join-Path $env:LOCALAPPDATA "Programs\nodejs\node.exe"),
    (Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe")
  ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

  foreach ($candidatePath in $candidatePaths) {
    if (Test-Path -LiteralPath $candidatePath) {
      return $candidatePath
    }
  }

  throw @"
Node.js executable not found.

Checked:
- current PATH
- $env:ProgramFiles\nodejs\node.exe
- ${env:ProgramFiles(x86)}\nodejs\node.exe
- $env:LOCALAPPDATA\Programs\nodejs\node.exe
- $env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
"@
}
