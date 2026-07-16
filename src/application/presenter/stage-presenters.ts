import { selectCityNpcSummariesForHouse } from "../city-npcs/select-city-npcs-for-house";
import {
  getCurrentChoiceOptions,
  getCurrentSceneAction,
} from "../story/story-runtime";
import {
  isCityEntryVisibleForStoryStage,
  isHouseVisibleForStoryStage,
} from "../story/story-stage-access";
import type { AppState } from "../app-shell";
import type { SceneDefinition } from "../../domain/action";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { HouseDefinition } from "../../domain/house";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../house-modules/house-module-registry";
import type { AppPresenterStageOutput } from "./presenter-output";

export type StagePresenterInput = {
  appState: AppState;
  cityDefinition: CityDefinition;
  cityDefinitions?: CityDefinition[];
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityNpcPoolDefinitions: CityNpcPoolDefinition[];
  playerCharacterId: string;
  textEntriesById?: Record<string, string>;
  citySceneMappingsByCityId?: Record<string, CitySceneMapping>;
  sceneDefinitionsById?: Record<string, SceneDefinition>;
  houseModuleRegistry?: HouseModuleRegistry;
};

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

export function createStagePresenterOutput(
  input: StagePresenterInput
): AppPresenterStageOutput {
  const houseModuleRegistry =
    input.houseModuleRegistry ?? builtinHouseModuleRegistry;
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
    return { type: "map", cityDefinitions };
  }

  if (currentView === "city") {
    const activeCityEntries = input.cityEntries.filter(
      (cityEntry) =>
        cityEntry.cityId === activeCityDefinition.id &&
        isCityEntryVisibleForStoryStage(input.appState.gameState, cityEntry)
    );
    const cityEntryHouseIds = new Set(
      activeCityEntries.map((cityEntry) => cityEntry.targetHouseId)
    );
    const activeCityHouseDefinitions = input.houseDefinitions.filter(
      (houseDefinition) => {
        if (!cityEntryHouseIds.has(houseDefinition.id)) {
          return false;
        }

        return isHouseVisibleForStoryStage(
          input.appState.gameState,
          input.appState.characterDefinitions,
          houseDefinition
        );
      }
    );

    return {
      type: "city",
      activeCityDefinition,
      activeCityHouseDefinitions,
      activeCityEntries,
      citySceneMapping,
    };
  }

  if (currentView === "city-3d") {
    return {
      type: "city-3d",
      activeCityDefinition,
      citySceneMapping,
    };
  }

  if (currentView === "house") {
    const activeHouse = selectActiveHouseDefinition(
      input.appState,
      input.houseDefinitions
    );

    if (activeHouse == null) {
      return { type: "empty" };
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
          sessionState: input.appState.gameState.ui.houseSession?.state ?? null,
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

  if (currentView === "scene") {
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
    };
  }

  if (currentView === "battle") {
    return { type: "battle" };
  }

  return { type: "empty" };
}
