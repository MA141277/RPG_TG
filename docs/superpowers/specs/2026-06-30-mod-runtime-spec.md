# Mod Runtime Spec

## 1. Runtime Name

- The public runtime name for Child 7 is `Mod Runtime`.
- Do not present parallel runtime names such as `Mod Loader Runtime` or `Mod Activation Runtime` as peer subsystem names.
- If those names appear, they are implementation-module names only.

## 2. Goal

Define a formal `Mod Runtime` boundary so mod-related startup decisions move out of `src/main.ts` and into a reusable mod-first startup path.

Child 7 owns the path from mod source discovery through activation handoff. It does not attempt to rewrite the entire startup system in one pass.

## 3. Problem Statement

The currently effective content-startup path still lives primarily in `src/main.ts`, where builtin startup, scenario-pack URL import, scenario-pack file import, content install/reset, and legacy branching are coordinated inline.

That leaves four structural problems:

- startup logic remains scattered in `src/main.ts`
- builtin, file, and url startup paths still fork instead of converging
- save/load cannot restore mod context through one formal activation seam
- downstream runtime layers do not consume one unified active-mod source

## 4. Runtime Position

`Mod Runtime` sits upstream of content assembly, boot/runtime bootstrap, and downstream gameplay runtimes.

It is:

- a startup and activation subsystem
- a provider of normalized mod activation outputs
- an upstream dependency of boot/content assembly

It is not:

- a gameplay executor
- a content assembler
- a UI layer
- a save/load manager

## 5. Core Responsibilities

`Mod Runtime` owns:

- mod discovery
- mod loading
- mod parsing
- mod selection
- activation validation
- mod activation
- registration handoff

## 6. Explicit Non-Responsibilities

`Mod Runtime` does not own:

- final `ActiveGameContent` assembly
- base/override content merge logic
- final app-state construction
- gameplay runtime execution
- Task/Event/Scene/Interactive execution
- UI rendering
- file picker, menu, or loading-screen UI
- save-slot listing, save read, or save deletion
- save-migration implementation
- runtime-snapshot restore implementation

## 7. Boundary With `main.ts`

Current state:

- `src/main.ts` still directly controls builtin startup, scenario import, content install/reset, and path branching.

Target state:

- `src/main.ts` collects user intent, calls startup orchestration or `Mod Runtime`, receives one activation result, and passes that result to content assembly and bootstrap.

Transitional rule:

- Child 7 v1 may coexist with legacy startup branches.
- Child 7 v1 does not require deleting every legacy branch in one landing.
- Child 7 v1 may use an adapter so `main.ts` consumes `ModActivationResult` without a full startup rewrite.

## 8. Initial `main.ts` Extraction Scope

Child 7 v1 should extract these mod-related startup decisions from `src/main.ts`:

- builtin mod registration and selection
- builtin mod loading preparation
- imported-source entry normalization
- imported-pack parse and activation decisions
- pre-startup mod validation
- activation handoff generation
- legacy scenario-content install decision ownership

## 9. `main.ts` Functions Not In Scope For Child 7

Child 7 does not take ownership of:

- loading-screen control
- main-menu or UI flow
- `renderApp()`
- in-app interaction event dispatch
- scene, event, task, or interactive execution
- navigation, time, or house runtime invocation
- final app-state initialization details

## 10. Boundary With Content Assembly

`Mod Runtime` outputs:

- normalized pack definitions
- normalized content sources
- registered definitions
- startup profile or entrypoint data

`Mod Runtime` does not own:

- base/override merge rules
- `ActiveGameContent` construction
- by-id indexing
- final runtime content-object assembly

## 11. Boundary With Boot / Startup Orchestration

Boot/startup orchestration owns:

- deciding when startup begins
- loading-screen flow
- calling `Mod Runtime`
- calling content assembly
- creating initial app/runtime state
- entering the game

`Mod Runtime` stops at activation handoff.

## 12. Boundary With Save / Load

Save/load owns:

- save record listing
- save record reading
- save record deletion
- save metadata and envelope
- save migration
- save persistence format
- runtime snapshot persistence

`Mod Runtime` owns:

- re-discovering, loading, validating, and re-activating the selected mod from restore input
- returning typed failure when the saved mod cannot be restored

## 13. Save / Load Detailed Clauses

- save listing belongs to save/load
- save reading belongs to save/load
- save deletion belongs to save/load
- restore-time re-activation belongs to `Mod Runtime`
- save/load must not bypass `Mod Runtime` to install content or recreate active content directly

## 14. Restore Failure Rules

At minimum, Child 7 must distinguish:

- save-domain failures
  - save not found
  - unreadable
  - corrupted envelope
  - unsupported version
  - migration failure
- mod-domain failures
  - saved mod id missing
  - mod source unavailable
  - mod parse failure
  - dependency missing or conflict
  - capability rejected
  - activation failed
- runtime-restore failures
  - runtime snapshot incompatible
  - required definitions missing after activation
  - downstream bootstrap restore failed

Rules:

- silent fallback is not allowed
- automatic builtin-default fallback is not allowed in v1 unless a later policy explicitly adds it

## 15. Boundary With Downstream Runtimes

Downstream runtime ownership stays unchanged:

- `Task Runtime` owns task lifecycle execution
- `Event Runtime` owns event trigger evaluation and activation
- `Scene Runtime` owns scene/dialogue progression
- `Interactive Runtime` owns minigame and interaction execution

`Mod Runtime` only provides activated definitions and normalized sources. It does not execute them.

## 16. Internal Submodules

Implementation may split into these internal modules:

- `src/core/mods/mod-source-registry.ts`
- `src/core/mods/mod-source-loader.ts`
- `src/core/mods/mod-parser.ts`
- `src/core/mods/mod-dependency-resolver.ts`
- `src/core/mods/mod-capability-guard.ts`
- `src/core/mods/mod-runtime.ts`
- optional `src/core/adapters/mod-runtime-main-adapter.ts`

These are implementation seams, not separate public runtime families.

## 17. Minimum Data Model

Child 7 should define at least:

- `ModManifest`
- `LoadedMod`
- `ActivatedMod`
- `ModRuntimeState`
- `ModActivationResult`
- when restore is implemented:
  - `SaveRestoreInput`
  - `RestoreFailure`

Rules:

- builtin, file, and url sources must normalize into one internal shape
- activation output must be sufficient for downstream startup to consume uniformly

## 18. Minimum Runtime Inputs

The minimum request surface should cover:

- `mod.discover`
- `mod.load-builtin`
- `mod.load-file`
- `mod.load-url`
- `mod.select`
- `mod.activate`
- `mod.deactivate`
- `mod.reload`

## 19. Minimum Runtime Outputs

The result surface must include:

- success results
- typed failure results

Minimum failure codes:

- `mod-not-found`
- `parse-failed`
- `dependency-missing`
- `dependency-conflict`
- `capability-rejected`
- `activation-failed`

If restore is included, also define:

- `save-not-found`
- `save-read-failed`
- `save-migration-failed`
- `runtime-restore-failed`

## 20. Activation Handoff Rule

Downstream consumers should care only about:

- which mod is active
- which normalized content sources or definitions are available after activation
- which startup profile or entrypoint should be used

Downstream consumers must not care whether the mod came from builtin, file, or url source.

## 21. Default Builtin Rule

- The builtin default game should gradually become a first-party mod.
- Builtin startup must flow through the same activation seam as imported mods.
- Imported scenario packs should not remain permanent special startup entrypoints.

## 22. Transition / Compatibility Rule

- Child 7 v1 may remain compatible with current `main.ts` startup flow.
- An adapter may bridge `ModActivationResult` into the current content-assembly path.
- The runtime boundary comes first; legacy branch replacement can happen incrementally.
- v1 does not require finishing every startup rewrite at once.

## 23. v1 Minimal Scope

Child 7 v1 includes:

- builtin mod discovery and load
- file import load
- url import load
- parsing
- selection
- minimum dependency/conflict/capability validation
- activation-result handoff
- first extraction of mod-related startup decisions from `main.ts`

Child 7 v1 excludes:

- full startup rewrite
- full save/load redesign
- full downstream runtime registration refactor
- final content-assembly rewrite
- plugin sandboxing
- hot reload
- authoring UI

## 24. Acceptance Criteria

Child 7 is acceptable only when:

1. builtin default mod can discover, load, and activate through `Mod Runtime`
2. file-imported packs can discover, load, and activate through the same runtime path
3. url-imported packs can discover, load, and activate through the same runtime path
4. `src/main.ts` no longer owns mod parse or activate decisions directly
5. mod-related startup decisions in `src/main.ts` are demonstrably being extracted into Child 7 seams
6. downstream startup can consume one unified activation result
7. save/load restore does not bypass `Mod Runtime`
8. `Mod Runtime` does not absorb content-assembly ownership
9. `Mod Runtime` does not absorb gameplay runtime execution ownership

## 25. Explicit Non-Goals

Child 7 does not include:

- plugin sandboxing
- hot reload
- live mod editor
- save-slot UI
- delete confirmation UI
- save sorting/filtering UX
- multi-profile save management
- multiplayer mod negotiation
- save-migration implementation details
- downstream gameplay runtime redesign

## 26. Boundary Audit Checklist

Before closeout, verify:

- `Mod Runtime` is not directly merging content
- `Mod Runtime` is not directly constructing final app state
- `Mod Runtime` is not executing task/event/scene/interactive flows
- save/load is not bypassing `Mod Runtime`
- `src/main.ts` no longer directly decides mod parse/activate behavior
- builtin, file, and url sources converge on one activation output shape

## 27. Manifest Schema Boundary

Child 7 must clarify:

- whether `schemaVersion` is required
- which manifest fields are required versus optional
- how missing fields, invalid types, and illegal values are classified
- who owns forward-compatibility for future manifest-schema upgrades

## 28. Source Adapter Contract

Child 7 must define one source contract for builtin, file, and url inputs:

- minimum source input shape
- minimum loader output shape
- loader owns retrieval
- parser owns interpretation
- `Mod Runtime` owns orchestration and state advancement

## 29. Activation Transaction Rule

Child 7 must define:

- whether `mod.activate` is atomic
- whether activation failure rolls back to the previous stable state
- whether half-activated state is allowed
- whether activation handoff becomes visible only after all validation passes

V1 rule:

- activation should be treated as an atomic transaction
- failure must not leave partial active-mod state behind

## 30. Deactivate / Switch Rule

Child 7 must define:

- the meaning of `mod.deactivate`
- the rules for switching from mod A to mod B
- whether v1 supports live active-mod switching during gameplay

V1 rule:

- startup-time and restore-time activation are required
- mid-game hot switching is not required

## 31. Idempotency And Re-entry Rule

Child 7 must define:

- whether repeated `mod.discover` is allowed
- whether repeated activation of the same mod is idempotent
- whether restore retry or UI retry may re-enter the runtime safely

Recommended v1 behavior:

- `discover` may be repeated
- repeated `load` or `activate` for the same stable source should be idempotent when no state changed

## 32. Async / Cancellation Boundary

Child 7 must define:

- file and url loads as asynchronous flows
- how older requests behave when newer requests supersede them
- whether the concurrency rule is single-flight or last-request-wins
- whether request ids or activation tokens are required

Recommended v1 behavior:

- only one activation transaction may commit at a time
- an older request must not overwrite the result of a newer one

## 33. Content Precedence Signaling

Even though `Mod Runtime` does not assemble final content, it must still communicate:

- which content acts as base
- which content acts as override
- how precedence is signaled to downstream content assembly through activation output

## 34. Startup Profile Contract

Child 7 must define `startupProfile` formally:

- allowed fields
- which fields come from the mod
- which fields come from boot/runtime policy
- priority order between default start, imported-scenario start, and restored start

Minimum suggested fields:

- `playerCharacterId`
- `mapId`
- `cityId`
- `houseId`
- `view`

## 35. Asset Resolution Boundary

Child 7 must define:

- how builtin, file, and url mod assets are normalized
- who resolves relative, blob, and absolute URLs
- who owns asset-URL lifecycle

Recommended v1 behavior:

- source-specific asset resolution belongs to source loader and parser
- activation output should expose stable downstream-consumable asset references

## 36. Registry Ownership Rule

Child 7 must define:

- who owns `availableModsById`
- where activated definitions and content sources are registered
- whether registry data is private mod-runtime state or part of shared registry state
- which modules have write access and which modules only read

## 37. Builtin Default Ownership Rule

Child 7 must define:

- who provides the builtin default manifest
- who provides the builtin default content source
- whether builtin default is statically registered or exposed through a source adapter
- how equivalent builtin and imported mods must be at the contract layer

## 38. Save Metadata Minimum Contract

In addition to `selectedModId`, Child 7 should clarify:

- `savedModVersion`
- `savedManifestSchemaVersion`
- `savedModDisplayName`
- optionally `savedContentVersion`

Rules:

- these fields exist for diagnostics, compatibility, and list display
- these fields do not become activation authority by themselves

## 39. Compatibility / Fallback Policy

Child 7 must define:

- what is allowed when a mod is incompatible
- what is explicitly forbidden
- whether the game may remain at the main menu while surfacing a typed error
- whether future manual replacement-mod selection is allowed

V1 rule:

- automatic fallback behavior is forbidden

## 40. Diagnostics And Error Surface

Child 7 must define:

- machine-readable error codes
- user-visible error messages
- debug or log diagnostics
- which failures require structured fields
- that UI must not depend on string comparison of ad hoc error text

## 41. Verification Matrix

The minimum verification matrix must cover:

- builtin activate success
- file activate success
- url activate success
- manifest parse failure
- dependency missing
- dependency conflict
- capability rejection
- restore with missing mod
- restore with incompatible mod
- duplicate activation of the same mod
- canceled or superseded load requests
- activation failure leaves no partial active state

## 42. Legacy Exit Criteria

Child 7 must explicitly record:

- which legacy branches may remain after v1
- which legacy branches must shrink into adapters
- which old functions should be removed or downgraded in v2
- what condition proves that mod-related startup decisions have been initially extracted from `src/main.ts`

## 43. Concurrency Boundary

Child 7 must define:

- whether only one active mod may exist at a time
- whether discover/load/activate may run concurrently
- whether activation tokens or request ids are required
- which request wins if restore-time startup conflicts with user-triggered startup

Recommended v1 behavior:

- only one active mod exists at a time
- activation commit is serialized
- older results must not overwrite newer activation requests

## 44. Security / Trust Boundary

Child 7 must treat file- and url-imported mods as external input.

Rules:

- capability guards are declaration-level validation, not sandboxing
- v1 does not promise execution isolation
- v1 promises contract-level validation and explicit failure signaling only
