# Child 29 Legacy Startup Seam Retirement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove legacy startup seam participation from the primary startup path so builtin and mod startup share one explicit bootstrap contract.

**Architecture:** Child 29 is intentionally late-order work. It should run only after upstream startup/bootstrap/content ownerization has stabilized, and it must retire primary-path legacy translation without reintroducing unresolved ownership debt through a disguised fallback path.

**Tech Stack:** TypeScript, startup/bootstrap contracts, mod activation pipeline, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Candidate later work; explicitly deferred.`
- Next Step: `Reassess only after earlier continuation children complete and a fresh baseline recheck confirms readiness.`
- Verification: `Not run`
- Notes: `This child must remain late-order work so seam retirement does not mask unresolved upstream ownerization debt.`

## Progress Log

- 2026-07-03
  - Summary: `Plan scaffold created from the continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Keep deferred until upstream startup and content ownership stabilizes.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-29-legacy-startup-seam-retirement-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `legacy startup adapters remain migration residue on the primary path`
  - `this seam is still later-order work rather than the highest-risk active debt`

## Implementation Scope

### In Scope

- retire primary-path legacy startup seam
- converge builtin and mod startup on one bootstrap contract
- document any remaining compatibility seam as non-primary

### Still Out Of Scope

- upstream startup/bootstrap redesign not required for seam retirement
- active content ownership migration
- unrelated engine bootstrap redesign

## File Map

### Existing files to modify

- `src/main.ts`
  - remove primary-path reliance on legacy startup seam
- `src/core/adapters/legacy-main-adapter.ts`
  - retire or downgrade to compatibility-only use
- `src/core/adapters/mod-runtime-main-adapter.ts`
  - retire or downgrade to compatibility-only use
- `src/application/startup/startup-session-coordinator.ts`
  - align startup output with direct bootstrap consumption
- `src/core/mods/mod-runtime.ts`
  - if bootstrap contract output changes here
- `tests/robustness.test.cjs`
  - add or update legacy-seam retirement regressions
- `docs/superpowers/plans/2026-07-03-child-29-legacy-startup-seam-retirement-plan.md`
  - record progress and verification

### Existing files expected to be deleted

- `Possible legacy adapter files if fully retired.`

### New files to create

- `Only if a dedicated replacement bootstrap contract file is required.`

## Verification Plan

- Targeted verification:
  - `builtin startup succeeds without legacy seam in the primary path`
  - `mod/scenario startup succeeds without legacy seam in the primary path`
  - `no boot regression or white screen is introduced`
- Required commands:
  - `npm run typecheck`
  - `npm run build`

## Task 1: Recheck Legacy Startup Seam Baseline

**Files:**
- Read: `src/main.ts`
- Read: `src/core/adapters/legacy-main-adapter.ts`
- Read: `src/core/adapters/mod-runtime-main-adapter.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-03-child-29-legacy-startup-seam-retirement-plan.md`

- [ ] **Step 1: Record the remaining primary-path legacy seam usage**

Document the exact primary-path dependencies and whether any compatibility-only path must remain.

- [ ] **Step 2: Add or update legacy-seam retirement regressions**

Capture the boundary that primary startup should no longer route through legacy translation.

- [ ] **Step 3: Update plan state with the baseline result**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Retire Legacy Seam From The Primary Path

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/adapters/legacy-main-adapter.ts`
- Modify: `src/core/adapters/mod-runtime-main-adapter.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Introduce or reuse a legacy-free primary bootstrap contract**

Keep builtin and mod startup aligned to the same primary-path contract.

- [ ] **Step 2: Remove primary-path legacy seam usage**

Any remaining compatibility seam must be explicitly non-primary.

- [ ] **Step 3: Re-run the seam-retirement regressions**

Confirm startup remains correct without legacy primary-path routing.

## Task 3: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-29-legacy-startup-seam-retirement-plan.md`
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

Record whether the continuation queue closes or requires a fresh weekly review.

## Exit Check

- [ ] Primary startup path no longer depends on legacy startup seam.
- [ ] Builtin and mod startup share one explicit bootstrap contract.
- [ ] Any remaining compatibility seam is documented as non-primary.
- [ ] Weekly artifact sync is updated if boundary state changed.
- [ ] Weekly queue state is updated.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
