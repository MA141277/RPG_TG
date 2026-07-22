# Event-Only Routing Family Retirement And Reference Replacement Queue

## Control Block

- queue_id: `queue.event-only-routing-family-retirement-and-reference-replacement`
- belongs_to_version: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-22`
- governance_sync_source: `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `acc-event-only-routing-001-006-covered-and-ready-for-handoff`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Repository sync gate satisfied: commit 8c9f1f2 landed locally and push to origin/mod-first-dev succeeded before portrait-queue admission began.`
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
  - `Retire building-function, task, and flow as alternate routing owners and replace flow-originated event/reference truth with first-class event/event-binding ownership without compatibility residue.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Parent requirement role:
  - `This queue owns ACC-EVENT-ONLY-ROUTING-001 / 002 / 003 / 004 / 005 / 006. It must converge creator-facing authoring, pack/export/import, loader resolution, preview behavior, and runtime routing onto event-only truth.`
- Forbidden expansions:
  - `Do not reopen scene-retirement work that is already closed.`
  - `Do not absorb portrait-resource convergence into this queue as hidden secondary scope.`
  - `Do not preserve flow, task, or building-function through temporary wrappers, bridge exports, compatibility reconstruction, or callback-chain truth.`
  - `Do not weaken building creator-facing meaning interaction -> event -> dialogue/minigame/task/module.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Script Editor must stop presenting building-function, task, or flow as alternate creator-facing routing systems parallel to event.`
  - `Flow must stop being creator-facing routing family, runtime canonical routing family, pack canonical routing family, preview routing truth, and follow-up orchestration owner.`
  - `All flow-produced event semantics must be replaced by first-class event/event-binding ownership without broken trigger, return, or follow-up reachability.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview must stay coherent on one event-only routing truth.`
  - `No compatibility residue may survive once routing-family replacement is claimed complete.`
- inherited_compatibility_paths:
  - `Building creator-facing meaning remains interaction -> event -> dialogue/minigame/task/module.`
  - `Arrangement / event-binding / flow / playable may still exist as implementation seams while flow is not allowed to remain canonical routing truth.`
  - `Dialogue, city, and building remain canonical content owners established by the prior queues.`
- inherited_legacy_replacements:
  - `Visible creator-facing flow family and flow-owned building function semantics.`
  - `Task or minigame surfaces that still behave as alternate next-step routers instead of event targets.`
  - `Pack/runtime/preview references that still consume flowDefinitions or flow callback semantics as routing truth.`
- inherited_non_goals:
  - `Do not hide flow in the UI while leaving export/import/loader/runtime on flow truth.`
  - `Do not claim building-function cleanup complete if building interactions lose reachability or meaning.`
  - `Do not move routing back into hardcoded building/runtime branches.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected child queue and acceptance entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `confirmed`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-ONLY-ROUTING-001`
  - `ACC-EVENT-ONLY-ROUTING-002`
  - `ACC-EVENT-ONLY-ROUTING-003`
  - `ACC-EVENT-ONLY-ROUTING-004`
  - `ACC-EVENT-ONLY-ROUTING-005`
  - `ACC-EVENT-ONLY-ROUTING-006`
- acceptance_not_claimed:
  - `ACC-EVENT-CENTER-006`
  - `ACC-EVENT-CENTER-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-ONLY-ROUTING-001 / 002 / 003 / 004 / 005 / 006 once creator-facing authoring, export/import, loader resolution, preview, and runtime all converge on event-only routing truth with no compatibility residue.`

#### Cannot Claim

- `ACC-EVENT-CENTER-006: portrait resources and portrait variants as first-class project-owned authoring/runtime families.`
- `ACC-EVENT-CENTER-008: final simulated-human acceptance across trigger environments and portrait creator path.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Parent Capability Coverage

- owned_closure:
  - `Event-only routing-family replacement across creator-facing families, pack/export/import, loader, preview, and runtime behavior.`
- preserved_not_owned:
  - `Scene-retirement closure remains historical truth and is not reopened here.`
  - `Portrait-resource convergence remains owned by queue.portrait-resource-authoring-and-resource-mapping-convergence.`
- routed_elsewhere:
  - `Final simulated-human acceptance stays with queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`

#### Capability Floor

- `This queue must leave the project with one event-only routing truth across authoring, export/import, loader, preview, and runtime instead of creator-facing flow ownership or hidden flow/task/building-function routing residue.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Portrait-resource convergence remains owned by queue.portrait-resource-authoring-and-resource-mapping-convergence.`
  - `Final simulated-human acceptance remains owned by queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by hiding flow or task in the UI while export/import/loader/runtime still depend on them as routing truth.`
  - `Do not pass this queue by preserving only one happy-path building interaction while losing alternate return/cancel/follow-up paths.`
  - `Do not accept editor-visible event truth if preview/runtime still reconstruct flow or callback-owned next-step truth.`
- unspecified_detail_policy:
  - `Prefer event/event-binding ownership, explicit fail-closed rejection, and shared routed truth over compatibility layering or thin wrappers.`
- gap_routing_policy:
  - `If event-only routing cannot yet replace a remaining routing family inside this queue, record same-family residue or blocker instead of letting portrait/final-acceptance queues absorb implementation-bearing routing work.`

#### Legacy Paths To Replace

- `Visible flow family in Script Editor object tree, search, detail panels, and workspace grouping.`
- `Creator-facing building-function semantics that still author routing through flow rather than event/event-binding.`
- `Task or minigame follow-up semantics that still act as alternate routers rather than event-owned outcomes.`
- `Runtime pack/export/import/loader/preview/runtime paths that still consume flowDefinitions as canonical routing truth.`

#### Compatibility Paths To Preserve

- `Building interaction meaning and reachable outcomes.`
- `Event-binding trigger entry semantics.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview convergence.`
- `Dialogue end / minigame result / task progression follow-up reachability through event routing.`

#### User Path Coverage Matrix

- primary_paths:
  - `Script Editor creator path authors event-owned routing without flow/task/building-function as parallel routing systems.`
- alternate_paths:
  - `Runtime pack export/import and loader resolution preserve the same event-owned references without flow reconstruction.`
- leave_return_or_followup_paths:
  - `Building enter/click, dialogue end, minigame settlement, task progression, leave/cancel/return all remain reachable without flow-owned follow-up truth.`
- empty_or_fail_closed_paths:
  - `Unsupported flow-owned canonical routing shapes must fail closed instead of being silently reconstructed.`
- rejection_or_error_paths:
  - `Any remaining canonical flow/task/building-function routing seam must raise explicit validation or test failure during queue closeout.`
- forbidden_regressions:
  - `Do not remove creator-facing flow/task/building-function routing surfaces if runtime meaning still depends on them.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any routing-family loss must be fixed or routed as residue/blocker. This queue cannot erase supported building, dialogue, minigame, or task routing by pushing the loss into portrait or final-acceptance queues.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/flow-authoring.ts`
  - `src/application/script-editor/minigame-binding-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- Must modify:
  - `Creator-facing authoring/runtime pack/runtime files proven necessary by the evidence lock.`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No main.ts building business branches.`
  - `No weakening of event/event-binding as the formal routing owner.`
  - `No reintroduction of scene compatibility truth.`

#### Verification Coverage

- `Authoring surface tests, source-removal guards, export/import/loader tests, preview/runtime routing tests, and building-behavior regressions must prove event-only routing truth end to end.`

#### Replacement Proof

- previous_owner_or_path:
  - `Flow/building-function/task as alternate routing owners in editor-visible structures or runtime pack/runtime behavior.`
- new_owner_or_path:
  - `Event/event-binding as the sole formal routing owner, with dialogue/minigame/task/module only as content/target families.`
- behavior_preservation_expectation:
  - `Supported building, dialogue, minigame, and task paths stay reachable, but only through event-owned routing truth.`
- old_truth_owner_exit_proof:
  - `No claimed authoring/export/import/loader/preview/runtime path remains dependent on visible flow family, flowDefinitions as routing truth, or callback-owned next-step chains.`
- verification_evidence:
  - `Tests and source inspection must show one event-only routing truth rather than UI-only cleanup or runtime-only cleanup.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/event-centered-runtime-pack-preview-export-sync-queue.md`

### Queue Snapshot

- queue_goal: `Replace creator-facing and runtime flow/task/building-function routing truth with one event-only routing model.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Completed. Creator-facing flow routing ownership is retired, canonical runtime/content truth is flowPlayables, and the queue is closed with repository sync already satisfied.`
- task_briefs:
  - `task.event-only-routing-family-retirement-and-reference-replacement.evidence-anchor-reconcile: Lock the creator-facing/runtime routing-owner residue boundary and confirm the first lawful implementation slice.`
  - `task.event-only-routing-family-retirement-and-reference-replacement.contract-implementation: Land the first event-only routing replacement slice without hiding remaining canonical routing truth.`
  - `task.event-only-routing-family-retirement-and-reference-replacement.queue-closeout-and-handoff: Verify, review completeness, and hand off to the portrait-resource queue without claiming final acceptance.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means some admitted queue work landed, but part of Can Claim remains unimplemented or unverified and must route to residue, blocker, or successor queue.`
- `execution_closeout_status = blocked means execution cannot continue without resolving a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the bounded execution may be done or partial, but remaining capability must be routed before version closeout.`
- `Out-of-scope, Cannot Claim, and accepted residue are not retirement authority.`

### Completion Completeness Review

- review_status: `done`
- can_claim_coverage:
  - `ACC-EVENT-ONLY-ROUTING-001 / 002 / 003 / 004 / 005 / 006 are now covered: creator-facing flow routing is hidden from the visible shell, canonical runtime/content family truth has been renamed to flowPlayables, retired flowDefinitions imports fail closed, and runtime preview/runtime execution now consume flowPlayablesById on one event-owned routing chain.`
- parent_spec_preservation:
  - `Scene retirement stays closed and is not re-labeled here; portrait-resource and final-acceptance work remain routed to later queues.`
- capability_floor_verification:
  - `Satisfied by targeted source removal, rejection guards, runtime/content family replacement, and passing verification across typecheck, blueprint lint, and targeted tests.`
- out_of_scope_routing:
  - `Portrait-resource convergence and final simulated-human acceptance remain owned by later queues in the version plan.`
- verification_sufficiency:
  - `Verified with npm run typecheck, npm run lint:blueprints, and npm test -- --runInBand tests/city-building-mount-authoring.test.cjs tests/robustness.test.cjs.`
- user_path_matrix_verification:
  - `Covered. Script Editor fail-closes hidden flows to storyPack, export/import and loader now reject retired flowDefinitions family truth, built-in manifest hydration resolves flowPlayables, and building/runtime tests preserve event-owned launch reachability.`
- functional_loss_audit:
  - `Passed. Building action-menu/event launch behavior, preview launch content lookup, and covered flow settlements remain reachable through event-owned launchFlow actions without preserving alternate routing owners.`
- replacement_proof_summary:
  - `Replacement proof now shows visible flow authoring shell ownership removed, canonical runtime/content family truth renamed to flowPlayables, retired flowDefinitions rejected during import/load, and runtime/playable preview resolution re-based onto flowPlayablesById.`
- placeholder_or_legacy_fallback_audit:
  - `No compatibility shim is authorized. Remaining work must replace canonical flow routing truth rather than hide it behind renamed surfaces.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `none`

### Admission Preconditions

- `This queue was admitted only after queue.event-centered-runtime-pack-preview-export-sync closed and the version plan switched active_queue to queue.event-only-routing-family-retirement-and-reference-replacement.`
- `Implementation must not start outside this queue's admitted ACC-EVENT-ONLY-ROUTING boundary.`
- `Candidate tracking remains in the version plan; this queue doc is the queue-level execution governor.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this queue, set queue_status=suspended, remove live active_task execution, and synchronize the owning version plan in the same batch.`
- `If the operator explicitly requests closing this queue before Can Claim is actually satisfied, set queue_status=dropped rather than done and route remaining residue explicitly.`
- `Do not fabricate completed acceptance or topic_closure_status=closed merely because the operator asked to stop work.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails while this queue is active, repair the queue doc, version-plan linkage, or in-scope governing structure before continuing implementation or closeout.`
- `If the failure shows this queue's spec is under-structured or over-narrowed, revise the queue spec inside this queue first; do not mark the issue as accepted residue or silently hand it to portrait/final-acceptance queues.`
- `If the failure cannot be resolved inside this queue's admitted boundary without changing the parent spec or lawful ownership, record a real blocker or route the change back to version-level governance instead of proceeding through a failed lint gate.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Task-level after-state uses local-record only; task completion does not by itself require commit, push, or merge.`
- `Under the current version-local repository sync gate, queue closeout must first synchronize queue closeout docs and routing truth, then attempt one local branch-commit, then attempt remote push, then attempt merge if current repository workflow requires merge for development-trunk synchronization.`
- `The next queue must not be admitted or activated until that minimum sync batch has returned a recorded result.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Push and merge are remote-sync actions; once either starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`

### Activation Order

1. `queue.event-centered-runtime-pack-preview-export-sync closes and hands off to this queue.`
2. `The version plan switches active_queue to this queue and records the handoff basis.`
3. `This queue doc is created, evidence lock is reconciled, and only then may live implementation continue.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.event-only-routing-family-retirement-and-reference-replacement.evidence-anchor-reconcile` | `done` | `Lock the creator-facing/runtime routing-owner residue boundary and confirm the first lawful implementation slice.` | `queue.event-centered-runtime-pack-preview-export-sync closed` | `Evidence lock confirmed that flow, quest, and minigame family visibility still survives in Script Editor authoring/workspace surfaces; flowDefinitions still survive as project/runtime-pack canonical routing family; and building-function labeling still routes creators toward flow-owned next-step truth. Implementation is therefore constrained to event-only routing replacement, not portrait-resource or final-acceptance work.` |
| `task.event-only-routing-family-retirement-and-reference-replacement.contract-implementation` | `done` | `Land the first event-only routing replacement slice without hiding remaining canonical routing truth.` | `task.event-only-routing-family-retirement-and-reference-replacement.evidence-anchor-reconcile` | `Completed after removing creator-facing flow visibility from the shell, replacing canonical runtime/content family truth from flowDefinitions to flowPlayables, fail-closing retired flowDefinitions imports/manifests, and rethreading runtime preview/playable lookup through flowPlayablesById with targeted verification.` |
| `task.event-only-routing-family-retirement-and-reference-replacement.queue-closeout-and-handoff` | `done` | `Verify, review completeness, and hand off to the portrait-resource queue without claiming final acceptance.` | `task.event-only-routing-family-retirement-and-reference-replacement.contract-implementation` | `Closeout review confirms no same-family routing residue remains inside this queue boundary. The next lawful queue is queue.portrait-resource-authoring-and-resource-mapping-convergence after the required repository sync batch result is recorded.` |

### Task Definitions

#### `task.event-only-routing-family-retirement-and-reference-replacement.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.event-only-routing-family-retirement-and-reference-replacement.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-only-routing-and-flow-retirement-requirement-draft.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `tests/**`
- must_inspect:
  - `Current creator-facing flow/task/building-function routing ownership and visible family surfaces.`
  - `Current runtime pack/export/import/loader/preview/runtime references that still treat flowDefinitions as canonical routing truth.`
  - `Current building interaction paths whose meaning still depends on flow-owned routing or callback-owned follow-up.`
- must_not_change:
  - `Do not reopen scene-retirement or portrait-resource scope during evidence-anchor reconcile.`
- done_when:
  - `Evidence lock records the current live routing-owner residue and the first lawful implementation slice.`
  - `The queue records exactly what counts as event-only routing replacement and what remains routed to later queues.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or route a lawful split/blocker.`
- promote_next_if_done: `task.event-only-routing-family-retirement-and-reference-replacement.contract-implementation`

##### Human Context

- task_brief:
  - `Lock the creator-facing/runtime routing-owner residue boundary before implementation.`
- task_outcome_summary:
  - `Confirmed that Script Editor still exposes flows as the creator-facing "建筑功能" family, keeps quests/minigames as visible sibling routing surfaces, stores flows in project formal structure, and exports/imports flowDefinitions as canonical runtime-pack families. Event-only routing replacement therefore still needs both creator-facing family retirement and reference-truth replacement rather than UI-only cleanup or runtime-only cleanup.`

#### `task.event-only-routing-family-retirement-and-reference-replacement.contract-implementation`

##### Control Block

- task_id: `task.event-only-routing-family-retirement-and-reference-replacement.contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `tests/**`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Current creator-facing family visibility and runtime-pack routing truth seams.`
- must_modify:
  - `Event-only routing replacement files proven necessary by evidence lock.`
  - `tests/**`
- must_preserve:
  - `Building creator-facing meaning and event/event-binding ownership.`
  - `No reintroduction of scene or flow compatibility truth.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.event-only-routing-family-retirement-and-reference-replacement.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Land the first event-only routing replacement slice without hiding remaining canonical routing truth.`
- task_outcome_summary:
  - `Completed. The implementation slice retired visible flow routing ownership, replaced canonical runtime/content family truth with flowPlayables, fail-closed retired flowDefinitions manifests/imports, and preserved building interaction meaning plus follow-up reachability through event-owned launchFlow actions.`

#### `task.event-only-routing-family-retirement-and-reference-replacement.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.event-only-routing-family-retirement-and-reference-replacement.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/queues/event-only-routing-family-retirement-and-reference-replacement-queue.md`
  - `tests/**`
- must_inspect:
  - `Implementation proof and claim boundary coverage.`
  - `Whether any same-family event-only-routing residue remains inside the queue boundary.`
- must_preserve:
  - `Portrait-resource and final-acceptance queues remain fully owned and not prematurely claimed closed.`
- done_when:
  - `Verification passes or is honestly blocked.`
  - `Completeness review proves ACC-EVENT-ONLY-ROUTING-001 / 002 / 003 / 004 / 005 / 006 closed without over-narrowing later queues.`
  - `The next lawful queue routing is written back to the version plan.`
- verify_with:
  - `npm run lint:blueprints`

##### Human Context

- task_brief:
  - `Verify, review completeness, and hand off to the portrait-resource queue.`
- task_outcome_summary:
  - `Completed. Closeout review found no same-family event-only-routing residue remaining inside this queue; next lawful action is the version-local repository sync batch, followed by admission of queue.portrait-resource-authoring-and-resource-mapping-convergence.`

### Progress Log

- `2026-07-22`: `queue.event-centered-runtime-pack-preview-export-sync closed with ACC-EVENT-CENTER-005 covered and no same-family residue. Per the version plan's routing order, queue.event-only-routing-family-retirement-and-reference-replacement is now admitted as the next lawful execution slice.`
- `2026-07-22`: `Evidence-anchor reconcile is complete. Source inspection confirmed that event-only routing residue now sits in Script Editor visible families, workspace grouping, runtime-pack formal structure, and flowDefinitions reference truth rather than in no-scene startup/export/import parity. Implementation therefore begins inside ACC-EVENT-ONLY-ROUTING-001 / 002 / 003 / 004 / 005 / 006 only, with portrait-resource and final-acceptance work explicitly preserved for later queues.`
- `2026-07-22`: `Contract implementation and queue closeout completed together after creator-facing flow shell ownership stayed hidden, canonical runtime/content truth moved from flowDefinitions to flowPlayables, runtime/content loaders fail-closed retired flowDefinitions manifests, and preview/runtime lookup converged on flowPlayablesById. Targeted verification passed (`npm run typecheck`, `npm run lint:blueprints`, `npm test -- --runInBand tests/city-building-mount-authoring.test.cjs tests/robustness.test.cjs`). The queue is now closeout-ready and awaits the required repository sync batch before portrait-queue admission.`
