# Child 26 Render Purity Contract Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove gameplay mutation from the render path so `src/main.ts` render flow consumes settled state only.

**Architecture:** Child 26 purifies render after navigation/time follow-up ownership has stabilized. Passive trigger timing must move to an explicit non-render owner while presenter and render remain shell-facing display logic.

**Tech Stack:** TypeScript, `src/main.ts`, `src/application/runtime/main-runtime-orchestrator.ts`, `tests/robustness.test.cjs`, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Queued follow-up; not yet promoted.`
- Next Step: `Wait for Child 25 completion and baseline recheck before promotion.`
- Verification: `Not run`
- Notes: `This child is non-executable until promoted by the continuation weekly set.`

## Progress Log

- 2026-07-03
  - Summary: `Plan scaffold created from the continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Promote after Child 25 if scope remains unchanged.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-26-render-purity-contract-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Render purity remains a distinct shell-boundary issue after Child 24.`
  - `This child should not be promoted until Child 25 stabilizes post-settlement follow-up timing.`

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

- [ ] **Step 1: Confirm the remaining render-path mutation points**

Record where gameplay mutation still occurs in or immediately before render.

- [ ] **Step 2: Add or update targeted render-purity regressions**

Capture the boundary that render must consume settled state only.

- [ ] **Step 3: Update plan state with the baseline result**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Move Passive Trigger Ownership Out Of Render

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Introduce or reuse an explicit non-render owner for passive trigger timing**

Do not relocate mutation into presenter or another shell-adjacent helper.

- [ ] **Step 2: Remove the corresponding render-path mutation**

`renderApp()` and adjacent shell render helpers should remain display-only.

- [ ] **Step 3: Re-run the render-purity regressions**

Confirm passive triggers still occur correctly without render-owned mutation.

## Task 3: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-26-render-purity-contract-plan.md`
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

Record whether Child 27 becomes the next promotable child.

## Exit Check

- [ ] Render-path gameplay mutation is removed for this child scope.
- [ ] Passive trigger owner is explicit.
- [ ] Presenter consumes settled state only.
- [ ] Weekly artifact sync is updated if boundary state changed.
- [ ] Weekly queue state is updated.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
