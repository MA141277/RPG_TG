# Project Complete Modularization Target Plan

## Control Block

- document_role: `target-governor`
- target_id: `target.project-complete-modularization`
- target_status: `open`
- active_phase: `phase.final-acceptance`
- active_queue: `none`
- decision_state: `idle-open`
- next_decision: `same-target-admission-or-target-closeout`
- next_action: `classify-fresh-work`
- resume_gate: `open-target-no-active-queue`
- promotion_review_result: `none`
- review_subject_id: `none`
- review_subject_classification: `none`
- proposed_queue_id: `none`
- review_basis: `none`
- admission_status: `none`
- blocked_by: []

## Human Context

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.state-sync-and-runtime-canonicalization` | `candidate` | `only if a fresh runtime/state ownership blocker is proven` | `Not currently justified.` |
| `queue.unified-contribution-intake-closeout` | `candidate` | `only if a fresh intake-path blocker is proven` | `Previously rejected on current evidence.` |
| `queue.playable-family-gap-audit` | `candidate` | `only if a still-live playable-family gap is proven` | `No active evidence today.` |
| `queue.framework-scaffold-and-template-closure` | `candidate` | `only if framework-owned authoring coverage is disproven` | `Accepted compatibility residue alone is insufficient.` |
| `queue.ui-runtime-contract-consumption` | `closed` | `only if runtime-facing UI contract bypass is proven` | `Closed on 2026-07-07 after the bounded shared-dialog replacement landed and verification passed.` |

### Admission Review Record

- Scope approval:
  - `The bounded dialog-unification scope was user-approved as scope only.`
  - `That scope approval is not treated as queue admission truth.`
- Admission basis:
  - `queue.ui-runtime-contract-consumption was admitted only after the target plan and queue doc were synchronized with written runtime-facing UI contract bypass evidence.`
- Current review subject:
  - `none`
- Current handoff:
  - `queue.ui-runtime-contract-consumption is closed; the target remains open with no active queue and may still admit additional same-target queues until explicit human target closeout confirmation is written.`

### Queue Admission Startup Rules

1. `Read project-progress -> blueprint -> target plan -> active queue before evaluating a fresh queue item.`
2. `If an active queue exists, test whether the new item can be absorbed before considering a new queue.`
3. `If the item becomes queue-candidate, write target-plan review truth before any queue activation or implementation begins.`
4. `User scope approval remains scope approval only and must not be treated as queue admission.`

### Candidate Recovery Rule

- `Use this target plan's existing queue promotion ledger and prior review fields as the default recovery source for previously recorded queue-candidates.`
- `Do not restart a full re-audit unless new material evidence invalidates the prior classification or admission basis.`

### Target Lifecycle Rules

- `This target stays open until target closeout is explicitly confirmed and written into target-level truth.`
- `active_queue = none does not close the target; it only returns the target to idle-open or promotion-review.`
- `As long as this target remains open, additional same-target queues may still be admitted.`
- `Only when target acceptance is satisfied and no active queue remains may one explicit target-closeout confirmation be asked.`
- `If target closeout is not explicitly confirmed, keep the target open and continue using same-target admission review for new queue work.`

### Queue Closeout Rules

- `next_effect = promote-next-queue`
- `next_effect = return-to-target-review`
- `next_effect = block-target`

Optional mirror:

- `docs/change-log.md` may be updated after governance truth is already synchronized`

### Post-Task Auto-Reconcile

1. `Run verify_with for the completed task.`
2. `Check done_when.`
3. `Re-evaluate whether the queue should continue, close, or block.`
4. `Scan governance owners: project-progress, blueprint, target spec, target plan, queue doc, and affected shared contracts.`
5. `Scan residue: tracked leftovers, untracked drafts, unsynced truth, and out-of-scope remains.`
6. `If verification passed and the next legal execution point is unique, continue directly into queue closeout or target-review handoff.`
7. `Sync target-level truth if queue closeout or promotion conditions changed.`
8. `Optionally mirror the result into change-log if a human-readable summary is warranted.`

### Human Confirmation Throttle

- `At most one human-confirmation question may be asked per task.`
- `If the target/queue/task boundary can be resolved from current docs and code, do not ask.`
- `If an item is uncertain but would not change active truth, record uncertain-needs-review and stop without asking.`
- `If active truth would change and multiple mutually exclusive legal branches exist, one human escalation is allowed.`
- `Do not treat user scope approval as queue admission.`
- `Do not ask whether to do closeout, promotion review, or doc sync when they are already the unique next legal step.`
- `Exception: target closeout still requires explicit human confirmation before target_status changes to done.`

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

### State Transition Rules

- `idle-open -> promotion-review`
  - `when a queue-candidate has sufficient evidence and target-level admission is required`
- `promotion-review -> active-execution`
  - `when a queue is formally promoted and written into this plan`
- `promotion-review -> idle-open`
  - `when the review result is reject or defer and no queue is admitted`
- `promotion-review -> blocked`
  - `when decision requires external blocker resolution or explicit user choice`
- `active-execution -> promotion-review`
  - `when an active queue closes and an admission decision is pending`
- `active-execution -> idle-open`
  - `when an active queue closes and no admission decision is pending`

### Prior Promotion Record

- `2026-07-06: queue.unified-contribution-intake-closeout was rejected on current evidence and remained a conditional fallback only.`
- `2026-07-06 to 2026-07-07: authoring, residue, acceptance-proof, and final-acceptance queues were closed as bounded queue records rather than target-level truth.`
- `2026-07-07: target closeout was intentionally pulled back to open + idle-open so same-target queue admission remains legal until explicit target closeout is written.`
- `2026-07-07: queue.ui-runtime-contract-consumption was admitted after a bounded dialog-component audit proved still-live runtime-facing UI contract bypass on the covered path.`
- `2026-07-07: queue.ui-runtime-contract-consumption was closed after the bounded shared-dialog component landed, approved replacement points were consumed, and verification passed; target state returned to open with no active queue.`
