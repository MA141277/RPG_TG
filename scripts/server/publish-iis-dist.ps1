param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)

$ErrorActionPreference = "Stop"

$distPath = Join-Path $ProjectRoot "dist"
$webConfigPath = Join-Path $distPath "web.config"
$buildScriptPath = Join-Path $ProjectRoot "scripts\build.ps1"

Set-Location $ProjectRoot
& $buildScriptPath

if ($LASTEXITCODE -ne 0) {
  throw "Build failed with exit code $LASTEXITCODE."
}

if (-not (Test-Path $distPath)) {
  throw "Build output not found: $distPath"
}

$webConfig = @'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <defaultDocument enabled="true">
      <files>
        <clear />
        <add value="index.html" />
      </files>
    </defaultDocument>
    <staticContent>
      <remove fileExtension=".mjs" />
      <mimeMap fileExtension=".mjs" mimeType="text/javascript" />
    </staticContent>
  </system.webServer>
</configuration>
'@

Set-Content -Path $webConfigPath -Value $webConfig -Encoding UTF8
Write-Host "Published IIS-ready build to $distPath"
