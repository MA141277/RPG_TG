import type { AppState } from "../app-shell";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";
import type {
  HouseConversationPilotReason,
  HouseConversationPilotState,
} from "../../domain/house-conversation";

const HAOZHOU_CITY_ID = "city.kulan";
const EXCLUDED_HAOZHOU_HOUSE_IDS = new Set([
  "house.kulan.temple_txt_narrative",
  "home_001",
]);

function createPilotState(input: {
  enabled: boolean;
  cityId: string | null;
  houseId: string | null;
  defaultTargetCharacterId: string | null;
  reason: HouseConversationPilotReason;
}): HouseConversationPilotState {
  return {
    enabled: input.enabled,
    cityId: input.cityId,
    houseId: input.houseId,
    hideActionContainer: input.enabled,
    hideWorldIntentBar: input.enabled,
    defaultTargetCharacterId: input.defaultTargetCharacterId,
    reason: input.reason,
  };
}

function hasBlockingOwner(input: {
  appState: AppState;
  stageOutput: Extract<AppPresenterStageOutput, { type: "house" }>;
}): boolean {
  return Boolean(
    input.appState.gameState.ui.overlayView != null ||
      input.appState.modalState != null ||
      input.appState.locationDialogueState != null ||
      input.appState.beggingMiniGameState != null ||
      input.appState.gameState.runtime.activitySession != null ||
      input.stageOutput.moduleViewModel?.overlay != null
  );
}

export function selectHaozhouHouseConversationPilotState(input: {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
}): HouseConversationPilotState {
  const currentCityId = input.appState.gameState.world.currentCityId ?? null;
  const currentHouseId = input.appState.gameState.world.currentHouseId ?? null;

  if (input.stageOutput.type !== "house" || currentHouseId == null) {
    return createPilotState({
      enabled: false,
      cityId: currentCityId,
      houseId: currentHouseId,
      defaultTargetCharacterId: null,
      reason: "no-house",
    });
  }

  const stageOutput = input.stageOutput;
  const activeHouse = stageOutput.activeHouse;
  const cityId = activeHouse.cityId ?? currentCityId;
  const houseId = activeHouse.id ?? currentHouseId;

  if (cityId !== HAOZHOU_CITY_ID) {
    return createPilotState({
      enabled: false,
      cityId,
      houseId,
      defaultTargetCharacterId: activeHouse.defaultCharacterId ?? null,
      reason: "non-haozhou",
    });
  }

  if (EXCLUDED_HAOZHOU_HOUSE_IDS.has(houseId)) {
    return createPilotState({
      enabled: false,
      cityId,
      houseId,
      defaultTargetCharacterId: activeHouse.defaultCharacterId ?? null,
      reason: "excluded-house",
    });
  }

  if (
    hasBlockingOwner({
      appState: input.appState,
      stageOutput,
    })
  ) {
    return createPilotState({
      enabled: false,
      cityId,
      houseId,
      defaultTargetCharacterId: activeHouse.defaultCharacterId ?? null,
      reason: "blocking-owner",
    });
  }

  const defaultTargetCharacterId =
    activeHouse.defaultCharacterId ??
    stageOutput.moduleViewModel?.standbyRoster[0]?.characterId ??
    null;

  if (defaultTargetCharacterId == null) {
    return createPilotState({
      enabled: false,
      cityId,
      houseId,
      defaultTargetCharacterId: null,
      reason: "no-house",
    });
  }

  return createPilotState({
    enabled: true,
    cityId,
    houseId,
    defaultTargetCharacterId,
    reason: "eligible",
  });
}
