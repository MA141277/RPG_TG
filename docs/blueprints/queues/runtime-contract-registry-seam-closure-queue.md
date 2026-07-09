# Runtime Contract Registry Seam Closure Queue

## Control Block

- queue_id: `queue.runtime-contract-registry-seam-closure`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `active`
- queue_class: `conditional`
- active_task: `task.runtime-contract-registry-seam-closure.runtime-playable-consumer-closeout`
- next_task: `none`
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
  - `Close the remaining application-side runtime or registry seam bypass by converging covered consumers onto application-owned contract and registry entrypoints instead of direct core runtime executor or builtin registry imports.`
- Forbidden expansions:
  - `Do not widen this queue back into core runtime canonicalization or bridge naming cleanup.`
  - `Do not widen this queue into zhuyuanzhang package normalization, broader composition closure, or dead-adapter deletion beyond the covered consumer seam.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Lift covered application consumers onto application-owned runtime and registry seams now that the core runtime canonical path has already closed.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Close the remaining direct core runtime executor and house-playable consumer bypasses now that the first application registry seam cut has landed.`
- task_briefs:
  - `task.runtime-contract-registry-seam-closure.baseline-reconcile: freeze the first lawful consumer-side seam slice and confirm the queue remains bounded.`
  - `task.runtime-contract-registry-seam-closure.house-module-registry-seam-lift: move covered application house-module consumers off direct core builtin registry fallback ownership onto an application-owned seam.`
  - `task.runtime-contract-registry-seam-closure.runtime-playable-consumer-closeout: close the remaining direct core runtime executor and house-playable bridge bypasses, verify the queue, and return control to target review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after the target plan synchronized the existing candidate identity and current bounded admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on application-side runtime or registry seam consumers and must not silently absorb package normalization, broader composition closure, or dead cleanup that depends on later upstream work.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or target truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or target scheduling truth.`

### Activation Order

1. `Target plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted consumer seam work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded consumer-seam evidence remains valid.`
- `Resume from this queue doc and the target-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.runtime-contract-registry-seam-closure.baseline-reconcile` | `completed` | `Freeze the smallest lawful first consumer-side seam slice and confirm the admitted queue still stands on current source truth.` | `none` | `Completed after queue-local inspection froze the first slice as application house-module registry fallback closure before the heavier runtime executor and house-playable consumer residue.` |
| `task.runtime-contract-registry-seam-closure.house-module-registry-seam-lift` | `completed` | `Move covered application house-module consumers off direct core builtin registry fallback ownership onto an application-owned seam.` | `task.runtime-contract-registry-seam-closure.baseline-reconcile` | `Completed after house-runtime and stage-presenters converged on the application-owned house-module-registry seam for builtin fallback ownership.` |
| `task.runtime-contract-registry-seam-closure.runtime-playable-consumer-closeout` | `active` | `Close the remaining direct core runtime executor and house-playable bridge bypasses, verify the queue, and return control to target review.` | `task.runtime-contract-registry-seam-closure.house-module-registry-seam-lift` | `Current active closeout task; the remaining residue is now concentrated in interactive-action-coordinator plus covered house playable consumers.` |

### Task Definitions

#### `task.runtime-contract-registry-seam-closure.baseline-reconcile`

##### Control Block

- task_id: `task.runtime-contract-registry-seam-closure.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `src/application/runtime/interactive-action-coordinator.ts`
  - `src/application/house/house-runtime.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - `src/application/playables/house-playable-runtime-bridge.ts`
  - `tests/**`
- must_inspect:
  - `src/application/runtime/interactive-action-coordinator.ts`
  - `src/application/house/house-runtime.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - `src/application/playables/house-playable-runtime-bridge.ts`
  - `src/application/house-modules/house-module-registry.ts`
- must_not_change:
  - `core runtime canonicalization queue scope`
  - `scenario-pack and zhuyuanzhang package normalization scope`
  - `cross-mechanism composition queue scope`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted application-side seam boundary.`
  - `Queue-local evidence confirms this seam-closure work is downstream from the closed core runtime canonicalization queue but upstream from remaining package and composition candidates.`
  - `The first application consumer seam cut is frozen before implementation begins.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "builtinHouseModuleRegistry|runInteractiveRuntime|runPlayableRuntime|commitRuntimeRequest|house-playable-runtime-bridge" src/application/runtime/interactive-action-coordinator.ts src/application/house/house-runtime.ts src/application/presenter/stage-presenters.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/playables/house-playable-runtime-bridge.ts`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to target review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.runtime-contract-registry-seam-closure.house-module-registry-seam-lift`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to package normalization, broader composition closure, or cleanup outside the covered consumer seam.`

##### Human Context

- task_brief:
  - `Freeze the first lawful consumer-side seam closure slice before queue-local code work starts.`
- task_outcome_summary:
  - `Completed after the queue froze the first bounded slice as application house-module registry fallback closure, while leaving direct runtime executor and house-playable bridge bypasses for later in-queue work.`
- Purpose:
  - `Prevent the admitted queue from widening into multiple unrelated consumer seam families before the first smallest cut is frozen.`
- Failure mode:
  - `Do not jump directly into the heavier playable runtime consumer rewiring before the smaller registry fallback cut is named and bounded.`
- Fresh baseline findings:
  - `src/application/house/house-runtime.ts and src/application/presenter/stage-presenters.ts still import builtinHouseModuleRegistry from core and keep fallback ownership locally even though both already accept an optional HouseModuleRegistry dependency, which proves a smaller first registry seam cut exists before the runtime executor bypass work.`
  - `src/application/runtime/interactive-action-coordinator.ts still imports runInteractiveRuntime, runPlayableRuntime, and commitRuntimeRequest from core runtime modules directly, which remains live application-side seam residue but is broader than the first registry fallback cut because it reaches the shared runtime executor path itself.`
  - `src/application/house-modules/grain-shop/grain-shop-house-module.ts and src/application/house-modules/medicine-house/medicine-house-house-module.ts still import runPlayableRuntime together with application/playables/house-playable-runtime-bridge.ts, which proves a second covered consumer family remains after registry fallback closure.`
  - `src/application/house-modules/house-module-registry.ts already exists as an application-owned wrapper over builtin house-module registration, so the first lawful cut is to converge covered application consumers onto that seam instead of keeping direct core builtin registry imports in each consumer.`
- Frozen first slice:
  - `The first lawful implementation slice is to remove direct core builtin house-module registry fallback ownership from application house-runtime and stage-presenters, while preserving current behavior by resolving the default registry through one application-owned seam.`
  - `The remaining direct core runtime executor and house-playable bridge consumers stay in-queue but should not be absorbed into the first slice because they require a separate runtime-facing seam decision.`

#### `task.runtime-contract-registry-seam-closure.house-module-registry-seam-lift`

##### Control Block

- task_id: `task.runtime-contract-registry-seam-closure.house-module-registry-seam-lift`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/house/house-runtime.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/house-modules/house-module-registry.ts`
  - `src/main.ts`
  - `tests/**`
- must_inspect:
  - `src/application/house/house-runtime.ts`
  - `src/application/presenter/stage-presenters.ts`
  - `src/application/house-modules/house-module-registry.ts`
  - `src/main.ts`
- must_not_change:
  - `interactive-action-coordinator runtime executor closure`
  - `grain-shop and medicine-house playable consumer closure`
  - `package normalization and composition ownership`
- done_when:
  - `Covered application house-runtime and stage-presenters no longer import builtinHouseModuleRegistry from core directly.`
  - `One application-owned house-module registry seam supplies default builtin access on the covered path.`
  - `Behavior stays equivalent on the covered path and verification passes.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of widening into the runtime executor seam.`
  - `Do not absorb grain-shop, medicine-house, or interactive-action-coordinator runtime rewiring just to force this task through.`
- promote_next_if_done: `task.runtime-contract-registry-seam-closure.runtime-playable-consumer-closeout`
- stop_if:
  - `The required seam expands into a broader runtime executor or playable-session closure instead of a bounded registry fallback cut.`

##### Human Context

- task_brief:
  - `Lift covered application house-module consumers onto one application-owned registry seam before the heavier runtime executor bypass work begins.`
- task_outcome_summary:
  - `Completed after house-runtime and stage-presenters stopped importing builtinHouseModuleRegistry from core directly and instead resolved the default registry through the application-owned house-module-registry seam.`
- Purpose:
  - `Reduce direct core builtin registry imports on the application path before the queue tackles runtime executor bypasses.`
- Failure mode:
  - `Do not widen this first cut into a mixed registry plus playable runtime rewrite.`
- Completion notes:
  - `src/application/house/house-runtime.ts and src/application/presenter/stage-presenters.ts now source builtinHouseModuleRegistry and HouseModuleRegistry from src/application/house-modules/house-module-registry.ts instead of direct core registry imports.`
  - `tests/robustness.test.cjs now guards the application-side seam by asserting these covered consumers stay off direct core builtin registry ownership.`

#### `task.runtime-contract-registry-seam-closure.runtime-playable-consumer-closeout`

##### Control Block

- task_id: `task.runtime-contract-registry-seam-closure.runtime-playable-consumer-closeout`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/runtime/interactive-action-coordinator.ts`
  - `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - `src/application/playables/house-playable-runtime-bridge.ts`
  - `src/main.ts`
  - `docs/blueprints/**`
  - `tests/**`
- must_inspect:
  - `src/application/runtime/interactive-action-coordinator.ts`
  - `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
  - `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
  - `src/application/playables/house-playable-runtime-bridge.ts`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/runtime-contract-registry-seam-closure-queue.md`
- must_not_change:
  - `core runtime canonical contracts`
  - `package normalization`
  - `broader cross-mechanism composition ownership`
- done_when:
  - `interactive-action-coordinator no longer imports covered core runtime executors directly on the live application path.`
  - `grain-shop and medicine-house no longer depend on the current ad hoc house-playable bridge plus direct runPlayableRuntime imports as the live consumer seam.`
  - `Queue truth, target truth, and verification are synchronized before returning control to target review.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the blocker explicitly in this queue doc.`
  - `Do not declare closeout while covered application consumers still bypass the intended runtime or registry seam.`
- promote_next_if_done: `none`
- stop_if:
  - `Required verification has not passed.`

##### Human Context

- task_brief:
  - `Close the remaining direct runtime executor and house-playable consumer bypasses, verify the queue, and return control to target review.`
- task_outcome_summary:
  - `Current active closeout task; it runs after the first registry seam cut and now owns the remaining direct core runtime executor and house-playable consumer bypass residue.`
- Purpose:
  - `Finish the admitted queue by proving the covered application consumers no longer bypass the intended runtime or registry seam.`
- Failure mode:
  - `Do not close the queue while interactive-action-coordinator or covered house playable consumers still reach straight into the core runtime executor path.`

## Progress Log

- 2026-07-09
  - Summary: `Admitted queue.runtime-contract-registry-seam-closure as the single active queue because the closed core runtime canonicalization queue left application-side seam residue as the next smallest bounded blocker.`
  - Verification: `Fresh source inspection across src/application/runtime/interactive-action-coordinator.ts, src/application/house/house-runtime.ts, src/application/presenter/stage-presenters.ts, src/application/house-modules/grain-shop/grain-shop-house-module.ts, src/application/house-modules/medicine-house/medicine-house-house-module.ts, src/application/playables/house-playable-runtime-bridge.ts, src/application/house-modules/house-module-registry.ts, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.runtime-contract-registry-seam-closure.baseline-reconcile before queue-local implementation starts.`
- 2026-07-09
  - Summary: `Completed baseline-reconcile by freezing the first lawful implementation slice as application house-module registry fallback closure in house-runtime and stage-presenters, while leaving direct runtime executor and house-playable bridge bypasses for later in-queue work.`
  - Verification: `rg -n "builtinHouseModuleRegistry|runInteractiveRuntime|runPlayableRuntime|commitRuntimeRequest|house-playable-runtime-bridge" src/application/runtime/interactive-action-coordinator.ts src/application/house/house-runtime.ts src/application/presenter/stage-presenters.ts src/application/house-modules/grain-shop/grain-shop-house-module.ts src/application/house-modules/medicine-house/medicine-house-house-module.ts src/application/playables/house-playable-runtime-bridge.ts; npm run lint:blueprints`
  - Next at this time: `Execute task.runtime-contract-registry-seam-closure.house-module-registry-seam-lift by removing direct core builtin house-module registry fallback ownership from application consumers before touching the runtime executor bypass residue.`
- 2026-07-09
  - Summary: `Completed house-module-registry-seam-lift by converging house-runtime and stage-presenters on the application-owned house-module-registry seam, which removes direct core builtin registry fallback ownership from the covered application consumers without widening into runtime executor closure.`
  - Verification: `npm run lint:blueprints; npm run typecheck; npm test`
  - Next at this time: `Execute task.runtime-contract-registry-seam-closure.runtime-playable-consumer-closeout across interactive-action-coordinator plus the covered grain-shop and medicine-house playable consumers.`
