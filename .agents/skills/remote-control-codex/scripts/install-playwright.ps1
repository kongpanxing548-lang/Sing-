$ErrorActionPreference = "Stop"

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm was not found. Install Node.js/npm before installing Playwright."
}

if (-not (Test-Path -LiteralPath (Join-Path (Get-Location).Path "package.json"))) {
  npm init -y | Out-Null
}

npm install -D @playwright/test
npx playwright install chromium

Write-Output "Playwright with Chromium is ready in this workspace."
