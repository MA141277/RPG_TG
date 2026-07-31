import type {
  CityBeggingGameCompletionResult,
  CityBeggingMiniGameState,
  CityBeggingMiniGameVariantId,
} from "../../../../domain/city-begging-minigame";
import type { Effect } from "../../../../core/contracts/effect";
import { CITY_BEGGING_RUNTIME_KEYS } from "../../../../domain/city-begging-minigame";
import type { CharacterDefinition } from "../../../../domain/character";
import type { GameState } from "../../../../domain/game-state";
import { type CharacterStatusById, mergeCharacterStatusById } from "../../../../domain/character-status";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../../../domain/grain-shop";
import { convertShiToDou } from "../../../../domain/grain-unit";
import { getTradeInventoryQuantityVariableKey } from "../../../../domain/market-house";
import { assertExists } from "../../../../shared/assert";
import { PLAYER_GRAIN_RUNTIME_KEYS } from "../../../inventory/trade-inventory";
import { ACTIVITY_COMPLETION_STAMINA_COST } from "../../../player/player-stamina";
import { CITY_BEGGING_GRANARY_ESCORT_CONFIG, createGranaryEscortMiniGameState, setGranaryEscortMiniGamePointer, updateGranaryEscortMiniGameState } from "./city-begging-granary-escort";
import { CITY_BEGGING_VILLAGE_CATCHING_CONFIG, createVillageCatchingMiniGameState, setVillageCatchingMiniGamePointer, updateVillageCatchingMiniGameState } from "./city-begging-village-catching";

export const DEFAULT_CITY_BEGGING_MINIGAME_VARIANT: CityBeggingMiniGameVariantId =
  "village-catching";
export const CITY_BEGGING_DURATION_DAYS = 10;

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

function resolvePlayerGrainDou(state: GameState): number {
  const currentQuantityDou = state.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou];
  if (typeof currentQuantityDou === "number") {
    return currentQuantityDou;
  }

  return convertShiToDou(
    readNumericVariable(state, GRAIN_SHOP_VARIABLE_KEYS.food, 0) +
      readNumericVariable(state, getTradeInventoryQuantityVariableKey("rice"), 0)
  );
}

function createCityBeggingMiniGameCompletionEffects(
  state: GameState,
  playerCharacterId: string,
  result: CityBeggingGameCompletionResult
): Effect[] {
  const completionCount = readNumericVariable(
    state,
    CITY_BEGGING_RUNTIME_KEYS.completionCount,
    0
  );
  const nextPlayerGrainDou = resolvePlayerGrainDou(state) + result.foodGain;

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
      key: CITY_BEGGING_RUNTIME_KEYS.completionCount,
      value: completionCount + 1,
    },
    {
      type: "setVariable",
      key: CITY_BEGGING_RUNTIME_KEYS.lastFoodGain,
      value: result.foodGain,
    },
    {
      type: "setVariable",
      key: CITY_BEGGING_RUNTIME_KEYS.lastGoldGain,
      value: result.goldGain,
    },
    {
      type: "setVariable",
      key: CITY_BEGGING_RUNTIME_KEYS.lastMaxCombo,
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

function createCityBeggingMiniGameCompletionStatusById(
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  amount = ACTIVITY_COMPLETION_STAMINA_COST
): CharacterStatusById {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assertExists(
    playerCharacter,
    `Player character not found for id "${playerCharacterId}" in city-begging playable.`
  );

  return mergeCharacterStatusById({}, playerCharacterId, {
    stamina: Math.max(0, playerCharacter.stamina - Math.max(0, amount)),
  });
}

export function resolveCityBeggingMiniGameCompletion(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  result: CityBeggingGameCompletionResult;
}): {
  effects: Effect[];
  characterStatusById: CharacterStatusById;
} {
  return {
    effects: createCityBeggingMiniGameCompletionEffects(
      input.state,
      input.playerCharacterId,
      input.result
    ),
    characterStatusById: createCityBeggingMiniGameCompletionStatusById(
      input.characterDefinitions,
      input.playerCharacterId
    ),
  };
}
