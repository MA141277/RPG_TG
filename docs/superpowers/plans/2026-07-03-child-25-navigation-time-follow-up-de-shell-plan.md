# Child 25 Navigation Time Follow-Up De-Shell Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove shell-owned navigation/time post-settlement follow-up from `src/main.ts` and move that continuation into explicit runtime-owned contracts.

**Architecture:** Child 25 keeps `src/main.ts` as a request-dispatch shell while eliminating shell-owned continuation after navigation and time settlement. The migration must land each moved follow-up in an explicit owner and must not turn `main-runtime-orchestrator` into a new permanent gameplay center.

**Tech Stack:** TypeScript, `src/main.ts`, runtime modules under `src/core/runtime` and `src/application/runtime`, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Plan created; work has not started.`
- Next Step: `Start at Task 1 Step 1.`
- Verification: `Not run`
- Notes: `This plan is the active executable child in the continuation weekly set.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created from the post-Child-24 continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Start Task 1 Step 1.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-25-navigation-time-follow-up-de-shell-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Child 24 already moved startup apply and covered story-scene progression behind the initial orchestration seam.`
  - `The remaining active debt for this child is shell-owned post-settlement follow-up around covered navigation/time flows.`

## Implementation Scope

### In Scope

- covered navigation follow-up extraction
- covered time/day-start follow-up extraction
- removing shell-owned post-settlement chaining in `src/main.ts`

### Still Out Of Scope

- render purity work
- startup bootstrap cleanup
- active content ownership migration
- legacy startup seam retirement

## File Map

### Existing files to modify

- `src/main.ts`
  - remove shell-owned post-settlement follow-up for covered navigation/time flows
- `src/core/runtime/navigation-runtime.ts`
  - formalize navigation-owned or explicitly-routed follow-up if needed
- `src/core/runtime/time-runtime.ts`
  - formalize time-owned or explicitly-routed follow-up if needed
- `src/application/runtime/main-runtime-orchestrator.ts`
  - only if needed as a narrow migration facade
- `tests/robustness.test.cjs`
  - add or update boundary regressions for shell-owned follow-up removal
- `docs/superpowers/plans/2026-07-03-child-25-navigation-time-follow-up-de-shell-plan.md`
  - record progress and verification

### Existing files expected to be deleted

- `None expected unless a shell-only helper becomes dead code.`

### New files to create

- `Only if a narrow follow-up contract file is required; avoid generic helper growth.`

## Verification Plan

- Targeted verification:
  - `covered navigation flow still triggers the correct follow-up timing`
  - `covered time/day-start flow still triggers the correct follow-up timing`
- Required commands:
  - `npm run typecheck`
  - `npm run build`

## Task 1: Recheck Navigation And Time Follow-Up Ownership

**Files:**
- Read: `src/main.ts`
- Read: `src/core/runtime/navigation-runtime.ts`
- Read: `src/core/runtime/time-runtime.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-03-child-25-navigation-time-follow-up-de-shell-plan.md`

- [ ] **Step 1: Record the exact covered navigation/time follow-up call sites still owned by `main.ts`**

Document the remaining call chains and the business continuation each one performs.

- [ ] **Step 2: Add or update targeted ownership regressions**

Add checks that fail if covered navigation/time follow-up remains shell-owned after extraction.

- [ ] **Step 3: Keep the follow-up contract narrow**

Document the produced outcome names, the allowed follow-up consumer, and the write-back path. Do not move cross-domain continuation back into `navigation/time runtime` itself, and do not leave it in `src/main.ts`.

- [ ] **Step 4: Update plan state with the unchanged or narrowed baseline**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Extract Covered Navigation Follow-Up

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/runtime/navigation-runtime.ts`
- Modify: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Introduce or reuse an explicit follow-up owner for covered navigation continuation**

Keep the contract narrow and avoid creating a second generic orchestration center.

- [ ] **Step 2: Remove the corresponding shell-owned navigation follow-up**

`src/main.ts` should no longer decide the covered continuation after navigation settlement.

- [ ] **Step 3: Re-run the navigation-focused regressions**

Confirm the continuation still happens at the correct timing.

## Task 3: Extract Covered Time Follow-Up

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/runtime/time-runtime.ts`
- Modify: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Introduce or reuse an explicit follow-up owner for covered time/day-start continuation**

Keep council-priority or related timing logic outside shell-owned sequencing.

- [ ] **Step 2: Remove the corresponding shell-owned time follow-up**

`src/main.ts` should no longer manually continue business flow after time settlement.

- [ ] **Step 3: Re-run the time-focused regressions**

Confirm the continuation still happens at the correct timing.

## Task 4: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-25-navigation-time-follow-up-de-shell-plan.md`
- Modify: `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

- [ ] **Step 1: Run required verification**

Run:

```bash
npm run typecheck
npm run build
```

Expected:

- `PASS`

- [ ] **Step 2: Record any P0/P1 findings before closeout**

Do not close the plan if unresolved `P0` or `P1` remains in scope.

- [ ] **Step 3: Update weekly queue state**

Record whether Child 26 is now the next executable child.

## Exit Check

- [ ] `src/main.ts` no longer hand-stitches covered navigation follow-up for this child scope.
- [ ] `src/main.ts` no longer hand-stitches covered time follow-up for this child scope.
- [ ] The follow-up owner is explicit and documented.
- [ ] Weekly artifact sync is updated if boundary state changed.
- [ ] Weekly queue state is updated.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
