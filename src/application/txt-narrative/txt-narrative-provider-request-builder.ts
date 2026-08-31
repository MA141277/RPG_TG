import type {
  TxtNarrativeProviderInputType,
  TxtNarrativeProviderMessage,
  TxtNarrativeProviderRequest,
  TxtNarrativeTranscriptEntry,
} from "../../domain/txt-narrative";

const DEFAULT_TXT_NARRATIVE_SYSTEM = [
  "你是历史题材文字冒险主持人。",
  "输出必须只使用保留标记：[NARRATION]、[DIALOGUE]、[SET_FLAG]、[CHOICE]、[OPTION]、[END_CHOICE]、[SCENE_CHANGE]。",
  'DIALOGUE 使用三段格式：[DIALOGUE: NPC_ID,NPC_NAME,"台词"]。',
  "OPTION 优先使用结构化格式：option_id|按钮文案|显示文本|kind|recommended。",
  "不要输出额外解释。",
].join("\n");

function summarizeTranscript(
  transcript: TxtNarrativeTranscriptEntry[]
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

export function buildTxtNarrativeProviderRequest(input: {
  requestId: string;
  phaseId: string;
  houseId: string;
  placeName: string;
  inputType: TxtNarrativeProviderInputType;
  transcript?: TxtNarrativeTranscriptEntry[];
  selectedOptionId?: string;
  selectedOptionLabel?: string;
  freeInputText?: string;
}): TxtNarrativeProviderRequest {
  const messages: TxtNarrativeProviderMessage[] = [];
  const transcriptSummary = summarizeTranscript(input.transcript ?? []);
  if (transcriptSummary != null) {
    messages.push({
      role: "assistant",
      content: `前情摘要：\n${transcriptSummary}`,
    });
  }

  switch (input.inputType) {
    case "enter_place":
      messages.push({
        role: "user",
        content: `进入地点：${input.placeName}。请直接展开这一段历史处境，并给出可操作选项。`,
      });
      break;
    case "select_option":
      messages.push({
        role: "user",
        content: `我选择了：${input.selectedOptionLabel ?? input.selectedOptionId ?? "继续"}`,
      });
      break;
    case "free_input":
      messages.push({
        role: "user",
        content: input.freeInputText?.trim() ?? "",
      });
      break;
    case "reactivate_narrative":
      messages.push({
        role: "user",
        content: "继续主动推演当前局势，并给出新的下一步选项。",
      });
      break;
    default:
      break;
  }

  return {
    requestId: input.requestId,
    system: DEFAULT_TXT_NARRATIVE_SYSTEM,
    messages,
    metadata: {
      phaseId: input.phaseId,
      houseId: input.houseId,
      placeName: input.placeName,
      inputType: input.inputType,
      ...(input.selectedOptionId == null
        ? {}
        : { selectedOptionId: input.selectedOptionId }),
      ...(input.selectedOptionLabel == null
        ? {}
        : { selectedOptionLabel: input.selectedOptionLabel }),
      ...(input.freeInputText == null || input.freeInputText.trim().length === 0
        ? {}
        : { freeInputText: input.freeInputText.trim() }),
    },
  };
}
