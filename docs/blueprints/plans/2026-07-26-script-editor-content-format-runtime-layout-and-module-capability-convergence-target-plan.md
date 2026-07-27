# Script Editor Content Format, Runtime Layout, And Module Capability Convergence Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.script-editor-content-format-runtime-layout-and-module-capability-convergence`
- version_status: `open`
- active_phase: `phase.promotion-review`
- active_queue: `queue.runtime-layout-registry-and-ui-layering-convergence`
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
  - `queue.script-editor-content-format-and-authoring-surface-unification`
  - `queue.stage-host-binding-and-menu-resource-runtime-convergence`
  - `queue.event-owned-routing-dialogue-playable-settlement-convergence`
  - `queue.runtime-layout-registry-and-ui-layering-convergence`
  - `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.script-editor-content-format-and-authoring-surface-unification: closed after canonical draft-id baseline convergence, creator-facing copy cleanup, browser acceptance, and repository sync through commit f4ec1e20 on origin/mod-first-dev.`
  - `queue.stage-host-binding-and-menu-resource-runtime-convergence: closed with accepted compatibility residue after ACC-FORMAT-003 queue closeout and recorded remote-sync success.`
  - `queue.event-owned-routing-dialogue-playable-settlement-convergence: closed after ACC-FORMAT-004 closeout, accepted fail-closed residue classification for sample-scenario bg.council_room, and repository-sync success through commit 0daa903a on origin/mod-first-dev.`
  - `queue.runtime-layout-registry-and-ui-layering-convergence: admitted and active; the audited runtime-layout rationale is now locked and the lawful next step is the registry-owned runtime-layout contract cutover for ACC-FORMAT-005.`
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
  - `queue.script-editor-content-format-and-authoring-surface-unification is now closed after successful repository sync through commit f4ec1e20 on origin/mod-first-dev.`
  - `queue.stage-host-binding-and-menu-resource-runtime-convergence is now closed honestly with accepted compatibility residue recorded after ACC-FORMAT-003 closeout and remote-sync success.`
  - `queue.event-owned-routing-dialogue-playable-settlement-convergence is now closed honestly after ACC-FORMAT-004 closeout plus repository-sync success through commit 0daa903a on origin/mod-first-dev.`
  - `queue.runtime-layout-registry-and-ui-layering-convergence is now the admitted active queue, and task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover is now the live active task for ACC-FORMAT-005.`

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

- `This version remains open and the lawful execution truth now runs through queue.runtime-layout-registry-and-ui-layering-convergence.`
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
- receipt_join_queue_id: `queue.runtime-layout-registry-and-ui-layering-convergence`
- receipt_reason_code: `phase-order-auto-admission`
- receipt_reason_basis:
  - `The approved phase order and the completed closeout-plus-sync truth for queue.event-owned-routing-dialogue-playable-settlement-convergence make queue.runtime-layout-registry-and-ui-layering-convergence the uniquely lawful next admission.`
- receipt_active_queue: `queue.runtime-layout-registry-and-ui-layering-convergence`
- receipt_active_task: `task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate`
- receipt_queue_goal:
  - `Converge runtime-layout registry persistence, live save-back, auto-load resolution, and runtime UI layering on top of the settled stage/menu and event-owned routing baselines.`
- receipt_next_step:
  - `Continue from queue.runtime-layout-registry-and-ui-layering-convergence on its live registry-owned-layout-contract-cutover task. Admission evidence is already locked from the audited runtime-layout rationale, so the lawful next work is replacing mixed arrangement/container-derived runtime layout ownership with one registry-owned contract before queue closeout proof and repository sync.`
- receipt_human_action: `none-required`
- receipt_internal_analysis_exposed: `false`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger Type | Recheck Trigger Basis | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.script-editor-content-format-and-authoring-surface-unification` | `queue-candidate` | `queue.script-editor-content-format-and-authoring-surface-unification` | `closed` | `queue-closeout-complete` | `The first queue is now closed after repository sync through commit f4ec1e20 on origin/mod-first-dev.` | `ACC-FORMAT-001; ACC-FORMAT-002` | `src/application/script-editor/**; src/domain/script-editor-project.ts; src/ui/main-ui/**; tests/**` | `authoring-format convergence, id-rule convergence, creator-surface cleanup, event authoring structure normalization` | `stage/menu runtime completion, event-only routing retirement, runtime-layout persistence, final full-chain acceptance` | `This prerequisite baseline is now closed and may not be bypassed retroactively.` |
| `item.stage-host-binding-and-menu-resource-runtime-convergence` | `queue-candidate` | `queue.stage-host-binding-and-menu-resource-runtime-convergence` | `closed` | `queue-closeout-complete` | `ACC-FORMAT-003 closeout is complete: remote-sync succeeded and the remaining inline menu references are recorded as accepted compatibility-only residue rather than active production truth.` | `ACC-FORMAT-003` | `src/application/script-editor/**; src/application/runtime/**; src/content/**; tests/**` | `stage host-reference completion and menu formalization` | `event-owned routing conversion, runtime-layout persistence, final chain acceptance` | `Must preserve extensible host-family structure and runtime-consumed menu instances.` |
| `item.event-owned-routing-dialogue-playable-settlement-convergence` | `queue-candidate` | `queue.event-owned-routing-dialogue-playable-settlement-convergence` | `closed` | `queue-closeout-complete` | `ACC-FORMAT-004 closeout is complete: accepted fail-closed residue is recorded for sample-scenario bg.council_room and repository sync succeeded through commit 0daa903a on origin/mod-first-dev.` | `ACC-FORMAT-004` | `src/application/runtime/**; src/application/dialogue/**; src/application/playable/**; src/application/settlement/**; tests/**` | `event-only routing convergence plus dialogue/playable/settlement runtime completion` | `runtime-layout persistence or final acceptance ownership` | `The covered ACC-FORMAT-004 routing slices are now closed historical evidence and may not be reopened implicitly while ACC-FORMAT-005 is active.` |
| `item.runtime-layout-registry-and-ui-layering-convergence` | `queue-candidate` | `queue.runtime-layout-registry-and-ui-layering-convergence` | `admitted` | `active-queue` | `ACC-FORMAT-004 closeout and repository-sync are complete, so runtime-layout registry persistence plus runtime UI layering convergence becomes the uniquely lawful active queue under the approved phase order.` | `ACC-FORMAT-005` | `src/domain/**; src/application/script-editor/**; src/ui/**; preview/runtime save paths; tests/**` | `runtime-layout registry persistence, save-back, auto-load, and UI layering convergence` | `editor-page-layout governance or event-routing ownership` | `Admission is locked against the audited runtime-layout rationale: layout ownership still leaks through project contracts, formalization, loader validation, runtime materialization, UI-shell layering, and workspace issue routing, so the live task is the registry-owned layout contract cutover rather than another routing review.` |
| `item.preview-runtime-loading-full-chain-consistency-and-final-acceptance` | `queue-candidate` | `queue.preview-runtime-loading-full-chain-consistency-and-final-acceptance` | `candidate-recorded` | `queue-closeout` | `Recheck only after the implementation-bearing queues close.` | `ACC-FORMAT-006` | `export/import/loader/preview/runtime/startup paths; browser acceptance; tests/**` | `full-chain consistency, fail-closed rejection, final acceptance, residue guard` | `primary ownership of earlier implementation-bearing queues` | `Required-final queue only; it must not be used to hide unfinished earlier work.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-content-format-and-authoring-surface-unification` | `closed` | `already closed` | `Repository sync succeeded through commit f4ec1e20 on origin/mod-first-dev.` |
| `queue.stage-host-binding-and-menu-resource-runtime-convergence` | `closed` | `already closed` | `ACC-FORMAT-003 queue closeout is complete with accepted compatibility residue recorded and remote-sync already succeeded.` |
| `queue.event-owned-routing-dialogue-playable-settlement-convergence` | `closed` | `already closed` | `ACC-FORMAT-004 queue closeout is complete with accepted fail-closed residue recorded and remote-sync already succeeded through commit 0daa903a on origin/mod-first-dev.` |
| `queue.runtime-layout-registry-and-ui-layering-convergence` | `admitted` | `now active` | `It inherits the settled authoring-format, stage/menu, and event-owned routing baselines from the closed earlier queues.` |
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
  - `The closed first three queues now own completed ACC-FORMAT-001 through ACC-FORMAT-004 coverage historically, and the active queue now owns ACC-FORMAT-005 only.`
- over_narrowing_check:
  - `The first queue remains authoring-format plus id-rule convergence rather than a thinner runtime-layout or menu-only slice, so the version does not skip the approved prerequisite batch.`
- residue_or_blocker_routing_check:
  - `No blocker is recorded. The first three queues are closed and synced, runtime-layout registry persistence plus runtime UI layering convergence is now the active queue, and final acceptance remains routed to its recorded follow-up queue.`
- verification_adequacy_check:
  - `Governed-doc verification must pass before this successor version shell is considered synchronized.`
- next_lawful_action_check:
  - `Resume task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate.`

### Progress Log

- `2026-07-26`: `Created target.script-editor-content-format-runtime-layout-and-module-capability-convergence from the operator-approved unified requirement sheet rather than from version-memo promotion.`
- `2026-07-26`: `Created the formal target spec and version plan, switched Blueprint entry pointers to the new open successor version, and recorded the five-queue portfolio in the already approved high-level phase order without admitting execution yet.`
- `2026-07-26`: `Admitted queue.script-editor-content-format-and-authoring-surface-unification as the required-first execution queue, synchronized project-progress to the live queue doc, and exposed task.script-editor-content-format-and-authoring-surface-unification.authoring-format-and-id-baseline-implementation as the active task after evidence reconciliation completed.`
- `2026-07-26`: `The first queue has now covered ACC-FORMAT-001 / 002 locally. Canonical draft-id adoption, creator-facing copy cleanup, automated verification, and required in-app browser acceptance all passed, so the version auto-promoted task.script-editor-content-format-and-authoring-surface-unification.queue-closeout-review-and-sync-gate as the live active task.`
- `2026-07-26`: `Repository-sync gate for queue.script-editor-content-format-and-authoring-surface-unification is now satisfied. Commit f4ec1e20 landed on mod-first-dev, push to origin/mod-first-dev succeeded, and queue.stage-host-binding-and-menu-resource-runtime-convergence is now the uniquely lawful active queue under the approved phase order.`
- `2026-07-26`: `queue.stage-host-binding-and-menu-resource-runtime-convergence evidence reconciliation is now complete. The source audit locked ACC-FORMAT-003 against the real production seams: stageConfiguration still fronts progressTrackBindings/progressTracks, and menu truth still lives inline on city/building menuEntries across authoring, validation, and workflow cleanup.`
- `2026-07-26`: `The active stage/menu queue has now landed its first implementation slice on the stage side: progression contracts, Script Editor authoring helpers, runtime-pack export/import validation, story runtime consumption, browser smoke fixtures, and regression coverage now speak host-reference semantics instead of the earlier owner tuple.`
- `2026-07-26`: `The version remains on queue.stage-host-binding-and-menu-resource-runtime-convergence because menu truth is still inline on city/building menuEntries and therefore the queue cannot yet claim ACC-FORMAT-003 closeout.`
- `2026-07-26`: `Verification for the stage host slice is now fully green, including the existing stage settlement browser smoke. The version still remains on the same active queue because the formal menu resource/instance/runtime chain and menu-surface browser proof are still open work inside ACC-FORMAT-003.`
- `2026-07-27`: `The active stage/menu queue has now landed the formal menu authoring/export/import slice too. Script Editor projects formalize legacy location-local menuEntries into menuResources/menuInstances plus location menuInstanceIds, MainUiFlow now edits the formal menu chain as the active creator path, workspace-shell validation resolves formal menu references, and browser smoke now exercises the converged menu surface.`
- `2026-07-27`: `The same queue has now landed the runtime-side menu chain too. City presenter/render/click handling consumes formal menuResources/menuInstances, the built-in zhuyuanzhang pack now ships formal menu resource/instance files plus city menuInstanceIds, and city runtime actions dispatch through formal menu entry ids instead of hardcoded menu/panel branches.`
- `2026-07-27`: `Active authoring residue narrowed in the same batch: default and normalized location records no longer keep empty inline menuEntries as active truth, menu formalization strips legacy menuEntries after generating menuInstanceIds, and the old inline menu-entry helper exports were retired from city-building authoring.`
- `2026-07-27`: `Verification is green on the active queue surface after the runtime menu cutover: npm run build:test, node --test tests/robustness.test.cjs, node --test tests/browser-script-editor-deep-actions-smoke.test.cjs, npm run lint:blueprints, npm run lint:blueprint-skill, and npm run blueprint:governance:check all passed.`
- `2026-07-27`: `The version still remains on queue.stage-host-binding-and-menu-resource-runtime-convergence, but the lawful next step is now queue closeout review rather than more implementation. ACC-FORMAT-003 is not yet declared closed; the queue must first classify the remaining compatibility-only menuEntries shell and attempt the repository-sync gate.`
- `2026-07-27`: `Queue closeout review now judges the remaining menuEntries references as accepted compatibility-only residue rather than active production truth. The version therefore remains on the same active queue solely for the pending repository-sync gate, not for more stage/menu implementation.`
- `2026-07-27`: `Repository-sync gate for the current stage/menu batch is now satisfied. Commit 3b78445d landed on mod-first-dev and push to origin/mod-first-dev succeeded, so the version now holds both verified implementation proof and a recorded remote-sync result while queue closeout judgement remains active.`
- `2026-07-27`: `The attempted closeout review then found a same-family queue-owned gap: building runtime still consumes arrangement action-menu containers as menu production truth while building menuInstanceIds are only preserved through authoring/export/import/runtime loading. The version therefore stays on queue.stage-host-binding-and-menu-resource-runtime-convergence and returns to its implementation task rather than admitting the next queue or declaring ACC-FORMAT-003 closed.`
- `2026-07-27`: `The returned implementation slice is now landed and re-verified. Building runtime action menus consume formal menuResources/menuInstances, built-in zhuyuanzhang building menu truth now lives in houses/menu-resources/menu-instances rather than arrangement action items, and the Script Editor building arrangement surface now treats inline action items as retired authoring residue instead of the active path.`
- `2026-07-27`: `The version therefore remains on the same active queue but resumes queue-closeout review rather than implementation. ACC-FORMAT-003 is still not declared closed; Blueprint must now re-judge accepted residue and repository-sync truth on the updated building-formal-menu path before any next-queue admission decision.`
- `2026-07-27`: `Repository-sync also succeeded for the resumed building-formal-menu batch on origin/mod-first-dev. The version still does not auto-promote the next queue from that fact alone; queue.stage-host-binding-and-menu-resource-runtime-convergence must first finish honest closeout review for ACC-FORMAT-003.`
- `2026-07-27`: `queue.stage-host-binding-and-menu-resource-runtime-convergence closeout is now complete. ACC-FORMAT-003 remains execution-closed with accepted compatibility residue recorded for the remaining inline menu references, no active task remains in that queue, and the queue's remote-sync result is already recorded as successful.`
- `2026-07-27`: `queue.event-owned-routing-dialogue-playable-settlement-convergence is now admitted as the uniquely lawful next queue under the approved phase order. Evidence reconciliation completed during admission, and task.event-owned-routing-dialogue-playable-settlement-convergence.event-owned-routing-and-runtime-chain-implementation is now the live active task for ACC-FORMAT-004.`
- `2026-07-27`: `The first ACC-FORMAT-004 implementation slice landed and was verified under the same live active task. At that point, dialogue-runner and story-runtime direct nextEvent recursion had converged through the shared fail-closed event-continuation seam, while dialogue-choice-resolver had not yet been moved and runtime dialogue presentation consumption still remained open inside the active queue.`
- `2026-07-27`: `Governance truth is now reconciled with the already-landed second ACC-FORMAT-004 routing slice. dialogue-choice-resolver option nextEvent continuation now also converges through the shared fail-closed event-continuation seam, while runtime dialogue presentation consumption remains incomplete and playable-to-settlement/event-owned follow-up parity still stays unresolved until full queue proof exists.`
- `2026-07-27`: `Governance truth is now reconciled with the newly landed dialogue presentation slice. Runtime dialogue presentation now consumes dialogue-node portrait and side placement truth on the converged path, so portrait/side is no longer an open ACC-FORMAT-004 gap. The remaining queue-owned dialogue presentation gap is narrowed to background/music rendering, while playable-to-settlement/event-owned follow-up parity and queue closeout/sync still remain open.`
- `2026-07-27`: `Governance truth is now reconciled with the landed event-owned playable completion parity fix. Covered event-owned entrypoints now preserve playable-to-settlement handoff plus event-owned follow-up parity on the formal converged path, so that parity gap is no longer an open ACC-FORMAT-004 implementation item. The queue stays active on the same implementation task because runtime dialogue background/music presentation remains incomplete, and queue closeout, residue classification, and repository-sync are still pending.`
- `2026-07-27`: `Governance truth is now reconciled with the latest background/music presentation slice and the already-landed playable completion parity fix. Background/music dialogue nodes no longer fall through the generic transition placeholder and now render explicit authored presentation truth, while covered event-owned entrypoints still preserve formal playable-to-settlement handoff plus event-owned follow-up parity. The version nevertheless stays on the same ACC-FORMAT-004 implementation task because authored story background ids still depend on unmapped preview resolution in the current location-background seam and dialogue music still lacks a dedicated playback consumer, so queue closeout review is not yet lawful.`
- `2026-07-27`: `Governance truth is now reconciled with the later ACC-FORMAT-004 presentation follow-up slice. Dedicated dialogue-music playback is now wired through src/ui/dialogue-music.ts and main.ts, current shipped story background ids used by the zhuyuanzhang and liu-bang packs resolve preview images, and the version therefore remains on the same active queue but resumes queue-closeout review rather than more implementation. The remaining honest gap is partial preview coverage for other authored background ids such as sample-scenario bg.council_room, which currently fail closed without a preview image and must be classified during closeout review before repository-sync can begin.`
- `2026-07-27`: `queue.event-owned-routing-dialogue-playable-settlement-convergence closeout is now complete. ACC-FORMAT-004 remains execution-closed with accepted fail-closed residue recorded for sample-scenario bg.council_room, repository-sync succeeded through commit 0daa903a on origin/mod-first-dev, and no active task remains in that queue.`
- `2026-07-27`: `queue.runtime-layout-registry-and-ui-layering-convergence is now admitted as the uniquely lawful next queue under the approved phase order. Admission evidence is already locked from the audited runtime-layout rationale, and task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover is now the live active task for ACC-FORMAT-005.`
- `2026-07-27`: `ACC-FORMAT-005 progress is now reconciled with the landed slice-A and slice-B cutover work. The active queue still remains on task.runtime-layout-registry-and-ui-layering-convergence.registry-owned-layout-contract-cutover, but loader/project-parser rejection, top-level menu-authoring fail-closed behavior, and runtime-materializer removal of legacy arrangement action-menu items are now recorded as landed proof while the next lawful step becomes fresh verification and review toward possible queue-closeout-gate promotion.`
- `2026-07-27`: `Fresh ACC-FORMAT-005 verification is now fully green on the converged path: cmd /c npm run build:test, node --test tests/robustness.test.cjs, cmd /c npm run lint:blueprints, cmd /c npm run lint:blueprint-skill, and cmd /c npm run blueprint:governance:check all passed. Existing layout persistence/rendering coverage plus the new parser/authoring/materializer fail-closed guards now justify promoting the active queue from implementation into task.runtime-layout-registry-and-ui-layering-convergence.queue-closeout-review-and-sync-gate rather than continuing more same-family implementation.`
