import type { CharacterStatusById } from "../../../domain/character-status";
import type { Effect } from "../../../core/contracts/effect";
import type {
  ActivePlayableSession,
  PlayableCommand,
  PlayableLaunchRequest,
  PlayablePresenterModel,
  PlayableResult,
  PlayableShell,
} from "../../../core/contracts/playable-runtime";
import { mergeCharacterStatusById } from "../../../domain/character-status";
import type {
  CityBeggingGameCompletionResult,
  CityBeggingMiniGameState,
  CityBeggingMiniGameVariantId,
} from "../../../domain/city-begging-minigame";
import { PLAYER_GRAIN_RUNTIME_KEYS } from "../../inventory/trade-inventory";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../../domain/grain-shop";
import { getTradeInventoryQuantityVariableKey } from "../../../domain/market-house";
import { convertShiToDou } from "../../../domain/grain-unit";
import { ACTIVITY_COMPLETION_STAMINA_COST } from "../../player/player-stamina";
import { resolvePlayableResultRouting } from "../../../core/runtime/playable-result-routing";
import { bindCityBeggingOverlayController, resetCityBeggingOverlayController } from "../builtin/city-begging/city-begging-runtime-controller";
import {
  CITY_BEGGING_DURATION_DAYS,
  CITY_BEGGING_MINIGAME_VARIANTS,
  createCityBeggingMiniGameState,
  setCityBeggingMiniGamePointer,
  updateCityBeggingMiniGameState,
} from "../builtin/city-begging/city-begging-minigame";

declare const require: (path: string) => unknown;

type CityBeggingRuntimeContext = {
  playerCharacterId: string | null;
  playerStamina: number;
  variables: Record<string, number | string>;
};

type CityBeggingCompletionState = {
  result: CityBeggingGameCompletionResult;
  effects: Effect[];
  characterStatusById: CharacterStatusById;
};

type CityBeggingSessionState = {
  launchPayload: Record<string, unknown>;
  runtimeContext: CityBeggingRuntimeContext;
  minigameState: CityBeggingMiniGameState;
  completion?: CityBeggingCompletionState | undefined;
};

export const cityBeggingPlayableShell: PlayableShell = {
  manifest: {
    playableId: "city-begging",
    family: "minigame",
    commandPrefix: "playable.city-begging.",
  },
  createSession(input) {
    const launchPayload = readLaunchPayload(input.payload);
    const runtimeContext = readRuntimeContext(launchPayload);
    const variantId = readVariantId(launchPayload);
    const now =
      typeof launchPayload.now === "number" && Number.isFinite(launchPayload.now)
        ? launchPayload.now
        : 0;
    return {
      sessionId: "playable.city-begging",
      playableId: input.playableId,
      integrationId: input.integrationId,
      ownerContext: input.ownerContext,
      status: "active",
      state: {
        launchPayload,
        runtimeContext,
        minigameState: createCityBeggingMiniGameState(now, variantId),
      } satisfies CityBeggingSessionState,
    };
  },
  reduce(session, command) {
    const state = readSessionState(session);
    if (state == null) {
      return session;
    }

    if (command.type === "cancel") {
      return {
        ...session,
        status: "cancelled",
      };
    }

    if (command.type !== "custom" || session.status !== "active") {
      return session;
    }

    if (
      command.actionId === "pointer" &&
      typeof command.payload?.pointerX === "number" &&
      state.minigameState.variantState.status === "playing"
    ) {
      return writeSessionState(session, {
        ...state,
        minigameState: setCityBeggingMiniGamePointer(
          state.minigameState,
          command.payload.pointerX
        ),
      });
    }

    if (
      command.actionId === "tick" &&
      typeof command.payload?.now === "number" &&
      state.minigameState.variantState.status === "playing"
    ) {
      const minigameState = updateCityBeggingMiniGameState(
        state.minigameState,
        command.payload.now
      );
      return writeSessionState(session, {
        ...state,
        minigameState,
        ...(minigameState.variantState.status !== "result"
          ? {}
          : {
              completion: resolveCompletionState(
                state.runtimeContext,
                minigameState.variantState.result
              ),
            }),
      });
    }

    if (
      command.actionId === "confirm-result" &&
      state.minigameState.variantState.status === "result" &&
      state.completion != null
    ) {
      return {
        ...session,
        status: "completed",
      };
    }

    return session;
  },
  present(session) {
    const state = readSessionState(session);
    const minigameState = state?.minigameState;
    return {
      playableId: session.playableId,
      layout: "battlefield",
      title:
        minigameState == null
          ? "化缘"
          : CITY_BEGGING_MINIGAME_VARIANTS[minigameState.variantId].label,
      summaryLines:
        minigameState == null
          ? []
          : minigameState.variantState.status === "playing"
            ? [
                `玩法：${CITY_BEGGING_MINIGAME_VARIANTS[minigameState.variantId].label}`,
                `耗时 ${CITY_BEGGING_DURATION_DAYS} 天`,
              ]
            : [
                `粮食 ${minigameState.variantState.result.foodGain} 斗`,
                `铜钱 ${minigameState.variantState.result.goldGain} 文`,
                `最高连击 ${minigameState.variantState.result.maxCombo}`,
              ],
      actions:
        minigameState?.variantState.status === "result"
          ? [
              {
                id: "confirm-result",
                label: "确定",
                commandType: "custom",
              },
            ]
          : [],
      viewModel:
        minigameState == null
          ? undefined
          : {
              minigameState,
            },
      detail:
        minigameState == null
          ? undefined
          : {
              blocksBackgroundClicks: true,
            },
    };
  },
  complete(session) {
    if (session.status === "cancelled") {
      return resolvePlayableResultRouting({
        session,
        outcome: "cancelled",
        factResult: {
          status: "cancelled",
        },
      });
    }

    const state = readSessionState(session);
    if (state?.completion == null || state.minigameState.variantState.status !== "result") {
      return null;
    }

    return resolvePlayableResultRouting({
      session,
      outcome: state.completion.result.success ? "success" : "failure",
      factResult: {
        status: state.completion.result.success ? "completed" : "failed",
        metrics: {
          foodGain: state.completion.result.foodGain,
          goldGain: state.completion.result.goldGain,
          maxCombo: state.completion.result.maxCombo,
        },
        detail: state.completion.result,
      },
      settlementEffects: [
        ...state.completion.effects,
        {
          type: "advanceTime",
          days: CITY_BEGGING_DURATION_DAYS,
        },
      ],
    });
  },
  renderOverlay(session) {
    const state = readSessionState(session);
    return readCityBeggingViewModule().renderCityBeggingMiniGameOverlay(
      state?.minigameState ?? null,
      {
        playableId: session.playableId,
        confirmActionId: "confirm-result",
      }
    );
  },
  syncOverlay(input) {
    if (input.session?.playableId !== "city-begging") {
      resetCityBeggingOverlayController();
      return;
    }

    const state = readSessionState(input.session);
    const minigameState = state?.minigameState ?? null;
    if (minigameState?.variantState.status !== "playing") {
      resetCityBeggingOverlayController();
      return;
    }

    bindCityBeggingOverlayController({
      root: input.root,
      launchKey: `${minigameState.variantId}:${minigameState.variantState.startedAtMs}`,
      isPlaying: true,
      onPointer(pointerX) {
        input.dispatchAction("city-begging", "pointer", { pointerX });
        syncNextOverlayState(input);
      },
      onTick(now) {
        input.dispatchAction("city-begging", "tick", { now });
        syncNextOverlayState(input);
      },
      requestAnimationFrame: input.requestAnimationFrame,
      cancelAnimationFrame: input.cancelAnimationFrame,
    });
  },
};

function resolveCompletionState(
  runtimeContext: CityBeggingRuntimeContext,
  result: CityBeggingGameCompletionResult
): CityBeggingCompletionState {
  const playerCharacterId = runtimeContext.playerCharacterId ?? "char.player";
  return {
    result,
    effects: createCompletionEffects(runtimeContext.variables, playerCharacterId, result),
    characterStatusById: mergeCharacterStatusById({}, playerCharacterId, {
      stamina: Math.max(
        0,
        runtimeContext.playerStamina - ACTIVITY_COMPLETION_STAMINA_COST
      ),
    }),
  };
}

function createCompletionEffects(
  variables: Record<string, number | string>,
  playerCharacterId: string,
  result: CityBeggingGameCompletionResult
): Effect[] {
  const completionCount = readNumericVariable(
    variables,
    "var.city_begging.completion_count",
    0
  );
  const currentQuantityDou = variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou];
  const nextPlayerGrainDou =
    (typeof currentQuantityDou === "number"
      ? currentQuantityDou
      : convertShiToDou(
          readNumericVariable(variables, GRAIN_SHOP_VARIABLE_KEYS.food, 0) +
            readNumericVariable(
              variables,
              getTradeInventoryQuantityVariableKey("rice"),
              0
            )
        )) + result.foodGain;

  return [
    {
      type: "setVariable",
      key: PLAYER_GRAIN_RUNTIME_KEYS.quantityDou,
      value: Math.max(0, nextPlayerGrainDou),
    },
    {
      type: "setVariable",
      key: GRAIN_SHOP_VARIABLE_KEYS.food,
      value: 0,
    },
    {
      type: "setVariable",
      key: getTradeInventoryQuantityVariableKey("rice"),
      value: 0,
    },
    {
      type: "setVariable",
      key: "var.city_begging.completion_count",
      value: completionCount + 1,
    },
    {
      type: "setVariable",
      key: "var.city_begging.last_food_gain",
      value: result.foodGain,
    },
    {
      type: "setVariable",
      key: "var.city_begging.last_gold_gain",
      value: result.goldGain,
    },
    {
      type: "setVariable",
      key: "var.city_begging.last_max_combo",
      value: result.maxCombo,
    },
    ...(result.goldGain > 0
      ? [
          {
            type: "mutateCharacterNumericAttribute" as const,
            characterId: playerCharacterId,
            semanticKey: "gold",
            operation: "add" as const,
            value: result.goldGain,
          },
        ]
      : []),
  ];
}

function readSessionState(
  session: ActivePlayableSession
): CityBeggingSessionState | null {
  const state = session.state;
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return null;
  }
  const minigameState = (state as { minigameState?: unknown }).minigameState;
  if (minigameState == null || typeof minigameState !== "object" || Array.isArray(minigameState)) {
    return null;
  }
  return state as CityBeggingSessionState;
}

function writeSessionState(
  session: ActivePlayableSession,
  state: CityBeggingSessionState
): ActivePlayableSession {
  return {
    ...session,
    state,
  };
}

function readLaunchPayload(
  payload: Record<string, unknown> | undefined
): Record<string, unknown> {
  return payload == null ? {} : payload;
}

function readRuntimeContext(
  launchPayload: Record<string, unknown>
): CityBeggingRuntimeContext {
  const runtimeContext = isRecord(launchPayload.__runtime)
    ? launchPayload.__runtime
    : null;
  const player = runtimeContext != null && isRecord(runtimeContext.player)
    ? runtimeContext.player
    : null;
  return {
    playerCharacterId:
      typeof player?.characterId === "string" ? player.characterId : null,
    playerStamina:
      typeof player?.stamina === "number" && Number.isFinite(player.stamina)
        ? player.stamina
        : 0,
    variables:
      runtimeContext != null && isRecord(runtimeContext.variables)
        ? (Object.fromEntries(
            Object.entries(runtimeContext.variables).filter(
              ([, value]) =>
                typeof value === "string" ||
                (typeof value === "number" && Number.isFinite(value))
            )
          ) as Record<string, number | string>)
        : {},
  };
}

function readVariantId(
  launchPayload: Record<string, unknown>
): CityBeggingMiniGameVariantId {
  return launchPayload.variantId === "granary-escort"
    ? "granary-escort"
    : "village-catching";
}

function readNumericVariable(
  variables: Record<string, number | string>,
  key: string,
  fallback: number
): number {
  const value = variables[key];
  return typeof value === "number" ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

function syncNextOverlayState(
  input: Parameters<NonNullable<PlayableShell["syncOverlay"]>>[0]
): void {
  const nextSession = input.readSession("city-begging");
  if (nextSession == null) {
    input.renderApp();
    return;
  }

  const nextState = readSessionState(nextSession)?.minigameState ?? null;
  if (nextState == null) {
    input.renderApp();
    return;
  }

  if (nextState.variantState.status === "playing") {
    readCityBeggingViewModule().syncCityBeggingMiniGameOverlay(
      input.root,
      nextState
    );
    return;
  }

  input.renderApp();
}

function readCityBeggingViewModule(): {
  renderCityBeggingMiniGameOverlay(
    state: CityBeggingMiniGameState | null,
    options?: {
      playableId?: string;
      confirmActionId?: string;
    }
  ): string;
  syncCityBeggingMiniGameOverlay(
    root: ParentNode,
    state: CityBeggingMiniGameState | null
  ): void;
} {
  return require(
    "../builtin/city-begging/city-begging-minigame-view"
  ) as {
    renderCityBeggingMiniGameOverlay(
      state: CityBeggingMiniGameState | null,
      options?: {
        playableId?: string;
        confirmActionId?: string;
      }
    ): string;
    syncCityBeggingMiniGameOverlay(
      root: ParentNode,
      state: CityBeggingMiniGameState | null
    ): void;
  };
}
