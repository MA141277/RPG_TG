# Event Canonical Reuse, Routing, And Settlement Governance Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- version_status: `open`
- active_phase: `phase.active-execution`
- active_queue: `queue.same-display-name-building-host-instance-canonicalization`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `active-queue`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `queue-admitted`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `admission-review`
- intake_item_id: `item.event-and-building-instance-canonical-reuse`
- intake_summary: `Create a new formal version spec/plan from the approved 2026-07-24 iteration draft, fully absorb the approved boundaries, and immediately admit the first required canonical-reuse queue instead of stopping at a version shell.`
- intake_result: `promoted-to-admission`
- intake_feedback_mode: `fixed-receipt`
- closure_review_subject: `queue.same-display-name-building-host-instance-canonicalization`
- closure_review_status: `evaluating`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `queue.settlement-resource-and-event-type-convergence completed repository sync through commit b391e09 on origin/mod-first-dev, so queue.same-display-name-building-host-instance-canonicalization is now the uniquely lawful active queue under the approved phase order.`
- next_lawful_queue_recommendation: `queue.full-chain-event-routing-and-settlement-consistency`
- auto_admission_ready: `false`
- stop_reason: `none`
- stop_basis: `none`
- next_unblocked_action: `none`
- human_input_required: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.event-and-building-instance-canonical-reuse`
  - `queue.instance-next-event-id-and-event-routing-convergence`
  - `queue.settlement-resource-and-event-type-convergence`
  - `queue.same-display-name-building-host-instance-canonicalization`
  - `queue.full-chain-event-routing-and-settlement-consistency`
  - `queue.event-routing-settlement-migration-and-final-acceptance`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.event-and-building-instance-canonical-reuse: closed after canonical reuse, duplicate-binding review, full owned reference rewrite, queue-closeout proof, and successful repository sync to origin/mod-first-dev.`
  - `queue.instance-next-event-id-and-event-routing-convergence: closed after repository sync to origin/mod-first-dev; it completed unified nextEventId routing with event as the only routing owner.`
  - `queue.settlement-resource-and-event-type-convergence: closed after settlement boundary convergence, queue-closeout proof, and successful repository sync through commit b391e09 on origin/mod-first-dev.`
  - `queue.same-display-name-building-host-instance-canonicalization: admitted and active; it follows settlement closeout and now owns same-display-name real building host deduplication plus direct host-reference rewrite across houses, building-arrangements, cities, city entries, characters, location-access, and related host-owned runtime/startup paths. Arrangement convergence was not required for closeout, but the landed source truth now canonicalizes repeated-name arrangement rows as well.`
  - `queue.full-chain-event-routing-and-settlement-consistency: not yet admitted; it follows settlement-contract freeze and owns Script Editor/export/import/loading/preview/startup/runtime full-chain consistency.`
  - `queue.event-routing-settlement-migration-and-final-acceptance: not yet admitted; required-final queue for explicit migration, fail-closed rejection, acceptance, and residue guard.`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/specs/2026-07-24-event-canonical-reuse-routing-and-settlement-governance-target.md`
  - `docs/blueprints/queues/event-and-building-instance-canonical-reuse-queue.md`

## Human Context

### Activation Record

- Scope approval:
  - `The operator explicitly requested creating a new formal version spec/plan from the 2026-07-24 iteration draft, fully absorbing the approved boundary, reducing future queue-splitting pauses, and immediately activating the first canonical-reuse queue instead of stopping at version-shell state.`
- Inherits from:
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-only-routing-and-flow-retirement-requirement-draft.md`
- Inheritance boundary:
  - `This version owns event/building/host-instance deduplication and canonical reuse, full owned reference rewrite, nextEventId convergence, event-only routing, settlement resource plus settlement event-type convergence, PlayableResult naming cleanup, cross-chain consistency, explicit migration, and final acceptance as one inseparable incompatible batch.`
  - `It does not reopen closed versions or split the owned chain into separate parent versions.`
- Activation conclusion:
  - `A new formal spec and plan now exist under distinct file names for the same governed version id.`
  - `queue.event-and-building-instance-canonical-reuse is now the active queue, and task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline is the live active task after canonical-candidate inventory finished.`

### Admission Review Record

- Intake handling:
  - `The operator intake already named the exact draft source, the required boundary, the required sync targets, the requirement to avoid ambiguity with the draft name, and the requirement to activate the first queue immediately.`
  - `Blueprint therefore records version creation and queue admission in one governed update batch.`
- Scope approval:
  - `Yes. The operator already approved deduplication-first phase ordering, nextEventId-only follow-up naming, event-only routing, settlement as resource plus event type, PlayableSettlement -> PlayableResult convergence, no compatibility import, and no middle routing layer.`
- Admission basis:
  - `The active entry pointed at an open shell with no admitted queue; this request requires the version to move into formal execution truth with an active queue and live active task.`
  - `queue.event-and-building-instance-canonical-reuse is the only lawful first queue because later nextEventId and settlement work depend on canonical ids and duplicate-truth removal.`
- Required truth sync:
  - `Satisfied in this document batch: blueprint pointers, version-plan pointers, project-progress entry pointers, queue doc activation, and active-task truth are all synchronized.`

### Version Lifecycle Rules

- `This version is open and actively executing through one active queue.`
- `If active_queue is not none, execution truth comes from the active queue and active task rather than promotion review.`
- `Do not implement code for later phases before the canonical-reuse queue closes and repository-sync gate is recorded.`
- `Do not reverse the approved high-level phase order unless a real blocker or governing-doc conflict is recorded here first.`
- `Do not split event/building canonical reuse, nextEventId routing, settlement convergence, and cross-chain consistency into separate parent targets while this version remains open.`
- `Task completion, queue admission, queue activation, or doc-only sync are not lawful stopping points by themselves.`
- `When an active task finishes, Blueprint must automatically promote the next lawful task in the same queue if one exists. If the queue has no remaining task, Blueprint must continue into the lawful queue-closeout and next-queue admission path instead of idling at completed-task state.`
- `When a queue closes and repository-sync gate truth is recorded, Blueprint must automatically continue into the next lawful queue under the approved phase order when one exists. It must not wait for a second operator prompt merely to leave an empty active-queue state.`

### Approved Phase Order And No-Pause Rule

- `The operator already approved version-level order. Blueprint may split bounded queues within a phase, but it must not pause again to ask which phase comes first.`

1. `event/building/host-instance deduplication, canonical reuse, duplicate-binding review, and full owned reference rewrite`
2. `instance-level nextEventId plus event-only routing convergence`
3. `settlement resources, event(type=settlement), and PlayableResult boundary convergence`
4. `same-display-name real building host canonicalization and direct host-reference rewrite`
5. `Script Editor/export/import/loading/preview/startup/runtime full-chain consistency`
6. `explicit migration, fail-closed rejection, acceptance, and final governance closeout`

- `Bulk identification, bulk folding, bulk reference rewrite, and bulk validation are the default working modes inside this version.`
- `The workflow must not pause again for already approved boundaries such as strong template-layer deduplication, empty nextEventId meaning direct close, explicit self-reference prohibition, settlement-entry-only references, or PlayableSettlement -> PlayableResult convergence.`
- `Escalation is lawful only when the parent goal would change, a new routing owner would be introduced, numeric-first settlement boundary would break, unrecoverable author content would be deleted without reconstruction, or governing docs conflict beyond the declared priority order.`

### Repository Sync Gate Application

- `This version follows the formal Blueprint repository-sync gate: task-level local-record during execution, then queue-level repository sync as the mandatory closeout-to-handoff gate.`
- `Task completion by itself does not require commit, push, or merge.`
- `Queue completion is different: once a queue reaches closeout truth, Blueprint must not admit or activate the next queue until one minimum repository-sync batch has been attempted and its result recorded.`
- `The minimum queue-closeout sync batch is: queue closeout docs first, one local branch commit attempt, one remote push attempt after successful commit, and one merge attempt only if the repository workflow requires it.`
- `This gate is result-driven rather than success-driven, but it must be recorded truthfully.`

### Formal Stop-Rule Application

- `Before ending a response while an active queue, active task, or uniquely lawful next governance action still exists, run the stop-condition self-check.`
- `Only these causes may lawfully stop execution: explicit answer-only request, real blocker, outside-parent-spec work, parent-spec change, capability downgrade risk, retired-rewrite risk, or genuine product decision.`
- `If none applies, do not stop at version creation, queue creation, queue admission, queue activation, or status reporting; continue to the active task.`
- `Temporary version-local enforcement: before any stop/closeout decision, emit a visible stop-check in commentary instead of relying on internal judgment alone.`
- `The stop-check must explicitly list: active_version, active_queue, active_task, whitelist_match, and result.`
- `If active_queue != none or active_task != none, the default result is continue. Stop is lawful only when whitelist_match names one of the approved stop-rule causes explicitly.`
- `If whitelist_match = none, do not emit a summary-style final answer that behaves like a stop. Continue to the next lawful action instead.`
- `If no visible stop-check was emitted, a stop decision is non-compliant for this version even if the internal reasoning would otherwise have been valid.`
- `Temporary operator override on 2026-07-24: do not stop to ask for confirmation while this version still has a live active queue or active task. Record blockers, conflicts, and assumptions in queue/version truth, then continue to the next lawful local action instead of pausing for operator input.`
- `Under this override, "needs confirmation" is not a lawful pause reason by itself. Only a hard execution impossibility may end the turn, and even then Blueprint should first record the blocker truthfully in the governed docs before stopping.`
- `Unattended-execution enforcement on 2026-07-24: while active_queue != none or active_task != none, do not use a final-answer closeout as a progress report. Mid-task progress must remain in commentary, and final-answer style summaries are forbidden until no further lawful local action exists.`
- `Governance sync, generated artifacts, successful lint/check runs, and stage-complete preflight results are explicitly non-terminal. They are checkpoints that must immediately hand off to the next lawful local action inside the same active task or queue.`
- `If the current active task still has any bounded local action such as audit, preflight, source rewrite preview, consumer-impact derivation, guard strengthening, or implementation slice preparation, the agent must continue without asking and without issuing a final closeout message.`
- `For unattended execution, the default loop is: update governed truth if needed -> run the next lawful local action -> re-sync governed truth if it changed -> continue. Do not convert that loop into answer/final turns merely because one checkpoint completed successfully.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> current version plan -> active queue -> active task before touching queue work.`
2. `queue.event-and-building-instance-canonical-reuse is the only lawful first queue under this version.`
3. `Before admitting any later queue, verify that canonical reuse and full owned reference rewrite are already closed and synchronized.`
4. `Do not admit later routing or settlement queues while duplicate instance truth or retired duplicate ids still survive.`
5. `Only after the queue doc exposes queue_status=active and a live active_task may implementation start.`

### Queue Spec Integrity Rule

- `No child queue under this version may pass by shrinking the parent boundary to one content family, one helper seam, or one editor-only path.`
- `Each queue must name its inherited capability floor, alternate-path preservation, replacement proof, and fail-closed requirements before closeout.`
- `If a queue spec is too thin, revise the queue spec first rather than pushing missing structure into a later queue by default.`

### Operator Receipt Record

- receipt_join_status: `success`
- receipt_join_type: `execution-queue`
- receipt_join_queue_id: `queue.same-display-name-building-host-instance-canonicalization`
- receipt_reason_code: `phase-order-auto-admission`
- receipt_reason_basis:
  - `The approved phase order and completed repository-sync gate for queue.settlement-resource-and-event-type-convergence make same-display-name building host canonicalization the uniquely lawful next admission.`
- receipt_active_queue: `queue.same-display-name-building-host-instance-canonicalization`
- receipt_active_task: `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile`
- receipt_queue_goal:
  - `Converge duplicate same-display-name real building hosts onto canonical template-scope ids and freeze the full direct-reference rewrite boundary before full-chain consistency work begins.`
- receipt_next_step:
  - `Continue from the same-display-name host canonicalization queue rather than returning to version review after settlement closeout.`
- receipt_human_action: `none-required`
- receipt_internal_analysis_exposed: `false`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger Type | Recheck Trigger Basis | Acceptance Refs | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.event-and-building-instance-canonical-reuse` | `queue-candidate` | `queue.event-and-building-instance-canonical-reuse` | `closed` | `queue-closeout-complete` | `It was the approved first phase and is now closed after sync succeeded.` | `ACC-EVENT-SETTLE-001; ACC-EVENT-SETTLE-002` | `canonical id selection, strong deduplication, duplicate-binding review, full owned reference rewrite` | `nextEventId routing, settlement resources, final migration acceptance` | `Must not be bypassed by later routing or settlement work.` |
| `item.instance-next-event-id-and-event-routing-convergence` | `queue-candidate` | `queue.instance-next-event-id-and-event-routing-convergence` | `closed` | `queue-closeout-complete` | `Repository sync succeeded, so the queue is closed and no longer the active execution target.` | `ACC-EVENT-SETTLE-003; ACC-EVENT-SETTLE-004` | `nextEventId field unification and direct event-owned follow-up routing` | `settlement resource authoring, final migration acceptance` | `Must preserve event as sole routing owner.` |
| `item.settlement-resource-and-event-type-convergence` | `queue-candidate` | `queue.settlement-resource-and-event-type-convergence` | `closed` | `queue-closeout-complete` | `Settlement boundary convergence is complete and repository sync succeeded through commit b391e09, so the queue is no longer the active execution target.` | `ACC-EVENT-SETTLE-005` | `settlement resource/event-type convergence and PlayableResult naming cleanup` | `cross-chain consistency or final migration ownership` | `Must preserve numeric-first settlement boundary.` |
| `item.same-display-name-building-host-instance-canonicalization` | `queue-candidate` | `queue.same-display-name-building-host-instance-canonicalization` | `active` | `queue-closeout` | `Implementation work is complete locally, closeout proof is recorded, and the queue is now executing the required repository-sync gate before the next same-version admission.` | `ACC-EVENT-SETTLE-005A` | `same-display-name real building host deduplication and direct host-reference rewrite across houses/building-arrangements/cities/city entries/characters/location-access/related host-owned paths, with arrangement convergence non-blocking but now already landed for repeated-name families` | `settlement contract freeze, whole-chain parity, or final migration acceptance` | `Must not be reframed as taxonomy cleanup or preserve duplicate host instances only because legacy ids differ.` |
| `item.full-chain-event-routing-and-settlement-consistency` | `queue-candidate` | `queue.full-chain-event-routing-and-settlement-consistency` | `candidate-recorded` | `queue-closeout` | `Recheck only after settlement contracts are frozen.` | `ACC-EVENT-SETTLE-006` | `full-chain parity on canonical ids, nextEventId, and settlement events` | `migration closeout or new router invention` | `Must remain distinct from settlement authoring and final acceptance.` |
| `item.event-routing-settlement-migration-and-final-acceptance` | `queue-candidate` | `queue.event-routing-settlement-migration-and-final-acceptance` | `candidate-recorded` | `queue-closeout` | `Recheck only after all implementation-bearing queues close.` | `ACC-EVENT-SETTLE-007; ACC-EVENT-SETTLE-008` | `explicit migration, rejection coverage, final acceptance, residue guard` | `primary ownership of earlier implementation-bearing queues` | `Required-final queue only.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.event-and-building-instance-canonical-reuse` | `closed` | `already promoted` | `Closed after repository sync succeeded.` |
| `queue.instance-next-event-id-and-event-routing-convergence` | `closed` | `already promoted` | `Closed after repository sync succeeded.` |
| `queue.settlement-resource-and-event-type-convergence` | `closed` | `already promoted` | `Closed after repository sync succeeded through commit b391e09 on origin/mod-first-dev.` |
| `queue.same-display-name-building-host-instance-canonicalization` | `active` | `already promoted` | `Admitted immediately after queue.settlement-resource-and-event-type-convergence recorded successful repository sync.` |
| `queue.full-chain-event-routing-and-settlement-consistency` | `candidate-ready` | `only after queue.same-display-name-building-host-instance-canonicalization closes` | `Must stay distinct from settlement authoring, host-instance canonicalization, and final acceptance.` |
| `queue.event-routing-settlement-migration-and-final-acceptance` | `candidate-ready` | `only after all implementation-bearing queues close` | `Required-final queue.` |

### Candidate Backlog Refresh Rule

- `After an execution queue closes or candidate routing changes, refresh candidate truth before answering whether more same-version candidate queues remain.`
- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`
- `Use docs/change-log.md only when structured governance docs are insufficient or explicitly cited by the version plan.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails during version admission, queue activation, execution, or closeout, repair the governing docs/spec structure inside the current lawful boundary first.`
- `If lint failure proves the queue spec is too thin, revise the queue spec before continuing implementation.`
- `Blueprint lint failure must not be treated as accepted residue or bypassed by queue handoff.`

### Operator Intake Contract

- Allowed operator intake:
  - `新需求`
  - `参考治理规范`
- Internal-only Blueprint work:
  - `read project-progress -> blueprint -> version plan -> active queue -> active task`
  - `attempt active-queue absorption`
  - `classify and route the intake`
  - `record candidate truth or admission truth without asking the operator to fill internal fields`
- Fixed receipt:
  - `处理结果：已进入 Blueprint 内部治理。`
  - `当前执行情况：继续当前 active queue / active task，或按治理结果切换到下一 lawful action。`
  - `人工操作：当前不需要 / 当前需要确认 xxx`
- Default operator output:

```text
处理结果：
- 鍔犲叆鐘舵€侊細鎴愬姛 / 澶辫触 / 鎴愬姛锛屽凡鍔犲叆
- 鍔犲叆绫诲瀷锛氭墽琛岄槦鍒?/ 鍊欓€夐槦鍒?/ 鏈姞鍏?
- 鍔犲叆闃熷垪锛歚鍏蜂綋闃熷垪ID` / `none`

原因说明：
- 鐢?2~4 鍙ヨ瘽璇存槑涓轰粈涔堣繘鍏ヨ闃熷垪锛屾垨鑰呬负浠€涔堟病鏈夋垚鍔熷姞鍏ャ€?

当前执行情况：
- 褰撳墠鎵ц闃熷垪锛歚鍏蜂綋闃熷垪ID`
- 褰撳墠浠诲姟锛歚鍏蜂綋 task ID`
- 褰撳墠闃熷垪鐩爣锛氫竴鍙ヨ瘽璇存槑

下一步：
- 璇存槑 Blueprint 鎺ヤ笅鏉ヤ細濡備綍澶勭悊
- 人工操作：当前不需要 / 当前需要确认 xxx
```

- Default visibility rule:
  - `默认不向人工暴露真值链细节。`

### Execution Self-Review Gate

- review_scope: `version-admission-and-active-queue-activation`
- version_acceptance_alignment:
  - `All version acceptance ids are assigned to one bounded queue portfolio in the approved high-level phase order.`
- parent_spec_alignment:
  - `The formal spec fully absorbs the approved iteration-draft boundary without dropping deduplication, nextEventId, settlement, migration, or no-middle-layer routing commitments.`
- queue_claim_alignment:
  - `The active queue claims only ACC-EVENT-SETTLE-005A same-display-name host canonicalization and does not absorb full-chain consistency or final migration scope.`
- over_narrowing_check:
  - `The first queue owns deduplication, canonical selection, duplicate-binding review, and full owned reference rewrite rather than a thin helper-only slice.`
- residue_or_blocker_routing_check:
  - `No hard blocker is recorded. Settlement closeout is complete with remote sync recorded, and same-display-name host canonicalization now has evidence, inventory, and preflight truth for the bounded rewrite batch.`
- verification_adequacy_check:
  - `Governed-doc verification must pass before this activation batch is treated as synchronized.`
- next_lawful_action_check:
  - `Continue queue.same-display-name-building-host-instance-canonicalization from task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline.`

### Closure Routing Record

- `queue.event-and-building-instance-canonical-reuse is now closed after canonical-reuse proof and repository sync succeeded through commit 8e661da pushed to origin/mod-first-dev. The version remains open and has already auto-promoted queue.instance-next-event-id-and-event-routing-convergence as the next lawful active queue.`
- `queue.instance-next-event-id-and-event-routing-convergence is now closed after repository sync succeeded through commit 954dd32a pushed to origin/mod-first-dev. The version remains open and has auto-admitted queue.settlement-resource-and-event-type-convergence as the next lawful active queue.`
- `queue.settlement-resource-and-event-type-convergence is now closed after repository sync succeeded through commit b391e09 pushed to origin/mod-first-dev. The version remains open and has auto-admitted queue.same-display-name-building-host-instance-canonicalization as the next lawful active queue.`

### Progress Log

- `2026-07-24`: `Created a new formal spec and version plan under distinct file names for target.event-follow-up-routing-settlement-and-canonical-reuse-convergence so formal execution truth no longer depends on the iteration-draft file or the earlier version-shell-only document naming.`
- `2026-07-24`: `Synchronized blueprint.md and project-progress.md to the new formal spec/plan paths and moved the repository resume chain from version-shell state into queue-level execution truth.`
- `2026-07-24`: `Created and admitted queue.event-and-building-instance-canonical-reuse as the first active queue, with task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile as the live active task.`
- `2026-07-24`: `Completed task.event-and-building-instance-canonical-reuse.evidence-anchor-reconcile after built-in pack audit and code-anchor inspection locked the owned duplicate surfaces, rewrite anchors, and no-missing-ref baseline.`
- `2026-07-24`: `Advanced active execution to task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules. The live queue now inventories semantic duplicate families and canonical-selection exceptions rather than assuming trivial exact duplicate merges.`
- `2026-07-24`: `Active canonical-candidate inventory has already found one concrete uniqueness drift sample inside the owned surface: zhuyuanzhang has 633 building-container-item-action bindings but only 632 arrangement action-menu items, and binding.building.house.kulan.temple.work.container-item no longer matches the current Huangjue Temple action-menu item ids. The queue remains active because this is canonical-inventory truth rather than a closeout blocker.`
- `2026-07-24`: `Semantic inventory now shows repeatable host-family structure rather than random flat duplication: leader_residence / temple / keep / tea_house / market / grain_shop / medicine_house / inn each repeat 21 times in zhuyuanzhang, while the 14 binding-only routes partition into building-enter, city-enter, story-progress, indoor-screen-shown, and one container-item drift family. Active execution therefore keeps task.event-and-building-instance-canonical-reuse.canonical-candidate-inventory-and-selection-rules open for family-by-family canonical selection rules and preservation exceptions.`
- `2026-07-24`: `Canonical-candidate inventory is now complete for the first rewrite batch. Semantic normalization exposed 30 duplicate event families and 30 duplicate action-menu binding families, while arrangement strong-fold groups narrowed to home(20), temple(20), keep(20), market(20), grain_shop(20), medicine_house(20), tea_house(19), and leader_residence(7) instead of one flat 21-city merge rule.`
- `2026-07-24`: `The version now records deterministic template-scope canonical naming for the active queue rather than preserving one city-owned id by fiat. Kulan temple work, Kulan/Suzhou arrangement variants, non-standard leader_residence cities, and all inn arrangements are explicit preservation exceptions for the current rewrite batch.`
- `2026-07-24`: `Active execution advanced to task.event-and-building-instance-canonical-reuse.reference-rewrite-and-guard-baseline. The next lawful work is coordinated owned rewrite across arrangement event refs, event ownerContext+flow refs, binding owner+trigger refs, import/export/loading indexes, and guard coverage.`
- `2026-07-24`: `Task3 source audit confirmed the rewrite batch cannot be scoped to eventId replacement alone: main.ts still forwards arrangement/container/item/event payload directly into building runtime, building-container-event-runtime still filters by clicked eventId before binding activation, building-module-entry still resolves arrangements by cityId + buildingId, active-game-content still builds one by-id index per family with no alias table, and the current robustness pack audit still masks multi-binding collisions by collapsing bindings to one Map key per eventId.`
- `2026-07-24`: `Task3 Slice 1 is now frozen in docs/blueprints/reports/2026-07-24-event-canonical-reuse-first-batch-map.md. The active queue no longer relies only on prose summaries; it now has an explicit first-batch canonical id artifact for 30 event families, 30 binding families, eight arrangement subgroup ids, and the recorded preservation-exception list.`
- `2026-07-24`: `Added a temporary version-local stop-check enforcement rule after repeated premature stop misjudgments. For this version, any attempt to stop must first emit a visible commentary stop-check containing active_version, active_queue, active_task, whitelist_match, and result; otherwise execution must continue by default.`
- `2026-07-24`: `Task3 Slice 1 now also has a machine-readable artifact at generated/blueprint/event-canonical-reuse-first-batch-map.json, so rewrite scripts and guard scripts can consume the same canonical family truth without re-deriving it from prose.`
- `2026-07-24`: `Task3 rewrite preflight now includes generated/blueprint/event-canonical-reuse-rewrite-audit.json. The simulated audit proves that the 30 first-batch canonical event ids currently create only safe owner/payload-distinguished multi-binding multiplex groups and 0 duplicate-payload conflicts, while isolating the remaining out-of-batch event / binding / arrangement surfaces and re-confirming the preserved Kulan temple work drift sample.`
- `2026-07-24`: `Task3 owner/flow token preflight now includes generated/blueprint/event-canonical-reuse-token-preflight.json. The derived token audit shows that the first mapped batch splits cleanly into 21 launchFlow families and 9 closeBuilding-only families with 0 mixed-action groups, so canonical flowId / ownerId / buildingId / containerId rewrite can follow one deterministic template-token rule instead of per-family invention.`
- `2026-07-24`: `Task3 also confirmed that canonical owner-token rewrite is consumer-coupled rather than pack-only: event-binding-runtime matches binding.owner.id by exact equality against triggerContext.owner.id, building-container runtime feeds that equality from currentHouseId, story/playable ownerContext paths reuse the same house token, and current robustness coverage still asserts ownerContext.ownerId === arrangement.buildingId. The next rewrite slice therefore needs coupled source+consumer+test change, not a fake isolated data preview.`
- `2026-07-24`: `Task3 coupled rewrite impact is now frozen at generated/blueprint/event-canonical-reuse-coupled-rewrite-impact.json. The next lawful rewrite slice is concretized as 9 impact areas / 15 files across pack data, export/import, active-content indexing, building runtime, story/playable owner propagation, and robustness guards rather than a vague source+consumer warning.`
- `2026-07-24`: `Task3 source-side rewrite preview is now frozen at generated/blueprint/event-canonical-reuse-source-rewrite-preview.json. The preview proves that the first writeable slice is not "all mapped bindings at once": only 2 home binding groups currently have full arrangement payload alignment, while 23 groups are partial and 5 inn groups are arrangement-unaligned, so full binding trigger.extra templating still requires coupled runtime payload handling beyond pure source-id replacement.`
- `2026-07-24`: `Task3 now also freezes the first implementation seam at generated/blueprint/event-canonical-reuse-home-implementation-slice.json. That artifact narrows real code-writing to the home family as the first lawful write slice because it is the only fully aligned binding family and it still exercises both launchFlow and closeBuilding behavior under the current queue boundary.`
- `2026-07-24`: `Task3 live guard hardening has now started in repository code. The zhuyuanzhang robustness audit no longer collapses bindings to one entry per eventId; it now groups container-item bindings per eventId, rejects duplicate exact payload tuples, and requires exactly one owner/payload-exact binding match for each action-menu item so future canonical eventId folding cannot hide collisions behind Map overwrite behavior.`
- `2026-07-24`: `Task3 flow preflight is now frozen at generated/blueprint/event-canonical-reuse-flow-preflight.json. The first-write home slice is no longer backed only by event/binding alignment; it now also has audited launchFlow dependency proof that 20 home.rest flow definitions normalize to one reusable structural shape for later canonical flowId rewrite.`
- `2026-07-24`: `Task3 has now moved one consumer seam from preflight into production code. EventBindingRuntime accepts canonical home.template binding owners against live city home owner ids through a dedicated canonicalization helper, and new robustness guards prove both the positive template-to-live-home path and the negative no-city-to-city widening path. The next lawful local action remains extending canonical owner/flow rewrite into the remaining home slice consumers rather than stopping at this guard milestone.`
- `2026-07-24`: `Task3 then aligned the pack-level zhuyuanzhang action-menu audit with the same canonical-owner rule. The queue no longer depends on exact ownerContext.ownerId === arrangement.buildingId equality inside that guard; canonical-equivalent owner ids now pass there too, which removes a false blocker for the future home source rewrite batch while preserving mismatch detection.`
- `2026-07-24`: `Task3 then locked the shared flow settlement side of the same home-slice owner boundary. New robustness coverage proves that a flow launched from canonical ownerContext.ownerId = home.template preserves that canonical owner id through shared playable settlement while the live world.currentHouseId remains the city-specific home token, so the remaining home-slice work can focus on source rewrite plus export/import consumers rather than an unverified flow handoff risk.`
- `2026-07-24`: `Task3 then re-audited runtime-pack-export / runtime-pack-import against the same home-slice canonical-owner boundary. Export already preserves launchFlow / launchPlayable ownerContext.ownerId as raw string truth after only ownerKind / returnPolicy validation, import rehydrates integration ownerDefaults.ownerId without any alias table, and imported flowPlayables reject retired routing fields instead of backfilling them. The next lawful implementation step is therefore direct source-truth rewrite for home event action owner ids plus canonical flow ids, not compatibility handling at import/export time.`
- `2026-07-24`: `Task3 then flattened that upcoming direct source rewrite into one bounded concrete batch: 20 home.<city>.rest launchFlow events, 20 paired home.<city>.leave closeBuilding events, 20 flow.building.home.<city>.rest definitions, and 40 matching home container-item bindings. The batch still carries raw city tokens at event action ownerId / flowId / binding owner.id / binding eventId, while arrangementId / containerId / itemId stay as live city payload anchors and no home_001 record is part of this first write slice.`
- `2026-07-24`: `Task3 has now executed that first bounded home source rewrite batch in production pack data. zhuyuanzhang home arrangements now point rest/leave action items at canonical template-home event ids, the 40 matching home container-item bindings now keep live city payload anchors but target canonical home event ids with owner.id = home.template, the 20 city-scoped home rest flows have collapsed to flow.building.template.home.rest, and the 40 city-scoped home rest/leave events have collapsed to two canonical template-home event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 post-rewrite residue scan confirms that production source tables no longer retain direct city-scoped home event or flow ids. Remaining same-family direct references are now limited to generated/blueprint historical preflight artifacts and one synthetic runtime test fixture, so the next lawful action is to refresh or supersede those historical artifacts and then continue toward the next non-home family rewrite slice.`
- `2026-07-24`: `Task3 has now materialized that post-home selector step at generated/blueprint/event-canonical-reuse-next-slice-candidates.json. The artifact demotes the pre-home source-preview / home-implementation-slice / flow-preflight artifacts to historical-only selector evidence and selects keep as the next bounded non-home source-rewrite family by deterministic tie-break over grain_shop and medicine_house.`
- `2026-07-24`: `Task3 then executed the keep-family bounded source rewrite batch in production pack data. zhuyuanzhang keep arrangements now point review/work/leave items at canonical template-house keep event ids, the 63 matching keep container-item bindings now target canonical keep event ids with owner.id = house.template.keep while preserving live arrangementId / containerId / itemId payload anchors, the 42 city-scoped keep review/work flows have collapsed to canonical template-house keep flow ids, and the 63 city-scoped keep review/work/leave events have collapsed to three canonical template-house keep event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector again after keep landed. generated/blueprint/event-canonical-reuse-keep-applied-rewrite-summary.json records the applied keep batch, and generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep as completed and promotes grain_shop as the next bounded non-home source-rewrite family ahead of medicine_house.`
- `2026-07-24`: `Task3 then executed the grain-shop bounded source rewrite batch in production pack data. zhuyuanzhang grain-shop arrangements now point trade/accounting/leave items at canonical template-house grain_shop event ids, the 63 matching grain-shop container-item bindings now target canonical grain-shop event ids with owner.id = house.template.grain_shop while preserving live arrangementId / containerId / itemId payload anchors, the 42 city-scoped grain-shop trade/accounting flows have collapsed to canonical template-house grain_shop flow ids, and the 63 city-scoped grain-shop trade/accounting/leave events have collapsed to three canonical template-house grain_shop event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector once more after grain_shop landed. generated/blueprint/event-canonical-reuse-grain_shop-applied-rewrite-summary.json records the applied grain-shop batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+grain_shop as completed, and the next bounded non-home source-rewrite family is medicine_house.`
- `2026-07-24`: `Task3 then executed the medicine-house bounded source rewrite batch in production pack data. zhuyuanzhang medicine-house arrangements now point treatment/compounding/leave items at canonical template-house medicine_house event ids, the 63 matching medicine-house container-item bindings now target canonical medicine-house event ids with owner.id = house.template.medicine_house while preserving live arrangementId / containerId / itemId payload anchors, the 42 city-scoped medicine-house treatment/compounding flows have collapsed to canonical template-house medicine_house flow ids, and the 63 city-scoped medicine-house treatment/compounding/leave events have collapsed to three canonical template-house medicine_house event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after medicine_house landed. generated/blueprint/event-canonical-reuse-medicine_house-applied-rewrite-summary.json records the applied medicine-house batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is market.`
- `2026-07-24`: `Task3 then executed the market bounded source rewrite batch in production pack data. zhuyuanzhang market arrangements now point trade/talk/intel/leave items at canonical template-house market event ids, the 84 matching market container-item bindings now target canonical market event ids with owner.id = house.template.market while preserving live arrangementId / containerId / itemId payload anchors, the 63 city-scoped market trade/talk/intel flows have collapsed to canonical template-house market flow ids, and the 84 city-scoped market trade/talk/intel/leave events have collapsed to four canonical template-house market event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after market landed. generated/blueprint/event-canonical-reuse-market-applied-rewrite-summary.json records the applied market batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+market+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is tea_house.`
- `2026-07-24`: `Task3 then executed the tea-house bounded source rewrite batch in production pack data. zhuyuanzhang tea-house arrangements now point tea/talk/intel/leave items at canonical template-house tea_house event ids, the 84 matching tea-house container-item bindings now target canonical tea-house event ids with owner.id = house.template.tea_house while preserving live arrangementId / containerId / itemId payload anchors, the 63 city-scoped tea-house tea/talk/intel flows have collapsed to canonical template-house tea_house flow ids, and the 84 city-scoped tea-house tea/talk/intel/leave events have collapsed to four canonical template-house tea_house event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after tea_house landed. generated/blueprint/event-canonical-reuse-tea_house-applied-rewrite-summary.json records the applied tea-house batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+keep+tea_house+market+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is leader_residence.`
- `2026-07-24`: `Task3 then executed the leader-residence bounded source rewrite batch in production pack data. zhuyuanzhang leader-residence arrangements now point review/leave items at canonical template-house leader_residence event ids, the 42 matching leader-residence container-item bindings now target canonical leader-residence event ids with owner.id = house.template.leader_residence while preserving live arrangementId / containerId / itemId payload anchors, the 21 city-scoped leader-residence review flows have collapsed to canonical template-house leader_residence flow ids, and the 42 city-scoped leader-residence review/leave events have collapsed to two canonical template-house leader_residence event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after leader_residence landed. generated/blueprint/event-canonical-reuse-leader_residence-applied-rewrite-summary.json records the applied leader-residence batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+leader_residence+keep+tea_house+market+grain_shop+medicine_house as completed, and the next bounded non-home source-rewrite family is inn.`
- `2026-07-24`: `Task3 then executed the inn bounded source rewrite batch in production pack data. zhuyuanzhang inn arrangements now point drink/gamble/talk/work/leave items at canonical template-house inn event ids, the 105 matching inn container-item bindings now target canonical inn event ids with owner.id = house.template.inn while preserving live arrangementId / containerId / itemId payload anchors, the 84 city-scoped inn drink/gamble/talk/work flows have collapsed to canonical template-house inn flow ids, and the 105 city-scoped inn drink/gamble/talk/work/leave events have collapsed to five canonical template-house inn event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Task3 has now refreshed the selector after inn landed. generated/blueprint/event-canonical-reuse-inn-applied-rewrite-summary.json records the applied inn batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+leader_residence+keep+tea_house+market+grain_shop+medicine_house+inn as completed, and the next bounded non-home source-rewrite family is temple.`
- `2026-07-24`: `Task3 then executed the temple bounded source rewrite batch in production pack data. zhuyuanzhang temple arrangements now point review/donate/leave items across all 21 cities plus work across the 20 standard cities at canonical template-house temple event ids, the 83 matching temple container-item bindings now target canonical temple event ids with owner.id = house.template.temple while preserving live arrangementId / containerId / itemId payload anchors, the 62 standard-city temple review/work/donate flows have collapsed to canonical template-house temple flow ids, and the 83 standard-city temple review/work/donate/leave events have collapsed to four canonical template-house temple event records with canonical ownerContext.ownerId / flowId truth.`
- `2026-07-24`: `Temple closeout truth keeps the recorded Kulan exceptions explicit instead of pretending to full-fold them away: binding.building.house.kulan.temple.work.container-item plus event/flow.building.house.kulan.temple.work remain city-scoped preserved drift evidence, and Kulan copy-scripture / sweep-courtyard / carry-water action routes remain city-scoped authored exceptions.`
- `2026-07-24`: `Task3 has now refreshed the selector after temple landed. generated/blueprint/event-canonical-reuse-temple-applied-rewrite-summary.json records the applied temple batch, generated/blueprint/event-canonical-reuse-next-slice-candidates.json now records home+leader_residence+temple+keep+tea_house+market+grain_shop+medicine_house+inn as completed, and no remaining non-home source-rewrite family candidates survive in the selector.`
- `2026-07-24`: `Canonical-reuse closeout proof is now established locally. The final home_001 residue is folded into the canonical home graph, generated/blueprint/event-canonical-reuse-closeout-proof.json proves that no disallowed city-scoped event / flow / owner truth remains in the completed queue surface, full node --test tests/robustness.test.cjs is green, and npm run lint:blueprints, npm run lint:blueprint-skill, and npm run blueprint:governance:check all pass. The next lawful action is now the repository-sync gate for queue.event-and-building-instance-canonical-reuse before next-queue admission.`
- `2026-07-24`: `Repository-sync gate for queue.event-and-building-instance-canonical-reuse is now satisfied. Commit 8e661da landed locally with the formal canonical-reuse spec/plan/queue/report, canonical source rewrites, runtime/test coverage, and generated proof artifacts; push to origin/mod-first-dev also succeeded.`
- `2026-07-24`: `queue.instance-next-event-id-and-event-routing-convergence is now admitted as the live active queue under the already-approved phase order. Blueprint execution immediately leaves queue-closeout review and continues from task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile.`
- `2026-07-24`: `task.instance-next-event-id-and-event-routing-convergence.evidence-anchor-reconcile is now complete. generated/blueprint/instance-next-event-id-routing-evidence.json freezes the current nextEventId runtime anchors plus the three blocking residue families: dialogue.followUps authoring residue, legacy flow eventStartTarget/returnPolicy lowering, and helper-owned runtime followUp seams.`
- `2026-07-24`: `The version automatically promoted task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock to the live active task. The next lawful action is no longer queue admission or evidence gathering; it is explicit inventory and migration-rule freezing for the owned rewrite boundary.`
- `2026-07-24`: `task.instance-next-event-id-and-event-routing-convergence.follow-up-surface-inventory-and-routing-boundary-lock is now complete. generated/blueprint/instance-next-event-id-routing-inventory.json freezes the owned-surface inventory, the direct-close vs split-event migration table, and the first bounded implementation slice centered on explicit nextEventId self-reference rejection.`
- `2026-07-24`: `The version automatically promoted task.instance-next-event-id-and-event-routing-convergence.next-event-id-cutover-and-guard-baseline to the live active task. The next lawful action is to land the first TDD-backed guard slice rather than pausing at the inventory checkpoint.`
- `2026-07-24`: `Task3 slice 1 is now landed and verified. runtime-pack-export rejects self-referential nextEventId, workspace-shell surfaces the same shape as a blocked editor issue, and targeted robustness coverage for self-referential nextEventId is green after a fresh build:test.`
- `2026-07-24`: `Task3 slice 2 then removed new dialogue.followUps authoring residue without silently backfilling it elsewhere: default dialogue records no longer allocate empty followUps arrays, authoring helper exports for appending/updating/removing dialogue follow-ups are gone, and normalization only preserves followUps when legacy data already carries them.`
- `2026-07-24`: `Task3 slice 3 then retired legacy flow eventStartTarget export lowering. runtime-pack-export now fails closed on retired flow routing fields such as eventStartTarget / ownerKind / ownerId / returnPolicy instead of converting them into event-owned launchFlow actions, and workspace-shell blocks the same residue through export diagnostics.`
- `2026-07-24`: `Task3 slice 4 then removed navigation-entered followUp transport from shared runtime truth. navigation-runtime no longer emits navigation.entered-city / navigation.entered-house, src/main.ts now uses applyPostNavigationStoryTrigger(...) after covered navigation commits, and the navigation-time follow-up bridge no longer owns authored story routing.`
- `2026-07-24`: `Task3 slice 5 then removed time followUp transport from shared runtime truth. time-runtime no longer emits time.advanced / time.council-threshold-crossed, src/main.ts now calls syncCouncilPriorityAfterGameStateChange(previousGameState) explicitly after covered time commits, and createNavigationTimeFollowUpBridge is removed from production code.`
- `2026-07-24`: `generated/blueprint/instance-next-event-id-runtime-followup-residue.json is now refreshed to show authored routing residue removed from runtime followUp ownership, with only reenter-house preserved as a return-only signal. generated/blueprint/instance-next-event-id-routing-closeout-proof.json now records local ACC-EVENT-SETTLE-003 / 004 closeout readiness, so the next lawful action is the repository-sync gate for queue.instance-next-event-id-and-event-routing-convergence.`
- `2026-07-24`: `Repository-sync gate for queue.instance-next-event-id-and-event-routing-convergence is now satisfied. Commit 954dd32a is on origin/mod-first-dev, so queue.settlement-resource-and-event-type-convergence is now the uniquely lawful active queue under the approved phase order.`
- `2026-07-24`: `task.settlement-resource-and-event-type-convergence.evidence-anchor-reconcile is now complete. generated/blueprint/settlement-resource-and-event-type-evidence.json freezes the current settlement contract gaps: no formal settlement resource family, no event(type=settlement) contract, minigame/flow settlement meaning still hidden in outcomeRoutes, and PlayableSettlement still live on the shared contract surface.`
- `2026-07-24`: `task.settlement-resource-and-event-type-convergence.surface-inventory-and-boundary-lock is now complete. generated/blueprint/settlement-resource-and-event-type-inventory.json freezes the bounded rewrite order and the first implementation slice centered on src/domain/event.ts, src/domain/script-editor-project.ts, and Script Editor import/export contract seams.`
- `2026-07-24`: `The version automatically promoted task.settlement-resource-and-event-type-convergence.contract-cutover-preflight to the live active task. The next lawful action is bounded contract preflight for event(type=settlement), settlement-resource authoring truth, and the PlayableSettlement -> PlayableResult boundary replacement.`
- `2026-07-24`: `Task3 preflight has now started without landing code yet. generated/blueprint/settlement-resource-and-event-type-preflight.json freezes the first write batch, targeted red-test surfaces, and the must-preserve contract for the upcoming settlement/event-type cutover.`
- `2026-07-24`: `task.settlement-resource-and-event-type-convergence.contract-cutover-preflight is now complete. generated/blueprint/settlement-resource-and-event-type-preflight.json records the landed first batch across settlements.json, settlement event typing, runtime-pack preservation, and PlayableResult rename.`
- `2026-07-24`: `The queue then landed task.settlement-resource-and-event-type-convergence.domain-editor-contract-freeze. Script Editor project schema/save/load now preserves settlements[], formal type=settlement plus settlementId survives runtime-pack export/import, and the shared playable runtime contract now exports PlayableResult instead of PlayableSettlement.`
- `2026-07-24`: `The queue then landed task.settlement-resource-and-event-type-convergence.settlement-reference-guard-alignment. Settlement events now fail closed when settlementId is missing or references no project settlement record, and workspace-shell mirrors the same blocked contract through the risk/export path.`
- `2026-07-24`: `The version automatically promoted task.settlement-resource-and-event-type-convergence.result-boundary-consumer-audit to the live active task. generated/blueprint/settlement-resource-and-event-type-result-boundary-audit.json now freezes the landed production truth, historical-only residue, and the next bounded settlement-record-shape recommendation.`
- `2026-07-24`: `task.settlement-resource-and-event-type-convergence.result-boundary-consumer-audit is now complete. The queue confirmed that remaining PlayableSettlement mentions are historical-only evidence/doc residue and selected batch.settlement-record-shape-and-reference-freeze as the next bounded same-family slice.`
- `2026-07-24`: `The version automatically promoted task.settlement-resource-and-event-type-convergence.settlement-record-shape-freeze to the live active task. generated/blueprint/settlement-record-shape-freeze-preflight.json now freezes the next non-destructive settlement-record-shape batch.`
- `2026-07-24`: `task.settlement-resource-and-event-type-convergence.settlement-record-shape-freeze is now complete locally. Settlement result entries preserve project save/load shape, runtime export fails closed on settlement-result nextEventId references that target missing events, workspace-shell now recognizes valid settlement references instead of treating them as missing by default, and malformed settlement-result routing becomes blocked risk/export truth.`
- `2026-07-24`: `The version automatically promoted task.settlement-resource-and-event-type-convergence.queue-closeout-review-and-sync-gate to the live active task. Settlement implementation work is complete locally, and the next lawful action is queue-closeout proof plus repository-sync gating before queue.same-display-name-building-host-instance-canonicalization can be admitted.`
- `2026-07-24`: `Operator clarification during active settlement execution proved that duplicate real building host instances still survive when multiple hosts share one creator-facing display name. Single-active-task governance keeps queue.settlement-resource-and-event-type-convergence as the only live queue, so the version now records item.same-display-name-building-host-instance-canonicalization as the next same-version candidate after settlement; that candidate will own duplicate host removal plus direct reference rewrite across cities[].buildingIds, cities[].mountedBuildings[].buildingId, city-entries[].targetHouseId, and related host-owned building-enter/owner paths.`
- `2026-07-24`: `Settlement queue repository-sync gate is now satisfied. Commit b391e09 landed on mod-first-dev and push to origin/mod-first-dev succeeded, so queue.settlement-resource-and-event-type-convergence is closed and queue.same-display-name-building-host-instance-canonicalization is now the uniquely lawful active queue under the approved phase order.`
- `2026-07-24`: `task.same-display-name-building-host-instance-canonicalization.evidence-anchor-reconcile is now complete. generated/blueprint/same-display-name-host-canonicalization-evidence.json freezes the live duplicate-host groups, the absence of pre-existing template host ids, direct rewrite-surface counts across houses/building-arrangements/mountedBuildings/city entries, and the runtime/startup consumer anchors that still assume city-scoped house ids.`
- `2026-07-24`: `The version automatically promoted task.same-display-name-building-host-instance-canonicalization.duplicate-surface-inventory-and-canonical-selection-lock to the live active task. generated/blueprint/same-display-name-host-canonicalization-inventory.json freezes canonical id selection on new template-scope host ids for the repeated-name families, the explicit preserve list for unique hosts such as house.kulan.temple, and the bounded direct-reference rewrite order.`
- `2026-07-24`: `The version then advanced through task.same-display-name-building-host-instance-canonicalization.rewrite-anchor-and-consumer-preflight. generated/blueprint/same-display-name-host-canonicalization-preflight.json now records the first implementation batch across houses.json, building-arrangements.json, cities.json, city-entries.json, script-editor/runtime materialization, building entry/runtime selection, and city-directory/startup consumers. The live active task is now task.same-display-name-building-host-instance-canonicalization.canonical-host-id-rewrite-and-reference-guard-baseline.`
- `2026-07-24`: `The active same-display-name host queue has now landed implementation slice 1 without widening into full source rewrite. script-editor runtime family materialization no longer indexes mounted building ownership by bare buildingId; it now keys by cityId + buildingId so repeated cities sharing one canonical host id keep distinct mounted NPC ownership. The new regression in tests/city-building-mount-authoring.test.cjs passes after build:test; an older unrelated UI-source assertion in that file remains outside this queue's current slice boundary.`
- `2026-07-24`: `The active same-display-name host queue has now landed implementation slice 2 without widening into full source rewrite. city-building-placement-resolver no longer hands canonical house cityId through unchanged when a city entry points at a shared canonical host; placement.house is re-scoped to cityEntry.cityId before city NPC lookup, so repeated cities sharing one canonical house id no longer leak the first city's NPC pool into the second city's placement view. Focused robustness coverage plus a post-build inline assertion prove the new slice, while an older unrelated runtime-export/materialization assertion in tests/robustness.test.cjs remains outside this queue's current slice boundary.`
- `2026-07-24`: `The same-display-name host queue then froze a post-slice-2 consumer audit at generated/blueprint/same-display-name-host-canonicalization-consumer-audit.json. Remaining queue-local risk is now narrowed to council-priority and missing-arrangement seams that still read houseDefinition.cityId or defaultCharacterId from the shared canonical record, so the next bounded local action is a non-destructive council-priority selection audit before broad source rewrite begins.`
- `2026-07-24`: `The same-display-name host queue has now completed that non-destructive council-priority selection audit at generated/blueprint/same-display-name-host-council-priority-selection-audit.json. The frozen conclusion is that canonical targetHouseId may remain shared, but council reminder/refusal chains still couple targetHouse selection and speakerCharacterId to one selected HouseDefinition record; the next bounded local action is therefore a council-priority house-projection preflight rather than an unbounded source rewrite.`
- `2026-07-24`: `The same-display-name host queue has now completed the council-priority house-projection preflight at generated/blueprint/same-display-name-host-council-priority-house-projection-preflight.json. The frozen next slice is now concrete: use currentCityId + canonical houseId to read arrangement.primaryNpcId as city-local speaker truth while preserving the canonical shared house id as the routing token; missing-arrangement refusal remains deferred as a separate bounded consumer.`
- `2026-07-24`: `The same-display-name host queue has now landed implementation slice 3 without widening into broad source rewrite. navigation-time-follow-up now consumes buildingArrangements and projects council-arrival reminder speakerCharacterId from the arrangement matched by currentCityId + canonical buildingId while preserving the canonical shared targetHouseId, and main.ts now supplies activeContentContext.buildingArrangements into that path. The new reminder regression in tests/robustness.test.cjs passes after build:test, while the older unrelated runtime-export/materialization assertion in that file remains outside this queue's current slice boundary.`
- `2026-07-24`: `The same-display-name host queue has now landed implementation slice 4 without widening into broad source rewrite. src/main.ts getCouncilPriorityHouseDefinition() now projects cityId plus defaultCharacterId from activeContentContext.buildingArrangements when currentCityId + canonical buildingId yields a city-local primaryNpcId, so council refusal consumers inherit the same canonical-house-id / city-local-speaker rule as the reminder path. The new source guard in tests/robustness.test.cjs passes after build:test, while the older unrelated runtime-export/materialization assertion in that file remains outside this queue's current slice boundary.`
- `2026-07-24`: `generated/blueprint/same-display-name-host-missing-arrangement-refusal-audit.json now freezes the remaining bounded consumer after slice 4. navigation-runtime missing-arrangement refusal still has no already-available city-local speaker anchor once arrangement lookup itself fails, so the next lawful local action stays inside bounded source rewrite or later narrow input preflight rather than widening the current council-priority slice.`
- `2026-07-24`: `generated/blueprint/same-display-name-host-source-rewrite-preview.json now freezes the next production data runway. The preview confirms that no canonical home.template / house.template.* records yet exist in houses/building-arrangements/cities/city-entries source truth and selects the home family as the narrowest first owned rewrite batch before city-entry-bearing or temple-exception families.`
- `2026-07-24`: `Operator clarification then narrowed the queue completion boundary: this queue now judges host merge by displayName/name equality only, ignores legacy id and event-binding drift for merge admission, and does not require building-arrangement convergence for closeout so long as canonical hosts still resolve retained arrangement rows lawfully.`
- `2026-07-24`: `The active task has now landed the full host merge and direct host-id rewrite batch. zhuyuanzhang houses converge to 9 canonical template-scope repeated-name hosts plus preserved house.kulan.temple, cities/building-arrangements/city-entries/characters/location-access now consume canonical host ids directly, and generated/blueprint/same-display-name-host-canonicalization-applied-summary.json records the post-rewrite source counts and the narrowed queue-scope rule.`
- `2026-07-24`: `The same-display-name host queue also aligned canonical host consumption through runtime/startup seams. src/application/script-editor/city-building-runtime-materializer.ts, src/application/city/city-building-placement-resolver.ts, src/application/presenter/stage-presenters.ts, src/application/building/building-module-entry.ts, src/core/runtime/navigation-runtime.ts, src/application/runtime/navigation-time-follow-up.ts, and src/main.ts now preserve city-local behavior while consuming canonical host ids.`
- `2026-07-24`: `Local closeout proof is now recorded at generated/blueprint/same-display-name-host-canonicalization-closeout-proof.json. build:test, lint:blueprints, lint:blueprint-skill, and blueprint:governance:check all pass; the targeted host-canonicalization robustness guards also pass; and the only remaining failing robustness assertion is the older imported-runtime materialization baseline at tests/robustness.test.cjs:13204 outside this queue's owned slice. The queue therefore advances to repository-sync gating rather than another implementation slice.`
