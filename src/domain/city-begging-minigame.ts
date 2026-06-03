import type { CityBeggingGranaryEscortState } from "./minigames/city-begging-granary-escort";
import type { CityBeggingVillageState } from "./minigames/city-begging-village-catching";

export type CityBeggingGameCompletionResult = {
  foodGain: number;
  maxCombo: number;
  success: true;
};

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
