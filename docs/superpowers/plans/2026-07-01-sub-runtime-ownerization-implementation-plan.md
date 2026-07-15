# Sub-Runtime Ownerization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ownerize the Child 10 baseline-approved shared dispatch, interactive, house, and settlement seams so the covered paths stop depending on bridge-period shell orchestration.

**Architecture:** Execute Child 11 strictly against the frozen Child 9 contract layer and Child 10 ownerization baseline. Work batch order is fixed: shared dispatch convergence first, interactive ownerization second, house ownerization third, and settlement alignment plus closeout fourth. The plan may thin or remove the interactive/house adapters only where runtime ownership is already contract-safe and regression-covered.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), shared runtime contracts under `src/core/contracts`, runtime seams under `src/core/runtime`, weekly governance docs, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

---

## Execution State

- Status: `completed`
- Last Updated: `2026-07-01`
- Current Focus: `Child 11 closeout is complete. The covered shared follow-up path, covered city-begging interactive lifecycle, covered grain-shop house lifecycle, and covered advanceTime settlement path are now explicitly aligned under the approved core runtime ownership slices, while legacy-house-adapter.ts remains only as a thin compatibility placeholder.`
- Next Step: `Do not reopen Child 11 scope. Child 12 remains the immediate queued UI layout/interface-reserve follow-up, and Child 13 stays locked behind Child 12 plus a later unlock review.`
- Verification: `Task 4 and closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "effect settlement contract exports emitter applier input and result seams|runtime dispatch settles effects after routing|covered settlement path stays on shared runtime ownership"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This child is now complete and must not reopen RuntimeRequest, RuntimeState carrier convergence, Interactive Runtime public contracts, House Runtime request contracts, or Effect Settlement public ownership. Boot/mod/save/presenter/UI/resource-planning work stayed out of scope. The retained legacy house adapter shell is intentionally compatibility-only after the covered house lifecycle moved under runtime ownership.`

## Progress Log

- 2026-07-01
  - Summary: `Plan created from the finalized Child 10 runtime-ownerization baseline. Child 11 is now the next executable child, but no production implementation batch has started yet.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1.`
- 2026-07-01
  - Summary: `Completed Task 1 shared dispatch convergence. tests/robustness.test.cjs now proves covered shared runtime reentry is runtime-owned, src/core/runtime/runtime-dispatch.ts now owns the covered follow-up hook on top of the hardened router seam, src/core/runtime/runtime-router.ts now defines the typed follow-up contract, and src/main.ts no longer branches on the covered story-battle reenter-house result after dispatch returns.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "shared dispatch consumes the hardened runtime router contract|runtime dispatch settles effects after routing|covered shared runtime reentry is runtime-owned"; npm run typecheck; npm test; npm run build`
  - Next: `Start Task 2 Step 1 on covered interactive ownerization.`
- 2026-07-01
  - Summary: `Completed Task 2 interactive ownerization on the covered city-begging path. tests/robustness.test.cjs now proves that launch, pointer/tick, completion follow-up, time advance, and session cleanup are runtime-owned under src/core/runtime/interactive-runtime.ts, src/core/adapters/legacy-interactive-adapter.ts no longer carries the city-begging lifecycle wrappers, and src/main.ts no longer performs the covered city-begging completion-time advance/cleanup branch itself.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime exports launch and action seams|interactive runtime contract exports launch action exit and result seams|covered interactive flow is runtime-owned"; npm run typecheck; npm test; npm run build`
  - Next: `Start Task 3 Step 1 on covered house ownerization.`
- 2026-07-01
  - Summary: `Completed Task 3 house ownerization on the covered grain-shop path. tests/robustness.test.cjs now proves that enter, dispatch, and leave for the covered grain-shop lifecycle are runtime-owned under src/core/runtime/house-runtime.ts, src/core/adapters/legacy-house-adapter.ts is reduced to a compatibility placeholder, and the covered house flow no longer routes those lifecycle steps through a legacy adapter-owned dispatch helper.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "house runtime request contract exports enter leave and dispatch variants|core house runtime bridge exports enter leave and dispatch seams|covered house flow is runtime-owned"; npm run typecheck; npm test; npm run build`
  - Next: `Start Task 4 Step 1 on covered settlement alignment.`
- 2026-07-01
  - Summary: `Completed Task 4 covered settlement alignment. tests/robustness.test.cjs now proves that the covered city-begging and covered grain-shop paths both settle time advancement through src/core/runtime/runtime-settlement.ts, interactive-runtime.ts no longer calls runTimeRuntime() for the covered completion path, house-runtime.ts no longer applies covered time costs through a direct advanceGameStateTimeSegments() call, and effect-settlement.ts now records house-runtime as an explicit covered emitter.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "effect settlement contract exports emitter applier input and result seams|runtime dispatch settles effects after routing|covered settlement path stays on shared runtime ownership"; npm run typecheck; npm test; npm run build`
  - Next: `Start Task 5 Step 1 and close Child 11 only through the required governance sync.`
- 2026-07-01
  - Summary: `Completed Child 11 closeout and governance sync. Weekly orchestration, visibility, review-index, module-map, call-flow, next-split, and architecture artifacts now agree that Child 11 is complete on shared follow-up, covered interactive, covered house, and covered settlement ownerization for the approved slices; Child 12 remains the immediate queued follow-up; and Child 13 remains locked behind Child 12 plus a later unlock review.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 11 closed. When execution is explicitly resumed on a new child, start Child 12 from its own plan instead of reopening this child.`

---

## Source Documents

- Child 11 spec: `docs/superpowers/specs/2026-07-01-sub-runtime-ownerization-implementation-spec.md`
- Child 10 baseline: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Child 10 review spec: `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`
- Child 9 contract baseline: `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Weekly controller: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Weekly visibility companion: `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`

## Parent Alignment

- This file is `Child Plan 11` in the weekly queue.
- Primary subsystem boundary:
  - `Shared dispatch convergence`, `Interaction Runtime ownerization`, `House Runtime ownerization`, `Effect Settlement alignment`
- Secondary subsystem relationships:
  - consumes the Child 9 shared contract layer as a frozen implementation surface
  - consumes the Child 10 owner/bridge baseline as the controlling scope boundary
  - may reduce interactive/house adapters only where the baseline already allows it
- Queue rule:
  - Child 11 is now formally unlocked because the Child 10 baseline is finalized, this Child 11 spec/plan set exists, and weekly unlock sync has been recorded.
  - If implementation hits a frozen-boundary escalation, update baseline/spec/plan/weekly docs before continuing.

## Scope

This child plan includes:

- shared runtime entry convergence for covered paths
- interactive runtime ownerization
- house runtime ownerization
- settlement alignment for covered shared runtime paths
- covered regression tests
- required queue and visibility closeout sync

This child plan does not include:

- boot/content assembly redesign
- Mod Runtime redesign
- Save / Load Runtime redesign
- StateSync Runtime redesign
- presenter/UI/layout work
- resource planning
- runtime carrier convergence redesign
- house content expansion

## File Map

### Existing Files To Modify

- `src/core/runtime/runtime-dispatch.ts`
  - Reduce covered-path shell orchestration by converging on shared dispatch handling.
- `src/core/runtime/runtime-router.ts`
  - Keep routing aligned with the Child 9 contract while reducing covered-path bridge logic.
- `src/core/runtime/interactive-runtime.ts`
  - Move covered interactive lifecycle and follow-up under runtime ownership.
- `src/core/runtime/house-runtime.ts`
  - Move covered house lifecycle and follow-up under runtime ownership.
- `src/core/runtime/runtime-settlement.ts`
  - Align effect settlement on the approved runtime-owned path.
- `src/core/adapters/legacy-interactive-adapter.ts`
  - Thin or remove the compatibility bridge where Child 11 runtime ownership replaces it.
- `src/core/adapters/legacy-house-adapter.ts`
  - Thin or remove the compatibility bridge where Child 11 runtime ownership replaces it.
- `src/main.ts`
  - Reduce covered interactive/house/shared follow-up orchestration only.
- `tests/robustness.test.cjs`
  - Add covered-path regression tests for dispatch convergence, interactive ownerization, house ownerization, and settlement alignment.
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Record active Child 11 execution status and closeout state.
- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
  - Keep weekly visibility wording synchronized with Child 11 execution.
- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
  - Reflect Child 11 as the active executable child and later as completed or blocked.
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
  - Update runtime/adaptor ownership wording for the covered paths.
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
  - Update the Child 11 governance/unlock flow and any newly stabilized runtime-owned flow.
- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
  - Reflect Child 11 as the active next implementation split and later move to the next candidate.
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`
  - Update architecture summary, adapter posture, and risk wording after ownerization lands.

### Existing Files To Read

- `src/core/contracts/runtime-request.ts`
- `src/core/contracts/runtime-result.ts`
- `src/core/contracts/runtime-state.ts`
- `src/core/contracts/interactive-runtime.ts`
- `src/core/contracts/house-runtime.ts`
- `src/core/contracts/effect-settlement.ts`
- `src/core/runtime/state-sync-runtime.ts`
- `src/application/house/house-runtime.ts`
- `src/application/minigames/city-begging-minigame.ts`
- `src/application/story-battle/story-battle-runtime.ts`

## Required Verification Gate

Every production batch in this plan must record:

- `npm run build:test`
- targeted `node --test tests/robustness.test.cjs --test-name-pattern "..."`
- `npm run typecheck`
- `npm test`
- `npm run build`

Queue/governance sync batches must also record:

- `npm run lint:plans`

## Bug And Blocker Gate

- `P0`
  - broken covered runtime path, no valid replacement for a removed adapter, queue unlock contradiction, or build/type/test failure
  - Rule: stop implementation and reconcile code plus queue docs before proceeding.
- `P1`
  - boundary drift into boot/mod/save/presenter/UI/resource scope, or reopening Child 9/10 frozen contracts without a baseline revision
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - optional cleanup or naming refinement outside the covered ownerization seam
  - Rule: may be deferred only if recorded in `Progress Log`.

## Task 1: Converge Covered Shared Runtime Entry

**Files:**
- Read: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Read: `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/main.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add failing regression tests for covered shared dispatch convergence**

Write red tests that prove covered shared runtime entry and reentry still depend on ad hoc shell orchestration today.

- [x] **Step 2: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "shared dispatch consumes the hardened runtime router contract|runtime dispatch settles effects after routing|covered shared runtime reentry is runtime-owned"
```

Expected:

- existing Child 9 contract tests still pass
- the new covered reentry/ownerization assertion fails before implementation

- [x] **Step 3: Implement the minimum shared dispatch convergence**

Reduce covered-path `src/main.ts` orchestration by moving approved request/follow-up handling behind `runtime-dispatch.ts` and `runtime-router.ts` without widening the Child 9 request families.

- [x] **Step 4: Re-run the targeted shared dispatch tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "shared dispatch consumes the hardened runtime router contract|runtime dispatch settles effects after routing|covered shared runtime reentry is runtime-owned"
```

Expected:

- all targeted shared dispatch tests pass

- [x] **Step 5: Run the full verification gate for Task 1**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening contract-surface failures

## Task 2: Ownerize Covered Interactive Runtime Flow

**Files:**
- Read: `src/core/contracts/interactive-runtime.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/adapters/legacy-interactive-adapter.ts`
- Modify: `src/main.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add failing regression tests for interactive ownerization**

Write red tests for one covered interactive launch/action/follow-up path that still depends on adapter-owned lifecycle control.

- [x] **Step 2: Run the targeted interactive red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime exports launch and action seams|interactive runtime contract exports launch action exit and result seams|covered interactive flow is runtime-owned"
```

Expected:

- contract-shape tests still pass
- the new runtime-owned flow assertion fails before implementation

- [x] **Step 3: Implement interactive runtime ownerization**

Move the covered launch/action/exit/follow-up lifecycle under `src/core/runtime/interactive-runtime.ts` and reduce `legacy-interactive-adapter.ts` to the thinnest compatibility seam still required by scope.

- [x] **Step 4: Re-run the targeted interactive tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime exports launch and action seams|interactive runtime contract exports launch action exit and result seams|covered interactive flow is runtime-owned"
```

Expected:

- all targeted interactive tests pass

- [x] **Step 5: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass with no Child 9 contract regression

## Task 3: Ownerize Covered House Runtime Flow

**Files:**
- Read: `src/core/contracts/house-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `src/core/adapters/legacy-house-adapter.ts`
- Modify: `src/main.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add failing regression tests for house ownerization**

Write red tests for one covered house enter/action/leave path that still depends on adapter-backed lifecycle control.

- [x] **Step 2: Run the targeted house red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "house runtime request contract exports enter leave and dispatch variants|core house runtime bridge exports enter leave and dispatch seams|covered house flow is runtime-owned"
```

Expected:

- contract-shape tests still pass
- the new runtime-owned house flow assertion fails before implementation

- [x] **Step 3: Implement house runtime ownerization**

Move the covered enter/dispatch/leave/follow-up lifecycle under `src/core/runtime/house-runtime.ts` and reduce `legacy-house-adapter.ts` to the thinnest compatibility seam still required by scope.

- [x] **Step 4: Re-run the targeted house tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "house runtime request contract exports enter leave and dispatch variants|core house runtime bridge exports enter leave and dispatch seams|covered house flow is runtime-owned"
```

Expected:

- all targeted house tests pass

- [x] **Step 5: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass with no house-request contract regression

## Task 4: Align Effect Settlement On The Covered Runtime-Owned Path

**Files:**
- Read: `src/core/contracts/effect-settlement.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add failing regression tests for covered settlement alignment**

Write red tests that prove covered interactive/house/shared runtime paths still settle effects through mixed or unclear ownership.

- [x] **Step 2: Run the targeted settlement red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "effect settlement contract exports emitter applier input and result seams|runtime dispatch settles effects after routing|covered settlement path stays on shared runtime ownership"
```

Expected:

- contract-shape tests still pass
- the new covered settlement alignment assertion fails before implementation

- [x] **Step 3: Implement the minimum settlement alignment**

Align covered shared/interactive/house effect application with `runtime-settlement.ts` while keeping settlement separate from feature routing ownership.

- [x] **Step 4: Re-run the targeted settlement tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "effect settlement contract exports emitter applier input and result seams|runtime dispatch settles effects after routing|covered settlement path stays on shared runtime ownership"
```

Expected:

- all targeted settlement tests pass

- [x] **Step 5: Run the full verification gate for Task 4**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without settlement ownership regressions

## Task 5: Child 11 Closeout And Governance Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

- [x] **Step 1: Record Child 11 implementation outcome**

Update `Execution State`, `Progress Log`, retained adapter/residual debt notes, and completion wording only after all production verification passes.

- [x] **Step 2: Run the required queue/governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- plan-governance checks pass
- weekly/visibility/child wording stays structurally valid

- [x] **Step 3: Confirm Child 11 exit criteria in the weekly docs**

Record that:

- covered shared runtime entry is dispatch/router-owned
- covered interactive flows are runtime-owned
- covered house flows are runtime-owned
- covered settlement alignment is explicit
- any retained compatibility shell is thin and justified

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
