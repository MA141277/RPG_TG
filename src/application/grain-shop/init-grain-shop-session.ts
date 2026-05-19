import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  GRAIN_PRICE_MAX,
  GRAIN_PRICE_MIN,
  GRAIN_SHOP_VARIABLE_KEYS,
} from "../../domain/grain-shop";
import { grainShopInitialValues } from "../../content/houses/grain-shop-content";
import { randomInt } from "../../shared/random";

export type InitGrainShopSessionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function initGrainShopSession(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string
): InitGrainShopSessionResult {
  const nextVariables = { ...state.runtime.variables };
  const hasFood = typeof nextVariables[GRAIN_SHOP_VARIABLE_KEYS.food] === "number";

  if (!hasFood) {
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.food] = grainShopInitialValues.food;
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.relationship] =
      grainShopInitialValues.relationship;
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.time] = grainShopInitialValues.time;
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.grainPrice] = randomInt(
      GRAIN_PRICE_MIN,
      GRAIN_PRICE_MAX
    );
  }

  const nextCharacterDefinitions = characterDefinitions.map((characterDefinition) => {
    if (characterDefinition.id !== playerCharacterId) {
      return characterDefinition;
    }

    const baseSkills = characterDefinition.skills;
    if (baseSkills == null) {
      return {
        ...characterDefinition,
        stats: {
          ...characterDefinition.stats,
          gold: grainShopInitialValues.money,
        },
      };
    }

    return {
      ...characterDefinition,
      stats: {
        ...characterDefinition.stats,
        gold: grainShopInitialValues.money,
      },
      skills: {
        ...baseSkills,
        arithmetic: grainShopInitialValues.math,
      },
    };
  });

  return {
    state: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: nextVariables,
      },
    },
    characterDefinitions: nextCharacterDefinitions,
  };
}
