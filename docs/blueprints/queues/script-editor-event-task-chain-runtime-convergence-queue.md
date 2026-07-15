# Script Editor Event Task Chain Runtime Convergence Queue

## Control Block

- queue_id: `queue.script-editor-event-task-chain-runtime-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-event-task-chain-runtime-convergence.event-chain-runtime-implementation`
- next_task: `task.script-editor-event-task-chain-runtime-convergence.queue-closeout-and-handoff`
- closeout_status: `pending`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `unknown`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `execute-active-task`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Pending repository sync after queue admission and baseline selection.`
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
  - `Converge the next bounded event/task-chain runtime progression slice now that dialogue node targets can lower into stable runtime scenes.`
- Forbidden expansions:
  - `Do not implement scenario launch policy or startup selection inside this queue by convenience.`
  - `Do not implement playable/minigame bindings unless a later admitted queue loads playable governance first.`
  - `Do not rewrite all event, task, story, and dialogue progression before proving one bounded runtime-owned chain seam.`
  - `Do not reintroduce compatibility-only field preservation as the final event/task-chain model.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-dialogue-node-target-branching-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Create the next runtime-owned event/task-chain progression path beyond dialogue node targets without widening into full narrative/task rewrites.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Implement the selected event-to-event runtime chain slice with tests.`
- task_briefs:
  - `task.script-editor-event-task-chain-runtime-convergence.boundary-baseline-reconcile: inventory event/task-chain runtime seams and select the smallest lawful implementation slice.`
  - `task.script-editor-event-task-chain-runtime-convergence.event-chain-runtime-implementation: implement the selected event-chain runtime slice with tests.`
  - `task.script-editor-event-task-chain-runtime-convergence.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-dialogue-node-target-branching-convergence closed after dialogue nodes began lowering into stable runtime scenes and bounded choiceTargetNodeId references began lowering through ChoiceOption.nextSceneId.`
- `Runtime already has EventDefinition.nextEventId, ChoiceOption.nextEventId, event activation/history, unified RuntimeResult.taskInputs settlement, and TaskDefinition/TaskRuntimeState seams.`
- `Runtime export currently only supports editor events whose destination targets a dialogue; editor event destination family "event" is still unsupported even though runtime EventDefinition already has the nextEventId target field.`
- `The first task must prove the smallest lawful next slice before production code changes.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-task-chain-runtime-convergence.boundary-baseline-reconcile` | `done` | `Inventoried event/task-chain runtime seams and selected event-destination-to-EventDefinition.nextEventId lowering as the smallest runtime-owned chain slice.` | `none` | `No production code changed during baseline.` |
| `task.script-editor-event-task-chain-runtime-convergence.event-chain-runtime-implementation` | `active` | `Implement the selected event-chain runtime slice with tests.` | `task.script-editor-event-task-chain-runtime-convergence.boundary-baseline-reconcile` | `Bounded to editor event destination family "event" lowering through runtime nextEventId and validation diagnostics.` |
| `task.script-editor-event-task-chain-runtime-convergence.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-event-task-chain-runtime-convergence.event-chain-runtime-implementation` | `Do not infer version closeout from this queue.` |

### Task Definitions

#### `task.script-editor-event-task-chain-runtime-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-event-task-chain-runtime-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/event.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-task-chain-runtime-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-dialogue-node-target-branching-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/event.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded full event/task/story rewrite`
  - `unrelated city/building/character authoring behavior`
- done_when:
  - `Current editor event destination, runtime EventDefinition.nextEventId, scene/choice nextEventId, runtime event activation, task input settlement, and export/import behavior are inventoried.`
  - `The smallest lawful event/task-chain implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, expected runtime progression behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "nextEventId|destination|taskInputs|TaskDefinition|startTask|runStoryTriggerRuntime|EventDefinition|ActionNode" src tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if scenario launch policy, playable governance, or schema supersession must precede the selected slice.`
- promote_next_if_done: `task.script-editor-event-task-chain-runtime-convergence.event-chain-runtime-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the next event/task-chain slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest runtime-owned event/task-chain progression boundary after node-target dialogue branching exists.`
- task_outcome_summary:
  - `Done. Baseline selected editor event destination family "event" lowering into runtime EventDefinition.nextEventId as the smallest lawful slice: runtime already owns event entry scenes, event history, nextEventId fields, and task settlement seams, while export still rejects editor events that target another event.`
- Purpose:
  - `Move beyond dialogue-only handoff by making one event-chain target runtime-owned before attempting broader task-chain or story-node relation lowering.`
- Failure mode:
  - `The queue expands into full narrative/task orchestration before proving a bounded event chain seam.`

##### Progress Log

- `2026-07-15`: `Queue admitted from version promotion review after node-target branching closeout routed broader event/task-chain runtime progression back to review.`
- `2026-07-15`: `Baseline inventory found ScriptEditorEventDestination already supports family "event", runtime EventDefinition already has nextEventId, ChoiceOption already has nextEventId, event-runtime/startEvent already records active event and event history, and runtime-dispatch already has one canonical taskInputs settlement seam over TaskDefinition/TaskRuntimeState.`
- `2026-07-15`: `Mismatch recorded: runtime-pack export lowerEditorEventToRuntimeEvent currently rejects every editor event whose destination is not family "dialogue"; imported runtime EventDefinition.nextEventId is currently mapped back as destination family "event", so re-export of imported event chains cannot be final until editor event destinations can lower to nextEventId.`
- `2026-07-15`: `Selected implementation slice: add test-first support for editor event destination family "event" by lowering targetId into EventDefinition.nextEventId while preserving the event's dialogue entry scene requirement for the current event. Missing target events must fail closed; city/building/minigame destinations, task condition runtime expansion, story-node relation lowering, playable/minigame handoff, and scenario launch policy remain out of scope.`

#### `task.script-editor-event-task-chain-runtime-convergence.event-chain-runtime-implementation`

##### Control Block

- task_id: `task.script-editor-event-task-chain-runtime-convergence.event-chain-runtime-implementation`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-task-chain-runtime-convergence-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-event-task-chain-runtime-convergence.boundary-baseline-reconcile.`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded task-chain runtime rewrite`
  - `city/building/minigame event destinations`
- done_when:
  - `Editor event destination family "event" lowers to runtime EventDefinition.nextEventId with tests.`
  - `Referenced target events are validated and missing target event ids fail closed with diagnostics.`
  - `Existing dialogue destination event export and runtime handoff tests remain passing.`
  - `Task-chain, story-node relation, city/building/minigame destination, and playable/minigame residue remain explicitly out of scope unless fresh evidence proves this slice cannot stand alone.`
- verify_with:
  - `npm test -- --test-name-pattern "script editor runtime export.*event"`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and do not widen into unrelated launch policy, playable/minigame, or full task-chain work.`
- promote_next_if_done: `task.script-editor-event-task-chain-runtime-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires another prerequisite queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected event-chain runtime slice.`
- task_outcome_summary:
  - `Active.`
- Purpose:
  - `Make editor-authored event-to-event progression survive runtime export as a real EventDefinition.nextEventId chain.`
- Failure mode:
  - `A compatibility adapter that only preserves imported fields without runtime nextEventId output would not satisfy this queue.`

#### `task.script-editor-event-task-chain-runtime-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-task-chain-runtime-convergence.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-task-chain-runtime-convergence-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `Current queue, version plan, Blueprint, project-progress, and residue truth.`
- must_not_change:
  - `version closeout without explicit human confirmation`
  - `new queue admission without routing truth`
- done_when:
  - `Verification, residue classification, next-step sync, and repository sync truth are recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without marking the queue done.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Event-chain runtime acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the event/task-chain runtime convergence queue after verified implementation.`
- task_outcome_summary:
  - `Pending.`
- Purpose:
  - `Return control to version review only after the bounded event-chain runtime slice is either real, verified, or honestly routed.`
- Failure mode:
  - `Closing without runtime progression evidence would leave event-to-event chains unsupported or compatibility-only.`
