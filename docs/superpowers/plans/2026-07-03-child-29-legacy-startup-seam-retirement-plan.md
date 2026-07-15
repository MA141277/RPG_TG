# Child 29 Legacy Startup Seam Retirement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove legacy startup seam participation from the primary startup path so builtin and mod startup share one explicit bootstrap contract.

**Architecture:** Child 29 is intentionally late-order work. It should run only after upstream startup/bootstrap/content ownerization has stabilized, and it must retire primary-path legacy translation without reintroducing unresolved ownership debt through a disguised fallback path.

**Tech Stack:** TypeScript, startup/bootstrap contracts, mod activation pipeline, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 29 is closed. The primary startup path is legacy-seam-free and no further execution remains in scope.`
- Next Step: `None. Start a new governed plan only if a fresh continuation review identifies new shell debt.`
- Verification: `Passed: npm run typecheck; npm run build; npm run lint:plans; npm test -- --test-name-pattern="child 22|child 23|child 27|child 28|child 29".`
- Notes: `No unresolved P0/P1 was found in Child 29 scope. The primary startup path now stays on the existing startup/content contract, and no replacement compatibility sink was introduced.`

## Progress Log

- 2026-07-03
  - Summary: `Plan scaffold created from the continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Keep deferred until upstream startup and content ownership stabilizes.`
- 2026-07-03
  - Summary: `Baseline recheck confirms Child 29 scope remains unchanged. src/main.ts still imports legacy-main-adapter and mod-runtime-main-adapter, creates builtinLegacyBootstrapInput plus legacyEngineSession on the primary startup path, and still calls toLegacyBootstrapInput() from startup activation/apply helpers.`
  - Verification: `Baseline inspection only; required commands not run yet.`
  - Next: `Add RED regressions for retiring legacy startup seam participation from the primary path.`
- 2026-07-03
  - Summary: `Added Child 29 regressions, removed primary-path imports/calls to legacy-main-adapter and mod-runtime-main-adapter from src/main.ts, initialized builtin startup content through createActiveGameContentContextFromModActivation(), and retired the two legacy adapter files entirely.`
  - Verification: `npm test -- --test-name-pattern="child 29".`
  - Next: `Run typecheck/build/lint closeout verification before marking Child 29 complete.`
- 2026-07-03
  - Summary: `Closeout verification passed with no in-scope P0/P1 findings. Child 29 is complete: builtin and restored scenario startup remain on the same explicit startup session contract, and the primary path no longer routes through a legacy startup seam.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 22|child 23|child 27|child 28|child 29"`.
  - Next: `Close the weekly continuation queue for this bounded set.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-29-legacy-startup-seam-retirement-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `src/main.ts` still imports `./core/adapters/legacy-main-adapter` and `./core/adapters/mod-runtime-main-adapter` on the primary startup path`
  - `src/main.ts` still computes `builtinLegacyBootstrapInput`, bootstraps `legacyEngineSession`, and retains `toLegacyBootstrapInput(...)` calls inside startup activation/apply helpers`
  - `tests/robustness.test.cjs` still asserts that main.ts delegates boot through legacy-main-adapter, so Child 29 must flip that contract rather than generalize beyond seam retirement`

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

- [x] **Step 1: Record the remaining primary-path legacy seam usage**

Document the exact primary-path dependencies and whether any compatibility-only path must remain.

- [x] **Step 2: Add or update legacy-seam retirement regressions**

Capture the boundary that primary startup should no longer route through legacy translation.

- [x] **Step 3: Update plan state with the baseline result**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Retire Legacy Seam From The Primary Path

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/adapters/legacy-main-adapter.ts`
- Modify: `src/core/adapters/mod-runtime-main-adapter.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Introduce or reuse a legacy-free primary bootstrap contract**

Keep builtin and mod startup aligned to the same primary-path contract.

- [x] **Step 2: Remove primary-path legacy seam usage**

Any remaining compatibility seam must be explicitly non-primary.

- [x] **Step 3: Re-run the seam-retirement regressions**

Confirm startup remains correct without legacy primary-path routing.

## Task 3: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-29-legacy-startup-seam-retirement-plan.md`
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

Record whether the continuation queue closes or requires a fresh weekly review.

## Exit Check

- [x] Primary startup path no longer depends on legacy startup seam.
- [x] Builtin and mod startup share one explicit bootstrap contract.
- [x] Any remaining compatibility seam is documented as non-primary.
- [x] Weekly artifact sync is updated if boundary state changed.
- [x] Weekly queue state is updated.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
