# Sub-Runtime Ownerization Implementation Spec

## 1. Goal

Define the formal `Child 11 Sub-Runtime Ownerization Implementation` boundary for the current mod-first engine/runtime roadmap.

Child 11 is the first production ownerization child after `Child 9 Runtime Contract Hardening` and `Child 10 Runtime Ownerization Review And Baseline`. Its job is to implement against the frozen Child 9 and Child 10 surfaces so covered shared dispatch, interaction, house, and settlement paths stop depending on bridge-period orchestration where the baseline has already approved ownerization.

## 2. Basic Information

- Child name: `Sub-Runtime Ownerization Implementation`
- Child index: `Child 11`
- One-line responsibility:
  - ownerize the baseline-approved shared dispatch, interaction, house, and settlement seams without reopening the underlying contract or runtime-boundary governance
- Architecture position:
  - first production ownerization child after `Child 10 Runtime Ownerization Review And Baseline`
- Primary target areas:
  - shared dispatch convergence
  - `Interaction Runtime` ownerization
  - `House Runtime` ownerization
  - `Effect Settlement Runtime` alignment along the approved shared path

## 3. Governing Inputs

Child 11 is governed by these documents in this priority order:

1. `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
2. `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
3. `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
4. `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
5. this spec

If Child 11 work would contradict a higher-priority source, Child 11 must stop and update the governing docs before implementation continues.

## 4. Problem Statement

The repository now has:

- a formal shared runtime contract baseline from Child 9
- a formal owner-vs-bridge baseline from Child 10
- explicit adapter keep/remove policy
- explicit `src/main.ts` coupling decisions for the covered paths

But the covered implementation paths are still not fully runtime-owned:

- shared runtime entry and follow-up handling still depend on mixed shell/runtime orchestration
- `Interaction Runtime` still relies on `legacy-interactive-adapter` plus legacy lifecycle ownership
- `House Runtime` still relies on `legacy-house-adapter` plus application-layer lifecycle ownership
- settlement ownership is formalized at contract level, but the approved runtime-owned path is not yet consistently implemented

Without Child 11, the repository remains in a bridge-period state even though the target runtime seams and public contracts are already defined.

## 5. Child 11 Objective

Child 11 must implement exactly the ownerization direction frozen by Child 10:

- converge more covered runtime entry on shared dispatch/router ownership
- move covered interactive lifecycle and follow-up handling under runtime ownership
- move covered house lifecycle and follow-up handling under runtime ownership
- align effect settlement with the approved shared runtime path
- reduce direct `src/main.ts` orchestration for the covered paths only

Child 11 must not reinterpret this objective as a general architecture rewrite.

## 6. Frozen Contract Surface

Child 11 must implement against the Child 9 contracts and Child 10 freeze rules.

### 6.1 Hard-Frozen Surfaces

- `RuntimeRequest`
  - Child 11 may align consumers and fix bugs, but must not add new shared routing families ad hoc.
- `RuntimeState`
  - Child 11 must use the approved carrier as-is and must not reopen `characterDefinitions` or broader carrier convergence.
- `Interactive Runtime` public contract
  - Child 11 must implement against the frozen launch/action/exit/result surface and must not invent side channels outside it.
- `House Runtime` request contract
  - Child 11 must implement against the frozen `enter` / `leave` / `dispatch` request surface and must not leak domain-layer request types back into the shared seam.
- `Effect Settlement` contract
  - Child 11 may align implementation and routing responsibilities, but must not widen effect families without a new settlement decision.

### 6.2 Soft-But-Constrained Surfaces

- `RuntimeResult`
  - Child 11 may perform additive normalization within the approved ownerization scope, but must not redesign unrelated runtime result shapes.
- `StateSync Runtime` supporting seams
  - Child 11 may consume or apply local compatibility fixes only if directly required by the covered path.

## 7. Scope

Child 11 includes exactly these implementation workstreams.

### 7.1 Shared Dispatch Convergence

Child 11 must reduce covered-path reliance on ad hoc shell orchestration by converging shared runtime entry and covered follow-up handling through:

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`

Minimum requirements:

- covered entry must prefer shared dispatch/router ownership over direct shell branching
- covered reentry/follow-up must not require pre-baseline ad hoc orchestration in `src/main.ts`
- Child 11 must implement against the existing Child 9 request/router language rather than widening it casually

### 7.2 Interactive Runtime Ownerization

Child 11 must move the covered interactive business lifecycle under runtime ownership through:

- `src/core/runtime/interactive-runtime.ts`
- `src/core/adapters/legacy-interactive-adapter.ts`
- covered interactive follow-up points in `src/main.ts`

Minimum requirements:

- launch, action, exit, and covered follow-up flow are runtime-owned for the approved interactive paths
- any retained interactive adapter is reduced to an explicitly justified thin shell
- application minigame and story-battle modules remain business implementations, not shared runtime boundary owners

### 7.3 House Runtime Ownerization

Child 11 must move the covered house session lifecycle under runtime ownership through:

- `src/core/runtime/house-runtime.ts`
- `src/core/adapters/legacy-house-adapter.ts`
- covered house follow-up points in `src/main.ts`

Minimum requirements:

- enter, dispatch, leave, and covered session follow-up flow are runtime-owned for the approved house paths
- any retained house adapter is reduced to an explicitly justified thin shell
- application house modules remain domain/business implementations, not shared runtime public-boundary owners

### 7.4 Settlement Alignment

Child 11 must align effect application with the approved runtime-owned path through:

- `src/core/runtime/runtime-settlement.ts`
- the minimum supporting touchpoints in shared dispatch/runtime follow-up code

Minimum requirements:

- covered shared/interactive/house flows emit and settle through the approved settlement seam
- settlement remains separate from feature routing ownership
- unsupported or deferred effect handling is explicit rather than accidental

## 8. Explicit In-Scope Files

### Primary Implementation Surface

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/interactive-runtime.ts`
- `src/core/runtime/house-runtime.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/adapters/legacy-interactive-adapter.ts`
- `src/core/adapters/legacy-house-adapter.ts`
- covered `src/main.ts` follow-up/orchestration points only
- `tests/robustness.test.cjs`

### Supporting But Not To Be Redesigned

- `src/core/contracts/**` within the frozen Child 9 surfaces
- `src/core/runtime/state-sync-*`
- `src/application/house/**`
- `src/application/minigames/**`
- `src/application/story-battle/**`

## 9. Out Of Scope

Child 11 does not include:

- `Boot Runtime` redesign
- `Mod Runtime` redesign
- `Save / Load Runtime` redesign
- `StateSync Runtime` redesign
- `Presentation Bridge Runtime` redesign
- UI/layout/presenter work
- resource loading or planning changes
- new gameplay-system invention
- house content expansion
- reopening `RuntimeState` carrier convergence
- inventing new top-level runtimes

## 10. Adapter Rules

Child 11 must follow the adapter disposition already frozen in Child 10.

### 10.1 Removal-Targeted Adapters

- `src/core/adapters/legacy-interactive-adapter.ts`
- `src/core/adapters/legacy-house-adapter.ts`

These should be removed or collapsed only if:

- the target runtime already owns the public request/result contract
- the covered entry path no longer depends on legacy-only `src/main.ts` branching
- the replacement seam stays inside Child 11 scope
- targeted regression coverage exists for the covered path

### 10.2 Adapters That Must Remain

- `src/core/adapters/legacy-main-adapter.ts`
- `src/core/adapters/mod-runtime-main-adapter.ts`

These remain outside Child 11 removal scope.

## 11. `src/main.ts` Reduction Rules

Child 11 may reduce only the covered runtime orchestration still held by `src/main.ts`.

### May Move Out Of `src/main.ts`

- covered shared runtime request entry/follow-up orchestration
- covered interactive follow-up handling
- covered house session follow-up handling

### Must Stay In `src/main.ts`

- browser DOM/event wiring
- boot/startup orchestration
- presenter output creation
- render invocation
- arbitrary browser-shell responsibilities unrelated to covered runtime ownership

## 12. Batch Sequence

Child 11 must execute in this order:

1. shared runtime entry convergence
2. interactive runtime ownerization
3. house runtime ownerization
4. settlement alignment and closeout

Child 11 must not reorder these batches unless the baseline, this spec, the Child 11 plan, and the weekly orchestration plan are all updated first.

## 13. Verification Requirements

Child 11 completion requires:

- shared dispatch/runtime routing regression checks
- one covered interactive launch/action/follow-up regression
- one covered house enter/action/leave regression
- one covered shared runtime reentry/follow-up regression
- one covered settlement regression
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans` for queue/governance sync batches

## 14. Acceptance Criteria

Child 11 is acceptable only if:

- covered shared runtime entry converges on dispatch/router ownership
- covered interactive flows are runtime-owned with any retained adapter reduced to an explicitly justified thin seam
- covered house flows are runtime-owned with any retained adapter reduced to an explicitly justified thin seam
- effect settlement is aligned with the approved shared runtime path
- direct `src/main.ts` orchestration is reduced for the covered paths
- Child 11 still respects the frozen Child 9 contract layer and Child 10 boundary rules
- Child 11 does not absorb boot/mod/save/presenter/UI/resource-planning work

## 15. Residual Debt Rules

The following residual debt may remain only if Child 11 records it explicitly in closeout:

- `legacy-main-adapter` for boot/startup shell handoff
- `mod-runtime-main-adapter` for startup continuation
- thin compatibility shells inside interactive/house areas where full removal would cross a frozen boundary
- deferred carrier convergence such as `characterDefinitions`

Residual debt is acceptable only if its boundary reason is explicit and it does not expand Child 11 scope.

## 16. Escalation Rules

Child 11 must stop and update the governing docs before continuing if a change would:

- reopen a frozen contract
- expand beyond the allowed file boundary
- require boot/mod/save/presenter redesign
- change the approved batch order
- widen effect families beyond the approved settlement contract

Required docs to update before continuing:

- `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- this spec
- the Child 11 plan
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

## 17. Done-Enough Exit Condition

Child 11 is done enough only when:

- the covered shared runtime path is runtime-owned rather than shell-owned
- the covered interactive path is runtime-owned rather than adapter-owned
- the covered house path is runtime-owned rather than adapter-owned
- settlement alignment is explicit on the covered path
- any retained compatibility shell is thin, justified, and documented
- verification passes

If those answers remain ambiguous, Child 11 is not complete.
