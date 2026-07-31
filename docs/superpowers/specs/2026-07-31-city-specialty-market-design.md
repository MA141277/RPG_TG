# City Specialty Market Design

## 1. Goal

Add a reusable city-specialty market system for the current runtime cities only.

The feature must:

- follow the repository's `mod-first / event-owned / settlement` boundary direction
- avoid new business branches in `src/main.ts`
- keep `market-house` as the host module instead of creating a new house
- emit typed trade mutations/effects instead of performing ad hoc trade settlement in the host module
- be structured so future cities, future specialty goods, and future hosts can attach without redesigning the core trade mechanism

This batch covers:

- a dedicated city-specialty market runtime owner
- fixed city specialty profiles for the current runtime-supported cities
- buy/sell flow inside `market-house`
- dynamic price movement from player trading
- 30-day reset to baseline pricing
- typed mutation output plus shared mutation application
- aligned market investigation text driven by the same specialty-market data

This batch does not cover:

- all 21 cities from the planning document
- converting `grain-shop` or `medicine-house` onto this mechanism in the same cut
- expanding `src/core/contracts/effect.ts` in the same cut
- replacing the existing random ordinary-market flow in `market-house`
- adding a new special house module

## 2. Current Mismatch

The current branch already has partial settlement-trade groundwork, but ownership is split across mismatched systems.

Current local state:

- `src/content/markets/settlement-trade-profiles.ts` holds historical export/shortage draft data
- `src/application/markets/settlement-trade-draft-pricing.ts` and `settlement-market-bias.ts` can derive settlement-aware prices
- `market-house` still owns direct gold, inventory, and stock mutation inside `src/application/house-modules/market-house/market-house-house-module.ts`
- `cityMarkets["settlement-trade"]` still follows the ordinary random shop refresh model

Current mismatch:

- the specialty market has no dedicated shared runtime owner for stock, price multipliers, or reset timing
- the `market-house` host still mixes UI/session ownership with specialty-market settlement ownership
- the ordinary `cityMarkets` 3-7 day random refresh model conflicts with the planned fixed specialty market plus dynamic price pressure plus 30-day reset behavior
- investigation dialogue currently reads draft settlement-trade content directly instead of the same resolved runtime view the player trades against

## 3. Scope And Host Decision

This change does not create a new special house module.

`market-house` remains the host and UI entry owner. The shared special-house contract still applies because the module is being extended with a new reusable subsystem.

Host rule:

- `market-house` may open and render the city-specialty market
- `market-house` may keep typed overlay/session state such as selected goods id, mode, and quantity input
- `market-house` must not own specialty-market business settlement, price-pressure rules, or 30-day reset rules

The specialty-market mechanism must therefore sit below the host module as a reusable application/domain unit.

## 4. Boundary Decisions

### 4.1 Main Shell Boundary

- Do not add city-specialty market branches to `src/main.ts`.
- Do not add `market-house`, `grain-shop`, `medicine-house`, or goods-id specific trade branches to the entrypoint.
- All wiring continues through the existing `moduleId + registry + house runtime` path.

### 4.2 House Host Boundary

`market-house` remains responsible for:

- exposing the feature entry action
- opening and closing the typed overlay
- tracking temporary selection and quantity session state
- calling the reusable city-specialty market service
- passing returned typed mutations into the shared mutation applier

`market-house` must not:

- compute price resets itself
- directly change specialty-market multipliers itself
- directly patch specialty-market runtime stock itself
- re-derive shortage routes separately from the service

### 4.3 Runtime Ownership Boundary

Do not reuse `GameState.runtime.cityMarkets["settlement-trade"]` as the owner for this feature.

Reason:

- `cityMarkets` currently models ordinary random shop inventory with 3-7 day refresh windows
- the city-specialty market needs fixed city-good coverage, trade-pressure-driven pricing, and 30-day reset semantics
- both models can coexist, but they should not share one runtime owner

New owner:

- add `GameState.runtime.settlementTrade`

This branch owns:

- per-city specialty stock
- per-city/per-good dynamic price multiplier
- per-city/per-good residual trade progress
- per-city/per-good last traded day

### 4.4 Mutation Boundary

The reusable trade mechanism must not directly mutate `GameState` from inside `market-house`.

Instead:

- `SettlementTradeService` resolves the trade request and emits typed mutations
- `applySettlementTradeMutations()` applies those mutations to `GameState` and `characterDefinitions`

This keeps the feature aligned with the repository direction:

- host module owns the session shell
- reusable trade service owns business rules
- shared mutation applier owns persistent state settlement

### 4.5 Reusable Class Boundary

The core mechanism must be implemented as an independent reusable class:

- `src/application/markets/settlement-trade-service.ts`
- `class SettlementTradeService`

It must not be a pile of `market-house`-local helper functions embedded into the host module.

The class should accept stable dependencies through construction or explicit method input so future hosts can reuse it without importing `market-house`.

### 4.6 Investigation Boundary

`market-house` investigation and route hints must consume the same specialty-market service data that drives actual prices and trade opportunities.

Do not keep one data path for:

- displayed city-specialty prices

and a separate unrelated path for:

- investigation dialogue

The player-facing report, the visible overlay, and the actual trade resolution must all derive from the same resolved specialty-market state.

## 5. Content Model

### 5.1 Dedicated Specialty Goods Content

Add:

- `src/content/markets/settlement-trade-goods.ts`

This file owns the stable specialty-goods catalog for this feature.

Recommended shape:

```ts
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

export type SettlementTradeGoodDefinition = {
  id: SettlementTradeGoodId;
  name: string;
  categoryLabel: string;
  unit: string;
  basePrice: number;
  description: string;
};
```

Rules:

- this catalog is the gameplay owner for city-specialty goods
- it is not a thin alias around the current ordinary `TradeGoodDefinition`
- the ids must remain stable so player inventory and runtime state can key off them long-term

### 5.2 Dedicated City Profiles

Add:

- `src/content/markets/settlement-trade-city-profiles.ts`

Recommended shape:

```ts
export type SettlementTradeTier =
  | "abundant"
  | "local"
  | "scarce"
  | "extreme-scarce";

export type SettlementTradeCityProfile = {
  cityId: CityId;
  goods: Partial<
    Record<
      SettlementTradeGoodId,
      {
        tier: SettlementTradeTier;
        initialStock: number;
        routeHints?: string[];
        demandNotes?: string[];
      }
    >
  >;
};
```

Rules:

- author profiles only for the subset of cities that already exist in the current runtime city definitions
- do not force the full 21-city matrix into this first cut
- do not write empty placeholder rows for unsupported cities
- later cities should be attachable by adding one more city profile, not by modifying service logic

### 5.3 Tier Multipliers

The feature uses the planning-approved city tier multipliers:

- `abundant = 1.0`
- `local = 1.4`
- `scarce = 2.2`
- `extreme-scarce = 3.0`

Interpretation:

- the tier multiplier defines the city's static specialty baseline before dynamic trade pressure is applied
- the dynamic runtime multiplier then moves on top of that baseline

### 5.4 Existing Draft Content As Reference Only

`src/content/markets/settlement-trade-profiles.ts` may remain as authoring reference during the migration, but it must not remain the runtime owner for the new city-specialty market path.

Reason:

- that file mixes historical notes, ordinary-runtime fallback ids, and temporary arbitrage assumptions
- the new feature needs a dedicated gameplay owner with direct city-specialty ids and stable host/runtime semantics

## 6. Runtime State Contract

### 6.1 New Runtime Branch

Add to `GameState.runtime`:

```ts
settlementTrade: SettlementTradeRuntimeState;
```

Recommended types:

```ts
export type SettlementTradeGoodRuntimeState = {
  stockQuantity: number;
  priceMultiplier: number;
  progressUnits: number;
  lastTradedDay: number | null;
};

export type SettlementTradeCityRuntimeState = Partial<
  Record<SettlementTradeGoodId, SettlementTradeGoodRuntimeState>
>;

export type SettlementTradeRuntimeState = Partial<
  Record<CityId, SettlementTradeCityRuntimeState>
>;
```

### 6.2 Missing Runtime Entry Semantics

Missing runtime state must be interpreted as default content-backed state:

- `stockQuantity = profile.initialStock`
- `priceMultiplier = 1.0`
- `progressUnits = 0`
- `lastTradedDay = null`

Read paths should treat missing entries as implicit defaults.

Do not create a top-level startup migration that eagerly materializes every specialty good for every city in this batch.

### 6.3 No Host-Local Persistent Copies

Do not store persistent specialty-market data in:

- `market-house` session state
- `var.market_house.*` runtime variables
- top-level globals

`market-house` session state may keep:

- selected goods id
- quantity input
- current mode
- overlay-local helper text

It must not keep:

- specialty stock
- specialty price multiplier
- specialty reset timers

## 7. Reusable Service Contract

Add:

- `src/application/markets/settlement-trade-service.ts`

Recommended primary class:

```ts
export class SettlementTradeService {
  createSnapshot(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
  }): SettlementTradeSnapshot;

  createInvestigationSummary(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
  }): SettlementTradeInvestigationSummary;

  resolveTrade(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
    goodsId: SettlementTradeGoodId;
    mode: "buy" | "sell";
    quantity: number;
    playerGold: number;
  }): SettlementTradeResolution;
}
```

Rules:

- the class must be reusable by future hosts
- it must not import `market-house` session types
- it may consume stable content catalogs and stable inventory/runtime helpers
- it must own specialty-market rules, validation, and trade mutation generation

## 8. Snapshot And Overlay Contract

### 8.1 Snapshot Row Contract

Add domain types in:

- `src/domain/settlement-trade.ts`

Recommended row shape:

```ts
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

### 8.2 House Overlay Contract

Extend `src/domain/house-module.ts` with a new overlay variant:

- `type: "settlement-trade"`

Do not reuse the current ordinary `market-trade` overlay contract.

Reason:

- the city-specialty market needs city tier, dynamic multiplier, reset countdown, player-owned count, and route-hint fields that should not pollute the ordinary market overlay

Required overlay fields:

- `mode`
- `quantity`
- `quantityFieldId`
- `rows`
- `selectedSummary`
- `helperLines`
- `confirmActionId`
- `cancelActionId`
- increment/decrement action ids

`rows` should carry at least:

- `goodsId`
- `name`
- `categoryLabel`
- `unit`
- `tierLabel`
- `buyPrice`
- `sellPrice`
- `basePrice`
- `priceMultiplier`
- `stockQuantity`
- `ownedQuantity`
- `daysUntilReset`
- `priceTone`
- `isSelected`

`selectedSummary` should carry at least:

- `goodsId`
- `name`
- `unit`
- `tierLabel`
- `buyPrice`
- `sellPrice`
- `stockQuantity`
- `ownedQuantity`
- `tradeTotal`
- `daysUntilReset`
- `nextStepHint`
- `supplyHint`

## 9. Pricing And Reset Rules

### 9.1 Static City Baseline

For a city/good pair:

```text
staticReferencePrice = round(goods.basePrice * tierMultiplier)
```

This is the city's baseline specialty price before dynamic trade pressure.

### 9.2 Dynamic Runtime Price

```text
currentSellPrice = round(staticReferencePrice * priceMultiplier)
currentBuyPrice = round(currentSellPrice * 1.2)
```

Rules:

- the player sells to the market at `currentSellPrice`
- the player buys from the market at `currentBuyPrice`
- tests must lock that buy remains `round(sell * 1.2)`

### 9.3 30-Day Reset

If:

```text
currentDay - lastTradedDay >= 30
```

then the service must treat the good as reset for read and trade-resolution purposes:

- `priceMultiplier = 1.0`
- `progressUnits = 0`

The next trade then writes a fresh `lastTradedDay = currentDay`.

This reset must be owned by the shared specialty-market service, not by UI text or host-module conditionals.

## 10. Trade Pressure Algorithm

### 10.1 Progress Unit Semantics

Use signed `progressUnits` so partial trades accumulate across requests:

- buy adds positive units
- sell adds negative units

Examples:

- buy `5`, then buy `5` again: the second trade must trigger `+0.01`
- sell `7`, then sell `3`: the second trade must trigger `-0.01`

### 10.2 Multiplier Step Rule

For every `10` net traded units:

- buy direction: `priceMultiplier += 0.01`
- sell direction: `priceMultiplier -= 0.01`

### 10.3 Clamp Rule

Clamp:

- minimum `0.5`
- maximum `2.0`

If the multiplier reaches either clamp boundary, discard any overflow progress instead of storing residual pressure beyond the cap.

Reason:

- otherwise stale residual units would leak through the boundary and distort later reverse-direction trades

### 10.4 Residual Progress Rule

If a trade crosses multiple 10-unit thresholds:

- apply as many `0.01` steps as allowed by the clamp
- keep only the remaining residual progress within the active range

Example:

- current multiplier `1.00`
- current progress `0`
- buy `25`
- next multiplier `1.02`
- next progress `5`

## 11. Typed Mutation Contract

Add domain types in:

- `src/domain/settlement-trade.ts`

Recommended mutation union:

```ts
export type SettlementTradeMutation =
  | {
      type: "change-player-gold";
      amount: number;
    }
  | {
      type: "change-player-item";
      itemId: SettlementTradeGoodId;
      delta: number;
    }
  | {
      type: "set-settlement-trade-stock";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      stockQuantity: number;
    }
  | {
      type: "set-settlement-trade-multiplier";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      priceMultiplier: number;
    }
  | {
      type: "set-settlement-trade-progress";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      progressUnits: number;
    }
  | {
      type: "set-settlement-trade-last-traded-day";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      dayNumber: number;
    };
```

Rules:

- `SettlementTradeService` computes the final mutation set
- `applySettlementTradeMutations()` applies the mutations without re-deriving business rules
- `set-settlement-trade-stock` must carry the final post-trade stock quantity resolved from the snapshot baseline; the applier must not infer missing-entry stock deltas
- `change-player-item` must settle through the shared player-item inventory path under `var.player_inventory.item.<itemId>`
- no new player-owned specialty inventory copy may be introduced

### 11.1 Resolution Contract

Recommended resolution shape:

```ts
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

This keeps validation and structured failure reporting inside the reusable trade service rather than re-spreading it into the host module.

## 12. Shared Mutation Application

Add:

- `src/application/markets/apply-settlement-trade-mutations.ts`

Responsibilities:

- apply `change-player-gold`
- apply `change-player-item`
- apply specialty runtime stock writes
- apply specialty runtime multiplier writes
- apply progress and day writes

Rules:

- the applier may reuse existing shared inventory and character-mutation helpers
- specialty runtime writes should use the final values resolved by the service rather than re-deriving deltas from possibly missing runtime entries
- it must not know about `market-house` session state
- it must not return HTML

## 13. Integration With `market-house`

### 13.1 Shared Host Actions

Reuse the existing host actions such as:

- `buy-goods`
- `sell-goods`
- `select-market-goods:<goodsId>`
- `confirm-trade`
- quantity increment/decrement and field actions

Rules:

- do not add a second pair of dedicated `特产买入 / 特产卖出` buttons in the host menu
- these remain `market-house` host actions, not `main.ts` actions
- settlement-trade goods should plug into the same typed `market-trade` overlay contract already used by the host

### 13.2 Coexistence With Ordinary Market Flow

Do not delete the existing ordinary market compatibility code in this batch.

This feature should coexist with that compatibility layer inside `market-house`, but the current shared buy/sell UI should surface settlement-trade goods only.

Reason:

- the user requested a new city-specialty market feature
- replacing all existing ordinary market behavior would enlarge scope and muddle regression ownership
- keeping the legacy path explicitly marked but hidden from the shared overlay preserves future refactor space without leaving duplicate visible trade entries

### 13.3 Unsupported City Behavior

If the current city lacks a specialty profile:

- hide the city-specialty market action, or
- show a structured empty-state alert such as "本城暂无成型商圈"

Do not silently fall back to the ordinary random market data and pretend it is the specialty market.

## 14. Investigation And Route Hints

`market-house` investigation output for the city-specialty market must be driven from the same `SettlementTradeService` data used for trading.

Recommended service output:

```ts
export type SettlementTradeInvestigationSummary = {
  cityId: CityId;
  headlineGoodsIds: SettlementTradeGoodId[];
  highlightedDestinations: Array<{
    cityId: CityId;
    cityName: string;
    demandedGoodsIds: SettlementTradeGoodId[];
  }>;
  voiceLines: string[];
};
```

Rules:

- route hints must come from current supported city profiles, not from a separate ad hoc dialogue table
- visible route guidance must not disagree with the trade overlay's price tiers or demand model
- the fixed host `调查行情` presentation may collapse into one randomized shopkeeper route line, but that line must still be rendered from content-owned templates plus the same resolved specialty-summary data
- when route guidance names a destination city, player-facing text should display the compact/final city name (`合肥`) rather than legacy composite names like `庐州路※合肥` or bare historical route prefixes like `庐州路`
- guest-merchant inquiry may keep a separate presentation contract as long as it reads the same shared summary owner and does not reintroduce a second settlement rule path

## 15. Testing Strategy

### 15.1 Service Tests

Add focused tests proving:

- only supported current-runtime cities expose specialty-market rows
- unsupported cities return empty/unsupported results
- missing runtime entries read as content-backed defaults
- 30-day reset returns multiplier to `1.0`
- `progressUnits` accumulate across multiple partial trades
- multiplier step logic applies one `0.01` change per `10` units
- multiplier is clamped to `0.5 ~ 2.0`
- overflow progress is discarded at clamp boundaries
- `buyPrice === round(sellPrice * 1.2)`

### 15.2 Mutation Applier Tests

Add focused tests proving one successful trade updates:

- player gold
- player item quantity
- city stock
- city-good multiplier
- city-good progress
- city-good last traded day

### 15.3 Host Integration Tests

Extend `market-house` regressions to prove:

- supported city host opens the city-specialty market overlay
- buy flow succeeds and returns through the host overlay correctly
- sell flow succeeds and returns through the host overlay correctly
- unsupported city path stays hidden or returns the expected empty-state alert
- investigation text and trade overlay both draw from the same supported city data path

### 15.4 Shell Guard

Keep or extend shell guards proving:

- no new `main.ts` branch for `market-house`
- no new `main.ts` branch for city-specialty goods
- no new `main.ts` settlement-trade special case

## 16. Expected File Impact

Expected new files:

- `src/domain/settlement-trade.ts`
- `src/content/markets/settlement-trade-goods.ts`
- `src/content/markets/settlement-trade-city-profiles.ts`
- `src/application/markets/settlement-trade-service.ts`
- `src/application/markets/apply-settlement-trade-mutations.ts`
- focused tests for service and mutation applier

Expected modified files:

- `src/domain/game-state.ts`
- `src/domain/house-module.ts`
- `src/application/house-modules/market-house/market-house-house-module.ts`
- `src/ui/views/house/market-house-view.ts`
- `src/application/inventory/player-item-inventory.ts` only if a tiny helper extension is needed for stable specialty goods settlement
- `tests/robustness.test.cjs`
- `tests/house-button-sound-policy.test.cjs` if the new overlay needs explicit button-sound coverage

Expected non-goals in this batch:

- `src/main.ts`
- `grain-shop` settlement ownership
- `medicine-house` settlement ownership
- ordinary random `cityMarkets` refresh semantics

## 17. Out Of Scope

- full 21-city rollout
- migrating `grain-shop` or `medicine-house` to this subsystem
- adding a new `Effect` family to `src/core/contracts/effect.ts`
- rewriting `market-house` ordinary goods flow
- introducing a new special house module
- replacing existing random shop inventory generation

## 18. Exit Conditions

This design is complete when:

- the city-specialty market has a dedicated runtime owner under `GameState.runtime.settlementTrade`
- `market-house` hosts the feature without owning its persistent trade settlement rules
- the core specialty mechanism exists as a reusable independent class
- trades resolve into typed mutations instead of direct host-local settlement branches
- current runtime-supported city profiles can be attached without editing `main.ts`
- unsupported cities safely show no specialty market path
- price pressure and 30-day reset both behave deterministically
- investigation and trade overlay consume the same specialty-market data path
