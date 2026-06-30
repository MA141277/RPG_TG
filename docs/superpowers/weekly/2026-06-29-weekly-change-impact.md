# Weekly Change Impact Record

**Week Of:** `2026-06-29`

## Merged Artifact Notice

This file is retained as a historical reference only.

Active change-impact ownership has moved into:

- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`

Do not treat this file as an independent weekly acceptance artifact after the five-core-artifact consolidation.

## Purpose

Track which modules changed, which modules were expected to change, and which modules changed unexpectedly.

Unexpected impact usually indicates a module that still needs more refinement.

## Change Impact Table

| Change Area | Files Changed | Intended Impact | Unexpected Impact | Follow-Up Needed |
| --- | --- | --- | --- | --- |
| `weekly governance` | `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md` | Clarify parent orchestration and child dependencies. | `none` | Keep parent/child state synced during execution. |
| `child plan hardening` | `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md` | Make Child 1 executable and closer to template requirements. | `none` | Re-check after real implementation begins. |
| `weekly visibility system` | `docs/superpowers/templates/*`, `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`, `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md` | Force de-black-box artifact production. | `none` | Start updating weekly artifacts after Child 1 work begins. |
| `core boundary contracts` | `src/core/contracts/*`, `src/core/registry/engine-registry.ts`, `tests/robustness.test.cjs` | Introduce the first real `src/core` seam and pin it with regression tests. | `minimal`: `engine-context.ts` needed a minimal registry type before Task 2 existed. | Expand this into real engine-session composition in Child 1 Task 2. |
| `test build whitelist` | `tsconfig.test.json` | Ensure `npm test` compiles the new `src/core` files into `.test-dist`. | `real`: the original test build excluded `src/core`, so the first contract import test failed despite passing typecheck. | Keep future new top-level source roots aligned with both production and test compile paths. |
| `engine session seam` | `src/core/engine/*`, `src/core/registry/*`, `tests/robustness.test.cjs` | Prove the first selected-mod bootstrap path and replace the placeholder registry typing with real mod/content registry shapes. | `contained`: the isolated worktree needed a node_modules junction and one temple-house baseline file sync before verification matched the active dev state. | Move next to runtime dispatch/effect settlement without expanding engine scope prematurely. |
| `runtime dispatch seam` | `src/core/runtime/*`, `tests/robustness.test.cjs` | Prove the first routed effect-settlement path under core ownership. | `none` | Move next to minimal save-envelope work without broadening runtime effect scope too early. |
| `save envelope seam` | `src/core/save/save-envelope.ts`, `tests/robustness.test.cjs` | Prove the first stable save identity boundary under `src/core`. | `none` | Use Child 2 to harden loader/writer/migration ownership on top of this seam. |
| `legacy boot adapter seam` | `src/core/adapters/legacy-main-adapter.ts`, `src/main.ts`, `docs/change-log.md`, `tests/robustness.test.cjs` | Route the production boot path through an explicit `main.ts -> core` handoff without prematurely migrating gameplay logic. | `none` | Keep the adapter thin and migrate later behavior behind it instead of reopening direct boot ownership in `main.ts`. |
| `save hardening seam` | `src/core/save/save-migrations.ts`, `src/core/save/save-loader.ts`, `src/core/save/save-writer.ts`, `src/core/save/save-envelope.ts`, `tests/robustness.test.cjs`, `docs/change-log.md` | Harden the persistence boundary so legacy saves normalize, selected mods validate, and unknown mod payload survives round-trip. | `contained`: the Child 2 worktree had to be seeded from the validated dev working-tree state because Child 1 was not committed yet. | Move next to navigation/time/event entry extraction without reopening persistence shape changes. |
| `navigation/time/event runtime seam` | `src/core/contracts/event-runtime.ts`, `src/core/contracts/scene-runtime.ts`, `src/core/contracts/runtime-request.ts`, `src/core/contracts/runtime-result.ts`, `src/core/runtime/*`, `src/main.ts`, `tests/robustness.test.cjs`, `docs/change-log.md` | Move real navigation/time/event entry behind the core runtime boundary and establish the first scene handoff seam. | `contained`: the Child 3 worktree needed one targeted baseline sync of the temple-house module plus zhuyuanzhang text entries before verification matched the passing dev state. | Move next to interactive runtime integration without reopening save ownership or broadening render responsibilities. |
| `interactive runtime bridge seam` | `src/core/contracts/interactive-runtime.ts`, `src/core/adapters/legacy-house-adapter.ts`, `src/core/adapters/legacy-interactive-adapter.ts`, `src/core/runtime/interactive-runtime.ts`, `src/core/runtime/house-runtime.ts`, `src/main.ts`, `tests/robustness.test.cjs`, `docs/change-log.md` | Move covered city-begging/activity-qte/story-battle entry and house-runtime construction behind new core bridge seams without redesigning the underlying legacy gameplay modules yet. | `contained`: request-factory helpers initially violated TypeScript exact optional-property rules by emitting `payload: undefined`, and the isolated worktree still needed the shared `node_modules` junction to match the validated dev environment. | Decide next whether Child 4 should also wire these request ids into `runtime-router.ts` / `runtime-dispatch.ts`, then keep shrinking direct `main.ts` ownership. |
| `minimum RuntimeState carrier` | `src/core/contracts/runtime-state.ts`, `src/core/contracts/runtime-result.ts`, `src/core/runtime/runtime-router.ts`, `src/core/runtime/runtime-dispatch.ts`, `src/core/runtime/runtime-settlement.ts`, `src/core/runtime/interactive-runtime.ts`, `src/main.ts`, `tests/robustness.test.cjs`, `docs/change-log.md` | Land the smallest shared state/result carrier that lets covered interactive flows return through the shared runtime line without prematurely converging Child 4 onto Child 1 `CoreGameState` or merging `characterDefinitions` into `RuntimeState.core`. | `contained`: settlement logic needed one additive compatibility adjustment so effects still write through `state.core.runtime`, and compatibility `characterDefinitions` carriage had to remain separate to avoid over-expanding the slice. | Re-evaluate whether Child 4 can close on this landing; if not, expand shared-dispatch coverage and normalize interactive signals before reopening any convergence discussion. |

## High-Spread Changes

- The widest production spread this week is still contained: `src/core/contracts/*`, `src/core/registry/*`, `src/core/engine/*`, `src/core/runtime/*`, `src/core/save/*`, `src/core/adapters/*`, `src/main.ts`, one test-build configuration change, targeted synced baseline files, and isolated child-worktree seeding/alignment steps needed because the runtime extraction is still landing as per-child batches.

## Containment Review

1. Which change had the widest blast radius?
   - Plan governance changes, because they affected parent plan, child plan, weekly plan, and visibility companion expectations.
2. Which module was harder to change than expected?
   - The Child 4 minimum-carrier widening was harder than expected because the shared runtime line had to move from Child 1 `CoreGameState` assumptions to `RuntimeState` while still preserving compatibility `characterDefinitions` carriage and effect settlement against `state.core.runtime`.
3. Which module likely needs a new seam or contract?
   - `src/core/runtime`, because the minimum carrier now exists but the remaining architecture question is whether Child 4 can close on this landing or still needs one more normalized shared-dispatch/signal pass.
