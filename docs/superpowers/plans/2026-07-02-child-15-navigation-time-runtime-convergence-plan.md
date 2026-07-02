# Child 15 Navigation + Time Runtime Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the remaining covered `navigation.enter-city`, `time.day-start`, and `time.advance-segments` mixed entry paths so they become runtime-owned under `src/core/runtime/navigation-runtime.ts` and `src/core/runtime/time-runtime.ts`, with `src/main.ts` retaining only shell-facing input/output and bounded post-entry follow-up duties.

**Architecture:** Child 15 is the new active executable child in the fresh `2026-07-02` weekly continuation set after accepted Child 14 closeout. The baseline recheck narrows this child to the concrete covered progression entries still visible in production today: the navigation side is limited to the covered `enter-city` path, and the time side is limited to the covered `day-start` plus campaign-move `advance-segments` paths together with the minimum council-priority follow-up reduction required for those entries. Child 15 must not reopen the interactive family and must not absorb event activation or scene handoff redesign.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), existing navigation/time runtime seams, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-02`
- Current Focus: `Child 15 is now promoted from queued to active after a narrowed baseline recheck. No production batch has started yet.`
- Next Step: `Start Task 1 Step 1 and enumerate the remaining covered enter-city/day-start/advance-segments mixed entry tails before writing red tests.`
- Verification: `Not run as part of this promotion/plan-authoring batch`
- Notes: `This plan is authored against the post-Child-14 baseline. Child 16 remains outside this active plan and must not be absorbed.`

## Progress Log

- 2026-07-02
  - Summary: `Child 15 baseline recheck completed after Child 14 closeout and the result is narrowed rather than unchanged. The active executable scope is now limited to the concrete covered navigation/time mixed-entry paths still present in src/main.ts: enter-city navigation, day-start progression, and campaign-move advance-segments progression. Child 15 is promoted to active and this executable plan is authored against that narrowed baseline.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The covered navigation target is now the concrete enter-city line in src/main.ts. Covered house entry is already handled outside this child's boundary and should not be pulled back into Child 15.`
  - `The covered time target is now the concrete day-start and campaign-move advance-segments entry lines together with the minimum council-priority follow-up reduction those paths still require.`
  - `The city-enter story trigger handoff remains outside this child except where Child 15 must reduce shell-side stitching enough to keep navigation/time entry ownership reviewable.`

## Implementation Scope

### In Scope

- audit of the remaining covered `enter-city`, `day-start`, and `advance-segments` mixed entry tails
- targeted red-to-green regression coverage for those covered progression paths
- covered `enter-city` navigation entry convergence
- covered `day-start` and `advance-segments` time entry convergence
- minimum shared progression follow-up reduction needed for the covered navigation/time paths
- required weekly/governance closeout sync

### Still Out Of Scope

- interactive legacy cleanup
- house runtime redesign
- event activation redesign
- scene handoff redesign
- new runtime contract families
- broader settlement redesign
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign
- story-system redesign

## File Map

### Existing files to modify

- `src/core/runtime/navigation-runtime.ts`
  - Converge the covered `enter-city` production entry on a clearer runtime-owned line.
- `src/core/runtime/time-runtime.ts`
  - Converge the covered `day-start` and `advance-segments` production entries on a clearer runtime-owned line.
- `src/main.ts`
  - Reduce the remaining shell-owned navigation/time orchestration for the covered paths.
- `tests/robustness.test.cjs`
  - Add red-to-green regression coverage for the narrowed Child 15 ownership boundary.
- `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
  - Record execution state, progress, and closeout.
- `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
  - Sync Child 15 promotion state and queue truth.
- `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
  - Keep the visibility companion aligned once Child 15 work starts or closes.
- `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
  - Record Child 15 promotion, verification, and queue state.
- `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
  - Record the narrowed navigation/time owner targets.
- `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
  - Record the current pre-Child-15 navigation/time baseline and later converged flow.
- `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
  - Keep Child 16 in queued follow-up status while Child 15 is active.
- `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
  - Keep runtime maturity and queue state synchronized.
- `docs/change-log.md`
  - Record the Child 15 landing once implementation completes.

### Existing files to read

- `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/scene-runtime.ts`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "child 15|navigation runtime|time runtime|progression"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit Narrowed Navigation/Time Mixed Entry Tails

**Files:**
- Read: `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
- Read: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Read: `src/core/runtime/navigation-runtime.ts`
- Read: `src/core/runtime/time-runtime.ts`
- Read: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Enumerate the remaining covered navigation/time mixed entry tails**

Record the exact covered `enter-city`, `day-start`, and `advance-segments` production tails that still depend on direct shell-owned orchestration in `src/main.ts`.

- [ ] **Step 2: Add failing regression tests for the narrowed Child 15 boundary**

Write red tests that prove the covered navigation/time entry paths are not yet fully runtime-owned.

- [ ] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "child 15|navigation runtime|time runtime|progression"
```

Expected:

- at least one named covered navigation/time ownership tail fails before implementation

- [ ] **Step 4: Record the audit result in the plan state**

Update this plan's `Execution State` and `Progress Log` with the enumerated remaining paths before moving into implementation.

## Task 2: Converge Covered `enter-city` Navigation Entry Ownership

**Files:**
- Modify: `src/core/runtime/navigation-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum covered `enter-city` navigation convergence**

Move the covered `enter-city` production entry onto a clearer runtime-owned line and reduce the direct shell-owned navigation orchestration in `src/main.ts`.

- [ ] **Step 2: Re-run the targeted navigation tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "child 15|navigation runtime|enter-city|progression"
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

## Task 3: Converge Covered `day-start` And `advance-segments` Time Entry Ownership

**Files:**
- Modify: `src/core/runtime/time-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum covered time-entry convergence**

Move the covered `day-start` and `advance-segments` production entries onto a clearer runtime-owned line and reduce the direct shell-owned time orchestration in `src/main.ts`.

- [ ] **Step 2: Re-run the targeted time tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "child 15|time runtime|day-start|advance-segments|progression"
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

- all commands pass without reopening unrelated runtime-family failures

## Task 4: Reduce Shell Progression Residue And Close Out Governance

**Files:**
- Modify: `src/main.ts`
- Modify: `docs/superpowers/plans/2026-07-02-child-15-navigation-time-runtime-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
- Modify: `docs/change-log.md`

- [ ] **Step 1: Reduce retained shell-only progression residue for the covered paths**

Keep only shell-facing input/output duties in `src/main.ts` for the covered Child 15 paths and explicitly record any bounded residue that must remain outside Child 15.

- [ ] **Step 2: Update weekly artifacts and queue truth**

Record Child 15 outcome, verification state, and the current Child 16 queue status across the `2026-07-02` artifact bundle.

- [ ] **Step 3: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [ ] covered `enter-city` navigation entry ownership is runtime-owned
- [ ] covered `day-start` time entry ownership is runtime-owned
- [ ] covered `advance-segments` time entry ownership is runtime-owned
- [ ] `src/main.ts` keeps only shell-facing duties on the covered Child 15 paths
- [ ] Child 15 does not reopen interactive scope
- [ ] Child 15 does not absorb event/scene handoff convergence
- [ ] targeted regression coverage passes
- [ ] weekly artifacts are updated
- [ ] weekly queue state is updated

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
