# Unified Player Item Inventory Migration Design

> Supersedes `docs/superpowers/specs/2026-07-28-shop-purchase-backpack-projection-design.md` for this feature line.

## 1. Goal

Realign shop-purchased inventory with the repository's `mod-first / event-owned / settlement` direction by standardizing player-owned non-grain shop items under `var.player_inventory.item.<itemId>`, while keeping grain on `var.player_inventory.grain_dou`, avoiding new `main.ts` house branches, and preserving existing saves through legacy-key migration reads.

This batch covers:

- unified runtime ownership for medicine-house prepared medicines
- unified runtime ownership for market-house non-grain trade goods
- backpack projection through one shared player-item helper
- legacy inventory compatibility for existing saves
- targeted regression coverage for medicine buy, market buy/sell, and backpack field shape

This batch does not cover:

- migrating grain into `var.player_inventory.item.*`
- migrating legacy valuables into the same runtime key family
- adding backpack consume/sell actions for the new rows
- converting house modules to full `src/core/runtime/runtime-settlement.ts` ownership in this same cut

## 2. Current Mismatch

The current local branch state is between two designs:

1. the backpack can now show prepared medicine and trade goods
2. the underlying house settlement paths still write legacy house-specific runtime keys

Current inventory ownership paths:

- grain: `var.player_inventory.grain_dou`
- prepared medicine: `var.medicine_inventory.<itemId>`
- market-house trade goods: `var.trade_inventory.<goodsId>`
- valuables: `gameState.valuables`

Current mismatch:

- `src/application/inventory/item-inventory.ts` currently projects medicine/trade rows by reading legacy keys directly
- `src/application/medicine-house/medicine-house-mutations.ts` still writes `var.medicine_inventory.*`
- `src/application/house-modules/market-house/market-house-house-module.ts` still writes `var.trade_inventory.*`
- that means visible backpack behavior and persistent runtime ownership are still split

This spec closes that split by moving non-grain shop items onto a shared player item runtime key while preserving migration safety for existing saves.

## 3. Boundary Decisions

### 3.1 Main Boundary

- Do not add medicine-house, grain-shop, or market-house business branches in `src/main.ts`.
- Keep house modules returning normal `HouseModuleTransitionResult`.
- Treat inventory persistence as a shared application-layer settlement concern, not a `main.ts` concern.

### 3.2 Settlement Boundary

This batch introduces a shared typed inventory mutation helper in the application layer instead of expanding the current `src/core/contracts/effect.ts` contract immediately.

Reason:

- the current house-module flow is still `HouseModuleTransitionResult`-first rather than effect-first
- forcing a full core-runtime item-effect migration in the same batch would enlarge scope far beyond the requested inventory unification

The shared typed mutation seam introduced here is the lowering boundary that a later runtime-effect migration can reuse.

### 3.3 Inventory Family Boundary

- grain remains a dedicated quantity path on `var.player_inventory.grain_dou`
- prepared medicine moves to shared player item runtime ownership
- market-house non-grain trade goods move to shared player item runtime ownership
- grain-shop goods do not move into shared player item runtime ownership in this batch
- valuables remain out of scope for runtime-key migration in this batch

## 4. Runtime Key Contract

### 4.1 Shared Item Key

All unified player-owned non-grain shop items use:

- `var.player_inventory.item.<itemId>`

Examples:

- `var.player_inventory.item.medicine_heal_001`
- `var.player_inventory.item.silk`

### 4.2 Grain Key

Grain remains:

- `var.player_inventory.grain_dou`

No grain row should be mirrored into `var.player_inventory.item.rice`, `...wheat`, or similar item keys in this batch.

### 4.3 Legacy Migration Read Sources

Shared player-item reads must support these legacy sources:

- prepared medicine fallback source: `var.medicine_inventory.<itemId>`
- market-house non-grain trade fallback source: `var.trade_inventory.<goodsId>`

Legacy keys are migration sources only. New writes should not continue to persist into those legacy keys.

### 4.4 Item Id Uniqueness Constraint

This batch relies on the current prepared-medicine ids and non-grain trade-good ids being globally unique inside `var.player_inventory.item.<itemId>`.

If a future content pack introduces cross-family id collisions, the runtime key shape must be upgraded deliberately in a fresh spec rather than patched ad hoc in this batch.

## 5. Shared Helper Contract

Expected new shared helper module:

- `src/application/inventory/player-item-inventory.ts`

Expected typed contracts:

```ts
export type PlayerItemLegacySource = "medicine-house" | "market-house";

export type PlayerItemQuantityMutation = {
  itemId: string;
  delta: number;
  legacySources?: PlayerItemLegacySource[];
};
```

Expected helper surface:

```ts
export function getPlayerItemQuantityVariableKey(itemId: string): string;

export function readPlayerItemQuantity(
  state: Pick<GameState, "runtime">,
  itemId: string,
  legacySources?: PlayerItemLegacySource[]
): number;

export function setPlayerItemQuantity(
  state: GameState,
  itemId: string,
  quantity: number,
  legacySources?: PlayerItemLegacySource[]
): GameState;

export function mutatePlayerItemQuantity(
  state: GameState,
  itemId: string,
  delta: number,
  legacySources?: PlayerItemLegacySource[]
): GameState;

export function applyPlayerItemMutations(
  state: GameState,
  mutations: readonly PlayerItemQuantityMutation[]
): GameState;
```

Design rules:

- `readPlayerItemQuantity()` returns one normalized quantity
- callers pass the allowed legacy sources explicitly instead of the helper importing house content registries
- negative or non-numeric runtime values are treated as `0`
- mutation helpers clamp final quantity to `>= 0`

## 6. Migration Semantics

### 6.1 Read-Time Merge

For a supported item:

```text
normalizedQuantity =
  max(0, sharedPlayerItemQuantity) +
  sum(max(0, matchedLegacyQuantities))
```

Examples:

- medicine read may merge new key + matching `var.medicine_inventory.*`
- market-house non-grain read may merge new key + matching `var.trade_inventory.*`
- grain does not use this path

### 6.2 Write-Time Normalization

When a unified item is touched by a new buy/sell mutation:

```text
nextQuantity = max(0, readMergedQuantity(itemId, legacySources) + delta)
```

Then:

1. write `nextQuantity` into `var.player_inventory.item.<itemId>`
2. clear the touched legacy source keys for that item to `0`

This prevents double-counting once an item has been migrated by gameplay.

### 6.3 Unknown Or Unsupported Items

- Unknown runtime keys are never enumerated directly into the backpack.
- Only known prepared-medicine definitions and known non-grain trade-good definitions are projected.
- Unknown ids and stale legacy keys must be ignored safely rather than surfaced or crashed.

## 7. House Integration

### 7.1 Medicine House

Current business-layer shape stays:

- `MedicineHouseActionOutcome.inventoryChange`

But settlement changes:

- `applyMedicineHouseOutcome()` must stop directly writing `var.medicine_inventory.<itemId>`
- instead, lower `inventoryChange` into shared `PlayerItemQuantityMutation[]`
- then call `applyPlayerItemMutations()`

Medicine-house call sites keep expressing business intent as "gain 1 prepared medicine" rather than knowing runtime key details.

### 7.2 Market House

Current business-layer shape stays:

- `MarketHouseActionOutcome.inventoryChange`

But settlement changes:

- market-house non-grain goods must stop directly writing `var.trade_inventory.<goodsId>`
- buy and sell must both lower inventory deltas into shared `PlayerItemQuantityMutation[]`
- then call `applyPlayerItemMutations()`

Sell flow requirement:

- owned quantity checks must use the normalized shared read path so a save that still only has legacy `var.trade_inventory.<goodsId>` can sell correctly on first touch

### 7.3 Grain Guard

- grain-shop stays on `var.player_inventory.grain_dou`
- market-house unified item mutations must not route grain goods into `var.player_inventory.item.*`
- backpack grain still renders one shared row only

## 8. Backpack Projection Contract

Backpack projection continues to be the visible read model, but it must now read unified player items instead of directly reading legacy medicine/trade keys.

### 8.1 Stable Row Ids

- grain: `item.grain`
- prepared medicine: `item.medicine.<itemId>`
- trade good: `item.trade.<goodsId>`

### 8.2 Required Field Shape

Projected backpack rows for unified shop items must include:

- `id`
- `name`
- `icon`
- `value`
- `types`
- `count`
- `description`
- `actions`

Field rules:

- `icon` is `null` unless the current content surface already provides a valid item image path
- `actions` is `[]` for prepared medicine and trade goods in this batch
- `count` comes from `readPlayerItemQuantity()`

### 8.3 Type Rules

- grain: `["food", "grain"]`
- prepared medicine: `["other", "prepared-medicine"]`
- trade goods: `["other", "trade", goods.category]`

Top-level filters remain exactly:

- `all`
- `equipment`
- `food`
- `other`

### 8.4 Description Rules

- prepared medicine description/detail text may continue using generated effect text if no richer authored copy exists
- trade goods continue using content-authored description

## 9. Testing Strategy

### 9.1 Shared Helper And Projection Tests

Extend focused inventory tests so they prove:

- direct read/write on `var.player_inventory.item.<itemId>`
- legacy medicine fallback is merged into normalized quantity
- legacy market-house fallback is merged into normalized quantity
- touched item writes normalize into new key and clear the touched legacy key
- grain remains separate and still renders as one row
- projected shop rows expose all required backpack fields:
  - `id`
  - `name`
  - `icon`
  - `value`
  - `types`
  - `count`
  - `description`
  - `actions`

### 9.2 Medicine House Regression

Regression coverage must prove:

- `confirm-buy` still deducts gold
- purchased medicine is persisted through `var.player_inventory.item.<itemId>`
- touched legacy `var.medicine_inventory.<itemId>` is cleared after normalization write
- backpack projection shows the medicine row with correct count

### 9.3 Market House Regression

Regression coverage must prove:

- buy flow still deducts gold and adds the selected non-grain good to unified item inventory
- sell flow reads normalized quantity, deducts the item, and credits gold
- a legacy-only save state that still has `var.trade_inventory.<goodsId>` can sell on first touch
- touched legacy `var.trade_inventory.<goodsId>` is cleared after normalization write
- backpack projection reflects post-buy and post-sell counts correctly

## 10. File Impact

Expected core files:

- `src/application/inventory/player-item-inventory.ts`
  - new shared runtime-key helper and typed mutation settlement helper
- `src/application/medicine-house/medicine-house-mutations.ts`
  - medicine inventory settlement rewired to shared player-item mutations
- `src/application/house-modules/market-house/market-house-house-module.ts`
  - non-grain trade inventory settlement rewired to shared player-item mutations
- `src/application/inventory/item-inventory.ts`
  - backpack projection rewired to shared player-item reads
- `tests/unified-backpack-inventory.test.cjs`
  - helper + projection + field-shape coverage
- `tests/robustness.test.cjs`
  - medicine-house and market-house buy/sell regressions
- `tests/backpack-ui-contract.test.cjs`
  - retain readable label and actionless-row contract checks if field shape expectations need expansion

Governance/docs later:

- a fresh implementation plan must replace the current compatibility-projection plan direction
- `docs/change-log.md` must record the unified player item runtime key

## 11. Out Of Scope

- full migration of valuables into `var.player_inventory.item.*`
- extending `src/core/contracts/effect.ts` with player-item inventory effects in this same batch
- refactoring all house modules onto core runtime settlement ownership
- backpack consume/use/sell actions for the new unified item rows
- grain unification into the new item key family

## 12. Exit Conditions

This design is complete when:

- medicine-house prepared medicine persists to `var.player_inventory.item.<itemId>`
- market-house non-grain goods persist to `var.player_inventory.item.<itemId>`
- market-house sell flow reads/writes normalized unified inventory correctly
- touched legacy medicine/trade keys are normalized into the new key and cleared
- grain still uses `var.player_inventory.grain_dou` and renders as one row
- backpack rows for shop items come from unified shared reads and satisfy the required field shape
- no new house-specific business branches are added to `src/main.ts`
