# Child 27 Startup Story Bootstrap Ownership Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `main.ts` ownership over startup-time story bootstrap so builtin, restore, and scenario startup flows begin from runtime-owned bootstrap output.

**Architecture:** Child 27 converges startup story bootstrap after render purity stabilizes. Startup builders must stop directly starting story events from shell-adjacent paths, and startup output must become bootstrap-complete before shell consumption.

**Tech Stack:** TypeScript, `src/main.ts`, `src/application/startup/startup-session-coordinator.ts`, story bootstrap flow, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 27 is closed. Startup story bootstrap is now owned by explicit startup coordination instead of shell-adjacent builders in main.ts.`
- Next Step: `Do not promote Child 28 in this batch; wait for a later explicit continuation request and baseline recheck.`
- Verification: `Passed: npm run typecheck; npm run build; npm run lint:plans; npm test -- --test-name-pattern="child 22|child 23|child 24|child 25|child 26|child 27".`
- Notes: `No in-scope P0/P1 remains. The contract stayed narrow: startup-story-bootstrap composes event bootstrap outside main.ts builders, and startup-session-coordinator returns bootstrap-complete createAppState closures for covered startup paths.`

## Progress Log

- 2026-07-03
  - Summary: `Plan scaffold created from the continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Promote only after Child 26 recheck confirms unchanged or narrowed scope.`
- 2026-07-03
  - Summary: `Baseline recheck completed after Child 26 closure. Scope remains unchanged: startup story bootstrap is still shell-adjacent because createScenarioPackAppState() and createHaozhouReturnEncounterAppState() in main.ts directly start story events before startup output reaches the shell apply seam.`
  - Verification: `Baseline inspection only; required commands not run yet.`
  - Next: `Start Task 1 Step 2 by adding failing startup-bootstrap ownership regressions.`
- 2026-07-03
  - Summary: `Added Child 27 regressions first, then introduced a narrow startup story bootstrap helper and moved bootstrap composition into startup-session-coordinator. main.ts startup builders now return unbootstrapped base state, while coordinator-issued createAppState closures are bootstrap-complete for builtin and scenario startup paths.`
  - Verification: `npm test -- --test-name-pattern="child 23|child 27"`.
  - Next: `Run typecheck/build/lint plus the broader child regression subset, then close Child 27 if no P0/P1 remains.`
- 2026-07-03
  - Summary: `Completed Child 27 closeout. Full verification passed, no in-scope P0/P1 remained, and the weekly queue was synced without promoting Child 28 in the same batch.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 22|child 23|child 24|child 25|child 26|child 27"`.
  - Next: `Wait for a later explicit continuation request before baseline-rechecking Child 28.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-27-startup-story-bootstrap-ownership-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Startup apply ownership already moved in Child 24, but startup story bootstrap still remains shell-adjacent in main.ts builder paths.`
  - `The remaining in-scope debt is direct startStoryEventById(...) usage inside createScenarioPackAppState() and createHaozhouReturnEncounterAppState().`
  - `Child 26 is already closed, so Child 27 can now execute without promoting Child 28.`

## Implementation Scope

### In Scope

- remove direct startup story bootstrap from `main.ts`
- converge builtin/restore/scenario startup bootstrap owner
- make startup output bootstrap-complete before shell consumption

### Still Out Of Scope

- active content migration
- legacy startup seam retirement
- general story runtime redesign

## File Map

### Existing files to modify

- `src/main.ts`
  - remove direct startup story bootstrap ownership
- `src/application/startup/startup-session-coordinator.ts`
  - absorb or delegate startup story bootstrap ownership
- `src/application/story/story-runtime.ts`
  - only if bootstrap contract must be formalized here
- `tests/robustness.test.cjs`
  - add or update startup-bootstrap ownership regressions
- `docs/superpowers/plans/2026-07-03-child-27-startup-story-bootstrap-ownership-plan.md`
  - record progress and verification

### Existing files expected to be deleted

- `None expected unless startup-only helper branches become dead code.`

### New files to create

- `Only if a dedicated startup bootstrap contract file is required.`

## Verification Plan

- Targeted verification:
  - `builtin startup still reaches the correct opening state`
  - `scenario startup still reaches the correct opening state`
  - `restore startup remains correct if bootstrap parity applies there`
- Required commands:
  - `npm run typecheck`
  - `npm run build`

## Task 1: Recheck Startup Bootstrap Ownership Baseline

**Files:**
- Read: `src/main.ts`
- Read: `src/application/startup/startup-session-coordinator.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-03-child-27-startup-story-bootstrap-ownership-plan.md`

- [x] **Step 1: Record the startup builder paths that still own direct story bootstrap**

Document the exact entry points and their remaining shell-adjacent ownership.

- [x] **Step 2: Add or update startup-bootstrap ownership regressions**

Capture the boundary that startup output should be bootstrap-complete before shell consumption.

- [x] **Step 3: Update plan state with the baseline result**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Move Startup Story Bootstrap Into Explicit Startup Ownership

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Introduce or reuse an explicit startup/bootstrap owner**

Keep builtin, restore, and scenario startup aligned to the same ownership rule.

- [x] **Step 2: Remove shell-adjacent direct startup story bootstrap**

`src/main.ts` should consume startup output rather than directly starting story events.

- [x] **Step 3: Re-run the startup-bootstrap regressions**

Confirm startup parity remains intact.

## Task 3: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-27-startup-story-bootstrap-ownership-plan.md`
- Modify: `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

- [x] **Step 1: Run required verification**

Run:

```bash
npm run typecheck
npm run build
```

Expected:

- `PASS`

- [x] **Step 2: Record any P0/P1 findings before closeout**

Do not close the plan if unresolved `P0` or `P1` remains in scope.

- [x] **Step 3: Update weekly queue state**

Record whether Child 28 remains candidate-only or is queued in a later cycle.

## Exit Check

- [x] `src/main.ts` no longer directly starts startup story events.
- [x] Startup bootstrap owner is explicit and documented.
- [x] Startup parity remains intact for covered flows.
- [x] Weekly artifact sync is updated if boundary state changed.
- [x] Weekly queue state is updated.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
