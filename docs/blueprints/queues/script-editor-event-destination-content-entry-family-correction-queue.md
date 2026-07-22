# Script Editor Event Destination Content Entry Family Correction Queue

## Control Block

- queue_id: `queue.script-editor-event-destination-content-entry-family-correction`
- belongs_to_version: `target.script-editor-event-binding-post-closeout-fixups`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-17`
- governance_sync_source: `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `open-residue`
- closure_basis: `Queue closed after guard review confirmed destination family is restricted to dialogue/event/minigame, UI targetId remains select-only, target data sources are project.dialogues/events/minigames, stale targetId clearing is preserved, person/city/building remain event relations only, runtime export remains dialogue-only, event/minigame destinations fail closed, EventBindingRuntime semantics were not changed, and EventDefinition trigger/conditions authoring did not return.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-runtime-preview-from-memory`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout truth recorded locally; runtime preview resume, version closeout, commit, push, and merge were not attempted.`
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
  - `Correct event destination authoring so destination means executable content entry rather than related object, navigation target, or UI action.`
- Admission basis:
  - `Design correction clarified event destination should only expose content-entry families in the main path.`
  - `Person, city, and building should remain event related-object authoring or future effect/navigation targets, not destination families.`
  - `Current code still exposes person/city/building/event/dialogue/minigame in the destination family selector and target data sources.`
  - `Runtime export still only supports dialogue destination; event and minigame destinations are authoring/future support and must remain fail-closed.`
- Required scope:
  - `Destination family main path only exposes Chinese labels for 对话, 事件, and 小游戏.`
  - `Remove person/city/building/UI from destination family main path.`
  - `Destination targetId always remains a select.`
  - `Target options come from project.dialogues, project.events, or project.minigames according to family.`
  - `Option labels display title/name plus id and save the record id.`
  - `Family changes clear stale targetId.`
  - `Person/city/building may remain as event related-object authoring, but not as destination.`
  - `Dialogue remains the only runnable export destination.`
  - `Event/minigame destinations remain authoring/future support and display unsupported runtime/export guidance.`
- Forbidden expansions:
  - `Do not implement runtime export support for event or minigame destinations.`
  - `Do not add UI/effect/runtime-action destination support.`
  - `Do not delete related-object authoring for person/city/building.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not restore EventDefinition trigger/conditions authoring ownership.`
  - `Do not resume runtime preview-from-memory implementation in this queue.`
  - `Do not enter version closeout.`
  - `Do not commit, push, or merge.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-POST-CLOSEOUT-DESTINATION-CONTENT-ENTRY-FAMILY-001`
- acceptance_not_claimed:
  - `Runtime preview from memory.`
  - `Runtime support for event/minigame destinations.`
  - `EventBindingRuntime semantic changes.`
  - `Version closeout.`
- minimum_verification:
  - `focused destination selector tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`

### Claim Boundary

#### Can Claim

- `Destination authoring has been corrected to dialogue/event/minigame content-entry families only.`
- `Destination targetId remains select-based for dialogue/event/minigame.`
- `Person/city/building remain available through event related-object authoring rather than destination.`

#### Cannot Claim

- `Runtime preview-from-memory has resumed or implemented.`
- `Event/minigame destination runtime export support.`
- `Version closeout.`

#### Evidence Review Facts

- `src/domain/script-editor-project.ts`:
  - `ScriptEditorEventDestinationFamily` currently includes non-content-entry object families introduced by the prior corrective slice.
- `src/application/script-editor/story-dialogue-event-authoring.ts`:
  - `SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES` currently includes person/city/building/event/dialogue/minigame.
  - Normalization accepts those destination families.
- `src/ui/main-ui/main-ui-flow.js`:
  - `createScriptEditorEventDestinationFamilyOptions()` currently exposes person/city/building/event/dialogue/minigame destination options with Chinese labels.
  - `createScriptEditorEventDestinationTargetOptions(...)` currently sources targets from project.people, project.cities, project.buildings, project.events, project.dialogues, and project.minigames.
  - Destination targetId is currently select-based and must remain select-based.
- `src/application/script-editor/workspace-shell.ts`:
  - Workspace reference validation currently resolves destination references across people/cities/buildings/events/dialogues/minigames.
- `src/application/script-editor/runtime-pack-export.ts`:
  - Runtime export still only lowers dialogue destination to runnable event entrySceneId.
  - Non-dialogue destination remains unsupported/fail-closed and must stay that way in this queue.
- `tests/robustness.test.cjs`:
  - Current destination selector tests assert person/city/building/event/dialogue/minigame labels and data sources; these tests must be revised in implementation.

### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- Must preserve:
  - `Destination target select main path.`
  - `Related-object authoring for person/city/building outside destination.`
  - `Dialogue-only runnable export support.`
  - `Unsupported event/minigame destination fail-closed diagnostics.`
  - `EventBindingRuntime semantics.`
  - `EventDefinition trigger/conditions retirement.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-17-script-editor-event-binding-post-closeout-fixups-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`

### Queue Snapshot

- queue_goal: `Restrict event destination authoring to executable content-entry families: dialogue, event, and minigame.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closeout-and-handoff is complete. Return to version promotion review; runtime preview-from-memory remains the next blocker/candidate.`
- task_briefs:
  - `task.script-editor-event-destination-content-entry-family-correction.evidence-anchor-reconcile: Confirm current over-broad destination family path and lock the content-entry correction boundary.`
  - `task.script-editor-event-destination-content-entry-family-correction.implementation: Correct destination family schema/UI/tests to dialogue/event/minigame only while preserving select targets and fail-closed runtime export.`
  - `task.script-editor-event-destination-content-entry-family-correction.queue-closeout-and-handoff: Verify the corrective slice and return to runtime preview queue review without automatic version closeout.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-destination-content-entry-family-correction.evidence-anchor-reconcile` | `done` | `Confirmed current over-broad destination family path and locked the content-entry correction boundary.` | `none` | `Completed during admission on 2026-07-17; no implementation code changed.` |
| `task.script-editor-event-destination-content-entry-family-correction.implementation` | `done` | `Corrected destination family schema/UI/tests to dialogue/event/minigame only while preserving select targets and fail-closed runtime export.` | `task.script-editor-event-destination-content-entry-family-correction.evidence-anchor-reconcile` | `Completed on 2026-07-17; queue closeout, runtime preview resume, and version closeout were not entered.` |
| `task.script-editor-event-destination-content-entry-family-correction.queue-closeout-and-handoff` | `done` | `Verified the corrective slice and returned to version review without automatic version closeout.` | `task.script-editor-event-destination-content-entry-family-correction.implementation` | `Completed on 2026-07-17; runtime preview implementation was not restored to active execution.` |

### Task Definitions

#### `task.script-editor-event-destination-content-entry-family-correction.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-destination-content-entry-family-correction.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `destination family schema`
  - `destination selector UI`
  - `destination target data sources`
  - `workspace reference validation`
  - `runtime export support boundary`
- must_not_change:
  - `runtime preview implementation`
  - `EventBindingRuntime semantics`
  - `version closeout`
- done_when:
  - `The content-entry destination family boundary is recorded.`
  - `Person/city/building are classified as related-object or future effect/navigation, not destination.`
  - `Implementation task is activated.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-event-destination-content-entry-family-correction.implementation`

##### Human Context

- task_brief:
  - `Confirm current over-broad destination family path and lock the content-entry correction boundary.`
- task_outcome_summary:
  - `Done. Evidence confirmed current destination authoring still exposes person/city/building alongside event/dialogue/minigame, while runtime export only supports dialogue. The correction is bounded to content-entry destination authoring and does not expand runtime semantics.`

#### `task.script-editor-event-destination-content-entry-family-correction.implementation`

##### Control Block

- task_id: `task.script-editor-event-destination-content-entry-family-correction.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_replace:
  - `person/city/building destination family main path`
  - `person/city/building destination target data source main path`
- must_preserve:
  - `dialogue/event/minigame destination authoring`
  - `destination target select main path`
  - `stale targetId clearing on family change`
  - `person/city/building related-object authoring outside destination`
  - `dialogue-only runtime export support`
  - `unsupported event/minigame fail-closed behavior`
- verify_with:
  - `focused destination selector tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`

##### Human Context

- task_brief:
  - `Correct destination family schema/UI/tests to dialogue/event/minigame only while preserving select targets and fail-closed runtime export.`
- task_outcome_summary:
  - `Done. RED tests failed because destination family options still exposed 人物/城市/建筑 and the destination helper still accepted city. GREEN implementation narrowed ScriptEditorEventDestinationFamily and SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES to dialogue/event/minigame, removed person/city/building destination target sources from the UI, kept targetId select-based, preserved event relations for 关联人物/关联城市/关联建筑, and kept runtime export dialogue-only with event/minigame fail-closed. Verification passed: focused destination tests, npm run typecheck, npm run lint:blueprints, and npm test (612/612).`

#### `task.script-editor-event-destination-content-entry-family-correction.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-destination-content-entry-family-correction.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-event-destination-content-entry-family-correction-queue.md`
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_not_change:
  - `runtime preview implementation`
  - `version closeout`
- done_when:
  - `Queue closeout records the correction.`
  - `Runtime preview-from-memory remains paused or is routed by explicit follow-up instruction.`
  - `Blueprint lint passes.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the corrective slice and return to runtime preview queue review without automatic version closeout.`
- task_outcome_summary:
  - `Done. Guard review confirmed ScriptEditorEventDestinationFamily only includes dialogue/event/minigame, UI destination labels only expose 对话/事件/小游戏, targetId is select-only with project.dialogues/events/minigames sources, stale target clearing remains in the helper, event relations still expose 关联人物/关联城市/关联建筑, runtime export remains dialogue-only, event/minigame destinations fail closed, EventBindingRuntime semantics were unchanged, and EventDefinition trigger/conditions authoring did not return. npm run lint:blueprints passed.`

### Progress Log

- `2026-07-17`: `Admitted this corrective queue after design correction clarified event destination should represent executable content entry only. Evidence review confirmed current destination authoring still includes person/city/building/event/dialogue/minigame in schema/UI/tests, target selectors read project.people/cities/buildings/events/dialogues/minigames, and runtime export still only supports dialogue. Runtime preview-from-memory implementation is paused before code changes until this queue closes or is explicitly dispositioned.`
- `2026-07-17`: `Completed implementation without queue closeout. RED focused tests failed on person/city/building still appearing in destination family options and city still being accepted by updateScriptEditorEventDestinationField. GREEN implementation narrowed event destination schema and UI to dialogue/event/minigame, kept targetId select-only with project.dialogues/events/minigames sources, preserved related-object relations for person/city/building, and kept runtime export dialogue-only while event/minigame remain fail-closed. Verification passed: focused destination tests, npm run typecheck, npm run lint:blueprints, and npm test (612/612).`
- `2026-07-17`: `Closed this queue after guard review and Blueprint handoff. Guard review confirmed the destination content-entry family boundary, select-only target authoring, relation preservation, dialogue-only export support, event/minigame fail-closed behavior, unchanged EventBindingRuntime semantics, and no EventDefinition trigger/conditions ownership regression. Runtime preview-from-memory remains the next blocker/candidate but was not restored to active execution. npm run lint:blueprints passed.`
