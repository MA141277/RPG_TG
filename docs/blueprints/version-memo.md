# Version Memo

## Document Control

- document_id: `version-memo`
- related_version: `target.script-editor-authoring-data-structure-unification`
- document_role: `non-scheduling-version-memo`
- created_at: `2026-07-15`
- active_truth_owner: `none`
- scheduling_effect: `none`

## Usage Rules

- This document records source-backed problems discovered while the version remains open.
- An entry in this document is not queue admission or implementation authorization.
- Entries must not be promoted into candidate queues or execution queues unless the user explicitly requests that promotion.
- Candidate and execution truth remains owned by the current version plan.
- New findings should record observable behavior, current implementation evidence, governance coverage, and acceptance requirements.
- Closing an entry requires verified runtime behavior, persistence coverage, and synchronization with the owning queue or version records.

## Open Problems

### MEMO-006: Location Access Runtime Should Govern City And Building Entry Eligibility

- status: `open`
- severity: `medium`
- classification: `current-version-runtime-authoring-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `city navigation`
  - `building navigation`
  - `location access rules`
  - `city-enter events`
  - `house-enter events`
  - `script editor city/building authoring`

#### Observable Behavior

- City entry and city-entry event triggering are separate concerns.
- Entering a city is navigation: the runtime updates the player's current city and view.
- City-enter events are follow-up checks after successful navigation.
- Building entry already has a bounded access path through city/building placement and house access refusal rules.
- City entry does not yet have the same unified access-check layer before navigation.
- Without a dedicated location access runtime, city/building eligibility can be scattered across UI buttons, navigation handlers, events, or feature-specific modules.

#### Current Implementation Evidence

- `src/application/navigation/enter-city.ts` directly updates `world.currentCityId`, clears `world.currentHouseId`, and switches `ui.currentView` to `city`.
- `src/core/runtime/navigation-runtime.ts` handles `navigation.enter-city` by calling `enterCity` and then emitting the `navigation.entered-city` follow-up.
- `src/application/runtime/navigation-time-follow-up.ts` consumes `navigation.entered-city` and runs `city-enter` story trigger checks after the city has already been entered.
- `src/application/city/city-building-placement-resolver.ts` already exposes `canEnterCityBuilding` for building placement access checks.
- `src/application/city/city-building-placement-resolver.ts` delegates building access to `selectHouseEntryAccess` and `houseAccessRefusalRules`.
- `src/domain/script-editor-project.ts` already has access-related authoring fields for city/building records, but there is no single location-level runtime contract covering both city and building entry eligibility.

#### Required Final Mechanism

- Introduce a dedicated location access runtime or resolver that owns entry eligibility before navigation.
- The resolver should support both city and building targets.
- The resolver should answer whether the player can enter, why entry is blocked, and what refusal behavior should occur.
- City navigation must call the access resolver before mutating `currentCityId`.
- Building navigation must continue to use the existing house access rules through the same location access boundary rather than a separate scattered path.
- Successful access should proceed to navigation, then allow `city-enter` or `house-enter` events to run as follow-up checks.
- Failed access should not mutate the player's current city/building.
- Failed access may return a refusal message, refusal dialogue, or refusal event id, but the access resolver should remain the owner of the allow/deny decision.
- Events should not be used as the primary "can enter" gate; events should only describe what happens after access is allowed or after a refusal branch is intentionally invoked.

#### Proposed Contract Shape

- `LocationAccessTarget`
  - `{ type: "city"; cityId: string }`
  - `{ type: "building"; cityId?: string; buildingId: string }`
- `LocationAccessResult`
  - `{ canEnter: true }`
  - `{ canEnter: false; reason: string; message?: string; refusalEventId?: string }`

#### Expected Runtime Flow

- Attempt city/building entry.
- Resolve location access for the target.
- If access is blocked, return the refusal result and keep current location state unchanged.
- If access is allowed, execute `enterCity` or `enterHouse`.
- After successful navigation, trigger `city-enter` or `house-enter` events.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-location-access-runtime-convergence`
- proposed_class: `candidate`
- proposed_goal: `Create a unified location access runtime for city and building entry eligibility, preserving existing building refusal rules and adding city-level access governance before navigation.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria

- City entry attempts pass through a single access resolver before `currentCityId` changes.
- Building entry attempts pass through the same location access boundary while preserving current house access refusal behavior.
- Blocked city/building entry does not mutate current city, current house, house session, or current view.
- Allowed city entry still triggers `city-enter` follow-up events after navigation.
- Allowed building entry still triggers `house-enter` follow-up events after navigation.
- Access failure can produce a creator-facing refusal message or refusal event without making events the primary access owner.
- Script editor city/building authoring has an explicit place to configure or reference access rules.

#### Verification Evidence Required For Closure

- Unit tests for allowed and blocked city access.
- Unit tests proving blocked city access does not mutate location state.
- Regression tests proving existing building access refusal behavior still works through the unified boundary.
- Runtime tests proving `city-enter` and `house-enter` events still run only after successful navigation.
- Script editor save/export validation proving city/building access rule data is preserved or explicitly dispositioned.

### MEMO-005: City And Building Authoring Need Custom Attributes

- status: `open`
- severity: `medium`
- classification: `current-version-authoring-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor city authoring`
  - `script editor building authoring`
  - `city custom attributes`
  - `building custom attributes`
  - `runtime export`
- reference_docs:
  - `docs/script-editor-city-building-custom-properties.md`

#### Observable Behavior

- The script editor person authoring surface already has a custom-attribute concept for creator-defined person data.
- City and building authoring also need creator-defined custom attributes, but this requirement is not yet represented as a completed authoring/runtime contract.
- Without city/building custom attributes, creators cannot attach scenario-specific fields to cities or buildings without falling back to raw JSON edits or ad hoc future fields.

#### Required Final Mechanism

- Add creator-facing custom attributes for city records.
- Add creator-facing custom attributes for building records.
- Custom city/building attributes should use the same governed field/value approach as person custom attributes where possible.
- Custom attributes must survive project save/load.
- Custom attributes must be exported or explicitly routed according to the runtime-pack contract, without silently dropping creator-authored data.
- Runtime mutation/status behavior for city/building custom attributes must be explicitly governed before gameplay systems mutate those values.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-city-building-custom-attributes`
- proposed_class: `candidate`
- proposed_goal: `Add governed custom-attribute authoring for city and building records, including save/load and export disposition.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria

- City detail authoring exposes custom attributes.
- Building detail authoring exposes custom attributes.
- Custom attributes persist through script-editor project save/load.
- Runtime export either preserves the custom attributes in the canonical runtime family or fails/routes explicitly if the runtime contract is not ready.
- Existing city/building import, save, export, and validation behavior remains valid.

#### Verification Evidence Required For Closure

- UI/source tests proving city and building custom attribute controls exist.
- Tests proving city/building custom attributes update the expected records.
- Save/load regression proving custom attributes persist.
- Export or validation regression proving custom attributes are preserved or explicitly dispositioned.

### BUG-004: Person Trade Binding Needs City-Scoped Building Selection

- status: `open`
- severity: `medium`
- classification: `current-version-ui-authoring-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor people authoring`
  - `person trade binding`
  - `city/building references`
  - `creator-facing selectors`

#### Observable Behavior

- In the script editor person detail trade tab, the current trade binding flow exposes the trade entry/building selector without a required city condition selector first.
- Creators need to bind trade behavior in a city/building context, but the current UI does not force the selection order from city to building.
- This can let creators choose a building without first establishing which city context owns that building choice.

#### Required Final Mechanism

- Add a city selector to the person trade tab.
- The city selector must use a dropdown sourced from the current project city list.
- The building selector must remain disabled or empty until a city has been selected.
- After a city is selected, the building dropdown must show only buildings contained in that city.
- Changing the selected city must clear or revalidate any previously selected building that does not belong to the new city.
- The saved trade binding should preserve the city/building relationship in the canonical person/trade authoring data rather than relying on a free-text or mismatched building id.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-person-trade-binding-city-scope`
- proposed_class: `candidate`
- proposed_goal: `Add city-scoped building selection to the person trade binding tab so creators choose a city before selecting an eligible building.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria

- The person trade tab shows a city dropdown.
- The building dropdown is unavailable until a city is selected.
- Once a city is selected, the building dropdown lists only buildings for that city.
- Changing city clears or rejects stale building selections from another city.
- Existing person save/export/runtime materialization remains valid.

#### Verification Evidence Required For Closure

- UI/source test proving the trade tab renders a city dropdown and city-scoped building dropdown.
- Tests proving city changes clear or revalidate stale building selections.
- Regression coverage proving saved person trade binding data remains stable through load/save/export.

### BUG-003: Person Detail Dialogue Tab Misleads Creators And Should Become Skill Tab

- status: `open`
- severity: `medium`
- classification: `current-version-ui-authoring-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor people authoring`
  - `person dialogueIds`
  - `person skills`
  - `creator-facing navigation`

#### Observable Behavior

- The script editor person detail surface currently exposes a sibling tab labeled `对话`.
- The tab edits `person.dialogueIds`, which is only a relationship/organization list.
- The current runtime does not treat `person.dialogueIds` as a generic "click this person to open dialogue" trigger.
- Creators can reasonably misread this tab as a runtime dialogue trigger configuration surface.
- The same sibling navigation does not expose a dedicated `技能` tab, even though person skills are core editable character data.

#### Current Implementation Evidence

- `src/ui/main-ui/main-ui-flow.js` defines the person tab buttons as `属性`, `对话`, `交易`, and `事件`.
- `renderScriptEditorPersonTabPanel` renders the `dialogues` tab through `renderScriptEditorPersonRelationPanel`.
- The `dialogues` tab writes to `person.dialogueIds` through `addScriptEditorPersonRelation("dialogueIds")` and related handlers.
- The editor PRD states that the person dialogue tab is only a relationship organization entry and is not a second dialogue editor.
- Current runtime dialogue opening is owned by events, scenes, house modules, menu actions, or location dialogue state, not by a generic person `dialogueIds` click trigger.

#### Root Cause

The person authoring UI exposes a relationship-only field as a top-level creator-facing "dialogue" feature. Because the runtime does not currently consume that field as a direct trigger, the tab promises more behavior than it can deliver. At the same time, skills are first-class person data and should be easier to find than an inactive dialogue relationship list.

#### Required Final Mechanism

- Remove the `对话` tab from the person detail sibling tab list.
- Add a sibling `技能` tab for person skill editing.
- Keep actual dialogue trigger configuration on the correct runtime entry surfaces: events, city/building/NPC placement, menu actions, and dialogue follow-ups.
- Do not expose `person.dialogueIds` as a normal creator-facing runtime trigger field unless a later queue implements a real resolver path for it.
- Preserve existing data import/export for `dialogueIds` if needed for compatibility, but do not present it as an active person feature.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-person-authoring-navigation-cleanup`
- proposed_class: `candidate`
- proposed_goal: `Clean up the person detail authoring tabs by removing the misleading dialogue relationship tab and adding a dedicated skills tab backed by the person skill field source.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria

- Person detail tabs no longer show `对话`.
- Person detail tabs show a sibling `技能` tab.
- Skill fields remain editable from the new `技能` tab.
- Dialogue trigger setup remains discoverable through event, dialogue, city/building, NPC placement, or menu entry surfaces rather than person `dialogueIds`.
- Existing person save/export/runtime materialization remains valid.

#### Verification Evidence Required For Closure

- UI/source test proving the person tab list contains `技能` and does not contain `对话`.
- Tests proving skill updates still write to the expected person skill fields.
- Regression coverage proving removing the tab does not delete imported `dialogueIds` data during load/save/export unless a separate migration explicitly does so.

### BUG-002: Person Authoring Profile Surface Renders Duplicate Field Sources

- status: `open`
- severity: `medium`
- classification: `current-version-ui-authoring-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor people authoring`
  - `field mapping table`
  - `person base/profile/custom attributes`

#### Observable Behavior

- In the script editor person detail profile tab, the UI shows the normal person base/profile form first.
- The same page then renders an additional panel labeled `映射字段 / 角色资料字段组`.
- The additional panel exposes overlapping person fields such as name, person type, role, biography, birth year, death year, age, city/building references, stats, and skills.
- This makes it look as if the imported or authored character data has gained an extra `角色资料字段组`, even though the duplicate block is UI rendering rather than a new data row in the scenario pack.

#### Current Implementation Evidence

- `src/ui/main-ui/main-ui-flow.js` renders a handwritten person profile form in `renderScriptEditorPersonTabPanel`.
- The same render path then calls `renderScriptEditorPersonMappedFieldGroups(person)`.
- `renderScriptEditorPersonMappedFieldGroups` renders the hardcoded `映射字段 / 角色资料字段组` panel.
- The mapped controls are sourced from `listScriptEditorPersonFieldDefinitions()` in `src/application/script-editor/field-mapping.ts`.
- `src/application/script-editor/field-mapping.ts` already defines the person field table for base, profile, stat, skill, and custom-family representative fields.
- `src/application/script-editor/person-authoring.ts` already routes many fixed fields through mapped attribute helpers.

#### Root Cause

The person profile authoring surface currently combines two field sources: a legacy handwritten base/profile form and the newer field-mapping-driven form. The newer mapped field table was added without replacing or fully absorbing the older fixed form, so the same canonical person data is exposed through duplicate UI sections.

#### Required Final Mechanism

- Render the normal person profile page from one canonical field source.
- Use the field mapping table as the source of truth for base/profile/stat/skill fields where those fields are part of the current authoring contract.
- Read and edit creator-defined custom attributes from the person custom attribute list or a governed custom-field group.
- Do not show an internal implementation label such as `映射字段` as a creator-facing field group.
- Do not keep a second handwritten form that edits the same canonical fields unless it is explicitly a debug/raw-data view.
- Preserve existing save/export behavior for person records while removing duplicate editing paths.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-person-field-source-unification`
- proposed_class: `candidate`
- proposed_goal: `Unify the person profile authoring surface so base/profile/stat/skill fields are rendered from the field mapping table and custom attributes are rendered from the custom attribute source without duplicate creator-facing sections.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria

- The person profile tab shows one coherent set of base/profile controls, not both the legacy form and `角色资料字段组`.
- Name, person type, role, biography, birth/death year, age, city/building, portrait, stats, and skills remain editable where supported by the current contract.
- Custom attributes remain editable without being mixed into duplicated base/profile controls.
- Creator-facing labels are product/domain labels, not internal labels such as `映射字段`.
- Existing person import, save, export, and runtime materialization tests remain green.

#### Verification Evidence Required For Closure

- UI/source test proving the duplicate mapped-field panel title is removed or replaced by a single canonical profile rendering path.
- Tests proving mapped base/profile/stat/skill controls still update the expected person record fields.
- Tests proving custom attributes still render and update through their intended source.
- Runtime export regression proving person records still materialize into valid character definitions.

### BUG-001: Custom Runtime Properties Do Not Have A Unified Mutation And Persistence Path

- status: `open`
- severity: `high`
- classification: `current-version-governance-gap`
- owning_queue: `queue.script-editor-runtime-property-mutation-and-status-convergence`
- admission_status: `queue-closed-with-routed-residue`
- latest_disposition: `generic character property mutation/status and temple donation slice fixed; event/effect mutation ownership routed to queue.script-editor-event-effect-activation-convergence`
- affected_families:
  - `character custom properties`
  - `CharacterStatus`
  - `runtime effects and mutations`
  - `house actions`
  - `browser save and startup restore`

#### Observable Behavior

- Zhu Yuanzhang starts with a configured authored money value of `120`.
- A temple donation of `100` immediately changes the materialized in-memory character value.
- After browser refresh, continuing the same saved game may restore the authored value instead of the post-donation value.
- Starting a new game and selecting Zhu Yuanzhang should restore the authored value and is not itself a defect.
- The defect applies when the same saved game is continued and the runtime mutation is not restored.

#### Current Implementation Evidence

- `CharacterStatus.statPatch` and `CharacterStatus.skillPatch` are limited to fixed `CharacterStatKey` and `SkillKey` fields.
- CharacterStatus materialization stores resolved absolute values and overlays them over authored character definitions.
- The covered city-begging settlement emits `characterStatusById` patches and participates in runtime commit, browser save, and startup restore.
- The temple donation path directly replaces the player's `characterDefinitions` entry after subtracting the donation amount.
- The temple donation result does not emit an equivalent `characterStatusById` patch.
- Multiple feature modules implement field-specific helpers such as `mutatePlayerGold`, so migration coverage depends on each consumer remembering to call the correct helper.
- The script editor can expose `customMap` authoring controls, but that does not provide a generic runtime mutation or persistence contract for those custom fields.

#### Current Disposition

- `queue.script-editor-runtime-property-mutation-and-status-convergence` implemented the bounded generic character property mutation/status slice.
- CharacterStatus now supports custom property patches, and temple donation now emits a status patch through the generic numeric property mutation helper.
- The remaining event/effect mutation path needs broader runtime settlement and effect activation ownership, so it is routed to `queue.script-editor-event-effect-activation-convergence`.
- BUG-001 remains open until the routed event/effect and broader consumer-migration requirements are verified or explicitly dispositioned.

#### Root Cause

The repository has a bounded CharacterStatus persistence mechanism, but it does not yet have one schema-driven runtime property mutation mechanism. Runtime consumers can still modify materialized definitions directly or use feature-local fixed-field mutation helpers. As a result, adding or renaming a creator-defined field can reproduce the same persistence failure in another gameplay path.

#### Why A Gold-Specific Fix Is Insufficient

- Routing temple donation through a gold-specific helper would repair only the current field.
- A creator may replace the money field with another custom property id.
- City, building, event, task, house, and playable consumers would still be able to bypass the status store.
- Additional field-specific mutation helpers would duplicate behavior and make persistence coverage dependent on business-module implementation details.

#### Existing Governance Coverage

- `queue.script-editor-character-definition-status-convergence`
  - Completed the bounded CharacterDefinition and CharacterStatus overlay contract.
  - Covered only selected fixed stat, skill, and stamina mutation helpers.
- `queue.script-editor-character-status-save-runtime-continuation`
  - Completed AppState aggregation, save-envelope persistence, startup restore, and the covered city-begging settlement.
  - Explicitly excluded broad house and playable consumer migration.
- `queue.script-editor-character-authoring-surface-completion`
  - Covers creator-facing `customMap` controls.
  - Explicitly excludes gameplay formulas and broad runtime consumer changes.
- `queue.script-editor-event-effect-activation-convergence`
  - Covers typed effects, target resolution, receipts, and runtime mutation ownership.
  - Its recorded event-oriented boundary does not by itself guarantee house, shop, or playable mutation convergence.
- `queue.script-editor-status-overlay-generalization-review`
  - Reviews non-character runtime overlays.
  - It does not explicitly own arbitrary character custom-property mutation.

No current candidate or active queue explicitly owns the complete generic custom-property mutation, persistence, and consumer-migration problem.

#### Required Final Mechanism

- Define schema-governed runtime property ids and value types.
- Resolve feature semantics, such as the primary currency, through creator-configured property bindings instead of hardcoded field names.
- Provide one runtime mutation command supporting bounded operations such as `set`, `add`, and `subtract`.
- Validate the target entity, property definition, value type, operation, and configured constraints before applying a mutation.
- Materialize the current value from the authored default plus the runtime overlay.
- Persist the resolved final value under the canonical save/status owner.
- Keep authored character, city, and building definitions immutable during gameplay.
- Route event, house, shop, task, and playable mutations through the same mechanism rather than feature-local property writers.
- Do not create empty status records for new games or entities that have not been mutated.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-runtime-property-mutation-and-status-convergence`
- proposed_class: `required`
- proposed_goal: `Establish a schema-driven runtime property mutation and status persistence mechanism for creator-defined properties, then migrate representative direct-write consumers without creating feature-specific durable truths.`
- admission_note: `Admitted on 2026-07-15 as an active current-version queue, then closed with the bounded generic character property mutation/status slice complete and event/effect mutation routed as cross-family residue.`

#### Proposed Queue Boundary

In scope:

- Generic runtime property mutation contract.
- Character custom-property status storage and materialization.
- Semantic property binding for gameplay concepts such as primary currency.
- Canonical runtime commit and browser save/restore integration.
- Temple donation as the first failing representative consumer.
- At least one event/effect-driven representative consumer.
- Detection or tests preventing covered consumers from directly mutating authored definitions.

Out of scope:

- Inventing new gameplay systems.
- Full migration of every repository consumer in one unbounded batch.
- Non-character overlay implementation unless fresh evidence proves it is a prerequisite.
- Compatibility-only fallback that silently maps arbitrary custom properties back to `gold`.
- Editing live save status from the normal script-editor authoring surface.

#### Acceptance Criteria

- A creator-defined numeric character property can be selected through a semantic binding and changed by a runtime action.
- `set`, `add`, and `subtract` operations produce deterministic resolved values.
- The runtime result writes the resolved value to the canonical status owner.
- Browser save preserves the custom-property value.
- Continuing the same saved game restores the custom-property value after refresh.
- Starting a new game does not inherit the previous save's runtime property values.
- Authored definitions remain unchanged during mutation, save, and restore.
- Temple donation uses the generic property mechanism and restores the post-donation value when the same save is continued.
- Changing the configured primary-currency property id does not require changing temple business code.
- Invalid entity ids, property ids, value types, or unsupported operations fail closed with actionable diagnostics.
- Final end-to-end validation covers authoring, export, runtime mutation, save, refresh, continue, and restored value inspection.

#### Verification Evidence Required For Closure

- Unit tests for property definition validation and mutation operations.
- Runtime commit tests for custom-property status aggregation.
- Browser save-envelope round-trip tests.
- Startup restore tests proving authored-definition immutability.
- Temple donation regression test.
- End-to-end browser or equivalent integration test for refresh and continue behavior.
- Repository search evidence showing the covered temple path no longer directly writes the configured currency field.
