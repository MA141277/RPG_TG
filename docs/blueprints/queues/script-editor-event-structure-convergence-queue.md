# Script Editor Event Structure Convergence Queue

## Control Block

- queue_id: `queue.script-editor-event-structure-convergence`
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
- closure_basis: `Boundary baseline proved the first honest event structure implementation depends on freezing the editor condition authoring contract before expanding event condition lowering or non-dialogue destinations.`
- residue_remaining: `yes`
- residue_family: `cross-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `failed`
- sync_scope: `branch-push`
- sync_summary: `Local activation commit 6620ca2 was created, but three push attempts to origin/mod-first-dev failed on GitHub connectivity. This sync failure is repository-local only and does not block queue execution.`
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
  - `Converge script-editor event records into runtime-consumable event structures with explicit triggers, related references, conditions, effects, and activation handoff boundaries.`
- Forbidden expansions:
  - `Do not reopen the closed event effect activation queue except as historical evidence.`
  - `Do not implement condition authoring or condition runtime evaluation inside this queue if baseline proves they must be admitted first.`
  - `Do not migrate dialogue/story runtime handoff or scene choice effects in one unbounded batch.`
  - `Do not add compatibility-only event lowering that hides unsupported event structures behind runtime fallbacks.`
  - `Do not introduce broad task-chain or branching progression mechanics unless a later queue admits that surface.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-event-effect-activation-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Define the smallest lawful event structure convergence slice and prove whether condition authoring/runtime evaluation or dialogue/story structure must precede event activation migration.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Queue closed at baseline after routing prerequisite condition authoring contract freeze back to version review.`
- task_briefs:
  - `task.script-editor-event-structure-convergence.boundary-baseline-reconcile: inventory current event records, export blockers, runtime event contracts, and prerequisite queues.`
  - `task.script-editor-event-structure-convergence.event-structure-contract-implementation: implement the selected bounded event structure slice if baseline proves it is lawful.`
  - `task.script-editor-event-structure-convergence.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-event-effect-activation-convergence closed the bounded task/shared-rule character property mutation effect slice with verification.`
- `That queue routed scene/choice legacy effect application and broader event effect activation here as cross-family residue for version promotion review.`
- `The target spec classifies queue.script-editor-event-structure-convergence as required for event triggers, related references, conditions, effects, and activation shape.`
- `Baseline must prove whether queue.script-editor-condition-authoring-contract-freeze, queue.script-editor-condition-runtime-evaluation-convergence, or queue.script-editor-dialogue-story-structure-convergence must precede implementation.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-structure-convergence.boundary-baseline-reconcile` | `done` | `Inventoried current event authoring/export/runtime structures and decided the first event structure implementation needs a prerequisite condition authoring contract freeze.` | `none` | `Stopped before production code because condition authoring/runtime shape is the lawful prerequisite.` |
| `task.script-editor-event-structure-convergence.event-structure-contract-implementation` | `queued` | `Implement the bounded event structure convergence slice selected by baseline reconciliation.` | `task.script-editor-event-structure-convergence.boundary-baseline-reconcile` | `Not started; routed to prerequisite queue first.` |
| `task.script-editor-event-structure-convergence.queue-closeout-and-handoff` | `done` | `Verified baseline, classified residue, and returned control to version review.` | `task.script-editor-event-structure-convergence.boundary-baseline-reconcile` | `Closed with cross-family prerequisite residue routed to condition authoring contract freeze review.`

### Task Definitions

#### `task.script-editor-event-structure-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-event-structure-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/event.ts`
  - `src/domain/action.ts`
  - `src/application/events`
  - `src/application/scene`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-structure-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-event-effect-activation-convergence-queue.md`
  - `src/domain/event.ts`
  - `src/domain/action.ts`
  - `src/application/events/event-runner.ts`
  - `src/application/scene/scene-runner.ts`
  - `src/application/scene/choice-resolver.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/shared-rule-compiler.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `condition authoring contract`
  - `condition runtime evaluation`
  - `dialogue/story runtime handoff`
  - `branching task-chain mechanics`
- done_when:
  - `Current event authoring records, export lowering, runtime event definitions, and scene handoff paths are inventoried.`
  - `The exact prerequisite relationship between event structure, typed conditions, shared effects, and dialogue/story structure is recorded.`
  - `The smallest lawful event structure slice is selected, or the queue is blocked/routed to prerequisite queues.`
  - `A test-first implementation plan names exact files, event shape, validation rules, runtime handoff, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "EventDefinition|EventTrigger|startEvent|runStoryTriggerRuntime|eventDefinitionsById|project.events|supports only editor events|destination|conditionGroups|effectBundles|ActionNode" src/domain src/application src/core tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if condition authoring/runtime evaluation or dialogue/story structure must precede event structure implementation.`
- promote_next_if_done: `task.script-editor-event-structure-convergence.event-structure-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the first event structure slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest event structure boundary before changing runtime export or event activation.`
- task_outcome_summary:
  - `Done. Runtime already has EventDefinition, trigger evaluation, candidate selection, condition evaluation, activation, and scene handoff seams. Runtime-pack export already has a minimal editor-event lowering path, but it supports only dialogue destinations, manual/city-enter/building-enter triggers, and empty conditionGroups. Script-editor event conditionGroups remain stringly typed authoring records, while shared condition groups are task-oriented and do not yet define an event-facing condition authoring contract. Non-dialogue destinations depend on dialogue/story, city/building, or playable handoff queues.`
- Purpose:
  - `Avoid exporting event records that appear supported while runtime still depends on private dialogue/scene lowering or unsupported condition/effect shapes.`
- Failure mode:
  - `Adding event data without runtime activation ownership would leave editor-authored events as inert or compatibility-only records.`

##### Progress Log

- `2026-07-15`: `Queue admitted from cross-family residue after queue.script-editor-event-effect-activation-convergence closed the task/shared-rule mutation effect slice and routed broader event/scene effect convergence to version review.`
- `2026-07-15`: `Baseline inspected src/domain/event.ts, src/domain/action.ts, src/domain/script-editor-project.ts, src/application/events/event-runner.ts, src/application/events/trigger-evaluator.ts, src/core/runtime/event-runtime.ts, src/core/runtime/event-condition-evaluator.ts, src/core/runtime/event-activation.ts, src/core/runtime/scene-runtime.ts, src/application/scene/scene-runner.ts, src/application/scene/choice-resolver.ts, src/application/script-editor/runtime-pack-export.ts, src/application/script-editor/shared-rule-compiler.ts, and tests/robustness.test.cjs.`
- `2026-07-15`: `Current inventory: EventDefinition already carries trigger, conditions, participants, entrySceneId, nextEventId, and tags; runStoryTriggerRuntime can select and start triggered events; runtime-pack export lowers minimal editor events only when destination targets a lowered dialogue scene and conditionGroups are empty.`
- `2026-07-15`: `Stop decision: event structure implementation should not widen by inventing condition authoring rules in this queue. The next lawful prerequisite is queue.script-editor-condition-authoring-contract-freeze so event conditions can be typed before event structure migration expands beyond the existing empty-condition dialogue-destination slice.`

#### `task.script-editor-event-structure-convergence.event-structure-contract-implementation`

##### Control Block

- task_id: `task.script-editor-event-structure-convergence.event-structure-contract-implementation`
- state: `queued`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `unbounded event/story/task-chain rewrite`
  - `condition authoring/runtime implementation unless baseline explicitly keeps it inside the selected slice`
  - `compatibility-only event lowering`
- done_when:
  - `The selected event structure slice exports or loads through runtime-consumable event definitions.`
  - `Invalid or unsupported event shapes fail closed with diagnostics.`
  - `Tests prove the covered path reaches runtime event/scene handoff without mutating unrelated structures.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not implement compatibility-only lowering.`
- promote_next_if_done: `task.script-editor-event-structure-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires a prerequisite queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the event structure slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Not started. Baseline routed to prerequisite condition authoring contract freeze before event structure implementation.`
- Purpose:
  - `Make covered editor-authored event structures runtime-consumable without private export-only shadows.`
- Failure mode:
  - `Event records that export but cannot activate at runtime would not satisfy current-version acceptance.`

##### Progress Log

- `2026-07-15`: `Queued behind boundary-baseline-reconcile.`

#### `task.script-editor-event-structure-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-structure-convergence.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-structure-convergence-queue.md`
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
  - `Event structure acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the event structure convergence queue after verified implementation.`
- task_outcome_summary:
  - `Done. Baseline verification and residue classification completed; queue returned control to version review with cross-family prerequisite residue.`
- Purpose:
  - `Keep event structure ownership explicit before condition runtime, dialogue/story handoff, branching event, or final validation queues continue.`
- Failure mode:
  - `Closing without runtime event evidence would leave editor-authored event records as inert data.`

##### Progress Log

- `2026-07-15`: `Queued behind event-structure-contract-implementation.`
- `2026-07-15`: `Closed after baseline without production changes because condition authoring contract freeze is the lawful prerequisite for expanding event condition lowering.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-event-structure-convergence.boundary-baseline-reconcile`
- Recorded handoff at activation:
  - `Queue is active and must start by reconciling event authoring/export/runtime ownership before code changes.`
- Recorded expected output:
  - `A bounded event structure implementation path or an explicit prerequisite routing decision.`
