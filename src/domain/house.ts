import type { CharacterId } from "./character";
import type { EventId } from "./event";

export type HouseId = string;

export type HouseDefinition = {
  id: HouseId;
  cityId: string;
  name: string;
  type: "castle" | "merchant" | "inn" | "dojo" | "tea-house" | "residence" | "custom";
  characterIds: CharacterId[];
  defaultCharacterId: CharacterId | null;
  onEnterEventId?: EventId;
  onLeaveEventId?: EventId;
  backAction: {
    label: string;
    targetView: "city";
  };
};
