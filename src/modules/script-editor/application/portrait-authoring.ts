import type {
  PortraitResourceDefinition,
  PortraitVariantDefinition,
} from "../../../domain/portrait-resource";
import { createDefaultScriptEditorCanonicalId } from "./script-editor-id-allocation";

export type ScriptEditorPortraitResourceRecord = PortraitResourceDefinition;
export type ScriptEditorPortraitVariantRecord = PortraitVariantDefinition;

export function normalizeScriptEditorPortraitRecord(
  value: Record<string, unknown>
): ScriptEditorPortraitResourceRecord {
  return {
    id: readString(value.id, "portrait.new"),
    label: readString(value.label, ""),
    portraitImage: readString(value.portraitImage, ""),
    avatarImage: readString(value.avatarImage, ""),
  };
}

export function createDefaultScriptEditorPortraitRecord(
  indexOrId: number | string
): ScriptEditorPortraitResourceRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("portraits", indexOrId),
    label: `立绘资源 ${suffix}`,
    portraitImage: "",
    avatarImage: "",
  };
}

export function updateScriptEditorPortraitField(
  portrait: ScriptEditorPortraitResourceRecord,
  field: "id" | "label" | "portraitImage" | "avatarImage",
  value: string
): ScriptEditorPortraitResourceRecord {
  return {
    ...portrait,
    [field]: field === "id" ? value.trim() : value,
  };
}

export function normalizeScriptEditorPortraitVariantRecord(
  value: Record<string, unknown>
): ScriptEditorPortraitVariantRecord {
  return {
    id: readString(value.id, "portrait-variant.new"),
    label: readString(value.label, ""),
    parentPortraitId: readString(value.parentPortraitId, ""),
    portraitId: readString(value.portraitId, ""),
  };
}

export function createDefaultScriptEditorPortraitVariantRecord(
  indexOrId: number | string
): ScriptEditorPortraitVariantRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("portraitVariants", indexOrId),
    label: `立绘变体 ${suffix}`,
    parentPortraitId: "",
    portraitId: "",
  };
}

export function updateScriptEditorPortraitVariantField(
  variant: ScriptEditorPortraitVariantRecord,
  field: "id" | "label" | "parentPortraitId" | "portraitId",
  value: string
): ScriptEditorPortraitVariantRecord {
  return {
    ...variant,
    [field]: field === "id" ? value.trim() : value.trim(),
  };
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
