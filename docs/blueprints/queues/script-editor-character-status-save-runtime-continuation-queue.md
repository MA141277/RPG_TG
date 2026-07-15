# Script Editor Character Status Save Runtime Continuation Queue

## Control Block

- queue_id: `queue.script-editor-character-status-save-runtime-continuation`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-character-status-save-runtime-continuation.boundary-baseline-reconcile`
- next_task: `task.script-editor-character-status-save-runtime-continuation.save-runtime-overlay-implementation`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Same-family continuation is newly admitted from the character definition/status convergence closeout; implementation and verification are pending.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Continuation queue admitted locally; repository sync is pending.`
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
  - `Persist CharacterStatus patches through the canonical save envelope and restore them into materialized runtime character views without mutating authored CharacterDefinition records.`
- Forbidden expansions:
  - `Do not complete the full script-editor character UI; that remains queue.script-editor-character-authoring-surface-completion.`
  - `Do not generalize status overlays to cities, buildings, tasks, story progress, events, or global scenario state.`
  - `Do not migrate every house/playable consumer in one batch; use the shared state-sync/runtime commit seam for the smallest covered status aggregation path.`
  - `Do not alter gameplay formulas while changing status ownership.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Connect CharacterStatus patch output to durable save state and startup restore through one bounded runtime-owned aggregation seam.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Reconcile save-envelope, AppState/CoreGameState, state-sync commit, startup restore, and covered mutation result seams before implementation.`
- task_briefs:
  - `task.script-editor-character-status-save-runtime-continuation.boundary-baseline-reconcile: identify the canonical status aggregation and restore seam.`
  - `task.script-editor-character-status-save-runtime-continuation.save-runtime-overlay-implementation: implement durable CharacterStatus save/restore for the bounded covered path with tests.`
  - `task.script-editor-character-status-save-runtime-continuation.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `queue.script-editor-character-definition-status-convergence closed its bounded slice with CharacterStatus overlay/materializer helpers, editor person runtime CharacterDefinition materialization, and covered mutation patch outputs.`
- `Fresh verification passed with npm run typecheck, npm run test, npm run lint:blueprints, npm run lint:plans, and npm run blueprint:governance:check.`
- `The remaining same-family blocker is durable status aggregation in save state plus startup restoration, not another character schema/materializer task.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-character-status-save-runtime-continuation.boundary-baseline-reconcile` | `active` | `Reconcile canonical save/status aggregation and restore seams before implementation.` | `none` | `Must choose the smallest runtime-owned path and avoid direct feature-specific writes in main.ts.` |
| `task.script-editor-character-status-save-runtime-continuation.save-runtime-overlay-implementation` | `pending` | `Implement bounded CharacterStatus persistence, restore materialization, and covered status aggregation tests.` | `task.script-editor-character-status-save-runtime-continuation.boundary-baseline-reconcile` | `Must preserve no-status new-game behavior.` |
| `task.script-editor-character-status-save-runtime-continuation.queue-closeout-and-handoff` | `pending` | `Verify the continuation, classify residue, and synchronize Blueprint truth.` | `task.script-editor-character-status-save-runtime-continuation.save-runtime-overlay-implementation` | `Must not close without save/restore evidence.` |

### Task Definitions

#### `task.script-editor-character-status-save-runtime-continuation.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-character-status-save-runtime-continuation.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/app-shell.ts`
  - `src/application/character/character-status.ts`
  - `src/core/contracts/core-state.ts`
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/save`
  - `src/application/startup`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-character-status-save-runtime-continuation-queue.md`
- must_inspect:
  - `src/application/app-shell.ts`
  - `src/application/character/character-status.ts`
  - `src/core/contracts/core-state.ts`
  - `src/core/runtime/state-sync-runtime.ts`
  - `src/core/save/save-envelope.ts`
  - `src/core/save/save-migrations.ts`
  - `src/core/save/browser-save-record.ts`
  - `src/application/startup/startup-session-coordinator.ts`
  - `src/application/startup/startup-session-apply-coordinator.ts`
  - `src/main.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `unrelated object-family status overlays`
  - `house/playable business formulas`
  - `full character authoring UI`
  - `feature-specific save branches in main.ts when a shared state-sync seam exists`
- done_when:
  - `The canonical owner for characterStatusById in runtime and save state is identified.`
  - `The status patch aggregation path from covered mutation results to save state is identified.`
  - `The startup restore path that materializes definitions with saved status is identified.`
  - `A bounded test-first implementation plan covers no-status new game, mutation/save, load/restore, and authored-definition immutability.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "characterStatusById|modState|createSaveEnvelope|loadSaveEnvelope|readCurrentCoreGameStateForSave|characterDefinitions|commit" src/core src/application src/main.ts tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if schema-reference-and-migration-freeze must precede save-envelope changes.`
- promote_next_if_done: `task.script-editor-character-status-save-runtime-continuation.save-runtime-overlay-implementation`
- stop_if:
  - `Fresh evidence proves the save overlay requires non-character status generalization.`

##### Human Context

- task_brief:
  - `Find the canonical runtime/save seam for durable character status before writing code.`
- task_outcome_summary:
  - `Pending; expected output is a bounded save/restore implementation boundary.`
- Purpose:
  - `Prevent CharacterStatus from remaining a transient mutation receipt that disappears on save.`
- Failure mode:
  - `Writing status directly in feature modules or main.ts would create multiple durable truths and bypass state-sync ownership.`

##### Progress Log

- `2026-07-15`: `Continuation queue admitted automatically from the predecessor queue's unique same-family save/runtime residue.`

#### `task.script-editor-character-status-save-runtime-continuation.save-runtime-overlay-implementation`

##### Control Block

- task_id: `task.script-editor-character-status-save-runtime-continuation.save-runtime-overlay-implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `Scope must be finalized by boundary-baseline-reconcile before code changes.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `non-character overlays`
  - `broad gameplay formulas`
  - `full character UI`
- done_when:
  - `CharacterStatus patches persist through the canonical save envelope only when mutations exist.`
  - `Startup restore materializes saved status over authored definitions without mutating them.`
  - `Covered mutation results aggregate into the canonical status store.`
  - `Tests prove no-status new game, save/load restore, and authored-definition immutability.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not create feature-specific status stores.`
- promote_next_if_done: `task.script-editor-character-status-save-runtime-continuation.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires unrelated status overlay generalization.`

##### Human Context

- task_brief:
  - `Implement durable CharacterStatus aggregation and restore through the canonical runtime/save seam.`
- task_outcome_summary:
  - `Pending until baseline reconciliation chooses the exact files and state owner.`
- Purpose:
  - `Make covered runtime character mutations survive save and restore.`
- Failure mode:
  - `A transient-only patch output would leave current gameplay behavior unsaved.`

#### `task.script-editor-character-status-save-runtime-continuation.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-character-status-save-runtime-continuation.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-character-status-save-runtime-continuation-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `Current queue, version plan, Blueprint, and project-progress truth.`
- must_not_change:
  - `version closeout without explicit human confirmation`
  - `new queue admission without routing truth`
- done_when:
  - `Verification, residue classification, next-step sync, and repository sync truth are recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
  - `npm run blueprint:governance:check`
- if_blocked:
  - `Record the blocker without marking the queue done.`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Save/restore acceptance has not passed.`

##### Human Context

- task_brief:
  - `Close or route the save/runtime continuation after verified implementation.`
- task_outcome_summary:
  - `Pending.`
- Purpose:
  - `Keep character status persistence routing explicit.`
- Failure mode:
  - `Closing without restore evidence would leave CharacterStatus non-durable.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Queue is active and has not reached closure.`
- Recorded expected output:
  - `Durable CharacterStatus save/restore through the canonical runtime state seam.`

### Historical Candidate Notes

- `queue.script-editor-character-authoring-surface-completion`
  - State:
    - `candidate`
  - Reason:
    - `Creator-facing character control completion remains separate from save/runtime status ownership.`
