# Building Container Event Trigger Integration Queue

## Control Block

- queue_id: `queue.building-container-event-trigger-integration`
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
- closure_basis: `Generic building action-menu items now expose dispatchable arrangement/container/item context, the application building event runtime routes those actions through EventBindingRuntime, closeBuilding runtime actions return to city state, and export preserves trigger extras while flow runtime, authoring UX, built-in migration, and legacy deletion remain downstream residue.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.flow-playable-runtime-and-presenter`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout recorded locally after focused RED/GREEN tests, npm run typecheck, npm run lint:blueprints, and npm test passed; no commit or push attempted because the worktree contains pre-existing unrelated dirty files.`
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
  - `Wire generic building action-menu container items to EventBindingRuntime trigger context and runtime event actions, including a closeBuilding action, while preserving generic building shell boundaries.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements ACC-BUILDING-FLOW-004. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not implement flow playable runtime or presenter in this queue.`
  - `Do not implement Script Editor flow authoring UX in this queue.`
  - `Do not migrate the Zhu Yuanzhang pack in this queue.`
  - `Do not delete legacy house modules in this queue.`
  - `Do not add per-building hardcoded runtime branches.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Container item actions emit buildingContainerItemAction context.`
  - `Event actions can start dialogue, effects, scenes, flow/minigame/battle playables, or closeBuilding.`
  - `EventBindingRuntime trigger discipline keeps event bodies and bindings separated.`
- inherited_compatibility_paths:
  - `Generic runtime building shell remains the entry UI for explicit buildingArrangements.`
  - `Old house runtime remains available for unmigrated content until later migration and retirement queues prove parity.`
- inherited_legacy_replacements:
  - `Hardcoded building menu actions inside concrete house modules.`
  - `Container actions that bypass EventBindingRuntime.`
- inherited_non_goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer buildingArrangements from houses.characterIds, defaultCharacterId, cityEntries, or cityNpcPools.`
  - `Do not implement building-specific runtime branches.`
  - `Do not move gameplay logic back into building runtime shell code.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence matrix entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-004`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-001`
  - `ACC-BUILDING-FLOW-002`
  - `ACC-BUILDING-FLOW-003`
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

- `ACC-BUILDING-FLOW-004: Container item actions emit buildingContainerItemAction context and event actions can start existing supported runtime destinations or closeBuilding through runtime/event seams.`

#### Cannot Claim

- `flow playable runtime/presenter.`
- `Script Editor flow authoring UX.`
- `Built-in Zhu Yuanzhang pack migration.`
- `Legacy house runtime/module/view deletion.`
- `Final end-to-end acceptance or version closeout.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `Authored building container clicks must still route into runtime-reachable event actions, including closeBuilding, instead of depending on hardcoded menu handlers.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `flow runtime remains owned by queue.flow-playable-runtime-and-presenter.`
  - `flow authoring UX remains owned by queue.script-editor-flow-playable-authoring-ux.`
  - `Built-in pack migration remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `Legacy removal remains owned by queue.legacy-house-runtime-retirement.`
  - `Final acceptance remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by adding inert buttons that do not emit runtime trigger context.`
  - `Do not bypass EventBindingRuntime with direct building-shell action handlers.`
  - `Do not treat flow or migration gaps as unsupported.`
- unspecified_detail_policy:
  - `Fill trigger payload, action request, and closeBuilding handoff details as much as the parent spec reasonably allows, without drifting into flow runtime or content migration.`
- gap_routing_policy:
  - `If a required event integration capability cannot be completed here, record it as residue, prerequisite, blocker, or successor candidate rather than erasing it from the total spec.`

#### Legacy Paths To Replace

- `Concrete house module menu actions as the only way for building UI choices to produce gameplay effects.`
- `Any building action path that requires a runtime branch per building type.`

#### Compatibility Paths To Preserve

- `Existing event runtime bindings for city/building/story triggers.`
- `Existing old house runtime behavior for unmigrated content.`
- `Existing system leave behavior for the generic building shell.`

#### User Path Coverage Matrix

- primary_paths:
  - `Runtime click path: clicking an authored building container item dispatches the matching buildingContainerItemAction event.`
- alternate_paths:
  - `Authoring/export/import path: trigger.extra data survives round-trip and still resolves at runtime.`
- empty_or_fail_closed_paths:
  - `Unbound or malformed container actions stay visibly non-runnable or fail closed instead of silently calling legacy handlers.`
- forbidden_regressions:
  - `Do not preserve action reachability only because an old house action table is still wired.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `If any authored container action cannot reach runtime through the new event path, record it as gap fill, residue, or blocker rather than treating basic click success as enough.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/event.ts`
  - `src/application/events/event-runner.ts`
  - `src/core/runtime/event-binding-runtime.ts`
  - `src/application/runtime/city-view-transition.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/domain/event.ts`
  - `src/core/runtime/event-binding-runtime.ts`
  - `src/application/runtime/city-view-transition.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `No building-specific business branches.`
  - `No flow playable runtime implementation.`
  - `No built-in pack migration or legacy house deletion.`

#### Verification Coverage

- `RED/GREEN tests prove action-menu buttons expose a dispatchable building container action id and context.`
- `RED/GREEN tests prove EventBindingRuntime can match buildingContainerItemAction triggers using building, arrangement, container, and item context.`
- `RED/GREEN tests prove closeBuilding returns to city through event/runtime action semantics rather than direct building-specific code.`
- `Source guard proves this queue does not implement flow runtime, built-in migration, or legacy house deletion.`

#### Replacement Proof

- previous_owner_or_path:
  - `House/module-specific menu action handlers and implicit close/leave logic.`
- new_owner_or_path:
  - `Generic container click -> EventBindingRuntime -> event action / closeBuilding pipeline.`
- behavior_preservation_expectation:
  - `Container actions remain runtime-reachable, data-driven, and leave-path safe without building-specific business branches in main flow code.`
- verification_evidence:
  - `Trigger.extra preservation checks, runtime dispatch tests, and closeBuilding verification prove the new path is actually wired.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- Version-local temporary execution rule:
  - `For target.building-arrangement-container-flow-refactor only, eligible candidate admission review is AI-internal and should auto-continue after recording no-over-narrowing and in-scope gap decisions unless the version plan's blocker criteria apply.`

### Queue Snapshot

- queue_goal: `Route generic building container actions through EventBindingRuntime and runtime event actions.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the queue closed after container action dispatch, EventBindingRuntime extra matching, closeBuilding action handling, export preservation, and verification.`
- task_briefs:
  - `task.building-container-event-trigger-integration.evidence-anchor-reconcile: Confirm source evidence and action trigger boundary before implementation.`
  - `task.building-container-event-trigger-integration.implementation: Add bounded EventBindingRuntime container action trigger support, closeBuilding action handling, export/import validation, and tests.`
  - `task.building-container-event-trigger-integration.queue-closeout-and-handoff: Verify, review completeness, classify residue, and continue without version closeout.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means some admitted queue work landed, but part of Can Claim remains unimplemented or unverified and must route to residue, blocker, or successor queue.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the bounded execution may be done or partial, but remaining capability must be routed before version closeout.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `Out-of-scope, Cannot Claim, and accepted residue are not retirement authority. Do not write retired/removed/unsupported unless the parent spec was updated first.`

### Completion Completeness Review

- review_status: `passed`
- can_claim_coverage:
  - `ACC-BUILDING-FLOW-004 is covered for the bounded event-trigger slice: generic building action-menu buttons expose arrangement/container/item dispatch metadata, triggerBuildingContainerItemAction builds a buildingContainerItemAction TriggerContext, EventBindingRuntime matches trigger.extra against payload, supported event scene starts work, and closeBuilding can return from building to city through event runtime actions.`
  - `Script Editor runtime export preserves building-container trigger extras instead of dropping action payload selectors.`
- parent_spec_preservation:
  - `No parent capability was narrowed, retired, or marked unsupported; flow playables, Script Editor flow authoring, built-in pack migration, legacy house deletion, and final acceptance remain downstream responsibilities.`
  - `No per-building runtime branch was added; the only main.ts addition is generic DOM dataset handoff into an application building runtime entrypoint.`
- out_of_scope_routing:
  - `ACC-BUILDING-FLOW-005 remains owned by queue.flow-playable-runtime-and-presenter.`
  - `ACC-BUILDING-FLOW-010 remains owned by queue.script-editor-flow-playable-authoring-ux.`
  - `ACC-BUILDING-FLOW-007 remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `ACC-BUILDING-FLOW-008 remains owned by queue.legacy-house-runtime-retirement.`
  - `ACC-BUILDING-FLOW-009 remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
- verification_sufficiency:
  - `Passed: focused RED/GREEN tests for building container trigger matching, closeBuilding, runtime export trigger extras, runtime entrypoint, and renderer metadata guard.`
  - `Passed: npm run typecheck.`
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm test.`
- functional_loss_audit:
  - `Container action reachability was preserved through authored event bindings; no click path was left functional only through legacy menu code.`
- replacement_proof_summary:
  - `Generic EventBindingRuntime dispatch now owns building container clicks, including closeBuilding, with export/runtime evidence covering the replacement.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `No high-priority missing item remained inside this queue after implementation verification.`
- remaining_gaps:
  - `Same-family residue: first-class flow playable runtime/presenter remains routed to queue.flow-playable-runtime-and-presenter.`
  - `Downstream residue remains for Script Editor flow authoring UX, built-in Zhu Yuanzhang migration, legacy house runtime retirement, and final acceptance/removal guard.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.building-container-event-trigger-integration.evidence-anchor-reconcile` | `done` | `Confirmed source evidence and action trigger boundary before implementation.` | `none` | `Runtime shell queue is closed, action-menu metadata exists, EventBindingRuntime lives under core/runtime, and closeBuilding can reuse city-view transition semantics.` |
| `task.building-container-event-trigger-integration.implementation` | `done` | `Added bounded EventBindingRuntime container action trigger support, closeBuilding action handling, export preservation, runtime entrypoint, renderer metadata, and tests.` | `task.building-container-event-trigger-integration.evidence-anchor-reconcile` | `No flow runtime, migration, or legacy deletion work was performed.` |
| `task.building-container-event-trigger-integration.queue-closeout-and-handoff` | `done` | `Verified, reviewed completeness, classified residue, and continued without version closeout.` | `task.building-container-event-trigger-integration.implementation` | `Flow runtime remains the next same-family queue.` |

### Task Definitions

#### `task.building-container-event-trigger-integration.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.building-container-event-trigger-integration.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
  - `docs/blueprints/queues/runtime-building-shell-and-container-rendering-queue.md`
  - `src/domain/event.ts`
  - `src/core/runtime/event-binding-runtime.ts`
  - `src/application/events/event-runner.ts`
  - `src/application/runtime/city-view-transition.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `tests/robustness.test.cjs`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Trigger payload and closeBuilding implementation anchors are confirmed or routed.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.building-container-event-trigger-integration.implementation`
- stop_if:
  - `implementation would require flow runtime, pack migration, or legacy house deletion before container event dispatch can work`

##### Human Context

- task_brief:
  - `Lock event trigger integration evidence before implementation.`
- task_outcome_summary:
  - `Completed. Source evidence confirms EventBindingRuntime already matches TriggerContext by owner/timing/action, story-runtime builds existing city/building trigger contexts, generic shell action-menu items render event ids but do not yet dispatch, and closeBuilding can be implemented through existing leave-house city-view transition semantics.`
- Purpose:
  - `Prevent container action dispatch from becoming direct building-specific gameplay code or from absorbing downstream flow runtime.`
- Failure mode:
  - `The queue passes by rendering buttons that cannot trigger EventBindingRuntime or by hardcoding one building action path.`

##### Progress Log

- `2026-07-20`: `Queue admitted automatically after runtime shell closeout under the version-local temporary execution rule. Evidence review is active.`
- `2026-07-20`: `Evidence locked. The queue will add a buildingContainerItemAction trigger context and closeBuilding event action integration without absorbing flow runtime, built-in migration, or legacy deletion.`
- `2026-07-20`: `Implementation and closeout completed after focused tests plus full verification passed; flow runtime/presenter remains the next same-family queue.`

#### `task.building-container-event-trigger-integration.implementation`

##### Control Block

- task_id: `task.building-container-event-trigger-integration.implementation`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/event.ts`
  - `src/core/runtime/event-binding-runtime.ts`
  - `src/application/events/event-runner.ts`
  - `src/application/runtime/city-view-transition.ts`
  - `src/application/building/building-module-entry.ts`
  - `src/ui/views/building/building-module-view.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `flow playable runtime or presenter`
  - `Script Editor flow authoring UX`
  - `built-in pack migration`
  - `legacy house runtime deletion`
- done_when:
  - `Action-menu container item activation can produce buildingContainerItemAction trigger context.`
  - `EventBindingRuntime can match building container action triggers without per-building branches.`
  - `Runtime event action handling supports closeBuilding and preserves existing supported event actions.`
  - `Export/import validation preserves supported binding/action data and fails closed on unsupported shape.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.building-container-event-trigger-integration.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires flow playable runtime internals to prove event dispatch.`

##### Human Context

- task_brief:
  - `Add bounded EventBindingRuntime container action trigger support, closeBuilding action handling, export/import validation, and tests.`
- task_outcome_summary:
  - `Completed. Building container item actions now carry arrangement/container/item payload into EventBindingRuntime, trigger.extra is matched against payload, closeBuilding is supported as an event runtime action, and Script Editor runtime export preserves building container trigger extras.`
- Purpose:
  - `Make creator-authored building menu actions invoke the same event runtime used by other runtime triggers.`
- Failure mode:
  - `Building container actions become another hardcoded house module layer.`

#### `task.building-container-event-trigger-integration.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.building-container-event-trigger-integration.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/building-container-event-trigger-integration-queue.md`
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
  - `Close or route the building container event trigger integration queue after verified implementation.`
- task_outcome_summary:
  - `Completed. Queue closed locally after full automated verification and downstream residue routing to the flow playable runtime/presenter queue.`
- Purpose:
  - `Return control to version review or auto-continue without hiding flow/runtime/migration/deletion residue.`
- Failure mode:
  - `Closing this queue as if the whole building refactor were done.`
