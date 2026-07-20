# Script Editor Flow Playable Authoring UX Queue

## Control Block

- queue_id: `queue.script-editor-flow-playable-authoring-ux`
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
- closure_basis: `Script Editor now owns first-class flows[] records with generic nodes, launch payloads, outcome routes, owner context, event-start targets, project/runtime pack validation, independent flow authoring UI, and active-content preview indexing without shrinking flow capability into minigame-only binding.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.zhuyuanzhang-building-arrangement-pack-migration`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout recorded locally after focused RED/GREEN tests, the one high-priority preview content gap fill, npm run typecheck, npm run lint:blueprints, and npm test passed; no commit or push attempted because the worktree contains pre-existing unrelated dirty files.`
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
  - `Make flow a first-class Script Editor authoring family with editable definitions, nodes, launch payloads, owner context, event-start targets, outcome routes, import/export validation, and runtime preview data.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue implements ACC-BUILDING-FLOW-010. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not implement flow runtime internals in this queue.`
  - `Do not migrate the Zhu Yuanzhang pack in this queue.`
  - `Do not delete legacy house modules in this queue.`
  - `Do not treat existing minigame binding records as complete flow authoring.`
  - `Do not remove unspecified flow node or outcome capabilities by narrowing the editor model.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Script Editor can create, edit, validate, import, export, and preview first-class flow playable records.`
  - `Flow authoring includes generic node details, launch payloads, outcome routes, owner context, and event-start target selection.`
  - `Flow remains distinct from minigame-only binding while sharing runtime contracts.`
- inherited_non_goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer flow records from concrete house modules.`
  - `Do not treat out-of-scope runtime migration as retired or unsupported.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected candidate queue and evidence matrix entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-010`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-001`
  - `ACC-BUILDING-FLOW-002`
  - `ACC-BUILDING-FLOW-003`
  - `ACC-BUILDING-FLOW-004`
  - `ACC-BUILDING-FLOW-005`
  - `ACC-BUILDING-FLOW-006`
  - `ACC-BUILDING-FLOW-007`
  - `ACC-BUILDING-FLOW-008`
  - `ACC-BUILDING-FLOW-009`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-BUILDING-FLOW-010: First-class Script Editor flow definitions, nodes, payloads, outcome routes, owner context, event-start targets, import/export validation, and preview-ready data.`

#### Cannot Claim

- `Flow runtime internals or presenter lifecycle.`
- `Built-in Zhu Yuanzhang pack migration.`
- `Legacy house runtime/module/view deletion.`
- `Final end-to-end acceptance or version closeout.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Flow runtime remains owned by queue.flow-playable-runtime-and-presenter and is already closed.`
  - `Built-in pack migration remains owned by queue.zhuyuanzhang-building-arrangement-pack-migration.`
  - `Legacy removal remains owned by queue.legacy-house-runtime-retirement.`
  - `Final acceptance remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
- forbidden_scope_shrinkage:
  - `Do not model flow as minigame-only binding.`
  - `Do not omit owner context, event-start targets, outcome routes, or preview data merely to make the editor smaller.`
  - `Do not make unspecified fields silently unsupported; use explicit extensible data boundaries where the parent spec leaves detail open.`
- unspecified_detail_policy:
  - `Extend existing Script Editor project records and UI helpers conservatively, preserving generic records and explicit validation rather than introducing building-specific editor branches.`

### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/project-workspace.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `Existing event binding authoring and minigame authoring behavior.`
  - `No flow-specific business branch in src/main.ts.`
  - `No built-in pack migration or legacy deletion.`

### Queue Snapshot

- queue_goal: `Author first-class flow playable records in Script Editor and preserve them through project/runtime pack boundaries.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Confirm current Script Editor project/event/playable evidence and flow authoring boundary before implementation.`
- task_briefs:
  - `task.script-editor-flow-playable-authoring-ux.evidence-anchor-reconcile: Confirm current editor model, save/load/export/import, and preview anchors.`
  - `task.script-editor-flow-playable-authoring-ux.implementation: Add bounded flow authoring records, editor controls, validation, import/export, and preview data.`
  - `task.script-editor-flow-playable-authoring-ux.queue-closeout-and-handoff: Verify, review completeness, classify residue, and continue without version closeout.`

### Completion Completeness Review

- review_status: `passed`
- can_claim_coverage:
  - `ACC-BUILDING-FLOW-010 is covered by first-class flows[] authoring, validation, export/import, independent UI, and active-content preview indexing.`
- parent_spec_preservation:
  - `Parent flow authoring capability is preserved; no minigame-only narrowing, capability deletion, or out-of-scope retirement was introduced.`
- out_of_scope_routing:
  - `Remaining work is routed to built-in pack migration, legacy house retirement, and final acceptance.`
- verification_sufficiency:
  - `npm run typecheck`, npm run lint:blueprints, and npm test passed with 689 tests.`
- gap_fill_decision:
  - `used-once`
- gap_fill_scope:
  - `Added flowDefinitions to runtime pack/content context and passed flowDefinitionsById through playable runtime entrypoints so preview can launch authored flow nodes.`
- remaining_gaps:
  - `No unresolved same-family gap remains inside ACC-BUILDING-FLOW-010.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-flow-playable-authoring-ux.evidence-anchor-reconcile` | `done` | `Confirmed the editor model, save/load/export, import, and preview anchors.` | `none` | `Closed under the version-local temporary execution rule.`
| `task.script-editor-flow-playable-authoring-ux.implementation` | `done` | `Added bounded flow authoring records, independent UI, validation, import/export, and preview content indexing.` | `task.script-editor-flow-playable-authoring-ux.evidence-anchor-reconcile` | `Did not implement runtime internals, pack migration, or legacy deletion.`
| `task.script-editor-flow-playable-authoring-ux.queue-closeout-and-handoff` | `done` | `Verified completeness, used one high-priority preview gap fill, classified residue, and routed the next queue.` | `task.script-editor-flow-playable-authoring-ux.implementation` | `Version remains open; no version closeout entered.`

### Progress Log

- `2026-07-20`: `Queue admitted automatically after flow playable runtime/presenter closeout under the version-local temporary execution rule.`
- `2026-07-20`: `Evidence lock confirmed the pre-existing editor only had minigames[] and required an independent flows[] authoring boundary.`
- `2026-07-20`: `Implemented flows[] domain records, validation, project save/load, runtime flow-definitions export/import, independent Script Editor flow surface, and active-content flowDefinitionsById preview indexing.`
- `2026-07-20`: `Completeness review passed. One high-priority gap fill was used to route flowDefinitionsById through active content and playable runtime entrypoints.`
- `2026-07-20`: `Queue closed locally after typecheck, Blueprint lint, and 689-test full verification. Residue remains downstream for built-in migration, legacy retirement, and final acceptance; next queue admitted automatically.`

### Task Definitions

#### `task.script-editor-flow-playable-authoring-ux.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-flow-playable-authoring-ux.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Can Claim and Cannot Claim list acceptance ids from the version acceptance matrix.`
  - `Flow authoring record, node, owner, outcome, event-target, import/export, and preview anchors are confirmed or routed.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-flow-playable-authoring-ux.implementation`
- stop_if:
  - `implementation would require runtime internals, built-in pack migration, or legacy house deletion before editor data can be authored`

##### Human Context

- task_brief:
  - `Lock Script Editor flow authoring evidence before implementation.`
- task_outcome_summary:
  - `Evidence locked: the editor had minigames[] only, so flows[] was required as an independent authoring boundary.`
- Purpose:
  - `Prevent flow authoring from being reduced to minigame binding or from bypassing existing project save/load/export seams.`
- Failure mode:
  - `The editor displays flow-like controls without durable project records or runtime-pack data.`

##### Progress Log

- `2026-07-20`: `Evidence lock completed and routed implementation without a human confirmation point.`

#### `task.script-editor-flow-playable-authoring-ux.implementation`

##### Control Block

- task_id: `task.script-editor-flow-playable-authoring-ux.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/city-building-mount-authoring.test.cjs`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `flow runtime internals`
  - `built-in Zhu Yuanzhang pack migration`
  - `legacy house runtime deletion`
  - `src/main.ts playable-specific business routing`
- done_when:
  - `Script Editor project records can create and edit first-class flow definitions and nodes.`
  - `Flow launch payloads, owner context, event-start targets, and outcome routes are represented and validated.`
  - `Project save/load and runtime pack export/import preserve flow data without minigame-only narrowing.`
  - `Runtime preview receives flow data through the existing in-memory preview boundary.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-flow-playable-authoring-ux.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires changing the parent total spec or deleting an unimplemented flow capability`

##### Human Context

- task_brief:
  - `Add bounded Script Editor flow authoring records, controls, validation, import/export, and preview data.`
- task_outcome_summary:
  - `Implemented and verified first-class flow records, authoring UI, validation, project/runtime pack round-trip, and active-content preview indexing.`
- Purpose:
  - `Make creator-defined building functions authorable as flow playables without embedding them in house modules.`
- Failure mode:
  - `Flow exists in runtime only and creators cannot persist or preview it.`

#### `task.script-editor-flow-playable-authoring-ux.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-flow-playable-authoring-ux.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-flow-playable-authoring-ux-queue.md`
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
  - `Close or route Script Editor flow authoring after verified implementation.`
- task_outcome_summary:
  - `Closed after completeness review, one high-priority preview gap fill, and full verification; routed built-in migration as the next queue.`
- Purpose:
  - `Route built-in migration and legacy removal without claiming authoring completion as version completion.`
- Failure mode:
  - `Closing this queue by omitting unresolved export/preview or flow authoring fields.`
