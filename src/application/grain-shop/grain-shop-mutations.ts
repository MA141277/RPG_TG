import type { CharacterDefinition } from "../../domain/character";
import type { CharacterStatusById } from "../../domain/character-status";
import type { GameState } from "../../domain/game-state";
import { convertShiToDou } from "../../domain/grain-unit";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../domain/grain-shop";
import { mutateCharacterNumericProperty } from "../character/runtime-property-mutation";
import { mutatePlayerGrainDou } from "../inventory/trade-inventory";
import type { SettlementGrainIntelEffect } from "./settlement-grain-intel-service";

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
  return mutateCharacterNumericProperty({
    state,
    characterDefinitions,
    characterId: playerCharacterId,
    propertyId: "stats.gold",
    operation: "add",
    value: delta,
  });
}

export function mutatePlayerAccountingLevel(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): GrainShopMutationResult {
  return mutateCharacterNumericProperty({
    state,
    characterDefinitions,
    characterId: playerCharacterId,
    propertyId: "skills.accounting",
    operation: "add",
    value: delta,
  });
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

export function applySettlementGrainIntelEffect(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  effect: SettlementGrainIntelEffect
): GrainShopMutationResult {
  let nextState = state;
  let nextCharacterDefinitions = characterDefinitions;

  if (effect.currentCityGrainPrice != null) {
    nextState = setGrainPrice(nextState, effect.currentCityGrainPrice);
  }

  if (effect.relationshipDelta !== 0) {
    nextState = mutateGrainShopRelationship(nextState, effect.relationshipDelta);
  }

  if (effect.timeDelta !== 0) {
    nextState = advanceGrainShopTime(nextState, effect.timeDelta);
  }

  if (effect.moneyDelta !== 0) {
    const goldMutation = mutatePlayerGold(
      nextState,
      nextCharacterDefinitions,
      playerCharacterId,
      effect.moneyDelta
    );
    nextState = goldMutation.state;
    nextCharacterDefinitions = goldMutation.characterDefinitions;
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}
