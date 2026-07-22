# Script Editor City Building Background Authoring Queue

## Control Block

- queue_id: `queue.script-editor-city-building-background-authoring`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-19`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `done`
- queue_class: `future-target-candidate`
- active_task: `none`
- next_task: `none`
- closeout_status: `done`
- execution_closeout_status: `done`
- topic_closure_status: `closed`
- closure_basis: `bounded source guard, automated verification, and browser simulated-human evidence for Script Editor background controls`
- residue_remaining: `no`
- residue_family: `none`
- residue_routing_status: `none`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `none`
- sync_status: `success`
- sync_scope: `branch-push`
- sync_summary: `Committed and pushed to origin/mod-first-dev as 180ba5ea.`
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
  - `Let creators configure city and building background references in Script Editor and preserve those references through project save, runtime export, JSON import, normal start, and runtime preview.`
- Forbidden expansions:
  - `Do not build a full asset library unless evidence proves it is a prerequisite for stable background references.`
  - `Do not redesign city or building presentation modules beyond consuming the configured background data.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not mix this queue with preview layout edit mode or broader UI layout asset work.`

### Evidence Lock

- evidence_lock_status: `locked`
- implementation_anchor_status: `locked`
- prerequisite_status: `ready`
- acceptance_claim_scope:
  - `ACC-CITY-BUILDING-BACKGROUND-001`
  - `ACC-CITY-BUILDING-BACKGROUND-002`
  - `ACC-CITY-BUILDING-BACKGROUND-003`
  - `ACC-CITY-BUILDING-BACKGROUND-004`
  - `ACC-CITY-BUILDING-BACKGROUND-005`
- acceptance_not_claimed: []
- minimum_verification:
  - `npm run lint:blueprints`

### Claim Boundary

#### Can Claim

- `Script Editor exposes creator-facing city and building background reference controls.`
- `Project save/load preserves configured city and building background references.`
- `Runtime export/import preserves configured city and building background references.`
- `Supported runtime entrypoints consume configured backgrounds without hardcoded per-screen fallback ownership.`

#### Cannot Claim

- `A complete project asset library.`
- `Preview layout editing.`
- `A repository-wide asset pipeline migration.`
- `EventBindingRuntime behavior changes.`

#### Legacy Paths To Replace

- `City or building background behavior that depends only on hardcoded built-in screen defaults.`
- `Creator-facing background fields that do not persist through runtime export/import.`
- `Runtime preview behavior that differs from normal JSON runtime pack startup for city/building backgrounds.`

#### Compatibility Paths To Preserve

- `Existing city and building module entry contracts.`
- `Existing default backgrounds when no creator background is configured.`
- `Existing scenario pack load/startup semantics.`
- `Existing city/building enter-state and locationAccess behavior.`

#### Implementation Anchors

- Must inspect:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/editor-project-save.ts`
  - `src/application/script-editor/editor-project-loader.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/script-editor/runtime-pack-import.ts`
  - `src/ui/views/city/**`
  - `src/ui/views/building/**`
  - `tests/**`
- Must modify:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/**`
  - `src/domain/**`
  - `tests/**`
  - `docs/blueprints/**`
- Must preserve:
  - `EventBindingRuntime semantics.`
  - `CityModule and BuildingModule entry seams.`
  - `LocationAccessRuntime gate semantics.`

#### Verification Coverage

- `Focused tests for city/building background authoring save/load and runtime export/import.`
- `Source guard proving runtime rendering consumes configured background references.`
- `Browser simulated-human Script Editor check for city and building background controls.`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`

### Parent Version

- Version spec:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
- Version plan:
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`

### Queue Snapshot

- queue_goal: `Add bounded city/building background authoring and runtime consumption through existing project/runtime pack paths.`
- task_count: `3`
- completed_task_count: `3`
- remaining_task_count: `0`
- active_task_summary: `none`
- task_briefs:
  - `task.script-editor-city-building-background-authoring.evidence-anchor-reconcile: Confirm existing background fields, export/import behavior, and runtime consumption gaps.`
  - `task.script-editor-city-building-background-authoring.implementation: Implement bounded background authoring and runtime consumption test-first.`
  - `task.script-editor-city-building-background-authoring.queue-closeout-and-handoff: Verify the queue and return to version review without version closeout.`

### Operator Snapshot Contract

- `The fixed operator receipt must source current queue from queue_id.`
- `The fixed operator receipt must source current task from active_task.`
- `The fixed operator receipt must source current queue goal from queue_goal.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.script-editor-city-building-background-authoring.evidence-anchor-reconcile` | `done` | `Confirm existing background fields, export/import behavior, and runtime consumption gaps.` | `none` | `Locked on 2026-07-19. Script Editor already exposes backgroundId controls and save/export/import tests, but city/building runtime views do not consume configured backgroundId values.` |
| `task.script-editor-city-building-background-authoring.implementation` | `done` | `Implement bounded background authoring and runtime consumption test-first.` | `task.script-editor-city-building-background-authoring.evidence-anchor-reconcile` | `Completed on 2026-07-19. RED focused test failed on missing runtime consumption; GREEN routes city and fallback building views through configured background ids while preserving default fallback behavior.` |
| `task.script-editor-city-building-background-authoring.queue-closeout-and-handoff` | `done` | `Verify the queue and return to version review without version closeout.` | `task.script-editor-city-building-background-authoring.implementation` | `Completed on 2026-07-19. Guard review passed for background authoring controls, save/load, runtime export/import, runtime view consumption, default fallback preservation, and runtime semantics preservation. Browser simulated-human evidence verified city and building default background selects and a building background selection change.` |

### Task Definitions

#### `task.script-editor-city-building-background-authoring.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.script-editor-city-building-background-authoring.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/**`
  - `src/domain/script-editor-project.ts`
  - `src/ui/views/city/**`
  - `src/ui/views/building/**`
  - `tests/**`
- must_inspect:
  - `existing city and building background fields`
  - `project save/load preservation`
  - `runtime pack export/import preservation`
  - `normal/json/preview runtime consumption path`
- must_not_change:
  - `Do not implement before evidence_lock_status is locked.`
  - `Do not widen into preview layout editing or a full asset library.`
- done_when:
  - `Evidence Lock is locked or the queue is blocked with a concrete reason.`
  - `Implementation anchors and acceptance scope remain bounded to city/building background authoring.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split a prerequisite queue.`
- promote_next_if_done: `task.script-editor-city-building-background-authoring.implementation`

##### Human Context

- task_brief:
  - `Confirm the background authoring and runtime data path before implementation.`
- task_outcome_summary:
  - `Evidence confirms existing city/building backgroundId authoring controls, normalization, materialization, runtime export, and runtime import coverage. The remaining gap is runtime rendering: city-view.ts still uses a fixed city.mp4 background, and building-module-view.ts fallback rendering does not consume HouseDefinition.backgroundId.`

#### `task.script-editor-city-building-background-authoring.implementation`

##### Control Block

- task_id: `task.script-editor-city-building-background-authoring.implementation`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/application/script-editor/**`
  - `src/domain/**`
  - `tests/**`
  - `docs/blueprints/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `existing city/building module rendering`
  - `existing script-editor save/export tests`
- must_modify:
  - `tests/**`
  - `src/**`
  - `docs/blueprints/**`
- must_preserve:
  - `EventBindingRuntime semantics`
  - `LocationAccessRuntime gate semantics`
  - `existing default background fallback behavior when no creator value is configured`
- must_not_change:
  - `preview layout editing`
  - `full project asset library`
  - `unrelated city/building gameplay behavior`
- done_when:
  - `Focused tests fail before implementation and pass after implementation.`
  - `City and building configured background references save/load/export/import and are consumed at runtime.`
  - `Required verification passes.`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- if_blocked:
  - `Record the blocker and do not claim coverage by narrowing away runtime entrypoints.`
- promote_next_if_done: `task.script-editor-city-building-background-authoring.queue-closeout-and-handoff`

##### Human Context

- task_brief:
  - `Implement bounded city/building background authoring and runtime consumption test-first.`
- task_outcome_summary:
  - `RED added a runtime-view source guard for configured city/building background id consumption and failed before implementation because city-view.ts did not use resolveLocationBackgroundImageUrl. GREEN added configured city background rendering with the existing city.mp4 fallback, routed the fallback building view through HouseDefinition.backgroundId, and added CSS coverage for the configured city background layer. Verification passed: focused test, npm run typecheck, npm run lint:blueprints, and npm test.`

#### `task.script-editor-city-building-background-authoring.queue-closeout-and-handoff`

##### Control Block

- task_id: `task.script-editor-city-building-background-authoring.queue-closeout-and-handoff`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/script-editor-city-building-background-authoring-queue.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `docs/blueprints/project-progress.md`
  - `tests/**`
- must_inspect:
  - `implementation task outcome`
  - `verification output`
  - `browser simulated-human evidence`
- must_not_change:
  - `version closeout`
  - `EventBindingRuntime semantics`
- done_when:
  - `Queue closeout records bounded background coverage or explicit blockers.`
  - `Blueprint lint passes.`
  - `Version review remains separate unless explicitly requested.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker in queue and version truth.`
- promote_next_if_done: `version-promotion-review`

##### Human Context

- task_brief:
  - `Verify the background authoring slice and return to version review without automatic version closeout.`
- task_outcome_summary:
  - `Queue closed after source guard, automated verification, and browser simulated-human evidence. Browser evidence verified the built-in Script Editor template workspace, city default-background select options, building default-background select options, and selecting building background value zizhai without saving to disk. The closeout does not enter version closeout.`
