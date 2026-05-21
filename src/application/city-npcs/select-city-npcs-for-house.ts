import type { CityNpcPoolDefinition } from "../../domain/city-npc";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";

export type HouseCityNpcSummary = {
  id: string;
  name: string;
  title?: string;
};

export function selectCityNpcSummariesForHouse(
  state: GameState,
  houseDefinition: HouseDefinition,
  poolDefinitions: CityNpcPoolDefinition[]
): HouseCityNpcSummary[] {
  if (houseDefinition.activityLocationId == null) {
    return [];
  }

  const poolDefinition = poolDefinitions.find(
    (candidatePool) => candidatePool.cityId === houseDefinition.cityId
  );
  const runtimePool = state.runtime.cityNpcPools[houseDefinition.cityId];

  if (poolDefinition == null || runtimePool == null) {
    return [];
  }

  return poolDefinition.residents
    .filter(
      (residentDefinition) =>
        runtimePool.residents[residentDefinition.id]?.currentLocationId ===
        houseDefinition.activityLocationId
    )
    .map((residentDefinition) => ({
      id: residentDefinition.id,
      name: residentDefinition.name,
      ...(residentDefinition.title === ""
        ? {}
        : { title: residentDefinition.title }),
    }));
}
