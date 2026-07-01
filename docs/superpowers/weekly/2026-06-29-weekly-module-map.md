# Weekly Module Map

**Week Of:** `2026-06-29`

## Purpose

This file is the readable module map for the current weekly state of the repository.

If a module cannot be summarized here, it is still acting like a black box.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `legacy` | Current browser bootstrap shell plus remaining legacy gameplay orchestration root. | UI/browser events, Mod Runtime activation handoff, content activation, runtime actions. | App boot, presenter assembly, render loop, runtime transitions. | `application/*`, `ui/*`, `src/core/adapters/legacy-main-adapter.ts`, `src/core/adapters/mod-runtime-main-adapter.ts`, `src/core/mods/mod-runtime.ts`, `src/core/runtime/*`, content modules. | Entire runtime today. | Boot composition now hands through the adapter seam, Child 3 moved real navigation/time/event entry through runtime wrappers, Child 4 moved covered interactive entry/return through core seams, Child 5 moved render-input assembly through `createAppPresenterOutput()`, Child 7 moved builtin/file/url/restore selected-mod activation through Mod Runtime, Child 8 moved bridge-period RuntimeState helper declarations into StateSync, Child 11 Task 1 removed the first covered post-dispatch story-battle reenter-house branch from `main.ts`, Child 11 Task 2 removed the covered city-begging completion-time advance/cleanup branch from `onBeggingGameComplete()`, Child 11 Task 3 keeps the covered grain-shop lifecycle on core-owned house runtime entrypoints instead of a legacy adapter-owned dispatch helper, and Child 13 removed the remaining same-type inline story-battle follow-up branch by routing that continuation through `houseRuntime.applyInteractiveFollowUp()`. Browser/runtime event handling still remains largely legacy-held. |
| `src/core/contracts` | `official` | Shared boundary for mod manifest, mod runtime, runtime state/result, effects, navigation, engine context typing, minimum interactive carrier, Task Runtime contracts, and StateSync contracts. | Boundary spec, Child 1 Tasks 1-5, Child 4 batch 2, Child 6, Child 7, Child 8. | Typed engine/runtime contracts under `src/core/contracts/*`, including `task-runtime.ts`, `mod-runtime.ts`, and `state-sync-runtime.ts`. | Boundary spec, registry typing. | `core/engine`, `core/runtime`, `core/mods`, `core/save`, adapters, later presenter/UI seams. | Validated this week by selected-mod bootstrap, runtime dispatch, save envelope, main handoff, RuntimeState, Task Runtime, Mod Runtime, and StateSync contract tests. Child 9 has already completed the approved hardening pass for typed `RuntimeRequest/Router`, formal interactive/minigame dispatch, formal effect settlement, and minimum house-runtime request contracts. |
| `src/core/registry` | `provisional` | Typed registry ownership seam for mods and content. | Child 1 Tasks 1-2. | `engine-registry.ts`, `mod-registry.ts`, `content-registry.ts`. | `src/core/contracts`. | `src/core/engine`; future `src/core/runtime`. | Registry composition is still thin, but it now models selected mods explicitly instead of using `unknown`. |
| `src/core/engine` | `provisional` | Compose a selected mod and EngineRegistry into the first EngineSession state shell. | `GameModManifest`, `EngineRegistry`. | `EngineSession`, bootstrap helper. | `core/contracts`, `core/registry`. | `core/runtime`, `core/save`, `core/adapters/legacy-main-adapter`. | Implemented and now validated end-to-end through the adapter seam, but still intentionally minimal. |
| `src/core/runtime` | `provisional` | Own typed runtime request entry for navigation/time plus transitional event, scene, house, covered interactive launch/action seams, covered settlement alignment, and the first formal Task Runtime lifecycle/progression seam over the minimum RuntimeState carrier. | `RuntimeRequest`, `RuntimeState`, task definitions/actions/signals, route callback output, trigger inputs, narrowed legacy compatibility surfaces. | Settled `RuntimeResult`, task runtime results, effect-applied runtime state, runtime wrapper results for navigation/time/event/scene entry, and bridge-level interactive/house handoff results. | `core/contracts`, registries, engine session, `src/core/adapters/*`, `application/navigation/*`, `application/time/*`, `application/events/*`, `application/scene/*`. | `src/main.ts`; future interactive/event/task/navigation runtime services. | Expanded this week by Child 3, Child 4, and Child 6. It now includes minimum RuntimeState/shared-dispatch carrier plus `task-runtime.ts`. Child 10 froze the ownerization scope, Child 11 Task 1 added a typed shared follow-up contract plus dispatch-owned handling for the covered story-battle reentry path, Child 11 Task 2 moved one covered city-begging launch/action/follow-up lifecycle fully under `interactive-runtime.ts` while narrowing the legacy interactive adapter, Child 11 Task 3 moved one covered grain-shop house enter/action/leave lifecycle under `house-runtime.ts` while reducing the legacy house adapter to a placeholder, Child 11 Task 4 aligned covered advanceTime application under `runtime-settlement.ts` for the approved interactive/house slices, and Child 13 closed the remaining same-type in-scope shared-dispatch reentry remainder by letting `house-runtime.ts` own the converged `applyInteractiveFollowUp()` path. |
| `src/core/runtime/task-runtime.ts` | `official` | Own minimum task creation, explicit task actions, signal-driven progression, duplicate active task guard, terminal failed/completed guard, and task runtime result output. | Registered `TaskDefinition` records, `TaskRuntimeState`, `TaskAction`, `TaskSignal`. | `TaskRuntimeResult` with updated state, `taskUpdates`, returned `effects`, and follow-up `signals`. | `src/core/contracts/task-runtime.ts`, `src/core/contracts/effect.ts`. | Future event/scene/interaction/time producers and shared runtime settlement. | Child 6 first version supports built-in standard condition types only; it does not own event activation, scene/interaction sessions, time advancement, save/load IO, presenter output, or effect application. |
| `src/core/mods` | `official` | Own the first formal Mod Runtime activation/startup seam: source normalization/loading/parsing, dependency and capability validation, atomic activation, and unified activation handoff. | `ModSourceDescriptor`, `LoadedMod`, `ModRuntimeState`, `ModRuntimeRequest`, scenario-pack or builtin source payloads. | `ModActivationResult`, `ActivatedMod`, startup profile, normalized content sources, typed failures. | `src/core/contracts/mod-runtime.ts`, `src/core/contracts/mod-manifest.ts`, `src/core/adapters/mod-runtime-main-adapter.ts`. | `src/main.ts`, engine/bootstrap handoff, future StateSync and content assembly consumers. | Child 7 first version does not own final content assembly, save/load IO, gameplay runtime execution, UI/menu/loading-screen flow, hot reload, sandboxing, or authoring tools. |
| `src/core/runtime/state-sync-*` | `official` | Own the first formal StateSync Runtime canonical boundary: canonical runtime state, app bridge, save snapshot, presentation input, mandatory triggers, syncState, validation, normalization, hydration, pre-save preparation, mod rebuild, and presentation input preparation. | `CanonicalRuntimeState`, `StateSyncTrigger`, `StateSyncContext`, bridge-period `RuntimeState`, optional app/save/presentation inputs. | `StateSyncResult`, normalized canonical runtime state, optional app bridge, save snapshot, and presentation input. | `src/core/contracts/state-sync-runtime.ts`, bridge-period runtime-state contracts. | `src/main.ts`, future runtime dispatch/save/presentation consumers. | Child 8 first version does not own gameplay dispatch, save IO, Mod Runtime activation, presenter/render, or feature-specific business logic. |
| `src/core/save` | `official` | Persistence boundary for envelope creation, legacy-save normalization, selected-mod validation, and payload-preserving serialization. | `CoreGameState`, save version, legacy save-like records, available mod ids. | `SaveEnvelope`, migrated envelopes, serialized save payloads. | `core/contracts`. | Future app-level save/load callers and state-sync flows. | Hardened this week by Child 2 without redefining Child 1's initial envelope shape. |
| `src/core/adapters` | `adapter` | Temporary compatibility seam from old runtime root into new `core` boundary. | Legacy main/runtime paths, house runtime creation, interactive minigame/story-battle helpers. | Handoff seams into core bootstrap and transitional runtime bridges. | `src/main.ts`, `core/engine`, `core/runtime`. | `src/main.ts`, `src/core/runtime`. | `legacy-main-adapter.ts`, `legacy-house-adapter.ts`, and `legacy-interactive-adapter.ts` now exist and should stay thin while later children peel more logic out of `main.ts` and application-owned runtime services. Child 9 may preserve these adapters behind formalized contracts, but must not remove them as part of contract hardening. |
| `src/application/house/*` | `adapter-backed` | Current house business logic, house session behavior, and house-module-level request handling behind the Child 4 bridge seam. | House UI/browser actions, bridge runtime requests, domain house/module state. | House session mutations, minigame/trade/dialogue side effects, and compatibility handoff back toward app/runtime layers. | `src/core/runtime/house-runtime.ts`, domain house modules, application services. | `src/main.ts`, `src/core/runtime/house-runtime.ts`, presenter selection logic. | This is not a Child 9 ownerization target. Child 9 only needs a minimum core-owned public request seam so later ownerization can stop depending on domain `HouseModuleRequest` directly. |
| `src/application/presenter` | `provisional` | Present application/runtime state as render-facing presenter output. | `AppState`, content definitions, house/city/story lookup data. | Stage presenter output, overlay/HUD state, scene action/choice output, house render selection. | existing application services, domain definitions, house module registry. | `src/main.ts`, `ui/app-render.ts`, future layout bridge. | Landed by Child 5 with `presenter-output.ts`, `app-presenter.ts`, `stage-presenters.ts`, and `overlay-presenters.ts`; it now owns render-time gameplay selection formerly inside `app-render.ts`. |
| `src/ui/layout-renderer.ts` | `planned` | Schema-driven layout rendering seam for player-facing UI. | Presenter output, layout schemas. | Renderable layout output. | presenter output, layout schema. | `ui/app-render.ts`. | Planned but not yet in production control path. |
| `docs/superpowers/plans/*` | `official` | Execution governance and implementation sequencing. | Specs, user decisions, repo state. | Plans, progress, resume points. | `docs/superpowers/specs/*`. | Human/Codex execution flow. | Now includes parent, child, weekly, and visibility companion layers. |

## Status Legend

- `official`
  - stable intended module boundary
- `adapter`
  - transition-only compatibility seam
- `adapter-backed`
  - legacy-owned business logic currently consumed through a formal or provisional bridge
- `provisional`
  - likely to change after more integration
- `planned`
  - approved target boundary, not yet implemented
- `legacy`
  - old module not yet migrated into the current boundary

## Boundary Checklist

### Stable Boundaries

- [x] Parent plan and child plan orchestration boundary.
- [x] Weekly orchestration and weekly visibility companion roles.
- [x] Child 4 closeout state: completed on the approved minimum RuntimeState carrier.
- [x] Child 6 closeout state: completed on the first formal Task Runtime contract/lifecycle/progression slice.
- [x] Child 7 closeout state: completed on the first formal Mod Runtime activation/startup seam.
- [x] Child 8 closeout state: completed on the first formal StateSync Runtime canonical boundary slice.
- [x] Child 9 queue state: completed as Runtime Contract Hardening, still limited to contract closure and not ownerization.
- [x] Child 10 queue state: completed as Runtime Ownerization Review And Baseline and still limited to review/baseline governance, not production ownerization.
- [x] Child 11 queue state: completed on covered shared follow-up, covered interactive, covered house, and covered settlement ownerization for the approved slices.
- [x] Child 12 queue state: completed on the additive UI layout/interface-reserve landing.
- [x] Child 13 queue state: completed on the remaining same-type shared-dispatch follow-up/reentry convergence audit.

### Provisional Boundaries

- [x] `src/core/contracts`
- [x] `src/core/registry/engine-registry.ts`
- [x] `src/core/engine`
- [x] `src/core/runtime`
- [x] `src/core/mods`
- [x] `src/core/runtime/state-sync-*`
- [x] `src/core/save`
- [x] `src/application/presenter`
- [ ] `src/ui/layout-renderer.ts`
- [x] Child 9 direct touch surface is limited to `src/core/contracts`, selected public runtime entrypoints under `src/core/runtime`, and queue/governance docs.

### Adapter Boundaries

- [x] `src/core/adapters/legacy-main-adapter.ts`
- [x] `src/core/adapters/mod-runtime-main-adapter.ts`
- [x] `src/core/adapters/legacy-house-adapter.ts`
- [x] `src/core/adapters/legacy-interactive-adapter.ts`
- [x] Minimum `RuntimeState` carrier exists, but remains a provisional runtime boundary rather than final convergence onto Child 1 `CoreGameState`.

### Missing Contracts

- [x] Event runtime concrete contracts exist.
- [x] Interactive runtime concrete contracts exist.
- [x] Minimum `RuntimeState` and widened `RuntimeResult` contracts exist.
- [x] First formal Task Runtime contracts exist; `Mission` remains content/presentation wording only.
- [x] Full minigame dispatch interface.
- [x] Presenter output contracts.
- [x] First formal `Mod Runtime` activation / capability / dependency contracts exist; deeper policy, sandboxing, hot reload, and authoring tooling remain future hardening.
- [x] First formal `StateSync Runtime` canonical state and trigger-based sync contracts exist; deeper integration remains future hardening.
- [x] Typed shared `RuntimeRequest / Router` contract hardening for Child 9.
- [x] Full `Interactive / Minigame Dispatch` contract hardening for Child 9.
- [x] Formal `Effect Settlement` input/output contract hardening for Child 9.
- [x] Minimum core-owned `House Runtime Request` contract for Child 9.

### Child 9 Boundary Guard

- [x] Child 9 may harden public contracts at `src/core/contracts/*`.
- [x] Child 9 may align public entrypoints under `src/core/runtime/*` to those contracts.
- [x] Child 9 may keep bridge and adapter seams in place during migration.
- [ ] Child 9 must not remove legacy house/interactive adapters as part of the contract child.
- [ ] Child 9 must not expand into UI/layout/presenter or resource-planning work.
- [ ] Child 9 must not ownerize `Interactive Runtime` or `House Runtime`.

### Child 10 And Child 11 Queue Guard

- [x] Child 10 exists to classify owner vs bridge runtime maturity, adapter disposition, and `main.ts` coupling before implementation resumes.
- [x] Child 10 has finalized the controlling baseline at `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`.
- [x] Child 11 is allowed to target shared dispatch convergence, Interaction Runtime ownerization, House Runtime ownerization, and Effect Settlement alignment only because Child 11 spec/plan are now authored against that baseline and the weekly plan records the unlock.
- [x] Child 11 must execute from its own implementation plan and must not treat weekly artifacts as a substitute for the frozen baseline or child-plan checklist.
- [x] Child 11 is now completed and must not be silently reopened as Child 12 or Child 13 backfill.
- [x] Child 12 remains closed as the UI layout/interface-reserve child and must not be reused as runtime-ownerization backfill.
- [x] Child 13 was allowed because Child 11 and Child 12 were complete, and it stayed limited to converging the remaining runtime-owned follow-up and reentry paths for already-covered runtime families.

### Remaining `main.ts` Coupling

- [x] Boot composition now hands through `legacy-main-adapter`.
- [x] Covered interactive launch/action ownership now routes through core seams.
- [x] At least one covered interactive return path now routes through shared runtime dispatch.
- [x] Covered shared follow-up for the story-battle reenter-house path now routes through dispatch-owned follow-up handling, and Child 13 closes the remaining inline shell-owned follow-up remainder by delegating to `houseRuntime.applyInteractiveFollowUp()` instead of branching in `src/main.ts`.
- [ ] Concrete content activation.
- [x] Mod activation for builtin, file-imported, url-imported, and saved selected-mod startup now routes through Mod Runtime before content assembly.
- [x] Bridge-period interactive RuntimeState creation/write-back helpers no longer live as direct function declarations in `src/main.ts`.
- [x] Render-input presenter assembly.
- [ ] Browser-only runtime follow-up and view switching.

## Questions Raised This Week

- Should `src/application/presenter` stay under `application`, or eventually move partially into `core` after the seam stabilizes?
- How thin can `src/main.ts` become in Child 1 without forcing premature feature migration?
- Which remaining interactive and house-owned launch paths still bypass the new Child 4 bridge seams or the widened shared-dispatch line?
- Which current `RuntimeRequest` families need to become formal typed request variants in Child 9, and which ones should remain out of scope until later ownerization work?
- Where should the public `House Runtime Request` contract stop so it does not leak domain `HouseModuleRequest` into core ownership?
- Should `EngineRegistry` keep only abstract lookup tables in `src/core`, with concrete content/module assembly remaining outside `core` during migration?
- Which presenter output fields should become stable contracts before the future layout renderer boundary is introduced?
