# Child 14 Interactive Remaining Legacy Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the remaining covered `activity-qte` and `story-battle` interactive legacy lifecycle paths so they become runtime-owned under `src/core/runtime/interactive-runtime.ts` instead of depending on `legacy-interactive-adapter.ts` and shell-owned cleanup tails in `src/main.ts`.

**Architecture:** Child 14 is the first active executable child in the fresh `2026-07-02` weekly continuation set after the closed Child 13 queue. It must stay narrowly inside the interactive family: classify and test the remaining covered interactive tails first, converge `activity-qte` second, converge `story-battle` third, then reduce adapter/shell residue and synchronize governance closeout fourth. Child 14 must not absorb navigation/time/event/scene convergence or reopen frozen runtime-baseline decisions.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), existing interactive/runtime dispatch seams, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

---

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-02`
- Current Focus: `Child 14 is authored and unlocked as the active executable child in the fresh 2026-07-02 weekly continuation set, but no production implementation batch has started yet.`
- Next Step: `Start Task 1 Step 1 and enumerate the remaining covered activity-qte and story-battle legacy interactive tails before writing red tests.`
- Verification: `Not run`
- Notes: `Child 14 must stay on remaining interactive legacy convergence only. Child 15 Navigation + Time Runtime Convergence and Child 16 Event + Scene Handoff Convergence remain candidate follow-ups outside this plan.`

## Progress Log

- 2026-07-02
  - Summary: `Child 14 formal spec and plan authored, and the fresh 2026-07-02 weekly continuation set now records Child 14 as the active executable child after the closed Child 13 queue.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1.`

---

## Source Documents

- Child 14 spec: `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
- Fresh weekly controller: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Fresh weekly visibility companion: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Child 10 ownerization baseline: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Child 11 implementation spec: `docs/superpowers/specs/2026-07-01-sub-runtime-ownerization-implementation-spec.md`
- Child 13 convergence spec: `docs/superpowers/specs/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-spec.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`

## Parent Alignment

- This file is `Child Plan 14` in the fresh `2026-07-02` weekly continuation set.
- Primary subsystem boundary:
  - `Interaction Runtime`
  - `legacy-interactive-adapter` reduction
  - covered interactive cleanup / follow-up reduction in `src/main.ts`
- Secondary subsystem relationships:
  - consumes the finalized Child 10 ownerization baseline
  - must not reopen Child 11 / Child 13 accepted conclusions
  - must leave navigation/time and event/scene continuation for later children
- Queue rule:
  - Child 14 is the active executable child in the new weekly set.
  - Any later child still requires its own spec/plan authoring and explicit queue promotion before implementation starts.

## Scope

This child plan includes:

- audit of the remaining covered `activity-qte` and `story-battle` legacy interactive tails
- targeted red-to-green regression coverage for those tails
- `activity-qte` runtime ownerization
- `story-battle` runtime ownerization
- `legacy-interactive-adapter.ts` reduction for the covered paths
- covered `src/main.ts` cleanup / follow-up reduction
- required weekly/governance closeout sync

This child plan does not include:

- navigation/time convergence
- event/scene handoff convergence
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign
- new runtime contract families
- general story-system redesign

## File Map

### Existing Files To Modify

- `src/core/runtime/interactive-runtime.ts`
  - Move the remaining covered interactive lifecycle ownership under the runtime owner line.
- `src/core/adapters/legacy-interactive-adapter.ts`
  - Reduce covered lifecycle ownership to compatibility-only residue, if any remains.
- `src/main.ts`
  - Remove covered shell-owned interactive cleanup / follow-up branches.
- `tests/robustness.test.cjs`
  - Add red-to-green regression coverage for the remaining covered interactive tails.
- `docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md`
  - Record execution state, progress, and closeout.
- `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
  - Sync Child 14 execution state and queue truth.
- `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
  - Sync artifact-bundle expectations for Child 14.
- `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
  - Record Child 14 verification and queue state.
- `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
  - Record the remaining interactive adapter/runtime ownership state.
- `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
  - Record the relevant interactive runtime flow after convergence.
- `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
  - Keep Child 15 / Child 16 in candidate-only status after Child 14 starts or closes.
- `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
  - Keep the runtime maturity and queue state synchronized.
- `docs/change-log.md`
  - Record the Child 14 landing once implementation completes.

### Existing Files To Read

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/house-runtime.ts`
- `src/application/minigames/city-begging-minigame.ts`
- `src/application/story-battle/story-battle-runtime.ts`

## Required Verification Gate

Every production batch in this plan must record:

- targeted `node --test tests/robustness.test.cjs --test-name-pattern "...activity-qte...|...story-battle...|...interactive..."`
- `npm run typecheck`
- `npm test`
- `npm run build`

Queue/governance sync batches must also record:

- `npm run lint:plans`

## Bug And Blocker Gate

- `P0`
  - broken covered interactive path, no valid replacement for removed adapter-owned lifecycle control, or build/type/test failure
  - Rule: stop implementation and reconcile code plus queue docs before proceeding.
- `P1`
  - boundary drift into navigation/time/event/scene, or reopening frozen Child 10/11/13 decisions without governance revision
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - optional naming cleanup or extra adapter thinning outside the covered lifecycle seam
  - Rule: may be deferred only if recorded in `Progress Log`.

## Task 1: Audit Remaining Covered Interactive Legacy Tails

**Files:**
- Read: `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
- Read: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Read: `docs/superpowers/specs/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-spec.md`
- Read: `src/core/runtime/interactive-runtime.ts`
- Read: `src/core/adapters/legacy-interactive-adapter.ts`
- Read: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Enumerate the remaining covered interactive lifecycle tails**

Record the exact `activity-qte` and `story-battle` launch / action / exit / completion tails that are still adapter-owned or shell-owned today.

- [ ] **Step 2: Add failing regression tests for the remaining covered tails**

Write red tests that prove the covered `activity-qte` and `story-battle` lifecycle tails are not yet fully runtime-owned.

- [ ] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "activity-qte|story-battle|interactive"
```

Expected:

- at least one named remaining covered tail fails before implementation

- [ ] **Step 4: Record the audit result in the plan state**

Update this plan's `Execution State` and `Progress Log` with the enumerated remaining paths before moving into implementation.

## Task 2: Converge Covered `activity-qte` Lifecycle Ownership

**Files:**
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/adapters/legacy-interactive-adapter.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum `activity-qte` runtime convergence**

Move the covered `activity-qte` launch / action / exit / completion lifecycle under `interactive-runtime.ts` and reduce adapter ownership for that path.

- [ ] **Step 2: Re-run the targeted `activity-qte` tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "activity-qte|interactive"
```

Expected:

- the covered `activity-qte` ownership tests pass

- [ ] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening unrelated runtime-family failures

## Task 3: Converge Covered `story-battle` Lifecycle Ownership

**Files:**
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/adapters/legacy-interactive-adapter.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum `story-battle` runtime convergence**

Move the covered `story-battle` launch / action / exit / completion lifecycle under `interactive-runtime.ts` and reduce adapter ownership for that path.

- [ ] **Step 2: Re-run the targeted `story-battle` tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "story-battle|interactive"
```

Expected:

- the covered `story-battle` ownership tests pass

- [ ] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass with no regression to already accepted Child 11 / Child 13 paths

## Task 4: Reduce Residual Adapter / Shell Ownership And Close Out Child 14

**Files:**
- Modify: `src/core/adapters/legacy-interactive-adapter.ts`
- Modify: `src/main.ts`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`

- [ ] **Step 1: Reduce the retained covered adapter/shell residue**

Ensure the covered paths are no longer lifecycle-owned by `legacy-interactive-adapter.ts` or shell-owned cleanup in `src/main.ts`.

- [ ] **Step 2: Record Child 14 implementation outcome**

Update `Execution State`, `Progress Log`, retained residue notes, and completion wording only after production verification passes.

- [ ] **Step 3: Run the queue/governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- plan-governance checks pass
- weekly/governance wording stays structurally valid

- [ ] **Step 4: Sync Child 14 exit truth into weekly docs**

Record that:

- covered `activity-qte` lifecycle is runtime-owned
- covered `story-battle` lifecycle is runtime-owned
- retained `legacy-interactive-adapter.ts` code is compatibility-only if any remains
- Child 15 remains the highest-priority candidate follow-up and Child 16 remains later candidate work

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
