import type {
  CharacterDefinition,
  CharacterStats,
  SkillKey,
} from "../../domain/character";
import type {
  ScriptEditorPersonRecord,
  ScriptEditorTypedAttributeRecord,
  ScriptEditorTypedAttributeType,
} from "../../domain/script-editor-project";
import { createDefaultScriptEditorCanonicalId } from "./script-editor-id-allocation";

export const SCRIPT_EDITOR_PERSON_TAB_KEYS = [
  "profile",
  "dialogues",
  "trade",
  "events",
] as const;

export type ScriptEditorPersonTabKey =
  (typeof SCRIPT_EDITOR_PERSON_TAB_KEYS)[number];

const SCRIPT_EDITOR_PERSON_ATTRIBUTE_EXCLUDED_ROOT_KEYS = new Set([
  "id",
  "name",
  "personType",
  "role",
  "biography",
  "cityId",
  "houseId",
  "portraitId",
  "portraitVariantId",
  "portraitVariants",
  "extendedAttributes",
  "dialogueIds",
  "eventIds",
  "tradeBinding",
]);

const SCRIPT_EDITOR_PERSON_FIXED_ATTRIBUTE_KEYS = new Set([
  "cityId",
  "houseId",
  "portraitId",
  "portraitVariantId",
]);

const SCRIPT_EDITOR_PERSON_ATTRIBUTE_LABELS: Record<string, string> = {
  title: "正式身份",
  occupation: "职业/定位",
  age: "年龄",
  birthYear: "出生年",
  deathYear: "去世年",
  clanId: "所属",
  stamina: "体力",
  "stats.leadership": "统率",
  "stats.martial": "武勇",
  "stats.intelligence": "智略",
  "stats.politics": "政务",
  "stats.charm": "魅力",
  "stats.fame": "名声",
};

const DEFAULT_CHARACTER_STATS: CharacterStats = {
  leadership: 0,
  martial: 0,
  intelligence: 0,
  politics: 0,
  charm: 0,
  fame: 0,
  gold: 0,
};

const DEFAULT_CHARACTER_SKILLS: Record<SkillKey, number> = {
  ashigaru: 0,
  horse: 0,
  teppo: 0,
  navy: 0,
  archery: 0,
  martial: 0,
  military: 0,
  ninjutsu: 0,
  construction: 0,
  development: 0,
  mining: 0,
  arithmetic: 0,
  etiquette: 0,
  rhetoric: 0,
  tea: 0,
  medicine: 0,
};

export type ScriptEditorPersonRuntimeDefaults = {
  cityId?: string;
  portraitId?: string;
};

export function normalizeScriptEditorPersonRecord(
  value: Record<string, unknown>
): ScriptEditorPersonRecord {
  const { portraitVariants: _portraitVariants, ...valueWithoutPortraitVariants } =
    value as Record<string, unknown>;
  const personType = value.personType === "角色" ? "角色" : "NPC";
  const role =
    typeof value.role === "string" && value.role.length > 0
      ? value.role
      : personType === "角色"
        ? "playable"
        : "support";

  return materializeScriptEditorPersonExtendedAttributes({
    ...valueWithoutPortraitVariants,
    id: readString(value.id, "person.unknown"),
    name: readString(value.name, "未命名人物"),
    personType,
    role,
    title: readString(value.title, ""),
    occupation: readString(value.occupation, ""),
    biography: readString(value.biography, ""),
    cityId: readString(value.cityId, ""),
    houseId: readString(value.houseId, ""),
    portraitId: readString(value.portraitId, ""),
    portraitVariantId: readString(value.portraitVariantId, ""),
    extendedAttributes: mergeScriptEditorPersonExtendedAttributes(
      normalizeKeyValueEntries(value.extendedAttributes),
      collectScriptEditorPersonImportedAttributes(valueWithoutPortraitVariants)
    ),
    dialogueIds: normalizeStringArray(value.dialogueIds),
    eventIds: normalizeStringArray(value.eventIds),
    tradeBinding: normalizeTradeBinding(value.tradeBinding),
  });
}

export function createDefaultScriptEditorPersonRecord(
  indexOrId: number | string
): ScriptEditorPersonRecord {
  const suffix =
    typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("people", indexOrId),
    name: `人物 ${suffix}`,
    personType: suffix === 1 ? "角色" : "NPC",
    role: suffix === 1 ? "playable" : "support",
    title: "",
    occupation: "",
    biography: "",
    cityId: "",
    houseId: "",
    portraitId: "",
    portraitVariantId: "",
    extendedAttributes: [],
    dialogueIds: [],
    eventIds: [],
    tradeBinding: {
      enabled: false,
      entryId: "",
    },
  };
}

export function materializeScriptEditorPersonRuntimeCharacter(
  person: ScriptEditorPersonRecord,
  defaults: ScriptEditorPersonRuntimeDefaults = {}
): CharacterDefinition {
  const normalizedPerson = normalizeScriptEditorPersonRecord(
    person as Record<string, unknown>
  ) as ScriptEditorPersonRecord & Partial<CharacterDefinition>;
  const stats = normalizeCharacterStats(normalizedPerson.stats);
  const skills = normalizeCharacterSkills(normalizedPerson.skills);

  return {
    ...normalizedPerson,
    id: normalizedPerson.id,
    name: normalizedPerson.name,
    birthYear: readFiniteNumber(normalizedPerson.birthYear, 0),
    deathYear:
      normalizedPerson.deathYear == null
        ? null
        : readFiniteNumber(normalizedPerson.deathYear, 0),
    age: readFiniteNumber(normalizedPerson.age, 0),
    cityId:
      typeof normalizedPerson.cityId === "string" &&
      normalizedPerson.cityId.length > 0
        ? normalizedPerson.cityId
        : (defaults.cityId ?? ""),
    portraitId:
      typeof normalizedPerson.portraitId === "string" &&
      normalizedPerson.portraitId.length > 0
        ? normalizedPerson.portraitId
        : (defaults.portraitId ?? ""),
    stats,
    stamina: readFiniteNumber(normalizedPerson.stamina, 100),
    availableFunctions: Array.isArray(normalizedPerson.availableFunctions)
      ? normalizedPerson.availableFunctions
      : [],
    skills,
    ...(normalizedPerson.personType == null
      ? {}
      : { personType: normalizedPerson.personType }),
    ...(normalizedPerson.role == null ? {} : { role: normalizedPerson.role }),
    ...(normalizedPerson.houseId == null
      ? {}
      : { houseId: normalizedPerson.houseId }),
    portraitVariantId: normalizedPerson.portraitVariantId ?? null,
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
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        id: normalizedValue,
      });
    case "name":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        name: value,
      });
    case "personType":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        personType: normalizedValue === "角色" ? "角色" : "NPC",
        role: normalizedValue === "角色" ? "playable" : "support",
      });
    case "title":
      return updateScriptEditorPersonMappedAttribute(person, "title", value);
    case "role":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        role: value,
      });
    case "birthYear":
      return updateScriptEditorPersonMappedAttribute(person, "birthYear", normalizedValue);
    case "deathYear":
      return updateScriptEditorPersonMappedAttribute(person, "deathYear", normalizedValue);
    case "age":
      return updateScriptEditorPersonMappedAttribute(person, "age", normalizedValue);
    case "clanId":
      return updateScriptEditorPersonMappedAttribute(person, "clanId", value);
    case "occupation":
      return updateScriptEditorPersonMappedAttribute(person, "occupation", value);
    case "affiliationLabel":
      return updateScriptEditorPersonMappedAttribute(
        person,
        "affiliationLabel",
        value
      );
    case "biography":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        biography: value,
      });
    case "cityId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        cityId: normalizedValue,
        houseId: "",
      });
    case "houseId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        houseId: normalizedValue,
      });
    case "portraitId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        portraitId: normalizedValue,
        portraitVariantId: "",
      });
    case "portraitVariantId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        portraitVariantId: normalizedValue,
      });
    case "isHistoricalFigure":
      return updateScriptEditorPersonMappedAttribute(
        person,
        "isHistoricalFigure",
        normalizedValue
      );
    case "stamina":
      return updateScriptEditorPersonMappedAttribute(person, "stamina", normalizedValue);
    case "stats.leadership":
    case "stats.martial":
    case "stats.intelligence":
    case "stats.politics":
    case "stats.charm":
    case "stats.fame":
    case "stats.gold":
    case "skills.ashigaru":
    case "skills.horse":
    case "skills.teppo":
    case "skills.navy":
    case "skills.archery":
    case "skills.martial":
    case "skills.military":
    case "skills.ninjutsu":
    case "skills.construction":
    case "skills.development":
    case "skills.mining":
    case "skills.arithmetic":
    case "skills.etiquette":
    case "skills.rhetoric":
    case "skills.tea":
    case "skills.medicine":
      return updateScriptEditorPersonMappedAttribute(person, field, normalizedValue);
    case "tradeBinding.entryId":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        tradeBinding: {
          ...normalizeTradeBinding(person.tradeBinding),
          entryId: normalizedValue,
        },
      });
    default:
      return person;
  }
}

export function toggleScriptEditorPersonTradeEnabled(
  person: ScriptEditorPersonRecord,
  enabled: boolean
): ScriptEditorPersonRecord {
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    tradeBinding: {
      ...normalizeTradeBinding(person.tradeBinding),
      enabled,
    },
  });
}

export function appendScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  type: ScriptEditorTypedAttributeType = "string"
): ScriptEditorPersonRecord {
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    extendedAttributes: [
      ...normalizeKeyValueEntries(person.extendedAttributes),
      { key: "", label: "", type: normalizeTypedAttributeType(type), value: "" },
    ],
  });
}

export function removeScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  index: number
): ScriptEditorPersonRecord {
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    extendedAttributes: normalizeKeyValueEntries(person.extendedAttributes).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  });
}

export function updateScriptEditorPersonAttribute(
  person: ScriptEditorPersonRecord,
  index: number,
  field: keyof ScriptEditorTypedAttributeRecord | "key",
  value: string
): ScriptEditorPersonRecord {
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    extendedAttributes: normalizeKeyValueEntries(person.extendedAttributes).map(
      (entry, entryIndex) =>
        entryIndex === index
          ? normalizeScriptEditorPersonAttributeEntry({
              ...entry,
              [field]: field === "type" ? normalizeTypedAttributeType(value) : value,
            })
          : entry
    ),
  });
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

function updateScriptEditorPersonMappedAttribute(
  person: ScriptEditorPersonRecord,
  keyPath: string,
  value: string
): ScriptEditorPersonRecord {
  const normalizedKey = keyPath.trim();
  if (normalizedKey.length === 0) {
    return person;
  }

  const entries = normalizeKeyValueEntries(person.extendedAttributes);
  const existingIndex = entries.findIndex(
    (entry) => entry.key.trim() === normalizedKey
  );
  const nextEntry = {
    key: normalizedKey,
    label: getScriptEditorPersonAttributeLabel(normalizedKey),
    type: inferScriptEditorPersonAttributeType(normalizedKey, value),
    value,
  };
  const nextEntries =
    existingIndex >= 0
      ? entries.map((entry, index) =>
          index === existingIndex
            ? {
                ...entry,
                key: normalizedKey,
                value,
              }
            : entry
        )
      : [...entries, nextEntry];

  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    extendedAttributes: nextEntries,
  });
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

function collectScriptEditorPersonImportedAttributes(
  value: Record<string, unknown>
): ScriptEditorTypedAttributeRecord[] {
  const entries: ScriptEditorTypedAttributeRecord[] = [];

  for (const [key, nestedValue] of Object.entries(value)) {
    if (SCRIPT_EDITOR_PERSON_ATTRIBUTE_EXCLUDED_ROOT_KEYS.has(key)) {
      continue;
    }

    appendScriptEditorPersonImportedAttribute(entries, key, nestedValue);
  }

  return entries;
}

function appendScriptEditorPersonImportedAttribute(
  entries: ScriptEditorTypedAttributeRecord[],
  keyPath: string,
  value: unknown
): void {
  if (value == null || Array.isArray(value)) {
    return;
  }

  if (typeof value === "object") {
    for (const [nestedKey, nestedValue] of Object.entries(
      value as Record<string, unknown>
    )) {
      appendScriptEditorPersonImportedAttribute(
        entries,
        `${keyPath}.${nestedKey}`,
        nestedValue
      );
    }
    return;
  }

  const type = inferScriptEditorPersonAttributeType(keyPath, value);
  entries.push({
    key: keyPath,
    label: getScriptEditorPersonAttributeLabel(keyPath),
    type,
    value: normalizeTypedAttributeValue(type, value),
  });
}

function mergeScriptEditorPersonExtendedAttributes(
  existing: ScriptEditorTypedAttributeRecord[],
  imported: ScriptEditorTypedAttributeRecord[]
): ScriptEditorTypedAttributeRecord[] {
  const merged = normalizeKeyValueEntries(existing);
  const existingEntryIndexByKey = new Map<string, number>();

  merged.forEach((entry, index) => {
    const normalizedKey = entry.key.trim();
    if (normalizedKey.length === 0) {
      return;
    }

    existingEntryIndexByKey.set(normalizedKey, index);
  });

  for (const entry of imported) {
    const normalizedKey = entry.key.trim();
    if (normalizedKey.length === 0) {
      continue;
    }

    const existingIndex = existingEntryIndexByKey.get(normalizedKey);
    if (existingIndex != null) {
      const existingEntry = merged[existingIndex];
      if (
        existingEntry != null &&
        (existingEntry.label ?? "").trim().length === 0 &&
        (entry.label ?? "").trim().length > 0
      ) {
        merged[existingIndex] = {
          ...existingEntry,
          label: entry.label,
        };
      }
      continue;
    }

    merged.push({
      key: normalizedKey,
      label: entry.label,
      type: entry.type,
      value: entry.value,
    });
    existingEntryIndexByKey.set(normalizedKey, merged.length - 1);
  }

  return merged;
}

function materializeScriptEditorPersonExtendedAttributes(
  person: ScriptEditorPersonRecord
): ScriptEditorPersonRecord {
  const extendedAttributes = normalizeKeyValueEntries(person.extendedAttributes);
  const nextPerson = {
    ...person,
    extendedAttributes,
  } as ScriptEditorPersonRecord;
  const existingLeafEntries = collectScriptEditorPersonImportedAttributes(
    nextPerson as Record<string, unknown>
  );
  const previousValues = new Map(
    existingLeafEntries.map((entry) => [
      entry.key,
      readScriptEditorPersonValueAtPath(
        nextPerson as Record<string, unknown>,
        entry.key
      ),
    ])
  );

  for (const entry of existingLeafEntries) {
    deleteScriptEditorPersonValueAtPath(
      nextPerson as Record<string, unknown>,
      entry.key
    );
  }

  for (const entry of extendedAttributes) {
    const normalizedKey = entry.key.trim();
    if (normalizedKey.length === 0) {
      continue;
    }

    const parsedValue = parseScriptEditorPersonAttributeValue(
      normalizedKey,
      entry.value,
      previousValues.get(normalizedKey)
    );
    if (parsedValue === undefined) {
      continue;
    }

    writeScriptEditorPersonValueAtPath(
      nextPerson as Record<string, unknown>,
      normalizedKey,
      parsedValue
    );
  }

  return nextPerson;
}

function parseScriptEditorPersonAttributeValue(
  keyPath: string,
  value: string | number | boolean | undefined,
  previousValue: unknown
): string | number | boolean | null | undefined {
  const normalizedValue = String(value ?? "").trim();

  if (
    typeof previousValue === "number" ||
    isScriptEditorPersonNumericAttribute(keyPath)
  ) {
    if (normalizedValue.length === 0) {
      return undefined;
    }

    const numericValue = Number(normalizedValue);
    return Number.isFinite(numericValue) ? numericValue : value;
  }

  if (typeof previousValue === "boolean" || typeof value === "boolean") {
    if (typeof value === "boolean") {
      return value;
    }
    if (normalizedValue === "true") {
      return true;
    }
    if (normalizedValue === "false") {
      return false;
    }
  }

  if (previousValue === null && normalizedValue.length === 0) {
    return null;
  }

  return value;
}

function isScriptEditorPersonNumericAttribute(keyPath: string): boolean {
  return (
    keyPath === "birthYear" ||
    keyPath === "deathYear" ||
    keyPath === "age" ||
    keyPath === "stamina" ||
    keyPath.startsWith("stats.") ||
    keyPath.startsWith("skills.")
  );
}

function normalizeCharacterStats(value: unknown): CharacterStats {
  const source =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Partial<Record<keyof CharacterStats, unknown>>)
      : {};

  return Object.fromEntries(
    Object.entries(DEFAULT_CHARACTER_STATS).map(([key, fallback]) => [
      key,
      readFiniteNumber(source[key as keyof CharacterStats], fallback),
    ])
  ) as CharacterStats;
}

function normalizeCharacterSkills(value: unknown): Record<SkillKey, number> {
  const source =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Partial<Record<SkillKey, unknown>>)
      : {};

  return Object.fromEntries(
    Object.entries(DEFAULT_CHARACTER_SKILLS).map(([key, fallback]) => [
      key,
      readFiniteNumber(source[key as SkillKey], fallback),
    ])
  ) as Record<SkillKey, number>;
}

function readFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readScriptEditorPersonValueAtPath(
  value: Record<string, unknown>,
  keyPath: string
): unknown {
  return keyPath.split(".").reduce<unknown>((currentValue, segment) => {
    if (
      currentValue == null ||
      typeof currentValue !== "object" ||
      Array.isArray(currentValue)
    ) {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[segment];
  }, value);
}

function writeScriptEditorPersonValueAtPath(
  target: Record<string, unknown>,
  keyPath: string,
  value: unknown
): void {
  const segments = keyPath.split(".");
  let currentTarget: Record<string, unknown> = target;

  for (const segment of segments.slice(0, -1)) {
    const nextTarget =
      currentTarget[segment] != null &&
      typeof currentTarget[segment] === "object" &&
      !Array.isArray(currentTarget[segment])
        ? (currentTarget[segment] as Record<string, unknown>)
        : {};
    currentTarget[segment] = nextTarget;
    currentTarget = nextTarget;
  }

  currentTarget[segments.at(-1) ?? keyPath] = value;
}

function deleteScriptEditorPersonValueAtPath(
  target: Record<string, unknown>,
  keyPath: string
): void {
  const segments = keyPath.split(".");
  const parents: Record<string, unknown>[] = [target];
  let currentTarget: Record<string, unknown> | null = target;

  for (const segment of segments.slice(0, -1)) {
    const nextTarget: Record<string, unknown> | null =
      currentTarget != null &&
      currentTarget[segment] != null &&
      typeof currentTarget[segment] === "object" &&
      !Array.isArray(currentTarget[segment])
        ? (currentTarget[segment] as Record<string, unknown>)
        : null;
    if (nextTarget == null) {
      return;
    }

    parents.push(nextTarget);
    currentTarget = nextTarget;
  }

  if (currentTarget == null) {
    return;
  }

  delete currentTarget[segments.at(-1) ?? keyPath];

  for (let index = segments.length - 2; index >= 0; index -= 1) {
    const parent = parents[index];
    const segment = segments[index];
    if (parent == null || segment == null) {
      continue;
    }
    const nestedValue = parent[segment];
    if (
      nestedValue != null &&
      typeof nestedValue === "object" &&
      !Array.isArray(nestedValue) &&
      Object.keys(nestedValue as Record<string, unknown>).length === 0
    ) {
      delete parent[segment];
    }
  }
}

function normalizeKeyValueEntries(value: unknown): ScriptEditorTypedAttributeRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry) => entry != null && typeof entry === "object" && !Array.isArray(entry)
    )
    .map((entry) =>
      normalizeScriptEditorPersonAttributeEntry(entry as Record<string, unknown>)
    )
    .filter(
      (entry) => !SCRIPT_EDITOR_PERSON_FIXED_ATTRIBUTE_KEYS.has(entry.key.trim())
    );
}

function normalizeScriptEditorPersonAttributeEntry(
  entry: Record<string, unknown>
): ScriptEditorTypedAttributeRecord {
  const key = readString(entry.key, "");
  const type = normalizeTypedAttributeType(entry.type);
  const value = normalizeTypedAttributeValue(type, entry.value);
  return {
    key,
    label: readString(entry.label, ""),
    type,
    value,
    ...(type === "enum" && Array.isArray(entry.options)
      ? {
          options: entry.options
            .filter((option) => typeof option === "string")
            .map((option) => option.trim())
            .filter((option) => option.length > 0),
        }
      : {}),
  };
}

function normalizeTypedAttributeType(value: unknown): ScriptEditorTypedAttributeType {
  return value === "number" ||
    value === "boolean" ||
    value === "enum" ||
    value === "string"
    ? value
    : "string";
}

function normalizeTypedAttributeValue(
  type: ScriptEditorTypedAttributeType,
  value: unknown
): string | number | boolean {
  if (type === "number") {
    const numberValue = Number(String(value ?? "").trim());
    return Number.isFinite(numberValue) ? numberValue : 0;
  }
  if (type === "boolean") {
    return value === true || String(value).trim() === "true";
  }
  return readString(value, "");
}

function inferScriptEditorPersonAttributeType(
  keyPath: string,
  value: unknown
): ScriptEditorTypedAttributeType {
  if (typeof value === "number" || isScriptEditorPersonNumericAttribute(keyPath)) {
    return "number";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  return "string";
}

function getScriptEditorPersonAttributeLabel(keyPath: string): string {
  const mappedLabel = SCRIPT_EDITOR_PERSON_ATTRIBUTE_LABELS[keyPath];
  if (typeof mappedLabel === "string" && mappedLabel.length > 0) {
    return mappedLabel;
  }

  const normalizedPath = keyPath.trim();
  if (normalizedPath.length === 0) {
    return "";
  }

  const leafSegment = normalizedPath.split(".").at(-1) ?? normalizedPath;
  const spacedLeaf = leafSegment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  return spacedLeaf.length > 0 ? spacedLeaf : normalizedPath;
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
