# Scene Family Retirement And Content Migration Queue

## Control Block

- queue_id: `queue.scene-family-retirement-and-content-migration`
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
- closure_basis: `ACC-EVENT-CENTER-003 / 004 / 007 are now covered: scene is no longer a formal authoring/project/runtime/startup/presenter family, building creator-facing meaning remains function -> event -> dialogue/minigame/task/function, and no same-family scene compatibility residue remains in production truth.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `queue.event-centered-runtime-pack-preview-export-sync`
- auto_continue_eligible: `true`
- next_effect: `promote-next-queue`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Historical handoff still predates the later formal repository-sync gate, but the inseparable remaining completed-queue batch was later committed and pushed to origin/mod-first-dev in one combined remote-sync pass, so this queue now has recorded remote-sync completion without rewriting the earlier handoff chronology.`
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
  - `Retire scene as a formal authoring/project/runtime/startup/presenter family, migrate its content responsibilities into dialogue and location ownership, and preserve building creator-facing meaning through the event-centered model without compatibility residue.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Parent requirement role:
  - `This queue owns ACC-EVENT-CENTER-003, ACC-EVENT-CENTER-004, and ACC-EVENT-CENTER-007. It must remove scene as a formal truth family and migrate scene-owned content into dialogue/building/city ownership before runtime/export sync begins.`
- Forbidden expansions:
  - `Do not claim runtime pack / loader / preview / export convergence in this queue.`
  - `Do not route portrait-resource convergence into this queue as hidden secondary scope.`
  - `Do not preserve scene through compatibility layering, temporary shims, bridge readers/writers, or dual-path truth.`
  - `Do not weaken building creator-facing meaning function -> event -> dialogue/minigame/task/function.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `scene must be removed from Script Editor visible families, project formal structure, runtime pack canonical families, runtime state truth, startup truth, and presenter truth.`
  - `background ownership must move to building/city/building-arrangement surfaces, while narration, speaker lines, portraits, and choices migrate into dialogue authoring.`
  - `Building creator-facing meaning remains function -> event -> dialogue/minigame/task/function while implementation may still travel through arrangement / event-binding / flow / playable.`
  - `No compatibility residue may survive for SceneDefinition, ActionNode, project.scenes, scenes.json, entrySceneId, nextSceneId, activeSceneId, scene runtime/session truth, or dialogue-to-scene lowering seams.`
- inherited_compatibility_paths:
  - `Event/event-binding routing truth frozen by ACC-EVENT-CENTER-002 remains the legal route owner while this queue migrates content and removes scene truth.`
  - `arrangement / event-binding / flow / playable implementation seams remain legal while creator-facing scene ownership is retired.`
- inherited_legacy_replacements:
  - `SceneDefinition and ActionNode as canonical authored/runtime content owners.`
  - `project.scenes and scenes.json as formal project/runtime families.`
  - `entrySceneId, nextSceneId, activeSceneId, and scene-local callback chains as surviving compatibility residue.`
  - `dialogue-story-runtime-materializer and scene-runner as canonical runtime lowering/dispatch truth.`
- inherited_non_goals:
  - `Do not call hidden scene compatibility residue "temporary" and still count the queue done.`
  - `Do not widen into runtime/export/import convergence merely because runtime loaders also mention scenes today.`
  - `Do not move portrait-resource authoring, variants, or mapping into this queue.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first, then reconcile every affected child queue and acceptance entry before treating any capability as removed, retired, or unsupported.`

### Evidence Lock

- evidence_lock_status: `confirmed`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-CENTER-003`
  - `ACC-EVENT-CENTER-004`
  - `ACC-EVENT-CENTER-007`
- acceptance_not_claimed:
  - `ACC-EVENT-CENTER-005`
  - `ACC-EVENT-CENTER-006`
  - `ACC-EVENT-CENTER-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-CENTER-003: scene is removed from Script Editor visible families, project formal structure, runtime pack canonical families, runtime state truth, startup truth, and presenter truth.`
- `ACC-EVENT-CENTER-004: building creator-facing meaning remains function -> event -> dialogue/minigame/task/function after scene migration.`
- `ACC-EVENT-CENTER-007: no compatibility residue remains for scenes.json, SceneDefinition, ActionNode, entrySceneId, nextSceneId, activeSceneId, scene runtime/session truth, or dialogue-to-scene lowering seams.`

#### Cannot Claim

- `ACC-EVENT-CENTER-005: editor preview, runtime export/import, loader, and reference-resolution convergence on the no-scene model.`
- `ACC-EVENT-CENTER-006: portrait resource authoring and mapping convergence.`
- `ACC-EVENT-CENTER-008: final simulated-human acceptance across trigger environments and portrait creator path.`
- `Out-of-scope means not implemented by this queue; it does not mean retired, removed, or unsupported unless the parent spec was updated first.`

#### Parent Capability Coverage

- owned_closure:
  - `Formal scene retirement from authoring/project/runtime/startup/presenter truth and migration of scene-owned content into dialogue/building/city ownership.`
  - `Removal of scene compatibility residue such as SceneDefinition, ActionNode, project.scenes, scenes.json, entrySceneId, nextSceneId, activeSceneId, and dialogue-to-scene lowering seams.`
- preserved_not_owned:
  - `Event/event-binding remain the formal router owner frozen by the prior queue.`
  - `Building creator-facing meaning remains function -> event -> dialogue/minigame/task/function while implementation may still travel through arrangement / event-binding / flow / playable.`
- routed_elsewhere:
  - `Editor preview, runtime export/import, loader, and reference-resolution convergence stay with queue.event-centered-runtime-pack-preview-export-sync.`
  - `Portrait resource authoring and mapping stay with queue.portrait-resource-authoring-and-resource-mapping-convergence.`
  - `Final simulated-human acceptance stays with queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`

#### Capability Floor

- `This queue must leave the project with scene retired as a formal family, with migrated content ownership and zero surviving scene compatibility residue in production truth.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Runtime pack / loader / preview / export convergence remains owned by queue.event-centered-runtime-pack-preview-export-sync.`
  - `Portrait resource convergence remains owned by queue.portrait-resource-authoring-and-resource-mapping-convergence.`
  - `Final simulated-human acceptance remains owned by queue.script-editor-event-centered-authoring-final-acceptance-and-residue-guard.`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by hiding scene from one authoring surface while project/runtime/startup/presenter truth still depends on SceneDefinition, ActionNode, scenes.json, entrySceneId, nextSceneId, or activeSceneId.`
  - `Do not pass this queue while dialogue-story-runtime-materializer or scene-runner still carry canonical production ownership of migrated content.`
  - `Do not reduce building meaning to generic clicks or bypass function -> event -> dialogue/minigame/task/function semantics during migration.`
- unspecified_detail_policy:
  - `Prefer direct migration of content ownership into dialogue/building/city contracts and direct source-removal guards over intermediate compatibility layers.`
- gap_routing_policy:
  - `If a required scene-retirement capability cannot be completed here, record it as same-family residue, blocker, or prerequisite instead of letting the later runtime-sync queue silently absorb scene retirement work.`

#### Legacy Paths To Replace

- `src/domain/action.ts` scene-shaped canonical contracts.`
- `project.scenes` and `scenes.json`.`
- `entrySceneId`, `nextSceneId`, and `activeSceneId`.`
- `dialogue-story-runtime-materializer`, `scene-runner`, and scene presenter/runtime session truth.`
- `scenario initialLocation.sceneId` and startup-target scene truth.`

#### Compatibility Paths To Preserve

- `event/event-binding remain the formal router owner.`
- `arrangement -> event-binding -> flow / playable implementation seams remain legal.`
- `Building creator-facing meaning stays function -> event -> dialogue/minigame/task/function.`

#### User Path Coverage Matrix

- primary_paths:
  - `Building-enter, building-function, and story/dialogue authoring continue to route through event while scene-owned content is migrated away.`
- alternate_paths:
  - `Normal start, JSON import start, and runtime preview remain migratable but are not allowed to keep scene as hidden truth.`
- leave_return_or_followup_paths:
  - `Dialogue progression, event follow-up presentation, and building re-entry/return paths remain reachable after scene truth is removed.`
- empty_or_fail_closed_paths:
  - `Any unsupported migration edge must fail closed rather than falling back to scene compatibility residue.`
- rejection_or_error_paths:
  - `Any path that can no longer be supported after scene removal must fail with explicit no-scene truth rather than silently reopening scene fallback ownership.`
- forbidden_regressions:
  - `Do not keep event-only routing labels while production content/presenter/startup truth still references scenes as canonical families.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost dialogue/building/story capability must be fixed or routed as residue/blocker. scene retirement cannot erase working behavior by calling later runtime-sync responsible for it.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/action.ts`
  - `src/domain/script-editor-project.ts`
  - `src/domain/content-pack.ts`
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/startup/scenario-startup-target.ts`
  - `src/application/scene/**`
  - `src/ui/views/scene/scene-view.ts`
  - `src/application/presenter/**`
  - `tests/**`
- Must modify:
  - `Scene-retirement and migrated content ownership files proven necessary by evidence lock.`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No main.ts building business branches.`
  - `No weakening of arrangement / event-binding / flow / playable as the allowed implementation path.`
  - `No premature runtime/export/import convergence claim.`

#### Verification Coverage

- `Source-removal guards, migration tests, runtime/startup/presenter tests, and building behavior regression coverage must prove that scene truth is gone rather than hidden.`

#### Replacement Proof

- previous_owner_or_path:
  - `SceneDefinition / ActionNode / scenes.json / entrySceneId / nextSceneId / activeSceneId / scene-runner / dialogue-story-runtime-materializer / startup sceneId truth.`
- new_owner_or_path:
  - `Dialogue/building/city-owned content contracts under event-only routing, with no canonical scene family remaining.`
- behavior_preservation_expectation:
  - `Supported building/story/dialogue behavior keeps working while creator-facing and runtime formal truth stop depending on scene families.`
- old_truth_owner_exit_proof:
  - `Scene-owned formal truth is removed from project/runtime/startup/presenter contracts instead of being retained as a hidden fallback behind migrated dialogue/building/city ownership.`
- verification_evidence:
  - `Tests and source inspection must show scene truth is removed from production contracts rather than only hidden behind compatibility layers.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/event-router-only-trigger-contract-freeze-queue.md`

### Queue Snapshot

- queue_goal: `Retire scene as a formal family, migrate its content ownership, and remove scene compatibility residue without weakening event-centered building meaning.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; formal scene retirement is closed and control routes to queue.event-centered-runtime-pack-preview-export-sync.` 
- task_briefs:
  - `task.scene-family-retirement-and-content-migration.evidence-anchor-reconcile: Confirm exactly where scene still owns project/runtime/startup/presenter truth and lock the no-over-narrowing removal boundary before implementation.`
  - `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal: Remove scene as formal truth, migrate its content ownership, and preserve building creator-facing meaning.`
  - `task.scene-family-retirement-and-content-migration.queue-closeout-and-handoff: Verify, review completeness, and route the coupled runtime-sync queue without claiming portrait or final-acceptance work.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means some admitted queue work landed, but part of Can Claim remains unimplemented or unverified and must route to residue, blocker, or successor queue.`
- `execution_closeout_status = blocked means execution cannot continue without resolving a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `topic_closure_status = open-residue means the bounded execution may be done or partial, but remaining capability must be routed before version closeout.`
- `Out-of-scope, Cannot Claim, and accepted residue are not retirement authority.`

### Completion Completeness Review

- review_status: `passed`
- can_claim_coverage:
  - `ACC-EVENT-CENTER-003 is covered: scene is removed from Script Editor visible families, project formal structure, runtime pack canonical families, runtime state truth, startup truth, and presenter truth.`
  - `ACC-EVENT-CENTER-004 is covered: building creator-facing meaning remains function -> event -> dialogue/minigame/task/function while implementation still routes through arrangement / event-binding / flow / playable.`
  - `ACC-EVENT-CENTER-007 is covered: no same-family compatibility residue remains for scenes.json, SceneDefinition, ActionNode, entrySceneId, nextSceneId, activeSceneId, scene runtime/session truth, or dialogue-to-scene lowering seams.`
- parent_spec_preservation:
  - `This queue must remove scene truth without disguising compatibility residue as retirement and without absorbing runtime/export sync or portrait mapping work.`
- capability_floor_verification:
  - `Production source audit now shows no surviving formal scene family or scene compatibility residue on the project/runtime/startup/presenter path. Runtime pack canonical files use dialogues.json, startup/profile contracts carry dialogueId instead of scene truth, and presenter/view state no longer route through scene-owned families.`
- out_of_scope_routing:
  - `Runtime/export/import/loader convergence, portrait-resource convergence, and final acceptance remain owned by later queues in the version plan.`
- verification_sufficiency:
  - `Passed: npm run lint:blueprints.`
  - `Passed: npm run typecheck.`
  - `Passed: npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs.`
  - `Focused regression also proves imported flow integrations no longer misclassify into minigames while retired scene-owned import/export shapes fail closed.`
- user_path_matrix_verification:
  - `Building-enter, building-function, story/dialogue progression, start/import/preview, return/follow-up, and fail-closed paths remain coherent on dialogue/building/event-owned truth rather than scene fallback ownership.`
- functional_loss_audit:
  - `No covered building/story/dialogue behavior was dropped during migration. Imported/runtime/startup paths continue to reach dialogue-owned content, and flow/building function meaning stays preserved through event-centered routing.`
- replacement_proof_summary:
  - `Formal truth moved from SceneDefinition / ActionNode / scenes.json / scene-runner / startup sceneId / presenter scene view ownership to dialogue/building/city contracts, dialogue view/presentation, and no-scene runtime pack families.`
- placeholder_or_legacy_fallback_audit:
  - `No claimed path survives only through hidden scene wrappers, bridge readers/writers, compatibility shims, or placeholder presentation. Retired scene import/export/runtime paths now fail closed instead of remaining canonical truth.`
- gap_fill_decision:
  - `not-needed`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `No still-blocking same-family residue remains inside ACC-EVENT-CENTER-003 / 004 / 007. Runtime/export/import/preview convergence now routes to queue.event-centered-runtime-pack-preview-export-sync.`

### Admission Preconditions

- `This queue was admitted only after queue.event-router-only-trigger-contract-freeze closed and the version plan switched active_queue to queue.scene-family-retirement-and-content-migration.`
- `Implementation must not start outside this queue's admitted ACC-EVENT-CENTER-003 / 004 / 007 boundary.`
- `Candidate tracking remains in the version plan; this queue doc is the queue-level execution governor.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending this queue, set queue_status=suspended, remove live active_task execution, and synchronize the owning version plan in the same batch.`
- `If the operator explicitly requests closing this queue before Can Claim is actually satisfied, set queue_status=dropped rather than done and route remaining residue explicitly.`
- `Do not fabricate completed acceptance or topic_closure_status=closed merely because the operator asked to stop work.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails while this queue is active, repair the queue doc, version-plan linkage, or in-scope governing structure before continuing implementation or closeout.`
- `If the failure shows this queue's spec is under-structured or over-narrowed, revise the queue spec inside this queue first; do not mark the issue as accepted residue or silently hand it to the next queue.`
- `If the failure cannot be resolved inside this queue's admitted boundary without changing the parent spec or lawful ownership, record a real blocker or route the change back to version-level governance instead of proceeding through a failed lint gate.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Default Blueprint governance/documentation refinement uses local-record during execution, one branch-commit at queue closeout, then attempted remote-sync toward mod-first-dev.`
- `Every completed execution queue should produce one local commit with a typed subject and Summary body before later Blueprint scheduling continues.`
- `Push and merge are remote-sync actions; once either starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`

### Activation Order

1. `queue.event-router-only-trigger-contract-freeze closes and hands off to this queue.`
2. `The version plan switches active_queue to this queue and records the admission basis.`
3. `This queue doc is created, evidence lock is reconciled, and only then may live implementation begin.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.scene-family-retirement-and-content-migration.evidence-anchor-reconcile` | `done` | `Confirm exactly where scene still owns project/runtime/startup/presenter truth and lock the no-over-narrowing removal boundary before implementation.` | `queue.event-router-only-trigger-contract-freeze closed` | `Evidence lock confirmed that scene still survives as formal truth in domain/action.ts, project.scenes, scenes.json, runtime pack export/import/loader, startup sceneId, scene-runner/scene-view/presenter paths, and dialogue-story-runtime-materializer. This queue must therefore remove those truths directly rather than re-labeling them.` |
| `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal` | `done` | `Remove scene as formal truth, migrate its content ownership, and preserve building creator-facing meaning.` | `task.scene-family-retirement-and-content-migration.evidence-anchor-reconcile` | `Completed in one incompatible batch: formal scene wrappers, SceneDefinition/ActionNode aliases, scenes.json canonical truth, scene-owned startup/presenter/view/runtime seams, and scene-facing creator/runtime contracts were removed or renamed onto dialogue/building/city-owned truth without widening into portrait-resource work.` |
| `task.scene-family-retirement-and-content-migration.queue-closeout-and-handoff` | `done` | `Verify, review completeness, and route the coupled runtime-sync queue without claiming portrait or final-acceptance work.` | `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal` | `ACC-EVENT-CENTER-003 / 004 / 007 are closed; the next lawful queue is queue.event-centered-runtime-pack-preview-export-sync.` |

### Task Definitions

#### `task.scene-family-retirement-and-content-migration.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.scene-family-retirement-and-content-migration.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target.md`
  - `src/domain/action.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/application/startup/scenario-startup-target.ts`
  - `src/application/scene/**`
  - `src/ui/views/scene/scene-view.ts`
  - `src/application/presenter/**`
  - `tests/**`
- must_inspect:
  - `Current scene truth across authoring/project/runtime/startup/presenter surfaces.`
  - `Current building/dialogue ownership that must replace scene content.`
  - `Any lingering scene compatibility seams that would survive as hidden truth.`
- must_not_change:
  - `Do not widen into runtime/export/import convergence during evidence-anchor reconcile.`
  - `Do not widen into portrait-resource authoring or mapping.`
- done_when:
  - `Evidence lock is recorded with confirmed scene-retirement anchors and no-over-narrowing boundaries.`
  - `The queue records exactly what counts as ACC-EVENT-CENTER-003 / 004 / 007 completion and what remains routed to later queues.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or route a lawful split/blocker.`
- promote_next_if_done: `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal`

##### Human Context

- task_brief:
  - `Lock the scene-retirement removal boundary before implementation.`
- task_outcome_summary:
  - `Confirmed that formal scene truth still spans domain/action.ts, ScriptEditor project.scenes, runtime pack scenes.json, runtime pack import/export, scenario loader/startup sceneId, scene-runner/scene-view/presenter paths, and dialogue-story-runtime-materializer. Implementation is therefore constrained to direct family retirement and content migration rather than compatibility layering or later runtime-sync relabeling.`

#### `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal`

##### Control Block

- task_id: `task.scene-family-retirement-and-content-migration.content-migration-and-scene-removal`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/action.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/application/scene/**`
  - `src/application/story/**`
  - `src/application/startup/**`
  - `src/ui/views/scene/**`
  - `src/application/presenter/**`
  - `tests/**`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Current scene-owned content, presenter, and startup/runtime dependencies.`
- must_modify:
  - `Scene-retirement and migrated content ownership files proven necessary by evidence lock.`
  - `tests/**`
- must_preserve:
  - `Building creator-facing meaning and allowed arrangement / event-binding / flow / playable implementation seams.`
  - `Event/event-binding as the formal routing owner.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.scene-family-retirement-and-content-migration.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Remove formal scene truth and migrate scene-owned content into dialogue/building/city contracts.`
- task_outcome_summary:
  - `Completed. Production contracts and content now use dialogue/building/city-owned truth instead of scene-owned truth: canonical runtime pack families moved to dialogues.json, scene aliases/contracts were removed, startup/profile and character dialogue hooks renamed to dialogueId-owned paths, presenter/view ownership moved to dialogue view naming, and imported/exported runtime seams fail closed on retired scene-owned structures.`

#### `task.scene-family-retirement-and-content-migration.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.scene-family-retirement-and-content-migration.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/queues/scene-family-retirement-and-content-migration-queue.md`
  - `tests/**`
- must_inspect:
  - `Implementation proof and claim boundary coverage.`
  - `Whether any same-family scene-retirement residue remains inside ACC-EVENT-CENTER-003 / 004 / 007.`
- must_preserve:
  - `The coupled runtime-sync queue remains fully owned and immediately next; portrait and final acceptance remain later work.`
- done_when:
  - `Verification passes or is honestly blocked.`
  - `Completeness review proves ACC-EVENT-CENTER-003 / 004 / 007 close without over-narrowing later queues.`
  - `The next lawful coupled queue routing is written back to the version plan.`
- verify_with:
  - `npm run lint:blueprints`

##### Human Context

- task_brief:
  - `Verify, review completeness, and hand off to the coupled runtime-sync queue.`
- task_outcome_summary:
  - `Verification passed on the landed worktree: npm run lint:blueprints, npm run typecheck, and npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs all remained green. Completeness review confirmed ACC-EVENT-CENTER-003 / 004 / 007 closed without same-family residue and without narrowing the coupled runtime-sync, portrait-resource, or final-acceptance queues. The next lawful queue is queue.event-centered-runtime-pack-preview-export-sync.`

### Closeout Record

- closed_at: `2026-07-22`
- closed_by: `AI execution under target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- closeout_pending: `false`

### Progress Log

- `2026-07-22`: `queue.event-router-only-trigger-contract-freeze closed with ACC-EVENT-CENTER-002 covered and no same-family residue. Per the version plan's auto-continue rule, queue.scene-family-retirement-and-content-migration is now admitted as the next lawful execution slice.`
- `2026-07-22`: `Evidence-anchor reconcile is complete. Source inspection confirmed that scene still survives as formal truth in domain/action.ts, ScriptEditor project.scenes, runtime pack scenes.json, runtime pack import/export, scenario loader/startup sceneId, scene-runner/scene-view/presenter paths, and dialogue-story-runtime-materializer. Implementation therefore begins with direct scene-family retirement and content migration only.`
- `2026-07-22`: `Second implementation batch removed runtime/application scene alias wrappers (`application/scene/**`, `core/runtime/scene-runtime.ts`), switched startup scenario profile export/loader to formal dialogueId support, and re-baselined robustness assertions onto dialogue/runtime truth. Verification passed (`npm run typecheck`, `npm run lint:blueprints`, `npm test -- --runInBand tests/robustness.test.cjs`), but queue closeout remains unlawful because scenes.json / manifest.files.scenes / import-export scene fallbacks and pack-content scene file references still survive as canonical residue.`
- `2026-07-22`: `Final implementation and closeout batch removed the remaining formal scene family truth from runtime pack/content/presenter contracts, switched canonical pack families to dialogues.json, tightened runtime-pack import/export to reject retired scene-owned dialogue/actions and owner kinds, and fixed imported flow integrations so building-owned flow records stay in flows rather than being misclassified as minigames. Verification passed again (`npm run typecheck`, `npm run lint:blueprints`, `npm test -- --runInBand tests/robustness.test.cjs tests/city-building-mount-authoring.test.cjs`). ACC-EVENT-CENTER-003 / 004 / 007 are therefore closed with no same-family residue, and control routes to queue.event-centered-runtime-pack-preview-export-sync.`
