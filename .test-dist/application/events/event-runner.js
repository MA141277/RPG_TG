"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEvent = startEvent;
function startEvent(state, eventDefinition) {
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
            variables: eventDefinition.occurrence === "once-per-chapter"
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
