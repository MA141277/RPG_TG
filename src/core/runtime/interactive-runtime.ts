import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
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
  createInteractivePlayableSession,
  resolvePlayableLaunchRequest,
  runPlayableRuntime,
} from "./playable-runtime";
import { readDefaultPlayableDefinitionRegistry } from "./playable-runtime-registries";

export type InteractiveRuntimeOutput = InteractiveRuntimeResult & {
  characterDefinitions?: CharacterDefinition[];
};

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

  if (request == null) {
    return {
      state: input.state,
      effects: [],
      session: getActiveInteractiveSession(input.state, null),
      followUp: { type: "none" },
    };
  }

  if (
    request.kind === "activity-qte" ||
    request.kind === "city-begging" ||
    request.kind === "story-battle"
  ) {
    const playableResult = runPlayableRuntime({
      state: input.state,
      request: input.request,
      characterDefinitions: input.characterDefinitions,
      ...(input.playerCharacterId == null
        ? {}
        : { playerCharacterId: input.playerCharacterId }),
      ...(input.activityDefinitionsById == null
        ? {}
        : { activityDefinitionsById: input.activityDefinitionsById }),
      ...(input.textEntriesById == null
        ? {}
        : { textEntriesById: input.textEntriesById }),
    });

    return {
      state: playableResult.state,
      ...(playableResult.characterDefinitions == null
        ? {}
        : { characterDefinitions: playableResult.characterDefinitions }),
      effects: playableResult.effects,
      session:
        playableResult.session == null
          ? null
          : request.phase === "launch"
            ? createInteractiveSession(request)
            : getActiveInteractiveSession(playableResult.state, request.kind),
      followUp: playableResult.followUp ?? { type: "none" },
    };
  }

  if (request.phase === "exit") {
    return {
      state: exitInteractiveState(input.state, request.kind),
      effects: [],
      session: null,
      followUp: { type: "none" },
    };
  }

  if (request.phase !== "action") {
    return {
      state: input.state,
      effects: [],
      session: getActiveInteractiveSession(input.state, request.kind),
      followUp: { type: "none" },
    };
  }

  return {
    state: input.state,
    effects: [],
    session: getActiveInteractiveSession(input.state, request.kind),
    followUp: { type: "none" },
  };
}

export function toInteractiveRuntimeRequest(
  request: RuntimeRequest
): InteractiveRuntimeRequest | null {
  if (request.type === "external") {
    const launch = resolvePlayableLaunchRequest({ request });
    if (launch == null || !launch.ok) {
      if (launch == null) {
        return null;
      }
      return null;
    }

    const kind = toInteractiveRuntimeKind(launch.definition.id);
    if (kind == null) {
      return null;
    }

    return {
      phase: "launch",
      kind,
      interactiveId: request.eventId,
      source: { type: "external", id: request.eventId },
      playableLaunch: launch.launch,
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

function toInteractiveRuntimeKind(
  playableId: string | undefined
): InteractiveRuntimeKind | null {
  if (playableId === "activity-qte") {
    return "activity-qte";
  }

  if (playableId === "city-begging") {
    return "city-begging";
  }

  if (playableId === "story-battle") {
    return "story-battle";
  }

  return null;
}

function resolveActionKind(actionId: string): InteractiveRuntimeKind | null {
  const definition =
    readDefaultPlayableDefinitionRegistry().matchActionId(actionId);
  return toInteractiveRuntimeKind(definition?.id);
}

function createInteractiveSession(
  request: Extract<InteractiveRuntimeRequest, { phase: "launch" }>
): ActiveInteractiveRuntimeSession {
  return {
    kind: request.kind,
    sessionId: createInteractiveSessionId(request.kind),
    source: request.source,
    playable: {
      sessionId: `playable.${request.playableLaunch.playableId}`,
      playableId: request.playableLaunch.playableId,
      integrationId: request.playableLaunch.integrationId,
      family: request.playableLaunch.family,
      ownerContext: request.playableLaunch.ownerContext,
      status: "active",
    },
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
    const source = {
      type: "external" as const,
      id: "interactive.city-begging.launch",
    };
    return {
      kind,
      sessionId: createInteractiveSessionId(kind),
      source,
      playable: createInteractivePlayableSession({
        playableId: kind,
        source,
      }) ?? {
        sessionId: "playable.city-begging",
        playableId: "city-begging",
        integrationId: "playable.city-begging.external.default",
        family: "minigame",
        ownerContext: {
          ownerKind: "external",
          ownerId: null,
          returnPolicy: "close-only",
        },
        status: "active",
      },
    };
  }

  if (
    kind === "activity-qte" &&
    state.core.runtime.activitySession != null &&
    state.core.runtime.activitySession.type !== "result"
  ) {
    const source = {
      type: "scene" as const,
      sceneId: state.core.scene.activeSceneId ?? "scene.unknown",
    };
    return {
      kind,
      sessionId: createInteractiveSessionId(kind),
      source,
      playable: createInteractivePlayableSession({
        playableId: kind,
        source,
      }) ?? {
        sessionId: "playable.activity-qte",
        playableId: "activity-qte",
        integrationId: "playable.activity-qte.scene.default",
        family: "minigame",
        ownerContext: {
          ownerKind: "scene",
          ownerId: source.sceneId,
          returnPolicy: "resume-owner",
        },
        status: "active",
      },
    };
  }

  if (kind === "story-battle" && state.core.storyBattle != null) {
    const source = {
      type: "scene" as const,
      sceneId: state.core.scene.activeSceneId ?? "scene.unknown",
    };
    return {
      kind,
      sessionId: createInteractiveSessionId(kind),
      source,
      playable: createInteractivePlayableSession({
        playableId: kind,
        source,
      }) ?? {
        sessionId: "playable.story-battle",
        playableId: "story-battle",
        integrationId: "playable.story-battle.scene.default",
        family: "battle",
        ownerContext: {
          ownerKind: "scene",
          ownerId: source.sceneId,
          returnPolicy: "reenter-owner",
        },
        status: "active",
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
