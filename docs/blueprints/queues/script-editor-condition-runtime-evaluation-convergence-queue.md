# Script Editor Condition Runtime Evaluation Convergence Queue

## Control Block

- queue_id: `queue.script-editor-condition-runtime-evaluation-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded runtime evaluation convergence slice landed with verification: editor event conditionGroups now export supported typed condition nodes into runtime EventConditionNode arrays, and task-only/invalid condition nodes fail closed with diagnostics. Broader city/building/story/scenario condition consumption remains cross-family residue for version promotion review.`
- residue_remaining: `yes`
- residue_family: `cross-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Local queue implementation and closeout are recorded; repository sync has not yet been attempted for the closeout commit.`
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
  - `Converge the runtime evaluation boundary for script-editor typed condition nodes after the editor-owned authoring contract has been frozen.`
- Forbidden expansions:
  - `Do not broaden story, city, building, scenario launch, or playable runtime handoff before the baseline identifies the smallest lawful condition-evaluation slice.`
  - `Do not restore legacy conditionType/operator/value string parsing as the final runtime compatibility path.`
  - `Do not silently treat unsupported condition node families as passing conditions.`
  - `Do not add playable/minigame condition bindings from this queue without playable governance.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-condition-authoring-contract-freeze-queue.md`

### Queue Snapshot

- queue_goal: `Decide and implement the smallest typed condition runtime evaluation slice that can safely consume editor-authored condition nodes with explicit context, target/reference resolution, fail-closed diagnostics, and tests.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after the bounded event condition runtime export/evaluation slice verified; broader condition consumption residue returned to version review.`
- task_briefs:
  - `task.script-editor-condition-runtime-evaluation-convergence.boundary-baseline-reconcile: inventory typed condition authoring output, runtime event/task condition evaluators, context availability, target/reference resolution, and select the smallest lawful runtime evaluation slice.`
  - `task.script-editor-condition-runtime-evaluation-convergence.runtime-evaluation-contract-implementation: implement the selected runtime evaluation contract slice with tests and fail-closed diagnostics.`
  - `task.script-editor-condition-runtime-evaluation-convergence.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

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

- `queue.script-editor-condition-authoring-contract-freeze closed after freezing an editor-owned ScriptEditorConditionNode/ScriptEditorConditionGroup contract.`
- `Runtime condition evaluation was explicitly excluded from the authoring-contract queue and routed back to version promotion review as the next typed-condition prerequisite.`
- `Later event/story/city/building queues must not depend on typed condition records until runtime evaluation context, reference resolution, and unsupported-node diagnostics have a bounded convergence path.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-condition-runtime-evaluation-convergence.boundary-baseline-reconcile` | `done` | `Inventoried runtime condition evaluation boundaries and selected event condition export lowering as the smallest lawful implementation slice.` | `none` | `Production code was not changed during baseline.` |
| `task.script-editor-condition-runtime-evaluation-convergence.runtime-evaluation-contract-implementation` | `done` | `Implemented bounded event condition export lowering into runtime EventConditionNode arrays with fail-closed diagnostics.` | `task.script-editor-condition-runtime-evaluation-convergence.boundary-baseline-reconcile` | `Landed with test-first coverage and verification.` |
| `task.script-editor-condition-runtime-evaluation-convergence.queue-closeout-and-handoff` | `done` | `Verified, classified residue, and returned control to version review.` | `task.script-editor-condition-runtime-evaluation-convergence.runtime-evaluation-contract-implementation` | `Closed without version closeout.` |

### Task Definitions

#### `task.script-editor-condition-runtime-evaluation-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-condition-runtime-evaluation-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/event.ts`
  - `src/application/events/condition-evaluator.ts`
  - `src/application/events/trigger-evaluator.ts`
  - `src/core/runtime/event-condition-evaluator.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/core/contracts/task-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-condition-runtime-evaluation-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-condition-authoring-contract-freeze-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/event.ts`
  - `src/application/events/condition-evaluator.ts`
  - `src/application/events/trigger-evaluator.ts`
  - `src/core/runtime/event-condition-evaluator.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/core/contracts/task-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `story/city/building/scenario launch runtime handoff`
  - `playable/minigame bindings`
  - `legacy string condition compatibility as the final contract`
- done_when:
  - `Current typed editor condition nodes, runtime EventConditionNode shape, event trigger evaluation, task shared-rule lowering, context inputs, and diagnostics are inventoried.`
  - `The exact overlap and mismatch between editor-authored condition nodes and runtime evaluators is recorded.`
  - `The smallest lawful runtime evaluation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, condition families, validation rules, unsupported-node diagnostics, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "ScriptEditorConditionNode|ScriptEditorConditionGroup|EventConditionNode|evaluateEventConditionNode|evaluateCondition|conditionGroups|trigger|conditions|flag|variable|chapter|date|location|character|clan|city|mission|custom" src/domain src/application src/core tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if another queue must establish runtime context or reference resolution first.`
- promote_next_if_done: `task.script-editor-condition-runtime-evaluation-convergence.runtime-evaluation-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the first typed condition runtime evaluation slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest runtime evaluation boundary for the newly frozen typed condition authoring contract.`
- task_outcome_summary:
  - `Done. The editor-owned ScriptEditorConditionNode contract already overlaps the runtime EventConditionNode contract for group, flag, variable, event-fired, chapter, location, character-exists, character-available, character-in-city, and mission-status. Runtime evaluation already exists in src/application/events/condition-evaluator.ts and is called by trigger selection in src/application/events/trigger-evaluator.ts. The current blocker is script-editor runtime export: lowerEditorEventRecord rejects any non-empty editor event condition group and emits events with conditions: []. The smallest lawful slice is to add export lowering from editor event condition groups into runtime EventConditionNode arrays for the overlapping supported subset, keep task-only signal/task-status/elapsed-time and unknown types fail-closed with diagnostics, and cover passing/failing export behavior plus runtime evaluator selection behavior in tests.`
- Purpose:
  - `Prevent later authoring/runtime queues from consuming typed condition records through undefined context, silent pass behavior, or hidden legacy compatibility parsing.`
- Failure mode:
  - `A condition can be authored but cannot be evaluated deterministically, making exported packs appear valid while runtime behavior is wrong or silently incomplete.`

##### Progress Log

- `2026-07-15`: `Queue admitted from promotion review after queue.script-editor-condition-authoring-contract-freeze routed runtime evaluation convergence as the next typed-condition prerequisite.`
- `2026-07-15`: `Baseline inspected src/domain/script-editor-project.ts, src/domain/event.ts, src/application/events/condition-evaluator.ts, src/application/events/trigger-evaluator.ts, src/core/runtime/event-condition-evaluator.ts, src/application/script-editor/runtime-pack-export.ts, src/application/script-editor/shared-rule-compiler.ts, src/core/contracts/task-runtime.ts, and tests/robustness.test.cjs.`
- `2026-07-15`: `Current inventory: editor condition nodes cover shared task-oriented nodes plus a bounded event-runtime subset; runtime EventConditionNode and evaluateEventConditionNode already support deterministic evaluation with explicit context; selectTriggeredEvents already evaluates eventDefinition.conditions; task shared-rule lowering remains a separate TaskCondition lowering path.`
- `2026-07-15`: `Selected smallest lawful slice: add script-editor runtime export lowering for event conditionGroups into runtime EventConditionNode arrays for group/all/any/not, flag, variable, event-fired, chapter, location, character-exists, character-available, character-in-city, and mission-status. Continue to reject signal, task-status, elapsed-time, malformed group nodes, and unknown future condition families with unsupported-lowering/invalid-field diagnostics rather than silent pass behavior.`
- `2026-07-15`: `Implementation plan for the next task: write failing robustness tests proving event condition groups export into events.json conditions, unsupported task-only condition nodes fail closed during runtime export, and trigger selection evaluates the exported conditions through the existing runtime evaluator; then update src/application/script-editor/runtime-pack-export.ts and tests only unless the test proves a narrower type helper is needed. Verification must include npm test, npm run typecheck, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check.`

#### `task.script-editor-condition-runtime-evaluation-convergence.runtime-evaluation-contract-implementation`

##### Control Block

- task_id: `task.script-editor-condition-runtime-evaluation-convergence.runtime-evaluation-contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `unbounded story/city/building/scenario launch runtime handoff`
  - `playable/minigame bindings`
  - `compatibility-only legacy string parsing`
- done_when:
  - `The selected runtime evaluation contract slice is implemented.`
  - `Covered typed condition nodes evaluate through explicit context/reference resolution.`
  - `Unsupported or invalid condition nodes fail closed with diagnostics.`
  - `Tests cover passing, failing, and unsupported-node behavior for the selected slice.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen runtime handoff opportunistically.`
- promote_next_if_done: `task.script-editor-condition-runtime-evaluation-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires a broader runtime context queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the typed condition runtime evaluation slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Done. Runtime-pack export now lowers supported script-editor event conditionGroups into runtime EventConditionNode arrays for group/all/any/not, flag, variable, event-fired, chapter, location, character-exists, character-available, character-in-city, and mission-status. Unsupported task-only event condition nodes such as signal continue to fail closed with diagnostics. Tests prove events.json carries the lowered conditions and selectTriggeredEvents evaluates the exported condition nodes through the existing runtime evaluator.`
- Purpose:
  - `Give editor-exported condition records deterministic runtime behavior for the bounded supported subset.`
- Failure mode:
  - `Runtime accepts condition records that are not actually evaluated, or evaluates them through incomplete implicit context.`

##### Progress Log

- `2026-07-15`: `Queued behind boundary-baseline-reconcile.`
- `2026-07-15`: `Activated after baseline selected bounded event condition export lowering as the smallest runtime evaluation convergence slice.`
- `2026-07-15`: `Added failing tests for supported event condition export lowering, task-only condition fail-closed behavior, and trigger selection evaluation of exported conditions, then implemented the lowering in src/application/script-editor/runtime-pack-export.ts.`
- `2026-07-15`: `Verification passed: targeted red/green tests, npm run typecheck, npm test, npm run build, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check.`

#### `task.script-editor-condition-runtime-evaluation-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-condition-runtime-evaluation-convergence.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-condition-runtime-evaluation-convergence-queue.md`
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
  - `Runtime evaluation acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the condition runtime evaluation convergence queue after verified implementation.`
- task_outcome_summary:
  - `Done. Queue closed with cross-family residue routed to version promotion review for broader city/building/story/scenario condition consumption.`
- Purpose:
  - `Keep typed-condition runtime ownership explicit before event/story/city/building runtime-scale condition use expands.`
- Failure mode:
  - `Closing without runtime evaluation evidence would leave later queues depending on unresolved condition behavior.`

##### Progress Log

- `2026-07-15`: `Queued behind runtime-evaluation-contract-implementation.`
- `2026-07-15`: `Closed after implementation verification. Same-family event condition export/evaluation coverage for the bounded supported subset is complete; broader condition consumers belong to later family-specific queues rather than this slice.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-condition-runtime-evaluation-convergence.boundary-baseline-reconcile`
- Recorded handoff at activation:
  - `Queue baseline selected bounded event condition export lowering as the first implementation slice.`
- Recorded expected output:
  - `Test-first implementation that exports supported editor event condition nodes into runtime EventConditionNode arrays and rejects unsupported task-only/unknown nodes with diagnostics.`
