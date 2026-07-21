import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";

export function resolveEventPresentationDialogueId(
  eventDefinition: EventDefinition | null | undefined
): string | null {
  if (eventDefinition == null) {
    return null;
  }

  const dialogueId = eventDefinition.dialogueId.trim();
  return dialogueId.length > 0 ? dialogueId : null;
}

export function resolveActiveEventPresentationDialogueId(
  state: Pick<GameState, "dialogue">,
  eventDefinitionsById: Record<string, EventDefinition>
): string | null {
  if (state.dialogue.activeEventId == null) {
    return null;
  }

  return resolveEventPresentationDialogueId(
    eventDefinitionsById[state.dialogue.activeEventId]
  );
}

export function syncActiveEventPresentation(
  state: GameState,
  eventDefinitionsById: Record<string, EventDefinition>
): GameState {
  if (state.dialogue.activeDialogueId != null) {
    return state;
  }

  const activeDialogueId = resolveActiveEventPresentationDialogueId(
    state,
    eventDefinitionsById
  );
  if (activeDialogueId == null) {
    return state;
  }

  return {
    ...state,
    dialogue: {
      ...state.dialogue,
      activeDialogueId,
      cursor: 0,
      status: "playing",
    },
    ui: {
      ...state.ui,
      currentView: "dialogue",
    },
  };
}
