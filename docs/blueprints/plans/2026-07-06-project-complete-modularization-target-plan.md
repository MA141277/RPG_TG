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
- resume_gate: `idle-open`
- promotion_review_result: `none`
- blocked_by: []

## Human Context

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.state-sync-and-runtime-canonicalization` | `candidate` | `only if a fresh runtime/state ownership blocker is proven` | `Not currently justified.` |
| `queue.unified-contribution-intake-closeout` | `candidate` | `only if a fresh intake-path blocker is proven` | `Previously rejected on current evidence.` |
| `queue.playable-family-gap-audit` | `candidate` | `only if a still-live playable-family gap is proven` | `No active evidence today.` |
| `queue.framework-scaffold-and-template-closure` | `candidate` | `only if framework-owned authoring coverage is disproven` | `Accepted compatibility residue alone is insufficient.` |
| `queue.ui-runtime-contract-consumption` | `candidate` | `only if runtime-facing UI contract bypass is proven` | `No active evidence today.` |

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
6. `Sync target-level truth if queue closeout or promotion conditions changed.`
7. `Optionally mirror the result into change-log if a human-readable summary is warranted.`

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
