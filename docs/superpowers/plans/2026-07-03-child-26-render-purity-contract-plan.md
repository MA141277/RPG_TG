# Child 26 Render Purity Contract Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove gameplay mutation from the render path so `src/main.ts` render flow consumes settled state only.

**Architecture:** Child 26 purifies render after navigation/time follow-up ownership has stabilized. Passive trigger timing must move to an explicit non-render owner while presenter and render remain shell-facing display logic.

**Tech Stack:** TypeScript, `src/main.ts`, `src/application/runtime/main-runtime-orchestrator.ts`, `tests/robustness.test.cjs`, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 26 is closed. Render is now display-only for passive indoor follow-up, and explicit settlement owners cover house entry / house re-settlement and story-scene settlement.`
- Next Step: `Wait for a later explicit continuation request before baseline-rechecking Child 27.`
- Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 16|child 23|child 24|child 25|child 26"`.`
- Notes: `No unresolved P0/P1 remained in Child 26 scope at close. Render-frame city NPC pool normalization remains outside this child's narrow passive-trigger contract.`

## Progress Log

- 2026-07-03
  - Summary: `Plan scaffold created from the continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Promote after Child 25 if scope remains unchanged.`
- 2026-07-03
  - Summary: `Baseline recheck completed after Child 25 closure. Scope is narrowed rather than superseded: render still owns passive indoor-screen passive trigger execution through main.ts, while adjacent render-frame city NPC pool normalization remains outside this child's narrow contract.`
  - Verification: `Baseline inspection only; required commands not run yet.`
  - Next: `Start Task 1 Step 2 by adding failing render-purity regressions for passive trigger ownership.`
- 2026-07-03
  - Summary: `Added Child 26 render-purity regressions first, then moved passive indoor-screen follow-up behind a dedicated narrow helper shared by house-runtime and post-scene settlement. renderApp() no longer executes passive story mutation directly.`
  - Verification: `npm test -- --test-name-pattern="child 16|child 23|child 24|child 25|child 26"`; `npm run typecheck`; `npm run build`; `npm run lint:plans`.
  - Next: `Close Child 26 and record Child 27 as the next queued follow-up without promoting it.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-26-render-purity-contract-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Render purity remains a distinct shell-boundary issue after Child 25.`
  - `The active in-scope debt is render-owned passive indoor-screen trigger execution in main.ts -> main-runtime-orchestrator.`
  - `Render-frame city NPC pool normalization still mutates state, but it is not promoted into this child because the approved contract is narrowly about passive trigger ownerization.`

## Implementation Scope

### In Scope

- remove render-path gameplay mutation
- relocate passive trigger timing to explicit non-render ownership
- preserve presenter/render semantics while purifying render

### Still Out Of Scope

- startup bootstrap migration
- active content ownership migration
- legacy startup seam retirement
- broad presenter redesign

## File Map

### Existing files to modify

- `src/main.ts`
  - remove render-path gameplay mutation
- `src/application/runtime/main-runtime-orchestrator.ts`
  - only if needed as a narrow migration owner for passive trigger timing
- `src/core/runtime/scene-runtime.ts`
  - if passive trigger settlement contract belongs here
- `tests/robustness.test.cjs`
  - add or update render-purity ownership regressions
- `docs/superpowers/plans/2026-07-03-child-26-render-purity-contract-plan.md`
  - record progress and verification

### Existing files expected to be deleted

- `None expected unless a render-only shell helper becomes dead code.`

### New files to create

- `Only if a narrow passive-trigger contract file is required.`

## Verification Plan

- Targeted verification:
  - `render path no longer mutates gameplay state`
  - `passive trigger timing still occurs at the correct moment`
- Required commands:
  - `npm run typecheck`
  - `npm run build`

## Task 1: Recheck Render-Path Mutation Baseline

**Files:**
- Read: `src/main.ts`
- Read: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-03-child-26-render-purity-contract-plan.md`

- [x] **Step 1: Confirm the remaining render-path mutation points**

Record where gameplay mutation still occurs in or immediately before render.

- [x] **Step 2: Add or update targeted render-purity regressions**

Capture the boundary that render must consume settled state only.

- [x] **Step 3: Update plan state with the baseline result**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Move Passive Trigger Ownership Out Of Render

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Introduce or reuse an explicit non-render owner for passive trigger timing**

Do not relocate mutation into presenter or another shell-adjacent helper.

- [x] **Step 2: Remove the corresponding render-path mutation**

`renderApp()` and adjacent shell render helpers should remain display-only.

- [x] **Step 3: Re-run the render-purity regressions**

Confirm passive triggers still occur correctly without render-owned mutation.

## Task 3: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-26-render-purity-contract-plan.md`
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

Record whether Child 27 becomes the next promotable child.

## Exit Check

- [x] Render-path gameplay mutation is removed for this child scope.
- [x] Passive trigger owner is explicit.
- [x] Presenter consumes settled state only.
- [x] Weekly artifact sync is updated if boundary state changed.
- [x] Weekly queue state is updated.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
