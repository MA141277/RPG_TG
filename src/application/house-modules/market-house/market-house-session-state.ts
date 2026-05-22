import type { MarketShopType } from "../../../domain/trade-good";
import type { MarketHouseSessionState } from "../../../domain/house-modules/market-house-session";

export const DEFAULT_MARKET_SHOP_TYPE: MarketShopType = "grain-shop";

export function createInitialMarketHouseSessionState(
  selectedShopType: MarketShopType = DEFAULT_MARKET_SHOP_TYPE,
  dialogueLines: string[] = ["市集里人声杂沓，商贩正等你开口。"]
): MarketHouseSessionState {
  return {
    selectedShopType,
    dialogueLines,
    dialoguePhase: "greeting",
    overlay: null,
  };
}
