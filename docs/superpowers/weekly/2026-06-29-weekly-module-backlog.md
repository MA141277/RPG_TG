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
| `src/core/runtime` | `needs-hardening` | Runtime dispatch/effect settlement exists and Child 3 added navigation/time/event/scene entry seams, but interactive/task ownership is still intentionally incomplete. | `P1` | Expand through Child 4 only where interactive launch paths need a real core-owned path. |
| `src/core/save` | `needs-migration` | Save boundary is now hardened, but app-level callers and UI/runtime integration still need to consume it directly. | `P1` | Keep the seam stable and wire real save/load callers through it during later runtime extraction work. |
| `src/application/presenter` | `needs-contract` | Presenter seam exists only at planning level. | `P2` | Promote Child 5 after Child 3. |
| `src/ui/layout-renderer.ts` | `needs-contract` | Schema-driven layout seam is planned only. | `P2` | Promote Child 5 after Child 3. |
| `src/core/adapters/legacy-main-adapter.ts` | `needs-migration` | The handoff seam is implemented, but it is still only a thin compatibility bridge into core bootstrap. | `P1` | Keep it thin and move more legacy orchestration behind core-owned seams in later children. |
| `src/application/navigation/*` | `needs-hardening` | Child 3 moved first entry seams behind core runtime wrappers, but more navigation/view ownership still lives in legacy runtime paths. | `P2` | Keep extending only if Child 4/5 prove a remaining navigation bottleneck. |
| `src/application/story-battle/*` | `needs-migration` | Interactive runtime integration is not under core dispatch yet. | `P2` | Promote Child 4 after Child 3. |
| `src/application/house/*` | `needs-migration` | House-owned interaction launch and completion paths still coordinate interactive flows outside a unified runtime seam. | `P1` | Promote Child 4 after Child 3. |
| `src/ui/app-render.ts` | `needs-migration` | Still depends on raw runtime assumptions. | `P2` | Promote Child 5 after Child 3. |

## Promotion Candidates

- `src/application/house/*`
- `src/application/story-battle/*`
- `src/ui/app-render.ts`

## Deprioritized Items

- Full content JSON migration
- Full text migration
- House-specific feature migration
- Full task-runtime extraction
