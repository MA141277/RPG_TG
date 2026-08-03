import type { ActivityDefinition } from "../../domain/activity";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { EventDefinition, EventRouteCommand } from "../../domain/event";
import type { HouseDefinition } from "../../domain/house";
import type { LocationAccessDefinition } from "../../domain/location-access";
import type { AppState } from "../app-shell";
import {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} from "../../core/runtime/playable-runtime";
import {
  createNavigateRequest,
  routeNavigationRuntime,
} from "../../core/runtime/navigation-runtime";
import { commitRuntimeRequest } from "../../core/runtime/state-sync-runtime";

export type EventRouteCommandDispatchResult = {
  state: AppState;
  handled: boolean;
  unhandledCommands: EventRouteCommand[];
};

export function dispatchEventRouteCommands(input: {
  state: AppState;
  eventDefinition: EventDefinition | null | undefined;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
  cityDefinitionsById?: Record<string, CityDefinition> | undefined;
  houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
  buildingArrangements?: readonly BuildingArrangementDefinition[] | undefined;
  locationAccessDefinitions?: readonly LocationAccessDefinition[] | undefined;
}): EventRouteCommandDispatchResult {
  const eventDefinition = input.eventDefinition;
  if (eventDefinition == null || eventDefinition.actions == null) {
    return {
      state: input.state,
      handled: false,
      unhandledCommands: [],
    };
  }

  let state = input.state;
  let handled = false;
  const unhandledCommands: EventRouteCommand[] = [];

  for (const command of eventDefinition.actions) {
    if (command.type === "navigate") {
      const result = dispatchNavigateCommand({
        state,
        command,
        cityDefinitionsById: input.cityDefinitionsById,
        houseDefinitionsById: input.houseDefinitionsById,
        buildingArrangements: input.buildingArrangements,
        locationAccessDefinitions: input.locationAccessDefinitions,
      });
      state = result.state;
      handled ||= result.handled;
      if (!result.handled) {
        unhandledCommands.push(command);
      }
      continue;
    }

    if (command.type === "launchPlayable") {
      const result = dispatchLaunchPlayableCommand({
        state,
        eventDefinition,
        command,
        activityDefinitionsById: input.activityDefinitionsById,
        textEntriesById: input.textEntriesById,
      });
      state = result.state;
      handled ||= result.handled;
      if (!result.handled) {
        unhandledCommands.push(command);
      }
      continue;
    }

    unhandledCommands.push(command);
  }

  return {
    state,
    handled,
    unhandledCommands,
  };
}

function dispatchNavigateCommand(input: {
  state: AppState;
  command: Extract<EventRouteCommand, { type: "navigate" }>;
  cityDefinitionsById?: Record<string, CityDefinition> | undefined;
  houseDefinitionsById?: Record<string, HouseDefinition> | undefined;
  buildingArrangements?: readonly BuildingArrangementDefinition[] | undefined;
  locationAccessDefinitions?: readonly LocationAccessDefinition[] | undefined;
}): { state: AppState; handled: boolean } {
  const houseDefinition =
    input.command.target.kind === "building"
      ? input.houseDefinitionsById?.[input.command.target.houseId] ?? null
      : null;
  const result = commitRuntimeRequest({
    state: input.state,
    request: createNavigateRequest(input.command.target),
    context: {
      router: {
        route: ({ state, request }) =>
          routeNavigationRuntime({
            state,
            request,
            ...(houseDefinition == null ? {} : { houseDefinition }),
            ...(input.cityDefinitionsById == null
              ? {}
              : { cityDefinitionsById: input.cityDefinitionsById }),
            ...(input.buildingArrangements == null
              ? {}
              : { buildingArrangements: input.buildingArrangements }),
            characterDefinitions: input.state.characterDefinitions,
            ...(input.locationAccessDefinitions == null
              ? {}
              : { locationAccessDefinitions: input.locationAccessDefinitions }),
          }),
      },
    },
  });

  const navigation = result.runtimeResult.navigation;
  return {
    state: result.state,
    handled: navigation != null,
  };
}

function dispatchLaunchPlayableCommand(input: {
  state: AppState;
  eventDefinition: EventDefinition;
  command: Extract<EventRouteCommand, { type: "launchPlayable" }>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
}): { state: AppState; handled: boolean } {
  const command = input.command;
  const ownerContext = {
    ...command.ownerContext,
    sessionToken: input.eventDefinition.id,
  };
  const result = commitRuntimeRequest({
    state: input.state,
    request: createLaunchPlayableRequest(command.playableId, {
      integrationId: command.integrationId,
      ownerContext,
      ...(command.payload == null ? {} : { payload: command.payload }),
    }),
    context: {
      router: {
        route: ({ state, request }) =>
          runPlayableRuntime({
            state,
            request,
            characterDefinitions: input.state.characterDefinitions,
            ...(input.state.gameState.player.characterId == null
              ? {}
              : { playerCharacterId: input.state.gameState.player.characterId }),
            ...(input.activityDefinitionsById == null
              ? {}
              : { activityDefinitionsById: input.activityDefinitionsById }),
            ...(input.textEntriesById == null
              ? {}
              : { textEntriesById: input.textEntriesById }),
          }),
      },
    },
  });
  const session = result.state.gameState.runtime.playableSession;
  if (session == null || session.playableId !== command.playableId) {
    return {
      state: result.state,
      handled: false,
    };
  }

  return {
    state: {
      ...result.state,
      gameState: {
        ...result.state.gameState,
        dialogue: {
          ...result.state.gameState.dialogue,
          activeEventId: null,
          activeDialogueId: null,
          cursor: 0,
          status: "idle",
        },
        ui: {
          ...result.state.gameState.ui,
          currentView: "minigame",
        },
        runtime: {
          ...result.state.gameState.runtime,
          playableSession: {
            ...session,
            integrationId: command.integrationId,
            ownerContext,
          },
        },
      },
    },
    handled: true,
  };
}
