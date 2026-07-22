# Script Editor Authoring Data Structure Unification Draft

## Control Block

- document_role: `successor-version-draft`
- draft_id: `draft.script-editor-authoring-data-structure-unification`
- proposed_version_id: `target.script-editor-authoring-data-structure-unification`
- draft_status: `promoted`
- parent_context: `target.script-editor-runtime-pack-unification`
- activation_status: `promoted-to-live-version`
- current_blueprint_pointer_change: `docs/blueprints/blueprint.md now points to target.script-editor-authoring-data-structure-unification`
- closeout_contract_version: `draft-v1`

## Human Context

### Draft Purpose

- `Record the next-version candidate direction before formal target and reference documents are written.`
- `This draft is historical source material; live Blueprint truth now lives in docs/blueprints/specs/2026-07-15-script-editor-authoring-data-structure-unification-target.md and docs/blueprints/plans/2026-07-15-script-editor-authoring-data-structure-unification-target-plan.md.`
- `The formal version was created after target.script-editor-runtime-pack-unification reached lawful closeout.`

### Proposed Version Goal

- `Unify script-editor authoring surfaces and data-facing runtime structures so creators edit the same structures that scenario-pack export and runtime consumption use.`
- `Unify the data structures for characters, cities, buildings, dialogues, story nodes, events, and field UI mapping tables.`
- `Revise previously frozen script-editor structures where they no longer fit the authoring/data unification target.`
- `Fill missing authoring-surface capabilities that would otherwise leave the unified data model uneditable.`
- `Update runtime logic so it consumes unified character, city, building, dialogue, story, event, and status-overlay data instead of relying on legacy fixed fields or authoring-only shadows.`

### Proposed Version Scope

- `characters: unify character authoring, characters.json, runtime character selectors, and optional save status overlays.`
- `cities: unify city authoring, cities.json, runtime city lookup, and city-facing UI display fields.`
- `buildings: unify building authoring, houses/buildings runtime data, building entry bindings, menu entries, and access rules.`
- `dialogues: unify dialogue authoring, dialogue node references, participant references, text references, and runtime scene/dialogue consumption.`
- `story nodes: unify story authoring, scenario profile/story progression data, and runtime story trigger handoff.`
- `events: unify event authoring, event trigger/condition/effect data, related entity references, and runtime event activation.`
- `field UI mapping tables: define which fields the authoring UI renders, their display labels, groups, value types, runtime mutability, validation hints, and ordering.`
- `condition authoring: make condition selection schema-driven with dropdown choices, value-type-aware controls, and fail-closed validation before runtime consumption.`
- `runtime consumption: migrate covered runtime readers to selectors/materializers that consume the unified data structures rather than legacy hand-shaped records.`
- `status overlays: use optional save overlays only for runtime-mutated data; new games should use authored definitions directly when no status exists.`

### Priority Authoring Additions

The following authoring capabilities are priority inputs for the next version and should be handled before broader optional convergence work:

0. `Project completion state and export-completion gating`
   - `The main script-editor JSON table must carry an explicit edit-complete flag for each project record.`
   - `A project that has not yet been exported must remain marked incomplete, even if its draft content is otherwise editable.`
   - `When an incomplete project is opened, the editor must show a continue-creating prompt instead of presenting it as finished content.`
   - `Only a successfully exported project package may be treated as complete.`
   - `Save keeps draft state; export is the step that upgrades completion state.`
   - `Importing an unfinished project must preserve the incomplete state so creators can continue editing it later.`
   - `The completion flag must be part of the project-level JSON table, not a runtime-pack-only artifact.`
0. `Editor project cache, package location, explicit save, export persistence, and preview`
   - `The editor must keep a JSON cache object that records selected/imported script package paths and basic script package metadata.`
   - `If a cached path no longer contains a valid script package, the editor must block continued editing for that package and only allow deleting the stale cache entry from the cache JSON object.`
   - `When creating a new script project, the first step must ask for a save path, create the script package skeleton at that path, and then edit that package in place.`
   - `While the user edits, changes may remain in editor memory until the user clicks Save or starts Export.`
   - `The editor must provide an explicit Save button that writes the current project state to the active script package path.`
   - `Save persists draft authoring state and should not require full runtime/export validity.`
   - `Preview and Export must validate project legality before loading or producing runtime output.`
   - `Export must save the current project state to the active script package path, validate it, and only then produce the exported package.`
   - `Importing an existing downstream script package counts as selecting an already-created package location; the cache must record it as an editable package entry.`
   - `Imported existing packages must not be recreated from the default skeleton; editing should modify the existing package structure.`
   - `The editor must provide a preview action that directly imports/loads the currently edited script package from disk.`
1. `Building dialogue binding and gated entry`
   - `Buildings must support binding dialogue entries.`
   - `Building-bound dialogue should support trigger conditions.`
   - `Building entry state must support conditions.`
   - `Entry conditions must use dropdown-driven condition authoring: select person, select person attribute, select operator, and enter/select a typed value.`
   - `If no entry condition is configured, building entry defaults to allowed.`
   - `Entry refusal text must be selected from textEntries in the repository/library rather than entered as free text.`
2. `City entry, building selection, and city NPC assignment`
   - `City entry state should follow the same condition/default-entry semantics as building entry state.`
   - `Cities must support selecting available buildings through a dropdown sourced from the building list.`
   - `After selecting a building from a city, the authoring surface must allow assigning NPCs to that building.`
   - `NPC selection must be a dropdown sourced from the people list.`
   - `Assigned NPCs must be removable from the city/building authoring surface.`

### Proposed City Building Placement Rules

City/building authoring should distinguish reusable building definitions from city-local building placements.

Rules:

- `Placement ids must be stable and should follow the numeric field-id system rather than array indexes or ad hoc names.`
- `NPC assignment lives on the city-local placement, not on the reusable building definition.`
- `The first version should allow one NPC to be assigned to multiple placements but surface an authoring warning when duplicates are detected.`
- `Placement labelOverride and descriptionOverride override the building definition display values when present.`
- `Entry access rules are layered: city access, building default access, and placement access must all pass. Missing access rules default to pass.`
- `Placement dialogueIds override building dialogueIds when present; otherwise the placement inherits the building default dialogues.`
- `entryBindingOverride should override building entryBinding field by field, leaving unspecified fields inherited.`
- `Refusal copy must be stored as refusalTextId and resolved from textEntries; export/runtime validation should fail closed when the referenced text entry is missing.`
- `Runtime consumption must use a centralized resolver rather than letting UI views manually stitch city, building, placement, NPC, dialogue, and condition data.`

Recommended runtime resolver seams:

```ts
resolveCityBuildingPlacements(cityId)
resolveCityBuildingView(cityId, placementId)
canEnterCityBuilding(cityId, placementId, actorContext)
resolveCityBuildingNpcs(cityId, placementId)
resolveCityBuildingDialogues(cityId, placementId)
```

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

### Proposed Condition Authoring Contract

Condition authoring must be schema-driven so free-text condition entry does not create runtime-invalid event or story logic.

Suggested definition shape:

```ts
type ScriptEditorConditionDefinition = {
  conditionId: string;
  label: string;
  targetFamily: "character" | "city" | "building" | "event" | "story" | "global";
  fieldId?: string;
  canonicalFieldKey?: string;
  valueType: "string" | "number" | "boolean" | "enum" | "reference" | "stringList" | "numberList";
  operators: Array<"eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "includes" | "exists">;
  referenceFamily?: "people" | "cities" | "buildings" | "events" | "dialogues" | "storyNodes" | "textEntries";
  enumOptions?: string[];
};

type ScriptEditorConditionInstance = {
  conditionId: string;
  subject?: "event" | "relatedPerson" | "triggerPerson" | "player" | "global";
  operator: string;
  value?: string | number | boolean | string[] | number[];
};
```

Authoring UI rules:

- `conditionId must be selected from a dropdown of registered condition definitions.`
- `operator must be selected from the chosen condition definition's allowed operators.`
- `value control must be selected from valueType: number input for number, checkbox/toggle for boolean, dropdown for enum, and reference dropdown for reference.`
- `reference values must come from the target family data rather than free text.`
- `conditions that inspect an associated actor must expose a subject/context dropdown, such as relatedPerson, triggerPerson, player, event, or global.`
- `when one event is related to multiple people, runtime evaluation must test the condition group once per related person when the condition subject is relatedPerson.`
- `an event related to multiple people is valid for only the related people whose per-person condition context passes.`
- `condition fields must not accept arbitrary unregistered condition kinds in normal authoring mode.`
- `advanced/debug raw editing may exist later, but it must not bypass export/runtime validation.`

Validation rules:

- `Export must fail closed when conditionId is unknown.`
- `Export must fail closed when operator is not allowed by the selected condition definition.`
- `Export must fail closed when value type does not match the condition definition.`
- `Export must fail closed when a reference value points to a missing target record.`
- `Runtime condition evaluation must consume the normalized condition definition/instance pair rather than interpreting raw creator text.`
- `Runtime condition evaluation must receive an explicit context object containing the event, player, triggerPerson, relatedPerson, and global state slots needed by the selected condition subjects.`
- `Per-related-person condition failure must not make the whole event invalid when other related people still satisfy the condition; it only removes that person from the event's valid target set.`

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
| `queue.script-editor-project-cache-save-export-preview` | `required-priority` | `Project cache JSON, package path validation, create-at-save-path workflow, explicit save, export-time persistence, imported package editing, and preview loading from the active package` | `Priority queue because stable authoring/data unification depends on editing a real package location with explicit persistence boundaries.`
| `queue.script-editor-project-completion-state-gating` | `required-priority` | `Project edit-complete state, export-completion gating, unfinished-project resume prompts, and completion-state persistence` | `Priority queue because project completion must be a project-table truth, and export is the only step that can mark an editable package complete.`
| `queue.script-editor-unified-field-mapping-table-freeze` | `required` | `Field id convention, field display mapping, field definitions, and UI rendering rules across authoring families` | `Recommended early queue because authoring surfaces need one shared answer for which fields render and how runtime/authoring data fields are named.`
| `queue.script-editor-character-definition-status-convergence` | `required` | `CharacterDefinition, character authoring data, CharacterStatus overlay, and runtime character selectors` | `Recommended first queue because character data exposed the clearest mismatch between authoring structure, runtime data, and save mutation ownership.` |
| `queue.script-editor-character-authoring-surface-completion` | `required` | `Authoring controls for baseAttributes, profileMap, statMap, skillMap, customMap, dialogueIds, eventIds, and tradeBinding` | `May merge into the character convergence queue if scope stays small; should split if UI/control work becomes larger than the data/runtime migration.` |
| `queue.script-editor-authoring-data-schema-reference-freeze` | `required` | `Formal reference document for unified authoring/data structures and allowed status overlays` | `Should turn this draft into a stable spec before broader object-family migration begins.` |
| `queue.script-editor-schema-reference-and-migration-freeze` | `required` | `Formal schema reference, legacy-shape supersession rules, migration adapters, export/runtime contracts, and schema-version freeze` | `Required governance queue so the next version does not leave multiple durable truths for authoring/runtime data.`
| `queue.script-editor-city-building-entry-and-npc-authoring-priority` | `required-priority` | `Building dialogue binding, building/city entry conditions, refusal text references, city building selection, and NPC assignment` | `Priority queue for the explicitly requested authoring additions; should run before broader city/building convergence if the next version needs immediate creator-facing coverage.`
| `queue.script-editor-city-building-structure-convergence` | `required` | `City/building authoring, runtime structures, entry bindings, menu entries, and access rules` | `Required for the proposed next version because cities and buildings must use the same data structure in authoring and runtime; should consume the priority authoring queue rather than duplicate it.`
| `queue.script-editor-city-building-placement-resolver-convergence` | `required` | `City-local building placements, placement ids, override layering, NPC assignment ownership, access rules, dialogue inheritance, and centralized resolver seams` | `Required because city/building authoring must distinguish reusable definitions from city-local placement state before runtime consumption is unified.`
| `queue.script-editor-dialogue-story-structure-convergence` | `required` | `Dialogue records, dialogue nodes, story nodes, participant/text references, and runtime dialogue/story consumption` | `Required for the proposed next version because dialogue/story authoring must become runtime-consumable without private lowering.`
| `queue.script-editor-dialogue-story-runtime-handoff-convergence` | `required` | `Dialogue node runtime handoff, story progression state, branch entry/exit semantics, and runtime materialization` | `Required to prevent dialogue/story convergence from stopping at export shape without proving runtime progression ownership.`
| `queue.script-editor-condition-authoring-contract-freeze` | `required` | `Schema-driven condition definitions, dropdown condition selection, type-aware value controls, and fail-closed validation` | `Recommended before event convergence if condition typing needs a shared contract across events, story nodes, and future rule editors.`
| `queue.script-editor-condition-runtime-evaluation-convergence` | `required` | `Runtime condition context, related/trigger/player/global subjects, reference resolution, target-set evaluation, and fail-closed diagnostics` | `Required because authoring typed conditions is incomplete unless the runtime evaluates the same condition contract.`
| `queue.script-editor-event-structure-convergence` | `required` | `Event triggers, typed conditions, effects, related entity references, and runtime event activation` | `Required for the proposed next version because events are a core runtime family and currently mix authoring helpers with runtime expectations.`
| `queue.script-editor-event-effect-activation-convergence` | `required` | `Event trigger semantics, typed effects, ordered effect chains, target sets, activation receipts, and runtime mutation ownership` | `Required to make complex event effects executable rather than just exportable records.`
| `queue.script-editor-scenario-launch-policy-authoring` | `required-priority` | `Initial character selection, selectable character range, initial map/city/building/view, and entry event timing authoring` | `Priority queue because exported packs must let creators choose whether startup uses the shell character-selection flow and which map/view the runtime starts from.`
| `queue.script-editor-playable-minigame-binding-convergence` | `required` | `Deep playable/minigame binding across buildings, events, dialogue nodes, task steps, settlement outputs, rewards, penalties, and return points` | `Requires playable governance because it changes playable runtime/integration ownership; should define editor-facing binding data before broad runtime wiring.`
| `queue.script-editor-branching-event-task-chain-convergence` | `required` | `Complex branching narrative, event effect chains, task stages, long-running task state, completion/failure conditions, and runtime progression handoff` | `Required if the next version is expected to support richer authoring than linear dialogue/event startup flows.`
| `queue.script-editor-minigame-binding-structure-convergence` | `superseded-candidate` | `Playable/minigame binding data structure convergence` | `Superseded by queue.script-editor-playable-minigame-binding-convergence, which covers the deeper playable/minigame binding requirement explicitly.`
| `queue.script-editor-runtime-status-save-convergence` | `candidate` | `SaveEnvelope status overlay generalization beyond characters` | `May be required if status overlays expand to cities, houses, tasks, or global progress.`
| `queue.script-editor-status-overlay-generalization-review` | `candidate-review` | `Review whether status overlays extend beyond characters into cities, buildings, tasks, story progress, or global scenario state` | `Review queue because the version should avoid inventing overlays for families that do not have runtime-mutated state yet.`
| `queue.script-editor-legacy-structure-supersession-review` | `required-governance` | `Inventory old frozen script-editor structures and classify each as retained, migrated, adapter-supported, or retired` | `Required governance queue because this version explicitly allows revising previously frozen structures when they conflict with authoring/data unification.`
| `queue.script-editor-end-to-end-authoring-runtime-flow-validation` | `required-final` | `Whole-flow validation from authoring data entry through export, runtime load, gameplay consumption, status update, save, and restore` | `Must run last after the unified data structures, authoring controls, condition typing, and runtime consumers are in place.`

#### `queue.script-editor-project-completion-state-gating`

Scope:

- `Define the project-level completion state field in the main script-editor JSON table.`
- `Persist incomplete state for newly created, imported unfinished, and saved-but-not-exported projects.`
- `Make successful export the only path that upgrades a project to complete.`
- `Show a continue-creating prompt when an incomplete project is opened from cache or import.`
- `Keep Save as draft persistence and Export as completion validation/promotion.`
- `Preserve incomplete state across import -> save -> reopen flows.`
- `Fail closed when cache metadata and project-table completion state disagree.`

Out of scope:

- `Runtime save-game completion/progress state unrelated to editor project authoring.`
- `Cloud publishing, marketplace readiness, or remote approval state.`
- `Changing scenario-pack runtime startup semantics except where export completion validation requires package legality.`

Acceptance:

- `A newly created project remains incomplete until export succeeds.`
- `Save does not mark a project complete.`
- `A failed export leaves the project incomplete and keeps a readable validation reason.`
- `Opening an incomplete project shows the continue-creating prompt.`
- `Importing an unfinished project preserves incomplete state.`
- `The completion flag lives in the project-level JSON table and survives cache reload.`

#### `queue.script-editor-schema-reference-and-migration-freeze`

Scope:

- `Create or update the formal schema reference for unified authoring/runtime data structures.`
- `Freeze schema-version identifiers for covered characters, cities, buildings, dialogues, story nodes, events, conditions, field mappings, project metadata, and launch policy.`
- `Define which legacy shapes are migrated at import time, exported through adapters, retained as historical baselines, or retired.`
- `Define migration adapter responsibilities and their removal criteria.`
- `Define export/runtime contracts that consume unified structures as the durable truth.`
- `Document validation failure modes for unsupported legacy shapes.`

Out of scope:

- `Implementing every family migration in this governance queue if later family queues own the code migration.`
- `Compatibility preservation for structures explicitly retired by this version.`
- `Runtime gameplay feature changes unrelated to schema consumption.`

Acceptance:

- `The version has a single referenced schema document for covered authoring/runtime structures.`
- `Each legacy structure touched by this version is classified as retained, migrated, adapter-supported, or retired.`
- `Import/export/runtime contracts identify which schema version they accept and produce.`
- `No covered happy path requires two durable truths for the same authoring/runtime data.`
- `Unsupported or retired shapes fail validation with actionable diagnostics.`

#### `queue.script-editor-unified-field-mapping-table-freeze`

Scope:

- `Freeze the field-id convention and parsing rules across covered authoring families.`
- `Define field definition records for canonicalKey, label, group, valueType, editability, runtime mutability, validation hints, defaults, enum options, and ordering.`
- `Define display-map responsibilities versus full field-definition responsibilities.`
- `Define how authoring controls render from field definitions for base fields, maps, references, enums, booleans, lists, and numeric values.`
- `Define migration behavior when an old record has a field without a mapping-table entry.`
- `Add validation that rejects duplicate field ids, duplicate canonical keys where forbidden, invalid value types, and missing required mappings.`

Out of scope:

- `Visual redesign of every editor panel.`
- `Per-family runtime migration beyond the selector/materializer seams required to prove field mapping usage.`
- `Creator-facing custom-field marketplace or plugin systems.`

Acceptance:

- `Authoring UI can render covered fields from mapping-table data rather than hardcoded field lists.`
- `The mapping table is the source of truth for label, ordering, editability, and validation hints.`
- `Unknown fields are either routed to an approved customMap flow or rejected by validation.`
- `Tests or fixtures prove at least one base, profile, stat, skill, custom, enum, boolean, list, and reference field.`

#### `queue.script-editor-character-authoring-surface-completion`

Scope:

- `Expose editable controls for baseAttributes, profileMap, statMap, skillMap, customMap, dialogueIds, eventIds, and tradeBinding.`
- `Use mapping-table metadata for labels, value controls, validation hints, ordering, and required-state display.`
- `Use dropdown/reference selectors for dialogueIds, eventIds, trade entries, portraits, and other known references.`
- `Support adding, editing, deleting, and validating custom attributes without changing save status overlays.`
- `Keep runtime-mutated status out of the normal authoring surface except for explicit preview/debug tools.`
- `Preserve authoring data through import -> edit -> save -> export round trips.`

Out of scope:

- `Full character runtime selector migration if owned by character-definition-status convergence.`
- `Editing live save files from the normal script editor.`
- `New character gameplay formulas unrelated to authoring data entry.`

Acceptance:

- `A creator can edit the complete proposed CharacterDefinition surface without raw JSON editing.`
- `Reference fields are dropdown-backed where source tables exist.`
- `Invalid custom attributes and invalid reference ids fail validation.`
- `Import/export round trip preserves edited base, profile, stat, skill, custom, dialogue, event, and trade binding fields.`

#### `queue.script-editor-city-building-placement-resolver-convergence`

Scope:

- `Separate reusable building definitions from city-local building placements.`
- `Define stable placement ids using the field-id convention or an explicitly approved placement-id convention.`
- `Place NPC assignment on city-local placements rather than reusable building definitions.`
- `Support labelOverride, descriptionOverride, placement dialogue overrides, entryBindingOverride, and inherited building defaults.`
- `Apply layered access checks for city access, building default access, and placement access with missing rules defaulting to pass.`
- `Resolve refusalTextId through textEntries and fail validation when missing.`
- `Introduce centralized resolver seams for city building placements, view materialization, access checks, NPCs, and dialogues.`
- `Warn when one NPC is assigned to multiple placements in the first version slice.`

Out of scope:

- `Map renderer replacement or new map asset pipeline.`
- `Full building minigame/playable binding unless consumed through the playable/minigame queue.`
- `Complex NPC scheduling beyond placement assignment and duplicate warnings.`

Acceptance:

- `A city can contain multiple placements of reusable building definitions without duplicating definition data.`
- `Runtime and preview use centralized resolvers rather than manual UI stitching for covered city/building views.`
- `Placement overrides inherit unspecified building fields correctly.`
- `NPC assignment belongs to placement data and survives import/export.`
- `Invalid placement ids, missing building references, missing NPC references, missing refusal text, and failed access references fail validation.`

#### `queue.script-editor-dialogue-story-runtime-handoff-convergence`

Scope:

- `Define runtime materialization for dialogue records, dialogue nodes, story nodes, participant references, text references, and branch metadata.`
- `Define how dialogue/story entry points are triggered from startup, buildings, events, tasks, or playable settlement.`
- `Define story progression state ownership and save/restore behavior.`
- `Define branch entry, branch exit, continuation, cancellation, and failure semantics.`
- `Ensure runtime consumers use unified dialogue/story structures rather than private lowered scenes for covered paths.`
- `Validate missing participants, textEntries, node ids, branch targets, and story progression references.`

Out of scope:

- `Full visual node graph editor unless needed for minimal branch authoring.`
- `New dialogue presentation UI unrelated to proving runtime handoff.`
- `Event effect execution except where story handoff requires invoking an existing event reference.`

Acceptance:

- `A dialogue/story path authored in the editor can start through at least one runtime entry point and advance through runtime materialization.`
- `Story progression state can be saved and restored for covered paths.`
- `Branch continuation and branch exit semantics are deterministic and validated.`
- `Invalid participant, text, node, branch, or story references fail before export or preview.`

#### `queue.script-editor-condition-runtime-evaluation-convergence`

Scope:

- `Define runtime condition evaluation against the same typed condition contract used by authoring.`
- `Define evaluation subjects for player, trigger person, related person, related target sets, city/building context, event/story context, and global scenario state.`
- `Resolve field ids and canonical keys through the mapping table or approved selectors.`
- `Support per-target evaluation and deterministic target-set behavior.`
- `Fail closed for unknown condition ids, unsupported operators, missing reference targets, malformed values, and unavailable subjects.`
- `Emit diagnostics useful for editor preview and export validation.`

Out of scope:

- `Arbitrary script execution or creator-authored code conditions.`
- `New condition families without schema definitions.`
- `Event effect application beyond deciding whether a condition passes.`

Acceptance:

- `Runtime evaluates authored typed conditions without separate hand-written condition branches for covered condition families.`
- `The same valid condition passes in editor validation and runtime evaluation.`
- `The same invalid condition fails closed with a readable diagnostic before export/preview where possible.`
- `Related-person, trigger-person, player, and global examples are covered or explicitly deferred with recorded rationale.`

#### `queue.script-editor-event-effect-activation-convergence`

Scope:

- `Define event trigger semantics for startup, map/city/building entry, dialogue branch, task progression, playable settlement, and manual/runtime signals where supported.`
- `Define typed effect records, ordered effect chains, target resolution, failure policy, and activation receipts.`
- `Apply effects through unified runtime/save mutation ownership rather than mutating authored definitions.`
- `Support related entity references and target sets with deterministic activation behavior.`
- `Validate event ids, trigger ids, condition ids, effect types, target references, reward/penalty references, and follow-up event/story/task references.`
- `Record which effect families are supported in this version and which remain future candidates.`

Out of scope:

- `Arbitrary creator-authored code effects.`
- `All possible gameplay effect types if unsupported families are explicitly deferred.`
- `Playable settlement implementation except through typed handoff data consumed by the playable/minigame queue.`

Acceptance:

- `An authored event can trigger at a supported runtime signal, evaluate typed conditions, and apply ordered typed effects.`
- `Runtime mutations flow through approved game state/save structures.`
- `Activation receipts or diagnostics make applied/skipped/failed effects inspectable.`
- `Invalid triggers, targets, conditions, or effects fail validation before export/preview where possible.`

#### `queue.script-editor-status-overlay-generalization-review`

Scope:

- `Review whether status overlays are needed for cities, buildings, tasks, story progress, events, global scenario state, or other families.`
- `Classify each family as definition-only, status-overlay-required, progression-state-required, or future-review.`
- `Define overlay ownership only for data that runtime mutates after startup.`
- `Prevent new-game startup from requiring empty status objects for families with no runtime mutation.`
- `Identify selector/materializer seams needed if non-character overlays are admitted.`

Out of scope:

- `Implementing non-character overlays before the review proves they are needed.`
- `Using status overlays as authoring definitions.`
- `Save-game feature work unrelated to covered script-editor runtime consumption.`

Acceptance:

- `The version records whether non-character overlays are in scope, out of scope, or future-review.`
- `No family gets a status overlay solely because it is convenient for export.`
- `Any admitted overlay has clear mutation ownership, save/restore semantics, and selector/materializer seams.`

#### `queue.script-editor-legacy-structure-supersession-review`

Scope:

- `Inventory previously frozen script-editor structures that overlap this version.`
- `Classify each structure as retained, migrated, adapter-supported temporarily, or retired.`
- `Record why each retired or superseded structure conflicts with authoring/data unification.`
- `Define migration fixtures or validation failures for packages using old structures.`
- `Update blueprint/spec references so future queues do not treat superseded structures as active truth.`

Out of scope:

- `Changing active blueprint pointers while this document remains inactive.`
- `Deleting legacy support before an owning queue has migration coverage and verification.`
- `Broad repo cleanup unrelated to script-editor structures covered by this version.`

Acceptance:

- `Every known frozen script-editor structure touched by the next version has a documented disposition.`
- `Superseded structures have a replacement reference and migration/removal criteria.`
- `Retired structures fail validation with readable diagnostics once the version owns that behavior.`
- `No active queue remains ambiguous about whether to follow old frozen shape or new unified shape.`

#### `queue.script-editor-scenario-launch-policy-authoring`

Scope:

- `Expose scenario launch policy in the script editor as first-class authoring fields.`
- `Allow creators to choose whether startup begins at shell character selection or uses a fixed player character.`
- `Allow creators to define the initial selectable character range, default selected character, and fallback playerCharacterId.`
- `Allow creators to choose the initial map from the maps table and validate that the selected map exists.`
- `Allow creators to choose initial city, building, and initial view from valid references and supported view names.`
- `Allow creators to choose entry event timing: immediate, after map entry, after city entry, or after building entry when supported by runtime trigger ownership.`
- `Export scenarioProfile.launchPolicy and startup fields without dropping them during import/export round trips.`
- `Runtime startup must honor the selected launch policy without manual JSON patching.`

Out of scope:

- `Adding new map rendering technology.`
- `Changing unrelated scenario-pack asset serialization except where needed to validate selected initial map assets.`
- `Implementing broad character data convergence beyond selecting from the available character definitions.`

Acceptance:

- `A creator can configure shell character selection versus fixed character startup in the editor.`
- `A creator can choose the initial map and the exported pack starts on that map.`
- `A creator can choose the initial view and entry event timing, and runtime startup honors those choices.`
- `Import -> edit -> export preserves launch policy fields.`
- `Invalid character/map/city/building/event references fail validation before export or preview.`

#### `queue.script-editor-playable-minigame-binding-convergence`

Scope:

- `Define editor-facing playable/minigame binding records that can attach to buildings, events, dialogue nodes, task steps, or external flow triggers.`
- `Allow creators to select playable type, playable integration, participant characters, launch conditions, payload fields, settlement outputs, rewards, penalties, and return points.`
- `Support settlement routing back to the owning flow, including dialogue continuation, event continuation, task progression, house reentry, or map/city return where supported.`
- `Validate playable ids, integration ids, trigger ids, participant references, reward/effect references, and return targets before export or preview.`
- `Export runtime-consumable playable integration data instead of editor-only minigame shadows.`
- `Use playable governance before changing shared playable runtime, playable integration registries, settlement contracts, or house-hosted playable flows.`

Out of scope:

- `Inventing new playable mechanics unless separately admitted through playable governance.`
- `Visual redesign of individual minigames.`
- `Replacing existing playable runtime ownership outside the binding/export seams required by this queue.`

Acceptance:

- `A playable/minigame can be bound from the editor to at least one building flow, one event/dialogue flow, and one task-step flow where those host flows exist.`
- `Settlement can advance or fail the owning flow without manual code patches.`
- `Invalid playable/integration/participant/return references fail validation.`
- `Exported playable bindings load through runtime without compatibility-only residue for covered binding types.`

#### `queue.script-editor-branching-event-task-chain-convergence`

Scope:

- `Add data structures and authoring controls for branching dialogue choices and conditional branch targets.`
- `Support event effect chains with typed effects, ordered execution, fail-closed validation, and explicit runtime handoff.`
- `Support long-running task chains with stages, objectives, progress signals, completion conditions, failure conditions, rewards, and follow-up events.`
- `Allow story nodes, events, and tasks to reference each other through validated ids rather than free-text fields.`
- `Define runtime progression semantics for branch selection, event effect application, task stage advancement, and long-running task persistence.`
- `Ensure save/restore preserves long-running task state through the unified runtime/save structures.`

Out of scope:

- `Full visual node-graph editor polish unless required for basic authoring.`
- `New gameplay systems unrelated to branch/event/task progression.`
- `Unbounded effect kinds; unsupported effect families should remain explicit future candidates.`

Acceptance:

- `A creator can author a branching dialogue/event path with at least two valid branches and one invalid branch rejected by validation.`
- `A creator can author an event effect chain that applies typed effects in order through runtime.`
- `A creator can author a multi-stage task chain that progresses over more than one runtime signal and survives save/restore.`
- `Exported branch/event/task-chain data is runtime-consumable without hand-written per-scenario branches for the covered happy path.`

### Proposed Final Validation Queue

#### `queue.script-editor-end-to-end-authoring-runtime-flow-validation`

Scope:

- `Create or update one representative script-editor project fixture that uses the unified character, city, building, dialogue, story, event, field mapping, and typed condition structures.`
- `Create the fixture through the create-at-save-path workflow or import it as an existing package, then verify the editor cache points to the active package path.`
- `Exercise authoring-side creation or serialization for a new character/NPC, a city/building placement, a dialogue/story reference, an event with typed conditions, and a trade or interaction binding where supported.`
- `Exercise building dialogue binding, building entry conditions, city entry conditions, textEntry-backed refusal text, city building selection, and city/building NPC assignment.`
- `Export the project to the formal startup-consumable scenario-pack structure.`
- `Load the currently edited package through the editor preview action and through the runtime startup path.`
- `Verify the new character/NPC is reachable through the intended runtime route, such as selectable role, city NPC, building NPC, dialogue participant, or event actor.`
- `Trigger at least one typed condition path and verify invalid condition data fails closed.`
- `Apply a runtime character status mutation, save it through SaveEnvelope, restore it, and verify the status patch updates the loaded character view without mutating the authored definition.`
- `Verify compatibility-only migration residue is not required for the happy path.`

Out of scope:

- `Broad visual polish beyond confirming that required authoring controls exist and render the mapped fields.`
- `Adding new gameplay systems that are not needed to prove the unified data path.`
- `Replacing all historical fixtures if one representative full-flow fixture is enough to prove the contract.`

Acceptance:

- `The end-to-end fixture can be authored or loaded by the script editor, exported, loaded by runtime, and consumed by gameplay without manual patching.`
- `The editor can restore the project from its cache when the path is valid and blocks editing when the cached path no longer contains a valid package.`
- `New project creation writes a package skeleton to the chosen save path before editing begins.`
- `Imported package editing modifies the existing package rather than recreating it from the default skeleton.`
- `Save writes the current editor state to the active package path without requiring full runtime/export validity.`
- `Preview validates the current project/package legality before loading runtime preview.`
- `Export writes the current editor state to the active package path, validates legality, and only then produces package output.`
- `Preview either loads the active on-disk package after a successful save and validation or blocks with an unsaved-changes/validation prompt.`
- `The exported package is a valid scenario-pack and does not rely on daily compatibility lowering for covered structures.`
- `Runtime selectors/materializers consume unified structures for covered character, location, narrative, and event paths.`
- `Status overlay behavior is proven for absence of status, empty status, mutation, save, and restore.`
- `Typed condition UI/export/runtime validation is proven for both valid and invalid examples.`
- `The final queue records whether any remaining gaps are future-version candidates rather than leaving them as hidden same-version residue.`

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

### Proposed Priority Queue Sketch

#### `queue.script-editor-project-cache-save-export-preview`

Scope:

- `Define the editor project cache JSON shape for package path, package metadata, last-opened project id, and validity state.`
- `Validate cached paths before allowing continued editing.`
- `Block editing and allow only stale cache-entry deletion when the cached package path is missing or invalid.`
- `Change new project creation so the first step selects a save path and writes a package skeleton there.`
- `Add an explicit Save button that writes current editor state to the selected package path.`
- `Make Save persist draft authoring state without requiring full runtime/export validity.`
- `Make Preview validate project/package legality before runtime preview starts.`
- `Make Export save current editor state to the selected package path, validate legality, and only then continue package export.`
- `Treat imported downstream packages as already-created editable package locations and record them in the cache.`
- `Do not recreate an imported package from the default skeleton.`
- `Add preview loading that imports the currently edited on-disk package after save, or blocks when unsaved changes would make the disk package stale.`

Out of scope:

- `Cloud sync or remote package storage.`
- `Multi-user collaboration or conflict resolution beyond single-user local writes.`
- `Runtime schema convergence for individual families unless required to validate package presence.`
- `Broad preview gameplay feature work beyond loading the active package.`

Acceptance:

- `The cache records the selected/imported script package path and basic package metadata.`
- `A missing or invalid cached path prevents continued editing and can only be removed from the cache JSON object.`
- `New project creation writes a valid package skeleton at the chosen save path before authoring starts.`
- `Edits are persisted to the active package path when Save is clicked even if the project is not yet runtime/export-valid.`
- `Preview is blocked when validation fails.`
- `Export persists the current editor state, validates legality, and is blocked when validation fails.`
- `Importing an existing package records that package location and edits it in place.`
- `Preview imports the current package from disk only after current changes are saved and validation passes, or blocks with an unsaved-changes/validation prompt.`

#### `queue.script-editor-city-building-entry-and-npc-authoring-priority`

Scope:

- `Add building-level dialogue binding to the authoring data model and UI.`
- `Add building dialogue trigger conditions using the shared schema-driven condition authoring contract.`
- `Add building entry-state conditions using person/person-attribute/operator/value selection.`
- `Default building entry to allowed when no entry condition exists.`
- `Make building refusal text select a textEntries record from the repository/library.`
- `Add city entry-state conditions with the same default-allowed behavior as building entry.`
- `Add city-to-building selection through a dropdown sourced from the building list.`
- `After a city selects a building, allow assigning and removing NPCs for that city/building relationship.`
- `Make NPC assignment use a people-list dropdown.`
- `Add runtime or preview validation that rejects missing referenced people, buildings, dialogues, textEntries, or condition fields.`

Out of scope:

- `Full city/building runtime structure replacement beyond what is required for the priority authoring additions.`
- `Visual redesign of the city/building editor.`
- `General event/effect system migration beyond condition selection needed for entry and dialogue triggers.`
- `Minigame/playable binding changes.`

Acceptance:

- `A building can bind a dialogue and a typed trigger condition.`
- `A building can define an entry condition; if none is configured, entry remains allowed.`
- `A building refusal prompt is selected from textEntries.`
- `A city can define an entry condition; if none is configured, entry remains allowed.`
- `A city can select buildings from the building list.`
- `A selected city/building relationship can assign and remove NPCs from the people list.`
- `Invalid references and invalid condition value types fail validation before runtime/export.`

### Draft Open Questions

- `Should the field mapping table be frozen before character/city/building/narrative convergence begins, or should the character queue define the first mapping slice and extract it afterward?`
- `Should the project cache live in a global editor cache file, browser localStorage, or both with a filesystem-backed source of truth?`
- `What is the exact package skeleton written during new project creation before authoring starts?`
- `Should preview trigger an automatic save before loading from disk, or should it require the user to click Save first when unsaved changes exist?`
- `Should city and building convergence share one queue, or split into separate city and building queues if entry binding/access-rule work expands?`
- `Should the city/building entry and NPC assignment work run as the first priority queue in the next version before the general field mapping table freeze, or should it consume a minimal field mapping slice first?`
- `Should city-to-building NPC assignment live on the city record, the building record, or a join/placement record keyed by cityId + buildingId?`
- `Should building dialogue binding reference dialogues directly, or should it bind to runtime scenes after dialogue/story convergence?`
- `Should refusal text support only textEntries references, or also allow fallback inline text during migration?`
- `Should dialogue and story-node convergence stay together, or should story progression become its own queue before event convergence?`
- `Which event condition/effect shapes are runtime-owned enough to freeze in this next version, and which should remain future mechanism work?`
- `Should condition authoring have its own queue before event convergence, or can it be the first task inside event-structure convergence?`
- `Which condition definitions are shared by events and story nodes, and which are event-only?`
- `Which condition reference families must be dropdown-backed in the first version slice?`
- `Which condition subjects are required in the first slice: relatedPerson, triggerPerson, player, event, and global, or a smaller subset?`
- `Should event activation produce one activation per valid related person, or one event activation carrying a valid related-person target set?`
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
