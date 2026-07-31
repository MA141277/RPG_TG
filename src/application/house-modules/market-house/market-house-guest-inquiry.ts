import type { CityId } from "../../../domain/city";
import type { GameState } from "../../../domain/game-state";
import type {
  SettlementTradeGoodId,
  SettlementTradeInvestigationSummary,
} from "../../../domain/settlement-trade";
import { resolveTextEntry, resolveTextTemplateEntry } from "../../content/text-resolution";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import {
  marketHouseInvestigationSpecialtyTextIdByActorId,
} from "../../../content/houses/market-house-content";
import { settlementTradeGoodsById } from "../../../content/markets/settlement-trade-goods";
import { SettlementTradeService } from "../../markets/settlement-trade-service";

const marketHouseGuestInquiryTradeService = new SettlementTradeService();
const GUEST_INQUIRE_SPECIALTY_TEXT_ID =
  "runtime.zhu_yuanzhang.market_house.guest_inquire.001";
const GUEST_INQUIRE_ROUTE_TEXT_ID =
  "runtime.zhu_yuanzhang.market_house.guest_inquire.002";
const GUEST_INQUIRE_VOICE_TEXT_ID =
  "runtime.zhu_yuanzhang.market_house.guest_inquire.003";
const DEFAULT_GUEST_VOICE_TEXT_ID =
  "runtime.zhu_yuanzhang.market_house.investigate.specialty.default";

function emphasize(value: string): string {
  return `**${value}**`;
}

function getTextEntries(
  textEntriesById: Record<string, string> | undefined
): Record<string, string> {
  return textEntriesById ?? defaultRuntimeContent.textEntriesById ?? {};
}

function formatGoodsList(goodsIds: readonly SettlementTradeGoodId[]): string {
  return goodsIds
    .map((goodsId) => emphasize(settlementTradeGoodsById[goodsId].name))
    .join("、");
}

function formatShortageSummary(
  highlightedDestinations: SettlementTradeInvestigationSummary["highlightedDestinations"]
): string {
  if (highlightedDestinations.length === 0) {
    return "眼下还没摸到明确缺口，先盯着附近几城的差价。";
  }

  return highlightedDestinations
    .map(
      (destination) =>
        `${emphasize(destination.cityName)}缺${formatGoodsList(destination.demandedGoodsIds)}`
    )
    .join("；");
}

function resolveGuestVoiceLine(
  actorId: string,
  textEntriesById: Record<string, string> | undefined
): string {
  const entries = getTextEntries(textEntriesById);
  const textId =
    marketHouseInvestigationSpecialtyTextIdByActorId[actorId] ??
    DEFAULT_GUEST_VOICE_TEXT_ID;

  return resolveTextEntry(
    entries,
    textId,
    "多看几处价，再决定往哪条商路走。"
  );
}

function resolveTextTemplate(
  textId: string,
  values: Record<string, string | number | boolean | null | undefined>,
  fallback: string,
  textEntriesById: Record<string, string> | undefined
): string {
  return resolveTextTemplateEntry(
    getTextEntries(textEntriesById),
    textId,
    values,
    fallback
  );
}

export class MarketHouseGuestInquiryDialogue {
  createDialogueLines(input: {
    state: GameState;
    cityId: CityId;
    currentDay: number;
    actorId: string;
    textEntriesById: Record<string, string> | undefined;
  }): string[] {
    const summary = marketHouseGuestInquiryTradeService.createInvestigationSummary(
      input
    );
    const specialtySummary =
      summary.headlineGoodsIds.length === 0
        ? "眼下还没摸准稳当的本地特产。"
        : formatGoodsList(summary.headlineGoodsIds);
    const shortageSummary = formatShortageSummary(summary.highlightedDestinations);
    const voiceLine = resolveGuestVoiceLine(
      input.actorId,
      input.textEntriesById
    );

    return [
      resolveTextTemplate(
        GUEST_INQUIRE_SPECIALTY_TEXT_ID,
        { specialtySummary },
        `特产门路：${specialtySummary}`,
        input.textEntriesById
      ),
      resolveTextTemplate(
        GUEST_INQUIRE_ROUTE_TEXT_ID,
        { shortageSummary },
        `可去城路：${shortageSummary}`,
        input.textEntriesById
      ),
      resolveTextTemplate(
        GUEST_INQUIRE_VOICE_TEXT_ID,
        { voiceLine },
        `客商口风：${voiceLine}`,
        input.textEntriesById
      ),
    ];
  }
}

export const defaultMarketHouseGuestInquiryDialogue =
  new MarketHouseGuestInquiryDialogue();
