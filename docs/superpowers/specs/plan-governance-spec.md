# Superpowers Plan Governance Spec

## 1. Goal

This spec defines the required governance model only for explicitly resumed legacy work tracked through `docs/superpowers/`.

The repository now uses Blueprint governance for current repository work under `docs/blueprints/**`.

`docs/superpowers/**` remains a **fail-closed, progress-driven workflow** only when a legacy superpowers artifact is intentionally reopened.

The strongest rule is:

**If a closeout cannot uniquely determine the next child, the next action, and the next entry document, that closeout is invalid.**

The purpose is to make repository work:

- resumable after interruption
- unambiguous for a different human or agent
- auditable through durable structured state
- fail-closed instead of summary-driven

## 2. Scope

This spec applies only to:

- all executable child plans under `docs/superpowers/plans/`
- the canonical project progress document at `docs/superpowers/project-progress.md`
- child closeout and task closeout structure
- plan templates and closeout templates used for new work

This spec does not define Blueprint governance or runtime gameplay behavior.

## 3. Canonical Governance Artifacts

### 3.1 Project Progress Document

Canonical path:

- `docs/superpowers/project-progress.md`

Role:

- the only allowed resume truth source for legacy `docs/superpowers/**` work
- the only allowed entry document for later continuation of legacy `docs/superpowers/**` work
- the only document allowed to authoritatively state current stage, task, child, and next action for legacy `docs/superpowers/**` work

### 3.2 Child Plan

Canonical location:

- `docs/superpowers/plans/*.md`

Role:

- the only executable implementation document
- owns execution state, progress log, step checklist, and verification

### 3.3 Child Spec

Canonical location:

- `docs/superpowers/specs/*.md`

Role:

- non-executable boundary lock
- records scope, exit conditions, and expected verification before implementation

### 3.4 Historical Weekly Artifacts

Historical-only examples:

- `docs/superpowers/plans/*weekly*.md`
- `docs/superpowers/weekly/*.md`
- `docs/superpowers/templates/weekly-*.md`

Rules:

- old weekly artifacts may remain as repository history
- they must not be used as the active execution controller
- no new work may be opened under the weekly governance model

## 4. Single Source Of Truth Rule

For legacy `docs/superpowers/**` work, the project progress document is the only valid resume truth source.

Every valid child closeout and task closeout must land there.

When resuming work, always do this:

1. open `docs/superpowers/project-progress.md`
2. read `Current Stage`
3. read `Current Task`
4. read `Next Child`
5. read `Next Required Action`
6. open the `Next Owner Document`

If those fields do not uniquely determine what to do next, the current governance state is invalid.

## 5. Forbidden Ambiguity

The following states are forbidden:

- natural-language summary without structured state
- git commits without a structured body summary
- saying “next is Child X” without recording Child X status
- saying “wait for recheck” without saying who rechecks and from which document to continue
- marking a child complete while the project progress document is stale
- saying a next child should start before its plan is updated
- handing work off before remote push succeeds
- allowing two documents to both look like the current resume entry

If any of these states exist, the current child or task must not be marked `closed`.

## 6. Required Plan Sections

Every new executable child plan must include:

- title heading (`# ...`)
- `Goal`
- `Architecture`
- `Tech Stack`
- `## Execution State`
- `## Progress Log`
- at least one task section with checkbox steps

Recommended additional sections:

- `Based On Spec`
- `Baseline Recheck`
- `Implementation Scope`
- `File Map`
- `Verification Plan`
- `Exit Check`
- `Completion Checklist`
- `## Child Closeout` when the child closes

Historical weekly plans may keep older structure, but new plans must not use weekly governance sections as the active control path.

## 7. Execution State Contract

Every new executable child plan must contain these fields in `Execution State`:

- `Status`
- `Last Updated`
- `Current Focus`
- `Next Step`
- `Verification`
- `Notes`

Allowed statuses for new work:

- `waiting`
- `running`
- `blocked`
- `completed-but-open`
- `closed`

Meaning:

- `waiting`
  - child exists but is not executable yet
- `running`
  - current active execution target
- `blocked`
  - cannot continue; blocker must be recorded in `Progress Log`
- `completed-but-open`
  - work is done but closeout is incomplete
- `closed`
  - all closeout gates have passed

Rules:

- `Next Step` must describe a concrete resume point
- `Verification` must summarize the latest known validation state
- `Last Updated` must use `YYYY-MM-DD`
- `closed` may be used only when all child closeout hard gates pass
- `completed-but-open` must be used when the work is finished but sync / push / structured closeout is still incomplete

Legacy note:

- historical plan files may still use older status values such as `not-started`, `in-progress`, `completed`, or `unknown`
- those values remain tolerated for historical records only
- new plans must use the new lifecycle states

## 8. Progress Log Contract

Every child plan must maintain a `## Progress Log` section.

Each entry must contain:

- date
- short summary
- verification result
- next action

Recommended format:

```md
- 2026-07-06
  - Summary: `Updated the project progress document and rewrote the child template.`
  - Verification: `npm run lint:plans`
  - Next: `Author the next child closeout template.`
```

Rules:

- append a new entry after every work batch
- do not silently replace prior log history
- if work stops because of a blocker, record the blocker in the latest entry

## 9. Child Closeout Hard Gates

A child may be marked `closed` only when all of these are true:

1. the child plan is updated to `closed`
2. task/queue state is synchronized in the child-local governance path
3. the project progress document is updated
4. the next child plan is already rechecked and updated, or `Next Child` is explicitly `none`
5. a structured `## Child Closeout` block exists
6. remote push succeeded

If any item is missing:

- the child must remain `running`, `blocked`, or `completed-but-open`
- the child must not be marked `closed`

## 10. Standard Child Closeout Block

Every child closeout must include this structure:

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
- Push Status: `success`
- Push Commit: `commit-sha`
- Resume From: `Open docs/superpowers/project-progress.md, then update the Child 34 plan.`
```

`Push Commit` must reference a commit whose message satisfies the repository commit-message rule: typed subject, blank line, and `Summary:` bullets.

If there is no next child:

```md
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `close-task`
- Next Owner Document: `none`
```

Rules:

- no field may be omitted
- no field may be inferred from prose
- the closeout block must match the project progress document

## 11. Task Closeout Hard Gates

A task may be marked `closed` only when:

- the final child closeout is valid
- the project progress document is synchronized
- the next task is explicit, or `none`
- a structured `## Task Closeout` block exists
- remote push succeeded

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
- Push Status: `success`
- Push Commit: `commit-sha`
- Resume From: `Open docs/superpowers/project-progress.md.`
```

`Push Commit` must reference a commit whose message satisfies the repository commit-message rule: typed subject, blank line, and `Summary:` bullets.

## 12. Required Project Progress Fields

`docs/superpowers/project-progress.md` must include, at minimum:

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

- these fields must be explicit
- `Next Child` may be `none`
- `Next Required Action` may never be empty
- `Next Entry Document` must always be `docs/superpowers/project-progress.md`
- `Next Owner Document` must identify the next concrete owner doc or `none`

## 13. Next Child Admission Rule

A next child may start only when all of these are true:

- the prior child has a valid structured closeout
- the project progress document is synchronized
- the next child plan has already been updated
- remote push status is `success`

If any of these are missing:

- the next child must remain `waiting`
- no implementation may start from that child

## 14. Verification Gates

### 14.1 Required Baseline Gate

At minimum, implementation work batches that modify production code should record:

- `npm run typecheck`
- `npm run build`

If one is intentionally skipped, the reason must be recorded.

### 14.2 Documentation-Only Exception

Doc-only batches may record:

- `Not run as part of this doc-only change`

but must say that explicitly in `Verification`.

## 15. Bug Severity And Handling

Plans must classify discovered issues using these levels:

- `P0`
  - build failure, type failure, white screen, dead loop, save corruption, boot failure, unrecoverable main flow break
- `P1`
  - critical gameplay regression, blocked scenario progression, broken interaction, wrong content load, invalid pack resolution
- `P2`
  - non-critical UI issue, minor text mismatch, edge-case bug with workaround

Rules:

- unresolved `P0` blocks lower-priority work
- unresolved `P1` prevents child closeout
- `P2` may be deferred only if explicitly recorded

## 16. Resume Rules

When resuming a child plan, use this order:

1. `docs/superpowers/project-progress.md`
2. latest `Progress Log`
3. `Execution State.Next Step`
4. first unchecked checkbox
5. actual codebase state, if docs are stale

If these disagree, update the governing docs before continuing implementation.

## 17. Historical Weekly Artifact Rule

Weekly artifacts are not deleted by this spec.

They remain:

- historical evidence
- migration context
- closed-record reference

They are not:

- the current execution entry point
- the current queue controller
- permission to open new implementation work

## 18. Repository Enforcement

Repository enforcement happens through:

- this spec
- `docs/superpowers/specs/2026-07-06-fail-closed-progress-driven-governance-spec.md`
- `AGENTS.md`
- `docs/superpowers/README.md`
- child plan templates
- project progress template
- closeout templates
- `tools/validate-commit-message.mjs`
- `tools/lint-superpowers-plans.mjs`

The lint tool is structural only. It does not prove semantic correctness, but it should reject obviously invalid plan structure where possible.
