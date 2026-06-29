# Weekly Implementation And Visibility Plan

> **Purpose:** Use this template to govern one week's implementation work and to force weekly "de-black-box" outputs. A weekly plan is not complete unless both implementation deliverables and visibility deliverables are finished.

**Week Of:** `YYYY-MM-DD`

**Goal:** Replace this line with the concrete weekly outcome.

**Architecture Focus:** Replace this line with the subsystem boundary or migration seam for this week.

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
  - Summary: `Weekly plan created.`
  - Verification: `Not run`
  - Next: `Start Task 1 Step 1.`

---

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
- The week is not complete until the visibility deliverables are updated.

## Weekly Deliverables

### Implementation Deliverables

- [ ] Child plan or implementation plan for the active workstream is updated
- [ ] Production code changes for this week are complete
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`

### Visibility Deliverables

- [ ] Module map updated
- [ ] Boundary checklist updated
- [ ] Module backlog updated
- [ ] At least two real call-flow samples updated
- [ ] Change impact record updated
- [ ] Next split review updated
- [ ] Architecture report with module diagram and flow diagrams updated
- [ ] Weekly review index updated

## Deliverable Files

- Weekly review index:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-review-index.md`
- Module map:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-module-map.md`
- Boundary checklist:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-boundary-checklist.md`
- Module backlog:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-module-backlog.md`
- Call flows:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-call-flows.md`
- Change impact:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-change-impact.md`
- Next split review:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/YYYY-MM-DD-weekly-architecture-report.md`

## File Map

### Existing Files To Modify

- `path/to/file`
  - Why it changes this week.

### New Files To Create

- `path/to/file`
  - Why it exists this week.

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
- change impact changes

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
- the latest `Progress Log` records the weekly outcome

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
- [ ] Weekly review index updated
- [ ] Visibility deliverables linked and present
