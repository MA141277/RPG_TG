# Weekly Module Backlog

**Week Of:** `2026-06-29`

## Merged Artifact Notice

This file is retained as a historical reference only.

Active module-backlog ownership has moved into:

- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`

Do not treat this file as an independent weekly acceptance artifact after the five-core-artifact consolidation.

## Status Categories

- `unscoped`
- `needs-boundary`
- `needs-contract`
- `needs-adapter`
- `needs-migration`
- `needs-hardening`

## Backlog Table

| Module | Current Status | Why It Is Not Done | Blocking Risk | Suggested Next Action |
| --- | --- | --- | --- | --- |
| `src/core/contracts` | `needs-hardening` | Contracts are now consumed by boot, runtime dispatch, save envelope, and adapter handoff, but they are still intentionally minimal. | `P1` | Harden only when Child 2+ proves a real new requirement. |
| `src/core/registry` | `needs-hardening` | Registry types exist, but concrete registry assembly and richer content lookup are still thin. | `P2` | Keep the seam provisional and extend only as Task 3-5 prove new needs. |
| `src/core/engine` | `needs-hardening` | Engine-session composition exists and is now validated through `main.ts` handoff, but the state shell is still intentionally small. | `P1` | Keep the seam thin; extend only when Child 2/3 proves a concrete ownership need. |
| `src/core/runtime` | `needs-hardening` | Runtime dispatch/effect settlement exists, Child 3 added navigation/time/event/scene entry seams, and Child 4 closed on the approved minimum RuntimeState carrier. Shared routing ownership is still intentionally incomplete across the full interactive surface, but it is no longer the next legal queue item. | `P2` | Keep the boundary stable during Child 5; revisit only through a later explicitly planned follow-up if runtime consolidation becomes the next bottleneck again. |
| `src/core/save` | `needs-migration` | Save boundary is now hardened, but app-level callers and UI/runtime integration still need to consume it directly. | `P1` | Keep the seam stable and wire real save/load callers through it during later runtime extraction work. |
| `src/application/presenter` | `needs-contract` | Presenter seam exists only at planning level, but Child 5 is now unblocked and should define the render input contract next. | `P1` | Start Child 5 and introduce presenter output contracts before further UI stabilization. |
| `src/ui/layout-renderer.ts` | `needs-contract` | Schema-driven layout seam is planned only. | `P2` | Let Child 5 establish presenter output first, then revisit layout-renderer scope. |
| `src/core/adapters/legacy-main-adapter.ts` | `needs-migration` | The handoff seam is implemented, and Child 4 added more legacy adapters under the same directory, but these are still compatibility bridges rather than final ownership. | `P1` | Keep every adapter thin and move more legacy orchestration behind core-owned seams in later children. |
| `src/application/navigation/*` | `needs-hardening` | Child 3 moved first entry seams behind core runtime wrappers, but more navigation/view ownership still lives in legacy runtime paths. | `P2` | Keep extending only if Child 4/5 prove a remaining navigation bottleneck. |
| `src/application/story-battle/*` | `needs-adapter` | Covered action dispatch now enters through a Child 4 core seam, but the gameplay implementation still sits behind a legacy adapter path. | `P2` | Keep reducing direct `main.ts` orchestration and only deepen story-battle contracts when Child 4 proves the need. |
| `src/application/house/*` | `needs-adapter` | Covered house entry and dispatch now have a Child 4 core bridge, but house session behavior is still provided through legacy runtime delegation. | `P2` | Hold this boundary steady during Child 5 and revisit only if a later planned runtime follow-up proves more normalization is worth the risk. |
| `src/ui/app-render.ts` | `needs-migration` | Still depends on raw runtime assumptions. | `P1` | Start Child 5 and move render-time gameplay selection behind presenter output seams. |

## Promotion Candidates

- `src/application/presenter`
- `src/ui/app-render.ts`
- `src/application/house/*`

## Deprioritized Items

- Full content JSON migration
- Full text migration
- House-specific feature migration
- Full task-runtime extraction
