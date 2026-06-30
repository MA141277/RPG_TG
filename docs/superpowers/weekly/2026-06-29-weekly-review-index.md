# Weekly Review Index

**Week Of:** `2026-06-29`

**Weekly Plan:** `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

**Weekly Visibility Companion:** `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`

**Primary Child Plan(s):**

- `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`

**Queued Next Child Plan(s):**

- `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
- `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`
- `docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md`

## Weekly Summary

- This week is focused on making the `mod-first` engine/runtime extraction executable and legible.
- Child 1, Child 2, and Child 3 are now complete in isolated worktrees.
- Child 4 is now complete in its isolated worktree, with its first two batches landing both the initial interactive-runtime bridge and the minimum RuntimeState/shared-dispatch carrier under `src/core`.
- The five-core-artifact visibility bundle exists so the same week also produces readable module, control-flow, split-review, architecture, and change-impact outputs.

## Active Focus

- Start Child 5 presenter/render decoupling now that Child 4 has completed on the approved minimum RuntimeState carrier.

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

### Deferred

- Child 4 is now closed on the approved minimum RuntimeState carrier.
- Child 5 presenter/render work is now the next executable child rather than a blocked queue item.
- Child 6 Task Runtime is formally queued behind Child 5.
- Child 7 Mod Runtime is formally queued behind Child 6.
- Child 8 StateSync Runtime is formally queued behind Child 7.

### Blockers

- None recorded yet in the weekly visibility scope.

## Change Impact Summary

| Change Area | Intended Impact | Unexpected Impact | Follow-Up Needed |
| --- | --- | --- | --- |
| `weekly governance` | Parent, child, weekly, visibility, and closeout sync state are explicit. | `none` | Keep closeout sync mandatory before future queue promotions. |
| `src/core/contracts` | Introduce and widen shared contracts through `RuntimeState`, `RuntimeResult`, and interactive signals. | `contained`: `characterDefinitions` could not safely merge into `RuntimeState.core` yet. | Keep `characterDefinitions` deferred behind the weekly promotion gate. |
| `src/core/runtime` | Move navigation/time/event/scene and covered interaction entry behind core seams. | `contained`: some interactive paths still use dedicated bridge helpers instead of one final router shape. | Hold stable during Child 5; revisit through a later runtime-consolidation child only if needed. |
| `src/core/save` | Harden loader/writer/migration behavior. | `none` | Keep shape stable until real save/load callers require more. |
| `src/main.ts` | Shrink black-box ownership through core adapters and runtime seams. | `expected`: render orchestration and browser follow-up remain. | Start Child 5 presenter/render decoupling. |

## Next Week Input

- Highest-priority module to refine:
  - `src/application/presenter`
- Why it is next:
  - Child 4 has already closed on the minimum RuntimeState carrier, so the next bottleneck is moving render-time gameplay selection out of `src/ui/app-render.ts` and into presenter output seams before UI work stabilizes further.
- Category:
  - `needs-contract`
