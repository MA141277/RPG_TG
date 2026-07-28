import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  GRAIN_SHOP_VARIABLE_KEYS,
  type GrainShopPlayerSnapshot,
} from "../../domain/grain-shop";
import { convertDouToWholeShi } from "../../domain/grain-unit";
import { getGrainShopContentDefaults } from "./grain-shop-content-defaults";
import {
  ensurePlayerGrainInventory,
  readPlayerGrainDou,
} from "../inventory/trade-inventory";
import { readNumericPersonAttributeBySemanticKey } from "../character/person-attribute-runtime";

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function createGrainShopSnapshot(
  state: GameState,
  playerCharacter: CharacterDefinition
): GrainShopPlayerSnapshot {
  const { grainShopInitialValues } = getGrainShopContentDefaults();
  const syncedState = ensurePlayerGrainInventory(state);
  const foodDou = readPlayerGrainDou(syncedState);
  const sellableFoodShi = convertDouToWholeShi(foodDou);

  return {
    money: readNumericPersonAttributeBySemanticKey(playerCharacter, "gold"),
    food: sellableFoodShi,
    foodDou,
    sellableFoodShi,
    math: readNumericPersonAttributeBySemanticKey(playerCharacter, "arithmetic"),
    relationship: readNumericVariable(
      syncedState,
      GRAIN_SHOP_VARIABLE_KEYS.relationship,
      grainShopInitialValues.relationship
    ),
    time: readNumericVariable(
      syncedState,
      GRAIN_SHOP_VARIABLE_KEYS.time,
      grainShopInitialValues.time
    ),
    grainPrice: readNumericVariable(
      syncedState,
      GRAIN_SHOP_VARIABLE_KEYS.grainPrice,
      100
    ),
  };
}
