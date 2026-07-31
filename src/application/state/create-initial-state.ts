import type { CardInventory } from "../../domain/card";
import type { GameState } from "../../domain/game-state";
import type { EquipmentLoadout } from "../../domain/equipment/equipment-loadout-service";
import { normalizeEquipmentLoadout } from "../../domain/equipment/equipment-loadout-service";
import type {
  ValuableItemId,
  ValuableItemInventory,
} from "../../domain/valuable-item";
import { createDefaultTroopRuntimeState } from "../../domain/troop-editor";
import type { TaskRuntimeState } from "../../core/contracts/task-runtime";
import { createInitialCampaignMapExplorationState } from "../map/campaign-map-exploration";

type LegacyEquippedWeaponSet = {
  swordId: ValuableItemId | null;
  armorId: ValuableItemId | null;
};

type InitialValuableInventoryInput = Omit<
  ValuableItemInventory,
  "equippedSlots"
> & {
  equippedSlots?: Partial<EquipmentLoadout> | null;
  equippedWeaponSet?: LegacyEquippedWeaponSet;
};

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
  valuables: InitialValuableInventoryInput;
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

function normalizeInitialValuables(
  valuables: InitialValuableInventoryInput
): ValuableItemInventory {
  const legacyLoadout =
    valuables.equippedWeaponSet == null
      ? null
      : {
          weapon: valuables.equippedWeaponSet.swordId,
          armor: valuables.equippedWeaponSet.armorId,
        };

  return {
    items: valuables.items,
    selectedItemId: valuables.selectedItemId,
    equippedSlots: normalizeEquipmentLoadout(
      valuables.equippedSlots ?? legacyLoadout
    ),
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
      isCharacterAbilityDetailOpen: false,
      selectedTroopId: null,
      activeMissionId: null,
      reviewDateText: input.reviewDateText,
      mainHouseMissionText: input.mainHouseMissionText,
      overlayView: null,
      cardLibraryFilter: "all",
      backpackLibraryFilter: "all",
      selectedBackpackItemId: null,
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
    valuables: normalizeInitialValuables(input.valuables),
    runtime: {
      flags: {},
      variables: {},
      factionMerit: {},
      factionMemberships: {},
      factionAffiliations: {},
      tasks: createInitialTaskRuntimeState(),
      playableSession: null,
      cityNpcPools: {},
      cityMarkets: {},
      settlementTrade: {},
      mapExplorationByMapId: {},
      activitySession: null,
      troops: createDefaultTroopRuntimeState(input.playerCharacterId),
      mapExploration: createInitialCampaignMapExplorationState(),
      eventHistory: {},
    },
  };
}
