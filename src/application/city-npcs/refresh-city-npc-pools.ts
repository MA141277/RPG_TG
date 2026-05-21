import type {
  CityNpcActivityLocationId,
  CityNpcDefinition,
  CityNpcPoolDefinition,
  CityNpcPoolRuntimeState,
} from "../../domain/city-npc";
import type { GameState } from "../../domain/game-state";

type RandomSource = () => number;

function createCalendarDateKey(state: GameState): string {
  const month = String(state.calendar.month).padStart(2, "0");
  const day = String(state.calendar.day).padStart(2, "0");
  return `${state.calendar.year}-${month}-${day}`;
}

export function pickCityNpcActivityLocation(
  residentDefinition: CityNpcDefinition,
  randomSource: RandomSource = Math.random
): CityNpcActivityLocationId | null {
  const weightedLocations = Object.entries(residentDefinition.activityWeight).filter(
    (entry): entry is [CityNpcActivityLocationId, number] => {
      const [, weight] = entry;
      return typeof weight === "number" && weight > 0;
    }
  );

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

function refreshCityNpcPool(
  poolDefinition: CityNpcPoolDefinition,
  existingPool: CityNpcPoolRuntimeState | undefined,
  dateKey: string,
  randomSource: RandomSource
): CityNpcPoolRuntimeState {
  const residents = Object.fromEntries(
    poolDefinition.residents.map((residentDefinition) => {
      const previousResident = existingPool?.residents[residentDefinition.id];

      return [
        residentDefinition.id,
        {
          npcId: residentDefinition.id,
          favorability:
            previousResident?.favorability ?? residentDefinition.favorability,
          currentLocationId: pickCityNpcActivityLocation(
            residentDefinition,
            randomSource
          ),
        },
      ];
    })
  );

  return {
    cityId: poolDefinition.cityId,
    lastRefreshedOn: dateKey,
    residents,
  };
}

export function ensureCityNpcPoolsForCurrentDay(
  state: GameState,
  poolDefinitions: CityNpcPoolDefinition[],
  randomSource: RandomSource = Math.random
): GameState {
  const dateKey = createCalendarDateKey(state);
  let didChange = false;
  const nextPools = { ...state.runtime.cityNpcPools };

  for (const poolDefinition of poolDefinitions) {
    const existingPool = nextPools[poolDefinition.cityId];
    if (existingPool?.lastRefreshedOn === dateKey) {
      continue;
    }

    nextPools[poolDefinition.cityId] = refreshCityNpcPool(
      poolDefinition,
      existingPool,
      dateKey,
      randomSource
    );
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
