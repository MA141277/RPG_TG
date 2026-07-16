# Old Event Runtime Retirement Queue

## Control Block

- queue_id: `queue.old-event-runtime-retirement`
- belongs_to_version: `target.script-editor-event-binding-runtime-replacement`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-17`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-final`
- active_task: `task.old-event-runtime-retirement.evidence-anchor-reconcile`
- next_task: `task.old-event-runtime-retirement.retirement-guard-and-delete`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Queue admitted after EventBindingRuntime selector and TriggerContext story adapter verification passed; old trigger scanning evidence lock is active.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue admission truth recorded locally; no push attempted.`
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
  - `Delete old events[].trigger/conditions runtime scanning and compatibility shims now that EventBindingRuntime replacement behavior is verified.`
- Forbidden expansions:
  - `Do not reintroduce trigger or conditions into events.json.`
  - `Do not remove EventBindingRuntime or story TriggerContext adapter paths.`
  - `Do not take over sub-runtime lifecycle ownership while deleting old event runtime paths.`

### Evidence Lock

- evidence_lock_status: `in-progress`
- implementation_anchor_status: `collecting`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001`
- acceptance_not_claimed: []
- minimum_verification:
  - `node --test --test-name-pattern "old event runtime retirement|event binding runtime" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001: Old EventDefinition.trigger/conditions scanning paths are deleted and guarded against regression.`

#### Cannot Claim

- `Version closeout until all retirement guards and full verification pass and version closeout is explicitly recorded.`

#### Legacy Paths To Replace

- `src/application/events/trigger-evaluator.ts selectTriggeredEvents scans EventDefinition.trigger and EventDefinition.conditions.`
- `src/core/runtime/event-runtime.ts runEventRuntime imports selectTriggeredEvents and maps trigger priority into candidates.`
- `src/core/contracts/event-runtime.ts imports TriggerEvaluationInput from the old evaluator.`
- `src/application/story/story-runtime.ts still preserves a no-binding-table fallback through selectTriggeredEvents.`
- `tests/robustness.test.cjs still has old selector assertions for triggerless event bodies.`

#### Compatibility Paths To Preserve

- `src/core/runtime/event-binding-runtime.ts remains the selector for double-table EventBinding input.`
- `src/application/story/story-runtime.ts remains the TriggerContext adapter for story trigger paths.`
- `src/application/events/event-runner.ts remains the eventHistory write path.`
- `src/core/runtime/event-activation.ts remains the activation candidate handoff.`

### Queue Snapshot

- queue_goal: `Remove old event trigger scanning after EventBindingRuntime replacement verification.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Lock old runtime retirement anchors before deleting compatibility paths.`
- task_briefs:
  - `task.old-event-runtime-retirement.evidence-anchor-reconcile: Confirm old trigger scanning dependencies and replacement coverage before deletion.`
  - `task.old-event-runtime-retirement.retirement-guard-and-delete: Add guard tests and delete old trigger evaluator/runtime scanning paths test-first.`
  - `task.old-event-runtime-retirement.queue-closeout-and-version-handoff: Verify retirement, record no remaining same-family residue, and return to version closeout review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at queue closeout.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.old-event-runtime-retirement.evidence-anchor-reconcile` | `active` | `Confirm old trigger scanning dependencies and replacement coverage before deletion.` | `none` | `Do not delete feature code before evidence_lock_status is locked.` |
| `task.old-event-runtime-retirement.retirement-guard-and-delete` | `queued` | `Add guard tests and delete old trigger evaluator/runtime scanning paths test-first.` | `task.old-event-runtime-retirement.evidence-anchor-reconcile` | `Must keep EventBindingRuntime and TriggerContext adapter behavior passing.` |
| `task.old-event-runtime-retirement.queue-closeout-and-version-handoff` | `queued` | `Verify retirement, record no remaining same-family residue, and return to version closeout review.` | `task.old-event-runtime-retirement.retirement-guard-and-delete` | `Version remains open until explicit closeout record is written.`

### Task Definitions

#### `task.old-event-runtime-retirement.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.old-event-runtime-retirement.evidence-anchor-reconcile`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `src/application/events/trigger-evaluator.ts`
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/contracts/event-runtime.ts`
  - `src/domain/event.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Old trigger evaluator imports and tests`
  - `EventBindingRuntime replacement behavior`
  - `Story TriggerContext adapter fallback behavior`
  - `EventDefinition trigger/conditions type optionality`
- must_not_change:
  - `feature code before evidence_lock_status is locked`
  - `EventBindingRuntime replacement behavior`
  - `sub-runtime lifecycle ownership`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Must inspect, must modify, must preserve, and minimum verification are recorded.`
  - `First deletion task has a concrete TDD guard target.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "selectTriggeredEvents|trigger-evaluator|EventDefinition.*trigger|EventDefinition.*conditions|eventDefinition\\.trigger|eventDefinition\\.conditions" src tests/robustness.test.cjs`
- if_blocked:
  - `Record blocker in this queue and version truth.`
- promote_next_if_done: `task.old-event-runtime-retirement.retirement-guard-and-delete`
- stop_if:
  - `EventBindingRuntime replacement verification is missing or failing.`

##### Human Context

- task_brief:
  - `Lock old runtime retirement evidence before deletion.`
- task_outcome_summary:
  - `Pending.`
- Purpose:
  - `Prevent deletion from removing still-needed replacement behavior or sub-runtime handoff paths.`
- Failure mode:
  - `Deleting compatibility code before guard tests prove no old trigger path remains.`

##### Progress Log

- `2026-07-17`: `Queue admitted after EventBindingRuntime convergence closed with focused and full test verification.`
- `2026-07-17`: `Initial evidence found old trigger scanning in trigger-evaluator.ts, core event-runtime imports, event-runtime contract imports, story-runtime fallback, and robustness tests that call selectTriggeredEvents directly.`

#### `task.old-event-runtime-retirement.retirement-guard-and-delete`

##### Control Block

- task_id: `task.old-event-runtime-retirement.retirement-guard-and-delete`
- state: `queued`
- task_kind: `execution`
- scope:
  - `src/application/events/trigger-evaluator.ts`
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/contracts/event-runtime.ts`
  - `src/domain/event.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Evidence lock from task.old-event-runtime-retirement.evidence-anchor-reconcile.`
- must_modify:
  - `tests/robustness.test.cjs`
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/core/contracts/event-runtime.ts`
  - `src/domain/event.ts`
- must_replace:
  - `Old selectTriggeredEvents and EventDefinition.trigger/conditions runtime scanning with EventBindingRuntime-only guards.`
- must_preserve:
  - `EventBindingRuntime selector behavior.`
  - `Story TriggerContext adapter behavior.`
  - `Event activation and eventHistory write path.`
- must_not_change:
  - `events.json triggerless double-table format`
  - `sub-runtime lifecycle ownership`
- done_when:
  - `No production runtime imports selectTriggeredEvents or trigger-evaluator.`
  - `EventDefinition no longer exposes runtime trigger/conditions fields.`
  - `Guard tests fail on old trigger runtime path reintroduction and pass with EventBindingRuntime replacement.`
- verify_with:
  - `node --test --test-name-pattern "old event runtime retirement|event binding runtime" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in queue and version truth.`
- promote_next_if_done: `task.old-event-runtime-retirement.queue-closeout-and-version-handoff`
- stop_if:
  - `A legacy pack still requires events[].trigger/conditions to trigger after EventBindingRuntime verification.`

##### Human Context

- task_brief:
  - `Delete old trigger evaluator/runtime scanning paths with regression guards.`
- task_outcome_summary:
  - `Pending.`
- Purpose:
  - `Finish the double-table event replacement by making old event-body trigger scanning unavailable to production runtime.`
- Failure mode:
  - `Leaving old trigger data as a silent second source of truth.`

#### `task.old-event-runtime-retirement.queue-closeout-and-version-handoff`

##### Control Block

- task_id: `task.old-event-runtime-retirement.queue-closeout-and-version-handoff`
- state: `queued`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/old-event-runtime-retirement-queue.md`
  - `docs/blueprints/project-progress.md`
  - `src`
  - `tests`
- must_inspect:
  - `retirement task outcome`
  - `full verification output`
  - `remaining old trigger scanning references`
- must_modify:
  - `docs/blueprints/queues/old-event-runtime-retirement-queue.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_replace:
  - `active queue truth with closeout or blocker truth after retirement verification`
- must_preserve:
  - `version remains open until explicit version closeout`
- must_not_change:
  - `version_status to done unless version closeout criteria are recorded`
- done_when:
  - `Old runtime retirement verification is recorded.`
  - `No same-family residue remains or the blocker is recorded.`
  - `Version closeout review is routed.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in queue and version truth.`
- promote_next_if_done: `none`
- stop_if:
  - `Verification fails or version closeout criteria are not met.`

##### Human Context

- task_brief:
  - `Close or route the final retirement queue after verification.`
- task_outcome_summary:
  - `Pending.`
- Purpose:
  - `Return the version to closeout review after old trigger scanning is retired.`
- Failure mode:
  - `Marking the version done before retirement guards and full verification pass.`
