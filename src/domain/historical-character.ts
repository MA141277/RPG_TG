import type {
  CityNpcActivityLocationId,
} from "./city-npc";
import type {
  LeaderResidenceStatus,
  SkillKey,
} from "./character";

export type HistoricalCharacterPriority = "P0" | "P1" | "P2" | "P3";

export type HistoricalCharacterSourceType =
  | "historical"
  | "mod-derived"
  | "fictionalized"
  | "composite"
  | "uncertain";

export type HistoricalCharacterStatus =
  | "candidate"
  | "drafted"
  | "implemented"
  | "cut";

export type HistoricalCharacterStageTag =
  | "huangjue-temple"
  | "wandering-monk"
  | "haozhou-uprising"
  | "guo-zixing-camp"
  | "hongjin-song"
  | "jianghuai-expansion"
  | "jiqing-campaign"
  | "early-yingtian"
  | "late-context-only";

export type HistoricalCharacterRoleTag =
  | "protagonist"
  | "family"
  | "patron"
  | "commander"
  | "advisor"
  | "civil-official"
  | "general"
  | "rival"
  | "enemy"
  | "monk"
  | "local-elite"
  | "commoner"
  | "merchant"
  | "rumor-source"
  | "event-only";

export type HistoricalCharacterFactionId =
  | "zhu_yuanzhang"
  | "guo_zixing"
  | "xiaoming_song"
  | "zhang_shicheng"
  | "chen_youliang"
  | "ming_yuzhen"
  | "fang_guozhen"
  | "chen_youding"
  | "yuan_court"
  | "yuan_henan_shandong"
  | "yuan_shaanxi_gansu"
  | "temple_commoner";

export type HistoricalCharacterCityNpcProfile = {
  enabled: boolean;
  title: string;
  personality: string;
  specialty: string;
  favorability: number;
  activityWeight: Partial<Record<CityNpcActivityLocationId, number>>;
  dialoguePool: string[];
  intelPool: string[];
};

export type HistoricalCharacterLeaderResidenceProfile = {
  eligible: boolean;
  status: LeaderResidenceStatus;
  residenceRole: "lord" | "general" | "advisor" | "civil" | "family" | "guest";
  title: string;
  occupation: string;
  affiliationLabel: string;
  teachableSkillKeys: SkillKey[];
};

export type HistoricalCharacterRecord = {
  id: string;
  canonicalName: string;
  displayName: string;
  aliases: string[];
  sourceType: HistoricalCharacterSourceType;
  priority: HistoricalCharacterPriority;
  gender: "male" | "female" | "unknown";
  birthYear: number | null;
  deathYear: number | null;
  activeYears: { from: number | null; to: number | null };
  factionId: HistoricalCharacterFactionId;
  factionName: string;
  roleTags: HistoricalCharacterRoleTag[];
  stageTags: HistoricalCharacterStageTag[];
  homeCityNodeId: string | null;
  currentCityNodeId: string | null;
  relatedCityNodeIds: string[];
  shortBio: string;
  gameplayUse: string;
  sourceNotes: string[];
  status: HistoricalCharacterStatus;
  cityNpcProfile?: HistoricalCharacterCityNpcProfile;
  leaderResidenceProfile?: HistoricalCharacterLeaderResidenceProfile;
};

export type HistoricalCityRoster = {
  cityNodeId: string;
  primaryCharacterIds: string[];
  secondaryCharacterIds: string[];
  backgroundCharacterIds: string[];
  notes: string;
};
