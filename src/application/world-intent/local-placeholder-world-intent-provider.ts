import type {
  WorldAiIntentResponse,
  WorldCapabilitySnapshot,
  WorldIntentProvider,
  WorldIntentProviderRequest,
  WorldNegotiationApproach,
  WorldReachableHouseCapability,
  WorldServiceActionCapability,
  WorldStoryNegotiationCapability,
  WorldTalkTargetCapability,
} from "../../domain/world-intent";

type AliasMap = Record<string, string[]>;

const HOUSE_ALIASES: AliasMap = {
  "house.kulan.temple": ["寺庙", "寺里", "皇觉寺"],
  "house.kulan.market": ["商铺", "商店", "货铺", "铺子"],
  "house.kulan.medicine_house": ["药铺", "药房"],
  "house.kulan.inn": ["客栈", "旅店", "酒店"],
  "house.kulan.tea_house": ["茶馆", "茶楼"],
  "house.kulan.keep": ["帅府", "郭子兴那里", "郭帅那里"],
  "home_001": ["住处", "家里", "回家"],
  "house.kulan.grain_shop": ["粮铺", "米铺", "粮店"],
  "house.kulan.leader_residence": ["宅邸", "府上"],
};

const NEGOTIATION_ALIASES: AliasMap = {
  "temple.request-early-begging": [
    "化缘",
    "出去化缘",
    "先让我出去",
    "先让我出门",
    "放我出去",
  ],
  "temple.review-work-plan-negotiation": [
    "寺务",
    "干活",
    "我会干活",
    "我能更快",
  ],
  "keep.assignment-negotiation": ["差事", "领差", "任务", "安排活"],
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function containsAny(text: string, candidates: string[]): boolean {
  return candidates.some((candidate) =>
    text.includes(candidate.trim().toLowerCase())
  );
}

function findHouseMatch(
  text: string,
  houses: WorldReachableHouseCapability[]
): WorldReachableHouseCapability | null {
  return (
    houses.find((house) => {
      const aliases = HOUSE_ALIASES[house.houseId] ?? [];
      return containsAny(text, [house.houseName, house.houseId, ...aliases]);
    }) ?? null
  );
}

function findTalkTargetMatch(
  text: string,
  talkTargets: WorldTalkTargetCapability[]
): WorldTalkTargetCapability | null {
  return (
    talkTargets.find((target) =>
      containsAny(text, [
        target.characterName,
        target.characterId,
        `找${target.characterName}`,
        `见${target.characterName}`,
        `和${target.characterName}谈`,
      ])
    ) ?? null
  );
}

function findServiceActionMatch(
  text: string,
  serviceActions: WorldServiceActionCapability[]
): WorldServiceActionCapability | null {
  return (
    serviceActions.find((action) => {
      const genericAliases =
        action.label.includes("买")
          ? ["买", "买点东西", "进货"]
          : action.label.includes("卖")
            ? ["卖", "出手", "卖掉"]
            : action.label.includes("调查") || action.label.includes("行情")
              ? ["行情", "货", "什么货", "特产", "卖什么"]
              : action.label.includes("工作")
                ? ["工作", "干活"]
                : action.label.includes("喝酒")
                  ? ["喝酒", "来壶酒"]
                  : action.label.includes("赌")
                    ? ["赌博", "赌", "赌几把", "上桌"]
                    : [];
      return containsAny(text, [action.label, action.actionId, ...genericAliases]);
    }) ?? null
  );
}

function resolveNegotiationApproach(text: string): WorldNegotiationApproach {
  if (containsAny(text, ["求", "请", "劳烦"])) {
    return "plea";
  }
  if (containsAny(text, ["我能", "我会", "更快", "更好"])) {
    return "competence";
  }
  if (containsAny(text, ["职责", "本分", "应该"])) {
    return "duty";
  }
  if (containsAny(text, ["放我", "让我", "我要"])) {
    return "pragmatic";
  }
  if (containsAny(text, ["不服", "偏要"])) {
    return "defiant";
  }
  return "deferential";
}

function findNegotiationMatch(
  text: string,
  nodes: WorldStoryNegotiationCapability[]
): WorldStoryNegotiationCapability | null {
  return (
    nodes.find((node) => {
      const aliases = NEGOTIATION_ALIASES[node.nodeId] ?? [];
      return containsAny(text, [node.label, node.nodeId, ...aliases]);
    }) ?? null
  );
}

function createClarifyResponse(
  snapshot: WorldCapabilitySnapshot
): WorldAiIntentResponse {
  const houseHint = snapshot.reachableHouses[0]?.houseName ?? "当前地点";
  return {
    intent: "clarify",
    question: `你现在想去哪里，还是想找谁交谈？比如去${houseHint}，或直接说明要办的事。`,
    confidence: 0.2,
  };
}

function classifyFromSnapshot(
  request: WorldIntentProviderRequest
): WorldAiIntentResponse {
  const text = normalizeText(request.text);
  const snapshot = request.capabilitySnapshot;

  if (
    snapshot.leaveAction != null &&
    containsAny(text, ["离开", "出去", "出门", "返回", "走吧"])
  ) {
    return {
      intent: "leave-house",
      shortNarration: "你转身准备离开当前地点。",
      confidence: 0.95,
    };
  }

  const negotiation = findNegotiationMatch(text, snapshot.negotiableStoryNodes);
  if (negotiation != null) {
    return {
      intent: "negotiate-story-node",
      nodeId: negotiation.nodeId,
      ...(negotiation.targetCharacterId == null
        ? {}
        : { targetCharacterId: negotiation.targetCharacterId }),
      approach: resolveNegotiationApproach(text),
      shortNarration: "你斟酌着语气，准备就眼前的事开口请求。",
      confidence: 0.9,
    };
  }

  const serviceAction = findServiceActionMatch(text, snapshot.serviceActions);
  if (serviceAction != null) {
    return {
      intent: "open-service-action",
      actionId: serviceAction.actionId,
      shortNarration: "你顺着眼前的话头，把事情引向当前能办的正事。",
      confidence: 0.92,
    };
  }

  const talkTarget = findTalkTargetMatch(text, snapshot.talkTargets);
  if (talkTarget != null) {
    return {
      intent: "talk-to-npc",
      targetCharacterId: talkTarget.characterId,
      shortNarration: `你朝${talkTarget.characterName}那边走近，准备开口。`,
      confidence: 0.94,
    };
  }

  const house = findHouseMatch(text, snapshot.reachableHouses);
  if (house != null) {
    return {
      intent: "go-to-house",
      targetHouseId: house.houseId,
      shortNarration: `你打定主意，朝${house.houseName}那边赶去。`,
      confidence: 0.96,
    };
  }

  return createClarifyResponse(snapshot);
}

export function createLocalPlaceholderWorldIntentProvider(): WorldIntentProvider {
  return {
    async classify(request) {
      return {
        requestId: request.requestId,
        result: classifyFromSnapshot(request),
      };
    },
  };
}
