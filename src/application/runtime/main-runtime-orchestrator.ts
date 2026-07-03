import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { StartupSessionBootstrap } from "../startup/startup-session-coordinator";
import {
  advanceStorySceneStep,
  chooseStorySceneOption,
  getCurrentChoiceOptions,
} from "../story/story-runtime";
import { runStoryTriggerRuntime } from "../../core/runtime/scene-runtime";

export type MainRuntimeOrchestratorRequest =
  | {
      type: "apply-startup-session";
      session: StartupSessionBootstrap;
    }
  | {
      type: "advance-story-scene";
    }
  | {
      type: "choose-story-option";
      choiceId: string;
    }
  | {
      type: "trigger-story-events";
      timing: EventTriggerTiming;
      state: GameState;
      characterDefinitions: CharacterDefinition[];
    }
  | {
      type: "sync-passive-story-triggers";
    };

export type MainRuntimeOrchestratorResult = {
  appState: AppState;
  gameState?: GameState;
  characterDefinitions?: CharacterDefinition[];
  playerCharacterId?: string;
  didChange: boolean;
  shouldRender: boolean;
};

export type MainRuntimeOrchestratorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  setPlayerCharacterId(playerCharacterId: string): void;
  getStoryContent(): {
    eventDefinitionsById: Record<string, EventDefinition>;
    sceneDefinitionsById: Record<string, SceneDefinition>;
    activityDefinitionsById?: Record<string, ActivityDefinition>;
    textEntriesById?: Record<string, string>;
  };
  resetMainGameRuntime(): void;
  syncActivatedContentSource(
    activationResult: StartupSessionBootstrap["activationResult"]
  ): void;
  recreateHouseRuntime(): void;
  setGameVisibility(isVisible: boolean): void;
  hideMainUiFlow(): void;
};

type StoryTimingResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function createMainRuntimeOrchestrator(
  dependencies: MainRuntimeOrchestratorDependencies
) {
  function getNoopResult(): MainRuntimeOrchestratorResult {
    return {
      appState: dependencies.getAppState(),
      didChange: false,
      shouldRender: false,
    };
  }

  function runStoryTiming(
    timing: EventTriggerTiming,
    state: GameState,
    characterDefinitions: CharacterDefinition[]
  ): StoryTimingResult {
    const storyContent = dependencies.getStoryContent();
    const result = runStoryTriggerRuntime({
      timing,
      state,
      characterDefinitions,
      eventDefinitionsById: storyContent.eventDefinitionsById,
      sceneDefinitionsById: storyContent.sceneDefinitionsById,
      ...(storyContent.activityDefinitionsById == null
        ? {}
        : { activityDefinitionsById: storyContent.activityDefinitionsById }),
      ...(storyContent.textEntriesById == null
        ? {}
        : { textEntriesById: storyContent.textEntriesById }),
    });

    return {
      gameState: result.state,
      characterDefinitions: result.characterDefinitions,
    };
  }

  return {
    execute(request: MainRuntimeOrchestratorRequest): MainRuntimeOrchestratorResult {
      if (request.type === "apply-startup-session") {
        dependencies.resetMainGameRuntime();
        dependencies.syncActivatedContentSource(request.session.activationResult);
        dependencies.setPlayerCharacterId(request.session.playerCharacterId);
        const appState = request.session.createAppState();
        dependencies.setAppState(appState);
        dependencies.recreateHouseRuntime();
        dependencies.setGameVisibility(true);
        dependencies.hideMainUiFlow();

        return {
          appState,
          playerCharacterId: request.session.playerCharacterId,
          didChange: true,
          shouldRender: true,
        };
      }

      if (request.type === "trigger-story-events") {
        const result = runStoryTiming(
          request.timing,
          request.state,
          request.characterDefinitions
        );

        return {
          appState: dependencies.getAppState(),
          gameState: result.gameState,
          characterDefinitions: result.characterDefinitions,
          didChange:
            result.gameState !== request.state ||
            result.characterDefinitions !== request.characterDefinitions,
          shouldRender: false,
        };
      }

      if (request.type === "sync-passive-story-triggers") {
        const appState = dependencies.getAppState();
        if (appState.gameState.scene.activeSceneId != null) {
          return getNoopResult();
        }

        if (appState.gameState.ui.currentView !== "house") {
          return getNoopResult();
        }

        const result = runStoryTiming(
          "indoor-screen-shown",
          appState.gameState,
          appState.characterDefinitions
        );
        if (result.gameState === appState.gameState) {
          return getNoopResult();
        }

        const nextAppState = {
          ...appState,
          gameState: result.gameState,
          characterDefinitions: result.characterDefinitions,
        };
        dependencies.setAppState(nextAppState);

        return {
          appState: nextAppState,
          gameState: result.gameState,
          characterDefinitions: result.characterDefinitions,
          didChange: true,
          shouldRender: false,
        };
      }

      const appState = dependencies.getAppState();
      const storyContent = dependencies.getStoryContent();

      if (request.type === "advance-story-scene") {
        const result = advanceStorySceneStep(
          {
            state: appState.gameState,
            characterDefinitions: appState.characterDefinitions,
          },
          {
            eventDefinitionsById: storyContent.eventDefinitionsById,
            sceneDefinitionsById: storyContent.sceneDefinitionsById,
            activityDefinitionsById: storyContent.activityDefinitionsById,
            textEntriesById: storyContent.textEntriesById,
          }
        );
        const nextAppState = {
          ...appState,
          gameState: result.state,
          characterDefinitions: result.characterDefinitions,
        };
        dependencies.setAppState(nextAppState);

        return {
          appState: nextAppState,
          gameState: result.state,
          characterDefinitions: result.characterDefinitions,
          didChange: true,
          shouldRender: true,
        };
      }

      const selectedOption = getCurrentChoiceOptions(
        appState.gameState,
        storyContent.sceneDefinitionsById
      ).find((choiceOption) => choiceOption.id === request.choiceId);
      if (selectedOption == null) {
        return getNoopResult();
      }

      const result = chooseStorySceneOption(
        {
          state: appState.gameState,
          characterDefinitions: appState.characterDefinitions,
        },
        {
          eventDefinitionsById: storyContent.eventDefinitionsById,
          sceneDefinitionsById: storyContent.sceneDefinitionsById,
          activityDefinitionsById: storyContent.activityDefinitionsById,
          textEntriesById: storyContent.textEntriesById,
        },
        selectedOption
      );
      const nextAppState = {
        ...appState,
        gameState: result.state,
        characterDefinitions: result.characterDefinitions,
      };
      dependencies.setAppState(nextAppState);

      return {
        appState: nextAppState,
        gameState: result.state,
        characterDefinitions: result.characterDefinitions,
        didChange: true,
        shouldRender: true,
      };
    },
  };
}
