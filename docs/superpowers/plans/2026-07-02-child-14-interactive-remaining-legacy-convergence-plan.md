# Child 14 Interactive Remaining Legacy Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the remaining covered `activity-qte` and `story-battle` interactive legacy lifecycle paths so they become runtime-owned under `src/core/runtime/interactive-runtime.ts` instead of depending on `legacy-interactive-adapter.ts` and shell-owned cleanup tails in `src/main.ts`.

**Architecture:** Child 14 is the first active executable child in the fresh `2026-07-02` weekly continuation set after the closed Child 13 queue. It must stay narrowly inside the interactive family: classify and test the remaining covered interactive tails first, converge `activity-qte` second, converge `story-battle` third, then reduce adapter/shell residue and synchronize governance closeout fourth. Child 14 must not absorb navigation/time/event/scene convergence or reopen frozen runtime-baseline decisions.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), existing interactive/runtime dispatch seams, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 14 closeout is complete. The remaining next governance step is outside this plan: recheck Child 15 against the updated baseline before any later promotion.`
- Next Step: `No further execution in this child plan. Keep the result as the accepted Child 14 baseline and let weekly governance decide whether to promote Child 15 or close the set.`
- Verification: `node --test tests/robustness.test.cjs --test-name-pattern "child 14|activity qte result close|legacy adapter-owned qte|interactive request normalizer"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
- Notes: `Child 14 stayed inside remaining interactive legacy convergence only. Child 15 Navigation + Time Runtime Convergence and Child 16 Event + Scene Handoff Convergence remain outside this completed plan.`

## Progress Log

- 2026-07-02
  - Summary: `Child 14 formal spec and active plan authored, and the fresh 2026-07-02 weekly continuation set now records Child 14 as the active executable child after the closed Child 13 queue.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1.`
- 2026-07-02
  - Summary: `Audited the remaining covered interactive tails and confirmed the last same-type ownership residue was narrow: interactive-runtime still imported legacy adapter helpers for activity-qte tick/stop and story-battle action dispatch, while src/main.ts still cleared the activity-qte result overlay through a shell-owned clearActivityResult tail. Added red regression tests first, then converged those paths into src/core/runtime/interactive-runtime.ts, reduced legacy-interactive-adapter.ts to placeholder-only residue, and routed activity-qte result close through createExitInteractiveRequest("activity-qte").`
  - Verification: `npm run build:test` + `node --test tests/robustness.test.cjs --test-name-pattern "child 14|activity qte result close|legacy adapter-owned qte|interactive request normalizer"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `No next execution inside Child 14. Weekly governance should now recheck Child 15 before any promotion.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Child 13 closeout remains accepted and the remaining same-type interactive debt is still concentrated on activity-qte + story-battle lifecycle ownership.`
  - `Child 15 Navigation + Time Runtime Convergence and Child 16 Event + Scene Handoff Convergence remain outside this plan and stay spec-only until later promotion.`

## Implementation Scope

### In Scope

- audit of the remaining covered `activity-qte` and `story-battle` legacy interactive tails
- targeted red-to-green regression coverage for those tails
- `activity-qte` runtime ownerization
- `story-battle` runtime ownerization
- `legacy-interactive-adapter.ts` reduction for the covered paths
- covered `src/main.ts` cleanup / follow-up reduction
- required weekly/governance closeout sync

### Still Out Of Scope

- navigation/time convergence
- event/scene handoff convergence
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign
- new runtime contract families
- general story-system redesign

## File Map

### Existing files to modify

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

### Existing files to read

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/house-runtime.ts`
- `src/application/minigames/city-begging-minigame.ts`
- `src/application/story-battle/story-battle-runtime.ts`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "activity-qte|story-battle|interactive"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit Remaining Covered Interactive Legacy Tails

**Files:**
- Read: `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
- Read: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Read: `docs/superpowers/specs/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-spec.md`
- Read: `src/core/runtime/interactive-runtime.ts`
- Read: `src/core/adapters/legacy-interactive-adapter.ts`
- Read: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Enumerate the remaining covered interactive lifecycle tails**

Record the exact `activity-qte` and `story-battle` launch / action / exit / completion tails that are still adapter-owned or shell-owned today.

- [x] **Step 2: Add failing regression tests for the remaining covered tails**

Write red tests that prove the covered `activity-qte` and `story-battle` lifecycle tails are not yet fully runtime-owned.

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "activity-qte|story-battle|interactive"
```

Expected:

- at least one named remaining covered tail fails before implementation

- [x] **Step 4: Record the audit result in the plan state**

Update this plan's `Execution State` and `Progress Log` with the enumerated remaining paths before moving into implementation.

## Task 2: Converge Covered `activity-qte` Lifecycle Ownership

**Files:**
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/adapters/legacy-interactive-adapter.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Implement the minimum `activity-qte` runtime convergence**

Move the covered `activity-qte` launch / action / exit / completion lifecycle under `interactive-runtime.ts` and reduce adapter ownership for that path.

- [x] **Step 2: Re-run the targeted `activity-qte` tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "activity-qte|interactive"
```

Expected:

- the covered `activity-qte` ownership tests pass

- [x] **Step 3: Run the full verification gate for Task 2**

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

- [x] **Step 1: Implement the minimum `story-battle` runtime convergence**

Move the covered `story-battle` launch / action / exit / completion lifecycle under `interactive-runtime.ts` and remove the covered shell-owned cleanup / follow-up tail from `src/main.ts`.

- [x] **Step 2: Re-run the targeted `story-battle` tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "story-battle|interactive"
```

Expected:

- the covered `story-battle` ownership tests pass

- [x] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening unrelated runtime-family failures

## Task 4: Reduce Adapter Residue And Close Out Governance

**Files:**
- Modify: `src/core/adapters/legacy-interactive-adapter.ts`
- Modify: `src/main.ts`
- Modify: `docs/superpowers/plans/2026-07-02-child-14-interactive-remaining-legacy-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Reduce retained adapter and shell residue for the covered paths**

Keep only justified compatibility glue in `legacy-interactive-adapter.ts` after the covered runtime-owned paths land.

- [x] **Step 2: Update weekly artifacts and queue truth**

Record Child 14 outcome, verification state, and the current Child 15 / Child 16 queue status across the `2026-07-02` artifact bundle.

- [x] **Step 3: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] covered `activity-qte` lifecycle ownership is runtime-owned
- [x] covered `story-battle` lifecycle ownership is runtime-owned
- [x] `src/main.ts` no longer carries the covered interactive cleanup / follow-up tails
- [x] `legacy-interactive-adapter.ts` is reduced to justified compatibility-only residue or no longer owns the covered paths
- [x] Child 14 does not reopen navigation/time/event/scene scope
- [x] targeted regression coverage passes
- [x] weekly artifacts are updated
- [x] weekly queue state is updated

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
