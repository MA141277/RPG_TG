import type { CharacterId } from "./character";
import type { HouseId } from "./house";
import type { HouseModuleId } from "./house-module";

export type CityEntryId = string;
export type CityEntryDirectoryType = "leader-residence" | "building";
export type CityEntryArtworkId =
  | HouseModuleId
  | "merchant"
  | "inn"
  | "dojo"
  | "temple"
  | "medicine-house"
  | "residence"
  | "custom"
  | "building"
  | "fallback";

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
