# Blueprint v1 Live Truth Templates

## Truth Ownership

- `project-progress owns repository entry only.`
- `blueprint owns the current target pointer and registry only.`
- `target plan owns target scheduling truth only.`
- `execution queue owns queue execution truth and the queue-local sync record.`

## Queue-Local Sync Record

- `The queue-local sync record is the only place that may store repository sync result for the latest task after-state.`
- `The minimum record is: sync_status, sync_scope, sync_summary.`
- `sync_status = pending | success | failed.`
- `sync_scope = branch-push | baseline-merge | baseline-push | none.`
- `sync_summary = a short plain-language summary of the latest repository sync result.`

## Non-Ownership Rules

- `The target must not own sync_status, sync_scope, or sync_summary.`
- `The target must not mirror repository sync result into active truth, candidate truth, transition truth, or closeout truth.`
- `project-progress, blueprint, and target spec must not mirror the queue-local sync record either.`

## Scheduling Boundary

- `Target scheduling must not read sync_status, sync_scope, or sync_summary as admission or closeout truth.`
- `Queue and target transitions must continue to read done_signal, verify_with, failure ownership, candidate_queues, transition_queue, artifact_rules, and done_when instead.`
- `Repository sync result may explain what happened after the task after-state was written, but it must not govern what happens next.`
