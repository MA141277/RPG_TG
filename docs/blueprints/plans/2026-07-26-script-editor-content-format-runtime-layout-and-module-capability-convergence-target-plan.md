# Script Editor Content Format, Runtime Layout, And Module Capability Convergence Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- version_status: `open`
- active_phase: `phase.promotion-review`
- active_queue: `queue.script-editor-content-format-and-authoring-surface-unification`
- decision_state: `active-execution`
- next_decision: `queue-closeout-or-return-to-version-review`
- next_action: `resume-active-queue`
- resume_gate: `active-queue`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `admitted`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `admission-review`
- intake_item_id: `item.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- intake_summary: `Create a new formal successor version from the operator-approved unified requirement sheet so Script Editor content format, runtime layout, and covered module capability completion can execute under one Blueprint target.`
- intake_result: `promoted-to-admission`
- intake_feedback_mode: `fixed-receipt`
- closure_review_subject: `queue.script-editor-content-format-and-authoring-surface-unification`
- closure_review_status: `routed`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `post-first-queue-sync-gate`
- next_lawful_queue_recommendation: `queue.stage-host-binding-and-menu-resource-runtime-convergence`
- auto_admission_ready: `false`
- stop_reason: `none`
- stop_basis: `none`
- next_unblocked_action: `none`
- human_input_required: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.script-editor-content-format-and-authoring-surface-unification`
  - `queue.stage-host-binding-and-menu-resource-runtime-convergence`
  - `queue.event-owned-routing-dialogue-playable-settlement-convergence`
  - `queue.runtime-layout-registry-and-ui-layering-convergence`
  - `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.script-editor-content-format-and-authoring-surface-unification: admitted and still active only for queue closeout / repository-sync gating; ACC-FORMAT-001 / 002 are covered locally and browser acceptance has been observed.`
  - `queue.stage-host-binding-and-menu-resource-runtime-convergence: next lawful candidate after first-queue sync gate; owns stage-host references plus menu formalization.`
  - `queue.event-owned-routing-dialogue-playable-settlement-convergence: not yet admitted; follows menu/stage reference stabilization and owns the event-only routing conversion chain.`
  - `queue.runtime-layout-registry-and-ui-layering-convergence: not yet admitted; follows routing freeze and owns persisted runtime layout plus runtime UI layering.`
  - `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance: not yet admitted; required-final queue for chain consistency, fail-closed rejection, acceptance proof, and closeout.`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
  - `operator-approved in-thread unified requirement sheet on 2026-07-26`

## Human Context

### Activation Record

- Scope approval:
  - `The operator explicitly requested gathering a new version requirement sheet first, then approved the unified requirement text as the successor-version requirement source on 2026-07-26.`
- Inherits from:
  - `docs/blueprints/specs/2026-07-26-script-editor-content-format-runtime-layout-and-module-capability-convergence-target.md`
  - `operator-approved in-thread unified requirement sheet on 2026-07-26`
- Inheritance boundary:
  - `This successor owns Script Editor content-format unification, covered module capability completion, runtime-layout persistence plus runtime UI layering, event-only routing convergence, no-compatibility migration, and full-chain authoring/export/import/preview/runtime consistency across the covered modules.`
  - `It does not reopen the closed event-routing/settlement target and does not pull story-node / plot-node work into the new parent boundary.`
- Admission basis:
  - `No open successor version existed after the explicit residual-open-version cleanup, so a new open version is required before any new child queue can lawfully execute.`
  - `The operator-approved requirement sheet is broader than one queue and therefore requires a parent target before queue admission.`
- Activation conclusion:
  - `Formal target docs now exist for target.script-editor-content-format-runtime-layout-and-module-capability-convergence.`
  - `queue.script-editor-content-format-and-authoring-surface-unification is now in queue-closeout / repository-sync-gate state after local ACC-FORMAT-001 / 002 coverage and browser acceptance completed.`
  - `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate is the live active task until repository-sync truth is recorded.`

### Admission Review Record

- Intake handling:
  - `The operator explicitly requested collecting the requirement list first, then asked that the approved result become the new version requirement.`
  - `Blueprint therefore records version creation directly from the approved requirement sheet rather than from version-memo promotion.`
- Scope approval:
  - `Yes. The operator approved the unified requirement text covering content-format unification, covered-module capability completion, runtime layout persistence, runtime UI layering, event-only routing, numeric id rules, no compatibility layer, and creator-facing de-developerization.`
- Admission basis:
  - `The requirement sheet defines one parent boundary larger than a single child queue and therefore must be promoted into a formal version before queue execution starts.`
  - `Because no currently open version lawfully owns this boundary, a successor version is the only lawful entry.`
- Required truth sync:
  - `Satisfied in this document batch for first-queue admission, project-progress pointer switching, queue-governor creation, and live active-task exposure.`

### Version Lifecycle Rules

- `This version remains open and the lawful execution truth currently runs through queue.script-editor-content-format-and-authoring-surface-unification until its repository-sync gate is recorded.`
- `If active_queue = none in the future, that does not close the version; it means the version has returned to lawful queue admission or closeout review.`
- `Implementation may proceed only through the admitted child queue doc and its live active task.`
- `Do not split content-format unification, event-owned routing convergence, runtime-layout persistence, and covered-module capability completion into separate parent targets while this version remains open.`
- `Do not reintroduce story-node/plot-node scope into this parent target unless a later parent-spec change is explicitly recorded here first.`
- `Task completion, queue closeout sync, admission sync, active queue switch, repository sync result recording, and doc-only state sync are not lawful stop points by themselves.`

### Approved Phase Order And No-Pause Rule

- `The operator already approved the version-level direction below. Blueprint may split bounded queues inside a phase, but it must not stop merely to reconfirm the high-level order itself.`

1. `Script Editor content-format, authoring-surface, id-rule, and event-structure unification`
2. `stage-host binding plus menu resource/runtime convergence`
3. `event-owned routing plus dialogue/playable/settlement capability convergence`
4. `runtime-layout registry persistence plus runtime UI layering convergence`
5. `export/import/loading/preview/runtime full-chain consistency, fail-closed rejection, acceptance, and governance closeout`

- `Within this version, full-chain consistency is mandatory; no queue may claim completion by landing authoring-only or runtime-only half-truth.`
- `The workflow must not pause again for already-approved boundary decisions such as title/name-first creator operation, internal numeric ids, no compatibility import, event as sole routing owner, runtime-layout save-back, or stage host extensibility.`
- `Escalation is lawful only if the parent goal changes, a second routing owner would be introduced, runtime layout attempts to absorb editor-page governance, unrecoverable creator meaning would be deleted without reconstruction, or governing docs conflict beyond the recorded priority order.`

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
- `It is illegal in this version to hand off directly from queue done to next queue admission using local-record alone.`
- `It is illegal in this version to treat auto-continue as permission to skip the queue-closeout sync batch.`

### Formal Stop-Rule Application

- `Before ending a response while an active queue, active task, or uniquely lawful next governance action still exists, run the workflow stop-condition self-check.`
- `Only these causes may lawfully stop execution: explicit answer-only request, real blocker, outside-parent-spec work, parent-spec change, capability downgrade risk, retired-rewrite risk, or genuine product decision.`
- `If none applies, do not stop at task completion, queue closeout, admission, queue activation, queue switch, sync recording, or status reporting; continue directly into the next lawful action.`
- `If one applies, write stop_reason / stop_basis / next_unblocked_action / human_input_required here before the response ends.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> active version plan -> active queue before touching a fresh child queue item.`
2. `This target is now the active version, but child-queue admission still requires version-plan admission sync before any queue becomes execution truth.`
3. `Before admitting any child queue, verify that it does not narrow the parent boundary by dropping numeric-id convergence, event-owned routing, runtime-layout persistence, or full-chain consistency.`
4. `queue.script-editor-content-format-and-authoring-surface-unification was the only lawful first queue under this version and is now admitted.`
5. `Implementation now resumes from the active queue doc and live active task rather than repeating admission review from scratch.`

### Queue Spec Integrity Rule

- `No child queue under this target may pass by shrinking the parent boundary to one helper seam, one editor-only happy path, one runtime-only shim, or one module-family patch.`
- `Before admission or closeout, each queue must be specific enough to prove inherited creator-facing capability, runtime consumption, alternate-path survival, and replacement-truth exit rather than only local implementation success.`
- `If a queue spec cannot yet name its capability floor, fail-closed requirement, non-primary paths, or replacement proof obligation, revise the queue spec first instead of proceeding with a thin execution boundary.`

### Operator Receipt Record

- receipt_join_status: `success`
- receipt_join_type: `execution-queue`
- receipt_join_queue_id: `queue.script-editor-content-format-and-authoring-surface-unification`
- receipt_reason_code: `admission-routing-required`
- receipt_reason_basis:
  - `The open version shell required a lawful first admission, and queue.script-editor-content-format-and-authoring-surface-unification is the only approved first execution slice under the recorded phase order.`
- receipt_active_queue: `queue.script-editor-content-format-and-authoring-surface-unification`
- receipt_active_task: `task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate`
- receipt_queue_goal:
  - `Execute the required-first authoring-format and numeric-id baseline so later module/runtime queues inherit one canonical creator-facing content structure.`
- receipt_next_step:
  - `Complete the first queue's repository-sync gate, then auto-route into queue.stage-host-binding-and-menu-resource-runtime-convergence.`
- receipt_human_action: `none-required`
- receipt_internal_analysis_exposed: `false`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger Type | Recheck Trigger Basis | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.script-editor-content-format-and-authoring-surface-unification` | `queue-candidate` | `queue.script-editor-content-format-and-authoring-surface-unification` | `candidate-recorded` | `none` | `It is the approved first phase and prerequisite baseline for every later queue.` | `ACC-FORMAT-001; ACC-FORMAT-002` | `src/application/script-editor/**; src/domain/script-editor-project.ts; src/ui/main-ui/**; tests/**` | `authoring-format convergence, id-rule convergence, creator-surface cleanup, event authoring structure normalization` | `stage/menu runtime completion, event-only routing retirement, runtime-layout persistence, final full-chain acceptance` | `This queue must execute first and must not be bypassed by later runtime-layout or routing work.` |
| `item.stage-host-binding-and-menu-resource-runtime-convergence` | `queue-candidate` | `queue.stage-host-binding-and-menu-resource-runtime-convergence` | `candidate-recorded` | `queue-closeout` | `Recheck only after authoring-format and id-rule baseline closes.` | `ACC-FORMAT-003` | `src/application/script-editor/**; src/application/runtime/**; src/content/**; tests/**` | `stage host-reference completion and menu formalization` | `event-owned routing conversion, runtime-layout persistence, final chain acceptance` | `Must preserve extensible host-family structure and runtime-consumed menu instances.` |
| `item.event-owned-routing-dialogue-playable-settlement-convergence` | `queue-candidate` | `queue.event-owned-routing-dialogue-playable-settlement-convergence` | `candidate-recorded` | `queue-closeout` | `Recheck only after stage/menu reference semantics are stable.` | `ACC-FORMAT-004` | `src/application/runtime/**; src/application/dialogue/**; src/application/playable/**; src/application/settlement/**; tests/**` | `event-only routing convergence plus dialogue/playable/settlement runtime completion` | `runtime-layout persistence or final acceptance ownership` | `Must not introduce a second router or preserve private continuation truth.` |
| `item.runtime-layout-registry-and-ui-layering-convergence` | `queue-candidate` | `queue.runtime-layout-registry-and-ui-layering-convergence` | `candidate-recorded` | `queue-closeout` | `Recheck only after routing boundary is frozen.` | `ACC-FORMAT-005` | `src/application/runtime/**; src/ui/**; preview/runtime save paths; tests/**` | `runtime-layout registry persistence, save-back, auto-load, and UI layering convergence` | `editor-page-layout governance or event-routing ownership` | `Must stay runtime/preview-scoped and must not expand into Script Editor page-layout redesign.` |
| `item.preview-runtime-loading-full-chain-consistency-and-final-acceptance` | `queue-candidate` | `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance` | `candidate-recorded` | `queue-closeout` | `Recheck only after the implementation-bearing queues close.` | `ACC-FORMAT-006` | `export/import/loader/preview/runtime/startup paths; browser acceptance; tests/**` | `full-chain consistency, fail-closed rejection, final acceptance, residue guard` | `primary ownership of earlier implementation-bearing queues` | `Required-final queue only; it must not be used to hide unfinished earlier work.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-content-format-and-authoring-surface-unification` | `candidate-ready` | `immediately after its queue doc is written` | `This is the already approved first queue and the only lawful next implementation entry.` |
| `queue.stage-host-binding-and-menu-resource-runtime-convergence` | `candidate-ready` | `only after queue.script-editor-content-format-and-authoring-surface-unification closes` | `Must inherit the settled id-rule and authoring-structure baseline.` |
| `queue.event-owned-routing-dialogue-playable-settlement-convergence` | `candidate-ready` | `only after queue.stage-host-binding-and-menu-resource-runtime-convergence closes` | `Must not admit before stage/menu reference semantics are stable.` |
| `queue.runtime-layout-registry-and-ui-layering-convergence` | `candidate-ready` | `only after queue.event-owned-routing-dialogue-playable-settlement-convergence closes` | `Must stay distinct from business-routing work.` |
| `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance` | `candidate-ready` | `only after all implementation-bearing queues close` | `Required-final queue.` |

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
- Fixed receipt:
  - `处理结果：已进入 Blueprint 内部治理。`
  - `当前执行情况：继续当前 active queue / active task，或按治理结果切换到下一 lawful action。`
  - `人工操作：当前不需要 / 当前需要确认 xxx`
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
  - `默认不向人工暴露真值链细节。`

### Execution Self-Review Gate

- review_scope: `version-creation`
- version_acceptance_alignment:
  - `All version acceptance ids are now assigned to one bounded queue portfolio in the approved phase order.`
- parent_spec_alignment:
  - `The created target preserves the operator-approved requirement sheet without dropping content-format, event-owned routing, runtime-layout persistence, or full-chain consistency boundaries.`
- queue_claim_alignment:
  - `The admitted first queue now owns ACC-FORMAT-001 / 002 only, and the active task remains bounded to canonical ids plus creator-surface convergence.`
- over_narrowing_check:
  - `The first queue remains authoring-format plus id-rule convergence rather than a thinner runtime-layout or menu-only slice, so the version does not skip the approved prerequisite batch.`
- residue_or_blocker_routing_check:
  - `No blocker is recorded. Later acceptances remain routed to the recorded follow-up queues, and the next lawful action is the active implementation task inside the admitted first queue.`
- verification_adequacy_check:
  - `Governed-doc verification must pass before this successor version shell is considered synchronized.`
- next_lawful_action_check:
  - `Resume task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation.`

### Progress Log

- `2026-07-26`: `Created target.script-editor-content-format-runtime-layout-and-module-capability-convergence from the operator-approved unified requirement sheet rather than from version-memo promotion.`
- `2026-07-26`: `Created the formal target spec and version plan, switched Blueprint entry pointers to the new open successor version, and recorded the five-queue portfolio in the already approved high-level phase order without admitting execution yet.`
- `2026-07-26`: `Admitted queue.script-editor-content-format-and-authoring-surface-unification as the required-first execution queue, synchronized project-progress to the live queue doc, and exposed task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation as the active task after evidence reconciliation completed.`
- `2026-07-26`: `The first queue has now covered ACC-FORMAT-001 / 002 locally. Canonical draft-id adoption, creator-facing copy cleanup, automated verification, and required in-app browser acceptance all passed, so the version auto-promoted task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate as the live active task.`
