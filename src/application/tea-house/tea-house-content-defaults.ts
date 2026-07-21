import type { TeaHouseTopicCard } from "../../domain/tea-house";
import { TEA_HOUSE_TOPIC_CARDS } from "../../domain/tea-house";
import { defaultRuntimeContent } from "../content/default-runtime-content";
import { getHouseModuleDefaults } from "../content/house-module-defaults";

export type TeaHouseBossProfile = {
  actorId: string;
  name: string;
  title: string;
  personality: string;
  specialty: string;
  favorability: number;
};

export type TeaHouseContentDefaults = {
  teaHouseBossProfile: TeaHouseBossProfile;
  teaHouseBossGreetingTextIds: string[];
  teaHouseBossOpenTextIds: string[];
  teaHouseBossDialogueTextIds: string[];
  teaHouseBossIntelTextIds: string[];
  teaHouseTeaCost: number;
  teaHouseInitialSpirit: number;
  teaHouseTurnTimeLimitSec: number;
  teaHouseLowIntelChance: number;
  teaHouseTopicCounterMap: Record<TeaHouseTopicCard, TeaHouseTopicCard>;
  teaHousePersonalityTopicWeights: Record<string, Record<TeaHouseTopicCard, number>>;
};

const [topicA, topicB, topicC, topicD, topicE] = TEA_HOUSE_TOPIC_CARDS;

const FALLBACK_TEA_HOUSE_CONTENT: TeaHouseContentDefaults = {
  teaHouseBossProfile: {
    actorId: "char.kulan_tea_boss",
    name: "Tea House Boss",
    title: "Tea House Boss",
    personality: "default",
    specialty: "intel",
    favorability: 0,
  },
  teaHouseBossGreetingTextIds: ["runtime.zhu_yuanzhang.tea_house.greeting.fixed.001"],
  teaHouseBossOpenTextIds: ["runtime.zhu_yuanzhang.tea_house.open.fixed.001"],
  teaHouseBossDialogueTextIds: [
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.001",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.002",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.003",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.004",
    "runtime.zhu_yuanzhang.tea_house.dialogue.fixed.005",
  ],
  teaHouseBossIntelTextIds: [
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.001",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.002",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.003",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.004",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.005",
    "runtime.zhu_yuanzhang.tea_house.intel.fixed.006",
  ],
  teaHouseTeaCost: 20,
  teaHouseInitialSpirit: 10,
  teaHouseTurnTimeLimitSec: 5,
  teaHouseLowIntelChance: 0.25,
  teaHouseTopicCounterMap: {
    [topicA]: topicB,
    [topicB]: topicD,
    [topicC]: topicE,
    [topicD]: topicC,
    [topicE]: topicA,
  },
  teaHousePersonalityTopicWeights: {
    default: {
      [topicA]: 20,
      [topicB]: 20,
      [topicC]: 20,
      [topicD]: 20,
      [topicE]: 20,
    },
  },
};

export function getTeaHouseContentDefaults(): TeaHouseContentDefaults {
  return (
    getHouseModuleDefaults<TeaHouseContentDefaults>(
      defaultRuntimeContent.houseModuleDefaults,
      "tea-house"
    ) ?? FALLBACK_TEA_HOUSE_CONTENT
  );
}
