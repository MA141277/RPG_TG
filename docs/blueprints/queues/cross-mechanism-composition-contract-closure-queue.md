# Cross-Mechanism Composition Contract Closure Queue

## Control Block

- queue_id: `queue.cross-mechanism-composition-contract-closure`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue closeout truth is synchronized locally; minimum repository sync has not run yet for this completed queue.`
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
  - `Close the remaining cross-mechanism composition owner line by freezing and then lifting the smallest still-live composition seam instead of letting view/dialogue/house/story/battle routing remain split across multiple runtime owners.`
- Forbidden expansions:
  - `Do not widen this queue into prototype-world extraction, package normalization, or startup ownerization residue that already belongs to other closed or candidate families.`
  - `Do not widen this queue into cleanup-only adapter deletion, broad UI restyling, or generic refactor churn that is not needed to close a shared composition seam.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Freeze the smallest lawful first composition seam so the current cross-mechanism routing residue can move onto one shared contract-driven owner line.`
- task_count: `2`
- completed_task_count: `2`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the queue closed after the covered city/house transition path converged on one shared seam and the remaining composition residue returned to target review instead of widening in-queue.`
- task_briefs:
  - `task.cross-mechanism-composition-contract-closure.baseline-reconcile: freeze the first lawful shared composition seam and confirm this queue remains bounded on current source truth.`
  - `task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift: move the covered city/house composition path onto one shared seam before tackling the broader story and battle composition owners.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after the target plan synchronized the existing candidate identity and the fresh 2026-07-09 bounded admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on cross-mechanism composition ownership and must not silently absorb prototype bootstrap residue, scenario-pack normalization, or cleanup-only deletion work that depends on later target review.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or target truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or target scheduling truth.`

### Activation Order

1. `Target plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted cross-mechanism composition work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded composition evidence remains valid.`
- `Resume from this queue doc and the target-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.cross-mechanism-composition-contract-closure.baseline-reconcile` | `completed` | `Freeze the smallest lawful first shared composition seam and confirm the admitted queue still stands on current source truth.` | `none` | `Completed after queue-local inspection froze the first slice as city/house transition composition seam lift instead of a broader multi-owner rewrite.` |
| `task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift` | `completed` | `Move the covered city/house composition path onto one shared application seam before tackling broader story and battle composition owners.` | `task.cross-mechanism-composition-contract-closure.baseline-reconcile` | `Completed after the covered house-runtime transition writes moved behind applyCityViewTransition and queue-local review returned broader residue to target review.` |

### Task Definitions

#### `task.cross-mechanism-composition-contract-closure.baseline-reconcile`

##### Control Block

- task_id: `task.cross-mechanism-composition-contract-closure.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/cross-mechanism-composition-contract-closure-queue.md`
  - `src/application/runtime/main-runtime-orchestrator.ts`
  - `src/application/runtime/interactive-action-coordinator.ts`
  - `src/application/runtime/city-house-transition-coordinator.ts`
  - `src/application/house/house-runtime.ts`
  - `src/application/story-battle/story-battle-runtime.ts`
  - `src/main.ts`
  - `tests/**`
- must_inspect:
  - `src/application/runtime/main-runtime-orchestrator.ts`
  - `src/application/runtime/interactive-action-coordinator.ts`
  - `src/application/runtime/city-house-transition-coordinator.ts`
  - `src/application/house/house-runtime.ts`
  - `src/application/story-battle/story-battle-runtime.ts`
  - `src/main.ts`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- must_not_change:
  - `prototype-startup residue that belongs to the broader prototype-world family`
  - `scenario-pack normalization, default-pack binding, or authoring scaffold families`
  - `cleanup-only adapter deletion that is not required to prove the first composition seam`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted cross-mechanism composition boundary.`
  - `Queue-local evidence confirms the first slice is smaller than the remaining broader composition surface and does not silently absorb unrelated queue families.`
  - `The first composition seam cut is frozen before implementation begins.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "apply-startup-session|advance-story-scene|choose-story-option|trigger-story-events|dispatchCurrentStoryBattleAction|handleHouseAccessRefusal|triggerStoryEvents|applyReviewCycleSchedule|currentView:|overlayView: null|enterHouseThroughRuntime" src/application/runtime/main-runtime-orchestrator.ts src/application/runtime/interactive-action-coordinator.ts src/application/runtime/city-house-transition-coordinator.ts src/application/house/house-runtime.ts src/application/story-battle/story-battle-runtime.ts src/main.ts`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to target review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to another queue family instead of a shared composition seam.`

##### Human Context

- task_brief:
  - `Freeze the first lawful shared composition seam before queue-local implementation begins.`
- task_outcome_summary:
  - `Completed after queue-local inspection froze the first implementation slice as city/house transition composition seam lift, while leaving main-runtime, interactive-action, and story-battle composition families for later in-queue work.`
- Purpose:
  - `Prevent this admitted queue from jumping straight into a broad multi-owner rewrite before the smallest first seam is named and bounded.`
- Failure mode:
  - `Do not treat every remaining view/dialogue/house/story/battle transition as one implementation batch before the first composition seam is frozen.`
- Fresh baseline findings:
  - `src/application/runtime/main-runtime-orchestrator.ts still combines startup-session application, story-scene advance, story option choice, and trigger-story-events ownership on one application runtime surface.`
  - `src/application/runtime/interactive-action-coordinator.ts still combines activity-qte handling, story-scene progression, story-battle playable actions, and follow-up reentry handling on one coordinator surface.`
  - `src/application/runtime/city-house-transition-coordinator.ts and src/application/house/house-runtime.ts still own direct view/dialogue/house-entry transitions rather than consuming one shared composition outcome contract.`
  - `src/application/story-battle/story-battle-runtime.ts still writes review scheduling, story battle completion, and scene-or-house return routing directly into the game state, while src/main.ts still assembles and bridges these owners together.`
- Frozen-first-slice requirement:
  - `The first lawful implementation slice must be smaller than the whole remaining composition surface and must identify one shared composition seam that can move a covered owner line without reopening startup-ownerization, package normalization, or cleanup-only queues.`
- Frozen first slice:
  - `The first lawful implementation slice is to converge the covered city/house composition path onto one shared application seam by removing duplicated direct currentView or overlayView or dialogue transition ownership across src/application/runtime/city-house-transition-coordinator.ts and src/application/house/house-runtime.ts.`
  - `This slice is smaller than the broader queue because it leaves main-runtime-orchestrator story sequencing, interactive-action story-battle follow-up flow, and story-battle completion routing for later in-queue work instead of absorbing them into one rewrite.`

#### `task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift`

##### Control Block

- task_id: `task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/runtime/city-house-transition-coordinator.ts`
  - `src/application/runtime/city-view-transition.ts`
  - `src/application/house/house-runtime.ts`
  - `src/main.ts`
  - `tests/**`
- must_inspect:
  - `src/application/runtime/city-house-transition-coordinator.ts`
  - `src/application/runtime/city-view-transition.ts`
  - `src/application/house/house-runtime.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `main-runtime-orchestrator story sequencing`
  - `interactive-action story-battle follow-up flow`
  - `story-battle completion routing, prototype bootstrap residue, and package normalization families`
- done_when:
  - `The covered city/house composition path no longer duplicates direct currentView or overlayView or locationDialogueState routing across city-house-transition-coordinator and house-runtime.`
  - `One shared application-owned seam supplies the covered city-or-house transition outcomes on the live path.`
  - `Verification passes without widening into the broader story or battle composition families.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the blocker explicitly in this queue doc instead of widening into the broader composition surface.`
  - `Do not absorb main-runtime-orchestrator or story-battle routing just to force this first slice through.`
- promote_next_if_done: `none`
- stop_if:
  - `The required seam expands into a broader multi-owner composition rewrite instead of a bounded city/house transition cut.`

##### Human Context

- task_brief:
  - `Lift the covered city/house transition composition path onto one shared seam before tackling the broader story and battle composition families.`
- task_outcome_summary:
  - `Completed after the covered city/house transition path converged on applyCityViewTransition, while the remaining broader composition residue returned to target review instead of widening this queue in place.`
- Purpose:
  - `Close the smallest still-live composition owner line first instead of starting with a queue-wide orchestration rewrite.`
- Failure mode:
  - `Do not turn this first cut into a combined house plus story plus battle composition rewrite.`
- Execution notes:
  - `src/application/runtime/city-house-transition-coordinator.ts already routes city view changes through applyCityViewTransition, which makes it the narrowest existing seam candidate on current evidence.`
  - `src/application/house/house-runtime.ts still writes direct currentView and overlayView outcomes for house entry, house leave, and map-auto-advance completion instead of consuming that same application seam.`
  - `The first implementation cut should reuse or extend the current city-view-transition seam rather than inventing a queue-wide abstraction before the covered city/house path has converged.`
- Completion notes:
  - `src/application/runtime/city-view-transition.ts now represents the covered city/house transition outcomes through enter-house, leave-house, and resume-house-session variants in addition to the earlier city-view variants.`
  - `src/application/house/house-runtime.ts now routes the covered house entry, house leave, and map-auto-advance completion writes through applyCityViewTransition instead of open-coding currentView and overlayView state changes on that path.`
  - `tests/robustness.test.cjs now guards both the new transition variants and the absence of the covered direct house-runtime writes, which closes the bounded first seam without widening into main-runtime-orchestrator, interactive-action-coordinator, story-battle-runtime, or src/main.ts composition families.`
  - `Because the remaining composition residue now sits on broader story, battle, interactive-action, and top-level assembly owner lines instead of another already-frozen same-queue city/house seam, the correct after-state is return-to-target-review rather than silent next-task expansion.`

## Progress Log

- 2026-07-09
  - Summary: `Admitted queue.cross-mechanism-composition-contract-closure as the single active queue because current source truth still shows cross-mechanism routing and view/dialogue/house/story/battle composition spread across main-runtime-orchestrator, interactive-action-coordinator, city-house-transition-coordinator, house-runtime, story-battle-runtime, and src/main.ts with no single shared composition seam.`
  - Verification: `Fresh source inspection across src/application/runtime/main-runtime-orchestrator.ts, src/application/runtime/interactive-action-coordinator.ts, src/application/runtime/city-house-transition-coordinator.ts, src/application/house/house-runtime.ts, src/application/story-battle/story-battle-runtime.ts, src/main.ts, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.cross-mechanism-composition-contract-closure.baseline-reconcile before queue-local implementation starts.`
- 2026-07-09
  - Summary: `Completed baseline-reconcile by freezing the first lawful implementation slice as city/house transition composition seam lift. Current source truth shows city-house-transition-coordinator already owns one narrow transition seam through applyCityViewTransition, while house-runtime still duplicates direct currentView and overlayView routing for house entry, house leave, and map-auto-advance completion, so this is smaller than reopening main-runtime, interactive-action, and story-battle composition all at once.`
  - Verification: `rg -n "apply-startup-session|advance-story-scene|choose-story-option|trigger-story-events|dispatchCurrentStoryBattleAction|handleHouseAccessRefusal|triggerStoryEvents|applyReviewCycleSchedule|currentView:|overlayView: null|enterHouseThroughRuntime" src/application/runtime/main-runtime-orchestrator.ts src/application/runtime/interactive-action-coordinator.ts src/application/runtime/city-house-transition-coordinator.ts src/application/house/house-runtime.ts src/application/story-battle/story-battle-runtime.ts src/main.ts; npm run lint:blueprints`
  - Next at this time: `Execute task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift with a failing test first.`
- 2026-07-09
  - Summary: `Completed city-house-transition-composition-seam-lift by extending applyCityViewTransition with the covered house transition variants, routing house-runtime through that shared seam for house entry, house leave, and house-session resume, and then returning broader composition residue to target review instead of widening this queue without a newly frozen next slice.`
  - Verification: `node --test --test-name-pattern "city-house transition seam" tests/robustness.test.cjs; npm run typecheck; npm test; npm run lint:blueprints; rg -n "advanceStoryScene|chooseStoryOption|triggerStoryEvents|dispatchCurrentStoryBattleAction|applyReviewCycleSchedule|currentView:|overlayView: null|locationDialogueState" src/application/runtime/main-runtime-orchestrator.ts src/application/runtime/interactive-action-coordinator.ts src/application/runtime/city-house-transition-coordinator.ts src/application/house/house-runtime.ts src/application/story-battle/story-battle-runtime.ts src/main.ts`
  - Next at this time: `Return control to docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md for target-level promotion review with no active queue.`
