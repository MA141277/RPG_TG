export const MARKET_HOUSE_TIME_KEY_PREFIX = "var.market_house.time";
export const MARKET_HOUSE_FAVORABILITY_KEY_PREFIX = "var.market_house.favorability";
export const MARKET_HOUSE_REFRESH_KEY_PREFIX = "var.market_house.refresh";
export const MARKET_HOUSE_STOCK_KEY_PREFIX = "var.market_house.stock";
export const MARKET_HOUSE_INVENTORY_KEY_PREFIX = "var.trade_inventory";

export type MarketHouseTradeMode = "buy" | "sell";

export type MarketHouseInventoryChange = {
  goodsId: string;
  quantity: number;
};

export type MarketHouseActionOutcome = {
  moneyChange: number;
  inventoryChange: MarketHouseInventoryChange[];
  relationshipChange: number;
  timeCost: number;
  marketMessage: string;
};

export function getMarketHouseTimeVariableKey(houseId: string): string {
  return `${MARKET_HOUSE_TIME_KEY_PREFIX}.${houseId}`;
}

export function getMarketHouseFavorabilityVariableKey(
  houseId: string,
  actorId: string
): string {
  return `${MARKET_HOUSE_FAVORABILITY_KEY_PREFIX}.${houseId}.${actorId}`;
}

export function getMarketHouseLastRefreshDayVariableKey(houseId: string): string {
  return `${MARKET_HOUSE_REFRESH_KEY_PREFIX}.${houseId}.last_day`;
}

export function getMarketHouseRefreshAfterDayVariableKey(houseId: string): string {
  return `${MARKET_HOUSE_REFRESH_KEY_PREFIX}.${houseId}.after_day`;
}

export function getMarketHouseGuestActorIdsVariableKey(houseId: string): string {
  return `${MARKET_HOUSE_REFRESH_KEY_PREFIX}.${houseId}.guest_actor_ids`;
}

export function getMarketHouseInventoryGoodsIdsVariableKey(houseId: string): string {
  return `${MARKET_HOUSE_REFRESH_KEY_PREFIX}.${houseId}.goods_ids`;
}

export function getMarketHouseStockVariableKey(
  houseId: string,
  goodsId: string
): string {
  return `${MARKET_HOUSE_STOCK_KEY_PREFIX}.${houseId}.${goodsId}`;
}

export function getTradeInventoryQuantityVariableKey(goodsId: string): string {
  return `${MARKET_HOUSE_INVENTORY_KEY_PREFIX}.${goodsId}`;
}
