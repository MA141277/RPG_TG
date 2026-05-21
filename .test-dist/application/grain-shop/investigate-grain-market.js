"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investigateGrainMarket = investigateGrainMarket;
const assert_1 = require("../../shared/assert");
const grain_market_1 = require("./grain-market");
const grain_shop_mutations_1 = require("./grain-shop-mutations");
const grain_shop_snapshot_1 = require("./grain-shop-snapshot");
function investigateGrainMarket(state, characterDefinitions, playerCharacterId) {
    const playerCharacter = characterDefinitions.find((characterDefinition) => characterDefinition.id === playerCharacterId);
    (0, assert_1.assertExists)(playerCharacter, `Player character not found for id "${playerCharacterId}".`);
    const snapshot = (0, grain_shop_snapshot_1.createGrainShopSnapshot)(state, playerCharacter);
    let nextState = (0, grain_shop_mutations_1.mutateGrainShopRelationship)(state, 1);
    nextState = (0, grain_shop_mutations_1.advanceGrainShopTime)(nextState);
    return {
        mutation: {
            state: nextState,
            characterDefinitions,
        },
        dialogue: (0, grain_market_1.getInvestigateDialogue)(snapshot.grainPrice),
        rumor: (0, grain_market_1.pickMarketRumor)(),
        grainPrice: snapshot.grainPrice,
    };
}
