import type { AppState } from "../app-shell";
import type { BuildingStatusById } from "../../domain/building-status";
import { materializeBuildingDefinitions } from "../../domain/building-status";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityStatusById } from "../../domain/city-status";
import { materializeCityDefinitions } from "../../domain/city-status";
import type { HouseDefinition } from "../../domain/house";

type StoryRuntimeBridgeAppState = AppState & {
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
};

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
  appState: StoryRuntimeBridgeAppState,
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
  appState: StoryRuntimeBridgeAppState,
  content: StoryRuntimeBridgeContent,
  result: StoryRuntimeBridgeResult
): StoryRuntimeBridgeAppState {
  const nextCityStatusById = deriveStoryRuntimeCityStatus(content, result);
  const nextBuildingStatusById = deriveStoryRuntimeBuildingStatus(
    content,
    result
  );

  return {
    ...appState,
    gameState: result.state,
    characterDefinitions: result.characterDefinitions,
    ...(nextCityStatusById == null ? {} : { cityStatusById: nextCityStatusById }),
    ...(nextBuildingStatusById == null
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

  const derivedEntries = result.cityDefinitions.flatMap((cityDefinition) => {
    const authoredDefinition = content.cityDefinitionsById?.[cityDefinition.id];
    if (authoredDefinition == null) {
      return [];
    }

    const valuePatch: NonNullable<CityStatusById[string]["valuePatch"]> = {};
    if (cityDefinition.travelCost !== authoredDefinition.travelCost) {
      valuePatch.travelCost = cityDefinition.travelCost;
    }
    if (cityDefinition.prosperity !== authoredDefinition.prosperity) {
      valuePatch.prosperity = cityDefinition.prosperity;
    }
    if (cityDefinition.danger !== authoredDefinition.danger) {
      valuePatch.danger = cityDefinition.danger;
    }
    if (
      !areStringArraysEqual(
        cityDefinition.specialDemand,
        authoredDefinition.specialDemand
      )
    ) {
      valuePatch.specialDemand = [...cityDefinition.specialDemand];
    }

    return Object.keys(valuePatch).length === 0
      ? []
      : [[cityDefinition.id, { valuePatch }] as const];
  });

  return derivedEntries.length === 0 ? undefined : Object.fromEntries(derivedEntries);
}

function deriveStoryRuntimeBuildingStatus(
  content: StoryRuntimeBridgeContent,
  result: StoryRuntimeBridgeResult
): BuildingStatusById | undefined {
  if (result.houseDefinitions == null || content.houseDefinitionsById == null) {
    return undefined;
  }

  const derivedEntries = result.houseDefinitions.flatMap((houseDefinition) => {
    const authoredDefinition = content.houseDefinitionsById?.[houseDefinition.id];
    if (authoredDefinition == null) {
      return [];
    }

    const profilePatch: NonNullable<BuildingStatusById[string]["profilePatch"]> =
      {};
    const runtimePatch: NonNullable<BuildingStatusById[string]["runtimePatch"]> =
      {};

    if (houseDefinition.name !== authoredDefinition.name) {
      profilePatch.name = houseDefinition.name;
    }
    if (
      houseDefinition.defaultCharacterId !== authoredDefinition.defaultCharacterId
    ) {
      profilePatch.defaultCharacterId = houseDefinition.defaultCharacterId;
    }
    if (
      houseDefinition.level !== authoredDefinition.level &&
      houseDefinition.level !== undefined
    ) {
      runtimePatch.level = houseDefinition.level;
    }
    if (
      houseDefinition.damaged !== authoredDefinition.damaged &&
      houseDefinition.damaged !== undefined
    ) {
      runtimePatch.damaged = houseDefinition.damaged;
    }
    if (
      houseDefinition.outputMultiplier !== authoredDefinition.outputMultiplier &&
      houseDefinition.outputMultiplier !== undefined
    ) {
      runtimePatch.outputMultiplier = houseDefinition.outputMultiplier;
    }

    const patch = {
      ...(Object.keys(profilePatch).length === 0 ? {} : { profilePatch }),
      ...(Object.keys(runtimePatch).length === 0 ? {} : { runtimePatch }),
    };

    return Object.keys(patch).length === 0
      ? []
      : [[houseDefinition.id, patch] as const];
  });

  return derivedEntries.length === 0 ? undefined : Object.fromEntries(derivedEntries);
}

function areStringArraysEqual(
  left: readonly string[],
  right: readonly string[]
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}
