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

### Target Lifecycle Rules

- `A current open target stays open until target closeout is explicitly confirmed and written into this target plan.`
- `If active_queue = none, that does not close the target; it only returns the target to promotion-review or idle-open.`
- `As long as target_status = open, additional same-target queues may still be admitted.`
- `If no open target exists, target creation becomes the required next governance action before any queue admission or implementation can begin.`
- `Queue closeout may auto-advance; target closeout must not be inferred from queue completion alone.`
- `When target acceptance and closeout conditions are satisfied, ask exactly one human confirmation before changing target_status to done.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> target plan -> active queue before touching a fresh queue item.`
2. `Check whether an active queue already exists.`
3. `If one exists, decide whether the new item can be absorbed without widening queue scope.`
4. `Classify the item before any queue creation or implementation.`
5. `If the item is queue-candidate, write review_subject_id / review_subject_classification / proposed_queue_id / review_basis / admission_status first.`
6. `Only after target-plan admission sync may a queue doc be created and activated.`
7. `Only after the admitted queue doc exposes queue_status=active plus a live active_task may implementation start.`
8. `User scope approval is boundary approval only; it does not replace admission.`

### Candidate Recovery Ledger

| Candidate ID | Last Classification | Proposed Queue | Latest Disposition | Recheck Trigger | Notes |
| --- | --- | --- | --- | --- | --- |
| `item.replace-me` | `queue-candidate` | `queue.replace-me` | `deferred` | `only if new evidence invalidates the old basis or changes queue absorption` | `Use this ledger to resume admission from existing evidence rather than restarting from scratch.` |

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

### Candidate Recovery Rule

- `If a queue-candidate is already recorded in the target plan or candidate recovery ledger, resume from that record by default.`
- `Only restart a full re-audit when new material evidence invalidates the prior classification or review basis.`
- `Do not use prose-only memory as the recovery source when structured admission truth already exists.`

### Single-Active-Queue Rule

- `When execution_mode=single-active-task and allow_parallel=false, an active queue blocks live admission review for a second queue.`
- `If a fresh item cannot be absorbed by the current active queue, record it as a candidate for later rather than activating a second queue.`
- `Return to target-level review only after the current active queue closes.`

### Post-Task Auto-Reconcile

1. `Run verify_with.`
2. `Check done_when.`
3. `Write the task after-state, queue truth, and any required target truth before any repository sync begins.`
4. `Re-evaluate queue closeout.`
5. `Scan governance owners.`
6. `Scan residue.`
7. `Trigger one minimum repository sync batch after the docs are updated.`
8. `If the next legal step is unique, continue directly into closeout or target review once the sync attempt returns a result.`
9. `Optionally mirror the result into change-log.`

### Human Confirmation Constraint

- `At most one human-confirmation question may be asked per task.`
- `If docs/code can decide, do not ask.`
- `If only one legal branch exists, do not ask.`
- `Scope approval does not replace admission.`
- `Do not ask whether to perform closeout, promotion review, or doc sync when they are already the unique next legal step.`
- `Do not raise decision_required merely because repository sync failed.`
- `Do not ask about a merge conflict when current target truth already uniquely decides the legal resolution.`
- `Ask only when the baseline is ambiguous or when merge-conflict handling has multiple mutually exclusive legal resolutions that current target truth cannot decide alone.`
- `Exception: target closeout requires explicit human confirmation before target_status changes from open to done.`

### Repository Sync Policy

- `Git sync is non-governing.`
- `commit / push / merge must not change queue truth, target truth, candidate truth, or transition truth.`
- `push / merge must not become a queue closeout gate.`
- `push / merge must not become a target closeout gate.`
- `Task execution conclusions are written first; repository sync runs second.`
- `A failed sync attempt is recorded only as repository sync result in the queue-local sync record.`
- `A merge conflict is a repository sync event; it must not rewrite the already-recorded task, queue, or target conclusion.`
- `If current target truth uniquely decides the merge conflict direction, resolve it without asking.`
- `Target scheduling must not read sync_status, sync_scope, or sync_summary as live truth.`

### Minimum Repository Sync Batch

1. `Draft the commit message as <type>: <brief title> plus a Summary: block with real bullets.`
2. `Run commit-message validation before commit.`
3. `Commit the working branch.`
4. `Push the working branch.`
5. `Merge into the latest baseline branch.`
6. `Push the baseline branch.`
7. `Resume from the written Blueprint truth after the sync attempt returns success or failure.`

### Prior Promotion Record

- `Replace with a short historical promotion record when needed.`
