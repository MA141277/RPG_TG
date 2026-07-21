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
5. Visit each owner detail page and click the `浜嬩欢` tab:
   - `浜虹墿`
   - `鍩庡競`
   - `寤虹瓚`
   - `瀵硅瘽`
   - `灏忔父鎴廯
   - `鍓ф儏鑺傜偣`
6. Confirm each `浜嬩欢` tab actually switches the visible panel, not only that the tab button exists.
7. Confirm each owner-local `浜嬩欢` tab shows the event binding authoring surface.
8. Visit the event detail page and confirm:
   - there is no `鏉′欢` tab on the event body page;
   - event body condition editing is not reachable;
   - binding references are read-only reverse references or jump links, not direct trigger/condition editors.

### How To Bind An Event

1. Open an owner detail page, such as a city or building.
2. Click the `浜嬩欢` tab.
3. Click `鏂板浜嬩欢缁戝畾` / `Add Binding`.
4. In `缁戝畾浜嬩欢`, choose an event from the selector.
   - The selector must be driven by `project.events`.
   - The visible option should show the event title plus `eventId`.
   - The stored value remains the stable `eventId`.
   - A free text input is not acceptable as the primary authoring path.
5. In `瑙﹀彂鏃舵満` / `瑙﹀彂鍔ㄤ綔`, choose from the owner-family trigger selector.
   - The selector must be based on the supported trigger options for the current owner family.
   - Authors should not hand-write trigger action strings in the primary path.
6. Configure `鍚敤` and `浼樺厛绾 as needed.
7. Save the project.
8. Export the runtime pack and confirm the binding is written to `event-bindings.json`, not to `events.json`.

### Owner-Local And Dedicated Binding Surface Rules

- The owner-local `浜嬩欢` tab and the dedicated `eventBindings` management surface must not expose the same controls in the same way.
- In an owner-local `浜嬩欢` tab, the binding owner is the current object and must stay locked:
  - `缁戝畾瀵硅薄绫诲瀷` / `owner.family` must not be editable there.
  - `缁戝畾瀵硅薄 ID` / `owner.id` must not be editable there.
  - Editing trigger fields must not change `owner.family` or `owner.id`.
  - A binding card must not disappear from the current owner-local list after changing trigger timing or trigger action.
- In the dedicated first-class `eventBindings` management surface, `缁戝畾瀵硅薄绫诲瀷` and `缁戝畾瀵硅薄 ID` may remain editable because that surface owns global binding management.
- Do not confuse owner fields with trigger fields:
  - `缁戝畾瀵硅薄绫诲瀷` means `owner.family`.
  - `缁戝畾瀵硅薄 ID` means `owner.id`.
  - `瑙﹀彂鏃舵満` means `trigger.timing`.
  - `瑙﹀彂鍔ㄤ綔` means `trigger.action`.
  - `缁戝畾浜嬩欢` means `eventId`.
- Locking the owner in an owner-local tab must only hide or lock `owner.family` and `owner.id`.
- Locking the owner must not hide:
  - `缁戝畾浜嬩欢`;
  - `瑙﹀彂鏃舵満`;
  - `瑙﹀彂鍔ㄤ綔`;
  - condition editor controls.
- `瑙﹀彂鏃舵満` and `瑙﹀彂鍔ㄤ綔` must remain Chinese-labelled selectors in owner-local tabs, using the current owner family as the option source.
- The dedicated binding surface should be used when the creator needs to move a binding between owners.

### How To Configure Conditions

1. Open a binding editor from a dedicated event binding surface or an owner-local `浜嬩欢` tab.
2. In `缁勫悎鍏崇郴`, choose a Chinese-labelled option:
   - `婊¤冻鍏ㄩ儴`
   - `婊¤冻浠讳竴`
   - `鍏ㄩ儴涓嶆弧瓒砢
3. Add a condition item.
4. Choose a Chinese-labelled condition type, such as:
   - `鏍囪鏉′欢`
   - `鍙橀噺鏉′欢`
   - `琛ㄨ揪寮忔潯浠禶
   - `鑷畾涔夋潯浠禶
   - `瑙﹀彂涓婁笅鏂囨潯浠禶
5. Choose `瀛楁鏉ユ簮` and then choose a `瀛楁` from the registry-backed selector.
6. The field registry should include relevant authoring fields when available:
   - person base fields, such as force / intelligence / politics;
   - person custom / extended attributes;
   - city base fields;
   - city custom / extended attributes;
   - building base fields;
   - building custom / extended attributes;
   - payload and binding-context fields.
7. Choose `鍒ゆ柇鏂瑰紡`.
   - Available operators should be constrained by the selected field `valueType`.
8. Enter or select `鐩爣鍊糮.
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

### MEMO-014: City And Building Location Access Condition Authoring Correction

- status: `open`
- severity: `high`
- classification: `queue-candidate`
- proposed_queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- owning_queue: `queue.script-editor-city-building-location-access-condition-authoring-correction`
- admission_status: `admitted`
- latest_disposition: `admitted-to-active-execution`
- affected_families:
  - `script editor city authoring`
  - `script editor building authoring`
  - `location access runtime`
  - `runtime city entry`
  - `runtime building entry`
  - `normal start`
  - `JSON runtime pack import`
  - `Script Editor runtime preview`

#### Requested Capability

- Adjust the Script Editor city and building `杩涘叆鏉′欢` authoring surface so it matches the intended `locationAccess` runtime gate model.
- City and building detail pages must share the same `杩涘叆鏉′欢` structure.
- The refusal prompt must appear above the condition editor.
- Remove the old or over-broad entry-state controls:
  - `鎷掔粷浜嬩欢`
  - `鎷掔粷鍘熷洜`
  - `寮曞璇存槑`
  - `鍙嶉瑙掕壊`
- `鎷掔粷鎻愮ず` must be a select backed by the text module, not free text.
- `杩涘叆鏉′欢` must allow zero or more conditions. Zero conditions means the location is enterable.
- Entry conditions must be limited to three factors:
  - `浜嬩欢`
  - `浜虹墿`
  - `鏃堕棿`

#### Condition Authoring Rules

- Event condition:
  - Select an event from `project.events`.
  - The only allowed expressions are `瀹屾垚` and `鏈畬鎴恅.
- Person condition:
  - Use a layered selector: `浜虹墿 -> 灞炴€?-> 琛ㄨ揪寮?-> 鍊糮.
  - The person selector is backed by `project.people`.
  - The attribute selector is backed by the selected person's base attributes plus custom attributes.
  - The expression selector must be constrained by the selected attribute value type.
  - Numeric attributes support numeric comparison operators.
  - Text attributes support equality and contains-style operators.
  - Boolean attributes support yes/no style operators.
  - Enum attributes support equality operators.
- Time condition:
  - Use a layered selector: `鏃堕棿瀛楁 -> 琛ㄨ揪寮?-> 鍊糮.
  - Time fields should be sourced from runtime game time state, not transient UI state.
  - Supported expressions should be selected from the valid comparison set for the chosen time field.

#### Runtime Requirements

- City and building entry must continue to flow through the unified `locationAccess` runtime check.
- The edited authoring condition shape must be exportable, loadable, and interpretable by the production runtime. The runtime must not receive an authoring-only condition shape that it cannot evaluate.
- No condition means allow entry.
- All configured conditions satisfied means allow entry.
- Any failed condition blocks entry and displays the selected refusal prompt text.
- Normal start, JSON runtime pack import, and Script Editor runtime preview must use the same location-access judgment path.
- The change must not weaken existing city/building module boundaries or reintroduce direct entry bypasses.
- Do not change EventBindingRuntime semantics.

#### Acceptance Criteria

- City and building detail pages both expose `杩涘叆鏉′欢`.
- `鎷掔粷鎻愮ず` appears above the condition list.
- `鎷掔粷鎻愮ず` is a select backed by project texts and stores the selected `textId`.
- The UI no longer exposes `鎷掔粷浜嬩欢`, `鎷掔粷鍘熷洜`, `寮曞璇存槑`, or `鍙嶉瑙掕壊`.
- The condition factor selector only exposes `浜嬩欢`, `浜虹墿`, and `鏃堕棿`.
- Event conditions only expose `瀹屾垚` / `鏈畬鎴恅.
- Person conditions support `浜虹墿 -> 灞炴€?-> 琛ㄨ揪寮?-> 鍊糮 with attributes sourced from the selected person's base and custom attributes.
- Time conditions support a runtime-backed time field selector, expression selector, and value control.
- Empty conditions allow city/building entry.
- Satisfied conditions allow city/building entry.
- Failed conditions block city/building entry and display the configured refusal prompt.
- Runtime export and loader tests prove each supported authoring condition factor is lowered into a runtime-understandable locationAccess condition shape.
- Production runtime tests prove event, person, and time conditions are actually evaluated at city/building entry, not merely saved in project authoring data.
- Automated tests cover editor serialization/export and runtime location-access behavior for city and building.
- Simulated-human browser tests cover city entry conditions and building entry conditions.
- Simulated-human browser tests must cover every supported city and building entry-condition case, including:
  - no conditions;
  - event completed;
  - event not completed;
  - person attribute condition satisfied;
  - person attribute condition failed;
  - time condition satisfied;
  - time condition failed;
  - refusal prompt display when access is blocked.
- The simulated-human test matrix must run separately for city entry and building entry; passing one family must not be used as proof for the other.
- Simulated-human test execution must strictly follow the Blueprint multi-case test discipline: run the full required case set, record every failed case, repair only after the case set completes or a blocking bug prevents continuation, then rerun the failed case(s) until they pass.
- During simulated-human testing, every failed step must be recorded. Fixes may start only after the full test run completes or the test cannot continue.
- After fixes, the complete simulated-human test set must be rerun from the beginning until every required case passes; no test case may be skipped.

#### Routing Notes

- This memo has been promoted into the current version plan and admitted into the active execution queue after explicit operator request. It does not reopen `queue.script-editor-city-building-enter-state-and-preview-boundary`.
- Treat it as a corrective queue under the still-open `target.city-building-module-entry-and-project-startup-authoring` version.
- The prior enter-state queue is closed; this memo records the follow-up correction requested after that closeout.

### MEMO-015: Person Attribute Types And Runtime Condition Comparison

- status: `open`
- severity: `high`
- classification: `memo-only`
- proposed_queue: `none`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo`
- affected_families:
  - `script editor person authoring`
  - `script editor custom attribute authoring`
  - `script editor condition authoring`
  - `runtime condition evaluation`
  - `runtime pack export`
  - `runtime pack import`
  - `location access runtime`

#### Requested Capability

- Person base attributes and creator-defined custom attributes must have explicit attribute type definitions.
- The Script Editor must not infer condition behavior from field names, display labels, or current sample values.
- Condition authoring and runtime evaluation must use the declared attribute type to decide available operators, value controls, export shape, and comparison semantics.
- Comparable non-numeric attributes such as official rank, noble title, military rank, sect level, grade, and relationship level must be modeled as ordered enum data, not as directly compared display text.

#### Attribute Type Rules

- Creating or maintaining a person attribute requires a `valueType`.
- Supported minimum attribute types:
  - `number`: numeric values such as age, force, intelligence, reputation, money, and favor.
  - `text`: free text values such as native place, title, alias, and notes.
  - `boolean`: yes/no values such as wanted, ordained, or faction membership flags.
  - `enum`: fixed unordered options such as gender, faction, person type, or identity type.
  - `ranked-enum`: fixed ordered options such as official rank, noble title, military rank, sect level, grade, or relationship level.
- Not every attribute needs an enum table.
- Only `enum` and `ranked-enum` attributes require an `enumSourceId`.
- `ranked-enum` option records must include an order value used for runtime comparison.
- Runtime logic must never compare localized labels such as `鐭ュ簻` and `鍘垮皦` directly.

#### Enum Table Rules

- Enum tables must store stable option ids, display labels, and, for ranked enums, numeric order.
- Person data should store the selected enum option id rather than copied display text.
- Runtime evaluation resolves the stored option id through the enum table before comparing.
- Ranked comparison is only valid when both sides reference options from the same enum source unless an explicit conversion rule exists.
- Missing attribute definitions, enum tables, or enum options must fail closed with diagnostics.

#### Condition Authoring Rules

- The condition editor must constrain operators by selected attribute type:
  - `number`: equals, not equals, greater than, greater than or equal, less than, less than or equal.
  - `text`: equals, not equals, contains, exists, does not exist.
  - `boolean`: equals true or false.
  - `enum`: equals, not equals, exists, does not exist.
  - `ranked-enum`: equals, not equals, greater than, greater than or equal, less than, less than or equal, exists, does not exist.
- Person condition authoring should follow a layered flow:
  - choose condition factor `person`;
  - choose person;
  - choose attribute;
  - choose an operator constrained by the selected attribute type;
  - choose or enter the comparison value using a control appropriate for the attribute type.
- Number attributes use numeric inputs.
- Text attributes use text inputs.
- Boolean attributes use yes/no controls.
- Enum and ranked-enum attributes use option selectors backed by their enum table.

#### Runtime Requirements

- Runtime condition evaluation must read attribute definitions and enum tables from the loaded runtime pack.
- `number` comparisons must compare normalized numeric values.
- `text` comparisons must compare normalized strings according to the selected text operator.
- `boolean` comparisons must compare boolean values.
- `enum` comparisons must compare stable enum option ids.
- `ranked-enum` comparisons must resolve option ids to enum option order and compare those numeric orders.
- The same semantics must apply anywhere person attribute conditions are used, including location access conditions.
- Runtime pack export must include enough data for runtime evaluation to understand attribute types, enum table bindings, enum option ids, and ranked enum order.

#### Acceptance Criteria

- Person base attributes and custom attributes have explicit type definitions.
- Creating a custom person attribute requires selecting a supported value type.
- `enum` and `ranked-enum` attributes require selecting or creating an enum table.
- `ranked-enum` enum options require stable numeric order.
- The condition editor displays only operators valid for the selected attribute type.
- Numeric attributes such as age can be compared without an enum table.
- Ordinary enum attributes can be checked for equality but cannot use greater-than or less-than operators.
- Ranked enum attributes such as official rank can be compared by order.
- Runtime export includes attribute definitions, enum table definitions, person values, and conditions that reference them.
- Runtime import/load preserves the same type and enum metadata.
- Runtime condition evaluation uses type metadata and enum order rather than display text.
- Simulated-human tests cover at least:
  - numeric person attribute condition;
  - text person attribute condition;
  - boolean person attribute condition;
  - unordered enum person attribute condition;
  - ranked enum person attribute condition;
  - the same ranked enum attribute used in a city or building location-access condition.
- This memo is not a candidate queue and does not authorize execution until explicitly promoted by the user under Blueprint workflow rules.

### MEMO-016: Script Editor Library Navigation And Event Information Architecture Cleanup

- status: `open`
- severity: `medium`
- classification: `memo-only`
- proposed_queue: `none`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo`
- affected_families:
  - `script editor navigation`
  - `script editor library authoring`
  - `script editor dialogue authoring`
  - `script editor event authoring`
  - `runtime pack export`
  - `event runtime handoff`

#### Requested Capability

- Optimize Script Editor navigation grouping and event detail editing so old, duplicate, and empty event surfaces are removed.
- The event editor should focus on basic information, destination configuration, and a quick path for creating dialogue resources.
- Dialogue authoring remains a first-class resource, but its navigation belongs under the library group alongside text.

#### Navigation Rules

- Move the `瀵硅瘽` module into the `璧勬枡搴揱 group.
- `瀵硅瘽` and `鏂囨湰` must appear at the same navigation level under `璧勬枡搴揱.
- The old standalone `瀵硅瘽` entry should no longer appear in its previous location.
- This navigation change must not change dialogue data structure, runtime export shape, or runtime semantics.

#### Event Module Removal Rules

- Remove the following event detail surfaces from the `浜嬩欢` module:
  - `鍏宠仈瀵硅薄`
  - `Bindings`
  - `棰勮鍜屾牎楠宍
- Event binding authoring must remain owned by the new binding system or owner-local binding surfaces, not by the event body detail page.
- Removing these surfaces must not change `EventBindingRuntime` semantics or restore the old event-body binding model.

#### Event Basic Information Reorganization

- Remove these controls or sections from `浜嬩欢 -> 鍩虹淇℃伅`:
  - `浜嬩欢璇存槑`
  - `楂樼骇璁剧疆涓庣郴缁熶俊鎭痐
- Move the editable content from the old `鍘诲悜` surface into `浜嬩欢 -> 鍩虹淇℃伅`.
- After consolidation, `浜嬩欢 -> 鍩虹淇℃伅` should include the necessary event fields and destination fields, including:
  - event title;
  - event type;
  - enabled state;
  - destination type;
  - destination target.
- If the old `鍘诲悜` tab or section becomes empty after this move, remove it entirely instead of leaving an empty shell.

#### Quick Dialogue Creation Rules

- Add a `鏂板瀵硅瘽` shortcut button in `浜嬩欢 -> 鍩虹淇℃伅`.
- Place the shortcut near the event destination controls so creators can create a dialogue while configuring an event destination.
- Clicking `鏂板瀵硅瘽` opens a modal dialogue creation surface.
- The modal must reuse the same node creation/editing capability as the `璧勬枡搴?-> 瀵硅瘽` module.
- The shortcut creates a formal dialogue resource in the shared project dialogue data, not event-private temporary data.
- After creation, the new dialogue must be visible and editable under `璧勬枡搴?-> 瀵硅瘽`.
- After creation, the current event destination target should either auto-fill the new dialogue or make it immediately selectable.

#### Non-Goals

- Do not change `EventBindingRuntime` semantics.
- Do not change event runtime trigger behavior.
- Do not change the responsibility of `event-bindings.json`.
- Do not return to the old event-body binding model.
- Do not perform broad event data structure refactors unless the existing UI fields cannot express the production runtime requirement.

#### Acceptance Criteria

- `瀵硅瘽` appears under `璧勬枡搴揱 and at the same level as `鏂囨湰`.
- The old standalone `瀵硅瘽` navigation entry is gone.
- The event detail page no longer shows `鍏宠仈瀵硅薄`.
- The event detail page no longer shows `Bindings`.
- The event detail page no longer shows `棰勮鍜屾牎楠宍.
- `浜嬩欢 -> 鍩虹淇℃伅` no longer shows `浜嬩欢璇存槑`.
- `浜嬩欢 -> 鍩虹淇℃伅` no longer shows `楂樼骇璁剧疆涓庣郴缁熶俊鎭痐.
- The old `鍘诲悜` editable content is available under `浜嬩欢 -> 鍩虹淇℃伅`.
- If `鍘诲悜` has no remaining content, the `鍘诲悜` tab or section is not shown.
- `浜嬩欢 -> 鍩虹淇℃伅` contains a `鏂板瀵硅瘽` shortcut button.
- Clicking `鏂板瀵硅瘽` opens a dialogue creation modal.
- The modal's node editing behavior stays consistent with `璧勬枡搴?-> 瀵硅瘽`.
- A dialogue created from the event shortcut appears in `璧勬枡搴?-> 瀵硅瘽`.
- The event destination can select or auto-fill the newly created dialogue.
- Saving, exporting, and runtime preview continue to support event-to-dialogue handoff.
- Quick dialogue creation never creates event-private dialogue data; it must write to the shared dialogue data model.
- Simulated-human testing must cover Script Editor navigation, library dialogue entry, event detail basic information, destination configuration, quick dialogue creation, save, export, and runtime preview.
- This memo is not a candidate queue and does not authorize execution until explicitly promoted by the user under Blueprint workflow rules.

### MEMO-017: Script Editor New User Guide Minimal Scenario - Huangjue Temple Night Rules

- status: `open`
- severity: `medium`
- classification: `memo-only`
- proposed_queue: `none`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo`
- affected_families:
  - `script editor new user guide`
  - `script editor template authoring`
  - `script editor text authoring`
  - `script editor dialogue authoring`
  - `script editor event authoring`
  - `script editor event binding authoring`
  - `script editor city and building authoring`
  - `location access runtime`
  - `in-game review / council flow`
  - `Script Editor runtime preview`

#### Draft Concept

- Working title: `Huangjue Temple Night Rules`.
- Chinese title to preserve for later UI copy: `Huangjue-si Ye Gui`.
- Genre direction: rule-horror plus light escape-room scenario.
- Product role: first new-user-guide sample scenario for Script Editor, focused on making a small but meaningful runnable scenario rather than an empty tutorial output.
- Narrative role: a parallel branch under the Huangjue Temple / Zhu Yuanzhang chapter context, not a mandatory continuation of chapter one.

#### Rationale

- Users may not finish or fully understand the first chapter before opening the Script Editor.
- A parallel short scenario can stand alone while still reusing the familiar Huangjue Temple setting.
- Rule-horror structure lets creators easily customize rules, consequences, dialogue, and route outcomes.
- The scope stays small enough for a beginner guide while still demonstrating real Script Editor capabilities.
- The scenario can naturally use the in-game review / council mechanism as an ending review, interrogation, or rule-compliance recap.

#### Suggested Player Loop

- Start in a Huangjue Temple side hall or sealed room.
- Show a short rule notice.
- Let the player investigate or interact through building, dialogue, and event entrypoints.
- Correct choices mark rule-compliance events as completed.
- Wrong choices trigger refusal or anomaly dialogue.
- Completing enough rule-compliance events unlocks the next building or room.
- The ending uses a review-like recap to judge whether the player followed the rules.
- Success ends with escape, passage, or a revealed clue; failure returns the player to the sealed room or ends with a warning.

#### Minimum Scenario Content

- Characters:
  - default playable role from the existing Zhu Yuanzhang context;
  - one mysterious monk or temple keeper NPC.
- Locations:
  - starting side hall;
  - locked inner hall or exit destination.
- Text entries:
  - rule notice;
  - anomaly warning;
  - success clue;
  - failure or refusal prompt.
- Dialogues:
  - rule notice dialogue;
  - monk question dialogue;
  - refusal / violation dialogue;
  - ending review dialogue.
- Events:
  - read rules;
  - obey first rule;
  - obey second rule;
  - answer monk correctly;
  - unlock inner hall;
  - fail rule check.
- Event bindings:
  - building enter triggers rule notice or monk dialogue;
  - dialogue completion triggers rule-compliance events;
  - location access blocks the inner hall until the required event state is satisfied.
- Location access:
  - blocked entry displays a dialogue prompt;
  - no unsupported authoring-only condition shape may reach runtime.

#### New User Guide Requirements

- The guide should let a beginner create this scenario without understanding internal terms such as `event-bindings.json`, `locationAccess`, or runtime pack export.
- The guide should expose creator-facing questions:
  - What rule does the player see?
  - What action violates the rule?
  - What happens when the player obeys?
  - What happens when the player violates it?
  - Which room or building unlocks after success?
  - What does the final review say?
- The guide may auto-create the underlying texts, dialogues, events, event bindings, and location-access rules.
- The generated content must remain editable through the normal Script Editor modules after guide completion.
- Runtime preview must use the normal Script Editor preview path, not a guide-only runtime path.

#### Open Design Questions For Later Refinement

- Whether the first version should use two rules or three rules.
- Whether the starting location should be a building directly or a city/building pair.
- Whether the review ending should use the existing review/council module directly or a dialogue-only approximation until the review module exposes a clean integration surface.
- Whether the guide should offer fixed template copy or ask the creator to fill each rule in one by one.
- Whether success should unlock a new room, complete the scenario, or branch to a second short scene.

#### Acceptance Notes For Future Queue Promotion

- This memo is not a candidate queue and does not authorize execution until explicitly promoted by the user under Blueprint workflow rules.
- Future queue acceptance should require simulated-human Script Editor testing from guide start to runtime preview completion.
- The generated scenario must be meaningful enough to show rule, consequence, unlock, and ending feedback.
- The generated scenario must be editable through normal text, dialogue, event, event-binding, city/building, and location-access surfaces.
- The runtime path must work through normal start/preview semantics without introducing a template-only bypass.

### MEMO-018: Script Editor Buildings JSON Separation And City Building References

- status: `open`
- severity: `medium`
- classification: `memo-only`
- proposed_queue: `none`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo`
- affected_families:
  - `script editor project package`
  - `script editor city authoring`
  - `script editor building authoring`
  - `runtime pack export`
  - `runtime pack import`
  - `city entries`
  - `location access runtime`

#### Requested Capability

- Keep Script Editor authoring data separated by creator-facing concepts:
  - city records belong in `cities.json`;
  - building records belong in `buildings.json`;
  - cities should keep only building references, such as `houseIds` or `mountedBuildings`, rather than embedding full building definitions.
- The Script Editor UI should treat building records as first-class editable authoring objects.
- The city detail surface should manage which building ids are mounted or associated with the city, not duplicate the building records themselves.
- Runtime export can continue lowering editor `buildings.json` records into runtime `houses.json` until a separate runtime contract migration is explicitly admitted.

#### Current Evidence

- Script Editor project-package contract already has `project.json.files.buildings = "./buildings.json"`.
- `ScriptEditorProjectDefinition.buildings` is the editor-side building table.
- `ScriptEditorCityRecord` already supports `houseIds?: string[]` and `mountedBuildings?: { buildingId, npcIds, primaryNpcId }[]`.
- Runtime scenario packs still use `houses.json` and `HouseDefinition`.
- `runtime-pack-import.ts` maps runtime `pack.houses` into editor `project.buildings`.
- `runtime-pack-export.ts` lowers editor buildings back into runtime `houses.json`.

#### Proposed Boundary

- In scope for a future editor-focused queue:
  - Make the editor/project-package boundary explicit in documentation and tests.
  - Ensure saved Script Editor projects always write building authoring data to `buildings.json`.
  - Ensure city records only store stable building references and mount metadata.
  - Ensure imports from runtime `houses.json` populate editor `buildings.json` on project save.
  - Ensure export from editor `buildings.json` still produces valid runtime `houses.json`.
  - Add validation that city building references point to existing building ids.
  - Add validation that the same building id is not mounted into multiple cities unless explicitly supported.
- Out of scope unless separately admitted:
  - Renaming runtime `houses.json` to `buildings.json`.
  - Renaming `HouseDefinition`, `houseId`, house modules, or runtime house contracts.
  - Breaking existing scenario-pack consumers that expect `pack.files.houses`.
  - Removing `city-entries.json` or `location-access.json`.

#### Runtime Contract Note

- Runtime should remain stable for now:
  - runtime pack input: `houses.json`;
  - runtime domain: `HouseDefinition`;
  - runtime city association: `cities[].houseIds` and/or `city-entries.json`;
  - runtime access control: `location-access.json`.
- If the project later wants runtime packs to expose `buildings.json` directly, that must be a dedicated contract migration queue with loader/export compatibility, content migration, and source guard coverage.

#### Acceptance Notes For Future Queue Promotion

- Saving a Script Editor project writes building data to `buildings.json`.
- Opening the saved project restores the same building records from `buildings.json`.
- City records store building ids or mount metadata, not duplicated building records.
- Importing a runtime pack with `houses.json` creates editor building records.
- Exporting an editor project with `buildings.json` produces runtime `houses.json`.
- Runtime preview, JSON runtime import, and normal start still work after export.
- Tests cover project save/load, runtime import, runtime export, city reference validation, and duplicate mount rejection or explicit waiver.
- This memo is not a candidate queue and does not authorize execution until explicitly promoted by the user under Blueprint workflow rules.

### MEMO-019: Script Editor Runtime Preview UI Component Editing Draft

- status: `open`
- severity: `medium`
- classification: `memo-only`
- proposed_queue: `none`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo`
- cleanup_note: `No old preview-layout task remains in this memo after the prior removal of the 2026-07-18 runtime preview layout edit-mode memo. This entry is the consolidated replacement draft for preview UI editing and component authoring.`
- affected_families:
  - `Script Editor runtime preview`
  - `script editor UI editing`
  - `script editor event authoring`
  - `script editor dialogue authoring`
  - `script editor minigame binding`
  - `script editor city and building authoring`
  - `runtime pack export`
  - `runtime pack import`
  - `runtime UI presentation`

#### Draft Goal

- Extend Script Editor runtime preview so creators can edit a bounded set of UI components while previewing a scenario.
- The first stage should not attempt a full UE-style blueprint editor or unrestricted UI builder.
- The first stage should provide partial UI editing capability inside preview, focused on adding and configuring buttons and cards.
- Preview UI editing must remain a creator-facing composition layer over existing Script Editor events, dialogues, minigames, cities, and buildings.
- It must not create a preview-only runtime path or hidden click handlers that disappear after export.

#### Core Positioning

- `Run preview` continues to launch the normal runtime preview flow.
- UI editing is an explicit mode entered from runtime preview, not the default preview behavior.
- Normal preview must remain playable and must not accidentally move or edit UI components.
- UI component edits must be stored in Script Editor project data or a future stable layout/component data file.
- Runtime export must include the UI component configuration in a stable scenario-pack file.
- The production runtime loader must consume that exported UI component configuration through a formal loader path.

#### First-Stage UI Component Scope

- Supported component types:
  - button;
  - card.
- Supported button authoring:
  - add button;
  - remove button;
  - edit button label;
  - choose visible/enabled state where supported;
  - adjust ordering or basic placement;
  - bind click behavior to an existing Script Editor source.
- Supported card authoring:
  - add card;
  - remove card;
  - edit card title;
  - edit card description;
  - choose image/background asset by stable asset reference where supported;
  - adjust ordering or basic placement;
  - bind card click behavior to an existing Script Editor source.
- First-stage editing may limit itself to adding UI button count and card count plus basic labels and event binding. Advanced layout controls can remain future work.

#### Click Binding Sources

- Button and card click behavior must be selected from existing Script Editor sources, not typed as script code.
- Minimum selectable source families:
  - `event` from `project.events`;
  - `dialogue` from `project.dialogues`;
  - `minigame` from `project.minigames`;
  - `city` from `project.cities`;
  - `building` from `project.buildings`.
- Later source families may include task, story-node, chapter progress, or other runtime-supported actions only after their runtime handoff is proven.
- Missing or deleted click targets must be visible as validation errors and must block export or require explicit repair.

#### Runtime Behavior Rules

- A button click that targets an event must dispatch through the formal event runtime path.
- A button click that targets a dialogue must open the formal dialogue/runtime scene path.
- A button click that targets a minigame must launch through the formal playable/minigame integration path.
- A button click that targets a city or building must route through formal navigation and location-access checks.
- Card clicks follow the same action rules as buttons.
- UI component actions must not mutate runtime state directly.
- UI component actions must not bypass EventBindingRuntime, locationAccess, dialogue runtime, playable runtime, or navigation guards.

#### Data And Export Expectations

- UI component configuration should be represented as stable project data, not ad hoc DOM state.
- Export may use a future `ui-layouts.json`, `ui-components.json`, or equivalent stable file, but the file name and schema must be frozen before implementation.
- `pack.json.files` must explicitly reference the exported UI component/layout file.
- Runtime loader must consume the file in normal runtime start, JSON runtime pack import, and Script Editor runtime preview.
- Asset references must use stable ids such as `assetId`; exported data must not embed local file paths or raw file bytes unless the scenario-pack asset contract explicitly supports that.
- Invalid component references, missing assets, missing target events, or unsupported action families must fail closed with actionable diagnostics.

#### Relationship To New User Guide

- The `Huangjue Temple Night Rules` beginner scenario can use this capability later to expose cards such as:
  - view rules;
  - inspect altar;
  - ask the monk;
  - try the inner door.
- Each card can bind to a formal event, dialogue, or building entry.
- New users should see creator-facing controls such as `what does this button do` and `what happens when this card is clicked`, not runtime terms such as handler id or pack file.

#### Non-Goals

- Do not implement a UE-style visual blueprint editor in this queue.
- Do not let users write JavaScript or arbitrary scripts.
- Do not introduce arbitrary custom component types in the first stage.
- Do not encode runtime business logic inside layout/component data.
- Do not create preview-only buttons or cards that do not work after export.
- Do not change EventBindingRuntime semantics.
- Do not rename runtime `houses.json` to `buildings.json`.
- Do not use UI component clicks to bypass location access, dialogue, event, playable, or navigation contracts.

#### Acceptance Notes For Future Queue Promotion

- Runtime preview exposes an explicit UI editing mode only during preview.
- The UI editing mode can add at least one button.
- The button can bind its click target to an existing Script Editor event.
- The UI editing mode can add at least one card.
- The card can bind its click target to an existing Script Editor event.
- Previewing the scenario and clicking the created button or card triggers the selected event through the formal runtime path.
- Project save/reopen preserves the created button/card configuration.
- Runtime export includes the component configuration in a formal scenario-pack file.
- JSON runtime import can load the exported pack and the button/card still triggers the selected runtime action.
- Deleted or missing target events are surfaced as validation errors.
- Simulated-human testing must cover creating a button, binding an event, creating a card, binding an event, running preview, clicking both, saving/reopening, exporting, JSON importing, and clicking again.
- This memo is not a candidate queue and does not authorize execution until explicitly promoted by the user under Blueprint workflow rules.

### MEMO-020: Script Editor City Mounted NPC Canonical Authoring Cleanup

- status: `open`
- severity: `medium`
- classification: `queue-candidate`
- proposed_queue: `queue.script-editor-city-mounted-npc-canonical-authoring-cleanup`
- owning_queue: `queue.script-editor-city-mounted-npc-canonical-authoring-cleanup`
- admission_status: `candidate-recorded`
- latest_disposition: `promoted-to-current-version-candidate`
- affected_families:
  - `script editor city authoring`
  - `script editor mounted building authoring`
  - `script editor mounted NPC authoring`
  - `runtime pack import`
  - `runtime pack export`
  - `city NPC pools`
  - `house character assignment`

#### Decision Summary

- The Script Editor city mounted-building/NPC panel must treat `city.mountedBuildings[].npcIds` as the only canonical authoring source for building-to-NPC assignment.
- `cityNpcPools` is a runtime/export family for city NPC resident data and activity behavior. It must not be used as the canonical source for the city mounted-building/NPC authoring panel.
- `cityNpcPools` may be generated from canonical city-mounted authoring data during export, but editor UI must not infer or repair `city.mountedBuildings` from `cityNpcPools`.
- Existing reverse-inference paths that derive `city.mountedBuildings` from `cityEntries`, `houses.characterIds`, and `cityNpcPools` are considered old compatibility logic for this cleanup and should not be reused by the standard authoring flow.

#### Required Standard Flow

1. The city mounted-building/NPC panel reads and writes only `city.mountedBuildings`.
2. Each mounted building row stores:
   - `buildingId: string`;
   - `npcIds: string[]`;
   - `primaryNpcId: string | null`.
3. NPC dropdown options are sourced from `project.people` records that are valid NPC/person candidates for authoring.
4. A mounted building with no NPC is valid and must persist as `npcIds: []`.
5. A mounted building with no primary NPC is valid and must persist as `primaryNpcId: null`.
6. If `primaryNpcId` is not present in the same row's `npcIds`, normalization must clear it to `null` or validation must fail closed with a clear authoring error. The preferred default is to clear it to `null` and surface validation feedback.
7. If `npcIds` references a missing `project.people` record, export/validation must fail closed with actionable diagnostics instead of silently writing a broken runtime resident.

#### Runtime Export Rules

- Export lowers `city.mountedBuildings` into runtime families:
  - `cities[].houseIds`;
  - `houses[].cityId`;
  - `houses[].characterIds`;
  - `houses[].defaultCharacterId`;
  - `cityEntries[]`;
  - `cityNpcPools[]`.
- When canonical `city.mountedBuildings` exists, exported `cityEntries` and `cityNpcPools` must be generated from it rather than preserved from stale imported runtime tables.
- Export must preserve the distinction between:
  - mounted assignment: `city.mountedBuildings[].npcIds`;
  - runtime city resident/activity data: `cityNpcPools[].residents`.

#### Runtime Import Rules

- Standard Script Editor project import must preserve explicit `cities[].mountedBuildings` when present.
- Pure runtime-pack import must not silently manufacture canonical mounted-authoring truth by reverse-inferencing from `cityEntries`, `houses.characterIds`, or `cityNpcPools`.
- If an imported pack lacks `cities[].mountedBuildings`, the editor should treat the mounted-authoring structure as absent and report that the pack does not contain standard mounted-authoring data, rather than pretending the inferred compatibility shape is canonical.

#### Old Logic To Retire

- Do not rely on reverse-inference helpers that reconstruct mounted-authoring data from runtime families, including logic equivalent to:
  - `applyImportedMountedBuildings`;
  - `readImportedMountedNpcIds`;
  - `readImportedPrimaryNpcId`.
- Do not let `cityNpcPools` drive which NPC rows are displayed in the city mounted-building/NPC panel.
- Do not use `houses.characterIds` as the editor-side canonical owner for city-mounted NPC assignment.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-city-mounted-npc-canonical-authoring-cleanup`
- proposed_class: `candidate`
- proposed_goal: `Make city.mountedBuildings the single canonical authoring source for mounted building/NPC assignment, remove runtime-family reverse inference from the standard editor flow, and verify empty NPC and empty primary-NPC cases.`
- admission_note: `Promoted into the current version plan as a recorded-only candidate on 2026-07-20 after explicit operator request. This entry must not become active unless explicitly admitted through the current version plan.`

#### Acceptance Criteria

- The city mounted-building/NPC panel displays rows only from `city.mountedBuildings`.
- Existing `city.mountedBuildings[].npcIds` values render as selected NPC rows.
- The panel does not display additional mounted NPC rows only because matching residents exist in `cityNpcPools`.
- Adding/removing NPC rows updates only the selected city's `mountedBuildings`.
- A mounted building with `npcIds: []` remains visible and survives save/load.
- A mounted building with `primaryNpcId: null` remains valid and survives save/load.
- Selecting a primary NPC is limited to the same row's mounted `npcIds`.
- Export generated from canonical authoring data produces coherent `houses.characterIds`, `houses.defaultCharacterId`, `cityEntries`, and `cityNpcPools`.
- Source guards prove the old reverse-inference helpers are removed or no longer reachable from the standard import/editor flow.

#### Verification Evidence Required For Closure

- UI/source tests proving the panel reads from `city.mountedBuildings` and not from `cityNpcPools`.
- Save/load tests for mounted buildings with no NPC and no primary NPC.
- Validation/export tests for missing NPC ids and primary NPC ids outside the row's `npcIds`.
- Runtime export tests proving canonical mounted authoring lowers into `houses`, `cityEntries`, and `cityNpcPools`.
- Import tests proving explicit `cities[].mountedBuildings` is preserved and runtime-family reverse inference is not used as canonical authoring truth.
- Source-search evidence for retired reverse-inference helpers or their removal from the standard editor flow.

### MEMO-012: Script Editor City And Building Background Authoring

- status: `closed`
- severity: `medium`
- classification: `future-target-candidate`
- proposed_queue: `queue.script-editor-city-building-background-authoring`
- owning_queue: `queue.script-editor-city-building-background-authoring`
- admission_status: `admitted-and-closed`
- latest_disposition: `closed-with-city-building-background-authoring-queue`
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

- In the script editor city module, rename the creator-facing `杩涘叆鎬乣 concept to `鏉′欢`.
- In the script editor building module, rename the creator-facing `杩涘叆鎬乣 concept to `鏉′欢`.
- The city/building `鏉′欢` surface must allow creators to configure the entry condition expression directly.
- Runtime entry checks must execute those configured condition expressions through `LocationAccessRuntime`.
- City and building entry eligibility should use the same runtime condition-expression path rather than feature-specific UI flags or scattered navigation checks.
- Importing an existing scenario pack must read the pack's existing city/building judgment or access expressions and display them in the script editor's `鏉′欢` configuration surface.
- Exported scenario packs must preserve the configured condition expressions in the runtime structure required by `LocationAccessRuntime`.

#### Acceptance Criteria

- City authoring shows `鏉′欢`, not `杩涘叆鎬乣, for entry eligibility configuration.
- Building authoring shows `鏉′欢`, not `杩涘叆鎬乣, for entry eligibility configuration.
- The `鏉′欢` UI can configure the condition expression used for entry.
- Runtime city entry evaluates the exported city condition through `LocationAccessRuntime`.
- Runtime building entry evaluates the exported building condition through `LocationAccessRuntime`.
- Imported scenario packs with existing access/judgment expressions reopen in the editor with equivalent `鏉′欢` configuration visible.
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

- The script editor person detail surface currently exposes a sibling tab labeled `瀵硅瘽`.
- The tab edits `person.dialogueIds`, which is only a relationship/organization list.
- The current runtime does not treat `person.dialogueIds` as a generic "click this person to open dialogue" trigger.
- Creators can reasonably misread this tab as a runtime dialogue trigger configuration surface.
- The same sibling navigation does not expose a dedicated `鎶€鑳絗 tab, even though person skills are core editable character data.

#### Current Implementation Evidence

- `src/ui/main-ui/main-ui-flow.js` defines the person tab buttons as `灞炴€, `瀵硅瘽`, `浜ゆ槗`, and `浜嬩欢`.
- `renderScriptEditorPersonTabPanel` renders the `dialogues` tab through `renderScriptEditorPersonRelationPanel`.
- The `dialogues` tab writes to `person.dialogueIds` through `addScriptEditorPersonRelation("dialogueIds")` and related handlers.
- The editor PRD states that the person dialogue tab is only a relationship organization entry and is not a second dialogue editor.
- Current runtime dialogue opening is owned by events, scenes, house modules, menu actions, or location dialogue state, not by a generic person `dialogueIds` click trigger.

#### Root Cause

The person authoring UI exposes a relationship-only field as a top-level creator-facing "dialogue" feature. Because the runtime does not currently consume that field as a direct trigger, the tab promises more behavior than it can deliver. At the same time, skills are first-class person data and should be easier to find than an inactive dialogue relationship list.

#### Required Final Mechanism

- Remove the `瀵硅瘽` tab from the person detail sibling tab list.
- Add a sibling `鎶€鑳絗 tab for person skill editing.
- Keep actual dialogue trigger configuration on the correct runtime entry surfaces: events, city/building/NPC placement, menu actions, and dialogue follow-ups.
- Do not expose `person.dialogueIds` as a normal creator-facing runtime trigger field unless a later queue implements a real resolver path for it.
- Preserve existing data import/export for `dialogueIds` if needed for compatibility, but do not present it as an active person feature.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-person-authoring-navigation-cleanup`
- proposed_class: `candidate`
- proposed_goal: `Clean up the person detail authoring tabs by removing the misleading dialogue relationship tab and adding a dedicated skills tab backed by the person skill field source.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria

- Person detail tabs no longer show `瀵硅瘽`.
- Person detail tabs show a sibling `鎶€鑳絗 tab.
- Skill fields remain editable from the new `鎶€鑳絗 tab.
- Dialogue trigger setup remains discoverable through event, dialogue, city/building, NPC placement, or menu entry surfaces rather than person `dialogueIds`.
- Existing person save/export/runtime materialization remains valid.

#### Verification Evidence Required For Closure

- UI/source test proving the person tab list contains `鎶€鑳絗 and does not contain `瀵硅瘽`.
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
- The same page then renders an additional panel labeled `鏄犲皠瀛楁 / 瑙掕壊璧勬枡瀛楁缁刞.
- The additional panel exposes overlapping person fields such as name, person type, role, biography, birth year, death year, age, city/building references, stats, and skills.
- This makes it look as if the imported or authored character data has gained an extra `瑙掕壊璧勬枡瀛楁缁刞, even though the duplicate block is UI rendering rather than a new data row in the scenario pack.

#### Current Implementation Evidence

- `src/ui/main-ui/main-ui-flow.js` renders a handwritten person profile form in `renderScriptEditorPersonTabPanel`.
- The same render path then calls `renderScriptEditorPersonMappedFieldGroups(person)`.
- `renderScriptEditorPersonMappedFieldGroups` renders the hardcoded `鏄犲皠瀛楁 / 瑙掕壊璧勬枡瀛楁缁刞 panel.
- The mapped controls are sourced from `listScriptEditorPersonFieldDefinitions()` in `src/application/script-editor/field-mapping.ts`.
- `src/application/script-editor/field-mapping.ts` already defines the person field table for base, profile, stat, skill, and custom-family representative fields.
- `src/application/script-editor/person-authoring.ts` already routes many fixed fields through mapped attribute helpers.

#### Root Cause

The person profile authoring surface currently combines two field sources: a legacy handwritten base/profile form and the newer field-mapping-driven form. The newer mapped field table was added without replacing or fully absorbing the older fixed form, so the same canonical person data is exposed through duplicate UI sections.

#### Required Final Mechanism

- Render the normal person profile page from one canonical field source.
- Use the field mapping table as the source of truth for base/profile/stat/skill fields where those fields are part of the current authoring contract.
- Read and edit creator-defined custom attributes from the person custom attribute list or a governed custom-field group.
- Do not show an internal implementation label such as `鏄犲皠瀛楁` as a creator-facing field group.
- Do not keep a second handwritten form that edits the same canonical fields unless it is explicitly a debug/raw-data view.
- Preserve existing save/export behavior for person records while removing duplicate editing paths.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-person-field-source-unification`
- proposed_class: `candidate`
- proposed_goal: `Unify the person profile authoring surface so base/profile/stat/skill fields are rendered from the field mapping table and custom attributes are rendered from the custom attribute source without duplicate creator-facing sections.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria

- The person profile tab shows one coherent set of base/profile controls, not both the legacy form and `瑙掕壊璧勬枡瀛楁缁刞.
- Name, person type, role, biography, birth/death year, age, city/building, portrait, stats, and skills remain editable where supported by the current contract.
- Custom attributes remain editable without being mixed into duplicated base/profile controls.
- Creator-facing labels are product/domain labels, not internal labels such as `鏄犲皠瀛楁`.
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

### MEMO-021: UI Scene Layer Stack Draft

- status: `open`
- severity: `medium`
- classification: `memo-only`
- proposed_queue: `none`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo`
- affected_families:
  - `main UI rendering`
  - `city view`
  - `building view`
  - `map view`
  - `runtime preview`
  - `dialogue and modal overlays`
  - `visual effects`

#### Draft Layer Order

From bottom to top:

1. `BG`
   - Owns static backgrounds, video backgrounds, scene base images, and other non-interactive environment visuals.
   - Should not own gameplay interaction or pointer handling.
2. `BackEffect`
   - Owns environment effects behind the UI, such as weather, light, smoke, ambient particles, and background transitions.
   - Default pointer behavior should be non-interactive.
3. `UI Components`
   - Owns the primary interactive surface: map, city, building, menus, character panels, buttons, lists, and gameplay controls.
   - This is the default hit-test layer for normal interaction.
4. `Popup`
   - Owns modal and non-modal overlays: dialogue, confirmation panels, refusal prompts, system prompts, and blocking notices.
   - Modal popups must block lower-layer interaction; non-modal popups must declare their pointer behavior.
5. `FontEffect`
   - Owns topmost text and typography effects: floating text, reward text, damage or result numbers, global captions, and transition text.
   - Default pointer behavior should be non-interactive.

#### Design Notes

- The layer model should be expressed as a shared scene-layer host rather than independent ad hoc `z-index` values in each view.
- Candidate naming can be `SceneLayerHost` or another project-appropriate name if later admitted.
- Each layer must have an explicit responsibility and pointer-event policy.
- Layers should communicate through render input/state, not by directly querying or mutating another layer's DOM.
- Map, city, building, and runtime preview should converge on the same layer stack so preview behavior does not diverge from production runtime views.

#### Suggested Candidate Queue

- proposed_queue_id: `queue.ui-scene-layer-stack-convergence`
- proposed_class: `future-target-candidate`
- proposed_goal: `Introduce a shared UI scene layer stack for BG, BackEffect, UI Components, Popup, and FontEffect so map, city, building, and runtime preview use consistent rendering and pointer-event ownership.`
- admission_note: `Recorded only. This entry must not become an active or candidate queue unless explicitly promoted through the current version plan.`

#### Acceptance Criteria Draft

- A shared layer contract defines the ordered layers: `BG`, `BackEffect`, `UI Components`, `Popup`, and `FontEffect`.
- Runtime map, city, and building views can render through the same layer host or equivalent shared layer contract.
- Modal popup behavior blocks lower-layer interaction consistently.
- Non-interactive visual layers do not intercept clicks by default.
- FontEffect renders above popup content without becoming the default interaction owner.
- Existing dialogue/refusal prompt behavior still works after layering.
- Runtime preview uses the same layer order as normal runtime views.
- Source guards or tests prevent view-local arbitrary layer order from replacing the shared contract.

#### Verification Evidence Required For Closure

- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- Browser or simulated-human proof covering at least one map, city, building, popup, and font-effect scenario.
- Pointer-event tests or browser proof showing background/effect layers do not block UI interaction, while modal popups do block lower layers.

### MEMO-022: Building Arrangement, Generic Containers, Flow Playable, And House Runtime Retirement Draft

- status: `open`
- severity: `high`
- classification: `future-target-candidate`
- proposed_queue: `queue.script-editor-building-arrangement-container-flow-refactor`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo-and-candidate`
- evidence_draft: `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-evidence-draft.md`
- proposed_version: `target.building-arrangement-container-flow-refactor`
- affected_families:
  - `script editor city authoring`
  - `script editor building authoring`
  - `building arrangement authoring`
  - `runtime building shell`
  - `runtime event trigger integration`
  - `playable runtime shared contract`
  - `built-in scenario pack migration`
  - `legacy house runtime retirement`

#### Problem Statement

- Current runtime still contains hardcoded special house modules such as `temple-house`, `tea-house`, `grain-shop`, and `medicine-house`.
- This conflicts with mod-first authoring because a creator who adds a new building such as a horse stable should not need a matching runtime `*-house` module before the building can expose functions.
- A building instance's UI, NPC seats, action menu, available actions, and behavior triggers should be data authored in the Script Editor and interpreted by generic runtime mechanisms.
- This draft must not be treated as one executable implementation plan. It must be split into multiple bounded specs and candidate queues before any implementation begins.

#### Core Direction

- No compatibility fallback:
  - Do not keep old `house.moduleId` semantics as a fallback.
  - Do not infer missing new structures from `houses.characterIds`, `defaultCharacterId`, `cityEntries`, or `cityNpcPools`.
  - Missing data means the relevant UI or function is not shown.
- Buildings no longer own behavior:
  - `buildings[]` are building templates only.
  - Building templates may hold name, category, art/default background, and description.
  - Building templates must not hold NPCs, functions, menus, module ids, or runtime behavior.
- Cities own concrete building instances through building arrangement data:
  - `cities[].buildingArrangements[]` replaces city-mounted building rows as the canonical city-side structure.
  - A building arrangement represents one concrete building instance in a city.
  - The arrangement owns city-local display name, selected background, mounted NPCs, primary NPC, generic containers, visible condition, enter rules, and later exit rules.
- The Script Editor's city-side authoring function should be renamed from the old "mount buildings and people" concept to `寤虹瓚缂栨帓`.
  - `寤虹瓚缂栨帓` mounts building instances, mounted NPCs, and containers/functions to a city-local arrangement.
  - Building instances do not directly hold function definitions.

#### Target Data Shape Draft

Building template example:

```json
{
  "id": "building.temple",
  "name": "瀵哄簷",
  "category": "religious",
  "description": "瀵哄簷绫诲缓绛戞ā鏉?,
  "artId": "card_temple",
  "defaultBackgroundId": "bg.temple"
}
```

Building arrangement example:

```json
{
  "id": "arrangement.city.haozhou.huangjue_temple",
  "buildingId": "building.temple",
  "displayName": "鐨囪瀵?,
  "backgroundId": "bg.temple",
  "npcIds": ["char.abbot", "char.senior_monk", "char.worker"],
  "primaryNpcId": "char.abbot",
  "containers": [],
  "visibleCondition": null,
  "enterRules": [],
  "exitRules": []
}
```

#### Generic Container Model

- Do not introduce separate hardcoded architectural primitives such as only "menu container" or only "seat container".
- A building arrangement has `containers[]`.
- Container type is selected by the Script Editor and interpreted by a generic runtime renderer.
- Initial container types:
  - `character-seats`
  - `action-menu`
  - `status-panel`
  - `text-panel`
  - `image-panel`
  - `resource-panel`
- `character-seats` reads only the current arrangement's `npcIds`.
- In the first version, `character-seats.source.includeNpcIds` should be explicit and must be a subset of the current arrangement's `npcIds`.
- `action-menu` contains creator-authored action items with labels, event references, conditions, and optional system actions such as leaving the building.
- The runtime building panel should provide a generic container surface similar to the current 鐨囪瀵?panel, but data-driven by arrangement containers.

Character seats container example:

```json
{
  "id": "main-npc-seats",
  "type": "character-seats",
  "title": "瀵轰腑浜虹墿",
  "layout": "vertical-card-list",
  "position": "left",
  "source": {
    "type": "arrangement-npcs",
    "includeNpcIds": ["char.abbot", "char.senior_monk"]
  },
  "itemActionEventId": "event.haozhou.temple.click_character"
}
```

Action menu container example:

```json
{
  "id": "main-actions",
  "type": "action-menu",
  "title": "瀵轰腑浜嬪姟",
  "layout": "vertical-button-list",
  "position": "center",
  "items": [
    { "id": "work", "label": "宸ヤ綔", "eventId": "event.haozhou.temple.work" },
    { "id": "rest", "label": "浼戞伅", "eventId": "event.haozhou.temple.rest" },
    { "id": "fortune", "label": "娴嬭繍鍔?, "eventId": "event.haozhou.temple.fortune" },
    { "id": "donate", "label": "鎹愰鐏?, "eventId": "event.haozhou.temple.donate" },
    { "id": "leave", "label": "鍏堥€€涓?, "action": "leaveBuilding" }
  ]
}
```

#### Event And Playable Flow

- Clicking any container item emits a unified trigger context:

```ts
{
  type: "buildingContainerItemAction",
  cityId: string,
  arrangementId: string,
  buildingId: string,
  containerId: string,
  itemId: string,
  itemKind: string,
  characterId?: string
}
```

- Event actions must be able to start authored behavior:

```ts
| { type: "startPlayable"; integrationId: string; payload?: object }
| { type: "startDialogue"; dialogueId: string }
| { type: "applyEffects"; effects: Effect[] }
| { type: "gotoScene"; sceneId: string }
| { type: "closeBuilding" }
```

- Concrete building functions belong in the `鐜╂硶` module, not inside building runtime branches.
- Add `PlayableFamily = "flow" | "minigame" | "battle"`.
- `flow` owns ordinary building functions such as rest, donation, buying grain or horses, training, dialogue-like service flows, building work, basic trade, and task receiving.
- `flow` must use the unified playable lifecycle: launch, session, presenter, reduce, settlement, and handoff.
- `flow` also uses the unified presenter, with layouts such as `flow-panel`, `menu`, `dialogue`, and `form`.
- Minimum flow node set:
  - `screen`
  - `dialogue`
  - `choice`
  - `numberInput`
  - `condition`
  - `effects`
  - `startPlayable`
  - `end`
- Permission/security restrictions are intentionally not part of this draft because they could over-constrain future custom minigames.

#### Runtime State And Exit Rules

- Replace old house session state with generic active building state:

```ts
activeBuilding: {
  cityId: string;
  arrangementId: string;
  mode: "building";
  dialogueState?: unknown;
}
```

- Add playable owner kind:

```ts
type PlayableOwnerKind = "building" | "scene" | "task" | "external";
```

- Do not keep using owner kind `house` after deleting house module semantics.
- The generic building shell should always provide a system leave/back capability.
- Creators may also configure a leave item in an action container.
- Exit locking or refusal should be expressed through arrangement `exitRules` / `lockExit`, not by omitting the leave button.

#### Text And Content Strategy

- Use `textId` and `dialogueId` for exported content.
- The editor may support inline editing, but exported runtime packs should use `textEntries[]` and `dialogues[]`.
- Runtime must resolve labels, prompts, and dialogue through content ids where the authoring contract requires them.

#### Legacy Structures To Replace And Remove

- Replace data:
  - `houses.json` -> `buildings[] + cities[].buildingArrangements[]`
  - `city-entries.json` -> `cities[].buildingArrangements[]`
  - `city-npc-pools.json` -> `arrangement.npcIds + character-seats containers`
  - `location-access.json` building-entry portions -> `arrangement.visibleCondition`, `enterRules`, `blockedDialogueId`, `exitRules`
  - `house.moduleId`, `house.characterIds`, `house.defaultCharacterId` -> delete
- Remove code after migration is complete:
  - `src/application/house-modules/*`
  - `src/application/house-modules/house-module-registry.ts`
  - `src/core/registry/house-module-*`
  - `src/core/runtime/house-runtime*`
  - `src/ui/views/house/*-house-view.ts`
  - domain types including `HouseModuleId`, `HouseModuleDefinition`, `HouseModuleSessionStateMap`, `ActiveHouseModuleSession`, `HouseModuleRequest`, `HouseModuleViewModel`, old `HouseDefinition.moduleId/characterIds/defaultCharacterId`, `CityEntryDefinition`, `CityNpcPoolDefinition`, and building-entry portions of `LocationAccessDefinition`.
- `docs/special-house-interface.md` conflicts with this direction and must be retired or superseded by:
  - `docs/building-arrangement-interface.md`
  - `docs/building-container-interface.md`
  - `docs/playable-flow-interface.md`
- `AGENTS.md` currently enforces the old house interface for house work, so the admitted refactor must explicitly resolve that governance conflict before deleting the old implementation.

#### Required Spec / Queue Decomposition

This draft must not become one implementation plan. It should be split into multiple specs and later queue plans:

1. `Spec A: Canonical Data Schema`
2. `Spec B: Script Editor Authoring UX`
3. `Spec C: Runtime Building Shell`
4. `Spec D: Event Trigger Integration`
5. `Spec E: Flow Playable Runtime`
6. `Spec F: Built-in Pack Migration`
7. `Spec G: Legacy Retirement`

Each later queue plan must include:

- `Inherited Contract Surface`
- `Feature Preservation Check`
- `Functional Completeness Review`

Feature preservation checklist:

- Still supports city-local building instances.
- Still supports mounting NPCs to the building arrangement.
- `character-seats` reads only current arrangement NPCs.
- `action-menu` triggers events.
- Events can start `flow`, `minigame`, and `battle` playables.
- `flow` uses unified playable presenter/lifecycle.
- `enterRules` and `exitRules` remain supported.
- `activeBuilding` can save and restore.
- `moduleId` and house modules are not reintroduced.
- Gameplay logic is not moved back into building runtime branches.
- Later queue narrowing does not delete future container-type entry points.

#### Parent Spec Integrity Reconcile

- parent_spec_source:
  - `MEMO-022 itself is the parent requirement spec until a formal successor version spec supersedes it.`
- parent_spec_role:
  - `This memo defines the total contract for the building arrangement, generic container, flow playable, built-in pack migration, and house runtime retirement refactor.`
- subqueue_rule:
  - `No child candidate queue may treat this memo as a concrete implementation plan.`
  - `Every child candidate queue must state which MEMO-022 capability it owns, which capability it preserves, and which capability remains owned elsewhere.`
- over_narrowing_guard:
  - `A child queue must not shrink the total requirement by implementing only the easiest path.`
  - `A child queue must not delete unimplemented capability by declaring it unsupported.`
  - `A child queue must not convert out-of-scope work into retired, removed, or unsupported behavior unless MEMO-022 or its successor parent spec is updated first.`
- parent_spec_change_order:
  - `If implementation evidence proves this memo must change, update the parent spec first, then update every affected candidate queue, evidence matrix row, and queue claim boundary before implementation continues.`

#### Version-Local Temporary Execution Rule Draft

- draft_status: `memo-only`
- applies_to_version: `target.building-arrangement-container-flow-refactor`
- promotion_status: `not-global`
- promotion_condition:
  - `After this version's candidate queues complete, evaluate whether this draft should be promoted into the global Blueprint workflow.`
- purpose:
  - `Prevent current-version execution from stopping at internal admission, routing, audit, fixture/materialization/export/import ownership, or self-adjudicable gap-fill decisions.`
- temporary_rule:
  - `Before all candidate queues in target.building-arrangement-container-flow-refactor finish, candidate queue admission review is an AI-internal execution step rather than a human confirmation point.`
  - `If the parent spec already defines the capability, prerequisite queue closeout satisfies the candidate admission rule, and the next queue can proceed without changing the parent total spec, deleting or downgrading capability, or rewriting out-of-scope as retired, Blueprint should record the admission conclusion, update the version plan and queue spec, and continue execution.`
  - `If admission review finds a gap required for the next queue to run and the gap remains inside the parent spec, the gap should be recorded as an in-queue temporary gap fill or prerequisite routing decision and execution should continue without asking for human confirmation.`
  - `If an operator asks to audit whether a current-version queue is complete, over-narrowed, or missing inherited capability, any confirmed in-parent-spec finding is execution input rather than a human confirmation point. Record it in the active queue, next lawful queue, or version plan as a prerequisite routing decision, in-queue temporary gap fill, closeout blocker, or final-guard evidence, then continue unless a blocker condition applies.`
  - `Before ending a response while this version has an active or pending candidate queue, run a stop-condition self-check: whether the operator explicitly requested answer-only/no-continuation, whether a real blocker exists, whether the finding is outside the parent spec, and whether continuing would change the parent total spec, delete or downgrade capability, rewrite out-of-scope as retired, or require a product decision. If none apply, do not stop at advice; record the decision and continue execution.`
  - `For this version, do not frame an in-parent-spec gap as merely a suggested next step. The expected handling is to record the gap and continue execution.`
  - `Queue closeout and completion completeness review must include an evidence-against-claim check for static placeholders, unbound menu actions, missing runtime-reachable event/flow/closeBuilding paths, or behavior that only survives through legacy house fallback. These findings cannot be written as out-of-scope, retired, unsupported, or deferred without lawful routing inside the parent target.`
  - `After each queue closeout in this version, attempt repository synchronization with the development trunk according to the current repository workflow, including push and/or merge as applicable to the active branch/worktree state. Wait for the sync command result before continuing. Whether the sync succeeds or fails, record the result in the queue's sync fields or progress log, then continue to the next lawful queue unless the sync result reveals a true code/spec blocker already covered by this rule.`
  - `Repository sync failure, remote push failure, merge refusal, or unavailable remote state is not by itself a reason to stop current-version queue progression. Treat it as a recorded sync result, not as queue closeout failure, version closeout, or a human confirmation point.`
  - `Stop and report a blocker only when continuing would require changing the parent total spec, deleting/downgrading/declaring unsupported a parent capability, rewriting out-of-scope as retired, resolving code evidence that conflicts with the queue spec and cannot be independently adjudicated, or making a genuine product decision.`
  - `Every queue still requires pre-execution no-over-narrowing review against the parent target, queue closeout under Blueprint closeout semantics, one completeness assessment, and at most one high-priority gap fill.`
  - `Do not enter version closeout under this temporary rule.`

#### Split Completeness Review Required Before Admission

Before this candidate is admitted or split into active execution queues, Blueprint must run and record an AI split completeness review covering:

- `Coverage: which child specs/queues own canonical schema, Script Editor UX, runtime building shell, event integration, flow playable runtime, built-in pack migration, and legacy retirement.`
- `Unowned capabilities: any MEMO-022 required outcome not owned by a child queue.`
- `Over-narrowing risks: any child queue that could pass by narrowing away containers, seats, action menus, flow, activeBuilding persistence, enter/exit rules, migration, or deletion of old house logic.`
- `Drift risks: any child queue that adds behavior outside MEMO-022 rather than filling unspecified implementation detail within the parent boundary.`
- `Required follow-up: successor parent spec updates, additional child candidate queues, or explicit waivers.`

Current evidence draft:

- `docs/blueprints/specs/2026-07-20-building-arrangement-container-flow-refactor-evidence-draft.md`
- `The evidence draft is pending operator review. It does not authorize implementation or active queue creation.`

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-building-arrangement-container-flow-refactor`
- proposed_class: `future-target-candidate`
- proposed_goal: `Turn building behavior into Script Editor-authored building arrangements, generic containers, event-triggered playable flows, migrated built-in pack data, and retired legacy house modules without compatibility fallback.`
- admission_note: `Recorded only. This should not be admitted as one broad implementation queue. Before implementation, Blueprint must split it into bounded specs/queues, run the split completeness review, and reject any over-narrow queue plan that loses the container, flow, migration, activeBuilding persistence, enter/exit rule, or legacy-retirement requirements.`

#### Verification Evidence Required For Closure

- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- Schema validation tests for building templates, arrangements, containers, and playable flow references.
- Script Editor save/load/export/import tests for arrangement containers and flow/event bindings.
- Runtime tests for building shell rendering, container item events, activeBuilding save/restore, enter/exit rules, and playable handoff.
- Built-in Zhu Yuanzhang pack migration tests proving 鐨囪瀵?and other existing buildings render through arrangements/containers without old house module fallback.
- Source guards proving old `temple-house`, `tea-house`, `grain-shop`, `medicine-house`, house module registry, old house session types, and deprecated data fields are removed after migration.
- Simulated-human browser proof covering Script Editor authoring, runtime preview, normal start, JSON runtime pack import, empty mounted NPC behavior, populated seat containers, action menu event triggering, leave behavior, and at least one flow playable launched from a building container.

### MEMO-023: Runtime Preview Reintroduces Base City And House Data After Deleting All Cities

- status: `open`
- severity: `high`
- classification: `memo-only`
- proposed_queue: `none`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-bug`
- affected_families:
  - `script editor city authoring`
  - `script editor runtime preview`
  - `runtime content activation`
  - `scenario pack merge semantics`
  - `city and house selection`

#### Observed Behavior

- Repro path:
  - open the Script Editor;
  - go to the `鍩庡競` module;
  - delete all cities;
  - create one new city;
  - run runtime preview;
  - choose a character and start the game;
  - enter the map.
- The map still shows cities from the template pack.
- Entering `婵犲窞` still shows the original template pack building list instead of the edited project result.

#### Root Cause

- Runtime preview exports the current Script Editor project to a scenario pack and then starts it through the normal scenario-pack activation path.
- The startup activation still carries the default `content-pack.base-game.zhuyuanzhang` base pack.
- `createActiveGameContent` merged `cities` and `houses` by inheriting base pack data when the override pack was present, instead of treating the override pack's explicit city/house families as authoritative.
- Because of that merge rule, deleted cities were reintroduced during preview instead of staying deleted.

#### Impact

- The previewed runtime state does not match the current project draft.
- City deletion in the editor cannot be trusted when previewing a project derived from the base pack.
- The symptom is visible both on the world map and when entering `婵犲窞`.

#### Verification

- A focused regression test now passes for the explicit override case where the base pack contains `婵犲窞` and the override pack contains only a new city.
- The verified fix makes explicit override cities and houses authoritative runtime families for activation.
### MEMO-025: Script Editor Event-Centered Authoring And Portrait Resource Refactor Draft

- status: `open`
- severity: `high`
- classification: `future-target-candidate`
- proposed_queue: `queue.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- owning_queue: `none`
- admission_status: `not-admitted`
- latest_disposition: `recorded-as-memo-and-candidate`
- evidence_draft: `docs/blueprints/specs/2026-07-22-script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor-evidence-draft.md`
- proposed_version: `target.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- affected_families:
  - `script editor event authoring`
  - `script editor minigame authoring`
  - `script editor person authoring`
  - `script editor portrait resource authoring`
  - `script editor building authoring`
  - `runtime export/import`
  - `runtime event triggering`
  - `runtime resource loading`
  - `simulated-human acceptance`

#### Problem Statement

- The current Script Editor still mixes creator-facing authoring with implementation-facing concepts such as standalone minigame dispatch, object-to-object direct jumps, and ad hoc runtime-oriented tabs.
- `dialogue / minigame / task / function` do not yet read as one event-centered content system to creators.
- Person portrait selection currently depends on `people[].portraitId` values already present in the project, so a new project or first created person can expose an empty portrait list.
- The current authoring shape risks divergence between editor configuration, exported runtime data, and actual runtime behavior.

#### Event-Centered Authoring Direction

- Treat `dialogue`, `minigame`, `task`, and `function` as content objects, not direct routing owners.
- Route all content transitions through `event`.
- Required canonical transition shape:
  - `dialogue -> event -> target`
  - `function -> event -> target`
  - `minigame -> event -> target`
  - `task -> event -> target`
- Event destination target families must unify to:
  - `task`
  - `function`
  - `dialogue`
  - `minigame`
- Direct object-to-object transitions such as `function -> minigame` or `dialogue -> minigame` should not remain as creator-facing truth.

#### Script Editor Surface Direction

- Rename the current `鐜╂硶` authoring surface to `灏忔父鎴廯.
- Keep `鏂板鐜╂硶缁戝畾` as the creator-facing entry for adding a minigame binding/entry.
- Collapse minigame authoring tabs by removing:
  - `瑙﹀彂涓庤皟搴
  - `缁撶畻涓庤繑鍥瀈
  - `寮曠敤鍏崇郴`
  - `浜嬩欢`
- Retain a single `鍩虹淇℃伅` tab that holds:
  - minigame prototype
  - launch parameters
  - return policy
  - success / failure / cancel events
  - host scope
- Event becomes the only creator-facing routing center. Dialogue, function, task, and minigame surfaces should expose event hookups but not become separate dispatch systems.

#### Building And Existing Behavior Preservation

- Building functions must continue to travel through the Script Editor-authored `arrangement / event-binding / flow / playable` path.
- However, the creator-facing meaning should still be `function -> event -> dialogue/minigame/task/function`.
- Structural unification must not change pre-refactor gameplay meaning.
- If a pre-refactor building function launched a minigame directly in user-facing behavior, the refactor must preserve that behavior and must not insert an unnecessary explanatory flow/dialogue layer.
- Existing temple function semantics are a known example: behavior must stay aligned with the pre-refactor function result rather than drifting into extra authored ceremony.

#### Trigger Timing And Context Contract

- Freeze an authoring/runtime trigger timing matrix at least for:
  - city enter / leave
  - building enter / leave
  - building function click / execute / complete / cancel
  - dialogue start / choice / end
  - minigame start / success / failure / cancel / return
  - task accept / advance / complete / fail
  - conditional auto-trigger
- Freeze a shared trigger-context contract so equivalent triggers use stable fields across editor preview and runtime, including:
  - current city
  - current building
  - current function
  - current dialogue
  - current minigame
  - current task
  - trigger source
  - current host object
  - return target

#### Data Structure Refactor And Runtime Sync

- This draft assumes explicit incompatible data-structure refactoring rather than long-term backward-compatible layering.
- At minimum, the following families are expected to change:
  - event definitions
  - event destinations
  - minigame bindings
  - dialogue/function/task event attachment structures
  - building-function-to-event mappings
  - trigger timing and trigger-context payload structures
  - person portrait references
  - portrait resources and portrait variants
  - resource-to-file mapping records
- Incompatible editor-side structure change is not sufficient by itself. Runtime must be updated in the same batch so:
  - editor preview
  - exported runtime pack
  - runtime loading
  - event triggering
  - object reference resolution
  - resource rendering
  all continue to interpret the new model consistently.
- The repository must not accept a state where the editor can author the new structure but runtime still expects the old one.

#### Formal Scene Retirement Direction

- This memo now records an explicit stronger direction than simple boundary-thinning: `scene` should be removed as a formal creator-facing family and as a formal runtime content family rather than merely reduced in scope.
- The new canonical authoring/runtime meaning is:
  - backgrounds belong to city/building/building-arrangement ownership
  - narration, speaker lines, portraits, speaker side, and dialogue choices belong to the dialogue authoring family
  - all routing and follow-up ownership belongs to event
  - building function interaction continues to use the authored `arrangement / event-binding / flow / playable` implementation path
  - creator-facing interpretation remains `function -> event -> dialogue/minigame/task/function`
- `scene` must no longer remain the place where creators configure:
  - background selection
  - narration lines
  - character speech lines
  - dialogue speaker placement
  - branching target routing
  - event startup
  - activity startup
  - callback-based behavior handoff
- The current repository shape is considered over-coupled because `scene` currently mixes:
  - presentation responsibilities
  - business-effect responsibilities
  - runtime startup routing
  - activity launch
  - follow-up progression
- Evidence for this over-coupling already exists in the current contract shape:
  - `src/domain/action.ts` still defines `SceneDefinition`
  - `ActionNode` still includes `background`, `music`, `narration`, `dialogue`, `choice`, `effect`, `jump`, `start-event`, `start-activity`, and `callback`
  - `ChoiceOption` still includes `nextSceneId`, `nextEventId`, `effects`, and `conditions`
- Under this memo's strengthened direction, these are not acceptable long-term creator-facing truths.

#### Event-As-Only-Router Clarification

- This memo now explicitly records the user-directed rule that all routing must be unified through event rather than split between event and scene.
- The allowed creator-facing routing meaning becomes:
  - `dialogue -> event -> target`
  - `function -> event -> target`
  - `minigame -> event -> target`
  - `task -> event -> target`
- The event target set remains:
  - `task`
  - `function`
  - `dialogue`
  - `minigame`
- `dialogue` may remain a content/presentation object, but it must not remain a hidden second dispatch owner through runtime scene lowering.
- Building-enter, building-function-click, building-function-complete, dialogue-end, minigame-result, and similar transitions must all route through event/event-binding rather than `entrySceneId`, `nextSceneId`, or scene-local callback chains.

#### Scene Removal And Content Migration Rules

- `scene` should be removed from:
  - Script Editor visible families
  - Script Editor project formal family list
  - runtime pack canonical family list
  - runtime loading requirements
  - runtime state/session truth
  - startup target truth
  - presenter input truth
- Content that previously lived in scene must migrate as follows:
  - city/building/building-arrangement backgrounds migrate to city/building/building-arrangement families
  - narration and speaker lines migrate to dialogue authoring
  - portrait references and side placement migrate to dialogue authoring
  - choice presentation migrates to dialogue authoring
  - routing targets after dialogue choice/end migrate to event
  - activity/minigame/task/flow launch migrates to event and playable/flow integration seams
- There should be no creator-facing requirement to configure the same presentation material in both dialogue and some other family.
- In particular:
  - backgrounds should not be configured in scene once city/building ownership exists
  - narration and character speech should not be configured in scene when dialogue already exists
  - creators should not configure a scene wrapper merely to show dialogue that is already modeled as dialogue

#### No-Compatibility Residue Rule

- This retirement must be one-batch and incompatible by design.
- Do not keep:
  - compatibility readers
  - compatibility writers
  - bridge exports
  - fallback startup fields
  - temporary runtime shims
  - hidden scene-lowering materializers
  - dual-path authoring truth
- Specifically, the repository must not keep long-lived compatibility for:
  - `scenes.json`
  - `SceneDefinition`
  - `ActionNode`
  - `entrySceneId`
  - `nextSceneId`
  - runtime `activeSceneId`
  - scene cursor / waiting-choice state as formal cross-feature truth
  - `dialogue -> scene` lowering seams
- The target state is not "support both event+scene and event-only". The target state is "remove scene and migrate its responsibilities".

#### Current Repository Residue Inventory To Remove

- The following repository surfaces are now explicitly in-scope for removal or migration under this memo:
  - `src/domain/action.ts`
    - remove `SceneDefinition`
    - remove `ActionNode`
    - remove `ChoiceOption.nextSceneId`
  - `src/domain/script-editor-project.ts`
    - remove `project.scenes`
  - `src/domain/event.ts`
    - remove `entrySceneId`
  - `src/domain/game-state.ts`
    - remove `activeSceneId`-based formal scene session ownership if still present as canonical truth
  - `src/domain/content-pack.ts`
    - stop importing/exporting `SceneDefinition` as formal pack content
  - `src/application/script-editor/minimal-workflow.ts`
    - remove `scenes` family from visible workflow families and draft helpers
  - `src/application/script-editor/workspace-shell.ts`
    - remove `scenes` object-tree surface and `scenes.json` export language
  - `src/ui/main-ui/main-ui-flow.js`
    - remove `scenes` authoring family
    - remove startup `sceneId` authoring
    - remove scene action authoring UI
  - `src/application/script-editor/story-dialogue-event-authoring.ts`
    - remove `entrySceneId` from event authoring
    - event destination becomes the formal creator-facing router
  - `src/application/script-editor/dialogue-story-runtime-materializer.ts`
    - remove entirely
    - dialogue must no longer lower into runtime scene truth
  - `src/application/script-editor/runtime-pack-export.ts`
    - remove `scenes.json`
    - remove `resolveEventEntrySceneId`
    - remove lowering from editor dialogue destination to `scene.<dialogue-id>`
    - remove `entrySceneId` validation and export
  - `src/application/script-editor/runtime-pack-import.ts`
    - remove scene import family and imported `entrySceneId` bridge logic
  - `src/application/scenario/scenario-pack-loader.ts`
    - remove `initialLocation.sceneId` validation if startup scene truth is retired
  - `src/application/scene/scene-runner.ts`
    - remove entirely
  - `src/application/scene/choice-resolver.ts`
    - remove or replace so choice routing no longer depends on `nextSceneId`
  - `src/core/contracts/scene-runtime.ts`
    - remove entirely
  - `src/application/story/story-runtime.ts`
    - remove runtime dependence on `sceneDefinitionsById`, active scene progression, and scene pause/advance logic
  - `src/application/events/event-runner.ts`
    - stop starting events via `entrySceneId`
  - `src/application/content/active-game-content.ts`
    - remove `sceneDefinitions` and `sceneDefinitionsById`
  - `src/application/state/create-initial-state.ts`
    - remove scene bootstrap truth
  - `src/application/state/game-store.ts`
    - remove scene-based current action/current choice derivation
  - `src/application/presenter/presenter-output.ts`
    - remove `currentSceneAction` and `currentSceneChoiceOptions`
  - `src/application/presenter/stage-presenters.ts`
    - stop consuming `SceneDefinition`
  - `src/application/startup/scenario-startup-target.ts`
    - remove startup `sceneId` ownership
  - `src/application/startup/startup-story-bootstrap.ts`
    - stop requiring `SceneDefinition` lookup tables
  - `src/application/runtime/indoor-screen-story-follow-up.ts`
    - remove active-scene-based follow-up ownership
  - `src/application/runtime/navigation-time-follow-up.ts`
    - remove scene-definition handoff assumptions
  - `src/application/runtime/main-runtime-orchestrator.ts`
    - remove formal scene-definition orchestration inputs
  - `src/content/pack-content-access.ts`
    - stop loading built-in pack scenes as formal content
  - `src/content/scenario-packs/**/scenes.json`
    - migrate or delete
  - `src/content/story/zhu-yuanzhang-main-story.ts`
    - remove scene-based main story truth
  - `src/content/sample-scenario.ts`
    - remove sample scene-based content shape
  - `src/ui/views/scene/scene-view.ts`
    - remove scene-specific renderer surface
  - `src/main.ts`
    - stop importing `SceneDefinition`
    - stop bootstrapping `activeSceneId`

#### Runtime Pack And Built-In Content Migration Requirements

- Runtime packs must stop carrying `scenes.json` as a canonical table.
- Events must stop carrying `entrySceneId`.
- Startup profiles must stop carrying `initialLocation.sceneId` if startup scene truth is removed from the new model.
- Built-in packs such as `zhuyuanzhang` must migrate existing scene content into:
  - dialogue content
  - event routes
  - event bindings
  - building arrangement or city/building background ownership
- Current building-enter authored greetings that now exist as:
  - `building-enter -> event binding -> event -> scene`
  must be migrated to:
  - `building-enter -> event binding -> event -> dialogue`
- Built-in pack migration must not preserve hidden scene tables "just for old content".

#### Runtime State And Startup Retirement Requirements

- Canonical runtime state must stop exposing scene-session truth such as:
  - `activeSceneId`
  - scene cursor
  - waiting-choice scene mode
- Startup targeting must stop depending on:
  - `scenarioProfile.initialLocation.sceneId`
  - direct scene startup resolution
- Presenter/render paths must stop requiring:
  - `currentSceneAction`
  - `currentSceneChoiceOptions`
  - scene-definition lookup maps

#### Test And Source Guard Requirements For Retirement

- This memo now requires retirement tests, not only migration tests.
- Source guards should prove that production code no longer uses:
  - `SceneDefinition`
  - `ActionNode`
  - `entrySceneId`
  - `nextSceneId`
  - `scene-runner`
  - `dialogue-story-runtime-materializer`
  - `scenes.json` as a formal exported runtime family
- Regression coverage must prove:
  - building-enter dialogue still works through `event binding -> event -> dialogue`
  - building function launch still works through `arrangement / event-binding / flow / playable`
  - dialogue presentation still works without scene runtime
  - runtime import/export no longer accepts scene as a formal truth family
  - startup, preview, and built-in content continue to work after scene removal

#### Ordered Implementation Batch For This Memo

- The recommended execution order is:
  - freeze the no-scene target contract in tests and docs first
  - remove `scene` from formal Script Editor project and UI families
  - remove `scenes.json` and `entrySceneId` from runtime-pack import/export and loader contracts
  - remove scene runtime/session/presenter/startup state
  - migrate built-in packs and authored content to dialogue/event/building ownership
  - remove leftover tests, docs, and source references that still assume scene truth
- This ordering is intentional:
  - it prevents new work from re-entering the old scene path during migration
  - it exposes missing migration surfaces early
  - it avoids a misleading intermediate state where both scene and event-only routing claim to be formal truth

#### File-Level Evidence Already Observed

- Current runtime-export evidence:
  - `src/application/script-editor/runtime-pack-export.ts` still resolves dialogue destinations into `scene.<dialogue-id>` via `resolveEventEntrySceneId`
  - event export still writes `entrySceneId`
- Current runtime-state evidence:
  - runtime, startup, presenter, and story paths still use `activeSceneId`, scene lookups, or scene-render/session helpers
- Current authoring evidence:
  - Script Editor still exposes a `scenes` family and startup scene selection
- Current content evidence:
  - built-in and sample content still include `scenes.json` or `SceneDefinition`-based truth
- Current test evidence:
  - robustness tests still assert `scenes.json`, `entrySceneId`, `activeSceneId`, and scene-runner behavior as formal correctness

#### Documentation Replacement Requirement

- When this memo is eventually implemented, all docs that currently describe:
  - `EventDefinition -> SceneDefinition -> ActionNode`
  - `scenes.json`
  - `entrySceneId`
  - direct scene startup
  as formal architecture must be rewritten in the same batch.
- Documentation must not preserve a stale "scene is still canonical" explanation once code has moved to the new event-centered model.

#### Change Logging Requirement For Refactors

- Every incompatible structure change must record a concise structured change note for later verification.
- The record should include at least:
  - changed structures
  - removed fields/relations
  - added fields/relations
  - export changes
  - runtime-reader changes
  - high-risk legacy behavior to recheck
  - scenario-specific regression focus points
- These records are test baselines, not archival-only notes. They should be used as the reference set for simulated-human regression and runtime troubleshooting.

#### Portrait Resource Direction

- Portrait choice must come from project-level portrait resources, not from reverse-collecting existing `people[].portraitId`.
- Add a project-level portrait resource family such as:
  - `portraits`
  - `portraitVariants`
- Keep person-side references limited to:
  - `portraitId`
  - `portraitVariantId`
- A new empty project must still expose a portrait list once portrait resources exist; the first created person must not depend on legacy person data to obtain options.

#### Portrait Preview, Thumbnail, And Organization Requirements

- After selecting a portrait reference, the person editor must show the resolved preview image immediately.
- If a variant is selected, show the variant image preferentially.
- Portrait option lists should display thumbnails per item, not text-only ids.
- Portrait variants should also display thumbnails.
- Large portrait sets require creator-facing organization support:
  - search by name / id / label
  - category or tag filters
  - sorting at least by name, creation order, and recent use
- Current selection should remain easy to locate in a large list.

#### Portrait Resource To File Mapping Contract

- Portrait resources must own explicit file mapping rules rather than letting file references leak into person records.
- At minimum, define:
  - stable resource id
  - image file path
  - thumbnail source policy
  - whether a variant owns an independent file
- Editor thumbnail rendering, current preview rendering, and runtime rendering must resolve through the same mapping rules.

#### Deletion And Rename Integrity

- Deleting any referenced object must remove or invalidate its dependent references immediately rather than leaving dangling ids in the project.
- This applies to:
  - dialogue
  - minigame
  - function
  - task
  - event
  - building-linked objects
  - portrait resources
  - portrait variants
- If an object/resource is renamed and identifiers remain author-visible, linked references should update automatically rather than requiring manual repair.

#### Acceptance And Simulated-Human Proof Direction

- Simulated-human coverage should exercise environment-specific triggers, not only unit-level helpers.
- Minimum environment families:
  - city
  - building
  - building-function
  - dialogue
  - minigame
  - task
- Minimum proof expectations include:
  - correct environment trigger
  - correct event hit
  - correct trigger context
  - correct destination family and target
  - correct follow-on chain behavior
  - cancel/failure/return/re-entry boundary behavior
- Portrait authoring also requires a smallest usable creator path:
  1. create project
  2. create portrait resource
  3. create person
  4. choose portrait
  5. see thumbnail in the option list
  6. see current portrait preview
  7. verify preview/export/runtime still resolve the same resource

#### Suggested Candidate Queue

- proposed_queue_id: `queue.script-editor-event-centered-authoring-scene-retirement-and-portrait-resource-refactor`
- proposed_class: `future-target-candidate`
- proposed_goal: `Unify Script Editor authoring around event-centered routing, retire scene as a formal creator-facing/runtime family, preserve building function meaning through function -> event -> dialogue/minigame/task/function, and add project-level portrait resources with stable preview/list/thumbnail behavior under one incompatible no-compatibility-residue successor target.`
- admission_note: `Recorded only. This memo does not authorize implementation. Before admission, Blueprint must keep this as a future-target source item, create a formal evidence draft, split the work into bounded child queues, keep scene retirement and runtime/export/preview cutover in the same parent execution domain, and reject any split that preserves scene as creator-facing routing truth, leaves compatibility residue, or routes portrait resources to a different successor target/version.`

#### Verification Evidence Required For Closure

- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- Source guards proving creator-facing event routing does not regress into direct object-to-object jumps.
- Export/import tests proving the new event-centered structures and portrait resource families survive round-trip.
- Runtime tests proving the new structures are readable and runnable without fallback to old semantics.
- Simulated-human coverage for city/building/dialogue/minigame/task trigger environments.
- Simulated-human coverage for portrait resource creation, thumbnail selection, current preview, and runtime continuity.
