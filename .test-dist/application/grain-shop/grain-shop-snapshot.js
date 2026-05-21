"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrainShopSnapshot = createGrainShopSnapshot;
const grain_shop_1 = require("../../domain/grain-shop");
const grain_shop_content_1 = require("../../content/houses/grain-shop-content");
function readNumericVariable(state, key, fallback) {
    const value = state.runtime.variables[key];
    return typeof value === "number" ? value : fallback;
}
function createGrainShopSnapshot(state, playerCharacter) {
    return {
        money: playerCharacter.stats.gold,
        food: readNumericVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.food, grain_shop_content_1.grainShopInitialValues.food),
        math: playerCharacter.skills?.arithmetic ?? 0,
        relationship: readNumericVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.relationship, grain_shop_content_1.grainShopInitialValues.relationship),
        time: readNumericVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.time, grain_shop_content_1.grainShopInitialValues.time),
        grainPrice: readNumericVariable(state, grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.grainPrice, 100),
    };
}
