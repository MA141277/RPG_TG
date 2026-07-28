import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { convertShiToDou } from "../../domain/grain-unit";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../domain/grain-shop";
import {
  type CharacterStatusById,
} from "../character/character-status";
import { mutateCharacterNumericAttributeBySemanticKey } from "../character/runtime-property-mutation";
import { mutatePlayerGrainDou } from "../inventory/trade-inventory";

export type GrainShopMutationResult = {
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

function readVariable(state: GameState, key: string, fallback: number): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function advanceGrainShopTime(
  state: GameState,
  amount = 1
): GameState {
  const currentTime = readVariable(
    state,
    GRAIN_SHOP_VARIABLE_KEYS.time,
    1
  );
  return withVariable(
    state,
    GRAIN_SHOP_VARIABLE_KEYS.time,
    currentTime + Math.max(0, amount)
  );
}

export function mutatePlayerGold(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): GrainShopMutationResult {
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

export function mutatePlayerArithmetic(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): GrainShopMutationResult {
  const result = mutateCharacterNumericAttributeBySemanticKey({
    state,
    characterDefinitions,
    characterId: playerCharacterId,
    semanticKey: "arithmetic",
    operation: delta >= 0 ? "add" : "subtract",
    value: Math.abs(delta),
  });
  return {
    state: result.state,
    characterDefinitions: result.characterDefinitions,
    characterStatusById: result.characterStatusById,
  };
}

export function mutateGrainShopFood(
  state: GameState,
  delta: number
): GameState {
  return mutatePlayerGrainDou(state, convertShiToDou(delta));
}

export function mutateGrainShopRelationship(
  state: GameState,
  delta: number
): GameState {
  const currentRelationship = readVariable(
    state,
    GRAIN_SHOP_VARIABLE_KEYS.relationship,
    0
  );
  return withVariable(
    state,
    GRAIN_SHOP_VARIABLE_KEYS.relationship,
    currentRelationship + delta
  );
}

export function setGrainPrice(state: GameState, grainPrice: number): GameState {
  return withVariable(state, GRAIN_SHOP_VARIABLE_KEYS.grainPrice, grainPrice);
}
