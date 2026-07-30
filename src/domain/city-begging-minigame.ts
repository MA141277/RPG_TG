import type { CityBeggingGranaryEscortState } from "./minigames/city-begging-granary-escort";
import type { CityBeggingVillageState } from "./minigames/city-begging-village-catching";

export type CityBeggingGameCompletionResult = {
  foodGain: number;
  goldGain: number;
  maxCombo: number;
  success: true;
};

export const CITY_BEGGING_RUNTIME_KEYS = {
  completionCount: "var.city_begging.completion_count",
  lastFoodGain: "var.city_begging.last_food_gain",
  lastGoldGain: "var.city_begging.last_gold_gain",
  lastMaxCombo: "var.city_begging.last_max_combo",
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

export type CityBeggingDefaultDialogueRuntimeState = {
  mode: "default-dialogue";
  phase:
    | "location-select"
    | "location-options-thinking"
    | "location-options"
    | "encounter"
    | "option-select-thinking"
    | "option-select"
    | "fortune-draw"
    | "thinking"
    | "outcome"
    | "completed";
  selectedLocationId: string | null;
  selectedOptionId: string | null;
  fixedResult: "ji" | "xiong" | "ping" | null;
  thinkingUntil: number | null;
  settlementApplied: boolean;
  visitedLocationIds: string[];
};

export type CityBeggingPlayableState =
  | CityBeggingMiniGameState
  | CityBeggingDefaultDialogueRuntimeState;
