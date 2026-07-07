# Target Plan Title

## Control Block

- document_role: `target-governor`
- target_id: `target.replace-me`
- target_status: `open | done | archived`
- active_phase: `phase.replace-me`
- active_queue: `queue.replace-me | none`
- decision_state: `active-execution | promotion-review | idle-open | blocked`
- next_decision: `queue-admission-review | queue-closeout-or-return-to-target-review | same-target-admission-or-target-closeout | target-closeout | resolve-blocker`
- next_action: `classify-fresh-work | write-admission-review | activate-admitted-queue | resume-active-queue | auto-reconcile-active-task | write-queue-closeout | return-to-promotion-review | write-target-closeout | resolve-blocker`
- resume_gate: `open-active-queue | promotion-review | idle-open | blocked`
- promotion_review_result: `admit | reject | defer | block | none`
- review_subject_id: `item.replace-me | none`
- review_subject_classification: `queue-candidate | current-target-item | uncertain-needs-review | future-target-candidate | none`
- proposed_queue_id: `queue.replace-me | none`
- review_basis: `replace-with-written-evidence | none`
- admission_status: `none | pending | admitted | rejected | deferred | blocked`
- blocked_by: []

## Human Context

### Admission Review Record

- Scope approval:
  - `Record user scope approval here when it exists, but do not treat it as admission.`
- Admission basis:
  - `Record the evidence that justifies admit / reject / defer / block.`
- Required truth sync:
  - `Target plan admission fields must be written before implementation starts.`
  - `The admitted queue doc must exist before code implementation starts.`

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.replace-me` | `candidate` | `Replace with promotion trigger.` | `Replace with the current note.` |

Allowed `next_decision` values:

- `queue-admission-review`
- `queue-closeout-or-return-to-target-review`
- `same-target-admission-or-target-closeout`
- `target-closeout`
- `resolve-blocker`

Allowed `next_action` values:

- `classify-fresh-work`
- `write-admission-review`
- `activate-admitted-queue`
- `resume-active-queue`
- `auto-reconcile-active-task`
- `write-queue-closeout`
- `return-to-promotion-review`
- `write-target-closeout`
- `resolve-blocker`

### Post-Task Auto-Reconcile

1. `Run verify_with.`
2. `Check done_when.`
3. `Re-evaluate queue closeout.`
4. `Scan governance owners.`
5. `Scan residue.`
6. `If the next legal step is unique, continue directly into closeout or target review.`
7. `Optionally mirror the result into change-log.`

### Human Confirmation Constraint

- `At most one human-confirmation question may be asked per task.`
- `If docs/code can decide, do not ask.`
- `If only one legal branch exists, do not ask.`
- `Scope approval does not replace admission.`
- `Do not ask whether to perform closeout, promotion review, or doc sync when they are already the unique next legal step.`

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

### Prior Promotion Record

- `Replace with a short historical promotion record when needed.`
