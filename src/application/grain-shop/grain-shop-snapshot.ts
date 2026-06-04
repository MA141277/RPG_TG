import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  GRAIN_SHOP_VARIABLE_KEYS,
  type GrainShopPlayerSnapshot,
} from "../../domain/grain-shop";
import { grainShopInitialValues } from "../../content/houses/grain-shop-content";
import { convertDouToWholeShi } from "../../domain/grain-unit";
import { readPlayerGrainDou } from "../inventory/trade-inventory";

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
  const foodDou = readPlayerGrainDou(state);

  return {
    money: playerCharacter.stats.gold,
    foodDou,
    sellableFoodShi: convertDouToWholeShi(foodDou),
    math: playerCharacter.skills?.arithmetic ?? 0,
    relationship: readNumericVariable(
      state,
      GRAIN_SHOP_VARIABLE_KEYS.relationship,
      grainShopInitialValues.relationship
    ),
    time: readNumericVariable(
      state,
      GRAIN_SHOP_VARIABLE_KEYS.time,
      grainShopInitialValues.time
    ),
    grainPrice: readNumericVariable(
      state,
      GRAIN_SHOP_VARIABLE_KEYS.grainPrice,
      100
    ),
  };
}
