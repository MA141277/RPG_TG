# City / Building Access Condition Picker Design

## Status

- Status: `proposed`
- Date: `2026-07-19`
- Owner: `Codex`
- Scope: `Defines which condition families may be exposed for city/building access authoring, and which runtime-readable fields are allowed in the access-condition picker.`

---

## 1. Purpose

City and building access authoring must not expose arbitrary condition sources.
The picker should only surface conditions that can be evaluated by the current location-access runtime or by a small, explicit runtime extension set.

The goal is to keep the authoring UI honest:

- if authors can choose it, runtime must be able to evaluate it
- if runtime cannot evaluate it, the UI must not present it as a normal option

---

## 2. Supported Condition Families

### 2.1 Directly Supported

These are safe to expose immediately:

- `world.chapterId`
- `world.currentMapId`
- `world.currentCityId`
- `world.currentHouseId`
- `world.timeOfDay`
- `targetCity.id`
- `targetCity.name`
- `targetCity.regionId`
- `targetCity.mapNodeId`
- `targetCity.backgroundId`
- `targetCity.travelCost`
- `targetCity.prosperity`
- `targetCity.danger`
- `targetCity.tags`
- `targetCity.specialDemand`
- `targetCity.houseIds`
- `targetBuilding.id`
- `targetBuilding.cityId`
- `targetBuilding.name`
- `targetBuilding.backgroundId`
- `targetBuilding.type`
- `targetBuilding.level`
- `targetBuilding.damaged`
- `targetBuilding.outputMultiplier`
- `targetBuilding.activityLocationId`
- `targetBuilding.requiresPlayerCurrentCityMatch`
- `targetBuilding.enterableStoryStages`
- `targetBuilding.visibleStoryStages`
- `targetBuilding.characterIds`
- `player.characterId`

### 2.2 Runtime-Extension Supported

These may be exposed only if the runtime picker explicitly supports them and the runtime resolver is wired to read them:

- player numeric / string stats such as force, intelligence, politics, command, charisma, reputation
- `runtime.flags.*`
- `runtime.variables.*`
- `runtime.tasks.*`
- `runtime.eventHistory.*`
- `scene.*` or `story.*` fields already readable by `LocationAccessRuntime`

### 2.3 Not Supported In The Picker

These should not appear as normal picker choices for city/building access:

- event binding `payload` fields
- event binding `resolver` fields
- event binding `custom` handler fields
- event binding `binding-context` fields that do not exist in location access runtime
- UI-only state
- any condition source that cannot be evaluated from the runtime input contract

---

## 3. Picker Shape

The access-condition editor should reuse the same general idea as event condition authoring:

- group operator select
- add-condition button
- remove-condition button
- nested condition rows

But the options list must be narrowed to the supported families above.

Authors may create:

- zero conditions, meaning no access rule is emitted
- one condition
- multiple conditions combined with `all` / `any` / `not`

---

## 4. Runtime Rules

The runtime must keep these guarantees:

- no condition means enter is allowed
- supported condition fields evaluate deterministically
- unsupported fields fail closed during export or normalization
- city/building access must not depend on event binding context

If the authoring UI can produce a condition that runtime cannot evaluate, that is a design bug and must be blocked before export.

---

## 5. Acceptance Criteria

This design is satisfied when:

- the city/building access picker only exposes runtime-readable fields
- authors can build nested access conditions from supported fields
- empty access conditions are allowed and treated as "no restriction"
- unsupported event-binding-only condition families do not appear in city/building access authoring
- runtime continues to evaluate city/building access correctly with or without conditions

