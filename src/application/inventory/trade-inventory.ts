import type { GameState } from "../../domain/game-state";
import { convertShiToDou } from "../../domain/grain-unit";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../domain/grain-shop";
import { getTradeInventoryQuantityVariableKey } from "../../domain/market-house";

export const PLAYER_GRAIN_RUNTIME_KEYS = {
  quantityDou: "var.player_inventory.grain_dou",
} as const;

const LEGACY_PLAYER_GRAIN_GOODS_ID = "rice";

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

function withNumericVariable(
  state: GameState,
  key: string,
  value: number
): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [key]: value,
      },
    },
  };
}

function readLegacyPlayerGrainShi(state: GameState): number {
  return (
    readNumericVariable(state, GRAIN_SHOP_VARIABLE_KEYS.food, 0) +
    readNumericVariable(
      state,
      getTradeInventoryQuantityVariableKey(LEGACY_PLAYER_GRAIN_GOODS_ID),
      0
    )
  );
}

export function readPlayerGrainDou(state: GameState): number {
  return readNumericVariable(state, PLAYER_GRAIN_RUNTIME_KEYS.quantityDou, 0);
}

export function setPlayerGrainDou(
  state: GameState,
  quantityDou: number
): GameState {
  return withNumericVariable(
    state,
    PLAYER_GRAIN_RUNTIME_KEYS.quantityDou,
    Math.max(0, quantityDou)
  );
}

export function mutatePlayerGrainDou(
  state: GameState,
  deltaDou: number
): GameState {
  return setPlayerGrainDou(state, readPlayerGrainDou(state) + deltaDou);
}

export function ensurePlayerGrainInventory(
  state: GameState
): GameState {
  const currentQuantityDou = state.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou];
  const hasCurrentQuantity = typeof currentQuantityDou === "number";
  const migratedQuantityDou = hasCurrentQuantity
    ? currentQuantityDou
    : convertShiToDou(readLegacyPlayerGrainShi(state));

  let nextState = withNumericVariable(
    state,
    PLAYER_GRAIN_RUNTIME_KEYS.quantityDou,
    Math.max(0, migratedQuantityDou)
  );

  nextState = withNumericVariable(nextState, GRAIN_SHOP_VARIABLE_KEYS.food, 0);
  nextState = withNumericVariable(
    nextState,
    getTradeInventoryQuantityVariableKey(LEGACY_PLAYER_GRAIN_GOODS_ID),
    0
  );

  return nextState;
}
