# Event Binding Condition Export Lowering Queue

## Control Block

- queue_id: `queue.event-binding-condition-export-lowering`
- belongs_to_version: `target.script-editor-event-binding-runtime-replacement`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-17`
- governance_sync_source: `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Queue closed after basic flag/variable EventBinding.conditions export lowering landed and was verified. Runtime-pack export now converts authoring shape to runtime shape in event-bindings.json, events.json does not regain EventDefinition.conditions, and unsupported advanced/resolver/custom conditions still fail closed.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `multiple-closeout-blockers-recorded`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout truth recorded locally; no repository push attempted.`
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
  - `Lower UI-saved basic flag/variable EventBinding.conditions into runnable event-bindings.json while keeping unsupported resolver/custom/advanced conditions fail-closed.`
- Admission basis:
  - `queue.script-editor-event-binding-authoring-ui-completion completed basic EventBinding.conditions UI for conditions.operator and flag/variable condition items.`
  - `src/application/script-editor/runtime-pack-export.ts still rejects any binding.conditions in lowerRuntimeEventBinding with an unsupported-lowering diagnostic.`
  - `src/core/runtime/event-binding-runtime.ts already evaluates runtime EventBinding.conditions for flag and variable nodes shaped with key/operator/value or key/expected.`
  - `The next dependency before version closeout is making the completed basic conditions UI produce runnable event-bindings.json for the supported subset.`
- Required scope:
  - `Lower basic UI flag condition items into runtime EventBinding.conditions flag nodes.`
  - `Lower basic UI variable condition items into runtime EventBinding.conditions variable nodes.`
  - `Lower conditions.operator all/any/not into runtime EventBinding.conditions.operator.`
  - `Keep unsupported resolver/custom/expression/binding-context/unknown condition forms fail-closed with explicit diagnostics.`
  - `Preserve event-bindings.json split from events.json; do not write conditions to EventDefinition.conditions.`
- Explicit residue:
  - `queue.script-editor-event-binding-condition-editor-completion owns cascading condition editor, field registry integration, resolver-backed dropdowns, expression/custom/binding-context authoring, and broader condition type coverage.`
  - `queue.event-binding-trigger-context-entrypoint-completion owns auditing/completing time/dialogue/menu/minigame/custom TriggerContext adapters or explicit fail-closed routing.`
- Forbidden expansions:
  - `Do not implement advanced condition editor UI.`
  - `Do not add resolver registry, resolver-backed dropdowns, or custom/expression condition authoring.`
  - `Do not change EventBindingRuntime trigger selection or sub-runtime lifecycle ownership.`
  - `Do not enter version closeout.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-BINDING-CONDITION-EXPORT-LOWERING-001`
- acceptance_not_claimed:
  - `ACC-EVENT-BINDING-ADVANCED-CONDITION-EDITOR-001`
  - `ACC-EVENT-BINDING-TRIGGER-CONTEXT-ENTRYPOINT-001`
- minimum_verification:
  - `node --test --test-name-pattern "event binding condition export lowering|event binding runtime" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-BINDING-CONDITION-EXPORT-LOWERING-001: Script-editor runtime export lowers supported basic flag/variable EventBinding.conditions into runnable event-bindings.json and keeps unsupported condition forms fail-closed.`

#### Cannot Claim

- `Full cascading condition editor completion.`
- `Condition field registry integration.`
- `Resolver-backed dropdowns or resolver registry authoring.`
- `Expression, custom, or binding-context condition authoring/lowering.`
- `TriggerContext adapter completion for time/dialogue/menu/minigame/custom entrypoints.`
- `EventBindingRuntime behavior changes.`
- `Version closeout.`

#### Implementation Anchors

- Must inspect:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/domain/event.ts`
  - `src/core/runtime/event-binding-runtime.ts`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
- Must preserve:
  - `Runtime export fail-closed behavior for unsupported event binding fields and unsupported advanced condition forms.`
  - `EventBinding.conditions as the only persistence/export location for binding conditions.`
  - `Triggerless events.json and separate event-bindings.json runtime-pack export.`
  - `EventBindingRuntime and old-runtime retirement outcomes.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`

### Queue Snapshot

- queue_goal: `Lower basic flag/variable EventBinding.conditions from the script editor into runnable event-bindings.json without widening into advanced condition authoring or runtime semantics.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue execution complete; parent version remains open with condition-editor and TriggerContext entrypoint blockers still unadmitted.`
- task_briefs:
  - `task.event-binding-condition-export-lowering.evidence-anchor-reconcile: Confirm export-lowering anchors and candidate ordering.`
  - `task.event-binding-condition-export-lowering.implementation: Implement supported flag/variable condition lowering test-first.`
  - `task.event-binding-condition-export-lowering.queue-closeout-and-handoff: Verify lowering and return to version review without entering closeout.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.event-binding-condition-export-lowering.evidence-anchor-reconcile` | `done` | `Confirmed condition export lowering is the first dependency after basic conditions UI completion.` | `none` | `Completed on 2026-07-17; no implementation code was changed.` |
| `task.event-binding-condition-export-lowering.implementation` | `done` | `Implemented supported flag/variable condition lowering test-first while preserving fail-closed unsupported advanced conditions.` | `task.event-binding-condition-export-lowering.evidence-anchor-reconcile` | `Completed on 2026-07-17; advanced condition editor and TriggerContext entrypoint work were not started.` |
| `task.event-binding-condition-export-lowering.queue-closeout-and-handoff` | `done` | `Verified export lowering and returned to version review without entering version closeout.` | `task.event-binding-condition-export-lowering.implementation` | `Completed on 2026-07-17; version remains open and no follow-up queue was admitted.` |

### Task Definitions

#### `task.event-binding-condition-export-lowering.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.event-binding-condition-export-lowering.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/event-binding-condition-export-lowering-queue.md`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/core/runtime/event-binding-runtime.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `current runtime export fail-closed condition branch`
  - `basic EventBinding.conditions UI completion output shape`
  - `runtime EventBinding condition evaluator supported shape`
  - `other closeout blocker ordering`
- must_not_change:
  - `feature code before implementation task starts`
  - `advanced condition editor scope`
  - `TriggerContext adapter scope`
- done_when:
  - `Evidence Lock is locked.`
  - `Queue priority over condition-editor-completion and trigger-context-entrypoint-completion is recorded.`
  - `Implementation task has a focused TDD guard target.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review and record the blocker.`
- promote_next_if_done: `task.event-binding-condition-export-lowering.implementation`
- stop_if:
  - `Evidence shows export lowering requires advanced condition editor or TriggerContext adapter work first.`

##### Human Context

- task_brief:
  - `Confirm export-lowering anchors and candidate ordering.`
- task_outcome_summary:
  - `Done. Evidence confirms export lowering is the unique next queue because basic conditions UI already exists, runtime export still rejects conditions, and runtime already supports basic flag/variable condition evaluation.`
- Purpose:
  - `Ensure implementation starts from the narrow supported condition-lowering gap rather than from advanced editor or TriggerContext entrypoint work.`
- Failure mode:
  - `Widening export lowering into advanced condition authoring or sub-runtime TriggerContext lifecycle changes.`

##### Evidence Findings

- `queue.script-editor-event-binding-authoring-ui-completion closed after basic conditions UI and import projection landed.`
- `src/application/script-editor/runtime-pack-export.ts lowerRuntimeEventBinding currently rejects binding.conditions with unsupported-lowering instead of writing them to event-bindings.json.`
- `tests/robustness.test.cjs contains a fail-closed guard for event binding conditions before resolver lowering.`
- `src/core/runtime/event-binding-runtime.ts already evaluates runtime binding conditions for flag and variable nodes.`
- `queue.script-editor-event-binding-condition-editor-completion depends on this queue only for runnable export of the existing basic subset; it owns broader authoring capability, not the immediate export gap.`
- `queue.event-binding-trigger-context-entrypoint-completion depends on runnable binding rows and owns entrypoint coverage; it does not need to precede basic condition export lowering.`

#### `task.event-binding-condition-export-lowering.implementation`

##### Control Block

- task_id: `task.event-binding-condition-export-lowering.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/event-binding-condition-export-lowering-queue.md`
- must_inspect:
  - `lowerRuntimeEventBinding`
  - `isRuntimeEventBinding`
  - `EventBindingRuntime condition evaluator`
- must_modify:
  - `tests/robustness.test.cjs`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `docs/blueprints/queues/event-binding-condition-export-lowering-queue.md`
- must_replace:
  - `Fail-closed behavior for supported basic flag/variable EventBinding.conditions only.`
- must_preserve:
  - `Fail-closed behavior for unsupported resolver/custom/expression/binding-context/unknown condition forms.`
  - `EventDefinition remains triggerless and conditionless in exported events.json.`
  - `EventBindingRuntime behavior.`
- must_not_change:
  - `Advanced condition editor UI.`
  - `Resolver registry or resolver dropdowns.`
  - `TriggerContext adapter coverage.`
- done_when:
  - `Basic flag conditions lower to runtime flag conditions in event-bindings.json.`
  - `Basic variable conditions lower to runtime variable conditions in event-bindings.json.`
  - `conditions.operator all/any/not is preserved.`
  - `Unsupported advanced condition forms still fail closed with diagnostics.`
  - `Exported events.json does not regain EventDefinition.conditions.`
- verify_with:
  - `node --test --test-name-pattern "event binding condition export lowering|event binding runtime" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in queue and version truth.`
- promote_next_if_done: `task.event-binding-condition-export-lowering.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires resolver registry, advanced condition editor, or TriggerContext adapter changes.`

##### Human Context

- task_brief:
  - `Implement supported flag/variable condition lowering test-first.`
- task_outcome_summary:
  - `Done. Runtime-pack export now lowers UI-saved basic flag/variable EventBinding.conditions from authoring shape into runtime event-bindings.json shape without writing EventDefinition.conditions or changing EventBindingRuntime semantics.`
- Purpose:
  - `Make the completed basic conditions UI produce runnable runtime-pack binding rows.`
- Failure mode:
  - `Silently accepting unsupported advanced condition forms or changing runtime semantics.`

#### `task.event-binding-condition-export-lowering.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.event-binding-condition-export-lowering.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/event-binding-condition-export-lowering-queue.md`
  - `docs/blueprints/project-progress.md`
  - `src`
  - `tests`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `remaining closeout blockers`
- must_modify:
  - `docs/blueprints/queues/event-binding-condition-export-lowering-queue.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/project-progress.md`
- done_when:
  - `Export lowering verification is recorded.`
  - `Remaining condition-editor and TriggerContext entrypoint blockers are routed without entering version closeout.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in queue and version truth.`
- promote_next_if_done: `none`
- stop_if:
  - `Version closeout would start without explicit operator confirmation.`

##### Human Context

- task_brief:
  - `Verify export lowering and return to version review without entering version closeout.`
- task_outcome_summary:
  - `Done. Queue closeout recorded implementation and verification results, returned the parent version to open review, and preserved the remaining unadmitted condition-editor and TriggerContext entrypoint blockers.`
- Purpose:
  - `Synchronize the export-lowering queue back to version review while preserving remaining closeout blockers.`
- Failure mode:
  - `Auto-entering version closeout or admitting another queue during closeout.`

### Progress Log

- `2026-07-17`: `Admitted this queue after promotion review of three unadmitted closeout blockers. Evidence-anchor reconcile completed only; no implementation code was changed. Ordering selected condition export lowering before condition-editor-completion and TriggerContext entrypoint completion because basic conditions UI already exists, runtime export still fail-closes on binding.conditions, and runtime condition evaluation already supports the flag/variable subset.`
- `2026-07-17`: `Implementation completed test-first. RED failed because runtime-pack export still rejected project.eventBindings[0].conditions with the later resolver-backed lowering diagnostic. GREEN lowers authoring-shape flag/variable conditions into runtime-shape EventBinding.conditions in event-bindings.json, keeps unsupported resolver/custom/advanced condition forms fail-closed, leaves events.json without EventDefinition.conditions, and does not change EventBindingRuntime semantics. Queue closeout has not started.`
- `2026-07-17`: `Closed this queue after queue-closeout-and-handoff. Recorded that basic flag/variable EventBinding.conditions export lowering is complete: runtime-pack export converts authoring shape { type, field, operator, value } to runtime shape { type: flag, key, expected } or { type: variable, key, operator, value } in event-bindings.json; events.json still does not write EventDefinition.conditions; unsupported advanced/resolver/custom conditions remain fail-closed with diagnostics. Remaining version blockers queue.script-editor-event-binding-condition-editor-completion and queue.event-binding-trigger-context-entrypoint-completion remain unadmitted, and version closeout was not entered.`
