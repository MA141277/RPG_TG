import {
  grainShopMarketRumors,
  grainShopNpcDefaultLines,
  grainShopNpcGreetings,
} from "../../content/houses/grain-shop-content";
import { globalGoodsPool } from "../../content/markets/global-goods-pool";
import { prototypeCities } from "../../content/prototype-world";
import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type { ShopInventoryEntry, ShopMarketData } from "../../domain/market";
import type { TradeGoodDefinition } from "../../domain/trade-good";
import { assertExists } from "../../shared/assert";
import { pickRandom } from "../../shared/random";
import { ensureShopMarketData } from "../markets/market-refresh-system";
import { selectCurrentCity } from "../selectors/select-current-city";

const PREFERRED_GRAIN_GOOD_IDS = ["rice", "wheat", "millet", "soybean", "salt"] as const;

export function pickNpcGreeting(): string {
  return pickRandom(grainShopNpcGreetings);
}

export function pickNpcDefaultLine(): string {
  return pickRandom(grainShopNpcDefaultLines);
}

export function pickMarketRumor(): string {
  return pickRandom(grainShopMarketRumors);
}

export function getInvestigateDialogue(price: number): string {
  if (price > 130) {
    return "近来粮价怕是要涨。";
  }
  if (price < 100) {
    return "如今粮路通畅，价倒是便宜。";
  }
  return "粮价还算平稳。";
}

export function getTradeTotal(grainPrice: number, quantity: number): number {
  return grainPrice * quantity;
}

function pickFeaturedEntry(marketData: ShopMarketData): ShopInventoryEntry {
  for (const goodsId of PREFERRED_GRAIN_GOOD_IDS) {
    const matchedEntry = marketData.inventory.find((entry) => entry.goodsId === goodsId);
    if (matchedEntry != null) {
      return matchedEntry;
    }
  }

  const [firstEntry] = marketData.inventory;
  assertExists(firstEntry, "Grain shop market inventory is empty.");
  return firstEntry;
}

function pickFeaturedGood(goodsId: string): TradeGoodDefinition {
  const goodDefinition = globalGoodsPool.find((candidateGood) => candidateGood.id === goodsId);
  assertExists(goodDefinition, `Trade good not found for id "${goodsId}".`);
  return goodDefinition;
}

export type GrainMarketSnapshot = {
  state: GameState;
  cityDefinition: CityDefinition;
  marketData: ShopMarketData;
  featuredEntry: ShopInventoryEntry;
  featuredGood: TradeGoodDefinition;
};

export function ensureCurrentGrainMarket(state: GameState): GrainMarketSnapshot {
  const cityDefinition = selectCurrentCity(state, prototypeCities);
  assertExists(
    cityDefinition,
    `Current city "${state.world.currentCityId}" is missing from prototype city content.`
  );

  const ensuredMarket = ensureShopMarketData(state, cityDefinition, "grain-shop");
  const featuredEntry = pickFeaturedEntry(ensuredMarket.marketData);

  return {
    state: ensuredMarket.state,
    cityDefinition,
    marketData: ensuredMarket.marketData,
    featuredEntry,
    featuredGood: pickFeaturedGood(featuredEntry.goodsId),
  };
}

export function getQuotedGrainPrice(state: GameState): {
  state: GameState;
  buyPrice: number;
  sellPrice: number;
  goodName: string;
} {
  const market = ensureCurrentGrainMarket(state);
  return {
    state: market.state,
    buyPrice: market.featuredEntry.buyPrice,
    sellPrice: market.featuredEntry.sellPrice,
    goodName: market.featuredGood.name,
  };
}
