# Instance Next Event Id And Event Routing Convergence Queue

## Control Block

- queue_id: `queue.instance-next-event-id-and-event-routing-convergence`
- belongs_to_version: `target.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-24`
- governance_sync_source: `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `Queue closeout proof now records that nextEventId is the only formal follow-up event field family in owned routing surfaces, legacy dialogue/flow residue fails closed instead of lowering, navigation/time helper-owned followUp routing contracts are removed, and the remaining reenter-house signal is preserved only as a non-routing return path.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `queue.settlement-resource-and-event-type-convergence`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue closeout proof is recorded locally. Repository-sync gate is now the only lawful gate before queue.settlement-resource-and-event-type-convergence may be admitted.`
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
  - `Unify follow-up routing onto nextEventId while preserving event as the only formal routing owner and rejecting any resolver / selector / transitional routing layer.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
- Parent requirement role:
  - `This queue owns ACC-EVENT-SETTLE-003 / 004 and must leave later settlement and full-chain queues on one stable nextEventId + event-only routing contract.`
- Forbidden expansions:
  - `Do not introduce settlement resources or event(type=settlement) in this queue.`
  - `Do not reopen canonical-reuse implementation except to consume its landed truth.`
  - `Do not add a resolver, selector, callback router, or settlement-owned router as a transitional layer.`
  - `Do not reintroduce compatibility import or src/main.ts building-specific business branches.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `nextEventId is the only formal follow-up field name`
  - `nextEventId stores only eventId`
  - `empty nextEventId closes directly`
  - `explicit self-reference through nextEventId is forbidden`
  - `multi-result objects may own per-result nextEventId where their instance meaning requires it`
  - `event remains the only formal routing owner`
  - `missing old follow-up meaning must split to explicit event + event-binding or direct close`
- inherited_compatibility_paths:
  - `normal start, JSON import, Script Editor runtime preview, and building/module entry must remain coherent on the landed routing truth`
  - `building behavior stays on the arrangement / event-binding / playable-flow / shared-runtime path`
- inherited_legacy_replacements:
  - `mixed follow-up field names`
  - `payload-bearing or selector-bearing follow-up fields`
  - `callback or bridge-owned routing truth surviving beside event-owned routing`
- inherited_non_goals:
  - `Do not yet formalize settlement resources or event(type=settlement).`
  - `Do not yet claim final migration acceptance or whole-chain consistency beyond the owned routing boundary here.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile this queue before claiming capability removal or deferral.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `locked`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-SETTLE-003`
  - `ACC-EVENT-SETTLE-004`
- acceptance_not_claimed:
  - `ACC-EVENT-SETTLE-005`
  - `ACC-EVENT-SETTLE-006`
  - `ACC-EVENT-SETTLE-007`
  - `ACC-EVENT-SETTLE-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- locked_evidence_artifacts:
  - `generated/blueprint/instance-next-event-id-routing-evidence.json`
  - `generated/blueprint/instance-next-event-id-routing-inventory.json`
- locked_runtime_anchors:
  - `src/domain/event.ts: EventDefinition already carries optional nextEventId as the formal event follow-up field.`
  - `src/application/dialogue/dialogue-runner.ts: finishDialogue already resolves activeEvent.nextEventId and continues through startEvent(nextEventId).`
  - `src/application/dialogue/dialogue-choice-resolver.ts: choice options already support per-result nextEventId and startEvent(targetEvent) routing.`
  - `src/application/script-editor/runtime-pack-export.ts + runtime-pack-import.ts: export/import already preserve eventRecord.nextEventId runtime truth.`
  - `src/application/script-editor/workspace-shell.ts: editor validation already fails closed for missing nextEventId targets.`
- locked_residue_surfaces:
  - `ScriptEditor dialogue followUps remain a legacy authored field family only for explicit fail-closed inventory/removal paths; dialogue-story-runtime-materializer rejects lowering them into runtime truth.`
  - `Legacy flow eventStartTarget + returnPolicy now remain only as retired routing fields that export/workspace validation reject explicitly.`
  - `Shared runtime followUp contracts now preserve only the non-routing reenter-house return signal; navigation/time authored continuation no longer rides helper-owned followUp seams.`
- locked_scope_boundary:
  - `This queue owns only nextEventId/event-only-routing convergence across runtime, authoring, import/export, preview/startup, and scenario-pack follow-up surfaces.`
  - `Settlement resource/event(type=settlement) convergence remains explicitly deferred to queue.settlement-resource-and-event-type-convergence.`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-SETTLE-003 once all owned follow-up references converge on nextEventId, store only eventId, close directly when empty, and reject explicit self-reference.`
- `ACC-EVENT-SETTLE-004 once event remains the only formal routing owner and completion routes directly to startEvent(nextEventId) with no resolver, selector, or second router in between.`

#### Cannot Claim

- `settlement resource or event(type=settlement) convergence`
- `full-chain export/import/preview/startup parity beyond the owned routing boundary`
- `final migration acceptance`

#### Capability Floor

- `When this queue closes, later queues must be able to assume one nextEventId field family and one event-only follow-up routing owner with no surviving middle layer.`

#### Parent Capability Coverage

- owned_closure:
  - `ACC-EVENT-SETTLE-003 / 004 follow-up-field unification and event-only routing-owner convergence.`
- preserved_not_owned:
  - `settlement resource/event-type convergence remains for the next queue.`
  - `full-chain consistency and final migration acceptance remain later-version work.`
- routed_elsewhere:
  - `none`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `settlement resource and event-type convergence remain owned by the next queue`
  - `full-chain consistency and final acceptance remain later-version work`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by renaming fields in one authoring path while runtime or import/export still preserve other follow-up truths.`
  - `Do not pass this queue by leaving event-owned routing in the editor while settlement, playable, task, or helper code still routes through a hidden middle layer.`
- unspecified_detail_policy:
  - `Prefer direct event-owned routing and explicit fail-closed rejection over compatibility bridges or hidden callback chains.`
- gap_routing_policy:
  - `If a required owned surface cannot yet converge here, record same-family residue or blocker instead of pushing unfinished routing work into later settlement or final-acceptance queues.`

#### User Path Coverage Matrix

- primary_paths:
  - `Owned follow-up routing surfaces resolve through nextEventId with event as the sole routing owner.`
- alternate_paths:
  - `JSON runtime-pack import, Script Editor runtime preview, and normal startup continue resolving the same nextEventId/event-owned routing truth.`
- leave_return_or_followup_paths:
  - `Dialogue end, building action completion, task progression, playable result continuation, and direct-close paths remain reachable without helper-owned middle routing.`
- empty_or_fail_closed_paths:
  - `Empty nextEventId closes directly, while invalid self-reference or unsupported legacy follow-up shapes fail closed with explicit diagnostics.`
- rejection_or_error_paths:
  - `Mixed follow-up field names, payload-bearing next-event records, and resolver/selector residue must be rejected or rewritten explicitly rather than silently preserved.`
- forbidden_regressions:
  - `No owned surface may keep a second routing owner or middle routing layer once this queue claims closure.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost follow-up reachability, direct-close behavior, or event-owned routing continuity caused by nextEventId convergence must be repaired or routed explicitly; silent compatibility loss is not allowed.`

#### Replacement Proof

- previous_owner_or_path:
  - `Mixed follow-up field families and helper-owned continuation paths surviving beside event-owned routing truth.`
- new_owner_or_path:
  - `nextEventId as the sole follow-up field family with event as the only formal routing owner.`
- behavior_preservation_expectation:
  - `Supported follow-up and direct-close paths remain reachable, but only through event-owned routing truth with no resolver/selector middle layer.`
- old_truth_owner_exit_proof:
  - `Queue closeout must show that alternate follow-up field names and helper-owned continuation residue no longer survive in owned runtime, authoring, import/export, preview, or startup surfaces.`
- verification_evidence:
  - `Routing inventories, runtime/source guards, and owned-path regression coverage proving one nextEventId + event-only routing graph.`

### Queue Snapshot

- queue_goal: `Converge owned follow-up routing onto nextEventId with event as the sole router before settlement work begins.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Queue-local implementation is complete. Task3 landed explicit nextEventId self-reference rejection, removal of new dialogue.followUps authoring residue, fail-closed retirement of legacy flow eventStartTarget routing residue, post-commit navigation story triggering without runtime followUp transport, and post-commit council-priority sync without time followUp transport. generated/blueprint/instance-next-event-id-routing-closeout-proof.json now records ACC-EVENT-SETTLE-003 / 004 closeout readiness.`
- task_briefs:
  - `task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile: lock the owned nextEventId/event-only-routing boundary, inspect surviving follow-up surfaces, and confirm implementation anchors.`
  - `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock: inventory mixed follow-up fields and record direct-close / split-event migration rules with explicit preservation reasoning.`
  - `task.instance-next-event-id-and-event-routing-convergence.next-event-id-cutover-and-guard-baseline: land the owned routing rewrite, reject self-reference and middle-layer residue, and prove queue closeout readiness.`

### Completion Completeness Review

- review_status: `complete`
- can_claim_coverage:
  - `ACC-EVENT-SETTLE-003 is now locally claimable: nextEventId remains the only formal follow-up event field family in owned runtime/export/import/editor surfaces, empty nextEventId still closes directly, and explicit self-reference is rejected.`
  - `ACC-EVENT-SETTLE-004 is now locally claimable: authored navigation/time continuation no longer rides helper-owned runtime followUp transport, and runtime now uses explicit post-commit seams instead of a second routing contract.`
- parent_spec_preservation:
  - `Preserved so far: the queue starts strictly after canonical reuse closeout and does not overreach into settlement or final migration scope.`
- capability_floor_verification:
  - `Satisfied locally. nextEventId field unification, direct-close behavior, self-reference guard, and event-only routing ownership are now recorded in generated/blueprint/instance-next-event-id-routing-closeout-proof.json plus targeted robustness coverage.`
- out_of_scope_routing:
  - `No out-of-scope routing is currently required.`
- verification_sufficiency:
  - `Sufficient for local queue closeout. Remaining work is the formal repository-sync gate, not another queue-local implementation slice.`
- user_path_matrix_verification:
  - `Pending. Runtime, authoring, import/export, preview, and startup follow-up behavior have not yet been re-audited under the nextEventId-only boundary.`
- functional_loss_audit:
  - `Complete for queue-local scope. Empty nextEventId still closes directly, legacy dialogue/flow residue fails closed instead of silently lowering, and the remaining reenter-house signal stays outside authored event-routing truth as a return-only interactive path.`
- replacement_proof_summary:
  - `Complete locally. generated/blueprint/instance-next-event-id-routing-closeout-proof.json proves one nextEventId field family plus one event-only routing owner across the owned surfaces.`
- placeholder_or_legacy_fallback_audit:
  - `Complete for the inventory stage. generated/blueprint/instance-next-event-id-routing-inventory.json now freezes the three mixed follow-up residue families plus the direct-close vs split-event migration table and the first implementation slice.`
- gap_fill_decision:
  - `none`
- gap_fill_scope:
  - `none`
- remaining_gaps:
  - `No further queue-local implementation gap remains. Only the repository-sync gate remains before same-version admission may move to queue.settlement-resource-and-event-type-convergence.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile` | `done` | `Lock nextEventId/event-only-routing evidence, owned rewrite surfaces, and implementation anchors before code changes.` | `none` | `Completed with generated/blueprint/instance-next-event-id-routing-evidence.json and queue-local anchor/residue truth.` |
| `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock` | `done` | `Inventory mixed follow-up surfaces, record split-event vs direct-close migration rules, and freeze preservation reasoning.` | `task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile` | `Completed with generated/blueprint/instance-next-event-id-routing-inventory.json and the frozen first implementation slice.` |
| `task.instance-next-event-id-and-event-routing-convergence.next-event-id-cutover-and-guard-baseline` | `done` | `Land nextEventId-only routing rewrite and prove event-only runtime ownership with fail-closed guards.` | `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock` | `Completed with generated/blueprint/instance-next-event-id-routing-closeout-proof.json and targeted guard coverage for ACC-EVENT-SETTLE-003 / 004.` |

### Task Definitions

#### `task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/domain/**`
  - `src/application/**`
  - `src/core/**`
  - `src/content/scenario-packs/**`
  - `tests/**`
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
  - `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`
- must_inspect:
  - `nextEventId surfaces and alternate follow-up field names`
  - `event-owned follow-up runtime seams`
  - `middle-layer routing residues such as resolver/selector/helper-owned continuation`
  - `owned export/import/preview/startup routing anchors`
- must_not_change:
  - `Do not claim nextEventId convergence before the evidence lock records all owned routing surfaces and migration rules.`
  - `Do not widen into settlement resource or event-type work.`
- done_when:
  - `Evidence Lock is locked.`
  - `The queue records the owned routing surfaces, prohibited middle-layer residues, and implementation anchors accurately.`
  - `Minimum verification remains accurate for the current queue stage.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record a real blocker in queue truth instead of pausing at ambiguity.`
- promote_next_if_done: `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock`
- stop_if:
  - `implementation-anchor-conflict`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Lock the nextEventId/event-only-routing baseline before code changes.`
- task_outcome_summary:
  - `Done. Runtime, import/export, editor validation, and helper-owned continuation anchors are now locked in queue truth and generated/blueprint/instance-next-event-id-routing-evidence.json. The queue can now inventory mixed follow-up families and freeze the first implementation slice without re-deriving the baseline.`

#### `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock`

##### Control Block

- task_id: `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/**`
  - `src/application/**`
  - `src/content/scenario-packs/**`
  - `tests/**`
- must_inspect:
  - `mixed follow-up field names and payload-bearing follow-up records`
  - `missing-follow-up cases that require split event + event-binding`
  - `empty-close cases that should remain direct close`
- must_modify:
  - `queue-local inventory truth`
  - `preservation-exception records`
  - `generated or documented routing inventories as needed`
- must_preserve:
  - `event as sole routing owner`
  - `result-entry-local nextEventId semantics where instance meaning requires them`
- must_not_change:
  - `Do not land runtime rewrite before inventory and migration rules are recorded.`
- done_when:
  - `Mixed follow-up surface inventory is complete.`
  - `Split-event vs direct-close migration rules are explicitly recorded.`
  - `Implementation slice scope is frozen without overreach into settlement.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Route a blocker or same-family residue instead of leaving routing truth implicit.`
- promote_next_if_done: `task.instance-next-event-id-and-event-routing-convergence.next-event-id-cutover-and-guard-baseline`
- stop_if:
  - `real-blocker`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Inventory mixed follow-up surfaces and freeze routing-boundary migration rules.`
- task_outcome_summary:
  - `Done. generated/blueprint/instance-next-event-id-routing-inventory.json now records the owned-surface inventory across nextEventId anchors, dialogue.followUps residue, legacy flow eventStartTarget residue, and helper-owned runtime followUp residue. It also freezes the direct-close vs split-event migration table and the first bounded implementation slice: explicit nextEventId self-reference rejection plus guard-baseline strengthening.`

#### `task.instance-next-event-id-and-event-routing-convergence.next-event-id-cutover-and-guard-baseline`

##### Control Block

- task_id: `task.instance-next-event-id-and-event-routing-convergence.next-event-id-cutover-and-guard-baseline`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/**`
  - `src/application/**`
  - `src/core/**`
  - `src/content/scenario-packs/**`
  - `tests/**`
  - `docs/change-log.md`
- must_inspect:
  - `all owned follow-up references and runtime startEvent handoff paths`
  - `self-reference rejection paths`
  - `resolver/selector/helper-owned continuation residues`
- must_modify:
  - `owned follow-up references`
  - `runtime routing seams`
  - `tests and source guards`
  - `docs/change-log.md once implementation lands`
- must_replace:
  - `mixed follow-up field names`
  - `middle-layer routing truth surviving in owned surfaces`
- must_preserve:
  - `event as sole routing owner`
  - `direct-close behavior when nextEventId is empty`
- must_not_change:
  - `Do not claim queue closeout while alternate routing owners or mixed follow-up fields remain live in owned surfaces.`
- done_when:
  - `Owned follow-up references converge on nextEventId.`
  - `Event remains the only routing owner with no middle layer.`
  - `Queue-local verification is sufficient for ACC-EVENT-SETTLE-003 / 004.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker truthfully in the queue doc and version plan.`
- promote_next_if_done: `none`
- stop_if:
  - `real-blocker`
  - `capability-downgrade-risk`

##### Human Context

- task_brief:
  - `Land nextEventId-only routing and prove event-only runtime ownership.`
- task_outcome_summary:
  - `Done. Task3 completed the guarded nextEventId cutover by preserving nextEventId as the only formal event follow-up field family, keeping legacy dialogue/flow residue fail-closed, removing navigation/time helper-owned runtime followUp routing contracts, and proving that only the non-routing reenter-house return signal remains on the shared runtime followUp seam.`

### Progress Log

- `2026-07-24`: `Queue admitted and activated automatically after queue.event-and-building-instance-canonical-reuse closed with successful repository sync to origin/mod-first-dev.`
- `2026-07-24`: `Active-task truth starts at task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile so Blueprint resumes from owned nextEventId/event-only-routing evidence lock rather than pausing at queue-admission state.`
- `2026-07-24`: `task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile is now complete. generated/blueprint/instance-next-event-id-routing-evidence.json freezes the current runtime anchors (EventDefinition.nextEventId, dialogue finish startEvent(nextEventId), choice-level nextEventId, export/import preservation, and editor missing-target validation) plus the three blocking residue families: dialogue.followUps authoring residue, legacy flow eventStartTarget/returnPolicy lowering, and helper-owned runtime followUp seams.`
- `2026-07-24`: `The queue automatically promoted task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock to active. The next lawful local action is to translate the locked evidence into a complete mixed-surface inventory, explicit split-event vs direct-close migration rules, and a frozen first implementation slice for task3.`
- `2026-07-24`: `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock is now complete. generated/blueprint/instance-next-event-id-routing-inventory.json freezes the owned-surface inventory, the direct-close vs split-event migration decision table, and the first bounded implementation slice centered on explicit nextEventId self-reference rejection.`
- `2026-07-24`: `The queue automatically promoted task.instance-next-event-id-and-event-routing-convergence.next-event-id-cutover-and-guard-baseline to active. Execution now continues directly into TDD-backed guard implementation instead of pausing at the inventory checkpoint.`
- `2026-07-24`: `Task3 slice 1 is now live in production code. src/application/script-editor/runtime-pack-export.ts rejects event.nextEventId self-reference explicitly, src/application/script-editor/workspace-shell.ts surfaces the same shape as a blocked editor issue, and targeted robustness coverage proves that self-referential nextEventId can no longer pass export or workspace validation.`
- `2026-07-24`: `Task3 slice 2 then removed new dialogue.followUps authoring residue without widening scope: default dialogue authoring records no longer create an empty followUps array, the story-dialogue-event authoring helper module no longer exports follow-up append/update/remove APIs, and normalization only preserves followUps when legacy data already carries them. This stops new residue authoring while keeping legacy fail-closed inventory visible for later cutover.`
- `2026-07-24`: `Task3 slice 3 then retired legacy flow eventStartTarget export lowering. runtime-pack-export no longer converts eventStartTarget/ownerKind/ownerId/returnPolicy legacy flow routing fields into event actions; it now fails closed on those retired routing fields, and workspace-shell surfaces the same residue as a blocked export issue. Targeted robustness coverage is green for both export and workspace blocking.`
- `2026-07-24`: `Task3 slice 4 then removed navigation-entered followUp transport from shared runtime truth. navigation-runtime no longer emits navigation.entered-city / navigation.entered-house, src/main.ts now triggers city-enter / house-enter story checks through applyPostNavigationStoryTrigger(...) after the navigation commit returns, and navigation-time-follow-up no longer owns authored story routing.`
- `2026-07-24`: `Task3 slice 5 then removed time runtime followUp transport from shared runtime truth. time-runtime no longer emits time.advanced / time.council-threshold-crossed, src/main.ts now calls syncCouncilPriorityAfterGameStateChange(previousGameState) explicitly after the covered time-commit paths, and createNavigationTimeFollowUpBridge is gone from production code.`
- `2026-07-24`: `generated/blueprint/instance-next-event-id-runtime-followup-residue.json is now refreshed to show authored routing residue removed from the shared runtime followUp contract. The only remaining followUp contract entry is the non-routing reenter-house return signal, and generated/blueprint/instance-next-event-id-routing-closeout-proof.json records local queue closeout readiness for ACC-EVENT-SETTLE-003 / 004.`
