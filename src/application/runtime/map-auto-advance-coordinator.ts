import type { AppState } from "../app-shell";
import {
  applyMapAutoAdvanceSnapshot,
  applyMapAutoAdvanceStart,
} from "./map-auto-advance-transition";

export type MapAutoAdvanceCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  cancelCampaignTravel(): void;
  clearHouseIntervals(): void;
  applyMapAutoAdvanceCompletion(
    completion: NonNullable<NonNullable<AppState["autoAdvanceState"]>["completion"]>
  ): void;
  commitDayStart(appState: AppState): AppState;
  shouldApplyCompletionAfterDayStart(input: {
    previousAppState: AppState;
    nextAppState: AppState;
    autoAdvanceState: NonNullable<AppState["autoAdvanceState"]>;
  }): boolean;
  setInterval(callback: () => void, everyMs: number): number;
  clearInterval(handle: number): void;
};

export function createMapAutoAdvanceCoordinator(
  dependencies: MapAutoAdvanceCoordinatorDependencies
) {
  const handles: Record<string, number> = {};

  function stopMapAutoAdvance(intervalId: string): void {
    const handle = handles[intervalId];
    if (handle != null) {
      dependencies.clearInterval(handle);
      delete handles[intervalId];
    }

    const appState = dependencies.getAppState();
    if (appState.autoAdvanceState?.intervalId === intervalId) {
      dependencies.setAppState({
        ...appState,
        autoAdvanceState: null,
      });
    }
  }

  function startMapAutoAdvance(input: {
    intervalId: string;
    everyMs: number;
    targetHouseId: string;
    label: string;
    snapshots?: NonNullable<AppState["autoAdvanceState"]>["snapshots"];
    completion?: NonNullable<AppState["autoAdvanceState"]>["completion"];
  }): void {
    stopMapAutoAdvance(input.intervalId);
    if (
      input.snapshots != null &&
      input.snapshots.length === 0 &&
      input.completion != null
    ) {
      dependencies.applyMapAutoAdvanceCompletion(input.completion);
      return;
    }

    dependencies.cancelCampaignTravel();
    dependencies.clearHouseIntervals();
    dependencies.setAppState(applyMapAutoAdvanceStart(dependencies.getAppState(), input));
    dependencies.renderApp();

    handles[input.intervalId] = dependencies.setInterval(() => {
      tickMapAutoAdvance(input.intervalId);
    }, input.everyMs);
  }

  function tickMapAutoAdvance(intervalId: string): void {
    const appState = dependencies.getAppState();
    const autoAdvanceState = appState.autoAdvanceState;
    if (autoAdvanceState == null || autoAdvanceState.intervalId !== intervalId) {
      stopMapAutoAdvance(intervalId);
      return;
    }

    if (autoAdvanceState.snapshots != null) {
      const [nextSnapshot, ...remainingSnapshots] = autoAdvanceState.snapshots;
      if (nextSnapshot == null) {
        stopMapAutoAdvance(intervalId);
        if (autoAdvanceState.completion != null) {
          dependencies.applyMapAutoAdvanceCompletion(autoAdvanceState.completion);
          return;
        }
        dependencies.renderApp();
        return;
      }

      dependencies.setAppState(
        applyMapAutoAdvanceSnapshot(appState, {
          autoAdvanceState,
          nextSnapshot,
          remainingSnapshots,
        })
      );

      if (remainingSnapshots.length === 0) {
        stopMapAutoAdvance(intervalId);
        if (autoAdvanceState.completion != null) {
          dependencies.applyMapAutoAdvanceCompletion(autoAdvanceState.completion);
          return;
        }
      }

      dependencies.renderApp();
      return;
    }

    const nextAppState = dependencies.commitDayStart(appState);
    dependencies.setAppState(nextAppState);
    if (
      autoAdvanceState.completion != null &&
      dependencies.shouldApplyCompletionAfterDayStart({
        previousAppState: appState,
        nextAppState,
        autoAdvanceState,
      })
    ) {
      stopMapAutoAdvance(intervalId);
      dependencies.applyMapAutoAdvanceCompletion(autoAdvanceState.completion);
      return;
    }

    if (dependencies.getAppState().autoAdvanceState == null) {
      stopMapAutoAdvance(intervalId);
    }
    dependencies.renderApp();
  }

  return {
    startMapAutoAdvance,
    stopMapAutoAdvance,
  };
}
