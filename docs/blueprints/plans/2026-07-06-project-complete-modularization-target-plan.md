# Project Complete Modularization Target Plan

## Control Block

- document_role: `target-governor`
- target_id: `target.project-complete-modularization`
- target_status: `open`
- active_phase: `phase.final-acceptance`
- active_queue: `none`
- decision_state: `promotion-review`
- next_decision: `queue-admission-review`
- next_action: `return-to-promotion-review`
- resume_gate: `open-target-no-active-queue`
- promotion_review_result: `none`
- review_subject_id: `queue.main-shell-and-layout-editor-ownerization`
- review_subject_classification: `blocked-queue-closeout`
- proposed_queue_id: `none`
- review_basis: `queue-closeout blocked only by the known repository-wide import.meta and ?url asset typing/configuration gap outside the finished queue slice`
- admission_status: `none`
- blocked_by: []

## Human Context

### Queue Promotion Ledger

| Queue ID | Current Disposition | Promote When | Notes |
| --- | --- | --- | --- |
| `queue.state-sync-and-runtime-canonicalization` | `candidate` | `only if a fresh runtime/state ownership blocker is proven` | `Not currently justified.` |
| `queue.unified-contribution-intake-closeout` | `candidate` | `only if a fresh intake-path blocker is proven` | `Previously rejected on current evidence.` |
| `queue.playable-family-gap-audit` | `closed` | `only if a still-live playable-family gap is proven` | `Closed on 2026-07-07 after playable contribution truth and activation-configurable default runtime registries landed and verification passed.` |
| `queue.framework-scaffold-and-template-closure` | `candidate` | `only if framework-owned authoring coverage is disproven` | `Accepted compatibility residue alone is insufficient.` |
| `queue.ui-runtime-contract-consumption` | `closed` | `only if runtime-facing UI contract bypass is proven` | `Closed on 2026-07-07 after the bounded shared-dialog replacement landed and verification passed.` |
| `queue.main-shell-and-layout-editor-ownerization` | `blocked` | `only if fresh evidence proves main.ts still owns non-shell UI/editor state decisions and the layout editor still lacks an independent owner line` | `Admitted on 2026-07-07 after fresh main.ts evidence proved the shell/editor owner line is still live on the covered production path; queue-local ownerization work is now complete on current evidence, but queue closeout is blocked by the known repository-wide import.meta and ?url asset typing/configuration gap outside this slice.` |

### Admission Review Record

- Scope approval:
  - `The bounded dialog-unification scope was user-approved as scope only.`
  - `That scope approval is not treated as queue admission truth.`
- Admission basis:
  - `queue.ui-runtime-contract-consumption was admitted only after the target plan and queue doc were synchronized with written runtime-facing UI contract bypass evidence.`
  - `queue.playable-family-gap-audit was admitted because src/core/contracts/gameplay-contribution.ts and src/core/contracts/mod-manifest.ts exposed no playable-family contribution contract, while src/core/runtime/playable-runtime.ts still fell back to builtin playable registries and the builtin playable definition/integration registries still seeded covered production playables directly.`
  - `queue.main-shell-and-layout-editor-ownerization was admitted because src/main.ts still owned layout editor behavior, render scheduling ownership, and too many business-driven render triggers on the covered production path.`
- Current review subject:
  - `queue.main-shell-and-layout-editor-ownerization`
- Current handoff:
  - `queue.main-shell-and-layout-editor-ownerization is no longer active. Fresh source audit proved that src/main.ts has reached the accepted pure-shell line for this queue, so no further bounded ownerization batch is justified on current evidence.`
  - `Queue closeout was attempted, but npm test still fails only on the known repository-wide import.meta and ?url asset typing/configuration blocker outside this queue slice, so the queue is now recorded as blocked rather than silently left active or falsely closed as passed.`
  - `Target control therefore returns to promotion review with no active queue. This round does not auto-promote queue.state-sync-and-runtime-canonicalization, queue.unified-contribution-intake-closeout, or queue.framework-scaffold-and-template-closure because no new admission basis has been written yet.`
- `The covered overlay/inventory/city-menu click family now routes through application/ui/app-click-coordinator.ts, the covered activity-qte/scene/story-battle action family now routes through application/runtime/interactive-action-coordinator.ts, the bounded campaign-travel owner family now routes through application/runtime/campaign-travel-coordinator.ts, the bounded map-auto-advance owner family now routes through application/runtime/map-auto-advance-coordinator.ts, the bounded city/house transition plus access-refusal owner family now routes through application/runtime/city-house-transition-coordinator.ts, the bounded council-priority plus city-begging owner family now routes through application/runtime/council-priority-city-begging-coordinator.ts, the bounded city-directory or leader-residence plus related house-side transition entry owner family now routes through application/runtime/city-directory-leader-residence-coordinator.ts, the bounded mapped city-3d or scene-object house entry owner family now routes through application/runtime/city-3d-house-entry-coordinator.ts, the bounded house drag/drop shell write owner family now routes through application/runtime/house-drag-drop-coordinator.ts, the bounded campaign move animation helper owner family now routes through application/runtime/campaign-move-animation-coordinator.ts, the bounded startup/session apply wiring owner family now routes through application/startup/startup-session-apply-coordinator.ts, and the bounded shell-side boot/lifecycle assembly owner family now routes through application/startup/shell-boot-lifecycle-coordinator.ts.`
- `This round was a fresh source audit rather than a new extraction batch. Fresh source evidence now shows the remaining src/main.ts shell residue is limited to accepted pure-shell responsibilities only: DOM root lookup, dependency/coordinator assembly, startup entry registration, top-level browser event registration, lifecycle boot or destroy primitives, and loading-screen primitive helpers.`
- `queue.main-shell-and-layout-editor-ownerization is no longer an active execution queue. Its bounded ownerization goal is complete on current evidence, but queue closeout is blocked because npm test still fails only on the known repository-wide import.meta and ?url asset typing/configuration gap outside the finished queue slice.`
  - `Fresh verification on 2026-07-08 kept npm run lint:blueprints and npm run typecheck passing; npm test still fails only through the existing build:test asset/tooling blocker outside this queue slice.`

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
3. `Write the task after-state, queue truth, and any required target truth before any repository sync begins.`
4. `Re-evaluate whether the queue should continue, close, or block.`
5. `Scan governance owners: project-progress, blueprint, target spec, target plan, queue doc, and affected shared contracts.`
6. `Scan residue: tracked leftovers, untracked drafts, unsynced truth, and out-of-scope remains.`
7. `Run one minimum repository sync batch after the docs are updated.`
8. `If the next legal execution point is unique, continue directly into queue closeout or target-review handoff once the sync attempt returns a result.`
9. `Sync target-level truth if queue closeout or promotion conditions changed.`
10. `Optionally mirror the result into change-log if a human-readable summary is warranted.`

### Human Confirmation Throttle

- `At most one human-confirmation question may be asked per task.`
- `If the target/queue/task boundary can be resolved from current docs and code, do not ask.`
- `If an item is uncertain but would not change active truth, record uncertain-needs-review and stop without asking.`
- `If active truth would change and multiple mutually exclusive legal branches exist, one human escalation is allowed.`
- `Do not treat user scope approval as queue admission.`
- `Do not ask whether to do closeout, promotion review, or doc sync when they are already the unique next legal step.`
- `Do not raise decision_required merely because repository sync failed.`
- `Do not ask about a merge conflict when current target truth already uniquely decides the legal resolution.`
- `Ask only when the baseline is ambiguous or when merge-conflict handling has multiple mutually exclusive legal resolutions that current target truth cannot decide alone.`
- `Exception: target closeout still requires explicit human confirmation before target_status changes to done.`

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
5. `Merge into the latest mod-first-dev baseline.`
6. `Push mod-first-dev baseline.`
7. `Resume from the written Blueprint truth after the sync attempt returns success or failure.`

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
- `2026-07-07: queue.playable-family-gap-audit was admitted after fresh evidence proved the playable family still lacks a shared mod contribution contract and still relies on builtin registry seed + runtime fallback on the covered production path.`
- `2026-07-07: queue.playable-family-gap-audit was closed after playable contribution truth and activation-configurable default runtime registries landed, and verification passed; target state returned to open with no active queue.`
- `2026-07-07: queue.main-shell-and-layout-editor-ownerization was admitted after fresh evidence proved src/main.ts still owns non-shell layout editor behavior, render scheduling ownership, and runtime layout baseline bootstrap on the covered production path.`
- `2026-07-08: queue.main-shell-and-layout-editor-ownerization ownerization work reached the accepted pure-shell line on fresh source evidence, but queue closeout was blocked because npm test still fails only on the known repository-wide import.meta and ?url asset typing/configuration gap outside that finished queue slice; target state returned to promotion review with no active queue.`
