"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyEffects = applyEffects;
function applyEffects(state, effects, context) {
    let nextState = state;
    let nextCharacterDefinitions = context.characterDefinitions;
    for (const effect of effects) {
        switch (effect.type) {
            case "set-flag":
                nextState = {
                    ...nextState,
                    runtime: {
                        ...nextState.runtime,
                        flags: {
                            ...nextState.runtime.flags,
                            [effect.key]: effect.value,
                        },
                    },
                };
                break;
            case "set-variable":
                nextState = {
                    ...nextState,
                    runtime: {
                        ...nextState.runtime,
                        variables: {
                            ...nextState.runtime.variables,
                            [effect.key]: effect.value,
                        },
                    },
                };
                break;
            case "change-variable": {
                const currentValue = nextState.runtime.variables[effect.key];
                const numericValue = typeof currentValue === "number" ? currentValue : 0;
                nextState = {
                    ...nextState,
                    runtime: {
                        ...nextState.runtime,
                        variables: {
                            ...nextState.runtime.variables,
                            [effect.key]: numericValue + effect.delta,
                        },
                    },
                };
                break;
            }
            case "modify-character-stat":
                nextCharacterDefinitions = nextCharacterDefinitions.map((characterDefinition) => {
                    if (characterDefinition.id !== effect.characterId) {
                        return characterDefinition;
                    }
                    const statKey = effect.stat;
                    return {
                        ...characterDefinition,
                        stats: {
                            ...characterDefinition.stats,
                            [statKey]: characterDefinition.stats[statKey] + effect.delta,
                        },
                    };
                });
                break;
            case "start-mission":
                nextState = {
                    ...nextState,
                    missions: {
                        ...nextState.missions,
                        activeMissionId: effect.missionId,
                    },
                };
                break;
            case "finish-mission":
                nextState = {
                    ...nextState,
                    missions: {
                        ...nextState.missions,
                        activeMissionId: nextState.missions.activeMissionId === effect.missionId
                            ? null
                            : nextState.missions.activeMissionId,
                        completedMissionIds: nextState.missions.completedMissionIds.includes(effect.missionId)
                            ? nextState.missions.completedMissionIds
                            : [...nextState.missions.completedMissionIds, effect.missionId],
                    },
                };
                break;
            default:
                break;
        }
    }
    return {
        state: nextState,
        characterDefinitions: nextCharacterDefinitions,
    };
}
