import type { AppState } from "../app-shell";
import type { GridCoordinate } from "../navigation/travel-to-coordinate";
import type { CityDefinition } from "../../domain/city";
import { travelToCoordinate } from "../navigation/travel-to-coordinate";
import {
  applyCampaignTravelCompletion,
  applyCampaignTravelStart,
} from "./campaign-travel-transition";

export type CampaignTravelCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  clearHouseIntervals(): void;
  resolveCityDefinition(cityId: string | null): CityDefinition | null;
  commitAdvanceTimeAfterTravel(appState: AppState): AppState;
  commitEnterCity(appState: AppState, cityId: string): AppState;
  animateCampaignMove(
    from: GridCoordinate,
    to: GridCoordinate
  ): Promise<void>;
  stopCampaignMoveAnimation(): void;
  hasActiveCampaignMoveAnimation(): boolean;
};

export function createCampaignTravelCoordinator(
  dependencies: CampaignTravelCoordinatorDependencies
) {
  let campaignTravelRequestId = 0;

  function setAppState(appState: AppState): void {
    dependencies.setAppState(appState);
  }

  function renderApp(): void {
    dependencies.renderApp();
  }

  function handleModalConfirm(): void {
    const appState = dependencies.getAppState();
    if (appState.modalState == null) {
      return;
    }

    if (appState.modalState.type === "travel-confirm") {
      const nextCoordinate = travelToCoordinate(
        appState.playerCoordinate,
        appState.modalState.targetCoordinate
      );
      const reachedCityDefinition = dependencies.resolveCityDefinition(
        appState.modalState.cityId
      );
      const pendingEnterCityState =
        reachedCityDefinition != null
          ? {
              type: "enter-city-confirm" as const,
              cityId: reachedCityDefinition.id,
              cityName: reachedCityDefinition.name,
            }
          : null;

      const previousCoordinate = appState.playerCoordinate;
      setAppState({
        ...appState,
        campaignTravelState: {
          targetCoordinate: appState.modalState.targetCoordinate,
          cityId: appState.modalState.cityId,
          cityName: appState.modalState.cityName,
        },
        modalState: null,
        locationDialogueState: null,
      });
      renderApp();

      void dependencies
        .animateCampaignMove(previousCoordinate, nextCoordinate)
        .then(() => {
          const currentAppState = dependencies.getAppState();
          const shouldEnterCity =
            currentAppState.campaignTravelState != null &&
            currentAppState.campaignTravelState.targetCoordinate.x ===
              nextCoordinate.x &&
            currentAppState.campaignTravelState.targetCoordinate.y ===
              nextCoordinate.y;
          const nextAppState = {
            ...currentAppState,
            campaignTravelState: null,
            modalState: shouldEnterCity ? pendingEnterCityState : null,
            locationDialogueState: null,
          };
          setAppState(
            dependencies.commitAdvanceTimeAfterTravel(nextAppState)
          );
          renderApp();
        });
      return;
    }

    dependencies.clearHouseIntervals();
    const clearedModalState = {
      ...appState,
      modalState: null,
      locationDialogueState: null,
    };
    setAppState(
      dependencies.commitEnterCity(clearedModalState, appState.modalState.cityId)
    );
    renderApp();
  }

  function cancelCampaignTravel(): void {
    const appState = dependencies.getAppState();
    if (
      !dependencies.hasActiveCampaignMoveAnimation() &&
      appState.campaignTravelState == null
    ) {
      return;
    }

    campaignTravelRequestId += 1;
    dependencies.stopCampaignMoveAnimation();
    setAppState({
      ...appState,
      campaignTravelState: null,
      modalState: null,
      locationDialogueState: null,
      campaignActorState: {
        ...appState.campaignActorState,
        isMoving: false,
      },
    });
    renderApp();
  }

  function startCampaignTravel(input: {
    targetCoordinate: GridCoordinate;
    cityId: string | null;
    cityName: string | null;
  }): void {
    const appState = dependencies.getAppState();
    const nextCoordinate = travelToCoordinate(
      appState.playerCoordinate,
      input.targetCoordinate
    );
    const reachedCityDefinition = dependencies.resolveCityDefinition(input.cityId);
    const pendingEnterCityState =
      reachedCityDefinition != null
        ? {
            type: "enter-city-confirm" as const,
            cityId: reachedCityDefinition.id,
            cityName: reachedCityDefinition.name,
          }
        : null;
    const previousCoordinate = appState.playerCoordinate;
    const travelRequestId = campaignTravelRequestId + 1;
    campaignTravelRequestId = travelRequestId;
    dependencies.stopCampaignMoveAnimation();

    setAppState(
      applyCampaignTravelStart(appState, {
        targetCoordinate: nextCoordinate,
        cityId: input.cityId,
        cityName: input.cityName,
      })
    );
    renderApp();

    void dependencies
      .animateCampaignMove(previousCoordinate, nextCoordinate)
      .then(() => {
        if (campaignTravelRequestId !== travelRequestId) {
          return;
        }

        const nextAppState = applyCampaignTravelCompletion(
          dependencies.getAppState(),
          {
            targetCoordinate: nextCoordinate,
            pendingEnterCityState,
          }
        );
        setAppState(
          dependencies.commitAdvanceTimeAfterTravel(nextAppState)
        );
        renderApp();
      });
  }

  return {
    handleModalConfirm,
    cancelCampaignTravel,
    startCampaignTravel,
  };
}
