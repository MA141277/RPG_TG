# Building Arrangement Canonical Schema Queue

## Control Block

- queue_id: `queue.building-arrangement-canonical-schema`
- belongs_to_version: `target.building-arrangement-container-flow-refactor`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-20`
- governance_sync_source: `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Canonical buildingArrangements schema, default project initialization, runtime-pack import initialization, loader validation, and focused robustness coverage landed without old-data inference or runtime/UI cutover. Downstream parent capabilities remain routed to later queues.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.script-editor-building-arrangement-authoring-ux`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout recorded locally after npm run typecheck, npm run lint:blueprints, and npm test passed; no commit or push attempted because the worktree contains pre-existing unrelated dirty files.`
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
  - `Define the canonical schema for behavior-free building templates and city-local building arrangements, including generic container contract names and activeBuilding persistence names, without implementing editor UX, runtime rendering, migration, or legacy deletion.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements the schema slice of the parent spec. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not build the Script Editor container authoring UI in this queue.`
  - `Do not replace runtime house rendering in this queue.`
  - `Do not migrate the Zhu Yuanzhang pack in this queue.`
  - `Do not delete legacy house modules in this queue.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Building templates become behavior-free definitions.`
  - `City-local buildingArrangements become the canonical concrete building instance structure.`
  - `Generic containers describe runtime building panels, including character seats and action menus.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview eventually consume the same building arrangement and playable contracts.`
- inherited_compatibility_paths:
  - `Current city/building entry from normal start, JSON runtime pack import, and Script Editor runtime preview must remain available until downstream cutover queues replace old runtime paths.`
  - `Text/dialogue ids remain stable content references in exported packs.`
- inherited_legacy_replacements:
  - `HouseDefinition.moduleId, characterIds, and defaultCharacterId as behavior or roster sources.`
  - `cityEntries as the canonical city building instance source.`
  - `cityNpcPools as the canonical mounted NPC source for building UI.`
- inherited_non_goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer new arrangements from houses.characterIds, defaultCharacterId, cityEntries, or cityNpcPools.`
  - `Do not create one runtime branch per new building type.`
  - `Do not constrain future custom minigames with a new broad permissions/security layer in this version.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence matrix entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-001`
  - `ACC-BUILDING-FLOW-002`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-003`
  - `ACC-BUILDING-FLOW-004`
  - `ACC-BUILDING-FLOW-005`
  - `ACC-BUILDING-FLOW-006`
  - `ACC-BUILDING-FLOW-007`
  - `ACC-BUILDING-FLOW-008`
  - `ACC-BUILDING-FLOW-009`
  - `ACC-BUILDING-FLOW-010`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-BUILDING-FLOW-001: Building templates carry only presentation/category/default-art metadata and no NPCs, module ids, menus, functions, or behavior binding.`
- `ACC-BUILDING-FLOW-002: City-local buildingArrangements own concrete city building instances, mounted NPCs, primary NPC, containers, visible/enter/exit rules, and city-local display/background values.`

#### Cannot Claim

- `ACC-BUILDING-FLOW-003: Script Editor container authoring UX.`
- `ACC-BUILDING-FLOW-004: Container item actions and event runtime integration.`
- `ACC-BUILDING-FLOW-005: flow playable runtime and presenter.`
- `ACC-BUILDING-FLOW-006: Runtime building shell and activeBuilding behavior.`
- `ACC-BUILDING-FLOW-007: Zhu Yuanzhang pack migration.`
- `ACC-BUILDING-FLOW-008: Legacy house runtime retirement.`
- `ACC-BUILDING-FLOW-009: Final end-to-end acceptance.`
- `ACC-BUILDING-FLOW-010: Script Editor flow playable authoring UX.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Script Editor building arrangement authoring UX remains owned by queue.script-editor-building-arrangement-authoring-ux.`
  - `Runtime building shell remains owned by queue.runtime-building-shell-and-container-rendering.`
  - `Container event integration remains owned by queue.building-container-event-trigger-integration.`
  - `flow runtime remains owned by queue.flow-playable-runtime-and-presenter.`
  - `flow authoring UX remains owned by queue.script-editor-flow-playable-authoring-ux.`
  - `Built-in pack migration remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `Legacy removal remains owned by queue.legacy-house-runtime-retirement.`
- forbidden_scope_shrinkage:
  - `Do not delete or declare unsupported any inherited capability merely because it is outside this queue.`
  - `Do not treat schema-only acceptance as enough to close runtime, event, flow, migration, or legacy removal requirements.`
- unspecified_detail_policy:
  - `Fill schema naming and validation details as much as the parent spec reasonably allows, without drifting into UI/runtime implementation.`
- gap_routing_policy:
  - `If a required schema capability cannot be completed here, record it as residue, prerequisite, blocker, or successor candidate rather than erasing it from the total spec.`

#### Legacy Paths To Replace

- `ScriptEditorBuildingRecord.baseAttributes.moduleId as canonical behavior binding.`
- `ScriptEditorBuildingRecord.baseAttributes.characterIds as canonical mounted NPC roster.`
- `ScriptEditorBuildingRecord.baseAttributes.defaultCharacterId as canonical mounted primary NPC.`
- `ScriptEditorCityRecord.mountedBuildings as the long-term concrete city building arrangement carrier.`

#### Compatibility Paths To Preserve

- `Existing city/building records must still typecheck during schema transition.`
- `Existing runtime export/import and startup paths must not be changed in this schema queue beyond fail-closed schema additions.`
- `Explicit mounted NPC data must remain available until the buildingArrangements cutover.`

#### Implementation Anchors

- Must inspect:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `Current save/load behavior for existing explicit mountedBuildings data unless evidence proves it invalid.`
  - `No old-data inference into new buildingArrangements.`
  - `No runtime behavior cutover before downstream queues.`

#### Verification Coverage

- `Type tests or robustness tests prove buildingArrangements is a recognized project family with fail-closed shape validation.`
- `Tests prove missing buildingArrangements defaults to an empty array for existing projects without inferring from old runtime families.`
- `Tests prove building templates no longer need behavior-bearing schema fields for new behavior-free records.`
- `Source guard proves first queue did not introduce UI/runtime/legacy-deletion claims outside ACC-BUILDING-FLOW-001..002.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`

### Queue Snapshot

- queue_goal: `Define canonical behavior-free building template and city-local building arrangement schemas with fail-closed validation boundaries.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the queue closed after bounded schema/default/validation implementation and verification.`
- task_briefs:
  - `task.building-arrangement-canonical-schema.evidence-anchor-reconcile: Confirm source evidence, schema boundary, and no-over-narrowing guard before implementation.`
  - `task.building-arrangement-canonical-schema.implementation: Add bounded schema types/defaults/loader validation and tests.`
  - `task.building-arrangement-canonical-schema.queue-closeout-and-handoff: Verify, review completeness, classify residue, and return to version review or auto-continue.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means some admitted queue work landed, but part of Can Claim remains unimplemented or unverified and must route to residue, blocker, or successor queue.`
- `execution_closeout_status = blocked means execution cannot continue without resolving a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the bounded execution may be done or partial, but remaining capability must be routed before version closeout.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Completion Completeness Review

- review_status: `passed`
- can_claim_coverage:
  - `ACC-BUILDING-FLOW-001 is covered by behavior-free building template schema support that does not require module ids, menus, functions, or NPC roster fields for new building template records.`
  - `ACC-BUILDING-FLOW-002 is covered by city-local buildingArrangements schema, loader validation/defaulting, default project initialization, and runtime-pack import initialization without old-data inference.`
- parent_spec_preservation:
  - `No parent capability was narrowed, retired, or marked unsupported; ACC-BUILDING-FLOW-003..010 remain explicit downstream queue responsibilities.`
  - `No compatibility fallback was introduced from houses.characterIds, houses.defaultCharacterId, cityEntries, cityNpcPools, or mountedBuildings into buildingArrangements.`
- out_of_scope_routing:
  - `ACC-BUILDING-FLOW-003..010 remain owned by downstream queues in the parent version plan.`
- verification_sufficiency:
  - `Passed: npm run typecheck.`
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm test.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `No high-priority gap remains inside this queue's bounded schema/default/validation scope.`
  - `Parent-version residue remains: Script Editor arrangement authoring UX, runtime shell/container rendering, container event trigger integration, flow playable runtime/presenter, flow authoring UX, built-in pack migration, legacy house runtime retirement, and final acceptance/removal guard.`

### Admission Preconditions

- `The formal target plan records this queue admission before this queue doc becomes active truth.`
- `This queue exposes queue_status=active and an active_task only after version-plan admission fields are synchronized.`
- `User scope approval alone is not the admission basis; admission is recorded in the formal target plan Control Block.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `Default Blueprint governance/documentation refinement uses local-record during execution and one branch-commit at queue closeout.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Push is optional per queue and may be batched after multiple queue commits.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis were written first.`
2. `Version-level admission review concluded before this queue became live execution truth.`
3. `This queue doc was created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its prior admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.building-arrangement-canonical-schema.evidence-anchor-reconcile` | `done` | `Confirmed source evidence, schema boundary, and no-over-narrowing guard before implementation.` | `none` | `Source evidence shows no existing buildingArrangements schema; this queue remains bounded to schema/defaults/loader validation and tests.` |
| `task.building-arrangement-canonical-schema.implementation` | `done` | `Added bounded schema types/defaults/loader validation and focused tests.` | `task.building-arrangement-canonical-schema.evidence-anchor-reconcile` | `No runtime shell, editor UX, migration, or legacy deletion work was performed.` |
| `task.building-arrangement-canonical-schema.queue-closeout-and-handoff` | `done` | `Verified, reviewed completeness, classified residue, and routed to the next same-version candidate without version closeout.` | `task.building-arrangement-canonical-schema.implementation` | `Downstream capabilities remain open under the parent version candidate ledger.` |

### Task Definitions

#### `task.building-arrangement-canonical-schema.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.building-arrangement-canonical-schema.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `version acceptance matrix`
  - `candidate evidence matrix`
  - `script editor project schema`
  - `project loader validation`
  - `default project factory`
  - `runtime export/import boundaries`
- must_not_change:
  - `Do not implement feature code before evidence_lock_status is locked.`
  - `Do not widen queue scope to close acceptance outside Can Claim.`
  - `Do not infer buildingArrangements from old houses, cityEntries, cityNpcPools, or mountedBuildings.`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Must inspect, must modify, must replace, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.building-arrangement-canonical-schema.implementation`
- stop_if:
  - `implementation_anchor_status is missing or conflicting`
  - `prerequisite_status is needs-prior-queue or split-required`

##### Human Context

- task_brief:
  - `Lock the schema evidence before implementation.`
- task_outcome_summary:
  - `Completed. Source review confirmed buildingArrangements is absent, old house-derived fields still exist, and the lawful first slice is bounded to schema/defaults/loader validation plus tests without UI/runtime/migration/deletion work.`
- Purpose:
  - `Prevent the first queue from becoming a hidden runtime or UI refactor.`
- Failure mode:
  - `The queue starts implementing from the target title rather than from schema acceptance ownership.`

##### Progress Log

- `2026-07-20`: `Evidence-anchor locked after inspecting the parent target spec, Script Editor project schema, loader validation, default project factory, city-building authoring, runtime export/import boundaries, and focused robustness tests. No prerequisite split is required for schema/default validation.`

#### `task.building-arrangement-canonical-schema.implementation`

##### Control Block

- task_id: `task.building-arrangement-canonical-schema.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Evidence lock from task.building-arrangement-canonical-schema.evidence-anchor-reconcile.`
- must_modify:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- must_replace:
  - `New schema must establish behavior-free building templates and buildingArrangements as future canonical city-local building instance data.`
- must_preserve:
  - `Existing projects and runtime export/import keep working until downstream queues cut over.`
  - `No automatic inference into buildingArrangements from old data.`
- must_not_change:
  - `Do not implement Script Editor container authoring UI.`
  - `Do not replace runtime building shell.`
  - `Do not alter EventBindingRuntime semantics.`
  - `Do not add flow runtime or flow authoring UX.`
  - `Do not migrate or delete legacy house modules.`
- done_when:
  - `Project schema defines behavior-free building template and city-local building arrangement structures.`
  - `Project loader validates buildingArrangements shape or defaults it to empty without old-data inference.`
  - `Default project factory initializes buildingArrangements as empty or explicit data.`
  - `Focused tests cover empty default, explicit valid arrangement, and invalid shape fail-closed behavior.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record execution blockers in the queue doc, not repository sync failures.`
  - `Do not silently widen scope.`
- promote_next_if_done: `task.building-arrangement-canonical-schema.queue-closeout-and-handoff`
- stop_if:
  - `Schema implementation requires runtime shell cutover or deleting legacy house code in the same queue.`

##### Human Context

- task_brief:
  - `Add bounded schema types/defaults/loader validation and tests.`
- task_outcome_summary:
  - `Completed. The project schema now recognizes behavior-free building templates and city-local buildingArrangements, initializes missing arrangements to an empty array, validates explicit arrangements fail-closed, and avoids any inference from old house/city runtime families.`
- Purpose:
  - `Give downstream authoring/runtime/migration queues a stable contract to build against.`
- Failure mode:
  - `Schema additions stay too vague or infer from old runtime data, making later no-compatibility cutover impossible.`

##### Progress Log

- `2026-07-20`: `Implemented Script Editor project schema additions for buildingArrangements, loader validation/defaulting, default project initialization, runtime-pack import initialization, and focused robustness tests for explicit valid arrangements, invalid mountedNpcIds fail-closed behavior, and no old-data inference.`

#### `task.building-arrangement-canonical-schema.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.building-arrangement-canonical-schema.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/building-arrangement-canonical-schema-queue.md`
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
- must_inspect:
  - `Implementation result from task.building-arrangement-canonical-schema.implementation.`
  - `Completion Completeness Review.`
  - `Version plan candidate queue order.`
- must_not_change:
  - `version_status without explicit version-level closeout confirmation`
  - `candidate queue ordering unrelated to this queue's residue`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Completion Completeness Review is passed, gap-fill-used, residue-recorded, or blocked.`
  - `Queue closeout classifies residue and names any next same-family candidate if still required.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
  - `Repository sync is attempted or explicitly recorded according to queue sync policy.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in Progress Log and leave the queue active or blocked according to the queue closeout judgement rule.`
- promote_next_if_done: `version-review`
- stop_if:
  - `Closeout would infer full version completion without explicit version-level acceptance.`

##### Human Context

- task_brief:
  - `Close or route the schema queue after verified implementation.`
- task_outcome_summary:
  - `Completed. The queue closed locally after required verification passed; parent-spec residue remains routed to the next candidate queues, with queue.script-editor-building-arrangement-authoring-ux remaining the next same-family candidate.`
- Purpose:
  - `Return control to version review or auto-continue without hiding parent-spec residue.`
- Failure mode:
  - `Closing the schema queue as if the whole building refactor were done.`

##### Progress Log

- `2026-07-20`: `Queue admitted as the first child queue under target.building-arrangement-container-flow-refactor. Active task is evidence-anchor-reconcile; no implementation has started.`
- `2026-07-20`: `Closeout completed after npm run typecheck, npm run lint:blueprints, and npm test passed. Completeness review found no high-priority schema gap requiring the allowed one-time gap fill; remaining UI/runtime/event/flow/migration/legacy deletion capabilities stay routed to downstream parent queues and are not treated as retired or unsupported.`
