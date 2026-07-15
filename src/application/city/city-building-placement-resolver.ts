import type { CharacterDefinition } from "../../domain/character";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { GameState } from "../../domain/game-state";
import type {
  HouseAccessRefusalRule,
  HouseDefinition,
} from "../../domain/house";
import {
  selectCityNpcSummariesForHouse,
  type HouseCityNpcSummary,
} from "../city-npcs/select-city-npcs-for-house";
import {
  selectHouseEntryAccess,
  type HouseEntryAccessResult,
} from "../story/story-stage-access";

export type CityBuildingPlacement = {
  placementId: string;
  cityId: string;
  houseId: string;
  label: string;
  cityEntry: CityEntryDefinition;
  house: HouseDefinition;
};

export type CityBuildingPlacementView = CityBuildingPlacement & {
  access: HouseEntryAccessResult;
  npcs: HouseCityNpcSummary[];
};

export type CityBuildingPlacementLookupInput = {
  cityEntries: readonly CityEntryDefinition[];
  houses: readonly HouseDefinition[];
};

export type CityBuildingPlacementRuntimeInput =
  CityBuildingPlacementLookupInput & {
    state: GameState;
    characterDefinitions: readonly CharacterDefinition[];
    cityNpcPools: readonly CityNpcPoolDefinition[];
    houseAccessRefusalRules: readonly HouseAccessRefusalRule[];
    placementId: string;
  };

export function resolveCityBuildingPlacements(
  input: CityBuildingPlacementLookupInput & { cityId: string }
): CityBuildingPlacement[] {
  const houseById = createHouseById(input.houses);

  return input.cityEntries.flatMap((cityEntry) => {
    if (cityEntry.cityId !== input.cityId) {
      return [];
    }

    const house = houseById[cityEntry.targetHouseId];
    if (house == null) {
      return [];
    }

    return [createPlacement(cityEntry, house)];
  });
}

export function resolveCityBuildingView(
  input: CityBuildingPlacementRuntimeInput
): CityBuildingPlacementView | null {
  const placement = resolvePlacementById(input);
  if (placement == null) {
    return null;
  }

  return {
    ...placement,
    access: selectHouseEntryAccess(
      input.state,
      [...input.characterDefinitions],
      placement.house,
      [...input.houseAccessRefusalRules]
    ),
    npcs: selectCityNpcSummariesForHouse(
      input.state,
      placement.house,
      [...input.cityNpcPools]
    ),
  };
}

export function canEnterCityBuilding(
  input: CityBuildingPlacementRuntimeInput
): HouseEntryAccessResult {
  const placement = resolvePlacementById(input);
  if (placement == null) {
    return { canEnter: false, refusal: null };
  }

  return selectHouseEntryAccess(
    input.state,
    [...input.characterDefinitions],
    placement.house,
    [...input.houseAccessRefusalRules]
  );
}

export function resolveCityBuildingNpcs(
  input: Omit<
    CityBuildingPlacementRuntimeInput,
    "characterDefinitions" | "houseAccessRefusalRules"
  >
): HouseCityNpcSummary[] {
  const placement = resolvePlacementById(input);
  if (placement == null) {
    return [];
  }

  return selectCityNpcSummariesForHouse(
    input.state,
    placement.house,
    [...input.cityNpcPools]
  );
}

function resolvePlacementById(
  input: CityBuildingPlacementLookupInput & { placementId: string }
): CityBuildingPlacement | null {
  const cityEntry =
    input.cityEntries.find((entry) => entry.id === input.placementId) ?? null;
  if (cityEntry == null) {
    return null;
  }

  const house = createHouseById(input.houses)[cityEntry.targetHouseId] ?? null;
  if (house == null) {
    return null;
  }

  return createPlacement(cityEntry, house);
}

function createPlacement(
  cityEntry: CityEntryDefinition,
  house: HouseDefinition
): CityBuildingPlacement {
  return {
    placementId: cityEntry.id,
    cityId: cityEntry.cityId,
    houseId: house.id,
    label: cityEntry.name || house.name,
    cityEntry,
    house,
  };
}

function createHouseById(
  houses: readonly HouseDefinition[]
): Record<string, HouseDefinition> {
  return Object.fromEntries(
    houses.map((houseDefinition) => [houseDefinition.id, houseDefinition])
  );
}
