import type { CityId } from "../../domain/city";
import {
  settlementTradeGoodsCatalog,
  settlementTradeProfilesByCityId,
  type CurrentFallbackTradeGoodId,
  type SettlementTradeGoodsDraft,
  type SettlementTradeGoodsId,
  type SettlementTradeProfile,
} from "../../content/markets/settlement-trade-profiles";

export type SettlementMarketExportTier = "primary" | "secondary" | "rare" | null;

export type SettlementMarketBias = {
  matchedGoodsIds: SettlementTradeGoodsId[];
  exportTier: SettlementMarketExportTier;
  isShortage: boolean;
  isRareDemand: boolean;
  selectionWeightDelta: number;
  priceModifierDelta: number;
};

const exportTierWeightDelta: Record<Exclude<SettlementMarketExportTier, null>, number> = {
  primary: 70,
  secondary: 45,
  rare: 25,
};

const exportTierPriceModifierDelta: Record<
  Exclude<SettlementMarketExportTier, null>,
  number
> = {
  primary: -0.16,
  secondary: -0.1,
  rare: -0.06,
};

const SHORTAGE_SELECTION_WEIGHT_DELTA = -50;
const SHORTAGE_PRICE_MODIFIER_DELTA = 0.2;
const RARE_DEMAND_PRICE_MODIFIER_DELTA = 0.12;

function resolveMatchedGoodsIds(goodsId: string): SettlementTradeGoodsId[] {
  if (goodsId in settlementTradeGoodsCatalog) {
    return [goodsId as SettlementTradeGoodsId];
  }

  return Object.entries(settlementTradeGoodsCatalog)
    .filter(([, definition]) =>
      (definition as SettlementTradeGoodsDraft).runtimeFallbackGoodsIds.includes(
        goodsId as CurrentFallbackTradeGoodId
      )
    )
    .map(([draftGoodsId]) => draftGoodsId as SettlementTradeGoodsId);
}

function resolveExportTier(
  profile: SettlementTradeProfile,
  matchedGoodsIds: readonly SettlementTradeGoodsId[]
): SettlementMarketExportTier {
  if (matchedGoodsIds.some((goodsId) => profile.exportTiers.primary.includes(goodsId))) {
    return "primary";
  }

  if (matchedGoodsIds.some((goodsId) => profile.exportTiers.secondary.includes(goodsId))) {
    return "secondary";
  }

  if (matchedGoodsIds.some((goodsId) => profile.exportTiers.rare.includes(goodsId))) {
    return "rare";
  }

  return null;
}

export function resolveSettlementMarketBias(
  cityId: CityId,
  goodsId: string
): SettlementMarketBias {
  const profile = settlementTradeProfilesByCityId[cityId];
  if (profile == null) {
    return {
      matchedGoodsIds: [],
      exportTier: null,
      isShortage: false,
      isRareDemand: false,
      selectionWeightDelta: 0,
      priceModifierDelta: 0,
    };
  }

  const matchedGoodsIds = resolveMatchedGoodsIds(goodsId);
  if (matchedGoodsIds.length === 0) {
    return {
      matchedGoodsIds,
      exportTier: null,
      isShortage: false,
      isRareDemand: false,
      selectionWeightDelta: 0,
      priceModifierDelta: 0,
    };
  }

  const exportTier = resolveExportTier(profile, matchedGoodsIds);
  const isShortage = matchedGoodsIds.some((goodsId) => profile.shortages.includes(goodsId));
  const isRareDemand = matchedGoodsIds.some((goodsId) =>
    profile.rareDemands.includes(goodsId)
  );

  return {
    matchedGoodsIds,
    exportTier,
    isShortage,
    isRareDemand,
    selectionWeightDelta:
      (exportTier == null ? 0 : exportTierWeightDelta[exportTier]) +
      (isShortage ? SHORTAGE_SELECTION_WEIGHT_DELTA : 0),
    priceModifierDelta:
      (exportTier == null ? 0 : exportTierPriceModifierDelta[exportTier]) +
      (isShortage ? SHORTAGE_PRICE_MODIFIER_DELTA : 0) +
      (isRareDemand ? RARE_DEMAND_PRICE_MODIFIER_DELTA : 0),
  };
}
