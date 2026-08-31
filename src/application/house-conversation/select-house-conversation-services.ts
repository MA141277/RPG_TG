import type { ActivityDefinition } from "../../domain/activity";
import type { HouseConversationServiceCapability } from "../../domain/house-conversation";
import type { AppState } from "../app-shell";
import type { AppPresenterStageOutput } from "../presenter/presenter-output";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../../core/registry/house-module-registry";

export function selectHouseConversationServicesFromActiveModule(input: {
  appState: AppState;
  stageOutput: AppPresenterStageOutput;
  playerCharacterId: string;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
  houseModuleRegistry?: HouseModuleRegistry | undefined;
}): HouseConversationServiceCapability[] {
  if (input.stageOutput.type !== "house") {
    return [];
  }

  const moduleId =
    input.stageOutput.activeHouse.moduleId ??
    input.stageOutput.moduleViewModel?.moduleId ??
    null;
  if (moduleId == null) {
    return [];
  }

  const houseModule =
    (input.houseModuleRegistry ?? builtinHouseModuleRegistry).getModule(
      moduleId
    );
  if (houseModule?.selectConversationServices == null) {
    return [];
  }

  return houseModule.selectConversationServices({
    gameState: input.appState.gameState,
    characterDefinitions: input.appState.characterDefinitions,
    houseDefinition: input.stageOutput.activeHouse,
    playerCharacterId: input.playerCharacterId,
    sessionState: input.appState.gameState.ui.houseSession?.state ?? null,
    activityDefinitionsById: input.activityDefinitionsById,
    textEntriesById: input.textEntriesById,
  });
}
