import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { startEvent } from "./event-runner";

export type EventContinuationResult = {
  state: GameState;
  eventDefinition: EventDefinition;
  visitedEventIds: Set<string>;
};

export function createEventContinuationTracker(
  initialEventIds: Iterable<string | null | undefined> = []
): Set<string> {
  const visitedEventIds = new Set<string>();
  for (const eventId of initialEventIds) {
    const normalizedEventId = normalizeEventId(eventId);
    if (normalizedEventId != null) {
      visitedEventIds.add(normalizedEventId);
    }
  }
  return visitedEventIds;
}

export function continueToEvent(input: {
  state: GameState;
  eventDefinitionsById: Record<string, EventDefinition>;
  sourceEventId?: string | null | undefined;
  targetEventId?: string | null | undefined;
  visitedEventIds?: Iterable<string> | undefined;
}): EventContinuationResult | null {
  const nextVisitedEventIds = createEventContinuationTracker(
    input.visitedEventIds ?? []
  );
  const sourceEventId = normalizeEventId(input.sourceEventId);
  if (sourceEventId != null) {
    nextVisitedEventIds.add(sourceEventId);
  }

  const targetEventId = normalizeEventId(input.targetEventId);
  if (
    targetEventId == null ||
    targetEventId === sourceEventId ||
    nextVisitedEventIds.has(targetEventId)
  ) {
    return null;
  }

  const eventDefinition = input.eventDefinitionsById[targetEventId];
  if (eventDefinition == null) {
    return null;
  }

  nextVisitedEventIds.add(targetEventId);
  return {
    state: startEvent(input.state, eventDefinition),
    eventDefinition,
    visitedEventIds: nextVisitedEventIds,
  };
}

function normalizeEventId(eventId: string | null | undefined): string | null {
  if (typeof eventId !== "string") {
    return null;
  }

  const normalizedEventId = eventId.trim();
  return normalizedEventId.length === 0 ? null : normalizedEventId;
}
