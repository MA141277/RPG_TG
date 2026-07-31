import { defaultRuntimeContent } from "../content/default-runtime-content";
import { readPlayerItemQuantity } from "../inventory/player-item-inventory";
import type { CityId } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type {
  SettlementTradeCityGoodsProfile,
  SettlementTradeCityProfile,
  SettlementTradeCityRuntimeMeta,
  SettlementTradeCityRuntimeState,
  SettlementTradeGoodId,
  SettlementTradeGoodRuntimeState,
  SettlementTradeInvestigationSummary,
  SettlementTradePreparedSnapshot,
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

const ASSORTMENT_REFRESH_DAYS = 10;
const RESET_DAYS = 30;
const BUY_PRICE_MULTIPLIER = 1.2;
const TRADE_PRESSURE_UNITS_PER_STEP = 10;
const MIN_PRICE_MULTIPLIER = 0.5;
const MAX_PRICE_MULTIPLIER = 2;
const CITY_RUNTIME_META_KEY = "__meta";
const SUPPORTED_HELPER_LINES = [
  "\u4e70\u5165\u4ef7\u6309\u5f53\u524d\u672c\u5730\u5356\u51fa\u4ef7\u7684 120% \u8ba1\u7b97\u3002",
  "\u6bcf\u4e70\u5356 10 \u4e2a\uff0c\u52a8\u6001\u4ef7\u683c\u500d\u6570\u53d8\u52a8 0.01\u3002",
  "\u82e5 30 \u5929\u65e0\u4eba\u78b0\u8fd9\u8def\u8d27\uff0c\u884c\u60c5\u4f1a\u56de\u5230\u57fa\u51c6\u3002",
] as const;
const settlementTradeTierAppearanceRates = {
  abundant: 1,
  local: 0.8,
  scarce: 0.6,
  "extreme-scarce": 0.4,
} as const satisfies Record<SettlementTradeTier, number>;

function getTierLabel(tier: SettlementTradeTier): string {
  switch (tier) {
    case "abundant":
      return "\u76db\u4ea7";
    case "local":
      return "\u7565\u4ea7";
    case "scarce":
      return "\u7a00\u7f3a";
    case "extreme-scarce":
      return "\u6781\u7a00\u7f3a";
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

function resolveRuntimeCityName(cityId: CityId, fallback: string): string {
  return (
    defaultRuntimeContent.cities.find((city) => city.id === cityId)?.name ?? fallback
  );
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

function readRuntimeCityState(
  state: GameState,
  cityId: CityId
): SettlementTradeCityRuntimeState {
  return state.runtime.settlementTrade[cityId] ?? {};
}

function readNormalizedRuntime(input: {
  state: GameState;
  cityId: CityId;
  goodsId: SettlementTradeGoodId;
  currentDay: number;
  initialStock: number;
}): SettlementTradeGoodRuntimeState {
  const runtimeEntry = readRuntimeCityState(input.state, input.cityId)[input.goodsId] ?? null;
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

function readNormalizedCityMeta(input: {
  state: GameState;
  cityId: CityId;
  profile: SettlementTradeCityProfile;
}): SettlementTradeCityRuntimeMeta | null {
  const runtimeMeta = readRuntimeCityState(input.state, input.cityId)[
    CITY_RUNTIME_META_KEY
  ];

  if (runtimeMeta == null || typeof runtimeMeta !== "object") {
    return null;
  }

  const allowedGoodsIds = new Set(
    getProfileEntries(input.profile).map(([goodsId]) => goodsId)
  );
  const visibleGoodsIds = Array.isArray(runtimeMeta.visibleGoodsIds)
    ? runtimeMeta.visibleGoodsIds.filter(
        (goodsId): goodsId is SettlementTradeGoodId => allowedGoodsIds.has(goodsId)
      )
    : [];
  const lastRefreshedDay = normalizeRuntimeDay(runtimeMeta.lastRefreshedDay);

  if (lastRefreshedDay == null) {
    return null;
  }

  return {
    visibleGoodsIds: [...visibleGoodsIds],
    lastRefreshedDay,
  };
}

function selectVisibleGoodsIds(
  profile: SettlementTradeCityProfile,
  random: () => number
): SettlementTradeGoodId[] {
  return getProfileEntries(profile).flatMap(([goodsId, goodsProfile]) => {
    const appearanceRate = settlementTradeTierAppearanceRates[goodsProfile.tier];
    return appearanceRate >= 1 || random() < appearanceRate ? [goodsId] : [];
  });
}

function createSnapshotRows(input: {
  state: GameState;
  cityId: CityId;
  currentDay: number;
  profile: SettlementTradeCityProfile;
  visibleGoodsIds?: readonly SettlementTradeGoodId[] | null;
}): SettlementTradeSnapshotRow[] {
  const visibleGoodsIds =
    input.visibleGoodsIds == null ? null : new Set(input.visibleGoodsIds);

  return getProfileEntries(input.profile)
    .filter(([goodsId]) => visibleGoodsIds == null || visibleGoodsIds.has(goodsId))
    .map(([goodsId, goodsProfile]) => {
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

function createUnsupportedSnapshot(cityId: CityId): SettlementTradeSnapshot {
  return {
    cityId,
    supported: false,
    rows: [],
    helperLines: ["\u6b64\u5730\u5c1a\u672a\u5f00\u901a\u7279\u4ea7\u5546\u5708\u3002"],
    lastRefreshedDay: null,
    nextRefreshDay: null,
  };
}

function createSupportedSnapshot(input: {
  state: GameState;
  cityId: CityId;
  currentDay: number;
  profile: SettlementTradeCityProfile;
  visibleGoodsIds?: readonly SettlementTradeGoodId[] | null;
  lastRefreshedDay?: number | null;
}): SettlementTradeSnapshot {
  return {
    cityId: input.cityId,
    supported: true,
    rows: createSnapshotRows({
      state: input.state,
      cityId: input.cityId,
      currentDay: input.currentDay,
      profile: input.profile,
      visibleGoodsIds: input.visibleGoodsIds ?? null,
    }),
    helperLines: [...SUPPORTED_HELPER_LINES],
    lastRefreshedDay: input.lastRefreshedDay ?? null,
    nextRefreshDay:
      input.lastRefreshedDay == null
        ? null
        : input.lastRefreshedDay + ASSORTMENT_REFRESH_DAYS,
  };
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
        cityName: resolveRuntimeCityName(profile.cityId, profile.cityName),
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
    return ["\u6b64\u5730\u773c\u4e0b\u8fd8\u6ca1\u5f00\u51fa\u7a33\u5b9a\u7684\u7279\u4ea7\u5546\u5708\u3002"];
  }

  const secondary = snapshot.rows[1] ?? null;

  return [
    `\u773c\u4e0b\u672c\u5730\u6700\u597d\u8d70\u7684\u662f${primary.name}\u3002`,
    secondary == null
      ? `\u8981\u8d81${primary.name}\u8fd9\u8def\u8d27 30 \u5929\u56de\u76d8\u524d\u5148\u51fa\u624b\uff0c\u62d6\u4e45\u4e86\u884c\u60c5\u5c31\u4f1a\u6162\u6162\u56de\u5230\u57fa\u51c6\u3002`
      : `${secondary.name}\u4e5f\u80fd\u63a5\u624b\uff0c\u4e3b\u8def\u8d70\u4e0d\u901a\u65f6\u53ef\u4ee5\u5148\u62ff\u5b83\u9876\u4e0a\u3002`,
    "\u6bcf\u4e70\u5356 10 \u4e2a\uff0c\u884c\u60c5\u500d\u6570\u5c31\u4f1a\u53d8\u52a8 0.01\uff1b\u82e5 30 \u5929\u6ca1\u4eba\u52a8\u5b83\uff0c\u53c8\u4f1a\u6162\u6162\u56de\u5230\u57fa\u51c6\u3002",
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
  constructor(private readonly random: () => number = () => Math.random()) {}

  createSnapshot(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
  }): SettlementTradeSnapshot {
    const profile = resolveSupportedProfile(input.cityId);

    if (profile == null) {
      return createUnsupportedSnapshot(input.cityId);
    }

    const cityMeta = readNormalizedCityMeta({
      state: input.state,
      cityId: input.cityId,
      profile,
    });

    return createSupportedSnapshot({
      state: input.state,
      cityId: input.cityId,
      currentDay: input.currentDay,
      profile,
      visibleGoodsIds: cityMeta?.visibleGoodsIds ?? null,
      lastRefreshedDay: cityMeta?.lastRefreshedDay ?? null,
    });
  }

  prepareSnapshot(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
  }): SettlementTradePreparedSnapshot {
    const profile = resolveSupportedProfile(input.cityId);

    if (profile == null) {
      return {
        snapshot: createUnsupportedSnapshot(input.cityId),
        mutations: [],
      };
    }

    const cityMeta = readNormalizedCityMeta({
      state: input.state,
      cityId: input.cityId,
      profile,
    });
    const lastRefreshedDay = cityMeta?.lastRefreshedDay ?? null;
    const shouldRefresh =
      lastRefreshedDay == null ||
      input.currentDay - lastRefreshedDay >= ASSORTMENT_REFRESH_DAYS;
    const nextMeta: {
      visibleGoodsIds: SettlementTradeGoodId[];
      lastRefreshedDay: number;
    } = shouldRefresh
      ? {
          visibleGoodsIds: selectVisibleGoodsIds(profile, this.random),
          lastRefreshedDay: input.currentDay,
        }
      : {
          visibleGoodsIds: [...(cityMeta?.visibleGoodsIds ?? [])],
          lastRefreshedDay: lastRefreshedDay ?? input.currentDay,
        };

    return {
      snapshot: createSupportedSnapshot({
        state: input.state,
        cityId: input.cityId,
        currentDay: input.currentDay,
        profile,
        visibleGoodsIds: nextMeta.visibleGoodsIds,
        lastRefreshedDay: nextMeta.lastRefreshedDay,
      }),
      mutations:
        shouldRefresh
          ? [
              {
                type: "set-settlement-trade-city-assortment",
                cityId: input.cityId,
                visibleGoodsIds: nextMeta.visibleGoodsIds,
                refreshedDay: input.currentDay,
              },
            ]
          : [],
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
        title: "\u7279\u4ea7\u5546\u5708\u672a\u5f00\u901a",
        paragraphs: ["\u8fd9\u5ea7\u57ce\u6682\u65f6\u8fd8\u6ca1\u6709\u6210\u5f62\u7684\u7279\u4ea7\u5546\u5708\u3002"],
      };
    }

    const row = snapshot.rows.find((candidate) => candidate.goodsId === input.goodsId);
    if (row == null) {
      return {
        ok: false,
        code: "unknown-goods",
        title: "\u672a\u627e\u5230\u7279\u4ea7",
        paragraphs: ["\u8fd9\u5ea7\u57ce\u5f53\u524d\u6ca1\u6709\u8fd9\u8def\u7279\u4ea7\u53ef\u4f9b\u4ea4\u6613\u3002"],
      };
    }

    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      return {
        ok: false,
        code: "invalid-quantity",
        title: "\u6570\u91cf\u4e0d\u5bf9",
        paragraphs: ["\u4ea4\u6613\u6570\u91cf\u5fc5\u987b\u662f\u5927\u4e8e 0 \u7684\u6574\u6570\u3002"],
      };
    }

    if (input.mode === "buy" && row.stockQuantity < input.quantity) {
      return {
        ok: false,
        code: "insufficient-stock",
        title: "\u5b58\u8d27\u4e0d\u8db3",
        paragraphs: ["\u8fd9\u5ea7\u57ce\u7684\u7279\u4ea7\u5b58\u8d27\u4e0d\u591f\uff0c\u505a\u4e0d\u4e86\u8fd9\u7b14\u4e70\u5356\u3002"],
      };
    }

    if (input.mode === "sell" && row.ownedQuantity < input.quantity) {
      return {
        ok: false,
        code: "insufficient-owned-quantity",
        title: "\u6301\u8d27\u4e0d\u8db3",
        paragraphs: ["\u4f60\u624b\u91cc\u7684\u8fd9\u8def\u7279\u4ea7\u4e0d\u591f\uff0c\u5356\u4e0d\u4e86\u8fd9\u4e48\u591a\u3002"],
      };
    }

    const unitPrice =
      input.mode === "buy" ? row.currentBuyPrice : row.currentSellPrice;
    const totalPrice = unitPrice * input.quantity;

    if (input.mode === "buy" && input.playerGold < totalPrice) {
      return {
        ok: false,
        code: "insufficient-gold",
        title: "\u94f6\u94b1\u4e0d\u591f",
        paragraphs: ["\u4f60\u624b\u5934\u94f6\u94b1\u4e0d\u591f\uff0c\u4e70\u4e0d\u4e0b\u8fd9\u7b14\u8d27\u3002"],
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
        `${input.mode === "buy" ? "\u4e70\u5165" : "\u5356\u51fa"} ${input.quantity}${row.unit}${row.name}\u3002`,
        `${input.mode === "buy" ? "\u82b1\u8d39" : "\u6536\u5165"} ${totalPrice} \u6587\u3002`,
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
          type: "set-settlement-trade-stock",
          cityId: input.cityId,
          goodsId: input.goodsId,
          stockQuantity:
            input.mode === "buy"
              ? row.stockQuantity - input.quantity
              : row.stockQuantity + input.quantity,
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
