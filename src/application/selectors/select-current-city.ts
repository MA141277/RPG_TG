import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";

export function selectCurrentCity(
  state: GameState,
  cityDefinitions: CityDefinition[]
): CityDefinition | undefined {
  return cityDefinitions.find(
    (cityDefinition) => cityDefinition.id === state.world.currentCityId
  );
}
