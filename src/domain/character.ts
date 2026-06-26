import type { SceneId } from "./action";
import type { EventId } from "./event";

export type CharacterId = string;
export type CharacterStatKey =
  | "leadership"
  | "martial"
  | "intelligence"
  | "politics"
  | "charm"
  | "fame"
  | "gold";

export type SkillKey =
  | "ashigaru"
  | "horse"
  | "teppo"
  | "navy"
  | "archery"
  | "martial"
  | "military"
  | "ninjutsu"
  | "construction"
  | "development"
  | "mining"
  | "arithmetic"
  | "etiquette"
  | "rhetoric"
  | "tea"
  | "medicine";

export const SKILL_LABELS: Record<SkillKey, string> = {
  ashigaru: "足轻",
  horse: "骑马",
  teppo: "铁炮",
  navy: "水军",
  archery: "弓术",
  martial: "武艺",
  military: "军学",
  ninjutsu: "忍术",
  construction: "建筑",
  development: "开垦",
  mining: "矿山",
  arithmetic: "算术",
  etiquette: "礼法",
  rhetoric: "辩才",
  tea: "茶道",
  medicine: "医术",
};

export type PortraitVariant = {
  id: string;
  label: string;
  portraitId: string;
};

export type LeaderResidenceStatus = "available" | "busy" | "closed";

export type CharacterFunctionType =
  | "trade"
  | "minigame"
  | "modify-stats"
  | "open-scene"
  | "open-event"
  | "recruit"
  | "gift"
  | "custom";

export type CharacterFunction = {
  id: string;
  label: string;
  type: CharacterFunctionType;
  enabled?: boolean;
  sceneId?: SceneId;
  eventId?: EventId;
  minigameId?: string;
  effects?: Array<{
    stat: CharacterStatKey;
    delta: number;
  }>;
  handlerId?: string;
};

export type CharacterStats = Record<CharacterStatKey, number>;

export type CharacterDefinition = {
  id: CharacterId;
  name: string;
  birthYear: number;
  deathYear?: number | null;
  age: number;
  clanId?: string;
  title?: string;
  occupation?: string;
  affiliationLabel?: string;
  cityId: string;
  houseId?: string;
  portraitId: string;
  portraitVariants?: PortraitVariant[];
  portraitVariantId?: string | null;
  spriteId?: string;
  defaultSide?: "left" | "right";
  stats: CharacterStats;
  stamina: number;
  biography?: string;
  flags?: string[];
  isHistoricalFigure?: boolean;
  leaderResidenceEligible?: boolean;
  leaderResidenceStatus?: LeaderResidenceStatus;
  availableFunctions: CharacterFunction[];
  onTalkSceneId?: SceneId;
  skills?: Record<SkillKey, number>;
  teachableSkillKeys?: SkillKey[];
};
