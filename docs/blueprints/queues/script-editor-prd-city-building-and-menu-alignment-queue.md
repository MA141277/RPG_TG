# Script Editor PRD City Building And Menu Alignment Queue

## Control Block

- queue_id: `queue.script-editor-prd-city-building-and-menu-alignment`
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
- closure_basis: `The bounded city/building authoring slice is landed and verified: the repository now exposes dedicated city and building list/detail surfaces, configurable menu families, access-state controls, and building entry-binding authoring on top of the closed workbench/project-selection/person-authoring baseline. Execution for this queue is complete, but the next remaining same-family PRD residue now shifts to dialogue/event/story authoring rather than more city/building continuation.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-prd-dialogue-event-story-alignment`
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
  - `Align script-editor city/building authoring with PRD section 6 by landing dedicated city and building list/detail surfaces, menu-family and entry-binding authoring, and configurable access-state entrypoints without widening into full dialogue/event/story editors.`
- Forbidden expansions:
  - `Do not widen this queue into formal dialogue/event/story page implementations, preview/export product surfaces, or new runtime mechanic invention beyond configuration-first reuse of existing city/house/menu capability families.`
  - `Do not reopen the already closed workbench/project-selection/person-authoring queues, runtime export policy, compatibility policy, or shared-rule compile semantics by convenience.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-13-script-editor-prd-alignment-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`

### Queue Snapshot

- queue_goal: `Turn the current hidden/generic city and building families into the PRD-defined first-cut authoring surface: dedicated city/building list-detail flow, configurable menu families, access-state controls, and building entry-binding surfaces without widening into downstream object-family editors.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the bounded city/building slice closed after the repository gained dedicated city/building detail surfaces, configurable menu families, access-state controls, and building entry-binding authoring with verification.`
- task_briefs:
  - `task.script-editor-prd-city-building-and-menu-alignment.boundary-baseline-reconcile: confirm that city/building authoring, menu-family binding, and access-state entrypoints remain the next smallest same-family PRD gap after the closed person-authoring continuation.`
  - `task.script-editor-prd-city-building-and-menu-alignment.city-building-and-menu-implementation: land the bounded city/building authoring surface, menu-family configuration, and entry/access binding slices without widening into downstream dialogue/event/story editors.`
  - `task.script-editor-prd-city-building-and-menu-alignment.queue-closeout-and-handoff: verify the queue-local city/building slice, classify remaining residue, and hand control to the next lawful PRD queue.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 瑜版挸澧犻幍褑顢戦梼鐔峰灙 from queue_id.`
- `The fixed operator receipt must source 瑜版挸澧犳禒璇插 from active_task.`
- `The fixed operator receipt must source 瑜版挸澧犻梼鐔峰灙閻╊喗鐖?from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded city/building authoring slice landed and verified.`
- `topic_closure_status = open-residue reflects that downstream same-version PRD queues still remain after city/building authoring, even if this slice itself closes cleanly.`
- `Because residue_family = same-family and one lawful continuation exists, next_family_candidate must name the next recorded same-version PRD queue before version-level routing continues.`

### Admission Preconditions

- `This queue is admitted only after queue.script-editor-prd-workspace-and-navigation-alignment, queue.script-editor-prd-project-selection-and-workspace-layout-alignment, and queue.script-editor-prd-person-authoring-alignment are all closed historical evidence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `This queue must consume rather than re-own the already landed persistence/export/import/shared-rule/workbench/project-selection/person-authoring baselines.`

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
| `task.script-editor-prd-city-building-and-menu-alignment.boundary-baseline-reconcile` | `completed` | `Confirm that city/building authoring, menu-family binding, and access-state entrypoints remain the next smallest same-family PRD gap.` | `none` | `Completed on 2026-07-13 after repository inspection confirmed that cities/buildings still remain outside the visible minimal workflow surface, still fall back to generic entity records, and still lack the dedicated PRD section 6 authoring surface for menu families, access states, and entry bindings.` |
| `task.script-editor-prd-city-building-and-menu-alignment.city-building-and-menu-implementation` | `completed` | `Land the bounded city/building authoring surface, configurable menu families, and entry/access binding slices without widening into downstream dialogue/event/story editors.` | `task.script-editor-prd-city-building-and-menu-alignment.boundary-baseline-reconcile` | `Completed on 2026-07-13 after the repository gained dedicated city/building authoring surfaces, configurable menu families, access-state controls, and building entry-binding authoring without widening into downstream family editors.` |
| `task.script-editor-prd-city-building-and-menu-alignment.queue-closeout-and-handoff` | `completed` | `Verify the queue-local city/building slice, classify remaining residue, and hand control to the next lawful PRD queue.` | `task.script-editor-prd-city-building-and-menu-alignment.city-building-and-menu-implementation` | `Completed on 2026-07-13 after verification passed, queue truth was synchronized, and the remaining same-family residue was routed back to version-level promotion review with dialogue/event/story recorded as the next lawful candidate.` |

### Historical Handoff Note

- Task ID:
  - `task.script-editor-prd-city-building-and-menu-alignment.queue-closeout-and-handoff`
- Recorded handoff at closure:
  - `The bounded PRD city/building/menu continuation is complete. Return to target.script-editor-prd-alignment version review and evaluate queue.script-editor-prd-dialogue-event-story-alignment as the next lawful candidate.`
- Recorded expected output:
  - `One dedicated city/building authoring baseline now exists as reusable upstream surface for later dialogue/event/story, minigame-binding, and preview/validation queues.`

### Task Definitions

#### `task.script-editor-prd-city-building-and-menu-alignment.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-prd-city-building-and-menu-alignment.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/script-editor-prd.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
- must_inspect:
  - `docs/script-editor-prd.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
- must_not_change:
  - `formal dialogue/event/story editors`
  - `preview/export product surfaces`
  - `runtime export or compatibility policy`
- done_when:
  - `Queue-local truth confirms that dedicated city/building authoring, menu-family binding, and access-state entrypoints remain the next smallest same-family PRD gap.`
  - `Current repository evidence still supports this queue as narrower than dialogue/event/story, minigame-binding, and preview/export queues.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-prd-city-building-and-menu-alignment.city-building-and-menu-implementation`

##### Human Context

- task_brief:
  - `Confirm the city/building/menu boundary before implementation continues.`
- task_outcome_summary:
  - `Completed after repository inspection confirmed that cities/buildings remain hidden or generic in the current authoring surface and still lack the dedicated PRD section 6 menu/access/binding editor surface.`

#### `task.script-editor-prd-city-building-and-menu-alignment.city-building-and-menu-implementation`

##### Control Block

- task_id: `task.script-editor-prd-city-building-and-menu-alignment.city-building-and-menu-implementation`
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
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `formal dialogue/event/story page implementations`
  - `preview/export product surfaces`
  - `new runtime mechanic families beyond configuration-first authoring reuse`
- done_when:
  - `The workbench exposes dedicated city and building list/detail authoring surfaces instead of keeping those families hidden or trapped in the generic editor path.`
  - `The city/building detail surfaces expose bounded menu-family configuration, access-state controls, and building entry-binding authoring aligned to PRD section 6.`
  - `The bounded city/building slice reuses the existing project/export/import baselines and formal city/house/menu capability families without widening into downstream family pages.`
- verify_with:
  - `npm run build:test`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.script-editor-prd-city-building-and-menu-alignment.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement the bounded city/building list-detail and menu/access binding slice.`
- task_outcome_summary:
  - `Completed on 2026-07-13 after the repository gained dedicated city/building authoring surfaces, configurable menu families, access-state controls, and building entry-binding editing on top of the closed workbench/project-selection/person-authoring baseline.`

#### `task.script-editor-prd-city-building-and-menu-alignment.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-prd-city-building-and-menu-alignment.queue-closeout-and-handoff`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-city-building-and-menu-alignment-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/plans/2026-07-13-script-editor-prd-alignment-target-plan.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/queues/script-editor-prd-city-building-and-menu-alignment-queue.md`
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
  - `Close the queue only after city/building verification and routing truth are synchronized.`
- task_outcome_summary:
  - `Completed on 2026-07-13 after queue truth, version truth, and project-progress truth were synchronized and the next lawful continuation was explicitly routed back to version-level promotion review.`
