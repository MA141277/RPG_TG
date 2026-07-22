# Script Editor City Building Custom Attribute Authoring Queue

## Control Block

- queue_id: `queue.script-editor-city-building-custom-attribute-authoring`
- belongs_to_version: `target.city-building-definition-location-access-convergence`
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
- closure_basis: `Bounded city/building custom-attribute authoring landed with helper, UI, and save/load coverage; broader runtime-pack export/import validation remains same-family residue.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.script-editor-city-building-export-import-validation`
- auto_continue_eligible: `true`
- next_effect: `auto-admit-next-family-candidate`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout truth recorded locally after verified implementation; no commit or push attempted.`
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
  - `Expose city/building extendedAttributes through governed creator-facing controls and keep save/load/export disposition explicit.`
- Forbidden expansions:
  - `Do not implement broad runtime-pack export/import validation hardening in this queue beyond the custom-attribute slice required for authoring persistence.`
  - `Do not implement location access condition-expression authoring UI in this queue unless baseline proves a minimal shared field-definition seam is required.`
  - `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or cityCoordinatesById ownership.`
  - `Do not add city-management, taxation, conquest, production, or building-upgrade gameplay loops.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/city-building-status-save-runtime-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Add bounded creator-facing city/building custom-attribute authoring over existing extendedAttributes records.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Closed after verified bounded city/building custom-attribute helper/UI/save-load authoring slice.`
- task_briefs:
  - `task.script-editor-city-building-custom-attribute-authoring.boundary-baseline-reconcile: inspect current authoring and persistence mechanisms before choosing the custom-attribute authoring slice.`
  - `task.script-editor-city-building-custom-attribute-authoring.authoring-contract-implementation: implement the selected city/building custom-attribute authoring slice with tests.`
  - `task.script-editor-city-building-custom-attribute-authoring.queue-closeout-and-handoff: verify the bounded slice, classify residue, and return control to version review.`

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

- `queue.script-editor-city-building-definition-restructure closed after city/building records gained baseAttributes/profileMap/extendedAttributes shape.`
- `queue.location-access-runtime-convergence closed after access condition data had a runtime evaluator and entry guards.`
- `queue.script-editor-building-house-runtime-adapter closed after BuildingDefinition-to-HouseRuntime entry ownership stabilized.`
- `queue.city-building-status-save-runtime-convergence closed after city/building current-value status maps, runtime commit merge, save modState persistence, and startup restore landed.`
- `The version plan closure routing record marks queue.script-editor-city-building-custom-attribute-authoring as the next same-family candidate because creators still need governed city/building extendedAttributes controls.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level admission promoted queue.script-editor-city-building-custom-attribute-authoring.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not restart a full re-audit if boundary-baseline-reconcile has already recorded current evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-custom-attribute-authoring.boundary-baseline-reconcile` | `done` | `Inspect existing person custom attributes, field mapping, city/building records, save/load, and export/import seams before selecting the authoring boundary.` | `none` | `Baseline evidence selected the bounded helper/UI/save-load slice; implementation must still be test-first.` |
| `task.script-editor-city-building-custom-attribute-authoring.authoring-contract-implementation` | `done` | `Implement the selected city/building custom-attribute authoring slice with tests.` | `task.script-editor-city-building-custom-attribute-authoring.boundary-baseline-reconcile` | `Landed helper/UI/save-load slice without widening into broad export/import validation, access expression authoring, map coordinate migration, or management gameplay.` |
| `task.script-editor-city-building-custom-attribute-authoring.queue-closeout-and-handoff` | `done` | `Verify the bounded slice, classify residue, and return control to version review.` | `task.script-editor-city-building-custom-attribute-authoring.authoring-contract-implementation` | `Routed unique same-family residue to queue.script-editor-city-building-export-import-validation; did not infer version closeout.` |

### Task Definitions

#### `task.script-editor-city-building-custom-attribute-authoring.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-custom-attribute-authoring.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor`
  - `src/domain/script-editor-project.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-custom-attribute-authoring-queue.md`
- must_inspect:
  - `docs/blueprints/queues/city-building-status-save-runtime-convergence-queue.md`
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
  - `docs/blueprints/version-memo.md`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `broad runtime-pack export/import validation hardening`
  - `location access condition-expression authoring UI`
  - `map coordinate ownership`
  - `city-management or building-upgrade gameplay loops`
- done_when:
  - `Existing person custom-attribute authoring, field mapping, city/building extendedAttributes records, save/load, runtime export/import, and UI seams are inventoried with source-backed evidence.`
  - `The smallest lawful city/building custom-attribute authoring boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected authoring/save/load/export behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "extendedAttributes|ScriptEditorCustomAttributeEntry|person-authoring|field-mapping|city-building-authoring|runtime-pack-export|runtime-pack-import|custom attribute|自定义属性" src tests docs/blueprints/version-memo.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into condition-expression authoring, broad export/import validation, or map compatibility work silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.script-editor-city-building-custom-attribute-authoring.authoring-contract-implementation`
- stop_if:
  - `Fresh evidence proves city/building custom-attribute authoring cannot be bounded without first implementing a different admitted candidate queue.`

##### Human Context

- task_brief:
  - `Find the smallest city/building custom-attribute authoring boundary before changing editor controls.`
- task_outcome_summary:
  - `Done. Baseline selected a bounded helper/UI/save-load authoring slice over existing city/building extendedAttributes records.`
- Purpose:
  - `Give creators governed controls for city/building extendedAttributes without falling back to raw JSON edits or ad hoc future fields.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence could duplicate person custom-attribute logic poorly, accidentally widen into condition-expression UI, or hide export/import residue.`

##### Progress Log

- `2026-07-16`: `Queue admitted from the verified city/building status/save closeout. Boundary baseline reconciliation is now the active task.`
- `2026-07-16`: `Baseline inspected the predecessor status/save queue, active version target, version memo, person custom-attribute authoring, field mapping, city/building authoring, project save/load, runtime export/import, main UI, and robustness tests. Evidence: person authoring already exposes append/remove/update helpers and UI controls for person.extendedAttributes; field mapping currently defines person.extendedAttributes as key-value-list only; city/building authoring normalizes city/building extendedAttributes and seeds defaults but has no city/building custom-attribute append/update/remove helpers; project save serializes parsed project files wholesale and loader validates family arrays rather than custom-attribute semantics; runtime export/import already materializes city/building families and carries access/status seams, with broader export/import validation reserved as residue; main UI has location profile/menu/access/entry panels and input routing, but no city/building custom-attribute controls.`
- `2026-07-16`: `Selected implementation slice: add test-first city/building custom-attribute helper functions in src/application/script-editor/city-building-authoring.ts, add creator-facing city/building profile controls in src/ui/main-ui/main-ui-flow.js using existing extendedAttributes records, and prove project save/load persistence through existing serializer/loader seams if the helper/UI tests do not already cover it. Explicit residue: broad runtime-pack export/import validation remains routed to queue.script-editor-city-building-export-import-validation; condition-expression authoring UI, map coordinate ownership, and city-management/building-upgrade gameplay remain out of scope.`
- `2026-07-16`: `Test-first plan for next task: add RED tests in tests/robustness.test.cjs for city/building attribute append/update/remove helpers, source-level UI/action/input bindings for location custom attributes, and bounded project serialization/load preservation; verify RED before production edits; then implement minimal helper and UI wiring; verify with npm run typecheck, npm test, npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check.`

#### `task.script-editor-city-building-custom-attribute-authoring.authoring-contract-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-custom-attribute-authoring.authoring-contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-custom-attribute-authoring-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-city-building-custom-attribute-authoring.boundary-baseline-reconcile.`
- must_not_change:
  - `scope outside the selected baseline implementation slice`
- done_when:
  - `The selected city/building custom-attribute authoring slice is implemented test-first.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-building-custom-attribute-authoring.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broad export/import validation, condition-expression authoring UI, or map coordinate migration outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the custom-attribute authoring slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Done. Added city/building extendedAttributes helper functions, profile-panel controls, action/input routing, and save/load coverage test-first.`
- Purpose:
  - `Persist creator-edited city/building extendedAttributes through existing project save/load surfaces and bounded runtime disposition.`
- Failure mode:
  - `Implementing before baseline could create duplicate editor controls or mix custom attributes with runtime status overlays incorrectly.`

##### Progress Log

- `2026-07-16`: `RED tests were added first for city/building custom-attribute helper behavior, city/building profile UI/action/input bindings, and project save/load preservation; npm test failed as expected on the missing renderScriptEditorLocationCustomAttributes(location) UI seam before production edits.`
- `2026-07-16`: `Implemented append/update/remove helpers in src/application/script-editor/city-building-authoring.ts and wired src/ui/main-ui/main-ui-flow.js city/building profile panels to edit location extendedAttributes through existing selected-location replacement flow.`
- `2026-07-16`: `Verification passed: npm test (560 tests), npm run typecheck, npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check.`

#### `task.script-editor-city-building-custom-attribute-authoring.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-custom-attribute-authoring.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-custom-attribute-authoring-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.script-editor-city-building-custom-attribute-authoring.authoring-contract-implementation.`
  - `Version plan closure routing rules.`
- must_not_change:
  - `version_status without explicit version-level closeout confirmation`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Queue closeout classifies residue and names the next same-family candidate if uniquely supported.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
  - `Repository sync is attempted or explicitly recorded according to queue sync policy.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked according to the queue closeout judgement rule.`
- promote_next_if_done: `version-review`
- stop_if:
  - `Closeout would infer full version completion without explicit version-level acceptance.`

##### Human Context

- task_brief:
  - `Close or route the custom-attribute authoring queue after verified implementation.`
- task_outcome_summary:
  - `Done. Queue closed with same-family residue routed to queue.script-editor-city-building-export-import-validation.`
- Purpose:
  - `Return control to version review without hiding export/import validation, condition-expression authoring, or map compatibility residue.`
- Failure mode:
  - `Closing without residue classification would hide later city/building convergence queues.`

##### Progress Log

- `2026-07-16`: `Closeout classified remaining same-family residue as broad runtime-pack export/import validation after the bounded authoring/save-load slice passed verification. Unique next family candidate is queue.script-editor-city-building-export-import-validation.`
- `2026-07-16`: `Version plan and project-progress were synchronized to auto-admit queue.script-editor-city-building-export-import-validation as the next active queue; repository sync recorded as local-record, with no commit or push attempted.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none`
- Recorded expected output:
  - `none`

### Historical Candidate Notes

- `queue.script-editor-city-building-export-import-validation`
  - State:
    - `admitted-continuation`
  - Reason:
    - `Expected later candidate after city/building custom-attribute authoring boundaries are stable, unless baseline evidence proves export/import validation must precede authoring implementation.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the fifth execution queue for target.city-building-definition-location-access-convergence after the status/save queue closed and routed city/building custom-attribute authoring as the next same-family candidate.`
