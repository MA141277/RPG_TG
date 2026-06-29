import type { AppState } from "../../application/app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityBeggingGameCompletionResult } from "../../domain/city-begging-minigame";
import type { RuntimeRequest } from "../contracts/runtime-request";
import {
  applyLegacyCityBeggingCompletion,
  createLegacyCityBeggingSession,
  dispatchLegacyStoryBattleAction,
  stopLegacyActivityQte,
  tickLegacyActivityQte,
  tickLegacyCityBeggingSession,
  updateLegacyCityBeggingPointer,
} from "../adapters/legacy-interactive-adapter";

type InteractiveRuntimeResult = {
  appState: AppState;
  enterHouseId: string | null;
};

export function createLaunchInteractiveRequest(
  interactiveId: string,
  payload?: Record<string, unknown>
): RuntimeRequest {
  return {
    type: "external",
    eventId: interactiveId,
    ...(payload == null ? {} : { payload }),
  };
}

export function createInteractiveActionRequest(
  actionId: string,
  payload?: Record<string, unknown>
): RuntimeRequest {
  return {
    type: "action",
    actionId,
    ...(payload == null ? {} : { payload }),
  };
}

export function runInteractiveRuntime(input: {
  appState: AppState;
  request: RuntimeRequest;
  playerCharacterId?: string;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string> | undefined;
}): InteractiveRuntimeResult {
  if (
    input.request.type === "external" &&
    input.request.eventId === "interactive.city-begging.launch"
  ) {
    const now = input.request.payload?.now;
    return {
      appState: {
        ...input.appState,
        beggingMiniGameState: createLegacyCityBeggingSession(
          typeof now === "number" ? now : performance.now()
        ),
      },
      enterHouseId: null,
    };
  }

  if (input.request.type !== "action") {
    return {
      appState: input.appState,
      enterHouseId: null,
    };
  }

  if (input.request.actionId === "interactive.city-begging.pointer") {
    const currentState = input.appState.beggingMiniGameState;
    const pointerX = input.request.payload?.pointerX;
    if (currentState == null || typeof pointerX !== "number") {
      return { appState: input.appState, enterHouseId: null };
    }

    return {
      appState: {
        ...input.appState,
        beggingMiniGameState: updateLegacyCityBeggingPointer(
          currentState,
          pointerX
        ),
      },
      enterHouseId: null,
    };
  }

  if (input.request.actionId === "interactive.city-begging.tick") {
    const currentState = input.appState.beggingMiniGameState;
    const now = input.request.payload?.now;
    if (currentState == null || typeof now !== "number") {
      return { appState: input.appState, enterHouseId: null };
    }

    return {
      appState: {
        ...input.appState,
        beggingMiniGameState: tickLegacyCityBeggingSession(currentState, now),
      },
      enterHouseId: null,
    };
  }

  if (input.request.actionId === "interactive.city-begging.complete") {
    const result = input.request.payload?.result;
    if (
      input.playerCharacterId == null ||
      result == null ||
      typeof result !== "object"
    ) {
      return { appState: input.appState, enterHouseId: null };
    }

    const completion = applyLegacyCityBeggingCompletion({
      state: input.appState.gameState,
      characterDefinitions: input.appState.characterDefinitions,
      playerCharacterId: input.playerCharacterId,
      result: result as CityBeggingGameCompletionResult,
    });

    return {
      appState: {
        ...input.appState,
        gameState: completion.state,
        characterDefinitions: completion.characterDefinitions,
      },
      enterHouseId: null,
    };
  }

  if (input.request.actionId === "interactive.activity-qte.tick") {
    return {
      appState: {
        ...input.appState,
        gameState: tickLegacyActivityQte(input.appState.gameState),
      },
      enterHouseId: null,
    };
  }

  if (input.request.actionId === "interactive.activity-qte.stop") {
    const session = input.appState.gameState.runtime.activitySession;
    const activityId =
      session?.type === "qte-bar" ? session.activityId : null;
    const activityDefinition =
      activityId == null
        ? null
        : input.activityDefinitionsById?.[activityId] ?? null;

    if (activityDefinition == null) {
      return {
        appState: {
          ...input.appState,
          gameState: {
            ...input.appState.gameState,
            runtime: {
              ...input.appState.gameState.runtime,
              activitySession: null,
            },
          },
        },
        enterHouseId: null,
      };
    }

    const completion = stopLegacyActivityQte({
      state: input.appState.gameState,
      activityDefinition,
      characterDefinitions: input.appState.characterDefinitions,
    });

    return {
      appState: {
        ...input.appState,
        gameState: completion.state,
        characterDefinitions: completion.characterDefinitions,
      },
      enterHouseId: null,
    };
  }

  if (input.request.actionId === "interactive.story-battle.action") {
    const battleActionId = input.request.payload?.battleActionId;
    if (typeof battleActionId !== "string") {
      return { appState: input.appState, enterHouseId: null };
    }

    const result = dispatchLegacyStoryBattleAction(
      input.appState.gameState,
      battleActionId,
      {
        textEntriesById: input.textEntriesById,
      }
    );

    return {
      appState: {
        ...input.appState,
        gameState: result.state,
      },
      enterHouseId: result.enterHouseId,
    };
  }

  return {
    appState: input.appState,
    enterHouseId: null,
  };
}
