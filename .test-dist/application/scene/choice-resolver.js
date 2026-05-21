"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChoiceOption = resolveChoiceOption;
const effect_applier_1 = require("../effects/effect-applier");
const event_runner_1 = require("../events/event-runner");
function resolveChoiceOption(state, selectedOption, context) {
    let nextState = state;
    let nextCharacterDefinitions = context.characterDefinitions;
    if (selectedOption.effects != null && selectedOption.effects.length > 0) {
        const effectResult = (0, effect_applier_1.applyEffects)(nextState, selectedOption.effects, {
            characterDefinitions: nextCharacterDefinitions,
        });
        nextState = effectResult.state;
        nextCharacterDefinitions = effectResult.characterDefinitions;
    }
    if (selectedOption.nextEventId != null) {
        const targetEvent = context.eventDefinitionsById[selectedOption.nextEventId];
        if (targetEvent != null) {
            nextState = (0, event_runner_1.startEvent)(nextState, targetEvent);
        }
    }
    else if (selectedOption.nextSceneId != null) {
        nextState = {
            ...nextState,
            scene: {
                ...nextState.scene,
                activeSceneId: selectedOption.nextSceneId,
                cursor: 0,
                status: "playing",
            },
        };
    }
    else {
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
