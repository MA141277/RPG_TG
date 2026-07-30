import type { CityId } from "../../domain/city";
import {
  settlementTradeGoodsCatalog,
  settlementTradeProfilesByCityId,
  type SettlementTradeGoodsDraft,
  type SettlementTradeGoodsId,
  type SettlementTradeProfile,
} from "../../content/markets/settlement-trade-profiles";

export type SettlementDraftTradeRouteQuote = {
  goodsId: SettlementTradeGoodsId;
  originCityId: CityId;
  targetCityId: CityId;
  originBuyPrice: number;
  targetSellPrice: number;
  profitPerUnit: number;
  originCityExportsGoods: boolean;
  usesTemporaryArbitragePricing: boolean;
};

export type SettlementDraftLocalMarketQuote = {
  goodsId: SettlementTradeGoodsId;
  cityId: CityId;
  originCityId: CityId;
  rolledBasePrice: number;
  buyPrice: number;
  sellPrice: number;
  cityModifier: number;
  eventModifier: number;
  originCityExportsGoods: boolean;
  usesTemporaryArbitragePricing: boolean;
};

function cityExportsGoods(
  profile: SettlementTradeProfile,
  goodsId: SettlementTradeGoodsId
): boolean {
  return (
    profile.exportTiers.primary.includes(goodsId) ||
    profile.exportTiers.secondary.includes(goodsId) ||
    profile.exportTiers.rare.includes(goodsId)
  );
}

function getOriginCityIds(goodsId: SettlementTradeGoodsId): CityId[] {
  return Object.values(settlementTradeProfilesByCityId)
    .filter((profile) => cityExportsGoods(profile, goodsId))
    .map((profile) => profile.cityId);
}

export function quoteSettlementDraftTradeRoute(input: {
  goodsId: SettlementTradeGoodsId;
  originCityId: CityId;
  targetCityId: CityId;
}): SettlementDraftTradeRouteQuote | null {
  const { goodsId, originCityId, targetCityId } = input;
  const definition =
    settlementTradeGoodsCatalog[goodsId] as SettlementTradeGoodsDraft;
  const originProfile = settlementTradeProfilesByCityId[originCityId];
  const targetProfile = settlementTradeProfilesByCityId[targetCityId];

  if (
    !definition ||
    definition.draftBasePrice == null ||
    !definition.temporaryArbitragePricing ||
    !originProfile ||
    !targetProfile
  ) {
    return null;
  }

  const originCityExportsGoods = cityExportsGoods(originProfile, goodsId);
  if (!originCityExportsGoods) {
    return null;
  }

  const originBuyPrice = Math.max(
    1,
    Math.round(
      definition.draftBasePrice *
        definition.temporaryArbitragePricing.localBuyPriceMultiplier
    )
  );
  const targetSellPrice = Math.max(
    1,
    Math.round(
      definition.draftBasePrice *
        (targetCityId === originCityId
          ? 1
          : definition.temporaryArbitragePricing.nonLocalSellPriceMultiplier)
    )
  );

  return {
    goodsId,
    originCityId,
    targetCityId,
    originBuyPrice,
    targetSellPrice,
    profitPerUnit: targetSellPrice - originBuyPrice,
    originCityExportsGoods: true,
    usesTemporaryArbitragePricing: true,
  };
}

export function quoteSettlementDraftLocalMarket(input: {
  goodsId: SettlementTradeGoodsId;
  cityId: CityId;
  rolledBasePrice: number;
  minPrice: number;
  maxPrice: number;
  eventModifier?: number;
}): SettlementDraftLocalMarketQuote | null {
  const { goodsId, cityId, rolledBasePrice, minPrice, maxPrice } = input;
  const definition =
    settlementTradeGoodsCatalog[goodsId] as SettlementTradeGoodsDraft;
  const cityProfile = settlementTradeProfilesByCityId[cityId];
  const originCityId = getOriginCityIds(goodsId)[0];
  const eventModifier = input.eventModifier ?? 1;

  if (
    !definition ||
    definition.temporaryArbitragePricing == null ||
    cityProfile == null ||
    originCityId == null
  ) {
    return null;
  }

  const originCityExportsGoods = cityExportsGoods(cityProfile, goodsId);
  const shortagePremium = cityProfile.shortages.includes(goodsId)
    ? Math.max(4, Math.round(rolledBasePrice * 0.06))
    : 0;
  const rareDemandPremium = cityProfile.rareDemands.includes(goodsId)
    ? Math.max(3, Math.round(rolledBasePrice * 0.04))
    : 0;

  const originBuyBase = Math.max(
    1,
    Math.round(
      rolledBasePrice *
        definition.temporaryArbitragePricing.localBuyPriceMultiplier
    )
  );
  const nonLocalSellBase = Math.max(
    originBuyBase + 1,
    Math.round(
      rolledBasePrice *
        definition.temporaryArbitragePricing.nonLocalSellPriceMultiplier
    ) +
      shortagePremium +
      rareDemandPremium
  );

  const rawBuyPrice = originCityExportsGoods
    ? originBuyBase
    : Math.max(
        nonLocalSellBase + Math.max(6, Math.round(rolledBasePrice * 0.08)),
        Math.round(rolledBasePrice * 1.12) +
          shortagePremium +
          rareDemandPremium
      );
  const rawSellPrice = originCityExportsGoods
    ? Math.max(1, originBuyBase - Math.max(4, Math.round(rolledBasePrice * 0.08)))
    : nonLocalSellBase;

  const buyPrice = Math.max(
    minPrice,
    Math.min(
      Math.round(maxPrice * 1.8),
      Math.round(rawBuyPrice * eventModifier)
    )
  );
  const sellPrice = Math.max(
    1,
    Math.min(buyPrice - 1, Math.round(rawSellPrice * eventModifier))
  );

  return {
    goodsId,
    cityId,
    originCityId,
    rolledBasePrice,
    buyPrice,
    sellPrice,
    cityModifier: Number((rawBuyPrice / rolledBasePrice).toFixed(2)),
    eventModifier,
    originCityExportsGoods,
    usesTemporaryArbitragePricing: true,
  };
}
