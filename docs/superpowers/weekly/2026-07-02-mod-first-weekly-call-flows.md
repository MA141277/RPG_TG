# Mod-First Weekly Call Flows

**Week Of:** `2026-07-02`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Flow 1: Builtin Scenario Startup Before Child 17

### Narrative

The builtin path already uses manifest-driven scenario-pack loading and mod activation, but it still starts from builtin-specific startup wiring in `src/main.ts` and `default-runtime-content.ts`.

### Call Chain

```text
UI -> src/main.ts startup -> createBaseGameContentPack() -> loadContentPackFromManifestUrl() -> builtInScenarioPacks / loadScenarioPackFromUrl() -> runModRuntime() -> active content assembly -> renderApp()
```

### Notes

- This flow is partially converged already.
- Child 17 does not redesign activation ownership here; it only removes pack-specific direct content-consumer shortcuts that still make builtin content special.

## Flow 2: Covered Runtime Commit After Child 18 Batch 1

### Narrative

The covered `main.ts` runtime entry paths no longer hand-roll bridge create/apply pairs around `dispatchRuntimeRequest()`. They now converge through `commitRuntimeRequest()` in `state-sync-runtime.ts`, which commits one app-state input through runtime dispatch and returns the synchronized app-state result.

### Call Chain

```text
main.ts covered action/tick path -> commitRuntimeRequest() -> createRuntimeBridgeState() -> dispatchRuntimeRequest() -> runtime router/sub-runtime -> settleRuntimeEffects() -> applyRuntimeBridgeState() -> main.ts follow-up/render decision
```

### Notes

- Child 18 is now complete for the covered day-start, advance-segments, enter-city, story-battle, city-begging, and activity-qte write-back paths.
- The shared commit seam now covers both covered dispatch entry and covered interactive write-back, leaving only shell-facing follow-up/render choices in `src/main.ts`.

## Flow 3: Story Content Consumption After Child 17

### Narrative

A story consumer now resolves builtin story data through the shared pack-content access seam instead of directly importing `zhuyuanzhang` pack files inside `src/content/story/index.ts`.

### Call Chain

```text
runtime consumer -> src/content/story/index.ts -> src/content/pack-content-access.ts -> zhuyuanzhang events/scenes/text JSON -> exported story definitions/text map -> downstream story runtime usage
```

### Notes

- Child 17 is complete for this covered story path.
- The remaining problem is no longer direct story-import privilege; it is the broader runtime spine and later contribution contracts.

## Flow 4: House Content Consumption After Child 17

### Narrative

Covered house content adapters and keep-house/temple-house fallback consumers now read builtin `zhuyuanzhang` data through the shared pack-content access seam rather than through direct file imports.

### Call Chain

```text
enter house -> application house module -> src/content/houses/*.ts or src/application/content/pack-content-access.ts -> src/content/pack-content-access.ts -> zhuyuanzhang house-content/activity/text JSON -> house transition/view model
```

### Notes

- Child 17 is complete for these covered consumers.
- Child 17 replaced direct imports with shared access without adding new `main.ts` branching.

## Flow 5: Task Contribution Loading After Child 19 Task 2

### Narrative

Manifest-driven content packs and scenario packs can now declare `tasks` through the same shared pack contract. The current convergence point is still the loader layer: task definitions can enter the runtime content surface through `tasks.json`, even though shared runtime dispatch has not yet consumed them.

### Call Chain

```text
pack.json -> loadContentPackFromManifestText() / loadScenarioPackFromUrl() -> hydrate manifest file entries -> parse content/scenario pack -> ContentPackDefinition.tasks / ScenarioPackDefinition.tasks
```

### Notes

- Child 19 Task 2 is complete for the shared loading boundary.
- The next open gap is no longer pack/schema carriage; it is Task 3 runtime consumption and settlement.

## Flow 6: Shared Task Settlement After Child 19 Task 3

### Narrative

When a covered runtime route now emits `taskActions` or `taskSignals`, shared runtime dispatch consumes them through task runtime, writes task state back into `gameState.runtime.tasks`, and then settles any task effects through the normal runtime settlement path.

### Call Chain

```text
runtime request -> router/sub-runtime -> routed taskActions/taskSignals -> dispatchRuntimeRequest() task settlement -> gameState.runtime.tasks write-back -> runtime settlement applies task effects -> app-state bridge
```

### Notes

- Child 19 is complete for this shared task-runtime execution seam.
- The remaining next-step problem is no longer task settlement ownership; it is later house/runtime registration work under Child 20.

## Flow 7: Shared House Registration After Child 20

### Narrative

Builtin house module and renderer bindings now assemble through one shared registration seam. Covered house runtime, presenter lookup, and view rendering no longer each keep their own builtin-static table.

### Call Chain

```text
builtin house module/render registrations -> createBuiltinHouseModuleRegistry() -> src/core/registry/house-module-registry.ts -> getModule()/getRenderer() -> house runtime / stage presenter / house view renderer
```

### Notes

- Child 20 is complete for this shared house registration seam.
- The next open problem is no longer house module lookup ownership; it is whether Child 21 should unify the remaining gameplay contribution registries around the same installation model.

## Flow 8: Unified Gameplay Contribution Installation After Child 21

### Narrative

When a mod is activated, manifest-declared gameplay contributions now install through one shared activation seam. The activated-mod payload carries validated navigation/event/scene/task/house contribution ids instead of leaving later runtime closure work to rediscover that registry shape.

### Call Chain

```text
mod manifest/raw content -> parseModManifest() -> runModRuntime() -> createActivatedMod() -> installGameplayContributions() -> ActivatedMod.gameplayContributions -> later startup/save/runtime consumers
```

### Notes

- Child 21 is complete for manifest/runtime contribution install policy.
- The next open problem is no longer contribution contract shape; it is whether Child 22 can make builtin startup, imported-pack activation, and save restore all consume this same installed registry path end-to-end.

## Flow 9: Shared Activated Session Bootstrap After Child 22 Batch 1

### Narrative

Builtin startup, imported scenario-pack startup, and continue/restore now all converge through one activated-session bootstrap seam. The seam consumes a mod activation result, synchronizes active content from the activated source, and only then builds the next app session.

### Call Chain

```text
runModRuntime()/restoreModFromSave() -> ModActivationResult -> applyActivatedModSession() -> syncActivatedContentSource() -> createPrototypeAppState()/createScenarioPackAppState() -> renderApp()
```

### Notes

- Child 22 batch 1 is complete for startup bootstrap parity and selected-mod restore overwrite removal.
- The next open problem is no longer whether startup paths share one seam; it is how save/load will persist imported mod source identity and resumed runtime state across a fresh page load.
