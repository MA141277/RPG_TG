"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseTeaHouseTime = increaseTeaHouseTime;
exports.increaseTeaHouseIntel = increaseTeaHouseIntel;
exports.mutateTeaHouseActorFavorability = mutateTeaHouseActorFavorability;
exports.mutatePlayerGold = mutatePlayerGold;
exports.mutatePlayerRhetoric = mutatePlayerRhetoric;
const tea_house_1 = require("../../domain/tea-house");
const city_npc_pool_state_1 = require("../city-npcs/city-npc-pool-state");
function withVariable(state, key, value) {
    return {
        ...state,
        runtime: {
            ...state.runtime,
            variables: {
                ...state.runtime.variables,
                [key]: value,
            },
        },
    };
}
function readNumericVariable(state, key, fallback) {
    const value = state.runtime.variables[key];
    return typeof value === "number" ? value : fallback;
}
function increaseTeaHouseTime(state, houseId, amount) {
    const key = (0, tea_house_1.getTeaHouseTimeVariableKey)(houseId);
    return withVariable(state, key, readNumericVariable(state, key, 0) + amount);
}
function increaseTeaHouseIntel(state, houseId, amount) {
    const key = (0, tea_house_1.getTeaHouseIntelVariableKey)(houseId);
    return withVariable(state, key, readNumericVariable(state, key, 0) + amount);
}
function mutateTeaHouseActorFavorability(state, houseId, cityId, actorId, isFixedHost, delta) {
    if (isFixedHost) {
        const key = (0, tea_house_1.getTeaHouseFixedNpcFavorabilityVariableKey)(houseId, actorId);
        return withVariable(state, key, readNumericVariable(state, key, 0) + delta);
    }
    return (0, city_npc_pool_state_1.mutateCityNpcFavorability)(state, cityId, actorId, delta);
}
function mutatePlayerGold(state, characterDefinitions, playerCharacterId, delta) {
    return {
        state,
        characterDefinitions: characterDefinitions.map((characterDefinition) => {
            if (characterDefinition.id !== playerCharacterId) {
                return characterDefinition;
            }
            return {
                ...characterDefinition,
                stats: {
                    ...characterDefinition.stats,
                    gold: characterDefinition.stats.gold + delta,
                },
            };
        }),
    };
}
function mutatePlayerRhetoric(state, characterDefinitions, playerCharacterId, delta) {
    return {
        state,
        characterDefinitions: characterDefinitions.map((characterDefinition) => {
            if (characterDefinition.id !== playerCharacterId || characterDefinition.skills == null) {
                return characterDefinition;
            }
            return {
                ...characterDefinition,
                skills: {
                    ...characterDefinition.skills,
                    rhetoric: Math.max(0, characterDefinition.skills.rhetoric + delta),
                },
            };
        }),
    };
}
