import type { CityDefinition } from "../../domain/city";
import type {
  MarketEventEffect,
  ShopInventoryEntry,
  ShopMarketData,
} from "../../domain/market";
import type {
  MarketShopType,
  TradeGoodDefinition,
  TradeGoodRarity,
} from "../../domain/trade-good";
import { resolveMarketEventWeightMultiplier } from "./market-event-system";
import { generateGoodsPrice } from "./price-generator";
import { resolveSettlementMarketBias } from "./settlement-market-bias";

type RandomSource = () => number;

const rarityWeightMap: Record<TradeGoodRarity, number> = {
  common: 100,
  uncommon: 72,
  rare: 42,
  epic: 18,
};

function randomIntFromSource(
  min: number,
  max: number,
  randomSource: RandomSource
): number {
  return Math.floor(randomSource() * (max - min + 1)) + min;
}

export function getEligibleGoodsForShopType(
  goodsPool: TradeGoodDefinition[],
  shopType: MarketShopType
): TradeGoodDefinition[] {
  return goodsPool.filter((goodDefinition) => goodDefinition.shopType === shopType);
}

export function calculateTradeGoodSelectionWeight(
  cityDefinition: CityDefinition,
  goodDefinition: TradeGoodDefinition,
  marketEvents: MarketEventEffect[]
): number {
  let weight = rarityWeightMap[goodDefinition.rarity];

  const originMatches = goodDefinition.originTags.filter((tag) =>
    cityDefinition.tags.includes(tag)
  ).length;
  const demandMatches = goodDefinition.demandTags.filter(
    (tag) =>
      cityDefinition.tags.includes(tag) ||
      cityDefinition.specialDemand.includes(tag) ||
      cityDefinition.specialDemand.includes(goodDefinition.category) ||
      cityDefinition.specialDemand.includes(goodDefinition.name)
  ).length;

  weight += originMatches * 24;
  weight += demandMatches * 30;

  if (goodDefinition.category === "silk" || goodDefinition.category === "special") {
    weight += cityDefinition.prosperity * 0.35;
  }

  if (goodDefinition.category === "arms" || goodDefinition.category === "horses") {
    weight += cityDefinition.danger * 0.45;
  }

  if (goodDefinition.category === "grain" && cityDefinition.danger >= 50) {
    weight += cityDefinition.danger * 0.25;
  }

  weight += resolveSettlementMarketBias(
    cityDefinition.id,
    goodDefinition.id
  ).selectionWeightDelta;

  weight *= resolveMarketEventWeightMultiplier(
    marketEvents,
    cityDefinition,
    goodDefinition
  );

  return Math.max(1, Math.round(weight));
}

function pickWeightedGoodsWithoutReplacement(
  goodsDefinitions: TradeGoodDefinition[],
  count: number,
  cityDefinition: CityDefinition,
  marketEvents: MarketEventEffect[],
  randomSource: RandomSource
): Array<{ goodDefinition: TradeGoodDefinition; weight: number }> {
  const pool = goodsDefinitions.map((goodDefinition) => ({
    goodDefinition,
    weight: calculateTradeGoodSelectionWeight(
      cityDefinition,
      goodDefinition,
      marketEvents
    ),
  }));
  const result: Array<{ goodDefinition: TradeGoodDefinition; weight: number }> = [];

  while (pool.length > 0 && result.length < count) {
    const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let threshold = randomSource() * totalWeight;
    let pickedIndex = 0;

    for (let index = 0; index < pool.length; index += 1) {
      const candidate = pool[index];
      if (candidate == null) {
        continue;
      }

      threshold -= candidate.weight;
      if (threshold < 0) {
        pickedIndex = index;
        break;
      }
    }

    const [pickedEntry] = pool.splice(pickedIndex, 1);
    if (pickedEntry != null) {
      result.push(pickedEntry);
    }
  }

  return result;
}

export function generateShopInventory(
  cityDefinition: CityDefinition,
  shopType: MarketShopType,
  goodsPool: TradeGoodDefinition[],
  marketEvents: MarketEventEffect[],
  currentDay: number,
  randomSource: RandomSource = Math.random
): ShopMarketData {
  const eligibleGoods = getEligibleGoodsForShopType(goodsPool, shopType);
  const desiredCount = randomIntFromSource(4, 8, randomSource);
  const inventorySize = Math.min(desiredCount, eligibleGoods.length);
  const selectedGoods = pickWeightedGoodsWithoutReplacement(
    eligibleGoods,
    inventorySize,
    cityDefinition,
    marketEvents,
    randomSource
  );
  const inventory: ShopInventoryEntry[] = selectedGoods.map(
    ({ goodDefinition, weight }) => {
      const price = generateGoodsPrice(
        cityDefinition,
        goodDefinition,
        marketEvents,
        randomSource
      );

      return {
        goodsId: goodDefinition.id,
        buyPrice: price.buyPrice,
        sellPrice: price.sellPrice,
        rolledBasePrice: price.rolledBasePrice,
        selectionWeight: weight,
      };
    }
  );

  return {
    shopType,
    inventory,
    lastRefreshedOnDay: currentDay,
    refreshAfterDay: currentDay + randomIntFromSource(3, 7, randomSource),
  };
}
