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
import type { RuntimeEventEntity } from "../contracts/event-router";
import type {
  NavigationRouteTarget,
  NavigationTarget,
} from "../contracts/navigation";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type {
  RuntimeFollowUpOutcome,
  RuntimeResult,
} from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import { createRuntimeEventEntity } from "./event-entity-projection";
import { dispatchEventRoute } from "./event-router";
import { createEventRouteActivationHandlers } from "./event-route-activation";
import { dispatchRuntimeRequest } from "./runtime-dispatch";

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

export function createNavigateRequest(
  target: NavigationRouteTarget
): RuntimeRequest {
  return {
    family: "external",
    type: "external",
    eventId: "navigation.navigate",
    payload: { target },
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
  const target = resolveNavigationRouteTarget(input.request);
  if (target == null) {
    return {
      state: input.state,
      navigation: null,
    };
  }

  if (target.kind === "city") {
    const access = evaluateLocationAccess({
      state: input.state,
      targetFamily: "city",
      targetId: target.cityId,
      targetCity: input.cityDefinitionsById?.[target.cityId] ?? null,
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
      state: enterCity(input.state, target.cityId),
      navigation: { view: "city", cityId: target.cityId },
      outcome: {
        type: "navigation.entered-city",
        cityId: target.cityId,
      },
    };
  }

  if (
    target.kind === "building" &&
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
      state: routeHouseEnterEvent(
        enterHouse(input.state, input.houseDefinition),
        input.houseDefinition,
        input.eventDefinitionsById
      ),
      navigation: {
        view: "house",
        houseId: input.houseDefinition.id,
      },
    };
  }

  if (target.kind === "reenterBuilding") {
    return {
      state: {
        ...input.state,
        world: {
          ...input.state.world,
          currentHouseId: target.houseId,
        },
        ui: {
          ...input.state.ui,
          currentView: "house",
          overlayView: null,
          houseSession: null,
        },
      },
      navigation: {
        view: "house",
        houseId: target.houseId,
      },
    };
  }

  if (target.kind === "leaveBuilding") {
    return {
      state: {
        ...input.state,
        world: {
          ...input.state.world,
          currentHouseId: null,
        },
        ui: {
          ...input.state.ui,
          currentView: "city",
          overlayView: null,
          houseSession: null,
        },
      },
      navigation: {
        view: "city",
        cityId: input.state.world.currentCityId,
      },
    };
  }

  if (target.kind === "map") {
    return {
      state: {
        ...input.state,
        world: {
          ...input.state.world,
          ...(target.mapId == null ? {} : { currentMapId: target.mapId }),
          currentHouseId: null,
        },
        ui: {
          ...input.state.ui,
          currentView: "map",
          overlayView: null,
          houseSession: null,
        },
      },
      navigation: {
        view: "map",
        ...(target.mapId == null ? {} : { mapId: target.mapId }),
      },
    };
  }

  return {
    state: input.state,
    navigation: null,
  };
}

function resolveNavigationRouteTarget(
  request: RuntimeRequest
): NavigationRouteTarget | null {
  if (request.type !== "external") {
    return null;
  }

  if (request.eventId === "navigation.enter-city") {
    const cityId = request.payload?.cityId;
    return typeof cityId === "string" ? { kind: "city", cityId } : null;
  }

  if (request.eventId === "navigation.enter-house") {
    const houseId = request.payload?.houseId;
    return typeof houseId === "string" ? { kind: "building", houseId } : null;
  }

  if (request.eventId !== "navigation.navigate") {
    return null;
  }

  const target = request.payload?.target;
  return isNavigationRouteTarget(target) ? target : null;
}

function isNavigationRouteTarget(value: unknown): value is NavigationRouteTarget {
  if (value == null || typeof value !== "object" || !("kind" in value)) {
    return false;
  }

  const target = value as Record<string, unknown>;
  if (target.kind === "city") {
    return typeof target.cityId === "string";
  }
  if (target.kind === "building" || target.kind === "reenterBuilding") {
    return typeof target.houseId === "string";
  }
  if (target.kind === "leaveBuilding") {
    return true;
  }
  if (target.kind === "map") {
    return target.mapId == null || typeof target.mapId === "string";
  }

  return false;
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

function routeHouseEnterEvent(
  state: GameState,
  houseDefinition: HouseDefinition,
  eventDefinitionsById: Record<string, EventDefinition>
): GameState {
  const eventId = houseDefinition.onEnterEventId;
  if (eventId == null) {
    return state;
  }

  const eventDefinition = eventDefinitionsById[eventId];
  if (eventDefinition == null) {
    return state;
  }

  return dispatchRuntimeRequest({
    state: toNavigationRuntimeState(state),
    request: {
      family: "external",
      type: "external",
      eventId,
    },
    context: {
      router: {
        route: ({ state }) =>
          dispatchEventRoute({
            state,
            eventId,
            context: {
              repository: {
                resolveById: (resolvedEventId) => {
                  const resolved = eventDefinitionsById[resolvedEventId];
                  return resolved == null
                    ? null
                    : toNavigationRuntimeEventEntity(resolved);
                },
              },
              handlers: createEventRouteActivationHandlers({
                eventDefinitionsById,
                fallbackEventDefinition: eventDefinition,
              }),
            },
          }),
      },
    },
  }).state.core;
}

function toNavigationRuntimeState(state: GameState): RuntimeState {
  return {
    core: state,
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function toNavigationRuntimeEventEntity(
  eventDefinition: EventDefinition
): RuntimeEventEntity {
  const { emitEventIds } = eventDefinition;
  return createRuntimeEventEntity({
    ...eventDefinition,
    ...(emitEventIds == null ? {} : { emitEventIds }),
  });
}
