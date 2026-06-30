# Weekly Boundary Checklist

**Week Of:** `2026-06-29`

## Merged Artifact Notice

This file is retained as a historical reference only.

Active boundary-checklist ownership has moved into:

- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`

Do not treat this file as an independent weekly acceptance artifact after the five-core-artifact consolidation.

## Stable Boundaries

- [x] Parent plan and child plan orchestration boundary is stable enough to start Child 1.
- [x] Weekly orchestration and weekly visibility companion roles are explicitly separated.

## Provisional Boundaries

- [x] `src/core/contracts`
- [x] `src/core/registry/engine-registry.ts`
- [x] `src/core/engine`
- [x] `src/core/runtime`
- [x] `src/core/save`
- [ ] `src/application/presenter`
- [ ] `src/ui/layout-renderer.ts`

## Adapter Boundaries

- [x] `src/core/adapters/legacy-main-adapter.ts`
- [x] Legacy house and interactive adapter seams are now defined in Child 4 batch 1, but remain transitional rather than stable end-state boundaries.
- [x] The Child 4 minimum RuntimeState carrier now exists, but it is still a provisional runtime boundary rather than final convergence onto Child 1 `CoreGameState`.

## Missing Contracts

- [x] Event runtime concrete contracts are implemented in production code.
- [x] Interactive runtime concrete contracts now exist in production code.
- [x] Minimum `RuntimeState` and widened `RuntimeResult` contracts now exist in production code.
- [ ] Task runtime concrete contracts are not yet implemented in production code.
- [ ] House-module bridge contracts are partially implemented through runtime bridge wrappers, but are not yet part of the shared runtime-router/runtime-dispatch contract surface.
- [x] Save migration hardening contracts exist in production code.
- [x] Scene handoff contracts now exist in production code.

## Remaining `main.ts` Coupling

- [x] Boot composition
- [x] Covered interactive launch/action ownership for city-begging, activity-qte, and story-battle now routes through core seams
- [x] At least one covered interactive return path now routes through shared runtime dispatch on the minimum RuntimeState carrier
- [ ] Navigation and view switching logic
- [ ] Runtime dispatch ownership
- [ ] Concrete content activation
- [ ] Render orchestration

## Boundary Review Questions

1. Which boundaries became stable this week?
2. Which boundaries are still adapter-only?
3. Which modules still cross layers incorrectly?
4. Which boundary must be formalized next week?
