import type {
  CityBeggingGameCompletionResult,
  CityBeggingMiniGameState,
  CityBeggingMiniGameVariantId,
} from "../../domain/city-begging-minigame";
import { CITY_BEGGING_RUNTIME_KEYS } from "../../domain/city-begging-minigame";
import type { GameState } from "../../domain/game-state";
import { mutatePlayerGrainDou } from "../inventory/trade-inventory";
import type { CharacterDefinition } from "../../domain/character";
import {
  type PlayerStaminaMutationResult,
  spendPlayerStamina,
} from "../player/player-stamina";
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

export function recordCityBeggingMiniGameCompletion(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  result: CityBeggingGameCompletionResult
): {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
} {
  const nextState = mutatePlayerGrainDou(state, result.foodGain);
  const completionCountValue =
    nextState.runtime.variables[CITY_BEGGING_RUNTIME_KEYS.completionCount];
  const completionCount =
    typeof completionCountValue === "number" ? completionCountValue : 0;
  const nextCharacterDefinitions = characterDefinitions.map((characterDefinition) => {
    if (characterDefinition.id !== playerCharacterId) {
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

  return {
    state: {
      ...nextState,
      runtime: {
        ...nextState.runtime,
        variables: {
          ...nextState.runtime.variables,
          [CITY_BEGGING_RUNTIME_KEYS.completionCount]: completionCount + 1,
          [CITY_BEGGING_RUNTIME_KEYS.lastFoodGain]: result.foodGain,
          [CITY_BEGGING_RUNTIME_KEYS.lastGoldGain]: result.goldGain,
          [CITY_BEGGING_RUNTIME_KEYS.lastMaxCombo]: result.maxCombo,
        },
      },
    },
    characterDefinitions: nextCharacterDefinitions,
  };
}

export function applyCityBeggingMiniGameCompletion(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  result: CityBeggingGameCompletionResult
): PlayerStaminaMutationResult {
  const completion = recordCityBeggingMiniGameCompletion(
    state,
    characterDefinitions,
    playerCharacterId,
    result
  );

  return spendPlayerStamina(
    completion.state,
    completion.characterDefinitions,
    playerCharacterId
  );
}
