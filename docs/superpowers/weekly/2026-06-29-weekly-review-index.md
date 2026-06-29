# Weekly Review Index

**Week Of:** `2026-06-29`

**Weekly Plan:** `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`

**Weekly Visibility Companion:** `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`

**Primary Child Plan(s):**

- `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`

**Queued Next Child Plan(s):**

- `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
- `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`

## Weekly Summary

- This week is focused on making the `mod-first` engine/runtime extraction executable and legible.
- Child 1, Child 2, and Child 3 are now complete in isolated worktrees.
- Child 4 is the next queued follow-up workstream after runtime entry extraction.
- The visibility bundle exists so the same week also produces readable module and control-flow outputs.

## Active Focus

- Child 4 preparation after Child 3 moved navigation/time/event entry behind the first real runtime seam under `src/core/runtime`.

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

- `npm run typecheck`: `PASS`
- `npm test`: `PASS`
- `npm run build`: `PASS`

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

### Deferred

- Commit batching is still deferred because Task 1 and Task 2 changes are now being executed in the isolated worktree and have not yet been split into clean staged groups.
- Child 4 interactive runtime integration and Child 5 presenter/render work remain queued follow-up tasks.

### Blockers

- None recorded yet in the weekly visibility scope.

## Next Week Input

- Highest-priority module to refine:
  - `src/application/house/*`
- Why it is next:
  - Navigation/time/event entry is now under the first runtime seam, so the next bottleneck is house-owned interactive launch paths that still bypass a unified interactive runtime.
- Category:
  - `needs-migration`
