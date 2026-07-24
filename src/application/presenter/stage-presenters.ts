import { selectBuildingModuleStage } from "../building/building-module-entry";
import {
  selectCityModuleStage,
  selectCityModuleUnderlay,
} from "../city/city-module-entry";
import {
  getCurrentDialogueChoiceOptions,
  getCurrentDialogueNode,
} from "../story/story-runtime";
import type { AppState } from "../app-shell";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { HouseDefinition } from "../../domain/house";
import type { AppPresenterStageOutput } from "./presenter-output";

export type StagePresenterInput = {
  appState: AppState;
  cityDefinition: CityDefinition;
  cityDefinitions?: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  buildingArrangements?: BuildingArrangementDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  playerCharacterId: string;
  textEntriesById?: Record<string, string>;
  citySceneMappingsByCityId?: Record<string, CitySceneMapping>;
  dialogueDefinitionsById?: Record<string, RuntimeDialogueDefinition>;
};

export function createStagePresenterOutput(
  input: StagePresenterInput
): AppPresenterStageOutput {
  const currentView = input.appState.gameState.ui.currentView;
  const cityDefinitions = input.cityDefinitions ?? [input.cityDefinition];
  const activeCityDefinition =
    cityDefinitions.find(
      (cityDefinition) =>
        cityDefinition.id === input.appState.gameState.world.currentCityId
    ) ?? input.cityDefinition;
  const citySceneMapping =
    input.citySceneMappingsByCityId?.[activeCityDefinition.id] ?? null;

  if (currentView === "map") {
    return { type: "map" };
  }

  if (currentView === "city") {
    return selectCityModuleStage({
      appState: input.appState,
      activeCityDefinition,
      houseDefinitions: input.houseDefinitions,
      cityEntries: input.cityEntries,
      citySceneMapping,
    });
  }

  if (currentView === "city-3d") {
    return {
      type: "city-3d",
      activeCityDefinition,
      citySceneMapping,
    };
  }

  if (currentView === "house") {
    return selectBuildingModuleStage({
      appState: input.appState,
      cityDefinitions,
      houseDefinitions: input.houseDefinitions,
      buildingArrangements: input.buildingArrangements,
      cityNpcPoolDefinitions: input.cityNpcPoolDefinitions,
      playerCharacterId: input.playerCharacterId,
      textEntriesById: input.textEntriesById,
    });
  }

  if (currentView === "minigame") {
    if (input.appState.gameState.world.currentHouseId != null) {
      return selectBuildingModuleStage({
        appState: {
          ...input.appState,
          gameState: {
            ...input.appState.gameState,
            ui: {
              ...input.appState.gameState.ui,
              currentView: "house",
            },
          },
        },
        cityDefinitions,
        houseDefinitions: input.houseDefinitions,
        buildingArrangements: input.buildingArrangements,
        cityNpcPoolDefinitions: input.cityNpcPoolDefinitions,
        playerCharacterId: input.playerCharacterId,
        textEntriesById: input.textEntriesById,
      });
    }

    if (input.appState.gameState.world.currentCityId != null) {
      return selectCityModuleStage({
        appState: {
          ...input.appState,
          gameState: {
            ...input.appState.gameState,
            ui: {
              ...input.appState.gameState.ui,
              currentView: "city",
            },
          },
        },
        activeCityDefinition,
        houseDefinitions: input.houseDefinitions,
        cityEntries: input.cityEntries,
        citySceneMapping,
      });
    }
  }

  if (currentView === "dialogue") {
    const cityUnderlay =
      input.appState.gameState.world.currentCityId != null &&
      input.appState.gameState.world.currentHouseId == null
        ? selectCityModuleUnderlay({
            appState: input.appState,
            activeCityDefinition,
            houseDefinitions: input.houseDefinitions,
            cityEntries: input.cityEntries,
            citySceneMapping,
          })
        : undefined;
    const buildingUnderlay =
      input.appState.gameState.world.currentHouseId != null
        ? selectBuildingModuleStage({
            appState: {
              ...input.appState,
              gameState: {
                ...input.appState.gameState,
                ui: {
                  ...input.appState.gameState.ui,
                  currentView: "house",
                },
              },
            },
            cityDefinitions,
            houseDefinitions: input.houseDefinitions,
            buildingArrangements: input.buildingArrangements,
            cityNpcPoolDefinitions: input.cityNpcPoolDefinitions,
            playerCharacterId: input.playerCharacterId,
            textEntriesById: input.textEntriesById,
          })
        : undefined;

    return {
      type: "dialogue",
      currentDialogueNode: getCurrentDialogueNode(
        input.appState.gameState,
        input.dialogueDefinitionsById ?? {}
      ),
      currentDialogueChoiceOptions: getCurrentDialogueChoiceOptions(
        input.appState.gameState,
        input.dialogueDefinitionsById ?? {}
      ),
      ...(cityUnderlay == null ? {} : { cityUnderlay }),
      ...(buildingUnderlay == null || buildingUnderlay.type !== "building"
        ? {}
        : {
            buildingUnderlay: {
              activeHouse: buildingUnderlay.activeHouse,
              arrangement: buildingUnderlay.arrangement,
              containerViewModels: buildingUnderlay.containerViewModels,
            },
          }),
    };
  }

  if (currentView === "battle") {
    return { type: "battle" };
  }

  return { type: "empty" };
}
