import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { convertShiToDou } from "../../domain/grain-unit";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../domain/grain-shop";
import { mutatePlayerGrainDou } from "../inventory/trade-inventory";

export type GrainShopMutationResult = {
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

function readVariable(state: GameState, key: string, fallback: number): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function advanceGrainShopTime(state: GameState): GameState {
  const currentTime = readVariable(
    state,
    GRAIN_SHOP_VARIABLE_KEYS.time,
    1
  );
  return withVariable(state, GRAIN_SHOP_VARIABLE_KEYS.time, currentTime + 1);
}

export function mutatePlayerGold(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): GrainShopMutationResult {
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

export function mutatePlayerArithmetic(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): GrainShopMutationResult {
  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId) {
        return characterDefinition;
      }

      const baseSkills = characterDefinition.skills;
      if (baseSkills == null) {
        return characterDefinition;
      }

      return {
        ...characterDefinition,
        skills: {
          ...baseSkills,
          arithmetic: Math.max(0, baseSkills.arithmetic + delta),
        },
      };
    }),
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
