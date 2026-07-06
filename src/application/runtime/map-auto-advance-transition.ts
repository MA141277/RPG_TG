import type { AppState } from "../app-shell";

export function applyMapAutoAdvanceStart(
  appState: AppState,
  input: {
    intervalId: string;
    label: string;
    targetHouseId: string;
    snapshots?: NonNullable<AppState["autoAdvanceState"]>["snapshots"];
    completion?: NonNullable<AppState["autoAdvanceState"]>["completion"];
  }
): AppState {
  return {
    ...appState,
    modalState: null,
    locationDialogueState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    campaignTravelState: null,
    autoAdvanceState: {
      intervalId: input.intervalId,
      label: input.label,
      targetHouseId: input.targetHouseId,
      snapshots: input.snapshots ?? null,
      completion: input.completion ?? null,
    },
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

export function applyMapAutoAdvanceSnapshot(
  appState: AppState,
  input: {
    autoAdvanceState: NonNullable<AppState["autoAdvanceState"]>;
    nextSnapshot: NonNullable<NonNullable<AppState["autoAdvanceState"]>["snapshots"]>[number];
    remainingSnapshots: NonNullable<AppState["autoAdvanceState"]>["snapshots"];
  }
): AppState {
  return {
    ...appState,
    characterDefinitions: input.nextSnapshot.characterDefinitions,
    autoAdvanceState: {
      ...input.autoAdvanceState,
      snapshots: input.remainingSnapshots,
    },
    gameState: {
      ...input.nextSnapshot.gameState,
      world: {
        ...input.nextSnapshot.gameState.world,
        currentHouseId: null,
      },
      ui: {
        ...input.nextSnapshot.gameState.ui,
        currentView: "map",
        overlayView: null,
        houseSession: null,
      },
    },
  };
}
