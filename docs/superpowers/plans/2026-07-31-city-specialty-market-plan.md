# City Specialty Market Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the current-batch city specialty market to `market-house` through a dedicated settlement-trade runtime, reusable service, and shared mutation applier so supported cities can buy and sell specialty goods without new `src/main.ts` branches or host-owned settlement logic.

**Architecture:** Introduce a new `GameState.runtime.settlementTrade` owner plus a reusable `SettlementTradeService` that resolves supported-city snapshots, investigation summaries, and typed trade mutations from dedicated specialty-goods and city-profile content. Keep `market-house` as the host shell only: it opens a new `settlement-trade` overlay, delegates pricing and trade resolution to the service, applies returned mutations through a shared applier, and removes the legacy piggyback path that currently treats `settlement-trade` as just another random `cityMarkets` shop.

**Tech Stack:** TypeScript, existing house-module contracts, existing unified player item inventory helpers, Node test runner against `.test-dist`, `npm run build:test`, `node --test --test-isolation=none`, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Global Constraints

- Follow `docs/special-house-interface.md`; `market-house` stays the host and must not own specialty settlement rules.
- Do not add new business branches or concrete shop/goods logic to `src/main.ts`.
- Do not reuse `GameState.runtime.cityMarkets["settlement-trade"]` as the city specialty market owner.
- Trade resolution must emit typed settlement-trade mutations and use a shared applier.
- Cover only cities present in `defaultRuntimeContent.cities` in this batch; do not add placeholder unsupported-city rows.
- Keep the ordinary `market-house` random market flow in place for non-specialty goods.
- Do not return HTML from new `application/*` modules.
- Use `var.player_inventory.item.<itemId>` as the persistent player-owned specialty goods path; do not create another player specialty inventory branch.
- Update `docs/special-house-interface.md` and `docs/change-log.md` when the shared interface and host lifecycle wiring lands.

---

## Execution State

- Status: `running`
- Last Updated: `2026-07-31`
- Current Focus: `Task 1 complete; Task 2 trade resolution and mutation-path TDD is next.`
- Next Step: `Write the failing trade-resolution and mutation tests for Task 2, then implement the typed settlement-trade mutation path.`
- Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/settlement-trade-service.test.cjs`
- Notes: `Canonical project-progress now points to this child; Task 1 delivered the dedicated settlementTrade runtime owner, specialty goods/profile content, and snapshot/investigation service only.`

## Progress Log

- 2026-07-31
  - Summary: `Created the city specialty market implementation plan from the approved design spec and locked the file/task decomposition before execution.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for the user to choose Subagent-Driven or Inline execution, then promote this child in docs/superpowers/project-progress.md before code changes start.`
- 2026-07-31
  - Summary: `Completed Task 1 by promoting this child to the canonical progress entry, adding the dedicated settlementTrade runtime/content contracts, and shipping the snapshot/investigation service with focused RED-to-GREEN coverage.`
  - Verification: `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`; `Set-Content -LiteralPath .test-dist\package.json -Value '{"type":"commonjs"}' -NoNewline`; `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test --test-isolation=none tests/settlement-trade-service.test.cjs`
  - Next: `Start Task 2 with failing trade-resolution and mutation tests before adding settlement-trade mutation code.`

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-31-city-specialty-market-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `src/application/house-modules/market-house/market-house-house-module.ts` still owns direct gold, item, and stock settlement for both buy and sell flows.
  - `src/application/house-modules/market-house/market-house-investigation.ts` still reads the draft settlement-trade profiles directly instead of the same resolved runtime snapshot the player trades against.
  - `src/content/markets/settlement-trade-profiles.ts` and `src/content/markets/runtime-trade-goods-pool.ts` still describe the legacy draft bridge that piggybacks on ordinary `cityMarkets`.
  - `AVAILABLE_MARKET_SHOPS` and `MARKET_HOUSE_SOURCE_SHOPS` still include `"settlement-trade"`, which means `market-house` currently treats specialty goods as an ordinary random shop refresh source.
  - `defaultRuntimeContent.cities` is the current runtime truth source for which city ids exist in the loaded pack, so supported specialty coverage must be the intersection of dedicated specialty profiles and that loaded city list.
  - `docs/superpowers/project-progress.md` still points at `docs/superpowers/plans/2026-07-28-campaign-hex-runtime-grid-architecture-plan.md`; this plan remains `waiting` until execution intentionally switches the canonical owner document.

## Implementation Scope

### In Scope

- Add a dedicated `GameState.runtime.settlementTrade` owner for city specialty stock, multiplier, progress, and last-traded day.
- Add dedicated specialty goods and city profile content for the current runtime-supported cities in this batch.
- Implement a reusable `SettlementTradeService` with snapshot, investigation-summary, and trade-resolution APIs.
- Implement a shared `applySettlementTradeMutations()` applier for typed gold, inventory, stock, multiplier, progress, and day writes.
- Extend `market-house` to host a new `settlement-trade` overlay and action flow without owning persistent business rules.
- Make `market-house` investigation dialogue consume the same specialty-market service data path as the actual overlay and trade resolution.
- Add focused service, mutation, host integration, and overlay button-sound tests.
- Update `docs/special-house-interface.md`, `docs/change-log.md`, and governance state after implementation.

### Still Out Of Scope

- Converting `grain-shop` or `medicine-house` onto this subsystem in the same batch.
- Replacing the ordinary `market-house` non-specialty buy/sell flow.
- Rewriting the general `market-refresh-system` or `cityMarkets` refresh semantics.
- Adding a new `Effect` family to `src/core/contracts/effect.ts`.
- Creating a new special house module.
- Expanding specialty coverage beyond cities that actually exist in `defaultRuntimeContent.cities` at execution time.

## File Map

### Existing files to modify

- `src/domain/game-state.ts`
  - Add the dedicated `runtime.settlementTrade` owner.
- `src/application/state/create-initial-state.ts`
  - Initialize the new runtime owner.
- `src/domain/house-module.ts`
  - Add the new `settlement-trade` overlay view model contract.
- `src/domain/house-modules/market-house-session.ts`
  - Add the host-side `settlement-trade` overlay session state.
- `src/application/house-modules/market-house/market-house-house-module.ts`
  - Remove the legacy specialty piggyback from ordinary shop arrays, wire the new action ids, call the service, and apply returned mutations.
- `src/application/house-modules/market-house/market-house-investigation.ts`
  - Rebuild the investigation report from the same service snapshot data path used by the overlay.
- `src/ui/views/house/market-house-view.ts`
  - Render the new `settlement-trade` overlay variant.
- `tests/market-house-investigation.test.cjs`
  - Lock the shared investigation/overlay data path.
- `tests/house-button-sound-policy.test.cjs`
  - Lock button-sound defaults for the new overlay type.
- `tests/robustness.test.cjs`
  - Add the `src/main.ts` no-branch guard for the new host integration.
- `docs/special-house-interface.md`
  - Record the reusable-host boundary for house-owned overlays that delegate typed settlement mutations to a shared mechanism.
- `docs/change-log.md`
  - Record the new city specialty market behavior.
- `docs/superpowers/project-progress.md`
  - Promote this child before implementation and synchronize the completed-but-open state after verification.
- `docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md`
  - Keep execution state, checklist progress, and verification history current during execution.

### Existing files expected to be deleted

- None.

### New files to create

- `src/domain/settlement-trade.ts`
  - Specialty-market domain types for goods ids, tiers, snapshots, mutations, runtime state, and resolutions.
- `src/content/markets/settlement-trade-goods.ts`
  - The dedicated specialty-goods catalog for this mechanism.
- `src/content/markets/settlement-trade-city-profiles.ts`
  - The city specialty profile owner for the current runtime-supported cities in this batch.
- `src/application/markets/settlement-trade-service.ts`
  - Reusable snapshot, investigation, and trade-resolution logic.
- `src/application/markets/apply-settlement-trade-mutations.ts`
  - Shared settlement-trade mutation applier.
- `src/application/house-modules/market-house/market-house-settlement-trade.ts`
  - Host-only mapping helpers that translate service snapshots/resolutions into `market-house` session and overlay state without owning business rules.
- `tests/settlement-trade-service.test.cjs`
  - Focused snapshot and pricing-algorithm coverage.
- `tests/settlement-trade-mutations.test.cjs`
  - Focused applier coverage for gold, inventory, stock, multiplier, progress, and last-traded day writes.
- `tests/market-house-settlement-trade.test.cjs`
  - Focused host open/buy/sell/unsupported-city regression coverage.

## Verification Plan

- Targeted service and mutation verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs tests/settlement-trade-mutations.test.cjs }`
- Targeted host and overlay verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs }`
- Targeted shell guard verification:
  - `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house specialty trade integration keeps src/main.ts free of settlement trade host branches" tests/robustness.test.cjs }`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
- Optional broad verification:
  - `npm test`
- Sandbox note:
  - `If the Windows sandbox blocks subprocess spawning, keep the node test commands on --test-isolation=none after npm run build:test so the focused suites run in-process.`

### Task 1: Establish Specialty Content, Runtime State, and Snapshot Service

**Files:**
- Modify: `docs/superpowers/project-progress.md`
- Create: `src/domain/settlement-trade.ts`
- Create: `src/content/markets/settlement-trade-goods.ts`
- Create: `src/content/markets/settlement-trade-city-profiles.ts`
- Create: `src/application/markets/settlement-trade-service.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Test: `tests/settlement-trade-service.test.cjs`
- Read: `src/content/markets/settlement-trade-profiles.ts`
- Read: `src/application/content/default-runtime-content.ts`

**Interfaces:**
- Consumes: `defaultRuntimeContent.cities: CityDefinition[]`
- Produces: `SettlementTradeGoodId`
- Produces: `SettlementTradeTier`
- Produces: `SettlementTradeGoodDefinition`
- Produces: `SettlementTradeCityProfile`
- Produces: `SettlementTradeRuntimeState`
- Produces: `SettlementTradeSnapshotRow`
- Produces: `SettlementTradeSnapshot = { cityId: CityId; supported: boolean; rows: SettlementTradeSnapshotRow[]; helperLines: string[] }`
- Produces: `SettlementTradeInvestigationSummary = { cityId: CityId; headlineGoodsIds: SettlementTradeGoodId[]; highlightedDestinations: Array<{ cityId: CityId; cityName: string; demandedGoodsIds: SettlementTradeGoodId[] }>; voiceLines: string[] }`
- Produces: `class SettlementTradeService { createSnapshot(input: { state: GameState; cityId: CityId; currentDay: number }): SettlementTradeSnapshot; createInvestigationSummary(input: { state: GameState; cityId: CityId; currentDay: number }): SettlementTradeInvestigationSummary; }`

- [x] **Step 1: Promote this child into the canonical progress entry before code changes start**

Replace the `## Current State` block in `docs/superpowers/project-progress.md` with:

```md
- Current Stage: `House Local Gameplay`
- Current Stage Status: `running`
- Current Task: `City Specialty Market`
- Current Task Status: `running`
- Current Child: `City Specialty Market`
- Current Child Status: `running`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `execute-city-specialty-market-task-1`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md`
- Last Closed Item: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then execute docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md from Task 1.`
```

- [x] **Step 2: Write the failing snapshot and supported-city tests**

Create `tests/settlement-trade-service.test.cjs` with:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  defaultRuntimeContent,
} = require("../.test-dist/application/content/default-runtime-content.js");
const {
  SettlementTradeService,
} = require("../.test-dist/application/markets/settlement-trade-service.js");
const {
  prototypeCards,
  prototypeCities,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

function createBaseState(cityId = "city.yingtian") {
  defaultRuntimeContent.cities = prototypeCities;
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: cityId,
    currentHouseId: null,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((card) => card.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: { swordId: null, armorId: null },
    },
    currentView: "house",
  });
}

test("settlement trade snapshot reads content defaults for supported cities", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });

  assert.equal(snapshot.supported, true);
  assert.equal(snapshot.rows.length > 0, true);
  assert.equal(snapshot.rows.every((row) => row.priceMultiplier === 1), true);
  assert.equal(snapshot.rows.every((row) => row.progressUnits === 0), true);
  assert.equal(snapshot.rows.every((row) => row.daysUntilReset === 30), true);
});

test("settlement trade snapshot rejects cities without a specialty profile", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.unsupported"),
    cityId: "city.unsupported",
    currentDay: 1,
  });

  assert.equal(snapshot.supported, false);
  assert.deepEqual(snapshot.rows, []);
  assert.match(snapshot.helperLines[0] ?? "", /not available/i);
});

test("settlement trade investigation summary is derived from the snapshot rows", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });
  const summary = service.createInvestigationSummary({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });

  assert.equal(summary.cityId, snapshot.cityId);
  assert.deepEqual(
    summary.headlineGoodsIds,
    snapshot.rows.slice(0, 2).map((row) => row.goodsId)
  );
});
```

- [x] **Step 3: Run the snapshot tests to verify RED**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs }
```

Expected:

- `FAIL` because the settlement-trade domain/content/service modules do not exist yet and `GameState.runtime` has no `settlementTrade` owner.

- [x] **Step 4: Implement the minimal domain/content/runtime/service slice**

Create `src/domain/settlement-trade.ts` with the core contracts:

```ts
import type { CityId } from "./city";

export type SettlementTradeGoodId =
  | "silk_textiles"
  | "ramie_cloth"
  | "cotton_cloth"
  | "tea"
  | "wine"
  | "ceramics"
  | "copperware"
  | "ironware"
  | "salt"
  | "paper_brush"
  | "bamboo_woodware"
  | "woven_goods"
  | "lacquer_oil"
  | "stone_goods"
  | "hides";

export type SettlementTradeTier =
  | "abundant"
  | "local"
  | "scarce"
  | "extreme-scarce";

export type SettlementTradeGoodRuntimeState = {
  stockQuantity: number;
  priceMultiplier: number;
  progressUnits: number;
  lastTradedDay: number | null;
};

export type SettlementTradeRuntimeState = Partial<
  Record<CityId, Partial<Record<SettlementTradeGoodId, SettlementTradeGoodRuntimeState>>>
>;

export type SettlementTradeSnapshotRow = {
  goodsId: SettlementTradeGoodId;
  name: string;
  categoryLabel: string;
  unit: string;
  tier: SettlementTradeTier;
  tierLabel: string;
  basePrice: number;
  staticReferencePrice: number;
  currentBuyPrice: number;
  currentSellPrice: number;
  priceMultiplier: number;
  stockQuantity: number;
  ownedQuantity: number;
  progressUnits: number;
  daysUntilReset: number;
  routeHints: string[];
  demandNotes: string[];
};
```

Create `src/content/markets/settlement-trade-goods.ts` and `src/content/markets/settlement-trade-city-profiles.ts`, then wire the new runtime owner in `src/domain/game-state.ts` and `src/application/state/create-initial-state.ts`:

```ts
// src/domain/game-state.ts
import type { SettlementTradeRuntimeState } from "./settlement-trade";

runtime: {
  flags: Record<string, boolean>;
  variables: Record<string, number | string>;
  factionMerit: Record<string, Record<CharacterId, number>>;
  factionMemberships: FactionMembershipsState;
  factionAffiliations: FactionAffiliationsState;
  tasks: TaskRuntimeState;
  playableSession: ActivePlayableSession | null;
  cityNpcPools: Record<CityId, CityNpcPoolRuntimeState>;
  cityMarkets: Record<CityId, CityMarketData>;
  settlementTrade: SettlementTradeRuntimeState;
  mapExplorationByMapId: Record<MapId, MapExplorationState>;
  ...
}

// src/application/state/create-initial-state.ts
runtime: {
  flags: {},
  variables: {},
  factionMerit: {},
  factionMemberships: {},
  factionAffiliations: {},
  tasks: createInitialTaskRuntimeState(),
  playableSession: null,
  cityNpcPools: {},
  cityMarkets: {},
  settlementTrade: {},
  mapExplorationByMapId: {},
  ...
}
```

Implement `src/application/markets/settlement-trade-service.ts` with snapshot and investigation ownership only:

```ts
import { defaultRuntimeContent } from "../content/default-runtime-content";
import { readPlayerItemQuantity } from "../inventory/player-item-inventory";
import {
  settlementTradeCityProfilesByCityId,
  settlementTradeTierMultipliers,
} from "../../content/markets/settlement-trade-city-profiles";
import {
  settlementTradeGoodsById,
} from "../../content/markets/settlement-trade-goods";

function getTierLabel(tier: SettlementTradeTier): string {
  switch (tier) {
    case "abundant":
      return "Abundant";
    case "local":
      return "Local";
    case "scarce":
      return "Scarce";
    case "extreme-scarce":
      return "Extreme Scarcity";
  }
}

function isRuntimeCityLoaded(cityId: CityId): boolean {
  return defaultRuntimeContent.cities.some((city) => city.id === cityId);
}

function resolveSupportedProfile(
  cityId: CityId
): SettlementTradeCityProfile | null {
  if (!isRuntimeCityLoaded(cityId)) {
    return null;
  }
  return settlementTradeCityProfilesByCityId[cityId] ?? null;
}

function readNormalizedRuntime(input: {
  state: GameState;
  cityId: CityId;
  goodsId: SettlementTradeGoodId;
  currentDay: number;
  initialStock: number;
}): SettlementTradeGoodRuntimeState {
  const runtimeEntry =
    input.state.runtime.settlementTrade[input.cityId]?.[input.goodsId] ?? null;
  const defaultState: SettlementTradeGoodRuntimeState = {
    stockQuantity: input.initialStock,
    priceMultiplier: 1,
    progressUnits: 0,
    lastTradedDay: null,
  };

  if (runtimeEntry == null) {
    return defaultState;
  }

  if (
    runtimeEntry.lastTradedDay != null &&
    input.currentDay - runtimeEntry.lastTradedDay >= 30
  ) {
    return {
      ...runtimeEntry,
      priceMultiplier: 1,
      progressUnits: 0,
    };
  }

  return {
    stockQuantity: runtimeEntry.stockQuantity,
    priceMultiplier: runtimeEntry.priceMultiplier,
    progressUnits: runtimeEntry.progressUnits,
    lastTradedDay: runtimeEntry.lastTradedDay,
  };
}

function collectHighlightedDestinations(input: {
  originCityId: CityId;
  rows: SettlementTradeSnapshotRow[];
}): Array<{
  cityId: CityId;
  cityName: string;
  demandedGoodsIds: SettlementTradeGoodId[];
}> {
  return Object.values(settlementTradeCityProfilesByCityId)
    .filter((profile) => profile.cityId !== input.originCityId)
    .map((profile) => ({
      cityId: profile.cityId,
      cityName: profile.cityName,
      demandedGoodsIds: input.rows
        .filter((row) =>
          (profile.goods[row.goodsId]?.demandNotes ?? []).length > 0
        )
        .slice(0, 2)
        .map((row) => row.goodsId),
    }))
    .filter((entry) => entry.demandedGoodsIds.length > 0)
    .slice(0, 2);
}

function createVoiceLines(snapshot: SettlementTradeSnapshot): string[] {
  if (!snapshot.supported || snapshot.rows.length === 0) {
    return ["This city does not have an active specialty market."];
  }

  const primary = snapshot.rows[0];
  const secondary = snapshot.rows[1];

  return [
    `The best local specialty right now is ${primary.name}.`,
    secondary == null
      ? `Watch ${primary.name} and move before the reset timer settles it back down.`
      : `${secondary.name} is the second clear lead if you want a backup route.`,
    `Every 10 traded units moves the price multiplier by 0.01 and the market resets after 30 quiet days.`,
  ];
}

export class SettlementTradeService {
  createSnapshot(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
  }): SettlementTradeSnapshot {
    const profile = resolveSupportedProfile(input.cityId);
    if (profile == null) {
      return {
        cityId: input.cityId,
        supported: false,
        rows: [],
        helperLines: ["City specialty market is not available here."],
      };
    }

    const rows = Object.entries(profile.goods).flatMap(([goodsId, goodsProfile]) => {
      if (goodsProfile == null) {
        return [];
      }
      const definition = settlementTradeGoodsById[goodsId as SettlementTradeGoodId];
      const runtime = readNormalizedRuntime({
        state: input.state,
        cityId: input.cityId,
        goodsId: goodsId as SettlementTradeGoodId,
        currentDay: input.currentDay,
        initialStock: goodsProfile.initialStock,
      });
      const staticReferencePrice = Math.round(
        definition.basePrice * settlementTradeTierMultipliers[goodsProfile.tier]
      );
      const currentSellPrice = Math.round(staticReferencePrice * runtime.priceMultiplier);

      return [
        {
          goodsId: goodsId as SettlementTradeGoodId,
          name: definition.name,
          categoryLabel: definition.categoryLabel,
          unit: definition.unit,
          tier: goodsProfile.tier,
          tierLabel: getTierLabel(goodsProfile.tier),
          basePrice: definition.basePrice,
          staticReferencePrice,
          currentBuyPrice: Math.round(currentSellPrice * 1.2),
          currentSellPrice,
          priceMultiplier: runtime.priceMultiplier,
          stockQuantity: runtime.stockQuantity,
          ownedQuantity: readPlayerItemQuantity(input.state, goodsId),
          progressUnits: runtime.progressUnits,
          daysUntilReset: runtime.lastTradedDay == null ? 30 : Math.max(0, 30 - (input.currentDay - runtime.lastTradedDay)),
          routeHints: goodsProfile.routeHints ?? [],
          demandNotes: goodsProfile.demandNotes ?? [],
        },
      ];
    });

    return {
      cityId: input.cityId,
      supported: true,
      rows,
      helperLines: [
        "Buy price is 120% of the current local sell price.",
        "Every 10 traded units moves the dynamic multiplier by 0.01.",
      ],
    };
  }

  createInvestigationSummary(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
  }): SettlementTradeInvestigationSummary {
    const snapshot = this.createSnapshot(input);
    return {
      cityId: input.cityId,
      headlineGoodsIds: snapshot.rows.slice(0, 2).map((row) => row.goodsId),
      highlightedDestinations: collectHighlightedDestinations({
        originCityId: input.cityId,
        rows: snapshot.rows,
      }),
      voiceLines: createVoiceLines(snapshot),
    };
  }
}
```

- [x] **Step 5: Run the snapshot tests to verify GREEN**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs }
```

Expected:

- `PASS` for the supported-city snapshot defaults, unsupported-city rejection, and investigation-summary data-path tests.

- [ ] **Step 6: Commit the contract and snapshot task**

Run:

```bash
git add docs/superpowers/project-progress.md src/domain/settlement-trade.ts src/content/markets/settlement-trade-goods.ts src/content/markets/settlement-trade-city-profiles.ts src/application/markets/settlement-trade-service.ts src/domain/game-state.ts src/application/state/create-initial-state.ts tests/settlement-trade-service.test.cjs docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md
git commit -m "feat: scaffold city specialty market runtime"
```

### Task 2: Implement Trade Resolution and Dynamic Price Pressure

**Files:**
- Modify: `src/domain/settlement-trade.ts`
- Modify: `src/application/markets/settlement-trade-service.ts`
- Test: `tests/settlement-trade-service.test.cjs`
- Read: `src/application/inventory/player-item-inventory.ts`

**Interfaces:**
- Consumes: `SettlementTradeSnapshotRow`
- Consumes: `readPlayerItemQuantity(state: Pick<GameState, "runtime">, itemId: string, legacySources?: PlayerItemLegacySource[]): number`
- Produces: `SettlementTradeMutation`
- Produces: `SettlementTradeResolution`
- Produces: `SettlementTradeService.resolveTrade(input: { state: GameState; cityId: CityId; currentDay: number; goodsId: SettlementTradeGoodId; mode: "buy" | "sell"; quantity: number; playerGold: number }): SettlementTradeResolution`

- [ ] **Step 1: Write the failing pricing and validation tests**

Extend `tests/settlement-trade-service.test.cjs` with:

```js
test("settlement trade resets multiplier and progress after 30 quiet days", () => {
  const service = new SettlementTradeService();
  const state = createBaseState("city.yingtian");
  state.runtime.settlementTrade = {
    "city.yingtian": {
      silk_textiles: {
        stockQuantity: 8,
        priceMultiplier: 1.45,
        progressUnits: 7,
        lastTradedDay: 1,
      },
    },
  };

  const snapshot = service.createSnapshot({
    state,
    cityId: "city.yingtian",
    currentDay: 31,
  });
  const row = snapshot.rows.find((candidate) => candidate.goodsId === "silk_textiles");

  assert.ok(row);
  assert.equal(row.priceMultiplier, 1);
  assert.equal(row.progressUnits, 0);
  assert.equal(row.daysUntilReset, 30);
});

test("settlement trade buy pressure adds 0.01 for each 10 bought units and keeps residual progress", () => {
  const service = new SettlementTradeService();
  const result = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 25,
    playerGold: 5000,
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(
    result.mutations.some(
      (mutation) =>
        mutation.type === "change-settlement-trade-multiplier" &&
        mutation.delta === 0.02
    ),
    true
  );
  assert.equal(
    result.mutations.some(
      (mutation) =>
        mutation.type === "set-settlement-trade-progress" &&
        mutation.progressUnits === 5
    ),
    true
  );
});

test("settlement trade keeps buy price at round(sell price * 1.2) and rejects insufficient resources", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });
  const row = snapshot.rows.find((candidate) => candidate.goodsId === "silk_textiles");

  assert.ok(row);
  assert.equal(row.currentBuyPrice, Math.round(row.currentSellPrice * 1.2));

  const insufficientGold = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 1,
    playerGold: 0,
  });
  assert.equal(insufficientGold.ok, false);
  if (insufficientGold.ok) {
    return;
  }
  assert.equal(insufficientGold.code, "insufficient-gold");
});
```

- [ ] **Step 2: Run the pricing tests to verify RED**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs }
```

Expected:

- `FAIL` because `createSnapshot()` does not normalize expired runtime entries yet and `resolveTrade()` plus the mutation union are not implemented.

- [ ] **Step 3: Implement the trade algorithm, reset logic, and typed mutation output**

Extend `src/domain/settlement-trade.ts` with the mutation and resolution unions:

```ts
export type SettlementTradeMutation =
  | { type: "change-player-gold"; amount: number }
  | { type: "change-player-item"; itemId: SettlementTradeGoodId; delta: number }
  | { type: "change-settlement-trade-stock"; cityId: CityId; goodsId: SettlementTradeGoodId; delta: number }
  | { type: "change-settlement-trade-multiplier"; cityId: CityId; goodsId: SettlementTradeGoodId; delta: number }
  | { type: "set-settlement-trade-progress"; cityId: CityId; goodsId: SettlementTradeGoodId; progressUnits: number }
  | { type: "set-settlement-trade-last-traded-day"; cityId: CityId; goodsId: SettlementTradeGoodId; dayNumber: number };

export type SettlementTradeResolution =
  | {
      ok: true;
      mode: "buy" | "sell";
      goodsId: SettlementTradeGoodId;
      quantity: number;
      totalPrice: number;
      summaryLines: string[];
      mutations: SettlementTradeMutation[];
    }
  | {
      ok: false;
      code:
        | "unsupported-city"
        | "unknown-goods"
        | "invalid-quantity"
        | "insufficient-gold"
        | "insufficient-stock"
        | "insufficient-owned-quantity";
      title: string;
      paragraphs: string[];
    };
```

Implement the dynamic pricing path in `src/application/markets/settlement-trade-service.ts`:

```ts
function advanceTradePressure(input: {
  currentMultiplier: number;
  currentProgressUnits: number;
  signedQuantity: number;
}): { priceMultiplier: number; progressUnits: number } {
  let nextMultiplier = input.currentMultiplier;
  let nextProgressUnits = input.currentProgressUnits + input.signedQuantity;

  while (Math.abs(nextProgressUnits) >= 10) {
    const direction = nextProgressUnits > 0 ? 1 : -1;
    const candidateMultiplier = Number((nextMultiplier + direction * 0.01).toFixed(2));
    const clampedMultiplier = Math.max(0.5, Math.min(2, candidateMultiplier));

    if (clampedMultiplier === nextMultiplier) {
      return { priceMultiplier: nextMultiplier, progressUnits: 0 };
    }

    nextMultiplier = clampedMultiplier;
    nextProgressUnits -= direction * 10;
  }

  return {
    priceMultiplier: nextMultiplier,
    progressUnits: nextProgressUnits,
  };
}

resolveTrade(input: {
  state: GameState;
  cityId: CityId;
  currentDay: number;
  goodsId: SettlementTradeGoodId;
  mode: "buy" | "sell";
  quantity: number;
  playerGold: number;
}): SettlementTradeResolution {
  const snapshot = this.createSnapshot(input);
  if (!snapshot.supported) {
    return {
      ok: false,
      code: "unsupported-city",
      title: "Specialty market unavailable",
      paragraphs: ["This city does not have a specialty market profile in the current runtime."],
    };
  }

  const row = snapshot.rows.find((candidate) => candidate.goodsId === input.goodsId);
  if (row == null) {
    return {
      ok: false,
      code: "unknown-goods",
      title: "Unknown goods",
      paragraphs: ["The selected specialty good is not available in this city."],
    };
  }

  if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
    return {
      ok: false,
      code: "invalid-quantity",
      title: "Invalid quantity",
      paragraphs: ["Quantity must be a positive integer."],
    };
  }

  if (input.mode === "buy" && row.stockQuantity < input.quantity) {
    return {
      ok: false,
      code: "insufficient-stock",
      title: "Insufficient stock",
      paragraphs: ["The city specialty market does not have enough stock for this trade."],
    };
  }

  if (input.mode === "sell" && row.ownedQuantity < input.quantity) {
    return {
      ok: false,
      code: "insufficient-owned-quantity",
      title: "Insufficient goods",
      paragraphs: ["The player does not own enough of this specialty good to sell it."],
    };
  }

  const unitPrice = input.mode === "buy" ? row.currentBuyPrice : row.currentSellPrice;
  const totalPrice = unitPrice * input.quantity;
  if (input.mode === "buy" && input.playerGold < totalPrice) {
    return {
      ok: false,
      code: "insufficient-gold",
      title: "Insufficient gold",
      paragraphs: ["The player does not have enough gold for this purchase."],
    };
  }

  const nextPressure = advanceTradePressure({
    currentMultiplier: row.priceMultiplier,
    currentProgressUnits: row.progressUnits,
    signedQuantity: input.mode === "buy" ? input.quantity : -input.quantity,
  });

  return {
    ok: true,
    mode: input.mode,
    goodsId: input.goodsId,
    quantity: input.quantity,
    totalPrice,
    summaryLines: [
      `${input.mode === "buy" ? "Bought" : "Sold"} ${input.quantity} ${row.unit} ${row.name}.`,
      `Total price: ${totalPrice}.`,
    ],
    mutations: [
      {
        type: "change-player-gold",
        amount: input.mode === "buy" ? -totalPrice : totalPrice,
      },
      {
        type: "change-player-item",
        itemId: input.goodsId,
        delta: input.mode === "buy" ? input.quantity : -input.quantity,
      },
      {
        type: "change-settlement-trade-stock",
        cityId: input.cityId,
        goodsId: input.goodsId,
        delta: input.mode === "buy" ? -input.quantity : input.quantity,
      },
      {
        type: "change-settlement-trade-multiplier",
        cityId: input.cityId,
        goodsId: input.goodsId,
        delta: Number((nextPressure.priceMultiplier - row.priceMultiplier).toFixed(2)),
      },
      {
        type: "set-settlement-trade-progress",
        cityId: input.cityId,
        goodsId: input.goodsId,
        progressUnits: nextPressure.progressUnits,
      },
      {
        type: "set-settlement-trade-last-traded-day",
        cityId: input.cityId,
        goodsId: input.goodsId,
        dayNumber: input.currentDay,
      },
    ],
  };
}
```

- [ ] **Step 4: Run the pricing tests to verify GREEN**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs }
```

Expected:

- `PASS` for the 30-day reset behavior, `0.01` per 10 units rule, residual progress carry, `0.5` to `2.0` clamp behavior, `buyPrice === round(sellPrice * 1.2)`, and structured validation failures.

- [ ] **Step 5: Commit the pricing task**

Run:

```bash
git add src/domain/settlement-trade.ts src/application/markets/settlement-trade-service.ts tests/settlement-trade-service.test.cjs
git commit -m "feat: implement settlement trade pricing"
```

### Task 3: Add the Shared Settlement Trade Mutation Applier

**Files:**
- Create: `src/application/markets/apply-settlement-trade-mutations.ts`
- Test: `tests/settlement-trade-mutations.test.cjs`
- Read: `src/application/inventory/player-item-inventory.ts`
- Read: `src/application/house-modules/market-house/market-house-house-module.ts`

**Interfaces:**
- Consumes: `SettlementTradeMutation[]`
- Consumes: `applyPlayerItemMutations(state: GameState, mutations: readonly PlayerItemQuantityMutation[]): GameState`
- Produces: `applySettlementTradeMutations(input: { state: GameState; characterDefinitions: CharacterDefinition[]; playerCharacterId: string; mutations: readonly SettlementTradeMutation[] }): { state: GameState; characterDefinitions: CharacterDefinition[] }`

- [ ] **Step 1: Write the failing applier tests**

Create `tests/settlement-trade-mutations.test.cjs` with:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  applySettlementTradeMutations,
} = require("../.test-dist/application/markets/apply-settlement-trade-mutations.js");
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");
const {
  prototypeCards,
  prototypeMap,
  prototypeValuables,
  prototypeCharacters,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

function createBaseState(cityId = "city.yingtian") {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: cityId,
    currentHouseId: null,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((card) => card.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: { swordId: null, armorId: null },
    },
    currentView: "house",
  });
}

function createCharacters(gold = 5000) {
  return prototypeCharacters.map((character) =>
    character.id !== playerCharacterId
      ? character
      : {
          ...character,
          stats: {
            ...character.stats,
            gold,
          },
        }
  );
}

test("apply settlement trade mutations updates gold, items, stock, multiplier, progress, and day", () => {
  const state = createBaseState("city.yingtian");
  state.runtime.settlementTrade = {
    "city.yingtian": {
      silk_textiles: {
        stockQuantity: 8,
        priceMultiplier: 1,
        progressUnits: 2,
        lastTradedDay: 1,
      },
    },
  };

  const result = applySettlementTradeMutations({
    state,
    characterDefinitions: createCharacters(5000),
    playerCharacterId,
    mutations: [
      { type: "change-player-gold", amount: -240 },
      { type: "change-player-item", itemId: "silk_textiles", delta: 2 },
      { type: "change-settlement-trade-stock", cityId: "city.yingtian", goodsId: "silk_textiles", delta: -2 },
      { type: "change-settlement-trade-multiplier", cityId: "city.yingtian", goodsId: "silk_textiles", delta: 0.01 },
      { type: "set-settlement-trade-progress", cityId: "city.yingtian", goodsId: "silk_textiles", progressUnits: 0 },
      { type: "set-settlement-trade-last-traded-day", cityId: "city.yingtian", goodsId: "silk_textiles", dayNumber: 12 },
    ],
  });

  const player = result.characterDefinitions.find((character) => character.id === playerCharacterId);

  assert.ok(player);
  assert.equal(player.stats.gold, 4760);
  assert.equal(
    result.state.runtime.variables[getPlayerItemQuantityVariableKey("silk_textiles")],
    2
  );
  assert.deepEqual(
    result.state.runtime.settlementTrade["city.yingtian"].silk_textiles,
    {
      stockQuantity: 6,
      priceMultiplier: 1.01,
      progressUnits: 0,
      lastTradedDay: 12,
    }
  );
});
```

- [ ] **Step 2: Run the applier tests to verify RED**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-mutations.test.cjs }
```

Expected:

- `FAIL` because the shared applier module does not exist yet and no code currently knows how to settle the typed settlement-trade mutations.

- [ ] **Step 3: Implement the shared applier without host-specific logic**

Create `src/application/markets/apply-settlement-trade-mutations.ts` with:

```ts
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { SettlementTradeMutation } from "../../domain/settlement-trade";
import { applyPlayerItemMutations } from "../inventory/player-item-inventory";

function applyPlayerGoldChange(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  amount: number
): CharacterDefinition[] {
  return characterDefinitions.map((character) =>
    character.id !== playerCharacterId
      ? character
      : {
          ...character,
          stats: {
            ...character.stats,
            gold: character.stats.gold + amount,
          },
        }
  );
}

function ensureSettlementTradeEntry(
  state: GameState,
  cityId: string,
  goodsId: string
) {
  const cityState = state.runtime.settlementTrade[cityId] ?? {};
  return cityState[goodsId] ?? {
    stockQuantity: 0,
    priceMultiplier: 1,
    progressUnits: 0,
    lastTradedDay: null,
  };
}

export function applySettlementTradeMutations(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  mutations: readonly SettlementTradeMutation[];
}): { state: GameState; characterDefinitions: CharacterDefinition[] } {
  let nextState = input.state;
  let nextCharacterDefinitions = input.characterDefinitions;

  for (const mutation of input.mutations) {
    switch (mutation.type) {
      case "change-player-gold":
        nextCharacterDefinitions = applyPlayerGoldChange(
          nextCharacterDefinitions,
          input.playerCharacterId,
          mutation.amount
        );
        break;
      case "change-player-item":
        nextState = applyPlayerItemMutations(nextState, [
          { itemId: mutation.itemId, delta: mutation.delta },
        ]);
        break;
      default: {
        const current = ensureSettlementTradeEntry(
          nextState,
          mutation.cityId,
          mutation.goodsId
        );
        const nextEntry =
          mutation.type === "change-settlement-trade-stock"
            ? { ...current, stockQuantity: current.stockQuantity + mutation.delta }
            : mutation.type === "change-settlement-trade-multiplier"
              ? {
                  ...current,
                  priceMultiplier: Number(
                    (current.priceMultiplier + mutation.delta).toFixed(2)
                  ),
                }
              : mutation.type === "set-settlement-trade-progress"
                ? { ...current, progressUnits: mutation.progressUnits }
                : { ...current, lastTradedDay: mutation.dayNumber };

        nextState = {
          ...nextState,
          runtime: {
            ...nextState.runtime,
            settlementTrade: {
              ...nextState.runtime.settlementTrade,
              [mutation.cityId]: {
                ...(nextState.runtime.settlementTrade[mutation.cityId] ?? {}),
                [mutation.goodsId]: nextEntry,
              },
            },
          },
        };
      }
    }
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}
```

- [ ] **Step 4: Run the applier tests to verify GREEN**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-mutations.test.cjs }
```

Expected:

- `PASS` for the focused applier test that proves gold, player items, stock, multiplier, progress, and last-traded day all settle through the shared applier.

- [ ] **Step 5: Commit the mutation task**

Run:

```bash
git add src/application/markets/apply-settlement-trade-mutations.ts tests/settlement-trade-mutations.test.cjs
git commit -m "feat: apply settlement trade mutations"
```

### Task 4: Integrate the Specialty Market into `market-house`

**Files:**
- Create: `src/application/house-modules/market-house/market-house-settlement-trade.ts`
- Modify: `src/domain/house-module.ts`
- Modify: `src/domain/house-modules/market-house-session.ts`
- Modify: `src/application/house-modules/market-house/market-house-house-module.ts`
- Modify: `src/application/house-modules/market-house/market-house-investigation.ts`
- Modify: `src/ui/views/house/market-house-view.ts`
- Test: `tests/market-house-settlement-trade.test.cjs`
- Test: `tests/market-house-investigation.test.cjs`
- Test: `tests/house-button-sound-policy.test.cjs`
- Test: `tests/robustness.test.cjs`
- Read: `docs/special-house-interface.md`

**Interfaces:**
- Consumes: `SettlementTradeService`
- Consumes: `applySettlementTradeMutations()`
- Produces: `type MarketHouseSettlementTradeOverlayState = { type: "settlement-trade"; mode: "buy" | "sell"; selectedGoodsId: SettlementTradeGoodId | null; quantity: number }`
- Produces: `HouseOverlayViewModel` variant `type: "settlement-trade"`
- Produces: action ids `open-settlement-trade-buy`, `open-settlement-trade-sell`, `select-settlement-trade-goods:<goodsId>`, `settlement-trade-qty-minus`, `settlement-trade-qty-plus`, `confirm-settlement-trade`, `close-settlement-trade`
- Produces: `createMarketHouseSettlementTradeOverlay(input: { state: GameState; cityId: CityId; mode: "buy" | "sell"; selectedGoodsId: SettlementTradeGoodId | null; quantity: number }): Extract<HouseOverlayViewModel, { type: "settlement-trade" }>`

- [ ] **Step 1: Write the failing host, investigation, and button-sound tests**

Create `tests/market-house-settlement-trade.test.cjs` with:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  defaultRuntimeContent,
} = require("../.test-dist/application/content/default-runtime-content.js");
const {
  marketHouseHouseModule,
} = require("../.test-dist/application/house-modules/market-house/market-house-house-module.js");
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeCities,
  prototypeCityNpcPools,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const {
  ensureCityNpcPoolsForCurrentDay,
} = require("../.test-dist/application/city-npcs/refresh-city-npc-pools.js");

const playerCharacterId = "char.player";
const marketHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "market-house"
);

function createCityMarketHouse(cityId) {
  return {
    ...marketHouse,
    id: `${marketHouse.id}.${cityId}`,
    cityId,
  };
}

function createBaseState(cityId) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: cityId,
    currentHouseId: `${marketHouse.id}.${cityId}`,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((card) => card.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: { swordId: null, armorId: null },
    },
    currentView: "house",
  });
}

function createCharacters(gold = 5000) {
  return prototypeCharacters.map((character) =>
    character.id !== playerCharacterId
      ? character
      : {
          ...character,
          stats: {
            ...character.stats,
            gold,
          },
        }
  );
}

function openMarketHouse(cityId, gold = 5000) {
  defaultRuntimeContent.cities = prototypeCities;
  const houseDefinition = createCityMarketHouse(cityId);
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(cityId),
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: createCharacters(gold),
    houseDefinition,
    playerCharacterId,
  });
  return marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
}

test("market house supported city can open settlement trade overlay and execute specialty buy flow", () => {
  const openResult = openMarketHouse("city.yingtian", 5000);
  const houseDefinition = createCityMarketHouse("city.yingtian");

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-settlement-trade-buy" },
  });

  assert.equal(overlayResult.sessionState?.overlay?.type, "settlement-trade");
  if (overlayResult.sessionState?.overlay?.type !== "settlement-trade") {
    return;
  }

  const goodsId = overlayResult.sessionState.overlay.selectedGoodsId;
  assert.equal(typeof goodsId, "string");

  const buyResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: { type: "action", actionId: "confirm-settlement-trade" },
  });

  assert.equal(buyResult.sessionState?.overlay?.type, "alert");
  assert.equal(
    buyResult.characterDefinitions.find((character) => character.id === playerCharacterId).stats.gold < 5000,
    true
  );
  assert.equal(
    buyResult.gameState.runtime.variables[getPlayerItemQuantityVariableKey(goodsId)] > 0,
    true
  );
});

test("market house hides specialty trade actions for unsupported runtime cities", () => {
  const unsupportedCity = { ...prototypeCities[0], id: "city.unsupported", name: "Unsupported Test City" };
  defaultRuntimeContent.cities = [...prototypeCities, unsupportedCity];
  const houseDefinition = createCityMarketHouse(unsupportedCity.id);
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(unsupportedCity.id),
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: createCharacters(5000),
    houseDefinition,
    playerCharacterId,
  });
  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
  const viewModel = marketHouseHouseModule.selectViewModel({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
  });

  assert.equal(
    viewModel.actionContainer?.actions.some(
      (action) => action.id === "open-settlement-trade-buy" || action.id === "open-settlement-trade-sell"
    ) ?? false,
    false
  );
});
```

Extend `tests/market-house-investigation.test.cjs` with:

```js
test("market house investigation and specialty overlay derive from the same service snapshot", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = investigateMarket(openResult, yingtianHouse);
  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: yingtianHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-settlement-trade-buy" },
  });

  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: yingtianHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "settlement-trade");
  if (overlayViewModel.overlay?.type !== "settlement-trade") {
    return;
  }

  const selectedName = overlayViewModel.overlay.selectedSummary?.name ?? "";
  assert.equal(
    (reportResult.sessionState?.dialogueLines.join("\n") ?? "").includes(selectedName),
    true
  );
});
```

Extend `tests/house-button-sound-policy.test.cjs` with:

```js
test("house module render defaults settlement trade overlays to light adjust and cancel sounds plus heavy confirm sounds", () => {
  const html = renderRegisteredHouseView("market-house", {
    overlay: {
      type: "settlement-trade",
      title: "City Specialty Trade",
      mode: "buy",
      quantity: 2,
      quantityFieldId: "settlement-trade-quantity",
      decrementActionId: "settlement-trade-decrement",
      incrementActionId: "settlement-trade-increment",
      confirmActionId: "settlement-trade-confirm",
      confirmLabel: "Buy Goods",
      cancelActionId: "settlement-trade-cancel",
      cancelLabel: "Come Back Later",
      rows: [
        {
          goodsId: "silk_textiles",
          name: "Silk Textiles",
          categoryLabel: "Textiles",
          unit: "bolt",
          tierLabel: "Abundant",
          buyPrice: 120,
          sellPrice: 100,
          basePrice: 100,
          priceMultiplier: 1,
          stockQuantity: 6,
          ownedQuantity: 0,
          daysUntilReset: 30,
          priceTone: "neutral",
          isSelected: true,
        },
      ],
      selectedSummary: {
        goodsId: "silk_textiles",
        name: "Silk Textiles",
        unit: "bolt",
        tierLabel: "Abundant",
        buyPrice: 120,
        sellPrice: 100,
        stockQuantity: 6,
        ownedQuantity: 0,
        tradeTotal: 240,
        daysUntilReset: 30,
        nextStepHint: "Ship it north.",
        supplyHint: "Local craft guilds keep this stocked.",
      },
      helperLines: ["Trade pressure moves by 0.01 per 10 units."],
    },
  });

  assert.match(
    html,
    /data-house-action="settlement-trade-decrement"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="settlement-trade-increment"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="settlement-trade-cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-house-action="settlement-trade-confirm"[\s\S]*data-button-sound="heavy"/
  );
});
```

Extend `tests/robustness.test.cjs` with:

```js
test("market house specialty trade integration keeps src/main.ts free of settlement trade host branches", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");

  assert.doesNotMatch(source, /open-settlement-trade/u);
  assert.doesNotMatch(source, /confirm-settlement-trade/u);
  assert.doesNotMatch(source, /SettlementTradeService/u);
  assert.doesNotMatch(source, /applySettlementTradeMutations/u);
});
```

- [ ] **Step 2: Run the host tests to verify RED**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house specialty trade integration keeps src/main.ts free of settlement trade host branches" tests/robustness.test.cjs }
```

Expected:

- `FAIL` because the new host action ids, overlay state, overlay view model, and renderer branch do not exist yet, and `market-house` still treats `"settlement-trade"` as an ordinary source shop.

- [ ] **Step 3: Implement the host-only adapter layer and wire it into `market-house`**

Add the host session and view contracts:

```ts
// src/domain/house-modules/market-house-session.ts
import type { SettlementTradeGoodId } from "../settlement-trade";

export type MarketHouseSettlementTradeOverlayState = {
  type: "settlement-trade";
  mode: "buy" | "sell";
  selectedGoodsId: SettlementTradeGoodId | null;
  quantity: number;
};

export type MarketHouseOverlayState =
  | MarketHouseAlertOverlayState
  | MarketHouseTradeOverlayState
  | MarketHouseSettlementTradeOverlayState
  | null;

// src/domain/house-module.ts
| {
    type: "settlement-trade";
    title: string;
    mode: "buy" | "sell";
    quantity: number;
    quantityFieldId: string;
    decrementActionId: string;
    incrementActionId: string;
    confirmActionId: string;
    confirmLabel: string;
    cancelActionId: string;
    cancelLabel: string;
    rows: Array<{
      goodsId: string;
      name: string;
      categoryLabel: string;
      unit: string;
      tierLabel: string;
      buyPrice: number;
      sellPrice: number;
      basePrice: number;
      priceMultiplier: number;
      stockQuantity: number;
      ownedQuantity: number;
      daysUntilReset: number;
      priceTone: "low" | "high" | "neutral";
      isSelected: boolean;
    }>;
    selectedSummary: {
      goodsId: string;
      name: string;
      unit: string;
      tierLabel: string;
      buyPrice: number;
      sellPrice: number;
      stockQuantity: number;
      ownedQuantity: number;
      tradeTotal: number;
      daysUntilReset: number;
      nextStepHint: string;
      supplyHint: string;
    } | null;
    helperLines: string[];
    confirmButtonSound?: "light" | "heavy";
    cancelButtonSound?: "light" | "heavy";
    decrementButtonSound?: "light" | "heavy";
    incrementButtonSound?: "light" | "heavy";
  }
```

Create the host adapter in `src/application/house-modules/market-house/market-house-settlement-trade.ts`:

```ts
import type { HouseOverlayViewModel } from "../../../domain/house-module";
import type {
  MarketHouseSettlementTradeOverlayState,
} from "../../../domain/house-modules/market-house-session";
import { SettlementTradeService } from "../../markets/settlement-trade-service";

const settlementTradeService = new SettlementTradeService();

export function createSettlementTradeOverlayViewModel(input: {
  state: GameState;
  cityId: CityId;
  overlay: MarketHouseSettlementTradeOverlayState;
  currentDay: number;
}): Extract<HouseOverlayViewModel, { type: "settlement-trade" }> {
  const snapshot = settlementTradeService.createSnapshot({
    state: input.state,
    cityId: input.cityId,
    currentDay: input.currentDay,
  });
  const selectedRow =
    snapshot.rows.find((row) => row.goodsId === input.overlay.selectedGoodsId) ??
    snapshot.rows[0] ??
    null;

  return {
    type: "settlement-trade",
    title: "City Specialty Trade",
    mode: input.overlay.mode,
    quantity: input.overlay.quantity,
    quantityFieldId: "settlement-trade-quantity",
    decrementActionId: "settlement-trade-qty-minus",
    incrementActionId: "settlement-trade-qty-plus",
    confirmActionId: "confirm-settlement-trade",
    confirmLabel: input.overlay.mode === "buy" ? "Buy Goods" : "Sell Goods",
    cancelActionId: "close-settlement-trade",
    cancelLabel: "Come Back Later",
    rows: snapshot.rows.map((row) => ({
      goodsId: row.goodsId,
      name: row.name,
      categoryLabel: row.categoryLabel,
      unit: row.unit,
      tierLabel: row.tierLabel,
      buyPrice: row.currentBuyPrice,
      sellPrice: row.currentSellPrice,
      basePrice: row.staticReferencePrice,
      priceMultiplier: row.priceMultiplier,
      stockQuantity: row.stockQuantity,
      ownedQuantity: row.ownedQuantity,
      daysUntilReset: row.daysUntilReset,
      priceTone:
        row.priceMultiplier > 1 ? "high" : row.priceMultiplier < 1 ? "low" : "neutral",
      isSelected: row.goodsId === selectedRow?.goodsId,
    })),
    selectedSummary:
      selectedRow == null
        ? null
        : {
            goodsId: selectedRow.goodsId,
            name: selectedRow.name,
            unit: selectedRow.unit,
            tierLabel: selectedRow.tierLabel,
            buyPrice: selectedRow.currentBuyPrice,
            sellPrice: selectedRow.currentSellPrice,
            stockQuantity: selectedRow.stockQuantity,
            ownedQuantity: selectedRow.ownedQuantity,
            tradeTotal:
              (input.overlay.mode === "buy"
                ? selectedRow.currentBuyPrice
                : selectedRow.currentSellPrice) * input.overlay.quantity,
            daysUntilReset: selectedRow.daysUntilReset,
            nextStepHint: selectedRow.routeHints[0] ?? "Look for demand in nearby cities.",
            supplyHint: selectedRow.demandNotes[0] ?? "Trade pressure resets after 30 quiet days.",
          },
    helperLines: snapshot.helperLines,
  };
}
```

Update `src/application/house-modules/market-house/market-house-house-module.ts` so the ordinary market no longer owns specialty trade and the new host actions delegate to the shared service/applier:

```ts
const AVAILABLE_MARKET_SHOPS: MarketShopType[] = [
  "grain-shop",
  "medicine-shop",
  "silk-shop",
  "smithy",
  "horse-market",
  "general-store",
];

const MARKET_HOUSE_SOURCE_SHOPS: MarketShopType[] = [
  "medicine-shop",
  "silk-shop",
  "smithy",
  "general-store",
];

if (input.request.actionId === "open-settlement-trade-buy") {
  return withSessionState(
    { gameState: snapshot.state, characterDefinitions: input.characterDefinitions },
    sessionState,
    {
      overlay: {
        type: "settlement-trade",
        mode: "buy",
        selectedGoodsId: settlementTradeService.createSnapshot({
          state: snapshot.state,
          cityId: snapshot.cityDefinition.id,
          currentDay: getCalendarDayNumber(snapshot.state),
        }).rows[0]?.goodsId ?? null,
        quantity: 1,
      },
    }
  );
}

if (input.request.actionId === "confirm-settlement-trade" && currentOverlay?.type === "settlement-trade") {
  if (currentOverlay.selectedGoodsId == null) {
    return withSessionState(
      { gameState: snapshot.state, characterDefinitions: input.characterDefinitions },
      sessionState,
      { overlay: createAlertOverlay("No goods selected", ["Select a specialty good before confirming the trade."], "warning") }
    );
  }

  const playerCharacter = getPlayerCharacter(input.characterDefinitions, input.playerCharacterId);
  const resolution = settlementTradeService.resolveTrade({
    state: snapshot.state,
    cityId: snapshot.cityDefinition.id,
    currentDay: getCalendarDayNumber(snapshot.state),
    goodsId: currentOverlay.selectedGoodsId,
    mode: currentOverlay.mode,
    quantity: currentOverlay.quantity,
    playerGold: playerCharacter.stats.gold,
  });

  if (!resolution.ok) {
    return withSessionState(
      { gameState: snapshot.state, characterDefinitions: input.characterDefinitions },
      sessionState,
      { overlay: createAlertOverlay(resolution.title, resolution.paragraphs, "warning") }
    );
  }

  const mutationResult = applySettlementTradeMutations({
    state: snapshot.state,
    characterDefinitions: input.characterDefinitions,
    playerCharacterId: input.playerCharacterId,
    mutations: resolution.mutations,
  });

  return {
    ...withSessionState(
      {
        gameState: mutationResult.state,
        characterDefinitions: mutationResult.characterDefinitions,
      },
      sessionState,
      {
        overlay: createAlertOverlay("Trade completed", resolution.summaryLines, "success"),
      }
    ),
    timeAdvanceCost: 1,
  };
}
```

Update `src/application/house-modules/market-house/market-house-investigation.ts` to read from `SettlementTradeService.createInvestigationSummary()`, and add a `settlement-trade` branch to `src/ui/views/house/market-house-view.ts` that mirrors the current two-column trade popup structure instead of inventing a brand-new shell.

- [ ] **Step 4: Run the host tests to verify GREEN**

Run:

```bash
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house specialty trade integration keeps src/main.ts free of settlement trade host branches" tests/robustness.test.cjs }
```

Expected:

- `PASS` for supported-city open/buy flow.
- `PASS` for unsupported-city action hiding.
- `PASS` for the shared investigation/overlay data-path assertion.
- `PASS` for the new overlay button-sound policy.
- `PASS` for the `src/main.ts` no-branch guard.

- [ ] **Step 5: Commit the host integration task**

Run:

```bash
git add src/application/house-modules/market-house/market-house-settlement-trade.ts src/domain/house-module.ts src/domain/house-modules/market-house-session.ts src/application/house-modules/market-house/market-house-house-module.ts src/application/house-modules/market-house/market-house-investigation.ts src/ui/views/house/market-house-view.ts tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs tests/robustness.test.cjs
git commit -m "feat: host city specialty trade in market house"
```

### Task 5: Sync Shared Docs, Governance State, and Final Verification

**Files:**
- Modify: `docs/special-house-interface.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md`

**Interfaces:**
- Consumes: completed city specialty market implementation and the exact verification command list from Tasks 1-4
- Produces: shared house-interface docs that describe the reusable-host boundary
- Produces: changelog entry for the new specialty market behavior
- Produces: synchronized `Execution State` and project-progress entries set to `completed-but-open`

- [ ] **Step 1: Update the shared docs and governance markdown**

Append this bullet to the newest section of `docs/change-log.md`:

```md
- Added the city specialty market to `market-house` through a dedicated `runtime.settlementTrade` owner, a reusable `SettlementTradeService`, and typed settlement-trade mutations so specialty buy/sell pressure, 30-day resets, and investigation hints all come from one shared data path without new `src/main.ts` business branches.
```

Add this boundary note to `docs/special-house-interface.md` in the section that describes reusable subsystems or host/runtime ownership:

```md
- When a house hosts a reusable settlement-trade or specialty-market subsystem, the house module may keep overlay/session state only.
- Persistent specialty stock, price multipliers, reset timers, and inventory settlement must live in shared runtime owners and shared typed mutation appliers rather than house-local variables or `src/main.ts` branches.
- Investigation reports and trade overlays for that subsystem must read from the same resolved service snapshot so dialogue, UI, and settlement cannot drift apart.
```

Update this plan's `## Execution State` to:

```md
- Status: `completed-but-open`
- Last Updated: `2026-07-31`
- Current Focus: `Implementation complete; awaiting final review, push, and structured closeout.`
- Next Step: `Review the diff, push if requested, then add the child closeout block once remote push succeeds.`
- Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs tests/settlement-trade-mutations.test.cjs }`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs }`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house specialty trade integration keeps src/main.ts free of settlement trade host branches" tests/robustness.test.cjs }`; `npm run typecheck`; `npm run build`
- Notes: `Do not mark the child closed until project-progress sync and remote push both succeed.`
```

Append this plan progress entry:

```md
- 2026-07-31
  - Summary: `Implemented the city specialty market runtime, pricing service, shared mutation applier, market-house host overlay, and shared investigation data path.`
  - Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs tests/settlement-trade-mutations.test.cjs }`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs }`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house specialty trade integration keeps src/main.ts free of settlement trade host branches" tests/robustness.test.cjs }`; `npm run typecheck`; `npm run build`
  - Next: `Review the diff, push if requested, then add the child closeout block once remote push succeeds.`
```

Replace the `## Current State` block in `docs/superpowers/project-progress.md` with:

```md
- Current Stage: `House Local Gameplay`
- Current Stage Status: `running`
- Current Task: `City Specialty Market`
- Current Task Status: `running`
- Current Child: `City Specialty Market`
- Current Child Status: `completed-but-open`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-city-specialty-market-and-push`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md`
- Last Closed Item: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then review docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md and the current diff before pushing.`
```

Append this project-progress log entry:

```md
- 2026-07-31
  - Summary: `Implemented the city specialty market under market-house with a dedicated settlementTrade runtime owner, reusable service, shared typed mutation applier, and a shared investigation/overlay data path.`
  - Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs tests/settlement-trade-mutations.test.cjs }`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs }`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house specialty trade integration keeps src/main.ts free of settlement trade host branches" tests/robustness.test.cjs }`; `npm run typecheck`; `npm run build`
  - Next: `Review the diff, push if requested, then add the structured child closeout once remote push succeeds.`
```

- [ ] **Step 2: Run final verification**

Run:

```bash
npm run lint:plans
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/settlement-trade-service.test.cjs tests/settlement-trade-mutations.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none tests/market-house-settlement-trade.test.cjs tests/market-house-investigation.test.cjs tests/house-button-sound-policy.test.cjs }
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test --test-isolation=none --test-name-pattern "market house specialty trade integration keeps src/main.ts free of settlement trade host branches" tests/robustness.test.cjs }
npm run typecheck
npm run build
```

Expected:

- `PASS` for `npm run lint:plans`
- `PASS` for the focused settlement-trade service and mutation suites
- `PASS` for the focused `market-house` host, investigation, and button-sound suites
- `PASS` for the `src/main.ts` no-branch guard
- `PASS` for `npm run typecheck`
- `PASS` for `npm run build`

- [ ] **Step 3: Commit the docs and governance sync**

Run:

```bash
git add docs/special-house-interface.md docs/change-log.md docs/superpowers/project-progress.md docs/superpowers/plans/2026-07-31-city-specialty-market-plan.md
git commit -m "docs: record city specialty market rollout"
```

## Exit Check

- [ ] `GameState.runtime.settlementTrade` owns specialty stock, multiplier, progress, and last-traded day instead of `cityMarkets["settlement-trade"]`.
- [ ] `SettlementTradeService` resolves snapshot, investigation, and trade output without importing `market-house` session types.
- [ ] Successful specialty trades settle through typed mutations plus `applySettlementTradeMutations()` rather than direct host-local state patching.
- [ ] `market-house` hosts a `settlement-trade` overlay and hides the feature when the current runtime city has no specialty profile.
- [ ] Investigation dialogue and the specialty overlay both read from the same service data path.
- [ ] `src/main.ts` remains free of city specialty market business branches.
- [ ] Shared docs and governance state are synchronized before closeout.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
