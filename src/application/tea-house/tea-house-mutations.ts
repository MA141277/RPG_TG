import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  getTeaHouseFixedNpcFavorabilityVariableKey,
  getTeaHouseIntelVariableKey,
  getTeaHouseTimeVariableKey,
} from "../../domain/tea-house";
import { mutateCityNpcFavorability } from "../city-npcs/city-npc-pool-state";

export type TeaHouseMutationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

function withVariable(
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

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function increaseTeaHouseTime(
  state: GameState,
  houseId: string,
  amount: number
): GameState {
  const key = getTeaHouseTimeVariableKey(houseId);
  return withVariable(state, key, readNumericVariable(state, key, 0) + amount);
}

export function increaseTeaHouseIntel(
  state: GameState,
  houseId: string,
  amount: number
): GameState {
  const key = getTeaHouseIntelVariableKey(houseId);
  return withVariable(state, key, readNumericVariable(state, key, 0) + amount);
}

export function mutateTeaHouseActorFavorability(
  state: GameState,
  houseId: string,
  cityId: string,
  actorId: string,
  isFixedHost: boolean,
  delta: number
): GameState {
  if (isFixedHost) {
    const key = getTeaHouseFixedNpcFavorabilityVariableKey(houseId, actorId);
    return withVariable(state, key, readNumericVariable(state, key, 0) + delta);
  }

  return mutateCityNpcFavorability(state, cityId, actorId, delta);
}

export function mutatePlayerGold(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): TeaHouseMutationResult {
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

export function mutatePlayerRhetoric(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): TeaHouseMutationResult {
  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId || characterDefinition.skills == null) {
        return characterDefinition;
      }

      return {
        ...characterDefinition,
        skills: {
          ...characterDefinition.skills,
          rhetoric: Math.max(0, characterDefinition.skills.rhetoric + delta),
        },
      };
    }),
  };
}
