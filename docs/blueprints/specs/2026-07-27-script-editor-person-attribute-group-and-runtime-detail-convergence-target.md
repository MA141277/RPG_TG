# Script Editor Person Attribute Group And Runtime Detail Convergence

## Control Block

- version_id: `target.script-editor-person-attribute-group-and-runtime-detail-convergence`
- version_label: `script-editor-person-attribute-group-and-runtime-detail-convergence`
- closeout_contract_version: `v1`

## Human Context

### Goal

- `Make person attribute groups a formal first-level field in script-editor people records, remove ad hoc stat/skill editing blocks from the person profile tab, and make runtime character-detail surfaces read configured detail groups instead of hardcoded stat/skill sections.`

### Version Draft Summary

- Goal:
  - `Converge script-editor person authoring and runtime character-detail presentation on one creator-authored attribute-group contract.`
- Required outcomes:
  - `Add a formal first-level attributeGroups field to script-editor people records.`
  - `Reclassify zhuyuanzhang person fields into fixed first-level fields versus typed custom attributes with no hidden stat/skill editor blocks in the profile tab.`
  - `Make runtime character-detail surfaces read configured basic/ability/skill detail groups instead of hardcoded stats and skills lists.`
- Explicit non-goals:
  - `Do not redesign unrelated building, city, event, or progression authoring surfaces.`
  - `Do not retire runtime CharacterDefinition.stats or CharacterDefinition.skills in this version.`
- Must preserve:
  - `Existing gameplay systems that consume CharacterDefinition.stats, CharacterDefinition.skills, stamina, clanId, and related runtime fields must continue to work unchanged.`
  - `Existing zhuyuanzhang runtime pack export must still produce runtime-compatible characters.json with stats and skills present.`
- Must replace:
  - `The person profile tab's hardcoded ability-property and skill-property editing blocks.`
  - `The runtime character-detail view's hardcoded basic-info / ability-info / skill-info field lists and skill icon source table as the only source of truth.`
- Reference material:
  - `src/content/scenario-packs/zhuyuanzhang/characters.json`
  - `src/application/script-editor/person-authoring.ts`
  - `src/domain/script-editor-project.ts`
  - `src/domain/character.ts`
  - `src/ui/main-ui/main-ui-flow.js`
  - `src/ui/views/character/character-detail-view.ts`

### Evidence Draft Review

- evidence_draft_status: `reviewed`
- reviewed_by_operator: `yes`
- review_summary:
  - `Operator clarified that attribute groups must become formal first-level person-record fields, that current ability/skill editor blocks are out of scope and should be removed, and that runtime character-detail surfaces must read creator-authored detail groups.`

### Draft Requirement Coverage

| Draft Requirement | Acceptance IDs | Status |
| --- | --- | --- |
| `Person records must own formal attribute-group truth.` | `ACC-PERSON-GROUP-001` | `covered` |
| `zhuyuanzhang person fields must be inventoried and classified into fixed first-level fields versus custom attributes.` | `ACC-PERSON-GROUP-002` | `covered` |
| `Profile tab must stop exposing hardcoded ability/skill editing blocks.` | `ACC-PERSON-GROUP-003` | `covered` |
| `Runtime character detail must read creator-authored detail groups instead of hardcoded stat/skill sections.` | `ACC-PERSON-GROUP-004` | `covered` |
| `Runtime gameplay compatibility with CharacterDefinition.stats and CharacterDefinition.skills must remain intact.` | `ACC-PERSON-GROUP-005` | `covered` |

### Scope

- `Add a formal ScriptEditorPersonAttributeGroup contract and persist it on ScriptEditorPersonRecord as a first-level field.`
- `Define how fixed first-level fields, custom attributes, and attribute-group items are sourced from zhuyuanzhang person records.`
- `Remove hardcoded ability/skill blocks from the person profile tab and reserve a dedicated future attribute-group tab against the new persisted data source.`
- `Route runtime character-detail surfaces to read configured basic-info / ability-info / skill-info groups from person-authored attributeGroups.`
- `Keep runtime export/import compatibility so stats and skills remain materialized for gameplay even when the authoring truth is grouped.`

### Non-Goals

- `No attempt to generalize attributeGroups to city, building, or non-person records in this version.`
- `No redesign of battle, map, event-binding, or settlement runtime presentation.`
- `No retirement of current CharacterDefinition numerical runtime fields used by gameplay logic.`
- `No immediate exposure of a finished creator-facing attribute-group tab in this version unless required by minimal contract completion; this target only reserves that field and source-of-truth model.`

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-person-attribute-group-schema-and-import-classification` | `required` | `Owns person-record field contract, zhuyuanzhang field classification, and import/export compatibility normalization.` | `May open once the new formal person attribute-group field contract and source classification table are frozen in tests and spec.` |
| `queue.script-editor-person-authoring-surface-attribute-group-prep` | `required` | `Owns profile-tab cleanup, fixed-field/custom-attribute rendering alignment, and future attribute-group tab source preparation.` | `May open after queue.script-editor-person-attribute-group-schema-and-import-classification lands the durable record contract.` |
| `queue.runtime-character-detail-attribute-group-consumption` | `required` | `Owns runtime character-detail presenter/view migration from hardcoded sections to creator-authored attribute-group reads.` | `May open after the person-record attribute-group contract and runtime loading path are stable enough for presenter/view consumption.` |

### Acceptance Matrix

| Acceptance ID | Requirement | Primary Owner Queue | Proof Type | Expected Implementation Anchor | Closeout Blocker |
| --- | --- | --- | --- | --- | --- |
| `ACC-PERSON-GROUP-001` | `ScriptEditorPersonRecord owns formal first-level attributeGroups truth with a stable typed contract.` | `queue.script-editor-person-attribute-group-schema-and-import-classification` | `unit` | `src/domain/script-editor-project.ts`, `src/application/script-editor/person-authoring.ts`, `tests/robustness.test.cjs` | `Person records still rely on implicit UI-only grouping or ad hoc extendedAttributes conventions.` |
| `ACC-PERSON-GROUP-002` | `zhuyuanzhang characters.json fields are classified into fixed first-level fields, retained runtime compatibility fields, and creator-visible custom attributes.` | `queue.script-editor-person-attribute-group-schema-and-import-classification` | `integration` | `src/content/scenario-packs/zhuyuanzhang/characters.json`, `src/application/script-editor/runtime-pack-import.ts`, `tests/robustness.test.cjs` | `Imported zhuyuanzhang person data still lands in the wrong authoring bucket or loses creator-visible fields.` |
| `ACC-PERSON-GROUP-003` | `The person profile tab no longer renders hardcoded ability-property or skill-property editing sections; those values instead flow through custom-attribute and attribute-group source truth.` | `queue.script-editor-person-authoring-surface-attribute-group-prep` | `source-removal` | `src/ui/main-ui/main-ui-flow.js`, `tests/robustness.test.cjs` | `Profile tab still directly edits stats/skills through dedicated blocks or presents misleading out-of-scope sections.` |
| `ACC-PERSON-GROUP-004` | `Runtime character-detail surfaces read configured detail groups and resolve their contents from person data instead of using hardcoded DETAIL_SKILLS, STAT_LABELS, and fixed basic-info rows as sole truth.` | `queue.runtime-character-detail-attribute-group-consumption` | `integration` | `src/ui/views/character/character-detail-view.ts`, `src/ui/app-render.ts`, `tests/robustness.test.cjs` | `Runtime detail view remains coupled to hardcoded stat/skill lists and ignores configured attributeGroups.` |
| `ACC-PERSON-GROUP-005` | `Gameplay-compatible CharacterDefinition.stats, CharacterDefinition.skills, and related numeric runtime fields remain available for existing runtime systems even after authoring shifts to grouped detail truth.` | `queue.script-editor-person-attribute-group-schema-and-import-classification` | `integration` | `src/domain/character.ts`, `src/application/script-editor/person-authoring.ts`, `src/application/script-editor/runtime-pack-export.ts`, `tests/robustness.test.cjs` | `Gameplay consumers break because grouped authoring displaces runtime stats/skills storage instead of layering on top of it.` |

### Acceptance Criteria

- `Person attribute groups are durable first-level person-record data, not a UI-only projection.`
- `zhuyuanzhang person records map fixed fields into formal first-level slots and reserve stats/skills leaves as creator-visible attribute sources rather than direct profile-tab sections.`
- `Creator-facing runtime-path leakage is removed from the profile tab; stat/skill fields are no longer shown there as hardcoded editor blocks.`
- `Runtime basic-info / ability-info / skill-info surfaces resolve from configured attribute groups and can be replaced by creator-authored group content without code edits.`
- `Existing runtime gameplay systems continue reading CharacterDefinition.stats and CharacterDefinition.skills without additional migration work in this version.`

### Final Acceptance Coverage Contract

- `Final validation must review the Acceptance Matrix rather than only confirming that one person record renders.`
- `Each queue must prove its owned acceptance through tests or source-removal evidence before version closeout.`
- `Runtime character-detail smoke validation must include at least one zhuyuanzhang person whose creator-authored detail groups differ from the prior hardcoded defaults.`

### Version Closeout Contract

- `This version may close only after the person-record attribute-group contract, authoring-surface cleanup, and runtime detail-group consumption all land with regression coverage.`
- `As long as the version remains open and no active queue exists, a new queue may still be admitted if additional grouped-detail compatibility work is discovered.`
- `No queue may claim success merely because grouped UI renders; durable person-record truth and runtime consumer alignment must both be present.`

### Archived Interpretation

- `This target supersedes the earlier short-lived local attempt to flatten stats and skills directly into the person profile tab. The approved direction is persistent grouped authoring truth, not further hardcoded stat/skill panel expansion.`

## Person Field Inventory

### zhuyuanzhang Person Source Fields

The current builtin zhuyuanzhang `characters.json` inventory contains these top-level fields:

- `id`
- `personType`
- `role`
- `name`
- `birthYear`
- `deathYear`
- `age`
- `clanId`
- `title`
- `occupation`
- `cityId`
- `houseId`
- `portraitId`
- `portraitVariantId`
- `affiliationLabel`
- `stats`
- `stamina`
- `biography`
- `availableFunctions`
- `skills`
- `flags`
- `isHistoricalFigure`
- `leaderResidenceEligible`
- `leaderResidenceStatus`
- `teachableSkillKeys`

Nested field families:

- `stats`: `leadership`, `martial`, `intelligence`, `politics`, `charm`, `fame`, `gold`
- `skills`: `ashigaru`, `horse`, `teppo`, `navy`, `archery`, `martial`, `military`, `ninjutsu`, `construction`, `development`, `mining`, `arithmetic`, `etiquette`, `rhetoric`, `tea`, `medicine`

### Fixed First-Level Person Fields

These remain formal first-level fields on `ScriptEditorPersonRecord` and should render directly in the creator-facing basic profile surface:

- `id`
- `name`
- `personType`
- `role`
- `birthYear`
- `deathYear`
- `age`
- `clanId`
- `title`
- `occupation`
- `affiliationLabel`
- `cityId`
- `houseId`
- `portraitId`
- `portraitVariantId`
- `stamina`
- `biography`

### Creator-Visible Custom Attribute Sources

These remain creator-visible typed attributes, but do not deserve their own dedicated hardcoded profile sections:

- `stats.*`
- `skills.*`
- `flags`
- `isHistoricalFigure`
- `leaderResidenceEligible`
- `leaderResidenceStatus`
- `teachableSkillKeys`

### Runtime-Compatible But Not Primary Authoring Surfaces

These must remain available to runtime/gameplay consumers, but the editor should not present them as separate hardcoded panels:

- `stats`
- `skills`
- `availableFunctions`

## Selected Architecture

### Approach Options

1. `UI-only grouping over existing stats/skills`
   - Lowest immediate cost.
   - Rejected because it leaves no durable attribute-group truth for the future tab and runtime consumption.

2. `Formal attributeGroups field layered over existing runtime stats/skills`
   - Recommended.
   - Adds persistent creator-authored grouping while preserving gameplay compatibility.
   - Lets runtime detail views consume creator-authored group layouts without forcing an immediate gameplay-schema rewrite.

3. `Full runtime retirement of stats/skills in favor of group-only storage`
   - Cleanest end-state, but too disruptive for this version.
   - Rejected because it would force broad gameplay and save/runtime migration beyond the approved scope.

### Recommended Contract

Add a first-level person field:

```ts
type ScriptEditorPersonAttributeGroup = {
  id: string;
  title: string;
  presentation: "basic-info" | "ability-info" | "skill-info" | "list";
  items: Array<{
    fieldKey: string;
    labelOverride?: string;
  }>;
};
```

and persist it on:

```ts
type ScriptEditorPersonRecord = {
  ...
  attributeGroups?: ScriptEditorPersonAttributeGroup[];
};
```

Rationale:

- `id` gives a stable authoring identity.
- `title` drives creator and runtime headers such as `基础情报`, `能力情报`, `技能情报`.
- `presentation` preserves the current runtime visual families without leaving them hardcoded as the only source of truth.
- `items[].fieldKey` references either fixed first-level fields or creator-visible custom attributes, including `stats.*` and `skills.*`.

## Concrete Person Record Field Design

### First-Level Person Fields

The durable `ScriptEditorPersonRecord` contract should be treated as four top-level buckets:

1. fixed identity and placement fields
2. fixed profile fields
3. creator-visible custom attributes
4. creator-authored attribute groups

The first-level record shape should converge on:

```ts
type ScriptEditorPersonRecord = ScriptEditorEntityRecord & {
  id: string;
  name: string;
  personType?: "角色" | "NPC";
  role?: string;
  birthYear?: number;
  deathYear?: number | null;
  age?: number;
  clanId?: string;
  title?: string;
  occupation?: string;
  affiliationLabel?: string;
  biography?: string;
  cityId?: string;
  houseId?: string;
  portraitId?: string;
  portraitVariantId?: string | null;
  stamina?: number;
  availableFunctions?: CharacterFunction[];
  extendedAttributes?: ScriptEditorTypedAttributeRecord[];
  attributeGroups?: ScriptEditorPersonAttributeGroup[];
  dialogueIds?: string[];
  eventIds?: string[];
  tradeBinding?: ScriptEditorPersonTradeBinding;
};
```

Rules:

- fixed first-level fields must remain explicit first-level keys and must not be mirrored into `extendedAttributes`
- `availableFunctions`, `dialogueIds`, `eventIds`, and `tradeBinding` remain existing dedicated contracts rather than being folded into custom attributes
- `attributeGroups` becomes a first-level durable field alongside `extendedAttributes`, not a derived runtime-only projection

### Fixed First-Level Field Set

The builtin zhuyuanzhang inventory must classify these as fixed first-level fields:

| Field | Creator Bucket | Notes |
| --- | --- | --- |
| `id` | fixed | Stable person record identity |
| `name` | fixed | Person display name |
| `personType` | fixed | `角色` / `NPC` |
| `role` | fixed | Runtime role compatibility |
| `birthYear` | fixed | Basic profile |
| `deathYear` | fixed | Basic profile |
| `age` | fixed | Basic profile |
| `clanId` | fixed | Basic profile |
| `title` | fixed | Basic profile |
| `occupation` | fixed | Basic profile |
| `affiliationLabel` | fixed | Basic profile |
| `biography` | fixed | Basic profile |
| `cityId` | fixed | Placement |
| `houseId` | fixed | Placement |
| `portraitId` | fixed | Portrait binding |
| `portraitVariantId` | fixed | Portrait compatibility |
| `stamina` | fixed | Runtime-compatible fixed field |

### Custom Attribute Field Set

The following zhuyuanzhang fields should be normalized into creator-visible `extendedAttributes` entries instead of bespoke profile controls:

| Source Field | Stored key | Expected type |
| --- | --- | --- |
| `stats.leadership` | `stats.leadership` | `number` |
| `stats.martial` | `stats.martial` | `number` |
| `stats.intelligence` | `stats.intelligence` | `number` |
| `stats.politics` | `stats.politics` | `number` |
| `stats.charm` | `stats.charm` | `number` |
| `stats.fame` | `stats.fame` | `number` |
| `stats.gold` | `stats.gold` | `number` |
| `skills.ashigaru` | `skills.ashigaru` | `number` |
| `skills.horse` | `skills.horse` | `number` |
| `skills.teppo` | `skills.teppo` | `number` |
| `skills.navy` | `skills.navy` | `number` |
| `skills.archery` | `skills.archery` | `number` |
| `skills.martial` | `skills.martial` | `number` |
| `skills.military` | `skills.military` | `number` |
| `skills.ninjutsu` | `skills.ninjutsu` | `number` |
| `skills.construction` | `skills.construction` | `number` |
| `skills.development` | `skills.development` | `number` |
| `skills.mining` | `skills.mining` | `number` |
| `skills.arithmetic` | `skills.arithmetic` | `number` |
| `skills.etiquette` | `skills.etiquette` | `number` |
| `skills.rhetoric` | `skills.rhetoric` | `number` |
| `skills.tea` | `skills.tea` | `number` |
| `skills.medicine` | `skills.medicine` | `number` |
| `flags` | `flags` | `string` with JSON array payload under existing typed-attribute rules |
| `isHistoricalFigure` | `isHistoricalFigure` | `boolean` |
| `leaderResidenceEligible` | `leaderResidenceEligible` | `boolean` |
| `leaderResidenceStatus` | `leaderResidenceStatus` | `string` or `enum` |
| `teachableSkillKeys` | `teachableSkillKeys` | `string` with JSON array payload under existing typed-attribute rules |

Rules:

- the person profile tab must show these only through custom-attribute cards or future group-driven pickers
- no dedicated `能力属性` or `技能属性` sections may remain in the profile tab
- the stored `key` remains the durable authoring/runtime bridge, even when creator-facing labels are localized

### Attribute Group Contract

The formal first-level `attributeGroups` field should use:

```ts
type ScriptEditorPersonAttributeGroup = {
  id: string;
  title: string;
  presentation: "basic-info" | "ability-info" | "skill-info" | "list";
  items: ScriptEditorPersonAttributeGroupItem[];
};

type ScriptEditorPersonAttributeGroupItem = {
  fieldKey: string;
  labelOverride?: string;
};
```

Rules:

- `id` must be unique within one person record
- `title` is creator-authored visible text
- `presentation` selects the runtime rendering family
- `fieldKey` must reference either:
  - a fixed first-level field such as `title`, `occupation`, `age`, `clanId`
  - a typed custom-attribute key such as `stats.leadership`, `skills.archery`, `flags`
- attribute-group items do not store duplicated values; they reference existing person data
- deleting a group removes only the container, not the underlying field values
- deleting a custom attribute invalidates any group item that references that attribute and must be caught fail-closed by authoring validation

### Default Builtin Group Recommendation

Builtin zhuyuanzhang imported people should receive these default groups when no explicit `attributeGroups` field exists yet:

```json
[
  {
    "id": "group.basic-info",
    "title": "基础情报",
    "presentation": "basic-info",
    "items": [
      { "fieldKey": "clanId", "labelOverride": "所属" },
      { "fieldKey": "cityId", "labelOverride": "据点" },
      { "fieldKey": "title", "labelOverride": "身份" },
      { "fieldKey": "occupation", "labelOverride": "职业" },
      { "fieldKey": "age", "labelOverride": "年龄" }
    ]
  },
  {
    "id": "group.ability-info",
    "title": "能力情报",
    "presentation": "ability-info",
    "items": [
      { "fieldKey": "stats.leadership", "labelOverride": "统帅" },
      { "fieldKey": "stats.martial", "labelOverride": "武勇" },
      { "fieldKey": "stats.intelligence", "labelOverride": "智谋" },
      { "fieldKey": "stats.politics", "labelOverride": "政务" },
      { "fieldKey": "stats.charm", "labelOverride": "魅力" },
      { "fieldKey": "stats.fame", "labelOverride": "声望" }
    ]
  },
  {
    "id": "group.skill-info",
    "title": "技能情报",
    "presentation": "skill-info",
    "items": [
      { "fieldKey": "skills.ashigaru", "labelOverride": "足轻" },
      { "fieldKey": "skills.horse", "labelOverride": "骑术" },
      { "fieldKey": "skills.archery", "labelOverride": "弓术" },
      { "fieldKey": "skills.military", "labelOverride": "军略" },
      { "fieldKey": "skills.ninjutsu", "labelOverride": "忍术" },
      { "fieldKey": "skills.rhetoric", "labelOverride": "口才" }
    ]
  }
]
```

This default is only a migration seed:

- creators may later add or remove groups
- creators may add or remove items within a group
- runtime presentation must consume the actual persisted groups, not re-synthesize these defaults after migration

## Runtime Read Model

### Runtime Compatibility Rule

`CharacterDefinition.stats` and `CharacterDefinition.skills` remain intact for gameplay. Attribute groups do not replace those storage families in this version; they become the runtime detail presentation truth.

### Runtime Detail Resolution

Runtime character-detail surfaces must:

1. load the active person's configured `attributeGroups`
2. select the relevant group by `presentation` or stable `id`
3. resolve each `fieldKey` against:
   - fixed first-level `CharacterDefinition` fields
   - runtime `stats.*`
   - runtime `skills.*`
   - typed custom-property / extended-attribute compatibility records when supported
4. render the resolved items using the group's configured presentation family

This replaces the current hardcoded assumptions that:

- `基本情报` is a fixed row set from city/clan/lord/equipment strings
- `能力情报` always maps to fixed stat meters
- `技能情报` always maps to the static `DETAIL_SKILLS` table

## Authoring Surface Boundary

### Person Profile Tab

The person `属性` tab should only present:

- fixed first-level basic fields
- true custom-attribute cards

It must not present:

- hardcoded `能力属性`
- hardcoded `技能属性`

`stats.*` and `skills.*` remain available as typed custom-attribute sources and later as selectable attribute-group items, but not as separate dedicated editor panels in this tab.

### Future Attribute Group Tab

The future `属性组` tab will use `person.attributeGroups` as its only source of truth. Each group can be added or removed by the creator and can draw its items from:

- fixed first-level basic fields
- creator-visible custom attributes

No additional implicit grouping should exist outside `attributeGroups`.

## Queue Split Recommendation

### First Queue

`queue.script-editor-person-attribute-group-schema-and-import-classification`

Why first:

- the durable field contract must exist before UI cleanup or runtime consumption can be correct
- zhuyuanzhang field classification must be frozen before authoring surfaces can render the right buckets

### Second Queue

`queue.script-editor-person-authoring-surface-attribute-group-prep`

Why second:

- profile-tab cleanup depends on the new durable grouping contract
- this queue can remove the unauthorized ability/skill blocks and align fixed/custom rendering

### Third Queue

`queue.runtime-character-detail-attribute-group-consumption`

Why third:

- runtime detail migration should consume already-stable grouped truth rather than define the contract itself
