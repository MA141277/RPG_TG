import type { AppState } from "../app-shell";
import { selectCityNpcSummariesForHouse } from "../city-npcs/select-city-npcs-for-house";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../house-modules/house-module-registry";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { HouseDefinition } from "../../domain/house";
import type {
  AppPresenterStageOutput,
  BuildingContainerViewModel,
} from "../presenter/presenter-output";

export type BuildingModuleEntryInput = {
  appState: AppState;
  houseDefinitions: HouseDefinition[];
  buildingArrangements?: BuildingArrangementDefinition[] | undefined;
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  playerCharacterId: string;
  textEntriesById?: Record<string, string> | undefined;
  houseModuleRegistry?: HouseModuleRegistry | undefined;
};

export type BuildingModuleStage =
  | Extract<AppPresenterStageOutput, { type: "building" }>
  | Extract<AppPresenterStageOutput, { type: "house" }>
  | Extract<AppPresenterStageOutput, { type: "empty" }>;

function selectActiveHouseDefinition(
  appState: AppState,
  houseDefinitions: HouseDefinition[]
): HouseDefinition | null {
  return (
    houseDefinitions.find(
      (houseDefinition) =>
        houseDefinition.id === appState.gameState.world.currentHouseId
    ) ?? null
  );
}

function selectActiveBuildingArrangement(
  input: BuildingModuleEntryInput,
  activeHouse: HouseDefinition
): BuildingArrangementDefinition | null {
  const currentCityId = input.appState.gameState.world.currentCityId;
  if (currentCityId == null) {
    return null;
  }

  return (
    input.buildingArrangements?.find(
      (arrangement) =>
        arrangement.cityId === currentCityId &&
        arrangement.buildingId === activeHouse.id
    ) ?? null
  );
}

function createContainerViewModels(
  arrangement: BuildingArrangementDefinition,
  input: BuildingModuleEntryInput
): BuildingContainerViewModel[] {
  const characterById = new Map(
    input.appState.characterDefinitions.map((character) => [character.id, character])
  );

  return arrangement.containers.map((container) => {
    if (container.type === "character-seats") {
      const includedIds =
        container.source?.type === "arrangement-mounted-npcs"
          ? container.source.includeNpcIds ?? arrangement.mountedNpcIds
          : container.source?.type === "static-records"
            ? container.source.recordIds
            : arrangement.mountedNpcIds;
      const allowedMountedIds = new Set(arrangement.mountedNpcIds);
      return {
        id: container.id,
        type: "character-seats",
        ...(container.title == null ? {} : { title: container.title }),
        characters: includedIds.flatMap((characterId) => {
          if (!allowedMountedIds.has(characterId)) {
            return [];
          }
          const character = characterById.get(characterId);
          if (character == null) {
            return [];
          }
          return [
            {
              id: character.id,
              name: character.name,
              ...(character.title == null ? {} : { title: character.title }),
            },
          ];
        }),
      };
    }

    if (container.type === "action-menu") {
      return {
        id: container.id,
        type: "action-menu",
        ...(container.title == null ? {} : { title: container.title }),
        actions: (container.items ?? [])
          .filter((item) => item.isVisible !== false)
          .map((item) => ({
            id: item.id,
            label: item.label,
            eventId: item.eventId,
            isVisible: item.isVisible !== false,
            isEnabled: item.isEnabled !== false,
            ...(item.disabledHint == null
              ? {}
              : { disabledHint: item.disabledHint }),
          })),
      };
    }

    return {
      id: container.id,
      type: container.type,
      ...(container.title == null ? {} : { title: container.title }),
    };
  });
}

export function selectBuildingModuleStage(
  input: BuildingModuleEntryInput
): BuildingModuleStage {
  const houseModuleRegistry =
    input.houseModuleRegistry ?? builtinHouseModuleRegistry;
  const activeHouse = selectActiveHouseDefinition(
    input.appState,
    input.houseDefinitions
  );

  if (activeHouse == null) {
    return { type: "empty" };
  }

  const activeArrangement = selectActiveBuildingArrangement(input, activeHouse);
  if (activeArrangement != null) {
    return {
      type: "building",
      activeHouse,
      arrangement: activeArrangement,
      containerViewModels: createContainerViewModels(activeArrangement, input),
    };
  }

  if (activeHouse.moduleId != null) {
    const houseModule = houseModuleRegistry.getModule(activeHouse.moduleId);
    return {
      type: "house",
      activeHouse,
      moduleViewModel:
        houseModule == null
          ? null
          : houseModule.selectViewModel({
              gameState: input.appState.gameState,
              characterDefinitions: input.appState.characterDefinitions,
              houseDefinition: activeHouse,
              playerCharacterId: input.playerCharacterId,
              sessionState:
                input.appState.gameState.ui.houseSession?.state ?? null,
              textEntriesById: input.textEntriesById,
            }),
      cityNpcSummaries: [],
    };
  }

  return {
    type: "house",
    activeHouse,
    moduleViewModel: null,
    cityNpcSummaries: selectCityNpcSummariesForHouse(
      input.appState.gameState,
      activeHouse,
      input.cityNpcPoolDefinitions
    ),
  };
}
