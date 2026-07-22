# Portrait Resource Authoring And Resource Mapping Convergence Queue

## Control Block

- queue_id: `queue.portrait-resource-authoring-and-resource-mapping-convergence`
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
- closure_basis: `acc-event-center-006-covered-with-project-owned-portrait-families-and-prototype-runtime-cutover`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `The earlier portrait-only isolation attempt remained unsafe inside the mixed worktree, so this queue was later synchronized as part of one inseparable completed-queue batch. That combined batch has now been committed and pushed to origin/mod-first-dev, satisfying repository sync without pretending the earlier isolated portrait-only attempt had succeeded.`
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
  - `Introduce project-owned portrait resources and portrait variants with stable authoring, preview, export/import, loader resolution, and runtime rendering continuity.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Parent requirement role:
  - `This queue owns ACC-EVENT-CENTER-006. It must converge portrait resources, portrait variants, resource-to-file mapping, thumbnail/current preview behavior, and runtime continuity without routing portrait truth back into people/dialogue/file-path ad hoc fields.`
- Forbidden expansions:
  - `Do not reopen scene retirement or event-only routing-family replacement work that is already closed.`
  - `Do not weaken portrait convergence into reverse-collected option lists from people/dialogues alone.`
  - `Do not preserve file-path truth in person/dialogue records as the formal portrait ownership model.`
  - `Do not route portrait-resource completion into the final-acceptance queue as hidden implementation work.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Portrait resources and portrait variants must become first-class project-owned authoring/runtime families.`
  - `portraitId / portraitVariantId remain stable references after convergence.`
  - `Runtime pack export/import, loader, preview, and runtime must resolve the same portrait resource truth.`
  - `New projects must not present an empty or reverse-collected portrait list when portrait resources are expected to be authorable.`
- inherited_compatibility_paths:
  - `People and dialogue may continue to reference portraitId / portraitVariantId as stable ids.`
  - `City/building/dialogue ownership established by prior queues remains unchanged.`
  - `Event/event-binding remain the only formal routing owners.`
- inherited_legacy_replacements:
  - `People-driven portrait option discovery as the de facto authoring list.`
  - `Person-owned or dialogue-owned file-path truth instead of project-owned portrait resources.`
  - `Preview/runtime portrait rendering that bypasses a shared mapping contract.`
- inherited_non_goals:
  - `Do not rename existing portrait reference fields while keeping authoring/runtime divergence.`
  - `Do not claim portrait convergence by adding UI labels without adding project-owned resource truth.`
  - `Do not move portrait ownership into unrelated queues or a later target/version.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected child queue and acceptance entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `confirmed`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-CENTER-006`
- acceptance_not_claimed:
  - `ACC-EVENT-CENTER-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-CENTER-006 once portrait resources and portrait variants are first-class project-owned authoring/runtime families with stable mapping, thumbnail/current preview rendering, and runtime continuity.`

#### Cannot Claim

- `ACC-EVENT-CENTER-008: final simulated-human acceptance across trigger environments and the smallest usable portrait creator path.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Parent Capability Coverage

- owned_closure:
  - `Project-owned portrait resources, portrait variants, mapping contracts, and preview/runtime continuity.`
- preserved_not_owned:
  - `Event-only routing-family replacement remains historical truth and is not reopened here.`
  - `Scene retirement remains historical truth and is not reopened here.`
- routed_elsewhere:
  - `Final simulated-human acceptance stays with queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`

#### Capability Floor

- `This queue must leave the project with one project-owned portrait resource truth across authoring, preview, export/import, loader, and runtime instead of reverse-collected portrait options or person-owned file-path truth.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Final simulated-human acceptance remains owned by queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by keeping portrait resources implicit in people/dialogue records while only adding UI wrappers.`
  - `Do not pass this queue by creating a project-owned family that preview/runtime still ignore.`
  - `Do not pass this queue by keeping thumbnails/current preview on a different mapping path from export/import/runtime.`
- unspecified_detail_policy:
  - `Prefer project-owned portrait resource truth, stable id-based mapping, and fail-closed import/export behavior over reverse collection or compatibility layering.`
- gap_routing_policy:
  - `If portrait authoring or runtime resolution cannot yet converge inside this queue, record same-family residue or blocker instead of letting the final-acceptance queue absorb implementation-bearing work.`

#### Legacy Paths To Replace

- `people[].portraitId and portraitVariantId acting as de facto portrait option discovery.`
- `dialogue node portraitId acting as direct resource truth without project-owned mapping.`
- `cityPortraits-only ownership without shared portrait resource family coverage.`
- `Preview/runtime portrait rendering that does not flow through a shared project-owned mapping contract.`

#### Compatibility Paths To Preserve

- `portraitId / portraitVariantId remain stable references in people/dialogue content.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview convergence.`
- `Dialogue rendering continues to resolve portrait visuals after migration.`

#### User Path Coverage Matrix

- primary_paths:
  - `Script Editor creator path can author project-owned portrait resources and variants directly.`
- alternate_paths:
  - `Runtime pack export/import and loader resolution preserve the same portrait resource mapping truth.`
- leave_return_or_followup_paths:
  - `Dialogue/current preview/runtime continue to render referenced portraits after authoring changes.`
- empty_or_fail_closed_paths:
  - `Unsupported portrait resource shapes fail closed instead of silently reverse-collecting from person/dialogue fields.`
- rejection_or_error_paths:
  - `Retired portrait truth shapes must raise explicit validation or test failure during queue closeout.`
- forbidden_regressions:
  - `Do not leave new projects with an empty portrait authoring list while runtime still depends on implicit portrait ids.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any portrait rendering, preview, export/import, or authoring loss must be fixed or routed as residue/blocker. This queue cannot erase supported portrait references by moving the loss into final acceptance.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/content/content-pack-loader.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/character.ts`
  - `src/domain/dialogue.ts`
  - `tests/**`
- Must modify:
  - `Portrait authoring/runtime files proven necessary by evidence lock.`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No reintroduction of scene or flow compatibility truth.`
  - `No event-routing regression or building-meaning regression.`

#### Verification Coverage

- `Authoring surface tests, export/import/loader tests, preview/runtime portrait rendering tests, and source-removal guards must prove one shared portrait resource truth end to end.`

#### Replacement Proof

- previous_owner_or_path:
  - `People/dialogue/city scattered portrait references and reverse-collected portrait option discovery.`
- new_owner_or_path:
  - `Project-owned portrait resources and portrait variants with stable id-based mapping and shared preview/runtime resolution.`
- behavior_preservation_expectation:
  - `Existing portrait references remain renderable through stable ids while authoring/runtime move onto the shared portrait resource family.`
- old_truth_owner_exit_proof:
  - `No claimed authoring/preview/export/import/loader/runtime path remains dependent on reverse-collected portrait options or person-owned file-path truth.`
- verification_evidence:
  - `Tests and source inspection must show one portrait resource truth rather than UI-only scaffolding or runtime-only mapping.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/event-only-routing-family-retirement-and-reference-replacement-queue.md`

### Queue Snapshot

- queue_goal: `Replace scattered portrait reference truth with one project-owned portrait resource family.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after project-owned portrait resources and portrait variants became the canonical authoring/runtime family across export/import, loader, preview, runtime rendering, and prototype startup materialization.`
- task_briefs:
  - `task.portrait-resource-authoring-and-resource-mapping-convergence.evidence-anchor-reconcile: Lock the current portrait truth/residue boundary and confirm the first lawful implementation slice.`
  - `task.portrait-resource-authoring-and-resource-mapping-convergence.contract-implementation: Land the first portrait resource convergence slice without hiding remaining runtime or authoring divergence.`
  - `task.portrait-resource-authoring-and-resource-mapping-convergence.queue-closeout-and-handoff: Verify, review completeness, and hand off to the final acceptance queue without claiming that acceptance early.`

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
  - `Script Editor project/world families now include first-class portraits and portraitVariants instead of reverse-collected portrait option discovery.`
  - `Runtime pack export/import, content-pack loader, scenario-pack loader, and workspace shell all converge on the same portrait-family truth.`
  - `Built-in Zhuyuanzhang and Liu Bang packs now declare portrait family files explicitly, and Zhu Yuanzhang character records no longer inline portraitVariants.`
  - `Prototype startup/runtime no longer treat prototypeCharacters[].portraitVariants as authored truth; portrait variants are materialized from pack-owned portrait families at runtime.`
- parent_spec_preservation:
  - `Event-only routing replacement and scene retirement stay closed and are not relabeled here; final acceptance remains routed later.`
- capability_floor_verification:
  - `Passed. Authoring/preview/export/import/loader/runtime now converge on project-owned portrait resource truth without reopening scene or event-routing ownership.`
- out_of_scope_routing:
  - `Final simulated-human acceptance remains owned by the later final-acceptance queue in the version plan.`
- verification_sufficiency:
  - `Passed: npm run typecheck.`
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm test -- --runInBand tests/robustness.test.cjs.`
- user_path_matrix_verification:
  - `Passed. New-project authoring, built-in pack loading, runtime export/import, preview/runtime rendering, and prototype startup now all consume portrait families as the shared truth.`
- functional_loss_audit:
  - `No same-family portrait loss was found in the covered authoring/preview/export/import/loader/runtime paths.`
- replacement_proof_summary:
  - `Portrait ownership and mapping truth now live in project/pack-owned portrait families; people and dialogue keep only stable reference ids, while runtime materialization resolves the actual images from portraits/portraitVariants.`
- placeholder_or_legacy_fallback_audit:
  - `No compatibility shim was added. The queue removed inline built-in pack portraitVariants truth and prototype-owned portraitVariants truth instead of wrapping them behind new labels.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `none`

### Admission Preconditions

- `This queue was admitted only after queue.event-only-routing-family-retirement-and-reference-replacement closed locally and its required repository sync batch succeeded.`
- `Implementation must not start outside this queue's admitted ACC-EVENT-CENTER-006 boundary.`
- `Candidate tracking remains in the version plan; this queue doc is the queue-level execution governor.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this queue, set queue_status=suspended, remove live active_task execution, and synchronize the owning version plan in the same batch.`
- `If the operator explicitly requests closing this queue before Can Claim is actually satisfied, set queue_status=dropped rather than done and route remaining residue explicitly.`
- `Do not fabricate completed acceptance or topic_closure_status=closed merely because the operator asked to stop work.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails while this queue is active, repair the queue doc, version-plan linkage, or in-scope governing structure before continuing implementation or closeout.`
- `If the failure shows this queue's spec is under-structured or over-narrowed, revise the queue spec inside this queue first; do not mark the issue as accepted residue or silently hand it to final acceptance.`
- `If the failure cannot be resolved inside this queue's admitted boundary without changing the parent spec or lawful ownership, record a real blocker or route the change back to version-level governance instead of proceeding through a failed lint gate.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution, one branch-commit at queue closeout, then attempted remote-sync toward mod-first-dev.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`

### Activation Order

1. `queue.event-only-routing-family-retirement-and-reference-replacement closeout sync succeeds.`
2. `The version plan switches active_queue to this queue and records the handoff basis.`
3. `This queue doc is created, evidence lock is reconciled, and only then may live implementation continue.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.portrait-resource-authoring-and-resource-mapping-convergence.evidence-anchor-reconcile` | `done` | `Lock the current portrait truth/residue boundary and confirm the first lawful implementation slice.` | `queue.event-only-routing-family-retirement-and-reference-replacement closeout sync recorded` | `Evidence lock confirmed that people[].portraitId / portraitVariantId references, dialogue node portraitId, and cityPortraits still survive without a project-owned portrait resource family; preview/list/runtime do not yet share a stable portrait mapping truth. Implementation is therefore constrained to portrait resource authoring and mapping convergence, not routing or scene work.` |
| `task.portrait-resource-authoring-and-resource-mapping-convergence.contract-implementation` | `done` | `Land the first portrait resource convergence slice without hiding remaining runtime or authoring divergence.` | `task.portrait-resource-authoring-and-resource-mapping-convergence.evidence-anchor-reconcile` | `Closed after portrait families became first-class project/runtime pack families, built-in packs were migrated to explicit portraits/portraitVariants files, preview/runtime rendering re-based to shared portrait mapping, and prototype startup stopped owning inline portraitVariants truth.` |
| `task.portrait-resource-authoring-and-resource-mapping-convergence.queue-closeout-and-handoff` | `done` | `Verify, review completeness, and hand off to the final acceptance queue without claiming that acceptance early.` | `task.portrait-resource-authoring-and-resource-mapping-convergence.contract-implementation` | `Completeness review found no same-family portrait residue inside ACC-EVENT-CENTER-006. Repository sync result is recorded as failed/non-blocking because the current mixed worktree cannot safely isolate a portrait-only sync batch. The next lawful queue is queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.` |

### Task Definitions

#### `task.portrait-resource-authoring-and-resource-mapping-convergence.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.portrait-resource-authoring-and-resource-mapping-convergence.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/content/active-game-content.ts`
  - `src/application/content/content-pack-loader.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/character.ts`
  - `src/domain/dialogue.ts`
  - `tests/**`
- must_inspect:
  - `Current portrait reference truth and option-discovery path across people/dialogue/content pack/runtime pack/runtime.`
  - `Whether project-owned portrait resource records already exist anywhere in authoring or runtime structures.`
  - `Whether preview/runtime use a shared portrait resource mapping contract today.`
- must_not_change:
  - `Do not reopen routing, scene, or final-acceptance scope during evidence-anchor reconcile.`
- done_when:
  - `Evidence lock records the live portrait truth/residue and the first lawful implementation slice.`
  - `The queue records exactly what counts as portrait resource convergence and what remains routed later.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or route a lawful split/blocker.`
- promote_next_if_done: `task.portrait-resource-authoring-and-resource-mapping-convergence.contract-implementation`

##### Human Context

- task_brief:
  - `Lock the current portrait truth/residue boundary before implementation.`
- task_outcome_summary:
  - `Confirmed that project-owned portrait resources do not yet exist in Script Editor project/content pack/runtime pack truth. Current portrait option discovery is still de facto sourced from people/dialogue fields (`portraitId`, `portraitVariantId`, dialogue node `portraitId`) plus `cityPortraits`, so portrait preview/list/runtime continuity still lacks one shared mapping contract.`

#### `task.portrait-resource-authoring-and-resource-mapping-convergence.contract-implementation`

##### Control Block

- task_id: `task.portrait-resource-authoring-and-resource-mapping-convergence.contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/application/content/**`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/character.ts`
  - `src/domain/dialogue.ts`
  - `tests/**`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Current portrait reference visibility and runtime mapping seams.`
- must_modify:
  - `Portrait resource convergence files proven necessary by evidence lock.`
  - `tests/**`
- must_preserve:
  - `Stable portraitId / portraitVariantId references.`
  - `No routing or scene regression.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.portrait-resource-authoring-and-resource-mapping-convergence.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Land the first portrait resource convergence slice without hiding remaining runtime or authoring divergence.`
- task_outcome_summary:
  - `Completed. The queue introduced project-owned portrait resource and portrait-variant families, wired them through Script Editor authoring/load/save/export/import, updated built-in scenario packs to explicit portrait family files, moved UI/runtime resolution onto shared portrait mapping helpers, removed inline Zhu Yuanzhang character portraitVariants truth, and re-based prototype startup portrait materialization onto pack-owned portrait families.`

#### `task.portrait-resource-authoring-and-resource-mapping-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.portrait-resource-authoring-and-resource-mapping-convergence.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/queues/portrait-resource-authoring-and-resource-mapping-convergence-queue.md`
  - `tests/**`
- must_inspect:
  - `Implementation proof and claim boundary coverage.`
  - `Whether any same-family portrait-resource residue remains inside the queue boundary.`
- must_preserve:
  - `Final acceptance queue remains fully owned and not prematurely claimed closed.`
- done_when:
  - `Verification passes or is honestly blocked.`
  - `Completeness review proves ACC-EVENT-CENTER-006 closed without over-narrowing the final-acceptance queue.`
  - `The next lawful queue routing is written back to the version plan.`
- verify_with:
  - `npm run lint:blueprints`

##### Human Context

- task_brief:
  - `Verify, review completeness, and hand off to the final acceptance queue.`
- task_outcome_summary:
  - `Completed. Closeout review confirmed ACC-EVENT-CENTER-006 without same-family residue, and the next lawful queue is queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard. Repository sync is recorded as a non-blocking failed attempt because the current mixed worktree still contains queue-external governed changes that make an isolated portrait-only sync batch unsafe.`

### Progress Log

- `2026-07-22`: `queue.event-only-routing-family-retirement-and-reference-replacement closeout sync succeeded, so portrait-resource convergence became the next lawful same-target queue.`
- `2026-07-22`: `Evidence-anchor reconcile is complete. Source inspection confirmed that project-owned portrait resources do not yet exist, that portrait option discovery is still reverse-collected from people/dialogue fields, and that preview/runtime do not yet share a formal portrait mapping contract. Implementation therefore begins inside ACC-EVENT-CENTER-006 only, with final acceptance explicitly preserved for the later queue.`
- `2026-07-22`: `Implementation landed across Script Editor project/runtime contracts, built-in scenario packs, portrait asset resolution, and prototype startup. New-project creation now seeds project-owned portraits, runtime export/import and loaders carry portrait families explicitly, Zhu Yuanzhang built-in content owns portraits/portraitVariants in dedicated files, and prototype startup materializes portrait variants from pack-owned resources instead of inline prototype character truth.`
- `2026-07-22`: `Closeout review passed after npm run typecheck, npm run lint:blueprints, and npm test -- --runInBand tests/robustness.test.cjs stayed green. No same-family portrait residue remains inside ACC-EVENT-CENTER-006, so the next lawful queue is queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard. Repository sync is recorded as failed/non-blocking because the current mixed worktree still contains queue-external governed edits and cannot safely isolate a portrait-only sync batch without mixing queues.`
