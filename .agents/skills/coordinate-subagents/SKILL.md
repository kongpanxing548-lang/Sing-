---
name: coordinate-subagents
description: Coordinate multiple Codex subagents for parallel exploration, implementation, review, or verification. Use when the user asks for multi-agent collaboration, subagents, parallel agents, delegated workers, independent review passes, or agent team workflows.
---

# Coordinate Subagents

## Overview

Use this skill to plan and run multi-agent work. The goal is to split independent work, keep ownership clear, and integrate results without duplicated effort.

## Workflow

1. Define the outcome and constraints in one paragraph.
2. Split only independent work:
   - Exploration agents answer specific codebase questions.
   - Worker agents edit disjoint files or modules.
   - Verification agents run checks or review risks while implementation continues.
3. State ownership for every worker:
   - Files, modules, or responsibility.
   - Explicitly tell workers they are not alone in the codebase and must not revert unrelated edits.
4. Keep the main agent on the critical path:
   - Do not delegate the next blocking step.
   - While subagents run, do non-overlapping local work.
5. Merge results deliberately:
   - Review changed files before trusting them.
   - Run relevant tests after integration.
   - Summarize what each agent contributed.

## Prompt Templates

Explorer:

```text
Inspect the codebase and answer this specific question: <question>. Do not edit files. Return file paths and line references for the key evidence.
```

Worker:

```text
You are responsible for <files/modules>. Implement <change>. You are not alone in the codebase; do not revert edits made by others, and adapt to concurrent changes. Edit files directly and list changed paths in your final answer.
```

Verifier:

```text
Verify <risk/check>. Prefer running the smallest relevant command. Report failures with exact commands and concise reproduction notes. Do not edit files unless asked.
```

## Guardrails

- Do not spawn agents for tiny tasks that are faster to do locally.
- Do not assign overlapping write sets to parallel workers.
- Do not wait repeatedly by reflex; wait only when the next main step needs the result.
- Close agents when their result has been integrated or is no longer useful.
