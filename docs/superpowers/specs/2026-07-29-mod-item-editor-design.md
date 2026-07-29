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

## Core Boundary

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

  components?: ItemComponent[];
  actions?: ItemActionRef[];

  tags?: string[];
  customProperties?: Record<string, unknown>;
};
```

The required minimum fields are `id` and `name`. Other sections should be optional so mods can define simple and advanced items through the same contract.

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
  "id": "item.sword.longquan",
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
  "id": "item.grain",
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
  "id": "item.letter.secret",
  "name": "密信",
  "classification": {
    "primaryCategory": "quest",
    "secondaryCategories": ["document"]
  },
  "components": [
    {
      "type": "questItem",
      "questIds": ["quest.deliver_secret_letter"],
      "consumedOnSubmit": true
    }
  ]
}
```

## Actions

Items may declare actions, but item data must not contain arbitrary script code.

Actions should reference existing runtime mechanisms:

```ts
type ItemActionRef = {
  id: string;
  label: string;
  kind: "effectBundle" | "event" | "flow" | "builtin";
  targetId: string;
  conditionGroupId?: string;
  availabilityText?: string;
};
```

Example:

```json
{
  "actions": [
    {
      "id": "item.action.equip",
      "label": "装备",
      "kind": "builtin",
      "targetId": "inventory.equip"
    },
    {
      "id": "item.action.read",
      "label": "阅读",
      "kind": "event",
      "targetId": "event.read_secret_letter"
    }
  ]
}
```

Supported action routing examples:

- Equip: built-in inventory handler
- Use: effect bundle
- Read: event or dialogue flow
- Submit: task or effect bundle
- Trigger story: event
- Launch minigame: flow

The backpack should dispatch actions to runtime handlers. It should not interpret custom business logic itself.

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
- Classification and tags
- Stack rule
- Components
- Actions
- References
- Validation

The editor should not introduce a heavy `backpacks` content module.

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
5. Item actions should reference events, effect bundles, flows, tasks, or built-in handlers.
6. Backpack UI should render resolved state and available actions; it should not own item business rules.

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
6. Let backpack presenter/view consume resolved item inventory projections only.

## Non-Goals

- Do not make `backpacks` a primary content asset module.
- Do not write item quantities back to item definitions.
- Do not put task or event business branches into backpack UI.
- Do not execute arbitrary JavaScript from item data.
- Do not hardcode new item-specific branches in `src/main.ts`.

## Design Summary

`items` define what can exist. `inventory` records what the player currently has. The backpack lets the player inspect and operate on the inventory. Item gameplay meaning is expressed through reusable components and references to existing runtime mechanisms, so mods can add new item concepts without changing the core editor every time.
