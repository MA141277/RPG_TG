# Weekly Orchestration Plan

> **Purpose:** Use this template to govern one weekly set / iteration set of implementation work. A weekly orchestration plan is a queue controller, not just a calendar-week note. It is not complete unless both implementation deliverables and visibility deliverables are finished.

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

## Current Iteration Phase

- Iteration label: `Replace with the governing iteration label.`
- Current phase: `Replace with one concrete phase such as planning, active execution, closeout, or review-prep.`
- Entry trigger: `Replace with the condition that allowed this weekly set to open.`
- Exit trigger: `Replace with the condition that closes this weekly set and forces a fresh weekly review before later continuation starts.`

## Post-Queue Continuation Rules

- Candidate work recorded in architecture or review docs does not count as unlocked execution scope.
- A later child must not start until governance explicitly records it as executable.
- Once this weekly set is closed and the weekly plan is marked `completed`, do not append a new executable child into the same file; open a new weekly orchestration plan instead.
- Keep queue depth explicit when relevant:
  - one `active executable child`
  - one `immediate queued follow-up`
  - one `locked follow-up child`

## Progress Log

- 2000-01-01
  - Summary: `Weekly plan created.`
  - Verification: `Not run`
  - Next: `Start Task 1 Step 1.`

---

## Weekly Goal

- Replace with the governing narrative for this weekly set.
- Example:
  - `Close the currently approved runtime continuation queue without reopening frozen contract scope.`

## Weekly Scope

### In Scope

- Replace with the concrete systems to touch this week.

### Out Of Scope

- Replace with the systems explicitly deferred this week.

## Weekly Constraints

- Only one implementation child plan may be `in-progress` at a time unless the weekly plan explicitly allows parallel work.
- Any production-code task must record:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Doc-only batches must explicitly say: `Not run as part of this doc-only change`.
- The weekly set is not complete until the visibility deliverables are updated.
- The same natural week may contain more than one weekly set if an earlier set closes and later continuation requires a fresh review.

## Weekly Deliverables

### Implementation Deliverables

- [ ] Child plan or implementation plan for the active workstream is updated
- [ ] Production code changes for this week are complete
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

### Visibility Deliverables

- [ ] Module map updated
- [ ] At least two real call-flow samples updated
- [ ] Next split review updated
- [ ] Architecture report with module diagram and flow diagrams updated
- [ ] Weekly review index updated
- [ ] Merged artifact ownership is synchronized across the five core artifacts

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

## File Map

### Existing Files To Modify

- `path/to/file`
  - Why it changes this week.

### New Files To Create

- `path/to/file`
  - Why it exists this week.

## Verification Policy

- Child plans still own their own detailed verification commands.
- This weekly plan should summarize whether the active child passed or failed verification.
- Doc-only weekly-governance batches may record:
  - `Not run as part of this doc-only change`

## Blocker Rules

- If the active child hits `P0`, stop lower-priority queue execution and record the blocker here.
- If the active child hits `P1`, do not promote dependent queue items.
- `P2` may be deferred only if explicitly recorded and the next queue item does not depend on the unresolved area.

## Plan Status Board

### Completed

- `path/to/completed-plan.md`
  - Role: `Replace with the completed child or supporting role.`
  - Resume point: `Completed.`

### In Progress

- `path/to/active-plan.md`
  - Role: `Replace with the active child or supporting role.`
  - Resume point: `Start Task N Step M.`

### Not Started

- `path/to/queued-plan.md`
  - Role: `Replace with the queued child or supporting role.`
  - Resume point: `Queued behind the active child.`

### Blocked

- `path/to/blocked-plan.md`
  - Role: `Replace with the blocked child or supporting role.`
  - Resume point: `Blocked by ...`

### Needs Reconciliation

- `path/to/legacy-plan.md`
  - Current file status: `unknown`
  - Reason: `Replace with why this item is not yet trustworthy enough to enter the active queue.`

## Execution Queue

1. `path/to/queue-item-plan.md`
   - Queue status: `not-started`
   - Primary subsystem boundary: `Replace with the main owned boundary for this child.`
   - Depends on: `Replace with dependency conditions.`
   - Start condition: `Replace with the queue unlock condition.`
   - Exit condition:
      - `Replace with concrete queue-level completion gates.`

## Resume Rules

When resuming weekly work:

1. read this weekly plan's `Execution State`
2. read the latest weekly `Progress Log`
3. inspect the `In Progress` and `Not Started` groups in `Plan Status Board`
4. if no child implementation plan is `in-progress`, choose the first queue item whose dependencies are satisfied
5. then open that child plan and resume according to `plan-governance-spec`

If this weekly plan is already `completed` and no active queue item remains:

- do not append a new executable child into this file
- open a new weekly orchestration plan for the next weekly set instead

## Task 1: Replace With Real Task Name

**Files:**
- Modify: `path/to/file`
- Read: `path/to/related-file`

- [ ] **Step 1: Implement the concrete change**

Describe the exact implementation action.

- [ ] **Step 2: Update the visibility outputs for this task**

Record at minimum:

- module map changes
- call-flow changes
- next split review changes
- architecture/report changes when boundary state or queue state moved

- [ ] **Step 3: Run the verification gate**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- `PASS`

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- all required implementation deliverables are complete
- all required visibility deliverables are complete
- no unresolved `P0` or `P1` remains in weekly scope
- the weekly review index links to every updated weekly artifact
- queue closeout wording is synchronized across the five core artifacts
- the latest `Progress Log` records the weekly outcome

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
- [ ] Weekly review index updated
- [ ] Visibility deliverables linked and present
