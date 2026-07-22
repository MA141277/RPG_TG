import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventDefinition } from "../../domain/event";
import { startStoryEventById } from "../story/story-runtime";

export type StartupStoryBootstrap = {
  eventId: string;
  dialogueCursor?: number;
  dialogueStatus?: AppState["gameState"]["dialogue"]["status"];
};

export type StartupStoryBootstrapContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  textEntriesById?: Record<string, string>;
};

export function applyStartupStoryBootstrap(input: {
  appState: AppState;
  bootstrap: StartupStoryBootstrap | null;
  content: StartupStoryBootstrapContent;
}): AppState {
  const { appState, bootstrap, content } = input;
  if (bootstrap == null) {
    return appState;
  }

  const storyResult = startStoryEventById(
    {
      state: appState.gameState,
      characterDefinitions: appState.characterDefinitions,
    },
    {
      eventDefinitionsById: content.eventDefinitionsById,
      dialogueDefinitionsById: content.dialogueDefinitionsById,
      activityDefinitionsById: content.activityDefinitionsById,
      textEntriesById: content.textEntriesById,
    },
    bootstrap.eventId
  );

  const nextDialogue =
    bootstrap.dialogueCursor == null && bootstrap.dialogueStatus == null
      ? storyResult.state.dialogue
      : {
          ...storyResult.state.dialogue,
          ...(bootstrap.dialogueCursor == null
            ? {}
            : { cursor: bootstrap.dialogueCursor }),
          ...(bootstrap.dialogueStatus == null
            ? {}
            : { status: bootstrap.dialogueStatus }),
        };

  return {
    ...appState,
    gameState: {
      ...storyResult.state,
      dialogue: nextDialogue,
    },
    characterDefinitions: storyResult.characterDefinitions,
  };
}
