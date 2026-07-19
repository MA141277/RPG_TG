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

## Event Binding Test And Authoring Notes

### Purpose

- This section records operator-facing test and authoring steps for the event binding runtime replacement version.
- These notes are non-scheduling guidance only. They do not admit queues, close queues, or close the version.
- Use these steps during queue closeout review and version closeout review when validating that event binding authoring works through the real UI path and that exported bindings affect runtime behavior.

### Browser UI Test Steps

1. Start the dev server from the active event-binding worktree.
2. Open the app in Codex in-app browser / Browser Use, for example `http://localhost:5173/` or the currently assigned local port.
3. Enter the Script Editor.
4. Create or open a test project that contains at least one event and at least one owner object.
5. Visit each owner detail page and click the `事件` tab:
   - `人物`
   - `城市`
   - `建筑`
   - `对话`
   - `小游戏`
   - `剧情节点`
6. Confirm each `事件` tab actually switches the visible panel, not only that the tab button exists.
7. Confirm each owner-local `事件` tab shows the event binding authoring surface.
8. Visit the event detail page and confirm:
   - there is no `条件` tab on the event body page;
   - event body condition editing is not reachable;
   - binding references are read-only reverse references or jump links, not direct trigger/condition editors.

### How To Bind An Event

1. Open an owner detail page, such as a city or building.
2. Click the `事件` tab.
3. Click `新增事件绑定` / `Add Binding`.
4. In `绑定事件`, choose an event from the selector.
   - The selector must be driven by `project.events`.
   - The visible option should show the event title plus `eventId`.
   - The stored value remains the stable `eventId`.
   - A free text input is not acceptable as the primary authoring path.
5. In `触发时机` / `触发动作`, choose from the owner-family trigger selector.
   - The selector must be based on the supported trigger options for the current owner family.
   - Authors should not hand-write trigger action strings in the primary path.
6. Configure `启用` and `优先级` as needed.
7. Save the project.
8. Export the runtime pack and confirm the binding is written to `event-bindings.json`, not to `events.json`.

### Owner-Local And Dedicated Binding Surface Rules

- The owner-local `事件` tab and the dedicated `eventBindings` management surface must not expose the same controls in the same way.
- In an owner-local `事件` tab, the binding owner is the current object and must stay locked:
  - `绑定对象类型` / `owner.family` must not be editable there.
  - `绑定对象 ID` / `owner.id` must not be editable there.
  - Editing trigger fields must not change `owner.family` or `owner.id`.
  - A binding card must not disappear from the current owner-local list after changing trigger timing or trigger action.
- In the dedicated first-class `eventBindings` management surface, `绑定对象类型` and `绑定对象 ID` may remain editable because that surface owns global binding management.
- Do not confuse owner fields with trigger fields:
  - `绑定对象类型` means `owner.family`.
  - `绑定对象 ID` means `owner.id`.
  - `触发时机` means `trigger.timing`.
  - `触发动作` means `trigger.action`.
  - `绑定事件` means `eventId`.
- Locking the owner in an owner-local tab must only hide or lock `owner.family` and `owner.id`.
- Locking the owner must not hide:
  - `绑定事件`;
  - `触发时机`;
  - `触发动作`;
  - condition editor controls.
- `触发时机` and `触发动作` must remain Chinese-labelled selectors in owner-local tabs, using the current owner family as the option source.
- The dedicated binding surface should be used when the creator needs to move a binding between owners.

### How To Configure Conditions

1. Open a binding editor from a dedicated event binding surface or an owner-local `事件` tab.
2. In `组合关系`, choose a Chinese-labelled option:
   - `满足全部`
   - `满足任一`
   - `全部不满足`
3. Add a condition item.
4. Choose a Chinese-labelled condition type, such as:
   - `标记条件`
   - `变量条件`
   - `表达式条件`
   - `自定义条件`
   - `触发上下文条件`
5. Choose `字段来源` and then choose a `字段` from the registry-backed selector.
6. The field registry should include relevant authoring fields when available:
   - person base fields, such as force / intelligence / politics;
   - person custom / extended attributes;
   - city base fields;
   - city custom / extended attributes;
   - building base fields;
   - building custom / extended attributes;
   - payload and binding-context fields.
7. Choose `判断方式`.
   - Available operators should be constrained by the selected field `valueType`.
8. Enter or select `目标值`.
   - Boolean, enum, number, and text values should use appropriate controls.
9. Basic `flag` / `variable` conditions may export to runnable runtime shape when supported.
10. Advanced `expression` / `custom` / `binding-context` conditions may be saved as authoring data, but unsupported runtime/export paths must fail closed with diagnostics rather than silently becoming runnable.

### Runtime Effectiveness Test Steps

1. Create a Script Editor test project with:
   - an event body with an entry scene;
   - an event binding that references that event;
   - supported owner, trigger timing, and trigger action;
   - basic conditions, such as flag and variable conditions.
2. Export the project to a runtime pack.
3. Confirm:
   - `events.json` contains triggerless event bodies;
   - `event-bindings.json` contains the binding and its lowered runnable basic conditions.
4. Load the exported pack through the scenario loader.
5. Trigger a supported `TriggerContext`, such as a covered `city-enter` or other verified runnable entrypoint.
6. Confirm an observable runtime result:
   - EventBindingRuntime selects the binding;
   - the event starts;
   - `activeEventId`, `activeSceneId`, scene handoff, event history, or visible gameplay state changes.
7. Also verify fail-closed paths:
   - unsupported owner/action combinations do not export as runnable bindings;
   - unsupported advanced conditions fail closed;
   - fail-closed behavior is not counted as runtime support for the rejected capability.

### Acceptance Notes

- Source-string checks are useful guards, but they do not replace real UI interaction checks.
- A tab button is not complete unless clicking it switches to the expected panel.
- A selector required by design is not complete if implemented as a free text input.
- Saving or exporting binding data is not enough; runtime completion requires an observable runtime result.
- Browser runtime proof may be recorded as inconclusive only with a reason and equivalent automated runtime evidence.

## Open Problems

### MEMO-012: Script Editor City And Building Background Authoring

- status: `open`
- severity: `medium`
- classification: `future-target-candidate`
- proposed_queue: `queue.script-editor-city-building-background-authoring`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor city authoring`
  - `script editor building authoring`
  - `runtime city presentation`
  - `runtime building presentation`
  - `scenario pack assets`

#### Requested Capability

- The Script Editor city authoring surface needs a creator-facing control for assigning a city background.
- The Script Editor building authoring surface needs a creator-facing control for assigning a building background.
- Background choices should be saved as project/runtime data, not hardcoded per current built-in screen.

#### Scope Notes

- City and building background authoring should use project-owned asset references or an equivalent stable runtime asset id.
- Runtime rendering should consume the configured background through the same data path used by exported scenario packs.
- Missing or invalid background asset references should fail closed or fall back only through an explicitly documented default policy.
- This memo does not admit implementation and must not be mixed into an unrelated active queue without promotion/admission review.

#### Acceptance Notes

- In Script Editor, a creator can configure a background for a city and a building through visible authoring controls.
- Saving/reopening the Script Editor project preserves the selected background references.
- Runtime export includes the configured background references in the appropriate data files.
- Normal start, JSON runtime pack import, and Script Editor runtime preview all render the configured city/building backgrounds.
- Automated tests and simulated-human UI checks cover both city and building configuration paths.

### MEMO-013: Script Editor City/Building Enter-State And List/Search Unification

- status: `open`
- severity: `high`
- classification: `future-target-candidate`
- proposed_queue: `queue.script-editor-city-building-enter-state-and-preview-boundary`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor city authoring`
  - `script editor building authoring`
  - `script editor project overview`
  - `location access runtime`
  - `runtime preview`
  - `record list / selector UX`

#### Requested Capability

- City and building detail pages need a full `进入态` tab that creators can actually edit.
- `基础` must carry `默认背景`.
- `进入态` must carry editable `进入条件`, `可进入目标`, `提示文案`, and `拒绝提示`.
- Enter conditions should cover task conditions, event conditions, person stat / attribute conditions, and the existing city / building / player / world / story condition sources.
- The editor should reuse the existing `locationAccess` runtime meaning instead of inventing a parallel gate schema.
- Runtime preview mode should show a green border around the game area, but only while preview is active.
- The secondary list surfaces for city, building, story node, dialogue, event, playable, and text should match the person list shell: search, add, delete, list, and pagination.
- Detail-page internal selectors should use the same interaction language as the list surfaces, including consistent search / option presentation where selection is required.

#### Scope Notes

- `locationAccess` should stay the gate layer for `conditionExpression`, `blockedMessage`, `blockedSpeakerId`, `guidance`, `blockedReason`, and optional `refusalEventId`.
- Default background belongs in base information, not in the gate layer.
- The list/search shell and the detail-page selector shell are related, but they should be treated as shared UI infrastructure rather than one-off per-entity hacks.
- This draft is broad enough that it may need to be split into smaller candidate queues before admission.

#### Acceptance Notes

- City and building `进入态` tabs switch visibly and expose editable controls.
- Default background saves and participates in runtime behavior.
- Enter conditions block or allow entry at runtime through `locationAccess`.
- Preview mode shows the green frame and normal runtime does not.
- City, building, story node, dialogue, event, playable, and text all expose search / add / delete / list / pagination in their secondary surfaces.
- Detail-page internal selectors reuse the same UX language and do not feel like a separate ad hoc control style.
- Simulated-human tests must record every failure, run every case, and rerun from the start after fixes until the entire chain passes without skipping any case.
- Normal start, JSON runtime pack import, and Script Editor runtime preview must all preserve the same entry and list/selector behavior.

#### Split Outcome

- `queue.script-editor-city-building-enter-state-and-preview-boundary`
  - Owns city/building enter-state editing, default background, locationAccess-backed gate editing, and the preview-only green border.
- `queue.script-editor-city-building-secondary-list-and-selector-ux-unification`
  - Owns shared secondary list/search/add/delete/pagination shells and detail-page selector UX normalization.
- The original broad draft remains recorded here as the source memo, but the candidate work should now be reasoned about through the two narrower queues above.


### MEMO-011: Entry Shell UI Module Extraction

- status: `open`
- severity: `medium`
- classification: `future-target-candidate`
- proposed_queue: `queue.entry-shell-ui-module-extraction`
- owning_queue: `queue.entry-shell-ui-module-extraction`
- admission_status: `admitted`
- latest_disposition: `admitted-to-successor-version`
- affected_families:
  - `entry shell`
  - `main menu`
  - `json scenario start`
  - `script editor entry`
  - `character selection entry`

#### Current Evidence

- `src/ui/main-ui/main-ui-flow.js` currently renders and routes the pre-game entry UI directly through `renderMainMenu`, JSON start selection, Script Editor entry screens, and related `data-main-ui-action` / `data-script-editor-action` handlers.
- `src/main.ts` starts the entry UI by calling `mainUiFlow.showMainMenu()`, so the first extraction boundary can stay inside UI/view composition without changing runtime startup semantics.
- The entry UI is not the same boundary as in-game map, city, building, dialogue, review/council, or Script Editor workspace internals.

#### Proposed Scope

- Extract an Entry Shell module for startup/pre-game UI:
  - main menu;
  - JSON scenario start selection;
  - Script Editor entry screens;
  - character-selection entry presentation and action contract where it belongs to the startup flow.
- Add a narrow contract module, such as `entry-shell-contract`, for screen ids, action ids, and view model data.
- Add a render module, such as `entry-shell-view`, that owns markup for entry-shell screens.
- Keep `MainUiFlow` responsible for state, persistence, file picker calls, startup callbacks, and invoking existing handlers.
- Do not change game runtime startup/load semantics.
- Do not extract in-game map/city/review/Script Editor workspace behavior into this queue.

#### Acceptance Criteria

- Entry Shell render code is no longer embedded in `main-ui-flow.js`.
- `MainUiFlow` delegates startup/pre-game screen rendering to the Entry Shell module through a typed or documented view model contract.
- Existing visible behavior is preserved:
  - start game;
  - continue game;
  - JSON start;
  - Script Editor entry;
  - character-selection entry flow.
- Tests cover the extracted module contract and ensure main menu action ids remain stable.
- A browser/manual check confirms the startup UI still renders and routes to each entry flow.

#### Routing Notes

- This is not part of `target.script-editor-event-runtime-production-hardening`.
- Do not admit while an unrelated active queue is open.
- Promoted on 2026-07-19 into successor version `target.entry-shell-ui-module-extraction` and active queue `queue.entry-shell-ui-module-extraction`.

### MEMO-008: Event Trigger Dispatch And Person Event Bindings Need Separate Condition Ownership

- status: `open`
- severity: `medium`
- classification: `current-version-event-authoring-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor event authoring`
  - `event trigger dispatch`
  - `person event binding`
  - `condition authoring`
  - `runtime event execution`

#### Required Behavior

- Add or converge an event trigger dispatch function that owns when and how event triggers are evaluated and dispatched at runtime.
- Person-bound events must support trigger conditions on the binding relationship.
- The event definition itself should define only the event identity, event content, and deep event behavior/content.
- Event definitions must not own trigger conditions directly.
- Trigger conditions belong to the trigger/binding layer, such as a person-event binding, location trigger, menu trigger, or other runtime dispatch owner.
- Runtime dispatch should evaluate the binding/trigger condition before executing the referenced event.
- Script editor authoring should make this separation visible: event content is edited in the event module, while trigger conditions are edited where the event is bound or dispatched.

#### Acceptance Criteria

- Event records remain condition-free content definitions.
- Person-event bindings can configure a trigger condition.
- Runtime person-event dispatch evaluates the binding condition before running the event.
- The event trigger dispatch mechanism can route eligible triggers to event execution without duplicating condition logic inside event definitions.
- Save/export/import preserves person-event binding conditions separately from event content.
- Importing existing packs with event trigger conditions displays those conditions on the binding/trigger surface, not inside the event definition body.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-event-trigger-dispatch-and-binding-condition-convergence`
- proposed_class: `candidate`
- proposed_goal: `Separate event content from trigger ownership by adding condition-bearing event dispatch/binding surfaces, including person-bound event trigger conditions.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

### MEMO-009: Event Detail Pages Still Own Event-Body Condition Editing And Need Binding-Local Surfaces

- status: `open`
- severity: `medium`
- classification: `current-version-authoring-scope-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor event authoring`
  - `event binding authoring`
  - `owner-local binding surfaces`
  - `condition ownership`
  - `Blueprint review`

#### Required Behavior

- Event detail pages must edit event content only.
- Event detail pages must not directly edit trigger timing, condition groups, binding trigger fields, or binding conditions.
- Event detail pages may show read-only reverse references and jump links for bindings that reference the event.
- Person, city, building, dialogue, minigame, and story-node detail pages must provide local event-binding entry points.
- A dedicated first-class event-binding authoring surface must continue to own `project.eventBindings`.
- EventDefinition must not regain conditions ownership.

#### Acceptance Criteria

- Event-body condition editing entry points are removed or hidden from the event detail page.
- Event detail pages show only read-only binding reverse references and navigation.
- Event binding create/delete/edit flows exist on dedicated event-binding or owner-local surfaces.
- Local entry points write into `project.eventBindings`.
- EventDefinition remains condition-free.
- EventBinding.conditions continues to be the only editable condition owner.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-event-binding-owner-local-authoring-surfaces`
- proposed_class: `candidate`
- proposed_goal: `Move binding ownership out of event detail pages into dedicated event-binding and owner-local authoring surfaces while keeping event details read-only for reverse references.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue until the current trigger-context queue is closed and the owner-local split is re-reviewed against the design doc.`

### MEMO-007: Script Editor City And Building Entry State Should Become Condition Authoring

- status: `open`
- severity: `medium`
- classification: `current-version-runtime-authoring-gap`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `script editor city authoring`
  - `script editor building authoring`
  - `location access rules`
  - `LocationAccessRuntime`
  - `scenario pack import`
  - `runtime export`

#### Required Behavior

- In the script editor city module, rename the creator-facing `进入态` concept to `条件`.
- In the script editor building module, rename the creator-facing `进入态` concept to `条件`.
- The city/building `条件` surface must allow creators to configure the entry condition expression directly.
- Runtime entry checks must execute those configured condition expressions through `LocationAccessRuntime`.
- City and building entry eligibility should use the same runtime condition-expression path rather than feature-specific UI flags or scattered navigation checks.
- Importing an existing scenario pack must read the pack's existing city/building judgment or access expressions and display them in the script editor's `条件` configuration surface.
- Exported scenario packs must preserve the configured condition expressions in the runtime structure required by `LocationAccessRuntime`.

#### Acceptance Criteria

- City authoring shows `条件`, not `进入态`, for entry eligibility configuration.
- Building authoring shows `条件`, not `进入态`, for entry eligibility configuration.
- The `条件` UI can configure the condition expression used for entry.
- Runtime city entry evaluates the exported city condition through `LocationAccessRuntime`.
- Runtime building entry evaluates the exported building condition through `LocationAccessRuntime`.
- Imported scenario packs with existing access/judgment expressions reopen in the editor with equivalent `条件` configuration visible.
- Save/export/import round trip preserves the configured city/building condition expressions.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-location-condition-authoring-convergence`
- proposed_class: `candidate`
- proposed_goal: `Rename city/building entry-state authoring to condition authoring, make condition expressions configurable, and wire import/export/runtime execution through LocationAccessRuntime.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

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

### MEMO-010: Map And In-Game Review Need Provider-Backed Module Boundaries

- status: `open`
- severity: `medium`
- classification: `future-target-candidate`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-only`
- affected_families:
  - `campaign map`
  - `city marker and city information`
  - `navigation`
  - `in-game review / council flow`
  - `house review consumers`
  - `normal start`
  - `JSON runtime pack import`
  - `Script Editor runtime preview`

#### Required Behavior

- Map rendering must not own city coordinates, city domain records, city details, historical roster lookup, or entry rules.
- Map rendering should consume provider-backed location markers through a public interface.
- City coordinates and city information should be produced by a map-location provider or adapter outside the map view.
- Review / council flow should follow the same boundary: the review mechanism consumes provider or policy output instead of scattering review lifecycle truth across house, time, navigation, and shell paths.
- Existing map and review functionality must remain complete after modularization, not narrowed to the smallest current happy path.
- Every supported game entrypoint must use the same module contracts:
  - normal start;
  - JSON runtime pack import;
  - Script Editor runtime preview.

#### Current Implementation Evidence

- `src/ui/views/map/map-view.ts` currently receives map content plus city definitions, city-coordinate lookup, historical characters, historical city rosters, and map exploration state.
- `src/application/content/active-game-content.ts` currently derives `cityCoordinatesById` from `city.mapNodeId -> map.nodes`.
- `src/application/map/map-city-marker-view-model.ts` currently converts `CityDefinition` plus `cityCoordinatesById` into map markers.
- `src/application/navigation/campaign-map-exploration.ts` owns map fog / reveal state and is already a candidate seam for map exploration state.
- `src/application/review/review-cycle.ts` already exists as a shared review-cycle seam for schedule and compatibility mirrors.
- `src/application/time/council-priority.ts`, `src/application/time/council-attendance.ts`, `src/application/runtime/navigation-time-follow-up.ts`, and house modules still participate in host selection, arrival reminders, lateness, blocking, and review presentation.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.map-review-provider-boundary-extraction-and-acceptance`
- proposed_class: `future-target-candidate`
- proposed_goal: `Extract map location data and in-game review lifecycle dependencies behind provider-backed module interfaces, migrate consumers, inventory removable residue, remove old direct paths, and verify complete behavior across normal start, JSON import, and Script Editor runtime preview.`
- admission_note: `Recorded only. This must not become an active queue under the current Script Editor post-closeout fixup version unless a later version-plan promotion review explicitly admits it. It is expected to belong to a later modularization or runtime-boundary version.`

#### Proposed Queue Task Split

1. `task.map-review-provider-boundary-extraction.interface-and-adapter`
   - Define map provider interfaces such as `MapLocationMarker` and `MapLocationProvider`.
   - Move `city.mapNodeId -> map.nodes -> marker` assembly behind an adapter.
   - Define review provider or policy interfaces for schedule, host, lateness, participants, and completion output.
   - Do not change runtime behavior in this first slice.

2. `task.map-review-provider-boundary-extraction.consumer-cutover-and-inventory`
   - Migrate map UI to consume provider markers rather than `CityDefinition` / `cityCoordinatesById` directly.
   - Keep map click handling as marker or coordinate events; outer navigation owns city entry.
   - Migrate review consumers to the shared provider or policy where behavior is already covered.
   - Create `docs/refactor/map-review-boundary-removal-inventory.md`.
   - The inventory must list remaining direct dependencies, their current role, whether Step 3 removes them, and any waiver.

3. `task.map-review-provider-boundary-extraction.residue-removal`
   - Remove only the old direct paths listed in the Step 2 inventory.
   - Remove direct map UI dependency on city domain records and city-coordinate lookup.
   - Remove duplicated review lifecycle truth from house/local branches where the provider-backed path already covers behavior.
   - Do not remove house-local review presentation copy or UI that belongs to the host.

4. `task.map-review-provider-boundary-extraction.acceptance-and-guard`
   - Run source guards proving old direct paths were removed or explicitly waived.
   - Add human-simulation tests for map marker visibility, city information, city entry, review due flow, review completion, and next-cycle update.
   - Add external-integration tests proving another provider or test pack can feed map markers and review policy without Zhu Yuanzhang-only hardcoding.
   - Add completeness review to detect over-narrowing: the feature must not pass only by shrinking map/review behavior to the minimum current path.
   - Verify normal start, JSON runtime pack import, and Script Editor runtime preview all use the same map and review module contracts.

#### Step 2 Removal Inventory Requirements

- The inventory must be written before Step 3 starts.
- It must include at least:
  - map view direct use of `CityDefinition`;
  - `cityCoordinatesById` exposure to map rendering;
  - shell code that directly combines clicked map cells with city names;
  - review host selection / priority residue;
  - lateness and insufficient-time residue;
  - review arrival reminder residue;
  - house-local review lifecycle truth residue;
  - compatibility mirrors that cannot yet be removed.
- Step 3 may only remove items listed in the inventory unless a later queue admission expands scope.

#### Completeness Review Requirements

- The acceptance queue must reject a result that merely narrows the feature until tests pass.
- Map completeness must cover:
  - map open;
  - marker visibility;
  - city information display;
  - city click / entry;
  - exploration or fog behavior where supported.
- Review completeness must cover:
  - countdown / review date display;
  - time advancement to review due;
  - arrival reminder or equivalent review handoff;
  - host entry;
  - lateness / insufficient-time behavior where covered;
  - completion and next review cycle update.
- Entry-point consistency must cover:
  - normal start;
  - JSON runtime pack import;
  - Script Editor runtime preview.
- Any unsupported entrypoint or data source must be recorded as a waiver, not counted as success.

#### Non-Goals

- Do not merge map and review into one runtime mechanism.
- Do not move house-specific review copy into the shared review module.
- Do not invent a new gameplay loop while extracting the boundary.
- Do not make `main.ts` regain map or review business ownership.
- Do not change EventBindingRuntime semantics as part of this queue.
- Do not treat a Zhu Yuanzhang-only path as proof of general provider-backed support.

#### Acceptance Criteria

- Map rendering consumes provider-backed markers and no longer directly owns city domain data assembly.
- City marker data, city names, coordinates, and city detail summaries come from an adapter/provider.
- Review lifecycle truth is accessed through shared review provider/policy seams rather than house-local duplicated truth.
- House modules remain presentation/consumer owners for their review variant but do not own the shared review cycle truth.
- The Step 2 removal inventory exists and Step 3 cleanup follows it.
- Source guards prove removed direct paths do not return.
- Simulated human flow proves map and review work in gameplay.
- External integration tests prove both modules can be used outside the default built-in path.
- Normal start, JSON import, and Script Editor runtime preview all preserve map and review behavior through the new module contracts.

#### Verification Evidence Required For Closure

- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- Source search guards for removed map/review direct paths.
- Automated simulated-human flow covering map entry and review flow.
- Entry-point tests for normal start, JSON import, and Script Editor runtime preview.
- Removal-inventory closeout showing every listed residue removed, preserved by design, or waived with reason.

## 2026-07-18 Script Editor Runtime Preview Layout Edit Mode Memo

### Suggested Version

- target_id: `target.script-editor-runtime-preview-layout-edit-mode`
- purpose: `Implement Script Editor preview edit mode without mixing it into closed event-binding/runtime-preview fixup work.`

### Pasteable Admission Prompt

```text
按蓝图规范创建并实现新 version，不要混入旧 closeout：

target.script-editor-runtime-preview-layout-edit-mode

目标：
实现剧本编辑器“预览编辑模式”。

已确认设计：
1. 剧本编辑器点击【运行预览】后，先进入普通运行预览。
2. 普通预览右上角显示【编辑布局】和【退出预览】。
3. 点击【编辑布局】后进入布局编辑态。
4. 编辑态下：
   - 点击界面元素选中。
   - 长按元素后可以拖动位置。
   - 属性面板可调整位置、尺寸、层级、锚点、缩放策略、引用资源。
5. 保存粒度是整个项目/剧本包的所有可编辑界面，不是当前画面。
6. 所有运行时可见界面都要纳入 editable surface registry。
7. 资源替换支持：
   - 从项目资产库选择。
   - 本地导入资源到资产库后选择。
8. layout JSON 只保存稳定资源引用，例如 assetId，不保存文件内容。
9. 导出 runtime scenario pack 时生成 ui-layouts.json，并由 pack.json.files 引用。
10. runtime 正式 loader 消费 ui-layouts，不走临时预览专用路径。
11. layout 引用缺失资源时导出 fail closed。
12. 不改 EventBindingRuntime 语义。

建议队列：
1. queue.script-editor-preview-layout-edit-mode-admission
2. queue.runtime-editable-surface-registry
3. queue.script-editor-layout-asset-library
4. queue.script-editor-preview-layout-editor-ui
5. queue.runtime-pack-ui-layout-export-loader

先做 admission / evidence reconcile，再进入 implementation。
```

### Design Notes

- Entry flow is two-stage: `运行预览` starts normal runtime preview first; `编辑布局` explicitly enables editing.
- Edit mode uses click-to-select and long-press-to-drag to avoid accidental movement during normal runtime interaction.
- The saved artifact is a project-level layout collection covering all editable runtime screens.
- Resource replacement uses the project asset library as the primary path, with local import as an asset-library intake path.
- Runtime/export support must be real scenario-pack support, not a preview-only side channel.
