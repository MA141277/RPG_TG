# Script Editor Building House Runtime Adapter Queue

## Control Block

- queue_id: `queue.script-editor-building-house-runtime-adapter`
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
- closure_basis: `The bounded resolved city-building-to-HouseRuntime entry adapter slice landed and passed required verification. City/building runtime status overlays remain the unique same-version continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.city-building-status-save-runtime-convergence`
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
  - `Demote HouseRuntime to the post-entry interaction/session/module runner while BuildingDefinition and LocationAccessRuntime own building identity and entry access.`
- Forbidden expansions:
  - `Do not reintroduce house-specific business branches in src/main.ts.`
  - `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or cityCoordinatesById ownership into city or house runtime adapters.`
  - `Do not implement city/building status overlays or save persistence in this queue unless baseline proves adapter cannot be bounded without a minimal seam.`
  - `Do not implement custom-attribute authoring controls or broad runtime-pack validation in this queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-16-city-building-definition-location-access-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/location-access-runtime-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Adapt the city/building entry boundary so HouseRuntime runs post-entry house interactions without owning primary building data or access decisions.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed with same-family runtime status overlay residue routed to queue.city-building-status-save-runtime-convergence.`
- task_briefs:
  - `task.script-editor-building-house-runtime-adapter.boundary-baseline-reconcile: inspect current HouseRuntime and building entry seams before choosing the adapter boundary.`
  - `task.script-editor-building-house-runtime-adapter.adapter-contract-implementation: implement the selected BuildingDefinition-to-HouseRuntime adapter slice test-first.`
  - `task.script-editor-building-house-runtime-adapter.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-city-building-definition-restructure closed after the no-visibility city/building definition contract slice landed and verified.`
- `queue.location-access-runtime-convergence closed after runtime location access definitions, evaluator, runtime-pack preservation, and covered before-mutation city/building entry guards landed and verified.`
- `The version plan closure routing record marks queue.script-editor-building-house-runtime-adapter as the unique same-family continuation because HouseRuntime still needs to become a post-entry interaction runner instead of a primary building/access owner.`
- `This queue is admitted as the next required slice; implementation must start with baseline reconciliation.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and branch-commit at task closeout.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level closure routing auto-admitted queue.script-editor-building-house-runtime-adapter.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Resume from this queue doc and the version-plan routing record unless new material evidence invalidates the admitted basis.`
- `Do not restart a full re-audit if boundary-baseline-reconcile has already recorded current evidence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-building-house-runtime-adapter.boundary-baseline-reconcile` | `done` | `Inspected current HouseRuntime, building placement, entry transition, session, registry, renderer, module ownership, and tests before selecting the adapter slice.` | `none` | `Completed on 2026-07-16 after source evidence confirmed the first adapter slice can add a resolved entry contract without status overlays, custom-attribute authoring, export/import validation, or map coordinate migration.` |
| `task.script-editor-building-house-runtime-adapter.adapter-contract-implementation` | `completed` | `Implemented the selected resolved city-building-to-HouseRuntime adapter slice with tests.` | `task.script-editor-building-house-runtime-adapter.boundary-baseline-reconcile` | `Completed on 2026-07-16 after typecheck, full tests, Blueprint lint, plan lint, and governance check passed.` |
| `task.script-editor-building-house-runtime-adapter.queue-closeout-and-handoff` | `completed` | `Verified the bounded slice, classified residue, and routed the unique same-family continuation.` | `task.script-editor-building-house-runtime-adapter.adapter-contract-implementation` | `Completed on 2026-07-16 without inferring full version closeout.` |

### Task Definitions

#### `task.script-editor-building-house-runtime-adapter.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-building-house-runtime-adapter.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/city`
  - `src/application/house-runtime`
  - `src/core/runtime`
  - `src/core/registry`
  - `src/domain/house.ts`
  - `src/main.ts`
  - `tests`
  - `docs/blueprints/queues/script-editor-building-house-runtime-adapter-queue.md`
- must_inspect:
  - `docs/blueprints/queues/location-access-runtime-convergence-queue.md`
  - `docs/special-house-interface.md`
  - `src/application/city/city-building-placement-resolver.ts`
  - `src/application/navigation/enter-house.ts`
  - `src/application/house-runtime`
  - `src/core/runtime/house-runtime-bridge.ts`
  - `src/core/registry`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `house-specific business branching in src/main.ts`
  - `city/building status overlays or save persistence`
  - `custom-attribute authoring controls`
  - `runtime-pack export/import validation hardening`
  - `map coordinate ownership`
- done_when:
  - `Current HouseRuntime entry, session, registry, renderer, module default, and city-building placement seams are inventoried with source-backed evidence.`
  - `The smallest lawful adapter boundary is selected, or a concrete blocker is recorded.`
  - `A test-first implementation plan names exact files, expected adapter behavior, compatibility behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "enterHouse|HouseRuntime|house-runtime|houseDefinition|HouseDefinition|moduleId|defaultCharacterId|city-building|canEnterCityBuilding" src tests`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening into status overlay, custom attribute authoring, export/import validation, or map compatibility work silently.`
  - `Return to version review if fresh evidence proves a different prerequisite queue must run first.`
- promote_next_if_done: `task.script-editor-building-house-runtime-adapter.adapter-contract-implementation`
- stop_if:
  - `Fresh evidence proves HouseRuntime adapter cannot be bounded without first implementing a different admitted candidate queue.`

##### Human Context

- task_brief:
  - `Find the smallest BuildingDefinition-to-HouseRuntime adapter boundary before changing house entry behavior.`
- task_outcome_summary:
  - `Done. Baseline selected a narrow adapter slice: add a resolved HouseRuntime entry contract derived from city-building placement/house definitions, let HouseRuntime enter through that resolved entry while preserving legacy house-id helpers, and keep concrete house modules unchanged.`
- Purpose:
  - `Prevent HouseRuntime from continuing to own primary building/access concerns while preserving existing post-entry house interactions.`
- Failure mode:
  - `Starting implementation without source-backed boundary evidence could re-grow house-specific data ownership or main.ts business branches.`

##### Progress Log

- `2026-07-16`: `Queue auto-admitted from the verified LocationAccessRuntime closeout. Boundary baseline reconciliation is now the active task.`
- `2026-07-16`: `Inspected docs/special-house-interface.md and confirmed the governing contract: main.ts must keep stable wiring only, house behavior resolves through moduleId plus one shared registry seam, persistent state stays in unified runtime structures, and application modules must return structured data rather than HTML.`
- `2026-07-16`: `Inspected src/application/navigation/enter-house.ts and src/core/runtime/navigation-runtime.ts. The navigation runtime still has a legacy state-only enterHouse path for onEnterEvent handling, but covered production house entry uses core/runtime/house-runtime.ts through enterHouseThroughRuntime.`
- `2026-07-16`: `The queue must_inspect path src/core/runtime/house-runtime-bridge.ts no longer exists; the current core bridge implementation is src/core/runtime/house-runtime.ts. That file owns enter/leave/dispatch, resolves HouseDefinition by houseId from dependencies.houseDefinitions, applies city-view state transition, calls moduleId registry lifecycle methods, and triggers house-enter / indoor-screen follow-up events.`
- `2026-07-16`: `Inspected src/application/city/city-building-placement-resolver.ts and found the city/building boundary already derives placements from cityEntries plus houses and now applies LocationAccessRuntime before legacy story/refusal gates. This is the correct source for a resolved building entry context; HouseRuntime should not duplicate city-entry or access decisions.`
- `2026-07-16`: `Inspected src/core/registry/house-module-registry.ts and src/core/registry/builtin-house-module-contributions.ts. Builtin module and renderer wiring already share one core registry seam, while src/application/house-modules/house-module-registry.ts remains a compatibility re-export seam for application consumers.`
- `2026-07-16`: `Inspected src/application/presenter/stage-presenters.ts and src/ui/views/house/house-module-view-registry.ts. Presenter and renderer lookup already resolve moduleId through registry-compatible seams; the adapter slice should not import concrete house business modules into main.ts or presenters.`
- `2026-07-16`: `Inspected src/application/runtime/city-directory-leader-residence-coordinator.ts, src/application/runtime/city-3d-house-entry-coordinator.ts, src/application/runtime/city-house-transition-coordinator.ts, and src/application/runtime/city-view-transition.ts. City/list/3D callers still pass house ids into enterHouseThroughRuntime after canOpenHouseFromCity; the smallest adapter can preserve these helpers while adding a resolved entry path for placement-aware callers.`
- `2026-07-16`: `Inspected tests around house runtime ownership, registry seams, presenter seams, and city-building placement. Existing tests protect the core runtime request contract, the shared registry seam, application compatibility imports, covered house entry/leave/dispatch behavior, and LocationAccessRuntime building guard behavior.`
- `2026-07-16`: `Selected implementation slice: add a core HouseRuntimeEntry contract plus helper for entering a pre-resolved house runtime entry, add an application city-building adapter that resolves a CityBuildingPlacement into that entry after placement/access checks, and use tests to prove HouseRuntime entry can be driven by resolved building data without re-resolving access or adding main.ts house business branches. Keep status overlays, custom-attribute authoring, broad export/import validation, map coordinate migration, and concrete house module refactors for later queues.`

#### `task.script-editor-building-house-runtime-adapter.adapter-contract-implementation`

##### Control Block

- task_id: `task.script-editor-building-house-runtime-adapter.adapter-contract-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/core/contracts/house-runtime.ts`
  - `src/core/runtime/house-runtime.ts`
  - `src/application/city/city-building-house-runtime-adapter.ts`
  - `src/application/city/city-building-placement-resolver.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-building-house-runtime-adapter-queue.md`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-building-house-runtime-adapter.boundary-baseline-reconcile.`
- must_not_change:
  - `scope outside the selected baseline implementation slice`
- done_when:
  - `The selected BuildingDefinition-to-HouseRuntime adapter slice is implemented test-first.`
- verify_with:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker and return to version review if the selected implementation slice requires a different prerequisite queue.`
- promote_next_if_done: `task.script-editor-building-house-runtime-adapter.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires status overlays, custom attribute authoring, export/import validation, or map coordinate migration work outside the admitted queue.`

##### Human Context

- task_brief:
  - `Implement the adapter slice selected by baseline reconciliation.`
- task_outcome_summary:
  - `Completed. Added a resolved HouseRuntimeEntry contract, a city-building adapter that turns allowed placements into resolved runtime entries, and a HouseRuntime entry path that can enter and dispatch from a resolved entry while preserving legacy house-id helpers.`
- Purpose:
  - `Keep HouseRuntime as post-entry interaction/session/module runner without making it the primary building model.`
- Failure mode:
  - `Implementing before baseline could duplicate city-building placement logic or bypass LocationAccessRuntime.`

##### Progress Log

- `2026-07-16`: `Added RED tests proving city-building placement can resolve a HouseRuntime entry and HouseRuntime can enter plus dispatch through that resolved entry without depending on a global houseDefinitions lookup. The tests failed first because the adapter module/export did not exist.`
- `2026-07-16`: `Added HouseRuntimeEntry and enter-resolved request contract, implemented enterResolvedHouseThroughRuntime, cached resolved house definitions for post-entry dispatch, and preserved enterHouseThroughRuntime(houseId) compatibility.`
- `2026-07-16`: `Added src/application/city/city-building-house-runtime-adapter.ts to reuse resolveCityBuildingView access/placement checks and produce a city-building-placement-sourced runtime entry only after access passes.`
- `2026-07-16`: `Verification passed: npm run typecheck; npm test; npm run lint:blueprints; npm run lint:plans; npm run blueprint:governance:check.`

#### `task.script-editor-building-house-runtime-adapter.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-building-house-runtime-adapter.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-16-city-building-definition-location-access-convergence-target-plan.md`
  - `docs/blueprints/queues/script-editor-building-house-runtime-adapter-queue.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `Implementation result from task.script-editor-building-house-runtime-adapter.adapter-contract-implementation.`
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
  - `Close or route the adapter queue after verified implementation.`
- task_outcome_summary:
  - `Completed with same-family residue: city/building runtime status save convergence remains the unique next queue now that definition, access, and HouseRuntime entry adapter boundaries are stable.`
- Purpose:
  - `Return control to version review without hiding status, editor, export/import, or map compatibility residue.`
- Failure mode:
  - `Closing without residue classification would hide later city/building convergence queues.`

##### Progress Log

- `2026-07-16`: `Classified residue as same-family because authored city/building definitions and resolved entry/access boundaries now exist, but current city/building runtime values still have no final-value status overlay or save path. Routed the unique continuation to queue.city-building-status-save-runtime-convergence; custom-attribute authoring, export/import validation, and map compatibility remain later version candidates.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Closed the bounded BuildingDefinition-to-HouseRuntime adapter slice and routed queue.city-building-status-save-runtime-convergence for runtime status/save convergence.`
- Recorded expected output:
  - `A resolved city-building-to-HouseRuntime entry adapter that later status, editor, export/import, and map compatibility queues can consume.`

### Historical Candidate Notes

- `queue.city-building-status-save-runtime-convergence`
  - State:
    - `same-version-candidate`
  - Reason:
    - `Expected later candidate after HouseRuntime adapter boundary is stable, unless baseline evidence proves runtime status overlays must precede adapter implementation.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the third execution queue for target.city-building-definition-location-access-convergence after the LocationAccessRuntime queue closed and routed the HouseRuntime adapter as unique same-family continuation.`
- `Queue closed after the resolved city-building-to-HouseRuntime entry adapter landed with required verification.`

### Historical Snapshot (2026-07-16)

- `Queue admitted as the third execution queue for target.city-building-definition-location-access-convergence after the LocationAccessRuntime queue closed and routed the HouseRuntime adapter as unique same-family continuation.`
