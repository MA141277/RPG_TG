# Script Editor Event Binding Contract Loader Queue

## Control Block

- queue_id: `queue.script-editor-event-binding-contract-loader`
- belongs_to_version: `target.script-editor-event-binding-runtime-replacement`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded EventBinding contract/loader slice landed and passed focused loader, active-content, default-runtime-content, typecheck, and Blueprint lint verification. Script-editor UI/model support remains the unique same-family continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.script-editor-event-binding-authoring-ui`
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
  - `Introduce the double-table EventBinding contract baseline: EventBinding domain types, scenario-pack eventBindings manifest/file hydration, active-content storage, and registered extension-field boundaries.`
- Forbidden expansions:
  - `Do not build the script-editor eventBindings UI in this queue.`
  - `Do not export editor-authored event-bindings.json in this queue except for tests or fixtures needed to prove loader hydration.`
  - `Do not migrate the built-in zhuyuanzhang pack in this queue.`
  - `Do not introduce EventBindingRuntime, TriggerContext call sites, or old runtime deletion in this queue.`
  - `Do not preserve a permanent dual-track runtime for old events[].trigger/conditions.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-BINDING-CONTRACT-001`
  - `ACC-EVENT-BINDING-CONTRACT-002`
  - `ACC-EVENT-BINDING-CONTRACT-003`
- acceptance_not_claimed:
  - `ACC-EVENT-BINDING-UI-001`
  - `ACC-EVENT-BINDING-EXPORT-001`
  - `ACC-ZHUYUANZHANG-MIGRATION-001`
  - `ACC-EVENT-BINDING-RUNTIME-001`
  - `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001`
- minimum_verification:
  - `node --test --test-name-pattern "scenario pack loader hydrates event bindings" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-BINDING-CONTRACT-001: EventBinding, EventBindingOwner, EventBindingTrigger, EventBindingConditionGroup, TriggerContext, and registered extension field types exist in the domain/runtime contract surface.`
- `ACC-EVENT-BINDING-CONTRACT-002: Scenario-pack manifest files may name eventBindings and loader hydration stores event-bindings.json entries in active content.`
- `ACC-EVENT-BINDING-CONTRACT-003: Unsupported owner family, trigger timing/action, payload schema, and condition fields have a registered-boundary surface for later export/runtime fail-closed validation.`

#### Cannot Claim

- `ACC-EVENT-BINDING-UI-001: Script-editor UI displays separate event body and event binding tables.`
- `ACC-EVENT-BINDING-EXPORT-001: Runtime-pack export writes production event-bindings.json and strips trigger/conditions from events.json.`
- `ACC-ZHUYUANZHANG-MIGRATION-001: Built-in zhuyuanzhang pack is migrated to event-bindings.json.`
- `ACC-EVENT-BINDING-RUNTIME-001: EventBindingRuntime selects, evaluates, activates, and hands off events through TriggerContext.`
- `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001: Old EventDefinition.trigger/conditions scanning paths are deleted.`

#### Legacy Paths To Replace

- `src/domain/event.ts EventDefinition currently requires trigger and conditions as long-term runtime fields.`
- `src/application/scenario/scenario-pack-loader.ts isScenarioPackManifest currently requires files.events and has no eventBindings manifest hydration gate.`
- `src/application/script-editor/runtime-pack-export.ts currently lowers editor events into events.json with trigger and conditions.`
- `src/application/events/trigger-evaluator.ts selectTriggeredEvents currently scans events[].trigger/conditions.`

#### Compatibility Paths To Preserve

- `Existing scenario packs that only contain events.json must keep loading until the later retirement queue explicitly removes old compatibility.`
- `Existing story, scene, task, house, navigation, playable, and location-access sub-runtime ownership must remain untouched in this contract/loader queue.`
- `Existing script-editor event authoring and runtime export behavior may remain old-shape until the later UI/export queues own the double-table authoring cutover.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/domain/scenario-pack.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/events/trigger-evaluator.ts`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
- Must modify:
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-contract-loader-queue.md`
- Must preserve:
  - `events.json-only pack loading until later cutover queues record replacement verification.`
  - `Old selectTriggeredEvents runtime behavior until EventBindingRuntime convergence and old-runtime retirement queues own it.`
  - `Sub-runtime lifecycle ownership and runtime-result handoff seams.`

#### Verification Coverage

- `Add a failing loader test that proves pack.json.files.eventBindings points to event-bindings.json and the loader hydrates bindings into active content.`
- `Add or update type-level/runtime tests that prove old events.json-only packs still load in this queue.`
- `Run npm run typecheck and npm run lint:blueprints before task closeout.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`

### Queue Snapshot

- queue_goal: `Create the readable double-table contract and loader baseline for event-bindings.json without taking over editor UI, export, runtime selection, built-in migration, or old runtime deletion.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed with same-family authoring UI residue routed to queue.script-editor-event-binding-authoring-ui.`
- task_briefs:
  - `task.script-editor-event-binding-contract-loader.evidence-anchor-reconcile: Confirm source-backed anchors and claim boundaries before implementation.`
  - `task.script-editor-event-binding-contract-loader.contract-loader-implementation: Implement EventBinding contract and loader hydration with tests.`
  - `task.script-editor-event-binding-contract-loader.queue-closeout-and-handoff: Verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `The parent version is open with active_queue=none before admission.`
- `The version plan candidate recovery ledger records item.script-editor-event-binding-contract-loader as queue-candidate.`
- `The version spec marks queue.script-editor-event-binding-contract-loader as required-priority and first in the implementation order.`
- `Fresh code evidence confirms the double-table contract and eventBindings loader support do not already exist, so this queue is admitted as the first required-priority slice.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at queue closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level admission review admitted queue.script-editor-event-binding-contract-loader.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not restart a full re-audit if evidence-anchor-reconcile has already recorded current evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-binding-contract-loader.evidence-anchor-reconcile` | `done` | `Inspected current event contract, loader, export/import, trigger runtime, tests, and target spec before selecting the contract/loader implementation boundary.` | `none` | `Completed on 2026-07-16 after source evidence confirmed the first slice can own EventBinding contracts and eventBindings loader hydration without changing runtime event selection.` |
| `task.script-editor-event-binding-contract-loader.contract-loader-implementation` | `completed` | `Implemented EventBinding domain/pack contracts, eventBindings manifest validation, active-content indexing, and default runtime content exposure with focused tests.` | `task.script-editor-event-binding-contract-loader.evidence-anchor-reconcile` | `Completed on 2026-07-16 after RED/GREEN tests, typecheck, and Blueprint lint passed without altering editor UI/export/runtime cutover semantics.` |
| `task.script-editor-event-binding-contract-loader.queue-closeout-and-handoff` | `completed` | `Verified the bounded contract/loader slice, classified residue, and routed the next lawful queue.` | `task.script-editor-event-binding-contract-loader.contract-loader-implementation` | `Completed on 2026-07-16; EventDefinition.trigger, EventDefinition.conditions, and selectTriggeredEvents remain production runtime dependencies for later queues.` |

### Task Definitions

#### `task.script-editor-event-binding-contract-loader.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-binding-contract-loader.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/domain/scenario-pack.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/events/trigger-evaluator.ts`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-binding-contract-loader-queue.md`
- must_inspect:
  - `version acceptance matrix`
  - `candidate evidence matrix`
  - `implementation anchors`
- must_not_change:
  - `feature code before evidence_lock_status is locked`
  - `editor UI/event table behavior`
  - `runtime-pack export cutover`
  - `built-in zhuyuanzhang pack migration`
  - `EventBindingRuntime trigger selection`
  - `old runtime deletion`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Must inspect, must modify, must replace, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "EventDefinition|trigger|conditions|selectTriggeredEvents|eventBindings|files\\.events|events\\.json|EventBinding" src tests docs/script-editor-event-trigger-binding-design.md`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-event-binding-contract-loader.contract-loader-implementation`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock the contract/loader queue evidence before implementation.`
- task_outcome_summary:
  - `Done. Baseline selected a narrow contract/loader slice: add EventBinding and TriggerContext contract types, eventBindings manifest/file hydration, active-content storage, and registered extension-field boundaries while preserving old events.json-only runtime loading and leaving editor UI/export/runtime cutover to later queues.`
- Purpose:
  - `Prevent the first event-binding queue from widening into editor UI, export convergence, built-in pack migration, EventBindingRuntime, or old runtime deletion before the readable double-table contract exists.`
- Failure mode:
  - `Starting from the target title would risk mixing contract, editor, export, runtime, and migration ownership into one unreviewable slice.`

##### Progress Log

- `2026-07-16`: `src/domain/event.ts still defines EventDefinition with required trigger and conditions fields, and does not define EventBinding, EventBindingOwner, EventBindingTrigger, EventBindingConditionGroup, or TriggerContext.`
- `2026-07-16`: `src/application/scenario/scenario-pack-loader.ts currently validates manifests with files.events, files.scenes, files.characters, and files.scenarioProfile, but has no files.eventBindings manifest requirement or optional hydration path.`
- `2026-07-16`: `src/application/script-editor/runtime-pack-export.ts currently lowers editor event records into EventDefinition objects containing trigger timing/scope and conditions, so export cutover must remain a later queue.`
- `2026-07-16`: `src/application/events/trigger-evaluator.ts selectTriggeredEvents filters eventDefinitions by eventDefinition.trigger.timing, scope, occurrence, conditions, participants, and trigger priority, so runtime cutover and old runtime retirement must remain later queues.`
- `2026-07-16`: `tests/robustness.test.cjs already contains old-shape pack/export/runtime tests that assert files.events and events.json trigger/conditions behavior; this queue must add focused double-table loader coverage without deleting those old-path tests.`
- `2026-07-16`: `Selected implementation slice: add EventBinding contract/domain surfaces, allow scenario pack manifests to name eventBindings, hydrate event-bindings.json into active content/default content access, record registered extension boundaries, and preserve old events.json-only loading until later cutover queues close.`

#### `task.script-editor-event-binding-contract-loader.contract-loader-implementation`

##### Control Block

- task_id: `task.script-editor-event-binding-contract-loader.contract-loader-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-contract-loader-queue.md`
- must_inspect:
  - `Evidence lock from task.script-editor-event-binding-contract-loader.evidence-anchor-reconcile.`
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
- must_modify:
  - `src/domain/event.ts`
  - `src/domain/content-pack.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/content/pack-content-access.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-contract-loader-queue.md`
- must_replace:
  - `No replacement of old runtime behavior yet; only introduce the parallel readable eventBindings contract and loader storage surface.`
- must_preserve:
  - `Existing events.json-only scenario-pack loading.`
  - `Existing EventDefinition.trigger/conditions runtime behavior until later queues.`
  - `Existing script-editor event export/import behavior until later queues.`
  - `Sub-runtime lifecycle ownership and runtime-result handoff seams.`
- must_not_change:
  - `script-editor eventBindings table UI`
  - `runtime-pack export stripping of trigger/conditions`
  - `built-in zhuyuanzhang event data migration`
  - `EventBindingRuntime trigger dispatch`
  - `old selectTriggeredEvents deletion`
  - `house, scene, task, playable, navigation, or location-access runtime internals`
- done_when:
  - `EventBinding and TriggerContext contract types exist with fixed core fields plus registered extension surfaces.`
  - `Scenario-pack manifests may name files.eventBindings and loader hydration stores the parsed bindings in active content.`
  - `Old events.json-only packs still load.`
  - `Focused tests cover event-bindings.json loader hydration and old-pack compatibility.`
- verify_with:
  - `node --test --test-name-pattern "scenario pack loader hydrates event bindings" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record execution blockers in this queue doc rather than widening into UI/export/runtime migration.`
- promote_next_if_done: `task.script-editor-event-binding-contract-loader.queue-closeout-and-handoff`
- stop_if:
  - `The loader cannot expose eventBindings without first changing active-content ownership outside this queue's contract boundary.`
  - `A required EventBinding field proves runtime semantics that belong to EventBindingRuntime rather than contract/loader.`

##### Human Context

- task_brief:
  - `Implement the double-table EventBinding contract and loader hydration baseline.`
- task_outcome_summary:
  - `Done. Added EventBinding/TriggerContext contract types, ContentPackDefinition.eventBindings, scenario pack eventBindings array validation, active game content eventBindings indexes, default runtime content eventBindings storage, and focused tests.`
- Purpose:
  - `Make event-bindings.json readable and available to later editor/export/runtime queues.`
- Failure mode:
  - `Implementing runtime event selection or editor UI in the loader queue would collapse the ordered replacement plan.`

##### Progress Log

- `2026-07-16`: `Added failing loader validation coverage for non-array event-bindings.json, then implemented scenario eventBindings array validation and the ContentPackDefinition.eventBindings contract.`
- `2026-07-16`: `Added failing active-content coverage for eventBindings/eventBindingsById, then implemented event binding storage and merge/normalize propagation in createActiveGameContent and ActiveGameContentContext.storyContent.`
- `2026-07-16`: `Added failing default runtime content coverage for pack.eventBindings, then implemented defaultRuntimeContent.eventBindings and defaultPackEventBindings compatibility exposure.`
- `2026-07-16`: `Focused verification passed: npm run build:test plus the three event binding contract/loader tests, npm run typecheck, and npm run lint:blueprints.`

#### `task.script-editor-event-binding-contract-loader.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-binding-contract-loader.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-binding-contract-loader-queue.md`
  - `docs/blueprints/project-progress.md`
  - `src`
  - `tests`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `EventDefinition.trigger production dependency status`
  - `EventDefinition.conditions production dependency status`
  - `selectTriggeredEvents production dependency status`
- must_modify:
  - `docs/blueprints/queues/script-editor-event-binding-contract-loader-queue.md`
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
  - `Bounded contract/loader slice verification is recorded.`
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
  - `Done. Queue closed as open-residue with queue.script-editor-event-binding-authoring-ui as the unique same-family continuation. EventDefinition.trigger, EventDefinition.conditions, and selectTriggeredEvents remain production runtime dependencies until later runtime convergence and retirement queues.`
- Purpose:
  - `Return control to version review without confusing execution completion with full event-runtime replacement closure.`
- Failure mode:
  - `Treating contract/loader completion as permission to delete old event trigger paths.`
