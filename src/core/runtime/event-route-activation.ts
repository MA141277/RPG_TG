import { startEvent } from "../../application/events/event-runner";
import type { EventDefinition } from "../../domain/event";
import type {
  RuntimeEventRouteContext,
  RuntimeEventRouteHandlerInput,
  RuntimeEventRouteHandlerResult,
} from "../contracts/event-router";

type EventRouteActivationInput = {
  eventDefinitionsById: Record<string, EventDefinition>;
  fallbackEventDefinition: EventDefinition;
};

export function createEventRouteActivationHandlers(
  input: EventRouteActivationInput
): Pick<RuntimeEventRouteContext["handlers"], "dialogue" | "settlement"> {
  const activateRoutedEvent = ({
    state,
    event,
  }: RuntimeEventRouteHandlerInput): RuntimeEventRouteHandlerResult => ({
    state: {
      ...state,
      core: startEvent(
        state.core,
        input.eventDefinitionsById[event.id] ?? input.fallbackEventDefinition
      ),
    },
    effects: [],
  });

  return {
    dialogue: activateRoutedEvent,
    settlement: activateRoutedEvent,
  };
}
