import type {
  RuntimeDialogueChoiceOption,
} from "../../domain/dialogue";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
import {
  continueToEvent,
  createEventContinuationTracker,
} from "../events/event-continuation";

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
    const continuation = continueToEvent({
      state: nextState,
      eventDefinitionsById: context.eventDefinitionsById,
      sourceEventId: nextState.dialogue.activeEventId,
      targetEventId: selectedOption.nextEventId,
      visitedEventIds: createEventContinuationTracker([
        nextState.dialogue.activeEventId,
      ]),
    });
    nextState =
      continuation == null ? closeDialogue(nextState) : continuation.state;
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

function closeDialogue(state: GameState): GameState {
  return {
    ...state,
    dialogue: {
      ...state.dialogue,
      activeEventId: null,
      activeDialogueId: null,
      cursor: 0,
      status: "idle",
    },
    ui: {
      ...state.ui,
      currentView: state.world.currentHouseId == null ? "city" : "house",
    },
  };
}
