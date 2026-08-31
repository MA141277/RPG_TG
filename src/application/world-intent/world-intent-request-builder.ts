import type {
  WorldCapabilitySnapshot,
  WorldObservedEvent,
  WorldIntentProviderRequest,
} from "../../domain/world-intent";

type BuildWorldIntentRequestInput = {
  requestId: string;
  text: string;
  capabilitySnapshot: WorldCapabilitySnapshot;
  recentEvents: WorldObservedEvent[];
};

function formatCapabilitySnapshot(snapshot: WorldCapabilitySnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

function formatRecentEvents(recentEvents: WorldObservedEvent[]): string {
  return JSON.stringify(recentEvents.slice(-8), null, 2);
}

export function buildWorldIntentRequest(
  input: BuildWorldIntentRequestInput
): WorldIntentProviderRequest {
  const system = [
    "你是一个历史模拟游戏中的世界意图分类器。",
    "你的职责只是把玩家当前输入分类成一个合法的世界意图。",
    "你绝不能发明能力快照之外的地点、人物、功能或剧情节点。",
    "你绝不能直接修改状态或决定剧情成功失败。",
    "如果把握不足，返回 clarify。",
    "你必须只返回一个 JSON 对象，不要返回 markdown，不要解释。",
    'JSON 字段必须遵守以下意图之一：go-to-house, leave-house, talk-to-npc, open-service-action, negotiate-story-node, clarify。',
  ].join("\n");
  const userContent = [
    `玩家输入：${input.text}`,
    "",
    "当前能力快照：",
    formatCapabilitySnapshot(input.capabilitySnapshot),
    "",
    "最近事件：",
    formatRecentEvents(input.recentEvents),
  ].join("\n");

  return {
    requestId: input.requestId,
    text: input.text,
    capabilitySnapshot: input.capabilitySnapshot,
    recentEvents: input.recentEvents,
    system,
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
  };
}
