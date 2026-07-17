# Script Editor Event Binding Authoring UI Queue

## Control Block

- queue_id: `queue.script-editor-event-binding-authoring-ui`
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
- closure_basis: `The bounded script-editor eventBindings authoring slice landed and passed focused save/load, UI navigation, authoring-helper, typecheck, Blueprint lint, and full npm test verification. Runtime export convergence remains the unique same-family continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.script-editor-event-binding-export-convergence`
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
  - `Add script-editor project eventBindings data and UI display/navigation for event bodies and event bindings as separate authoring tables.`
- Forbidden expansions:
  - `Do not export production event-bindings.json in this queue beyond project save/load coverage.`
  - `Do not strip trigger/conditions from runtime events.json export in this queue.`
  - `Do not migrate the built-in zhuyuanzhang pack in this queue.`
  - `Do not introduce EventBindingRuntime or delete selectTriggeredEvents in this queue.`
  - `Do not invent condition or resolver runtime semantics in the UI.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-BINDING-UI-001`
  - `ACC-EVENT-BINDING-UI-002`
  - `ACC-EVENT-BINDING-UI-003`
- acceptance_not_claimed:
  - `ACC-EVENT-BINDING-EXPORT-001`
  - `ACC-ZHUYUANZHANG-MIGRATION-001`
  - `ACC-EVENT-BINDING-RUNTIME-001`
  - `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001`
- minimum_verification:
  - `node --test --test-name-pattern "script editor project save emits event bindings as a separate file|script editor event editor exposes event binding navigation" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-BINDING-UI-001: ScriptEditorProjectDefinition includes project-level eventBindings and canonical save/load files preserve them.`
- `ACC-EVENT-BINDING-UI-002: Event body records can remain visible separately from event binding records in the script-editor UI.`
- `ACC-EVENT-BINDING-UI-003: Event details can show bindings that reference the selected event, and binding records can expose their target event id for navigation/editing.`

#### Cannot Claim

- `ACC-EVENT-BINDING-EXPORT-001: Runtime-pack export writes events.json without trigger/conditions and event-bindings.json with runnable bindings.`
- `ACC-ZHUYUANZHANG-MIGRATION-001: Built-in zhuyuanzhang pack is migrated to event-bindings.json.`
- `ACC-EVENT-BINDING-RUNTIME-001: EventBindingRuntime selects, evaluates, activates, and hands off events through TriggerContext.`
- `ACC-OLD-EVENT-RUNTIME-RETIREMENT-001: Old EventDefinition.trigger/conditions scanning paths are deleted.`

#### Legacy Paths To Replace

- `src/domain/script-editor-project.ts SCRIPT_EDITOR_PROJECT_FILE_KEYS and SCRIPT_EDITOR_PROJECT_CANONICAL_FILES do not include eventBindings.`
- `ScriptEditorEventRecord currently owns triggerTiming and conditionGroups directly on the event body authoring record.`
- `src/ui/main-ui/main-ui-flow.js renderScriptEditorEventEditor only exposes event body tabs, not an eventBindings table or event-to-binding visibility.`

#### Compatibility Paths To Preserve

- `Existing script-editor projects without eventBindings must still parse with an empty eventBindings list.`
- `Existing event editor triggerTiming and conditionGroups controls may remain visible as legacy/migration fields until export/runtime queues replace the old path.`
- `Runtime-pack export/import behavior remains old-shape until the export convergence queue owns it.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
- Must modify:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-authoring-ui-queue.md`
- Must preserve:
  - `Existing script-editor project save/load for all prior canonical files.`
  - `Existing event body editing and list selection behavior.`
  - `Old runtime export/import semantics until later queues.`

#### Verification Coverage

- `Add failing project save/load coverage for canonical event-bindings.json preservation.`
- `Add failing UI source coverage that the event editor exposes an event binding tab/list/count tied to the selected event.`
- `Run npm run typecheck and npm run lint:blueprints before task closeout.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`

### Queue Snapshot

- queue_goal: `Create the script-editor authoring surface for separate event body and event binding records without changing runtime export or trigger dispatch.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue execution complete; next same-family queue is export convergence.`
- task_briefs:
  - `task.script-editor-event-binding-authoring-ui.evidence-anchor-reconcile: Confirm source-backed anchors and claim boundaries before implementation.`
  - `task.script-editor-event-binding-authoring-ui.project-model-and-ui-baseline: Implement project model/save/load and event editor binding visibility.`
  - `task.script-editor-event-binding-authoring-ui.queue-closeout-and-handoff: Verify, classify residue, and return control to version review.`

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
- `The version plan routed same-family residue from queue.script-editor-event-binding-contract-loader to queue.script-editor-event-binding-authoring-ui.`
- `The version spec marks queue.script-editor-event-binding-authoring-ui as required-priority after contract/loader baseline.`
- `Fresh code evidence confirms the script-editor authoring model and UI do not already expose separate eventBindings records.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at queue closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan routing truth selected queue.script-editor-event-binding-authoring-ui as the unique same-family continuation.`
2. `Version-level admission review admitted queue.script-editor-event-binding-authoring-ui.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not restart a full re-audit if evidence-anchor-reconcile has already recorded current evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-binding-authoring-ui.evidence-anchor-reconcile` | `done` | `Inspected current script-editor project schema, save/load, event authoring helpers, event UI, tests, and target spec before selecting the implementation slice.` | `none` | `Completed on 2026-07-16 after source evidence confirmed this queue can own project-level eventBindings and UI visibility without changing export/runtime semantics.` |
| `task.script-editor-event-binding-authoring-ui.project-model-and-ui-baseline` | `completed` | `Implemented project-level eventBindings save/load, authoring helpers, and event editor binding visibility with focused tests.` | `task.script-editor-event-binding-authoring-ui.evidence-anchor-reconcile` | `Completed on 2026-07-16 without altering runtime export, built-in pack migration, EventBindingRuntime, or old trigger dispatch.` |
| `task.script-editor-event-binding-authoring-ui.queue-closeout-and-handoff` | `completed` | `Verified the bounded authoring UI slice, classified residue, and routed export convergence as the next lawful queue.` | `task.script-editor-event-binding-authoring-ui.project-model-and-ui-baseline` | `EventDefinition.trigger, EventDefinition.conditions, and selectTriggeredEvents remain production runtime dependencies.` |

### Task Definitions

#### `task.script-editor-event-binding-authoring-ui.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-binding-authoring-ui.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/script-editor-event-trigger-binding-design.md`
  - `docs/blueprints/specs/2026-07-16-script-editor-event-binding-runtime-replacement-target.md`
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-binding-authoring-ui-queue.md`
- must_inspect:
  - `version acceptance matrix`
  - `candidate evidence matrix`
  - `implementation anchors`
- must_not_change:
  - `feature code before evidence_lock_status is locked`
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
  - `rg -n "eventBindings|ScriptEditorEventRecord|triggerTiming|conditionGroups|renderScriptEditorEvent|events\\.json|event-bindings" src tests docs/script-editor-event-trigger-binding-design.md`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-event-binding-authoring-ui.project-model-and-ui-baseline`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock the authoring UI queue evidence before implementation.`
- task_outcome_summary:
  - `Done. Baseline selected a narrow authoring slice: add project-level eventBindings, preserve them through script-editor project save/load, and expose selected-event binding visibility in the event editor while preserving old triggerTiming/conditionGroups as migration fields.`
- Purpose:
  - `Prevent the authoring UI queue from widening into export, built-in pack migration, runtime dispatch, or old runtime deletion.`
- Failure mode:
  - `Starting from the queue title would risk mixing authoring visibility with runnable export and EventBindingRuntime semantics.`

##### Progress Log

- `2026-07-16`: `src/domain/script-editor-project.ts does not list eventBindings in SCRIPT_EDITOR_PROJECT_FILE_KEYS or ScriptEditorProjectDefinition; canonical project save therefore cannot emit event-bindings.json.`
- `2026-07-16`: `ScriptEditorEventRecord still owns triggerTiming and conditionGroups directly; this queue may preserve those as migration fields but must add a separate project-level binding record surface.`
- `2026-07-16`: `editor-project-loader.ts validates every canonical file key and currently cannot parse a project package with eventBindings unless the key and project field are added.`
- `2026-07-16`: `main-ui-flow.js renderScriptEditorEventEditor only renders event body tabs and does not show bindings that reference the selected event.`
- `2026-07-16`: `Selected implementation slice: add eventBindings to script-editor project schema/save/load, add authoring helpers for normalized binding records, and expose a bindings tab or panel in the event editor that lists bindings for the selected event.`

#### `task.script-editor-event-binding-authoring-ui.project-model-and-ui-baseline`

##### Control Block

- task_id: `task.script-editor-event-binding-authoring-ui.project-model-and-ui-baseline`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-authoring-ui-queue.md`
- must_inspect:
  - `Evidence lock from task.script-editor-event-binding-authoring-ui.evidence-anchor-reconcile.`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_modify:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-event-binding-authoring-ui-queue.md`
- must_replace:
  - `No runtime replacement yet; introduce separate project-level eventBindings authoring storage and selected-event UI visibility.`
- must_preserve:
  - `Existing event body editing and list behavior.`
  - `Existing script-editor project packages without eventBindings by normalizing them to an empty list.`
  - `Old runtime-pack export/import behavior until later queues.`
- must_not_change:
  - `runtime-pack export stripping of trigger/conditions`
  - `built-in zhuyuanzhang event data migration`
  - `EventBindingRuntime trigger dispatch`
  - `old selectTriggeredEvents deletion`
- done_when:
  - `ScriptEditorProjectDefinition includes project-level eventBindings and save/load preserves event-bindings.json.`
  - `Legacy project packages without eventBindings normalize to an empty list.`
  - `Event editor UI exposes bindings that reference the selected event without moving runtime semantics into the UI.`
  - `Focused tests cover project save/load and UI event-binding visibility.`
- verify_with:
  - `node --test --test-name-pattern "script editor project save emits event bindings as a separate file|script editor event editor exposes event binding navigation" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record execution blockers in this queue doc rather than widening into export/runtime migration.`
- promote_next_if_done: `task.script-editor-event-binding-authoring-ui.queue-closeout-and-handoff`
- stop_if:
  - `The project model cannot add eventBindings without a runtime export contract backfill.`
  - `A UI-required binding field proves a runtime-required contract gap that must return to controlled contract backfill review.`

##### Human Context

- task_brief:
  - `Implement the script-editor eventBindings project model and selected-event UI visibility baseline.`
- task_outcome_summary:
  - `Done. Added project-level ScriptEditorProjectDefinition.eventBindings, canonical event-bindings.json project save/load with old-project empty-list compatibility, event binding authoring default/normalization helpers, and a selected-event Bindings tab that lists bindings targeting the current event. Runtime export/import semantics remain old-shape.`
- Purpose:
  - `Let creators see and preserve event binding records separately from event bodies before runnable export and runtime cutover.`
- Failure mode:
  - `Moving runnable trigger semantics into the UI queue instead of keeping it as authoring data.`

##### Progress Log

- `2026-07-16`: `Added failing coverage for script-editor project save/load preserving canonical event-bindings.json and for the event editor exposing selected-event binding navigation. RED failed on the missing project file and missing UI binding surface.`
- `2026-07-16`: `Implemented ScriptEditorEventBindingRecord, project-level eventBindings canonical file storage, old project package compatibility that normalizes missing eventBindings to an empty list, default project eventBindings, runtime-pack import projection compatibility, and selected-event binding visibility in main-ui-flow.js.`
- `2026-07-16`: `Added failing authoring-helper coverage for event binding default/normalization behavior, then implemented createDefaultScriptEditorEventBindingRecord and normalizeScriptEditorEventBindingRecord.`
- `2026-07-16`: `Focused verification passed for project save/load, event binding UI navigation, and story/dialogue/event authoring helpers; npm run typecheck and npm run lint:blueprints passed.`

#### `task.script-editor-event-binding-authoring-ui.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-binding-authoring-ui.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-16-script-editor-event-binding-runtime-replacement-target-plan.md`
  - `docs/blueprints/queues/script-editor-event-binding-authoring-ui-queue.md`
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
  - `docs/blueprints/queues/script-editor-event-binding-authoring-ui-queue.md`
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
  - `Bounded authoring UI slice verification is recorded.`
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
  - `Done. Queue closed as open-residue with queue.script-editor-event-binding-export-convergence as the unique same-family continuation. EventDefinition.trigger, EventDefinition.conditions, and selectTriggeredEvents remain production runtime dependencies until export/runtime convergence and old-runtime retirement queues complete.`
- Purpose:
  - `Return control to version review without confusing authoring visibility with runnable export or runtime replacement.`
- Failure mode:
  - `Treating UI/model support as permission to delete old event trigger paths.`

##### Progress Log

- `2026-07-16`: `Closeout classified remaining work as same-family residue: runtime-pack export still writes trigger/condition data in events.json, built-in zhuyuanzhang remains unmigrated, EventBindingRuntime is not active, and old selectTriggeredEvents paths remain production dependencies.`
- `2026-07-16`: `Next lawful continuation is uniquely routed to queue.script-editor-event-binding-export-convergence because editor project data can now represent event bodies and event bindings separately.`
