# Layout Editor Retirement And Reference Removal Queue

## Control Block

- queue_id: `queue.layout-editor-retirement-and-reference-removal`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `done`
- queue_class: `conditional`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
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
  - `Retire the live layout editor feature and remove its covered runtime or render or startup or reference surfaces without silently absorbing broader shared UI layout-baseline or reserve-family work.`
- Forbidden expansions:
  - `Do not widen this queue into generic shared UI framework redesign, ui-contract-registry activation, or broad reserve-family authoring work.`
  - `Do not treat runtime uiLayouts baseline removal as the first slice when the current covered production path still consumes those layouts outside the editor itself.`

### Parent Target

- Target spec:
  - `docs/blueprints/specs/2026-07-06-project-complete-modularization-target.md`
- Target plan:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
- Historical ownerization queue:
  - `docs/blueprints/queues/main-shell-and-layout-editor-ownerization-queue.md`

### Queue Snapshot

- queue_goal: `Retire the live layout editor feature family through bounded slices, starting with the live editor surface rather than broader shared layout-baseline extraction.`
- task_count: `7`
- completed_task_count: `7`
- remaining_task_count: `0`
- active_task_summary: `No active task remains; the queue closed after dead layoutEditor-state cleanup landed and residue review returned the remaining broader uiLayouts baseline and preset family to target review instead of widening in-queue.`
- task_briefs:
  - `task.layout-editor-retirement-and-reference-removal.baseline-reconcile: freeze the first lawful layout-editor retirement slice and confirm this queue remains bounded on current source truth.`
  - `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement: remove the covered live layout-editor launch or render or interaction surface without deleting the broader shared uiLayouts baseline yet.`
  - `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review: classify whether the remaining residue still belongs to this queue after the first editor-surface retirement cut.`
  - `task.layout-editor-retirement-and-reference-removal.main-ui-live-editor-surface-retirement: remove the still-live main-ui editor mount and binding protocol that remained outside the first covered production path.`
  - `task.layout-editor-retirement-and-reference-removal.post-main-ui-residue-review: classify whether any remaining residue still forms another lawful same-queue cut after the main-ui surface is retired.`
  - `task.layout-editor-retirement-and-reference-removal.editor-state-and-dead-module-retirement: remove the remaining dead layoutEditor state and editor-only module family while preserving uiLayouts baseline consumption.`
  - `task.layout-editor-retirement-and-reference-removal.post-editor-state-residue-review: reassess whether any remaining uiLayouts or preset or reserve-family residue still forms another lawful same-queue cut after dead editor-state cleanup.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩爣 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Admission Preconditions

- `This queue was admitted only after the target plan synchronized the existing candidate identity and the fresh 2026-07-09 bounded admission basis.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`
- `The queue must stay on layout-editor retirement and reference removal and must not silently absorb broader shared UI layout-baseline or reserve-layer activation work that belongs to later review.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or target truth.`
- `Repository sync failure must not be copied into blocked_by, queue closeout gates, or target scheduling truth.`

### Activation Order

1. `Target plan admission review concluded before this queue became live execution truth.`
2. `This queue doc now acts as the queue-level governor for the admitted layout-editor retirement work.`
3. `Implementation may begin only through the written active task below.`

### Recovery Rule

- `Do not recreate or re-audit this queue from scratch while the recorded layout-editor evidence remains valid.`
- `Resume from this queue doc and the target-plan candidate record unless new material evidence invalidates the admitted basis.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.layout-editor-retirement-and-reference-removal.baseline-reconcile` | `completed` | `Freeze the smallest lawful first retirement slice and confirm the admitted queue still stands on current source truth.` | `none` | `Completed after queue-local inspection froze the first slice as live editor-surface retirement instead of broader uiLayouts or preset baseline deletion.` |
| `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement` | `completed` | `Remove the covered live layout-editor launch or render or interaction surface without deleting the broader shared uiLayouts baseline yet.` | `task.layout-editor-retirement-and-reference-removal.baseline-reconcile` | `Completed after the production path stopped mounting the editor surface, main.ts dropped coordinator wiring, and character detail views stopped emitting editor-only binding protocol.` |
| `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review` | `completed` | `Classify whether the remaining uiLayouts or preset or reserve-family residue still belongs to this queue after the first live editor-surface retirement cut.` | `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement` | `Completed after queue-local residue review proved a still-live main-ui editor surface remains in scope, while broader uiLayouts baseline, preset defaults, and reserve-family cleanup still stay out of the next slice.` |
| `task.layout-editor-retirement-and-reference-removal.main-ui-live-editor-surface-retirement` | `completed` | `Remove the still-live main-ui editor mount and binding protocol without widening into broader uiLayouts baseline cleanup.` | `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review` | `Completed after main-ui rendering stopped mounting renderLayoutEditor, layout application downgraded to static bindings, and start-screen plus character-select-screen left the live target registry.` |
| `task.layout-editor-retirement-and-reference-removal.post-main-ui-residue-review` | `completed` | `Classify whether any remaining residue still forms another lawful same-queue cut after the main-ui surface is retired.` | `task.layout-editor-retirement-and-reference-removal.main-ui-live-editor-surface-retirement` | `Completed after queue-local residue review proved no still-live editor surface remains on the covered production path, while layoutEditor state plus editor-only modules remain as a smaller dead-cleanup continuation and uiLayouts baseline cleanup still stays out of scope.` |
| `task.layout-editor-retirement-and-reference-removal.editor-state-and-dead-module-retirement` | `completed` | `Remove the remaining dead layoutEditor state and editor-only module family while preserving uiLayouts baseline consumption.` | `task.layout-editor-retirement-and-reference-removal.post-main-ui-residue-review` | `Completed after app-state bootstrap dropped layoutEditor, the remaining editor-only module family was deleted, and the uiLayouts baseline stayed intact through the renamed createDefaultUiLayoutAppState seam.` |
| `task.layout-editor-retirement-and-reference-removal.post-editor-state-residue-review` | `completed` | `Reassess whether any remaining uiLayouts or preset or reserve-family residue still forms another lawful same-queue cut after dead editor-state cleanup.` | `task.layout-editor-retirement-and-reference-removal.editor-state-and-dead-module-retirement` | `Completed after queue-local residue review concluded that the remaining uiLayouts baseline and preset family is broader target-review residue rather than another already-frozen same-queue continuation.` |

### Task Definitions

#### `task.layout-editor-retirement-and-reference-removal.baseline-reconcile`

##### Control Block

- task_id: `task.layout-editor-retirement-and-reference-removal.baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
  - `src/main.ts`
  - `src/ui/app-render.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/application/layout-editor/**`
  - `src/content/layout-editor-presets.ts`
  - `src/ui/views/character/character-detail-view.ts`
  - `tests/**`
- must_inspect:
  - `src/main.ts`
  - `src/ui/app-render.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/application/layout-editor/layout-editor-coordinator.ts`
  - `src/content/layout-editor-presets.ts`
  - `src/ui/views/character/character-detail-view.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `broader shared uiLayouts baseline extraction`
  - `ui-contract-registry or reserve-family activation`
  - `unrelated render or house or runtime queue families`
- done_when:
  - `Queue truth names the smallest lawful first implementation slice that can land under the admitted layout-editor retirement boundary.`
  - `Queue-local evidence confirms the live editor surface is smaller than the remaining uiLayouts or preset or reserve-family residue and does not silently absorb broader UI framework work.`
  - `The first retirement cut is frozen before implementation begins.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "createLayoutEditorCoordinator|renderLayoutEditor|open-layout-editor|close-layout-editor|uiLayouts|layoutEditor|layout-editor-presets" src/main.ts src/ui/app-render.ts src/ui/tools/layout-editor-view.ts src/application/layout-editor/layout-editor-bootstrap.ts src/application/layout-editor/layout-editor-coordinator.ts src/content/layout-editor-presets.ts src/ui/views/character/character-detail-view.ts tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in this queue doc rather than widening scope silently.`
  - `Return control to target review only if fresh evidence disproves this queue's admitted basis.`
- promote_next_if_done: `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement`
- stop_if:
  - `Fresh inspection proves the remaining work belongs primarily to broader shared UI baseline or reserve-family work instead of layout-editor retirement.`

##### Human Context

- task_brief:
  - `Freeze the first lawful layout-editor retirement cut before queue-local implementation begins.`
- task_outcome_summary:
  - `Completed after queue-local inspection froze the first implementation slice as live layout-editor surface retirement while leaving uiLayouts baseline, preset defaults, and reserve-family residue for later review.`
- Purpose:
  - `Prevent this admitted queue from jumping straight into shared uiLayouts baseline deletion before the smallest still-live editor surface is removed.`
- Failure mode:
  - `Do not treat all uiLayouts or preset or reserve residue as one implementation batch before the editor-only surface is peeled away.`
- Fresh baseline findings:
  - `src/ui/app-render.ts still mounts renderLayoutEditor(input.appState) on the covered production render path.`
  - `src/main.ts still instantiates createLayoutEditorCoordinator and wires editor input or pointer or click handling into the live app shell path.`
  - `src/application/layout-editor/layout-editor-bootstrap.ts still seeds both uiLayouts and layoutEditor, but uiLayouts are also consumed by non-editor rendering such as global HUD and character detail views on the covered path.`
  - `src/content/layout-editor-presets.ts still acts as the current runtime layout baseline, which means deleting that baseline is broader than retiring the live editor feature surface itself.`
- Frozen first slice:
  - `The first lawful implementation slice is to retire the covered live layout-editor launch or render or interaction surface from the production path while preserving the current uiLayouts baseline and preset-backed layout consumption for non-editor rendering.`
  - `This slice is smaller than the broader queue because it removes the user-facing editor feature line first, while leaving shared layout baseline extraction, preset cleanup, reserve-family alignment, and residual docs or tests for later in-queue or later target review.`

#### `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement`

##### Control Block

- task_id: `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/main.ts`
  - `src/ui/app-render.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/application/layout-editor/layout-editor-coordinator.ts`
  - `src/ui/views/character/character-detail-view.ts`
  - `tests/**`
- must_inspect:
  - `src/main.ts`
  - `src/ui/app-render.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/application/layout-editor/layout-editor-coordinator.ts`
  - `src/ui/views/character/character-detail-view.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `uiLayouts baseline bootstrap or preset truth beyond what is strictly required to retire the live editor surface`
  - `ui-contract-registry or reserve-family activation`
  - `non-editor screen layout consumption semantics`
- done_when:
  - `The covered production path no longer exposes live layout-editor launch or render or input interaction behavior.`
  - `The live app shell no longer depends on layout-editor coordinator wiring on the covered path.`
  - `Verification passes without widening into broader shared uiLayouts baseline removal.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run typecheck`
  - `npm test`
- if_blocked:
  - `Record the blocker explicitly in this queue doc instead of widening into broader shared UI baseline work.`
  - `Do not absorb uiLayouts or preset cleanup just to force the first retirement slice through.`
- promote_next_if_done: `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review`
- stop_if:
  - `The required seam expands into a broader shared UI baseline redesign instead of a bounded live editor-surface retirement cut.`

##### Human Context

- task_brief:
  - `Retire the covered live layout-editor launch or render or interaction surface before broader layout baseline cleanup is reconsidered.`
- task_outcome_summary:
  - `Completed after the production shell stopped mounting renderLayoutEditor, main.ts removed layoutEditorCoordinator wiring, and character-detail views kept layout positioning while dropping editor-only handles and resize affordances.`
- Purpose:
  - `Remove the still-live editor feature line first instead of starting with broader preset or layout-baseline deletion.`
- Failure mode:
  - `Do not turn this first cut into a full shared UI baseline or reserve-family rewrite.`
- Execution notes:
  - `The current covered editor surface spans renderLayoutEditor in src/ui/app-render.ts, createLayoutEditorCoordinator and related event wiring in src/main.ts, and editor-aware selection affordances in the rendered views.`
  - `The first implementation cut should remove that live editor surface before deciding whether layoutEditor state, uiLayouts bootstrap, preset defaults, or reserve-family docs and tests remain same-queue residue.`

#### `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review`

##### Control Block

- task_id: `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/tools/live-layout-bindings.js`
  - `src/application/layout-editor/layout-editor-target-registry.ts`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/content/layout-editor-presets.ts`
  - `src/domain/content-pack.ts`
  - `tests/**`
- must_inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/tools/live-layout-bindings.js`
  - `src/application/layout-editor/layout-editor-target-registry.ts`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/content/layout-editor-presets.ts`
  - `src/domain/content-pack.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
- must_not_change:
  - `already-landed live editor-surface retirement slice`
  - `unrelated framework reserve work`
  - `target closeout truth`
- done_when:
  - `Queue-local truth states whether the remaining uiLayouts or preset or reserve-family residue stays as another bounded in-queue slice or returns to target review for later admission.`
  - `Queue snapshot, task counts, and target truth are synchronized with that decision before any repository sync batch.`
  - `The queue does not silently absorb broader shared UI baseline work without a fresh written boundary.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "renderLayoutEditor|applyLiveLayoutBindings|data-layout-component-handle|data-layout-element-handle|c-main-ui-layout-resize-handle|c-main-ui-layout-element-resize-handle|layoutEditor\.isOpen|uiLayouts|layout-editor-presets|ui-contract-registry" src/ui/main-ui/main-ui-flow.js src/ui/tools/live-layout-bindings.js src/application/layout-editor/layout-editor-target-registry.ts src/application/layout-editor/layout-editor-bootstrap.ts src/content/layout-editor-presets.ts src/domain/content-pack.ts tests/robustness.test.cjs`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to target review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `task.layout-editor-retirement-and-reference-removal.main-ui-live-editor-surface-retirement`
- stop_if:
  - `Required queue or target truth is not synchronized.`

##### Human Context

- task_brief:
  - `Classify whether the remaining residue still belongs to this queue after the first live editor-surface retirement cut.`
- task_outcome_summary:
  - `Completed after queue-local review proved that src/ui/main-ui/main-ui-flow.js still mounts renderLayoutEditor and still routes main-ui bindings through applyLiveLayoutBindings, so the queue stays active on one smaller main-ui retirement slice instead of jumping to broader uiLayouts baseline or preset cleanup.`
- Purpose:
  - `Keep the queue aligned with current evidence after the first retirement slice lands.`
- Failure mode:
  - `Do not auto-absorb broader shared UI baseline extraction without a fresh queue-local decision.`
- Completion notes:
  - `src/ui/main-ui/main-ui-flow.js still appends renderLayoutEditor(this.getAppState()) to the main-ui overlay surface and still treats layoutEditor.isOpen as a live interaction gate.`
  - `src/ui/tools/live-layout-bindings.js still emits data-layout-component-handle or data-layout-element-handle attributes together with main-ui resize handles, which means the remaining residue is not only dormant baseline data.`
  - `src/application/layout-editor/layout-editor-target-registry.ts still includes start-screen and character-select-screen live targets, so the next lawful same-queue cut is bounded main-ui editor-surface retirement rather than immediate layout bootstrap or preset deletion.`
  - `src/application/layout-editor/layout-editor-bootstrap.ts, src/content/layout-editor-presets.ts, and src/domain/content-pack.ts still describe broader layout baseline residue, but that broader cleanup remains out of scope for the next active slice.`

#### `task.layout-editor-retirement-and-reference-removal.main-ui-live-editor-surface-retirement`

##### Control Block

- task_id: `task.layout-editor-retirement-and-reference-removal.main-ui-live-editor-surface-retirement`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/tools/live-layout-bindings.js`
  - `src/application/layout-editor/layout-editor-target-registry.ts`
  - `tests/**`
- must_inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/tools/live-layout-bindings.js`
  - `src/application/layout-editor/layout-editor-target-registry.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `broader uiLayouts bootstrap or preset baseline cleanup`
  - `reserve-family activation or ui-contract-registry redesign`
  - `unrelated app-shell or house runtime work`
- done_when:
  - `The main-ui path no longer mounts renderLayoutEditor or consumes applyLiveLayoutBindings as a live editor protocol on the covered start-screen or character-select-screen surface.`
  - `The covered main-ui interaction path no longer depends on layoutEditor.isOpen or editor-only handle attributes for those screens.`
  - `Verification passes without widening into broader uiLayouts baseline deletion or preset removal.`
- verify_with:
  - `node --test --test-name-pattern "layout editor main-ui retirement" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc instead of widening directly into layout bootstrap or preset cleanup.`
  - `Return to target review only if fresh inspection disproves the main-ui surface as a lawful same-queue slice.`
- promote_next_if_done: `task.layout-editor-retirement-and-reference-removal.post-main-ui-residue-review`
- stop_if:
  - `The required work expands beyond retiring the still-live main-ui editor surface.`

##### Human Context

- task_brief:
  - `Retire the still-live main-ui editor mount and binding protocol without widening into broader layout-baseline cleanup.`
- task_outcome_summary:
  - `Completed after src/ui/main-ui/main-ui-flow.js stopped mounting renderLayoutEditor, downgraded main-ui layout application to static bindings, removed the layoutEditor.isOpen click gate, and src/application/layout-editor/layout-editor-target-registry.ts dropped start-screen plus character-select-screen from the live target set.`
- Purpose:
  - `Finish removing still-live editor-only behavior that remained outside the first covered production-path retirement slice.`
- Failure mode:
  - `Do not use this slice to silently delete layout baseline state, preset defaults, or reserve-family coverage that has not yet been reclassified.`

#### `task.layout-editor-retirement-and-reference-removal.post-main-ui-residue-review`

##### Control Block

- task_id: `task.layout-editor-retirement-and-reference-removal.post-main-ui-residue-review`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
  - `src/main.ts`
  - `src/application/app-shell.ts`
  - `src/application/startup/prototype-startup-app-state.ts`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/application/layout-editor/layout-editor-actions.ts`
  - `src/application/layout-editor/layout-editor-coordinator.ts`
  - `src/application/layout-editor/layout-editor-target-registry.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/content/layout-editor-presets.ts`
  - `src/domain/content-pack.ts`
  - `tests/**`
- must_inspect:
  - `src/main.ts`
  - `src/application/app-shell.ts`
  - `src/application/startup/prototype-startup-app-state.ts`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/application/layout-editor/layout-editor-actions.ts`
  - `src/application/layout-editor/layout-editor-coordinator.ts`
  - `src/application/layout-editor/layout-editor-target-registry.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `src/content/layout-editor-presets.ts`
  - `src/domain/content-pack.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
- must_not_change:
  - `already-landed editor-surface retirement slices`
  - `unrelated shared UI framework work`
  - `target closeout truth`
- done_when:
  - `Queue-local truth states whether any remaining uiLayouts or preset or reserve-family residue still forms another lawful same-queue cut or returns to target review.`
  - `Queue snapshot and target truth are synchronized with that decision before any repository sync batch.`
  - `The queue does not silently absorb broader shared UI baseline work without a fresh written boundary.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "layout-editor-view|layout-editor-coordinator|layout-editor-actions|layout-editor-target-registry|layoutEditor|uiLayouts|layout-editor-presets|ui-contract-registry" src/main.ts src/application/app-shell.ts src/application/startup/prototype-startup-app-state.ts src/application/layout-editor/layout-editor-bootstrap.ts src/application/layout-editor/layout-editor-actions.ts src/application/layout-editor/layout-editor-coordinator.ts src/application/layout-editor/layout-editor-target-registry.ts src/ui/tools/layout-editor-view.ts src/content/layout-editor-presets.ts src/domain/content-pack.ts tests/robustness.test.cjs`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to target review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `task.layout-editor-retirement-and-reference-removal.editor-state-and-dead-module-retirement`
- stop_if:
  - `Required queue or target truth is not synchronized.`

##### Human Context

- task_brief:
  - `Classify whether any remaining residue still forms another lawful same-queue cut after the main-ui editor surface is retired.`
- task_outcome_summary:
  - `Completed after queue-local review proved no still-live layout editor surface remains on the covered production path, while src/main.ts, src/application/app-shell.ts, src/application/startup/prototype-startup-app-state.ts, and the editor-only layout-editor modules still carry dead layoutEditor-state residue that forms a smaller same-queue cleanup slice than broader uiLayouts baseline or preset removal.`
- Purpose:
  - `Prevent the queue from silently widening after the last still-live editor-only surface is removed.`
- Failure mode:
  - `Do not auto-absorb baseline cleanup or reserve-family work without a fresh boundary decision.`
- Completion notes:
  - `src/main.ts and src/application/startup/prototype-startup-app-state.ts still seed layoutEditor through createDefaultLayoutEditorAppState even though the covered production path no longer mounts or drives the editor surface.`
  - `src/application/app-shell.ts still exposes layoutEditor in AppState, while src/ui/tools/layout-editor-view.ts, src/application/layout-editor/layout-editor-coordinator.ts, and src/application/layout-editor/layout-editor-actions.ts now appear as editor-only modules without covered production consumers.`
  - `src/application/layout-editor/layout-editor-bootstrap.ts, src/content/layout-editor-presets.ts, and src/domain/content-pack.ts still carry uiLayouts baseline truth that remains live for non-editor rendering, so deleting that baseline is still broader than the next lawful slice.`

#### `task.layout-editor-retirement-and-reference-removal.editor-state-and-dead-module-retirement`

##### Control Block

- task_id: `task.layout-editor-retirement-and-reference-removal.editor-state-and-dead-module-retirement`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/main.ts`
  - `src/application/app-shell.ts`
  - `src/application/startup/prototype-startup-app-state.ts`
  - `src/application/layout-editor/**`
  - `src/ui/tools/layout-editor-view.ts`
  - `tests/**`
- must_inspect:
  - `src/main.ts`
  - `src/application/app-shell.ts`
  - `src/application/startup/prototype-startup-app-state.ts`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/application/layout-editor/layout-editor-actions.ts`
  - `src/application/layout-editor/layout-editor-coordinator.ts`
  - `src/application/layout-editor/layout-editor-target-registry.ts`
  - `src/ui/tools/layout-editor-view.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `uiLayouts baseline consumption for global-hud or main-ui or character detail rendering`
  - `layout preset truth beyond what is strictly required to retire dead editor-only state`
  - `unrelated runtime or house or reserve-family work`
- done_when:
  - `The covered production path no longer seeds or depends on layoutEditor state in app-state bootstrap or app-shell contracts.`
  - `Dead editor-only modules have no remaining covered production consumers or are removed without widening into uiLayouts baseline deletion.`
  - `Verification passes without changing non-editor uiLayouts rendering behavior.`
- verify_with:
  - `node --test --test-name-pattern "layout editor state retirement" tests/robustness.test.cjs`
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in this queue doc instead of widening into uiLayouts baseline cleanup.`
  - `Return to target review only if fresh inspection disproves dead editor-state cleanup as a lawful same-queue slice.`
- promote_next_if_done: `task.layout-editor-retirement-and-reference-removal.post-editor-state-residue-review`
- stop_if:
  - `The required work expands into broader uiLayouts baseline or preset redesign.`

##### Human Context

- task_brief:
  - `Retire the remaining dead layoutEditor state and editor-only modules while preserving uiLayouts baseline consumption.`
- task_outcome_summary:
  - `Completed after src/main.ts, src/application/app-shell.ts, src/application/startup/prototype-startup-app-state.ts, and src/application/layout-editor/layout-editor-bootstrap.ts dropped layoutEditor-state ownership, createDefaultUiLayoutAppState became the remaining uiLayouts-only bootstrap seam, src/styles/app.css stopped importing layout-editor.css, and the dead editor-only module family was removed without changing non-editor uiLayouts rendering behavior.`
- Purpose:
  - `Finish the dead editor-only residue that still remains after the last live editor surface was removed.`
- Failure mode:
  - `Do not turn this cleanup slice into broader uiLayouts baseline deletion or preset normalization.`
- Completion notes:
  - `src/main.ts and src/application/startup/prototype-startup-app-state.ts now depend on createDefaultUiLayoutAppState instead of createDefaultLayoutEditorAppState.`
  - `src/application/app-shell.ts and src/domain/ui-layout.ts no longer expose layoutEditor in AppState, while src/application/layout-editor/layout-editor-actions.ts, src/application/layout-editor/layout-editor-coordinator.ts, src/application/layout-editor/layout-editor-target-registry.ts, src/ui/tools/layout-editor-view.ts, and src/styles/layout-editor.css are removed as dead editor-only residue.`
  - `src/application/layout-editor/layout-editor-bootstrap.ts still remains as the uiLayouts baseline bootstrap seam, which is why the task stops before broader preset or reserve-family cleanup.`

#### `task.layout-editor-retirement-and-reference-removal.post-editor-state-residue-review`

##### Control Block

- task_id: `task.layout-editor-retirement-and-reference-removal.post-editor-state-residue-review`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/content/layout-editor-presets.ts`
  - `src/domain/content-pack.ts`
  - `tests/**`
- must_inspect:
  - `src/application/layout-editor/layout-editor-bootstrap.ts`
  - `src/content/layout-editor-presets.ts`
  - `src/domain/content-pack.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
- must_not_change:
  - `already-landed editor retirement slices`
  - `unrelated shared UI framework work`
  - `target closeout truth`
- done_when:
  - `Queue-local truth states whether any remaining uiLayouts or preset or reserve-family residue still forms another lawful same-queue cut or returns to target review.`
  - `Queue snapshot and target truth are synchronized with that decision before any repository sync batch.`
  - `The queue does not silently absorb broader shared UI baseline work without a fresh written boundary.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "uiLayouts|layoutEditor|layout-editor-presets|ui-contract-registry" src/application/layout-editor/layout-editor-bootstrap.ts src/content/layout-editor-presets.ts src/domain/content-pack.ts tests/robustness.test.cjs`
- if_blocked:
  - `Record why the remaining residue cannot be cleanly classified instead of widening the queue without written review.`
  - `Escalate back to target review if the remaining residue no longer belongs to this admitted queue.`
- promote_next_if_done: `none`
- stop_if:
  - `Required queue or target truth is not synchronized.`

##### Human Context

- task_brief:
  - `Reassess the remaining broader layout-baseline residue after dead editor-state cleanup.`
- task_outcome_summary:
  - `Completed after queue-local review concluded that the remaining uiLayouts baseline, preset, and reserve-family residue in src/application/layout-editor/layout-editor-bootstrap.ts, src/content/layout-editor-presets.ts, and src/domain/content-pack.ts is broader target-review work rather than another already-frozen same-queue continuation.`
- Purpose:
  - `Prevent the queue from silently widening after dead editor-state residue is removed.`
- Failure mode:
  - `Do not auto-absorb baseline cleanup or reserve-family work without a fresh boundary decision.`
- Completion notes:
  - `Current source truth shows no remaining layoutEditor state or live editor-only module consumers on the covered production path.`
  - `The surviving residue is now the broader uiLayouts baseline and preset family that still serves non-editor rendering, so this queue must close and return control to target review instead of auto-continuing.`
- Recommendation:
  - `Return to target-level idle-open review with no active queue; if later work is needed, admit it as a fresh broader uiLayouts baseline or preset queue rather than reopening this closed editor-retirement queue without new evidence.`

##### Decision-Dispatch Notes

- `If task_kind=decision-dispatch, this task must summarize current queue progress and provide one concise recommendation.`
- `Default operator output should stay concise and should not dump candidate-set analysis, why-not-the-others detail, or other Blueprint internal reasoning unless the operator explicitly asks for it.`

## Progress Log

- 2026-07-09
  - Summary: `Admitted queue.layout-editor-retirement-and-reference-removal as the single active queue because current source truth still shows the layout editor as a live feature surface across app state, startup bootstrap, render flow, editor modules, presets, styles, docs, and targeted tests.`
  - Verification: `Fresh source inspection across src/main.ts, src/ui/app-render.ts, src/ui/tools/layout-editor-view.ts, src/application/layout-editor/layout-editor-bootstrap.ts, src/application/layout-editor/layout-editor-coordinator.ts, src/content/layout-editor-presets.ts, src/ui/views/character/character-detail-view.ts, tests/robustness.test.cjs, and docs/blueprints/plans/2026-07-06-project-complete-modularization-target-plan.md`
  - Next at this time: `Execute task.layout-editor-retirement-and-reference-removal.baseline-reconcile before queue-local implementation starts.`
- 2026-07-09
  - Summary: `Completed baseline-reconcile by freezing the first lawful implementation slice as live layout-editor surface retirement. Current source truth shows the editor still mounts on the production render path and still wires coordinator input or pointer behavior through src/main.ts, while uiLayouts and preset-backed layout defaults still serve non-editor rendering and therefore remain broader residue for later review.`
  - Verification: `rg -n "createLayoutEditorCoordinator|renderLayoutEditor|open-layout-editor|close-layout-editor|uiLayouts|layoutEditor|layout-editor-presets" src/main.ts src/ui/app-render.ts src/ui/tools/layout-editor-view.ts src/application/layout-editor/layout-editor-bootstrap.ts src/application/layout-editor/layout-editor-coordinator.ts src/content/layout-editor-presets.ts src/ui/views/character/character-detail-view.ts tests/robustness.test.cjs; npm run lint:blueprints`
  - Next at this time: `Execute task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement with a failing test first.`
- 2026-07-09
  - Summary: `Completed live-editor-surface-retirement with source-guard regression coverage and bounded production-path removal. The app shell no longer mounts renderLayoutEditor, main.ts no longer routes covered input through layoutEditorCoordinator, and the character-detail live view no longer emits editor-only binding attributes or resize handles. The remaining queue work is now limited to classifying uiLayouts baseline, layoutEditor state, preset defaults, and reserve-family residue.`
  - Verification: `node --test --test-name-pattern "layout editor live surface retirement" tests/robustness.test.cjs; npm run typecheck; npm test; npm run lint:blueprints; npm run lint:plans`
  - Next at this time: `Execute task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review.`
- 2026-07-09
  - Summary: `Completed layout-baseline-residue-review by proving the queue still contains one smaller same-queue cut: src/ui/main-ui/main-ui-flow.js still mounts renderLayoutEditor on the main-ui overlay, applyLiveLayoutBindings still emits editor-only handle protocol for start-screen and character-select-screen, and layout-editor target registration still marks those screens as live editor targets. The queue therefore remains active on bounded main-ui editor-surface retirement instead of jumping to broader uiLayouts baseline, preset, or reserve-family cleanup.`
  - Verification: `rg -n "renderLayoutEditor|applyLiveLayoutBindings|data-layout-component-handle|data-layout-element-handle|c-main-ui-layout-resize-handle|c-main-ui-layout-element-resize-handle|layoutEditor\.isOpen|uiLayouts|layout-editor-presets|ui-contract-registry" src/ui/main-ui/main-ui-flow.js src/ui/tools/live-layout-bindings.js src/application/layout-editor/layout-editor-target-registry.ts src/application/layout-editor/layout-editor-bootstrap.ts src/content/layout-editor-presets.ts src/domain/content-pack.ts tests/robustness.test.cjs; npm run lint:blueprints`
  - Next at this time: `Execute task.layout-editor-retirement-and-reference-removal.main-ui-live-editor-surface-retirement.`
- 2026-07-09
  - Summary: `Completed main-ui-live-editor-surface-retirement with bounded static-layout preservation. src/ui/main-ui/main-ui-flow.js no longer mounts renderLayoutEditor, main-ui layout application now uses static bindings without editor-only handles or layoutEditor.isOpen gating, and src/application/layout-editor/layout-editor-target-registry.ts no longer keeps start-screen or character-select-screen in the live target set.`
  - Verification: `node --test --test-name-pattern "layout editor main-ui retirement|layout editor live surface retirement" tests/robustness.test.cjs; npm run typecheck; npm test; npm run lint:blueprints`
  - Next at this time: `Execute task.layout-editor-retirement-and-reference-removal.post-main-ui-residue-review.`
- 2026-07-09
  - Summary: `Completed post-main-ui-residue-review by proving no still-live editor surface remains on the covered production path. The remaining same-queue continuation is now dead layoutEditor-state and editor-only module cleanup across src/main.ts, src/application/app-shell.ts, src/application/startup/prototype-startup-app-state.ts, and the layout-editor module family, while broader uiLayouts baseline and preset cleanup still remain out of scope.`
  - Verification: `rg -n "layout-editor-view|layout-editor-coordinator|layout-editor-actions|layout-editor-target-registry|layoutEditor|uiLayouts|layout-editor-presets|ui-contract-registry" src/main.ts src/application/app-shell.ts src/application/startup/prototype-startup-app-state.ts src/application/layout-editor/layout-editor-bootstrap.ts src/application/layout-editor/layout-editor-actions.ts src/application/layout-editor/layout-editor-coordinator.ts src/application/layout-editor/layout-editor-target-registry.ts src/ui/tools/layout-editor-view.ts src/content/layout-editor-presets.ts src/domain/content-pack.ts tests/robustness.test.cjs; npm run lint:blueprints`
  - Next at this time: `Execute task.layout-editor-retirement-and-reference-removal.editor-state-and-dead-module-retirement.`
- 2026-07-09
  - Summary: `Completed editor-state-and-dead-module-retirement by removing the remaining layoutEditor bootstrap and AppState residue, renaming the surviving bootstrap seam to createDefaultUiLayoutAppState, deleting the dead editor-only module family and stylesheet, and keeping the non-editor uiLayouts baseline intact on the covered production path.`
  - Verification: `node --test --test-name-pattern "layout editor state retirement removes dead editor state and module seams|layout editor target registry retirement removes the dead registry module|reclosure ownerization keeps main.ts on the bootstrap seam after layout-editor retirement" tests/robustness.test.cjs; rg -n "layoutEditor|createDefaultLayoutEditorAppState|layout-editor-view|layout-editor-coordinator|layout-editor-actions|layout-editor-target-registry|LayoutEditorState|layout-editor\\.css" src`
  - Next at this time: `Execute task.layout-editor-retirement-and-reference-removal.post-editor-state-residue-review.`
- 2026-07-09
  - Summary: `Completed post-editor-state-residue-review and closed the queue. No remaining layoutEditor state or live editor-only module family survives on the covered production path, while the remaining uiLayouts baseline and preset family now belongs to broader target-level review instead of another already-frozen same-queue slice.`
  - Verification: `node --test --test-name-pattern "layout editor state retirement|layout editor target registry retirement|layout editor main-ui retirement|layout editor live surface retirement|reclosure ownerization keeps main.ts on the bootstrap seam" tests/robustness.test.cjs; npm run typecheck; npm test; npm run lint:blueprints`
  - Next at this time: `Treat queue.layout-editor-retirement-and-reference-removal as closed historical evidence only and return control to target-level idle-open review.`
