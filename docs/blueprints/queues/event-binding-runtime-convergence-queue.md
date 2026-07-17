# Event Binding Runtime Convergence Queue

## Control Block

- queue_id: `queue.event-binding-runtime-convergence`
- belongs_to_version: `target.script-editor-event-binding-runtime-replacement`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `EventBindingRuntime selector baseline and TriggerContext story adapter cutover landed and passed focused handoff tests, typecheck, Blueprint lint, and full npm test.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.old-event-runtime-retirement`
- auto_continue_eligible: `true`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout truth recorded locally; branch commit is the repository sync boundary for this queue closeout.`
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
  - `Introduce EventBindingRuntime as the event trigger selector and activation boundary for double-table event input while preserving existing sub-runtime ownership and runtime-result handoff seams.`
- Forbidden expansions:
  - `Do not delete old selectTriggeredEvents or old trigger evaluator paths in this queue unless EventBindingRuntime verification for built-in and exported packs passes and the version plan explicitly routes old-runtime retirement.`
  - `Do not move house, scene, task, navigation, playable, or location-access lifecycle ownership into EventBindingRuntime.`
  - `Do not reintroduce event trigger data into events.json.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-BINDING-RUNTIME-001`
- acceptance_not_claimed:
  - `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001`
- minimum_verification:
  - `node --test --test-name-pattern "event binding runtime" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-BINDING-RUNTIME-001: EventBindingRuntime selects, evaluates, activates, records occurrence/eventHistory, and reports candidates from EventBinding rows through TriggerContext.`

#### Cannot Claim

- `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001: Old EventDefinition.trigger/conditions scanning paths are deleted.`

#### Legacy Paths To Replace

- `src/application/events/trigger-evaluator.ts selectTriggeredEvents still scans EventDefinition.trigger and EventDefinition.conditions.`
- `src/core/runtime/event-runtime.ts runEventRuntime still maps EventDefinition.trigger priority into candidates.`
- `src/application/story/story-runtime.ts triggerStoryEvents still calls selectTriggeredEvents.`

#### Compatibility Paths To Preserve

- `src/core/runtime/event-activation.ts owns event activation handoff.`
- `src/application/events/event-runner.ts owns eventHistory writes when an event starts.`
- `Scene, task, house, navigation, playable, and location-access runtimes keep their lifecycle and settlement ownership.`

### Queue Snapshot

- queue_goal: `Cut runtime event trigger selection to EventBindingRuntime without deleting old trigger scanning yet.`
- task_count: `4`
- completed_task_count: `4`
- remaining_task_count: `0`
- active_task_summary: `None; queue is closed with same-family residue routed to old-event-runtime-retirement.`
- task_briefs:
  - `task.event-binding-runtime-convergence.evidence-anchor-reconcile: Confirm existing trigger paths, active-content eventBindings access, and sub-runtime handoff boundaries before implementation.`
  - `task.event-binding-runtime-convergence.runtime-selector-baseline: Add EventBindingRuntime selection, condition, occurrence, priority, and activation coverage test-first.`
  - `task.event-binding-runtime-convergence.trigger-context-adapter-cutover: Route covered story trigger call sites through TriggerContext without taking over sub-runtime lifecycles.`
  - `task.event-binding-runtime-convergence.queue-closeout-and-handoff: Verify built-in/exported pack trigger behavior and route old-runtime retirement residue.`

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
| `task.event-binding-runtime-convergence.evidence-anchor-reconcile` | `done` | `Confirmed existing trigger paths, active-content eventBindings access, and sub-runtime handoff boundaries before implementation.` | `none` | `Completed on 2026-07-16 after source evidence locked the selector baseline slice.` |
| `task.event-binding-runtime-convergence.runtime-selector-baseline` | `done` | `Added EventBindingRuntime selection, condition, occurrence, priority, and activation coverage test-first.` | `task.event-binding-runtime-convergence.evidence-anchor-reconcile` | `Completed on 2026-07-16; old trigger evaluator remains available for compatibility until retirement queue.` |
| `task.event-binding-runtime-convergence.trigger-context-adapter-cutover` | `done` | `Routed covered story trigger call sites through TriggerContext without taking over sub-runtime lifecycles.` | `task.event-binding-runtime-convergence.runtime-selector-baseline` | `Completed on 2026-07-16; story runtime emits TriggerContext and preserves scene/eventHistory handoff through EventBindingRuntime/startEvent.` |
| `task.event-binding-runtime-convergence.queue-closeout-and-handoff` | `done` | `Verified built-in/exported pack trigger behavior and routed old-runtime retirement residue.` | `task.event-binding-runtime-convergence.trigger-context-adapter-cutover` | `Old-runtime retirement is now next-auto-routable; old paths are not deleted in this queue.` |

### Task Definitions

#### `task.event-binding-runtime-convergence.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.event-binding-runtime-convergence.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/domain/event.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/events/trigger-evaluator.ts`
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `EventBinding and TriggerContext contracts`
  - `active content eventBindings indexing`
  - `old event trigger evaluator and story/runtime call sites`
  - `event activation and eventHistory write path`
- must_not_change:
  - `feature code before evidence_lock_status is locked`
  - `old trigger evaluator deletion`
  - `sub-runtime lifecycle ownership`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Must inspect, must modify, must preserve, and minimum verification are recorded.`
  - `First implementation task has a concrete TDD target.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "selectTriggeredEvents|TriggerContext|eventBindings|activateEvent|eventHistory" src tests/robustness.test.cjs`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.event-binding-runtime-convergence.runtime-selector-baseline`
- stop_if:
  - `EventBindingRuntime would need to own a sub-runtime lifecycle or private state machine.`

##### Human Context

- task_brief:
  - `Lock EventBindingRuntime source evidence before implementation.`
- task_outcome_summary:
  - `Done. Evidence confirms active content exposes eventBindings/eventBindingsById; old selectTriggeredEvents and runEventRuntime still consume events[].trigger/conditions; startEvent remains the eventHistory write path; activateEvent remains the candidate handoff seam.`
- Purpose:
  - `Prevent the runtime cutover from widening into old-runtime deletion or sub-runtime ownership changes.`
- Failure mode:
  - `Implementing a new central runtime that absorbs scene/task/house/navigation/playable/location-access behavior.`

##### Progress Log

- `2026-07-16`: `Queue admitted after zhuyuanzhang event binding pack migration closed and active content exposed eventBindings.`
- `2026-07-16`: `Initial evidence found selectTriggeredEvents and runEventRuntime still read events[].trigger/conditions, while EventBinding and TriggerContext contracts already exist in src/domain/event.ts.`
- `2026-07-16`: `Locked implementation slice: add EventBindingRuntime selector/activation baseline against EventBinding rows, reuse startEvent for eventHistory writes, preserve activateEvent candidate handoff, and leave old trigger evaluator deletion to the retirement queue.`

#### `task.event-binding-runtime-convergence.runtime-selector-baseline`

##### Control Block

- task_id: `task.event-binding-runtime-convergence.runtime-selector-baseline`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/event.ts`
  - `src/application/events`
  - `src/core/runtime/event-runtime.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Evidence lock from task.event-binding-runtime-convergence.evidence-anchor-reconcile.`
- must_modify:
  - `tests/robustness.test.cjs`
  - `src/application/events`
  - `src/core/runtime/event-runtime.ts`
- must_replace:
  - `Old trigger-body selector for covered double-table event binding inputs.`
- must_preserve:
  - `Event activation and eventHistory write path.`
  - `Old trigger evaluator availability until old-runtime retirement.`
- must_not_change:
  - `Old runtime deletion`
  - `Sub-runtime lifecycle ownership`
- done_when:
  - `EventBindingRuntime can select enabled matching bindings by owner/timing/action, evaluate supported conditions, honor occurrence/eventHistory, sort by priority then stable id, and activate the selected event.`
- verify_with:
  - `node --test --test-name-pattern "event binding runtime" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in this queue doc.`
- promote_next_if_done: `task.event-binding-runtime-convergence.trigger-context-adapter-cutover`
- stop_if:
  - `Condition evaluation requires a resolver contract not yet represented by EventBinding.`

##### Human Context

- task_brief:
  - `Build the EventBindingRuntime selector baseline test-first.`
- task_outcome_summary:
  - `Done. Added EventBindingRuntime baseline with TriggerContext owner/timing/action matching, enabled filtering, basic flag/variable/event-history condition evaluation, occurrence checks, priority/stable-id selection, activation handoff, and startEvent-backed eventHistory writes.`
- Purpose:
  - `Create the new double-table runtime selector before cutting call sites over.`
- Failure mode:
  - `Mutating old events.json trigger fields or deleting compatibility paths before replacement verification.`

##### Progress Log

- `2026-07-16`: `RED verification passed: event binding runtime selects matching binding and starts the triggerless event failed because core/runtime/event-binding-runtime.js did not exist.`
- `2026-07-16`: `Added src/core/runtime/event-binding-runtime.ts with runEventBindingRuntime, selector candidate output, EventBinding condition evaluation, occurrence filtering, activateEvent handoff, and startEvent eventHistory writes.`
- `2026-07-16`: `GREEN verification passed for node --test --test-name-pattern "event binding runtime" tests/robustness.test.cjs; npm run typecheck and npm run lint:blueprints also passed.`

#### `task.event-binding-runtime-convergence.trigger-context-adapter-cutover`

##### Control Block

- task_id: `task.event-binding-runtime-convergence.trigger-context-adapter-cutover`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/application/house/house-runtime.ts`
  - `src/core/runtime/house-runtime.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Runtime selector baseline outcome.`
- must_modify:
  - `tests/robustness.test.cjs`
  - `src/application/story/story-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
- must_replace:
  - `Covered story trigger calls with TriggerContext-backed EventBindingRuntime selection.`
- must_preserve:
  - `House, navigation, playable, scene, task, and location-access runtime ownership.`
- must_not_change:
  - `old-runtime retirement`
- done_when:
  - `Covered city-enter and indoor-screen-shown story trigger paths use eventBindings through TriggerContext while preserving activation handoff.`
- verify_with:
  - `node --test --test-name-pattern "event binding runtime|city-enter story handoff|indoor-screen-shown story handoff" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in queue and version truth.`
- promote_next_if_done: `task.event-binding-runtime-convergence.queue-closeout-and-handoff`
- stop_if:
  - `A touched sub-runtime would need private lifecycle/state ownership moved into EventBindingRuntime.`

##### Human Context

- task_brief:
  - `Cut covered trigger call sites to TriggerContext-backed EventBindingRuntime.`
- task_outcome_summary:
  - `Done. triggerStoryEvents now uses EventBindingRuntime when story content exposes eventBindingsById, builds TriggerContext for city/building/story trigger timings, and preserves old selectTriggeredEvents fallback when no binding table is present.`
- Purpose:
  - `Prove built-in double-table content can trigger through the new selector without deleting old compatibility paths.`
- Failure mode:
  - `Treating EventBindingRuntime as the owner of house, navigation, playable, scene, or task settlement.`

##### Progress Log

- `2026-07-16`: `RED verification passed: event binding runtime routes story triggers through TriggerContext bindings failed because triggerStoryEvents ignored eventBindingsById and returned no active event for a triggerless event body.`
- `2026-07-16`: `Updated story-runtime to build TriggerContext for city-enter, house-enter, indoor-screen-shown, and story fallback timings, route binding-backed content through runEventBindingRuntime, and preserve old selectTriggeredEvents fallback for content without bindings.`
- `2026-07-16`: `GREEN verification passed for node --test --test-name-pattern "event binding runtime|city-enter story handoff|indoor-screen-shown story handoff" tests/robustness.test.cjs; npm run typecheck, npm run lint:blueprints, and full npm test also passed.`

#### `task.event-binding-runtime-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.event-binding-runtime-convergence.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/event-binding-runtime-convergence-queue.md`
  - `docs/blueprints/project-progress.md`
  - `src`
  - `tests`
- must_inspect:
  - `implementation task outcomes`
  - `built-in and exported pack trigger verification`
  - `old trigger scanning production dependency status`
- must_modify:
  - `docs/blueprints/queues/event-binding-runtime-convergence-queue.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_replace:
  - `active queue truth with closeout or next-task truth after implementation verification`
- must_preserve:
  - `version remains open until explicit version closeout`
- must_not_change:
  - `version_status to done`
  - `old runtime retirement before replacement verification`
- done_when:
  - `EventBindingRuntime verification is recorded.`
  - `Sub-runtime boundary ownership is recorded.`
  - `Old-runtime retirement residue is classified and routed.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in queue and version truth.`
- promote_next_if_done: `none`
- stop_if:
  - `Verification fails or multiple mutually exclusive lawful continuations remain.`

##### Human Context

- task_brief:
  - `Close or route the queue after EventBindingRuntime verification.`
- task_outcome_summary:
  - `Done. EventBindingRuntime replacement behavior is verified for selector baseline and story TriggerContext adapter cutover; old trigger scanning remains explicit same-family residue for queue.old-event-runtime-retirement.`
- Purpose:
  - `Route old-runtime retirement only after replacement behavior is verified.`
- Failure mode:
  - `Deleting old trigger scanning before built-in/exported pack replacement behavior is proven.`

##### Progress Log

- `2026-07-16`: `Queue closeout recorded after focused EventBindingRuntime/story handoff tests, npm run typecheck, npm run lint:blueprints, and full npm test passed.`
- `2026-07-16`: `Sub-runtime boundary record: story runtime emits TriggerContext and receives EventBindingRuntime state/activation output; scene advancement and eventHistory writes remain owned by existing syncStoryScene/startEvent paths; house/navigation/playable/location-access lifecycle ownership was not moved.`
- `2026-07-16`: `Residue classification: old selectTriggeredEvents, old EventDefinition.trigger/conditions scanning, and compatibility guards remain same-family retirement work.`
