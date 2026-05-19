import type { GameState } from "../../domain/game-state";

export function enterCity(state: GameState, cityId: string): GameState {
  return {
    ...state,
    world: {
      ...state.world,
      currentCityId: cityId,
      currentHouseId: null,
    },
    ui: {
      ...state.ui,
      currentView: "city",
    },
  };
}
