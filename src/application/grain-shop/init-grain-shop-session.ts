import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../domain/grain-shop";
import { grainShopInitialValues } from "../../content/houses/grain-shop-content";
import { getQuotedGrainPrice } from "./grain-market";
import { setGrainPrice } from "./grain-shop-mutations";

export type InitGrainShopSessionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function initGrainShopSession(
  state: GameState,
  characterDefinitions: CharacterDefinition[]
): InitGrainShopSessionResult {
  const nextVariables = { ...state.runtime.variables };
  const hasFood = typeof nextVariables[GRAIN_SHOP_VARIABLE_KEYS.food] === "number";

  if (!hasFood) {
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.food] = grainShopInitialValues.food;
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.relationship] =
      grainShopInitialValues.relationship;
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.time] = grainShopInitialValues.time;
  }

  const seededState = {
    ...state,
    runtime: {
      ...state.runtime,
      variables: nextVariables,
    },
  };
  const quotedPrice = getQuotedGrainPrice(seededState);
  const nextState = setGrainPrice(quotedPrice.state, quotedPrice.buyPrice);

  return {
    state: nextState,
    characterDefinitions,
  };
}
