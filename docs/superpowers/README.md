# Superpowers Workflow Guide

This directory stores project-local operating docs for agentic implementation.

- `specs/`
  - Architecture targets, boundaries, and format rules.
- `plans/`
  - Executable task breakdowns with checkbox tracking and resume metadata.

These files are not runtime code and are not automatically executed by the game.
They are repository-local instructions for developers and agents.

The governing rules for plan structure, acceptance, and bug handling live in [specs/plan-governance-spec.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/plan-governance-spec.md).

## How To Execute A Plan

1. Pick a file under `docs/superpowers/plans/`.
2. Read any linked spec or architecture doc first.
3. Check the `Execution State` block.
4. Start from the `Next Step` line or the first unchecked checkbox.
5. Implement a small batch of work.
6. Before stopping, update:
   - checkboxes
   - `Execution State`
   - `Progress Log`
7. Run the listed verification commands and record the result.
8. Run `npm run lint:plans` after creating or materially restructuring a plan.

## How To Know Current Progress

Use these fields as the source of truth:

- `Status`
- `Current Focus`
- `Next Step`
- `Progress Log`

If the log is stale, fall back to the first unchecked checkbox.

## How To Resume After Codex Stops

1. Open the plan file.
2. Read `Execution State`.
3. Read the latest `Progress Log` entry.
4. Confirm the first unchecked checkbox still matches `Next Step`.
5. Continue from there.

If they disagree, prefer:

1. latest `Progress Log`
2. actual codebase state
3. first unchecked checkbox

## Required Update Discipline

At the end of each work batch:

- mark completed steps with `- [x]`
- update `Last Updated`
- update `Current Focus`
- update `Next Step`
- append one `Progress Log` entry
- record verification status or blocker

Without these updates, the plan cannot be resumed reliably.

## Template

Use [plans/_plan-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/_plan-template.md) for new plans.

For queue-level weekly coordination, use:

- [specs/weekly-orchestration-spec.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/weekly-orchestration-spec.md)
- [plans/2026-06-29-weekly-orchestration-plan.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md)

## Validation

Use:

```bash
npm run lint:plans
```

This structural lint checks:

- required sections
- required `Execution State` fields
- allowed `Status` values
- existence of checkbox steps

It does not prove the plan is semantically correct. Human or agent review is still required.
