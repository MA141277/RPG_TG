# Script Editor Scene Runtime Task Input Propagation Queue

## Control Block

- queue_id: `queue.script-editor-scene-runtime-task-input-propagation`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-continuation`
- active_task: `task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile`
- next_task: `task.script-editor-scene-runtime-task-input-propagation.runtime-propagation-implementation`
- closeout_status: `pending`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `execute-active-task`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Pending repository sync after same-family scene runtime taskInputs propagation continuation admission.`
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
  - `Propagate activated event taskInputs through the core scene runtime result so script-editor event task handoff reaches the unified RuntimeResult.taskInputs settlement path without manual router stitching.`
- Forbidden expansions:
  - `Do not introduce a parallel task update channel outside RuntimeResult.taskInputs.`
  - `Do not rewrite the legacy application/story runtime in this queue unless baseline proves it is the smallest required propagation seam.`
  - `Do not implement new editor UI controls, launch policy, or playable/minigame bindings.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-task-chain-runtime-handoff-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Carry event runtime candidate taskInputs through scene runtime output for canonical task settlement.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Inventory event runtime candidate taskInputs, scene runtime result propagation, and runtime dispatch settlement seams before selecting the smallest propagation slice.`
- task_briefs:
  - `task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile: inventory scene runtime taskInputs propagation seams and select the smallest lawful implementation slice.`
  - `task.script-editor-scene-runtime-task-input-propagation.runtime-propagation-implementation: implement the selected propagation slice with tests.`
  - `task.script-editor-scene-runtime-task-input-propagation.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-task-chain-runtime-handoff-convergence closed after editor event taskInputs began lowering into EventDefinition.taskInputs and EventRuntimeCandidate.taskInputs.`
- `SceneRuntimeResult already has taskInputs but runSceneFromEvent returns an empty array.`
- `The first task must prove the smallest lawful scene runtime propagation slice before production code changes.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile` | `active` | `Inventory scene runtime taskInputs propagation seams and select the smallest runtime-owned slice.` | `none` | `No production code changes before baseline.` |
| `task.script-editor-scene-runtime-task-input-propagation.runtime-propagation-implementation` | `pending` | `Implement the selected scene runtime taskInputs propagation slice with tests.` | `task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile` | `Must preserve RuntimeResult.taskInputs as the only settlement channel.` |
| `task.script-editor-scene-runtime-task-input-propagation.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-scene-runtime-task-input-propagation.runtime-propagation-implementation` | `Do not infer version closeout from this queue.` |

### Task Definitions

#### `task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/contracts/scene-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-scene-runtime-task-input-propagation-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-task-chain-runtime-handoff-convergence-queue.md`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/contracts/scene-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `parallel task update channels outside RuntimeResult.taskInputs`
  - `legacy application/story runtime unless proven as the smallest required seam`
  - `launch policy or playable/minigame bindings`
- done_when:
  - `Event runtime candidate taskInputs, scene runtime result taskInputs, and runtime dispatch settlement seams are inventoried.`
  - `The smallest lawful propagation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, expected taskInputs behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "taskInputs|runStoryTriggerRuntime|runSceneFromEvent|EventRuntimeCandidate|SceneRuntimeResult|dispatchRuntimeRequest" src tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if propagation requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-scene-runtime-task-input-propagation.runtime-propagation-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the scene runtime taskInputs propagation slice.`

##### Human Context

- task_brief:
  - `Find the smallest scene runtime propagation boundary for event taskInputs.`
- task_outcome_summary:
  - `Active.`
- Purpose:
  - `Move event-authored taskInputs from candidate selection into scene runtime output so upstream runtime dispatch can settle them canonically.`
- Failure mode:
  - `Leaving SceneRuntimeResult.taskInputs empty forces callers to manually stitch candidate taskInputs into routers.`

#### `task.script-editor-scene-runtime-task-input-propagation.runtime-propagation-implementation`

##### Control Block

- task_id: `task.script-editor-scene-runtime-task-input-propagation.runtime-propagation-implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `src/core/runtime/scene-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-scene-runtime-task-input-propagation-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-scene-runtime-task-input-propagation.boundary-baseline-reconcile.`
  - `src/core/runtime/scene-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `parallel task update channels outside RuntimeResult.taskInputs`
  - `unrelated editor export/import behavior already landed by predecessor queue`
- done_when:
  - `The selected propagation slice is implemented test-first.`
  - `Scene runtime returns activated event taskInputs for runtime dispatch settlement.`
  - `Queue documentation records implementation result and next task promotion.`
- verify_with:
  - `targeted failing robustness test for scene runtime taskInputs propagation`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
  - `git diff --check`
- if_blocked:
  - `Record the blocker and route to version review if the baseline-selected slice proves impossible without another prerequisite queue.`
- promote_next_if_done: `task.script-editor-scene-runtime-task-input-propagation.queue-closeout-and-handoff`
- stop_if:
  - `Implementation would bypass RuntimeResult.taskInputs or require unrelated launch/playable/schema work.`

##### Human Context

- task_brief:
  - `Implement scene runtime taskInputs propagation.`
- task_outcome_summary:
  - `Pending boundary baseline selection.`
- Purpose:
  - `Allow scene runtime callers to receive taskInputs emitted by activated event candidates.`
- Failure mode:
  - `Manual caller-side stitching would make task handoff inconsistent across runtime paths.`

#### `task.script-editor-scene-runtime-task-input-propagation.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-scene-runtime-task-input-propagation.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-scene-runtime-task-input-propagation-queue.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-scene-runtime-task-input-propagation-queue.md`
- must_not_change:
  - `version closeout state without explicit version-level acceptance`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Residue posture is recorded.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
  - `Repository sync is attempted and the result is recorded in queue sync fields.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
  - `git diff --check`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked according to the queue closeout judgement rule.`
- promote_next_if_done: `version-review`
- stop_if:
  - `Required implementation verification has not passed.`

##### Human Context

- task_brief:
  - `Verify, classify residue, and return control to version review.`
- task_outcome_summary:
  - `Pending implementation.`
- Purpose:
  - `Prevent scene runtime propagation from being mistaken for full task-chain version completion.`
- Failure mode:
  - `Closing without residue classification would hide remaining task-chain runtime blockers.`
