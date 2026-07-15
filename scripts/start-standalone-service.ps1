param(
  [string]$ListenHost = "0.0.0.0",
  [int]$Port = 8080,
  [string]$StaticRoot = "dist",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$scriptPath = Join-Path $PSScriptRoot "standalone-service.ps1"

if ($SkipBuild) {
  & $scriptPath -Action start -ListenHost $ListenHost -Port $Port -StaticRoot $StaticRoot -SkipBuild
  return
}

& $scriptPath -Action start -ListenHost $ListenHost -Port $Port -StaticRoot $StaticRoot
