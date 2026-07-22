# Building Layout Template Runtime Generalization Queue

## Control Block

- queue_id: `queue.building-layout-template-runtime-generalization`
- belongs_to_version: `target.building-arrangement-container-flow-refactor`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-22`
- governance_sync_source: `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- queue_status: `done`
- queue_class: `required-continuation`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Same-family continuation for runtime building-shell generalization after final-guard review proved the current renderer still depends on named layout-variant branching and does not yet restore pre-refactor visual structure across all migrated buildings through a reusable layout-template mechanism. The template-driven renderer now lands that reusable layout ownership and closes this queue, returning control to final acceptance for renewed end-to-end guard review.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `auto-routable`
- next_family_candidate: `queue.building-arrangement-final-acceptance-and-removal-guard`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue closeout is recorded locally. Post-closeout repository-sync inspection found a pre-existing dirty worktree on mod-first-dev, so no merge/push was attempted in this queue-closeout turn.`
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
  - `Replace the remaining named layout-variant building renderer branches with a template-driven generic building layout mechanism that preserves pre-refactor visual structure across all migrated buildings and leaves future preview-editing seams without implementing preview editing yet.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Parent requirement role:
  - `This queue is a same-family continuation inside ACC-BUILDING-FLOW-006 discovered during ACC-BUILDING-FLOW-009 final-guard review. It owns runtime-shell generalization that could not legally remain in the final-guard queue. The parent spec remains the total requirement contract.`
- Forbidden expansions:
  - `Do not reintroduce legacy house runtime renderers, sessions, or house-specific UI ownership.`
  - `Do not add building-specific business branches in src/main.ts or rebuild one renderer branch per building type.`
  - `Do not implement preview drag/drop, preview selection tooling, or component click editing in this queue; reserve seams only.`
  - `Do not bypass building-container-item-action -> event binding -> flow/playable/closeBuilding for runtime functionality.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Runtime building shell renders from arrangement containers and remains a generic building module.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview consume the same building arrangement contract.`
  - `Generic containers render populated seats, action menus, and empty/no-display cases from authored data only.`
  - `Existing built-in building functions remain reachable through authored event/flow/closeBuilding paths.`
- inherited_legacy_replacements:
  - `Named old building-layout renderer branches as the effective visual-structure owner.`
  - `Data-light fallback building presentation that preserves only one special-case layoutVariant path.`
- inherited_non_goals:
  - `Do not keep compatibility fallback from old house fields.`
  - `Do not infer new arrangement layout meaning from old house/module identity.`
  - `Do not move gameplay logic into the building layout interpreter.`
  - `Do not constrain future custom minigames with a new broad permissions/security layer in this version.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected queue before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-BUILDING-FLOW-006`
- acceptance_not_claimed:
  - `ACC-BUILDING-FLOW-009`
  - `preview drag/drop or selection tooling`
  - `component click editing support`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
  - `browser simulated-human proof for runtime building entry visual parity and action-menu/leave behavior`

### Claim Boundary

#### Can Claim

- `ACC-BUILDING-FLOW-006 continuation: runtime building shell no longer depends on building-name or named layout-variant renderer branches for migrated building visual structure, and instead resolves a reusable layout-template mechanism from authored data.`
- `Resolved building layout view model carries stable layout-node/region/container identity seams required for future preview editing without implementing those interactions now.`

#### Cannot Claim

- `Final cross-entrypoint acceptance or version closeout.`
- `Preview drag/drop, preview selection tooling, or component click editing.`
- `A new gameplay runtime, playable family, or house-local lifecycle restoration.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Capability Floor

- `The shared runtime renderer must still preserve pre-refactor building visual structure through data-driven layout templates, while leaving future preview editing seams open.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Final acceptance remains owned by queue.building-arrangement-final-acceptance-and-removal-guard after this queue closes.`
  - `Function execution still remains owned by the existing building-container event/flow/playable runtime path rather than the layout mechanism.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by preserving only the temple structure while other migrated buildings remain generic fallback panels.`
  - `Do not rename hardcoded layout branches into template ids while keeping building-specific renderer code under the hood.`
  - `Do not route broken building functions as visual-only residue if the breakage is caused by the new layout mechanism.`
- unspecified_detail_policy:
  - `Prefer structure-oriented template ids, arrangement-level template references and overrides, and one generic runtime layout resolver/presenter/renderer path.`
- gap_routing_policy:
  - `If a required runtime layout capability cannot be completed here, record it as same-family residue, blocker, or successor routing rather than silently reducing the promised visual-parity surface.`

### Prerequisite Routing Decisions

- `2026-07-21`: `queue.building-arrangement-final-acceptance-and-removal-guard already used its one permitted high-priority gap fill on built-in manifest hydration and the temporary temple layoutVariant path.`
- `2026-07-21`: `Operator-approved design review confirmed the remaining mismatch is implementation-bearing shared runtime work rather than another final-guard-sized patch: all migrated buildings need template-driven layout control, visual parity with pre-refactor structure, future preview-editing seams, and preserved runtime functionality through the generic building pipeline.`
- `2026-07-21`: `This queue must replace the current named layout-variant renderer branch (`temple-stage`) with a data-driven layout-template mechanism instead of multiplying layoutVariant-specific renderer branches.`

### Implementation Anchors

- Must inspect:
  - `docs/blueprints/specs/2026-07-21-building-layout-template-runtime-design.md`
  - `src/domain/building-arrangement.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/application/building/**`
  - `src/application/presenter/**`
  - `src/ui/views/building/**`
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `tests/**`
- Must modify:
  - `src/domain/building-arrangement.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/application/building/**`
  - `src/application/presenter/**`
  - `src/ui/views/building/**`
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No main.ts building business branches.`
  - `No legacy house-runtime fallback.`
  - `No gameplay ownership inside the layout interpreter.`
  - `building-container-item-action -> event binding -> flow/playable/closeBuilding runtime path.`

#### Replacement Proof

- previous_owner_or_path:
  - `Named layout-variant branching and renderer decisions embedded in the runtime building shell.`
- new_owner_or_path:
  - `Template-driven runtime layout mechanism with authored layout variants and future preview-layout seams.`
- behavior_preservation_expectation:
  - `Visual structure and action reachability stay consistent with pre-refactor behavior while the renderer becomes generic.`
- verification_evidence:
  - `Browser proof on meeting-stage and default-shell samples plus automated verification show the template path is live.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-20-building-arrangement-container-flow-refactor-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/building-arrangement-final-acceptance-and-removal-guard-queue.md`

#### User Path Coverage Matrix

- primary_paths:
  - `Runtime view path: migrated buildings render with the expected layout template and preserve action reachability.`
- alternate_paths:
  - `Layout-variant path: multiple layout families can be expressed as authored/template data instead of hardcoded building branches.`
- empty_or_fail_closed_paths:
  - `Unknown or missing layout templates fail closed to the bounded shell rather than reviving old house-specific renderers.`
- forbidden_regressions:
  - `Do not preserve temple-only parity while other migrated buildings silently fall back to named renderer branches.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any visual or interaction parity gap discovered during generalization must be fixed or routed; generic templating is not allowed to erase building-specific meaning.`

### Queue Snapshot

- queue_goal: `Generalize runtime building layout into reusable templates while preserving pre-refactor visual structure and existing event/flow functionality across all migrated buildings.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; browser proof closed the queue-local visual-parity and layout-path verification slice and routed control back to final acceptance.`
- task_briefs:
  - `task.building-layout-template-runtime-generalization.evidence-anchor-reconcile: Confirm runtime layout residue, template ownership, and implementation anchors.`
  - `task.building-layout-template-runtime-generalization.implementation: Land template-driven runtime building layout generalization, migrate affected arrangements, and keep function routing working.`
  - `task.building-layout-template-runtime-generalization.queue-closeout-and-handoff: Verify, review completeness, classify residue, and route control back to final acceptance without version closeout.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.building-layout-template-runtime-generalization.evidence-anchor-reconcile` | `done` | `Confirm runtime layout residue, template ownership, and implementation anchors.` | `none` | `Locked on 2026-07-22. The queue now records template-table ownership, arrangement-level binding/override, reserved preview seams, and one generic building-layout resolver/presenter/renderer path as the lawful implementation target.` |
| `task.building-layout-template-runtime-generalization.implementation` | `done` | `Land template-driven runtime building layout generalization, migrate affected arrangements, and keep function routing working.` | `task.building-layout-template-runtime-generalization.evidence-anchor-reconcile` | `Completed before 2026-07-22 closeout review. Runtime layout now resolves through shared templates/layout nodes while preserving the shared event/flow/playable path and reserving preview-editing seams only.` |
| `task.building-layout-template-runtime-generalization.queue-closeout-and-handoff` | `done` | `Verify, review completeness, classify residue, and route control back to final acceptance.` | `task.building-layout-template-runtime-generalization.implementation` | `Automated verification was already green. Browser proof then confirmed meeting-stage/default-shell visual parity, building action reachability, and leave-path recovery without reintroducing layout-side hardcoding.` |

### Task Definitions

#### `task.building-layout-template-runtime-generalization.evidence-anchor-reconcile`

- state: `done`
- task_kind: `decision-dispatch`
- task_brief:
  - `Confirm runtime layout residue, template ownership, and implementation anchors before code changes.`
- task_outcome_summary:
  - `Evidence lock confirmed template-table ownership, arrangement-level layout binding/override, reserved preview seam metadata, and one generic building-layout resolver/presenter/renderer path instead of named renderer branches.`
- done_when:
  - `Evidence lock is confirmed and the queue records exact layout-template ownership, arrangement binding responsibilities, future preview extension seams, and forbidden expansions.`
  - `The queue confirms that the lawful implementation target is one generic building-layout resolver/presenter/renderer path rather than more named renderer branches.`
- verify_with:
  - `npm run lint:blueprints`

#### `task.building-layout-template-runtime-generalization.implementation`

- state: `done`
- task_kind: `execution`
- task_brief:
  - `Land template-driven runtime building layout generalization, migrate affected arrangements, and keep function routing working.`
- task_outcome_summary:
  - `Template-driven runtime layout implementation landed. Structured layout records, shell class names, node-level preview seam metadata, and reserved clickActionId wiring now drive the generic building module while migrated arrangements preserve their visual structure through authored configuration.`
- done_when:
  - `Named layout-variant renderer branching is replaced by a reusable template-driven runtime layout mechanism.`
  - `All currently migrated buildings render through the generic building module with structure-oriented layout templates and arrangement bindings.`
  - `Existing building functions still execute through the shared event/flow/playable pipeline.`
  - `Stable layout node identity seams are present for future preview editing work.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`

#### `task.building-layout-template-runtime-generalization.queue-closeout-and-handoff`

- state: `done`
- task_kind: `decision-dispatch`
- task_brief:
  - `Verify, review completeness, classify residue, and route control back to final acceptance.`
- task_outcome_summary:
  - `Automated verification remained green on 2026-07-22. Browser simulated-human proof then confirmed meeting-stage and default-shell runtime visual parity, temple action-menu -> flow-overlay reachability, task-gated non-temple entry dialogue without black-screen regression, and temple leave returning to the locations layer; queue control now routes back to final acceptance for renewed ACC-BUILDING-FLOW-009 review.`
- done_when:
  - `Implementation verification passes or is honestly blocked.`
  - `Completeness review confirms visual-parity and runtime-function obligations were not over-narrowed.`
  - `Version plan and project-progress pointers are synchronized back to the next lawful queue state.`
- verify_with:
  - `npm run lint:blueprints`

### Progress Log

- `2026-07-21`: `Queue admitted automatically under the version-local temporary execution rule after final-guard review and operator-approved design evidence proved the remaining runtime-shell mismatch is implementation-bearing same-family residue, not another final-guard-sized patch.`
- `2026-07-21`: `Implementation shifted the building layout contract from named layoutVariant fallback to structured layout records with shellClassNames, node-level preview seam metadata, and reserved clickActionId wiring. Runtime building rendering now consumes one generic node interpreter, while built-in Zhuyuanzhang temple arrangements carry their old visual structure through authored layout configuration instead of renderer-side hardcoded temple branches. Automated verification passed again: npm run typecheck, npm test -- --runInBand, npm run lint:blueprints.`
- `2026-07-22`: `Queue truth reconciled with the landed runtime layout implementation. Evidence lock is now treated as complete, implementation is marked done, and the active task advances to queue-closeout-and-handoff. Automated verification re-passed on the current working tree: npm run typecheck, npm test -- --runInBand, and npm run lint:blueprints. Browser simulated-human proof for runtime building visual parity and action-menu/leave behavior remains the open closeout requirement.`
- `2026-07-22`: `Automated browser verification sampled both runtime layout-template families. Zhu Yuanzhang -> Huangjue Temple proved meeting-stage visual parity and clean leave-path recovery back to the locations layer. Xu Da -> Tea House proved default-shell visual parity with creator-authored entrance dialogue still rendering over the building background instead of a black screen. Temple action '抄经' still launches the shared flow overlay through the existing building-container-item-action -> event binding -> flow path, which is sufficient to show this queue did not break function reachability. Shared flow-overlay progression semantics remain outside this queue's owned layout mechanism and were not used to narrow the queue claim. Control therefore returns to queue.building-arrangement-final-acceptance-and-removal-guard for renewed final acceptance, without entering version closeout.`

### Completion Completeness Review

- review_status: `passed`
- can_claim_coverage:
  - `ACC-BUILDING-FLOW-006 continuation is covered for the runtime layout-mechanism slice: migrated meeting-stage and default-shell buildings now render through authored templates rather than named renderer branches.`
  - `Queue-local browser proof covered runtime building entry visual parity, action reachability into the shared flow path, task-gated entry dialogue presentation, and leave-path recovery.`
- parent_spec_preservation:
  - `No parent capability was narrowed, retired, or declared unsupported. Building behavior still follows the shared building-container-item-action -> event binding -> flow/playable/closeBuilding path.`
  - `Future preview drag/drop, selection, and click-editing seams remain reserved in layout-node identity metadata only; this queue did not claim those interactions as implemented.`
- out_of_scope_routing:
  - `Final cross-entrypoint acceptance remains owned by queue.building-arrangement-final-acceptance-and-removal-guard.`
  - `Shared flow-overlay progression semantics are not treated as resolved by this queue-closeout record and remain outside the layout-mechanism claim boundary.`
- verification_sufficiency:
  - `Passed: npm run typecheck.`
  - `Passed: npm test -- --runInBand.`
  - `Passed: npm run lint:blueprints.`
  - `Passed: automated browser proof for meeting-stage/default-shell entry parity, task-gated dialogue presentation, action reachability, and leave-path recovery.`
- functional_loss_audit:
  - `Template generalization preserved verified visual structure and leave/action behavior on representative migrated buildings; no sampled path required legacy layout branching to remain functional.`
- replacement_proof_summary:
  - `Named runtime layout branching was replaced by template-driven layout data, with browser proof confirming parity on the selected migrated building samples.`
- gap_fill_decision:
  - `not-used`
- remaining_gaps:
  - `No still-blocking residue remains inside this queue's bounded template-driven runtime layout topic.`
  - `Version-level end-to-end acceptance remains pending and is routed back to queue.building-arrangement-final-acceptance-and-removal-guard.`
