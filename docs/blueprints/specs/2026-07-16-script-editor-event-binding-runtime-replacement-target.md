# Script Editor Event Binding Runtime Replacement Target

## Control Block

- version_id: `target.script-editor-event-binding-runtime-replacement`
- version_label: `script-editor-event-binding-runtime-replacement`
- closeout_contract_version: `v1`
- predecessor_version: `target.city-building-definition-location-access-convergence`
- source_design: `docs/script-editor-event-trigger-binding-design.md`

## Human Context

### Goal

- `Replace the old event trigger runtime with an EventBindingRuntime that consumes event-bindings.json.`
- `Keep event body data in events.json and all trigger entry data in event-bindings.json.`
- `Ensure scenario packs authored or imported through the script editor can display, validate, export, load, and trigger event bodies and event bindings correctly.`
- `Migrate the built-in zhuyuanzhang scenario pack before or during runtime cutover so the default playable content remains runnable.`

### Scope

- `EventDefinition body contract for events.json without trigger/conditions as long-term fields.`
- `EventBinding contract, eventBindings scenario-pack field, and event-bindings.json manifest entry.`
- `Core fixed fields plus registered extension fields for owner, trigger, payload schema, condition fields, and resolver support.`
- `Script-editor project model and UI support for separate event body and event binding tables.`
- `Runtime-pack import/export support for events.json plus event-bindings.json.`
- `Built-in zhuyuanzhang scenario-pack migration to event-bindings.json.`
- `EventBindingRuntime that evaluates TriggerContext against owner, timing, action, conditions, priority, occurrence, and eventHistory.`
- `Removal of old events[].trigger/conditions runtime scanning after replacement verification passes.`
- `Compatibility with other sub-runtimes through explicit TriggerContext emission, runtime result handoff, and registered payload/resolver contracts.`

### Non-Goals

- `Do not use event triggers as city/building access gates; LocationAccessRuntime remains the entry eligibility boundary.`
- `Do not add house-specific business branches in main.ts or event runtime.`
- `Do not hardcode business property checks such as character force or city prosperity in the event runtime.`
- `Do not preserve a permanent dual-track runtime for old events[].trigger/conditions.`
- `Do not migrate map coordinate ownership, house module lifecycle, or playable runtime governance in this version unless a queue proves a direct event-binding dependency.`
- `Do not delete the old event system before editor, loader, built-in pack, and new runtime verification pass.`
- `Do not make EventBindingRuntime own house, scene, task, playable, navigation, or location-access runtime state machines; it may only receive trigger contexts from them or return activation/task/effect handoff results through existing runtime boundaries.`

### Target Data Contracts

#### Event Body

```ts
export type EventDefinition = {
  id: string;
  chapterId?: string;
  title?: string;
  name?: string;
  description?: string;
  tags?: string[];
  participants?: EventParticipant[];
  entrySceneId?: string;
  actions?: EventAction[];
  effects?: EventEffect[];
  nextEventId?: string;
  occurrence?: EventOccurrence;
  taskInputs?: RuntimeTaskInput[];
};
```

Rules:

- `events.json` describes what happens after activation.
- `events.json` must not carry trigger/conditions as the long-term runtime path.
- `entrySceneId`, actions/effects, nextEventId, participants, occurrence, and taskInputs remain event-body concerns.

#### Event Binding

```ts
export type EventBinding = {
  id: string;
  eventId: string;
  owner: {
    family: string;
    id?: string;
    extra?: Record<string, unknown>;
  };
  trigger: {
    timing: string;
    action: string;
    payloadSchemaId?: string;
    extra?: Record<string, unknown>;
  };
  conditions?: EventBindingConditionGroup;
  priority?: number;
  enabled?: boolean;
  meta?: Record<string, unknown>;
};
```

Rules:

- `event-bindings.json` describes when and where an event may activate.
- `owner.family`, `trigger.timing`, and `trigger.action` are registered values, not an unbounded free-text contract.
- `owner.extra`, `trigger.extra`, `payloadSchemaId`, payload fields, and condition fields are registered extension surfaces.
- `meta` and unregistered extra fields may exist as editor draft data, but runnable export must fail closed unless they lower to supported runtime fields.

#### Trigger Context

```ts
export type TriggerContext = {
  timing: string;
  action: string;
  owner: {
    family: string;
    id?: string;
  };
  actorCharacterId?: string;
  currentCityId?: string;
  currentHouseId?: string;
  payload?: Record<string, unknown>;
};
```

Rules:

- `Runtime systems emit TriggerContext; EventBindingRuntime owns binding selection and activation.`
- `Story, time, city, building, dialogue, menu, minigame, and custom entry points must fit through the same TriggerContext path.`
- `Sub-runtimes remain owners of their own lifecycle and state. EventBindingRuntime integrates with them by consuming TriggerContext and returning activation/effect/task handoff data rather than importing or branching on sub-runtime internals.`

### Implementation Order Contract

1. `Define EventBinding contract, eventBindings pack field, event-bindings.json manifest entry, and loader hydration.`
2. `Add script-editor project model and UI support for events plus eventBindings as separate tables.`
3. `Run field-gap review; allow one controlled contract backfill if UI integration proves a missing runtime-required field.`
4. `Export double-table runtime packs: events.json without trigger/conditions and event-bindings.json with trigger entries.`
5. `Migrate built-in zhuyuanzhang scenario pack to double-table event data.`
6. `Introduce EventBindingRuntime and route runtime trigger call sites through TriggerContext.`
7. `Verify built-in and script-editor-exported packs trigger events correctly.`
8. `Delete old events[].trigger/conditions, old evaluator/scanner paths, and compatibility shims.`
9. `Add guard tests preventing old event trigger paths from returning.`

Deletion of the old event system is legal only after step 7 passes.

### Queue Contract Portfolio

| Queue ID | Class | Contract Role | Admission Rule |
| --- | --- | --- | --- |
| `queue.script-editor-event-binding-contract-loader` | `required-priority` | `Introduce EventBinding domain/pack contracts, eventBindings manifest hydration, and registered extension-field boundaries.` | `Admit first; all later UI/export/runtime work depends on the double-table contract being readable.` |
| `queue.script-editor-event-binding-authoring-ui` | `required-priority` | `Add script-editor project eventBindings data and UI display/navigation for event bodies and bindings.` | `Admit after contract/loader baseline; may trigger one controlled contract backfill if a runtime-required field gap is proven.` |
| `queue.script-editor-event-binding-export-convergence` | `required` | `Export events.json and event-bindings.json from editor data while failing closed on unsupported binding fields or conditions.` | `Admit after UI/model can represent both tables and field-gap review is complete.` |
| `queue.zhuyuanzhang-event-binding-pack-migration` | `required` | `Migrate the built-in zhuyuanzhang pack from event-local trigger/conditions into event-bindings.json before runtime cutover.` | `Admit before or together with runtime cutover; cannot be deferred until after old runtime deletion.` |
| `queue.event-binding-runtime-convergence` | `required` | `Implement EventBindingRuntime, TriggerContext call sites, resolver-backed condition evaluation, priority/occurrence selection, activation, debug reports, and sub-runtime handoff compatibility.` | `Admit only after at least one double-table pack can load and export validation proves the runtime input shape.` |
| `queue.old-event-runtime-retirement` | `required-final` | `Delete old events[].trigger/conditions runtime scanning, old evaluator paths, and compatibility shims; add guards against regression.` | `Admit only after EventBindingRuntime verification proves built-in and exported packs trigger correctly.` |

### Acceptance Criteria

- `Scenario-pack loader reads pack.json.files.eventBindings and hydrates eventBindings into active content.`
- `Script-editor import reads events.json and event-bindings.json separately and shows both in the UI.`
- `Event details can show bindings that reference the event; binding details can navigate to the target event.`
- `Runtime-pack export writes events.json without trigger/conditions and writes event-bindings.json with owner/trigger/conditions/priority/enabled.`
- `Unsupported owner family, trigger timing/action, payload schema, condition type, condition field, or resolver fails closed during runnable export.`
- `Built-in zhuyuanzhang pack includes event-bindings.json and remains runnable after runtime cutover.`
- `EventBindingRuntime handles story, time, city, building, dialogue, menu, minigame, and custom-capable entry points through TriggerContext or explicitly fails unsupported entries closed.`
- `EventBindingRuntime remains compatible with scene, task, house, navigation, playable, location-access, and other sub-runtimes through explicit TriggerContext emission and existing runtime result handoff seams.`
- `No sub-runtime must expose private state to EventBindingRuntime except through registered payload fields, resolvers, or existing active-content/runtime-result contracts.`
- `EventBindingRuntime does not hardcode business property branches and only reads fields through registered resolvers.`
- `Priority ordering is deterministic by priority and stable binding id.`
- `Occurrence rules and eventHistory continue to block once/once-per-chapter events correctly.`
- `Scene entry, event taskInputs, nextEventId, actions/effects, and eventHistory writes remain functional through the new runtime.`
- `Old selectTriggeredEvents-style scanning of events[].trigger/conditions is removed after replacement verification.`
- `Guard tests fail if EventDefinition.trigger, EventDefinition.conditions, or old trigger evaluator paths become runtime dependencies again.`

### Version Closeout Contract

- `Version may become done only after all required queues are closed, no active queue/task remains, old runtime paths are removed, double-table pack validation passes, and residue is dispositioned.`
- `Open-version status is not inferred away by queue completion; explicit closeout must be recorded in the version plan.`
- `No queue may delete old event trigger paths until the version plan records that double-table loader/editor/export/built-in-pack/runtime verification has passed.`
