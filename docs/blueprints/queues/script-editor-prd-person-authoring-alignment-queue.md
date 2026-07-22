# Script Editor PRD Person Authoring Alignment Queue

## Control Block

- queue_id: `queue.script-editor-prd-person-authoring-alignment`
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
- closure_basis: `The bounded person-authoring slice is landed and verified: the repository now exposes a dedicated person list/detail authoring surface, structured person detail tabs, and bounded dialogue/event/trade relation entrypoints on top of the closed workbench/project-selection baseline. Execution for this queue is complete, but the next remaining same-family PRD residue now shifts to city/building/menu authoring rather than more person-surface continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-prd-city-building-and-menu-alignment`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `none`
- sync_summary: `No repository sync batch is recorded until queue-local execution and closeout truth are written.`
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
  - `Align script-editor person authoring with PRD section 5 by landing a unified person model, a dedicated person list/detail surface, structured person tabs, and bounded relation/capability entrypoints without widening into city/building or full dialogue/event editors.`
- Forbidden expansions:
  - `Do not widen this queue into city/building/menu authoring, formal dialogue/event/story page implementations, or preview/export product surfaces.`
  - `Do not reopen the already closed workbench/project-selection queues, runtime export policy, compatibility policy, or shared-rule compile semantics by convenience.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-13-script-editor-prd-alignment-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`

### Queue Snapshot

- queue_goal: `Turn the current generic people JSON editing surface into the PRD-defined person authoring first cut: unified person records, structured tabs, and bounded relation/capability entrypoints without widening into downstream object-family editors.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded person-authoring slice closed after the repository gained one dedicated person list/detail surface, structured person tabs, and bounded relation/capability entrypoints with verification.`
- task_briefs:
  - `task.script-editor-prd-person-authoring-alignment.boundary-baseline-reconcile: confirm that person list/detail, structured tabs, and bounded relation/capability entrypoints remain the next smallest same-family PRD gap after the closed workbench/project-selection continuation.`
  - `task.script-editor-prd-person-authoring-alignment.person-authoring-implementation: land the bounded unified person model, dedicated person authoring surface, and bounded relation/capability entrypoints without widening into downstream family editors.`
  - `task.script-editor-prd-person-authoring-alignment.queue-closeout-and-handoff: verify the queue-local person-authoring slice, classify remaining residue, and hand control to the next lawful PRD queue.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded person-authoring slice landed and verified.`
- `topic_closure_status = open-residue reflects that downstream same-version PRD queues still remain after person authoring, even if the person slice itself closes cleanly.`
- `Because residue_family = same-family and one lawful continuation exists, next_family_candidate must name the next recorded same-version PRD queue before version-level routing continues.`

### Admission Preconditions

- `This queue is admitted only after queue.script-editor-prd-workspace-and-navigation-alignment and queue.script-editor-prd-project-selection-and-workspace-layout-alignment are both closed historical evidence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must consume rather than re-own the already landed persistence/export/import/shared-rule/workbench/project-selection baselines.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `A blocked queue still allows commit, push, and merge; repository sync is not forbidden just because execution is blocked.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Activation Order

1. `Version plan review subject and basis are written first.`
2. `Version-level admission review concludes before this queue becomes live execution truth.`
3. `This queue doc is created and synchronized as the queue-level governor.`
4. `Only then may active_task be exposed and implementation begin.`

### Recovery Rule

- `Do not recreate or reactivate this queue from scratch if the version plan already records its prior admission basis.`
- `Resume from the version-plan admission record unless new material evidence invalidates that prior basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-prd-person-authoring-alignment.boundary-baseline-reconcile` | `completed` | `Confirm that person list/detail, structured tabs, and bounded relation/capability entrypoints remain the next smallest same-family PRD gap.` | `none` | `Completed on 2026-07-13 after repository inspection confirmed that the current workbench still treats people as generic minimal records and lacks a dedicated person authoring surface, structured tabs, and bounded relation/capability entrypoints required by PRD section 5.` |
| `task.script-editor-prd-person-authoring-alignment.person-authoring-implementation` | `completed` | `Land the bounded unified person model, dedicated person authoring surface, and bounded relation/capability entrypoints without widening into downstream family editors.` | `task.script-editor-prd-person-authoring-alignment.boundary-baseline-reconcile` | `Completed on 2026-07-13 after the repository gained one dedicated person authoring surface, a unified person record shape, structured tabs, and bounded dialogue/event/trade entrypoints without widening into downstream family editors.` |
| `task.script-editor-prd-person-authoring-alignment.queue-closeout-and-handoff` | `completed` | `Verify the queue-local person-authoring slice, classify remaining residue, and hand control to the next lawful PRD queue.` | `task.script-editor-prd-person-authoring-alignment.person-authoring-implementation` | `Completed on 2026-07-13 after verification passed, queue truth was synchronized, and the remaining same-family residue was routed back to version-level promotion review with city/building/menu recorded as the next lawful candidate.` |

### Historical Handoff Note

- Task ID:
  - `task.script-editor-prd-person-authoring-alignment.queue-closeout-and-handoff`
- Recorded handoff at closure:
  - `The bounded PRD person-authoring continuation is complete. Return to target.script-editor-prd-alignment version review and evaluate queue.script-editor-prd-city-building-and-menu-alignment as the next lawful candidate.`
- Recorded expected output:
  - `One dedicated person authoring baseline now exists as reusable upstream surface for later city/building, dialogue/event, and preview/validation queues.`

### Task Definitions

#### `task.script-editor-prd-person-authoring-alignment.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-prd-person-authoring-alignment.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/script-editor-prd.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/**`
  - `src/ui/views/script-editor/**`
  - `src/styles/script-editor.css`
- must_inspect:
  - `docs/script-editor-prd.md`
  - `src/domain/script-editor-project.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
- must_not_change:
  - `city/building/menu authoring surfaces`
  - `formal dialogue/event/story editors`
  - `runtime export or compatibility policy`
- done_when:
  - `Queue-local truth confirms that dedicated person authoring remains the next smallest same-family PRD gap.`
  - `Current repository evidence still supports this queue as narrower than city/building, dialogue/event/story, and preview/export queues.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-prd-person-authoring-alignment.person-authoring-implementation`

##### Human Context

- task_brief:
  - `Confirm the person-authoring boundary before implementation continues.`
- task_outcome_summary:
  - `Completed after repository inspection confirmed that people remain generic minimal records and still lack the dedicated PRD section 5 authoring surface.`

#### `task.script-editor-prd-person-authoring-alignment.person-authoring-implementation`

##### Control Block

- task_id: `task.script-editor-prd-person-authoring-alignment.person-authoring-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/**`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/styles/**`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `docs/script-editor-prd.md`
  - `src/domain/script-editor-project.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `city/building/menu authoring surfaces`
  - `formal dialogue/event/story page implementations`
  - `preview/export product surfaces`
- done_when:
  - `The workbench exposes a dedicated person list/detail authoring surface instead of the generic minimal record editor for people.`
  - `The person detail surface exposes structured tabs aligned to PRD section 5, with unified person model fields and bounded relation/capability entrypoints.`
  - `The bounded person authoring slice reuses the existing project/export/import baselines without widening into downstream family pages.`
- verify_with:
  - `npm run build:test`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-prd-person-authoring-alignment.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement the bounded person list/detail authoring and structured tab slice.`
- task_outcome_summary:
  - `Completed on 2026-07-13 after the repository gained one dedicated person authoring surface, structured tabs, a unified person model, and bounded dialogue/event/trade entrypoints on top of the closed workbench/project-selection baseline.`

#### `task.script-editor-prd-person-authoring-alignment.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-prd-person-authoring-alignment.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-person-authoring-alignment-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-person-authoring-alignment-queue.md`
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
  - `Close the queue only after person-authoring verification and routing truth are synchronized.`
- task_outcome_summary:
  - `Completed on 2026-07-13 after queue truth, version truth, and project-progress truth were synchronized and the next lawful continuation was explicitly routed back to version-level promotion review.`
