# Unified Backpack Inventory Spec

## Goal

Replace the half-finished valuables surface with a unified backpack item system that can represent valuables, equipment, food/grain, quest submission items, and future item types through one player inventory contract.

## Scope

### In Scope

- Introduce a reusable item definition and inventory state contract.
- Keep legacy valuable items readable through a compatibility adapter during the first migration batch.
- Project player grain stored at `var.player_inventory.grain_dou` into the unified inventory view.
- Add declarative item actions such as equip, use, and submit without running arbitrary script from item data.
- Replace the visible valuables overlay with a backpack overlay that keeps the existing click-to-detail behavior.
- Keep the character detail entry and add a main screen bottom backpack entry.
- Provide category filters for `全部`, `装备`, `食物`, and `其他`.
- Render the backpack table with columns for icon, name, value, type, owned count.
- Reuse existing Taiko-like library and nine-slice list styling where practical.

### Out Of Scope

- Full removal of every legacy `valuable` field and content-pack file in the first batch.
- Full quest/task DSL redesign.
- Running arbitrary JS from item definitions.
- Balancing item stat effects beyond the existing weapon/armor equip slots.
- Rewriting market, medicine, or temple house modules in this batch unless needed for compatibility.

## Architecture Requirements

- Runtime item behavior is handler-based: item data declares action ids, code owns the implementation.
- Existing save/content paths must remain compatible while the first inventory contract lands.
- Grain remains backed by `var.player_inventory.grain_dou` until a later save migration moves it into first-class `inventory.stacks`.
- `main.ts` may wire generic overlay events, but item-specific behavior must live in application inventory modules.
- UI view code renders state and data attributes only; it must not own item business rules.
- The first batch must be test-first for selectors, action resolution, and rendering contract.

## Item Model

The first batch should support this semantic shape:

```ts
export type ItemCategoryFilter = "all" | "equipment" | "food" | "other";

export type ItemActionId =
  | "equip.weapon"
  | "equip.armor"
  | "consume.food"
  | "consume.medicine"
  | "submit.quest";

export type ItemDefinition = {
  id: string;
  name: string;
  icon: string | null;
  value: number;
  types: string[];
  count: number;
  description: string;
  detailText?: string;
  actions: ItemActionDefinition[];
};
```

Exact names may be adjusted to fit the codebase, but the runtime behavior must preserve this split between data declaration and code-owned action handlers.

## Exit Conditions

- The backpack overlay can show legacy valuables and projected grain in one list.
- `全部`, `装备`, `食物`, and `其他` filters work.
- Clicking an item row updates the detail panel.
- Weapon and armor items can be equipped from the backpack.
- Food/grain items can expose a safe action surface even if the first batch only disables or no-ops unavailable actions.
- Character detail opens the backpack instead of the old valuables surface.
- Main screen has a bottom backpack entry.
- `npm run typecheck` and `npm run build` pass, or failures are explicitly recorded with unrelated blockers.

## Verification

- `npm run lint:plans`
- Targeted inventory tests
- `npm run typecheck`
- `npm run build`

