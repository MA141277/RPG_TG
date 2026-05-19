import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import { startEvent } from "../events/event-runner";

export function enterHouse(
  state: GameState,
  houseDefinition: HouseDefinition,
  eventDefinitionsById: Record<string, EventDefinition>
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

  if (houseDefinition.onEnterEventId == null) {
    return nextState;
  }

  const onEnterEvent = eventDefinitionsById[houseDefinition.onEnterEventId];
  if (onEnterEvent == null) {
    return nextState;
  }

  return startEvent(nextState, onEnterEvent);
}
