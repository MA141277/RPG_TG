# Zhuyuanzhang Pack Structure And Authoring Normalization Queue

## Control Block

- queue_id: `queue.zhuyuanzhang-pack-structure-and-authoring-normalization`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `active`
- queue_class: `conditional`
- active_task: `task.zhuyuanzhang-pack-structure-and-authoring-normalization.pack-entrypoint-and-authoring-residue-review`
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
  - `Close the remaining zhuyuanzhang package-owned truth that still leaks outside the canonical scenario-pack boundary, starting with the hardcoded builtin default-pack binding and then re-evaluating the remaining pack-entry residue.`
- Forbidden expansions:
  - `Do not widen this queue into the broader cross-mechanism composition candidate.`
  - `Do not widen this queue into editor implementation, pack authoring UX, or unrelated cleanup deletion work.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`

### Queue Snapshot

- queue_goal: `Normalize zhuyuanzhang package ownership by removing the hardcoded builtin default-pack binding first, then reassessing the remaining pack-entry residue on current source truth.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Reassess the remaining pack-entry residue after the default-pack binding closure and decide whether this queue continues with another bounded slice or returns to target review.`
- task_briefs:
  - `task.zhuyuanzhang-pack-structure-and-authoring-normalization.baseline-reconcile: freeze the first lawful package-normalization slice and confirm this queue remains bounded.`
  - `task.zhuyuanzhang-pack-structure-and-authoring-normalization.default-builtin-pack-binding-closeout: remove the hardcoded builtin default-pack binding by consuming existing scenario-pack catalog default truth.`
  - `task.zhuyuanzhang-pack-structure-and-authoring-normalization.pack-entrypoint-and-authoring-residue-review: reassess the remaining pack-entry residue and decide whether the queue continues or returns to target review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after the target plan synchronized the existing candidate identity and the fresh 2026-07-09 bounded admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on zhuyuanzhang package normalization and must not silently absorb broader composition closure, editor implementation, or cleanup work that depends on later upstream decisions.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or target truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or target scheduling truth.`

### Activation Order

1. `Target plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted package-normalization work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded package-normalization evidence remains valid.`
- `Resume from this queue doc and the target-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.zhuyuanzhang-pack-structure-and-authoring-normalization.baseline-reconcile` | `completed` | `Freeze the smallest lawful first package-normalization slice and confirm the admitted queue still stands on current source truth.` | `none` | `Completed after queue-local inspection proved the hardcoded builtin default-pack binding is smaller than the remaining pack-content-access, prototype-world, and startup-entry residue.` |
| `task.zhuyuanzhang-pack-structure-and-authoring-normalization.default-builtin-pack-binding-closeout` | `completed` | `Remove the hardcoded builtin default-pack binding by consuming existing builtin scenario-pack catalog default truth.` | `task.zhuyuanzhang-pack-structure-and-authoring-normalization.baseline-reconcile` | `Completed after base-game-content-pack.ts converged on catalog-driven default resolution and verification passed without widening into broader pack-entry rewrites.` |
| `task.zhuyuanzhang-pack-structure-and-authoring-normalization.pack-entrypoint-and-authoring-residue-review` | `active` | `Reassess the remaining pack-entry residue and decide whether this queue continues or returns to target review.` | `task.zhuyuanzhang-pack-structure-and-authoring-normalization.default-builtin-pack-binding-closeout` | `This is now the active queue decision-dispatch task.` |

### Task Definitions

#### `task.zhuyuanzhang-pack-structure-and-authoring-normalization.baseline-reconcile`

##### Control Block

- task_id: `task.zhuyuanzhang-pack-structure-and-authoring-normalization.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/zhuyuanzhang-pack-structure-and-authoring-normalization-queue.md`
  - `src/content/base-game-content-pack.ts`
  - `src/content/pack-content-access.ts`
  - `src/content/prototype-world.ts`
  - `src/content/scenario-packs/catalog.json`
  - `src/content/scenario-packs/scenario-pack-catalog.ts`
  - `src/main.ts`
  - `tests/**`
- must_inspect:
  - `src/content/base-game-content-pack.ts`
  - `src/content/pack-content-access.ts`
  - `src/content/prototype-world.ts`
  - `src/content/scenario-packs/catalog.json`
  - `src/content/scenario-packs/scenario-pack-catalog.ts`
  - `src/main.ts`
- must_not_change:
  - `cross-mechanism composition queue scope`
  - `editor implementation and authoring UX scope`
  - `cleanup-only deletion outside the covered package residue`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted package-normalization boundary.`
  - `Queue-local evidence confirms the hardcoded builtin default-pack binding is smaller than the remaining pack-content-access, prototype-world, and main.ts residue.`
  - `The first package-normalization cut is frozen before implementation begins.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "DEFAULT_BASE_GAME_MANIFEST_PATH|DEFAULT_BASE_GAME_PUBLISHED_MANIFEST_PATH|createBaseGameContentPack|zhuyuanzhang|prototype-world|pack-content-access|isDefault" src/content/base-game-content-pack.ts src/content/pack-content-access.ts src/content/prototype-world.ts src/content/scenario-packs/catalog.json src/content/scenario-packs/scenario-pack-catalog.ts src/main.ts`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to target review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.zhuyuanzhang-pack-structure-and-authoring-normalization.default-builtin-pack-binding-closeout`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to the composition queue or to a different upstream capability family.`

##### Human Context

- task_brief:
  - `Freeze the first lawful package-normalization slice before queue-local code work starts.`
- task_outcome_summary:
  - `Completed after queue-local inspection froze the first slice as builtin default-pack binding closure, while leaving pack-content-access, prototype-world, and startup-entry residue for later in-queue review.`
- Purpose:
  - `Prevent the newly admitted queue from widening into pack-content imports, prototype-world extraction, and startup-assembly cleanup all at once.`
- Failure mode:
  - `Do not jump into broad pack-entry rewrites before the smaller builtin default-pack binding cut is named and bounded.`
- Fresh baseline findings:
  - `src/content/base-game-content-pack.ts still hardcodes zhuyuanzhang pack.json for both the source-tree and published manifest routes, which proves a smaller first package-normalization cut exists before broader pack-entry rewrites.`
  - `src/content/scenario-packs/catalog.json already marks one builtin default entry through isDefault, and src/application/content/catalog-loader.ts already exposes getDefaultScenarioPackCatalogEntry plus resolveCatalogManifestUrl, so the first slice can consume existing catalog truth instead of introducing a new shared capability.`
  - `src/content/pack-content-access.ts and src/content/prototype-world.ts still keep broader zhuyuanzhang pack truth outside the canonical package boundary, but both remain larger residue families than the default-pack binding because they touch shared content adapters and prototype startup assembly.`
  - `src/main.ts still imports createPrototypeCharactersForStoryStage and other zhuyuanzhang-specific startup assumptions, which confirms that startup-entry cleanup remains downstream from the smaller builtin default-pack binding cut.`
- Frozen first slice:
  - `The first lawful implementation slice is to stop hardcoding zhuyuanzhang manifest constants in src/content/base-game-content-pack.ts and resolve the builtin default pack through existing scenario-pack catalog default truth.`
  - `Broader pack-content-access, prototype-world, and startup-entry residue remains in-queue but must not be absorbed into this first implementation cut.`

#### `task.zhuyuanzhang-pack-structure-and-authoring-normalization.default-builtin-pack-binding-closeout`

##### Control Block

- task_id: `task.zhuyuanzhang-pack-structure-and-authoring-normalization.default-builtin-pack-binding-closeout`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/content/base-game-content-pack.ts`
  - `src/content/scenario-packs/catalog.json`
  - `src/content/scenario-packs/scenario-pack-catalog.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `tests/**`
- must_inspect:
  - `src/content/base-game-content-pack.ts`
  - `src/content/scenario-packs/catalog.json`
  - `src/content/scenario-packs/scenario-pack-catalog.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `pack-content-access direct import residue`
  - `prototype-world extraction scope`
  - `cross-mechanism composition ownership`
- done_when:
  - `The covered builtin default content-pack path no longer hardcodes zhuyuanzhang pack.json directly in src/content/base-game-content-pack.ts.`
  - `The covered path resolves the builtin default pack through existing scenario-pack catalog truth instead of a pack-specific constant.`
  - `Verification passes without widening into the remaining pack-entry residue.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the concrete blocker in this queue doc instead of widening into pack-content-access or prototype-world rewrites.`
  - `Do not absorb unrelated package residue just to force this task through.`
- promote_next_if_done: `task.zhuyuanzhang-pack-structure-and-authoring-normalization.pack-entrypoint-and-authoring-residue-review`
- stop_if:
  - `The required change expands into a broader package-entrypoint redesign instead of a bounded default-pack binding closure.`

##### Human Context

- task_brief:
  - `Close the hardcoded builtin default-pack binding before touching broader package-entry residue.`
- task_outcome_summary:
  - `Completed after the builtin default pack resolved through scenario-pack catalog default truth and src/content/base-game-content-pack.ts stopped hardcoding zhuyuanzhang manifest constants on the covered path.`
- Purpose:
  - `Remove the smallest still-live pack-specific binding leak from the shared content-pack path.`
- Failure mode:
  - `Do not widen this first implementation cut into a mixed default-pack plus pack-entry import rewrite.`
- Completion notes:
  - `src/content/base-game-content-pack.ts now parses the builtin scenario-pack catalog, selects the default entry through getDefaultScenarioPackCatalogEntry, and resolves the manifest URL through resolveCatalogManifestUrl instead of pack-specific constants.`
  - `tests/robustness.test.cjs now guards the covered path by rejecting hardcoded zhuyuanzhang manifest literals in base-game-content-pack.ts while preserving the shared loader behavior proof.`

#### `task.zhuyuanzhang-pack-structure-and-authoring-normalization.pack-entrypoint-and-authoring-residue-review`

##### Control Block

- task_id: `task.zhuyuanzhang-pack-structure-and-authoring-normalization.pack-entrypoint-and-authoring-residue-review`
- state: `queued`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/zhuyuanzhang-pack-structure-and-authoring-normalization-queue.md`
  - `src/content/pack-content-access.ts`
  - `src/content/prototype-world.ts`
  - `src/main.ts`
  - `tests/**`
- must_inspect:
  - `src/content/pack-content-access.ts`
  - `src/content/prototype-world.ts`
  - `src/main.ts`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/zhuyuanzhang-pack-structure-and-authoring-normalization-queue.md`
- must_not_change:
  - `already-closed default-pack binding slice`
  - `cross-mechanism composition queue scope`
  - `future editor implementation scope`
- done_when:
  - `Queue-local truth states whether the remaining residue stays as another bounded in-queue slice or returns to target review for later admission.`
  - `Queue snapshot, task counts, and target truth are synchronized with that decision before any repository sync batch.`
  - `The queue does not silently absorb larger residue without a fresh written boundary.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "zhuyuanzhang|prototype-world|pack-content-access|haozhou|scenario-pack" src/content/pack-content-access.ts src/content/prototype-world.ts src/main.ts`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to target review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `none`
- stop_if:
  - `Required queue or target truth is not synchronized.`

##### Human Context

- task_brief:
  - `Reassess the remaining package-entry residue after the first slice and decide whether this queue continues or returns to target review.`
- task_outcome_summary:
  - `Expected outcome is a bounded continuation or structured handoff, not an implicit expansion into all remaining package cleanup.`
- Purpose:
  - `Keep the queue aligned with current evidence after the first implementation slice lands.`
- Failure mode:
  - `Do not auto-absorb prototype-world extraction, pack-content-access rewrites, and startup assembly cleanup without a fresh queue-local decision.`

##### Decision-Dispatch Notes

- `If task_kind=decision-dispatch, this task must summarize current queue progress and provide one concise recommendation.`
- `Default operator output should stay concise and should not dump candidate-set analysis, why-not-the-others detail, or other Blueprint internal reasoning unless the operator explicitly asks for it.`

## Progress Log

- 2026-07-09
  - Summary: `Admitted queue.zhuyuanzhang-pack-structure-and-authoring-normalization as the single active queue because current source truth still shows bounded zhuyuanzhang package-owned defaults leaking outside the canonical scenario-pack boundary, and the hardcoded builtin default-pack binding is the smallest lawful first slice on current evidence.`
  - Verification: `Fresh source inspection across src/content/base-game-content-pack.ts, src/content/pack-content-access.ts, src/content/prototype-world.ts, src/content/scenario-packs/catalog.json, src/content/scenario-packs/scenario-pack-catalog.ts, src/main.ts, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.zhuyuanzhang-pack-structure-and-authoring-normalization.baseline-reconcile before queue-local implementation starts.`
- 2026-07-09
  - Summary: `Completed baseline-reconcile by freezing the first lawful implementation slice as builtin default-pack binding closure in src/content/base-game-content-pack.ts, while leaving pack-content-access, prototype-world, and startup-entry residue for later in-queue review.`
  - Verification: `rg -n "DEFAULT_BASE_GAME_MANIFEST_PATH|DEFAULT_BASE_GAME_PUBLISHED_MANIFEST_PATH|createBaseGameContentPack|zhuyuanzhang|prototype-world|pack-content-access|isDefault" src/content/base-game-content-pack.ts src/content/pack-content-access.ts src/content/prototype-world.ts src/content/scenario-packs/catalog.json src/content/scenario-packs/scenario-pack-catalog.ts src/main.ts; npm run lint:blueprints`
  - Next at this time: `Execute task.zhuyuanzhang-pack-structure-and-authoring-normalization.default-builtin-pack-binding-closeout with a failing test first.`
- 2026-07-09
  - Summary: `Completed default-builtin-pack-binding-closeout by moving src/content/base-game-content-pack.ts onto catalog-driven default manifest resolution and removing the hardcoded zhuyuanzhang manifest constants from the covered path.`
  - Verification: `node --test --test-name-pattern "base game content pack is sourced from the shared content-pack loader" tests/robustness.test.cjs; npm run lint:blueprints; npm run typecheck; npm test`
  - Next at this time: `Execute task.zhuyuanzhang-pack-structure-and-authoring-normalization.pack-entrypoint-and-authoring-residue-review to decide whether the remaining residue stays in-queue or returns to target review.`
