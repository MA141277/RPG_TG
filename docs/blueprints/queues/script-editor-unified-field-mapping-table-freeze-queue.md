# Script Editor Unified Field Mapping Table Freeze Queue

## Control Block

- queue_id: `queue.script-editor-unified-field-mapping-table-freeze`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `active`
- queue_class: `required`
- active_task: `task.script-editor-unified-field-mapping-table-freeze.field-mapping-contract-freeze`
- next_task: `task.script-editor-unified-field-mapping-table-freeze.queue-closeout-and-handoff`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `This queue has just been admitted after project package persistence and completion-state gating stabilized durable project truth.`
- residue_remaining: `yes`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `failed`
- sync_scope: `baseline-push`
- sync_summary: `Commit ff369f7 was pushed to origin/mod-first-dev for queue admission, but the follow-up sync-record commit could not be pushed because HTTPS connections to github.com:443 timed out after repeated retry attempts.`
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
  - `Freeze a shared script-editor field id and field-definition contract so later object-family authoring queues can render, validate, and order fields from one mapping table instead of hardcoded per-panel lists.`
- Forbidden expansions:
  - `Do not migrate every character, city, building, dialogue, story, event, condition, or launch-policy record in this queue.`
  - `Do not redesign the editor visual layout or create broad UI polish work.`
  - `Do not introduce a creator-facing custom-field marketplace or plugin system.`
  - `Do not solve runtime gameplay behavior or save/status mutation ownership in this queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-project-completion-state-gating-queue.md`

### Queue Snapshot

- queue_goal: `Freeze a reusable field mapping table contract for script-editor authoring controls, labels, value types, validation hints, editability, runtime mutability, and ordering.`
- task_count: `3`
- completed_task_count: `1`
- remaining_task_count: `2`
- active_task_summary: `Add the bounded field-definition contract, validation helpers, and representative tests without migrating every object family.`
- task_briefs:
  - `task.script-editor-unified-field-mapping-table-freeze.boundary-baseline-reconcile: completed after current authoring field lists, label maps, enum constants, validation diagnostics, and helper seams were identified.`
  - `task.script-editor-unified-field-mapping-table-freeze.field-mapping-contract-freeze: active task to add the bounded field-definition contract, validation helpers, and representative tests without migrating every object family.`
  - `task.script-editor-unified-field-mapping-table-freeze.queue-closeout-and-handoff: verify, classify residue, and return control to version review.`

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

- `queue.script-editor-project-completion-state-gating closed with durable project completion truth and no same-family residue.`
- `The current version plan records queue.script-editor-unified-field-mapping-table-freeze as the next required contract queue before broad object-family UI convergence.`
- `The queue must start with source-backed baseline reconciliation because current field rendering is distributed across workspace shell, authoring helpers, and tests.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-unified-field-mapping-table-freeze.boundary-baseline-reconcile` | `completed` | `Reconciled current field rendering, label, validation, and helper surfaces before freezing the shared field-definition contract.` | `none` | `Completed on 2026-07-15 after source evidence showed field metadata is split across workspace shell family labels/diagnostic targets/preview summaries, person imported-attribute labels and value parsing, object-family enum constants, update helpers, and validation diagnostics.` |
| `task.script-editor-unified-field-mapping-table-freeze.field-mapping-contract-freeze` | `active` | `Implement the bounded field mapping table contract and representative validation tests.` | `task.script-editor-unified-field-mapping-table-freeze.boundary-baseline-reconcile` | `Must not widen into full object-family migration.` |
| `task.script-editor-unified-field-mapping-table-freeze.queue-closeout-and-handoff` | `pending` | `Verify the field mapping contract slice, classify residue, and return control to version review.` | `task.script-editor-unified-field-mapping-table-freeze.field-mapping-contract-freeze` | `Must run lint and relevant tests before queue closeout.` |

### Task Definitions

#### `task.script-editor-unified-field-mapping-table-freeze.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-unified-field-mapping-table-freeze.boundary-baseline-reconcile`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/application/script-editor`
  - `src/domain/script-editor-project.ts`
  - `src/ui/views/script-editor`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-unified-field-mapping-table-freeze-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/specs/2026-07-14-script-editor-authoring-data-structure-unification-draft.md`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/application/script-editor/person-authoring.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
  - `src/application/script-editor/minigame-binding-authoring.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `object-family runtime schemas`
  - `script-editor visual layout redesign`
  - `runtime gameplay behavior`
- done_when:
  - `Current hardcoded field lists, label maps, validation hints, and representative authoring helper seams are identified.`
  - `The smallest representative field-definition slice is chosen for implementation.`
  - `The implementation task has a bounded test-first plan.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "field|label|valueType|validation|updateScriptEditor|normalizeScriptEditor|SCRIPT_EDITOR_.*FIELDS|FAMILY_LABELS" src/application/script-editor src/ui/views/script-editor src/ui/main-ui/main-ui-flow.js tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker in this queue doc and return to version review if field mapping requires an upstream schema-reference queue first.`
- promote_next_if_done: `task.script-editor-unified-field-mapping-table-freeze.field-mapping-contract-freeze`
- stop_if:
  - `Fresh evidence proves the field mapping contract must be owned by an admitted object-family queue instead of this standalone freeze queue.`

##### Human Context

- task_brief:
  - `Reconcile the current field rendering and validation boundary before writing the shared field mapping contract.`
- task_outcome_summary:
  - `Completed with a source-backed implementation boundary: the first contract slice should define shared field definitions and validation helpers, prove representative person fields for base/profile/stat/skill/custom/enum/boolean/list/reference cases, and leave full city/building/narrative/minigame migration to later queue tasks.`
- Purpose:
  - `Prevent later authoring queues from inventing incompatible field ids, labels, value types, and validation hints per panel.`
- Failure mode:
  - `Freezing a mapping table without source evidence could create a second hardcoded field list rather than the shared contract later queues need.`

##### Progress Log

- `2026-07-15`: `Inspected target/draft specs plus src/application/script-editor/workspace-shell.ts, person-authoring.ts, city-building-authoring.ts, story-dialogue-event-authoring.ts, minigame-binding-authoring.ts, UI field bindings in src/ui/main-ui/main-ui-flow.js, and robustness tests. Current field metadata is distributed across FAMILY_LABELS/TREE_GROUPS, export diagnostic fieldPath targeting, createRecordPreview/localizePreviewKey, person SCRIPT_EDITOR_PERSON_ATTRIBUTE_LABELS and numeric/boolean parsing, city/building access/menu enum constants, story/dialogue/event enum constants and update helpers, minigame enum constants, and shared-rule diagnostic field paths.`
- `2026-07-15`: `Chose the bounded implementation slice: introduce shared field-definition metadata plus validation helpers and representative tests, using person authoring fields to cover base string, profile text, stat/skill numeric paths, custom key/value entries, enum, boolean, list, and reference-style ids. Full object-family UI migration remains out of this task.`

#### `task.script-editor-unified-field-mapping-table-freeze.field-mapping-contract-freeze`

##### Control Block

- task_id: `task.script-editor-unified-field-mapping-table-freeze.field-mapping-contract-freeze`
- state: `active`
- task_kind: `execution`
- scope:
  - `src/application/script-editor`
  - `src/domain/script-editor-project.ts`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-unified-field-mapping-table-freeze-queue.md`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `full object-family migrations`
  - `runtime gameplay behavior`
  - `broad visual redesign`
- done_when:
  - `A shared field-definition contract exists for field ids, canonical keys, labels, groups, value types, editability, runtime mutability, validation hints, defaults, enum options, and ordering.`
  - `Validation rejects duplicate field ids, invalid value types, and missing required mapping data for the bounded representative slice.`
  - `Tests or fixtures prove representative base, profile, stat, skill, custom, enum, boolean, list, and reference field definitions where applicable within the bounded slice.`
- verify_with:
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in this queue doc and return to version review if field mapping cannot be frozen without a broader schema reference queue.`
- promote_next_if_done: `task.script-editor-unified-field-mapping-table-freeze.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires migrating all authoring object families in one queue.`

##### Human Context

- task_brief:
  - `Freeze the bounded shared field mapping contract and representative validation coverage.`
- task_outcome_summary:
  - `Expected output is a reusable field-definition contract that later authoring queues can consume without duplicating field metadata.`
- Purpose:
  - `Give later character, city/building, dialogue/story, event, and condition queues one source of truth for field metadata.`
- Failure mode:
  - `If the contract is too broad, it becomes a hidden full migration; if too narrow, later queues will keep hardcoding field metadata.`

#### `task.script-editor-unified-field-mapping-table-freeze.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-unified-field-mapping-table-freeze.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-unified-field-mapping-table-freeze-queue.md`
  - `docs/change-log.md`
- must_inspect:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-unified-field-mapping-table-freeze-queue.md`
- must_not_change:
  - `version boundary without explicit residue evidence`
  - `new queue admission without written routing truth`
  - `repository sync truth before queue-local closeout truth is written`
- done_when:
  - `Queue truth, version truth, and project-progress truth are synchronized before control returns to version review.`
  - `Any same-family or cross-family residue is explicitly classified and routed.`
  - `Verification and queue-local handoff are written before any repository sync batch is recorded.`
- verify_with:
  - `npm run lint:blueprints`
  - `npm run lint:plans`
- promote_next_if_done: `return-to-version-review`
- stop_if:
  - `Field mapping contract acceptance has not been verified or explicitly blocked.`

##### Human Context

- task_brief:
  - `Close the field mapping table freeze queue only after implementation is verified or honestly routed.`
- task_outcome_summary:
  - `Expected output is a clean handoff back to version review with field mapping either closed or explicitly routed.`
- Purpose:
  - `Prevent later object-family queues from depending on ambiguous field metadata ownership.`
- Failure mode:
  - `Closing without explicit validation would let later queues reintroduce per-panel field definitions.`

### Historical Handoff Note

- Task ID:
  - `none`
- Recorded handoff at closure:
  - `none yet`
- Recorded expected output:
  - `Field mapping table contract is frozen or explicitly routed as prerequisite residue.`

### Historical Candidate Notes

- `Admitted from the version plan after completion-state gating closeout returned the version to promotion review.`
