# Runtime Contract Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the minimum shared runtime contracts required to unblock later sub-runtime ownerization without expanding this child into runtime implementation ownership work.

**Architecture:** Build Child 9 as a contract-layer child after `Child 8 StateSync Runtime`. Formalize the shared request/router seam, interactive/minigame dispatch seam, effect-settlement seam, and minimum house-runtime request seam under `src/core/contracts`, while keeping current bridge/adapters temporarily in place where needed. This child exists to stabilize entry language, not to finish runtime migration.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/core/contracts/**`, existing `src/core/runtime/**`, repository plan governance

## Execution State

- Status: `completed`
- Last Updated: `2026-07-01`
- Current Focus: `Child 9 closeout is complete. All four shared contract baselines are now landed and verified without promoting this child into runtime ownerization.`
- Next Step: `Child 10 is complete and Child 11 is now unlocked. Begin Child 11 from its own implementation plan when ownerization code work starts.`
- Verification: `npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `Child 9 hardened contracts only. Legacy house and interactive adapters remain in place by design, and ownerization work is explicitly deferred to Child 10 / Child 11.`

## Progress Log

- 2026-07-01
  - Summary: `Child 9 Runtime Contract Hardening plan authored from the approved four-part contract checklist. Scope is limited to typed RuntimeRequest/Router, formal Interactive/Minigame Dispatch, formal Effect Settlement, and minimum House Runtime Request contracts.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1 once weekly and parent queue state both confirm Child 9 as the active next child.`
- 2026-07-01
  - Summary: `Started Child 9 execution. Task 1 gap reconciliation now records the current request/router, interactive dispatch, effect-settlement, and house-request deficiencies directly in the plan so follow-up implementation work does not rely on implied context.`
  - Verification: `Pending doc-sync verification`
  - Next: `Start Task 2 Step 1 and add failing RuntimeRequest / Router contract tests.`
- 2026-07-01
  - Summary: `Completed Child 9 Task 2. The shared runtime seam now exports typed RuntimeRequest families, exposes a formal RuntimeRouter routing seam, and makes dispatch consume that router contract instead of the previous inline routeRequest callback.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "runtime request contract|runtime router contract|shared dispatch"`
  - Next: `Start Task 3 Step 1 and add failing Interactive / Minigame Dispatch contract tests.`
- 2026-07-01
  - Summary: `Completed Child 9 Task 3. Interactive Runtime now has explicit launch/action/exit request contracts, a formal result/session handoff shape, and one request normalizer that converges activity-qte, city-begging, and story-battle on the same public dispatch language while keeping legacy business logic in adapters.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime contract|minigame dispatch contract"`
  - Next: `Start Task 4 Step 1 and add failing Effect Settlement contract tests.`
- 2026-07-01
  - Summary: `Completed Child 9 Task 4. Effect Settlement now has an explicit contract seam for emitted/applied ownership, settlement input/output, and unsupported-effect reporting; runtime dispatch now consumes that formal settlement entrypoint instead of a bare helper.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "effect settlement contract|runtime settlement"`
  - Next: `Start Task 5 Step 1 and add failing House Runtime Request contract tests.`
- 2026-07-01
  - Summary: `Completed Child 9 Task 5. House Runtime now exposes a core-owned public request seam for enter/leave/current-session dispatch while preserving bridge-period compatibility through the legacy adapter and keeping compatibility-only helper methods available to main.ts.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "house runtime request contract|house runtime bridge|main.ts stays free of TypeScript diagnostics for runtime text wiring"`
  - Next: `Run Child 9 closeout sync and promote Child 10 only after full verification passes.`
- 2026-07-01
  - Summary: `Closed Child 9. The typed RuntimeRequest/Router contract, formal Interactive/Minigame Dispatch contract, formal Effect Settlement contract, and minimum core-owned House Runtime Request contract are all landed, verified, and recorded in queue governance.`
  - Verification: `npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Execute Child 10 Runtime Ownerization Review And Baseline as the newly unlocked next child.`

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
  - Child 10 is already authored and queued, but it must not be promoted until Child 9 closes and queue sync records the handoff.

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

- [x] **Step 1: Record current shared request/router gaps**

Record the current minimum seams:

- `RuntimeRequest` is still mostly string-plus-payload
- router is still a thin function alias
- dispatch still depends on that thin router shape

State explicitly which current request families must be formalized in Child 9 and which later request families remain out of scope.

- [x] **Step 2: Record current interactive/minigame contract gaps**

Record that the current interactive contract mainly identifies runtime kind and source, but does not yet formalize launch/action/exit/minigame dispatch as one public contract.

- [x] **Step 3: Record current effect settlement gaps**

Record that the current `Effect` union and `applyEffects()` implementation are still a first-slice seam and that settlement ownership/input/output must be formalized without absorbing unrelated runtime ownership.

- [x] **Step 4: Record current house runtime request gap**

Record that the current core house runtime public request still inherits domain `HouseModuleRequest` instead of a core-owned request contract.

### Task 1 Findings

#### Shared Request / Router Gap Snapshot

- `src/core/contracts/runtime-request.ts` currently exports only three broad shapes:
  - `action`
  - `tick`
  - `external`
- all three still rely on loose `payload?: Record<string, unknown>` carriage
- typed request families for covered shared-runtime traffic do not yet exist
- `src/core/runtime/runtime-router.ts` still exports only a function alias over `{ state, request } -> RuntimeResult`
- no hardened router contract object or typed route-family identity exists yet
- Child 9 must formalize the shared request language for covered runtime traffic only
- later request families outside the covered shared, interactive, settlement, and house seams remain out of scope for this child

#### Interactive Dispatch Gap Snapshot

- `src/core/contracts/interactive-runtime.ts` currently exposes:
  - `InteractiveRuntimeKind`
  - `InteractiveRuntimeSource`
  - `ActiveInteractiveRuntimeSession`
- it does not yet define:
  - launch request shape
  - action request shape
  - exit request shape
  - unified minigame dispatch envelope
  - explicit result / follow-up handoff shape
- the current contract identifies the session, but not the full public dispatch language

#### Effect Settlement Gap Snapshot

- `src/core/contracts/effect.ts` defines only the value union
- `src/core/runtime/runtime-settlement.ts` currently exposes only `applyEffects(state, effects)`
- the implementation only handles:
  - `setFlag`
  - `setVariable`
- other declared effect kinds such as `changeMoney` and `advanceTime` are not settled there yet
- settlement ownership, settlement return contract, and unsupported-effect posture are not yet explicit

#### House Runtime Request Gap Snapshot

- `src/core/runtime/house-runtime.ts` still imports and re-exports the public request seam through domain `HouseModuleRequest`
- the current public API still treats house request dispatch as:
  - `dispatchHouseRuntimeRequest(runtime, request: HouseModuleRequest)`
- `enter`, `leave`, and current-session dispatch do exist as distinct functions, but they are not yet backed by a core-owned request contract surface
- Child 9 must move the public request vocabulary into `src/core/contracts` while preserving bridge-period adapter compatibility

## Task 2: Add Failing Contract Tests For The Shared Request / Router Seam

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing RuntimeRequest contract export test**

Add a red test that proves Child 9 exports explicit typed request families for the covered shared runtime paths and does not rely only on one generic payload carrier.

- [x] **Step 2: Add a failing router contract test**

Add a red test that proves a formal router contract exists for shared runtime dispatch rather than only an inline function type alias.

- [x] **Step 3: Add a failing shared dispatch alignment test**

Add a red test that proves `dispatchRuntimeRequest()` consumes the hardened router/request contract instead of bypassing it.

- [x] **Step 4: Run focused tests and confirm failure**

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

- [x] **Step 1: Introduce explicit interactive request/result types**

Define the formal launch/action/exit contract and the minimum result shape needed by the shared runtime path.

- [x] **Step 2: Fold covered minigame paths into one dispatch envelope**

Make `activity-qte`, `city-begging`, and `story-battle` converge on the same public interactive dispatch language while preserving compatibility behavior behind that seam.

- [x] **Step 3: Keep interactive business logic out of the contract layer**

Ensure the contract defines dispatch language and session/result shape only. Concrete minigame logic remains outside this child.

- [x] **Step 4: Run focused verification**

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

- [x] **Step 1: Define settlement input/output ownership**

Make the settlement contract explicit about who emits effects, who applies them, and what settlement returns.

- [x] **Step 2: Preserve shared settlement scope**

Keep task progression, event selection, scene ownership, interaction ownership, and save IO outside the settlement contract.

- [x] **Step 3: Align runtime-settlement implementation entrypoint**

Update the public settlement entrypoint so it conforms to the hardened contract without expanding scope.

- [x] **Step 4: Run focused verification**

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

- [x] **Step 1: Introduce core-owned house runtime request types**

Define the minimum request contract needed for `enter`, `leave`, and current-session dispatch without exposing concrete house business logic as the shared public boundary.

- [x] **Step 2: Preserve bridge-period compatibility**

Keep the current legacy house adapter usable behind the new core-owned request contract.

- [x] **Step 3: Prevent domain contract leakage**

Ensure `src/core/runtime/house-runtime.ts` no longer exposes the domain `HouseModuleRequest` as the primary shared public request surface.

- [x] **Step 4: Run focused verification**

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

- [x] **Step 1: Record final Child 9 landing scope**

Log exactly which shared contracts were hardened, which bridges remain, and which ownerization work is explicitly deferred to Child 10.

- [x] **Step 2: Sync queue state**

Update weekly and parent plans so Child 9 is marked `completed` only after verification passes, and promote Child 10 only through the recorded queue sync that already references the authored Child 10 baseline/spec/plan set.

- [x] **Step 3: Run required closeout verification**

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

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
