param(
  [Parameter(Mandatory = $true)]
  [string]$WindowTitle,

  [Parameter(Mandatory = $true)]
  [string]$Keys,

  [int]$DelayMilliseconds = 400
)

$ErrorActionPreference = "Stop"

$shell = New-Object -ComObject WScript.Shell
$activated = $shell.AppActivate($WindowTitle)

if (-not $activated) {
  throw "Could not find or activate a window matching title: $WindowTitle"
}

Start-Sleep -Milliseconds $DelayMilliseconds
$shell.SendKeys($Keys)
Write-Output "Sent keys to: $WindowTitle"
