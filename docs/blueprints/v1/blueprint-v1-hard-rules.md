# Blueprint v1 Hard Rules

## Goal

Blueprint v1 reduces Blueprint governance to the smallest live truth set that still supports:

- AI-first execution
- one active execution slot
- candidate-driven intake
- automatic continuation after queue completion
- artifact-triggered transition work only when necessary

## Canonical Resume Chain

The only legal live resume chain is:

```text
project-progress -> blueprint -> target -> execution queue
```

Task truth lives inside the active execution queue and is not a separate repository-level governor.

## Live Truth Owners

### `project-progress`

Owns only:

- repository entry
- active blueprint pointer
- active target pointer
- whether an execution queue exists
- next file to open

Must not mirror:

- candidate pool details
- transition reasoning
- queue-local task state
- closeout prose

### `blueprint`

Owns only:

- active target pointer
- execution mode
- target registry
- global operating rule references

Must not mirror:

- target execution details
- candidate state
- task state

### `target`

The target is the only live governor for:

- `version_goal`
- `acceptance_criteria`
- `in_scope`
- `out_of_scope`
- `execution_queue`
- `candidate_queues`
- `transition_queue`
- `constraints`
- `artifact_rules`
- `done_when`
- `closeout_condition`
- `decision_required`

The target owns queue selection and queue continuity. It replaces the old target spec + target plan split as the single target-level live owner.

### `execution queue`

The execution queue is the only live governor for:

- current executable task list
- current active task
- verify commands
- completion evidence
- queue-local outputs

## Single Execution Slot

Only one execution queue may be active at a time.

Hard rules:

1. Only one execution queue may be active.
2. Candidate queues never count as active execution.
3. A transition queue, if it exists, still uses the same single execution slot.
4. No second queue may become active until the current execution queue resolves to:
   - done
   - returned-to-candidate
   - absorbed-by-target

## Candidate-Driven Intake

New work enters the target through `candidate_queues` by default.

Hard rules:

1. New work must not enter a thick execution structure immediately.
2. Candidate queues must use the progression `candidate -> prepared -> active`.
3. `candidate` means bounded but not yet the next executable queue.
4. `prepared` means bounded enough that activation no longer requires a discovery queue.
5. `active` means the candidate has been promoted into the single execution slot.
6. Prepared is not a second active queue. It is only a readiness state inside the candidate pool.
7. Every candidate entry must define `entry_conditions` as the formal basis for direct activation.
8. Every candidate entry must define `drop_if` as the formal basis for removing or absorbing the candidate without execution.

## Transition Queue Rules

The transition queue exists to close a structural gap between the current target and a blocked candidate.

Hard rules:

1. A transition queue may exist only when no candidate can directly execute.
2. A transition queue must be unique.
3. A transition queue must be necessary.
4. A transition queue must be minimal.
5. A transition queue must bind to one or more explicit candidate ids that it is unblocking.
6. If a candidate can directly execute, no transition queue may be created for convenience.
7. The target's artifact rules are the formal basis for creating a transition queue.

## Task Semantics

Tasks no longer use the old thick governance block style.

Each task keeps only the minimum executable semantics:

- `task_id`
- `goal`
- `inputs`
- `constraints`
- `verify_with`
- `done_signal`
- `next_on_success`
- `on_failure`

## Automatic Continuation

Blueprint v1 is auto-continue first.

Hard rules:

1. After a queue task succeeds, the system must verify and continue if the next legal step is unique.
2. After a queue completes, the system must visibly mark it complete.
3. After a queue completes, if candidate queues still contain legal follow-up work, the system must continue and must not stop at completion reporting.
4. The system may stop only when both are true:
   - no candidate can legally continue
   - no transition queue is justified
5. Queue completion is therefore a visible milestone, not an automatic stop signal.

## Failure Handling

Blueprint v1 does not keep the old thick blocked model.

## Failure Ownership

Failure ownership must be classified conservatively.

Hard rules:

1. Executing verify_with does not by itself assign failure ownership.
2. `queue-local failure` means the failure can be reasonably assigned to the current queue's bounded goal, owner scope, or direct edit surface.
3. `target-level failure` means the failure exceeds one queue's bounded goal but still belongs to the current target.
4. `repository/global verification failure` is legal only when the failure cannot be reasonably assigned to the current queue's bounded goal, owner scope, or direct edit surface.
5. The system must not classify a failure as `repository/global verification failure` for convenience.

Failure must first resolve through:

1. reschedule inside the execution queue
2. return queue to candidate
3. absorb the failure into the target as a candidate rewrite
4. create a transition queue when the artifact rules justify it
5. if queue goal completion is already satisfied and verification finds a non-owner failure, the failure must not remain attached to the current queue closeout
6. a non-owner verification failure must not be reattached to the original queue after target absorption

## Queue Goal Versus Closeout

Queue goal completion and queue closeout are not the same truth.

Hard rules:

1. `done_signal` proves the bounded queue goal; it does not prove that all later verification belongs to the queue.
2. If queue goal completion is satisfied and verify_with finds a non-owner failure, the queue must record the goal as satisfied.
3. A non-owner verification failure must not keep the queue in blocked closeout.
4. The queue must instead escalate with target absorption.

## Target Absorption

The target is the only legal owner once a non-owner verification failure leaves the current queue.

Hard rules:

1. If `verify_with` finds a non-owner failure, the system must absorb it into the target.
2. After absorption, the target must turn the blocker into exactly one of:
   - candidate rewrite
   - new candidate
   - one unique necessary transition queue
3. The target must record the absorb result as structured truth containing source queue, failure scope, chosen resolution kind, and chosen resolution target.
4. The original queue must not keep the blocker as its closeout owner once the failure is absorbed.

## Escalated Queue Terminal State

An execution queue that has escalated to target absorption must converge to one terminal form.

Hard rules:

1. `closeout_status = escalated-to-target` requires `queue_status = done`.
2. `closeout_status = escalated-to-target` requires `goal_status = satisfied`.
3. `closeout_status = escalated-to-target` requires `active_task = none`.
4. `closeout_status = escalated-to-target` requires `next_effect = absorb-into-target`.
5. After this terminal state is recorded, the queue must remain historical evidence only and must not continue to carry the blocker as live queue-owned truth.

`decision_required` is legal only when no unique automatic decision remains.
After a human answers `decision_required`, control must return to the target and the target must resume automatic scheduling from current evidence.

## Human Interaction Rules

Questions must be written for humans, not for the internal controller.

Hard rules:

1. The system must not ask users about admission, closeout, sync, promote, or internal state machine choices.
2. Human questions may ask only about priority, scope boundary, delivery risk, or product direction.
3. If the target and current evidence allow exactly one legal next step, the system must continue without asking.
4. `decision_required` must be framed in natural language that a human can evaluate without knowing Blueprint internals.
5. A resolved human answer must not terminate control inside the question itself; it must feed back into target scheduling.

## Minimum Validation Invariants

Blueprint v1 is only valid when all are true:

1. `project-progress -> blueprint -> target -> execution queue` is the unique live resume chain.
2. Only one execution queue is active.
3. Candidate state is self-consistent across `candidate`, `prepared`, and `active`.
4. A transition queue is unique and bound to explicit candidate ids.
5. Queue completion does not stop the system while legal follow-up work remains.
6. Human-facing questions do not expose internal control semantics.
7. No field is treated as live truth if it can be stably derived from a downstream owner.

## Points Requiring Human Confirmation

Current recommended defaults are:

1. `prepared` should live inside the target's `candidate_queues` structure rather than in a separate queue document.
2. `decision_required` should trigger only after automatic reschedule, candidate return, target absorption, and transition-queue evaluation all fail to produce one unique next step.
3. Migration strategy should remain gradual, not destructive, with old live docs retired only after equivalent v1 truth exists.
