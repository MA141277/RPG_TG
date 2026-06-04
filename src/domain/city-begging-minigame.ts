import type { CityBeggingGranaryEscortState } from "./minigames/city-begging-granary-escort";
import type { CityBeggingVillageState } from "./minigames/city-begging-village-catching";

export type CityBeggingGameCompletionResult = {
  foodGain: number;
  goldGain: number;
  maxCombo: number;
  success: true;
};

export const CITY_BEGGING_RUNTIME_KEYS = {
  completionCount: "var.minigame.city_begging.completion_count",
  lastFoodGain: "var.minigame.city_begging.last_food_gain",
  lastGoldGain: "var.minigame.city_begging.last_gold_gain",
  lastMaxCombo: "var.minigame.city_begging.last_max_combo",
} as const;

export type CityBeggingMiniGameVariantId =
  | "village-catching"
  | "granary-escort";

export type CityBeggingMiniGameState =
  | {
      variantId: "village-catching";
      variantState: CityBeggingVillageState;
    }
  | {
      variantId: "granary-escort";
      variantState: CityBeggingGranaryEscortState;
    };
