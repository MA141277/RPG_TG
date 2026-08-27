import type { NpcAiDialogueProviderRequest } from "../../domain/npc-ai-dialogue";
import type {
  HouseConversationCapabilitySnapshot,
  HouseConversationRoute,
} from "../../domain/house-conversation";
import { resolveAvailableHouseConversationRoute } from "../house-conversation/select-house-conversation-capability-snapshot";

const HOUSE_INTENT_GATE_SYSTEM = [
  "你是历史题材游戏的室内对话意图门禁。",
  "你的唯一任务，是判断玩家刚才这句话应该继续普通聊天、先追问澄清，还是进入当前室内已有合法 route。",
  "必须且只允许输出 1 个 [INTENT: ...] 标记。",
  "允许的格式只有：",
  "[INTENT: chat]",
  "[INTENT: clarify]",
  "[INTENT: route|open-house-action|action_id]",
  "[INTENT: route|settle-house-service|service_id]",
  "[INTENT: route|go-to-house|house_id]",
  "[INTENT: route|switch-target-npc|character_id]",
  "[INTENT: route|leave-house]",
  "[INTENT: route|negotiate-story-node|node_id|approach]",
  "[INTENT: route|negotiate-story-node|node_id|approach|target_character_id]",
  "只能从当前允许列表中选择 route。",
  "如果玩家只是闲聊、问候、延续话题，输出 [INTENT: chat]。",
  "如果玩家的话可能要办事但缺少明确目标，输出 [INTENT: clarify]。",
  "如果玩家已经明确要求切换对象、打开功能、办理服务、前往地点、离开，或推进剧情交涉，输出对应的 [INTENT: route|...] 标记。",
  "禁止输出任何解释、寒暄、对话、[CHOICE]、[OPTION]、[ACTION]、[ROUTE]、英文标签或其他文本。",
].join("\n");

const HOUSE_RESPONSE_CHOICE_LOOP_SYSTEM = [
  "你是历史题材的 NPC 对话主持人。",
  "输出必须只使用保留标记：[DIALOGUE]、[CHOICE]、[OPTION]、[END_CHOICE]。",
  "必须输出普通 [DIALOGUE] + [CHOICE] + 恰好 3 个 [OPTION]。",
  "必须保持在一个可见选择循环内。",
  "每个 OPTION 都必须是玩家此刻会直接说出口的中文台词。",
  "禁止输出 [ACTION]。",
  "禁止输出 [ROUTE]。",
  "禁止输出任何额外解释。",
].join("\n");

const HOUSE_ROUTE_TRANSITION_SYSTEM = [
  "你是历史题材的 NPC 对话主持人。",
  "本轮已经确认玩家要直接达成当前室内的合法意图。",
  "输出必须只使用保留标记：[NARRATION]、[DIALOGUE]。",
  "必须输出至少 1 句符合人设的寒暄、说明或引导。",
  "禁止输出 [ACTION]、[ROUTE]、[CHOICE]、[OPTION] 或 [END_CHOICE]。",
  "不要输出任何额外解释。",
].join("\n");

const INTENT_MARKER_PATTERN = /\[INTENT:\s*([^\]\r\n]+?)\s*\]/gu;

export type HouseConversationIntentGateDecision =
  | { kind: "chat" }
  | { kind: "clarify" }
  | { kind: "route"; route: HouseConversationRoute };

function normalizeNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function resolvePlayerTurnText(
  request: NpcAiDialogueProviderRequest
): string | null {
  if (request.metadata.inputType === "select_option") {
    return (
      normalizeNonEmptyString(request.metadata.selectedOptionLabel) ??
      normalizeNonEmptyString(request.metadata.selectedOptionId)
    );
  }

  if (request.metadata.inputType === "custom_input") {
    return normalizeNonEmptyString(request.metadata.customInputText);
  }

  return null;
}

function summarizeHouseConversationCapabilitySnapshot(
  snapshot: HouseConversationCapabilitySnapshot
): string {
  const sections: string[] = [];

  if (snapshot.switchableNpcTargets.length > 0) {
    sections.push(
      `可切换交谈对象：${snapshot.switchableNpcTargets
        .map((target) => `${target.characterId}（${target.characterName}）`)
        .join("；")}`
    );
  }

  if (snapshot.houseActions.length > 0) {
    sections.push(
      `可打开的房内功能：${snapshot.houseActions
        .map((action) => `${action.actionId}（${action.label}）`)
        .join("；")}`
    );
  }

  if (snapshot.houseServices.length > 0) {
    sections.push(
      `可办理的语义服务：${snapshot.houseServices
        .map((service) => `${service.serviceId}（${service.label}）`)
        .join("；")}`
    );
  }

  if (snapshot.reachableHouses.length > 0) {
    sections.push(
      `可前往地点：${snapshot.reachableHouses
        .map((house) => `${house.houseId}（${house.houseName}）`)
        .join("；")}`
    );
  }

  if (snapshot.leaveAction != null) {
    sections.push(
      `可离开方式：${snapshot.leaveAction.actionId}（${snapshot.leaveAction.label}）`
    );
  }

  if (snapshot.negotiableStoryNodes.length > 0) {
    sections.push(
      `可推进的剧情交涉：${snapshot.negotiableStoryNodes
        .map((node) => {
          const approaches =
            node.allowedApproaches == null || node.allowedApproaches.length === 0
              ? ""
              : `，可用方式：${node.allowedApproaches.join("、")}`;
          return `${node.nodeId}（${node.label}${approaches}）`;
        })
        .join("；")}`
    );
  }

  return sections.length === 0 ? "无" : sections.join("\n");
}

function describeHouseConversationRoute(
  snapshot: HouseConversationCapabilitySnapshot,
  route: HouseConversationRoute
): string {
  switch (route.kind) {
    case "continue-dialogue":
      return "继续当前对话";
    case "switch-target-npc": {
      const matchedTarget =
        snapshot.switchableNpcTargets.find(
          (target) => target.characterId === route.characterId
        ) ?? null;
      return matchedTarget == null
        ? route.characterId
        : `${matchedTarget.characterId}（${matchedTarget.characterName}）`;
    }
    case "open-house-action": {
      const matchedAction =
        snapshot.houseActions.find(
          (action) => action.actionId === route.actionId
        ) ?? null;
      return matchedAction == null
        ? route.actionId
        : `${matchedAction.actionId}（${matchedAction.label}）`;
    }
    case "settle-house-service": {
      const matchedService =
        snapshot.houseServices.find(
          (service) => service.serviceId === route.serviceId
        ) ?? null;
      return matchedService == null
        ? route.serviceId
        : `${matchedService.serviceId}（${matchedService.label}）`;
    }
    case "go-to-house": {
      const matchedHouse =
        snapshot.reachableHouses.find(
          (house) => house.houseId === route.houseId
        ) ?? null;
      return matchedHouse == null
        ? route.houseId
        : `${matchedHouse.houseId}（${matchedHouse.houseName}）`;
    }
    case "leave-house":
      return snapshot.leaveAction == null
        ? "离开当前地点"
        : `${snapshot.leaveAction.actionId}（${snapshot.leaveAction.label}）`;
    case "negotiate-story-node": {
      const matchedNode =
        snapshot.negotiableStoryNodes.find(
          (node) => node.nodeId === route.nodeId
        ) ?? null;
      return matchedNode == null
        ? `${route.nodeId}（${route.approach}）`
        : `${matchedNode.nodeId}（${matchedNode.label}，方式：${route.approach}）`;
    }
    default:
      return "继续当前对话";
  }
}

function buildHouseConversationIntentGateExamples(
  snapshot: HouseConversationCapabilitySnapshot
): string[] {
  const examples = ["[INTENT: chat]", "[INTENT: clarify]"];

  const firstAction = snapshot.houseActions[0];
  if (firstAction != null) {
    examples.push(`[INTENT: route|open-house-action|${firstAction.actionId}]`);
  }

  const firstService = snapshot.houseServices[0];
  if (firstService != null) {
    examples.push(
      `[INTENT: route|settle-house-service|${firstService.serviceId}]`
    );
  }

  const firstHouse = snapshot.reachableHouses[0];
  if (firstHouse != null) {
    examples.push(`[INTENT: route|go-to-house|${firstHouse.houseId}]`);
  }

  const firstTarget = snapshot.switchableNpcTargets[0];
  if (firstTarget != null) {
    examples.push(
      `[INTENT: route|switch-target-npc|${firstTarget.characterId}]`
    );
  }

  if (snapshot.leaveAction != null) {
    examples.push("[INTENT: route|leave-house]");
  }

  const firstNode = snapshot.negotiableStoryNodes[0];
  const firstApproach = firstNode?.allowedApproaches?.[0];
  if (firstNode != null && firstApproach != null) {
    examples.push(
      firstNode.targetCharacterId == null
        ? `[INTENT: route|negotiate-story-node|${firstNode.nodeId}|${firstApproach}]`
        : `[INTENT: route|negotiate-story-node|${firstNode.nodeId}|${firstApproach}|${firstNode.targetCharacterId}]`
    );
  }

  return examples;
}

function buildRouteSummaryPrompt(
  request: NpcAiDialogueProviderRequest
): {
  routeSummary: string;
  routeExamples: string[];
} {
  const snapshot = request.metadata.houseConversationCapabilitySnapshot;
  if (snapshot == null) {
    return {
      routeSummary: "当前无可用的室内合法 route。",
      routeExamples: [],
    };
  }

  return {
    routeSummary: summarizeHouseConversationCapabilitySnapshot(snapshot),
    routeExamples: buildHouseConversationIntentGateExamples(snapshot),
  };
}

function resolveContextMessage(request: NpcAiDialogueProviderRequest) {
  return (
    request.messages[0] ?? {
      role: "user" as const,
      content: `当前NPC：${request.metadata.npcName}`,
    }
  );
}

export function buildHouseConversationIntentGateRequest(
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueProviderRequest {
  const playerTurnText = resolvePlayerTurnText(request) ?? "继续";
  const { routeSummary, routeExamples } = buildRouteSummaryPrompt(request);

  return {
    ...request,
    requestId: `${request.requestId}:house-intent-gate`,
    system: HOUSE_INTENT_GATE_SYSTEM,
    messages: [
      resolveContextMessage(request),
      {
        role: "user",
        content: [
          `玩家刚才的原话：${playerTurnText}`,
          routeSummary,
          ...(routeExamples.length === 0
            ? []
            : [`当前允许的精确 intent 例子：`, ...routeExamples]),
          "现在不要继续写对话，只做室内意图门禁判断。",
          "禁止输出任何别的文本。",
        ].join("\n"),
      },
    ],
  };
}

export function buildHouseConversationIntentGateRepairRequest(
  request: NpcAiDialogueProviderRequest,
  issue: string
): NpcAiDialogueProviderRequest {
  const { routeSummary, routeExamples } = buildRouteSummaryPrompt(request);

  return {
    ...request,
    messages: [
      ...request.messages,
      {
        role: "user",
        content: [
          "上一次室内意图门禁结果格式不合法。",
          issue,
          "请重新判断。",
          routeSummary,
          ...(routeExamples.length === 0
            ? []
            : [`当前允许的精确 intent 例子：`, ...routeExamples]),
          "只能输出 1 个 [INTENT: ...] 标记。",
          "禁止输出任何其他文本。",
        ].join("\n"),
      },
    ],
  };
}

function resolveRouteFromIntentParts(input: {
  rawParts: string[];
  request: NpcAiDialogueProviderRequest;
}): HouseConversationRoute | null {
  const routeKind = input.rawParts[1]?.toLocaleLowerCase() ?? "";
  const playerTurnText = resolvePlayerTurnText(input.request) ?? "";

  switch (routeKind) {
    case "switch-target-npc": {
      const characterId = normalizeNonEmptyString(input.rawParts[2]);
      return characterId == null
        ? null
        : {
            kind: "switch-target-npc",
            characterId,
          };
    }
    case "open-house-action": {
      const actionId = normalizeNonEmptyString(input.rawParts[2]);
      return actionId == null
        ? null
        : {
            kind: "open-house-action",
            actionId,
          };
    }
    case "settle-house-service": {
      const serviceId = normalizeNonEmptyString(input.rawParts[2]);
      return serviceId == null
        ? null
        : {
            kind: "settle-house-service",
            serviceId,
            rawPlayerText: playerTurnText,
          };
    }
    case "go-to-house": {
      const houseId = normalizeNonEmptyString(input.rawParts[2]);
      return houseId == null
        ? null
        : {
            kind: "go-to-house",
            houseId,
          };
    }
    case "leave-house":
      return {
        kind: "leave-house",
      };
    case "negotiate-story-node": {
      const nodeId = normalizeNonEmptyString(input.rawParts[2]);
      const approach = normalizeNonEmptyString(input.rawParts[3]);
      const targetCharacterId = normalizeNonEmptyString(input.rawParts[4]);
      return nodeId == null || approach == null
        ? null
        : {
            kind: "negotiate-story-node",
            nodeId,
            approach:
              approach as Extract<
                HouseConversationRoute,
                { kind: "negotiate-story-node" }
              >["approach"],
            ...(targetCharacterId == null ? {} : { targetCharacterId }),
          };
    }
    default:
      return null;
  }
}

export function resolveHouseConversationIntentGateDecision(input: {
  rawText: string;
  request: NpcAiDialogueProviderRequest;
}):
  | { decision: HouseConversationIntentGateDecision; issue?: undefined }
  | { decision?: undefined; issue: string } {
  const markerMatches = [...input.rawText.matchAll(INTENT_MARKER_PATTERN)];
  if (markerMatches.length !== 1) {
    return {
      issue: "室内意图门禁阶段必须且只返回 1 个 [INTENT: ...]。",
    };
  }

  const rawDecision = normalizeNonEmptyString(markerMatches[0]?.[1]);
  if (rawDecision == null) {
    return {
      issue: "室内意图门禁阶段必须返回非空 [INTENT: ...]。",
    };
  }

  const rawParts = rawDecision
    .split("|")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  const intentKind = rawParts[0]?.toLocaleLowerCase() ?? "";

  if (intentKind === "chat" && rawParts.length === 1) {
    return {
      decision: {
        kind: "chat",
      },
    };
  }

  if (intentKind === "clarify" && rawParts.length === 1) {
    return {
      decision: {
        kind: "clarify",
      },
    };
  }

  if (intentKind !== "route") {
    return {
      issue: "室内意图门禁阶段只能返回 chat、clarify 或 route。",
    };
  }

  const snapshot = input.request.metadata.houseConversationCapabilitySnapshot;
  if (snapshot == null) {
    return {
      issue: "当前没有室内能力快照，禁止返回 route 意图。",
    };
  }

  const candidateRoute = resolveRouteFromIntentParts({
    rawParts,
    request: input.request,
  });
  if (candidateRoute == null) {
    return {
      issue: "室内意图门禁阶段只能返回当前允许的合法 route。格式或参数不正确。",
    };
  }

  const playerTurnText = resolvePlayerTurnText(input.request) ?? "";
  const validatedRoute = resolveAvailableHouseConversationRoute({
    snapshot,
    route: candidateRoute,
    ...(playerTurnText.length === 0 ? {} : { rawPlayerText: playerTurnText }),
  });
  if (validatedRoute == null) {
    return {
      issue: "返回的 route 必须落在当前合法的室内能力快照内。",
    };
  }

  return {
    decision: {
      kind: "route",
      route: validatedRoute,
    },
  };
}

function buildHouseConversationChoiceLoopResponseRequest(input: {
  request: NpcAiDialogueProviderRequest;
  requestIdSuffix: string;
  instruction: string;
}): NpcAiDialogueProviderRequest {
  const playerTurnText = resolvePlayerTurnText(input.request) ?? "继续";

  return {
    ...input.request,
    requestId: `${input.request.requestId}:${input.requestIdSuffix}`,
    system: HOUSE_RESPONSE_CHOICE_LOOP_SYSTEM,
    messages: [
      resolveContextMessage(input.request),
      {
        role: "user",
        content: [
          `玩家刚才的原话：${playerTurnText}`,
          input.instruction,
          "必须输出普通 [DIALOGUE] + [CHOICE] + 恰好 3 个 [OPTION]。",
          "必须保持在一个可见选择循环内。",
          "禁止输出 [ACTION]。",
          "禁止输出 [ROUTE]。",
        ].join("\n"),
      },
    ],
  };
}

export function buildHouseConversationChatResponseRequest(
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueProviderRequest {
  return buildHouseConversationChoiceLoopResponseRequest({
    request,
    requestIdSuffix: "house-chat-response",
    instruction:
      "本轮已经确认只是继续普通聊天。请用符合人设的短回应延续话题，并给出 3 个玩家可直接说出口的接话选项。",
  });
}

export function buildHouseConversationClarifyResponseRequest(
  request: NpcAiDialogueProviderRequest
): NpcAiDialogueProviderRequest {
  return buildHouseConversationChoiceLoopResponseRequest({
    request,
    requestIdSuffix: "house-clarify-response",
    instruction:
      "本轮玩家意图可能要办事但缺少明确目标。请只问一个简短的追问来澄清目标，并给出 3 个玩家可直接说出口的回答选项。",
  });
}

export function buildHouseConversationRouteTransitionRequest(input: {
  request: NpcAiDialogueProviderRequest;
  route: HouseConversationRoute;
}): NpcAiDialogueProviderRequest {
  const route = input.route;
  const playerTurnText = resolvePlayerTurnText(input.request) ?? "继续";
  const snapshot = input.request.metadata.houseConversationCapabilitySnapshot;
  const routeLabel =
    snapshot == null
      ? route.kind
      : describeHouseConversationRoute(snapshot, route);
  const {
    forcedSpecialActionId: _forcedSpecialActionId,
    forcedHouseConversationRoute: _forcedHouseConversationRoute,
    ...baseMetadata
  } = input.request.metadata;

  return {
    ...input.request,
    requestId: `${input.request.requestId}:house-route-transition`,
    system: HOUSE_ROUTE_TRANSITION_SYSTEM,
    messages: [
      resolveContextMessage(input.request),
      {
        role: "user",
        content: [
          `玩家刚才的原话：${playerTurnText}`,
          `本轮已经确认要直接达成的合法意图：${routeLabel}。`,
          "请只给出至少 1 句符合人设的过渡回应，用来把对话自然引到这个意图上。",
          "不要输出 [ACTION]、[ROUTE]、[CHOICE]、[OPTION] 或任何解释。",
        ].join("\n"),
      },
    ],
    metadata: {
      ...baseMetadata,
      forcedHouseConversationRoute: route,
      ...(route.kind !== "open-house-action"
        ? {}
        : {
            availableSpecialActions: [
              {
                id: route.actionId,
                label:
                  snapshot?.houseActions.find(
                    (action) => action.actionId === route.actionId
                  )?.label ?? route.actionId,
              },
            ],
          }),
    },
  };
}
