import type { CharacterId } from "./character";
import type { HouseModuleId } from "./house-module";

export type NpcInteractionContext =
  | { type: "house"; houseId: string; moduleId?: HouseModuleId | null }
  | { type: "city"; cityId: string; locationId?: string }
  | { type: "scene"; sceneId: string };

export type NpcInteractionMode = "menu" | "dialogue" | "gift-select";

export type NpcInteractionSession = {
  context: NpcInteractionContext;
  targetCharacterId: CharacterId;
  mode: NpcInteractionMode;
} | null;

export type NpcPoolActorViewModel = {
  characterId: CharacterId;
  name: string;
  title?: string;
  avatarImageUrl?: string | null;
  isSelected?: boolean;
  disabled?: boolean;
};

export type NpcPoolViewModel = {
  context: NpcInteractionContext;
  actors: NpcPoolActorViewModel[];
};

export type NpcInteractionOptionKind = "special" | "profile" | "talk" | "gift";

export type NpcInteractionOptionViewModel = {
  id: string;
  label: string;
  kind: NpcInteractionOptionKind;
  disabled?: boolean;
  tone?: "default" | "accent";
  buttonSound?: "light" | "heavy";
};

export const NPC_INTERACTION_DEFAULT_OPTION_IDS = {
  profile: "npc-interaction:profile",
  talk: "npc-interaction:talk",
  gift: "npc-interaction:gift",
} as const;

export const NPC_INTERACTION_DEFAULT_OPTIONS: readonly NpcInteractionOptionViewModel[] = [
  {
    id: NPC_INTERACTION_DEFAULT_OPTION_IDS.talk,
    label: "谈话",
    kind: "talk",
    buttonSound: "light",
  },
] as const;

export const NPC_INTERACTION_TALK_SUB_OPTIONS: readonly NpcInteractionOptionViewModel[] = [
  {
    id: NPC_INTERACTION_DEFAULT_OPTION_IDS.gift,
    label: "送礼",
    kind: "gift",
    buttonSound: "light",
  },
  {
    id: NPC_INTERACTION_DEFAULT_OPTION_IDS.profile,
    label: "角色情报",
    kind: "profile",
    buttonSound: "light",
  },
] as const;

export type NpcInteractionMenuViewModel = {
  type: "npc-interaction-menu";
  context: NpcInteractionContext;
  targetCharacterId: CharacterId;
  targetName: string;
  options: NpcInteractionOptionViewModel[];
};
