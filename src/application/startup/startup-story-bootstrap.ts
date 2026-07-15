import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { EventDefinition } from "../../domain/event";
import { startStoryEventById } from "../story/story-runtime";

export type StartupStoryBootstrap = {
  eventId: string;
  sceneCursor?: number;
  sceneStatus?: AppState["gameState"]["scene"]["status"];
};

export type StartupStoryBootstrapContent = {
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
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
      sceneDefinitionsById: content.sceneDefinitionsById,
      activityDefinitionsById: content.activityDefinitionsById,
      textEntriesById: content.textEntriesById,
    },
    bootstrap.eventId
  );

  const nextScene =
    bootstrap.sceneCursor == null && bootstrap.sceneStatus == null
      ? storyResult.state.scene
      : {
          ...storyResult.state.scene,
          ...(bootstrap.sceneCursor == null
            ? {}
            : { cursor: bootstrap.sceneCursor }),
          ...(bootstrap.sceneStatus == null
            ? {}
            : { status: bootstrap.sceneStatus }),
        };

  return {
    ...appState,
    gameState: {
      ...storyResult.state,
      scene: nextScene,
    },
    characterDefinitions: storyResult.characterDefinitions,
  };
}
