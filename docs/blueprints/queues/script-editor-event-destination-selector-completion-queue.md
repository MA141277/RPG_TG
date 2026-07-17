# Script Editor Event Destination Selector Completion Queue

## Control Block

- queue_id: `queue.script-editor-event-destination-selector-completion`
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
- closure_basis: `Queue closed after guard review confirmed destination family no longer exposes raw English enum choices, destination targetId is project.dialogues-backed select rather than text input, dialogue options show title plus id and save dialogue.id, unsupported non-dialogue destinations remain legacy/import unsupported residue, runtime export stays dialogue-only fail-closed, EventBindingRuntime semantics were unchanged, and EventDefinition trigger/conditions ownership did not regress.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `queue.script-editor-runtime-preview-from-memory`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `success`
- sync_scope: `local-record`
- sync_summary: `Queue closeout truth recorded locally; commit, push, merge, runtime preview admission, and version closeout were not attempted.`
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
  - `Complete event destination authoring so the event page exposes only the currently runnable-supported dialogue destination main path, with Chinese labels and project.dialogues-backed target selection.`
- Admission basis:
  - `Post-closeout browser validation found the event destination page still shows raw English destination family enum values.`
  - `Post-closeout browser validation found destination targetId is still a free-text input.`
  - `runtime-pack export currently supports only editor events whose destination targets a dialogue.`
  - `A reliable dialogue destination selector is a prerequisite for browser/runtime preview validation to configure a runnable event target.`
- Required scope:
  - `Event page destination family main path uses Chinese labels.`
  - `Main path exposes only the currently runnable-supported dialogue destination, shown as 对话.`
  - `Destination targetId becomes a select/search selector backed by project.dialogues.`
  - `Destination target option label displays 对话标题 (dialogueId).`
  - `The saved value remains dialogue.id in eventRecord.destination.targetId.`
  - `Non-dialogue destination families must not be presented as runnable main-path support.`
- Forbidden expansions:
  - `Do not implement runtime support for event/city/building/minigame destinations.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not change EventBinding trigger/condition authoring.`
  - `Do not start runtime preview-from-memory implementation in this queue.`
  - `Do not reopen target.script-editor-event-binding-runtime-replacement.`
  - `Do not enter version closeout.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-POST-CLOSEOUT-DESTINATION-SELECTOR-001`
- acceptance_not_claimed:
  - `Runtime preview from memory.`
  - `Runtime support for non-dialogue destinations.`
  - `EventBindingRuntime semantic changes.`
- minimum_verification:
  - `focused destination selector tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
  - `browser check of event destination tab before queue closeout if dev server validation is available`

### Claim Boundary

#### Can Claim

- `ACC-POST-CLOSEOUT-DESTINATION-SELECTOR-001: Event destination authoring exposes dialogue as the only runnable-supported main destination family, displays Chinese labels, uses project.dialogues-backed target selection, and saves dialogue.id as destination.targetId.`

#### Cannot Claim

- `Runtime preview starts from current in-memory editor data.`
- `Non-dialogue destination runtime export or runtime support.`
- `EventBindingRuntime trigger or handoff semantics.`
- `Version closeout.`

#### Legacy Paths To Replace

- `Raw English event destination family enum labels in the event destination tab.`
- `Free-text destination targetId main authoring field.`
- `UI presentation that makes event/city/building/minigame destinations look runnable when export only supports dialogue.`

#### Compatibility Paths To Preserve

- `Existing event destination storage shape: destination.family plus destination.targetId.`
- `Runtime-pack export dialogue-only support and fail-closed diagnostics for unsupported destinations.`
- `EventBinding/event-bindings.json ownership and EventDefinition trigger/condition retirement from the predecessor version.`

#### Implementation Anchors

- Must inspect:
  - `docs/script-editor-event-trigger-binding-design.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- Must modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `src/application/script-editor/story-dialogue-event-authoring.ts` if normalization/update needs to force the supported dialogue main path safely
- Must preserve:
  - `Dialogue-only runtime export lowering to entrySceneId.`
  - `Fail-closed unsupported destination diagnostics.`
  - `EventBindingRuntime semantics.`
  - `Closed predecessor version status.`

#### Verification Coverage

- `Focused tests must prove destination family authoring is Chinese-labeled and does not expose unsupported runnable families as the main path.`
- `Focused tests must prove destination targetId is selected from project.dialogues and not typed as the primary path.`
- `Export tests must preserve dialogue destination lowering and unsupported destination fail-closed behavior.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-17-script-editor-event-binding-post-closeout-fixups-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`

### Queue Snapshot

- queue_goal: `Complete event destination selector authoring for the supported dialogue runtime path before runtime preview-from-memory work begins.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closeout-and-handoff is complete. Return to version promotion review; runtime preview-from-memory remains unadmitted.`
- task_briefs:
  - `task.script-editor-event-destination-selector-completion.evidence-anchor-reconcile: Confirm the destination UI/export gap and lock the narrow queue boundary.`
  - `task.script-editor-event-destination-selector-completion.implementation: Implement the destination family/target selector test-first without expanding runtime destination support.`
  - `task.script-editor-event-destination-selector-completion.queue-closeout-and-handoff: Verify the selector slice and return to version review without admitting runtime preview.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-destination-selector-completion.evidence-anchor-reconcile` | `done` | `Confirmed event destination UI still exposes raw family enum labels plus free-text targetId while export supports only dialogue destinations, and locked this queue to selector completion only.` | `none` | `Completed on 2026-07-17; no implementation code was changed.` |
| `task.script-editor-event-destination-selector-completion.implementation` | `done` | `Implemented destination family and target selectors test-first without expanding runtime destination support.` | `task.script-editor-event-destination-selector-completion.evidence-anchor-reconcile` | `Completed on 2026-07-17; queue closeout, runtime preview admission, and version closeout were not entered.` |
| `task.script-editor-event-destination-selector-completion.queue-closeout-and-handoff` | `done` | `Verified selector completion and returned to version review without admitting runtime preview or entering version closeout.` | `task.script-editor-event-destination-selector-completion.implementation` | `Completed on 2026-07-17; runtime preview-from-memory remains an unadmitted candidate.` |

### Task Definitions

#### `task.script-editor-event-destination-selector-completion.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-destination-selector-completion.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/script-editor-event-trigger-binding-design.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `event destination tab rendering`
  - `destination update handler`
  - `runtime-pack export destination support`
  - `post-closeout browser validation findings`
- must_not_change:
  - `implementation code before admission completes`
  - `EventBindingRuntime semantics`
  - `predecessor version_status`
- done_when:
  - `Evidence Lock is locked.`
  - `Implementation boundary is recorded.`
  - `Runtime preview-from-memory is recorded only as a later candidate.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review and record the blocker.`
- promote_next_if_done: `task.script-editor-event-destination-selector-completion.implementation`
- stop_if:
  - `Evidence shows runtime export already supports non-dialogue destinations and the queue must be split or rescoped.`

##### Human Context

- task_brief:
  - `Confirm the destination UI/export gap and lock the narrow queue boundary.`
- task_outcome_summary:
  - `Done. Evidence found raw English destination family labels and free-text targetId in the event destination tab while runtime export supports only dialogue destinations.`
- Purpose:
  - `Prevent post-closeout validation from depending on hand-written target ids or unsupported destination families.`
- Failure mode:
  - `Expanding runtime destination semantics or starting runtime preview work before the selector path is fixed.`

#### `task.script-editor-event-destination-selector-completion.implementation`

##### Control Block

- task_id: `task.script-editor-event-destination-selector-completion.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `event destination tab`
  - `project.dialogues data shape`
  - `destination update handler`
  - `dialogue-only export lowering`
- must_modify:
  - `tests/robustness.test.cjs`
  - `src/ui/main-ui/main-ui-flow.js`
- must_replace:
  - `raw English destination family labels`
  - `free-text destination targetId main path`
- must_preserve:
  - `destination.family/destination.targetId storage shape`
  - `dialogue-only export support`
  - `unsupported destination fail-closed diagnostics`
  - `EventBindingRuntime semantics`
- must_not_change:
  - `runtime preview startup behavior`
  - `EventBinding trigger/condition authoring`
  - `predecessor version_status`
- done_when:
  - `Event destination family main path displays Chinese dialogue support and does not expose unsupported runnable families.`
  - `Destination targetId main path is a project.dialogues-backed selector showing dialogue title plus id.`
  - `Changing destination target saves dialogue.id.`
  - `Unsupported destination export remains fail closed.`
- verify_with:
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and do not widen scope to runtime preview or non-dialogue destination support.`
- promote_next_if_done: `task.script-editor-event-destination-selector-completion.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement the destination family/target selector test-first without expanding runtime destination support.`
- task_outcome_summary:
  - `Done. RED tests captured raw English destination family options and text targetId. GREEN implementation now exposes only the Chinese dialogue destination main path, renders targetId as a project.dialogues-backed select showing title plus id, saves dialogue.id, preserves dialogue-only export lowering, and keeps unsupported non-dialogue destinations fail closed. Verification passed: focused destination tests, npm run typecheck, npm run lint:blueprints, and npm test (611/611).`
- Purpose:
  - `Make the event page's destination configuration match the currently runnable export support.`
- Failure mode:
  - `Leaving unsupported destination families looking runnable or keeping a hand-written target id path as the main UI.`

#### `task.script-editor-event-destination-selector-completion.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-destination-selector-completion.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-event-destination-selector-completion-queue.md`
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_inspect:
  - `destination selector implementation evidence`
  - `export fail-closed guards`
  - `runtime preview candidate routing`
- must_not_change:
  - `runtime preview implementation`
  - `version closeout`
  - `predecessor closed version status`
- done_when:
  - `Queue closeout records selector completion.`
  - `Runtime preview-from-memory remains candidate or is routed by explicit follow-up instruction.`
  - `Blueprint lint passes.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record a blocker in this queue and return to version review.`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the selector slice and return to version review without admitting runtime preview automatically.`
- task_outcome_summary:
  - `Done. Guard review passed and the queue was closed without entering version closeout or admitting runtime preview.`
- Purpose:
  - `Close only the selector queue and preserve the separate admission boundary for runtime preview-from-memory.`
- Failure mode:
  - `Automatically starting runtime preview implementation or version closeout from selector closeout.`

### Progress Log

- `2026-07-17`: `Admitted queue.script-editor-event-destination-selector-completion under the new post-closeout fixup version and completed evidence-anchor reconcile only. Evidence confirmed the event destination tab still shows raw English family enum values and free-text targetId while runtime-pack export only supports dialogue destinations. Implementation is the next active task but has not started.`
- `2026-07-17`: `Completed task.script-editor-event-destination-selector-completion.implementation without entering queue closeout or admitting runtime preview. RED coverage first failed because the event destination tab still used SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES.map and a text input for targetId. GREEN implementation made the destination family main path dialogue-only with the Chinese label 对话, changed destination targetId to a project.dialogues-backed select showing dialogue title plus id, preserved dialogue.id storage through updateScriptEditorEventDestinationField, and kept non-dialogue destinations fail closed in runtime export. Focused destination tests passed; full verification was run before pause.`
- `2026-07-17`: `Final implementation verification passed before pause: npm run typecheck, npm run lint:blueprints, and npm test (611/611). The active task is now queue-closeout-and-handoff, but closeout has not been executed.`
- `2026-07-17`: `Completed queue closeout/handoff after guard review. Source guard confirmed destination family no longer maps raw English enum choices, destination targetId is a select rather than text input, options come from project.dialogues and display dialogue title plus id while saving dialogue.id, non-dialogue destinations are only legacy/import unsupported residue, runtime export remains dialogue-only fail closed, EventBindingRuntime semantics were not touched, and EventDefinition trigger/conditions authoring did not return. Runtime preview-from-memory remains the next blocker/candidate and was not admitted. npm run lint:blueprints passed.`
