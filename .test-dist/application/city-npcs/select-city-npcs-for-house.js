"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectCityNpcSummariesForHouse = selectCityNpcSummariesForHouse;
function selectCityNpcSummariesForHouse(state, houseDefinition, poolDefinitions) {
    if (houseDefinition.activityLocationId == null) {
        return [];
    }
    const poolDefinition = poolDefinitions.find((candidatePool) => candidatePool.cityId === houseDefinition.cityId);
    const runtimePool = state.runtime.cityNpcPools[houseDefinition.cityId];
    if (poolDefinition == null || runtimePool == null) {
        return [];
    }
    return poolDefinition.residents
        .filter((residentDefinition) => runtimePool.residents[residentDefinition.id]?.currentLocationId ===
        houseDefinition.activityLocationId)
        .map((residentDefinition) => ({
        id: residentDefinition.id,
        name: residentDefinition.name,
        ...(residentDefinition.title === ""
            ? {}
            : { title: residentDefinition.title }),
    }));
}
