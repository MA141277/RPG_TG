import type {
  ActivePlayableSession,
  PlayableCommand,
  PlayableFactResult,
  PlayableOwnerContext,
} from "../../../core/contracts/playable-runtime";
import type {
  FlowNode,
  FlowPlayableDefinition,
  FlowPlayableSessionState,
} from "../../../domain/playables/flow";

export type FlowPlayableLifecycle =
  | { type: "continue" }
  | { type: "completed"; result: PlayableFactResult }
  | { type: "cancelled"; result: PlayableFactResult };

export type FlowPlayableReduction = {
  session: ActivePlayableSession;
  lifecycle: FlowPlayableLifecycle;
};

export function launchFlowPlayable(input: {
  definition: FlowPlayableDefinition;
  integrationId: string;
  ownerContext: PlayableOwnerContext;
}): ActivePlayableSession {
  return {
    sessionId: `playable.${input.definition.id}`,
    playableId: input.definition.id,
    integrationId: input.integrationId,
    family: "flow",
    ownerContext: input.ownerContext,
    status: "active",
    state: {
      currentNodeId: input.definition.initialNodeId,
    } satisfies FlowPlayableSessionState,
  };
}

export function reduceFlowPlayable(input: {
  definition: FlowPlayableDefinition;
  session: ActivePlayableSession;
  command: PlayableCommand;
}): FlowPlayableReduction {
  const currentNode = findNode(input.definition, readCurrentNodeId(input.session));
  if (currentNode == null) {
    return {
      session: input.session,
      lifecycle: {
        type: "completed",
        result: {
          status: "aborted",
          detail: { reason: "missing-flow-node" },
        },
      },
    };
  }

  if (input.command.type === "cancel") {
    return {
      session: { ...input.session, status: "cancelled" },
      lifecycle: {
        type: "cancelled",
        result: { status: "cancelled" },
      },
    };
  }

  if (currentNode.type === "text" && input.command.type === "confirm") {
    return advanceToNode(input, currentNode.nextNodeId);
  }

  if (currentNode.type === "choice" && input.command.type === "select") {
    const selectedValue = input.command.value;
    const option = currentNode.options.find(
      (candidate) => candidate.id === selectedValue
    );
    return option == null
      ? { session: input.session, lifecycle: { type: "continue" } }
      : advanceToNode(input, option.nextNodeId);
  }

  if (currentNode.type === "complete") {
    return completeAtNode(input.session, currentNode);
  }

  return {
    session: input.session,
    lifecycle: { type: "continue" },
  };
}

function advanceToNode(
  input: {
    definition: FlowPlayableDefinition;
    session: ActivePlayableSession;
  },
  nextNodeId: string | null
): FlowPlayableReduction {
  if (nextNodeId == null) {
    return {
      session: { ...input.session, status: "completed" },
      lifecycle: {
        type: "completed",
        result: { status: "completed" },
      },
    };
  }

  const nextNode = findNode(input.definition, nextNodeId);
  if (nextNode?.type === "complete") {
    return completeAtNode(
      {
        ...input.session,
        state: { currentNodeId: nextNode.id },
      },
      nextNode
    );
  }

  return {
    session: {
      ...input.session,
      state: { currentNodeId: nextNodeId },
    },
    lifecycle: { type: "continue" },
  };
}

function completeAtNode(
  session: ActivePlayableSession,
  node: Extract<FlowNode, { type: "complete" }>
): FlowPlayableReduction {
  return {
    session: {
      ...session,
      status: "completed",
      state: { currentNodeId: node.id },
    },
    lifecycle: {
      type: "completed",
      result: {
        status:
          node.outcome === "failure"
            ? "failed"
            : node.outcome === "cancelled"
              ? "cancelled"
              : "completed",
        metrics: node.metrics,
        detail: node.detail,
      },
    },
  };
}

function readCurrentNodeId(session: ActivePlayableSession): string | null {
  const currentNodeId = session.state?.currentNodeId;
  return typeof currentNodeId === "string" ? currentNodeId : null;
}

function findNode(
  definition: FlowPlayableDefinition,
  nodeId: string | null
): FlowNode | null {
  return nodeId == null
    ? null
    : definition.nodes.find((node) => node.id === nodeId) ?? null;
}
