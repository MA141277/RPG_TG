"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickCityNpcActivityLocation = pickCityNpcActivityLocation;
exports.ensureCityNpcPoolsForCurrentDay = ensureCityNpcPoolsForCurrentDay;
function createCalendarDateKey(state) {
    const month = String(state.calendar.month).padStart(2, "0");
    const day = String(state.calendar.day).padStart(2, "0");
    return `${state.calendar.year}-${month}-${day}`;
}
function pickCityNpcActivityLocation(residentDefinition, randomSource = Math.random) {
    const weightedLocations = Object.entries(residentDefinition.activityWeight).filter((entry) => {
        const [, weight] = entry;
        return typeof weight === "number" && weight > 0;
    });
    const totalWeight = weightedLocations.reduce((sum, [, weight]) => sum + weight, 0);
    if (totalWeight <= 0) {
        return null;
    }
    let threshold = randomSource() * totalWeight;
    for (const [locationId, weight] of weightedLocations) {
        threshold -= weight;
        if (threshold < 0) {
            return locationId;
        }
    }
    return weightedLocations.at(-1)?.[0] ?? null;
}
function refreshCityNpcPool(poolDefinition, existingPool, dateKey, randomSource) {
    const residents = Object.fromEntries(poolDefinition.residents.map((residentDefinition) => {
        const previousResident = existingPool?.residents[residentDefinition.id];
        return [
            residentDefinition.id,
            {
                npcId: residentDefinition.id,
                favorability: previousResident?.favorability ?? residentDefinition.favorability,
                currentLocationId: pickCityNpcActivityLocation(residentDefinition, randomSource),
            },
        ];
    }));
    return {
        cityId: poolDefinition.cityId,
        lastRefreshedOn: dateKey,
        residents,
    };
}
function ensureCityNpcPoolsForCurrentDay(state, poolDefinitions, randomSource = Math.random) {
    const dateKey = createCalendarDateKey(state);
    let didChange = false;
    const nextPools = { ...state.runtime.cityNpcPools };
    for (const poolDefinition of poolDefinitions) {
        const existingPool = nextPools[poolDefinition.cityId];
        if (existingPool?.lastRefreshedOn === dateKey) {
            continue;
        }
        nextPools[poolDefinition.cityId] = refreshCityNpcPool(poolDefinition, existingPool, dateKey, randomSource);
        didChange = true;
    }
    if (!didChange) {
        return state;
    }
    return {
        ...state,
        runtime: {
            ...state.runtime,
            cityNpcPools: nextPools,
        },
    };
}
