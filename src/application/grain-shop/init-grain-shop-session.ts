import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { GRAIN_SHOP_VARIABLE_KEYS } from "../../domain/grain-shop";
import { grainShopInitialValues } from "../../content/houses/grain-shop-content";
import {
  ensurePlayerGrainInventory,
  PLAYER_GRAIN_RUNTIME_KEYS,
  setPlayerGrainDou,
} from "../inventory/trade-inventory";
import { convertShiToDou } from "../../domain/grain-unit";
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
  const hasLegacyFood = typeof nextVariables[GRAIN_SHOP_VARIABLE_KEYS.food] === "number";
  const hasInventoryFood =
    typeof nextVariables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou] === "number";

  if (!hasLegacyFood && !hasInventoryFood) {
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.relationship] =
      grainShopInitialValues.relationship;
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.time] = grainShopInitialValues.time;
  }

  if (typeof nextVariables[GRAIN_SHOP_VARIABLE_KEYS.relationship] !== "number") {
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.relationship] =
      grainShopInitialValues.relationship;
  }

  if (typeof nextVariables[GRAIN_SHOP_VARIABLE_KEYS.time] !== "number") {
    nextVariables[GRAIN_SHOP_VARIABLE_KEYS.time] = grainShopInitialValues.time;
  }

  let seededState: GameState = {
    ...state,
    runtime: {
      ...state.runtime,
      variables: nextVariables,
    },
  };
  if (!hasLegacyFood && !hasInventoryFood) {
    seededState = setPlayerGrainDou(
      seededState,
      convertShiToDou(grainShopInitialValues.food)
    );
  }

  seededState = ensurePlayerGrainInventory(seededState);
  const quotedPrice = getQuotedGrainPrice(seededState);
  const nextState = setGrainPrice(quotedPrice.state, quotedPrice.buyPrice);

  return {
    state: nextState,
    characterDefinitions,
  };
}
