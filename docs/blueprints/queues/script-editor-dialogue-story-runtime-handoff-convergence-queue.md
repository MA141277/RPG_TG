# Script Editor Dialogue Story Runtime Handoff Convergence Queue

## Control Block

- queue_id: `queue.script-editor-dialogue-story-runtime-handoff-convergence`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `The bounded runtime handoff slice landed with verification: exported editor dialogue events now have acceptance coverage from event destination lowering through materialized runtime scenes and runStoryTriggerRuntime, and SceneRuntimeSession receipts expose both sceneId and eventId for the active handoff. Story-progress/dialogue-finished triggers, branching choices, followUps, story-node relation lowering, runtime-scene import reconstruction, and broader event/task progression remain outside this slice and are routed back to version review.`
- residue_remaining: `yes`
- residue_family: `cross-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `Commits through 0bf52b9 pushed to origin/mod-first-dev after dialogue/story runtime handoff queue closeout.`
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
  - `Converge the first dialogue/story runtime handoff slice so editor-authored narrative structures can start and progress through existing runtime scene/event seams without remaining export-only structures.`
- Forbidden expansions:
  - `Do not implement broad branching task-chain behavior before baseline proves the first runtime handoff slice.`
  - `Do not fold scenario launch policy, playable/minigame bindings, or broad event/effect activation into this queue by convenience.`
  - `Do not reintroduce compatibility-only narrative adapters as the final runtime model.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-dialogue-story-structure-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Determine and implement the smallest dialogue/story runtime handoff slice after the shared materializer seam exists, without widening into full branching/task-chain behavior.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after verified event-to-dialogue-scene runtime handoff coverage; richer progression, branching, followUps, story-node relation lowering, and import reconstruction residue returned to version review.`
- task_briefs:
  - `task.script-editor-dialogue-story-runtime-handoff-convergence.boundary-baseline-reconcile: inventory runtime handoff seams and select the smallest lawful dialogue/story runtime handoff implementation slice.`
  - `task.script-editor-dialogue-story-runtime-handoff-convergence.runtime-handoff-implementation: implement the selected runtime handoff slice with tests.`
  - `task.script-editor-dialogue-story-runtime-handoff-convergence.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

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

- `queue.script-editor-dialogue-story-structure-convergence closed after landing a shared materializer seam for minimal editor narrative runtime scenes/textEntries.`
- `The target spec marks dialogue node runtime handoff, story progression state, branch entry/exit semantics, and runtime materialization as required after dialogue/story structure convergence.`
- `Single-active-queue mode remains in force; no second queue may be promoted while this queue is active.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-dialogue-story-runtime-handoff-convergence.boundary-baseline-reconcile` | `done` | `Inventoried materializer, export, event runtime, scene runtime, and scene runner seams; selected the first event-to-dialogue-scene runtime handoff slice.` | `none` | `No production code changed during baseline.` |
| `task.script-editor-dialogue-story-runtime-handoff-convergence.runtime-handoff-implementation` | `done` | `Implemented the selected dialogue/story runtime handoff slice with tests.` | `task.script-editor-dialogue-story-runtime-handoff-convergence.boundary-baseline-reconcile` | `Scene runtime sessions now expose eventId, and coverage proves editor event -> dialogue destination -> materialized scene -> runStoryTriggerRuntime handoff.` |
| `task.script-editor-dialogue-story-runtime-handoff-convergence.queue-closeout-and-handoff` | `done` | `Verified, classified residue, and returned control to version review.` | `task.script-editor-dialogue-story-runtime-handoff-convergence.runtime-handoff-implementation` | `Closeout complete; repository sync remains tracked by sync_status only.` |

### Task Definitions

#### `task.script-editor-dialogue-story-runtime-handoff-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-dialogue-story-runtime-handoff-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/application/scene/scene-runner.ts`
  - `src/domain/action.ts`
  - `src/domain/event.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-dialogue-story-runtime-handoff-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md`
  - `docs/blueprints/queues/script-editor-dialogue-story-structure-convergence-queue.md`
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/application/scene/scene-runner.ts`
  - `src/domain/action.ts`
  - `src/domain/event.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `broad branching task-chain behavior`
  - `unrelated event/effect activation`
- done_when:
  - `Current materializer output, runtime scene/event handoff, scene runner behavior, and editor-exported event/dialogue destination behavior are inventoried.`
  - `The exact mismatch between materialized narrative structures and runtime handoff/progression ownership is recorded.`
  - `The smallest lawful runtime handoff implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, runtime handoff behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "materializeScriptEditorDialogueStoryRuntime|runSceneFromEvent|runStoryTriggerRuntime|runStoryEventRuntime|sceneDefinitionsById|EventDefinition|destination|dialogue|story-progress|dialogue-finished" src/application src/core src/domain tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if scenario launch policy, event structure, or condition runtime must precede the selected handoff slice.`
- promote_next_if_done: `task.script-editor-dialogue-story-runtime-handoff-convergence.runtime-handoff-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the first dialogue/story runtime handoff slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest dialogue/story runtime handoff boundary after the shared materializer seam exists.`
- task_outcome_summary:
  - `Done. Baseline selected event-to-dialogue-scene runtime handoff coverage as the smallest lawful slice; story-progress state, choices, followUps, and story-node relation progression remain outside this first task.`
- Purpose:
  - `Prevent editor-authored narrative structures from stopping at export materialization without a governed runtime handoff path.`
- Failure mode:
  - `Runtime handoff work expands into scenario launch policy or branching task-chain behavior before the first dialogue/story runtime seam is proven.`

##### Progress Log

- `2026-07-15`: `Queue admitted from version promotion review after dialogue/story structure convergence closed and routed runtime handoff/progression residue back to version review.`
- `2026-07-15`: `Baseline inventory found that materializeScriptEditorDialogueStoryRuntime emits runtime SceneDefinition actions/textEntries for minimal dialogue records, runtime-pack export lowers only editor events whose destination targets a dialogue into EventDefinition.entrySceneId, runStoryTriggerRuntime delegates trigger selection to runStoryEventRuntime and then starts scenes through runSceneFromEvent, and scene-runner pauses/advances runtime narration/dialogue/choice actions through sceneDefinitionsById and textEntries.`
- `2026-07-15`: `Mismatch recorded: exported editor narrative can produce scenes and dialogue-targeted events, but there is no focused acceptance coverage proving that an editor-authored event targeting a materialized dialogue scene actually enters the runtime scene handoff path; richer story-progress/dialogue-finished timings, choices, followUps, story-node relations, and import reconstruction remain unsupported or later-slice behavior.`
- `2026-07-15`: `Selected implementation slice: add test-first coverage for editor event -> dialogue destination -> materialized scene -> runStoryTriggerRuntime/runSceneFromEvent handoff, including fail-closed diagnostics for unsupported trigger/progression shapes if fresh implementation evidence requires it; do not change scenario launch policy, playable/minigame bindings, broad branching task chains, or unrelated event/effect activation.`

#### `task.script-editor-dialogue-story-runtime-handoff-convergence.runtime-handoff-implementation`

##### Control Block

- task_id: `task.script-editor-dialogue-story-runtime-handoff-convergence.runtime-handoff-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/event-runtime.ts`
  - `src/application/scene/scene-runner.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `Boundary baseline evidence from task.script-editor-dialogue-story-runtime-handoff-convergence.boundary-baseline-reconcile.`
  - `src/application/script-editor/runtime-pack-export.ts event destination lowering.`
  - `src/core/runtime/scene-runtime.ts runStoryTriggerRuntime/runSceneFromEvent.`
  - `tests/robustness.test.cjs existing script-editor event export and runtime trigger tests.`
- must_not_change:
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded branching task-chain behavior`
- done_when:
  - `The selected event-to-dialogue-scene runtime handoff slice is implemented or proven already implemented by a failing-first test that passes only after the governed seam is exercised.`
  - `Tests cover editor-authored event export, materialized dialogue scene presence, runtime trigger selection, runStoryTriggerRuntime scene activation, and scene-runner dialogue pause over exported text entries.`
  - `Unsupported richer progression shapes remain fail-closed or explicitly routed as residue rather than silently treated as supported.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into unrelated launch policy or branching work.`
- promote_next_if_done: `task.script-editor-dialogue-story-runtime-handoff-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires another prerequisite queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected dialogue/story runtime handoff slice.`
- task_outcome_summary:
  - `Done. Added acceptance coverage for an editor-authored dialogue event exported into events/scenes/text-entries and run through runStoryTriggerRuntime, and extended SceneRuntimeSession with eventId so the runtime handoff receipt identifies both event and scene.`
- Purpose:
  - `Make covered editor-authored narrative structures progress through runtime-owned seams.`
- Failure mode:
  - `The queue lands another export-only patch while runtime progression ownership remains unresolved.`

##### Progress Log

- `2026-07-15`: `RED verification failed as expected because SceneRuntimeSession did not expose the active event id for an exported editor dialogue event handoff.`
- `2026-07-15`: `Implemented the minimal runtime contract extension by adding eventId to SceneRuntimeSession and createSceneSession; no event selection, scenario launch policy, playable/minigame binding, or branching/story-progress behavior changed.`
- `2026-07-15`: `Verification passed: targeted runtime handoff test, npm run typecheck, npm test, npm run build, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check. Build retains existing Vite script/module, unresolved ui panel asset, and chunk-size warnings.`

#### `task.script-editor-dialogue-story-runtime-handoff-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-dialogue-story-runtime-handoff-convergence.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-dialogue-story-runtime-handoff-convergence-queue.md`
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
  - `Runtime handoff acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the dialogue/story runtime handoff convergence queue after verified implementation.`
- task_outcome_summary:
  - `Done. Verified implementation passed; remaining story-progress, dialogue-finished, branching choices, followUps, story-node relation lowering, runtime-scene import reconstruction, and broader event/task progression were classified as cross-family residue and returned to version review.`
- Purpose:
  - `Keep runtime handoff convergence explicit before scenario launch, branching/task-chain, or final validation queues continue.`
- Failure mode:
  - `Closing without handoff evidence would leave narrative runtime progression dependent on indirect event/scene behavior.`

##### Progress Log

- `2026-07-15`: `Activated after runtime-handoff-implementation passed verification.`
- `2026-07-15`: `Closeout recorded that the bounded event-to-dialogue-scene runtime handoff slice landed and verified, while story-progress/dialogue-finished trigger lowering, branching choices, followUps, story-node relation lowering, runtime-scene import reconstruction, and broader event/task progression remain outside this queue and must be routed by version review.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-dialogue-story-structure-convergence.queue-closeout-and-handoff`
- Recorded handoff at activation:
  - `Dialogue/story structure convergence closed after landing the shared materializer seam; runtime handoff/progression, branching choices, followUps, story-node relation lowering, and runtime-scene import reconstruction remained outside that slice.`
- Recorded expected output:
  - `A bounded dialogue/story runtime handoff implementation path or an explicit prerequisite routing decision.`
