# Shop Purchase Backpack Projection Design

## 1. Goal

Extend the existing unified backpack so shop-purchased goods appear in the same visible backpack flow as legacy valuables and shared grain.

This batch only covers:

- projecting purchased shop goods into the backpack list and detail panel
- keeping existing shop purchase settlement and runtime ownership unchanged
- covering medicine house, grain shop, and market/merchant shop purchases through one backpack view

This batch does not cover:

- consuming medicine from the backpack
- selling trade goods from the backpack
- quest submission changes beyond the existing grain path
- introducing a new top-level backpack filter

## 2. Current Context And Mismatch

The repository already has two separate truths that do not yet meet:

1. shop purchase flows already persist inventory successfully
2. the visible backpack only projects a subset of those inventories

Current inventory ownership paths:

- legacy valuables remain visible through the unified backpack compatibility layer
- shared grain is already normalized to `var.player_inventory.grain_dou`
- medicine house writes purchased prepared medicine to `var.medicine_inventory.<itemId>`
- market house writes purchased trade goods to `var.trade_inventory.<goodsId>`

Current mismatch:

- `src/application/inventory/item-inventory.ts` only projects valuables plus shared grain
- backpack tests only lock valuables plus grain behavior
- existing market and medicine house tests verify runtime inventory mutation, but do not verify backpack visibility

Because of that mismatch, players can buy shop goods successfully while the backpack appears incomplete.

## 3. Approved Scope

### 3.1 In Scope

- keep current runtime keys and current purchase settlement logic
- extend unified backpack projection to include:
  - shared grain
  - prepared medicine from medicine house inventory
  - trade goods from shop trade inventory
- keep all new shop-projected rows visible through the existing backpack overlay
- keep current top-level filters:
  - `all`
  - `equipment`
  - `food`
  - `other`
- add regression tests for projection and end-to-end shop-to-backpack visibility

### 3.2 Out Of Scope

- replacing `var.medicine_inventory.*` with a new shared item runtime
- replacing `var.trade_inventory.*` with a new shared item runtime
- splitting grain into separate visible rows for rice / wheat / salt / soybean / millet
- adding backpack settlement actions for medicine or trade goods
- redesigning backpack layout or adding a dedicated medicine filter

## 4. Approaches Considered

### 4.1 Compatibility Projection Extension

Keep all existing shop runtime ownership as-is and extend the backpack projection layer so it reads more inventory sources.

Pros:

- smallest change
- preserves current save/runtime behavior
- matches the user request exactly
- avoids touching house settlement logic beyond existing tests

Cons:

- backpack projection remains a compatibility adapter rather than a fully unified inventory owner

### 4.2 Backpack Source Registry

Introduce explicit inventory source adapters and let the backpack combine them through a registry.

Pros:

- cleaner long-term structure
- easier future expansion for more item families

Cons:

- extra architecture for a narrow user-visible gap
- larger change surface than this batch needs

### 4.3 Full Shared Inventory Migration

Move medicine and trade goods into a new first-class shared player inventory runtime.

Pros:

- cleanest long-term ownership model

Cons:

- requires migration work, wider regression coverage, and more interface decisions
- too large for the current request

## 5. Recommended Design

Use **Compatibility Projection Extension** for this batch.

The implementation should treat the visible backpack as a compatibility-first projection over multiple existing runtime inventories, without changing the underlying shop settlement rules.

## 6. Projection Contract

### 6.1 Grain Shop Contract

- grain remains backed by `var.player_inventory.grain_dou`
- backpack continues to show grain as one shared grain row
- grain is not split into separate trade-good rows in this batch
- grain keeps its current `food` classification and existing submit action surface

This preserves the existing temple submission and begging-flow expectations.

### 6.2 Medicine House Contract

- prepared medicine remains owned by `var.medicine_inventory.<itemId>`
- backpack projection reads `medicineHousePreparedMedicines`
- every prepared medicine with owned quantity `> 0` becomes one backpack row
- the projected row uses the prepared medicine name and price from content
- description/detail text should be generated from the prepared medicine effect if no richer authored detail exists
- projected medicine rows have no active backpack actions in this batch

### 6.3 Market / Shop Trade Contract

- trade goods remain owned by `var.trade_inventory.<goodsId>`
- backpack projection reads `globalGoodsPool`
- every trade good with owned quantity `> 0` becomes one backpack row
- the projected row uses the trade good name, base price, and description from content
- projected trade-good rows have no active backpack actions in this batch

## 7. Item Identity And Type Rules

### 7.1 Stable Backpack Item Ids

Projected rows should use namespaced backpack item ids so they do not collide with legacy valuables or future item families.

Recommended forms:

- grain: keep existing `item.grain`
- medicine: `item.medicine.<itemId>`
- trade goods: `item.trade.<goodsId>`

These ids are for backpack selection/rendering only. They do not replace the underlying runtime inventory keys.

### 7.2 Top-Level Filter Behavior

Top-level filter behavior stays unchanged:

- valuables/equipment remain under `equipment`
- shared grain remains under `food`
- prepared medicine and trade goods fall under `other`

This keeps the current backpack UI stable and avoids adding a new medicine-specific filter before medicine actions exist.

### 7.3 Type Labels

The backpack type-label map should be extended only as needed so newly projected rows render readable labels instead of raw internal tokens.

Minimum expected readable labels for this batch:

- `medicine`
- `trade`
- relevant market categories that can appear in the backpack detail/type display

## 8. Safety And Failure Rules

- unknown medicine ids in runtime inventory must be skipped, not crash the backpack
- unknown trade goods ids in runtime inventory must be skipped, not crash the backpack
- zero or negative owned quantity must not produce a visible backpack row
- this batch must not mutate inventory when opening the backpack
- this batch must not introduce backpack actions that silently do nothing while reporting success

## 9. File Impact

Expected core files:

- `src/application/inventory/item-inventory.ts`
  - extend projection helpers for medicine and trade goods
- `src/application/inventory/trade-inventory.ts`
  - keep current grain compatibility behavior unchanged unless a small helper extraction is genuinely useful
- `src/ui/views/inventory/backpack-view.ts`
  - only adjust readable type labels if needed by the new projected rows
- `tests/unified-backpack-inventory.test.cjs`
  - add failing tests for medicine/trade projection and `other` filtering
- `tests/robustness.test.cjs`
  - extend existing shop purchase tests so successful purchase also implies backpack visibility

## 10. Testing Strategy

### 10.1 Projection Tests

Add focused backpack tests that require:

- valuables plus grain still project correctly
- prepared medicine projects from `var.medicine_inventory.*`
- trade goods project from `var.trade_inventory.*`
- medicine and trade goods appear under `other`
- unknown ids are skipped safely

### 10.2 Shop Flow Regression Tests

Extend existing end-to-end house tests so they prove:

- medicine house purchase still writes inventory and now appears in projected backpack rows
- market house purchase still writes inventory and now appears in projected backpack rows
- grain shop behavior remains on the shared grain row and does not regress

## 11. Exit Conditions

This design is complete when:

- a purchased medicine appears in the unified backpack
- a purchased trade good appears in the unified backpack
- grain still appears through the shared grain row
- the existing backpack filters still behave correctly without new categories
- backpack open/render does not crash on unknown or stale runtime inventory ids
- targeted inventory and shop regression tests cover the new projection paths

