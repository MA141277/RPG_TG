# Weekly Orchestration Plan

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


> **Purpose:** Use this file to govern one lightweight continuation set after the closed Child 13 queue. This set should answer only four questions: what this set is trying to finish, which child is active now, which child is next, and when this set must close.

**Week Of:** `2026-07-02`

**Goal:** Close the fresh post-Child-13 continuation set after accepted Child 16 closeout, while preserving queue truth and preventing silent overflow into a new same-type child.

**Architecture:** The `2026-06-29` weekly queue is closed and remains historical truth only. This fresh set now treats accepted Child 14, Child 15, and Child 16 as completed history, consumes the visible queue, and closes without auto-creating another child. The `2026-07-02` weekly artifact bundle remains the closeout truth for this set.

**Tech Stack:** Markdown plan governance, TypeScript repository tasks, `npm run lint:plans`, child-plan verification commands, weekly artifact bundle under `docs/superpowers/weekly/2026-07-02-*`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `The 2026-07-02 weekly set is closed. Child 16 is completed history, there is no active child, and no additional queued child remains in this set.`
- Next Step: `Start a fresh weekly review only if a later continuation is still needed.`
- Verification: `Child 16 closeout batch: node --test tests/robustness.test.cjs --test-name-pattern "child 16|event runtime|scene runtime|story trigger"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
- Notes: `Do not reopen the closed 2026-06-29 queue or append a new child into this now-closed 2026-07-02 set.`

## Progress Log

- 2026-07-02
  - Summary: `Opened the fresh 2026-07-02 continuation set after the closed Child 13 queue. Child 14 is now the active child, while Child 15 and Child 16 are recorded as queued follow-up specs only.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 14 Task 1 Step 1 and update both child state and weekly artifacts after the first implementation batch.`
- 2026-07-02
  - Summary: `Completed Child 14 and synchronized the artifact bundle. Covered activity-qte tick/stop and story-battle action dispatch no longer route through legacy-interactive-adapter.ts, activity-qte result close now exits through interactive runtime, Child 14 moved to completed queue history, Child 15 remains the queued next promotion candidate, and Child 16 remains locked.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "child 14|activity qte result close|legacy adapter-owned qte|interactive request normalizer"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Run Child 15 baseline recheck before any promotion or closeout decision.`
- 2026-07-02
  - Summary: `Completed the Child 15 baseline recheck and recorded the result as narrowed, not unchanged. The covered execution target is now limited to enter-city navigation plus day-start/advance-segments time entry. Child 15 is promoted to active, its executable plan is authored, and Child 16 moves forward from locked to queued as the next follow-up candidate.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 15 Task 1 Step 1.`
- 2026-07-02
  - Summary: `Completed Child 15. The covered enter-city navigation path and covered day-start / advance-segments time paths now route through shared runtime dispatch using routeNavigationRuntime() and routeTimeRuntime(), with bounded shell-only residue explicitly limited to city-enter story triggering and council-priority follow-up. Child 15 moves to completed history, the weekly set temporarily has no active child, and Child 16 remains queued pending baseline recheck.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "child 15|navigation runtime|time runtime|progression"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Run Child 16 baseline recheck before any promotion or replacement decision.`
- 2026-07-02
  - Summary: `Completed the Child 16 baseline recheck and recorded the result as narrowed, not unchanged. The covered execution target is now limited to the triggerStoryEventsForTiming() production line with the current city-enter and indoor-screen-shown call sites. Child 16 is promoted to active, its executable plan is authored, and the weekly set leaves no additional queued child behind it right now.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 16 Task 1 Step 1.`
- 2026-07-02
  - Summary: `Completed Child 16 and closed the 2026-07-02 weekly set. The covered city-enter and indoor-screen-shown story trigger paths now route through one runtime-owned runStoryTriggerRuntime() seam, Child 16 moves to completed history, no later queued child is recorded in this set, and the queue is consumed rather than silently extended.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "child 16|event runtime|scene runtime|story trigger"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Use a fresh weekly review if another different problem type still needs continuation.`

---

## Weekly Scope

### In Scope

- `Child 16` closeout under its formal plan
- queue truth for active child vs queued spec vs completed history
- `2026-07-02` weekly artifact bundle updates that reflect Child 16 closeout and weekly-set closure

### Out Of Scope

- reopening the closed `2026-06-29` queue
- widening Child 16 beyond its narrowed triggerStoryEventsForTiming() boundary
- auto-creating a new queued child before Child 16 proves whether same-type residue remains
- boot/startup, save/load, presenter/UI, or unrelated runtime redesign

## Queue

Keep the visible queue intentionally shallow. Recommended maximum:

- one `active child`
- one `queued child`
- one `locked child`

Status meaning:

- `active`: executable now, must have both spec and plan
- `queued`: next promotion candidate after the current active child closes; may stay spec-only until promotion
- `locked`: recorded in this same set but not yet the next promotion candidate; may stay spec-only until later promotion
- `completed`: closed inside this set and kept only as queue history
- `blocked`: cannot continue until the recorded blocker is cleared

Transition note:

- after the prior `active` child closes and before the next child is promoted, this weekly set may temporarily have no `active` child

### Slot 1: Active Child

- Child: `None currently`
- Queue status: `active`
- Spec: `Not applicable`
- Plan: `Not applicable`
- Primary boundary: `No active executable child. This weekly set is closed.`
- Depends on: `Not applicable`
- Resume point: `Not applicable.`

### Slot 2: Queued Child

- Child: `None currently`
- Queue status: `queued`
- Spec: `None`
- Plan: `Not applicable`
- Primary boundary: `No queued child is recorded until Child 16 proves whether another later problem type exists.`
- Depends on: `Not applicable`
- Promotion note: `If Child 16 leaves a later child, record it explicitly only after Child 16 closeout or blocker review.`

### Slot 3: Locked Child

- Child: `None currently`
- Queue status: `locked`
- Spec: `None`
- Plan: `Not applicable`
- Primary boundary: `None currently recorded`
- Depends on: `Not applicable`
- Promotion note: `Use architecture review or a later fresh weekly set if another locked child is needed.`

## Promotion Rule

When the active child closes:

1. update the `2026-07-02` weekly artifact bundle
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

- Child 15 closes and governance decides not to keep the set open for Child 16
- the visible queue has been consumed
- no remaining queued child is still executable after baseline recheck

After closeout:

- candidate work may remain recorded in weekly artifacts
- no new executable child may be appended into this same weekly set
- later execution must start from a fresh weekly review and a new weekly orchestration plan

## Weekly Deliverables

- [x] `Child 14` spec exists
- [x] `Child 14` completed plan exists
- [x] `Child 15` active plan exists
- [x] `Child 16` queued spec exists
- [x] `2026-07-02` weekly artifact bundle exists
- [x] Child 14 closeout is synchronized
- [x] Child 15 promotion is synchronized
- [x] Weekly review index reflects the latest queue truth
- [x] Weekly architecture report reflects the latest queue truth and maturity state

## Deliverable Files

- Weekly review index:
  - `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Module map:
  - `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
- Call flows:
  - `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- Next split review:
  - `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`

Merged ownership:

- boundary checklist ownership lives in `weekly-module-map`
- change impact ownership lives in `weekly-review-index`
- module backlog ownership lives in `weekly-next-split-review`

## Verification Policy

- The active child plan owns detailed verification commands.
- This weekly plan summarizes either the current active-child verification state or doc-only promotion verification.
- Doc-only governance batches may record `Not run as part of this doc-only change`.

## Blocker Rules

- If the active child hits `P0`, stop later queue promotion and record the blocker here.
- If the active child hits `P1`, do not promote dependent queued children.
- `P2` may be deferred only if explicitly recorded and the next promotion does not depend on the unresolved area.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- the set goal is complete or the queue is explicitly closed with no remaining executable child
- no unresolved `P0` or `P1` remains in weekly scope
- the active child result and queue state are synchronized across the weekly artifacts
- the latest `Progress Log` records the weekly outcome

## Completion Checklist

- [x] Queue state updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
- [x] Weekly review index updated
- [x] Required visibility deliverables linked and present

