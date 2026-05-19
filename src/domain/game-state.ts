import type { SceneId } from "./action";
import type { CharacterId } from "./character";
import type { CityId } from "./city";
import type { EventId } from "./event";
import type { HouseId } from "./house";
import type { MapId } from "./map";
import type { MissionId } from "./mission";
import type { GlobalUIState } from "./global-ui";
import type { CardInventory } from "./card";
import type { ValuableItemInventory } from "./valuable-item";

export type ViewName = "map" | "city" | "house" | "scene" | "minigame";
export type SceneStatus = "idle" | "playing" | "waiting-choice";

export type GameState = {
  world: {
    currentMapId: MapId;
    currentCityId: CityId;
    currentHouseId: HouseId | null;
  };
  player: {
    characterId: CharacterId;
  };
  calendar: {
    chapterId: string;
    year: number;
    month: number;
    day: number;
  };
  scene: {
    activeEventId: EventId | null;
    activeSceneId: SceneId | null;
    cursor: number;
    status: SceneStatus;
  };
  ui: GlobalUIState & {
    currentView: ViewName;
  };
  missions: {
    activeMissionId: MissionId | null;
    completedMissionIds: MissionId[];
  };
  cards: CardInventory;
  valuables: ValuableItemInventory;
  runtime: {
    flags: Record<string, boolean>;
    variables: Record<string, number | string>;
    eventHistory: Record<
      EventId,
      {
        firedCount: number;
        lastTriggeredOn: string | null;
      }
    >;
  };
};
