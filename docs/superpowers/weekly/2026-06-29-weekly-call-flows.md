# Weekly Call Flows

**Week Of:** `2026-06-29`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Current Coverage Status

- Real implemented flows captured: `7`
- Planned target flows captured: `0`
- Acceptance status:
- current batch requirement satisfied
- add more runtime-owned flows after Child 4 begins extracting interactive entry

## Flow 1: Current Game Boot Flow

### Narrative

The current app still boots from `src/main.ts`, but Child 1 Task 5 now inserts a real `legacy-main-adapter` handoff before legacy orchestration continues. That makes boot composition inspectable without forcing premature gameplay migration out of `main.ts`.

### Call Chain

```text
Browser load -> src/main.ts -> bootstrapLegacyMain() -> bootstrapEngine() -> EngineSession -> content activation + state creation -> runtime orchestration -> ui/app-render -> player-visible screen
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
