# Script Editor Condition Authoring Contract Freeze Queue

## Control Block

- queue_id: `queue.script-editor-condition-authoring-contract-freeze`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-condition-authoring-contract-freeze.boundary-baseline-reconcile`
- next_task: `task.script-editor-condition-authoring-contract-freeze.condition-authoring-contract-implementation`
- closeout_status: `open`
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
- sync_scope: `none`
- sync_summary: `Queue admitted locally; repository sync pending.`
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
  - `Freeze a schema-driven typed condition authoring contract for script-editor shared conditions and event-facing conditions before runtime-scale condition use expands.`
- Forbidden expansions:
  - `Do not implement broad runtime condition evaluation in this queue unless baseline proves a tiny validation helper is inseparable from authoring contract freeze.`
  - `Do not widen event/story/city/building runtime handoff while condition authoring is still being frozen.`
  - `Do not add compatibility-only string parsing that preserves conditionType/operator/value as the final runtime-facing contract.`
  - `Do not collapse task shared-rule conditions and event conditions into one untyped free-form field.`
  - `Do not admit playable/minigame condition bindings from this queue without playable governance.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-event-structure-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Freeze the smallest typed condition authoring contract that can replace stringly event condition records and be reused by event/story/city/building queues without widening into runtime evaluation.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Baseline must inventory current shared-rule conditions, event condition records, runtime condition evaluators, and UI authoring helpers before production changes.`
- task_briefs:
  - `task.script-editor-condition-authoring-contract-freeze.boundary-baseline-reconcile: inventory current condition record shapes, UI controls, export lowering, runtime evaluators, and decide the smallest contract slice.`
  - `task.script-editor-condition-authoring-contract-freeze.condition-authoring-contract-implementation: implement the selected typed authoring contract slice with fail-closed validation and tests.`
  - `task.script-editor-condition-authoring-contract-freeze.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-event-structure-convergence closed at baseline without production changes.`
- `That queue proved runtime event structures already exist, but runtime-pack export currently supports only empty-condition editor events for minimal dialogue-destination lowering.`
- `Script-editor event conditionGroups are still stringly typed authoring records, while shared-rule condition groups are task-oriented and cannot be treated as the event-facing contract without a freeze decision.`
- `The target spec classifies queue.script-editor-condition-authoring-contract-freeze as required before event/story/city/building queues depend on typed condition authoring at runtime scale.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-condition-authoring-contract-freeze.boundary-baseline-reconcile` | `active` | `Inventory existing condition authoring/runtime shapes and select the smallest lawful typed authoring contract slice.` | `none` | `Must finish before production code changes.` |
| `task.script-editor-condition-authoring-contract-freeze.condition-authoring-contract-implementation` | `queued` | `Implement the typed condition authoring contract slice selected by baseline reconciliation.` | `task.script-editor-condition-authoring-contract-freeze.boundary-baseline-reconcile` | `Must use tests before implementation changes.` |
| `task.script-editor-condition-authoring-contract-freeze.queue-closeout-and-handoff` | `queued` | `Verify the queue, classify residue, and synchronize Blueprint truth.` | `task.script-editor-condition-authoring-contract-freeze.condition-authoring-contract-implementation` | `Must not close the version without explicit human confirmation.` |

### Task Definitions

#### `task.script-editor-condition-authoring-contract-freeze.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-condition-authoring-contract-freeze.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/domain/event.ts`
  - `src/application/events`
  - `src/core/runtime/event-condition-evaluator.ts`
  - `src/core/contracts/task-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-condition-authoring-contract-freeze-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-event-structure-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/domain/event.ts`
  - `src/application/events/condition-evaluator.ts`
  - `src/application/events/trigger-evaluator.ts`
  - `src/core/runtime/event-condition-evaluator.ts`
  - `src/core/contracts/task-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `runtime condition evaluation convergence`
  - `event/story/city/building runtime handoff`
  - `playable/minigame bindings`
  - `compatibility-only condition parsing`
- done_when:
  - `Current script-editor shared condition groups, event condition groups, UI controls, export lowering, and runtime evaluator condition nodes are inventoried.`
  - `The exact overlap and mismatch between task shared-rule conditions and event-facing conditions is recorded.`
  - `The smallest lawful typed condition authoring contract slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, condition families, validation rules, migration/supersession posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "conditionGroups|SharedConditionNode|ScriptEditorEventCondition|EventCondition|evaluateEventConditionNode|conditionType|operator|expected|task-status|elapsed-time|flag|variable" src/domain src/application src/core tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if schema migration or runtime evaluation must precede condition authoring contract freeze.`
- promote_next_if_done: `task.script-editor-condition-authoring-contract-freeze.condition-authoring-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the first typed condition authoring contract slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest typed condition authoring boundary before changing export or runtime evaluation.`
- task_outcome_summary:
  - `Not started.`
- Purpose:
  - `Avoid widening event/story/city/building condition support through stringly or UI-only records that cannot become a shared runtime-facing contract.`
- Failure mode:
  - `Adding more condition lowering without a typed authoring contract would lock later queues into hidden compatibility parsing or duplicate per-family condition schemas.`

##### Progress Log

- `2026-07-15`: `Queue admitted from promotion review after queue.script-editor-event-structure-convergence routed typed condition authoring contract freeze as the lawful prerequisite.`

#### `task.script-editor-condition-authoring-contract-freeze.condition-authoring-contract-implementation`

##### Control Block

- task_id: `task.script-editor-condition-authoring-contract-freeze.condition-authoring-contract-implementation`
- state: `queued`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `unbounded runtime evaluation migration`
  - `event/story/city/building runtime handoff`
  - `playable/minigame bindings`
  - `compatibility-only string condition lowering`
- done_when:
  - `The selected typed condition authoring contract exists with fail-closed validation.`
  - `Covered editor condition controls no longer depend on final-use stringly conditionType/operator/value records for the selected slice.`
  - `Tests prove valid authored conditions are accepted and invalid/unsupported shapes fail closed with diagnostics.`
- verify_with:
  - `npm run test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not implement compatibility-only parsing.`
- promote_next_if_done: `task.script-editor-condition-authoring-contract-freeze.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires runtime evaluation convergence or schema migration to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the typed condition authoring contract slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Not started.`
- Purpose:
  - `Give later event/story/city/building queues one typed condition authoring source instead of per-family ad hoc condition strings.`
- Failure mode:
  - `Condition records that look editable but cannot be validated or shared across runtime consumers would not satisfy current-version acceptance.`

##### Progress Log

- `2026-07-15`: `Queued behind boundary-baseline-reconcile.`

#### `task.script-editor-condition-authoring-contract-freeze.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-condition-authoring-contract-freeze.queue-closeout-and-handoff`
- state: `queued`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-condition-authoring-contract-freeze-queue.md`
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
  - `Condition authoring contract acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the condition authoring contract freeze queue after verified implementation.`
- task_outcome_summary:
  - `Not started.`
- Purpose:
  - `Keep condition authoring ownership explicit before condition runtime evaluation, event structure expansion, or final validation continues.`
- Failure mode:
  - `Closing without typed authoring evidence would leave later queues depending on unresolved stringly condition records.`

##### Progress Log

- `2026-07-15`: `Queued behind condition-authoring-contract-implementation.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-condition-authoring-contract-freeze.boundary-baseline-reconcile`
- Recorded handoff at activation:
  - `Queue is active and must start by reconciling condition authoring/export/runtime ownership before code changes.`
- Recorded expected output:
  - `A bounded typed condition authoring implementation path or an explicit prerequisite routing decision.`
