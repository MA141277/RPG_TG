# Shop Purchase Backpack Projection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make medicine-house prepared medicines and shop trade goods appear in the existing unified backpack while preserving current purchase settlement logic, current runtime keys, and the current single-row shared grain behavior.

**Architecture:** Extend the compatibility-first backpack projection in `src/application/inventory/item-inventory.ts` so it reads known medicine inventory definitions and known trade-good definitions in addition to legacy valuables and shared grain. Keep house modules and purchase mutations on their current runtime ownership paths, then lock the behavior with focused inventory tests plus end-to-end shop regression assertions; only the backpack label map and regression coverage should change outside the projection layer.

**Tech Stack:** TypeScript, Vite, Node test runner, existing backpack overlay renderer, existing house module regressions in `tests/robustness.test.cjs`, `npm run build:test`, `node --test --test-isolation=none`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Global Constraints

- Keep existing shop purchase settlement logic unchanged.
- Keep shared grain backed by `var.player_inventory.grain_dou` and render it as one shared grain row.
- Keep prepared medicine backed by `var.medicine_inventory.<itemId>`.
- Keep shop trade goods backed by `var.trade_inventory.<goodsId>`.
- Do not split grain into separate visible rows for rice / wheat / salt / soybean / millet in this batch.
- Do not add backpack settlement actions for prepared medicine or trade goods in this batch.
- Keep the current top-level backpack filters exactly as `all`, `equipment`, `food`, and `other`.
- Unknown runtime inventory ids must be skipped safely instead of crashing backpack rendering.
- Zero or negative owned quantity must not produce a visible backpack row.
- Do not add house-specific business branches to `src/main.ts`.
- Update `docs/change-log.md` when the implementation lands.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-28`
- Current Focus: `Historical compatibility-projection implementation remains in the local diff; further work now follows the superseding unified player item inventory migration plan.`
- Next Step: `Do not resume this child directly; open docs/superpowers/project-progress.md and continue with docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md.`
- Verification: `bundled node .\tools\lint-superpowers-plans.mjs`; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs`; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs`; `bundled node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `bundled node .\node_modules\vite\bin\vite.js build` blocked by sandbox `spawn EPERM`, and escalation could not proceed because the approval/deployment path returned 404.`
- Notes: `Superseded by docs/superpowers/specs/2026-07-28-unified-player-item-inventory-migration-design.md and docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md. Git commit/push remain pending because the current environment cannot complete .git write approvals while the approval path is failing.`

## Progress Log

- 2026-07-28
  - Summary: `Created the implementation plan for projecting shop-purchased goods into the unified backpack without migrating the underlying runtime inventory ownership.`
  - Verification: `node tools/lint-superpowers-plans.mjs`
  - Next: `Wait for the user to choose Subagent-Driven or Inline execution.`
- 2026-07-28
  - Summary: `Projected prepared medicine and shop trade goods into the unified backpack, added readable backpack labels, and extended shop regressions so successful medicine-house and market-house purchases now prove backpack visibility.`
  - Verification: `bundled node .\tools\lint-superpowers-plans.mjs`; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs`; `bundled node .\node_modules\typescript\bin\tsc -p tsconfig.test.json` + `Set-Content .test-dist\package.json {"type":"commonjs"}` + `bundled node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs`; `bundled node .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `bundled node .\node_modules\vite\bin\vite.js build` blocked by sandbox `spawn EPERM`, and escalation could not proceed because the approval/deployment path returned 404.
  - Next: `Rerun the unsandboxed build when approval works, then review the diff, push if requested, and close or continue the backpack child.`
- 2026-07-28
  - Summary: `Marked this compatibility-only child as superseded after the approved unified player item inventory migration design replaced the projection-only direction.`
  - Verification: `bundled node .\tools\lint-superpowers-plans.mjs`
  - Next: `Use docs/superpowers/plans/2026-07-28-unified-player-item-inventory-migration-plan.md for all further work on this feature line.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-shop-purchase-backpack-projection-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `src/application/inventory/item-inventory.ts` currently projects only legacy valuables plus the shared grain row.
  - `src/application/inventory/trade-inventory.ts` already owns the shared grain path and must remain the only visible grain row owner.
  - `src/application/medicine-house/medicine-house-mutations.ts` already writes prepared medicine counts to `var.medicine_inventory.*` and should not be rewritten in this child.
  - `src/application/house-modules/market-house/market-house-house-module.ts` already writes purchased trade goods to `var.trade_inventory.*` and should not be rewritten in this child.
  - `src/application/app-actions.ts` and `src/ui/app-render.ts` already consume `projectBackpackItems`, so no new overlay wiring should be needed if the projection contract is extended correctly.
  - `docs/superpowers/project-progress.md` still points to `docs/superpowers/plans/2026-07-28-tavern-short-gamble-plan.md`; this new child stays `waiting` until execution choice and governance promotion.

## Implementation Scope

### In Scope

- Extend unified backpack projection to include known prepared medicines from medicine house inventory.
- Extend unified backpack projection to include known non-grain trade goods from shop trade inventory.
- Preserve the existing single shared grain row.
- Keep newly projected medicine/trade rows visible through the current backpack list and detail panel.
- Keep medicine/trade rows under the existing `other` filter.
- Add focused tests for projection safety, readable labels, and shop-to-backpack regression coverage.
- Update `docs/change-log.md` plus child governance fields after implementation.

### Still Out Of Scope

- Introducing a new shared player item runtime such as `player_inventory.items.*`.
- Consuming medicine from the backpack.
- Selling trade goods from the backpack.
- Adding a dedicated medicine filter or redesigning the backpack layout.
- Splitting grain into separate trade-good rows.
- Changing house purchase mutation logic beyond what current regressions already exercise.

## File Map

### Existing files to modify

- `src/application/inventory/item-inventory.ts`
  - Extend compatibility projection to include prepared medicine and trade goods while preserving valuables plus shared grain.
- `src/ui/views/inventory/backpack-view.ts`
  - Add readable type labels for newly projected medicine/trade rows.
- `tests/unified-backpack-inventory.test.cjs`
  - Lock medicine/trade projection, grain preservation, and safe skipping of stale ids.
- `tests/backpack-ui-contract.test.cjs`
  - Lock readable labels and actionless rendering for projected shop items.
- `tests/robustness.test.cjs`
  - Extend current medicine-house and market-house purchase regressions so successful purchase also implies backpack visibility.
- `docs/change-log.md`
  - Record the new backpack projection behavior.
- `docs/superpowers/project-progress.md`
  - Promote this child when execution starts and sync the canonical owner document while the child is active.
- `docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md`
  - Keep task checkboxes, execution state, and progress log updated during execution.

### Existing files expected to be deleted

- None.

### New files to create

- None.

## Verification Plan

- Targeted projection and UI verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`
- Targeted shop regression verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
- Optional broad verification:
  - `npm test`
- Codex sandbox note:
  - `If the Windows sandbox blocks node subprocess spawning, keep node invocations on --test-isolation=none after npm run build:test so the targeted suites run in-process.`

## Task 1: Extend Backpack Projection For Prepared Medicine And Trade Goods

**Files:**
- Modify: `docs/superpowers/project-progress.md`
- Modify: `src/application/inventory/item-inventory.ts`
- Modify: `tests/unified-backpack-inventory.test.cjs`
- Read: `src/content/houses/medicine-house-content.ts`
- Read: `src/content/markets/global-goods-pool.ts`
- Read: `src/domain/medicine-house.ts`
- Read: `src/domain/market-house.ts`
- Modify: `docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md`

**Interfaces:**
- Consumes: `medicineHousePreparedMedicines: MedicineHousePreparedMedicineDefinition[]`
- Consumes: `globalGoodsPool: TradeGoodDefinition[]`
- Consumes: `getMedicineInventoryQuantityVariableKey(itemId: string): string`
- Consumes: `getTradeInventoryQuantityVariableKey(goodsId: string): string`
- Produces: `projectBackpackItems(input: { valuableInventory: ValuableItemInventory; gameState: Pick<GameState, "runtime"> }): BackpackItemDefinition[]`
- Produces: projected medicine item ids shaped as `item.medicine.<itemId>`
- Produces: projected trade item ids shaped as `item.trade.<goodsId>`
- Produces: prepared medicine row types `["other", "prepared-medicine"]`
- Produces: trade-good row types `["other", "trade", goods.category]`

- [x] **Step 1: Promote this plan into the canonical progress entry before code changes start**

Update `docs/superpowers/project-progress.md` so execution resumes from this child instead of the unrelated tavern child. Replace the `Current State` block with:

```md
- Current Stage: `House Local Gameplay`
- Current Stage Status: `running`
- Current Task: `Shop Purchase Backpack Projection`
- Current Task Status: `running`
- Current Child: `Shop Purchase Backpack Projection`
- Current Child Status: `running`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `execute-shop-purchase-backpack-projection-task-1`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md`
- Last Closed Item: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then execute docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md from Task 1.`
```

- [x] **Step 2: Write the failing backpack projection tests**

Extend `tests/unified-backpack-inventory.test.cjs` imports:

```js
const {
  getMedicineInventoryQuantityVariableKey,
} = require("../.test-dist/domain/medicine-house.js");
const {
  getTradeInventoryQuantityVariableKey,
} = require("../.test-dist/domain/market-house.js");
```

Add these tests:

```js
test("projects prepared medicine and trade goods into unified backpack rows", () => {
  const items = projectBackpackItems({
    valuableInventory: createValuableInventory(),
    gameState: {
      runtime: {
        variables: {
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 0,
          [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 2,
          [getTradeInventoryQuantityVariableKey("silk")]: 3,
        },
      },
    },
  });

  assert.deepEqual(
    items
      .filter(
        (item) =>
          item.id === "item.medicine.medicine_heal_001" ||
          item.id === "item.trade.silk"
      )
      .map((item) => ({
        id: item.id,
        types: item.types,
        count: item.count,
      })),
    [
      {
        id: "item.medicine.medicine_heal_001",
        types: ["other", "prepared-medicine"],
        count: 2,
      },
      {
        id: "item.trade.silk",
        types: ["other", "trade", "silk"],
        count: 3,
      },
    ]
  );
});

test("backpack projection keeps shared grain as one row and skips stale unknown shop ids", () => {
  const items = projectBackpackItems({
    valuableInventory: createValuableInventory(),
    gameState: {
      runtime: {
        variables: {
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 12,
          [getMedicineInventoryQuantityVariableKey("medicine_heal_001")]: 1,
          [getTradeInventoryQuantityVariableKey("silk")]: 2,
          [getTradeInventoryQuantityVariableKey("rice")]: 7,
          "var.medicine_inventory.missing_legacy_id": 5,
          "var.trade_inventory.missing_legacy_id": 4,
        },
      },
    },
  });

  assert.equal(items.some((item) => item.id === "item.grain"), true);
  assert.equal(
    items.some((item) => item.id === "item.medicine.missing_legacy_id"),
    false
  );
  assert.equal(
    items.some((item) => item.id === "item.trade.missing_legacy_id"),
    false
  );
  assert.equal(items.some((item) => item.id === "item.trade.rice"), false);
  assert.equal(
    items.some((item) => item.id === "item.medicine.medicine_heal_001"),
    true
  );
  assert.equal(items.some((item) => item.id === "item.trade.silk"), true);
});
```

- [x] **Step 3: Run the projection tests to verify RED**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs }
```

Expected:

- `FAIL` because `projectBackpackItems()` still returns only valuables plus the shared grain row and does not produce `item.medicine.medicine_heal_001` or `item.trade.silk`.

- [x] **Step 4: Implement the minimal projection changes**

In `src/application/inventory/item-inventory.ts`, add the new imports:

```ts
import { medicineHousePreparedMedicines } from "../../content/houses/medicine-house-content";
import type { MedicineHousePreparedMedicineDefinition } from "../../content/houses/medicine-house-content";
import { globalGoodsPool } from "../../content/markets/global-goods-pool";
import {
  getMedicineInventoryQuantityVariableKey,
} from "../../domain/medicine-house";
import { getTradeInventoryQuantityVariableKey } from "../../domain/market-house";
import type { TradeGoodDefinition } from "../../domain/trade-good";
```

Add these helpers above `projectBackpackItems`:

```ts
function readRuntimeQuantity(
  gameState: Pick<GameState, "runtime">,
  key: string
): number {
  const value = gameState.runtime.variables[key];
  return typeof value === "number" ? value : 0;
}

function describePreparedMedicine(
  medicine: MedicineHousePreparedMedicineDefinition
): string {
  const parts: string[] = [];
  if (typeof medicine.effect.hp === "number" && medicine.effect.hp > 0) {
    parts.push(`Restore ${medicine.effect.hp} HP`);
  }
  if (
    typeof medicine.effect.fatigue === "number" &&
    medicine.effect.fatigue > 0
  ) {
    parts.push(`Restore ${medicine.effect.fatigue} fatigue`);
  }
  if (typeof medicine.effect.poison === "number" && medicine.effect.poison < 0) {
    parts.push(`Cure ${Math.abs(medicine.effect.poison)} poison`);
  }
  return parts.join("; ") || "Prepared medicine.";
}

function projectPreparedMedicineItems(
  gameState: Pick<GameState, "runtime">
): BackpackItemDefinition[] {
  return medicineHousePreparedMedicines.flatMap((medicine) => {
    const count = readRuntimeQuantity(
      gameState,
      getMedicineInventoryQuantityVariableKey(medicine.id)
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

    const count = readRuntimeQuantity(
      gameState,
      getTradeInventoryQuantityVariableKey(goodsDefinition.id)
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

Replace `projectBackpackItems()` with:

```ts
export function projectBackpackItems(
  input: ProjectBackpackItemsInput
): BackpackItemDefinition[] {
  const grainItem = projectGrainItem(input.gameState);
  return [
    ...input.valuableInventory.items.map(projectValuableItem),
    ...(grainItem == null ? [] : [grainItem]),
    ...projectPreparedMedicineItems(input.gameState),
    ...projectTradeGoods(input.gameState),
  ];
}
```

- [x] **Step 5: Run the projection tests to verify GREEN**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs }
```

Expected:

- `PASS` with the new prepared-medicine/trade projection tests green and the existing valuables/grain tests still green.

- [ ] **Step 6: Commit the projection task**

Run:

```bash
git add docs/superpowers/project-progress.md src/application/inventory/item-inventory.ts tests/unified-backpack-inventory.test.cjs docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md
git commit -m "feat: project shop goods into backpack"
```

## Task 2: Add Readable Labels And Shop-To-Backpack Regressions

**Files:**
- Modify: `src/ui/views/inventory/backpack-view.ts`
- Modify: `tests/backpack-ui-contract.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Read: `src/application/house-modules/market-house/market-house-house-module.ts`
- Read: `src/application/house-modules/medicine-house/medicine-house-house-module.ts`

**Interfaces:**
- Consumes: projected prepared-medicine row ids shaped as `item.medicine.<itemId>`
- Consumes: projected trade-good row ids shaped as `item.trade.<goodsId>`
- Consumes: row types `["other", "prepared-medicine"]`
- Consumes: row types `["other", "trade", goods.category]`
- Produces: readable backpack type labels for `prepared-medicine`, `trade`, `medicine`, `silk`, `arms`, `horses`, and `special`
- Produces: medicine-house and market-house regressions that prove purchased items are visible through `projectBackpackItems()`

- [x] **Step 1: Write the failing UI-contract and shop regression tests**

Extend `tests/backpack-ui-contract.test.cjs` with:

```js
test("backpack view renders readable labels for projected shop items without action buttons", () => {
  const html = renderBackpackView({
    filter: "other",
    selectedItemId: "item.trade.silk",
    items: [
      {
        id: "item.trade.silk",
        name: "Silk",
        icon: null,
        value: 450,
        types: ["other", "trade", "silk"],
        count: 2,
        description: "Market good shown through the backpack projection.",
        actions: [],
      },
      {
        id: "item.medicine.medicine_heal_001",
        name: "Bandage",
        icon: null,
        value: 80,
        types: ["other", "prepared-medicine"],
        count: 1,
        description: "Prepared medicine shown through the backpack projection.",
        actions: [],
      },
    ],
  });

  assert.match(html, />\\s*商货\\s*</);
  assert.match(html, />\\s*丝绸\\s*</);
  assert.match(html, />\\s*成药\\s*</);
  assert.doesNotMatch(html, />\\s*trade\\s*</);
  assert.doesNotMatch(html, />\\s*prepared-medicine\\s*</);
  assert.doesNotMatch(html, /data-item-action-id=/);
});
```

Extend `tests/robustness.test.cjs` imports:

```js
const {
  projectBackpackItems,
} = require("../.test-dist/application/inventory/item-inventory.js");
```

Extend the existing market-house buy-flow test after the `var.trade_inventory.${goodsId}` assertion:

```js
const projectedItems = projectBackpackItems({
  valuableInventory: buyResult.gameState.valuables,
  gameState: buyResult.gameState,
});

assert.equal(
  projectedItems.some(
    (item) => item.id === `item.trade.${goodsId}` && item.count > 0
  ),
  true
);
```

Extend the existing medicine-house buy test after the `var.medicine_inventory.medicine_heal_001` assertion:

```js
const projectedItems = projectBackpackItems({
  valuableInventory: buyResult.gameState.valuables,
  gameState: buyResult.gameState,
});

assert.equal(
  projectedItems.some(
    (item) =>
      item.id === "item.medicine.medicine_heal_001" && item.count === 1
  ),
  true
);
```

- [x] **Step 2: Run the targeted tests to verify RED**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/backpack-ui-contract.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because the backpack label map does not yet render readable labels for `trade` / `prepared-medicine` / `silk`, and the existing shop regressions do not yet prove projected backpack visibility.

- [x] **Step 3: Implement the readable labels and regression glue**

In `src/ui/views/inventory/backpack-view.ts`, extend `BACKPACK_TYPE_LABELS`:

```ts
const BACKPACK_TYPE_LABELS: Record<string, string> = {
  equipment: "装备",
  weapon: "武器",
  armor: "防具",
  food: "食物",
  grain: "粮食",
  other: "其他",
  "prepared-medicine": "成药",
  trade: "商货",
  medicine: "药材",
  silk: "丝绸",
  arms: "军资",
  horses: "坐骑",
  special: "奇货",
};
```

In `tests/robustness.test.cjs`, add the new `projectBackpackItems` import and keep the new assertions inside the existing market-house and medicine-house purchase tests exactly as written in Step 1. Do not create a second copy of those flows.

- [x] **Step 4: Run the targeted tests to verify GREEN**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs }
```

Expected:

- `PASS` for the updated backpack UI contract tests.
- `PASS` for the targeted market-house and medicine-house purchase regressions.
- `PASS` for the unified-backpack projection suite after the UI-label changes.

- [ ] **Step 5: Commit the label and regression task**

Run:

```bash
git add src/ui/views/inventory/backpack-view.ts tests/backpack-ui-contract.test.cjs tests/robustness.test.cjs
git commit -m "test: cover shop goods in backpack"
```

## Task 3: Sync Docs, Verification, And Governance State

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md`

**Interfaces:**
- Consumes: completed projection behavior from Tasks 1 and 2
- Produces: `docs/change-log.md` entry recording shop goods backpack projection
- Produces: plan `Execution State` updated to `completed-but-open` after implementation and verification
- Produces: plan `Progress Log` entry recording verification commands and next action
- Produces: `docs/superpowers/project-progress.md` synchronized to this child's latest state

- [x] **Step 1: Update changelog and governance docs**

Add this changelog bullet to `docs/change-log.md` in the newest-entry section:

```md
- 统一背包现在会投影药铺成药和商铺商货：`var.medicine_inventory.*` 与已知非粮食 `var.trade_inventory.*` 正数库存会显示在同一背包里；共享粮食仍保持单行显示，不拆成商品明细，也不改变现有购买结算逻辑。
```

Update this plan's `Execution State` to:

```md
- Status: `completed-but-open`
- Last Updated: `2026-07-28`
- Current Focus: `Implementation complete; awaiting review/push/closeout.`
- Next Step: `Review the diff, push if requested, then close or continue the backpack child.`
- Verification: `Record the exact commands from Step 2.`
- Notes: `Keep the child open until push/closeout rules are satisfied.`
```

Append this plan `Progress Log` entry:

```md
- 2026-07-28
  - Summary: `Projected prepared medicine and shop trade goods into the unified backpack while preserving the shared grain row and existing shop settlement keys.`
  - Verification: `Record the exact commands from Step 2.`
  - Next: `Review diff, push if requested, then close or continue the backpack child.`
```

Update `docs/superpowers/project-progress.md` with:

```md
- Current Stage: `House Local Gameplay`
- Current Stage Status: `running`
- Current Task: `Shop Purchase Backpack Projection`
- Current Task Status: `running`
- Current Child: `Shop Purchase Backpack Projection`
- Current Child Status: `completed-but-open`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-shop-purchase-backpack-projection`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md`
- Last Closed Item: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md and the current diff.`
```

Append this project-progress log entry:

```md
- 2026-07-28
  - Summary: `Projected prepared medicine and shop trade goods into the unified backpack while preserving the existing shop runtime ownership and the shared single-row grain view.`
  - Verification: `node tools/lint-superpowers-plans.mjs`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs }`; `npm run typecheck`; `npm run build`
  - Next: `Review diff, push if requested, then close or continue the backpack child.`
```

- [ ] **Step 2: Run final verification**

Run:

```bash
npm run lint:plans
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house can open trade overlay and execute buy flow|medicine house heal and buy update fatigue inventory and gold" tests/robustness.test.cjs }
npm run typecheck
npm run build
```

Expected:

- `PASS` for `npm run lint:plans`
- `PASS` for the targeted unified-backpack and backpack UI suites
- `PASS` for the targeted market-house and medicine-house regressions
- `PASS` for `npm run typecheck`
- `PASS` for `npm run build`

- [ ] **Step 3: Commit the docs and verification sync**

Run:

```bash
git add docs/change-log.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-28-shop-purchase-backpack-projection-plan.md
git commit -m "docs: record shop backpack projection"
```

## Exit Check

- [x] Purchased prepared medicine appears in the unified backpack.
- [x] Purchased trade goods appear in the unified backpack.
- [x] Shared grain still appears as one row and is not duplicated as trade-good rows.
- [x] Backpack `all / equipment / food / other` filters still behave correctly.
- [x] Unknown runtime inventory ids do not crash backpack projection or rendering.
- [x] Shop regression coverage proves medicine-house and market-house purchases are visible in the backpack.
- [x] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
