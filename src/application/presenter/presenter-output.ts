import type {
  AppLocationDialogueState,
  AppModalState,
  AppState,
} from "../app-shell";
import type { CityMenuEntryViewModel } from "../city-menu/city-menu";
import type { BuildingArrangementDefinition } from "../../domain/building-arrangement";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { DialogueScreenViewModel } from "../../core/runtime/dialogue-screen-runtime";
import type {
  RuntimeDialogueChoiceOption,
  RuntimeDialogueDefinition,
  RuntimeDialogueNode,
} from "../../domain/dialogue";
import type { HouseDefinition } from "../../domain/house";

export type PresenterCityStageOutput = {
  type: "city";
  activeCityDefinition: CityDefinition;
  activeCityHouseDefinitions: HouseDefinition[];
  activeCityEntries: CityEntryDefinition[];
  activeCityMenuEntries: CityMenuEntryViewModel[];
  citySceneMapping: CitySceneMapping | null;
};

export type PresenterBuildingStageOutput = {
  type: "building";
  activeHouse: HouseDefinition;
  arrangement: BuildingArrangementDefinition;
  containerViewModels: BuildingContainerViewModel[];
};

export type AppPresenterStageOutput =
  | { type: "map" }
  | PresenterCityStageOutput
  | {
      type: "city-3d";
      activeCityDefinition: CityDefinition;
      citySceneMapping: CitySceneMapping | null;
    }
  | PresenterBuildingStageOutput
  | {
      type: "dialogue";
      legacyDialogueNode: RuntimeDialogueNode | null;
      legacyDialogueChoiceOptions: RuntimeDialogueChoiceOption[];
      dialogueScreenViewModel: DialogueScreenViewModel | null;
      cityUnderlay?: Omit<PresenterCityStageOutput, "type">;
      buildingUnderlay?: Omit<PresenterBuildingStageOutput, "type">;
    }
  | { type: "battle" }
  | { type: "empty" };

export type BuildingContainerViewModel =
  | {
      id: string;
      type: "character-seats";
      title?: string | undefined;
      characters: Array<{
        id: string;
        name: string;
        title?: string | undefined;
      }>;
    }
  | {
      id: string;
      type: "action-menu";
      title?: string | undefined;
      actions: Array<{
        id: string;
        label: string;
        eventId: string;
        isVisible: boolean;
        isEnabled: boolean;
        disabledHint?: string | undefined;
      }>;
    }
  | {
      id: string;
      type: "status-panel" | "text-panel" | "image-panel" | "resource-panel";
      title?: string | undefined;
    };

export type AppPresenterOverlayOutput = {
  overlayView: AppState["gameState"]["ui"]["overlayView"];
  shouldShowGlobalHud: boolean;
  locationText: string;
  campaignTravelState: AppState["campaignTravelState"];
  modalState: AppModalState;
  locationDialogueState: AppLocationDialogueState;
};

export type AppPresenterOutput = {
  stage: AppPresenterStageOutput;
  overlay: AppPresenterOverlayOutput;
  dialogueDefinitionsById?: Record<string, RuntimeDialogueDefinition>;
};
