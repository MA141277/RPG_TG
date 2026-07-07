# Blueprint Workflow Spec

## 1. Goal

This spec defines the repository's authoritative Blueprint governance model for resumable work under `docs/blueprints/**`.

The model must keep execution truth:

- machine-readable
- single-writer
- resumable after interruption
- separated from historical narrative

## 2. Scope

This spec applies to:

- `docs/blueprints/project-progress.md`
- `docs/blueprints/blueprint.md`
- `docs/blueprints/classification-rule-layer-spec.md`
- target specs under `docs/blueprints/specs/`
- target plans under `docs/blueprints/plans/`
- queue docs under `docs/blueprints/queues/`
- templates under `docs/blueprints/templates/`
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

## 7. Target State Model

### 7.1 `target_status`

Allowed values:

- `open`
- `done`
- `archived`

### 7.2 `decision_state`

Allowed values while the target is open:

- `active-execution`
- `promotion-review`
- `idle-open`
- `blocked`

### 7.3 Semantics

- `open + active-execution`
  - an active queue exists under the target
- `open + promotion-review`
  - no active queue exists, but a new queue may be promoted under the current target
- `open + idle-open`
  - no active queue exists and no immediate promotion is in motion, but the target remains open
- `open + blocked`
  - the target cannot advance until an explicit blocker is resolved
- `done`
  - the target is formally closed and no new queue may be added under it
- `archived`
  - the target is historical only

Clarifications:

1. `active_queue = none` does not mean the target is `done`.
2. "All current queues are done" does not mean the target is `done`.
3. As long as `target_status = open`, a new queue may still be admitted under the target through `promotion-review`.

### 7.4 State Transitions

- `idle-open -> promotion-review`
  - when a `queue-candidate` has sufficient evidence and target-level admission is required
- `promotion-review -> active-execution`
  - when a queue is formally promoted and written into the target plan
- `promotion-review -> idle-open`
  - when review concludes `reject` or `defer` and no queue is admitted
- `promotion-review -> blocked`
  - when target-level decision requires external blocker resolution or explicit user choice
- `active-execution -> promotion-review`
  - when an active queue closes and a target-level admission decision is now pending
- `active-execution -> idle-open`
  - when an active queue closes and no admission decision is pending

## 8. Queue And Task Model

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

If a queue is `done`, it must not expose:

- live `active_task`
- `Resume ...` instructions
- `Current active task` language

## 9. Classification Escalation Model

Classification escalation must be split into:

- `governance_escalation`
- `human_escalation`

Default behavior:

- `queue-candidate`
  - triggers `governance_escalation`
  - returns control to the target plan's `promotion-review`
  - does not automatically trigger a human question
- `future-target-candidate`
  - triggers `governance_escalation`
  - does not automatically trigger a human question
- `uncertain-needs-review`
  - if it does not change active truth, it may be recorded and stopped without asking the user
  - if it would change active truth and multiple mutually exclusive legal branches exist, it may trigger `human_escalation`

## 10. Post-Task Auto-Reconcile

When a task completes, the agent must automatically:

1. run the task's verification commands
2. check `done_when`
3. decide whether the queue should continue, close, or block
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
7. optionally update `docs/change-log.md` as a historical mirror if a human-readable summary is warranted
8. report:
   - what completed
   - what rules or behavior changed
   - what was verified
   - remaining risk
   - next legal execution point

Do not end by asking low-value questions such as "continue?", "review docs?", or "check again?".

## 11. Closeout Protocol

### 11.1 task closeout

Task closeout must automatically include:

- verification
- residue scan
- impacted-owner scan
- queue gate re-evaluation
- result summary

### 11.2 queue closeout

Queue closeout must record:

- `closeout_status`
- `next_effect`

Allowed `next_effect` values:

- `promote-next-queue`
- `return-to-target-review`
- `block-target`

Queue closeout must not use prose alone to express:

- rejected queue admission
- deferred queue admission
- blocked target-level decisions

Those outcomes belong in the target plan's `promotion_review_result`.

Queue closeout sync order is fixed:

1. queue doc
2. target plan
3. target spec if affected
4. blueprint if affected
5. project-progress
6. optional `docs/change-log.md` mirror update

### 11.3 target closeout

A target may become `done` only when all are true:

- acceptance criteria pass
- no active queue remains
- no active task remains
- no undispositioned residue remains
- the target plan records the target closeout decision
- blueprint and project-progress are synced back to a legal repository entry state

The target must not be marked `done` merely because all existing queues are closed.

## 12. Human Confirmation Throttle

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

If the one allowed confirmation has already been used, the agent must either:

- finish automatic closeout from existing evidence
- or report `blocked` with the smallest concrete blocker

## 13. Git Integration Rules

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

## 14. Commit / Push / Merge Content Summary

Every git commit message must contain:

- a subject line in the form `<type>: <brief title>`
- a blank line
- a `Summary:` section
- at least one bullet under `Summary:` that describes the actual landed content

The same rule applies to merge commits. Default one-line merge messages are invalid unless they are rewritten to include the required `Summary:` block.

Before `push` or `merge`, record or reuse a structured content summary containing:

- `branch`
- `action type`
- `related target`
- `related queue`
- `related task`
- `change summary`
- `verification summary`
- `docs synced`
- `next step`

The commit message summary is a governance prerequisite, not optional narration.

Repository enforcement must be available through:

- `tools/validate-commit-message.mjs`
- `.githooks/commit-msg`
- `.github/workflows/validate-commit-messages.yml`

## 15. Drift-Prone Field Reduction

Delete or demote high-drift fields, especially:

- `project-progress.completed_queues`
- `blueprint.completed_targets`
- duplicated completed registries
- any field that can be derived from downstream truth

Principles:

1. If downstream can authoritatively say it, upstream must not duplicate it.
2. If a field cannot be kept reliably synchronized, it must not be Control Block truth.

## 16. Consistency Checks

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

## 17. Automated Enforcement

`npm run lint:blueprints` is the required automated consistency gate for Blueprint governance changes.

At minimum, the Blueprint lint gate must reject:

- `project-progress.next_step`
- target-plan `next_legal_action`
- live `### Current Decision` blocks in target plans
- target-spec queue tables that mix contract fields with `State` / `Source`
- queue Control Blocks that use legacy `status` instead of `queue_status`
- `has_active_queue = false` paired with a target plan `active_queue != none`
- done queues that still expose live execution labels

## 18. Migration Order

Blueprint governance migrations must apply changes in this order:

1. rewrite `docs/blueprints/blueprint-workflow-spec.md`
2. rewrite relevant templates
3. clean current live docs
4. remove or demote drift-prone fields
5. run consistency checks
6. report the corrected model, canonical resume chain, and remaining governance debt

## 19. Success Condition

The Blueprint model is successful only when:

- current execution truth can be recovered from Control Blocks alone
- the next legal action is unambiguous from structured fields
- target and queue truth each have a single writer
- historical narrative no longer masquerades as live control
- `open + no active queue` is supported without fake work
- task completion automatically rolls through verification, residue scan, doc sync, and gate re-evaluation
