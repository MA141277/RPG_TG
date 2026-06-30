# StateSync Runtime Spec

## 1. Goal

Define the formal `StateSync Runtime` boundary for the mod-first engine/runtime architecture.

`StateSync Runtime` is responsible for synchronization, normalization, hydration, reconstruction, and write-back coordination between runtime, app, save, and presentation state layers. It is a state-boundary runtime. It is not a gameplay runtime and not a global dispatcher.

## 2. Basic Information

- Runtime name: `StateSync Runtime`
- Chinese name: `统一状态同步运行时`
- One-line responsibility:
  - synchronize, normalize, rebuild, and write back state across `runtime / app / save / presentation`
- Architecture position:
  - state-boundary runtime
  - not gameplay runtime
  - not global scheduler

## 3. Problem Statement

The current project has several implicit state bridges:

- `src/main.ts` creates `RuntimeState` from `AppState` through ad hoc bridge helpers.
- `src/main.ts` writes runtime results back into `AppState` directly after interactive runtime paths.
- Save/load hardening exists, but load restoration is not yet routed through a formal hydrate/sync path.
- Presentation still consumes app/runtime state through transitional ownership until Child 5 lands presenter output.
- The current `RuntimeState` shape in `src/core/contracts/runtime-state.ts` is still a minimum carrier over application-layer `GameState` plus selected app fields.
- `src/core/contracts/core-state.ts` also contains a different `RuntimeState` meaning, which creates source-of-truth ambiguity.

Without a formal `StateSync Runtime`, mod-first work has these risks:

- new runtimes may define private app/runtime/save bridges
- `AppState` may become the long-term business truth by accident
- save snapshot shape may be treated as live runtime state
- presentation inputs may become a hidden source of gameplay truth
- `src/main.ts` may keep accumulating feature-specific sync branches
- mod-defined state may end up in host-shell fields instead of a stable extension slot

## 4. Objectives

Child 8 must define:

- a single canonical top-level runtime state model
- explicit source-of-truth rules for runtime, app, save, and presentation state
- trigger-based sync entrypoints
- a minimal public `StateSyncRuntime` interface
- a forward-only applicability policy for future modules and modified legacy modules
- a legacy handling policy
- `src/main.ts` migration boundaries
- mod-first state extensibility through canonical slices and module extension slots

## 5. Non-Goals

`StateSync Runtime` does not own:

- task progression
- event trigger evaluation
- story or narrative progression decisions
- UI rendering or layout
- save file IO
- mod content parsing or registration
- global runtime dispatch
- feature-specific gameplay logic
- effect settlement policy

## 6. Forward Applicability

This spec applies to:

- future runtime-facing modules
- existing runtime/module work when that module is later modified, refactored, or extended
- any work that changes canonical state shape
- any work that changes runtime/app bridge shape
- any work that changes save mapping
- any work that changes presentation input shape
- any work that introduces mod-state integration

This spec does not retroactively require already completed or untouched historical children, modules, or plans to be rewritten immediately.

## 7. Legacy Module Policy

- Untouched legacy modules may remain temporarily.
- Legacy state-bridge patterns are compatibility debt, not the target architecture.
- Once a legacy module is modified, refactored, or extended, its new or changed state boundary must align with `StateSync Runtime`.
- Compatibility periods are allowed.
- New long-term dependencies on legacy state boundaries are not allowed.

## 8. Core Constraints

### 8.1 Single Canonical Runtime State

- The project may have only one canonical top-level runtime state.
- The project must not keep two different top-level structures that both mean `RuntimeState`.
- Legacy runtime shapes must be renamed explicitly.
- `CanonicalRuntimeState` is the target top-level business/runtime authority.

### 8.2 RuntimeState Is Business Truth

- Gameplay and business progression authority belongs to canonical runtime state.
- `AppState` must not be the long-term business truth.
- Formal subsystem results must eventually write back to canonical runtime state.

### 8.3 AppState Is Shell/UI/Session State

- `AppState` may carry UI, host, session, and transient interaction state.
- `AppState` must not evolve into the canonical gameplay container.
- Any bridge-period business-adjacent fields in `AppState` must be marked as bridge-period compatibility state.

### 8.4 SaveState Is Snapshot State

- Save shape is a persistence snapshot.
- Save shape is not live runtime shape.
- Load restore must pass through formal hydrate/sync behavior.

### 8.5 StateSync Runtime Only Syncs And Rebuilds

`StateSync Runtime` owns:

- synchronization
- normalization
- hydration
- reconstruction
- write-back coordination
- consistency validation

It does not own gameplay orchestration, task/event/story decisions, presentation behavior, or save IO.

### 8.6 Dependency Direction Cannot Reverse

- Runtime contracts must not be defined by `Pick<AppState>` or other host-shell-derived structures.
- App, save, and presentation layers should depend on canonical runtime state.
- Runtime contracts must not depend on host shell state.

### 8.7 Trigger-Based Entry

State sync must use explicit triggers.

Mandatory triggers:

- `boot`
- `load`
- `runtime-commit`
- `mod-activated`
- `session-rebuild`
- `pre-save`

Feature-specific ad hoc sync branches are not allowed as new long-term architecture.

### 8.8 No New State Bridge Branches In main.ts

- New feature-specific sync logic must not be added to `src/main.ts`.
- Child 8 must move the architecture toward extracting current bridge responsibilities from `src/main.ts`.

## 9. Source-Of-Truth Rules

### CanonicalRuntimeState

`CanonicalRuntimeState` is the authoritative business/runtime state.

It owns:

- core gameplay state
- task state
- event state
- narrative/story runtime state
- world state
- interactive runtime state
- registered module state
- mod-defined extension state

### AppState

`AppState` is shell, UI, session, and transient host state.

It owns:

- UI shell state
- browser/session state
- temporary interaction overlays
- host-only app services

It must not be the long-term gameplay truth.

### SaveState

`SaveState` is a persistence snapshot.

It owns:

- version
- timestamp
- persisted runtime snapshot
- persistence metadata

It must not be used as live runtime state.

### PresentationInput

`PresentationInput` is downstream projection input.

It owns:

- stable input to presenter/view code
- runtime and app bridge data needed to present the current state

It must not mutate or define gameplay authority.

## 10. Minimal Top-Level Data Structures

Child 8 freezes the top-level authority shape before slice details are finalized. The first implementation may use explicit bridge-period slice aliases for runtimes that do not yet expose final state contracts. Those aliases must be local, exported, and replaceable by concrete child runtime contracts when those contracts land.

```ts
export type CoreRuntimeState = Record<string, unknown>;
export type TaskRuntimeState = Record<string, unknown>;
export type EventRuntimeState = Record<string, unknown>;
export type NarrativeRuntimeState = Record<string, unknown>;
export type WorldRuntimeState = Record<string, unknown>;
export type InteractiveRuntimeState = Record<string, unknown>;
export type UIState = Record<string, unknown>;
export type SessionState = Record<string, unknown>;

export type CanonicalRuntimeState = {
  core: CoreRuntimeState;
  tasks: TaskRuntimeState;
  events: EventRuntimeState;
  narrative: NarrativeRuntimeState;
  world: WorldRuntimeState;
  interactive: InteractiveRuntimeState;
  modules: Record<string, unknown>;
};

export type AppStateBridge = {
  ui: UIState;
  session: SessionState;
  view: Record<string, unknown>;
};

export type SaveState = {
  version: string;
  timestamp: number;
  runtime: Partial<CanonicalRuntimeState>;
  meta?: Record<string, unknown>;
};

export type PresentationInput = {
  runtime: CanonicalRuntimeState;
  app: AppStateBridge;
};

export type StateSyncTrigger =
  | { type: "boot" }
  | { type: "load" }
  | { type: "runtime-commit"; source: string }
  | { type: "mod-activated"; modId: string }
  | { type: "session-rebuild" }
  | { type: "pre-save" };

export type StateSyncResult = {
  runtimeState: CanonicalRuntimeState;
  appState?: AppStateBridge;
  saveState?: SaveState;
  warnings: string[];
};
```

Rules:

- the top-level canonical shape must be explicit
- legacy runtime shape must be separately named
- slice details may evolve later
- top-level authority must not be deferred

## 11. Runtime Interface

The public interface must stay small:

```ts
export interface StateSyncRuntime {
  sync(
    trigger: StateSyncTrigger,
    context: StateSyncContext
  ): StateSyncResult;
}
```

Optional internal helpers:

- `hydrateFromSave(...)`
- `normalizeRuntimeState(...)`
- `syncAppState(...)`
- `prepareSaveState(...)`
- `rebuildAfterModActivation(...)`
- `validateConsistency(...)`

Rules:

- public API must remain small and stable
- internal helpers may split by responsibility
- feature-specific one-off public entrypoints are not allowed

## 12. Runtime Collaboration Boundaries

### Shared Runtime

- Shared Runtime owns runtime dispatch and orchestration.
- `StateSync Runtime` does not become a dispatcher.
- Shared Runtime may call `StateSync Runtime` after runtime commits.

### Save / Load Runtime

- Save / Load Runtime owns IO, envelope read/write, and migration entry.
- `StateSync Runtime` owns hydrate, normalize, rebuild, and prepare-save mapping.

### Task Runtime

- Task Runtime owns task lifecycle and progression.
- `StateSync Runtime` only aligns task state across canonical runtime, app bridge, save snapshot, and presentation input.

### Event Runtime

- Event Runtime owns event trigger and execution logic.
- `StateSync Runtime` only synchronizes resulting state.

### Presentation Runtime

- Presentation Runtime owns UI/view projection.
- `StateSync Runtime` provides stable input sources.

### Mod Runtime

- Mod Runtime owns mod load, activation, registration, and activation handoff.
- `StateSync Runtime` owns state completion and reconstruction after mod activation.

## 13. Trigger Semantics

### boot

- Caller: boot/runtime startup path
- Minimum input: initial runtime seed and app/session seed
- Expected output: normalized `CanonicalRuntimeState` and optional `AppStateBridge`
- Warning/error:
  - missing optional module state may produce warning
  - missing required canonical slices is hard error

### load

- Caller: Save / Load Runtime consumer after save envelope read/migration
- Minimum input: `SaveState`
- Expected output: hydrated `CanonicalRuntimeState` and app/session bridge
- Warning/error:
  - missing recoverable optional fields may produce warning
  - invalid save/runtime bridge output is hard error

### runtime-commit

- Caller: Shared Runtime after a runtime result is committed
- Minimum input: current canonical runtime and runtime result state
- Expected output: normalized canonical runtime and optional app bridge update
- Warning/error:
  - ignored optional presentation bridge fields may warn
  - invalid canonical structure is hard error

### mod-activated

- Caller: Mod Runtime after successful activation handoff
- Minimum input: activated mod id and registered mod state seed
- Expected output: rebuilt canonical runtime with mod extension state initialized
- Warning/error:
  - missing optional mod state may warn
  - failed mod activation rebuild must not be silent

### session-rebuild

- Caller: host shell when transient app/session state must be reconstructed
- Minimum input: canonical runtime and app bridge seed
- Expected output: stable `AppStateBridge`
- Warning/error:
  - recoverable missing transient view data may warn
  - missing canonical runtime is hard error

### pre-save

- Caller: save command path before Save / Load Runtime writes
- Minimum input: canonical runtime and persistence metadata
- Expected output: `SaveState`
- Warning/error:
  - missing optional metadata may warn
  - snapshot that violates save contract is hard error

## 14. Mod-First Extensibility

`StateSync Runtime` must support:

- new sub-runtime slices
- mod-defined state
- future task/event/story-battle/minigame integration
- content-pack-driven default state
- canonical slices for general runtime state
- mod-specific extension state in `modules[modId]`

It must not support long-term host-shell sync branches dedicated to one mod.

## 15. main.ts Migration Boundary

Responsibilities that should migrate out of `src/main.ts`:

- runtime/app bridge
- post-load reconstruction
- post-interactive completion write-back
- scenario boot/restart reconstruction
- pre-save normalization
- canonical consistency checkpoint

Responsibilities that may remain in `src/main.ts`:

- DOM event listeners
- browser/host concerns
- loading screen behavior
- direct render call orchestration until presenter/render child work completes
- raw input listeners

## 16. Invariants

After every sync:

- canonical runtime state has a valid top-level shape
- required slices exist after hydrate/rebuild
- app bridge output is sufficient for shell execution
- pre-save output matches save contract
- mod activation does not leave half-initialized runtime state unless an explicit warning/error is returned
- presentation input is downstream data, not gameplay authority

## 17. Failure Semantics

Warnings:

- missing recoverable optional fields
- missing optional mod extension fields that can be initialized
- dropped transient view/session data that can be rebuilt

Hard errors:

- missing required canonical structure
- invalid save/runtime bridge output
- mod activation rebuild failure
- invalid top-level state authority relationship
- sync result that cannot produce required runtime state

Callers may continue after warnings only when the returned `StateSyncResult` contains a valid canonical runtime state. Callers must stop on hard errors.

## 18. Anti-Drift Rules

The project must not:

- add new feature-specific sync branches to `src/main.ts`
- maintain another long-term business truth inside a feature module
- add hidden canonical business state to `AppState`
- interpret save schema outside Save / Load Runtime and StateSync hydrate/prepare-save mapping
- create a long-term sync path dedicated to a single mod
- let `StateSync Runtime` become a gameplay god-object

## 19. Ambiguity Audit

This spec resolves:

- canonical runtime state is `CanonicalRuntimeState`
- current minimum `RuntimeState` carriers are legacy or bridge-period runtime state until renamed/reconciled
- `AppState` is shell/UI/session state
- `SaveState` is snapshot state
- `PresentationInput` is projection input
- `StateSync Runtime` only syncs, rebuilds, normalizes, hydrates, validates, and coordinates write-back
- mandatory triggers are `boot`, `load`, `runtime-commit`, `mod-activated`, `session-rebuild`, and `pre-save`
- `src/main.ts` bridge, reconstruction, pre-save, and consistency responsibilities are migration targets
- mod-defined state belongs in canonical module extension slots such as `modules[modId]`

## 20. Acceptance Criteria

Child 8 is acceptable only when:

- the unique canonical runtime-state model is defined
- forward-only applicability is defined
- legacy handling policy is defined
- runtime/app/save/presentation authority relationship is defined
- minimal top-level data structures are frozen
- trigger-based sync entry is defined
- collaboration boundaries with other runtimes are defined
- `src/main.ts` migration scope is defined
- mod extensibility path is defined
- critical source-of-truth ambiguity is removed

## 21. Done-Enough Exit Condition

Child 8 is done enough when:

- canonical state boundary is defined
- minimal top-level data structure is defined
- trigger set is defined
- collaboration boundary is defined
- `src/main.ts` migration boundary is defined
- forward applicability is defined
- legacy policy is defined
- no unresolved source-of-truth conflict remains in the spec or child plan
