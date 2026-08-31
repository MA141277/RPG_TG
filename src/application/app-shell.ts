import type { CharacterDefinition } from "../domain/character";
import type { CityBeggingMiniGameState } from "../domain/city-begging-minigame";
import type { CityEntryDirectoryType, CityEntryOption } from "../domain/city-entry";
import type {
  HouseMapAutoAdvanceCompletion,
  MapAutoAdvanceSnapshot,
} from "../domain/house-module";
import type {
  LayoutEditorState,
  UiLayoutByTargetId,
} from "../domain/ui-layout";
import type { WorldAiIntentResponse } from "../domain/world-intent";
import type { HouseConversationPilotState } from "../domain/house-conversation";
import type { CityMenuState } from "./city-menu/city-menu";
import type { GridCoordinate } from "./navigation/travel-to-coordinate";
import type { createInitialState } from "./state/create-initial-state";

export type AppModalState =
  | {
      type: "travel-confirm";
      targetCoordinate: GridCoordinate;
      cityId: string | null;
      cityName: string | null;
    }
  | {
      type: "enter-city-confirm";
      cityId: string;
      cityName: string;
    }
  | null;

export type AppLocationDialogueState =
  | {
      type: "house-access-refusal";
      speakerCharacterId: string;
      textLines: string[];
      advanceHintText: string;
    }
  | {
      type: "council-arrival-reminder";
      speakerCharacterId: string;
      textLines: string[];
      advanceHintText: string;
      targetHouseId: string;
    }
  | {
      type: "world-intent-feedback";
      speakerCharacterId: string;
      textLines: string[];
      advanceHintText: string;
      intentStatus: "narration" | "clarify" | "refusal";
    }
  | null;

export type AppWorldIntentState = {
  draftText: string;
  status: "idle" | "classifying" | "awaiting-follow-up" | "error";
  currentRequestId: string | null;
  pendingResolution: {
    requestId: string;
    result: WorldAiIntentResponse;
  } | null;
  lastError: string | null;
};

export function createInitialAppWorldIntentState(): AppWorldIntentState {
  return {
    draftText: "",
    status: "idle",
    currentRequestId: null,
    pendingResolution: null,
    lastError: null,
  };
}

export type AppCityCardDrawTestState = {
  sessionId: number;
  resultValue: number | null;
};

export type AppState = {
  gameState: ReturnType<typeof createInitialState>;
  characterDefinitions: CharacterDefinition[];
  playerCoordinate: GridCoordinate;
  campaignActorState: {
    facingDegrees: number;
    isMoving: boolean;
  };
  campaignTravelState:
    | {
        targetCoordinate: GridCoordinate;
        cityId: string | null;
        cityName: string | null;
      }
    | null;
  modalState: AppModalState;
  locationDialogueState: AppLocationDialogueState;
  beggingMiniGameState: CityBeggingMiniGameState | null;
  cityCardDrawTestState: AppCityCardDrawTestState | null;
  cityMenuState: CityMenuState | null;
  cityDirectoryState:
    | {
        type: CityEntryDirectoryType;
        title: string;
        targetHouseId: string;
        options: CityEntryOption[];
      }
    | null;
  worldIntentState?: AppWorldIntentState;
  houseConversationPilotState?: HouseConversationPilotState;
  autoAdvanceState:
    | {
        intervalId: string;
        label: string;
        targetHouseId: string;
        snapshots: MapAutoAdvanceSnapshot[] | null;
        completion: HouseMapAutoAdvanceCompletion | null;
      }
    | null;
  uiLayouts: UiLayoutByTargetId;
  layoutEditor: LayoutEditorState;
};
