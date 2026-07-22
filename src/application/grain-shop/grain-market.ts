import { globalGoodsPool } from "../../content/markets/global-goods-pool";
import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type { ShopInventoryEntry, ShopMarketData } from "../../domain/market";
import type { TradeGoodDefinition } from "../../domain/trade-good";
import { assertExists } from "../../shared/assert";
import { pickRandom } from "../../shared/random";
import { defaultRuntimeContent } from "../content/default-runtime-content";
import { resolveTextEntry } from "../content/text-resolution";
import { getGrainShopContentDefaults } from "./grain-shop-content-defaults";
import { ensureShopMarketData } from "../markets/market-refresh-system";
import { selectCurrentCity } from "../selectors/select-current-city";

const PREFERRED_GRAIN_GOOD_IDS = ["rice", "wheat", "millet", "soybean", "salt"] as const;

function getGrainMarketTextEntries(
  textEntriesById?: Record<string, string>
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function pickResolvedText(
  textEntriesById: Record<string, string>,
  textIds: string[]
): string {
  const textId = pickRandom(textIds);
  return resolveTextEntry(textEntriesById, textId, `MISSING_TEXT:${textId}`);
}

export function pickNpcGreeting(textEntriesById?: Record<string, string>): string {
  const { grainShopNpcGreetingTextIds } = getGrainShopContentDefaults();
  return pickResolvedText(
    getGrainMarketTextEntries(textEntriesById),
    grainShopNpcGreetingTextIds
  );
}

export function pickNpcDefaultLine(textEntriesById?: Record<string, string>): string {
  const { grainShopNpcDefaultLineTextIds } = getGrainShopContentDefaults();
  return pickResolvedText(
    getGrainMarketTextEntries(textEntriesById),
    grainShopNpcDefaultLineTextIds
  );
}

export function pickMarketRumor(textEntriesById?: Record<string, string>): string {
  const { grainShopMarketRumorTextIds } = getGrainShopContentDefaults();
  return pickResolvedText(
    getGrainMarketTextEntries(textEntriesById),
    grainShopMarketRumorTextIds
  );
}

export function getInvestigateDialogue(
  price: number,
  textEntriesById?: Record<string, string>
): string {
  const entries = getGrainMarketTextEntries(textEntriesById);
  if (price > 130) {
    return resolveTextEntry(
      entries,
      "runtime.zhu_yuanzhang.grain_market.investigate.high",
      "MISSING_TEXT:runtime.zhu_yuanzhang.grain_market.investigate.high"
    );
  }
  if (price < 100) {
    return resolveTextEntry(
      entries,
      "runtime.zhu_yuanzhang.grain_market.investigate.low",
      "MISSING_TEXT:runtime.zhu_yuanzhang.grain_market.investigate.low"
    );
  }
  return resolveTextEntry(
    entries,
    "runtime.zhu_yuanzhang.grain_market.investigate.neutral",
    "MISSING_TEXT:runtime.zhu_yuanzhang.grain_market.investigate.neutral"
  );
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
  const cityDefinition = selectCurrentCity(
    state,
    defaultRuntimeContent.cities
  );
  assertExists(
    cityDefinition,
    `Current city "${state.world.currentCityId}" is missing from active city content.`
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
