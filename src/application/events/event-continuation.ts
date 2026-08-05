import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { RuntimeEventEntity } from "../../core/contracts/event-router";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import { createEventRouteActivationHandlers } from "../../core/runtime/event-route-activation";
import { createRuntimeEventEntity } from "../../core/runtime/event-entity-projection";
import { dispatchEventRoute } from "../../core/runtime/event-router";

export type EventContinuationResult = {
  state: GameState;
  eventDefinition: EventDefinition;
  visitedEventIds: Set<string>;
};

export type EventContinuationResolution = {
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

export function resolveEventContinuation(input: {
  state: GameState;
  eventDefinitionsById: Record<string, EventDefinition>;
  sourceEventId?: string | null | undefined;
  targetEventId?: string | null | undefined;
  visitedEventIds?: Iterable<string> | undefined;
}): EventContinuationResolution | null {
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
    eventDefinition,
    visitedEventIds: nextVisitedEventIds,
  };
}

export function continueToEvent(input: {
  state: GameState;
  eventDefinitionsById: Record<string, EventDefinition>;
  sourceEventId?: string | null | undefined;
  targetEventId?: string | null | undefined;
  visitedEventIds?: Iterable<string> | undefined;
}): EventContinuationResult | null {
  const continuation = resolveEventContinuation(input);
  if (continuation == null) {
    return null;
  }

  return {
    state: dispatchEventRoute({
      state: toEventContinuationRuntimeState(input.state),
      eventId: continuation.eventDefinition.id,
      context: {
        repository: {
          resolveById: (eventId) => {
            const eventDefinition = input.eventDefinitionsById[eventId];
            return eventDefinition == null
              ? null
              : toEventContinuationEventEntity(eventDefinition);
          },
        },
        handlers: createEventRouteActivationHandlers({
          eventDefinitionsById: input.eventDefinitionsById,
          fallbackEventDefinition: continuation.eventDefinition,
        }),
      },
    }).state.core,
    eventDefinition: continuation.eventDefinition,
    visitedEventIds: continuation.visitedEventIds,
  };
}

function normalizeEventId(eventId: string | null | undefined): string | null {
  if (typeof eventId !== "string") {
    return null;
  }

  const normalizedEventId = eventId.trim();
  return normalizedEventId.length === 0 ? null : normalizedEventId;
}

function toEventContinuationRuntimeState(state: GameState): RuntimeState {
  return {
    core: state,
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function toEventContinuationEventEntity(
  eventDefinition: EventDefinition
): RuntimeEventEntity {
  const { emitEventIds } = eventDefinition;
  return createRuntimeEventEntity({
    ...eventDefinition,
    ...(emitEventIds == null ? {} : { emitEventIds }),
  });
}
