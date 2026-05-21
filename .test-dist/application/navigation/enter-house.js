"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterHouse = enterHouse;
const event_runner_1 = require("../events/event-runner");
function enterHouse(state, houseDefinition, eventDefinitionsById) {
    const nextState = {
        ...state,
        world: {
            ...state.world,
            currentHouseId: houseDefinition.id,
        },
        ui: {
            ...state.ui,
            currentView: "house",
        },
    };
    if (houseDefinition.onEnterEventId == null) {
        return nextState;
    }
    const onEnterEvent = eventDefinitionsById[houseDefinition.onEnterEventId];
    if (onEnterEvent == null) {
        return nextState;
    }
    return (0, event_runner_1.startEvent)(nextState, onEnterEvent);
}
