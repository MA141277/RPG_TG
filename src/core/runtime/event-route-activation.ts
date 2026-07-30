import { startEvent } from "../../application/events/event-runner";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type {
  RuntimeEventRouteContext,
  RuntimeEventEntity,
  RuntimeEventRouteHandlerInput,
  RuntimeEventRouteHandlerResult,
} from "../contracts/event-router";

type EventRouteActivationInput = {
  eventDefinitionsById: Record<string, EventDefinition>;
  fallbackEventDefinition: EventDefinition;
  prepareCoreState?:
    | ((input: {
        coreState: GameState;
        eventDefinition: EventDefinition;
        event: RuntimeEventEntity;
      }) => GameState)
    | undefined;
};

export function createEventRouteActivationHandlers(
  input: EventRouteActivationInput
): Pick<RuntimeEventRouteContext["handlers"], "dialogue" | "settlement"> {
  const activateRoutedEvent = ({
    state,
    event,
  }: RuntimeEventRouteHandlerInput): RuntimeEventRouteHandlerResult => {
    const eventDefinition =
      input.eventDefinitionsById[event.id] ?? input.fallbackEventDefinition;
    const preparedCoreState =
      input.prepareCoreState?.({
        coreState: state.core,
        eventDefinition,
        event,
      }) ?? state.core;

    return {
      state: {
        ...state,
        core: startEvent(preparedCoreState, eventDefinition),
      },
      effects: [],
    };
  };

  return {
    dialogue: activateRoutedEvent,
    settlement: activateRoutedEvent,
  };
}
