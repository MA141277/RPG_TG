import type { AppState } from "../app-shell";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import {
  deriveCityStatusById,
  materializeCityDefinitions,
  type CityStatusById,
} from "../../domain/city-status";
import {
  deriveBuildingStatusById,
  materializeBuildingDefinitions,
  type BuildingStatusById,
} from "../../domain/building-status";
import type { HouseDefinition } from "../../domain/house";

type StoryRuntimeBridgeContent = {
  cityDefinitionsById?: Record<string, CityDefinition>;
  houseDefinitionsById?: Record<string, HouseDefinition>;
};

type StoryRuntimeBridgeResult = {
  state: AppState["gameState"];
  characterDefinitions: CharacterDefinition[];
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions?: HouseDefinition[] | undefined;
};

export function createStoryRuntimeDefinitionContext(
  appState: AppState,
  content: StoryRuntimeBridgeContent
): {
  cityDefinitions?: CityDefinition[];
  houseDefinitions?: HouseDefinition[];
} {
  const authoredCities = Object.values(content.cityDefinitionsById ?? {});
  const authoredHouses = Object.values(content.houseDefinitionsById ?? {});

  return {
    ...(authoredCities.length === 0
      ? {}
      : {
          cityDefinitions: materializeCityDefinitions(
            authoredCities,
            appState.cityStatusById ?? {}
          ),
        }),
    ...(authoredHouses.length === 0
      ? {}
      : {
          houseDefinitions: materializeBuildingDefinitions(
            authoredHouses,
            appState.buildingStatusById ?? {}
          ),
        }),
  };
}

export function applyStoryRuntimeResultToAppState(
  appState: AppState,
  content: StoryRuntimeBridgeContent,
  result: StoryRuntimeBridgeResult
): AppState {
  const nextCityStatusById = deriveStoryRuntimeCityStatus(content, result);
  const nextBuildingStatusById = deriveStoryRuntimeBuildingStatus(content, result);

  return {
    ...appState,
    gameState: result.state,
    characterDefinitions: result.characterDefinitions,
    ...(nextCityStatusById === undefined
      ? {}
      : { cityStatusById: nextCityStatusById }),
    ...(nextBuildingStatusById === undefined
      ? {}
      : { buildingStatusById: nextBuildingStatusById }),
  };
}

function deriveStoryRuntimeCityStatus(
  content: StoryRuntimeBridgeContent,
  result: StoryRuntimeBridgeResult
): CityStatusById | undefined {
  if (result.cityDefinitions == null || content.cityDefinitionsById == null) {
    return undefined;
  }
  return deriveCityStatusById(content.cityDefinitionsById, result.cityDefinitions);
}

function deriveStoryRuntimeBuildingStatus(
  content: StoryRuntimeBridgeContent,
  result: StoryRuntimeBridgeResult
): BuildingStatusById | undefined {
  if (result.houseDefinitions == null || content.houseDefinitionsById == null) {
    return undefined;
  }
  return deriveBuildingStatusById(
    content.houseDefinitionsById,
    result.houseDefinitions
  );
}
