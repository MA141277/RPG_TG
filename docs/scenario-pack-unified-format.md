# Scenario Packs Unified Format

## Goal

This document defines the single canonical format for all files under `src/content/scenario-packs/`.

The purpose is to make every scenario pack:

- load through the same runtime path
- use the same manifest and split-table structure
- avoid pack-specific TypeScript assembly as the long-term format
- prepare for later editor export, mod import, validation, and DSL/event integration

This spec only defines content-pack structure. It does not redefine runtime behavior.

## Core Rule

Every scenario pack must use:

- one main manifest file: `pack.json`
- multiple split tables referenced by `pack.json`
- JSON as the content source of truth

Long-term target:

- `scenario-packs/<pack-id>/` contains only pack data files and pack-local assets
- no scenario-specific `base-content-pack.ts` as the final delivery format

Temporary migration adapters are allowed during refactor, but they are not the target format.

## Standard Directory Layout

Each pack directory should follow this layout:

```text
src/content/scenario-packs/<scenario-pack-slug>/
  pack.json
  scenario-profile.json
  maps.json
  cities.json
  houses.json
  city-entries.json
  characters.json
  events.json
  scenes.json
  text-entries.json
  activities.json
  cards.json
  valuables.json
  city-npc-pools.json
  house-access-refusal-rules.json
  historical-characters.json
  historical-city-rosters.json
  city-portraits.json
  historical-character-id-map.json
  assets/
```

Not every file is mandatory. The required and optional sets are defined below.

## Main Table

The main table is always `pack.json`.

It is the only file that the pack catalog should point to.

### Required Fields

```json
{
  "schemaVersion": 1,
  "kind": "scenario-pack",
  "id": "scenario-pack.<slug>",
  "title": "Scenario Title",
  "files": {
    "scenarioProfile": "scenario-profile.json",
    "characters": "characters.json",
    "events": "events.json",
    "scenes": "scenes.json"
  }
}
```

Required top-level fields:

- `schemaVersion`
- `kind`
- `id`
- `title`
- `files`

### Optional Fields

- `description`
- `tags`
- `version`
- `author`
- `basePackId`

Recommended optional shape:

```json
{
  "description": "Opening scenario for ...",
  "tags": ["opening", "historical", "json-pack"],
  "version": "0.1.0",
  "author": "team-or-modder",
  "basePackId": "content-pack.base-game.zhuyuanzhang"
}
```

`basePackId` is recommended when the pack is an override or extension on top of a shared base content set.

## Split Tables

Split tables are JSON files referenced by `pack.json.files`.

### Required Split Tables

Every scenario pack must provide:

- `scenarioProfile`
- `characters`
- `events`
- `scenes`

These correspond to:

- `scenario-profile.json`
- `characters.json`
- `events.json`
- `scenes.json`

### Strongly Recommended Split Tables

These should be present whenever the pack contains the corresponding data:

- `textEntries`
- `cities`
- `houses`
- `maps`
- `activities`

Recommended file names:

- `text-entries.json`
- `cities.json`
- `houses.json`
- `maps.json`
- `activities.json`

### Optional Split Tables

Use these only when the pack needs them:

- `cityEntries`
- `cards`
- `valuables`
- `cityNpcPools`
- `houseAccessRefusalRules`
- `historicalCharacters`
- `historicalCityRosters`
- `cityPortraits`
- `historicalCharacterIdByCharacterId`

Recommended file names:

- `city-entries.json`
- `cards.json`
- `valuables.json`
- `city-npc-pools.json`
- `house-access-refusal-rules.json`
- `historical-characters.json`
- `historical-city-rosters.json`
- `city-portraits.json`
- `historical-character-id-map.json`

## File Key Rules

`pack.json.files` uses stable logical keys, not arbitrary names.

Allowed standard keys:

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
- `cityPortraits`
- `historicalCharacterIdByCharacterId`
- `historicalCharacters`
- `historicalCityRosters`

Do not invent pack-specific file keys like:

- `openingScenes`
- `nobunagaCharacters`
- `packEventsA`

If the data belongs to an existing domain bucket, it must use the standard key.

## Naming Rules

### Directory Name

Pack directory names use lowercase kebab-case:

- `liu-bang-pei-county-opening`
- `zhuyuanzhang`

### Pack ID

Pack IDs use:

- `scenario-pack.<slug>`

Examples:

- `scenario-pack.liu_bang.pei_county_opening`
- `scenario-pack.zhu_yuanzhang.opening`

Use dot-separated domain segments after the prefix.

### Content IDs

Domain records inside split tables should use these prefixes:

- scenario profile: `scenario.<slug>`
- event: `event.story.<slug>.<name>`
- scene: `scene.story.<slug>.<name>`
- activity: `activity.<slug>.<name>`
- map: `map.<slug>`
- city: `city.<slug>`
- house: `house.<slug>`
- character: `char.<slug>`

### Text Entry IDs

`text-entries.json` keys must be stable and semantic.

Recommended format:

- scene action text: `scene.<scene-id-tail>.<nnn>`
- choice prompt: `scene.<scene-id-tail>.prompt`
- choice option: `scene.<scene-id-tail>.choice.<option-id-tail>`
- event title/meta if externalized later: `event.<event-id-tail>.name`

Examples:

- `scene.story.liu_bang.pei_county_opening.001`
- `scene.story.liu_bang.pei_county_opening.prompt`
- `scene.story.liu_bang.pei_county_opening.choice.duty`

## Text Rules

All scene flow text should prefer `textEntries`.

That means:

- `narration` uses `textId`
- `dialogue` uses `textId`
- `choice` uses `promptTextId`
- choice options use `labelTextId`

Temporary fallback is allowed:

- `text`
- `prompt`
- `label`

But this is migration compatibility only, not target format.

Target rule:

- scene text belongs in `text-entries.json`
- scene flow belongs in `scenes.json`

## Main Table vs Split Table Responsibility

`pack.json` is only responsible for:

- pack identity
- pack metadata
- split-table registry

It must not inline:

- scenes
- events
- characters
- maps
- long text payloads

`scenario-profile.json` is only responsible for:

- player entry configuration
- initial location
- initial date
- initial runtime state
- initial UI state
- opening flow entry

`scenes.json` is only responsible for:

- action flow
- jumps
- conditions already expressed by scene structure
- activity/event/callback linkage

`text-entries.json` is only responsible for:

- display text

## Asset Rules

If a pack requires pack-local assets:

- store them under `assets/`
- reference them through stable asset IDs or relative asset paths

Do not hardwire pack-specific asset resolution in a custom TypeScript loader unless it is a temporary migration step.

Long-term target:

- asset references are data-driven like other pack fields

### Campaign Map Hex Grid

Campaign maps may define `campaignHexGridUrl` on their `maps.json` record. The value must be a pack-relative path to a JSON file using `format: "campaign-hex-grid-v1"`.

The hex grid file is the campaign map semantic data source for per-hex gameplay fields:

- `land`: whether the hex is passable land for the current land/water model.
- `terrain`: coarse terrain category for later rules; newly generated grids initialize this to `平原`.
- `environment`: local environment category for later rules; newly generated grids initialize this to `草地`.

The file must also keep reproducibility metadata under `source`: the source raster layer, source image path, sampler method, UV-to-pixel formula, water material rule, and land rule. For the current Yuanmo campaign map, `tools/generate-campaign-hex-grid.mjs` samples the `map_ground_types` layer at each hex center and writes `assets/maps/yuanmo-campaign-hex-grid.json`.

Runtime renderers must prefer `campaignHexGridUrl` over direct raster resampling for land/water semantics. Direct `map_ground_types` sampling is only a legacy fallback and a generation input; visual material layers can still use the original images for color and shader effects.

## Validation Rules

Every pack should satisfy these checks:

1. `pack.json.files` references only existing files.
2. Every required split table exists.
3. Every record ID is unique within its domain.
4. Every `textId` points to an existing key in `text-entries.json`.
5. Every `entrySceneId`, `nextSceneId`, `eventId`, and `activityId` resolves.
6. No scene text is duplicated inline and in `text-entries.json` once migration is complete.

## Migration Rules

During migration, packs may temporarily be in one of these states:

### State A

- manifest + split tables
- some scene nodes still use inline `text`

Allowed temporarily.

### State B

- manifest + split tables
- all scene nodes use `textId`

Preferred migration-complete state for scene text.

### State C

- TypeScript pack assembler wrapping JSON files

Allowed only as a bridge while moving legacy packs into the standard structure.

Long-term target is to eliminate State C for pack-specific content.

## What Must Be Avoided

Do not do the following for new packs:

- define a new pack format per scenario
- keep scenario-specific pack assembly logic in TypeScript when JSON can express it
- put story text directly into `scenes.json` once `text-entries.json` exists
- use inconsistent file names for the same domain bucket
- mix pack metadata and scene payloads in the same file

## Recommended Minimum Pack

For a small opening scenario, the minimum practical standard is:

```text
<pack>/
  pack.json
  scenario-profile.json
  characters.json
  events.json
  scenes.json
  text-entries.json
  activities.json
```

For a full scenario pack, add:

- `maps.json`
- `cities.json`
- `houses.json`
- `city-entries.json`
- `city-npc-pools.json`
- `cards.json`
- `valuables.json`
- `historical-characters.json`
- `historical-city-rosters.json`

## Recommendation For This Repository

The next repository step should be:

1. keep `liu-bang-pei-county-opening` as the reference pack shape
2. migrate `zhuyuanzhang` from TS assembly to the same manifest + split-table standard
3. require all new scenario packs to follow this spec
4. then continue moving remaining text-bearing content into `text-entries.json`

