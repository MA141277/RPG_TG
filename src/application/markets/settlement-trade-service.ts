import { defaultRuntimeContent } from "../content/default-runtime-content";
import { readPlayerItemQuantity } from "../inventory/player-item-inventory";
import type { CityId } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type {
  SettlementTradeCityGoodsProfile,
  SettlementTradeCityProfile,
  SettlementTradeGoodId,
  SettlementTradeGoodRuntimeState,
  SettlementTradeInvestigationSummary,
  SettlementTradeResolution,
  SettlementTradeSnapshot,
  SettlementTradeSnapshotRow,
  SettlementTradeTier,
} from "../../domain/settlement-trade";
import {
  settlementTradeCityProfiles,
  settlementTradeCityProfilesByCityId,
  settlementTradeTierMultipliers,
} from "../../content/markets/settlement-trade-city-profiles";
import { settlementTradeGoodsById } from "../../content/markets/settlement-trade-goods";

const RESET_DAYS = 30;
const BUY_PRICE_MULTIPLIER = 1.2;
const TRADE_PRESSURE_UNITS_PER_STEP = 10;
const MIN_PRICE_MULTIPLIER = 0.5;
const MAX_PRICE_MULTIPLIER = 2;

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

function normalizeNonNegativeRuntimeNumber(
  value: unknown,
  fallback: number
): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function normalizeSignedRuntimeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeRuntimeDay(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isRuntimeCityLoaded(cityId: CityId): boolean {
  return defaultRuntimeContent.cities.some((city) => city.id === cityId);
}

function resolveSupportedProfile(cityId: CityId): SettlementTradeCityProfile | null {
  if (!isRuntimeCityLoaded(cityId)) {
    return null;
  }

  return settlementTradeCityProfilesByCityId[cityId] ?? null;
}

function readOwnedSettlementTradeQuantity(
  state: GameState,
  goodsId: SettlementTradeGoodId
): number {
  return readPlayerItemQuantity(state, goodsId, ["market-house"]);
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

  const normalized: SettlementTradeGoodRuntimeState = {
    stockQuantity: normalizeNonNegativeRuntimeNumber(
      runtimeEntry.stockQuantity,
      input.initialStock
    ),
    priceMultiplier: normalizeNonNegativeRuntimeNumber(
      runtimeEntry.priceMultiplier,
      1
    ),
    progressUnits: normalizeSignedRuntimeNumber(runtimeEntry.progressUnits, 0),
    lastTradedDay: normalizeRuntimeDay(runtimeEntry.lastTradedDay),
  };

  if (
    normalized.lastTradedDay != null &&
    input.currentDay - normalized.lastTradedDay >= RESET_DAYS
  ) {
    return {
      stockQuantity: normalized.stockQuantity,
      priceMultiplier: 1,
      progressUnits: 0,
      lastTradedDay: null,
    };
  }

  return normalized;
}

function getProfileEntries(
  profile: SettlementTradeCityProfile
): Array<[SettlementTradeGoodId, SettlementTradeCityGoodsProfile]> {
  return (Object.entries(profile.goods) as Array<
    [SettlementTradeGoodId, SettlementTradeCityGoodsProfile | undefined]
  >).flatMap(([goodsId, goodsProfile]) =>
    goodsProfile == null ? [] : [[goodsId, goodsProfile]]
  );
}

function createSnapshotRows(input: {
  state: GameState;
  cityId: CityId;
  currentDay: number;
  profile: SettlementTradeCityProfile;
}): SettlementTradeSnapshotRow[] {
  return getProfileEntries(input.profile).map(([goodsId, goodsProfile]) => {
    const definition = settlementTradeGoodsById[goodsId];
    const runtime = readNormalizedRuntime({
      state: input.state,
      cityId: input.cityId,
      goodsId,
      currentDay: input.currentDay,
      initialStock: goodsProfile.initialStock,
    });
    const staticReferencePrice = Math.round(
      definition.basePrice * settlementTradeTierMultipliers[goodsProfile.tier]
    );
    const currentSellPrice = Math.round(
      staticReferencePrice * runtime.priceMultiplier
    );

    return {
      goodsId,
      name: definition.name,
      categoryLabel: definition.categoryLabel,
      unit: definition.unit,
      tier: goodsProfile.tier,
      tierLabel: getTierLabel(goodsProfile.tier),
      basePrice: definition.basePrice,
      staticReferencePrice,
      currentBuyPrice: Math.round(currentSellPrice * BUY_PRICE_MULTIPLIER),
      currentSellPrice,
      priceMultiplier: runtime.priceMultiplier,
      stockQuantity: runtime.stockQuantity,
      ownedQuantity: readOwnedSettlementTradeQuantity(input.state, goodsId),
      progressUnits: runtime.progressUnits,
      daysUntilReset:
        runtime.lastTradedDay == null
          ? RESET_DAYS
          : Math.max(0, RESET_DAYS - (input.currentDay - runtime.lastTradedDay)),
      routeHints: goodsProfile.routeHints == null ? [] : [...goodsProfile.routeHints],
      demandNotes:
        goodsProfile.demandNotes == null ? [] : [...goodsProfile.demandNotes],
    };
  });
}

function collectHighlightedDestinations(input: {
  originCityId: CityId;
  rows: SettlementTradeSnapshotRow[];
}): SettlementTradeInvestigationSummary["highlightedDestinations"] {
  return settlementTradeCityProfiles
    .filter((profile) => profile.cityId !== input.originCityId)
    .map((profile) => {
      const goodsById = profile.goods as Partial<
        Record<SettlementTradeGoodId, SettlementTradeCityGoodsProfile>
      >;

      return {
        cityId: profile.cityId,
        cityName: profile.cityName,
        demandedGoodsIds: input.rows
          .filter((row) => (goodsById[row.goodsId]?.demandNotes ?? []).length > 0)
          .slice(0, 2)
          .map((row) => row.goodsId),
      };
    })
    .filter((entry) => entry.demandedGoodsIds.length > 0)
    .slice(0, 2);
}

function createVoiceLines(snapshot: SettlementTradeSnapshot): string[] {
  const primary = snapshot.rows[0] ?? null;

  if (!snapshot.supported || primary == null) {
    return ["This city does not have an active specialty market."];
  }

  const secondary = snapshot.rows[1] ?? null;

  return [
    `The clearest local edge right now is ${primary.name}.`,
    secondary == null
      ? `Move ${primary.name} before the 30-day reset settles the market back to baseline.`
      : `${secondary.name} is the next-best backup lane if the lead route dries up.`,
    "Every 10 traded units moves the dynamic multiplier by 0.01, then the market cools off after 30 quiet days.",
  ];
}

function advanceTradePressure(input: {
  currentMultiplier: number;
  currentProgressUnits: number;
  signedQuantity: number;
}): { priceMultiplier: number; progressUnits: number } {
  let nextMultiplier = input.currentMultiplier;
  let nextProgressUnits = input.currentProgressUnits + input.signedQuantity;

  while (Math.abs(nextProgressUnits) >= TRADE_PRESSURE_UNITS_PER_STEP) {
    const direction = nextProgressUnits > 0 ? 1 : -1;
    const candidateMultiplier = Number(
      (nextMultiplier + direction * 0.01).toFixed(2)
    );
    const clampedMultiplier = Math.max(
      MIN_PRICE_MULTIPLIER,
      Math.min(MAX_PRICE_MULTIPLIER, candidateMultiplier)
    );

    if (clampedMultiplier === nextMultiplier) {
      return { priceMultiplier: nextMultiplier, progressUnits: 0 };
    }

    nextMultiplier = clampedMultiplier;
    nextProgressUnits -= direction * TRADE_PRESSURE_UNITS_PER_STEP;
  }

  return {
    priceMultiplier: nextMultiplier,
    progressUnits: nextProgressUnits,
  };
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

    return {
      cityId: input.cityId,
      supported: true,
      rows: createSnapshotRows({
        state: input.state,
        cityId: input.cityId,
        currentDay: input.currentDay,
        profile,
      }),
      helperLines: [
        "Buy price is 120% of the current local sell price.",
        "Every 10 traded units moves the dynamic multiplier by 0.01.",
        "Trade pressure resets after 30 quiet days.",
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

  resolveTrade(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
    goodsId: SettlementTradeGoodId;
    mode: "buy" | "sell";
    quantity: number;
    playerGold: number;
  }): SettlementTradeResolution {
    const snapshot = this.createSnapshot({
      state: input.state,
      cityId: input.cityId,
      currentDay: input.currentDay,
    });

    if (!snapshot.supported) {
      return {
        ok: false,
        code: "unsupported-city",
        title: "Specialty market unavailable",
        paragraphs: [
          "This city does not have a specialty market profile in the current runtime.",
        ],
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
        paragraphs: [
          "The city specialty market does not have enough stock for this trade.",
        ],
      };
    }

    if (input.mode === "sell" && row.ownedQuantity < input.quantity) {
      return {
        ok: false,
        code: "insufficient-owned-quantity",
        title: "Insufficient goods",
        paragraphs: [
          "The player does not own enough of this specialty good to sell it.",
        ],
      };
    }

    const unitPrice =
      input.mode === "buy" ? row.currentBuyPrice : row.currentSellPrice;
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
          type: "set-settlement-trade-multiplier",
          cityId: input.cityId,
          goodsId: input.goodsId,
          priceMultiplier: nextPressure.priceMultiplier,
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
}
