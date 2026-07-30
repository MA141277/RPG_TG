import type { GameState } from "../../domain/game-state";
import { getMedicineInventoryQuantityVariableKey } from "../../domain/medicine-house";
import { getTradeInventoryQuantityVariableKey } from "../../domain/market-house";

export type PlayerItemLegacySource = "medicine-house" | "market-house";

export type PlayerItemQuantityMutation = {
  itemId: string;
  delta: number;
  legacySources?: PlayerItemLegacySource[];
};

const PLAYER_ITEM_KEY_PREFIX = "var.player_inventory.item";

function normalizeQuantity(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

function readNumericVariable(
  state: Pick<GameState, "runtime">,
  key: string
): number {
  return normalizeQuantity(state.runtime.variables[key]);
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
        [key]: Math.max(0, normalizeQuantity(value)),
      },
    },
  };
}

function getLegacyKeys(
  itemId: string,
  legacySources: readonly PlayerItemLegacySource[] = []
): string[] {
  return legacySources.map((source) =>
    source === "medicine-house"
      ? getMedicineInventoryQuantityVariableKey(itemId)
      : getTradeInventoryQuantityVariableKey(itemId)
  );
}

export function getPlayerItemQuantityVariableKey(itemId: string): string {
  return `${PLAYER_ITEM_KEY_PREFIX}.${itemId}`;
}

export function readPlayerItemQuantity(
  state: Pick<GameState, "runtime">,
  itemId: string,
  legacySources: PlayerItemLegacySource[] = []
): number {
  return [
    getPlayerItemQuantityVariableKey(itemId),
    ...getLegacyKeys(itemId, legacySources),
  ].reduce((sum, key) => sum + readNumericVariable(state, key), 0);
}

export function setPlayerItemQuantity(
  state: GameState,
  itemId: string,
  quantity: number,
  legacySources: PlayerItemLegacySource[] = []
): GameState {
  let nextState = withNumericVariable(
    state,
    getPlayerItemQuantityVariableKey(itemId),
    quantity
  );

  for (const legacyKey of getLegacyKeys(itemId, legacySources)) {
    nextState = withNumericVariable(nextState, legacyKey, 0);
  }

  return nextState;
}

export function mutatePlayerItemQuantity(
  state: GameState,
  itemId: string,
  delta: number,
  legacySources: PlayerItemLegacySource[] = []
): GameState {
  return setPlayerItemQuantity(
    state,
    itemId,
    readPlayerItemQuantity(state, itemId, legacySources) + delta,
    legacySources
  );
}

export function applyPlayerItemMutations(
  state: GameState,
  mutations: readonly PlayerItemQuantityMutation[]
): GameState {
  return mutations.reduce(
    (nextState, mutation) =>
      mutatePlayerItemQuantity(
        nextState,
        mutation.itemId,
        mutation.delta,
        mutation.legacySources ?? []
      ),
    state
  );
}
