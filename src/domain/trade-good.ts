export type MarketShopType =
  | "grain-shop"
  | "medicine-shop"
  | "silk-shop"
  | "smithy"
  | "horse-market"
  | "general-store";

export type TradeGoodCategory =
  | "grain"
  | "medicine"
  | "silk"
  | "arms"
  | "horses"
  | "special";

export type TradeGoodRarity = "common" | "uncommon" | "rare" | "epic";

export type TradeGoodDefinition = {
  id: string;
  name: string;
  category: TradeGoodCategory;
  shopType: MarketShopType;
  rarity: TradeGoodRarity;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  originTags: string[];
  demandTags: string[];
  description: string;
};
