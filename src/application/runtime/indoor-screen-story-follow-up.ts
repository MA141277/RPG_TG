import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { CityDefinition } from "../../domain/city";
import type { HouseDefinition } from "../../domain/house";
import type { SettlementDefinition } from "../../domain/content-pack";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";
import { runStoryTriggerRuntime } from "../../core/runtime/dialogue-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../story/story-runtime-state-bridge";

export type IndoorScreenStoryFollowUpContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindingsById?: Record<string, EventBinding>;
  settlementDefinitionsById?: Record<string, SettlementDefinition>;
  progressTrackDefinitionsById?: Record<string, ProgressTrackDefinition>;
  progressTrackBindingsById?: Record<string, ProgressTrackBinding>;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  cityDefinitionsById?: Record<string, CityDefinition>;
  houseDefinitionsById?: Record<string, HouseDefinition>;
  textEntriesById?: Record<string, string>;
};

export function applyIndoorScreenStoryFollowUp(input: {
  appState: AppState;
  content: IndoorScreenStoryFollowUpContent;
}): AppState {
  const { appState, content } = input;
  if (appState.gameState.dialogue.activeDialogueId != null) {
    return appState;
  }

  if (appState.gameState.ui.currentView !== "house") {
    return appState;
  }

  const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
    appState,
    content
  );
  const result = runStoryTriggerRuntime({
    timing: "indoor-screen-shown",
    state: appState.gameState,
    characterDefinitions: appState.characterDefinitions,
    eventDefinitionsById: content.eventDefinitionsById,
    ...(content.eventBindingsById == null
      ? {}
      : { eventBindingsById: content.eventBindingsById }),
    ...(content.settlementDefinitionsById == null
      ? {}
      : { settlementDefinitionsById: content.settlementDefinitionsById }),
    ...(content.progressTrackDefinitionsById == null
      ? {}
      : {
          progressTrackDefinitionsById: content.progressTrackDefinitionsById,
        }),
    ...(content.progressTrackBindingsById == null
      ? {}
      : {
          progressTrackBindingsById: content.progressTrackBindingsById,
        }),
    dialogueDefinitionsById: content.dialogueDefinitionsById,
    ...(content.activityDefinitionsById == null
      ? {}
      : { activityDefinitionsById: content.activityDefinitionsById }),
    ...(content.cityDefinitionsById == null
      ? {}
      : { cityDefinitionsById: content.cityDefinitionsById }),
    ...(content.houseDefinitionsById == null
      ? {}
      : { houseDefinitionsById: content.houseDefinitionsById }),
    ...(content.textEntriesById == null
      ? {}
      : { textEntriesById: content.textEntriesById }),
    ...runtimeDefinitionContext,
  });

  if (
    result.state === appState.gameState &&
    result.characterDefinitions === appState.characterDefinitions &&
    result.cityDefinitions === runtimeDefinitionContext.cityDefinitions &&
    result.houseDefinitions === runtimeDefinitionContext.houseDefinitions
  ) {
    return appState;
  }

  return applyStoryRuntimeResultToAppState(appState, content, result);
}
