import type { CityDefinition } from "../../domain/city";
import type { MarketEventEffect } from "../../domain/market";
import type { TradeGoodDefinition } from "../../domain/trade-good";
import { resolveMarketEventPriceMultiplier } from "./market-event-system";

type RandomSource = () => number;

export type GeneratedGoodsPrice = {
  rolledBasePrice: number;
  buyPrice: number;
  sellPrice: number;
  cityModifier: number;
  eventModifier: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomIntFromSource(
  min: number,
  max: number,
  randomSource: RandomSource
): number {
  return Math.floor(randomSource() * (max - min + 1)) + min;
}

export function calculateCityPriceModifier(
  cityDefinition: CityDefinition,
  goodDefinition: TradeGoodDefinition
): number {
  let modifier = 1;

  const originMatchCount = goodDefinition.originTags.filter((tag) =>
    cityDefinition.tags.includes(tag)
  ).length;
  const demandMatchCount = goodDefinition.demandTags.filter(
    (tag) =>
      cityDefinition.tags.includes(tag) ||
      cityDefinition.specialDemand.includes(tag) ||
      cityDefinition.specialDemand.includes(goodDefinition.category) ||
      cityDefinition.specialDemand.includes(goodDefinition.name)
  ).length;

  modifier -= originMatchCount * 0.08;
  modifier += demandMatchCount * 0.12;

  if (goodDefinition.category === "绸缎" || goodDefinition.category === "特殊") {
    modifier += cityDefinition.prosperity / 1000;
  }

  if (
    goodDefinition.category === "军械" ||
    goodDefinition.category === "马市" ||
    goodDefinition.category === "粮食"
  ) {
    modifier += cityDefinition.danger / 1200;
  }

  return clamp(Number(modifier.toFixed(2)), 0.7, 1.6);
}

function getSellSpreadMultiplier(goodDefinition: TradeGoodDefinition): number {
  switch (goodDefinition.rarity) {
    case "common":
      return 0.76;
    case "uncommon":
      return 0.72;
    case "rare":
      return 0.68;
    case "epic":
      return 0.64;
    default:
      return 0.72;
  }
}

export function generateGoodsPrice(
  cityDefinition: CityDefinition,
  goodDefinition: TradeGoodDefinition,
  marketEvents: MarketEventEffect[],
  randomSource: RandomSource = Math.random
): GeneratedGoodsPrice {
  const rolledBasePrice = randomIntFromSource(
    goodDefinition.minPrice,
    goodDefinition.maxPrice,
    randomSource
  );
  const cityModifier = calculateCityPriceModifier(cityDefinition, goodDefinition);
  const eventModifier = resolveMarketEventPriceMultiplier(
    marketEvents,
    cityDefinition,
    goodDefinition
  );
  const rawBuyPrice = rolledBasePrice * cityModifier * eventModifier;
  const buyPrice = clamp(
    Math.round(rawBuyPrice),
    goodDefinition.minPrice,
    Math.round(goodDefinition.maxPrice * 1.8)
  );
  const sellPrice = Math.max(
    goodDefinition.minPrice,
    Math.floor(buyPrice * getSellSpreadMultiplier(goodDefinition))
  );

  return {
    rolledBasePrice,
    buyPrice,
    sellPrice,
    cityModifier,
    eventModifier,
  };
}
