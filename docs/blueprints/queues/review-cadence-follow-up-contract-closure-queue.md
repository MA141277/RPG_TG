# Review Cadence Follow-Up Contract Closure Queue

## Control Block

- queue_id: `queue.review-cadence-follow-up-contract-closure`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `active`
- queue_class: `conditional`
- active_task: `task.review-cadence-follow-up-contract-closure.boundary-baseline-reconcile`
- next_task: `task.review-cadence-follow-up-contract-closure.shared-review-contract-extraction`
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
  - `Close the shared review cadence contract gap by converging review activation, lateness, host routing, visibility or gating, and follow-up writeback onto one bounded shared mechanism surface.`
- Forbidden expansions:
  - `Do not widen this queue into the broader cross-mechanism composition queue.`
  - `Do not create a new review sub-runtime or a runtime-owned page layout controller.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Supporting boundary spec:
  - `docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md`

### Queue Snapshot

- queue_goal: `Unify today's review cadence into one shared review mechanism contract without widening into a broader composition rewrite.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Freeze the smallest lawful first implementation slice for the admitted review cadence queue before queue-local code work starts.`
- task_briefs:
  - `task.review-cadence-follow-up-contract-closure.boundary-baseline-reconcile: freeze the smallest lawful first shared-review slice and confirm the queue boundary still holds on current source truth.`
  - `task.review-cadence-follow-up-contract-closure.shared-review-contract-extraction: land the bounded shared review state and policy seam that replaces fragmented cadence truth writers.`
  - `task.review-cadence-follow-up-contract-closure.host-consumer-closeout: convert host and non-host consumers onto the shared review contract, verify the queue, and return control to target review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after the target plan synced the existing candidate identity and current bounded admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on the shared review cadence surface and must not silently absorb broader composition, runtime canonicalization, or scenario-pack normalization work.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or target truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or target scheduling truth.`

### Activation Order

1. `Target plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted cadence work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded cadence evidence and support spec remain valid.`
- `Resume from this queue doc and the target-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.review-cadence-follow-up-contract-closure.boundary-baseline-reconcile` | `active` | `Freeze the smallest lawful first implementation slice and confirm the admitted cadence queue still stands on current source truth.` | `none` | `This baseline task guards against silently widening into the broader composition queue before queue-local implementation starts.` |
| `task.review-cadence-follow-up-contract-closure.shared-review-contract-extraction` | `queued` | `Introduce the bounded shared review state and policy seam and migrate the first covered cadence writers onto it.` | `task.review-cadence-follow-up-contract-closure.boundary-baseline-reconcile` | `This is the first execution slice once the active task freezes the lawful cut.` |
| `task.review-cadence-follow-up-contract-closure.host-consumer-closeout` | `queued` | `Convert host or non-host consumers to the shared review contract, verify the queue, and return control to target review.` | `task.review-cadence-follow-up-contract-closure.shared-review-contract-extraction` | `This task closes the queue only after the shared cadence contract is consumed on the covered path.` |

### Task Definitions

#### `task.review-cadence-follow-up-contract-closure.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.review-cadence-follow-up-contract-closure.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/runtime/council-priority-city-begging-coordinator.ts`
  - `src/application/story-battle/story-battle-runtime.ts`
  - `src/application/time/time-progression.ts`
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/application/house-modules/home-house/home-house-house-module.ts`
  - `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - `src/main.ts`
- must_inspect:
  - `docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/runtime/council-priority-city-begging-coordinator.ts`
  - `src/application/story-battle/story-battle-runtime.ts`
  - `src/application/time/time-progression.ts`
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/application/house-modules/home-house/home-house-house-module.ts`
  - `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - `src/main.ts`
- must_not_change:
  - `cross-mechanism-composition queue scope`
  - `runtime canonicalization queue scope`
  - `new review sub-runtime scope`
  - `scenario-pack editor-prep scope`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted shared-review boundary.`
  - `Queue-local evidence confirms the review cadence work can proceed without being reclassified into the broader cross-mechanism composition queue.`
  - `The first shared state and policy seam plus its initial covered writers are identified before implementation begins.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "reviewCountdown|reviewDateText|mainHouseMissionText|councilDate|council-arrival" src/application/runtime/navigation-time-follow-up.ts src/application/runtime/council-priority-city-begging-coordinator.ts src/application/story-battle/story-battle-runtime.ts src/application/time/time-progression.ts src/application/house-modules/keep-house/keep-house-house-module.ts src/application/house-modules/home-house/home-house-house-module.ts src/application/house-modules/temple-house/temple-house-house-module.ts src/main.ts`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to target review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.review-cadence-follow-up-contract-closure.shared-review-contract-extraction`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to another queue family instead of the admitted cadence boundary.`

##### Human Context

- task_brief:
  - `Freeze the smallest lawful first shared-review implementation slice before queue-local code work starts.`
- task_outcome_summary:
  - `Current active task; it remains open until the queue names the first bounded shared-review seam and confirms the admitted queue boundary still holds.`
- Purpose:
  - `Prevent the admitted queue from widening into broader composition or runtime cleanup before the first lawful cadence slice is frozen.`
- Failure mode:
  - `Do not jump into scattered refactors before the queue documents exactly which shared review seam lands first.`

#### `task.review-cadence-follow-up-contract-closure.shared-review-contract-extraction`

##### Control Block

- task_id: `task.review-cadence-follow-up-contract-closure.shared-review-contract-extraction`
- state: `queued`
- task_kind: `execution`
- scope:
  - `src/domain/review/**`
  - `src/application/review/**`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/runtime/council-priority-city-begging-coordinator.ts`
  - `src/application/story-battle/story-battle-runtime.ts`
  - `src/application/time/time-progression.ts`
  - `src/domain/game-state.ts`
  - `tests/**`
- must_inspect:
  - `docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md`
  - `src/domain/game-state.ts`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `src/application/story-battle/story-battle-runtime.ts`
  - `src/application/time/time-progression.ts`
- must_not_change:
  - `host page layout ownership`
  - `new standalone runtime family`
  - `out-of-scope scenario pack normalization`
- done_when:
  - `One bounded shared review state and policy seam exists for the covered cadence truth.`
  - `The first covered review writers stop mutating reviewCountdown or reviewDateText or mainHouseMissionText or councilDate independently on the covered path.`
  - `Compatibility mirrors, if still needed, are explicitly derived or transitional rather than left as multi-writer truth.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of reopening target-level candidate discovery.`
  - `Do not widen into host-layout or broader composition rewrites just to force this task through.`
- promote_next_if_done: `task.review-cadence-follow-up-contract-closure.host-consumer-closeout`
- stop_if:
  - `The required seam expands into a broader cross-mechanism controller rather than a bounded shared review contract.`

##### Human Context

- task_brief:
  - `Land the bounded shared review state and policy seam that replaces the fragmented cadence truth writers.`
- task_outcome_summary:
  - `Queued task; it starts only after the active baseline task freezes the first lawful implementation slice.`
- Purpose:
  - `Move the admitted cadence queue from source-backed fragmentation evidence to one reusable shared review contract.`
- Failure mode:
  - `Do not centralize page layout branches in runtime while extracting the shared review mechanism seam.`

#### `task.review-cadence-follow-up-contract-closure.host-consumer-closeout`

##### Control Block

- task_id: `task.review-cadence-follow-up-contract-closure.host-consumer-closeout`
- state: `queued`
- task_kind: `execution`
- scope:
  - `src/application/house-modules/keep-house/**`
  - `src/application/house-modules/temple-house/**`
  - `src/application/house-modules/home-house/**`
  - `src/application/runtime/navigation-time-follow-up.ts`
  - `docs/blueprints/**`
  - `tests/**`
- must_inspect:
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - `src/application/house-modules/home-house/home-house-house-module.ts`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/review-cadence-follow-up-contract-closure-queue.md`
- must_not_change:
  - `target closeout truth`
  - `new unrelated queue promotion`
  - `scenario-pack editor work`
- done_when:
  - `Covered host and non-host consumers now consume shared review cadence decisions instead of owner-local cadence rewrites.`
  - `Queue truth, target truth, and verification are synchronized before returning control to target review.`
  - `The queue either closes with written evidence or records a concrete blocker without leaving ambiguous live state.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the blocker explicitly in this queue doc.`
  - `Do not declare closeout while keep-house or temple-house still own the review lifecycle skeleton.`
- promote_next_if_done: `none`
- stop_if:
  - `Required verification has not passed.`

##### Human Context

- task_brief:
  - `Convert covered consumers onto the shared review contract and close the queue only after verification and governance sync pass.`
- task_outcome_summary:
  - `Queued closeout task; it runs only after the shared review contract is landed on the covered path.`
- Purpose:
  - `Finish the admitted queue by proving host rendering stays local while cadence truth becomes shared.`
- Failure mode:
  - `Do not close the queue while keep-house or temple-house still own the review lifecycle skeleton on the covered path.`

## Progress Log

- 2026-07-08
  - Summary: `Admitted queue.review-cadence-follow-up-contract-closure as the single active queue because the target already records bounded, source-backed review cadence fragmentation and the new support spec now freezes the lawful shared-mechanism boundary.`
  - Verification: `Blueprint target-plan review plus docs/blueprints/specs/2026-07-08-review-cadence-follow-up-shared-review-support-spec.md`
  - Next at this time: `Execute task.review-cadence-follow-up-contract-closure.boundary-baseline-reconcile before queue-local implementation starts.`
