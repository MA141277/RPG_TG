import type { CharacterId } from "./character";
import type { CityNpcActivityLocationId } from "./city-npc";
import type { EventId } from "./event";

export type HouseId = string;

export type HouseDefinition = {
  id: HouseId;
  cityId: string;
  name: string;
  backgroundId?: string;
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
  moduleId?: string | null;
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
