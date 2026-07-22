# Script Editor City Building Definition Restructure Queue

## Control Block

- queue_id: `queue.script-editor-city-building-definition-restructure`
- belongs_to_version: `target.city-building-definition-location-access-convergence`
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
- closure_basis: `The bounded no-visibility city/building definition contract slice landed and passed fresh verification. Runtime LocationAccessRuntime evaluation remains the unique same-family continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.location-access-runtime-convergence`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Implementation and closeout truth recorded locally after typecheck, full tests, Blueprint lint, plan lint, and governance check passed; no commit or push attempted.`
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
  - `Introduce the no-visibility city/building definition boundary needed before LocationAccessRuntime, HouseRuntime adaptation, status overlays, editor authoring, export/import validation, and map compatibility proof can converge.`
- Forbidden expansions:
  - `Do not implement LocationAccessRuntime expression evaluation in this queue beyond shaping compatible access data fields.`
  - `Do not adapt HouseRuntime execution ownership beyond recording the compatibility requirements of the new BuildingDefinition shape.`
  - `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or cityCoordinatesById ownership into city definitions.`
  - `Do not implement city-management, taxation, conquest, production, or building-upgrade gameplay loops.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`

### Queue Snapshot

- queue_goal: `Create the first city/building definition contract slice: base/profile/extended records, access field shape, no visibility field, and current map id/name compatibility preservation.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed with same-family LocationAccessRuntime residue routed to queue.location-access-runtime-convergence.`
- task_briefs:
  - `task.script-editor-city-building-definition-restructure.boundary-baseline-reconcile: inspect current city/building data shapes and freeze the smallest no-visibility definition migration boundary.`
  - `task.script-editor-city-building-definition-restructure.definition-contract-implementation: implement the selected definition contract slice test-first.`
  - `task.script-editor-city-building-definition-restructure.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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
- `The version plan candidate recovery ledger records item.script-editor-city-building-definition-restructure as queue-candidate.`
- `The version plan promotion ledger marks queue.script-editor-city-building-definition-restructure as the preferred first queue unless fresh implementation evidence proves LocationAccessRuntime must precede data-shape migration.`
- `No fresh contrary implementation evidence is recorded, so this queue is admitted as the first required-priority slice.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level admission review admitted queue.script-editor-city-building-definition-restructure.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not restart a full re-audit if boundary-baseline-reconcile has already recorded current evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-definition-restructure.boundary-baseline-reconcile` | `done` | `Inspected current city/building data, house runtime, map compatibility, script-editor, runtime-pack, and tests before selecting the implementation slice.` | `none` | `Completed on 2026-07-16 after source evidence confirmed the first slice can own script-editor city/building definition shape without moving map coordinates or implementing LocationAccessRuntime.` |
| `task.script-editor-city-building-definition-restructure.definition-contract-implementation` | `completed` | `Implemented the selected no-visibility city/building definition contract slice with tests.` | `task.script-editor-city-building-definition-restructure.boundary-baseline-reconcile` | `Completed on 2026-07-16 after typecheck, full tests, Blueprint lint, plan lint, and governance check passed.` |
| `task.script-editor-city-building-definition-restructure.queue-closeout-and-handoff` | `completed` | `Verified the bounded slice, classified residue, and routed the unique same-family continuation.` | `task.script-editor-city-building-definition-restructure.definition-contract-implementation` | `Completed on 2026-07-16 without inferring full version closeout.` |

### Task Definitions

#### `task.script-editor-city-building-definition-restructure.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-definition-restructure.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src`
  - `tests`
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-definition-restructure-queue.md`
- must_inspect:
  - `src/domain`
  - `src/application/script-editor`
  - `src/application/house-modules`
  - `src/core`
  - `src/ui/main-ui`
  - `tests`
  - `docs/architecture.md`
  - `docs/special-house-interface.md`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `LocationAccessRuntime expression evaluation`
  - `HouseRuntime deprivileging beyond compatibility inventory`
  - `map coordinate, map node, mapBinding, mapNodeId, or cityCoordinatesById ownership`
  - `city-management, taxation, conquest, production, or building-upgrade gameplay loops`
- done_when:
  - `Current city/building, house runtime, map city list, script-editor, runtime-pack, save/status, and test seams are inventoried with source-backed evidence.`
  - `The smallest lawful no-visibility city/building definition implementation boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected compatibility behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "city|building|house|HouseDefinition|MapDefinition|cityCoordinatesById|visibility|visible|access|script-editor" src tests docs/architecture.md docs/special-house-interface.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into LocationAccessRuntime or HouseRuntime implementation silently.`
  - `Return to version review if fresh evidence proves LocationAccessRuntime must be admitted before any definition restructure.`
- promote_next_if_done: `task.script-editor-city-building-definition-restructure.definition-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the initial data-shape migration.`
  - `The current code already lacks a city/building/house/map data seam to migrate.`

##### Human Context

- task_brief:
  - `Find the smallest city/building definition migration boundary and record it before code changes.`
- task_outcome_summary:
  - `Done. Baseline selected a narrow authoring/domain/materializer/export/import contract slice: replace script-editor city/building access visibility state with no-visibility access condition shape, add base/profile/extended city/building record fields, keep BuildingDefinition-to-HouseDefinition compatibility materialization, and preserve map id/name/mapNodeId/cityCoordinatesById ownership.`
- Purpose:
  - `Prevent the first queue from widening into runtime access evaluation, HouseRuntime deprivileging, or map coordinate migration before the definition contract is understood.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence would risk moving map or house ownership into the wrong layer.`

##### Progress Log

- `2026-07-16`: `Baseline inventory found domain CityDefinition is still a flat runtime city shape with mapNodeId, houseIds, prosperity, danger, and specialDemand, while HouseDefinition still owns building/session-facing fields such as type, characterIds, activityLocationId, moduleId, story-stage gates, event hooks, and backAction.`
- `2026-07-16`: `Script-editor project records already split cities and buildings, but ScriptEditorAccessRule is still state-based with visible-enabled / visible-disabled / hidden and building authoring directly owns HouseDefinition fields instead of a nested baseAttributes/profileMap/extendedAttributes shape.`
- `2026-07-16`: `city-building-runtime-materializer currently converts ScriptEditorBuildingRecord into HouseDefinition, generates CityEntryDefinition records, and derives houseAccessRefusalRules from visible-disabled/hidden access state. That makes it the compatibility seam for preserving HouseRuntime behavior while changing authoring record shape.`
- `2026-07-16`: `Runtime export writes project.cities unchanged and materialized houses/cityEntries/refusal rules; runtime import maps pack.houses back through normalizeScriptEditorBuildingRecord. The first slice must update both export and import compatibility without freezing final LocationAccessRuntime validation.`
- `2026-07-16`: `Map markers still use activeContentContext.cities plus cityCoordinatesById, and cityCoordinatesById is derived from CityDefinition.mapNodeId and MapDefinition nodes. This queue must not move map coordinates or map node ownership into city definitions.`
- `2026-07-16`: `City entry currently mutates currentCityId in application/navigation/enter-city.ts and house entry uses selectHouseEntryAccess over story-stage gates plus houseAccessRefusalRules. LocationAccessRuntime before-mutation enforcement remains a later queue, not this structure slice.`
- `2026-07-16`: `Selected implementation slice: update script-editor city/building domain records and authoring helpers to support baseAttributes, profileMap, extendedAttributes, and LocationAccessRule.conditionExpression without visibility state; keep materialization to legacy CityDefinition/HouseDefinition/cityEntries/refusal-rule outputs; preserve map id/name/mapNodeId compatibility; add tests proving no visibility access state remains in the covered script-editor definition contract.`

#### `task.script-editor-city-building-definition-restructure.definition-contract-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-definition-restructure.definition-contract-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-definition-restructure-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-city-building-definition-restructure.boundary-baseline-reconcile.`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `LocationAccessRuntime expression evaluation unless promoted by version-plan truth.`
  - `HouseRuntime deprivileging beyond the selected data-shape compatibility surface.`
  - `map coordinate ownership.`
- done_when:
  - `The selected definition contract slice is implemented test-first.`
  - `No visibility field remains in the covered new city/building definition contract surface.`
  - `Existing map city id/name and cityCoordinatesById compatibility is preserved for the covered slice.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-building-definition-restructure.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broad LocationAccessRuntime, HouseRuntime, status overlay, or export/import validation work outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the selected no-visibility city/building definition contract slice.`
- task_outcome_summary:
  - `Completed. Script-editor city/building records now use baseAttributes/profileMap/extendedAttributes and no-visibility conditionExpression access shape while materializing compatibility CityDefinition, HouseDefinition, cityEntries, cityNpcPools, and refusal-rule runtime families.`
- Purpose:
  - `Create the definition structure other current-version queues can build on.`
- Failure mode:
  - `Mixing runtime access evaluation or house gameplay ownership into the first structure slice would hide later queue boundaries.`

##### Progress Log

- `2026-07-16`: `Implemented the bounded definition slice in domain records, authoring helpers, runtime materializer, runtime-pack export/import, workspace preview, and main-ui city/building access surface. Covered new records no longer expose access.state or visibility options; legacy visible-disabled/hidden inputs are absorbed into literal-false conditionExpression compatibility data.`
- `2026-07-16`: `Fresh verification passed with npm run typecheck, npm test (547 pass, 0 fail), npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check. npm test emitted the existing Node DEP0187 warning but exited 0.`

#### `task.script-editor-city-building-definition-restructure.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-definition-restructure.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-definition-restructure-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.script-editor-city-building-definition-restructure.definition-contract-implementation.`
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
  - `Close the queue or route residue after the bounded definition slice verifies.`
- task_outcome_summary:
  - `Completed with same-family residue: LocationAccessRuntime expression evaluation and before-mutation city/building entry enforcement are routed to queue.location-access-runtime-convergence.`
- Purpose:
  - `Return control to version review without confusing first-queue completion for full version closure.`
- Failure mode:
  - `Closing without residue classification would hide LocationAccessRuntime, HouseRuntime, status, editor, export/import, or map compatibility follow-up.`

##### Progress Log

- `2026-07-16`: `Classified residue as same-family because the definition records now carry conditionExpression but no runtime evaluator or before-mutation entry guard exists yet. Routed the unique continuation to queue.location-access-runtime-convergence; HouseRuntime adapter, status overlays, custom-attribute authoring, export/import validation, and map compatibility remain later version candidates.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Closed the bounded no-visibility city/building definition slice and routed queue.location-access-runtime-convergence for runtime conditionExpression evaluation.`
- Recorded expected output:
  - `A minimum city/building definition contract that later LocationAccessRuntime, HouseRuntime adapter, status, editor, export/import, and map compatibility queues can consume.`

### Historical Candidate Notes

- `queue.location-access-runtime-convergence`
  - State:
    - `same-version-candidate`
  - Reason:
    - `Expected next candidate after the minimum city/building definition contract exists, unless baseline evidence proves access runtime must precede data-shape migration.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the first required-priority execution queue for target.city-building-definition-location-access-convergence.`
