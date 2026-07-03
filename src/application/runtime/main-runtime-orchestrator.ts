import type { AppState } from "../app-shell";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { StartupSessionBootstrap } from "../startup/startup-session-coordinator";
import { applyIndoorScreenStoryFollowUp } from "./indoor-screen-story-follow-up";
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
        const nextAppState = applyIndoorScreenStoryFollowUp({
          appState,
          content: dependencies.getStoryContent(),
        });
        dependencies.setAppState(nextAppState);
        dependencies.recreateHouseRuntime();
        dependencies.setGameVisibility(true);
        dependencies.hideMainUiFlow();

        return {
          appState: nextAppState,
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
        const nextAppState = applyIndoorScreenStoryFollowUp({
          appState: {
            ...appState,
            gameState: result.state,
            characterDefinitions: result.characterDefinitions,
          },
          content: storyContent,
        });
        dependencies.setAppState(nextAppState);

        return {
          appState: nextAppState,
          gameState: nextAppState.gameState,
          characterDefinitions: nextAppState.characterDefinitions,
          didChange: true,
          shouldRender: true,
        };
      }

      if (request.type !== "choose-story-option") {
        return getNoopResult();
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
      const nextAppState = applyIndoorScreenStoryFollowUp({
        appState: {
          ...appState,
          gameState: result.state,
          characterDefinitions: result.characterDefinitions,
        },
        content: storyContent,
      });
      dependencies.setAppState(nextAppState);

      return {
        appState: nextAppState,
        gameState: nextAppState.gameState,
        characterDefinitions: nextAppState.characterDefinitions,
        didChange: true,
        shouldRender: true,
      };
    },
  };
}
