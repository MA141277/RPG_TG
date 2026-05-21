"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterCity = enterCity;
function enterCity(state, cityId) {
    return {
        ...state,
        world: {
            ...state.world,
            currentCityId: cityId,
            currentHouseId: null,
        },
        ui: {
            ...state.ui,
            overlayView: null,
            houseSession: null,
            currentView: "city",
        },
    };
}
