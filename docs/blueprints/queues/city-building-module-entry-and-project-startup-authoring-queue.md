# City Building Module Entry And Project Startup Authoring Queue

## Control Block

- queue_id: `queue.city-building-module-entry-and-project-startup-authoring`
- belongs_to_version: `target.city-building-module-entry-and-project-startup-authoring`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-19`
- governance_sync_source: `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
- queue_status: `active`
- queue_class: `future-target-candidate`
- active_task: `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard`
- next_task: `none`
- admission_status: `admitted`
- closeout_status: `not-started`
- execution_closeout_status: `blocked`
- topic_closure_status: `blocked`
- closure_basis: `none`
- residue_remaining: `unknown`
- residue_family: `cross-family`
- residue_routing_status: `needs-version-review`
- next_family_candidate: `none`
- auto_continue_eligible: `false`
- next_effect: `return-to-version-review`
- sync_status: `pending`
- sync_scope: `local-record`
- sync_summary: `Queue admitted locally as the active queue under target.city-building-module-entry-and-project-startup-authoring. Repository sync remains separate.`
- blocked_by: []
- allowed_item_classifications:
  - `queue-candidate`
  - `future-target-candidate`
- reject_item_classifications:
  - `content-pipeline-item`
  - `asset-pipeline-item`

## Human Context

### Queue Explanation

- Goal:
  - `Add a Script Editor top-bar 项目信息 entry for project overview/startup authoring and extract city/building runtime entry behavior into separate reusable modules that support flexible game starts.`
- Design basis:
  - `The operator approved a requirement draft stating that runtime startup must not require the fixed 角色选择 -> 地图 -> 城市 -> 建筑 chain.`
  - `Only 项目信息 is a top-bar entry; 开局视图, 角色选择策略, 默认角色, and concrete target selectors live inside 项目信息 / 项目总览.`
  - `默认角色 is single-select and comes from people records whose authoring type is 角色.`
- Classification:
  - `admitted required queue under target.city-building-module-entry-and-project-startup-authoring.`
  - `The scope was promoted from the prior event-runtime hardening candidate record into this successor startup/module version.`
- Forbidden expansions:
  - `Do not implement before evidence-anchor reconcile completes.`
  - `Do not reopen closed event-binding replacement or post-closeout fixup versions.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not remove city/building/event relation authoring while extracting runtime entry modules.`
  - `Do not narrow startup behavior to the smallest happy path just to pass tests.`

### Requested Capability

- `Script Editor top navigation includes 项目信息 as the single entry back to the project overview.`
- `项目总览 exposes 开局视图 with options 地图, 城市, 建筑, 场景.`
- `When 开局视图 is 城市, the creator must choose a concrete city from project.cities.`
- `When 开局视图 is 建筑, the creator must choose a concrete building from project.buildings.`
- `When 开局视图 is 场景, the creator must choose a concrete scene from the project scene data source.`
- `角色选择策略 controls whether startup shows character selection.`
- `默认角色 is a single-select control populated from people whose type/category is 角色.`
- `If character selection is disabled, runtime starts directly with the 默认角色 and configured startup target.`
- `City runtime behavior is exposed through a CityModule entry contract.`
- `Building runtime behavior is exposed through a BuildingModule entry contract.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview use the same startup/module contracts.`

### Queue Snapshot

- queue_goal: `Add 项目信息 startup authoring and converge city/building runtime entry behavior behind separate reusable modules without requiring a fixed startup chain.`
- task_count: `5`
- completed_task_count: `4`
- remaining_task_count: `1`
- active_task_summary: `Run source guards and simulated-human acceptance proving the modules and startup controls work completely across supported entrypoints.`
- task_briefs:
  - `task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile: inspect source facts, split risks, current startup fields, and implementation anchors before business changes.`
  - `task.city-building-module-entry-and-project-startup-authoring.project-info-authoring: TDD 项目信息 top-bar entry and project overview startup controls.`
  - `task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry: formalize separate CityModule and BuildingModule entry/render/context boundaries.`
  - `task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence: route normal start, JSON import, and Script Editor runtime preview through shared startup/module contracts.`
  - `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard: source guards and simulated-human acceptance across supported entrypoints.`

### Task Ledger

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile` | `done` | `Confirmed existing project overview, scenarioProfile startup fields, city/building runtime entry paths, map provider boundary, and tests before implementation.` | `none` | `No prerequisite split required before project-info-authoring.` |
| `task.city-building-module-entry-and-project-startup-authoring.project-info-authoring` | `done` | `Added 项目信息 top-bar entry and project overview startup controls for start view, concrete target, role selection policy, and single default role.` | `task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile` | `Verification passed on 2026-07-19.` |
| `task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry` | `done` | `Extracted/formalized separate CityModule and BuildingModule entry/render/context contracts without forcing a map/city/building chain.` | `task.city-building-module-entry-and-project-startup-authoring.project-info-authoring` | `Verification passed on 2026-07-19.` |
| `task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence` | `done` | `Route normal start, JSON import, and Script Editor runtime preview through the same startup/module contracts.` | `task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry` | `Completed with direct startup target resolution for map/city/house/scene and sceneId export/load preservation.` |
| `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard` | `active` | `Run source guards and simulated-human acceptance proving the modules and startup controls work completely across supported entrypoints.` | `task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence` | `Must record any unsupported path as a waiver, not success.` |

### Task Definitions

#### `task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile`

##### Control Block

- task_id: `task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile`
- state: `done`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/specs/2026-07-19-city-building-module-entry-and-project-startup-authoring-target.md`
  - `docs/blueprints/plans/2026-07-19-city-building-module-entry-and-project-startup-authoring-target-plan.md`
  - `src/application/script-editor/workspace-shell.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `src/application/scenario/scenario-pack-loader.ts`
  - `startup coordinator and runtime entry modules`
  - `city runtime/presenter/view modules`
  - `building runtime/presenter/view modules`
  - `tests/**`
- must_inspect:
  - `current 项目总览 and Script Editor navigation structure`
  - `existing scenarioProfile launchPolicy and initialLocation fields`
  - `role/person authoring type field names and default character persistence`
  - `normal start, JSON import, and runtime preview startup seams`
  - `city and building entry/render/context ownership`
  - `existing simulated-human/browser test anchors`
- must_not_change:
  - `Do not implement business code during evidence-anchor reconcile.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not remove city/building/person relation authoring.`
- done_when:
  - `Evidence lock is recorded or the queue records a split/blocker.`
  - `Implementation anchors and TDD approach are confirmed.`
  - `Supported startup paths and unsupported/waived paths are listed.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Return to version review or split prerequisite queue.`
- promote_next_if_done: `task.city-building-module-entry-and-project-startup-authoring.project-info-authoring`

##### Human Context

- task_brief:
  - `Lock startup authoring and city/building module evidence before implementation.`
- task_outcome_summary:
  - `Completed on 2026-07-19. Source review confirmed Script Editor already has a project overview surface and scenarioProfile launchPolicy/initialLocation fields, but creator UI still exposes startup values mainly as text/system fields rather than project-info selectors. ScenarioProfile supports characterSelection shell/fixed, initialView, playerCharacterId, mapId, cityId, houseId, and view; ViewName uses house for the runtime building view. Default role sourcing should filter ScriptEditorPersonRecord.personType == 角色. Normal start, JSON import, and runtime preview all route through scenario pack export/load/startup seams. Runtime preview uses current in-memory project export. No prerequisite split is required before project-info-authoring.`

#### `task.city-building-module-entry-and-project-startup-authoring.project-info-authoring`

##### Control Block

- task_id: `task.city-building-module-entry-and-project-startup-authoring.project-info-authoring`
- state: `done`
- task_kind: `execution`
- scope:
  - `src/application/script-editor/workspace-shell.ts`
  - `src/domain/script-editor-project.ts`
  - `src/application/script-editor/runtime-pack-export.ts`
  - `tests/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `current project overview and navigation actions`
- must_modify:
  - `tests/**`
  - `Script Editor project overview/navigation files proven necessary by evidence-anchor reconcile`
- must_preserve:
  - `existing project package save/load semantics`
  - `city/building/person relation authoring`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry`

##### Human Context

- task_brief:
  - `Implement 项目信息 top-bar entry and project overview startup authoring controls using TDD.`
- task_outcome_summary:
  - `Completed on 2026-07-19. RED covered the 项目信息 toolbar entry, project-backed startup selectors, default role filtering from personType == 角色, and the initialView selector writing both launchPolicy.initialView and initialLocation.view for runtime export compatibility. GREEN added the 项目信息 action, selector-backed project overview startup controls, and multi-field startup mapping. Verification passed: focused robustness test, npm run typecheck, npm run lint:blueprints, and npm test.`

#### `task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry`

##### Control Block

- task_id: `task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry`
- state: `done`
- task_kind: `execution`
- scope:
  - `city runtime/presenter/view modules`
  - `building runtime/presenter/view modules`
  - `startup routing seams`
  - `tests/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `existing city and building entry/render/context ownership`
- must_modify:
  - `tests/**`
  - `city/building runtime module files proven necessary by evidence-anchor reconcile`
- must_preserve:
  - `map provider contract`
  - `review provider contract`
  - `EventBindingRuntime semantics`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence`

##### Human Context

- task_brief:
  - `Formalize separate CityModule and BuildingModule entry/render/context boundaries.`
- task_outcome_summary:
  - `Completed on 2026-07-19. RED required separate city and building entry/render seams. GREEN added application/city/city-module-entry.ts, application/building/building-module-entry.ts, ui/views/city/city-module-view.ts, and ui/views/building/building-module-view.ts, then routed stage-presenters and app-render through them while preserving existing city, city-underlay, and house-module behavior. Verification passed: focused robustness tests, npm run typecheck, npm run lint:blueprints, and npm test.`

#### `task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence`

##### Control Block

- task_id: `task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence`
- state: `done`
- task_kind: `execution`
- scope:
  - `startup coordinator`
  - `scenario loader`
  - `Script Editor runtime preview path`
  - `normal start and JSON import paths`
  - `tests/**`
- must_inspect:
  - `evidence-anchor reconcile outcome`
  - `implemented project startup controls and module entry seams`
- must_modify:
  - `tests/**`
  - `startup/runtime entry files proven necessary by prior tasks`
- must_preserve:
  - `same runtime pack loader semantics across entrypoints`
  - `existing supported map/city/building/scene behavior`
- verify_with:
  - `focused tests`
  - `npm run typecheck`
  - `npm run lint:blueprints`
  - `npm test`
- promote_next_if_done: `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard`

##### Human Context

- task_brief:
  - `Route normal start, JSON import, and Script Editor runtime preview through shared startup/module contracts.`
- task_outcome_summary:
  - `Completed on 2026-07-19. RED covered scenario profile export/loader preservation for concrete scene startup targets and shared startup target resolution for direct map, city, house, and scene starts. GREEN added application/startup/scenario-startup-target.ts, preserved optional initialLocation.sceneId through runtime export and scenario loader validation, and routed main.ts scenario app-state creation through the shared resolver so direct house starts keep houseId and direct scene starts set activeSceneId. Verification passed: focused tests, npm run typecheck, npm run lint:blueprints, and npm test. Active task is now acceptance-and-guard.`

#### `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard`

##### Control Block

- task_id: `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard`
- state: `pending`
- task_kind: `decision-dispatch`
- scope:
  - `docs/blueprints/queues/city-building-module-entry-and-project-startup-authoring-queue.md`
  - `tests/**`
  - `browser/simulated-human acceptance evidence`
- must_inspect:
  - `all ACC-CITY-BUILDING-STARTUP acceptance ids`
  - `source guard results`
  - `normal start, JSON import, and Script Editor runtime preview behavior`
- must_not_change:
  - `Do not enter version closeout from queue closeout.`
  - `Do not claim unsupported entrypoints as runtime support.`
- done_when:
  - `Guard review classifies each acceptance id as covered, blocked, or waived with reason.`
  - `Queue state is synchronized to done or blocked.`
- verify_with:
  - `npm run lint:blueprints`
- if_blocked:
  - `Record the blocker and return to version review.`

##### Human Context

- task_brief:
  - `Close out the queue with source guards, simulated-human acceptance, and handoff.`
- task_outcome_summary:
  - `pending`

### Acceptance Requirements

- `项目信息 is visible in the Script Editor top navigation and opens 项目总览.`
- `开局视图 can be set to 地图, 城市, 建筑, or 场景.`
- `城市 start requires a concrete city selector backed by project.cities and stores city.id.`
- `建筑 start requires a concrete building selector backed by project.buildings and stores building.id.`
- `场景 start requires a concrete scene selector backed by project scene data and stores scene id.`
- `默认角色 is single-select, sourced from people records of type 角色, and stores the selected person id.`
- `Character selection can be enabled or disabled by project startup policy.`
- `With character selection disabled, runtime starts directly from the configured default role and startup target.`
- `CityModule supports direct entry, background, city information, menus, character/person panels, and building entry without requiring map presence.`
- `BuildingModule supports direct entry, background, building information, menus, and character/person panels without requiring city or map presence.`
- `Normal start, JSON runtime pack import, and Script Editor runtime preview preserve equivalent behavior.`
- `Source guards prove map/city/building/scene startup does not regress into hardcoded one-off entry branches.`
- `Simulated-human tests cover project startup authoring and runtime entry for map, city, building, and scene, both with and without character selection where supported.`
- `Completeness review rejects an implementation that passes by removing supported behavior or narrowing the feature to only one entry path.`

### Verification Evidence Required For Closure

- `focused tests`
- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- `in-app-browser or equivalent simulated-human Script Editor flow for 项目信息 startup authoring`
- `runtime simulated-human flow for normal start, JSON import, and Script Editor runtime preview`
- `source guard confirming CityModule and BuildingModule are separate module boundaries`
- `source guard confirming relations for 人物 / 城市 / 建筑 are preserved outside destination/startup family cleanup`
