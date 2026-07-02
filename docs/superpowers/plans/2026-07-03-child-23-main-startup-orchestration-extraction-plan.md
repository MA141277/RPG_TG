# Child 23 Main Startup Orchestration Extraction Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `startup / continue / restore / scenario import` orchestration from `src/main.ts` into one explicit coordinator seam while keeping render orchestration and runtime settlement semantics unchanged.

**Architecture:** Child 23 is the first post-Child-22 continuation child. It must move startup-family entry routing and startup-bound bootstrap helper usage out of `src/main.ts`, but it must stop before render orchestration, runtime follow-up ownership, or `MainUiFlow` contract redesign. The new seam should coordinate builtin, imported, and restored startup-family flows through one narrow request/result surface.

**Tech Stack:** TypeScript, `src/main.ts`, startup coordinator module, mod runtime activation, Node test runner (`tests/robustness.test.cjs`), `npm run build:test`, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Completed.`
- Next Step: `No further Child 23 work remains; any later main.ts continuation requires a fresh weekly review.`
- Verification: `2026-07-03: npm run build:test (pass); node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup" (pass); npm run typecheck (pass); npm test (pass); npm run build (pass); npm run lint:plans (pass)`
- Notes: `This child is invalid if it expands into render orchestration, runtime follow-up, MainUiFlow redesign, or a new save-contract family.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created from the approved startup orchestration extraction spec. Child 23 is the only active child in the new weekly set and has not started implementation yet.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Start Task 1 Step 1.`
- 2026-07-03
  - Summary: `Rechecked the narrowed Child 23 baseline. main.ts still directly owns startup-family orchestration through startContinueGameWithLoading(), startRestoredGameWithLoading(), startMainGameWithLoading(), startLoadedScenarioPackWithLoading(), plus restoreModFromSave(), activateSavedModSource(), syncActivatedContentSource(), and applyActivatedModSession(). Added RED ownership regressions proving the dedicated startup coordinator seam does not exist yet and that main.ts still owns the startup-family decision tree.`
  - Verification: `npm run build:test (pass); node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup" (expected fail: child 23 startup coordinator module exists with a narrow request/result seam; child 23 main startup extraction delegates startup-family orchestration to the coordinator)`
  - Next: `Start Task 2 Step 1 by creating the startup-session coordinator module.`
- 2026-07-03
  - Summary: `Implemented src/application/startup/startup-session-coordinator.ts, rewired builtin startup, continue, restore, and scenario import/start entry paths in main.ts to delegate through one coordinator seam, and kept render/session-commit ownership in main.ts. Updated Child 22 continue coverage so the guard follows direct coordinator delegation instead of a specific local helper name.`
  - Verification: `npm run build:test (pass); node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup" (pass); npm run typecheck (pass); npm test (pass); npm run build (pass)`
  - Next: `Run npm run lint:plans and close Child 23 governance.`
- 2026-07-03
  - Summary: `Governance closeout completed. change-log, child plan, weekly plan, and weekly review index now record Child 23 as a closed startup-family extraction, with no queued same-boundary follow-up child.`
  - Verification: `npm run lint:plans (pass)`
  - Next: `Closed.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-main-startup-orchestration-extraction-design.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-startup-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Child 22 already closed startup/save/restore parity, so Child 23 must not reopen source persistence or save-contract redesign.`
  - `The executable debt is that main.ts still directly owns builtin startup, continue, restore, and scenario import/start orchestration.`
  - `The child may reorganize startup-bound active-content sync and session bootstrap helpers, but it must not redesign renderApp(), runtime commit semantics, or MainUiFlow contracts.`

## Implementation Scope

### In Scope

- extracting startup-family entry orchestration out of `src/main.ts`
- one coordinator seam for builtin/imported/restored startup routing
- startup-bound activation request selection
- startup-bound active-content sync and session bootstrap helper consolidation
- targeted regression guards for the new coordinator ownership line

### Still Out Of Scope

- `renderApp()` redesign
- runtime follow-up or settlement redesign
- presenter restructuring
- `MainUiFlow` public contract redesign
- event / scene / task / house runtime boundary changes
- new save envelope families
- opportunistic “thin shell” cleanup outside startup-family ownership

## File Map

### Existing files to modify

- `src/main.ts`
  - Remove direct ownership of startup-family decision trees and consume the new coordinator seam.
- `tests/robustness.test.cjs`
  - Add startup-coordinator ownership regressions and preserve Child 22 parity coverage.
- `docs/change-log.md`
  - Record the Child 23 boundary once implementation closes.
- `docs/superpowers/plans/2026-07-03-child-23-main-startup-orchestration-extraction-plan.md`
  - Record execution progress and closeout.
- `docs/superpowers/plans/2026-07-03-main-startup-weekly-orchestration-plan.md`
  - Sync queue state and weekly closeout when the child finishes.

### New files to create

- `src/application/startup/startup-session-coordinator.ts`
  - Own startup-family request/result orchestration for builtin, imported, and restored entry paths.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Recheck The Startup-Family Ownership Baseline

**Files:**
- Read: `src/main.ts`
- Read: `docs/superpowers/specs/2026-07-03-main-startup-orchestration-extraction-design.md`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-03-child-23-main-startup-orchestration-extraction-plan.md`

- [x] **Step 1: Enumerate the current startup-family entry owners**

Record the exact `main.ts` functions that still own builtin startup, continue, restore, and scenario import/start decision trees.

- [x] **Step 2: Add failing ownership regressions**

Add red tests that prove:

- `main.ts` still directly owns startup-family branching before extraction
- a dedicated startup coordinator module does not yet exist
- Child 22 parity behaviors remain the baseline guardrails

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup"
```

Expected:

- at least one new Child 23 ownership guard fails before implementation

- [x] **Step 4: Record the recheck result in plan state**

Update `Execution State` and `Progress Log` with the narrowed startup-family baseline.

## Task 2: Introduce The Startup Coordinator Seam

**Files:**
- Create: `src/application/startup/startup-session-coordinator.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add the coordinator module and narrow request/result surface**

Create one startup coordinator module that owns builtin/imported/restored startup-family routing and returns a bootstrap result consumable by `main.ts`.

- [x] **Step 2: Re-run the targeted startup-coordinator tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction"
```

Expected:

- the new coordinator seam is detectable and targeted ownership tests pass or move to the next failing point

## Task 3: Rewire `main.ts` To Consume The Coordinator

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Move startup-family entry routing out of `main.ts`**

Rewire builtin startup, continue, restore, and scenario import/start entry points so `main.ts` delegates their orchestration to the coordinator instead of branching directly.

- [x] **Step 2: Keep startup-bound bootstrap helpers aligned without changing render ownership**

Consolidate any remaining startup-bound active-content sync or session bootstrap helpers needed by the coordinator, but stop short of altering `renderApp()` or runtime settlement semantics.

- [x] **Step 3: Re-run the targeted green tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup"
```

Expected:

- Child 23 ownership tests pass
- Child 22 parity tests remain green

- [x] **Step 4: Run the full verification gate**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 4: Close Out Child 23 Governance

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-03-child-23-main-startup-orchestration-extraction-plan.md`
- Modify: `docs/superpowers/plans/2026-07-03-main-startup-weekly-orchestration-plan.md`

- [x] **Step 1: Record the Child 23 boundary outcome**

Document that startup-family orchestration moved out of `main.ts` and that render/follow-up ownership remained outside scope.

- [x] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] `src/main.ts` no longer directly owns the primary orchestration for `startup / continue / restore / scenario import`.
- [x] builtin, imported, and restored startup-family paths converge through one coordinator seam.
- [x] startup-bound active-content sync and session bootstrap usage are no longer scattered across multiple `main.ts` entry functions.
- [x] `renderApp()` main path and runtime commit/settlement semantics remain unchanged.
- [x] Targeted regression coverage passes.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
