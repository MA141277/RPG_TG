import type { CityId } from "../../../domain/city";
import type { GameState } from "../../../domain/game-state";
import type { SettlementTradeGoodId } from "../../../domain/settlement-trade";
import { settlementTradeGoodsById } from "../../../content/markets/settlement-trade-goods";
import { SettlementTradeService } from "../../markets/settlement-trade-service";

const marketHouseInvestigationTradeService = new SettlementTradeService();

function emphasize(value: string): string {
  return `**${value}**`;
}

function formatGoodsList(goodsIds: readonly SettlementTradeGoodId[]): string {
  return goodsIds
    .map((goodsId) => emphasize(settlementTradeGoodsById[goodsId].name))
    .join(", ");
}

export class MarketHouseInvestigationDialogue {
  createDialogueLines(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
  }): string[] {
    const summary = marketHouseInvestigationTradeService.createInvestigationSummary(
      input
    );
    const headlineGoodsLabel = formatGoodsList(summary.headlineGoodsIds);
    const featuredDestination = summary.highlightedDestinations[0] ?? null;
    const alternateDestination = summary.highlightedDestinations[1] ?? null;

    if (summary.headlineGoodsIds.length === 0) {
      return [
        "The specialty lanes are quiet in this city for now.",
        "Watch the nearby routes and move only after a real shortage appears.",
        summary.voiceLines[0] ??
          "Trade pressure resets after 30 quiet days, so patience still matters.",
      ];
    }

    return [
      `The cleanest local specialty lane right now is ${headlineGoodsLabel}.`,
      featuredDestination == null
        ? `Move ${headlineGoodsLabel} before the 30-day reset cools the market back to baseline.`
        : `If you carry ${headlineGoodsLabel} toward ${emphasize(
            featuredDestination.cityName
          )}, that route is currently short on ${formatGoodsList(
            featuredDestination.demandedGoodsIds
          )}.${alternateDestination == null ? "" : ` ${emphasize(
            alternateDestination.cityName
          )} can also take ${formatGoodsList(
            alternateDestination.demandedGoodsIds
          )}.`}`,
      summary.voiceLines[2] ??
        summary.voiceLines[1] ??
        "Every 10 traded units moves the multiplier by 0.01, then 30 quiet days reset the pressure.",
    ];
  }
}

export const defaultMarketHouseInvestigationDialogue =
  new MarketHouseInvestigationDialogue();
