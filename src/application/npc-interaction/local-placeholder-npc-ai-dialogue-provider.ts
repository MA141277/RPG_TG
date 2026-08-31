import type {
  NpcAiDialogueProvider,
  NpcAiDialogueProviderRequest,
  NpcAiDialogueStep,
} from "../../domain/npc-ai-dialogue";
import { parseTxtNarrativeMarkerScript } from "../txt-narrative/txt-narrative-marker-parser";

function escapeDialogueText(value: string): string {
  return value.replace(/"/g, "“").trim();
}

function toNpcAiDialogueSteps(rawText: string): NpcAiDialogueStep[] {
  return parseTxtNarrativeMarkerScript(rawText).flatMap((step) => {
    if (
      step.type === "narration" ||
      step.type === "dialogue" ||
      step.type === "choice"
    ) {
      return [step];
    }
    return [];
  });
}

function buildThreeOptionScript(input: {
  npcId: string;
  npcName: string;
  line: string;
  prompt?: string;
  options?: Array<{
    id: string;
    label: string;
    actionText?: string;
    kind?: string;
    recommended?: boolean;
  }>;
}): string {
  const options =
    input.options ?? [
      {
        id: "option.ask_town",
        label: "问城里近况",
        kind: "benevolent",
        recommended: true,
      },
      {
        id: "option.ask_road",
        label: "问路上见闻",
        kind: "neutral",
        recommended: false,
      },
      {
        id: "option.ask_people",
        label: "问近来人物",
        kind: "hostile",
        recommended: false,
      },
    ];

  return [
    `[DIALOGUE: ${input.npcId},${input.npcName},"${escapeDialogueText(input.line)}"]`,
    `[CHOICE: ${input.prompt ?? "你想怎么接话？"}]`,
    ...options.slice(0, 3).map((option) => {
      const actionText = option.actionText ?? option.label;
      return `[OPTION: ${option.id}|${option.label}|${actionText}|${
        option.kind ?? "mainline"
      }|${option.recommended === true ? "true" : "false"}]`;
    }),
    "[END_CHOICE]",
  ].join("\n");
}

function buildPlaceholderScript(
  request: NpcAiDialogueProviderRequest
): string {
  const { npcId, npcName } = request.metadata;

  if (request.metadata.inputType === "start_talk") {
    return buildThreeOptionScript({
      npcId,
      npcName,
      line: `${npcName === "" ? "对方" : npcName}压低嗓音道：这几日城里风声不稳，你想先听哪一头？`,
    });
  }

  if (request.metadata.inputType === "select_option") {
    if (request.metadata.selectedOptionId === "option.ask_town") {
      return buildThreeOptionScript({
        npcId,
        npcName,
        line: "城里最近查得紧，粮价和人心都在浮。",
        options: [
          {
            id: "option.ask_road",
            label: "追问路上见闻",
            kind: "benevolent",
            recommended: true,
          },
          {
            id: "option.ask_people",
            label: "再问近来人物",
            kind: "neutral",
            recommended: false,
          },
          {
            id: "option.ask_trade",
            label: "问买卖风向",
            kind: "hostile",
            recommended: false,
          },
        ],
      });
    }

    if (request.metadata.selectedOptionId === "option.ask_road") {
      return buildThreeOptionScript({
        npcId,
        npcName,
        line: "近路虽然快，可盘查也最严，真要走动得先备一套说辞。",
        options: [
          {
            id: "option.ask_people",
            label: "问可托付之人",
            kind: "benevolent",
            recommended: true,
          },
          {
            id: "option.ask_town",
            label: "回头问城里动静",
            kind: "neutral",
            recommended: false,
          },
          {
            id: "option.ask_trade",
            label: "问货路买卖",
            kind: "hostile",
            recommended: false,
          },
        ],
      });
    }

    return buildThreeOptionScript({
      npcId,
      npcName,
      line: "这事我也略知一二，不过你若真想深问，还得再点得更明白些。",
    });
  }

  if (request.metadata.customInputText != null) {
    const echoed = escapeDialogueText(request.metadata.customInputText);
    return buildThreeOptionScript({
      npcId,
      npcName,
      line: `你提起“${echoed}”，我倒也听过些风声，只是还得分哪一头去问。`,
    });
  }

  return buildThreeOptionScript({
    npcId,
    npcName,
    line: "你若不开口，我便只能先看你脸色了。",
  });
}

export function createLocalPlaceholderNpcAiDialogueProvider(): NpcAiDialogueProvider {
  const cancelledRequestIds = new Set<string>();

  return {
    async stream(request, onEvent) {
      cancelledRequestIds.delete(request.requestId);
      await onEvent({
        type: "start",
        requestId: request.requestId,
      });

      if (cancelledRequestIds.has(request.requestId)) {
        return;
      }

      const rawText = buildPlaceholderScript(request);
      await onEvent({
        type: "complete",
        requestId: request.requestId,
        rawText,
        allSteps: toNpcAiDialogueSteps(rawText),
      });
    },
    cancel(requestId) {
      cancelledRequestIds.add(requestId);
    },
  };
}
