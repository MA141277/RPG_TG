import type {
  RuntimeEventEntity,
  RuntimeEventKind,
  RuntimeEventRouteInput,
  RuntimeEventRouteResult,
} from "../contracts/event-router";

const MISSING_EVENT_KIND: RuntimeEventKind = "bridge";

export function dispatchEventRoute(
  input: RuntimeEventRouteInput
): RuntimeEventRouteResult {
  const resolvedEvent = input.context.repository.resolveById(input.eventId);
  const event = resolvedEvent ?? createFallbackEventEntity(input.eventId);
  const followUpEventIds = resolveFollowUpEventIds(event);
  const handler =
    resolvedEvent == null ? undefined : input.context.handlers[event.kind];
  const handled = handler?.({
    state: input.state,
    event,
  });
  const handledState = handled?.state as RuntimeEventRouteResult["state"] | undefined;
  const handledEffects = handled?.effects as
    | RuntimeEventRouteResult["effects"]
    | undefined;

  return {
    ...(handled as Record<string, unknown> | undefined),
    state: handledState ?? input.state,
    event,
    effects: handledEffects ?? [],
    ...(followUpEventIds === undefined ? {} : { followUpEventIds }),
  };
}

function createFallbackEventEntity(eventId: string): RuntimeEventEntity {
  return {
    id: eventId,
    kind: MISSING_EVENT_KIND,
    payload: {},
  };
}

function resolveFollowUpEventIds(
  event: RuntimeEventEntity
): string[] | undefined {
  const nextIds = [
    ...(event.nextEventId == null ? [] : [event.nextEventId]),
    ...(event.emitEventIds ?? []),
  ];

  return nextIds.length === 0 ? undefined : nextIds;
}
