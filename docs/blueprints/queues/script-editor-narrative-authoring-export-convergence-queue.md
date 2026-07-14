# Script Editor Narrative Authoring Export Convergence Queue

## Control Block

- queue_id: `queue.script-editor-narrative-authoring-export-convergence`
- belongs_to_version: `target.script-editor-runtime-pack-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-14`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `return-to-version-review`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The bounded minimal narrative lowering slice is complete: the default script-editor project now seeds a lowerable dialogue node, runtime export lowers minimal dialogues into SceneDefinition actions plus textEntries, loadScenarioPackFromFiles can load the exported minimal scenario pack, and unsupported richer narrative shapes still fail closed.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `Queue implementation and governance closeout are written; repository sync is pending until the verified batch is committed and pushed.`
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
  - `Make the simplest newly-created script-editor scenario export successfully by formally lowering editor-authored dialogues and storyNodes into startup-loadable scenes and textEntries.`
- Forbidden expansions:
  - `Do not reopen the closed 12-family runtime export queue.`
  - `Do not solve unrelated unsupported runtime families.`
  - `Do not introduce private export-only narrative dialects or silently drop narrative data.`
  - `Do not widen into UI polish, asset pipeline redesign, or unrelated gameplay changes.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`

### Queue Snapshot

- queue_goal: `Lower the minimal script-editor narrative authoring path into runtime scenes and textEntries so the simplest exported scenario no longer fails closed on dialogues/storyNodes deferred-export diagnostics.`
- task_count: `2`
- completed_task_count: `2`
- remaining_task_count: `0`
- active_task_summary: `none; queue is closed and returns control to the version plan.`
- task_briefs:
  - `task.script-editor-narrative-authoring-export-convergence.boundary-baseline-reconcile: confirm the current export failure, minimal narrative input shape, and the lawful lowering boundary.`
  - `task.script-editor-narrative-authoring-export-convergence.minimal-narrative-lowering-map: define how minimal dialogues/storyNodes become runtime scenes and textEntries and what must remain fail-closed.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `The version plan already records item.script-editor-narrative-authoring-export-convergence as admitted.`
- `The 12 non-activities runtime families and activities are already closed historical evidence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-narrative-authoring-export-convergence.boundary-baseline-reconcile` | `completed` | `Confirmed the current minimal narrative export failure and froze the lawful first lowering slice.` | `none` | `Completed after RED verification reproduced the dialogues/storyNodes deferred-export diagnostics for a newly-created default project.` |
| `task.script-editor-narrative-authoring-export-convergence.minimal-narrative-lowering-map` | `completed` | `Mapped minimal dialogue authoring records to runtime scenes and textEntries.` | `task.script-editor-narrative-authoring-export-convergence.boundary-baseline-reconcile` | `Completed after the minimal authored narrative exported to scenes.json/text-entries.json and loaded through loadScenarioPackFromFiles while unsupported richer shapes stayed fail-closed.` |

### Task Definitions

#### `task.script-editor-narrative-authoring-export-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-narrative-authoring-export-convergence.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/specs/2026-07-14-script-editor-runtime-pack-unification-target.md`
  - `docs/blueprints/plans/2026-07-14-script-editor-runtime-pack-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-narrative-authoring-export-convergence-queue.md`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `activities behavior`
  - `the already closed 12-family runtime export path`
  - `new private export-only narrative dialects`
  - `unrelated gameplay or house lifecycle behavior`
- done_when:
  - `The queue records the current minimal export failure and the narrative authoring records involved.`
  - `The queue states the smallest lawful first lowering slice.`
  - `The queue keeps richer narrative shapes fail-closed.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run test`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope.`
- promote_next_if_done: `task.script-editor-narrative-authoring-export-convergence.minimal-narrative-lowering-map`
- stop_if:
  - `Fresh evidence shows the minimal scenario already exports successfully or the failure comes from another family.`

##### Human Context

- task_brief:
  - `Confirm the export blocker and freeze the minimal lawful narrative lowering slice.`
- task_outcome_summary:
- `Completed after explicit RED evidence confirmed the dialogues/storyNodes deferred-export gap on the default project path.`
- Purpose:
  - `Prevent the queue from becoming a temporary compatibility patch or a broad narrative rewrite.`
- Failure mode:
  - `Do not silently omit narrative data to make export pass.`

#### `task.script-editor-narrative-authoring-export-convergence.minimal-narrative-lowering-map`

##### Control Block

- task_id: `task.script-editor-narrative-authoring-export-convergence.minimal-narrative-lowering-map`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `activities behavior`
  - `runtime family ownership outside minimal narrative lowering`
- done_when:
  - `Minimal dialogues/storyNodes are lowered into startup-loadable scenes and textEntries.`
  - `Unsupported richer narrative shapes still fail closed.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker here and do not widen scope.`
- promote_next_if_done: `none`

##### Human Context

- task_brief:
  - `Map the minimal narrative records to runtime scene/text-entry carriers.`
- task_outcome_summary:
- `Completed after runtime export lowered the simplest authored scenario into startup-loadable scene and text-entry carriers.`
- Purpose:
  - `Make the simplest export succeed without introducing silent data loss.`
- Failure mode:
  - `Do not turn this into generic narrative compiler work.`

