# City-House Transition Composition Seam Lift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the covered city/house transition path onto one shared application seam so `house-runtime` stops open-coding the covered view transitions already represented by `city-view-transition`.

**Architecture:** Extend `src/application/runtime/city-view-transition.ts` from a city-only helper into the shared transition helper for covered city/house transitions, then route `house-runtime` through that seam for house entry, house leave, and house-session auto-advance completion. Keep story triggers, house-module lifecycle, and render orchestration where they already belong.

**Tech Stack:** TypeScript application runtime code, Node test runner through `tests/robustness.test.cjs`, `npm run typecheck`, `npm test`, and `npm run lint:blueprints`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-09`
- Current Focus: `Task 1 is implemented and governance closeout is being synchronized before the minimum repository sync batch.`
- Next Step: `Run fresh verification, then commit and push the implementation plus queue closeout docs.`
- Verification: `node --test --test-name-pattern "city-house transition seam" tests/robustness.test.cjs, npm run typecheck, npm test, and npm run lint:blueprints passed on 2026-07-09 after the covered seam changes landed.`
- Notes: `This plan executed the first implementation slice frozen by queue.cross-mechanism-composition-contract-closure and kept story/battle composition out of scope.`

## Progress Log

- 2026-07-09
  - Summary: `Plan created for inline execution after the design spec was approved and the active Blueprint queue froze city-house transition seam lift as the first implementation slice.`
  - Verification: `Not run`
  - Next: `Write the failing regression test before production code changes.`
- 2026-07-09
  - Summary: `Completed the red-green cycle for the covered city/house transition seam by extending applyCityViewTransition with house entry, house leave, and house-session resume variants, then routing the covered house-runtime transitions through that shared helper.`
  - Verification: `node --test --test-name-pattern "city-house transition seam" tests/robustness.test.cjs; npm run typecheck; npm test; npm run lint:blueprints`
  - Next: `Synchronize Blueprint queue closeout truth and run the minimum repository sync batch.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-09-city-house-transition-composition-seam-lift-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The active Blueprint queue still points at task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift.`
  - `The codebase still shows city-house-transition-coordinator using applyCityViewTransition while house-runtime directly writes currentView/overlayView for the covered house path.`

## Implementation Scope

### In Scope

- Extend `applyCityViewTransition(...)` to represent covered house entry/leave/session transitions.
- Route covered `house-runtime` view-state writes through that shared seam.
- Add regression coverage proving the seam owns the covered transitions.

### Still Out Of Scope

- Story-battle completion routing
- Main runtime orchestration restructuring
- Interactive action follow-up restructuring
- Prototype/bootstrap residue and scenario-pack normalization

## File Map

### Existing files to modify

- `src/application/runtime/city-view-transition.ts`
  - Add covered house-oriented transition request variants.
- `src/application/house/house-runtime.ts`
  - Replace open-coded covered view-state transitions with the shared helper.
- `tests/robustness.test.cjs`
  - Add regression coverage for the shared seam and a guard against covered direct house-runtime transition writes.

### New files to create

- `docs/superpowers/plans/2026-07-09-city-house-transition-composition-seam-lift-plan.md`
  - Execution controller for this implementation slice.

## Verification Plan

- Targeted verification:
  - `node --test --test-name-pattern "city-house transition seam" tests/robustness.test.cjs`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`

## Task 1: Shared City-House Transition Seam

**Files:**
- Modify: `src/application/runtime/city-view-transition.ts`
- Modify: `src/application/house/house-runtime.ts`
- Modify: `tests/robustness.test.cjs`
- Read: `src/application/runtime/city-house-transition-coordinator.ts`

- [x] **Step 1: Write the failing test**

Add a targeted regression test that proves the shared transition helper owns the covered house transitions and that `house-runtime` no longer open-codes the covered `currentView` / `overlayView` updates.

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-name-pattern "city-house transition seam" tests/robustness.test.cjs
```

Expected:

- `FAIL`
- The new regression fails because the covered house transition variants or their usage do not exist yet.

- [x] **Step 3: Write minimal implementation**

Extend `applyCityViewTransition(...)` with house-oriented transition request variants and update `house-runtime` to use that helper for the covered house entry, house leave, and house-session auto-advance transition writes.

- [x] **Step 4: Run targeted test to verify it passes**

Run:

```bash
node --test --test-name-pattern "city-house transition seam" tests/robustness.test.cjs
```

Expected:

- `PASS`

- [x] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run lint:blueprints
```

Expected:

- `PASS`

- [x] **Step 6: Sync progress and governance state**

Update this plan's `Execution State`, append a `Progress Log` entry, and update Blueprint queue truth if this task reaches a terminal after-state.

## Exit Check

- [x] The covered city/house transition path uses one shared application seam.
- [x] `house-runtime` no longer open-codes the covered view transitions.
- [x] Covered city/house behavior stays equivalent on the live path.
- [x] No broader story or battle composition families are absorbed.
- [x] Project progress sync is updated if the plan state changes.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
