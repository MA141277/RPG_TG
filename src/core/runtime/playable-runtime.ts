import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type {
  RuntimeInteractiveSignal,
  RuntimeResult,
} from "../contracts/runtime-result";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type {
  ActivePlayableSession,
  PlayableCommand,
  PlayableFactResult,
  PlayableId,
  PlayableIntegrationDefinition,
  PlayableIntegrationId,
  PlayableLaunchInput,
  PlayableLaunchResolution,
  PlayableOwnerContext,
  PlayablePresenterModel,
  PlayableResult,
} from "../contracts/playable-runtime";
import type { RuntimeState } from "../contracts/runtime-state";
import {
  dispatchStoryBattlePlayableAction,
  exitStoryBattlePlayable,
  launchStoryBattlePlayable,
} from "../../application/playables/story-battle/story-battle-definition";
import { readNumericPersonAttributeBySemanticKey } from "../../application/character/person-attribute-runtime";
import type { CharacterStatusById } from "../../domain/character-status";
import { type PlayableDefinitionRegistry } from "../registry/playable-definition-registry";
import { type PlayableIntegrationRegistry } from "../registry/playable-integration-registry";
import {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  readDefaultPlayableDefinitionRegistry,
  readDefaultPlayableIntegrationRegistry,
  readDefaultPlayableShellRegistry,
  resetDefaultPlayableRuntimeRegistries,
} from "./playable-runtime-registries";
import {
  createPlayableResultShell,
  resolvePlayableResultRouting,
} from "./playable-result-routing";

export const PLAYABLE_LAUNCH_EVENT_ID = "playable.launch";

export type PlayableRuntimeOutput = RuntimeResult & {
  handled: boolean;
  session: ActivePlayableSession | null;
  characterDefinitions?: CharacterDefinition[];
  followUp?: RuntimeInteractiveSignal | null;
  settlement?: PlayableResult | null;
};

type InteractivePlayableId =
  | "story-battle";

type InteractivePlayableSource =
  | { type: "house"; houseId: string }
  | { type: "dialogue"; dialogueId: string }
  | { type: "external"; id: string };

type ResolvedPlayableRuntimeRequest =
  | {
      phase: "launch";
      launch: PlayableLaunchResolution & { ok: true };
    }
  | {
      phase: "action";
      playableId: PlayableId;
      action: string;
      payload?: Record<string, unknown>;
    }
  | {
      phase: "exit";
      playableId: PlayableId;
      payload?: Record<string, unknown>;
    };

type ParsedPlayableActionRequest =
  | {
      phase: "action";
      playableId: PlayableId;
      action: string;
    }
  | {
      phase: "exit";
      playableId: PlayableId;
    };

export function createLaunchPlayableRequest(
  playableId: PlayableId,
  options: {
    integrationId?: PlayableIntegrationId | undefined;
    ownerContext?: Partial<PlayableOwnerContext> | undefined;
    payload?: Record<string, unknown> | undefined;
  } = {}
): RuntimeRequest {
  return {
    family: "external",
    type: "external",
    eventId: PLAYABLE_LAUNCH_EVENT_ID,
    payload: {
      playableId,
      ...(options.integrationId == null
        ? {}
        : { integrationId: options.integrationId }),
      ...(options.ownerContext == null
        ? {}
        : { ownerContext: options.ownerContext }),
      ...(options.payload == null ? {} : { launchPayload: options.payload }),
    },
  };
}

export function createPlayableActionRequest(
  playableId: PlayableId,
  action: string,
  payload?: Record<string, unknown>
): RuntimeRequest {
  return {
    family: "action",
    type: "action",
    actionId: `playable.${playableId}.${action}`,
    ...(payload == null ? {} : { payload }),
  };
}

export function createExitPlayableRequest(
  playableId: PlayableId,
  payload?: Record<string, unknown>
): RuntimeRequest {
  return createPlayableActionRequest(playableId, "exit", payload);
}

export function resolvePlayableLaunchRequest(input: {
  request: RuntimeRequest;
  definitions?: PlayableDefinitionRegistry | undefined;
  integrations?: PlayableIntegrationRegistry | undefined;
}): PlayableLaunchResolution | null {
  const launchInput = toPlayableLaunchInput(input.request);
  if (launchInput == null) {
    return null;
  }

  return resolvePlayableLaunch({
    launch: launchInput,
    definitions: input.definitions,
    integrations: input.integrations,
  });
}

export function resolvePlayableLaunch(input: {
  launch: PlayableLaunchInput;
  definitions?: PlayableDefinitionRegistry | undefined;
  integrations?: PlayableIntegrationRegistry | undefined;
}): PlayableLaunchResolution {
  const definitions = input.definitions ?? readDefaultPlayableDefinitionRegistry();
  const integrations =
    input.integrations ?? readDefaultPlayableIntegrationRegistry();

  const integration = resolveIntegration({
    launch: input.launch,
    integrations,
  });
  if (!("integrationId" in integration)) {
    return integration;
  }

  const definition = definitions.get(integration.playableId);
  if (definition == null) {
    return {
      ok: false,
      code: "unknown-playable",
      message: `Unknown playable "${integration.playableId}".`,
    };
  }

  const ownerContext = normalizeOwnerContext({
    integration,
    ownerContext: input.launch.ownerContext,
  });
  if (!("ownerKind" in ownerContext)) {
    return ownerContext;
  }

  return {
    ok: true,
    definition,
    integration,
    launch: {
      playableId: definition.id,
      integrationId: integration.integrationId,
      ownerContext,
      ...mergeLaunchPayloadDefaults(integration, input.launch.payload),
    },
  };
}

function mergeLaunchPayloadDefaults(
  integration: PlayableIntegrationDefinition,
  payload: Record<string, unknown> | undefined
): { payload?: Record<string, unknown> | undefined } {
  const triggerPayload = integration.trigger.launchPayload;
  if (triggerPayload == null && payload == null) {
    return {};
  }

  return {
    payload: {
      ...(triggerPayload ?? {}),
      ...(payload ?? {}),
    },
  };
}

export function runPlayableRuntime(input: {
  state: RuntimeState;
  request: RuntimeRequest;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId?: string;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string> | undefined;
}): PlayableRuntimeOutput {
  const resolvedRequest = toPlayableRuntimeRequest(input.request);
  if (resolvedRequest == null) {
    return {
      state: input.state,
      effects: [],
      handled: false,
      session: getActivePlayableSession(input.state, null),
    };
  }

  if (resolvedRequest.phase === "launch") {
  const playableShell = readDefaultPlayableShellRegistry().get(
    resolvedRequest.launch.launch.playableId
  );
  if (playableShell != null) {
    const session = playableShell.createSession({
      ...resolvedRequest.launch.launch,
      payload: buildPlayableShellLaunchPayload({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        ...(input.playerCharacterId == null
          ? {}
          : { playerCharacterId: input.playerCharacterId }),
        activityDefinitionsById: input.activityDefinitionsById,
        launchPayload: resolvedRequest.launch.launch.payload,
      }),
    });
    const nextState = {
      ...input.state,
      core: {
        ...input.state.core,
        runtime: {
          ...input.state.core.runtime,
          playableSession: session,
        },
      },
    };
    return {
      state: nextState,
      effects: [],
      handled: true,
      session,
    };
  }

  if (resolvedRequest.launch.launch.playableId === "story-battle") {
      const completedFlagKey =
        resolvedRequest.launch.launch.payload?.completedFlagKey;
      const winFlagKey = resolvedRequest.launch.launch.payload?.winFlagKey;
      const battleIdVariableKey =
        resolvedRequest.launch.launch.payload?.battleIdVariableKey;
      const resultVariableKey =
        resolvedRequest.launch.launch.payload?.resultVariableKey;
      if (
        typeof completedFlagKey !== "string" ||
        typeof winFlagKey !== "string" ||
        typeof battleIdVariableKey !== "string" ||
        typeof resultVariableKey !== "string"
      ) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "story-battle"),
        };
      }

      const nextCoreState = launchStoryBattlePlayable({
        state: input.state.core,
        ownerId: resolvedRequest.launch.launch.ownerContext.ownerId,
        integrationId: resolvedRequest.launch.launch.integrationId,
        ownerContext: resolvedRequest.launch.launch.ownerContext,
        completion: {
          completedFlagKey,
          winFlagKey,
          battleIdVariableKey,
          resultVariableKey,
          ...(typeof resolvedRequest.launch.launch.payload?.enterHouseId ===
          "string"
            ? { enterHouseId: resolvedRequest.launch.launch.payload.enterHouseId }
            : {}),
          ...(typeof resolvedRequest.launch.launch.payload?.mainMissionText ===
          "string"
            ? {
                mainMissionText:
                  resolvedRequest.launch.launch.payload.mainMissionText,
              }
            : {}),
        },
        textEntriesById: input.textEntriesById,
      });

      const nextState = {
        ...input.state,
        core: nextCoreState,
      };
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "story-battle"),
      };
    }

    return {
      state: input.state,
      effects: [],
      handled: false,
      session: getActivePlayableSession(
        input.state,
        resolvedRequest.launch.launch.playableId
      ),
    };
  }

  if (resolvedRequest.phase === "exit") {
    const activeSession = getActivePlayableSession(
      input.state,
      resolvedRequest.playableId
    );
    const playableShell = readDefaultPlayableShellRegistry().get(
      resolvedRequest.playableId
    );
    if (playableShell != null) {
      const nextState = clearPlayableSession(input.state);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
      };
    }

    if (resolvedRequest.playableId === "story-battle") {
      const nextState = exitStoryBattlePlayable(input.state);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
      };
    }

    return {
      state: input.state,
      effects: [],
      handled: false,
      session: getActivePlayableSession(input.state, resolvedRequest.playableId),
    };
  }

  const activeFlowSession = getActivePlayableSession(
    input.state,
    resolvedRequest.playableId
  );
  const playableShell = readDefaultPlayableShellRegistry().get(
    resolvedRequest.playableId
  );
  if (playableShell != null && activeFlowSession != null) {
    const command = toPlayableShellCommand(
      resolvedRequest.action,
      resolvedRequest.payload
    );
    if (command == null) {
      return {
        state: input.state,
        effects: [],
        handled: true,
        session: activeFlowSession,
      };
    }

    const reducedSession = playableShell.reduce(activeFlowSession, command);
    if (
      reducedSession.status === "completed" ||
      reducedSession.status === "cancelled"
    ) {
      const settlement = playableShell.complete(reducedSession);
      const chainedLaunch =
        settlement == null
          ? null
          : tryLaunchPlayableFromCompletionResult({
              input,
              session: reducedSession,
              settlement,
            });
      if (chainedLaunch != null) {
        return chainedLaunch;
      }
      const presenter = playableShell.present(reducedSession);
      const nextState = writePlayableShellResultOverlayState(
        clearPlayableSession(input.state),
        reducedSession.ownerContext.ownerKind,
        presenter
      );
      const characterStatusById =
        readPlayableShellCharacterStatusById(reducedSession);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
        ...(settlement == null ? {} : { settlement }),
        ...(characterStatusById == null ? {} : { characterStatusById }),
      };
    }

    const nextState = {
      ...input.state,
      core: {
        ...input.state.core,
        runtime: {
          ...input.state.core.runtime,
          playableSession: reducedSession,
        },
      },
    };
    return {
      state: nextState,
      effects: [],
      handled: true,
      session: reducedSession,
    };
  }

  if (resolvedRequest.playableId === "story-battle") {
    if (
      resolvedRequest.action === "battle-action" ||
      resolvedRequest.action === "action"
    ) {
      const battleActionId = resolvedRequest.payload?.battleActionId;
      if (typeof battleActionId !== "string") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "story-battle"),
        };
      }

      const result = dispatchStoryBattlePlayableAction({
        state: input.state,
        battleActionId,
        textEntriesById: input.textEntriesById,
      });
      return {
        state: result.state,
        effects: [],
        handled: true,
        session: getActivePlayableSession(result.state, "story-battle"),
        followUp: result.followUp,
      };
    }
  }

  return {
    state: input.state,
    effects: [],
    handled: false,
    session: getActivePlayableSession(input.state, resolvedRequest.playableId),
  };
}

export function createPlayableSessionShell(input: {
  sessionId: string;
  playableId: PlayableId;
  integrationId: PlayableIntegrationId;
  ownerContext: PlayableOwnerContext;
  status?: ActivePlayableSession["status"] | undefined;
}): ActivePlayableSession {
  return {
    sessionId: input.sessionId,
    playableId: input.playableId,
    integrationId: input.integrationId,
    ownerContext: input.ownerContext,
    status: input.status ?? "active",
  };
}

export function createInteractivePlayableSession(input: {
  playableId: InteractivePlayableId;
  source: InteractivePlayableSource;
}): ActivePlayableSession | null {
  const definition = readDefaultPlayableDefinitionRegistry().get(input.playableId);
  const integrationId = getInteractivePlayableIntegrationId(input.playableId);
  const integration =
    readDefaultPlayableIntegrationRegistry().get(integrationId);

  if (definition == null || integration == null) {
    return null;
  }

  const ownerContext = createInteractiveOwnerContext({
    playableId: input.playableId,
    source: input.source,
  });
  if (ownerContext == null) {
    return null;
  }

  return createPlayableSessionShell({
    sessionId: `playable.${definition.id}`,
    playableId: definition.id,
    integrationId: integration.integrationId,
    ownerContext,
  });
}

function tryLaunchPlayableFromCompletionResult(input: {
  input: Parameters<typeof runPlayableRuntime>[0];
  session: ActivePlayableSession;
  settlement: PlayableResult;
}): PlayableRuntimeOutput | null {
  const launchConfig = readFlowCompletionLaunchConfig(
    input.settlement.factResult.detail
  );
  if (launchConfig == null) {
    return null;
  }

  const ownerContext = {
    ...input.session.ownerContext,
    ...(launchConfig.ownerContext ?? {}),
    ownerId:
      launchConfig.ownerContext?.ownerId ?? input.session.ownerContext.ownerId,
  };
  const currentView =
    ownerContext.ownerKind === "house"
      ? ("house" as const)
      : ownerContext.ownerKind === "dialogue"
        ? ("dialogue" as const)
        : input.input.state.core.ui.currentView;
  const preparedState = {
    ...input.input.state,
    core: {
      ...input.input.state.core,
      ui: {
        ...input.input.state.core.ui,
        currentView,
      },
      runtime: {
        ...input.input.state.core.runtime,
        playableSession: null,
      },
    },
  };

  return runPlayableRuntime({
    ...input.input,
    state: preparedState,
    request: createLaunchPlayableRequest(launchConfig.playableId, {
      ...(launchConfig.integrationId == null
        ? {}
        : { integrationId: launchConfig.integrationId }),
      ownerContext,
      ...(launchConfig.payload == null ? {} : { payload: launchConfig.payload }),
    }),
  });
}

function toPlayableRuntimeRequest(
  request: RuntimeRequest
): ResolvedPlayableRuntimeRequest | null {
  if (request.type === "external") {
    const launch = resolvePlayableLaunchRequest({ request });
    if (launch == null || !launch.ok) {
      return null;
    }

    return {
      phase: "launch",
      launch,
    };
  }

  if (request.type !== "action") {
    return null;
  }

  const playableAction = parsePlayableActionRequest(request.actionId);
  if (playableAction != null) {
    return {
      ...playableAction,
      ...(request.payload == null ? {} : { payload: request.payload }),
    };
  }

  const legacyDefinition =
    readDefaultPlayableDefinitionRegistry().matchActionId(request.actionId);
  if (legacyDefinition == null) {
    return null;
  }

  const action = request.actionId.slice(legacyDefinition.commandPrefix.length);
  if (action === "exit") {
    return {
      phase: "exit",
      playableId: legacyDefinition.id,
      ...(request.payload == null ? {} : { payload: request.payload }),
    };
  }

  return {
    phase: "action",
    playableId: legacyDefinition.id,
    action,
    ...(request.payload == null ? {} : { payload: request.payload }),
  };
}

function parsePlayableActionRequest(
  actionId: string
): ParsedPlayableActionRequest | null {
  if (!actionId.startsWith("playable.")) {
    return null;
  }

  const payload = actionId.slice("playable.".length);
  const separatorIndex = payload.lastIndexOf(".");
  if (separatorIndex <= 0 || separatorIndex >= payload.length - 1) {
    return null;
  }

  const playableId = payload.slice(0, separatorIndex) as PlayableId;
  const action = payload.slice(separatorIndex + 1);
  if (action === "exit") {
    return {
      phase: "exit",
      playableId,
    };
  }

  return {
    phase: "action",
    playableId,
    action,
  };
}

function getActivePlayableSession(
  state: RuntimeState,
  playableId: PlayableId | null
): ActivePlayableSession | null {
  const current = state.core.runtime.playableSession;
  if (current != null) {
    if (playableId == null || current.playableId === playableId) {
      return current;
    }
  }

  if (playableId === "story-battle" && state.core.storyBattle != null) {
    return createInteractivePlayableSession({
      playableId: "story-battle",
      source: {
        type: "house",
        houseId: state.core.world.currentHouseId ?? "house.unknown",
      },
    });
  }

  return playableId == null ? current ?? null : null;
}

function toPlayableLaunchInput(request: RuntimeRequest): PlayableLaunchInput | null {
  if (request.type !== "external") {
    return null;
  }

  if (request.eventId === PLAYABLE_LAUNCH_EVENT_ID) {
    const payload = isRecord(request.payload) ? request.payload : null;
    const playableId =
      typeof payload?.playableId === "string"
        ? (payload.playableId as PlayableId)
        : undefined;
    const integrationId =
      typeof payload?.integrationId === "string"
        ? (payload.integrationId as PlayableIntegrationId)
        : undefined;
    const ownerContext = isRecord(payload?.ownerContext)
      ? (payload.ownerContext as Partial<PlayableOwnerContext>)
      : undefined;
    const launchPayload = isRecord(payload?.launchPayload)
      ? payload.launchPayload
      : undefined;

    return {
      ...(playableId == null ? {} : { playableId }),
      ...(integrationId == null ? {} : { integrationId }),
      ...(ownerContext == null ? {} : { ownerContext }),
      ...(launchPayload == null ? {} : { payload: launchPayload }),
    };
  }

  return null;
}

function resolveIntegration(input: {
  launch: PlayableLaunchInput;
  integrations: PlayableIntegrationRegistry;
}):
  | PlayableIntegrationDefinition
  | {
      ok: false;
      code:
        | "missing-playable-id"
        | "missing-integration"
        | "unknown-integration"
        | "ambiguous-integration"
        | "integration-mismatch";
      message: string;
    } {
  if (input.launch.integrationId != null) {
    const integration = input.integrations.get(input.launch.integrationId);
    if (integration == null) {
      return {
        ok: false,
        code: "unknown-integration",
        message: `Unknown playable integration "${input.launch.integrationId}".`,
      };
    }
    if (
      input.launch.playableId != null &&
      integration.playableId !== input.launch.playableId
    ) {
      return {
        ok: false,
        code: "integration-mismatch",
        message:
          `Playable integration "${input.launch.integrationId}" does not match ` +
          `playable "${input.launch.playableId}".`,
      };
    }
    return integration;
  }

  if (input.launch.playableId == null) {
    return {
      ok: false,
      code: "missing-playable-id",
      message:
        "Playable launch must provide either a playableId or an integrationId.",
    };
  }

  const matches = input.integrations.findByPlayableId(input.launch.playableId);
  if (matches.length === 0) {
    return {
      ok: false,
      code: "missing-integration",
      message:
        `Playable "${input.launch.playableId}" has no registered integration.`,
    };
  }
  if (matches.length > 1) {
    return {
      ok: false,
      code: "ambiguous-integration",
      message:
        `Playable "${input.launch.playableId}" has multiple integrations. ` +
        "Launch must specify integrationId explicitly.",
    };
  }

  const [match] = matches;
  if (match == null) {
    return {
      ok: false,
      code: "missing-integration",
      message:
        `Playable "${input.launch.playableId}" has no registered integration.`,
    };
  }

  return match;
}

function normalizeOwnerContext(input: {
  integration: PlayableIntegrationDefinition;
  ownerContext?: Partial<PlayableOwnerContext> | undefined;
}):
  | PlayableOwnerContext
  | {
      ok: false;
      code: "missing-owner-kind" | "missing-owner-id" | "missing-return-policy";
      message: string;
    } {
  const merged = {
    ...input.integration.ownerDefaults,
    ...(input.ownerContext ?? {}),
  };

  const ownerKind = merged.ownerKind;
  if (
    ownerKind !== "house" &&
    ownerKind !== "dialogue" &&
    ownerKind !== "task" &&
    ownerKind !== "external"
  ) {
    return {
      ok: false,
      code: "missing-owner-kind",
      message: "Playable launch is missing ownerKind.",
    };
  }

  const returnPolicy = merged.returnPolicy;
  if (
    returnPolicy !== "resume-owner" &&
    returnPolicy !== "reenter-owner" &&
    returnPolicy !== "close-only"
  ) {
    return {
      ok: false,
      code: "missing-return-policy",
      message: "Playable launch is missing returnPolicy.",
    };
  }

  if (ownerKind !== "external" && typeof merged.ownerId !== "string") {
    return {
      ok: false,
      code: "missing-owner-id",
      message: `Playable launch for ownerKind "${ownerKind}" is missing ownerId.`,
    };
  }

  return {
    ownerKind,
    ownerId: ownerKind === "external" ? null : merged.ownerId ?? null,
    returnPolicy,
    ...(typeof merged.sessionToken === "string"
      ? { sessionToken: merged.sessionToken }
      : {}),
  };
}

function createInteractiveOwnerContext(input: {
  playableId: InteractivePlayableId;
  source: InteractivePlayableSource;
}): PlayableOwnerContext | null {
  if (input.source.type !== "dialogue") {
    if (input.source.type === "house") {
      return {
        ownerKind: "house",
        ownerId: input.source.houseId,
        returnPolicy: "reenter-owner",
      };
    }
    return null;
  }

  return {
    ownerKind: "dialogue",
    ownerId: input.source.dialogueId,
    returnPolicy: "reenter-owner",
  };
}

function toPlayableShellCommand(
  action: string,
  payload: Record<string, unknown> | undefined
): PlayableCommand | null {
  if (action === "confirm") {
    return { type: "confirm" };
  }

  if (action === "cancel") {
    return { type: "cancel" };
  }

  if (action === "select" && typeof payload?.value === "string") {
    return { type: "select", value: payload.value };
  }

  return {
    type: "custom",
    actionId: action,
    ...(payload == null ? {} : { payload }),
  };
}

function getInteractivePlayableIntegrationId(
  playableId: InteractivePlayableId
): PlayableIntegrationId {
  return "playable.story-battle.dialogue.default";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

function readFlowCompletionLaunchConfig(
  detail: PlayableFactResult["detail"]
): {
  playableId: PlayableId;
  integrationId?: PlayableIntegrationId | undefined;
  ownerContext?: Partial<PlayableOwnerContext> | undefined;
  payload?: Record<string, unknown> | undefined;
} | null {
  if (!isRecord(detail)) {
    return null;
  }

  const launchPlayable = detail.launchPlayable;
  if (!isRecord(launchPlayable) || typeof launchPlayable.playableId !== "string") {
    return null;
  }

  return {
    playableId: launchPlayable.playableId as PlayableId,
    ...(typeof launchPlayable.integrationId === "string"
      ? { integrationId: launchPlayable.integrationId as PlayableIntegrationId }
      : {}),
    ...(isRecord(launchPlayable.ownerContext)
      ? {
          ownerContext: launchPlayable.ownerContext as Partial<PlayableOwnerContext>,
        }
      : {}),
    ...(isRecord(launchPlayable.payload)
      ? { payload: launchPlayable.payload }
      : {}),
  };
}

function buildPlayableShellLaunchPayload(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId?: string;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  launchPayload?: Record<string, unknown> | undefined;
}): Record<string, unknown> {
  const playerCharacter =
    input.playerCharacterId == null
      ? null
      : input.characterDefinitions.find(
          (characterDefinition) =>
            characterDefinition.id === input.playerCharacterId
        ) ?? null;

  const activityId =
    typeof input.launchPayload?.activityId === "string"
      ? input.launchPayload.activityId
      : null;
  const activityDefinition =
    activityId == null
      ? null
      : input.activityDefinitionsById?.[activityId] ?? null;

  return {
    ...(input.launchPayload ?? {}),
    ...(activityDefinition == null
      ? {}
      : {
          __activity: {
            definition: activityDefinition,
            gameState: input.state.core,
          },
        }),
    __runtime: {
      player: {
        characterId: input.playerCharacterId ?? null,
        stamina: playerCharacter?.stamina ?? 0,
        numericAttributes: {
          arithmetic:
            playerCharacter == null
              ? 1
              : Math.max(
                  1,
                  readNumericPersonAttributeBySemanticKey(
                    playerCharacter,
                    "arithmetic",
                    1
                  )
                ),
          medicine:
            playerCharacter == null
              ? 0
              : readNumericPersonAttributeBySemanticKey(
                  playerCharacter,
                  "medicine",
                  0
                ),
        },
      },
      world: {
        currentHouseId: input.state.core.world.currentHouseId,
      },
      variables: input.state.core.runtime.variables,
    },
  };
}

function clearPlayableSession(state: RuntimeState): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      runtime: {
        ...state.core.runtime,
        playableSession: null,
      },
    },
  };
}

function writePlayableShellResultOverlayState(
  state: RuntimeState,
  ownerKind: PlayableOwnerContext["ownerKind"],
  presenter: PlayablePresenterModel
): RuntimeState {
  if (ownerKind !== "house") {
    return state;
  }

  const houseSession = state.core.ui.houseSession;
  const sessionState =
    houseSession?.state != null &&
    typeof houseSession.state === "object" &&
    !Array.isArray(houseSession.state)
      ? (houseSession.state as Record<string, unknown>)
      : {};

  return {
    ...state,
    core: {
      ...state.core,
      ui: {
        ...state.core.ui,
        houseSession:
          houseSession == null
            ? {
                moduleId: "playable-shell",
                state: {
                  overlay: {
                    type: "playable-shell-result",
                    presenter,
                  },
                },
              }
            : {
                ...houseSession,
                state: {
                  ...sessionState,
                  overlay: {
                    type: "playable-shell-result",
                    presenter,
                  },
                },
              },
      },
    },
  };
}

function readPlayableShellCharacterStatusById(
  session: ActivePlayableSession
): CharacterStatusById | undefined {
  const state = session.state;
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return undefined;
  }
  const completion = (state as Record<string, unknown>).completion;
  if (completion == null || typeof completion !== "object" || Array.isArray(completion)) {
    return undefined;
  }
  const characterStatusById = (completion as { characterStatusById?: unknown })
    .characterStatusById;
  return characterStatusById != null &&
    typeof characterStatusById === "object" &&
    !Array.isArray(characterStatusById)
    ? (characterStatusById as CharacterStatusById)
    : undefined;
}

export {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
};
