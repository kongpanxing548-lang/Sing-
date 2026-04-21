param(
  [ValidateSet("project", "global")]
  [string]$Scope = "project",

  [Parameter(Mandatory = $true)]
  [string]$Title,

  [Parameter(Mandatory = $true)]
  [string]$Body,

  [string]$Workspace = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

if ($Scope -eq "project") {
  $dir = Join-Path $Workspace ".codex"
  $path = Join-Path $dir "learning-log.md"
} else {
  $dir = Join-Path $env:USERPROFILE ".codex"
  $path = Join-Path $dir "memory.md"
}

New-Item -ItemType Directory -Force -Path $dir | Out-Null

if (-not (Test-Path -LiteralPath $path)) {
  "# Codex Learning Log`n" | Set-Content -LiteralPath $path -Encoding UTF8
}

$date = Get-Date -Format "yyyy-MM-dd HH:mm zzz"
$entry = @"

## $date - $Title

$Body
"@

Add-Content -LiteralPath $path -Value $entry -Encoding UTF8
Write-Output $path
