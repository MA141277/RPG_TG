# Script Editor Dialogue Story Structure Convergence Queue

## Control Block

- queue_id: `queue.script-editor-dialogue-story-structure-convergence`
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
- closure_basis: `The bounded dialogue/story structure slice landed with verification: editor narrative records now materialize through a shared runtime seam that produces SceneDefinition[] and textEntries maps, and runtime-pack export consumes that seam rather than owning private lowering logic. Richer branching choices, dialogue followUps, story-node relation lowering, import reconstruction from runtime scenes, and full runtime handoff/progression remain outside this slice and are routed back to version review.`
- residue_remaining: `yes`
- residue_family: `cross-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Queue admitted locally; repository sync is pending after baseline or terminal queue state.`
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
  - `Converge dialogue/story authoring records into runtime-consumable structures so editor-authored narrative content no longer depends on private export-only lowering, empty scenes placeholders, or manual compatibility residue.`
- Forbidden expansions:
  - `Do not implement broad dialogue/story progression runtime handoff until the structure baseline proves the first lawful slice.`
  - `Do not fold scenario launch policy, event/effect activation, playable/minigame bindings, or branching task-chain behavior into this queue by convenience.`
  - `Do not solve narrative export through compatibility-only adapters as the final model.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-city-building-placement-resolver-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Determine and implement the smallest dialogue/story structure convergence slice that turns editor-authored dialogue/story records into validated runtime-consumable narrative data without widening into full progression handoff.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after the shared materializer seam landed; runtime handoff/progression, branching/followUps, and import reconstruction residue returned to version review.`
- task_briefs:
  - `task.script-editor-dialogue-story-structure-convergence.boundary-baseline-reconcile: inventory dialogue/story authoring and runtime consumption seams, decide the smallest lawful structure slice, and record test-first implementation boundaries.`
  - `task.script-editor-dialogue-story-structure-convergence.structure-contract-implementation: implement the selected dialogue/story structure convergence slice with tests.`
  - `task.script-editor-dialogue-story-structure-convergence.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

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

- `queue.script-editor-city-building-placement-resolver-convergence closed after landing the bounded resolver API and routing dialogue inheritance plus broader consumer migration back to version review.`
- `The target spec marks dialogue records, dialogue nodes, story nodes, participant/text references, and runtime dialogue/story consumption as required authoring/data-structure convergence work.`
- `Prior runtime-pack export unification evidence showed dialogues/storyNodes could not remain authoring-only while export writes empty scenes placeholders or fails on unresolved narrative records.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-dialogue-story-structure-convergence.boundary-baseline-reconcile` | `done` | `Inventoried dialogue/story authoring, export lowering, import behavior, and runtime scene/text-entry consumption; selected a shared materializer seam as the smallest implementation slice.` | `none` | `Production code was not changed during baseline.` |
| `task.script-editor-dialogue-story-structure-convergence.structure-contract-implementation` | `done` | `Implemented the shared dialogue/story runtime materializer seam and rewired exporter consumption.` | `task.script-editor-dialogue-story-structure-convergence.boundary-baseline-reconcile` | `Landed with TDD coverage and verification.` |
| `task.script-editor-dialogue-story-structure-convergence.queue-closeout-and-handoff` | `done` | `Verified the materializer slice, classified remaining runtime handoff/progression and richer narrative behavior as cross-family residue, and returned control to version review.` | `task.script-editor-dialogue-story-structure-convergence.structure-contract-implementation` | `Closeout complete; repository sync remains tracked by sync_status only.` |

### Task Definitions

#### `task.script-editor-dialogue-story-structure-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-dialogue-story-structure-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/scene.ts`
  - `src/domain/text-entry.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/scene-session.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-dialogue-story-structure-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md`
  - `docs/blueprints/queues/script-editor-runtime-pack-export-unification-queue.md`
  - `docs/blueprints/queues/script-editor-narrative-authoring-export-convergence-queue.md`
  - `docs/blueprints/queues/script-editor-city-building-placement-resolver-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/scene.ts`
  - `src/domain/text-entry.ts`
  - `src/core/runtime/scene-runtime.ts`
  - `src/core/runtime/scene-session.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `scenario launch policy`
  - `event/effect activation beyond required narrative structure references`
  - `playable/minigame bindings`
  - `full dialogue/story progression runtime handoff`
- done_when:
  - `Current dialogue/story authoring records, import/export behavior, runtime scenes/textEntries, and scene runtime consumption are inventoried.`
  - `The exact mismatch between authoring dialogue/story records and runtime-consumable narrative structures is recorded.`
  - `The smallest lawful dialogue/story structure implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, schema rules, import/export behavior, runtime consumer boundary, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "dialogues|storyNodes|scenes|textEntries|SceneDefinition|TextEntryDefinition|story-dialogue-event|runtime-pack-export|runtime-pack-import|scene-runtime|scene-session" docs/blueprints src/domain src/application/script-editor src/core/runtime tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if launch policy, condition runtime, or event structure must precede the selected structure slice.`
- promote_next_if_done: `task.script-editor-dialogue-story-structure-convergence.structure-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot own the first dialogue/story structure slice without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest honest dialogue/story structure boundary before changing production code.`
- task_outcome_summary:
  - `Done. Existing authoring records already define dialogue nodes, story nodes, participants, followUps, and text entries; runtime consumes SceneDefinition actions and textEntriesById; exporter currently contains private lowerMinimalNarrativeScenes/mapTextEntries logic that can lower only simple dialogue/narration nodes and fail closed on story-node relations, choices, and followUps; runtime-pack import preserves runtime scenes and textEntries but reconstructs no editor dialogues/storyNodes. The smallest lawful structure slice is to extract a shared dialogue/story runtime materializer seam that validates editor narrative records and produces runtime SceneDefinition[] plus textEntries map for export/runtime preview, without implementing branching, full story progression, scenario launch policy, or runtime handoff.`
- Purpose:
  - `Prevent editor-authored narrative data from staying authoring-only while runtime consumers depend on scenes and textEntries.`
- Failure mode:
  - `A later export/runtime handoff queue would have no stable narrative structure to consume, forcing another compatibility-only lowering patch.`

##### Progress Log

- `2026-07-15`: `Queue admitted from version promotion review after placement resolver closeout routed dialogue inheritance and broader resolver consumer migration back to version review.`
- `2026-07-15`: `Baseline inspected current authoring types/helpers, runtime-pack export/import, prior export-unification and narrative lowering queues, runtime SceneDefinition/textEntries consumption, and robustness coverage.`
- `2026-07-15`: `Inventory: editor dialogue records own title, storyNodeId, participantPersonIds, nodes, and followUps; story nodes own chapter/summary/progress mode and related ids; textEntries own id/text; runtime scene consumption uses SceneDefinition actions plus textEntriesById from domain/action.ts and scene runtime seams.`
- `2026-07-15`: `Mismatch: dialogue/story authoring is still not a reusable runtime-consumable structure seam; exporter-private lowering assembles scenes/textEntries directly, import preserves runtime scenes/textEntries but loses editor dialogue/story structures, and richer choices/followUps/story-node relations remain fail-closed.`
- `2026-07-15`: `Selected smallest lawful slice: add a shared script-editor dialogue/story runtime materializer module that owns text-entry mapping and minimal dialogue-to-SceneDefinition materialization, reuse it from runtime-pack export, and cover missing text, duplicate ids, missing storyNodeId, choices, followUps, and scene id collisions in tests. Do not implement full progression runtime handoff, scenario launch policy, or branching task-chain behavior.`

#### `task.script-editor-dialogue-story-structure-convergence.structure-contract-implementation`

##### Control Block

- task_id: `task.script-editor-dialogue-story-structure-convergence.structure-contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `tests/robustness.test.cjs`
  - `tsconfig.test.json`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/domain/script-editor-project.ts`
  - `src/domain/action.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `scenario launch policy`
  - `playable/minigame bindings`
  - `unbounded dialogue/story progression runtime handoff`
- done_when:
  - `The selected dialogue/story structure convergence slice is implemented.`
  - `Tests cover the selected import/export/runtime structure behavior and fail-closed diagnostics for unsupported or missing references.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into unrelated runtime handoff work.`
- promote_next_if_done: `task.script-editor-dialogue-story-structure-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires another prerequisite queue to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected dialogue/story structure convergence slice.`
- task_outcome_summary:
  - `Done. Added src/application/script-editor/dialogue-story-runtime-materializer.ts as the shared materializer seam for editor dialogue/story runtime structure assembly, moved minimal dialogue/text-entry validation and SceneDefinition assembly out of runtime-pack-export.ts, and kept exporter behavior equivalent for the covered simple dialogue/narration slice. Tests cover the public materializer seam and existing startup-loadable narrative export behavior.`
- Purpose:
  - `Make covered editor-authored narrative data runtime-consumable through governed structures.`
- Failure mode:
  - `The queue lands only an export patch while leaving dialogue/story structure ownership unresolved.`

##### Progress Log

- `2026-07-15`: `Activated after baseline selected the shared dialogue/story runtime materializer seam as the smallest lawful structure slice.`
- `2026-07-15`: `Added a failing robustness test for materializeScriptEditorDialogueStoryRuntime, implemented the materializer module, rewired runtime-pack-export.ts to consume it, and removed the exporter-private minimal narrative lowering helpers.`
- `2026-07-15`: `Verification passed: target RED failed on missing module, target GREEN passed after implementation, npm run typecheck, npm test, npm run build, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check. Build emitted only existing Vite resource/chunk warnings; git diff --check emitted only line-ending warnings.`

#### `task.script-editor-dialogue-story-structure-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-dialogue-story-structure-convergence.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-dialogue-story-structure-convergence-queue.md`
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
  - `Dialogue/story structure acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the dialogue/story structure convergence queue after verified implementation.`
- task_outcome_summary:
  - `Done. Implementation verification passed; richer branching choices, dialogue followUps, story-node relation lowering, import reconstruction from runtime scenes, and full dialogue/story runtime handoff/progression were classified as cross-family residue and returned to version review, with queue.script-editor-dialogue-story-runtime-handoff-convergence recommended next.`
- Purpose:
  - `Keep dialogue/story structure convergence explicit before runtime handoff or branching/task-chain queues continue.`
- Failure mode:
  - `Closing without structure evidence would leave narrative runtime behavior dependent on export-only lowering or legacy scenes.`

##### Progress Log

- `2026-07-15`: `Activated after structure-contract-implementation passed verification.`
- `2026-07-15`: `Closeout recorded that the bounded materializer seam landed and verified, while full runtime handoff/progression, branching choices, followUps, story-node relation lowering, and runtime-scene import reconstruction remain outside this queue and must be routed by version review.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-city-building-placement-resolver-convergence.queue-closeout-and-handoff`
- Recorded handoff at activation:
  - `Placement resolver convergence closed after landing a shared resolver API; dialogue inheritance, richer placement schema, and broader consumer migration require later version routing.`
- Recorded expected output:
  - `A bounded dialogue/story structure implementation path or an explicit prerequisite routing decision.`
