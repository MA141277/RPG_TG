"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameStore = createGameStore;
const choice_resolver_1 = require("../scene/choice-resolver");
const scene_runner_1 = require("../scene/scene-runner");
function createGameStore(initialState, content) {
    let state = initialState;
    let characterDefinitions = content.characterDefinitions;
    let currentAction = null;
    return {
        getSnapshot() {
            return {
                state,
                characterDefinitions,
                currentAction,
            };
        },
        syncScene() {
            const result = (0, scene_runner_1.runSceneUntilPause)(state, {
                sceneDefinitionsById: content.sceneDefinitionsById,
                eventDefinitionsById: content.eventDefinitionsById,
                characterDefinitions,
            });
            state = result.state;
            characterDefinitions = result.characterDefinitions;
            currentAction = result.currentAction;
            return this.getSnapshot();
        },
        advanceScene() {
            const result = (0, scene_runner_1.advanceScene)(state, {
                sceneDefinitionsById: content.sceneDefinitionsById,
                eventDefinitionsById: content.eventDefinitionsById,
                characterDefinitions,
            });
            state = result.state;
            characterDefinitions = result.characterDefinitions;
            currentAction = result.currentAction;
            return this.getSnapshot();
        },
        chooseOption(selectedOption) {
            const result = (0, choice_resolver_1.resolveChoiceOption)(state, selectedOption, {
                sceneDefinitionsById: content.sceneDefinitionsById,
                eventDefinitionsById: content.eventDefinitionsById,
                characterDefinitions,
            });
            state = result.state;
            characterDefinitions = result.characterDefinitions;
            return this.syncScene();
        },
        replaceState(nextState) {
            state = nextState;
            return this.getSnapshot();
        },
    };
}
