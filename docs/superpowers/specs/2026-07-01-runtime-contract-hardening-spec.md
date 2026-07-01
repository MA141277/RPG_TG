# Runtime Contract Hardening Spec

## 1. Goal

Define the formal `Child 9 Runtime Contract Hardening` boundary for the current mod-first engine/runtime roadmap.

Child 9 is a contract-hardening child, not a runtime-ownerization child. Its purpose is to close the minimum core interfaces that directly affect shared runtime convergence, so later sub-runtime ownerization can proceed on stable boundaries instead of continuing to widen ad hoc payloads and bridge-only routing.

## 2. Basic Information

- Child name: `Runtime Contract Hardening`
- Child index: `Child 9`
- One-line responsibility:
  - harden the minimum shared runtime contracts needed before sub-runtime ownerization
- Architecture position:
  - contract layer hardening between `Child 8 StateSync Runtime` and later sub-runtime ownerization
- Primary target areas:
  - typed `RuntimeRequest / Router` contract
  - formal `Interactive / Minigame Dispatch` contract
  - formal `Effect Settlement` contract
  - minimal `House Runtime Request` contract

## 3. Problem Statement

The current repository has enough runtime slices to support the mod-first direction at a structural level, but several core interfaces are still intentionally minimal:

- `src/core/contracts/runtime-request.ts` is still mostly a string-and-payload carrier.
- `src/core/runtime/runtime-router.ts` still treats routing as a thin function type instead of a hardened shared dispatch contract.
- `src/core/contracts/interactive-runtime.ts` only exposes minimum session/source identity and does not yet formalize launch, action, exit, and minigame dispatch as one stable runtime boundary.
- `src/core/contracts/effect.ts` and `src/core/runtime/runtime-settlement.ts` still reflect an early minimal effect path; the settlement contract and supported ownership boundaries are not yet explicit enough.
- `src/core/runtime/house-runtime.ts` is still a bridge wrapper over legacy house adapters, while its public request shape is still inherited from domain-layer `HouseModuleRequest`.

This creates three immediate risks:

1. shared runtime continues to depend on string branching and ad hoc payload carriage
2. bridge runtimes cannot become owners cleanly because their entry/exit/request language is still unstable
3. `src/main.ts` and adapter seams remain harder to shrink because the contract layer is not explicit enough

## 4. Child 9 Objective

Child 9 must formalize only the minimum contracts that directly unblock later ownerization.

Child 9 must not be expanded into:

- full runtime ownerization
- UI or layout renderer work
- resource planning
- content-pack redesign
- full house implementation redesign
- broader mod capability or sandboxing work

The output of Child 9 is a stable interface baseline. The output of Child 9 is not “all runtimes are complete.”

## 5. Scope

Child 9 includes exactly four contract workstreams.

### 5.1 Typed RuntimeRequest / Router Contract

Child 9 must harden the shared runtime entry language so core routing no longer depends on loosely typed string families.

Minimum requirements:

- `RuntimeRequest` must expose typed request families rather than one generic `payload?: Record<string, unknown>` path for all important runtime traffic.
- shared dispatch and router boundaries must route by typed request identity, not by downstream feature-specific string parsing.
- router input/output shape must remain small enough to keep `dispatchRuntimeRequest()` as the shared entry seam.
- Child 9 may keep compatibility unions during migration, but new shared-runtime-facing work must not add more ad hoc string payload paths.

### 5.2 Formal Interactive / Minigame Dispatch Contract

Child 9 must formalize the interactive runtime public interface so covered minigame and story-battle flows share one explicit dispatch language.

Minimum requirements:

- define launch / action / exit level request shapes for `Interactive Runtime`
- make `activity-qte`, `city-begging`, and `story-battle` converge on one formal dispatch envelope
- keep session identity, source identity, and result handoff explicit
- distinguish interactive dispatch contract from specific minigame business logic

Child 9 is allowed to keep legacy adapters under the formal contract during migration.

### 5.3 Formal Effect Settlement Contract

Child 9 must formalize the settlement-side contract so effect producers and effect application responsibilities are explicit.

Minimum requirements:

- formalize the settlement input/output contract, not only the `Effect` value union
- make it explicit which layer emits effects and which layer applies them
- keep effect settlement separate from task progression, event selection, scene ownership, interaction ownership, and save IO
- treat unsupported or deferred effect kinds as explicit contract decisions rather than silent behavior gaps

Child 9 does not need to make effect coverage feature-complete. It must make the ownership and entry contract explicit.

### 5.4 Minimal House Runtime Request Contract

Child 9 must formalize the minimum public request boundary for house runtime so later ownerization no longer depends directly on domain-layer module request types.

Minimum requirements:

- introduce a core-owned house runtime request contract
- separate `enter`, `leave`, and `dispatch current session request` semantics
- preserve compatibility with current legacy house adapter flow
- avoid exposing concrete house business behavior as shared runtime contract surface

Child 9 does not make `House Runtime` an owner yet. It only defines the minimum owner-ready request boundary.

## 6. Non-Goals

Child 9 does not include:

- ownerizing `Interactive Runtime`
- ownerizing `House Runtime`
- ownerizing navigation, scene, or event runtimes
- full bridge or adapter removal
- `src/main.ts` deep cleanup beyond what contract hardening directly requires
- layout renderer or presenter expansion
- resource loading or resource planning
- complete save/runtime auto-commit integration
- full `characterDefinitions` convergence into canonical runtime state

Those belong to later children after Child 9 closes.

## 7. Forward Applicability

This spec applies to:

- any new shared runtime request type
- any new router path added under `src/core/runtime`
- any changes to interactive/minigame dispatch entry
- any changes to effect emission or settlement ownership
- any changes to house runtime public request entry

Untouched legacy modules may remain temporarily. Once a covered boundary is modified, the changed boundary must align with this spec.

## 8. Core Constraints

### 8.1 Do Not Expand Child 9 Into Child 10

- Child 9 must stop at contract hardening.
- If a step requires adapter removal, runtime-owned business logic extraction, or deep ownerization, that work belongs to a later child.

### 8.2 Shared Runtime Contract First

- Shared runtime request and router hardening comes before interactive/house ownerization.
- New bridge removal work must not happen on top of unstable request types.

### 8.3 Compatibility Is Allowed, New Ad Hoc Growth Is Not

- compatibility unions and adapters are allowed during migration
- new long-term string-only request growth is not allowed
- new long-term bridge-only public seams are not allowed

### 8.4 Contracts Belong To Core

- contract ownership must live under `src/core/contracts`
- application or domain modules may implement or adapt, but must not define the shared runtime public boundary

### 8.5 Settlement Must Stay Separate

- effect settlement remains a shared runtime concern
- effect settlement must not absorb task runtime, event runtime, scene runtime, or interactive runtime ownership
- effect producers may emit; settlement applies

## 9. Child 9 Output

When Child 9 is complete, the repository should have:

- a typed shared `RuntimeRequest / Router` contract baseline
- a formal interactive/minigame dispatch contract baseline
- a formal effect settlement contract baseline
- a minimal core-owned house runtime request contract baseline
- updated plan/governance docs that make Child 10 ownerization work smaller and more mechanical

## 10. Acceptance Criteria

Child 9 is acceptable only if:

- shared runtime entry no longer depends only on broad string payload carriers for the covered paths
- interactive/minigame dispatch has a formal public contract instead of only implicit session bridging
- effect settlement ownership and I/O boundary are explicit
- house runtime public request entry is core-owned even if implementation still routes through adapters
- Child 9 scope does not absorb UI, resource, or runtime ownerization work
- Child 10 can use Child 9 outputs as a stable baseline instead of reopening contract design
