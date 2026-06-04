import type {
  CityBeggingGameCompletionResult,
  CityBeggingMiniGameState,
  CityBeggingMiniGameVariantId,
} from "../../domain/city-begging-minigame";
import { CITY_BEGGING_RUNTIME_KEYS } from "../../domain/city-begging-minigame";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  ensurePlayerGrainInventory,
  mutatePlayerGrainDou,
} from "../inventory/trade-inventory";
import { spendPlayerStamina } from "../player/player-stamina";
import { CITY_BEGGING_GRANARY_ESCORT_CONFIG, createGranaryEscortMiniGameState, setGranaryEscortMiniGamePointer, updateGranaryEscortMiniGameState } from "./city-begging-granary-escort";
import { CITY_BEGGING_VILLAGE_CATCHING_CONFIG, createVillageCatchingMiniGameState, setVillageCatchingMiniGamePointer, updateVillageCatchingMiniGameState } from "./city-begging-village-catching";

export const DEFAULT_CITY_BEGGING_MINIGAME_VARIANT: CityBeggingMiniGameVariantId =
  "village-catching";

export const CITY_BEGGING_MINIGAME_VARIANTS = {
  "granary-escort": {
    label: "顶米送仓",
    viewport: {
      width: CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.width,
      height: CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.height,
    },
  },
  "village-catching": {
    label: "村口托钵",
    viewport: {
      width: CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.width,
      height: CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.height,
    },
  },
} as const;

export function createCityBeggingMiniGameState(
  now: number,
  variantId: CityBeggingMiniGameVariantId = DEFAULT_CITY_BEGGING_MINIGAME_VARIANT
): CityBeggingMiniGameState {
  if (variantId === "granary-escort") {
    return {
      variantId,
      variantState: createGranaryEscortMiniGameState(now),
    };
  }

  return {
    variantId,
    variantState: createVillageCatchingMiniGameState(now),
  };
}

export function setCityBeggingMiniGamePointer(
  state: CityBeggingMiniGameState,
  pointerX: number
): CityBeggingMiniGameState {
  if (state.variantId === "granary-escort") {
    return {
      ...state,
      variantState: setGranaryEscortMiniGamePointer(
        state.variantState,
        pointerX
      ),
    };
  }

  return {
    ...state,
    variantState: setVillageCatchingMiniGamePointer(state.variantState, pointerX),
  };
}

export function updateCityBeggingMiniGameState(
  state: CityBeggingMiniGameState,
  now: number
): CityBeggingMiniGameState {
  if (state.variantId === "granary-escort") {
    return {
      ...state,
      variantState: updateGranaryEscortMiniGameState(state.variantState, now),
    };
  }

  return {
    ...state,
    variantState: updateVillageCatchingMiniGameState(state.variantState, now),
  };
}

export function getCityBeggingMiniGameStatus(
  state: CityBeggingMiniGameState
): "playing" | "result" {
  return state.variantState.status;
}

export function isCityBeggingMiniGamePlaying(
  state: CityBeggingMiniGameState | null
): boolean {
  return state?.variantState.status === "playing";
}

export function getCityBeggingMiniGameCompletionResult(
  state: CityBeggingMiniGameState | null
): CityBeggingGameCompletionResult | null {
  if (state == null || state.variantState.status !== "result") {
    return null;
  }

  return state.variantState.result;
}

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function recordCityBeggingMiniGameCompletion(
  state: GameState,
  result: CityBeggingGameCompletionResult
): GameState {
  const completionCount = readNumericVariable(
    state,
    CITY_BEGGING_RUNTIME_KEYS.completionCount,
    0
  );

  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [CITY_BEGGING_RUNTIME_KEYS.completionCount]: completionCount + 1,
        [CITY_BEGGING_RUNTIME_KEYS.lastFoodGain]: result.foodGain,
        [CITY_BEGGING_RUNTIME_KEYS.lastGoldGain]: result.goldGain,
        [CITY_BEGGING_RUNTIME_KEYS.lastMaxCombo]: result.maxCombo,
      },
    },
  };
}

export function applyCityBeggingMiniGameCompletion(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  result: CityBeggingGameCompletionResult
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
} {
  let nextState = recordCityBeggingMiniGameCompletion(
    mutatePlayerGrainDou(ensurePlayerGrainInventory(state), result.foodGain),
    result
  );
  let nextCharacters = characterDefinitions.map((characterDefinition) => {
    if (characterDefinition.id !== playerCharacterId || result.goldGain <= 0) {
      return characterDefinition;
    }

    return {
      ...characterDefinition,
      stats: {
        ...characterDefinition.stats,
        gold: characterDefinition.stats.gold + result.goldGain,
      },
    };
  });

  const staminaMutation = spendPlayerStamina(
    nextState,
    nextCharacters,
    playerCharacterId
  );
  nextState = staminaMutation.state;
  nextCharacters = staminaMutation.characterDefinitions;

  return {
    state: nextState,
    characterDefinitions: nextCharacters,
  };
}
