function Get-SanitizedProcessEnvironment {
  param(
    [System.Collections.IDictionary]$Source = [System.Environment]::GetEnvironmentVariables()
  )

  $result = @{}
  $preferredPathValue = $null

  foreach ($entry in $Source.GetEnumerator()) {
    $name = [string]$entry.Key
    $value = [string]$entry.Value

    if ($name -ceq "PATH") {
      $preferredPathValue = $value
      continue
    }

    if ($name -ieq "PATH") {
      if ($null -eq $preferredPathValue) {
        $preferredPathValue = $value
      }
      continue
    }

    if (-not $result.ContainsKey($name)) {
      $result[$name] = $value
    }
  }

  if ($null -ne $preferredPathValue) {
    $result["Path"] = $preferredPathValue
  }

  return $result
}

function Start-ProcessWithSanitizedEnvironment {
  param(
    [Parameter(Mandatory)]
    [string]$FilePath,

    [string[]]$ArgumentList = @(),

    [string]$WorkingDirectory,

    [string]$RedirectStandardOutput,

    [string]$RedirectStandardError,

    [ValidateSet("Normal", "Hidden", "Minimized", "Maximized")]
    [string]$WindowStyle = "Hidden",

    [switch]$PassThru
  )

  $startProcessArguments = @{
    FilePath = $FilePath
    ArgumentList = $ArgumentList
    WindowStyle = $WindowStyle
  }

  if (-not [string]::IsNullOrWhiteSpace($WorkingDirectory)) {
    $startProcessArguments["WorkingDirectory"] = $WorkingDirectory
  }

  if (-not [string]::IsNullOrWhiteSpace($RedirectStandardOutput)) {
    $startProcessArguments["RedirectStandardOutput"] = $RedirectStandardOutput
  }

  if (-not [string]::IsNullOrWhiteSpace($RedirectStandardError)) {
    $startProcessArguments["RedirectStandardError"] = $RedirectStandardError
  }

  if ($PassThru) {
    $startProcessArguments["PassThru"] = $true
  }

  $currentEnvironment = [System.Environment]::GetEnvironmentVariables()
  $sanitizedEnvironment = Get-SanitizedProcessEnvironment -Source $currentEnvironment
  $originalPathValue = $null
  $originalUpperPathValue = $null

  foreach ($entry in $currentEnvironment.GetEnumerator()) {
    $name = [string]$entry.Key
    if ($name -ceq "Path") {
      $originalPathValue = [string]$entry.Value
      continue
    }

    if ($name -ceq "PATH") {
      $originalUpperPathValue = [string]$entry.Value
    }
  }

  try {
    [System.Environment]::SetEnvironmentVariable("Path", $null, "Process")
    [System.Environment]::SetEnvironmentVariable("PATH", $null, "Process")

    if ($sanitizedEnvironment.ContainsKey("Path")) {
      [System.Environment]::SetEnvironmentVariable("Path", [string]$sanitizedEnvironment["Path"], "Process")
    }

    return Start-Process @startProcessArguments
  }
  finally {
    [System.Environment]::SetEnvironmentVariable("Path", $null, "Process")
    [System.Environment]::SetEnvironmentVariable("PATH", $null, "Process")

    if ($null -ne $originalPathValue) {
      [System.Environment]::SetEnvironmentVariable("Path", $originalPathValue, "Process")
    }

    if ($null -ne $originalUpperPathValue) {
      [System.Environment]::SetEnvironmentVariable("PATH", $originalUpperPathValue, "Process")
    }
  }
}
