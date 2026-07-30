import type { CharacterDefinition } from "../domain/character";
import type { CityBeggingPlayableState } from "../domain/city-begging-minigame";
import type { CityEntryDirectoryType, CityEntryOption } from "../domain/city-entry";
import type {
  HouseMapAutoAdvanceCompletion,
  HouseMapAutoAdvanceStatusPanel,
  MapAutoAdvanceSnapshot,
} from "../domain/house-module";
import type {
  LayoutEditorState,
  UiLayoutByTargetId,
} from "../domain/ui-layout";
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
  | null;

export type AppCityCardDrawTestState = {
  sessionId: number;
  resultValue: number | null;
};

export type AutoAdvanceStatusPanel = HouseMapAutoAdvanceStatusPanel;

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
  beggingMiniGameState: CityBeggingPlayableState | null;
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
  autoAdvanceState:
    | {
        intervalId: string;
        label: string;
        targetHouseId: string;
        snapshots: MapAutoAdvanceSnapshot[] | null;
        completion: HouseMapAutoAdvanceCompletion | null;
        statusPanel?: AutoAdvanceStatusPanel | null;
      }
    | null;
  uiLayouts: UiLayoutByTargetId;
  layoutEditor: LayoutEditorState;
};
