"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeGrainTrade = executeGrainTrade;
const assert_1 = require("../../shared/assert");
const grain_market_1 = require("./grain-market");
const grain_shop_mutations_1 = require("./grain-shop-mutations");
const grain_shop_snapshot_1 = require("./grain-shop-snapshot");
function executeGrainTrade(state, characterDefinitions, playerCharacterId, mode, quantity, grainPrice) {
    const total = (0, grain_market_1.getTradeTotal)(grainPrice, quantity);
    const playerCharacter = characterDefinitions.find((characterDefinition) => characterDefinition.id === playerCharacterId);
    (0, assert_1.assertExists)(playerCharacter, `Player character not found for id "${playerCharacterId}".`);
    const snapshot = (0, grain_shop_snapshot_1.createGrainShopSnapshot)(state, playerCharacter);
    if (mode === "buy") {
        if (snapshot.money < total) {
            return {
                ok: false,
                errorTitle: "银钱不足",
                errorMessage: "囊中羞涩，买不起这么多粮食。",
            };
        }
        let nextState = state;
        let nextCharacters = characterDefinitions;
        const goldMutation = (0, grain_shop_mutations_1.mutatePlayerGold)(nextState, nextCharacters, playerCharacterId, -total);
        nextState = goldMutation.state;
        nextCharacters = goldMutation.characterDefinitions;
        nextState = (0, grain_shop_mutations_1.mutateGrainShopFood)(nextState, quantity);
        nextState = (0, grain_shop_mutations_1.advanceGrainShopTime)(nextState);
        return {
            ok: true,
            mutation: { state: nextState, characterDefinitions: nextCharacters },
            message: `已购入 ${quantity} 石粮食，花费 ${total} 文。`,
        };
    }
    if (snapshot.food < quantity) {
        return {
            ok: false,
            errorTitle: "粮食不足",
            errorMessage: "随身带的粮食不够这么多。",
        };
    }
    let nextState = state;
    let nextCharacters = characterDefinitions;
    const goldMutation = (0, grain_shop_mutations_1.mutatePlayerGold)(nextState, nextCharacters, playerCharacterId, total);
    nextState = goldMutation.state;
    nextCharacters = goldMutation.characterDefinitions;
    nextState = (0, grain_shop_mutations_1.mutateGrainShopFood)(nextState, -quantity);
    nextState = (0, grain_shop_mutations_1.advanceGrainShopTime)(nextState);
    return {
        ok: true,
        mutation: { state: nextState, characterDefinitions: nextCharacters },
        message: `已卖出 ${quantity} 石粮食，收入 ${total} 文。`,
    };
}
