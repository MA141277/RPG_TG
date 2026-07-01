# Runtime Ownerization Baseline

> **Purpose:** This document is the Child 10 execution baseline for unlocking `Child 11 Sub-Runtime Ownerization Implementation`. Child 11 must not start production code until this baseline is finalized and referenced by the Child 11 spec and plan.

**Date:** `2026-07-01`

**Baseline Title:** `Child 10 Runtime Ownerization Review And Baseline`

**Unlocks:** `Child 11 Sub-Runtime Ownerization Implementation`

**Related Child 10 Spec:** `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`

**Related Child 10 Plan:** `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`

**Related Weekly Plan:** `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

**Related Runtime Authority:** `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`

**Related Consistency Matrix:** `docs/superpowers/specs/2026-07-01-child-9-10-11-queue-consistency-matrix.md`

## 1. Goal

This baseline exists because the repository already has enough runtime names and first-slice seams to support the current mod-first direction, but it does not yet have one frozen, implementation-safe answer for runtime ownership.

Child 11 must therefore not decide these questions while coding:

- which runtimes are already formal owners
- which runtimes are still bridge-period seams
- which adapters must be removed
- which adapters must remain temporarily
- which `src/main.ts` responsibilities move into runtime owners
- which adjacent concerns stay frozen

This document defines that execution baseline so Child 11 can be controlled, bounded, and reviewable.

## 2. Baseline Scope

### In Scope

- runtime maturity classification
- owner vs bridge/adapter classification
- contract freeze surface for Child 11
- bridge/adapter disposition decisions
- `src/main.ts` coupling audit
- Child 11 execution boundary
- Child 11 batch order and exit gates
- Child 11 verification mapping
- Child 11 accepted residual debt
- Child 11 unlock rule

### Out Of Scope

- production runtime ownerization
- new top-level runtime invention
- UI redesign, layout renderer work, or resource planning
- boot/content assembly redesign
- new gameplay systems
- house content expansion
- mod tooling expansion

## 3. Runtime Classification Criteria

Use these labels consistently throughout this baseline:

- `formal-owner`
  - production entry is owned by the runtime boundary and no compatibility bridge is required for the claimed path
- `owner-first-slice`
  - a formal runtime boundary exists and owns at least one stable slice, but adjacent production paths still remain outside that owner
- `partial-owner`
  - the runtime has a formal seam, but production entry still depends on mixed orchestration or compatibility behavior
- `bridge`
  - the runtime seam exists mainly to forward into legacy implementation and is not yet the stable production owner
- `adapter-only`
  - the seam exists only as compatibility glue and should not be treated as an owner

## 4. Current Runtime Inventory

| Runtime / Boundary | Maturity | Formal Owner Today | Bridge / Adapter Dependence | Child 11 Relevance | Notes |
| --- | --- | --- | --- | --- | --- |
| `Boot Runtime` | `partial-owner` | `src/core/engine/**` | `legacy-main-adapter` still fronts production boot handoff | `no by default` | Keep Child 11 out of boot/content assembly unless the baseline is revised first. |
| `Navigation Runtime` | `partial-owner` | `src/core/runtime/navigation-runtime.ts` | some entry still depends on mixed orchestration | `no` | Not a primary Child 11 target. |
| `Time Runtime` | `partial-owner` | `src/core/runtime/time-runtime.ts` | same mixed-entry pattern as navigation | `no` | Not a primary Child 11 target. |
| `Event Runtime` | `partial-owner` | `src/core/runtime/event-runtime.ts` | still cooperates with mixed flow control | `no` | Keep outside Child 11 unless required by approved dispatch follow-up. |
| `Scene Runtime` | `partial-owner` | `src/core/runtime/scene-runtime.ts` | handoff seam exists, but full production ownership is not centralized | `no` | Avoid expanding Child 11 into scene redesign. |
| `Interaction Runtime` | `bridge` | `src/core/runtime/interactive-runtime.ts` owns the public seam but not the full business lifecycle | `legacy-interactive-adapter` and application interactive modules still carry major behavior | `yes` | One of the two main Child 11 ownerization targets. |
| `House Runtime` | `bridge` | `src/core/runtime/house-runtime.ts` owns the public seam but not the full business lifecycle | `legacy-house-adapter` and `application/house/house-runtime.ts` still carry major behavior | `yes` | One of the two main Child 11 ownerization targets. |
| `Task Runtime` | `owner-first-slice` | `src/core/runtime/task-runtime.ts` | compatibility exists but no major bridge bottleneck blocks Child 11 | `no` | Freeze unless Child 11 proves a direct dependency. |
| `Effect Settlement Runtime` | `owner-first-slice` | `src/core/runtime/runtime-settlement.ts` | contract/implementation alignment still incomplete | `yes` | Child 11 may refine only the settlement path needed by shared dispatch and runtime ownerization. |
| `StateSync Runtime` | `owner-first-slice` | `src/core/runtime/state-sync-*` | deeper integration remains deferred | `supporting-only` | Child 11 may consume but must not redesign StateSync. |
| `Save / Load Runtime` | `owner-first-slice` | `src/core/save/**` | consumer-side legacy remains in places | `no` | Outside Child 11. |
| `Presentation Bridge Runtime` | `owner-first-slice` | `src/application/presenter/**` | presenter/render handoff still intentionally bridge-shaped | `no` | Keep outside Child 11. |
| `Mod Runtime` | `owner-first-slice` | `src/core/mods/**` | startup compatibility still exists | `no` | Keep outside Child 11. |

## 5. Current Formal Owner vs Bridge Summary

### Already Formal Enough To Treat As Owners For Child 11

- `Task Runtime`
- `StateSync Runtime`
- `Save / Load Runtime`
- `Presentation Bridge Runtime`
- `Mod Runtime`

### Still Reviewable But Not Child 11 Primary Targets

- `Boot Runtime`
- `Navigation Runtime`
- `Time Runtime`
- `Event Runtime`
- `Scene Runtime`

### Child 11 Primary Ownerization Targets

- `Interaction Runtime`
- `House Runtime`
- `Effect Settlement Runtime` alignment along the shared runtime path

## 6. Current Core Contract Inventory

| Contract Surface | Current Status | Child 11 Freeze Level | Child 11 Allowed Change | Child 11 Not Allowed To Reopen |
| --- | --- | --- | --- | --- |
| `RuntimeRequest` | `hardened-minimum after Child 9` | `hard` | consumer alignment and bugfix-level corrections | adding new routing families ad hoc |
| `RuntimeResult` | `shared but still additive-friendly` | `soft` | additive follow-up normalization within approved scope | broad result redesign across unrelated runtimes |
| `RuntimeState` | `bridge-period carrier by design` | `hard` | use as approved by current carrier policy | reopening `characterDefinitions` or core-carrier convergence |
| `Interactive Runtime` contract | `ownerization-ready minimum` | `hard` | implement against the frozen request/result surface | inventing new side channels outside the contract |
| `House Runtime` request contract | `ownerization-ready minimum` | `hard` | implement against the frozen request/result surface | leaking domain request types back into the shared seam |
| `Effect Settlement` contract | `ownerization-supporting minimum` | `hard` | align implementation and routing responsibilities | expanding effect families without a new settlement decision |
| `Task Runtime` contract | `stable first slice` | `hard` | none by default | widening task scope as part of Child 11 |
| `StateSync Runtime` contract | `stable first slice` | `soft` | local compatibility fixes only if directly required | redesigning canonical authority or sync policy |

## 7. Bridge / Adapter Inventory

| Bridge / Adapter | Type | Current Role | Disposition For Child 11 | Reason |
| --- | --- | --- | --- | --- |
| `src/core/adapters/legacy-main-adapter.ts` | `adapter` | boot handoff from `src/main.ts` into core boot/runtime startup | `keep-through-Child-11` | Child 11 must not absorb boot/content assembly redesign. |
| `src/core/adapters/mod-runtime-main-adapter.ts` | `adapter` | compatibility seam between Mod Runtime activation and startup continuation | `keep-through-Child-11` | Not part of Child 11 runtime ownerization scope. |
| `src/core/adapters/legacy-interactive-adapter.ts` | `adapter` | compatibility seam from core interactive runtime into legacy minigame/story-battle implementation | `target-remove-or-thin` | Child 11 should reduce this seam to owner-owned dispatch, or leave only a thin compatibility shell explicitly justified in the closeout. |
| `src/core/adapters/legacy-house-adapter.ts` | `adapter` | compatibility seam from core house runtime into legacy house implementation | `target-remove-or-thin` | Child 11 should reduce this seam to owner-owned house lifecycle, or leave only a thin compatibility shell explicitly justified in the closeout. |

## 8. Adapter Disposition Criteria

Child 11 may remove or collapse an adapter only if all of these are true:

- the target runtime already owns the public request/result contract
- covered entry paths no longer require legacy-only branching in `src/main.ts`
- the replacement seam remains inside approved Child 11 scope
- targeted regression coverage exists for the covered flow

Child 11 must keep an adapter through closeout if any of these remain true:

- boot/content assembly would become coupled into runtime ownerization
- the remaining legacy behavior is outside Child 11 scope
- removing the adapter would require reopening a frozen contract or adjacent subsystem boundary

## 9. Current `src/main.ts` Coupling Audit

| Coupling Area | Current Role | Child 11 Decision | Reason |
| --- | --- | --- | --- |
| browser DOM/event wiring | browser shell | `remain in shell` | Not runtime ownership. |
| boot/startup orchestration | shell + boot adapter handoff | `remain outside Child 11` | Avoid boot/content assembly expansion. |
| shared runtime request entry | mixed shell/runtime coordination | `move further into shared dispatch` | Child 11 should reduce direct orchestration for claimed runtime paths. |
| interactive follow-up handling | shell + bridge-period logic | `move into runtime-owned follow-up where covered` | A primary Child 11 target. |
| house session follow-up handling | shell + bridge-period logic | `move into runtime-owned follow-up where covered` | A primary Child 11 target. |
| presenter output creation | shell -> presenter seam | `remain outside Child 11` | Presentation already has its own bridge/runtime boundary. |
| render invocation | browser shell | `remain in shell` | Not runtime ownership. |

## 10. Child 11 Objective

Child 11 exists to ownerize the already-defined sub-runtime seams that still depend on bridge-period compatibility.

Child 11 is not allowed to reinterpret its own goal as "finish the whole runtime architecture." Its role is narrower:

- converge more runtime entry on shared dispatch/router
- ownerize interactive session/request/follow-up flow
- ownerize house session/request/follow-up flow
- align effect settlement with the approved runtime path
- reduce direct `src/main.ts` orchestration for the covered paths

## 11. Child 11 Execution Boundary

### In Scope

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/interactive-runtime.ts`
- `src/core/runtime/house-runtime.ts`
- `src/core/runtime/runtime-settlement.ts`
- the minimum supporting adapter files directly tied to interactive/house ownerization
- tests that cover the affected runtime paths

### Supporting But Not To Be Redesigned

- `src/core/contracts/**` within the frozen Child 9 surfaces
- `src/core/runtime/state-sync-*`
- `src/application/house/**`
- `src/application/minigames/**`
- `src/application/story-battle/**`

### Out Of Scope

- `src/core/engine/**`
- `src/core/mods/**`
- `src/core/save/**`
- `src/application/presenter/**`
- `src/ui/**`
- resource planning and loading policy

## 12. Child 11 Required Reading Set

Child 11 must read these files before implementation starts:

- `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`
- `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
- `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Child 11 spec and plan once authored

## 13. Child 11 Batch Order

| Batch | Goal | Allowed Focus | Exit Gate |
| --- | --- | --- | --- |
| `1` | shared runtime entry convergence | `runtime-dispatch`, `runtime-router`, covered request follow-up routing | covered runtime paths stop relying on pre-baseline ad hoc shell orchestration |
| `2` | interactive runtime ownerization | `interactive-runtime`, `legacy-interactive-adapter`, covered interactive follow-up flow | covered interactive flows are runtime-owned and any retained adapter is thin and explicit |
| `3` | house runtime ownerization | `house-runtime`, `legacy-house-adapter`, covered house follow-up flow | covered house flows are runtime-owned and any retained adapter is thin and explicit |
| `4` | settlement + closeout alignment | `runtime-settlement`, supporting dispatch/state-sync touchpoints only | effect settlement alignment is explicit and Child 11 closeout clearly records retained debt |

## 14. Child 11 Forbidden Changes

Child 11 must not:

- invent new top-level runtimes
- reopen `RuntimeState` carrier convergence
- move `characterDefinitions` into `RuntimeState.core`
- redesign Boot Runtime, Mod Runtime, Save / Load Runtime, StateSync Runtime, or Presentation Bridge Runtime
- absorb UI/layout/resource planning work
- widen effect families beyond the approved settlement contract
- redesign house business content instead of ownerizing the runtime seam
- move arbitrary browser shell responsibilities into runtime code

## 15. Child 11 Decision Escalation Rule

If Child 11 encounters a change that would:

- reopen a frozen contract
- expand beyond the allowed file boundary
- require boot/mod/save/presenter redesign
- change the approved batch order

then Child 11 must stop and update all of the following before continuing:

- this baseline
- Child 11 spec
- Child 11 plan
- weekly orchestration plan

## 16. Child 11 Plan Backfill Rule

Child 11 must not start code work with only weekly queue wording.

Before Child 11 starts:

- Child 10 baseline must be finalized
- Child 11 spec must be authored against this baseline
- Child 11 plan must be authored against this baseline
- the weekly plan must explicitly mark Child 11 as unlocked

## 17. Child 11 Verification Mapping

Minimum verification expected from Child 11:

- shared dispatch/runtime routing regression tests
- covered interactive flow regression tests
- covered house flow regression tests
- effect settlement regression tests for the covered path
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans` for queue/governance sync batches

## 18. Child 11 Reference Example Flows

Child 11 verification and closeout should explicitly reference:

- one covered interactive launch/action/follow-up flow
- one covered house enter/action/leave flow
- one shared runtime reentry/follow-up flow

## 19. Child 11 Accepted Residual Debt

The following may remain after Child 11 if explicitly recorded in closeout:

- `legacy-main-adapter` for boot/startup shell handoff
- `mod-runtime-main-adapter` for startup continuation
- thin compatibility shells inside interactive/house areas where full removal would cross frozen boundaries
- deferred carrier convergence such as `characterDefinitions`

These residual items are accepted only if Child 11 documents why they remain outside scope.

## 20. Child 11 Risk / Blocker Rules

- `P0`
  - queue unlock contradiction, broken covered runtime path, or ownerization that leaves no valid replacement for a removed adapter
- `P1`
  - boundary drift into boot/mod/save/presenter/UI/resource scope, or reopening frozen contracts without baseline revision
- `P2`
  - optional compatibility cleanup or naming cleanup outside the covered ownerization seam

`P0` or `P1` blocks Child 11 completion.

## 21. Required Weekly Artifact Sync

Child 10 closeout and Child 11 unlock must review and, when needed, update:

- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

## 22. Unlock Rule

Child 11 is unlocked only when all of the following are true:

- [ ] runtime maturity classification is finalized
- [ ] formal owner vs bridge status is explicit
- [ ] bridge/adapter disposition is explicit
- [ ] `src/main.ts` coupling audit is explicit
- [ ] Child 11 execution boundary is explicit
- [ ] Child 11 batch order and exit gates are explicit
- [ ] Child 11 forbidden changes are explicit
- [ ] Child 11 verification mapping is explicit
- [ ] Child 11 accepted residual debt is explicit
- [ ] weekly plan records Child 10 complete and Child 11 unlocked
- [ ] Child 11 spec and plan are authored against this baseline

## 23. Done-Enough Exit Condition

Child 10 is done enough to unlock Child 11 only when:

- this baseline can answer "who owns this runtime path today" without ambiguity
- this baseline can answer "which adapters must remain" without ambiguity
- this baseline can answer "what Child 11 may not touch" without ambiguity
- this baseline can answer "what Child 11 does first, second, third, and fourth" without ambiguity

If any of those answers remain open-ended, Child 10 is not complete.

## 24. Verification Record

- `Not run as part of this doc-only governance change`

## 25. Completion Checklist

- [ ] Runtime classification criteria finalized
- [ ] Runtime inventory finalized
- [ ] Owner vs bridge summary finalized
- [ ] Contract freeze surface finalized
- [ ] Bridge/adapter inventory finalized
- [ ] `src/main.ts` coupling audit finalized
- [ ] Child 11 execution boundary finalized
- [ ] Child 11 batch order finalized
- [ ] Child 11 forbidden changes finalized
- [ ] Child 11 verification mapping finalized
- [ ] Child 11 residual debt list finalized
- [ ] Unlock checklist completed
- [ ] Weekly artifact sync completed
