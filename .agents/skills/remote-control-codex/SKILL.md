---
name: remote-control-codex
description: Provide Windows-compatible remote control and computer-use style workflows for Codex. Use when the user asks Codex to control desktop apps, open URLs, operate browsers, send keystrokes, drive Chrome/Edge, automate local Windows UI, or replace the macOS-only Computer Use plugin on Windows.
---

# Remote-Control Codex

## Overview

Use this skill as a Windows substitute for the macOS "Computer Use" plugin. Prefer reliable APIs and automation hooks over blind UI interaction.

## Decision Tree

1. Browser task:
   - Prefer Playwright if a project already has it installed.
   - Otherwise launch a URL with `scripts/open-url.ps1`.
   - For repeatable web workflows, create a small Node or Playwright script in the workspace.
2. Desktop app task:
   - Prefer CLI, COM, registry, file format, or application-specific automation.
   - Use `scripts/send-keys.ps1` only for simple UI sequences after focusing a known window title.
3. File or system task:
   - Prefer PowerShell cmdlets and structured parsers.
4. Anything destructive or account-affecting:
   - Explain the intended action before executing and ask for confirmation when the result cannot be easily undone.

## Bundled Commands

Open a URL or file:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\admin\.codex\skills\remote-control-codex\scripts\open-url.ps1 -Target "https://example.com"
```

Focus a window and send keys:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\admin\.codex\skills\remote-control-codex\scripts\send-keys.ps1 -WindowTitle "Chrome" -Keys "^lhttps://example.com{ENTER}"
```

Check whether Playwright is available in the current workspace:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\admin\.codex\skills\remote-control-codex\scripts\check-playwright.ps1
```

Install Playwright into the current workspace when browser automation is needed:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\admin\.codex\skills\remote-control-codex\scripts\install-playwright.ps1
```

## Safety Rules

- Never type passwords, API keys, recovery codes, or payment details through keystroke automation.
- Prefer opening a page and letting the user complete sign-in manually.
- Before sending keys, identify the target window title and keep sequences short.
- Stop if the active window cannot be confidently matched.
