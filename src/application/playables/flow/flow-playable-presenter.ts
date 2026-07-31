import type {
  ActivePlayableSession,
  PlayablePresenterModel,
} from "../../../core/contracts/playable-runtime";
import type {
  FlowNode,
  FlowPlayableDefinition,
} from "../../../domain/playables/flow";

export function presentFlowPlayable(input: {
  definition: FlowPlayableDefinition;
  session: ActivePlayableSession | null;
}): PlayablePresenterModel {
  const currentNodeId = input.session?.state?.currentNodeId ?? null;
  const currentNode =
    input.definition.nodes.find((node) => node.id === currentNodeId) ?? null;

  return {
    playableId: input.definition.id,
    layout: "panel",
    title: input.definition.title,
    summaryLines: [],
    actions: createActions(currentNode),
    viewModel: {
      currentNodeId,
      nodeType: currentNode?.type ?? null,
      ...(currentNode?.type === "text" ? { text: currentNode.text } : {}),
      ...(currentNode?.type === "choice"
        ? {
            prompt: currentNode.prompt,
            options: currentNode.options,
          }
        : {}),
    },
  };
}

function createActions(node: FlowNode | null): PlayablePresenterModel["actions"] {
  if (node?.type === "text") {
    return [{ id: "confirm", label: "Continue", commandType: "confirm" }];
  }

  if (node?.type === "choice") {
    return node.options.map((option) => ({
      id: option.id,
      label: option.label,
      commandType: "custom" as const,
    }));
  }

  return [];
}
