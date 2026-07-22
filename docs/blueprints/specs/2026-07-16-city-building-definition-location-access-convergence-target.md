# City Building Definition And Location Access Convergence Target

## Control Block

- version_id: `target.city-building-definition-location-access-convergence`
- version_label: `city-building-definition-location-access-convergence`
- closeout_contract_version: `v1`
- predecessor_version: `target.script-editor-authoring-data-structure-unification`
- source_memo: `docs/blueprints/version-memo.md`

## Human Context

### Goal

- `Create a city/building definition model that is no longer owned by runtime-house structures.`
- `Make LocationAccessRuntime the single runtime boundary for map city entry and city building entry.`
- `Drive entry eligibility from script-editor-authored condition expressions rather than hardcoded visibility states or business branches.`
- `Keep map node and coordinate ownership on the existing MapDefinition/cityCoordinatesById path for this version.`

### Scope

- `Script-editor city and building definition records with baseAttributes, profileMap, extendedAttributes, access rules, menu entries, and event bindings.`
- `No visibility property in city/building data, script-editor access UI, or runtime location access evaluation.`
- `LocationAccessRule.conditionExpression as the only author-controlled entry condition surface; missing expressions default to allow.`
- `LocationAccessRuntime expression evaluation for city and building targets before any location state mutation.`
- `Expression value resolution for targetCity, targetBuilding, player, world, and story subjects.`
- `Materialized city/building/player field reads through definition plus runtime status overlays and field defaults.`
- `HouseRuntime deprivileging so HouseDefinition/house modules remain the post-entry interaction runner instead of the primary building model.`
- `CityRuntimeStatus and BuildingRuntimeStatus as save/status overlays that store final current values, not operation deltas.`
- `Script-editor authoring for city/building custom attributes and location access condition expressions.`
- `Runtime pack export/import validation for the admitted city/building/location-access structures.`
- `Map city list compatibility preservation: map markers continue to use activeContentContext.cities, cityCoordinatesById, and city id/name.`

### Non-Goals

- `Do not move map coordinates, map nodes, mapBinding, mapNodeId, or coordinate ownership into city definitions in this version.`
- `Do not implement a city-management, taxation, conquest, production, or building-upgrade gameplay loop as hardcoded business flow.`
- `Do not cancel HouseRuntime; keep it as the building interaction/session/module execution layer after entry is allowed.`
- `Do not treat city-enter or house-enter events as the primary access gate; they remain follow-up behavior after access allows entry.`
- `Do not preserve visible/disabled/hidden access state in the new city/building access model.`
- `Do not store runtime city/building mutations by editing authored definitions.`
- `Do not create queue docs or begin implementation before version-plan admission review activates a queue.`

### Target Data Contracts

#### City Definition

```ts
export type ScriptEditorCityRecord = {
  id: string;
  name: string;
  baseAttributes?: {
    ownerFactionId?: string;
    prosperity?: number;
    security?: number;
    population?: number;
  };
  profileMap?: {
    displayName?: string;
    description?: string;
    tags?: string[];
  };
  extendedAttributes?: ScriptEditorCustomAttributeEntry[];
  access?: LocationAccessRule;
  menuEntries?: LocationMenuEntry[];
  eventBindings?: {
    onEnterEventId?: string;
    onLeaveEventId?: string;
  };
};
```

#### Building Definition

```ts
export type ScriptEditorBuildingRecord = {
  id: string;
  cityId: string;
  name: string;
  baseAttributes: {
    houseType: HouseDefinition["type"];
    activityLocationId?: HouseDefinition["activityLocationId"];
    moduleId?: HouseDefinition["moduleId"];
    characterIds: string[];
    defaultCharacterId: string | null;
    level?: number;
    damaged?: boolean;
    outputMultiplier?: number;
    visibleStoryStages?: string[];
    enterableStoryStages?: string[];
    requiresPlayerCurrentCityMatch?: boolean;
  };
  profileMap?: {
    displayName?: string;
    description?: string;
    tags?: string[];
  };
  extendedAttributes?: ScriptEditorCustomAttributeEntry[];
  access?: LocationAccessRule;
  menuEntries?: LocationMenuEntry[];
  eventBindings?: {
    onEnterEventId?: string;
    onLeaveEventId?: string;
  };
  backAction?: {
    label: string;
    targetView: "city";
  };
};
```

#### Custom Attribute Entry

```ts
export type ScriptEditorCustomAttributeValue =
  | string
  | number
  | boolean
  | string[]
  | null;

export type ScriptEditorCustomAttributeEntry = {
  key: string;
  label?: string;
  value: ScriptEditorCustomAttributeValue;
};
```

#### Location Access Rule

```ts
export type LocationAccessRule = {
  conditionExpression?: LocationAccessConditionExpression;
  blockedReason?: string;
  blockedMessage?: string;
  blockedSpeakerId?: string | "player";
  guidance?: string;
  refusalEventId?: string;
};
```

Rules:

- `No access object means allow entry.`
- `An access object without conditionExpression means allow entry.`
- `A missing conditionExpression is equivalent to { type: "literal", value: true }.`
- `A literal false conditionExpression is the explicit always-blocked authoring form.`
- `Invalid expressions, missing fields, type mismatches, or unsupported operations fail closed.`

#### Location Access Condition Expression

```ts
export type LocationAccessConditionExpression =
  | { type: "literal"; value: boolean }
  | {
      type: "compare";
      left: LocationAccessValueRef;
      operator:
        | "equals"
        | "not-equals"
        | "greater-than"
        | "greater-than-or-equal"
        | "less-than"
        | "less-than-or-equal"
        | "includes"
        | "exists";
      right?: LocationAccessValueRef;
    }
  | { type: "all"; conditions: LocationAccessConditionExpression[] }
  | { type: "any"; conditions: LocationAccessConditionExpression[] }
  | { type: "not"; condition: LocationAccessConditionExpression };

export type LocationAccessConditionSubject =
  | "targetCity"
  | "targetBuilding"
  | "player"
  | "world"
  | "story";

export type LocationAccessValueRef =
  | {
      type: "field";
      subject: LocationAccessConditionSubject;
      fieldId: string;
    }
  | {
      type: "literal";
      value: unknown;
    };
```

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-city-building-definition-restructure` | `required-priority` | `Introduce the new city/building definition records, remove visibility from authoring/runtime contracts, and preserve current map id/name compatibility.` | `Admit first unless fresh evidence proves LocationAccessRuntime must be isolated before any data shape migration.` |
| `queue.location-access-runtime-convergence` | `required-priority` | `Create LocationAccessRuntime, condition-expression evaluation, city/building target handling, fail-closed diagnostics, and entry-before-mutation enforcement.` | `Admit after the minimal definition contract exists, or first if implementation evidence proves access can be introduced over existing records without widening scope.` |
| `queue.script-editor-building-house-runtime-adapter` | `required` | `Demote HouseRuntime to the post-entry interaction runner and adapt BuildingDefinition into the existing house module/session runtime without making HouseDefinition the primary building model.` | `Admit after the building definition structure and access boundary are stable enough to prevent new house-specific data branches.` |
| `queue.city-building-status-save-runtime-convergence` | `required` | `Add CityRuntimeStatus and BuildingRuntimeStatus save overlays, final-value patch semantics, materialized city/building views, and save/restore integration.` | `Admit when a runtime mutation or expression-read path requires current city/building values beyond authored defaults.` |
| `queue.script-editor-city-building-custom-attribute-authoring` | `required` | `Expose city/building extended attributes through governed field definitions and validate their save/load/export behavior.` | `Admit after the base city/building definition shape exists and before broad creator-facing condition authoring depends on custom fields.` |
| `queue.script-editor-city-building-export-import-validation` | `required` | `Update runtime pack export/import and validation so new city/building definitions, access expressions, and overlays are preserved or fail closed.` | `Admit once the data structure and runtime access contracts have enough shape to freeze the pack boundary.` |
| `queue.map-city-list-compatibility-preservation` | `required-final` | `Prove map markers still read city id/name and cityCoordinatesById from the existing map path while map city clicks route through LocationAccessRuntime.` | `Admit near closeout after definition and access changes land, unless map breakage becomes the first blocker.` |

### Acceptance Criteria

- `City/building definition records no longer include visibility fields.`
- `Script-editor city/building entry configuration no longer exposes visible/disabled/hidden state.`
- `LocationAccessRuntime does not contain city/building business condition hardcoding; it interprets conditionExpression data authored by the script editor.`
- `No access object, or access without conditionExpression, defaults to canEnter=true.`
- `literal true allows entry and literal false blocks entry.`
- `compare/all/any/not expressions can reference targetCity, targetBuilding, player, world, and story subjects.`
- `Target city/building field reads use materialized views over runtime status patch, authored definition attributes, and field defaults.`
- `Player field reads consume CharacterStatus over CharacterDefinition where supported.`
- `Invalid expressions, missing fields, type mismatches, and unsupported operations fail closed.`
- `Map city clicks call LocationAccessRuntime before currentCityId/currentHouseId/currentView changes.`
- `City building clicks call LocationAccessRuntime before currentHouseId/currentView changes or HouseRuntime starts.`
- `Blocked city/building access leaves currentCityId, currentHouseId, house session, and current view unchanged.`
- `Allowed city entry still triggers city-enter follow-up only after navigation succeeds.`
- `Allowed building entry still enters HouseRuntime and triggers house-enter follow-up only after access succeeds.`
- `Existing houseAccessRefusalRules behavior is preserved through the LocationAccessRuntime boundary while it remains part of the compatibility surface.`
- `CityRuntimeStatus and BuildingRuntimeStatus store final current values in save/modState, not incremental operations.`
- `Map coordinates, map nodes, and cityCoordinatesById remain on the current map-owned path.`
- `Final validation proves editor authoring, save/load, export/import, runtime access evaluation, map city entry, city building entry, blocked access, and save/restore for covered city/building status paths.`

### Version Closeout Contract

- `Version may become done only after acceptance passes, no active queue/task remains, residue is dispositioned, and the version plan records explicit closeout.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted through version-plan promotion-review.`
- `Open-version status is not inferred away by queue completion; the version remains open until explicit human closeout confirmation is recorded in the version plan.`
- `If no open version exists, a new version must be explicitly created before queue admission or implementation resumes.`

### Archived Interpretation

- `This target promotes the side-review draft for city/building definition, dynamic location access expressions, house-runtime deprivileging, city/building runtime status overlays, and map compatibility preservation into live Blueprint version scope.`
