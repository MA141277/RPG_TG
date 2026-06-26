param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
  [string]$SiteName = "RPG_TG",
  [string]$AppPoolName = "RPG_TG",
  [string]$IpAddress = "*",
  [int]$Port = 80,
  [string]$HostHeader = ""
)

$ErrorActionPreference = "Stop"

if (-not ([bool](net session 2>$null))) {
  throw "Please run this script in an elevated PowerShell session."
}

$distPath = Join-Path $ProjectRoot "dist"
if (-not (Test-Path $distPath)) {
  throw "Missing dist directory: $distPath. Run publish-iis-dist.ps1 first."
}

if (Get-Command Install-WindowsFeature -ErrorAction SilentlyContinue) {
  Install-WindowsFeature Web-Server -IncludeManagementTools | Out-Null
}

Import-Module WebAdministration

if (-not (Get-Service WAS -ErrorAction SilentlyContinue)) {
  throw "IIS service WAS is not available after installing Web-Server."
}

Set-Service WAS -StartupType Automatic
Set-Service W3SVC -StartupType Automatic
Start-Service WAS
Start-Service W3SVC

if (-not (Test-Path "IIS:\AppPools\$AppPoolName")) {
  New-WebAppPool -Name $AppPoolName | Out-Null
}

Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedRuntimeVersion -Value ""
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name autoStart -Value $true

$existingSite = Get-Website -Name $SiteName -ErrorAction SilentlyContinue
if ($null -ne $existingSite) {
  Stop-Website -Name $SiteName
  Remove-Website -Name $SiteName
}

if ([string]::IsNullOrWhiteSpace($HostHeader)) {
  New-Website -Name $SiteName -Port $Port -IPAddress $IpAddress -PhysicalPath $distPath -ApplicationPool $AppPoolName | Out-Null
} else {
  New-Website -Name $SiteName -Port $Port -IPAddress $IpAddress -HostHeader $HostHeader -PhysicalPath $distPath -ApplicationPool $AppPoolName | Out-Null
}

Start-Website -Name $SiteName

Write-Host "Installed IIS site '$SiteName' at http://$IpAddress`:$Port/"
if (-not [string]::IsNullOrWhiteSpace($HostHeader)) {
  Write-Host "Host header: $HostHeader"
}
