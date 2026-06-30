# Weekly Next Split Review

**Week Of:** `2026-06-29`

## Purpose

Use fixed criteria to decide which module should be refined next.

Do not decide the next split only from intuition.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `yes` | `yes` | `yes` | `yes` | `yes` | `high` |
| `src/core/engine` | `yes` | `partial` | `no` | `no` | `yes` | `medium` |
| `src/core/runtime` | `yes` | `partial` | `indirect` | `no` | `yes` | `high` |
| `src/core/registry` | `yes` | `partial` | `no` | `no` | `yes` | `medium` |
| `src/core/save` | `partial` | `partial` | `no` | `no` | `partial` | `medium` |
| `src/application/presenter` | `yes` | `yes` | `indirect` | `yes` | `yes` | `medium` |
| `src/ui/app-render.ts` | `yes` | `yes` | `indirect` | `yes` | `yes` | `medium` |
| `src/application/navigation/*` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `src/application/house/*` | `yes` | `partial` | `indirect` | `yes` | `yes` | `medium` |
| `src/application/story-battle/*` | `yes` | `partial` | `indirect` | `yes` | `yes` | `medium` |

## Recommended Next Split

- Module:
  - `src/application/presenter`
- Reason:
  - Child 4 is now complete on the approved minimum RuntimeState carrier, so the next bottleneck shifts to presenter output: render-time gameplay selection still lives in `src/ui/app-render.ts` and `src/main.ts`, and Child 5 is now the next legal queue item.
- Category:
  - `needs-contract`

## Non-Selected Candidates

- `src/core/engine`
  - Now implemented as a provisional seam; further changes should be validation-driven rather than open-ended redesign.
- `src/main.ts`
  - Still the largest black box, but the next planned reduction is now render-input assembly through Child 5 rather than another Child 4 runtime slice.
- `src/core/registry`
  - Important, but registry composition should stay thin until runtime and adapter seams prove what else is truly needed.
- `src/core/runtime`
  - Important follow-up area, but no longer the next legal queue item because Child 4 is complete and Child 5 now owns the next approved boundary move.
- `src/application/presenter`
  - This is now the recommended next split because Child 5 is unblocked and the render path still lacks a real presenter-output contract.
- `src/core/save`
  - Loader/writer/migration ownership now exists; further changes should be consumer-driven rather than another save-shape redesign.
- `src/application/house/*`
  - Covered house entry and dispatch are now behind a Child 4 bridge, so the next reduction should happen through runtime consolidation before deeper house-module redesign.

## Module Backlog

| Module | Current Status | Why It Is Not Done | Blocking Risk | Suggested Next Action |
| --- | --- | --- | --- | --- |
| `src/core/contracts` | `needs-hardening` | Contracts are consumed by boot, runtime dispatch, save envelope, and adapter handoff, but remain intentionally minimal. | `P1` | Harden only when a later child proves a real new requirement. |
| `src/core/runtime` | `needs-hardening` | Child 3/4 seams exist, but one final routing shape does not cover every interactive surface yet. | `P2` | Keep stable during Child 5; revisit through a planned runtime-consolidation child if it becomes the next bottleneck. |
| `src/core/save` | `needs-migration` | Save boundary is hardened, but app-level callers still need to consume it directly. | `P1` | Keep stable until real save/load caller work resumes. |
| `src/application/presenter` | `needs-contract` | Presenter seam exists only at planning level; Child 5 is now unblocked. | `P1` | Start Child 5 and introduce presenter output contracts. |
| `src/ui/app-render.ts` | `needs-migration` | Still owns render-time gameplay selection and helper imports. | `P1` | Move selection behind presenter output in Child 5. |
| `src/ui/layout-renderer.ts` | `needs-contract` | Schema-driven layout seam is planned only. | `P2` | Let Child 5 establish presenter output first. |
| `src/application/house/*` | `needs-adapter` | House behavior still runs through legacy runtime delegation behind the Child 4 bridge. | `P2` | Hold steady during Child 5; revisit only through a planned runtime follow-up. |

## Deprioritized Items

- Full content JSON migration
- Full text migration
- House-specific feature migration
- Full task-runtime extraction
