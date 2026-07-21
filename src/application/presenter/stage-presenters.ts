import { selectBuildingModuleStage } from "../building/building-module-entry";
import {
  selectCityModuleStage,
  selectCityModuleUnderlay,
} from "../city/city-module-entry";
import {
  getCurrentChoiceOptions,
  getCurrentSceneAction,
} from "../story/story-runtime";
import type { AppState } from "../app-shell";
import type { SceneDefinition } from "../../domain/action";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
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
  sceneDefinitionsById?: Record<string, SceneDefinition>;
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
      houseDefinitions: input.houseDefinitions,
      buildingArrangements: input.buildingArrangements,
      cityNpcPoolDefinitions: input.cityNpcPoolDefinitions,
      playerCharacterId: input.playerCharacterId,
      textEntriesById: input.textEntriesById,
    });
  }

  if (currentView === "scene") {
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

    return {
      type: "scene",
      currentSceneAction: getCurrentSceneAction(
        input.appState.gameState,
        input.sceneDefinitionsById ?? {}
      ),
      currentSceneChoiceOptions: getCurrentChoiceOptions(
        input.appState.gameState,
        input.sceneDefinitionsById ?? {}
      ),
      ...(cityUnderlay == null ? {} : { cityUnderlay }),
    };
  }

  if (currentView === "battle") {
    return { type: "battle" };
  }

  return { type: "empty" };
}
