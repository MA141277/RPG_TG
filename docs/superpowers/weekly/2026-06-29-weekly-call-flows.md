# Weekly Call Flows

**Week Of:** `2026-06-29`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Current Coverage Status

- Real implemented flows captured: `13`
- Planned target flows captured: `0`
- Acceptance status:
- current batch requirement satisfied
- task runtime flow captured after Child 6 closeout
- mod runtime activation flow captured after Child 7 closeout
- state sync runtime flow captured after Child 8 closeout

## Flow 1: Current Game Boot Flow

### Narrative

The current app still boots from `src/main.ts`, but Child 1 Task 5 now inserts a real `legacy-main-adapter` handoff before legacy orchestration continues. That makes boot composition inspectable without forcing premature gameplay migration out of `main.ts`.

### Call Chain

```text
Browser load -> src/main.ts -> bootstrapLegacyMain() -> bootstrapEngine() -> EngineSession -> content activation + state creation -> runtime orchestration -> createAppPresenterOutput() -> ui/app-render -> player-visible screen
```

### Notes

- This was the highest-priority black-box flow this week, and it now has a real adapter seam into `src/core`.
- Most gameplay orchestration still remains in `main.ts`, so later children should migrate behavior behind the new seam instead of bypassing it.

## Flow 2: Real Child 1 Contract Verification Flow

### Narrative

Child 1 Task 1 added the first real `src/core` production files and the first regression tests that assert the new boundary exists. The test path now compiles `src/core/**/*.ts` into `.test-dist`, imports the emitted contract module, and source-checks the runtime-request union.

### Call Chain

```text
npm test -> npm run build:test -> tsconfig.test.json include src/core/**/*.ts -> .test-dist/core/contracts/mod-manifest.js -> tests/robustness.test.cjs require/read -> boundary assertions pass
```

### Notes

- This is the first real implemented `src/core` flow in the repository, even though it is still test/build-facing rather than runtime-facing.
- The need to update `tsconfig.test.json` exposed a real integration seam that future `src/core` work must keep in mind.

## Additional Flows

- Engine-session bootstrap flow is now captured below.
- Runtime dispatch and effect settlement flow is now captured below.

## Flow 3: Real Child 1 Engine Session Bootstrap Flow

### Narrative

Child 1 Task 2 now proves that a selected mod manifest plus typed registry can compose the first `EngineSession`. This is still an internal seam, but it is the first real boot slice under `src/core/engine`.

### Call Chain

```text
selectedModId -> EngineRegistry.mods[selectedModId] -> bootstrapEngine() -> createEngineSession() -> CoreGameState.engine/runtime shell
```

### Notes

- `bootstrapEngine()` guards unknown mod ids before session creation.
- `createEngineSession()` currently seeds only the minimal engine/runtime shell needed for later runtime dispatch work.

## Flow 4: Real Child 1 Runtime Dispatch Flow

### Narrative

Child 1 Task 3 now proves that a routed runtime result can flow back through `dispatchRuntimeRequest()` and settle effects into `CoreGameState.runtime`. This is the first runtime-owned state transition seam under `src/core`.

### Call Chain

```text
RuntimeRequest -> dispatchRuntimeRequest() -> context.routeRequest() -> RuntimeResult.effects -> applyEffects() -> settled CoreGameState.runtime
```

### Notes

- Current settlement handles the first two effect types that mutate core runtime state directly: `setFlag` and `setVariable`.
- Additional effect types remain intentionally deferred until later child-plan slices prove they belong here.

## Flow 5: Real Child 1 Save Envelope Flow

### Narrative

Child 1 Task 4 now proves that core-owned state can emit a minimal save envelope carrying selected mod identity plus mod-scoped payload. This is intentionally small, but it gives Child 2 a stable seam to harden rather than inventing one later.

### Call Chain

```text
CoreGameState.engine.selectedModId + CoreGameState.modState -> createSaveEnvelope() -> SaveEnvelope.version/selectedModId/modState
```

### Notes

- The save seam is additive and intentionally narrow; it does not yet claim loader/writer/migration ownership.
- Child 2 should extend this seam carefully rather than bypassing it with new ad hoc save shapes.

## Flow 6: Real Child 2 Save Migration Round-Trip Flow

### Narrative

Child 2 now proves that a legacy or current save-like payload can be normalized, validated against available mods, and serialized back out without dropping unknown mod-owned payload. This is the first real read/write persistence flow under `src/core/save`.

### Call Chain

```text
legacy/current save-like record -> migrateSaveEnvelope() -> loadSaveEnvelope() -> selected mod validation -> serializeSaveEnvelope() -> JSON save payload
```

### Notes

- Legacy `state.flags/state.variables` now migrate into `runtimeState`.
- Unknown `modState` payload is preserved even when the core runtime does not interpret its internals.

## Flow 7: Real Child 3 City Entry Through Runtime Seams

### Narrative

Child 3 now proves that a real city-entry path no longer jumps straight from `main.ts` into legacy story-trigger orchestration. `main.ts` creates a typed navigation request, `src/core/runtime/navigation-runtime.ts` performs the entry mutation, `src/core/runtime/event-runtime.ts` selects and activates any matching event, and `src/core/runtime/scene-runtime.ts` performs the first event-to-scene handoff.

### Call Chain

```text
city-enter confirmation -> createEnterCityRequest() -> runNavigationRuntime() -> createEventTriggerRequest() -> runEventRuntime() -> runSceneFromEvent() -> paused/settled scene state
```

### Notes

- This is the first real runtime-owned navigation/time/event entry flow under `src/core/runtime`, even though the implementation still wraps legacy application services behind the seam.
- The next extraction target should be interactive launch ownership, not another persistence pass.

## Flow 8: Real Child 4 Interactive Launch And Action Handoff

### Narrative

Child 4 batch 1 now proves that covered interactive flows no longer need `src/main.ts` to import `application/house/house-runtime` or interactive helpers directly. `src/main.ts` creates a typed interactive launch or action request, `src/core/runtime/interactive-runtime.ts` receives it, and the new core runtime seam delegates through the legacy interactive adapter while keeping ownership of the entry surface under `src/core`.

### Call Chain

```text
UI/house event in main.ts -> createLaunchInteractiveRequest() or createInteractiveActionRequest() -> runInteractiveRuntime() -> legacy-interactive-adapter.ts -> city-begging/activity-qte/story-battle legacy helper -> updated app state + optional house re-entry
```

### Notes

- This is an entry-seam extraction, not a full gameplay migration; the underlying minigame and story-battle logic still runs through legacy adapters.
- Child 4 batch 2 widened the returned carriage to `RuntimeResult.state` plus `RuntimeResult.interactive`, but not every covered path uses shared dispatch yet.

## Flow 9: Real Child 4 Minimum RuntimeState Shared Dispatch Reentry

### Narrative

Child 4 batch 2 now proves that at least one covered interactive path can rejoin the shared runtime line on the landed minimum carrier. `src/main.ts` creates the interactive action request, `dispatchRuntimeRequest()` routes over `RuntimeState`, `runInteractiveRuntime()` returns shared `RuntimeResult` carriage, effect settlement writes through `state.core.runtime`, and browser-only follow-up remains in `main.ts`.

### Call Chain

```text
story-battle action in main.ts -> createInteractiveActionRequest() -> dispatchRuntimeRequest() -> routeRequest() -> runInteractiveRuntime() -> RuntimeResult.state/interactive -> applyInteractiveRuntimeState() -> optional reenter-house follow-up
```

### Notes

- `RuntimeState.core` remains the current domain `GameState`, `RuntimeState.app` remains the minimum four-field app carrier, and `RuntimeState.view` remains `{}` in this flow.
- `characterDefinitions` still travels on additive compatibility carriage for this batch; moving it into `RuntimeState.core` remains gated by weekly promotion rules rather than implied by this flow.

## Flow 10: Real Child 5 Presenter Output Render Flow

### Narrative

Child 5 now proves that render-time gameplay selection can move out of `src/ui/app-render.ts`. `src/main.ts` assembles a presenter input, `src/application/presenter/app-presenter.ts` composes stage and overlay presenter output, stage presenters own house/module lookup plus city/story visibility filtering, and `src/ui/app-render.ts` consumes the presenter-selected data while continuing to reuse existing view renderers.

### Call Chain

```text
renderApp() in main.ts -> createAppPresenterOutput() -> stage-presenters.ts / overlay-presenters.ts -> AppPresenterOutput -> renderAppMarkup() -> ui/app-render.ts -> existing view renderers -> player-visible screen
```

### Notes

- `src/ui/app-render.ts` no longer imports `getHouseModule`, `isCityEntryVisibleForStoryStage`, or `selectCityNpcSummariesForHouse` directly.
- This is presentation projection only; gameplay mutation, interaction runtime ownership, save/load, and task progression remain outside Child 5.

## Flow 11: Real Child 6 Task Runtime Signal Progression Flow

### Narrative

Child 6 now proves that task lifecycle and signal-driven progression have a formal runtime owner under `src/core`. A registered `TaskDefinition` can be started into `TaskRuntimeState`, duplicate active starts are ignored deterministically, one `TaskSignal` can advance multiple active tasks, terminal failed/completed tasks stay closed, and returned effects remain unapplied until shared settlement handles them.

### Call Chain

```text
registered TaskDefinition index -> applyTaskAction(start) -> TaskRuntimeState.instancesByTaskId -> TaskSignal -> applyTaskSignal() -> taskUpdates + returned effects + follow-up signals -> later shared runtime settlement
```

### Notes

- `Task Runtime` consumes registered definitions; it does not import content packs directly.
- `Task Runtime` does not own event activation, scene sessions, interaction sessions, time advancement, save/load IO, presenter output, or effect application.

## Flow 12: Real Child 7 Mod Runtime Activation Handoff

### Narrative

Child 7 now proves that builtin, file-imported, url-imported, and restore-time selected-mod activation can enter one formal Mod Runtime seam before downstream startup continues. `src/main.ts` still owns browser loading flow and final content/app-state assembly, but mod source normalization, loaded/activated mod contracts, validation, atomic activation, and legacy bootstrap handoff now live under `src/core`.

### Call Chain

```text
builtin/file/url/restore selected-mod intent -> createLoadedModFromManifest() or createLoadedModFromScenarioPack() -> runModRuntime() -> dependency/capability validation -> atomic activation result -> toLegacyBootstrapInput() -> existing content assembly / bootstrap continuation
```

### Notes

- `Mod Runtime` returns a `ModActivationResult` with either `ActivatedMod` or typed failure; startup does not silently fallback on activation failure.
- `src/core/mods/mod-runtime.ts` does not import final content assembly, UI rendering, or gameplay runtime execution.
- Save/load still owns save envelope parsing and migration; restore-time selected-mod re-activation is routed back through Mod Runtime.

## Flow 13: Real Child 8 StateSync Runtime Boundary Flow

### Narrative

Child 8 now proves that canonical runtime/app/save/presentation state synchronization has a formal owner under `src/core`. `src/main.ts` no longer declares the bridge-period interactive RuntimeState creation and write-back helpers directly; those helpers now live behind the StateSync runtime boundary while the new `syncState()` entrypoint coordinates canonical state normalization, save snapshot preparation, session/app bridge sync, mod activation rebuild, and presentation input preparation without taking over gameplay dispatch, save IO, Mod Runtime activation, or rendering.

### Call Chain

```text
runtime/app/save/presentation sync trigger -> syncState() -> hydrate/normalize or mod rebuild -> optional app bridge / save snapshot / presentation input -> StateSyncResult -> existing caller continues owning gameplay, IO, or rendering
```

### Notes

- `StateSync Runtime` owns synchronization and canonical boundary shaping only; it does not run task/event/story progression.
- `src/core/runtime/state-sync-runtime.ts` exposes one small public `syncState()` entrypoint and delegates internal work to focused helper modules.
