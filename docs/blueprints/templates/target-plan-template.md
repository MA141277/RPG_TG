# Target Plan Title

## Control Block

- document_role: `target-governor`
- target_id: `target.replace-me`
- target_status: `open | done | archived`
- active_phase: `phase.replace-me`
- active_queue: `queue.replace-me | none`
- decision_state: `active-execution | promotion-review | idle-open | blocked`
- next_decision: `same-target-admission-or-target-closeout`
- next_action: `classify-fresh-work`
- resume_gate: `active-queue | promotion-review | idle-open | blocked`
- promotion_review_result: `promote | reject | defer | block | none`
- blocked_by: []

## Human Context

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.replace-me` | `candidate` | `Replace with promotion trigger.` | `Replace with the current note.` |

Allowed `next_decision` values:

- `same-target-admission-or-target-closeout`
- `queue-promotion`
- `target-closeout`
- `resolve-blocker`

Allowed `next_action` values:

- `classify-fresh-work`
- `promote-queue`
- `write-target-closeout`
- `return-to-idle-open`
- `resolve-blocker`

### Post-Task Auto-Reconcile

1. `Run verify_with.`
2. `Check done_when.`
3. `Re-evaluate queue closeout.`
4. `Scan governance owners.`
5. `Scan residue.`
6. `Sync target-level truth if required.`
7. `Optionally mirror the result into change-log.`

### Human Confirmation Throttle

- `At most one human-confirmation question may be asked per task.`
- `If the target/queue/task boundary can be resolved from current docs and code, do not ask.`
- `If an item is uncertain but would not change active truth, record uncertain-needs-review and stop without asking.`
- `If active truth would change and multiple mutually exclusive legal branches exist, one human escalation is allowed.`

### Git Integration Loop

1. `Draft the commit message as <type>: <brief title> plus a Summary: block with real bullets.`
2. `Run commit-message validation before commit.`
3. `Commit the working branch.`
4. `Push the working branch.`
5. `Merge into the latest mod-first-dev with the same commit-message summary rule.`
6. `Cut a fresh branch from the updated mod-first-dev.`
7. `Resume from integrated Blueprint truth, not branch-local memory.`

Mandatory merge loop triggers:

- `queue closeout`
- `target closeout`
- `explicit integration checkpoint`

### Queue Closeout Rules

- `next_effect = promote-next-queue`
- `next_effect = return-to-target-review`
- `next_effect = block-target`

### State Transition Rules

- `idle-open -> promotion-review`
- `promotion-review -> active-execution`
- `promotion-review -> idle-open`
- `promotion-review -> blocked`
- `active-execution -> promotion-review`
- `active-execution -> idle-open`

### Prior Promotion Record

- `Replace with a short historical promotion record when needed.`
