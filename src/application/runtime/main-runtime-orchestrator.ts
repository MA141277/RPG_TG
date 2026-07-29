import type { AppState } from "../app-shell";
import type { ActiveGameContentContext } from "../content/active-game-content";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { BuildingStatusById } from "../../domain/building-status";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { CityStatusById } from "../../domain/city-status";
import type {
  EventBinding,
  EventDefinition,
  EventTriggerTiming,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { StartupSessionBootstrap } from "../startup/startup-session-coordinator";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";
import { applyIndoorScreenStoryFollowUp } from "./indoor-screen-story-follow-up";
import {
  advanceStorySceneStep,
  buildStoryTriggerInput,
  chooseStorySceneOption,
  getCurrentChoiceOptions,
  triggerStoryEvents,
} from "../story/story-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../story/story-runtime-state-bridge";
import type { StorySettlementDefinition } from "../story/story-settlement-continuation";

type RuntimeStoryAppState = AppState & {
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
};

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
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
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
    eventBindingsById?: Record<string, EventBinding>;
    activityDefinitionsById?: Record<string, ActivityDefinition>;
    settlementDefinitionsById?: Record<
      string,
      StorySettlementDefinition | undefined
    >;
    progressTrackDefinitionsById?: Record<string, ProgressTrackDefinition>;
    progressTrackBindingsById?: Record<string, ProgressTrackBinding>;
    cityDefinitionsById?: Record<string, CityDefinition>;
    houseDefinitionsById?: Record<string, HouseDefinition>;
    textEntriesById?: Record<string, string>;
  };
  resetMainGameRuntime(): void;
  setActiveContentContext(contentContext: ActiveGameContentContext): void;
  recreateHouseRuntime(): void;
  setGameVisibility(isVisible: boolean): void;
  hideMainUiFlow(): void;
};

type StoryTimingResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  cityStatusById?: CityStatusById;
  buildingStatusById?: BuildingStatusById;
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
    const appState = dependencies.getAppState() as RuntimeStoryAppState;
    const storyContent = dependencies.getStoryContent();
    const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
      appState,
      storyContent
    );
    const result = triggerStoryEvents(
      {
        state,
        characterDefinitions,
        ...runtimeDefinitionContext,
      },
      {
        eventDefinitionsById: storyContent.eventDefinitionsById,
        sceneDefinitionsById: storyContent.sceneDefinitionsById,
        eventBindingsById: storyContent.eventBindingsById,
        activityDefinitionsById: storyContent.activityDefinitionsById,
        settlementDefinitionsById: storyContent.settlementDefinitionsById,
        progressTrackDefinitionsById:
          storyContent.progressTrackDefinitionsById,
        progressTrackBindingsById: storyContent.progressTrackBindingsById,
        cityDefinitionsById: storyContent.cityDefinitionsById,
        houseDefinitionsById: storyContent.houseDefinitionsById,
        textEntriesById: storyContent.textEntriesById,
      },
      buildStoryTriggerInput(timing, state)
    );
    const projectedAppState = applyStoryRuntimeResultToAppState(
      appState,
      storyContent,
      result
    );

    return {
      gameState: projectedAppState.gameState,
      characterDefinitions: projectedAppState.characterDefinitions,
      ...(projectedAppState.cityStatusById == null
        ? {}
        : { cityStatusById: projectedAppState.cityStatusById }),
      ...(projectedAppState.buildingStatusById == null
        ? {}
        : { buildingStatusById: projectedAppState.buildingStatusById }),
    };
  }

  return {
    execute(request: MainRuntimeOrchestratorRequest): MainRuntimeOrchestratorResult {
      if (request.type === "apply-startup-session") {
        dependencies.resetMainGameRuntime();
        dependencies.setActiveContentContext(request.session.contentContext);
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
          ...(result.cityStatusById == null
            ? {}
            : { cityStatusById: result.cityStatusById }),
          ...(result.buildingStatusById == null
            ? {}
            : { buildingStatusById: result.buildingStatusById }),
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
