# Stage Host Binding And Menu Resource Runtime Convergence Queue

## Control Block

- queue_id: `queue.stage-host-binding-and-menu-resource-runtime-convergence`
- belongs_to_version: `target.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-27`
- governance_sync_source: `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Queue execution and closeout review are complete. ACC-FORMAT-003 implementation is covered across stage host references plus city/building formal menu consumption, and the remaining inline menu residue is explicitly recorded as accepted compatibility-only residue rather than active queue-owned production truth.`
- residue_remaining: `yes`
- residue_family: `accepted-residue`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- auto_continue_policy: `required`
- idle_after_task_completion: `forbidden`
- queue_close_handoff: `version-plan-routing`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Repository-sync succeeded for both the earlier stage-host plus city-menu batch and the resumed building-formal-menu runtime batch. Closeout review is now also complete, so the queue returns control to version-plan routing rather than remaining active after sync success.`
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
  - `Converge stage configuration onto host references and complete the formal menu module chain so authoring, export/import, preview, runtime loading, and runtime consumption all use the same stage/menu ownership truth.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Parent requirement role:
  - `This queue is the required second execution slice under the active version. It owns ACC-FORMAT-003 only; later event-owned routing, runtime-layout persistence, and final full-chain acceptance remain version-owned follow-up queues.`
- Forbidden expansions:
  - `Do not absorb event-owned routing retirement, dialogue/playable/settlement runtime convergence, runtime-layout persistence, or final acceptance into this queue.`
  - `Do not reopen the first queue's canonical id baseline or creator-facing copy cleanup except where ACC-FORMAT-003 requires direct continuity.`
  - `Do not preserve city/building inline menu behavior as a compatibility fallback after the formal menu route is landed.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Stage configuration becomes host-reference based and remains extensible across the current production host families.`
  - `Menu becomes a formal resource/instance/runtime-consumed module rather than an inline city/building behavior patch.`
  - `Cities and buildings keep references to menu instances instead of owning inline menu capability as formal truth.`
  - `Authoring, export/import, preview, runtime loading, and runtime consumption must all use the same stage/menu ownership chain.`
- inherited_compatibility_paths:
  - `The first queue's canonical numeric-id baseline and creator-facing authoring structure remain the settled prerequisite truth.`
  - `Event may still be triggered from menus, but menu must not become a second router.`
  - `Existing stage configuration authoring and location-menu entry data must remain loadable until the formal reference chain replaces their old inline ownership seams.`
- inherited_legacy_replacements:
  - `Stage configuration inline object ownership inside the stage module.`
  - `City/building inline menu capability that bypasses a formal menu module resource/instance/runtime chain.`
- inherited_non_goals:
  - `Do not claim event-only routing convergence or private continuation retirement here.`
  - `Do not claim runtime-layout registry persistence or runtime UI layering here.`
  - `Do not claim final export/import/preview/runtime full-chain acceptance here.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile the version plan and every affected queue before treating any inherited capability as removed, unsupported, or deferred.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-FORMAT-003`
- acceptance_not_claimed:
  - `ACC-FORMAT-004`
  - `ACC-FORMAT-005`
  - `ACC-FORMAT-006`
- minimum_verification:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`

### Claim Boundary

#### Can Claim

- `ACC-FORMAT-003: stage configuration becomes host-reference based and extensible, and menu becomes a formal resource/instance/runtime-consumed module rather than an inline city/building behavior patch.`

#### Cannot Claim

- `ACC-FORMAT-004: event-owned routing convergence plus dialogue/playable/settlement runtime completion.`
- `ACC-FORMAT-005: runtime-layout registry persistence and runtime UI layering convergence.`
- `ACC-FORMAT-006: final export/import/loading/preview/runtime full-chain acceptance and fail-closed rejection proof.`
- `Out-of-scope means not implemented by this queue; it does not mean preserved as a permanent compatibility fallback unless the parent spec explicitly allows it.`

#### Capability Floor

- `When this queue closes, creators must be able to author stage configuration through host references and menu instances through one formal module path, and runtime must consume those same references without falling back to inline city/building menu truth.`

#### Parent Capability Coverage

- owned_closure:
  - `Stage host-reference convergence, host-family extensibility inside the current boundary, and formal menu resource/instance/runtime consumption completion.`
- preserved_not_owned:
  - `The first queue's authoring-format and canonical id baseline stay unchanged and remain prerequisite truth.`
  - `Later event-owned routing, runtime-layout, and final acceptance queues remain fully owned and must not be narrowed by this queue.`
- routed_elsewhere:
  - `Event-owned routing plus dialogue/playable/settlement convergence stays with queue.event-owned-routing-dialogue-playable-settlement-convergence.`
  - `Runtime-layout persistence plus UI layering stays with queue.runtime-layout-registry-and-ui-layering-convergence.`
  - `Full-chain acceptance stays with queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Event-only routing retirement, runtime-layout persistence, and final acceptance remain parent-owned follow-up queues.`
- forbidden_scope_shrinkage:
  - `Do not claim success by only renaming stage or menu fields while runtime still consumes inline city/building menu truth.`
  - `Do not claim success by only changing runtime consumption while the Script Editor still authors stage-owned inline instances or city/building-owned menu behavior as formal truth.`
  - `Do not treat event-trigger wiring inside menu actions as permission to keep menu as a second routing owner.`
- unspecified_detail_policy:
  - `Prefer explicit host references, formal menu resources/instances, and runtime-consumed module seams when existing evidence permits more than one implementation detail.`
- gap_routing_policy:
  - `If any required host-reference or menu-consumption gap cannot converge inside this queue, record it as same-family residue, blocker, or version-routed candidate instead of hiding it behind inline compatibility logic.`

#### Legacy Paths To Replace

- `Stage configuration data or helper seams that directly own inline stage target instances instead of consuming host-owned references.`
- `City/building menu entries, action-menu containers, or runtime access paths that still behave as the primary menu production truth rather than references into a formal menu module.`

#### Compatibility Paths To Preserve

- `The first queue's canonical id and creator-facing structure baseline.`
- `Current authored location/menu/stage records must remain save/load/export/import reachable while ownership shifts to formal reference seams.`
- `Menus may still trigger events, but event remains the sole routing owner and no private continuation chain may be introduced as part of this queue.`

#### User Path Coverage Matrix

- semantic_dimensions:
  - `stage host ownership`
  - `menu resource ownership`
  - `authoring/runtime parity`
  - `host-family extensibility`
  - `save/export/import continuity`
- primary_paths:
  - `Creators can author stage-related bindings from the stage configuration surface using host references instead of inline owned instances.`
  - `Creators can author menu resources/instances once and reference them from cities/buildings instead of duplicating inline menu behavior per location record.`
- alternate_paths:
  - `Existing loaded projects normalize into the same host-reference and menu-resource direction rather than reopening inline city/building menu truth.`
- leave_return_or_followup_paths:
  - `Menu actions may continue to reference events, but ownership of follow-up routing remains with event and not with menu instance state.`
- empty_or_fail_closed_paths:
  - `Unset host references or missing menu resources remain explicit validation/export failures rather than silently reconstructing the retired inline ownership path.`
- rejection_or_error_paths:
  - `Invalid host-family references or missing menu resources must fail closed in export/import/runtime loading rather than degrading into old city/building inline menus.`
- forbidden_regressions:
  - `Do not regress the first queue's title/name-first authoring model or reintroduce developer-facing system wording as the normal creator path.`

#### Meaning Preservation

- creator_facing_meaning:
  - `Creators work through host references, menu resources, and clearly named menu instances rather than implicit city/building-owned inline menu behavior.`
- runtime_meaning:
  - `The authored stage/menu references lower into one runtime-consumed module chain without dual ownership.`
- trigger_timing_or_context:
  - `Stage and menu may still cooperate with event triggers, but event remains the only routing owner and menu stays a reference/consumption module.`
- consistency_surfaces:
  - `Authoring, save/load, export/import, preview, and runtime consumers must stay on one canonical stage/menu structure.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any creator-visible stage/menu capability lost by this ownership convergence must be repaired in-queue or routed explicitly as residue or blocker. It cannot be erased by reclassifying the capability as a later queue concern after this queue changed its owning surface.`

#### Implementation Anchors

- Must inspect:
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/city-menu/city-menu.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/story/story-stage-access.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `tests/browser-script-editor-module-smoke.test.cjs`
  - `tests/browser-script-editor-deep-actions-smoke.test.cjs`
- Must modify:
  - `docs/change-log.md`
  - `src/application/script-editor/**`
  - `src/application/runtime/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- Must preserve:
  - `No second routing owner beside event.`
  - `No retreat from the first queue's canonical id baseline.`
  - `No runtime-layout ownership drift into this queue.`

#### Verification Coverage

- `Verification must prove that stage configuration consumes host references instead of inline owned instances, that menus travel through one formal resource/instance/runtime chain, and that export/import/runtime consumers agree on the same ownership model.`

#### Replacement Proof

- previous_owner_or_path:
  - `Stage configuration and city/building menu seams still expose or consume inline ownership truth even after the first queue settled canonical ids and creator-facing structure.`
- new_owner_or_path:
  - `Stage configuration consumes host references, and menu flows through one formal menu resource/instance/runtime chain referenced by cities/buildings.`
- behavior_preservation_expectation:
  - `Creators gain one explicit stage/menu ownership model while save/load/export/import/runtime truth remains continuous through the formal references.`
- old_truth_owner_exit_proof:
  - `Covered stage/menu seams must no longer require stage-owned inline instances or city/building-owned inline menu truth as the production path.`
- verification_evidence:
  - `Regression tests, runtime/export coverage, and source guards must prove that the formal menu and host-reference paths are the actual production paths rather than documentation-only renames.`
- replacement_scope_limit:
  - `This queue replaces stage/menu ownership seams only. It preserves later event-routing, runtime-layout, and final acceptance work for later queues.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`

### Queue Snapshot

- queue_goal: `Execute the second version slice so stage configuration and menu ownership converge onto one formal reference/runtime chain.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Completed. ACC-FORMAT-003 now closes its bounded execution slice with repository-sync recorded and only accepted compatibility residue remaining.`
- task_briefs:
  - `task.stage-host-binding-and-menu-resource-runtime-convergence.evidence-anchor-reconcile: freeze the real stage/menu ownership gaps, source anchors, and no-over-narrowing boundary for ACC-FORMAT-003.`
  - `task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation: land host-reference stage configuration plus formal menu resource/instance/runtime consumption completion.`
  - `task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate: verify ACC-FORMAT-003 coverage, classify residue honestly, and run the repository-sync gate.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means the queue is still actively landing its owned ACC-FORMAT-003 work.`
- `execution_closeout_status = blocked means execution cannot continue without a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the queue still owns unfinished same-family work or explicitly routed residue.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `Active-task completion, queue closeout sync, and active queue handoff are transitions, not lawful pause points by themselves.`

### Completion Completeness Review

- review_status: `accepted-residue`
- can_claim_coverage:
  - `Implementation coverage is now complete for ACC-FORMAT-003's code/runtime surface: stage host references, formal menu authoring/export/import, city runtime menu consumption, and building runtime menu consumption all use the same formal menu-instance route.`
- parent_spec_preservation:
  - `Verified so far. Event-owned routing, runtime-layout persistence, and final acceptance remain routed to later queues.`
- capability_floor_verification:
  - `The capability floor is now implemented: creators author formal menu resources/instances, locations reference menuInstanceIds, and covered runtime consumers resolve those same formal menu entries without falling back to inline city/building menu truth.`
- out_of_scope_routing:
  - `ACC-FORMAT-004 through ACC-FORMAT-006 remain routed to their recorded follow-up queues in the version plan.`
- verification_sufficiency:
  - `Green on the bounded implementation surface, including the resumed building runtime cutover and the affected Script Editor/browser/governance checks.`
- user_path_matrix_verification:
  - `Covered paths now include stage host references, city formal menu consumption, building formal menu consumption, imported pack migration proof, and the retired inline arrangement action-item authoring path.`
- functional_loss_audit:
  - `No creator-visible loss is currently known on the covered queue surface, and closeout review did not find any additional queue-owned loss beyond the accepted compatibility-only residue already recorded.`
- replacement_proof_summary:
  - `Production city and building runtime now both consume menuResources/menuInstances, built-in scenario-pack data ships formal city/building menu files and menuInstanceIds, and active Script Editor records no longer expose inline location/arrangement menu arrays as authoring truth.`
- placeholder_or_legacy_fallback_audit:
  - `Remaining inline menu residue is compatibility-only: location menuEntries persist for normalization/formalization and workspace issue-path mapping, while arrangement action-menu items persist only for import/runtime-materialization compatibility and are stripped from the active exported/runtime truth.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `none inside queue-owned implementation scope; the remaining location menuEntries and arrangement action-menu item seams are now explicitly recorded as accepted compatibility-only residue rather than active production truth.`

### Execution Self-Review Gate

- review_scope: `closeout-complete`
- version_acceptance_alignment:
  - `This queue is admitted only for ACC-FORMAT-003, which the version spec assigns to the required stage/menu ownership slice.`
- parent_spec_alignment:
  - `The queue boundary preserves the parent requirement sheet without absorbing event-only routing, runtime-layout, or final acceptance work.`
- queue_claim_alignment:
  - `The queue correctly owned ACC-FORMAT-003 through closeout: stage host-reference convergence and formal menu resource/runtime consumption are covered, and the earlier building-menu runtime gap was repaired inside this queue rather than deferred into later queues.`
- over_narrowing_check:
  - `The queue cannot pass by only editing stage labels or menu wording; runtime consumption and city/building ownership retirement also belong to ACC-FORMAT-003.`
- residue_or_blocker_routing_check:
  - `No blocker is recorded. Later acceptances remain routed to the already-recorded follow-up queues in the version plan.`
- verification_adequacy_check:
  - `Authoring/export/runtime proof is adequate and closeout review is complete: ACC-FORMAT-003 is covered, the remaining inline menu residue is accepted compatibility-only residue, and queue-local sync truth is already recorded successfully.`
- next_lawful_action_check:
  - `Return control to version-plan routing so queue.event-owned-routing-dialogue-playable-settlement-convergence can be admitted as the next lawful queue.`

### Runtime/Browser Acceptance Gate

- gate_required: `true`
- covered_surfaces:
  - `Script Editor stage configuration and city/building menu authoring surfaces affected by the ACC-FORMAT-003 ownership convergence.`
- interaction_path:
  - `Creator opens the stage configuration and city/building menu surfaces, edits the converged stage/menu references, and confirms runtime-facing menu ownership no longer depends on inline city/building menu truth.`
- proof_mode:
  - `human-visible-in-app-browser`
- proof_artifacts:
  - `Targeted browser acceptance notes plus automated export/runtime coverage for the changed stage/menu helpers and source guards.`
- fail_closed_check:
  - `Missing host references or menu resources must remain explicit validation/export failures rather than reconstructed inline stage/menu ownership.`
- waiver_basis:
  - `none`
- simulated_human_visibility:
  - `visible-human-observed`
- interaction_semantics:
  - `Proof must use visible interaction with the rendered Script Editor stage/menu controls rather than hidden state injection only.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.stage-host-binding-and-menu-resource-runtime-convergence.evidence-anchor-reconcile` | `done` | `Freeze the stage/menu ownership acceptance scope, implementation anchors, and no-over-narrowing boundary for ACC-FORMAT-003.` | `none` | `Completed from source audit: the current stage surface is still a progress-track binding editor, and menu truth still lives inline on city/building records.` |
| `task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation` | `done` | `Land host-reference stage configuration plus formal menu resource/instance/runtime consumption completion.` | `task.stage-host-binding-and-menu-resource-runtime-convergence.evidence-anchor-reconcile` | `Completed after the building-side runtime cutover moved action-menu consumption onto formal menuResources/menuInstances and removed the remaining production dependence on inline arrangement action items.` |
| `task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate` | `done` | `Verify ACC-FORMAT-003 coverage, classify residue honestly, and run the repository-sync gate.` | `task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation` | `Done. Closeout review records the remaining inline menu references as accepted compatibility-only residue, preserves later queues honestly, and returns control to version-plan routing after the resumed batch sync is already recorded as successful.` |

### Task Definitions

#### `task.stage-host-binding-and-menu-resource-runtime-convergence.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.stage-host-binding-and-menu-resource-runtime-convergence.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/city-menu/city-menu.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/story/story-stage-access.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Current stage configuration authoring/runtime ownership seams.`
  - `Current city/building menu authoring/runtime ownership seams.`
  - `Current source guards and browser smoke surfaces for stage configuration and menu editing.`
- must_not_change:
  - `Do not begin implementation before the queue records exact ACC-FORMAT-003 ownership and replacement proof anchors.`
  - `Do not widen this queue into event-only routing, runtime-layout persistence, or final acceptance work.`
- done_when:
  - `Evidence lock is recorded with concrete source anchors for ACC-FORMAT-003.`
  - `Can Claim and Cannot Claim list the exact version acceptance this queue owns.`
  - `The queue records the exact stage/menu ownership changes that belong to the implementation batch.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Return to version review and record the blocker rather than starting implementation on a drifting boundary.`
- promote_next_if_done: `task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation`
- human_input_required: `false`
- next_lawful_action_if_done: `task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `The parent spec must change before any bounded ACC-FORMAT-003 implementation can be selected.`
  - `The queue would have to absorb later event-only routing or runtime-layout work just to land ACC-FORMAT-003.`

##### Human Context

- task_brief:
  - `Lock the stage/menu ownership implementation boundary before code changes start.`
- task_outcome_summary:
  - `Done. Evidence reconciliation confirmed that stageConfiguration is still only a creator shell over progressTrackBindings/progressTracks, with ownerKind/ownerId plus trackId as the current production binding semantics across workspace shell, MainUiFlow, runtime export/import, and runtime bootstrap.`
  - `Done. Evidence reconciliation also confirmed that formal menu ownership does not exist yet: ScriptEditorMenuEntry is still stored directly on city/building records, city-building authoring and MainUiFlow mutate those inline arrays directly, workspace validation resolves missing references from those same location-local arrays, and event deletion still scrubs city/building menuEntries in place.`
  - `Done. Existing browser smoke only proves the current stageConfiguration help/add/remove shell and generic creator-module navigation; it does not yet prove host-reference stage authoring or formal menu-instance consumption. ACC-FORMAT-003 therefore remains a real implementation batch rather than a label-only stage/menu relabeling pass.`

#### `task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation`

##### Control Block

- task_id: `task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/**`
  - `src/application/runtime/**`
  - `src/application/city-menu/city-menu.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/story/story-stage-access.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
  - `docs/change-log.md`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Every covered stage/menu seam that still owns inline stage targets or inline city/building menu truth.`
  - `Current creator-facing stage configuration and city/building menu authoring surfaces.`
- must_modify:
  - `Covered stage host-reference authoring/runtime seams.`
  - `Covered menu resource/instance/runtime consumption seams.`
  - `Regression tests and change-log entries for landed code/runtime/editor behavior changes.`
- must_replace:
  - `Inline stage-owned target ownership for covered stage configuration paths.`
  - `Inline city/building-owned menu production truth for covered menu paths.`
- must_preserve:
  - `The first queue's canonical id and creator-facing structure baseline.`
  - `Event as the sole routing owner.`
  - `No runtime-layout or final-acceptance scope expansion.`
- must_not_change:
  - `Do not widen into event-only routing retirement.`
  - `Do not widen into runtime-layout persistence or UI layering work.`
  - `Do not preserve dual old/new production truth as a compatibility layer.`
- done_when:
  - `Stage configuration consumes formal host references instead of inline owned instances.`
  - `Cities/buildings reference formal menu resources/instances instead of owning inline menu truth.`
  - `Build, regression, and Blueprint verification pass.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without inventing a compatibility fallback or silently narrowing queue ownership.`
- promote_next_if_done: `task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate`
- human_input_required: `false`
- next_lawful_action_if_done: `task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `Implementation requires parent-spec widening into later queue ownership.`
  - `Implementation can only proceed by preserving dual old/new truth.`

##### Human Context

- task_brief:
  - `Land the stage host-reference and formal menu chain batch for ACC-FORMAT-003.`
- task_outcome_summary:
  - `Done. The stage host-reference slice landed across progression contracts, Script Editor authoring helpers, export/import validation, runtime state, and stage-related regression coverage.`
  - `Done. The formal menu chain now converges through production runtime on both city and building surfaces: presenter/render/click handling consumes menuResources/menuInstances, building action menus resolve from the active house menuInstanceIds chain, and the built-in zhuyuanzhang pack now ships formal building menu resources/instances instead of inline arrangement action items as production truth.`
  - `Done. Remaining inline action-menu item residue is now limited to compatibility/formalization seams and authoring-shell notes; the lawful next step is queue closeout review rather than more ACC-FORMAT-003 implementation.`

#### `task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate`

##### Control Block

- task_id: `task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate`
- state: `done`
- task_kind: `queue-closeout`
- scope:
  - `docs/blueprints/queues/stage-host-binding-and-menu-resource-runtime-convergence-queue.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/change-log.md`
  - `src/application/**`
  - `src/ui/**`
  - `tests/**`
- must_inspect:
  - `Proof that ACC-FORMAT-003 is actually covered.`
  - `Whether any same-family residue remains inside stage/menu ownership convergence.`
  - `Repository-sync readiness after queue closeout proof.`
- must_modify:
  - `Queue closeout truth`
  - `Version-plan next routing truth`
  - `Project-progress active queue truth`
  - `docs/change-log.md`
- must_preserve:
  - `Single-active-task governance`
  - `The current version boundary`
  - `Honest routing for later queues`
- done_when:
  - `Queue closeout proof is recorded honestly.`
  - `Repository-sync gate has been attempted and recorded truthfully.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker in queue/version truth before any stop decision.`
- promote_next_if_done: `none`
- human_input_required: `false`
- next_lawful_action_if_done: `return-to-version-review`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `false`
- stop_if:
  - `ACC-FORMAT-003 is not honestly covered.`

##### Human Context

- task_brief:
  - `Close out the stage/menu ownership queue after verified implementation and route the next lawful queue.`
- task_outcome_summary:
  - `Done. The previously open building runtime divergence is now covered and verified, closeout review records the remaining location menuEntries and arrangement action-menu item seams as accepted compatibility-only residue rather than active production truth, and the queue returns control to version-plan routing after the resumed batch sync succeeded.`

### Progress Log

- `2026-07-26`: `Queue admitted after queue.script-editor-content-format-and-authoring-surface-unification closed and repository sync succeeded through commit f4ec1e20 on origin/mod-first-dev.`
- `2026-07-26`: `task.stage-host-binding-and-menu-resource-runtime-convergence.evidence-anchor-reconcile is now the live active task. The next lawful action is freezing the real stage host-reference and menu module ownership gaps against the settled first-queue baseline.`
- `2026-07-26`: `Evidence reconciliation is now locked. The source audit confirmed that stageConfiguration still operates as a progressTrackBindings/progressTracks shell rather than a host-reference surface, while menu truth still lives inline on city/building menuEntries and is mutated/validated as location-local production data across authoring, workflow cleanup, and validation paths.`
- `2026-07-26`: `The queue auto-promoted task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation as the live active task. ACC-FORMAT-003 implementation must now replace those production ownership seams rather than relabeling the existing inline paths.`
- `2026-07-26`: `The first bounded implementation slice is now landed on the stage side. Progression contracts, Script Editor authoring helpers, runtime-pack export/import validation, story runtime consumption, browser smoke fixtures, and regression coverage now use host-reference semantics (`hostFamily` / `hostId` plus host-keyed runtime state) instead of the retired owner tuple.`
- `2026-07-26`: `Queue execution remains active because menu truth is still inline on city/building menuEntries; ACC-FORMAT-003 cannot close until the formal menu resource/instance/runtime chain and queue-level browser proof are also landed.`
- `2026-07-26`: `Post-slice verification is now green for the active stage host chain: npm run build:test, node --test tests/robustness.test.cjs, npm run lint:blueprints, npm run lint:blueprint-skill, npm run blueprint:governance:check, and node --test tests/browser-stage-settlement-smoke.test.cjs all passed after the host-reference contract cutover.`
- `2026-07-27`: `The formal menu authoring/export/import slice is now landed. Script Editor project parsing and default-project creation now formalize legacy location-local menuEntries into project-level menuResources/menuInstances plus location menuInstanceIds, MainUiFlow edits the formal chain instead of mutating location.menuEntries as the active authoring truth, workspace-shell validation follows the formal references, and event-deletion cleanup now scrubs menu resource entries.`
- `2026-07-27`: `Verification for the menu slice is green on the current queue surface: npm run build:test, node --test tests/robustness.test.cjs, and node --test tests/browser-script-editor-deep-actions-smoke.test.cjs all passed after the Script Editor menu formalization cutover.`
- `2026-07-27`: `The runtime-side menu consumption slice is now landed too. City presenter/render/click handling now consumes formal menuResources/menuInstances, the built-in zhuyuanzhang pack ships formal menu resource/instance files plus city menuInstanceIds, and runtime city-menu actions dispatch from formal menu entry ids rather than the older inline panel/open branches.`
- `2026-07-27`: `Active authoring residue also narrowed in the same batch: default/normalized city and building records no longer carry empty inline menuEntries as active truth, formalization now strips legacy menuEntries after generating menuInstanceIds, and the old inline menu-entry helper exports were retired from city-building authoring.`
- `2026-07-27`: `Post-cutover verification is green on the bounded queue surface: npm run build:test, node --test tests/robustness.test.cjs, node --test tests/browser-script-editor-deep-actions-smoke.test.cjs, npm run lint:blueprints, npm run lint:blueprint-skill, and npm run blueprint:governance:check all passed after the runtime menu-chain cutover and residue cleanup.`
- `2026-07-27`: `The queue has now auto-promoted task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate as the live active task. ACC-FORMAT-003 is still not declared closed here; closeout review must first classify the remaining compatibility-only menuEntries shell and attempt repository sync.`
- `2026-07-27`: `Closeout review now classifies the remaining menuEntries references as accepted non-production compatibility residue only: they live in import formalization, optional type contracts, imported-data normalization, and workspace issue-path mapping rather than in active authoring/runtime truth. Repository-sync gating is now the only remaining lawful action inside this queue.`
- `2026-07-27`: `Repository-sync gating is now satisfied for the current queue batch. Commit 3b78445d landed on mod-first-dev, push to origin/mod-first-dev succeeded, and the closeout review now has a recorded remote-sync result rather than only local-record truth.`
- `2026-07-27`: `Closeout review then found a same-family gap that keeps ACC-FORMAT-003 open: building runtime still renders arrangement action-menu containers as the primary menu production truth, while building menuInstanceIds only survive through authoring/export/import/runtime loading. The queue therefore returns from closeout review to task.stage-host-binding-and-menu-resource-runtime-convergence.stage-host-and-menu-chain-implementation.`
- `2026-07-27`: `The returned implementation slice is now landed and re-verified. Building runtime action menus consume formal menuResources/menuInstances, Script Editor building arrangements no longer expose inline action-item authoring as the active path, the built-in zhuyuanzhang pack migrated building menu truth into houses/menu-resources/menu-instances, and node --test tests/robustness.test.cjs plus node --test tests/city-building-mount-authoring.test.cjs are green on the converged path.`
- `2026-07-27`: `With the same-family runtime gap covered, the queue now resumes task.stage-host-binding-and-menu-resource-runtime-convergence.queue-closeout-review-and-sync-gate. ACC-FORMAT-003 is still not declared closed here; closeout review must now judge the remaining compatibility-only inline action-menu residue and repository-sync truth honestly.`
- `2026-07-27`: `The resumed batch has now passed its repository-sync attempt too: the building formal-menu runtime cutover and closeout-review doc sync committed cleanly on mod-first-dev and pushed to origin/mod-first-dev. Queue closure is still not auto-approved by that success; closeout review must still decide the final ACC-FORMAT-003 topic-closure truth.`
- `2026-07-27`: `Closeout review is now complete. ACC-FORMAT-003 remains execution-closed with topic_closure_status=open-residue because the remaining location menuEntries and arrangement action-menu item references are accepted compatibility-only residue rather than active queue-owned production truth, so control returns to version-plan routing for the next lawful queue admission.`
