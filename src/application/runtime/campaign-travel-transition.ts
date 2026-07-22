import type { AppState } from "../app-shell";
import type { GridCoordinate } from "../navigation/travel-to-coordinate";

export function applyCampaignTravelStart(
  appState: AppState,
  input: {
    targetCoordinate: GridCoordinate;
    cityId: string | null;
    cityName: string | null;
  }
): AppState {
  return {
    ...appState,
    campaignTravelState: {
      targetCoordinate: input.targetCoordinate,
      cityId: input.cityId,
      cityName: input.cityName,
    },
    modalState: null,
    locationDialogueState: null,
  };
}

export function applyCampaignTravelCompletion(
  appState: AppState,
  input: {
    targetCoordinate: GridCoordinate;
    pendingEnterCityState: Extract<
      NonNullable<AppState["modalState"]>,
      { type: "enter-city-confirm" }
    > | null;
  }
): AppState {
  const activeTravelState = appState.campaignTravelState;
  const shouldEnterCity =
    activeTravelState != null &&
    activeTravelState.targetCoordinate.x === input.targetCoordinate.x &&
    activeTravelState.targetCoordinate.y === input.targetCoordinate.y;

  return {
    ...appState,
    campaignTravelState: null,
    modalState: shouldEnterCity ? input.pendingEnterCityState : null,
    locationDialogueState: null,
  };
}
