import type { CardInventory } from "../../domain/card";
import type { GameState } from "../../domain/game-state";
import type { ValuableItemInventory } from "../../domain/valuable-item";
import type { TaskRuntimeState } from "../../core/contracts/task-runtime";
import { createInitialCampaignMapExplorationState } from "../map/campaign-map-exploration";

export type InitialStateInput = {
  currentMapId: string;
  currentCityId: string;
  currentHouseId: string | null;
  playerCharacterId: string;
  chapterId: string;
  year: number;
  month: number;
  day: number;
  pinnedCharacterId: string;
  reviewDateText: string;
  mainHouseMissionText: string;
  cards: CardInventory;
  valuables: ValuableItemInventory;
  activeEventId?: string | null;
  activeSceneId?: string | null;
  currentView?: GameState["ui"]["currentView"];
  timeOfDay?: GameState["world"]["timeOfDay"];
  councilDate?: GameState["world"]["schedule"]["councilDate"];
};

function createInitialTaskRuntimeState(): TaskRuntimeState {
  return {
    instancesByTaskId: {},
    completedTaskIds: [],
    failedTaskIds: [],
    updatedAt: "",
  };
}

export function createInitialState(input: InitialStateInput): GameState {
  return {
    world: {
      currentMapId: input.currentMapId,
      currentCityId: input.currentCityId,
      currentHouseId: input.currentHouseId,
      timeOfDay: input.timeOfDay ?? "morning",
      schedule: {
        councilDate: input.councilDate ?? {
          year: input.year,
          month: input.month,
          day: input.day,
        },
      },
    },
    player: {
      characterId: input.playerCharacterId,
    },
    calendar: {
      chapterId: input.chapterId,
      year: input.year,
      month: input.month,
      day: input.day,
    },
    scene: {
      activeEventId: input.activeEventId ?? null,
      activeSceneId: input.activeSceneId ?? null,
      cursor: 0,
      status:
        input.activeSceneId == null ? "idle" : "playing",
    },
    storyBattle: null,
    ui: {
      visiblePanels: ["player-card", "main-mission", "notifications"],
      pinnedCharacterId: input.pinnedCharacterId,
      detailCharacterId: null,
      activeMissionId: null,
      reviewDateText: input.reviewDateText,
      mainHouseMissionText: input.mainHouseMissionText,
      overlayView: null,
      cardLibraryFilter: "all",
      valuableLibraryFilter: "all",
      valuableLibrarySortKey: "name",
      valuableLibrarySortDirection: "asc",
      houseSession: null,
      npcInteractionSession: null,
      currentView: input.currentView ?? "map",
    },
    missions: {
      activeMissionId: null,
      completedMissionIds: [],
    },
    cards: input.cards,
    valuables: input.valuables,
    runtime: {
      flags: {},
      variables: {},
      tasks: createInitialTaskRuntimeState(),
      playableSession: null,
      cityNpcPools: {},
      cityMarkets: {},
      mapExplorationByMapId: {},
      activitySession: null,
      mapExploration: createInitialCampaignMapExplorationState(),
      eventHistory: {},
    },
  };
}
