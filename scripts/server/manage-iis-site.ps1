param(
  [ValidateSet("Start", "Stop", "Restart", "Status")]
  [string]$Action = "Status",
  [string]$SiteName = "RPG_TG"
)

$ErrorActionPreference = "Stop"

Import-Module WebAdministration

switch ($Action) {
  "Start" {
    Start-Service WAS
    Start-Service W3SVC
    Start-Website -Name $SiteName
  }
  "Stop" {
    Stop-Website -Name $SiteName
  }
  "Restart" {
    Restart-Service W3SVC -Force
    Start-Website -Name $SiteName
  }
  "Status" {
    $site = Get-Website -Name $SiteName -ErrorAction Stop
    $w3svc = Get-Service W3SVC -ErrorAction Stop
    $was = Get-Service WAS -ErrorAction Stop

    Write-Host "Site: $($site.Name)"
    Write-Host "Site State: $($site.State)"
    Write-Host "Physical Path: $($site.PhysicalPath)"
    Write-Host "Bindings: $($site.Bindings.Collection.bindingInformation -join ', ')"
    Write-Host "W3SVC: $($w3svc.Status)"
    Write-Host "WAS: $($was.Status)"
  }
}
