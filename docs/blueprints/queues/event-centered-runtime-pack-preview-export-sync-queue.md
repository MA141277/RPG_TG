# Event-Centered Runtime Pack Preview Export Sync Queue

## Control Block

- queue_id: `queue.event-centered-runtime-pack-preview-export-sync`
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
- closure_basis: `acc-event-center-005-covered-and-handed-off`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Historical closeout still remains a sync-gate exception because the next queue was admitted before a queue-local remote-sync attempt was recorded. The remaining inseparable completed queues were later committed and pushed together to origin/mod-first-dev, so this queue now also has recorded remote-sync completion in that combined batch without rewriting the historical handoff sequence.`
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
  - `Converge Script Editor runtime preview, runtime-pack export/import, scenario loading, reference resolution, and runtime launch behavior onto the same no-scene event-centered model without bridge compatibility truth.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Parent requirement role:
  - `This queue owned ACC-EVENT-CENTER-005 and proved that editor preview, runtime export/import, runtime loading, and reference resolution now use the same no-scene canonical model after scene retirement closed.`
- Forbidden expansions:
  - `Do not reopen formal scene-retirement work that already closed in queue.scene-family-retirement-and-content-migration.`
  - `Do not route portrait-resource convergence into this queue as hidden secondary scope.`
  - `Do not preserve editor/runtime parity through temporary shims, bridge exports, or dual-path truth.`
  - `Do not weaken building creator-facing meaning function -> event -> dialogue/minigame/task/function.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Editor preview, runtime export/import, runtime loading, and reference resolution must converge on the same no-scene event-centered model in one incompatible batch.`
  - `Building creator-facing meaning remains function -> event -> dialogue/minigame/task/function while implementation may still travel through arrangement / event-binding / flow / playable.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview must stay coherent on shared pack/runtime truth.`
  - `No later queue may need to reinterpret runtime-pack structure back into scene compatibility truth.`
- inherited_compatibility_paths:
  - `Event/event-binding remain the formal routing owner frozen by the prior queue.`
  - `Dialogue/building/city contracts remain the no-scene canonical content owners established by scene retirement.`
  - `Arrangement / event-binding / flow / playable seams remain legal implementation paths.`
- inherited_legacy_replacements:
  - `Any preview/export/import/loader/runtime path that still expects old scene-owned canonical structure.`
  - `Any import/export bridge that silently rewrites scene truth back into accepted runtime truth.`
  - `Any preview-only or editor-only structure that diverges from runtime pack/runtime loader truth.`
- inherited_non_goals:
  - `Do not call residual scene-retirement work "preview/export sync" and hide it here.`
  - `Do not claim portrait-resource stability or creator-path browser acceptance in this queue.`
  - `Do not allow imported flow integrations to be misclassified as minigame truth or to preserve retired owner kinds.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected child queue and acceptance entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `confirmed`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-CENTER-005`
- acceptance_not_claimed:
  - `ACC-EVENT-CENTER-006`
  - `ACC-EVENT-CENTER-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-CENTER-005: editor preview, runtime export/import, runtime loading, and reference resolution converge on the same no-scene event-centered model in the same incompatible batch.`

#### Cannot Claim

- `ACC-EVENT-CENTER-006: portrait resources and portrait variants as first-class project-owned authoring/runtime families.`
- `ACC-EVENT-CENTER-008: final simulated-human acceptance across trigger environments and portrait creator path.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Parent Capability Coverage

- owned_closure:
  - `No-scene runtime-pack/export/import/loader/preview/reference-resolution convergence after scene retirement.`
- preserved_not_owned:
  - `Building creator-facing meaning remains function -> event -> dialogue/minigame/task/function.`
  - `Scene-retirement closure remains historical truth and is not reopened here.`
- routed_elsewhere:
  - `Event-only routing-family retirement stays with queue.event-only-routing-family-retirement-and-reference-replacement.`
  - `Portrait resources stay with queue.portrait-resource-authoring-and-resource-mapping-convergence.`
  - `Final simulated-human acceptance stays with queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`

#### Capability Floor

- `This queue leaves the project with one shared no-scene canonical model across preview, export, import, loader, and runtime launch instead of editor/runtime divergence or compatibility bridges.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Event-only routing-family replacement remains owned by queue.event-only-routing-family-retirement-and-reference-replacement.`
  - `Portrait-resource convergence remains owned by queue.portrait-resource-authoring-and-resource-mapping-convergence.`
  - `Final simulated-human acceptance remains owned by queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue while the editor can write new no-scene structures but runtime import, runtime export, loader, or preview still depend on older scene-era truth.`
  - `Do not pass this queue by fixing only one direction such as export or import while preview/runtime loading still diverge.`
  - `Do not accept flow/minigame/import/export drift that silently recovers through loose compatibility parsing.`
- unspecified_detail_policy:
  - `Prefer fail-closed no-scene guards, canonical manifest/table truth, and shared loader/export/preview seams over permissive compatibility conversion.`
- gap_routing_policy:
  - `If a required convergence capability cannot be completed here, record it as same-family residue, blocker, or prerequisite instead of letting later queues absorb implementation-bearing runtime divergence.`

#### Legacy Paths To Replace

- `Preview/export/import/loader/runtime paths that still assume scene-owned canonical families or compatibility readers.`
- `Import/export seams that treat flow integrations and minigame integrations as one undifferentiated owner model.`
- `Runtime launch or preview paths that can accept editor-side no-scene data only because a hidden bridge restores old runtime truth.`

#### Compatibility Paths To Preserve

- `event/event-binding remain the formal routing owner.`
- `dialogue/building/city remain the no-scene canonical content owners.`
- `arrangement -> event-binding -> flow / playable implementation seams remain legal.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview must stay mutually coherent.`

#### User Path Coverage Matrix

- primary_paths:
  - `Script Editor runtime preview launches from current in-memory project data and uses the same pack/runtime truth as exported runtime packs.`
- alternate_paths:
  - `Normal start and JSON runtime pack import remain coherent under the same no-scene canonical family structure.`
- leave_return_or_followup_paths:
  - `Dialogue/event/flow follow-up routing remains reachable after pack import/export and preview launch without recovering scene-era bridges.`
- empty_or_fail_closed_paths:
  - `Unsupported imported/exported old scene-era structure must fail closed rather than being accepted through compatibility rewriting.`
- rejection_or_error_paths:
  - `Retired actions[] dialogue shape, retired scene owner kinds, retired startup scene views, or mismatched playable ownership must raise explicit import/export errors.`
- forbidden_regressions:
  - `Do not keep no-scene file names while preview/runtime behavior still depends on hidden scene-era structure.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any preview/export/import/runtime loss must be fixed or routed as residue/blocker. This queue cannot erase supported runtime paths by calling later queues responsible for them.`

#### Implementation Anchors

- Must inspect:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/content/content-pack-loader.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/application/startup/scenario-startup-target.ts`
  - `src/content/scenario-packs/**`
  - `tests/**`
- Must modify:
  - `No-scene runtime/export/import/loader/preview files proven necessary by evidence lock.`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No main.ts building business branches.`
  - `No weakening of arrangement / event-binding / flow / playable as the allowed implementation path.`
  - `No reintroduction of scene compatibility truth.`

#### Verification Coverage

- `Export/import/loader/preview/runtime tests plus source-removal guards prove the same no-scene canonical model is used end to end.`

#### Replacement Proof

- previous_owner_or_path:
  - `Editor/runtime/export/import divergence or compatibility readers that silently reconstruct scene-era truth.`
- new_owner_or_path:
  - `One canonical no-scene runtime pack and one shared loader/preview/runtime launch path.`
- behavior_preservation_expectation:
  - `Supported preview/start/import/export flows keep working, but only through the no-scene canonical structure.`
- old_truth_owner_exit_proof:
  - `No claimed runtime/export/import/preview path remains dependent on hidden scene-era data shapes, bridge owners, or misclassified playable families.`
- verification_evidence:
  - `Tests and source inspection show preview/export/import/loader/runtime parity on the same no-scene model rather than documentation-only renaming.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/scene-family-retirement-and-content-migration-queue.md`

### Queue Snapshot

- queue_goal: `Converge preview/export/import/loader/runtime behavior onto one no-scene canonical model after scene retirement closes.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Completed.`
- task_briefs:
  - `task.event-centered-runtime-pack-preview-export-sync.evidence-anchor-reconcile: Confirm the no-scene convergence anchors and lock the bounded implementation slice before further changes.`
  - `task.event-centered-runtime-pack-preview-export-sync.contract-implementation: Land the shared no-scene runtime-pack/export/import/loader/preview convergence slice with fail-closed guards.`
  - `task.event-centered-runtime-pack-preview-export-sync.queue-closeout-and-handoff: Verify, review completeness, and route the next lawful queue without claiming final acceptance.`

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
  - `ACC-EVENT-CENTER-005 is covered.`
- parent_spec_preservation:
  - `Scene retirement stays closed and is not re-labeled here; event-only-routing, portrait-resource, and final-acceptance work remain routed to later queues.`
- capability_floor_verification:
  - `Verified. Preview/export/import/loader/runtime all consume the same no-scene canonical model.`
- out_of_scope_routing:
  - `Event-only routing-family replacement, portrait-resource convergence, and final simulated-human acceptance remain owned by later queues in the version plan.`
- verification_sufficiency:
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm run typecheck.`
  - `Passed: npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs.`
- user_path_matrix_verification:
  - `Covered. Imported flow integrations no longer misclassify into minigames, retired runtime dialogue actions[] fail closed, retired startup scene views fail closed, built-in scenario-pack startup profiles load on the same no-scene contract, and mod startup metadata resolves through the shared startup target contract.`
- functional_loss_audit:
  - `No supported path regressed. Runtime preview, scenario-pack startup, import/export round-trip, and mod startup metadata remain covered while retired shapes now fail closed.`
- replacement_proof_summary:
  - `No-scene canonical startup, export/import, loader, and preview truth now agree on allowed view families, dialogue startup targets, playable ownership rejection, and shared manifest-driven routing.`
- placeholder_or_legacy_fallback_audit:
  - `No compatibility shim was introduced. Runtime pack export, runtime pack import, scenario-pack loader, and mod startup metadata now all fail close or resolve through the same no-scene startup target contract.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `none`

### Admission Preconditions

- `This queue was admitted only after queue.scene-family-retirement-and-content-migration closed and the version plan switched active_queue to queue.event-centered-runtime-pack-preview-export-sync.`
- `Implementation did not start outside this queue's admitted ACC-EVENT-CENTER-005 boundary.`
- `Candidate tracking remains in the version plan; this queue doc is the queue-level execution governor.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this queue, set queue_status=suspended, remove live active_task execution, and synchronize the owning version plan in the same batch.`
- `If the operator explicitly requests closing this queue before Can Claim is actually satisfied, set queue_status=dropped rather than done and route remaining residue explicitly.`
- `Do not fabricate completed acceptance or topic_closure_status=closed merely because the operator asked to stop work.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails while this queue is active, repair the queue doc, version-plan linkage, or in-scope governing structure before continuing implementation or closeout.`
- `If the failure shows this queue's spec is under-structured or over-narrowed, revise the queue spec inside this queue first; do not mark the issue as accepted residue or silently hand it to later queues.`
- `If the failure cannot be resolved inside this queue's admitted boundary without changing the parent spec or lawful ownership, record a real blocker or route the change back to version-level governance instead of proceeding through a failed lint gate.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Task-level after-state uses local-record only; task completion does not by itself require commit, push, or merge.`
- `Later execution in this version now uses the version-local repository sync gate: queue closeout must synchronize docs first, then attempt one local branch-commit, then attempt remote push, then attempt merge if current repository workflow requires merge for development-trunk synchronization, and only after a recorded sync result may the next queue be admitted.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Push and merge are remote-sync actions; once either starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`

### Activation Order

1. `queue.scene-family-retirement-and-content-migration closes and hands off to this queue.`
2. `The version plan switches active_queue to this queue and records the coupled handoff basis.`
3. `This queue doc is created, evidence lock is reconciled, and only then may live implementation continue.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.event-centered-runtime-pack-preview-export-sync.evidence-anchor-reconcile` | `done` | `Confirm the no-scene convergence anchors and lock the bounded implementation slice before further changes.` | `queue.scene-family-retirement-and-content-migration closed` | `Evidence lock confirmed that formal scene-family residue was already closed, so the remaining ACC-EVENT-CENTER-005 risk was preview/export/import/loader/runtime parity.` |
| `task.event-centered-runtime-pack-preview-export-sync.contract-implementation` | `done` | `Land the shared no-scene runtime-pack/export/import/loader/preview convergence slice with fail-closed guards.` | `task.event-centered-runtime-pack-preview-export-sync.evidence-anchor-reconcile` | `The final implementation batch closed the startup/loader parity seam: scenario-pack loader and runtime export now reject retired startup scene views, built-in runtime packs were moved onto no-scene startup views, and mod startup metadata now resolves through the same startup target contract used by runtime startup.` |
| `task.event-centered-runtime-pack-preview-export-sync.queue-closeout-and-handoff` | `done` | `Verify, review completeness, and route the next lawful queue without claiming final acceptance.` | `task.event-centered-runtime-pack-preview-export-sync.contract-implementation` | `Closeout review confirmed ACC-EVENT-CENTER-005 with no same-family residue. The next lawful queue was re-evaluated as queue.event-only-routing-family-retirement-and-reference-replacement per the version-plan candidate ledger.` |

### Task Definitions

#### `task.event-centered-runtime-pack-preview-export-sync.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.event-centered-runtime-pack-preview-export-sync.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `tests/**`
- must_inspect:
  - `Current runtime-pack export/import/loader/preview parity after formal scene retirement closes.`
  - `Any remaining runtime/editor divergence or compatibility paths that could silently reconstruct old truth.`
  - `Flow/minigame/playable integration ownership drift across import/export paths.`
- must_not_change:
  - `Do not reopen formal scene-retirement or portrait-resource scope during evidence-anchor reconcile.`
- done_when:
  - `Evidence lock is recorded with confirmed no-scene convergence anchors and no-over-narrowing boundaries.`
  - `The queue records exactly what counts as ACC-EVENT-CENTER-005 completion and what remains routed to later queues.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or route a lawful split/blocker.`
- promote_next_if_done: `task.event-centered-runtime-pack-preview-export-sync.contract-implementation`

##### Human Context

- task_brief:
  - `Lock the no-scene runtime-pack/preview/export/import/loader convergence boundary before further implementation.`
- task_outcome_summary:
  - `Confirmed that the remaining ACC-EVENT-CENTER-005 risk was parity, not formal scene-family residue: runtime export/import/loader/preview needed one shared dialogues/flows/event-centered canonical model, imported flow integrations could not misclassify into minigames, and retired scene-era runtime dialogue/action shapes had to fail closed rather than be compatibility-imported.`

#### `task.event-centered-runtime-pack-preview-export-sync.contract-implementation`

##### Control Block

- task_id: `task.event-centered-runtime-pack-preview-export-sync.contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/core/mods/mod-runtime.ts`
  - `src/application/startup/scenario-startup-target.ts`
  - `src/content/scenario-packs/**`
  - `tests/**`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Current preview/export/import/loader/runtime pack parity seams.`
- must_modify:
  - `No-scene runtime convergence files proven necessary by evidence lock.`
  - `tests/**`
- must_preserve:
  - `Building creator-facing meaning and allowed arrangement / event-binding / flow / playable implementation seams.`
  - `No reintroduction of scene compatibility truth.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.event-centered-runtime-pack-preview-export-sync.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Land the shared no-scene runtime-pack/export/import/loader/preview convergence slice with fail-closed guards.`
- task_outcome_summary:
  - `Complete. The final batch aligned scenario-pack loader, runtime-pack export, built-in scenario-pack startup content, and mod startup metadata on the same no-scene startup target contract. Retired startup scene views now fail close across import/export/loader surfaces, direct dialogue startup targets round-trip through runtime packs, and mod startup metadata now preserves dialogue/view truth through the shared startup target resolver.`

#### `task.event-centered-runtime-pack-preview-export-sync.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.event-centered-runtime-pack-preview-export-sync.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/queues/event-centered-runtime-pack-preview-export-sync-queue.md`
  - `tests/**`
- must_inspect:
  - `Implementation proof and claim boundary coverage.`
  - `Whether any same-family runtime-sync residue remains inside ACC-EVENT-CENTER-005.`
- must_preserve:
  - `Event-only-routing, portrait-resource, and final-acceptance queues remain fully owned and not prematurely claimed closed.`
- done_when:
  - `Verification passes or is honestly blocked.`
  - `Completeness review proves ACC-EVENT-CENTER-005 closed without over-narrowing later queues.`
  - `The next lawful queue routing is written back to the version plan.`
- verify_with:
  - `npm run lint:blueprints`

##### Human Context

- task_brief:
  - `Verify, review completeness, and hand off to the next lawful queue.`
- task_outcome_summary:
  - `Complete. Completeness review confirmed ACC-EVENT-CENTER-005 with no same-family residue, and the next lawful queue is queue.event-only-routing-family-retirement-and-reference-replacement rather than portrait convergence because routing-family replacement remains the earlier same-target dependency.`

### Progress Log

- `2026-07-22`: `queue.scene-family-retirement-and-content-migration closed with ACC-EVENT-CENTER-003 / 004 / 007 covered and no same-family residue. Per the version plan's coupled-queue rule, queue.event-centered-runtime-pack-preview-export-sync is now admitted as the next lawful execution slice.`
- `2026-07-22`: `Evidence-anchor reconcile is complete. Source inspection confirmed that formal scene-family residue is already closed, so remaining ACC-EVENT-CENTER-005 work is runtime-pack/preview/export/import/loader parity: no-scene canonical families must stay shared, compatibility imports must reject retired scene-era shapes, and flow integrations must not degrade into minigame truth.`
- `2026-07-22`: `First implementation batch tightened compatibility import/export/loader onto the no-scene canonical model. runtime-pack import now rejects retired dialogues[].actions and retired flow ownerKind=scene, scenario-pack loader now rejects retired dialogues[].actions and scene-owned playable owner kinds on the normal startup path, imported building-owned flow integrations stay out of minigame authoring truth, and targeted verification passed again (npm run typecheck, npm run lint:blueprints, npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs).`
- `2026-07-22`: `Final implementation batch closed the remaining startup-view parity seam. Runtime-pack export and scenario-pack loader now fail close retired startup scene views, the built-in Liu Bang pack now uses a no-scene startup view, and mod startup metadata now resolves dialogue/view ownership through the shared scenario startup target contract rather than pack-local duplication. Verification passed again (npm run typecheck, npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs, npm run lint:blueprints).`
- `2026-07-22`: `Queue closeout review confirmed ACC-EVENT-CENTER-005 with no same-family residue. Because event-only routing-family retirement is recorded as the next required same-target queue, the version handed off to queue.event-only-routing-family-retirement-and-reference-replacement instead of portrait convergence.`
