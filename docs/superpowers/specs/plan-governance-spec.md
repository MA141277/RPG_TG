# Superpowers Plan Governance Spec

## 1. Goal

This spec defines the required structure, execution discipline, acceptance gates, and bug-handling rules for files under `docs/superpowers/plans/`.

The target is to make repository plan files:

- executable by humans and agents
- resumable after interruptions
- auditable through persistent progress records
- enforceable through lightweight repository checks

## 2. Scope

This spec applies to:

- all implementation plans under `docs/superpowers/plans/`
- the shared template at `docs/superpowers/plans/_plan-template.md`

This spec does not define runtime game behavior.

## 3. Required Plan Sections

Every plan file must include these sections in markdown:

- title heading (`# ...`)
- `Goal`
- `Architecture`
- `Tech Stack`
- `## Execution State`
- `## Progress Log`
- at least one task section with checkbox steps

Recommended additional sections:

- `File Map`
- `Verification`
- `Completion Checklist`
- links to related specs

## 4. Execution State Contract

Every plan must contain an `Execution State` block with these fields:

- `Status`
- `Last Updated`
- `Current Focus`
- `Next Step`
- `Verification`
- `Notes`

Allowed `Status` values:

- `not-started`
- `in-progress`
- `blocked`
- `completed`
- `unknown`

Rules:

- `Next Step` must describe a concrete resume point
- `Verification` must summarize the last known validation state
- `Last Updated` must use `YYYY-MM-DD`
- `completed` may be used only when acceptance gates are satisfied
- `blocked` may be used only when the blocking condition is recorded in `Progress Log`

## 5. Progress Log Contract

Every plan must maintain a `## Progress Log` section.

Each entry must contain:

- date
- short summary
- verification result
- next action

Recommended format:

```md
- 2026-06-29
  - Summary: `Implemented shared loader.`
  - Verification: `npm run typecheck`, `npm run build`
  - Next: `Start Task 3 Step 1.`
```

Rules:

- append a new log entry at the end of every work batch
- do not silently replace prior log history
- if work stops because of a blocker, record the blocker in the latest log entry

## 6. Checkbox Rules

Checkbox steps are the durable task checklist.

Rules:

- use `- [ ]` for pending steps
- use `- [x]` for completed steps
- do not mark a checkbox complete before the corresponding work and verification are done
- if historical plans are imported without reliable progress, leave steps unchecked and record uncertainty in `Notes`

## 7. Verification Gates

### 7.1 Required Baseline Gate

At minimum, implementation work batches that modify production code should record:

- `npm run typecheck`
- `npm run build`

If a plan intentionally skips one of these commands, the reason must be recorded in `Progress Log`.

### 7.2 Feature-Specific Gate

Plans should add targeted checks where relevant, for example:

- tests for loader and parser work
- story flow regression checks for event/scene work
- house runtime regression checks for special-house work
- manual UI flow verification for navigation and interaction work

### 7.3 Documentation-Only Exception

Doc-only batches may record:

- `Not run as part of this doc-only change`

but must say that explicitly in `Verification`.

## 8. Bug Severity And Handling

Plans must classify discovered issues using these levels:

- `P0`
  - build failure, type failure, white screen, dead loop, save corruption, boot failure, unrecoverable main flow break
- `P1`
  - critical gameplay regression, blocked scenario progression, broken interaction, wrong content load, invalid pack resolution
- `P2`
  - non-critical UI issue, minor text mismatch, edge-case bug with workaround

Handling rules:

- unresolved `P0` blocks further feature work on lower-priority plans
- unresolved `P1` prevents the current plan from being marked `completed`
- `P2` may be deferred only if recorded in `Progress Log`, backlog, or follow-up plan

## 9. Acceptance Rules

### 9.1 Step Acceptance

A step is complete only when:

- the corresponding code or docs are changed
- the checkbox is marked `- [x]`
- `Execution State` reflects the new state
- verification is recorded

### 9.2 Plan Acceptance

A plan may be marked `completed` only when:

- required checkboxes are complete
- required verification has passed or documented exceptions were approved
- no unresolved `P0` or `P1` remains within the plan scope
- the latest `Progress Log` entry records the completion state

## 10. Resume Rules

When resuming a plan, use this priority order:

1. latest `Progress Log`
2. `Execution State.Next Step`
3. first unchecked checkbox
4. actual codebase state, if docs are stale

If these disagree, update the plan before continuing new implementation.

## 11. Repository Enforcement

Repository enforcement happens through:

- this spec
- `AGENTS.md` instructions
- `docs/superpowers/README.md`
- the plan lint script

The plan lint script is structural only. It checks format and required fields, not semantic correctness.
