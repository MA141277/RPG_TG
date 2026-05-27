import type { CharacterDefinition } from "../domain/character";
import type { CityEntryDirectoryType, CityEntryOption } from "../domain/city-entry";
import type { GlobalHudLayout, LayoutEditorState } from "../domain/ui-layout";
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

export type AppState = {
  gameState: ReturnType<typeof createInitialState>;
  characterDefinitions: CharacterDefinition[];
  playerCoordinate: GridCoordinate;
  modalState: AppModalState;
  cityDirectoryState:
    | {
        type: CityEntryDirectoryType;
        title: string;
        targetHouseId: string;
        options: CityEntryOption[];
      }
    | null;
  uiLayouts: {
    globalHud: GlobalHudLayout;
  };
  layoutEditor: LayoutEditorState;
};
