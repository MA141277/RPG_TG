import type { EventDefinition } from "../../domain/event";
import type { GameState, ViewName } from "../../domain/game-state";

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
    scene: {
      ...state.scene,
      activeEventId: eventDefinition.id,
      activeSceneId: eventDefinition.entrySceneId,
      backgroundId: null,
      returnView: resolveSceneReturnView(state),
      cursor: 0,
      status: "playing",
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
    ui: {
      ...state.ui,
      currentView: "scene",
    },
  };
}

function resolveSceneReturnView(state: GameState): ViewName {
  if (state.scene.returnView != null) {
    return state.scene.returnView;
  }

  if (state.ui.currentView !== "scene") {
    return state.ui.currentView;
  }

  return state.world.currentHouseId == null ? "city" : "house";
}
