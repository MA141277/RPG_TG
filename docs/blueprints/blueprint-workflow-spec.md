# Blueprint Workflow Spec

## 1. Goal

This spec defines the repository's authoritative Blueprint governance model for resumable work under `docs/blueprints/**`.

The model must keep execution truth:

- machine-readable
- single-writer
- resumable after interruption
- separated from historical narrative
- fail-closed against admission and closeout short-circuits

## 2. Scope

This spec applies to:

- `docs/blueprints/project-progress.md`
- `docs/blueprints/blueprint.md`
- `docs/blueprints/classification-rule-layer-spec.md`
- version specs under `docs/blueprints/specs/`
- version plans under `docs/blueprints/plans/`
- queue docs under `docs/blueprints/queues/`
- templates under `docs/blueprints/templates/`
- `tools/lint-blueprints.mjs`
- `docs/change-log.md` only when code, runtime, data compatibility, shared interface, or user-visible behavior changes are recorded there

Old `docs/superpowers/**` workflow docs remain historical or legacy-only reference.

## 3. Canonical Resume Chain

The only legal execution resume chain is:

```text
project-progress -> blueprint -> version plan -> active queue -> active task
```

Rules:

1. `project-progress` is the repository entry document.
2. `blueprint` is the Blueprint index and version registry.
3. `version plan` is the only live governor at version level.
4. `queue doc` is the only live governor at queue level.
5. `version spec` is a boundary and acceptance contract, not a live execution controller.
6. `docs/change-log.md`, old `docs/superpowers/**`, closed queues, and prose history must not be used to infer current execution truth.
7. If `active_queue = none`, resume from the version plan's `resume_gate`.
8. AI must not invent placeholder queues or placeholder tasks.

## 3.1 Evidence Search Priority

Use different search sources for different truth questions.

Rules:

1. For execution truth, routing, admission, closeout, queue status, task status, and next action, read only the canonical resume chain first:
   - `project-progress`
   - `blueprint`
   - active version plan
   - active queue
   - active task
2. For implementation truth, existing mechanisms, interfaces, call flows, data shapes, and actual runtime behavior, search `src/` and `tests/` first.
3. For historical explanation, use the compact record in the current active governance docs first.
4. Open closed queues, old plans, `docs/superpowers/**`, or `docs/change-log.md` only when the current active docs explicitly cite them or when code evidence is insufficient and the file is being used as historical evidence only.
5. Do not use `docs/change-log.md` as a default search target for Blueprint routing, admission, closeout, scheduling, or implementation truth.
6. A version memo is not a candidate queue set. Memo entries may record observations, drafts, or possible future work, but they must not be treated as executable candidates unless an operator explicitly asks to promote, inspect, or modify a memo entry.
7. After a candidate or execution queue completes, the agent must not mine `docs/blueprints/version-memo.md` to decide what to execute next on its own. Memo lookup after queue completion is allowed only when the operator explicitly asks for memo screening, memo promotion, or a named memo/queue review.

## 3.2 Controlled Vocabulary And Status Discipline

Blueprint governance uses controlled field names and controlled values.

Rules:

1. The agent must use only the formal field names, status names, and allowed values defined by this spec, the active Blueprint templates, or the currently governed Blueprint documents.
2. The agent must not invent new governance vocabulary, new pseudo-statuses, new blended status phrases, or new phase labels in order to summarize current truth.
3. For version lifecycle, the only legal `version_status` values are:
   - `open`
   - `closed`
4. Terms such as `done`, `archived`, `closeout-ready`, `closeout review`, `completed-but-open`, or any similar agent-invented wording are forbidden as version-status replacements, surrogate states, or implicit lifecycle labels unless a future formal spec explicitly adds them.
5. `decision_state` is not a substitute for `version_status`. Combinations such as `open + promotion-review` are explanatory compositions of two formal fields, not third statuses.
6. If current governance needs a concept that is not represented by an existing formal field or allowed value, the agent must not improvise a new status word. It must either:
   - describe the situation using existing formal fields only; or
   - update the governing spec/template first through an explicit governance change.

## 4. Single-Writer Truth Model

### 4.1 `project-progress.md`

Owns only:

- repository resume entry
- current Blueprint pointer
- current version pointer
- whether an active queue exists
- next jump file
- repository entry action

Must not own:

- `decision_state`
- `version_status`
- queue-local task state
- queue-local narrative
- redundant completed queue registries
- any live truth already owned downstream

### 4.2 `blueprint.md`

Owns only:

- version registry
- current active version pointer
- current version plan pointer
- classification / routing references
- repository execution mode

Must not own:

- `decision_state`
- `version_status`
- active task truth
- queue-local execution detail
- live queue truth derivable from the version plan
- drift-prone completed version registries

### 4.3 version spec

Owns only:

- version goal
- scope
- non-goals
- acceptance criteria
- queue portfolio
- version closeout contract

The version spec queue portfolio must stay contract-only. It must not mirror runtime queue status or queue document source pointers.

Must not own:

- `version_status`
- `decision_state`
- active queue
- active task
- current task instructions
- queue-local execution interpretation

### 4.4 version plan

The version plan is the only live governor for:

- `version_status`
- `active_phase`
- `active_queue`
- `candidate_queue_ids`
- `candidate_backlog_refresh_status`
- `candidate_backlog_snapshot`
- `candidate_backlog_scan_sources`
- `decision_state`
- `next_decision`
- `next_action`
- `resume_gate`
- `post_queue_closeout_pause_policy`
- `promotion_review_result`
- `review_subject_id`
- `review_subject_classification`
- `proposed_queue_id`
- `review_basis`
- `admission_status`
- `intake_status`
- `intake_item_id`
- `intake_summary`
- `intake_result`
- `intake_feedback_mode`
- `closure_review_subject`
- `closure_review_status`
- `residue_candidate_id`
- `residue_candidate_family`
- `routing_basis`
- `next_lawful_queue_recommendation`
- `auto_admission_ready`
- `stop_reason`
- `stop_basis`
- `next_unblocked_action`
- `human_input_required`
- `candidate_backlog_refresh_status`
- `candidate_backlog_snapshot`
- `candidate_backlog_scan_sources`
- queue promotion / hold / reopen / closeout conclusions
- version-level closeout decision

### 4.5 queue doc

The queue doc is the only live governor for:

- `queue_status`
- `active_task`
- `next_task`
- task ordering
- queue closeout conditions
- queue-local progress record
- queue snapshot summary for operator-facing visibility
- queue-level verification
- `closeout_status`
- `execution_closeout_status`
- `topic_closure_status`
- `closure_basis`
- `residue_remaining`
- `residue_family`
- `residue_routing_status`
- `next_family_candidate`
- `auto_continue_eligible`
- `next_effect`

### 4.6 `docs/change-log.md`

`docs/change-log.md` is a code and behavior change log only.

It may record:

- production code behavior changes
- runtime, save, export, import, schema, or data compatibility changes
- user-visible editor or gameplay changes
- shared interface or migration strategy changes that affect implementation consumers

It must not record by default:

- Blueprint queue promotion
- Blueprint queue or version closeout narration
- plan / queue field synchronization
- repository sync status
- governance-only template wording changes
- historical summaries already owned by version plans, queue docs, or commit messages

It must not act as:

- live execution truth
- resume entry
- promotion gate
- closeout gate
- active queue / active task controller
- fixed synchronization step in governance closeout

## 5. Control Block Authority

Executable truth must come from `## Control Block`.

Human Context may explain decisions, but it must not introduce executable next-step authority that is absent from the Control Block.

The following fields must be structured whenever they are needed:

- `entry_action`
- `next_action`
- `resume_gate`
- `post_queue_closeout_pause_policy`
- `closeout_status`
- `next_effect`
- `promotion_review_result`
- `review_subject_id`
- `review_subject_classification`
- `proposed_queue_id`
- `review_basis`
- `admission_status`
- `closure_review_subject`
- `closure_review_status`
- `residue_candidate_id`
- `residue_candidate_family`
- `routing_basis`
- `next_lawful_queue_recommendation`
- `auto_admission_ready`
- `candidate_backlog_refresh_status`
- `candidate_backlog_snapshot`
- `candidate_backlog_scan_sources`
- `execution_closeout_status`
- `topic_closure_status`
- `closure_basis`
- `residue_remaining`
- `residue_family`
- `residue_routing_status`
- `next_family_candidate`
- `auto_continue_eligible`

## 6. Live vs Historical Separation

Every governance document may contain only one live state zone:

- `## Control Block`

Historical sections must be explicitly marked with historical or archival wording, for example:

- `Historical Snapshot (YYYY-MM-DD)`
- `Prior Promotion Record`
- `Closed Review Record`
- `Historical Handoff Note`
- `Historical Candidate Notes`
- `Closeout Decision`
- `Historical Interpretation`
- `Historical Task Ledger`
- `Progress Log`

These sections are allowed only when they summarize already-recorded work and do not impersonate current executable control.

Active version plans and active queue docs should keep historical sections compact. Long promotion chains, detailed per-task history, and superseded sync narration should be summarized in the active file and left in the owning closed queue docs or commit history for full evidence.

Historical sections must not use instruction-like labels such as:

- `Current ...`
- `Current active ...`
- `Resume execution ...`
- `Now do ...`

`Resume ...` phrasing is allowed only inside:

- the current active version plan live area
- the current active queue live area

Closed queues, closed targets, historical notes, and `docs/change-log.md` must not contain text that reads like a current execution command.

## 7. Queue Admission Startup Rules

### 7.1 Standard startup for a fresh queue item

The first step for a fresh queue-worthy item is not queue creation and not implementation.

Plain-language operator requests are valid intake inputs. For fresh queue intake, the operator-facing minimum input is:

- `新需求`
- `参考治理规范`

Blueprint must internalize the governance mechanics that follow from that input rather than forcing the operator to manually drive `item.xxx`, candidate, review, or admission fields.

The mandatory startup order is:

1. read the current truth chain:
   - `project-progress`
   - `blueprint`
   - current version plan
   - active queue if one exists
2. check whether an active queue already exists
3. decide whether the new item can be absorbed inside that active queue without widening queue scope
4. classify the item
5. if classification is `queue-candidate`, return to version-level admission
6. sync the version plan admission review fields
7. only after version-level admission sync may the admitted queue doc be created and activated
8. only after the queue doc exposes `queue_status = active` plus a written `active_task` may implementation begin
9. if implementation does not begin immediately, emit the fixed operator receipt contract rather than exposing Blueprint internal analysis by default

If any earlier step is incomplete, the queue startup must stop there.

### 7.1.1 Fixed operator receipt contract

Unless the operator explicitly asks for internal Blueprint analysis, the default output for fresh intake must be the fixed receipt below and nothing more detailed:

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

Hard rules:

1. `当前执行情况` must be derived from live truth, not guessed prose.
2. The fixed receipt is the default for absorb, candidate-record, and admission-routing outcomes.
3. Default intake output must not expose truth-chain detail, candidate set, ranking process, `Why Not The Others`, `Human Involvement Boundary`, or raw admission fields.
4. Those internal details may be expanded only when the operator explicitly asks for Blueprint internal analysis.

### 7.1.2 Operator Receipt Schema

The fixed operator receipt must also be writable as structured governance-facing output fields rather than prose-only narration.

Required receipt fields:

- `receipt_join_status`
- `receipt_join_type`
- `receipt_join_queue_id`
- `receipt_reason_code`
- `receipt_reason_basis`
- `receipt_active_queue`
- `receipt_active_task`
- `receipt_queue_goal`
- `receipt_next_step`
- `receipt_human_action`
- `receipt_internal_analysis_exposed`

Allowed `receipt_join_status` values:

- `success`
- `failed`
- `success-already-recorded`

Allowed `receipt_join_type` values:

- `execution-queue`
- `candidate-queue`
- `not-added`

Allowed `receipt_reason_code` values:

- `absorbed-into-active-queue`
- `recorded-as-candidate`
- `admission-routing-required`
- `active-queue-already-exists`
- `candidate-only-not-admitted`
- `blocked-by-governance-truth`
- `rejected-by-scope-or-evidence`
- `none`

Allowed `receipt_human_action` values:

- `none-required`
- `confirmation-required`
- `wait-for-blocker`

Allowed `receipt_internal_analysis_exposed` values:

- `false`
- `true`

Hard rules:

1. The structured receipt fields must agree with the operator-facing receipt text when both are present.
2. `receipt_reason_code` must come from the allow-list above; freeform explanation belongs in `receipt_reason_basis`, not in the code field.
3. `receipt_internal_analysis_exposed = false` is the default unless the operator explicitly asked for Blueprint internal analysis.
4. `receipt_active_queue`, `receipt_active_task`, and `receipt_queue_goal` must come from current live truth when an active queue exists; otherwise they must explicitly record `none`.

### 7.2 Mandatory admission before fresh implementation

Any fresh implementation item that is classified as `queue-candidate` must complete version-level admission before implementation starts.

Hard rules:

1. If `active_queue = none`, no fresh implementation may begin directly.
2. If classification concludes `queue-candidate`, the agent must return to version-level admission review before code implementation.
3. The agent must not begin implementation while either of these is still missing:
   - the version plan Control Block does not yet record the admission review truth
   - the admitted queue doc does not yet exist and expose active execution truth
4. A queue-candidate may be discussed, audited, or scoped before admission, but that is not implementation authorization.

### 7.3 No-from-scratch recheck rule

Once a queue-candidate has already been structurally recorded in version-level truth, later handling must resume from that admission record by default rather than restarting a full repository-wide re-audit.

Resume from the recorded admission record when all are true:

1. the candidate identity still matches the recorded `review_subject_id` or an equivalent candidate ledger entry
2. the previous `review_subject_classification`, `proposed_queue_id`, and `review_basis` still fit the current evidence
3. no new material evidence invalidates the old admission basis

Only re-open a full recheck when new material evidence:

- invalidates the old classification
- invalidates the prior admission basis
- proves the item can now be absorbed by the current active queue
- proves the item no longer belongs to the current version

Restarted queue handling is still candidate handling until admission is legal.

Hard rules:

1. if a restarted queue or restarted queue-worthy item requires document updates, write those updates into the version plan candidate ledgers first
2. after those document updates, place the restarted queue into the candidate queue set rather than the execution queue
3. restarting a queue must not stop, replace, or preempt the current active execution queue
4. the restarted queue may become active only after the current active queue closes and version-level admission review lawfully promotes it

### 7.3.1 Candidate Recheck Trigger Allow-List

Candidate recheck must use an allow-list rather than ad hoc prose.

Allowed `recheck_trigger_type` values:

- `new-material-evidence`
- `active-queue-absorption-changed`
- `parent-spec-updated`
- `acceptance-ownership-changed`
- `implementation-anchor-changed`
- `candidate-version-membership-changed`
- `operator-explicit-recheck`
- `none`

Hard rules:

1. A candidate queue must not be fully re-audited from scratch unless `recheck_trigger_type != none`.
2. `recheck_trigger_basis` must summarize the concrete evidence that justifies the recheck.
3. `operator-explicit-recheck` authorizes a recheck, but it does not authorize direct promotion to execution without admission.
4. If no allow-list trigger applies, candidate handling must resume from existing ledger truth.

### 7.3.2 Candidate Reject-Or-Split Reason Allow-List

Candidate admission and candidate evidence review must record reject-or-split reasons structurally.

Allowed `reject_or_split_reason` values:

- `missing-implementation-anchor`
- `missing-acceptance-ownership`
- `scope-too-broad-needs-split`
- `parent-capability-not-structurally-covered`
- `anti-over-narrowing-structure-missing`
- `prerequisite-queue-required`
- `conflicts-with-active-queue-boundary`
- `belongs-to-other-version-or-target`
- `parent-spec-update-required`
- `none`

Hard rules:

1. `reject_or_split_reason` must come from the allow-list above; detailed explanation belongs in `reject_or_split_basis`.
2. A candidate queue that is rejected or split must identify the smallest concrete structural reason rather than generic prose such as "needs more work".
3. `scope-too-broad-needs-split` is required when one broad requirement cannot be lawfully admitted as a single queue without losing parent capability coverage.
4. `anti-over-narrowing-structure-missing` is required when the candidate lacks the fields needed to prove capability floor, user-path coverage, replacement proof, or meaning preservation.
5. `parent-spec-update-required` is required when candidate legality depends on changing the parent contract before admission can continue.

### 7.4 Required write order for admission

When a `queue-candidate` is admitted, write truth in this order before implementation:

1. version plan admission review fields
2. version plan review conclusion sufficient to justify activation
3. admitted queue doc Control Block
4. version plan `active_queue` / `decision_state` / `next_action`
5. blueprint if affected
6. project-progress if affected

Only after those documents agree may implementation begin.

Clarifications:

1. version-plan review sync must happen before queue activation
2. queue creation must not be used as a substitute for version-level admission review
3. a queue doc must not expose `queue_status = active` or a live `active_task` before the version plan already carries the matching review subject and basis

### 7.5 Scope approval is not admission

User approval of bounded scope is not equivalent to queue admission.

The following must remain distinct:

- `scope approval`
  - user agrees the proposed boundary is acceptable
- `admission`
  - version plan records the review subject, proposed queue, basis, admission result, and active execution truth

Phrases such as:

- `按这个范围做`
- `可以`
- `继续推进这个范围`

may authorize scope, but they must not be treated as a substitute for target-plan admission or queue activation.

### 7.6 Single-active-queue restriction

If the Blueprint Control Block says:

- `execution_mode = single-active-task`
- `allow_parallel = false`

then only one active queue may exist at a time.

Rules:

1. if an active queue already exists, a fresh item must first be tested for absorption into that queue
2. if the item cannot be absorbed, it may be classified and recorded as a candidate, but it must not be activated as a second queue
3. if a restarted queue or re-opened queue item cannot be absorbed, it must also be recorded as a candidate for later rather than promoted directly to execution
4. the version plan must not keep a live admission review subject while another queue remains active
5. the agent must wait for current queue closeout and return to version-level review before activating a new queue

When an active queue exists, the fixed operator receipt must still explain whether the fresh item was absorbed or converged into a candidate queue, and it must include the current queue snapshot needed for operator visibility.

## 8. Classification Trace Rules

### 8.1 Structured trace is mandatory when active truth changes

Any classification result that changes or may change active truth must be recorded in structured governance truth.

It is illegal to stop at conversation-only conclusions such as:

- `this belongs to queue.x`
- `this should be current version work`
- `this needs promotion review`

without syncing the corresponding version plan admission fields.

### 8.2 Required admission-review fields in the version plan

The version plan must structurally carry the current admission review subject through at least:

- `review_subject_id`
- `review_subject_classification`
- `proposed_queue_id`
- `review_basis`
- `admission_status`

Allowed `admission_status` values:

- `none`
- `pending`
- `admitted`
- `rejected`
- `deferred`
- `blocked`

If no admission review is active, these fields must explicitly return to `none`.

### 8.3 Review object semantics

- `review_subject_id`
  - the item currently under version-level review
- `review_subject_classification`
  - the structured classification driving the review
- `proposed_queue_id`
  - the queue being considered, or `none`
- `review_basis`
  - the evidence basis justifying the review
- `admission_status`
  - the current formal disposition of the review subject

These fields exist so admission, reject, defer, and block outcomes do not fall back to prose.

### 8.4 Candidate recovery record

The version plan must also keep a structured candidate recovery record for previously reviewed queue-candidates.

This record may live in a ledger table or equivalent structured section, but it must preserve at minimum:

- candidate id
- last classification
- proposed queue id
- latest disposition
- recheck trigger

The purpose is to allow later sessions to resume from existing admission evidence instead of repeating a from-scratch audit.

### 8.4.1 Admission Review Is Internal Governance Work

Once a `queue-candidate` has already been structurally recorded in current version truth, admission review is an internal Blueprint execution step rather than a default human confirmation point.

Rules:

1. If the parent spec already defines the capability, prerequisite queue closeout satisfies the admission rule, and the next queue can proceed without changing the parent total spec, deleting or downgrading capability, or rewriting out-of-scope as retired, the agent must record the admission conclusion and continue.
2. If admission review finds a gap required for the next queue to run and that gap remains inside the parent spec, record it as an in-queue temporary gap fill or prerequisite routing decision and continue rather than asking for human confirmation.
3. If a current-version queue completeness audit finds an in-parent-spec gap, over-narrowing risk, or missing inherited capability, treat that finding as execution input rather than a default human confirmation point.
4. Such findings must be recorded as one of:
   - in-queue temporary gap fill
   - prerequisite routing decision
   - closeout blocker
   - final-guard evidence
   - same-family residue
   - cross-family residue
   - accepted residue
5. Admission review or queue audit may stop for human input only when blocker or stop-condition rules elsewhere in this workflow explicitly allow it.

### 8.4.2 Structured Stop Record

If the agent stops, pauses, or asks for human input while current governance truth still has a live queue, a pending candidate, or a uniquely lawful next governance action, the stop must be recorded structurally in the current version plan before the response ends.

Blueprint stop legality is defined by an allow-list, not by enumerating forbidden intermediate states.

The stop record must carry at minimum:

- `stop_reason`
- `stop_basis`
- `next_unblocked_action`
- `human_input_required`

Allowed `stop_reason` values:

- `none`
- `version-closeout-confirmation`
- `explicit-answer-only`
- `real-blocker`
- `outside-parent-spec`
- `parent-spec-change`
- `capability-downgrade-risk`
- `retired-rewrite-risk`
- `product-decision`

Rules:

1. `stop_reason = none` means the agent should continue automatically when other workflow rules allow continuation.
2. `stop_reason = version-closeout-confirmation` is the normal structured reason for the one allowed version-closeout confirmation question.
3. `real-blocker` must refer to a concrete blocker, such as missing external state, conflicting evidence that cannot be adjudicated independently, or a required action the agent cannot lawfully perform from current truth.
4. `product-decision` is legal only when two or more mutually exclusive lawful branches remain and choosing among them would change active truth.
5. `stop_basis` must summarize the concrete evidence or rule that makes the stop lawful; it must not be left implicit in prose history.
6. `next_unblocked_action` must name the next governance action expected after the blocking input or confirmation is received.
7. `human_input_required = true` is legal only when `stop_reason != none`.
8. A stop is lawful only when current truth can be mapped to one of the allowed `stop_reason` values above; if it cannot, the agent must continue.
9. Forbidden-stop examples elsewhere in this workflow are explanatory guardrails, not the primary legal test.

## 8.5 Evidence-Bound Version Creation

New versions must be created from a lightweight operator draft plus AI-generated evidence, not from a prose target directly.

Operator-facing drafting instructions live in:

- `docs/blueprints/version-authoring-guide.md`

The operator-owned input is a `Version Draft`. It should contain only:

- one goal statement
- required outcomes
- explicit non-goals
- compatibility paths that must be preserved
- legacy structures or behaviors that must be replaced
- reference material such as memos, PRDs, bugs, prior queues, or optional code paths

The AI-owned expansion is a `Version Evidence Draft`. Before writing a formal version spec or version plan, the agent must generate and present a concise evidence summary for operator review.

The evidence draft must include:

- draft requirement coverage
- acceptance matrix
- candidate queue evidence matrix
- implementation anchors
- legacy paths to replace
- compatibility paths to preserve
- queue claim boundaries
- first queue recommendation
- high-risk drift points

The operator reviews intent and boundary only. The operator does not need to audit every Control Block field, task command, or markdown detail.

Allowed operator responses:

- `confirm`
- `adjust-goal`
- `adjust-queues`
- `adjust-first-queue`
- equivalent plain-language instructions

Formal version specs and plans must be generated only from a reviewed evidence draft. If the operator supplies only a broad version idea, the agent must create the evidence draft first and must not admit or implement a queue from the broad idea directly.

## 8.6 Acceptance Matrix Rules

Every formal version spec must expose an acceptance matrix in addition to prose acceptance criteria.

Each acceptance item must have:

- `acceptance_id`
- requirement summary
- primary owner queue
- proof type
- expected implementation anchor
- closeout blocker rule

Rules:

1. Every required outcome from the Version Draft must map to at least one acceptance item.
2. Every compatibility-preserve item must map to at least one compatibility acceptance.
3. Every must-replace item must map to at least one replacement or migration acceptance.
4. Every acceptance item must have exactly one primary owner queue.
5. Supporting queues may be named, but they must not replace the primary owner.
6. Final validation queues must not be the primary owner for normal implementation acceptance; they prove coverage after owner queues land.
7. A version cannot close while a required acceptance is uncovered, unowned, or only prose-claimed.

## 8.7 Candidate Evidence Matrix Rules

Every candidate queue in a version plan must carry enough evidence to prevent document-only queue generation.

For each candidate queue, the version plan must record:

- candidate id
- proposed queue id
- acceptance refs
- source document refs
- implementation anchor refs
- legacy paths to replace
- compatibility paths to preserve
- can-claim acceptance refs
- cannot-claim acceptance refs
- reject or split conditions

Rules:

1. A candidate queue with no implementation anchor is not executable. It may only be recorded as `uncertain-needs-review` or converted into an evidence-gathering queue.
2. A candidate queue must not be admitted if its acceptance refs are missing or conflict with another queue's primary ownership.
3. A queue that only proves a seam, adapter, fail-closed guard, or materializer must not claim broader version acceptance unless the acceptance matrix explicitly makes that seam the acceptance.
4. Candidate recovery must resume from the evidence matrix when it exists; do not restart broad audits without new material evidence.

### 8.7.1 Split Candidate Spec Integrity

When a new operator requirement is added to Blueprint and must be split into multiple candidate subqueues, the requirement-related document is the parent spec source, not an implementation plan.

Requirement-related document means one of:

- operator draft
- version memo entry
- PRD
- bug report
- approved design note
- formal version spec

Hard rules:

1. A broad requirement document must not be converted into one concrete execution plan when evidence shows multiple independent subqueues are required.
2. Split candidate subqueue specs must preserve the parent requirement's total contract.
3. A subqueue must not over-narrow the function surface only because the local implementation slice is smaller.
4. A subqueue should expand unspecified implementation details as much as the parent spec reasonably allows, but must not drift beyond, contradict, or run sideways from the parent spec.
5. Any subqueue that discovers the parent spec is wrong, incomplete, or impossible must stop and update the parent spec first, then update every affected candidate queue and evidence matrix entry.
6. No subqueue may change the parent requirement by shrinking scope.
7. No subqueue may delete an unimplemented capability by declaring it unsupported.
8. No subqueue may convert an `out-of-scope` item into `retired`, `removed`, or `unsupported` unless the parent spec is updated first and affected queues are reconciled.
9. If a subqueue cannot implement a capability it inherited, it must record the gap as residue, prerequisite, blocker, or successor candidate; it must not erase the capability from the total spec.

Required split review:

1. After candidate subqueues are split, the agent must perform an AI completeness review before admission.
2. The review must compare the subqueues against the parent requirement document and list:
   - parent capabilities covered by each subqueue
   - parent capabilities not yet owned
   - risks of over-narrowing
   - drift risks beyond the parent requirement
   - required follow-up candidate queues or parent-spec updates
3. The split is incomplete if any parent required outcome, compatibility path, legacy replacement, or explicit non-goal is missing from all subqueues and not intentionally waived in the parent spec.
4. The review result must be recorded in the version plan Candidate Evidence Matrix, Candidate Recovery Ledger, or an explicitly referenced spec/review document.

### 8.7.2 Queue Spec Anti-Over-Narrowing Contract

Blueprint must reject queue specs that can succeed only by shrinking the parent capability surface down to the smallest currently convenient implementation slice.

Minimum queue-spec contract:

- parent inherited capabilities
- parent compatibility paths
- parent legacy replacements
- queue `Can Claim`
- queue `Cannot Claim`
- `Capability Floor`
- `User Path Coverage Matrix`
- `Functional Loss Budget`
- `Replacement Proof`
- `Completion Completeness Review`

Hard rules:

1. A queue title, task list, or local implementation seam must not become the de facto requirement if the parent spec clearly defines a broader user-facing or runtime-facing capability surface.
2. If a queue implements only one sub-surface of a broader capability, the queue spec must explicitly identify:
   - which parent capabilities it owns closing
   - which parent capabilities it must preserve but does not own closing
   - which parent capabilities are routed to another queue, residue path, blocker, or explicit waiver
3. A queue spec is invalid if it can be read as "implement the smallest reachable path and call the rest out-of-scope" while the parent spec still requires the broader capability.
4. A queue spec must not silently collapse multi-entry, multi-trigger, preview/runtime/export/import, or recovery-path obligations into one representative path unless the parent spec explicitly narrows the requirement first.
5. Admission review must treat missing queue-spec integrity records as a queue-authoring defect, not as permission to proceed with an underspecified queue.
6. Queue closeout must be denied when the queue doc still lacks the structure needed to prove that broader inherited behavior survived the bounded implementation.
7. Queue authoring must use a required-structure allow-list. If the queue spec omits a required structure relevant to the parent capability, the queue is not admission-ready even if implementation anchors already exist.
8. "One working path" is never enough by itself when the parent capability spans multiple semantic surfaces, user paths, trigger times, trigger contexts, or editor/runtime/export/import seams.
9. A queue spec must name the parent-facing meaning it preserves. Local implementation terminology must not silently redefine creator-facing meaning, runtime meaning, or content-authoring meaning inherited from the parent spec.
10. If the queue replaces an old owner, old field family, old routing family, or old content family, the spec must prove both the new owner path and the old owner exit condition. Partial replacement without old-truth exit proof is not complete queue authoring.

### 8.7.3 Queue Spec Required-Structure Allow-List

Queue specs must be authored from a positive required-structure list, not only from a title and task list.

Required structures for any admitted execution queue:

- parent inherited capabilities
- parent compatibility paths
- parent legacy replacements
- `Can Claim`
- `Cannot Claim`
- `Capability Floor`
- `Parent Capability Coverage`
- `Over-Narrowing Guard`
- `User Path Coverage Matrix`
- `Functional Loss Budget`
- `Implementation Anchors`
- `Verification Coverage`
- `Replacement Proof`
- `Completion Completeness Review`

Additional structures become mandatory when relevant to the parent capability:

- creator-facing meaning preservation
- runtime meaning preservation
- trigger timing coverage
- trigger-context coverage
- authoring / preview / runtime / export / import / loader consistency coverage
- alternate-entry / recovery / follow-up / fail-closed coverage
- old-truth-owner exit proof

Hard rules:

1. Admission review must reject a queue spec that lacks any required structure relevant to the admitted boundary.
2. Relevance is determined from the parent spec, acceptance matrix, inherited capability surface, and replacement path, not from the narrowest current implementation seam.
3. If the parent spec spans creator-facing meaning plus runtime path, the queue spec must cover both; it is invalid to describe only implementation anchors or only one UI path.
4. If the parent spec spans trigger timing or trigger context, the queue spec must name those dimensions explicitly; it is invalid to treat one trigger point as representative unless the parent spec narrows first.
5. If the parent spec spans editor/runtime/export/import/preview/loader consistency, the queue spec must declare which of those surfaces it owns closing, which it preserves, and which are routed elsewhere.
6. If the queue migrates, retires, or replaces an older mechanism, the queue spec must include old-owner exit proof and must not pass on "new path exists" alone.
7. Missing structure must be repaired by queue-spec revision, parent-spec revision, or candidate split before implementation begins. It must not be deferred as an unspoken reviewer expectation.

## 8.8 Evidence Lock Before Queue Activation

Before any candidate queue becomes active, the agent must perform an Evidence Lock review.

Evidence Lock records:

- `evidence_lock_status`: `pending | locked | blocked`
- `implementation_anchor_status`: `confirmed | missing | conflicting`
- `prerequisite_status`: `ready | needs-prior-queue | split-required`
- `acceptance_claim_scope`
- `acceptance_not_claimed`
- `must_inspect`
- `must_modify`
- `must_replace`
- `must_preserve`
- `minimum_verification`

Rules:

1. The Evidence Lock may be a dedicated pre-activation review in the version plan or the first task of an already-started queue.
2. If implementation anchors are missing, the queue must not proceed into feature implementation.
3. If prerequisites are missing, the queue must return to version review or split the prerequisite queue.
4. If the queue can only close a smaller slice than its name implies, the claim boundary must be corrected before implementation starts while preserving the parent spec. Unclaimed required capability must be routed to another queue, recorded as residue, or returned to version review; it must not be silently removed from the total requirement.
5. Existing active queues may be repaired by adding an `evidence-anchor-reconcile` task before further implementation.
6. Evidence Lock must confirm that the queue's `Capability Floor`, `User Path Coverage Matrix`, and `Functional Loss Budget` are specific enough to detect functional loss outside the queue's primary happy path.
7. If Evidence Lock cannot name the non-primary paths, inherited capability floor, or replacement proof obligations needed to guard against over-narrowing, the queue must be blocked or revised before feature implementation begins.

## 8.9 Queue Claim Boundary

Every active execution queue must state what it can and cannot claim.

Required queue sections:

- `Can Claim`
- `Cannot Claim`
- `Capability Floor`
- `Legacy Paths To Replace`
- `Compatibility Paths To Preserve`
- `Implementation Anchors`
- `User Path Coverage Matrix`
- `Functional Loss Budget`
- `Verification Coverage`

Rules:

1. `Can Claim` may list only acceptance ids owned by the queue.
2. `Cannot Claim` must list related version acceptance that remains outside the queue.
3. Queue closeout can close only the acceptance ids listed in `Can Claim`.
4. If implementation lands only a seam or guard, closeout must say so and route remaining acceptance through residue.
5. Queue residue classification must compare landed behavior against the claim boundary, not the queue title.
6. `Cannot Claim` and `Out Of Scope` entries are not retirement authority. They mean another owner, later queue, parent-spec update, accepted residue, or explicit waiver is required.
7. A queue may not mark a capability unsupported, retired, or removed merely because it is outside that queue's local implementation boundary.
8. If queue implementation proves an inherited capability should be removed, the parent spec must be updated first, all affected candidate queues must be reconciled, and only then may a queue treat that capability as retired.
9. `Capability Floor` must name the inherited functional surfaces that this queue is not allowed to delete, degrade, or silently narrow while implementing its local slice.
10. `User Path Coverage Matrix` must name the concrete user-visible paths and regression-sensitive paths needed to judge whether the queue preserved real functionality rather than only a smallest happy path.
11. `Functional Loss Budget` must default to `zero`. Any non-zero functional loss must be explicitly routed as waiver or accepted residue in parent/version truth; it must not be implied by a narrower implementation.
12. If a queue replaces, migrates, or relocates a capability, it must provide replacement proof that names the previous owner/path, the new owner/path, the behavior-preservation expectation, and the verification evidence for the replacement.
13. A seam, adapter, shell, guard, materializer, or fail-closed implementation slice must not claim broader user-facing semantics unless the acceptance matrix explicitly makes that narrower slice the real acceptance surface.
14. If the parent spec names creator-facing meaning, runtime meaning, or cross-surface consistency obligations, the queue spec must preserve that meaning explicitly rather than assuming the local implementation shape can redefine it.
15. `User Path Coverage Matrix` must be written at the same semantic level as the parent requirement. It is invalid to list only one UI button, one test fixture, or one internal entrypoint when the parent capability clearly spans more than that.
16. `Replacement Proof` must prove not only that the new path exists, but also that the old truth owner is no longer the required route unless the parent spec explicitly preserves both.

### 8.9.0 Functional Integrity Guard

Queue specs must prevent a bounded implementation slice from passing by preserving only the smallest currently working path while silently losing surrounding functionality.

Required queue-local integrity records:

- `Capability Floor`
- `User Path Coverage Matrix`
- `Functional Loss Budget`

Required rules:

1. `Capability Floor` must enumerate the parent-spec capabilities, interaction families, or runtime obligations that must still work after this queue closes even if they are not the primary `Can Claim` owner.
2. `User Path Coverage Matrix` must include, where applicable:
   - primary entry paths
   - alternate entry/import/preview/startup paths
   - leave/return/recovery paths
   - empty/no-data/fail-closed paths
   - rejection/blocked/error-handling paths
3. A queue must not rely on one representative happy path as proof that the broader functional surface remains intact when the parent spec or queue surface clearly implies multiple user-visible paths.
4. `Functional Loss Budget = zero` means the queue may not knowingly remove or degrade any inherited functional path without explicit parent/version acceptance.
5. If a functional path is intentionally not preserved in the current queue, the path must be recorded as:
   - another queue's owned acceptance
   - same-family residue
   - cross-family residue
   - blocker
   - accepted residue or waiver
6. It is illegal to let a queue appear complete when a user-visible path has been replaced by a static placeholder, unreachable action, disconnected route, or behavior that only survives through legacy fallback.

### 8.9.1 Queue Completion Completeness Review

Every completed execution queue must include an AI completeness review before closeout is claimed.

The queue completion review must evaluate:

- whether the implemented work satisfies the queue's `Can Claim` surface
- whether inherited parent-spec capability was over-narrowed
- whether any missing capability was incorrectly treated as unsupported
- whether `Cannot Claim` / `Out Of Scope` items were correctly routed rather than retired
- whether the verification evidence covers the queue's functional claim, not only a representative happy path
- whether the `Capability Floor` remained intact
- whether the `User Path Coverage Matrix` still holds through real reachable behavior
- whether any functional loss occurred despite the queue's claimed narrow scope
- whether any replacement or migration claim has written replacement proof rather than prose-only handoff language

Bounded gap-fill rule:

1. If the review finds gaps, the agent must rank them by functional importance and risk.
2. The agent may perform at most one gap-fill pass for the same queue before closeout.
3. The gap-fill pass must target the highest-priority missing items that fit the admitted queue boundary.
4. The gap-fill pass must not turn into unlimited scope expansion.
5. Gaps that remain after the one permitted pass must be recorded as residue, blockers, accepted residue, or successor candidate queues according to their severity.
6. A queue cannot close as topic-complete if a remaining same-family gap still blocks the claimed capability.
7. A queue cannot close as functionally preserved if the functional-loss audit still shows lost entry paths, unreachable follow-up paths, placeholder-only behavior, or legacy-only survival of the claimed path.
8. A queue cannot pass completeness review merely because one golden path works if inherited alternate paths, trigger paths, preview/runtime paths, import/export paths, or recovery paths are still unverified, broken, or silently narrowed.

### 8.9.1A Execution Self-Review Gate

Before an agent may mark an implementation task, admission review, queue closeout review, or version closeout review as complete, it must write a structured self-review against current governance truth and code/runtime evidence.

Required self-review fields:

- review_scope
- version_acceptance_alignment
- parent_spec_alignment
- queue_claim_alignment
- over_narrowing_check
- residue_or_blocker_routing_check
- verification_adequacy_check
- next_lawful_action_check

Hard rules:

1. The self-review is mandatory for:
   - implementation-task completion
   - queue closeout review
   - version-level admission review completion
   - version closeout review
2. The self-review must compare claimed completion against:
   - the controlling parent spec
   - the current version acceptance matrix
   - the queue claim boundary
   - actual implementation or runtime evidence
3. A prose-only statement such as "looks complete", "main path works", or "already synced" is not a valid self-review.
4. If the self-review finds misalignment, the result must route to gap fill, residue, blocker, candidate split, or parent-spec update before completion may be claimed.
5. The self-review must explicitly confirm that the claimed next action is the uniquely lawful next action under current governance truth; if not, completion must not silently hand off.

### 8.9.1B Runtime And Browser Acceptance Gate

When a queue changes user-facing UI, editor authoring behavior, import/export behavior, runtime trigger flow, preview behavior, or editor-authored runtime data, automated source checks are not sufficient by themselves.

In those cases, queue closeout and version closeout must include a structured runtime/browser acceptance gate unless an explicit recorded waiver explains why equivalent non-browser evidence is sufficient.

Required gate fields when applicable:

- gate_required
- covered_surfaces
- interaction_path
- proof_mode
- proof_artifacts
- fail_closed_check
- waiver_basis

Hard rules:

1. `gate_required = true` whenever the claimed completion touches any of:
   - visible UI behavior
   - creator-facing editor behavior
   - preview/runtime parity
   - import/export round-trip behavior
   - trigger timing or trigger-context behavior
   - runtime routing that must be observed through real interaction
2. `proof_mode` must name the strongest available proof path, such as in-app browser interaction, runtime execution trace, test harness with visible output, or an explicitly justified equivalent.
3. If local browser interaction is available, the gate must use the built-in in-app browser path for interaction proof rather than an external browser or source-only reasoning.
4. If `proof_mode` claims simulated-human, browser-interaction, or equivalent UI proof, that proof must be human-visible and human-observable by default rather than a hidden or background-only automation run.
5. Human-visible browser proof means:
   - the built-in in-app browser surface is visibly rendered on screen
   - the interactive target can be seen in that surface
   - the click/input/scroll path can be observed while it happens
6. Simulated-human proof must not be claimed from any of the following by themselves:
   - direct business-function invocation
   - direct state mutation
   - non-visible background automation
   - script-only success where the UI path itself was not visibly exercised
7. If a tool is used to automate interaction, its role is to execute visible pointer/keyboard/scroll interaction on the rendered UI path rather than bypassing the interaction path.
8. External visible browsers do not satisfy this gate when built-in in-app browser proof is required. If built-in in-app browser proof is unavailable, the gate must not describe the result as simulated-human proof; it must fall back to another truthful `proof_mode` or record a waiver/blocker.
9. `proof_artifacts` must identify the concrete evidence used, such as commands, screenshots, traces, reports, or test cases.
10. `fail_closed_check` must state how the covered behavior responds when required data, binding, or trigger prerequisites are absent.
11. If the gate is waived, `waiver_basis` must state why browser/runtime interaction proof is unnecessary or currently impossible and what evidence replaces it.
12. A queue or version must not claim UI/runtime completion on source-only evidence when the covered behavior is materially interaction-dependent.

### 8.9.2 Closeout Status Semantics

Queue closeout status fields must use consistent meaning across all queue docs.

`execution_closeout_status` semantics:

- `done`
  - The bounded execution slice listed in `Can Claim` landed and required verification passed.
  - `done` does not automatically mean the parent spec or full topic is complete.
- `partial`
  - Some admitted queue work landed, but at least one `Can Claim` item remains unimplemented, unverified, or intentionally routed away.
  - `partial` requires residue, blocker, accepted-residue, or successor-candidate routing before version-level review continues.
- `blocked`
  - The queue cannot continue without a concrete blocker.
  - The blocker must be recorded in `blocked_by` or the queue-local progress record.

`topic_closure_status` semantics:

- `closed`
  - No same-family gap remains that blocks the queue's claimed topic surface.
  - `closed` is illegal when `residue_remaining = yes` and the residue is still same-family blocking work.
- `open-residue`
  - Execution may be `done` or `partial`, but some required or related capability remains open and must be routed.
  - Open residue must name its family and next routing effect.
- `blocked`
  - The topic cannot close until a recorded blocker is resolved.

`residue_family` semantics:

- `same-family`
  - The remaining work belongs to the same parent requirement or mechanism family and may need automatic continuation if one lawful next queue exists.
- `cross-family`
  - The remaining work belongs to another version, mechanism family, or later target and must route through version-level review.
- `accepted-residue`
  - The remaining gap is explicitly accepted within the parent/version boundary and no longer blocks queue or version closeout.
  - Accepted residue must name why the gap is acceptable.
- `none`
  - No meaningful residue remains.

Hard rules:

1. `Out Of Scope`, `Cannot Claim`, and `accepted-residue` are not aliases for `retired`, `removed`, or `unsupported`.
2. A queue may close with `execution_closeout_status = done` and `topic_closure_status = open-residue` only when the bounded queue work is complete but routed residue remains outside the queue's claim boundary.
3. A queue may not use `execution_closeout_status = done` to hide an unimplemented `Can Claim` item.
4. A queue may not use `topic_closure_status = closed` while same-family required capability remains unrouted.
5. If a capability should truly be retired or removed, update the parent spec first, update affected candidate queues second, then close or revise the queue using the updated parent contract.

## 8.10 Final Acceptance Coverage Review

Final validation is an acceptance coverage review, not a substitute for owner-queue implementation.

A required-final queue must produce or update an acceptance coverage table:

- acceptance id
- owner queue
- proof artifact or test
- status: `covered | accepted-residue | blocked | uncovered`
- residue or blocker

Rules:

1. Representative happy-path validation is useful but insufficient by itself.
2. Version closeout requires every required acceptance to be `covered` or explicitly `accepted-residue`.
3. `accepted-residue` must name why the residue no longer blocks the version boundary.
4. If final validation discovers an implementation gap, the gap must route to the owning queue family or a new admitted queue; final validation must not silently absorb broad implementation work.

## 9. Version State Model

### 9.1 `version_status`

Allowed values:

- `open`
- `closed`

### 9.2 `decision_state`

Allowed values while the version is open:

- `active-execution`
- `promotion-review`
- `idle-open`
- `blocked`

### 9.3 Semantics

- `open + active-execution`
  - an active queue exists under the version
- `open + promotion-review`
  - no active queue exists, and version-level admission or review is live
- `open + idle-open`
  - no active queue exists and no admission review is live
- `open + blocked`
  - the version cannot advance until an explicit blocker is resolved
- `closed`
  - the version is formally closed and no new queue may be added under it

Clarifications:

1. `active_queue = none` does not mean the version is `closed`.
2. `active_queue = none` does not authorize fresh implementation.
3. As long as `version_status = open`, a new queue may still be admitted through `promotion-review`.
4. `decision_state` may change while `version_status` stays `open`; this does not create a new version status.

### 9.4 Version lifecycle authority

Version lifecycle is explicit governance truth, not an automatic inference from queue status.

Rules:

1. the repository may have at most one current `open` version
2. if no `open` version exists, version creation is the required next governance act before any new queue admission or implementation may begin
3. an `open` version remains open until version closeout is explicitly confirmed and written into version-plan truth
4. an `open` version may continue admitting new same-version queues even after all current queues are closed
5. queue closeout may be automatic when the next legal step is unique, but the version must not become `closed` without explicit human confirmation
6. if version closeout conditions are satisfied and no active queue remains, the agent may ask exactly one closeout confirmation question:
   - `close current version now, or keep it open for possible additional same-version queue admission`
7. if the user does not explicitly confirm version closeout, the version stays `open`
8. The agent must not coin a surrogate lifecycle term for an `open` version that is waiting on closeout confirmation. Use the existing structured fields instead.

### 9.5 State transitions

- `idle-open -> promotion-review`
  - when a fresh review subject must be classified or admitted
- `promotion-review -> active-execution`
  - when admission is written and the admitted queue becomes active truth
- `promotion-review -> idle-open`
  - when review concludes `rejected` or `deferred` and no queue is admitted
- `promotion-review -> blocked`
  - when version-level decision requires an external blocker or a truly mutually exclusive human choice
- `active-execution -> promotion-review`
  - when an active queue closes and version-level review is now the only legal next point
- `active-execution -> idle-open`
  - when an active queue closes and no new review subject is pending
- `idle-open -> closed`
  - when the operator explicitly confirms closing the version and governing truth is synchronized
- `promotion-review -> closed`
  - when the operator explicitly confirms closing the version and governing truth is synchronized

## 10. Queue And Task Model

Queue docs must own task truth.

Required queue fields:

- `queue_id`
- `belongs_to_version`
- `queue_status`
- `queue_class`
- `active_task`
- `next_task`
- `blocked_by`
- `allowed_item_classifications`
- `reject_item_classifications`
- `closeout_status`
- `next_effect`

Required queue closeout-judgement fields:

- `execution_closeout_status`
- `topic_closure_status`
- `closure_basis`
- `residue_remaining`
- `residue_family`
- `residue_routing_status`
- `next_family_candidate`
- `auto_continue_eligible`

Required queue snapshot fields for active queues:

- `queue_goal`
- `task_count`
- `completed_task_count`
- `remaining_task_count`
- `active_task_summary`
- `task_briefs`

Required task fields:

- `task_id`
- `state`
- `task_brief`
- `task_outcome_summary`
- `scope`
- `must_inspect`
- `must_not_change`
- `done_when`
- `verify_with`
- `if_blocked`
- `promote_next_if_done`
- `stop_if`

Hard queue rules:

1. A queue must not expose an `active_task` unless `queue_status = active`.
2. A non-existent or unadmitted queue must not be used as execution authorization.
3. If a queue is `done`, it must not expose:
   - live `active_task`
   - `Resume ...` instructions
   - `Current active task` language
4. A queue doc must not be created as a substitute for version-level candidate tracking. Candidate tracking belongs in the version plan until queue activation is legal.
5. If a queue doc exists, it must represent admitted queue truth, not pre-admission speculation.
6. If a queue is `active`, it must expose a `Queue Snapshot` that explains queue purpose, task count, active task, and per-task role without creating a second source of executable truth.
7. `decision-dispatch` is a legal queue-local task shape when an active queue needs human decision, scope trimming, recommendation output, or blocker routing, but it does not replace version-level `promotion-review` and does not create a new resume layer.
8. `execution_closeout_status = done` must not by itself imply `topic_closure_status = closed`.
9. A queue may declare `topic_closure_status = closed` only after queue closeout judgement confirms that no still-blocking same-family residue remains inside the queue's bounded topic surface.
10. If residue remains after execution closeout, the queue must classify it as `same-family`, `cross-family`, `accepted-residue`, or `none` before version-level routing can conclude.

## 11. Post-Task Auto-Reconcile And Closeout Auto-Advance

### 11.1 Mandatory auto-reconcile

When an active task completes, the agent must automatically:

1. run the task's verification commands
2. check `done_when`
3. re-evaluate whether the queue should continue, close, or block
4. scan impacted governance owners, at minimum:
   - `project-progress`
   - `blueprint`
   - version spec
   - version plan
   - active queue doc
   - any affected shared-interface docs
5. scan residue, at minimum:
   - tracked changes without clear ownership
   - untracked drafts
   - partially synced governance truth
   - out-of-scope leftovers
6. determine whether the queue's bounded topic is actually closed or still open with residue
7. if residue remains, classify it as `same-family`, `cross-family`, `accepted-residue`, or `none`
8. determine the next legal execution point

### 11.2 Unique-next-step rule

If all are true:

- the active task is complete
- verification passed
- no blocker remains
- the current version plan has `post_queue_closeout_pause_policy = auto-continue`
- the next legal execution point is unique

then the agent must automatically continue into:

- task auto-reconcile
- queue gate re-evaluation
- queue closeout judgement
- same-family residue routing or version review handoff
- next queue admission when uniquely lawful
- next active queue startup when uniquely lawful

It is illegal to stop at:

- status-only reporting
- `是否继续`
- `要不要 closeout`
- `要不要 promotion review`
- `要不要同步文档`

when those are already the only legal next step.

It is also illegal to stop at:

- active-task completion
- task after-state sync
- queue closeout sync
- version-plan admission sync
- active queue activation
- active queue handoff
- active queue switch
- repository sync result recording
- documentation-only state synchronization

when executable work still exists and no lawful stop condition applies.

### 11.2.0 Stop-Condition Self-Check

Before ending a response while the current version still has an active queue, a pending candidate queue, or a uniquely lawful next governance action, the agent must run a stop-condition self-check.

Blueprint must use a lawful-stop allow-list as the primary rule. A stop is legal only if at least one of the following is true:

- the operator explicitly requested answer-only or no-continuation behavior
- a real blocker exists
- the finding is outside the parent spec
- continuing would change the parent total spec
- continuing would delete or downgrade capability
- continuing would rewrite out-of-scope as retired or unsupported
- continuing would require a genuine product decision

If none of those are true, the agent must not stop. It must record the governance decision and continue to the next lawful step.

Required self-check order:

1. First evaluate the lawful-stop allow-list.
2. Only if the agent believes a stop may be legal, then evaluate whether the current situation is merely a forbidden-stop state or other non-stop execution transition.
3. If the allow-list is not satisfied, execution must continue regardless of whether the current state feels like a natural pause point.
4. Forbidden-stop states are explanatory and defensive; they must not replace the allow-list as the primary legal test for stopping.

The allow-list governs stop legality by stop-condition state, not by workflow stage. Reaching a stage such as task completion, queue closeout, queue switch, documentation sync, repository-sync record, or admission sync does not by itself satisfy the allow-list.

Agent-local uncertainty is not a lawful stop condition. In particular, the agent must not treat any of the following as a stop basis by themselves:

- incomplete memory of the current queue/task/doc state
- uncertainty about its own understanding of the current step
- the need to reread current governance truth or local code
- fear that it may have misunderstood the latest transition

When such uncertainty exists but no lawful-stop allow-list item applies, the agent must first reread the current truth chain and then continue with the least capability-reducing lawful action supported by current governance truth.

Forbidden-stop states remain a secondary guardrail. In particular, if none of the lawful-stop conditions above are true, the agent must not stop merely because:

- one queue just closed
- a new queue was just admitted
- the active queue just changed
- repository sync just returned a result
- governance docs were just synchronized

Those are execution transitions, not lawful pause points.

If the agent concludes that a stop is lawful, it must write the structured stop record in current version truth before the response ends. The required fields are:

- `stop_reason`
- `stop_basis`
- `next_unblocked_action`
- `human_input_required`

If any forbidden-stop state is present and the agent still stops or asks for input, the same structured stop record is required before the response ends.

### 11.2.0A Active Queue Continuous Execution Duty

When a version still has an `active_queue`, Blueprint execution must continue until that queue currently has no further lawful task that can be executed under present governance truth.

Hard rules:

1. The agent must continue from the current `active_task` into the next lawful task automatically when:
   - the current task is completed
   - verification, queue-doc sync, version-plan sync, and repository-sync recording are complete or lawfully recordable
   - no real blocker or other lawful stop condition exists
2. The agent must not stop merely because it has:
   - synchronized status
   - completed admission sync
   - completed queue activation or queue switch
   - completed documentation sync
   - reported the current state or summarized progress
3. `active-task complete`, `active-queue still has another lawful task`, and `no lawful stop condition` together mean continuation is mandatory, not optional.
4. If the current active queue has no further lawful task, the agent must continue into the next uniquely lawful Blueprint scheduling step rather than stopping at prose summary.
5. A request such as:
   - `按蓝图规范继续执行当前 active queue，直到该 queue 当前不存在可继续执行的 lawful task 为止`
   - `若无真实 blocker，自动进入下一个 task`
   - `不得只做状态同步后停下`
   is reinforcement of existing Blueprint behavior, not a temporary per-turn override.
6. If the agent lawfully stops anyway, it must first write all of the following into the current version plan before the response ends:
   - `stop_reason`
   - `stop_basis`
   - `next_unblocked_action`
   - `human_input_required`
7. It is illegal to stop at task completion, queue closeout synchronization, admission completion, repository sync result recording, or status-only reporting when another lawful task or uniquely lawful next Blueprint action still exists.
8. If the agent is unsure whether it correctly understood the current queue/task/doc transition, it must reread the current truth chain before choosing a stop. Misunderstanding risk, incomplete recall, or reread need are not lawful pause points by themselves.
9. After rereading, if current truth still exposes one least capability-reducing lawful next action and no allow-list stop condition applies, continuation remains mandatory.

### 11.2.1 Post-Queue Closeout Pause Policy

The version plan owns post-queue pause behavior through:

- `post_queue_closeout_pause_policy`

Allowed values:

- `auto-continue`
- `pause-when-explicitly-requested`

Default:

- `auto-continue`

When `post_queue_closeout_pause_policy = auto-continue`:

1. Queue completion must not create a default pause or default `是否继续` question.
2. If queue completion, verification, governance sync, and repository sync record are complete, and the next legal action is unique, the agent must automatically continue.
3. Automatic continuation includes queue closeout, version review, same-family residue routing, next queue admission, and next active queue startup when each step is uniquely lawful.
4. The agent may ask the operator only when multiple mutually exclusive legal branches exist, a real blocker exists, or version closeout would change `version_status` from `open` to `closed`.

When the operator explicitly requests queue-completion pauses, the agent must write the request into version-plan truth by setting:

- `post_queue_closeout_pause_policy = pause-when-explicitly-requested`

Equivalent operator requests include:

- `这个队列完成后停下来`
- `完成当前执行批次后先不要继续`
- `后续每个队列完成后都先问我`
- `开启队列完成暂停模式`

When `post_queue_closeout_pause_policy = pause-when-explicitly-requested`:

1. The agent must still complete the current queue's implementation, verification, closeout, governance sync, and repository sync record.
2. The agent must not pause before the legal execution batch is complete.
3. The pause point may occur only after a legal execution queue or batch is fully complete.
4. The pause report must include:
   - completed queue
   - completion result
   - verification result
   - repository sync result
   - next lawful queue or next lawful action
   - a concise question asking whether to continue

The operator may explicitly restore automatic continuation with requests such as:

- `恢复自动继续`
- `之后不需要每个队列完成都问我`
- `关闭队列完成暂停模式`

The agent must then write:

- `post_queue_closeout_pause_policy = auto-continue`

This policy does not change:

1. the mandatory human confirmation before `version_status` changes from `open` to `closed`
2. blocker handling
3. human choice when multiple mutually exclusive legal branches exist
4. the rule that a unique next step must not prompt the operator when pause policy is `auto-continue`

### 11.3 Queue closeout judgement

Queue closeout must distinguish execution completion from real topic closure.

Required rules:

1. `execution_closeout_status = done` means the bounded execution slice landed and verified.
2. `topic_closure_status = closed` means the bounded topic is actually converged enough to close.
3. A queue must not use governance completion alone as proof of topic closure.
4. A queue must not declare `topic_closure_status = closed` while:
   - `residue_remaining = yes`
   - or still-blocking same-family residue remains on the covered production path
5. If execution landed but residue remains, the queue must write:
   - `execution_closeout_status = done`
   - `topic_closure_status = open-residue`
6. Accepted residue is legal only when the queue explicitly records why that residue no longer blocks bounded topic closure.
7. After an execution queue completes, closeout judgement must inspect the related implementation surface for superseded old code, old flows, stale compatibility paths, and legacy process residue owned by that queue.
8. A queue must not claim `topic_closure_status = closed` if related old or compatibility flow residue remains on the queue-owned path without being removed or explicitly classified as accepted residue.
9. The residue check must be evidence-based. At minimum, it must compare the queue's `Legacy Paths To Replace`, `Compatibility Paths To Preserve`, landed code, tests, and runtime/export/import paths that the queue touched.

### 11.4 Same-family residue routing

After queue closeout judgement, Blueprint must continue with residue routing instead of stopping at prose summary.

Rules:

1. If `residue_family = same-family` and the next lawful continuation is unique, Blueprint should:
   - record the residue as structured continuation truth
   - write the version-plan routing fields
   - avoid asking the human which queue should come next
2. If `residue_family = cross-family`, the residue must return to version-level review instead of staying on the same closure chain automatically.
3. If `residue_family = accepted-residue`, the queue may still close only when `closure_basis` proves that accepted residue no longer blocks the queue's bounded closure contract.
4. If multiple lawful continuation routes remain and current docs/code do not uniquely decide between them, Blueprint may escalate to human choice.
5. If only one lawful continuation exists, Blueprint must not ask.

### 11.5 Queue closeout sync order

Queue closeout sync order is fixed:

1. queue doc
2. version plan
3. version spec if affected
4. blueprint if affected
5. project-progress
6. optional `docs/change-log.md` update only when code, runtime, compatibility, shared interface, or user-visible behavior changed

### 11.6 Candidate Backlog Refresh Before Version Review

After an execution queue closes, Blueprint must refresh candidate truth before it answers whether more same-version candidate queues exist.

The refresh order is fixed:

1. `project-progress`
2. `blueprint`
3. current version plan
4. version plan `candidate_queue_ids`
5. `Candidate Recovery Ledger`
6. `Queue Promotion Ledger`
7. relevant queue docs named by the current version plan
8. `docs/change-log.md` only when the structured governance docs are insufficient or explicitly cite it

`docs/blueprints/version-memo.md` is deliberately not part of the default refresh order. It may be consulted only when the operator explicitly requests memo screening, memo promotion, or review of a named memo/queue that is recorded only in the memo.

The version plan should record the refresh result in:

- `candidate_backlog_refresh_status`
- `candidate_backlog_snapshot`
- `candidate_backlog_scan_sources`

Allowed refresh statuses:

- `not-run`
- `fresh`
- `stale`
- `blocked`

Hard rules:

1. The agent must not answer `no candidate queues remain`, `none`, or equivalent prose until the candidate backlog refresh is `fresh`.
2. A `fresh` refresh with an empty candidate snapshot is the only lawful basis for saying no candidate queues remain.
3. If any candidate queue appears in `candidate_queue_ids`, `Candidate Recovery Ledger`, `Queue Promotion Ledger`, or cited queue docs, the agent must list it or explain why it is not eligible yet.
4. If the candidate truth is stale, missing, or internally inconsistent, the next action is refresh or reconcile; it is not a prose answer that no candidates exist.
5. The agent must not require the operator to paste a queue doc before performing this refresh when the doc path is already named by governance truth.
6. A memo-only entry is not a candidate queue for this refresh. It becomes candidate truth only after operator-requested promotion/admission review records it in the current version plan.

### 11.6.1 Simulated-Human Multi-Case Test Discipline

When Blueprint asks for simulated-human testing across multiple test cases or scenarios, the full case set must be executed with the built-in browser before any repair pass begins.

Rules:

1. Do not stop after only one passing case when additional requested cases remain.
2. If a test case fails, record the failure and continue with the remaining cases when execution can still proceed safely.
3. Only after all requested test cases finish, or execution becomes impossible because of a blocking bug, may the agent switch from test execution to repair work.
4. After repair, rerun the specific failed test case(s) that produced the problem.
5. A test case may be marked complete only after it passes on the rerun that verifies the fix.
6. A test suite may be marked complete only when every requested case has been run and every failed case has been rerun successfully, or when the remaining cases are explicitly unreachable because of a blocking bug that has been recorded.
7. Do not silently skip cases, collapse cases into one representative case, or mark a partially run suite as complete.
8. Every simulated-human test case must use the built-in in-app browser control path for UI interaction and observation.
9. Simulated-human means visible rendered-UI interaction in the built-in in-app browser, not hidden automation success. The browser surface must remain human-visible while the case runs.
10. Simulated-human interaction should follow the closest available human path through visible UI elements, including pointer movement/click, keyboard input, scrolling, and other observable interactions as applicable.
11. The following do not count as simulated-human proof by themselves:
   - direct function calls
   - direct state writes
   - synthetic completion that bypasses the rendered control path
   - non-visible or background-only browser automation
   - external-browser-only interaction
12. If an automation tool is still used, it may only count as simulated-human proof when it drives the visible UI path inside the built-in in-app browser rather than bypassing it.
13. If the required interaction cannot be kept human-visible in the built-in in-app browser, record the result as another proof type or as blocked/waived; do not label it simulated-human.
14. During test execution, failures must be recorded in a buglist instead of being fixed immediately, except when the operator explicitly asks to fix a specific bug or all bugs before the case set finishes.
15. Buglist entries must record at minimum:
   - owning queue or affected queue candidate when known
   - test case id or scenario name
   - reproduction path
   - observed failure
   - suspected or confirmed cause
   - blocking level: `blocking | non-blocking`
   - repair status: `recorded | fixed | verified | reopened`
16. Non-blocking bugs do not prevent the current test case set or execution queue from continuing.
17. If a blocking bug prevents one test case from continuing, record the blocker and proceed to the next independent test case when possible.
18. Bug repair normally begins after all planned queues finish. Repair may begin earlier only when the operator explicitly asks to fix a named bug, a subset of bugs, or all bugs.
19. After each bug repair, rerun the failed built-in-browser test case(s) that produced the bug and update the buglist status only after verification passes.

### 11.7 Task And Queue Repository Sync

After a task reaches a terminal execution state:

1. write the task after-state first
2. write queue truth and any required version truth second
3. record the local repository sync state third
4. do not start remote push / merge before queue closeout unless a queue/version contract explicitly requires earlier remote sync
5. continue Blueprint scheduling after the local-record step or any attempted repository sync returns a result

After a queue reaches queue closeout:

1. create one local `branch-commit` for that completed execution queue before activating the next queue or continuing version-level promotion review
2. use a commit message with a typed subject plus a `Summary:` body containing real content bullets
3. record the local commit result in the queue-local sync record
4. attempt `remote-sync` toward the remote development trunk `mod-first-dev` after the local `branch-commit` is recorded
5. wait for the push / merge result before continuing any later Blueprint scheduling action
6. regardless of remote-sync success or failure, record the result in the queue-local sync record and keep the already-recorded execution conclusion unchanged
7. a completed queue-local `branch-commit` is not a pause boundary by itself
8. after repository sync result is recorded, continue to the next lawful Blueprint scheduling action unless `post_queue_closeout_pause_policy = pause-when-explicitly-requested`, a blocker exists, multiple mutually exclusive legal branches exist, or version closeout confirmation is required
9. local-record, branch-commit, attempted remote-sync, and recorded sync result are not lawful pause points by themselves
10. If remote sync cannot actually be attempted, the queue-local sync record must state the concrete reason that prevented the attempt.
11. A queue, version plan, or operator-facing summary must not describe repository sync as completed, attempted, or satisfied when the required sync step never started.

Repository sync success or failure must not rewrite the already-recorded execution conclusion.

If a `git push` or other remote sync is started, the agent must wait until the push command returns a clear success or failure result before continuing any Blueprint scheduling, admission, queue activation, closeout routing, or version review work.

Remote sync success or failure must not block queue closeout, version review handoff, same-family continuation routing, or next lawful queue activation when the execution truth and required governance truth are otherwise complete. It only records the remote repository synchronization result as historical sync fact.

## 12. Human Confirmation Constraint

Per task, at most one human-confirmation question may be asked.

Do not ask when the answer can be determined from:

- Control Blocks
- version plan
- queue doc
- codebase state
- existing docs

If an active queue exists and the question depends on queue progress, emit a queue snapshot before asking.

The decision order is:

1. if docs/code can decide, classify or route automatically
2. if the item is uncertain but does not change active truth, record `uncertain-needs-review` and stop without asking
3. ask the user only when active truth would change and multiple mutually exclusive legal branches exist

Hard throttle:

1. If there is only one legal branch, do not ask.
2. Scope approval questions must not be reused as admission confirmation.
3. Closeout / promotion-review / doc-sync questions are forbidden when they are already the only legal next step.
4. If the one allowed confirmation has already been used, the agent must either:
   - finish automatic closeout from existing evidence
   - or report `blocked` with the smallest concrete blocker
5. If same-family residue routing is uniquely supported by queue closeout and version truth, do not ask the human to choose the next queue.
6. In-parent-spec admission gaps, completeness-audit findings, and queue-local implementation-bearing findings must not be turned into default confirmation prompts when they can be recorded and routed automatically under current governance truth.
7. If a stop or question is lawful, the current version plan must already contain `stop_reason`, `stop_basis`, `next_unblocked_action`, and `human_input_required` before the response ends.
8. The agent must not ask or stop after active-task completion, queue closeout completion, admission sync, active queue switch, repository sync result recording, or doc-sync completion when the next legal action is unique.

Version-level exception:

- version closeout confirmation is allowed, and required, when version closeout conditions are already satisfied and changing `version_status` from `open` to `closed` would alter active truth
- if closeout is not confirmed, resume from the still-open version rather than inferring closure

### 12.1 Explicit Operator-Directed Closure Or Suspension

If the operator explicitly requests closing or suspending the current execution queue, a candidate queue, or the current version, the agent may comply without treating that request as an implementation blocker, but it must update the governing docs in the same batch.

Hard rules:

1. Do not counterfeit completion. An explicit operator request may authorize closure or suspension, but it must not be used to falsely mark unfinished work as `done`.
2. When the operator explicitly requests closing the current execution queue:
   - use `queue_status = done` only if the queue's claimed acceptance and closeout truth are actually satisfied
   - otherwise use `queue_status = dropped`
   - update queue closeout truth, residue routing, and version-plan routing truth in the same batch
3. When the operator explicitly requests suspending the current execution queue:
   - use `queue_status = suspended`
   - clear live task execution from the queue doc
   - set the version plan `active_queue = none`
   - record the suspension basis and lawful resume action in the version plan
4. When the operator explicitly requests suspending a candidate queue:
   - keep the candidate in version-level truth
   - update the candidate ledger and queue-promotion record to show it is operator-suspended / on-hold
   - do not silently drop or complete it
5. When the operator explicitly requests closing a candidate queue without execution:
   - mark that candidate as operator-dropped or rejected in version-level truth
   - remove it from future promotion routing
   - do not create fake execution-closeout history for a queue that never ran
6. When the operator explicitly requests suspending the current version:
   - keep `version_status = open`
   - record `stop_reason = operator-requested-suspend`
   - record `stop_basis`, `next_unblocked_action`, and `human_input_required = false`
   - do not invent another version status merely to express suspension
7. When the operator explicitly requests closing the current version:
   - use `version_status = closed`
   - do not invent a third version status to represent early closure, forced closure, archival, or paused closure
   - if closeout truth is not actually satisfied, record that fact explicitly in the version-plan closure/routing truth instead of counterfeiting acceptance completion
   - reconcile `active_queue`, candidate routing, and any remaining residue in the same write batch
8. Operator-directed closure or suspension is a document-write action, not a conversation-only note. `project-progress`, `blueprint`, the current version plan, and any affected queue docs must be synchronized before the response ends when their owned truth changes.
9. If a suspended queue or version is later resumed, resume from the written governance truth rather than recreating the item from scratch.

## 13. Consistency Checks

At minimum, Blueprint governance must satisfy:

1. `project-progress.active_version == blueprint.active_version`
2. `project-progress.has_active_queue == false` implies the version plan does not name an active queue
3. `version_status = closed` implies:
   - `active_queue = none`
   - no active task may exist in any queue under that version
4. a `done` queue must not contain:
   - `Resume execution`
   - `Current active task`
   - other live execution commands
5. a document must not contain multiple live `Current ...` state zones
6. `docs/change-log.md` must not be declared a required closeout gate artifact
7. `open + active_queue = none` is legal and may still admit a new queue
8. historical sections must not impersonate current control truth
9. `project-progress` must use `entry_action`, not `next_step`
10. version plans must use `next_action`, not `next_legal_action`
11. version plans and their templates must not keep a live `### Current Decision` block
12. version specs and their templates must expose queue families through a contract-only portfolio without `State` or `Source` columns
13. `active_queue = none` must not coexist with `decision_state = active-execution`
14. `next_action = resume-active-queue` requires a non-`none` `active_queue`
15. a version plan must not review a `queue-candidate` without structured review fields
16. `admission_status = admitted` must not coexist with `active_queue = none`
17. a queue must not carry a live `active_task` unless `queue_status = active`
18. when `execution_mode = single-active-task` and `allow_parallel = false`, an active queue must block simultaneous live admission review for another queue
19. when the version plan names an `active_queue`, exactly one queue doc must be `queue_status = active` and its `queue_id` must match
20. when the version plan names `active_queue = none`, no queue doc may remain `queue_status = active`
21. queue docs must not use `queue_status = candidate`
22. an open version with `active_queue = none` remains eligible for same-version queue admission until explicit version closeout is written
23. `topic_closure_status = closed` must not coexist with `residue_remaining = yes`
24. `residue_family = same-family` requires a non-`none` next continuation record
25. version-level same-family residue routing must not keep `next_lawful_queue_recommendation = none`
26. `auto_admission_ready = true` requires structured residue continuation truth rather than prose-only closeout notes

## 14. Automated Enforcement

`npm run lint:blueprints` is the required automated consistency gate for Blueprint governance changes.

Current Blueprint lint must reject:

- `project-progress.next_step`
- target-plan `next_legal_action`
- live `### Current Decision` blocks in version plans
- version-plan documents missing:
  - `review_subject_id`
  - `review_subject_classification`
  - `proposed_queue_id`
  - `review_basis`
  - `admission_status`
- version-plan states where:
  - `active_queue = none` and `decision_state = active-execution`
  - `next_action = resume-active-queue` while `active_queue = none`
  - `admission_status = admitted` while `active_queue = none`
  - `review_subject_classification = queue-candidate` while `proposed_queue_id = none`
- version-spec queue tables that mix contract fields with `State` / `Source`
- queue Control Blocks that use legacy `status` instead of `queue_status`
- queue Control Blocks that use `queue_status = candidate`
- queues with `active_task != none` while `queue_status != active`
- done queues that still expose live execution labels
- `has_active_queue = false` paired with a version plan `active_queue != none`
- version plans that keep a live queue-admission review subject while another active queue already exists
- repositories where the version plan names one active queue but queue docs expose zero or multiple active queues
- repositories where a queue doc is `active` while the version plan still says `active_queue = none`
- queue closeout structures that claim closure without required closeout-judgement fields
- queues where `topic_closure_status = closed` while `residue_remaining = yes`
- queues where `residue_family = same-family` while `next_family_candidate = none`
- queues where `auto_continue_eligible = true` but no continuation target is named
- version plans that carry closure-routing truth without the required routing fields
- version plans where `residue_candidate_family = same-family` while `next_lawful_queue_recommendation = none`
- version plans where `auto_admission_ready = true` without structured residue candidate / recommendation truth

## 15. Governance Debt Still Requiring Stronger Automation

Current lint can catch document-state contradictions, but it still cannot fully prove conversation-order violations.

These remain mandatory future enforcement categories:

1. reject implementation batches that begin while the version plan still shows `active_queue = none` and the reviewed item is an unadmitted `queue-candidate`
2. reject sessions that complete verification for the active task but stop before queue auto-reconcile / closeout when no blocker exists
3. detect scope approval being incorrectly treated as admission without structured version-plan review fields changing first
4. detect conversation-only classification that changes active truth without synchronized governance writes
5. detect repeated full re-audit of an already recorded queue-candidate when no material recheck trigger exists
6. detect version closeout being written without explicit human confirmation
7. detect repositories that drift into zero-open-version or multiple-open-version truth without an explicit version-creation / version-closeout record
8. detect queue closeout that stops at prose residue discussion without version-level routing truth
9. detect sessions that still ask humans to choose the next queue when same-family routing is already unique
10. detect sessions that still collapse governance completion into topic closure without proving old-structure exit
11. detect sessions that stop after task completion, queue closeout, admission sync, active queue switch, or repository sync result even though no lawful stop condition was recorded
12. detect sessions that end without a stop-condition self-check when an active task or uniquely lawful next action still exists
13. detect queue docs admitted or closed without the mandatory anti-over-narrowing structure (`Capability Floor`, `User Path Coverage Matrix`, `Functional Loss Budget`, `Replacement Proof`, `Completion Completeness Review`)
14. detect queue docs whose claimed acceptance closes while inherited parent capabilities, alternate paths, or replacement proof remain structurally unspecified

Until stronger automation exists, these are still hard workflow rules, not optional guidance.

## 16. Session Execution Principle

Blueprint workflow corrections must be performed directly through the session by editing the authoritative docs. Do not update `docs/change-log.md` for governance-only workflow corrections unless the same task also changes code, runtime behavior, compatibility, shared interfaces, or user-visible behavior.

Do not require the user to manually paste updated workflow prose into `docs/blueprints/blueprint-workflow-spec.md`.

The only acceptable reason to ask for human choice is:

- multiple mutually exclusive legal branches exist
- the choice would change active truth

Otherwise the agent must update the governing docs directly.

## 17. Git Integration Rules

Git integration is mandatory repository sync behavior, but it is non-governing for Blueprint state.

Rules:

1. `mod-first` is the main integration branch.
2. `mod-first-dev` is the development trunk.
3. All work happens on a working branch.
4. Repository sync levels are:
   - `local-record`: write local docs/code and queue-local sync state without creating a commit
   - `branch-commit`: create one semantic local commit for one completed execution queue
   - `branch-push`: push the working branch without baseline merge
   - `remote-sync`: push the working branch and attempt merge/push to the development trunk `mod-first-dev`
5. Every completed execution queue should form its own local `branch-commit` before later Blueprint scheduling continues.
6. The default Blueprint governance/documentation refinement path is `local-record` during execution, `branch-commit` at queue closeout, then attempted `remote-sync` toward `mod-first-dev`.
7. Every completed execution queue should attempt remote-sync after its queue-local branch-commit; if that remote-sync fails, record the failure and continue Blueprint scheduling from written governance truth.
8. Once a push is started, no later Blueprint scheduling action may continue until the push returns success or failure.
9. Terminal task after-state does not by itself require immediate commit, push, or merge before queue closeout.
10. Avoid process-only commits for minor field synchronization unless that synchronization is the bounded queue or task itself.
11. Every git commit, including merge commits, must carry its own structured content summary in the commit message body.
12. Commit / push / merge are non-governing: they must not change task state, queue state, version state, or version scheduling truth.
13. Local hook or CI enforcement must reject commit messages that omit the required summary block.
14. Repository sync failure is recorded only as repository sync result in the queue-local sync record.
15. Repository sync failure must not be rewritten as queue blocker, target blocker, queue_status change, version_status change, decision_state change, repository/global verification failure, or decision_required.
16. Repository sync failure must not block task closeout, queue closeout, version review handoff, same-family continuation routing, or next lawful queue activation.
17. After a returned push result is recorded, Blueprint scheduling continues from written governance docs whether the push succeeded or failed.
18. Ask the user only when merge-conflict handling has multiple mutually exclusive legal resolutions that current version truth cannot decide.
19. Resume truth comes from the written governance docs, not branch memory or remote push status.
20. A merge conflict is part of repository sync, not execution-state governance.
21. A merge conflict must not rewrite the already-recorded task, queue, or target conclusion.
22. If current version truth uniquely decides the merge direction, resolve it without asking.
23. Record merge-conflict outcome only in the queue-local sync record rather than elevating it into version live truth.

## 18. Drift-Prone Field Reduction

Delete or demote high-drift fields, especially:

- `project-progress.completed_queues`
- `blueprint.completed_targets`
- duplicated completed registries
- any field that can be derived from downstream truth

Principles:

1. If downstream can authoritatively say it, upstream must not duplicate it.
2. If a field cannot be kept reliably synchronized, it must not be Control Block truth.

## 19. Migration Order

Blueprint governance migrations must apply changes in this order:

1. rewrite `docs/blueprints/blueprint-workflow-spec.md`
2. rewrite relevant templates
3. clean current live docs
4. update current automated enforcement where static checks are possible
5. run consistency checks
6. update `docs/change-log.md` only if the migration includes code, runtime, compatibility, shared interface, or user-visible behavior changes
7. report the corrected model, sealed loopholes, and remaining governance debt

## 20. Success Condition

The Blueprint model is successful only when:

- current execution truth can be recovered from Control Blocks alone
- admission cannot be silently skipped by scope approval alone
- the next legal action is unambiguous from structured fields
- target and queue truth each have a single writer
- historical narrative no longer masquerades as live control
- `open + no active queue` is supported without fake work
- task completion automatically rolls through verification, residue scan, gate re-evaluation, closeout sync, and target handoff when no blocker remains
- active-task completion, queue closeout, admission sync, and active-queue switching do not create default pause points
- queue specs cannot pass by shrinking inherited capability surfaces down to one happy path or one local seam

