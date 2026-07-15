# Script Editor City Building Entry And NPC Authoring Priority Queue

## Control Block

- queue_id: `queue.script-editor-city-building-entry-and-npc-authoring-priority`
- belongs_to_version: `target.script-editor-authoring-data-structure-unification`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-15`
- governance_sync_source: `docs/blueprints/blueprint.md`
- queue_status: `done`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `The bounded priority city/building/NPC authoring slice landed with verification: runtime export now materializes HouseDefinition, CityEntryDefinition, CityNpcPoolDefinition, and HouseAccessRefusalRule records from existing building/person authoring fields when explicit runtime family records are absent, while preserving imported explicit runtime families. No same-family residue remains inside this queue's priority authoring surface.`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `branch-push`
- sync_summary: `Priority authoring implementation and closeout are pending repository sync.`
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
  - `Add the priority city/building authoring path for building dialogue binding, entry/access conditions, refusal text references, city building selection, and NPC assignment after field and condition basics have landed.`
- Forbidden expansions:
  - `Do not build a broad city/building runtime resolver unless baseline proves a tiny authoring helper cannot work without it.`
  - `Do not invent a second condition schema for city/building access; consume the frozen typed condition authoring contract.`
  - `Do not hardcode city/building/NPC business branches in main.ts.`
  - `Do not change playable/minigame bindings from this queue.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Residue source:
  - `docs/blueprints/queues/script-editor-condition-runtime-evaluation-convergence-queue.md`

### Queue Snapshot

- queue_goal: `Determine and implement the smallest priority city/building authoring slice that lets creators bind buildings, entry/access conditions, refusal text references, and NPC assignment without duplicating runtime structures.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after the bounded priority city/building/NPC materialization export slice verified and returned control to version review.`
- task_briefs:
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile: inventory current city/building entry and NPC authoring/export/runtime seams and select the smallest lawful implementation slice.`
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation: implement the selected priority authoring slice with tests.`
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

### Operator Snapshot Contract

- `The fixed operator receipt must source 当前执行队列 from queue_id.`
- `The fixed operator receipt must source 当前任务 from active_task.`
- `The fixed operator receipt must source 当前队列目标 from queue_goal.`
- `Queue Snapshot exists to support concise operator visibility without exposing Blueprint internal ranking or admission internals by default.`

### Closeout Judgement Rule

- `Queue execution closeout is not equivalent to true topic closure.`
- `execution_closeout_status = done means the bounded execution slice landed and verified.`
- `topic_closure_status = closed is legal only when no still-blocking same-family residue remains inside the queue's bounded topic surface.`
- `If residue_remaining = yes, classify it as same-family / cross-family / accepted-residue / none before version-level routing continues.`
- `If residue_family = same-family and one lawful continuation exists, name it in next_family_candidate and allow automatic continuation instead of returning to open-ended human queue selection.`

### Admission Preconditions

- `Field mapping basics are frozen by queue.script-editor-unified-field-mapping-table-freeze.`
- `Typed condition authoring and bounded event runtime evaluation/export are now available as baseline evidence.`
- `The target spec marks building dialogue binding, entry/access conditions, refusal text references, city building selection, and NPC assignment as a required-priority authoring addition.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile` | `done` | `Inventoried city/building entry and NPC authoring/export/runtime seams and selected materialized runtime family export as the smallest implementation slice.` | `none` | `Production code was not changed during baseline.` |
| `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation` | `done` | `Implemented bounded city/building/NPC runtime-family materialization during runtime export.` | `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile` | `Landed with test-first coverage and verification.` |
| `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff` | `done` | `Verified, classified residue, and returned control to version review.` | `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation` | `Closed without version closeout.` |

### Task Definitions

#### `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/domain/city.ts`
  - `src/domain/house.ts`
  - `src/application/city-npcs`
  - `src/application/house-access`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-entry-and-npc-authoring-priority-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-condition-runtime-evaluation-convergence-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/minimal-workflow.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `broad city/building placement resolver migration`
  - `playable/minigame bindings`
  - `main.ts house-specific business branches`
- done_when:
  - `Current city/building/cityEntries/houseAccessRefusalRules/cityNpcPools/person NPC authoring and runtime consumption paths are inventoried.`
  - `The exact mismatch between existing generic JSON-backed records and creator-facing priority authoring controls is recorded.`
  - `The smallest lawful implementation slice is selected, or the queue is blocked/routed to a narrower prerequisite.`
  - `A test-first implementation plan names exact files, controls, validation rules, export/import behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "cityEntries|houseAccessRefusalRules|cityNpcPools|personType|NPC|building|cityId|houseId|dialogue|refusal|access" src/domain src/application src/ui tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if schema migration or placement resolver convergence must precede priority authoring.`
- promote_next_if_done: `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation`
- stop_if:
  - `Fresh evidence proves the priority authoring slice cannot proceed without another required queue first.`

##### Human Context

- task_brief:
  - `Find the smallest city/building/NPC authoring slice that is useful to creators and honest to existing runtime data.`
- task_outcome_summary:
  - `Done. Existing city/building authoring already exposes dedicated city/building detail tabs, menu entries, access fields, and building entryBinding controls, and person authoring already carries cityId/houseId with selectors. Runtime pack import/export currently preserves cityEntries, cityNpcPools, and houseAccessRefusalRules as generic runtime families, but new/minimal projects seed those arrays empty and no authoring materialization path turns the existing city/building/person authoring fields into those runtime families. Runtime consumers read CityEntryDefinition, CityNpcPoolDefinition, HouseAccessRefusalRule, and HouseDefinition fields directly from the exported pack. The smallest lawful slice is to add a script-editor materializer/export path that derives bounded cityEntries, cityNpcPools, and houseAccessRefusalRules from existing city/building/person authoring records while preserving explicitly authored/imported records and leaving broad placement resolver migration for a later queue.`
- Purpose:
  - `Move priority city/building entry and NPC authoring out of generic JSON shadows while preserving the canonical runtime pack families.`
- Failure mode:
  - `Creators can edit people, cities, and buildings but still cannot bind building access, refusal copy, or NPC placement without manual JSON patching.`

##### Progress Log

- `2026-07-15`: `Queue admitted from promotion review after condition runtime evaluation convergence closed and field/condition basics were sufficient for the priority city/building authoring candidate.`
- `2026-07-15`: `Baseline inspected script-editor city/building domain records, city-building-authoring helpers, workspace shell visibility, minimal workflow defaults, runtime-pack import/export preservation, UI city/building panels, person city/house assignment controls, runtime city entry/NPC/access/refusal domain shapes, and current robustness tests.`
- `2026-07-15`: `Current inventory: city/building profile/menu/access/entryBinding authoring controls already exist; person records already carry personType, cityId, and houseId; cityEntries/cityNpcPools/houseAccessRefusalRules are imported/exported as runtime families but not generated from authoring records; runtime consumers expect CityEntryDefinition, CityNpcPoolDefinition, HouseAccessRefusalRule, and HouseDefinition-compatible fields.`
- `2026-07-15`: `Selected smallest lawful slice: implement a bounded script-editor city/building runtime-family materializer used by runtime export that adds missing cityEntries for authored buildings, cityNpcPools for authored NPC people assigned to city/house, and houseAccessRefusalRules for disabled/hidden building access with refusal text, while preserving explicit imported records and avoiding resolver/main.ts changes.`
- `2026-07-15`: `Implementation plan for the next task: write failing tests proving exported packs derive city entry, city NPC pool, and house access refusal records from authored city/building/person fields and do not duplicate explicitly imported records; then implement the materializer in script-editor application code and wire runtime-pack-export to use it. Verification must include npm test, npm run typecheck, npm run build, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check.`

#### `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-entry-and-npc-authoring-priority.priority-authoring-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `broad city/building placement resolver migration`
  - `playable/minigame bindings`
  - `main.ts house-specific business branches`
- done_when:
  - `The selected priority authoring slice is implemented.`
  - `Tests cover the selected authoring helpers, UI/workspace exposure, and import/export preservation or lowering behavior.`
  - `Unsupported city/building/NPC shapes fail closed or remain explicitly routed residue.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into resolver migration opportunistically.`
- promote_next_if_done: `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broader placement resolver convergence to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected priority city/building/NPC authoring slice.`
- task_outcome_summary:
  - `Done. Runtime export now materializes the selected priority city/building/NPC runtime families from existing editor authoring fields, while explicit imported runtime family records remain authoritative and are not duplicated.`
- Purpose:
  - `Give creators first-class controls for the highest-priority city/building entry and NPC fields.`
- Failure mode:
  - `Generic JSON preservation continues to require hand-editing for city/building access and NPC placement.`

##### Progress Log

- `2026-07-15`: `Queued behind boundary-baseline-reconcile.`
- `2026-07-15`: `Activated after baseline selected bounded city/building runtime-family materialization from existing authoring fields as the smallest priority slice.`
- `2026-07-15`: `Added failing robustness tests proving empty runtime families are derived from authored building/person access and entry fields, and explicit cityEntries/cityNpcPools/houseAccessRefusalRules are not duplicated.`
- `2026-07-15`: `Implemented src/application/script-editor/city-building-runtime-materializer.ts and wired runtime-pack-export to use materialized houses, cityEntries, cityNpcPools, and houseAccessRefusalRules for validation and serialization.`
- `2026-07-15`: `Verification passed: npm run typecheck, npm test, npm run build, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check. Build emitted only existing Vite resource/size warnings; git diff --check emitted only existing line-ending warnings.`

#### `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-entry-and-npc-authoring-priority-queue.md`
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
  - `Priority authoring acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the priority city/building/NPC authoring queue after verified implementation.`
- task_outcome_summary:
  - `Done. Queue closed with no same-family priority authoring residue; broader city/building structure and placement resolver work remains governed by existing version-level candidate queues rather than this bounded priority slice.`
- Purpose:
  - `Keep priority authoring additions explicit before broader city/building resolver convergence continues.`
- Failure mode:
  - `Closing without verified authoring controls would leave priority city/building setup dependent on manual JSON edits.`

##### Progress Log

- `2026-07-15`: `Queued behind priority-authoring-implementation.`
- `2026-07-15`: `Closed after implementation verification. Same-family priority city/building entry/NPC materialization is complete for this slice; control returned to version review without closing the parent version.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.boundary-baseline-reconcile`
- Recorded handoff at activation:
  - `Queue is active and must start by reconciling city/building/NPC authoring gaps with existing runtime pack families before code changes.`
- Recorded expected output:
  - `A bounded priority authoring implementation path or an explicit prerequisite routing decision.`
