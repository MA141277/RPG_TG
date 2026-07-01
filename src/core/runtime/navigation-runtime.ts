import { enterCity } from "../../application/navigation/enter-city";
import { enterHouse } from "../../application/navigation/enter-house";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { NavigationTarget } from "../contracts/navigation";
import type { RuntimeRequest } from "../contracts/runtime-request";

type NavigationRuntimeResult = {
  state: GameState;
  navigation: NavigationTarget | null;
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

    return {
      state: enterCity(input.state, cityId),
      navigation: { view: "city", cityId },
    };
  }

  if (
    input.request.eventId === "navigation.enter-house" &&
    input.houseDefinition != null &&
    input.eventDefinitionsById != null
  ) {
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
