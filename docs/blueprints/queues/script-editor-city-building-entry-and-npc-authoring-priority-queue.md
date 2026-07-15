# Script Editor City Building Entry And NPC Authoring Priority Queue

## Control Block

- queue_id: `queue.script-editor-city-building-entry-and-npc-authoring-priority`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required-priority`
- active_task: `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile`
- next_task: `none`
- closeout_status: `not-started`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `execute-active-task`
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `Queue admission commit 1399b8e was pushed successfully to origin/mod-first-dev.`
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
  - `Add the priority city/building authoring path for building dialogue binding, entry/access conditions, refusal text references, city building selection, and NPC assignment after field and condition basics have landed.`
- Forbidden expansions:
  - `Do not build a broad city/building runtime resolver unless baseline proves a tiny authoring helper cannot work without it.`
  - `Do not invent a second condition schema for city/building access; consume the frozen typed condition authoring contract.`
  - `Do not hardcode city/building/NPC business branches in main.ts.`
  - `Do not change playable/minigame bindings from this queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-condition-runtime-evaluation-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Determine and implement the smallest priority city/building authoring slice that lets creators bind buildings, entry/access conditions, refusal text references, and NPC assignment without duplicating runtime structures.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Baseline current city/building/project records, city entries, house access refusal rules, NPC data, UI surfaces, export/import behavior, and runtime consumers before code changes.`
- task_briefs:
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile: inventory current city/building entry and NPC authoring/export/runtime seams and select the smallest lawful implementation slice.`
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation: implement the selected priority authoring slice with tests.`
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `Field mapping basics are frozen by queue.script-editor-unified-field-mapping-table-freeze.`
- `Typed condition authoring and bounded event runtime evaluation/export are now available as baseline evidence.`
- `The target spec marks building dialogue binding, entry/access conditions, refusal text references, city building selection, and NPC assignment as a required-priority authoring addition.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile` | `active` | `Inventory city/building entry and NPC authoring/export/runtime seams and select the smallest implementation slice.` | `none` | `Production code must not change before this baseline records its selected slice.` |
| `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation` | `pending` | `Implement the selected priority authoring slice.` | `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile` | `Must be test-first and must not widen into broad resolver migration without baseline evidence.` |
| `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff` | `pending` | `Verify, classify residue, and return control to version review.` | `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation` | `Must not close the parent version without explicit version closeout confirmation.` |

### Task Definitions

#### `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/domain/city.ts`
  - `src/domain/house.ts`
  - `src/application/city-npcs`
  - `src/application/house-access`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-entry-and-npc-authoring-priority-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-condition-runtime-evaluation-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `broad city/building placement resolver migration`
  - `playable/minigame bindings`
  - `main.ts house-specific business branches`
- done_when:
  - `Current city/building/cityEntries/houseAccessRefusalRules/cityNpcPools/person NPC authoring and runtime consumption paths are inventoried.`
  - `The exact mismatch between existing generic JSON-backed records and creator-facing priority authoring controls is recorded.`
  - `The smallest lawful implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, controls, validation rules, export/import behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "cityEntries|houseAccessRefusalRules|cityNpcPools|personType|NPC|building|cityId|houseId|dialogue|refusal|access" src/domain src/application src/ui tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if schema migration or placement resolver convergence must precede priority authoring.`
- promote_next_if_done: `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation`
- stop_if:
  - `Fresh evidence proves the priority authoring slice cannot proceed without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest city/building/NPC authoring slice that is useful to creators and honest to existing runtime data.`
- task_outcome_summary:
  - `none`
- Purpose:
  - `Move priority city/building entry and NPC authoring out of generic JSON shadows while preserving the canonical runtime pack families.`
- Failure mode:
  - `Creators can edit people, cities, and buildings but still cannot bind building access, refusal copy, or NPC placement without manual JSON patching.`

##### Progress Log

- `2026-07-15`: `Queue admitted from promotion review after condition runtime evaluation convergence closed and field/condition basics were sufficient for the priority city/building authoring candidate.`

#### `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `broad city/building placement resolver migration`
  - `playable/minigame bindings`
  - `main.ts house-specific business branches`
- done_when:
  - `The selected priority authoring slice is implemented.`
  - `Tests cover the selected authoring helpers, UI/workspace exposure, and import/export preservation or lowering behavior.`
  - `Unsupported city/building/NPC shapes fail closed or remain explicitly routed residue.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into resolver migration opportunistically.`
- promote_next_if_done: `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broader placement resolver convergence to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected priority city/building/NPC authoring slice.`
- task_outcome_summary:
  - `none`
- Purpose:
  - `Give creators first-class controls for the highest-priority city/building entry and NPC fields.`
- Failure mode:
  - `Generic JSON preservation continues to require hand-editing for city/building access and NPC placement.`

##### Progress Log

- `2026-07-15`: `Queued behind boundary-baseline-reconcile.`

#### `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-entry-and-npc-authoring-priority-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `Current queue, version plan, Blueprint, project-progress, and residue truth.`
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
  - `Priority authoring acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the priority city/building/NPC authoring queue after verified implementation.`
- task_outcome_summary:
  - `none`
- Purpose:
  - `Keep priority authoring additions explicit before broader city/building resolver convergence continues.`
- Failure mode:
  - `Closing without verified authoring controls would leave priority city/building setup dependent on manual JSON edits.`

##### Progress Log

- `2026-07-15`: `Queued behind priority-authoring-implementation.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile`
- Recorded handoff at activation:
  - `Queue is active and must start by reconciling city/building/NPC authoring gaps with existing runtime pack families before code changes.`
- Recorded expected output:
  - `A bounded priority authoring implementation path or an explicit prerequisite routing decision.`
