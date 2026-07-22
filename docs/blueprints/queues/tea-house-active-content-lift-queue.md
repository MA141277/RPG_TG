# Tea House Active Content Lift Queue

## Control Block

- queue_id: `queue.tea-house-active-content-lift`
- belongs_to_version: `target.project-complete-modularization`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-10`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `baseline-push`
- sync_summary: `Commit da72b58 on mod-first-dev was pushed successfully to origin/mod-first-dev after queue closeout was written.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Lift the covered tea-house defaultRuntimeContent cityNpcPools and textEntries fallback reads behind one application-owned active-content seam without widening into temple-house defaultPack consumption, tavern/medicine/grain helper cleanup, or broader runtime orchestration.`
- Forbidden expansions:
  - `Do not widen this queue into temple-house defaultPackActivities/defaultPackTextEntries cleanup.`
  - `Do not widen this queue into tavern, medicine-house, or grain-shop helper-family cleanup.`
  - `Do not widen this queue into tea-house gameplay-loop or debate-mechanic redesign.`
  - `Do not widen this queue into main.ts or broader runtime/session ownerization work.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Remove the covered tea-house defaultRuntimeContent.cityNpcPools and textEntries fallback reads from the production module path behind one application-owned active-content seam before reconsidering broader consumer cleanup.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded tea-house active-content seam landed and queue-local residue review returned control to version review.`
- task_briefs:
  - `task.tea-house-active-content-lift.baseline-reconcile: freeze tea-house as the smallest lawful next consumer-side active-content slice.`
  - `task.tea-house-active-content-lift.tea-house-city-npc-and-text-lift: move covered tea-house city-npc and text fallback reads behind one application-owned active-content seam.`
  - `task.tea-house-active-content-lift.tea-house-active-content-residue-review: reassess whether any remaining tea-house or adjacent residue stays in-queue after the seam lands.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source queue goal from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after queue.market-house-active-content-lift closed on current source truth.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on the bounded tea-house active-content consumer lift and must not silently absorb temple-house, tavern, medicine-house, grain-shop, or broader runtime-orchestration residue.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted tea-house active-content lift work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded tea-house active-content consumer evidence remains valid.`
- `Resume from this queue doc and the version-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.tea-house-active-content-lift.baseline-reconcile` | `completed` | `Freeze tea-house as the smallest lawful next consumer-side active-content slice.` | `none` | `Completed after queue-local inspection confirmed tea-house still reads defaultRuntimeContent.cityNpcPools and defaultRuntimeContent.textEntriesById directly, while temple-house, tavern, medicine-house, grain-shop, and broader runtime-orchestration residues each expand into broader coupled families.` |
| `task.tea-house-active-content-lift.tea-house-city-npc-and-text-lift` | `completed` | `Move covered tea-house city-npc and text fallback reads behind one application-owned active-content seam.` | `task.tea-house-active-content-lift.baseline-reconcile` | `Completed after the production module path moved city-npc and text fallback access behind src/application/house-modules/tea-house/tea-house-active-content.ts and the direct default-runtime-content import disappeared from tea-house-house-module.ts.` |
| `task.tea-house-active-content-lift.tea-house-active-content-residue-review` | `completed` | `Reassess whether any remaining tea-house or adjacent residue stays in-queue after the seam lands.` | `task.tea-house-active-content-lift.tea-house-city-npc-and-text-lift` | `Completed after residue review confirmed the bounded tea-house seam exhausted the admitted queue surface and that the remaining temple-house, tavern, medicine-house, grain-shop, and broader runtime-orchestration residues must return to version review instead of continuing in-queue.` |

### Task Definitions

#### `task.tea-house-active-content-lift.baseline-reconcile`

##### Control Block

- task_id: `task.tea-house-active-content-lift.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/tea-house-active-content-lift-queue.md`
  - `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - `src/application/house-modules/temple-house/temple-house-house-module.ts`
- must_inspect:
  - `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - `src/application/house-modules/temple-house/temple-house-house-module.ts`
- must_not_change:
  - `temple-house defaultPackActivities/defaultPackTextEntries residue`
  - `tavern or medicine-house or grain-shop helper-family residue`
  - `broader runtime orchestration ownerization`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted tea-house active-content boundary.`
  - `Queue-local evidence confirms tea-house is smaller than the remaining temple-house, tavern, medicine-house, grain-shop, and main.ts residue families.`
  - `The first tea-house active-content cut is frozen before implementation begins.`
- verify_with:
  - `rg -n "defaultRuntimeContent\\.cityNpcPools|defaultRuntimeContent\\.textEntriesById|defaultPackActivities|defaultPackTextEntries" src/application/house-modules/tea-house/tea-house-house-module.ts src/application/house-modules/temple-house/temple-house-house-module.ts`
  - `node tools/lint-blueprints.mjs`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to version review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.tea-house-active-content-lift.tea-house-city-npc-and-text-lift`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to temple-house, broader helper cleanup, or runtime orchestration rather than the admitted tea-house consumer cut.`

##### Human Context

- task_brief:
  - `Freeze the first lawful tea-house active-content cleanup slice before queue-local code work starts.`
- task_outcome_summary:
  - `Completed after queue-local inspection froze tea-house city-npc and text lift as the smallest independent consumer-side cut.`
- Purpose:
  - `Prevent the admitted queue from widening into temple-house, tavern, medicine-house, grain-shop, or main.ts cleanup all at once.`
- Failure mode:
  - `Do not jump directly into broader defaultRuntimeContent/defaultPack cleanup before the smaller tea-house owner line is named and bounded.`

#### `task.tea-house-active-content-lift.tea-house-city-npc-and-text-lift`

##### Control Block

- task_id: `task.tea-house-active-content-lift.tea-house-city-npc-and-text-lift`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/house-modules/tea-house/**`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/**`
- must_inspect:
  - `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `temple-house defaultPackActivities/defaultPackTextEntries residue`
  - `tavern, medicine-house, or grain-shop helper families`
  - `tea-house debate mechanic semantics`
  - `broader runtime orchestration ownerization`
- done_when:
  - `tea-house no longer directly imports or reads defaultRuntimeContent on the covered production path.`
  - `One application-owned active-content seam owns the covered tea-house city-npc and text fallback access.`
  - `Verification passes without widening into other consumer families.`
- verify_with:
  - `node --test --test-name-pattern "tea house no longer consumes default runtime content through module-top-level fallbacks" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `node tools/lint-blueprints.mjs`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of widening into other defaultRuntimeContent/defaultPack consumers.`
  - `Do not absorb temple-house, tavern, medicine-house, or grain-shop work just to force this task through.`
- promote_next_if_done: `task.tea-house-active-content-lift.tea-house-active-content-residue-review`
- stop_if:
  - `The required seam expands into temple-house, tavern, medicine-house, grain-shop, or broader runtime orchestration work instead of a bounded tea-house active-content cut.`

##### Human Context

- task_brief:
  - `Lift tea-house production city-npc and text fallback access behind one application-owned active-content seam.`
- task_outcome_summary:
  - `Completed after the covered tea-house city-npc and text fallback reads moved behind src/application/house-modules/tea-house/tea-house-active-content.ts, the production module stopped importing default-runtime-content directly, and robustness coverage locked the seam in place.`
- Purpose:
  - `Reduce live active-content dependency inside tea-house without widening the queue.`
- Failure mode:
  - `Do not widen this cut into other house modules or unrelated active-content cleanup.`

#### `task.tea-house-active-content-lift.tea-house-active-content-residue-review`

##### Control Block

- task_id: `task.tea-house-active-content-lift.tea-house-active-content-residue-review`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/tea-house-active-content-lift-queue.md`
  - `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/house-modules/tea-house/tea-house-house-module.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/tea-house-active-content-lift-queue.md`
- must_not_change:
  - `already-landed tea-house seam slice`
  - `other house-module cleanup outside the admitted queue boundary`
- done_when:
  - `Queue-local truth states whether any remaining residue stays as another bounded in-queue continuation or returns to version review for later admission.`
  - `Queue snapshot, task counts, and version truth are synchronized with that decision before any repository sync batch.`
  - `The queue does not silently absorb broader multi-house cleanup without a fresh written boundary.`
- verify_with:
  - `rg -n "defaultRuntimeContent|defaultPackActivities|defaultPackTextEntries" src/application/house-modules/tea-house src/application/house-modules/temple-house/temple-house-house-module.ts tests/robustness.test.cjs`
  - `node tools/lint-blueprints.mjs`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to version review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `none`
- stop_if:
  - `Required queue or version truth is not synchronized.`

##### Human Context

- task_brief:
  - `Reassess whether any remaining tea-house or adjacent residue stays in-queue after the seam lands.`
- task_outcome_summary:
  - `Completed after queue-local residue review confirmed the bounded tea-house seam exhausted the admitted queue surface and that the remaining temple-house, tavern, medicine-house, grain-shop, and broader runtime-orchestration residues must return to version review rather than continue in-queue.`
- Purpose:
  - `Keep the queue aligned with current evidence after the first tea-house implementation slice lands.`
- Failure mode:
  - `Do not auto-absorb broader multi-house or runtime-orchestration cleanup without a fresh queue-local decision.`

##### Decision-Dispatch Notes

- `If task_kind=decision-dispatch, this task must summarize current queue progress and provide one concise recommendation.`
- `Default operator output should stay concise and should not dump candidate-set analysis, why-not-the-others detail, or other Blueprint internal reasoning unless the operator explicitly asks for it.`

## Progress Log

- 2026-07-10
  - Summary: `Admitted queue.tea-house-active-content-lift as the single active queue because queue.market-house-active-content-lift is now closed and current source truth still shows a smaller independent tea-house active-content residue on the production path.`
  - Verification: `Fresh source inspection across src/application/house-modules/tea-house/tea-house-house-module.ts, src/application/house-modules/temple-house/temple-house-house-module.ts, docs/blueprints/project-progress.md, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.tea-house-active-content-lift.baseline-reconcile before queue-local implementation starts.`
- 2026-07-10
  - Summary: `Completed baseline-reconcile by freezing tea-house city-npc and text lift as the smallest lawful first slice, while explicitly leaving temple-house, tavern, medicine-house, grain-shop, and broader runtime-orchestration residue out of scope for this queue.`
  - Verification: `rg -n "defaultRuntimeContent\\.cityNpcPools|defaultRuntimeContent\\.textEntriesById|defaultPackActivities|defaultPackTextEntries" src/application/house-modules/tea-house/tea-house-house-module.ts src/application/house-modules/temple-house/temple-house-house-module.ts; node tools/lint-blueprints.mjs`
  - Next at this time: `Execute task.tea-house-active-content-lift.tea-house-city-npc-and-text-lift with a failing test first.`
- 2026-07-10
  - Summary: `Completed tea-house-city-npc-and-text-lift by moving the covered tea-house city-npc and text fallback access behind src/application/house-modules/tea-house/tea-house-active-content.ts, removing the direct default-runtime-content import from the production module path, and extending robustness coverage for the new seam and helper cache behavior.`
  - Verification: `node --test --test-name-pattern "tea house reads shared module defaults from runtime content|tea house no longer consumes default runtime content through module-top-level fallbacks" tests/robustness.test.cjs; npm run typecheck; npm test`
  - Next at this time: `Execute task.tea-house-active-content-lift.tea-house-active-content-residue-review to decide queue closeout versus same-queue continuation.`
- 2026-07-10
  - Summary: `Completed tea-house-active-content-residue-review and closed queue.tea-house-active-content-lift after fresh source review confirmed no additional same-queue continuation remains on the admitted tea-house path; remaining temple-house, tavern, medicine-house, grain-shop, and broader runtime-orchestration residues return to version-level review.`
  - Verification: `rg -n "defaultRuntimeContent|defaultPackActivities|defaultPackTextEntries" src/application/house-modules/tea-house src/application/house-modules/temple-house/temple-house-house-module.ts tests/robustness.test.cjs; node tools/lint-blueprints.mjs`
  - Next at this time: `Return control to docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md for same-version promotion review.`
- 2026-07-10
  - Summary: `Repository sync batch succeeded after queue closeout truth was written; commit da72b58 is now on origin/mod-first-dev and the queue-local sync record is synchronized with that result.`
  - Verification: `git push origin mod-first-dev`
  - Next at this time: `Resume same-version promotion review from docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md.`
