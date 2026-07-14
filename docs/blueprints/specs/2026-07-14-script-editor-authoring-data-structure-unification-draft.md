# Script Editor Authoring Data Structure Unification Draft

## Control Block

- document_role: `successor-version-draft`
- draft_id: `draft.script-editor-authoring-data-structure-unification`
- proposed_version_id: `target.script-editor-authoring-data-structure-unification`
- draft_status: `draft`
- parent_context: `target.script-editor-runtime-pack-unification`
- activation_status: `not-active`
- current_blueprint_pointer_change: `none`
- closeout_contract_version: `draft-v1`

## Human Context

### Draft Purpose

- `Record the next-version candidate direction before formal target and reference documents are written.`
- `This draft is not live Blueprint truth and does not replace the current active version pointers.`
- `The next formal version should be created only after the current runtime-pack-unification version reaches lawful closeout or explicit supersession.`

### Proposed Version Goal

- `Unify script-editor authoring surfaces and data-facing runtime structures so creators edit the same structures that scenario-pack export and runtime consumption use.`
- `Revise previously frozen script-editor structures where they no longer fit the authoring/data unification target.`
- `Fill missing authoring-surface capabilities that would otherwise leave the unified data model uneditable.`
- `Update runtime logic so it consumes unified data structures and separate status overlays instead of relying on legacy fixed character fields or authoring-only shadows.`

### Background From Discussion

- `The current character model mixes authoring-facing people fields, runtime CharacterDefinition fields, mutable stats, and editor-only helper fields.`
- `A projection-only export fix would prevent field leakage but would preserve two durable truths, which conflicts with the desired next-version direction.`
- `The preferred direction is to make the authoring data structure itself the runtime-consumable data structure, then move mutable progress into a separate save/status overlay.`
- `New game startup should not require a status object. If status is absent or empty, the runtime should use the character definition as authored.`
- `Status is a save-time patch/overlay, not the source of initial character values.`

### Proposed Character Definition Shape

The proposed character definition stored in `characters.json` is:

```ts
type CharacterDefinition = {
  id: string;

  baseAttributes: {
    name: string;
    personType: "角色" | "NPC";
    role: string;
    portraitId?: string;
    portraitVariantId?: string | null;
    biography?: string;
  };

  extendedAttributes: {
    profileMap: Record<string, string | number | boolean | null | string[] | number[]>;
    statMap: Record<string, number>;
    skillMap: Record<string, number>;
    customMap: Record<string, string | number | boolean | null | string[] | number[]>;
  };

  dialogueIds: string[];
  eventIds: string[];

  tradeBinding?: {
    enabled: boolean;
    entryId: string;
  };
};
```

Rules:

- `baseAttributes` contains only the minimum stable fields needed to create and identify a person in the authoring surface.
- `extendedAttributes.profileMap` owns profile, role-context, location, historical, and label fields such as birthYear, deathYear, age, title, occupation, affiliationLabel, cityId, houseId, flags, and isHistoricalFigure.
- `extendedAttributes.statMap` owns runtime numeric values such as gold, fame, stamina, leadership, martial, intelligence, politics, charm, and creator-defined numeric stats.
- `extendedAttributes.skillMap` owns skill values and must stay separate from statMap even though both are numeric.
- `extendedAttributes.customMap` owns creator-defined attributes that are not yet promoted into a profile/stat/skill group.
- `dialogueIds`, `eventIds`, and `tradeBinding` are first-level character fields because the authoring surface edits them as character-facing relationships or bindings.
- `relationMap` and `bindingMap` should not be introduced for this character model unless later evidence proves first-level fields create ambiguity.

### Proposed Field Id Convention

The draft adopts a numbered field-id convention for authoring and runtime data exchange:

```text
10001_00001
```

Rules:

- `The first digit group identifies the entity family, so the leading 1 means person.`
- `The middle digit group identifies the current person index.`
- `The trailing digit group identifies the field index within that person.`
- `The format should stay fixed-width so machine generation and parsing remain stable.`
- `Field ids are machine identifiers, not human-readable labels.`
- `A separate mapping table must translate each field id into a semantic key and a display label for UI use.`

Recommended companion mapping shape:

```ts
type CharacterFieldDisplayMap = Record<string, string>;
```

Example:

```json
{
  "10001_00001": "姓名",
  "10001_00002": "人物类型",
  "10001_00003": "角色定位"
}
```

Companion semantics:

- `fieldId` identifies the storage slot.
- `canonicalKey` preserves the semantic meaning of the slot.
- `label` is the UI-facing display name.
- `The draft currently prefers numeric field ids plus a separate display map rather than English field keys alone.`

### Proposed Field Mapping Table

The next version draft also includes a field mapping table so the authoring surface can know which fields exist and how to render them.

Suggested structure:

```ts
type CharacterFieldDefinition = {
  fieldId: string;
  canonicalKey: string;
  label: string;
  group: "baseAttributes" | "profileMap" | "statMap" | "skillMap" | "customMap";
  valueType: "string" | "number" | "boolean" | "enum" | "stringList" | "numberList";
  editable: boolean;
  runtimeMutable: boolean;
  required?: boolean;
  defaultValue?: unknown;
  min?: number;
  max?: number;
  enumOptions?: string[];
  order?: number;
};
```

Rules:

- `The field mapping table is the source of truth for which UI fields should render.`
- `The display map can remain a lightweight companion if only labels are needed in some views.`
- `The mapping table should be used to decide authoring controls, validation hints, runtime mutability, and field ordering.`
- `The same fieldId convention can be used across authoring, runtime, and migration helpers.`

Field mapping responsibilities:

- `baseAttributes` fields define the minimum authoring identity data.
- `profileMap` fields define descriptive or contextual character data.
- `statMap` fields define numeric gameplay state values.
- `skillMap` fields define skill progression values.
- `customMap` fields define creator-defined extensible data.

UI rendering rule:

- `The authoring UI should render only fields present in the mapping table unless a debug or advanced view explicitly asks for raw data.`
- `The display label comes from the mapping table or the display map, not from hardcoded component text.`

### Proposed Character Status Shape

Status is a save overlay. It is optional and should be created only after runtime changes exist.

```ts
type CharacterStatus = {
  statusId: string;
  saveId: string;
  scenarioPackId: string;
  characterId: string;

  baseAttributePatch?: Partial<CharacterDefinition["baseAttributes"]>;

  extendedAttributePatch?: {
    profileMap?: Record<string, unknown>;
    statMap?: Record<string, number>;
    skillMap?: Record<string, number>;
    customMap?: Record<string, unknown>;
  };

  dialogueIdsPatch?: string[];
  eventIdsPatch?: string[];

  tradeBindingPatch?: Partial<{
    enabled: boolean;
    entryId: string;
  }>;

  updatedAt: number;
  schemaVersion: number;
};
```

Rules:

- `statusId should include saveId, scenarioPackId, and characterId because one scenario character may have multiple save states.`
- `No status object is required for a new game.`
- `An empty status object must not change the loaded character view.`
- `Runtime mutation writes CharacterStatus patches instead of mutating CharacterDefinition.`
- `localStorage is only the persistence medium; status should be stored inside the unified SaveEnvelope rather than as scattered ad hoc objects.`

### Proposed Load And Save Semantics

New game:

```text
CharacterDefinition
```

Load save:

```text
CharacterDefinition + CharacterStatus patch = current character view
```

Selector rule:

```ts
function loadCharacterView(definition, status) {
  if (status == null || isEmptyStatus(status)) {
    return definition;
  }

  return applyCharacterStatusPatch(definition, status);
}
```

Runtime update rule:

```ts
updateCharacterStatus(characterId, {
  extendedAttributePatch: {
    statMap: {
      gold: nextGold
    }
  }
});
```

### Proposed Authoring Surface Requirements

- `The character authoring surface must edit baseAttributes directly.`
- `The character authoring surface must support profileMap, statMap, skillMap, and customMap editing.`
- `The authoring surface must support adding, editing, deleting, and validating custom attributes.`
- `dialogueIds and eventIds should be first-level authoring controls and use dropdown/reference selectors where possible.`
- `tradeBinding should be edited as a first-level character binding control.`
- `The authoring surface should not edit save status by default; status editing belongs only to preview/debug tools if introduced later.`
- `Missing authoring controls are in scope for this successor version because a unified data structure is not useful if creators cannot edit it.`

### Proposed Runtime Requirements

- `Runtime consumers must read character values through selectors or materialized character views rather than directly depending on the old fixed CharacterDefinition shape.`
- `Legacy reads such as character.stats.gold should be migrated to extendedAttributes.statMap or a selector such as selectCharacterStat(characterId, "gold").`
- `Runtime mutations must write CharacterStatus patches into SaveEnvelope.characterStatusById.`
- `The startup path must load characters without status for new games and must apply status overlays only during save restore.`
- `Scenario-pack validation must fail closed when required baseAttributes or required typed maps are malformed.`
- `The migration path must preserve compatibility with existing characters.json until the version explicitly retires the older shape.`

### Proposed Candidate Queues

| Queue ID | Class | Contract Role | Notes |
| --- | --- | --- | --- |
| `queue.script-editor-character-definition-status-convergence` | `required` | `CharacterDefinition, character authoring data, CharacterStatus overlay, and runtime character selectors` | `Recommended first queue because character data exposed the clearest mismatch between authoring structure, runtime data, and save mutation ownership.` |
| `queue.script-editor-character-authoring-surface-completion` | `required` | `Authoring controls for baseAttributes, profileMap, statMap, skillMap, customMap, dialogueIds, eventIds, and tradeBinding` | `May merge into the character convergence queue if scope stays small; should split if UI/control work becomes larger than the data/runtime migration.` |
| `queue.script-editor-authoring-data-schema-reference-freeze` | `required` | `Formal reference document for unified authoring/data structures and allowed status overlays` | `Should turn this draft into a stable spec before broader object-family migration begins.` |
| `queue.script-editor-city-building-structure-convergence` | `candidate` | `City/building authoring and runtime structure convergence` | `Later queue; do not absorb into character convergence.`
| `queue.script-editor-dialogue-event-structure-convergence` | `candidate` | `Dialogue, event, story-node, and scene-facing structure convergence` | `Later queue because narrative lowering and export/runtime semantics are broader than character data.`
| `queue.script-editor-minigame-binding-structure-convergence` | `candidate` | `Playable/minigame binding data structure convergence` | `Requires playable governance if it changes playable runtime or integration behavior.`
| `queue.script-editor-runtime-status-save-convergence` | `candidate` | `SaveEnvelope status overlay generalization beyond characters` | `May be required if status overlays expand to cities, houses, tasks, or global progress.`

### Proposed First Queue Sketch

#### `queue.script-editor-character-definition-status-convergence`

Scope:

- `Introduce the final CharacterDefinition shape for character records.`
- `Migrate script-editor people records toward the unified character definition shape.`
- `Introduce CharacterStatus as an optional save overlay.`
- `Add selectors/materializers that combine character definitions with status patches.`
- `Migrate covered runtime consumers away from direct fixed stats fields.`
- `Preserve old-shape compatibility behind an explicit migration adapter until the queue can retire it safely.`

Out of scope:

- `City/building/event/dialogue/minigame data convergence.`
- `Broad visual redesign of the script editor.`
- `Editing real save status from the normal authoring surface.`
- `Changing gameplay formulas except where required to consume selectors.`

Acceptance:

- `A new game can load a character without any status object.`
- `A save restore can apply CharacterStatus patches over the character definition.`
- `Character runtime mutations update status rather than mutating character definitions.`
- `The authoring structure and exported characters.json share the same character schema.`
- `Tests cover absence of status, empty status, stat patch overlay, skill patch overlay, and compatibility migration from the old character shape.`

### Draft Open Questions

- `Should character authoring surface completion be a separate queue or the second task inside character-definition-status convergence?`
- `Should custom attribute definitions live globally at the project/scenario-pack level, per character, or both?`
- `Which existing runtime consumers must be migrated in the first queue, and which may use a compatibility materializer temporarily?`
- `Should tradeBinding remain character-owned long term or lower into a more general availableFunctions/menu binding contract after character convergence?`
- `Which old frozen script-editor structures are explicitly superseded by the next version, and which remain valid historical baselines?`

### Draft Non-Goals

- `Do not activate this draft by changing blueprint pointers.`
- `Do not silently change the current runtime-pack-unification version scope.`
- `Do not use status as initial character data.`
- `Do not introduce status objects for new games when no runtime mutation exists.`
- `Do not hide long-term runtime fields inside untyped customMap when they should be promoted into profileMap, statMap, or skillMap.`

### Draft Next Step

- `Use this draft as input for a formal next-version target spec and version plan after the current version is closed or explicitly superseded.`
- `When formalizing the version, write a dedicated reference document for unified authoring/data structures and status overlay semantics.`
