import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { ActivityDefinition } from "../../domain/activity";
import type { SceneDefinition } from "../../domain/action";
import type { ChoiceOption } from "../../domain/action";
import { resolveChoiceOption } from "../scene/choice-resolver";
import { advanceScene, runSceneUntilPause } from "../scene/scene-runner";

export type GameContent = {
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  sceneDefinitionsById: Record<string, SceneDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
};

export type GameStoreSnapshot = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  currentAction: SceneDefinition["actions"][number] | null;
};

export function createGameStore(initialState: GameState, content: GameContent) {
  let state = initialState;
  let characterDefinitions = content.characterDefinitions;
  let currentAction: SceneDefinition["actions"][number] | null = null;

  return {
    getSnapshot(): GameStoreSnapshot {
      return {
        state,
        characterDefinitions,
        currentAction,
      };
    },
    syncScene(): GameStoreSnapshot {
      const result = runSceneUntilPause(state, {
        sceneDefinitionsById: content.sceneDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        activityDefinitionsById: content.activityDefinitionsById,
        characterDefinitions,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;
      currentAction = result.currentAction;

      return this.getSnapshot();
    },
    advanceScene(): GameStoreSnapshot {
      const result = advanceScene(state, {
        sceneDefinitionsById: content.sceneDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        activityDefinitionsById: content.activityDefinitionsById,
        characterDefinitions,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;
      currentAction = result.currentAction;

      return this.getSnapshot();
    },
    chooseOption(selectedOption: ChoiceOption): GameStoreSnapshot {
      const result = resolveChoiceOption(state, selectedOption, {
        sceneDefinitionsById: content.sceneDefinitionsById,
        eventDefinitionsById: content.eventDefinitionsById,
        characterDefinitions,
      });

      state = result.state;
      characterDefinitions = result.characterDefinitions;

      return this.syncScene();
    },
    replaceState(nextState: GameState): GameStoreSnapshot {
      state = nextState;
      return this.getSnapshot();
    },
  };
}
