"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanceGrainShopTime = advanceGrainShopTime;
exports.mutatePlayerGold = mutatePlayerGold;
exports.mutatePlayerArithmetic = mutatePlayerArithmetic;
exports.mutateGrainShopFood = mutateGrainShopFood;
exports.mutateGrainShopRelationship = mutateGrainShopRelationship;
exports.setGrainPrice = setGrainPrice;
const grain_shop_1 = require("../../domain/grain-shop");
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
function readVariable(state, key, fallback) {
    const value = state.runtime.variables[key];
    return typeof value === "number" ? value : fallback;
}
function advanceGrainShopTime(state) {
    const currentTime = readVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.time, 1);
    return withVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.time, currentTime + 1);
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
function mutatePlayerArithmetic(state, characterDefinitions, playerCharacterId, delta) {
    return {
        state,
        characterDefinitions: characterDefinitions.map((characterDefinition) => {
            if (characterDefinition.id !== playerCharacterId) {
                return characterDefinition;
            }
            const baseSkills = characterDefinition.skills;
            if (baseSkills == null) {
                return characterDefinition;
            }
            return {
                ...characterDefinition,
                skills: {
                    ...baseSkills,
                    arithmetic: Math.max(0, baseSkills.arithmetic + delta),
                },
            };
        }),
    };
}
function mutateGrainShopFood(state, delta) {
    const currentFood = readVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.food, 0);
    return withVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.food, Math.max(0, currentFood + delta));
}
function mutateGrainShopRelationship(state, delta) {
    const currentRelationship = readVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.relationship, 0);
    return withVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.relationship, currentRelationship + delta);
}
function setGrainPrice(state, grainPrice) {
    return withVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.grainPrice, grainPrice);
}
