import type {
  CityNpcActivityLocationId,
  CityNpcDefinition,
  CityNpcId,
  CityNpcPoolDefinition,
} from "../../domain/city-npc";
import type { GameState } from "../../domain/game-state";

type RandomSource = () => number;

function sampleWithoutReplacement<T>(
  items: readonly T[],
  maxCount: number,
  randomSource: RandomSource
): T[] {
  const pool = [...items];
  const result: T[] = [];

  while (pool.length > 0 && result.length < maxCount) {
    const index = Math.floor(randomSource() * pool.length);
    const [pickedItem] = pool.splice(index, 1);
    if (pickedItem != null) {
      result.push(pickedItem);
    }
  }

  return result;
}

export function getCityNpcPoolDefinition(
  poolDefinitions: CityNpcPoolDefinition[],
  cityId: string
): CityNpcPoolDefinition | null {
  return (
    poolDefinitions.find((poolDefinition) => poolDefinition.cityId === cityId) ?? null
  );
}

export function getCityNpcDefinitionById(
  poolDefinitions: CityNpcPoolDefinition[],
  cityId: string,
  npcId: string
): CityNpcDefinition | null {
  const poolDefinition = getCityNpcPoolDefinition(poolDefinitions, cityId);
  if (poolDefinition == null) {
    return null;
  }

  return (
    poolDefinition.residents.find((residentDefinition) => residentDefinition.id === npcId) ??
    null
  );
}

export function listCityNpcDefinitionsForLocation(
  state: GameState,
  poolDefinitions: CityNpcPoolDefinition[],
  cityId: string,
  locationId: CityNpcActivityLocationId
): CityNpcDefinition[] {
  const poolDefinition = getCityNpcPoolDefinition(poolDefinitions, cityId);
  const runtimePool = state.runtime.cityNpcPools[cityId];

  if (poolDefinition == null || runtimePool == null) {
    return [];
  }

  return poolDefinition.residents.filter(
    (residentDefinition) =>
      runtimePool.residents[residentDefinition.id]?.currentLocationId === locationId
  );
}

export function sampleCityNpcIdsForLocation(
  state: GameState,
  poolDefinitions: CityNpcPoolDefinition[],
  cityId: string,
  locationId: CityNpcActivityLocationId,
  maxCount: number,
  randomSource: RandomSource = Math.random
): CityNpcId[] {
  return sampleWithoutReplacement(
    listCityNpcDefinitionsForLocation(state, poolDefinitions, cityId, locationId).map(
      (residentDefinition) => residentDefinition.id
    ),
    maxCount,
    randomSource
  );
}

export function readCityNpcFavorability(
  state: GameState,
  cityId: string,
  npcId: string,
  fallback: number
): number {
  const favorability = state.runtime.cityNpcPools[cityId]?.residents[npcId]?.favorability;
  return typeof favorability === "number" ? favorability : fallback;
}

export function mutateCityNpcFavorability(
  state: GameState,
  cityId: string,
  npcId: string,
  delta: number
): GameState {
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
