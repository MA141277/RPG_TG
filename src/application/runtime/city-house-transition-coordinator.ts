import type { AppState } from "../app-shell";
import { applyCityViewTransition } from "./city-view-transition";

type HouseAccessRefusal = {
  speakerCharacterId: string;
  text: string;
  confirmLabel: string;
};

export type CityHouseTransitionCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  clearHouseIntervals(): void;
  stopCityBeggingMiniGameLoop(): void;
  canEnterCity3d(): boolean;
};

export function createCityHouseTransitionCoordinator(
  dependencies: CityHouseTransitionCoordinatorDependencies
) {
  function leaveCity(): void {
    dependencies.clearHouseIntervals();
    dependencies.stopCityBeggingMiniGameLoop();
    dependencies.setAppState(
      applyCityViewTransition(dependencies.getAppState(), {
        type: "leave-city",
      })
    );
    dependencies.renderApp();
  }

  function enterCity3d(): boolean {
    if (!dependencies.canEnterCity3d()) {
      return false;
    }

    dependencies.clearHouseIntervals();
    dependencies.setAppState(
      applyCityViewTransition(dependencies.getAppState(), {
        type: "enter-city-3d",
      })
    );
    dependencies.renderApp();
    return true;
  }

  function leaveCity3d(): void {
    dependencies.setAppState(
      applyCityViewTransition(dependencies.getAppState(), {
        type: "leave-city-3d",
      })
    );
    dependencies.renderApp();
  }

  function handleHouseAccessRefusal(
    refusal: HouseAccessRefusal | null | undefined
  ): boolean {
    if (refusal == null) {
      return false;
    }

    dependencies.setAppState({
      ...dependencies.getAppState(),
      locationDialogueState: {
        type: "house-access-refusal",
        speakerCharacterId: refusal.speakerCharacterId,
        textLines: [refusal.text],
        advanceHintText: refusal.confirmLabel,
      },
    });
    dependencies.renderApp();
    return true;
  }

  return {
    leaveCity,
    enterCity3d,
    leaveCity3d,
    handleHouseAccessRefusal,
  };
}
