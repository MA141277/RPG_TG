# Weekly Module Backlog

**Week Of:** `2026-06-29`

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
| `src/core/runtime` | `needs-hardening` | Runtime dispatch/effect settlement exists, Child 3 added navigation/time/event/scene entry seams, and Child 4 batch 1 added interactive/house bridge files, but shared routing ownership is still intentionally incomplete. | `P1` | Continue Child 4 only where interactive launch/action paths need to join the shared runtime routing line. |
| `src/core/save` | `needs-migration` | Save boundary is now hardened, but app-level callers and UI/runtime integration still need to consume it directly. | `P1` | Keep the seam stable and wire real save/load callers through it during later runtime extraction work. |
| `src/application/presenter` | `needs-contract` | Presenter seam exists only at planning level. | `P2` | Promote Child 5 after Child 3. |
| `src/ui/layout-renderer.ts` | `needs-contract` | Schema-driven layout seam is planned only. | `P2` | Promote Child 5 after Child 3. |
| `src/core/adapters/legacy-main-adapter.ts` | `needs-migration` | The handoff seam is implemented, and Child 4 added more legacy adapters under the same directory, but these are still compatibility bridges rather than final ownership. | `P1` | Keep every adapter thin and move more legacy orchestration behind core-owned seams in later children. |
| `src/application/navigation/*` | `needs-hardening` | Child 3 moved first entry seams behind core runtime wrappers, but more navigation/view ownership still lives in legacy runtime paths. | `P2` | Keep extending only if Child 4/5 prove a remaining navigation bottleneck. |
| `src/application/story-battle/*` | `needs-adapter` | Covered action dispatch now enters through a Child 4 core seam, but the gameplay implementation still sits behind a legacy adapter path. | `P2` | Keep reducing direct `main.ts` orchestration and only deepen story-battle contracts when Child 4 proves the need. |
| `src/application/house/*` | `needs-adapter` | Covered house entry and dispatch now have a Child 4 core bridge, but house session behavior is still provided through legacy runtime delegation. | `P1` | Continue Child 4 by thinning the bridge path before redesigning house modules directly. |
| `src/ui/app-render.ts` | `needs-migration` | Still depends on raw runtime assumptions. | `P2` | Promote Child 5 after Child 3. |

## Promotion Candidates

- `src/core/runtime`
- `src/application/house/*`
- `src/ui/app-render.ts`

## Deprioritized Items

- Full content JSON migration
- Full text migration
- House-specific feature migration
- Full task-runtime extraction
