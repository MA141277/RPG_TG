import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityBeggingGameCompletionResult } from "../../domain/city-begging-minigame";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";
import {
  applyLegacyCityBeggingCompletion,
  createLegacyCityBeggingSession,
  dispatchLegacyStoryBattleAction,
  stopLegacyActivityQte,
  tickLegacyActivityQte,
  tickLegacyCityBeggingSession,
  updateLegacyCityBeggingPointer,
} from "../adapters/legacy-interactive-adapter";

export type InteractiveRuntimeOutput = RuntimeResult & {
  characterDefinitions?: CharacterDefinition[];
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
  state: RuntimeState;
  request: RuntimeRequest;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId?: string;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string> | undefined;
}): InteractiveRuntimeOutput {
  if (
    input.request.type === "external" &&
    input.request.eventId === "interactive.city-begging.launch"
  ) {
    const now = input.request.payload?.now;
    return {
      state: {
        ...input.state,
        app: {
          ...input.state.app,
          beggingMiniGameState: createLegacyCityBeggingSession(
            typeof now === "number" ? now : performance.now()
          ),
        },
      },
      effects: [],
      interactive: { type: "none" },
    };
  }

  if (input.request.type !== "action") {
    return {
      state: input.state,
      effects: [],
      interactive: { type: "none" },
    };
  }

  if (input.request.actionId === "interactive.city-begging.pointer") {
    const currentState = input.state.app.beggingMiniGameState;
    const pointerX = input.request.payload?.pointerX;
    if (currentState == null || typeof pointerX !== "number") {
      return {
        state: input.state,
        effects: [],
        interactive: { type: "none" },
      };
    }

    return {
      state: {
        ...input.state,
        app: {
          ...input.state.app,
          beggingMiniGameState: updateLegacyCityBeggingPointer(
            currentState,
            pointerX
          ),
        },
      },
      effects: [],
      interactive: { type: "none" },
    };
  }

  if (input.request.actionId === "interactive.city-begging.tick") {
    const currentState = input.state.app.beggingMiniGameState;
    const now = input.request.payload?.now;
    if (currentState == null || typeof now !== "number") {
      return {
        state: input.state,
        effects: [],
        interactive: { type: "none" },
      };
    }

    return {
      state: {
        ...input.state,
        app: {
          ...input.state.app,
          beggingMiniGameState: tickLegacyCityBeggingSession(currentState, now),
        },
      },
      effects: [],
      interactive: { type: "none" },
    };
  }

  if (input.request.actionId === "interactive.city-begging.complete") {
    const result = input.request.payload?.result;
    if (
      input.playerCharacterId == null ||
      result == null ||
      typeof result !== "object"
    ) {
      return {
        state: input.state,
        effects: [],
        interactive: { type: "none" },
      };
    }

    const completion = applyLegacyCityBeggingCompletion({
      state: input.state.core,
      characterDefinitions: input.characterDefinitions,
      playerCharacterId: input.playerCharacterId,
      result: result as CityBeggingGameCompletionResult,
    });

    return {
      state: {
        ...input.state,
        core: completion.state,
      },
      characterDefinitions: completion.characterDefinitions,
      effects: [],
      interactive: { type: "none" },
    };
  }

  if (input.request.actionId === "interactive.activity-qte.tick") {
    return {
      state: {
        ...input.state,
        core: tickLegacyActivityQte(input.state.core),
      },
      effects: [],
      interactive: { type: "none" },
    };
  }

  if (input.request.actionId === "interactive.activity-qte.stop") {
    const session = input.state.core.runtime.activitySession;
    const activityId =
      session?.type === "qte-bar" ? session.activityId : null;
    const activityDefinition =
      activityId == null
        ? null
        : input.activityDefinitionsById?.[activityId] ?? null;

    if (activityDefinition == null) {
      return {
        state: {
          ...input.state,
          core: {
            ...input.state.core,
            runtime: {
              ...input.state.core.runtime,
              activitySession: null,
            },
          },
        },
        effects: [],
        interactive: { type: "none" },
      };
    }

    const completion = stopLegacyActivityQte({
      state: input.state.core,
      activityDefinition,
      characterDefinitions: input.characterDefinitions,
    });

    return {
      state: {
        ...input.state,
        core: completion.state,
      },
      characterDefinitions: completion.characterDefinitions,
      effects: [],
      interactive: { type: "none" },
    };
  }

  if (input.request.actionId === "interactive.story-battle.action") {
    const battleActionId = input.request.payload?.battleActionId;
    if (typeof battleActionId !== "string") {
      return {
        state: input.state,
        effects: [],
        interactive: { type: "none" },
      };
    }

    const result = dispatchLegacyStoryBattleAction(
      input.state.core,
      battleActionId,
      {
        textEntriesById: input.textEntriesById,
      }
    );

    return {
      state: {
        ...input.state,
        core: result.state,
      },
      effects: [],
      interactive:
        result.enterHouseId == null
          ? { type: "none" }
          : { type: "reenter-house", houseId: result.enterHouseId },
    };
  }

  return {
    state: input.state,
    effects: [],
    interactive: { type: "none" },
  };
}
