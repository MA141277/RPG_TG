# Script Editor City Building Placement Resolver Convergence Queue

## Control Block

- queue_id: `queue.script-editor-city-building-placement-resolver-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-city-building-placement-resolver-convergence.resolver-contract-implementation`
- next_task: `task.script-editor-city-building-placement-resolver-convergence.queue-closeout-and-handoff`
- closeout_status: `open`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `execute-active-task`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Queue admitted locally; repository sync is pending after baseline or terminal queue state.`
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
  - `Converge city-local building placement ownership and centralized runtime resolver seams so city/building/runtime views do not manually stitch reusable buildings, city entries, NPC pools, access rules, dialogue bindings, and conditions.`
- Forbidden expansions:
  - `Do not replace the just-landed runtime-house-compatible building contract.`
  - `Do not implement dialogue/story progression, playable/minigame bindings, or scenario launch policy inside this queue unless baseline proves a smaller resolver seam cannot proceed without a routed prerequisite.`
  - `Do not hardcode city/building/NPC business branches in main.ts.`
  - `Do not use compatibility-only export projection as the final resolver model.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-city-building-structure-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Determine and implement the smallest city/building placement resolver slice that gives runtime and preview code one governed way to resolve city-local building entries, NPC assignment, access/refusal data, and inherited building dialogue without duplicating lookup logic.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Baseline selected a bounded shared resolver API over existing runtime families; implementation should add tests and the resolver module without migrating persistent placement schema yet.`
- task_briefs:
  - `task.script-editor-city-building-placement-resolver-convergence.boundary-baseline-reconcile: inventory city-local placement and resolver seams, decide the smallest lawful implementation slice, and record test-first implementation boundaries.`
  - `task.script-editor-city-building-placement-resolver-convergence.resolver-contract-implementation: implement the selected placement/resolver contract slice with tests.`
  - `task.script-editor-city-building-placement-resolver-convergence.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-city-building-entry-and-npc-authoring-priority closed after export could materialize bounded city/building/NPC runtime families from editor authoring fields.`
- `queue.script-editor-city-building-structure-convergence closed after ScriptEditorBuildingRecord explicitly owned the covered runtime HouseDefinition fields.`
- `The target spec marks city-local placements, placement ids, override layering, NPC assignment ownership, access rules, dialogue inheritance, and centralized resolver seams as required before runtime views manually stitch city/building/placement/NPC/dialogue/condition data.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-placement-resolver-convergence.boundary-baseline-reconcile` | `done` | `Inventoried city/building placement/runtime seams and selected a bounded shared resolver API over existing runtime families as the smallest implementation slice.` | `none` | `Production code was not changed during baseline.` |
| `task.script-editor-city-building-placement-resolver-convergence.resolver-contract-implementation` | `active` | `Implement the placement/resolver contract slice selected by baseline reconciliation.` | `task.script-editor-city-building-placement-resolver-convergence.boundary-baseline-reconcile` | `Use test-first coverage for resolved placements, view data, access, and NPC summaries.` |
| `task.script-editor-city-building-placement-resolver-convergence.queue-closeout-and-handoff` | `queued` | `Verify, classify residue, and return control to version review.` | `task.script-editor-city-building-placement-resolver-convergence.resolver-contract-implementation` | `Not started.` |

### Task Definitions

#### `task.script-editor-city-building-placement-resolver-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-placement-resolver-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/city.ts`
  - `src/domain/city-entry.ts`
  - `src/domain/house.ts`
  - `src/application/script-editor`
  - `src/application/city`
  - `src/application/city-npcs`
  - `src/application/house-access`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-placement-resolver-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md`
  - `docs/blueprints/queues/script-editor-city-building-entry-and-npc-authoring-priority-queue.md`
  - `docs/blueprints/queues/script-editor-city-building-structure-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/city.ts`
  - `src/domain/city-entry.ts`
  - `src/domain/house.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/city`
  - `src/application/city-npcs`
  - `src/application/house-access`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `dialogue/story progression runtime handoff`
  - `playable/minigame bindings`
  - `scenario launch policy`
  - `main.ts house-specific business branches`
- done_when:
  - `Current reusable building records, city-local entry/placement records, runtime house/cityEntry/cityNpcPool/access/refusal consumers, and UI/runtime lookup seams are inventoried.`
  - `The exact mismatch between reusable building definition data and city-local placement or resolver ownership is recorded.`
  - `The smallest lawful placement/resolver implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, schema rules, resolver API shape, import/export behavior, runtime consumers, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "CityEntryDefinition|cityEntries|cityNpcPools|HouseAccessRefusalRule|resolve|resolver|houseId|buildingId|cityId|entryBinding|dialogue|refusal|access" src/domain src/application tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if dialogue/story, condition, or scenario launch policy must precede the selected resolver slice.`
- promote_next_if_done: `task.script-editor-city-building-placement-resolver-convergence.resolver-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the first placement/resolver slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest resolver boundary for city-local placements after building records became runtime-house-compatible.`
- task_outcome_summary:
  - `Done. Existing authoring and runtime records still lack a durable placement entity: ScriptEditorBuildingRecord owns runtime HouseDefinition fields and cityId, cityEntries point from cityId to targetHouseId, cityNpcPools are city-wide resident pools, and houseAccessRefusalRules target houses/modules. Runtime consumers manually stitch this data: city/house transitions pass HouseDefinition directly to selectHouseEntryAccess, city NPC selection filters city pools by houseDefinition.activityLocationId, and ActiveGameContent indexes the families independently. The smallest lawful slice is to introduce a shared city-building placement resolver over the existing runtime families, using cityEntry.id as the current placement id and resolving house, city entry, access result, and NPC summaries through one API. Persistent placement schema migration, placement label/description overrides, entryBindingOverride, dialogue inheritance, and textEntry-backed refusal ids remain residue for later slices after this resolver seam exists.`
- Purpose:
  - `Prevent runtime and preview flows from manually stitching city/building/NPC/access/dialogue data from separate runtime families.`
- Failure mode:
  - `Reusable building definitions and city-local placement state keep drifting, making imported/exported packs work only through scattered lookup logic.`

##### Progress Log

- `2026-07-15`: `Queue admitted from version promotion review after city/building structure convergence closed and routed city-local placement ids, entry ownership, override layering, and centralized resolver seams as residue.`
- `2026-07-15`: `Baseline inspected the successor draft placement rules, current target spec, previous city/building priority and structure queues, script-editor project/domain records, city-building authoring defaults, runtime import/export/materializer behavior, city NPC pool helpers, story-stage house access, city-house transition coordination, ActiveGameContent indexing, and current robustness tests.`
- `2026-07-15`: `Inventory: reusable building data is currently represented by HouseDefinition-compatible building records; city-local entry data is represented by CityEntryDefinition records keyed by id and targetHouseId; NPC assignment exists as character/person houseId plus cityNpcPool residents and runtime location; access/refusal is evaluated from HouseDefinition plus HouseAccessRefusalRule arrays; no placement object currently owns overrides or resolver output.`
- `2026-07-15`: `Mismatch: runtime and preview seams still receive separate house/cityEntry/cityNpcPool/refusal families and stitch them by houseId, cityId, and activityLocationId. This makes cityEntry.id the only stable current placement id, but no shared resolver owns that relationship or can fail closed when references are missing.`
- `2026-07-15`: `Selected smallest lawful slice: create a shared city-building placement resolver module that derives placements from existing cityEntries and houses, exposes resolveCityBuildingPlacements, resolveCityBuildingView, canEnterCityBuilding, and resolveCityBuildingNpcs for the covered runtime/preview data, and fails closed for missing city entries or houses. Do not migrate persistent schema or implement overrides/dialogue inheritance in this task.`
- `2026-07-15`: `Implementation plan for the next task: write failing robustness tests for placement list resolution by cityId, view resolution with placementId=cityEntry.id, access denial using existing houseAccessRefusalRules, NPC summaries using existing cityNpcPools/runtime state, and missing targetHouseId fail-closed behavior; then add src/application/city/city-building-placement-resolver.ts and keep existing materializer/import/export shapes unchanged. Verification must include npm run typecheck, npm test, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check.`

#### `task.script-editor-city-building-placement-resolver-convergence.resolver-contract-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-placement-resolver-convergence.resolver-contract-implementation`
- state: `active`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `unbounded dialogue/story progression runtime handoff`
  - `playable/minigame bindings`
  - `scenario launch policy`
  - `main.ts house-specific business branches`
- done_when:
  - `The selected placement/resolver convergence slice is implemented.`
  - `Tests cover import/export preservation, resolver output for the selected runtime/preview consumers, and fail-closed behavior for unsupported or missing references.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into unrelated runtime handoff work.`
- promote_next_if_done: `task.script-editor-city-building-placement-resolver-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires another prerequisite queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected city/building placement resolver slice.`
- task_outcome_summary:
  - `Active. Baseline selected a bounded resolver API over existing runtime families.`
- Purpose:
  - `Make covered city/building placement lookups runtime-consumable through one governed seam.`
- Failure mode:
  - `A resolver-shaped API exists but runtime consumers still bypass it with manual family stitching.`

##### Progress Log

- `2026-07-15`: `Queued behind boundary-baseline-reconcile.`
- `2026-07-15`: `Activated after baseline selected a shared resolver seam over existing cityEntries/houses/cityNpcPools/houseAccessRefusalRules as the smallest lawful implementation slice.`

#### `task.script-editor-city-building-placement-resolver-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-placement-resolver-convergence.queue-closeout-and-handoff`
- state: `queued`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-placement-resolver-convergence-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `Current queue, version plan, Blueprint, project-progress, and residue truth.`
- must_not_change:
  - `version closeout without explicit human confirmation`
  - `new queue admission without routing truth`
- done_when:
  - `Verification, residue classification, next-step sync, and repository sync truth are recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without marking the queue done.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Placement/resolver acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the placement resolver convergence queue after verified implementation.`
- task_outcome_summary:
  - `Not started.`
- Purpose:
  - `Keep resolver convergence explicit before broader dialogue/story, scenario launch, or final validation queues continue.`
- Failure mode:
  - `Closing without resolver evidence would leave city/building runtime views dependent on scattered lookup behavior.`

##### Progress Log

- `2026-07-15`: `Queued behind resolver-contract-implementation.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-city-building-structure-convergence.queue-closeout-and-handoff`
- Recorded handoff at activation:
  - `City/building structure convergence closed after building records became runtime-house-compatible, but city-local placement ids, override layering, centralized resolver seams, and city-entry ownership remained outside that slice.`
- Recorded expected output:
  - `A bounded placement/resolver implementation path or an explicit prerequisite routing decision.`
