import { enterCity } from "../../application/navigation/enter-city";
import { enterHouse } from "../../application/navigation/enter-house";
import { evaluateLocationAccess } from "../../application/location-access/location-access-runtime";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  LocationAccessDefinition,
  LocationAccessResult,
} from "../../domain/location-access";
import type { NavigationTarget } from "../contracts/navigation";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type {
  RuntimeFollowUpOutcome,
  RuntimeResult,
} from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";

type NavigationRuntimeResult = {
  state: GameState;
  navigation: NavigationTarget | null;
  access?: LocationAccessResult;
  outcome?: RuntimeFollowUpOutcome | null;
};

export function createEnterCityRequest(cityId: string): RuntimeRequest {
  return {
    family: "external",
    type: "external",
    eventId: "navigation.enter-city",
    payload: { cityId },
  };
}

export function createEnterHouseRequest(houseId: string): RuntimeRequest {
  return {
    family: "external",
    type: "external",
    eventId: "navigation.enter-house",
    payload: { houseId },
  };
}

export function runNavigationRuntime(input: {
  state: GameState;
  request: RuntimeRequest;
  houseDefinition?: HouseDefinition | null;
  eventDefinitionsById?: Record<string, EventDefinition>;
  cityDefinitionsById?: Record<string, CityDefinition>;
  characterDefinitions?: readonly CharacterDefinition[];
  locationAccessDefinitions?: readonly LocationAccessDefinition[];
}): NavigationRuntimeResult {
  if (input.request.type !== "external") {
    return {
      state: input.state,
      navigation: null,
    };
  }

  if (input.request.eventId === "navigation.enter-city") {
    const cityId = input.request.payload?.cityId;
    if (typeof cityId !== "string") {
      return {
        state: input.state,
        navigation: null,
      };
    }

    const access = evaluateLocationAccess({
      state: input.state,
      targetFamily: "city",
      targetId: cityId,
      targetCity: input.cityDefinitionsById?.[cityId] ?? null,
      characterDefinitions: input.characterDefinitions ?? [],
      locationAccessDefinitions: input.locationAccessDefinitions ?? [],
    });
    if (!access.canEnter) {
      return {
        state: input.state,
        navigation: null,
        access,
      };
    }

    return {
      state: enterCity(input.state, cityId),
      navigation: { view: "city", cityId },
      outcome: {
        type: "navigation.entered-city",
        cityId,
      },
    };
  }

  if (
    input.request.eventId === "navigation.enter-house" &&
    input.houseDefinition != null &&
    input.eventDefinitionsById != null
  ) {
    const access = evaluateLocationAccess({
      state: input.state,
      targetFamily: "building",
      targetId: input.houseDefinition.id,
      targetBuilding: input.houseDefinition,
      characterDefinitions: input.characterDefinitions ?? [],
      locationAccessDefinitions: input.locationAccessDefinitions ?? [],
    });
    if (!access.canEnter) {
      return {
        state: input.state,
        navigation: null,
        access,
      };
    }

    return {
      state: enterHouse(
        input.state,
        input.houseDefinition,
        input.eventDefinitionsById
      ),
      navigation: {
        view: "house",
        houseId: input.houseDefinition.id,
      },
    };
  }

  return {
    state: input.state,
    navigation: null,
  };
}

export function routeNavigationRuntime(input: {
  state: RuntimeState;
  request: RuntimeRequest;
  houseDefinition?: HouseDefinition | null;
  eventDefinitionsById?: Record<string, EventDefinition>;
  cityDefinitionsById?: Record<string, CityDefinition>;
  characterDefinitions?: readonly CharacterDefinition[];
  locationAccessDefinitions?: readonly LocationAccessDefinition[];
}): RuntimeResult {
  const result = runNavigationRuntime({
    state: input.state.core,
    request: input.request,
    ...(input.houseDefinition === undefined
      ? {}
      : { houseDefinition: input.houseDefinition }),
    ...(input.eventDefinitionsById === undefined
      ? {}
      : { eventDefinitionsById: input.eventDefinitionsById }),
    ...(input.cityDefinitionsById === undefined
      ? {}
      : { cityDefinitionsById: input.cityDefinitionsById }),
    ...(input.characterDefinitions === undefined
      ? {}
      : { characterDefinitions: input.characterDefinitions }),
    ...(input.locationAccessDefinitions === undefined
      ? {}
      : { locationAccessDefinitions: input.locationAccessDefinitions }),
  });

  return {
    state: {
      ...input.state,
      core: result.state,
    },
    effects: [],
    ...(result.access == null ? {} : { access: result.access }),
    ...(result.outcome == null ? {} : { outcome: result.outcome }),
    navigation: result.navigation,
  };
}
