import type { RuntimeEventRouteResult } from "../contracts/event-router";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";

export function runEventChain(input: {
  state: RuntimeState;
  rootEventId: string;
  maxDepth: number;
  router: {
    dispatchEventRoute(input: {
      state: RuntimeState;
      eventId: string;
    }): RuntimeEventRouteResult;
  };
}): {
  state: RuntimeState;
  visitedEventIds: string[];
  effects: RuntimeResult["effects"];
  taskInputs: RuntimeResult["taskInputs"];
} {
  return continueEventChain({
    state: input.state,
    followUpEventIds: [input.rootEventId],
    maxDepth: input.maxDepth,
    router: input.router,
  });
}

export function continueEventChain(input: {
  state: RuntimeState;
  followUpEventIds: string[];
  maxDepth: number;
  router: {
    dispatchEventRoute(input: {
      state: RuntimeState;
      eventId: string;
    }): RuntimeEventRouteResult;
  };
}): {
  state: RuntimeState;
  visitedEventIds: string[];
  effects: RuntimeResult["effects"];
  taskInputs: RuntimeResult["taskInputs"];
} {
  const maxDepth = Math.max(0, input.maxDepth);
  const visitedEventIds: string[] = [];
  const visitedEventIdSet = new Set<string>();
  const queuedEventIdSet = new Set<string>();
  const pendingEventIds = [...input.followUpEventIds];
  const effects: RuntimeResult["effects"] = [];
  const taskInputs: RuntimeResult["taskInputs"] = [];

  for (const eventId of input.followUpEventIds) {
    queuedEventIdSet.add(eventId);
  }

  let nextState = input.state;

  while (pendingEventIds.length > 0) {
    if (visitedEventIds.length >= maxDepth) {
      throw new Error(
        `event-chain max-depth exceeded: processed ${visitedEventIds.length}, maxDepth ${maxDepth}`
      );
    }

    const eventId = pendingEventIds.shift();
    if (eventId == null) {
      break;
    }
    queuedEventIdSet.delete(eventId);

    if (visitedEventIdSet.has(eventId)) {
      continue;
    }

    visitedEventIdSet.add(eventId);
    visitedEventIds.push(eventId);

    const routed = input.router.dispatchEventRoute({
      state: nextState,
      eventId,
    });
    assertImmediateChainCompatibility(routed);
    nextState = routed.state;
    effects.push(...routed.effects);
    taskInputs.push(...(routed.taskInputs ?? []));

    for (const followUpEventId of routed.followUpEventIds ?? []) {
      if (
        visitedEventIdSet.has(followUpEventId) ||
        queuedEventIdSet.has(followUpEventId)
      ) {
        continue;
      }

      pendingEventIds.push(followUpEventId);
      queuedEventIdSet.add(followUpEventId);
    }
  }

  return {
    state: nextState,
    visitedEventIds,
    effects,
    taskInputs,
  };
}

function assertImmediateChainCompatibility(
  routed: RuntimeEventRouteResult
): void {
  if (routed.event.kind === "dialogue" || routed.event.kind === "settlement") {
    throw new Error(
      `event-chain requires immediate routed events, received owner-paced kind: ${routed.event.kind}`
    );
  }

  if (
    "dialogue" in routed ||
    routed.scene != null ||
    routed.followUp != null ||
    routed.outcome != null ||
    routed.interactive != null ||
    routed.navigation != null ||
    routed.access != null
  ) {
    throw new Error(
      `event-chain requires immediate routed events without owner-paced continuation surfaces: ${routed.event.id}`
    );
  }
}
