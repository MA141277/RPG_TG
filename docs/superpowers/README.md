# Superpowers Workflow Guide

This directory stores project-local operating docs for agentic implementation.

- `specs/`
  - Architecture targets, queued-child specs, and format rules.
- `plans/`
  - Active child plans and weekly-set queue controllers with checkbox tracking and resume metadata.

These files are not runtime code and are not automatically executed by the game.
They are repository-local instructions for developers and agents.

The governing rules for plan structure, acceptance, and bug handling live in [specs/plan-governance-spec.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/plan-governance-spec.md).

## How To Execute An Active Child Plan

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

## Weekly Set Workflow

Use one lightweight weekly set to control one short queue of continuation work.

Recommended flow:

1. Create one weekly set plan.
2. Author up to three child specs under `docs/superpowers/specs/`.
3. Author a detailed plan only for the current `active child`.
4. Execute the active child and update artifacts.
5. Recheck the next queued child spec against the new baseline.
6. If the queued child is still valid, promote it and author its active plan.
7. Close the weekly set when the goal is reached, the visible queue is consumed, or no queued child remains executable.

Rules:

- only one child may be `active` at a time
- a queued child spec does not authorize implementation by itself
- queued children may stay as `unchanged`, become `narrowed`, or become `superseded` after baseline recheck
- once a weekly set is closed, later execution must start from a fresh weekly review and a new weekly set plan

## Templates

Use these canonical templates:

- Active child plan:
  - [plans/_plan-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/_plan-template.md)
- Weekly set queue controller:
  - [templates/weekly-plan-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/templates/weekly-plan-template.md)
- Queued child spec:
  - [templates/queued-child-spec-template.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/templates/queued-child-spec-template.md)

For queue-level weekly coordination, use:

- [specs/weekly-orchestration-spec.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/specs/weekly-orchestration-spec.md)
- [plans/2026-06-29-weekly-orchestration-plan.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md)

Interpretation note:

- one weekly orchestration plan represents one governed weekly set / iteration set
- it is not only a calendar-week container
- the same natural week may contain multiple weekly sets if an earlier set closes and later continuation requires a fresh review
- once a weekly set is closed, open a new weekly orchestration plan for later executable children instead of appending them to the closed one

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
