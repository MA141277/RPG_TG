# Map City List Compatibility Preservation Queue

## Control Block

- queue_id: `queue.map-city-list-compatibility-preservation`
- belongs_to_version: `target.city-building-definition-location-access-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-16`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required-final`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The bounded final map city-list compatibility proof landed, passed verification, and left no blocking map compatibility residue inside the covered map marker and enter-city routing path. Version closeout still requires explicit human confirmation in the version plan.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-closeout-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Implementation, verification, queue closeout, and version closeout-review handoff truth recorded locally; no commit or push attempted.`
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
  - `Prove map markers still read city id/name and cityCoordinatesById from the existing map-owned path while map city clicks route through LocationAccessRuntime.`
- Forbidden expansions:
  - `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or cityCoordinatesById ownership.`
  - `Do not add city-management, taxation, conquest, production, or building-upgrade gameplay loops.`
  - `Do not redesign map rendering or campaign travel beyond the compatibility proof required by this queue.`
  - `Do not infer version closeout before this queue closes and version-level acceptance is explicitly recorded.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-city-building-export-import-validation-queue.md`

### Queue Snapshot

- queue_goal: `Preserve the existing map city-list and coordinate path while proving map city entry uses LocationAccessRuntime.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Verify queue closeout, classify residue, and return control to version review without inferring version closeout.`
- task_briefs:
  - `task.map-city-list-compatibility-preservation.boundary-baseline-reconcile: inspect current map city-list and entry routing seams before selecting the bounded compatibility proof.`
  - `task.map-city-list-compatibility-preservation.compatibility-proof-implementation: implement the selected compatibility proof with tests.`
  - `task.map-city-list-compatibility-preservation.queue-closeout-and-version-review: verify the bounded proof, classify residue, and return control to version review.`

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
- `Because this is a required-final queue, closeout must return to version review rather than infer version completion.`

### Admission Preconditions

- `City/building definition restructuring closed with map id/name compatibility preserved.`
- `LocationAccessRuntime convergence closed with city enter guarded before currentCityId mutation.`
- `Building-to-HouseRuntime adapter, status/save convergence, custom-attribute authoring, and export/import validation queues are closed.`
- `The version plan records this queue as the required-final compatibility proof for map city-list preservation.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Predecessor queue closeout classified map city-list compatibility as the unique final same-family continuation.`
2. `Version-level routing promoted queue.map-city-list-compatibility-preservation.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan admission record unless new material evidence invalidates the admitted basis.`
- `Do not start implementation before boundary-baseline-reconcile records current source-backed evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.map-city-list-compatibility-preservation.boundary-baseline-reconcile` | `done` | `Inspected current map city-list and entry routing seams before selecting the compatibility proof.` | `none` | `Baseline evidence recorded; selected a source/behavior proof slice without moving coordinate ownership.` |
| `task.map-city-list-compatibility-preservation.compatibility-proof-implementation` | `done` | `Implemented the selected map city-list compatibility proof with tests.` | `task.map-city-list-compatibility-preservation.boundary-baseline-reconcile` | `Map coordinate ownership preserved; no gameplay loop expansion.` |
| `task.map-city-list-compatibility-preservation.queue-closeout-and-version-review` | `done` | `Verified the bounded proof, classified residue, and returned control to version review.` | `task.map-city-list-compatibility-preservation.compatibility-proof-implementation` | `Version remains open until explicit human closeout confirmation.` |

### Task Definitions

#### `task.map-city-list-compatibility-preservation.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.map-city-list-compatibility-preservation.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/content/active-game-content.ts`
  - `src/application/presenter/app-render-coordinator.ts`
  - `src/core/runtime/navigation-runtime.ts`
  - `src/main.ts`
  - `src/ui/app-render.ts`
  - `src/ui/views/map/map-view.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/map-city-list-compatibility-preservation-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-city-building-export-import-validation-queue.md`
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
  - `src/application/content/active-game-content.ts`
  - `src/application/presenter/app-render-coordinator.ts`
  - `src/core/runtime/navigation-runtime.ts`
  - `src/main.ts`
  - `src/ui/app-render.ts`
  - `src/ui/views/map/map-view.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `map coordinate ownership`
  - `city-management or building-upgrade gameplay loops`
  - `unrelated runtime-pack export/import behavior`
- done_when:
  - `Existing map city marker source, cityCoordinatesById derivation, map render input, map click routing, and LocationAccessRuntime city-enter guard are inventoried with source-backed evidence.`
  - `The smallest lawful compatibility proof boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected map marker and city-enter behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "cityCoordinatesById|activeContentContext\\.cities|renderMap|MapDefinition|enter-city|createEnterCityRequest|LocationAccessRuntime|locationAccessDefinitions|currentCityId" src tests docs/blueprints/version-memo.md`
- if_blocked:
  - `Record the blocker in this queue doc rather than moving coordinates or broadening into map/gameplay rewrites silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.map-city-list-compatibility-preservation.compatibility-proof-implementation`
- stop_if:
  - `Fresh evidence proves map city-list compatibility cannot be bounded without first implementing a different admitted candidate queue.`

##### Human Context

- task_brief:
  - `Find the smallest map compatibility proof before changing map rendering or routing.`
- task_outcome_summary:
  - `Done. Baseline found the existing map-owned coordinate path intact and selected a narrow compatibility proof slice.`
- Purpose:
  - `Protect the existing map-owned coordinate path while confirming city entry now uses the runtime access boundary.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence could accidentally migrate coordinates into city definitions or duplicate navigation gating.`

##### Progress Log

- `2026-07-16`: `Queue auto-admitted from the verified export/import validation closeout. Boundary baseline reconciliation is now the active task.`
- `2026-07-16`: `Baseline evidence recorded: active content derives cityCoordinatesById from cityDefinition.mapNodeId and map nodes; app-render-coordinator passes activeContentContext.cities and activeContentContext.cityCoordinatesById into renderAppMarkup; app-render passes stage cityDefinitions plus input.cityCoordinatesById into createMapViewModel; map-view builds city markers from city definitions by id/name and cityCoordinatesById; main creates enter-city confirmations from reached city definitions and commits createEnterCityRequest through routeNavigationRuntime with activeContentContext.locationAccess; navigation-runtime evaluates LocationAccessRuntime before enterCity mutates currentCityId.`
- `2026-07-16`: `Baseline verification passed with npm run lint:blueprints and the required rg boundary scan. Smallest lawful next slice selected: add test-first source/behavior proofs in tests/robustness.test.cjs for map marker coordinate ownership and main enter-city dispatch locationAccessDefinitions wiring, with no production coordinate migration unless RED exposes a missing seam.`

#### `task.map-city-list-compatibility-preservation.compatibility-proof-implementation`

##### Control Block

- task_id: `task.map-city-list-compatibility-preservation.compatibility-proof-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `tests/robustness.test.cjs`
  - `src/ui/views/map/map-view.ts`
  - `src/application/presenter/app-render-coordinator.ts`
  - `src/ui/app-render.ts`
  - `src/main.ts`
- must_inspect:
  - `Boundary baseline evidence from task.map-city-list-compatibility-preservation.boundary-baseline-reconcile.`
- must_not_change:
  - `scope outside the selected baseline implementation slice`
- done_when:
  - `The selected map city-list compatibility proof is implemented test-first.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.map-city-list-compatibility-preservation.queue-closeout-and-version-review`
- stop_if:
  - `Implementation requires map coordinate migration or city-management gameplay outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the map city-list compatibility proof selected by baseline reconciliation.`
- task_outcome_summary:
  - `Done. Added a testable application map marker helper and source proof that enter-city dispatch passes active LocationAccessRuntime definitions.`
- Purpose:
  - `Prove map marker display and city click routing survived the city/building definition and LocationAccessRuntime convergence.`
- Failure mode:
  - `Implementing before baseline could create duplicate map city sources or hide existing routing coverage.`

##### Progress Log

- `2026-07-16`: `RED verified with npm run build:test then node --test tests/robustness.test.cjs: map city marker compatibility test failed because .test-dist/application/map/map-city-marker-view-model.js did not exist.`
- `2026-07-16`: `GREEN implemented src/application/map/map-city-marker-view-model.ts, added src/application/map/**/*.ts to tsconfig.test.json, and made src/ui/views/map/map-view.ts consume createMapCityMarkers so city markers use city id/name from definitions and coordinates from cityCoordinatesById only.`
- `2026-07-16`: `Added source proof that main enter-city confirmation dispatch passes activeContentContext.cityDefinitionById and activeContentContext.locationAccess into routeNavigationRuntime. Verification passed: npm run typecheck; npm test (562/562); npm run lint:blueprints; npm run lint:plans; npm run blueprint:governance:check.`
- `2026-07-16`: `Queue closeout classified residue as none and returned control to version closeout review with the version still open pending explicit human confirmation.`

#### `task.map-city-list-compatibility-preservation.queue-closeout-and-version-review`

##### Control Block

- task_id: `task.map-city-list-compatibility-preservation.queue-closeout-and-version-review`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/map-city-list-compatibility-preservation-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.map-city-list-compatibility-preservation.compatibility-proof-implementation.`
  - `Version plan closeout contract.`
- must_not_change:
  - `version_status without explicit version-level closeout confirmation`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Queue closeout classifies residue.`
  - `Version plan and project-progress pointers are synchronized to version review or explicit next lawful state.`
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
  - `Close or route the map compatibility queue after verified implementation.`
- task_outcome_summary:
  - `Done. Queue closed with no blocking map compatibility residue and returned the open version to closeout review.`
- Purpose:
  - `Return control to version review with final compatibility evidence recorded.`
- Failure mode:
  - `Closing without explicit version review would bypass the version closeout contract.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none`
- Recorded expected output:
  - `none`

### Historical Candidate Notes

- `version-closeout`
  - State:
    - `future-version-review`
  - Reason:
    - `After this required-final queue closes, version plan must decide whether acceptance is satisfied and ask for explicit human closeout confirmation before version_status becomes done.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the seventh execution queue for target.city-building-definition-location-access-convergence after export/import validation closed and routed final map compatibility as the next same-family candidate.`
