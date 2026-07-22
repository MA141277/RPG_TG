# Script Editor Building Arrangement Authoring UX Queue

## Control Block

- queue_id: `queue.script-editor-building-arrangement-authoring-ux`
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
- closure_basis: `Script Editor city details now expose project.buildingArrangements-backed Building Arrangement authoring, mounted NPC/primary NPC controls, and generic container controls for every supported container type. Empty data remains valid without fallback rows; browser gap-fill fixed invalid default empty arrangement/container fields.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.runtime-building-shell-and-container-rendering`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout recorded locally after npm run typecheck, npm run lint:blueprints, npm test, focused arrangement tests, and browser gap-fill proof; no commit or push attempted because the worktree contains pre-existing unrelated dirty files.`
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
  - `Expose Building Arrangement authoring in the Script Editor so a city can arrange concrete building instances, mounted NPCs, primary NPCs, and generic containers with no empty-data display and no old-data inference.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements the Script Editor UX slice for ACC-BUILDING-FLOW-003. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not implement generic runtime building shell rendering in this queue.`
  - `Do not wire container item actions to EventBindingRuntime in this queue.`
  - `Do not implement flow playable runtime or flow authoring UX in this queue.`
  - `Do not migrate the Zhu Yuanzhang pack in this queue.`
  - `Do not delete legacy house modules in this queue.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `City-local buildingArrangements are the canonical concrete building instance structure.`
  - `Generic containers describe runtime building panels, including character seats and action menus.`
  - `Missing mounted NPCs or containers means no corresponding UI, not a crash or old-data inference.`
- inherited_compatibility_paths:
  - `Current city/building editor navigation remains available while authoring moves to buildingArrangements.`
  - `Existing city/building runtime paths remain until downstream cutover queues replace them.`
- inherited_legacy_replacements:
  - `Old mounted building UI that cannot author containers/functions.`
  - `city.mountedBuildings as the future canonical Script Editor authoring surface for building rosters.`
- inherited_non_goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer new arrangements from houses.characterIds, defaultCharacterId, cityEntries, cityNpcPools, or city.mountedBuildings.`
  - `Do not create one runtime branch per new building type.`
  - `Do not constrain future custom minigames with a new broad permissions/security layer in this version.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence matrix entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-003`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-001`
  - `ACC-BUILDING-FLOW-002`
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

- `ACC-BUILDING-FLOW-003: Generic containers support at least character-seats, action-menu, status-panel, text-panel, image-panel, and resource-panel entry points without hardcoding business-specific house UI.`

#### Cannot Claim

- `Runtime building shell rendering, activeBuilding persistence, and enter/exit rule execution.`
- `Container item action runtime dispatch through EventBindingRuntime.`
- `flow playable runtime/presenter or Script Editor flow authoring.`
- `Built-in Zhu Yuanzhang pack migration.`
- `Legacy house runtime retirement.`
- `Final end-to-end acceptance or version closeout.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `Creators must still be able to author city-local building arrangements, containers, NPC placements, and empty-data-safe arrangement editing without falling back to legacy house authoring surfaces.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Runtime building shell remains owned by queue.runtime-building-shell-and-container-rendering.`
  - `Container event integration remains owned by queue.building-container-event-trigger-integration.`
  - `flow runtime remains owned by queue.flow-playable-runtime-and-presenter.`
  - `flow authoring UX remains owned by queue.script-editor-flow-playable-authoring-ux.`
  - `Built-in pack migration remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `Legacy removal remains owned by queue.legacy-house-runtime-retirement.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by only renaming mountedBuildings.`
  - `Do not implement only character seats while omitting action-menu, status-panel, text-panel, image-panel, and resource-panel entry points.`
  - `Do not treat missing runtime/event/flow work as unsupported.`
- unspecified_detail_policy:
  - `Fill editor helper naming, default row values, selection filters, and validation details as much as the parent spec reasonably allows, without drifting into runtime implementation.`
- gap_routing_policy:
  - `If a required Script Editor authoring capability cannot be completed here, record it as residue, prerequisite, blocker, or successor candidate rather than erasing it from the total spec.`

#### Legacy Paths To Replace

- `City mounted building/NPC panel as the primary authoring surface for future building instance rosters.`
- `UI labels/actions that imply buildings only mount people and cannot mount generic containers/functions.`
- `Any Script Editor building arrangement authoring that reads old runtime families as source truth.`

#### Compatibility Paths To Preserve

- `Existing city/building editor selection and record editing remains accessible.`
- `Existing project save/load keeps explicit buildingArrangements data.`
- `Existing runtime export/import paths remain untouched until downstream queues cut over.`

#### User Path Coverage Matrix

- primary_paths:
  - `Script Editor path: open a city, create or edit building arrangements, edit containers, and save the project without touching legacy house structures.`
- alternate_paths:
  - `Load-existing-project path: projects with empty or partial arrangement data still render an editable arrangement surface instead of crashing or hiding the owner surface.`
- empty_or_fail_closed_paths:
  - `Missing arrangement data shows an intentional empty/default authoring state rather than synthetic house content.`
- forbidden_regressions:
  - `Do not preserve authoring reachability only through old mountedBuildings or house module UI.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any missing authoring control must be repaired, routed, or explicitly blocked; it cannot be treated as acceptable because the runtime path still exists.`

#### Implementation Anchors

- Must inspect:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
  - `docs/blueprints/queues/building-arrangement-canonical-schema-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `No old-data inference into buildingArrangements.`
  - `No runtime shell/event/flow/migration/deletion work in this queue.`
  - `No compatibility fallback from old house fields or runtime families.`

#### Verification Coverage

- `Authoring helpers prove arrangements can be added/removed/updated for a city without mutating building templates directly.`
- `Authoring helpers prove mounted NPC and primary NPC selection is constrained to a selected arrangement's mountedNpcIds.`
- `Authoring helpers prove containers can be added/removed/updated for all supported container types.`
- `UI source tests prove the city module exposes Building Arrangement controls and generic container controls rather than only mounted building/NPC controls.`
- `Tests prove empty mounted NPCs or empty containers remain valid and do not generate fallback rows.`

#### Replacement Proof

- previous_owner_or_path:
  - `Legacy city/building house-oriented authoring controls and implicit mounted-building edit paths.`
- new_owner_or_path:
  - `Script Editor building arrangement/container authoring UI backed by canonical project fields.`
- behavior_preservation_expectation:
  - `Creators keep equivalent arrangement-editing reachability while legacy house-specific authoring surfaces stop owning the feature.`
- verification_evidence:
  - `Queue browser proof, loader/save/export tests, and source inspection show authoring is reachable from the dedicated arrangement surface.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`

### Queue Snapshot

- queue_goal: `Expose city-local building arrangement and generic container authoring in the Script Editor.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the queue closed after Script Editor building arrangement/container authoring implementation and verification.`
- task_briefs:
  - `task.script-editor-building-arrangement-authoring-ux.evidence-anchor-reconcile: Confirm source evidence, UI boundary, and no-over-narrowing guard before implementation.`
  - `task.script-editor-building-arrangement-authoring-ux.implementation: Add bounded authoring helpers, UI controls, and tests for building arrangements and generic containers.`
  - `task.script-editor-building-arrangement-authoring-ux.queue-closeout-and-handoff: Verify, review completeness, classify residue, and continue without version closeout.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-building-arrangement-authoring-ux.evidence-anchor-reconcile` | `done` | `Confirmed source evidence, UI boundary, and no-over-narrowing guard before implementation.` | `none` | `Schema queue is closed and current UI lacks arrangement/container authoring.` |
| `task.script-editor-building-arrangement-authoring-ux.implementation` | `done` | `Added bounded authoring helpers, UI controls, and tests for building arrangements and generic containers.` | `task.script-editor-building-arrangement-authoring-ux.evidence-anchor-reconcile` | `No runtime shell, event dispatch, flow runtime, migration, or legacy deletion work was performed.` |
| `task.script-editor-building-arrangement-authoring-ux.queue-closeout-and-handoff` | `done` | `Verified, reviewed completeness, classified residue, and continued without version closeout.` | `task.script-editor-building-arrangement-authoring-ux.implementation` | `Runtime/event/flow/migration/deletion capabilities remain routed to downstream queues.` |

### Task Definitions

#### `task.script-editor-building-arrangement-authoring-ux.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-building-arrangement-authoring-ux.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
  - `docs/blueprints/queues/building-arrangement-canonical-schema-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Must inspect, must modify, must replace, must preserve, and minimum verification are recorded.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-building-arrangement-authoring-ux.implementation`
- stop_if:
  - `implementation would require runtime shell or event/flow cutover before editor authoring can be exposed`

##### Human Context

- task_brief:
  - `Lock the editor UX evidence before implementation.`
- task_outcome_summary:
  - `Completed. Source review confirmed queue.building-arrangement-canonical-schema is closed, project.buildingArrangements schema exists, and current Script Editor city UI still exposes only the old mountedBuildings panel with no generic container authoring.`
- Purpose:
  - `Prevent the queue from becoming either a mountedBuildings rename or a hidden runtime refactor.`
- Failure mode:
  - `The queue passes by exposing only NPC rows and omitting generic container entry points.`

##### Progress Log

- `2026-07-20`: `Queue admitted after queue.building-arrangement-canonical-schema closed locally with schema/default/validation proof. Evidence review is active.`
- `2026-07-20`: `Evidence locked after inspecting parent spec, schema queue closeout, script editor project schema, city-building authoring helpers, main UI city mounted-building panel, and focused city/building tests. Implementation may proceed within editor authoring only.`

#### `task.script-editor-building-arrangement-authoring-ux.implementation`

##### Control Block

- task_id: `task.script-editor-building-arrangement-authoring-ux.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `runtime building shell`
  - `EventBindingRuntime semantics`
  - `flow playable runtime or authoring`
  - `built-in pack migration`
  - `legacy house runtime deletion`
- done_when:
  - `Script Editor exposes city-local Building Arrangement authoring backed by project.buildingArrangements.`
  - `The UI can author mounted NPCs, primary NPC, and all supported container entry types.`
  - `Empty mounted NPC/container data remains valid and displays no fallback rows.`
  - `Focused tests prove the UI is not merely the old mountedBuildings-only panel.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-building-arrangement-authoring-ux.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires runtime rendering or event dispatch to prove editor authoring.`

##### Human Context

- task_brief:
  - `Add bounded authoring helpers, UI controls, and tests for building arrangements and generic containers.`
- task_outcome_summary:
  - `Completed. Script Editor authoring helpers now update project.buildingArrangements for arrangements, mounted NPCs, primary NPCs, generic containers, and action items. The city detail UI renders Building Arrangement controls from project.buildingArrangements and no longer depends on the old mountedBuildings panel as the active city authoring surface.`
- Purpose:
  - `Give creators a city-local place to arrange concrete buildings, mounted NPCs, and generic containers before runtime cutover.`
- Failure mode:
  - `Leaving creators unable to define building menus/functions after the old house module model is retired.`

##### Progress Log

- `2026-07-20`: `Implemented project-level building arrangement authoring helpers, switched the city details panel to render Building Arrangement controls, added mounted NPC/primary NPC/container/action controls, and added focused tests proving project-level arrangement updates plus six supported container types.`
- `2026-07-20`: `One high-priority gap-fill pass was used after browser proof found invalid default empty buildingId/description/title values. Defaults now use a concrete building template, omit empty optional fields, and avoid adding action items when no event id exists.`

#### `task.script-editor-building-arrangement-authoring-ux.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-building-arrangement-authoring-ux.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-building-arrangement-authoring-ux-queue.md`
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
- done_when:
  - `The queue implementation result is verified or honestly blocked.`
  - `Completion Completeness Review is passed, gap-fill-used, residue-recorded, or blocked.`
  - `Queue closeout classifies residue and names any next same-family candidate if still required.`
  - `Version plan and project-progress pointers are synchronized to the next lawful state.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `version-review`
- stop_if:
  - `Closeout would infer full version completion without explicit version-level acceptance.`

##### Human Context

- task_brief:
  - `Close or route the Script Editor building arrangement authoring UX queue after verified implementation.`
- task_outcome_summary:
  - `Completed. Queue closed locally after automated verification and browser gap-fill proof; downstream parent capabilities remain routed without version closeout.`
- Purpose:
  - `Return control to version review or auto-continue without hiding runtime/event/flow/migration/deletion residue.`
- Failure mode:
  - `Closing this queue as if the whole building refactor were done.`

##### Progress Log

- `2026-07-20`: `Closeout completed after npm run typecheck, npm run lint:blueprints, npm test, and focused city-building mount/arrangement tests passed. Browser proof confirmed the city detail page exposes Building Arrangement and empty data does not render fallback rows; the allowed one-time gap fill fixed default arrangement/container invalid-field crashes found during browser interaction.`

### Completion Completeness Review

- review_status: `gap-fill-used`
- can_claim_coverage:
  - `ACC-BUILDING-FLOW-003 is covered for Script Editor authoring by Building Arrangement controls, mounted NPC/primary NPC controls, and generic container controls backed by project.buildingArrangements.`
  - `Supported container entry points remain generic through SCRIPT_EDITOR_BUILDING_CONTAINER_TYPES: character-seats, action-menu, status-panel, text-panel, image-panel, and resource-panel.`
- parent_spec_preservation:
  - `No parent capability was narrowed, retired, or marked unsupported; runtime shell, event dispatch, flow runtime, flow authoring, pack migration, legacy deletion, and final acceptance remain downstream responsibilities.`
  - `No old-data inference was added from houses.characterIds, houses.defaultCharacterId, cityEntries, cityNpcPools, or city.mountedBuildings into buildingArrangements.`
- out_of_scope_routing:
  - `ACC-BUILDING-FLOW-004..010 remain owned by downstream queues in the parent version plan.`
- verification_sufficiency:
  - `Passed: npm run typecheck.`
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm test.`
  - `Passed: node --test tests/city-building-mount-authoring.test.cjs --test-name-pattern "building arrangement|mounted building".`
  - `Browser proof: localhost Script Editor template city details exposed Building Arrangement with empty data showing no fallback rows; add-arrangement browser gap-fill found and fixed invalid default empty fields.`
- functional_loss_audit:
  - `Arrangement/container authoring stayed creator-reachable after the cutover; no required edit path depends on a hidden legacy surface.`
- replacement_proof_summary:
  - `The dedicated arrangement authoring surface now owns building/container editing, and verification covered empty/default data plus persisted round-trip behavior.`
- gap_fill_decision:
  - `used-once`
- gap_fill_scope:
  - `Fix invalid default arrangement/container/action data discovered by browser proof.`
- remaining_gaps:
  - `No high-priority gap remains inside this queue's bounded Script Editor arrangement/container authoring scope.`
  - `Parent-version residue remains: runtime building shell/container rendering, building container event trigger integration, flow playable runtime/presenter, flow authoring UX, built-in pack migration, legacy house runtime retirement, and final acceptance/removal guard.`
