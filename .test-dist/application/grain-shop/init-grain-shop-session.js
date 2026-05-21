"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGrainShopSession = initGrainShopSession;
const grain_shop_1 = require("../../domain/grain-shop");
const grain_shop_content_1 = require("../../content/houses/grain-shop-content");
const random_1 = require("../../shared/random");
function initGrainShopSession(state, characterDefinitions) {
    const nextVariables = { ...state.runtime.variables };
    const hasFood = typeof nextVariables[grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.food] === "number";
    if (!hasFood) {
        nextVariables[grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.food] = grain_shop_content_1.grainShopInitialValues.food;
        nextVariables[grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.relationship] =
            grain_shop_content_1.grainShopInitialValues.relationship;
        nextVariables[grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.time] = grain_shop_content_1.grainShopInitialValues.time;
        nextVariables[grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.grainPrice] = (0, random_1.randomInt)(grain_shop_1.GRAIN_PRICE_MIN, grain_shop_1.GRAIN_PRICE_MAX);
    }
    return {
        state: {
            ...state,
            runtime: {
                ...state.runtime,
                variables: nextVariables,
            },
        },
        characterDefinitions,
    };
}
