import type { CityDefinition } from "../../../domain/city";
import { assertExists } from "../../../shared/assert";
import { defaultRuntimeContent } from "../../content/default-runtime-content";
import { getHouseModuleDefaults } from "../../content/house-module-defaults";

type MarketHouseActorContent = {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialty: string;
  favorability: number;
  isFixedHost: boolean;
};

export type MarketHouseContentDefaults = {
  marketHouseFixedBoss: MarketHouseActorContent;
  marketHouseRandomNpcPool: MarketHouseActorContent[];
  marketHouseGreetingTextIds: string[];
  marketHouseBossOpenTextIds: string[];
  marketHouseGuestOpenTextIdsByActorId: Record<string, string[]>;
  marketHouseSmallTalkTextIds: string[];
  marketHouseRumorTextIdsByCategory: Record<string, string[] | undefined>;
  marketHouseGeneralRumorTextIds: string[];
  marketHouseInvestigationSpecialtyTextIdByActorId: Record<string, string>;
};

const FALLBACK_MARKET_HOUSE_CONTENT: MarketHouseContentDefaults = {
  marketHouseBossOpenTextIds: [
    "runtime.zhu_yuanzhang.market_house.boss_open.001",
    "runtime.zhu_yuanzhang.market_house.boss_open.002",
  ],
  marketHouseFixedBoss: {
    id: "shopkeeper_qian",
    name: "\u94b1\u638c\u67dc",
    title: "\u8d27\u6808\u8001\u677f",
    personality: "\u7cbe\u660e",
    specialty: "\u4ea4\u6613",
    favorability: 0,
    isFixedHost: true,
  },
  marketHouseGeneralRumorTextIds: [
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.general.001",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.general.002",
    "runtime.zhu_yuanzhang.market_house.investigate.rumor.general.003",
  ],
  marketHouseGreetingTextIds: [
    "runtime.zhu_yuanzhang.market_house.greeting.001",
    "runtime.zhu_yuanzhang.market_house.greeting.002",
  ],
  marketHouseGuestOpenTextIdsByActorId: {
    horse_merchant: [
      "runtime.zhu_yuanzhang.market_house.guest_open.horse_merchant.001",
      "runtime.zhu_yuanzhang.market_house.guest_open.horse_merchant.002",
    ],
    medicine_merchant: [
      "runtime.zhu_yuanzhang.market_house.guest_open.medicine_merchant.001",
      "runtime.zhu_yuanzhang.market_house.guest_open.medicine_merchant.002",
    ],
    silk_merchant: [
      "runtime.zhu_yuanzhang.market_house.guest_open.silk_merchant.001",
      "runtime.zhu_yuanzhang.market_house.guest_open.silk_merchant.002",
    ],
    traveler_merchant: [
      "runtime.zhu_yuanzhang.market_house.guest_open.traveler_merchant.001",
      "runtime.zhu_yuanzhang.market_house.guest_open.traveler_merchant.002",
    ],
  },
  marketHouseInvestigationSpecialtyTextIdByActorId: {
    shopkeeper_qian: "runtime.zhu_yuanzhang.market_house.investigate.specialty.trade",
    horse_merchant: "runtime.zhu_yuanzhang.market_house.investigate.specialty.painting",
    medicine_merchant: "runtime.zhu_yuanzhang.market_house.investigate.specialty.medicine",
    silk_merchant: "runtime.zhu_yuanzhang.market_house.investigate.specialty.silk",
    traveler_merchant: "runtime.zhu_yuanzhang.market_house.investigate.specialty.travel",
  },
  marketHouseRandomNpcPool: [
    {
      id: "horse_merchant",
      name: "\u97e9\u4e66\u5546",
      title: "\u4e66\u753b\u8d27\u8d29",
      personality: "\u8c6a\u723d",
      specialty: "\u4e66\u753b",
      favorability: 0,
      isFixedHost: false,
    },
    {
      id: "medicine_merchant",
      name: "\u5b59\u836f\u5546",
      title: "\u836f\u6750\u5546",
      personality: "\u8c28\u614e",
      specialty: "\u836f\u6750",
      favorability: 0,
      isFixedHost: false,
    },
    {
      id: "silk_merchant",
      name: "\u6c88\u8001\u677f",
      title: "\u4e1d\u5546",
      personality: "\u5706\u6ed1",
      specialty: "\u4e1d\u7ef8",
      favorability: 0,
      isFixedHost: false,
    },
    {
      id: "traveler_merchant",
      name: "\u7f57\u884c\u5546",
      title: "\u884c\u811a\u5546\u4eba",
      personality: "\u5065\u8c08",
      specialty: "\u5916\u5730\u89c1\u95fb",
      favorability: 0,
      isFixedHost: false,
    },
  ],
  marketHouseRumorTextIdsByCategory: {
    grain: [
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.grain.001",
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.grain.002",
    ],
    medicine: [
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.medicine.001",
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.medicine.002",
    ],
    silk: [
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.silk.001",
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.silk.002",
    ],
    arms: [
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.arms.001",
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.arms.002",
    ],
    horses: [
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.horses.001",
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.horses.002",
    ],
    special: [
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.special.001",
      "runtime.zhu_yuanzhang.market_house.investigate.rumor.special.002",
    ],
  },
  marketHouseSmallTalkTextIds: [
    "runtime.zhu_yuanzhang.market_house.small_talk.001",
    "runtime.zhu_yuanzhang.market_house.small_talk.002",
    "runtime.zhu_yuanzhang.market_house.small_talk.003",
    "runtime.zhu_yuanzhang.market_house.small_talk.004",
  ],
};

export function getMarketHouseContentDefaults(): MarketHouseContentDefaults {
  return (
    getHouseModuleDefaults<MarketHouseContentDefaults>(
      defaultRuntimeContent.houseModuleDefaults,
      "market-house"
    ) ?? FALLBACK_MARKET_HOUSE_CONTENT
  );
}

export function getMarketHouseCityDefinition(cityId: string): CityDefinition {
  const cityDefinition = defaultRuntimeContent.cities.find(
    (candidateCity) => candidateCity.id === cityId
  );
  assertExists(
    cityDefinition,
    `City definition missing for id "${cityId}" in market house module.`
  );
  return cityDefinition;
}

export function getMarketHouseTextEntries(input: {
  textEntriesById?: Record<string, string> | undefined;
}): Record<string, string> {
  return {
    ...defaultRuntimeContent.textEntriesById,
    ...(input.textEntriesById ?? {}),
  };
}
