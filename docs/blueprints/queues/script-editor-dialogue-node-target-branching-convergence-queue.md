# Script Editor Dialogue Node Target Branching Convergence Queue

## Control Block

- queue_id: `queue.script-editor-dialogue-node-target-branching-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-continuation`
- active_task: `task.script-editor-dialogue-node-target-branching-convergence.boundary-baseline-reconcile`
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
- sync_summary: `Commit 9d0c050 pushed to origin/mod-first-dev after this dialogue node-target branching continuation was admitted.`
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
  - `Converge real runtime support for script-editor dialogue node target references so nextNodeId and choiceTargetNodeId can lower into explicit runtime progression targets instead of remaining fail-closed export blockers.`
- Forbidden expansions:
  - `Do not implement broad event/task chains before dialogue node targets have a stable runtime destination model.`
  - `Do not reintroduce compatibility-only linearization or silent fallback when authored branching references exist.`
  - `Do not implement playable/minigame bindings unless a later admitted queue loads playable governance first.`
  - `Do not change scenario launch policy by convenience.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-branching-event-task-chain-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Create the runtime node-target branching model needed before richer dialogue/event/task chains can safely lower from editor data.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Inventory dialogue node target references, runtime SceneDefinition/ChoiceOption target seams, and materializer/export/import behavior before selecting the smallest lawful runtime branching implementation slice.`
- task_briefs:
  - `task.script-editor-dialogue-node-target-branching-convergence.boundary-baseline-reconcile: inventory node-target branching seams and select the smallest real runtime implementation slice.`
  - `task.script-editor-dialogue-node-target-branching-convergence.node-target-runtime-implementation: implement the selected node-target branching slice with tests.`
  - `task.script-editor-dialogue-node-target-branching-convergence.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-branching-event-task-chain-convergence closed its bounded guard slice after nextNodeId and choiceTargetNodeId began failing closed instead of silently linearizing.`
- `Runtime already has SceneDefinition actions, ChoiceOption nextSceneId/nextEventId/effects, choice-resolver seams, and event/task runtime seams that must be reconciled before lowering editor node targets.`
- `The first task must prove whether node-target branching should split dialogue nodes into runtime scenes, add a cursor-target model, or route to another prerequisite before production code changes.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-dialogue-node-target-branching-convergence.boundary-baseline-reconcile` | `active` | `Inventory dialogue node target references and runtime branching seams before selecting the implementation slice.` | `none` | `Must not change production code before baseline records the chosen node-target model.` |
| `task.script-editor-dialogue-node-target-branching-convergence.node-target-runtime-implementation` | `pending` | `Implement the selected node-target runtime branching slice with tests.` | `task.script-editor-dialogue-node-target-branching-convergence.boundary-baseline-reconcile` | `Implementation must remove the fail-closed blocker only for the supported node-target subset.` |
| `task.script-editor-dialogue-node-target-branching-convergence.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-dialogue-node-target-branching-convergence.node-target-runtime-implementation` | `Closeout must not infer version closeout.` |

### Task Definitions

#### `task.script-editor-dialogue-node-target-branching-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-dialogue-node-target-branching-convergence.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scene/choice-resolver.ts`
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-dialogue-node-target-branching-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-branching-event-task-chain-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scene/choice-resolver.ts`
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/runtime/task-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded event/task-chain rewrite`
- done_when:
  - `Current nextNodeId and choiceTargetNodeId authoring semantics are mapped to runtime SceneDefinition, ChoiceOption, event handoff, and task runtime seams.`
  - `The queue records whether the smallest lawful implementation is scene splitting, a runtime cursor-target model, a supported subset, or a prerequisite route.`
  - `A test-first implementation plan names exact files, expected runtime behavior, import/export posture, and verification commands for the implementation task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "nextNodeId|choiceTargetNodeId|ChoiceOption|nextSceneId|nextEventId|chooseStorySceneOption|resolveChoiceOption|runStoryTriggerRuntime|SceneDefinition|ActionNode" src tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if a schema-reference queue or scenario launch policy queue must precede node-target branching.`
- promote_next_if_done: `task.script-editor-dialogue-node-target-branching-convergence.node-target-runtime-implementation`
- stop_if:
  - `Fresh evidence proves node-target branching cannot be implemented without first admitting a different prerequisite queue.`

##### Human Context

- task_brief:
  - `Choose the real runtime target model for editor-authored dialogue node references before implementation.`
- task_outcome_summary:
  - `Active. Baseline must decide the smallest non-compatibility implementation slice for nextNodeId/choiceTargetNodeId.`
- Purpose:
  - `Replace the temporary fail-closed blocker with a real runtime-owned branching path.`
- Failure mode:
  - `Lowering node references by linear fallback or ad hoc export rewriting would preserve the original data-loss bug under a new shape.`

#### `task.script-editor-dialogue-node-target-branching-convergence.node-target-runtime-implementation`

##### Control Block

- task_id: `task.script-editor-dialogue-node-target-branching-convergence.node-target-runtime-implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `Scope will be finalized by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-dialogue-node-target-branching-convergence.boundary-baseline-reconcile.`
- must_not_change:
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded event/task-chain rewrite`
- done_when:
  - `The selected node-target branching slice is implemented with tests.`
  - `Supported nextNodeId/choiceTargetNodeId records no longer fail export and instead produce runtime-owned progression targets.`
  - `Unsupported branching shapes still fail closed with clear diagnostics.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into unrelated launch policy, playable/minigame, or full task-chain work.`
- promote_next_if_done: `task.script-editor-dialogue-node-target-branching-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires another prerequisite queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected node-target runtime branching slice.`
- task_outcome_summary:
  - `Pending baseline.`
- Purpose:
  - `Make authored dialogue node target references runtime-consumable rather than export-only residue.`
- Failure mode:
  - `A compatibility adapter that only preserves fields without runtime progression would not satisfy this queue.`

#### `task.script-editor-dialogue-node-target-branching-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-dialogue-node-target-branching-convergence.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-dialogue-node-target-branching-convergence-queue.md`
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
  - `Node-target branching acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the node-target branching queue after verified implementation.`
- task_outcome_summary:
  - `Pending implementation.`
- Purpose:
  - `Return control to version review only after node-target branching is either real, verified, or honestly routed.`
- Failure mode:
  - `Closing without runtime progression evidence would leave the fail-closed blocker as the final behavior.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-branching-event-task-chain-convergence.queue-closeout-and-handoff`
- Recorded handoff at activation:
  - `The predecessor queue landed fail-closed diagnostics for non-empty nextNodeId and choiceTargetNodeId, then routed real node-target branching as same-family residue because runtime lacks a safe dialogue-node target scene/cursor model.`
- Recorded expected output:
  - `A source-backed runtime node-target branching model or an explicit prerequisite routing decision.`
