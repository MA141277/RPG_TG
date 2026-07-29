import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { CityDefinition } from "../../domain/city";
import type { EventDefinition } from "../../domain/event";
import type { HouseDefinition } from "../../domain/house";
import {
  buildStoryTriggerInput,
  triggerStoryEvents,
} from "../story/story-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../story/story-runtime-state-bridge";
import type { StorySettlementDefinition } from "../story/story-settlement-continuation";

export type IndoorScreenStoryFollowUpContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  settlementDefinitionsById?: Record<
    string,
    StorySettlementDefinition | undefined
  >;
  cityDefinitionsById?: Record<string, CityDefinition>;
  houseDefinitionsById?: Record<string, HouseDefinition>;
  textEntriesById?: Record<string, string>;
};

export function applyIndoorScreenStoryFollowUp(input: {
  appState: AppState;
  content: IndoorScreenStoryFollowUpContent;
}): AppState {
  const { appState, content } = input;
  if (appState.gameState.scene.activeSceneId != null) {
    return appState;
  }

  if (appState.gameState.ui.currentView !== "house") {
    return appState;
  }

  const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
    appState,
    content
  );
  const result = triggerStoryEvents(
    {
      state: appState.gameState,
      characterDefinitions: appState.characterDefinitions,
      ...runtimeDefinitionContext,
    },
    {
      eventDefinitionsById: content.eventDefinitionsById,
      sceneDefinitionsById: content.sceneDefinitionsById,
      activityDefinitionsById: content.activityDefinitionsById,
      settlementDefinitionsById: content.settlementDefinitionsById,
      textEntriesById: content.textEntriesById,
    },
    buildStoryTriggerInput("indoor-screen-shown", appState.gameState)
  );

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
