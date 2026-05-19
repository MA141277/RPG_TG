import type { ChoiceOption, SceneDefinition } from "../../domain/action";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
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
      nextState = startEvent(nextState, targetEvent);
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
