# Script Editor Event Binding Export Convergence Queue

## Control Block

- queue_id: `queue.script-editor-event-binding-export-convergence`
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
- closure_basis: `The bounded runtime-pack export convergence slice landed and passed focused export, typecheck, Blueprint lint, and full npm test verification. Built-in zhuyuanzhang pack migration remains the unique same-family continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.zhuyuanzhang-event-binding-pack-migration`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `branch-commit`
- sync_summary: `Implementation and closeout truth recorded in a local branch commit after focused tests, full npm test, typecheck, and Blueprint lint passed; push not attempted.`
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
  - `Export script-editor runtime packs with events.json as event bodies and event-bindings.json as trigger entries, while failing closed on unsupported binding fields or condition lowering.`
- Forbidden expansions:
  - `Do not migrate the built-in zhuyuanzhang pack in this queue.`
  - `Do not introduce EventBindingRuntime or route runtime trigger call sites through TriggerContext in this queue.`
  - `Do not delete EventDefinition.trigger, EventDefinition.conditions, selectTriggeredEvents, or old trigger evaluator paths in this queue.`
  - `Do not invent resolver semantics beyond export validation/lowering required for supported binding fields.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-BINDING-EXPORT-001`
- acceptance_not_claimed:
  - `ACC-ZHUYUANZHANG-MIGRATION-001`
  - `ACC-EVENT-BINDING-RUNTIME-001`
  - `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001`
- minimum_verification:
  - `node --test --test-name-pattern "script editor runtime export writes event bindings as a separate file|script editor runtime export fails closed on unsupported event binding fields" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-BINDING-EXPORT-001: Runtime-pack export writes events.json without trigger/conditions and event-bindings.json with owner/trigger/conditions/priority/enabled for supported script-editor eventBindings.`

#### Cannot Claim

- `ACC-ZHUYUANZHANG-MIGRATION-001: Built-in zhuyuanzhang pack is migrated to event-bindings.json.`
- `ACC-EVENT-BINDING-RUNTIME-001: EventBindingRuntime selects, evaluates, activates, and hands off events through TriggerContext.`
- `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001: Old EventDefinition.trigger/conditions scanning paths are deleted.`

#### Legacy Paths To Replace

- `src/application/script-editor/runtime-pack-export.ts RuntimePackManifestFiles and RUNTIME_PACK_CANONICAL_FILES do not include eventBindings.`
- `extractRuntimeEvents currently lowers script-editor event triggerTiming and conditionGroups into EventDefinition.trigger and EventDefinition.conditions in events.json.`
- `validateScriptEditorProjectForRuntimeExport currently validates scenario packs without eventBindings export content.`

#### Compatibility Paths To Preserve

- `Event bodies must still export entrySceneId, nextEventId, occurrence, taskInputs, and dialogue-derived scenes.`
- `Existing old runtime tests may remain as legacy runtime coverage until the runtime convergence and old-runtime retirement queues own the cutover.`
- `Built-in zhuyuanzhang pack migration remains a later queue.`

#### Implementation Anchors

- Must inspect:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
- Must modify:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-export-convergence-queue.md`
- Must preserve:
  - `Existing event body export fields not related to trigger selection.`
  - `Existing runtime-pack manifest canonical files.`
  - `Old runtime execution paths until later runtime convergence and retirement queues.`

#### Verification Coverage

- `Add failing export coverage that pack.json.files.eventBindings points to event-bindings.json, events.json omits trigger/conditions, and event-bindings.json preserves supported binding fields.`
- `Add failing validation coverage that unsupported binding owner/trigger/payload/conditions fail closed during runtime export.`
- `Run npm run typecheck and npm run lint:blueprints before task closeout.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`

### Queue Snapshot

- queue_goal: `Export event bodies and event bindings as separate runtime pack tables without changing runtime trigger dispatch.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue execution complete; next same-family queue is built-in zhuyuanzhang pack migration.`
- task_briefs:
  - `task.script-editor-event-binding-export-convergence.evidence-anchor-reconcile: Confirm source-backed export anchors and claim boundaries before implementation.`
  - `task.script-editor-event-binding-export-convergence.runtime-pack-export-baseline: Implement double-table runtime-pack export and fail-closed validation test-first.`
  - `task.script-editor-event-binding-export-convergence.queue-closeout-and-handoff: Verify, classify residue, and route the next lawful queue.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded export slice landed and verified.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-event-binding-authoring-ui is closed with eventBindings represented in script-editor project data and selected-event UI visibility.`
- `The version plan routed same-family residue to queue.script-editor-event-binding-export-convergence.`
- `Fresh code evidence confirms runtime-pack export still lacks eventBindings manifest/output and still writes trigger/conditions into events.json.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at queue closeout.`

### Activation Order

1. `Authoring UI/model queue closed and routed same-family residue.`
2. `Version-level admission review admitted queue.script-editor-event-binding-export-convergence.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-binding-export-convergence.evidence-anchor-reconcile` | `done` | `Inspected current runtime-pack export, scenario loader, contracts, tests, and design before selecting the implementation slice.` | `none` | `Completed on 2026-07-16 after source evidence confirmed this queue can own manifest/output split export without changing runtime dispatch.` |
| `task.script-editor-event-binding-export-convergence.runtime-pack-export-baseline` | `completed` | `Implemented double-table runtime-pack export and fail-closed binding validation with focused tests.` | `task.script-editor-event-binding-export-convergence.evidence-anchor-reconcile` | `Completed on 2026-07-16 without altering built-in pack migration, EventBindingRuntime dispatch, or old runtime deletion.` |
| `task.script-editor-event-binding-export-convergence.queue-closeout-and-handoff` | `completed` | `Verified the bounded export slice, classified residue, and routed the next lawful queue.` | `task.script-editor-event-binding-export-convergence.runtime-pack-export-baseline` | `Built-in zhuyuanzhang migration, EventBindingRuntime, and old trigger scanning remain unresolved.` |

### Task Definitions

#### `task.script-editor-event-binding-export-convergence.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-binding-export-convergence.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-binding-export-convergence-queue.md`
- must_inspect:
  - `version acceptance matrix`
  - `runtime-pack export manifest/output`
  - `event lowering trigger/conditions paths`
  - `scenario pack eventBindings loader contract`
- must_not_change:
  - `feature code before evidence_lock_status is locked`
  - `built-in zhuyuanzhang pack migration`
  - `EventBindingRuntime trigger selection`
  - `old runtime deletion`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Must inspect, must modify, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "eventBindings|event-bindings|triggerTiming|conditionGroups|conditions|trigger" src/application/script-editor/runtime-pack-export.ts tests/robustness.test.cjs docs/script-editor-event-trigger-binding-design.md`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-event-binding-export-convergence.runtime-pack-export-baseline`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock the export convergence queue evidence before implementation.`
- task_outcome_summary:
  - `Done. Baseline selected a narrow export slice: add runtime-pack manifest/output support for event-bindings.json, move supported event binding trigger data out of exported events.json, and fail closed on unsupported binding fields/conditions while preserving old runtime dispatch and built-in pack migration for later queues.`
- Purpose:
  - `Prevent export convergence from widening into built-in pack migration, EventBindingRuntime, or old runtime deletion.`
- Failure mode:
  - `Treating exported double-table pack shape as permission to change trigger dispatch before runtime convergence.`

##### Progress Log

- `2026-07-16`: `runtime-pack-export.ts RuntimePackManifestFiles and RUNTIME_PACK_CANONICAL_FILES do not include eventBindings, so exported pack.json cannot point to event-bindings.json.`
- `2026-07-16`: `exportScriptEditorProjectToScenarioPackFiles writes events.json but does not write event-bindings.json.`
- `2026-07-16`: `extractRuntimeEvents currently lowers eventRecord.triggerTiming and eventRecord.conditionGroups into EventDefinition.trigger and EventDefinition.conditions inside events.json.`
- `2026-07-16`: `Selected implementation slice: export project.eventBindings to event-bindings.json, strip trigger/conditions from exported event bodies, and add fail-closed validation for unsupported binding fields/condition semantics without changing runtime dispatch.`

#### `task.script-editor-event-binding-export-convergence.runtime-pack-export-baseline`

##### Control Block

- task_id: `task.script-editor-event-binding-export-convergence.runtime-pack-export-baseline`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-export-convergence-queue.md`
- must_inspect:
  - `Evidence lock from task.script-editor-event-binding-export-convergence.evidence-anchor-reconcile.`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_modify:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-export-convergence-queue.md`
- must_replace:
  - `Runtime-pack export must write event binding trigger entries to event-bindings.json instead of trigger/conditions fields in events.json.`
- must_preserve:
  - `Event body export for scenes, entrySceneId, nextEventId, taskInputs, occurrence, and narrative materialization.`
  - `Old runtime dispatch paths until later queues.`
- must_not_change:
  - `built-in zhuyuanzhang pack migration`
  - `EventBindingRuntime trigger dispatch`
  - `old selectTriggeredEvents deletion`
- done_when:
  - `Runtime pack manifest includes files.eventBindings.`
  - `Runtime pack export writes event-bindings.json for supported project.eventBindings.`
  - `Runtime events.json omits trigger and conditions fields for exported script-editor events.`
  - `Unsupported binding fields or conditions fail closed during export validation.`
- verify_with:
  - `node --test --test-name-pattern "script editor runtime export writes event bindings as a separate file|script editor runtime export fails closed on unsupported event binding fields" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record execution blockers in this queue doc rather than widening into runtime migration.`
- promote_next_if_done: `task.script-editor-event-binding-export-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Export cannot produce eventBindings without a contract backfill outside this queue's scope.`

##### Human Context

- task_brief:
  - `Implement double-table runtime-pack export and fail-closed validation.`
- task_outcome_summary:
  - `Done. Runtime-pack export now emits pack.json.files.eventBindings and event-bindings.json, exports script-editor event bodies without trigger/conditions, preserves event body scene/nextEventId/taskInputs data, and fails closed on unsupported event binding owner/trigger/conditions/payload semantics. EventDefinition.trigger/conditions are optional for the transition, and old trigger selector skips triggerless event bodies.`
- Purpose:
  - `Produce runnable double-table pack files for later built-in migration and EventBindingRuntime queues.`
- Failure mode:
  - `Leaving trigger data in events.json or silently accepting unsupported binding semantics.`

##### Progress Log

- `2026-07-16`: `Added failing export tests for event-bindings.json manifest/output and fail-closed unsupported event binding fields. RED failed on missing event-bindings.json and missing unsupported binding validation.`
- `2026-07-16`: `Implemented runtime-pack eventBindings manifest/file output, EventDefinition trigger/conditions optional event-body contract, export lowering for supported eventBindings, and unsupported owner/trigger/conditions/payload fail-closed diagnostics.`
- `2026-07-16`: `Updated legacy export tests to assert the new queue boundary: events.json is triggerless, event body fields remain available, old selectTriggeredEvents ignores triggerless exports, and event-bindings.json carries trigger entries for later EventBindingRuntime.`
- `2026-07-16`: `Focused export verification, npm run typecheck, npm run lint:blueprints, and full npm test passed.`

#### `task.script-editor-event-binding-export-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-binding-export-convergence.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-binding-export-convergence-queue.md`
  - `docs/blueprints/project-progress.md`
  - `src`
  - `tests`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `built-in zhuyuanzhang pack migration status`
  - `EventBindingRuntime implementation status`
  - `old trigger scanning production dependency status`
- must_modify:
  - `docs/blueprints/queues/script-editor-event-binding-export-convergence-queue.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_replace:
  - `active queue truth with closeout or next-task truth after implementation verification`
- must_preserve:
  - `version remains open until explicit version closeout`
  - `next queue admission remains version-plan-owned`
- must_not_change:
  - `version_status to done`
  - `old runtime retirement before runtime verification`
- done_when:
  - `Bounded export slice verification is recorded.`
  - `Residue is classified and next lawful continuation is routed.`
  - `Repository sync record is updated according to Blueprint policy.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in queue and version truth.`
- promote_next_if_done: `none`
- stop_if:
  - `Verification fails.`
  - `Multiple mutually exclusive lawful continuations remain.`

##### Human Context

- task_brief:
  - `Close or route the queue after implementation verification.`
- task_outcome_summary:
  - `Done. Queue closed as open-residue with queue.zhuyuanzhang-event-binding-pack-migration as the unique same-family continuation. Built-in zhuyuanzhang pack still uses old event trigger data, EventBindingRuntime is not implemented, and old selectTriggeredEvents paths remain production dependencies for legacy packs.`
- Purpose:
  - `Return control to version review without confusing export support with runtime cutover.`
- Failure mode:
  - `Treating double-table export as proof that built-in packs and runtime trigger dispatch are already replaced.`

##### Progress Log

- `2026-07-16`: `Closeout classified remaining work as same-family residue: built-in zhuyuanzhang pack still needs event-bindings.json migration before runtime cutover.`
- `2026-07-16`: `EventBindingRuntime convergence and old runtime retirement remain later queues because this queue only changed exported pack shape and validation, not runtime trigger dispatch.`
