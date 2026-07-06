import type { AppState } from "../app-shell";

export type CityViewTransitionRequest =
  | {
      type: "leave-city";
    }
  | {
      type: "enter-city-3d";
    }
  | {
      type: "leave-city-3d";
    };

export function applyCityViewTransition(
  appState: AppState,
  request: CityViewTransitionRequest
): AppState {
  if (request.type === "leave-city") {
    return {
      ...appState,
      beggingMiniGameState: null,
      cityMenuState: null,
      cityDirectoryState: null,
      locationDialogueState: null,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: null,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "map",
          overlayView: null,
          houseSession: null,
        },
      },
    };
  }

  if (request.type === "enter-city-3d") {
    return {
      ...appState,
      cityMenuState: null,
      cityDirectoryState: null,
      locationDialogueState: null,
      gameState: {
        ...appState.gameState,
        world: {
          ...appState.gameState.world,
          currentHouseId: null,
        },
        ui: {
          ...appState.gameState.ui,
          currentView: "city-3d",
          overlayView: null,
          houseSession: null,
        },
      },
    };
  }

  return {
    ...appState,
    cityMenuState: null,
    gameState: {
      ...appState.gameState,
      world: {
        ...appState.gameState.world,
        currentHouseId: null,
      },
      ui: {
        ...appState.gameState.ui,
        currentView: "city",
        overlayView: null,
        houseSession: null,
      },
    },
  };
}
