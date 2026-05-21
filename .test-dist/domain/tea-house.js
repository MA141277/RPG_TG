"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEA_HOUSE_TOPIC_CARDS = void 0;
exports.getTeaHouseIntelVariableKey = getTeaHouseIntelVariableKey;
exports.getTeaHouseTimeVariableKey = getTeaHouseTimeVariableKey;
exports.getTeaHouseFixedNpcFavorabilityVariableKey = getTeaHouseFixedNpcFavorabilityVariableKey;
exports.TEA_HOUSE_TOPIC_CARDS = ["义", "利", "名", "情", "势"];
function getTeaHouseIntelVariableKey(houseId) {
    return `${houseId}.intel`;
}
function getTeaHouseTimeVariableKey(houseId) {
    return `${houseId}.time`;
}
function getTeaHouseFixedNpcFavorabilityVariableKey(houseId, actorId) {
    return `${houseId}.${actorId}.favorability`;
}
