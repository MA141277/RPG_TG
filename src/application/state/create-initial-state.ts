import type { CardInventory } from "../../domain/card";
import type { GameState } from "../../domain/game-state";
import type { ValuableItemInventory } from "../../domain/valuable-item";

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
};

export function createInitialState(input: InitialStateInput): GameState {
  return {
    world: {
      currentMapId: input.currentMapId,
      currentCityId: input.currentCityId,
      currentHouseId: input.currentHouseId,
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
    ui: {
      visiblePanels: ["player-card", "main-mission", "notifications"],
      pinnedCharacterId: input.pinnedCharacterId,
      activeMissionId: null,
      reviewDateText: input.reviewDateText,
      mainHouseMissionText: input.mainHouseMissionText,
      overlayView: null,
      cardLibraryFilter: "all",
      valuableLibraryFilter: "all",
      valuableLibrarySortKey: "name",
      valuableLibrarySortDirection: "asc",
      houseSession: null,
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
      cityNpcPools: {},
      eventHistory: {},
    },
  };
}
