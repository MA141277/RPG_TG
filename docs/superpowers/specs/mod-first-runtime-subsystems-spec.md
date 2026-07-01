# Mod-First Runtime Subsystems Spec

## 1. Goal

This spec defines the target runtime subsystem decomposition for the mod-first engine/runtime extraction roadmap.

The target is to ensure child plans split work along stable runtime responsibilities instead of ad hoc feature buckets.

## 2. Scope

This spec applies to:

- `src/core/**`
- runtime-facing seams in `src/application/**`
- child plans under the mod-first engine/runtime extraction roadmap

This spec does not define concrete layout rendering details or scenario content format beyond the runtime boundary required to host them.

## 3. Core Runtime Flow

All runtime-facing systems should converge on this shape:

`request -> runtime routing -> subsystem handling -> effect settlement -> state update -> presenter output`

Rules:

- feature modules must not mutate shared top-level runtime state directly
- runtime subsystems should emit typed state transitions or typed effects
- effect settlement should remain centralized
- presenter output should remain downstream of runtime state

## 4. Runtime Subsystem Inventory

### 4.1 Boot Runtime

Owns:

- engine bootstrap
- selected mod resolution
- registry composition
- initial state construction

Must not own:

- feature-specific navigation policy
- concrete house/story/minigame internals

Primary seams:

- `src/core/engine/**`
- `src/core/registry/**`
- `src/core/mods/**`

### 4.2 Navigation Runtime

Owns:

- map/city/house/scene/view transitions
- navigation request validation
- runtime-side view-state switching

Must not own:

- dialogue sequencing
- direct UI rendering

Primary seams:

- `src/core/runtime/**`
- `src/application/navigation/**`

### 4.3 Event Runtime

Owns:

- event trigger evaluation
- event activation and exit
- external event callbacks entering runtime dispatch

Must not own:

- direct DOM concerns
- full mission/task ownership if handled by task runtime

Primary seams:

- `src/core/runtime/**`
- `src/application/events/**`
- `src/application/story/**`

### 4.4 Scene Runtime

Owns:

- scene progression
- action sequencing
- dialogue/narration/choice execution at runtime level

Must not own:

- wider event policy
- rendering implementation

Primary seams:

- `src/core/runtime/**`
- `src/application/scene/**`

### 4.5 Task Runtime

Naming rule:

- runtime-layer naming uses `Task`
- `Mission` is allowed only as content-layer or presentation-layer wording

Owns:

- task creation
- task advancement
- task completion/failure
- task state synchronization into shared runtime state
- signal-driven task progression

Must not own:

- scenario prose authoring
- direct boot-path branching
- event candidate selection or activation
- scene session state
- interaction session state
- time advancement
- task UI/presenter output

Primary seams:

- `src/core/runtime/task-runtime.ts`
- `src/core/contracts/task-runtime.ts`
- mission/task services in `src/application/**`

### 4.6 Interaction Runtime

Owns:

- standalone interaction session lifecycle
- minigame launch/exit contract
- story-battle launch/exit contract
- shared interaction session channel in runtime state

Must not own:

- house entry gating
- navigation ownership outside interaction lifecycle

Primary seams:

- `src/core/runtime/**`
- `src/application/interactive/**`
- adapters from `minigames` and `story-battle`

### 4.7 House Runtime

Owns:

- special-house session lifecycle
- coordination between house modules and shared runtime
- house-level entry/exit and session-state handoff

Relationship:

- house runtime is a domain subsystem built on top of shared runtime dispatch and, where appropriate, interaction runtime

Primary seams:

- `src/application/house/**`
- `src/application/house-modules/**`

### 4.8 Time Runtime

Owns:

- calendar advancement
- time-of-day changes
- tick-driven progression
- time-based runtime requests

Must not own:

- feature-specific side effects beyond typed effect emission

Primary seams:

- `src/core/runtime/**`
- `src/application/time/**`

### 4.9 Effect Settlement Runtime

Owns:

- centralized application of typed effects
- flag/variable/task/time/view/economy/inventory state updates from effect payloads

Must not own:

- feature-specific routing decisions before effects are emitted

Primary seams:

- `src/core/runtime/runtime-settlement.ts`

### 4.10 StateSync Runtime

Owns:

- reconciliation between subsystem output and shared runtime state
- preserving stable shared state boundaries
- isolating mod-owned payload
- canonical runtime-state authority
- runtime/app/save/presentation synchronization
- trigger-based hydration, normalization, reconstruction, and pre-save preparation

Relationship:

- this was partially implicit during early extraction
- Child 8 formalizes this as `StateSync Runtime`
- it is a state-boundary runtime, not gameplay dispatch, save IO, mod activation, or presentation ownership

### 4.11 Save / Load Runtime

Owns:

- save envelope
- load path
- migration hooks
- selected mod id persistence
- mod-owned payload round-trip

Must not own:

- unrelated feature policy

Primary seams:

- `src/core/save/**`

### 4.12 Presentation Bridge Runtime

Owns:

- transforming runtime state into presenter-facing output
- supplying schema-driven view data to UI rendering

Must not own:

- direct DOM mutation
- gameplay state mutation

Primary seams:

- `src/application/presenter/**`
- `src/ui/layout-renderer.ts`

### 4.13 Mod Runtime

Owns:

- mod source discovery
- mod loading and parsing
- mod selection
- dependency/conflict validation
- capability validation
- activation handoff for startup and restore-time flows
- normalized active-mod output for downstream bootstrap

Must not own:

- final content assembly
- app-state construction
- save/load IO
- gameplay runtime execution
- UI/menu/loading-screen implementation

Primary seams:

- `src/core/contracts/mod-runtime.ts`
- `src/core/mods/**`
- `src/core/adapters/mod-runtime-main-adapter.ts`

## 5. Subsystem State Ownership

Shared core runtime state should distinguish at least:

- engine state
- runtime state
- mod-owned state payload

Runtime state should gradually expose typed slots for:

- navigation/view
- active event/scene
- task/mission progress
- interactive session
- calendar/time
- flags/variables

Persistent gameplay changes must flow back through unified runtime structures or typed effect settlement.

## 6. Child Plan Boundary Mapping

### Child 1: `2026-06-29-engine-runtime-boundary-plan.md`

Primary subsystem coverage:

- Boot Runtime
- Effect Settlement Runtime
- StateSync Runtime
- Save / Load Runtime (first seam only)

### Child 2: `2026-06-29-save-migration-hardening-plan.md`

Primary subsystem coverage:

- Save / Load Runtime
- StateSync Runtime

Secondary dependency:

- Boot Runtime state boundary established by Child 1
- minimal `SaveEnvelope` seam established by Child 1

### Child 3: `2026-06-29-navigation-time-event-runtime-extraction-plan.md`

Primary subsystem coverage:

- Navigation Runtime
- Time Runtime
- Event Runtime
- Scene Runtime handoff seam where required

Secondary dependency:

- Effect Settlement Runtime from Child 1
- Save / Load Runtime stability from Child 2 unless parent orchestration explicitly waives it

Scope guard:

- Child 3 may reserve task action and task signal seams
- Child 3 must not claim the full `Task Runtime`

### Child 4: `2026-06-29-interactive-runtime-integration-under-core-plan.md`

Primary subsystem coverage:

- Interaction Runtime
- House Runtime integration seam where house-owned interactions delegate into shared runtime

Secondary dependency:

- Navigation Runtime and Event Runtime from Child 3

### Child 5: `2026-06-29-presenter-render-decoupling-plan.md`

Primary subsystem coverage:

- Presentation Bridge Runtime

Secondary dependency:

- Navigation Runtime and Interaction Runtime outputs stable enough to present

### Child 6: `2026-06-30-task-runtime-plan.md`

Primary subsystem coverage:

- Task Runtime

Secondary dependency:

- Child 3 task action / task signal seams
- Child 4 shared `RuntimeState` / `RuntimeResult` carrier
- Child 5 completed before Child 6 started production code
- Child 6 completed the first formal Task Runtime contract/lifecycle/progression seam

### Child 7: `2026-06-30-mod-runtime-plan.md`

Primary subsystem coverage:

- Mod Runtime

Secondary dependency:

- Boot Runtime seams from Child 1
- Save / Load Runtime compatibility from Child 2
- Child 5 and Child 6 are completed; Child 7 is completed on the first Mod Runtime activation/startup seam

### Child 8: `2026-06-30-state-sync-runtime-plan.md`

Primary subsystem coverage:

- StateSync Runtime

Secondary dependency:

- Save / Load Runtime compatibility from Child 2
- Child 4 minimum `RuntimeState` / `RuntimeResult` carrier
- Child 5, Child 6, and Child 7 are completed; Child 8 is completed on the first formal StateSync Runtime canonical boundary

### Child 9: `2026-07-01-runtime-contract-hardening-plan.md`

Primary subsystem coverage:

- Shared Runtime contract layer
- Runtime Dispatch / Router contract seam
- Interaction Runtime public dispatch contract seam
- Effect Settlement Runtime contract seam
- House Runtime public request seam

Secondary dependency:

- Child 4 bridge-period Interaction Runtime and House Runtime seams already exist
- Child 8 canonical StateSync boundary is completed
- Child 9 hardens contracts only; it does not claim runtime ownerization

Scope guard:

- Child 9 may harden shared request/router typing and public dispatch contracts
- Child 9 must not absorb Interactive Runtime ownerization, House Runtime ownerization, UI/layout work, or resource planning

### Child 10: `2026-07-01-runtime-ownerization-review-plan.md`

Primary subsystem coverage:

- Runtime ownerization review / baseline governance
- Current runtime owner vs bridge classification
- Child 11 execution boundary freeze surface

Secondary dependency:

- Child 9 contract hardening baseline is authored first
- Child 10 does not ownerize production runtime code; it records the execution baseline for later ownerization

Scope guard:

- Child 10 may classify current runtime maturity, bridge/adapter disposition, and `src/main.ts` coupling
- Child 10 may define Child 11 batch order, forbidden changes, verification mapping, and unlock rules
- Child 10 must not absorb adapter removal in production code, UI/layout work, or resource planning

### Child 11: `reserved ownerization child`

Primary subsystem coverage:

- Shared dispatch convergence for covered paths
- Interaction Runtime ownerization
- House Runtime ownerization
- Effect Settlement Runtime alignment along the approved shared path

Secondary dependency:

- Child 10 baseline must be complete
- Child 11 spec and plan must be authored against the Child 10 baseline before code work starts

Scope guard:

- Child 11 may ownerize only the seams explicitly approved by the Child 10 baseline
- Child 11 must not reopen `RuntimeState` carrier convergence, boot/content assembly, Mod Runtime, Save / Load Runtime, StateSync Runtime, Presentation Bridge Runtime, UI/layout work, or resource planning without a new baseline revision

## 7. Planning Rules For Future Child Plans

When authoring a new child plan:

- state which runtime subsystems it primarily owns
- state which runtime subsystems it depends on
- state which runtime subsystems it must not redesign
- avoid mixing more than one primary subsystem family unless the child plan exists to define their interface seam

## 8. Acceptance Implication

No child plan should be marked complete if it achieves local refactoring but leaves its mapped runtime subsystem without:

- a clear owner
- a stable entry seam
- a stable verification path
- a documented relationship to the surrounding runtime pipeline
