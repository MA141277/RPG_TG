# 2026-07-09 Script Editor Authoring Plan (Pending)

## Purpose

This document consolidates the current session's conclusions around a creator-facing scenario editor, the existing scenario-pack structure, and the likely implementation path for landing the editor without forcing the runtime pack schema to directly absorb every authoring concern.

Status: `Pending`

## Session Summary

The current direction is not a generic data editor. It is a story-performance-oriented scenario editor for creators, with a clear authoring workflow:

`新建 Pack -> 设开局 -> 写事件 -> 写场景 -> 绑文本 -> 校验导出`

The UI should favor form inputs, pickers, structured panels, and rule composition over code-like authoring surfaces. Titles and primary labels should face creators in Chinese rather than exposing English engineering terminology by default.

## Target Product Shape

The editor should support these authoring domains:

- `人物`
  - The editor has a single person-editing surface.
  - A person can be configured as `角色` or `NPC`.
  - Supports creation, base info, portrait, camp/faction, tags, availability, and editor-facing notes.
- `属性系统`
  - Support custom attributes.
  - Support editing existing attributes.
  - Allow attributes to participate in conditions, rewards, dialogue branches, and event gating.
- `事件`
  - Support authoring and sequencing events.
  - Support multiple predefined event types.
  - Support free rule composition instead of a single hardcoded event template family.
- `任务`
  - Support task type, trigger condition, completion condition, rewards, failure or timeout handling, and follow-up jumps.
- `对话`
  - Support importing dialogue text data.
  - Support binding text entries into scenes, events, NPC interactions, and branch outcomes.
- `NPC 能力`
  - NPC can bind events, tasks, dialogue, menus, and minigame entrances.
- `城市`
  - Support city editing.
  - Support city function management.
  - Support a configurable `Menu` list.
- `建筑`
  - Support building management under cities or other world scopes.
  - Support a configurable building `Menu` list.
- `小游戏`
  - Support minigame trigger conditions, rewards, and management.
  - Support creator-side rule composition rather than only selecting one rigid minigame template.
- `剧情走向`
  - Support defining story progression, branch routing, prerequisite conditions, and state change effects.
- `导入导出`
  - Support script import/export and dialogue text import.
- `校验/试玩`
  - Support dependency validation, missing-reference checks, and export readiness checks before pack output.

## UX Direction

The expected UI is a guided creation tool rather than a developer console.

Key direction:

- Use Chinese headings and creator-facing wording.
- Prefer `表单 + 下拉 + 规则块 + 引导步骤` over raw JSON or code syntax.
- Keep the interface flow-oriented so authors move through one stable path rather than jumping across loosely related panels.
- Treat the editor as a `剧情演出编辑器`, not only a data-table maintenance tool.

Recommended top-level workflow:

1. `新建 Pack`
2. `设定开局`
3. `准备人物/城市/建筑`
4. `编排事件与任务`
5. `编写场景与对话`
6. `绑定小游戏与菜单入口`
7. `校验`
8. `导出`

## Current Repository / Pack Baseline

Based on current repository inspection and discussion:

- The current runtime pack shape is already split into a `main + sub table` structure.
- `src/content/scenario-packs/zhuyuanzhang/pack.json` currently references these main tables:
  - `scenarioProfile`
  - `maps`
  - `cities`
  - `houses`
  - `cityEntries`
  - `characters`
  - `events`
  - `scenes`
  - `textEntries`
  - `activities`
  - `cards`
  - `valuables`
  - `cityNpcPools`
  - `houseAccessRefusalRules`
  - `houseModuleDefaults`
  - `cityPortraits`
  - `historicalCharacters`
  - `historicalCityRosters`
  - `historicalCharacterIdByCharacterId`
- The `zhuyuanzhang` pack folder also contains large pack-local split files such as:
  - `characters.json`
  - `houses.json`
  - `maps.json`
  - `historical-characters.json`
  - `text-entries.json`
- The current pack already carries some shared-runtime evolution:
  - `src/domain/content-pack.ts` includes `tasks?: TaskDefinition[]`
  - `src/domain/content-pack.ts` includes `houseModuleDefaults?: Partial<Record<HouseModuleId, Record<string, unknown>>>`
  - `src/application/scenario/scenario-pack-loader.ts` also supports these fields
- However, `docs/scenario-pack-unified-format.md` does not yet fully reflect those keys, which means pack documentation and runtime support are currently drifting.

## Core Design Conclusion

The editor should not be forced to mirror the runtime pack one-to-one.

Recommended architecture is a three-layer model:

1. `编辑器内部工程模型`
   - Rich authoring model for creators.
   - Keeps authoring-only structure such as rule blocks, draft relations, menu composition, dialogue grouping, and editor metadata.
2. `导出目标 Pack 模型`
   - Stable runtime-facing pack format for the current game.
   - Keeps runtime naming and compatibility where possible.
3. `编译 / 导出层`
   - Converts authoring objects into runtime pack tables.
   - Handles flattening, id mapping, validation, and compatibility shims.

This avoids the worst outcome:

- the editor becomes constrained by runtime table accidents
- the runtime is polluted by editor-only concepts
- authors are forced to edit data in runtime-oriented structures that are not natural for creation

## Authoring Model Recommendation

Minimum core objects for the editor-side project model:

- `story_pack`
- `person`
- `city`
- `building`
- `event`
- `quest`
- `dialogue`
- `minigame`
- `story_node`
- `text_entry`
- `city_menu_item`
- `building_menu_item`
- `condition_group`
- `effect_bundle`

Important naming decisions already aligned in discussion:

- The editor-facing concept should be `人物`, not split into separate top-level editors for playable and npc.
- A `person` can be configured as `角色` or `NPC`.
- Editor-side `建筑` may still export to runtime `houses.json` in v1 for compatibility.
- Editor-side `人物` may still export to runtime `characters.json` in v1 for compatibility.

## Recommended Runtime Pack Additions

If the editor is to cover the agreed scope, the current pack structure likely needs additive expansion rather than destructive replacement.

Recommended new runtime-facing split tables:

- `tasks.json`
- `dialogues.json`
- `minigames.json`
- `story-nodes.json`
- `city-menu-items.json`
- `house-menu-items.json`

These additions should be treated as export outputs, not necessarily as the editor's native internal storage shape.

## Suggested Mapping Between Authoring And Runtime

High-level export mapping:

- `人物 -> characters.json`
- `城市 -> cities.json`
- `建筑 -> houses.json`
- `事件 -> events.json`
- `场景 -> scenes.json`
- `文本条目 -> text-entries.json`
- `任务 -> tasks.json`
- `对话 -> dialogues.json`
- `小游戏 -> minigames.json`
- `剧情节点 -> story-nodes.json`
- `城市菜单 -> city-menu-items.json`
- `建筑菜单 -> house-menu-items.json`

Cross-cutting rule:

- Conditions and effects should be represented in a shared reusable structure so events, tasks, dialogues, menus, and minigames can all compose them through the same mechanism instead of growing one-off branch formats.

## Recommended Editor Modules

The near-finished editor should eventually expose these modules:

- `Pack 总览`
  - Project metadata, progress, export status, warnings.
- `开局设置`
  - Initial role, starting city, opening events, initial state, opening resources.
- `人物`
  - Basic profile, role/NPC mode, attributes, relationships, event/task/dialogue bindings.
- `城市`
  - City metadata, function switches, city menu list, local building roster.
- `建筑`
  - Building metadata, open conditions, building menu list, attached events/tasks/minigames.
- `事件`
  - Event type, triggers, conditions, effects, follow-up links.
- `任务`
  - Trigger source, task objectives, rewards, failure handling, routing.
- `场景/对话`
  - Scene ordering, dialogue blocks, speaker binding, text binding, branch selection.
- `小游戏`
  - Entry trigger, rules, reward settlement, availability and reuse.
- `剧情走向`
  - Story node graph, prerequisite gates, route transitions.
- `文本导入`
  - Import external text data, review unresolved references, bind to authoring nodes.
- `校验与导出`
  - Missing id checks, reference checks, cycle checks, export preview, pack export.

## Concrete Implementation Direction

The current repository should likely land this work in phases.

### Phase 0: Freeze And Align Pack Contract

Goals:

- Document the actual current runtime pack contract.
- Resolve current drift between code and documentation.
- Confirm which current fields are canonical runtime input versus transitional residue.

Concrete items:

- Update `docs/scenario-pack-unified-format.md`
- Confirm `tasks` and `houseModuleDefaults` documentation
- Audit whether current split-table references in `pack.json` are the intended canonical pack entry contract

### Phase 1: Additive Pack Schema Extension

Goals:

- Introduce the minimum new runtime tables required by the future editor.
- Avoid breaking the current runtime while making new authoring output legal.

Concrete candidates:

- add `tasks.json`
- add `dialogues.json`
- add `minigames.json`
- add `story-nodes.json`
- add `city-menu-items.json`
- add `house-menu-items.json`
- extend validator and loader support

### Phase 2: Authoring Project Model

Goals:

- Define the editor-native object model independent from runtime pack accidents.
- Make room for creator workflow, drafts, rule composition, and Chinese UX semantics.

Concrete candidates:

- define `person / city / building / event / quest / dialogue / minigame / story_node`
- define shared `condition_group` and `effect_bundle`
- define editor project manifest and import/export boundaries

### Phase 3: Compile / Export Layer

Goals:

- Convert authoring model into runtime pack tables.
- Keep current runtime consumption stable while the editor evolves.

Concrete candidates:

- id normalization
- relation flattening
- text binding resolution
- menu compilation
- minigame and task export adapters
- validation report generation

### Phase 4: Shared Validator

Goals:

- Reuse validation for both CLI export and editor UI readiness checks.

Validation categories:

- missing ids
- unresolved references
- invalid trigger targets
- invalid branch targets
- duplicate menu slot ids
- impossible opening configuration
- task and event graph cycles where disallowed

### Phase 5: Creator UI

Goals:

- Build the guided creator-facing editor on top of the authoring model rather than directly on runtime tables.

UI priorities:

1. `新建 Pack / 开局设置`
2. `人物 / 城市 / 建筑`
3. `事件 / 任务`
4. `场景 / 对话 / 文本绑定`
5. `小游戏 / 菜单入口`
6. `校验 / 导出`

## Expected Near-Term Refactor Impact

If the repository follows the direction above, the likely affected areas are:

- `src/domain/content-pack.ts`
- `src/application/scenario/scenario-pack-loader.ts`
- scenario-pack validator paths
- pack export and import tooling
- `src/content/scenario-packs/zhuyuanzhang/**`
- editor-side application and UI modules

The key principle is additive convergence:

- first make runtime contract explicit
- then make runtime contract extensible
- then build authoring contract
- then build export bridge
- only after that push the full editor UI

## Important Risk Notes

- If the editor is built directly on the current runtime split tables, the UX will likely remain fragmented and too technical for creators.
- If the runtime pack is expanded without a shared condition/effect mechanism, event, task, dialogue, menu, and minigame rules will likely duplicate each other in incompatible shapes.
- If `人物` is prematurely split into separate top-level systems for playable and NPC authoring, shared editing concerns will duplicate unnecessarily.
- If city and building menu systems are not normalized early, later UI and export logic will fragment again.

## Pending Decisions

The following still need explicit freeze decisions before implementation starts:

1. Whether the editor project file is stored as one authoring manifest or multiple split authoring tables.
2. Whether `场景` and `对话` are exported as separate runtime tables or one combined table with typed sections.
3. Whether `小游戏` rules are described through a fully generic rule graph, a limited block system, or a hybrid preset-plus-extension model.
4. Whether city/building menus share one common menu schema with different hosts, or two separate schemas.
5. Whether old pack tables should be migrated in place or supported through a compatibility importer.

## Recommended Next Step

The next concrete step should be a repo-facing spec that freezes:

- editor-native core object model
- runtime export tables
- shared condition/effect contract
- import/export boundary
- first-slice UI flow

That spec can then drive a bounded implementation queue instead of mixing product design discussion directly into runtime refactors.
