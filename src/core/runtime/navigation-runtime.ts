import { enterCity } from "../../application/navigation/enter-city";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import { enterHouse } from "../../application/navigation/enter-house";
import { evaluateLocationAccess } from "../../application/location-access/location-access-runtime";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  LocationAccessDefinition,
  LocationAccessResult,
} from "../../domain/location-access";
import { matchesCanonicalBuildingOwnerId } from "./building-owner-canonicalization";
import type {
  NavigationRouteTarget,
  NavigationTarget,
} from "../contracts/navigation";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";

type NavigationRuntimeResult = {
  state: GameState;
  navigation: NavigationTarget | null;
  access?: LocationAccessResult;
};

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
  cityDefinitionsById?: Record<string, CityDefinition>;
  buildingArrangements?: readonly BuildingArrangementDefinition[];
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
    };
  }

  if (target.kind === "building" && input.houseDefinition != null) {
    const activeArrangement = selectActiveBuildingArrangement(
      input.buildingArrangements,
      input.state.world.currentCityId,
      input.houseDefinition.id
    );
    if (activeArrangement == null) {
      return {
        state: input.state,
        navigation: null,
        access: createMissingBuildingArrangementAccessResult(
          input.state,
          input.houseDefinition
        ),
      };
    }

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
      state: enterHouse(input.state, input.houseDefinition),
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
    const cityId = input.state.world.currentCityId;
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
      navigation: { view: "city", cityId },
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

export function routeNavigationRuntime(input: {
  state: RuntimeState;
  request: RuntimeRequest;
  houseDefinition?: HouseDefinition | null;
  cityDefinitionsById?: Record<string, CityDefinition>;
  buildingArrangements?: readonly BuildingArrangementDefinition[];
  characterDefinitions?: readonly CharacterDefinition[];
  locationAccessDefinitions?: readonly LocationAccessDefinition[];
}): RuntimeResult {
  const result = runNavigationRuntime({
    state: input.state.core,
    request: input.request,
    ...(input.houseDefinition === undefined
      ? {}
      : { houseDefinition: input.houseDefinition }),
    ...(input.cityDefinitionsById === undefined
      ? {}
      : { cityDefinitionsById: input.cityDefinitionsById }),
    ...(input.buildingArrangements === undefined
      ? {}
      : { buildingArrangements: input.buildingArrangements }),
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
    navigation: result.navigation,
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
  if (typeof value !== "object" || value == null || !("kind" in value)) {
    return false;
  }

  const target = value as Record<string, unknown>;
  if (target.kind === "city") {
    return typeof target.cityId === "string";
  }
  if (target.kind === "building") {
    return typeof target.houseId === "string";
  }
  if (target.kind === "reenterBuilding") {
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

function selectActiveBuildingArrangement(
  buildingArrangements: readonly BuildingArrangementDefinition[] | undefined,
  cityId: string | null | undefined,
  houseId: string
): BuildingArrangementDefinition | null {
  if (cityId == null) {
    return null;
  }

  return (
    buildingArrangements?.find(
      (arrangement) =>
        arrangement.cityId === cityId &&
        matchesCanonicalBuildingOwnerId(arrangement.buildingId, houseId)
    ) ?? null
  );
}

function createMissingBuildingArrangementAccessResult(
  state: GameState,
  houseDefinition: HouseDefinition
): LocationAccessResult {
  return {
    canEnter: false,
    refusal: {
      ruleId: `building-arrangement.required.${houseDefinition.id}`,
      speakerCharacterId:
        state.player.characterId ??
        houseDefinition.defaultCharacterId ??
        "char.player",
      title: houseDefinition.name,
      text: `${houseDefinition.name} 尚未配置建筑编排，暂时无法进入。`,
      confirmLabel: "知道了",
    },
  };
}
