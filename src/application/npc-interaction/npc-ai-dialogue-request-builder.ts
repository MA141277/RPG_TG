import type {
  NpcAiDialogueMemoryEntry,
  NpcAiDialogueReactionMemoryEntry,
  NpcAiDialogueProviderInputType,
  NpcAiDialogueProviderMessage,
  NpcAiDialogueProviderRequest,
  NpcAiDialogueSpecialActionMetadata,
  NpcAiDialogueTranscriptEntry,
} from "../../domain/npc-ai-dialogue";
import type { HouseConversationCapabilitySnapshot } from "../../domain/house-conversation";
import type { WorldObservedEvent } from "../../domain/world-intent";

const DEFAULT_NPC_AI_DIALOGUE_SYSTEM = [
  "你是历史题材的 NPC 对话主持人。",
  "NPC 发言不能 OOC，必须符合人物设定、身份、关系、地点与当前情境。",
  "输出必须只使用保留标记：[NARRATION]、[DIALOGUE]、[CHOICE]、[OPTION]、[ACTION]、[END_CHOICE]。",
  "如需把对话直接转入当前地点已有功能，可在给出至少 1 句符合人设的寒暄、说明或引导后，输出 [ACTION: exact_action_id]。",
  "输出 [ACTION] 时禁止同时输出 [CHOICE]、[OPTION] 或 [END_CHOICE]。",
  "每次完整回复都必须且只允许给出 1 个 CHOICE 区块，并在其中给出恰好 3 个 OPTION。",
  "这 3 个 OPTION 必须依次对应善意、中立、恶意三种接话倾向。",
  "NARRATION 使用格式：[NARRATION: 场景、动作或语气描述]。不要输出 [NARRATION] 后面直接跟正文。",
  'DIALOGUE 使用格式：[DIALOGUE: NPC_ID,NPC_NAME,"台词"]。',
  "OPTION 使用格式：option_id|按钮文案|角色实际说法|kind|recommended。",
  "每个 OPTION 的按钮文案与角色实际说法必须完全相同，且都要直接写成玩家此刻会说出口的中文台词。",
  "禁止输出“善意回应”“中立回应”“恶意回应”“option 1”“Option 2”“reply”或任何英文标签、编号、解释。",
  "OPTION 的 kind 只能使用 benevolent、neutral、hostile 之一。",
  "不要编造未列出的对象、地点、功能或剧情交涉节点。",
  "不要输出额外解释，只能输出保留标记内容。",
].join("\n");

function summarizeTranscript(
  transcript: NpcAiDialogueTranscriptEntry[]
): string | null {
  if (transcript.length === 0) {
    return null;
  }

  return transcript
    .slice(-8)
    .map((entry) =>
      entry.type === "narration"
        ? `旁白：${entry.text}`
        : `${entry.speakerName ?? "角色"}：${entry.text}`
    )
    .join("\n");
}

function summarizeMemoryLog(entries: NpcAiDialogueMemoryEntry[]): string | null {
  if (entries.length === 0) {
    return null;
  }

  return entries
    .slice(-8)
    .map((entry) => {
      if (entry.speaker === "narration") {
        return `旁白：${entry.text}`;
      }
      return `${entry.speakerName ?? entry.speakerId ?? "角色"}：${entry.text}`;
    })
    .join("\n");
}

function summarizeReactionMemoryLog(
  entries: NpcAiDialogueReactionMemoryEntry[],
  currentHouseId?: string
): string | null {
  const relevantEntries =
    currentHouseId == null
      ? entries
      : entries.filter((entry) => entry.houseId === currentHouseId);
  if (relevantEntries.length === 0) {
    return null;
  }

  return relevantEntries
    .slice(-5)
    .reverse()
    .map((entry) => entry.summary.trim())
    .filter((summary) => summary.length > 0)
    .join("\n");
}

function selectLatestReactionMemorySummary(
  entries: NpcAiDialogueReactionMemoryEntry[],
  currentHouseId?: string
): string | null {
  const relevantEntries =
    currentHouseId == null
      ? entries
      : entries.filter((entry) => entry.houseId === currentHouseId);
  if (relevantEntries.length === 0) {
    return null;
  }

  for (let index = relevantEntries.length - 1; index >= 0; index -= 1) {
    const summary = relevantEntries[index]?.summary.trim() ?? "";
    if (summary.length > 0) {
      return summary;
    }
  }

  return null;
}

function summarizeRecentObservedEvents(
  events: WorldObservedEvent[]
): string | null {
  const summarizedEvents = events
    .slice(-6)
    .map((event) => event.summary.trim())
    .filter((summary) => summary.length > 0);

  if (summarizedEvents.length === 0) {
    return null;
  }

  return summarizedEvents.join("\n");
}

function summarizeSpecialActions(
  actions: NpcAiDialogueSpecialActionMetadata[]
): string | null {
  if (actions.length === 0) {
    return null;
  }

  return actions
    .map((action) => `${action.id}：${action.label}`)
    .join("\n");
}

function summarizeHouseConversationSnapshot(
  snapshot: HouseConversationCapabilitySnapshot
): string[] {
  const segments: string[] = [];

  if (snapshot.switchableNpcTargets.length > 0) {
    segments.push(
      `当前可切换交谈对象：\n${snapshot.switchableNpcTargets
        .map((target) => `${target.characterId}：${target.characterName}`)
        .join("\n")}`
    );
  }

  if (snapshot.houseServices.length > 0) {
    segments.push(
      `当前可直接办理的语义服务：\n${snapshot.houseServices
        .map(
          (service) =>
            `${service.serviceId}：${service.label}${
              service.description.trim().length === 0
                ? ""
                : `（${service.description}）`
            }`
        )
        .join("\n")}`
    );
  }

  if (snapshot.reachableHouses.length > 0) {
    segments.push(
      `当前可前往的地点：\n${snapshot.reachableHouses
        .map((house) => `${house.houseId}：${house.houseName}`)
        .join("\n")}`
    );
  }

  if (snapshot.leaveAction != null) {
    segments.push(
      `当前可离开方式：\n${snapshot.leaveAction.actionId}：${snapshot.leaveAction.label}`
    );
  }

  if (snapshot.negotiableStoryNodes.length > 0) {
    segments.push(
      `当前可推进的剧情交涉：\n${snapshot.negotiableStoryNodes
        .map((node) => {
          const approachSummary =
            node.allowedApproaches == null || node.allowedApproaches.length === 0
              ? ""
              : `（可用方式：${node.allowedApproaches.join("、")}）`;
          return `${node.nodeId}：${node.label}${approachSummary}`;
        })
        .join("\n")}`
    );
  }

  return segments;
}

export function buildNpcAiDialogueProviderRequest(input: {
  requestId: string;
  contextType: "house" | "city" | "scene";
  npcId: string;
  npcName: string;
  playerName: string;
  inputType: NpcAiDialogueProviderInputType;
  placeName?: string;
  houseId?: string;
  transcript?: NpcAiDialogueTranscriptEntry[];
  memoryEntries?: NpcAiDialogueMemoryEntry[];
  reactionMemoryEntries?: NpcAiDialogueReactionMemoryEntry[];
  selectedOptionId?: string;
  selectedOptionLabel?: string;
  customInputText?: string;
  recentObservedEvents?: WorldObservedEvent[];
  availableSpecialActions?: NpcAiDialogueSpecialActionMetadata[];
  houseConversationCapabilitySnapshot?: HouseConversationCapabilitySnapshot;
  houseStateSummary?: string;
}): NpcAiDialogueProviderRequest {
  const messages: NpcAiDialogueProviderMessage[] = [];
  const memorySummary = summarizeMemoryLog(input.memoryEntries ?? []);
  const reactionMemorySummary = summarizeReactionMemoryLog(
    input.reactionMemoryEntries ?? [],
    input.houseId
  );
  const latestReactionMemorySummary = selectLatestReactionMemorySummary(
    input.reactionMemoryEntries ?? [],
    input.houseId
  );
  const transcriptSummary = summarizeTranscript(input.transcript ?? []);
  const recentObservedEventSummary = summarizeRecentObservedEvents(
    input.recentObservedEvents ?? []
  );
  const availableSpecialActions =
    input.availableSpecialActions ??
    input.houseConversationCapabilitySnapshot?.houseActions.map((action) => ({
      id: action.actionId,
      label: action.label,
    })) ??
    [];
  const specialActionSummary = summarizeSpecialActions(availableSpecialActions);
  const houseStateSummary =
    input.houseStateSummary == null || input.houseStateSummary.trim().length === 0
      ? null
      : input.houseStateSummary.trim();
  const hiddenRouteSummary =
    input.houseConversationCapabilitySnapshot == null
      ? []
      : summarizeHouseConversationSnapshot(
          input.houseConversationCapabilitySnapshot
        );

  messages.push({
    role: "user",
    content: [
      `当前地点：${input.placeName ?? "未知地点"}`,
      `当前玩家：${input.playerName}`,
      `当前NPC：${input.npcName}`,
      `当前对话双方：${input.playerName} 与 ${input.npcName}`,
      specialActionSummary == null
        ? "当前可直接办理的功能：无"
        : `当前可直接办理的功能（只有这些才能跳转）：\n${specialActionSummary}`,
      houseStateSummary == null
        ? null
        : `当前房内状态：\n${houseStateSummary}`,
      ...hiddenRouteSummary,
      recentObservedEventSummary == null
        ? null
        : `最近环境事件：\n${recentObservedEventSummary}`,
      reactionMemorySummary == null
        ? null
        : `此人对玩家最近行为的反应记忆（优先开场）：\n${reactionMemorySummary}`,
      memorySummary == null ? null : `此人的既有记忆摘要：\n${memorySummary}`,
      transcriptSummary == null ? null : `刚才对话摘要：\n${transcriptSummary}`,
    ]
      .filter((segment): segment is string => segment != null)
      .join("\n\n"),
  });

  switch (input.inputType) {
    case "start_talk":
      messages.push({
        role: "user",
        content: [
          "开始和这个人交谈。请根据当前情况，并结合当前地点与当前人物，由 NPC 先说一句自然的开场白，可以是问候、寒暄、试探或提醒等话语；不能 OOC，必须符合人物设定。",
          houseStateSummary == null
            ? null
            : "若上文“当前房内状态”已经表明玩家是此地内部人员、门内弟子、僧人、属员、学徒、已挂单修行者或正在当差之人，就绝不能把玩家称作施主、客官、香客、外来人。",
          houseStateSummary == null
            ? null
            : "若“当前房内状态”已经给出当前差事、贡献、周次、评定或待办事务，开场应优先围绕这些职责、安排、进度或下一步要做的事发话，而不是把玩家当成初来乍到的陌生访客。",
          latestReactionMemorySummary == null
            ? null
            : `开场第一句必须先直接回应这条最近行为：${latestReactionMemorySummary}`,
          reactionMemorySummary == null
            ? null
            : "若上文存在“此人对玩家最近行为的反应记忆（优先开场）”，必须先围绕第一条最新反应记忆开场，不得直接忽略后改成普通寒暄。",
          "说完后直接继续给出对方回应与恰好 3 个可选接话，且每个接话都要直接写成玩家会说出口的完整中文台词。",
        ]
          .filter((segment): segment is string => segment != null)
          .join("\n"),
      });
      break;
    case "select_option":
      messages.push({
        role: "user",
        content: [
          `我选择接话：${input.selectedOptionLabel ?? input.selectedOptionId ?? "继续"}`,
          "如果这句话在当前地点语义上已经明确是在请求办理某个现有功能，请先给出符合人设的过渡回应，再输出 [ACTION: exact_action_id]。",
          "如果不是办理功能，就正常继续对话，并返回恰好 3 个可选接话。",
        ].join("\n"),
      });
      break;
    case "custom_input":
      messages.push({
        role: "user",
        content: [
          input.customInputText?.trim() ?? "",
          "如果这句话在当前地点语义上已经明确是在请求办理某个现有功能，请先给出符合人设的过渡回应，再输出 [ACTION: exact_action_id]。",
          "如果不是办理功能，就正常继续对话，并返回恰好 3 个可选接话。",
        ]
          .filter((segment) => segment.length > 0)
          .join("\n"),
      });
      break;
    default:
      break;
  }

  return {
    requestId: input.requestId,
    system: DEFAULT_NPC_AI_DIALOGUE_SYSTEM,
    messages,
      metadata: {
      contextType: input.contextType,
      npcId: input.npcId,
      npcName: input.npcName,
      inputType: input.inputType,
      ...(input.placeName == null ? {} : { placeName: input.placeName }),
      ...(input.houseId == null ? {} : { houseId: input.houseId }),
      ...(latestReactionMemorySummary == null
        ? {}
        : { latestReactionMemorySummary }),
      ...(input.selectedOptionId == null
        ? {}
        : { selectedOptionId: input.selectedOptionId }),
      ...(input.selectedOptionLabel == null
        ? {}
        : { selectedOptionLabel: input.selectedOptionLabel }),
      ...(input.customInputText == null || input.customInputText.trim().length === 0
        ? {}
        : { customInputText: input.customInputText.trim() }),
      ...(availableSpecialActions.length === 0
        ? {}
        : { availableSpecialActions }),
      ...(input.houseConversationCapabilitySnapshot == null
        ? {}
        : {
            houseConversationCapabilitySnapshot:
              input.houseConversationCapabilitySnapshot,
          }),
    },
  };
}
