# Child 16 Event + Scene Handoff Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the remaining covered event activation and event-to-scene handoff paths so they become runtime-owned under `event-runtime.ts` and `scene-runtime.ts` instead of depending on shell-owned stitching in `src/main.ts`.

**Architecture:** Child 16 is a formal locked later follow-up child in the fresh `2026-07-02` weekly continuation set. It must not start while Child 14 or Child 15 remains incomplete. Once promoted later, it must stay on one story-handoff problem type only: audit covered event/scene mixed handoff paths first, converge event activation second, converge scene handoff third, then reduce retained shell residue and close out fourth. Child 16 must not absorb navigation/time convergence or broader story-system redesign.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), current event/scene runtime seams, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

---

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-02`
- Current Focus: `Child 16 is authored as the locked later follow-up behind Child 15 in the fresh 2026-07-02 weekly continuation set, but it is not executable yet.`
- Next Step: `Do not start Child 16 while Child 14 or Child 15 remains open. Wait for Child 15 completion, closeout sync, and explicit weekly promotion before starting Task 1 Step 1.`
- Verification: `Not run`
- Notes: `Child 16 is locked only. Child 14 remains the sole active executable child, Child 15 remains the immediate queued follow-up, and Child 16 must not be promoted early.`

## Progress Log

- 2026-07-02
  - Summary: `Child 16 formal spec and plan authored. The fresh 2026-07-02 weekly continuation set now records Child 16 as the locked later follow-up behind Child 15, but Child 16 remains not-started and not executable.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for Child 15 closeout and explicit queue promotion before starting Task 1 Step 1.`

---

## Source Documents

- Child 16 spec: `docs/superpowers/specs/2026-07-02-child-16-event-scene-handoff-convergence-spec.md`
- Fresh weekly controller: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Fresh weekly visibility companion: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Child 15 spec: `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
- Child 10 ownerization baseline: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`

## Parent Alignment

- This file is `Child Plan 16` in the fresh `2026-07-02` weekly continuation set.
- Primary subsystem boundary:
  - `Event Runtime`
  - `Scene Runtime`
  - covered story handoff shell reduction in `src/main.ts`
- Secondary subsystem relationships:
  - must wait for Child 14 and Child 15 to complete
  - must not absorb navigation/time convergence
  - is the locked later follow-up until later promotion
- Queue rule:
  - Child 16 is the locked later follow-up, not an active executable child and not an immediate queued follow-up.
  - Child 16 may start only after explicit weekly promotion.

## Scope

This child plan includes:

- audit of the remaining covered event/scene mixed handoff paths
- targeted red-to-green regression coverage for those paths
- covered event activation ownership convergence
- covered event -> scene handoff convergence
- covered shell-owned story handoff residue reduction
- required weekly/governance closeout sync

This child plan does not include:

- interactive legacy cleanup
- navigation/time convergence
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign
- new runtime contract families
- broader story-system redesign

## File Map

### Existing Files To Modify

- `src/core/runtime/event-runtime.ts`
  - Converge covered event activation ownership under the runtime owner line.
- `src/core/runtime/scene-runtime.ts`
  - Converge covered scene handoff ownership under the runtime owner line.
- `src/main.ts`
  - Remove covered shell-owned story handoff branches.
- `tests/robustness.test.cjs`
  - Add red-to-green regression coverage for the covered event/scene mixed handoff paths.
- `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
  - Record execution state, progress, and closeout.
- `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
  - Sync Child 16 locked/promoted state and queue truth.
- `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
  - Sync artifact-bundle expectations for Child 16 once it becomes active later.
- `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
  - Record Child 16 queue state and later verification summary.
- `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
  - Keep Child 16 as locked until later promotion.
- `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
  - Keep the runtime maturity and queue state synchronized.
- `docs/change-log.md`
  - Record the Child 16 landing once implementation completes.

### Existing Files To Read

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/time-runtime.ts`
- current scene-session and event activation helpers

## Required Verification Gate

Every production batch in this plan must record:

- targeted `node --test tests/robustness.test.cjs --test-name-pattern "...event...|...scene...|...handoff..."`
- `npm run typecheck`
- `npm test`
- `npm run build`

Queue/governance sync batches must also record:

- `npm run lint:plans`

## Bug And Blocker Gate

- `P0`
  - broken covered event/scene path, no valid replacement for removed shell-owned handoff, or build/type/test failure
  - Rule: stop implementation and reconcile code plus queue docs before proceeding.
- `P1`
  - boundary drift into navigation/time convergence or broader story-system redesign, or Child 16 starting before Child 15 closes
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - optional naming cleanup or extra shell thinning outside the covered handoff seam
  - Rule: may be deferred only if recorded in `Progress Log`.

## Task 1: Audit Remaining Covered Event/Scene Mixed Handoff Paths

**Files:**
- Read: `docs/superpowers/specs/2026-07-02-child-16-event-scene-handoff-convergence-spec.md`
- Read: `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
- Read: `src/core/runtime/event-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Read: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Enumerate the remaining covered event/scene mixed handoff paths**

Record the exact covered event activation and event -> scene continuation paths that remain shell-owned today.

- [ ] **Step 2: Add failing regression tests for the remaining covered paths**

Write red tests that prove those covered event/scene handoff paths are not yet fully runtime-owned.

- [ ] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "event|scene|handoff"
```

Expected:

- at least one named remaining covered path fails before implementation

- [ ] **Step 4: Record the audit result in the plan state**

Update this plan's `Execution State` and `Progress Log` with the enumerated remaining paths before implementation starts.

## Task 2: Converge Covered Event Activation Ownership

**Files:**
- Modify: `src/core/runtime/event-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum covered event activation convergence**

Move the covered event activation orchestration under `event-runtime.ts` and reduce shell ownership for that path.

- [ ] **Step 2: Re-run the targeted event tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "event|handoff"
```

Expected:

- the covered event activation ownership tests pass

- [ ] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening unrelated runtime-family failures

## Task 3: Converge Covered Scene Handoff Ownership

**Files:**
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Implement the minimum covered scene handoff convergence**

Move the covered event -> scene handoff orchestration under `scene-runtime.ts` and reduce shell ownership for that path.

- [ ] **Step 2: Re-run the targeted scene tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "scene|handoff"
```

Expected:

- the covered scene handoff ownership tests pass

- [ ] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass with no regression to already accepted runtime slices

## Task 4: Reduce Residual Shell Ownership And Close Out Child 16

**Files:**
- Modify: `src/main.ts`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`

- [ ] **Step 1: Reduce the retained covered shell residue**

Ensure the covered event/scene paths are no longer shell-owned on the converged line.

- [ ] **Step 2: Record Child 16 implementation outcome**

Update `Execution State`, `Progress Log`, retained residue notes, and completion wording only after production verification passes.

- [ ] **Step 3: Run the queue/governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- plan-governance checks pass
- weekly/governance wording stays structurally valid

- [ ] **Step 4: Sync Child 16 exit truth into weekly docs**

Record that:

- covered event activation is runtime-owned
- covered event -> scene handoff is runtime-owned
- any later continuation must be re-reviewed as a new problem type if still needed

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
