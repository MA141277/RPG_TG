import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { CityDefinition } from "../../domain/city";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { EventDefinition } from "../../domain/event";
import type { HouseDefinition } from "../../domain/house";
import type { SettlementDefinition } from "../../domain/content-pack";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";
import { startStoryEventById } from "../story/story-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../story/story-runtime-state-bridge";

export type StartupStoryBootstrap = {
  eventId: string;
  dialogueCursor?: number;
  dialogueStatus?: AppState["gameState"]["dialogue"]["status"];
};

export type StartupStoryBootstrapContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition>;
  settlementDefinitionsById?: Record<string, SettlementDefinition>;
  progressTrackDefinitionsById?: Record<string, ProgressTrackDefinition>;
  progressTrackBindingsById?: Record<string, ProgressTrackBinding>;
  cityDefinitionsById?: Record<string, CityDefinition>;
  houseDefinitionsById?: Record<string, HouseDefinition>;
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

  const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
    appState,
    content
  );
  const storyResult = startStoryEventById(
    {
      state: appState.gameState,
      characterDefinitions: appState.characterDefinitions,
      ...runtimeDefinitionContext,
    },
    {
      eventDefinitionsById: content.eventDefinitionsById,
      dialogueDefinitionsById: content.dialogueDefinitionsById,
      activityDefinitionsById: content.activityDefinitionsById,
      settlementDefinitionsById: content.settlementDefinitionsById,
      progressTrackDefinitionsById: content.progressTrackDefinitionsById,
      progressTrackBindingsById: content.progressTrackBindingsById,
      cityDefinitionsById: content.cityDefinitionsById,
      houseDefinitionsById: content.houseDefinitionsById,
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

  return applyStoryRuntimeResultToAppState(
    appState,
    content,
    {
      ...storyResult,
      state: {
        ...storyResult.state,
        dialogue: nextDialogue,
      },
    }
  );
}
