import type {
  TxtNarrativeProvider,
  TxtNarrativeProviderRequest,
} from "../../domain/txt-narrative";
import { parseTxtNarrativeMarkerScript } from "./txt-narrative-marker-parser";

const TEMPLE_OPENING_SCRIPT = [
  "[NARRATION: 兵荒马乱，皇觉寺山门前尽是流民与饥色。]",
  '[DIALOGUE: char.kulan_temple_abbot,皇觉寺住持,"寺里已经养不起这么多人了。你们都得外出化缘，各自寻一条活路。"]',
  "[SET_FLAG: story.zhu.opening.in_temple]",
  "[CHOICE: 你如何回应？]",
  "[OPTION: option.accept_alms|应下化缘|应下化缘|mainline|true]",
  "[OPTION: option.ask_where|询问该往何处去|询问该往何处去|recommended|true]",
  "[OPTION: option.talk_senior_monk|和寺中师兄交谈|和寺中师兄交谈|side|false]",
  "[OPTION: option.exit_proactive|退出主动推演|退出主动推演|system|false]",
  "[END_CHOICE]",
].join("\n");

function buildPlaceholderScript(request: TxtNarrativeProviderRequest): string {
  if (request.metadata.phaseId === "temple_alms_departure") {
    if (request.metadata.inputType === "enter_place") {
      return TEMPLE_OPENING_SCRIPT;
    }

    if (request.metadata.inputType === "reactivate_narrative") {
      return [
        "[NARRATION: 你重新收束心神，将寺里的饥荒、香火与流民都串成了一条更清晰的线索。]",
        "[CHOICE: 你准备先从哪一步重新推演？]",
        "[OPTION: option.ask_where|再问住持该往何处去|再问住持该往何处去|recommended|true]",
        "[OPTION: option.talk_senior_monk|先和寺中师兄交谈|先和寺中师兄交谈|side|false]",
        "[OPTION: option.exit_proactive|再次暂停主动推演|再次暂停主动推演|system|false]",
        "[END_CHOICE]",
      ].join("\n");
    }

    if (request.metadata.selectedOptionId === "option.ask_where") {
      return [
        '[DIALOGUE: char.kulan_temple_abbot,皇觉寺住持,"往凤阳、定远一带去吧。哪里有施主，哪里就还有一口活路。"]',
        "[CHOICE: 住持交代之后，你还想做什么？]",
        "[OPTION: option.accept_alms|应下差事便启程|应下差事便启程|mainline|true]",
        "[OPTION: option.talk_senior_monk|再和寺中师兄交谈|再和寺中师兄交谈|side|false]",
        "[OPTION: option.exit_proactive|先停下主动推演|先停下主动推演|system|false]",
        "[END_CHOICE]",
      ].join("\n");
    }

    if (request.metadata.selectedOptionId === "option.talk_senior_monk") {
      return [
        '[DIALOGUE: char.kulan_temple_senior_monk,寺中师兄,"这几年外头乱得很，路上见人说话都得先看眼色。你若真要出去，先把脚下路认明白。"]',
        "[CHOICE: 听完师兄叮嘱后，你准备？]",
        "[OPTION: option.accept_alms|记下叮嘱，准备启程|记下叮嘱，准备启程|mainline|true]",
        "[OPTION: option.ask_where|回去再问住持方向|回去再问住持方向|recommended|true]",
        "[OPTION: option.exit_proactive|暂停主动推演|暂停主动推演|system|false]",
        "[END_CHOICE]",
      ].join("\n");
    }

    if (request.metadata.selectedOptionId === "option.accept_alms") {
      return [
        "[SCENE_CHANGE: scene.temple_gate|皇觉寺山门外]",
        "[NARRATION: 你把残破僧衣拢紧，迈出山门。门外搭着临时粥棚，哭声与木勺碰碗声混在一起。]",
        "[CHOICE: 你准备先做什么？]",
        "[OPTION: option.observe_refugees|先看清流民与粥棚的情形|先看清流民与粥棚的情形|recommended|true]",
        "[OPTION: option.ask_monk_route|回头再向寺中师兄确认路线|回头再向寺中师兄确认路线|side|false]",
        "[OPTION: option.exit_proactive|暂停主动推演|暂停主动推演|system|false]",
        "[END_CHOICE]",
      ].join("\n");
    }
  }

  if (request.metadata.freeInputText != null) {
    return [
      `[NARRATION: 你低声回应：“${request.metadata.freeInputText}”]`,
      "[NARRATION: 四周的人都在等你的下一步。]",
      "[CHOICE: 接下来如何推进？]",
      "[OPTION: option.ask_where|请住持说明去向|请住持说明去向|recommended|true]",
      "[OPTION: option.talk_senior_monk|先找师兄商量|先找师兄商量|side|false]",
      "[OPTION: option.exit_proactive|暂停主动推演|暂停主动推演|system|false]",
      "[END_CHOICE]",
    ].join("\n");
  }

  return [
    "[NARRATION: 局势暂时停在这一刻，所有人的目光都落在你身上。]",
    "[CHOICE: 你打算如何继续？]",
    "[OPTION: option.ask_where|询问去向|询问去向|recommended|true]",
    "[OPTION: option.exit_proactive|暂停主动推演|暂停主动推演|system|false]",
    "[END_CHOICE]",
  ].join("\n");
}

export function createLocalPlaceholderTxtNarrativeProvider(): TxtNarrativeProvider {
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
        allSteps: parseTxtNarrativeMarkerScript(rawText),
      });
    },
    cancel(requestId) {
      cancelledRequestIds.add(requestId);
    },
  };
}
