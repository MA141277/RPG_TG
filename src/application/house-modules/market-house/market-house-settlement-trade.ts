import type { CityId } from "../../../domain/city";
import type { GameState } from "../../../domain/game-state";
import type { HouseOverlayViewModel } from "../../../domain/house-module";
import type { MarketHouseSettlementTradeOverlayState } from "../../../domain/house-modules/market-house-session";
import { SettlementTradeService } from "../../markets/settlement-trade-service";

export const marketHouseSettlementTradeService = new SettlementTradeService();

function getPriceTone(
  priceMultiplier: number
): "low" | "high" | "neutral" {
  if (priceMultiplier < 1) {
    return "low";
  }

  if (priceMultiplier > 1) {
    return "high";
  }

  return "neutral";
}

export function createMarketHouseSettlementTradeOverlay(input: {
  state: GameState;
  cityId: CityId;
  currentDay: number;
  overlay: MarketHouseSettlementTradeOverlayState;
}): Extract<HouseOverlayViewModel, { type: "settlement-trade" }> {
  const snapshot = marketHouseSettlementTradeService.createSnapshot({
    state: input.state,
    cityId: input.cityId,
    currentDay: input.currentDay,
  });
  const quantity = Math.max(1, input.overlay.quantity);
  const selectedRow =
    snapshot.rows.find((row) => row.goodsId === input.overlay.selectedGoodsId) ??
    snapshot.rows[0] ??
    null;

  return {
    type: "settlement-trade",
    title: input.overlay.mode === "buy" ? "City Specialty Trade" : "City Specialty Sale",
    mode: input.overlay.mode,
    quantity,
    quantityFieldId: "settlement-trade-quantity",
    decrementActionId: "settlement-trade-qty-minus",
    incrementActionId: "settlement-trade-qty-plus",
    confirmActionId: "confirm-settlement-trade",
    confirmLabel: input.overlay.mode === "buy" ? "Buy Goods" : "Sell Goods",
    cancelActionId: "close-settlement-trade",
    cancelLabel: "Come Back Later",
    rows: snapshot.rows.map((row) => ({
      goodsId: row.goodsId,
      name: row.name,
      categoryLabel: row.categoryLabel,
      unit: row.unit,
      tierLabel: row.tierLabel,
      buyPrice: row.currentBuyPrice,
      sellPrice: row.currentSellPrice,
      basePrice: row.staticReferencePrice,
      priceMultiplier: row.priceMultiplier,
      stockQuantity: row.stockQuantity,
      ownedQuantity: row.ownedQuantity,
      daysUntilReset: row.daysUntilReset,
      priceTone: getPriceTone(row.priceMultiplier),
      isSelected: row.goodsId === selectedRow?.goodsId,
    })),
    selectedSummary:
      selectedRow == null
        ? null
        : {
            goodsId: selectedRow.goodsId,
            name: selectedRow.name,
            unit: selectedRow.unit,
            tierLabel: selectedRow.tierLabel,
            buyPrice: selectedRow.currentBuyPrice,
            sellPrice: selectedRow.currentSellPrice,
            stockQuantity: selectedRow.stockQuantity,
            ownedQuantity: selectedRow.ownedQuantity,
            tradeTotal:
              (input.overlay.mode === "buy"
                ? selectedRow.currentBuyPrice
                : selectedRow.currentSellPrice) * quantity,
            daysUntilReset: selectedRow.daysUntilReset,
            nextStepHint:
              selectedRow.routeHints[0] ??
              "Look for demand in the next city before prices cool off.",
            supplyHint:
              selectedRow.demandNotes[0] ??
              "Trade pressure resets after 30 quiet days.",
          },
    helperLines: snapshot.helperLines,
  };
}
