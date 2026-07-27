# Runtime Layout Registry And UI Layering Convergence Queue

## Control Block

- queue_id: `queue.runtime-layout-registry-and-ui-layering-convergence`
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
- topic_closure_status: `closed`
- closure_basis: `Queue closeout proof and repository-sync gate are complete. ACC-FORMAT-005 is covered for the queue-owned boundary, commit 242272c4 landed the bounded fail-closed cutover batch, and push to origin/mod-first-dev succeeded before required-final queue admission.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- auto_continue_policy: `required`
- idle_after_task_completion: `forbidden`
- queue_close_handoff: `version-plan-routing`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Repository-sync gate satisfied: closeout truth was synchronized, commit 242272c4 landed on mod-first-dev, and push to origin/mod-first-dev succeeded before queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance admission.`
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
  - `Converge runtime layout persistence and runtime UI layering onto one registry-owned contract so preview/runtime save-back, auto-load, override/default resolution, and visible layering all consume the same formal layout truth.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Parent requirement role:
  - `This queue is the required fourth execution slice under the active version. It owns ACC-FORMAT-005 only; final export/import/loading/preview/runtime acceptance remains version-owned follow-up work.`
- Admission status:
  - `Admitted after queue.event-owned-routing-dialogue-playable-settlement-convergence closed honestly with accepted fail-closed residue recorded and with repository-sync already satisfied through commit 0daa903a on origin/mod-first-dev.`
- Forbidden expansions:
  - `Do not absorb editor-page layout redesign into this queue.`
  - `Do not reopen ACC-FORMAT-004 event-owned routing ownership or ACC-FORMAT-003 stage/menu ownership except where direct runtime-layout continuity is required.`
  - `Do not preserve mixed arrangement/container-derived layout truth as a permanent compatibility fallback once registry-owned runtime layout is claimed complete.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Runtime layout must persist through one dedicated registry contract rather than module-private inline layout state or hardcoded runtime branches.`
  - `Preview/runtime interaction must support live layout adjustment save-back on the same formal runtime-layout truth.`
  - `Runtime must auto-load layout truth by host family / host id / surface semantics, with object-level override ahead of family-level default fallback.`
  - `Runtime UI layering belongs to the same formal runtime-layout contract and must not drift into a second ownership seam.`
- inherited_compatibility_paths:
  - `The settled ACC-FORMAT-003 stage/menu reference model and ACC-FORMAT-004 event-owned routing model remain the prerequisite runtime baseline for this queue.`
  - `Existing authoring, import, and preview entrypoints may still lower through transitional contracts during implementation, but final runtime consumption must converge onto registry-owned layout truth.`
- inherited_legacy_replacements:
  - `Arrangement/container-derived layout truth that still survives through project contracts, loader validation, or runtime materialization as effective runtime ownership.`
  - `UI-layer assumptions that still treat arrangement/container shells as the runtime layering authority instead of the formal runtime-layout registry.`
  - `Workspace diagnostics or normalization paths that keep legacy layout-bearing names live as supported runtime truth.`
- inherited_non_goals:
  - `Do not treat Script Editor page layout itself as the queue target.`
  - `Do not reopen event-owned routing, settlement routing, or menu runtime ownership as this queue's main implementation surface.`
  - `Do not claim final full-chain acceptance or compatibility-import retirement here.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile the version plan and every affected queue before treating any inherited capability as removed, unsupported, or deferred.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-FORMAT-005`
- acceptance_not_claimed:
  - `ACC-FORMAT-006`
- minimum_verification:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`

### Claim Boundary

#### Can Claim

- `ACC-FORMAT-005: runtime layout and runtime UI layering converge on one persisted registry contract with live preview/runtime adjustment save-back, host-based auto-load, object-level override, and family-level default fallback.`

#### Cannot Claim

- `ACC-FORMAT-006: final export/import/loading/preview/runtime full-chain acceptance and fail-closed rejection proof.`
- `Script Editor page-layout redesign, editor-shell information architecture, or business-routing ownership.`

#### Capability Floor

- `When this queue closes, runtime and preview must consume one registry-owned layout truth, live adjustments must save back through the same contract, object-level overrides must beat family defaults, and runtime UI layering must follow that same persisted registry rather than arrangement/container-derived side truth.`

#### Parent Capability Coverage

- owned_closure:
  - `Runtime-layout registry persistence, registry-owned load/save semantics, object/family resolution order, and runtime UI layering convergence.`
- preserved_not_owned:
  - `ACC-FORMAT-001 through ACC-FORMAT-004 remain closed prerequisite truth.`
  - `ACC-FORMAT-006 final acceptance remains fully owned by the later required-final queue.`
- routed_elsewhere:
  - `Final export/import/loading/preview/runtime consistency, fail-closed rejection, and version closeout stay with queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `Editor-page layout governance, event-owned routing, and final acceptance remain outside this queue.`
- forbidden_scope_shrinkage:
  - `Do not claim success by only renaming layout fields while runtime still follows arrangement/container-derived or hardcoded layout ownership.`
  - `Do not claim success by only persisting registry files while UI layering still resolves from private view/runtime branches.`
  - `Do not pass this queue by only changing preview save-back while runtime auto-load and override/default resolution remain split across old seams.`
- unspecified_detail_policy:
  - `Prefer explicit registry-owned runtime layout, fail-closed loading, and single-source UI layering over compatibility extraction, mixed ownership, or hidden per-module fallback logic.`
- gap_routing_policy:
  - `If any remaining runtime-layout or UI-layering gap still belongs to ACC-FORMAT-005, keep it inside this queue as same-family work rather than pushing it into final acceptance.`

#### Legacy Paths To Replace

- `Project/load/materialization seams that still allow arrangement or container payloads to act as effective runtime layout truth.`
- `UI shell/view layering seams that still assume arrangement/container state is the active runtime composition owner.`
- `Diagnostics and normalization seams that keep legacy inline layout-bearing names alive as supported runtime truth.`

#### Compatibility Paths To Preserve

- `The closed stage/menu and event-owned routing baselines from ACC-FORMAT-003 and ACC-FORMAT-004.`
- `Normal start, JSON/runtime-pack import, and Script Editor runtime preview must remain aligned while layout ownership converges.`
- `Runtime layout remains preview/runtime-scoped and must not absorb Script Editor page-layout governance.`

#### User Path Coverage Matrix

- semantic_dimensions:
  - `registry-owned layout truth`
  - `live save-back`
  - `auto-load resolution`
  - `object override vs family default`
  - `runtime UI layering`
- primary_paths:
  - `Runtime and preview load the same registry-owned layout truth for the active host/surface instead of deriving layout from arrangement/container state.`
  - `Visible runtime or preview adjustment saves back through the same registry contract that later auto-load consumes.`
- alternate_paths:
  - `Object-level layout override wins ahead of family-level fallback without reconstructing retired inline layout truth.`
- leave_return_or_followup_paths:
  - `Layout and layering follow the same host/surface ownership across runtime reentry, preview reload, and adjacent UI shells that consume the converged layout data.`
- empty_or_fail_closed_paths:
  - `Missing registry entries or unsupported layout scopes must fail closed or fall back only through the declared family-default path rather than silently reusing old arrangement/container layout ownership.`
- rejection_or_error_paths:
  - `Mixed old/new layout truth, unsupported layout-bearing contracts, or page-layout drift must surface as validation, import, or runtime failure during queue closeout rather than being counted as accepted behavior.`
- forbidden_regressions:
  - `Do not regress the closed stage/menu chain, event-owned routing chain, or creator-facing authoring baseline while converging runtime layout.`

#### Meaning Preservation

- creator_facing_meaning:
  - `Creators still adjust runtime/preview layout meaning through live runtime-facing controls rather than managing a new page-layout editor module or hand-wiring visible layout ids.`
- runtime_meaning:
  - `Runtime uses one persisted registry as the source of layout and UI-layering truth across preview/runtime load, save-back, and fallback resolution.`
- trigger_timing_or_context:
  - `Layout loading and save-back may be triggered by runtime or preview entry, but must not smuggle routing ownership or editor-page governance into this queue.`
- consistency_surfaces:
  - `Authoring-adjacent save paths, preview, runtime loading, and runtime rendering must stay on one runtime-layout direction.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost runtime-layout persistence, save-back, override/default resolution, or UI-layering capability must be repaired in-queue or routed explicitly as residue/blocker. It cannot be erased by reclassifying the capability as final acceptance work after this queue changes the owner path.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/domain/building-arrangement.ts`
  - `src/application/script-editor/menu-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/building/building-module-view.ts`
  - `tests/**`
- Must modify:
  - `src/application/script-editor/**`
  - `src/domain/**`
  - `src/ui/**`
  - `tests/**`
  - `docs/change-log.md`
- Must preserve:
  - `No event-routing ownership drift into this queue.`
  - `No Script Editor page-layout redesign under the label of runtime layout.`
  - `No permanent mixed old/new runtime layout truth.`

#### Verification Coverage

- `Verification must prove that runtime/preview consume registry-owned layout truth, live adjustment save-back persists through the same contract, object/family resolution order is explicit, and UI layering no longer depends on arrangement/container-derived runtime ownership.`

#### Replacement Proof

- previous_owner_or_path:
  - `Mixed arrangement/container-derived layout state, formalization-time extraction, loader acceptance, and UI-shell layering assumptions that still let non-registry seams act as effective runtime layout truth.`
- new_owner_or_path:
  - `One registry-owned runtime-layout contract covering persistence, save-back, auto-load, override/default resolution, and UI layering.`
- behavior_preservation_expectation:
  - `Runtime/preview layout behavior remains reachable across entrypoints while mixed arrangement/container ownership disappears.`
- old_truth_owner_exit_proof:
  - `This queue may close only after covered runtime paths no longer need arrangement/container-derived layout truth as production behavior.`
- verification_evidence:
  - `Runtime tests, preview-save tests, and source-removal guards must prove one registry-owned layout truth rather than shell-only cleanup.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/event-owned-routing-dialogue-playable-settlement-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Execute the fourth version slice so runtime layout persistence and runtime UI layering converge onto one registry-owned contract.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Completed. ACC-FORMAT-005 is locally covered, repository-sync succeeded, and execution has already handed off to the required-final queue.`
- task_briefs:
  - `task.runtime-layout-registry-and-ui-layering-convergence.evidence-anchor-reconcile: freeze the concrete layout-registry, materialization, and UI-layering seams that still keep ACC-FORMAT-005 open.`
  - `task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover: land the bounded registry-owned runtime layout and UI-layering convergence without preserving mixed ownership.`
  - `task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate: verify ACC-FORMAT-005 coverage, classify residue honestly, and run the repository-sync gate before handoff to the final acceptance queue.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `execution_closeout_status = partial means the queue is actively landing ACC-FORMAT-005 work and cannot claim closeout yet.`
- `execution_closeout_status = blocked means execution cannot continue without a concrete blocker recorded in blocked_by.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded runtime-layout surface.`
- `topic_closure_status = open means the queue still owns unfinished ACC-FORMAT-005 work.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `Active-task completion, queue closeout sync, and active queue handoff are transitions, not lawful pause points by themselves.`

### Completion Completeness Review

- review_status: `complete`
- can_claim_coverage:
  - `Yes for bounded implementation coverage. Admission evidence is locked, the registry-owned layout contract cutover is verified locally, and the remaining queue work is closeout review plus repository-sync gating rather than more ACC-FORMAT-005 implementation.`
- parent_spec_preservation:
  - `Preserved so far. Event-owned routing and final acceptance remain routed to their own queues.`
- capability_floor_verification:
  - `Verified locally through bounded source and regression evidence: arrangement layout persists through project/load/export/import paths, building module rendering consumes arrangement layout plus shell class layering directly, and legacy arrangement action-menu items now fail closed or drop from runtime materialization rather than acting as parallel runtime truth.`
- out_of_scope_routing:
  - `ACC-FORMAT-006 remains routed to queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance.`
- verification_sufficiency:
  - `Sufficient for closeout review. npm run build:test, node --test tests/robustness.test.cjs, npm run lint:blueprints, npm run lint:blueprint-skill, and npm run blueprint:governance:check all passed on the current ACC-FORMAT-005 slice.`
- user_path_matrix_verification:
  - `Covered by local evidence for the bounded queue scope: arrangement-layout authoring persists template/shell/node edits, runtime-pack import/export preserves explicit arrangement layout, building runtime rendering consumes arrangement layout without house fallback, and legacy arrangement action-menu items no longer survive as runtime truth through parser, authoring, or materialization seams.`
- functional_loss_audit:
  - `No creator-visible or runtime-visible loss is accepted as part of admission. Any lost layout persistence, save-back, override/default resolution, or UI layering must be repaired in-queue rather than deferred.`
- replacement_proof_summary:
  - `The bounded cutover is now landed and locally verified. Parser/loading and top-level authoring fail closed on legacy arrangement action-menu items, runtime materialization strips those retired items from arrangement shells, and building runtime action rendering consumes house menuInstanceIds -> menuInstances -> menuResources while arrangement layout remains the sole shell/layering owner for the covered building surface.`
- placeholder_or_legacy_fallback_audit:
  - `Mixed arrangement/container-derived menu truth is no longer accepted on the covered path: the retired action-menu items are either rejected or stripped, and no queue-owned compatibility fallback keeps them as production behavior.`
- remaining_gaps:
  - `No further queue-local implementation or governance gap remains.`

### Admission Preconditions

- `This queue was admitted only after queue.event-owned-routing-dialogue-playable-settlement-convergence closed honestly with no active task remaining and with repository-sync already recorded as successful.`
- `Implementation must not start outside this queue's admitted ACC-FORMAT-005 boundary.`
- `Candidate tracking remains in the version plan; this queue doc is now the queue-level execution governor.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails while this queue is active, repair the queue doc, version-plan linkage, or in-scope governing structure before continuing implementation or closeout.`
- `If the failure shows this queue's spec is under-structured or over-narrowed, revise the queue spec inside this queue first; do not mark the issue as accepted residue or silently hand it to final acceptance.`
- `If the failure cannot be resolved inside this queue's admitted boundary without changing the parent spec or lawful ownership, record a real blocker or route the change back to version-level governance instead of proceeding through a failed lint gate.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, record local repository sync state.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Task-level after-state uses local-record only; task completion does not by itself require commit, push, or merge.`
- `Under the current version-level repository sync gate, queue closeout must first synchronize queue closeout docs and routing truth, then attempt one local branch-commit, then attempt remote push, then attempt merge if current repository workflow requires merge for development-trunk synchronization.`
- `The next queue must not be admitted or activated until that minimum sync batch has returned a recorded result.`

### Activation Order

1. `queue.event-owned-routing-dialogue-playable-settlement-convergence closes and records repository-sync success.`
2. `The version plan switches active_queue to this queue and records the handoff basis.`
3. `This queue doc is created, admission evidence is locked from the audited runtime-layout rationale, and live implementation continues on the registry-owned contract cutover task.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its admission basis.`
- `Resume from the version-plan admission record and this queue doc unless new material evidence invalidates the current ACC-FORMAT-005 boundary.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.runtime-layout-registry-and-ui-layering-convergence.evidence-anchor-reconcile` | `done` | `Freeze the concrete layout-registry, materialization, and UI-layering seams that still keep ACC-FORMAT-005 open.` | `queue.event-owned-routing-dialogue-playable-settlement-convergence closed` | `Done during admission from the audited runtime-layout rationale already established in-thread: layout ownership still leaks through project contracts, formalization, loader validation, runtime materialization, UI-shell layering, and workspace issue routing.` |
| `task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover` | `done` | `Land the bounded registry-owned runtime layout and UI-layering convergence without preserving mixed ownership.` | `task.runtime-layout-registry-and-ui-layering-convergence.evidence-anchor-reconcile` | `Done. Loader/project-parser rejection, top-level menu-authoring fail-closed behavior, runtime materializer cleanup, arrangement-layout persistence, and building runtime layout consumption are locally verified on the converged path.` |
| `task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate` | `done` | `Verify ACC-FORMAT-005 coverage, classify residue honestly, and run the repository-sync gate before handoff to the final acceptance queue.` | `task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover` | `Done. Queue closeout truth was synchronized, commit 242272c4 landed on mod-first-dev, push to origin/mod-first-dev succeeded, and same-version execution moved directly to queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance.` |

### Task Definitions

#### `task.runtime-layout-registry-and-ui-layering-convergence.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.runtime-layout-registry-and-ui-layering-convergence.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/building-arrangement.ts`
  - `src/application/script-editor/menu-authoring.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/building/building-module-view.ts`
  - `tests/**`
- must_inspect:
  - `Current project/load/materialization seams that still preserve non-registry layout truth.`
  - `Current UI shell/view layering assumptions that still derive effective runtime layering from arrangement/container state.`
  - `Current diagnostics or normalization seams that keep legacy layout-bearing names alive as supported runtime truth.`
- must_not_change:
  - `Do not begin implementation before the queue records exact ACC-FORMAT-005 ownership and replacement proof anchors.`
  - `Do not widen this queue into editor-page layout governance or final acceptance work.`
- done_when:
  - `Evidence lock is recorded with concrete source anchors for ACC-FORMAT-005.`
  - `Can Claim and Cannot Claim list the exact version acceptance this queue owns.`
  - `The queue records the exact runtime-layout and UI-layering changes that belong to the implementation batch.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Return to version review and record the blocker rather than starting implementation on a drifting boundary.`
- promote_next_if_done: `task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover`
- human_input_required: `false`
- next_lawful_action_if_done: `task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `The parent spec must change before any bounded ACC-FORMAT-005 implementation can be selected.`
  - `The queue would have to absorb editor-page layout governance or final acceptance work just to land ACC-FORMAT-005.`

##### Human Context

- task_brief:
  - `Lock the registry-owned runtime-layout and UI-layering implementation boundary before code changes start.`
- task_outcome_summary:
  - `Done. Admission reconciled ACC-FORMAT-005 against the current version boundary and confirmed that runtime layout truth still leaks through project contracts, formalization, loader validation, runtime materialization, UI-shell layering, and workspace issue routing, without widening into editor-page layout or final acceptance ownership.`

#### `task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover`

##### Control Block

- task_id: `task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/building-arrangement.ts`
  - `src/application/script-editor/**`
  - `src/ui/**`
  - `tests/**`
  - `docs/change-log.md`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Every covered layout/materialization/UI-layering seam that still owns non-registry runtime layout truth.`
  - `Current preview/runtime save-back and runtime loading paths that still split object override, family default, or layering semantics across mixed owners.`
- must_modify:
  - `Covered runtime-layout registry contracts.`
  - `Covered loader/materializer seams that still preserve mixed layout truth.`
  - `Covered UI-layering consumption seams.`
  - `Regression tests and change-log entries for landed code/runtime behavior changes.`
- must_replace:
  - `Arrangement/container-derived runtime layout ownership for covered surfaces.`
  - `Private UI-layering branches that ignore the registry-owned layout contract.`
- must_preserve:
  - `The closed ACC-FORMAT-003 and ACC-FORMAT-004 baselines.`
  - `No editor-page layout redesign.`
  - `No final-acceptance scope expansion.`
- must_not_change:
  - `Do not widen into event-owned routing or stage/menu queue ownership.`
  - `Do not widen into final full-chain acceptance work.`
  - `Do not preserve dual old/new production truth as a compatibility layer.`
- done_when:
  - `Project/load/materialization paths accept one canonical registry-owned layout source of truth.`
  - `UI shell/view layers consume registry-derived layout data only for the covered runtime-layout surface.`
  - `Build, regression, and Blueprint verification pass.`
- verify_with:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without inventing a mixed-ownership compatibility fallback or silently narrowing queue ownership.`
- promote_next_if_done: `task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate`
- human_input_required: `false`
- next_lawful_action_if_done: `task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`
- stop_if:
  - `Implementation requires parent-spec widening into editor-page layout governance or final acceptance ownership.`
  - `Implementation can only proceed by preserving mixed old/new runtime layout truth as production behavior.`

##### Human Context

- task_brief:
  - `Land the registry-owned runtime-layout and UI-layering cutover for ACC-FORMAT-005.`
- task_outcome_summary:
  - `Done. The queue has now verified the bounded ACC-FORMAT-005 cutover locally: parser/loading and top-level authoring fail closed on legacy arrangement action-menu items, runtime materialization strips retired items from arrangement shells, explicit arrangement layout persists through project/runtime-pack paths, and building runtime rendering consumes the converged arrangement layout plus formal menu chain without reopening prior queue ownership.`

#### `task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate`

##### Control Block

- task_id: `task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate`
- state: `done`
- task_kind: `queue-closeout`
- scope:
  - `docs/blueprints/queues/runtime-layout-registry-and-ui-layering-convergence-queue.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/change-log.md`
  - `src/application/**`
  - `src/ui/**`
  - `tests/**`
- must_inspect:
  - `Proof that ACC-FORMAT-005 is actually covered.`
  - `Whether any same-family residue remains inside runtime-layout persistence or runtime UI layering convergence.`
  - `Repository-sync readiness after queue closeout proof.`
- must_modify:
  - `Queue closeout truth`
  - `Version-plan next routing truth`
  - `Project-progress active queue truth`
- must_preserve:
  - `Single-active-task governance`
  - `The current version boundary`
  - `Honest routing for the required-final queue`
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
  - `ACC-FORMAT-005 is not honestly covered.`

##### Human Context

- task_brief:
  - `Close out the runtime-layout queue after verified implementation and route the final acceptance queue.`
- task_outcome_summary:
  - `Done. Bounded ACC-FORMAT-005 implementation proof was recorded locally, no same-family implementation blocker remained inside the covered runtime-layout surface, commit 242272c4 landed on mod-first-dev, push to origin/mod-first-dev succeeded, and same-version execution moved directly to the required-final queue.`

### Progress Log

- `2026-07-27`: `queue.event-owned-routing-dialogue-playable-settlement-convergence is now closed honestly with accepted fail-closed residue recorded and repository-sync already satisfied through commit 0daa903a on origin/mod-first-dev, so queue.runtime-layout-registry-and-ui-layering-convergence becomes the uniquely lawful next admission under the approved phase order.`
- `2026-07-27`: `Admission evidence is now locked from the audited runtime-layout rationale. ACC-FORMAT-005 is constrained to registry-owned runtime layout plus runtime UI layering convergence across project contracts, formalization, loader validation, runtime materialization, UI-shell layering, and workspace issue routing, and task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover is now the live active task.`
- `2026-07-27`: `Slice A is now landed on the active ACC-FORMAT-005 task. The Script Editor project parser and loader reject legacy building-arrangement action-menu items as runtime/menu truth, the relevant project-contract comments now classify those items as legacy-only residue, and the narrow proof is green via npm run build:test plus the targeted robustness loader/parser subset.`
- `2026-07-27`: `Slice B is now landed on the same active task. Top-level menu-authoring now fails closed on legacy building-arrangement action-menu items, runtime materialization no longer carries container.items into runtime arrangement shells, and the narrow proof is green via npm run build:test plus the targeted robustness and city-building-mount-authoring subsets. The active task remains unchanged because the next lawful step is fresh queue-level verification and review for possible promotion to task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate.`
- `2026-07-27`: `Fresh ACC-FORMAT-005 verification is now fully green: cmd /c npm run build:test, node --test tests/robustness.test.cjs, cmd /c npm run lint:blueprints, cmd /c npm run lint:blueprint-skill, and cmd /c npm run blueprint:governance:check all passed on the converged path. Existing coverage plus the landed slice-A/B tests now prove arrangement-layout persistence, building runtime layout rendering without house fallback, and fail-closed retirement of legacy arrangement action-menu items as runtime truth.`
- `2026-07-27`: `The queue therefore promotes from task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover into task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate. No same-family implementation blocker remains inside ACC-FORMAT-005; the lawful next work is honest closeout review and repository-sync gating before final-acceptance admission.`
- `2026-07-27`: `Repository-sync gate for queue.runtime-layout-registry-and-ui-layering-convergence is now satisfied. Commit 242272c4 landed on mod-first-dev, push to origin/mod-first-dev succeeded, and same-version execution moved directly to queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance under the approved phase order.`
