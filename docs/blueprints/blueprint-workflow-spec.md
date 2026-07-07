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
- target specs under `docs/blueprints/specs/`
- target plans under `docs/blueprints/plans/`
- queue docs under `docs/blueprints/queues/`
- templates under `docs/blueprints/templates/`
- `tools/lint-blueprints.mjs`
- `docs/change-log.md` when Blueprint work is historically recorded there

Old `docs/superpowers/**` workflow docs remain historical or legacy-only reference.

## 3. Canonical Resume Chain

The only legal execution resume chain is:

```text
project-progress -> blueprint -> target plan -> active queue -> active task
```

Rules:

1. `project-progress` is the repository entry document.
2. `blueprint` is the Blueprint index and target registry.
3. `target plan` is the only live governor at target level.
4. `queue doc` is the only live governor at queue level.
5. `target spec` is a boundary and acceptance contract, not a live execution controller.
6. `docs/change-log.md`, old `docs/superpowers/**`, closed queues, and prose history must not be used to infer current execution truth.
7. If `active_queue = none`, resume from the target plan's `resume_gate`.
8. AI must not invent placeholder queues or placeholder tasks.

## 4. Single-Writer Truth Model

### 4.1 `project-progress.md`

Owns only:

- repository resume entry
- current Blueprint pointer
- current target pointer
- whether an active queue exists
- next jump file
- repository entry action

Must not own:

- `decision_state`
- `target_status`
- queue-local task state
- queue-local narrative
- redundant completed queue registries
- any live truth already owned downstream

### 4.2 `blueprint.md`

Owns only:

- target registry
- current active target pointer
- current target plan pointer
- classification / routing references
- repository execution mode

Must not own:

- `decision_state`
- `target_status`
- active task truth
- queue-local execution detail
- live queue truth derivable from the target plan
- drift-prone completed target registries

### 4.3 target spec

Owns only:

- target goal
- scope
- non-goals
- acceptance criteria
- queue portfolio
- target closeout contract

The target spec queue portfolio must stay contract-only. It must not mirror runtime queue status or queue document source pointers.

Must not own:

- `target_status`
- `decision_state`
- active queue
- active task
- current task instructions
- queue-local execution interpretation

### 4.4 target plan

The target plan is the only live governor for:

- `target_status`
- `active_phase`
- `active_queue`
- `decision_state`
- `next_decision`
- `next_action`
- `resume_gate`
- `promotion_review_result`
- `review_subject_id`
- `review_subject_classification`
- `proposed_queue_id`
- `review_basis`
- `admission_status`
- queue promotion / hold / reopen / closeout conclusions
- target-level closeout decision

### 4.5 queue doc

The queue doc is the only live governor for:

- `queue_status`
- `active_task`
- `next_task`
- task ordering
- queue closeout conditions
- queue-local progress record
- queue-level verification
- `closeout_status`
- `next_effect`

### 4.6 `docs/change-log.md`

`docs/change-log.md` is a historical record and human-readable summary only.

It may record:

- historical change summaries
- promotion / closeout summaries
- human-facing explanation

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
- `closeout_status`
- `next_effect`
- `promotion_review_result`
- `review_subject_id`
- `review_subject_classification`
- `proposed_queue_id`
- `review_basis`
- `admission_status`

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

Historical sections must not use instruction-like labels such as:

- `Current ...`
- `Current active ...`
- `Resume execution ...`
- `Now do ...`

`Resume ...` phrasing is allowed only inside:

- the current active target plan live area
- the current active queue live area

Closed queues, closed targets, historical notes, and `docs/change-log.md` must not contain text that reads like a current execution command.

## 7. Admission Frontload Rules

### 7.1 Mandatory admission before fresh implementation

Any fresh implementation item that is classified as `queue-candidate` must complete target-level admission before implementation starts.

Hard rules:

1. If `active_queue = none`, no fresh implementation may begin directly.
2. If classification concludes `queue-candidate`, the agent must return to target-level admission review before code implementation.
3. The agent must not begin implementation while either of these is still missing:
   - the target plan Control Block does not yet record the admission review truth
   - the admitted queue doc does not yet exist and expose active execution truth
4. A queue-candidate may be discussed, audited, or scoped before admission, but that is not implementation authorization.

### 7.2 Required write order for admission

When a `queue-candidate` is admitted, write truth in this order before implementation:

1. target plan admission review fields
2. admitted queue doc Control Block
3. target plan `active_queue` / `decision_state` / `next_action`
4. blueprint if affected
5. project-progress if affected

Only after those documents agree may implementation begin.

### 7.3 Scope approval is not admission

User approval of bounded scope is not equivalent to queue admission.

The following must remain distinct:

- `scope approval`
  - user agrees the proposed boundary is acceptable
- `admission`
  - target plan records the review subject, proposed queue, basis, admission result, and active execution truth

Phrases such as:

- `按这个范围做`
- `可以`
- `继续推进这个范围`

may authorize scope, but they must not be treated as a substitute for target-plan admission or queue activation.

## 8. Classification Trace Rules

### 8.1 Structured trace is mandatory when active truth changes

Any classification result that changes or may change active truth must be recorded in structured governance truth.

It is illegal to stop at conversation-only conclusions such as:

- `this belongs to queue.x`
- `this should be current target work`
- `this needs promotion review`

without syncing the corresponding target plan admission fields.

### 8.2 Required admission-review fields in the target plan

The target plan must structurally carry the current admission review subject through at least:

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
  - the item currently under target-level review
- `review_subject_classification`
  - the structured classification driving the review
- `proposed_queue_id`
  - the queue being considered, or `none`
- `review_basis`
  - the evidence basis justifying the review
- `admission_status`
  - the current formal disposition of the review subject

These fields exist so admission, reject, defer, and block outcomes do not fall back to prose.

## 9. Target State Model

### 9.1 `target_status`

Allowed values:

- `open`
- `done`
- `archived`

### 9.2 `decision_state`

Allowed values while the target is open:

- `active-execution`
- `promotion-review`
- `idle-open`
- `blocked`

### 9.3 Semantics

- `open + active-execution`
  - an active queue exists under the target
- `open + promotion-review`
  - no active queue exists, and target-level admission or review is live
- `open + idle-open`
  - no active queue exists and no admission review is live
- `open + blocked`
  - the target cannot advance until an explicit blocker is resolved
- `done`
  - the target is formally closed and no new queue may be added under it
- `archived`
  - the target is historical only

Clarifications:

1. `active_queue = none` does not mean the target is `done`.
2. `active_queue = none` does not authorize fresh implementation.
3. As long as `target_status = open`, a new queue may still be admitted through `promotion-review`.

### 9.4 State transitions

- `idle-open -> promotion-review`
  - when a fresh review subject must be classified or admitted
- `promotion-review -> active-execution`
  - when admission is written and the admitted queue becomes active truth
- `promotion-review -> idle-open`
  - when review concludes `rejected` or `deferred` and no queue is admitted
- `promotion-review -> blocked`
  - when target-level decision requires an external blocker or a truly mutually exclusive human choice
- `active-execution -> promotion-review`
  - when an active queue closes and target-level review is now the only legal next point
- `active-execution -> idle-open`
  - when an active queue closes and no new review subject is pending

## 10. Queue And Task Model

Queue docs must own task truth.

Required queue fields:

- `queue_id`
- `belongs_to_target`
- `queue_status`
- `queue_class`
- `active_task`
- `next_task`
- `blocked_by`
- `allowed_item_classifications`
- `reject_item_classifications`
- `closeout_status`
- `next_effect`

Required task fields:

- `task_id`
- `state`
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
2. A `candidate` queue or non-existent queue must not be used as execution authorization.
3. If a queue is `done`, it must not expose:
   - live `active_task`
   - `Resume ...` instructions
   - `Current active task` language

## 11. Post-Task Auto-Reconcile And Closeout Auto-Advance

### 11.1 Mandatory auto-reconcile

When an active task completes, the agent must automatically:

1. run the task's verification commands
2. check `done_when`
3. re-evaluate whether the queue should continue, close, or block
4. scan impacted governance owners, at minimum:
   - `project-progress`
   - `blueprint`
   - target spec
   - target plan
   - active queue doc
   - any affected shared-interface docs
5. scan residue, at minimum:
   - tracked changes without clear ownership
   - untracked drafts
   - partially synced governance truth
   - out-of-scope leftovers
6. determine the next legal execution point

### 11.2 Unique-next-step rule

If all are true:

- the active task is complete
- verification passed
- no blocker remains
- the next legal execution point is unique

then the agent must automatically continue into:

- task auto-reconcile
- queue gate re-evaluation
- queue closeout or target review handoff

It is illegal to stop at:

- status-only reporting
- `是否继续`
- `要不要 closeout`
- `要不要 promotion review`
- `要不要同步文档`

when those are already the only legal next step.

### 11.3 Queue closeout sync order

Queue closeout sync order is fixed:

1. queue doc
2. target plan
3. target spec if affected
4. blueprint if affected
5. project-progress
6. optional `docs/change-log.md` mirror update

## 12. Human Confirmation Constraint

Per task, at most one human-confirmation question may be asked.

Do not ask when the answer can be determined from:

- Control Blocks
- target plan
- queue doc
- codebase state
- existing docs

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

## 13. Consistency Checks

At minimum, Blueprint governance must satisfy:

1. `project-progress.active_target == blueprint.active_target`
2. `project-progress.has_active_queue == false` implies the target plan does not name an active queue
3. `target_status = done` implies:
   - `active_queue = none`
   - no active task may exist in any queue under that target
4. a `done` queue must not contain:
   - `Resume execution`
   - `Current active task`
   - other live execution commands
5. a document must not contain multiple live `Current ...` state zones
6. `docs/change-log.md` must not be declared a required closeout gate artifact
7. `open + active_queue = none` is legal and may still admit a new queue
8. historical sections must not impersonate current control truth
9. `project-progress` must use `entry_action`, not `next_step`
10. target plans must use `next_action`, not `next_legal_action`
11. target plans and their templates must not keep a live `### Current Decision` block
12. target specs and their templates must expose queue families through a contract-only portfolio without `State` or `Source` columns
13. `active_queue = none` must not coexist with `decision_state = active-execution`
14. `next_action = resume-active-queue` requires a non-`none` `active_queue`
15. a target plan must not review a `queue-candidate` without structured review fields
16. `admission_status = admitted` must not coexist with `active_queue = none`
17. a queue must not carry a live `active_task` unless `queue_status = active`

## 14. Automated Enforcement

`npm run lint:blueprints` is the required automated consistency gate for Blueprint governance changes.

Current Blueprint lint must reject:

- `project-progress.next_step`
- target-plan `next_legal_action`
- live `### Current Decision` blocks in target plans
- target-plan documents missing:
  - `review_subject_id`
  - `review_subject_classification`
  - `proposed_queue_id`
  - `review_basis`
  - `admission_status`
- target-plan states where:
  - `active_queue = none` and `decision_state = active-execution`
  - `next_action = resume-active-queue` while `active_queue = none`
  - `admission_status = admitted` while `active_queue = none`
  - `review_subject_classification = queue-candidate` while `proposed_queue_id = none`
- target-spec queue tables that mix contract fields with `State` / `Source`
- queue Control Blocks that use legacy `status` instead of `queue_status`
- queues with `active_task != none` while `queue_status != active`
- done queues that still expose live execution labels
- `has_active_queue = false` paired with a target plan `active_queue != none`

## 15. Governance Debt Still Requiring Stronger Automation

Current lint can catch document-state contradictions, but it still cannot fully prove conversation-order violations.

These remain mandatory future enforcement categories:

1. reject implementation batches that begin while the target plan still shows `active_queue = none` and the reviewed item is an unadmitted `queue-candidate`
2. reject sessions that complete verification for the active task but stop before queue auto-reconcile / closeout when no blocker exists
3. detect scope approval being incorrectly treated as admission without structured target-plan review fields changing first
4. detect conversation-only classification that changes active truth without synchronized governance writes

Until stronger automation exists, these are still hard workflow rules, not optional guidance.

## 16. Session Execution Principle

Blueprint workflow corrections must be performed directly through the session by editing the authoritative docs and syncing `docs/change-log.md`.

Do not require the user to manually paste updated workflow prose into `docs/blueprints/blueprint-workflow-spec.md`.

The only acceptable reason to ask for human choice is:

- multiple mutually exclusive legal branches exist
- the choice would change active truth

Otherwise the agent must update the governing docs directly.

## 17. Git Integration Rules

Git integration is mandatory governance behavior.

Rules:

1. `mod-first` is the main integration branch.
2. `mod-first-dev` is the development trunk.
3. All work happens on a working branch.
4. The full commit / push / merge / fresh-branch loop is mandatory after:
   - queue closeout
   - target closeout
   - an explicit integration checkpoint
5. Every git commit, including merge commits, must carry its own structured content summary in the commit message body.
6. Ordinary task batches must still produce a structured content summary, but they do not automatically require the full merge loop.
7. Local hook or CI enforcement must reject commit messages that omit the required summary block.
8. After merge into `mod-first-dev`, do not keep developing on the already-integrated branch.
9. Resume truth comes from the governance docs integrated into `mod-first-dev`, not branch memory.

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
6. sync `docs/change-log.md`
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
