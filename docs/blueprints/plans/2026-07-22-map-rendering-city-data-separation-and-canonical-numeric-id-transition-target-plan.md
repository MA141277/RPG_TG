# Map Rendering, City Data Separation, And Canonical Numeric ID Transition Version Plan

## Control Block

- document_role: `version-governor`
- version_id: `target.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- version_status: `open`
- active_phase: `phase.promotion-review`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `same-version-admission-or-version-closeout`
- next_action: `return-to-promotion-review`
- resume_gate: `promotion-review`
- post_queue_closeout_pause_policy: `auto-continue`
- promotion_review_result: `queue-closeout-complete`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- intake_status: `admission-review`
- intake_item_id: `item.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- intake_summary: `Promote MEMO-027 into a new successor version, admit the named queue immediately, and continue implementation under one single active queue.`
- intake_result: `promoted-to-admission`
- intake_feedback_mode: `fixed-receipt`
- closure_review_subject: `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- closure_review_status: `routed`
- residue_candidate_id: `none`
- residue_candidate_family: `none`
- routing_basis: `queue-closed-locally-after-human-visible-in-app-browser-acceptance`
- next_lawful_queue_recommendation: `none`
- auto_admission_ready: `false`
- stop_reason: `none`
- stop_basis: `none`
- next_unblocked_action: `none`
- human_input_required: `false`
- blocked_by: []
- candidate_queue_ids:
  - `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- candidate_backlog_refresh_status: `fresh`
- candidate_backlog_snapshot:
  - `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition: closed locally after ACC-MAP-ID-006 human-visible in-app browser acceptance covered normal start, JSON runtime-pack import, and Script Editor runtime preview through campaign map click and city-enter continuation. The version remains open with no active queue and returns to promotion/version review while repository sync is still pending.`
- candidate_backlog_scan_sources:
  - `project-progress`
  - `blueprint`
  - `docs/blueprints/version-memo.md#MEMO-027`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-evidence-draft.md`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target.md`

## Human Context

### Activation Record

- Scope approval:
  - `The operator explicitly requested creating a new version for MEMO-027, admitting queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition immediately, setting it as the unique active queue, creating a live active task, and continuing execution without pausing on uncertainty.`
- Inherits from:
  - `docs/blueprints/version-memo.md#memo-027-map-rendering-and-city-data-separation-with-canonical-numeric-id-transition-draft`
  - `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-evidence-draft.md`
- Inheritance boundary:
  - `This version owns city-owned map rendering truth, runtime/export/import/startup convergence for map placement, canonical numeric id generation for new Script Editor records, direct-vs-indirect id-consumer cleanup within the owned surfaces, and active pack migration/refactor-log maintenance.`
  - `It does not reopen older open versions whose current queue docs are structurally insufficient for lawful activation under current Blueprint governance.`
- Admission basis:
  - `The previously active version was explicitly closed, so no active open version lawfully owned MEMO-027 execution.`
  - `Older still-open versions cannot absorb MEMO-027 without parent-goal widening or queue-governance drift.`
  - `The operator explicitly named queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition as the implementation queue to admit now.`
- Activation conclusion:
  - `Formal target docs now exist for target.map-rendering-city-data-separation-and-canonical-numeric-id-transition, and the named queue is admitted as the only active queue.`
  - `Evidence-anchor reconcile has now completed, the queue evidence lock is treated as locked, and active execution has advanced into implementation work without changing the single-queue boundary.`

### Admission Review Record

- Intake handling:
  - `The operator-facing intake already supplied the target memo, required queue id, and explicit instruction to create a new version and continue execution.`
  - `Blueprint therefore recorded the review/admission fields directly instead of stopping for further queue selection.`
- Scope approval:
  - `Yes. The operator explicitly approved this exact version and queue route.`
- Admission basis:
  - `MEMO-027 requires one parent target that owns both city-owned map truth and canonical numeric id transition governance.`
  - `The current repository truth was stopped on a closed version, so a new version was the only lawful execution entry.`
  - `No active queue existed, and the operator explicitly requested direct admission of the named queue.`
- Required truth sync:
  - `Satisfied in this document batch before implementation continues.`

### Version Lifecycle Rules

- `This version is open and currently owns exactly one lawful active queue: queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition.`
- `If active_queue = none later, that does not by itself close the version; version closeout still requires explicit closeout review and recorded acceptance coverage.`
- `Because this target is the active version, child-queue admission here is lawful only after version-plan admission truth and queue-doc activation are synchronized.`
- `Do not thin MEMO-027 down to one map-view happy path, one helper seam, one content migration only, or one family-only id tweak.`
- `Do not split city-owned map truth and canonical numeric-id transition into separate versions while this parent target remains active.`
- `Do not implement code without an admitted child queue doc and a live active task.`
- `Task completion, queue closeout sync, admission sync, active queue switch, repository sync result recording, and doc-only state sync are not lawful stop points by themselves.`

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
3. `Before admitting any child queue, verify that it does not narrow MEMO-027 by leaving map-owned city marker truth, by preserving count-based add-record ids, or by routing city-map/runtime parity work elsewhere.`
4. `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition is the sole admitted queue for this version until it either closes or records a lawful blocker/residue route.`
5. `Only after version-plan admission truth exists and the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`

### Queue Spec Integrity Rule

- `No child queue under this target may pass by shrinking MEMO-027 down to one happy path, one helper seam, or one locally convenient source edit.`
- `Before admission or closeout, each queue must be specific enough to prove inherited capability preservation, alternate-path survival, and replacement-truth exit rather than only local implementation success.`
- `If a queue spec cannot yet name its capability floor, non-primary user/runtime paths, functional-loss guard, or replacement proof obligation, revise the queue spec first instead of proceeding with a thin execution boundary.`

### Evidence Draft Summary

- evidence_draft_status: `reviewed`
- acceptance_matrix_ref: `docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target.md#acceptance-matrix`
- operator_review_scope:
  - `The operator explicitly promoted MEMO-027 into a new version and requested immediate single-queue admission plus continuous execution.`
- high_risk_drift_points:
  - `Map nodes still carry city-looking label/summary/coordinate truth in active files.`
  - `New-record id generation is scattered across multiple Script Editor helpers.`
  - `Older ids must remain stable while new ids become canonical.`
- first_queue_recommendation:
  - queue_id: `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
  - basis: `MEMO-027 is explicitly admitted as one inseparable replacement chain rather than a thin partial queue set.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger Type | Recheck Trigger Basis | Acceptance Refs | Implementation Anchors | Can Claim | Cannot Claim | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `item.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `queue-candidate` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `closed-local-record` | `operator-explicit-recheck` | `The operator explicitly requested new-version promotion and immediate admission.` | `ACC-MAP-ID-001; ACC-MAP-ID-002; ACC-MAP-ID-003; ACC-MAP-ID-004; ACC-MAP-ID-005; ACC-MAP-ID-006` | `src/application/content/active-game-content.ts; src/application/map/**; src/application/script-editor/**; src/domain/script-editor-project.ts; src/content/scenario-packs/zhuyuanzhang/**; tests/**` | `full MEMO-027 implementation boundary inside this version` | `bulk rewrite of existing ids outside first-stage transition; unrelated map/review modularization` | `Admitted on 2026-07-22 as the only active queue under the new successor version; closed locally on 2026-07-23 after human-visible in-app browser acceptance covered the remaining runtime entrypoints.` |

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `done` | `already promoted` | `The unique active queue is now closed locally after ACC-MAP-ID-006 human-visible in-app browser proof covered normal start, JSON runtime-pack import, and Script Editor runtime preview.` |

### Candidate Backlog Refresh Rule

- `After an execution queue closes or candidate routing changes, refresh candidate truth before answering whether more same-version candidate queues remain.`
- `Read project-progress -> blueprint -> current version plan -> candidate_queue_ids -> Candidate Recovery Ledger -> Queue Promotion Ledger -> named queue docs.`
- `Use docs/change-log.md only when structured governance docs are insufficient or explicitly cited by the current version plan.`
- `Do not answer none unless candidate_backlog_refresh_status=fresh and candidate_backlog_snapshot is empty.`
- `If candidate truth is stale, missing, or inconsistent, refresh or reconcile it rather than answering with prose.`

### Blueprint Lint Failure Handling

- `If npm run lint:blueprints fails during this version's admission, evidence-lock, implementation, or closeout path, first repair the governing docs/spec structure inside the current lawful boundary rather than treating the failure as advisory.`
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

### Candidate Evidence Matrix

| Queue ID | Source Docs | Acceptance Refs | Implementation Anchors | Legacy Paths To Replace | Compatibility Paths To Preserve | Reject Or Split Reason | Reject Or Split Basis |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `docs/blueprints/version-memo.md#MEMO-027; docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-evidence-draft.md; docs/blueprints/specs/2026-07-22-map-rendering-city-data-separation-and-canonical-numeric-id-transition-target.md` | `ACC-MAP-ID-001; ACC-MAP-ID-002; ACC-MAP-ID-003; ACC-MAP-ID-004; ACC-MAP-ID-005; ACC-MAP-ID-006` | `src/application/content/active-game-content.ts; src/application/map/**; src/application/script-editor/**; src/domain/script-editor-project.ts; src/content/scenario-packs/zhuyuanzhang/**; tests/**` | `map-owned city marker coordinates/labels/summaries; count-based new-record ids; live indirect id-shape assumptions` | `existing ids, runtime startup/import/preview parity, non-city map rendering, lawful city click routing` | `none` | `The queue is deliberately admitted as one inseparable replacement chain.` |

### Acceptance Coverage Ledger

| Acceptance ID | Primary Owner Queue | Proof Artifact | Status | Residue Or Blocker |
| --- | --- | --- | --- | --- |
| `ACC-MAP-ID-001` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `Automated coverage in tests/robustness.test.cjs: map city markers use city-owned map placement; map rendering path consumes provider-backed city locations.` | `covered-by-automation` | `none` |
| `ACC-MAP-ID-002` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `Automated coverage in tests/robustness.test.cjs: map location provider adapter exposes marker-ready city locations; map rendering path consumes provider-backed city locations.` | `covered-by-automation` | `none` |
| `ACC-MAP-ID-003` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `Automated coverage in tests/robustness.test.cjs plus tests/city-building-mount-authoring.test.cjs after npm run build:test.` | `covered-by-automation` | `none` |
| `ACC-MAP-ID-004` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `Automated coverage in tests/robustness.test.cjs: script editor draft creation allocates canonical numeric ids by family max+1 without deleted-id reuse.` | `covered-by-automation` | `none` |
| `ACC-MAP-ID-005` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `Refactor log sync plus targeted robustness source guards for current owned consumers.` | `covered-by-automation` | `none` |
| `ACC-MAP-ID-006` | `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition` | `Human-visible Codex in-app browser pointer-level proof now covers a visible mouse/keyboard/scroll handshake plus normal start, built-in JSON runtime-pack import, and Script Editor runtime preview. Each path reached campaign map rendering, clicked 濠州, accepted the city-enter continuation prompt, and entered the city function menu on city-owned map placement truth.` | `covered` | `none` |

### Execution Self-Review Gate

- review_scope: `promotion-review`
- version_acceptance_alignment:
  - `All version acceptance ids are fully owned by the one admitted queue; no parent capability remains unowned.`
- parent_spec_alignment:
  - `The active queue matches the parent spec by keeping city-owned map truth and numeric-id transition in one replacement chain without widening into unrelated map/review modularization.`
- queue_claim_alignment:
  - `The queue is allowed to claim the full MEMO-027 implementation boundary and must not over-claim bulk existing-id rewrite or unrelated review modularization.`
- over_narrowing_check:
  - `The queue spec explicitly requires runtime/export/import/startup parity, pack migration, and refactor-log truth so completion cannot collapse into one helper seam or one map view happy path.`
- residue_or_blocker_routing_check:
  - `No blocker or same-family residue remains inside the queue boundary. Hidden/background browser automation stays excluded historically, but the required visible in-app browser proof has now been captured truthfully.`
- verification_adequacy_check:
  - `Verification is complete for queue-local closeout: automated coverage remains green and ACC-MAP-ID-006 now has human-visible in-app browser proof across the required entrypoints.`
- next_lawful_action_check:
  - `Queue closeout is now synchronized locally. Control returns to version-level promotion/version review, and repository sync remains the next gate before any future same-version queue admission.`

### Runtime/Browser Acceptance Gate

- gate_required: `true`
- covered_surfaces:
  - `campaign map rendering`
  - `city click -> access check -> continuation`
  - `normal start`
  - `JSON runtime pack import`
  - `Script Editor runtime preview`
- interaction_path:
  - `Run the acceptance flow only inside the visibly rendered Codex built-in in-app browser; required observations are page render, click/input/scroll interaction, and page-state changes across normal start, JSON runtime-pack import, Script Editor runtime preview, campaign map render, city click, and city-enter continuation.`
- proof_mode:
  - `human-visible-in-app-browser`
- proof_artifacts:
  - `Automated coverage is retained for non-browser requirements. Human-visible Codex in-app browser proof on 2026-07-23 used pointer-level mouse/keyboard/scroll control, then covered normal start, built-in JSON runtime-pack import, and Script Editor runtime preview through campaign map rendering, city click on 濠州, the city-enter continuation prompt, and the resulting city function menu. Earlier system-browser/background automation artifacts remain explicitly excluded from simulated-human proof because the page was not visibly rendered in the Codex built-in in-app browser.`
- fail_closed_check:
  - `Confirmed during closeout review: the queue now claims acceptance only on the landed city-owned placement truth and does not rely on hidden map-node fallback for the observed runtime entrypoints.`
- waiver_basis:
  - `none`
- simulated_human_visibility:
  - `covered`
- interaction_semantics:
  - `Direct interaction proof was completed through visibly rendered Codex in-app browser interaction. Only this proof path is counted for ACC-MAP-ID-006; hidden/background automation remains excluded historically.`

### Closure Routing Record

- `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition is closed locally with no same-family residue. The version remains open with active_queue=none and returns to promotion/version review while the repository-sync gate is still pending.`

### Operator Receipt Record

- receipt_join_status: `success`
- receipt_join_type: `execution-queue`
- receipt_join_queue_id: `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- receipt_reason_code: `admission-routing-required`
- receipt_reason_basis:
  - `MEMO-027 required a new successor version, and the operator explicitly requested admitting this exact queue as the sole active queue.`
- receipt_active_queue: `queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition`
- receipt_active_task: `task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.evidence-anchor-reconcile`
- receipt_queue_goal:
  - `Replace map-owned city marker truth with city-owned map data and land first-stage canonical numeric id generation without rewriting existing ids.`
- receipt_next_step:
  - `Complete evidence-anchor reconcile, then implement city-owned map truth and canonical numeric id transition tasks.`
- receipt_human_action: `none-required`
- receipt_internal_analysis_exposed: `false`

### Progress Log

- `2026-07-22`: `Promoted MEMO-027 into target.map-rendering-city-data-separation-and-canonical-numeric-id-transition after the operator explicitly requested a new version instead of reactivating any older open version.`
- `2026-07-22`: `Created the formal evidence draft, target spec, version plan, active queue doc, and refactor log for MEMO-027.`
- `2026-07-22`: `Admitted queue.map-rendering-city-data-separation-and-canonical-numeric-id-transition immediately as the sole active queue under this version, with task.map-rendering-city-data-separation-and-canonical-numeric-id-transition.evidence-anchor-reconcile as the active task.`
- `2026-07-22`: `Evidence-anchor reconcile is now complete. Source inspection confirmed that campaign map marker truth had already started moving into city.mapPlacement, while remaining risk sits in stale queue truth, residual mapNodeId-dependent consumers, incomplete direct-vs-indirect id-consumer audit, and targeted regression failures. Active execution therefore advances into implementation without widening the queue boundary.`
- `2026-07-22`: `Acceptance accounting was corrected to match Blueprint runtime/browser rules. Earlier system-browser/background automation exploration is no longer counted as simulated-human or human-visible browser proof. ACC-MAP-ID-006 is now recorded as blocked until the Codex built-in in-app browser can be kept visibly rendered on screen for observable interaction.`
- `2026-07-23`: `The current session exposed truthful Codex built-in in-app browser pointer-level control. A visible mouse/keyboard/scroll handshake passed first, then human-visible browser proof covered normal start, built-in JSON runtime-pack import, and Script Editor runtime preview through campaign map rendering, clicking 濠州, confirming city entry, and reaching the city function menu. ACC-MAP-ID-006 is now covered, the queue is closed locally with no same-family residue, and the version returns to promotion/version review with repository sync still pending.`
