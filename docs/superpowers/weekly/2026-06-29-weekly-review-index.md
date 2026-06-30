# Weekly Review Index

**Week Of:** `2026-06-29`

**Weekly Plan:** `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

**Weekly Visibility Companion:** `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`

**Primary Child Plan(s):**

- `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`

**Queued Next Child Plan(s):**

- `None currently queued ahead of the active next child`

## Weekly Summary

- This week is focused on making the `mod-first` engine/runtime extraction executable and legible.
- Child 1, Child 2, and Child 3 are now complete in isolated worktrees.
- Child 4 is now complete in its isolated worktree, with its first two batches landing both the initial interactive-runtime bridge and the minimum RuntimeState/shared-dispatch carrier under `src/core`.
- The visibility bundle exists so the same week also produces readable module and control-flow outputs.

## Active Focus

- Start Child 5 presenter/render decoupling now that Child 4 has completed on the approved minimum RuntimeState carrier.

## Artifact Index

- Module map:
  - `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- Boundary checklist:
  - `docs/superpowers/weekly/2026-06-29-weekly-boundary-checklist.md`
- Module backlog:
  - `docs/superpowers/weekly/2026-06-29-weekly-module-backlog.md`
- Call flows:
  - `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- Change impact:
  - `docs/superpowers/weekly/2026-06-29-weekly-change-impact.md`
- Next split review:
  - `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

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

### Blockers

- None recorded yet in the weekly visibility scope.

## Next Week Input

- Highest-priority module to refine:
  - `src/application/presenter`
- Why it is next:
  - Child 4 has already closed on the minimum RuntimeState carrier, so the next bottleneck is moving render-time gameplay selection out of `src/ui/app-render.ts` and into presenter output seams before UI work stabilizes further.
- Category:
  - `needs-contract`
