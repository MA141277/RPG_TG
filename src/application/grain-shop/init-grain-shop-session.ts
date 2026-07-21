import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../domain/grain-shop";
import { getGrainShopContentDefaults } from "./grain-shop-content-defaults";
import { getQuotedGrainPrice } from "./grain-market";
import { setGrainPrice } from "./grain-shop-mutations";
import { ensurePlayerGrainInventory } from "../inventory/trade-inventory";

export type InitGrainShopSessionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function initGrainShopSession(
  state: GameState,
  characterDefinitions: CharacterDefinition[]
): InitGrainShopSessionResult {
  const { grainShopInitialValues } = getGrainShopContentDefaults();
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
  const inventorySyncedState = ensurePlayerGrainInventory(seededState);
  const quotedPrice = getQuotedGrainPrice(inventorySyncedState);
  const nextState = setGrainPrice(quotedPrice.state, quotedPrice.buyPrice);

  return {
    state: nextState,
    characterDefinitions,
  };
}
