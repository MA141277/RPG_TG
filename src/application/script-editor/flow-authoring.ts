import type { ScriptEditorFlowRecord } from "../../domain/script-editor-project";
import { createDefaultScriptEditorCanonicalId } from "./script-editor-id-allocation";

export function createDefaultScriptEditorFlowRecord(
  indexOrId: number | string
): ScriptEditorFlowRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("flows", indexOrId),
    title: `寤虹瓚鍔熻兘 ${suffix}`,
    description: "",
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
    initialNodeId: normalizeRequiredString(record.initialNodeId, "node.start"),
    nodes: Array.isArray(record.nodes) ? record.nodes : fallback.nodes,
    outcomeRoutes: Array.isArray(record.outcomeRoutes)
      ? record.outcomeRoutes
      : fallback.outcomeRoutes,
    notes: normalizeOptionalString(record.notes),
  };
}

function normalizeRequiredString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
