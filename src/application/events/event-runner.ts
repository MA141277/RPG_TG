import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";

export function startEvent(state: GameState, eventDefinition: EventDefinition): GameState {
  const currentHistory = state.runtime.eventHistory[eventDefinition.id];
  const nextFiredCount = (currentHistory?.firedCount ?? 0) + 1;
  const lastTriggeredOn = [
    state.calendar.year,
    String(state.calendar.month).padStart(2, "0"),
    String(state.calendar.day).padStart(2, "0"),
  ].join("-");

  return {
    ...state,
    dialogue: {
      ...state.dialogue,
      activeEventId: eventDefinition.id,
      activeDialogueId: null,
      cursor: 0,
      status: "idle",
    },
    runtime: {
      ...state.runtime,
      eventHistory: {
        ...state.runtime.eventHistory,
        [eventDefinition.id]: {
          firedCount: nextFiredCount,
          lastTriggeredOn,
        },
      },
      variables:
        eventDefinition.occurrence === "once-per-chapter"
          ? {
              ...state.runtime.variables,
              [`${eventDefinition.id}:${state.calendar.chapterId}`]: 1,
            }
          : state.runtime.variables,
    },
  };
}
