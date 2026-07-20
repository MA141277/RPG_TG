import type {
  ScriptEditorFlowRecord,
  ScriptEditorKeyValueEntry,
} from "../../domain/script-editor-project";

export function createDefaultScriptEditorFlowRecord(
  index: number
): ScriptEditorFlowRecord {
  const suffix = index + 1;
  return {
    id: `flow.new.${suffix}`,
    title: `建筑功能 ${suffix}`,
    description: "",
    playableId: `flow.new.${suffix}`,
    integrationId: `playable.flow.new.${suffix}`,
    ownerKind: "building",
    ownerId: "",
    returnPolicy: "resume-owner",
    triggerId: `trigger.flow.new.${suffix}`,
    triggerSource: "container-item",
    triggerEvent: "",
    eventStartTarget: { eventId: "" },
    launchPayload: [],
    initialNodeId: "node.start",
    nodes: [
      {
        id: "node.start",
        type: "text",
        text: "",
        nextNodeId: "node.complete",
      },
      {
        id: "node.complete",
        type: "complete",
        outcome: "success",
        detail: {},
      },
    ],
    outcomeRoutes: [
      {
        id: "outcome-route.success",
        outcome: "success",
        handoffPolicy: "resume-owner",
        summary: "",
        effectHint: "",
      },
    ],
    notes: "",
  };
}

export function normalizeScriptEditorFlowRecord(
  record: Partial<ScriptEditorFlowRecord> & { id: string }
): ScriptEditorFlowRecord {
  const fallback = createDefaultScriptEditorFlowRecord(0);
  return {
    ...fallback,
    ...record,
    id: normalizeRequiredString(record.id, fallback.id),
    title: normalizeRequiredString(record.title, record.id),
    description: normalizeOptionalString(record.description),
    playableId: normalizeRequiredString(record.playableId, record.id),
    integrationId: normalizeRequiredString(record.integrationId, `playable.${record.id}`),
    ownerKind: normalizeOwnerKind(record.ownerKind),
    ownerId: normalizeOptionalString(record.ownerId),
    returnPolicy: normalizeReturnPolicy(record.returnPolicy),
    triggerId: normalizeRequiredString(record.triggerId, `trigger.${record.id}`),
    triggerSource: normalizeTriggerSource(record.triggerSource),
    triggerEvent: normalizeOptionalString(record.triggerEvent),
    ...(record.eventStartTarget == null
      ? {}
      : {
          eventStartTarget: {
            eventId: normalizeOptionalString(record.eventStartTarget.eventId),
            ...(record.eventStartTarget.bindingId == null
              ? {}
              : { bindingId: normalizeOptionalString(record.eventStartTarget.bindingId) }),
          },
        }),
    launchPayload: normalizeKeyValueEntries(record.launchPayload),
    initialNodeId: normalizeRequiredString(record.initialNodeId, "node.start"),
    nodes: Array.isArray(record.nodes) ? record.nodes : fallback.nodes,
    outcomeRoutes: Array.isArray(record.outcomeRoutes)
      ? record.outcomeRoutes
      : fallback.outcomeRoutes,
    notes: normalizeOptionalString(record.notes),
  };
}

function normalizeKeyValueEntries(
  entries: readonly ScriptEditorKeyValueEntry[] | undefined
): ScriptEditorKeyValueEntry[] {
  return (entries ?? []).map((entry) => ({
    key: normalizeOptionalString(entry?.key),
    value: normalizeOptionalString(entry?.value),
  }));
}

function normalizeRequiredString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOwnerKind(
  value: unknown
): ScriptEditorFlowRecord["ownerKind"] {
  return value === "building" || value === "scene" || value === "task" || value === "external"
    ? value
    : "building";
}

function normalizeReturnPolicy(
  value: unknown
): ScriptEditorFlowRecord["returnPolicy"] {
  return value === "resume-owner" || value === "reenter-owner" || value === "close-only"
    ? value
    : "resume-owner";
}

function normalizeTriggerSource(
  value: unknown
): ScriptEditorFlowRecord["triggerSource"] {
  return value === "manual" ||
    value === "event-destination" ||
    value === "container-item" ||
    value === "other"
    ? value
    : "container-item";
}
