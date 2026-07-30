import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";

export function enterHouse(
  state: GameState,
  houseDefinition: HouseDefinition
): GameState {
  const nextState: GameState = {
    ...state,
    world: {
      ...state.world,
      currentHouseId: houseDefinition.id,
    },
    ui: {
      ...state.ui,
      currentView: "house",
    },
  };
  return nextState;
}
