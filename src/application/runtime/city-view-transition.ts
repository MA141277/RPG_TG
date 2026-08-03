import type { AppState } from "../app-shell";
import {
  createNavigateRequest,
  runNavigationRuntime,
} from "../../core/runtime/navigation-runtime";

export type CityViewTransitionRequest =
  | {
      type: "leave-city";
    }
  | {
      type: "enter-city-3d";
    }
  | {
      type: "leave-city-3d";
    }
  | {
      type: "enter-house";
      houseId: string;
    }
  | {
      type: "leave-house";
    }
  | {
      type: "resume-house-session";
      houseId: string;
      houseSession: AppState["gameState"]["ui"]["houseSession"];
    };

export function applyCityViewTransition(
  appState: AppState,
  request: CityViewTransitionRequest
): AppState {
  if (request.type === "leave-city") {
    return {
      ...appState,
      cityMenuState: null,
      cityDirectoryState: null,
      locationDialogueState: null,
      gameState: runNavigationRuntime({
        state: appState.gameState,
        request: createNavigateRequest({ kind: "map" }),
      }).state,
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

  if (request.type === "enter-house") {
    return {
      ...appState,
      gameState: runNavigationRuntime({
        state: appState.gameState,
        request: createNavigateRequest({
          kind: "reenterBuilding",
          houseId: request.houseId,
        }),
      }).state,
    };
  }

  if (request.type === "leave-house") {
    return {
      ...appState,
      gameState: runNavigationRuntime({
        state: appState.gameState,
        request: createNavigateRequest({ kind: "leaveBuilding" }),
      }).state,
    };
  }

  if (request.type === "resume-house-session") {
    const navigationState = runNavigationRuntime({
      state: appState.gameState,
      request: createNavigateRequest({
        kind: "reenterBuilding",
        houseId: request.houseId,
      }),
    }).state;

    return {
      ...appState,
      gameState: {
        ...navigationState,
        ui: {
          ...navigationState.ui,
          houseSession: request.houseSession,
        },
      },
    };
  }

  return {
    ...appState,
    cityMenuState: null,
    gameState: runNavigationRuntime({
      state: appState.gameState,
      request: createNavigateRequest({ kind: "leaveBuilding" }),
    }).state,
  };
}
