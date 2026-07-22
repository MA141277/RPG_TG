# Script Editor PRD Project Selection And Workspace Layout Alignment Queue

## Control Block

- queue_id: `queue.script-editor-prd-project-selection-and-workspace-layout-alignment`
- belongs_to_version: `target.script-editor-prd-alignment`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-13`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded project-selection and responsive-layout continuation slice is landed and verified: the repository now separates project selection/management from current-project editing, exposes bounded per-project continue/delete actions with delete confirmation, and adapts the workbench/project cards across wide, mid, and narrow widths. Execution for this queue is complete, but the next remaining same-family PRD residue now shifts to person authoring rather than another workspace-management continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-prd-person-authoring-alignment`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync batch is recorded in this queue closeout batch.`
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
  - `Separate project selection and management from current-project editing, add bounded per-project continue/delete flows, and align the workbench layout across wide/mid/narrow widths without widening into object-family authoring queues.`
- Forbidden expansions:
  - `Do not widen this queue into person/city/dialogue/event family editors or preview/export product surfaces.`
  - `Do not reopen the already landed PRD workspace copy, persistence/export/import seams, or shared-rule compile semantics by convenience.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-13-script-editor-prd-alignment-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`

### Queue Snapshot

- queue_goal: `Own the remaining same-family workbench gap after the first-cut workspace alignment: dedicated project selection/management and responsive workspace layout behavior.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded project-selection and responsive-layout continuation slice closed after the project list, per-project management actions, delete confirmation flow, and multi-width workbench adaptation all landed with verification.`
- task_briefs:
  - `task.script-editor-prd-project-selection-and-workspace-layout-alignment.boundary-baseline-reconcile: confirm that dedicated project selection/management and multi-width workspace adaptation remain the next smallest same-family PRD gap after the closed workspace first cut.`
  - `task.script-editor-prd-project-selection-and-workspace-layout-alignment.project-selection-and-layout-implementation: land the bounded script-list, continue/delete actions, delete confirmation, and layout adaptation without widening into family authoring.`
  - `task.script-editor-prd-project-selection-and-workspace-layout-alignment.queue-closeout-and-handoff: verify the queue-local workbench continuation slice, classify remaining residue, and hand control to the next lawful PRD queue.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-prd-project-selection-and-workspace-layout-alignment.boundary-baseline-reconcile` | `completed` | `Confirm that project-selection separation, per-project management, and responsive layout remain the next smallest same-family PRD gap.` | `none` | `Completed on 2026-07-13 after repository inspection confirmed that the current workbench still edits the current project in place and lacks a dedicated script-list management surface and width-adaptive workbench rules.` |
| `task.script-editor-prd-project-selection-and-workspace-layout-alignment.project-selection-and-layout-implementation` | `completed` | `Land the bounded script-list/project-selection surface, continue/delete management, and layout adaptation without widening into downstream authoring queues.` | `task.script-editor-prd-project-selection-and-workspace-layout-alignment.boundary-baseline-reconcile` | `Completed on 2026-07-13 after the workbench gained a dedicated project-selection/management surface, per-project continue/delete actions with delete confirmation, a reusable in-memory project library helper, and responsive layout adaptation without widening into downstream family editors.` |
| `task.script-editor-prd-project-selection-and-workspace-layout-alignment.queue-closeout-and-handoff` | `completed` | `Verify the queue-local workbench continuation slice, classify remaining residue, and hand control to the next lawful PRD queue.` | `task.script-editor-prd-project-selection-and-workspace-layout-alignment.project-selection-and-layout-implementation` | `Completed on 2026-07-13 after verification passed, queue-local truth was synchronized, and the remaining same-family residue was returned to version-level promotion review with person authoring recorded as the next lawful candidate.` |

### Historical Handoff Note

- Task ID:
  - `task.script-editor-prd-project-selection-and-workspace-layout-alignment.queue-closeout-and-handoff`
- Recorded handoff at closure:
  - `The bounded PRD project-selection and responsive-layout continuation is complete. Return to target.script-editor-prd-alignment version review and evaluate queue.script-editor-prd-person-authoring-alignment as the next lawful candidate.`
- Recorded expected output:
  - `One separated project-selection surface now exists as reusable baseline for later PRD object-family authoring queues.`

### Task Definitions

#### `task.script-editor-prd-project-selection-and-workspace-layout-alignment.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-prd-project-selection-and-workspace-layout-alignment.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/script-editor-prd.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/styles/script-editor.css`
- must_inspect:
  - `docs/script-editor-prd.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `src/styles/script-editor.css`
- must_not_change:
  - `person/city/building/dialogue/event family authoring surfaces`
  - `runtime export or compatibility policy`
  - `shared-rule compile semantics`
- done_when:
  - `Queue-local truth confirms that project-selection separation and width-adaptive workspace layout remain the next smallest same-family PRD gap.`
  - `Current repository evidence still supports this queue as narrower than person authoring and later family queues.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-prd-project-selection-and-workspace-layout-alignment.project-selection-and-layout-implementation`

##### Human Context

- task_brief:
  - `Confirm the same-family workbench continuation boundary before implementation continues.`
- task_outcome_summary:
  - `Completed after repository inspection confirmed that the current workbench still lacks a dedicated script-list management surface and width-adaptive layout rules.`

#### `task.script-editor-prd-project-selection-and-workspace-layout-alignment.project-selection-and-layout-implementation`

##### Control Block

- task_id: `task.script-editor-prd-project-selection-and-workspace-layout-alignment.project-selection-and-layout-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/styles/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/script-editor-prd.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `src/styles/script-editor.css`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `person/city/building/dialogue/event family editors`
  - `preview/export product surfaces`
  - `runtime schema growth by UI convenience`
- done_when:
  - `The workbench has a dedicated project-selection/management surface separate from current-project editing.`
  - `The workbench exposes bounded continue/delete project actions and delete confirmation flow.`
  - `The workspace layout adapts across wide, mid, and narrow widths without widening into downstream authoring queues.`
- verify_with:
  - `npm run build:test`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-prd-project-selection-and-workspace-layout-alignment.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement the bounded script-list/project-management and responsive workbench continuation slice.`
- task_outcome_summary:
  - `Completed on 2026-07-13 after the repository gained one dedicated project-selection surface, bounded per-project continue/delete management with delete confirmation, and responsive workbench/project-list layout adaptation on top of the closed first-cut workspace baseline.`

#### `task.script-editor-prd-project-selection-and-workspace-layout-alignment.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-prd-project-selection-and-workspace-layout-alignment.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-project-selection-and-workspace-layout-alignment-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-project-selection-and-workspace-layout-alignment-queue.md`
- must_not_change:
  - `version boundary without explicit residue evidence`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to the next lawful PRD routing step.`
  - `Remaining residue is explicitly classified and routed.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
- promote_next_if_done: `return-to-version-review`

##### Human Context

- task_brief:
  - `Close the queue only after project-selection/layout verification and routing truth are synchronized.`
- task_outcome_summary:
  - `Completed on 2026-07-13 after queue truth, version truth, and project-progress truth were synchronized and the next lawful continuation was explicitly routed back to version-level promotion review.`
