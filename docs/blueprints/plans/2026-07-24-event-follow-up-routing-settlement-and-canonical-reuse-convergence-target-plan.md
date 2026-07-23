# Event Follow-Up Routing, Settlement, And Canonical Reuse Convergence Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- version_status: `open`
- active_phase: `phase.promotion-review`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `return-to-promotion-review`
- resume_gate: `promotion-review`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `none`
- review_subject_id: `item.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- review_subject_classification: `future-target-promoted`
- proposed_queue_id: `none`
- review_basis: `iteration-draft-promoted-to-formal-target`
- admission_status: `none`
- intake_status: `admission-review`
- intake_item_id: `item.event-follow-up-routing-settlement-and-canonical-reuse-convergence`
- intake_summary: `Promote the 2026-07-24 iteration draft into a formal successor version shell, preserve the approved phase order, and prepare first-queue admission without reopening older closed versions.`
- intake_result: `promoted-to-admission`
- intake_feedback_mode: `fixed-receipt`
- closure_review_subject: `none`
- closure_review_status: `none`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `none`
- next_lawful_queue_recommendation: `none`
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
  - `queue.full-chain-event-routing-and-settlement-consistency`
  - `queue.event-routing-settlement-migration-and-final-acceptance`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.event-and-building-instance-canonical-reuse: not yet admitted; first lawful queue because canonical ids and duplicate removal must precede nextEventId and settlement expansion.`
  - `queue.instance-next-event-id-and-event-routing-convergence: not yet admitted; follows canonical reuse and owns unified follow-up routing with no middle layer.`
  - `queue.settlement-resource-and-event-type-convergence: not yet admitted; follows routing convergence and owns settlement resources, settlement event type, numeric-first settlement boundary, and PlayableResult naming cleanup.`
  - `queue.full-chain-event-routing-and-settlement-consistency: not yet admitted; follows settlement freeze and owns export/import/loader/preview/startup/runtime consistency.`
  - `queue.event-routing-settlement-migration-and-final-acceptance: not yet admitted; required-final queue for migration, fail-closed rejection, acceptance proof, and residue guard.`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/specs/2026-07-24-event-follow-up-routing-settlement-and-canonical-reuse-convergence-target.md`

## Human Context

### Activation Record

- Scope approval:
  - `The operator explicitly requested turning the 2026-07-24 iteration draft into a formal Blueprint version spec / plan and preserving all approved boundaries inside the new version shell.`
- Inherits from:
  - `docs/blueprints/specs/2026-07-24-event-routing-settlement-version-scope-iteration-draft.md`
  - `docs/blueprints/specs/2026-07-22-script-editor-event-only-routing-and-flow-retirement-requirement-draft.md`
- Inheritance boundary:
  - `This successor owns canonical event/building-instance reuse, unified instance-level nextEventId routing, settlement resource/event-type convergence, full-chain authoring/runtime parity, explicit migration, and final acceptance for the same incompatible batch.`
  - `It does not reopen the closed map-rendering target or absorb unrelated modularization work outside this routing/settlement/canonical-reuse boundary.`
- Admission basis:
  - `The current Blueprint entry was intentionally stopped on a closed version, so a new open successor version is required before any new queue can lawfully execute.`
  - `The operator already approved the phase order and no-pause defaults at version boundary level, so the plan records them directly rather than waiting for another scope-convergence round.`
- Activation conclusion:
  - `Formal target docs now exist for target.event-follow-up-routing-settlement-and-canonical-reuse-convergence.`
  - `No child queue is admitted yet. The next lawful governance action is creating and admitting queue.event-and-building-instance-canonical-reuse as the first execution queue.`

### Admission Review Record

- Intake handling:
  - `The operator-facing intake already provided the promoted iteration draft, the requirement to preserve all approved boundaries, and the instruction to begin formal Blueprint version creation now.`
  - `Blueprint therefore records the successor version shell directly instead of pausing on whether a new version is needed.`
- Scope approval:
  - `Yes. The operator already approved the phase order, no-compatibility-import rule, nextEventId-only follow-up field, settlement event/resource direction, and no-middle-layer routing requirement.`
- Admission basis:
  - `The promoted iteration draft is broader than a single queue and requires one parent target that keeps deduplication, routing, settlement, migration, and acceptance inseparable at version boundary level.`
  - `Because the active entry pointed at a closed version, no existing open version can lawfully absorb this work without governance drift or parent-goal widening.`
- Required truth sync:
  - `Satisfied in this document batch for target creation and active-pointer switching only. Child-queue admission still remains a separate next action.`

### Version Lifecycle Rules

- `This version is open and now becomes the lawful Blueprint active version with no admitted child queue yet.`
- `If active_queue = none, that does not close the version; it means the version is waiting on lawful child-queue admission.`
- `Do not implement code under this target without an admitted child queue doc and a live active task.`
- `Do not split canonical reuse, nextEventId routing, settlement event/resource convergence, and full-chain consistency into separate parent targets while this version remains open.`
- `Do not reverse the approved high-level phase order unless a real blocker or governing-doc conflict is recorded here first.`
- `Task completion, queue closeout sync, admission sync, active queue switch, repository sync result recording, and doc-only state sync are not lawful stop points by themselves.`

### Approved Phase Order And No-Pause Rule

- `The operator already approved the version-level sequence below. Blueprint may split bounded queues inside a phase, but must not stop merely to reconfirm the order itself.`

1. `event/building instance deduplication, canonical reuse, and full reference rewrite`
2. `instance-level nextEventId plus event-only routing convergence`
3. `settlement resources, event(type=settlement), and related naming/boundary convergence`
4. `Script Editor/export/import/loading/preview/startup/runtime full-chain consistency`
5. `explicit migration batches, fail-closed rejection coverage, acceptance, and governance closeout`

- `Within this version, bulk identification, bulk folding, bulk rewrite, and bulk validation are the default working modes.`
- `The workflow must not pause again for already-approved boundary decisions such as strong template-layer deduplication, empty nextEventId meaning direct close, PlayableSettlement -> PlayableResult convergence, or settlement-entry reference replacement for inline payloads.`
- `Escalation is lawful only if parent goal changes, a new routing owner would be introduced, the numeric-first settlement boundary would break, unrecoverable author content would be deleted without reconstruction path, or governing docs conflict beyond the recorded priority order.`

### Repository Sync Gate Application

- `This version follows the formal Blueprint repository-sync gate: task-level local-record during execution, then queue-level repository sync as the mandatory closeout-to-handoff gate.`
- `Task completion by itself does not require commit, push, or merge. Task-level after-state should update docs and queue-local sync fields using local-record only.`
- `Queue completion is different: once a queue reaches closeout truth, Blueprint must not admit or activate the next queue until one minimum repository sync batch has been attempted and its result has been recorded.`
- `For this version, the minimum repository sync batch after queue closeout is:`
  - `queue closeout docs and routing truth synchronized first`
  - `one local branch-commit attempt for the completed queue`
  - `one remote push attempt after the local branch-commit attempt returns success`
  - `one merge attempt if the current repository workflow for the active branch/worktree requires merge as part of remote development trunk synchronization`
- `This gate is result-driven rather than success-driven. Blueprint may continue after the sync batch returns a recorded result, regardless of whether push or merge succeeded, unless the sync result exposes a real code/spec blocker already covered by the lawful-stop allow-list.`
- `It is illegal in this version to hand off directly from queue done to next queue admission using local-record alone. local-record is sufficient for task after-state, but not for queue closeout handoff.`
- `It is illegal in this version to treat auto-continue as permission to skip the queue-closeout sync batch. auto-continue applies only after the queue-closeout sync batch result is recorded.`
- `If remote sync cannot even be attempted, the queue-local sync record must state the concrete reason. It must not be written as though repository sync already completed.`

### Formal Stop-Rule Application

- `Before ending a response while an active queue, active task, or uniquely lawful next governance action still exists, run the workflow stop-condition self-check.`
- `Only these causes may lawfully stop execution: explicit answer-only request, real blocker, outside-parent-spec work, parent-spec change, capability downgrade risk, retired-rewrite risk, or genuine product decision.`
- `If none applies, do not stop at task completion, queue closeout, admission, queue activation, queue switch, sync recording, or status reporting; continue directly into the next lawful action.`
- `If one applies, write stop_reason / stop_basis / next_unblocked_action / human_input_required here before the response ends.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> active version plan -> active queue before touching a fresh child queue item.`
2. `This target is now the active version, but child-queue admission still requires version-plan admission sync before any queue becomes execution truth.`
3. `Before admitting any child queue, verify that it does not narrow the parent boundary by skipping canonical reuse, reintroducing a middle router, preserving compatibility import, or routing settlement elsewhere.`
4. `queue.event-and-building-instance-canonical-reuse is the only lawful first queue under this version.`
5. `Only after version-plan admission truth exists and the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`

### Queue Spec Integrity Rule

- `No child queue under this target may pass by shrinking the parent boundary down to one content family, one happy path, one helper seam, or one editor-only surface.`
- `Before admission or closeout, each queue must be specific enough to prove inherited capability preservation, alternate-path survival, and replacement-truth exit rather than only local implementation success.`
- `If a queue spec cannot yet name its capability floor, non-primary runtime/editor paths, fail-closed requirement, or replacement proof obligation, revise the queue spec first instead of proceeding with a thin execution boundary.`

### Operator Receipt Record

- receipt_join_status: `success`
- receipt_join_type: `not-added`
- receipt_join_queue_id: `none`
- receipt_reason_code: `candidate-only-not-admitted`
- receipt_reason_basis:
  - `The iteration draft is now promoted into a formal open successor version, but no execution queue has been admitted yet.`
- receipt_active_queue: `none`
- receipt_active_task: `none`
- receipt_queue_goal:
  - `none`
- receipt_next_step:
  - `Create and admit queue.event-and-building-instance-canonical-reuse as the first implementation queue under the new active version.`
- receipt_human_action: `none-required`
- receipt_internal_analysis_exposed: `false`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger Type | Recheck Trigger Basis | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.event-and-building-instance-canonical-reuse` | `queue-candidate` | `queue.event-and-building-instance-canonical-reuse` | `candidate-recorded` | `none` | `It is already the approved first phase and next lawful queue.` | `ACC-EVENT-SETTLE-001; ACC-EVENT-SETTLE-002` | `events.json; event-bindings.json; building/menu/function host instances; runtime-pack references; tests/**` | `canonical id selection, duplicate folding, full reference rewrite` | `nextEventId routing, settlement resources, final migration/acceptance ownership` | `This queue must execute first and must not be bypassed by later routing or settlement work.` |
| `item.instance-next-event-id-and-event-routing-convergence` | `queue-candidate` | `queue.instance-next-event-id-and-event-routing-convergence` | `candidate-recorded` | `queue-closeout` | `Recheck only after canonical reuse closes.` | `ACC-EVENT-SETTLE-003; ACC-EVENT-SETTLE-004` | `event runtime entrypoints; TriggerContext/EventBindingRuntime seams; dialogue/task/playable/function/settlement surfaces; tests/**` | `nextEventId field unification and direct event-owned follow-up routing` | `settlement resource authoring, full-chain migration closeout` | `Must preserve event as sole routing owner and must not insert a selector layer.` |
| `item.settlement-resource-and-event-type-convergence` | `queue-candidate` | `queue.settlement-resource-and-event-type-convergence` | `candidate-recorded` | `queue-closeout` | `Recheck only after nextEventId routing truth is stable.` | `ACC-EVENT-SETTLE-005` | `settlement resource/list authoring; runtime-settlement; event type contracts; tests/**` | `settlement resource/event-type convergence and PlayableResult naming cleanup` | `cross-chain consistency or final migration acceptance ownership` | `Must preserve numeric-first settlement boundary and settlement-entry-only references.` |
| `item.full-chain-event-routing-and-settlement-consistency` | `queue-candidate` | `queue.full-chain-event-routing-and-settlement-consistency` | `candidate-recorded` | `queue-closeout` | `Recheck only after settlement contracts are frozen.` | `ACC-EVENT-SETTLE-006` | `Script Editor authoring/export/import; scenario loader; preview/runtime loaders; startup; tests/**` | `full-chain parity on canonical ids, nextEventId, and settlement events` | `migration acceptance or new routing-owner invention` | `Must remain a distinct queue and must not be silently absorbed by settlement authoring or final acceptance.` |
| `item.event-routing-settlement-migration-and-final-acceptance` | `queue-candidate` | `queue.event-routing-settlement-migration-and-final-acceptance` | `candidate-recorded` | `queue-closeout` | `Recheck only after implementation-bearing queues close.` | `ACC-EVENT-SETTLE-007; ACC-EVENT-SETTLE-008` | `migration batches; fail-closed rejection tests; browser acceptance; governance closeout` | `explicit migration, rejection coverage, final acceptance, residue guard` | `primary ownership of earlier implementation-bearing queues` | `Required-final queue only; it must not be used to hide earlier unfinished work.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.event-and-building-instance-canonical-reuse` | `candidate-ready` | `immediately after its queue doc is written` | `This is the already approved first queue and the only lawful next implementation entry.` |
| `queue.instance-next-event-id-and-event-routing-convergence` | `candidate-ready` | `only after queue.event-and-building-instance-canonical-reuse closes` | `Phase order is already approved and does not need reconfirmation.` |
| `queue.settlement-resource-and-event-type-convergence` | `candidate-ready` | `only after queue.instance-next-event-id-and-event-routing-convergence closes` | `Must not admit before event-only routing truth is stable.` |
| `queue.full-chain-event-routing-and-settlement-consistency` | `candidate-ready` | `only after queue.settlement-resource-and-event-type-convergence closes` | `Must stay distinct from settlement authoring and final acceptance.` |
| `queue.event-routing-settlement-migration-and-final-acceptance` | `candidate-ready` | `only after all implementation-bearing queues close` | `Required-final queue.` |

### Candidate Backlog Refresh Rule

- `After an execution queue closes or candidate routing changes, refresh candidate truth before answering whether more same-version candidate queues remain.`
- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`
- `Use docs/change-log.md only when structured governance docs are insufficient or explicitly cited by the current version plan.`
- `Do not answer none unless candidate_backlog_refresh_status=fresh and candidate_backlog_snapshot is empty.`
- `If candidate truth is stale, missing, or inconsistent, refresh or reconcile it rather than answering with prose.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails during this version's admission, implementation, or closeout path, first repair the governing docs/spec structure inside the current lawful boundary rather than treating the failure as advisory.`
- `If the lint failure proves the current queue spec is too thin, revise the queue spec before continuing implementation or closeout; do not defer the missing structure into a later queue by default.`
- `If the lint failure cannot be repaired inside the current admitted boundary without changing the parent total spec, write the blocker/reroute truth here and return to parent-spec or queue-routing governance rather than claiming progress through a failed gate.`
- `Blueprint lint failure must not be recorded as accepted residue, and it must not be bypassed by repository sync, pause, or queue handoff.`

### Operator Intake Contract

- Allowed operator intake:
  - `新需求`
  - `参考治理规范`
- Internal-only Blueprint work:
  - `read project-progress -> blueprint -> version plan -> active queue -> active task`
  - `attempt active-queue absorption`
  - `classify and route the intake`
  - `record candidate truth or admission truth without asking the operator to fill internal fields`
- Default operator output:

```text
处理结果：
- 加入状态：成功 / 失败 / 成功，已加入
- 加入类型：执行队列 / 候选队列 / 未加入
- 加入队列：`具体队列ID` / `none`

原因说明：
- 用 2~4 句话说明为什么进入该队列，或者为什么没有成功加入。
- 如果没有进入执行队列，要明确说明是因为当前已有 active queue，还是因为它当前只满足候选条件。

当前执行情况：
- 当前执行队列：`具体队列ID`
- 当前任务：`具体 task ID`
- 当前队列目标：一句话说明

下一步：
- 说明 Blueprint 接下来会如何处理
- 人工操作：当前不需要 / 当前需要确认 xxx
```

- Default visibility rule:
  - `默认不向人工暴露真值链细节、候选全集、Why Not The Others、Human Involvement Boundary、admission 内部字段或排序全过程，除非人工明确要求展开内部分析。`

### Execution Self-Review Gate

- review_scope: `version-creation`
- version_acceptance_alignment:
  - `All version acceptance ids are now assigned to one bounded queue portfolio in approved phase order.`
- parent_spec_alignment:
  - `The created target preserves the promoted iteration draft without dropping deduplication, settlement, migration, or no-middle-layer routing boundaries.`
- queue_claim_alignment:
  - `No queue is admitted yet; the plan claims target creation plus candidate portfolio only.`
- over_narrowing_check:
  - `The first queue remains canonical reuse rather than a thinner nextEventId or settlement slice, so the version does not skip the approved prerequisite batch.`
- residue_or_blocker_routing_check:
  - `No blocker or residue is currently recorded; the next lawful action is first-queue admission.`
- verification_adequacy_check:
  - `Governed-doc verification must pass before this successor version shell is considered synchronized.`
- next_lawful_action_check:
  - `Write and admit queue.event-and-building-instance-canonical-reuse.`

### Closure Routing Record

- `No queue has closed under this version yet. Version closeout is not in review.`

### Progress Log

- `2026-07-24`: `Promoted the 2026-07-24 event-routing / settlement iteration draft into formal target.event-follow-up-routing-settlement-and-canonical-reuse-convergence after the operator explicitly requested a governed Blueprint version spec / plan.`
- `2026-07-24`: `Created the formal target spec and version plan, switched Blueprint entry pointers to the new open successor version, and recorded the five-queue portfolio in the already approved high-level phase order without admitting execution yet.`
