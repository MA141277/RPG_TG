import { runtimeTradeGoodsPool } from "../../content/markets/runtime-trade-goods-pool";
import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type {
  CityMarketData,
  MarketEventEffect,
  ShopMarketData,
} from "../../domain/market";
import type { MarketShopType } from "../../domain/trade-good";
import { generateShopInventory } from "./shop-inventory-generator";

type RandomSource = () => number;

function getCalendarDayNumber(state: GameState): number {
  return state.calendar.year * 360 + (state.calendar.month - 1) * 30 + state.calendar.day;
}

export function readCityMarketData(
  state: GameState,
  cityId: string
): CityMarketData | null {
  return state.runtime.cityMarkets[cityId] ?? null;
}

export function readShopMarketData(
  state: GameState,
  cityId: string,
  shopType: MarketShopType
): ShopMarketData | null {
  return state.runtime.cityMarkets[cityId]?.shops[shopType] ?? null;
}

export function shouldRefreshShopMarket(
  state: GameState,
  cityId: string,
  shopType: MarketShopType
): boolean {
  const marketData = readShopMarketData(state, cityId, shopType);
  if (marketData == null) {
    return true;
  }

  return getCalendarDayNumber(state) >= marketData.refreshAfterDay;
}

export function ensureShopMarketData(
  state: GameState,
  cityDefinition: CityDefinition,
  shopType: MarketShopType,
  marketEvents: MarketEventEffect[] = [],
  randomSource: RandomSource = Math.random
): {
  state: GameState;
  marketData: ShopMarketData;
  didRefresh: boolean;
} {
  const existingCityMarket = state.runtime.cityMarkets[cityDefinition.id];
  const existingShopMarket = existingCityMarket?.shops[shopType] ?? null;

  if (existingShopMarket != null && !shouldRefreshShopMarket(state, cityDefinition.id, shopType)) {
    return {
      state,
      marketData: existingShopMarket,
      didRefresh: false,
    };
  }

  const currentDay = getCalendarDayNumber(state);
  const nextShopMarket = generateShopInventory(
    cityDefinition,
    shopType,
    runtimeTradeGoodsPool,
    marketEvents,
    currentDay,
    randomSource
  );
  const nextCityMarket: CityMarketData = {
    cityId: cityDefinition.id,
    shops: {
      ...(existingCityMarket?.shops ?? {}),
      [shopType]: nextShopMarket,
    },
  };

  return {
    state: {
      ...state,
      runtime: {
        ...state.runtime,
        cityMarkets: {
          ...state.runtime.cityMarkets,
          [cityDefinition.id]: nextCityMarket,
        },
      },
    },
    marketData: nextShopMarket,
    didRefresh: true,
  };
}
