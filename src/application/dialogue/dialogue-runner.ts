import type {
  RuntimeDialogueDefinition,
  RuntimeDialogueNode,
} from "../../domain/dialogue";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { runActivity } from "../activity/activity-runner";
import { applyEffects } from "../effects/effect-applier";
import { syncActiveEventPresentation } from "./dialogue-presentation";
import { startEvent } from "../events/event-runner";
import { runStoryCallback } from "../story/story-callbacks";

export type DialogueRunnerContext = {
  dialogueDefinitionsById: Record<string, RuntimeDialogueDefinition>;
  eventDefinitionsById: Record<string, EventDefinition>;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  characterDefinitions: CharacterDefinition[];
  textEntriesById?: Record<string, string> | undefined;
};

export type DialogueStepResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  currentNode: RuntimeDialogueNode | null;
};

export function runDialogueUntilPause(
  state: GameState,
  context: DialogueRunnerContext
): DialogueStepResult {
  let nextState = state;
  let nextCharacterDefinitions = context.characterDefinitions;

  while (true) {
    nextState = syncActiveEventPresentation(
      nextState,
      context.eventDefinitionsById
    );

    if (nextState.dialogue.activeDialogueId == null) {
      break;
    }

    const activeDialogue =
      context.dialogueDefinitionsById[nextState.dialogue.activeDialogueId];
    if (activeDialogue == null) {
      return finishDialogue(nextState, nextCharacterDefinitions, context);
    }

    const currentNode = activeDialogue.nodes[nextState.dialogue.cursor] ?? null;
    if (currentNode == null) {
      return finishDialogue(nextState, nextCharacterDefinitions, context);
    }

    if (
      currentNode.type === "background" ||
      currentNode.type === "music" ||
      currentNode.type === "narration" ||
      currentNode.type === "dialogue"
    ) {
      return {
        state: {
          ...nextState,
          dialogue: {
            ...nextState.dialogue,
            status: "playing",
          },
        },
        characterDefinitions: nextCharacterDefinitions,
        currentNode,
      };
    }

    if (currentNode.type === "choice") {
      return {
        state: {
          ...nextState,
          dialogue: {
            ...nextState.dialogue,
            status: "waiting-choice",
          },
        },
        characterDefinitions: nextCharacterDefinitions,
        currentNode,
      };
    }

    if (currentNode.type === "effect") {
      const effectResult = applyEffects(nextState, currentNode.effects, {
        characterDefinitions: nextCharacterDefinitions,
      });

      nextState = incrementDialogueCursor(effectResult.state);
      nextCharacterDefinitions = effectResult.characterDefinitions;
      continue;
    }

    if (currentNode.type === "jump") {
      nextState = {
        ...nextState,
        dialogue: {
          ...nextState.dialogue,
          activeDialogueId: currentNode.nextDialogueId,
          cursor: 0,
          status: "playing",
        },
      };
      continue;
    }

    if (currentNode.type === "start-event") {
      const targetEvent = context.eventDefinitionsById[currentNode.eventId];
      nextState =
        targetEvent == null
          ? incrementDialogueCursor(nextState)
          : startEvent(nextState, targetEvent);
      continue;
    }

    if (currentNode.type === "start-activity") {
      const activityResult =
        context.activityDefinitionsById == null
          ? null
          : runActivity(
              nextState,
              currentNode.activityId,
              {
                activityDefinitionsById: context.activityDefinitionsById,
                characterDefinitions: nextCharacterDefinitions,
              },
              currentNode.fallbackActivityId
            );

      nextState = incrementDialogueCursor(activityResult?.state ?? nextState);
      nextCharacterDefinitions =
        activityResult?.characterDefinitions ?? nextCharacterDefinitions;
      continue;
    }

    if (currentNode.type === "callback") {
      const callbackResult = runStoryCallback(currentNode.handlerId, currentNode.payload, {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
        textEntriesById: context.textEntriesById,
      });
      nextState = incrementDialogueCursor(callbackResult.state);
      nextCharacterDefinitions = callbackResult.characterDefinitions;
      continue;
    }

    nextState = incrementDialogueCursor(nextState);
  }

  return finishDialogue(nextState, nextCharacterDefinitions, context);
}

export function advanceDialogue(
  state: GameState,
  context: DialogueRunnerContext
): DialogueStepResult {
  return runDialogueUntilPause(incrementDialogueCursor(state), context);
}

function incrementDialogueCursor(state: GameState): GameState {
  return {
    ...state,
    dialogue: {
      ...state.dialogue,
      cursor: state.dialogue.cursor + 1,
    },
  };
}

function finishDialogue(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  context: DialogueRunnerContext
): DialogueStepResult {
  const nextEventId =
    state.dialogue.activeEventId == null
      ? undefined
      : context.eventDefinitionsById[state.dialogue.activeEventId]?.nextEventId;
  const nextEvent =
    nextEventId == null ? undefined : context.eventDefinitionsById[nextEventId];
  if (nextEvent != null) {
    return runDialogueUntilPause(startEvent(state, nextEvent), context);
  }

  return {
    state: {
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
    },
    characterDefinitions,
    currentNode: null,
  };
}
