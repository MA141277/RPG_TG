# Script Editor City Building Structure Convergence Queue

## Control Block

- queue_id: `queue.script-editor-city-building-structure-convergence`
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
- closure_basis: `The bounded city/building structure convergence slice landed with verification: ScriptEditorBuildingRecord now explicitly owns the covered runtime HouseDefinition fields, building defaults and normalization produce runtime-house-compatible records, and runtime pack import normalizes houses into the editor building contract. City-local entry/placement/resolver convergence remains cross-family residue for the placement resolver queue.`
- residue_remaining: `yes`
- residue_family: `cross-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `failed`
- sync_scope: `branch-push`
- sync_summary: `City/building structure implementation and closeout attempted repository sync, but git push origin mod-first-dev failed because github.com:443 could not be reached.`
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
  - `Converge script-editor city/building authoring records with runtime city/building structures so export-time materialization is not the final durable model for entry bindings, menu entries, access rules, and runtime lookup.`
- Forbidden expansions:
  - `Do not implement city-local placement ids or override layering in this queue unless baseline proves structure convergence cannot proceed without the placement resolver.`
  - `Do not hardcode city/building/NPC business branches in main.ts.`
  - `Do not change playable/minigame bindings from this queue.`
  - `Do not replace the just-landed priority materializer with another compatibility-only projection as the final answer.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
- Predecessor queue:
  - `docs/blueprints/queues/script-editor-city-building-entry-and-npc-authoring-priority-queue.md`

### Queue Snapshot

- queue_goal: `Determine and implement the smallest city/building structure convergence slice that makes editor city/building records runtime-consumable without relying on export-only projection as the final durable model.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `Queue closed after runtime-house-compatible building structure contract hardening verified; placement/resolver residue returned to version review.`
- task_briefs:
  - `task.script-editor-city-building-structure-convergence.boundary-baseline-reconcile: inventory city/building authoring records, runtime HouseDefinition/CityEntryDefinition consumption, import/export materialization, and placement-resolver boundaries before code changes.`
  - `task.script-editor-city-building-structure-convergence.structure-contract-implementation: implement the selected city/building structure convergence slice with tests.`
  - `task.script-editor-city-building-structure-convergence.queue-closeout-and-handoff: verify, classify residue, record next-step truth, and return control to version review.`

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

- `queue.script-editor-city-building-entry-and-npc-authoring-priority closed after proving priority authoring fields can export bounded runtime families.`
- `The target spec admits this queue after priority city/building gaps are mapped, unless fresh evidence shows placement resolver convergence must happen first.`
- `This queue starts with baseline reconciliation because structure convergence must distinguish durable city/building record shape from city-local placement resolver ownership.`

### Repository Sync Record Rule

- `After a task reaches any terminal after-state and the required docs are updated, run one minimum repository sync batch.`
- `The queue-local sync record stores only repository sync result; it does not change task, queue, or version truth.`
- `sync failure must not be copied into blocked_by, queue closeout gates, version closeout gates, or version scheduling truth.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-structure-convergence.boundary-baseline-reconcile` | `done` | `Inventoried city/building authoring/runtime/export seams and selected runtime-house-compatible building structure contract hardening as the smallest implementation slice.` | `none` | `Production code was not changed during baseline.` |
| `task.script-editor-city-building-structure-convergence.structure-contract-implementation` | `done` | `Implemented runtime-house-compatible building structure contract hardening.` | `task.script-editor-city-building-structure-convergence.boundary-baseline-reconcile` | `Landed with test-first coverage and verification.` |
| `task.script-editor-city-building-structure-convergence.queue-closeout-and-handoff` | `done` | `Verified, classified residue, and returned control to version review.` | `task.script-editor-city-building-structure-convergence.structure-contract-implementation` | `Closed without version closeout.` |

### Task Definitions

#### `task.script-editor-city-building-structure-convergence.boundary-baseline-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-structure-convergence.boundary-baseline-reconcile`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/domain/script-editor-project.ts`
  - `src/domain/city.ts`
  - `src/domain/house.ts`
  - `src/domain/city-entry.ts`
  - `src/application/script-editor`
  - `src/application/scenario`
  - `src/application/city`
  - `src/application/house-access`
  - `tests/robustness.test.cjs`
  - `docs/blueprints/queues/script-editor-city-building-structure-convergence-queue.md`
- must_inspect:
  - `docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md`
  - `docs/blueprints/queues/script-editor-city-building-entry-and-npc-authoring-priority-queue.md`
  - `src/domain/script-editor-project.ts`
  - `src/domain/house.ts`
  - `src/domain/city-entry.ts`
  - `src/application/script-editor/city-building-authoring.ts`
  - `src/application/script-editor/city-building-runtime-materializer.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/robustness.test.cjs`
- must_not_change:
  - `production code before baseline reconciliation records the selected implementation slice`
  - `city-local placement resolver migration`
  - `playable/minigame bindings`
  - `main.ts house-specific business branches`
- done_when:
  - `Current editor city/building records, runtime HouseDefinition/CityEntryDefinition contracts, import/export paths, and runtime lookup consumers are inventoried.`
  - `The exact mismatch between export-time materialization and durable runtime-consumable city/building structures is recorded.`
  - `The smallest lawful structure convergence slice is selected, or the queue is blocked/routed to placement resolver convergence first.`
  - `A test-first implementation plan names exact files, schema rules, import/export behavior, residue posture, and verification commands for the next task.`
- verify_with:
  - `npm run lint:blueprints`
  - `rg -n "ScriptEditorCityRecord|ScriptEditorBuildingRecord|HouseDefinition|CityEntryDefinition|cityEntries|buildings|houses|entryBinding|backAction|access" src/domain src/application tests/robustness.test.cjs`
- if_blocked:
  - `Record the blocker and return to version review if placement resolver convergence must precede structure convergence.`
- promote_next_if_done: `task.script-editor-city-building-structure-convergence.structure-contract-implementation`
- stop_if:
  - `Fresh evidence proves this queue cannot proceed without queue.script-editor-city-building-placement-resolver-convergence first.`

##### Human Context

- task_brief:
  - `Find the smallest city/building structure convergence slice that turns runtime-compatible fields into durable editor-owned data rather than export-only projection.`
- task_outcome_summary:
  - `Done. Existing runtime import copies pack.houses into project.buildings and export now materializes runtime houses, but ScriptEditorBuildingRecord still does not explicitly own the HouseDefinition-compatible fields that runtime consumers require. The smallest lawful implementation slice is to harden the building authoring contract so buildings durably carry the runtime house fields needed by houses.json, while leaving city-local placement ids and resolver ownership for the placement-resolver queue.`
- Purpose:
  - `Replace the remaining city/building structure shadow with a governed runtime-consumable authoring contract.`
- Failure mode:
  - `The editor can export some priority city/building data but still depends on a projection-only materializer as the durable model.`

##### Progress Log

- `2026-07-15`: `Queue admitted after priority city/building/NPC authoring materialization closed with no same-family residue; baseline must decide whether durable city/building structure convergence can proceed before placement resolver convergence.`
- `2026-07-15`: `Baseline inspected ScriptEditorCityRecord/ScriptEditorBuildingRecord, runtime HouseDefinition and CityEntryDefinition contracts, city-building-authoring defaults/normalizers, runtime-pack import/export, the new city-building runtime materializer, active-game-content indexing, and existing robustness coverage.`
- `2026-07-15`: `Inventory: runtime consumers index houses as HouseDefinition[] and cityEntries as CityEntryDefinition[]; runtime import currently stores pack.houses directly into project.buildings; ScriptEditorBuildingRecord only explicitly declares cityId/name/menu/access/entryBinding even though imported runtime house fields survive through the open entity record shape; export materialization fills type, characterIds, defaultCharacterId, backAction, activityLocationId, and event ids when serializing.`
- `2026-07-15`: `Mismatch: the editor's durable building contract still treats runtime house fields as implicit unknown properties, so the just-landed materializer remains the source of truth for required house fields in new projects. This is structure drift, not placement resolver ownership.`
- `2026-07-15`: `Selected smallest lawful slice: make ScriptEditorBuildingRecord explicitly runtime-house-compatible for the covered HouseDefinition fields, normalize/create default values in city-building-authoring, and update export/materializer tests to prove buildings durably own the house structure without changing city-local placement resolver behavior.`
- `2026-07-15`: `Implementation plan for the next task: write failing tests for default/normalized building runtime house fields and exported houses preserving authored runtime house values; update src/domain/script-editor-project.ts and src/application/script-editor/city-building-authoring.ts; keep cityEntries/cityNpcPools/refusal materialization as bounded export support; verify with npm run typecheck, npm test, npm run build, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check.`

#### `task.script-editor-city-building-structure-convergence.structure-contract-implementation`

##### Control Block

- task_id: `task.script-editor-city-building-structure-convergence.structure-contract-implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `Files identified by boundary-baseline-reconcile.`
- must_inspect:
  - `Boundary baseline evidence from the active task.`
- must_not_change:
  - `city-local placement resolver migration unless selected by baseline`
  - `playable/minigame bindings`
  - `main.ts house-specific business branches`
- done_when:
  - `The selected city/building structure convergence slice is implemented.`
  - `Tests cover import/export preservation, runtime compatibility, and fail-closed behavior for unsupported shapes.`
- verify_with:
  - `npm test`
  - `npm run typecheck`
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and do not widen into placement resolver migration opportunistically.`
- promote_next_if_done: `task.script-editor-city-building-structure-convergence.queue-closeout-and-handoff`
- stop_if:
  - `Implementation requires broader placement resolver convergence to be admitted first.`

##### Human Context

- task_brief:
  - `Implement the selected city/building structure convergence slice.`
- task_outcome_summary:
  - `Done. ScriptEditorBuildingRecord now explicitly owns the covered runtime HouseDefinition fields, default and normalized buildings carry runtime-house-compatible values, and runtime pack import normalizes imported houses into that editor contract.`
- Purpose:
  - `Make the covered city/building records durable runtime-consumable structures.`
- Failure mode:
  - `Export continues to rely on hidden projection instead of governed structure truth.`

##### Progress Log

- `2026-07-15`: `Queued behind boundary-baseline-reconcile.`
- `2026-07-15`: `Activated after baseline selected runtime-house-compatible building structure contract hardening as the smallest convergence slice.`
- `2026-07-15`: `Added failing robustness coverage for default and normalized building records owning runtime house fields, then updated ScriptEditorBuildingRecord, city-building authoring defaults/normalization, runtime import normalization, and materializer type handling.`
- `2026-07-15`: `Verification passed: npm run typecheck, npm test, npm run build, npm run lint:blueprints, npm run lint:plans, npm run blueprint:governance:check, and git diff --check. Build emitted only existing Vite resource/size warnings; git diff --check emitted only line-ending warnings.`

#### `task.script-editor-city-building-structure-convergence.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-structure-convergence.queue-closeout-and-handoff`
- state: `done`
- task_kind: `execution`
- scope:
  - `docs/blueprints/project-progress.md`
  - `docs/blueprints/blueprint.md`
  - `docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-structure-convergence-queue.md`
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
  - `Structure convergence acceptance has not passed or residue has not been routed.`

##### Human Context

- task_brief:
  - `Close or route the city/building structure convergence queue after verified implementation.`
- task_outcome_summary:
  - `Done. Queue closed with cross-family residue routed to version review for city-local entry/placement/resolver convergence.`
- Purpose:
  - `Keep city/building structure convergence explicit before placement resolver or broader runtime lookup work continues.`
- Failure mode:
  - `Closing without structure evidence would leave placement and runtime resolver queues depending on unresolved city/building shape.`

##### Progress Log

- `2026-07-15`: `Queued behind structure-contract-implementation.`
- `2026-07-15`: `Closed after implementation verification. The covered building/house structure contract is now durable; city-local placement ids, override layering, centralized resolver seams, and city-entry ownership remain for queue.script-editor-city-building-placement-resolver-convergence review.`
- `2026-07-15`: `Repository sync attempted with git push origin mod-first-dev and failed because github.com:443 could not be reached; per sync record rule this records sync failure only and does not block version-level routing.`

### Historical Handoff Note

- Task ID:
  - `task.script-editor-city-building-entry-and-npc-authoring-priority.queue-closeout-and-handoff`
- Recorded handoff at activation:
  - `Priority city/building/NPC materialization export closed with no same-family residue, but the version target still requires city/building authoring and runtime structures to converge.`
- Recorded expected output:
  - `A bounded structure convergence implementation path or an explicit prerequisite routing decision to placement resolver convergence.`
