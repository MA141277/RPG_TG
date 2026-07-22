# Script Editor City Building Export Import Validation Queue

## Control Block

- queue_id: `queue.script-editor-city-building-export-import-validation`
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
- closure_basis: `Bounded runtime export validation slice landed with fail-closed diagnostics for unsupported city/building custom attributes; final map city-list compatibility proof remains same-family residue.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.map-city-list-compatibility-preservation`
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
  - `Validate and harden the script-editor city/building runtime-pack export/import boundary after the definition, access, adapter, status, and custom-attribute authoring slices are stable.`
- Forbidden expansions:
  - `Do not implement map coordinate ownership migration in this queue.`
  - `Do not add condition-expression authoring UI beyond validation evidence required for export/import behavior.`
  - `Do not add city-management, taxation, conquest, production, or building-upgrade gameplay loops.`
  - `Do not rewrite unrelated runtime-pack families unless city/building validation evidence proves a bounded shared helper is required.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-city-building-custom-attribute-authoring-queue.md`

### Queue Snapshot

- queue_goal: `Harden city/building export/import validation for the stabilized definition, access, status, and custom-attribute authoring boundary.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Closed after verified fail-closed runtime export validation slice; final map compatibility residue routed.`
- task_briefs:
  - `task.script-editor-city-building-export-import-validation.boundary-baseline-reconcile: inspect current export/import validation seams before selecting the bounded validation contract.`
  - `task.script-editor-city-building-export-import-validation.validation-contract-implementation: implement the selected city/building export/import validation slice with tests.`
  - `task.script-editor-city-building-export-import-validation.queue-closeout-and-handoff: verify the bounded slice, classify residue, and return control to version review.`

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
- `queue.script-editor-city-building-custom-attribute-authoring closed after city/building extendedAttributes gained creator-facing controls and save/load coverage.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Predecessor queue closeout classified export/import validation as the unique same-family continuation.`
2. `Version-level routing promoted queue.script-editor-city-building-export-import-validation.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not start implementation before boundary-baseline-reconcile records current source-backed evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-export-import-validation.boundary-baseline-reconcile` | `done` | `Inspect export/import validation seams before selecting the bounded validation contract.` | `none` | `Baseline selected fail-closed export validation for unsupported city/building custom attributes; implementation must be test-first.` |
| `task.script-editor-city-building-export-import-validation.validation-contract-implementation` | `done` | `Implement the selected city/building export/import validation slice with tests.` | `task.script-editor-city-building-export-import-validation.boundary-baseline-reconcile` | `Landed fail-closed unsupported custom-attribute diagnostics without widening into map coordinate migration, condition-expression UI, or management gameplay.` |
| `task.script-editor-city-building-export-import-validation.queue-closeout-and-handoff` | `done` | `Verify the bounded slice, classify residue, and return control to version review.` | `task.script-editor-city-building-export-import-validation.validation-contract-implementation` | `Routed unique same-family residue to queue.map-city-list-compatibility-preservation; did not infer version closeout.` |

### Task Definitions

#### `task.script-editor-city-building-export-import-validation.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-export-import-validation.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-export-import-validation-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-city-building-custom-attribute-authoring-queue.md`
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
  - `docs/blueprints/version-memo.md`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/content-pack.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `map coordinate ownership`
  - `condition-expression authoring UI`
  - `city-management or building-upgrade gameplay loops`
  - `unrelated runtime-pack families`
- done_when:
  - `Existing city/building export/import materialization, validation diagnostics, imported runtime-family preservation, custom-attribute disposition, and tests are inventoried with source-backed evidence.`
  - `The smallest lawful city/building export/import validation boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected export/import behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "city-building-runtime-materializer|validateScriptEditorProjectForRuntimeExport|exportScriptEditorProjectToScenarioPackFiles|loadScriptEditorProjectFromScenarioPackFiles|location-access|extendedAttributes|cities.json|houses.json|city-entries.json|house-access-refusal-rules" src tests docs/blueprints/version-memo.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into map compatibility, condition-expression UI, or gameplay-loop work silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.script-editor-city-building-export-import-validation.validation-contract-implementation`
- stop_if:
  - `Fresh evidence proves export/import validation cannot be bounded without first implementing a different admitted candidate queue.`

##### Human Context

- task_brief:
  - `Find the smallest city/building export/import validation boundary before changing runtime-pack behavior.`
- task_outcome_summary:
  - `Done. Baseline selected fail-closed validation for unsupported city/building custom attributes at runtime export.`
- Purpose:
  - `Prevent city/building definition, access, status, and custom-attribute authoring data from being silently lost, mis-exported, or mis-imported at the runtime-pack boundary.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence could duplicate validation, destabilize unrelated families, or hide map compatibility residue.`

##### Progress Log

- `2026-07-16`: `Queue auto-admitted from the verified custom-attribute authoring closeout. Boundary baseline reconciliation is now the active task.`
- `2026-07-16`: `Baseline inspected the predecessor custom-attribute authoring queue, active version target, version memo, city/building authoring, city-building runtime materializer, editor project loader/save, runtime export/import, scenario pack loader, content-pack contract, and robustness tests. Evidence: runtime export materializes city/building definitions, entries, NPC pools, house refusal rules, and locationAccess; runtime import maps locationAccess back onto city/building access; scenario/content contracts carry locationAccess but do not define generic city/building custom-attribute runtime slots; current city runtime materializer only projects known specialDemand from city.extendedAttributes and otherwise silently drops city/building extendedAttributes.`
- `2026-07-16`: `Selected implementation slice: add test-first fail-closed diagnostics in runtime export when city/building extendedAttributes contain unsupported keys that cannot be preserved in the current runtime CityDefinition/HouseDefinition contract. Keep the existing specialDemand projection accepted for cities. Do not expand runtime schema, condition-expression UI, map ownership, or gameplay loops in this queue slice.`
- `2026-07-16`: `Test-first plan for next task: add RED tests in tests/robustness.test.cjs proving validateScriptEditorProjectForRuntimeExport reports unsupported city/building custom attributes and exportScriptEditorProjectToScenarioPackFiles throws instead of silently dropping them; then implement the minimal diagnostics in src/application/script-editor/runtime-pack-export.ts or a bounded helper it owns; verify with npm run typecheck, npm test, npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check.`

#### `task.script-editor-city-building-export-import-validation.validation-contract-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-export-import-validation.validation-contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-export-import-validation-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-city-building-export-import-validation.boundary-baseline-reconcile.`
- must_not_change:
  - `scope outside the selected baseline implementation slice`
- done_when:
  - `The selected city/building export/import validation slice is implemented test-first.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-building-export-import-validation.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires map coordinate migration, condition-expression UI, or management gameplay outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the export/import validation slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Done. Runtime export validation now fails closed on unsupported city/building custom attributes while preserving the city specialDemand projection.`
- Purpose:
  - `Make city/building runtime-pack export/import fail closed or preserve data explicitly after the upstream authoring boundaries stabilized.`
- Failure mode:
  - `Implementing before baseline could overfit to one runtime family and miss imported city/building compatibility cases.`

##### Progress Log

- `2026-07-16`: `RED tests were added first for unsupported city/building custom attributes at runtime export; npm test failed as expected because validateScriptEditorProjectForRuntimeExport returned no diagnostics and export would silently drop tradeRank/taxRate.`
- `2026-07-16`: `Implemented minimal runtime export diagnostics for unsupported city/building extendedAttributes in src/application/script-editor/runtime-pack-export.ts, allowing only the existing city specialDemand projection.`
- `2026-07-16`: `Verification passed: npm test (561 tests), npm run typecheck, npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check.`

#### `task.script-editor-city-building-export-import-validation.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-export-import-validation.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-export-import-validation-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.script-editor-city-building-export-import-validation.validation-contract-implementation.`
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
  - `Close or route the export/import validation queue after verified implementation.`
- task_outcome_summary:
  - `Done. Queue closed with same-family residue routed to queue.map-city-list-compatibility-preservation.`
- Purpose:
  - `Return control to version review without hiding map compatibility or later city/building residue.`
- Failure mode:
  - `Closing without residue classification would hide the map city-list compatibility queue or incorrectly infer version completion.`

##### Progress Log

- `2026-07-16`: `Closeout classified remaining same-family residue as final map city-list compatibility preservation: map markers must continue to read activeContentContext.cities plus cityCoordinatesById while map city clicks route through LocationAccessRuntime. Unique next family candidate is queue.map-city-list-compatibility-preservation.`
- `2026-07-16`: `Version plan and project-progress were synchronized to auto-admit queue.map-city-list-compatibility-preservation as the next active queue; repository sync recorded as local-record, with no commit or push attempted.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none`
- Recorded expected output:
  - `none`

### Historical Candidate Notes

- `queue.map-city-list-compatibility-preservation`
  - State:
    - `admitted-continuation`
  - Reason:
    - `Expected later candidate after export/import validation unless baseline evidence proves map compatibility must precede validation implementation.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the sixth execution queue for target.city-building-definition-location-access-convergence after the custom-attribute authoring queue closed and routed export/import validation as the next same-family candidate.`
