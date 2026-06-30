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
| `src/application/presenter` | `partial` | `partial` | `indirect` | `yes` | `partial` | `medium` |
| `src/ui/app-render.ts` | `partial` | `partial` | `indirect` | `yes` | `partial` | `medium` |
| `Task Runtime` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `Mod Runtime` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `StateSync Runtime` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `src/application/navigation/*` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `src/application/house/*` | `yes` | `partial` | `indirect` | `yes` | `yes` | `medium` |
| `src/application/story-battle/*` | `yes` | `partial` | `indirect` | `yes` | `yes` | `medium` |

## Recommended Next Split

- Module:
  - `TBD after review`
- Reason:
  - Child 8 StateSync Runtime is complete, so there is no automatic next executable child. The next split must come from a fresh review of runtime/module maturity, remaining main.ts coupling, and weekly artifact state.
- Category:
  - `review-required`

## Non-Selected Candidates

- `src/core/engine`
  - Now implemented as a provisional seam; further changes should be validation-driven rather than open-ended redesign.
- `src/main.ts`
  - Still the largest black box, but Child 7 moved mod activation/startup ownership into Mod Runtime and Child 8 moved bridge-period state sync helpers into StateSync. Further reduction should be reviewed before becoming a child.
- `src/core/registry`
  - Important, but registry composition should stay thin until runtime and adapter seams prove what else is truly needed.
- `src/core/runtime`
  - Important follow-up area; Child 6 narrowed task progression ownership, Child 7 narrowed mod activation/startup ownership, and Child 8 narrowed state sync ownership. Broad runtime consolidation still needs a separate review.
- `src/core/mods/*`
  - Child 7 has landed the first Mod Runtime activation/startup seam. Deeper capability/dependency policy, hot reload, sandboxing, and authoring tools remain future work, but they do not block Child 8.
- `src/core/runtime/state-sync-*`
  - Child 8 has landed the first StateSync Runtime canonical boundary. Deeper save IO integration, runtime dispatch auto-commit integration, and full legacy migration remain future work.
- `src/application/presenter`
  - Child 5 has introduced the first presenter output contract; deeper layout/presenter hardening should wait until StateSync boundaries are stable.
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
| `src/application/presenter` | `provisional` | Presenter output exists, but full layout schema and final view-model cleanup are still later work. | `P2` | Hold stable during Child 8; avoid expanding presenter scope. |
| `Task Runtime` | `landed-first-slice` | Formal TaskDefinition, TaskInstance, lifecycle, and signal-driven progression now exist, but task UI/authoring DSL/custom evaluator plugins are later work. | `P2` | Keep stable during Child 8; do not expand task runtime scope while state sync is being extracted. |
| `src/core/mods/*` | `landed-first-slice` | Formal Mod Runtime activation/startup seam now exists, but full hot reload, sandboxing, authoring tools, and deeper capability/dependency policy are later work. | `P2` | Keep stable during Child 8; do not expand mod runtime scope while state sync is being extracted. |
| `src/core/runtime/state-sync-*` | `landed-first-slice` | Formal StateSync contracts, triggers, syncState, and helper modules now exist, but deeper integration remains future work. | `P2` | Review before deciding whether a follow-up child is justified. |
| `src/ui/app-render.ts` | `provisional` | It now consumes presenter output, but still owns markup composition and should not absorb new gameplay selection. | `P2` | Keep stable during Child 8; revisit only for layout renderer work. |
| `src/ui/layout-renderer.ts` | `needs-contract` | Schema-driven layout seam is planned only. | `P2` | Let Child 5 establish presenter output first. |
| `src/application/house/*` | `needs-adapter` | House behavior still runs through legacy runtime delegation behind the Child 4 bridge. | `P2` | Hold steady during Child 5; revisit only through a planned runtime follow-up. |

## Deprioritized Items

- Full content JSON migration
- Full text migration
- House-specific feature migration
- Full task UI/authoring DSL/custom evaluator extraction
- Full Mod Runtime hot reload/sandboxing/authoring tooling
