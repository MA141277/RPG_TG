# Fail-Closed Progress-Driven Governance Spec

## 1. Goal

Replace the old `weekly plan / weekly set / weekly orchestration` governance model for legacy `docs/superpowers/**` work with a fail-closed workflow that does not allow ambiguous continuation.

Current repository work is governed by Blueprint under `docs/blueprints/**`, not by this spec.

The new model has one hard rule:

**If a closeout cannot uniquely determine the next child, the next action, and the next entry document, that closeout is invalid.**

This spec exists to make continuation:

- unambiguous
- resumable by another human or agent
- auditable after interruption
- fail-closed instead of best-effort

## 2. Model Replacement

This repository formally deprecates the old weekly governance model for all new work and confines this spec to explicitly resumed legacy `docs/superpowers/**` work.

Deprecated as active governance:

- `weekly plan`
- `weekly set`
- `weekly orchestration plan`
- any weekly review artifact used as an execution entry

Historical-only status:

- old weekly artifacts may remain in the repository as history
- they must not be treated as the current execution controller
- they must not be used as the authoritative resume entry for new work

New governance model for legacy `docs/superpowers/**` work:

- one project progress document is the only resume truth source
- one child plan is the only executable implementation document
- closeout is valid when structure, project sync, and repository sync result recording are complete

## 3. Canonical Artifacts

### 3.1 Project Progress Document

Canonical path:

- `docs/superpowers/project-progress.md`

Role:

- the only entry document for resuming work
- the only document allowed to say what the current stage, task, child, and next action are
- the final landing point of every child closeout and task closeout

### 3.2 Child Plan

Canonical location:

- `docs/superpowers/plans/*.md`

Role:

- the only executable implementation document
- owns task checklist, execution state, verification, and child-local progress log

Rules:

- a child plan may not declare itself `closed` unless the project progress document is already synchronized
- a child plan may not act as the primary continuation entry point

### 3.3 Child Spec

Canonical location:

- `docs/superpowers/specs/*.md`

Role:

- non-executable boundary lock
- records goal, scope, out-of-scope, exit conditions, and expected verification

### 3.4 Historical Weekly Artifacts

Canonical locations today include:

- `docs/superpowers/plans/*weekly*.md`
- `docs/superpowers/weekly/*.md`
- `docs/superpowers/templates/weekly-*.md`

Role after this spec:

- historical record only
- migration reference only
- never the current execution controller

## 4. Single Source Of Truth Rule

For legacy `docs/superpowers/**` work, the project progress document is the only allowed resume truth source.

Every valid closeout must update it.

When resuming work, the operator must always do this:

1. open `docs/superpowers/project-progress.md`
2. read `Current Stage`
3. read `Current Task`
4. read `Next Child`
5. read `Next Required Action`

If these fields cannot uniquely identify the next step, the repository is in governance failure and the last closeout is invalid.

## 5. Forbidden Ambiguity

The new model explicitly forbids these states:

- natural-language summary without structured state
- git commits without a structured body summary
- saying “next is Child X” without recording Child X status
- saying “wait for recheck” without saying who rechecks and from which document to continue
- marking a child complete while the project progress document is not updated
- saying the next child should start before its plan is updated
- handing work off before repository sync result is recorded
- allowing two documents to both look like the current resume entry

If any of these states exist, the current child or task must not be marked `closed`.

## 6. Required Project Progress Fields

The project progress document must contain, at minimum, these structured fields:

- `Current Stage`
- `Current Stage Status`
- `Current Task`
- `Current Task Status`
- `Current Child`
- `Current Child Status`
- `Next Child`
- `Next Child Status`
- `Next Required Action`
- `Next Entry Document`
- `Next Owner Document`
- `Last Closed Item`
- `Push Status`
- `Push Commit`
- `Resume From`

Rules:

- these fields must be explicit, not implied by prose
- `Next Child` may be `none`
- `Next Required Action` may never be empty
- `Next Entry Document` must always be the project progress document itself
- `Next Owner Document` must identify the next concrete child plan or explicitly say `none`

## 7. Child Lifecycle

Allowed child lifecycle states:

- `waiting`
- `running`
- `blocked`
- `completed-but-open`
- `closed`

Rules:

- `waiting` means the child exists but is not yet executable
- `running` means the child is the current execution target
- `blocked` means execution cannot proceed and the blocker is recorded
- `completed-but-open` means implementation work is done but closeout is incomplete
- `closed` means all closeout gates have passed

`closed` is a stronger state than `completed`.

A child that finishes code or doc work but has not yet satisfied closeout requirements must stay `completed-but-open`.

## 8. Child Closeout Hard Gates

A child closeout is valid only when all of these are true:

1. the current child plan is updated to `closed`
2. the queue/task state is updated in the child-local governance path
3. the project progress document is updated
4. the next child plan is already rechecked and updated, or `Next Child` is explicitly `none`
5. a structured child closeout block is written
6. repository sync result is recorded as `success` or `failed`

If any item is missing:

- the child must remain `running`, `blocked`, or `completed-but-open`
- the child must not be marked `closed`

## 9. Standard Child Closeout Output

Every child closeout must include a fixed structured block.

Required shape:

```md
## Child Closeout

- Closed Child: `Child 33`
- Parent Task: `Task 4`
- Parent Stage: `Stage 2`
- Closeout Status: `closed`
- Project Progress Synced: `yes`
- Next Child: `Child 34`
- Next Child Status: `waiting`
- Next Required Action: `update-plan-and-recheck`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/<child-34-plan>.md`
- Push Status: `success | failed`
- Push Commit: `commit-sha | none`
- Resume From: `Open docs/superpowers/project-progress.md, then update the Child 34 plan.`
```

`Push Commit` must reference a commit whose message satisfies the repository commit-message rule: typed subject, blank line, and `Summary:` bullets.

If `Push Status` is `failed`, `Push Commit` may be `none`, but the failed sync result must be recorded in the child plan progress log or an equivalent sync summary field. Remote push failure alone must not invalidate closeout or block the next lawful handoff.

If no next child exists:

```md
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `close-task`
- Next Owner Document: `none`
```

Rules:

- none of these fields may be omitted
- none of these fields may be left to prose inference
- the closeout block must agree with the project progress document

## 10. Next Child Admission Rule

A next child may start only when all of these are true:

- the prior child has a valid structured closeout
- the project progress document is synchronized
- the next child plan has already been updated
- repository sync result is recorded as `success` or `failed`

If any of these are missing:

- the next child must remain `waiting`
- no implementation may start from that child plan

Remote push failure alone does not block next child admission or implementation start once the prior closeout, project progress document, and next child plan are otherwise synchronized.

## 11. Task Closeout Hard Gates

Task closeout uses the same fail-closed rule.

A task may be marked `closed` only when:

- all child closeout requirements are satisfied for the last child
- the task state is synchronized into the project progress document
- the next task is explicit, or `none`
- the required structured task closeout block exists
- repository sync result is recorded as `success` or `failed`

Required shape:

```md
## Task Closeout

- Closed Task: `Task 4`
- Parent Stage: `Stage 2`
- Task Closeout Status: `closed`
- Project Progress Synced: `yes`
- Next Task: `Task 5`
- Next Task Status: `waiting`
- Next Required Action: `update-first-child-plan`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/<first-child-plan>.md`
- Push Status: `success | failed`
- Push Commit: `commit-sha | none`
- Resume From: `Open docs/superpowers/project-progress.md.`
```

`Push Commit` must reference a commit whose message satisfies the repository commit-message rule: typed subject, blank line, and `Summary:` bullets.

If `Push Status` is `failed`, `Push Commit` may be `none`, but the failed sync result must be recorded in the task plan progress log or an equivalent sync summary field. Remote push failure alone must not invalidate task closeout.

If the task has no successor:

- `Next Task: none`
- `Next Task Status: none`
- `Next Required Action: close-stage`
- `Next Owner Document: none`

## 12. Stage And Project Closeout

Stage closeout and project closeout follow the same hard rule:

**No structured next step means no valid closeout.**

Required consequences:

- if the next stage exists, it must be named explicitly
- if the project is complete, the project progress document must say `Next Required Action: none` and `Resume From: docs/superpowers/project-progress.md`

## 13. Fail-Closed Rule

This is the strongest governance rule in the model:

**If closeout cannot uniquely determine `next child`, `next action`, and `next entry document`, the current child or task must not be marked `closed`.**

This rule overrides any softer narrative summary.

## 14. Migration Rule For Old Weekly Documents

Weekly documents remain historical only.

Migration requirements:

- no new work may be opened under a weekly plan
- old weekly plans may remain unchanged as historical record, or be labeled as deprecated history
- README, templates, and governance docs must stop instructing agents to resume from weekly artifacts
- the project progress document must become the only forward-looking resume artifact

## 15. Repository Enforcement Direction

The repository should enforce this model through:

- `docs/superpowers/specs/plan-governance-spec.md`
- `docs/superpowers/README.md`
- child plan templates
- project progress template
- closeout templates
- `tools/validate-commit-message.mjs`
- plan lint rules where structurally possible

Minimum enforcement intent:

- a child marked `closed` without a structured closeout block is invalid
- a child marked `closed` without a recorded repository sync result is invalid
- a repository state with no unique `Next Child` / `Next Required Action` / `Next Entry Document` is invalid

## 16. Recommended Implementation Order

Recommended repository migration order:

1. rewrite plan governance spec around this model
2. add the canonical `project-progress.md` template and required field contract
3. rewrite child plan templates around `waiting/running/completed-but-open/closed`
4. mark weekly templates and weekly workflow guidance as deprecated/historical
5. update README so resume always starts from the project progress document
6. update change log

## 17. Non-Goal

This spec does not require deleting historical weekly files from the repository.

The goal is governance replacement, not history erasure.
