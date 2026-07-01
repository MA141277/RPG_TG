# Runtime Contract Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the minimum shared runtime contracts required to unblock later sub-runtime ownerization without expanding this child into runtime implementation ownership work.

**Architecture:** Build Child 9 as a contract-layer child after `Child 8 StateSync Runtime`. Formalize the shared request/router seam, interactive/minigame dispatch seam, effect-settlement seam, and minimum house-runtime request seam under `src/core/contracts`, while keeping current bridge/adapters temporarily in place where needed. This child exists to stabilize entry language, not to finish runtime migration.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/core/contracts/**`, existing `src/core/runtime/**`, repository plan governance

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-01`
- Current Focus: `Child 9 Runtime Contract Hardening is authored and promoted as the next executable child, but implementation has not started.`
- Next Step: `Start Task 1 Step 1 after queue closeout sync confirms Child 9 as the active child.`
- Verification: `Not run`
- Notes: `This is a contract-hardening child only. It must not absorb sub-runtime ownerization, adapter removal, UI/layout work, or resource planning. Child 10 remains blocked on Child 9 closeout plus a new preflight review.`

## Progress Log

- 2026-07-01
  - Summary: `Child 9 Runtime Contract Hardening plan authored from the approved four-part contract checklist. Scope is limited to typed RuntimeRequest/Router, formal Interactive/Minigame Dispatch, formal Effect Settlement, and minimum House Runtime Request contracts.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1 once weekly and parent queue state both confirm Child 9 as the active next child.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 4 interactive runtime plan: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
- Child 6 task runtime plan: `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
- Child 7 mod runtime plan: `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`
- Child 8 state sync runtime plan: `docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md`

## Parent Alignment

- This file is `Child Plan 9` in the parent and weekly orchestration queues.
- Primary subsystem boundary:
  - `Shared Runtime contract layer`
- Secondary subsystem relationships:
  - hardens the shared request/router seam used by dispatch
  - hardens the public interactive/minigame dispatch seam used by Child 4 bridge-period runtime work
  - hardens the effect-settlement seam already used by shared runtime
  - hardens the public house-runtime request seam before later ownerization
- Queue rule:
  - Child 8 is completed.
  - Child 9 is the next executable child.
  - Child 10 must not be promoted until Child 9 closes and a new preflight review is recorded.

## Scope

This child plan includes:

- typed `RuntimeRequest` hardening
- formal router contract hardening
- shared dispatch contract alignment where required by the router contract
- formal `Interactive / Minigame Dispatch` contract
- formal `Effect Settlement` contract
- minimal `House Runtime Request` contract
- targeted regression tests for the contract files and public runtime entrypoints
- queue/governance sync after each meaningful batch

This child plan does not include:

- runtime ownerization
- bridge/adapter removal beyond what is directly required to expose the formal contract
- deep `src/main.ts` cleanup
- presenter, UI, or layout renderer changes
- save IO redesign
- mod capability/dependency redesign
- resource planning

## File Map

### Existing Files To Modify

- `src/core/contracts/runtime-request.ts`
  - Harden shared request families beyond the current string-and-payload minimum seam.
- `src/core/runtime/runtime-router.ts`
  - Move the router boundary from a minimal function alias toward a formal shared routing contract.
- `src/core/runtime/runtime-dispatch.ts`
  - Keep dispatch aligned with the hardened router/request contract without expanding ownership.
- `src/core/contracts/interactive-runtime.ts`
  - Formalize launch/action/exit and minigame dispatch surface.
- `src/core/runtime/interactive-runtime.ts`
  - Keep runtime entrypoints aligned with the formal contract while preserving compatibility behavior.
- `src/core/contracts/effect.ts`
  - Reconcile the current effect value union with the formal settlement contract.
- `src/core/runtime/runtime-settlement.ts`
  - Make settlement entry/output and ownership boundaries explicit.
- `src/core/runtime/house-runtime.ts`
  - Replace domain-owned public request exposure with the minimum core-owned house runtime request contract.
- `tests/robustness.test.cjs`
  - Add focused contract and public-boundary regression tests.
- `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md`
  - Track progress and verification as implementation proceeds.
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Keep queue state synchronized.
- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Keep parent orchestration synchronized.

### New Files To Create

- `src/core/contracts/house-runtime.ts`
  - Owns the core public request and bridge-period session entry contract for house runtime.
- `src/core/contracts/effect-settlement.ts`
  - Owns the formal shared settlement input/output interface if the existing `effect.ts` file cannot carry that responsibility cleanly.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

For targeted contract work, also record:

- `npm run build:test`
- exact `node --test tests/robustness.test.cjs --test-name-pattern "..."`

## Bug And Blocker Gate

- `P0`
  - type failure, build failure, shared dispatch regression, runtime request incompatibility that breaks covered flows, settlement corruption risk
  - Rule: stop later tasks in this child plan until resolved.
- `P1`
  - Child 9 expands into runtime ownerization, adapters are removed without a stable replacement contract, or contract ownership remains outside `src/core/contracts`
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - optional compatibility cleanup, legacy naming cleanup outside the covered contract seams, extra effect-kind breadth beyond the approved minimum
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action.

## Task 1: Reconcile Child 9 Scope Against Current Contract Gaps

**Files:**
- Read: `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
- Read: `src/core/contracts/runtime-request.ts`
- Read: `src/core/runtime/runtime-router.ts`
- Read: `src/core/contracts/interactive-runtime.ts`
- Read: `src/core/contracts/effect.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `src/core/runtime/house-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md`

- [ ] **Step 1: Record current shared request/router gaps**

Record the current minimum seams:

- `RuntimeRequest` is still mostly string-plus-payload
- router is still a thin function alias
- dispatch still depends on that thin router shape

State explicitly which current request families must be formalized in Child 9 and which later request families remain out of scope.

- [ ] **Step 2: Record current interactive/minigame contract gaps**

Record that the current interactive contract mainly identifies runtime kind and source, but does not yet formalize launch/action/exit/minigame dispatch as one public contract.

- [ ] **Step 3: Record current effect settlement gaps**

Record that the current `Effect` union and `applyEffects()` implementation are still a first-slice seam and that settlement ownership/input/output must be formalized without absorbing unrelated runtime ownership.

- [ ] **Step 4: Record current house runtime request gap**

Record that the current core house runtime public request still inherits domain `HouseModuleRequest` instead of a core-owned request contract.

## Task 2: Add Failing Contract Tests For The Shared Request / Router Seam

**Files:**
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing RuntimeRequest contract export test**

Add a red test that proves Child 9 exports explicit typed request families for the covered shared runtime paths and does not rely only on one generic payload carrier.

- [ ] **Step 2: Add a failing router contract test**

Add a red test that proves a formal router contract exists for shared runtime dispatch rather than only an inline function type alias.

- [ ] **Step 3: Add a failing shared dispatch alignment test**

Add a red test that proves `dispatchRuntimeRequest()` consumes the hardened router/request contract instead of bypassing it.

- [ ] **Step 4: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "runtime request contract|runtime router contract|shared dispatch"
```

Expected:

- tests fail because the current shared request/router seam is still the minimum Child 1/4 version

## Task 3: Formalize Interactive / Minigame Dispatch Contracts

**Files:**
- Modify: `src/core/contracts/interactive-runtime.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Introduce explicit interactive request/result types**

Define the formal launch/action/exit contract and the minimum result shape needed by the shared runtime path.

- [ ] **Step 2: Fold covered minigame paths into one dispatch envelope**

Make `activity-qte`, `city-begging`, and `story-battle` converge on the same public interactive dispatch language while preserving compatibility behavior behind that seam.

- [ ] **Step 3: Keep interactive business logic out of the contract layer**

Ensure the contract defines dispatch language and session/result shape only. Concrete minigame logic remains outside this child.

- [ ] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime contract|minigame dispatch contract"
```

Expected:

- contract exports exist and covered minigame paths align with one formal dispatch surface

## Task 4: Formalize Effect Settlement Contracts

**Files:**
- Modify: `src/core/contracts/effect.ts`
- Modify or Create: `src/core/contracts/effect-settlement.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Define settlement input/output ownership**

Make the settlement contract explicit about who emits effects, who applies them, and what settlement returns.

- [ ] **Step 2: Preserve shared settlement scope**

Keep task progression, event selection, scene ownership, interaction ownership, and save IO outside the settlement contract.

- [ ] **Step 3: Align runtime-settlement implementation entrypoint**

Update the public settlement entrypoint so it conforms to the hardened contract without expanding scope.

- [ ] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "effect settlement contract|runtime settlement"
```

Expected:

- settlement ownership and I/O are explicit and do not absorb unrelated runtime work

## Task 5: Formalize The Minimum House Runtime Request Contract

**Files:**
- Create or Modify: `src/core/contracts/house-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Introduce core-owned house runtime request types**

Define the minimum request contract needed for `enter`, `leave`, and current-session dispatch without exposing concrete house business logic as the shared public boundary.

- [ ] **Step 2: Preserve bridge-period compatibility**

Keep the current legacy house adapter usable behind the new core-owned request contract.

- [ ] **Step 3: Prevent domain contract leakage**

Ensure `src/core/runtime/house-runtime.ts` no longer exposes the domain `HouseModuleRequest` as the primary shared public request surface.

- [ ] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "house runtime request contract|house runtime bridge"
```

Expected:

- the public house runtime seam is core-owned even if implementation still delegates through adapters

## Task 6: Child 9 Closeout Sync

**Files:**
- Modify: `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Modify: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Modify: `docs/change-log.md`

- [ ] **Step 1: Record final Child 9 landing scope**

Log exactly which shared contracts were hardened, which bridges remain, and which ownerization work is explicitly deferred to Child 10.

- [ ] **Step 2: Sync queue state**

Update weekly and parent plans so Child 9 is marked `completed` only after verification passes, and do not promote Child 10 automatically without a new preflight review.

- [ ] **Step 3: Run required closeout verification**

Run:

```bash
npm run typecheck
npm test
npm run build
npm run lint:plans
```

Expected:

- all required verification passes and queue artifacts agree on Child 9 status

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
