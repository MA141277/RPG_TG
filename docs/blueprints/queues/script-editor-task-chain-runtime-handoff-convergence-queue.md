# Script Editor Task Chain Runtime Handoff Convergence Queue

## Control Block

- queue_id: `queue.script-editor-task-chain-runtime-handoff-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-continuation`
- active_task: `task.script-editor-task-chain-runtime-handoff-convergence.task-handoff-runtime-implementation`
- next_task: `task.script-editor-task-chain-runtime-handoff-convergence.queue-closeout-and-handoff`
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
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `Commit 1410f43 pushed to origin/mod-first-dev after same-family task-chain runtime handoff continuation admission.`
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
  - `Converge the next bounded task-chain runtime handoff slice after event-to-event runtime chains landed, so editor-authored task progression can enter the unified taskInputs settlement seam.`
- Forbidden expansions:
  - `Do not implement scenario launch policy or startup selection inside this queue by convenience.`
  - `Do not implement playable/minigame bindings unless a later admitted queue loads playable governance first.`
  - `Do not rewrite all task, event, story, and dialogue systems before proving one bounded task handoff seam.`
  - `Do not bypass RuntimeResult.taskInputs with a parallel task update or direct task-state mutation channel.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-event-task-chain-runtime-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Create the next runtime-owned task handoff path from editor-authored event/scene chain data into unified taskInputs settlement.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Implement the selected event-level taskInputs handoff slice with tests.`
- task_briefs:
  - `task.script-editor-task-chain-runtime-handoff-convergence.boundary-baseline-reconcile: inventory editor task-chain seams and select the smallest lawful runtime handoff slice.`
  - `task.script-editor-task-chain-runtime-handoff-convergence.task-handoff-runtime-implementation: implement the selected task handoff slice with tests.`
  - `task.script-editor-task-chain-runtime-handoff-convergence.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-event-task-chain-runtime-convergence closed after explicit editor nextEventId began lowering into EventDefinition.nextEventId and runtime scene completion began following chained events.`
- `Runtime already has one canonical task settlement seam: RuntimeResult.taskInputs are consumed by runtime-dispatch and settled through task-runtime into RuntimeState.core.runtime.tasks.`
- `Script-editor shared-rule compilation already emits TaskDefinition records from quests, but editor event/scene chain data still does not emit task start/progress/complete/fail inputs into that runtime seam.`
- `The first task must prove the smallest lawful task handoff slice before production code changes.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-task-chain-runtime-handoff-convergence.boundary-baseline-reconcile` | `done` | `Inventoried task-chain seams and selected event-level taskInputs handoff as the smallest runtime-owned slice.` | `none` | `No production code changed during baseline.` |
| `task.script-editor-task-chain-runtime-handoff-convergence.task-handoff-runtime-implementation` | `active` | `Implement the selected event-level taskInputs handoff runtime slice with tests.` | `task.script-editor-task-chain-runtime-handoff-convergence.boundary-baseline-reconcile` | `Must use RuntimeResult.taskInputs; no parallel task update channel.` |
| `task.script-editor-task-chain-runtime-handoff-convergence.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-task-chain-runtime-handoff-convergence.task-handoff-runtime-implementation` | `Do not infer version closeout from this queue.` |

### Task Definitions

#### `task.script-editor-task-chain-runtime-handoff-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-task-chain-runtime-handoff-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/application/scene/scene-runner.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/task-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-task-chain-runtime-handoff-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-event-task-chain-runtime-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/application/scene/scene-runner.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/task-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `parallel task update channels outside RuntimeResult.taskInputs`
  - `unbounded full task/story/event rewrite`
- done_when:
  - `Current editor task authoring, shared-rule task definitions, scene/event runtime actions, runtime result taskInputs, runtime dispatch, task runtime, and tests are inventoried.`
  - `The smallest lawful task handoff implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, expected runtime task behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "taskInputs|TaskDefinition|TaskAction|TaskSignal|startTask|complete|fail|signal|nextEventId|ActionNode" src tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if schema supersession, scenario launch policy, or playable governance must precede the selected slice.`
- promote_next_if_done: `task.script-editor-task-chain-runtime-handoff-convergence.task-handoff-runtime-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the next task-chain handoff slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest runtime-owned task handoff boundary after event chains exist.`
- task_outcome_summary:
  - `Done. Baseline selected explicit event-level taskInputs lowering: add editor/runtime event taskInputs as the smallest handoff slice, expose them through EventRuntimeCandidate.taskInputs, and verify they settle through existing RuntimeResult.taskInputs/runtime-dispatch/task-runtime rather than a parallel task-state path.`
- Purpose:
  - `Make editor-authored task progression enter the same runtime settlement path used by routed taskInputs.`
- Failure mode:
  - `A direct task-state mutation or compatibility-only field preservation would bypass the unified task runtime.`

##### Progress Log

- `2026-07-15`: `Baseline inventory found ScriptEditorProjectDefinition already exports quests into TaskDefinition records, RuntimeResult.taskInputs is the canonical task settlement seam, runtime-dispatch already settles taskInputs through applyTaskAction/applyTaskSignal, EventRuntimeCandidate already has optional taskInputs, and core scene runtime already exposes SceneRuntimeResult.taskInputs but returns an empty array.`
- `2026-07-15`: `Mismatch recorded: ScriptEditorEventRecord and EventDefinition do not carry taskInputs, toEventRuntimeCandidate currently hardcodes taskInputs: [], and scene/story runner paths do not provide a task input authoring handoff.`
- `2026-07-15`: `Selected implementation slice: add test-first support for event-level taskInputs on editor events, lower validated task action/signal inputs into runtime EventDefinition.taskInputs, expose those inputs from event runtime candidates, and prove dispatchRuntimeRequest can settle the emitted candidate taskInputs through the existing task runtime. Scene-local task input actions, old application/story direct runner integration, launch policy, playable/minigame bindings, and full task graph orchestration remain out of scope.`

#### `task.script-editor-task-chain-runtime-handoff-convergence.task-handoff-runtime-implementation`

##### Control Block

- task_id: `task.script-editor-task-chain-runtime-handoff-convergence.task-handoff-runtime-implementation`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/application/scene/scene-runner.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/task-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-task-chain-runtime-handoff-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-task-chain-runtime-handoff-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/application/scene/scene-runner.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/task-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `parallel task update channels outside RuntimeResult.taskInputs`
  - `unbounded full task/story/event rewrite`
  - `task chain behavior not selected by boundary-baseline-reconcile`
- done_when:
  - `The selected task handoff runtime slice is implemented test-first.`
  - `Editor-authored task progression selected by the baseline lowers into RuntimeResult.taskInputs instead of a parallel task mutation path.`
  - `Runtime dispatch and task runtime settlement behavior are verified for the selected slice.`
  - `Queue documentation records the implementation result, remaining residue, and next task promotion.`
- verify_with:
  - `targeted failing robustness test for the selected task handoff slice`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
  - `git diff --check`
- if_blocked:
  - `Record the blocker in this queue and route to version review if the baseline-selected slice proves impossible without a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-task-chain-runtime-handoff-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation would bypass RuntimeResult.taskInputs or require unrelated launch/playable/schema supersession work.`

##### Human Context

- task_brief:
  - `Implement the baseline-selected task handoff runtime slice.`
- task_outcome_summary:
  - `Active after boundary baseline selected event-level taskInputs lowering.`
- Purpose:
  - `Turn the selected editor-authored task progression event into canonical runtime taskInputs settlement.`
- Failure mode:
  - `Adding a side-channel task mutation would make script-editor exports incompatible with the unified task runtime contract.`

#### `task.script-editor-task-chain-runtime-handoff-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-task-chain-runtime-handoff-convergence.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-task-chain-runtime-handoff-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-task-chain-runtime-handoff-convergence-queue.md`
- must_not_change:
  - `production code after implementation verification unless a closeout blocker requires a targeted documentation-only correction`
  - `version closeout state without explicit version-level acceptance`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Same-family, cross-family, accepted, or no-residue posture is recorded.`
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
  - `Prevent the bounded task handoff implementation from being mistaken for full version completion.`
- Failure mode:
  - `Closing without residue classification would hide remaining task-chain runtime blockers.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-event-task-chain-runtime-convergence.queue-closeout-and-handoff`
- Recorded handoff at activation:
  - `Event-chain runtime convergence closed after explicit editor nextEventId exported to EventDefinition.nextEventId and scene completion followed chained runtime events.`
- Recorded expected output:
  - `A source-backed task handoff runtime model or an explicit prerequisite routing decision.`
