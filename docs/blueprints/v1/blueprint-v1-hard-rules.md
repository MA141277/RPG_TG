# Blueprint v1 Hard Rules

## Core Principle

- `Blueprint execution state is determined by execution semantics only.`
- `Task, queue, and target conclusions must be written from done_when, verify_with, failure ownership, candidate_queues, transition_queue, artifact_rules, and other execution truth only.`
- `commit / push / merge are non-governing and must not directly change Blueprint queue or target state.`

## Post-Task Ordering

1. `Finish the task and decide the execution conclusion first.`
2. `Write the task after-state, queue truth, and any required target truth first.`
3. `Only after the execution state is written may repository sync begin.`
4. `Repository sync completion or failure must not rewrite the task conclusion that was already recorded.`
- `Task state must be written before repository sync starts.`
- `Task write state must be finalized before repository sync starts.`

## Minimal Unit Sync

- `After every terminal task outcome, once the relevant Blueprint docs are updated, trigger exactly one minimum repository sync batch.`
- `This applies equally to done, blocked, escalated-to-target, dropped, and any other legal terminal task state.`
- `The minimum repository sync batch contains: commit, push current branch, merge into baseline, and push baseline.`
- `Blueprint scheduling continues once the sync attempt returns a result; it does not wait for sync success.`

## Non-Governing Git Rules

- `push / merge success must not become a queue closeout gate.`
- `push / merge success must not become a target closeout gate.`
- `push / merge failure must not change queue_status, closeout_status, decision_state, next_decision, or next_action.`
- `A merge conflict is a repository sync event, not a Blueprint execution-state event.`
- `A merge conflict must not rewrite the task conclusion that was already recorded.`
- `A queue that is already done must not reopen to active because repository sync failed.`
- `A blocked queue may still commit, push, merge, and record the repository sync result.`
- `Repository sync failure is recorded only as repository sync result.`
- `Repository sync failure must not be rewritten as queue-local blocker, target-level blocker, repository/global verification failure, or decision_required.`
- `Merge conflict handling result must be recorded only in the queue-local sync record.`

## Human Confirmation Boundary

- `Do not ask whether Blueprint should continue merely because push or merge failed.`
- `Do not ask about a merge conflict when current target truth already uniquely decides the legal resolution.`
- `Ask only when baseline is ambiguous or when merge conflict handling has multiple mutually exclusive legal resolutions that the current target truth cannot uniquely decide.`
