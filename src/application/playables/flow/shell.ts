import type {
  ActivePlayableSession,
  PlayableCommand,
  PlayableFactResult,
  PlayableResult,
  PlayableShell,
} from "../../../core/contracts/playable-runtime";
import { resolvePlayableResultRouting } from "../../../core/runtime/playable-result-routing";
import {
  createFlowPlayableCommandPrefix,
  type FlowNode,
  type FlowPlayableDefinition,
} from "../../../domain/playables/flow";
import {
  launchFlowPlayable,
  reduceFlowPlayable,
} from "./flow-playable-definition";
import { presentFlowPlayable } from "./flow-playable-presenter";
import {
  renderFlowPlayableOverlay,
  renderFlowPlayableView,
} from "../../../ui/views/playables/flow-playable-view";

export function createFlowPlayableShell(
  definition: FlowPlayableDefinition
): PlayableShell {
  return {
    manifest: {
      playableId: definition.id,
      family: "flow",
      commandPrefix: createFlowPlayableCommandPrefix(definition.id),
    },
    createSession(input) {
      return launchFlowPlayable({
        definition,
        integrationId: input.integrationId,
        ownerContext: input.ownerContext,
      });
    },
    reduce(session, command) {
      return reduceFlowPlayable({
        definition,
        session,
        command,
      }).session;
    },
    present(session) {
      return presentFlowPlayable({
        definition,
        session,
      });
    },
    complete(session) {
      const completion = readFlowPlayableCompletion(definition, session);
      return completion == null
        ? null
        : resolvePlayableResultRouting({
            session,
            outcome: completion.outcome,
            factResult: completion.factResult,
          });
    },
    renderOverlay(session) {
      return renderFlowPlayableOverlay({
        definition,
        session,
      });
    },
    renderStage(session) {
      return renderFlowPlayableView({
        definition,
        session,
      });
    },
  };
}

function readFlowPlayableCompletion(
  definition: FlowPlayableDefinition,
  session: ActivePlayableSession
): { outcome: "success" | "failure" | "cancelled"; factResult: PlayableFactResult } | null {
  if (session.status === "cancelled") {
    return {
      outcome: "cancelled",
      factResult: {
        status: "cancelled",
      },
    };
  }

  if (session.status !== "completed") {
    return null;
  }

  const completionNode = findCurrentNode(definition, session);
  if (completionNode?.type !== "complete") {
    return {
      outcome: "success",
      factResult: {
        status: "completed",
      },
    };
  }

  return {
    outcome: completionNode.outcome,
    factResult: {
      status: mapFlowOutcomeToFactStatus(completionNode.outcome),
      ...(completionNode.metrics == null ? {} : { metrics: completionNode.metrics }),
      ...(completionNode.detail == null ? {} : { detail: completionNode.detail }),
    },
  };
}

function findCurrentNode(
  definition: FlowPlayableDefinition,
  session: ActivePlayableSession
): FlowNode | null {
  const currentNodeId =
    typeof session.state?.currentNodeId === "string"
      ? session.state.currentNodeId
      : null;
  return currentNodeId == null
    ? null
    : definition.nodes.find((node) => node.id === currentNodeId) ?? null;
}

function mapFlowOutcomeToFactStatus(
  outcome: "success" | "failure" | "cancelled"
): PlayableFactResult["status"] {
  switch (outcome) {
    case "failure":
      return "failed";
    case "cancelled":
      return "cancelled";
    default:
      return "completed";
  }
}
