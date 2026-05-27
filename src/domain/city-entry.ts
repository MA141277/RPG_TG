import type { CharacterId } from "./character";
import type { HouseId } from "./house";

export type CityEntryId = string;
export type CityEntryDirectoryType = "leader-residence";
export type CityEntryArtworkId = "leader-residence";

export type CityEntryDefinition = {
  id: CityEntryId;
  cityId: string;
  name: string;
  directoryType: CityEntryDirectoryType;
  targetHouseId: HouseId;
  artworkId: CityEntryArtworkId;
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
