# Flow Playable Runtime And Presenter Queue

## Control Block

- queue_id: `queue.flow-playable-runtime-and-presenter`
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
- closure_basis: `Shared playable runtime now supports family=flow with a building owner integration, flow session node state, generic text/choice/complete reduction, presenter model, settlement receipt, explicit handoff, and playable shell view transition; Script Editor flow authoring, built-in migration, legacy deletion, and final acceptance remain downstream residue.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.script-editor-flow-playable-authoring-ux`
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
  - `Add the shared runtime and presenter contract needed for first-class family=flow playables, so authored building functions can run through the unified playable lifecycle instead of house-local hardcoded logic.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements ACC-BUILDING-FLOW-005. The parent spec remains the total requirement contract.`
- Playable governance classification:
  - `shared playable contract change`
- Forbidden expansions:
  - `Do not implement Script Editor flow authoring UX in this queue.`
  - `Do not migrate the Zhu Yuanzhang pack in this queue.`
  - `Do not delete legacy house modules in this queue.`
  - `Do not encode one building's function as a concrete runtime branch.`
  - `Do not add playable-specific business branches in src/main.ts.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `flow is a first-class playable family using unified launch/session/presenter/reduce/settlement/handoff.`
  - `flow supports building owner context and generic authored nodes for ordinary building functions.`
  - `Container item events can eventually start flow playables through event/runtime seams.`
- inherited_compatibility_paths:
  - `Existing minigame and battle playables must keep working while flow is introduced.`
  - `Old house runtime remains available for unmigrated content until later migration and retirement queues prove parity.`
- inherited_legacy_replacements:
  - `Hardcoded house module menu flows for ordinary building functions.`
  - `Flow-like action handling that bypasses playable runtime lifecycle and presenter seams.`
- inherited_non_goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer flow definitions from old module ids or concrete house code.`
  - `Do not implement flow authoring by hiding it inside minigame binding UI.`
  - `Do not move lifecycle ownership into building runtime shell code.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence matrix entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-005`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-001`
  - `ACC-BUILDING-FLOW-002`
  - `ACC-BUILDING-FLOW-003`
  - `ACC-BUILDING-FLOW-004`
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

- `ACC-BUILDING-FLOW-005: family=flow is represented in shared playable contracts, can launch with building owner context, creates and reduces a flow session, exposes a presenter model, and settles/hands off through unified playable runtime semantics.`

#### Cannot Claim

- `Script Editor flow authoring UX.`
- `Built-in Zhu Yuanzhang pack migration.`
- `Legacy house runtime/module/view deletion.`
- `Final end-to-end acceptance or version closeout.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `Building-hosted flow playables must still execute, settle, and hand off through the shared playable runtime without requiring building-specific presenter code.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `flow authoring UX remains owned by queue.script-editor-flow-playable-authoring-ux.`
  - `Built-in pack migration remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `Legacy removal remains owned by queue.legacy-house-runtime-retirement.`
  - `Final acceptance remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by treating flow as an alias of minigame without first-class family support.`
  - `Do not pass this queue by adding inert type definitions that cannot launch, present, reduce, or hand off.`
  - `Do not treat Script Editor authoring or built-in migration gaps as unsupported.`
- unspecified_detail_policy:
  - `Fill flow node, command, presenter, settlement, and handoff details as much as the parent spec and existing playable runtime reasonably allow, without drifting into editor UX or content migration.`
- gap_routing_policy:
  - `If a required flow runtime capability cannot be completed here, record it as residue, prerequisite, blocker, or successor candidate rather than erasing it from the total spec.`

#### Legacy Paths To Replace

- `Concrete house module action reducers as the only way to run ordinary building functions.`
- `Playable runtime branches that cannot support a data-authored flow family.`

#### Compatibility Paths To Preserve

- `Existing minigame and battle playable launches, actions, exits, sessions, and registries.`
- `Existing EventBindingRuntime trigger discipline.`
- `Existing old house runtime behavior for unmigrated content until later migration and retirement queues complete.`

#### User Path Coverage Matrix

- primary_paths:
  - `Runtime path: an event starts a family=flow playable from a building and the playable presents, settles, and returns control correctly.`
- alternate_paths:
  - `Shared-runtime path: the same flow family can be launched by non-building owners without diverging contract truth.`
- empty_or_fail_closed_paths:
  - `Unsupported flow payloads or owners fail closed rather than half-starting through ad hoc presenter branches.`
- forbidden_regressions:
  - `Do not keep flow settlement working only because old building shell state or one-off presenter shims still intercept the result.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any missing launch/presenter/settlement/handoff behavior must be repaired or routed before closeout; shared-runtime extraction cannot silently narrow supported flow semantics.`

#### Implementation Anchors

- Must inspect:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
  - `docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md`
  - `src/core/contracts/playable-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/registry/playable-definition-registry.ts`
  - `src/core/registry/playable-integration-registry.ts`
  - `src/core/registry/builtin-playable-definition-registry.ts`
  - `src/core/registry/builtin-playable-integration-registry.ts`
  - `src/application/playables/**`
  - `src/application/presenter/**`
  - `src/ui/views/**`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/core/contracts/playable-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/registry/builtin-playable-definition-registry.ts`
  - `src/core/registry/builtin-playable-integration-registry.ts`
  - `src/application/playables/**`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `No src/main.ts playable-specific business branch.`
  - `Existing minigame and battle behavior.`
  - `No Script Editor flow authoring UX, built-in migration, or legacy deletion.`

#### Verification Coverage

- `RED/GREEN tests prove PlayableFamily accepts flow without weakening existing minigame/battle coverage.`
- `RED/GREEN tests prove a flow playable can launch with building owner context through playable runtime normalization.`
- `RED/GREEN tests prove a flow session can reduce commands and expose a presenter model through shared runtime/presenter seams.`
- `RED/GREEN tests prove flow completion produces settlement/handoff data without direct building shell navigation.`
- `Source guards prove this queue does not implement Script Editor flow authoring UX, built-in migration, or legacy house deletion.`

#### Replacement Proof

- previous_owner_or_path:
  - `Prototype or building-local flow runtime/presenter behavior embedded in shell-specific code.`
- new_owner_or_path:
  - `Shared playable runtime and presenter contract for family=flow with building owner support.`
- behavior_preservation_expectation:
  - `Building-hosted flows remain fully playable while the runtime becomes reusable across owners.`
- verification_evidence:
  - `Shared runtime tests, settlement/handoff proof, and queue verification cover the launched flow path end to end.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- Version-local temporary execution rule:
  - `For target.building-arrangement-container-flow-refactor only, eligible candidate admission review is AI-internal and should auto-continue after recording no-over-narrowing and in-scope gap decisions unless the version plan's blocker criteria apply.`

### Queue Snapshot

- queue_goal: `Add shared flow playable runtime and presenter support.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the flow runtime/presenter contract closed after verification.`
- task_briefs:
  - `task.flow-playable-runtime-and-presenter.evidence-anchor-reconcile: Confirm playable runtime source evidence and flow contract boundary before implementation.`
  - `task.flow-playable-runtime-and-presenter.implementation: Add bounded flow playable runtime/presenter/settlement support and tests.`
  - `task.flow-playable-runtime-and-presenter.queue-closeout-and-handoff: Verify, review completeness, classify residue, and continue without version closeout.`

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
  - `ACC-BUILDING-FLOW-005 is covered for the shared runtime slice: family=flow is present in the playable contract, building-flow is registered with a building owner integration, flow sessions hold current node state, generic text/choice/complete nodes reduce through playable runtime commands, presenter output is structured, completion emits a PlayableSettlement with owner handoff, and launch enters the shared playable shell view.`
  - `Existing minigame and battle playable tests remain green.`
- parent_spec_preservation:
  - `No parent capability was narrowed, retired, or marked unsupported; Script Editor authoring, built-in migration, legacy deletion, and final acceptance remain downstream responsibilities.`
  - `No flow lifecycle was added to house modules or main.ts; the shared playable runtime owns launch, reduction, settlement, and handoff.`
- out_of_scope_routing:
  - `ACC-BUILDING-FLOW-010 remains owned by queue.script-editor-flow-playable-authoring-ux.`
  - `ACC-BUILDING-FLOW-007 remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `ACC-BUILDING-FLOW-008 remains owned by queue.legacy-house-runtime-retirement.`
  - `ACC-BUILDING-FLOW-009 remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
- verification_sufficiency:
  - `Passed: RED/GREEN tests for family registration, building-owner launch, flow presenter, command reduction, settlement, handoff, and view transition.`
  - `Passed: npm run typecheck.`
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm test; 686 tests passed.`
- functional_loss_audit:
  - `Flow runtime extraction did not reduce building-hosted playable behavior to a placeholder; launch, presenter, settlement, and handoff remained verified on the shared path.`
- replacement_proof_summary:
  - `The shared family=flow runtime replaced shell-local behavior while preserving building-owner execution and settlement semantics.`
- gap_fill_decision:
  - `gap-fill-used`
- gap_fill_scope:
  - `Added the shared playable-shell view transition for flow launch after completeness review found that a presenter without a runtime view handoff would leave the user in the building view. This was the only high-priority gap fill.`
- remaining_gaps:
  - `Same-family residue: Script Editor flow authoring/import/export/preview remains routed to queue.script-editor-flow-playable-authoring-ux.`
  - `Downstream residue remains for built-in Zhu Yuanzhang migration, legacy house runtime retirement, and final acceptance/removal guard.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.flow-playable-runtime-and-presenter.evidence-anchor-reconcile` | `done` | `Confirmed playable runtime source evidence and flow contract boundary before implementation.` | `none` | `Playable governance classifies this as shared-contract work; no human confirmation point under the version-local temporary execution rule.`
| `task.flow-playable-runtime-and-presenter.implementation` | `done` | `Added bounded flow playable runtime/presenter/settlement support, building owner integration, and tests.` | `task.flow-playable-runtime-and-presenter.evidence-anchor-reconcile` | `No editor UX, pack migration, or legacy deletion work was performed.`
| `task.flow-playable-runtime-and-presenter.queue-closeout-and-handoff` | `done` | `Verified, reviewed completeness, classified residue, and continued without version closeout.` | `task.flow-playable-runtime-and-presenter.implementation` | `Script Editor flow authoring remains the next same-family queue.`

### Task Definitions

#### `task.flow-playable-runtime-and-presenter.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.flow-playable-runtime-and-presenter.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
  - `docs/blueprints/queues/building-container-event-trigger-integration-queue.md`
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
  - `docs/superpowers/specs/2026-07-03-playable-naming-and-artifact-conventions.md`
  - `src/core/contracts/playable-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/registry/playable-definition-registry.ts`
  - `src/core/registry/playable-integration-registry.ts`
  - `tests/robustness.test.cjs`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Flow family, building owner context, launch/reduce/presenter/settlement/handoff anchors are confirmed or routed.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.flow-playable-runtime-and-presenter.implementation`
- stop_if:
  - `implementation would require Script Editor flow authoring UX, built-in pack migration, or legacy house deletion before shared flow runtime can work`

##### Human Context

- task_brief:
  - `Lock flow playable runtime/presenter evidence before implementation.`
- task_outcome_summary:
  - `Completed. Existing playable contracts were confirmed as minigame/battle-only before this queue; flow requires a shared family extension, building owner integration, session state, presenter model, and settlement receipt.`
- Purpose:
  - `Prevent flow from becoming another hardcoded house action path or an inert alias of minigame.`
- Failure mode:
  - `The queue passes without a first-class flow launch/session/presenter/reduce/settlement path.`

##### Progress Log

- `2026-07-20`: `Queue admitted automatically after building container event trigger integration closeout under the version-local temporary execution rule. Evidence review is active.`
- `2026-07-20`: `Evidence locked. This queue owns the shared family=flow contract/runtime/presenter slice; editor authoring, pack migration, legacy deletion, and final acceptance remain routed downstream.`

#### `task.flow-playable-runtime-and-presenter.implementation`

##### Control Block

- task_id: `task.flow-playable-runtime-and-presenter.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/core/contracts/playable-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/registry/builtin-playable-definition-registry.ts`
  - `src/core/registry/builtin-playable-integration-registry.ts`
  - `src/application/playables/**`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `Script Editor flow authoring UX`
  - `built-in Zhu Yuanzhang pack migration`
  - `legacy house runtime deletion`
  - `src/main.ts playable-specific business routing`
- done_when:
  - `PlayableFamily includes flow without breaking existing minigame/battle definitions.`
  - `A flow playable definition and integration can launch through shared playable runtime with building owner context.`
  - `Flow runtime can reduce generic flow commands and expose a presenter model.`
  - `Flow completion emits settlement/handoff through shared playable runtime semantics.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.flow-playable-runtime-and-presenter.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires editor-authored flow data UI or pack migration to prove runtime contract.`

##### Human Context

- task_brief:
  - `Add bounded flow playable runtime/presenter/settlement support and tests.`
- task_outcome_summary:
  - `Completed. Flow runtime/presenter, generic node reduction, settlement/handoff, and one high-priority shell-view gap fill landed with full verification.`
- Purpose:
  - `Give events and future migrated building functions a shared flow playable target.`
- Failure mode:
  - `Flow behavior remains house-local or cannot be launched/presented/reduced through shared runtime.`

#### `task.flow-playable-runtime-and-presenter.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.flow-playable-runtime-and-presenter.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/flow-playable-runtime-and-presenter-queue.md`
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
  - `Close or route the flow playable runtime/presenter queue after verified implementation.`
- task_outcome_summary:
  - `Completed. Queue closed locally and routed Script Editor flow authoring as the next same-family candidate without version closeout.`
- Purpose:
  - `Return control to version review or auto-continue without hiding flow authoring, migration, deletion, or final acceptance residue.`
- Failure mode:
  - `Closing this queue as if Script Editor flow authoring or migrated building content already exists.`
