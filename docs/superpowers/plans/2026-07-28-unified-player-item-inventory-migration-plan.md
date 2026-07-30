# Unified Player Item Inventory Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate medicine-house prepared medicines and market-house non-grain trade goods onto `var.player_inventory.item.<itemId>` with read-time legacy merge, write-time normalization, and one shared backpack projection path while grain stays on `var.player_inventory.grain_dou`.

**Architecture:** Add `src/application/inventory/player-item-inventory.ts` as the shared application-layer helper for unified non-grain player items. Rewire medicine-house and market-house settlement to lower their existing `inventoryChange` business outcomes into typed player-item mutations, keep grain on the existing grain helper, and make backpack projection read through the shared helper so legacy save quantities are preserved and normalized on first touch without adding new `main.ts` house branches.

**Tech Stack:** TypeScript, Vite, Node test runner, PowerShell, bundled Node runtime (`C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` in this workspace), `tsconfig.test.json`, `.test-dist`, `tests/unified-backpack-inventory.test.cjs`, `tests/robustness.test.cjs`, and `tools/lint-superpowers-plans.mjs`.

## Global Constraints

- Do not add medicine-house, grain-shop, or market-house business branches in `src/main.ts`.
- Keep house modules returning normal `HouseModuleTransitionResult`.
- Treat inventory persistence as a shared application-layer settlement concern, not a `main.ts` concern.
- grain remains a dedicated quantity path on `var.player_inventory.grain_dou`
- grain-shop goods do not move into shared player item runtime ownership in this batch
- valuables remain out of scope for runtime-key migration in this batch
- callers pass the allowed legacy sources explicitly instead of the helper importing house content registries
- negative or non-numeric runtime values are treated as `0`
- mutation helpers clamp final quantity to `>= 0`
- Unknown runtime keys are never enumerated directly into the backpack.
- Only known prepared-medicine definitions and known non-grain trade-good definitions are projected.
- `icon` is `null` unless the current content surface already provides a valid item image path
- `actions` is `[]` for prepared medicine and trade goods in this batch
- Top-level filters remain exactly: `all`, `equipment`, `food`, `other`
- grain-shop stays on `var.player_inventory.grain_dou`
- market-house unified item mutations must not route grain goods into `var.player_inventory.item.*`
- backpack grain still renders one shared row only

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-28`
- Current Focus: `Implementation is complete locally; targeted verification passed, but Vite build is still blocked by sandbox spawn EPERM and git writes remain unavailable for commit/push.`
- Next Step: `Review the diff, push when requested, and close only after remote push succeeds and the blocked build path is rerun or explicitly accepted.`
- Verification: `bundled node .\tools\lint-superpowers-plans.mjs` passed; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs` passed 16/16; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs` passed 3/3; `bundled node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` passed; `bundled node .\node_modules\vite\bin\vite.js build` failed with sandbox `spawn EPERM`.
- Notes: `This plan supersedes docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md. Implementer/reviewer subagent dispatch both failed with external deployment 404, so the controller executed and reviewed the child locally in the current checkout. Keep this child open until review, project-progress sync, structured closeout, and remote push all succeed.`

## Progress Log

- 2026-07-28
  - Summary: `Completed the unified player item inventory migration locally after implementer/reviewer subagent dispatch failed with external deployment 404s; medicine-house and market-house inventory now normalize into var.player_inventory.item.*, backpack projection reads the shared helper, and legacy save quantities are preserved through read-time merge plus write-time normalization.`
  - Verification: `bundled node .\tools\lint-superpowers-plans.mjs` passed; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs` passed 16/16; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs` passed 3/3; `bundled node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json` passed; `bundled node .\node_modules\vite\bin\vite.js build` failed with sandbox `spawn EPERM`.
  - Next: `Review the diff, push when requested, and keep the child completed-but-open until remote push succeeds and the blocked Vite build path is rerun or explicitly accepted.`

- 2026-07-28
  - Summary: `Completed Task 4 by migrating market-house owned-quantity reads plus buy/sell settlement to the shared player-item helper, including legacy-only sell normalization coverage.`
  - Verification: `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory" tests/robustness.test.cjs` passed 2/2.
  - Next: `Record docs, run final verification, and sync governance in Task 5.`

- 2026-07-28
  - Summary: `Completed Task 3 by lowering medicine-house inventory settlement into shared player-item mutations and tightening the prepared-medicine regression around unified persistence.`
  - Verification: `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs` passed 1/1.
  - Next: `Migrate market-house owned quantity reads and writes in Task 4.`

- 2026-07-28
  - Summary: `Completed Task 2 by rewiring backpack projection to read unified player items while filtering unknown legacy runtime keys and preserving the shared single-row grain view.`
  - Verification: `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs` passed 9/9.
  - Next: `Migrate medicine-house settlement to the shared helper in Task 3.`

- 2026-07-28
  - Summary: `Completed Task 1 by adding the shared player-item runtime helper with typed mutations, read-time legacy merge, write-time normalization, and focused helper coverage.`
  - Verification: `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "player item helper" tests/unified-backpack-inventory.test.cjs` passed 3/3.
  - Next: `Rewire backpack projection to read the new helper in Task 2.`

- 2026-07-28
  - Summary: `Created the superseding unified player item inventory migration plan from the approved read-merge/write-normalize design.`
  - Verification: `bundled node .\tools\lint-superpowers-plans.mjs`
  - Next: `Wait for the user to choose Subagent-Driven or Inline execution, then start Task 1.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-unified-player-item-inventory-migration-design.md`
- Superseded implementation plan:
  - `docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `src/application/inventory/item-inventory.ts` currently reads `var.medicine_inventory.*` and `var.trade_inventory.*` directly for shop-item backpack projection.
  - `src/application/medicine-house/medicine-house-mutations.ts` still writes `var.medicine_inventory.<itemId>` inside `applyMedicineHouseOutcome()`.
  - `src/application/house-modules/market-house/market-house-house-module.ts` still reads and writes `var.trade_inventory.<goodsId>` for owned quantities.
  - `src/application/inventory/trade-inventory.ts` already owns grain migration on `var.player_inventory.grain_dou` and must remain the only grain runtime helper in this child.
  - `src/ui/views/inventory/backpack-view.ts` already carries readable labels for `trade` and `prepared-medicine`, so this child should change projection data instead of redesigning the renderer.
  - `The local branch already contains the compatibility-projection diff from the superseded plan; this child replaces that direction and continues from the current working tree.`

## Implementation Scope

### In Scope

- Add `src/application/inventory/player-item-inventory.ts` with the shared runtime-key helper and typed mutation surface.
- Normalize medicine-house prepared medicines onto `var.player_inventory.item.<itemId>`.
- Normalize market-house non-grain buy and sell settlement onto `var.player_inventory.item.<itemId>`.
- Rewire backpack projection to read the shared helper instead of reading legacy medicine/trade keys directly.
- Preserve legacy medicine/trade save data through read-time merge and write-time normalization.
- Extend focused tests for helper semantics, backpack field shape, medicine buy flow, market buy flow, and legacy-only market sell flow.
- Record the runtime-key migration in `docs/change-log.md` and keep governed docs synchronized.

### Still Out Of Scope

- Migrating grain into `var.player_inventory.item.*`.
- Migrating valuables into the new runtime key family.
- Extending `src/core/contracts/effect.ts` in this batch.
- Adding backpack consume, use, or sell actions for prepared medicine and trade goods.
- Converting house modules to `src/core/runtime/runtime-settlement.ts` ownership in this batch.

## File Map

### Existing files to modify

- `src/application/inventory/item-inventory.ts`
  - Remove direct legacy medicine/trade reads in favor of `readPlayerItemQuantity()` while preserving valuables and the shared grain row.
- `src/application/medicine-house/medicine-house-mutations.ts`
  - Rewrite `applyMedicineHouseOutcome()` and `readMedicineInventoryQuantity()` to use shared player-item settlement and normalized reads.
- `src/application/house-modules/market-house/market-house-house-module.ts`
  - Rewrite owned-quantity reads and outcome settlement to use shared player-item helpers for non-grain goods.
- `tests/unified-backpack-inventory.test.cjs`
  - Add helper coverage, migration coverage, and backpack field-shape assertions for projected shop items.
- `tests/robustness.test.cjs`
  - Extend medicine-house and market-house regression flows to prove unified runtime persistence and legacy-key clearing.
- `docs/change-log.md`
  - Record the unified player item runtime key migration and the preserved grain boundary.
- `docs/superpowers/project-progress.md`
  - Keep the canonical owner doc and next action synchronized while this child runs.
- `docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md`
  - Track execution state, checklist progress, and verification for this child.

### Existing files expected to be deleted

- None.

### New files to create

- `src/application/inventory/player-item-inventory.ts`
  - Shared player-item runtime key helper, legacy-read merge logic, and typed mutation settlement helper.

## Verification Plan

- Plan governance:
  - `bundled node .\tools\lint-superpowers-plans.mjs`
- Helper and backpack projection:
  - `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'`
  - `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs`
- Medicine and market regressions:
  - `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'`
  - `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs`
- Production verification:
  - `bundled node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - `bundled node .\node_modules\vite\bin\vite.js build`

### Task 1: Add The Shared Player Item Runtime Helper

**Files:**
- Create: `src/application/inventory/player-item-inventory.ts`
- Modify: `tests/unified-backpack-inventory.test.cjs`
- Read: `src/application/inventory/trade-inventory.ts`
- Read: `src/domain/medicine-house.ts`
- Read: `src/domain/market-house.ts`

**Interfaces:**
- Consumes: `getMedicineInventoryQuantityVariableKey(itemId: string): string`
- Consumes: `getTradeInventoryQuantityVariableKey(goodsId: string): string`
- Produces: `type PlayerItemLegacySource = "medicine-house" | "market-house"`
- Produces: `type PlayerItemQuantityMutation = { itemId: string; delta: number; legacySources?: PlayerItemLegacySource[] }`
- Produces: `getPlayerItemQuantityVariableKey(itemId: string): string`
- Produces: `readPlayerItemQuantity(state: Pick<GameState, "runtime">, itemId: string, legacySources?: PlayerItemLegacySource[]): number`
- Produces: `setPlayerItemQuantity(state: GameState, itemId: string, quantity: number, legacySources?: PlayerItemLegacySource[]): GameState`
- Produces: `mutatePlayerItemQuantity(state: GameState, itemId: string, delta: number, legacySources?: PlayerItemLegacySource[]): GameState`
- Produces: `applyPlayerItemMutations(state: GameState, mutations: readonly PlayerItemQuantityMutation[]): GameState`

- [x] **Step 1: Write the failing helper tests**

Add these tests to `tests/unified-backpack-inventory.test.cjs`:

```js
const {
  applyPlayerItemMutations,
  getPlayerItemQuantityVariableKey,
  readPlayerItemQuantity,
} = require("../.test-dist/application/inventory/player-item-inventory.js");

test("player item helper merges unified and legacy quantities by source", () => {
  const state = {
    runtime: {
      variables: {
        [getPlayerItemQuantityVariableKey("medicine_heal_001")]: 1,
        [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 2,
        [getTradeInventoryQuantityVariableKey("silk")]: 3,
      },
    },
  };

  assert.equal(
    readPlayerItemQuantity(state, "medicine_heal_001", ["medicine-house"]),
    3
  );
  assert.equal(readPlayerItemQuantity(state, "silk", ["market-house"]), 3);
  assert.equal(readPlayerItemQuantity(state, "silk"), 0);
});

test("player item helper writes unified quantities and clears touched legacy keys", () => {
  const state = {
    runtime: {
      variables: {
        [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 2,
        [getTradeInventoryQuantityVariableKey("silk")]: 4,
      },
    },
  };

  const nextState = applyPlayerItemMutations(state, [
    {
      itemId: "medicine_heal_001",
      delta: 1,
      legacySources: ["medicine-house"],
    },
    {
      itemId: "silk",
      delta: -1,
      legacySources: ["market-house"],
    },
  ]);

  assert.equal(
    nextState.runtime.variables[
      getPlayerItemQuantityVariableKey("medicine_heal_001")
    ],
    3
  );
  assert.equal(
    nextState.runtime.variables[
      getMedicineInventoryQuantityVariableKey("medicine_heal_001")
    ],
    0
  );
  assert.equal(
    nextState.runtime.variables[getPlayerItemQuantityVariableKey("silk")],
    3
  );
  assert.equal(
    nextState.runtime.variables[getTradeInventoryQuantityVariableKey("silk")],
    0
  );
});

test("player item helper clamps invalid runtime values to zero", () => {
  const state = {
    runtime: {
      variables: {
        [getPlayerItemQuantityVariableKey("broken")]: -4,
        [getTradeInventoryQuantityVariableKey("broken")]: "oops",
      },
    },
  };

  assert.equal(readPlayerItemQuantity(state, "broken", ["market-house"]), 0);
});
```

- [x] **Step 2: Run the targeted helper tests and confirm the missing helper failure**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "player item helper" tests/unified-backpack-inventory.test.cjs
```

Expected:

- `FAIL` because `.test-dist/application/inventory/player-item-inventory.js` does not exist yet.

- [x] **Step 3: Implement the shared helper**

Create `src/application/inventory/player-item-inventory.ts` with this structure:

```ts
import type { GameState } from "../../domain/game-state";
import { getMedicineInventoryQuantityVariableKey } from "../../domain/medicine-house";
import { getTradeInventoryQuantityVariableKey } from "../../domain/market-house";

export type PlayerItemLegacySource = "medicine-house" | "market-house";

export type PlayerItemQuantityMutation = {
  itemId: string;
  delta: number;
  legacySources?: PlayerItemLegacySource[];
};

const PLAYER_ITEM_KEY_PREFIX = "var.player_inventory.item";

function readNumericVariable(
  state: Pick<GameState, "runtime">,
  key: string
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" && value > 0 ? value : 0;
}

function withNumericVariable(
  state: GameState,
  key: string,
  value: number
): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [key]: Math.max(0, value),
      },
    },
  };
}

function getLegacyKeys(
  itemId: string,
  legacySources: readonly PlayerItemLegacySource[] = []
): string[] {
  return legacySources.map((source) =>
    source === "medicine-house"
      ? getMedicineInventoryQuantityVariableKey(itemId)
      : getTradeInventoryQuantityVariableKey(itemId)
  );
}

export function getPlayerItemQuantityVariableKey(itemId: string): string {
  return `${PLAYER_ITEM_KEY_PREFIX}.${itemId}`;
}

export function readPlayerItemQuantity(
  state: Pick<GameState, "runtime">,
  itemId: string,
  legacySources: PlayerItemLegacySource[] = []
): number {
  return [
    getPlayerItemQuantityVariableKey(itemId),
    ...getLegacyKeys(itemId, legacySources),
  ].reduce((sum, key) => sum + readNumericVariable(state, key), 0);
}

export function setPlayerItemQuantity(
  state: GameState,
  itemId: string,
  quantity: number,
  legacySources: PlayerItemLegacySource[] = []
): GameState {
  let nextState = withNumericVariable(
    state,
    getPlayerItemQuantityVariableKey(itemId),
    Math.max(0, quantity)
  );

  for (const legacyKey of getLegacyKeys(itemId, legacySources)) {
    nextState = withNumericVariable(nextState, legacyKey, 0);
  }

  return nextState;
}

export function mutatePlayerItemQuantity(
  state: GameState,
  itemId: string,
  delta: number,
  legacySources: PlayerItemLegacySource[] = []
): GameState {
  return setPlayerItemQuantity(
    state,
    itemId,
    readPlayerItemQuantity(state, itemId, legacySources) + delta,
    legacySources
  );
}

export function applyPlayerItemMutations(
  state: GameState,
  mutations: readonly PlayerItemQuantityMutation[]
): GameState {
  return mutations.reduce(
    (nextState, mutation) =>
      mutatePlayerItemQuantity(
        nextState,
        mutation.itemId,
        mutation.delta,
        mutation.legacySources ?? []
      ),
    state
  );
}
```

- [x] **Step 4: Run the helper tests again and verify they pass**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "player item helper" tests/unified-backpack-inventory.test.cjs
```

Expected:

- `PASS` for all `player item helper` tests.

- [x] **Step 5: Sync the plan state after Task 1**

Update this plan to:

- mark all Task 1 checkboxes complete
- keep `Execution State.Status` as `running`
- set `Execution State.Current Focus` to `Task 2 rewires backpack projection to the shared helper.`
- set `Execution State.Next Step` to `Execute Task 2 Step 1.`

Append this `Progress Log` entry:

```md
- 2026-07-28
  - Summary: `Added the shared player-item runtime helper with read-time legacy merge and write-time normalization.`
  - Verification: `bundled node --test --test-isolation=none --test-name-pattern "player item helper" tests/unified-backpack-inventory.test.cjs`
  - Next: `Rewire backpack projection to read the new helper in Task 2.`
```

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add tests/unified-backpack-inventory.test.cjs src/application/inventory/player-item-inventory.ts docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md
git commit -m "feat: add unified player item inventory helper"
```

### Task 2: Rewire Backpack Projection To The Shared Helper

**Files:**
- Modify: `src/application/inventory/item-inventory.ts`
- Modify: `tests/unified-backpack-inventory.test.cjs`
- Read: `src/application/inventory/player-item-inventory.ts`
- Read: `src/application/inventory/trade-inventory.ts`
- Read: `src/ui/views/inventory/backpack-view.ts`

**Interfaces:**
- Consumes: `readPlayerItemQuantity(state: Pick<GameState, "runtime">, itemId: string, legacySources?: PlayerItemLegacySource[]): number`
- Produces: `projectBackpackItems(input: { valuableInventory: ValuableItemInventory; gameState: Pick<GameState, "runtime"> }): BackpackItemDefinition[]`
- Produces: prepared-medicine rows with ids `item.medicine.<itemId>`
- Produces: trade-good rows with ids `item.trade.<goodsId>`
- Produces: projected shop rows whose required fields are `id`, `name`, `icon`, `value`, `types`, `count`, `description`, and `actions`

- [x] **Step 1: Write the failing backpack projection tests**

Overwrite the direct legacy-key assumptions in `tests/unified-backpack-inventory.test.cjs` with this coverage:

```js
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");

test("backpack projection reads unified player items and exposes the required shop item fields", () => {
  const items = projectBackpackItems({
    valuableInventory: createValuableInventory(),
    gameState: {
      runtime: {
        variables: {
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 12,
          [getPlayerItemQuantityVariableKey("medicine_heal_001")]: 2,
          [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 1,
          [getPlayerItemQuantityVariableKey("silk")]: 1,
          [getTradeInventoryQuantityVariableKey("silk")]: 2,
          [getTradeInventoryQuantityVariableKey("rice")]: 7,
          "var.medicine_inventory.missing_legacy_id": 5,
          "var.trade_inventory.missing_legacy_id": 4,
        },
      },
    },
  });

  const medicineItem = items.find(
    (item) => item.id === "item.medicine.medicine_heal_001"
  );
  const tradeItem = items.find((item) => item.id === "item.trade.silk");

  assert.equal(items.filter((item) => item.id === "item.grain").length, 1);
  assert.equal(items.some((item) => item.id === "item.trade.rice"), false);
  assert.equal(
    items.some((item) => item.id === "item.medicine.missing_legacy_id"),
    false
  );
  assert.equal(
    items.some((item) => item.id === "item.trade.missing_legacy_id"),
    false
  );

  assert.deepEqual(medicineItem?.types, ["other", "prepared-medicine"]);
  assert.equal(medicineItem?.count, 3);
  assert.equal(medicineItem?.icon, null);
  assert.equal(typeof medicineItem?.name, "string");
  assert.equal(typeof medicineItem?.value, "number");
  assert.equal(typeof medicineItem?.description, "string");
  assert.deepEqual(medicineItem?.actions, []);

  assert.deepEqual(tradeItem?.types, ["other", "trade", "silk"]);
  assert.equal(tradeItem?.count, 3);
  assert.equal(tradeItem?.icon, null);
  assert.equal(typeof tradeItem?.name, "string");
  assert.equal(typeof tradeItem?.value, "number");
  assert.equal(typeof tradeItem?.description, "string");
  assert.deepEqual(tradeItem?.actions, []);
});
```

- [x] **Step 2: Run the projection suite and verify it fails against the direct legacy reads**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "backpack projection reads unified player items" tests/unified-backpack-inventory.test.cjs
```

Expected:

- `FAIL` because `projectPreparedMedicineItems()` and `projectTradeGoods()` still read legacy keys directly instead of merging the unified runtime key.

- [x] **Step 3: Rewire `item-inventory.ts` to use shared player-item reads**

Update `src/application/inventory/item-inventory.ts` like this:

```ts
import { readPlayerItemQuantity } from "./player-item-inventory";
import { readPlayerGrainDou } from "./trade-inventory";

function projectPreparedMedicineItems(
  gameState: Pick<GameState, "runtime">
): BackpackItemDefinition[] {
  return medicineHousePreparedMedicines.flatMap((medicine) => {
    const count = readPlayerItemQuantity(
      gameState as GameState,
      medicine.id,
      ["medicine-house"]
    );
    if (count <= 0) {
      return [];
    }

    const description = describePreparedMedicine(medicine);
    return [
      {
        id: `item.medicine.${medicine.id}`,
        name: medicine.name,
        icon: null,
        value: medicine.price,
        types: ["other", "prepared-medicine"],
        count,
        description,
        detailText: description,
        actions: [],
      },
    ];
  });
}

function projectTradeGoods(
  gameState: Pick<GameState, "runtime">
): BackpackItemDefinition[] {
  return globalGoodsPool.flatMap((goodsDefinition: TradeGoodDefinition) => {
    if (goodsDefinition.shopType === "grain-shop") {
      return [];
    }

    const count = readPlayerItemQuantity(
      gameState as GameState,
      goodsDefinition.id,
      ["market-house"]
    );
    if (count <= 0) {
      return [];
    }

    return [
      {
        id: `item.trade.${goodsDefinition.id}`,
        name: goodsDefinition.name,
        icon: null,
        value: goodsDefinition.basePrice,
        types: compactTypes(["other", "trade", goodsDefinition.category]),
        count,
        description: goodsDefinition.description,
        actions: [],
      },
    ];
  });
}
```

- [x] **Step 4: Run the projection suite again and verify it passes**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs
```

Expected:

- `PASS` for the helper and backpack projection suite, including the unified field-shape test and the one-row grain guard.

- [x] **Step 5: Sync the plan state after Task 2**

Update this plan to:

- mark all Task 2 checkboxes complete
- keep `Execution State.Status` as `running`
- set `Execution State.Current Focus` to `Task 3 migrates medicine-house settlement to the shared helper.`
- set `Execution State.Next Step` to `Execute Task 3 Step 1.`

Append this `Progress Log` entry:

```md
- 2026-07-28
  - Summary: `Rewired backpack projection to read the unified player-item helper while keeping one shared grain row and skipping unknown legacy ids.`
  - Verification: `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs`
  - Next: `Migrate medicine-house settlement to the shared helper in Task 3.`
```

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add src/application/inventory/item-inventory.ts tests/unified-backpack-inventory.test.cjs docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md
git commit -m "feat: project shop items from unified player inventory"
```

### Task 3: Migrate Medicine-House Settlement To Unified Player Items

**Files:**
- Modify: `src/application/medicine-house/medicine-house-mutations.ts`
- Modify: `tests/robustness.test.cjs`
- Read: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- Read: `src/application/inventory/player-item-inventory.ts`

**Interfaces:**
- Consumes: `applyPlayerItemMutations(state: GameState, mutations: readonly PlayerItemQuantityMutation[]): GameState`
- Consumes: `readPlayerItemQuantity(state: Pick<GameState, "runtime">, itemId: string, legacySources?: PlayerItemLegacySource[]): number`
- Produces: `applyMedicineHouseOutcome(state, characterDefinitions, playerCharacterId, houseId, actorId, outcome): MedicineHouseMutationResult`
- Produces: `readMedicineInventoryQuantity(state: GameState, itemId: string): number`

- [x] **Step 1: Tighten the medicine-house regression around the new runtime key**

Update `tests/robustness.test.cjs` inside `test("medicine house heal and buy update fatigue inventory and gold", ...)`:

```js
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");

const goldAfterHeal = getPlayerCharacter(healResult.characterDefinitions).stats.gold;

assert.equal(
  buyResult.gameState.runtime.variables[
    getPlayerItemQuantityVariableKey("medicine_heal_001")
  ],
  1
);
assert.equal(
  buyResult.gameState.runtime.variables[
    getMedicineInventoryQuantityVariableKey("medicine_heal_001")
  ],
  0
);
assert.equal(
  getPlayerCharacter(buyResult.characterDefinitions).stats.gold < goldAfterHeal,
  true
);
assert.equal(
  projectedItems.some(
    (item) => item.id === "item.medicine.medicine_heal_001" && item.count === 1
  ),
  true
);
```

- [x] **Step 2: Run the medicine-house regression and confirm it fails on the old key assertion**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs
```

Expected:

- `FAIL` because `applyMedicineHouseOutcome()` still writes `var.medicine_inventory.<itemId>` directly.

- [x] **Step 3: Lower medicine-house inventory changes into `applyPlayerItemMutations()`**

Update `src/application/medicine-house/medicine-house-mutations.ts` like this:

```ts
import {
  applyPlayerItemMutations,
  readPlayerItemQuantity,
} from "../inventory/player-item-inventory";

export function applyMedicineHouseOutcome(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  houseId: string,
  actorId: string,
  outcome: MedicineHouseActionOutcome
): MedicineHouseMutationResult {
  let nextState = state;
  let nextCharacterDefinitions = characterDefinitions;

  // keep the existing money, relationship, fatigue, skill, and time mutations

  if (outcome.inventoryChange.length > 0) {
    nextState = applyPlayerItemMutations(
      nextState,
      outcome.inventoryChange
        .filter((inventoryChange) => inventoryChange.quantity !== 0)
        .map((inventoryChange) => ({
          itemId: inventoryChange.itemId,
          delta: inventoryChange.quantity,
          legacySources: ["medicine-house"] as const,
        }))
    );
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}

export function readMedicineInventoryQuantity(
  state: GameState,
  itemId: string
): number {
  return readPlayerItemQuantity(state, itemId, ["medicine-house"]);
}
```

- [x] **Step 4: Run the medicine-house regression again and verify it passes**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs
```

Expected:

- `PASS` and the purchased medicine now persists through `var.player_inventory.item.medicine_heal_001` while the touched legacy key is reset to `0`.

- [x] **Step 5: Sync the plan state after Task 3**

Update this plan to:

- mark all Task 3 checkboxes complete
- keep `Execution State.Status` as `running`
- set `Execution State.Current Focus` to `Task 4 migrates market-house ownership checks and settlement to the shared helper.`
- set `Execution State.Next Step` to `Execute Task 4 Step 1.`

Append this `Progress Log` entry:

```md
- 2026-07-28
  - Summary: `Migrated medicine-house prepared medicine settlement to the unified player-item helper and kept the existing buy flow contract intact.`
  - Verification: `bundled node --test --test-isolation=none --test-name-pattern "medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs`
  - Next: `Migrate market-house owned quantity reads and writes in Task 4.`
```

- [ ] **Step 6: Commit Task 3**

Run:

```bash
git add src/application/medicine-house/medicine-house-mutations.ts tests/robustness.test.cjs docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md
git commit -m "feat: migrate medicine inventory to unified player items"
```

### Task 4: Migrate Market-House Buy And Sell To Unified Player Items

**Files:**
- Modify: `src/application/house-modules/market-house/market-house-house-module.ts`
- Modify: `tests/robustness.test.cjs`
- Read: `src/application/inventory/player-item-inventory.ts`
- Read: `src/content/markets/global-goods-pool.ts`

**Interfaces:**
- Consumes: `applyPlayerItemMutations(state: GameState, mutations: readonly PlayerItemQuantityMutation[]): GameState`
- Consumes: `readPlayerItemQuantity(state: Pick<GameState, "runtime">, itemId: string, legacySources?: PlayerItemLegacySource[]): number`
- Produces: `createGoodsSnapshots(state, houseDefinition, cityDefinition, goodsIds, bossFavorability): MarketHouseGoodsSnapshot[]`
- Produces: `createSellableGoodsSnapshots(state, houseDefinition, cityDefinition, bossFavorability): MarketHouseGoodsSnapshot[]`
- Produces: `applyActionOutcome(input, actor, outcome): { state: GameState; characterDefinitions: CharacterDefinition[] }`

- [x] **Step 1: Update the market-house regressions for unified persistence and legacy-only sell migration**

First, tighten the existing buy test in `tests/robustness.test.cjs`:

```js
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");

assert.equal(
  buyResult.gameState.runtime.variables[
    getPlayerItemQuantityVariableKey(goodsId)
  ] > 0,
  true
);
assert.equal(
  buyResult.gameState.runtime.variables[
    getTradeInventoryQuantityVariableKey(goodsId)
  ],
  0
);
```

Then add this new regression:

```js
test("market house can sell legacy-only goods through normalized player item inventory", () => {
  const baseState = createBaseState();
  const state = ensureCityNpcPoolsForCurrentDay(
    {
      ...baseState,
      runtime: {
        ...baseState.runtime,
        variables: {
          ...baseState.runtime.variables,
          [getTradeInventoryQuantityVariableKey("silk")]: 2,
        },
      },
    },
    prototypeCityNpcPools,
    () => 0.1
  );
  const playerGoldBefore = 120;
  const richCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: playerGoldBefore,
          },
        }
  );

  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: richCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  const sellOverlay = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "sell-goods",
    },
  });

  assert.equal(sellOverlay.sessionState?.overlay?.type, "market-trade");
  if (sellOverlay.sessionState?.overlay?.type !== "market-trade") {
    return;
  }

  assert.equal(sellOverlay.sessionState.overlay.mode, "sell");
  assert.equal(sellOverlay.sessionState.overlay.selectedGoodsId, "silk");

  const sellResult = marketHouseHouseModule.dispatch({
    gameState: sellOverlay.gameState,
    characterDefinitions: sellOverlay.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: sellOverlay.sessionState,
    request: {
      type: "action",
      actionId: "confirm-trade",
    },
  });

  assert.equal(
    sellResult.gameState.runtime.variables[
      getTradeInventoryQuantityVariableKey("silk")
    ],
    0
  );
  assert.equal(
    sellResult.gameState.runtime.variables[
      getPlayerItemQuantityVariableKey("silk")
    ],
    1
  );
  assert.equal(
    getPlayerCharacter(sellResult.characterDefinitions).stats.gold > playerGoldBefore,
    true
  );

  const projectedItems = projectBackpackItems({
    valuableInventory: sellResult.gameState.valuables,
    gameState: sellResult.gameState,
  });

  assert.equal(
    projectedItems.some((item) => item.id === "item.trade.silk" && item.count === 1),
    true
  );
});
```

- [x] **Step 2: Run the market-house regressions and confirm the sell flow fails before the migration**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory" tests/robustness.test.cjs
```

Expected:

- `FAIL` because owned-quantity reads and `applyActionOutcome()` still use `var.trade_inventory.<goodsId>` directly.

- [x] **Step 3: Rewire market-house owned-quantity reads and settlement**

Update `src/application/house-modules/market-house/market-house-house-module.ts` like this:

```ts
import {
  applyPlayerItemMutations,
  readPlayerItemQuantity,
} from "../../inventory/player-item-inventory";

function readOwnedMarketGoodsQuantity(
  state: GameState,
  goodsId: string
): number {
  return readPlayerItemQuantity(state, goodsId, ["market-house"]);
}

function createGoodsSnapshots(
  state: GameState,
  houseDefinition: HouseDefinition,
  cityDefinition: CityDefinition,
  goodsIds: string[],
  bossFavorability: number
): MarketHouseGoodsSnapshot[] {
  const cityEntries = collectCityMarketEntries(state, cityDefinition);

  return goodsIds
    .map((goodsId) => {
      const matchedEntry = cityEntries.find(({ entry }) => entry.goodsId === goodsId);
      if (matchedEntry == null) {
        return null;
      }

      const adjustedBuyPrice = adjustBuyPrice(matchedEntry.entry.buyPrice, bossFavorability);

      return {
        entry: matchedEntry.entry,
        goodDefinition: matchedEntry.goodDefinition,
        stockQuantity: readNumericVariable(
          state,
          getMarketHouseStockVariableKey(houseDefinition.id, goodsId),
          0
        ),
        ownedQuantity: readOwnedMarketGoodsQuantity(state, goodsId),
        adjustedBuyPrice,
        adjustedSellPrice: adjustSellPrice(
          matchedEntry.entry.sellPrice,
          adjustedBuyPrice,
          bossFavorability
        ),
      };
    })
    .filter((snapshot): snapshot is MarketHouseGoodsSnapshot => snapshot != null);
}

function createSellableGoodsSnapshots(
  state: GameState,
  houseDefinition: HouseDefinition,
  cityDefinition: CityDefinition,
  bossFavorability: number
): MarketHouseGoodsSnapshot[] {
  const cityEntries = collectCityMarketEntries(state, cityDefinition);

  return cityEntries
    .map(({ entry, goodDefinition }) => {
      const ownedQuantity = readOwnedMarketGoodsQuantity(state, entry.goodsId);
      if (ownedQuantity <= 0) {
        return null;
      }

      const adjustedBuyPrice = adjustBuyPrice(entry.buyPrice, bossFavorability);
      return {
        entry,
        goodDefinition,
        stockQuantity: readNumericVariable(
          state,
          getMarketHouseStockVariableKey(houseDefinition.id, entry.goodsId),
          0
        ),
        ownedQuantity,
        adjustedBuyPrice,
        adjustedSellPrice: adjustSellPrice(entry.sellPrice, adjustedBuyPrice, bossFavorability),
      };
    })
    .filter((snapshot): snapshot is MarketHouseGoodsSnapshot => snapshot != null);
}

function applyActionOutcome(
  input: Pick<
    HouseModuleDispatchInput<"market-house">,
    "gameState" | "characterDefinitions" | "playerCharacterId" | "houseDefinition"
  >,
  actor: MarketHouseActor,
  outcome: MarketHouseActionOutcome
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
} {
  let nextState = input.gameState;
  let nextCharacterDefinitions = input.characterDefinitions;

  const goldMutation = mutatePlayerGold(
    nextState,
    nextCharacterDefinitions,
    input.playerCharacterId,
    outcome.moneyChange
  );
  nextState = goldMutation.state;
  nextCharacterDefinitions = goldMutation.characterDefinitions;

  if (outcome.inventoryChange.length > 0) {
    nextState = applyPlayerItemMutations(
      nextState,
      outcome.inventoryChange
        .filter((change) => change.quantity !== 0)
        .map((change) => ({
          itemId: change.goodsId,
          delta: change.quantity,
          legacySources: ["market-house"] as const,
        }))
    );
  }

  outcome.inventoryChange.forEach((change) => {
    if (change.quantity > 0) {
      nextState = mutateHouseStock(nextState, input.houseDefinition.id, change.goodsId, -change.quantity);
      return;
    }

    if (change.quantity < 0) {
      nextState = mutateHouseStock(nextState, input.houseDefinition.id, change.goodsId, -change.quantity);
    }
  });

  if (outcome.relationshipChange !== 0) {
    nextState = mutateActorFavorability(
      nextState,
      input.houseDefinition.id,
      actor.id,
      actor.favorability,
      outcome.relationshipChange
    );
  }

  return {
    state: increaseMarketHouseTime(nextState, input.houseDefinition.id, outcome.timeCost),
    characterDefinitions: nextCharacterDefinitions,
  };
}
```

- [x] **Step 4: Run the market-house regressions again and verify they pass**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory" tests/robustness.test.cjs
```

Expected:

- `PASS` and both buy and sell now persist through `var.player_inventory.item.<goodsId>` while touched `var.trade_inventory.<goodsId>` keys are reset to `0`.

- [x] **Step 5: Sync the plan state after Task 4**

Update this plan to:

- mark all Task 4 checkboxes complete
- keep `Execution State.Status` as `running`
- set `Execution State.Current Focus` to `Task 5 records docs, final verification, and governance sync.`
- set `Execution State.Next Step` to `Execute Task 5 Step 1.`

Append this `Progress Log` entry:

```md
- 2026-07-28
  - Summary: `Migrated market-house buy and sell ownership checks plus settlement to the unified player-item helper, including legacy-only sell migration on first touch.`
  - Verification: `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory" tests/robustness.test.cjs`
  - Next: `Record docs, run final verification, and sync governance in Task 5.`
```

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add src/application/house-modules/market-house/market-house-house-module.ts tests/robustness.test.cjs docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md
git commit -m "feat: migrate market goods to unified player items"
```

### Task 5: Record Docs, Verification, And Governance State

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md`

**Interfaces:**
- Consumes: completed Tasks 1 through 4
- Produces: `docs/change-log.md` entry for unified player-item runtime ownership
- Produces: plan `Execution State` updated to `completed-but-open` after implementation and verification
- Produces: plan `Progress Log` entry recording final verification and the next review/push action
- Produces: `docs/superpowers/project-progress.md` synchronized to this child as the canonical owner doc

- [x] **Step 1: Add the change-log entry**

Append this entry to `docs/change-log.md`:

```md
- 2026-07-28
  - Unified medicine-house prepared medicines and market-house non-grain goods now persist through `var.player_inventory.item.<itemId>`.
  - Legacy `var.medicine_inventory.<itemId>` and `var.trade_inventory.<goodsId>` values are merged on read and normalized into the new key on first touch.
  - Backpack projection now reads the shared player-item helper, while grain remains on `var.player_inventory.grain_dou`.
```

- [x] **Step 2: Run the full verification stack**

Run:

```powershell
$node = 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\tools\lint-superpowers-plans.mjs'
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs
& $node '.\node_modules\typescript\bin\tsc' -p tsconfig.test.json
Set-Content -Path '.test-dist\package.json' -Value '{"type":"commonjs"}'
& $node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|market house can sell legacy-only goods through normalized player item inventory|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs
& $node '.\node_modules\typescript\bin\tsc' --noEmit -p tsconfig.json
& $node '.\node_modules\vite\bin\vite.js' build
```

Expected:

- `PASS` for plan lint, test-dist compile, unified backpack tests, targeted robustness regressions, typecheck, and build.

- [x] **Step 3: Record the verification and sync governance**

Update this plan's `Execution State` to:

- Status: `completed-but-open`
- Last Updated: `2026-07-28`
- Current Focus: `Implementation is complete locally; waiting for review and push or for the exact blocked verification note if build cannot run in this environment.`
- Next Step: `Review the diff, push when requested, and close only after remote push succeeds.`
- Verification: `Copy the exact commands and outcomes from Step 2. If Vite still fails with spawn EPERM, record that exact failure string here and keep the child completed-but-open.`
- Notes: `Do not mark this child closed until project-progress sync, structured closeout, and remote push all succeed.`

Append this `Progress Log` entry:

```md
- 2026-07-28
  - Summary: `Completed the unified player item inventory migration for medicine-house and market-house settlement plus backpack projection.`
  - Verification: `Copy the exact commands and outcomes from Task 5 Step 2.`
  - Next: `Review the diff, push when requested, and close the child only after remote push succeeds.`
```

Update `docs/superpowers/project-progress.md` current state to:

```md
- Current Stage: `House Local Gameplay`
- Current Stage Status: `running`
- Current Task: `Unified Player Item Inventory Migration`
- Current Task Status: `running`
- Current Child: `Unified Player Item Inventory Migration`
- Current Child Status: `completed-but-open`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-unified-player-item-inventory-migration`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md and the current diff.`
```

- [ ] **Step 4: Commit Task 5**

Run:

```bash
git add docs/change-log.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md
git commit -m "docs: record unified player item inventory migration"
```

## Exit Check

- [x] `src/application/inventory/player-item-inventory.ts` owns unified non-grain player-item reads, writes, and typed mutations.
- [x] Medicine-house prepared medicine now persists through `var.player_inventory.item.<itemId>` and clears touched `var.medicine_inventory.<itemId>`.
- [x] Market-house buy and sell now read and write normalized unified item quantities and clear touched `var.trade_inventory.<goodsId>`.
- [x] Grain still uses `var.player_inventory.grain_dou` and backpack still renders one shared grain row.
- [x] Backpack shop rows come from shared reads and include `id`, `name`, `icon`, `value`, `types`, `count`, `description`, and `actions`.
- [x] No new medicine-house, grain-shop, or market-house business branches were added to `src/main.ts`.
- [x] `docs/superpowers/project-progress.md` and this child plan both record the same current owner doc and next action.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] `docs/superpowers/project-progress.md` updated
- [x] Verification recorded
- [x] Child remains `completed-but-open` until push succeeds and closeout data is complete
