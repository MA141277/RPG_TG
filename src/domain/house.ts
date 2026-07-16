import type { CharacterId } from "./character";
import type { CityNpcActivityLocationId } from "./city-npc";
import type { EventId } from "./event";
import type { HouseModuleId } from "./house-module";

export type HouseId = string;

export type HouseAccessRefusalRule = {
  id: string;
  priority?: number;
  houseIds?: HouseId[];
  houseModuleIds?: HouseModuleId[];
  excludedHouseIds?: HouseId[];
  excludedHouseModuleIds?: HouseModuleId[];
  storyStages?: string[];
  requiredFlags?: string[];
  missingFlags?: string[];
  speakerCharacterId: CharacterId | "player";
  title: string;
  text: string;
  confirmLabel: string;
};

export type HouseDefinition = {
  id: HouseId;
  cityId: string;
  name: string;
  type:
    | "castle"
    | "merchant"
    | "inn"
    | "dojo"
    | "tea-house"
    | "temple"
    | "medicine-house"
    | "residence"
    | "custom";
  characterIds: CharacterId[];
  defaultCharacterId: CharacterId | null;
  visibleStoryStages?: string[];
  enterableStoryStages?: string[];
  requiresPlayerCurrentCityMatch?: boolean;
  activityLocationId?: CityNpcActivityLocationId | null;
  moduleId?: HouseModuleId | null;
  level?: number;
  damaged?: boolean;
  outputMultiplier?: number;
  onEnterEventId?: EventId;
  onLeaveEventId?: EventId;
  backAction: {
    label: string;
    targetView: "city";
  };
};
