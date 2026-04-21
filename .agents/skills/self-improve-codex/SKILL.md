---
name: self-improve-codex
description: Create and maintain a lightweight self-improvement loop for Codex work. Use when the user asks for autonomous learning, self-improving Codex, project memory, post-task retrospectives, skill/rule refinement, or preserving lessons learned across repeated local tasks.
---

# Self-Improve Codex

## Overview

Use this skill to turn completed work into reusable operational memory. It does not retrain the model; it records lessons, project conventions, recurring commands, and future improvements in files that later Codex sessions can read.

## Workflow

1. At the end of a meaningful task, run a short retrospective:
   - What changed?
   - What command or workflow proved reliable?
   - What should Codex do differently next time?
   - Is the lesson project-specific or useful globally?
2. Prefer project-local memory first:
   - Write to `.codex/learning-log.md` in the active workspace.
   - Keep entries brief and dated.
3. Update global memory only when the user explicitly asks for cross-project behavior or the lesson clearly applies to all Codex work.
4. Convert repeated lessons into a new skill or update an existing skill when:
   - The same workflow has been used successfully at least twice.
   - The steps are specific enough to guide future execution.
   - A script or reference would reduce repeated manual work.
5. Do not store secrets, tokens, private credentials, or sensitive personal data in memory.

## Commands

Use `scripts/record-learning.ps1` to append a structured entry:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\admin\.codex\skills\self-improve-codex\scripts\record-learning.ps1 -Scope project -Title "Short lesson" -Body "What should be remembered."
```

Use `-Scope global` only when the user wants the lesson available across projects.

## Entry Quality

Good entries are operational:

- "Use `npm test -- --runInBand` in this repo because parallel tests exhaust memory."
- "When editing the desktop settings UI, keep labels under 20 Chinese characters to avoid clipping."

Avoid vague entries:

- "Be careful."
- "Tests failed once."
