"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAccountingReward = applyAccountingReward;
const grain_shop_mutations_1 = require("./grain-shop-mutations");
const accounting_minigame_1 = require("./accounting-minigame");
function applyAccountingReward(state, characterDefinitions, playerCharacterId, grade) {
    const reward = (0, accounting_minigame_1.getAccountingGradeReward)(grade);
    let nextState = state;
    let nextCharacters = characterDefinitions;
    const goldMutation = (0, grain_shop_mutations_1.mutatePlayerGold)(nextState, nextCharacters, playerCharacterId, reward.money);
    nextState = goldMutation.state;
    nextCharacters = goldMutation.characterDefinitions;
    const mathMutation = (0, grain_shop_mutations_1.mutatePlayerArithmetic)(nextState, nextCharacters, playerCharacterId, reward.math);
    nextState = mathMutation.state;
    nextCharacters = mathMutation.characterDefinitions;
    nextState = (0, grain_shop_mutations_1.mutateGrainShopRelationship)(nextState, reward.relationship);
    nextState = (0, grain_shop_mutations_1.advanceGrainShopTime)(nextState);
    return {
        state: nextState,
        characterDefinitions: nextCharacters,
    };
}
