# Core Production Integration Spec

## 1. Goal

This spec defines the closure criteria for moving the already-created Child 1, Child 2, and Child 3 seams from "implemented and partially adopted" to "fully integrated into the production path".

The target is not to redesign the existing engine/runtime roadmap.

The target is to define:

- what production integration means for the current `src/core` boundary
- which gaps still remain after Child 1, Child 2, and Child 3
- which responsibilities must move out of `src/main.ts`
- which acceptance checks prove the cutover is real rather than documentation-only

This spec is intentionally separate from the active weekly queue.

## 2. Non-Goals

This spec does not define:

- Child 4 interactive runtime extraction
- Child 5 presenter/render decoupling
- full Task Runtime extraction
- full House Runtime extraction
- mod manifest loader and builtin-default-mod migration
- new gameplay systems

Those remain separate roadmap items.

## 3. Current Repository State

The repository already contains the first core seams:

- Child 1 introduced `src/core/contracts/**`, `src/core/engine/**`, `src/core/runtime/**`, `src/core/save/save-envelope.ts`, and `src/core/adapters/legacy-main-adapter.ts`
- Child 2 introduced `src/core/save/save-loader.ts`, `save-writer.ts`, and `save-migrations.ts`
- Child 3 introduced `src/core/runtime/navigation-runtime.ts`, `time-runtime.ts`, `event-runtime.ts`, and `scene-runtime.ts`

The repository also already proves selective real adoption:

- `src/main.ts` boots through `bootstrapLegacyMain()`
- some time, navigation, event, and scene entry now call `src/core/runtime/**`
- save compatibility logic exists and is tested

However, the current production path still has three major gaps:

1. `src/core/engine` exists, but the active game session is still owned by `src/main.ts` state wiring rather than a long-lived `EngineSession` owner.
2. `src/core/save/**` exists, but the real save/load entrypoints are not yet centered on `loadSaveEnvelope()` and `serializeSaveEnvelope()`.
3. `src/core/runtime` contains dispatch and router seams, but production flow still calls individual runtime helpers directly instead of going through one stable dispatch chain.

## 4. Why A Separate Closure Spec Is Needed

If Child 1, Child 2, and Child 3 are left in their current partially adopted state, the project can continue to split modules, but later closure work becomes ambiguous.

The ambiguity is:

- a seam file existing is not the same as a production cutover
- a test proving a helper works is not the same as the app depending on that helper
- a `main.ts` import is not the same as `main.ts` no longer owning the feature

This spec resolves that ambiguity by defining exact closure outcomes.

## 5. Production Integration Definition

For this repository, a subsystem is fully integrated into the production path only when all of the following are true:

1. the active browser/runtime flow uses the new `src/core` entrypoint instead of a direct legacy helper path
2. `src/main.ts` no longer owns the feature-specific orchestration that the new core seam was created to absorb
3. regression tests prove the real production entrypoints, not only the helper functions
4. the closure does not re-expand `main.ts` with new special-case branches
5. no unresolved `P0` or `P1` remains in the cutover scope

## 6. Child 1 Required Production Outcomes

Child 1 is fully integrated only when:

- the active app session has one explicit `EngineSession` owner or equivalent core-owned session boundary
- `bootstrapLegacyMain()` returns a production-used session/context rather than an ignored bootstrap artifact
- `src/main.ts` no longer composes core boot state ad hoc after the bootstrap handoff
- `dispatchRuntimeRequest()` is available as the intended runtime entrypoint for production-facing feature cutovers
- the initial state used by production code aligns with the core-owned engine/runtime/mod-state split

Child 1 is not complete merely because:

- `src/core/engine/**` exists
- `legacy-main-adapter.ts` exists
- `src/main.ts` imports the adapter

## 7. Child 2 Required Production Outcomes

Child 2 is fully integrated only when:

- real continue/load entry uses `loadSaveEnvelope()`
- real save/export/persist entry uses `createSaveEnvelope()` plus `serializeSaveEnvelope()`
- save migration and selected-mod validation occur on the actual user-facing load path
- the current production save path has one official core-owned envelope route
- old save compatibility is preserved after production cutover

Child 2 is not complete merely because:

- save helpers compile
- migration tests pass in isolation
- compatibility logic exists only under direct test imports

## 8. Child 3 Required Production Outcomes

Child 3 is fully integrated only when:

- production navigation/time/event/scene entry uses one unified runtime dispatch chain
- `src/main.ts` does not directly orchestrate navigation/time/event/scene sequencing through multiple standalone runtime helper calls
- runtime routing owns request kind selection and feature handoff
- event-to-scene handoff returns through the shared runtime result path
- task action and task signal seams remain additive, but flow through the same production runtime result channel

Child 3 is not complete merely because:

- request factories exist
- event/scene seam files exist
- `main.ts` imports and calls `runNavigationRuntime()` or `runEventRuntime()` directly

## 9. Required Closure Checklist

The future production-integration work must close all items below.

### 9.1 Engine / Bootstrap Closure

- promote `EngineSession` from bootstrap artifact to production-owned session boundary
- define the single source of truth for engine state, runtime state, and mod-owned payload
- remove unused bootstrap-only session creation patterns from `main.ts`
- prove `main.ts` consumes a real core session/context rather than ignoring it

### 9.2 Save / Load Closure

- route continue/load through `loadSaveEnvelope()`
- route save/export through `createSaveEnvelope()` and `serializeSaveEnvelope()`
- validate missing selected mod on the real load path
- keep unknown mod payload preserved after a real save-load-save cycle

### 9.3 Runtime Dispatch Closure

- move navigation/time/event/scene production entry behind `dispatchRuntimeRequest()`
- make `runtime-router.ts` the production routing owner
- reduce `main.ts` to request creation, UI event binding, and render coordination
- preserve additive scene/task seams without pulling full Task Runtime extraction forward

## 10. Design Constraints

The closure work must obey these constraints:

- do not fold Child 4 interactive runtime responsibilities into this closure by accident
- do not fold Child 5 presenter/render decoupling into this closure by accident
- do not reintroduce concrete house, scene, or event business branches into `src/main.ts`
- do not redesign the core contracts unless production integration proves a hard mismatch
- do not create a second parallel save or runtime execution path "for convenience"

## 11. Recommended Sequencing Rule

This spec intentionally does not place the related work into the active weekly queue.

The recommended execution rule is:

- keep this closure package authored and ready
- promote it only after the active queue explicitly decides whether Child 4 and Child 5 should land first
- before execution, reconcile this spec against the latest `src/main.ts`, `src/core/**`, and weekly artifact bundle

## 12. Verification Requirements

Any future implementation plan based on this spec must include:

- `npm run typecheck`
- `npm test`
- `npm run build`
- targeted `tests/robustness.test.cjs` coverage for:
  - real engine-session ownership
  - real save/load entry cutover
  - real dispatch/router ownership over navigation/time/event/scene entry

If a future cutover changes browser-only flow that is not fully covered by existing tests, the plan must also record a manual smoke path.

## 13. Acceptance Criteria

This spec is realized only when:

- Child 1, Child 2, and Child 3 production gaps are all closed
- `src/main.ts` is reduced further toward browser/UI coordination instead of feature orchestration
- core save/load APIs own the real persistence path
- core runtime dispatch/router own the real navigation/time/event/scene request path
- tests prove production path ownership rather than helper existence

## 14. Deferred Items

Even after this spec is realized, the following may still remain for later plans:

- full interactive runtime extraction
- full house runtime extraction
- full task-state machine extraction
- presenter/layout schema cutover
- builtin game as a first-party default mod on top of the final extracted shell
