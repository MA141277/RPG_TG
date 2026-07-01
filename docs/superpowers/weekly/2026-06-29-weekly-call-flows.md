# Weekly Call Flows

**Week Of:** `2026-06-29`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Current Coverage Status

- Real implemented flows captured: `16`
- Planned target flows captured: `0`
- Acceptance status:
- current batch requirement satisfied
- task runtime flow captured after Child 6 closeout
- mod runtime activation flow captured after Child 7 closeout
- state sync runtime flow captured after Child 8 closeout
- Child 9 preflight contract-hardening flows captured
- Child 10 baseline-governance flow captured after Child 10 closeout
- Child 11 Task 1 shared-dispatch follow-up flow captured
- Child 11 Task 2 covered interactive ownerization flow captured
- Child 11 Task 3 covered house ownerization flow captured
- Child 11 Task 4 covered settlement alignment flow captured

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

- Current settlement now handles `setFlag`, `setVariable`, and the covered `advanceTime` path used by the approved Child 11 interactive/house slices.
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

## Flow 9: Real Child 11 Task 1 Shared Dispatch Reentry Follow-Up

### Narrative

Child 11 Task 1 now proves that the covered story-battle reentry path no longer needs a post-dispatch branch in `src/main.ts`. `src/main.ts` creates the interactive action request, `dispatchRuntimeRequest()` routes over `RuntimeState`, the hardened router seam returns shared `RuntimeResult` carriage, effect settlement writes through `state.core.runtime`, and the new typed follow-up hook settles the covered `reenter-house` continuation before state is written back.

### Call Chain

```text
story-battle action in main.ts -> createInteractiveActionRequest() -> dispatchRuntimeRequest() -> RuntimeRouter.route() -> runInteractiveRuntime() -> settleRuntimeEffects() -> handleInteractive() follow-up hook -> applyInteractiveRuntimeState() -> house runtime reentry
```

### Notes

- `RuntimeState.core` remains the current domain `GameState`, `RuntimeState.app` remains the minimum four-field app carrier, and `RuntimeState.view` remains `{}` in this flow.
- `characterDefinitions` still travels on additive compatibility carriage for this batch; moving it into `RuntimeState.core` remains gated by weekly promotion rules rather than implied by this flow.
- This is still only the minimum shared-dispatch convergence slice. Interactive ownerization and house ownerization remain separate Child 11 tasks.

## Flow 9A: Real Child 11 Task 2 Covered Interactive Ownerization

### Narrative

Child 11 Task 2 now proves that one covered interactive lifecycle no longer needs adapter-owned launch/action/follow-up control. `src/main.ts` still emits the city-begging launch and complete requests, but `src/core/runtime/interactive-runtime.ts` now creates the session, advances pointer/tick state, applies the completion payload, settles the covered time advance through `src/core/runtime/runtime-settlement.ts`, and clears the minigame session before the result is written back.

### Call Chain

```text
city-begging launch/complete in main.ts -> createInteractiveLaunchRequest()/createInteractiveActionRequest() -> dispatchRuntimeRequest() -> RuntimeRouter.route() -> runInteractiveRuntime() -> create/update/apply city-begging state + settleRuntimeEffects() advanceTime follow-up -> applyInteractiveRuntimeResult() in main.ts
```

### Notes

- `src/core/adapters/legacy-interactive-adapter.ts` no longer carries the city-begging lifecycle wrappers after this batch; only the still-out-of-scope compatibility helpers remain there.
- `src/main.ts` no longer performs the covered city-begging completion-time advance or session cleanup branch directly.
- This flow is now paired with Task 4 settlement alignment; broader runtime-family convergence is still deferred beyond the completed covered slice.

## Flow 9B: Real Child 11 Task 3 Covered House Ownerization

### Narrative

Child 11 Task 3 now proves that one covered house lifecycle no longer needs adapter-owned enter/dispatch/leave control. `src/main.ts` still enters and leaves houses through the same core runtime seam, but `src/core/runtime/house-runtime.ts` now owns the covered grain-shop session bootstrap, action dispatch, leave handling, story-on-enter trigger, and covered house side-effect processing directly, with the covered time cost now settled through `runtime-settlement.ts`.

### Call Chain

```text
grain-shop enter/action/leave in main.ts -> enterHouseThroughRuntime()/dispatchHouseRuntimeRequest()/leaveHouseThroughRuntime() -> HouseRuntimeBridge.dispatch() -> core house-runtime enter/dispatch/leave handlers -> house module transition + settleRuntimeEffects() covered advanceTime -> renderApp()
```

### Notes

- `src/core/adapters/legacy-house-adapter.ts` is now only a compatibility placeholder after this batch; the covered grain-shop lifecycle no longer routes through an adapter-owned dispatch helper.
- This flow is now paired with Task 4 settlement alignment; broader runtime-family convergence is still deferred beyond the completed covered slice.

## Flow 9C: Real Child 11 Task 4 Covered Settlement Alignment

### Narrative

Child 11 Task 4 now proves that the covered runtime-owned slices do not keep split time-advance ownership. `src/core/runtime/interactive-runtime.ts` and `src/core/runtime/house-runtime.ts` both emit covered `advanceTime` effects, `src/core/runtime/runtime-settlement.ts` now applies that effect through the shared time-progression helper, and the covered city-begging plus grain-shop flows no longer need direct feature-owned time advancement calls.

### Call Chain

```text
covered interactive/house result -> settleRuntimeEffects() -> advanceTime effect -> advanceGameStateTimeSegments() through runtime-settlement.ts -> settled RuntimeState.core/runtime -> main.ts/app write-back
```

### Notes

- `src/core/contracts/effect-settlement.ts` now records `house-runtime` as a covered emitter for this path.
- This closes the approved Child 11 settlement slice only; later runtime-family convergence must still pass through Child 12 queue governance and the locked Child 13 review gate.

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

## Flow 14: Current Shared Runtime Request To Router To Settlement Line

### Narrative

This is the first current production line that Child 9 will harden rather than redesign. Shared runtime input enters through `RuntimeRequest`, dispatch calls the routed callback, and settlement applies returned effects before the caller continues. The seam is real, but the request/router language is still intentionally minimal and is therefore the first Child 9 hardening target.

### Call Chain

```text
RuntimeRequest -> dispatchRuntimeRequest() -> routeRequest() -> RuntimeResult -> applyEffects() -> settled RuntimeResult.state
```

### Notes

- This is a real current seam, not a planned one.
- Child 9 should harden the request/router contract at this seam without turning the child into shared-runtime ownerization.

## Flow 15: Current Interactive Dispatch Through The Bridge Runtime

### Narrative

The current covered interactive path already runs through the core runtime seam, but the public interactive dispatch language is still only partially formalized. `main.ts` or a house-triggered caller creates an interactive launch/action request, `src/core/runtime/interactive-runtime.ts` accepts it, and the bridge delegates into the legacy interactive adapter for minigame or story-battle behavior. This is the real flow Child 9 must formalize as one dispatch contract.

### Call Chain

```text
interactive intent -> createLaunchInteractiveRequest() or createInteractiveActionRequest() -> runInteractiveRuntime() -> legacy-interactive-adapter.ts -> activity-qte/city-begging/story-battle legacy implementation -> RuntimeResult
```

### Notes

- The business logic still runs behind adapters, which is acceptable for Child 9.
- Child 9 should harden launch/action/exit and minigame dispatch language here, not remove the adapters.

## Flow 16: Current House Runtime Request Through The Bridge Adapter

### Narrative

The current house seam is already routed through `src/core/runtime/house-runtime.ts`, but the public request shape still leaks the domain `HouseModuleRequest` into the core-owned public surface. The runtime bridge delegates `enter`, `leave`, and current-session dispatch into the legacy adapter. This is the exact current flow Child 9 must narrow behind a core-owned request contract.

### Call Chain

```text
house enter/leave/or module request -> enterHouseThroughRuntime() / leaveHouseThroughRuntime() / dispatchHouseRuntimeRequest() -> legacy-house-adapter.ts -> application/house/* -> current house session result
```

### Notes

- This is the current compatibility bridge, not the target owner model.
- Child 9 should replace the public request vocabulary at this seam, while leaving actual house business logic in place for a later child.

## Flow 17: Child 10 Baseline-To-Child 11 Unlock Governance Flow

### Narrative

Child 10 is a governance child rather than a production-code child. Its closeout path freezes runtime maturity, owner vs bridge status, adapter disposition, `src/main.ts` coupling, and Child 11 execution controls in one baseline document. That baseline is now referenced by authored Child 11 spec/plan documents, and the weekly queue now records Child 11 as executable.

### Call Chain

```text
Child 9 completed -> execute Child 10 review plan -> finalize runtime-ownerization baseline -> author Child 11 spec/plan against baseline -> weekly unlock sync -> Child 11 becomes executable -> start Child 11 from its own plan
```

### Notes

- This is a real governance flow in the current repository, not a hypothetical future process.
- It exists to prevent Child 11 from reopening owner/bridge classification, adapter disposition, or `main.ts` coupling ad hoc during implementation.

## Flow 18: Child 11 Closeout-To-Child 13 Convergence Review Flow

### Narrative

Child 13 is not a generic continuation and not a silent Child 11 backfill. Its unlock path begins only after Child 11 completes and the Child 12 UI layout/interface-reserve child closes. Only then does governance review the remaining runtime-owned follow-up and reentry paths, classify them into Bucket A, Bucket B, or Bucket C, and unlock Child 13 if real Bucket A convergence work exists.

### Call Chain

```text
Child 11 completed -> execute Child 12 UI layout/interface-reserve child -> Child 12 closeout -> later review classifies remaining paths into Bucket A/B/C -> unlock Child 13 only if Bucket A exists -> execute Child 13
```

### Notes

- This flow exists to prevent Child 13 from degenerating into Child 11 backfill.
- This flow also preserves the user's required queue order: Child 12 stays ahead of Child 13 as the UI layout/interface-reserve child and does not alter the current runtime direction.
