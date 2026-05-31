import type { ActionNode, SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
import { startEvent } from "../events/event-runner";

export type SceneRunnerContext = {
  sceneDefinitionsById: Record<string, SceneDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  characterDefinitions: CharacterDefinition[];
};

export type SceneStepResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  currentAction: ActionNode | null;
};

export function runSceneUntilPause(
  state: GameState,
  context: SceneRunnerContext
): SceneStepResult {
  let nextState = state;
  let nextCharacterDefinitions = context.characterDefinitions;

  while (nextState.scene.activeSceneId != null) {
    const activeScene = context.sceneDefinitionsById[nextState.scene.activeSceneId];
    if (activeScene == null) {
      return finishScene(nextState, nextCharacterDefinitions);
    }

    const currentAction = activeScene.actions[nextState.scene.cursor] ?? null;
    if (currentAction == null) {
      return finishScene(nextState, nextCharacterDefinitions);
    }

    if (
      currentAction.type === "background" ||
      currentAction.type === "music" ||
      currentAction.type === "narration" ||
      currentAction.type === "dialogue"
    ) {
      return {
        state: {
          ...nextState,
          scene: {
            ...nextState.scene,
            status: "playing",
          },
        },
        characterDefinitions: nextCharacterDefinitions,
        currentAction,
      };
    }

    if (currentAction.type === "choice") {
      return {
        state: {
          ...nextState,
          scene: {
            ...nextState.scene,
            status: "waiting-choice",
          },
        },
        characterDefinitions: nextCharacterDefinitions,
        currentAction,
      };
    }

    if (currentAction.type === "effect") {
      const effectResult = applyEffects(nextState, currentAction.effects, {
        characterDefinitions: nextCharacterDefinitions,
      });

      nextState = incrementSceneCursor(effectResult.state);
      nextCharacterDefinitions = effectResult.characterDefinitions;
      continue;
    }

    if (currentAction.type === "jump") {
      nextState = {
        ...nextState,
        scene: {
          ...nextState.scene,
          activeSceneId: currentAction.nextSceneId,
          cursor: 0,
          status: "playing",
        },
      };
      continue;
    }

    if (currentAction.type === "start-event") {
      const targetEvent = context.eventDefinitionsById[currentAction.eventId];
      nextState =
        targetEvent == null ? incrementSceneCursor(nextState) : startEvent(nextState, targetEvent);
      continue;
    }

    nextState = incrementSceneCursor(nextState);
  }

  return finishScene(nextState, nextCharacterDefinitions);
}

export function advanceScene(
  state: GameState,
  context: SceneRunnerContext
): SceneStepResult {
  return runSceneUntilPause(incrementSceneCursor(state), context);
}

function incrementSceneCursor(state: GameState): GameState {
  return {
    ...state,
    scene: {
      ...state.scene,
      cursor: state.scene.cursor + 1,
    },
  };
}

function finishScene(
  state: GameState,
  characterDefinitions: CharacterDefinition[]
): SceneStepResult {
  return {
    state: {
      ...state,
      scene: {
        ...state.scene,
        activeEventId: null,
        activeSceneId: null,
        cursor: 0,
        status: "idle",
      },
      ui: {
        ...state.ui,
        currentView: state.world.currentHouseId == null ? "city" : "house",
      },
    },
    characterDefinitions,
    currentAction: null,
  };
}
