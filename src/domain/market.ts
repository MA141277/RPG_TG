import type { CityId } from "./city";
import type { MarketShopType, TradeGoodCategory } from "./trade-good";

export type MarketEventEffect = {
  id: string;
  name: string;
  affectedCityIds?: CityId[];
  affectedCityTags?: string[];
  affectedGoodsIds?: string[];
  affectedCategories?: TradeGoodCategory[];
  affectedShopTypes?: MarketShopType[];
  priceMultiplier?: number;
  weightMultiplier?: number;
  description?: string;
};

export type ShopInventoryEntry = {
  goodsId: string;
  buyPrice: number;
  sellPrice: number;
  rolledBasePrice: number;
  selectionWeight: number;
};

export type ShopMarketData = {
  shopType: MarketShopType;
  inventory: ShopInventoryEntry[];
  lastRefreshedOnDay: number;
  refreshAfterDay: number;
};

export type CityMarketData = {
  cityId: CityId;
  shops: Partial<Record<MarketShopType, ShopMarketData>>;
};
