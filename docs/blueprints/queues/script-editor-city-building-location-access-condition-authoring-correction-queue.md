# Script Editor City Building Location Access Condition Authoring Correction Queue

## Control Block

- queue_id: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-20`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `active`
- queue_class: `required-priority`
- active_task: `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff`
- next_task: `none`
- closeout_status: `in-progress`
- execution_closeout_status: `partial`
- topic_closure_status: `open-residue`
- closure_basis: `Implementation has landed; queue closeout and version-review handoff remain open.`
- residue_remaining: `yes`
- residue_family: `same-family`
- residue_routing_status: `none`
- next_family_candidate: `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Implementation complete locally; queue closeout and handoff remain pending.`
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
  - `Correct Script Editor city and building 进入条件 authoring so the saved shape lowers into runtime-understandable locationAccess gates for city and building entry.`
- Admission basis:
  - `MEMO-014 was explicitly promoted by the operator after the current version remained open with no competing active queue.`
  - `The version plan now names this queue as the active execution target.`
- Forbidden expansions:
  - `Do not change EventBindingRuntime semantics.`
  - `Do not reopen the closed enter-state or background queues.`
  - `Do not absorb unrelated event-binding cleanup, map/review cleanup, or broad list/search UX work.`
  - `Do not widen beyond event/person/time condition authoring and runtime lowering evidence.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `confirmed`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-001`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-002`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-003`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-004`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-005`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-006`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-007`
- acceptance_not_claimed:
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-001`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-002`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-003`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-004`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-005`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-006`
  - `ACC-CITY-BUILDING-ACCESS-CONDITION-007`
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `ACC-CITY-BUILDING-ACCESS-CONDITION-001: City and building 进入条件 UI must put 拒绝提示 above the condition list, remove 拒绝事件/拒绝原因/引导说明/反馈角色, and expose only 事件/人物/时间 condition factors.`
- `ACC-CITY-BUILDING-ACCESS-CONDITION-002: 拒绝提示 must be a text-backed select that stores textId.`
- `ACC-CITY-BUILDING-ACCESS-CONDITION-003: Event conditions must select project.events and only support 完成/未完成.`
- `ACC-CITY-BUILDING-ACCESS-CONDITION-004: Person conditions must use 人物 -> 属性 -> 表达式 -> 值 selectors, sourcing base and custom attributes from the selected person with type-appropriate operators.`
- `ACC-CITY-BUILDING-ACCESS-CONDITION-005: Time conditions must use runtime-backed time field, expression, and value controls.`
- `ACC-CITY-BUILDING-ACCESS-CONDITION-006: Runtime export/load must lower each supported authoring factor into runtime-understandable locationAccess conditions, and production runtime must evaluate no-condition, satisfied, failed, and refusal-prompt cases.`
- `ACC-CITY-BUILDING-ACCESS-CONDITION-007: Simulated-human tests must run the full city and building case matrix separately and follow Blueprint multi-case test discipline before any completion claim.`

#### Cannot Claim

- `EventBindingRuntime behavior changes.`
- `Broad event-binding cleanup unrelated to city/building location access.`
- `Map/review provider boundary cleanup.`
- `Broad list/search/add/delete pagination UX work.`
- `Reopening the closed enter-state queue.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `src/application/location-access/**`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/core/runtime/navigation-runtime.ts`
  - `tests/**`
  - `browser simulated-human flow`
- Must modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `src/application/location-access/**`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/core/runtime/navigation-runtime.ts`
  - `tests/**`
- Must preserve:
  - `EventBindingRuntime semantics.`
  - `CityModule and BuildingModule entry contracts.`
  - `Scenario-pack export/load/startup semantics across normal start, JSON import, and runtime preview.`
  - `Existing city/building relations and background behavior.`

#### Verification Coverage

- `Focused tests for city/building location-access authoring, lowering, and runtime evaluation.`
- `Browser simulated-human flows for city entry conditions and building entry conditions, run separately.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Correct city and building location access authoring so supported conditions can be exported, loaded, evaluated, and simulated-human verified.`
- task_count: `3`
- completed_task_count: `2`
- remaining_task_count: `1`
- active_task_summary: `Verify the queue and return to version review without version closeout.`
- task_briefs:
  - `task.script-editor-city-building-location-access-condition-authoring-correction.evidence-anchor-reconcile: Confirm the admission basis, acceptance boundary, and runtime evidence before implementation.`
  - `task.script-editor-city-building-location-access-condition-authoring-correction.implementation: Implement supported city/building location access authoring and lowering test-first.`
  - `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff: Verify the queue and return to version review without version closeout.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-location-access-condition-authoring-correction.evidence-anchor-reconcile` | `completed` | `Confirm the admission basis, acceptance boundary, and runtime evidence before implementation.` | `none` | `Evidence anchor reconciled; admission boundary confirmed.` |
| `task.script-editor-city-building-location-access-condition-authoring-correction.implementation` | `completed` | `Implement supported city/building location access authoring and lowering test-first.` | `task.script-editor-city-building-location-access-condition-authoring-correction.evidence-anchor-reconcile` | `Implementation landed and verification passed.` |
| `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff` | `in_progress` | `Verify the queue and return to version review without version closeout.` | `task.script-editor-city-building-location-access-condition-authoring-correction.implementation` | `Queue closeout guard is now the active step.` |

### Task Definitions

#### `task.script-editor-city-building-location-access-condition-authoring-correction.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-location-access-condition-authoring-correction.evidence-anchor-reconcile`
- state: `completed`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/version-memo.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-location-access-condition-authoring-correction-queue.md`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `src/application/location-access/**`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/core/runtime/navigation-runtime.ts`
  - `tests/**`
- must_inspect:
  - `MEMO-014 requested capability`
  - `version plan admission truth`
  - `current locationAccess authoring/runtime evidence`
  - `city and building entry-condition UI shape`
- must_not_change:
  - `Do not implement feature code before the evidence anchor is confirmed.`
  - `Do not widen into event-binding cleanup or list/search normalization.`
- done_when:
  - `Evidence lock is confirmed and the queue boundary matches ACC-CITY-BUILDING-ACCESS-CONDITION-001..007.`
  - `The inspection set shows the correct authoring/runtime anchors for event/person/time locationAccess lowering.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review and record the blocker instead of widening scope.`
- promote_next_if_done: `task.script-editor-city-building-location-access-condition-authoring-correction.implementation`
- stop_if:
  - `Evidence shows a broader shared condition engine is required before this queue can lawfully begin implementation.`

##### Human Context

- task_brief:
  - `Confirm admission basis, acceptance boundary, and runtime evidence before implementation.`
- task_outcome_summary:
  - `completed`
- Purpose:
  - `Prevent the queue from widening beyond the city/building location access correction requested in MEMO-014.`
- Failure mode:
  - `Implementation starts before the supported authoring/runtime shape is confirmed.`

#### `task.script-editor-city-building-location-access-condition-authoring-correction.implementation`

##### Control Block

- task_id: `task.script-editor-city-building-location-access-condition-authoring-correction.implementation`
- state: `completed`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `src/application/location-access/**`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/core/runtime/navigation-runtime.ts`
  - `tests/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `current location access authoring surface`
  - `runtime export/load lowerings`
- must_modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/script-editor/**`
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `src/application/location-access/**`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `src/core/runtime/navigation-runtime.ts`
  - `tests/**`
- must_preserve:
  - `EventBindingRuntime semantics`
  - `CityModule and BuildingModule entry contracts`
  - `scenario-pack export/load/startup semantics`
  - `existing city/building relations and background behavior`
- done_when:
  - `The UI exposes only the intended city/building entry-condition factors and refusal prompt select.`
  - `Runtime lowering and runtime evaluation work for zero, satisfied, failed, and refusal cases.`
  - `Simulated-human city/building coverage passes under the Blueprint multi-case discipline.`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and keep the queue narrow.`
- promote_next_if_done: `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff`
- stop_if:
  - `event/person/time conditions require a broader shared condition engine change`
  - `runtime cannot interpret the supported authoring shape`

##### Human Context

- task_brief:
  - `Implement supported city/building location access authoring, runtime lowering, and verification test-first.`
- task_outcome_summary:
  - `completed`
- Purpose:
  - `Make city/building 进入条件 authoring match the supported runtime-understandable locationAccess condition shape.`
- Failure mode:
  - `The editor saves condition data that cannot be exported, loaded, or evaluated by production runtime.`

#### `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-location-access-condition-authoring-correction.queue-closeout-and-handoff`
- state: `in_progress`
- task_kind: `execution`
- scope:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/queues/script-editor-city-building-location-access-condition-authoring-correction-queue.md`
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
  - `Implementation verification is incomplete`

##### Human Context

- task_brief:
  - `Verify the queue and return to version review without version closeout.`
- task_outcome_summary:
  - `in_progress`
- Purpose:
  - `Keep the queue closeout and version review handoff separate from implementation.`
- Failure mode:
  - `Closing the version instead of returning to review.`
