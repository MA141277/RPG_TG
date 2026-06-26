import type {
  KeepHouseContributionDefinition,
  KeepHouseTaskDefinition,
} from "../../domain/keep-house";

export const keepHouseDefaultStrategy = {
  title: "本期方针",
  lines: [
    "今后六十日，以稳住粮道、整饬军伍为先。",
    "市面要活，军粮要足，诸将不得各行其是。",
  ],
};

export const keepHouseDefaultContributions: KeepHouseContributionDefinition[] = [
  { characterId: "char.kulan_tang_he", contribution: 32 },
  { characterId: "char.kulan_xu_da", contribution: 27 },
  { characterId: "char.player", contribution: 11 },
  { characterId: "char.kulan_chang_yuchun", contribution: 9 },
  { characterId: "char.kulan_guard", contribution: 6 },
];

export const keepHouseTaskDefinitions: KeepHouseTaskDefinition[] = [
  {
    id: "grain-procurement",
    missionId: "mission.keep.grain-procurement",
    title: "采办军粮",
    briefing: "去粮铺协助掌柜买卖米粮，先把军中的口粮补齐。",
    orderLines: [
      "你资历还浅，先把米粮这条线跑顺。",
      "去陈记粮铺帮着进出米粮，账要清，价要稳。",
    ],
    minTier: "runner",
  },
  {
    id: "market-inspection",
    missionId: "mission.keep.market-inspection",
    title: "巡看市面",
    briefing: "巡看市集货流与物价，摸清本月最紧缺的货种。",
    orderLines: [
      "你先替我盯住市面。",
      "看看哪几行货涨得快，回来如实禀报。",
    ],
    minTier: "officer",
  },
  {
    id: "militia-drill",
    missionId: "mission.keep.militia-drill",
    title: "整练兵伍",
    briefing: "督着营中兵伍整队操练，补齐刀枪弓矢。",
    orderLines: [
      "你已经能独当一面了。",
      "去把营中的操练与器械都整顿起来。",
    ],
    minTier: "commander",
  },
];
