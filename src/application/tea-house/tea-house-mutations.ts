import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type { CharacterStatusById } from "../../domain/character-status";
import {
  getTeaHouseFixedNpcFavorabilityVariableKey,
  getTeaHouseIntelVariableKey,
  getTeaHouseTimeVariableKey,
} from "../../domain/tea-house";
import { mutateCharacterNumericAttributeBySemanticKey } from "../character/runtime-property-mutation";
import { mutateCityNpcFavorability } from "../city-npcs/city-npc-pool-state";

export type TeaHouseMutationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
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
  const result = mutateCharacterNumericAttributeBySemanticKey({
    state,
    characterDefinitions,
    characterId: playerCharacterId,
    semanticKey: "gold",
    operation: delta >= 0 ? "add" : "subtract",
    value: Math.abs(delta),
  });
  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
    characterStatusById: result.characterStatusById,
  };
}

export function mutatePlayerRhetoric(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): TeaHouseMutationResult {
  const result = mutateCharacterNumericAttributeBySemanticKey({
    state,
    characterDefinitions,
    characterId: playerCharacterId,
    semanticKey: "rhetoric",
    operation: delta >= 0 ? "add" : "subtract",
    value: Math.abs(delta),
  });
  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
    characterStatusById: result.characterStatusById,
  };
}
