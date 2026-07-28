import type { CharacterId } from "./character";
import type { HouseId } from "./house";

export type CityEntryId = string;
export type CityEntryDirectoryType = "leader-residence" | "building";
export type CityEntryArtworkId =
  | "leader-residence"
  | "grain-shop"
  | "market-house"
  | "tavern"
  | "tea-house"
  | "temple-house"
  | "medicine-house"
  | "home-house"
  | "keep-house"
  | "dojo"
  | "building";

export type CityEntryDefinition = {
  id: CityEntryId;
  cityId: string;
  name: string;
  directoryType: CityEntryDirectoryType;
  targetHouseId: HouseId;
  artworkId: CityEntryArtworkId;
  visibleStoryStages?: string[];
};

export type CityEntryOption = {
  entryId: CityEntryId;
  characterId: CharacterId;
  title: string;
  subtitle: string;
  factionLabel: string;
  relationLabel: string;
  statusLabel: string;
  tags: string[];
  disabled?: boolean;
};
