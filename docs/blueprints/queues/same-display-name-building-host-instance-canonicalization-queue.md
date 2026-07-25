# Same Display Name Building Host Instance Canonicalization Queue

## Control Block

- queue_id: `queue.same-display-name-building-host-instance-canonicalization`
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
- closure_basis: `Queue closeout proof and repository-sync gate are complete. ACC-EVENT-SETTLE-005A is covered for the queue-owned boundary, commit acf24fe landed the same-name host canonicalization batch, and push to origin/mod-first-dev succeeded before the next same-version queue was admitted.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `queue.full-chain-event-routing-and-settlement-consistency`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- auto_continue_policy: `required`
- idle_after_task_completion: `forbidden`
- queue_close_handoff: `version-plan-routing`
- sync_status: `success`
- sync_scope: `remote-sync`
- sync_summary: `Repository-sync gate satisfied: closeout truth was synchronized, commit acf24fe landed on mod-first-dev, and push to origin/mod-first-dev succeeded before queue.full-chain-event-routing-and-settlement-consistency admission.`
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
  - `Converge duplicate same-display-name real building hosts onto canonical template-scope host ids, rewrite all necessary direct host references to those canonical ids, and leave later full-chain consistency work on one stable host-id graph. Legacy building-arrangement rows may remain city-scoped in this queue as long as canonical hosts still resolve them lawfully.`
- Parent spec:
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
- Parent requirement role:
  - `This queue owns ACC-EVENT-SETTLE-005A and must eliminate duplicate real building host truth before the later full-chain consistency queue can claim startup/runtime parity on canonical host ids.`
- Forbidden expansions:
  - `Do not reopen settlement resource/event-type implementation except to consume its landed truth.`
  - `Do not absorb full-chain export/import/loading/preview/startup/runtime parity into this queue.`
  - `Do not preserve duplicate real hosts merely because legacy ids differ or because city-scoped host ids are already widespread.`
  - `Do not add compatibility-import aliasing, resolver layers, or src/main.ts business branches as a shortcut around direct host-id rewrite.`

### Parent Spec Inheritance

- inherited_required_capabilities:
  - `same-display-name real building hosts converge to one surviving canonical host per repeated display-name family`
  - `direct references in houses/cities[].houseIds/cities[].mountedBuildings[].buildingId/city-entries[].targetHouseId/characters[].houseId/location-access[].targetId and related host-owned runtime/startup paths rewrite to canonical ids`
  - `canonical selection prefers deterministic template-scope ids rather than preserving one arbitrary city-owned survivor`
  - `unique hosts that do not belong to a same-display-name duplicate family stay explicit preservation exceptions`
- inherited_compatibility_paths:
  - `building behavior remains on the arrangement / event-binding / playable-flow / shared-runtime path`
  - `normal start, JSON import, Script Editor runtime preview, and building/module entry must remain routable after direct host-id rewrite`
  - `event-owned routing and settlement-owned write-back truth from earlier queues remain intact`
- inherited_legacy_replacements:
  - `city-scoped duplicate real host records that differ only by city-local ids while sharing the same creator-facing display-name family`
  - `direct consumer assumptions that mountedBuildings, targetHouseId, currentHouseId, or arrangement.buildingId must keep city-scoped duplicate host ids forever`
  - `host lookup paths that rely on duplicate record retention instead of canonical id rewrite`
- inherited_non_goals:
  - `Do not yet claim full-chain consistency across export/import/loading/preview/startup/runtime.`
  - `Do not yet claim final migration acceptance or compatibility rejection closeout.`
- parent_spec_change_policy:
  - `If implementation proves the parent spec must change, update the parent spec first and then reconcile this queue before treating any capability as removed, deferred, or accepted residue.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `locked`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-EVENT-SETTLE-005A`
- acceptance_not_claimed:
  - `ACC-EVENT-SETTLE-006`
  - `ACC-EVENT-SETTLE-007`
  - `ACC-EVENT-SETTLE-008`
- minimum_verification:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- locked_evidence_artifacts:
  - `generated/blueprint/same-display-name-host-canonicalization-evidence.json`
  - `generated/blueprint/same-display-name-host-canonicalization-inventory.json`
  - `generated/blueprint/same-display-name-host-canonicalization-preflight.json`
  - `generated/blueprint/same-display-name-host-canonicalization-consumer-audit.json`
  - `generated/blueprint/same-display-name-host-council-priority-selection-audit.json`
  - `generated/blueprint/same-display-name-host-council-priority-house-projection-preflight.json`
  - `generated/blueprint/same-display-name-host-missing-arrangement-refusal-audit.json`
  - `generated/blueprint/same-display-name-host-source-rewrite-preview.json`
  - `generated/blueprint/same-display-name-host-canonicalization-applied-summary.json`
  - `generated/blueprint/same-display-name-host-canonicalization-closeout-proof.json`
- locked_runtime_anchors:
  - `src/content/scenario-packs/zhuyuanzhang/houses.json now stores 10 host records: 9 canonical template-scope repeated-name hosts plus the preserved unique host house.kulan.temple.`
  - `src/content/scenario-packs/zhuyuanzhang/cities.json now routes repeated-name houseIds and mountedBuildings[].buildingId through canonical host ids, while city-entries.json, characters.json, and location-access.json now do the same for direct host-id surfaces.`
  - `src/content/scenario-packs/zhuyuanzhang/building-arrangements.json now points repeated-name families at canonical template host ids as landed source truth, while preserved unique host house.kulan.temple remains city-scoped by design.`
  - `src/application/presenter/stage-presenters.ts now passes cityDefinitions into building-stage selection so canonical host lookup still resolves city-local placement context.`
  - `src/application/building/building-module-entry.ts, src/core/runtime/navigation-runtime.ts, src/application/runtime/navigation-time-follow-up.ts, and src/main.ts now resolve canonical host ids against same-family legacy arrangement ids instead of requiring exact arrangement.buildingId equality.`
- locked_residue_surfaces:
  - `Unique hosts such as house.kulan.temple remain outside the repeated-name duplicate set and stay explicit preservation exceptions.`
- locked_scope_boundary:
  - `This queue owns same-display-name host canonicalization, direct host-reference rewrite, and the first runtime/startup guard baseline needed to consume canonical host ids.`
  - `Full-chain parity, migration rejection, and final acceptance remain later queues.`

### Claim Boundary

#### Can Claim

- `ACC-EVENT-SETTLE-005A once same-display-name real building hosts converge to deterministic canonical ids and all queue-owned direct references rewrite to those canonical ids with no stale duplicate host truth in the owned surfaces.`

#### Cannot Claim

- `ACC-EVENT-SETTLE-006 full-chain export/import/loading/preview/startup/runtime parity`
- `ACC-EVENT-SETTLE-007 explicit migration and compatibility rejection closeout`
- `ACC-EVENT-SETTLE-008 final browser/runtime acceptance across all entrypoints`

#### Capability Floor

- `When this queue closes, later queues must be able to assume one canonical host-id graph for repeated-name real buildings and no surviving stale direct references in the owned source/runtime surfaces.`

#### Parent Capability Coverage

- owned_closure:
  - `ACC-EVENT-SETTLE-005A same-display-name host canonicalization and direct host-reference rewrite.`
- preserved_not_owned:
  - `settlement boundary convergence from the prior queue remains intact.`
  - `full-chain consistency and final migration acceptance remain later-version work.`
- routed_elsewhere:
  - `Cross-entrypoint parity belongs to queue.full-chain-event-routing-and-settlement-consistency.`
  - `Compatibility rejection and final acceptance belong to queue.event-routing-settlement-migration-and-final-acceptance.`

#### Over-Narrowing Guard

- parent_capabilities_not_owned_by_this_queue:
  - `full-chain export/import/loading/preview/startup/runtime consistency remains owned by the next queue`
  - `explicit migration/rejection/final acceptance remain owned by the required-final queue`
- forbidden_scope_shrinkage:
  - `Do not pass this queue by deduplicating only houses.json while cities[].houseIds, mountedBuildings[].buildingId, targetHouseId, characters[].houseId, location-access[].targetId, or host-owned runtime lookups still preserve stale city-scoped duplicates.`
  - `Do not pass this queue by selecting one surviving city-owned host id such as house.kulan.keep or home_001 as permanent canonical truth for a repeated-name family.`
  - `Do not push house-id rewrite burden into a compatibility alias layer or later full-chain queue when direct source/runtime anchors are already inside this queue's boundary.`
- unspecified_detail_policy:
  - `Prefer deterministic template-scope canonical host ids and explicit direct-reference rewrite over city-owned survivor bias or compatibility shims.`
- gap_routing_policy:
  - `If a required owned surface cannot yet consume canonical host ids here, record same-family residue or blocker instead of silently leaving dual host truth.`

#### User Path Coverage Matrix

- primary_paths:
  - `city mounted building selection, city directory entry, enter-house routing, and arrangement lookup all resolve through canonical host ids for repeated-name families.`
- alternate_paths:
  - `Script Editor runtime materialization, JSON import/startup, and normal startup remain able to resolve the same canonical host graph once the queue-owned rewrite lands.`
- leave_return_or_followup_paths:
  - `currentHouseId-backed building/event/playable owner paths continue to reach the active house without reverting to duplicate host records.`
- empty_or_fail_closed_paths:
  - `Missing canonical host references or stale duplicate ids in queue-owned surfaces must fail closed or be rewritten explicitly rather than silently falling back through duplicate record retention.`
- rejection_or_error_paths:
  - `Unique hosts outside repeated-name duplicate families must stay preserved explicitly instead of being collapsed by a broad same-type merge rule.`
- forbidden_regressions:
  - `Do not regress event-owned routing, settlement-owned write-back, or per-city arrangement selection while canonicalizing hosts.`

#### Functional Loss Budget

- budget: `zero`
- loss_accounting_rule:
  - `Any lost building-entry reachability, city-directory target resolution, or currentHouseId-backed runtime behavior caused by host canonicalization must be repaired or routed explicitly; silent downgrade is not allowed.`

#### Replacement Proof

- previous_owner_or_path:
  - `Repeated-name real building hosts currently survive as many city-scoped house ids with direct references scattered through source data and runtime/startup lookups.`
- new_owner_or_path:
  - `Deterministic template-scope canonical host ids such as home.template and house.template.<family> own repeated-name host truth, while unique hosts stay explicit exceptions.`
- behavior_preservation_expectation:
  - `Per-city arrangement selection and building entry remain reachable, but direct house-id truth converges onto canonical ids instead of duplicate city-owned records.`
- old_truth_owner_exit_proof:
  - `Queue closeout must show that repeated-name duplicate hosts no longer survive as active owned truth in houses/cities/city-entries/characters/location-access/runtime lookup seams; legacy arrangement rows may remain only as city-scoped authored input records if canonical hosts already consume them lawfully.`
- verification_evidence:
  - `Locked evidence/inventory/preflight artifacts plus targeted source/runtime guards proving canonical host ids consume the queue-owned direct reference surfaces.`

### Queue Snapshot

- queue_goal: `Canonicalize repeated-name real building hosts and rewrite the owned direct house-reference graph before full-chain parity work begins.`
- task_count: `5`
- completed_task_count: `5`
- remaining_task_count: `0`
- active_task_summary: `Queue is closed. Same-name host merge, direct host-id rewrite, canonical-aware runtime consumption, closeout proof, and repository sync are all complete, and execution has already handed off to queue.full-chain-event-routing-and-settlement-consistency.`
- task_briefs:
  - `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile: lock duplicate-host groups, direct rewrite counts, and runtime/startup consumer anchors before implementation.`
  - `task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock: freeze the repeated-name family inventory, canonical ids, preservation exceptions, and direct rewrite order.`
  - `task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight: freeze the first implementation batch across source families plus the runtime/startup consumers that still assume city-scoped house ids.`
  - `task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline: land canonical host ids, direct reference rewrite, and guard coverage without widening into full-chain parity work.`
  - `task.same-display-name-building-host-instance-canonicalization.queue-closeout-review-and-sync-gate: verify local closeout proof, synchronize governed truth, and attempt the required repository-sync gate before admitting the next same-version queue.`

### Completion Completeness Review

- review_status: `in-progress`
- review_status: `complete`
- can_claim_coverage:
  - `Locally claimable for ACC-EVENT-SETTLE-005A. Same-name host merge plus direct host-id rewrite are landed, no repeated-name duplicate host remains in owned source truth, and local closeout proof is now recorded.`
- parent_spec_preservation:
  - `Preserved so far: this queue starts strictly after settlement closeout and does not overreach into full-chain consistency or final migration scope.`
- capability_floor_verification:
  - `Satisfied locally. Canonical host ids and direct reference rewrites are landed in the queue-owned source/runtime surfaces, and repeated-name arrangement rows are also canonicalized even though that was not required for queue completion.`
- out_of_scope_routing:
  - `ACC-EVENT-SETTLE-006 routes to queue.full-chain-event-routing-and-settlement-consistency.`
  - `ACC-EVENT-SETTLE-007 / 008 route to queue.event-routing-settlement-migration-and-final-acceptance.`
- verification_sufficiency:
  - `Sufficient for queue closeout review. build:test, targeted host-canonicalization robustness guards, lint:blueprints, lint:blueprint-skill, and blueprint:governance:check all pass locally.`
- user_path_matrix_verification:
  - `Satisfied for the queue-owned boundary. Canonical host ids are live across source/runtime surfaces, building entry and navigation keep city-local behavior, and council-priority speaker projection no longer depends on duplicate host retention.`
- functional_loss_audit:
  - `No queue-local loss is recorded at the non-destructive stage.`
- replacement_proof_summary:
  - `Local proof is recorded in generated/blueprint/same-display-name-host-canonicalization-closeout-proof.json. The queue has landed the source/runtime rewrite batch, canonical-aware legacy-arrangement matching, and direct-source canonicalization across all owned host-id surfaces.`
- placeholder_or_legacy_fallback_audit:
  - `Complete for the preflight stage. There is no pre-existing template-scope host family to reuse directly, so the queue must create deterministic canonical host ids rather than silently inheriting one city-owned survivor.`
- gap_fill_decision:
  - `implementation-required`
- gap_fill_scope:
  - `task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline`
- remaining_gaps:
  - `The unrelated baseline test script editor runtime export materializes city mounted buildings and npcs over imported runtime tables still fails outside this queue's owned slice and must not be misclassified as a new host-canonicalization regression.`
  - `No further queue-local implementation or governance gap remains.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile` | `done` | `Lock duplicate-host groups, direct rewrite counts, and runtime/startup consumer anchors before implementation.` | `none` | `Completed with generated/blueprint/same-display-name-host-canonicalization-evidence.json.` |
| `task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock` | `done` | `Freeze repeated-name family inventory, canonical ids, preservation exceptions, and direct rewrite order.` | `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile` | `Completed with generated/blueprint/same-display-name-host-canonicalization-inventory.json.` |
| `task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight` | `done` | `Freeze the first implementation batch across source families and runtime/startup consumers that still assume city-scoped host ids.` | `task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock` | `Completed with generated/blueprint/same-display-name-host-canonicalization-preflight.json.` |
| `task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline` | `done` | `Land canonical host ids, direct reference rewrite, and guard coverage across the owned surfaces.` | `task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight` | `Done. Same-name host merge, direct source/runtime host-id rewrite, canonical-aware arrangement lookup, and queue-owned guard coverage are all landed locally.` |
| `task.same-display-name-building-host-instance-canonicalization.queue-closeout-review-and-sync-gate` | `done` | `Verify queue-closeout proof, synchronize governed truth, and attempt the repository-sync gate before admitting the next same-version queue.` | `task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline` | `Done. Queue closeout proof was synchronized, commit acf24fe landed, push to origin/mod-first-dev succeeded, and same-version execution moved directly to queue.full-chain-event-routing-and-settlement-consistency.` |

### Task Definitions

#### `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/application/**`
  - `src/core/**`
  - `src/main.ts`
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
  - `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`
- must_inspect:
  - `repeated-name duplicate host groups in houses.json`
  - `direct host-reference counts across building-arrangements, mountedBuildings, and city entries`
  - `runtime/startup consumers that still assume city-scoped house ids`
- must_not_change:
  - `Do not start source/runtime rewrite before evidence lock records the duplicate groups, direct reference counts, and consumer anchors.`
  - `Do not widen into full-chain consistency or final migration scope.`
- done_when:
  - `Evidence Lock is locked.`
  - `The queue records repeated-name duplicate groups, absence of pre-existing template host ids, direct rewrite counts, and runtime/startup consumer anchors accurately.`
  - `Minimum verification remains accurate for the current queue stage.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:blueprint-skill`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record a real blocker in queue truth instead of pausing at ambiguity.`
- promote_next_if_done: `task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock`
- stop_if:
  - `implementation-anchor-conflict`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Lock the duplicate-host baseline before implementation.`
- task_outcome_summary:
  - `Done. The queue now records the repeated-name duplicate host families, the absence of pre-existing template host ids, direct rewrite-surface counts across houses/building-arrangements/mountedBuildings/city entries, and the current runtime/startup consumers that still assume city-scoped host ids.`

#### `task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock`

##### Control Block

- task_id: `task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/application/**`
  - `src/core/**`
  - `generated/blueprint/**`
- must_inspect:
  - `which repeated-name families should canonicalize to new template-scope ids`
  - `which hosts remain preservation exceptions because they are not same-display-name duplicates`
  - `the direct rewrite order across houses/building-arrangements/cities/city entries/runtime consumers`
- must_modify:
  - `queue-local inventory truth`
  - `generated/blueprint/same-display-name-host-canonicalization-inventory.json`
- must_preserve:
  - `per-city arrangement selection remains possible`
  - `event-owned routing and settlement-owned write-back remain intact`
- must_not_change:
  - `Do not land code before canonical ids, preserve-list rules, and direct rewrite order are frozen.`
- done_when:
  - `Repeated-name family inventory is complete.`
  - `Deterministic canonical ids and preservation exceptions are recorded explicitly.`
  - `The bounded direct rewrite order is frozen without absorbing later full-chain scope.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Route a blocker or same-family residue instead of leaving canonical selection implicit.`
- promote_next_if_done: `task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight`
- stop_if:
  - `real-blocker`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Freeze repeated-name family inventory, canonical ids, and rewrite order.`
- task_outcome_summary:
  - `Done. The queue now records deterministic canonical ids such as home.template and house.template.<family> for the repeated-name host families, preserves unique hosts such as house.kulan.temple explicitly, and freezes the direct rewrite order across source and runtime/startup consumers.`

#### `task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight`

##### Control Block

- task_id: `task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/application/**`
  - `src/core/**`
  - `src/main.ts`
  - `tests/**`
- must_inspect:
  - `the first write batch across houses/building-arrangements/cities/city entries`
  - `runtime/startup consumer seams that still key on currentHouseId, targetHouseId, or arrangement.buildingId`
  - `the first guard coverage batch required to stop stale duplicate host ids from surviving silently`
- must_modify:
  - `queue-local active-task truth`
  - `generated/blueprint/same-display-name-host-canonicalization-preflight.json`
- must_preserve:
  - `cityId + buildingId arrangement selection behavior`
  - `enter-house and city-directory target semantics`
  - `no compatibility import`
- must_not_change:
  - `Do not widen into full-chain consistency, migration rejection, or browser acceptance while the first rewrite batch is still being frozen.`
- done_when:
  - `The first implementation batch is frozen with explicit source/runtime/test targets.`
  - `The queue can enter bounded implementation without re-deriving ownership or canonical-selection rules.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blockers in queue and version truth before any stop decision.`
- promote_next_if_done: `task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline`
- stop_if:
  - `real-blocker`
  - `capability-downgrade-risk`

##### Human Context

- task_brief:
  - `Prepare the first host canonicalization rewrite slice before code changes.`
- task_outcome_summary:
  - `Done. generated/blueprint/same-display-name-host-canonicalization-preflight.json now records the first write batch across houses.json, building-arrangements.json, cities.json, city-entries.json, script-editor runtime materialization, building/runtime entry lookup, and the initial guard/test surfaces that must reject stale duplicate host ids.`

#### `task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline`

##### Control Block

- task_id: `task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline`
- state: `done`
- task_kind: `implementation`
- scope:
  - `src/content/scenario-packs/zhuyuanzhang/**`
  - `src/application/**`
  - `src/core/**`
  - `src/main.ts`
  - `tests/**`
- must_land:
  - `canonical template-scope host ids for repeated-name families in houses.json`
  - `direct rewrite across building-arrangements.json, cities.json mountedBuildings, and city-entries.json targetHouseId`
  - `runtime/startup consumer alignment for currentHouseId, targetHouseId, and arrangement.buildingId lookups`
  - `guard/test coverage that rejects stale duplicate host ids or duplicate-payload regressions in the owned surfaces`
- must_preserve:
  - `per-city arrangement resolution by cityId + canonical buildingId`
  - `event-owned routing and settlement-owned write-back boundaries`
  - `unique-host preservation exceptions such as house.kulan.temple`
- done_when:
  - `owned source/runtime surfaces consume canonical host ids`
  - `targeted rewrite and guard coverage is green`
  - `the queue can enter closeout review without re-deriving canonical selection truth`
- verify_with:
  - `cmd /c npm run build:test`
  - `cmd /c npm run lint:blueprints`
  - `cmd /c npm run lint:blueprint-skill`
  - `cmd /c npm run blueprint:governance:check`

##### Human Context

- task_brief:
  - `Land canonical host ids, direct reference rewrite, and guard coverage.`
- task_outcome_summary:
  - `Done. Same-name host merge, direct source/runtime host-id rewrite, canonical-aware arrangement lookup, and targeted guard coverage are now landed locally, so the queue advances to queue-closeout review plus repository-sync gating.`

#### `task.same-display-name-building-host-instance-canonicalization.queue-closeout-review-and-sync-gate`

##### Control Block

- task_id: `task.same-display-name-building-host-instance-canonicalization.queue-closeout-review-and-sync-gate`
- state: `active`
- task_kind: `queue-closeout`
- scope:
  - `docs/blueprints/queues/same-display-name-building-host-instance-canonicalization-queue.md`
  - `docs/blueprints/plans/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `generated/blueprint/same-display-name-host-canonicalization-closeout-proof.json`
- must_verify:
  - `same-name duplicate hosts no longer survive in queue-owned source truth`
  - `direct host-id source/runtime surfaces consume canonical ids`
  - `known unrelated baseline failures stay classified outside the queue-owned slice`
- must_modify:
  - `queue-local closeout truth`
  - `version-plan closure review truth`
  - `active queue/task pointers if repository-sync gate succeeds`
- done_when:
  - `queue closeout proof is recorded locally`
  - `required governance lint/check commands pass`
  - `one repository-sync batch attempt is recorded truthfully before next-queue admission`
- verify_with:
  - `cmd /c npm run build:test`
  - `cmd /c npm run lint:blueprints`
  - `cmd /c npm run lint:blueprint-skill`
  - `cmd /c npm run blueprint:governance:check`
- if_blocked:
  - `Record sync-gate blocker truth in queue and version docs before any stop decision.`
- promote_next_if_done: `version-level next-queue admission`
- stop_if:
  - `real-blocker`
  - `parent-spec-change-required`

##### Human Context

- task_brief:
  - `Close out the same-name host canonicalization queue lawfully and drive the repository-sync gate.`
- task_outcome_summary:
  - `Done. Local closeout proof was synchronized, commit acf24fe landed the queue batch, push to origin/mod-first-dev succeeded, and same-version execution handed off directly to queue.full-chain-event-routing-and-settlement-consistency.`

### Progress Log

- `2026-07-24`: `Queue admitted automatically after queue.settlement-resource-and-event-type-convergence completed repository sync through commit b391e09 on origin/mod-first-dev.`
- `2026-07-24`: `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile is now complete. generated/blueprint/same-display-name-host-canonicalization-evidence.json freezes the repeated-name duplicate host groups, direct rewrite counts, and current runtime/startup consumer anchors.`
- `2026-07-24`: `The queue automatically promoted task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock to active.`
- `2026-07-24`: `task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock is now complete. generated/blueprint/same-display-name-host-canonicalization-inventory.json freezes deterministic canonical ids on new template-scope host ids, preserves unique hosts such as house.kulan.temple explicitly, and records the bounded direct rewrite order.`
- `2026-07-24`: `The queue automatically promoted task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight to active.`
- `2026-07-24`: `task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight is now complete. generated/blueprint/same-display-name-host-canonicalization-preflight.json freezes the first source/runtime/test batch for canonical host-id rewrite and stale-reference guard coverage.`
- `2026-07-24`: `The queue automatically promoted task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline to active.`
- `2026-07-24`: `Implementation slice 1 is now landed inside the active task. src/application/script-editor/city-building-runtime-materializer.ts no longer indexes mounted building ownership by bare buildingId; it now keys by cityId + buildingId so repeated cities sharing one canonical host id do not overwrite each other's mounted NPC ownership during runtime family materialization. The new canonical-host regression in tests/city-building-mount-authoring.test.cjs passes after build:test, while an older unrelated UI-source assertion in the same file still fails outside this queue's change boundary.`
- `2026-07-24`: `Implementation slice 2 is now landed inside the same active task. src/application/city/city-building-placement-resolver.ts no longer forwards the raw canonical house cityId blindly into city-placement consumers; it re-scopes placement.house.cityId to cityEntry.cityId so repeated cities sharing one canonical house id resolve the correct city NPC pool instead of leaking the first city's host state. tests/robustness.test.cjs now contains focused coverage for the shared-canonical-house placement path, and a post-build inline assertion confirms the new slice while an older unrelated runtime-export/materialization assertion in that file remains outside this queue's current slice boundary.`
- `2026-07-24`: `Post-slice-2 consumer audit is now frozen at generated/blueprint/same-display-name-host-canonicalization-consumer-audit.json. The remaining queue-local canonical-house consumer anchors are narrowed to council-priority and missing-arrangement seams that still read houseDefinition.cityId or defaultCharacterId from the shared canonical record, and the next bounded candidate is a non-destructive council-priority selection audit before broad source rewrite begins.`
- `2026-07-24`: `The council-priority selection audit is now frozen at generated/blueprint/same-display-name-host-council-priority-selection-audit.json. The queue has now made the remaining ambiguity concrete: canonical targetHouseId can stay shared, but council-arrival and council-refusal chains still derive speakerCharacterId from one selected HouseDefinition record, so a later bounded slice must introduce a city-scoped council-priority projection seam before broad same-display-name source rewrite can claim those reminder/refusal consumers are stable.`
- `2026-07-24`: `The council-priority house-projection preflight is now frozen at generated/blueprint/same-display-name-host-council-priority-house-projection-preflight.json. The queue has confirmed that main/runtime already hold one narrow city-local speaker seam through buildingArrangements and arrangement.primaryNpcId, so the next implementation-bearing slice can preserve canonical targetHouseId while projecting city-local speakerCharacterId without reintroducing duplicate real house records.`
- `2026-07-24`: `Implementation slice 3 is now landed inside the active task. src/application/runtime/navigation-time-follow-up.ts now accepts buildingArrangements and projects council-priority reminder speaker truth from the arrangement selected by currentCityId + canonical buildingId, while preserving the canonical shared targetHouseId. src/main.ts now supplies activeContentContext.buildingArrangements into that reminder path. The new council-arrival regression in tests/robustness.test.cjs passes after build:test; the older unrelated runtime-export/materialization assertion in the same file remains outside this queue's change boundary.`
- `2026-07-24`: `Implementation slice 4 is now landed inside the active task. src/main.ts no longer selects council-priority houses by moduleId alone and then leaves speaker truth on the shared canonical record; getCouncilPriorityHouseDefinition() now projects cityId plus defaultCharacterId from activeContentContext.buildingArrangements when currentCityId + canonical buildingId yields a city-local primaryNpcId, so council refusal consumers inherit the same canonical-house-id / city-local-speaker rule as the reminder path. The new source guard in tests/robustness.test.cjs passes, while the older unrelated runtime-export/materialization assertion in that file remains outside this queue's change boundary.`
- `2026-07-24`: `The missing-arrangement refusal consumer is now frozen separately at generated/blueprint/same-display-name-host-missing-arrangement-refusal-audit.json. The queue confirmed that navigation-runtime still lacks an already-available city-local speaker anchor once arrangement lookup fails, so that seam remains a later bounded consumer or source-rewrite preflight rather than an excuse to widen this slice or reintroduce duplicate host truth.`
- `2026-07-24`: `The queue has now frozen a production source rewrite preview at generated/blueprint/same-display-name-host-source-rewrite-preview.json. All repeated-name host families still lack live canonical house records in houses/building-arrangements/cities/city-entries source truth, and the preview selects home.template as the narrowest first owned data batch because it covers houses/building-arrangements/mountedBuildings rewrite without also widening into city-entry or temple-exception handling.`
- `2026-07-24`: `Operator scope clarification then narrowed queue completion to host merge plus necessary direct host-id rewrite only: repeated-name host merge now judges by displayName/name equality, legacy id and event-binding differences no longer block merge, and city-scoped building-arrangement rows are explicitly allowed to remain as non-blocking authored inputs for this queue.`
- `2026-07-24`: `The active task has now landed the first full host-only rewrite batch. zhuyuanzhang houses now converge to 9 canonical template-scope repeated-name host ids plus preserved house.kulan.temple, cities/city-entries/characters/location-access now consume canonical host ids directly, and generated/blueprint/same-display-name-host-canonicalization-applied-summary.json records the post-rewrite source counts and scope clarification.`
- `2026-07-24`: `The active task then aligned canonical host consumption with retained legacy arrangement rows instead of forcing arrangement convergence into this queue. src/application/building/building-module-entry.ts, src/core/runtime/navigation-runtime.ts, src/application/runtime/navigation-time-follow-up.ts, and src/main.ts now accept same-family legacy arrangement.buildingId rows for canonical host ids, and focused robustness guards plus built-in-template/source checks pass after rebuild.`
- `2026-07-24`: `Queue-local closeout proof is now recorded at generated/blueprint/same-display-name-host-canonicalization-closeout-proof.json. The repeated-name host graph is fully canonicalized in owned source truth, the required governance lint/check commands pass, build:test passes, and the only remaining failing robustness baseline is the older imported-runtime materialization assertion at tests/robustness.test.cjs:13204 outside this queue's owned slice.`
- `2026-07-24`: `The queue automatically promoted task.same-display-name-building-host-instance-canonicalization.queue-closeout-review-and-sync-gate to active. The next lawful action is the repository-sync batch before queue.full-chain-event-routing-and-settlement-consistency admission.`
- `2026-07-24`: `Queue closeout proof and repository-sync gate are now complete. Commit acf24fe landed the same-name host canonicalization batch, push to origin/mod-first-dev succeeded, and the queue closed without remaining same-family residue inside its owned boundary.`
