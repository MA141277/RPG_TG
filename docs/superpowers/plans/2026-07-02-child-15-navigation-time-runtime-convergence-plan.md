# Child 15 Navigation + Time Runtime Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce direct `src/main.ts` orchestration around covered navigation and time progression entry paths so they converge on clearer runtime-owned control under `navigation-runtime.ts` and `time-runtime.ts`.

**Architecture:** Child 15 is a formal queued follow-up child in the fresh `2026-07-02` weekly continuation set. It must not start while Child 14 remains active. Once promoted later, it must stay on one progression-layer problem type only: audit covered navigation/time mixed entry paths first, converge navigation second, converge time third, then reduce retained shell residue and close out fourth. Child 15 must not absorb interactive legacy cleanup or event/scene handoff redesign.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), current navigation/time runtime seams, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

---

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-02`
- Current Focus: `Child 15 is authored as the immediate queued follow-up behind Child 14 in the fresh 2026-07-02 weekly continuation set, but it is not executable yet.`
- Next Step: `Do not start Child 15 while Child 14 remains open. Wait for Child 14 completion, closeout sync, and explicit weekly promotion before starting Task 1 Step 1.`
- Verification: `Not run`
- Notes: `Child 15 is queued only. Child 14 remains the sole active executable child, and Child 16 remains the locked later follow-up child.`

## Progress Log

- 2026-07-02
  - Summary: `Child 15 formal spec and plan authored. The fresh 2026-07-02 weekly continuation set now records Child 15 as the immediate queued follow-up behind Child 14, but Child 15 remains not-started and not executable.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for Child 14 closeout and explicit queue promotion before starting Task 1 Step 1.`

---

## Source Documents

- Child 15 spec: `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
- Fresh weekly controller: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Fresh weekly visibility companion: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Child 14 spec: `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
- Child 10 ownerization baseline: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`

## Parent Alignment

- This file is `Child Plan 15` in the fresh `2026-07-02` weekly continuation set.
- Primary subsystem boundary:
  - `Navigation Runtime`
  - `Time Runtime`
  - covered progression-layer shell reduction in `src/main.ts`
- Secondary subsystem relationships:
  - must wait for Child 14 to complete
  - must not absorb event/scene handoff convergence
  - keeps Child 16 as the later locked follow-up
- Queue rule:
  - Child 15 is the immediate queued follow-up, not an active executable child.
  - Child 15 may start only after explicit weekly promotion.

## Scope

This child plan includes:

- audit of the remaining covered navigation/time mixed entry paths
- targeted red-to-green regression coverage for those paths
- covered navigation entry convergence
- covered time entry convergence
- covered shell-owned progression residue reduction
- required weekly/governance closeout sync

This child plan does not include:

- interactive legacy cleanup
- event/scene handoff convergence
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign
- new runtime contract families
- broader story-flow redesign

## File Map

### Existing Files To Modify

- `src/core/runtime/navigation-runtime.ts`
  - Converge covered navigation entry ownership under the runtime owner line.
- `src/core/runtime/time-runtime.ts`
  - Converge covered time entry ownership under the runtime owner line.
- `src/main.ts`
  - Remove covered shell-owned navigation/time orchestration branches.
- `tests/robustness.test.cjs`
  - Add red-to-green regression coverage for the covered navigation/time mixed entry paths.
- `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
  - Record execution state, progress, and closeout.
- `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
  - Sync Child 15 queued/promoted state and queue truth.
- `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
  - Sync artifact-bundle expectations for Child 15 once it becomes active later.
- `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
  - Record Child 15 queue state and later verification summary.
- `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
  - Keep Child 15 as queued and Child 16 as locked until later promotion.
- `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
  - Keep the runtime maturity and queue state synchronized.
- `docs/change-log.md`
  - Record the Child 15 landing once implementation completes.

### Existing Files To Read

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/scene-runtime.ts`

## Required Verification Gate

Every production batch in this plan must record:

- targeted `node --test tests/robustness.test.cjs --test-name-pattern "...navigation...|...time...|...progression..."`
- `npm run typecheck`
- `npm test`
- `npm run build`

Queue/governance sync batches must also record:

- `npm run lint:plans`

## Bug And Blocker Gate

- `P0`
  - broken covered navigation/time path, no valid replacement for removed shell-owned orchestration, or build/type/test failure
  - Rule: stop implementation and reconcile code plus queue docs before proceeding.
- `P1`
  - boundary drift into interactive legacy cleanup or event/scene convergence, or Child 15 starting before Child 14 closes
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - optional naming cleanup or extra shell thinning outside the covered progression seam
  - Rule: may be deferred only if recorded in `Progress Log`.

## Task 1: Audit Remaining Covered Navigation/Time Mixed Entry Paths

**Files:**
- Read: `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
- Read: `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
- Read: `src/core/runtime/navigation-runtime.ts`
- Read: `src/core/runtime/time-runtime.ts`
- Read: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Enumerate the remaining covered navigation/time mixed entry paths**

Record the exact covered navigation and time progression paths that remain shell-owned today.

- [ ] **Step 2: Add failing regression tests for the remaining covered paths**

Write red tests that prove those covered navigation/time entry paths are not yet fully runtime-owned.

- [ ] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "navigation|time|progression"
```

Expected:

- at least one named remaining covered path fails before implementation

- [ ] **Step 4: Record the audit result in the plan state**

Update this plan's `Execution State` and `Progress Log` with the enumerated remaining paths before implementation starts.

## Task 2: Converge Covered Navigation Entry Ownership

**Files:**
- Modify: `src/core/runtime/navigation-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum covered navigation convergence**

Move the covered navigation entry orchestration under `navigation-runtime.ts` and reduce shell ownership for that path.

- [ ] **Step 2: Re-run the targeted navigation tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "navigation|progression"
```

Expected:

- the covered navigation ownership tests pass

- [ ] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening unrelated runtime-family failures

## Task 3: Converge Covered Time Entry Ownership

**Files:**
- Modify: `src/core/runtime/time-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum covered time convergence**

Move the covered time entry orchestration under `time-runtime.ts` and reduce shell ownership for that path.

- [ ] **Step 2: Re-run the targeted time tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "time|progression"
```

Expected:

- the covered time ownership tests pass

- [ ] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass with no regression to already accepted runtime slices

## Task 4: Reduce Residual Shell Ownership And Close Out Child 15

**Files:**
- Modify: `src/main.ts`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`

- [ ] **Step 1: Reduce the retained covered shell residue**

Ensure the covered navigation/time paths are no longer shell-owned on the converged line.

- [ ] **Step 2: Record Child 15 implementation outcome**

Update `Execution State`, `Progress Log`, retained residue notes, and completion wording only after production verification passes.

- [ ] **Step 3: Run the queue/governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- plan-governance checks pass
- weekly/governance wording stays structurally valid

- [ ] **Step 4: Sync Child 15 exit truth into weekly docs**

Record that:

- covered navigation entry is runtime-owned
- covered time entry is runtime-owned
- Child 16 becomes the next highest-priority continuation child if still justified

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
