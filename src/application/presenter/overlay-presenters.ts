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
  const isDialogueActive =
    input.appState.gameState.ui.currentView === "dialogue" ||
    input.appState.gameState.dialogue.activeDialogueId != null;
  const isBeggingMiniGameActive =
    input.appState.gameState.runtime.playableSession?.playableId === "city-begging";
  const shouldShowGlobalHud =
    input.appState.gameState.ui.currentView !== "house" &&
    input.appState.gameState.ui.currentView !== "battle" &&
    !isDialogueActive &&
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
