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
};

export type NpcInteractionMenuViewModel = {
  type: "npc-interaction-menu";
  context: NpcInteractionContext;
  targetCharacterId: CharacterId;
  targetName: string;
  options: NpcInteractionOptionViewModel[];
};
