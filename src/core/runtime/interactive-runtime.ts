import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityBeggingGameCompletionResult } from "../../domain/city-begging-minigame";
import {
  convertHouseActivityDaysToSegments,
} from "../../application/house/house-activity-costs";
import {
  applyCityBeggingMiniGameCompletion,
  createCityBeggingMiniGameState,
  CITY_BEGGING_DURATION_DAYS,
  setCityBeggingMiniGamePointer,
  updateCityBeggingMiniGameState,
} from "../../application/minigames/city-begging-minigame";
import type {
  ActiveInteractiveRuntimeSession,
  InteractiveActionRequest,
  InteractiveRuntimeKind,
  InteractiveRuntimeRequest,
  InteractiveRuntimeResult,
} from "../contracts/interactive-runtime";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeState } from "../contracts/runtime-state";
import {
  dispatchLegacyStoryBattleAction,
  stopLegacyActivityQte,
  tickLegacyActivityQte,
} from "../adapters/legacy-interactive-adapter";
import { settleRuntimeEffects } from "./runtime-settlement";

export type InteractiveRuntimeOutput = InteractiveRuntimeResult & {
  characterDefinitions?: CharacterDefinition[];
};

export function createLaunchInteractiveRequest(
  interactiveId: string,
  payload?: Record<string, unknown>
): RuntimeRequest {
  return {
    family: "external",
    type: "external",
    eventId: interactiveId,
    ...(payload == null ? {} : { payload }),
  };
}

export function createExitInteractiveRequest(
  kind: InteractiveRuntimeKind,
  payload?: Record<string, unknown>
): RuntimeRequest {
  return {
    family: "action",
    type: "action",
    actionId: `interactive.${kind}.exit`,
    ...(payload == null ? {} : { payload }),
  };
}

export function createInteractiveActionRequest(
  actionId: string,
  payload?: Record<string, unknown>
): RuntimeRequest {
  return {
    family: "action",
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
  const request = toInteractiveRuntimeRequest(input.request);

  if (request?.phase === "launch" && request.kind === "city-begging") {
    const now = request.payload?.now;
    return {
      state: {
        ...input.state,
        app: {
          ...input.state.app,
          beggingMiniGameState: createCityBeggingMiniGameState(
            typeof now === "number" ? now : performance.now()
          ),
        },
      },
      effects: [],
      session: createInteractiveSession(request),
      interactive: { type: "none" },
    };
  }

  if (request == null) {
    return {
      state: input.state,
      effects: [],
      session: getActiveInteractiveSession(input.state, null),
      interactive: { type: "none" },
    };
  }

  if (request.phase === "exit") {
    return {
      state: exitInteractiveState(input.state, request.kind),
      effects: [],
      session: null,
      interactive: { type: "none" },
    };
  }

  if (request.phase !== "action") {
    return {
      state: input.state,
      effects: [],
      session: getActiveInteractiveSession(input.state, request.kind),
      interactive: { type: "none" },
    };
  }

  if (request.kind === "city-begging" && request.actionId === "interactive.city-begging.pointer") {
    const currentState = input.state.app.beggingMiniGameState;
    const pointerX = request.payload?.pointerX;
    if (currentState == null || typeof pointerX !== "number") {
      return {
        state: input.state,
        effects: [],
        session: getActiveInteractiveSession(input.state, request.kind),
        interactive: { type: "none" },
      };
    }

    return {
      state: {
        ...input.state,
        app: {
          ...input.state.app,
          beggingMiniGameState: setCityBeggingMiniGamePointer(
            currentState,
            pointerX
          ),
        },
      },
      effects: [],
      session: getActiveInteractiveSession(input.state, request.kind),
      interactive: { type: "none" },
    };
  }

  if (request.kind === "city-begging" && request.actionId === "interactive.city-begging.tick") {
    const currentState = input.state.app.beggingMiniGameState;
    const now = request.payload?.now;
    if (currentState == null || typeof now !== "number") {
      return {
        state: input.state,
        effects: [],
        session: getActiveInteractiveSession(input.state, request.kind),
        interactive: { type: "none" },
      };
    }

    return {
      state: {
        ...input.state,
        app: {
          ...input.state.app,
          beggingMiniGameState: updateCityBeggingMiniGameState(currentState, now),
        },
      },
      effects: [],
      session: getActiveInteractiveSession(input.state, request.kind),
      interactive: { type: "none" },
    };
  }

  if (
    request.kind === "city-begging" &&
    request.actionId === "interactive.city-begging.complete"
  ) {
    const result = request.payload?.result;
    if (
      input.playerCharacterId == null ||
      result == null ||
      typeof result !== "object"
    ) {
      return {
        state: input.state,
        effects: [],
        session: getActiveInteractiveSession(input.state, request.kind),
        interactive: { type: "none" },
      };
    }

    const completion = applyCityBeggingMiniGameCompletion(
      input.state.core,
      input.characterDefinitions,
      input.playerCharacterId,
      result as CityBeggingGameCompletionResult
    );
    const settledState = settleRuntimeEffects({
      state: {
        ...input.state,
        core: completion.state,
        app: {
          ...input.state.app,
          beggingMiniGameState: null,
        },
      },
      effects: [
        {
          type: "advanceTime",
          days:
            convertHouseActivityDaysToSegments(CITY_BEGGING_DURATION_DAYS) === 0
              ? 0
              : CITY_BEGGING_DURATION_DAYS,
        },
      ],
      emittedBy: "interactive-runtime",
      appliedBy: "runtime-settlement",
    }).state;

    return {
      state: settledState,
      characterDefinitions: completion.characterDefinitions,
      effects: [],
      session: null,
      interactive: { type: "none" },
    };
  }

  if (request.kind === "activity-qte" && request.actionId === "interactive.activity-qte.tick") {
    return {
      state: {
        ...input.state,
        core: tickLegacyActivityQte(input.state.core),
      },
      effects: [],
      session: getActiveInteractiveSession(input.state, request.kind),
      interactive: { type: "none" },
    };
  }

  if (request.kind === "activity-qte" && request.actionId === "interactive.activity-qte.stop") {
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
        session: null,
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
      session: null,
      interactive: { type: "none" },
    };
  }

  if (
    request.kind === "story-battle" &&
    request.actionId === "interactive.story-battle.action"
  ) {
    const battleActionId = request.payload?.battleActionId;
    if (typeof battleActionId !== "string") {
      return {
        state: input.state,
        effects: [],
        session: getActiveInteractiveSession(input.state, request.kind),
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
      session: getActiveInteractiveSession(
        {
          ...input.state,
          core: result.state,
        },
        request.kind
      ),
      interactive:
        result.enterHouseId == null
          ? { type: "none" }
          : { type: "reenter-house", houseId: result.enterHouseId },
    };
  }

  return {
    state: input.state,
    effects: [],
    session: getActiveInteractiveSession(input.state, request.kind),
    interactive: { type: "none" },
  };
}

export function toInteractiveRuntimeRequest(
  request: RuntimeRequest
): InteractiveRuntimeRequest | null {
  if (request.type === "external") {
    const launchKind = resolveLaunchKind(request.eventId);
    if (launchKind == null) {
      return null;
    }

    return {
      phase: "launch",
      kind: launchKind,
      interactiveId: request.eventId,
      source: { type: "external", id: request.eventId },
      ...(request.payload == null ? {} : { payload: request.payload }),
    };
  }

  if (request.type !== "action") {
    return null;
  }

  const kind = resolveActionKind(request.actionId);
  if (kind == null) {
    return null;
  }

  if (request.actionId === `interactive.${kind}.exit`) {
    return {
      phase: "exit",
      kind,
      sessionId: createInteractiveSessionId(kind),
      ...(request.payload == null ? {} : { payload: request.payload }),
    };
  }

  const actionRequest: InteractiveActionRequest = {
    phase: "action",
    kind,
    sessionId: createInteractiveSessionId(kind),
    actionId: request.actionId,
    ...(request.payload == null ? {} : { payload: request.payload }),
  };
  return actionRequest;
}

function resolveLaunchKind(
  interactiveId: string
): InteractiveRuntimeKind | null {
  if (interactiveId === "interactive.city-begging.launch") {
    return "city-begging";
  }

  return null;
}

function resolveActionKind(actionId: string): InteractiveRuntimeKind | null {
  if (actionId.startsWith("interactive.activity-qte.")) {
    return "activity-qte";
  }

  if (actionId.startsWith("interactive.city-begging.")) {
    return "city-begging";
  }

  if (actionId.startsWith("interactive.story-battle.")) {
    return "story-battle";
  }

  return null;
}

function createInteractiveSession(
  request: Extract<InteractiveRuntimeRequest, { phase: "launch" }>
): ActiveInteractiveRuntimeSession {
  return {
    kind: request.kind,
    sessionId: createInteractiveSessionId(request.kind),
    source: request.source,
  };
}

function createInteractiveSessionId(kind: InteractiveRuntimeKind): string {
  return `interactive.${kind}`;
}

function getActiveInteractiveSession(
  state: RuntimeState,
  kind: InteractiveRuntimeKind | null
): ActiveInteractiveRuntimeSession | null {
  if (kind === "city-begging" && state.app.beggingMiniGameState != null) {
    return {
      kind,
      sessionId: createInteractiveSessionId(kind),
      source: { type: "external", id: "interactive.city-begging.launch" },
    };
  }

  if (kind === "activity-qte" && state.core.runtime.activitySession?.type === "qte-bar") {
    return {
      kind,
      sessionId: createInteractiveSessionId(kind),
      source: {
        type: "scene",
        sceneId: state.core.scene.activeSceneId ?? "scene.unknown",
      },
    };
  }

  if (kind === "story-battle" && state.core.storyBattle != null) {
    return {
      kind,
      sessionId: createInteractiveSessionId(kind),
      source: {
        type: "scene",
        sceneId: state.core.scene.activeSceneId ?? "scene.unknown",
      },
    };
  }

  return null;
}

function exitInteractiveState(
  state: RuntimeState,
  kind: InteractiveRuntimeKind
): RuntimeState {
  if (kind === "city-begging") {
    return {
      ...state,
      app: {
        ...state.app,
        beggingMiniGameState: null,
      },
    };
  }

  if (kind === "activity-qte") {
    return {
      ...state,
      core: {
        ...state.core,
        runtime: {
          ...state.core.runtime,
          activitySession: null,
        },
      },
    };
  }

  return {
    ...state,
    core: {
      ...state.core,
      storyBattle: null,
    },
  };
}
