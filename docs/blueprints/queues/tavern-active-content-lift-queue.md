# Tavern Active Content Lift Queue

## Control Block

- queue_id: `queue.tavern-active-content-lift`
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
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync has run for this newly admitted queue yet.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Lift the covered tavern defaultRuntimeContent text-entry fallback read behind one application-owned active-content seam without widening into medicine-house playable-coupled cleanup, grain-shop multi-file helper cleanup, or broader runtime orchestration.`
- Forbidden expansions:
  - `Do not widen this queue into medicine-house text-entry cleanup.`
  - `Do not widen this queue into grain-shop or grain-market helper-family cleanup.`
  - `Do not widen this queue into tavern gameplay or gambling/workflow redesign.`
  - `Do not widen this queue into main.ts or broader runtime/session ownerization work.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Remove the covered tavern defaultRuntimeContent.textEntriesById read from the production module path behind one application-owned active-content seam before reconsidering broader helper-family or runtime cleanup.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded tavern active-content seam landed and queue-local residue review returned control to version review.`
- task_briefs:
  - `task.tavern-active-content-lift.baseline-reconcile: freeze tavern as the smallest lawful next text-entry consumer slice.`
  - `task.tavern-active-content-lift.tavern-text-entry-seam-lift: move covered tavern text-entry fallback access behind one application-owned active-content seam.`
  - `task.tavern-active-content-lift.tavern-active-content-residue-review: reassess whether any remaining tavern or adjacent residue stays in-queue after the seam lands.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source queue goal from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after queue.temple-house-default-pack-lift closed on current source truth.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on the bounded tavern text-entry consumer lift and must not silently absorb medicine-house, grain-shop, or broader runtime-orchestration residue.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted tavern active-content lift work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded tavern active-content consumer evidence remains valid.`
- `Resume from this queue doc and the version-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.tavern-active-content-lift.baseline-reconcile` | `completed` | `Freeze tavern as the smallest lawful next text-entry consumer slice.` | `none` | `Completed after queue-local inspection confirmed tavern still reads defaultRuntimeContent.textEntriesById directly, while medicine-house remains coupled to playable flow and grain-shop residue already spans both the house module and grain-market helper.` |
| `task.tavern-active-content-lift.tavern-text-entry-seam-lift` | `completed` | `Move covered tavern text-entry fallback access behind one application-owned active-content seam.` | `task.tavern-active-content-lift.baseline-reconcile` | `Completed after the production module path moved tavern text-entry fallback access behind src/application/house-modules/tavern/tavern-active-content.ts and the direct default-runtime-content import disappeared from tavern-house-module.ts.` |
| `task.tavern-active-content-lift.tavern-active-content-residue-review` | `completed` | `Reassess whether any remaining tavern or adjacent residue stays in-queue after the seam lands.` | `task.tavern-active-content-lift.tavern-text-entry-seam-lift` | `Completed after residue review confirmed the bounded tavern seam exhausted the admitted queue surface and that the remaining medicine-house, grain-shop, and broader runtime-orchestration residues must return to version review instead of continuing in-queue.` |

### Task Definitions

#### `task.tavern-active-content-lift.baseline-reconcile`

##### Control Block

- task_id: `task.tavern-active-content-lift.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/tavern-active-content-lift-queue.md`
  - `src/application/house-modules/tavern/tavern-house-module.ts`
  - `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - `src/application/grain-shop/grain-market.ts`
- must_inspect:
  - `src/application/house-modules/tavern/tavern-house-module.ts`
  - `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - `src/application/grain-shop/grain-market.ts`
- must_not_change:
  - `medicine-house playable-coupled residue`
  - `grain-shop multi-file helper-family residue`
  - `broader runtime orchestration ownerization`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted tavern active-content boundary.`
  - `Queue-local evidence confirms tavern is smaller than the remaining medicine-house, grain-shop, and runtime-orchestration residue families.`
  - `The first tavern active-content cut is frozen before implementation begins.`
- verify_with:
  - `rg -n "defaultRuntimeContent\\.textEntriesById" src/application/house-modules/tavern/tavern-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/grain-shop/grain-market.ts`
  - `node tools/lint-blueprints.mjs`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to version review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.tavern-active-content-lift.tavern-text-entry-seam-lift`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to medicine-house, grain-shop, or broader runtime orchestration rather than the admitted tavern consumer cut.`

##### Human Context

- task_brief:
  - `Freeze the first lawful tavern active-content cleanup slice before queue-local code work starts.`
- task_outcome_summary:
  - `Completed after queue-local inspection froze tavern text-entry seam lift as the smallest independent consumer-side cut.`
- Purpose:
  - `Prevent the admitted queue from widening into medicine-house, grain-shop, or broader runtime cleanup all at once.`
- Failure mode:
  - `Do not jump directly into broader helper-family or runtime cleanup before the smaller tavern owner line is named and bounded.`

#### `task.tavern-active-content-lift.tavern-text-entry-seam-lift`

##### Control Block

- task_id: `task.tavern-active-content-lift.tavern-text-entry-seam-lift`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/house-modules/tavern/**`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/**`
- must_inspect:
  - `src/application/house-modules/tavern/tavern-house-module.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `medicine-house residue`
  - `grain-shop residue`
  - `broader runtime orchestration ownerization`
  - `tavern gameplay semantics`
- done_when:
  - `tavern no longer directly imports or reads defaultRuntimeContent on the covered production path.`
  - `One application-owned active-content seam owns the covered tavern text-entry fallback access.`
  - `Verification passes without widening into other residue families.`
- verify_with:
  - `node --test --test-name-pattern "tavern no longer consumes default runtime content through module-top-level fallbacks" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `node tools/lint-blueprints.mjs`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of widening into medicine-house, grain-shop, or runtime cleanup.`
  - `Do not absorb other helper-family work just to force this task through.`
- promote_next_if_done: `task.tavern-active-content-lift.tavern-active-content-residue-review`
- stop_if:
  - `The required seam expands into medicine-house, grain-shop, or broader runtime-orchestration work instead of a bounded tavern active-content cut.`

##### Human Context

- task_brief:
  - `Lift tavern production text-entry fallback access behind one application-owned active-content seam.`
- task_outcome_summary:
  - `Completed after the covered tavern text-entry fallback read moved behind src/application/house-modules/tavern/tavern-active-content.ts, the production module stopped importing default-runtime-content directly, and robustness coverage locked the seam in place.`
- Purpose:
  - `Reduce live active-content dependency inside tavern without widening the queue.`
- Failure mode:
  - `Do not widen this cut into other house modules or unrelated helper-family cleanup.`

#### `task.tavern-active-content-lift.tavern-active-content-residue-review`

##### Control Block

- task_id: `task.tavern-active-content-lift.tavern-active-content-residue-review`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/tavern-active-content-lift-queue.md`
  - `src/application/house-modules/tavern/tavern-house-module.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/house-modules/tavern/tavern-house-module.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/tavern-active-content-lift-queue.md`
- must_not_change:
  - `already-landed tavern seam slice`
  - `other house-module cleanup outside the admitted queue boundary`
- done_when:
  - `Queue-local truth states whether any remaining residue stays as another bounded in-queue continuation or returns to version review for later admission.`
  - `Queue snapshot, task counts, and version truth are synchronized with that decision before any repository sync begins.`
  - `The queue does not silently absorb broader multi-house cleanup without a fresh written boundary.`
- verify_with:
  - `rg -n "defaultRuntimeContent\\.textEntriesById" src/application/house-modules/tavern src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/grain-shop/grain-market.ts tests/robustness.test.cjs`
  - `node tools/lint-blueprints.mjs`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to version review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `none`
- stop_if:
  - `Required queue or version truth is not synchronized.`

##### Human Context

- task_brief:
  - `Reassess whether any remaining tavern or adjacent residue stays in-queue after the seam lands.`
- task_outcome_summary:
  - `Completed after queue-local residue review confirmed the bounded tavern seam exhausted the admitted queue surface and that the remaining medicine-house, grain-shop, and broader runtime-orchestration residues must return to version review rather than continue in-queue.`
- Purpose:
  - `Keep the queue aligned with current evidence after the first tavern implementation slice lands.`
- Failure mode:
  - `Do not auto-absorb broader multi-house or runtime-orchestration cleanup without a fresh queue-local decision.`

##### Decision-Dispatch Notes

- `If task_kind=decision-dispatch, this task must summarize current queue progress and provide one concise recommendation.`
- `Default operator output should stay concise and should not dump candidate-set analysis, why-not-the-others detail, or other Blueprint internal reasoning unless the operator explicitly asks for it.`

## Progress Log

- 2026-07-10
  - Summary: `Admitted queue.tavern-active-content-lift as the single active queue because queue.temple-house-default-pack-lift is now closed and current source truth still shows a smaller independent tavern active-content residue on the production path.`
  - Verification: `Fresh source inspection across src/application/house-modules/tavern/tavern-house-module.ts, src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/grain-shop/grain-market.ts, docs/blueprints/project-progress.md, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.tavern-active-content-lift.baseline-reconcile before queue-local implementation starts.`
- 2026-07-10
  - Summary: `Completed baseline-reconcile by freezing tavern text-entry seam lift as the smallest lawful first slice, while explicitly leaving medicine-house, grain-shop, and broader runtime-orchestration residue out of scope for this queue.`
  - Verification: `rg -n "defaultRuntimeContent\\.textEntriesById" src/application/house-modules/tavern/tavern-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/grain-shop/grain-market.ts; node tools/lint-blueprints.mjs`
  - Next at this time: `Execute task.tavern-active-content-lift.tavern-text-entry-seam-lift with a failing test first.`
- 2026-07-10
  - Summary: `Completed tavern-text-entry-seam-lift by moving the covered tavern text-entry fallback access behind src/application/house-modules/tavern/tavern-active-content.ts, removing the direct default-runtime-content import from the production module path, and extending robustness coverage for the new seam and helper cache behavior.`
  - Verification: `node --test --test-name-pattern "tavern reads shared module defaults from runtime content|tavern no longer consumes default runtime content through module-top-level fallbacks" tests/robustness.test.cjs; npm run typecheck; npm test`
  - Next at this time: `Execute task.tavern-active-content-lift.tavern-active-content-residue-review to decide queue closeout versus same-queue continuation.`
- 2026-07-10
  - Summary: `Completed tavern-active-content-residue-review and closed queue.tavern-active-content-lift after fresh source review confirmed no additional same-queue continuation remains on the admitted tavern path; remaining medicine-house, grain-shop, and broader runtime-orchestration residues return to version-level review.`
  - Verification: `rg -n "defaultRuntimeContent\\.textEntriesById" src/application/house-modules/tavern src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/grain-shop/grain-market.ts tests/robustness.test.cjs; node tools/lint-blueprints.mjs`
  - Next at this time: `Return control to docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md for same-version promotion review.`
