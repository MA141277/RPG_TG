import type {
  AppLocationDialogueState,
  AppModalState,
  AppState,
} from "../app-shell";
import type { HouseCityNpcSummary } from "../city-npcs/select-city-npcs-for-house";
import type { ActionNode, ChoiceOption, SceneDefinition } from "../../domain/action";
import type { CityDefinition } from "../../domain/city";
import type { CityEntryDefinition } from "../../domain/city-entry";
import type { CitySceneMapping } from "../../domain/city-scene-mapping";
import type { HouseDefinition } from "../../domain/house";
import type { HouseModuleViewModel } from "../../domain/house-module";
import type { HouseConversationPilotState } from "../../domain/house-conversation";
import type { TroopEditorStageViewModel } from "../troop-editor/troop-editor-stage-view-model";
import type { TroopManagementStageViewModel } from "../troop-editor/troop-management-stage-view-model";

export type AppPresenterStageOutput =
  | { type: "map"; cityDefinitions: CityDefinition[] }
  | { type: "troop-editor"; viewModel: TroopEditorStageViewModel }
  | { type: "troop-management"; viewModel: TroopManagementStageViewModel }
  | {
      type: "city";
      activeCityDefinition: CityDefinition;
      activeCityHouseDefinitions: HouseDefinition[];
      activeCityEntries: CityEntryDefinition[];
      citySceneMapping: CitySceneMapping | null;
    }
  | {
      type: "city-3d";
      activeCityDefinition: CityDefinition;
      citySceneMapping: CitySceneMapping | null;
    }
  | {
      type: "house";
      activeHouse: HouseDefinition;
      moduleViewModel: HouseModuleViewModel | null;
      cityNpcSummaries: HouseCityNpcSummary[];
      houseConversationPilotState?: HouseConversationPilotState | null;
    }
  | {
      type: "scene";
      currentSceneAction: ActionNode | null;
      currentSceneChoiceOptions: ChoiceOption[];
    }
  | { type: "battle" }
  | { type: "empty" };

export type AppPresenterOverlayOutput = {
  overlayView: AppState["gameState"]["ui"]["overlayView"];
  shouldShowGlobalHud: boolean;
  locationText: string;
  campaignTravelState: AppState["campaignTravelState"];
  modalState: AppModalState;
  locationDialogueState: AppLocationDialogueState;
  worldIntentState: AppState["worldIntentState"] | null;
};

export type AppPresenterOutput = {
  stage: AppPresenterStageOutput;
  overlay: AppPresenterOverlayOutput;
  sceneDefinitionsById?: Record<string, SceneDefinition>;
};

