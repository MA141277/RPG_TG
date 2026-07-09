import type { ActivityDefinition } from "../../domain/activity";
import type { RuntimeInteractiveSignal } from "../../core/contracts/runtime-result";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import type { AppState } from "../app-shell";
import type { MainRuntimeOrchestratorRequest } from "./main-runtime-orchestrator";
import {
  createExitInteractiveRequest,
  createInteractiveActionRequest,
  runInteractiveRuntime,
} from "../../core/runtime/interactive-runtime";
import {
  createPlayableActionRequest,
  runPlayableRuntime,
} from "../../core/runtime/playable-runtime";
import { commitRuntimeRequest } from "../../core/runtime/state-sync-runtime";

type BattleDemoResultMessage = {
  type: "rpg-tg:battle-demo-result";
  scenarioId?: string;
  result?: "victory" | "defeat";
};

export type InteractiveActionCoordinatorDependencies = {
  getAppState(): AppState;
  setAppState(appState: AppState): void;
  renderApp(): void;
  getPlayerCharacterId(): string | null;
  getActivityDefinitionsById(): Record<string, ActivityDefinition>;
  getTextEntriesById(): Record<string, string>;
  executeMainRuntime(request: MainRuntimeOrchestratorRequest): void;
  applyInteractiveFollowUp(
    interactive: Exclude<NonNullable<RuntimeInteractiveSignal>, { type: "none" }>
  ): RuntimeState;
};

export function createInteractiveActionCoordinator(
  dependencies: InteractiveActionCoordinatorDependencies
) {
  function setAppState(appState: AppState): void {
    dependencies.setAppState(appState);
  }

  function renderApp(): void {
    dependencies.renderApp();
  }

  function stopCurrentActivityQte(): void {
    const appState = dependencies.getAppState();
    const session = appState.gameState.runtime.activitySession;
    if (session?.type !== "qte-bar") {
      return;
    }

    const nextAppState = commitRuntimeRequest({
      state: appState,
      request: createInteractiveActionRequest("interactive.activity-qte.stop"),
      context: {
        router: {
          route: ({ state, request }) =>
            runInteractiveRuntime({
              state,
              request,
              characterDefinitions: appState.characterDefinitions,
              activityDefinitionsById: dependencies.getActivityDefinitionsById(),
            }),
        },
      },
    }).state;

    setAppState(nextAppState);
    renderApp();
  }

  function closeCurrentActivityResult(): void {
    const appState = dependencies.getAppState();
    const nextAppState = commitRuntimeRequest({
      state: appState,
      request: createExitInteractiveRequest("activity-qte"),
      context: {
        router: {
          route: ({ state, request }) =>
            runInteractiveRuntime({
              state,
              request,
              characterDefinitions: appState.characterDefinitions,
            }),
        },
      },
    }).state;

    setAppState(nextAppState);
    renderApp();
  }

  function handleActivityAction(actionId: string | undefined): boolean {
    if (actionId === "stop-qte") {
      stopCurrentActivityQte();
      return true;
    }

    if (actionId === "close-result") {
      closeCurrentActivityResult();
      return true;
    }

    return false;
  }

  function advanceCurrentStoryScene(): void {
    dependencies.executeMainRuntime({
      type: "advance-story-scene",
    });
    renderApp();
  }

  function chooseCurrentStoryOption(choiceId: string): void {
    dependencies.executeMainRuntime({
      type: "choose-story-option",
      choiceId,
    });
    renderApp();
  }

  function dispatchCurrentStoryBattleAction(actionId: string): void {
    const appState = dependencies.getAppState();
    const playerCharacterId = dependencies.getPlayerCharacterId();
    const result = commitRuntimeRequest({
      state: appState,
      request: createPlayableActionRequest("story-battle", "battle-action", {
        battleActionId: actionId,
      }),
      context: {
        router: {
          route: ({ state, request }) =>
            runPlayableRuntime({
              state,
              request,
              characterDefinitions: appState.characterDefinitions,
              ...(playerCharacterId == null ? {} : { playerCharacterId }),
              textEntriesById: dependencies.getTextEntriesById(),
            }),
        },
        followUp: {
          handleFollowUp: ({ state, followUp }) => ({
            state:
              followUp.type === "reenter-house"
                ? dependencies.applyInteractiveFollowUp(followUp)
                : state,
          }),
        },
      },
    });

    setAppState(result.state);
    renderApp();
  }

  function handleBattleDemoResultMessage(message: unknown): void {
    if (message == null || typeof message !== "object") {
      return;
    }

    const resultMessage = message as BattleDemoResultMessage;
    const activeBattle = dependencies.getAppState().gameState.storyBattle;
    if (
      resultMessage.type !== "rpg-tg:battle-demo-result" ||
      activeBattle?.demoScenarioId == null ||
      resultMessage.scenarioId !== activeBattle.demoScenarioId ||
      resultMessage.result !== "victory"
    ) {
      return;
    }

    dispatchCurrentStoryBattleAction("embedded-victory");
  }

  return {
    handleActivityAction,
    advanceCurrentStoryScene,
    chooseCurrentStoryOption,
    dispatchCurrentStoryBattleAction,
    handleBattleDemoResultMessage,
  };
}
