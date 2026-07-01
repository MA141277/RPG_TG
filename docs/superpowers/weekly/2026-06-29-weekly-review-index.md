# Weekly Review Index

**Week Of:** `2026-06-29`

**Weekly Plan:** `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

**Weekly Visibility Companion:** `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`

**Primary Child Plan(s):**

- `docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md`

**Queued Next Child Plan(s):**

- `None currently queued ahead of Child 11 in the active weekly queue`

## Weekly Summary

- This week is focused on making the `mod-first` engine/runtime extraction executable and legible.
- Child 1, Child 2, and Child 3 are now complete in isolated worktrees.
- Child 4 is now complete in its isolated worktree, with its first two batches landing both the initial interactive-runtime bridge and the minimum RuntimeState/shared-dispatch carrier under `src/core`.
- Child 5 is now complete: `src/application/presenter` owns presenter output, `src/main.ts` assembles render input through `createAppPresenterOutput()`, and `src/ui/app-render.ts` consumes presenter output instead of importing gameplay selection helpers directly.
- Child 6 is now complete: `src/core/contracts/task-runtime.ts` and `src/core/runtime/task-runtime.ts` own formal Task Runtime contracts, minimum lifecycle, signal-driven progression, and taskUpdates/effects/signals result output.
- Child 7 is now complete: `src/core/contracts/mod-runtime.ts`, `src/core/mods/*`, and `src/core/adapters/mod-runtime-main-adapter.ts` own the first formal Mod Runtime activation/startup seam, and `src/main.ts` routes builtin, file, url, and restore selected-mod activation through it.
- Child 8 is now complete: `src/core/contracts/state-sync-runtime.ts` and `src/core/runtime/state-sync-*` own the first formal StateSync Runtime canonical boundary, mandatory triggers, syncState entrypoint, state helper modules, and bridge-period main.ts state helper migration.
- Child 9 is now complete: `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md` and `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md` now govern a completed shared-contract baseline for typed RuntimeRequest/Router, Interactive/Minigame Dispatch, Effect Settlement, and minimum House Runtime Request hardening.
- Child 10 is now completed: `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`, `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`, and `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md` now form the finalized post-Child-9 review/baseline package that freezes Child 11 execution boundaries.
- Child 11 now has a formal spec and plan at `docs/superpowers/specs/2026-07-01-sub-runtime-ownerization-implementation-spec.md` and `docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md`, and weekly unlock sync now records it as the next executable child.
- The five-core-artifact visibility bundle exists so the same week also produces readable module, control-flow, split-review, architecture, and change-impact outputs.

## Active Focus

- Child 9 Runtime Contract Hardening is now completed.
- Child 10 Runtime Ownerization Review And Baseline is now completed on the finalized owner/bridge baseline.
- Child 11 Sub-Runtime Ownerization Implementation is now the next executable child.
- Child 11 is unlocked and not-started; implementation must begin from its own plan rather than from queue prose.

## Artifact Index

- Review index and change impact summary:
  - `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- Module map:
  - `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- Call flows:
  - `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- Next split review:
  - `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

## Merged Artifact Ownership

- `weekly-boundary-checklist` is now covered by `weekly-module-map`.
- `weekly-change-impact` is now covered by this review index.
- `weekly-module-backlog` is now covered by `weekly-next-split-review`.

The old files may remain as historical references, but they are no longer independent weekly acceptance artifacts.

## Verification Summary

- `npm run build:test`: `PASS`
- `node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime"`: `PASS`
- `node --test tests/robustness.test.cjs --test-name-pattern "runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"`: `PASS`
- `node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime returns shared RuntimeResult|covered interactive flows through core runtime"`: `PASS`
- `node --test tests/robustness.test.cjs --test-name-pattern "no longer imports gameplay selection helpers directly|top-level presenter output seam|assembles render input through application presenter output"`: `PASS`
- `node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract exports|task runtime exports lifecycle|starts one instance per task id|broadcasts one signal|failed tasks as terminal|task runtime result carries|progresses active tasks|signal-only failure conditions"`: `PASS`
- `node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports|mod runtime normalizes builtin file and url sources|mod runtime activation is atomic|mod runtime main adapter lets startup consume|save restore re-activates selected mod|mod runtime does not absorb content assembly"`: `PASS`
- `node --test tests/robustness.test.cjs --test-name-pattern "state sync runtime contract exports|state sync trigger contract includes|state sync runtime exports one small sync entrypoint|main.ts does not add new feature-specific state sync branches"`: `PASS`
- `npm run typecheck`: `PASS`
- `npm test`: `PASS`
- `npm run build`: `PASS`
- `npm run lint:plans`: `PASS`

## Weekly Outcome

### Completed

- Weekly orchestration plan, parent plan, child boundary plan, and visibility companion are authored.
- Child 1 Task 1 landed the first `src/core/contracts` files and their regression tests.
- `tsconfig.test.json` now includes `src/core/**/*.ts`, so `.test-dist` covers the new boundary.
- Child 1 Task 2 landed `src/core/engine/*` plus upgraded registry typing, proving selected-mod-to-session composition in production code.
- Child 1 Task 3 landed `src/core/runtime/*`, proving routed effects settle back into core-owned state.
- Child 1 Task 4 landed `src/core/save/save-envelope.ts`, proving selected mod identity plus mod state can move through a minimal save seam.
- Child 1 Task 5 landed `src/core/adapters/legacy-main-adapter.ts` and routed `src/main.ts` through that seam.
- Child 2 landed `src/core/save/save-migrations.ts`, `save-loader.ts`, and `save-writer.ts`, proving legacy save normalization, explicit missing-mod rejection, and payload-preserving round-trip behavior.
- Child 3 landed `src/core/runtime/navigation-runtime.ts`, `time-runtime.ts`, `event-runtime.ts`, `scene-runtime.ts`, and related seam files, proving typed runtime request entry for navigation/time plus the first event-to-scene handoff path.
- Child 4 batch 1 landed `src/core/contracts/interactive-runtime.ts`, `src/core/runtime/interactive-runtime.ts`, `src/core/runtime/house-runtime.ts`, and legacy house/interactive adapter files, then rerouted covered city-begging/activity-qte/story-battle entry in `src/main.ts` through those new seams.
- Child 4 batch 2 landed `src/core/contracts/runtime-state.ts`, widened `RuntimeResult` plus the shared router/dispatch/settlement line to `RuntimeState`, kept `RuntimeState.core` on the current domain `GameState`, and proved at least one covered interactive path can return through `dispatchRuntimeRequest()` without merging `characterDefinitions` into `RuntimeState.core`.
- Child 5 landed `src/application/presenter/presenter-output.ts`, `app-presenter.ts`, `stage-presenters.ts`, and `overlay-presenters.ts`; `src/main.ts` now creates presenter output before rendering; `src/ui/app-render.ts` no longer imports `getHouseModule`, `isCityEntryVisibleForStoryStage`, or `selectCityNpcSummariesForHouse` directly.
- Child 6 landed `src/core/contracts/task-runtime.ts` and `src/core/runtime/task-runtime.ts`; Task Runtime now supports start/action/signal entrypoints, duplicate active start guard, terminal failed/completed guard, multiple active task progression from one signal, and returned taskUpdates/effects/signals without applying effects.
- Child 7 landed `src/core/contracts/mod-runtime.ts`, `src/core/mods/mod-source-registry.ts`, `mod-source-loader.ts`, `mod-parser.ts`, `mod-dependency-resolver.ts`, `mod-capability-guard.ts`, `mod-runtime.ts`, and `src/core/adapters/mod-runtime-main-adapter.ts`; Mod Runtime now supports source descriptors, loaded/activated mod contracts, source normalization/loading/parsing, dependency/capability validation, atomic activation rollback, unified activation handoff, and builtin/file/url/restore activation calls from `src/main.ts`.
- Child 8 landed `src/core/contracts/state-sync-runtime.ts`, `src/core/runtime/state-sync-runtime.ts`, validation, normalization, hydration, app-bridge, save, mod-rebuild, and presentation helper modules; StateSync Runtime now defines canonical runtime state authority, app/save/presentation boundaries, mandatory triggers, and a small syncState entrypoint while moving bridge-period RuntimeState helpers out of `src/main.ts`.
- Child 9 is now fully executed and closed, converting runtime contract hardening from a queued slice into a completed shared baseline ahead of ownerization review.

### Deferred

- Child 4 is now closed on the approved minimum RuntimeState carrier.
- Child 5 presenter/render work is now closed on the first presenter output bridge.
- Child 6 Task Runtime is now closed on the first formal contract/lifecycle/progression slice.
- Child 7 Mod Runtime is now closed on the first formal activation/startup seam.
- Child 8 StateSync Runtime is now closed on the first formal canonical boundary slice.
- Child 9 Runtime Contract Hardening is now completed; RuntimeRequest/Router, Interactive/Minigame Dispatch, Effect Settlement, and House Runtime Request baselines all exist.
- Child 10 Runtime Ownerization Review And Baseline is now completed as the controlling baseline child.
- Child 11 Sub-Runtime Ownerization Implementation is now recorded as unlocked and not-started.

### Blockers

- None recorded yet in the weekly visibility scope.

## Change Impact Summary

| Change Area | Intended Impact | Unexpected Impact | Follow-Up Needed |
| --- | --- | --- | --- |
| `weekly governance` | Parent, child, weekly, visibility, and closeout sync state are explicit. | `none` | Keep closeout sync mandatory before future queue promotions. |
| `src/core/contracts` | Introduce and widen shared contracts through `RuntimeState`, `RuntimeResult`, and interactive signals. | `contained`: `characterDefinitions` could not safely merge into `RuntimeState.core` yet. | Keep `characterDefinitions` deferred behind the weekly promotion gate. |
| `src/core/runtime` | Move navigation/time/event/scene and covered interaction entry behind core seams. | `contained`: some interactive paths still use dedicated bridge helpers instead of one final router shape. | Hold stable during Child 5; revisit through a later runtime-consolidation child only if needed. |
| `src/core/runtime/task-runtime.ts` | Introduce formal task lifecycle and signal progression ownership. | `contained`: no task UI, authoring DSL, or custom evaluator plugin yet. | Keep stable while Child 8 extracts StateSync boundaries. |
| `src/core/mods` | Introduce formal Mod Runtime activation/startup ownership. | `contained`: full hot reload, sandboxing, authoring tools, and deeper capability/dependency policy are still future work. | Keep stable while Child 8 extracts StateSync boundaries. |
| `src/core/runtime/state-sync-*` | Introduce canonical runtime/app/save/presentation synchronization ownership. | `contained`: full save IO integration, runtime dispatch auto-commit integration, and full legacy migration remain future work. | Review before deciding whether a follow-up child is justified. |
| `src/core/save` | Harden loader/writer/migration behavior. | `none` | Keep shape stable while Child 8 formalizes state sync around the existing save/load boundary. |
| `src/main.ts` | Shrink black-box ownership through core adapters, runtime seams, presenter assembly, task runtime ownership, Mod Runtime activation calls, and StateSync bridge helper extraction. | `contained`: browser shell and many runtime event handlers remain in main. | Review remaining coupling before authoring another child. |
| `src/application/presenter` | Introduce a real presenter output bridge for stage, overlay, HUD, scene, and house render selection. | `contained`: layout renderer remains future work. | Keep stable while Child 8 extracts state sync. |
| `src/ui/app-render.ts` | Reduce app render to presenter output consumption plus existing renderer calls. | `none` | Do not move gameplay selection back into UI. |

## Next Week Input

- Highest-priority module to refine:
  - `Child 11 Sub-Runtime Ownerization Implementation`
- Why it is next:
  - Child 10 is complete, Child 11 spec/plan authoring is complete, and the next controlled step is to execute Child 11 against the frozen baseline without reopening it.
- Category:
  - `Child 11 implementation`
- Queued follow-up after the next child:
  - `Child 13 Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit is now recorded as the preferred post-Child-11 runtime continuation candidate, while Child 12 UI Contract Reserve remains preserved as a later reserve child.`
- Unlock dependency after that:
  - `Child 13 still requires Child 11 completion plus a post-Child-11 unlock review before implementation may start. Child 12 remains locked behind Child 13 resolution or explicit bypass plus a later weekly unlock review.`
