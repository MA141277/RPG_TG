# Mod Item Editor Design

## Purpose

This document records the design agreement for how script-editor items should work in a mod-first project.

The key decision is:

> The script editor defines item assets and their executable semantics. Runtime inventory records what the player currently owns. The backpack is only the unified interaction surface for operating on the player's inventory.

This keeps item content, player state, and backpack UI from becoming one tangled system.

## Naming

- Editor display name: `道具`
- Editor asset family: `items`
- Runtime/content type: `ItemDefinition`
- Script editor type: `ScriptEditorItemRecord`
- Runtime ownership state: `inventory`
- Runtime stack state: `InventoryStack`

The module should not be called `assets`. `assets` is a broader category that also includes images, audio, maps, portraits, and resource manifests. `items` are one kind of content asset, like `people`, `buildings`, and `events`.

## Creator-Facing Identity

Runtime IDs must not be exposed as normal creator-facing fields.

Creators should work with human-readable names, display labels, categories, tags, and reference pickers. The editor may show a compact technical reference only in diagnostics, advanced debug views, or export validation details, but ordinary authoring screens should not ask creators to type or manage IDs.

The editor should generate and maintain runtime IDs internally:

```txt
creator creates "小药水"
-> editor allocates numeric runtime id such as 510001
-> creator sees "小药水"
-> references use selection controls, not raw id text inputs
-> export writes the runtime id
```

All runtime IDs must follow the script editor canonical ID rules and be stored as numeric strings. Existing families use a numeric family code plus a fixed-width sequence, for example `110001` for people, `240001` for settlements, and `280001` for menu instances. Before implementing `items`, the editor must reserve an item family code in the canonical ID allocator.

This applies to item IDs, event IDs, settlement IDs, binding IDs, resource IDs, inventory instance IDs, and generated menu/action IDs wherever practical. The creator-facing model should be:

```txt
Select "小药水" + action "使用"
not type 510001 + use
```

IDs remain required in exported runtime data and internal reference graphs. They are just not the primary authoring surface.

Attribute paths, semantic resolver keys, and namespaced mod component types are not entity IDs. Values such as `stats.martial`, `hp`, or `mod:alchemy.catalyst` may remain semantic strings because they identify fields or extension namespaces rather than editor records.

## Core Boundary

### Event Routing Is The Gameplay Dispatch Spine

All editable gameplay dispatch should go through event routing first.

Item actions must not invoke settlement runtime directly. An item action should emit an item-action trigger into event routing. Event bindings resolve that trigger to an event. Settlement runtime executes only after the resolved event is a settlement event.

Recommended item action chain:

```txt
backpack item action
-> item action runtime builds TriggerContext
-> event-binding-runtime matches EventBinding
-> EventDefinition is activated
-> if event.type = "settlement", event.settlementId selects SettlementDefinition
-> runtime-settlement applies settlement contents
```

This makes event routing the single spine for mod-authored gameplay behavior. Items, houses, dialogue, tasks, minigames, and progression should converge on the same trigger-to-event route wherever they represent editable gameplay.

### Items Are Content Assets

An item definition answers:

- What is this item?
- What static display information does it have?
- What categories, tags, and static rules describe it?
- Which interactions may be offered for it?
- Which existing mechanisms do those interactions reference?

An item definition must not answer:

- Does the player currently own it?
- How many copies does the player have?
- Is this specific copy already submitted, damaged, marked, or modified?
- Which one-off story branch should run directly inside the backpack UI?

### Inventory Is Runtime State

Inventory records what the player currently owns.

It owns:

- Quantity
- Equipment state
- Temporary acquisition and consumption
- Quest submission status
- Optional per-instance item state

Inventory must reference item definitions by `itemId`. It must not duplicate the full item definition.

### Backpack Is Runtime Interaction UI

The backpack owns presentation and interaction flow:

- Show current player-owned items
- Filter and sort visible entries
- Select an item
- Show resolved available actions
- Dispatch a selected item action
- Report whether an action is available or disabled

The backpack must not become a second content asset library.

## Recommended Item Shape

The editor should introduce a first-class `items` family.

```ts
type ItemDefinition = {
  id: string;
  name: string;
  description?: string;

  display?: ItemDisplayDefinition;
  classification?: ItemClassification;
  stack?: ItemStackRule;
  menuInstanceIds?: string[];

  components?: ItemComponent[];

  tags?: string[];
  customProperties?: Record<string, unknown>;
};
```

The required minimum fields are `id` and `name`. Other sections should be optional so mods can define simple and advanced items through the same contract.

`id` is required in runtime data, but it should be hidden from normal creator-facing item forms. The editor owns ID allocation, uniqueness, rename stability, and reference updates.

`menuInstanceIds` is optional and may be empty. Items should not duplicate menu module data. If an item needs backpack, shop, storage, dialogue, or debug actions, the item references menu instances from the menu module. Those menu instances remain the source of menu groups and action rows.

## Classification

Item classification should not be a closed hardcoded enum such as only `weapon`, `food`, or `quest`.

Use layered string categories and tags:

```ts
type ItemClassification = {
  primaryCategory?: string;
  secondaryCategories?: string[];
  usageTags?: string[];
  worldTags?: string[];
};
```

Example:

```json
{
  "primaryCategory": "equipment",
  "secondaryCategories": ["weapon", "blade"],
  "usageTags": ["equipable", "giftable"],
  "worldTags": ["ming", "military"]
}
```

This lets mods add concepts such as talismans, books, contracts, materials, warrants, tokens, maps, currencies, or faction badges without changing core code.

## Components

Item gameplay meaning should come from optional components rather than one large fixed schema.

```ts
type ItemComponent =
  | EquipmentComponent
  | ConsumableComponent
  | QuestItemComponent
  | TradeGoodsComponent
  | GiftComponent
  | ReadableComponent
  | UnlockKeyComponent
  | CurrencyLikeComponent
  | ModCustomComponent;
```

Built-in components should be added only when the runtime has a stable generic mechanism for them.

Example equipment item:

```json
{
  "id": "510001",
  "name": "龙泉剑",
  "classification": {
    "primaryCategory": "equipment",
    "secondaryCategories": ["weapon"]
  },
  "components": [
    {
      "type": "equipment",
      "slot": "weapon",
      "statModifiers": [
        { "target": "player.stats.martial", "operation": "add", "value": 4 }
      ]
    },
    {
      "type": "gift",
      "preferenceTags": ["weapon", "martial"]
    }
  ]
}
```

Example trade good:

```json
{
  "id": "510002",
  "name": "粮食",
  "classification": {
    "primaryCategory": "goods",
    "secondaryCategories": ["food", "trade"]
  },
  "stack": {
    "stackable": true,
    "unit": "斗"
  },
  "components": [
    {
      "type": "tradeGoods",
      "marketTags": ["grain"]
    }
  ]
}
```

Example quest item:

```json
{
  "id": "510003",
  "name": "密信",
  "classification": {
    "primaryCategory": "quest",
    "secondaryCategories": ["document"]
  },
  "components": [
    {
      "type": "questItem",
      "questIds": ["310001"],
      "consumedOnSubmit": true
    }
  ]
}
```

## Menu-Backed Actions

Items may expose actions through referenced menu module instances, but item data must not contain arbitrary script code.

The menu group for an item may be empty. In that case the item has no item-specific visible operations in that surface, though it can still exist as inventory, quest state, trade stock, or runtime content.

Menu entries should reference existing runtime mechanisms through the menu module and event route. For state changes such as healing, damage, money, task progress, or inventory mutation, the resolved target should ultimately be a settlement event that uses the settlement mechanism already present on `mod-first-dev`.

Supported resolved action examples:

- Equip: built-in inventory handler
- Use: settlement
- Read: event or dialogue flow
- Submit: settlement event or task handoff
- Trigger story: event
- Launch minigame: flow

The backpack should dispatch actions to runtime handlers. It should not interpret custom business logic itself.

Menu action data should come from the existing menu module:

```txt
ItemDefinition.menuInstanceIds
-> MenuInstanceDefinition
-> MenuResourceDefinition.entries
-> event routing trigger context
```

This keeps item authoring from becoming a second menu editor. The item module may show linked menu instances, but editing menu rows belongs to the menu module.

## Settlement Runtime Alignment

Item actions must align with the event route, settlement event, and settlement runtime model on `mod-first-dev`.

That branch already has:

```ts
type SettlementDefinition = {
  id: string;
  title?: string;
  nextEventId?: string;
  contents?: SettlementContentDefinition[];
};

type SettlementContentDefinition = {
  targetFamily: "person" | "city" | "building";
  targetId: string;
  attributeKey: string;
  attributeType: "number" | "boolean" | "enum";
  operation: "add" | "subtract" | "set";
  value: string | number | boolean;
};
```

Events can reference settlements with `type: "settlement"` and `settlementId`. Scenario-pack loading and script-editor export already reject settlement events without a valid `settlementId`.

For item usage, the preferred flow is:

1. Backpack UI dispatches the selected item action.
2. Item action runtime validates ownership and builds a trigger context.
3. Event routing resolves the trigger through `EventBinding`.
4. The resolved event decides the next mechanism: settlement, flow, dialogue, task handoff, or other event-owned runtime behavior.
5. If the event is a settlement event, `runtime-settlement` applies the settlement contents.
6. Inventory consumption is applied through the same event-owned settlement path or through a standard inventory mutation owned by item action runtime after settlement success.
7. UI re-renders from runtime state.

The backpack UI must never directly mutate character attributes, money, item quantity, task state, or flags.

Example healing item:

```json
{
  "id": "510004",
  "name": "小药水",
  "classification": {
    "primaryCategory": "consumable",
    "secondaryCategories": ["medicine"]
  },
  "stack": {
    "stackable": true,
    "maxStack": 99
  },
  "components": [
    {
      "type": "consumable",
      "consumeOnUse": true
    }
  ],
  "menuInstanceIds": ["280001"]
}
```

Matching settlement:

```json
{
  "id": "240001",
  "title": "使用小药水",
  "contents": [
    {
      "targetFamily": "person",
      "targetId": "110001",
      "attributeKey": "hp",
      "attributeType": "number",
      "operation": "add",
      "value": 10
    }
  ]
}
```

The exact player target and `attributeKey` must follow the existing script-editor field mapping and runtime mutation contract. If the creator selects "current player" in the UI, the editor must lower that selection to a valid numeric runtime target or a documented runtime resolver before export. If `hp` is a mod-defined character attribute, the settlement authoring and export validation must know how that key maps to runtime state before the item action can be considered valid.

Example random item:

```json
{
  "id": "510005",
  "name": "命运硬币",
  "classification": {
    "primaryCategory": "consumable",
    "secondaryCategories": ["curio", "random"]
  },
  "menuInstanceIds": ["280002"]
}
```

The random branch should be implemented by a reusable flow or future generic settlement random-choice mechanism. The item itself must not own coin-specific code.

Current `mod-first-dev` settlement targets are `person`, `city`, and `building`. Inventory is not yet a settlement target family there. Therefore, item consumption has two acceptable implementation paths:

- Extend the settlement runtime with an `inventory` target family and update the script-editor/runtime contracts together.
- Keep inventory consumption inside item action runtime as a standard post-settlement inventory mutation, with no direct UI mutation.

The first path is the long-term cleaner model. The second path is acceptable only as a bounded transition while the inventory runtime contract is being introduced. In both paths, the initial gameplay dispatch still goes through event routing.

## Inventory State

Item definitions must not store `count`.

Runtime ownership should be represented separately:

```ts
type InventoryState = {
  stacks: InventoryStack[];
  equipment?: Record<string, string | null>;
};

type InventoryStack = {
  itemId: string;
  quantity: number;
  instanceId?: string;
  flags?: Record<string, boolean>;
  variables?: Record<string, number | string>;
};
```

Use `instanceId` and stack-local state only when a specific copy needs identity, such as a damaged weapon, a marked letter, a unique treasure, or a read/unread book.

## Editor Surface

The script editor should organize `items` with these sections:

- Basic information
- Display
- Stack rule
- Linked menu instances

Creator-facing basic information should use:

- Name
- Display title or short label
- Description
- Internal note

It should not expose raw runtime ID as an editable primary field. If an advanced view is needed, it should be explicitly marked as technical/debug information.

The editor should not introduce a heavy `backpacks` content module.

The item editor should not introduce a second heavy menu editor either. Menu groups are optional references to menu module instances. The item editor can provide shortcuts such as "create linked backpack menu", but the created menu remains owned by the menu module.

The creator-facing item module should stay intentionally small. It should not include:

- Copy item
- Classification and tag editing
- Static component editing
- Action preview
- Reverse-reference browsing
- A dedicated validation panel

Reference diagnostics and export validation may still exist in shared editor-level tooling, but they should not be part of the item module surface.

If backpack settings are needed, keep them as small system configuration:

```ts
type BackpackSystemConfig = {
  enabled: boolean;
  defaultCategoryOrder: string[];
  categoryLabels?: Record<string, string>;
  openRules?: {
    conditionGroupId?: string;
    disabledText?: string;
  };
};
```

## Mod Extension Rules

1. Core runtime should understand the generic concepts: `items`, `inventory`, `components`, and `actions`.
2. New item categories should not require TypeScript code changes.
3. Stable built-in behavior can graduate into built-in components.
4. Mod-specific behavior should use namespaced custom components.
5. Item actions should reference settlements, settlement events, flows, tasks, or built-in handlers.
6. Backpack UI should render resolved state and available actions; it should not own item business rules.
7. Creator-facing editor screens should avoid raw ID entry. References should be selected through typed pickers backed by internal IDs.

Example namespaced custom component:

```json
{
  "type": "mod:alchemy.catalyst",
  "properties": {
    "element": "fire",
    "tier": 2
  }
}
```

## Migration Direction

The current codebase still has legacy `valuables` and a unified backpack projection layer. The target direction is:

1. Add `items` as the first-class script-editor and scenario-pack content family.
2. Keep `valuables` import/export compatibility during migration.
3. Project old valuables, grain, and reward variables into unified backpack entries as compatibility inputs.
4. Move persistent player ownership into unified inventory state.
5. Remove `count` from item definitions and keep it in inventory stacks.
6. Route state-changing item actions through the `mod-first-dev` settlement runtime model.
7. Let backpack presenter/view consume resolved item inventory projections only.

## Non-Goals

- Do not make `backpacks` a primary content asset module.
- Do not write item quantities back to item definitions.
- Do not put task or event business branches into backpack UI.
- Do not execute arbitrary JavaScript from item data.
- Do not hardcode new item-specific branches in `src/main.ts`.

## Design Summary

`items` define what can exist. `inventory` records what the player currently has. The backpack lets the player inspect and operate on the inventory. Item gameplay meaning is expressed through reusable components and references to existing runtime mechanisms, so mods can add new item concepts without changing the core editor every time.
