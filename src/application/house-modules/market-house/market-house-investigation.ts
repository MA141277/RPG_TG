import { marketHouseInvestigationVoiceByCityId } from "../../../content/houses/market-house-content";
import {
  settlementTradeGoodsCatalog,
  settlementTradeProfiles,
  settlementTradeProfilesByCityId,
  type SettlementTradeGoodsId,
  type SettlementTradeProfile,
} from "../../../content/markets/settlement-trade-profiles";

const MAX_SHORTAGE_DESTINATIONS = 4;
const MAX_SUPPORT_GOODS = 3;
const MAX_ROUTE_GOODS = 2;

type MarketHouseShortageDestination = {
  cityName: string;
  goodsIds: SettlementTradeGoodsId[];
  premiumGoodsIds: SettlementTradeGoodsId[];
  score: number;
  order: number;
};

type MarketHouseInvestigationSpeechContext = {
  localHeadlineLabel: string;
  supportGoodsLabel: string | null;
  featuredDestinationLabel: string | null;
  alternateDestinationLabel: string | null;
  routeGoodsLabel: string;
  routeDestinationGoodsLabel: string;
  voiceLine: string;
};

type MarketHouseInvestigationSpeechPattern = {
  intro: (context: MarketHouseInvestigationSpeechContext) => string;
  route: (context: MarketHouseInvestigationSpeechContext) => string;
  closing: (context: MarketHouseInvestigationSpeechContext) => string;
};

function emphasize(value: string): string {
  return `**${value}**`;
}

function formatGoodsList(
  goodsIds: readonly SettlementTradeGoodsId[],
  options: { emphasized?: boolean } = {}
): string {
  return goodsIds
    .map((goodsId) => {
      const goodsName = settlementTradeGoodsCatalog[goodsId].name;
      return options.emphasized === true ? emphasize(goodsName) : goodsName;
    })
    .join("、");
}

function getLocalGoodsIds(profile: SettlementTradeProfile): SettlementTradeGoodsId[] {
  return [
    ...new Set([
      ...profile.exportTiers.primary,
      ...profile.exportTiers.secondary,
      ...profile.exportTiers.rare,
    ]),
  ] as SettlementTradeGoodsId[];
}

function goodsListIncludes(
  goodsIds: readonly SettlementTradeGoodsId[],
  goodsId: SettlementTradeGoodsId
): boolean {
  return goodsIds.includes(goodsId);
}

function getDemandScore(
  originCityId: string,
  profile: SettlementTradeProfile,
  goodsId: SettlementTradeGoodsId
): number {
  let score = 0;

  if (goodsListIncludes(profile.shortages, goodsId)) {
    score = Math.max(score, 2);
  }
  if (goodsListIncludes(profile.rareDemands, goodsId)) {
    score = Math.max(score, 3);
  }
  if (profile.importSources[goodsId]?.includes(originCityId)) {
    score += 1;
  }

  return score;
}

function collectShortageDestinations(
  originCityId: string,
  localGoodsIds: readonly SettlementTradeGoodsId[]
): MarketHouseShortageDestination[] {
  return settlementTradeProfiles
    .flatMap((profile, order) => {
      if (profile.cityId === originCityId) {
        return [];
      }

      const goodsIds: SettlementTradeGoodsId[] = [];
      const premiumGoodsIds: SettlementTradeGoodsId[] = [];
      let score = 0;

      localGoodsIds.forEach((goodsId) => {
        const demandScore = getDemandScore(originCityId, profile, goodsId);
        if (demandScore <= 0) {
          return;
        }

        goodsIds.push(goodsId);
        score += demandScore;

        if (goodsListIncludes(profile.rareDemands, goodsId)) {
          premiumGoodsIds.push(goodsId);
        }
      });

      if (goodsIds.length === 0) {
        return [];
      }

      return [
        {
          cityName: profile.cityName,
          goodsIds,
          premiumGoodsIds,
          score,
          order,
        } satisfies MarketHouseShortageDestination,
      ];
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.order - right.order ||
        left.cityName.localeCompare(right.cityName, "zh-Hans-CN")
    )
    .slice(0, MAX_SHORTAGE_DESTINATIONS);
}

function getPatternIndex(cityId: string, totalPatterns: number): number {
  let hash = 0;

  for (const character of cityId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return totalPatterns <= 0 ? 0 : hash % totalPatterns;
}

function formatSupportGoodsLabel(profile: SettlementTradeProfile): string | null {
  const supportGoodsIds = [
    ...profile.exportTiers.secondary,
    ...profile.exportTiers.rare,
  ].slice(0, MAX_SUPPORT_GOODS);

  return supportGoodsIds.length > 0
    ? formatGoodsList(supportGoodsIds, { emphasized: true })
    : null;
}

function selectRouteGoodsIds(
  destination: MarketHouseShortageDestination | null,
  fallbackGoodsIds: readonly SettlementTradeGoodsId[]
): SettlementTradeGoodsId[] {
  if (destination == null) {
    return fallbackGoodsIds.slice(0, MAX_ROUTE_GOODS);
  }

  const prioritizedGoodsIds =
    destination.premiumGoodsIds.length > 0 ? destination.premiumGoodsIds : destination.goodsIds;

  return prioritizedGoodsIds.slice(0, MAX_ROUTE_GOODS);
}

function selectDestinationGoodsIds(
  destination: MarketHouseShortageDestination | null,
  fallbackGoodsIds: readonly SettlementTradeGoodsId[]
): SettlementTradeGoodsId[] {
  if (destination == null) {
    return fallbackGoodsIds.slice(0, MAX_ROUTE_GOODS);
  }

  return destination.goodsIds.slice(0, MAX_ROUTE_GOODS);
}

export class MarketHouseInvestigationDialogue {
  private readonly speechPatterns: readonly MarketHouseInvestigationSpeechPattern[] = [
    {
      intro: (context) =>
        `你既来问门路，我便与你透一句。咱们这边的 ${context.localHeadlineLabel} 最拿得出手${
          context.supportGoodsLabel == null
            ? "。"
            : `，旁带 ${context.supportGoodsLabel} 也常有人问。`
        }`,
      route: (context) =>
        context.featuredDestinationLabel == null
          ? `眼下外路都在探价，你先盯住 ${context.routeGoodsLabel}，逢着缺货的埠头就别轻易松手。`
          : `若把 ${context.routeGoodsLabel} 送去 ${context.featuredDestinationLabel}，那边正缺 ${context.routeDestinationGoodsLabel}，价钱多半比本地抬得高${
              context.alternateDestinationLabel == null
                ? "。"
                : `；若脚程还赶得及，再转 ${context.alternateDestinationLabel} 也有赚头。`
            }`,
      closing: (context) => `（掌柜拨了拨算盘）${context.voiceLine}`,
    },
    {
      intro: (context) =>
        `眼下城里真能换钱的，还是 ${context.localHeadlineLabel}${
          context.supportGoodsLabel == null
            ? "。"
            : `，连 ${context.supportGoodsLabel} 也跟着沾光。`
        }`,
      route: (context) =>
        context.featuredDestinationLabel == null
          ? `你若想跑得稳当些，就先收拾 ${context.routeGoodsLabel}，看准外路缺口再动身。`
          : `你若肯跑远些，先把 ${context.routeGoodsLabel} 往 ${context.featuredDestinationLabel} 递过去；${
              context.alternateDestinationLabel == null
                ? `那边对 ${context.routeDestinationGoodsLabel} 看得紧，出手不慢。`
                : `出了手，再看 ${context.alternateDestinationLabel} 的市面，也多半有人接。`
            }`,
      closing: (context) => `（掌柜把茶盏往你手边一推）${context.voiceLine}`,
    },
    {
      intro: (context) =>
        `这世道乱归乱，买卖门路还在。咱们这里出得勤的，是 ${context.localHeadlineLabel}${
          context.supportGoodsLabel == null
            ? "。"
            : `；若连 ${context.supportGoodsLabel} 一并带上，行囊就更值钱。`
        }`,
      route: (context) =>
        context.featuredDestinationLabel == null
          ? `四下里总有人缺这宗货，只是你得看准脚程，别把好价拖成平价。`
          : `如今 ${context.featuredDestinationLabel} 最缺 ${context.routeDestinationGoodsLabel}，你带 ${context.routeGoodsLabel} 去，多半不愁没人接手${
              context.alternateDestinationLabel == null
                ? "。"
                : `；若嫌一城赚得浅，${context.alternateDestinationLabel} 也可顺路试试。`
            }`,
      closing: (context) => `（掌柜屈指敲了敲柜面）${context.voiceLine}`,
    },
    {
      intro: (context) =>
        `我看你是个肯听实话的。眼下本城最值钱的门面，是 ${context.localHeadlineLabel}${
          context.supportGoodsLabel == null
            ? "。"
            : `，再捎上 ${context.supportGoodsLabel}，更容易把价做起来。`
        }`,
      route: (context) =>
        context.featuredDestinationLabel == null
          ? `若想跑得稳当些，就别只盯一处牌价，外路一开缺口，${context.routeGoodsLabel} 自会有人抢。`
          : `若想跑得稳当些，就盯着 ${context.featuredDestinationLabel}；那边对 ${context.routeDestinationGoodsLabel} 看得紧${
              context.alternateDestinationLabel == null
                ? `，你把 ${context.routeGoodsLabel} 送到，多半就能换出个好价。`
                : `，你先走这一站，再看 ${context.alternateDestinationLabel}，赚头更厚。`
            }`,
      closing: (context) => `（掌柜把声音压低了些）${context.voiceLine}`,
    },
    {
      intro: (context) =>
        `要说现成的财路，我倒真知道一条。咱这边的 ${context.localHeadlineLabel}${
          context.supportGoodsLabel == null
            ? "，如今正吃市。"
            : `，连 ${context.supportGoodsLabel} 也都带着旺气。`
        }`,
      route: (context) =>
        context.featuredDestinationLabel == null
          ? `你先记住 ${context.routeGoodsLabel} 这一宗，逢着外路收得急的时候，出手便快。`
          : `把 ${context.routeGoodsLabel} 往 ${context.featuredDestinationLabel} 送，正赶上那边缺货；${
              context.alternateDestinationLabel == null
                ? `对 ${context.routeDestinationGoodsLabel} 这样稀罕的货色，价钱自然抬得起来。`
                : `若嫌一城赚得浅，${context.alternateDestinationLabel} 也可一试。`
            }`,
      closing: (context) => `（掌柜把账册轻轻一合）${context.voiceLine}`,
    },
  ];

  createDialogueLines(cityId: string): string[] {
    const profile = settlementTradeProfilesByCityId[cityId];
    const voiceLine =
      marketHouseInvestigationVoiceByCityId[cityId] ??
      marketHouseInvestigationVoiceByCityId.default ??
      "做买卖先看缺口与脚程，别被本地热闹迷了眼。";

    if (profile == null) {
      return [
        "你既来问门路，我也不瞒你。近来四下货路都在变，先别急着在一城里死守。",
        "真要寻差价，就盯住外路缺货的埠头，什么价能收、什么时辰能到，都得一并算。",
        `（掌柜拢了拢袖口）${voiceLine}`,
      ];
    }

    const style =
      this.speechPatterns[getPatternIndex(cityId, this.speechPatterns.length)] ??
      this.speechPatterns[0];
    const context = this.createSpeechContext(profile, voiceLine);

    if (style == null) {
      return [
        "你既来问门路，我也不瞒你。眼下市面起落太快，得盯准缺口再动身。",
        "先把本城出的货收拾齐整，再往外路缺货的地方试价，多半比守在原地强。",
        `（掌柜把算盘往怀里一拢）${voiceLine}`,
      ];
    }

    return [
      style.intro(context),
      style.route(context),
      style.closing(context),
    ];
  }

  private createSpeechContext(
    profile: SettlementTradeProfile,
    voiceLine: string
  ): MarketHouseInvestigationSpeechContext {
    const localGoodsIds = getLocalGoodsIds(profile);
    const destinations = collectShortageDestinations(profile.cityId, localGoodsIds);
    const featuredDestination = destinations[0] ?? null;
    const alternateDestination = destinations[1] ?? null;
    const fallbackGoodsIds =
      profile.exportTiers.primary.length > 0
        ? profile.exportTiers.primary
        : localGoodsIds;
    const routeGoodsIds = selectRouteGoodsIds(featuredDestination, fallbackGoodsIds);
    const destinationGoodsIds = selectDestinationGoodsIds(featuredDestination, routeGoodsIds);

    return {
      localHeadlineLabel: formatGoodsList(profile.exportTiers.primary, { emphasized: true }),
      supportGoodsLabel: formatSupportGoodsLabel(profile),
      featuredDestinationLabel:
        featuredDestination == null ? null : emphasize(featuredDestination.cityName),
      alternateDestinationLabel:
        alternateDestination == null ? null : emphasize(alternateDestination.cityName),
      routeGoodsLabel: formatGoodsList(routeGoodsIds, { emphasized: true }),
      routeDestinationGoodsLabel: formatGoodsList(destinationGoodsIds, { emphasized: true }),
      voiceLine,
    };
  }
}

export const defaultMarketHouseInvestigationDialogue =
  new MarketHouseInvestigationDialogue();
