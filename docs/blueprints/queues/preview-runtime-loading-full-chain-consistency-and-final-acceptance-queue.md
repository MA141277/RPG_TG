# Preview Runtime Loading Full Chain Consistency And Final Acceptance Queue

## Control Block

- queue_id: `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance`
- belongs_to_version: `target.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-27`
- governance_sync_source: `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
- queue_status: `active`
- queue_class: `required-final`
- active_task: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof`
- next_task: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `ACC-FORMAT-005 is now closed with repository-sync success through commit 242272c4 on origin/mod-first-dev, so the required-final ACC-FORMAT-006 queue becomes the uniquely lawful active queue under the approved phase order.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `continue-current-queue`
- auto_continue_policy: `required`
- idle_after_task_completion: `forbidden`
- queue_close_handoff: `version-closeout-routing`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `No ACC-FORMAT-006 repository-sync attempt has been recorded yet.`
- blocked_by:
  - `User manual Script Editor inspection reported multiple still-unfixed creator-visible content gaps, so ACC-FORMAT-006 cannot currently pass closeout review on the claimed full-chain surface.`
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Prove full-chain authoring/export/import/loading/preview/runtime consistency, fail-closed rejection, final acceptance, and version-closeout readiness across the covered modules on the already-landed canonical contracts.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
- Parent requirement role:
  - `This queue is the required-final execution slice under the active version. It owns ACC-FORMAT-006 only and must not hide unfinished earlier implementation-bearing work.`
- Admission status:
  - `Admitted after queue.runtime-layout-registry-and-ui-layering-convergence closed honestly with no same-family residue and with repository-sync already satisfied through commit 242272c4 on origin/mod-first-dev.`
- Forbidden expansions:
  - `Do not reopen ACC-FORMAT-001 through ACC-FORMAT-005 by default unless fresh blocker evidence proves the earlier queue claims were incomplete.`
  - `Do not dilute final acceptance into doc-only wording without proving real authoring/export/import/preview/runtime parity.`
  - `Do not preserve compatibility shims or silent fallback behavior as acceptable final acceptance evidence.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `Authoring, export, import, preview, runtime loading, and runtime execution must consume the same landed truth across the covered modules.`
  - `Fail-closed rejection must remain explicit for unsupported or retired structures instead of compatibility-lowering them back into production truth.`
  - `Final acceptance proof must demonstrate the closed earlier queues behave coherently together rather than only in queue-local isolation.`
- inherited_compatibility_paths:
  - `ACC-FORMAT-001 through ACC-FORMAT-005 remain closed prerequisite truth and must be consumed rather than reimplemented.`
  - `Event remains the sole routing owner, settlement remains write-back only, menu remains the formal resource/instance chain, and runtime layout remains the persisted shell/layering owner for covered runtime surfaces.`
- inherited_legacy_replacements:
  - `Any path that still reconstructs retired authoring or runtime truth during export/import/loading/preview/runtime execution.`
  - `Any unsupported structure that still passes through compatibility behavior instead of failing closed.`
  - `Any preview/runtime/startup path that silently diverges from the canonical authoring/export truth already claimed by the earlier queues.`
- inherited_non_goals:
  - `Do not reopen editor-page layout governance.`
  - `Do not reopen stage/menu/event-routing/runtime-layout implementation by default.`
  - `Do not claim version closeout before queue-local acceptance and repository-sync truth are complete.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile the version plan and every affected queue before treating any inherited capability as removed, unsupported, or deferred.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-FORMAT-006`
- acceptance_not_claimed:
  - `version closeout`
- minimum_verification:
  - `cmd /c npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `cmd /c npm run lint:blueprints`
  - `cmd /c npm run lint:blueprint-skill`
  - `cmd /c npm run blueprint:governance:check`

### Claim Boundary

#### Can Claim

- `ACC-FORMAT-006: authoring, export, import, preview, runtime loading, and runtime execution consume the same landed truth across the covered modules with fail-closed rejection and no compatibility layer.`

#### Cannot Claim

- `Earlier implementation-bearing acceptance ids beyond what their closed queues already proved.`
- `Version closeout before final acceptance proof and queue-local repository-sync truth are complete.`

#### Parent Capability Coverage

- owned_closure:
  - `Cross-surface parity, fail-closed rejection proof, final acceptance ledger, and version-closeout readiness for the active version.`
- preserved_not_owned:
  - `ACC-FORMAT-001 through ACC-FORMAT-005 remain closed prerequisite truth.`
- routed_elsewhere:
  - `Fresh same-family blockers discovered inside earlier acceptance boundaries must be routed back to the owning earlier queue or recorded in version review rather than hidden here.`

#### Capability Floor

- `When this queue closes, the version must have one coherent truth across authoring, export, import, preview, startup/runtime loading, and runtime execution for the covered modules, with unsupported residue failing closed instead of silently downgrading.`

#### Over-Narrowing Guard

- forbidden_scope_shrinkage:
  - `Do not pass this queue by proving only export/import while preview or runtime execution still diverges.`
  - `Do not pass this queue by proving only one built-in pack if another covered entry path still reconstructs old truth.`
  - `Do not treat source-removal guards alone as final acceptance when real cross-surface parity has not been demonstrated.`
- gap_routing_policy:
  - `If a required convergence capability cannot be completed here, record it as same-family residue, blocker, or routed earlier-queue gap instead of calling final acceptance complete.`

#### User Path Coverage Matrix

- primary_paths:
  - `Script Editor authoring, runtime-pack export/import, runtime preview, and normal startup must all preserve the same landed menu/event/layout/runtime truth for the covered modules.`
- alternate_paths:
  - `Built-in pack startup, imported pack startup, and in-memory preview must agree on the same fail-closed acceptance contract instead of reconstructing alternate compatibility truth.`
- leave_return_or_followup_paths:
  - `Event-owned follow-up, playable settlement handoff, building reentry, and adjacent runtime transitions must continue to consume the already-landed canonical routing truth after export/import/loading boundaries.`
- empty_or_fail_closed_paths:
  - `Unsupported legacy authoring or runtime payloads must fail closed rather than being normalized back into accepted production truth during export/import/loading/preview/runtime execution.`
- rejection_or_error_paths:
  - `Mixed old/new truth, unresolved references, unsupported runtime-layout payloads, or retired routing/menu/layout structures must surface as explicit validation, import, preview, or runtime rejection rather than hidden fallback behavior.`
- forbidden_regressions:
  - `Do not regress the closed ACC-FORMAT-001 through ACC-FORMAT-005 behaviors while proving final acceptance.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost authoring/export/import/preview/runtime capability discovered during final acceptance must be repaired in-queue or routed explicitly as blocker/residue. It cannot be erased by narrowing the claimed acceptance surface after earlier queues already landed user-visible behavior.`

#### Replacement Proof

- previous_owner_or_path:
  - `Any remaining per-surface drift where authoring, export/import, preview/startup loading, or runtime execution still reconstructs retired truth or accepts compatibility fallback behavior.`
- new_owner_or_path:
  - `One shared landed truth across authoring, export/import, preview/startup loading, and runtime execution on the already-closed canonical event/menu/layout/runtime contracts.`
- behavior_preservation_expectation:
  - `Supported built-in, imported, and preview flows remain reachable and coherent, but only through the canonical fail-closed contracts already established by the earlier queues.`
- old_truth_owner_exit_proof:
  - `This queue may close only after covered cross-surface paths no longer need compatibility rescue logic, hidden reconstruction, or queue-local reinterpretation of earlier landed truth as production behavior.`
- verification_evidence:
  - `Round-trip tests, browser/runtime proof where needed, source-removal guards, and final acceptance review must prove one coherent truth rather than documentation-only closure.`

### Queue Snapshot

- queue_goal: `Close the remaining ACC-FORMAT-006 full-chain consistency and final-acceptance gap across authoring, export/import, loading, preview, and runtime execution.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Closeout review did not pass. The live task returns to bounded final proof and repair because manual Script Editor inspection contradicted the current acceptance claim on the creator-visible surface.`
- task_briefs:
  - `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.evidence-anchor-reconcile: lock the current full-chain acceptance inventory, remaining parity gaps, and fail-closed surfaces for ACC-FORMAT-006.`
  - `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof: land the bounded proof and any remaining in-queue fixes needed to satisfy ACC-FORMAT-006 honestly.`
  - `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff: verify queue closeout proof, record repository-sync truth, and route the version into closeout review or blocker handling.`

### Completion Completeness Review

- review_status: `in-progress`
- can_claim_coverage:
  - `No. Queue closeout review cannot pass because manual Script Editor inspection found multiple still-unfixed creator-visible content gaps inside the claimed ACC-FORMAT-006 surface.`
- parent_spec_preservation:
  - `Preserved so far. Earlier implementation-bearing acceptance ids remain closed and version closeout remains deferred.`
- capability_floor_verification:
  - `Contradicted by manual Script Editor inspection. Local automated proof stayed green, but the queue cannot currently claim the creator-visible full-chain capability floor.`
- user_path_matrix_verification:
  - `Not yet sufficient. Manual Script Editor inspection found unresolved creator-visible gaps, so the current matrix must return to proof-and-repair rather than closeout.`
- functional_loss_audit:
  - `No loss is accepted by default. Any discovered cross-surface regression must be repaired or routed explicitly inside this queue.`
- replacement_proof_summary:
  - `Not yet sufficient. Automated proof did not expose a contradiction, but manual Script Editor inspection did; the queue must now reconcile that contradiction before replacement proof can be accepted honestly.`
- placeholder_or_legacy_fallback_audit:
  - `Open again. Existing automated proof is not enough because manual Script Editor inspection found unresolved content gaps on the claimed creator-visible surface.`
- verification_sufficiency:
  - `Not sufficient for closeout. Manual Script Editor inspection contradicts the current acceptance claim, so repository-sync and version closeout routing are not yet lawful.`
- remaining_gaps:
  - `The exact unresolved Script Editor content gaps now need to be inventoried and repaired or explicitly routed before ACC-FORMAT-006 can re-enter closeout review.`
  - `This inventory now explicitly includes the operator-requested temporary rollback of runtime layout consumption back to the old unified shell UI across normal startup, JSON import startup, built-in startup, and Script Editor runtime preview while preserving authored layout data.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.evidence-anchor-reconcile` | `done` | `Lock the current full-chain acceptance inventory, remaining parity gaps, and fail-closed surfaces for ACC-FORMAT-006.` | `queue.runtime-layout-registry-and-ui-layering-convergence closed` | `Done. The queue now has an explicit evidence lock on the current authoring/export/import/preview/startup/runtime parity surface, the fail-closed rejection anchors, and the bounded proof slice that still remains.` |
| `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof` | `active` | `Land the bounded proof and any remaining in-queue fixes needed to satisfy ACC-FORMAT-006 honestly.` | `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.evidence-anchor-reconcile` | `Reopened. Manual Script Editor inspection reported multiple still-unfixed creator-visible content gaps, so the queue returns to proof-and-repair instead of closeout.` |
| `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff` | `pending` | `Verify queue closeout proof, record repository-sync truth, and route the version into closeout review or blocker handling.` | `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof` | `Deferred. Closeout is not lawful again until the newly reported Script Editor contradictions are reconciled.` |

### Task Definitions

#### `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.evidence-anchor-reconcile`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `docs/blueprints/queues/runtime-layout-registry-and-ui-layering-convergence-queue.md`
  - `src/application/script-editor/**`
  - `src/application/scenario/**`
  - `src/application/content/**`
  - `src/application/startup/**`
  - `src/ui/**`
  - `tests/**`
- must_inspect:
  - `Earlier queue closeout records for ACC-FORMAT-001 through ACC-FORMAT-005.`
  - `Current export/import/loading/preview/runtime execution seams that still need one final parity proof or fail-closed audit.`
  - `Whether any fresh blocker actually belongs to an earlier queue rather than ACC-FORMAT-006 itself.`
- must_not_change:
  - `Do not claim final acceptance before the exact ACC-FORMAT-006 evidence surface is locked.`
  - `Do not widen this queue into unbounded new feature work.`
- done_when:
  - `Evidence lock is recorded with concrete proof surfaces and any remaining bounded implementation slice.`
  - `The queue records exactly what counts as ACC-FORMAT-006 completion and what must fail closed.`
- verify_with:
  - `cmd /c npm run lint:blueprints`
  - `cmd /c npm run lint:blueprint-skill`
  - `cmd /c npm run blueprint:governance:check`
- if_blocked:
  - `Return to version review and record the blocker rather than guessing the final acceptance boundary.`
- promote_next_if_done: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof`
- human_input_required: `false`
- next_lawful_action_if_done: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof`
- next_lawful_action_if_blocked: `write-version-stop-truth-and-record-blocker`
- auto_promote_if_done: `true`

##### Human Context

- task_brief:
  - `Freeze the ACC-FORMAT-006 parity and final-acceptance boundary before further implementation or closeout claims.`
- task_outcome_summary:
  - `Done. The queue has now frozen the exact ACC-FORMAT-006 acceptance inventory on concrete proof anchors: in-memory runtime preview uses export -> import -> startup -> runtime, formal menu/event/layout/flow families round-trip on the converged chain, built-in pack building flows route through explicit arrangement plus event/menu truth, and covered legacy residues fail closed rather than re-entering production behavior.`

#### `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof`

##### Control Block

- task_id: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/**`
  - `src/ui/**`
  - `tests/**`
  - `docs/change-log.md`
- must_inspect:
  - `Evidence-anchor reconcile outcome.`
  - `Any remaining full-chain drift between authoring, export/import, preview/startup loading, and runtime execution.`
- must_modify:
  - `Only the bounded files needed to satisfy ACC-FORMAT-006 honestly.`
  - `Regression tests and change-log entries for landed code/runtime behavior changes.`
- must_preserve:
  - `Earlier closed queue claims unless fresh contradictory evidence is found.`
  - `Fail-closed behavior instead of compatibility rescue paths.`
- done_when:
  - `ACC-FORMAT-006 is proved honestly for the queue-owned boundary.`
  - `Required verification is green on the bounded final-acceptance slice.`
- verify_with:
  - `cmd /c npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `cmd /c npm run lint:blueprints`
  - `cmd /c npm run lint:blueprint-skill`
  - `cmd /c npm run blueprint:governance:check`
- promote_next_if_done: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff`

##### Human Context

- task_brief:
  - `Land the bounded final parity proof and any remaining in-queue fixes for ACC-FORMAT-006.`
- task_outcome_summary:
  - `Reopened. Automated bounded verification stayed green, but manual Script Editor inspection contradicted the current acceptance claim by surfacing multiple still-unfixed creator-visible content gaps. The queue therefore returns to proof-and-repair rather than claiming closeout readiness.`

#### `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff`

##### Control Block

- task_id: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff`
- state: `pending`
- task_kind: `queue-closeout`
- scope:
  - `docs/blueprints/queues/preview-runtime-loading-full-chain-consistency-and-final-acceptance-queue.md`
  - `docs/blueprints/plans/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/change-log.md`
  - `tests/**`
- must_inspect:
  - `Proof that ACC-FORMAT-006 is actually covered.`
  - `Whether any same-family residue remains inside the required-final queue boundary.`
  - `Repository-sync and version-closeout readiness after queue closeout proof.`
- must_modify:
  - `Queue closeout truth`
  - `Version-plan routing or closeout truth`
  - `Project-progress and blueprint active-pointer truth`
- must_preserve:
  - `Single-active-task governance`
  - `The current version boundary`
  - `Honest version closeout or blocker routing`
- done_when:
  - `Queue closeout proof is recorded honestly.`
  - `Repository-sync gate has been attempted and recorded truthfully.`
  - `The version is routed lawfully into closeout review or blocker handling.`
- verify_with:
  - `cmd /c npm run build:test`
  - `node --test tests/robustness.test.cjs`
  - `cmd /c npm run lint:blueprints`
  - `cmd /c npm run lint:blueprint-skill`
  - `cmd /c npm run blueprint:governance:check`

##### Human Context

- task_brief:
  - `Close out the required-final queue honestly and hand the version into closeout review or blocker handling.`
- task_outcome_summary:
  - `Pending again. Queue closeout review is not lawful until the manually reported Script Editor contradictions are inventoried and reconciled inside ACC-FORMAT-006.`

### Progress Log

- `2026-07-27`: `queue.runtime-layout-registry-and-ui-layering-convergence closed with ACC-FORMAT-005 covered and repository-sync satisfied through commit 242272c4 on origin/mod-first-dev, so queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance becomes the uniquely lawful required-final admission under the approved phase order.`
- `2026-07-27`: `task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.evidence-anchor-reconcile is now the live active task. The next lawful step is freezing the exact ACC-FORMAT-006 parity and fail-closed acceptance surface before implementation or version closeout claims.`
- `2026-07-27`: `Evidence lock is now complete for ACC-FORMAT-006. The frozen proof surface is the converged authoring/export/import/preview/startup/runtime chain already covered by current tests: in-memory runtime preview exports the current Script Editor project and starts runtime from the loaded pack, formal menu resources/instances plus arrangement layout and flow playables round-trip through the canonical families, built-in zhuyuanzhang building actions route through explicit arrangement plus event-owned bindings, and covered retired scene/menu/layout residues fail closed in loader/parser/export paths rather than being reconstructed as production truth.`
- `2026-07-27`: `The queue therefore promotes from task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.evidence-anchor-reconcile into task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof. The bounded remaining work is queue-local proof and verification on that frozen surface, plus only those repairs required if fresh contradictory drift is discovered there.`
- `2026-07-27`: `Fresh queue-local proof is now green on the frozen ACC-FORMAT-006 surface: cmd /c npm run build:test and node --test tests/robustness.test.cjs both passed, and no fresh contradictory gap was found that would reopen same-family implementation on the covered authoring/export/import/preview/startup/runtime chain.`
- `2026-07-27`: `The queue therefore promotes from task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof into task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff. The lawful next work is honest closeout judgement plus repository-sync and version-handoff routing.`
- `2026-07-27`: `Queue closeout review does not pass. Manual Script Editor inspection reported multiple still-unfixed creator-visible content gaps, so ACC-FORMAT-006 cannot currently be accepted on the claimed surface despite the bounded automated proof staying green.`
- `2026-07-27`: `The required-final queue therefore returns from task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.queue-closeout-review-and-version-handoff to task.preview-runtime-loading-full-chain-consistency-and-final-acceptance.full-chain-consistency-and-acceptance-proof. The next lawful work is inventorying the reported Script Editor contradictions and repairing or explicitly routing them before any renewed closeout attempt.`
- `2026-07-27`: `The contradiction inventory is now concrete on one rollback path too: the operator requested temporarily disabling runtime layout consumption and building layout consumption across normal startup, JSON import startup, built-in startup, and Script Editor runtime preview while keeping layout data intact. ACC-FORMAT-006 absorbs this as same-queue contradiction repair, with the boundary locked in docs/superpowers/specs/2026-07-27-runtime-layout-runtime-consumption-disable-design.md and the execution steps written in docs/superpowers/plans/2026-07-27-runtime-layout-runtime-consumption-disable-implementation.md.`
- `2026-08-02`: `ACC-FORMAT-006 repaired one creator-visible temple contradiction batch inside the active proof task: Huangjue Temple sweep-courtyard and carry-water no longer depend on hidden flow-continue shells, the scenario pack plus builtin templates now expose visible activity-qte playable-instance records for both entries, the dead Kulan temple work chooser shell is removed from event/binding/flow truth, temple donate now routes through an authored dialogue instead of a flow-only text shell, and both temple review plus leader-residence review now resolve through formal dialogue-backed events instead of launchFlow residue. Bounded verification for this batch was re-run with JSON validation plus filtered robustness coverage for temple standalone export, builtin playable-instance exposure, building action-menu routing truth, and preserved Kulan temple route truth.`
- `2026-08-02`: `ACC-FORMAT-006 also narrowed the builtin Zhu Yuanzhang demo building surface so only Huangjue Temple and leader residence keep direct authored building routes. Non-demo building menu resources now stay present only as empty shells, while their direct event bindings, building events, enter dialogues, and placeholder building flows are removed from both the scenario pack and builtin templates; the detached grain-accounting and medicine-compounding sample integrations now sit on manual-launch instead of dangling behind those emptied menus. The bounded regression surface was updated accordingly so the active proof now asserts exactly ten retained building events, zero retained building flows, five retained building dialogues, and no remaining Kulan enter routes for keep/tea-house/market/grain-shop/medicine-house/inn.`
- `2026-08-03`: `ACC-FORMAT-006 repaired the event-owned navigation contradiction by adding a generic navigate event action and independent navigation-runtime request target for city, building, leave-building, and map transitions. Zhu Yuanzhang leave-building events now ship as navigate -> leaveBuilding instead of closeBuilding, main/building/event dispatch bridges hand the command to navigation-runtime rather than owning view-state mutations, and bounded verification passed with cmd /c npm run build:test, node --test tests/navigation-event-routing-runtime.test.cjs, cmd /c npm run lint:blueprints, cmd /c npm run lint:blueprint-skill, and cmd /c npm run blueprint:governance:check.`
- `2026-08-03`: `The navigation-runtime independence repair was tightened after review: city-menu event routing now forwards building arrangement and location-access context into the event-command bridge without making navigation-runtime depend on event or playable systems, malformed navigate actions fail closed during Script Editor export, and fresh bounded verification passed with cmd /c npm run build:test, node --test tests/navigation-event-routing-runtime.test.cjs, node --test tests/event-owned-playable-completion-parity.test.cjs tests/event-flow-playable-runtime.test.cjs, cmd /c npm run lint:blueprints, cmd /c npm run lint:blueprint-skill, and cmd /c npm run blueprint:governance:check. Full node --test tests/robustness.test.cjs was also attempted and still fails broadly with 86 unique failures across existing manifest, Script Editor, playable, UI encoding, and stale Zhu Yuanzhang menu-count expectations, so ACC-FORMAT-006 full robustness closeout is not claimed by this batch.`
- `2026-08-03`: `The remaining navigation-runtime independence residuals were tightened in the same active proof task: production closeBuilding event/export support was retired, EventBindingRuntime now only matches and activates route-command events instead of writing city/house state, city-view-transition delegates reusable map/house transitions to navigation-runtime, and playable/story-battle reenter-house follow-up now uses a shared navigation-runtime follow-up bridge rather than direct main.ts branches. Focused verification passed with cmd /c npm run build:test && node --test tests/navigation-event-routing-runtime.test.cjs tests/event-owned-playable-completion-parity.test.cjs tests/event-flow-playable-runtime.test.cjs.`
