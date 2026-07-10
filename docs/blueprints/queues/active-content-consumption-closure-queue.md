# Active Content Consumption Closure Queue

## Control Block

- queue_id: `queue.active-content-consumption-closure`
- belongs_to_version: `target.project-complete-modularization`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-10`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `conditional`
- active_task: `task.active-content-consumption-closure.active-content-residue-review`
- next_task: `none`
- closeout_status: `in-progress`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync has run for this newly admitted queue yet.`
- blocked_by: []
- allowed_item_classifications:
  - `current-target-item`
- reject_item_classifications:
  - `asset-pipeline-item`
  - `future-target-candidate`

## Human Context

### Queue Explanation

- Goal:
  - `Close the remaining active-content production dependency residue by removing covered keep-house and city-scene-mappings consumption of defaultRuntimeContent/defaultPack* without widening into broader content-loading or unrelated house-module cleanup.`
- Forbidden expansions:
  - `Do not widen this queue into broader runtime orchestration ownerization or house-session assembly work.`
  - `Do not widen this queue into multi-house defaultRuntimeContent cleanup beyond the covered keep-house first slice and later residue review.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Lift the covered keep-house and city-scene-mappings production dependency residue off defaultRuntimeContent/defaultPack* behind application-owned active-content seams before reconsidering broader active-content cleanup.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `The current active task reassesses whether the remaining city-scene-mappings defaultRuntimeContent residue stays as one bounded same-queue continuation or returns to version review after the keep-house seam landed.`
- task_briefs:
  - `task.active-content-consumption-closure.baseline-reconcile: freeze the smallest lawful first active-content cleanup slice and confirm the queue remains bounded.`
  - `task.active-content-consumption-closure.keep-house-default-content-dependency-lift: move covered keep-house production defaults behind one application-owned active-content seam.`
  - `task.active-content-consumption-closure.active-content-residue-review: reassess city-scene-mappings and other remaining defaultRuntimeContent/defaultPack residue after the first keep-house slice lands.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after queue.entry-shell-bootstrap-ownerization and queue.canonical-runtime-state-sync-unification both closed on current source truth.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on covered active-content/default-content production dependency cleanup and must not silently absorb broader runtime orchestration, house-session assembly, or multi-module cleanup that belongs to later review.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted active-content production dependency cleanup work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded active-content dependency evidence remains valid.`
- `Resume from this queue doc and the version-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.active-content-consumption-closure.baseline-reconcile` | `completed` | `Freeze the smallest lawful first active-content cleanup slice and confirm the admitted queue still stands on current source truth.` | `none` | `Completed after queue-local inspection froze keep-house default-content dependency lift as the first bounded slice ahead of city-scene-mappings and broader defaultRuntimeContent residue.` |
| `task.active-content-consumption-closure.keep-house-default-content-dependency-lift` | `completed` | `Move covered keep-house production defaults behind one application-owned active-content seam.` | `task.active-content-consumption-closure.baseline-reconcile` | `Completed after keep-house-active-content.ts became the covered default-content seam and verification passed.` |
| `task.active-content-consumption-closure.active-content-residue-review` | `active` | `Reassess city-scene-mappings and other remaining defaultRuntimeContent/defaultPack residue after the first keep-house slice lands.` | `task.active-content-consumption-closure.keep-house-default-content-dependency-lift` | `Active now that the first keep-house slice has landed and verification passed.` |

### Task Definitions

#### `task.active-content-consumption-closure.baseline-reconcile`

##### Control Block

- task_id: `task.active-content-consumption-closure.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/active-content-consumption-closure-queue.md`
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/content/city-scene-mappings.ts`
  - `src/application/content/default-pack-content.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/application/content/active-game-content.ts`
- must_inspect:
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/content/city-scene-mappings.ts`
  - `src/application/content/default-pack-content.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/application/content/active-game-content.ts`
- must_not_change:
  - `broader runtime orchestration ownerization`
  - `house-session assembly ownerization`
  - `multi-house defaultRuntimeContent cleanup beyond the frozen first slice`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted active-content cleanup boundary.`
  - `Queue-local evidence confirms keep-house default-content dependency lift is smaller than the remaining city-scene-mappings and broader defaultRuntimeContent residue.`
  - `The first active-content cleanup cut is frozen before implementation begins.`
- verify_with:
  - `rg -n "defaultPackActivities|defaultPackTextEntries|defaultRuntimeContent|houseModuleDefaults" src/application/house-modules/keep-house/keep-house-house-module.ts src/content/city-scene-mappings.ts src/application/content/default-pack-content.ts src/application/content/default-runtime-content.ts src/application/content/active-game-content.ts`
  - `node tools/lint-blueprints.mjs`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to version review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.active-content-consumption-closure.keep-house-default-content-dependency-lift`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to broader runtime orchestration, house-session assembly, or multi-module content cleanup instead of the admitted active-content dependency cut.`

##### Human Context

- task_brief:
  - `Freeze the first lawful active-content cleanup slice before queue-local code work starts.`
- task_outcome_summary:
  - `Completed after queue-local inspection froze keep-house default-content dependency lift as the first bounded slice while leaving city-scene-mappings and broader defaultRuntimeContent residue for later review.`
- Purpose:
  - `Prevent the admitted queue from widening into city-scene-mappings rewrite, multi-house cleanup, and runtime orchestration work all at once.`
- Failure mode:
  - `Do not jump directly into broader city-scene-mappings or multi-module cleanup before the smaller keep-house production dependency owner line is named and bounded.`
- Fresh baseline findings:
  - `src/application/house-modules/keep-house/keep-house-house-module.ts still imports defaultPackActivities and defaultPackTextEntries from src/application/content/default-pack-content.ts, still imports defaultRuntimeContent from src/application/content/default-runtime-content.ts, and still derives keep-house fallback content plus houseModuleDefaults from those live default-content exports on the covered path.`
  - `src/content/city-scene-mappings.ts still imports defaultRuntimeContent directly and reads defaultRuntimeContent.houses plus defaultRuntimeContent.cities to construct the covered city-scene mapping output.`
  - `src/application/content/active-game-content.ts already owns activityDefinitionsById, textEntriesById, houses, cities, and houseModuleDefaults inside ActiveGameContentContext, and main.ts already passes activeContentContext story content plus house definitions into covered runtime and house flows, which proves keep-house can move first without widening immediately into city-scene-mappings.`
- Frozen first slice:
  - `The first lawful implementation slice is to move keep-house off defaultPackActivities/defaultPackTextEntries and direct defaultRuntimeContent.houseModuleDefaults consumption behind one application-owned active-content seam while preserving current keep-house behavior.`
  - `city-scene-mappings and broader defaultRuntimeContent/defaultPack consumers stay for later residue review and must not be silently absorbed into this first cut.`

#### `task.active-content-consumption-closure.keep-house-default-content-dependency-lift`

##### Control Block

- task_id: `task.active-content-consumption-closure.keep-house-default-content-dependency-lift`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/house-modules/keep-house/**`
  - `src/application/content/**`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/**`
- must_inspect:
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/application/content/default-pack-content.ts`
  - `src/application/content/default-runtime-content.ts`
  - `src/application/content/active-game-content.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `src/content/city-scene-mappings.ts`
  - `broader runtime orchestration ownerization`
  - `other house-module defaultRuntimeContent cleanup beyond keep-house`
- done_when:
  - `keep-house no longer directly imports defaultPackActivities, defaultPackTextEntries, or defaultRuntimeContent on the covered production path.`
  - `One application-owned active-content seam owns the covered keep-house activity, text, and houseModuleDefaults fallback access.`
  - `Verification passes without widening into city-scene-mappings or broader defaultRuntimeContent cleanup.`
- verify_with:
  - `node --test --test-name-pattern "keep house no longer consumes default pack content through module-top-level default runtime fallbacks" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `node tools/lint-blueprints.mjs`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of widening into city-scene-mappings or broader multi-module cleanup.`
  - `Do not absorb city-scene-mappings or runtime orchestration work just to force this task through.`
- promote_next_if_done: `task.active-content-consumption-closure.active-content-residue-review`
- stop_if:
  - `The required seam expands into city-scene-mappings rewrite or broader multi-module content cleanup instead of a bounded keep-house active-content cut.`

##### Human Context

- task_brief:
  - `Lift keep-house production default-content access behind one application-owned active-content seam.`
- task_outcome_summary:
  - `Completed after keep-house stopped directly importing defaultPackActivities/defaultPackTextEntries and defaultRuntimeContent, and now consumes src/application/house-modules/keep-house/keep-house-active-content.ts as the covered application-owned active-content seam.`
- Purpose:
  - `Reduce live default-content production dependency inside keep-house before the queue re-evaluates remaining city-scene-mappings and broader active-content residue.`
- Failure mode:
  - `Do not widen this first implementation cut into city-scene-mappings, runtime orchestration, or unrelated house-module cleanup.`

#### `task.active-content-consumption-closure.active-content-residue-review`

##### Control Block

- task_id: `task.active-content-consumption-closure.active-content-residue-review`
- state: `active`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/active-content-consumption-closure-queue.md`
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/content/city-scene-mappings.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/house-modules/keep-house/keep-house-house-module.ts`
  - `src/content/city-scene-mappings.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/active-content-consumption-closure-queue.md`
- must_not_change:
  - `already-landed keep-house seam slice`
  - `broader runtime orchestration ownerization`
  - `other house-module cleanup outside the admitted queue boundary`
- done_when:
  - `Queue-local truth states whether the remaining city-scene-mappings and defaultRuntimeContent/defaultPack residue stays as another bounded in-queue slice or returns to version review for later admission.`
  - `Queue snapshot, task counts, and version truth are synchronized with that decision before any repository sync batch.`
  - `The queue does not silently absorb broader multi-module cleanup without a fresh written boundary.`
- verify_with:
  - `rg -n "defaultPackActivities|defaultPackTextEntries|defaultRuntimeContent" src/application/house-modules/keep-house/keep-house-house-module.ts src/content/city-scene-mappings.ts tests/robustness.test.cjs`
  - `node tools/lint-blueprints.mjs`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to version review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `none`
- stop_if:
  - `Required queue or version truth is not synchronized.`

##### Human Context

- task_brief:
  - `Reassess city-scene-mappings and other remaining defaultRuntimeContent/defaultPack residue after the first keep-house slice lands.`
- task_outcome_summary:
  - `This task will decide whether the remaining residue stays as another bounded active-content continuation or returns to version review for later queue selection.`
- Purpose:
  - `Keep the queue aligned with current evidence after the first keep-house implementation slice lands.`
- Failure mode:
  - `Do not auto-absorb broader multi-house or runtime orchestration cleanup without a fresh queue-local decision.`

##### Decision-Dispatch Notes

- `If task_kind=decision-dispatch, this task must summarize current queue progress and provide one concise recommendation.`
- `Default operator output should stay concise and should not dump candidate-set analysis, why-not-the-others detail, or other Blueprint internal reasoning unless the operator explicitly asks for it.`

## Progress Log

- 2026-07-10
  - Summary: `Admitted queue.active-content-consumption-closure as the single active queue because queue.entry-shell-bootstrap-ownerization and queue.canonical-runtime-state-sync-unification are now both closed, and current source truth still shows live default-content production dependencies in keep-house and city-scene-mappings.`
  - Verification: `Fresh source inspection across src/application/house-modules/keep-house/keep-house-house-module.ts, src/content/city-scene-mappings.ts, src/application/content/default-pack-content.ts, src/application/content/default-runtime-content.ts, src/application/content/active-game-content.ts, docs/blueprints/project-progress.md, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.active-content-consumption-closure.baseline-reconcile before queue-local implementation starts.`
- 2026-07-10
  - Summary: `Completed baseline-reconcile by freezing keep-house default-content dependency lift as the first lawful implementation slice, while leaving city-scene-mappings and broader defaultRuntimeContent residue for later in-queue review.`
  - Verification: `rg -n "defaultPackActivities|defaultPackTextEntries|defaultRuntimeContent|houseModuleDefaults" src/application/house-modules/keep-house/keep-house-house-module.ts src/content/city-scene-mappings.ts src/application/content/default-pack-content.ts src/application/content/default-runtime-content.ts src/application/content/active-game-content.ts; node tools/lint-blueprints.mjs`
  - Next at this time: `Execute task.active-content-consumption-closure.keep-house-default-content-dependency-lift with a failing test first.`
- 2026-07-10
  - Summary: `Completed keep-house-default-content-dependency-lift by moving keep-house default activity, text, and houseModuleDefaults fallback access behind src/application/house-modules/keep-house/keep-house-active-content.ts, removing direct defaultPack/defaultRuntimeContent imports from the module, and aligning robustness coverage to the new seam.`
  - Verification: `node --test --test-name-pattern "keep house reads shared module defaults from runtime content|keep house no longer consumes default pack content through module-top-level default runtime fallbacks|keep house review copy resolves from text entries during strategy and assignment flow|keep house audience and late-review copy resolves from text entries" tests/robustness.test.cjs; npm run typecheck; npm test`
  - Next at this time: `Execute task.active-content-consumption-closure.active-content-residue-review to decide whether city-scene-mappings defaultRuntimeContent residue stays in-queue or returns to version review.`
