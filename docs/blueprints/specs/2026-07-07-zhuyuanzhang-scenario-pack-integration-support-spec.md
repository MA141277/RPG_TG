# Zhuyuanzhang Scenario-Pack Integration Support Spec

## Control Block

- spec_id: `spec.zhuyuanzhang-scenario-pack-integration`
- document_role: `supporting-spec`
- belongs_to_version: `target.project-complete-modularization`
- contract_version: `v1`
- execution_authority: `none`

## Human Context

### Role In Blueprint

- `This document is a version-supporting integration contract under the current complete-modularization version.`
- `It does not replace project-progress, blueprint, version-plan, or queue truth.`
- `It must not be treated as live execution authority.`
- `Its purpose is to freeze the correct scenario-pack end state for zhuyuanzhang so later same-version queue admission, implementation, and verification can reuse one stable contract instead of rediscovering the package boundary each time.`

### Goal

- `Convert zhuyuanzhang into a reliable first-party scenario-pack whose runtime-owned story data, task data, text data, and pack-exclusive visual resources live inside one canonical package structure.`
- `Keep shared framework/UI baseline resources outside the scenario-pack so package ownership stays aligned with the repository's mod-first architecture claim.`

### Scope

- `zhuyuanzhang runtime-owned scenario data under src/content/scenario-packs/zhuyuanzhang/**`
- `pack-exclusive story/event/task/text/resource structure for the zhuyuanzhang production path`
- `migration rules for zhuyuanzhang-exclusive images that are still consumed from legacy paths`
- `validation rules proving zhuyuanzhang can act as a canonical scenario-pack without pack-specific TypeScript assembly`

### Non-Goals

- `moving shared UI baseline, shared layout-editor baseline, or builtin framework skins into the zhuyuanzhang package`
- `redesigning audio/animation contracts for the whole repository in this document`
- `rewriting house-module runtime ownership rules that already belong to shared runtime contracts`
- `changing active queue truth or using this support spec as implementation authorization by itself`

### Current-State Audit

- `The repository already treats scenario-pack as the canonical content entry shape: pack.json points to split JSON tables, and content-pack/scenario-pack loaders already resolve pack-relative asset paths.`
- `zhuyuanzhang already owns pack-local map assets and pack-local data tables, so the package boundary is partially real today rather than hypothetical.`
- `The active content path already merges textEntries, maps, cityPortraits, and other pack data through shared active-content assembly.`
- `The main runtime path still keeps shared UI/layout baseline outside the scenario-pack, and Blueprint closeout truth already classifies that residue as framework/editor baseline instead of zhuyuanzhang-owned package truth.`
- `Some zhuyuanzhang-exclusive runtime assets may still remain outside src/content/scenario-packs/zhuyuanzhang/** on legacy paths; those are in scope only when runtime evidence proves they are pack-exclusive rather than shared framework assets.`

### Integration Principles

1. `One scenario-pack, one canonical package root: zhuyuanzhang runtime-owned scenario truth must resolve from src/content/scenario-packs/zhuyuanzhang/.`
2. `Data drives story: trigger logic, scene flow, task flow, text, and package-exclusive visual references must come from JSON tables rather than pack-specific TypeScript branching.`
3. `Shared runtime, not shared drift: zhuyuanzhang must load through the same shared loader/runtime path used by other built-in or imported packs.`
4. `Shared UI stays shared: framework-owned layout/button/panel baseline is not package truth and must not be copied into zhuyuanzhang just to make the package look self-contained.`
5. `Relative paths first, ids where indirection pays off: map-like assets may continue to use pack-relative paths; scene/task-facing visual resources should converge on stable asset ids backed by one pack-local registry table.`

### Canonical Package Layout

```text
src/content/scenario-packs/zhuyuanzhang/
  pack.json
  scenario-profile.json
  events.json
  scenes.json
  tasks.json
  characters.json
  maps.json
  cities.json
  houses.json
  city-entries.json
  activities.json
  city-npc-pools.json
  house-access-refusal-rules.json
  text-entries.json
  city-portraits.json
  historical-characters.json
  historical-city-rosters.json
  historical-character-id-map.json
  assets/
    maps/
    cg/
    portraits/
    houses/
    playables/
```

Optional after shared-contract upgrade:

```text
  visual-assets.json
```

### Package Main/Sub-Table Model

#### Package Master Table

- `pack.json`
  - `Role: the only catalog/loader entry file for zhuyuanzhang.`
  - `Owns: schemaVersion, kind, pack id, title, description, and the authoritative files registry.`
  - `Must not own: scene prose, task prose, direct runtime logic, or duplicated asset metadata already held by subordinate tables.`

Recommended files registry:

```json
{
  "schemaVersion": 1,
  "kind": "scenario-pack",
  "id": "scenario-pack.zhu_yuanzhang.monk_opening",
  "title": "Zhu Yuanzhang Opening",
  "files": {
    "scenarioProfile": "scenario-profile.json",
    "characters": "characters.json",
    "events": "events.json",
    "scenes": "scenes.json",
    "tasks": "tasks.json",
    "maps": "maps.json",
    "cities": "cities.json",
    "houses": "houses.json",
    "cityEntries": "city-entries.json",
    "textEntries": "text-entries.json",
    "activities": "activities.json",
    "cityNpcPools": "city-npc-pools.json",
    "houseAccessRefusalRules": "house-access-refusal-rules.json",
    "cityPortraits": "city-portraits.json",
    "historicalCharacters": "historical-characters.json",
    "historicalCityRosters": "historical-city-rosters.json",
    "historicalCharacterIdByCharacterId": "historical-character-id-map.json"
  }
}
```

Extension after shared-contract upgrade:

```json
{
  "files": {
    "visualAssets": "visual-assets.json"
  }
}
```

#### Story Runtime Master Tables

| Table | Role | Owns | Must Not Own |
| --- | --- | --- | --- |
| `scenario-profile.json` | package entry profile | player start, initial location/view/scene/task, initial flags/variables | scene prose, task prose, ad hoc runtime branches |
| `events.json` | trigger/routing master table | trigger kind, conditions, once/priority, entrySceneId, event effects | long dialogue, duplicated text, asset file paths |
| `scenes.json` | story presentation master table | node graph, speaker/text references, choices, scene-local effects, completion routing | trigger timing policy, duplicated task state logic, repeated image paths |
| `tasks.json` | task/progression master table | status flow, objectives, completion/failure conditions, rewards/effects, event/scene linkage | long dialogue, scene node graph, duplicated UI copy |

#### World Structure Master Tables

| Table | Role | Owns | Must Not Own |
| --- | --- | --- | --- |
| `characters.json` | scenario-owned character truth | character ids, static identity, package-owned scenario fields | large scene prose or event trigger logic |
| `maps.json` | map truth | map definitions, map-relative image fields, nodes, layers | duplicated city/house prose or scene text |
| `cities.json` | city truth | city definitions, runtime-owned city fields | direct portrait file paths once cityPortraits and any later shared visual-assets support cover them |
| `houses.json` | house truth | house ids, ownership/location/module linkage, package-owned house metadata | scene dialogue or pack-specific runtime branching |

#### Reference/Subordinate Tables

| Table | Role | Notes |
| --- | --- | --- |
| `text-entries.json` | canonical text registry | `events/scenes` should prefer `textId` where the active runtime already supports it; `tasks` complete that migration only after shared task-contract support exists. |
| `city-portraits.json` | city portrait mapping | May remain a simple cityId -> path mapping during transition; long-term it may point to visual asset ids once shared contracts support that registry. |
| `city-entries.json` | city menu/entry data | Keeps city-entry configuration outside core city definitions. |
| `activities.json` | package activity data | Activity definitions consumed by shared runtime. |
| `city-npc-pools.json` | city NPC distribution data | Keeps city-local NPC roster logic data-driven. |
| `house-access-refusal-rules.json` | house-entry rule data | Keeps refusal copy/conditions out of house-module branching when package-owned. |
| `historical-characters.json` | historical reference data | Supplemental, not a story trigger owner. |
| `historical-city-rosters.json` | historical roster mapping | Supplemental, not a story trigger owner. |
| `historical-character-id-map.json` | id bridge table | Supplemental identity mapping only. |

Planned extension after shared-contract upgrade:

| Table | Role | Notes |
| --- | --- | --- |
| `visual-assets.json` | canonical pack-exclusive visual registry | Introduce only after shared scenario-pack/content-pack contracts, loaders, and validators recognize a `visualAssets` files key. |

### Detailed Table Ownership Rules

#### `events.json`

- `events.json` must answer: when should the runtime enter a story/system flow?`
- `Each event record should own: id, trigger, conditions, entrySceneId, once, priority, relatedTaskIds, and effects.`
- `events.json` must not inline long conversation text or image paths.`
- `If an event needs a title or prompt, it should reference text ids.`

#### `scenes.json`

- `scenes.json` must answer: how does the story present and branch once entered?`
- `Current compatible shape: keep SceneDefinition-compatible action arrays so the active runtime can still parse the package without a contract fork.`
- `Current compatible scene records should continue to own: id, name, and actions.`
- `Dialogue, narration, and choice copy should resolve through text ids wherever migration has already externalized prose.`
- `Current package-exclusive image references must stay on fields that the active runtime already understands, or remain on pack-relative paths consumed by existing seams.`
- `Desired shape after shared contract migration: a scene graph with entry node ownership, richer node metadata, and stable visual asset references may replace today's flat actions array.`
- `scenes.json` is the primary owner for dialogue/story flow; events and tasks may reference scenes, but they must not duplicate scene graphs or action lists.`

#### `tasks.json`

- `tasks.json` must answer: what progress contract does the player need to satisfy?`
- `Current compatible shape: keep TaskDefinition-compatible fields so the active runtime can still parse title/description/objective/effect data without a contract fork.`
- `Current package records should continue to own: id, title, description, objectives, start/completion/failure conditions, and task effects.`
- `Desired shape after shared contract migration: titleTextId/descriptionTextId plus explicit scene/event linkage may replace direct title/description strings once shared task contracts and task consumers are upgraded together.`
- `tasks.json` must not become a hidden story table; if a task needs story delivery, it should route through events/scenes.`

#### `text-entries.json`

- `text-entries.json` is the only canonical registry for zhuyuanzhang display prose once migration completes.`
- `Scene text, event titles, and package-owned prompts should prefer text ids where the active runtime already supports them; task titles/descriptions migrate only after shared task-contract support exists.`
- `Suggested prefixes: scene.<scene-tail>.*, event.<event-tail>.*, task.<task-tail>.*`

#### `visual-assets.json` (Planned Extension)

- `visual-assets.json` becomes the canonical registry for zhuyuanzhang-exclusive runtime images outside map layer/path fields only after the shared pack contracts and loaders add first-class support for a visualAssets table.`
- `Before that upgrade, package-exclusive images should still move into scenario-packs/zhuyuanzhang/assets/**, but their references must stay on currently supported fields or on auditable transitional mappings.`
- `When introduced, each record should own: id, kind, path, scope, and optional tags.`
- `Recommended kinds: portrait, cg, house-illustration, playable-illustration, event-illustration.`
- `Recommended scopes: scene, event, task, house, playable, city.`
- `Recommended paths: ./assets/portraits/**, ./assets/cg/**, ./assets/houses/**, ./assets/playables/**`

Example:

```json
[
  {
    "id": "visual.cg.zhuyuanzhang.opening.escape",
    "kind": "cg",
    "path": "./assets/cg/opening-escape.png",
    "scope": "scene",
    "tags": ["opening", "story"]
  },
  {
    "id": "visual.house.zhuyuanzhang.temple.daily",
    "kind": "house-illustration",
    "path": "./assets/houses/temple-daily.png",
    "scope": "house",
    "tags": ["temple-house"]
  }
]
```

### Resource Ownership Rules

#### Must Move Into The Package

- `zhuyuanzhang-exclusive map images and overlays consumed by maps.json`
- `zhuyuanzhang-exclusive city or region portraits consumed only on the zhuyuanzhang runtime path`
- `zhuyuanzhang-exclusive CG, event illustrations, and scene portraits`
- `zhuyuanzhang-exclusive house/playable illustrations that are consumed only when zhuyuanzhang is active`

#### Must Stay Outside The Package

- `shared framework UI baseline such as global buttons, common panels, shared layout baseline, and shared screen skins`
- `layout-editor baseline assets and framework-owned reserve catalogs`
- `generic runtime art that is not owned by zhuyuanzhang specifically`

#### Transitional Rule

- `A legacy-path image is in scope only when source-path audit proves that the runtime consumes it exclusively for zhuyuanzhang rather than through a shared framework path.`
- `If ownership is uncertain, classify it as framework/shared residue until a fresh audit proves package exclusivity.`

### JSON Representation Rules

- `maps.json` may keep pack-relative path fields such as primaryImageUrl, regionOverlayImageUrl, and layers[].imageUrl because the shared loader already resolves those paths correctly.`
- `Before shared visual-asset support exists, scenes/events/tasks must not invent unsupported visual-asset-id fields just to satisfy this document.`
- `After shared visual-asset support exists, scenes/events/tasks should stop keeping raw file paths for package-exclusive visual resources and should reference visual asset ids instead.`
- `Text-bearing records should prefer text ids where the active runtime already supports them today, and should complete migration only when shared task/scene contracts are upgraded together.`
- `Do not add zhuyuanzhang-specific loader branches in main.ts or application runtime modules just to resolve a package field. If a new field is required, extend the shared content-pack/scenario-pack loader seam instead.`

### Migration Plan

#### Phase 1: Audit And Ownership Freeze

- `Enumerate every runtime-owned zhuyuanzhang-exclusive image still loaded from legacy paths.`
- `Split findings into: already pack-local, legacy-but-pack-exclusive, shared-framework, uncertain.`
- `Freeze the migration list before moving files so shared UI baseline is not accidentally absorbed.`

#### Phase 2: Story-Chain Table Normalization

- `Normalize zhuyuanzhang story runtime ownership into scenario-profile -> events -> scenes -> tasks -> text-entries.`
- `Remove pack-private prose duplication from TypeScript assembly points and push that truth into JSON tables.`
- `Keep event ownership as trigger/routing only; keep scene ownership as story presentation only; keep task ownership as progression only.`
- `Stay compatible with current shared contracts in this phase; do not introduce scene/task shapes that active loaders or runtime consumers cannot parse yet.`

#### Phase 3: Visual Registry Introduction

- `First extend shared scenario-pack/content-pack contracts, loaders, and validators to recognize a visualAssets table.`
- `Only after that shared-contract upgrade, add visual-assets.json to the package files registry.`
- `Move every audited pack-exclusive legacy image into scenario-packs/zhuyuanzhang/assets/**.`
- `Replace scene/task/event direct package-exclusive file paths with stable visual asset ids only when those ids are shared-contract legal.`

#### Phase 4: Reference Rewrite And Cleanup

- `Rewrite package data to consume text ids and visual asset ids consistently, but only after the corresponding shared runtime contracts support those fields.`
- `Delete obsolete pack-private TypeScript path glue once shared loaders and tables fully cover the runtime-owned paths.`
- `Leave shared UI baseline outside the package and document any accepted framework residue explicitly rather than smuggling it into zhuyuanzhang.`

### Validation Contract

#### Static Validation

Every integrated zhuyuanzhang package must prove:

1. `pack.json.files` references only existing files.
2. `scenarioProfile`, `characters`, `events`, and `scenes` exist as canonical required split tables.
3. `events.json` only references existing scene/task/text ids.
4. `scenes.json` only references existing text ids, choice targets, and nextSceneIds on fields the active runtime already supports.
5. `tasks.json` only uses text-id or scene/event linkage fields after those fields are introduced through shared task-contract upgrades.
6. `If visual-assets.json is introduced, it only points to files that exist under the package root and only appears after shared-contract support exists.`
7. `maps.json` pack-relative asset paths resolve to files that exist under zhuyuanzhang/assets/maps/**.
8. `No zhuyuanzhang package table keeps duplicated long-form prose both inline and in text-entries.json once that row is migrated.`

#### Runtime Validation

The integrated package must also prove:

1. `Default zhuyuanzhang activation still loads through the shared scenario-pack/content-pack runtime path.`
2. `At least one canonical opening flow completes: package load -> initial event -> opening scene -> first task progression.`
3. `Migrated package-exclusive images render correctly without falling back to legacy non-pack paths.`
4. `Shared framework UI still renders from its existing owner line, proving the migration did not incorrectly absorb framework baseline into zhuyuanzhang.`

#### Source-Path Audit Gate

- `A source-path audit must confirm that production runtime code no longer directly consumes zhuyuanzhang-exclusive legacy image paths after migration completes.`
- `The same audit must also confirm that shared UI baseline paths remain framework-owned rather than silently moving into scenario-pack truth.`

### Acceptance Criteria

- `zhuyuanzhang can be described as one canonical scenario-pack rather than a mixed TS-assembly-plus-legacy-asset bundle.`
- `Story/event/task/text ownership is data-driven and table-separated according to this support spec.`
- `Package-exclusive visual resources are pack-local and auditable through one registry or one allowed map-relative path family.`
- `Any new package table or field used by zhuyuanzhang must first exist in the shared scenario-pack/content-pack contract, loader, and validator path.`
- `Shared framework/UI baseline stays outside the package.`
- `No new zhuyuanzhang-specific runtime branch is required in main.ts to keep the package working.`

### Failure Conditions

- `A migration that copies shared UI baseline into zhuyuanzhang to achieve superficial self-containment is invalid.`
- `A migration that leaves event/scene/task ownership mixed together in pack-private TypeScript while only moving files is incomplete.`
- `A migration that introduces zhuyuanzhang-only loader behavior instead of extending shared loader seams is invalid.`
- `A migration that cannot prove source-path cleanup through validation is incomplete.`
