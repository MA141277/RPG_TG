# Script Editor PRD Workbench UI Visual Alignment Queue

## Control Block

- queue_id: `queue.script-editor-prd-workbench-ui-visual-alignment`
- belongs_to_version: `target.script-editor-prd-alignment`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-13`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation`
- next_task: `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation`
- closeout_status: `open`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `none`
- residue_remaining: `unknown`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `complete-active-queue`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync batch is recorded for this newly admitted visual-convergence queue yet.`
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
  - `Align the current script-editor workbench with the approved creator-first UI design by converging the workspace onto a warm-paper visual system, keeping project selection outside the editor shell, reducing first-screen system-field exposure, and making the left-rail -> central editor -> auxiliary handoff layout read like one stable authoring desk.`
- Forbidden expansions:
  - `Do not reopen project-selection management, person/city/dialogue/minigame structural authoring scope, or preview/export product-surface ownership by convenience.`
  - `Do not widen this queue into new runtime contracts, compatibility policy redesign, or unrelated repository-wide restyling.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-13-script-editor-prd-alignment-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`

### Queue Snapshot

- queue_goal: `Turn the now-complete structural script-editor baseline into the approved creator-first workbench shell: project list stays outside, the workspace becomes a warm-paper authoring desk, first-screen lists and summaries prefer creator-visible copy over raw IDs, and save/validate/export actions converge into one stable top utility bar.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Boundary review is complete and implementation is active: the next bounded slice is the visible workbench shell convergence and creator-visible summary filtering.`
- task_briefs:
  - `task.script-editor-prd-workbench-ui-visual-alignment.boundary-baseline-reconcile: confirm that final creator-first visual convergence is the next smallest same-family PRD gap after the closed preview/validation/export queue.`
  - `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation: land the bounded shell/visual convergence, top utility-bar cleanup, and creator-visible summary filtering without reopening closed structural queues.`
  - `task.script-editor-prd-workbench-ui-visual-alignment.queue-closeout-and-handoff: verify the queue-local visual slice, classify any remaining residue, and return control to version-level closeout review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to full PRD version closure.`
- `execution_closeout_status = done is legal only after the admitted visual-convergence slice lands with verification.`
- `If fresh evidence proves a still-open same-family creator-workbench residue remains after this slice, classify it explicitly before version-level routing continues.`

### Admission Preconditions

- `This queue is admitted only after queue.script-editor-prd-workspace-and-navigation-alignment, queue.script-editor-prd-project-selection-and-workspace-layout-alignment, queue.script-editor-prd-person-authoring-alignment, queue.script-editor-prd-city-building-and-menu-alignment, queue.script-editor-prd-dialogue-event-story-alignment, queue.script-editor-prd-minigame-binding-alignment, and queue.script-editor-prd-preview-validation-export-alignment are all closed historical evidence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must consume the existing authoring, preview, and export-handoff surfaces rather than rebuild them under a visual-design pretext.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `A blocked queue still allows commit, push, and merge; repository sync is not forbidden just because execution is blocked.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version-level promotion review concludes the queued candidate first.`
2. `This queue doc then becomes the queue-level governor for the admitted visual convergence work.`
3. `Only then may active_task be exposed and implementation continue.`

### Recovery Rule

- `Do not recreate this queue from scratch if the version plan still records the same admission basis.`
- `Resume from the version plan and this queue doc unless new material evidence invalidates the approved UI-convergence boundary.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-prd-workbench-ui-visual-alignment.boundary-baseline-reconcile` | `completed` | `Confirm that creator-first workbench visual convergence remains the next smallest same-family PRD gap.` | `none` | `Completed on 2026-07-13 after repository inspection reconfirmed that the structural queues are all closed, but the workspace still presents a darker scaffold-like shell, still keeps extra non-authoring entry actions near the editor surface, and still exposes more raw ID-centric summaries than the approved creator-first design allows.` |
| `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation` | `in_progress` | `Land the bounded warm-paper shell convergence, top utility-bar cleanup, and creator-visible summary filtering.` | `task.script-editor-prd-workbench-ui-visual-alignment.boundary-baseline-reconcile` | `In progress on 2026-07-13 while converging the workspace shell toward the approved design-system direction without reopening closed structural authoring scope.` |
| `task.script-editor-prd-workbench-ui-visual-alignment.queue-closeout-and-handoff` | `pending` | `Verify the queue-local visual slice, classify remaining residue, and hand control back to version review.` | `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation` | `Pending until the bounded visual convergence slice and regression verification both pass.` |

### Task Definitions

#### `task.script-editor-prd-workbench-ui-visual-alignment.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-prd-workbench-ui-visual-alignment.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/script-editor-prd.md`
  - `docs/script-editor-ui-design-guide.md`
  - `docs/script-editor-field-visibility-spec.md`
  - `docs/script-editor-ui-redesign-demo.html`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
- must_inspect:
  - `docs/script-editor-prd.md`
  - `docs/script-editor-ui-design-guide.md`
  - `docs/script-editor-field-visibility-spec.md`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `src/ui/main-ui/main-ui-flow.js`
- must_not_change:
  - `project-selection queue ownership`
  - `closed structural authoring queue boundaries`
  - `runtime export or compatibility policy`
- done_when:
  - `Queue-local truth confirms that creator-first shell convergence and first-screen field-visibility cleanup remain the next smallest same-family PRD gap after the closed preview/export queue.`
  - `Current repository evidence still supports this queue as narrower than any new schema, runtime, or cross-target change.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation`

##### Human Context

- task_brief:
  - `Confirm the visual-convergence boundary before implementation widens.`
- task_outcome_summary:
  - `Completed after repository inspection confirmed that the next lawful gap is no longer structural authoring, but final creator-workbench shell convergence and creator-visible copy cleanup on top of the closed baseline.`

#### `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation`

##### Control Block

- task_id: `task.script-editor-prd-workbench-ui-visual-alignment.workbench-ui-visual-implementation`
- state: `in_progress`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/script-editor-ui-design-guide.md`
  - `docs/script-editor-field-visibility-spec.md`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/views/script-editor/script-editor-workspace-view.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `project-library ownership`
  - `closed queue structural boundaries`
  - `runtime/schema contracts`
- done_when:
  - `The workspace shell converges toward the approved warm-paper creator-desk direction instead of keeping the darker scaffold presentation.`
  - `The current editor workspace no longer keeps open/import/project-entry actions as persistent first-screen workspace chrome.`
  - `First-screen summaries and object-list subtitles prefer creator-visible copy over raw ID-heavy scaffolding where no technical view is required.`
- verify_with:
  - `npm run build:test`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-prd-workbench-ui-visual-alignment.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement the bounded creator-first workbench shell convergence and first-screen field-visibility cleanup.`
- task_outcome_summary:
  - `In progress while converging the workbench shell toward the approved creator-first visual direction and reducing first-screen raw ID exposure without reopening closed structural queues.`

#### `task.script-editor-prd-workbench-ui-visual-alignment.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-prd-workbench-ui-visual-alignment.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-workbench-ui-visual-alignment-queue.md`
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
  - `Close the queue only after visual convergence verification and routing truth are synchronized.`
- task_outcome_summary:
  - `Pending until the active visual convergence slice and its governance synchronization are both complete.`
