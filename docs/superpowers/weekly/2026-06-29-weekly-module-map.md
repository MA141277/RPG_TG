# Weekly Module Map

**Week Of:** `2026-06-29`

## Purpose

This file is the readable module map for the current weekly state of the repository.

If a module cannot be summarized here, it is still acting like a black box.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `legacy` | Current browser bootstrap shell plus remaining legacy gameplay orchestration root. | UI/browser events, content activation, runtime actions. | App boot, render loop, runtime transitions. | `application/*`, `ui/*`, `src/core/adapters/legacy-main-adapter.ts`, `src/core/runtime/*`, content modules. | Entire runtime today. | Boot composition now hands through the adapter seam, and Child 3 moved real navigation/time/event entry through runtime wrappers, but most view/render/interactive orchestration is still legacy-owned. |
| `src/core/contracts` | `official` | Shared boundary for mod manifest, core state, runtime request/result, effects, navigation, and engine context typing. | Boundary spec, Child 1 Tasks 1-5. | Typed engine/runtime contracts under `src/core/contracts/*`. | Boundary spec, registry typing. | `core/engine`, `core/runtime`, `core/save`, adapters, later presenter/UI seams. | Validated this week by selected-mod bootstrap, runtime dispatch, save envelope, and main handoff tests. |
| `src/core/registry` | `provisional` | Typed registry ownership seam for mods and content. | Child 1 Tasks 1-2. | `engine-registry.ts`, `mod-registry.ts`, `content-registry.ts`. | `src/core/contracts`. | `src/core/engine`; future `src/core/runtime`. | Registry composition is still thin, but it now models selected mods explicitly instead of using `unknown`. |
| `src/core/engine` | `provisional` | Compose a selected mod and EngineRegistry into the first EngineSession state shell. | `GameModManifest`, `EngineRegistry`. | `EngineSession`, bootstrap helper. | `core/contracts`, `core/registry`. | `core/runtime`, `core/save`, `core/adapters/legacy-main-adapter`. | Implemented and now validated end-to-end through the adapter seam, but still intentionally minimal. |
| `src/core/runtime` | `provisional` | Own typed runtime request entry for navigation/time plus transitional event candidate activation and scene handoff seams. | `RuntimeRequest`, `CoreGameState`, legacy `GameState`, route callback output, trigger inputs. | Settled `RuntimeResult`, effect-applied core state, runtime wrapper results for navigation/time/event/scene entry. | `core/contracts`, registries, engine session, `application/navigation/*`, `application/time/*`, `application/events/*`, `application/scene/*`. | `src/main.ts`; future interactive/event/task/navigation runtime services. | Expanded this week by Child 3, but it still bridges into legacy gameplay services rather than owning the full runtime end to end. |
| `src/core/save` | `official` | Persistence boundary for envelope creation, legacy-save normalization, selected-mod validation, and payload-preserving serialization. | `CoreGameState`, save version, legacy save-like records, available mod ids. | `SaveEnvelope`, migrated envelopes, serialized save payloads. | `core/contracts`. | Future app-level save/load callers and state-sync flows. | Hardened this week by Child 2 without redefining Child 1's initial envelope shape. |
| `src/core/adapters` | `adapter` | Temporary compatibility seam from old runtime root into new `core` boundary. | Legacy main/runtime paths. | Handoff seam into core bootstrap/presenter. | `src/main.ts`, `core/engine`, `application/presenter`. | `src/main.ts`. | `legacy-main-adapter.ts` is now implemented and should stay thin while later children peel more logic out of `main.ts`. |
| `src/application/presenter` | `provisional` | Present core/runtime state as renderable schema-driven outputs. | Core game state, runtime view data. | Presenter output for UI. | `core/contracts`, existing runtime data. | `ui/app-render.ts`, `ui/layout-renderer.ts`. | First seam only; full decoupling deferred. |
| `src/ui/layout-renderer.ts` | `provisional` | Schema-driven layout rendering seam for player-facing UI. | Presenter output, layout schemas. | Renderable layout output. | `core/contracts/presenter`, layout schema. | `ui/app-render.ts`. | Planned but not yet in production control path. |
| `docs/superpowers/plans/*` | `official` | Execution governance and implementation sequencing. | Specs, user decisions, repo state. | Plans, progress, resume points. | `docs/superpowers/specs/*`. | Human/Codex execution flow. | Now includes parent, child, weekly, and visibility companion layers. |

## Status Legend

- `official`
  - stable intended module boundary
- `adapter`
  - transition-only compatibility seam
- `provisional`
  - likely to change after more integration
- `legacy`
  - old module not yet migrated into the current boundary

## Questions Raised This Week

- Should `src/application/presenter` stay under `application`, or eventually move partially into `core` after the seam stabilizes?
- How thin can `src/main.ts` become in Child 1 without forcing premature feature migration?
- Which interactive and house-owned launch paths should be the first to move behind core-owned dispatch now that Child 3 has already touched navigation and event entry?
- Should `EngineRegistry` keep only abstract lookup tables in `src/core`, with concrete content/module assembly remaining outside `core` during migration?
- How should house-owned minigame/story-battle launch paths consume the new runtime seams without reintroducing `main.ts` as a parallel interactive controller?
