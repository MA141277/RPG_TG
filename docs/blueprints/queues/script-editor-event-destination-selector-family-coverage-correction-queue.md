# Script Editor Event Destination Selector Family Coverage Correction Queue

## Control Block

- queue_id: `queue.script-editor-event-destination-selector-family-coverage-correction`
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
- closure_basis: `Queue closed after guard review confirmed localized person/city/building/event/dialogue/minigame destination family choices, no raw English family main display, select-only targetId authoring, family-specific project data sources, name/title plus id option labels that save record ids, stale targetId clearing on family switch, person->people workspace reference validation, dialogue-only runtime export support, fail-closed non-dialogue destinations, unchanged EventBindingRuntime semantics, and no EventDefinition trigger/conditions ownership regression.`
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
  - `Correct the over-narrow destination selector by restoring localized authoring choices for all supported destination families while preserving dialogue-only runnable export support.`
- Admission basis:
  - `Manual review found queue.script-editor-event-destination-selector-completion made event destination family dialogue-only.`
  - `Authors still need person, city, building, event, dialogue, and minigame destination authoring choices.`
  - `TargetId must remain a select and switch data sources with the selected family.`
  - `Runtime export still supports only dialogue destinations, so non-dialogue choices must be marked unsupported for runnable export.`
- Required scope:
  - `Destination family displays Chinese labels for person/city/building/event/dialogue/minigame.`
  - `Destination targetId remains a select.`
  - `Target options come from project.people, project.cities, project.buildings, project.events, project.dialogues, or project.minigames according to family.`
  - `Option labels display name/title plus id and save the record id.`
  - `Family changes clear stale targetId when the old target belongs to another family.`
  - `Non-dialogue families show unsupported runtime/export guidance and remain fail-closed.`
- Forbidden expansions:
  - `Do not implement runtime support for person/city/building/event/minigame destinations.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not change EventDefinition trigger/conditions ownership.`
  - `Do not start runtime preview-from-memory implementation in this queue.`
  - `Do not enter version closeout.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-POST-CLOSEOUT-DESTINATION-FAMILY-COVERAGE-001`
- acceptance_not_claimed:
  - `Runtime preview from memory.`
  - `Runtime support for non-dialogue destinations.`
  - `EventBindingRuntime semantic changes.`
- minimum_verification:
  - `focused destination selector tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`

### Claim Boundary

#### Can Claim

- `ACC-POST-CLOSEOUT-DESTINATION-FAMILY-COVERAGE-001: Event destination authoring exposes localized family choices and family-specific target selectors, while only dialogue remains runnable export support.`

#### Cannot Claim

- `Runtime preview starts from current in-memory editor data.`
- `Non-dialogue destination runtime export or runtime support.`
- `EventBindingRuntime trigger or handoff semantics.`
- `Version closeout.`

#### Implementation Anchors

- Must inspect:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- Must modify:
  - `tests/robustness.test.cjs`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
- Must preserve:
  - `Dialogue-only runtime export support.`
  - `Unsupported destination fail-closed diagnostics.`
  - `EventBindingRuntime semantics.`
  - `EventDefinition trigger/conditions retirement.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-17-script-editor-event-binding-post-closeout-fixups-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`

### Queue Snapshot

- queue_goal: `Restore localized destination family coverage and family-specific target selectors while preserving dialogue-only runtime export.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closeout-and-handoff is complete. Return to version promotion review; runtime preview-from-memory remains unadmitted.`
- task_briefs:
  - `task.script-editor-event-destination-selector-family-coverage-correction.evidence-anchor-reconcile: Confirm the over-narrow selector regression and lock the corrective queue boundary.`
  - `task.script-editor-event-destination-selector-family-coverage-correction.implementation: Restore localized family coverage and target selectors test-first.`
  - `task.script-editor-event-destination-selector-family-coverage-correction.queue-closeout-and-handoff: Verify the corrective slice and return to version review without admitting runtime preview.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-event-destination-selector-family-coverage-correction.evidence-anchor-reconcile` | `done` | `Confirmed destination selector over-narrowing and locked the correction to family coverage plus target selectors only.` | `none` | `Completed on 2026-07-17.` |
| `task.script-editor-event-destination-selector-family-coverage-correction.implementation` | `done` | `Restored localized destination family coverage and family-specific target selectors test-first.` | `task.script-editor-event-destination-selector-family-coverage-correction.evidence-anchor-reconcile` | `Completed on 2026-07-17; queue closeout, runtime preview admission, and version closeout were not entered.` |
| `task.script-editor-event-destination-selector-family-coverage-correction.queue-closeout-and-handoff` | `done` | `Verified the corrective slice and returned to version review without admitting runtime preview or entering version closeout.` | `task.script-editor-event-destination-selector-family-coverage-correction.implementation` | `Completed on 2026-07-17; runtime preview-from-memory remains an unadmitted candidate.` |

### Task Definitions

#### `task.script-editor-event-destination-selector-family-coverage-correction.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-event-destination-selector-family-coverage-correction.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_inspect:
  - `destination family schema`
  - `destination selector UI`
  - `destination target update behavior`
  - `runtime export support boundary`
- must_not_change:
  - `runtime preview implementation`
  - `EventBindingRuntime semantics`
  - `version closeout`
- done_when:
  - `The over-narrow selector regression is recorded.`
  - `The correction boundary keeps runtime/export expansion out of scope.`
  - `Implementation task is bounded to authoring selector coverage.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `task.script-editor-event-destination-selector-family-coverage-correction.implementation`

##### Human Context

- task_brief:
  - `Confirm the over-narrow selector regression and lock the corrective queue boundary.`
- task_outcome_summary:
  - `Done. Evidence confirmed the prior selector completion over-narrowed family choices to dialogue only, while runtime export still only supports dialogue and must stay fail-closed for non-dialogue destinations.`

#### `task.script-editor-event-destination-selector-family-coverage-correction.implementation`

##### Control Block

- task_id: `task.script-editor-event-destination-selector-family-coverage-correction.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_replace:
  - `dialogue-only destination family selector`
  - `family switch retaining stale targetId`
- must_preserve:
  - `destination target select main path`
  - `dialogue-only runtime export support`
  - `unsupported non-dialogue destination fail-closed behavior`
- verify_with:
  - `focused destination selector tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`

##### Human Context

- task_brief:
  - `Restore localized family coverage and target selectors test-first.`
- task_outcome_summary:
  - `Done. RED tests failed on missing localized person/city/building/event destination labels and stale target retention after family change. GREEN implementation restored localized family choices, family-specific project data sources, person schema support, and stale target clearing while preserving dialogue-only export. Verification passed: focused destination tests, npm run typecheck, npm run lint:blueprints, and npm test (612/612).`

#### `task.script-editor-event-destination-selector-family-coverage-correction.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-event-destination-selector-family-coverage-correction.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-event-destination-selector-family-coverage-correction-queue.md`
  - `docs/blueprints/plans/2026-07-17-script-editor-event-binding-post-closeout-fixups-target-plan.md`
  - `docs/blueprints/project-progress.md`
- must_not_change:
  - `runtime preview implementation`
  - `version closeout`
- done_when:
  - `Queue closeout records the correction.`
  - `Runtime preview-from-memory remains candidate or is routed by explicit follow-up instruction.`
  - `Blueprint lint passes.`
- verify_with:
  - `npm run lint:blueprints`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the corrective slice and return to version review without admitting runtime preview automatically.`
- task_outcome_summary:
  - `Done. Guard review passed and the queue was closed without entering version closeout or admitting runtime preview.`

### Progress Log

- `2026-07-17`: `Admitted and implemented this corrective queue after manual review found the prior selector fix over-narrowed destination family to dialogue only. Focused RED tests captured missing localized destination families and stale target retention after family switch. GREEN implementation added person to ScriptEditorEventDestinationFamily, restored localized person/city/building/event/dialogue/minigame choices, made target options switch across project.people/cities/buildings/events/dialogues/minigames, cleared stale targetId on family change, and preserved dialogue-only runtime export fail-closed behavior for non-dialogue destinations.`
- `2026-07-17`: `Final implementation verification passed before pause: focused destination selector tests, npm run typecheck, npm run lint:blueprints, and npm test (612/612). The active task is queue-closeout-and-handoff, but closeout has not been executed.`
- `2026-07-17`: `Completed queue closeout/handoff after guard review. Source guard confirmed localized family labels for person/city/building/event/dialogue/minigame, select-only targetId authoring, family-specific project data sources, name/title plus id option labels, stale target clearing, person->people validation, dialogue-only runtime export, fail-closed non-dialogue destinations, unchanged EventBindingRuntime semantics, and no EventDefinition trigger/conditions regression. Runtime preview-from-memory remains the next blocker/candidate and was not admitted. npm run lint:blueprints passed.`
