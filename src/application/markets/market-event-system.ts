import type { CityDefinition } from "../../domain/city";
import type { MarketEventEffect } from "../../domain/market";
import type { TradeGoodDefinition } from "../../domain/trade-good";

function matchesList<T>(value: T, values: T[] | undefined): boolean {
  return values == null || values.includes(value);
}

function matchesAny(values: string[], candidates: string[] | undefined): boolean {
  return candidates == null || candidates.some((candidate) => values.includes(candidate));
}

export function doesMarketEventApply(
  eventEffect: MarketEventEffect,
  cityDefinition: CityDefinition,
  goodDefinition: TradeGoodDefinition
): boolean {
  return (
    matchesList(cityDefinition.id, eventEffect.affectedCityIds) &&
    matchesAny(cityDefinition.tags, eventEffect.affectedCityTags) &&
    matchesList(goodDefinition.id, eventEffect.affectedGoodsIds) &&
    matchesList(goodDefinition.category, eventEffect.affectedCategories) &&
    matchesList(goodDefinition.shopType, eventEffect.affectedShopTypes)
  );
}

export function resolveMarketEventPriceMultiplier(
  events: MarketEventEffect[],
  cityDefinition: CityDefinition,
  goodDefinition: TradeGoodDefinition
): number {
  return events.reduce((multiplier, eventEffect) => {
    if (!doesMarketEventApply(eventEffect, cityDefinition, goodDefinition)) {
      return multiplier;
    }

    return multiplier * (eventEffect.priceMultiplier ?? 1);
  }, 1);
}

export function resolveMarketEventWeightMultiplier(
  events: MarketEventEffect[],
  cityDefinition: CityDefinition,
  goodDefinition: TradeGoodDefinition
): number {
  return events.reduce((multiplier, eventEffect) => {
    if (!doesMarketEventApply(eventEffect, cityDefinition, goodDefinition)) {
      return multiplier;
    }

    return multiplier * (eventEffect.weightMultiplier ?? 1);
  }, 1);
}
