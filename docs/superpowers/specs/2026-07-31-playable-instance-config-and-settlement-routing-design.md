# Playable Instance Config And Settlement Routing Design

## Goal

Reshape Script Editor playable-instance authoring so that:

- playable instances no longer expose obsolete host/integration summary fields such as `接入方案`
- minigame/playable instances author runtime configuration through explicit creator-facing config groups
- playable completion no longer hardcodes stamina cost or reward persistence inside built-in minigame packages
- playable completion routes into authored settlement/event chains instead of directly issuing final reward mutations
- creators can author zero, one, or many completion-routing rules on a playable instance
- Script Editor modules no longer keep the large top-of-page workbench summary / overview card area
- Script Editor module workbenches align to one shared tabbed layout, using the `人物` module as the visual baseline

This design must preserve the repository's current routing rules:

- playables are still launched through playable instances
- final reward, stamina, and state mutations still execute only through settlement runtime
- `event` remains the formal routing owner for authored follow-up behavior
- UI modules must stay creator-facing and must not leak internal runtime-only terminology as the primary editing surface

## Non-Goals

The first version does not include:

- direct reward tables authored inside playable instances
- arbitrary script expressions inside playable route conditions
- multiple simultaneously-fired completion routes
- a second routing system outside event + settlement runtime
- one-off `main.ts` feature branches for individual playables
- retaining the existing top summary band on some modules but not others

## Core Decision

Playable instances do **not** bind reward content directly.

Instead:

1. the playable prototype reads instance config data
2. the running playable returns fact data only
3. the playable runtime evaluates authored completion-routing rules
4. the first matching route triggers an authored target event
5. that event enters settlement/runtime handling and performs final reward, stamina, and state writes

This keeps reward content settlement-owned while still letting the playable decide which settlement/event branch should run.

## Creator-Facing Authoring Surface

### Tab Layout

The playable instance editor must use three tabs:

1. `基础`
2. `配置组`
3. `结算组`

No other top-level summary/workbench section should remain above these tabs.

### `基础`

This tab contains only core identity fields:

- `标题`
- `玩法原型`

The following existing authoring concepts must be removed from the creator-facing page:

- `接入方案`
- explicit `结算实例`

The runtime may still use internal integration/owner data, but the creator-facing page must not present them as editable primary fields here.

### `配置组`

This tab owns playable runtime configuration values.

Purpose:

- provide creator-authored data that the playable prototype can read at runtime
- keep per-instance tuning out of hardcoded built-in playable packages
- avoid encoding reward ownership directly into the playable instance

This tab must not author final rewards directly.

### `结算组`

This tab owns completion-routing rules.

Purpose:

- declare which follow-up event should run for which playable outcome/result shape
- keep final reward logic event/settlement-owned
- let one playable choose different post-playable branches for success/failure/high-score/etc.

This tab may be empty.

If empty:

- playable completion closes without settlement/event follow-up

If non-empty:

- routes are evaluated in order
- the first matching route wins
- evaluation stops after the first match

## Authoring Data Model

### Playable Instance Record

The playable/minigame instance record should add two formal authored fields:

- `configEntries`
- `settlementRoutes`

These are first-class authored resources on the playable instance itself, not ad hoc JSON residue.

### `configEntries`

Recommended first-version shape:

```ts
type PlayableConfigEntry = {
  id: string;
  label: string;
  valueType: "number" | "text" | "boolean" | "enum";
  value: number | string | boolean | null;
  notes?: string;
  enumOptions?: Array<{ value: string; label: string }>;
};
```

Use cases include:

- duration seconds
- difficulty
- spawn profile key
- target score
- result metric key
- prototype-specific tuning values

`configEntries` are runtime inputs only. They do not directly persist rewards.

### `settlementRoutes`

Recommended first-version shape:

```ts
type PlayableSettlementRoute = {
  id: string;
  title: string;
  targetEventId: string;
  priority?: number;
  enabled?: boolean;
  conditions: PlayableSettlementRouteConditions;
};

type PlayableSettlementRouteConditions = {
  outcomeIn?: Array<"success" | "failure" | "cancelled">;
  scoreMin?: number;
  scoreMax?: number;
  metricRules?: PlayableMetricRule[];
};

type PlayableMetricRule = {
  metricKey: string;
  operator: ">" | ">=" | "<" | "<=" | "=";
  value: number | string | boolean;
};
```

The route describes:

- when this route should be considered a match
- which target event to trigger if it matches

It does **not** describe the reward itself.

## Runtime Result Contract

Playable/minigame completion must converge on a fact-only result envelope.

Recommended shape:

```ts
type PlayableFactCompletion = {
  outcome: "success" | "failure" | "cancelled";
  score?: number;
  metrics?: Record<string, string | number | boolean | null>;
  detail?: Record<string, unknown>;
};
```

Built-in playables may still internally compute domain-specific values such as:

- `foodGain`
- `maxCombo`
- `goldGain`
- `grade`

But those values must be emitted as fact metrics/detail only. They must not directly own final persistence.

## Runtime Routing Rules

### Completion Flow

When a playable ends:

1. playable returns a fact-only completion result
2. playable runtime reads `settlementRoutes`
3. playable runtime filters disabled routes out
4. playable runtime evaluates remaining routes strictly in authored list order
5. first matched route wins
6. runtime triggers the authored `targetEventId`
7. event continues into settlement/runtime handling
8. settlement performs stamina cost, rewards, variable changes, attribute changes, and any later routing

### Route Matching

A route matches only when all declared conditions pass.

Condition behavior:

- missing `outcomeIn` means no outcome restriction
- missing `scoreMin` / `scoreMax` means no score restriction
- missing `metricRules` means no metric restriction
- missing metric values in runtime facts cause that metric rule to fail closed

### Empty / Invalid Cases

- no routes configured: playable closes with no settlement/event follow-up
- routes present but none match: playable closes with no settlement/event follow-up
- route missing `targetEventId`: invalid authoring, export/preview must fail closed
- unknown operator or malformed metric rule: invalid authoring, export/preview must fail closed

## Settlement Ownership

The following values must no longer be hardcoded as built-in playable-owned final mutations:

- stamina cost
- reward money
- reward food/grain
- character stat or skill reward
- relationship reward
- any persistent inventory grant

Those values should exist only in authored event/settlement paths.

Playable instances may still author route conditions that refer to facts such as:

- `score`
- `foodGain`
- `maxCombo`
- `grade`

But the final reward itself remains externalized in settlement/event content.

## Script Editor UI Rules

### Module Workbench Consistency

All Script Editor authoring modules should use one shared workbench structure consistent with `人物`.

Required rule set:

- every module should expose tab pages
- the first tab must be named `基础`
- modules that currently do not have tabs must be upgraded to the same tabbed structure
- tab styling, tab spacing, and tab-container placement should stay visually consistent across modules
- module-specific fields belong inside tabs, not in a separate summary band above the main editor

This is a repository-wide Script Editor consistency rule, not a playable-only exception.

### Remove Overview Summary Band

The large top-of-page overview/workbench summary card area must be removed from the authoring modules that still use it.

This includes the currently visible `菜单工作台 / 概况 / 对象数 / 当前对象 / 当前阶段 / 记录摘要 / 后续队列交接` band.

The removal must be applied consistently:

- do not keep it on `菜单`
- do not introduce an equivalent band on `玩法`
- do not keep equivalent summary bands on other authoring modules
- if other Script Editor modules still use the same workbench-summary pattern, remove it there too so the editor style stays consistent

The page should open directly into:

- record list area
- editor area
- local lightweight hints only when needed

### Control Height Consistency

Input controls in the playable-instance editor must be visually taller than the current cramped controls and aligned with one shared authoring style.

This applies to:

- text inputs
- selects/dropdowns
- tab-local inline controls

The height rule should be applied as a shared Script Editor control style where possible, not as one-off playable-only CSS drift.

## Validation And Export Rules

### Export Requirements

`基础` tab:

- `标题` required
- `玩法原型` required

`配置组`:

- may be empty unless the playable prototype declares required config keys
- if a required config key is missing, preview/export must fail closed

`结算组`:

- may be empty
- if a route exists, `targetEventId` must be non-empty
- route conditions must be structurally valid
- referenced target event ids must exist

### Import Requirements

Import must restore:

- `基础`
- `配置组`
- `结算组`

Import must fail closed on:

- unknown config `valueType`
- unknown route operator
- missing referenced target event
- malformed route conditions

## Migration Plan

### Existing Playables

First migration slice:

1. `city-begging`
2. `grain-accounting`
3. `medicine-compounding`

### Migration Rules

For each migrated playable:

- move hardcoded runtime config into `configEntries` consumption where appropriate
- stop owning final stamina and reward persistence in the playable package
- emit fact-only completion data
- read `settlementRoutes` and trigger the first matched target event

### Legacy Compatibility

If existing playable records still carry older fields such as:

- `接入方案`
- explicit settlement binding residue

the loader/import path may migrate them forward temporarily, but the new editor surface must not continue to expose them.

## Testing Requirements

### Authoring UI

- playable editor shows `基础 / 配置组 / 结算组`
- summary/workbench overview band is absent
- control heights are updated for inputs and selects
- routes can be added, removed, and reordered

### Export / Import

- `configEntries` round-trip correctly
- `settlementRoutes` round-trip correctly
- invalid routes fail closed
- missing required config fails closed

### Runtime

- no routes configured -> playable closes cleanly
- success route -> correct event triggers
- failure route -> correct event triggers
- multiple routes -> first matched route only
- no matched route -> close-only behavior

### Regression

- `city-begging` no longer hardcodes stamina settlement ownership
- second and later runs continue to use the current player status correctly
- reward and stamina persistence come from event/settlement handling, not direct playable-owned writes

## Recommended Delivery Order

1. remove shared top summary/workbench band from remaining editor modules that still use it
2. introduce playable-instance three-tab layout
3. introduce `configEntries` and `settlementRoutes` authoring model
4. wire export/import validation
5. route playable completion through fact-only result matching
6. migrate `city-begging`
7. migrate `grain-accounting`
8. migrate `medicine-compounding`

## Acceptance Criteria

This design is complete when:

- creators edit playable instances through `基础 / 配置组 / 结算组`
- no module still shows the old large workbench overview band
- playable instances no longer author rewards directly
- built-in playables no longer own final stamina/reward persistence
- completion routes can select different success/failure branches through authored target events
- all final rewards still execute only through settlement runtime
