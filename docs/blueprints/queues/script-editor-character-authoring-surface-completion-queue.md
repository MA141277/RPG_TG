# Script Editor Character Authoring Surface Completion Queue

## Control Block

- queue_id: `queue.script-editor-character-authoring-surface-completion`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile`
- next_task: `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation`
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
- sync_status: `failed`
- sync_scope: `branch-push`
- sync_summary: `Queue admission commit 3b6bbe4 is local, but three fresh push attempts failed because github.com port 443 was unreachable; this repository-sync failure is not an execution blocker.`
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
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Reconcile current character editor UI, person-authoring helpers, field mapping, import/export, and existing tests before implementation.`
- task_briefs:
  - `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile: identify the exact missing character controls and storage helpers already covered by the character contract.`
  - `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation: implement the bounded creator-facing controls with tests.`
  - `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 褰撳墠鎵ц闃熷垪 from queue_id.`
- `The fixed operator receipt must source 褰撳墠浠诲姟 from active_task.`
- `The fixed operator receipt must source 褰撳墠闃熷垪鐩�?from queue_goal.`
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
| `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile` | `active` | `Reconcile current character editor UI, helper storage, field mapping, and import/export behavior before implementation.` | `none` | `Must freeze the bounded UI/control list before code changes.` |
| `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation` | `pending` | `Implement the selected character authoring controls and helper tests.` | `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile` | `Must not edit live CharacterStatus save overlays.` |
| `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff` | `pending` | `Verify the queue, classify residue, and synchronize Blueprint truth.` | `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation` | `Must not close without UI/storage/import-export evidence.` |

### Task Definitions

#### `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-character-authoring-surface-completion.boundary-baseline-reconcile`
- state: `active`
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
  - `Pending; expected output is a bounded list of character controls and helper behavior to implement.`
- Purpose:
  - `Prevent UI work from widening beyond the already-owned character data contract.`
- Failure mode:
  - `Adding ad hoc controls without baseline reconciliation could create another durable character truth or accidentally migrate unrelated object families.`

##### Progress Log

- `2026-07-15`: `Queue admitted after durable CharacterStatus save/runtime persistence closed and version review selected creator-facing character control completion as the next lawful character-family candidate.`

#### `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation`

##### Control Block

- task_id: `task.script-editor-character-authoring-surface-completion.authoring-controls-implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `Scope must be finalized by boundary-baseline-reconcile before code changes.`
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
  - `Pending until the baseline task chooses exact controls and files.`
- Purpose:
  - `Make the character contract actually editable from the script-editor workbench.`
- Failure mode:
  - `Controls that only change transient UI state would not satisfy durable authoring completion.`

#### `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-character-authoring-surface-completion.queue-closeout-and-handoff`
- state: `pending`
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
  - `Pending.`
- Purpose:
  - `Keep character-family UI completion routing explicit before city/building or schema queues continue.`
- Failure mode:
  - `Closing without durable save/load and import/export evidence would leave the editor unable to author the completed character contract.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `Queue is active and has not reached closure.`
- Recorded expected output:
  - `A creator-facing character authoring surface aligned with the completed character definition/status contract.`
