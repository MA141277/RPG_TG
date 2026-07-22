# City Building Module Entry And Project Startup Authoring Target

## Control Block

- version_id: `target.city-building-module-entry-and-project-startup-authoring`
- version_label: `City/building module entry and project startup authoring`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Make city and building runtime entry behavior available through separate module boundaries, and expose Script Editor 项目信息 startup authoring so creators can start from map, city, building, or scene without assuming a fixed character-selection -> map -> city -> building chain.`

### Version Draft Summary

- Goal:
  - `Promote the operator-approved 项目信息 startup authoring and city/building module draft into a governed implementation target.`
- Required outcomes:
  - `Script Editor top navigation has a single 项目信息 entry that opens 项目总览.`
  - `项目总览 owns 开局视图, 角色选择策略, and single-select 默认角色 configuration.`
  - `开局视图 can choose 地图, 城市, 建筑, or 场景.`
  - `城市/建筑/场景 startup choices require concrete target selectors backed by project data and store stable ids.`
  - `默认角色 is single-select and sourced from people records whose authoring type/category is 角色.`
  - `CityModule and BuildingModule are separate reusable runtime entry/render/context boundaries.`
  - `Normal start, JSON runtime pack import, and Script Editor runtime preview use the same startup/module contracts.`
  - `Simulated-human acceptance proves supported startup paths and module entry behavior, including direct city and direct building starts.`
- Explicit non-goals:
  - `Do not reopen closed event-binding replacement, post-closeout fixup, or city/building definition convergence versions.`
  - `Do not change EventBindingRuntime semantics.`
  - `Do not remove city/building/person relation authoring.`
  - `Do not narrow existing map, city, building, or scene functionality just to satisfy a smaller acceptance path.`
  - `Do not merge city and building into one module; they must be separate module boundaries.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.city-building-module-entry-and-project-startup-authoring` | `required` | `startup authoring plus city/building module entry convergence` | `Admit first because it owns evidence review, project overview controls, module boundary extraction, startup convergence, and simulated-human acceptance for the approved draft.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-CITY-BUILDING-STARTUP-001` | `项目信息 is a top-bar Script Editor entry and opens 项目总览.` | `queue.city-building-module-entry-and-project-startup-authoring` | `UI test + simulated-human` | `src/application/script-editor/workspace-shell.ts; Script Editor workspace view/actions` | `Project overview remains unreachable after navigating away from it.` |
| `ACC-CITY-BUILDING-STARTUP-002` | `项目总览 exposes 开局视图, concrete city/building/scene target selectors, 角色选择策略, and single-select 默认角色.` | `queue.city-building-module-entry-and-project-startup-authoring` | `unit/UI tests + simulated-human` | `src/domain/script-editor-project.ts; workspace shell; runtime export/import` | `City/building startup can be saved without selecting a concrete target, or 默认角色 is not constrained to role people.` |
| `ACC-CITY-BUILDING-STARTUP-003` | `CityModule and BuildingModule provide separate reusable entry/render/context seams without requiring the full map/city/building chain.` | `queue.city-building-module-entry-and-project-startup-authoring` | `source guard + tests` | `city runtime/presenter/view modules; building runtime/presenter/view modules; startup routing` | `Direct city/building entry still depends on one-off main.ts branches or a mandatory map path.` |
| `ACC-CITY-BUILDING-STARTUP-004` | `Normal start, JSON runtime pack import, and Script Editor runtime preview share startup/module contracts.` | `queue.city-building-module-entry-and-project-startup-authoring` | `automated integration + simulated-human` | `startup coordinator; scenario loader; runtime preview path` | `One entrypoint works through a private shortcut that other entrypoints do not use.` |
| `ACC-CITY-BUILDING-STARTUP-005` | `Completeness review proves behavior was not over-narrowed and existing city/building/map/scene capabilities still work where supported.` | `queue.city-building-module-entry-and-project-startup-authoring` | `guard review + browser acceptance` | `tests/**; browser/simulated-human flow` | `Tests pass only because supported functionality was hidden, deleted, or silently waived.` |

### Acceptance Criteria

- `The version may close only after every acceptance id is covered, blocked, or explicitly waived with reason.`
- `Browser/simulated-human evidence must distinguish editor authoring success from runtime startup success.`
- `Fail-closed diagnostics are not runtime support.`
- `Final validation must run npm run typecheck, npm run lint:blueprints, and npm test.`
