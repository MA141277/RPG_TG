# City Building Status Save Runtime Convergence Queue

## Control Block

- queue_id: `queue.city-building-status-save-runtime-convergence`
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
- closure_basis: `The bounded AppState-owned city/building status overlay and save/runtime convergence slice landed and passed required verification. Custom-attribute authoring remains a same-version candidate and must return through version review.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-city-building-custom-attribute-authoring`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
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
  - `Introduce city/building runtime status overlays and save/runtime convergence for current city/building values without mutating authored definitions.`
- Forbidden expansions:
  - `Do not implement custom-attribute authoring controls in this queue unless baseline proves a minimal status field-definition seam is required.`
  - `Do not harden broad runtime-pack export/import validation in this queue.`
  - `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or cityCoordinatesById ownership into status overlays.`
  - `Do not add city-management, taxation, conquest, production, or building-upgrade gameplay loops.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-building-house-runtime-adapter-queue.md`

### Queue Snapshot

- queue_goal: `Add a bounded runtime/save status overlay contract for current city/building values while authored definitions remain immutable source data.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed with same-family custom-attribute authoring residue returned to version review.`
- task_briefs:
  - `task.city-building-status-save-runtime-convergence.boundary-baseline-reconcile: inspect current save/runtime/status mechanisms and choose the smallest city/building status boundary.`
  - `task.city-building-status-save-runtime-convergence.status-contract-implementation: implement the selected city/building status runtime/save slice test-first.`
  - `task.city-building-status-save-runtime-convergence.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-city-building-definition-restructure closed after authored city/building definitions stopped owning visibility state.`
- `queue.location-access-runtime-convergence closed after runtime location access definitions and before-mutation guards landed.`
- `queue.script-editor-building-house-runtime-adapter closed after resolved city-building entries could drive HouseRuntime post-entry interactions.`
- `The version plan closure routing record marks queue.city-building-status-save-runtime-convergence as the unique same-family continuation because current city/building runtime values still need a status overlay/save path.`
- `This queue is admitted as the next required slice; implementation must start with baseline reconciliation.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level closure routing auto-admitted queue.city-building-status-save-runtime-convergence.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan routing record unless new material evidence invalidates the admitted basis.`
- `Do not restart a full re-audit if boundary-baseline-reconcile has already recorded current evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.city-building-status-save-runtime-convergence.boundary-baseline-reconcile` | `done` | `Inspected CharacterStatus, save envelope, startup restore, state-sync, active content, city/house definitions, and tests before selecting the status overlay boundary.` | `none` | `Completed on 2026-07-16 after source evidence confirmed the first status slice can be AppState-owned and save-backed without custom-attribute authoring, export/import hardening, map coordinate migration, or gameplay loops.` |
| `task.city-building-status-save-runtime-convergence.status-contract-implementation` | `completed` | `Implemented the selected AppState-owned city/building status runtime/save slice with tests.` | `task.city-building-status-save-runtime-convergence.boundary-baseline-reconcile` | `Completed on 2026-07-16 after typecheck, full tests, Blueprint lint, plan lint, and governance check passed.` |
| `task.city-building-status-save-runtime-convergence.queue-closeout-and-handoff` | `completed` | `Verified the bounded slice, classified residue, and returned control to version review.` | `task.city-building-status-save-runtime-convergence.status-contract-implementation` | `Completed on 2026-07-16 without inferring full version closeout.` |

### Task Definitions

#### `task.city-building-status-save-runtime-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.city-building-status-save-runtime-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain`
  - `src/application/content`
  - `src/core/save`
  - `src/core/runtime`
  - `src/application/startup`
  - `tests`
  - `docs/blueprints/queues/city-building-status-save-runtime-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/queues/script-editor-building-house-runtime-adapter-queue.md`
  - `src/domain/character-status.ts`
  - `src/core/save`
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/application/content/active-game-content.ts`
  - `src/domain/city.ts`
  - `src/domain/house.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `custom-attribute authoring controls`
  - `runtime-pack export/import validation hardening`
  - `map coordinate ownership`
  - `city-management or building-upgrade gameplay loops`
- done_when:
  - `Current CharacterStatus, save envelope, startup restore, runtime settlement, active content, city definition, and building/house definition seams are inventoried with source-backed evidence.`
  - `The smallest lawful status overlay boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected status/save behavior, compatibility behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "CharacterStatus|characterStatusById|SaveEnvelope|modState|cityStatus|buildingStatus|CityDefinition|HouseDefinition|currentCityId|currentHouseId" src tests`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into custom-attribute authoring, export/import validation, or map compatibility work silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.city-building-status-save-runtime-convergence.status-contract-implementation`
- stop_if:
  - `Fresh evidence proves city/building runtime status cannot be bounded without first implementing a different admitted candidate queue.`

##### Human Context

- task_brief:
  - `Find the smallest city/building status overlay and save boundary before changing runtime state behavior.`
- task_outcome_summary:
  - `Done. Baseline selected a narrow AppState-owned status overlay slice: mirror the CharacterStatus patch/materialize/merge pattern for city and building current values, persist the maps through save modState, restore them at startup, and let runtime commit merge status patches without mutating authored definitions or active content arrays.`
- Purpose:
  - `Prevent authored city/building definitions from becoming mutable runtime state while allowing current city/building values to persist.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence could mutate authored definitions, duplicate CharacterStatus patterns poorly, or pull map coordinate ownership into status.`

##### Progress Log

- `2026-07-16`: `Queue auto-admitted from the verified HouseRuntime adapter closeout. Boundary baseline reconciliation is now the active task.`
- `2026-07-16`: `Inspected src/domain/character-status.ts. CharacterStatus is the current reusable precedent: authored CharacterDefinition values are copied, patches overlay profile/stat/skill/custom/stamina fields, and mergeCharacterStatusById/mergeCharacterStatusMaps accumulate runtime patches without mutating authored definitions.`
- `2026-07-16`: `Inspected src/core/save/save-envelope.ts, src/core/save/save-migrations.ts, src/core/save/browser-save-record.ts, and src/main.ts save wiring. SaveEnvelope preserves CoreGameState.modState verbatim; browser save read/write round-trips modState; main.ts currently writes only non-empty appState.characterStatusById into modState.characterStatusById.`
- `2026-07-16`: `Inspected src/application/startup/startup-session-coordinator.ts and tests/robustness.test.cjs startup restore coverage. Restore reads saveData.modState.characterStatusById, materializes characterDefinitions inside createAppState, stores characterStatusById on AppState, and tests prove authored definitions remain unchanged.`
- `2026-07-16`: `Inspected src/core/runtime/state-sync-runtime.ts, src/core/runtime/state-sync-core-seam.ts, and RuntimeResult contracts. commitRuntimeRequest converts AppState to runtime state, dispatches, then applies runtime state back while merging CharacterStatus patches into the AppState-owned status store; no city/building status maps exist yet.`
- `2026-07-16`: `Inspected src/application/content/active-game-content.ts. ActiveGameContentContext owns immutable cityDefinitionById/houseDefinitionById lookup arrays derived from content packs; cityCoordinatesById remains derived from city mapNodeId plus map nodes and must not move into status.`
- `2026-07-16`: `Inspected src/domain/city.ts and src/domain/house.ts. CityDefinition currently carries stable authored fields plus current-value-like prosperity/danger; HouseDefinition carries building identity/entry/module fields but no runtime status overlay contract.`
- `2026-07-16`: `Inspected src/domain/script-editor-project.ts and src/application/script-editor/city-building-runtime-materializer.ts. Script-editor city records have baseAttributes prosperity/security and building records have baseAttributes level/damaged/outputMultiplier, but runtime materialization currently lowers only city prosperity/danger and house entry/module fields; custom attribute authoring remains out of scope.`
- `2026-07-16`: `Ran the required rg search for CharacterStatus, characterStatusById, SaveEnvelope, modState, cityStatus, buildingStatus, CityDefinition, HouseDefinition, currentCityId, and currentHouseId across src and tests. Existing protected seams cover CharacterStatus materialization, runtime commit merge, browser save round-trip, startup restore, AppState bridge export, city/building definitions, and current location ids; no existing cityStatusById or buildingStatusById contract was found.`
- `2026-07-16`: `Selected implementation slice: add domain city/building status patch helpers, add optional cityStatusById/buildingStatusById stores to AppState and RuntimeResult commit merge, write non-empty maps through modState, restore saved maps at startup, and test that materialization overlays current city/building values without mutating authored definitions. The first slice will not materialize active content globally, will not move mapNodeId/map coordinates, and will not add authoring controls or management/upgrade loops.`
- `2026-07-16`: `Test-first plan for the next task: add RED tests in tests/robustness.test.cjs for CityStatus/BuildingStatus materialize+merge immutability, commitRuntimeRequest merging cityStatusById/buildingStatusById patches into AppState, startup restore preserving saved status maps, and browser save/main-source guard preserving modState keys. Then implement src/domain/city-status.ts, src/domain/building-status.ts, AppState/RuntimeResult/state-sync-core-seam/startup-session-coordinator/main.ts wiring, with verification npm run typecheck, npm test, npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check.`

#### `task.city-building-status-save-runtime-convergence.status-contract-implementation`

##### Control Block

- task_id: `task.city-building-status-save-runtime-convergence.status-contract-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/city-status.ts`
  - `src/domain/building-status.ts`
  - `src/application/app-shell.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/runtime/state-sync-core-seam.ts`
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/city-building-status-save-runtime-convergence-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.city-building-status-save-runtime-convergence.boundary-baseline-reconcile.`
- must_not_change:
  - `scope outside the selected baseline implementation slice`
- done_when:
  - `The selected city/building status runtime/save slice is implemented test-first.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.city-building-status-save-runtime-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires custom-attribute authoring, broad export/import validation, or map coordinate migration work outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the status overlay slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Completed. Added CityStatus and BuildingStatus materialize/merge helpers, AppState status stores, RuntimeResult status patch propagation, state-sync merge, startup restore, and main save modState preservation.`
- Purpose:
  - `Persist current city/building runtime values without mutating authored definitions.`
- Failure mode:
  - `Implementing before baseline could create ad hoc top-level globals or store status in content definitions.`
- Progress Log:
  - `2026-07-16`: `Added RED tests for city/building status materialization immutability, runtime commit status merge, startup restore status map preservation, and main save modState inclusion. The tests failed first because city-status/building-status modules and status wiring did not exist.`
  - `2026-07-16`: `Implemented src/domain/city-status.ts and src/domain/building-status.ts, added optional AppState cityStatusById/buildingStatusById stores, extended RuntimeResult, merged status patches in state-sync-core-seam, restored saved status maps in startup-session-coordinator, and preserved non-empty maps in main.ts modState.`
  - `2026-07-16`: `Verification passed: npm run typecheck; npm test; npm run lint:blueprints; npm run lint:plans; npm run blueprint:governance:check.`

#### `task.city-building-status-save-runtime-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.city-building-status-save-runtime-convergence.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/city-building-status-save-runtime-convergence-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.city-building-status-save-runtime-convergence.status-contract-implementation.`
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
  - `Close or route the status/save queue after verified implementation.`
- task_outcome_summary:
  - `Completed with same-family residue: city/building status overlays and save/runtime convergence landed, while custom-attribute authoring, export/import validation, and map compatibility remain later same-version candidates.`
- Purpose:
  - `Return control to version review without hiding editor, export/import, or map compatibility residue.`
- Failure mode:
  - `Closing without residue classification would hide later city/building convergence queues.`
- Progress Log:
  - `2026-07-16`: `Closed the bounded status/save queue after required verification. Residue remains same-family because creator-facing city/building custom-attribute authoring is still needed after the status boundary, but this closeout returns control to version review rather than auto-creating the next queue.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none`
- Recorded expected output:
  - `none`

### Historical Candidate Notes

- `queue.script-editor-city-building-custom-attribute-authoring`
  - State:
    - `same-version-candidate`
  - Reason:
    - `Expected later candidate after runtime status overlay boundaries are stable, unless baseline evidence proves custom-attribute authoring must precede status implementation.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the fourth execution queue for target.city-building-definition-location-access-convergence after the HouseRuntime adapter queue closed and routed runtime status overlays as unique same-family continuation.`
