# Task Runtime Spec

## 1. Goal

Define the formal `Task Runtime` boundary for the mod-first engine architecture.

The runtime target is to promote the existing task action and task signal seams into a reusable task-state subsystem that can create task instances, advance progress from runtime signals, emit task updates and effects, and persist task runtime state through the shared save/load boundary.

## 2. Naming Rule

- Runtime-layer naming uses `Task`.
- `Mission` is reserved for content-layer or presentation-layer wording only.
- Runtime contracts, runtime files, queue labels, and child-plan names must not use `Mission Runtime`.
- Content packs may still expose player-facing labels such as mission, request, duty, commission, or quest if those labels map into registered `TaskDefinition` data before runtime execution.

## 3. Non-Goals

This spec does not define:

- event candidate selection or event activation
- scene session playback
- interaction session ownership
- time advancement
- UI, presenter, or render behavior for tasks
- a full mod activation, capability, or dependency system
- a final authoring DSL for every future task shape
- a mod-provided custom condition evaluator plugin mechanism

Child 6 first version supports only built-in standard condition types.

## 4. Problem Statement

Child 3 reserved `taskActions` and `taskSignals` in runtime results, but the repository still lacks a formal runtime owner for task lifecycle, progress evaluation, completion, failure, and task-state persistence.

Without a dedicated `Task Runtime`, task behavior risks being absorbed into event, scene, interaction, or UI code. That would recreate the same black-box orchestration problem the engine-first roadmap is trying to remove from `src/main.ts`.

## 5. Core Responsibilities

`Task Runtime` owns:

- creating `TaskInstance` records from registered `TaskDefinition` data
- enforcing one active instance per `taskId`
- evaluating built-in conditions against incoming `TaskSignal` data
- advancing objective progress
- transitioning task lifecycle state
- emitting `TaskUpdate` records
- emitting effects requested by task lifecycle transitions
- emitting follow-up signals for other runtimes to consume

`Task Runtime` does not own:

- event candidate ranking
- event activation
- scene session state
- interaction session state
- time advancement
- effect application
- save/load IO
- UI/presenter rendering

## 6. Runtime Position

`Task Runtime` sits below event, scene, interaction, and time producers, and above shared runtime settlement.

Standard flow:

1. Event, scene, interaction, or time runtime emits one or more `TaskAction` or `TaskSignal` values.
2. `Task Runtime` consumes those values with the current `TaskRuntimeState` and registered `TaskDefinition` index.
3. `Task Runtime` returns a `TaskRuntimeResult`.
4. Shared runtime settlement applies returned effects and state changes through the existing runtime result path.

`Task Runtime` only consumes signals. It must not take over another runtime's session state.

## 7. Core Data Model

### 7.1 TaskDefinition

`TaskDefinition` is registered content data.

Required conceptual fields:

- `id`
- `title`
- `description`
- `initialState`
- `objectives`
- `startConditions`
- `completionConditions`
- `failureConditions`
- `onStartEffects`
- `onProgressEffects`
- `onCompleteEffects`
- `onFailEffects`
- `tags`

Rules:

- `TaskDefinition` is provided by a registration layer.
- `Task Runtime` consumes already registered definitions.
- `Task Runtime` must not parse raw content packs directly.
- Runtime code may support built-in condition types only in Child 6.

### 7.2 TaskInstance

`TaskInstance` is runtime state for one active or historical task.

Required conceptual fields:

- `taskId`
- `status`
- `startedAt`
- `updatedAt`
- `completedAt`
- `failedAt`
- `progress`
- `flags`
- `source`

Rules:

- `TaskInstance` must be serializable and persistable.
- Save/load IO remains owned by `Save / Load Runtime`.
- The same `taskId` may have only one instance in runtime state.
- Failed tasks are terminal.

### 7.3 TaskRuntimeState

`TaskRuntimeState` is the runtime-owned task state container.

Required conceptual fields:

- `instancesByTaskId`
- `completedTaskIds`
- `failedTaskIds`
- `updatedAt`

Rules:

- Multiple different tasks may be active at the same time.
- A task may not be active, completed, and failed simultaneously.
- Historical completed/failed state must be queryable for event and scene conditions.

## 8. Lifecycle State Machine

Supported task states:

- `inactive`
- `active`
- `completed`
- `failed`

Allowed transitions:

- `inactive -> active`
- `active -> completed`
- `active -> failed`

Forbidden transitions:

- `completed -> active`
- `completed -> failed`
- `failed -> active`
- `failed -> completed`

`failed` is terminal.

## 9. Input Contract

### 9.1 TaskAction

`TaskAction` is an explicit command emitted by another runtime or by a shared runtime request.

Required Child 6 action kinds:

- `start`
- `complete`
- `fail`

Rules:

- `start` creates an active `TaskInstance` when conditions allow it.
- `complete` may complete an active task when completion rules allow it.
- `fail` moves an active task to terminal failed state.
- `cancel` is a later optional action kind and is not required in Child 6.
- Event Runtime may emit task actions, but Task Runtime owns their lifecycle effects.

### 9.2 TaskSignal

`TaskSignal` is an observation emitted by another runtime.

Required conceptual fields:

- `type`
- `source`
- `payload`
- `occurredAt`

Rules:

- A single signal may be broadcast to all active tasks.
- The same signal may advance multiple active tasks.
- Task Runtime must not mutate scene, interaction, event, or time session state while consuming a signal.

## 10. Condition And Progression Model

Child 6 supports built-in standard condition types only.

Required conceptual condition categories:

- task status condition
- flag condition
- counter/progress condition
- signal match condition
- elapsed-time condition by supplied runtime timestamp

Rules:

- Custom mod evaluator plugins are not part of Child 6.
- Conditions must be pure evaluations over supplied runtime state, definition data, and incoming action/signal input.
- Progression must be deterministic for the same input state and signal sequence.

## 11. Task Creation Boundary

Task creation belongs to `Task Runtime` only after a `TaskAction` or runtime request asks for a registered task to start.

Task creation does not belong to:

- Event Runtime
- Scene Runtime
- Interaction Runtime
- Time Runtime
- UI/presenter code

Those runtimes may request task creation through `TaskAction`.

## 12. Shared Runtime Boundary

`Task Runtime` integrates with the shared runtime by returning a `TaskRuntimeResult`.

Rules:

- Task Runtime outputs `taskUpdates`, `effects`, and `signals`.
- Task Runtime does not apply effects.
- Effect application remains owned by shared runtime settlement.
- Task runtime state should flow through `RuntimeState` or another explicitly documented state carrier.

## 13. Task Definition Registration Boundary

Task definitions must be registered before runtime execution.

Rules:

- The registration layer provides `TaskDefinition` records indexed by task id.
- Task Runtime receives that registered index as input.
- Task Runtime must not import concrete content packs directly.
- Missing task definitions must fail predictably and must not create ad hoc instances.

## 14. Event Runtime Boundary

Event Runtime owns:

- trigger matching
- candidate filtering
- candidate ranking
- event activation

Task Runtime owns:

- lifecycle response to emitted `TaskAction` values
- progress response to emitted `TaskSignal` values

Task Runtime does not select or activate events.

## 15. Scene Runtime Boundary

Scene Runtime owns:

- scene session creation
- node progression
- dialogue/narration/choice flow

Task Runtime owns:

- task state changes caused by scene-emitted signals

Task Runtime does not own scene session state.

## 16. Interaction Runtime Boundary

Interaction Runtime owns:

- minigame and interaction session routing
- interaction request/action handling
- house integration session handoff

Task Runtime owns:

- task progress caused by interaction-emitted signals

Task Runtime does not own interaction session state.

## 17. Time Runtime Boundary

Time Runtime owns:

- day/month/time advancement
- timed trigger entry

Task Runtime owns:

- task progress or failure caused by supplied time signals

Task Runtime does not advance time.

## 18. Save / Load Boundary

`TaskInstance` and `TaskRuntimeState` must be persistable.

Rules:

- Task Runtime defines serializable state shape.
- Save / Load Runtime owns serialization, deserialization, migration, and IO.
- Task Runtime may expose normalization helpers only if they are pure and do not perform IO.

## 19. Effect Settlement Boundary

Task Runtime may emit effects as part of start, progress, completion, or failure transitions.

Rules:

- Task Runtime does not apply effects directly.
- Shared runtime settlement applies effects.
- Task Runtime must return effects in the shared result channel.

## 20. Story / Narrative Boundary

Story and narrative content may declare task definitions, task labels, objective text, and mission-facing copy.

Rules:

- Narrative code must not own task lifecycle state.
- Player-facing `Mission` wording may map to runtime `Task` definitions.
- Story progression may observe task state through runtime queries or conditions.

## 21. Presentation Boundary

Presentation code owns:

- task list view models
- mission labels
- objective text formatting
- progress display

Task Runtime owns:

- status and progress data

Task Runtime must not return HTML or presenter-specific view models.

## 22. Output Contract

### 22.1 TaskUpdate

`TaskUpdate` describes one task-state change.

Required conceptual fields:

- `taskId`
- `type`
- `previousStatus`
- `nextStatus`
- `progressDelta`
- `reason`

### 22.2 TaskRuntimeResult

`TaskRuntimeResult` returns:

- `state`
- `taskUpdates`
- `effects`
- `signals`

Rules:

- `effects` are returned for shared settlement.
- `signals` are follow-up runtime signals, not direct runtime calls.
- Result shape must be compatible with `RuntimeResult`.

## 23. Multi-Task Concurrency Rules

- Multiple different tasks may be active at once.
- The same `taskId` may have only one instance.
- A single `TaskSignal` may broadcast to all active tasks.
- A single `TaskSignal` may update multiple active tasks.
- `failed` is terminal.
- Completion and failure conflict resolution must be deterministic.

## 24. Mod-First Data Rules

- Task content must be data-defined through registered definitions.
- Task Runtime must not import built-in campaign files directly.
- Built-in campaign tasks should eventually register through the same definition path used by mods.
- Child 6 does not implement full mod activation, capability, dependency, or custom evaluator plugins.

## 25. Required Files

Child 6 must create or modify:

- `src/core/contracts/task-runtime.ts`
- `src/core/runtime/task-runtime.ts`
- `src/core/contracts/runtime-result.ts`
- `tests/robustness.test.cjs`
- `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

Child 6 may create:

- `src/core/runtime/task-definition-registry.ts`
- `src/core/runtime/task-condition-evaluator.ts`
- `src/core/runtime/task-progression.ts`

## 26. Verification Expectations

Child 6 implementation must include:

- red tests before implementation
- focused task-runtime seam tests
- focused lifecycle tests
- focused signal progression tests
- source or behavior guard showing Task Runtime does not absorb Event, Scene, Interaction, or Time Runtime responsibilities
- `npm run typecheck`
- `npm test`
- `npm run build`

## 27. Acceptance Criteria

Child 6 is acceptable only when:

- `TaskDefinition`, `TaskInstance`, and `TaskRuntimeState` are formal contracts
- `TaskAction` and `TaskSignal` are formal inputs
- `TaskUpdate` and `TaskRuntimeResult` are formal outputs
- multiple different active tasks are supported
- duplicate active instances for the same `taskId` are rejected or ignored deterministically
- one signal can update multiple active tasks
- failed tasks are terminal
- effects are returned but not applied by Task Runtime
- Task Runtime consumes registered task definitions and does not import raw content packs
- Task Runtime does not own event activation, scene sessions, interaction sessions, time advancement, save/load IO, or presentation

## 28. Final Boundary Audit

Before Child 6 closes, verify and record:

- Event Runtime still owns event candidate and activation behavior.
- Scene Runtime still owns scene session behavior.
- Interaction Runtime still owns interaction session behavior.
- Time Runtime still owns time advancement.
- Save / Load Runtime still owns persistence IO.
- Effect settlement still applies returned effects.
- Presentation still owns task display.
- Runtime-layer naming uses `Task`; `Mission` remains content/presentation wording only.
