import type { ChoiceOption, SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
import { resolveEventContinuation } from "../events/event-continuation";
import { startEvent } from "../events/event-runner";

export type ChoiceResolutionContext = {
  sceneDefinitionsById: Record<string, SceneDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  characterDefinitions: CharacterDefinition[];
};

export type ChoiceResolutionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function resolveChoiceOption(
  state: GameState,
  selectedOption: ChoiceOption,
  context: ChoiceResolutionContext
): ChoiceResolutionResult {
  let nextState = state;
  let nextCharacterDefinitions = context.characterDefinitions;

  if (selectedOption.effects != null && selectedOption.effects.length > 0) {
    const effectResult = applyEffects(nextState, selectedOption.effects, {
      characterDefinitions: nextCharacterDefinitions,
    });

    nextState = effectResult.state;
    nextCharacterDefinitions = effectResult.characterDefinitions;
  }

  if (selectedOption.nextEventId != null) {
    const targetEvent = context.eventDefinitionsById[selectedOption.nextEventId];
    if (targetEvent != null) {
      const continuation = resolveEventContinuation({
        state: nextState,
        eventDefinitionsById: context.eventDefinitionsById,
        sourceEventId: nextState.scene.activeEventId,
        targetEventId: targetEvent.id,
        visitedEventIds:
          nextState.scene.activeEventId == null
            ? []
            : [nextState.scene.activeEventId],
      });
      nextState =
        continuation == null
          ? finishChoiceScene(nextState)
          : startEvent(nextState, continuation.eventDefinition);
    }
  } else if (selectedOption.nextSceneId != null) {
    nextState = {
      ...nextState,
      scene: {
        ...nextState.scene,
        activeSceneId: selectedOption.nextSceneId,
        cursor: 0,
        status: "playing",
      },
    };
  } else {
    nextState = {
      ...nextState,
      scene: {
        ...nextState.scene,
        cursor: nextState.scene.cursor + 1,
        status: "playing",
      },
    };
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}

function finishChoiceScene(state: GameState): GameState {
  return {
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
  };
}
