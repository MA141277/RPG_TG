# Weekly Orchestration Plan

> **For agentic workers:** Use this file as the queue-level controller for the current weekly continuation set. Execute concrete code work from child plans only. Update both the child plan and this weekly orchestration plan after each work batch.

**Week Of:** `2026-07-02`

**Goal:** Open a fresh post-Child-13 weekly continuation set, promote `Child 14 Interactive Remaining Legacy Convergence` as the active executable child, record `Child 15 Navigation + Time Runtime Convergence` as the immediate queued follow-up, and keep later continuation work explicitly outside the executable queue until governance promotes it.

**Architecture:** This weekly set exists because the prior `2026-06-29` weekly queue is formally closed after Child 13 and must not be reopened. The fresh set starts from the current runtime-ownerization baseline, keeps `Child 14` as the only active executable child, records `Child 15` as the immediate queued follow-up, keeps `Child 16` as the locked later follow-up, and uses a fresh visibility bundle to keep queue truth readable.

**Tech Stack:** Markdown plan governance, TypeScript repository tasks, `npm run lint:plans`, child-plan verification commands, weekly artifact bundle under `docs/superpowers/weekly/2026-07-02-*`

## Execution State

- Status: `in-progress`
- Last Updated: `2026-07-02`
- Current Focus: `Fresh weekly continuation governance is now opened. Child 14 is the active executable child, Child 15 is the immediate queued follow-up, and Child 16 remains the locked later follow-up.`
- Next Step: `Start Child 14 from docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md Task 1 Step 1 and sync the fresh weekly visibility bundle after the first implementation batch.`
- Verification: `Initial fresh-weekly-set authoring: npm run lint:plans`
- Notes: `The closed 2026-06-29 weekly queue remains historical truth and must not be reopened. This file governs a fresh continuation set only. Child 14 is active; Child 15 Navigation + Time Runtime Convergence is formally queued but not executable; Child 16 Event + Scene Handoff Convergence remains the locked later follow-up.`

## Current Iteration Phase

- Iteration label: `runtime continuation set 1 after Child 13`
- Current phase: `fresh review complete; active execution unlocked`
- Entry trigger: `The prior weekly queue closed after Child 13, the remaining continuation was decomposed into three candidate children, and fresh governance now promotes Child 14 as the next executable child.`
- Exit trigger: `Child 14 closes and weekly governance explicitly decides whether the set remains open for a later executable child or closes again pending another fresh review.`

## Post-Queue Continuation Rules

- Candidate work recorded in architecture or review docs does not count as unlocked execution scope.
- `Child 15` and `Child 16` are not executable simply because they are named in this weekly set.
- Once this weekly set is closed and the weekly plan is marked `completed`, do not append a new executable child into this file; open another weekly orchestration plan instead.
- Keep queue depth explicit:
  - one `active executable child`: `Child 14`
  - one `immediate queued follow-up`: `Child 15`
  - one `locked follow-up child`: `Child 16`

## Progress Log

- 2026-07-02
  - Summary: `Authored the fresh 2026-07-02 weekly continuation set. Child 14 is now the active executable child, the fresh visibility companion and weekly artifact bundle are created, and Child 15 / Child 16 remain candidate-only follow-ups.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 14 Task 1 Step 1 and update both child and weekly state after the first implementation batch.`
- 2026-07-02
  - Summary: `Authored formal Child 15 spec/plan and promoted Child 15 into the fresh queue as the immediate queued follow-up behind Child 14. Child 16 remains the locked later follow-up and no later child is executable yet.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 14 as the only active executable child. Do not start Child 15 until Child 14 closes and weekly governance explicitly promotes Child 15.`

---

## Weekly Goal

- Execute one controlled continuation boundary only:
  - `Child 14 Interactive Remaining Legacy Convergence`
- Keep later continuation explicit but not yet executable:
  - `Child 15 Navigation + Time Runtime Convergence` as the immediate queued follow-up
  - `Child 16 Event + Scene Handoff Convergence`

## Weekly Scope

### In Scope

- `Child 14` spec/plan authoring and queue promotion
- `Child 14` implementation batches once started
- fresh weekly visibility bundle for the new continuation set
- queue truth for active child vs queued vs locked follow-ups

### Out Of Scope

- reopening the closed `2026-06-29` queue
- treating `Child 15` or `Child 16` as executable without separate promotion
- navigation/time or event/scene implementation before Child 14 closes
- boot/startup, save/load, presenter/UI, or unrelated runtime redesign

## Weekly Constraints

- Only one implementation child plan may be `in-progress` at a time in this set.
- Any production-code task must record:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Doc-only batches must explicitly say: `Not run as part of this doc-only change`.
- This weekly set is not complete until the visibility deliverables are updated.
- A later child may be promoted only after Child 14 state and weekly artifact wording are updated first.

## Weekly Deliverables

### Implementation Deliverables

- [x] `Child 14` formal spec authored
- [x] `Child 14` formal plan authored
- [x] `Child 15` formal spec authored
- [x] `Child 15` formal plan authored
- [x] `Child 16` formal spec authored
- [x] `Child 16` formal plan authored
- [x] fresh weekly set opened with `Child 14` as the active executable child
- [x] `Child 15` formally queued behind `Child 14`
- [x] `Child 16` formally recorded as the locked later follow-up
- [ ] `Child 14` production implementation completed
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

### Visibility Deliverables

- [x] Weekly review index updated
- [x] Module map updated
- [x] At least two real call-flow samples updated
- [x] Next split review updated
- [x] Architecture report with module diagram and flow diagrams updated
- [x] Fresh weekly artifact bundle synchronized on `2026-07-02`

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

## File Map

### Existing Files To Modify

- `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
  - Queue controller for the fresh continuation set.
- `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
  - Visibility companion for this set.
- `docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md`
  - Active executable child plan for this set.
- `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
  - Immediate queued follow-up child plan for this set.
- `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
  - Locked later follow-up child plan for this set.

### New Files To Create

- `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
  - Formal Child 14 boundary.
- `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
  - Formal Child 15 boundary.
- `docs/superpowers/specs/2026-07-02-child-16-event-scene-handoff-convergence-spec.md`
  - Formal Child 16 boundary.
- `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
  - Fresh weekly artifact index.
- `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
  - Fresh readable module map.
- `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
  - Fresh call-flow bundle.
- `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
  - Fresh next-split review for the new set.
- `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
  - Fresh architecture snapshot for the new set.

## Verification Policy

- Child plans still own their own detailed verification commands.
- This weekly plan should summarize whether the active child passed or failed verification.
- Doc-only weekly-governance batches may record:
  - `Not run as part of this doc-only change`

## Blocker Rules

- If Child 14 hits `P0`, stop later queue promotion and record the blocker here.
- If Child 14 hits `P1`, do not promote Child 15.
- `P2` may be deferred only if explicitly recorded and Child 15 does not depend on the unresolved area.

## Plan Status Board

### Completed

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Role: `Closed prior weekly queue controller through Child 13.`
  - Resume point: `Completed. Historical truth only; do not append new executable children.`

- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
  - Role: `Closed prior visibility companion through Child 13.`
  - Resume point: `Completed. Historical truth only; do not reuse for this set.`

### In Progress

- `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
  - Role: `Active queue controller for the fresh continuation set.`
  - Resume point: `Start Child 14 Task 1 Step 1 and sync weekly truth after the first batch.`

- `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
  - Role: `Active visibility companion for the fresh continuation set.`
  - Resume point: `Keep the 2026-07-02 weekly artifact bundle aligned with Child 14 execution.`

### Not Started

- `docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md`
  - Role: `Child 14 active executable child.`
  - Resume point: `Start Task 1 Step 1.`

- `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
  - Role: `Child 15 immediate queued follow-up.`
  - Resume point: `Wait for Child 14 closeout and later queue promotion before starting Task 1 Step 1.`

- `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
  - Role: `Child 16 locked later follow-up.`
  - Resume point: `Wait for Child 15 closeout and later queue promotion before starting Task 1 Step 1.`

### Blocked

- None currently recorded in this weekly set.

### Needs Reconciliation

- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Current file status: `in-progress`
  - Reason: `Parent orchestration context still exists, but concrete implementation remains governed by child plans and fresh weekly sets.`

## Execution Queue

1. `docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md`
   - Queue status: `not-started`
   - Primary subsystem boundary: `Interaction Runtime remaining legacy convergence`
   - Depends on: `the closed Child 13 queue, fresh weekly review, and authored Child 14 spec/plan`
   - Start condition: `satisfied; Child 14 is now explicitly promoted as the active executable child in this fresh weekly set`
   - Exit condition:
      - covered `activity-qte` lifecycle ownership is runtime-owned
      - covered `story-battle` lifecycle ownership is runtime-owned
      - `src/main.ts` no longer carries the covered interactive cleanup / follow-up tails
      - retained `legacy-interactive-adapter.ts` code is compatibility-only if any remains
      - Child 14 closeout sync updates the fresh weekly artifact bundle

2. `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
   - Queue status: `queued`
   - Primary subsystem boundary: `Navigation Runtime` and `Time Runtime` convergence
   - Depends on: `Child 14 completed, Child 14 closeout sync recorded, Child 15 spec/plan authored, and explicit weekly promotion from queued to active`
   - Start condition: `not yet satisfied while Child 14 remains open`
   - Exit condition:
      - covered navigation entry no longer depends on direct shell orchestration
      - covered time entry no longer depends on direct shell orchestration
      - `src/main.ts` keeps only shell-facing responsibilities for the converged progression paths
      - Child 16 remains outside execution until later promotion

3. `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
   - Queue status: `locked`
   - Primary subsystem boundary: `Event Runtime` and `Scene Runtime` handoff convergence
   - Depends on: `Child 14 completed, Child 15 completed, Child 15 closeout sync recorded, Child 16 spec/plan authored, and explicit weekly promotion from locked to active`
   - Start condition: `not yet satisfied while Child 14 or Child 15 remains incomplete`
   - Exit condition:
      - covered event activation no longer depends on shell-side stitching
      - covered event -> scene handoff no longer depends on ad hoc `src/main.ts` orchestration
      - any later continuation is re-reviewed as a new problem type if still needed

## Resume Rules

When resuming weekly work:

1. read this weekly plan's `Execution State`
2. read the latest weekly `Progress Log`
3. inspect the `In Progress` and `Not Started` groups in `Plan Status Board`
4. if no child implementation plan is `in-progress`, choose the first queue item whose dependencies are satisfied
5. then open that child plan and resume according to `plan-governance-spec`

If this weekly plan is already `completed` and no active queue item remains:

- do not append a new executable child into this file
- open another weekly orchestration plan for the next continuation set instead

## Task 1: Open The Fresh Continuation Set

**Files:**
- Modify: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`

- [x] **Step 1: Record the fresh weekly-set boundary**

Open a new weekly set instead of appending to the closed `2026-06-29` queue.

- [x] **Step 2: Promote Child 14 and keep later children candidate-only**

Record `Child 14` as the active executable child and keep `Child 15` / `Child 16` as candidate follow-ups only.

- [x] **Step 3: Run the governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

- [x] **Step 4: Add Child 15 as the immediate queued follow-up**

Record `Child 15` as formally queued but not executable, and keep `Child 16` as the locked later follow-up.

- [x] **Step 5: Add Child 16 as the locked later follow-up**

Record `Child 16` as formally in-queue but locked, not queued for execution and not executable.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- Child 14 implementation is complete or explicitly deferred with recorded reason
- all required visibility deliverables are complete
- no unresolved `P0` or `P1` remains in weekly scope
- the weekly review index links to every updated weekly artifact
- queue closeout wording is synchronized across the five core artifacts
- the latest `Progress Log` records the weekly outcome

## Completion Checklist

- [x] Plan checkboxes updated for the weekly-set opening batch
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
- [x] Weekly review index updated
- [x] Visibility deliverables linked and present
