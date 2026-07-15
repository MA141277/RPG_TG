import type { SceneId } from "./action";
import type { CharacterId } from "./character";
import type { CityId } from "./city";
import type { CityNpcPoolRuntimeState } from "./city-npc";
import type { EventId } from "./event";
import type { HouseId } from "./house";
import type { CityMarketData } from "./market";
import type { MapExplorationState, MapId } from "./map";
import type { MissionId } from "./mission";
import type { ActiveStoryBattleSession } from "./story-battle";
import type { ActiveActivitySession } from "./activity-session";
import type { GlobalUIState } from "./global-ui";
import type { CardInventory } from "./card";
import type { ValuableItemInventory } from "./valuable-item";
import type { TaskRuntimeState } from "../core/contracts/task-runtime";
import type { ActivePlayableSession } from "../core/contracts/playable-runtime";
import type { CampaignMapExplorationState } from "./map-exploration";

export type ViewName =
  | "map"
  | "city"
  | "city-3d"
  | "house"
  | "scene"
  | "battle"
  | "minigame";
export type SceneStatus = "idle" | "playing" | "waiting-choice";
export type TimeOfDay = "morning" | "afternoon" | "night";
export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type GameState = {
  world: {
    currentMapId: MapId;
    currentCityId: CityId;
    currentHouseId: HouseId | null;
    timeOfDay: TimeOfDay;
    schedule: {
      councilDate: CalendarDate;
    };
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
  storyBattle: ActiveStoryBattleSession;
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
    tasks: TaskRuntimeState;
    playableSession: ActivePlayableSession | null;
    cityNpcPools: Record<CityId, CityNpcPoolRuntimeState>;
    cityMarkets: Record<CityId, CityMarketData>;
    mapExplorationByMapId: Record<MapId, MapExplorationState>;
    activitySession: ActiveActivitySession;
    mapExploration: CampaignMapExplorationState;
    eventHistory: Record<
      EventId,
      {
        firedCount: number;
        lastTriggeredOn: string | null;
      }
    >;
  };
};
