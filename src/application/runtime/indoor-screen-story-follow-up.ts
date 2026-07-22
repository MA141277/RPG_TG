import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { CharacterDefinition } from "../../domain/character";
import type { EventBinding, EventDefinition } from "../../domain/event";
import { runStoryTriggerRuntime } from "../../core/runtime/dialogue-runtime";

export type IndoorScreenStoryFollowUpContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindingsById?: Record<string, EventBinding>;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
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

  const result = runStoryTriggerRuntime({
    timing: "indoor-screen-shown",
    state: appState.gameState,
    characterDefinitions: appState.characterDefinitions,
    eventDefinitionsById: content.eventDefinitionsById,
    ...(content.eventBindingsById == null
      ? {}
      : { eventBindingsById: content.eventBindingsById }),
    dialogueDefinitionsById: content.dialogueDefinitionsById,
    ...(content.activityDefinitionsById == null
      ? {}
      : { activityDefinitionsById: content.activityDefinitionsById }),
    ...(content.textEntriesById == null
      ? {}
      : { textEntriesById: content.textEntriesById }),
  });

  if (
    result.state === appState.gameState &&
    result.characterDefinitions === appState.characterDefinitions
  ) {
    return appState;
  }

  return {
    ...appState,
    gameState: result.state,
    characterDefinitions: result.characterDefinitions,
  };
}
