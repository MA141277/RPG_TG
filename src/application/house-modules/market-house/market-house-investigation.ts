import type { CityId } from "../../../domain/city";
import type { GameState } from "../../../domain/game-state";
import type { SettlementTradeGoodId } from "../../../domain/settlement-trade";
import { resolveTextTemplateEntry } from "../../content/text-resolution";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { settlementTradeGoodsById } from "../../../content/markets/settlement-trade-goods";
import { marketHouseShopkeeperRouteTemplateTextIds } from "../../../content/houses/market-house-content";
import { SettlementTradeService } from "../../markets/settlement-trade-service";
import { getCompactCityDisplayName } from "../../../shared/city-display-name";
import { pickRandom } from "../../../shared/random";

const marketHouseInvestigationTradeService = new SettlementTradeService();
const INVESTIGATION_ROUTE_FALLBACK_TEXT_ID =
  "runtime.zhu_yuanzhang.market_house.investigate.route_fallback";

function emphasize(value: string): string {
  return `**${value}**`;
}

function getTextEntries(): Record<string, string> {
  return defaultRuntimeContent.textEntriesById ?? {};
}

function formatGoodsList(goodsIds: readonly SettlementTradeGoodId[]): string {
  return goodsIds
    .map((goodsId) => emphasize(settlementTradeGoodsById[goodsId].name))
    .join("、");
}

function resolveTextTemplate(
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>,
  fallback: string
): string {
  return resolveTextTemplateEntry(
    getTextEntries(),
    textId,
    values,
    fallback
  );
}

function pickFeaturedDestination(
  summary: ReturnType<SettlementTradeService["createInvestigationSummary"]>
) {
  return [...summary.highlightedDestinations].sort((left, right) => {
    return right.demandedGoodsIds.length - left.demandedGoodsIds.length;
  })[0] ?? null;
}

function resolveRecommendedGoodsIds(
  summary: ReturnType<SettlementTradeService["createInvestigationSummary"]>,
  featuredDestination: ReturnType<typeof pickFeaturedDestination>
): SettlementTradeGoodId[] {
  const destinationGoodsIds = featuredDestination?.demandedGoodsIds.slice(0, 2) ?? [];
  if (destinationGoodsIds.length > 0) {
    return destinationGoodsIds;
  }

  return summary.headlineGoodsIds.slice(0, 2);
}

function formatRecommendedGoodsSummary(goodsIds: readonly SettlementTradeGoodId[]): string {
  if (goodsIds.length === 0) {
    return "几样本地货";
  }

  return formatGoodsList(goodsIds);
}

function createFallbackRouteLine(goodsSummary: string): string {
  return resolveTextTemplate(
    INVESTIGATION_ROUTE_FALLBACK_TEXT_ID,
    { goodsSummary },
    `你若真想赚，本地的${goodsSummary}先记在心里，只是外路眼下还乱，我得再替你摸准哪座城最肯出价。`
  );
}

function createShopkeeperRouteLine(
  summary: ReturnType<SettlementTradeService["createInvestigationSummary"]>
): string {
  const featuredDestination = pickFeaturedDestination(summary);
  const goodsSummary = formatRecommendedGoodsSummary(
    resolveRecommendedGoodsIds(summary, featuredDestination)
  );

  if (featuredDestination == null) {
    return createFallbackRouteLine(goodsSummary);
  }

  const routeCity = emphasize(
    getCompactCityDisplayName(featuredDestination.cityName)
  );
  const templateTextId =
    marketHouseShopkeeperRouteTemplateTextIds.length > 0
      ? pickRandom([...marketHouseShopkeeperRouteTemplateTextIds])
      : null;

  if (templateTextId == null) {
    return `你若想赚钱，我这有门路，从本地带上${goodsSummary}，去${routeCity}走一遭，准能碰上识货的。`;
  }

  return resolveTextTemplate(
    templateTextId,
    { goodsSummary, routeCity },
    `你若想赚钱，我这有门路，从本地带上${goodsSummary}，去${routeCity}走一遭，准能碰上识货的。`
  );
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

    return [createShopkeeperRouteLine(summary)];
  }
}

export const defaultMarketHouseInvestigationDialogue =
  new MarketHouseInvestigationDialogue();
