# Version Plan Title

## Control Block

- document_role: `version-governor`
- version_id: `target.replace-me`
- version_status: `open | done | archived`
- active_phase: `phase.replace-me`
- active_queue: `queue.replace-me | none`
- decision_state: `active-execution | promotion-review | idle-open | blocked`
- next_decision: `queue-admission-review | queue-closeout-or-return-to-version-review | same-version-admission-or-version-closeout | version-closeout | resolve-blocker`
- next_action: `classify-fresh-work | write-admission-review | activate-admitted-queue | resume-active-queue | auto-reconcile-active-task | write-queue-closeout | return-to-promotion-review | write-version-closeout | resolve-blocker`
- resume_gate: `open-active-queue | promotion-review | idle-open | blocked`
- post_queue_closeout_pause_policy: `auto-continue | pause-when-explicitly-requested`
- promotion_review_result: `admit | reject | defer | block | none`
- review_subject_id: `item.replace-me | none`
- review_subject_classification: `queue-candidate | current-target-item | uncertain-needs-review | future-target-candidate | none`
- proposed_queue_id: `queue.replace-me | none`
- review_basis: `replace-with-written-evidence | none`
- admission_status: `none | pending | admitted | rejected | deferred | blocked`
- intake_status: `none | evaluating | absorbed | candidate-recorded | admission-review`
- intake_item_id: `item.replace-me | none`
- intake_summary: `replace-with-one-line-intake-summary | none`
- intake_result: `none | absorbed-into-active-queue | queued-as-candidate | promoted-to-admission | rejected | deferred`
- intake_feedback_mode: `none | fixed-receipt`
- closure_review_subject: `queue.replace-me | none`
- closure_review_status: `none | evaluating | routed | blocked`
- residue_candidate_id: `item.replace-me | none`
- residue_candidate_family: `same-family | cross-family | accepted-residue | none`
- routing_basis: `replace-with-written-routing-evidence | none`
- next_lawful_queue_recommendation: `queue.replace-me | none`
- auto_admission_ready: `true | false`
- stop_reason: `none | version-closeout-confirmation | explicit-answer-only | operator-requested-suspend | real-blocker | outside-parent-spec | parent-spec-change | capability-downgrade-risk | retired-rewrite-risk | product-decision`
- stop_basis: `replace-with-written-stop-evidence | none`
- next_unblocked_action: `replace-with-explicit-next-lawful-action | none`
- human_input_required: `true | false`
- stop_gate_owner: `blueprint-supervisor | version-plan-only | none`
- default_task_completion_effect: `continue-next-lawful-task | write-queue-closeout | none`
- default_queue_completion_effect: `route-next-lawful-queue | return-to-promotion-review | write-version-closeout | none`
- blocked_by: []
- candidate_queue_ids:
  - `queue.replace-me`
- candidate_backlog_refresh_status: `not-run | fresh | stale | blocked`
- candidate_backlog_snapshot:
  - `queue.replace-me | none`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `current version plan`
  - `candidate_queue_ids`
  - `Candidate Recovery Ledger`
  - `Queue Promotion Ledger`
  - `named queue docs`

## Human Context

### Admission Review Record

- Intake handling:
  - `The operator-facing intake surface is limited to 新需求 + 参考治理规范. Blueprint must internalize classification and routing work before asking the operator to manage queue mechanics.`
  - `Reset intake fields to none once intake handling is durably recorded, unless intake is still actively in progress.`
  - `Do not require the operator to provide item.xxx, classification, proposed queue id, review basis, or admission fields.`

- Scope approval:
  - `Record user scope approval here when it exists, but do not treat it as admission.`
- Admission basis:
  - `Record the evidence that justifies admit / reject / defer / block.`
- Required truth sync:
  - `Version plan admission fields must be written before implementation starts.`
  - `The admitted queue doc must exist before code implementation starts.`

### Evidence Draft Summary

- evidence_draft_status: `reviewed | pending`
- acceptance_matrix_ref: `docs/blueprints/specs/...#acceptance-matrix`
- operator_review_scope:
  - `The operator reviews target intent, boundaries, queue split, high-risk drift points, and first queue recommendation only.`
- high_risk_drift_points:
  - `Replace with drift risk 1.`
  - `Replace with drift risk 2.`
- first_queue_recommendation:
  - queue_id: `queue.replace-me`
  - basis: `Replace with why this queue should start first.`

### Evidence Lock Rule

- `Before a candidate queue becomes active, record evidence_lock_status, implementation_anchor_status, prerequisite_status, acceptance_claim_scope, acceptance_not_claimed, must_inspect, must_modify, must_replace, must_preserve, and minimum_verification.`
- `If a queue is already active before this evidence exists, add an evidence-anchor-reconcile task before further implementation.`
- `If implementation anchors are missing or conflicting, block activation or split the prerequisite queue instead of starting feature implementation.`
- `Evidence Lock must also verify that each admitted queue has enough anti-over-narrowing structure to police parent capability preservation, non-primary path survival, and replacement-truth exit.`

### Queue Spec Integrity Rule

- `Candidate admission must reject or revise any queue whose spec is too thin to prove parent capability preservation.`
- `At minimum, an admitted queue must expose inherited capability coverage, Can Claim, Cannot Claim, Capability Floor, User Path Coverage Matrix, Functional Loss Budget, Replacement Proof, and Completion Completeness Review.`
- `Do not admit a queue that could appear complete while alternate entry paths, preview/runtime/export/import paths, follow-up routing, or recovery/fail-closed paths are silently lost.`
- `Do not admit a queue whose local implementation seam, helper, adapter, shell, or guard has become the de facto requirement when the parent spec still defines a broader user-facing or runtime-facing capability.`

### Version Lifecycle Rules

- `A current open version stays open until version closeout is explicitly confirmed and written into this version plan.`
- `If active_queue = none, that does not close the version; it only returns the version to promotion-review or idle-open.`
- `As long as version_status = open, additional same-version queues may still be admitted.`
- `If no open version exists, version creation becomes the required next governance action before any queue admission or implementation can begin.`
- `Queue closeout may auto-advance; version closeout must not be inferred from queue completion alone.`
- `When version acceptance and closeout conditions are satisfied, ask exactly one human confirmation before changing version_status to done.`
- `If the agent lawfully stops or asks for input, it must first write stop_reason / stop_basis / next_unblocked_action / human_input_required into this version plan.`
- `If stop_reason=none while active_queue, active_task, or another uniquely lawful next action still exists, next_unblocked_action must still name that continuation explicitly rather than remaining none.`
- `When used, stop_gate_owner names the governing stop gate; agent-local completion heuristics must not override it.`
- `When used, default_task_completion_effect and default_queue_completion_effect should make continuation intent machine-readable rather than prose-only.`
- `Task completion, queue closeout sync, admission sync, active queue switch, repository sync result recording, and doc-only state sync are not lawful stop points by themselves.`

### Auto-Continue Stop Rule

- `Before ending a response while an active queue, active task, or uniquely lawful next governance action still exists, run the workflow stop-condition self-check.`
- `Only these causes may lawfully stop execution: explicit answer-only request, real blocker, outside-parent-spec work, parent-spec change, capability downgrade risk, retired-rewrite risk, or genuine product decision.`
- `If none applies, do not stop at task completion, queue closeout, admission, queue activation, queue switch, sync recording, or status reporting; continue directly into the next lawful action.`
- `If one applies, write stop_reason / stop_basis / next_unblocked_action / human_input_required here before the response ends.`

### Operator-Facing Terminology Rule

- `Do not write mixed Chinese-English governance phrases that could be mistaken for formal Blueprint states, field values, queue classes, or lifecycle enums when they are only explanatory prose.`
- `If a term is already formal Blueprint truth or an explicitly accepted fixed project term, quote that exact term directly. Otherwise prefer natural Chinese.`
- `Do not present explanatory phrases such as candidate screening, version-level review, same-version queue admission, or routing follow-up as if they were newly defined formal statuses.`
- `If operator-facing wording must mention an English governance term for precision, explicitly distinguish whether it is a formal structured term or only explanatory wording.`

### Post-Queue Closeout Pause Policy

- `post_queue_closeout_pause_policy = auto-continue is the default.`
- `When the policy is auto-continue, completing a queue must not create a default "whether to continue" question.`
- `If the next legal action is unique after queue closeout, continue automatically through closeout, version review, same-family residue routing, next queue admission, or next active queue startup.`
- `Exception: a required-final / final-guard queue must not auto-start just because earlier queues are done. Starting or skipping that queue requires explicit operator decision, and skipping must be recorded as accepted-residue or blocked rather than covered.`
- `When an operator explicitly requests queue-completion pauses, write post_queue_closeout_pause_policy = pause-when-explicitly-requested in this version plan.`
- `When pause-when-explicitly-requested is active, pause only after queue closeout, verification, governance sync, and repository sync record are complete.`
- `At a configured pause point, report the completed queue, verification result, sync result, next legal action or queue, and ask whether to continue.`
- `The operator may return to auto-continue with an explicit request such as "恢复自动继续" or "关闭队列完成暂停模式".`
- `This policy does not remove required human confirmation for version_status open -> done, real blockers, or genuinely multiple mutually exclusive legal branches.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> version plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `If one exists, decide whether the new item can be absorbed without widening queue scope.`
4. `Classify the item before any queue creation or implementation.`
5. `If the item is queue-candidate, write review_subject_id / review_subject_classification / proposed_queue_id / review_basis / admission_status first.`
6. `Only after version-plan admission sync may a queue doc be created and activated.`
7. `Only after the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`
8. `User scope approval is boundary approval only; it does not replace admission.`
9. `When intake does not proceed directly into implementation, return the fixed operator receipt rather than a long Blueprint internal analysis dump.`
10. `Once a queue-candidate is already structurally recorded in current version truth, later admission review is an internal governance step rather than a default human confirmation point.`
11. `If an admission gap or completeness-audit finding remains inside the parent spec, record it as gap fill, residue, guard evidence, or routing truth and continue unless blocker rules or stop-condition rules require human input.`
12. `Before stopping while a live queue, pending candidate, or uniquely lawful next governance step still exists, run the workflow stop-condition self-check instead of pausing by default.`
13. `If the self-check concludes that a stop is lawful, record the structured stop fields in the version plan before ending the response.`
14. `Do not treat admission completion, queue activation, queue switch, queue closeout sync, repository sync result recording, or doc-only synchronization as a valid reason to end a response.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger Type | Recheck Trigger Basis | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.replace-me` | `queue-candidate` | `queue.replace-me` | `deferred` | `new-material-evidence | active-queue-absorption-changed | parent-spec-updated | acceptance-ownership-changed | implementation-anchor-changed | candidate-version-membership-changed | operator-explicit-recheck | none` | `Replace with the concrete evidence that justifies recheck, or none.` | `ACC-REPLACE-001` | `src/or/tests/path` | `ACC-REPLACE-001` | `ACC-REPLACE-002` | `Use this ledger to resume admission from existing evidence rather than restarting from scratch.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.replace-me` | `candidate` | `Replace with promotion trigger.` | `Replace with the current note.` |

### Candidate Backlog Refresh Rule

- `After an execution queue closes, refresh candidate truth before answering whether more same-version candidate queues exist.`
- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`
- `Use docs/change-log.md only when structured governance docs are insufficient or explicitly cite it.`
- `Record the result in candidate_backlog_refresh_status, candidate_backlog_snapshot, and candidate_backlog_scan_sources.`
- `Do not answer no candidate queues remain unless candidate_backlog_refresh_status=fresh and candidate_backlog_snapshot is empty.`
- `If candidate truth is stale, missing, or inconsistent, refresh or reconcile it instead of giving a prose none answer.`
- `Do not require the operator to paste a queue doc when governance truth already names the doc path.`

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split Reason | Reject Or Split Basis |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `queue.replace-me` | `docs/...` | `ACC-REPLACE-001` | `src/or/tests/path` | `legacy/path/or/field` | `compatibility/path/or/behavior` | `missing-implementation-anchor | missing-acceptance-ownership | scope-too-broad-needs-split | parent-capability-not-structurally-covered | anti-over-narrowing-structure-missing | prerequisite-queue-required | conflicts-with-active-queue-boundary | belongs-to-other-version-or-target | parent-spec-update-required | none` | `Replace with the concrete reason this candidate must be rejected or split, or none.` |

### Candidate Queue Integrity Checklist

- `For each candidate queue, record whether its spec already names the inherited capability floor, non-primary user paths, replacement proof obligations, and functional-loss guard needed to prevent over-narrowing.`
- `If any of those are missing, revise the queue spec before admission rather than discovering the gap only after implementation starts.`
- `A candidate queue split is incomplete if the parent required capability exists only as prose and is not structurally owned, preserved, or routed by the queue set.`

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- | --- |
| `ACC-REPLACE-001` | `queue.replace-me` | `test-or-source-reference` | `uncovered | covered | accepted-residue | blocked` | `none` |

### Execution Self-Review Gate

- review_scope: `admission-review | queue-closeout-review | version-closeout-review`
- version_acceptance_alignment:
  - `Replace with how the current review result aligns with the version acceptance matrix.`
- parent_spec_alignment:
  - `Replace with how the current routing or closure result still matches the controlling parent spec.`
- queue_claim_alignment:
  - `Replace with whether the reviewed queue claimed only what it owns and routed the rest lawfully.`
- over_narrowing_check:
  - `Replace with whether any queue result became narrower than the version requirement without explicit routing.`
- residue_or_blocker_routing_check:
  - `Replace with whether every discovered gap is routed to residue, blocker, accepted residue, or successor queue.`
- verification_adequacy_check:
  - `Replace with whether the cited verification is sufficient for the claimed review result.`
- next_lawful_action_check:
  - `Replace with the uniquely lawful next action, or explain the lawful blocker/branch if not unique.`

### Runtime/Browser Acceptance Gate

- gate_required: `true | false`
- covered_surfaces:
  - `Replace with the UI/editor/runtime/import-export/preview surfaces that require direct interaction proof at version-review level.`
- interaction_path:
  - `Replace with the executed path or recorded reason it was waived.`
- proof_mode:
  - `human-visible-in-app-browser | runtime-trace | automated-test-visible-output | equivalent-waiver`
- proof_artifacts:
  - `Replace with the concrete artifacts used for closeout-level acceptance.`
- fail_closed_check:
  - `Replace with the fail-closed / blocked / empty-state behavior evidence relevant to this review.`
- waiver_basis:
  - `none | Replace with why direct interaction proof is not required or not currently possible and what evidence replaces it.`
- simulated_human_visibility:
  - `visible-human-observed | not-applicable | waived`
- interaction_semantics:
  - `Replace with whether proof used visible pointer/keyboard/scroll interaction on rendered UI controls inside the built-in in-app browser rather than hidden/background automation, external-browser-only interaction, or direct function/state bypass.`

### Closure Routing Record

- `Queue closeout residue must be absorbed here after queue-level closeout judgement completes.`
- `This version plan owns same-family continuation routing truth; it must not create a second resume chain.`
- `If queue closeout proves one unique same-family continuation, write that continuation here instead of returning to open-ended human queue selection.`
- `If residue is cross-family or not uniquely routable, return to broader version review instead of pretending same-family continuation is already settled.`
- `Do not duplicate queue-level implementation evidence here; record routing truth only.`

Allowed `next_decision` values:

- `queue-admission-review`
- `queue-closeout-or-return-to-version-review`
- `same-version-admission-or-version-closeout`
- `version-closeout`
- `resolve-blocker`

Allowed `next_action` values:

- `classify-fresh-work`
- `write-admission-review`
- `activate-admitted-queue`
- `resume-active-queue`
- `auto-reconcile-active-task`
- `write-queue-closeout`
- `return-to-promotion-review`
- `write-version-closeout`
- `resolve-blocker`

### Candidate Recovery Rule

- `If a queue-candidate is already recorded in the version plan or candidate recovery ledger, resume from that record by default.`
- `Only restart a full re-audit when new material evidence invalidates the prior classification or review basis.`
- `Do not use prose-only memory as the recovery source when structured admission truth already exists.`
- `If a restarted queue requires document updates, write those updates first, then keep the restarted queue in the candidate queue set until lawful admission is possible.`
- `A restarted queue must not stop, replace, preempt, or immediately become the current active execution queue while another active queue exists.`

### Evidence Search Priority

- `For execution truth, routing, admission, closeout, task status, and next action, read project-progress -> blueprint -> version plan -> active queue -> active task first.`
- `For implementation truth, existing mechanisms, interfaces, call flows, data shapes, and actual runtime behavior, search src/ and tests/ first.`
- `For historical explanation, use compact active governance records first; open closed queues, old plans, docs/superpowers/**, or docs/change-log.md only when explicitly cited or when code evidence is insufficient.`
- `Do not use docs/change-log.md as the default search target for Blueprint routing, admission, closeout, scheduling, or implementation truth.`

### Closure Judgement And Residue Routing Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `Queue docs own execution_closeout_status / topic_closure_status / closure_basis / residue_remaining / residue_family / residue_routing_status / next_family_candidate / auto_continue_eligible.`
- `This version plan owns closure_review_subject / closure_review_status / residue_candidate_id / residue_candidate_family / routing_basis / next_lawful_queue_recommendation / auto_admission_ready / stop_reason / stop_basis / next_unblocked_action / human_input_required.`
- `If same-family residue is uniquely routable, write the continuation here and avoid asking the operator which queue should come next.`
- `If multiple lawful residue continuations remain genuinely unresolved, route to human choice only then.`

### Single-Active-Queue Rule

- `When execution_mode=single-active-task and allow_parallel=false, an active queue blocks live admission review for a second queue.`
- `If a fresh item cannot be absorbed by the current active queue, record it as a candidate for later rather than activating a second queue.`
- `If a restarted queue cannot be absorbed by the current active queue, record it as a candidate for later rather than activating it immediately.`
- `Return to version-level review only after the current active queue closes.`
- `If an active queue exists and intake or questioning depends on that queue state, expose a queue snapshot before asking the operator to choose.`

### Operator Intake Contract

- `Use Operator Receipt Record below as the structured source of truth for operator-facing intake output.`

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

### Operator Receipt Record

- receipt_join_status: `success | failed | success-already-recorded`
- receipt_join_type: `execution-queue | candidate-queue | not-added`
- receipt_join_queue_id: `queue.replace-me | none`
- receipt_reason_code: `absorbed-into-active-queue | recorded-as-candidate | admission-routing-required | active-queue-already-exists | candidate-only-not-admitted | blocked-by-governance-truth | rejected-by-scope-or-evidence | none`
- receipt_reason_basis:
  - `Replace with the concrete basis for the receipt result.`
- receipt_active_queue: `queue.replace-me | none`
- receipt_active_task: `task.replace-me | none`
- receipt_queue_goal:
  - `Replace with the live queue goal, or none.`
- receipt_next_step:
  - `Replace with the next lawful Blueprint action to be shown to the operator.`
- receipt_human_action: `none-required | confirmation-required | wait-for-blocker`
- receipt_internal_analysis_exposed: `false | true`

### Post-Task Auto-Reconcile

1. `Run verify_with.`
2. `Check done_when.`
3. `Write the task after-state, queue truth, and any required version truth before any repository sync begins.`
4. `Re-evaluate queue closeout.`
5. `Scan governance owners.`
6. `Scan residue.`
7. `If queue closeout leaves residue, absorb same-family or cross-family routing truth here before repository sync begins.`
8. `Record local repository sync state after the docs are updated.`
9. `At queue closeout, create one local branch-commit for the completed execution queue before activating the next queue or continuing version-level promotion review.`
10. `At queue closeout, attempt remote-sync toward the remote development trunk mod-first-dev after the local branch-commit is recorded.`
11. `If a push or merge is started, wait for the result before any later Blueprint scheduling action continues.`
12. `Whether remote-sync succeeds or fails, record the result and, if the next legal step is unique, continue directly into closeout, same-family routing, or version review.`
13. `Update docs/change-log.md only when code, runtime, compatibility, shared interface, or user-visible behavior changed.`
14. `Recording the sync result is not a legal pause point by itself; if the next legal step is unique and no lawful stop condition exists, continue automatically.`

### Human Confirmation Constraint

- `At most one human-confirmation question may be asked per task.`
- `If docs/code can decide, do not ask.`
- `If only one legal branch exists, do not ask.`
- `If post_queue_closeout_pause_policy=auto-continue and the next legal step is unique, do not ask whether to continue after queue closeout.`
- `If post_queue_closeout_pause_policy=pause-when-explicitly-requested, pause only after the legal execution batch is complete and synchronized.`
- `Scope approval does not replace admission.`
- `Do not ask whether to perform closeout, promotion review, or doc sync when they are already the unique next legal step.`
- `Do not ask which queue should come next when same-family residue routing is already uniquely supported by current closeout truth.`
- `Do not raise decision_required merely because repository sync failed.`
- `Do not ask about a merge conflict when current version truth already uniquely decides the legal resolution.`
- `Ask only when the baseline is ambiguous or when merge-conflict handling has multiple mutually exclusive legal resolutions that current version truth cannot decide alone.`
- `Exception: version closeout requires explicit human confirmation before version_status changes from open to done.`

### Explicit Operator-Directed Closure Or Suspension

- `If the operator explicitly requests suspending the current version, keep version_status=open, set stop_reason=operator-requested-suspend, record stop_basis plus next_unblocked_action, and set human_input_required=false.`
- `If the operator explicitly requests closing the current version, use version_status=done only when closeout truth is actually satisfied; otherwise use version_status=archived.`
- `If the operator explicitly requests suspending the current execution queue, clear active_queue in this version plan, synchronize the queue doc to queue_status=suspended, and record the lawful resume action here.`
- `If the operator explicitly requests closing the current execution queue before it is actually complete, route it as dropped rather than done and absorb any remaining residue here.`
- `If the operator explicitly requests suspending or dropping a candidate queue, update Candidate Recovery Ledger and Queue Promotion Ledger in the same batch rather than leaving the request as prose only.`

### Repository Sync Policy

- `Git sync is non-governing.`
- `commit / push / merge must not change queue truth, version truth, candidate truth, or transition truth.`
- `push / merge must not become a queue closeout gate.`
- `push / merge must not become a version closeout gate.`
- `Task execution conclusions are written first; repository sync state is recorded second.`
- `Default Blueprint governance/documentation refinement uses local-record during execution, one branch-commit at queue closeout, then attempted remote-sync toward mod-first-dev.`
- `Every completed execution queue should have its own local commit before later Blueprint scheduling continues.`
- `Every completed execution queue should then attempt remote-sync toward mod-first-dev; if that remote-sync fails, record the failure and continue from written governance truth.`
- `Once push starts, wait for its success or failure result before continuing queue activation, promotion review, or version scheduling.`
- `Avoid process-only commits for minor field synchronization unless that synchronization is the bounded queue or task itself.`
- `A failed sync attempt is recorded only as repository sync result in the queue-local sync record.`
- `Remote sync failure must not block task closeout, queue closeout, version review handoff, same-family continuation routing, or next lawful queue activation.`
- `A merge conflict is a repository sync event; it must not rewrite the already-recorded task, queue, or version conclusion.`
- `If current version truth uniquely decides the merge conflict direction, resolve it without asking.`
- `Version scheduling must not read sync_status, sync_scope, or sync_summary as live truth.`

### Repository Sync Levels

1. `local-record: write local docs/code and queue-local sync state without creating a commit.`
2. `branch-commit: draft the commit message as <type>: <brief title> plus a Summary: block with real bullets, run commit-message validation, and create one semantic local commit for the completed execution queue.`
3. `branch-push: push the working branch after one or more queue commits; wait for the push result before continuing.`
4. `remote-sync: push the working branch and attempt merge/push to the development trunk mod-first-dev; wait for the remote-sync result before continuing.`
5. `Resume from the written Blueprint truth after local-record, queue branch-commit, or attempted remote-sync returns success or failure; failed remote-sync is not a closeout or admission blocker.`

### Prior Promotion Record

- `Keep this section short in active plans. Summarize long promotion chains here and leave full evidence in closed queue docs or commit history.`
