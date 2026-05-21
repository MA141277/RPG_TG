"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSceneUntilPause = runSceneUntilPause;
exports.advanceScene = advanceScene;
const effect_applier_1 = require("../effects/effect-applier");
const event_runner_1 = require("../events/event-runner");
function runSceneUntilPause(state, context) {
    let nextState = state;
    let nextCharacterDefinitions = context.characterDefinitions;
    while (nextState.scene.activeSceneId != null) {
        const activeScene = context.sceneDefinitionsById[nextState.scene.activeSceneId];
        if (activeScene == null) {
            return finishScene(nextState, nextCharacterDefinitions);
        }
        const currentAction = activeScene.actions[nextState.scene.cursor] ?? null;
        if (currentAction == null) {
            return finishScene(nextState, nextCharacterDefinitions);
        }
        if (currentAction.type === "background" ||
            currentAction.type === "music" ||
            currentAction.type === "dialogue") {
            return {
                state: {
                    ...nextState,
                    scene: {
                        ...nextState.scene,
                        status: "playing",
                    },
                },
                characterDefinitions: nextCharacterDefinitions,
                currentAction,
            };
        }
        if (currentAction.type === "choice") {
            return {
                state: {
                    ...nextState,
                    scene: {
                        ...nextState.scene,
                        status: "waiting-choice",
                    },
                },
                characterDefinitions: nextCharacterDefinitions,
                currentAction,
            };
        }
        if (currentAction.type === "effect") {
            const effectResult = (0, effect_applier_1.applyEffects)(nextState, currentAction.effects, {
                characterDefinitions: nextCharacterDefinitions,
            });
            nextState = incrementSceneCursor(effectResult.state);
            nextCharacterDefinitions = effectResult.characterDefinitions;
            continue;
        }
        if (currentAction.type === "jump") {
            nextState = {
                ...nextState,
                scene: {
                    ...nextState.scene,
                    activeSceneId: currentAction.nextSceneId,
                    cursor: 0,
                    status: "playing",
                },
            };
            continue;
        }
        if (currentAction.type === "start-event") {
            const targetEvent = context.eventDefinitionsById[currentAction.eventId];
            nextState =
                targetEvent == null ? incrementSceneCursor(nextState) : (0, event_runner_1.startEvent)(nextState, targetEvent);
            continue;
        }
        nextState = incrementSceneCursor(nextState);
    }
    return finishScene(nextState, nextCharacterDefinitions);
}
function advanceScene(state, context) {
    return runSceneUntilPause(incrementSceneCursor(state), context);
}
function incrementSceneCursor(state) {
    return {
        ...state,
        scene: {
            ...state.scene,
            cursor: state.scene.cursor + 1,
        },
    };
}
function finishScene(state, characterDefinitions) {
    return {
        state: {
            ...state,
            scene: {
                ...state.scene,
                activeEventId: null,
                activeSceneId: null,
                cursor: 0,
                status: "idle",
            },
            ui: {
                ...state.ui,
                currentView: state.world.currentHouseId == null ? "city" : "house",
            },
        },
        characterDefinitions,
        currentAction: null,
    };
}
