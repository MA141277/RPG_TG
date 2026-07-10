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
  PlayableFamily,
  PlayableId,
  PlayableIntegrationDefinition,
  PlayableIntegrationId,
  PlayableLaunchInput,
  PlayableLaunchResolution,
  PlayableOwnerContext,
  PlayableSettlement,
} from "../contracts/playable-runtime";
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
  completeCityBeggingPlayable,
  exitCityBeggingPlayable,
  launchCityBeggingPlayable,
  tickCityBeggingPlayable,
  updateCityBeggingPointerPlayable,
} from "../../application/playables/city-begging/city-begging-definition";
import {
  answerGrainAccountingPlayable,
  exitGrainAccountingPlayable,
  launchGrainAccountingPlayable,
  tickGrainAccountingPlayable,
} from "../../application/playables/grain-accounting/grain-accounting-definition";
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
import { CITY_BEGGING_DURATION_DAYS } from "../../application/minigames/city-begging-minigame";
import { convertHouseActivityDaysToSegments } from "../../application/house/house-activity-costs";
import { type PlayableDefinitionRegistry } from "../registry/playable-definition-registry";
import { type PlayableIntegrationRegistry } from "../registry/playable-integration-registry";
import {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  readDefaultPlayableDefinitionRegistry,
  readDefaultPlayableIntegrationRegistry,
  resetDefaultPlayableRuntimeRegistries,
} from "./playable-runtime-registries";
import { settleRuntimeEffects } from "./runtime-settlement";

export const PLAYABLE_LAUNCH_EVENT_ID = "playable.launch";

export type PlayableRuntimeOutput = RuntimeResult & {
  handled: boolean;
  session: ActivePlayableSession | null;
  characterDefinitions?: CharacterDefinition[];
  followUp?: RuntimeInteractiveSignal | null;
};

type InteractivePlayableId = "activity-qte" | "city-begging" | "story-battle";

type InteractivePlayableSource =
  | { type: "house"; houseId: string }
  | { type: "scene"; sceneId: string }
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
      family: definition.family,
      ownerContext,
      ...(input.launch.payload == null ? {} : { payload: input.launch.payload }),
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

    if (resolvedRequest.launch.launch.playableId === "city-begging") {
      const now = resolvedRequest.launch.launch.payload?.now;
      const nextState = launchCityBeggingPlayable({
        state: input.state,
        now: typeof now === "number" ? now : performance.now(),
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
    if (resolvedRequest.playableId === "activity-qte") {
      const nextState = exitActivityQtePlayable(input.state);
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
      const settledState = settleRuntimeEffects({
        state: completion.state,
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
        state: {
          ...settledState,
          core: {
            ...settledState.core,
            runtime: {
              ...settledState.core.runtime,
              playableSession: null,
            },
          },
        },
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: null,
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
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "grain-accounting"),
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
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(completion.state, "grain-accounting"),
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
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "medicine-compounding"
        ),
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
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "medicine-compounding"
        ),
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
      return {
        state: completion.state,
        characterDefinitions: completion.characterDefinitions,
        effects: [],
        handled: true,
        session: getActivePlayableSession(
          completion.state,
          "medicine-compounding"
        ),
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
  family: PlayableFamily;
  ownerContext: PlayableOwnerContext;
  status?: ActivePlayableSession["status"] | undefined;
}): ActivePlayableSession {
  return {
    sessionId: input.sessionId,
    playableId: input.playableId,
    integrationId: input.integrationId,
    family: input.family,
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
    family: definition.family,
    ownerContext,
  });
}

export function createPlayableSettlementShell(input: {
  session: ActivePlayableSession;
  outcome: PlayableSettlement["outcome"];
  factResult: PlayableSettlement["factResult"];
  effects?: PlayableSettlement["effects"] | undefined;
}): PlayableSettlement {
  return {
    integrationId: input.session.integrationId,
    outcome: input.outcome,
    factResult: input.factResult,
    handoff: {
      type: input.session.ownerContext.returnPolicy,
      ownerKind: input.session.ownerContext.ownerKind,
      ownerId: input.session.ownerContext.ownerId,
      ...(input.session.ownerContext.sessionToken == null
        ? {}
        : { sessionToken: input.session.ownerContext.sessionToken }),
    },
    effects: input.effects ?? [],
  };
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
  const match = /^playable\.([^.]+)\.(.+)$/.exec(actionId);
  if (match == null) {
    return null;
  }

  const playableId = match[1] as PlayableId;
  const action = match[2];
  if (action == null) {
    return null;
  }
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
        type: "scene",
        sceneId: state.core.scene.activeSceneId ?? "scene.unknown",
      },
    });
  }

  if (playableId === "story-battle" && state.core.storyBattle != null) {
    return createInteractivePlayableSession({
      playableId: "story-battle",
      source: {
        type: "scene",
        sceneId: state.core.scene.activeSceneId ?? "scene.unknown",
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
    ownerKind !== "scene" &&
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

  if (input.source.type !== "scene") {
    return null;
  }

  return {
    ownerKind: "scene",
    ownerId: input.source.sceneId,
    returnPolicy:
      input.playableId === "activity-qte" ? "resume-owner" : "reenter-owner",
  };
}

function getInteractivePlayableIntegrationId(
  playableId: InteractivePlayableId
): PlayableIntegrationId {
  if (playableId === "activity-qte") {
    return "playable.activity-qte.scene.default";
  }

  if (playableId === "story-battle") {
    return "playable.story-battle.scene.default";
  }

  return "playable.city-begging.external.default";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

export {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
};
