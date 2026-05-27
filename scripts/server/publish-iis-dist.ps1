param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)

$ErrorActionPreference = "Stop"

$distPath = Join-Path $ProjectRoot "dist"
$webConfigPath = Join-Path $distPath "web.config"

Set-Location $ProjectRoot
npm run build

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
      <mimeMap fileExtension=".mjs" mimeType="text/javascript" />
    </staticContent>
  </system.webServer>
</configuration>
'@

Set-Content -Path $webConfigPath -Value $webConfig -Encoding UTF8
Write-Host "Published IIS-ready build to $distPath"
