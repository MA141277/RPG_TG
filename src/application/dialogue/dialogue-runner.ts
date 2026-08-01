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
import { runEventPlayableRuntime } from "../events/event-playable-runtime";
import {
  continueToEvent,
  createEventContinuationTracker,
} from "../events/event-continuation";
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
  let continuationVisitedEventIds = createEventContinuationTracker([
    state.dialogue.activeEventId,
  ]);

  while (true) {
    const activeEvent =
      nextState.dialogue.activeEventId == null
        ? null
        : context.eventDefinitionsById[nextState.dialogue.activeEventId] ?? null;
    const playableResult = runEventPlayableRuntime({
      state: nextState,
      characterDefinitions: nextCharacterDefinitions,
      eventDefinition: activeEvent,
      activityDefinitionsById: context.activityDefinitionsById,
      textEntriesById: context.textEntriesById,
    });
    if (playableResult?.handled) {
      return {
        state: playableResult.state,
        characterDefinitions: playableResult.characterDefinitions,
        currentNode: null,
      };
    }

    nextState = syncActiveEventPresentation(
      nextState,
      context.eventDefinitionsById
    );

    if (nextState.dialogue.activeDialogueId == null) {
      const continuedState = continueDialogueEvent(
        nextState,
        context,
        continuationVisitedEventIds
      );
      if (continuedState != null) {
        nextState = continuedState.state;
        continuationVisitedEventIds = continuedState.visitedEventIds;
        continue;
      }
      return finishDialogue(nextState, nextCharacterDefinitions);
    }

    const activeDialogue =
      context.dialogueDefinitionsById[nextState.dialogue.activeDialogueId];
    if (activeDialogue == null) {
      const continuedState = continueDialogueEvent(
        nextState,
        context,
        continuationVisitedEventIds
      );
      if (continuedState != null) {
        nextState = continuedState.state;
        continuationVisitedEventIds = continuedState.visitedEventIds;
        continue;
      }
      return finishDialogue(nextState, nextCharacterDefinitions);
    }

    if (activeDialogue.screen != null) {
      return {
        state: {
          ...nextState,
          dialogue: {
            ...nextState.dialogue,
            status:
              activeDialogue.screen.mode === "choice"
                ? "waiting-choice"
                : "playing",
          },
        },
        characterDefinitions: nextCharacterDefinitions,
        currentNode: null,
      };
    }

    const currentNode = activeDialogue.nodes?.[nextState.dialogue.cursor] ?? null;
    if (currentNode == null) {
      const continuedState = continueDialogueEvent(
        nextState,
        context,
        continuationVisitedEventIds
      );
      if (continuedState != null) {
        nextState = continuedState.state;
        continuationVisitedEventIds = continuedState.visitedEventIds;
        continue;
      }
      return finishDialogue(nextState, nextCharacterDefinitions);
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
      continuationVisitedEventIds = createEventContinuationTracker([
        targetEvent?.id,
      ]);
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

  return finishDialogue(nextState, nextCharacterDefinitions);
}

export function advanceDialogue(
  state: GameState,
  context: DialogueRunnerContext
): DialogueStepResult {
  const activeDialogueId = state.dialogue.activeDialogueId;
  const activeDialogue =
    activeDialogueId == null
      ? null
      : context.dialogueDefinitionsById[activeDialogueId] ?? null;

  if (activeDialogue?.screen != null) {
    if (activeDialogue.screen.mode === "choice") {
      return {
        state: {
          ...state,
          dialogue: {
            ...state.dialogue,
            status: "waiting-choice",
          },
        },
        characterDefinitions: context.characterDefinitions,
        currentNode: null,
      };
    }

    const continuation = continueToEvent({
      state,
      eventDefinitionsById: context.eventDefinitionsById,
      sourceEventId: state.dialogue.activeEventId,
      targetEventId: activeDialogue.screen.nextEventId,
      visitedEventIds: createEventContinuationTracker([
        state.dialogue.activeEventId,
      ]),
    });
    if (continuation == null) {
      return finishDialogue(state, context.characterDefinitions);
    }

    return runDialogueUntilPause(continuation.state, context);
  }

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
  characterDefinitions: CharacterDefinition[]
): DialogueStepResult {
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

function continueDialogueEvent(
  state: GameState,
  context: DialogueRunnerContext,
  visitedEventIds: Iterable<string>
) {
  const activeEventId = state.dialogue.activeEventId;
  const nextEventId =
    activeEventId == null
      ? undefined
      : context.eventDefinitionsById[activeEventId]?.nextEventId;
  return continueToEvent({
    state,
    eventDefinitionsById: context.eventDefinitionsById,
    sourceEventId: activeEventId,
    targetEventId: nextEventId,
    visitedEventIds,
  });
}
