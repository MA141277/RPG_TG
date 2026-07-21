import type {
  ScriptEditorDialogueRecord,
  ScriptEditorEventBindingRecord,
  ScriptEditorEventRecord,
  ScriptEditorStoryNodeRecord,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import type { AiModDraft } from "./ai-mod-draft-schema";

export function mapAiDraftTextEntries(draft: AiModDraft): ScriptEditorTextEntryRecord[] {
  return draft.dialogues
    .map(readRecord)
    .filter(isPresent)
    .flatMap((dialogue, dialogueIndex) => {
      const dialogueId = readString(dialogue.id, `dialogue.generated.${dialogueIndex + 1}`);
      return readArray(dialogue.nodes)
        .map(readRecord)
        .filter(isPresent)
        .map((node, nodeIndex) => ({
          id: createTextEntryId(dialogueId, readString(node.id, `node.${nodeIndex + 1}`)),
          text: readString(node.text, ""),
        }));
    });
}

export function mapAiDraftDialogues(draft: AiModDraft): ScriptEditorDialogueRecord[] {
  return draft.dialogues
    .map(readRecord)
    .filter(isPresent)
    .map((dialogue, dialogueIndex) => {
      const dialogueId = readString(dialogue.id, `dialogue.generated.${dialogueIndex + 1}`);
      const nodes = readArray(dialogue.nodes).map(readRecord).filter(isPresent);
      return {
        id: dialogueId,
        title: readString(dialogue.title, `Dialogue ${dialogueIndex + 1}`),
        storyNodeId: draft.generationScope.currentStageId ?? "",
        participantPersonIds: [
          ...new Set(nodes.map((node) => readString(node.speaker, "")).filter(Boolean)),
        ],
        nodes: nodes.map((node, index) => {
          const nodeId = readString(node.id, `node.${index + 1}`);
          const nextNodeId =
            index < nodes.length - 1
              ? `${dialogueId}.${readString(nodes[index + 1]?.id, `node.${index + 2}`)}`
              : "";
          return {
            id: `${dialogueId}.${nodeId}`,
            nodeType: "dialogue",
            speakerPersonId: readString(node.speaker, ""),
            textId: createTextEntryId(dialogueId, nodeId),
            nextNodeId,
            choiceTargetNodeId: "",
          };
        }),
        followUps: [],
      };
    });
}

export function mapAiDraftStoryNodes(draft: AiModDraft): ScriptEditorStoryNodeRecord[] {
  return draft.stages
    .map(readRecord)
    .filter(isPresent)
    .map((stage, index) => {
      const stageId = readString(stage.id, `stage.generated.${index + 1}`);
      return {
        id: stageId,
        title: readString(stage.title, `Stage ${index + 1}`),
        chapterId: stageId,
        summary: readString(stage.goal, ""),
        progressMode: "block",
        relatedPersonIds: [],
        relatedDialogueIds: [],
        relatedEventIds: [],
      };
    });
}

export function mapAiDraftEvents(draft: AiModDraft): ScriptEditorEventRecord[] {
  return draft.events
    .map(readRecord)
    .filter(isPresent)
    .map((event, index) => {
      const eventContent = readRecord(event.content);
      const eventTitle = readString(event.title, `Event ${index + 1}`);
      const chapterId = readString(event.stageId, draft.generationScope.currentStageId ?? "");
      return {
        id: readString(event.id, `event.generated.${index + 1}`),
        title: eventTitle,
        ...(chapterId.length === 0 ? {} : { chapterId }),
        occurrence: "once",
        destination:
          eventContent?.type === "dialogue"
            ? {
                family: "dialogue",
                targetId: readString(eventContent.dialogueId, ""),
              }
            : {
                family: "dialogue",
                targetId: readString(readRecord(draft.dialogues[0])?.id, ""),
              },
        relations: {
          ...(chapterId.length === 0 ? {} : { storyNodeId: chapterId }),
          personIds: [],
          cityIds:
            draft.worldScale.city == null
              ? []
              : [readString(readRecord(draft.worldScale.city)?.id, "city.generated")],
          buildingIds: draft.worldScale.buildings
            .map(readRecord)
            .filter(isPresent)
            .map((building, buildingIndex) =>
              readString(building.id, `building.generated.${buildingIndex + 1}`)
            ),
        },
        previewSummary: {
          previewNotes: eventTitle,
          validationNotes:
            readArray(event.effects).length > 0
              ? "AI draft effects are preserved as editor-only residue unless supported by runtime export."
              : "",
        },
      };
    });
}

export function mapAiDraftEventBindings(
  draft: AiModDraft
): ScriptEditorEventBindingRecord[] {
  return draft.bindings
    .map(readRecord)
    .filter(isPresent)
    .map((binding, index) => {
      const owner = readRecord(binding.owner);
      const ownerId = readString(owner?.id, "");
      const trigger = readRecord(binding.trigger);
      const normalizedTrigger = normalizeRuntimePreviewTrigger(trigger);
      return {
        id: readString(binding.id, `binding.generated.${index + 1}`),
        eventId: readString(binding.eventId, ""),
        owner:
          ownerId.length === 0
            ? { family: normalizeRuntimePreviewOwnerFamily(owner?.family) }
            : { family: normalizeRuntimePreviewOwnerFamily(owner?.family), id: ownerId },
        trigger: normalizedTrigger,
        conditions: readRecord(binding.conditions) ?? { operator: "all", conditions: [] },
        priority: typeof binding.priority === "number" ? binding.priority : 0,
        enabled: typeof binding.enabled === "boolean" ? binding.enabled : true,
        meta: {
          source: "ai-mod-draft",
        },
      };
    });
}

function normalizeRuntimePreviewOwnerFamily(value: unknown): string {
  const family = readString(value, "building");
  return family === "house" ? "building" : family;
}

function normalizeRuntimePreviewTrigger(
  trigger: Record<string, unknown> | null
): ScriptEditorEventBindingRecord["trigger"] {
  const timing = readString(trigger?.timing, "building-enter");
  const action = readString(trigger?.action, "enter");
  if (timing === "after") {
    return {
      ...(trigger ?? {}),
      timing,
      action: readRuntimePreviewTriggerAction(action, "building-enter"),
    };
  }

  if (
    timing === "building-enter" ||
    timing === "city-enter" ||
    timing === "indoor-screen-shown" ||
    timing === "story-progress"
  ) {
    return {
      ...(trigger ?? {}),
      timing: "after",
      action: timing,
    };
  }

  return {
    ...(trigger ?? {}),
    timing: "after",
    action: readRuntimePreviewTriggerAction(action, "building-enter"),
  };
}

function readRuntimePreviewTriggerAction(value: string, fallback: string): string {
  if (
    value === "building-enter" ||
    value === "city-enter" ||
    value === "indoor-screen-shown" ||
    value === "story-progress"
  ) {
    return value;
  }

  return fallback;
}

function createTextEntryId(dialogueId: string, nodeId: string): string {
  return `text.${dialogueId}.${nodeId}`;
}

function readString(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length === 0 ? fallback : trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value != null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function isPresent<T>(value: T | null): value is T {
  return value != null;
}
