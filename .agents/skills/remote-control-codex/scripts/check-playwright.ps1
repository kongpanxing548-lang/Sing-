$ErrorActionPreference = "Stop"

$hasPackage = Test-Path -LiteralPath (Join-Path (Get-Location).Path "node_modules\@playwright\test")
$hasNpx = $null -ne (Get-Command npx -ErrorAction SilentlyContinue)

if ($hasPackage) {
  Write-Output "Playwright is installed in this workspace."
  exit 0
}

if ($hasNpx) {
  Write-Output "Playwright is not installed locally. You can run: npm install -D @playwright/test"
  exit 1
}

Write-Output "Playwright is not available, and npx was not found."
exit 1
