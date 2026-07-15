# Script Editor Branching Event Task Chain Convergence Queue

## Control Block

- queue_id: `queue.script-editor-branching-event-task-chain-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-branching-event-task-chain-convergence.boundary-baseline-reconcile`
- next_task: `none`
- closeout_status: `in-progress`
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
- sync_summary: `Commit 0f2a560 pushed to origin/mod-first-dev after branching/event/task-chain queue admission.`
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
  - `Converge the first bounded branching/event/task-chain slice after dialogue/story materialization and event-to-scene runtime handoff are verified, so richer authored narrative progression can move through governed runtime structures instead of export-only residue.`
- Forbidden expansions:
  - `Do not implement scenario launch policy or startup selection inside this queue by convenience.`
  - `Do not implement playable/minigame bindings unless baseline proves a direct prerequisite and playable governance is loaded first.`
  - `Do not rewrite all dialogue/story/event/task systems before selecting the smallest lawful progression slice.`
  - `Do not reintroduce compatibility-only adapters as the final branching/progression model.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-dialogue-story-runtime-handoff-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Determine and implement the smallest branching/event/task-chain convergence slice after basic dialogue structures and runtime handoff are verified.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Baseline must inspect dialogue choice/followUp records, story-progress/dialogue-finished timings, event effect chains, task runtime state, and import/export behavior before selecting one bounded implementation slice.`
- task_briefs:
  - `task.script-editor-branching-event-task-chain-convergence.boundary-baseline-reconcile: inventory branching/event/task-chain seams and select the smallest lawful progression implementation slice.`
  - `task.script-editor-branching-event-task-chain-convergence.progression-contract-implementation: implement the selected branching/event/task-chain slice with tests.`
  - `task.script-editor-branching-event-task-chain-convergence.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

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

- `queue.script-editor-dialogue-story-structure-convergence closed after landing the shared dialogue/story runtime materializer seam.`
- `queue.script-editor-dialogue-story-runtime-handoff-convergence closed after verifying editor event -> dialogue destination -> materialized scene -> runStoryTriggerRuntime handoff coverage.`
- `The target spec marks branching dialogue choices, event effect chains, task stages, long-running task state, completion/failure conditions, rewards, and runtime progression handoff as required.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-branching-event-task-chain-convergence.boundary-baseline-reconcile` | `active` | `Inventory branching dialogue, event progression, and task-chain seams; select the smallest lawful implementation slice.` | `none` | `Production code must not change before baseline records the selected slice.` |
| `task.script-editor-branching-event-task-chain-convergence.progression-contract-implementation` | `pending` | `Implement the selected branching/event/task-chain progression slice with tests.` | `task.script-editor-branching-event-task-chain-convergence.boundary-baseline-reconcile` | `Implementation scope is determined by baseline only.` |
| `task.script-editor-branching-event-task-chain-convergence.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-branching-event-task-chain-convergence.progression-contract-implementation` | `Closeout must not infer version closeout.` |

### Task Definitions

#### `task.script-editor-branching-event-task-chain-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-branching-event-task-chain-convergence.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/story/story-runtime.ts`
  - `src/application/scene/choice-resolver.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-branching-event-task-chain-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md`
  - `docs/blueprints/queues/script-editor-dialogue-story-structure-convergence-queue.md`
  - `docs/blueprints/queues/script-editor-dialogue-story-runtime-handoff-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/story/story-runtime.ts`
  - `src/application/scene/choice-resolver.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded all-narrative rewrite`
  - `unrelated city/building/character authoring behavior`
- done_when:
  - `Current dialogue choice/followUp records, story-progress/dialogue-finished timing, event destination/effect chains, task runtime state, and import/export behavior are inventoried.`
  - `The exact mismatch between authored branching/progression data and runtime-owned progression state is recorded.`
  - `The smallest lawful branching/event/task-chain implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, runtime progression behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "choice|followUps|story-progress|dialogue-finished|nextEventId|entrySceneId|task|TaskDefinition|startTask|completeTask|advanceStorySceneStep|chooseStorySceneOption" src/application src/core src/domain tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if scenario launch policy, playable governance, or schema supersession must precede the selected slice.`
- promote_next_if_done: `task.script-editor-branching-event-task-chain-convergence.progression-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the first branching/event/task-chain slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest branching/event/task-chain progression boundary after basic materialization and runtime handoff exist.`
- task_outcome_summary:
  - `Active. Baseline must decide whether the first lawful slice is dialogue choice lowering, followUp/event chaining, story-progress/dialogue-finished trigger ownership, task-chain state progression, or a prerequisite routing decision.`
- Purpose:
  - `Prevent richer authored narrative progression from remaining unsupported export residue after linear dialogue runtime handoff is verified.`
- Failure mode:
  - `The queue expands into a broad narrative rewrite before proving one bounded progression seam.`

##### Progress Log

- `2026-07-15`: `Queue admitted from version promotion review after dialogue/story runtime handoff convergence closed and routed richer progression, branching, followUps, story-node relation lowering, import reconstruction, and broader event/task progression residue back to version review.`

#### `task.script-editor-branching-event-task-chain-convergence.progression-contract-implementation`

##### Control Block

- task_id: `task.script-editor-branching-event-task-chain-convergence.progression-contract-implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded all-narrative rewrite`
- done_when:
  - `The selected branching/event/task-chain progression slice is implemented.`
  - `Tests cover the selected runtime progression behavior and fail-closed diagnostics for unsupported references or progression shapes.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into unrelated launch policy or playable/minigame work.`
- promote_next_if_done: `task.script-editor-branching-event-task-chain-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires another prerequisite queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected branching/event/task-chain progression slice.`
- task_outcome_summary:
  - `Pending baseline.`
- Purpose:
  - `Make one bounded richer narrative progression path runtime-owned and verified.`
- Failure mode:
  - `The queue lands another export-only patch while runtime progression ownership remains unresolved.`

#### `task.script-editor-branching-event-task-chain-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-branching-event-task-chain-convergence.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-branching-event-task-chain-convergence-queue.md`
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
  - `Progression acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the branching/event/task-chain convergence queue after verified implementation.`
- task_outcome_summary:
  - `Pending implementation.`
- Purpose:
  - `Keep richer narrative progression convergence explicit before scenario launch, playable/minigame binding, or final validation queues continue.`
- Failure mode:
  - `Closing without progression evidence would leave branching/event/task-chain behavior unsupported or compatibility-only.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-dialogue-story-runtime-handoff-convergence.queue-closeout-and-handoff`
- Recorded handoff at activation:
  - `Dialogue/story runtime handoff convergence closed after verifying event-to-dialogue-scene runtime handoff; story-progress/dialogue-finished trigger lowering, branching choices, followUps, story-node relation lowering, runtime-scene import reconstruction, and broader event/task progression remained outside that slice.`
- Recorded expected output:
  - `A bounded branching/event/task-chain implementation path or an explicit prerequisite routing decision.`
