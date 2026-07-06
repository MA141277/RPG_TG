# Blueprint Workflow Spec

## 1. Goal

This spec defines the repository's authoritative Blueprint workflow for long-running `mod-first` modularization work.

The workflow is intentionally simple:

- one global resume entry
- one current owner document
- one current repository target at a time
- multiple historical or future targets across different periods
- multiple queue documents for iteration work under that target

## 2. Scope

This spec applies to:

- `docs/blueprints/project-progress.md`
- `docs/blueprints/blueprint.md`
- target specs under `docs/blueprints/specs/`
- target plans under `docs/blueprints/plans/`
- queue documents under `docs/blueprints/queues/`
- blueprint templates under `docs/blueprints/templates/`

This spec governs workflow documentation only.

It does not define runtime game behavior.

## 3. Supersession

This spec supersedes the older `docs/superpowers/**` workflow as the repository's execution model for new work.

Rules:

- old `docs/superpowers/**` documents remain as historical reference
- old weekly plans, weekly reviews, queued-child specs, and related governance docs are not the source of truth for new execution
- new planning and resume work must start from `docs/blueprints/**`
- new work must not open another weekly orchestration plan under `docs/superpowers/plans/`

## 4. Normative Rules

The following rules are mandatory.

1. All new governed work must start from `docs/blueprints/project-progress.md`.
2. The repository must have exactly one current owner document at `docs/blueprints/blueprint.md`.
3. A blueprint must have exactly one current target spec and one current target plan at a time.
4. A blueprint may accumulate multiple target records across different periods, but only one target may be current during a given period.
5. The current target is the repository-level modularization target for the current period, not a short-lived iteration package.
6. Concrete iteration work must be organized into queue documents under `docs/blueprints/queues/`.
7. Queue tasks, not blueprint targets, are the default executable work units in this workflow.
8. Only one queue task may be `active` across the repository at a time unless a stronger written reason explicitly authorizes parallel execution.
9. New work must not create a second current target under the same current blueprint period.
10. Queue tasks use the allowed states:
   - `candidate`
   - `queued`
   - `active`
   - `blocked`
   - `done`
   - `dropped`
11. Closed or dropped queue tasks must remain recorded as history; they must not silently disappear from the workflow record.
12. Old `docs/superpowers/**` workflow files must not be updated to drive new execution ordering, except when explicitly preserving or clarifying historical truth.
13. New workflow documents must use the `docs/blueprints/**` layout defined by this spec.

## 5. Core Model

The blueprint workflow uses five governance layers.

### 5.1 Global Entry

`docs/blueprints/project-progress.md`

This file is the single global resume entry.

It answers:

- what the repository is currently optimizing for
- which blueprint is current
- which target is current in this period
- which queue is active
- which queue task is active
- what file must be opened next

### 5.2 Current Owner Document

`docs/blueprints/blueprint.md`

This file is the single current owner document.

It answers:

- what the current governing objective is
- what the current-period target is
- which queues belong to that target
- which queue is active right now
- what the current sequencing rule is

### 5.3 Current Target Spec

Target specs live under `docs/blueprints/specs/`.

A target spec is the boundary lock for one repository target period.

It records:

- the target goal
- the target boundary
- the target's non-goals
- the queue family expected under that target
- target-level exit conditions

There may be multiple target specs historically, but only one current target spec for the current blueprint period.

### 5.4 Current Target Plan

Target plans live under `docs/blueprints/plans/`.

A target plan is the target-level execution governor.

It records:

- the current modularization phase
- queue sequencing rules
- promotion rules for queue work
- target-level progress log

There may be multiple target plans historically, but only one current target plan for the current blueprint period.

### 5.5 Task Queues

Task queues live under `docs/blueprints/queues/`.

A queue records:

- one modularization topic boundary
- the ordered queue tasks for that topic
- task dependency notes
- the active task for that queue
- the next executable task for that queue

Queues are subordinate to the current target period.

They do not replace the single target spec and target plan.

## 6. Responsibility Boundaries

### 6.1 `project-progress.md`

Owns:

- global resume entry
- current blueprint pointer
- current target pointer
- current active queue pointer
- current active queue task pointer

Must not own:

- queue-local task breakdown
- queue-task implementation checklists

### 6.2 `blueprint.md`

Owns:

- current governing objective
- current-period target
- queue portfolio under that target
- repository-level execution truth

Must not own:

- queue-local task checklists
- file-by-file implementation steps

### 6.3 Target Spec

Owns:

- target-period boundary
- target non-goals
- target success definition
- target-to-queue relationship

Must not own:

- queue-local implementation steps
- live task execution state

### 6.4 Target Plan

Owns:

- target-level sequencing policy
- queue promotion rules
- target-level progress log
- target-level execution state

Must not own:

- detailed per-task implementation checklists for each queue

### 6.5 Task Queue

Owns:

- topic-local task ordering
- queue-task state changes
- active task for that queue
- next executable task for that queue

Must not own:

- a second current-period repository target
- repository-wide sequencing truth outside the current target period

## 7. Status Model

The allowed states for queue tasks are:

- `candidate`
  - known possible future work
  - not yet ordered for execution
- `queued`
  - approved upcoming work
  - ready after prerequisite completion
- `active`
  - the current executable work item
- `blocked`
  - work cannot safely continue until the recorded blocker is cleared
- `done`
  - work completed and passed required acceptance for its scope
- `dropped`
  - work was intentionally removed from the queue and will not continue in its prior form

Rules:

- a queue task moves from `candidate` to `queued` only when governance wants it visible in the ordered queue
- a queue task moves from `queued` to `active` only after a baseline recheck
- a queue task moves from `active` to `done`, `blocked`, or `dropped`
- a `blocked` queue task must record the blocker in the owning queue
- a `dropped` queue task must record why it was removed instead of silently disappearing

## 8. Artifact Chain

The canonical workflow chain is:

```text
project-progress -> blueprint -> target spec -> target plan -> task queue -> execution artifacts
```

Execution artifacts may include:

- code changes
- tests
- docs
- change-log updates
- screenshots or diagrams where relevant

Rules:

- no work should start from a free-floating queue or ad hoc note
- `project-progress.md` must always point to the current blueprint, current target, queue, and active queue task
- queue documents must be interpreted as children of the current target period, not as replacement targets for the same period

## 9. Naming Rules

### 9.1 General

Use lowercase kebab-case file names.

Dates use `YYYY-MM-DD`.

### 9.2 Required Canonical Files

- `docs/blueprints/project-progress.md`
- `docs/blueprints/blueprint.md`
- `docs/blueprints/blueprint-workflow-spec.md`

### 9.3 Target Spec

Recommended form:

- `docs/blueprints/specs/YYYY-MM-DD-<target>-target.md`

### 9.4 Target Plan

Recommended form:

- `docs/blueprints/plans/YYYY-MM-DD-<target>-target-plan.md`

### 9.5 Queues

Recommended form:

- `docs/blueprints/queues/<topic>-queue.md`

Examples:

- `docs/blueprints/queues/core-production-integration-queue.md`
- `docs/blueprints/queues/playable-runtime-queue.md`
- `docs/blueprints/queues/house-runtime-queue.md`

### 9.6 Templates

Recommended form:

- `docs/blueprints/templates/blueprint-template.md`
- `docs/blueprints/templates/project-progress-template.md`
- `docs/blueprints/templates/topic-queue-template.md`
- `docs/blueprints/templates/target-spec-template.md`
- `docs/blueprints/templates/target-plan-template.md`

## 10. Directory Layout

The blueprint workflow owns this directory family:

```text
docs/blueprints/
  blueprint-workflow-spec.md
  project-progress.md
  blueprint.md
  queues/
  specs/
  plans/
  templates/
```

Meaning:

- top level
  - global workflow documents
- `specs/`
  - target boundaries across different periods, with only one current target spec at a time
- `plans/`
  - target-level plans across different periods, with only one current target plan at a time
- `queues/`
  - modularization iteration queues
- `templates/`
  - repository-approved workflow templates

## 11. Resume Workflow

The required resume path is:

1. open `docs/blueprints/project-progress.md`
2. open `docs/blueprints/blueprint.md`
3. open the referenced current target plan
4. open the active queue
5. resume from the active queue's active task

If there is no active queue task:

1. inspect the active queue's next `queued` task
2. perform a baseline recheck
3. either:
   - promote it to `active`
   - mark it `blocked`
   - mark it `dropped`
   - or keep it `queued`

## 12. Acceptance Rules

### 12.1 Queue Task Acceptance

A queue task may be marked `done` only when:

- required task steps are completed
- required verification has passed or is explicitly waived with reason
- no unresolved in-scope `P0` or `P1` remains
- the queue history records closeout

### 12.2 Target Acceptance

The current target may be marked `done` only when:

- all required queues for the current target period are complete or intentionally dropped
- no active queue task remains
- `project-progress.md` and `blueprint.md` agree on final closeout state

## 13. Migration Rules

This spec starts a hard workflow cutover.

Rules:

- do not create new weekly orchestration plans under `docs/superpowers/plans/`
- do not create new queued-child specs under `docs/superpowers/specs/` for new work
- do not use old weekly review artifacts as the entrypoint for new execution
- do not delete old `docs/superpowers/**` workflow records unless a separate archival decision is made
- when older documents are consulted, treat them as historical context only

Immediate repository implication:

- the current blueprint should expose one current target for the current period and use queues for all concrete iteration work under it
