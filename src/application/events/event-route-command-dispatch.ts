import type { ActivityDefinition } from "../../domain/activity";
import type { EventDefinition, EventRouteCommand } from "../../domain/event";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import type { AppState } from "../app-shell";
import {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} from "../../core/runtime/playable-runtime";
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
  flowPlayablesById?: Record<string, FlowPlayableDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
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
    if (command.type === "launchPlayable") {
      const result = dispatchLaunchPlayableCommand({
        state,
        eventDefinition,
        command,
        activityDefinitionsById: input.activityDefinitionsById,
        flowPlayablesById: input.flowPlayablesById,
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

function dispatchLaunchPlayableCommand(input: {
  state: AppState;
  eventDefinition: EventDefinition;
  command: Extract<EventRouteCommand, { type: "launchPlayable" }>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  flowPlayablesById?: Record<string, FlowPlayableDefinition> | undefined;
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
            ...(input.flowPlayablesById == null
              ? {}
              : { flowPlayablesById: input.flowPlayablesById }),
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
