# Script Editor City Building Location Access Refusal Runtime Handoff Correction Queue

## Control Block

- queue_id: `queue.script-editor-city-building-location-access-refusal-runtime-handoff-correction`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-20`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `dropped`
- queue_class: `required-priority`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Queue was admitted but not executed; the operator redirected priority to encoding repair before evidence-anchor work began.`
- residue_remaining: `yes`
- residue_family: `accepted-residue`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue dropped locally before execution because the operator redirected priority to encoding repair.`
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
  - `Correct the production runtime handoff for city/building locationAccess refusal results so a failed entry gate surfaces the expected refusal dialogue or refusal UI instead of silently entering or losing the access result.`
- Admission basis:
  - `The previous active queue closed with docs/blueprints/reports/2026-07-20-city-building-location-access-buglist.md recording ACC-007 browser paths and open refusal-entry bugs.`
  - `This candidate was already recorded in the current version plan and is the closest executable same-version queue for BUG-ACC007-001.`
- Forbidden expansions:
  - `Do not redesign the Script Editor condition picker in this queue unless evidence proves it is required for runtime refusal handoff.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not absorb broad mojibake repair, list/search UX, or map/review provider cleanup.`
  - `Do not enter version closeout.`

### Evidence Lock

- evidence_lock_status: `pending`
- implementation_anchor_status: `pending`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-001`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-002`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-003`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-004`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-005`
- acceptance_not_claimed:
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-001`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-002`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-003`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-004`
  - `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-005`
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-001: routeNavigationRuntime preserves locationAccess refusal details in runtimeResult.access when city entry is blocked.`
- `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-002: main city-entry commit converts runtimeResult.access.refusal into the visible locationDialogueState refusal flow.`
- `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-003: building entry consumes activeContentContext.locationAccess through the new locationAccess path and does not rely only on legacy houseAccessRefusalRules.`
- `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-004: refusal dialogue/prompt display works for city and building entry in runtime preview when the gate fails.`
- `ACC-CITY-BUILDING-ACCESS-REFUSAL-RUNTIME-005: satisfied and no-condition city/building entry paths still enter normally across normal start, JSON import, and runtime preview.`

#### Cannot Claim

- `Script Editor person/time condition picker completion.`
- `Main UI mojibake repair.`
- `EventBindingRuntime semantics.`
- `Map/review provider boundary cleanup.`
- `Version closeout.`

#### Implementation Anchors

- Must inspect:
  - `docs/blueprints/reports/2026-07-20-city-building-location-access-buglist.md`
  - `src/core/runtime/navigation-runtime.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/main.ts`
  - `src/application/runtime/city-house-transition-coordinator.ts`
  - `src/application/city/city-building-placement-resolver.ts`
  - `src/application/city/city-building-house-runtime-adapter.ts`
  - `src/application/location-access/location-access-runtime.ts`
  - `src/application/content/active-game-content.ts`
  - `tests/**`
  - `browser simulated-human flow`
- Must preserve:
  - `CityModule and BuildingModule entry contracts.`
  - `Scenario-pack export/load/startup semantics across normal start, JSON import, and runtime preview.`
  - `Existing houseAccessRefusalRules behavior where still separately required.`
  - `EventBindingRuntime semantics.`

#### Verification Coverage

- `Focused tests for city and building failed locationAccess refusal handoff.`
- `Focused tests for satisfied/no-condition city and building entry paths.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- `Browser simulated-human flow for at least one city refusal and one building refusal in runtime preview.`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Make failed city/building locationAccess runtime checks surface refusal results correctly without breaking normal entry paths.`
- task_count: `3`
- completed_task_count: `0`
- remaining_task_count: `3`
- active_task_summary: `Confirm buglist evidence, runtime handoff seams, and exact implementation boundary before code changes.`
- task_briefs:
  - `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.evidence-anchor-reconcile: Confirm the buglist evidence and runtime handoff boundary before implementation.`
  - `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.implementation: Implement refusal handoff correction test-first and verify runtime behavior.`
  - `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.queue-closeout-and-handoff: Verify the queue and return to version review without version closeout.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.evidence-anchor-reconcile` | `dropped` | `Confirm the buglist evidence and runtime handoff boundary before implementation.` | `none` | `Not executed; operator redirected priority to encoding repair.` |
| `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.implementation` | `pending` | `Implement refusal handoff correction test-first and verify runtime behavior.` | `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.evidence-anchor-reconcile` | `Pending evidence lock.` |
| `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.queue-closeout-and-handoff` | `pending` | `Verify the queue and return to version review without version closeout.` | `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.implementation` | `Pending implementation.` |

### Task Definitions

#### `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.evidence-anchor-reconcile`
- state: `dropped`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/reports/2026-07-20-city-building-location-access-buglist.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-location-access-refusal-runtime-handoff-correction-queue.md`
  - `src/core/runtime/navigation-runtime.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/main.ts`
  - `src/application/runtime/city-house-transition-coordinator.ts`
  - `src/application/city/city-building-placement-resolver.ts`
  - `src/application/city/city-building-house-runtime-adapter.ts`
  - `src/application/location-access/location-access-runtime.ts`
  - `tests/**`
- must_inspect:
  - `BUG-ACC007-001 city refusal symptom`
  - `current city entry runtime commit path`
  - `current building entry access path`
  - `runtimeResult access/refusal contract`
- must_not_change:
  - `Do not implement feature code before evidence anchor is confirmed.`
  - `Do not widen into Script Editor condition picker repair unless the evidence proves refusal handoff cannot be tested otherwise.`
- done_when:
  - `The queue boundary and implementation anchors are confirmed.`
  - `The next implementation task has a narrow test-first target.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record blocker in the queue and return to version review.`
- promote_next_if_done: `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.implementation`
- stop_if:
  - `Evidence proves the candidate is fully absorbed by already-landed code and only buglist verification remains.`

##### Human Context

- task_brief:
  - `Confirm buglist evidence and runtime handoff seams before implementation.`
- task_outcome_summary:
  - `dropped before execution because the operator redirected priority to encoding repair.`
- Purpose:
  - `Avoid fixing symptoms before identifying exactly where city/building locationAccess refusal is lost.`
- Failure mode:
  - `Starting broad editor picker or unrelated runtime changes before confirming the handoff boundary.`

#### `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.implementation`

##### Control Block

- task_id: `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.implementation`
- state: `pending`
- task_kind: `execution`
- scope:
  - `src/core/runtime/navigation-runtime.ts`
  - `src/core/contracts/runtime-result.ts`
  - `src/main.ts`
  - `src/application/runtime/city-house-transition-coordinator.ts`
  - `src/application/city/city-building-placement-resolver.ts`
  - `src/application/city/city-building-house-runtime-adapter.ts`
  - `src/application/location-access/location-access-runtime.ts`
  - `tests/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `existing refusal-focused tests`
  - `city/building normal entry regressions`
- must_modify:
  - `Only files required by the confirmed refusal handoff boundary.`
- must_preserve:
  - `normal city/building entry`
  - `EventBindingRuntime semantics`
  - `scenario-pack export/load/startup semantics`
- done_when:
  - `Failed city and building locationAccess checks surface refusal UI/dialogue.`
  - `Satisfied and no-condition paths still enter normally.`
  - `Focused tests and required verification pass.`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record blocker and do not widen scope without admission review.`
- promote_next_if_done: `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.queue-closeout-and-handoff`
- stop_if:
  - `Implementation would require broad condition picker repair rather than runtime handoff correction.`

##### Human Context

- task_brief:
  - `Implement refusal handoff correction test-first.`
- task_outcome_summary:
  - `pending`
- Purpose:
  - `Make runtime failed access checks visible and actionable in production flow.`
- Failure mode:
  - `Silently entering or losing refusal results after LocationAccessRuntime blocks entry.`

#### `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-location-access-refusal-runtime-handoff-correction.queue-closeout-and-handoff`
- state: `pending`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-location-access-refusal-runtime-handoff-correction-queue.md`
  - `tests/**`
- must_inspect:
  - `implementation task outcome`
  - `queue-specific guard evidence`
  - `version plan active_queue truth`
- must_not_change:
  - `Do not enter version closeout.`
  - `Do not reopen unrelated queues.`
- done_when:
  - `Guard review passes and the queue can return to version review lawfully.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to implementation verification or version review as required.`
- promote_next_if_done: `none`
- stop_if:
  - `Implementation verification is incomplete.`

##### Human Context

- task_brief:
  - `Verify the queue and return to version review without version closeout.`
- task_outcome_summary:
  - `pending`
- Purpose:
  - `Keep queue closeout separate from version closeout.`
- Failure mode:
  - `Closing the version instead of returning to review.`
