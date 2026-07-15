# Child 28 Active Content Ownership Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move active content ownership out of `src/main.ts` so shell and presenter consume already-activated content context.

**Architecture:** Child 28 converges active content ownership only after earlier startup/bootstrap work stabilizes. The migration must avoid creating dual registries or moving ownership from `main.ts` into an undocumented singleton.

**Tech Stack:** TypeScript, startup/mod activation pipeline, content composition modules, `npm run typecheck`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Child 28 is closed. Active content composition now flows through an explicit contentContext seam instead of shell-owned mirror synchronization in main.ts.`
- Next Step: `Do not promote Child 29 in this batch; wait for a later explicit continuation request and baseline recheck.`
- Verification: `Passed: npm run typecheck; npm run build; npm run lint:plans; npm test -- --test-name-pattern="child 22|child 23|child 24|child 25|child 26|child 27|child 28".`
- Notes: `No in-scope P0/P1 remains. Child 28 stayed narrow: startup-session-coordinator emits contentContext, main-runtime-orchestrator applies it before createAppState(), and main.ts now consumes activeContentContext without reintroducing a second registry or broadening Child 29 scope.`

## Progress Log

- 2026-07-03
  - Summary: `Plan scaffold created from the continuation spec.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Revisit in a later weekly review after Child 27 or equivalent startup stabilization.`
- 2026-07-03
  - Summary: `Baseline recheck completed after Child 27 closure and explicit continuation request. Scope remains unchanged: main.ts still owns syncActiveGameContent(), the active-definition top-level write set, and the activated-content-source write-back path used during startup session application.`
  - Verification: `Baseline inspection only; required commands not run yet.`
  - Next: `Start Task 1 Step 2 by adding failing active-content ownership regressions.`
- 2026-07-03
  - Summary: `Added Child 28 regressions first. RED confirmed the current gap: startup-session-coordinator does not yet emit contentContext, main-runtime-orchestrator still applies syncActivatedContentSource(request.session.activationResult), and main.ts still carries the central active-content mirror write set.`
  - Verification: `npm test -- --test-name-pattern="child 23|child 27|child 28"` (expected Child 28 failures).
  - Next: `Start Task 2 Step 1 by introducing an explicit startup/mod-owned content context seam.`
- 2026-07-03
  - Summary: `Moved active content ownership behind an explicit contentContext seam. startup-session-coordinator now emits contentContext, main-runtime-orchestrator applies session contentContext before createAppState(), and main.ts now consumes activeContentContext instead of synchronizing a shell-owned mirror write set.`
  - Verification: `npm test -- --test-name-pattern="child 23|child 27|child 28"`.
  - Next: `Run typecheck/build/lint plus the broader child regression subset, then close Child 28 if no P0/P1 remains.`
- 2026-07-03
  - Summary: `Completed Child 28 closeout. Full verification passed, no in-scope P0/P1 remained, and the weekly queue was synced without promoting Child 29 in the same batch.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 22|child 23|child 24|child 25|child 26|child 27|child 28"`.
  - Next: `Wait for a later explicit continuation request before baseline-rechecking Child 29.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-28-active-content-ownership-convergence-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `main.ts still centrally synchronizes active content definitions through syncActiveGameContent() and the corresponding top-level active definition variables.`
  - `main-runtime-orchestrator still depends on a syncActivatedContentSource() callback, but the actual content write-back remains shell-owned in main.ts.`
  - `Startup/bootstrap ownership is now stabilized after Child 27 closure, so Child 28 may execute without promoting Child 29.`

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

- [x] **Step 1: Record the active-content synchronization still owned by `main.ts`**

Document the central write points and the output shape they currently maintain.

- [x] **Step 2: Add or update active-content ownership regressions**

Capture the boundary that shell should consume content context rather than own it.

- [x] **Step 3: Update plan state with the baseline result**

Record the verified baseline in `Execution State` and `Progress Log`.

## Task 2: Move Active Content Ownership Into Composition Layer

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `src/core/mods/mod-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Introduce or reuse an explicit content composition owner**

Keep builtin and mod activation aligned to the same output shape.

- [x] **Step 2: Remove central active-content ownership from shell**

`src/main.ts` should consume content context rather than writing active definitions directly.

- [x] **Step 3: Re-run the active-content regressions**

Confirm builtin and mod content activation remain correct.

## Task 3: Verify And Close

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-child-28-active-content-ownership-convergence-plan.md`
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

Record whether Child 29 remains candidate-only or is promotable in a later cycle.

## Exit Check

- [x] `src/main.ts` no longer centrally owns active content synchronization.
- [x] Active content owner is explicit and documented.
- [x] Builtin and mod content activation converge on one output shape.
- [x] Weekly artifact sync is updated if boundary state changed.
- [x] Weekly queue state is updated.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
