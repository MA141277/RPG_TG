import type { GameState } from "../../domain/game-state";

export function enterCity(state: GameState, cityId: string): GameState {
  const nextVariables = { ...state.runtime.variables };
  delete nextVariables.leaderResidencePendingCharacterId;

  return {
    ...state,
    world: {
      ...state.world,
      currentCityId: cityId,
      currentHouseId: null,
    },
    runtime: {
      ...state.runtime,
      variables: nextVariables,
    },
    ui: {
      ...state.ui,
      overlayView: null,
      houseSession: null,
      currentView: "city",
    },
  };
}
