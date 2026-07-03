# Child 28 Active Content Ownership Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move active content ownership out of `src/main.ts` so shell and presenter consume already-activated content context.

**Architecture:** Child 28 converges active content ownership only after earlier startup/bootstrap work stabilizes. The migration must avoid creating dual registries or moving ownership from `main.ts` into an undocumented singleton.

**Tech Stack:** TypeScript, startup/mod activation pipeline, content composition modules, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Candidate later work; not yet queued for execution.`
- Next Step: `Do not promote until earlier continuation children close and a fresh baseline recheck is recorded.`
- Verification: `Not run`
- Notes: `This child remains candidate-only under the current queue depth rule.`

## Progress Log

- 2026-07-03
  - Summary: `Plan scaffold created from the continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Revisit in a later weekly review after Child 27 or equivalent startup stabilization.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-28-active-content-ownership-convergence-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `main.ts still centrally synchronizes active content definitions.`
  - `This work should remain candidate-only until startup/bootstrap ownership has stabilized.`

## Implementation Scope

### In Scope

- move active content synchronization out of `main.ts`
- converge builtin and mod content activation output shape
- establish shell-consumed content context ownership

### Still Out Of Scope

- manifest-family redesign
- legacy startup seam retirement
- content authoring redesign

## File Map

### Existing files to modify

- `src/main.ts`
  - remove central active-content synchronization ownership
- `src/application/content/active-game-content.ts`
  - likely source of content snapshot/context creation
- `src/application/startup/startup-session-coordinator.ts`
  - if startup must surface content context
- `src/core/mods/mod-runtime.ts`
  - if mod activation must own content output shape
- `tests/robustness.test.cjs`
  - add or update active-content ownership regressions
- `docs/superpowers/plans/2026-07-03-child-28-active-content-ownership-convergence-plan.md`
  - record progress and verification

### Existing files expected to be deleted

- `None expected unless shell-owned content sync helpers become dead code.`

### New files to create

- `Only if a narrow content-context contract file is required.`

## Verification Plan

- Targeted verification:
  - `builtin content activation still resolves correct active content`
  - `scenario/mod content activation still resolves correct active content`
  - `shell consumption no longer depends on central active-definition writes`
- Required commands:
  - `npm run typecheck`
  - `npm run build`

## Task 1: Recheck Active Content Ownership Baseline

**Files:**
- Read: `src/main.ts`
- Read: `src/application/content/active-game-content.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-03-child-28-active-content-ownership-convergence-plan.md`

- [ ] **Step 1: Record the active-content synchronization still owned by `main.ts`**

Document the central write points and the output shape they currently maintain.

- [ ] **Step 2: Add or update active-content ownership regressions**

Capture the boundary that shell should consume content context rather than own it.

- [ ] **Step 3: Update plan state with the baseline result**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Move Active Content Ownership Into Composition Layer

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Introduce or reuse an explicit content composition owner**

Keep builtin and mod activation aligned to the same output shape.

- [ ] **Step 2: Remove central active-content ownership from shell**

`src/main.ts` should consume content context rather than writing active definitions directly.

- [ ] **Step 3: Re-run the active-content regressions**

Confirm builtin and mod content activation remain correct.

## Task 3: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-28-active-content-ownership-convergence-plan.md`
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

Record whether Child 29 remains candidate-only or is promotable in a later cycle.

## Exit Check

- [ ] `src/main.ts` no longer centrally owns active content synchronization.
- [ ] Active content owner is explicit and documented.
- [ ] Builtin and mod content activation converge on one output shape.
- [ ] Weekly artifact sync is updated if boundary state changed.
- [ ] Weekly queue state is updated.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
