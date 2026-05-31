import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  getTavernAcceptedWorkKey,
  getTavernActiveWorkIdsVariableKey,
  getTavernCompletedWorkKey,
  getTavernDrinkCountVariableKey,
  getTavernFailedWorkKey,
  getTavernTimeVariableKey,
  getTavernWorkProgressVariableKey,
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

function readStringVariable(state: GameState, key: string, fallback: string): string {
  const value = state.runtime.variables[key];
  return typeof value === "string" ? value : fallback;
}

function parseIdList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function serializeIdList(ids: string[]): string {
  return ids.join(",");
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

export function acceptTavernWork(
  state: GameState,
  houseId: string,
  offerId: string
): GameState {
  const activeKey = getTavernActiveWorkIdsVariableKey(houseId);
  const activeIds = parseIdList(readStringVariable(state, activeKey, ""));
  const nextActiveIds = activeIds.includes(offerId)
    ? activeIds
    : [...activeIds, offerId];

  return withFlag(
    withVariable(state, activeKey, serializeIdList(nextActiveIds)),
    getTavernAcceptedWorkKey(houseId, offerId),
    true
  );
}

export function removeActiveTavernWork(
  state: GameState,
  houseId: string,
  offerId: string
): GameState {
  const activeKey = getTavernActiveWorkIdsVariableKey(houseId);
  const activeIds = parseIdList(readStringVariable(state, activeKey, ""));
  return withVariable(
    state,
    activeKey,
    serializeIdList(activeIds.filter((activeId) => activeId !== offerId))
  );
}

export function failTavernWork(
  state: GameState,
  houseId: string,
  offerId: string
): GameState {
  return withFlag(state, getTavernFailedWorkKey(houseId, offerId), true);
}

export function isTavernWorkAccepted(
  state: GameState,
  houseId: string,
  offerId: string
): boolean {
  return state.runtime.flags[getTavernAcceptedWorkKey(houseId, offerId)] === true;
}

export function isTavernWorkCompleted(
  state: GameState,
  houseId: string,
  offerId: string
): boolean {
  return state.runtime.flags[getTavernCompletedWorkKey(houseId, offerId)] === true;
}

export function isTavernWorkFailed(
  state: GameState,
  houseId: string,
  offerId: string
): boolean {
  return state.runtime.flags[getTavernFailedWorkKey(houseId, offerId)] === true;
}

export function getActiveTavernWorkIds(state: GameState, houseId: string): string[] {
  return parseIdList(
    readStringVariable(state, getTavernActiveWorkIdsVariableKey(houseId), "")
  );
}

export function setTavernWorkProgress(
  state: GameState,
  houseId: string,
  offerId: string,
  progress: number
): GameState {
  return withVariable(state, getTavernWorkProgressVariableKey(houseId, offerId), progress);
}

export function getTavernWorkProgress(
  state: GameState,
  houseId: string,
  offerId: string
): number {
  return readNumericVariable(state, getTavernWorkProgressVariableKey(houseId, offerId), -1);
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
