# Script Editor Character Authoring Surface Completion Queue

## Control Block

- queue_id: `queue.script-editor-character-authoring-surface-completion`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff`
- next_task: `none`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Queue admitted after character definition/status convergence and CharacterStatus save/runtime continuation closed; creator-facing character controls remain unimplemented as a separate version candidate.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `Commit ac5a0d2 was pushed to origin/mod-first-dev, carrying queue admission and the active boundary baseline task.`
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
  - `Complete the creator-facing script-editor character authoring surface for the fields already owned by the character definition/status contract, without creating a second runtime character truth.`
- Forbidden expansions:
  - `Do not edit live save/runtime CharacterStatus from the normal authoring surface.`
  - `Do not migrate city, building, dialogue, story, event, condition, launch-policy, playable, or minigame authoring families in this queue.`
  - `Do not supersede schemas or delete legacy structures without the schema-reference-and-migration-freeze queue.`
  - `Do not change gameplay formulas or broad runtime consumers.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queues:
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`
  - `docs/blueprints/queues/script-editor-character-status-save-runtime-continuation-queue.md`

### Queue Snapshot

- queue_goal: `Expose complete creator-facing controls for character base/profile/stat/skill/custom and bounded relation fields already supported by the character contract.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Verify the implemented character authoring surface, classify any residue, and synchronize Blueprint truth.`
- task_briefs:
  - `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile: identify the exact missing character controls and storage helpers already covered by the character contract.`
  - `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation: implement the bounded creator-facing controls with tests.`
  - `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-character-definition-status-convergence closed after CharacterStatus materialization, editor person runtime CharacterDefinition import/export, and covered mutation patch outputs landed.`
- `queue.script-editor-character-status-save-runtime-continuation closed after CharacterStatus patches became durable through AppState-owned aggregation, save-envelope modState persistence, startup restore materialization, and covered runtime commit tests.`
- `queue.script-editor-unified-field-mapping-table-freeze closed with representative field metadata that this queue can consume for character controls.`
- `Full creator-facing character controls were intentionally kept separate from the predecessor bounded contract and persistence queues.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile` | `completed` | `Reconciled current character editor UI, helper storage, field mapping, and import/export behavior before implementation.` | `none` | `Completed after freezing a mapping-driven UI/control slice over the existing flat CharacterDefinition canonical keys.` |
| `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation` | `completed` | `Implement the selected character authoring controls and helper tests.` | `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile` | `Completed after field-definition expansion, typed mapped-field controls, custom key editing, and full verification passed.` |
| `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff` | `active` | `Verify the queue, classify residue, and synchronize Blueprint truth.` | `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation` | `Must not close without UI/storage/import-export evidence.` |

### Task Definitions

#### `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/domain/script-editor-project.ts`
  - `src/domain/character.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-character-authoring-surface-completion-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-character-definition-status-convergence-queue.md`
  - `docs/blueprints/queues/script-editor-character-status-save-runtime-continuation-queue.md`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/field-mapping.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `runtime save CharacterStatus editing`
  - `city/building/dialogue/story/event/condition/playable authoring`
  - `schema migration or legacy supersession`
  - `gameplay formulas`
- done_when:
  - `The current visible character authoring controls and helper APIs are inventoried.`
  - `Missing controls for baseAttributes, profileMap, statMap, skillMap, customMap, dialogueIds, eventIds, and tradeBinding are classified as in-scope, out-of-scope, or already covered.`
  - `A bounded test-first implementation plan identifies exact files, controls, and helper behavior to change.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "baseAttributes|profileMap|statMap|skillMap|customMap|dialogueIds|eventIds|tradeBinding|people|character" src/application/script-editor src/ui/main-ui tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if schema-reference-and-migration-freeze must precede these controls.`
- promote_next_if_done: `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation`
- stop_if:
  - `Fresh evidence proves the smallest lawful next queue is city/building, schema migration, or launch policy rather than character authoring controls.`

##### Human Context

- task_brief:
  - `Find the exact missing creator-facing character controls before editing UI or helpers.`
- task_outcome_summary:
  - `The bounded implementation will use the existing field-definition contract to render base/profile/stat/skill/custom groups over the already-canonical flat CharacterDefinition keys, add missing typed/reference controls, and repair custom-attribute key editing without introducing the draft nested schema or touching CharacterStatus.`
- Purpose:
  - `Prevent UI work from widening beyond the already-owned character data contract.`
- Failure mode:
  - `Adding ad hoc controls without baseline reconciliation could create another durable character truth or accidentally migrate unrelated object families.`

##### Progress Log

- `2026-07-15`: `Queue admitted after durable CharacterStatus save/runtime persistence closed and version review selected creator-facing character control completion as the next lawful character-family candidate.`
- `2026-07-15`: `Baseline inventory found the current profile tab already edits name, personType, title, occupation, cityId, houseId, portraitId, portraitVariantId, and biography; dialogueIds already use a project dialogue selector; eventIds and tradeBinding.entryId still use raw text; imported profile/stat/skill fields are flattened into one extendedAttributes card list; and the field-definition table is not consumed by the UI.`
- `2026-07-15`: `The literal baseAttributes/profileMap/statMap/skillMap/customMap nesting remains only in the historical source draft. The closed character definition/status queue retained flat CharacterDefinition canonical keys, while the schema-reference-and-migration-freeze queue owns any later persisted-shape supersession. This queue therefore treats base/profile/stat/skill/custom as mapping-driven authoring groups rather than a new durable schema.`
- `2026-07-15`: `Classified coverage: base/profile is partial; statMap and skillMap lack dedicated typed controls; customMap is incomplete because custom keys cannot be edited and empty keys never materialize; dialogueIds is covered; eventIds needs a project reference selector; tradeBinding.enabled is covered while entryId needs a bounded project reference selector. Runtime save CharacterStatus remains out of scope.`
- `2026-07-15`: `Test-first implementation plan: expand the person field definitions to the actual CharacterDefinition profile/stat/skill canonical keys; add helper tests for typed mapped-field updates and valid custom key add/edit/delete behavior; add UI-source tests proving mapping-table consumption, grouped controls, event/city-entry selectors, and no CharacterStatus editor; then implement only src/application/script-editor/field-mapping.ts, person-authoring.ts, src/ui/main-ui/main-ui-flow.js, src/styles/script-editor.css, and tests/robustness.test.cjs. Import/export code should remain unchanged unless round-trip tests expose a bounded defect.`

#### `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation`

##### Control Block

- task_id: `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/field-mapping.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/styles/script-editor.css`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-character-authoring-surface-completion-queue.md`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `runtime save CharacterStatus editing`
  - `unrelated object-family authoring`
  - `schema migration`
- done_when:
  - `The bounded character authoring controls are visible and persist through project save/load.`
  - `Import/export remains compatible with the runtime CharacterDefinition materialization path.`
  - `Tests cover helper behavior and representative UI/workspace evidence.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker without inventing ad hoc schema branches.`
- promote_next_if_done: `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires unrelated family migration.`

##### Human Context

- task_brief:
  - `Implement the bounded creator-facing character controls chosen by baseline reconciliation.`
- task_outcome_summary:
  - `The bounded character authoring controls now render a mapping-driven base/profile/stat/skill field surface over the existing flat CharacterDefinition keys, provide reference selectors for dialogue/event/trade bindings, and allow custom attribute keys to be edited without touching CharacterStatus or the draft nested schema.`
- Purpose:
  - `Make the character contract actually editable from the script-editor workbench.`
- Failure mode:
  - `Controls that only change transient UI state would not satisfy durable authoring completion.`

##### Progress Log

- `2026-07-15`: `Activated after boundary reconciliation froze the implementation boundary. The UI may group existing flat canonical keys as base/profile/stat/skill/custom, but must not introduce the draft nested character schema or expose live CharacterStatus editing.`
- `2026-07-15`: `Implemented the mapping-driven authoring surface over the current flat canonical keys, added reference selectors for event and trade binding fields, exposed a custom attribute key editor, and verified the change with npm run build:test, a targeted node --test slice, npm run typecheck, npm run lint:blueprints, and npm test.`

#### `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff`
- state: `active`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-character-authoring-surface-completion-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `Current queue, version plan, Blueprint, and project-progress truth.`
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
  - `Character authoring surface acceptance has not passed.`

##### Human Context

- task_brief:
  - `Close or route the character authoring surface queue after verified implementation.`
- task_outcome_summary:
  - `Pending verification, residue classification, and synchronization of the queue and version truth.`
- Purpose:
  - `Keep character-family UI completion routing explicit before city/building or schema queues continue.`
- Failure mode:
  - `Closing without durable save/load and import/export evidence would leave the editor unable to author the completed character contract.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Queue is active and now awaits closeout verification.`
- Recorded expected output:
  - `A creator-facing character authoring surface aligned with the completed character definition/status contract.`
