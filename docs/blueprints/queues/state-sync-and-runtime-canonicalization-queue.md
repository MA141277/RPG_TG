# State Sync And Runtime Canonicalization Queue

## Control Block

- queue_id: `queue.state-sync-and-runtime-canonicalization`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `active`
- queue_class: `conditional`
- active_task: `task.state-sync-and-runtime-canonicalization.baseline-reconcile`
- next_task: `task.state-sync-and-runtime-canonicalization.runtime-commit-canonicalization`
- closeout_status: `in-progress`
- next_effect: `return-to-target-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync has run for this newly admitted queue yet.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Close the remaining state-sync and runtime canonicalization gap by converging core runtime commit, bridge, request or result, and interactive compatibility ownership onto one bounded canonical core seam.`
- Forbidden expansions:
  - `Do not widen this queue into consumer-side registry seam closure.`
  - `Do not widen this queue into cross-mechanism composition, package normalization, or adapter cleanup that depends on later upstream work.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Canonicalize the core runtime commit and state-sync surface before downstream consumer seam and cleanup queues continue.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Freeze the smallest lawful first slice for runtime/state canonicalization and prove it is upstream to the remaining consumer-side seam work.`
- task_briefs:
  - `task.state-sync-and-runtime-canonicalization.baseline-reconcile: freeze the first lawful core canonicalization slice and confirm the queue remains bounded.`
  - `task.state-sync-and-runtime-canonicalization.runtime-commit-canonicalization: land the canonical core state-sync commit and request/result seam that replaces the current bridge-heavy transitional path.`
  - `task.state-sync-and-runtime-canonicalization.interactive-compat-closeout: retire the remaining covered interactive compatibility residue, verify the queue, and return control to target review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after the target plan synchronized the existing candidate identity and current bounded admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on core runtime canonicalization and must not silently absorb consumer registry imports, broader composition seams, or zhuyuanzhang package normalization.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or target truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or target scheduling truth.`

### Activation Order

1. `Target plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted canonicalization work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded runtime/state evidence remains valid.`
- `Resume from this queue doc and the target-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.state-sync-and-runtime-canonicalization.baseline-reconcile` | `active` | `Freeze the smallest lawful first canonicalization slice and confirm the admitted queue still stands on current source truth.` | `none` | `This active baseline task prevents the queue from widening into consumer seam closure or composition work before the first core runtime slice is frozen.` |
| `task.state-sync-and-runtime-canonicalization.runtime-commit-canonicalization` | `queued` | `Land the canonical state-sync commit and request/result seam that reduces bridge-heavy transitional runtime ownership.` | `task.state-sync-and-runtime-canonicalization.baseline-reconcile` | `This is the first implementation slice after the baseline freezes the bounded core seam.` |
| `task.state-sync-and-runtime-canonicalization.interactive-compat-closeout` | `queued` | `Retire the remaining covered interactive compatibility residue, verify the queue, and return control to target review.` | `task.state-sync-and-runtime-canonicalization.runtime-commit-canonicalization` | `This task closes the queue only after the covered canonical core runtime path no longer depends on legacy interactive compatibility glue.` |

### Task Definitions

#### `task.state-sync-and-runtime-canonicalization.baseline-reconcile`

##### Control Block

- task_id: `task.state-sync-and-runtime-canonicalization.baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/contracts/runtime-request.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/house-runtime.ts`
  - `src/core/runtime/interactive-runtime.ts`
  - `tests/**`
- must_inspect:
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/contracts/runtime-request.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/house-runtime.ts`
  - `src/core/runtime/interactive-runtime.ts`
  - `src/application/runtime/interactive-action-coordinator.ts`
  - `src/application/house/house-runtime.ts`
- must_not_change:
  - `consumer-side registry seam closure queue scope`
  - `cross-mechanism composition queue scope`
  - `zhuyuanzhang package normalization queue scope`
  - `dead-adapter deletion queue scope`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted runtime/state canonicalization boundary.`
  - `Queue-local evidence confirms this canonicalization work is upstream to the remaining consumer-side seam and cleanup candidates.`
  - `The first canonical core state-sync and runtime seam plus its initial covered writers are identified before implementation begins.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "RuntimeStateBridgeInput|RuntimeResultBridgeInput|createRuntimeBridgeState|applyRuntimeBridgeState|legacyInteractiveKind|createLegacyPlayableSession|RuntimeFollowUpContext|taskUpdates|interactive\\?:" src/core/runtime/state-sync-runtime.ts src/core/runtime/runtime-dispatch.ts src/core/contracts/runtime-request.ts src/core/contracts/runtime-result.ts src/core/contracts/house-runtime.ts src/core/runtime/interactive-runtime.ts`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to target review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.state-sync-and-runtime-canonicalization.runtime-commit-canonicalization`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to consumer seam closure, composition, or package normalization instead of canonical core runtime state ownership.`

##### Human Context

- task_brief:
  - `Freeze the smallest lawful first core runtime/state canonicalization slice before queue-local code work starts.`
- task_outcome_summary:
  - `Current active task; it remains open until the queue freezes the first bounded canonicalization seam and confirms this queue is upstream to the remaining consumer-side residue.`
- Purpose:
  - `Prevent the admitted queue from widening into downstream consumer seam work before the first lawful core runtime slice is frozen.`
- Failure mode:
  - `Do not jump into application consumer rewiring before the queue names the canonical core seam that those consumers should eventually depend on.`
- Fresh baseline findings:
  - `src/core/runtime/state-sync-runtime.ts still exposes RuntimeStateBridgeInput, RuntimeResultBridgeInput, createRuntimeBridgeState, and applyRuntimeBridgeState around the state-sync commit path, which proves the canonical core runtime state still depends on a bridge-owned compatibility layer instead of one settled commit surface.`
  - `src/core/runtime/runtime-dispatch.ts still stitches routed results through separate effect settlement, task settlement, and follow-up settlement while src/core/contracts/runtime-result.ts still carries parallel outcome, interactive, taskActions, taskSignals, and taskUpdates channels, so the covered runtime result contract is not yet collapsed onto one canonical post-route shape.`
  - `src/core/contracts/house-runtime.ts still preserves a parallel house request family while src/core/runtime/interactive-runtime.ts still derives interactive kinds from legacyInteractiveKind and reconstructs active sessions through createLegacyPlayableSession, which confirms the remaining residue is still core-runtime-owned compatibility work rather than just downstream application imports.`
  - `src/application/runtime/interactive-action-coordinator.ts, src/application/house/house-runtime.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/house-modules/medicine-house/medicine-house-house-module.ts, and src/application/presenter/stage-presenters.ts still import core runtime or builtin registries directly, but those are downstream consumer-side seams and should remain under queue.runtime-contract-registry-seam-closure rather than being absorbed here.`
- Frozen first slice:
  - `The first lawful implementation slice is to canonicalize the core-owned runtime commit bridge and request/result surface under src/core/runtime/state-sync-runtime.ts plus the adjacent runtime contracts, leaving application consumers on the old imports until the canonical core seam exists.`
  - `That first slice should reduce bridge-only helper families and settle the covered request/result ownership line without yet rewriting application consumers or builtin registry call sites.`
  - `Interactive compatibility retirement should stay as a later queue task because it depends on the canonical core state-sync and runtime result seam landing first, but it still remains in-queue because legacyInteractiveKind and createLegacyPlayableSession live inside covered core runtime ownership today.`

#### `task.state-sync-and-runtime-canonicalization.runtime-commit-canonicalization`

##### Control Block

- task_id: `task.state-sync-and-runtime-canonicalization.runtime-commit-canonicalization`
- state: `queued`
- task_kind: `execution`
- scope:
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/contracts/runtime-request.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/house-runtime.ts`
  - `src/core/contracts/runtime-state.ts`
  - `tests/**`
- must_inspect:
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/contracts/runtime-request.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/core/contracts/house-runtime.ts`
- must_not_change:
  - `application consumer import boundaries`
  - `cross-mechanism composition ownership`
  - `scenario-pack/package authoring boundaries`
- done_when:
  - `One bounded canonical core state-sync commit seam exists for the covered runtime path.`
  - `The first covered core runtime writers stop depending on bridge-only RuntimeStateBridgeInput or RuntimeResultBridgeInput compatibility shapes as primary truth.`
  - `Parallel covered request/result ownership is reduced rather than extended on the canonical path.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of reopening target-level candidate discovery.`
  - `Do not widen into application consumer rewiring just to force this task through.`
- promote_next_if_done: `task.state-sync-and-runtime-canonicalization.interactive-compat-closeout`
- stop_if:
  - `The required seam expands into a broader consumer or composition controller rather than a bounded canonical core runtime contract.`

##### Human Context

- task_brief:
  - `Land the bounded canonical core runtime commit and request/result seam that replaces the current bridge-heavy transitional path.`
- task_outcome_summary:
  - `Queued task; it starts only after the active baseline task freezes the first lawful canonicalization slice.`
- Purpose:
  - `Move the admitted queue from source-backed bridge residue to one reusable canonical core runtime state-sync seam.`
- Failure mode:
  - `Do not pull application consumers or registry rewiring into this task before the core seam itself is stable.`

#### `task.state-sync-and-runtime-canonicalization.interactive-compat-closeout`

##### Control Block

- task_id: `task.state-sync-and-runtime-canonicalization.interactive-compat-closeout`
- state: `queued`
- task_kind: `execution`
- scope:
  - `src/core/runtime/interactive-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/runtime/playable-runtime-registries.ts`
  - `src/core/contracts/interactive-runtime.ts`
  - `src/core/contracts/runtime-request.ts`
  - `docs/blueprints/**`
  - `tests/**`
- must_inspect:
  - `src/core/runtime/interactive-runtime.ts`
  - `src/core/runtime/playable-runtime.ts`
  - `src/core/runtime/playable-runtime-registries.ts`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/state-sync-and-runtime-canonicalization-queue.md`
- must_not_change:
  - `application consumer direct-import residue tracked by queue.runtime-contract-registry-seam-closure`
  - `broader runtime-composition ownership`
  - `package normalization and content assembly work`
- done_when:
  - `Covered core interactive runtime paths no longer depend on legacyInteractiveKind or createLegacyPlayableSession as live canonical compatibility glue.`
  - `Queue truth, target truth, and verification are synchronized before returning control to target review.`
  - `The queue either closes with written evidence or records a concrete blocker without leaving ambiguous live state.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the blocker explicitly in this queue doc.`
  - `Do not declare closeout while the covered core runtime path still depends on legacy interactive compatibility glue.`
- promote_next_if_done: `none`
- stop_if:
  - `Required verification has not passed.`

##### Human Context

- task_brief:
  - `Retire the remaining covered interactive compatibility residue, verify the queue, and close it only after governance sync passes.`
- task_outcome_summary:
  - `Queued closeout task; it runs only after the canonical core runtime seam is landed on the covered path.`
- Purpose:
  - `Finish the admitted queue by proving the covered core runtime path has one canonical state-sync and interactive ownership line.`
- Failure mode:
  - `Do not close the queue while legacy interactive compatibility glue still anchors the covered core runtime path.`

## Progress Log

- 2026-07-08
  - Summary: `Admitted queue.state-sync-and-runtime-canonicalization as the single active queue because the target still records bounded, source-backed core runtime bridge and canonicalization residue, and that residue is upstream to the remaining consumer-side seam and cleanup candidates.`
  - Verification: `Blueprint target-plan review plus fresh source inspection across src/core/runtime/state-sync-runtime.ts, src/core/runtime/runtime-dispatch.ts, src/core/contracts/runtime-request.ts, src/core/contracts/runtime-result.ts, src/core/contracts/house-runtime.ts, src/core/runtime/interactive-runtime.ts, src/application/runtime/interactive-action-coordinator.ts, and src/application/house/house-runtime.ts`
  - Next at this time: `Execute task.state-sync-and-runtime-canonicalization.baseline-reconcile before queue-local implementation starts.`
