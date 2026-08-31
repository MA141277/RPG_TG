import type { NpcAiDialogueProviderRequest } from "../../domain/npc-ai-dialogue";
import type {
  HouseConversationCapabilitySnapshot,
  HouseConversationRoute,
} from "../../domain/house-conversation";
import { resolveAvailableHouseConversationRoute } from "../house-conversation/select-house-conversation-capability-snapshot";
import { matchNpcSpecialActionByText } from "./npc-special-action-intent";

const HOUSE_INTENT_GATE_SYSTEM = [
  "你是历史题材游戏的室内对话意图门禁。",
  "这一阶段不是 NPC 对话，不是旁白，不是剧情续写，不要写台词。",
  "你的唯一任务，是判断玩家刚才这句话应该继续普通聊天、先追问澄清，还是进入当前室内已有合法 route。",
  "输出必须只有一行，且必须且只允许输出 1 个完整的 [INTENT: ...] 标记。",
  "首字符必须是 [，末字符必须是 ]。前后禁止出现空格、引号、代码块、JSON、编号、解释或任何其他文字。",
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
  "route 的 id 只能从当前允许列表里原样拷贝。禁止改写、翻译、补全、编造任何 id。",
  "如果玩家只是闲聊、问候、延续话题、评价近况，没有要求切换对象、打开功能、办理服务、前往地点、离开，或推进剧情交涉，输出 [INTENT: chat]。",
  "如果玩家像是要办事，但目标不唯一、对象不明确，或当前原话不足以确定唯一合法 route，输出 [INTENT: clarify]。",
  "如果玩家已明确要求切换对象、打开功能、办理服务、前往地点、离开，或推进剧情交涉，哪怕语气委婉、带寒暄、带客套，也必须输出对应的 [INTENT: route|...] 标记，不得输出 chat 或 clarify。",
  "如果一句话同时包含客套和明确意图，以明确意图优先，输出对应 route。",
  "如果原话虽短，但结合当前地点和允许 route 已能唯一落到某个合法 route（例如“来几局”“赌两把”“上桌试手气”在酒馆赌局场景），也算明确意图，不得输出 chat 或 clarify。",
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
const CODE_FENCE_START_PATTERN = /^```[^\r\n]*[\r\n]+/u;
const CODE_FENCE_END_PATTERN = /[\r\n]+```$/u;
const INTENT_JSON_FIELD_CANDIDATES = [
  "intent",
  "decision",
  "result",
  "content",
  "text",
  "output",
  "response",
  "rawText",
] as const;
const WRAPPED_INTENT_QUOTES: ReadonlyArray<readonly [string, string]> = [
  ['"', '"'],
  ["'", "'"],
  ["`", "`"],
  ["“", "”"],
  ["‘", "’"],
  ["「", "」"],
  ["『", "』"],
];
const HOUSE_TRAVEL_ID_ALIASES: Readonly<Record<string, readonly string[]>> = {
  "house.kulan.temple": ["寺庙", "寺里", "皇觉寺"],
  "house.kulan.market": ["商铺", "商店", "货铺", "货栈", "铺子"],
  "house.kulan.medicine_house": ["药铺", "药房"],
  "house.kulan.inn": ["客栈", "旅店", "酒店"],
  "house.kulan.tea_house": ["茶馆", "茶楼"],
  "house.kulan.keep": ["帅府", "郭子兴那里", "郭帅那里"],
  "house.kulan.grain_shop": ["粮铺", "米铺", "粮店"],
  "house.kulan.leader_residence": ["宅邸", "府上"],
  home_001: ["住处", "家里", "回家"],
};
const GENERIC_LEAVE_INTENT_ALIASES = [
  "离开",
  "出去",
  "出门",
  "先走",
  "我先走了",
  "告辞",
  "走了",
  "撤了",
  "回头再来",
] as const;
const TARGET_SWITCH_INTENT_PREFIXES = [
  "找",
  "见",
  "叫",
  "喊",
  "问",
  "请",
  "换",
  "去找",
  "想找",
  "让我找",
] as const;
const HOUSE_TRAVEL_INTENT_PREFIXES = [
  "去",
  "到",
  "上",
  "往",
  "前往",
  "想去",
  "我要去",
  "俺也去",
  "去趟",
  "去一趟",
] as const;
const HOUSE_TRAVEL_INTENT_VERBS = [
  "去",
  "到",
  "上",
  "往",
  "前往",
  "转去",
  "离开",
  "赶去",
] as const;

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

function unwrapHouseIntentGateJsonEnvelope(value: unknown): string | null {
  if (typeof value === "string") {
    return normalizeNonEmptyString(value);
  }

  if (Array.isArray(value)) {
    if (value.length !== 1) {
      return null;
    }

    return unwrapHouseIntentGateJsonEnvelope(value[0]);
  }

  if (!isRecord(value)) {
    return null;
  }

  const directIntentValue = normalizeNonEmptyString(value.intent);
  if (directIntentValue != null) {
    return directIntentValue.startsWith("[INTENT:")
      ? directIntentValue
      : `[INTENT: ${directIntentValue}]`;
  }

  for (const fieldName of INTENT_JSON_FIELD_CANDIDATES) {
    if (fieldName === "intent") {
      continue;
    }

    const unwrappedValue = unwrapHouseIntentGateJsonEnvelope(value[fieldName]);
    if (unwrappedValue != null) {
      return unwrappedValue;
    }
  }

  return null;
}

function tryUnwrapHouseIntentGateJson(value: string): string | null {
  try {
    return unwrapHouseIntentGateJsonEnvelope(JSON.parse(value));
  } catch {
    return null;
  }
}

function tryStripHouseIntentGateCodeFence(value: string): string | null {
  const trimmedValue = value.trim();
  if (
    !CODE_FENCE_START_PATTERN.test(trimmedValue) ||
    !CODE_FENCE_END_PATTERN.test(trimmedValue)
  ) {
    return null;
  }

  return trimmedValue
    .replace(CODE_FENCE_START_PATTERN, "")
    .replace(CODE_FENCE_END_PATTERN, "")
    .trim();
}

function tryStripHouseIntentGateQuotes(value: string): string | null {
  const trimmedValue = value.trim();

  for (const [prefix, suffix] of WRAPPED_INTENT_QUOTES) {
    if (
      trimmedValue.length > prefix.length + suffix.length &&
      trimmedValue.startsWith(prefix) &&
      trimmedValue.endsWith(suffix)
    ) {
      return trimmedValue.slice(prefix.length, -suffix.length).trim();
    }
  }

  return null;
}

function normalizeHouseIntentGateRawText(rawText: string): string {
  let normalizedText = rawText.trim();

  for (let unwrapDepth = 0; unwrapDepth < 4; unwrapDepth += 1) {
    const jsonUnwrapped = tryUnwrapHouseIntentGateJson(normalizedText);
    if (jsonUnwrapped != null && jsonUnwrapped !== normalizedText) {
      normalizedText = jsonUnwrapped;
      continue;
    }

    const fenceStripped = tryStripHouseIntentGateCodeFence(normalizedText);
    if (fenceStripped != null && fenceStripped !== normalizedText) {
      normalizedText = fenceStripped;
      continue;
    }

    const quoteStripped = tryStripHouseIntentGateQuotes(normalizedText);
    if (quoteStripped != null && quoteStripped !== normalizedText) {
      normalizedText = quoteStripped;
      continue;
    }

    break;
  }

  return normalizedText;
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

function normalizeDeterministicHouseIntentText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s\u3000]+/gu, "")
    .replace(/[，。！？；：、,.!?;:"'`“”‘’()[\]{}<>《》「」【】]/gu, "");
}

function hasNormalizedMatch(
  normalizedText: string,
  candidates: readonly string[]
): boolean {
  return candidates.some((candidate) => {
    const normalizedCandidate =
      normalizeDeterministicHouseIntentText(candidate);
    return (
      normalizedCandidate.length > 0 &&
      normalizedText.includes(normalizedCandidate)
    );
  });
}

function buildValidatedDeterministicRoute(input: {
  request: NpcAiDialogueProviderRequest;
  route: HouseConversationRoute;
}): HouseConversationRoute | null {
  const snapshot = input.request.metadata.houseConversationCapabilitySnapshot;
  if (snapshot == null) {
    return null;
  }

  const playerTurnText = resolvePlayerTurnText(input.request) ?? "";
  return (
    resolveAvailableHouseConversationRoute({
      snapshot,
      route: input.route,
      ...(playerTurnText.length === 0 ? {} : { rawPlayerText: playerTurnText }),
    }) ?? null
  );
}

function resolveDeterministicLeaveRoute(
  request: NpcAiDialogueProviderRequest
): HouseConversationRoute | null {
  const snapshot = request.metadata.houseConversationCapabilitySnapshot;
  const playerTurnText = resolvePlayerTurnText(request);
  if (snapshot == null || playerTurnText == null) {
    return null;
  }

  const normalizedPlayerTurnText =
    normalizeDeterministicHouseIntentText(playerTurnText);
  if (normalizedPlayerTurnText.length === 0) {
    return null;
  }

  const leaveAction = snapshot.leaveAction;
  const exactLeaveMatch =
    leaveAction != null &&
    [leaveAction.label, leaveAction.actionId]
      .map((candidate) => normalizeNonEmptyString(candidate))
      .filter((candidate): candidate is string => candidate != null)
      .some(
        (candidate) =>
          normalizeDeterministicHouseIntentText(candidate) ===
          normalizedPlayerTurnText
      );
  if (
    !exactLeaveMatch &&
    !hasNormalizedMatch(
      normalizedPlayerTurnText,
      GENERIC_LEAVE_INTENT_ALIASES
    )
  ) {
    return null;
  }

  return buildValidatedDeterministicRoute({
    request,
    route: {
      kind: "leave-house",
    },
  });
}

function resolveDeterministicSwitchTargetRoute(
  request: NpcAiDialogueProviderRequest
): HouseConversationRoute | null {
  const snapshot = request.metadata.houseConversationCapabilitySnapshot;
  const playerTurnText = resolvePlayerTurnText(request);
  if (snapshot == null || playerTurnText == null) {
    return null;
  }

  const normalizedPlayerTurnText =
    normalizeDeterministicHouseIntentText(playerTurnText);
  if (normalizedPlayerTurnText.length === 0) {
    return null;
  }

  const currentTargetCharacterId = snapshot.targetCharacterId ?? null;
  for (const target of snapshot.switchableNpcTargets) {
    if (
      currentTargetCharacterId != null &&
      target.characterId === currentTargetCharacterId
    ) {
      continue;
    }

    const aliases = [target.characterName, target.characterId].filter(
      (candidate): candidate is string => candidate.trim().length > 0
    );
    const matchedAlias = aliases
      .map((alias) => normalizeDeterministicHouseIntentText(alias))
      .find(
        (normalizedAlias) =>
          normalizedAlias.length > 0 &&
          (normalizedPlayerTurnText === normalizedAlias ||
            TARGET_SWITCH_INTENT_PREFIXES.some((prefix) =>
              normalizedPlayerTurnText.includes(
                `${normalizeDeterministicHouseIntentText(prefix)}${normalizedAlias}`
              )
            ) ||
            normalizedPlayerTurnText.includes(
              `跟${normalizedAlias}`
            ) ||
            normalizedPlayerTurnText.includes(
              `和${normalizedAlias}`
            ) ||
            normalizedPlayerTurnText.includes(
              `同${normalizedAlias}`
            ) ||
            normalizedPlayerTurnText.includes(
              `与${normalizedAlias}`
            ))
      );
    if (matchedAlias == null) {
      continue;
    }

    const route = buildValidatedDeterministicRoute({
      request,
      route: {
        kind: "switch-target-npc",
        characterId: target.characterId,
      },
    });
    if (route != null) {
      return route;
    }
  }

  return null;
}

function collectDeterministicHouseTravelAliases(
  house: HouseConversationCapabilitySnapshot["reachableHouses"][number]
): string[] {
  const aliases = new Set<string>([
    house.houseName,
    house.houseId,
    ...(HOUSE_TRAVEL_ID_ALIASES[house.houseId] ?? []),
  ]);

  if (house.houseName.includes("寺")) {
    aliases.add("寺庙");
    aliases.add("寺里");
  }
  if (house.houseName.includes("货") || house.houseName.includes("商")) {
    aliases.add("货铺");
    aliases.add("商铺");
    aliases.add("商店");
  }
  if (house.houseName.includes("药")) {
    aliases.add("药铺");
    aliases.add("药房");
  }
  if (house.houseName.includes("客栈")) {
    aliases.add("酒店");
    aliases.add("旅店");
  }
  if (house.houseName.includes("茶")) {
    aliases.add("茶馆");
    aliases.add("茶楼");
  }
  if (house.houseName.includes("粮")) {
    aliases.add("粮铺");
    aliases.add("米铺");
    aliases.add("粮店");
  }
  if (house.houseName.includes("府")) {
    aliases.add("府上");
  }

  return [...aliases].filter((alias) => alias.trim().length > 0);
}

function resolveDeterministicTravelRoute(
  request: NpcAiDialogueProviderRequest
): HouseConversationRoute | null {
  const snapshot = request.metadata.houseConversationCapabilitySnapshot;
  const playerTurnText = resolvePlayerTurnText(request);
  if (snapshot == null || playerTurnText == null) {
    return null;
  }

  const normalizedPlayerTurnText =
    normalizeDeterministicHouseIntentText(playerTurnText);
  if (normalizedPlayerTurnText.length === 0) {
    return null;
  }

  for (const house of snapshot.reachableHouses) {
    const normalizedAliases = collectDeterministicHouseTravelAliases(house)
      .map((alias) => normalizeDeterministicHouseIntentText(alias))
      .filter((alias) => alias.length > 0);
    const hasExactAlias = normalizedAliases.some(
      (alias) => alias === normalizedPlayerTurnText
    );
    const hasTravelAlias = normalizedAliases.some(
      (alias) =>
        HOUSE_TRAVEL_INTENT_PREFIXES.some((prefix) =>
          normalizedPlayerTurnText.includes(
            `${normalizeDeterministicHouseIntentText(prefix)}${alias}`
          )
        ) ||
        (normalizedPlayerTurnText.includes(alias) &&
          hasNormalizedMatch(
            normalizedPlayerTurnText,
            HOUSE_TRAVEL_INTENT_VERBS
          ))
    );
    if (!hasExactAlias && !hasTravelAlias) {
      continue;
    }

    const route = buildValidatedDeterministicRoute({
      request,
      route: {
        kind: "go-to-house",
        houseId: house.houseId,
      },
    });
    if (route != null) {
      return route;
    }
  }

  return null;
}

function resolveDeterministicServiceRoute(
  request: NpcAiDialogueProviderRequest
): HouseConversationRoute | null {
  const snapshot = request.metadata.houseConversationCapabilitySnapshot;
  const playerTurnText = resolvePlayerTurnText(request);
  if (snapshot == null || playerTurnText == null) {
    return null;
  }

  const matchedService = matchNpcSpecialActionByText({
    text: playerTurnText,
    actions: snapshot.houseServices.map((service) => ({
      id: service.serviceId,
      label: service.label,
      kind: "special" as const,
    })),
  });
  if (matchedService == null) {
    return null;
  }

  return buildValidatedDeterministicRoute({
    request,
    route: {
      kind: "settle-house-service",
      serviceId: matchedService.id,
      rawPlayerText: playerTurnText,
    },
  });
}

function resolveDeterministicActionRoute(
  request: NpcAiDialogueProviderRequest
): HouseConversationRoute | null {
  const snapshot = request.metadata.houseConversationCapabilitySnapshot;
  const playerTurnText = resolvePlayerTurnText(request);
  if (snapshot == null || playerTurnText == null) {
    return null;
  }

  const matchedAction = matchNpcSpecialActionByText({
    text: playerTurnText,
    actions: snapshot.houseActions.map((action) => ({
      id: action.actionId,
      label: action.label,
      kind: "special" as const,
    })),
  });
  if (matchedAction == null) {
    return null;
  }

  return buildValidatedDeterministicRoute({
    request,
    route: {
      kind: "open-house-action",
      actionId: matchedAction.id,
    },
  });
}

export function resolveDeterministicHouseConversationIntentDecision(
  request: NpcAiDialogueProviderRequest
): HouseConversationIntentGateDecision | null {
  if (
    request.metadata.houseConversationCapabilitySnapshot == null ||
    resolvePlayerTurnText(request) == null
  ) {
    return null;
  }

  const route =
    resolveDeterministicLeaveRoute(request) ??
    resolveDeterministicSwitchTargetRoute(request) ??
    resolveDeterministicTravelRoute(request) ??
    resolveDeterministicServiceRoute(request) ??
    resolveDeterministicActionRoute(request);
  return route == null
    ? null
    : {
        kind: "route",
        route,
      };
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
          `玩家刚才的原话（逐字判断，不要改写）：${playerTurnText}`,
          routeSummary,
          ...(routeExamples.length === 0
            ? []
            : [`当前允许的精确 intent 例子：`, ...routeExamples]),
          "判定原则（只在心里执行，不要输出这些说明）：",
          "1. 先判断这句话是否已经明确要求办事、换人、换地点、离开，或推进剧情。",
          "2. 如果已经明确，就从当前允许列表里原样拷贝唯一合法 route id，输出对应 [INTENT: route|...]。",
          "3. 如果只是闲聊，输出 [INTENT: chat]；如果像办事但目标还不够明确，输出 [INTENT: clarify]。",
          "4. 如果玩家已明确说出要办的事，不得输出 clarify。",
          "5. 如果原话虽短，但结合当前可用 route 已能唯一落到某个合法 route，也必须输出对应 route。",
          "再次强调：这一阶段不是 NPC 对话。输出必须只有一行，而且只能是 1 个 [INTENT: ...] 标记。",
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
          "不要解释错误原因，不要写台词，不要写 JSON，不要写代码块。",
          "route 的 id 必须从当前允许列表里原样拷贝。",
          "如果玩家已明确说出要办的事，不得输出 clarify。",
          "如果原话虽短，但结合当前可用 route 已能唯一落到某个合法 route，也不得输出 chat 或 clarify。",
          "输出必须只有一行，而且只能是 1 个 [INTENT: ...] 标记。",
        ].join("\n"),
      },
    ],
  };
}

export function buildHouseConversationIntentGateConflictRepairRequest(
  request: NpcAiDialogueProviderRequest,
  route: HouseConversationRoute
): NpcAiDialogueProviderRequest {
  const { routeSummary, routeExamples } = buildRouteSummaryPrompt(request);
  const snapshot = request.metadata.houseConversationCapabilitySnapshot;
  const routeLabel =
    snapshot == null
      ? route.kind
      : describeHouseConversationRoute(snapshot, route);
  const forcedMarker = buildForcedRouteIntentMarker(route);

  return {
    ...request,
    requestId: `${request.requestId}:house-intent-conflict-repair`,
    system: HOUSE_INTENT_GATE_SYSTEM,
    messages: [
      resolveContextMessage(request),
      {
        role: "user",
        content: [
          `玩家刚才的原话（逐字判断，不要改写）：${resolvePlayerTurnText(request) ?? "继续"}`,
          routeSummary,
          ...(routeExamples.length === 0
            ? []
            : [`当前允许的精确 intent 例子：`, ...routeExamples]),
          `这句原话在当前语境下已经能唯一落到合法 route：${routeLabel}。`,
          `高置信候选 marker：${forcedMarker}`,
          "像“来几局”“赌两把”“上桌试手气”这类短句，只要在当前地点能唯一落到合法 route，就属于明确办事，不是闲聊。",
          "请重新判断。",
          "不得继续输出 chat 或 clarify。",
          "route 的 id 必须从当前允许列表里原样拷贝。",
          "输出必须只有一行，而且只能是 1 个 [INTENT: ...] 标记。",
        ].join("\n"),
      },
    ],
  };
}

function buildForcedRouteIntentMarker(route: HouseConversationRoute): string {
  switch (route.kind) {
    case "switch-target-npc":
      return `[INTENT: route|switch-target-npc|${route.characterId}]`;
    case "open-house-action":
      return `[INTENT: route|open-house-action|${route.actionId}]`;
    case "settle-house-service":
      return `[INTENT: route|settle-house-service|${route.serviceId}]`;
    case "go-to-house":
      return `[INTENT: route|go-to-house|${route.houseId}]`;
    case "leave-house":
      return "[INTENT: route|leave-house]";
    case "negotiate-story-node":
      return route.targetCharacterId == null
        ? `[INTENT: route|negotiate-story-node|${route.nodeId}|${route.approach}]`
        : `[INTENT: route|negotiate-story-node|${route.nodeId}|${route.approach}|${route.targetCharacterId}]`;
    default:
      return "[INTENT: chat]";
  }
}

function resolveRouteFromIntentParts(input: {
  rawParts: string[];
  request: NpcAiDialogueProviderRequest;
}): HouseConversationRoute | null {
  const routeKind = input.rawParts[1]?.toLocaleLowerCase() ?? "";
  const playerTurnText = resolvePlayerTurnText(input.request) ?? "";

  switch (routeKind) {
    case "switch-target-npc": {
      if (input.rawParts.length !== 3) {
        return null;
      }

      const characterId = normalizeNonEmptyString(input.rawParts[2]);
      return characterId == null
        ? null
        : {
            kind: "switch-target-npc",
            characterId,
          };
    }
    case "open-house-action": {
      if (input.rawParts.length !== 3) {
        return null;
      }

      const actionId = normalizeNonEmptyString(input.rawParts[2]);
      return actionId == null
        ? null
        : {
            kind: "open-house-action",
            actionId,
          };
    }
    case "settle-house-service": {
      if (input.rawParts.length !== 3) {
        return null;
      }

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
      if (input.rawParts.length !== 3) {
        return null;
      }

      const houseId = normalizeNonEmptyString(input.rawParts[2]);
      return houseId == null
        ? null
        : {
            kind: "go-to-house",
            houseId,
          };
    }
    case "leave-house": {
      if (input.rawParts.length !== 2) {
        return null;
      }

      return {
        kind: "leave-house",
      };
    }
    case "negotiate-story-node": {
      if (input.rawParts.length !== 4 && input.rawParts.length !== 5) {
        return null;
      }

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
  const normalizedRawText = normalizeHouseIntentGateRawText(input.rawText);
  const markerMatches = [...normalizedRawText.matchAll(INTENT_MARKER_PATTERN)];
  if (markerMatches.length !== 1) {
    return {
      issue: "室内意图门禁阶段必须且只返回 1 个 [INTENT: ...]。",
    };
  }

  const rawMarker = markerMatches[0]?.[0];
  if (rawMarker == null || normalizedRawText !== rawMarker) {
    return {
      issue: "室内意图门禁阶段只能输出 1 个完整的 [INTENT: ...] 标记。",
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
    .map((part) => part.trim());
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
  const {
    availableSpecialActions: _availableSpecialActions,
    forcedHouseConversationRoute: _forcedHouseConversationRoute,
    forcedSpecialActionId: _forcedSpecialActionId,
    houseConversationCapabilitySnapshot: _houseConversationCapabilitySnapshot,
    ...nonExecutableMetadata
  } = input.request.metadata;

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
    metadata: nonExecutableMetadata,
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
