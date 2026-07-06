# Weekly Orchestration Plan

> **Historical Template:** Deprecated under `fail-closed progress-driven governance`. Do not create new active work from this template. Keep it only for historical weekly records.

> **Purpose:** Use this template to govern one lightweight weekly set / iteration set. It should stay small enough to answer only four questions: what this set is trying to finish, which child is active now, which child is next, and when this set must close.

**Week Of:** `YYYY-MM-DD`

**Goal:** Replace this line with the concrete weekly-set outcome.

**Architecture:** Replace this line with the subsystem boundary, queue controls, and scope constraints for this weekly set.

**Tech Stack:** Replace this line with the relevant stack, commands, and verification tools.

## Execution State

- Status: `not-started`
- Last Updated: `2000-01-01`
- Current Focus: `Not started.`
- Next Step: `Start Task 1 Step 1.`
- Verification: `Not run`
- Notes: `Update this block after every work batch.`

## Progress Log

- 2000-01-01
  - Summary: `Weekly set created.`
  - Verification: `Not run`
  - Next: `Author or resume the active child plan.`

---

## Weekly Scope

### In Scope

- Replace with the concrete boundary family this set is allowed to advance.

### Out Of Scope

- Replace with the adjacent areas that must not be absorbed into this set.

## Queue

Keep the visible queue intentionally shallow. Recommended maximum:

- one `active child`
- one `queued child`
- one `locked child`

Status meaning:

- `active`: executable now, must have both spec and plan
- `queued`: next promotion candidate, may stay spec-only until promotion
- `locked`: recorded in this set but not yet the next promotion candidate, may stay spec-only until later promotion
- `completed`: closed inside this set and kept only as queue history
- `blocked`: cannot continue until the recorded blocker is cleared

Transition note:

- after the prior `active` child closes and before the next child is promoted, this weekly set may temporarily have no `active` child

### Slot 1: Active Child

- Child: `Child A`
- Queue status: `active`
- Spec: `docs/superpowers/specs/...`
- Plan: `docs/superpowers/plans/...`
- Primary boundary: `Replace with the active boundary.`
- Depends on: `none` or `Replace with the required prerequisite.`
- Resume point: `Replace with the current plan focus or next step.`

### Slot 2: Queued Child

- Child: `Child B`
- Queue status: `queued`
- Spec: `docs/superpowers/specs/...`
- Plan: `Not authored until promotion`
- Primary boundary: `Replace with the queued boundary.`
- Depends on: `Child A completed and artifact sync updated.`
- Promotion note: `Promote only after baseline recheck against the latest artifact bundle.`

### Slot 3: Locked Child

- Child: `Child C`
- Queue status: `locked`
- Spec: `docs/superpowers/specs/...`
- Plan: `Not authored until promotion`
- Primary boundary: `Replace with the locked follow-up boundary.`
- Depends on: `Child B completed and artifact sync updated.`
- Promotion note: `Keep locked until the prior child closes and governance rechecks the baseline.`

## Promotion Rule

When the active child closes:

1. update the weekly artifact bundle
2. recheck the next queued child spec against the latest code + artifact baseline
3. record one result:
   - `unchanged`
   - `narrowed`
   - `superseded`
4. only then promote the next child to `active`
5. only after promotion author that child's executable plan

If the recheck result is `superseded`, do not auto-create a replacement child inside the same work batch.

If the prior active child is already marked `completed`, do not keep treating it as active just to avoid an empty slot.

## Close Rule

Close this weekly set when any of these becomes true:

- the set goal is achieved
- the visible queue has been consumed
- no remaining queued child is still executable after baseline recheck

After closeout:

- candidate work may stay recorded in artifacts
- no new executable child may be appended into this same weekly set
- later execution must start from a fresh weekly review and a new weekly orchestration plan

## Weekly Deliverables

- [ ] Active child plan exists and matches the current active queue slot
- [ ] Active child closeout or defer decision is reflected in weekly artifacts
- [ ] Weekly review index is updated
- [ ] Weekly module map is updated if boundary ownership changed
- [ ] Weekly architecture report is updated if queue state or maturity state changed
- [ ] Verification status is recorded for the active child

## Deliverable Files

- Weekly review index:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-review-index.md`
- Module map:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-module-map.md`
- Call flows:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-call-flows.md`
- Next split review:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-architecture-report.md`

Merged ownership:

- boundary checklist ownership lives in `weekly-module-map`
- change impact ownership lives in `weekly-review-index`
- module backlog ownership lives in `weekly-next-split-review`

## Verification Policy

- The active child plan owns detailed verification commands.
- This weekly plan only summarizes whether the active child verification passed, failed, or was not run.
- Doc-only governance batches may record `Not run as part of this doc-only change`.

## Blocker Rules

- If the active child hits `P0`, stop lower-priority queue execution and record the blocker here.
- If the active child hits `P1`, do not promote dependent queue items.
- `P2` may be deferred only if explicitly recorded and if the next promotion does not depend on the unresolved area.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- the set goal is complete or the queue is explicitly closed with no remaining executable child
- no unresolved `P0` or `P1` remains in weekly scope
- the active child result and queue state are synchronized across the weekly artifacts
- the latest `Progress Log` records the weekly outcome

## Completion Checklist

- [ ] Queue state updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
- [ ] Weekly review index updated
- [ ] Required visibility deliverables linked and present
