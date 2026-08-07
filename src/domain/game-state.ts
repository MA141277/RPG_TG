import type { SceneId } from "./action";
import type { CharacterId } from "./character";
import type { CityId } from "./city";
import type { CityNpcPoolRuntimeState } from "./city-npc";
import type { EventId } from "./event";
import type { FactionAffiliationsState } from "./faction-affiliation";
import type { HouseId } from "./house";
import type { CityMarketData } from "./market";
import type { MapExplorationState, MapId } from "./map";
import type { MissionId } from "./mission";
import type { FactionMembershipsState } from "./review";
import type { ActiveStoryBattleSession } from "./story-battle";
import type { ActiveActivitySession } from "./activity-session";
import type { GlobalUIState } from "./global-ui";
import type { CardInventory } from "./card";
import type { ValuableItemInventory } from "./valuable-item";
import type { TroopRuntimeState } from "./troop-editor";
import type { SettlementTradeRuntimeState } from "./settlement-trade";
import type { TaskRuntimeState } from "../core/contracts/task-runtime";
import type { ActivePlayableSession } from "../core/contracts/playable-runtime";
import type { CampaignMapExplorationState } from "./map-exploration";
import type { RuntimeProgressState } from "../core/contracts/progression-runtime";
import type { CivilizationSandboxState } from "./civilization-sandbox";

export type ViewName =
  | "map"
  | "troop-editor"
  | "troop-management"
  | "city"
  | "city-3d"
  | "house"
  | "dialogue"
  | "scene"
  | "battle"
  | "minigame";
export const GAME_VIEW_NAMES = [
  "map",
  "troop-editor",
  "troop-management",
  "city",
  "city-3d",
  "house",
  "dialogue",
  "scene",
  "battle",
  "minigame",
] as const satisfies readonly ViewName[];

export function isViewName(value: unknown): value is ViewName {
  return (
    typeof value === "string" &&
    (GAME_VIEW_NAMES as readonly string[]).includes(value)
  );
}
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
    factionMerit: Record<string, Record<CharacterId, number>>;
    factionMemberships: FactionMembershipsState;
    factionAffiliations: FactionAffiliationsState;
    tasks: TaskRuntimeState;
    playableSession: ActivePlayableSession | null;
    cityNpcPools: Record<CityId, CityNpcPoolRuntimeState>;
    cityMarkets: Record<CityId, CityMarketData>;
    settlementTrade: SettlementTradeRuntimeState;
    mapExplorationByMapId: Record<MapId, MapExplorationState>;
    activitySession: ActiveActivitySession;
    troops: TroopRuntimeState;
    mapExploration: CampaignMapExplorationState;
    civilizationSandbox: CivilizationSandboxState;
    progression?: RuntimeProgressState;
    eventHistory: Record<
      EventId,
      {
        firedCount: number;
        lastTriggeredOn: string | null;
      }
    >;
  };
};
