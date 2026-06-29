# Weekly Boundary Checklist

**Week Of:** `2026-06-29`

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
- [ ] Legacy story, house, and interactive adapter seams remain to be defined in later child plans.

## Missing Contracts

- [x] Event runtime concrete contracts are implemented in production code.
- [ ] Task runtime concrete contracts are not yet implemented in production code.
- [ ] House-module bridge contracts for the future core runtime are not yet formalized.
- [x] Save migration hardening contracts exist in production code.
- [x] Scene handoff contracts now exist in production code.

## Remaining `main.ts` Coupling

- [x] Boot composition
- [ ] Navigation and view switching logic
- [ ] Runtime dispatch ownership
- [ ] Concrete content activation
- [ ] Render orchestration

## Boundary Review Questions

1. Which boundaries became stable this week?
2. Which boundaries are still adapter-only?
3. Which modules still cross layers incorrectly?
4. Which boundary must be formalized next week?
