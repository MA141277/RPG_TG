import type {
  CharacterDefinition,
  CharacterStats,
  SkillKey,
} from "../../domain/character";
import type {
  ScriptEditorPersonAttributeGroup,
  ScriptEditorPersonAttributeGroupItem,
  ScriptEditorPersonRecord,
  ScriptEditorTypedAttributeRecord,
  ScriptEditorTypedAttributeType,
} from "../../domain/script-editor-project";
import { createDefaultScriptEditorCanonicalId } from "./script-editor-id-allocation";

export const SCRIPT_EDITOR_PERSON_TAB_KEYS = [
  "profile",
  "dialogues",
  "stage",
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
  "title",
  "birthYear",
  "deathYear",
  "age",
  "occupation",
  "clanId",
  "affiliationLabel",
  "biography",
  "stamina",
  "availableFunctions",
  "cityId",
  "houseId",
  "portraitId",
  "portraitVariantId",
  "portraitVariants",
  "extendedAttributes",
  "attributeGroups",
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

const SCRIPT_EDITOR_PERSON_MANAGED_ATTRIBUTE_KEYS = new Set([
  "title",
  "occupation",
  "age",
  "birthYear",
  "deathYear",
  "clanId",
  "affiliationLabel",
  "stamina",
]);

const SCRIPT_EDITOR_PERSON_DEFAULT_ATTRIBUTE_GROUPS = [
  {
    id: "group.basic-info",
    title: "\u57fa\u672c\u60c5\u62a5",
    presentation: "basic-info",
    items: [
      { fieldKey: "clanId", labelOverride: "\u6240\u5c5e\u52bf\u529b" },
      { fieldKey: "cityId", labelOverride: "\u6240\u5c5e\u57ce\u5e02" },
      { fieldKey: "title", labelOverride: "\u8eab\u4efd" },
      { fieldKey: "occupation", labelOverride: "\u804c\u4e1a" },
      { fieldKey: "age", labelOverride: "\u5e74\u9f84" },
    ],
  },
  {
    id: "group.ability-info",
    title: "\u80fd\u529b\u60c5\u62a5",
    presentation: "ability-info",
    items: [
      { fieldKey: "stats.leadership", labelOverride: "\u7edf\u7387" },
      { fieldKey: "stats.martial", labelOverride: "\u6b66\u52c7" },
      { fieldKey: "stats.intelligence", labelOverride: "\u667a\u7565" },
      { fieldKey: "stats.politics", labelOverride: "\u653f\u52a1" },
      { fieldKey: "stats.charm", labelOverride: "\u9b45\u529b" },
      { fieldKey: "stats.fame", labelOverride: "\u540d\u671b" },
    ],
  },
  {
    id: "group.skill-info",
    title: "\u6280\u80fd\u60c5\u62a5",
    presentation: "skill-info",
    items: [
      { fieldKey: "skills.ashigaru", labelOverride: "\u8db3\u8f7b" },
      { fieldKey: "skills.horse", labelOverride: "\u9a91\u672f" },
      { fieldKey: "skills.archery", labelOverride: "\u5f13\u672f" },
      { fieldKey: "skills.military", labelOverride: "\u519b\u7565" },
      { fieldKey: "skills.ninjutsu", labelOverride: "\u5fcd\u672f" },
      { fieldKey: "skills.rhetoric", labelOverride: "\u53e3\u624d" },
    ],
  },
] as const satisfies readonly {
  id: string;
  title: string;
  presentation: ScriptEditorPersonAttributeGroup["presentation"];
  items: readonly ScriptEditorPersonAttributeGroupItem[];
}[];

const SCRIPT_EDITOR_PERSON_JSON_ATTRIBUTE_KEYS = new Set([
  "flags",
  "teachableSkillKeys",
]);

const SCRIPT_EDITOR_PERSON_BOOLEAN_ATTRIBUTE_KEYS = new Set([
  "isHistoricalFigure",
  "leaderResidenceEligible",
]);

const SCRIPT_EDITOR_PERSON_ATTRIBUTE_LABELS: Record<string, string> = {
  title: "\u6b63\u5f0f\u8eab\u4efd",
  occupation: "\u804c\u4e1a/\u5b9a\u4f4d",
  age: "\u5e74\u9f84",
  birthYear: "\u51fa\u751f\u5e74\u4efd",
  deathYear: "\u53bb\u4e16\u5e74\u4efd",
  clanId: "\u6240\u5c5e\u52bf\u529b",
  stamina: "\u4f53\u529b",
  isHistoricalFigure: "\u5386\u53f2\u4eba\u7269",
  flags: "\u4eba\u7269\u6807\u7b7e",
  leaderResidenceEligible: "\u53ef\u5165\u4e3b\u5b85\u90b8",
  leaderResidenceStatus: "\u5b85\u90b8\u72b6\u6001",
  teachableSkillKeys: "\u53ef\u4f20\u6388\u6280\u80fd",
  "stats.leadership": "\u7edf\u7387",
  "stats.martial": "\u6b66\u52c7",
  "stats.intelligence": "\u667a\u7565",
  "stats.politics": "\u653f\u52a1",
  "stats.charm": "\u9b45\u529b",
  "stats.fame": "\u540d\u671b",
  "stats.gold": "\u91d1\u94b1",
  "skills.ashigaru": "\u8db3\u8f7b",
  "skills.horse": "\u9a91\u672f",
  "skills.teppo": "\u94c1\u70ae",
  "skills.navy": "\u6c34\u6218",
  "skills.archery": "\u5f13\u672f",
  "skills.martial": "\u5175\u6cd5",
  "skills.military": "\u519b\u7565",
  "skills.ninjutsu": "\u5fcd\u672f",
  "skills.construction": "\u5efa\u7b51",
  "skills.development": "\u5f00\u53d1",
  "skills.mining": "\u77ff\u5c71",
  "skills.arithmetic": "\u7b97\u672f",
  "skills.etiquette": "\u793c\u6cd5",
  "skills.rhetoric": "\u53e3\u624d",
  "skills.tea": "\u8336\u9053",
  "skills.medicine": "\u533b\u672f",
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
export type ScriptEditorPersonNormalizeOptions = {
  portraitVariants?: readonly Record<string, unknown>[];
};

export function normalizeScriptEditorPersonRecord(
  value: Record<string, unknown>,
  options: ScriptEditorPersonNormalizeOptions = {}
): ScriptEditorPersonRecord {
  const { portraitVariants: _portraitVariants, ...valueWithoutPortraitVariants } =
    value as Record<string, unknown>;
  const { portraitId, portraitVariantId } =
    resolveScriptEditorPersonPortraitSelection(value, options);
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
    birthYear: readFiniteNumber(value.birthYear, 0),
    deathYear:
      value.deathYear == null ? null : readFiniteNumber(value.deathYear, 0),
    age: readFiniteNumber(value.age, 0),
    clanId: readString(value.clanId, ""),
    affiliationLabel: readString(value.affiliationLabel, ""),
    biography: readString(value.biography, ""),
    cityId: readString(value.cityId, ""),
    houseId: readString(value.houseId, ""),
    portraitId,
    portraitVariantId,
    stats: normalizeCharacterStats(value.stats),
    stamina: readFiniteNumber(value.stamina, 100),
    skills: normalizeCharacterSkills(value.skills),
    attributeGroups: normalizeScriptEditorPersonAttributeGroups(
      value.attributeGroups
    ),
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
    attributeGroups: createDefaultScriptEditorPersonAttributeGroups(),
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
  defaults: ScriptEditorPersonRuntimeDefaults = {},
  options: ScriptEditorPersonNormalizeOptions = {}
): CharacterDefinition {
  const normalizedPerson = normalizeScriptEditorPersonRecord(
    person as Record<string, unknown>,
    options
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
    portraitVariantId:
      typeof normalizedPerson.portraitVariantId === "string" &&
      normalizedPerson.portraitVariantId.trim().length > 0
        ? normalizedPerson.portraitVariantId
        : null,
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
      return updateScriptEditorPersonDirectField(person, "title", value);
    case "role":
      return materializeScriptEditorPersonExtendedAttributes({
        ...person,
        role: value,
      });
    case "birthYear":
      return updateScriptEditorPersonDirectField(person, "birthYear", normalizedValue);
    case "deathYear":
      return updateScriptEditorPersonDirectField(person, "deathYear", normalizedValue);
    case "age":
      return updateScriptEditorPersonDirectField(person, "age", normalizedValue);
    case "clanId":
      return updateScriptEditorPersonDirectField(person, "clanId", value);
    case "occupation":
      return updateScriptEditorPersonDirectField(person, "occupation", value);
    case "affiliationLabel":
      return updateScriptEditorPersonDirectField(
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
      return updateScriptEditorPersonDirectField(
        person,
        "isHistoricalFigure",
        normalizedValue
      );
    case "stamina":
      return updateScriptEditorPersonDirectField(person, "stamina", normalizedValue);
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
      return updateScriptEditorPersonDirectField(person, field, normalizedValue);
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
  const existingEntries = normalizeKeyValueEntries(person.extendedAttributes);
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    extendedAttributes: [
      ...existingEntries,
      {
        key: createScriptEditorPersonCustomAttributeKey(existingEntries),
        label: "",
        type: normalizeTypedAttributeType(type),
        value: "",
      },
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
  const existingEntries = normalizeKeyValueEntries(person.extendedAttributes);
  return materializeScriptEditorPersonExtendedAttributes({
    ...person,
    extendedAttributes: existingEntries.map(
      (entry, entryIndex) =>
        entryIndex === index
          ? normalizeScriptEditorPersonAttributeEntry({
              ...entry,
              key:
                field === "key"
                  ? value
                  : entry.key.trim().length > 0
                    ? entry.key
                    : createScriptEditorPersonCustomAttributeKey(existingEntries, index),
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

function updateScriptEditorPersonDirectField(
  person: ScriptEditorPersonRecord,
  keyPath: string,
  value: string
): ScriptEditorPersonRecord {
  const normalizedKey = keyPath.trim();
  if (normalizedKey.length === 0) {
    return person;
  }
  const nextPerson = materializeScriptEditorPersonExtendedAttributes({
    ...person,
    extendedAttributes: normalizeKeyValueEntries(person.extendedAttributes),
  }) as ScriptEditorPersonRecord & Record<string, unknown>;
  const previousValue = readScriptEditorPersonValueAtPath(
    nextPerson,
    normalizedKey
  );

  deleteScriptEditorPersonValueAtPath(nextPerson, normalizedKey);
  const parsedValue = parseScriptEditorPersonAttributeValue(
    normalizedKey,
    value,
    previousValue
  );
  if (parsedValue !== undefined) {
    writeScriptEditorPersonValueAtPath(nextPerson, normalizedKey, parsedValue);
    nextPerson.extendedAttributes = syncScriptEditorPersonExtendedAttributeValue(
      normalizeKeyValueEntries(nextPerson.extendedAttributes),
      normalizedKey,
      parsedValue
    );
  }

  return materializeScriptEditorPersonExtendedAttributes(nextPerson);
}

function syncScriptEditorPersonExtendedAttributeValue(
  entries: ScriptEditorTypedAttributeRecord[],
  keyPath: string,
  value: unknown
): ScriptEditorTypedAttributeRecord[] {
  const normalizedKey = keyPath.trim();
  if (normalizedKey.length === 0) {
    return entries;
  }
  if (isScriptEditorPersonManagedAttributeKey(normalizedKey)) {
    return entries;
  }

  const nextEntries = [...entries];
  const existingIndex = nextEntries.findIndex(
    (entry) => entry.key.trim() === normalizedKey
  );
  const normalizedValue =
    typeof value === "string" || typeof value === "number" || typeof value === "boolean"
      ? value
      : JSON.stringify(value);

  if (existingIndex >= 0) {
    const existingEntry = nextEntries[existingIndex];
    if (existingEntry == null) {
      return nextEntries;
    }
    nextEntries[existingIndex] = {
      key: existingEntry.key,
      label: existingEntry.label,
      type: existingEntry.type,
      ...(existingEntry.options == null ? {} : { options: existingEntry.options }),
      value: normalizeTypedAttributeValue(existingEntry.type, normalizedValue),
    };
    return nextEntries;
  }

  const rootKey = normalizedKey.split(".")[0] ?? normalizedKey;
  if (SCRIPT_EDITOR_PERSON_ATTRIBUTE_EXCLUDED_ROOT_KEYS.has(rootKey)) {
    return nextEntries;
  }

  const inferredType = inferScriptEditorPersonAttributeType(normalizedKey, value);
  nextEntries.push({
    key: normalizedKey,
    label: getScriptEditorPersonAttributeLabel(normalizedKey),
    type: inferredType,
    value: normalizeTypedAttributeValue(inferredType, normalizedValue),
  });
  return nextEntries;
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
  if (value == null) {
    return;
  }

  if (Array.isArray(value)) {
    entries.push({
      key: keyPath,
      label: getScriptEditorPersonAttributeLabel(keyPath),
      type: "json",
      value: JSON.stringify(value),
    });
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
  const attributeGroups = normalizeScriptEditorPersonAttributeGroups(
    person.attributeGroups
  );
  const nextPerson = {
    ...person,
    attributeGroups,
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

  (nextPerson as Record<string, unknown>).stats = normalizeCharacterStats(
    (nextPerson as Record<string, unknown>).stats
  );
  (nextPerson as Record<string, unknown>).skills = normalizeCharacterSkills(
    (nextPerson as Record<string, unknown>).skills
  );

  return nextPerson;
}

function parseScriptEditorPersonAttributeValue(
  keyPath: string,
  value: string | number | boolean | undefined,
  previousValue: unknown
): string | number | boolean | Record<string, unknown> | unknown[] | null | undefined {
  const normalizedValue = String(value ?? "").trim();

  if (Array.isArray(previousValue)) {
    return parseScriptEditorPersonStructuredAttributeValue(
      normalizedValue,
      Array.isArray
    );
  }

  if (isScriptEditorPersonStructuredRecord(previousValue)) {
    return parseScriptEditorPersonStructuredAttributeValue(
      normalizedValue,
      isScriptEditorPersonStructuredRecord
    );
  }

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

  if (
    typeof previousValue === "boolean" ||
    typeof value === "boolean" ||
    isScriptEditorPersonBooleanAttribute(keyPath)
  ) {
    if (typeof value === "boolean") {
      return value;
    }
    if (normalizedValue === "true") {
      return true;
    }
    if (normalizedValue === "false") {
      return false;
    }
    return undefined;
  }

  if (previousValue === null && normalizedValue.length === 0) {
    return null;
  }

  return value;
}

function parseScriptEditorPersonStructuredAttributeValue<T>(
  normalizedValue: string,
  validator: (value: unknown) => value is T
): T | undefined | string {
  if (normalizedValue.length === 0) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(normalizedValue) as unknown;
    return validator(parsed) ? parsed : normalizedValue;
  } catch {
    return normalizedValue;
  }
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

function isScriptEditorPersonBooleanAttribute(keyPath: string): boolean {
  return SCRIPT_EDITOR_PERSON_BOOLEAN_ATTRIBUTE_KEYS.has(keyPath);
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
      (entry) => !isScriptEditorPersonManagedAttributeKey(entry.key.trim())
    );
}

function isScriptEditorPersonManagedAttributeKey(keyPath: string): boolean {
  const normalizedKey = keyPath.trim();
  if (normalizedKey.length === 0) {
    return false;
  }

  if (SCRIPT_EDITOR_PERSON_FIXED_ATTRIBUTE_KEYS.has(normalizedKey)) {
    return true;
  }

  if (SCRIPT_EDITOR_PERSON_MANAGED_ATTRIBUTE_KEYS.has(normalizedKey)) {
    return true;
  }

  return false;
}

function createScriptEditorPersonCustomAttributeKey(
  entries: ScriptEditorTypedAttributeRecord[],
  preserveIndex?: number
): string {
  const existingKeys = new Set(
    entries
      .filter((_, index) => index !== preserveIndex)
      .map((entry) => entry.key.trim())
      .filter((key) => key.length > 0)
  );
  let suffix = entries.length + 1;
  let candidate = `customAttribute${suffix}`;

  while (existingKeys.has(candidate)) {
    suffix += 1;
    candidate = `customAttribute${suffix}`;
  }

  return candidate;
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
    value === "json" ||
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
  if (type === "json") {
    return readString(value, "");
  }
  return readString(value, "");
}

function inferScriptEditorPersonAttributeType(
  keyPath: string,
  value: unknown
): ScriptEditorTypedAttributeType {
  if (SCRIPT_EDITOR_PERSON_JSON_ATTRIBUTE_KEYS.has(keyPath)) {
    return "json";
  }
  if (Array.isArray(value) || isScriptEditorPersonStructuredRecord(value)) {
    return "json";
  }
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

function normalizeScriptEditorPersonAttributeGroups(
  value: unknown
): ScriptEditorPersonAttributeGroup[] {
  if (!Array.isArray(value) || value.length === 0) {
    return createDefaultScriptEditorPersonAttributeGroups();
  }

  const groups = value
    .filter(
      (entry): entry is Record<string, unknown> =>
        entry != null && typeof entry === "object" && !Array.isArray(entry)
    )
    .map((entry, index) => normalizeScriptEditorPersonAttributeGroup(entry, index))
    .filter((entry) => entry.items.length > 0);

  return groups.length > 0 ? groups : createDefaultScriptEditorPersonAttributeGroups();
}

function normalizeScriptEditorPersonAttributeGroup(
  value: Record<string, unknown>,
  index: number
): ScriptEditorPersonAttributeGroup {
  const presentation = normalizeScriptEditorPersonAttributeGroupPresentation(
    value.presentation
  );
  const fallbackGroup = SCRIPT_EDITOR_PERSON_DEFAULT_ATTRIBUTE_GROUPS[index] ??
    SCRIPT_EDITOR_PERSON_DEFAULT_ATTRIBUTE_GROUPS[0];
  const items = Array.isArray(value.items)
    ? value.items
        .filter(
          (entry): entry is Record<string, unknown> =>
            entry != null && typeof entry === "object" && !Array.isArray(entry)
        )
        .map((entry) => normalizeScriptEditorPersonAttributeGroupItem(entry))
        .filter((entry) => entry.fieldKey.length > 0)
    : [];

  return {
    id: readString(value.id, fallbackGroup.id),
    title: readString(value.title, fallbackGroup.title),
    presentation,
    items:
      items.length > 0
        ? items
        : fallbackGroup.items.map((entry) => ({ ...entry })),
  };
}

function normalizeScriptEditorPersonAttributeGroupPresentation(
  value: unknown
): ScriptEditorPersonAttributeGroup["presentation"] {
  return value === "basic-info" ||
    value === "ability-info" ||
    value === "skill-info" ||
    value === "list"
    ? value
    : "list";
}

function normalizeScriptEditorPersonAttributeGroupItem(
  value: Record<string, unknown>
): ScriptEditorPersonAttributeGroupItem {
  const labelOverride = readString(value.labelOverride, "");
  return {
    fieldKey: readString(value.fieldKey, ""),
    ...(labelOverride.length === 0 ? {} : { labelOverride }),
  };
}

function createDefaultScriptEditorPersonAttributeGroups(): ScriptEditorPersonAttributeGroup[] {
  return SCRIPT_EDITOR_PERSON_DEFAULT_ATTRIBUTE_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    presentation: group.presentation,
    items: group.items.map((item) => ({ ...item })),
  }));
}

function resolveScriptEditorPersonPortraitSelection(
  value: Record<string, unknown>,
  options: ScriptEditorPersonNormalizeOptions
): {
  portraitId: string;
  portraitVariantId: string;
} {
  const portraitId = readString(value.portraitId, "");
  const portraitVariantId = readString(value.portraitVariantId, "");
  if (portraitVariantId.length === 0) {
    return {
      portraitId,
      portraitVariantId: "",
    };
  }

  const inlineVariants = Array.isArray(value.portraitVariants)
    ? value.portraitVariants.filter(
        (entry): entry is Record<string, unknown> =>
          entry != null && typeof entry === "object" && !Array.isArray(entry)
      )
    : [];
  const availableVariants =
    inlineVariants.length > 0 ? inlineVariants : (options.portraitVariants ?? []);
  const matchedVariant = availableVariants.find(
    (entry) => readString(entry.id, "") === portraitVariantId
  );
  const resolvedPortraitId =
    matchedVariant == null ? "" : readString(matchedVariant.portraitId, "");

  return {
    portraitId: resolvedPortraitId.length > 0 ? resolvedPortraitId : portraitId,
    portraitVariantId: resolvedPortraitId.length > 0 ? "" : portraitVariantId,
  };
}

function isScriptEditorPersonStructuredRecord(
  value: unknown
): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
