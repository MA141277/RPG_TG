# Weekly Review Index

**Week Of:** `2026-06-29`

**Weekly Plan:** `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

**Weekly Visibility Companion:** `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`

**Primary Child Plan(s):**

- `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`

**Queued Next Child Plan(s):**

- `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`

## Weekly Summary

- This week is focused on making the `mod-first` engine/runtime extraction executable and legible.
- Child 1, Child 2, and Child 3 are now complete in isolated worktrees.
- Child 4 is now in progress in its own isolated worktree, and its first batch landed the initial interactive-runtime bridge under `src/core`.
- The visibility bundle exists so the same week also produces readable module and control-flow outputs.

## Active Focus

- Continue Child 4 after the first interactive-runtime batch moved covered house/minigame/story-battle entry behind new `src/core/runtime` and `src/core/adapters` seams.

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

### Deferred

- Child 4 is not closed yet; shared runtime-router/runtime-dispatch integration remains an explicit follow-up decision inside the active child plan.
- Child 5 presenter/render work remains queued behind Child 4 completion.

### Blockers

- None recorded yet in the weekly visibility scope.

## Next Week Input

- Highest-priority module to refine:
  - `src/core/runtime`
- Why it is next:
  - The first interactive-runtime bridge now exists, so the next bottleneck is deciding how far Child 4 should pull house/interactive ownership into the shared router/dispatch line instead of leaving dedicated bridge helpers as a parallel path.
- Category:
  - `needs-hardening`
