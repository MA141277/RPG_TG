# City Building Module Entry And Project Startup Authoring Queue

## Control Block

- queue_id: `queue.city-building-module-entry-and-project-startup-authoring`
- belongs_to_version: `target.script-editor-event-runtime-production-hardening`
- blueprint_version: `2026.07`
- governance_last_synced_at: `2026-07-19`
- governance_sync_source: `docs/blueprints/plans/2026-07-18-script-editor-event-runtime-production-hardening-target-plan.md`
- queue_status: `blocked`
- queue_class: `future-target-candidate`
- active_task: `none`
- next_task: `none`
- admission_status: `not-admitted`
- closeout_status: `none`
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
- sync_summary: `Candidate queue recorded from the operator-approved city/building module and 项目信息 startup configuration draft. It is not admitted and must not start implementation until promotion/admission review records active queue truth.`
- blocked_by:
  - `admission-review`
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
  - `queue-candidate/future-target-candidate relative to the active event-runtime production-hardening version.`
  - `The scope may belong to a successor startup/module version or to the open map/review modularization version after admission review.`
- Forbidden expansions:
  - `Do not implement from this candidate record alone.`
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

### Proposed Queue Task Split

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.city-building-module-entry-and-project-startup-authoring.evidence-anchor-reconcile` | `candidate` | `Inspect existing project overview, scenarioProfile startup fields, city/building runtime entry paths, map provider boundary, and tests before admission/implementation.` | `admission-review` | `Must confirm current field names for role/person type and scene data source.` |
| `task.city-building-module-entry-and-project-startup-authoring.project-info-authoring` | `candidate` | `Add 项目信息 top-bar entry and project overview startup controls for start view, concrete target, role selection policy, and single default role.` | `evidence-anchor-reconcile` | `TDD required before UI implementation.` |
| `task.city-building-module-entry-and-project-startup-authoring.city-building-module-entry` | `candidate` | `Extract or formalize separate CityModule and BuildingModule entry/render/context contracts without forcing a map/city/building chain.` | `project-info-authoring` | `Must preserve existing city/building content and relations.` |
| `task.city-building-module-entry-and-project-startup-authoring.runtime-startup-convergence` | `candidate` | `Route normal start, JSON import, and Script Editor runtime preview through the same startup/module contracts.` | `city-building-module-entry` | `Must cover direct city/building/scene starts with and without character selection.` |
| `task.city-building-module-entry-and-project-startup-authoring.acceptance-and-guard` | `candidate` | `Run source guards and simulated-human acceptance proving the modules and startup controls work completely across supported entrypoints.` | `runtime-startup-convergence` | `Must record any unsupported path as a waiver, not success.` |

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
