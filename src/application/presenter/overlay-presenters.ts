import type { AppState } from "../app-shell";
import type { CityDefinition } from "../../domain/city";
import type { AppPresenterOverlayOutput } from "./presenter-output";

export type OverlayPresenterInput = {
  appState: AppState;
  cityDefinition: CityDefinition;
  cityNameById: Record<string, string>;
};

export function createOverlayPresenterOutput(
  input: OverlayPresenterInput
): AppPresenterOverlayOutput {
  const isSceneActive =
    input.appState.gameState.ui.currentView === "scene" ||
    input.appState.gameState.scene.activeSceneId != null;
  const isBeggingMiniGameActive =
    input.appState.beggingMiniGameState != null &&
    "variantId" in input.appState.beggingMiniGameState;
  const shouldShowGlobalHud =
    input.appState.gameState.ui.currentView !== "troop-editor" &&
    input.appState.gameState.ui.currentView !== "troop-management" &&
    input.appState.gameState.ui.currentView !== "battle" &&
    !isSceneActive &&
    !isBeggingMiniGameActive;
  const locationText =
    input.cityNameById[input.appState.gameState.world.currentCityId] ??
    input.cityDefinition.name;

  return {
    overlayView: input.appState.gameState.ui.overlayView,
    shouldShowGlobalHud,
    locationText,
    campaignTravelState: input.appState.campaignTravelState,
    modalState: input.appState.modalState,
    locationDialogueState: input.appState.locationDialogueState,
  };
}

