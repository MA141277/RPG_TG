# Script Editor Content Format And Authoring Surface Unification Queue

## Control Block

- queue_id: `queue.script-editor-content-format-and-authoring-surface-unification`
- belongs_to_version: `target.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-26`
- governance_sync_source: `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `Queue closeout proof is complete and repository-sync gate succeeded: commit f4ec1e20 landed the first authoring-format baseline batch on mod-first-dev and push to origin/mod-first-dev succeeded after required browser acceptance and governed truth synchronization.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- auto_continue_policy: `required`
- idle_after_task_completion: `forbidden`
- queue_close_handoff: `version-plan-routing`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Repository-sync gate satisfied: commit f4ec1e20 landed on mod-first-dev and push to origin/mod-first-dev succeeded after queue closeout proof and browser acceptance were recorded.`
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
  - `Land the first version slice that normalizes creator-facing content format, adopts the canonical numeric id rule across covered draft creation paths, retires duplicate same-meaning authoring surfaces, and separates event basic info, follow-up slots, destination, and binding semantics before later stage/menu/runtime queues execute.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Parent requirement role:
  - `This queue is the required-first execution slice under the active version. It owns ACC-FORMAT-001 and ACC-FORMAT-002 only; later stage/menu, event-only routing, runtime-layout, and final full-chain acceptance remain version-owned follow-up queues.`
- Forbidden expansions:
  - `Do not absorb stage-host binding or menu resource/runtime convergence into this queue.`
  - `Do not absorb event-only routing retirement, dialogue/playable/settlement runtime convergence, or runtime-layout persistence into this queue.`
  - `Do not reopen story-node / plot-node work that the parent spec explicitly excludes.`
  - `Do not treat creator-surface cleanup as permission to preserve old ids or old duplicate semantics behind compatibility fallbacks.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Covered modules must move toward one creator-facing content-format direction with title/name-first operation and internal numeric ids as program truth.`
  - `People, cities, and buildings must keep structured base/profile/custom-style authoring semantics rather than flat field sprawl or mixed duplicate surfaces.`
  - `Event authoring must clearly separate basic information, follow-up slot semantics, destination ownership, and event-binding relationship instead of mixing them into one creator-facing control cluster.`
  - `Draft creation, project persistence, export/import, and later runtime queues must inherit the same id-rule baseline this queue lands.`
- inherited_compatibility_paths:
  - `Existing save/load, export/import, and runtime paths must remain lawful while this queue changes creator-facing structures and draft-id allocation.`
  - `Arrangement / event-binding / flow / playable implementation seams remain legal implementation mechanisms while creator-facing wording is cleaned up.`
- inherited_legacy_replacements:
  - `Non-canonical *.new.* draft ids in covered families that already belong to the formal numeric-id boundary.`
  - `Mixed creator-facing surfaces where baseAttributes / profileMap / extendedAttributes semantics exist for some families while adjacent families still expose flatter or developer-shaped controls.`
  - `Event authoring wording that still leaks project.eventBindings or other implementation-facing terminology into the normal creator workflow.`
- inherited_non_goals:
  - `Do not claim stage host extensibility, menu formalization, or runtime menu consumption here.`
  - `Do not claim event-only routing retirement or runtime continuation cutover here.`
  - `Do not claim runtime-layout persistence, runtime UI layering, or final acceptance here.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile the version plan and every affected candidate queue before treating any inherited capability as removed, unsupported, or deferred.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-FORMAT-001`
  - `ACC-FORMAT-002`
- acceptance_not_claimed:
  - `ACC-FORMAT-003`
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

- `ACC-FORMAT-001: covered creator-facing authoring surfaces now follow one bounded content-format direction across the first-phase families, retire duplicate same-meaning controls, and stop presenting developer/runtime wording as the normal authoring truth.`
- `ACC-FORMAT-002: covered draft-creation and persisted-reference seams now use the canonical numeric id rule while creator interaction remains title/name-first.`

#### Cannot Claim

- `ACC-FORMAT-003: stage configuration host-reference convergence and menu module formalization.`
- `ACC-FORMAT-004: event-only routing convergence plus dialogue/playable/settlement runtime completion.`
- `ACC-FORMAT-005: runtime-layout registry persistence and runtime UI layering convergence.`
- `ACC-FORMAT-006: final export/import/loading/preview/runtime full-chain acceptance and fail-closed rejection proof.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec changes first.`

#### Capability Floor

- `When this queue closes, creators must be able to add and edit first-phase covered records without non-canonical *.new.* ids, without flat-vs-structured semantic drift across adjacent modules, and without relying on developer-facing event-binding or routing terminology to understand normal authoring behavior.`

#### Parent Capability Coverage

- owned_closure:
  - `Authoring-format convergence, numeric-id baseline adoption, duplicate-surface retirement, creator-facing de-developerization, and event authoring structure normalization for the first-phase boundary.`
- preserved_not_owned:
  - `Existing save/load, export/import, and runtime consumers must keep working on the changed structures.`
  - `Later stage/menu, event-only routing, runtime-layout, and final acceptance queues remain fully owned and must not be narrowed by this queue.`
- routed_elsewhere:
  - `Stage host plus menu completion stays with queue.stage-host-binding-and-menu-resource-runtime-convergence.`
  - `Event-owned routing plus dialogue/playable/settlement convergence stays with queue.event-owned-routing-dialogue-playable-settlement-convergence.`
  - `Runtime-layout persistence plus UI layering stays with queue.runtime-layout-registry-and-ui-layering-convergence.`
  - `Full-chain acceptance stays with queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Stage/menu runtime ownership, event-only routing, runtime-layout persistence, and final acceptance remain parent-owned follow-up queues.`
- forbidden_scope_shrinkage:
  - `Do not claim success by converting only ids while leaving duplicate creator meaning or developer-facing authoring wording in place.`
  - `Do not claim success by cleaning labels while default record creation still emits legacy *.new.* ids for covered families.`
  - `Do not collapse event follow-up slot semantics, destination semantics, and event binding semantics back into one creator-facing control cluster.`
- unspecified_detail_policy:
  - `Prefer shared creator-facing semantics, structured field grouping, and canonical numeric-id allocation when existing evidence permits more than one implementation detail.`
- gap_routing_policy:
  - `If a required covered family cannot converge inside this queue, record the remaining gap as same-family residue, blocker, or a version-routed candidate instead of hiding it behind unchanged legacy surfaces.`

#### Legacy Paths To Replace

- `Draft ids such as person.new.*, city.new.*, building.new.*, dialogue.new.*, event.new.*, minigame.new.*, flow.new.*, settlement.new.*, and related *.new.* families that survive inside first-phase creation helpers despite the canonical id allocator already existing.`
- `Mixed creator-facing surface contracts where people, cities, and buildings expose partially structured authoring while adjacent authoring seams still behave as flat or implementation-facing surfaces.`
- `Event authoring hints and editor clusters that still expose project.eventBindings or other implementation-oriented phrasing as normal creator truth.`

#### Compatibility Paths To Preserve

- `Project save/load and runtime-pack export/import remain on the same structural truth after the authoring surface changes.`
- `Existing record references remain stable through canonical numeric-id allocation rather than ad hoc new id families.`
- `Arrangement / event-binding / flow / playable implementation seams remain legal internal mechanisms even as creator-facing wording changes.`

#### User Path Coverage Matrix

- semantic_dimensions:
  - `creator-facing meaning`
  - `internal id truth`
  - `field grouping consistency`
  - `event authoring structure`
  - `save/export/import continuity`
- primary_paths:
  - `Creators can add or edit people, cities, buildings, dialogues, events, settlements, minigames, flows, and adjacent first-phase records through one consistent id and content-format direction.`
- alternate_paths:
  - `Existing projects loaded from save/import continue to normalize into the same creator-facing grouped structures instead of reopening flat duplicate surfaces.`
- leave_return_or_followup_paths:
  - `Event basic info, follow-up slots, destination, and binding relationships remain separately reachable in authoring without dialogue follow-up or developer-only fallbacks reappearing as routing truth.`
- empty_or_fail_closed_paths:
  - `Empty optional structured groups and unset destination/binding references remain truthful and fail closed where unsupported rather than silently reconstructing old surfaces.`
- rejection_or_error_paths:
  - `Invalid id or unsupported shape paths must remain explicit validation/export failures rather than compatibility reconstruction.`
- forbidden_regressions:
  - `Do not regress title/name-first authoring by making creators operate primarily through raw ids or implementation object paths.`

#### Meaning Preservation

- creator_facing_meaning:
  - `Creators work in grouped, semantic authoring sections and named records rather than project-internal file keys, raw id maintenance, or implementation-only wording.`
- runtime_meaning:
  - `The changed authoring structures continue to lower into the existing persisted/exported/runtime truth without dual ownership.`
- trigger_timing_or_context:
  - `Event binding timing/context remains preserved while this queue only clarifies the creator-facing separation between binding semantics and event record semantics.`
- consistency_surfaces:
  - `Authoring, save/load, export/import, and later runtime consumers must stay on one canonical structure per changed family.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any creator-visible capability lost by this format convergence must be repaired in-queue or routed explicitly as residue or blocker. It cannot be erased by calling the capability a later queue concern when this queue changed its owning surface.`

#### Implementation Anchors

- Must inspect:
  - `src/application/script-editor/script-editor-id-allocation.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/domain/script-editor-project.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/application/script-editor/script-editor-id-allocation.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/change-log.md`
- Must preserve:
  - `No compatibility-only id fallback.`
  - `No second routing owner beside event in creator-facing semantics.`
  - `No runtime-layout or menu ownership drift into this queue.`

#### Verification Coverage

- `Verification must prove canonical id allocation for the covered draft families, grouped creator-facing authoring behavior for the changed families, and the separation between event record semantics and event-binding semantics.`

#### Replacement Proof

- previous_owner_or_path:
  - `Mixed *.new.* draft-id creation helpers and mixed creator-facing authoring surfaces spread across person/city/building/event helpers and MainUiFlow.`
- new_owner_or_path:
  - `Canonical numeric-id allocation plus one grouped creator-facing authoring contract for the changed families, with event semantics separated into clearer creator-facing ownership lines.`
- behavior_preservation_expectation:
  - `Creators gain one cleaner authoring model while save/load/export/import/runtime truth remains on the same records and references.`
- old_truth_owner_exit_proof:
  - `Covered draft creators must no longer emit *.new.* ids, and the changed event authoring surfaces must no longer rely on project.eventBindings or dialogue follow-ups as the normal creator-facing routing explanation.`
- verification_evidence:
  - `Regression tests and source guards must prove that the new owner path is the actual production path, not only a documentation rename.`
- replacement_scope_limit:
  - `This queue replaces first-phase authoring format and id baseline only. It preserves later runtime/menu/layout/routing work for later queues.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`

### Queue Snapshot

- queue_goal: `Execute the required-first authoring-format and numeric-id baseline so later module/runtime queues inherit one canonical creator-facing content structure.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue is closed. Local implementation, browser acceptance, and repository-sync gating are complete, and control returns to the version plan for next-queue routing.`
- task_briefs:
  - `task.script-editor-content-format-and-authoring-surface-unification.evidence-anchor-reconcile: completed after freezing the acceptance scope, source anchors, and no-over-narrowing boundaries for ACC-FORMAT-001 / 002.`
- `task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation: completed locally with canonical draft ids, grouped creator-facing authoring surfaces, event-structure cleanup, and passing automated coverage.`
- `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate: done after queue closeout proof, browser-proof synchronization, and successful repository sync through commit f4ec1e20 on origin/mod-first-dev.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means the queue is still actively landing its owned ACC-FORMAT-001 / 002 work.`
- `execution_closeout_status = blocked means execution cannot continue without a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the queue still owns unfinished same-family work or explicitly routed residue.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `Active-task completion, queue closeout sync, and active queue handoff are transitions, not lawful pause points by themselves.`

### Completion Completeness Review

- review_status: `complete`
- can_claim_coverage:
  - `Covered locally. Covered first-phase surfaces now share one bounded creator-facing format direction, duplicate same-meaning controls are retired within scope, and the changed dialogue/event/minigame/event-binding copy no longer exposes implementation-facing routing or binding jargon as normal authoring truth.`
- parent_spec_preservation:
  - `Preserved locally. Later stage/menu, event-only routing, runtime-layout, and final acceptance queues remain outside this queue and are still routed by the parent version plan.`
- capability_floor_verification:
  - `Covered locally by build:test, robustness coverage, and visible browser checks across people/building/event/minigame/dialogue surfaces.`
- out_of_scope_routing:
  - `ACC-FORMAT-003 through ACC-FORMAT-006 remain routed to their recorded follow-up queues in the version plan.`
- verification_sufficiency:
  - `Satisfied locally through build:test, robustness source guards, and human-visible in-app browser acceptance notes on the changed Script Editor surfaces.`
- user_path_matrix_verification:
  - `Covered locally: creators can add first-phase drafts without legacy *.new.* ids, keep grouped people/building authoring semantics visible, and see event follow-up / destination / binding semantics as separate creator-facing controls.`
- functional_loss_audit:
  - `No functional loss recorded locally. Save/load/export/import/runtime continuity stayed green across the covered first-phase surfaces.`
- replacement_proof_summary:
  - `Covered locally: direct creators and workflow fallback no longer emit legacy *.new.* ids, and the changed event/minigame/dialogue/event-binding surfaces now route creators through one clearer authoring model instead of implementation wording.`
- placeholder_or_legacy_fallback_audit:
  - `No placeholder fallback remains inside the claimed boundary: visible authoring surfaces, source guards, and draft-id tests all exercise the production paths now in use.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `none`

### Execution Self-Review Gate

- review_scope: `queue-closeout`
- version_acceptance_alignment:
  - `This queue is admitted only for ACC-FORMAT-001 and ACC-FORMAT-002, which the version spec assigns to the required-first queue.`
- parent_spec_alignment:
  - `The queue boundary preserves the parent requirement sheet without absorbing stage/menu, event-only routing, runtime-layout, or final acceptance work.`
- queue_claim_alignment:
  - `Admission plus evidence reconciliation lock the queue to creator-surface convergence and numeric-id baseline only.`
- over_narrowing_check:
  - `Evidence reconciliation proved that id conversion alone would be insufficient because mixed creator-facing structures and event authoring semantics also belong to this queue.`
- residue_or_blocker_routing_check:
  - `No blocker is recorded. Remaining non-owned acceptances stay routed to the already-recorded later queues in the version plan.`
- verification_adequacy_check:
  - `Satisfied locally by build:test, robustness coverage, lint:blueprints, lint:blueprint-skill, blueprint:governance:check, and visible browser acceptance across the changed authoring surfaces.`
- next_lawful_action_check:
  - `Attempt the repository-sync gate, then return control to the version plan for next-queue routing.`

### Runtime/Browser Acceptance Gate

- gate_required: `true`
- covered_surfaces:
  - `Script Editor people/city/building/event authoring surfaces affected by the first-phase content-format cleanup.`
- interaction_path:
  - `Creator opens the changed family editors, adds draft records, edits grouped fields, and confirms event basic-info / destination / binding separation remains visible and truthful.`
- proof_mode:
  - `human-visible-in-app-browser`
- proof_artifacts:
  - `Targeted browser acceptance notes plus automated regression coverage for changed helpers and source guards.`
- fail_closed_check:
  - `Unsupported or invalid changed structures must remain explicit validation/export failures rather than reconstructed legacy surfaces.`
- waiver_basis:
  - `none`
- simulated_human_visibility:
  - `visible-human-observed`
- interaction_semantics:
  - `Proof must use visible interaction with the rendered Script Editor controls rather than hidden state injection only.`

### Admission Preconditions

- `This queue was created only after the version plan switched to admission_status=admitted and active_queue=queue.script-editor-content-format-and-authoring-surface-unification in the same governed batch.`
- `Implementation must stay inside ACC-FORMAT-001 and ACC-FORMAT-002 ownership until queue closeout or an explicit parent-spec change.`
- `Candidate tracking remains in the version plan; this queue doc is the queue-level execution governor.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this queue, set queue_status=suspended, remove live active_task execution, and synchronize the owning version plan in the same batch.`
- `If the operator explicitly requests closing this queue before Can Claim is actually satisfied, set queue_status=dropped rather than done and route remaining residue explicitly.`
- `Do not fabricate completed acceptance, closure_basis, or topic_closure_status=closed merely because the operator asked to stop work.`

### Auto-Continue Stop Rule

- `Before ending a response while this queue still has a live active_task or while queue closeout has a uniquely lawful next action, run the workflow stop-condition self-check from the Blueprint workflow spec.`
- `If no lawful stop cause exists, do not stop at task completion, queue closeout sync, queue handoff, repository sync result recording, or status commentary; continue into the next lawful task or version-level action.`
- `If a lawful stop cause exists, the owning version plan must already contain stop_reason / stop_basis / next_unblocked_action / human_input_required before the response ends.`

### Queue Spec Integrity Rule

- `A queue spec is invalid if it can only pass by shrinking parent capability meaning down to one local seam, one happy path, or one label rewrite.`
- `Admission must stop if Parent Capability Coverage, User Path Coverage Matrix, Functional Loss Budget, Replacement Proof, or Completion Completeness Review is missing or too vague to police over-narrowing.`
- `If the queue replaces an old owner/path, old_truth_owner_exit_proof and replacement_scope_limit are mandatory.`
- `Queue closeout claims that depend on UI/editor interaction must carry Runtime/Browser Acceptance Gate evidence or an explicit waiver basis.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution, one branch-commit at queue closeout, then attempted remote-sync toward mod-first-dev.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Every completed execution queue should then attempt remote-sync toward mod-first-dev; if that remote-sync fails, record the failure and continue from written governance truth.`

### Activation Order

1. `Version-plan admission truth was written first.`
2. `This queue doc then became the active queue-level governor.`
3. `Evidence reconciliation completed and auto-promoted the active implementation task.`
4. `The next lawful action is code/test implementation inside the active task, not another admission pass.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-content-format-and-authoring-surface-unification.evidence-anchor-reconcile` | `done` | `Freeze the first queue's acceptance scope, implementation anchors, and no-over-narrowing boundary for ACC-FORMAT-001 / 002.` | `none` | `Completed from source audit: canonical allocator exists, but first-phase draft creators still emit *.new.* ids and creator-facing format drift remains across people/city/building/event surfaces.` |
| `task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation` | `done` | `Land canonical numeric draft ids, grouped creator-facing authoring surfaces, and event basic-info / destination / binding separation for the owned first-phase boundary.` | `task.script-editor-content-format-and-authoring-surface-unification.evidence-anchor-reconcile` | `Completed locally with passing build:test, robustness coverage, and the required browser acceptance notes.` |
| `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate` | `done` | `Verify ACC-FORMAT-001 / 002 coverage, classify residue honestly, and run the repository-sync gate.` | `task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation` | `Done. Commit f4ec1e20 landed on origin/mod-first-dev, so control returns to the version plan for stage/menu admission.` |

### Task Definitions

#### `task.script-editor-content-format-and-authoring-surface-unification.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-content-format-and-authoring-surface-unification.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `src/application/script-editor/script-editor-id-allocation.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/domain/script-editor-project.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Current canonical numeric-id allocator coverage and every first-phase draft-creation helper that still emits *.new.* ids.`
  - `Current people/city/building field-grouping semantics and custom-attribute authoring helpers.`
  - `Current event destination, binding, and follow-up wording in creator-facing authoring surfaces.`
- must_not_change:
  - `Do not begin code implementation before the queue records exact acceptance ownership and implementation anchors.`
  - `Do not widen this queue into stage/menu, event-only routing, runtime-layout, or final acceptance work.`
- done_when:
  - `Evidence lock is recorded with concrete source anchors for ACC-FORMAT-001 / 002.`
  - `Can Claim and Cannot Claim list the exact version acceptances this queue owns.`
  - `The queue records the exact creator-surface and id-baseline changes that belong to the first implementation batch.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Return to version review and record the blocker rather than starting implementation on a drifting boundary.`
- promote_next_if_done: `task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation`
- human_input_required: `false`
- next_lawful_action_if_done: `task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `The parent spec must change before any first-phase implementation can be selected.`
  - `The queue would have to absorb later stage/menu, runtime-layout, or event-only routing work just to land ACC-FORMAT-001 / 002.`

##### Human Context

- task_brief:
  - `Lock the first queue's implementation boundary before code changes start.`
- task_outcome_summary:
  - `Evidence reconciliation confirmed that the canonical allocator already exists but first-phase draft creation still emits legacy *.new.* ids, that people/city/building surfaces already expose structured semantics worth converging rather than flattening away, and that event authoring still needs a cleaner creator-facing separation between event record semantics and event-binding semantics. The queue therefore owns canonical id adoption plus creator-surface convergence, not a label-only cleanup.`

#### `task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation`

##### Control Block

- task_id: `task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/script-editor-id-allocation.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/change-log.md`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Every covered default record creator that still emits *.new.* ids.`
  - `Current creator-facing people/city/building/event UI and helper seams.`
- must_modify:
  - `Covered draft-creation helpers for canonical numeric ids.`
  - `Covered authoring helpers and UI surfaces needed for grouped content-format convergence.`
  - `Regression tests and change-log entries for landed code/runtime/editor behavior changes.`
- must_replace:
  - `Legacy *.new.* draft-id generation for covered families.`
  - `Developer-facing or mixed routing/binding wording inside the changed event authoring surfaces.`
- must_preserve:
  - `Title/name-first creator operation.`
  - `Existing save/load/export/import/runtime continuity for changed records.`
  - `No stage/menu/runtime-layout/event-only-routing scope expansion.`
- must_not_change:
  - `Do not widen into stage host references or menu module completion.`
  - `Do not widen into event-only runtime routing retirement.`
  - `Do not widen into runtime-layout persistence or UI layering work.`
- done_when:
  - `Covered default creators allocate canonical numeric ids instead of *.new.* ids.`
  - `Changed creator-facing surfaces use one converged content-format direction and avoid duplicate same-meaning controls.`
  - `Changed event authoring surfaces clearly separate basic info, destination, and binding semantics without developer-facing routing wording.`
  - `Build, regression, and Blueprint verification pass.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without inventing a compatibility fallback or silently narrowing queue ownership.`
- promote_next_if_done: `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate`
- human_input_required: `false`
- next_lawful_action_if_done: `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `Implementation requires parent-spec widening into later queue ownership.`
  - `Implementation can only proceed by preserving dual old/new truth.`

##### Human Context

- task_brief:
  - `Land the first implementation batch for canonical ids and creator-surface convergence.`
- task_outcome_summary:
  - `Done locally. Canonical numeric draft ids now cover the widened first-phase families and workflow fallbacks, creator-facing grouped authoring surfaces stay visible, and changed dialogue/event/minigame/event-binding copy no longer leaks implementation-facing wording.`

#### `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate`

##### Control Block

- task_id: `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate`
- state: `done`
- task_kind: `queue-closeout`
- scope:
  - `docs/blueprints/queues/script-editor-content-format-and-authoring-surface-unification-queue.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/change-log.md`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/**`
- must_inspect:
  - `Proof that ACC-FORMAT-001 / 002 are actually covered.`
  - `Whether any same-family residue remains inside content-format or id-baseline ownership.`
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
  - `ACC-FORMAT-001 or ACC-FORMAT-002 is not honestly covered.`

##### Human Context

- task_brief:
  - `Close out the first queue after verified implementation and route the next lawful queue.`
- task_outcome_summary:
- `Done. Queue closeout proof, browser acceptance, and repository-sync gating are all complete, so the next lawful action is version-plan routing into queue.stage-host-binding-and-menu-resource-runtime-convergence.`

### Progress Log

- `2026-07-26`: `Queue admitted as the required-first execution slice under target.script-editor-content-format-runtime-layout-and-module-capability-convergence.`
- `2026-07-26`: `Evidence reconciliation completed from current source truth. The queue froze ACC-FORMAT-001 / 002 ownership against canonical id allocation, mixed creator-surface grouping across person/city/building helpers, and event authoring wording that still exposes implementation-facing semantics.`
- `2026-07-26`: `The queue auto-promoted task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation as the live active task.`
- `2026-07-26`: `Active implementation widened canonical draft-id adoption across portrait/minigame/flow/story/progression creators and workflow fallbacks, and replaced the first event/minigame authoring-copy leaks that exposed project.eventBindings, reverse-reference wording, or runtime/governance jargon on creator-facing surfaces.`
- `2026-07-26`: `Local implementation proof is now complete. build:test, robustness coverage, lint:blueprints, lint:blueprint-skill, and blueprint:governance:check all pass after the canonical-id baseline and creator-facing copy cleanup batch, including the blocked minigame preview/export hint regression.`
- `2026-07-26`: `Required browser acceptance is now recorded from the in-app browser: the template project opened visibly, people and building authoring still exposed grouped creator-facing fields, event authoring kept 后续事件 / 去向类型 / 去向目标 as separate visible controls, dialogue 节点 copy no longer leaked old routing jargon, and a new minigame draft now blocks preview/export with the creator-facing hint “玩法绑定需要填写所属对话，才能运行预览或导出剧本。” instead of ownerId-style developer wording.`
- `2026-07-26`: `The queue auto-promoted task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate as the live active task. Repository-sync gating is now the only remaining lawful action before queue.stage-host-binding-and-menu-resource-runtime-convergence can be admitted.`
- `2026-07-26`: `Repository-sync gate is now satisfied. Commit f4ec1e20 landed on mod-first-dev, push to origin/mod-first-dev succeeded, and the queue closed with no remaining same-family residue inside its bounded topic surface.`
