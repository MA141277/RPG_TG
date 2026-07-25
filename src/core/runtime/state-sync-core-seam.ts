import type {
  AppStateBridge,
  CanonicalRuntimeState,
  PresentationInput,
  SaveState,
} from "../contracts/state-sync-runtime";
import type { RuntimeState as LegacyBridgeRuntimeState } from "../contracts/runtime-state";
import {
  mergeCharacterStatusMaps,
  type CharacterStatusById,
} from "../../domain/character-status";
import {
  mergeBuildingStatusMaps,
  type BuildingStatusById,
} from "../../domain/building-status";
import {
  mergeCityStatusMaps,
  type CityStatusById,
} from "../../domain/city-status";
import { syncAppState as rebuildAppStateBridge } from "./state-sync-app-bridge";
import { hydrateFromSave as hydrateCanonicalRuntimeState } from "./state-sync-hydration";
import { normalizeRuntimeState } from "./state-sync-normalization";
import { preparePresentationInput } from "./state-sync-presentation";
import { prepareSaveState } from "./state-sync-save";

export type RuntimeAppStateInput = {
  gameState: LegacyBridgeRuntimeState["core"];
  beggingMiniGameState: LegacyBridgeRuntimeState["app"]["beggingMiniGameState"];
  autoAdvanceState: LegacyBridgeRuntimeState["app"]["autoAdvanceState"];
  campaignTravelState: LegacyBridgeRuntimeState["app"]["campaignTravelState"];
  cityDirectoryState: LegacyBridgeRuntimeState["app"]["cityDirectoryState"];
  cityMenuState: LegacyBridgeRuntimeState["app"]["cityMenuState"];
  locationDialogueState: LegacyBridgeRuntimeState["app"]["locationDialogueState"];
  modalState: LegacyBridgeRuntimeState["app"]["modalState"];
  characterDefinitions?: unknown;
  characterStatusById?: CharacterStatusById;
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
};

function createRuntimeStateFromAppState(
  state: RuntimeAppStateInput
): LegacyBridgeRuntimeState {
  return {
    core: state.gameState,
    app: {
      beggingMiniGameState: state.beggingMiniGameState,
      autoAdvanceState: state.autoAdvanceState,
      campaignTravelState: state.campaignTravelState,
      cityDirectoryState: state.cityDirectoryState,
      cityMenuState: state.cityMenuState,
      locationDialogueState: state.locationDialogueState,
      modalState: state.modalState,
    },
    view: {},
  };
}

function applyRuntimeStateToAppState<TAppState extends RuntimeAppStateInput>(
  state: TAppState,
  runtimeState: LegacyBridgeRuntimeState,
  characterDefinitions?: unknown,
  characterStatusPatchById?: CharacterStatusById,
  cityStatusPatchById?: CityStatusById,
  buildingStatusPatchById?: BuildingStatusById
): TAppState {
  const characterStatusById =
    characterStatusPatchById == null
      ? state.characterStatusById
      : mergeCharacterStatusMaps(
          state.characterStatusById ?? {},
          characterStatusPatchById
        );
  const cityStatusById =
    cityStatusPatchById == null
      ? state.cityStatusById
      : mergeCityStatusMaps(state.cityStatusById ?? {}, cityStatusPatchById);
  const buildingStatusById =
    buildingStatusPatchById == null
      ? state.buildingStatusById
      : mergeBuildingStatusMaps(
          state.buildingStatusById ?? {},
          buildingStatusPatchById
        );

  return {
    ...state,
    gameState: runtimeState.core,
    beggingMiniGameState: runtimeState.app.beggingMiniGameState,
    autoAdvanceState: runtimeState.app.autoAdvanceState,
    campaignTravelState: runtimeState.app.campaignTravelState,
    cityDirectoryState: runtimeState.app.cityDirectoryState,
    cityMenuState: runtimeState.app.cityMenuState,
    locationDialogueState: runtimeState.app.locationDialogueState,
    modalState: runtimeState.app.modalState,
    ...(characterDefinitions == null
      ? {}
      : { characterDefinitions }),
    ...(characterStatusById == null
      ? {}
      : { characterStatusById }),
    ...(cityStatusById == null ? {} : { cityStatusById }),
    ...(buildingStatusById == null ? {} : { buildingStatusById }),
  } as TAppState;
}

function syncAppState(
  runtimeState: CanonicalRuntimeState,
  appState: AppStateBridge | undefined
): AppStateBridge {
  return rebuildAppStateBridge(runtimeState, appState);
}

function hydrateRuntimeState(
  saveState: SaveState | undefined
): CanonicalRuntimeState {
  const hydrated = hydrateCanonicalRuntimeState(saveState);
  if (hydrated == null) {
    throw new Error("StateSync Runtime requires canonical save state input.");
  }
  return hydrated;
}

function createPresentationInput(
  runtimeState: CanonicalRuntimeState,
  appState: AppStateBridge
): PresentationInput {
  return preparePresentationInput(runtimeState, appState);
}

function createSaveState(
  runtimeState: CanonicalRuntimeState,
  saveState: SaveState | undefined
): SaveState {
  return prepareSaveState(runtimeState, saveState);
}

export const stateSyncCoreSeam = {
  createRuntimeStateFromAppState,
  applyRuntimeStateToAppState,
  syncAppState,
  hydrateRuntimeState,
  normalizeRuntimeState,
  createPresentationInput,
  createSaveState,
};
