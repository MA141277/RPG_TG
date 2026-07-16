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
- `Archived Interpretation`
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
4. If the queue can only close a smaller slice than its name implies, the claim boundary must be narrowed before implementation starts.
5. Existing active queues may be repaired by adding an `evidence-anchor-reconcile` task before further implementation.

## 8.9 Queue Claim Boundary

Every active execution queue must state what it can and cannot claim.

Required queue sections:

- `Can Claim`
- `Cannot Claim`
- `Legacy Paths To Replace`
- `Compatibility Paths To Preserve`
- `Implementation Anchors`
- `Verification Coverage`

Rules:

1. `Can Claim` may list only acceptance ids owned by the queue.
2. `Cannot Claim` must list related version acceptance that remains outside the queue.
3. Queue closeout can close only the acceptance ids listed in `Can Claim`.
4. If implementation lands only a seam or guard, closeout must say so and route remaining acceptance through residue.
5. Queue residue classification must compare landed behavior against the claim boundary, not the queue title.

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
- `done`
- `archived`

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
- `done`
  - the version is formally closed and no new queue may be added under it
- `archived`
  - the version is historical only

Clarifications:

1. `active_queue = none` does not mean the version is `done`.
2. `active_queue = none` does not authorize fresh implementation.
3. As long as `version_status = open`, a new queue may still be admitted through `promotion-review`.

### 9.4 Version lifecycle authority

Version lifecycle is explicit governance truth, not an automatic inference from queue status.

Rules:

1. the repository may have at most one current `open` version
2. if no `open` version exists, version creation is the required next governance act before any new queue admission or implementation may begin
3. an `open` version remains open until version closeout is explicitly confirmed and written into version-plan truth
4. an `open` version may continue admitting new same-version queues even after all current queues are closed
5. queue closeout may be automatic when the next legal step is unique; version closeout may become `closeout-ready`, but it must not become `done` without explicit human confirmation
6. if version closeout conditions are satisfied and no active queue remains, the agent may ask exactly one closeout confirmation question:
   - `close current version now, or keep it open for possible additional same-version queue admission`
7. if the user does not explicitly confirm version closeout, the version stays `open`

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
4. The agent may ask the operator only when multiple mutually exclusive legal branches exist, a real blocker exists, or version closeout would change `version_status` from `open` to `done`.

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

1. the mandatory human confirmation before `version_status` changes from `open` to `done`
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

### 11.7 Task And Queue Repository Sync

After a task reaches a terminal execution state:

1. write the task after-state first
2. write queue truth and any required version truth second
3. record the local repository sync state third
4. defer push and baseline merge until explicitly requested, collaboration needs remote visibility, or a queue/version contract requires remote sync
5. continue Blueprint scheduling after the local-record step or any attempted repository sync returns a result

After a queue reaches queue closeout:

1. create one local `branch-commit` for that completed execution queue before activating the next queue or continuing version-level promotion review
2. use a commit message with a typed subject plus a `Summary:` body containing real content bullets
3. record the local commit result in the queue-local sync record
4. keep push optional; do not require one push per queue
5. if push is deferred, record that the queue has a local commit and remote sync is pending or not requested
6. a completed queue-local `branch-commit` is not a pause boundary by itself
7. after repository sync is recorded, continue to the next lawful Blueprint scheduling action unless `post_queue_closeout_pause_policy = pause-when-explicitly-requested`, a blocker exists, multiple mutually exclusive legal branches exist, or version closeout confirmation is required

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

Version-level exception:

- version closeout confirmation is allowed, and required, when the version is closeout-ready and changing `version_status` to `done` would alter active truth
- if closeout is not confirmed, resume from the still-open version rather than inferring closure

## 13. Consistency Checks

At minimum, Blueprint governance must satisfy:

1. `project-progress.active_version == blueprint.active_version`
2. `project-progress.has_active_queue == false` implies the version plan does not name an active queue
3. `version_status = done` implies:
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
   - `remote-sync`: push the working branch and, only when explicitly required, merge/push the baseline
5. Every completed execution queue should form its own local `branch-commit` before later Blueprint scheduling continues.
6. The default Blueprint governance/documentation refinement path is `local-record` during execution, `branch-commit` at queue closeout, and deferred push unless remote visibility is requested or required.
7. Push is not bound to every queue; multiple queue commits may be pushed in one later batch.
8. Once a push is started, no later Blueprint scheduling action may continue until the push returns success or failure.
9. Terminal task after-state does not by itself require immediate commit, push, baseline merge, or baseline push.
10. Avoid process-only commits for minor field synchronization unless that synchronization is the bounded queue or task itself.
11. Every git commit, including merge commits, must carry its own structured content summary in the commit message body.
12. Commit / push / merge are non-governing: they must not change task state, queue state, version state, or version scheduling truth.
13. Local hook or CI enforcement must reject commit messages that omit the required summary block.
14. Repository sync failure is recorded only as repository sync result in the queue-local sync record.
15. Repository sync failure must not be rewritten as queue blocker, target blocker, queue_status change, version_status change, decision_state change, repository/global verification failure, or decision_required.
16. Repository sync failure must not block task closeout, queue closeout, version review handoff, same-family continuation routing, or next lawful queue activation.
17. After a returned push result is recorded, Blueprint scheduling continues from written governance docs whether the push succeeded or failed.
18. Ask the user only when baseline selection is ambiguous or when merge-conflict handling has multiple mutually exclusive legal resolutions that current version truth cannot decide.
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

