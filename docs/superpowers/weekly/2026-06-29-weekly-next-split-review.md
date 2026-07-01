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
  - `Child 12 UI Contract Reserve`
- Reason:
  - Child 11 is completed against the frozen baseline, so Child 12 is now the immediate next executable child rather than another ad hoc Child 11 extension or a Child 13 bypass.
- Category:
  - `Child 12 queue governance`
- Queued follow-up:
  - `Child 12 UI Contract Reserve is now the immediate next executable UI layout/interface-reserve child behind completed Child 11.`
- Locked follow-up:
  - `Child 13 Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit remains locked until Child 12 completes and a later weekly review explicitly unlocks it.`

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
| `Child 9 Runtime Contract Hardening` | `completed` | The contract-hardening child has landed all four approved shared contract baselines and closed without absorbing ownerization work. | `P1` | Treat as the completed prerequisite for Child 10 and avoid reopening it without a new baseline decision. |
| `Child 10 Runtime Ownerization Review And Baseline` | `completed` | The review child has finalized owner vs bridge status, adapter disposition, main.ts coupling, and Child 11 execution controls. | `P1` | Treat as the controlling baseline for Child 11 and do not reopen it casually. |
| `Child 11 Sub-Runtime Ownerization Implementation` | `completed` | The implementation child has completed the approved covered shared follow-up, interactive, house, and settlement ownerization slices against the finalized Child 10 baseline. | `P1` | Keep closed unless a later governance review authors a new child. |
| `Child 12 UI Contract Reserve` | `not-started` | The UI layout/interface-reserve child is now the immediate next executable child after completed Child 11 and exists to preserve the future UI/resource boundary direction without changing the completed runtime ownerization slice. | `P2` | Start Child 12 from its own plan when execution resumes, then use its closeout to unlock Child 13. |
| `Child 13 Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit` | `future-candidate` | The runtime continuation child is authored formally, but it still cannot start until Child 12 completes and a later review confirms real Bucket A convergence work exists. | `P1` | Treat as the locked follow-up after Child 12 and do not silently collapse it into completed Child 11. |
| `src/core/runtime` | `needs-hardening` | Child 3/4 seams exist and Child 11 has now landed the approved covered follow-up, interactive, house, and settlement runtime-owned slices, but broader runtime-family convergence is still intentionally deferred. | `P2` | Keep Child 11 closed, execute Child 12 first, then use Child 13 only if later review confirms real Bucket A remainder. |
| `src/core/save` | `needs-migration` | Save boundary is hardened, but app-level callers still need to consume it directly. | `P1` | Keep stable until real save/load caller work resumes. |
| `src/application/presenter` | `provisional` | Presenter output exists, but full layout schema and final view-model cleanup are still later work. | `P2` | Hold stable during Child 9; avoid expanding presenter scope. |
| `Task Runtime` | `landed-first-slice` | Formal TaskDefinition, TaskInstance, lifecycle, and signal-driven progression now exist, but task UI/authoring DSL/custom evaluator plugins are later work. | `P2` | Keep stable during Child 9; do not expand task runtime scope while contract hardening is being extracted. |
| `src/core/mods/*` | `landed-first-slice` | Formal Mod Runtime activation/startup seam now exists, but full hot reload, sandboxing, authoring tools, and deeper capability/dependency policy are later work. | `P2` | Keep stable during Child 9; do not expand mod runtime scope while contract hardening is being extracted. |
| `src/core/runtime/state-sync-*` | `landed-first-slice` | Formal StateSync contracts, triggers, syncState, and helper modules now exist, but deeper integration remains future work. | `P2` | Review before deciding whether a follow-up child is justified. |
| `src/ui/app-render.ts` | `provisional` | It now consumes presenter output, but still owns markup composition and should not absorb new gameplay selection. | `P2` | Keep stable during Child 9; revisit only for layout renderer work. |
| `src/ui/layout-renderer.ts` | `needs-contract` | Schema-driven layout seam is planned only. | `P2` | Let Child 5 establish presenter output first. |
| `src/application/house/*` | `needs-adapter` | House behavior still runs through legacy runtime delegation behind the Child 4 bridge. | `P2` | Hold steady during Child 9; only expose the minimum core-owned request seam required by the contract child. |

## Deprioritized Items

- Full content JSON migration
- Full text migration
- House-specific feature migration
- Full task UI/authoring DSL/custom evaluator extraction
- Full Mod Runtime hot reload/sandboxing/authoring tooling
