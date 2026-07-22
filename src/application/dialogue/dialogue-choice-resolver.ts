import type {
  RuntimeDialogueChoiceOption,
} from "../../domain/dialogue";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
import { startEvent } from "../events/event-runner";

export type DialogueChoiceResolutionContext = {
  eventDefinitionsById: Record<string, EventDefinition>;
  characterDefinitions: CharacterDefinition[];
};

export type DialogueChoiceResolutionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function resolveDialogueChoiceOption(
  state: GameState,
  selectedOption: RuntimeDialogueChoiceOption,
  context: DialogueChoiceResolutionContext
): DialogueChoiceResolutionResult {
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
  } else if (selectedOption.nextDialogueId != null) {
    nextState = {
      ...nextState,
      dialogue: {
        ...nextState.dialogue,
        activeDialogueId: selectedOption.nextDialogueId,
        cursor: 0,
        status: "playing",
      },
    };
  } else {
    nextState = {
      ...nextState,
      dialogue: {
        ...nextState.dialogue,
        cursor: nextState.dialogue.cursor + 1,
        status: "playing",
      },
    };
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}
