# Layout Editor Retirement And Reference Removal Queue

## Control Block

- queue_id: `queue.layout-editor-retirement-and-reference-removal`
- belongs_to_target: `target.project-complete-modularization`
- queue_status: `active`
- queue_class: `conditional`
- active_task: `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement`
- next_task: `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review`
- closeout_status: `in-progress`
- next_effect: `none`
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
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Retire the covered live layout-editor launch or render or input surface so the production path stops exposing editor behavior before broader baseline residue is reconsidered.`
- task_briefs:
  - `task.layout-editor-retirement-and-reference-removal.baseline-reconcile: freeze the first lawful layout-editor retirement slice and confirm this queue remains bounded on current source truth.`
  - `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement: remove the covered live layout-editor launch or render or interaction surface without deleting the broader shared uiLayouts baseline yet.`
  - `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review: reassess whether the remaining uiLayouts or preset or reserve-family residue stays in-queue or returns to target review.`

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
| `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement` | `active` | `Remove the covered live layout-editor launch or render or interaction surface without deleting the broader shared uiLayouts baseline yet.` | `task.layout-editor-retirement-and-reference-removal.baseline-reconcile` | `Current active implementation task.` |
| `task.layout-editor-retirement-and-reference-removal.layout-baseline-residue-review` | `pending` | `Reassess the remaining uiLayouts or preset or reserve-family residue after the live editor surface is retired.` | `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement` | `Decision-dispatch task reserved for queue closeout alignment.` |

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
- state: `active`
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
  - `The expected outcome is that the production path no longer exposes the live layout-editor feature surface, while shared uiLayouts baseline residue remains for later review.`
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
- state: `pending`
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
  - `already-landed live editor-surface retirement slice`
  - `unrelated framework reserve work`
  - `target closeout truth`
- done_when:
  - `Queue-local truth states whether the remaining uiLayouts or preset or reserve-family residue stays as another bounded in-queue slice or returns to target review for later admission.`
  - `Queue snapshot, task counts, and target truth are synchronized with that decision before any repository sync batch.`
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
  - `Reassess whether the remaining layout baseline residue stays in-queue after the live editor surface is retired.`
- task_outcome_summary:
  - `The expected outcome is a written queue-local decision about whether uiLayouts or preset or reserve-family residue is still lawful same-queue work.`
- Purpose:
  - `Keep the queue aligned with current evidence after the first retirement slice lands.`
- Failure mode:
  - `Do not auto-absorb broader shared UI baseline extraction without a fresh queue-local decision.`

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
