import type { AppState } from "../app-shell";
import type { AppPresenterStageOutput } from "./presenter-output";
import type { HouseConversationPilotState } from "../../domain/house-conversation";
import type { HouseModuleViewModel } from "../../domain/house-module";
import { selectHaozhouHouseConversationPilotState } from "../house-conversation/haozhou-house-conversation-policy";

export type HouseConversationViewState = HouseConversationPilotState & {
  renderInlineNpcDialogue: boolean;
};

export function selectHouseConversationViewState(input: {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
}): HouseConversationViewState {
  const pilotState = selectHaozhouHouseConversationPilotState(input);
  const npcInteractionSession = input.appState.gameState.ui.npcInteractionSession;
  const renderInlineNpcDialogue = Boolean(
    pilotState.enabled &&
      npcInteractionSession?.mode === "ai-dialogue" &&
      npcInteractionSession.context.type === "house" &&
      npcInteractionSession.context.houseId === pilotState.houseId &&
      npcInteractionSession.targetCharacterId ===
        pilotState.defaultTargetCharacterId
  );

  return {
    ...pilotState,
    renderInlineNpcDialogue,
  };
}

export function applyHouseConversationViewState(
  viewModel: HouseModuleViewModel,
  viewState: HouseConversationViewState
): HouseModuleViewModel {
  if (!viewState.hideActionContainer) {
    return viewModel;
  }

  return {
    ...viewModel,
    actionContainer: null,
    dialogue: null,
  };
}
