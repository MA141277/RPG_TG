"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollGrainPrice = rollGrainPrice;
exports.pickNpcGreeting = pickNpcGreeting;
exports.pickNpcDefaultLine = pickNpcDefaultLine;
exports.pickMarketRumor = pickMarketRumor;
exports.getInvestigateDialogue = getInvestigateDialogue;
exports.getTradeTotal = getTradeTotal;
exports.setGrainPriceVariable = setGrainPriceVariable;
const grain_shop_1 = require("../../domain/grain-shop");
const grain_shop_content_1 = require("../../content/houses/grain-shop-content");
const random_1 = require("../../shared/random");
function rollGrainPrice() {
    return (0, random_1.randomInt)(grain_shop_1.GRAIN_PRICE_MIN, grain_shop_1.GRAIN_PRICE_MAX);
}
function pickNpcGreeting() {
    return (0, random_1.pickRandom)(grain_shop_content_1.grainShopNpcGreetings);
}
function pickNpcDefaultLine() {
    return (0, random_1.pickRandom)(grain_shop_content_1.grainShopNpcDefaultLines);
}
function pickMarketRumor() {
    return (0, random_1.pickRandom)(grain_shop_content_1.grainShopMarketRumors);
}
function getInvestigateDialogue(price) {
    if (price > 130) {
        return "近来怕是要涨。";
    }
    if (price < 100) {
        return "如今粮路通畅，价倒是便宜。";
    }
    return "粮价还算平稳。";
}
function getTradeTotal(grainPrice, quantity) {
    return grainPrice * quantity;
}
function setGrainPriceVariable(variables, grainPrice) {
    return {
        ...variables,
        [grain_shop_1.GRAIN_SHOP_VARIABLE_KEYS.grainPrice]: grainPrice,
    };
}
