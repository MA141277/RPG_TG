"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectCurrentCity = selectCurrentCity;
function selectCurrentCity(state, cityDefinitions) {
    return cityDefinitions.find((cityDefinition) => cityDefinition.id === state.world.currentCityId);
}
