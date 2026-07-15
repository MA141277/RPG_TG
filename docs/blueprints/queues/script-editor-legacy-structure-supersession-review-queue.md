# Script Editor Legacy Structure Supersession Review Queue

## Control Block

- queue_id: `queue.script-editor-legacy-structure-supersession-review`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-legacy-structure-supersession-review.boundary-baseline-reconcile`
- next_task: `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Queue admitted from version promotion review; no execution closeout has been performed yet.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Queue admission and activation are not yet synchronized to origin/mod-first-dev.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Inventory overlapping legacy script-editor structures and record explicit retained, migrated, adapter-supported, or retired dispositions before final validation or deletion work proceeds.`
- Forbidden expansions:
  - `Do not delete legacy structures during baseline.`
  - `Do not reopen the completed schema reference slice unless fresh evidence proves it regressed.`
  - `Do not implement playable/minigame runtime changes; those require the playable-governed queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-schema-reference-and-migration-freeze-queue.md`

### Queue Snapshot

- queue_goal: `Review legacy script-editor structures and write explicit supersession dispositions before deletion, adapter removal, or final validation.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Inventory legacy structure references and select the smallest lawful supersession disposition slice.`
- task_briefs:
  - `task.script-editor-legacy-structure-supersession-review.boundary-baseline-reconcile: inventory legacy structure references and decide the bounded disposition surface.`
  - `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review: implement or document the selected retained/migrated/adapter-supported/retired dispositions with tests where code changes are required.`
  - `task.script-editor-legacy-structure-supersession-review.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current execution queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-schema-reference-and-migration-freeze closed after centralized project/runtime pack schemaVersion references landed.`
- `That queue routed legacy deletion, supersession disposition, and concrete future-version migration adapters back to version review as cross-family residue.`
- `The target spec marks legacy-structure-supersession-review as required before deleting or invalidating prior frozen structures.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-legacy-structure-supersession-review.boundary-baseline-reconcile` | `active` | `Inventory legacy structure references and select the smallest lawful disposition slice.` | `none` | `No deletion before baseline.` |
| `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review` | `pending` | `Record and implement selected retained/migrated/adapter-supported/retired dispositions.` | `task.script-editor-legacy-structure-supersession-review.boundary-baseline-reconcile` | `Tests required for any code behavior change.` |
| `task.script-editor-legacy-structure-supersession-review.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review` | `Does not infer version closeout from this queue.` |

### Task Definitions

#### `task.script-editor-legacy-structure-supersession-review.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-legacy-structure-supersession-review.boundary-baseline-reconcile`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-legacy-structure-supersession-review-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-schema-reference-and-migration-freeze-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `Do not delete or invalidate legacy structures during baseline.`
  - `Do not widen into playable/minigame binding implementation.`
  - `Do not close the version from this task.`
- done_when:
  - `Legacy structure references are inventoried.`
  - `The smallest lawful supersession disposition slice is selected or a blocker is recorded.`
  - `The queue doc records the selected slice and next active task.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked according to the queue closeout judgement rule.`
  - `Do not silently delete legacy structures.`
- promote_next_if_done: `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review`
- stop_if:
  - `Fresh evidence proves final validation must precede this review.`
  - `Fresh evidence proves the queue requires playable governance.`

##### Human Context

- task_brief:
  - `Inventory legacy script-editor structures before any supersession or deletion decision.`
- task_outcome_summary:
  - `Pending baseline.`
- Purpose:
  - `Prevent final validation or cleanup from silently depending on undocumented old-vs-new structure behavior.`
- Failure mode:
  - `Deleting or retaining old structures without disposition records creates hidden compatibility behavior.`

#### `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review`

##### Control Block

- task_id: `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review`
- state: `pending`
- task_kind: `execution`
- scope:
  - `to-be-selected-by-boundary-baseline`
- must_inspect:
  - `task.script-editor-legacy-structure-supersession-review.boundary-baseline-reconcile output`
- must_not_change:
  - `Do not implement unselected broad cleanup.`
- done_when:
  - `Selected dispositions are recorded and implemented where needed.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in this queue doc and return to version review if needed.`
- promote_next_if_done: `task.script-editor-legacy-structure-supersession-review.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires playable governance.`

##### Human Context

- task_brief:
  - `Record and implement the baseline-selected legacy structure dispositions.`
- task_outcome_summary:
  - `Pending baseline selection.`
- Purpose:
  - `Make old-vs-new structure ownership explicit before final validation.`
- Failure mode:
  - `Broad cleanup hides compatibility-only behavior or deletes still-required structures.`

#### `task.script-editor-legacy-structure-supersession-review.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-legacy-structure-supersession-review.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-legacy-structure-supersession-review-queue.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `task.script-editor-legacy-structure-supersession-review.supersession-disposition-review output`
- must_not_change:
  - `Do not infer version closeout.`
- done_when:
  - `Verification is recorded.`
  - `Residue is classified.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
  - `git diff --check`
- if_blocked:
  - `Record the blocker in Progress Log and do not mark queue_status done.`
- promote_next_if_done: `none`
- stop_if:
  - `Required verification has not passed.`

##### Human Context

- task_brief:
  - `Close or route the legacy supersession queue after verified disposition work.`
- task_outcome_summary:
  - `Pending implementation.`
- Purpose:
  - `Return control to version review without hiding legacy structure residue.`
- Failure mode:
  - `Closing without residue classification could let final validation pass on undocumented compatibility behavior.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none`
- Recorded expected output:
  - `none`

### Historical Candidate Notes

- `queue.script-editor-end-to-end-authoring-runtime-flow-validation`
  - State:
    - `future-candidate`
  - Reason:
    - `Final validation remains later until legacy structure dispositions are explicit.`

### Progress Log

- `2026-07-16`: `Promotion review admitted queue.script-editor-legacy-structure-supersession-review as the single active queue because schema reference closeout routed legacy deletion, supersession disposition, and concrete future-version migration adapters back to version review. The first live task is boundary-baseline-reconcile.`
