import type { CityId } from "./city";

export type SettlementTradeGoodId =
  | "silk_textiles"
  | "ramie_cloth"
  | "cotton_cloth"
  | "tea"
  | "wine"
  | "ceramics"
  | "copperware"
  | "ironware"
  | "salt"
  | "paper_brush"
  | "bamboo_woodware"
  | "woven_goods"
  | "lacquer_oil"
  | "stone_goods"
  | "hides";

export type SettlementTradeTier =
  | "abundant"
  | "local"
  | "scarce"
  | "extreme-scarce";

export type SettlementTradeGoodDefinition = {
  id: SettlementTradeGoodId;
  name: string;
  categoryLabel: string;
  unit: string;
  basePrice: number;
  description: string;
};

export type SettlementTradeCityGoodsProfile = {
  tier: SettlementTradeTier;
  initialStock: number;
  routeHints?: string[];
  demandNotes?: string[];
};

export type SettlementTradeCityProfile = {
  cityId: CityId;
  cityName: string;
  goods: Partial<
    Record<SettlementTradeGoodId, SettlementTradeCityGoodsProfile>
  >;
};

export type SettlementTradeGoodRuntimeState = {
  stockQuantity: number;
  priceMultiplier: number;
  progressUnits: number;
  lastTradedDay: number | null;
};

export type SettlementTradeCityRuntimeState = Partial<
  Record<SettlementTradeGoodId, SettlementTradeGoodRuntimeState>
>;

export type SettlementTradeRuntimeState = Partial<
  Record<CityId, SettlementTradeCityRuntimeState>
>;

export type SettlementTradeSnapshotRow = {
  goodsId: SettlementTradeGoodId;
  name: string;
  categoryLabel: string;
  unit: string;
  tier: SettlementTradeTier;
  tierLabel: string;
  basePrice: number;
  staticReferencePrice: number;
  currentBuyPrice: number;
  currentSellPrice: number;
  priceMultiplier: number;
  stockQuantity: number;
  ownedQuantity: number;
  progressUnits: number;
  daysUntilReset: number;
  routeHints: string[];
  demandNotes: string[];
};

export type SettlementTradeSnapshot = {
  cityId: CityId;
  supported: boolean;
  rows: SettlementTradeSnapshotRow[];
  helperLines: string[];
};

export type SettlementTradeHighlightedDestination = {
  cityId: CityId;
  cityName: string;
  demandedGoodsIds: SettlementTradeGoodId[];
};

export type SettlementTradeInvestigationSummary = {
  cityId: CityId;
  headlineGoodsIds: SettlementTradeGoodId[];
  highlightedDestinations: SettlementTradeHighlightedDestination[];
  voiceLines: string[];
};

export type SettlementTradeMutation =
  | { type: "change-player-gold"; amount: number }
  | {
      type: "change-player-item";
      itemId: SettlementTradeGoodId;
      delta: number;
    }
  | {
      type: "change-settlement-trade-stock";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      delta: number;
    }
  | {
      type: "set-settlement-trade-multiplier";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      priceMultiplier: number;
    }
  | {
      type: "set-settlement-trade-progress";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      progressUnits: number;
    }
  | {
      type: "set-settlement-trade-last-traded-day";
      cityId: CityId;
      goodsId: SettlementTradeGoodId;
      dayNumber: number;
    };

export type SettlementTradeResolution =
  | {
      ok: true;
      mode: "buy" | "sell";
      goodsId: SettlementTradeGoodId;
      quantity: number;
      totalPrice: number;
      summaryLines: string[];
      mutations: SettlementTradeMutation[];
    }
  | {
      ok: false;
      code:
        | "unsupported-city"
        | "unknown-goods"
        | "invalid-quantity"
        | "insufficient-gold"
        | "insufficient-stock"
        | "insufficient-owned-quantity";
      title: string;
      paragraphs: string[];
    };
