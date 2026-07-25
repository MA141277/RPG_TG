import type { AppState } from "../app-shell";
import type { ActiveGameContentContext } from "../content/active-game-content";
import type { ActivityDefinition } from "../../domain/activity";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { SettlementDefinition } from "../../domain/content-pack";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type { StartupSessionBootstrap } from "../startup/startup-session-coordinator";
import type {
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../core/contracts/progression-runtime";
import { applyIndoorScreenStoryFollowUp } from "./indoor-screen-story-follow-up";
import {
  advanceStoryDialogueStep,
  chooseStoryDialogueOption,
  getCurrentDialogueChoiceOptions,
  startStoryEventById,
  type StoryTriggerTiming,
} from "../story/story-runtime";
import {
  applyStoryRuntimeResultToAppState,
  createStoryRuntimeDefinitionContext,
} from "../story/story-runtime-state-bridge";
import { runStoryTriggerRuntime } from "../../core/runtime/dialogue-runtime";

export type MainRuntimeOrchestratorRequest =
  | {
      type: "apply-startup-session";
      session: StartupSessionBootstrap;
    }
  | {
      type: "advance-story-dialogue";
    }
  | {
      type: "choose-story-option";
      choiceId: string;
    }
  | {
      type: "trigger-story-events";
      timing: StoryTriggerTiming;
      state: GameState;
      characterDefinitions: CharacterDefinition[];
    }
  | {
      type: "consume-deferred-entry-event";
      variableKey: string;
      state: GameState;
      characterDefinitions: CharacterDefinition[];
    };

export type MainRuntimeOrchestratorResult = {
  appState: AppState;
  gameState?: GameState;
  characterDefinitions?: CharacterDefinition[];
  cityStatusById?: AppState["cityStatusById"];
  buildingStatusById?: AppState["buildingStatusById"];
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
  resetMainGameRuntime(): void;
  setActiveContentContext(contentContext: ActiveGameContentContext): void;
  recreateHouseRuntime(): void;
  setGameVisibility(isVisible: boolean): void;
  hideMainUiFlow(): void;
};

type StoryTimingResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  cityStatusById?: AppState["cityStatusById"];
  buildingStatusById?: AppState["buildingStatusById"];
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
    timing: StoryTriggerTiming,
    state: GameState,
    characterDefinitions: CharacterDefinition[]
  ): StoryTimingResult {
    const appState = dependencies.getAppState();
    const storyContent = dependencies.getStoryContent();
    const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
      appState,
      storyContent
    );
    const result = runStoryTriggerRuntime({
      timing,
      state,
      characterDefinitions,
      eventDefinitionsById: storyContent.eventDefinitionsById,
      ...(storyContent.eventBindingsById == null
        ? {}
        : { eventBindingsById: storyContent.eventBindingsById }),
      ...(storyContent.settlementDefinitionsById == null
        ? {}
        : { settlementDefinitionsById: storyContent.settlementDefinitionsById }),
      ...(storyContent.progressTrackDefinitionsById == null
        ? {}
        : {
            progressTrackDefinitionsById:
              storyContent.progressTrackDefinitionsById,
          }),
      ...(storyContent.progressTrackBindingsById == null
        ? {}
        : {
            progressTrackBindingsById:
              storyContent.progressTrackBindingsById,
          }),
      dialogueDefinitionsById: storyContent.dialogueDefinitionsById,
      ...(storyContent.activityDefinitionsById == null
        ? {}
        : { activityDefinitionsById: storyContent.activityDefinitionsById }),
      ...(storyContent.cityDefinitionsById == null
        ? {}
        : { cityDefinitionsById: storyContent.cityDefinitionsById }),
      ...(storyContent.houseDefinitionsById == null
        ? {}
        : { houseDefinitionsById: storyContent.houseDefinitionsById }),
      ...(storyContent.textEntriesById == null
        ? {}
        : { textEntriesById: storyContent.textEntriesById }),
      ...runtimeDefinitionContext,
    });
    const projectedAppState = applyStoryRuntimeResultToAppState(
      appState,
      storyContent,
      result
    );

    return {
      gameState: projectedAppState.gameState,
      characterDefinitions: projectedAppState.characterDefinitions,
      cityStatusById: projectedAppState.cityStatusById,
      buildingStatusById: projectedAppState.buildingStatusById,
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
          cityStatusById: result.cityStatusById,
          buildingStatusById: result.buildingStatusById,
          didChange:
            result.gameState !== request.state ||
            result.characterDefinitions !== request.characterDefinitions,
          shouldRender: false,
        };
      }

      if (request.type === "consume-deferred-entry-event") {
        const deferredEventId = request.state.runtime.variables[request.variableKey];
        if (typeof deferredEventId !== "string" || deferredEventId.trim().length === 0) {
          return getNoopResult();
        }

        const nextVariables = {
          ...request.state.runtime.variables,
        };
        delete nextVariables[request.variableKey];
        const deferredState = {
          ...request.state,
          runtime: {
            ...request.state.runtime,
            variables: nextVariables,
          },
        };
        const storyContent = dependencies.getStoryContent();
        const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
          dependencies.getAppState(),
          storyContent
        );
        const result = startStoryEventById(
          {
            state: deferredState,
            characterDefinitions: request.characterDefinitions,
            ...runtimeDefinitionContext,
          },
          storyContent,
          deferredEventId
        );
        const projectedAppState = applyStoryRuntimeResultToAppState(
          dependencies.getAppState(),
          storyContent,
          result
        );

        return {
          appState: dependencies.getAppState(),
          gameState: projectedAppState.gameState,
          characterDefinitions: projectedAppState.characterDefinitions,
          cityStatusById: projectedAppState.cityStatusById,
          buildingStatusById: projectedAppState.buildingStatusById,
          didChange: true,
          shouldRender: false,
        };
      }

      const appState = dependencies.getAppState();
      const storyContent = dependencies.getStoryContent();

      if (request.type === "advance-story-dialogue") {
        const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
          appState,
          storyContent
        );
        const result = advanceStoryDialogueStep(
          {
            state: appState.gameState,
            characterDefinitions: appState.characterDefinitions,
            ...runtimeDefinitionContext,
          },
          {
            eventDefinitionsById: storyContent.eventDefinitionsById,
            dialogueDefinitionsById: storyContent.dialogueDefinitionsById,
            activityDefinitionsById: storyContent.activityDefinitionsById,
            textEntriesById: storyContent.textEntriesById,
          }
        );
        const appliedStoryAppState = applyStoryRuntimeResultToAppState(
          appState,
          storyContent,
          result
        );
        const nextAppState = applyIndoorScreenStoryFollowUp({
          appState: appliedStoryAppState,
          content: storyContent,
        });
        dependencies.setAppState(nextAppState);

        return {
          appState: nextAppState,
          gameState: nextAppState.gameState,
          characterDefinitions: nextAppState.characterDefinitions,
          cityStatusById: nextAppState.cityStatusById,
          buildingStatusById: nextAppState.buildingStatusById,
          didChange: true,
          shouldRender: true,
        };
      }

      if (request.type !== "choose-story-option") {
        return getNoopResult();
      }

      const selectedOption = getCurrentDialogueChoiceOptions(
        appState.gameState,
        storyContent.dialogueDefinitionsById
      ).find((choiceOption) => choiceOption.id === request.choiceId);
      if (selectedOption == null) {
        return getNoopResult();
      }

      const runtimeDefinitionContext = createStoryRuntimeDefinitionContext(
        appState,
        storyContent
      );
      const result = chooseStoryDialogueOption(
        {
          state: appState.gameState,
          characterDefinitions: appState.characterDefinitions,
          ...runtimeDefinitionContext,
        },
        {
          eventDefinitionsById: storyContent.eventDefinitionsById,
          dialogueDefinitionsById: storyContent.dialogueDefinitionsById,
          activityDefinitionsById: storyContent.activityDefinitionsById,
          textEntriesById: storyContent.textEntriesById,
        },
        selectedOption
      );
      const appliedStoryAppState = applyStoryRuntimeResultToAppState(
        appState,
        storyContent,
        result
      );
      const nextAppState = applyIndoorScreenStoryFollowUp({
        appState: appliedStoryAppState,
        content: storyContent,
      });
      dependencies.setAppState(nextAppState);

      return {
        appState: nextAppState,
        gameState: nextAppState.gameState,
        characterDefinitions: nextAppState.characterDefinitions,
        cityStatusById: nextAppState.cityStatusById,
        buildingStatusById: nextAppState.buildingStatusById,
        didChange: true,
        shouldRender: true,
      };
    },
  };
}
