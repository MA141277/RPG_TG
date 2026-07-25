# Script Editor Settlement Structured Authoring Design

## Status

- Status: `proposed`
- Date: `2026-07-25`
- Owner: `Codex`
- Scope: `Redefines Script Editor settlement authoring so creators use a structured settlement-content model, settlement-level follow-up routing, and typed calculable attributes instead of creator-visible ids, descriptions, free-text result rows, or result-local routing.`

---

## 1. Purpose

The current settlement authoring surface exposes a half-technical record shape:

- settlement id is creator-visible
- settlement description is creator-visible
- settlement rows are framed as "results"
- result rows expose result ids
- follow-up routing sits on each result row
- result content is not structured enough for runtime to consume directly

That model is not aligned with creator workflow or runtime truth.

This design replaces it with a creator-facing settlement editor where:

- creators work with settlement titles rather than visible ids
- settlement content is authored as structured write-back operations
- follow-up routing is a settlement-level slot
- runtime consumes structured settlement content directly
- only calculable attributes are available for settlement authoring

---

## 2. Design Goals

1. Keep Script Editor settlement authoring in the same visual style as the rest of the workspace.
2. Remove creator-visible ids and other technical fields from settlement authoring.
3. Make settlement content directly executable by runtime without free-text interpretation.
4. Keep `event` as the only routing owner and keep settlement follow-up at settlement level rather than content-row level.
5. Support an extensible target-family model while limiting this round to `人物 / 城市 / 建筑`.
6. Restrict settlement authoring to calculable attributes only.
7. Keep hidden technical identity available for storage/export/runtime while presenting creator-facing title-based binding.

---

## 3. Non-Goals

- introducing a second routing owner besides `event`
- adding resolver, selector, or intermediate routing layers
- supporting free-text settlement meaning in runtime
- exposing strings or storage-only attributes as settlement-operable targets
- expanding the first target-family rollout beyond `人物 / 城市 / 建筑`
- adding non-`设为` boolean or enum operators in this round

---

## 4. Creator-Facing UI Model

### 4.1 Settlement List

The settlement list should show only creator-facing information:

- settlement title

It should not show:

- settlement id
- result id
- description summary blocks
- technical overview banners above the editor

### 4.2 Settlement Detail Layout

The settlement detail view should contain only three top-level blocks:

1. `结算标题`
2. `后续事件`
3. `结算内容`

The following current fields are removed from the creator-facing editor:

- `结算 ID`
- `结算说明`
- `结果 ID`
- `结果标签`
- result-local `后续事件`

### 4.3 Naming

The editor terminology must change from:

- `结算结果`

to:

- `结算内容`

This is not a cosmetic rename only. It reflects that each row is a structured settlement operation, not a loosely named branch result.

### 4.4 Event Binding Display

Events still bind settlements through the existing technical reference seam.

But in the editor:

- creators choose a settlement by title
- creators never see `settlementId`

The creator-facing title is therefore the lookup handle, while the hidden technical key remains the stored/runtime reference.

### 4.5 Title Uniqueness

Because settlement title is the creator-facing binding handle, settlement titles must be unique inside one project.

If duplicate settlement titles exist:

- the editor must treat that as invalid authoring state
- export and runtime-pack generation must fail closed

---

## 5. Settlement Data Model

### 5.1 Current Shape To Retire

The current settlement shape is effectively:

```ts
type Settlement = {
  id: string;
  title: string;
  description?: string;
  results?: Array<{
    id: string;
    label: string;
    nextEventId?: string;
  }>;
};
```

That shape cannot describe executable settlement semantics.

### 5.2 New Shape

Settlement should converge to this logical model:

```ts
type Settlement = {
  id: string;
  title: string;
  nextEventId?: string;
  contents: SettlementContent[];
};

type SettlementContent = {
  targetFamily: "person" | "city" | "building";
  targetId: string;
  attributeKey: string;
  operation: "add" | "subtract" | "set";
  value: number | boolean | string;
};
```

Notes:

- hidden `id` remains as the technical storage/runtime key
- `title` is the creator-facing binding handle
- `nextEventId` moves to settlement level
- `contents[]` replaces free-text result rows

### 5.3 Type-Safe Value Semantics

The stored `value` meaning depends on attribute type:

- numeric attribute -> `number`
- boolean attribute -> `boolean`
- enum attribute -> enum option key

String/text attributes are not valid settlement content targets and therefore never produce settlement `value` rows.

---

## 6. Calculable Attribute Model

Settlement authoring must not expose every field on a record.

The only valid settlement targets are calculable attributes.

### 6.1 Supported Attribute Types

The first formal calculable attribute types are:

- `数值`
- `开关`
- `选项`
- `文本`

These map to technical categories:

- `数值` -> numeric/integer
- `开关` -> boolean
- `选项` -> enum
- `文本` -> string

### 6.2 Settlement Eligibility

Settlement content may target only:

- `数值`
- `开关`
- `选项`

Settlement content may not target:

- `文本`
- descriptions
- labels
- notes
- storage-only free-value fields
- arbitrary custom objects

### 6.3 Operator Matrix

Operators are constrained by attribute type:

| Creator Type | Allowed Operations |
| --- | --- |
| `数值` | `增加`, `减少`, `设为` |
| `开关` | `设为` |
| `选项` | `设为` |
| `文本` | not available in settlement content |

This round does not support:

- boolean toggle
- enum cycle
- computed expressions
- string concatenation or template write-back

---

## 7. Person Attribute Authoring Changes

The person module must expose attribute type selection when authors create a custom attribute.

### 7.1 Creator-Facing Type Labels

The editor should present these creator-facing labels:

- `数值`
- `开关`
- `选项`
- `文本`

The UI should not expose raw technical words like `integer`, `boolean`, `enum`, or `string` as the primary creator vocabulary.

### 7.2 Authoring Requirements

When adding a person custom attribute, creators must define:

1. attribute display label
2. attribute storage key
3. attribute type

If the chosen type is `选项`, the editor must also require the enum option set.

### 7.3 Settlement Integration

Only typed person attributes that are calculable become available in settlement content pickers.

That means:

- `数值` person attributes can be increased, decreased, or set
- `开关` person attributes can be set
- `选项` person attributes can be set
- `文本` person attributes never appear in settlement content authoring

---

## 8. Settlement Content Picker Design

Each settlement content row should be authored through a structured picker flow:

1. choose `目标类型`
2. choose `目标对象`
3. choose `属性`
4. choose `操作`
5. enter or choose `值`

### 8.1 First-Round Target Families

The first-round target families are:

- `人物`
- `城市`
- `建筑`

The design must keep a registry-style extension seam so future families can be added without replacing settlement fundamentals.

### 8.2 Attribute Availability

The attribute list must be filtered by:

- chosen target family
- chosen target object
- attribute calculability
- attribute type

The UI must never offer an attribute that runtime cannot consume.

### 8.3 Value Control By Attribute Type

The editor control for `值` depends on attribute type:

- `数值` -> numeric input
- `开关` -> true/false select
- `选项` -> enum option select

There should be no generic free-text value input for settlement content rows.

---

## 9. Routing Boundary

Settlement is not a routing owner.

The routing boundary remains:

- `event` owns follow-up routing
- settlement owns write-back content only

The practical convergence rule in this design is:

- `nextEventId` exists once per settlement
- settlement content rows do not own routing
- settlement content rows do not branch into separate next events

This keeps the settlement model compatible with the already approved event-owned routing line.

---

## 10. Runtime Consumption Model

Runtime must stop inferring settlement meaning from creator-entered text.

Instead, settlement runtime consumption should work as:

1. resolve settlement by hidden technical key
2. read settlement-level `nextEventId`
3. iterate `contents[]`
4. apply each content row through a target-family attribute applier

### 10.1 Runtime Application Contract

Each settlement content row must be interpreted from explicit fields:

- target family
- target id
- attribute key
- operation
- typed value

Runtime should never depend on:

- result label wording
- free-text descriptions
- hidden assumptions about row order

### 10.2 Family Extension Seam

The runtime should use a family-based applicator seam:

- `person` applicator
- `city` applicator
- `building` applicator

Future target families can be added by registering:

- target lookup
- attribute metadata
- operation validation
- write-back logic

This preserves extensibility without widening the first release scope.

---

## 11. Validation And Fail-Closed Rules

The editor, export path, and runtime pack loading must fail closed for malformed settlement authoring.

### 11.1 Settlement Validation

Settlement records are invalid if:

- title is empty
- title duplicates another settlement title
- settlement content row is missing target family
- settlement content row is missing target id
- settlement content row is missing attribute key
- settlement content row uses an operation not allowed by attribute type
- settlement content row value does not match the attribute type
- settlement-level `nextEventId` references a missing event
- settlement-level `nextEventId` points to an invalid or retired event target

### 11.2 Picker Validation

The editor must not permit:

- selecting storage-only fields
- selecting text attributes in settlement content
- entering arbitrary text for enum or boolean values
- authoring result-level routing

### 11.3 Event Validation

Event-side settlement routing remains invalid if:

- `type = settlement` and settlement reference is empty
- settlement reference points to a missing settlement

The event editor should display titles, but validation still resolves against the stored hidden technical key.

---

## 12. Migration Rules

This design retires the old settlement-result model.

### 12.1 Fields To Retire

The following old fields are retired:

- settlement `description`
- settlement result `id`
- settlement result `label`
- settlement result-local `nextEventId`

### 12.2 Safe Migration Rule

Migration may automatically promote old result-local routing only when:

- all retained old result rows point to the same non-empty `nextEventId`

In that case:

- promote that value to settlement-level `nextEventId`

### 12.3 Fail-Closed Migration Cases

Migration must fail closed if:

- different old result rows point to different `nextEventId` values
- old rows contain free-text meaning that cannot be mapped to structured content
- a settlement depends on `description` or `label` semantics that runtime can no longer interpret

There is no compatibility mode where old free-text settlement rows continue to execute implicitly.

---

## 13. Affected Surfaces

This design implies bounded changes across:

- settlement domain types
- settlement normalization helpers
- Script Editor settlement UI
- event-side settlement selector UI
- person custom attribute authoring UI
- settlement export/import/save/load validation
- runtime settlement consumption

This design does not require broader routing redesign because the routing owner remains unchanged.

---

## 14. Testing Requirements

Implementation should prove the following:

1. settlement editor no longer shows creator-visible ids or description fields
2. settlement editor stores settlement-level `nextEventId`
3. settlement content rows are structured and typed
4. event authoring shows settlement title choices rather than technical ids
5. duplicate settlement titles fail closed
6. invalid content rows fail closed during save/export/import as appropriate
7. person custom attributes require type selection
8. `数值 / 开关 / 选项 / 文本` display labels render correctly in authoring
9. only calculable attributes appear in settlement content pickers
10. runtime correctly applies numeric add/subtract/set operations
11. runtime correctly applies boolean and enum `设为`
12. string/text attributes are rejected from settlement content execution
13. old result-local routing either migrates safely to settlement-level `nextEventId` or fails closed

---

## 15. Acceptance Criteria

This design is satisfied when all are true:

- creators no longer see settlement id, result id, or settlement description in the settlement editor
- settlement authoring uses `结算内容` instead of result-label rows
- `后续事件` is a settlement-level field rather than a content-row field
- settlement content is authored through structured target/attribute/operator/value controls
- only calculable attributes are available to settlement content authoring
- person custom attributes require creator-facing type selection using `数值 / 开关 / 选项 / 文本`
- runtime can consume settlement content directly without interpreting free text
- hidden technical ids remain storage/runtime truth while creator-facing binding uses settlement titles
- invalid or ambiguous old settlement-result data does not continue through implicit compatibility behavior
