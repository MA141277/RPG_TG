"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCityNpcPoolDefinition = getCityNpcPoolDefinition;
exports.getCityNpcDefinitionById = getCityNpcDefinitionById;
exports.listCityNpcDefinitionsForLocation = listCityNpcDefinitionsForLocation;
exports.sampleCityNpcIdsForLocation = sampleCityNpcIdsForLocation;
exports.readCityNpcFavorability = readCityNpcFavorability;
exports.mutateCityNpcFavorability = mutateCityNpcFavorability;
function sampleWithoutReplacement(items, maxCount, randomSource) {
    const pool = [...items];
    const result = [];
    while (pool.length > 0 && result.length < maxCount) {
        const index = Math.floor(randomSource() * pool.length);
        const [pickedItem] = pool.splice(index, 1);
        if (pickedItem != null) {
            result.push(pickedItem);
        }
    }
    return result;
}
function getCityNpcPoolDefinition(poolDefinitions, cityId) {
    return (poolDefinitions.find((poolDefinition) => poolDefinition.cityId === cityId) ?? null);
}
function getCityNpcDefinitionById(poolDefinitions, cityId, npcId) {
    const poolDefinition = getCityNpcPoolDefinition(poolDefinitions, cityId);
    if (poolDefinition == null) {
        return null;
    }
    return (poolDefinition.residents.find((residentDefinition) => residentDefinition.id === npcId) ??
        null);
}
function listCityNpcDefinitionsForLocation(state, poolDefinitions, cityId, locationId) {
    const poolDefinition = getCityNpcPoolDefinition(poolDefinitions, cityId);
    const runtimePool = state.runtime.cityNpcPools[cityId];
    if (poolDefinition == null || runtimePool == null) {
        return [];
    }
    return poolDefinition.residents.filter((residentDefinition) => runtimePool.residents[residentDefinition.id]?.currentLocationId === locationId);
}
function sampleCityNpcIdsForLocation(state, poolDefinitions, cityId, locationId, maxCount, randomSource = Math.random) {
    return sampleWithoutReplacement(listCityNpcDefinitionsForLocation(state, poolDefinitions, cityId, locationId).map((residentDefinition) => residentDefinition.id), maxCount, randomSource);
}
function readCityNpcFavorability(state, cityId, npcId, fallback) {
    const favorability = state.runtime.cityNpcPools[cityId]?.residents[npcId]?.favorability;
    return typeof favorability === "number" ? favorability : fallback;
}
function mutateCityNpcFavorability(state, cityId, npcId, delta) {
    const runtimePool = state.runtime.cityNpcPools[cityId];
    const resident = runtimePool?.residents[npcId];
    if (runtimePool == null || resident == null) {
        return state;
    }
    return {
        ...state,
        runtime: {
            ...state.runtime,
            cityNpcPools: {
                ...state.runtime.cityNpcPools,
                [cityId]: {
                    ...runtimePool,
                    residents: {
                        ...runtimePool.residents,
                        [npcId]: {
                            ...resident,
                            favorability: resident.favorability + delta,
                        },
                    },
                },
            },
        },
    };
}
