import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  getTavernCompletedWorkKey,
  getTavernDrinkCountVariableKey,
  getTavernTimeVariableKey,
} from "../../domain/tavern";

export type TavernMutationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

function withVariable(state: GameState, key: string, value: number | string): GameState {
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

function withFlag(state: GameState, key: string, value: boolean): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      flags: {
        ...state.runtime.flags,
        [key]: value,
      },
    },
  };
}

function readNumericVariable(state: GameState, key: string, fallback: number): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function increaseTavernTime(
  state: GameState,
  houseId: string,
  amount: number
): GameState {
  const key = getTavernTimeVariableKey(houseId);
  return withVariable(state, key, readNumericVariable(state, key, 0) + amount);
}

export function increaseTavernDrinkCount(
  state: GameState,
  houseId: string,
  amount: number
): GameState {
  const key = getTavernDrinkCountVariableKey(houseId);
  return withVariable(state, key, readNumericVariable(state, key, 0) + amount);
}

export function completeTavernWork(
  state: GameState,
  houseId: string,
  offerId: string
): GameState {
  return withFlag(state, getTavernCompletedWorkKey(houseId, offerId), true);
}

export function isTavernWorkCompleted(
  state: GameState,
  houseId: string,
  offerId: string
): boolean {
  return state.runtime.flags[getTavernCompletedWorkKey(houseId, offerId)] === true;
}

export function mutatePlayerGold(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): TavernMutationResult {
  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId) {
        return characterDefinition;
      }

      return {
        ...characterDefinition,
        stats: {
          ...characterDefinition.stats,
          gold: characterDefinition.stats.gold + delta,
        },
      };
    }),
  };
}
