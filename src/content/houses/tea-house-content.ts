import type { TeaHouseTopicCard } from "../../domain/tea-house";
import * as teaHouseContentJson from "../scenario-packs/zhuyuanzhang/house-content/tea-house-content.json";

type TeaHouseContent = {
  teaHouseBossProfile: {
    actorId: string;
    name: string;
    title: string;
    personality: string;
    specialty: string;
    favorability: number;
  };
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

const teaHouseContent =
  ((teaHouseContentJson as { default?: TeaHouseContent }).default ??
    teaHouseContentJson) as TeaHouseContent;

export const teaHouseBossProfile = teaHouseContent.teaHouseBossProfile;
export const teaHouseBossGreetingTextIds = teaHouseContent.teaHouseBossGreetingTextIds;
export const teaHouseBossOpenTextIds = teaHouseContent.teaHouseBossOpenTextIds;
export const teaHouseBossDialogueTextIds = teaHouseContent.teaHouseBossDialogueTextIds;
export const teaHouseBossIntelTextIds = teaHouseContent.teaHouseBossIntelTextIds;
export const teaHouseTeaCost = teaHouseContent.teaHouseTeaCost;
export const teaHouseInitialSpirit = teaHouseContent.teaHouseInitialSpirit;
export const teaHouseTurnTimeLimitSec = teaHouseContent.teaHouseTurnTimeLimitSec;
export const teaHouseLowIntelChance = teaHouseContent.teaHouseLowIntelChance;
export const teaHouseTopicCounterMap = teaHouseContent.teaHouseTopicCounterMap;
export const teaHousePersonalityTopicWeights =
  teaHouseContent.teaHousePersonalityTopicWeights;
