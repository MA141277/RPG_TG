# Weekly Next Split Review

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


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
  - `No active queued child remains after Child 13 closeout.`
- Reason:
  - Child 11, Child 12, and Child 13 are now all completed, so the active weekly queue is closed and future continuation work needs a fresh review instead of inheriting Child 13 scope.
- Category:
  - `post-Child-13 review gate`
- Recommended candidate order:
  - `1. Interactive Remaining Legacy Convergence`
  - `2. Navigation + Time Runtime Convergence`
  - `3. Event + Scene Handoff Convergence`
- Ordering rationale:
  - `Interactive Remaining Legacy Convergence` should stay first because the remaining `legacy-interactive-adapter.ts` debt is the narrowest and clearest ownerization residue.
  - `Navigation + Time Runtime Convergence` should stay second because it addresses the shared progression-layer mixed entry pattern without dragging story handoff into scope.
  - `Event + Scene Handoff Convergence` should stay last because it has the highest risk of silently expanding into broader story-flow redesign.
- Queued follow-up:
  - `None. Any later child must be newly reviewed and authored before implementation starts.`
- Locked follow-up:
  - `No additional locked follow-up child is currently recorded after Child 13 closeout.`
- Unlock rule:
  - `None of the three candidate children below is currently unlocked. A fresh weekly review, an explicit promotion decision, and a dedicated spec/plan pair are all required before execution.`

## Candidate Continuation Children

1. `Interactive Remaining Legacy Convergence`
   - Focus:
     - converge the remaining `activity-qte` and `story-battle` interactive lifecycle paths under `src/core/runtime/interactive-runtime.ts`
   - In scope:
     - covered launch / action / exit / completion follow-up ownership
     - reduction of `legacy-interactive-adapter.ts` to justified compatibility residue
     - removal of covered interactive cleanup / follow-up branches from `src/main.ts`
   - Out of scope:
     - navigation/time/event/scene convergence
     - runtime contract-family expansion
     - house business redesign
   - Entry conditions:
     - governance promotes it as the next executable child
     - Child 11 / Child 13 closeout remains accepted and unreopened
     - no unresolved `P0` / `P1` regression exists on the covered interactive ownerized paths
   - Exit signal:
     - covered `activity-qte` and `story-battle` lifecycles are runtime-owned on the approved production line
     - `src/main.ts` no longer carries the covered interactive cleanup / follow-up tails
   - Verification baseline:
     - targeted `tests/robustness.test.cjs` coverage for the remaining interactive tails
     - `npm run typecheck`
     - `npm test`
     - `npm run build`

2. `Navigation + Time Runtime Convergence`
   - Focus:
     - reduce direct `src/main.ts` coordination around `runNavigationRuntime()` and `runTimeRuntime()`
   - In scope:
     - covered navigation entry convergence
     - covered time progression entry convergence
     - reduction of shell-owned progression orchestration on the covered paths
   - Out of scope:
     - event/scene handoff redesign
     - interactive legacy cleanup
     - boot/startup or UI/presenter work
   - Entry conditions:
     - `Interactive Remaining Legacy Convergence` is complete, or governance records a justified reorder decision
     - governance promotes it as the next executable child
     - remaining debt is confirmed to be navigation/time mixed entry debt rather than event/scene handoff debt
   - Exit signal:
     - covered navigation and time entry no longer depend on direct shell orchestration in `src/main.ts`
     - the convergence does not reopen event/scene handoff scope
   - Verification baseline:
     - targeted `tests/robustness.test.cjs` coverage for covered navigation/time progression paths
     - `npm run typecheck`
     - `npm test`
     - `npm run build`

3. `Event + Scene Handoff Convergence`
   - Focus:
     - converge the remaining mixed control between `runEventRuntime()` and `runSceneFromEvent()`
   - In scope:
     - covered event activation ownership cleanup
     - covered event -> scene handoff convergence
     - reduction of shell-side story handoff branches in `src/main.ts`
   - Out of scope:
     - story-system redesign
     - navigation/time convergence
     - interactive legacy convergence
   - Entry conditions:
     - `Navigation + Time Runtime Convergence` is complete, or governance records a justified reorder decision
     - governance promotes it as the next executable child
     - remaining debt is confirmed to be ownership/handoff debt rather than missing content logic
   - Exit signal:
     - covered event activation no longer needs shell-side stitching
     - covered scene continuation no longer depends on ad hoc `src/main.ts` orchestration
     - event -> scene handoff is explicit and runtime-owned on the covered line
   - Verification baseline:
     - targeted `tests/robustness.test.cjs` coverage for covered event activation, scene continuation, and handoff paths
     - `npm run typecheck`
     - `npm test`
     - `npm run build`

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
| `Child 12 UI Contract Reserve` | `completed` | The additive UI layout/interface-reserve child is now closed after landing formal reserve contracts, builtin reserve content, optional pack UI split-table support, and inactive-by-default protection without changing the active runtime path. | `P2` | Keep closed and do not reuse it as runtime-ownerization backfill. |
| `Child 13 Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit` | `completed` | The runtime continuation child classified the remaining in-scope audit as Bucket A = one story-battle -> reenter-house follow-up path, Bucket B = none, Bucket C = none, then converged the remaining Bucket A path under `houseRuntime.applyInteractiveFollowUp()`. | `P1` | Keep closed; any later continuation now requires a fresh weekly review rather than extending Child 13. |
| `src/core/runtime` | `needs-hardening` | Child 3/4 seams exist, Child 11 landed the approved covered follow-up, interactive, house, and settlement runtime-owned slices, Child 12 closed the additive UI reserve landing without reopening runtime scope, and Child 13 closed the remaining same-type in-scope shared-dispatch follow-up remainder. | `P2` | Require a fresh weekly review before opening any later runtime continuation child. |
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

