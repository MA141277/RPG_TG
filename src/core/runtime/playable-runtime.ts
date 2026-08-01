import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityBeggingGameCompletionResult } from "../../domain/city-begging-minigame";
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
  PlayableResult,
} from "../contracts/playable-runtime";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import {
  launchFlowPlayable,
  reduceFlowPlayable,
} from "../../application/playables/flow/flow-playable-definition";
import type { RuntimeState } from "../contracts/runtime-state";
import {
  startActivityQtePlayable,
  adjustActivityQteWagerPlayable,
  chooseActivityQteCommandPlayable,
  exitActivityQtePlayable,
  playActivityQtePlayable,
  stopActivityQtePlayable,
  tickActivityQtePlayable,
} from "../../application/playables/activity-qte/activity-qte-definition";
import {
  adjustTempleCopyScriptureWagerPlayable,
  chooseTempleCopyScriptureCommandPlayable,
  exitTempleCopyScripturePlayable,
  launchTempleCopyScripturePlayable,
  playTempleCopyScripturePlayable,
  stopTempleCopyScripturePlayable,
  tickTempleCopyScripturePlayable,
} from "../../minigames/temple-copy-scripture";
import {
  completeCityBeggingPlayable,
  exitCityBeggingPlayable,
  launchCityBeggingPlayable,
  tickCityBeggingPlayable,
  updateCityBeggingPointerPlayable,
} from "../../application/playables/builtin/city-begging/city-begging-definition";
import { CITY_BEGGING_DURATION_DAYS } from "../../application/playables/builtin/city-begging/city-begging-minigame";
import {
  answerGrainAccountingPlayable,
  exitGrainAccountingPlayable,
  launchGrainAccountingPlayable,
  tickGrainAccountingPlayable,
} from "../../application/playables/builtin/grain-accounting/grain-accounting-definition";
import {
  clearMedicineCompoundingPlayable,
  exitMedicineCompoundingPlayable,
  launchMedicineCompoundingPlayable,
  selectMedicineCompoundingHerbPlayable,
  settleMedicineCompoundingPlayable,
  tickMedicineCompoundingPlayable,
} from "../../application/playables/medicine-compounding/medicine-compounding-definition";
import {
  dispatchStoryBattlePlayableAction,
  exitStoryBattlePlayable,
  launchStoryBattlePlayable,
} from "../../application/playables/story-battle/story-battle-definition";
import { convertHouseActivityDaysToSegments } from "../../application/house/house-activity-costs";
import { type PlayableDefinitionRegistry } from "../registry/playable-definition-registry";
import { type PlayableIntegrationRegistry } from "../registry/playable-integration-registry";
import {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  readDefaultPlayableDefinitionRegistry,
  readDefaultPlayableIntegrationRegistry,
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
  | "activity-qte"
  | "temple-copy-scripture"
  | "city-begging"
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
  flowPlayablesById?: Record<string, FlowPlayableDefinition> | undefined;
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
    const flowPlayable =
      input.flowPlayablesById?.[resolvedRequest.launch.launch.playableId] ?? null;
    if (
      flowPlayable != null ||
      resolvedRequest.launch.launch.playableId === "building-flow"
    ) {
      if (flowPlayable == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(
            input.state,
            resolvedRequest.launch.launch.playableId
          ),
        };
      }

      const nextState = {
        ...input.state,
        core: {
          ...input.state.core,
          ui: {
            ...input.state.core.ui,
            currentView: "minigame" as const,
          },
          runtime: {
            ...input.state.core.runtime,
            playableSession: launchFlowPlayable({
              definition: flowPlayable,
              integrationId: resolvedRequest.launch.launch.integrationId,
              ownerContext: resolvedRequest.launch.launch.ownerContext,
            }),
          },
        },
      };
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, flowPlayable.id),
      };
    }

    if (resolvedRequest.launch.launch.playableId === "activity-qte") {
      const activityId = resolvedRequest.launch.launch.payload?.activityId;
      if (typeof activityId !== "string") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "activity-qte"),
        };
      }

      const activityDefinition =
        input.activityDefinitionsById?.[activityId] ?? null;
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "activity-qte"),
        };
      }

      const handlerId =
        typeof resolvedRequest.launch.launch.payload?.handlerId === "string"
          ? resolvedRequest.launch.launch.payload.handlerId
          : activityDefinition.fallbackHandlerId ?? activityDefinition.handlerId;
      const nextState = startActivityQtePlayable({
        state: input.state,
        activityDefinition,
        handlerId,
        integrationId: resolvedRequest.launch.launch.integrationId,
        ownerContext: resolvedRequest.launch.launch.ownerContext,
      });

      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "activity-qte"),
      };
    }

    if (resolvedRequest.launch.launch.playableId === "temple-copy-scripture") {
      const activityId = resolvedRequest.launch.launch.payload?.activityId;
      if (typeof activityId !== "string") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "temple-copy-scripture"),
        };
      }

      const activityDefinition =
        input.activityDefinitionsById?.[activityId] ?? null;
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "temple-copy-scripture"),
        };
      }

      const handlerId =
        typeof resolvedRequest.launch.launch.payload?.handlerId === "string"
          ? resolvedRequest.launch.launch.payload.handlerId
          : activityDefinition.fallbackHandlerId ?? activityDefinition.handlerId;
      const nextState = launchTempleCopyScripturePlayable({
        state: input.state,
        activityDefinition,
        handlerId,
        integrationId: resolvedRequest.launch.launch.integrationId,
        ownerContext: resolvedRequest.launch.launch.ownerContext,
      });

      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "temple-copy-scripture"),
      };
    }

    if (resolvedRequest.launch.launch.playableId === "city-begging") {
      const now = resolvedRequest.launch.launch.payload?.now;
      const nextState = launchCityBeggingPlayable({
        state: input.state,
        now: typeof now === "number" ? now : performance.now(),
        integrationId: resolvedRequest.launch.launch.integrationId,
        ownerContext: resolvedRequest.launch.launch.ownerContext,
      });

      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "city-begging"),
      };
    }

    if (resolvedRequest.launch.launch.playableId === "grain-accounting") {
      if (input.playerCharacterId == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "grain-accounting"),
        };
      }

      const nextState = launchGrainAccountingPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
        ownerId: resolvedRequest.launch.launch.ownerContext.ownerId,
        integrationId: resolvedRequest.launch.launch.integrationId,
        ownerContext: resolvedRequest.launch.launch.ownerContext,
        ...(resolvedRequest.launch.launch.payload == null
          ? {}
          : { launchPayload: resolvedRequest.launch.launch.payload }),
      });

      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "grain-accounting"),
      };
    }

    if (resolvedRequest.launch.launch.playableId === "medicine-compounding") {
      if (input.playerCharacterId == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "medicine-compounding"),
        };
      }

      const nextState = launchMedicineCompoundingPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
        ownerId: resolvedRequest.launch.launch.ownerContext.ownerId,
        integrationId: resolvedRequest.launch.launch.integrationId,
        ownerContext: resolvedRequest.launch.launch.ownerContext,
        ...(resolvedRequest.launch.launch.payload == null
          ? {}
          : { launchPayload: resolvedRequest.launch.launch.payload }),
      });

      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "medicine-compounding"),
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
    if (isFlowPlayableSession(activeSession, input.flowPlayablesById)) {
      const nextState = {
        ...input.state,
        core: {
          ...input.state.core,
          runtime: {
            ...input.state.core.runtime,
            playableSession: null,
          },
        },
      };
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
      };
    }

    if (resolvedRequest.playableId === "activity-qte") {
      const nextState = exitActivityQtePlayable(input.state);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
      };
    }

    if (resolvedRequest.playableId === "temple-copy-scripture") {
      const nextState = exitTempleCopyScripturePlayable(input.state);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
      };
    }

    if (resolvedRequest.playableId === "city-begging") {
      const nextState = exitCityBeggingPlayable(input.state);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
      };
    }

    if (resolvedRequest.playableId === "grain-accounting") {
      const nextState = exitGrainAccountingPlayable(input.state);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: null,
      };
    }

    if (resolvedRequest.playableId === "medicine-compounding") {
      const nextState = exitMedicineCompoundingPlayable(input.state);
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
  const flowPlayable =
    input.flowPlayablesById?.[resolvedRequest.playableId] ?? null;
  if (isFlowPlayableSession(activeFlowSession, input.flowPlayablesById) && flowPlayable != null) {
    const session = activeFlowSession;
    if (session == null) {
      return {
        state: input.state,
        effects: [],
        handled: false,
        session: null,
      };
    }
    const command = toFlowPlayableCommand(
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

    const reduction = reduceFlowPlayable({
      definition: flowPlayable,
      session,
      command,
    });
    if (
      reduction.lifecycle.type === "completed" ||
      reduction.lifecycle.type === "cancelled"
    ) {
      const launchedFromFlowCompletion = tryLaunchPlayableFromFlowCompletion({
        input,
        session: reduction.session,
        factResult: reduction.lifecycle.result,
      });
      if (launchedFromFlowCompletion != null) {
        return launchedFromFlowCompletion;
      }

      const settlement = createPlayableResultShell({
        session: reduction.session,
        outcome:
          reduction.lifecycle.type === "cancelled"
            ? "cancelled"
            : reduction.lifecycle.result.status === "failed"
              ? "failure"
              : "success",
        factResult: reduction.lifecycle.result,
      });
      return {
        state: {
          ...input.state,
          core: {
            ...input.state.core,
            runtime: {
              ...input.state.core.runtime,
              playableSession: null,
            },
          },
        },
        effects: [],
        handled: true,
        session: null,
        settlement,
      };
    }
    const nextState = {
      ...input.state,
      core: {
        ...input.state.core,
        runtime: {
          ...input.state.core.runtime,
          playableSession: reduction.session,
        },
      },
    };
    return {
      state: nextState,
      effects: [],
      handled: true,
      session: reduction.session,
    };
  }

  if (resolvedRequest.playableId === "activity-qte") {
    const session = input.state.core.runtime.activitySession;
    const activityId =
      session?.type === "qte-bar" ||
      session?.type === "work-sequence" ||
      session?.type === "fortune-board"
        ? session.activityId
        : null;
    const activityDefinition =
      activityId == null ? null : input.activityDefinitionsById?.[activityId] ?? null;

    if (resolvedRequest.action === "tick") {
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "activity-qte"),
        };
      }

      const completion = tickActivityQtePlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
      });
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "activity-qte"),
      };
    }

    if (resolvedRequest.action === "play") {
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "activity-qte"),
        };
      }

      const completion = playActivityQtePlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "activity-qte"),
      };
    }

    if (
      resolvedRequest.action === "wager-minus" ||
      resolvedRequest.action === "wager-plus"
    ) {
      const completion = adjustActivityQteWagerPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        direction: resolvedRequest.action === "wager-minus" ? -1 : 1,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "activity-qte"),
      };
    }

    if (resolvedRequest.action === "speed") {
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "activity-qte"),
        };
      }

      const tickMs = resolvedRequest.payload?.tickMs;
      const completion = chooseActivityQteCommandPlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
        commandId: `speed:${typeof tickMs === "number" ? tickMs : ""}`,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "activity-qte"),
      };
    }

    if (resolvedRequest.action === "stop") {
      if (activityDefinition == null) {
        return {
          state: exitActivityQtePlayable(input.state),
          effects: [],
          handled: true,
          session: null,
        };
      }

      const completion = stopActivityQtePlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "activity-qte"),
      };
    }

    if (resolvedRequest.action === "choose") {
      const commandId = resolvedRequest.payload?.commandId;
      if (activityDefinition == null || typeof commandId !== "string") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "activity-qte"),
        };
      }

      const completion = chooseActivityQteCommandPlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
        commandId,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "activity-qte"),
      };
    }
  }

  if (resolvedRequest.playableId === "temple-copy-scripture") {
    const session = input.state.core.runtime.activitySession;
    const activityId =
      session?.type === "qte-bar" ||
      session?.type === "work-sequence" ||
      session?.type === "fortune-board"
        ? session.activityId
        : null;
    const activityDefinition =
      activityId == null ? null : input.activityDefinitionsById?.[activityId] ?? null;

    if (resolvedRequest.action === "tick") {
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "temple-copy-scripture"),
        };
      }

      const completion = tickTempleCopyScripturePlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
      });
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "temple-copy-scripture"
        ),
      };
    }

    if (resolvedRequest.action === "play") {
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "temple-copy-scripture"),
        };
      }

      const completion = playTempleCopyScripturePlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "temple-copy-scripture"
        ),
      };
    }

    if (
      resolvedRequest.action === "wager-minus" ||
      resolvedRequest.action === "wager-plus"
    ) {
      const completion = adjustTempleCopyScriptureWagerPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        direction: resolvedRequest.action === "wager-minus" ? -1 : 1,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "temple-copy-scripture"
        ),
      };
    }

    if (resolvedRequest.action === "speed") {
      if (activityDefinition == null) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "temple-copy-scripture"),
        };
      }

      const tickMs = resolvedRequest.payload?.tickMs;
      const completion = chooseTempleCopyScriptureCommandPlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
        commandId: `speed:${typeof tickMs === "number" ? tickMs : ""}`,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "temple-copy-scripture"
        ),
      };
    }

    if (resolvedRequest.action === "stop") {
      if (activityDefinition == null) {
        return {
          state: exitTempleCopyScripturePlayable(input.state),
          effects: [],
          handled: true,
          session: null,
        };
      }

      const completion = stopTempleCopyScripturePlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "temple-copy-scripture"
        ),
      };
    }

    if (resolvedRequest.action === "choose") {
      const commandId = resolvedRequest.payload?.commandId;
      if (activityDefinition == null || typeof commandId !== "string") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "temple-copy-scripture"),
        };
      }

      const completion = chooseTempleCopyScriptureCommandPlayable({
        state: input.state,
        activityDefinition,
        characterDefinitions: input.characterDefinitions,
        commandId,
      });

      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "temple-copy-scripture"
        ),
      };
    }
  }

  if (resolvedRequest.playableId === "city-begging") {
    if (resolvedRequest.action === "pointer") {
      const pointerX = resolvedRequest.payload?.pointerX;
      if (typeof pointerX !== "number") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "city-begging"),
        };
      }

      const nextState = updateCityBeggingPointerPlayable({
        state: input.state,
        pointerX,
      });
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "city-begging"),
      };
    }

    if (resolvedRequest.action === "tick") {
      const now = resolvedRequest.payload?.now;
      if (typeof now !== "number") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "city-begging"),
        };
      }

      const nextState = tickCityBeggingPlayable({
        state: input.state,
        now,
      });
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "city-begging"),
      };
    }

    if (resolvedRequest.action === "complete") {
      const result = resolvedRequest.payload?.result;
      if (
        input.playerCharacterId == null ||
        result == null ||
        typeof result !== "object"
      ) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "city-begging"),
        };
      }

      const completion = completeCityBeggingPlayable({
        state: input.state,
        playerCharacterId: input.playerCharacterId,
        characterDefinitions: input.characterDefinitions,
        result: result as CityBeggingGameCompletionResult,
      });
      const completionResult = result as CityBeggingGameCompletionResult;
      const session =
        getActivePlayableSession(completion.state, "city-begging") ??
        getActivePlayableSession(input.state, "city-begging");
      const settlement =
        session == null
          ? null
          : resolvePlayableResultRouting({
              session,
              outcome: completionResult.success === true ? "success" : "failure",
              factResult: {
                status:
                  completionResult.success === true ? "completed" : "failed",
                metrics: {
                  foodGain:
                    typeof completionResult.foodGain === "number"
                      ? completionResult.foodGain
                      : 0,
                  goldGain:
                    typeof completionResult.goldGain === "number"
                      ? completionResult.goldGain
                      : 0,
                  maxCombo:
                    typeof completionResult.maxCombo === "number"
                      ? completionResult.maxCombo
                      : 0,
                },
                detail: completionResult as Record<string, unknown>,
              },
              settlementEffects: [
                ...completion.effects,
                {
                  type: "advanceTime",
                  days:
                    convertHouseActivityDaysToSegments(CITY_BEGGING_DURATION_DAYS) === 0
                      ? 0
                      : CITY_BEGGING_DURATION_DAYS,
                },
              ],
            });

      return {
        state: {
          ...completion.state,
          core: {
            ...completion.state.core,
            runtime: {
              ...completion.state.core.runtime,
              playableSession: null,
            },
          },
        },
        characterDefinitions: input.characterDefinitions,
        characterStatusById: completion.characterStatusById,
        effects: [],
        handled: true,
        session: null,
        ...(settlement == null ? {} : { settlement }),
      };
    }
  }

  if (resolvedRequest.playableId === "grain-accounting") {
    if (input.playerCharacterId == null) {
      return {
        state: input.state,
        effects: [],
        handled: true,
        session: getActivePlayableSession(input.state, "grain-accounting"),
      };
    }

    if (resolvedRequest.action === "tick") {
      const completion = tickGrainAccountingPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
      });
      const session =
        getActivePlayableSession(completion.state, "grain-accounting") ??
        getActivePlayableSession(input.state, "grain-accounting");
      const settlement =
        completion.settlement == null || session == null
          ? null
          : resolvePlayableResultRouting({
              session,
              outcome: completion.settlement.outcome,
              factResult: {
                status: completion.settlement.factStatus,
                metrics: {
                  score: completion.settlement.score,
                  durationDays: completion.settlement.durationDays,
                  rewardMoney: completion.settlement.reward.money,
                  rewardMath: completion.settlement.reward.math,
                  rewardRelationship: completion.settlement.reward.relationship,
                },
                detail: {
                  grade: completion.settlement.grade,
                  reward: completion.settlement.reward,
                },
              },
              settlementEffects: completion.settlement.effects,
            });
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        ...(completion.settlement == null
          ? {}
          : { characterStatusById: completion.settlement.characterStatusById }),
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "grain-accounting"),
        ...(settlement == null ? {} : { settlement }),
      };
    }

    if (resolvedRequest.action === "answer") {
      const playerSaysCorrect = resolvedRequest.payload?.playerSaysCorrect;
      if (typeof playerSaysCorrect !== "boolean") {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "grain-accounting"),
        };
      }

      const completion = answerGrainAccountingPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
        playerSaysCorrect,
      });
      const session =
        getActivePlayableSession(completion.state, "grain-accounting") ??
        getActivePlayableSession(input.state, "grain-accounting");
      const settlement =
        completion.settlement == null || session == null
          ? null
          : resolvePlayableResultRouting({
              session,
              outcome: completion.settlement.outcome,
              factResult: {
                status: completion.settlement.factStatus,
                metrics: {
                  score: completion.settlement.score,
                  durationDays: completion.settlement.durationDays,
                  rewardMoney: completion.settlement.reward.money,
                  rewardMath: completion.settlement.reward.math,
                  rewardRelationship: completion.settlement.reward.relationship,
                },
                detail: {
                  grade: completion.settlement.grade,
                  reward: completion.settlement.reward,
                },
              },
              settlementEffects: completion.settlement.effects,
            });
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        ...(completion.settlement == null
          ? {}
          : { characterStatusById: completion.settlement.characterStatusById }),
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "grain-accounting"),
        ...(settlement == null ? {} : { settlement }),
      };
    }
  }

  if (resolvedRequest.playableId === "medicine-compounding") {
    if (input.playerCharacterId == null) {
      return {
        state: input.state,
        effects: [],
        handled: true,
        session: getActivePlayableSession(input.state, "medicine-compounding"),
      };
    }

    if (resolvedRequest.action === "tick") {
      const completion = tickMedicineCompoundingPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
      });
      const session =
        getActivePlayableSession(completion.state, "medicine-compounding") ??
        getActivePlayableSession(input.state, "medicine-compounding");
      const settlement =
        completion.settlement == null || session == null
          ? null
          : resolvePlayableResultRouting({
              session,
              outcome: completion.settlement.outcome,
              factResult: {
                status: completion.settlement.factStatus,
                metrics: {
                  durationDays: completion.settlement.durationDays,
                  rewardMedicine: completion.settlement.reward.medicine,
                  rewardRelationship: completion.settlement.reward.relationship,
                },
                detail: {
                  grade: completion.settlement.grade,
                },
              },
              settlementEffects: completion.settlement.effects,
            });
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        ...(completion.settlement == null
          ? {}
          : { characterStatusById: completion.settlement.characterStatusById }),
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "medicine-compounding"
        ),
        ...(settlement == null ? {} : { settlement }),
      };
    }

    if (resolvedRequest.action === "clear") {
      const nextState = clearMedicineCompoundingPlayable(input.state);
      return {
        state: nextState,
        effects: [],
        handled: true,
        session: getActivePlayableSession(nextState, "medicine-compounding"),
      };
    }

    if (resolvedRequest.action === "finish") {
      const completion = settleMedicineCompoundingPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
      });
      const session =
        getActivePlayableSession(completion.state, "medicine-compounding") ??
        getActivePlayableSession(input.state, "medicine-compounding");
      const settlement =
        completion.settlement == null || session == null
          ? null
          : resolvePlayableResultRouting({
              session,
              outcome: completion.settlement.outcome,
              factResult: {
                status: completion.settlement.factStatus,
                metrics: {
                  durationDays: completion.settlement.durationDays,
                  rewardMedicine: completion.settlement.reward.medicine,
                  rewardRelationship: completion.settlement.reward.relationship,
                },
                detail: {
                  grade: completion.settlement.grade,
                },
              },
              settlementEffects: completion.settlement.effects,
            });
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        ...(completion.settlement == null
          ? {}
          : { characterStatusById: completion.settlement.characterStatusById }),
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "medicine-compounding"
        ),
        ...(settlement == null ? {} : { settlement }),
      };
    }

    if (resolvedRequest.action === "select-herb") {
      const herbId = resolvedRequest.payload?.herbId;
      if (typeof herbId !== "string" || herbId.length === 0) {
        return {
          state: input.state,
          effects: [],
          handled: true,
          session: getActivePlayableSession(input.state, "medicine-compounding"),
        };
      }

      const completion = selectMedicineCompoundingHerbPlayable({
        state: input.state,
        characterDefinitions: input.characterDefinitions,
        playerCharacterId: input.playerCharacterId,
        herbId,
      });
      const session =
        getActivePlayableSession(completion.state, "medicine-compounding") ??
        getActivePlayableSession(input.state, "medicine-compounding");
      const settlement =
        completion.settlement == null || session == null
          ? null
          : resolvePlayableResultRouting({
              session,
              outcome: completion.settlement.outcome,
              factResult: {
                status: completion.settlement.factStatus,
                metrics: {
                  durationDays: completion.settlement.durationDays,
                  rewardMedicine: completion.settlement.reward.medicine,
                  rewardRelationship: completion.settlement.reward.relationship,
                },
                detail: {
                  grade: completion.settlement.grade,
                },
              },
              settlementEffects: completion.settlement.effects,
            });
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        ...(completion.settlement == null
          ? {}
          : { characterStatusById: completion.settlement.characterStatusById }),
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "medicine-compounding"
        ),
        ...(settlement == null ? {} : { settlement }),
      };
    }
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

function isFlowPlayableSession(
  session: ActivePlayableSession | null,
  flowPlayablesById: Record<string, FlowPlayableDefinition> | undefined
): boolean {
  if (session == null) {
    return false;
  }
  if (flowPlayablesById?.[session.playableId] != null) {
    return true;
  }
  if (session.playableId === "building-flow") {
    return true;
  }
  return typeof session.state?.currentNodeId === "string";
}

function tryLaunchPlayableFromFlowCompletion(input: {
  input: Parameters<typeof runPlayableRuntime>[0];
  session: ActivePlayableSession;
  factResult: PlayableFactResult;
}): PlayableRuntimeOutput | null {
  const launchConfig = readFlowCompletionLaunchConfig(input.factResult.detail);
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

  if (playableId === "city-begging" && state.app.beggingMiniGameState != null) {
    return createInteractivePlayableSession({
      playableId: "city-begging",
      source: { type: "external", id: "interactive.city-begging.launch" },
    });
  }

  if (playableId === "activity-qte" && state.core.runtime.activitySession != null) {
    return createInteractivePlayableSession({
      playableId: "activity-qte",
      source: {
        type: "house",
        houseId: state.core.world.currentHouseId ?? "house.unknown",
      },
    });
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

  if (request.eventId === "interactive.city-begging.launch") {
    return {
      playableId: "city-begging",
      ...(request.payload == null ? {} : { payload: request.payload }),
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
  if (input.playableId === "city-begging") {
    return {
      ownerKind: "external",
      ownerId: null,
      returnPolicy: "close-only",
    };
  }

  if (input.source.type !== "dialogue") {
    if (input.source.type === "house") {
      return {
        ownerKind: "house",
        ownerId: input.source.houseId,
        returnPolicy:
          input.playableId === "story-battle"
            ? "reenter-owner"
            : "resume-owner",
      };
    }
    return null;
  }

  return {
    ownerKind: "dialogue",
    ownerId: input.source.dialogueId,
    returnPolicy:
      input.playableId === "activity-qte" ? "resume-owner" : "reenter-owner",
  };
}

function toFlowPlayableCommand(
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

  return null;
}

function getInteractivePlayableIntegrationId(
  playableId: InteractivePlayableId
): PlayableIntegrationId {
  if (playableId === "activity-qte") {
    return "playable.activity-qte.dialogue.default";
  }

  if (playableId === "story-battle") {
    return "playable.story-battle.dialogue.default";
  }

  if (playableId === "temple-copy-scripture") {
    return "playable.temple-copy-scripture.house.temple";
  }

  return "playable.city-begging.external.default";
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

export {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
};
