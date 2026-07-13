import type {
  ScriptEditorKeyValueEntry,
  ScriptEditorPersonRecord,
} from "../../domain/script-editor-project";

export const SCRIPT_EDITOR_PERSON_TAB_KEYS = [
  "profile",
  "dialogues",
  "trade",
  "events",
] as const;

export type ScriptEditorPersonTabKey =
  (typeof SCRIPT_EDITOR_PERSON_TAB_KEYS)[number];

export function normalizeScriptEditorPersonRecord(
  value: Record<string, unknown>
): ScriptEditorPersonRecord {
  const personType = value.personType === "角色" ? "角色" : "NPC";
  const role =
    typeof value.role === "string" && value.role.length > 0
      ? value.role
      : personType === "角色"
        ? "playable"
        : "support";

  return {
    id: readString(value.id, "person.unknown"),
    name: readString(value.name, "未命名人物"),
    personType,
    role,
    title: readString(value.title, ""),
    occupation: readString(value.occupation, ""),
    biography: readString(value.biography, ""),
    extendedAttributes: normalizeKeyValueEntries(value.extendedAttributes),
    dialogueIds: normalizeStringArray(value.dialogueIds),
    eventIds: normalizeStringArray(value.eventIds),
    tradeBinding: normalizeTradeBinding(value.tradeBinding),
  };
}

export function createDefaultScriptEditorPersonRecord(index: number): ScriptEditorPersonRecord {
  const suffix = index + 1;
  return {
    id: `person.new.${suffix}`,
    name: `人物 ${suffix}`,
    personType: suffix === 1 ? "角色" : "NPC",
    role: suffix === 1 ? "playable" : "support",
    title: "",
    occupation: "",
    biography: "",
    extendedAttributes: [],
    dialogueIds: [],
    eventIds: [],
    tradeBinding: {
      enabled: false,
      entryId: "",
    },
  };
}

export function updateScriptEditorPersonField(
  person: ScriptEditorPersonRecord,
  field: string,
  value: string
): ScriptEditorPersonRecord {
  const normalizedValue = value.trim();

  switch (field) {
    case "id":
      return { ...person, id: normalizedValue };
    case "name":
      return { ...person, name: value };
    case "personType":
      return {
        ...person,
        personType: normalizedValue === "角色" ? "角色" : "NPC",
        role: normalizedValue === "角色" ? "playable" : "support",
      };
    case "title":
      return { ...person, title: value };
    case "occupation":
      return { ...person, occupation: value };
    case "biography":
      return { ...person, biography: value };
    case "tradeBinding.entryId":
      return {
        ...person,
        tradeBinding: {
          ...normalizeTradeBinding(person.tradeBinding),
          entryId: normalizedValue,
        },
      };
    default:
      return person;
  }
}

export function toggleScriptEditorPersonTradeEnabled(
  person: ScriptEditorPersonRecord,
  enabled: boolean
): ScriptEditorPersonRecord {
  return {
    ...person,
    tradeBinding: {
      ...normalizeTradeBinding(person.tradeBinding),
      enabled,
    },
  };
}

export function appendScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord
): ScriptEditorPersonRecord {
  return {
    ...person,
    extendedAttributes: [...normalizeKeyValueEntries(person.extendedAttributes), { key: "", value: "" }],
  };
}

export function removeScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  index: number
): ScriptEditorPersonRecord {
  return {
    ...person,
    extendedAttributes: normalizeKeyValueEntries(person.extendedAttributes).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  };
}

export function updateScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  index: number,
  field: keyof ScriptEditorKeyValueEntry,
  value: string
): ScriptEditorPersonRecord {
  return {
    ...person,
    extendedAttributes: normalizeKeyValueEntries(person.extendedAttributes).map(
      (entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry
    ),
  };
}

export function appendScriptEditorPersonRelation(
  person: ScriptEditorPersonRecord,
  family: "dialogueIds" | "eventIds"
): ScriptEditorPersonRecord {
  return {
    ...person,
    [family]: [...normalizeStringArray(person[family]), ""],
  };
}

export function removeScriptEditorPersonRelation(
  person: ScriptEditorPersonRecord,
  family: "dialogueIds" | "eventIds",
  index: number
): ScriptEditorPersonRecord {
  return {
    ...person,
    [family]: normalizeStringArray(person[family]).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  };
}

export function updateScriptEditorPersonRelation(
  person: ScriptEditorPersonRecord,
  family: "dialogueIds" | "eventIds",
  index: number,
  value: string
): ScriptEditorPersonRecord {
  return {
    ...person,
    [family]: normalizeStringArray(person[family]).map((entry, entryIndex) =>
      entryIndex === index ? value.trim() : entry
    ),
  };
}

function normalizeTradeBinding(value: unknown) {
  const tradeBinding =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    enabled: tradeBinding.enabled === true,
    entryId: readString(tradeBinding.entryId, ""),
  };
}

function normalizeKeyValueEntries(value: unknown): ScriptEditorKeyValueEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry) => entry != null && typeof entry === "object" && !Array.isArray(entry)
    )
    .map((entry) => ({
      key: readString((entry as Record<string, unknown>).key, ""),
      value: readString((entry as Record<string, unknown>).value, ""),
    }));
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => typeof entry === "string")
    .map((entry) => entry.trim());
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
