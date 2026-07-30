# Unified Equipment Slot Design

## 1. Goal

Replace the current hardcoded two-slot valuables equipment flow with one reusable, registry-driven equipment system that covers:

- weapon
- armor
- accessory
- mount

This batch must:

- make `weapon / armor / accessory / mount` use the same slot registration and equip path
- rename the character-detail labels from `所属流派 / 武艺师傅` to `饰品 / 坐骑`
- make backpack equipment actions use the unified equip mechanism instead of slot-specific branches
- show equipped items as `已装备` in the backpack
- keep equipped items pinned to the top of the `装备` backpack filter
- preserve the current branch's UI shell, backpack overlay, and entry flow
- borrow boundary ideas from `origin/mod-first-dev` without copying its hardcoded `equippedWeaponSet` model or replacing current UI files wholesale

This batch does not cover:

- adding a new unequip button to the visible UI
- adding new top-level backpack filters
- redesigning the backpack or character-detail layouts
- merging `origin/mod-first-dev`
- introducing feature business branches into `src/main.ts`

## 2. Current Mismatch

The current branch has three separate truths that are now in conflict with the requested feature:

1. valuables equipment is hardcoded to `weapon | armor`
2. backpack actions still branch on `equip.weapon / equip.armor`
3. character detail still renders `schoolName / masterName` placeholders instead of real equipment-backed fields

Current hardcoded state shape:

- `src/domain/valuable-item.ts`
  - `ValuableItemCategory = "weapon" | "armor"`
  - `equippedWeaponSet.swordId`
  - `equippedWeaponSet.armorId`

Current hardcoded behavior:

- `src/application/inventory/inventory-selection.ts`
  - equips by branching on `weapon` vs `armor`
- `src/application/inventory/item-inventory.ts`
  - projects backpack equip actions as `equip.weapon` or `equip.armor`
- `src/ui/app-render.ts`
  - resolves only weapon and armor names for the character detail view
  - fills `schoolName` and `masterName` with `"无"`
- `src/ui/views/character/character-detail-view.ts`
  - shows `所属流派 / 武艺师傅`

`origin/mod-first-dev` is not a solution by itself here. It preserves the same hardcoded `equippedWeaponSet` model, so this request requires a new reusable slot contract in the current branch.

## 3. Approved Scope

### 3.1 In Scope

- expand valuables categories to `weapon | armor | accessory | mount`
- replace `equippedWeaponSet` with one unified `equippedSlots` loadout
- introduce a reusable slot registry and loadout service as independent callable classes
- route backpack equipment actions through the unified service
- route valuables-library equip behavior through the same unified service
- render `饰品 / 坐骑 / 装备武器 / 装备防具` from one shared equipment presenter path
- add regression coverage for:
  - slot registry behavior
  - equip application
  - equipped-item detection
  - backpack equipped markers
  - backpack equipment ordering
  - character-detail equipment labels

### 3.2 Out Of Scope

- new save import/export migrations outside the current in-repo state constructors and fixtures
- adding equipment-derived stat bonuses in this same cut
- changing card, grain, medicine, or trade-good behavior
- replacing the valuables overlay with a new feature surface

## 4. Boundary Decisions

### 4.1 Main Shell Boundary

- Do not add equipment business branches to `src/main.ts`.
- Keep the existing top-level click routing shape.
- Existing action families may continue to enter through the current shell wiring, but the equip business rule must live under shared inventory/equipment modules.

### 4.2 Reference Branch Rule

- Use `origin/mod-first-dev` only as a boundary reference.
- Do not copy its `src/main.ts`, `src/ui/**`, `src/styles/**`, or valuables implementation wholesale.
- The current branch remains the owner of visible UI and shell behavior.

### 4.3 Domain vs Application Boundary

This batch introduces a reusable equipment mechanism with two layers:

- domain-layer slot contracts and loadout operations
- application-layer projection helpers that prepare backpack and character-detail view data

UI must consume projected metadata and must not decide:

- which slot a category belongs to
- whether an item is currently equipped
- how equipped items are ordered

## 5. Approaches Considered

### 5.1 Recommended: Registry + Unified Loadout

Introduce a slot registry and one unified equipment loadout keyed by slot id.

Pros:

- meets the request for flexible, independent, callable classes
- supports future slots without rewriting backpack/detail logic
- removes duplicated slot-specific branches

Cons:

- requires one-time migration from `equippedWeaponSet`

### 5.2 Legacy-Compatible Adapter

Keep `swordId / armorId`, add separate fields for accessory/mount, and wrap them in adapters.

Pros:

- smaller immediate code change

Cons:

- leaves a long-term dual model
- still hardcodes slot ownership
- violates the mechanism-first goal

### 5.3 UI-Only Expansion

Add visible accessory/mount support while leaving the internals slot-specific.

Pros:

- fastest visual result

Cons:

- directly conflicts with the request to avoid hardcoding
- creates more future cleanup

## 6. Recommended Design

Use **Registry + Unified Loadout**.

### 6.1 New Core Contracts

Expected shared ids:

```ts
export type EquipmentSlotId = "weapon" | "armor" | "accessory" | "mount";

export type ValuableItemCategory =
  | "weapon"
  | "armor"
  | "accessory"
  | "mount";
```

Expected loadout shape:

```ts
export type EquipmentLoadout = Record<EquipmentSlotId, ValuableItemId | null>;
```

Expected slot definition shape:

```ts
export type EquipmentSlotDefinition = {
  slotId: EquipmentSlotId;
  label: string;
  acceptedCategories: readonly ValuableItemCategory[];
  sortOrder: number;
};
```

Initial registered slots:

- `weapon` -> `武器`
- `armor` -> `防具`
- `accessory` -> `饰品`
- `mount` -> `坐骑`

Each initial slot accepts exactly its same-named category in this batch. The registry contract stays flexible so future slots can accept multiple categories if needed.

### 6.2 Callable Class Boundary

Expected new modules:

- `src/domain/equipment/equipment-slot-registry.ts`
- `src/domain/equipment/equipment-loadout-service.ts`

Expected callable classes:

```ts
export class EquipmentSlotRegistry {
  constructor(definitions: readonly EquipmentSlotDefinition[]);

  getAll(): readonly EquipmentSlotDefinition[];
  get(slotId: EquipmentSlotId): EquipmentSlotDefinition;
  getSlotForCategory(category: ValuableItemCategory): EquipmentSlotDefinition | null;
  acceptsCategory(slotId: EquipmentSlotId, category: ValuableItemCategory): boolean;
}

export class EquipmentLoadoutService {
  constructor(registry: EquipmentSlotRegistry);

  createDefaultLoadout(): EquipmentLoadout;
  normalizeLoadout(input?: Partial<EquipmentLoadout> | null): EquipmentLoadout;
  equipItem(
    inventory: ValuableItemInventory,
    valuableId: ValuableItemId
  ): ValuableItemInventory;
  unequipSlot(
    inventory: ValuableItemInventory,
    slotId: EquipmentSlotId
  ): ValuableItemInventory;
  getEquippedItemId(
    inventory: ValuableItemInventory,
    slotId: EquipmentSlotId
  ): ValuableItemId | null;
  isItemEquipped(
    inventory: ValuableItemInventory,
    valuableId: ValuableItemId
  ): boolean;
}
```

Implementation rule:

- callers may import shared singleton instances created from these classes
- UI must not instantiate ad hoc registries

### 6.3 Inventory Shape Migration

`src/domain/valuable-item.ts` should move from:

```ts
equippedWeaponSet: {
  swordId: ValuableItemId | null;
  armorId: ValuableItemId | null;
}
```

to:

```ts
equippedSlots: EquipmentLoadout;
```

No long-term dual state is allowed. After this batch, `equippedSlots` is the only source of truth.

## 7. Projection And UI Integration

### 7.1 Backpack Projection Contract

Backpack equipment rows should carry projected metadata such as:

- `equipSlotId`
- `isEquipped`
- `equippedLabel`
- `canEquip`

The backpack action contract should stop emitting slot-specific equip ids such as:

- `equip.weapon`
- `equip.armor`

Instead, all valuables equipment rows should use one unified equip action id:

- `equip.valuable`

The actual slot resolution comes from the item category and the registry, not from the action id string.

### 7.2 Backpack Ordering Rules

Ordering rules in the `equipment` backpack filter:

1. equipped items first
2. then slot order:
   - weapon
   - armor
   - accessory
   - mount
3. then existing item ordering using:
   - `sortWeight` ascending when present
   - otherwise `name` locale order

Ordering rules in non-`equipment` filters:

- preserve the existing behavior for non-equipment families
- no special equipped-first sorting is required outside the `equipment` filter in this batch

Display rules:

- equipped items must show `已装备`
- the marker may appear in the type column, detail headline, or dedicated metadata text, but it must be testable from the rendered HTML

### 7.3 Valuables Library Contract

The valuables library must read the same `equippedSlots` state and the same loadout service.

It must not keep its own separate `weapon / armor` equipment checks.

Its equipment summary should render four slots:

- 武器
- 防具
- 饰品
- 坐骑

If a slot is empty, it renders `未装备`.

### 7.4 Character Detail Contract

Character detail must stop consuming placeholder values for:

- `schoolName`
- `masterName`

Approved label replacements:

- `所属流派` -> `饰品`
- `武艺师傅` -> `坐骑`

Expected equipment-backed fields:

- `饰品` -> current `accessory` slot item name or `无`
- `坐骑` -> current `mount` slot item name or `无`
- `装备武器` -> current `weapon` slot item name or `无`
- `装备防具` -> current `armor` slot item name or `无`

`src/ui/app-render.ts` should resolve these values through shared equipment helpers instead of direct slot-specific branching.

## 8. Compatibility And Failure Rules

### 8.1 One-Time Normalization

The only allowed compatibility seam is a small helper such as:

- `createDefaultEquipmentLoadout()`
- `normalizeEquipmentLoadout()`

Its job is limited to:

- creating the four-slot empty loadout
- normalizing partial or stale state to a full four-slot record

It must not become a long-term adapter layer for old and new field shapes.

### 8.2 Equip Rejection Rules

Equip requests must fail safely when:

- the target item does not exist in the inventory
- the target item has `ownedCount <= 0`
- the item category has no registered slot
- the slot registry rejects the item category

Failure result:

- inventory remains unchanged
- caller receives `unsupported` or the existing no-op failure result path

### 8.3 Stale Equipped Item Ids

If `equippedSlots` references an item id that no longer exists:

- treat the slot as empty for rendering
- do not crash the backpack or character detail views

### 8.4 No Hidden Slot Guessing In UI

UI code must not do logic like:

- `if category === "weapon"`
- `if equippedSlots.weapon === item.id`

except inside shared equipment helpers or tests that explicitly verify slot behavior.

## 9. File Impact

Expected touched implementation files:

- `src/domain/valuable-item.ts`
- `src/domain/equipment/equipment-slot-registry.ts`
- `src/domain/equipment/equipment-loadout-service.ts`
- `src/application/inventory/inventory-selection.ts`
- `src/application/inventory/item-inventory.ts`
- `src/application/state/create-initial-state.ts`
- `src/application/state/game-store-example.ts`
- `src/ui/app-render.ts`
- `src/ui/views/inventory/backpack-view.ts`
- `src/ui/views/valuables/valuable-library-view.ts`
- `src/ui/views/character/character-detail-view.ts`
- `src/content/**/valuables*.json` or equivalent authored valuables content if accessory/mount seed items are needed for visible testing
- `docs/change-log.md`

Expected touched test files:

- `tests/unified-backpack-inventory.test.cjs`
- `tests/backpack-ui-contract.test.cjs`
- valuables view contract tests if present
- character detail source/contract tests if present

## 10. Testing Strategy

### 10.1 Domain Tests

Required failing-first tests for:

- slot registry lookup
- category-to-slot resolution
- default loadout creation
- loadout normalization
- equip application for all four categories
- equipped-item detection
- safe rejection for unsupported categories or missing items

### 10.2 Projection Tests

Required failing-first tests for:

- backpack rows expose `isEquipped` metadata for equipped valuables
- `equipment` filter sorts equipped items to the top
- ordering follows `weapon -> armor -> accessory -> mount`
- unified equip action id is emitted for all equipment rows

### 10.3 UI Contract Tests

Required failing-first tests for:

- backpack HTML renders `已装备`
- character detail HTML renders `饰品` and `坐骑`
- character detail no longer renders `所属流派` or `武艺师傅`
- valuables library summary renders all four slot labels

### 10.4 Regression Coverage

Existing weapon/armor behavior must remain true after migration:

- weapon equips into the weapon slot only
- armor equips into the armor slot only
- existing valuables inventory tests still pass after the state-shape migration

## 11. Implementation Notes

- Keep current visible routes and overlays.
- Do not add equipment-specific shell branches to `src/main.ts`.
- Use the current branch as the UI baseline.
- Treat `origin/mod-first-dev` as a reference source only.
- Update `docs/change-log.md` because this batch changes shared inventory and equipment contracts.

## 12. Definition Of Done

This feature line is complete when:

- all four slots use the same slot registry and loadout service
- `equippedWeaponSet` is fully removed from the active code path
- backpack equipment actions no longer branch on slot-specific action ids
- backpack shows equipped markers and equipment-filter pinning
- character detail shows `饰品 / 坐骑 / 装备武器 / 装备防具` from shared equipment state
- valuables library summary and equip state also read the shared loadout
- related tests pass
- no new equipment business logic is added to `src/main.ts`
