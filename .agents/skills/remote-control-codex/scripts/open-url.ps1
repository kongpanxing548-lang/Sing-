param(
  [Parameter(Mandatory = $true)]
  [string]$Target,

  [string]$Browser
)

$ErrorActionPreference = "Stop"

if ($Browser) {
  Start-Process -FilePath $Browser -ArgumentList $Target
} else {
  Start-Process $Target
}
