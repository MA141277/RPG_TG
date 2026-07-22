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

function Get-ProjectPackageExecutable {
  param(
    [Parameter(Mandatory)]
    [string]$ProjectRoot,

    [Parameter(Mandatory)]
    [string]$PackageName,

    [Parameter(Mandatory)]
    [string[]]$RelativePaths
  )

  $packageRoots = New-Object System.Collections.Generic.List[string]

  $flatNodeModulesPath = Join-Path $ProjectRoot "node_modules\$PackageName"
  if (Test-Path -LiteralPath $flatNodeModulesPath) {
    $packageRoots.Add((Get-Item -LiteralPath $flatNodeModulesPath).FullName)
  }

  $pnpmStorePath = Join-Path $ProjectRoot "node_modules\.pnpm"
  if (Test-Path -LiteralPath $pnpmStorePath) {
    Get-ChildItem -LiteralPath $pnpmStorePath -Directory -ErrorAction SilentlyContinue |
      ForEach-Object {
        $pnpmPackageRoot = Join-Path $_.FullName "node_modules\$PackageName"
        if (Test-Path -LiteralPath $pnpmPackageRoot) {
          $packageRoots.Add((Get-Item -LiteralPath $pnpmPackageRoot).FullName)
        }
      }
  }

  foreach ($packageRoot in ($packageRoots | Select-Object -Unique)) {
    foreach ($relativePath in $RelativePaths) {
      $candidatePath = Join-Path $packageRoot $relativePath
      if (Test-Path -LiteralPath $candidatePath) {
        return (Get-Item -LiteralPath $candidatePath).FullName
      }
    }
  }

  $checkedLocations = @(
    "node_modules\$PackageName",
    "node_modules\.pnpm\*\node_modules\$PackageName"
  ) -join "`n- "

  $checkedExecutables = ($RelativePaths | ForEach-Object { "$PackageName\$_" }) -join "`n- "

  throw @"
Project package executable not found.

Package: $PackageName

Checked package roots:
- $checkedLocations

Checked executable paths:
- $checkedExecutables

If dependencies were installed with pnpm, ensure the package contents are present under node_modules/.pnpm.
"@
}
